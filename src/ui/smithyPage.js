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

export function installSmithyRenderRuntime(context = {}) {
  var existing = window.RuneFrontierRenderRuntime || {};
  var fnNames = ['renderSmithyPage','renderSmithyContent','renderEnhancePanel',
    'renderSmithyMaterialGuide','renderDarkGoldExchangePanel','renderDarkGoldExchangeCard',
    'renderEnhanceEffectText','renderSetTalentStatus','renderRefineStatDelta',
    'renderRefineResultModal','renderSmithy','renderStarRefineSmithyPanel',
    'renderCardSocketSmithyPanel','renderMaterialGroups','renderZodiacCollectionPanel',
    'renderCostumePanel'];
  var bridge = {};
  fnNames.forEach(function(name) {
    bridge[name] = function() { return callGameJsBody.apply(null, [name].concat(Array.prototype.slice.call(arguments))); };
  });
  window.RuneFrontierRenderRuntime = Object.assign(existing, bridge);
  return window.RuneFrontierRenderRuntime;
}
