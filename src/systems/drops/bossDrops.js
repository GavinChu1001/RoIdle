import { resolveEquipmentDropLevel } from './equipmentDrops.js';

let runtimeContext = {};

export function configureBossDropsContext(context = {}) {
  runtimeContext = context || {};
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function random(context = runtimeContext) {
  return context.random?.() ?? Math.random();
}

export function rollZodiacSetDrops(monster, stats = {}, options = {}, context = runtimeContext) {
  const map = context.currentMap?.() || {};
  const setIds = context.getZodiacSetIds?.(map.id) || [];
  if (!Array.isArray(setIds) || !setIds.length) return 0;
  const rates = context.getZodiacSetDropRates?.() || {};
  const bossMultipliers = context.getAbyssBossMultiplier?.() || {};
  const mythicRates = context.getMythicDropRates?.() || {};
  const isBoss = Boolean(options.boss);
  const difficulty = context.currentDifficulty?.() || 'normal';
  const isHard = difficulty === 'hard';
  const isAbyss = difficulty === 'abyss';
  const isMutated = Boolean(monster?.mutation);
  const baseRate = isBoss
    ? isAbyss
      ? finite(rates.hardBoss) * 1.35 * finite(bossMultipliers.abyssSetDrop || 1)
      : isHard
        ? finite(rates.hardBoss)
        : finite(rates.boss)
    : isMutated
      ? isAbyss
        ? finite(rates.hardMutation) * 1.25
        : isHard
          ? finite(rates.hardMutation)
          : finite(rates.mutation)
      : isAbyss
        ? finite(rates.hard) * 1.2
        : isHard
          ? finite(rates.hard)
          : finite(rates.normal);
  const rate = baseRate * (1 + Math.min(1.5, finite(stats.equipmentDropBonus)));
  if (random(context) >= rate) return 0;
  const set = context.getEquipmentSet?.(setIds[Math.floor(random(context) * setIds.length)]);
  if (!set?.items?.length) return 0;
  const darkRate = finite(isBoss ? rates.darkGoldBoss : rates.darkGoldNormal) *
    (isAbyss ? 1.5 : isHard ? 1.25 : 1) *
    (1 + Math.min(1, finite(stats.equipmentDropBonus)));
  const qualityWeight = finite(stats.mythicWeightBonus) + (isBoss ? finite(stats.bossQualityWeight) : 0);
  const mythicRate = isAbyss
    ? finite(isBoss ? mythicRates.abyssBoss * finite(bossMultipliers.mythicDrop || 1) : mythicRates.abyssNormal) * 0.5 * (1 + Math.min(1.5, qualityWeight))
    : 0;
  const rarity = random(context) < mythicRate ? 'mythic' : random(context) < darkRate ? 'darkGold' : 'legend';
  const template = set.items[Math.floor(random(context) * set.items.length)];
  const range = context.getMapLevelRange?.(map) || { maxLevel: 1 };
  const dropLevel = resolveEquipmentDropLevel({
    baseLevel: monster?.level || template.level || range.maxLevel,
    mapId: map.id,
    difficulty,
    source: 'zodiac-set',
  }, context);
  const item = context.createItem?.(template, dropLevel, rarity, { dropMapId: map.id, dropLevel, difficulty, allowMythic: rarity === 'mythic' });
  if (!item) return 0;
  context.addEquipmentToInventory?.(item, { logDrop: true });
  return 1;
}

export function rollTransitionSetDrops(monster, stats = {}, options = {}, context = runtimeContext) {
  const map = context.currentMap?.() || {};
  const setIds = context.getTransitionSetIds?.(map.id) || [];
  if (!Array.isArray(setIds) || !setIds.length) return 0;
  const rates = context.getTransitionSetDropRates?.() || {};
  const isBoss = Boolean(options.boss);
  const difficulty = context.currentDifficulty?.() || 'normal';
  const baseRate = isBoss
    ? difficulty === 'abyss'
      ? finite(rates.abyssBoss)
      : difficulty === 'hard'
        ? finite(rates.hardBoss)
        : finite(rates.boss)
    : difficulty === 'abyss'
      ? finite(rates.abyss)
      : difficulty === 'hard'
        ? finite(rates.hard)
        : finite(rates.normal);
  const rate = baseRate * (1 + Math.min(1.2, finite(stats.equipmentDropBonus)));
  if (random(context) >= rate) return 0;
  const set = context.getEquipmentSet?.(setIds[Math.floor(random(context) * setIds.length)]);
  if (!set?.items?.length) return 0;
  const template = set.items[Math.floor(random(context) * set.items.length)];
  const range = context.getMapLevelRange?.(map) || { maxLevel: 1 };
  const dropLevel = resolveEquipmentDropLevel({
    baseLevel: monster?.level || template.level || range.maxLevel,
    mapId: map.id,
    difficulty,
    source: 'transition-set',
  }, context);
  const item = context.createItem?.(template, dropLevel, template.rarity || 'rare', { dropMapId: map.id, dropLevel, difficulty });
  if (!item) return 0;
  context.addEquipmentToInventory?.(item, { logDrop: true });
  return 1;
}

// Boss victory essence remains attached to combat settlement until that chain migrates.
export function grantBossEssence(mapIndex) {
  if (typeof window.grantBossEssence === 'function') return window.grantBossEssence(mapIndex);
}

export function getDarkGoldUpgradeRate(opts) {
  if (typeof window.getDarkGoldUpgradeRate === 'function') return window.getDarkGoldUpgradeRate(opts);
  return 0;
}
