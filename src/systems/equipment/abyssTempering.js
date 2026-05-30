import {
  getEquipmentLineMaterials,
  normalizeEquipmentSeries,
  normalizeGrowthTier,
} from './itemProgression.js';

export const ABYSS_TEMPERING_MAX_LEVEL = 10;

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function level(value) {
  return Math.max(0, Math.floor(finite(value, 0)));
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

export function canTemperAbyssItem(item = {}) {
  const series = normalizeEquipmentSeries(item.series || item.upgradePathId || '', '');
  if (!series || series === 'oldWorld') return false;
  const tier = normalizeGrowthTier(item.growthTier || 'T1', 'T1');
  return tier !== 'T1';
}

export function getAbyssTemperingCost(item = {}, mode = 'infuse') {
  if (!canTemperAbyssItem(item)) return null;
  const series = normalizeEquipmentSeries(item.series || item.upgradePathId || '', '');
  const materials = getEquipmentLineMaterials(series);
  const currentLevel = level(item.abyssTemperingLevel);

  if (mode === 'infuse') {
    if (!materials.advanced?.id) return null;
    return { mode, materials: { [materials.advanced.id]: 1, abyssShard: 8 }, gold: 6000 };
  }

  if (mode === 'reroll') {
    if (!materials.advanced?.id) return null;
    return { mode, materials: { [materials.advanced.id]: 2, abyssShard: 12 }, gold: 10000 };
  }

  if (mode === 'empower') {
    if (currentLevel >= ABYSS_TEMPERING_MAX_LEVEL || !materials.core?.id) return null;
    const coreAmount = currentLevel >= 4 ? 1 + Math.floor((currentLevel - 4) / 3) : 1;
    const materialsCost = { [materials.core.id]: coreAmount };
    if (currentLevel >= 4) materialsCost.abyssCore = 1;
    else materialsCost.abyssShard = 10 + currentLevel * 2;
    return {
      mode,
      materials: materialsCost,
      gold: Math.round(18000 * Math.pow(1.32, currentLevel)),
      nextLevel: currentLevel + 1,
    };
  }

  return null;
}

export function getAbyssTemperingBonus(item = {}) {
  if (!canTemperAbyssItem(item)) return {};
  const currentLevel = Math.max(0, Math.min(ABYSS_TEMPERING_MAX_LEVEL, level(item.abyssTemperingLevel)));
  if (!currentLevel) return {};
  return {
    abyssDamageBonus: Number((currentLevel * 0.006).toFixed(3)),
    abyssDamageReduction: Number((Math.floor(currentLevel / 2) * 0.003).toFixed(3)),
  };
}

export function temperAbyssItem(itemId, mode = 'infuse', context = {}) {
  const state = context.getState?.() || {};
  const item = (state.inventory || []).find((entry) => entry.id === itemId || entry.instanceId === itemId);
  if (!item) return { ok: false, reason: 'missing-item' };
  if (!canTemperAbyssItem(item)) return { ok: false, reason: 'not-temperable' };

  const cost = getAbyssTemperingCost(item, mode);
  if (!hasCost(state, cost)) return { ok: false, reason: 'not-affordable', cost };

  consumeCost(state, cost);
  item.abyssTempered = true;
  item.abyssForged = true;
  item.prefix = item.prefix || '\u6df1\u6e0a';
  item.sourceDifficulty = item.sourceDifficulty || 'abyss';

  if (mode === 'infuse' || mode === 'reroll') {
    const rolled = context.rollAbyssAffixes?.({ ...item, abyssForged: true, prefix: '\u6df1\u6e0a' }) || [];
    item.abyssAffixes = rolled.length ? rolled : item.abyssAffixes || [];
  }

  if (mode === 'empower') {
    item.abyssTemperingLevel = Math.min(ABYSS_TEMPERING_MAX_LEVEL, level(item.abyssTemperingLevel) + 1);
  }

  context.showToast?.(mode === 'empower'
    ? `\u6df1\u6e0a\u6dec\u70bc Lv.${item.abyssTemperingLevel}`
    : '\u6df1\u6e0a\u8bcd\u6761\u5df2\u6dec\u70bc');
  context.renderAll?.();
  context.save?.();
  return { ok: true, item, cost, mode };
}
