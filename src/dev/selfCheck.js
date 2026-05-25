const SECTION_LABELS = {
  save: '存档',
  equipment: '装备',
  drops: '掉落',
  combat: '战斗',
  materials: '材料',
  vip: 'VIP / 冒险者荣誉',
  codex: '图鉴',
  ui: 'UI',
};

const REQUIRED_APIS = {
  drops: ['recordRecentLoot', 'rollDrops', 'claimOffline'],
  combat: ['computeStats', 'tryAutoChallengeBoss'],
  vip: ['getVipProgressInfo', 'getInventoryLimit'],
  ui: ['renderAll', 'renderEquipment', 'renderSmithyPage', 'renderVip', 'renderCodex', 'renderShop'],
};

const MATERIAL_DISPLAY_REQUIREMENTS = [
  ['socketStone', '打孔石'],
  ['advancedSocketStone', '高级打孔石'],
  ['mythicSocketStone', '神话打孔石'],
  ['cardRemover', '卡片拆除器'],
  ['bossCardShard', 'Boss卡片碎片'],
  ['abyssCore', '深渊精华'],
  ['abyssEssence', '深渊首领魂'],
];

function issue(section, severity, code, message, ref = '') {
  return { section, severity, code, message, ref };
}

function sectionResult(name) {
  return { name, label: SECTION_LABELS[name] || name, ok: true, errors: [], warnings: [], summary: {} };
}

function push(result, severity, code, message, ref = '') {
  const target = severity === 'error' ? result.errors : result.warnings;
  target.push(issue(result.name, severity, code, message, ref));
  if (severity === 'error') result.ok = false;
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function finite(value) {
  return Number.isFinite(Number(value));
}

function hasInvalidNumber(value) {
  if (typeof value === 'number') return !Number.isFinite(value);
  if (Array.isArray(value)) return value.some(hasInvalidNumber);
  if (isObject(value)) return Object.values(value).some(hasInvalidNumber);
  return false;
}

function bridgeSnapshot() {
  const bridge = window.RuneFrontierDevBridge;
  if (!bridge || typeof bridge.getSnapshot !== 'function') return null;
  return bridge.getSnapshot();
}

export function checkSaveIntegrity(snapshot) {
  const result = sectionResult('save');
  const state = snapshot?.state;
  if (!isObject(state)) {
    push(result, 'error', 'SAVE_STATE_MISSING', '未取得当前存档快照，无法进行结构检查。');
    return result;
  }
  const requirements = [
    ['hero', isObject(state.hero)],
    ['materials', isObject(state.materials)],
    ['inventory', Array.isArray(state.inventory)],
    ['equipped', isObject(state.equipped)],
    ['monsterCodex', isObject(state.monsterCodex)],
    ['cardCodex', isObject(state.cardCodex)],
    ['vip', isObject(state.vip)],
    ['recentLoot', Array.isArray(state.recentLoot)],
    ['shopState', isObject(state.shopState)],
    ['autoSalvage', isObject(state.autoSalvage)],
  ];
  requirements.forEach(([key, valid]) => {
    if (!valid) push(result, 'warning', 'SAVE_FIELD_MISSING', `缺少或异常字段：${key}，可通过迁移修复功能补齐。`, key);
  });
  if (!finite(state.saveVersion)) push(result, 'warning', 'SAVE_VERSION_MISSING', '未检测到数字型 saveVersion，当前可能仍属于兼容存档。', 'saveVersion');
  if (hasInvalidNumber(state.materials || {})) push(result, 'error', 'SAVE_MATERIAL_NAN', '材料库存包含非法数字。', 'materials');
  result.summary = {
    inventory: Array.isArray(state.inventory) ? state.inventory.length : 0,
    recentLoot: Array.isArray(state.recentLoot) ? state.recentLoot.length : 0,
    materials: isObject(state.materials) ? Object.keys(state.materials).length : 0,
  };
  return result;
}

export function checkEquipmentIntegrity(snapshot) {
  const result = sectionResult('equipment');
  const state = snapshot?.state || {};
  const inventory = Array.isArray(state.inventory) ? state.inventory : [];
  const equippedIds = new Set(Object.values(state.equipped || {}).filter(Boolean));
  inventory.forEach((item, index) => {
    const ref = item?.instanceId || item?.id || `inventory[${index}]`;
    if (!isObject(item)) {
      push(result, 'error', 'EQUIPMENT_INVALID', '背包中存在非对象装备数据。', ref);
      return;
    }
    if (!item.id && !item.instanceId) push(result, 'warning', 'EQUIPMENT_ID_MISSING', '装备缺少唯一标识。', ref);
    if (!item.name && !item.templateId) push(result, 'warning', 'EQUIPMENT_NAME_MISSING', '装备缺少可显示名称来源。', ref);
    if (!item.slot && !item.equipSlot) push(result, 'warning', 'EQUIPMENT_SLOT_MISSING', '装备缺少部位字段。', ref);
    if (!item.rarity) push(result, 'warning', 'EQUIPMENT_RARITY_MISSING', '装备缺少品质字段。', ref);
    if (!finite(item.level || 0)) push(result, 'error', 'EQUIPMENT_LEVEL_NAN', '装备等级不是有效数字。', ref);
    if (item.enhanceLevel !== undefined && !finite(item.enhanceLevel)) push(result, 'error', 'EQUIPMENT_ENHANCE_NAN', '精炼等级不是有效数字。', ref);
    if (item.refine !== undefined && !finite(item.refine)) push(result, 'error', 'EQUIPMENT_REFINE_NAN', '星炼等级不是有效数字。', ref);
    if (item.cardSlots !== undefined && !Array.isArray(item.cardSlots)) push(result, 'warning', 'EQUIPMENT_CARD_SLOTS_INVALID', 'cardSlots 不是数组，旧装备应按空卡槽兼容。', ref);
    if (item.specialPassives !== undefined && !Array.isArray(item.specialPassives)) push(result, 'warning', 'EQUIPMENT_PASSIVES_INVALID', 'specialPassives 不是数组。', ref);
    if (hasInvalidNumber(item)) push(result, 'error', 'EQUIPMENT_NUMERIC_NAN', '装备数据包含非法数字。', ref);
    try {
      const safeItem = { ...item, cardSlots: Array.isArray(item.cardSlots) ? item.cardSlots : [] };
      if (typeof window.getEffectiveItemStats === 'function') {
        const stats = window.getEffectiveItemStats(safeItem, true);
        if (hasInvalidNumber(stats)) push(result, 'error', 'EQUIPMENT_STATS_NAN', '装备有效属性计算包含非法数字。', ref);
      }
      if (typeof window.calculateEquipmentScores === 'function') {
        const scores = window.calculateEquipmentScores(safeItem);
        if (hasInvalidNumber(scores)) push(result, 'error', 'EQUIPMENT_SCORE_NAN', '装备评分出现非法数字。', ref);
      }
    } catch (error) {
      push(result, 'error', 'EQUIPMENT_CALC_FAILED', `装备只读计算失败：${error.message}`, ref);
    }
  });
  result.summary = { total: inventory.length, equipped: equippedIds.size, abnormal: result.errors.length };
  return result;
}

export function checkDropSystemIntegrity(snapshot) {
  const result = sectionResult('drops');
  const aliases = snapshot?.mapDropTableAlias || {};
  const tables = snapshot?.equipmentDropTables || {};
  const materials = snapshot?.materialDropTables || {};
  const mapIds = (snapshot?.maps || []).map((map) => map.id);
  mapIds.forEach((mapId) => {
    const tableId = aliases[mapId] || mapId;
    if (!Array.isArray(tables[tableId])) push(result, 'error', 'DROP_TABLE_MISSING', `地图 ${mapId} 未找到装备掉落表。`, tableId);
    if (!Array.isArray(materials[mapId])) push(result, 'warning', 'MATERIAL_DROP_TABLE_MISSING', `地图 ${mapId} 未找到材料掉落表。`, mapId);
  });
  Object.entries(tables).forEach(([tableId, rows]) => {
    if (!Array.isArray(rows)) {
      push(result, 'error', 'DROP_TABLE_INVALID', `装备掉落表 ${tableId} 格式异常。`, tableId);
      return;
    }
    rows.forEach((row, index) => {
      const ref = `${tableId}[${index}]`;
      if (!row?.equipmentId) push(result, 'error', 'DROP_TEMPLATE_MISSING', '掉落项缺少 equipmentId。', ref);
      if (!finite(row?.dropRate) || Number(row.dropRate) < 0) push(result, 'error', 'DROP_RATE_INVALID', '掉率不是有效非负数字。', ref);
      if (!finite(row?.minLevel) || !finite(row?.maxLevel) || Number(row.minLevel) > Number(row.maxLevel)) push(result, 'error', 'DROP_LEVEL_RANGE_INVALID', '掉落等级区间无效。', ref);
    });
  });
  REQUIRED_APIS.drops.forEach((name) => {
    if (!snapshot?.api?.[name]) push(result, 'error', 'DROP_API_MISSING', `缺少掉落入口函数：${name}。`, name);
  });
  result.summary = {
    maps: mapIds.length,
    equipmentTables: Object.keys(tables).length,
    simulation: '为保护真实存档，本次不执行真实掉落模拟',
  };
  return result;
}

export function checkCombatIntegrity(snapshot) {
  const result = sectionResult('combat');
  const state = snapshot?.state || {};
  const hero = state.hero || {};
  if (!finite(hero.baseLevel) || Number(hero.baseLevel) < 1) push(result, 'error', 'COMBAT_HERO_LEVEL_INVALID', '角色 BASE 等级异常。', 'hero.baseLevel');
  if (state.enemyHp !== undefined && !finite(state.enemyHp)) push(result, 'error', 'COMBAT_ENEMY_HP_NAN', '当前怪物生命包含非法数字。', 'enemyHp');
  if (state.enemyMaxHp !== undefined && !finite(state.enemyMaxHp)) push(result, 'error', 'COMBAT_ENEMY_MAX_HP_NAN', '当前怪物最大生命包含非法数字。', 'enemyMaxHp');
  if (Number(snapshot?.playerCritRateCap) !== 1) push(result, 'warning', 'COMBAT_CRIT_CAP_UNEXPECTED', '玩家暴击率上限未检测为 100%。', 'PLAYER_CRIT_RATE_CAP');
  REQUIRED_APIS.combat.forEach((name) => {
    if (!snapshot?.api?.[name]) push(result, 'error', 'COMBAT_API_MISSING', `缺少战斗入口函数：${name}。`, name);
  });
  result.summary = { critRateCap: snapshot?.playerCritRateCap || 0, simulation: '跳过有状态战斗回合模拟' };
  return result;
}

export function checkMaterialIntegrity(snapshot) {
  const result = sectionResult('materials');
  const names = snapshot?.materialNames || {};
  const db = snapshot?.materialDb || {};
  const owned = snapshot?.state?.materials || {};
  MATERIAL_DISPLAY_REQUIREMENTS.forEach(([id, expected]) => {
    if (!names[id]) push(result, 'error', 'MATERIAL_NAME_MISSING', `材料 ${id} 缺少中文显示名。`, id);
    else if (names[id] !== expected) push(result, 'warning', 'MATERIAL_NAME_UNEXPECTED', `${id} 当前显示为“${names[id]}”，预期显示“${expected}”。`, id);
    if (!db[id]) push(result, 'warning', 'MATERIAL_DB_MISSING', `材料 ${id} 未登记到材料数据库。`, id);
  });
  Object.entries(owned).forEach(([id, amount]) => {
    if (!finite(amount) || Number(amount) < 0) push(result, 'error', 'MATERIAL_COUNT_INVALID', `材料 ${id} 数量异常。`, id);
    if (!names[id] && Number(amount) > 0) push(result, 'warning', 'OWNED_MATERIAL_UNKNOWN', `已拥有材料 ${id} 缺少中文显示名。`, id);
  });
  if (Number(owned.grassBossSoul || 0) > 0) push(result, 'warning', 'LEGACY_MATERIAL_PRESENT', '检测到旧字段 grassBossSoul，建议通过迁移转为 grassEssence。', 'grassBossSoul');
  if (Object.prototype.hasOwnProperty.call(owned, 'abyssSocketStone') || names.abyssSocketStone) push(result, 'warning', 'SOCKET_ALIAS_PRESENT', '检测到 abyssSocketStone；当前正式高阶字段为 mythicSocketStone，请避免重复材料。', 'abyssSocketStone');
  result.summary = { defined: Object.keys(names).length, owned: Object.keys(owned).filter((id) => Number(owned[id]) > 0).length };
  return result;
}

export function checkVipIntegrity(snapshot) {
  const result = sectionResult('vip');
  const vip = snapshot?.state?.vip || {};
  const progress = snapshot?.vipProgress || {};
  if (!finite(vip.level) || Number(vip.level) < 0) push(result, 'error', 'VIP_LEVEL_INVALID', '冒险者荣誉等级异常。', 'vip.level');
  if (!finite(vip.exp) || Number(vip.exp) < 0) push(result, 'error', 'VIP_EXP_INVALID', '冒险者荣誉经验为负数或非法数字。', 'vip.exp');
  ['level', 'totalExp', 'currentLevelExp', 'requiredForNext', 'remaining', 'progressPct'].forEach((key) => {
    if (!finite(progress[key]) || Number(progress[key]) < 0) push(result, 'error', 'VIP_PROGRESS_INVALID', `荣誉进度字段 ${key} 异常。`, key);
  });
  if (!finite(snapshot?.inventoryLimit) || Number(snapshot.inventoryLimit) < 1) push(result, 'error', 'INVENTORY_LIMIT_INVALID', '背包容量结果异常。', 'getInventoryLimit');
  REQUIRED_APIS.vip.forEach((name) => {
    if (!snapshot?.api?.[name]) push(result, 'error', 'VIP_API_MISSING', `缺少荣誉相关函数：${name}。`, name);
  });
  result.summary = { level: Number(vip.level || 0), remaining: Number(progress.remaining || 0), inventoryLimit: Number(snapshot?.inventoryLimit || 0) };
  return result;
}

export function checkCodexIntegrity(snapshot) {
  const result = sectionResult('codex');
  const state = snapshot?.state || {};
  const monsterCodex = state.monsterCodex || {};
  const cardCodex = state.cardCodex || {};
  Object.entries(monsterCodex).forEach(([id, entry]) => {
    if (entry?.kills !== undefined && (!finite(entry.kills) || Number(entry.kills) < 0)) push(result, 'error', 'CODEX_KILLS_INVALID', '怪物图鉴击杀数异常。', id);
  });
  Object.entries(cardCodex).forEach(([id, entry]) => {
    const count = entry?.count ?? entry?.obtainedCount ?? 0;
    if (!finite(count) || Number(count) < 0) push(result, 'error', 'CODEX_CARD_COUNT_INVALID', '卡片图鉴数量异常。', id);
  });
  result.summary = { monsters: Object.keys(monsterCodex).length, cards: Object.keys(cardCodex).length };
  return result;
}

export function checkUiIntegrity(snapshot) {
  const result = sectionResult('ui');
  const requiredElements = ['sceneCanvas', 'equipmentGrid', 'equippedSlots', 'smithyPageContent', 'vipPanel', 'codexContent', 'shopContent', 'offlineRewardModal', 'refineResultModal', 'toast'];
  requiredElements.forEach((id) => {
    if (!document.getElementById(id)) push(result, 'warning', 'UI_ELEMENT_MISSING', `页面未找到容器：${id}。`, id);
  });
  REQUIRED_APIS.ui.forEach((name) => {
    if (!snapshot?.api?.[name]) push(result, 'error', 'UI_API_MISSING', `缺少渲染入口函数：${name}。`, name);
  });
  result.summary = { checkedContainers: requiredElements.length };
  return result;
}

export function runFullSelfCheck() {
  const checkedAt = Date.now();
  const before = bridgeSnapshot();
  if (!before) {
    const failure = issue('save', 'error', 'DEV_BRIDGE_MISSING', '开发快照桥接不可用，请使用 ?dev=1 重新打开页面。');
    return { ok: false, checkedAt, errors: [failure], warnings: [], sections: {}, summary: {} };
  }
  const sections = {
    save: checkSaveIntegrity(before),
    equipment: checkEquipmentIntegrity(before),
    drops: checkDropSystemIntegrity(before),
    combat: checkCombatIntegrity(before),
    materials: checkMaterialIntegrity(before),
    vip: checkVipIntegrity(before),
    codex: checkCodexIntegrity(before),
    ui: checkUiIntegrity(before),
  };
  const after = bridgeSnapshot();
  if (JSON.stringify(before.state) !== JSON.stringify(after?.state)) {
    push(sections.save, 'error', 'SELF_CHECK_MUTATED_STATE', '一键自检过程中检测到真实状态发生变化。');
  }
  const errors = Object.values(sections).flatMap((section) => section.errors);
  const warnings = Object.values(sections).flatMap((section) => section.warnings);
  return {
    ok: errors.length === 0,
    checkedAt,
    errors,
    warnings,
    sections,
    summary: {
      equipmentCount: sections.equipment.summary.total || 0,
      materialCount: sections.materials.summary.defined || 0,
      inventoryLimit: sections.vip.summary.inventoryLimit || 0,
    },
  };
}

export const selfCheckSectionLabels = SECTION_LABELS;
