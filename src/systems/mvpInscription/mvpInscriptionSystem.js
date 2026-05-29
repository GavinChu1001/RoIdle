import {
  MVP_INSCRIPTION_BASE_EXP_PER_MINUTE,
  MVP_INSCRIPTION_DIFFICULTY_MULTIPLIERS,
  MVP_INSCRIPTION_LOW_LEVEL_GAP,
  MVP_INSCRIPTION_LOW_MAP_GAP,
  MVP_INSCRIPTION_MAX_LEVEL,
  MVP_INSCRIPTION_MONSTER_EXP,
  MVP_INSCRIPTION_REBIRTH_EXP_BONUS,
  MVP_INSCRIPTION_STAGE_SIZE,
  MVP_INSCRIPTION_STAGES,
} from './mvpInscriptionData.js';

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.floor(finite(value))));
}

function roundExp(value) {
  return Math.round(finite(value) * 1000) / 1000;
}

export function defaultMvpInscription(now = Date.now) {
  return {
    level: 1,
    exp: 0,
    totalExp: 0,
    breakthroughLevel: 0,
    unlockedMarks: ['kingPoring'],
    bossFirstExpClaims: {},
    lastOnlineTickAt: typeof now === 'function' ? now() : Date.now(),
  };
}

export function getCompletedBreakthroughForLevel(level) {
  const band = Math.floor(clamp(level, 1, MVP_INSCRIPTION_MAX_LEVEL) / MVP_INSCRIPTION_STAGE_SIZE) * MVP_INSCRIPTION_STAGE_SIZE;
  return Math.max(0, Math.min(90, band));
}

export function normalizeMvpInscription(input = {}, now = Date.now) {
  const base = defaultMvpInscription(now);
  const level = clamp(input.level ?? base.level, 1, MVP_INSCRIPTION_MAX_LEVEL);
  const maxBreakthrough = getCompletedBreakthroughForLevel(level);
  const unlockedMarks = Array.isArray(input.unlockedMarks) && input.unlockedMarks.length
    ? input.unlockedMarks.filter(Boolean)
    : ['kingPoring'];
  return {
    ...base,
    ...input,
    level,
    exp: Math.max(0, finite(input.exp)),
    totalExp: Math.max(0, finite(input.totalExp)),
    breakthroughLevel: Math.max(0, Math.min(maxBreakthrough, Math.floor(finite(input.breakthroughLevel)))),
    unlockedMarks,
    bossFirstExpClaims: input.bossFirstExpClaims && typeof input.bossFirstExpClaims === 'object' ? input.bossFirstExpClaims : {},
    lastOnlineTickAt: Math.max(0, finite(input.lastOnlineTickAt || base.lastOnlineTickAt)),
  };
}

export function getMvpInscriptionStage(level) {
  const safeLevel = clamp(level, 1, MVP_INSCRIPTION_MAX_LEVEL);
  return MVP_INSCRIPTION_STAGES.find((stage) => safeLevel >= stage.minLevel && safeLevel <= stage.maxLevel) || MVP_INSCRIPTION_STAGES[0];
}

export function getMvpInscriptionLevelRequirement(level) {
  const safeLevel = clamp(level, 1, MVP_INSCRIPTION_MAX_LEVEL);
  if (safeLevel >= MVP_INSCRIPTION_MAX_LEVEL) return 0;
  const stageIndex = Math.floor((safeLevel - 1) / MVP_INSCRIPTION_STAGE_SIZE);
  const stageMultiplier = 1 + stageIndex * 0.22;
  return Math.round(120 * Math.pow(safeLevel, 1.45) * stageMultiplier);
}

export function isMvpInscriptionAtBreakthrough(inscription = {}) {
  const level = clamp(inscription.level, 1, MVP_INSCRIPTION_MAX_LEVEL);
  if (level >= MVP_INSCRIPTION_MAX_LEVEL) return false;
  return level % MVP_INSCRIPTION_STAGE_SIZE === 0 && finite(inscription.breakthroughLevel) < level;
}

export function addMvpInscriptionExp(inscription, amount) {
  const state = normalizeMvpInscription(inscription);
  Object.assign(inscription, state);
  const gain = Math.max(0, finite(amount));
  if (!gain || inscription.level >= MVP_INSCRIPTION_MAX_LEVEL) return { gained: 0, levelsGained: 0, blocked: false, reachedMax: inscription.level >= MVP_INSCRIPTION_MAX_LEVEL };
  if (isMvpInscriptionAtBreakthrough(inscription)) return { gained: 0, levelsGained: 0, blocked: true, reachedMax: false };

  inscription.exp += gain;
  inscription.totalExp += gain;
  let levelsGained = 0;
  let blocked = false;

  while (inscription.level < MVP_INSCRIPTION_MAX_LEVEL) {
    const need = getMvpInscriptionLevelRequirement(inscription.level);
    if (!need || inscription.exp < need) break;
    if (isMvpInscriptionAtBreakthrough(inscription)) {
      inscription.exp = Math.min(inscription.exp, need);
      blocked = true;
      break;
    }
    inscription.exp -= need;
    inscription.level += 1;
    levelsGained += 1;
    if (isMvpInscriptionAtBreakthrough(inscription)) {
      inscription.exp = Math.min(inscription.exp, getMvpInscriptionLevelRequirement(inscription.level));
      blocked = true;
      break;
    }
  }

  if (inscription.level >= MVP_INSCRIPTION_MAX_LEVEL) inscription.exp = 0;
  return { gained: gain, levelsGained, blocked: blocked && levelsGained === 0, reachedMax: inscription.level >= MVP_INSCRIPTION_MAX_LEVEL };
}

export function getMvpInscriptionMapMultiplier(mapIndex = 0) {
  return 1 + Math.max(0, Math.floor(finite(mapIndex))) * 0.03;
}

export function getMvpInscriptionDifficultyMultiplier(difficulty = 'normal') {
  return MVP_INSCRIPTION_DIFFICULTY_MULTIPLIERS[difficulty] || MVP_INSCRIPTION_DIFFICULTY_MULTIPLIERS.normal;
}

export function getMvpInscriptionRebirthMultiplier(rebirths = 0) {
  return 1 + Math.min(Math.max(0, finite(rebirths)) * MVP_INSCRIPTION_REBIRTH_EXP_BONUS, 0.30);
}

export function calculateMvpInscriptionOnlinePerMinute({ mapIndex = 0, difficulty = 'normal', rebirths = 0 } = {}) {
  return roundExp(
    MVP_INSCRIPTION_BASE_EXP_PER_MINUTE *
    getMvpInscriptionMapMultiplier(mapIndex) *
    getMvpInscriptionDifficultyMultiplier(difficulty) *
    getMvpInscriptionRebirthMultiplier(rebirths)
  );
}

export function isMvpInscriptionMonsterEffective({
  heroLevel = 1,
  monsterLevel = 1,
  currentMapIndex = 0,
  bestMapIndex = 0,
  isBoss = false,
  firstBossClear = false,
} = {}) {
  if (firstBossClear) return true;
  if (finite(heroLevel) - finite(monsterLevel) > MVP_INSCRIPTION_LOW_LEVEL_GAP) return false;
  if (!isBoss && finite(bestMapIndex) - finite(currentMapIndex) >= MVP_INSCRIPTION_LOW_MAP_GAP) return false;
  return true;
}

export function calculateMvpInscriptionMonsterExp({
  monster = {},
  heroLevel = 1,
  currentMapIndex = 0,
  bestMapIndex = 0,
  difficulty = 'normal',
  isBoss = false,
  isMutated = false,
  firstBossClear = false,
} = {}) {
  const monsterLevel = finite(monster.level || monster.baseLevel || monster.maxLevel);
  if (!isMvpInscriptionMonsterEffective({ heroLevel, monsterLevel, currentMapIndex, bestMapIndex, isBoss, firstBossClear })) return 0;
  let base = MVP_INSCRIPTION_MONSTER_EXP.normal;
  if (firstBossClear) base = MVP_INSCRIPTION_MONSTER_EXP.firstBossClear;
  else if (isBoss && difficulty === 'abyss') base = MVP_INSCRIPTION_MONSTER_EXP.abyssBoss;
  else if (isBoss) base = MVP_INSCRIPTION_MONSTER_EXP.boss;
  else if (isMutated) base = MVP_INSCRIPTION_MONSTER_EXP.mutated;
  else if (monster.type === 'elite') base = MVP_INSCRIPTION_MONSTER_EXP.elite;
  return roundExp(base * getMvpInscriptionMapMultiplier(currentMapIndex) * getMvpInscriptionDifficultyMultiplier(difficulty));
}

export function getMvpInscriptionBonuses(inscription = {}) {
  const normalized = normalizeMvpInscription(inscription);
  const level = normalized.level;
  const bonuses = {
    hpPct: level * 0.0025,
    atkPct: level * 0.0012,
    matkPct: level * 0.0012,
    defPct: level * 0.0008,
  };
  MVP_INSCRIPTION_STAGES.forEach((stage) => {
    if (normalized.breakthroughLevel >= stage.maxLevel) {
      Object.entries(stage.bonus || {}).forEach(([key, value]) => {
        bonuses[key] = (bonuses[key] || 0) + finite(value);
      });
    }
  });
  return bonuses;
}

export function getMvpInscriptionView(inscription = {}, context = {}) {
  const normalized = normalizeMvpInscription(inscription);
  const stage = getMvpInscriptionStage(normalized.level);
  const nextRequirement = getMvpInscriptionLevelRequirement(normalized.level);
  const progress = nextRequirement > 0 ? Math.min(1, normalized.exp / nextRequirement) : 1;
  const nextStage = MVP_INSCRIPTION_STAGES.find((entry) => entry.minLevel > stage.minLevel) || null;
  return {
    ...normalized,
    stage,
    stageName: stage.name,
    nextStage,
    nextRequirement,
    progress,
    onlinePerMinute: calculateMvpInscriptionOnlinePerMinute(context),
    atBreakthrough: isMvpInscriptionAtBreakthrough(normalized),
    bonuses: getMvpInscriptionBonuses(normalized),
  };
}
