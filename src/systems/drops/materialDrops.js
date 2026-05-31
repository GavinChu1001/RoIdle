let runtimeContext = {};

export function configureMaterialDropsContext(context = {}) {
  runtimeContext = context || {};
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function random(context = runtimeContext) {
  return context.random?.() ?? Math.random();
}

function materialName(materialId, context = runtimeContext) {
  return context.getMaterialName?.(materialId) || materialId;
}

function materialRarity(materialId, fallback = 'normal', context = runtimeContext) {
  return context.getMaterialRarity?.(materialId) || fallback;
}

export function grantMaterialDrop(materialId, quantity, source, options = {}, context = runtimeContext) {
  const state = context.getState?.();
  const qty = Math.max(0, Math.floor(finite(quantity)));
  if (!state || !materialId || qty <= 0) return 0;
  state.materials = state.materials || {};
  state.materials[materialId] = finite(state.materials[materialId]) + qty;
  const mapId = options.mapId || options.map?.id || context.currentMap?.()?.id || '';
  context.recordMapMasteryMaterial?.(mapId, qty);
  if (options.recordSession !== false) context.recordSessionReward?.({ materials: qty });
  if (options.recordRecent !== false) {
    const item = { materialId, name: materialName(materialId, context), qty };
    if (options.rarity) item.rarity = options.rarity;
    context.recordRecentLoot?.({ materials: [item] }, source);
  }
  if (options.logText) context.addLog?.(options.logText);
  return qty;
}

export function rollMapMaterialDrops(stats = {}, options = {}, context = runtimeContext) {
  const map = context.currentMap?.() || {};
  const rows = context.getMaterialDropTable?.(map.id) || [];
  const progressionRows = context.getProgressionMaterialDrops?.(map.id, context.currentDifficulty?.() || 'normal', options) || [];
  const allRows = [
    ...(Array.isArray(rows) ? rows : []),
    ...(Array.isArray(progressionRows) ? progressionRows : []),
  ];
  if (!allRows.length) return 0;
  const difficulty = context.getDifficultyConfig?.() || { materialDrop: 1 };
  const isBoss = Boolean(options.boss);
  const bossMultiplier = isBoss ? 2.5 : 1;
  let total = 0;
  allRows.forEach((drop) => {
    const abyssBonus = context.currentDifficulty?.() === 'abyss' ? finite(stats.abyssMaterialDropBonus) : 0;
    const finalDropRate = finite(drop.dropRate) * (1 + finite(stats.dropBonus) + abyssBonus) * finite(difficulty.materialDrop || 1) * bossMultiplier;
    if (random(context) >= finalDropRate) return;
    const baseQty = context.randomInt?.(drop.minQty || 1, drop.maxQty || drop.minQty || 1) || 1;
    const qty = context.applyMaterialQuantityBonus?.(baseQty, stats) ?? baseQty;
    const source = drop.progression
      ? (isBoss ? '\u0042\u006f\u0073\u0073\u88c5\u5907\u6750\u6599' : '\u88c5\u5907\u8fdb\u9636\u6750\u6599')
      : (isBoss ? '\u0042\u006f\u0073\u0073\u6750\u6599' : '\u6750\u6599\u6389\u843d');
    total += grantMaterialDrop(drop.materialId, qty, source, {
      mapId: map.id,
      rarity: drop.rarity,
      logText: `\u83b7\u5f97\u6750\u6599\uff1a${materialName(drop.materialId, context)} \u00d7 ${qty}\u3002`,
    }, context);
  });
  return total;
}

export function maybeDropSocketMaterials(stats = {}, options = {}, context = runtimeContext) {
  const state = context.getState?.() || {};
  const difficultyId = context.currentDifficulty?.() || 'normal';
  const isBoss = Boolean(options.boss);
  const entries = [
    { id: 'socketStone', rate: isBoss ? 0.08 : 0.0025, qty: [1, 1] },
    { id: 'advancedSocketStone', rate: isBoss ? 0.025 : 0.0007, qty: [1, 1], minMap: 4 },
    { id: 'mythicSocketStone', rate: difficultyId === 'abyss' ? (isBoss ? 0.012 : 0.00045) : 0, qty: [1, 1] },
    { id: 'cardRemover', rate: isBoss ? 0.035 : 0.001, qty: [1, 1] },
  ];
  let total = 0;
  entries.forEach((entry) => {
    if (finite(state.currentMap) < finite(entry.minMap)) return;
    const rate = Math.min(0.3, entry.rate * (1 + Math.min(1, finite(stats.dropBonus) + finite(stats.materialDropBonus))));
    if (rate <= 0 || random(context) >= rate) return;
    const qty = context.randomInt?.(entry.qty[0], entry.qty[1]) || 1;
    total += grantMaterialDrop(entry.id, qty, isBoss ? '\u0042\u006f\u0073\u0073\u6253\u5b54\u6750\u6599' : '\u6253\u5b54\u6750\u6599', {
      rarity: materialRarity(entry.id, 'epic', context),
      logText: `\u83b7\u5f97 ${materialName(entry.id, context)} \u00d7${qty}\u3002`,
    }, context);
  });
  return total;
}

export function maybeDropDarkGoldFragments(stats = {}, options = {}, context = runtimeContext) {
  if (!options.boss) return 0;
  const state = context.getState?.() || {};
  const difficultyId = context.currentDifficulty?.() || 'normal';
  const config = context.getDarkGoldFragmentDropConfig?.(difficultyId) || {};
  const mapIndex = Math.max(0, finite(state.currentMap));
  if (mapIndex < finite(config.minMapIndex)) return 0;
  const equipmentBonus = Math.min(1.2, finite(stats.equipmentDropBonus));
  const finalRate = Math.min(1, finite(config.rate) * (1 + equipmentBonus * 0.35));
  if (random(context) >= finalRate) return 0;
  const range = Array.isArray(config.qty) ? config.qty : [1, 1];
  const qty = context.randomInt?.(range[0] || 1, range[1] || range[0] || 1) || 1;
  return grantMaterialDrop('darkGoldFragment', qty, difficultyId === 'abyss' ? '\u6df1\u6e0a\u0042\u006f\u0073\u0073\u6750\u6599' : '\u0042\u006f\u0073\u0073\u6750\u6599', {
    rarity: 'darkGold',
    logText: `\u83b7\u5f97 ${materialName('darkGoldFragment', context)} \u00d7${qty}\u3002`,
  }, context);
}

export function maybeDropMythicEssence(stats = {}, options = {}, context = runtimeContext) {
  if (context.currentDifficulty?.() !== 'abyss') return 0;
  const rate = 0.002 * (options.boss ? 3 : 1) * (1 + finite(stats.mythicEssenceDropBonus));
  if (random(context) >= rate) return 0;
  return grantMaterialDrop('mythicEssence', 1, options.boss ? '\u6df1\u6e0a\u0042\u006f\u0073\u0073\u6750\u6599' : '\u6df1\u6e0a\u6750\u6599', {
    recordSession: false,
    logText: '\u6df1\u6e0a\u51dd\u7ed3\u51fa \u795e\u8bdd\u7cbe\u7cb9 \u00d71\u3002',
  }, context);
}

export function grantMutationMaterial(rareOnly = false, context = runtimeContext) {
  const pool = rareOnly ? ['rune', 'ancientCore', 'starShard'] : ['ore', 'crystal', 'rune'];
  const pick = Math.min(pool.length - 1, Math.floor(random(context) * pool.length));
  const material = pool[pick];
  const stats = context.computeStats?.() || {};
  const baseQty = rareOnly ? 1 : (context.randomInt?.(1, 2) || 1);
  let qty = context.applyMaterialQuantityBonus?.(baseQty, stats) ?? baseQty;
  if (!rareOnly && random(context) < finite(stats.mutationMaterialDoubleChance)) qty *= 2;
  return grantMaterialDrop(material, qty, '\u53d8\u5f02\u602a\u6750\u6599', {
    logText: `\u53d8\u5f02\u602a\u989d\u5916\u6389\u843d ${materialName(material, context)} \u00d7 ${qty}\u3002`,
  }, context);
}
