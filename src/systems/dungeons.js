let dungeonCtx = {};

const DUNGEON_DEFINITIONS = [
  {
    id: 'daily_material',
    name: '每日材料副本',
    type: 'daily',
    attemptsPerDay: 2,
    recommendedPower: 1200,
    desc: '稳定补充装备成长材料。',
    rewards: { gold: 5000, materials: { ancientHeroShard: 3, heroReformInscription: 1, ore: 20 } },
  },
  {
    id: 'boss_trial',
    name: 'Boss 试炼',
    type: 'trial',
    attemptsPerDay: 1,
    recommendedPower: 3500,
    desc: '检验当前阶段输出与生存。',
    rewards: { gold: 18000, materials: { bossSoul: 1, heroReformInscription: 2, ancientCore: 1 } },
  },
];

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayKey() {
  return localDateKey();
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

export function defaultDungeonState(date = todayKey()) {
  return {
    date,
    entries: Object.fromEntries(DUNGEON_DEFINITIONS.map((dungeon) => [dungeon.id, { used: 0, bestClearPower: 0 }])),
  };
}

export function normalizeDungeonState(input = {}, date = todayKey()) {
  const base = defaultDungeonState(date);
  if (!input || typeof input !== 'object') return base;
  const savedEntries = input.entries && typeof input.entries === 'object' ? input.entries : {};
  const sameDate = input.date === date;
  base.entries = Object.fromEntries(DUNGEON_DEFINITIONS.map((dungeon) => {
    const saved = savedEntries[dungeon.id] || {};
    return [dungeon.id, {
      used: sameDate ? Math.max(0, Math.min(dungeon.attemptsPerDay, Math.floor(finite(saved.used)))) : 0,
      bestClearPower: Math.max(0, Math.floor(finite(saved.bestClearPower))),
    }];
  }));
  return base;
}

export function getDungeonDefinitions() {
  return DUNGEON_DEFINITIONS.map((dungeon) => ({
    ...dungeon,
    rewards: { ...dungeon.rewards, materials: { ...(dungeon.rewards.materials || {}) } },
  }));
}

export function getDungeonCards(state = dungeonCtx.getState?.()) {
  const dungeons = normalizeDungeonState(state?.dungeons);
  return getDungeonDefinitions().map((dungeon) => {
    const entry = dungeons.entries[dungeon.id] || { used: 0, bestClearPower: 0 };
    return {
      ...dungeon,
      used: entry.used,
      remaining: Math.max(0, dungeon.attemptsPerDay - entry.used),
      bestClearPower: entry.bestClearPower,
    };
  });
}

export function canEnterDungeon(dungeonId, context = dungeonCtx) {
  const state = context.getState?.() || {};
  const dungeon = DUNGEON_DEFINITIONS.find((entry) => entry.id === dungeonId);
  if (!dungeon) return '副本不存在';
  state.dungeons = normalizeDungeonState(state.dungeons);
  const entry = state.dungeons.entries[dungeon.id];
  if (entry.used >= dungeon.attemptsPerDay) return '今日次数已用完';
  const power = finite((context.computeStats?.() || {}).power);
  if (power < dungeon.recommendedPower) return `推荐战力 ${context.formatNumber?.(dungeon.recommendedPower) || dungeon.recommendedPower}`;
  return '';
}

export function enterDungeon(dungeonId, context = dungeonCtx) {
  const state = context.getState?.() || {};
  const reason = canEnterDungeon(dungeonId, context);
  if (reason) {
    context.showToast?.(reason);
    return false;
  }
  const dungeon = DUNGEON_DEFINITIONS.find((entry) => entry.id === dungeonId);
  state.dungeons = normalizeDungeonState(state.dungeons);
  const entry = state.dungeons.entries[dungeon.id];
  const power = finite((context.computeStats?.() || {}).power);
  entry.used += 1;
  entry.bestClearPower = Math.max(finite(entry.bestClearPower), power);
  context.recordAdventureHandbookProgress?.('daily_dungeon', 1);
  context.recordAdventureHandbookProgress?.('weekly_dungeons', 1);
  context.grantGenericReward?.(dungeon.rewards);
  context.addLog?.(`完成副本：${dungeon.name}。`);
  context.showToast?.(`完成：${dungeon.name}`);
  context.save?.();
  context.renderAll?.();
  return true;
}

export function configureDungeonContext(context = {}) {
  dungeonCtx = context || {};
}

export function installDungeonRuntime(context = {}) {
  configureDungeonContext(context);
  const runtime = Object.freeze({
    defaultDungeonState,
    normalizeDungeonState,
    getDungeonDefinitions,
    getDungeonCards,
    canEnterDungeon,
    enterDungeon,
  });
  window.RuneFrontierDungeonRuntime = runtime;
  return runtime;
}
