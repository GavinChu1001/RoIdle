export const materialNames = {
  dust: "研磨粉",
  ore: "精炼矿",
  tierOre: "阶级矿",
  refinedOre: "精炼矿",
  rareOre: "稀有矿",
  crystal: "蓝晶碎片",
  rune: "露恩石",
  weaponEmbryo: "武器胚子",
  armorEmbryo: "防具胚子",
  accessoryEmbryo: "饰品胚子",
  craftingComponent: "打造组件",
  masterCraftVoucher: "大师打造凭证",
  ancientCore: "古代核心",
  starShard: "星界碎片",
  mythicEssence: "神话精粹",
  abyssShard: "深渊残片",
  abyssCore: "深渊精华",
  aries_card: "白羊座圣卡",
  taurus_card: "金牛座圣卡",
  gemini_card: "双子座圣卡",
  cancer_card: "巨蟹座圣卡",
  leo_card: "狮子座圣卡",
  virgo_card: "处女座圣卡",
  libra_card: "天秤座圣卡",
  scorpio_card: "天蝎座圣卡",
  sagittarius_card: "射手座圣卡",
  capricorn_card: "摩羯座圣卡",
  aquarius_card: "水瓶座圣卡",
  pisces_card: "双鱼座圣卡",
  grassEssence: "青草首领魂",
  forestEssence: "森林首领魂",
  sewerEssence: "下水道首领魂",
  desertEssence: "沙漠首领魂",
  orcEssence: "兽人首领魂",
  mineEssence: "矿洞首领魂",
  clockEssence: "钟塔首领魂",
  glastEssence: "古城首领魂",
  abyssEssence: "深渊首领魂",
  skyEssence: "神殿首领魂",
  oridecon: "神之金属",
  elunium: "铝",
  bossSoul: "通用首领魂",
  bossCardShard: "Boss卡片碎片",
  enhanceProtect: "强化保护卷",
  enhanceAsh: "强化灰烬",
  darkGoldFragment: "暗金碎片",
  socketStone: "打孔石",
  advancedSocketStone: "高级打孔石",
  mythicSocketStone: "神话打孔石",
  cardRemover: "卡片拆除器",
};

const legendMaterials = ["ancientCore", "starShard", "abyssCore", "mythicEssence", "masterCraftVoucher"];
const epicMaterials = ["crystal", "rune", "abyssShard", "rareOre", "craftingComponent"];
const rareMaterials = ["ore", "tierOre", "refinedOre", "weaponEmbryo", "armorEmbryo", "accessoryEmbryo"];

export const MATERIAL_DB = Object.fromEntries(
  Object.entries(materialNames).map(([id, name]) => [
    id,
    {
      id,
      name,
      rarity: legendMaterials.includes(id) ? "legend" : epicMaterials.includes(id) ? "epic" : rareMaterials.includes(id) ? "rare" : "normal",
      type: "material",
      description: "装备分解、精造、赋能和套装打造材料。",
    },
  ]),
);

// Attach to window for legacy game.js access
window.materialNames = materialNames;
window.MATERIAL_DB = MATERIAL_DB;
