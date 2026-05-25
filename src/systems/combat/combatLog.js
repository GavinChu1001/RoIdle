export function addLog(text) {
  if (typeof window.addLog === 'function') return window.addLog(text);
}
export function addLogHtml(html) {
  if (typeof window.addLogHtml === 'function') return window.addLogHtml(html);
}
