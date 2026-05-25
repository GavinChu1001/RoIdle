let shopContext = {};

function finite(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

export function configureShopContext(context = {}) {
  shopContext = context || {};
}

export function normalizeShopState(ctx = shopContext) {
  const state = ctx.getState?.();
  if (!state) return;
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const day = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const weekKey = weekStart.toISOString().slice(0, 10);
  if (state.shopState.lastDailyRefresh !== today) {
    state.shopState.dailyPurchases = {};
    state.shopState.lastDailyRefresh = today;
  }
  if (state.shopState.lastWeeklyRefresh !== weekKey) {
    state.shopState.weeklyPurchases = {};
    state.shopState.lastWeeklyRefresh = weekKey;
  }
  state.shopState.totalPurchases = state.shopState.totalPurchases || {};
}

export function getShopPurchaseCount(itemId, type, ctx = shopContext) {
  const state = ctx.getState?.() || {};
  normalizeShopState(ctx);
  if (type === 'daily') return state.shopState?.dailyPurchases?.[itemId] || 0;
  if (type === 'weekly') return state.shopState?.weeklyPurchases?.[itemId] || 0;
  return state.shopState?.totalPurchases?.[itemId] || 0;
}

export function formatShopCostItem(id, amount, ctx = shopContext) {
  const safeAmount = Number(amount || 0);
  const amountText = Number.isFinite(safeAmount) ? Math.round(safeAmount).toLocaleString('zh-CN') : '0';
  if (id === 'gold') return `\u91d1\u5e01 ${amountText}`;
  const name = ctx.getMaterialName?.(id) || `\u672a\u77e5\u6750\u6599(${id})`;
  return `${name} \xd7${amountText}`;
}

export function formatShopCost(cost = {}, ctx = shopContext) {
  const entries = Object.entries(cost || {}).filter(([, amount]) => Number(amount || 0) > 0);
  if (!entries.length) return '\u65e0\u6d88\u8017';
  return entries.map(([id, amount]) => formatShopCostItem(id, amount, ctx)).join(' + ');
}

export function formatShopLimitText(item, ctx = shopContext) {
  if (item.totalLimit) return `\u603b\u8ba1 ${getShopPurchaseCount(item.id, 'total', ctx)}/${item.totalLimit}`;
  if (item.weeklyLimit) return `\u672c\u5468 ${getShopPurchaseCount(item.id, 'weekly', ctx)}/${item.weeklyLimit}`;
  if (item.dailyLimit) return `\u4eca\u65e5 ${getShopPurchaseCount(item.id, 'daily', ctx)}/${item.dailyLimit}`;
  return '';
}

export function canBuyShopItem(item, ctx = shopContext) {
  const state = ctx.getState?.() || {};
  const tab = state.shopActiveTab || ctx.getShopActiveTab?.() || 'normal';
  if (item.totalLimit && getShopPurchaseCount(item.id, 'total', ctx) >= item.totalLimit) return '\u5df2\u552e\u7f44';
  if (item.weeklyLimit && getShopPurchaseCount(item.id, 'weekly', ctx) >= item.weeklyLimit) return '\u672c\u5468\u5df2\u552e\u7f44';
  if (item.dailyLimit && getShopPurchaseCount(item.id, 'daily', ctx) >= item.dailyLimit) return '\u4eca\u65e5\u5df2\u552e\u7f44';
  if (item.requireAbyss) {
    if (!state.mapDifficultyProgress || !Object.values(state.mapDifficultyProgress).some((d) => d.abyss?.unlocked || d.abyss?.cleared)) return '\u8fdb\u5165\u6df1\u6e0a\u540e\u89e3\u9501';
  }
  if (item.requireBossCleared && !state.enemyBoss && !(state.totalKills > 0)) return '\u9700\u51fb\u8d25\u8fc7Boss';
  for (const [key, amount] of Object.entries(item.cost || {})) {
    if (key === 'gold' && state.gold < amount) return '\u91d1\u5e01\u4e0d\u8db3';
    if (key !== 'gold' && (state.materials?.[key] || 0) < amount) {
      const name = ctx.getMaterialName?.(key) || `\u672a\u77e5\u6750\u6599(${key})`;
      return `${name}\u4e0d\u8db3`;
    }
  }
  return null;
}

export function buyShopItem(itemId, ctx = shopContext) {
  const state = ctx.getState?.();
  if (!state) return;
  const tab = state.shopActiveTab || ctx.getShopActiveTab?.() || 'normal';
  const shopItems = ctx.getShopItems?.() || {};
  const list = shopItems[tab];
  if (!list) return;
  const item = list.find((i) => i.id === itemId);
  if (!item) return;
  const blockReason = canBuyShopItem(item, ctx);
  if (blockReason) { ctx.showToast?.(blockReason); return; }
  for (const [key, amount] of Object.entries(item.cost || {})) {
    if (key === 'gold') state.gold = finite(state.gold) - finite(amount);
    else state.materials[key] = finite(state.materials?.[key]) - finite(amount);
  }
  const countType = item.totalLimit ? 'total' : item.weeklyLimit ? 'weekly' : 'daily';
  if (countType === 'total') state.shopState.totalPurchases[itemId] = (state.shopState.totalPurchases[itemId] || 0) + 1;
  else if (countType === 'weekly') state.shopState.weeklyPurchases[itemId] = (state.shopState.weeklyPurchases[itemId] || 0) + 1;
  else state.shopState.dailyPurchases[itemId] = (state.shopState.dailyPurchases[itemId] || 0) + 1;
  if (item.priceScale) {
    const count = getShopPurchaseCount(itemId, 'total', ctx);
    item.cost.gold = Math.round(1000000 * Math.pow(item.priceScale, count));
  }
  if (item.reward?.materials && ctx.addMaterials) ctx.addMaterials(item.reward.materials);
  if (item.reward?.materialBox) {
    Object.entries(item.reward.materialBox).forEach(([mat, range]) => {
      const qty = ctx.randomInt?.(range[0], range[1]) || 0;
      if (qty > 0 && ctx.addMaterials) ctx.addMaterials({ [mat]: qty });
    });
  }
  ctx.addLog?.(`\u5546\u5e97\u8d2d\u4e70\uff1a${item.name}\u3002`);
  ctx.showToast?.(`\u8d2d\u4e70\u6210\u529f\uff1a${item.name}`);
  ctx.renderAll?.();
  ctx.save?.();
}

export function installShopRuntime(context = {}) {
  configureShopContext(context);
  const runtime = Object.freeze({
    normalizeShopState,
    getShopPurchaseCount,
    formatShopCostItem,
    formatShopCost,
    formatShopLimitText,
    canBuyShopItem,
    buyShopItem,
  });
  window.RuneFrontierShopRuntime = runtime;
  return runtime;
}
