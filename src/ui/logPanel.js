let logCtx = {};
function esc(v) { return logCtx.escapeHtml ? logCtx.escapeHtml(v) : String(v); }

export function configureLogRenderContext(ctx = {}) { logCtx = ctx || {}; }

export function renderLog(ctx = logCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  if (!els.logList) return;
  els.logList.innerHTML = (state.log || []).map((entry) => {
    if (typeof entry === 'object' && entry.html) return `<li>${entry.html}</li>`;
    return `<li>${esc(String(entry))}</li>`;
  }).join('');
}

export function installLogRenderRuntime(context = {}) {
  configureLogRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, { renderLog }) : { renderLog };
  return window.RuneFrontierRenderRuntime;
}
