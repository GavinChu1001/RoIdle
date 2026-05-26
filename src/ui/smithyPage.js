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

export function installSmithyRenderRuntime(context = {}) {
  const existing = window.RuneFrontierRenderRuntime || {};
  const fnNames = ['renderSmithyPage','renderSmithyContent','renderEnhancePanel',
    'renderSmithyMaterialGuide','renderDarkGoldExchangePanel','renderDarkGoldExchangeCard',
    'renderEnhanceEffectText','renderSetTalentStatus','renderRefineStatDelta',
    'renderRefineResultModal','renderSmithy','renderStarRefineSmithyPanel',
    'renderCardSocketSmithyPanel','renderMaterialGroups','renderZodiacCollectionPanel',
    'renderCostumePanel'];
  const bridge = {};
  fnNames.forEach((name) => { bridge[name] = () => callGameJsBody(name); });
  window.RuneFrontierRenderRuntime = Object.assign(existing, bridge);
  return window.RuneFrontierRenderRuntime;
}
