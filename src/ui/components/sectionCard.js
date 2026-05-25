export function renderLootSummaryCard(rewards) {
  if (typeof window.renderLootSummaryCard === 'function') return window.renderLootSummaryCard(rewards);
}
export function renderOfflineEmptySection(title, text) {
  if (typeof window.renderOfflineEmptySection === 'function') return window.renderOfflineEmptySection(title, text);
}
