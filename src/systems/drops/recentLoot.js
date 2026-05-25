export function recordRecentLoot(rewards, source) { return (typeof window.recordRecentLoot === 'function') ? window.recordRecentLoot(rewards, source) : undefined; }
export function normalizeRecentLoot(entries) { return (typeof window.normalizeRecentLoot === 'function') ? window.normalizeRecentLoot(entries) : []; }
export function recordLootFeedEntry(rewards, source, time) { return (typeof window.recordLootFeedEntry === 'function') ? window.recordLootFeedEntry(rewards, source, time) : undefined; }
