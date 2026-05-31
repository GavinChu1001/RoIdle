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
  const ctx = context && typeof context === 'object' ? context : {};
  return ctx.date || ctx.getDateKey?.() || localDateKey();
}

function currentWeekKey(context = handbookCtx) {
  const ctx = context && typeof context === 'object' ? context : {};
  return ctx.weekKey || ctx.getWeekKey?.() || localWeekKey();
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

function materialSources(materialId, context = handbookCtx) {
  const ctx = context && typeof context === 'object' ? context : {};
  const craftingSources = ctx.getCraftingMaterialSources?.(materialId);
  if (Array.isArray(craftingSources) && craftingSources.length) return craftingSources;
  return ctx.getMaterialDropSources?.(materialId) || [];
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
  const ctx = context && typeof context === 'object' ? context : {};
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

  const reward = match.goal.reward || {};
  const grantReward = {
    gold: Math.max(0, Math.floor(finite(reward.gold))),
    materials: Object.fromEntries(Object.entries(reward.materials || {})
      .map(([id, amount]) => [id, Math.max(0, Math.floor(finite(amount)))])
      .filter(([, amount]) => amount > 0)),
  };
  try {
    ctx.grantReward?.(grantReward);
  } catch (error) {
    return { ok: false, reason: 'reward_failed', error };
  }

  entry.claimed = true;
  state.adventureHandbook.researchPoints += Math.max(0, Math.floor(finite(reward.researchPoints)));
  ctx.addLog?.(`冒险手册目标完成：${match.goal.title}。`);
  ctx.save?.();
  ctx.renderAll?.();
  return { ok: true, goal: match.goal, bucket: match.bucket };
}

function materialRecommendations(state = {}, context = handbookCtx) {
  const safeState = state && typeof state === 'object' ? state : {};
  const ctx = context && typeof context === 'object' ? context : {};
  return MATERIAL_TARGETS
    .map((target) => {
      const owned = finite(safeState.materials?.[target.id]);
      return {
        ...target,
        name: ctx.getMaterialName?.(target.id) || target.id,
        owned,
        missing: Math.max(0, target.target - owned),
        sources: materialSources(target.id, ctx),
      };
    })
    .filter((target) => target.missing > 0)
    .slice(0, 4);
}

function defaultMapRecommendation(state = {}, context = handbookCtx) {
  const safeState = state && typeof state === 'object' ? state : {};
  const ctx = context && typeof context === 'object' ? context : {};
  const maps = ctx.getMaps?.() || [];
  const index = Math.max(0, Math.min(maps.length - 1, Math.floor(finite(safeState.currentMap))));
  const current = maps[index] || maps[0] || null;
  return {
    mapId: current?.id || '',
    name: current?.name || '当前地图',
    difficulty: safeState.currentDifficulty || 'normal',
    reason: ctx.isBossChallengeReady?.()
      ? 'Boss 进度已满，优先挑战本地图 Boss。'
      : '继续刷当前地图，积累 Boss 进度和阶段材料。',
  };
}

function defaultEquipmentTarget(state = {}, context = handbookCtx) {
  const safeState = state && typeof state === 'object' ? state : {};
  const ctx = context && typeof context === 'object' ? context : {};
  const equippedIds = Object.values(safeState.equipped || {}).filter(Boolean);
  if (!equippedIds.length) {
    return { title: '补齐装备栏', desc: '优先补齐武器、防具、鞋子和饰品。' };
  }

  const inventory = safeState.inventory || [];
  const equippedItems = equippedIds
    .map((id) => inventory.find((item) => item?.id === id))
    .filter(Boolean);
  const upgrade = equippedItems.map((item) => ctx.getNextEquipmentUpgrade?.(item)).find(Boolean);
  if (upgrade) {
    return { title: '推进装备阶级', desc: '至少一件已穿戴装备还可以继续进阶。' };
  }
  return { title: '提升装备质量', desc: '寻找更高阶级或更适合当前职业的装备。' };
}

export function productionSuggestions(state = {}, context = handbookCtx) {
  const safeState = state && typeof state === 'object' ? state : {};
  const ctx = context && typeof context === 'object' ? context : {};
  const production = safeState.production || {};
  const mining = production.mining || {};
  const artisan = production.artisan || {};
  const crafting = production.crafting || {};
  const craftingLevel = Math.max(1, Math.floor(finite(crafting.level) || 1));
  const band = ctx.getCraftingMasteryBand?.(craftingLevel);
  const activeJob = artisan.activeJob && typeof artisan.activeJob === 'object' ? artisan.activeJob : null;
  return [
    {
      id: 'mining',
      title: '\u91c7\u77ff\u719f\u7ec3\u5ea6',
      desc: `Lv.${Math.max(1, Math.floor(finite(mining.level) || 1))} / EXP ${Math.max(0, Math.floor(finite(mining.exp)))}`,
      reason: '\u5b9a\u671f\u9886\u53d6\u77ff\u70b9\uff0c\u4f18\u5148\u50a8\u5907\u6253\u9020\u80da\u5b50\u6240\u9700\u7684\u77ff\u77f3\u3002',
    },
    {
      id: 'artisan',
      title: '\u5de5\u5320\u59d4\u6258',
      desc: activeJob ? '\u5df2\u6709\u59d4\u6258\u8fdb\u884c\u4e2d' : `Lv.${Math.max(1, Math.floor(finite(artisan.level) || 1))}`,
      reason: activeJob
        ? '\u7b49\u5f85\u5f53\u524d\u59d4\u6258\u5b8c\u6210\uff0c\u518d\u8865\u5145\u88c5\u5907\u80da\u5b50\u3002'
        : '\u5f00\u59cb\u6b66\u5668\u6216\u9632\u5177\u80da\u5b50\u59d4\u6258\uff0c\u4e3a\u4e0b\u4e00\u6b21\u6253\u9020\u505a\u51c6\u5907\u3002',
    },
    {
      id: 'crafting',
      title: '\u6253\u9020\u719f\u7ec3\u5ea6',
      desc: band?.label ? `Lv.${craftingLevel} / ${band.label}` : `Lv.${craftingLevel}`,
      reason: '\u7528\u4f4e\u9636\u914d\u65b9\u7a33\u5b9a\u5347\u7ea7\uff0c\u89e3\u9501\u66f4\u9ad8\u7a00\u6709\u5ea6\u7684\u88c5\u5907\u6253\u9020\u3002',
    },
  ];
}

function craftingRarityForLevel(level) {
  if (level >= 81) return 'mythic';
  if (level >= 61) return 'darkGold';
  if (level >= 41) return 'legend';
  if (level >= 21) return 'epic';
  return 'rare';
}

function craftReason(result = {}) {
  if (result.ok) return '\u6750\u6599\u5df2\u5c31\u7eea\uff0c\u53ef\u76f4\u63a5\u524d\u5f80\u94c1\u5320\u94fa\u6253\u9020\u3002';
  if (result.reason === 'level_too_low') return '\u6253\u9020\u719f\u7ec3\u5ea6\u4e0d\u8db3\uff0c\u5148\u901a\u8fc7\u4f4e\u9636\u88c5\u5907\u7ec3\u7ea7\u3002';
  if (result.reason === 'blueprint_missing') return '\u9700\u8981\u5148\u89e3\u9501\u5bf9\u5e94\u84dd\u56fe\u3002';
  if (result.reason === 'not_affordable') return '\u91d1\u5e01\u6216\u6750\u6599\u5c1a\u6709\u7f3a\u53e3\uff0c\u53ef\u5148\u8865\u91c7\u77ff\u548c\u6750\u6599\u6389\u843d\u3002';
  return '\u7ee7\u7eed\u8865\u9f50\u6253\u9020\u6761\u4ef6\u3002';
}

export function craftingTargets(state = {}, context = handbookCtx) {
  const safeState = state && typeof state === 'object' ? state : {};
  const ctx = context && typeof context === 'object' ? context : {};
  const runtime = ctx.getEquipmentRuntime?.() || (typeof window !== 'undefined' ? window.RuneFrontierEquipmentRuntime : null);
  const seriesMap = runtime?.EQUIPMENT_SERIES || ctx.EQUIPMENT_SERIES || {};
  const getRecipe = runtime?.getEquipmentCraftingRecipe || ctx.getEquipmentCraftingRecipe;
  const canCraft = runtime?.canCraftEquipment || ctx.canCraftEquipment;
  if (!getRecipe || !canCraft) return [];

  const craftingLevel = Math.max(1, Math.floor(finite(safeState.production?.crafting?.level) || 1));
  const rarity = craftingRarityForLevel(craftingLevel);
  const slots = ['weapon', 'armor', 'shoes', 'trinket'];
  return Object.values(seriesMap)
    .filter((series) => series?.id && series.id !== 'oldWorld')
    .slice(0, 5)
    .map((series, index) => {
      const request = {
        series: series.id,
        growthTier: series.defaultTier,
        slot: slots[index % slots.length],
        archetype: 'general',
        rarity,
      };
      const result = canCraft(request, ctx) || {};
      const recipe = result.recipe || getRecipe(request);
      const materialCount = Object.values(recipe?.materials || {}).reduce((sum, amount) => sum + Math.max(0, Math.floor(finite(amount))), 0);
      return {
        id: recipe?.id || `${series.id}_${request.slot}_${rarity}`,
        title: `${series.label || series.id} ${request.slot}`,
        desc: `${rarity} / Lv.${recipe?.level || 1} / ${materialCount}\u4ef6\u6750\u6599`,
        reason: craftReason(result),
        craftable: Boolean(result.ok),
      };
    })
    .slice(0, 5);
}

export function buildAdventureHandbookModel(state = handbookCtx.getState?.() || {}, context = handbookCtx) {
  const safeState = state && typeof state === 'object' ? state : {};
  const ctx = context && typeof context === 'object' ? context : {};
  const normalized = normalizeAdventureHandbookState(
    safeState.adventureHandbook,
    currentDate(ctx),
    currentWeekKey(ctx),
  );
  const stats = ctx.computeStats?.() || {};
  return {
    researchPoints: normalized.researchPoints,
    power: finite(stats.power),
    stats,
    dailyGoals: goalRows(DAILY_GOALS, normalized.daily),
    weeklyGoals: goalRows(WEEKLY_GOALS, normalized.weekly),
    mapRecommendation: ctx.getMapRecommendation?.(safeState, stats) || defaultMapRecommendation(safeState, ctx),
    materials: materialRecommendations(safeState, ctx),
    dungeons: (ctx.getDungeonCards?.(safeState, stats) || [])
      .filter((entry) => finite(entry.remaining) > 0)
      .slice(0, 3),
    equipmentTarget: ctx.getEquipmentTarget?.(safeState, stats) || defaultEquipmentTarget(safeState, ctx),
    productionSuggestions: productionSuggestions(safeState, ctx),
    craftingTargets: craftingTargets(safeState, ctx),
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
