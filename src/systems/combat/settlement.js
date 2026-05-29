let runtimeContext = {};

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function stateFrom(context = runtimeContext) {
  return context.getState?.() || {};
}

export function configureCombatSettlementContext(context = {}) {
  runtimeContext = context || {};
}

export function grantBossEssence(mapIndex, context = runtimeContext) {
  const state = stateFrom(context);
  state.materials = state.materials || {};
  const materialId = context.getBossEssenceId?.(mapIndex);
  if (!materialId) return { materialId: '', amount: 0 };
  const amount = finite(context.applyMaterialQuantityBonus?.(1 + Math.floor(finite(mapIndex) / 2)));
  state.materials[materialId] = finite(state.materials[materialId]) + amount;
  context.recordSessionReward?.({ materials: amount });
  context.recordRecentLoot?.({
    materials: [{ materialId, name: context.getMaterialName?.(materialId) || materialId, qty: amount }],
  }, 'Boss战利品');
  context.addLog?.(`获得 ${context.getMaterialName?.(materialId) || materialId} × ${amount}。`);
  return { materialId, amount };
}

export function settleBossVictory({ map, difficulty } = {}, context = runtimeContext) {
  const state = stateFrom(context);
  const currentMap = map || context.currentMap?.() || {};
  const mapIndex = finite(context.currentMapIndex?.());
  const difficultyId = difficulty || state.currentDifficulty || 'normal';
  const maps = context.getMaps?.() || [];
  const diffProgress = state.mapDifficultyProgress || {};
  const mapId = currentMap.id;
  const defaultProgress = () => ({
    normal: { unlocked: true, cleared: false },
    hard: { unlocked: false, cleared: false },
    abyss: { unlocked: false, cleared: false },
  });
  let firstBossClear = false;
  let vipReward = 0;

  grantBossEssence(mapIndex, context);
  state.areaKills = 0;
  if (mapId) {
    if (!diffProgress[mapId]) diffProgress[mapId] = defaultProgress();
    if (difficultyId === 'normal') {
      diffProgress[mapId].normal.cleared = true;
      diffProgress[mapId].hard.unlocked = true;
      context.addLog?.(`${currentMap.name} 普通难度通关，困难难度解锁。`);
    } else if (difficultyId === 'hard') {
      diffProgress[mapId].hard.cleared = true;
      diffProgress[mapId].abyss.unlocked = true;
      context.addLog?.(`${currentMap.name} 困难难度通关，深渊难度解锁。`);
    } else if (difficultyId === 'abyss') {
      diffProgress[mapId].abyss.cleared = true;
    }
  }
  if (context.getAutoBossEnabled?.()) context.addLog?.('自动挑战 BOSS 成功。');
  if (difficultyId === 'normal' && mapIndex < maps.length - 1) {
    state.bestMap = Math.max(finite(state.bestMap), mapIndex + 1);
    const nextMap = maps[mapIndex + 1];
    if (nextMap?.id) {
      if (!diffProgress[nextMap.id]) diffProgress[nextMap.id] = defaultProgress();
      diffProgress[nextMap.id].normal.unlocked = true;
      context.addLog?.(`首领退却，${nextMap.name} 开放。`);
    }
  } else if (difficultyId === 'normal' && mapIndex >= maps.length - 1) {
    context.addLog?.('浮岛神殿的钟声传遍边境。');
  }
  state.mapDifficultyProgress = diffProgress;
  state.vip = state.vip || {};
  state.vip.bossFirstKills = state.vip.bossFirstKills || {};
  const bossKey = `${mapId}_${difficultyId}`;
  if (mapId && !state.vip.bossFirstKills[bossKey]) {
    state.vip.bossFirstKills[bossKey] = true;
    const baseReward = difficultyId === 'abyss' ? 200 : difficultyId === 'hard' ? 150 : 100;
    vipReward = baseReward + Math.floor(mapIndex * 15);
    context.gainVipExp?.(vipReward);
    context.addLog?.(`首次击败 ${currentMap.name} ${context.getDifficultyLabel?.(difficultyId) || difficultyId} Boss，获得冒险者荣誉经验 +${vipReward}。`);
    firstBossClear = true;
  }

  // 转生模式自动巡逻：轮回共鸣解锁后，Boss通关自动进下一图
  const stateForPatrol = stateFrom(context);
  if (stateForPatrol.rebirthMode && typeof window !== 'undefined' && window.RuneFrontierRebirthRuntime?.isAutoPatrolUnlocked?.()) {
    const maps = context.getMaps?.() || [];
    if (mapIndex + 1 < maps.length) {
      stateForPatrol.currentMap = mapIndex + 1;
      const nextMap = maps[mapIndex + 1];
      context.addLog?.(`⚡轮回共鸣：自动进入 ${nextMap?.name || '下一地图'}。`);
    }
  }

  return { bossVictory: true, firstBossClear, vipReward };
}

export function settleDefeatedEnemy(payload = {}, context = runtimeContext) {
  const state = stateFrom(context);
  const map = payload.map || context.currentMap?.() || {};
  const monster = payload.monster || context.currentMonsterStats?.() || {};
  const isBoss = payload.isBoss ?? Boolean(state.enemyBoss);
  const difficulty = payload.difficulty || state.currentDifficulty || 'normal';
  const maps = context.getMaps?.() || [];
  const mapIndexFromList = map.id ? maps.findIndex((entry) => entry?.id === map.id) : -1;
  const defeatedMapIndex = finite(payload.currentMapIndex ?? payload.mapIndex ?? (mapIndexFromList >= 0 ? mapIndexFromList : context.currentMapIndex?.()));
  context.updateActiveEnemyHpInGroup?.();
  const stats = payload.stats || context.computeStats?.() || {};
  const bossBonus = isBoss ? 2 : 1;
  const goldGain = Math.round(finite(monster.gold) * bossBonus * finite(stats.goldMultiplier || 1) * finite(stats.monsterGoldMultiplier || 1));
  // V3 议价被动：击杀额外金币
  let goldBonus = 0;
  if (typeof window !== 'undefined' && window.RuneFrontierCombatRuntime?.getPassiveMechanismEffects) {
    const passive = window.RuneFrontierCombatRuntime.getPassiveMechanismEffects(state, stats);
    const bonusRate = isBoss ? finite(passive.bossGoldBonus) : finite(passive.killGoldBonus);
    if (bonusRate > 0) goldBonus = Math.round(goldGain * bonusRate);
  }
  const totalGold = goldGain + goldBonus;
  const baseExpGain = Math.round(finite(monster.exp) * finite(stats.baseExpMultiplier || 1));
  const jobExpGain = Math.round(finite(monster.jobExp) * (state.hero?.jobId === 'novice' ? 1.12 : 1) * finite(stats.jobExpMultiplier || 1));

  state.gold = finite(state.gold) + totalGold;
  context.presentKillRewards?.({ monster, baseExpGain, jobExpGain });
  context.gainExp?.(baseExpGain, jobExpGain);
  state.totalKills = finite(state.totalKills) + 1;
  context.recordSessionReward?.({
    kills: 1,
    bossKills: isBoss ? 1 : 0,
    abyssKills: difficulty === 'abyss' ? 1 : 0,
    gold: totalGold,
    baseExp: baseExpGain,
    jobExp: jobExpGain,
  });
  context.recordRecentLoot?.(
    { gold: goldGain, baseExp: baseExpGain, jobExp: jobExpGain, killCount: 1 },
    isBoss ? 'Boss战利品' : difficulty === 'abyss' ? '深渊战利品' : '战斗战利品',
  );
  context.updateDailyGoalProgress?.('daily_kills', 1);
  if (isBoss) context.updateDailyGoalProgress?.('daily_boss', 1);
  if (monster.id) {
    state.monsterCodex = state.monsterCodex || {};
    state.monsterCodex[monster.id] = state.monsterCodex[monster.id] || { killCount: 0, firstKilled: false, rewardsClaimed: {} };
    state.monsterCodex[monster.id].killCount = finite(state.monsterCodex[monster.id].killCount) + 1;
    state.monsterCodex[monster.id].firstKilled = true;
  }

  let bossResult = { bossVictory: false, firstBossClear: false, vipReward: 0 };
  if (isBoss) {
    bossResult = settleBossVictory({ map, difficulty }, context);
  } else {
    state.areaKills = Math.min(finite(context.bossRequirement?.()), finite(state.areaKills) + 1);
  }
  context.grantMvpInscriptionKillExp?.({
    monster,
    map,
    currentMapIndex: defeatedMapIndex,
    mapIndex: defeatedMapIndex,
    difficulty,
    isBoss,
    isMutated: Boolean(monster.mutation),
    isElite: Boolean(monster.type === 'elite' || monster.mutation),
    firstBossClear: Boolean(bossResult.firstBossClear),
  });

  const groupHasMoreMonsters = !isBoss && Boolean(context.hasLivingEncounterMembers?.());
  const shouldAutoBossAfterKill = !isBoss && !groupHasMoreMonsters && Boolean(context.isBossChallengeReady?.()) && Boolean(context.getAutoBossEnabled?.());
  const equipmentDropCount = finite(context.rollDrops?.({ boss: isBoss, monster }));
  const mutationEquipmentDropCount = monster.mutation
    ? finite(context.rollMutationExtraDrops?.(monster, stats, equipmentDropCount))
    : 0;
  if (monster.mutation) context.addLog?.('击败变异怪，获得额外奖励判定。');

  // 转生印记掉落
  const rebirthType = state.enemyGroup?.monsters?.[state.enemyGroup.activeIndex]?.rebirthType;
  if (rebirthType) {
    const rebirths = state.hero?.rebirths || 0;
    const dropChanceSquad = (typeof window !== 'undefined' ? window.REBIRTH_SEAL_DROP_CHANCE_SQUAD : undefined) ?? 0.35;
    const dropChanceBoss = (typeof window !== 'undefined' ? window.REBIRTH_SEAL_DROP_CHANCE_BOSS : undefined) ?? 1.0;
    const researchBonus = (state.rebirthResearch?.sealPerception?.unlocked) ? 0.25 : 0;
    let sealDrop = false;
    let sealQty = 0;
    if (rebirthType === 'rebirthBoss') {
      sealDrop = true;
      sealQty = 1 + Math.floor(rebirths / 3);
    } else if (rebirthType === 'rebirthSquad') {
      const finalChance = Math.min(1, dropChanceSquad * (1 + researchBonus));
      const rand = (typeof context.random === 'function' ? context.random() : Math.random());
      if (rand < finalChance) {
        sealDrop = true;
        sealQty = 1;
      }
    }
    if (sealDrop && sealQty > 0) {
      state.rebirthSeals = Math.max(0, Number(state.rebirthSeals) || 0) + sealQty;
      context.addLog?.(`获得 ⚡轮回印记 × ${sealQty}。`);
      context.recordRecentLoot?.(
        { materials: [{ materialId: 'rebirthSeal', name: '轮回印记', qty: sealQty, rarity: 'epic' }] },
        rebirthType === 'rebirthBoss' ? '轮回Boss' : '轮回小队'
      );
    }
  }

  context.grantPassiveSkillKillExp?.({ isBoss, isMutated: Boolean(monster.mutation) });
  context.updateQuestProgress?.({
    mapId: map.id,
    monsterId: monster.id,
    difficulty,
    isMutated: Boolean(monster.mutation),
    isBoss,
    count: 1,
  });
  context.gainMapExploration?.(
    map.id,
    context.explorationGainForKill?.({ isBoss, isMutated: Boolean(monster.mutation), difficulty }) || 0,
  );
  context.trackKillAchievements?.({ isBoss, isMutated: Boolean(monster.mutation), difficulty });

  var fragmentCount = 0;
  var isAbyssBoss = isBoss && difficulty === 'abyss';
  var isElite = Boolean(monster.mutation) || monster.type === 'elite';
  if (isAbyssBoss) {
    fragmentCount = 20 + Math.floor(Math.random() * 11);
  } else if (isBoss) {
    fragmentCount = 8 + Math.floor(Math.random() * 8);
  } else if (isElite) {
    fragmentCount = 3 + Math.floor(Math.random() * 3);
  } else {
    fragmentCount = 1 + Math.floor(Math.random() * 2);
  }
  if (fragmentCount > 0) {
    state.materials = state.materials || {};
    state.materials.skillFragment = (state.materials.skillFragment || 0) + fragmentCount;
  }

  if (!isBoss) {
    if (equipmentDropCount + mutationEquipmentDropCount > 0) {
      state.equipmentPityKills = 0;
    } else {
      state.equipmentPityKills = finite(state.equipmentPityKills) + 1;
      if (state.equipmentPityKills >= finite(context.getEquipmentPityThreshold?.())) {
        const pityDrops = finite(context.rollGuaranteedEquipmentDrop?.());
        if (pityDrops > 0) state.equipmentPityKills = 0;
      }
    }
  }

  const nextAction = shouldAutoBossAfterKill ? 'autoBoss' : groupHasMoreMonsters ? 'nextEncounter' : 'spawnNormal';
  if (nextAction === 'autoBoss') context.tryAutoChallengeBoss?.('settlement', stats);
  if (nextAction === 'nextEncounter') context.syncActiveEnemyFromGroup?.();
  if (nextAction === 'spawnNormal') context.spawnEnemy?.(false);
  context.render?.();
  return {
    goldGain,
    baseExpGain,
    jobExpGain,
    equipmentDropCount,
    mutationEquipmentDropCount,
    nextAction,
    ...bossResult,
  };
}
