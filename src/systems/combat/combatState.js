export function computeStats() {
  if (typeof window.computeStats === 'function') return window.computeStats();
  return { dps: 0, hp: 1, maxHp: 1, defense: 0, atk: 0, matk: 0, power: 0, goldMultiplier: 1, baseExpMultiplier: 1 };
}
export function calculateBattleStats(params) {
  if (typeof window.calculateBattleStats === 'function') return window.calculateBattleStats(params);
  return { physicalAttack: 0, magicAttack: 0, maxHp: 1, defense: 0, hpRegen: 0, attackSpeed: 0, dodgeRate: 0, critRate: 0, dps: 0 };
}
export function computeAttributes(equip) {
  if (typeof window.computeAttributes === 'function') return window.computeAttributes(equip);
  return { str: 5, agi: 5, vit: 5, int: 5, dex: 5, luk: 5 };
}
export function spawnEnemy(isBoss) {
  if (typeof window.spawnEnemy === 'function') return window.spawnEnemy(isBoss);
}
export function currentMonsterStats() {
  if (typeof window.currentMonsterStats === 'function') return window.currentMonsterStats();
  return {};
}
