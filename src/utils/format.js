export function formatNumber(value) {
  return window.formatNumber ? window.formatNumber(value) : "0";
}
export function formatDuration(seconds) {
  return window.formatDuration ? window.formatDuration(seconds) : "0\u79d2";
}
export function percent(value) {
  return window.percent ? window.percent(value) : "0%";
}
export function escapeHtml(value) {
  return window.escapeHtml ? window.escapeHtml(value) : String(value);
}
export function escapeAttr(value) {
  return window.escapeAttr ? window.escapeAttr(value) : String(value);
}
