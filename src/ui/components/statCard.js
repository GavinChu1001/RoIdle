export function renderStatGroup(title, rows) {
  if (typeof window.renderStatGroup === 'function') return window.renderStatGroup(title, rows);
}
export function renderRefineStatDelta(delta) {
  if (typeof window.renderRefineStatDelta === 'function') return window.renderRefineStatDelta(delta);
}
export function renderOfflineOverviewCard(label, value, type) {
  if (typeof window.renderOfflineOverviewCard === 'function') return window.renderOfflineOverviewCard(label, value, type);
}
