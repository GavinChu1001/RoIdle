let dungeonRenderCtx = {};

function esc(value) {
  return (dungeonRenderCtx.escapeHtml || window.escapeHtml || String)(value);
}

function fmtn(value) {
  return (dungeonRenderCtx.formatNumber || window.formatNumber || String)(Number(value || 0));
}

function rewardText(reward = {}) {
  const parts = [];
  if (reward.gold) parts.push(`金币 ${fmtn(reward.gold)}`);
  Object.entries(reward.materials || {}).forEach(([id, amount]) => {
    parts.push(`${esc(dungeonRenderCtx.getMaterialName?.(id) || id)} ×${fmtn(amount)}`);
  });
  return parts.join(' · ') || '无奖励';
}

export function configureDungeonRenderContext(ctx = {}) {
  dungeonRenderCtx = ctx || {};
}

export function renderDungeonPage() {
  const els = dungeonRenderCtx.getEls?.() || window.els || {};
  if (!els.dungeonPage) return;
  const cards = dungeonRenderCtx.getDungeonCards?.() || [];
  els.dungeonPage.innerHTML = `<div class="dungeon-page">${cards.map((dungeon) => {
    const locked = dungeon.remaining <= 0;
    return `<article class="dungeon-card ${locked ? 'locked' : ''}">
      <div class="dungeon-card-head">
        <div>
          <p class="eyebrow">${dungeon.type === 'trial' ? '战力试炼' : '每日资源'}</p>
          <h3>${esc(dungeon.name)}</h3>
        </div>
        <strong>${fmtn(dungeon.remaining)} / ${fmtn(dungeon.attemptsPerDay)}</strong>
      </div>
      <p class="quest-desc">${esc(dungeon.desc)}</p>
      <div class="dungeon-meta-grid">
        <span>推荐战力 <strong>${fmtn(dungeon.recommendedPower)}</strong></span>
        <span>最佳通关 <strong>${fmtn(dungeon.bestClearPower || 0)}</strong></span>
      </div>
      <p class="quest-rewards">${rewardText(dungeon.rewards)}</p>
      <button type="button" data-enter-dungeon="${esc(dungeon.id)}" ${locked ? 'disabled' : ''}>${locked ? '今日已完成' : '进入副本'}</button>
    </article>`;
  }).join('')}</div>`;
}

export function installDungeonRenderRuntime(context = {}) {
  configureDungeonRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderDungeonPage })
    : { renderDungeonPage };
  return window.RuneFrontierRenderRuntime;
}
