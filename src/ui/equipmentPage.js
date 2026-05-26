function callGameJsBody(fnName) {
  const runtime = window.RuneFrontierRenderRuntime || {};
  const saved = runtime[fnName];
  delete runtime[fnName];
  try {
    if (typeof window[fnName] === 'function') window[fnName]();
  } finally {
    if (saved !== undefined) runtime[fnName] = saved;
  }
}

export function installEquipmentRenderRuntime(context = {}) {
  const existing = window.RuneFrontierRenderRuntime || {};
  const fnNames = ['renderEquipment','renderEquipmentSummaryStats','renderEquipmentCardScore',
    'renderEquipmentStateBadges','renderEquipmentFilterBar','renderEquipmentBatchPanel',
    'renderEquipmentBadges','renderEquipmentUsageTags','renderEquipmentScores',
    'renderEquipmentScoreComparison','renderEquipmentStatSections','renderEquipmentSetProgress',
    'renderCardSocketSection','renderRefineSection','renderSalvagePreviewSection',
    'renderStatChipGrid','renderRandomStatsPanel','renderEmpowerSection',
    'renderCardSocketOptions','renderRefineBadge','renderItemName','renderSetName'];
  const bridge = {};
  fnNames.forEach((name) => { bridge[name] = () => callGameJsBody(name); });
  window.RuneFrontierRenderRuntime = Object.assign(existing, bridge);
  return window.RuneFrontierRenderRuntime;
}
