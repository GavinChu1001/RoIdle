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
    const isRebirthMode = state.rebirthMode && (state.hero?.rebirths || 0) > 0;
    // V3 霸体 + 圣者降临
    const v3PassivePre = (typeof window !== 'undefined' && window.RuneFrontierCombatRuntime?.getPassiveMechanismEffects)
      ? window.RuneFrontierCombatRuntime.getPassiveMechanismEffects(state, stats) : {};
    // 圣者降临：以 40% HP 复活
    if (v3PassivePre.reviveReady && finite(state.reviveCooldown) <= 0 && !state.reviveUsedThisLife) {
      state.hero.currentHp = Math.round(finite(stats.maxHp) * 0.4);
      state.reviveCooldown = 100;
      state.reviveUsedThisLife = true;
      if (v3PassivePre.reviveAwakening) {
        const bonusHeal = Math.round(finite(stats.maxHp) * finite(v3PassivePre.reviveAwakening.healPct));
        state.hero.currentHp = Math.min(finite(stats.maxHp), state.hero.currentHp + bonusHeal);
        state.shieldHp = finite(state.shieldHp) + Math.round(finite(stats.maxHp) * finite(v3PassivePre.reviveAwakening.shieldPct));
        context.addLog?.('圣者降临觉醒：群体治愈与护盾触发。');
      }
      context.addLog?.('圣者降临：复活！');
      return true;
    }
    if (v3PassivePre.deathDefyReady && finite(state.deathDefyCooldown) <= 0) {
      state.hero.currentHp = 1;
      state.deathDefyCooldown = 35;
      // 龙族血统：霸体触发后 3s 无敌，并记录下次技能暴击强化。
      if (v3PassivePre.enhanceDeathDefy) {
        state.invincibleTimer = finite(state.invincibleTimer) + 3;
        state.guaranteedCritNext = { multiplier: 1.5, skillOnly: true };
      }
      context.addLog?.('⚡霸体触发：承受致命伤害，锁定 1 点生命。');
      return true;
    }
    if (!isRebirthMode) {
      state.paused = true;
      return false;
    }
  }
  // V3 被动机制效果
  const v3Passive = (typeof window !== 'undefined' && window.RuneFrontierCombatRuntime?.getPassiveMechanismEffects)
    ? window.RuneFrontierCombatRuntime.getPassiveMechanismEffects(state, stats) : {};
  const v3Buffs = (typeof window !== 'undefined' && window.RuneFrontierCombatRuntime?.getSkillBuffMultipliers)
    ? window.RuneFrontierCombatRuntime.getSkillBuffMultipliers(state) : {};
    state.angelGuardCooldown = Math.max(0, finite(state.angelGuardCooldown) - finite(dt));
    state.angelGuardActiveTimer = Math.max(0, finite(state.angelGuardActiveTimer) - finite(dt));
    const angelGuardHpRatio = finite(state.hero?.currentHp) / Math.max(1, finite(stats.maxHp));
    if (v3Passive.angelGuard && angelGuardHpRatio <= v3Passive.angelGuard.hpPct && state.angelGuardCooldown <= 0) {
      state.angelGuardActiveTimer = v3Passive.angelGuard.duration;
      state.angelGuardCooldown = v3Passive.angelGuard.cooldown;
      v3Passive.damageReductionPct = finite(v3Passive.damageReductionPct) + finite(v3Passive.angelGuard.damageReductionPct);
      if (v3Passive.enhanceAngelGuard) {
        state.shieldHp = finite(state.shieldHp) + Math.round(finite(stats.maxHp) * finite(v3Passive.enhanceAngelGuard.shieldPct || 0.10));
        context.addLog?.('信仰守护：护盾触发。');
      } else {
        context.addLog?.('天使之护：减伤触发。');
      }
    }
  state.playerAttackTimer = finite(state.playerAttackTimer) + finite(dt);
  const attackInterval = clampNumber(1 / Math.max(0.01, finite(stats.attackSpeed) * (1 + (v3Buffs.aspdPct || 0))), 0.6, 4.5);
  const attacks = Math.min(3, Math.floor(state.playerAttackTimer / attackInterval));
  // 无敌计时
  state.invincibleTimer = Math.max(0, finite(state.invincibleTimer) - dt);
  if (attacks > 0) {
    state.playerAttackTimer -= attacks * attackInterval;
    const critChance = Math.min(finite(context.getPlayerCritRateCap?.() || 1), finite(stats.crit));
    for (let hit = 0; hit < attacks && state.enemyHp > 0; hit += 1) {
      // 隐匿在 V4 中强化下一次主动技能，不由普通攻击消费。
      const isCrit = context.random?.() < critChance;
      const targetBonus = getTargetDamageBonus(stats, {}, context);
      const monsterGuard = Math.min(0.65, finite(context.currentMonsterStats?.().damageReduction));
      let critDamageMult = isCrit ? (finite(stats.critDamage) || 1.85) : 1;
      if (isCrit && v3Passive.critDamageBonus) critDamageMult += v3Passive.critDamageBonus;
      const { finalDamage } = calculatePlayerBasicHit({ stats, attackInterval, targetBonus, monsterGuard, isCrit });
      let dmg = finalDamage;
      if (isCrit && v3Passive.critDamageBonus && critDamageMult > 1) {
        dmg = Math.round(finalDamage * (1 + v3Passive.critDamageBonus / critDamageMult));
      }
      // V3 被动：伤害加成 + 忽视防御
      let adjustedDamage = dmg;
      if (v3Buffs.atkPct) adjustedDamage = Math.round(adjustedDamage * (1 + v3Buffs.atkPct));
      if (v3Passive.damagePct) adjustedDamage = Math.round(adjustedDamage * (1 + v3Passive.damagePct));
      if (v3Passive.ignoreDefRatio && context.currentMonsterStats) {
        const monsterDef = finite(context.currentMonsterStats().defense);
        const defIgnore = Math.round(monsterDef * v3Passive.ignoreDefRatio);
        const penetrationDmg = Math.round(defIgnore * 1.2);
        adjustedDamage += penetrationDmg;
      }
      if (v3Passive.markedVulnerablePct && Object.values(state.enemyMarks || {}).some((v) => finite(v) > 0)) {
        adjustedDamage = Math.round(adjustedDamage * (1 + v3Passive.markedVulnerablePct));
      }
      state.enemyHp -= adjustedDamage;
      context.showDamageNumber?.('monster', adjustedDamage, isCrit ? 'crit' : 'player');
      context.showHitFeedback?.(isCrit ? 'crit' : 'normal');
      context.applySplashDamageToEncounter?.(adjustedDamage, stats);
      if (stats.fireBurstChance && context.random?.() < stats.fireBurstChance && state.enemyHp > 0) {
        const burstDamage = normalizeDamage(finite(stats.physicalAttack) * finite(stats.fireBurstAtkPct || 0.8) * (1 + targetBonus) * (1 - monsterGuard));
        state.enemyHp -= burstDamage;
        context.showDamageNumber?.('monster', burstDamage, 'skill', { skillName: '火焰爆发' });
        context.showSkillCastFeedback?.('火焰爆发');
      }
      if (finite(state.currentMap) < 4 || stats.lifeSteal) {
        const stealRate = (finite(state.currentMap) < 4 ? 0.2 : 0) + Math.min(0.25, finite(stats.lifeSteal));
        const steal = Math.round(adjustedDamage * stealRate * (1 - Math.min(0.75, finite(context.currentMonsterStats?.().antiLifeSteal))));
        if (steal > 0) state.hero.currentHp = Math.min(finite(stats.maxHp), finite(state.hero?.currentHp) + steal);
      }
    }
  }
  // 技能释放：V3 优先，兜底 V2
  const jobId = context.currentJob?.()?.id || (typeof window !== 'undefined' ? window.currentJob?.()?.id : undefined);
  if (jobId && typeof window !== 'undefined' && (context.getV3CombatSkills?.(jobId)?.length || window.v3JobSkills?.[jobId])) {
    // V3 冷却制技能系统
    if (window.RuneFrontierCombatRuntime?.tickSkillSystem) {
      window.RuneFrontierCombatRuntime.tickSkillSystem(dt, stats, context);
    }
  } else {
    // 无 V3 数据的职业（如初学者）使用旧系统
    resolveActiveSkillCast({ dt, stats }, context);
  }
  if (state.enemyHp > 0) updateMonsterAttack(dt, stats, context, v3Passive);
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

export function updateMonsterAttack(dt, stats = {}, context = runtimeContext, v3Passive = {}) {
  const state = stateFrom(context);
  state.enemyAttackTimer = finite(state.enemyAttackTimer) + finite(dt);
  const interval = Math.max(
    0.72,
    (finite(context.getMonsterAttackInterval?.()) - finite(state.currentMap) * 0.06 - (state.enemyBoss ? 0.18 : 0)) *
      (1 + finite(stats.setBonuses?.monsterAttackSpeedReductionPct)) *
      (finite(state.enemyMarks?.freeze) > 0 ? 1.43 : 1) // 冰冻：攻速 -30% ≈ 间隔 +43%
  );
  if (state.enemyAttackTimer < interval) return false;
  state.enemyAttackTimer = 0;
  const monster = context.currentMonsterStats?.() || {};
  if (finite(state.invincibleTimer) > 0) {
    context.showDamageNumber?.('hero', 0, 'miss');
    return true;
  }
  // V3 标记：禁锢防止闪避
  const isSnared = finite(state.enemyMarks?.snare) > 0;
  if (finite(state.enemyMarks?.freeze) > 0 && context.random?.() < 0.10) {
    context.showDamageNumber?.('hero', 0, 'miss');
    return true;
  }
  if (!isSnared && context.random?.() < finite(stats.dodgeRate)) {
    context.showDamageNumber?.('hero', 0, 'miss');
    return true;
  }
  const effectiveCritChance = isSnared ? 0 : finite(monster.critChance) * (1 - Math.min(0.75, finite(stats.statusResist) * 0.5));
  const isCrit = context.random?.() < effectiveCritChance;
  const hpRatio = finite(state.hero?.currentHp || stats.maxHp) / Math.max(1, finite(stats.maxHp));
  const livingCount = Math.max(1, (state.enemyGroup?.monsters || []).filter((entry) => entry.alive).length || 1);
  const { damage } = calculateMonsterHit({ stats, monster, hpRatio, livingCount, isCrit });
  let finalDamage = damage;
  // V3 被动：减伤
  if (v3Passive.damageReductionPct) finalDamage = Math.round(finalDamage * (1 - v3Passive.damageReductionPct));
  // V3 护盾/减伤
  if (typeof window !== 'undefined' && window.RuneFrontierCombatRuntime?.applyShieldReduction) {
    finalDamage = window.RuneFrontierCombatRuntime.applyShieldReduction(finalDamage, state);
  }
  state.hero.currentHp = Math.max(0, finite(state.hero?.currentHp || stats.maxHp) - finalDamage);
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
    // V3 霸体
    if (v3Passive.deathDefyReady && finite(state.deathDefyCooldown) <= 0) {
      state.hero.currentHp = 1;
      state.deathDefyCooldown = 35;
      if (v3Passive.enhanceDeathDefy) {
        state.invincibleTimer = finite(state.invincibleTimer) + 3;
        state.guaranteedCritNext = { multiplier: 1.5, skillOnly: true };
      }
      context.addLog?.('⚡霸体触发：承受致命伤害，锁定 1 点生命。');
      return true;
    }
    const isRebirthMode = state.rebirthMode && (state.hero?.rebirths || 0) > 0;
    if (isRebirthMode) {
      const sealLoss = state.rebirthSeals > 0 ? 1 : 0;
      if (sealLoss > 0) {
        state.rebirthSeals = Math.max(0, (state.rebirthSeals || 0) - 1);
        context.addLog?.('⚡轮回模式下角色生命值归零，损失 1 个轮回印记。');
      } else {
        context.addLog?.('⚡轮回模式下角色生命值归零，战斗继续。');
      }
      state.hero.currentHp = Math.max(1, Math.round(stats.maxHp * 0.15));
      state.paused = false;
      context.spawnEnemy?.(false);
    } else {
      state.paused = true;
      if (state.enemyBoss && context.getAutoBossEnabled?.()) context.handleAutoBossFailure?.();
      context.addLog?.(`${context.getDifficultyFailureHint?.(monster) || ''}角色生命值归零，战斗停止。`);
    }
  }
  return true;
}
