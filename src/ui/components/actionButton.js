let adviceCtx = {};

function esc(v) { return adviceCtx.escapeHtml ? adviceCtx.escapeHtml(v) : String(v); }
function fmtn(v) { return adviceCtx.formatNumber ? adviceCtx.formatNumber(v) : String(v || 0); }

export function configureAdviceRenderContext(ctx = {}) { adviceCtx = ctx || {}; }

export function renderAdvicePanel(stats, ctx = adviceCtx) {
  const s = stats || {};
  const goal = ctx.getCurrentGoal?.(s) || {};
  const weakness = ctx.getPlayerWeakness?.(s) || {};
  const actions = (ctx.getRecommendedActions?.(s, weakness) || []).slice(0, 4);
  const scoreGap = ctx.getCurrentRecommendedScoreGap?.(s, goal.gateTarget) || [];
  return `<div class="party-item advice-panel">
    <span class="party-name">\u5f53\u524d\u5efa\u8bae</span>
    <div class="advice-focus"><strong>\u5f53\u524d\u76ee\u6807\uff1a${esc(goal.title || '')}</strong><small>${esc(goal.reason || '')}</small></div>
    ${renderRecommendedScoreGap(scoreGap, ctx)}
    <div class="advice-focus"><strong>\u5f53\u524d\u77ed\u677f\uff1a${esc(weakness.title || '')}</strong><small>${esc(weakness.description || '')}</small></div>
    <div class="advice-list">
      <span>\u63a8\u8350\u63d0\u5347\uff1a${(weakness.recommended || []).map((e) => `${esc(e.name || '')}\uff08${esc(e.reason || '')}\uff09`).join('\u3001')}</span>
      ${actions.length ? actions.map((t) => `<span>${esc(t)}</span>`).join('') : '<span>\u5f53\u524d\u6210\u957f\u72b6\u6001\u826f\u597d\uff0c\u7ee7\u7eed\u6302\u673a\u5373\u53ef\u3002</span>'}
    </div></div>`;
}

export function renderRecommendedScoreGap(entries, ctx = adviceCtx) {
  if (!entries || !entries.length) return '';
  return `<div class="advice-focus advice-score-gap"><strong>\u63a8\u8350\u8bc4\u5206</strong><div class="advice-list">${entries.map((entry) => {
    const low = entry.current < entry.required * 0.88;
    return `<span class="${low ? 'warning' : ''}">${esc(entry.label)}\uff1a${fmtn(entry.current)} / ${fmtn(entry.required)}</span>`;
  }).join('')}</div></div>`;
}

export function installAdviceRenderRuntime(context = {}) {
  configureAdviceRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, { renderAdvicePanel, renderRecommendedScoreGap }) : {};
  return window.RuneFrontierRenderRuntime;
}
