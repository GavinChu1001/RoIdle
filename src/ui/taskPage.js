let taskCtx = {};

function esc(v) { return (window.escapeHtml || String)(v); }
function fmtn(v) { return (window.formatNumber ? window.formatNumber(v) : String(v || 0)); }
function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function configureTaskRenderContext(ctx = {}) { taskCtx = ctx || {}; }

function renderTaskSection(title, quests) {
  return `<section class="quest-section"><h3>${esc(title)}</h3><div class="quest-task-list">${(quests||[]).map((q) => {
    return renderTaskCard(q);
  }).join('')}</div></section>`;
}

function renderTaskCard(q) {
  const required = Math.max(1, F(q.requiredCount));
  const current = Math.min(required, F(q.currentCount));
  const done = Boolean(q.completed) || current >= required;
  const claimed = Boolean(q.claimed);
  const buttonText = claimed ? '\u5df2\u9886\u53d6' : done ? '\u9886\u53d6\u5956\u52b1' : '\u8fdb\u884c\u4e2d';
  const rewardText = taskCtx.questRewardText || window.questRewardText || (() => '');
  return `<article class="quest-card ${done?'quest-completed':''} ${claimed?'quest-claimed':''}"><div><strong class="quest-title">${esc(q.title || '\u4efb\u52a1')}</strong><p class="quest-desc">${esc(q.description || '')}</p><div class="quest-progress"><span style="width:${Math.min(100,(current/required)*100)}%"></span></div><p class="quest-desc">${fmtn(current)} / ${fmtn(required)}</p><p class="quest-rewards">${rewardText(q.rewards || {})}</p></div><button class="quest-claim-btn" data-claim-quest="${esc(q.id || '')}" type="button" ${!done || claimed?'disabled':''}>${buttonText}</button></article>`;
}

function renderDailyGoals() {
  const state = window.state || {};
  state.dailyGoals = (window.normalizeDailyGoals || ((v)=>v))(state.dailyGoals);
  return `<section class="quest-section daily-goal-section"><h3>\u6bcf\u65e5\u76ee\u6807</h3><div class="quest-task-list">${(state.dailyGoals?.goals||[]).map((goal) => {
    const done = F(goal.progress) >= goal.target;
    return `<article class="quest-card ${done?'quest-completed':''} ${goal.claimed?'quest-claimed':''}"><div><strong class="quest-title">${esc(goal.title)}</strong><p class="quest-desc">${fmtn(Math.min(F(goal.progress),goal.target))} / ${fmtn(goal.target)}</p><div class="quest-progress"><span style="width:${Math.min(100,(F(goal.progress)/goal.target)*100)}%"></span></div><p class="quest-rewards">${(window.achievementRewardText||(()=>''))(goal.reward)}</p></div><button class="quest-claim-btn" data-claim-daily-goal="${goal.id}" type="button" ${!done||goal.claimed?'disabled':''}>${goal.claimed?'\u5df2\u9886\u53d6':done?'\u9886\u53d6\u5956\u52b1':'\u8fdb\u884c\u4e2d'}</button></article>`;
  }).join('')}</div></section>`;
}

function renderAchievementPage() {
  const db = window.ACHIEVEMENT_DB || [];
  const groups = db.reduce((map, a) => { map[a.category] = (map[a.category]||[]); map[a.category].push(a); return map; }, {});
  return `<section class="achievement-page"><h3>\u6210\u5c31</h3>${Object.entries(groups).map(([cat,list]) => `<div class="achievement-section"><h4>${esc(cat)}</h4><div class="achievement-list">${list.map((a) => {
    const entry = (window.getAchievementEntry||(()=>{}))(a.id);
    const done = entry.unlocked || F(entry.progress) >= F(a.target);
    return `<article class="achievement-card ${done?'achievement-done':''} ${entry.claimed?'achievement-claimed':''}"><div><strong class="achievement-title">${esc(a.title)}</strong><p class="quest-desc">${esc(a.description)}</p><div class="quest-progress achievement-progress"><span style="width:${Math.min(100,(F(entry.progress)/F(a.target))*100)}%"></span></div><p class="quest-desc">${fmtn(Math.min(F(entry.progress),F(a.target)))} / ${fmtn(a.target)}</p><p class="quest-rewards">${(window.achievementRewardText||(()=>''))(a.reward)}</p></div><button class="achievement-claim-btn" type="button" data-claim-achievement="${a.id}" ${!done||entry.claimed?'disabled':''}>${entry.claimed?'\u5df2\u9886\u53d6':done?'\u9886\u53d6\u5956\u52b1':'\u8fdb\u884c\u4e2d'}</button></article>`;
  }).join('')}</div></div>`).join('')}</section>`;
}

export function installTaskRenderRuntime(context = {}) {
  configureTaskRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, {
    renderTasks() {
      const els = (window.els || {});
      const state = window.state || {};
      if (!els.taskPage) return;
      const main = (state.quests?.active||[]).filter((q) => q.category === 'main');
      const daily = (state.quests?.active||[]).filter((q) => q.category === 'daily');
      els.taskPage.innerHTML = `${renderTaskSection('\u4e3b\u7ebf\u4efb\u52a1', main)}${renderTaskSection('\u65e5\u5e38\u4efb\u52a1', daily)}${renderDailyGoals()}${renderAchievementPage()}`;
    },
    renderDailyGoals,
    renderAchievementPage,
    renderTaskSection,
    renderAchievementCard(a) {
      const entry = (window.getAchievementEntry||(()=>{}))(a.id);
      const done = entry.unlocked || F(entry.progress) >= F(a.target);
      return `<article class="achievement-card ${done?'achievement-done':''} ${entry.claimed?'achievement-claimed':''}"><div><strong class="achievement-title">${esc(a.title)}</strong><p class="quest-desc">${esc(a.description)}</p><div class="quest-progress achievement-progress"><span style="width:${Math.min(100,(F(entry.progress)/F(a.target))*100)}%"></span></div><p class="quest-desc">${fmtn(Math.min(F(entry.progress),F(a.target)))} / ${fmtn(a.target)}</p><p class="quest-rewards">${(window.achievementRewardText||(()=>''))(a.reward)}</p></div><button class="achievement-claim-btn" type="button" data-claim-achievement="${a.id}" ${!done||entry.claimed?'disabled':''}>${entry.claimed?'\u5df2\u9886\u53d6':done?'\u9886\u53d6\u5956\u52b1':'\u8fdb\u884c\u4e2d'}</button></article>`;
    },
    renderTaskCard,
  }) : {};
  return window.RuneFrontierRenderRuntime;
}
