let mutationCtx = {};

function finite(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function configureEquipmentMutationContext(ctx = {}) { mutationCtx = ctx || {}; }

export function addEquipmentToInventory(item, options = {}, ctx = mutationCtx) {
  const state = ctx.getState?.();
  if (!state) return { added: false };
  const normalized = ctx.normalizeItem?.(item) || item;
  if (shouldAutoSalvage(normalized, ctx)) {
    const rewards = getSalvageRewards(normalized, ctx);
    ctx.addMaterials?.(rewards);
    if (!options.offline) ctx.recordSessionReward?.({ autoSalvaged: 1, materials: Object.values(rewards).reduce((s, a) => s + Number(a || 0), 0) });
    if (!options.offline) ctx.recordRecentLoot?.({ autoSalvagedMaterials: rewards, salvagedMaterials: rewards }, '自动分解');
    if (!options.offline) ctx.recordAutoSalvageBatch?.(rewards);
    ctx.showAutoSalvageFeedback?.(normalized, rewards, options);
    if (options.logDrop) ctx.logAutoSalvage?.(normalized, rewards);
    return { added: false, salvaged: true, rewards };
  }
  if ((state.inventory || []).length >= (ctx.getInventoryLimit?.() || 48)) {
    if (options.logDrop) ctx.logInventoryFull?.();
    return { added: false, skipped: true };
  }
  if (!state.inventory) state.inventory = [];
  state.inventory.unshift(normalized);
  if (!options.offline) {
    ctx.recordEquipmentSessionReward?.(normalized);
    ctx.updateDailyGoalProgress?.('daily_equipment', 1);
  }
  ctx.trackEquipmentAchievement?.(normalized);
  if (options.logDrop) {
    ctx.addDropLog?.(normalized);
    if (!options.offline) ctx.showDropFeedback?.(normalized);
  }
  if (!options.offline) {
    const source = ctx.isAbyssEquipment?.(normalized) ? '深渊装备掉落' : ctx.isBossEncounter?.() ? 'Boss装备掉落' : '装备掉落';
    ctx.recordRecentLoot?.({ equipments: [normalized], equipment: [normalized] }, source);
  }
  return { added: true };
}

export function getSalvageRewards(item, ctx = mutationCtx) {
  const tier = item.tier || item.rarity || 'normal';
  const table = ctx.getSalvageTable?.(tier) || ctx.getSalvageTable?.() || {};
  const tbl = (table[tier] || table.normal || table);
  const rewards = {};
  Object.entries(tbl).forEach(([material, range]) => {
    const r = Array.isArray(range) ? range : [1, 1];
    rewards[material] = ctx.randomInt?.(r[0], r[1]) + Math.floor(finite(item.level) / 12);
  });
  if (ctx.isAbyssEquipment?.(item)) {
    const rank = Math.max(0, ctx.rarityRank?.(item.rarity) || 0);
    rewards.abyssShard = finite(rewards.abyssShard) + 2 + Math.floor(finite(item.level) / 20) + rank;
    if (rank >= (ctx.rarityRank?.('epic') || 2)) rewards.abyssCore = finite(rewards.abyssCore) + (rank >= (ctx.rarityRank?.('mythic') || 4) ? 3 : rank >= (ctx.rarityRank?.('darkGold') || 3) ? 2 : 1);
  }
  return rewards;
}

export function shouldAutoSalvage(item, ctx = mutationCtx) {
  const state = ctx.getState?.() || {};
  const setting = state.autoSalvage || {};
  if (!setting.enabled || item.locked || item.setId || item.rarity === 'mythic' || item.rarity === 'darkGold') return false;
  if (ctx.isAbyssEquipment?.(item) && !(setting.autoDismantleAbyss || state.autoDismantleAbyss)) return false;
  if (ctx.shouldProtectEquipment?.(item)) return false;
  const rankFn = ctx.rarityRank || (() => 0);
  return rankFn(item.rarity) >= 0 && rankFn(item.rarity) <= rankFn(setting.maxRarity || 'normal');
}

export function salvageItem(id, options = {}, ctx = mutationCtx) {
  const state = ctx.getState?.();
  if (!state) return { ok: false };
  const item = (state.inventory || []).find((e) => e.id === id);
  if (!item) return { ok: false };
  if (item.locked) { if (!options.silent) ctx.showToast?.('已锁定的装备不能分解'); return { ok: false }; }
  if (Object.values(state.equipped || {}).includes(id)) { if (!options.silent) ctx.showToast?.('已装备的物品不能分解'); return { ok: false }; }
  const rewards = getSalvageRewards(item, ctx);
  ctx.addMaterials?.(rewards);
  state.inventory = (state.inventory || []).filter((e) => e.id !== id);
  const name = ctx.getDisplayItemName?.(item) || item.name || '装备';
  ctx.addLog?.(`分解 ${name}，获得 ${ctx.materialText?.(rewards) || ''}。`);
  if (!options.silent) ctx.showSalvageResult?.('分解完成', 1, rewards);
  ctx.renderAll?.();
  ctx.save?.();
  return { ok: true, item, rewards };
}

export function salvageAllUnequipped(ctx = mutationCtx) {
  const state = ctx.getState?.();
  if (!state) return;
  const equippedIds = new Set(Object.values(state.equipped || {}).filter(Boolean));
  const targets = (state.inventory || []).filter((item) => !equippedIds.has(item.id) && !item.locked && !ctx.shouldProtectEquipment?.(item));
  if (!targets.length) { ctx.showToast?.('没有可分解的未穿戴装备'); return; }
  const targetIds = new Set(targets.map((item) => item.id));
  const totals = {};
  targets.forEach((item) => {
    const rewards = getSalvageRewards(item, ctx);
    Object.entries(rewards).forEach(([material, amount]) => {
      totals[material] = finite(totals[material]) + amount;
      state.materials[material] = finite(state.materials?.[material]) + amount;
    });
  });
  state.inventory = (state.inventory || []).filter((item) => !targetIds.has(item.id));
  ctx.addLog?.(`批量分解 ${targets.length} 件未穿戴装备，获得 ${ctx.materialText?.(totals) || ''}。`);
  ctx.showSalvageResult?.('批量分解完成', targets.length, totals);
  ctx.renderAll?.();
  ctx.save?.();
}

export function equipBest(ctx = mutationCtx) {
  const state = ctx.getState?.();
  if (!state) return;
  const slotFn = ctx.equipmentSlot || ((i) => i?.slot || 'weapon');
  const scoreFn = ctx.itemScore || (() => 0);
  ['weapon', 'armor', 'headgear', 'shoes', 'trinket'].forEach((slot) => {
    const best = (state.inventory || []).filter((item) => slotFn(item) === slot).sort((a, b) => scoreFn(b) - scoreFn(a))[0];
    if (best) state.equipped[slot] = best.id;
  });
  ctx.addLog?.('工坊已整理装备。');
  ctx.renderAll?.();
}
