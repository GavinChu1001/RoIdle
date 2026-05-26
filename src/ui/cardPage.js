let cardCtx = {};

export function configureCardRenderContext(ctx = {}) { cardCtx = ctx || {}; }

export function installCardRenderRuntime(context = {}) {
  configureCardRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, {
    renderCards() {
      const els = cardCtx.getEls?.() || {};
      if (!els.cardList) return;
      const cards = [...(window.cardPool || [])].sort((a, b) => {
        const ac = window.state?.cards?.[a.id] || 0;
        const bc = window.state?.cards?.[b.id] || 0;
        if (ac && !bc) return -1; if (!ac && bc) return 1;
        const ar = (window.rarityRank || (()=>0))(a.rarity);
        const br = (window.rarityRank || (()=>0))(b.rarity);
        return br - ar || (a.id||'').localeCompare(b.id||'');
      });
      els.cardList.innerHTML = `<div class="card-grid">${cards.map((c) => {
        const owned = (window.state?.cards?.[c.id] || 0);
        const typeLabel = (window.getCardTypeLabel || (()=>''))(c);
        return `<article class="card-item ${owned ? 'card-owned' : ''}"><span class="card-icon">${owned ? '\u2605' : '\u2606'}</span><div><strong>${(window.escapeHtml || String)(c.name)}</strong><small>${(window.escapeHtml || String)(typeLabel)} \xb7 ${owned ? owned+'\u5f20' : '\u672a\u83b7\u5f97'}</small></div></article>`;
      }).join('')}</div>${renderBossCardSynthesis()}`;
    },
    renderBossCardSynthesis() {
      const shardCount = Number((window.state?.materials || {}).bossCardShard || 0);
      const pool = window.bossCardPool || [];
      const matName = (window.materialNames || {}).bossCardShard || 'Boss\u5361\u7247\u788e\u7247';
      if (!pool.length) return '';
      return `<div class="boss-card-synthesis"><h3>Boss\u5361\u7247\u5408\u6210</h3><p>\u5f53\u524d\u788e\u7247\uff1a${shardCount} \u7247 (100\u7247\u5408\u62101\u5f20) \xb7 \u5df2\u83b7\u5f97\uff1a${pool.filter((c)=>(window.state?.cards?.[c.id]||0)>0).length}/\u5171${pool.length}\u79cd</p><div class="card-grid">${pool.map((c) => {
        const owned = (window.state?.cards?.[c.id] || 0);
        return `<article class="card-item syn-card ${owned?'card-owned':''}"><span class="card-icon">${owned?'\u2605':'\u2606'}</span><div><strong>${(window.escapeHtml||String)(c.name)}</strong><small>${owned?owned+'\u5f20':'\u672a\u5408\u6210'}</small></div><button type="button" data-synthesize-boss-card="${c.id}" ${shardCount<100?'disabled':''}>${shardCount<100?`\u9700${100-shardCount}\u788e\u7247`:'\u5408\u6210'}</button></article>`;
      }).join('')}</div></div>`;
    },
  }) : {};
  return window.RuneFrontierRenderRuntime;
}
