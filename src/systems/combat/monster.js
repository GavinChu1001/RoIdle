let monsterContext = {};

function finite(value) {
  return Number.isFinite(Number(value || 0)) ? Number(value || 0) : 0;
}

function clamp(value, min, max, ctx = monsterContext) {
  return ctx.clampNumber ? ctx.clampNumber(value, min, max) : Math.max(min, Math.min(max, finite(value)));
}

function lerp(range, fallback, ratio, ctx = monsterContext) {
  if (ctx.lerpRange) return ctx.lerpRange(range, fallback, ratio);
  if (!Array.isArray(range)) return fallback;
  const min = Number(range[0]);
  const max = Number(range[1]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return fallback;
  return min + (max - min) * ratio;
}

function random(ctx = monsterContext) {
  return ctx.random?.() ?? Math.random();
}

function randomIntVal(min, max, ctx = monsterContext) {
  return ctx.randomInt ? ctx.randomInt(min, max) : Math.floor(random(ctx) * (max - min + 1)) + min;
}

function monsterImage(id, ctx = monsterContext) {
  return ctx.monsterImageSource?.(id) || '';
}

function monsterTemplate(id, name, hpRange, attackRange, defenseRange, expRange, jobExpRange, goldRange, type, ctx) {
  return { id, name, type, hpRange, attackRange, defenseRange, baseExpRange: expRange, jobExpRange, goldRange };
}

export function configureMonsterContext(context = {}) {
  monsterContext = context || {};
}

export function currentDifficultyConfig(context = monsterContext) {
  const state = context.getState?.() || {};
  const configs = context.getDifficultyConfigs?.() || {};
  return configs[state.currentDifficulty] || configs.normal || {};
}

export function getMapLevelRange(mapOrId, context = monsterContext) {
  const id = typeof mapOrId === 'string' ? mapOrId : mapOrId?.id;
  const ranges = context.getMapLevelRanges?.() || {};
  if (ranges[id]) return ranges[id];
  const alias = context.getDropTableAlias || ((mid) => mid);
  const tableId = alias(id) || id;
  return ranges[tableId] || ranges.beginner_field || { minLevel: 1, maxLevel: 1, attackRange: [1, 10] };
}

export function getMutationById(id, context = monsterContext) {
  const mutations = context.getMutations?.() || [];
  return mutations.find((m) => m.id === id) || null;
}

export function bossDisplayName(map, difficulty, context = monsterContext) {
  const state = context.getState?.() || {};
  const name = map?.boss || '地图首领';
  const diff = difficulty || state.currentDifficulty;
  return diff === 'abyss' ? `深渊 ${name}` : name;
}

export function pickMonsterTemplate(map, isBoss = false, context = monsterContext) {
  if (isBoss) {
    if (map.bossTemplate) return map.bossTemplate;
    const ctxMap = context.getMaps?.() || [];
    const m = ctxMap.find((entry) => entry.id === map.id) || map;
    return monsterTemplate(`${m.id}_boss`, m.boss, [m.maxLevel, m.maxLevel], [m.baseHp * (m.bossMultiplier || 1), m.baseHp * (m.bossMultiplier || 1)], [20, 20], [10, 10], [(m.baseExp || 1) * 8, (m.baseExp || 1) * 8], [(m.jobExp || m.baseExp || 1) * 8, (m.jobExp || m.baseExp || 1) * 8], [(m.gold || 1) * 8, (m.gold || 1) * 8], 'boss', context);
  }
  const monsters = Array.isArray(map.monsters) && map.monsters.length ? map.monsters : [
    monsterTemplate(`${map.id}_monster`, map.enemy || '未知', [map.minLevel || 1, map.maxLevel || 1], [map.baseHp || 1, (map.baseHp || 1) * 2], getMapLevelRange(map, context).attackRange, [1, 10], [map.baseExp || 1, (map.baseExp || 1) * 2], [map.jobExp || map.baseExp || 1, (map.jobExp || map.baseExp || 1) * 2], [map.gold || 1, (map.gold || 1) * 2], 'monster', context),
  ];
  const elite = monsters.filter((entry) => entry.type === 'elite');
  if (elite.length && random(context) < 0.1) return elite[Math.floor(random(context) * elite.length)];
  const normal = monsters.filter((entry) => entry.type !== 'elite');
  const pool = normal.length ? normal : monsters;
  return pool[Math.floor(random(context) * pool.length)];
}

export function getMonsterTemplate(map, templateId, isBoss = false, context = monsterContext) {
  if (isBoss) return map.bossTemplate || pickMonsterTemplate(map, true, context);
  const monsters = Array.isArray(map.monsters) ? map.monsters : [];
  return monsters.find((entry) => entry.id === templateId) || monsters[0] || pickMonsterTemplate(map, false, context);
}

export function rollMonsterMutation(difficulty, context = monsterContext) {
  const state = context.getState?.() || {};
  const configs = context.getDifficultyConfigs?.() || {};
  const config = configs[difficulty || state.currentDifficulty] || configs.normal || {};
  if (random(context) >= finite(config.mutationChance)) return null;
  const mutations = context.getMutations?.() || [];
  return mutations.length ? mutations[Math.floor(random(context) * mutations.length)] : null;
}

export function rollMonsterLevel(map, isBoss = false, template = null, context = monsterContext) {
  const range = getMapLevelRange(map, context);
  const levelRange = template?.levelRange || [range.minLevel, range.maxLevel];
  const minLevel = clamp(levelRange[0], range.minLevel, isBoss ? range.maxLevel + 5 : range.maxLevel, context);
  const maxLevel = clamp(levelRange[1], minLevel, isBoss ? range.maxLevel + 5 : range.maxLevel, context);
  return randomIntVal(minLevel, maxLevel, context);
}

export function getMonsterDifficultyType({ isBoss = false, monster = {}, mutation = null, difficultyId } = {}, context = monsterContext) {
  const state = context.getState?.() || {};
  const diff = difficultyId || state.currentDifficulty;
  const eliteLike = monster.type === 'elite' || mutation?.id === 'elite';
  if (diff === 'abyss' && isBoss) return 'abyssBoss';
  if (diff === 'abyss' && eliteLike) return 'abyssElite';
  if (diff === 'abyss') return 'abyss';
  if (diff === 'hard' && isBoss) return 'hardBoss';
  if (diff === 'hard' && eliteLike) return 'hardElite';
  if (diff === 'hard') return 'hard';
  if (isBoss) return 'boss';
  if (eliteLike) return 'elite';
  return 'normal';
}

function applyMonsterDifficultyModifier(stats = {}, type = 'normal', context = monsterContext) {
  const modifiers = context.getMonsterDifficultyModifiers?.() || {};
  const modifier = modifiers[type] || modifiers.normal || {};
  const critDamage = Math.max(finite(stats.critDamage), finite(modifier.critDamage || 1.5) - 1);
  return {
    ...stats,
    maxHp: Math.max(1, Math.round(finite(stats.maxHp) * finite(modifier.hp || 1))),
    attack: Math.max(1, Math.round(finite(stats.attack) * finite(modifier.atk || 1))),
    defense: Math.max(1, Math.round(finite(stats.defense) * finite(modifier.def || 1))),
    hit: finite(modifier.hit || stats.hit || 1),
    critChance: Math.max(finite(stats.critChance), finite(modifier.critChance)),
    critDamage,
    damageReduction: Math.max(finite(stats.damageReduction), finite(modifier.damageReduction)),
    armorPierce: Math.max(finite(stats.armorPierce), finite(modifier.armorPierce)),
    executeDamage: Math.max(finite(stats.executeDamage), finite(modifier.executeDamage)),
    antiLifeSteal: Math.max(finite(stats.antiLifeSteal), finite(modifier.antiLifeSteal)),
    abyssSuppression: Math.max(finite(stats.abyssSuppression), finite(modifier.abyssSuppression)),
    abyssPower: Math.max(finite(stats.abyssPower), finite(modifier.abyssPower)),
  };
}

function applyDifficultyTierBaseline(map, stats, isBoss = false, difficultyId, context = monsterContext) {
  const state = context.getState?.() || {};
  const diff = difficultyId || state.currentDifficulty;
  if (diff === 'abyss') return applyAbyssBaseline(map, stats, isBoss, context);
  if (diff === 'hard') return applyHardBaseline(map, stats, isBoss, context);
  return stats;
}

function applyHardBaseline(map, stats, isBoss = false, context = monsterContext) {
  const scales = context.getHardMapTierScales?.() || {};
  const scale = scales[map.id] || scales.grass || {};
  const tiers = context.getDifficultyTierModifiers?.() || {};
  const tier = tiers.hard || {};
  const boss = isBoss ? { hp: 1.85, attack: 1.45, defense: 1.32, exp: 1.65, jobExp: 1.65, gold: 1.55 } : { hp: 1, attack: 1, defense: 1, exp: 1, jobExp: 1, gold: 1 };
  const attackScale = finite(scale.attack) * finite(boss.attack);
  const baselines = context.getHardBaselines?.() || {};
  const hb = baselines;
  return {
    maxHp: Math.max(finite(stats.maxHp), Math.round(finite(hb.hp) * finite(scale.hp) * finite(boss.hp))),
    attack: Math.max(finite(stats.attack), Math.round(finite(hb.attack) * attackScale)),
    defense: Math.max(finite(stats.defense), Math.round(finite(hb.defense) * finite(scale.defense) * finite(boss.defense))),
    exp: Math.max(finite(stats.exp), Math.round(finite(hb.baseExp) * finite(scale.exp) * finite(boss.exp))),
    jobExp: Math.max(finite(stats.jobExp), Math.round(finite(hb.jobExp) * finite(scale.exp) * finite(boss.jobExp))),
    gold: Math.max(finite(stats.gold), Math.round(finite(hb.gold) * finite(scale.gold) * finite(boss.gold))),
    armorPierce: isBoss ? Math.max(0.08, finite(tier.armorPierce) + 0.03) : finite(tier.armorPierce || 0.03),
    critChance: Math.min(0.28, 0.06 + finite(scale.attack) * 0.018 + (isBoss ? 0.06 : 0)),
    critDamage: Math.min(0.85, 0.28 + finite(scale.attack) * 0.03 + (isBoss ? 0.18 : 0)),
    executeDamage: isBoss ? Math.min(0.25, 0.08 + finite(scale.attack) * 0.02) : 0,
    damageReduction: finite(tier.damageReduction),
  };
}

function applyAbyssBaseline(map, stats, isBoss = false, context = monsterContext) {
  const scales = context.getAbyssMapTierScales?.() || {};
  const scale = scales[map.id] || scales.grass || {};
  const tiers = context.getDifficultyTierModifiers?.() || {};
  const tier = tiers.abyss || {};
  const bossMultipliers = context.getAbyssBossExtraMultipliers?.() || {};
  const boss = isBoss ? (bossMultipliers || { hp: 1, attack: 1, defense: 1, exp: 1, jobExp: 1, gold: 1 }) : { hp: 1, attack: 1, defense: 1, exp: 1, jobExp: 1, gold: 1 };
  const attackScale = finite(scale.attack) * finite(boss.attack);
  const baselines = context.getAbyssBaselines?.() || {};
  const ab = baselines;
  return {
    maxHp: Math.max(finite(stats.maxHp), Math.round(finite(ab.hp) * finite(scale.hp) * finite(boss.hp))),
    attack: Math.max(finite(stats.attack), Math.round(finite(ab.attack) * attackScale)),
    defense: Math.max(finite(stats.defense), Math.round(finite(ab.defense) * finite(scale.defense) * finite(boss.defense))),
    exp: Math.max(finite(stats.exp), Math.round(finite(ab.baseExp) * finite(scale.exp) * finite(boss.exp))),
    jobExp: Math.max(finite(stats.jobExp), Math.round(finite(ab.jobExp) * finite(scale.exp) * finite(boss.jobExp))),
    gold: Math.max(finite(stats.gold), Math.round(finite(ab.gold) * finite(scale.gold) * finite(boss.gold))),
    armorPierce: Math.min(0.55, finite(tier.armorPierce || 0.18) + finite(scale.attack) * 0.025 + (isBoss ? 0.08 : 0)),
    critChance: Math.min(0.38, 0.08 + finite(scale.attack) * 0.018 + (isBoss ? 0.08 : 0)),
    critDamage: Math.min(1.2, 0.35 + finite(scale.attack) * 0.035 + (isBoss ? 0.25 : 0)),
    executeDamage: Math.min(0.55, 0.12 + finite(scale.attack) * 0.02 + (isBoss ? 0.12 : 0)),
    damageReduction: finite(tier.damageReduction),
    antiLifeSteal: finite(tier.antiLifeSteal),
    abyssSuppression: finite(tier.abyssSuppression),
    abyssPower: attackScale,
  };
}

function getRecommendedScoresForMonster(map, difficultyType = 'normal', isBoss = false, context = monsterContext) {
  const state = context.getState?.() || {};
  const diffId = difficultyType.startsWith('abyss') ? 'abyss' : state.currentDifficulty;
  return getRecommendedScoresForMap(map, diffId, isBoss, difficultyType, context);
}

function getRecommendedScoresForMap(map, difficultyId, isBoss = false, difficultyType = '', context = monsterContext) {
  const range = getMapLevelRange(map, context);
  const configs = context.getDifficultyConfigs?.() || {};
  const diffConfig = configs[difficultyId] || configs.normal || {};
  const abyssScales = context.getAbyssMapTierScales?.() || {};
  const hardScales = context.getHardMapTierScales?.() || {};
  const basePower = difficultyId === 'abyss'
    ? (abyssScales[map.id] || {}).recommendedPower || 120000
    : difficultyId === 'hard'
      ? (hardScales[map.id] || {}).recommendedPower || 130000
    : Math.round((range.recommendedPower || map.recommendedPower || 80) * finite(diffConfig.power || 1));
  const type = difficultyType || getMonsterDifficultyType({ isBoss, monster: { type: isBoss ? 'boss' : 'normal' }, difficultyId }, context);
  const typeScale = { normal: 1, elite: 1.25, boss: 1.65, hard: 1.08, hardElite: 1.42, hardBoss: 2.05, abyss: 1, abyssElite: 1.28, abyssBoss: 1.9 }[type] || 1;
  const target = Math.max(1, Math.round(basePower * typeScale));
  const output = Math.round(target * (isBoss || type.includes('Boss') ? 0.52 : 0.42));
  const survival = Math.round(target * (difficultyId === 'abyss' ? 0.45 : difficultyId === 'hard' ? 0.42 : 0.36));
  return {
    output,
    survival,
    boss: isBoss || type.includes('Boss') || difficultyId === 'hard' ? Math.round(target * (difficultyId === 'hard' ? 0.26 : 0.32)) : 0,
    abyss: difficultyId === 'abyss' || type.startsWith('abyss') ? Math.round(target * 0.38) : 0,
  };
}

export function buildMonsterStats(map, isBoss, level, template = null, mutationId = '', context = monsterContext) {
  const state = context.getState?.() || {};
  const mTemplate = template || getMonsterTemplate(map, state.enemyTemplateId, isBoss, context);
  const diffConfig = currentDifficultyConfig(context);
  const mutation = isBoss ? null : getMutationById(mutationId, context);
  const levelRange = mTemplate.levelRange || [map.minLevel || 1, map.maxLevel || 1];
  const levelRatio = levelRange[1] === levelRange[0] ? 1 : clamp((level - levelRange[0]) / (levelRange[1] - levelRange[0]), 0, 1, context);
  const nameParts = [];
  if (state.currentDifficulty !== 'normal') nameParts.push(diffConfig.label || '困难');
  if (mutation) nameParts.push(mutation.prefix);
  nameParts.push(mTemplate.name || (isBoss ? map.boss : map.enemy));
  const expMultiplier = (isBoss ? context.getBossExpMultiplier?.() || 1 : 1) * finite(mutation?.exp || 1) * finite(diffConfig.exp);
  const jobExpMultiplier = (isBoss ? context.getBossExpMultiplier?.() || 1 : 1) * finite(mutation?.jobExp || 1) * finite(diffConfig.jobExp);
  const baseExpGlobal = context.getBaseExpGlobalMultiplier?.() || 1;
  const jobExpGlobal = context.getJobExpGlobalMultiplier?.() || 1;
  const attackRange = getMapLevelRange(map, context).attackRange || [1, 10];
  const baseStats = {
    maxHp: Math.max(1, Math.round(lerp(mTemplate.hpRange, map.baseHp || 1, levelRatio, context) * finite(mutation?.hp || 1) * finite(diffConfig.hp))),
    attack: Math.max(1, Math.round(lerp(mTemplate.attackRange, attackRange[0], levelRatio, context) * finite(mutation?.attack || 1) * finite(diffConfig.attack))),
    defense: Math.max(1, Math.round(lerp(mTemplate.defenseRange, 1, levelRatio, context) * finite(mutation?.defense || 1) * finite(diffConfig.defense))),
    exp: Math.max(1, Math.round(lerp(mTemplate.baseExpRange, map.baseExp || 1, levelRatio, context) * baseExpGlobal * expMultiplier)),
    jobExp: Math.max(1, Math.round(lerp(mTemplate.jobExpRange, map.jobExp || map.baseExp || 1, levelRatio, context) * jobExpGlobal * jobExpMultiplier)),
    gold: Math.max(1, Math.round(lerp(mTemplate.goldRange, map.gold || 1, levelRatio, context) * finite(mutation?.gold || 1) * finite(diffConfig.gold))),
  };
  const baselineStats = applyDifficultyTierBaseline(map, baseStats, isBoss, state.currentDifficulty, context);
  const difficultyType = getMonsterDifficultyType({ isBoss, monster: mTemplate, mutation, difficultyId: state.currentDifficulty }, context);
  const finalStats = applyMonsterDifficultyModifier(baselineStats, difficultyType, context);
  return {
    id: mTemplate.id || `${map.id}_${isBoss ? 'boss' : 'monster'}`,
    name: nameParts.join(' '),
    type: mTemplate.type || (isBoss ? 'boss' : 'normal'),
    difficultyType,
    mutation,
    difficulty: state.currentDifficulty,
    level,
    maxHp: finalStats.maxHp,
    currentHp: state.enemyHp,
    attack: finalStats.attack,
    defense: finalStats.defense,
    armorPierce: finalStats.armorPierce || 0,
    critChance: finalStats.critChance || 0,
    critDamage: finalStats.critDamage || 0,
    executeDamage: finalStats.executeDamage || 0,
    damageReduction: finalStats.damageReduction || 0,
    antiLifeSteal: finalStats.antiLifeSteal || 0,
    abyssSuppression: finalStats.abyssSuppression || 0,
    abyssPower: finalStats.abyssPower || 0,
    hit: finalStats.hit || 1,
    recommendedScores: getRecommendedScoresForMonster(map, difficultyType, isBoss, context),
    exp: finalStats.exp,
    jobExp: finalStats.jobExp,
    gold: finalStats.gold,
    image: monsterImage(mTemplate.id || `${map.id}_${isBoss ? 'boss' : 'monster'}`, context),
    mapId: map.id,
  };
}
