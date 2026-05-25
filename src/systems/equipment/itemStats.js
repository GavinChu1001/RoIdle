const ATTRIBUTE_KEYS = ['str', 'agi', 'vit', 'int', 'dex', 'luk'];
const PERCENT_STATS = new Set([
  'aspd', 'crit', 'critRate', 'drop', 'gold', 'dodgeRate', 'atkPct', 'matkPct', 'hpPct', 'defPct',
  'aspdPct', 'attackSpeedPct', 'critRatePct', 'critDamageBonus', 'skillDamageBonus', 'monsterDamageBonus',
  'bossDamageBonus', 'bossDamageReduction', 'finalDamageBonus', 'physicalFinalDamageBonus', 'eliteDamageBonus',
  'rareDropBonus', 'normalAttackDamageBonus', 'higherLevelDamageBonus', 'abyssDamageBonus', 'abyssBossDamageBonus',
  'abyssDamageReduction', 'abyssPower', 'abyssResist', 'abyssMaterialDropBonus', 'abyssSkillDamageBonus',
  'abyssGoldPct', 'abyssBaseExpPct', 'abyssJobExpPct', 'abyssCardDropBonus', 'abyssItemDropBonus',
  'mythicWeightBonus', 'mythicEssenceDropBonus', 'rebirthPrestigeWeightBonus', 'abyssExecuteDamageBonus',
  'setPowerBonus', 'abyssSkillChanceBonus', 'abyssDefenseReduction', 'abyssAttackSpeedPct', 'abyssCritRatePct',
  'abyssMagicDamageBonus', 'abyssAttrPct', 'abyssPowerPct', 'abyssCritDamageBonus', 'abyssEliteDamageBonus',
  'abyssDexPct', 'abyssIgnoreDefense', 'abyssBossDamageReduction', 'goldBonus', 'expBonus', 'damageReduction',
  'lifeSteal', 'blockRate', 'antiCrit', 'ignoreDefense', 'damageReductionPct', 'dodgeRatePct', 'hpRegenPct',
  'baseExpBonus', 'jobExpBonus', 'equipmentDrop', 'cardDrop', 'materialQuantityBonus', 'powerPct',
  'combatPaceBonus', 'patrolEfficiency', 'offlineEfficiencyBonus', 'hitRate', 'statusResist', 'echoChance',
  'magicDamageReduction', 'skillDamageReduction', 'skillCooldownPenalty', 'skillHitHealPct', 'splashDamagePct',
  'fireBurstChance', 'fireBurstAtkPct', 'meteorCounterChance', 'meteorCounterMatkPct',
  'mutationMaterialDoubleChance', 'strPct', 'agiPct', 'vitPct', 'intPct', 'dexPct', 'lukPct', 'dps',
]);
const HIGH_VALUE_STATS = new Set([
  'finalDamageBonus', 'bossDamageBonus', 'eliteDamageBonus', 'abyssDamageBonus', 'abyssBossDamageBonus',
  'abyssDamageReduction', 'rareDropBonus', 'drop', 'gold', 'goldBonus', 'baseExpBonus', 'jobExpBonus',
  'expBonus', 'equipmentDrop', 'cardDrop', 'materialQuantityBonus', 'mythicWeightBonus',
  'mythicEssenceDropBonus', 'rebirthPrestigeWeightBonus', 'echoChance', 'mutationMaterialDoubleChance',
]);
const FLAT_STATS = new Set(['atk', 'matk', 'def', 'hp', 'hpRegen', 'str', 'agi', 'vit', 'int', 'dex', 'luk', 'luck']);

let runtimeContext = Object.freeze({
  getMechanicAffixEffects: () => ({}),
  computeCardSocketBonuses: () => ({}),
});

export function configureItemStatsContext(context = {}) {
  runtimeContext = Object.freeze({
    getMechanicAffixEffects: typeof context.getMechanicAffixEffects === 'function' ? context.getMechanicAffixEffects : () => ({}),
    computeCardSocketBonuses: typeof context.computeCardSocketBonuses === 'function' ? context.computeCardSocketBonuses : () => ({}),
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
  if (slot === 'headgear') return { critRatePct: 0.01, allStats: 2 };
  if (slot === 'shoes') return { dodgeRatePct: 0.01, attackSpeedPct: 0.01 };
  return { critDamageBonus: 0.04, drop: 0.01, gold: 0.01 };
}

export function getEffectiveItemStats(item = {}, includeRandom = true, context = runtimeContext) {
  item = item && typeof item === 'object' ? item : {};
  const multiplier = refineMultiplier(item.refine || 0);
  const empowerMultiplier = 1 + number(item.empower) * 0.04;
  const scaleFlat = (value) => Math.round(number(value) * multiplier * empowerMultiplier);
  const scalePercent = (value, stat = '') => Number((number(value) * (refineGrowthFactorForStat(stat, item.refine || 0) + number(item.empower) * 0.012)).toFixed(3));
  const addScaledStat = (target, stat, value, { applyRefine = true } = {}) => {
    const numeric = number(value);
    if (!numeric) return;
    const factor = applyRefine ? refineGrowthFactorForStat(stat, item.refine || 0) : 1;
    const decimals = statIsPercent(stat) || stat.endsWith('Bonus') || stat.endsWith('Pct') || stat === 'thornVitMultiplier' ? 3 : 0;
    const scaled = decimals ? Number((numeric * factor).toFixed(decimals)) : Math.round(numeric * factor);
    target[stat] = Number((number(target[stat]) + scaled).toFixed(decimals));
  };
  const stats = {
    atk: scaleFlat(item.atk),
    matk: scaleFlat(item.matk),
    def: scaleFlat(item.def),
    hp: scaleFlat(item.hp),
    luck: 0,
    str: scaleFlat(item.str),
    agi: scaleFlat(item.agi),
    vit: scaleFlat(item.vit),
    int: scaleFlat(item.int),
    dex: scaleFlat(item.dex),
    luk: scaleFlat(item.luk) + scaleFlat(item.luck),
    aspd: scalePercent(item.aspd, 'aspd'),
    crit: scalePercent(item.crit, 'crit'),
    drop: scalePercent(item.drop, 'drop'),
    gold: scalePercent(item.gold, 'gold'),
    hpRegen: scaleFlat(item.hpRegen),
    dodgeRate: scalePercent(item.dodgeRate, 'dodgeRate'),
    atkPct: scalePercent(item.atkPct, 'atkPct'),
    matkPct: scalePercent(item.matkPct, 'matkPct'),
    hpPct: scalePercent(item.hpPct, 'hpPct'),
    defPct: scalePercent(item.defPct, 'defPct'),
    attackSpeedPct: scalePercent(item.attackSpeedPct, 'attackSpeedPct'),
    critRatePct: scalePercent(item.critRatePct, 'critRatePct'),
    critDamageBonus: scalePercent(item.critDamageBonus, 'critDamageBonus'),
    skillDamageBonus: scalePercent(item.skillDamageBonus, 'skillDamageBonus'),
    monsterDamageBonus: scalePercent(item.monsterDamageBonus, 'monsterDamageBonus'),
    bossDamageBonus: scalePercent(item.bossDamageBonus, 'bossDamageBonus'),
    bossDamageReduction: scalePercent(item.bossDamageReduction, 'bossDamageReduction'),
    finalDamageBonus: scalePercent(item.finalDamageBonus, 'finalDamageBonus'),
    eliteDamageBonus: scalePercent(item.eliteDamageBonus, 'eliteDamageBonus'),
    rareDropBonus: scalePercent(item.rareDropBonus, 'rareDropBonus'),
    damageReductionPct: scalePercent(item.damageReductionPct, 'damageReductionPct'),
    damageReduction: scalePercent(item.damageReduction, 'damageReduction'),
    lifeSteal: scalePercent(item.lifeSteal, 'lifeSteal'),
    blockRate: scalePercent(item.blockRate, 'blockRate'),
    antiCrit: scalePercent(item.antiCrit, 'antiCrit'),
    dodgeRatePct: scalePercent(item.dodgeRatePct, 'dodgeRatePct'),
    hpRegenPct: scalePercent(item.hpRegenPct, 'hpRegenPct'),
    ignoreDefense: scalePercent(item.ignoreDefense, 'ignoreDefense'),
    baseExpBonus: scalePercent(item.baseExpBonus, 'baseExpBonus'),
    jobExpBonus: scalePercent(item.jobExpBonus, 'jobExpBonus'),
    expBonus: scalePercent(item.expBonus, 'expBonus'),
    equipmentDrop: scalePercent(item.equipmentDrop, 'equipmentDrop'),
    cardDrop: scalePercent(item.cardDrop, 'cardDrop'),
    materialQuantityBonus: scalePercent(item.materialQuantityBonus, 'materialQuantityBonus'),
    powerPct: scalePercent(item.powerPct, 'powerPct'),
    combatPaceBonus: scalePercent(item.combatPaceBonus, 'combatPaceBonus'),
    patrolEfficiency: scalePercent(item.patrolEfficiency, 'patrolEfficiency'),
    hitRate: scalePercent(item.hitRate, 'hitRate'),
    statusResist: scalePercent(item.statusResist, 'statusResist'),
    echoChance: scalePercent(item.echoChance, 'echoChance'),
    mutationMaterialDoubleChance: scalePercent(item.mutationMaterialDoubleChance, 'mutationMaterialDoubleChance'),
    thornVitMultiplier: Number((number(item.thornVitMultiplier) * refineGrowthFactorForStat('thornVitMultiplier', item.refine || 0)).toFixed(3)),
    abyssPower: scalePercent(item.abyssPower, 'abyssPower'),
    abyssResist: scalePercent(item.abyssResist, 'abyssResist'),
  };
  [
    'abyssDamageBonus', 'abyssBossDamageBonus', 'abyssDamageReduction', 'abyssMaterialDropBonus',
    'abyssSkillDamageBonus', 'abyssExecuteDamageBonus', 'mythicWeightBonus', 'mythicEssenceDropBonus',
    'rebirthPrestigeWeightBonus', 'setPowerBonus', 'finalDamageBonus', 'eliteDamageBonus',
    'rareDropBonus', 'bossDamageReduction',
  ].forEach((stat) => {
    if (!(stat in stats)) addScaledStat(stats, stat, item[stat]);
  });
  (Array.isArray(item.mechanicAffixes) ? item.mechanicAffixes : []).forEach((id) => {
    Object.entries(context.getMechanicAffixEffects(id) || {}).forEach(([stat, value]) => addScaledStat(stats, stat, value));
  });
  Object.entries(item.abyssBonus || {}).forEach(([stat, value]) => addScaledStat(stats, stat, value));
  (Array.isArray(item.abyssAffixes) ? item.abyssAffixes : []).forEach((affix) => {
    Object.entries(affix?.effects || {}).forEach(([stat, value]) => addScaledStat(stats, stat, value));
  });
  Object.entries(context.computeCardSocketBonuses(item) || {}).forEach(([stat, value]) => {
    stats[stat] = Number((number(stats[stat]) + number(value)).toFixed(statIsPercent(stat) || stat.endsWith('Bonus') ? 3 : 0));
  });
  if (includeRandom) {
    const randomStats = normalizeRandomStats(item.randomStats);
    ATTRIBUTE_KEYS.forEach((stat) => {
      stats[stat] += Math.round(number(randomStats[stat]) * multiplier);
    });
  }
  Object.entries(star15Bonus(item)).forEach(([stat, value]) => {
    stats[stat] = Number((number(stats[stat]) + number(value)).toFixed(statIsPercent(stat) || stat.endsWith('Bonus') ? 3 : 0));
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
