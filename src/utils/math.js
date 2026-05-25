export function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

export function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

export function randomPick(items) {
  return items?.length ? items[Math.floor(Math.random() * items.length)] : null;
}

export function weightedChoice(items, weightFn) {
  const total = items.reduce((sum, item) => sum + Math.max(0, weightFn(item)), 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= Math.max(0, weightFn(item));
    if (roll <= 0) return item;
  }
  return items[items.length - 1] || null;
}

export function lerpRange(range, fallback, ratio) {
  if (!Array.isArray(range)) return fallback;
  const min = Number(range[0]);
  const max = Number(range[1]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return fallback;
  return min + (max - min) * ratio;
}

// Attach to window for legacy game.js access
window.randomFloat = randomFloat;
window.randomInt = randomInt;
window.clampNumber = clampNumber;
window.randomPick = randomPick;
window.weightedChoice = weightedChoice;
window.lerpRange = lerpRange;
