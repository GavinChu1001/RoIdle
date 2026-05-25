let runtimeContext = {};

export function configureCardDropsContext(context = {}) {
  runtimeContext = context || {};
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function random(context = runtimeContext) {
  return context.random?.() ?? Math.random();
}

export function grantCardDrop(card, rarity = 'rare', source = '\u5361\u7247\u6389\u843d', context = runtimeContext) {
  const state = context.getState?.();
  if (!state || !card?.id) return false;
  state.cards = state.cards || {};
  state.cardCodex = state.cardCodex || {};
  state.cards[card.id] = finite(state.cards[card.id]) + 1;
  state.cardCodex[card.id] = state.cardCodex[card.id] || { obtained: false, obtainCount: 0, firstObtainedAt: 0 };
  state.cardCodex[card.id].obtained = true;
  state.cardCodex[card.id].obtainCount = finite(state.cardCodex[card.id].obtainCount) + 1;
  if (!state.cardCodex[card.id].firstObtainedAt) state.cardCodex[card.id].firstObtainedAt = context.now?.() || Date.now();
  context.recordSessionReward?.({ cards: 1 });
  context.recordRecentLoot?.({ cards: [{ cardId: card.id, name: card.name, rarity: rarity || card.rarity || 'rare', qty: 1 }] }, source);
  context.addLog?.(`${source}\uff1a${card.name}\u3002`);
  return true;
}

export function rollCardDropsFromTable(stats = {}, options = {}, context = runtimeContext) {
  const map = context.currentMap?.() || {};
  const rows = context.getCardDropTable?.(map.id) || [];
  const difficulty = context.getDifficultyConfig?.() || { cardDrop: 1 };
  const isBoss = Boolean(options.boss);
  let count = 0;
  rows.forEach((drop) => {
    if (drop.bossOnly && !isBoss) return;
    const bossMultiplier = drop.bossOnly ? (context.currentDifficulty?.() === 'abyss' ? 2.5 : 1) : (isBoss ? 1.5 : 1);
    const finalDropRate = finite(drop.dropRate) * (1 + finite(stats.cardDropBonus ?? stats.dropBonus)) * finite(difficulty.cardDrop || 1) * bossMultiplier;
    if (random(context) >= finalDropRate) return;
    const card = context.getCard?.(drop.cardId);
    if (!card) return;
    if (grantCardDrop(card, drop.rarity || card.rarity || 'rare', drop.bossOnly ? '\u0042\u006f\u0073\u0073\u5361\u7247\u6389\u843d' : '\u5361\u7247\u6389\u843d', context)) count += 1;
  });
  return count;
}

export function maybeDropBossCardFragments(stats = {}, options = {}, context = runtimeContext) {
  if (!options.boss) return 0;
  const difficulty = context.currentDifficulty?.() || 'normal';
  const baseRate = difficulty === 'abyss' ? 0.85 : difficulty === 'hard' ? 0.45 : 0.25;
  const rate = Math.min(1, baseRate * (1 + Math.min(1, finite(stats.cardDropBonus || stats.dropBonus))));
  if (random(context) >= rate) return 0;
  const qty = difficulty === 'abyss'
    ? (context.randomInt?.(2, 4) || 2)
    : difficulty === 'hard'
      ? (context.randomInt?.(1, 2) || 1)
      : 1;
  const state = context.getState?.();
  if (!state) return 0;
  state.materials = state.materials || {};
  state.materials.bossCardShard = finite(state.materials.bossCardShard) + qty;
  const name = context.getMaterialName?.('bossCardShard') || 'bossCardShard';
  context.recordSessionReward?.({ materials: qty });
  context.recordRecentLoot?.({ materials: [{ materialId: 'bossCardShard', name, qty, rarity: 'legend' }] }, '\u0042\u006f\u0073\u0073\u5361\u7247\u788e\u7247');
  context.addLog?.(`\u83b7\u5f97 ${name} \u00d7${qty}\u3002`);
  return qty;
}
