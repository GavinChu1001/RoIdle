export function recordSessionReward(delta) {
  if (typeof window.recordSessionReward === 'function') return window.recordSessionReward(delta);
}
export function getSessionRewardSummary() {
  if (typeof window.getSessionRewardSummary === 'function') return window.getSessionRewardSummary();
  return '';
}
