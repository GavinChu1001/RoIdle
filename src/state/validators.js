// State validators — ensure safety boundaries without modifying game logic
// Phase 2 delegates to game.js functions. Phase 3+ will move logic here.

export function isValidVip(vip) {
  if (!vip || typeof vip !== 'object') return false;
  return Number.isFinite(vip.level) && Number.isFinite(vip.exp) && vip.exp >= 0;
}

export function normalizePlayerState(state) {
  if (!state || typeof state !== 'object') return;
  // Ensure non-negative gold
  state.gold = Math.max(0, Number(state.gold) || 0);
  // Ensure VIP experience is non-negative
  if (state.vip) {
    state.vip.exp = Math.max(0, Math.floor(state.vip.exp || 0));
    state.vip.totalExp = Math.max(0, Math.floor(state.vip.totalExp || 0));
    state.vip.level = Math.max(0, Math.min(20, Math.floor(state.vip.level || 0)));
  }
  // Ensure material counts are non-negative
  if (state.materials) {
    Object.keys(state.materials).forEach((key) => {
      state.materials[key] = Math.max(0, Number(state.materials[key]) || 0);
    });
  }
  // Ensure inventory exists
  if (!Array.isArray(state.inventory)) state.inventory = [];
  // Ensure equipped exists
  if (!state.equipped || typeof state.equipped !== 'object') state.equipped = {};
}

export function normalizeEquipmentItem(item) {
  if (!item || typeof item !== 'object') return item;
  item.enhanceLevel = Math.max(0, Math.floor(item.enhanceLevel || 0));
  item.refine = Math.max(0, Math.floor(item.refine || 0));
  item.specialPassives = Array.isArray(item.specialPassives) ? item.specialPassives : [];
  item.cardSlots = Array.isArray(item.cardSlots) ? item.cardSlots : [];
  item.locked = Boolean(item.locked);
  return item;
}

export function debugSaveInfo() {
  if (typeof window === 'undefined' || !window.state) {
    console.log('[State Debug] No state loaded.');
    return null;
  }
  const s = window.state;
  const info = {
    saveVersion: s.saveVersion || 'legacy',
    level: s.hero?.baseLevel,
    job: s.hero?.jobId,
    gold: s.gold,
    inventory: s.inventory?.length || 0,
    equipped: Object.values(s.equipped || {}).filter(Boolean).length,
    materials: Object.keys(s.materials || {}).length,
    monsterCodex: Object.keys(s.monsterCodex || {}).length,
    cardCodex: Object.entries(s.cardCodex || {}).filter(([, c]) => c && c.obtained).length,
    vipLevel: s.vip?.level,
    vipTotalExp: s.vip?.totalExp,
    enhancedItems: (s.inventory || []).filter((i) => i.enhanceLevel > 0).length,
    refinedItems: (s.inventory || []).filter((i) => i.refine > 0).length,
    totalKills: s.totalKills,
    bestMap: s.bestMap,
  };
  console.table(info);
  return info;
}

// Attach to window for legacy game.js access
window.normalizePlayerState = normalizePlayerState;
window.normalizeEquipmentItem = normalizeEquipmentItem;
window.debugSaveInfo = debugSaveInfo;
