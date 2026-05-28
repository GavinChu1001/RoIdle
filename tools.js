// Rune Frontier Idle — Authoritative utility functions.
// Loaded as classic script BEFORE game.js so that all downstream scripts
// reference a single source of truth via window.* properties.
// Keep in sync with src/utils/format.js and src/utils/math.js (which now only READ from window).

var formatNumber = function formatNumber(value) {
  if (!Number.isFinite(value)) return "0";
  var abs = Math.abs(value);
  if (abs >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
  if (abs >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
  if (abs >= 10_000) return (value / 1_000).toFixed(1) + "K";
  return String(Math.floor(value));
};

var formatDuration = function formatDuration(seconds) {
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return h + "\u5c0f\u65f6" + m + "\u5206\u949f";
  if (m > 0) return m + "\u5206\u949f";
  return Math.max(0, seconds) + "\u79d2";
};

var percent = function percent(value) {
  if (!Number.isFinite(value)) return "0%";
  return Math.round((value || 0) * 100) + "%";
};

var formatSignedPercent = function formatSignedPercent(value) {
  var safe = Number(value) || 0;
  return (safe >= 0 ? "+" : "") + percent(safe);
};

var formatDropRate = function formatDropRate(rate) {
  if (!rate || rate <= 0) return "0%";
  var value = rate * 100;
  if (value < 0.01) return "<0.01%";
  if (value < 1) return value.toFixed(2) + "%";
  return value.toFixed(1) + "%";
};

var clampNumber = function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
};

var escapeAttr = function escapeAttr(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
};

var escapeHtml = function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

var randomFloat = function randomFloat(min, max) {
  return min + Math.random() * (max - min);
};

var randomInt = function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
};

var randomPick = function randomPick(items) {
  return items && items.length ? items[Math.floor(Math.random() * items.length)] : null;
};

var weightedChoice = function weightedChoice(items, weightFn) {
  var total = items.reduce(function(sum, item) { return sum + Math.max(0, weightFn(item)); }, 0);
  if (total <= 0) return null;
  var roll = Math.random() * total;
  for (var i = 0; i < items.length; i++) {
    roll -= Math.max(0, weightFn(items[i]));
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1] || null;
};

var lerpRange = function lerpRange(range, fallback, ratio) {
  if (!Array.isArray(range)) return fallback;
  var min = Number(range[0]);
  var max = Number(range[1]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return fallback;
  return min + (max - min) * ratio;
};
