export function createDevBridge({ state, logCountFn, apiPresenceFn }) {
  const cloneForDev = (value) => {
    try { return JSON.parse(JSON.stringify(value)); }
    catch (e) { return { cloneError: e?.message || 'Unable to clone diagnostics value.' }; }
  };

  return Object.freeze({
    getSnapshot() {
      return {
        state: cloneForDev(state),
        maps: cloneForDev((window.maps || []).map((m) => ({ id: m.id, name: m.name }))),
        logCount: logCountFn ? logCountFn() : 0,
        api: apiPresenceFn ? apiPresenceFn() : {},
        moduleStatus: window.RuneFrontierModuleStatus || {},
        offlineRewards: cloneForDev(state?.offlinePending || state?.offlineRewards || {}),
      };
    },
    runMaintenance(action) {
      if (action === 'migrate') {
        if (typeof window.sanitizeProgression === 'function') window.sanitizeProgression();
        if (typeof window.save === 'function') window.save();
        if (typeof window.renderAll === 'function') window.renderAll();
        return true;
      }
      if (action === 'clear-log') {
        if (state) state.log = [];
        if (typeof window.save === 'function') window.save();
        if (typeof window.renderAll === 'function') window.renderAll();
        return true;
      }
      if (action === 'clear-recent-loot') {
        if (state) { state.recentLoot = []; state.lootNotifyUnread = false; state.lastLootViewedAt = Date.now(); }
        if (typeof window.save === 'function') window.save();
        if (typeof window.renderAll === 'function') window.renderAll();
        return true;
      }
      if (action === 'render' || action === 'renderAll') {
        if (typeof window.renderAll === 'function') window.renderAll();
        return true;
      }
      if (action === 'save') {
        if (typeof window.save === 'function') window.save();
        if (typeof window.renderAll === 'function') window.renderAll();
        return true;
      }
      return false;
    },
  });
}
