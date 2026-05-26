let cardCtx = {};
function esc(v) { return cardCtx.escapeHtml ? cardCtx.escapeHtml(v) : String(v); }
function fmtn(v) { return cardCtx.formatNumber ? cardCtx.formatNumber(v) : String(v || 0); }

export function configureCardRenderContext(ctx = {}) { cardCtx = ctx || {}; }

export function renderCards(ctx = cardCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  if (!els.cardList) return;
  const pool = ctx.getCardPool?.() || [];
  const cards = [...pool].sort((a, b) => {
    const ac = state.cards?.[a.id] || 0;
    const bc = state.cards?.[b.id] || 0;
    if (ac && !bc) return -1; if (!ac && bc) return 1;
    const ar = ctx.rarityRank?.(a.rarity) || 0;
    const br = ctx.rarityRank?.(b.rarity) || 0;
    return br - ar || (b.id || '').localeCompare(a.id || '');
  });
  els.cardList.innerHTML = `<div class="card-grid">${cards.map((c) => {
    const owned = F(state.cards?.[c.id] || 0);
    const typeLabel = ctx.getCardTypeLabel?.(c) || '';
    return `<article class="card-item ${owned ? 'card-owned' : ''}" data-tooltip="${ctx.escapeAttr?.(ctx.cardTooltip?.(c) || '') || ''}">
      <span class="card-icon">${owned ? '\u2605' : '\u2606'}</span>
      <div><strong>${esc(c.name)}</strong><small>${esc(typeLabel)} \xb7 ${owned ? fmtn(owned) + '\u5f20' : '\u672a\u83b7\u5f97'}</small></div></article>`;
  }).join('')}</div>${renderBossCardSynthesis(ctx)}`;
}

function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function renderBossCardSynthesis(ctx = cardCtx) {
  const state = ctx.getState?.() || {};
  const shardCount = F(state.materials?.bossCardShard);
  const bossCardPool = ctx.getBossCardPool?.() || [];
  const totalBossCardObtained = bossCardPool.filter((c) => F(state.cards?.[c.id]) > 0).length;
  const matName = ctx.getMaterialName?.('bossCardShard') || 'Boss\u5361\u7247\u788e\u7247';
  if (!bossCardPool.length) return '';
  return `<div class="boss-card-synthesis">
    <h3>Boss\u5361\u7247\u5408\u6210</h3>
    <p>\u5f53\u524d\u788e\u7247\uff1a${fmtn(shardCount)} \u7247 (100\u7247\u5408\u6210 1\u5f20) \xb7 \u5df2\u83b7\u5f97\uff1a${totalBossCardObtained}/\u5171${bossCardPool.length}\u79cd</p>
    <div class="card-grid">${bossCardPool.map((c) => {
      const owned = F(state.cards?.[c.id] || 0);
      return `<article class="card-item syn-card ${owned ? 'card-owned' : ''}">
        <span class="card-icon">${owned ? '\u2605' : '\u2606'}</span>
        <div><strong>${esc(c.name)}</strong><small>${owned ? fmtn(owned) + '\u5f20' : '\u672a\u5408\u6210'}</small></div>
        <button type="button" data-synthesize-boss-card="${c.id}" ${shardCount < 100 || F(state.inventory?.length) >= ctx.getInventoryLimit?.() ? 'disabled' : ''}>${shardCount < 100 ? `\u9700 ${fmtn(100 - shardCount)} \u788e\u7247` : '\u5408\u6210'}</button>
      </article>`;
    }).join('')}</div></div>`;
}

export function installCardRenderRuntime(context = {}) {
  configureCardRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, { renderCards, renderBossCardSynthesis }) : { renderCards, renderBossCardSynthesis };
  return window.RuneFrontierRenderRuntime;
}
