let mapCtx = {};

function esc(v) { return mapCtx.escapeHtml ? mapCtx.escapeHtml(v) : String(v); }
function essa(v) { return mapCtx.escapeAttr ? mapCtx.escapeAttr(v) : String(v); }
function fmtn(v) { return mapCtx.formatNumber ? mapCtx.formatNumber(v) : String(v || 0); }
function pct(v) { return mapCtx.percent ? mapCtx.percent(v) : String(Math.round((v || 0) * 100)) + '%'; }
function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function configureMapRenderContext(ctx = {}) { mapCtx = ctx || {}; }

export function renderMaps(ctx = mapCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  if (!els.mapList) return;
  const mapsArr = ctx.getMaps?.() || [];
  const activeDifficulty = state.currentDifficulty || 'normal';
  const difficultyLabel = (ctx.getDifficultyConfigs?.() || {})[activeDifficulty]?.label || '\u666e\u901a';

  els.mapList.innerHTML = mapsArr.map((map, index) => {
    const locked = index > (state.bestMap || 0);
    const active = index === state.currentMap;
    const progress = active ? (ctx.progressText?.() || '') : locked ? '\u672a\u5f00\u653e' : '\u53ef\u63a2\u7d22';
    const dp = (state.mapDifficultyProgress || {})[map.id] || { normal: { unlocked: index === 0, cleared: false }, hard: { unlocked: false, cleared: false }, abyss: { unlocked: false, cleared: false } };
    const normalLocked = locked || !Boolean(dp.normal?.unlocked);
    const hardLocked = locked || !Boolean(dp.hard?.unlocked);
    const abyssLocked = locked || !Boolean(dp.abyss?.unlocked);
    const diffLabel = (d) => {
      const entry = dp[d]; if (!entry) return '\u672a\u5f00\u653e';
      if (entry.cleared) return '\u5df2\u901a\u5173'; if (entry.unlocked) return '\u5df2\u89e3\u9501';
      return d === 'hard' ? '\u901a\u5173\u666e\u901a\u540e\u89e3\u9501' : '\u901a\u5173\u56f0\u96be\u540e\u89e3\u9501';
    };
    const tooltip = ctx.mapDropTooltip?.(map) || '';
    const range = ctx.getMapLevelRange?.(map) || { minLevel: 1, maxLevel: 1 };
    const previewDifficulty = active ? activeDifficulty : 'normal';
    const preview = ctx.getMapPreviewStats?.(map, previewDifficulty) || {};
    const recommendedScores = ctx.getRecommendedScoresForMap?.(map, previewDifficulty, false) || {};
    const monsterNames = (map.monsters || []).map((m) => m.name).join(' / ');
    const displayLabel = active ? difficultyLabel : '\u666e\u901a / \u56f0\u96be / \u6df1\u6e0a';
    const abyssScales = ctx.getAbyssMapTierScales?.() || {};
    const hardScales = ctx.getHardMapTierScales?.() || {};
    const diffConfigs = ctx.getDifficultyConfigs?.() || {};
    const displayPower = previewDifficulty === 'abyss'
      ? (abyssScales[map.id] || {}).recommendedPower || 350000
      : previewDifficulty === 'hard'
        ? (hardScales[map.id] || {}).recommendedPower || 130000
        : Math.round(F(range.recommendedPower) * F((diffConfigs[previewDifficulty] || {}).power || 1));
    const difficultyRole = previewDifficulty === 'abyss' ? '终局挑战' : previewDifficulty === 'hard' ? '周回挑战' : '主线推进';
    const equipmentProgression = ctx.formatEquipmentProgressionSummary?.(map.id, previewDifficulty) || '';
    const bossName = ctx.bossDisplayName?.(map, previewDifficulty) || map.boss;
    const exploration = ctx.getMapExplorationEntry?.(map.id) || {};
    const expReqs = ctx.getMapExplorationRequirements?.() || [];
    const nextNeed = expReqs[Math.min(10, F(exploration.level) + 1)] || expReqs[10];
    const exploreProgress = F(exploration.level) >= 10 ? 100 : Math.min(100, ((F(exploration.points) - expReqs[F(exploration.level)]) / Math.max(1, nextNeed - expReqs[F(exploration.level)])) * 100);
    const exploreBonuses = ctx.getMapExplorationBonuses?.(map.id) || {};
    return `<div class="map-item ${active ? 'active' : ''} ${locked ? 'locked' : ''}" data-tooltip="${essa(tooltip)}" title="${essa(tooltip)}">
      <div><span class="map-name">${esc(map.name)}</span>
      <p class="map-meta">\u602a\u7269\uff1a${monsterNames || map.enemy}</p>
      <p class="map-meta">\u63a8\u8350\u7b49\u7ea7 ${range.minLevel}-${range.maxLevel} \xb7 \u63a8\u8350\u6218\u529b ${fmtn(displayPower)} \xb7 \u5f53\u524d\u96be\u5ea6 ${esc(displayLabel)}</p>
      <p class="map-meta map-difficulty-role">难度定位：${esc(difficultyRole)}</p>
      <p class="map-meta">\u7b49\u7ea7 ${preview.levelRange?.[0] || 1}-${preview.levelRange?.[1] || 1} \xb7 HP ${ctx.formatRangeNumber?.(preview.hpRange) || ''} \xb7 \u653b\u51fb ${ctx.formatRangeNumber?.(preview.attackRange) || ''} \xb7 \u9632\u5fa1 ${ctx.formatRangeNumber?.(preview.defenseRange) || ''}</p>
      <p class="map-meta">\u63a8\u8350\u8bc4\u5206\uff1a\u8f93\u51fa ${fmtn(recommendedScores.output)} \xb7 \u751f\u5b58 ${fmtn(recommendedScores.survival)}${recommendedScores.abyss ? ` \xb7 \u6df1\u6e0a ${fmtn(recommendedScores.abyss)}` : ''}</p>
      <p class="map-meta">\u96be\u5ea6\u500d\u7387\uff1aHP x${preview.difficulty?.hp} / ATK x${preview.difficulty?.attack} / EXP x${preview.difficulty?.exp}</p>
      ${equipmentProgression ? `<p class="map-meta map-equipment-progression">\u88c5\u5907\u76ee\u6807\uff1a${esc(equipmentProgression)}</p>` : ''}
      ${previewDifficulty === 'abyss' ? '<p class="map-meta map-abyss-preview">本地图困难 Boss 通关后解锁本地图深渊。深渊用于深化当前装备线：掉落深渊淬炼材料、进阶核心材料和少量深渊前缀装备；它不是普通推图必刷路线。</p>' : ''}
      <p class="map-boss">${esc(bossName)} \xb7 ${esc(map.bossSkill || '')}</p>
      <p class="map-meta">\u8fdb\u5ea6 ${esc(progress)} \xb7 BASE ${fmtn(map.baseExp)} \xb7 JOB ${fmtn(map.jobExp)}</p>
      <div class="map-exploration">
        <div class="exploration-level">\u63a2\u7d22 Lv.${F(exploration.level)} \xb7 ${fmtn(exploration.points)} / ${fmtn(nextNeed)}</div>
        <div class="exploration-progress"><span class="exploration-progress-fill" style="width:${exploreProgress}%"></span></div>
        <p class="exploration-bonus-list">\u91d1\u5e01/\u7ecf\u9a8c +${pct(exploreBonuses.goldBonus)} \xb7 \u6750\u6599\u6389\u7387 +${pct(exploreBonuses.itemDropBonus)} \xb7 \u88c5\u5907\u6389\u7387 +${pct(exploreBonuses.equipmentDropBonus)}</p>
      </div></div>
      <div class="map-actions">
        <button type="button" data-map="${index}" data-difficulty="normal" ${normalLocked ? 'disabled' : ''} title="${diffLabel('normal')}">\u666e\u901a</button>
        <button type="button" data-map="${index}" data-difficulty="hard" ${hardLocked ? 'disabled' : ''} title="${diffLabel('hard')}">\u56f0\u96be</button>
        <button type="button" data-map="${index}" data-difficulty="abyss" ${abyssLocked ? 'disabled' : ''} title="${diffLabel('abyss')}">\u6df1\u6e0a</button>
      </div></div>`;
  }).join('');
}

export function installMapRenderRuntime(context = {}) {
  configureMapRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, { renderMaps }) : { renderMaps };
  return window.RuneFrontierRenderRuntime;
}
