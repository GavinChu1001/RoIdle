import { getEquipmentUpgradeCost } from './itemProgression.js';
import {
  EQUIPMENT_GROWTH_MODEL,
  GROWTH_STAT_KEYS,
  rebuildGrowthStatsFromTemplate,
  rollProgressionQuality,
} from './equipmentGrowth.js';

const RARITY_ORDER = ['normal', 'fine', 'rare', 'epic', 'ancient', 'legend', 'darkGold', 'mythic'];
const SCALE_KEYS = [
  'atk', 'matk', 'def', 'hp', 'hpRegen', 'str', 'agi', 'vit', 'int', 'dex', 'luk', 'luck',
  'aspd', 'crit', 'drop', 'gold', 'dodgeRate', 'atkPct', 'matkPct', 'hpPct', 'defPct',
  'attackSpeedPct', 'critDamageBonus', 'skillDamageBonus', 'bossDamageBonus',
  'finalDamageBonus', 'rareDropBonus', 'damageReductionPct', 'lifeSteal',
  'blockRate', 'hpRegenPct', 'ignoreDefense', 'expBonus', 'equipmentDrop',
  'cardDrop', 'materialQuantityBonus', 'combatPaceBonus', 'abyssDamageBonus',
  'abyssDamageReduction', 'highTierFind', 'echoChance', 'thornVitMultiplier',
];

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function hasCost(state = {}, cost = {}) {
  if (finite(state.gold) < finite(cost.gold)) return false;
  return Object.entries(cost.materials || {}).every(([id, amount]) => finite(state.materials?.[id]) >= finite(amount));
}

function consumeCost(state = {}, cost = {}) {
  state.gold = finite(state.gold) - finite(cost.gold);
  state.materials = state.materials || {};
  Object.entries(cost.materials || {}).forEach(([id, amount]) => {
    state.materials[id] = Math.max(0, finite(state.materials[id]) - finite(amount));
  });
}

function upgradedRarity(current, target) {
  const currentRank = RARITY_ORDER.indexOf(current);
  const targetRank = RARITY_ORDER.indexOf(target);
  if (targetRank < 0) return current || 'normal';
  if (currentRank < 0) return target;
  return RARITY_ORDER[Math.max(currentRank, targetRank)] || target;
}

function scaleItemStats(item, multiplier) {
  const factor = finite(multiplier, 1);
  if (factor <= 1) return;
  SCALE_KEYS.forEach((key) => {
    if (!Number.isFinite(Number(item[key])) || Number(item[key]) === 0) return;
    const value = Number(item[key]);
    item[key] = Math.abs(value) < 1 ? Number((value * factor).toFixed(3)) : Math.round(value * factor);
  });
}

function snapshotGrowthStats(item = {}) {
  const snapshot = {};
  GROWTH_STAT_KEYS.forEach((key) => {
    const value = Number(item[key]);
    if (Number.isFinite(value) && value !== 0) snapshot[key] = value;
  });
  return snapshot;
}

function applyUpgradeStatFloors(item = {}, before = {}, multiplier = 1) {
  const factor = Math.max(1, finite(multiplier, 1));
  Object.entries(before).forEach(([key, value]) => {
    if (value <= 0) return;
    const floor = Math.abs(value) < 1 ? Number((value * factor).toFixed(3)) : Math.round(value * factor);
    const current = Number(item[key] || 0);
    if (!Number.isFinite(current) || current < floor) item[key] = floor;
  });
}

export function canUpgradeEquipmentProgression(item, context = {}) {
  const state = context.getState?.() || {};
  const cost = getEquipmentUpgradeCost(item);
  return Boolean(cost && hasCost(state, cost));
}

export function upgradeEquipmentProgression(itemId, context = {}) {
  const state = context.getState?.() || {};
  const item = (state.inventory || []).find((entry) => entry.id === itemId || entry.instanceId === itemId);
  if (!item) {
    context.showToast?.('未找到装备');
    return { ok: false, reason: 'missing-item' };
  }
  const cost = getEquipmentUpgradeCost(item);
  if (!cost) {
    context.showToast?.('这件装备已到当前成长线顶点');
    return { ok: false, reason: 'no-upgrade' };
  }
  if (!hasCost(state, cost)) {
    context.showToast?.('装备进阶材料不足');
    return { ok: false, reason: 'not-affordable', cost };
  }

  consumeCost(state, cost);
  const previousGrowthStats = snapshotGrowthStats(item);
  const next = cost.next;
  item.series = next.series;
  item.upgradePathId = next.upgradePathId;
  item.growthTier = next.growthTier;
  item.upgradeStage = next.upgradeStage;
  item.grade = next.grade;
  item.progressionLabel = next.label;
  item.rarity = upgradedRarity(item.rarity || item.tier, next.rarity);
  item.tier = item.rarity;
  const baseLevel = Math.max(finite(item.level, 1), finite(item.dropLevel, 1));
  item.level = Math.round(baseLevel + finite(next.levelBonus));
  item.dropLevel = Math.max(finite(item.dropLevel, 1), item.level);
  const templateId = `prog_${next.series}_${next.grade}_${item.archetype || 'general'}_${item.slot || item.equipSlot || 'weapon'}`;
  const targetTemplate = context.getProgressionEquipmentTemplate?.(templateId);
  const tier = (context.getEquipmentTiers?.() || []).find((entry) => entry.id === item.rarity) || { id: item.rarity, scale: 1, rolls: [1, 1] };
  const quality = rollProgressionQuality(tier, context.randomFloat);
  if (targetTemplate) {
    rebuildGrowthStatsFromTemplate(item, targetTemplate, tier, quality);
  } else {
    scaleItemStats(item, next.statMultiplier);
    item.growthModel = EQUIPMENT_GROWTH_MODEL.PROGRESSION_V2;
  }
  applyUpgradeStatFloors(item, previousGrowthStats, next.statMultiplier);
  context.applyRarityUpgradeRewards?.(item, item.rarity);
  context.recordEquipmentResearch?.(next.series, 45 + next.upgradeStage * 20);
  context.recordEquipmentCollection?.(item, { source: 'upgrade' });

  context.addLog?.(`${item.name || '装备'} 进阶为 ${next.label}。`);
  context.showToast?.(`进阶成功：${next.label}`);
  context.renderAll?.();
  context.save?.();
  return { ok: true, item, cost, next };
}
