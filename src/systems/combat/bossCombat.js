export function isBossChallengeReady() {
  if (typeof window.isBossChallengeReady === 'function') return window.isBossChallengeReady();
  return false;
}
export function isCurrentlyFightingBoss() {
  if (typeof window.isCurrentlyFightingBoss === 'function') return window.isCurrentlyFightingBoss();
  return false;
}
export function isAutoBossInCooldown() {
  if (typeof window.isAutoBossInCooldown === 'function') return window.isAutoBossInCooldown();
  return false;
}
export function challengeBoss(opts = {}) {
  if (typeof window.challengeBoss === 'function') return window.challengeBoss(opts);
  return false;
}
export function tryAutoChallengeBoss(reason, stats) {
  if (typeof window.tryAutoChallengeBoss === 'function') return window.tryAutoChallengeBoss(reason, stats);
}
export function getAutoBossStatusText(stats) {
  if (typeof window.getAutoBossStatusText === 'function') return window.getAutoBossStatusText(stats);
  return '';
}
