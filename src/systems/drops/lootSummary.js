export function renderOfflineRewardSummary(rewards) { return (typeof window.renderOfflineRewardSummary === 'function') ? window.renderOfflineRewardSummary(rewards) : ''; }
export function buildLootSummary() { return (typeof window.renderLootSummaryCard === 'function') ? window.renderLootSummaryCard({}) : ''; }
