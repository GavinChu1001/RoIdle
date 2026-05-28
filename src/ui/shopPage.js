let shopCtx = {};

function esc(v) { return shopCtx.escapeHtml ? shopCtx.escapeHtml(v) : String(v); }

export function configureShopRenderContext(ctx = {}) { shopCtx = ctx || {}; }

export function renderShop(ctx = shopCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  if (!els.shopContent) return;

  const tab = state.shopActiveTab || 'normal';
  const shopItems = (typeof window !== 'undefined' && typeof window.SHOP_ITEMS !== 'undefined') ? window.SHOP_ITEMS : (ctx.getShopItems ? ctx.getShopItems() : {});
  const list = (shopItems[tab] || []);

  if (ctx.normalizeShopState) ctx.normalizeShopState();

  const shopTabs = typeof document !== 'undefined' ? document.querySelectorAll('[data-shop-tab]') : [];
  shopTabs.forEach((btn) => { btn.classList.toggle('active', btn.dataset.shopTab === tab); });

  const hasAbyss = state.mapDifficultyProgress && Object.values(state.mapDifficultyProgress).some((d) => d.abyss?.unlocked || d.abyss?.cleared);

  const buyCheck = ctx.canBuyShopItem || (() => null);
  const limitTextFn = ctx.formatShopLimitText || (() => '');
  const costFn = ctx.formatShopCost || (() => '');

  els.shopContent.innerHTML = `<div class="codex-grid">${list.map((item) => {
    const reason = buyCheck(item);
    const locked = reason && !reason.includes('\u4e0d\u8db3') ? reason : '';
    const btnDisabled = reason ? 'disabled' : '';
    const btnText = reason || '\u8d2d\u4e70';
    const limitText = limitTextFn(item);
    const costText = costFn(item.cost);
    return `<article class="shop-card ${locked ? 'locked' : ''}">
      <div class="shop-head"><strong>${esc(item.name)}</strong>${limitText ? `<small>${limitText}</small>` : ''}</div>
      <p class="shop-desc">${esc(item.desc)}</p>
      <p class="shop-cost">\u4ef7\u683c\uff1a${esc(costText)}</p>
      ${locked ? `<p class="shop-lock">${esc(locked)}</p>` : ''}
      <button type="button" data-buy-shop="${item.id}" ${btnDisabled}>${esc(btnText)}</button>
    </article>`;
  }).join('')}</div>`;
}

export function installShopRenderRuntime(context = {}) {
  configureShopRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, { renderShop }) : { renderShop };
  return window.RuneFrontierRenderRuntime;
}
