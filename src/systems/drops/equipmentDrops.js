let runtimeContext = {};

export function configureEquipmentDropsContext(context = {}) {
  runtimeContext = context || {};
}

export function resolveEquipmentDropLevel({
  baseLevel = 1,
  minLevel,
  maxLevel,
  difficulty,
} = {}, context = runtimeContext) {
  const difficultyId = difficulty || context.currentDifficulty?.() || 'normal';
  const bonus = context.getDifficultyDropLevelBonus?.(difficultyId) || { min: 0, max: 0 };
  const bonusMin = Number(bonus.min || 0);
  const bonusMax = Number(bonus.max ?? bonusMin);
  const clampLevel = (value) => context.clampLevel?.(value) ?? Math.max(1, Math.round(Number(value) || 1));

  if (Number.isFinite(Number(minLevel)) && Number.isFinite(Number(maxLevel))) {
    const min = clampLevel(Number(minLevel) + bonusMin);
    const max = clampLevel(Number(maxLevel) + bonusMax);
    return context.randomInt?.(Math.min(min, max), Math.max(min, max)) ?? Math.min(min, max);
  }

  const base = clampLevel(baseLevel);
  if (!bonusMin && !bonusMax) return base;
  const offset = context.randomInt?.(Math.min(bonusMin, bonusMax), Math.max(bonusMin, bonusMax))
    ?? Math.min(bonusMin, bonusMax);
  return clampLevel(base + offset);
}

export function rollEquipmentTableDrops(stats, options = {}, context = runtimeContext) {
  const map = context.currentMap?.() || {};
  const tableId = context.getDropTableId?.(map.id) || map.id;
  const rows = context.getEquipmentDropTable?.(tableId) || [];
  const drops = rollEquipmentDropsFromTable(rows, stats, options, context);
  drops.forEach((item) => context.addEquipmentToInventory?.(item, { logDrop: true }));
  return drops.length;
}

export function rollEquipmentDropsFromTable(rows, stats, options = {}, context = runtimeContext) {
  if (!Array.isArray(rows) || !rows.length) return [];
  const isOffline = options.offline === true;
  const isBoss = options.boss === true;
  const guaranteed = options.guaranteed === true;
  const maxDrops = context.getMaxEquipmentDrops?.(isBoss) || 1;
  const weighted = rows
    .map((drop) => ({ drop, finalRate: context.getEffectiveEquipmentDropRate?.(drop, stats, { offline: isOffline, boss: isBoss }) || 0 }))
    .filter((entry) => entry.finalRate > 0 && context.getEquipmentTemplate?.(entry.drop.equipmentId));
  const drops = [];
  for (let attempt = 0; attempt < maxDrops && weighted.length; attempt += 1) {
    const totalChance = isOffline
      ? Math.min(0.75, weighted.reduce((sum, entry) => sum + entry.finalRate, 0))
      : context.getOnlineEquipmentDropChance?.(stats, { boss: isBoss, rows }) || 0;
    if (!guaranteed && (context.random?.() ?? Math.random()) >= totalChance) break;
    const pick = context.weightedChoice?.(
      weighted,
      (entry) => context.applyRebirthPrestigeDropWeight?.(entry.drop, Math.max(0, Number(entry.drop.dropRate || 0)), stats, { boss: isBoss }) || 0,
    );
    if (!pick) break;
    const template = context.getEquipmentTemplate?.(pick.drop.equipmentId);
    const mapId = pick.drop.mapId || context.currentMap?.()?.id || '';
    const dropLevel = resolveEquipmentDropLevel({
      minLevel: pick.drop.minLevel || 1,
      maxLevel: pick.drop.maxLevel || 1,
      mapId,
      difficulty: context.currentDifficulty?.(),
      source: isOffline ? 'offline-table' : 'equipment-table',
    }, context);
    const darkGoldRate = context.getDarkGoldUpgradeRate?.({ mapId, stats, boss: isBoss, drop: pick.drop }) || 0;
    const mythicQualityWeight = Number(stats?.mythicWeightBonus || 0) + (isBoss ? Number(stats?.bossQualityWeight || 0) : 0);
    const isAbyss = context.currentDifficulty?.() === 'abyss';
    const rolledRarity = isAbyss && (context.random?.() ?? Math.random()) < Math.min(0.08, mythicQualityWeight)
      ? 'mythic'
      : (context.random?.() ?? Math.random()) < darkGoldRate
        ? 'darkGold'
        : template.rarity;
    drops.push(context.createItem?.(template, dropLevel, rolledRarity, {
      dropMapId: mapId,
      dropLevel,
      difficulty: context.currentDifficulty?.(),
      allowMythic: rolledRarity === 'mythic',
    }));

    // 转生词缀：轮回刻印解锁后，装备有概率获得转生专属词缀
    if (drops.length > 0) {
      const lastDrop = drops[drops.length - 1];
      if (context.maybeAddRebirthAffix?.(lastDrop)) {
        lastDrop.rebirthAffix = context.getAssignedRebirthAffix?.();
      }
    }
    if (!isBoss) break;
  }
  return drops.filter(Boolean);
}
