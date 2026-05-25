export function renderTasks() {
  if (typeof window.renderTasks === 'function') return window.renderTasks();
}
export function renderDailyGoals() {
  if (typeof window.renderDailyGoals === 'function') return window.renderDailyGoals();
}
export function renderAchievementPage() {
  if (typeof window.renderAchievementPage === 'function') return window.renderAchievementPage();
}
export function renderTaskCard(quest) {
  if (typeof window.renderTaskCard === 'function') return window.renderTaskCard(quest);
}
export function renderAchievementCard(achievement) {
  if (typeof window.renderAchievementCard === 'function') return window.renderAchievementCard(achievement);
}
