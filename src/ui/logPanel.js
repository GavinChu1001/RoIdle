export function renderLog() {
  if (typeof window.renderLog === 'function') return window.renderLog();
}
