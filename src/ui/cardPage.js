let cardCtx = {};

function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
function esc(v) { return cardCtx.escapeHtml ? cardCtx.escapeHtml(v) : String(v || ''); }
function fmtn(v) { return cardCtx.formatNumber ? cardCtx.formatNumber(v) : String(F(v)); }

export function configureCardRenderContext(ctx = {}) { cardCtx = ctx || {}; }

function renderCardEntry(card, state, ctx = cardCtx) {
  const count = F(state.cards?.[card.id]);
  const awakened = F(state.awakenedCards?.[card.id]);
  const favorite = Boolean(state.cardFavorites?.[card.id]);
  const locked = count <= 0;
  const effect = ctx.awakenedCardEffects?.(card) || {};
  const cost = F(ctx.getAwakenCardCost?.()) || 100;
  const type = ctx.getCardType?.(card) || 'monster';
  return `<div class="card-item ${favorite ? 'favorite' : ''} ${locked ? 'locked' : ''}">
    <div>
      <span class="card-name">${esc(card.name)} x ${fmtn(count)} · 觉醒 ${fmtn(awakened)}</span>
      <p class="card-meta">${esc(ctx.cardEffectText?.(card) || '无属性')}</p>
      <p class="card-meta">${esc(ctx.cardActivationText?.(card, count) || '')}</p>
      <p class="card-meta">觉醒：六维 +${fmtn(effect.attr)} · 掉率 +${ctx.percent?.(effect.drop) || '0%'} · 对怪伤害 +${ctx.percent?.(effect.monsterDamage) || '0%'}</p>
      <p class="card-meta">用途：${esc(ctx.cardUsageText?.(type, card) || '')}</p>
      <p class="card-meta">${type === 'boss' ? '镶嵌：需要插入已打孔装备后生效；研究：后续开放。' : '持有：拥有后自动生效；研究：后续开放。'}</p>
    </div>
    <button class="ghost" data-awaken-card="${esc(card.id)}" type="button" ${count < cost ? 'disabled' : ''}>觉醒</button>
    <button class="favorite-button ${favorite ? 'active' : ''}" data-card-favorite="${esc(card.id)}" type="button" ${locked ? 'disabled' : ''}>☆</button>
  </div>`;
}

export function renderBossCardSynthesis(ctx = cardCtx) {
  const state = ctx.getState?.() || {};
  const shardCount = F(state.materials?.bossCardShard);
  const synthesisCost = F(ctx.getBossCardSynthesisCost?.()) || 100;
  const pool = ctx.getBossCardPool?.() || [];
  if (!pool.length) return '';
  const materialName = ctx.getMaterialName?.('bossCardShard') || 'Boss卡片碎片';
  return `<section class="card-type-section boss-card-synthesis">
    <h3>Boss卡合成</h3>
    <p class="card-meta">消耗 ${esc(materialName)} ×${fmtn(synthesisCost)}，可合成指定 Boss 卡。</p>
    <div class="card-synthesis-grid">${pool.map((card) => `<div class="card-item">
      <div>
        <span class="card-name">${esc(card.name)}</span>
        <p class="card-meta">${esc(ctx.cardEffectText?.(card) || '无属性')}</p>
        <p class="card-meta">碎片：${fmtn(shardCount)}/${fmtn(synthesisCost)}</p>
      </div>
      <button type="button" data-synthesize-boss-card="${esc(card.id)}" ${shardCount < synthesisCost ? 'disabled' : ''}>合成</button>
    </div>`).join('')}</div>
  </section>`;
}

export function renderCards(ctx = cardCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  if (!els.cardList) return;
  const cards = [...(ctx.getCardPool?.() || [])].sort((a, b) => {
    const favDelta = Number(Boolean(state.cardFavorites?.[b.id])) - Number(Boolean(state.cardFavorites?.[a.id]));
    return favDelta || F(a.map) - F(b.map);
  });
  const grouped = cards.reduce((result, card) => {
    const type = ctx.getCardType?.(card) || 'monster';
    result[type] = result[type] || [];
    result[type].push(card);
    return result;
  }, {});
  els.cardList.innerHTML = renderBossCardSynthesis(ctx) + Object.entries(grouped).map(([type, rows]) => `<section class="card-type-section">
    <h3>${esc(ctx.cardTypeLabel?.(type) || type)}</h3>
    ${rows.map((card) => renderCardEntry(card, state, ctx)).join('')}
  </section>`).join('');
}

export function installCardRenderRuntime(context = {}) {
  configureCardRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderCards, renderBossCardSynthesis })
    : { renderCards, renderBossCardSynthesis };
  return window.RuneFrontierRenderRuntime;
}
