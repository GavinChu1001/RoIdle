let runtimeContext = {};

export function configureEquipmentMutationContext(context = {}) {
  runtimeContext = context || {};
}

export function getSalvageRewards(item = {}, context = runtimeContext) {
  const tier = item.tier || item.rarity || 'normal';
  const table = context.getSalvageTable?.(tier) || context.getSalvageTable?.('normal') || {};
  const rewards = {};
  Object.entries(table).forEach(([material, range]) => {
    rewards[material] = context.randomInt?.(range[0], range[1]) + Math.floor((item.level || 1) / 12);
  });
  if (context.isAbyssEquipment?.(item)) {
    const rank = Math.max(0, context.rarityRank?.(item.rarity) || 0);
    rewards.abyssShard = (rewards.abyssShard || 0) + 2 + Math.floor((item.level || 1) / 20) + rank;
    if (rank >= (context.rarityRank?.('epic') || 0)) {
      rewards.abyssCore = (rewards.abyssCore || 0) + (rank >= context.rarityRank?.('mythic') ? 3 : rank >= context.rarityRank?.('darkGold') ? 2 : 1);
    }
  }
  return rewards;
}

export function shouldAutoSalvage(item = {}, context = runtimeContext) {
  const state = context.getState?.() || {};
  const setting = state.autoSalvage || {};
  if (!setting.enabled || item.locked || item.setId || item.rarity === 'mythic' || item.rarity === 'darkGold') return false;
  if (context.isAbyssEquipment?.(item) && !(setting.autoDismantleAbyss || state.autoDismantleAbyss)) return false;
  const rank = context.rarityRank?.(item.rarity);
  const maxRank = context.rarityRank?.(setting.maxRarity || 'normal');
  return Number.isFinite(rank) && Number.isFinite(maxRank) && rank >= 0 && rank <= maxRank;
}

export function addEquipmentToInventory(item, options = {}, context = runtimeContext) {
  const state = context.getState?.();
  if (!state || !Array.isArray(state.inventory)) return { added: false, error: 'state-unavailable' };
  const normalized = context.normalizeItem?.(item) || item;
  if (shouldAutoSalvage(normalized, context)) {
    const rewards = getSalvageRewards(normalized, context);
    context.addMaterials?.(rewards);
    if (!options.offline) {
      context.recordSessionReward?.({ autoSalvaged: 1, materials: Object.values(rewards).reduce((sum, amount) => sum + Number(amount || 0), 0) });
      context.recordRecentLoot?.({ autoSalvagedMaterials: rewards, salvagedMaterials: rewards }, '\u81ea\u52a8\u5206\u89e3');
      context.recordAutoSalvageBatch?.(rewards);
    }
    context.showAutoSalvageFeedback?.(normalized, rewards, options);
    if (options.logDrop) context.logAutoSalvage?.(normalized, rewards);
    return { added: false, salvaged: true, rewards };
  }
  if (state.inventory.length >= (context.getInventoryLimit?.() || 0)) {
    if (options.logDrop) context.logInventoryFull?.();
    return { added: false, skipped: true };
  }
  state.inventory.unshift(normalized);
  if (!options.offline) {
    context.recordEquipmentSessionReward?.(normalized);
  }
  context.trackEquipmentAchievement?.(normalized);
  if (options.logDrop) {
    context.addDropLog?.(normalized);
    if (!options.offline) context.showDropFeedback?.(normalized);
  }
  if (!options.offline) {
    const source = context.isAbyssEquipment?.(normalized)
      ? '\u6df1\u6e0a\u88c5\u5907\u6389\u843d'
      : context.isBossEncounter?.()
        ? 'Boss\u88c5\u5907\u6389\u843d'
        : '\u88c5\u5907\u6389\u843d';
    context.recordRecentLoot?.({ equipments: [normalized], equipment: [normalized] }, source);
  }
  return { added: true };
}

export function salvageItem(id, options = {}, context = runtimeContext) {
  const state = context.getState?.();
  const item = state?.inventory?.find((entry) => entry.id === id);
  if (!item) return { ok: false };
  if (item.locked) {
    if (!options.silent) context.showToast?.('\u5df2\u9501\u5b9a\u7684\u88c5\u5907\u4e0d\u80fd\u5206\u89e3');
    return { ok: false };
  }
  if (Object.values(state.equipped || {}).includes(id)) {
    if (!options.silent) context.showToast?.('\u5df2\u88c5\u5907\u7684\u7269\u54c1\u4e0d\u80fd\u5206\u89e3');
    return { ok: false };
  }
  const rewards = getSalvageRewards(item, context);
  context.addMaterials?.(rewards);
  state.inventory = state.inventory.filter((entry) => entry.id !== id);
  context.logManualSalvage?.(item, rewards);
  if (!options.silent) context.showSalvageResult?.(1, rewards);
  context.render?.();
  context.save?.();
  return { ok: true, item, rewards };
}

export function salvageAllUnequipped() {
  if (typeof window.salvageAllUnequipped === 'function') return window.salvageAllUnequipped();
}

export function equipBest() {
  if (typeof window.equipBest === 'function') return window.equipBest();
}
