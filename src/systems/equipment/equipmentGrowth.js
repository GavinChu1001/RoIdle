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

const RARITY_ORDER = Object.freeze(['normal', 'fine', 'rare', 'epic', 'ancient', 'legend', 'darkGold', 'mythic']);

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
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

export function usesProgressionGrowth(template = {}, context = {}) {
  return template.source === 'progression_drop' ||
    Boolean(template.series || template.growthTier || template.upgradePathId) ||
    Boolean(context.series || context.growthTier || context.upgradePathId);
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
    return finite(tier.scale, 1) * finite(quality, 1);
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
    const scaled = value * statScale;
    item[key] = Math.abs(scaled) < 1 ? Number(scaled.toFixed(3)) : Math.round(scaled);
  });
  item.templateBaseStats = { ...(template.baseStats || {}) };
  item.quality = Math.round(finite(quality, 1) * 100);
  item.growthModel = EQUIPMENT_GROWTH_MODEL.PROGRESSION_V2;
  return item;
}

export function applyRarityUpgradeRewards(item = {}, targetRarity = item.rarity, runtime = {}) {
  const targetRank = rarityRank(targetRarity);
  item.rarityRewardHistory = Array.isArray(item.rarityRewardHistory) ? item.rarityRewardHistory : [];
  const applied = new Set(item.rarityRewardHistory);
  const applyOnce = (rarity, fn) => {
    if (targetRank < rarityRank(rarity) || applied.has(rarity)) return;
    if (fn()) applied.add(rarity);
  };
  const applyPerkReward = (rarity) => {
    if (item.rarityPerk?.id === rarity) return true;
    if (item.rarityPerk || !runtime.applyRarityPerk) return false;
    runtime.applyRarityPerk(item, { id: rarity }, item);
    return item.rarityPerk?.id === rarity;
  };

  applyOnce('rare', () => {
    if (item.randomStats) return true;
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

  item.rarityRewardHistory = [...applied];
  return item;
}
