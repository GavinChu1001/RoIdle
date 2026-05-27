import { buildMonsterStats, configureMonsterContext, currentDifficultyConfig, getMonsterTemplate, getMapLevelRange, pickMonsterTemplate, rollMonsterLevel, rollMonsterMutation } from './monster.js';

let encounterContext = {};

function getGlobal(name) {
  return typeof window !== 'undefined' ? window[name] : undefined;
}

function getRebirthSealDropChanceSquad() {
  return getGlobal('REBIRTH_SEAL_DROP_CHANCE_SQUAD') ?? 0.35;
}

function getRebirthSealDropChanceBoss() {
  return getGlobal('REBIRTH_SEAL_DROP_CHANCE_BOSS') ?? 1.0;
}

function getRebirthSquadSpawnChance() {
  return getGlobal('REBIRTH_SQUAD_SPAWN_CHANCE') ?? 0.15;
}

function getRebirthBossSpawnChance() {
  return getGlobal('REBIRTH_BOSS_SPAWN_CHANCE') ?? 0.05;
}

function getRebirthSquadSizeMin() {
  return getGlobal('REBIRTH_SQUAD_SIZE_MIN') ?? 3;
}

function getRebirthSquadSizeMax() {
  return getGlobal('REBIRTH_SQUAD_SIZE_MAX') ?? 5;
}

function finite(value) {
  return Number.isFinite(Number(value || 0)) ? Number(value || 0) : 0;
}

function clamp(value, min, max, ctx = encounterContext) {
  return ctx.clampNumber ? ctx.clampNumber(value, min, max) : Math.max(min, Math.min(max, finite(value)));
}

function random(ctx = encounterContext) {
  return ctx.random?.() ?? Math.random();
}

function randomIntVal(min, max, ctx = encounterContext) {
  return ctx.randomInt ? ctx.randomInt(min, max) : Math.floor(random(ctx) * (max - min + 1)) + min;
}

export function configureEncounterContext(context = {}) {
  encounterContext = context || {};
  configureMonsterContext(context);
}

export function getEncounterSize(isBoss = false, context = encounterContext) {
  const state = context.getState?.() || {};
  if (isBoss) return 1;
  if (state.currentDifficulty === 'abyss') return randomIntVal(2, 5, context);
  if (state.currentDifficulty === 'hard') return randomIntVal(2, 4, context);
  return randomIntVal(1, 3, context);
}

export function getEncounterLabel(monsters = [], context = encounterContext) {
  const state = context.getState?.() || {};
  if (monsters.some((m) => m.rebirthType === 'rebirthBoss')) return '轮回Boss';
  if (monsters.some((m) => m.rebirthType === 'rebirthSquad')) return '轮回小队';
  if (state.currentDifficulty === 'abyss') return monsters.some((m) => m.mutation) ? '深渊突袭' : '深渊遭遇';
  if (monsters.some((m) => m.mutation)) return '变异突袭';
  if (monsters.some((m) => m.type === 'elite')) return '精英带队';
  return monsters.length > 1 ? '小队遭遇' : '单体遭遇';
}

export function createEncounterMonster(map, isBoss = false, context = encounterContext) {
  const template = pickMonsterTemplate(map, isBoss, context);
  const mutationId = isBoss ? '' : (rollMonsterMutation(null, context)?.id || '');
  const level = rollMonsterLevel(map, isBoss, template, context);
  const monster = buildMonsterStats(map, isBoss, level, template, mutationId, context);
  return {
    ...monster,
    templateId: template.id,
    mutationId,
    currentHp: monster.maxHp,
    alive: true,
  };
}

export function createEnemyGroup(map, isBoss = false, context = encounterContext) {
  const size = getEncounterSize(isBoss, context);
  const monsters = Array.from({ length: size }, () => createEncounterMonster(map, isBoss, context));
  const label = isBoss ? '首领遭遇' : getEncounterLabel(monsters, context);
  return { label, activeIndex: 0, monsters };
}

export function createRebirthSquadGroup(map, context = encounterContext) {
  const state = context.getState?.() || {};
  const size = randomIntVal(getRebirthSquadSizeMin(), getRebirthSquadSizeMax(), context);
  const monsters = Array.from({ length: size }, () => {
    const monster = createEncounterMonster(map, false, context);
    monster.name = `⚡轮回 ${monster.name}`;
    monster.rebirthType = 'rebirthSquad';
    return monster;
  });
  return { label: '轮回小队', activeIndex: 0, monsters, rebirthEncounter: true };
}

export function createRebirthBossGroup(map, context = encounterContext) {
  const monster = createEncounterMonster(map, true, context);
  monster.name = `⚡轮回 ${monster.name}`;
  monster.rebirthType = 'rebirthBoss';
  // Boss stats already boosted; add extra rebirth oomph
  monster.maxHp = Math.round(monster.maxHp * 1.15);
  monster.attack = Math.round(monster.attack * 1.1);
  monster.defense = Math.round(monster.defense * 1.05);
  monster.currentHp = monster.maxHp;
  return { label: '轮回Boss', activeIndex: 0, monsters: [monster], rebirthEncounter: true };
}

export function normalizeEnemyGroup(group, context = encounterContext) {
  if (!group || !Array.isArray(group.monsters) || !group.monsters.length) return null;
  const monsters = group.monsters.map((monster) => ({
    ...monster,
    currentHp: clamp(Number(monster.currentHp ?? monster.maxHp ?? 1), 0, Number(monster.maxHp || 1), context),
    maxHp: Math.max(1, Number(monster.maxHp || 1)),
    alive: monster.alive !== false && Number(monster.currentHp ?? monster.maxHp ?? 1) > 0,
  }));
  const activeIndex = clamp(Number(group.activeIndex || 0), 0, monsters.length - 1, context);
  return { ...group, activeIndex, monsters };
}

export function spawnEnemy(isBoss = false, context = encounterContext) {
  const state = context.getState?.();
  const currentMapFn = context.currentMap;
  const addLogFn = context.addLog;
  const showBossFn = context.showBossBanner;
  if (!state || !currentMapFn) return;
  const map = currentMapFn();

  const rebirthMode = Boolean(state.rebirthMode && (state.hero?.rebirths || 0) > 0);

  if (!isBoss && rebirthMode && random(context) < getRebirthBossSpawnChance()) {
    state.enemyBoss = true;
    state.enemyGroup = createRebirthBossGroup(map, context);
  } else if (!isBoss && rebirthMode && random(context) < getRebirthSquadSpawnChance()) {
    state.enemyBoss = false;
    state.enemyGroup = createRebirthSquadGroup(map, context);
  } else {
    state.enemyBoss = Boolean(isBoss);
    state.enemyGroup = createEnemyGroup(map, state.enemyBoss, context);
  }

  syncActiveEnemyFromGroup(context);
  state.enemyAttackTimer = 0;
  state.playerAttackTimer = 0;
  state.damageCarry = 0;
  state.reviveUsedThisLife = false;
  if (state.enemyBoss && showBossFn) showBossFn(map);
  (state.enemyGroup?.monsters || []).forEach((monster) => {
    if (monster.mutation && addLogFn) addLogFn(`遭遇变异怪：${monster.name}。`);
    if (monster.rebirthType === 'rebirthBoss' && addLogFn) addLogFn(`⚡轮回Boss降临：${monster.name}！`);
    if (monster.rebirthType === 'rebirthSquad' && addLogFn) addLogFn(`⚡轮回小队出现：${monster.name}。`);
  });
}

export function currentMonsterStats(context = encounterContext) {
  const state = context.getState?.() || {};
  if (state.enemy) return { ...state.enemy, currentHp: state.enemyHp };
  const currentMapFn = context.currentMap;
  if (!currentMapFn) return { maxHp: 1 };
  const map = currentMapFn();
  const template = getMonsterTemplate(map, state.enemyTemplateId, state.enemyBoss, context);
  return buildMonsterStats(map, state.enemyBoss, state.enemyLevel || getMapLevelRange(map, context).minLevel, template, '', context);
}

export function syncActiveEnemyFromGroup(context = encounterContext) {
  const state = context.getState?.();
  if (!state) return null;
  const group = normalizeEnemyGroup(state.enemyGroup, context);
  state.enemyGroup = group;
  const active = group?.monsters?.find((monster) => monster.alive);
  if (!active) {
    state.enemy = null;
    state.enemyHp = 0;
    state.enemyMaxHp = 0;
    return null;
  }
  group.activeIndex = group.monsters.indexOf(active);
  state.enemy = { ...active };
  state.enemyTemplateId = active.templateId || active.id || '';
  state.enemyMutationId = active.mutationId || '';
  state.enemyLevel = active.level || 1;
  state.enemyMaxHp = active.maxHp || 1;
  state.enemyHp = clamp(Number(active.currentHp ?? active.maxHp ?? 1), 0, state.enemyMaxHp, context);
  return active;
}

export function updateActiveEnemyHpInGroup(context = encounterContext) {
  const state = context.getState?.();
  if (!state) return;
  const group = state.enemyGroup;
  if (!group || !Array.isArray(group.monsters)) return;
  const monster = group.monsters[group.activeIndex];
  if (!monster) return;
  monster.currentHp = Math.max(0, Number(state.enemyHp) || 0);
  monster.alive = monster.currentHp > 0;
}

export function hasLivingEncounterMembers(context = encounterContext) {
  const state = context.getState?.();
  if (!state) return false;
  updateActiveEnemyHpInGroup(context);
  return Boolean((state.enemyGroup?.monsters || []).some((monster) => monster.alive));
}
