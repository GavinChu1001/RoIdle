export function refineItem(id) {
  if (typeof window.refineItem === 'function') return window.refineItem(id);
}
export function getRefineChance(nextStar, item) {
  if (typeof window.getRefineChance === 'function') return window.getRefineChance(nextStar, item);
  return 0;
}
export function getRefineCost(item) {
  if (typeof window.getRefineCost === 'function') return window.getRefineCost(item);
  return {};
}
export function snapshotRefineStats(item) {
  if (typeof window.snapshotRefineStats === 'function') return window.snapshotRefineStats(item);
  return {};
}
export function diffRefineStats(before, after) {
  if (typeof window.diffRefineStats === 'function') return window.diffRefineStats(before, after);
  return {};
}
export function star15Bonus(item) {
  if (typeof window.star15Bonus === 'function') return window.star15Bonus(item);
  return {};
}
export function refineMultiplier(star) {
  if (typeof window.refineMultiplier === 'function') return window.refineMultiplier(star);
  return 1;
}
