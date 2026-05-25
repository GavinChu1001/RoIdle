let runtimeContext = {};

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

export function configureOfflineContext(context = {}) {
  runtimeContext = context || {};
}

export function calculateOfflineRewards(character, offlineMs, mapId, context = runtimeContext) {
  return context.calculateOfflineRewards?.(character, offlineMs, mapId) || { seconds: 0, gold: 0, baseExp: 0, jobExp: 0 };
}

export function buildOfflineReward(seconds, context = runtimeContext) {
  return context.buildOfflineReward?.(seconds) || { seconds: 0, gold: 0, baseExp: 0, jobExp: 0, equipments: [], cards: [], materials: [] };
}

export function getPendingOfflineRewards(context = runtimeContext) {
  const state = context.getState?.() || {};
  return context.normalizeLootRewards?.(state.offlinePending || state.offlineRewards || {}) || {};
}

export function hasPendingOfflineRewards(context = runtimeContext) {
  const pending = getPendingOfflineRewards(context);
  return Boolean(
    finite(pending.seconds) > 0 ||
    finite(pending.gold) > 0 ||
    finite(pending.baseExp) > 0 ||
    finite(pending.jobExp) > 0 ||
    list(pending.equipments).length ||
    list(pending.cards).length ||
    list(pending.materials).length ||
    finite(context.objectTotal?.(pending.autoSalvagedMaterials)) > 0
  );
}

export function markLootViewed(context = runtimeContext) {
  const state = context.getState?.();
  if (!state) return;
  state.lootNotifyUnread = false;
  state.lastLootViewedAt = context.now?.() || Date.now();
}

export function getLootRewardsForView(context = runtimeContext) {
  if (hasPendingOfflineRewards(context)) return getPendingOfflineRewards(context);
  const state = context.getState?.() || {};
  return context.getLatestRecentLootRewards?.(state) || null;
}

export function processGeneratedOfflineEquipment(rewards, items = [], capacityState = {}, options = {}, context = runtimeContext) {
  const equipment = context.getEquipmentRuntime?.();
  const result = rewards || {};
  result.equipments = list(result.equipments);
  result.materials = list(result.materials);
  const capacity = capacityState || {};
  capacity.freeSlots = Math.max(0, finite(capacity.freeSlots));
  list(items).forEach((item) => {
    if (equipment?.shouldAutoSalvage?.(item)) {
      context.mergeMaterialReward?.(result.materials, equipment.getSalvageRewards(item));
      return;
    }
    if (capacity.freeSlots <= 0) {
      if (context.canOfflineFullSalvage?.(item, options)) {
        context.mergeMaterialReward?.(result.materials, equipment?.getSalvageRewards?.(item) || {});
      } else {
        result.equipments.push(item);
      }
      return;
    }
    capacity.freeSlots -= 1;
    result.equipments.push(item);
  });
  return capacity;
}

export function claimOfflineRewards(context = runtimeContext) {
  const state = context.getState?.();
  const equipment = context.getEquipmentRuntime?.();
  if (!state || !equipment) return false;
  const pending = getPendingOfflineRewards(context);
  if (!hasPendingOfflineRewards(context)) {
    context.showToast?.('\u6682\u65e0\u79bb\u7ebf\u6536\u76ca');
    return false;
  }

  state.gold = finite(state.gold) + finite(pending.gold);
  context.gainExp?.(finite(pending.baseExp), finite(pending.jobExp));

  const claimedEquipment = [];
  const unclaimedEquipment = [];
  const offlineAutoSalvaged = {};
  list(pending.equipments).forEach((item) => {
    const result = equipment.addEquipmentToInventory(item, { logDrop: false, offline: true }) || {};
    if (result.added) claimedEquipment.push(item);
    if (result.skipped) unclaimedEquipment.push(item);
    if (result.salvaged) {
      Object.entries(object(result.rewards)).forEach(([id, qty]) => {
        offlineAutoSalvaged[id] = finite(offlineAutoSalvaged[id]) + finite(qty);
      });
    }
  });

  context.grantCards?.(list(pending.cards));
  context.grantMaterials?.(list(pending.materials));

  const summary = {
    ...pending,
    equipment: claimedEquipment,
    equipments: claimedEquipment,
    pendingEquipment: unclaimedEquipment,
    autoSalvagedMaterials: offlineAutoSalvaged,
    salvagedMaterials: offlineAutoSalvaged,
    skippedEquipment: unclaimedEquipment.length,
  };
  const nextPending = context.createEmptyRewards?.() || { equipments: [], cards: [], materials: [], autoSalvagedMaterials: {} };
  if (unclaimedEquipment.length) {
    nextPending.seconds = 1;
    nextPending.equipments = unclaimedEquipment;
    nextPending.skippedEquipment = unclaimedEquipment.length;
  }

  state.lastOfflineRewardsForView = summary;
  state.offlinePending = nextPending;
  state.offlineRewards = nextPending;
  context.recordRecentLoot?.(summary, '\u79bb\u7ebf\u6536\u76ca');
  context.afterClaim?.(summary, nextPending);
  return true;
}

export function rollOfflineEquipmentDrops(rewards, stats, map, mapIndex, killCount, context = runtimeContext) {
  return context.rollOfflineEquipmentDrops?.(rewards, stats, map, mapIndex, killCount);
}

export function rollOfflineCardDrops(rewards, stats, map, mapIndex, killCount, context = runtimeContext) {
  return context.rollOfflineCardDrops?.(rewards, stats, map, mapIndex, killCount);
}

export function rollOfflineMaterialDrops(rewards, stats, map, killCount, context = runtimeContext) {
  return context.rollOfflineMaterialDrops?.(rewards, stats, map, killCount);
}

export function rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills = 0, context = runtimeContext) {
  return context.rollOfflineZodiacSetDrops?.(rewards, stats, map, killCount, mutationKills);
}

export function rollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills = 0, context = runtimeContext) {
  return context.rollOfflineMythicDrops?.(rewards, stats, map, killCount, mutationKills);
}

export function installOfflineRuntime(context = {}) {
  configureOfflineContext(context);
  const runtime = Object.freeze({
    calculateOfflineRewards,
    buildOfflineReward,
    claimOffline: claimOfflineRewards,
    getPendingOfflineRewards,
    hasPendingOfflineRewards,
    getLootRewardsForView,
    processGeneratedOfflineEquipment,
    claimOfflineRewards,
    markLootViewed,
    rollOfflineEquipmentDrops,
    rollOfflineCardDrops,
    rollOfflineMaterialDrops,
    rollOfflineZodiacSetDrops,
    rollOfflineMythicDrops,
  });
  window.RuneFrontierOfflineRuntime = runtime;
  window.Offline = runtime;
  return runtime;
}
