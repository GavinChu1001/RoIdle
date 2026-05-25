export function renderOfflineRewardModal() {
  if (typeof window.renderOfflineRewardModal === 'function') return window.renderOfflineRewardModal();
}
export function renderRefineResultModal() {
  if (typeof window.renderRefineResultModal === 'function') return window.renderRefineResultModal();
}
export function showRefineResultModal(result) {
  if (typeof window.showRefineResultModal === 'function') return window.showRefineResultModal(result);
}
export function closeRefineResultModal() {
  if (typeof window.closeRefineResultModal === 'function') return window.closeRefineResultModal();
}
