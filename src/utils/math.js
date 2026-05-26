export function randomFloat(min, max) {
  return window.randomFloat ? window.randomFloat(min, max) : min + Math.random() * (max - min);
}
export function randomInt(min, max) {
  return window.randomInt ? window.randomInt(min, max) : Math.floor(min + Math.random() * (max - min + 1));
}
export function clampNumber(value, min, max) {
  return window.clampNumber ? window.clampNumber(value, min, max) : Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}
export function randomPick(items) {
  return window.randomPick ? window.randomPick(items) : (items?.length ? items[Math.floor(Math.random() * items.length)] : null);
}
export function weightedChoice(items, weightFn) {
  return window.weightedChoice ? window.weightedChoice(items, weightFn) : null;
}
export function lerpRange(range, fallback, ratio) {
  return window.lerpRange ? window.lerpRange(range, fallback, ratio) : (Array.isArray(range) ? range[0] + (range[1] - range[0]) * ratio : fallback);
}
