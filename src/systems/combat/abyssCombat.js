export function applyHardBaseline(map, stats, isBoss) {
  if (typeof window.applyHardBaseline === 'function') return window.applyHardBaseline(map, stats, isBoss);
}
export function applyAbyssBaseline(map, stats, isBoss) {
  if (typeof window.applyAbyssBaseline === 'function') return window.applyAbyssBaseline(map, stats, isBoss);
}
