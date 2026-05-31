export const SKILL_DPS_WINDOW_MS = 30000;
const MAX_SKILL_DPS_EVENTS = 400;

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function cleanName(name) {
  return String(name || '').trim() || '未知技能';
}

function pruneEvents(events, now, windowMs) {
  const cutoff = now - windowMs;
  while (events.length && finite(events[0].time) < cutoff) events.shift();
  if (events.length > MAX_SKILL_DPS_EVENTS) events.splice(0, events.length - MAX_SKILL_DPS_EVENTS);
}

export function createSkillDpsTracker(options = {}) {
  const nowFn = typeof options.now === 'function' ? options.now : () => Date.now();
  const windowMs = Math.max(1000, finite(options.windowMs) || SKILL_DPS_WINDOW_MS);
  const events = [];

  function recordSkillDamage(name, damage, time = nowFn()) {
    const amount = Math.max(0, finite(damage));
    if (amount <= 0) return;
    const now = finite(time) || nowFn();
    events.push({ name: cleanName(name), damage: amount, time: now });
    pruneEvents(events, now, windowMs);
  }

  function getSkillDpsRows(limit = 5, time = nowFn()) {
    const now = finite(time) || nowFn();
    pruneEvents(events, now, windowMs);
    const totals = new Map();
    events.forEach((event) => {
      const current = totals.get(event.name) || 0;
      totals.set(event.name, current + event.damage);
    });
    const totalSkillDamage = [...totals.values()].reduce((sum, value) => sum + value, 0);
    return [...totals.entries()]
      .map(([name, skillDamage]) => ({
        name,
        damage: skillDamage,
        dps: skillDamage / 30,
        share: totalSkillDamage > 0 ? skillDamage / totalSkillDamage : 0,
      }))
      .sort((a, b) => b.damage - a.damage)
      .slice(0, Math.max(1, Math.floor(finite(limit) || 5)));
  }

  function clearSkillDpsStats() {
    events.length = 0;
  }

  return { recordSkillDamage, getSkillDpsRows, clearSkillDpsStats };
}
