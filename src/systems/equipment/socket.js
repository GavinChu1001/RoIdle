let socketCtx = {};

function finite(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function configureSocketContext(ctx = {}) { socketCtx = ctx || {}; }

export function getMaxEquipmentCardSlots(item = {}, ctx = socketCtx) {
  const table = ctx.getCardSocketMaxByRarity?.() || {};
  const base = table[item.rarity || 'normal'] || 0;
  const isAbyss = ctx.isAbyssEquipment?.(item) || false;
  return Math.min(5, base + (isAbyss && base > 0 ? 1 : 0));
}

export function getEquipmentCardSlotCount(item = {}, ctx = socketCtx) {
  const normalize = ctx.normalizeCardSlots || ((s) => (Array.isArray(s) ? s : []).map((sl) => ({ cardId: sl?.cardId || null })));
  return normalize(item.cardSlots).length;
}

export function getCardSocketCost(item = {}, ctx = socketCtx) {
  const current = getEquipmentCardSlotCount(item, ctx);
  const next = current + 1;
  const rarity = item.rarity || 'normal';
  if (getMaxEquipmentCardSlots(item, ctx) <= current) return null;
  if (['rare', 'epic'].includes(rarity)) return { materials: { socketStone: next }, gold: 120000 * next };
  if (['ancient', 'legend'].includes(rarity)) return { materials: { advancedSocketStone: next, crystal: 4 * next }, gold: 450000 * next };
  if (['darkGold', 'mythic'].includes(rarity)) return { materials: { mythicSocketStone: next, ancientCore: 2 * next }, gold: 1200000 * next };
  return null;
}

export function canAffordSocketCost(cost, ctx = socketCtx) {
  if (!cost) return false;
  const state = ctx.getState?.() || {};
  return state.gold >= finite(cost.gold) && ctx.hasMaterials?.(cost.materials || {});
}
