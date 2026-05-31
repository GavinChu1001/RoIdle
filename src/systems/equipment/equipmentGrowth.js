export const EQUIPMENT_GROWTH_MODEL = Object.freeze({
  LEGACY_LEVEL: 'legacy-level',
  PROGRESSION_V2: 'progression-v2',
});

export const GROWTH_STAT_KEYS = Object.freeze([
  'atk', 'matk', 'def', 'hp', 'hpRegen',
  'str', 'agi', 'vit', 'int', 'dex', 'luk', 'luck',
  'aspd', 'crit', 'critRatePct', 'drop', 'gold', 'dodgeRate', 'dodgeRatePct',
  'atkPct', 'matkPct', 'hpPct', 'defPct',
  'attackSpeedPct', 'critDamageBonus', 'skillDamageBonus',
  'bossDamageBonus', 'monsterDamageBonus', 'eliteDamageBonus', 'finalDamageBonus',
  'normalAttackDamageBonus', 'higherLevelDamageBonus', 'physicalFinalDamageBonus',
  'rareDropBonus', 'offlineEfficiencyBonus',
  'damageReductionPct', 'bossDamageReduction', 'magicDamageReduction', 'skillDamageReduction',
  'lifeSteal', 'blockRate', 'hpRegenPct',
  'ignoreDefense', 'statusResist', 'expBonus', 'baseExpBonus', 'jobExpBonus', 'equipmentDrop', 'cardDrop',
  'materialQuantityBonus', 'combatPaceBonus', 'abyssDamageBonus',
  'abyssBossDamageBonus', 'abyssSkillDamageBonus', 'abyssDamageReduction',
  'abyssPower', 'abyssResist', 'abyssMaterialDropBonus', 'abyssExecuteDamageBonus',
  'highTierFind', 'mythicWeightBonus', 'mythicEssenceDropBonus', 'rebirthPrestigeWeightBonus',
  'echoChance', 'mutationMaterialDoubleChance', 'thornVitMultiplier',
  'skillCooldownPenalty', 'skillHitHealPct',
  'splashTargets', 'splashDamagePct',
  'fireBurstChance', 'fireBurstAtkPct',
  'meteorCounterChance', 'meteorCounterMatkPct',
  'setPowerBonus',
]);

const QUALITY_SCALED_GROWTH_STATS = Object.freeze([
  'atk', 'matk', 'def', 'hp', 'hpRegen',
  'str', 'agi', 'vit', 'int', 'dex', 'luk', 'luck',
]);

const RARITY_ORDER = Object.freeze(['normal', 'fine', 'rare', 'epic', 'ancient', 'legend', 'darkGold', 'mythic']);

export const PROGRESSION_RARITY_QUALITY_RANGES = Object.freeze({
  normal: Object.freeze([0.96, 1.04]),
  fine: Object.freeze([0.98, 1.06]),
  rare: Object.freeze([1.00, 1.08]),
  epic: Object.freeze([1.03, 1.12]),
  ancient: Object.freeze([1.06, 1.15]),
  legend: Object.freeze([1.08, 1.18]),
  darkGold: Object.freeze([1.10, 1.22]),
  mythic: Object.freeze([1.14, 1.28]),
});

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function getProgressionRarityQualityRange(rarity = 'normal') {
  return [...(PROGRESSION_RARITY_QUALITY_RANGES[rarity] || PROGRESSION_RARITY_QUALITY_RANGES.normal)];
}

export function rollProgressionQuality(tier = {}, randomFloat = null) {
  const [min, max] = getProgressionRarityQualityRange(tier.id || tier.rarity || 'normal');
  const rolled = typeof randomFloat === 'function'
    ? randomFloat(min, max)
    : min + Math.random() * (max - min);
  return Number(finite(rolled, min).toFixed(3));
}

function rarityRank(rarity) {
  const rank = RARITY_ORDER.indexOf(rarity || 'normal');
  return rank >= 0 ? rank : 0;
}

function copyNumericStats(item = {}) {
  const stats = {};
  GROWTH_STAT_KEYS.forEach((key) => {
    if (Number.isFinite(Number(item[key]))) stats[key] = Number(item[key]);
  });
  return stats;
}

function addStoredBonus(item = {}, bonus = {}) {
  const stat = bonus?.stat;
  const appliedValue = Number(bonus?.appliedValue);
  const value = Number.isFinite(appliedValue) ? appliedValue : Number(bonus?.value);
  if (!stat || !GROWTH_STAT_KEYS.includes(stat) || !Number.isFinite(value)) return false;
  const rawNext = finite(item[stat], 0) + value;
  const cap = Number(bonus?.cap);
  const next = Number.isFinite(appliedValue) || !Number.isFinite(cap) ? rawNext : Math.min(cap, rawNext);
  item[stat] = Number(next.toFixed(3));
  return true;
}

function bonusIdentity(bonus = {}) {
  if (!bonus || typeof bonus !== 'object') return '';
  if (bonus.id) return `id:${bonus.id}`;
  return `${bonus.type || ''}:${bonus.name || ''}:${bonus.stat || ''}:${Number(bonus.value)}`;
}

function replayStoredBonuses(item = {}) {
  (Array.isArray(item.affixDetails) ? item.affixDetails : []).forEach((bonus) => {
    addStoredBonus(item, bonus);
  });
  const seen = new Set();
  const replayPerk = (perk) => {
    if (!perk || typeof perk !== 'object') return;
    const key = bonusIdentity(perk);
    if (seen.has(key)) return;
    seen.add(key);
    addStoredBonus(item, perk);
  };
  if (item.rarityPerks && typeof item.rarityPerks === 'object') {
    Object.values(item.rarityPerks).forEach(replayPerk);
  }
  if (item.rarityPerk) replayPerk(item.rarityPerk);
}

function hasRolledRandomStats(randomStats) {
  if (!randomStats || typeof randomStats !== 'object' || Array.isArray(randomStats)) return false;
  return Object.values(randomStats).some((value) => {
    const number = Number(value);
    return Number.isFinite(number) && number !== 0;
  });
}

function inferRarityPerkKey(perk = {}) {
  if (RARITY_ORDER.includes(perk.id)) return perk.id;
  return {
    specialAffix: 'epic',
    jobSkill: 'legend',
    setBoost: 'darkGold',
    mythicPassive: 'mythic',
  }[perk.type] || '';
}

function ensureRarityPerkMap(item = {}) {
  item.rarityPerks = item.rarityPerks && typeof item.rarityPerks === 'object' && !Array.isArray(item.rarityPerks) ? item.rarityPerks : {};
  const rarity = inferRarityPerkKey(item.rarityPerk || {});
  if (rarity && !item.rarityPerks[rarity]) {
    item.rarityPerks[rarity] = { id: rarity, ...item.rarityPerk };
  }
  return item.rarityPerks;
}

function highestStoredPerk(item = {}, targetRank = RARITY_ORDER.length - 1) {
  const perks = item.rarityPerks && typeof item.rarityPerks === 'object' && !Array.isArray(item.rarityPerks) ? item.rarityPerks : {};
  for (let index = Math.min(targetRank, RARITY_ORDER.length - 1); index >= 0; index -= 1) {
    const perk = perks[RARITY_ORDER[index]];
    if (perk) return perk;
  }
  return item.rarityPerk || null;
}

export function usesProgressionGrowth(template = {}, context = {}) {
  const source = template.source || context.source || '';
  const series = template.series || context.series || '';
  const growthTier = template.growthTier || context.growthTier || '';
  const upgradePathId = template.upgradePathId || context.upgradePathId || '';
  return source === 'progression_drop' ||
    Boolean(series && series !== 'oldWorld') ||
    Boolean(growthTier && growthTier !== 'T1') ||
    Boolean(upgradePathId && upgradePathId !== 'oldWorld');
}

export function growthModelFor(template = {}, context = {}) {
  return usesProgressionGrowth(template, context)
    ? EQUIPMENT_GROWTH_MODEL.PROGRESSION_V2
    : EQUIPMENT_GROWTH_MODEL.LEGACY_LEVEL;
}

export function snapshotLegacyPower(item = {}) {
  return {
    model: EQUIPMENT_GROWTH_MODEL.LEGACY_LEVEL,
    level: Math.max(1, Math.round(finite(item.level || item.dropLevel, 1))),
    dropLevel: Math.max(1, Math.round(finite(item.dropLevel || item.level, 1))),
    rarity: item.rarity || item.tier || 'normal',
    stats: copyNumericStats(item),
  };
}

export function calculateCreationStatScale({ template = {}, context = {}, tier = {}, itemTier = {}, quality = 1, level = 1, slotGrowth = 0 } = {}) {
  if (usesProgressionGrowth(template, context)) {
    return finite(quality, 1);
  }
  return finite(tier.scale, 1) * finite(itemTier.scale, 1) * finite(quality, 1) * (1 + finite(level, 1) * finite(slotGrowth));
}

export function clearGrowthStats(item = {}) {
  GROWTH_STAT_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(item, key)) item[key] = 0;
  });
  return item;
}

export function rebuildGrowthStatsFromTemplate(item = {}, template = {}, tier = {}, quality = 1) {
  clearGrowthStats(item);
  const statScale = finite(tier.scale, 1) * finite(quality, 1);
  GROWTH_STAT_KEYS.forEach((key) => {
    const value = finite(template[key], 0);
    if (!value) return;
    const scaled = value * (QUALITY_SCALED_GROWTH_STATS.includes(key) ? statScale : 1);
    item[key] = Math.abs(scaled) < 1 ? Number(scaled.toFixed(3)) : Math.round(scaled);
  });
  replayStoredBonuses(item);
  item.templateBaseStats = { ...(template.baseStats || {}) };
  item.quality = Math.round(finite(quality, 1) * 100);
  item.growthModel = EQUIPMENT_GROWTH_MODEL.PROGRESSION_V2;
  return item;
}

export function applyRarityUpgradeRewards(item = {}, targetRarity = item.rarity, runtime = {}) {
  const targetRank = rarityRank(targetRarity);
  const rarityPerks = ensureRarityPerkMap(item);
  item.rarityRewardHistory = Array.isArray(item.rarityRewardHistory) ? item.rarityRewardHistory : [];
  const applied = new Set(item.rarityRewardHistory);
  const applyOnce = (rarity, fn) => {
    if (targetRank < rarityRank(rarity) || applied.has(rarity)) return;
    if (fn()) applied.add(rarity);
  };
  const applyPerkReward = (rarity) => {
    if (rarityPerks[rarity]) {
      item.rarityPerk = rarityPerks[rarity];
      return true;
    }
    if (!runtime.applyRarityPerk) return false;
    runtime.applyRarityPerk(item, { id: rarity }, item);
    if (!item.rarityPerk) return false;
    const perk = { id: rarity, ...item.rarityPerk };
    rarityPerks[rarity] = perk;
    item.rarityPerk = perk;
    return true;
  };

  applyOnce('rare', () => {
    if (hasRolledRandomStats(item.randomStats)) return true;
    if (!runtime.rollRandomStats || !runtime.normalizeEquipmentArchetype) return false;
    item.randomStats = runtime.rollRandomStats(targetRarity, runtime.normalizeEquipmentArchetype(item.archetype || 'general'));
    return Boolean(item.randomStats);
  });
  applyOnce('epic', () => {
    return applyPerkReward('epic');
  });
  applyOnce('ancient', () => {
    const current = Array.isArray(item.cardSlots) ? item.cardSlots : [];
    item.cardSlots = current.length ? current : [{ cardId: null }];
    return item.cardSlots.length > 0;
  });
  applyOnce('legend', () => {
    return applyPerkReward('legend');
  });
  applyOnce('darkGold', () => {
    return applyPerkReward('darkGold');
  });
  applyOnce('mythic', () => {
    return applyPerkReward('mythic');
  });

  item.rarityPerk = highestStoredPerk(item, targetRank);
  item.rarityRewardHistory = [...applied];
  return item;
}
