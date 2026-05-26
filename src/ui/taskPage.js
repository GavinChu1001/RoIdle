let taskCtx = {};
function esc(v) { return taskCtx.escapeHtml ? taskCtx.escapeHtml(v) : String(v); }
function fmtn(v) { return taskCtx.formatNumber ? taskCtx.formatNumber(v) : String(v || 0); }
function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function configureTaskRenderContext(ctx = {}) { taskCtx = ctx || {}; }

export function renderTaskSection(title, quests, ctx = taskCtx) {
  return `<section class="quest-section"><h3>${esc(title)}</h3><div class="quest-task-list">${(quests || []).map((q) => renderTaskCard(q, ctx)).join('')}</div></section>`;
}

export function renderTaskCard(quest, ctx = taskCtx) {
  const done = F(quest.progress) >= F(quest.target);
  const rewardTextFn = ctx.questRewardText || (() => '');
  return `<article class="quest-card ${done ? 'quest-completed' : ''}"><div><strong class="quest-title">${esc(quest.title)}</strong><p class="quest-desc">${esc(quest.desc)}</p><div class="quest-progress"><span style="width:${Math.min(100, (F(quest.progress) / Math.max(1, F(quest.target))) * 100)}%"></span></div><p class="quest-desc">${fmtn(quest.progress)} / ${fmtn(quest.target)}</p><p class="quest-rewards">${rewardTextFn(quest.reward)}</p></div><button class="quest-claim-btn" data-claim-quest="${quest.id}" type="button" ${!done ? 'disabled' : ''}>${done ? '\u9886\u53d6\u5956\u52b1' : '\u8fdb\u884c\u4e2d'}</button></article>`;
}

export function renderTasks(ctx = taskCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  if (!els.taskPage) return;
  const main = (state.quests?.active || []).filter((q) => q.category === 'main');
  const daily = (state.quests?.active || []).filter((q) => q.category === 'daily');
  els.taskPage.innerHTML = `${renderTaskSection('\u4e3b\u7ebf\u4efb\u52a1', main, ctx)}${renderTaskSection('\u65e5\u5e38\u4efb\u52a1', daily, ctx)}${renderDailyGoals(ctx)}${renderAchievementPage(ctx)}`;
}

export function renderDailyGoals(ctx = taskCtx) {
  const state = ctx.getState?.() || {};
  state.dailyGoals = ctx.normalizeDailyGoals?.(state.dailyGoals) || state.dailyGoals;
  const rewardTextFn = ctx.achievementRewardText || (() => '');
  return `<section class="quest-section daily-goal-section"><h3>\u6bcf\u65e5\u76ee\u6807</h3><div class="quest-task-list">${(state.dailyGoals?.goals || []).map((goal) => {
    const done = F(goal.progress) >= goal.target;
    return `<article class="quest-card ${done ? 'quest-completed' : ''} ${goal.claimed ? 'quest-claimed' : ''}"><div><strong class="quest-title">${esc(goal.title)}</strong><p class="quest-desc">${fmtn(Math.min(F(goal.progress), goal.target))} / ${fmtn(goal.target)}</p><div class="quest-progress"><span style="width:${Math.min(100, (F(goal.progress) / goal.target) * 100)}%"></span></div><p class="quest-rewards">${rewardTextFn(goal.reward)}</p></div><button class="quest-claim-btn" data-claim-daily-goal="${goal.id}" type="button" ${!done || goal.claimed ? 'disabled' : ''}>${goal.claimed ? '\u5df2\u9886\u53d6' : done ? '\u9886\u53d6\u5956\u52b1' : '\u8fdb\u884c\u4e2d'}</button></article>`;
  }).join('')}</div></section>`;
}

export function renderAchievementPage(ctx = taskCtx) {
  const db = ctx.getAchievementDb?.() || [];
  const groups = db.reduce((map, a) => { map[a.category] = map[a.category] || []; map[a.category].push(a); return map; }, {});
  return `<section class="achievement-page"><h3>\u6210\u5c31</h3>${Object.entries(groups).map(([cat, achievements]) => `<div class="achievement-section"><h4>${esc(cat)}</h4><div class="achievement-list">${achievements.map((a) => renderAchievementCard(a, ctx)).join('')}</div></div>`).join('')}</section>`;
}

export function renderAchievementCard(achievement, ctx = taskCtx) {
  const state = ctx.getState?.() || {};
  const entry = ctx.getAchievementEntry?.(achievement.id) || {};
  const done = entry.unlocked || F(entry.progress) >= F(achievement.target);
  const rewardTextFn = ctx.achievementRewardText || (() => '');
  return `<article class="achievement-card ${done ? 'achievement-done' : ''} ${entry.claimed ? 'achievement-claimed' : ''}"><div><strong class="achievement-title">${esc(achievement.title)}</strong><p class="quest-desc">${esc(achievement.description)}</p><div class="quest-progress achievement-progress"><span style="width:${Math.min(100, (F(entry.progress) / F(achievement.target)) * 100)}%"></span></div><p class="quest-desc">${fmtn(Math.min(F(entry.progress), F(achievement.target)))} / ${fmtn(achievement.target)}</p><p class="quest-rewards">${rewardTextFn(achievement.reward)}</p></div><button class="achievement-claim-btn" type="button" data-claim-achievement="${achievement.id}" ${!done || entry.claimed ? 'disabled' : ''}>${entry.claimed ? '\u5df2\u9886\u53d6' : done ? '\u9886\u53d6\u5956\u52b1' : '\u8fdb\u884c\u4e2d'}</button></article>`;
}

export function installTaskRenderRuntime(context = {}) {
  configureTaskRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, { renderTasks, renderDailyGoals, renderAchievementPage, renderAchievementCard, renderTaskCard, renderTaskSection }) : {};
  return window.RuneFrontierRenderRuntime;
}
