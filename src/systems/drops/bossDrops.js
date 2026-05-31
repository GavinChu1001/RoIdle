let runtimeContext = {};

export function configureBossDropsContext(context = {}) {
  runtimeContext = context || {};
}

export function rollZodiacSetDrops(monster, stats = {}, options = {}, context = runtimeContext) {
  return 0;
}

// Boss victory essence remains attached to combat settlement until that chain migrates.
export function grantBossEssence(mapIndex) {
  if (typeof window.grantBossEssence === 'function') return window.grantBossEssence(mapIndex);
}

export function getDarkGoldUpgradeRate(opts) {
  if (typeof window.getDarkGoldUpgradeRate === 'function') return window.getDarkGoldUpgradeRate(opts);
  return 0;
}
