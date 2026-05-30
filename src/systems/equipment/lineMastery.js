import {
  getEquipmentLineMaterials,
  getEquipmentSeriesConfig,
  normalizeEquipmentSeries,
} from './itemProgression.js';

export const LINE_MASTERY_MAX_LEVEL = 20;

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function entryLevel(entry) {
  return typeof entry === 'object' && entry !== null ? entry.level : entry;
}

function clampLevel(level) {
  return Math.max(0, Math.min(LINE_MASTERY_MAX_LEVEL, Math.floor(finite(level, 0))));
}

function materialKindForNextLevel(nextLevel) {
  if (nextLevel <= 5) return 'basic';
  if (nextLevel <= 10) return 'advanced';
  return 'core';
}

function materialAmountForNextLevel(nextLevel) {
  if (nextLevel <= 5) return 4 + nextLevel * 2;
  if (nextLevel <= 10) return 1 + Math.ceil((nextLevel - 5) / 2);
  if (nextLevel <= 15) return 1 + Math.floor((nextLevel - 11) / 2);
  return 2 + Math.floor((nextLevel - 16) / 2);
}

function masteryState(state = {}) {
  state.equipmentLineMastery = state.equipmentLineMastery && typeof state.equipmentLineMastery === 'object'
    ? state.equipmentLineMastery
    : {};
  return state.equipmentLineMastery;
}

export function normalizeLineMasteryState(input = {}) {
  const result = {};
  Object.entries(input || {}).forEach(([series, entry]) => {
    const id = normalizeEquipmentSeries(series, '');
    if (!id || id === 'oldWorld') return;
    const level = clampLevel(entryLevel(entry));
    if (level > 0) result[id] = { level };
  });
  return result;
}

export function getLineMasteryLevel(state = {}, series = '') {
  const id = normalizeEquipmentSeries(series, '');
  if (!id || id === 'oldWorld') return 0;
  return clampLevel(entryLevel(state.equipmentLineMastery?.[id]));
}

export function getLineMasteryCost(series = '', currentLevel = 0) {
  const id = normalizeEquipmentSeries(series, '');
  if (!id || id === 'oldWorld') return null;
  const level = clampLevel(currentLevel);
  if (level >= LINE_MASTERY_MAX_LEVEL) return null;

  const nextLevel = level + 1;
  const materials = getEquipmentLineMaterials(id);
  const materialKind = materialKindForNextLevel(nextLevel);
  const material = materials[materialKind];
  if (!material?.id) return null;

  const costMaterials = { [material.id]: materialAmountForNextLevel(nextLevel) };
  if (nextLevel >= 16) costMaterials.abyssCore = 1 + Math.floor((nextLevel - 16) / 2);

  return {
    series: id,
    nextLevel,
    materials: costMaterials,
    gold: Math.round(1200 * Math.pow(1.42, nextLevel - 1)),
    materialKind,
  };
}

export function getLineMasteryBonus(series = '', level = 0) {
  const id = normalizeEquipmentSeries(series, '');
  const safeLevel = clampLevel(level);
  if (!id || id === 'oldWorld' || safeLevel <= 0) {
    return { statMultiplier: 1, bonusStats: {}, abyssAffixMultiplier: 1 };
  }

  const bonusStats = {};
  if (safeLevel >= 5) bonusStats.bossDamageBonus = 0.005;
  if (safeLevel >= 10) bonusStats.skillDamageBonus = 0.01;
  if (safeLevel >= 15) bonusStats.abyssDamageBonus = 0.015;
  if (safeLevel >= 20) bonusStats.highTierFind = 0.01;

  return {
    series: id,
    label: getEquipmentSeriesConfig(id).label,
    level: safeLevel,
    statMultiplier: Number((1 + safeLevel * 0.006).toFixed(3)),
    bonusStats,
    abyssAffixMultiplier: Number((1 + Math.floor(safeLevel / 5) * 0.025).toFixed(3)),
  };
}

function hasCost(state = {}, cost = null) {
  if (!cost) return false;
  if (finite(state.gold) < finite(cost.gold)) return false;
  return Object.entries(cost.materials || {}).every(([id, amount]) => finite(state.materials?.[id]) >= finite(amount));
}

function consumeCost(state = {}, cost = null) {
  if (!cost) return;
  state.gold = Math.max(0, finite(state.gold) - finite(cost.gold));
  state.materials = state.materials || {};
  Object.entries(cost.materials || {}).forEach(([id, amount]) => {
    state.materials[id] = Math.max(0, finite(state.materials[id]) - finite(amount));
  });
}

export function canUpgradeLineMastery(series = '', context = {}) {
  const state = context.getState?.() || {};
  const level = getLineMasteryLevel(state, series);
  return hasCost(state, getLineMasteryCost(series, level));
}

export function upgradeLineMastery(series = '', context = {}) {
  const state = context.getState?.() || {};
  const id = normalizeEquipmentSeries(series, '');
  const currentLevel = getLineMasteryLevel(state, id);
  const cost = getLineMasteryCost(id, currentLevel);
  if (!cost) return { ok: false, reason: 'max-level' };
  if (!hasCost(state, cost)) return { ok: false, reason: 'not-affordable', cost };

  consumeCost(state, cost);
  masteryState(state)[id] = { level: cost.nextLevel };
  context.showToast?.(`${getEquipmentSeriesConfig(id).label} \u8def\u7ebf\u7cbe\u901a\u63d0\u5347\u5230 Lv.${cost.nextLevel}`);
  context.renderAll?.();
  context.save?.();
  return { ok: true, series: id, level: cost.nextLevel, cost };
}
