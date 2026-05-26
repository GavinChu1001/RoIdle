export function createDevBridge(context = {}) {
  const cloneForDev = (value) => {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (e) { return { cloneError: e?.message || 'Unable to clone diagnostics value.' }; }
  };

  return Object.freeze({
    getSnapshot() {
      const state = context.getState?.() || {};
      return {
        state: cloneForDev(state),
        maps: cloneForDev(context.getMaps?.() || []),
        mapDropTableAlias: cloneForDev(context.getMapDropTableAlias?.() || {}),
        equipmentDropTables: cloneForDev(context.getEquipmentDropTables?.() || {}),
        materialDropTables: cloneForDev(context.getMaterialDropTables?.() || {}),
        materialNames: cloneForDev(context.getMaterialNames?.() || {}),
        materialDb: cloneForDev(context.getMaterialDb?.() || {}),
        inventoryLimit: Number(context.getInventoryLimit?.() || 0),
        vipProgress: cloneForDev(context.getVipProgressInfo?.() || {}),
        playerCritRateCap: Number(context.getPlayerCritRateCap?.() || 0),
        api: cloneForDev(context.getApiPresence?.() || {}),
        moduleStatus: window.RuneFrontierModuleStatus || {},
        offlineRewards: cloneForDev(state.offlinePending || state.offlineRewards || {}),
      };
    },
    runMaintenance(action) {
      const state = context.getState?.();
      if (action === 'migrate') {
        context.sanitizeProgression?.();
        context.save?.();
        context.renderAll?.();
        return true;
      }
      if (action === 'clear-log') {
        if (state) state.log = [];
        context.save?.();
        context.renderAll?.();
        return true;
      }
      if (action === 'clear-recent-loot') {
        if (state) { state.recentLoot = []; state.lootNotifyUnread = false; state.lastLootViewedAt = Date.now(); }
        context.save?.();
        context.renderAll?.();
        return true;
      }
      if (action === 'render' || action === 'renderAll') {
        context.renderAll?.();
        return true;
      }
      if (action === 'save') {
        context.save?.();
        context.renderAll?.();
        return true;
      }
      return false;
    },
  });
}
