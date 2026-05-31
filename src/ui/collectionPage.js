let collectionRenderCtx = {};

function esc(value) {
  return (collectionRenderCtx.escapeHtml || window.escapeHtml || String)(value);
}

function fmtn(value) {
  return (collectionRenderCtx.formatNumber || window.formatNumber || String)(Number(value || 0));
}

function getCollectionSummary(state) {
  const builder = collectionRenderCtx.buildCollectionSummary
    || window.RuneFrontierCollectionRuntime?.buildCollectionSummary;
  if (typeof builder === 'function') return builder(state);
  return { equipmentCount: 0, cardCount: 0, bossCount: 0, mapCount: 0 };
}

function renderCountCard(label, value, note) {
  return `<article class="collection-card">
    <span>${esc(label)}</span>
    <strong>${fmtn(value)}</strong>
    <small>${esc(note)}</small>
  </article>`;
}

export function configureCollectionRenderContext(ctx = {}) {
  collectionRenderCtx = ctx || {};
}

export function renderCollectionPage() {
  const els = collectionRenderCtx.getEls?.() || window.els || {};
  if (!els.collectionPage) return;

  const state = collectionRenderCtx.getState?.() || window.state || {};
  const summary = getCollectionSummary(state);
  const equipmentCount = summary.equipmentCount || 0;
  const cardCount = summary.cardCount || 0;
  const bossCount = summary.bossCount || 0;
  const mapCount = summary.mapCount || 0;

  els.collectionPage.innerHTML = `<section class="collection-page">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">长期收藏</p>
        <h2>图鉴进度</h2>
      </div>
    </div>
    <div class="collection-grid">
      ${renderCountCard('装备图鉴', equipmentCount, '记录已发现的装备条目')}
      ${renderCountCard('卡片图鉴', cardCount, '记录已获得的卡片')}
      ${renderCountCard('Boss 记录', bossCount, '记录已挑战过的首领')}
      ${renderCountCard('地图完成度', mapCount, '记录地图探索与产出')}
    </div>
    <p class="collection-note">收藏奖励克制，主要提供来源提示、少量材料和长期完成度。</p>
  </section>`;
}

export function installCollectionRenderRuntime(context = {}) {
  configureCollectionRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderCollectionPage })
    : { renderCollectionPage };
  return window.RuneFrontierRenderRuntime;
}
