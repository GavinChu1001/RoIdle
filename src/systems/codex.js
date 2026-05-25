// Codex / Bestiary system — Phase 3 wrapper
// Delegates to game.js functions via window.
// Future Phase 4+: move actual function bodies here.

export function getCodexBonusStats() {
  if (typeof window.getCodexBonusStats === 'function') return window.getCodexBonusStats();
  return {};
}

export function getCodexBonuses() {
  if (typeof window.getCodexBonuses === 'function') return window.getCodexBonuses();
  return {};
}

export function getTotalCodexLevel() {
  if (typeof window.getTotalCodexLevel === 'function') return window.getTotalCodexLevel();
  return 0;
}

export function getMonsterMasteryLevel(killCount) {
  if (typeof window.getMonsterMasteryLevel === 'function') return window.getMonsterMasteryLevel(killCount);
  return 0;
}

export function getCardResearchLevel(obtainCount) {
  if (typeof window.getCardResearchLevel === 'function') return window.getCardResearchLevel(obtainCount);
  return 0;
}

export function claimCodexReward(type, monsterId, milestone) {
  if (typeof window.claimCodexReward === 'function') return window.claimCodexReward(type, monsterId, milestone);
}

export function buildMonsterNameMap() {
  if (typeof window.buildMonsterNameMap === 'function') return window.buildMonsterNameMap();
  return {};
}

export function buildMonsterSourceMap() {
  if (typeof window.buildMonsterSourceMap === 'function') return window.buildMonsterSourceMap();
  return {};
}

export function buildMonsterCardDropMap() {
  if (typeof window.buildMonsterCardDropMap === 'function') return window.buildMonsterCardDropMap();
  return {};
}

export function getMonsterTypeLabel(id) {
  if (typeof window.getMonsterTypeLabel === 'function') return window.getMonsterTypeLabel(id);
  return '普通';
}

// Attach to window for legacy compatibility
window.Codex = { getCodexBonusStats, getCodexBonuses, getTotalCodexLevel, getMonsterMasteryLevel, getCardResearchLevel, claimCodexReward, buildMonsterNameMap, buildMonsterSourceMap, buildMonsterCardDropMap, getMonsterTypeLabel };
