let handbookRenderCtx = {};

const TEXT = {
  titleEyebrow: "\u5192\u9669\u624b\u518c",
  todayRoute: "\u4eca\u65e5\u8def\u7ebf",
  researchPoints: "\u7814\u7a76\u70b9",
  recommendedMap: "\u63a8\u8350\u5730\u56fe",
  defaultMapName: "\u5f53\u524d\u5730\u56fe",
  defaultMapReason: "\u7ee7\u7eed\u79ef\u7d2f\u5f53\u524d\u9636\u6bb5\u8d44\u6e90\u3002",
  equipmentTarget: "\u88c5\u5907\u76ee\u6807",
  defaultEquipmentTitle: "\u63d0\u5347\u88c5\u5907",
  defaultEquipmentDesc: "\u5bfb\u627e\u66f4\u9002\u5408\u5f53\u524d\u9636\u6bb5\u7684\u88c5\u5907\u3002",
  recommendedMaterials: "\u63a8\u8350\u6750\u6599",
  noMaterials: "\u5f53\u524d\u6ca1\u6709\u660e\u663e\u6750\u6599\u7f3a\u53e3\u3002",
  recommendedDungeons: "\u63a8\u8350\u526f\u672c",
  noDungeons: "\u4eca\u65e5\u526f\u672c\u6b21\u6570\u5df2\u7528\u5b8c\u3002",
  dailyGoals: "\u6bcf\u65e5\u76ee\u6807",
  weeklyGoals: "\u5468\u5e38\u76ee\u6807",
  claimed: "\u5df2\u9886\u53d6",
  claim: "\u9886\u53d6",
  inProgress: "\u8fdb\u884c\u4e2d",
  gold: "\u91d1\u5e01",
  sourceUnknown: "\u6765\u6e90\u5f85\u53d1\u73b0",
  missing: "\u7f3a",
  recommendedPower: "\u63a8\u8350\u6218\u529b",
  remaining: "\u5269\u4f59",
};

function getWindow() {
  return typeof window === "undefined" ? {} : window;
}

function esc(value) {
  const win = getWindow();
  const escape = handbookRenderCtx.escapeHtml || win.escapeHtml || String;
  return escape(value == null ? "" : value);
}

function fmtn(value) {
  const win = getWindow();
  const format = handbookRenderCtx.formatNumber || win.formatNumber || String;
  const number = Math.max(0, Number(value || 0));
  return format(Number.isFinite(number) ? number : 0);
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function progressPct(goal) {
  const target = Math.max(1, finite(goal.target || 1));
  return Math.min(100, (finite(goal.progress) / target) * 100);
}

function rewardText(reward = {}) {
  const parts = [];
  if (reward.gold) parts.push(`${TEXT.gold} ${fmtn(reward.gold)}`);
  if (reward.researchPoints) parts.push(`${TEXT.researchPoints} ${fmtn(reward.researchPoints)}`);
  Object.entries(reward.materials || {}).forEach(([id, amount]) => {
    parts.push(`${esc(handbookRenderCtx.getMaterialName?.(id) || id)} x${fmtn(amount)}`);
  });
  return parts.join(" / ") || "-";
}

function renderGoalCard(goal) {
  const target = Math.max(1, finite(goal.target || 1));
  const progress = Math.min(target, finite(goal.progress));
  const done = Boolean(goal.completed) || progress >= target;
  const claimed = Boolean(goal.claimed);
  const buttonText = claimed ? TEXT.claimed : done ? TEXT.claim : TEXT.inProgress;
  return `<article class="handbook-goal-card ${done ? "is-complete" : ""} ${claimed ? "is-claimed" : ""}">
    <div>
      <strong>${esc(goal.title)}</strong>
      <p class="quest-desc">${esc(goal.desc || goal.description || "")}</p>
      <div class="quest-progress handbook-progress"><span style="width:${progressPct(goal)}%"></span></div>
      <small>${fmtn(progress)} / ${fmtn(target)}</small>
      <small>${rewardText(goal.reward || goal.rewards)}</small>
    </div>
    <button class="quest-claim-btn" data-claim-handbook-goal="${esc(goal.id)}" type="button" ${!done || claimed ? "disabled" : ""}>${buttonText}</button>
  </article>`;
}

function renderMaterialRow(row) {
  const source = (row.sources || [])[0];
  const sourceText = source
    ? `${source.mapName || source.mapId || TEXT.defaultMapName} / ${source.difficulty || "normal"}`
    : TEXT.sourceUnknown;
  return `<div class="handbook-rec-row">
    <div><strong>${esc(row.name || row.id)}</strong><small>${esc(row.reason || "")}</small></div>
    <span>${TEXT.missing} ${fmtn(row.missing)} / ${esc(sourceText)}</span>
  </div>`;
}

function renderDungeonRow(row) {
  return `<div class="handbook-rec-row">
    <div><strong>${esc(row.name || row.id)}</strong><small>${TEXT.recommendedPower} ${fmtn(row.recommendedPower)}</small></div>
    <span>${TEXT.remaining} ${fmtn(row.remaining)}</span>
  </div>`;
}

export function configureAdventureHandbookRenderContext(ctx = {}) {
  handbookRenderCtx = ctx || {};
}

export function renderAdventureHandbookPage() {
  const win = getWindow();
  const els = handbookRenderCtx.getEls?.() || win.els || {};
  if (!els.adventureHandbookPage) return;

  const state = handbookRenderCtx.getState?.() || win.state || {};
  const model = handbookRenderCtx.getAdventureHandbookModel?.(state) || {};
  const map = model.mapRecommendation || {};
  const equipment = model.equipmentTarget || {};
  const materials = model.materials || [];
  const dungeons = model.dungeons || [];
  const dailyGoals = model.dailyGoals || [];
  const weeklyGoals = model.weeklyGoals || [];

  els.adventureHandbookPage.innerHTML = `<section class="handbook-page">
    <div class="panel-heading">
      <div><p class="eyebrow">${TEXT.titleEyebrow}</p><h2>${TEXT.todayRoute}</h2></div>
      <strong class="handbook-points">${TEXT.researchPoints} ${fmtn(model.researchPoints)}</strong>
    </div>
    <section class="handbook-section handbook-focus">
      <article><span>${TEXT.recommendedMap}</span><strong>${esc(map.name || TEXT.defaultMapName)}</strong><p>${esc(map.reason || TEXT.defaultMapReason)}</p></article>
      <article><span>${TEXT.equipmentTarget}</span><strong>${esc(equipment.title || TEXT.defaultEquipmentTitle)}</strong><p>${esc(equipment.desc || TEXT.defaultEquipmentDesc)}</p></article>
    </section>
    <section class="handbook-section"><h3>${TEXT.recommendedMaterials}</h3><div class="handbook-rec-list">${materials.map(renderMaterialRow).join("") || `<p class="quest-desc">${TEXT.noMaterials}</p>`}</div></section>
    <section class="handbook-section"><h3>${TEXT.recommendedDungeons}</h3><div class="handbook-rec-list">${dungeons.map(renderDungeonRow).join("") || `<p class="quest-desc">${TEXT.noDungeons}</p>`}</div></section>
    <section class="handbook-section"><h3>${TEXT.dailyGoals}</h3><div class="handbook-goal-grid">${dailyGoals.map(renderGoalCard).join("")}</div></section>
    <section class="handbook-section"><h3>${TEXT.weeklyGoals}</h3><div class="handbook-goal-grid">${weeklyGoals.map(renderGoalCard).join("")}</div></section>
  </section>`;
}

export function installAdventureHandbookRenderRuntime(context = {}) {
  configureAdventureHandbookRenderContext(context);
  const win = getWindow();
  const existing = win.RuneFrontierRenderRuntime || {};
  win.RuneFrontierRenderRuntime = typeof existing === "object"
    ? Object.assign(existing, { renderAdventureHandbookPage })
    : { renderAdventureHandbookPage };
  return win.RuneFrontierRenderRuntime;
}
