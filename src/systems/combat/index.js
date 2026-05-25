export * from './combatState.js';
export * from './normalCombat.js';
export * from './bossCombat.js';
export * from './abyssCombat.js';
export * from './damage.js';
export * from './hit.js';
export * from './skills.js';
export * from './passives.js';
export * from './statusEffects.js';
export * from './combatLog.js';
export * from './autoBattle.js';
export * from './combatStats.js';
export * from './failureReason.js';
export * from './settlement.js';

import { configureCombatSettlementContext, grantBossEssence, settleBossVictory, settleDefeatedEnemy } from './settlement.js';

export function installCombatRuntime(context = {}) {
  configureCombatSettlementContext(context);
  const runtime = Object.freeze({
    grantBossEssence,
    settleBossVictory,
    settleDefeatedEnemy,
  });
  window.RuneFrontierCombatRuntime = runtime;
  return runtime;
}
