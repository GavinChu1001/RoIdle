export function renderHeroes() {
  if (typeof window.renderHeroes === 'function') return window.renderHeroes();
}
export function renderTown() {
  if (typeof window.renderTown === 'function') return window.renderTown();
}
export function renderCharacterStatSections(stats) {
  if (typeof window.renderCharacterStatSections === 'function') return window.renderCharacterStatSections(stats);
}
export function renderCharacterStatBreakdown(stats) {
  if (typeof window.renderCharacterStatBreakdown === 'function') return window.renderCharacterStatBreakdown(stats);
}
export function renderPowerSourcePanel(stats) {
  if (typeof window.renderPowerSourcePanel === 'function') return window.renderPowerSourcePanel(stats);
}
export function renderSkillPanel() {
  if (typeof window.renderSkillPanel === 'function') return window.renderSkillPanel();
}
export function renderJobSkills() {
  if (typeof window.renderJobSkills === 'function') return window.renderJobSkills();
}
export function renderSkillMilestonePanel(entry, unlocked) {
  if (typeof window.renderSkillMilestonePanel === 'function') return window.renderSkillMilestonePanel(entry, unlocked);
}
export function renderSkillSpecialization(entry, unlocked, growth) {
  if (typeof window.renderSkillSpecialization === 'function') return window.renderSkillSpecialization(entry, unlocked, growth);
}
export function renderSkillSummaryCard() {
  if (typeof window.renderSkillSummaryCard === 'function') return window.renderSkillSummaryCard();
}
export function renderTitlePanel() {
  if (typeof window.renderTitlePanel === 'function') return window.renderTitlePanel();
}
