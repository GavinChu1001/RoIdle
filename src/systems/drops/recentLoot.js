let runtimeContext = {};

export function configureRecentLootContext(context = {}) {
  runtimeContext = context || {};
}

function hasLootContent(rewards, context = runtimeContext) {
  return rewards.gold > 0 ||
    rewards.baseExp > 0 ||
    rewards.jobExp > 0 ||
    rewards.equipments.length > 0 ||
    rewards.cards.length > 0 ||
    rewards.materials.length > 0 ||
    (context.objectTotal?.(rewards.autoSalvagedMaterials) || 0) > 0;
}

export function normalizeRecentLoot(entries = [], context = runtimeContext) {
  if (!Array.isArray(entries)) return [];
  const now = context.now?.() || Date.now();
  return entries
    .map((entry) => ({
      id: entry?.id || `loot-${now.toString(36)}`,
      source: entry?.source || '\u6700\u8fd1\u6218\u5229\u54c1',
      time: Number(entry?.time || entry?.createdAt || now),
      rewards: context.normalizeRewards?.(entry?.rewards || entry || {}) || {},
    }))
    .filter((entry) => hasLootContent(entry.rewards, context))
    .sort((a, b) => b.time - a.time)
    .slice(0, 12);
}

export function recordRecentLoot(rewards = {}, source = '\u6700\u8fd1\u6218\u5229\u54c1', context = runtimeContext) {
  const state = context.getState?.();
  if (!state) return;
  const normalized = context.normalizeRewards?.(rewards) || {};
  if (!hasLootContent(normalized, context)) return;
  const time = context.now?.() || Date.now();
  const entry = {
    id: context.createEntryId?.(time) || `loot-${time.toString(36)}`,
    source,
    time,
    rewards: normalized,
  };
  state.recentLoot = [entry, ...normalizeRecentLoot(state.recentLoot, context)].slice(0, 12);
  const hasRealLoot = normalized.equipments.length > 0 ||
    normalized.cards.length > 0 ||
    normalized.materials.length > 0 ||
    (context.objectTotal?.(normalized.autoSalvagedMaterials) || 0) > 0 ||
    source.includes('\u79bb\u7ebf');
  if (hasRealLoot) state.lootNotifyUnread = true;
  state.lastLootUpdatedAt = entry.time;
}

export function recordLootFeedEntry(rewards, source, time) {
  if (typeof window.recordLootFeedEntry === 'function') return window.recordLootFeedEntry(rewards, source, time);
}
