// Offline rewards system — Phase 3 wrapper
// Delegates to game.js functions via window.

export function calculateOfflineRewards(character, offlineMs, mapId) {
  if (typeof window.calculateOfflineRewards === 'function') return window.calculateOfflineRewards(character, offlineMs, mapId);
  return { seconds: 0, gold: 0, baseExp: 0, jobExp: 0 };
}

export function buildOfflineReward(seconds) {
  if (typeof window.buildOfflineReward === 'function') return window.buildOfflineReward(seconds);
  return { seconds: 0, gold: 0 };
}

export function claimOffline() {
  if (typeof window.claimOffline === 'function') return window.claimOffline();
}

export function rollOfflineEquipmentDrops(rewards, stats, map, mapIndex, killCount) {
  if (typeof window.rollOfflineEquipmentDrops === 'function') return window.rollOfflineEquipmentDrops(rewards, stats, map, mapIndex, killCount);
}

export function rollOfflineCardDrops(rewards, stats, map, mapIndex, killCount) {
  if (typeof window.rollOfflineCardDrops === 'function') return window.rollOfflineCardDrops(rewards, stats, map, mapIndex, killCount);
}

export function rollOfflineMaterialDrops(rewards, stats, map, killCount) {
  if (typeof window.rollOfflineMaterialDrops === 'function') return window.rollOfflineMaterialDrops(rewards, stats, map, killCount);
}

export function rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills = 0) {
  if (typeof window.rollOfflineZodiacSetDrops === 'function') return window.rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills);
}

export function rollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills = 0) {
  if (typeof window.rollOfflineMythicDrops === 'function') return window.rollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills);
}

export function hasPendingOfflineRewards() {
  if (typeof window.hasPendingOfflineRewards === 'function') return window.hasPendingOfflineRewards();
  return false;
}

// Attach to window for legacy compatibility
window.Offline = { calculateOfflineRewards, buildOfflineReward, claimOffline, rollOfflineEquipmentDrops, rollOfflineCardDrops, rollOfflineMaterialDrops, rollOfflineZodiacSetDrops, rollOfflineMythicDrops, hasPendingOfflineRewards };
