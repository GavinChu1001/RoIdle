let runtimeContext = {};

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function stateFrom(context = runtimeContext) {
  return context.getState?.() || {};
}

function now(context = runtimeContext) {
  return context.now?.() ?? Date.now();
}

export function configureBossCombatContext(context = {}) {
  runtimeContext = context || {};
}

export function isBossChallengeReady(context = runtimeContext) {
  const requirement = finite(context.bossRequirement?.());
  if (requirement <= 0) return false;
  return finite(stateFrom(context).areaKills) >= requirement;
}

export function isCurrentlyFightingBoss(context = runtimeContext) {
  return Boolean(stateFrom(context).enemyBoss);
}

export function canHeroFight(stats = runtimeContext.computeStats?.() || {}, context = runtimeContext) {
  const state = stateFrom(context);
  const hp = finite(state.hero?.currentHp);
  return hp > 0 && hp / Math.max(1, finite(stats.maxHp)) >= 0.3;
}

export function isAutoBossInCooldown(context = runtimeContext) {
  const settings = context.ensureSettings?.() || stateFrom(context).settings || {};
  return now(context) < finite(settings.autoBossCooldownUntil);
}

export function challengeBoss({ auto = false } = {}, context = runtimeContext) {
  const state = stateFrom(context);
  const stats = context.computeStats?.() || {};
  if (isCurrentlyFightingBoss(context)) return false;
  if (!isBossChallengeReady(context)) {
    if (!auto) context.showToast?.(`还需要清理 ${finite(context.bossRequirement?.()) - finite(state.areaKills)} 只魔物`);
    return false;
  }
  if (!canHeroFight(stats, context)) {
    if (!auto) context.showToast?.('生命值不足，无法挑战 BOSS');
    return false;
  }
  if (auto && isAutoBossInCooldown(context)) return false;
  context.spawnEnemy?.(true);
  const name = context.bossDisplayName?.(context.currentMap?.()) || 'BOSS';
  context.addLog?.(auto ? `自动挑战 BOSS：${name}` : `${name} 出现在道路尽头。`);
  context.render?.();
  return true;
}

export function tryAutoChallengeBoss(reason = 'tick', stats = runtimeContext.computeStats?.() || {}, context = runtimeContext) {
  const state = stateFrom(context);
  if (!context.getAutoBossEnabled?.()) return false;
  if (!isBossChallengeReady(context)) return false;
  if (isCurrentlyFightingBoss(context)) return false;
  if (state.paused) return false;
  if (!canHeroFight(stats, context)) return false;
  if (isAutoBossInCooldown(context)) return false;
  return challengeBoss({ auto: true }, context);
}

export function getAutoBossStatusText(stats = runtimeContext.computeStats?.() || {}, context = runtimeContext) {
  const state = stateFrom(context);
  if (!context.getAutoBossEnabled?.()) return '已关闭';
  if (state.paused) return '战斗暂停中';
  if (isCurrentlyFightingBoss(context)) return '正在挑战';
  const settings = context.ensureSettings?.() || state.settings || {};
  const cooldownLeft = Math.max(0, Math.ceil((finite(settings.autoBossCooldownUntil) - now(context)) / 1000));
  if (cooldownLeft > 0) return `冷却中 ${cooldownLeft}秒`;
  if (!canHeroFight(stats, context)) return '生命不足';
  if (isBossChallengeReady(context)) return '可挑战';
  return '等待进度';
}

export function handleAutoBossFailure(context = runtimeContext) {
  if (!isCurrentlyFightingBoss(context) || !context.getAutoBossEnabled?.()) return false;
  const settings = context.ensureSettings?.() || {};
  settings.autoBossCooldownUntil = now(context) + finite(context.getAutoBossFailCooldownMs?.());
  context.addLog?.('自动挑战 BOSS 失败，进入冷却。');
  return true;
}
