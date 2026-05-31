import { getEquipmentSeriesConfig, normalizeEquipmentSeries } from './itemProgression.js';

const MAX_RESEARCH_LEVEL = 50;

function safeInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

function levelForExp(exp) {
  return Math.min(MAX_RESEARCH_LEVEL, Math.floor(Math.sqrt(safeInteger(exp) / 80)));
}

function normalizeResearchSeries(series) {
  const normalized = normalizeEquipmentSeries(series, '');
  return normalized && normalized !== 'oldWorld' ? normalized : '';
}

export function normalizeEquipmentResearchState(input = {}) {
  const source = input && typeof input === 'object' ? input : {};
  return Object.entries(source).reduce((state, [series, entry]) => {
    const normalized = normalizeResearchSeries(series);
    if (!normalized || !entry || typeof entry !== 'object') return state;
    const exp = safeInteger(entry.exp);
    state[normalized] = { exp, level: levelForExp(exp) };
    return state;
  }, {});
}

export function recordEquipmentResearch(state = {}, series = '', amount = 0) {
  const normalized = normalizeResearchSeries(series);
  if (!normalized) return null;
  const root = state && typeof state === 'object' ? state : {};
  const research = normalizeEquipmentResearchState(root.equipmentResearch);
  const current = research[normalized] || { exp: 0, level: 0 };
  const exp = current.exp + safeInteger(amount);
  const entry = { exp, level: levelForExp(exp) };
  research[normalized] = entry;
  root.equipmentResearch = research;
  return entry;
}

export function getEquipmentResearchBonus(state = {}, series = '') {
  const normalized = normalizeResearchSeries(series);
  const config = getEquipmentSeriesConfig(normalized || 'oldWorld');
  const research = normalizeEquipmentResearchState(state?.equipmentResearch || state);
  const level = normalized ? safeInteger(research[normalized]?.level) : 0;
  return {
    series: normalized || 'oldWorld',
    label: config.label || normalized || 'Old World',
    level,
    materialDropBonus: Math.min(0.25, level * 0.005),
    craftingDiscount: Math.min(0.15, level * 0.003),
    salvageReturnBonus: Math.min(0.2, level * 0.004),
  };
}
