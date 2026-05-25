let runtimeContext = {};

export function configureEquipmentDropsContext(context = {}) {
  runtimeContext = context || {};
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
    const bonus = context.getDifficultyDropLevelBonus?.() || { min: 0, max: 0 };
    const minLv = context.clampLevel?.((pick.drop.minLevel || 1) + (bonus.min || 0)) || 1;
    const maxLv = context.clampLevel?.((pick.drop.maxLevel || 1) + (bonus.max || 0)) || 1;
    const dropLevel = context.randomInt?.(Math.min(minLv, maxLv), Math.max(minLv, maxLv)) || minLv;
    const mapId = pick.drop.mapId || context.currentMap?.()?.id || '';
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
    if (!isBoss) break;
  }
  return drops.filter(Boolean);
}
