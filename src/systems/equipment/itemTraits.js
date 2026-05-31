import { getEquipmentSeriesConfig, normalizeEquipmentSeries } from './itemProgression.js';

export const EQUIPMENT_TRAIT_STAGES = Object.freeze([
  Object.freeze({ id: 'base', label: '基础阶', minStage: 0 }),
  Object.freeze({ id: 'reform', label: '改良阶', minStage: 1 }),
  Object.freeze({ id: 'core', label: '核心阶', minStage: 2 }),
]);

export const EQUIPMENT_LINE_TRAITS = Object.freeze({
  ancientHero: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ bossDamageBonus: 0.03 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ bossDamageBonus: 0.06, bossDamageReduction: 0.02 }), effects: Object.freeze({}) }),
    core: Object.freeze({ stats: Object.freeze({ bossDamageBonus: 0.10 }), effects: Object.freeze({ bossExecuteDamageBonus: 0.08 }) }),
  }),
  os: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ skillDamageBonus: 0.03 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ skillDamageBonus: 0.06 }), effects: Object.freeze({ activeSkillCooldownReduction: 0.02 }) }),
    core: Object.freeze({ stats: Object.freeze({ skillDamageBonus: 0.10 }), effects: Object.freeze({ activeSkillExtraCastChance: 0.06 }) }),
  }),
  fides: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ hpPct: 0.04 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ hpPct: 0.08, damageReductionPct: 0.02 }), effects: Object.freeze({}) }),
    core: Object.freeze({ stats: Object.freeze({ hpPct: 0.10, damageReductionPct: 0.02 }), effects: Object.freeze({ lowHpShieldPct: 0.12 }) }),
  }),
  glacier: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ abyssDamageBonus: 0.04 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ abyssDamageBonus: 0.08, abyssDamageReduction: 0.04 }), effects: Object.freeze({}) }),
    core: Object.freeze({ stats: Object.freeze({ abyssDamageBonus: 0.10, abyssDamageReduction: 0.05 }), effects: Object.freeze({ abyssCycleBoost: 0.08 }) }),
  }),
  poenitentia: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ eliteDamageBonus: 0.04 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ eliteDamageBonus: 0.07, bossDamageBonus: 0.07 }), effects: Object.freeze({}) }),
    core: Object.freeze({ stats: Object.freeze({ eliteDamageBonus: 0.09, bossDamageBonus: 0.09 }), effects: Object.freeze({ eliteBossExecuteDamageBonus: 0.08 }) }),
  }),
  goodEvil: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ finalDamageBonus: 0.02 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ finalDamageBonus: 0.04 }), effects: Object.freeze({}) }),
    core: Object.freeze({ stats: Object.freeze({ finalDamageBonus: 0.07 }), effects: Object.freeze({}) }),
  }),
  nebula: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ rareDropBonus: 0.03 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ highTierFind: 0.02, materialQuantityBonus: 0.04 }), effects: Object.freeze({}) }),
    core: Object.freeze({ stats: Object.freeze({ highTierFind: 0.025, materialQuantityBonus: 0.05 }), effects: Object.freeze({ extraLineMaterialChance: 0.05 }) }),
  }),
  muqaddas: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ skillDamageBonus: 0.03 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ skillDamageBonus: 0.04 }), effects: Object.freeze({ v3SkillCooldownReduction: 0.03 }) }),
    core: Object.freeze({ stats: Object.freeze({ skillDamageBonus: 0.05 }), effects: Object.freeze({ v3CircuitEffectBonus: 0.10 }) }),
  }),
  dimensional: Object.freeze({
    base: Object.freeze({ stats: Object.freeze({ finalDamageBonus: 0.02 }), effects: Object.freeze({}) }),
    reform: Object.freeze({ stats: Object.freeze({ skillDamageBonus: 0.04 }), effects: Object.freeze({ v3GlobalSkillEffectBonus: 0.04 }) }),
    core: Object.freeze({ stats: Object.freeze({ finalDamageBonus: 0.05 }), effects: Object.freeze({ v3FinalCircuitEffectBonus: 0.10 }) }),
  }),
});

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function stageIdFor(upgradeStage = 0) {
  const stage = Math.max(0, Math.floor(finite(upgradeStage, 0)));
  if (stage >= 2) return 'core';
  if (stage >= 1) return 'reform';
  return 'base';
}

function mergeNumeric(target, source) {
  Object.entries(source || {}).forEach(([key, value]) => {
    const next = finite(value);
    if (!next) return;
    target[key] = Number((finite(target[key]) + next).toFixed(4));
  });
}

export function getEquipmentTraitStage(item = {}) {
  const id = stageIdFor(item.upgradeStage);
  return EQUIPMENT_TRAIT_STAGES.find((entry) => entry.id === id) || EQUIPMENT_TRAIT_STAGES[0];
}

export function getEquipmentStageTraits(item = {}) {
  const series = normalizeEquipmentSeries(item.series, '');
  const line = EQUIPMENT_LINE_TRAITS[series];
  const stage = getEquipmentTraitStage(item);
  const row = line?.[stage.id] || { stats: {}, effects: {} };
  return {
    series,
    label: getEquipmentSeriesConfig(series).label,
    stage: stage.id,
    stageLabel: stage.label,
    stats: { ...(row.stats || {}) },
    effects: { ...(row.effects || {}) },
  };
}

export function getEquipmentTraitPreview(item = {}) {
  const current = getEquipmentStageTraits(item);
  return {
    current,
    stages: EQUIPMENT_TRAIT_STAGES.map((stage) => {
      const traits = getEquipmentStageTraits({ ...item, upgradeStage: stage.minStage });
      return { ...traits, stage: stage.id, stageLabel: stage.label };
    }),
  };
}

export function collectEquippedTraitStats(equipment = {}) {
  const stats = {};
  const effects = {};
  Object.values(equipment || {}).forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const traits = getEquipmentStageTraits(item);
    mergeNumeric(stats, traits.stats);
    mergeNumeric(effects, traits.effects);
  });
  return { stats, effects };
}
