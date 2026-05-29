import { getTargetDamageBonus, normalizeDamage } from './damage.js';

let runtimeContext = {};

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function stateFrom(context = runtimeContext) {
  return context.getState?.() || {};
}

export function configureSkillsContext(context = {}) {
  runtimeContext = context || {};
}

export function skillAttributeMultiplier(active = {}, stats = {}) {
  return Object.entries(active.attributeScaling || {}).reduce((sum, [stat, scale]) => {
    const value = Math.max(0, finite(stats.attrs?.[stat]));
    return sum + Math.sqrt(value) * finite(scale) * 2.5;
  }, 1);
}

export function resolveActiveSkillCast({ dt = 0, stats = {} } = {}, context = runtimeContext) {
  const state = stateFrom(context);
  const activeSkills = (context.getUnlockedSkills?.() || []).filter((entry) => entry.active);
  for (const entry of activeSkills) {
    const spec = context.getSkillGrowthEntry?.(entry)?.specialization;
    const ms = context.getSkillMilestoneBonuses?.(entry) || {};
    const abyssChance = state.currentDifficulty === 'abyss' ? finite(stats.setBonuses?.abyssSkillChanceBonus) : 0;
    const chance =
      finite(entry.active.chance) *
      finite(dt) *
      (1 + Math.min(0.35, finite(stats.luck) * 0.002) + abyssChance + finite(ms.skillChanceBonus)) *
      (spec === 'frequency' ? 1.2 : 1) *
      (1 - Math.min(0.35, finite(stats.skillCooldownPenalty)));
    if (context.random?.() >= chance) continue;

    const monster = context.currentMonsterStats?.() || {};
    const source = entry.active.stat === 'matk' ? finite(stats.matkPower) : finite(stats.atkPower);
    const jobPower = 1 + finite(state.hero?.jobLevel) * 0.018 + Math.floor(finite(state.hero?.jobLevel) / 10) * 0.06;
    const monsterGuard = Math.min(0.65, finite(monster.damageReduction));
    const isBoss = Boolean(state.enemyBoss);
    const damageType = entry.active.stat === 'matk' ? 'magic' : 'physical';
    const targetBonus = getTargetDamageBonus(stats, { monster, isBoss, difficulty: state.currentDifficulty, damageType }, context);
    const damage = normalizeDamage(
      source *
        finite(entry.active.multiplier) *
        finite(context.getSkillLevelMultiplier?.(entry)) *
        jobPower *
        skillAttributeMultiplier(entry.active, stats) *
        (1 + finite(stats.crit) * 0.35) *
        (1 +
          targetBonus +
          finite(stats.skillDamageBonus) +
          finite(ms.skillDamageBonus) +
          (isBoss ? finite(ms.bossDamageBonus) : 0) +
          (monster.type === 'elite' || monster.mutation || isBoss ? finite(ms.eliteDamageBonus) : 0) +
          (state.currentDifficulty === 'abyss' ? finite(ms.abyssDamageBonus) + finite(ms.abyssExecuteDamageBonus) : 0) +
          finite(ms.monsterDamageBonus) +
          finite(ms.finalDamageBonus) +
          (spec === 'boss_damage' && isBoss ? 0.25 : 0) +
          (spec === 'pierce' ? 0.1 : 0)) *
        (1 - monsterGuard),
    );
    state.enemyHp -= damage;
    context.showDamageNumber?.('monster', damage, 'skill', { skillName: entry.name });
    context.showHitFeedback?.('skill');
    context.showSkillCastFeedback?.(entry);
    if (finite(state.currentMap) < 4 || finite(stats.skillHitHealPct)) {
      const steal = Math.round(damage * (finite(state.currentMap) < 4 ? 0.2 : 0) + damage * finite(stats.skillHitHealPct));
      if (steal > 0) state.hero.currentHp = Math.min(finite(stats.maxHp), finite(state.hero?.currentHp) + steal);
    }
    context.noteSkillCast?.(entry.name, damage);
    context.gainSkillExp?.(entry, isBoss ? 2 : 1, '战斗施放');
    if (state.enemyHp <= 0) context.gainSkillExp?.(entry, isBoss ? 1 : 0.5, '技能终结');
    const echoChance = Math.min(0.25, finite(stats.echoChance) + finite(ms.echoChance));
    if (echoChance && context.random?.() < echoChance && state.enemyHp > 0) {
      const echoDamage = normalizeDamage(damage * 0.7);
      state.enemyHp -= echoDamage;
      context.showDamageNumber?.('monster', echoDamage, 'skill', { skillName: '回响' });
      context.showHitFeedback?.('skill');
      context.showSkillCastFeedback?.({ name: '回响' });
      if (finite(state.currentMap) < 4 || finite(stats.skillHitHealPct)) {
        const steal = Math.round(echoDamage * (finite(state.currentMap) < 4 ? 0.2 : 0) + echoDamage * finite(stats.skillHitHealPct));
        if (steal > 0) state.hero.currentHp = Math.min(finite(stats.maxHp), finite(state.hero?.currentHp) + steal);
      }
      context.noteSkillCast?.('回响', echoDamage);
    }
    return { cast: true, skill: entry, damage };
  }
  return { cast: false };
}

export function rollActiveSkill(dt, stats, context = runtimeContext) {
  return resolveActiveSkillCast({ dt, stats }, context);
}
