let runtimeContext = {};

export function configureLootModelContext(context = {}) {
  runtimeContext = context || {};
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function object(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normalizeEquipmentList(entries, context = runtimeContext) {
  return list(entries).map((item) => context.normalizeEquipment?.(item) || item);
}

function mergeCountEntries(entries, idKey) {
  const merged = new Map();
  list(entries).forEach((entry) => {
    const id = entry?.[idKey];
    if (!id) return;
    const current = merged.get(id) || { ...entry, qty: 0 };
    current.qty += finite(entry.qty);
    merged.set(id, current);
  });
  return [...merged.values()].filter((entry) => entry.qty > 0);
}

function mergeMaterials(a = {}, b = {}) {
  const merged = { ...object(a) };
  Object.entries(object(b)).forEach(([id, amount]) => {
    merged[id] = finite(merged[id]) + finite(amount);
  });
  return merged;
}

export function normalizeLootRewards(input = {}, context = runtimeContext) {
  const source = input || {};
  const base = context.normalizeBaseRewards?.(source) || source;
  const allEquipment = normalizeEquipmentList(
    Array.isArray(base.equipments)
      ? base.equipments
      : Array.isArray(source.equipment)
        ? source.equipment
        : [],
    context,
  );
  const skippedEquipment = Math.max(0, finite(base.skippedEquipment ?? source.skippedEquipment));
  const inferredPendingCount = Math.min(skippedEquipment, allEquipment.length);
  const pendingEquipment = normalizeEquipmentList(
    Array.isArray(source.pendingEquipment)
      ? source.pendingEquipment
      : Array.isArray(base.pendingEquipment)
        ? base.pendingEquipment
        : inferredPendingCount
          ? allEquipment.slice(-inferredPendingCount)
          : [],
    context,
  );
  const equipment = normalizeEquipmentList(
    Array.isArray(source.equipment)
      ? source.equipment
      : inferredPendingCount
        ? allEquipment.slice(0, -inferredPendingCount)
        : allEquipment,
    context,
  );
  const autoSalvagedMaterials = object(
    base.autoSalvagedMaterials ||
    source.autoSalvagedMaterials ||
    source.salvagedMaterials ||
    source.salvageMaterials,
  );
  const durationMs = finite(base.durationMs ?? source.durationMs ?? source.offlineMs ?? source.duration);
  const seconds = finite(base.seconds ?? source.seconds ?? source.offlineSeconds ?? Math.floor(durationMs / 1000));

  return {
    ...base,
    seconds,
    durationMs,
    cappedDurationMs: finite(base.cappedDurationMs ?? source.cappedDurationMs ?? durationMs),
    gold: finite(base.gold ?? source.gold),
    baseExp: finite(base.baseExp ?? source.baseExp ?? source.exp),
    jobExp: finite(base.jobExp ?? source.jobExp),
    killCount: finite(base.killCount ?? source.killCount ?? source.kills),
    kills: finite(base.killCount ?? source.killCount ?? source.kills),
    equipments: allEquipment,
    equipment,
    pendingEquipment,
    cards: list(base.cards ?? source.cards),
    materials: list(base.materials ?? source.materials),
    autoSalvagedMaterials,
    salvagedMaterials: autoSalvagedMaterials,
    autoSalvaged: finite(source.autoSalvaged ?? source.salvagedCount ?? context.objectTotal?.(autoSalvagedMaterials)),
    skippedEquipment,
    mapId: base.mapId || source.mapId || '',
    calculatedAt: base.calculatedAt || source.calculatedAt || '',
    noRewardsReason: base.noRewardsReason || source.noRewardsReason || '',
    errors: list(source.errors),
  };
}

export function mergeLootRewards(rewardList = [], context = runtimeContext) {
  const merged = normalizeLootRewards(context.createEmptyRewards?.() || {}, context);
  list(rewardList).forEach((raw) => {
    const rewards = normalizeLootRewards(raw, context);
    merged.seconds += rewards.seconds;
    merged.durationMs += rewards.durationMs;
    merged.cappedDurationMs += rewards.cappedDurationMs;
    merged.gold += rewards.gold;
    merged.baseExp += rewards.baseExp;
    merged.jobExp += rewards.jobExp;
    merged.killCount += rewards.killCount;
    merged.kills = merged.killCount;
    merged.equipment.push(...rewards.equipment);
    merged.pendingEquipment.push(...rewards.pendingEquipment);
    merged.equipments.push(...rewards.equipments);
    merged.cards = mergeCountEntries([...merged.cards, ...rewards.cards], 'cardId');
    merged.materials = mergeCountEntries([...merged.materials, ...rewards.materials], 'materialId');
    merged.autoSalvagedMaterials = mergeMaterials(merged.autoSalvagedMaterials, rewards.autoSalvagedMaterials);
    merged.salvagedMaterials = merged.autoSalvagedMaterials;
    merged.skippedEquipment += rewards.skippedEquipment;
    merged.mapId = rewards.mapId || merged.mapId;
    merged.calculatedAt = rewards.calculatedAt || merged.calculatedAt;
    merged.noRewardsReason = rewards.noRewardsReason || merged.noRewardsReason;
  });
  merged.autoSalvaged = finite(context.objectTotal?.(merged.autoSalvagedMaterials));
  return merged;
}

export function getLatestRecentLootRewards(state = {}, context = runtimeContext) {
  const entries = list(state.recentLoot)
    .map((entry) => ({
      ...entry,
      time: finite(entry?.time ?? entry?.createdAt),
    }))
    .sort((a, b) => b.time - a.time);
  if (!entries.length) return null;
  const newest = entries[0].time;
  const batch = entries
    .filter((entry) => newest - entry.time <= 10000)
    .slice(0, 8)
    .reverse()
    .map((entry) => entry.rewards || entry);
  return mergeLootRewards(batch, context);
}
