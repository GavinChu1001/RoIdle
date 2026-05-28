import { getEffectiveItemStats } from './itemStats.js';
import { isAbyssEquipment } from './itemNaming.js';
import { calculateArchetypeScores } from './itemArchetype.js';

const ATTRIBUTE_KEYS = ['str', 'agi', 'vit', 'int', 'dex', 'luk'];

function statValue(stats = {}, key) {
  if (key === 'luk') return Number(stats.luk || 0) + Number(stats.luck || 0);
  const value = Number(stats[key] || 0);
  return Number.isFinite(value) ? value : 0;
}

function finiteScore(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

export function itemScore(item) {
  if (typeof window.itemScore === 'function') return window.itemScore(item);
  return 0;
}
export function calculatePower(params) {
  if (typeof window.calculatePower === 'function') return window.calculatePower(params);
  return 0;
}
export function calculateEquipmentScores(item, job) {
  const stats = getEffectiveItemStats(item || {}, true);
  const archetypeScores = calculateArchetypeScores(item || {}, stats, job || {});
  const attrTotal = ATTRIBUTE_KEYS.reduce((sum, stat) => sum + statValue(stats, stat), 0);
  const output =
    statValue(stats, 'atk') * 1.7 +
    statValue(stats, 'matk') * 1.7 +
    attrTotal * 8 +
    statValue(stats, 'aspd') * 900 +
    statValue(stats, 'attackSpeedPct') * 2600 +
    statValue(stats, 'crit') * 3500 +
    statValue(stats, 'critRatePct') * 3500 +
    statValue(stats, 'critDamageBonus') * 4200 +
    statValue(stats, 'finalDamageBonus') * 6200 +
    statValue(stats, 'skillDamageBonus') * 4200 +
    statValue(stats, 'monsterDamageBonus') * 3600;
  const survival =
    statValue(stats, 'hp') * 0.35 +
    statValue(stats, 'def') * 2.6 +
    statValue(stats, 'vit') * 12 +
    statValue(stats, 'hpPct') * 6200 +
    statValue(stats, 'defPct') * 4200 +
    statValue(stats, 'damageReductionPct') * 9000 +
    statValue(stats, 'lifeSteal') * 7000 +
    statValue(stats, 'hpRegen') * 3 +
    statValue(stats, 'hpRegenPct') * 2800 +
    statValue(stats, 'dodgeRate') * 3000 +
    statValue(stats, 'dodgeRatePct') * 2600 +
    statValue(stats, 'blockRate') * 3200;
  const boss =
    output * 0.28 +
    statValue(stats, 'bossDamageBonus') * 8500 +
    statValue(stats, 'eliteDamageBonus') * 6200 +
    statValue(stats, 'bossDamageReduction') * 5000 +
    statValue(stats, 'finalDamageBonus') * 4200 +
    statValue(stats, 'critDamageBonus') * 2400 +
    statValue(stats, 'lifeSteal') * 3000;
  const abyss =
    output * 0.18 +
    survival * 0.18 +
    (isAbyssEquipment(item) ? 900 : 0) +
    statValue(stats, 'abyssDamageBonus') * 12000 +
    statValue(stats, 'abyssDamageReduction') * 14000 +
    statValue(stats, 'abyssBossDamageBonus') * 9500 +
    statValue(stats, 'abyssResist') * 8000 +
    statValue(stats, 'abyssPower') * 5000 +
    statValue(stats, 'mythicWeightBonus') * 11000;
  const treasure =
    statValue(stats, 'drop') * 3600 +
    statValue(stats, 'gold') * 2000 +
    statValue(stats, 'goldBonus') * 2000 +
    statValue(stats, 'rareDropBonus') * 5200 +
    statValue(stats, 'equipmentDrop') * 4600 +
    statValue(stats, 'cardDrop') * 3800 +
    statValue(stats, 'materialQuantityBonus') * 3200 +
    statValue(stats, 'baseExpBonus') * 1800 +
    statValue(stats, 'jobExpBonus') * 1800 +
    statValue(stats, 'abyssMaterialDropBonus') * 3200 +
    statValue(stats, 'mythicEssenceDropBonus') * 6000;
  const physicalScore = finiteScore(archetypeScores.physicalScore);
  const magicScore = finiteScore(archetypeScores.magicScore);
  const generalScore = finiteScore(archetypeScores.generalScore);
  const currentJobScore = finiteScore(archetypeScores.currentJobScore);
  const archetypeFit = finiteScore(archetypeScores.archetypeFit);
  const archetypeScore = currentJobScore || Math.max(physicalScore, magicScore, generalScore);
  const comprehensive = output * 0.34 + survival * 0.24 + boss * 0.15 + abyss * 0.13 + treasure * 0.05 + archetypeScore * 0.09;
  return {
    comprehensive: Math.max(0, Math.round(comprehensive)),
    output: Math.max(0, Math.round(output)),
    survival: Math.max(0, Math.round(survival)),
    boss: Math.max(0, Math.round(boss)),
    abyss: Math.max(0, Math.round(abyss)),
    treasure: Math.max(0, Math.round(treasure)),
    physicalScore: Math.max(0, Math.round(physicalScore)),
    magicScore: Math.max(0, Math.round(magicScore)),
    generalScore: Math.max(0, Math.round(generalScore)),
    currentJobScore: Math.max(0, Math.round(currentJobScore)),
    archetypeFit,
  };
}
