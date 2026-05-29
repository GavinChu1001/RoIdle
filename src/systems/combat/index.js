export * from './combatState.js';
export * from './normalCombat.js';
export * from './bossCombat.js';
export * from './abyssCombat.js';
export * from './damage.js';
export * from './hit.js';
export * from './skills.js';
export * from './skillMechanics.js';
export * from './passives.js';
export * from './statusEffects.js';
export * from './combatLog.js';
export * from './autoBattle.js';
export * from './combatStats.js';
export * from './failureReason.js';
export * from './settlement.js';
export * from './monster.js';
export * from './encounter.js';

import { configureCombatSettlementContext, grantBossEssence, settleBossVictory, settleDefeatedEnemy } from './settlement.js';
import {
  calculateMonsterHit,
  calculatePlayerBasicHit,
  configureDamageContext,
  getTargetDamageBonus,
  normalizeDamage,
  sanitizeDamage,
} from './damage.js';
import { configureNormalCombatContext, updateCombat, updateMonsterAttack, updateRecovery } from './normalCombat.js';
import { configureSkillsContext, resolveActiveSkillCast, rollActiveSkill, skillAttributeMultiplier } from './skills.js';
import { configureSkillMechanicsContext, tickSkillSystem, getPassiveMechanismEffects, getSkillBuffMultipliers, applyShieldReduction, resetEnemySkillStatuses, getEnemyStatusDisplayState } from './skillMechanics.js';
import {
  canHeroFight,
  challengeBoss,
  configureBossCombatContext,
  getAutoBossStatusText,
  handleAutoBossFailure,
  isAutoBossInCooldown,
  isBossChallengeReady,
  isCurrentlyFightingBoss,
  tryAutoChallengeBoss,
} from './bossCombat.js';
import { configureMonsterContext, buildMonsterStats, pickMonsterTemplate, rollMonsterLevel, rollMonsterMutation, getMonsterTemplate, getMapLevelRange, getMutationById, bossDisplayName, currentDifficultyConfig, getMonsterDifficultyType } from './monster.js';
import { applySkillSplashDamageToEncounter, applySplashDamageToEncounter, configureEncounterContext, spawnEnemy, createEnemyGroup, createEncounterMonster, getEncounterSize, getEncounterLabel, currentMonsterStats, normalizeEnemyGroup, syncActiveEnemyFromGroup, updateActiveEnemyHpInGroup, hasLivingEncounterMembers } from './encounter.js';
import { configureFailureReasonContext, getDifficultyFailureHint } from './failureReason.js';

export function installCombatRuntime(context = {}) {
  configureCombatSettlementContext(context);
  configureBossCombatContext(context);
  configureDamageContext(context);
  configureSkillsContext(context);
  configureNormalCombatContext(context);
  configureMonsterContext(context);
  configureEncounterContext(context);
  configureSkillMechanicsContext({ ...context, getTargetDamageBonus });
  configureFailureReasonContext(context);
  const runtime = Object.freeze({
    grantBossEssence,
    settleBossVictory,
    settleDefeatedEnemy,
    isBossChallengeReady,
    isCurrentlyFightingBoss,
    canHeroFight,
    isAutoBossInCooldown,
    challengeBoss,
    tryAutoChallengeBoss,
    getAutoBossStatusText,
    handleAutoBossFailure,
    normalizeDamage,
    sanitizeDamage,
    getTargetDamageBonus,
    calculatePlayerBasicHit,
    calculateMonsterHit,
    skillAttributeMultiplier,
    resolveActiveSkillCast,
    rollActiveSkill,
    updateCombat,
    updateMonsterAttack,
    updateRecovery,
    spawnEnemy,
    createEnemyGroup,
    createEncounterMonster,
    getEncounterSize,
    getEncounterLabel,
    buildMonsterStats,
    pickMonsterTemplate,
    rollMonsterLevel,
    rollMonsterMutation,
    getMonsterTemplate,
    getMapLevelRange,
    getMutationById,
    bossDisplayName,
    currentDifficultyConfig,
    getMonsterDifficultyType,
    currentMonsterStats,
    tickSkillSystem,
    getPassiveMechanismEffects,
    getSkillBuffMultipliers,
    applyShieldReduction,
    resetEnemySkillStatuses,
    getEnemyStatusDisplayState,
    normalizeEnemyGroup,
    syncActiveEnemyFromGroup,
    updateActiveEnemyHpInGroup,
    hasLivingEncounterMembers,
    applySplashDamageToEncounter,
    applySkillSplashDamageToEncounter,
    getDifficultyFailureHint,
  });
  window.RuneFrontierCombatRuntime = runtime;
  return runtime;
}
