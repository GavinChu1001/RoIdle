import { calculateMonsterHit, calculatePlayerBasicHit, getTargetDamageBonus, normalizeDamage } from './damage.js';
import { resolveActiveSkillCast } from './skills.js';

let runtimeContext = {};

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function stateFrom(context = runtimeContext) {
  return context.getState?.() || {};
}

function clampNumber(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, Number(value) || 0));
}

export function configureNormalCombatContext(context = {}) {
  runtimeContext = context || {};
}

export function updateCombat(dt, context = runtimeContext) {
  const state = stateFrom(context);
  if (finite(state.enemyHp) <= 0 || finite(state.enemyMaxHp) <= 0) context.spawnEnemy?.(false);

  const stats = context.computeStats?.() || {};
  context.tryAutoChallengeBoss?.('tick', stats);
  if (finite(state.hero?.currentHp) <= 0) {
    state.paused = true;
    return false;
  }
  state.playerAttackTimer = finite(state.playerAttackTimer) + finite(dt);
  const attackInterval = clampNumber(1 / Math.max(0.01, finite(stats.attackSpeed)), 0.6, 4.5);
  const attacks = Math.min(3, Math.floor(state.playerAttackTimer / attackInterval));
  if (attacks > 0) {
    state.playerAttackTimer -= attacks * attackInterval;
    const critChance = Math.min(finite(context.getPlayerCritRateCap?.() || 1), finite(stats.crit));
    for (let hit = 0; hit < attacks && state.enemyHp > 0; hit += 1) {
      const targetBonus = getTargetDamageBonus(stats, {}, context);
      const monsterGuard = Math.min(0.65, finite(context.currentMonsterStats?.().damageReduction));
      const isCrit = context.random?.() < critChance;
      const { finalDamage } = calculatePlayerBasicHit({ stats, attackInterval, targetBonus, monsterGuard, isCrit });
      state.enemyHp -= finalDamage;
      context.showDamageNumber?.('monster', finalDamage, isCrit ? 'crit' : 'player');
      context.showHitFeedback?.(isCrit ? 'crit' : 'normal');
      context.applySplashDamageToEncounter?.(finalDamage, stats);
      if (stats.fireBurstChance && context.random?.() < stats.fireBurstChance && state.enemyHp > 0) {
        const burstDamage = normalizeDamage(finite(stats.physicalAttack) * finite(stats.fireBurstAtkPct || 0.8) * (1 + targetBonus) * (1 - monsterGuard));
        state.enemyHp -= burstDamage;
        context.showDamageNumber?.('monster', burstDamage, 'skill', { skillName: '火焰爆发' });
        context.showSkillCastFeedback?.('火焰爆发');
      }
      if (finite(state.currentMap) < 4 || stats.lifeSteal) {
        const stealRate = (finite(state.currentMap) < 4 ? 0.2 : 0) + Math.min(0.25, finite(stats.lifeSteal));
        const steal = Math.round(finalDamage * stealRate * (1 - Math.min(0.75, finite(context.currentMonsterStats?.().antiLifeSteal))));
        if (steal > 0) state.hero.currentHp = Math.min(finite(stats.maxHp), finite(state.hero?.currentHp) + steal);
      }
    }
  }
  resolveActiveSkillCast({ dt, stats }, context);
  if (state.enemyHp > 0) updateMonsterAttack(dt, stats, context);
  if (state.enemyHp <= 0) context.defeatEnemy?.();
  return true;
}

export function updateRecovery(dt, context = runtimeContext) {
  const state = stateFrom(context);
  const stats = context.computeStats?.() || {};
  if (finite(state.hero?.currentHp) >= finite(stats.maxHp)) return false;
  state.regenTimer = finite(state.regenTimer) + finite(dt);
  if (state.regenTimer < finite(context.getHpRegenInterval?.())) return false;
  state.regenTimer = 0;
  const before = finite(state.hero?.currentHp);
  state.hero.currentHp = Math.min(finite(stats.maxHp), before + finite(stats.hpRegen));
  const healed = Math.round(state.hero.currentHp - before);
  if (healed > 0) {
    context.showDamageNumber?.('hero', healed, 'heal');
    if (context.random?.() < 0.35 || before <= 0) context.addLog?.(`你恢复了 ${context.formatNumber?.(healed) || healed} 点生命值。`);
  }
  return healed > 0;
}

export function updateMonsterAttack(dt, stats = {}, context = runtimeContext) {
  const state = stateFrom(context);
  state.enemyAttackTimer = finite(state.enemyAttackTimer) + finite(dt);
  const interval = Math.max(
    0.72,
    (finite(context.getMonsterAttackInterval?.()) - finite(state.currentMap) * 0.06 - (state.enemyBoss ? 0.18 : 0)) *
      (1 + finite(stats.setBonuses?.monsterAttackSpeedReductionPct)),
  );
  if (state.enemyAttackTimer < interval) return false;
  state.enemyAttackTimer = 0;
  const monster = context.currentMonsterStats?.() || {};
  if (context.random?.() < finite(stats.dodgeRate)) {
    context.showDamageNumber?.('hero', 0, 'miss');
    return true;
  }
  const effectiveCritChance = finite(monster.critChance) * (1 - Math.min(0.75, finite(stats.statusResist) * 0.5));
  const isCrit = context.random?.() < effectiveCritChance;
  const hpRatio = finite(state.hero?.currentHp || stats.maxHp) / Math.max(1, finite(stats.maxHp));
  const livingCount = Math.max(1, (state.enemyGroup?.monsters || []).filter((entry) => entry.alive).length || 1);
  const { damage } = calculateMonsterHit({ stats, monster, hpRatio, livingCount, isCrit });
  state.hero.currentHp = Math.max(0, finite(state.hero?.currentHp || stats.maxHp) - damage);
  context.showDamageNumber?.('hero', damage, isCrit ? 'crit' : 'monster');
  context.flashPlayerHp?.();
  if (state.enemyHp > 0 && finite(stats.thornVitMultiplier) > 0) {
    const thornDamage = normalizeDamage(finite(stats.attrs?.vit) * finite(stats.thornVitMultiplier));
    state.enemyHp -= thornDamage;
    context.showDamageNumber?.('monster', thornDamage, 'player');
  }
  if (state.enemyHp > 0 && stats.meteorCounterChance && context.random?.() < stats.meteorCounterChance) {
    const meteorDamage = normalizeDamage(finite(stats.magicAttack || stats.matkPower) * finite(stats.meteorCounterMatkPct || 1));
    state.enemyHp -= meteorDamage;
    context.showDamageNumber?.('monster', meteorDamage, 'skill', { skillName: '陨石反击' });
    context.showSkillCastFeedback?.('陨石反击');
  }
  if (state.hero.currentHp <= 0) {
    state.paused = true;
    if (state.enemyBoss && context.getAutoBossEnabled?.()) context.handleAutoBossFailure?.();
    context.addLog?.(`${context.getDifficultyFailureHint?.(monster) || ''}角色生命值归零，战斗停止。`);
  }
  return true;
}
