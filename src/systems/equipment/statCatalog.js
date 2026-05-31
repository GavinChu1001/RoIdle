export const DEPRECATED_EQUIPMENT_STATS = new Set([
  'antiCrit',
  'hitRate',
  'higherLevelDamageBonus',
  'damageReduction',
]);

export const STAT_ALIASES = Object.freeze({
  luck: 'luk',
  critRatePct: 'crit',
  dodgeRatePct: 'dodgeRate',
  baseExpBonus: 'expBonus',
  jobExpBonus: 'expBonus',
  patrolEfficiency: 'combatPaceBonus',
  powerPct: 'combatPaceBonus',
  abyssBossDamageBonus: 'abyssDamageBonus',
  abyssSkillDamageBonus: 'abyssDamageBonus',
  abyssMaterialDropBonus: 'materialQuantityBonus',
  mutationMaterialDoubleChance: 'materialQuantityBonus',
  mythicEssenceDropBonus: 'highTierFind',
  mythicWeightBonus: 'highTierFind',
  rebirthPrestigeWeightBonus: 'highTierFind',
});

export const ORDINARY_EQUIPMENT_AFFIX_STATS = new Set([
  'atk',
  'matk',
  'def',
  'hp',
  'hpRegen',
  'aspd',
  'str',
  'agi',
  'vit',
  'int',
  'dex',
  'luk',
  'atkPct',
  'matkPct',
  'hpPct',
  'defPct',
  'attackSpeedPct',
  'crit',
  'critDamageBonus',
  'skillDamageBonus',
  'bossDamageBonus',
  'finalDamageBonus',
  'damageReductionPct',
  'blockRate',
  'dodgeRate',
  'lifeSteal',
  'hpRegenPct',
  'ignoreDefense',
  'gold',
  'drop',
  'rareDropBonus',
  'equipmentDrop',
  'cardDrop',
  'materialQuantityBonus',
  'expBonus',
  'combatPaceBonus',
  'abyssDamageBonus',
  'abyssDamageReduction',
  'highTierFind',
]);

export const SPECIAL_MECHANIC_STATS = new Set([
  'echoChance',
  'splashTargets',
  'splashDamagePct',
  'fireBurstChance',
  'fireBurstAtkPct',
  'thornVitMultiplier',
]);

export const EQUIPMENT_MAIN_STAT_GROUPS = Object.freeze([
  { title: 'base', stats: Object.freeze(['atk', 'matk', 'def', 'hp']) },
  { title: 'attributes', stats: Object.freeze(['str', 'agi', 'vit', 'int', 'dex', 'luk']) },
  { title: 'output', stats: Object.freeze(['aspd', 'attackSpeedPct', 'crit', 'critDamageBonus', 'atkPct', 'matkPct', 'skillDamageBonus', 'bossDamageBonus', 'finalDamageBonus']) },
  { title: 'survival', stats: Object.freeze(['hpPct', 'defPct', 'damageReductionPct', 'dodgeRate', 'blockRate', 'lifeSteal', 'hpRegen', 'hpRegenPct']) },
  { title: 'reward', stats: Object.freeze(['gold', 'drop', 'equipmentDrop', 'cardDrop', 'materialQuantityBonus', 'expBonus', 'highTierFind']) },
  { title: 'abyss', stats: Object.freeze(['abyssDamageBonus', 'abyssDamageReduction']) },
]);

function finite(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function canonicalEquipmentStat(stat) {
  if (!stat) return '';
  return STAT_ALIASES[stat] || stat;
}

export function canonicalizeEquipmentStats(source = {}) {
  const output = {};
  Object.entries(source || {}).forEach(([rawKey, rawValue]) => {
    if (DEPRECATED_EQUIPMENT_STATS.has(rawKey)) return;
    const value = finite(rawValue);
    if (!value) return;
    const key = canonicalEquipmentStat(rawKey);
    if (DEPRECATED_EQUIPMENT_STATS.has(key)) return;
    output[key] = Number((finite(output[key]) + value).toFixed(3));
  });
  return output;
}

export function clearDeprecatedAndAliasStats(target = {}) {
  Object.keys(STAT_ALIASES).forEach((key) => {
    delete target[key];
  });
  DEPRECATED_EQUIPMENT_STATS.forEach((key) => {
    delete target[key];
  });
  return target;
}

export function applyCanonicalEquipmentStats(target = {}) {
  Object.assign(target, canonicalizeEquipmentStats(target));
  return clearDeprecatedAndAliasStats(target);
}
