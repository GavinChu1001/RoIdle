let handbookCtx = {};

const DAILY_GOALS = [
  {
    id: 'daily_kills',
    title: '今日清扫',
    desc: '击败 30 只魔物。',
    target: 30,
    reward: { gold: 1200, researchPoints: 1, materials: { ore: 5 } },
  },
  {
    id: 'daily_boss',
    title: '首领热身',
    desc: '击败 1 次 Boss。',
    target: 1,
    reward: { gold: 2500, researchPoints: 1, materials: { bossSoul: 1 } },
  },
  {
    id: 'daily_dungeon',
    title: '每日副本',
    desc: '完成 1 次副本。',
    target: 1,
    reward: { gold: 1800, researchPoints: 1, materials: { heroReformInscription: 1 } },
  },
  {
    id: 'daily_salvage',
    title: '整理背包',
    desc: '分解 3 件未穿戴装备。',
    target: 3,
    reward: { gold: 900, researchPoints: 1, materials: { dust: 15 } },
  },
];

const WEEKLY_GOALS = [
  {
    id: 'weekly_bosses',
    title: '周常首领讨伐',
    desc: '本周击败 10 次 Boss。',
    target: 10,
    reward: { gold: 15000, researchPoints: 5, materials: { bossSoul: 3 } },
  },
  {
    id: 'weekly_dungeons',
    title: '周常副本训练',
    desc: '本周完成 8 次副本。',
    target: 8,
    reward: { gold: 12000, researchPoints: 5, materials: { ancientCore: 2 } },
  },
  {
    id: 'weekly_equipment',
    title: '周常装备整理',
    desc: '本周获得或分解 20 件装备。',
    target: 20,
    reward: { gold: 10000, researchPoints: 4, materials: { ancientHeroShard: 8 } },
  },
];

const MATERIAL_TARGETS = [
  { id: 'heroReformInscription', target: 6, reason: '装备进阶常用材料。' },
  { id: 'ancientHeroShard', target: 20, reason: '古代英雄装备升级材料。' },
  { id: 'ore', target: 80, reason: '精炼和早期装备成长的基础材料。' },
  { id: 'bossSoul', target: 5, reason: '用于 Boss 相关兑换和研究。' },
  { id: 'ancientCore', target: 3, reason: '高级装备线的关键材料。' },
];

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function localDateKey(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function localWeekKey(date = new Date()) {
  const value = date instanceof Date ? new Date(date.getTime()) : new Date(date);
  value.setHours(0, 0, 0, 0);
  const day = value.getDay() || 7;
  value.setDate(value.getDate() + 4 - day);
  const yearStart = new Date(value.getFullYear(), 0, 1);
  const week = Math.ceil((((value - yearStart) / 86400000) + 1) / 7);
  return `${value.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function currentDate(context = handbookCtx) {
  return context.date || context.getDateKey?.() || localDateKey();
}

function currentWeekKey(context = handbookCtx) {
  return context.weekKey || context.getWeekKey?.() || localWeekKey();
}

function normalizeProgress(value, target) {
  return Math.max(0, Math.min(target, Math.floor(finite(value))));
}

function buildGoalState(definitions, saved = {}) {
  return Object.fromEntries(definitions.map((goal) => {
    const entry = saved?.[goal.id] || {};
    return [goal.id, {
      progress: normalizeProgress(entry.progress, goal.target),
      claimed: Boolean(entry.claimed),
    }];
  }));
}

function goalRows(definitions, stateRows = {}) {
  return definitions.map((goal) => {
    const entry = stateRows?.[goal.id] || {};
    const progress = normalizeProgress(entry.progress, goal.target);
    return {
      ...goal,
      progress,
      claimed: Boolean(entry.claimed),
      completed: progress >= goal.target,
    };
  });
}

function findGoal(goalId) {
  const daily = DAILY_GOALS.find((goal) => goal.id === goalId);
  if (daily) return { bucket: 'daily', goal: daily };
  const weekly = WEEKLY_GOALS.find((goal) => goal.id === goalId);
  if (weekly) return { bucket: 'weekly', goal: weekly };
  return null;
}

export function defaultAdventureHandbookState(date = localDateKey(), weekKey = localWeekKey()) {
  return {
    version: 1,
    date,
    weekKey,
    researchPoints: 0,
    daily: buildGoalState(DAILY_GOALS),
    weekly: buildGoalState(WEEKLY_GOALS),
  };
}

export function normalizeAdventureHandbookState(input = {}, date = localDateKey(), weekKey = localWeekKey()) {
  const base = defaultAdventureHandbookState(date, weekKey);
  if (!input || typeof input !== 'object') return base;
  const sameDate = input.date === date;
  const sameWeek = input.weekKey === weekKey;
  return {
    version: 1,
    date,
    weekKey,
    researchPoints: Math.max(0, Math.floor(finite(input.researchPoints))),
    daily: sameDate ? buildGoalState(DAILY_GOALS, input.daily) : base.daily,
    weekly: sameWeek ? buildGoalState(WEEKLY_GOALS, input.weekly) : base.weekly,
  };
}

export function recordAdventureHandbookProgress(state, goalId, amount = 1, context = handbookCtx) {
  if (!state || !goalId) return false;
  const match = findGoal(goalId);
  if (!match) return false;
  const delta = Math.max(0, Math.floor(finite(amount)));
  if (delta <= 0) return false;

  state.adventureHandbook = normalizeAdventureHandbookState(
    state.adventureHandbook,
    currentDate(context),
    currentWeekKey(context),
  );
  const entry = state.adventureHandbook[match.bucket][goalId];
  if (!entry || entry.claimed) return false;
  entry.progress = Math.min(match.goal.target, finite(entry.progress) + delta);
  return true;
}

export function claimAdventureHandbookGoal(state, goalId, context = handbookCtx) {
  if (!state || !goalId) return { ok: false, reason: 'state_missing' };
  const match = findGoal(goalId);
  if (!match) return { ok: false, reason: 'goal_missing' };

  state.adventureHandbook = normalizeAdventureHandbookState(
    state.adventureHandbook,
    currentDate(context),
    currentWeekKey(context),
  );
  const entry = state.adventureHandbook[match.bucket][goalId];
  if (!entry) return { ok: false, reason: 'goal_missing' };
  if (entry.claimed) return { ok: false, reason: 'claimed' };
  if (finite(entry.progress) < match.goal.target) return { ok: false, reason: 'incomplete' };

  entry.claimed = true;
  const reward = match.goal.reward || {};
  state.adventureHandbook.researchPoints += Math.max(0, Math.floor(finite(reward.researchPoints)));
  context.grantReward?.({ gold: reward.gold || 0, materials: reward.materials || {} });
  context.addLog?.(`冒险手册目标完成：${match.goal.title}。`);
  context.save?.();
  context.renderAll?.();
  return { ok: true, goal: match.goal, bucket: match.bucket };
}

function materialRecommendations(state = {}, context = handbookCtx) {
  return MATERIAL_TARGETS
    .map((target) => {
      const owned = finite(state.materials?.[target.id]);
      return {
        ...target,
        name: context.getMaterialName?.(target.id) || target.id,
        owned,
        missing: Math.max(0, target.target - owned),
        sources: context.getMaterialDropSources?.(target.id) || [],
      };
    })
    .filter((target) => target.missing > 0)
    .slice(0, 4);
}

function defaultMapRecommendation(state = {}, context = handbookCtx) {
  const maps = context.getMaps?.() || [];
  const index = Math.max(0, Math.min(maps.length - 1, Math.floor(finite(state.currentMap))));
  const current = maps[index] || maps[0] || null;
  return {
    mapId: current?.id || '',
    name: current?.name || '当前地图',
    difficulty: state.currentDifficulty || 'normal',
    reason: context.isBossChallengeReady?.()
      ? 'Boss 进度已满，优先挑战本地图 Boss。'
      : '继续刷当前地图，积累 Boss 进度和阶段材料。',
  };
}

function defaultEquipmentTarget(state = {}, context = handbookCtx) {
  const equippedIds = Object.values(state.equipped || {}).filter(Boolean);
  if (!equippedIds.length) {
    return { title: '补齐装备栏', desc: '优先补齐武器、防具、鞋子和饰品。' };
  }

  const inventory = state.inventory || [];
  const equippedItems = equippedIds
    .map((id) => inventory.find((item) => item?.id === id))
    .filter(Boolean);
  const upgrade = equippedItems.map((item) => context.getNextEquipmentUpgrade?.(item)).find(Boolean);
  if (upgrade) {
    return { title: '推进装备阶级', desc: '至少一件已穿戴装备还可以继续进阶。' };
  }
  return { title: '提升装备质量', desc: '寻找更高阶级或更适合当前职业的装备。' };
}

export function buildAdventureHandbookModel(state = handbookCtx.getState?.() || {}, context = handbookCtx) {
  const normalized = normalizeAdventureHandbookState(
    state.adventureHandbook,
    currentDate(context),
    currentWeekKey(context),
  );
  const stats = context.computeStats?.() || {};
  return {
    researchPoints: normalized.researchPoints,
    power: finite(stats.power),
    stats,
    dailyGoals: goalRows(DAILY_GOALS, normalized.daily),
    weeklyGoals: goalRows(WEEKLY_GOALS, normalized.weekly),
    mapRecommendation: context.getMapRecommendation?.(state, stats) || defaultMapRecommendation(state, context),
    materials: materialRecommendations(state, context),
    dungeons: (context.getDungeonCards?.(state, stats) || [])
      .filter((entry) => finite(entry.remaining) > 0)
      .slice(0, 3),
    equipmentTarget: context.getEquipmentTarget?.(state, stats) || defaultEquipmentTarget(state, context),
  };
}

export function configureAdventureHandbookContext(context = {}) {
  handbookCtx = context || {};
}

export function installAdventureHandbookRuntime(context = {}) {
  configureAdventureHandbookContext(context);
  const runtime = Object.freeze({
    defaultAdventureHandbookState,
    normalizeAdventureHandbookState,
    recordAdventureHandbookProgress,
    claimAdventureHandbookGoal,
    buildAdventureHandbookModel,
  });
  window.RuneFrontierAdventureHandbookRuntime = runtime;
  return runtime;
}
