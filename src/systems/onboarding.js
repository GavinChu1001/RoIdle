export const ONBOARDING_VERSION = 1;

const DEFAULT_STEP_ID = 'welcome';

export const ONBOARDING_GOALS = [
  {
    id: 'start_adventure',
    title: '开始南门冒险',
    description: '先击败几只南门魔物，熟悉自动战斗节奏。',
    reason: '战斗会带来经验、金币和第一批掉落。',
    rewardText: '解锁第一轮奖励和后续成长目标',
    action: 'go-adventure',
    status(state) {
      return Number(state?.totalKills || 0) > 0 || Number(state?.areaKills || 0) > 0;
    },
  },
  {
    id: 'claim_first_reward',
    title: '领取第一份奖励',
    description: '完成第一段讨伐后，去领取主线或战利品奖励。',
    reason: '奖励会给你材料和装备，用来完成第一次变强。',
    rewardText: '获得材料、装备或 VIP 经验',
    action: 'go-tasks',
    status(state) {
      return hasClaimedQuest(state, 'main_1_grass') || Boolean(state?.lastOfflineRewardsForView);
    },
  },
  {
    id: 'grow_once',
    title: '完成一次变强',
    description: '装备新物品，或在铁匠铺完成一次强化。',
    reason: '提升战力后，清怪速度和 Boss 推进都会变快。',
    rewardText: '提高战力和推图效率',
    action: 'go-equipment',
    status(state) {
      return hasRefinedItem(state) || hasNonStarterEquipmentChange(state);
    },
  },
  {
    id: 'see_boss_goal',
    title: '回到 Boss 目标',
    description: '回到冒险页查看本地图 Boss 进度。',
    reason: 'Boss 是第一个清晰阶段目标，也是进入下一张地图的门槛。',
    rewardText: '明确下一阶段推进目标',
    action: 'go-adventure',
    status(state) {
      return Boolean(state?.onboarding?.tutorialCompleted)
        || (state?.onboarding?.completedStepIds || []).includes('see_boss_goal');
    },
  },
];

export const ONBOARDING_STEPS = [
  { id: 'welcome', goalId: 'start_adventure', title: '欢迎来到南门', body: '先从南门冒险开始，击败几只魔物。', action: 'go-adventure' },
  { id: 'start_adventure', goalId: 'start_adventure', title: '开始战斗', body: '自动战斗会持续获得经验、金币和掉落。', action: 'go-adventure' },
  { id: 'claim_first_reward', goalId: 'claim_first_reward', title: '领取奖励', body: '完成第一段目标后，去任务页领取奖励。', action: 'go-tasks' },
  { id: 'grow_once', goalId: 'grow_once', title: '变强一次', body: '装备新物品，或去铁匠铺强化武器。', action: 'go-equipment' },
  { id: 'see_boss_goal', goalId: 'see_boss_goal', title: '查看 Boss 目标', body: '回到冒险页，关注首领进度。', action: 'go-adventure' },
];

export function defaultOnboardingState() {
  return {
    version: ONBOARDING_VERSION,
    tutorialCompleted: false,
    skipped: false,
    currentStepId: DEFAULT_STEP_ID,
    completedStepIds: [],
    dismissedHintIds: [],
  };
}

export function normalizeOnboarding(onboarding = {}) {
  const base = defaultOnboardingState();
  const completedStepIds = uniqueStrings(onboarding.completedStepIds);
  const dismissedHintIds = uniqueStrings(onboarding.dismissedHintIds);
  const currentStepId = typeof onboarding.currentStepId === 'string' && onboarding.currentStepId
    ? onboarding.currentStepId
    : base.currentStepId;
  return {
    version: ONBOARDING_VERSION,
    tutorialCompleted: Boolean(onboarding.tutorialCompleted),
    skipped: Boolean(onboarding.skipped),
    currentStepId,
    completedStepIds,
    dismissedHintIds,
  };
}

export function getOnboardingGoalStatuses(state = {}) {
  return ONBOARDING_GOALS.map((goal) => {
    const completed = Boolean(goal.status?.(state));
    return { ...goal, completed };
  });
}

export function getCurrentOnboardingGoal(state = {}) {
  return getOnboardingGoalStatuses(state).find((goal) => !goal.completed) || null;
}

export function getActiveTutorialStep(state = {}) {
  const onboarding = normalizeOnboarding(state.onboarding || {});
  if (onboarding.skipped || onboarding.tutorialCompleted) return null;
  const currentGoal = getCurrentOnboardingGoal(state);
  if (!currentGoal) return null;
  return ONBOARDING_STEPS.find((step) => step.goalId === currentGoal.id) || ONBOARDING_STEPS[0];
}

export function completeOnboardingStep(onboarding = {}, stepId) {
  const normalized = normalizeOnboarding(onboarding);
  if (typeof stepId === 'string' && stepId && !normalized.completedStepIds.includes(stepId)) {
    normalized.completedStepIds.push(stepId);
  }
  normalized.currentStepId = stepId || normalized.currentStepId;
  return normalized;
}

export function skipOnboarding(onboarding = {}) {
  return { ...normalizeOnboarding(onboarding), skipped: true };
}

export function installOnboardingRuntime() {
  const runtime = {
    ONBOARDING_GOALS,
    ONBOARDING_STEPS,
    defaultOnboardingState,
    normalizeOnboarding,
    getOnboardingGoalStatuses,
    getCurrentOnboardingGoal,
    getActiveTutorialStep,
    completeOnboardingStep,
    skipOnboarding,
  };
  window.RuneFrontierOnboardingRuntime = runtime;
  return runtime;
}

function uniqueStrings(values) {
  return [...new Set(Array.isArray(values) ? values.filter((value) => typeof value === 'string' && value) : [])];
}

function hasClaimedQuest(state, questId) {
  if (Array.isArray(state?.quests?.completed) && state.quests.completed.includes(questId)) return true;
  return (state?.quests?.active || []).some((quest) => quest.id === questId && quest.claimed);
}

function hasRefinedItem(state) {
  return (state?.inventory || []).some((item) => Number(item?.refine || item?.enhance || item?.empower || 0) > 0);
}

function hasNonStarterEquipmentChange(state) {
  const equipped = state?.equipped || {};
  const inventory = state?.inventory || [];
  return inventory.some((item) => equipped[item?.equipSlot || item?.slot] === item?.id && Number(item?.level || 1) > 1);
}
