let guideCtx = {};

function esc(value) { return (guideCtx.escapeHtml || window.escapeHtml || String)(value); }
function goalStatuses() {
  const state = guideCtx.getState?.() || window.state || {};
  const runtime = window.RuneFrontierOnboardingRuntime || {};
  return runtime.getOnboardingGoalStatuses?.(state) || [];
}

export function configureOnboardingGuideContext(ctx = {}) {
  guideCtx = ctx || {};
}

export function renderOnboardingTaskSection() {
  const goals = goalStatuses();
  if (!goals.length) return '';
  return `<section class="quest-section onboarding-task-section"><h3>新手目标</h3><div class="quest-task-list">${goals.map(renderOnboardingGoalCard).join('')}</div></section>`;
}

export function renderOnboardingGoalCard(goal) {
  const done = Boolean(goal.completed);
  const action = goal.action ? `<button class="quest-claim-btn" data-onboarding-action="${esc(goal.action)}" type="button" ${done ? 'disabled' : ''}>${done ? '已完成' : '前往'}</button>` : '';
  return `<article class="quest-card onboarding-goal-card ${done ? 'quest-completed' : ''}"><div><strong class="quest-title">${esc(goal.title)}</strong><p class="quest-desc">${esc(goal.description)}</p><p class="quest-desc">${esc(goal.reason || '')}</p><p class="quest-rewards">${esc(goal.rewardText || '')}</p></div>${action}</article>`;
}

export function installOnboardingGuideRuntime(context = {}) {
  configureOnboardingGuideContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderOnboardingTaskSection, renderOnboardingGoalCard })
    : { renderOnboardingTaskSection, renderOnboardingGoalCard };
  return window.RuneFrontierRenderRuntime;
}
