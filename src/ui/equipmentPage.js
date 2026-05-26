function callGameJsBody(fnName) {
  var args = Array.prototype.slice.call(arguments, 1);
  var runtime = window.RuneFrontierRenderRuntime || {};
  var saved = runtime[fnName];
  delete runtime[fnName];
  try {
    return window[fnName] ? window[fnName].apply(window, args) : undefined;
  } finally {
    if (saved !== undefined) runtime[fnName] = saved;
  }
}

export function installEquipmentRenderRuntime(context = {}) {
  var existing = window.RuneFrontierRenderRuntime || {};
  var fnNames = ['renderEquipment','renderEquipmentSummaryStats','renderEquipmentCardScore',
    'renderEquipmentStateBadges','renderEquipmentFilterBar','renderEquipmentBatchPanel',
    'renderEquipmentBadges','renderEquipmentUsageTags','renderEquipmentScores',
    'renderEquipmentScoreComparison','renderEquipmentStatSections','renderEquipmentSetProgress',
    'renderCardSocketSection','renderRefineSection','renderSalvagePreviewSection',
    'renderStatChipGrid','renderRandomStatsPanel','renderEmpowerSection',
    'renderCardSocketOptions','renderRefineBadge','renderItemName','renderSetName'];
  var bridge = {};
  fnNames.forEach(function(name) {
    bridge[name] = function() { return callGameJsBody.apply(null, [name].concat(Array.prototype.slice.call(arguments))); };
  });
  window.RuneFrontierRenderRuntime = Object.assign(existing, bridge);
  return window.RuneFrontierRenderRuntime;
}
