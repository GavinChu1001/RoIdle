export function rollActiveSkill(dt, stats) {
  if (typeof window.rollActiveSkill === 'function') return window.rollActiveSkill(dt, stats);
}
export function skillAttributeMultiplier(active, stats) {
  if (typeof window.skillAttributeMultiplier === 'function') return window.skillAttributeMultiplier(active, stats);
  return 1;
}
export function noteSkillCast(name, damage) {
  if (typeof window.noteSkillCast === 'function') return window.noteSkillCast(name, damage);
}
export function getUnlockedSkills() {
  if (typeof window.getUnlockedSkills === 'function') return window.getUnlockedSkills();
  return [];
}
