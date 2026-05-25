export function getDifficultyFailureHint(monster) {
  if (typeof window.getDifficultyFailureHint === 'function') return window.getDifficultyFailureHint(monster);
}
export function getPlayerWeakness(stats) {
  if (typeof window.getPlayerWeakness === 'function') return window.getPlayerWeakness(stats);
  return {};
}
export function weaknessPreset(type) {
  if (typeof window.weaknessPreset === 'function') return window.weaknessPreset(type);
  return {};
}
