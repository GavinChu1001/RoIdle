export const rarityOrder = ["normal", "fine", "rare", "epic", "ancient", "legend", "darkGold", "mythic"];

export const rarityDisplay = {
  normal: "普通",
  fine: "精良",
  rare: "稀有",
  epic: "史诗",
  ancient: "古代",
  legend: "传说",
  darkGold: "暗金",
  mythic: "神话",
};

export function rarityRank(rarity) {
  return rarityOrder.indexOf(rarity || "normal");
}

export function rarityName(rarity) {
  return rarityDisplay[rarity] || rarity;
}

export function isHighestRarity(rarity) {
  const available = rarityOrder.filter((r) => r !== "mythic");
  return rarity === "mythic" || rarityOrder.indexOf(rarity || "normal") === available.length - 1;
}

export function getRarityClass(itemOrRarity) {
  const rarity = typeof itemOrRarity === "string" ? itemOrRarity : itemOrRarity?.rarity || "normal";
  const classes = ["item-name", `rarity-${rarity}`];
  if (isHighestRarity(rarity)) classes.push("rarity-highest", "text-shine");
  return classes.join(" ");
}

export function getRarityLabel(rarity) {
  return rarityName(rarity);
}

// Attach to window for legacy game.js access
window.rarityOrder = rarityOrder;
window.rarityDisplay = rarityDisplay;
window.rarityRank = rarityRank;
window.rarityName = rarityName;
window.isHighestRarity = isHighestRarity;
window.getRarityClass = getRarityClass;
window.getRarityLabel = getRarityLabel;
