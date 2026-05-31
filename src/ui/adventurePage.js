let adventureCtx = {};

function esc(value) { return (adventureCtx.escapeHtml || window.escapeHtml || String)(value); }
function fmtn(value) { return (adventureCtx.formatNumber || window.formatNumber || String)(Math.max(0, Number(value || 0))); }
function percent(value) {
  const number = Number(value || 0);
  return `${Math.round(Math.max(0, Math.min(1, number)) * 100)}%`;
}

export function configureAdventureRenderContext(ctx = {}) {
  adventureCtx = ctx || {};
}

export function renderSkillDpsPanel() {
  const rows = adventureCtx.getSkillDpsRows?.(5) || [];
  if (!rows.length) {
    return `<section class="skill-dps-panel"><div class="panel-heading compact"><div><p class="eyebrow">技能输出</p><h2>最近 30 秒</h2></div></div><p class="quest-meta">暂无技能伤害记录</p></section>`;
  }
  return `<section class="skill-dps-panel"><div class="panel-heading compact"><div><p class="eyebrow">技能输出</p><h2>最近 30 秒</h2></div></div><div class="skill-dps-list">${rows.map((row) => `<div class="skill-dps-row"><div><strong>${esc(row.name)}</strong><small>${fmtn(row.dps)} / 秒</small></div><span>${percent(row.share)}</span><i style="transform:scaleX(${Math.max(0.02, Math.min(1, Number(row.share || 0)))})"></i></div>`).join('')}</div></section>`;
}

function renderDungeonEntryPanel() {
  return `<section class="dungeon-entry-panel"><div class="panel-heading compact"><div><p class="eyebrow">副本</p><h2>每日挑战</h2></div></div><p class="quest-meta">材料副本与 Boss 试炼已开放。</p><button class="ro-light-control" data-page="dungeons" data-adventure-page="dungeons" type="button">进入副本</button></section>`;
}

export function renderPartyList() {
  const els = adventureCtx.getEls?.() || window.els || {};
  if (!els.partyList) return;
  const state = adventureCtx.getState?.() || window.state || {};
  const stats = adventureCtx.computeStats?.() || {};
  const job = adventureCtx.currentJob?.() || {};
  const growthSummary = job.growth ? adventureCtx.jobSummary?.(job) || '' : '';
  const advice = adventureCtx.renderAdvicePanel?.(stats) || '';
  const sessionRewards = adventureCtx.renderSessionRewardPanel?.() || '';
  els.partyList.innerHTML = `
    ${advice}
    <div class="party-item">
      <span class="party-name">主角 · ${esc(job.name || '')}</span>
      <p class="party-meta">BASE ${state.hero.baseLevel} · JOB ${state.hero.jobLevel} · 输出 ${fmtn(stats.dps)}</p>
      ${growthSummary ? `<p class="party-meta">${esc(growthSummary)}</p>` : ''}
    </div>
    <div class="party-item">
      <span class="party-name">技能记录</span>
      <p class="party-meta">${(state.skillLog || []).slice(0, 3).map(esc).join(' / ') || '尚未触发主动技能'}</p>
    </div>
    ${renderSkillDpsPanel()}
    ${renderDungeonEntryPanel()}
    ${sessionRewards}
  `;
}

export function installAdventureRenderRuntime(context = {}) {
  configureAdventureRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderPartyList, renderSkillDpsPanel })
    : { renderPartyList, renderSkillDpsPanel };
  return window.RuneFrontierRenderRuntime;
}
