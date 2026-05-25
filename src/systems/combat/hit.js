export function calculateCritRate(input) {
  if (typeof window.calculateCritRate === 'function') return window.calculateCritRate(input);
  return 0;
}
export function calculateDodgeRate(input) {
  if (typeof window.calculateDodgeRate === 'function') return window.calculateDodgeRate(input);
  return 0;
}
