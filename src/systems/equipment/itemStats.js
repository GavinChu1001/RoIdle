import { DEPRECATED_EQUIPMENT_STATS, canonicalEquipmentStat, canonicalizeEquipmentStats } from './statCatalog.js';

const ATTRIBUTE_KEYS = ['str', 'agi', 'vit', 'int', 'dex', 'luk'];
const PERCENT_STATS = new Set([
  'aspd', 'crit', 'critRate', 'drop', 'gold', 'dodgeRate', 'atkPct', 'matkPct', 'hpPct', 'defPct',
  'aspdPct', 'attackSpeedPct', 'critRatePct', 'critDamageBonus', 'skillDamageBonus', 'monsterDamageBonus',
  'bossDamageBonus', 'bossDamageReduction', 'finalDamageBonus', 'physicalFinalDamageBonus', 'eliteDamageBonus',
  'rareDropBonus', 'normalAttackDamageBonus', 'higherLevelDamageBonus', 'abyssDamageBonus', 'abyssBossDamageBonus',
  'abyssDamageReduction', 'abyssPower', 'abyssResist', 'abyssMaterialDropBonus', 'abyssSkillDamageBonus',
  'abyssGoldPct', 'abyssBaseExpPct', 'abyssJobExpPct', 'abyssCardDropBonus', 'abyssItemDropBonus',
  'mythicWeightBonus', 'mythicEssenceDropBonus', 'rebirthPrestigeWeightBonus', 'highTierFind', 'abyssExecuteDamageBonus',
  'setPowerBonus', 'abyssSkillChanceBonus', 'abyssDefenseReduction', 'abyssAttackSpeedPct', 'abyssCritRatePct',
  'abyssMagicDamageBonus', 'abyssAttrPct', 'abyssPowerPct', 'abyssCritDamageBonus', 'abyssEliteDamageBonus',
  'abyssDexPct', 'abyssIgnoreDefense', 'abyssBossDamageReduction', 'goldBonus', 'expBonus', 'damageReduction',
  'lifeSteal', 'blockRate', 'ignoreDefense', 'damageReductionPct', 'dodgeRatePct', 'hpRegenPct',
  'baseExpBonus', 'jobExpBonus', 'equipmentDrop', 'cardDrop', 'materialQuantityBonus',
  'combatPaceBonus', 'offlineEfficiencyBonus', 'statusResist', 'echoChance',
  'magicDamageReduction', 'skillDamageReduction', 'skillCooldownPenalty', 'skillHitHealPct', 'splashDamagePct',
  'fireBurstChance', 'fireBurstAtkPct', 'meteorCounterChance', 'meteorCounterMatkPct',
  'mutationMaterialDoubleChance', 'strPct', 'agiPct', 'vitPct', 'intPct', 'dexPct', 'lukPct', 'lowHpAtkPct', 'dps',
]);
const HIGH_VALUE_STATS = new Set([
  'finalDamageBonus', 'bossDamageBonus', 'eliteDamageBonus', 'abyssDamageBonus',
  'abyssDamageReduction', 'rareDropBonus', 'drop', 'gold', 'goldBonus',
  'expBonus', 'equipmentDrop', 'cardDrop', 'materialQuantityBonus', 'highTierFind',
  'echoChance',
]);
const FLAT_STATS = new Set(['atk', 'matk', 'def', 'hp', 'hpRegen', 'str', 'agi', 'vit', 'int', 'dex', 'luk', 'luck']);
const LINE_MASTERY_BASE_STATS = new Set(['atk', 'matk', 'def', 'hp', 'hpRegen', 'str', 'agi', 'vit', 'int', 'dex', 'luk']);

let runtimeContext = Object.freeze({
  getMechanicAffixEffects: () => ({}),
  computeCardSocketBonuses: () => ({}),
  getLineMasteryBonus: () => ({ statMultiplier: 1, bonusStats: {}, abyssAffixMultiplier: 1 }),
  getLineMasteryGlobalBonus: () => ({ statMultiplier: 1, bonusStats: {} }),
  getAbyssTemperingBonus: () => ({}),
  getEnhanceMilestoneLevels: () => [],
  getEnhanceMilestoneBonuses: () => ({}),
  getEnhancePassiveDb: () => ({}),
});

export function configureItemStatsContext(context = {}) {
  runtimeContext = Object.freeze({
    getMechanicAffixEffects: typeof context.getMechanicAffixEffects === 'function' ? context.getMechanicAffixEffects : () => ({}),
    computeCardSocketBonuses: typeof context.computeCardSocketBonuses === 'function' ? context.computeCardSocketBonuses : () => ({}),
    getLineMasteryBonus: typeof context.getLineMasteryBonus === 'function'
      ? context.getLineMasteryBonus
      : () => ({ statMultiplier: 1, bonusStats: {}, abyssAffixMultiplier: 1 }),
    getLineMasteryGlobalBonus: typeof context.getLineMasteryGlobalBonus === 'function'
      ? context.getLineMasteryGlobalBonus
      : () => ({ statMultiplier: 1, bonusStats: {} }),
    getAbyssTemperingBonus: typeof context.getAbyssTemperingBonus === 'function' ? context.getAbyssTemperingBonus : () => ({}),
    getEnhanceMilestoneLevels: typeof context.getEnhanceMilestoneLevels === 'function' ? context.getEnhanceMilestoneLevels : () => [],
    getEnhanceMilestoneBonuses: typeof context.getEnhanceMilestoneBonuses === 'function' ? context.getEnhanceMilestoneBonuses : () => ({}),
    getEnhancePassiveDb: typeof context.getEnhancePassiveDb === 'function' ? context.getEnhancePassiveDb : () => ({}),
  });
}

function number(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function statIsPercent(stat) {
  return PERCENT_STATS.has(stat);
}

function normalizeRandomStats(stats = {}) {
  return { ...Object.fromEntries(ATTRIBUTE_KEYS.map((stat) => [stat, 0])), ...(stats || {}) };
}

function normalizeEquipmentSlot(slot) {
  return { body: 'armor', bodyArmor: 'armor', headTop: 'headgear', accessory: 'trinket' }[slot] || slot;
}

function equipmentSlot(item = {}) {
  return item.equipSlot || normalizeEquipmentSlot(item.slot || 'trinket');
}

function enhanceLevel(item = {}) {
  return Math.max(0, number(item.enhanceLevel));
}

function enhanceMainStatFactor(item = {}, stat = '') {
  const level = enhanceLevel(item);
  if (!level) return 1;
  const slot = equipmentSlot(item);
  if (slot === 'weapon' && (stat === 'atk' || stat === 'matk')) return 1 + level * 0.03;
  if (slot === 'armor' && stat === 'def') return 1 + level * 0.025;
  if (slot === 'armor' && stat === 'hp') return 1 + level * 0.015;
  if (slot === 'headgear' && stat === 'hp') return 1 + level * 0.02;
  if (slot === 'trinket' && ATTRIBUTE_KEYS.includes(stat)) return 1 + level * 0.007;
  return 1;
}

function enhanceFlatStatBonus(item = {}, stat = '') {
  const level = enhanceLevel(item);
  if (!level) return 0;
  return equipmentSlot(item) === 'shoes' && stat === 'attackSpeedPct' ? level * 0.006 : 0;
}

function enhanceMilestoneBonuses(item = {}, context = runtimeContext) {
  const level = enhanceLevel(item);
  if (!level) return {};
  const slot = equipmentSlot(item);
  const levels = context.getEnhanceMilestoneLevels?.() || [];
  const table = context.getEnhanceMilestoneBonuses?.() || {};
  const tier = table[slot] || [];
  const bonuses = {};
  levels.forEach((milestone, index) => {
    if (level < milestone || !tier[index]) return;
    Object.entries(tier[index]).forEach(([stat, value]) => {
      bonuses[stat] = number(bonuses[stat]) + number(value);
    });
  });
  return bonuses;
}

function enhancePassiveBonuses(item = {}, context = runtimeContext) {
  const db = context.getEnhancePassiveDb?.() || {};
  const bonuses = {};
  (Array.isArray(item.specialPassives) ? item.specialPassives : []).forEach((id) => {
    Object.entries(db[id]?.effect || {}).forEach(([stat, value]) => {
      const key = stat === 'lifeStealPct' ? 'lifeSteal' : stat;
      bonuses[key] = number(bonuses[key]) + number(value);
    });
  });
  return bonuses;
}

function refineMultiplier(star) {
  return 1 + Math.max(0, number(star)) * 0.02;
}

function refineGrowthFactorForStat(stat, star = 0) {
  const level = Math.max(0, number(star));
  if (!level) return 1;
  if (FLAT_STATS.has(stat)) return refineMultiplier(level);
  if (HIGH_VALUE_STATS.has(stat)) return 1 + level * 0.006;
  return 1 + level * 0.01;
}

function star15Bonus(item = {}) {
  if (number(item.refine) < 15 || !['rare', 'epic', 'ancient', 'legend', 'darkGold', 'mythic'].includes(item.rarity)) {
    return {};
  }
  const slot = equipmentSlot(item);
  if (slot === 'weapon') return number(item.matk) > number(item.atk) ? { atk: 8, matk: 22, skillDamageBonus: 0.03 } : { atk: 22, matk: 8, skillDamageBonus: 0.03 };
  if (slot === 'armor') return { hp: 20, damageReductionPct: 0.02 };
  if (slot === 'headgear') return { crit: 0.01, allStats: 2 };
  if (slot === 'shoes') return { dodgeRate: 0.01, attackSpeedPct: 0.01 };
  return { critDamageBonus: 0.04, drop: 0.01, gold: 0.01 };
}

function applyLineMasteryBaseMultiplier(stats = {}, multiplier = 1) {
  const valueMultiplier = number(multiplier);
  if (valueMultiplier <= 1) return;
  LINE_MASTERY_BASE_STATS.forEach((key) => {
    const value = number(stats[key]);
    if (!value) return;
    stats[key] = Math.round(Number((value * valueMultiplier).toFixed(6)));
  });
}

export function getEffectiveItemStats(item = {}, includeRandom = true, context = runtimeContext) {
  item = item && typeof item === 'object' ? item : {};
  const multiplier = refineMultiplier(item.refine || 0);
  const empowerMultiplier = 1 + number(item.empower) * 0.04;
  const scaleFlat = (value, stat = '') => Math.round(number(value) * multiplier * empowerMultiplier * enhanceMainStatFactor(item, stat));
  const scalePercent = (value, stat = '') => Number((number(value) * (refineGrowthFactorForStat(stat, item.refine || 0) + number(item.empower) * 0.012) + enhanceFlatStatBonus(item, stat)).toFixed(3));
  const addScaledStat = (target, stat, value, { applyRefine = true } = {}) => {
    const numeric = number(value);
    if (!numeric) return;
    const key = canonicalEquipmentStat(stat);
    if (DEPRECATED_EQUIPMENT_STATS.has(key)) return;
    if (key === 'allStats') {
      ATTRIBUTE_KEYS.forEach((attribute) => addScaledStat(target, attribute, numeric, { applyRefine }));
      return;
    }
    const factor = applyRefine ? refineGrowthFactorForStat(key, item.refine || 0) : 1;
    const decimals = statIsPercent(key) || key.endsWith('Bonus') || key.endsWith('Pct') || key === 'thornVitMultiplier' ? 3 : 0;
    const scaled = decimals ? Number((numeric * factor).toFixed(decimals)) : Math.round(numeric * factor);
    target[key] = Number((number(target[key]) + scaled).toFixed(decimals));
  };
  const stats = {
    atk: scaleFlat(item.atk, 'atk'),
    matk: scaleFlat(item.matk, 'matk'),
    def: scaleFlat(item.def, 'def'),
    hp: scaleFlat(item.hp, 'hp'),
    luck: 0,
    str: scaleFlat(item.str, 'str'),
    agi: scaleFlat(item.agi, 'agi'),
    vit: scaleFlat(item.vit, 'vit'),
    int: scaleFlat(item.int, 'int'),
    dex: scaleFlat(item.dex, 'dex'),
    luk: scaleFlat(item.luk, 'luk') + scaleFlat(item.luck, 'luk'),
    aspd: scalePercent(item.aspd, 'aspd'),
    crit: scalePercent(number(item.crit) + number(item.critRatePct), 'crit'),
    drop: scalePercent(item.drop, 'drop'),
    gold: scalePercent(item.gold, 'gold'),
    hpRegen: scaleFlat(item.hpRegen, 'hpRegen'),
    dodgeRate: scalePercent(number(item.dodgeRate) + number(item.dodgeRatePct), 'dodgeRate'),
    atkPct: scalePercent(item.atkPct, 'atkPct'),
    matkPct: scalePercent(item.matkPct, 'matkPct'),
    hpPct: scalePercent(item.hpPct, 'hpPct'),
    defPct: scalePercent(item.defPct, 'defPct'),
    attackSpeedPct: scalePercent(item.attackSpeedPct, 'attackSpeedPct'),
    critDamageBonus: scalePercent(item.critDamageBonus, 'critDamageBonus'),
    skillDamageBonus: scalePercent(item.skillDamageBonus, 'skillDamageBonus'),
    monsterDamageBonus: scalePercent(item.monsterDamageBonus, 'monsterDamageBonus'),
    bossDamageBonus: scalePercent(item.bossDamageBonus, 'bossDamageBonus'),
    bossDamageReduction: scalePercent(item.bossDamageReduction, 'bossDamageReduction'),
    finalDamageBonus: scalePercent(item.finalDamageBonus, 'finalDamageBonus'),
    eliteDamageBonus: scalePercent(item.eliteDamageBonus, 'eliteDamageBonus'),
    rareDropBonus: scalePercent(item.rareDropBonus, 'rareDropBonus'),
    damageReductionPct: scalePercent(item.damageReductionPct, 'damageReductionPct'),
    lifeSteal: scalePercent(item.lifeSteal, 'lifeSteal'),
    blockRate: scalePercent(item.blockRate, 'blockRate'),
    hpRegenPct: scalePercent(item.hpRegenPct, 'hpRegenPct'),
    ignoreDefense: scalePercent(item.ignoreDefense, 'ignoreDefense'),
    expBonus: scalePercent(number(item.expBonus) + number(item.baseExpBonus) + number(item.jobExpBonus), 'expBonus'),
    equipmentDrop: scalePercent(item.equipmentDrop, 'equipmentDrop'),
    cardDrop: scalePercent(item.cardDrop, 'cardDrop'),
    materialQuantityBonus: scalePercent(number(item.materialQuantityBonus) + number(item.abyssMaterialDropBonus), 'materialQuantityBonus'),
    combatPaceBonus: scalePercent(number(item.combatPaceBonus) + number(item.patrolEfficiency) + number(item.powerPct), 'combatPaceBonus'),
    statusResist: scalePercent(item.statusResist, 'statusResist'),
    echoChance: scalePercent(item.echoChance, 'echoChance'),
    mutationMaterialDoubleChance: scalePercent(item.mutationMaterialDoubleChance, 'mutationMaterialDoubleChance'),
    thornVitMultiplier: Number((number(item.thornVitMultiplier) * refineGrowthFactorForStat('thornVitMultiplier', item.refine || 0)).toFixed(3)),
    abyssDamageBonus: scalePercent(number(item.abyssDamageBonus) + number(item.abyssBossDamageBonus) + number(item.abyssSkillDamageBonus), 'abyssDamageBonus'),
    abyssDamageReduction: scalePercent(item.abyssDamageReduction, 'abyssDamageReduction'),
    highTierFind: scalePercent(number(item.highTierFind) + number(item.mythicWeightBonus) + number(item.mythicEssenceDropBonus) + number(item.rebirthPrestigeWeightBonus), 'highTierFind'),
  };
  Object.entries(enhanceMilestoneBonuses(item, context)).forEach(([stat, value]) => {
    addScaledStat(stats, stat, value, { applyRefine: false });
  });
  Object.entries(enhancePassiveBonuses(item, context)).forEach(([stat, value]) => {
    addScaledStat(stats, stat, value, { applyRefine: false });
  });
  const itemLine = item.series || item.upgradePathId || '';
  const masteryProvider = typeof context.getLineMasteryBonus === 'function'
    ? context.getLineMasteryBonus
    : () => ({ statMultiplier: 1, bonusStats: {}, abyssAffixMultiplier: 1 });
  const mastery = masteryProvider(itemLine) || {};
  const globalMasteryProvider = typeof context.getLineMasteryGlobalBonus === 'function'
    ? context.getLineMasteryGlobalBonus
    : () => ({ statMultiplier: 1, bonusStats: {} });
  const globalMastery = globalMasteryProvider() || {};
  const masteryMultiplier = itemLine && itemLine !== 'oldWorld' ? Math.max(1, number(mastery.statMultiplier || 1)) : 1;
  const globalMultiplier = Math.max(1, number(globalMastery.statMultiplier || 1));
  applyLineMasteryBaseMultiplier(stats, masteryMultiplier * globalMultiplier);
  Object.entries(mastery.bonusStats || {}).forEach(([stat, value]) => {
    addScaledStat(stats, stat, value, { applyRefine: false });
  });
  [
    'abyssExecuteDamageBonus', 'setPowerBonus', 'finalDamageBonus', 'eliteDamageBonus',
    'rareDropBonus', 'bossDamageReduction',
  ].forEach((stat) => {
    if (!(stat in stats)) addScaledStat(stats, stat, item[stat]);
  });
  (Array.isArray(item.mechanicAffixes) ? item.mechanicAffixes : []).forEach((id) => {
    Object.entries(context.getMechanicAffixEffects(id) || {}).forEach(([stat, value]) => addScaledStat(stats, stat, value));
  });
  const abyssAffixMultiplier = itemLine && itemLine !== 'oldWorld' ? Math.max(1, number(mastery.abyssAffixMultiplier || 1)) : 1;
  const scaleAbyssMasteryValue = (value) => Number((number(value) * abyssAffixMultiplier).toFixed(3));
  Object.entries(item.abyssBonus || {}).forEach(([stat, value]) => addScaledStat(stats, stat, scaleAbyssMasteryValue(value)));
  (Array.isArray(item.abyssAffixes) ? item.abyssAffixes : []).forEach((affix) => {
    Object.entries(affix?.effects || {}).forEach(([stat, value]) => addScaledStat(stats, stat, scaleAbyssMasteryValue(value)));
  });
  Object.entries(context.computeCardSocketBonuses(item) || {}).forEach(([stat, value]) => {
    addScaledStat(stats, stat, value, { applyRefine: false });
  });
  Object.entries((typeof context.getAbyssTemperingBonus === 'function' ? context.getAbyssTemperingBonus(item) : {}) || {}).forEach(([stat, value]) => {
    addScaledStat(stats, stat, value, { applyRefine: false });
  });
  if (includeRandom) {
    const randomStats = normalizeRandomStats(item.randomStats);
    ATTRIBUTE_KEYS.forEach((stat) => {
      stats[stat] += Math.round(number(randomStats[stat]) * multiplier * enhanceMainStatFactor(item, stat));
    });
  }
  Object.entries(star15Bonus(item)).forEach(([stat, value]) => {
    addScaledStat(stats, stat, value, { applyRefine: false });
  });
  const canonical = canonicalizeEquipmentStats(stats);
  Object.keys(stats).forEach((key) => {
    delete stats[key];
  });
  Object.assign(stats, canonical);
  DEPRECATED_EQUIPMENT_STATS.forEach((stat) => {
    delete stats[stat];
  });
  return stats;
}

export function computeEquipmentFullStats() {
  if (typeof window.computeEquipmentFullStats === 'function') return window.computeEquipmentFullStats();
  return {};
}
export function groupEquipmentStats(item) {
  if (typeof window.groupEquipmentStats === 'function') return window.groupEquipmentStats(item);
  return {};
}
