export function updateCombat(dt) {
  if (typeof window.updateCombat === 'function') return window.updateCombat(dt);
}
export function updateMonsterAttack(dt, stats) {
  if (typeof window.updateMonsterAttack === 'function') return window.updateMonsterAttack(dt, stats);
}
export function updateRecovery(dt) {
  if (typeof window.updateRecovery === 'function') return window.updateRecovery(dt);
}
export function defeatEnemy() {
  if (typeof window.defeatEnemy === 'function') return window.defeatEnemy();
}
