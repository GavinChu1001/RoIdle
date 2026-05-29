let runtimeContext = {};

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function stateFrom(context = runtimeContext) {
  return context.getState?.() || {};
}

export function configureDamageContext(context = {}) {
  runtimeContext = context || {};
}

export function normalizeDamage(value, options = {}) {
  const normalized = Object.is(value, -0) ? 0 : Number(value);
  const allowZero = typeof options === 'boolean' ? options : Boolean(options.allowZero);
  if (!Number.isFinite(normalized)) return allowZero ? 0 : 1;
  if (allowZero) return Math.max(0, Math.floor(normalized));
  return Math.max(1, Math.floor(normalized));
}

export function sanitizeDamage(value, allowZero = false) {
  return normalizeDamage(value, { allowZero });
}

export function getTargetDamageBonus(stats = {}, monsterContext = {}, context = runtimeContext) {
  const state = stateFrom(context);
  const monster = monsterContext.monster || context.currentMonsterStats?.() || {};
  const isBoss = monsterContext.isBoss ?? Boolean(state.enemyBoss || monster.type === 'boss');
  const difficulty = monsterContext.difficulty || state.currentDifficulty || 'normal';
  const damageType = monsterContext.damageType || monsterContext.sourceType || '';
  const enemyHp = monsterContext.enemyHp ?? state.enemyHp;
  const enemyMaxHp = monsterContext.enemyMaxHp ?? state.enemyMaxHp;
  let bonus = finite(stats.monsterDamageBonus);
  const levelGap = Math.max(0, finite(monster.level || 1) - finite(state.hero?.baseLevel || 1));
  if (levelGap > 0) bonus += Math.min(finite(stats.higherLevelDamageBonus), levelGap * 0.01) + Math.min(0.12, finite(stats.hitRate) * 0.25);
  if (isBoss) bonus += finite(stats.bossDamageBonus);
  if (difficulty === 'abyss' && isBoss) bonus += finite(stats.abyssBossDamageBonus);
  if (monster.mutation) bonus += finite(stats.mutationDamageBonus);
  if (monster.type === 'elite' || monster.mutation || isBoss) {
    bonus += finite(stats.eliteDamageBonus) + (difficulty === 'abyss' ? finite(stats.abyssEliteDamageBonus) : 0);
  }
  if (difficulty === 'abyss') {
    bonus += finite(stats.abyssDamageBonus);
    if (finite(enemyHp) / Math.max(1, finite(enemyMaxHp || 1)) <= 0.2) bonus += finite(stats.abyssExecuteDamageBonus);
  }
  bonus += finite(stats.finalDamageBonus);
  if (damageType === 'physical' || damageType === 'basic' || damageType === 'normal') {
    bonus += finite(stats.physicalFinalDamageBonus);
  }
  if (damageType === 'magic') {
    bonus += finite(stats.magicFinalDamageBonus);
  }
  bonus += Math.min(0.5, finite(stats.ignoreDefensePct));
  return Math.min(3, bonus);
}

export function calculatePlayerBasicHit({ stats = {}, attackInterval = 0, targetBonus = 0, monsterGuard = 0, isCrit = false } = {}) {
  const rawHitDamage = Math.max(
    0,
    finite(stats.dps) * finite(attackInterval) * (1 + finite(targetBonus) + finite(stats.normalAttackBonus)) * (1 - finite(monsterGuard)),
  );
  const finalDamage = normalizeDamage(isCrit ? rawHitDamage * (1.85 + finite(stats.critDamageBonus)) : rawHitDamage);
  return { rawHitDamage, finalDamage, isCrit };
}

export function calculateMonsterHit({ stats = {}, monster = {}, hpRatio = 1, livingCount = 1, isCrit = false, isBlocked = false } = {}) {
  const state = stateFrom(runtimeContext);
  const defenseK = 80 + finite(state.hero?.baseLevel) * 4;
  const piercedDefense = Math.max(0, finite(stats.defense) * (1 - Math.min(0.75, finite(monster.armorPierce))));
  const abyssReduction = state.currentDifficulty === 'abyss' ? Math.min(0.6, finite(stats.abyssDamageReduction)) : 0;
  const specialReduction = Math.min(
    0.45,
    Math.max(finite(stats.magicDamageReduction), finite(stats.skillDamageReduction)) * (state.enemyBoss || monster.type === 'elite' ? 1 : 0.35),
  );
  const damageReductionPct = Math.min(
    0.75,
    Math.max(0, finite(stats.damageReductionPct || stats.setBonuses?.damageReductionPct) + abyssReduction + specialReduction - finite(monster.abyssSuppression)),
  );
  const executeBonus = hpRatio <= 0.35 ? finite(monster.executeDamage) : 0;
  const critMultiplier = isCrit ? 1 + finite(monster.critDamage) : 1;
  const encounterAssist = state.enemyBoss ? 1 : Math.min(1.75, 1 + (Math.max(1, finite(livingCount)) - 1) * 0.18);
  const blockReduction = isBlocked ? Math.min(0.55, 0.35 + finite(stats.attrs?.str) * 0.0004) : 0;
  const damage = normalizeDamage(
    (finite(monster.attack) * defenseK) / (defenseK + piercedDefense) *
      (1 - damageReductionPct) *
      (1 - blockReduction) *
      critMultiplier *
      (1 + executeBonus) *
      encounterAssist,
  );
  return { damage, damageReductionPct, executeBonus, encounterAssist, isCrit, isBlocked, blockReduction };
}

export { calculatePower } from '../equipment/itemScore.js';
