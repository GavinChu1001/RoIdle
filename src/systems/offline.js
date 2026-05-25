let runtimeContext = {};

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function random(context = runtimeContext) {
  return context.random?.() ?? Math.random();
}

function mergeCountEntries(entries, idKey) {
  const merged = new Map();
  list(entries).forEach((entry) => {
    const id = entry?.[idKey];
    if (!id) return;
    const current = merged.get(id) || { ...entry, qty: 0 };
    current.qty += finite(entry.qty);
    merged.set(id, current);
  });
  return [...merged.values()].filter((entry) => entry.qty > 0);
}

function freeEquipmentSlots(rewards, context = runtimeContext) {
  const state = context.getState?.() || {};
  const limit = finite(context.getInventoryLimit?.());
  return { freeSlots: Math.max(0, limit - list(state.inventory).length - list(rewards?.equipments).length) };
}

export function configureOfflineContext(context = {}) {
  runtimeContext = context || {};
}

export function estimateMapAverageMonsterHp(map, context = runtimeContext) {
  const pick = context.pickMonsterTemplate || ((m) => context.getMaps?.().find((mt) => mt.id === m.id) || {});
  const build = context.buildMonsterStats;
  if (!map || !build) return 1;
  const monsters = Array.isArray(map.monsters) && map.monsters.length ? map.monsters : [pick(map, false)];
  const total = monsters.reduce((sum, template) => {
    const levelRange = template.levelRange || [map.minLevel || 1, map.maxLevel || 1];
    const level = Math.floor((levelRange[0] + levelRange[1]) / 2);
    return sum + build(map, false, level, template).maxHp;
  }, 0);
  return total / Math.max(1, monsters.length);
}

export function buildOfflineMonsterStats(map, context = runtimeContext) {
  const state = context.getState?.() || {};
  const pick = context.pickMonsterTemplate;
  const rollLevel = context.rollMonsterLevel;
  const rollMut = context.rollMonsterMutation;
  const build = context.buildMonsterStats;
  if (!map || !pick || !rollLevel || !build) return { gold: 0, exp: 0, jobExp: 0, mutation: false };
  const template = pick(map, false);
  const level = rollLevel(map, false, template);
  const previousMutation = state.enemyMutationId;
  const mutation = rollMut ? rollMut(state.currentDifficulty) : null;
  state.enemyMutationId = mutation?.id || "";
  const monster = build(map, false, level, template);
  state.enemyMutationId = previousMutation;
  return monster;
}

export function calculateOfflineRewards(character, offlineMs, mapId, context = runtimeContext) {
  const state = context.getState?.() || {};
  const maps = context.getMaps?.() || [];
  const currentMapFn = context.currentMap;
  const statsFn = context.computeStats;
  const diffCfg = context.getDifficultyConfig;
  const vipBonuses = context.getVipMilestoneBonuses;
  const emptyFn = context.createEmptyRewards;
  const offlineEfficiency = finite(context.getOfflineEfficiency?.());
  const offlineMaxKills = finite(context.getOfflineMaxKills?.());
  const maxOfflineSeconds = context.getMaxOfflineSeconds?.() ?? (12 * 60 * 60);
  const gainExpl = context.gainMapExploration;

  if (!state || !statsFn || !currentMapFn || !emptyFn) {
    return { seconds: 0, gold: 0, baseExp: 0, jobExp: 0 };
  }

  const rewards = emptyFn();
  const durationMs = Math.max(0, Math.floor(offlineMs || 0));
  const vipOfflineHoursBonus = vipBonuses ? (vipBonuses().offlineHoursBonus || 0) : 0;
  const cappedDurationMs = Math.min(durationMs, (maxOfflineSeconds + vipOfflineHoursBonus * 3600) * 1000);
  rewards.durationMs = durationMs;
  rewards.cappedDurationMs = cappedDurationMs;
  rewards.seconds = Math.floor(cappedDurationMs / 1000);
  const map = (currentMapFn()?.id || mapId) ? currentMapFn() : (maps.find((m) => m.id === mapId) || currentMapFn());
  rewards.mapId = map?.id || mapId || "";
  rewards.calculatedAt = new Date().toISOString();
  if (cappedDurationMs <= 0) return rewards;

  const stats = statsFn();
  const hp = character?.currentHp ?? state.hero?.currentHp ?? stats.maxHp;
  if (hp <= 0) {
    rewards.noRewardsReason = "角色生命值为 0，离线战斗停止。";
    return rewards;
  }

  const mapIndex = Math.max(0, maps.findIndex((m) => m.id === map.id));
  const seconds = cappedDurationMs / 1000;
  const averageHp = estimateMapAverageMonsterHp(map, context);
  const onlineKills = Math.max(0, (stats.dps || 0) / Math.max(1, averageHp)) * seconds;
  const vipEff = vipBonuses ? (vipBonuses().offlineEfficiencyBonus || 0) : 0;
  const killCount = Math.min(offlineMaxKills, Math.floor(onlineKills * Math.min(1, offlineEfficiency + vipEff + (stats.offlineEfficiencyBonus || 0))));
  rewards.killCount = killCount;
  if (killCount <= 0) return rewards;

  let mutationKills = 0;
  for (let kill = 0; kill < killCount; kill += 1) {
    const monster = buildOfflineMonsterStats(map, context);
    if (monster.mutation) mutationKills += 1;
    rewards.gold += Math.round(finite(monster.gold) * finite(stats.goldMultiplier) * finite(stats.monsterGoldMultiplier));
    rewards.baseExp += Math.round(finite(monster.exp) * finite(stats.baseExpMultiplier));
    rewards.jobExp += Math.round(finite(monster.jobExp) * finite(stats.jobExpMultiplier));
  }

  rollOfflineEquipmentDrops(rewards, stats, map, mapIndex, killCount, context);
  rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills, context);
  rollOfflineTransitionSetDrops(rewards, stats, map, killCount, context);
  rollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills, context);
  rollOfflineCardDrops(rewards, stats, map, mapIndex, killCount, context);
  rollOfflineMaterialDrops(rewards, stats, map, killCount, context);
  rollOfflineMutationExtraDrops(rewards, stats, map, mutationKills, context);
  if (gainExpl) gainExpl(map.id, killCount + mutationKills * 4, { offline: true });
  return rewards;
}

export function buildOfflineReward(seconds, context = runtimeContext) {
  const state = context.getState?.() || {};
  const currentMapFn = context.currentMap;
  if (!state || !currentMapFn) {
    return { seconds: 0, gold: 0, baseExp: 0, jobExp: 0, equipments: [], cards: [], materials: [] };
  }
  return calculateOfflineRewards(state.hero, Math.max(0, seconds) * 1000, currentMapFn().id, context);
}

export function getPendingOfflineRewards(context = runtimeContext) {
  const state = context.getState?.() || {};
  return context.normalizeLootRewards?.(state.offlinePending || state.offlineRewards || {}) || {};
}

export function hasPendingOfflineRewards(context = runtimeContext) {
  const pending = getPendingOfflineRewards(context);
  return Boolean(
    finite(pending.seconds) > 0 ||
    finite(pending.gold) > 0 ||
    finite(pending.baseExp) > 0 ||
    finite(pending.jobExp) > 0 ||
    list(pending.equipments).length ||
    list(pending.cards).length ||
    list(pending.materials).length ||
    finite(context.objectTotal?.(pending.autoSalvagedMaterials)) > 0
  );
}

export function markLootViewed(context = runtimeContext) {
  const state = context.getState?.();
  if (!state) return;
  state.lootNotifyUnread = false;
  state.lastLootViewedAt = context.now?.() || Date.now();
}

export function getLootRewardsForView(context = runtimeContext) {
  if (hasPendingOfflineRewards(context)) return getPendingOfflineRewards(context);
  const state = context.getState?.() || {};
  return context.getLatestRecentLootRewards?.(state) || null;
}

export function processGeneratedOfflineEquipment(rewards, items = [], capacityState = {}, options = {}, context = runtimeContext) {
  const equipment = context.getEquipmentRuntime?.();
  const result = rewards || {};
  result.equipments = list(result.equipments);
  result.materials = list(result.materials);
  const capacity = capacityState || {};
  capacity.freeSlots = Math.max(0, finite(capacity.freeSlots));
  list(items).forEach((item) => {
    if (equipment?.shouldAutoSalvage?.(item)) {
      context.mergeMaterialReward?.(result.materials, equipment.getSalvageRewards(item));
      return;
    }
    if (capacity.freeSlots <= 0) {
      if (context.canOfflineFullSalvage?.(item, options)) {
        context.mergeMaterialReward?.(result.materials, equipment?.getSalvageRewards?.(item) || {});
      } else {
        result.equipments.push(item);
      }
      return;
    }
    capacity.freeSlots -= 1;
    result.equipments.push(item);
  });
  return capacity;
}

export function claimOfflineRewards(context = runtimeContext) {
  const state = context.getState?.();
  const equipment = context.getEquipmentRuntime?.();
  if (!state || !equipment) return false;
  const pending = getPendingOfflineRewards(context);
  if (!hasPendingOfflineRewards(context)) {
    context.showToast?.('\u6682\u65e0\u79bb\u7ebf\u6536\u76ca');
    return false;
  }

  state.gold = finite(state.gold) + finite(pending.gold);
  context.gainExp?.(finite(pending.baseExp), finite(pending.jobExp));

  const claimedEquipment = [];
  const unclaimedEquipment = [];
  const offlineAutoSalvaged = {};
  list(pending.equipments).forEach((item) => {
    const result = equipment.addEquipmentToInventory(item, { logDrop: false, offline: true }) || {};
    if (result.added) claimedEquipment.push(item);
    if (result.skipped) unclaimedEquipment.push(item);
    if (result.salvaged) {
      Object.entries(object(result.rewards)).forEach(([id, qty]) => {
        offlineAutoSalvaged[id] = finite(offlineAutoSalvaged[id]) + finite(qty);
      });
    }
  });

  context.grantCards?.(list(pending.cards));
  context.grantMaterials?.(list(pending.materials));

  const summary = {
    ...pending,
    equipment: claimedEquipment,
    equipments: claimedEquipment,
    pendingEquipment: unclaimedEquipment,
    autoSalvagedMaterials: offlineAutoSalvaged,
    salvagedMaterials: offlineAutoSalvaged,
    skippedEquipment: unclaimedEquipment.length,
  };
  const nextPending = context.createEmptyRewards?.() || { equipments: [], cards: [], materials: [], autoSalvagedMaterials: {} };
  if (unclaimedEquipment.length) {
    nextPending.seconds = 1;
    nextPending.equipments = unclaimedEquipment;
    nextPending.skippedEquipment = unclaimedEquipment.length;
  }

  state.lastOfflineRewardsForView = summary;
  state.offlinePending = nextPending;
  state.offlineRewards = nextPending;
  context.recordRecentLoot?.(summary, '\u79bb\u7ebf\u6536\u76ca');
  context.afterClaim?.(summary, nextPending);
  return true;
}

export function rollOfflineEquipmentDrops(rewards, stats, map, mapIndex, killCount, context = runtimeContext) {
  const alias = context.getDropTableAlias;
  const table = context.getEquipmentDropTable;
  const rollFn = context.rollEquipmentDropsFromTable;
  const state = context.getState?.() || {};
  const invLimit = context.getInventoryLimit;
  if (!map || !table || !rollFn || !invLimit) return;
  const tableId = alias ? (alias(map.id) || map.id) : map.id;
  const rows = table(tableId) || [];
  if (!rows.length) return;
  const capacity = { freeSlots: Math.max(0, invLimit() - (state.inventory || []).length) };
  for (let kill = 0; kill < killCount; kill += 1) {
    const drops = rollFn(rows, stats, { offline: true });
    processGeneratedOfflineEquipment(rewards, drops, capacity, {}, context);
  }
}

export function rollOfflineCardDrops(rewards, stats, map, mapIndex, killCount, context = runtimeContext) {
  const rows = context.getCardDropTable?.(map?.id) || [];
  const found = {};
  const difficulty = context.getDifficultyConfig?.() || { cardDrop: 1 };
  for (let kill = 0; kill < finite(killCount); kill += 1) {
    rows.forEach((drop) => {
      if (drop.bossOnly) return;
      const rate = finite(drop.dropRate) * (1 + finite(stats?.cardDropBonus ?? stats?.dropBonus)) * finite(difficulty.cardDrop || 1);
      if (random(context) >= rate) return;
      const card = context.getCard?.(drop.cardId);
      if (!card) return;
      found[card.id] = found[card.id] || { cardId: card.id, name: card.name, rarity: drop.rarity || 'rare', qty: 0 };
      found[card.id].qty += 1;
    });
  }
  rewards.cards = Object.values(found);
  return rewards.cards;
}

export function rollOfflineMaterialDrops(rewards, stats, map, killCount, context = runtimeContext) {
  const rows = context.getMaterialDropTable?.(map?.id) || [];
  const found = {};
  const difficulty = context.getDifficultyConfig?.() || { materialDrop: 1 };
  for (let kill = 0; kill < finite(killCount); kill += 1) {
    rows.forEach((drop) => {
      const rate = finite(drop.dropRate) * (1 + finite(stats?.dropBonus)) * finite(difficulty.materialDrop || 1);
      if (random(context) >= rate) return;
      const baseQty = context.randomInt?.(drop.minQty || 1, drop.maxQty || drop.minQty || 1) || 1;
      const qty = context.applyMaterialQuantityBonus?.(baseQty, stats) ?? baseQty;
      found[drop.materialId] = found[drop.materialId] || {
        materialId: drop.materialId,
        name: context.getMaterialName?.(drop.materialId) || drop.materialId,
        rarity: context.getMaterialRarity?.(drop.materialId) || 'normal',
        qty: 0,
      };
      found[drop.materialId].qty += finite(qty);
    });
  }
  rewards.materials = mergeCountEntries([...list(rewards.materials), ...Object.values(found)], 'materialId');
  return rewards.materials;
}

export function rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills = 0, context = runtimeContext) {
  const setIds = context.getZodiacSetIds?.(map?.id) || [];
  if (!setIds.length) return 0;
  const rates = context.getZodiacSetDropRates?.() || {};
  const mythicRates = context.getMythicDropRates?.() || {};
  const difficulty = context.currentDifficulty?.() || 'normal';
  const isHard = difficulty === 'hard';
  const isAbyss = difficulty === 'abyss';
  const offlineRate = finite(context.getOfflineEquipmentDropRateMultiplier?.());
  const baseRate = (isAbyss ? finite(rates.hard) * 1.2 : isHard ? finite(rates.hard) : finite(rates.normal)) * offlineRate;
  const mutationRate = (isAbyss ? finite(rates.hardMutation) * 1.25 : isHard ? finite(rates.hardMutation) : finite(rates.mutation)) * offlineRate;
  const dropBonus = 1 + Math.min(1.5, finite(stats?.equipmentDropBonus));
  const capacity = freeEquipmentSlots(rewards, context);
  let count = 0;
  for (let kill = 0; kill < Math.min(finite(killCount), finite(context.getOfflineMaxKills?.())); kill += 1) {
    if (random(context) >= (baseRate + (kill < mutationKills ? mutationRate : 0)) * dropBonus) continue;
    const set = context.getEquipmentSet?.(setIds[Math.floor(random(context) * setIds.length)]);
    if (!set?.items?.length) continue;
    const darkRate = finite(rates.darkGoldNormal) * offlineRate * (isAbyss ? 1.5 : isHard ? 1.25 : 1) * dropBonus;
    const mythicRate = isAbyss ? finite(mythicRates.abyssNormal) * offlineRate * 0.5 * dropBonus : 0;
    const rarity = random(context) < mythicRate ? 'mythic' : random(context) < darkRate ? 'darkGold' : 'legend';
    const template = set.items[Math.floor(random(context) * set.items.length)];
    const range = context.getMapLevelRange?.(map) || { maxLevel: 1 };
    const dropLevel = template.level || range.maxLevel;
    const item = context.createItem?.(template, dropLevel, rarity, { dropMapId: map.id, dropLevel, difficulty, allowMythic: rarity === 'mythic' });
    if (!item) continue;
    processGeneratedOfflineEquipment(rewards, [item], capacity, {}, context);
    count += 1;
  }
  return count;
}

export function rollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills = 0, context = runtimeContext) {
  if (context.currentDifficulty?.() !== 'abyss') return 0;
  const rates = context.getMythicDropRates?.() || {};
  const offlineRate = finite(context.getOfflineEquipmentDropRateMultiplier?.());
  const dropBonus = 1 + Math.min(1.5, finite(stats?.equipmentDropBonus));
  const capacity = freeEquipmentSlots(rewards, context);
  let count = 0;
  for (let kill = 0; kill < Math.min(finite(killCount), finite(context.getOfflineMaxKills?.())); kill += 1) {
    const baseRate = kill < mutationKills ? finite(rates.abyssMutation) : finite(rates.abyssNormal);
    if (random(context) >= baseRate * offlineRate * dropBonus) continue;
    const item = context.createMutationEquipment?.('mythic');
    if (!item) continue;
    processGeneratedOfflineEquipment(rewards, [item], capacity, {}, context);
    count += 1;
  }
  return count;
}

export function rollOfflineTransitionSetDrops(rewards, stats, map, killCount, context = runtimeContext) {
  const setIds = context.getTransitionSetIds?.(map?.id) || [];
  if (!setIds.length) return 0;
  const rates = context.getTransitionSetDropRates?.() || {};
  const difficulty = context.currentDifficulty?.() || 'normal';
  const offlineRate = finite(context.getOfflineEquipmentDropRateMultiplier?.());
  const baseRate = (difficulty === 'abyss' ? finite(rates.hard) * 1.2 : difficulty === 'hard' ? finite(rates.hard) : finite(rates.normal)) * offlineRate;
  const dropBonus = 1 + Math.min(1.2, finite(stats?.equipmentDropBonus));
  const capacity = freeEquipmentSlots(rewards, context);
  let count = 0;
  for (let kill = 0; kill < Math.min(finite(killCount), finite(context.getOfflineMaxKills?.())); kill += 1) {
    if (random(context) >= baseRate * dropBonus) continue;
    const set = context.getEquipmentSet?.(setIds[Math.floor(random(context) * setIds.length)]);
    if (!set?.items?.length) continue;
    const template = set.items[Math.floor(random(context) * set.items.length)];
    const range = context.getMapLevelRange?.(map) || { maxLevel: 1 };
    const dropLevel = template.level || range.maxLevel;
    const item = context.createItem?.(template, dropLevel, template.rarity || 'rare', { dropMapId: map.id, dropLevel, difficulty });
    if (!item) continue;
    processGeneratedOfflineEquipment(rewards, [item], capacity, {}, context);
    count += 1;
  }
  return count;
}

export function rollOfflineMutationExtraDrops(rewards, stats, map, mutationKills, context = runtimeContext) {
  if (!mutationKills) return 0;
  const config = context.getMutationExtraDrops?.() || {};
  const difficulty = context.getDifficultyConfig?.() || { materialDrop: 1 };
  const difficultyId = context.currentDifficulty?.() || 'normal';
  const dropBonus = Math.min(1.5, finite(stats?.dropBonus));
  const equipmentBonus = Math.min(1.5, finite(stats?.equipmentDropBonus ?? stats?.dropBonus));
  const hardExtra = difficultyId === 'abyss' ? 2 : difficultyId === 'hard' ? 1.5 : 1;
  const offlineEfficiency = finite(context.getOfflineEfficiency?.());
  const offlineRate = finite(context.getOfflineEquipmentDropRateMultiplier?.());
  const materialRate = finite(config.materialBonusRate) * hardExtra * (1 + dropBonus) * finite(difficulty.materialDrop || 1) * offlineEfficiency;
  const rareMaterialRate = finite(config.rareMaterialBonusRate) * hardExtra * (1 + dropBonus) * finite(difficulty.materialDrop || 1) * offlineEfficiency;
  const highRate = finite(config.highRarityEquipmentRate) * hardExtra * (1 + equipmentBonus) * offlineRate;
  const darkRate = finite(config.darkGoldEquipmentRate) * (difficultyId === 'abyss' ? 1.5 : difficultyId === 'hard' ? 1.2 : 1) * (1 + equipmentBonus) * offlineRate;
  const mythicRate = difficultyId === 'abyss' ? finite(context.getMythicDropRates?.()?.abyssMutation) * (1 + equipmentBonus) * offlineRate : 0;
  const capacity = freeEquipmentSlots(rewards, context);
  let equipmentCount = 0;
  for (let index = 0; index < finite(mutationKills); index += 1) {
    if (random(context) < materialRate) {
      let qty = context.applyMaterialQuantityBonus?.(context.randomInt?.(1, 2) || 1, stats) || 1;
      if (random(context) < finite(stats?.mutationMaterialDoubleChance)) qty *= 2;
      context.mergeMaterialReward?.(rewards.materials, { ore: qty });
    }
    if (random(context) < rareMaterialRate) {
      context.mergeMaterialReward?.(rewards.materials, { rune: context.applyMaterialQuantityBonus?.(1, stats) || 1 });
    }
    const rarity = random(context) < mythicRate
      ? 'mythic'
      : random(context) < darkRate
        ? 'darkGold'
        : random(context) < highRate
          ? (finite(context.getMapIndex?.(map)) >= 3 ? 'legend' : 'epic')
          : '';
    if (!rarity) continue;
    const item = context.createMutationEquipment?.(rarity);
    if (!item) continue;
    processGeneratedOfflineEquipment(rewards, [item], capacity, {}, context);
    equipmentCount += 1;
  }
  return equipmentCount;
}

export function installOfflineRuntime(context = {}) {
  configureOfflineContext(context);
  const runtime = Object.freeze({
    calculateOfflineRewards,
    buildOfflineReward,
    buildOfflineMonsterStats,
    estimateMapAverageMonsterHp,
    claimOffline: claimOfflineRewards,
    getPendingOfflineRewards,
    hasPendingOfflineRewards,
    getLootRewardsForView,
    processGeneratedOfflineEquipment,
    claimOfflineRewards,
    markLootViewed,
    rollOfflineEquipmentDrops,
    rollOfflineCardDrops,
    rollOfflineMaterialDrops,
    rollOfflineZodiacSetDrops,
    rollOfflineTransitionSetDrops,
    rollOfflineMythicDrops,
    rollOfflineMutationExtraDrops,
  });
  window.RuneFrontierOfflineRuntime = runtime;
  window.Offline = runtime;
  return runtime;
}
