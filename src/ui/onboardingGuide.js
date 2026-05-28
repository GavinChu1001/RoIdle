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

export function renderQuestList() {
  const els = guideCtx.getEls?.() || window.els || {};
  if (!els.questList) return;
  const state = guideCtx.getState?.() || window.state || {};
  const runtime = window.RuneFrontierOnboardingRuntime || {};
  const currentGoal = runtime.getCurrentOnboardingGoal?.(state);
  const tutorialStep = runtime.getActiveTutorialStep?.(state);
  const progressText = guideCtx.progressText?.() || '';
  const bossName = guideCtx.bossDisplayName?.(guideCtx.currentMap?.()) || '';
  const bossSkill = guideCtx.currentMap?.()?.bossSkill || '';
  const tutorialHtml = tutorialStep ? renderTutorialHint(tutorialStep) : '';
  const currentGoalHtml = currentGoal ? renderCurrentGoal(currentGoal) : '';
  els.questList.innerHTML = `
    ${tutorialHtml}
    ${currentGoalHtml}
    <div class="quest-item">
      <span class="quest-name">当前首领</span>
      <p class="quest-meta">${esc(bossName)} · ${esc(bossSkill)}</p>
    </div>
    <div class="quest-item">
      <span class="quest-name">首领进度</span>
      <p class="quest-meta">${esc(state.enemyBoss ? progressText : `${progressText} 后可挑战本地图首领`)}</p>
    </div>
  `;
}

function renderTutorialHint(step) {
  return `<div class="quest-item onboarding-tutorial-hint"><span class="quest-name">${esc(step.title)}</span><p class="quest-meta">${esc(step.body)}</p><div class="onboarding-actions"><button class="ro-light-control" data-onboarding-action="${esc(step.action)}" type="button">前往</button><button class="ghost" data-onboarding-action="skip-tutorial" type="button">跳过教程</button></div></div>`;
}

function renderCurrentGoal(goal) {
  return `<div class="quest-item onboarding-current-goal"><span class="quest-name">${esc(goal.title)}</span><p class="quest-meta">${esc(goal.description)}</p><p class="quest-meta">${esc(goal.reason || '')}</p><p class="quest-rewards">${esc(goal.rewardText || '')}</p><button class="ro-light-control" data-onboarding-action="${esc(goal.action)}" type="button">前往</button></div>`;
}

export function installOnboardingGuideRuntime(context = {}) {
  configureOnboardingGuideContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderQuestList, renderOnboardingTaskSection, renderOnboardingGoalCard })
    : { renderQuestList, renderOnboardingTaskSection, renderOnboardingGoalCard };
  return window.RuneFrontierRenderRuntime;
}
