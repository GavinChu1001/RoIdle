export function renderAll() {
  if (typeof window.renderAll === 'function') return window.renderAll();
}
export function renderPages() {
  if (typeof window.renderPages === 'function') return window.renderPages();
}
export function renderFast() {
  if (typeof window.renderFast === 'function') return window.renderFast();
}
