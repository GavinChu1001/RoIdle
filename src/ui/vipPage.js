let vipCtx = {};

function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
function esc(v) { return vipCtx.escapeHtml ? vipCtx.escapeHtml(v) : String(v); }
function fmtn(v) { return vipCtx.formatNumber ? vipCtx.formatNumber(v) : String(v || 0); }
function pct(v) { return vipCtx.percent ? vipCtx.percent(v) : String(Math.round((v || 0) * 100)) + '%'; }

export function configureVipRenderContext(ctx = {}) { vipCtx = ctx || {}; }

export function renderVip(ctx = vipCtx) {
  const state = ctx.getState?.() || {};
  const normalizeVipFn = ctx.normalizeVip || ((v) => v || { level: 0 });
  const progressInfoFn = ctx.getVipProgressInfo || (() => ({}));
  const bonusesFn = ctx.getVipBonuses || (() => ({}));
  const unlockedFn = ctx.getUnlockedVipMilestones || (() => []);
  const nextFn = ctx.getNextVipMilestone || (() => null);
  const vipMax = ctx.getVipMaxLevel ? ctx.getVipMaxLevel() : 20;
  const expTable = ctx.getVipExpRequirements ? ctx.getVipExpRequirements() : [];
  const milestones = ctx.getVipMilestones ? ctx.getVipMilestones() : {};

  const vip = normalizeVipFn(state.vip);
  const progressInfo = progressInfoFn(vip);
  const bonuses = bonusesFn(vip.level);
  const unlocked = unlockedFn(vip.level);
  const next = nextFn(vip.level);
  const msHtml = unlocked.length
    ? unlocked.map((m) => `<span class="vip-milestone unlocked">\u2713 Lv.${m.level} ${esc(m.label)}</span>`).join('')
    : `<span class="vip-milestone">\u6682\u672a\u89e3\u9501\u9636\u6bb5\u7279\u6743\uff0c\u7ee7\u7eed\u5b8c\u6210\u4efb\u52a1\u548c\u6210\u5c31\u63d0\u5347\u8363\u8a89\u3002</span>`;
  const nextHtml = next
    ? `<p class="vip-next">\u4e0b\u4e00\u9636\u6bb5\uff1aLv.${next.level} \u2014 ${esc(next.label)}<br>\u8ddd\u79bb\u4e0b\u4e00\u7b49\u7ea7\u8fd8\u9700\uff1a${fmtn(progressInfo.remaining)} \u7ecf\u9a8c</p>`
    : `<p class="vip-next">\u5df2\u89e3\u9501\u5168\u90e8\u5192\u9669\u8005\u8363\u8a89\u7279\u6743\u3002</p>`;
  const giftAvailable = state.vip?.dailyGiftClaimed !== (vipCtx.todayKey ? vipCtx.todayKey() : new Date().toISOString().slice(0, 10));
  const dailyGiftHtml = giftAvailable ? `<button type="button" class="ghost" data-claim-vip-gift>\u9886\u53d6\u6bcf\u65e5\u793c\u5305</button>` : `<span class="vip-next">\u4eca\u65e5\u793c\u5305\u5df2\u9886\u53d6</span>`;

  return `<section class="vip-page-grid">
    <article class="vip-card vip-summary-card">
      <span class="vip-level">\u5192\u9669\u8005\u8363\u8a89 Lv.${vip.level}</span>
      <p class="vip-meta">${progressInfo.isMax ? '\u5df2\u6ee1\u7ea7' : `\u8fdb\u5ea6 ${fmtn(progressInfo.currentLevelExp)} / ${fmtn(progressInfo.requiredForNext)} \xb7 \u8ddd\u79bb\u4e0b\u4e00\u7ea7 ${fmtn(progressInfo.remaining)}`}</p>
      <div class="vip-progress"><div style="width:${Math.round(progressInfo.progressPct * 100)}%"></div></div>
      <div class="vip-daily-gift">${dailyGiftHtml}</div>
    </article>
    <article class="vip-card">
      <strong>\u5f53\u524d\u57fa\u7840\u6536\u76ca</strong>
      <div class="vip-bonus-grid">
        <span>\u91d1\u5e01\u6536\u76ca <b>+${pct(bonuses.gold)}</b></span>
        <span>\u6750\u6599\u6389\u7387 <b>+${pct(bonuses.itemDrop)}</b></span>
        <span>\u88c5\u5907\u6389\u7387 <b>+${pct(bonuses.equipmentDrop)}</b></span>
      </div>
    </article>
    <article class="vip-card">
      <strong>\u5df2\u89e3\u9501\u7279\u6743</strong>
      <div class="vip-milestones">${msHtml}</div>
    </article>
    <article class="vip-card">
      <strong>\u4e0b\u4e00\u9636\u6bb5\u7279\u6743</strong>
      ${nextHtml}
    </article>
  </section>
  <details class="vip-card vip-level-preview">
    <summary>\u5168\u90e8\u7b49\u7ea7\u9884\u89c8</summary>
    <section class="vip-table">
      ${Array.from({ length: vipMax }, (_, index) => {
        const level = index + 1;
        const row = bonusesFn(level);
        const hasMs = milestones[level];
        return `<div class="vip-row ${vip.level >= level ? 'active' : ''}">
          <strong>Lv.${level}${hasMs ? ' \u2605' : ''}</strong>
          <span>\u7d2f\u8ba1 ${fmtn(expTable[level])}</span>
          <span>\u91d1\u5e01 +${pct(row.gold)}</span>
          <span>\u6750\u6599 +${pct(row.itemDrop)}</span>
          <span>\u88c5\u5907 +${pct(row.equipmentDrop)}</span>
          ${hasMs ? `<span class="vip-milestone-tag">${esc(hasMs.label)}</span>` : '<span></span>'}
        </div>`;
      }).join('')}
    </section>
  </details>`;
}

export function installVipRenderRuntime(context = {}) {
  configureVipRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, { renderVip }) : { renderVip };
  return window.RuneFrontierRenderRuntime;
}
