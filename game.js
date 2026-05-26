// [EXTRACTED] Top-level config constants moved to data.js (loaded before game.js in index.html).
// See data.js for: SAVE_KEY, DIFFICULTY_CONFIG, VIP_*, SHOP_ITEMS, CODEX_*, ENHANCE_*, etc.

const maps = [
  {
    id: "grass",
    name: "南门青草地",
    enemy: "果冻波波",
    boss: "青草地首领 · 巨型波波",
    bossSkill: "弹跳重压",
    baseHp: 520,
    gold: 11,
    baseExp: 12,
    jobExp: 10,
    bossMultiplier: 18,
    palette: ["#bfe4d2", "#7dbb87", "#52785a"],
  },
  {
    id: "forest",
    name: "斑光森林",
    enemy: "蘑菇巡游者",
    boss: "森林首领 · 树心看守",
    bossSkill: "藤蔓缠绕",
    baseHp: 2600,
    gold: 35,
    baseExp: 34,
    jobExp: 31,
    bossMultiplier: 22,
    palette: ["#b9ddc4", "#628f69", "#315441"],
  },
  {
    id: "mine",
    name: "蓝晶矿洞",
    enemy: "矿灯蝙蝠",
    boss: "矿洞首领 · 水晶甲虫",
    bossSkill: "晶壳反震",
    baseHp: 11000,
    gold: 96,
    baseExp: 92,
    jobExp: 86,
    bossMultiplier: 26,
    palette: ["#c7d7de", "#6f8fa0", "#456e91"],
  },
  {
    id: "clock",
    name: "旧钟塔回廊",
    enemy: "齿轮侍从",
    boss: "钟塔首领 · 整点守钟人",
    bossSkill: "逆时钟回响",
    baseHp: 46000,
    gold: 260,
    baseExp: 280,
    jobExp: 250,
    bossMultiplier: 30,
    palette: ["#d8ccb9", "#a97958", "#684b40"],
  },
  {
    id: "sky",
    name: "浮岛神殿",
    enemy: "星羽守卫",
    boss: "神殿首领 · 云阶执政官",
    bossSkill: "星辉审判",
    baseHp: 180000,
    gold: 720,
    baseExp: 760,
    jobExp: 690,
    bossMultiplier: 34,
    palette: ["#d7e5ef", "#8fa9c8", "#6a5f9f"],
  },
];

const extraMaps = [
  {
    id: "sewer",
    name: "普隆德拉下水道",
    enemy: "盗虫幼虫",
    boss: "下水道首领 · 黄金盗虫",
    bossSkill: "黄金甲壳",
    baseHp: 5600,
    gold: 86,
    baseExp: 140,
    jobExp: 120,
    bossMultiplier: 24,
    palette: ["#c4d0c8", "#718473", "#3f4d46"],
  },
  {
    id: "desert",
    name: "梦罗克沙漠",
    enemy: "沙漠幼狼",
    boss: "沙漠首领 · 蝎王",
    bossSkill: "毒尾穿刺",
    baseHp: 12500,
    gold: 145,
    baseExp: 210,
    jobExp: 180,
    bossMultiplier: 26,
    palette: ["#ead7a2", "#b98b4a", "#6f4b2b"],
  },
  {
    id: "orc_village",
    name: "兽人村落",
    enemy: "兽人战士",
    boss: "兽人首领 · 兽人英雄",
    bossSkill: "英雄怒吼",
    baseHp: 25000,
    gold: 220,
    baseExp: 330,
    jobExp: 290,
    bossMultiplier: 28,
    palette: ["#c8d2a4", "#768b4c", "#3c4b2e"],
  },
  {
    id: "glast_heim",
    name: "古城废墟",
    enemy: "幽灵剑士",
    boss: "古城首领 · 黑暗领主",
    bossSkill: "黑暗审判",
    baseHp: 185000,
    gold: 620,
    baseExp: 980,
    jobExp: 880,
    bossMultiplier: 32,
    palette: ["#d4ccd1", "#796778", "#3e3445"],
  },
  {
    id: "abyss_lake",
    name: "深渊湖",
    enemy: "蓝龙幼体",
    boss: "深渊首领 · 远古巨龙",
    bossSkill: "龙息洪流",
    baseHp: 420000,
    gold: 980,
    baseExp: 1450,
    jobExp: 1280,
    bossMultiplier: 34,
    palette: ["#bdd9e5", "#527f98", "#263e5f"],
  },
];

const mapOrder = ["grass", "forest", "sewer", "desert", "orc_village", "mine", "clock", "glast_heim", "abyss_lake", "sky"];
extraMaps.forEach((map) => {
  if (!maps.some((entry) => entry.id === map.id)) maps.push(map);
});
maps.sort((a, b) => mapOrder.indexOf(a.id) - mapOrder.indexOf(b.id));

const mapLevelRanges = {
  grass: { minLevel: 1, maxLevel: 10, recommendedPower: 80, attackRange: [3, 14] },
  forest: { minLevel: 8, maxLevel: 20, recommendedPower: 240, attackRange: [12, 38] },
  mine: { minLevel: 52, maxLevel: 70, recommendedPower: 3200, attackRange: [110, 240] },
  clock: { minLevel: 68, maxLevel: 88, recommendedPower: 5200, attackRange: [170, 360] },
  sky: { minLevel: 120, maxLevel: 150, recommendedPower: 16500, attackRange: [760, 1450] },
  beginner_field: { minLevel: 1, maxLevel: 10, recommendedPower: 80, attackRange: [3, 12] },
  prontera_south: { minLevel: 8, maxLevel: 20, recommendedPower: 240, attackRange: [10, 28] },
  sewer: { minLevel: 18, maxLevel: 32, recommendedPower: 600, attackRange: [24, 72] },
  desert: { minLevel: 28, maxLevel: 45, recommendedPower: 1100, attackRange: [58, 140] },
  orc_village: { minLevel: 40, maxLevel: 58, recommendedPower: 2100, attackRange: [115, 260] },
  glast_heim_outside: { minLevel: 48, maxLevel: 70, recommendedPower: 3200, attackRange: [90, 160] },
  glast_heim_deep: { minLevel: 68, maxLevel: 90, recommendedPower: 5200, attackRange: [150, 260] },
  glast_heim: { minLevel: 84, maxLevel: 105, recommendedPower: 7800, attackRange: [230, 620] },
  abyss_lake: { minLevel: 100, maxLevel: 125, recommendedPower: 11500, attackRange: [430, 1100] },
  abyss_temple: { minLevel: 88, maxLevel: 120, recommendedPower: 11000, attackRange: [240, 420] },
};

function monsterTemplate(id, name, levelRange, hpRange, attackRange, defenseRange, baseExpRange, jobExpRange, goldRange, type = "normal") {
  return { id, name, type, levelRange, hpRange, attackRange, defenseRange, baseExpRange, jobExpRange, goldRange };
}

const mapMonsterConfig = {
  grass: {
    name: "南门青草地",
    enemy: "果冻波波",
    boss: "下水道首领 · 黄金盗虫",
    bossSkill: "逆时钟回响",
    recommendedPower: 80,
    monsters: [
      monsterTemplate("grass_poring", "果冻波波", [1, 5], [120, 260], [3, 8], [1, 3], [8, 14], [6, 12], [6, 12]),
      monsterTemplate("grass_leaf_bug", "绿叶虫", [3, 8], [180, 360], [5, 11], [2, 4], [10, 18], [8, 14], [8, 14]),
      monsterTemplate("grass_lunatic", "疯兔幼崽", [5, 10], [260, 520], [8, 14], [3, 6], [14, 24], [10, 18], [10, 18], "elite"),
    ],
    bossTemplate: monsterTemplate("grass_boss_poring", "青草地首领 · 巨型波波", [10, 10], [2500, 2500], [22, 22], [8, 8], [140, 140], [110, 110], [90, 90], "boss"),
  },
  forest: {
    name: "斑光森林",
    enemy: "蘑菇巡游者",
    boss: "森林首领 · 树心看守",
    bossSkill: "藤蔓缠绕",
    recommendedPower: 240,
    monsters: [
      monsterTemplate("forest_mushroom", "蘑菇巡游者", [8, 14], [600, 1200], [12, 24], [6, 12], [28, 48], [24, 42], [20, 36]),
      monsterTemplate("forest_wolf", "森林小狼", [12, 18], [850, 1600], [18, 32], [8, 15], [38, 62], [32, 52], [28, 48]),
      monsterTemplate("forest_spore", "毒孢子", [15, 20], [1000, 2100], [22, 38], [10, 18], [48, 78], [40, 68], [36, 58], "elite"),
    ],
    bossTemplate: monsterTemplate("forest_boss_guardian", "森林首领 · 树心看守", [20, 20], [12000, 12000], [55, 55], [28, 28], [520, 520], [430, 430], [260, 260], "boss"),
  },
  sewer: {
    name: "普隆德拉下水道",
    enemy: "盗虫幼虫",
    boss: "下水道首领 · 黄金盗虫",
    bossSkill: "黄金甲壳",
    recommendedPower: 600,
    monsters: [
      monsterTemplate("sewer_bug_larva", "盗虫幼虫", [18, 24], [1800, 3600], [24, 45], [14, 26], [65, 110], [55, 95], [42, 76]),
      monsterTemplate("sewer_black_rat", "黑鼠", [22, 28], [2600, 5200], [34, 58], [18, 32], [85, 145], [70, 125], [55, 92]),
      monsterTemplate("sewer_poison_mushroom", "毒蘑菇", [26, 32], [3600, 6800], [45, 72], [24, 40], [110, 180], [90, 150], [70, 115], "elite"),
    ],
    bossTemplate: monsterTemplate("sewer_boss_golden_bug", "下水道首领 · 黄金盗虫", [32, 32], [42000, 42000], [115, 115], [70, 70], [1500, 1500], [1250, 1250], [620, 620], "boss"),
  },
  desert: {
    name: "梦罗克沙漠",
    enemy: "沙漠幼狼",
    boss: "沙漠首领 · 蝎王",
    bossSkill: "毒尾穿刺",
    recommendedPower: 1100,
    monsters: [
      monsterTemplate("desert_wolf", "沙漠幼狼", [28, 35], [5000, 9000], [58, 90], [32, 50], [150, 235], [125, 205], [95, 145]),
      monsterTemplate("desert_magnolia", "魔锅蛋", [34, 40], [6800, 12500], [72, 115], [42, 65], [190, 300], [160, 260], [120, 180]),
      monsterTemplate("desert_scorpion", "沙漠蝎", [38, 45], [9000, 16000], [90, 140], [55, 82], [240, 380], [205, 320], [150, 230], "elite"),
    ],
    bossTemplate: monsterTemplate("desert_boss_scorpion_king", "沙漠首领 · 蝎王", [45, 45], [88000, 88000], [210, 210], [120, 120], [2600, 2600], [2150, 2150], [1100, 1100], "boss"),
  },
  orc_village: {
    name: "兽人村落",
    enemy: "兽人战士",
    boss: "兽人首领 · 兽人英雄",
    bossSkill: "英雄怒吼",
    recommendedPower: 2100,
    monsters: [
      monsterTemplate("orc_warrior", "兽人战士", [40, 48], [13000, 23000], [115, 175], [75, 115], [300, 470], [250, 410], [180, 270]),
      monsterTemplate("orc_archer", "兽人弓手", [46, 54], [11000, 21000], [135, 205], [65, 100], [340, 540], [290, 470], [210, 320]),
      monsterTemplate("orc_brave", "兽人勇士", [52, 58], [18000, 32000], [170, 260], [100, 155], [430, 680], [360, 590], [260, 390], "elite"),
    ],
    bossTemplate: monsterTemplate("orc_boss_hero", "兽人首领 · 兽人英雄", [58, 58], [180000, 180000], [380, 380], [220, 220], [5200, 5200], [4300, 4300], [2100, 2100], "boss"),
  },
  mine: {
    name: "蓝晶矿洞",
    enemy: "矿灯蝙蝠",
    boss: "矿洞首领 · 水晶甲虫",
    bossSkill: "晶壳反震",
    recommendedPower: 3200,
    monsters: [
      monsterTemplate("mine_bat", "矿灯蝙蝠", [18, 25], [2200, 4200], [30, 55], [16, 28], [80, 135], [70, 118], [58, 92]),
      monsterTemplate("mine_beetle", "蓝晶甲虫", [24, 32], [3600, 7200], [42, 72], [24, 40], [115, 190], [98, 165], [82, 132]),
      monsterTemplate("mine_golem", "矿洞傀儡", [30, 35], [6000, 11000], [60, 95], [38, 60], [155, 250], [132, 215], [110, 170], "elite"),
    ],
    bossTemplate: monsterTemplate("mine_boss_crystal", "矿洞首领 · 水晶甲虫", [35, 35], [55000, 55000], [130, 130], [85, 85], [1800, 1800], [1450, 1450], [760, 760], "boss"),
  },
  clock: {
    name: "旧钟塔回廊",
    enemy: "齿轮侍从",
    boss: "钟塔首领 · 整点守钟人",
    bossSkill: "逆时钟回响",
    recommendedPower: 5200,
    monsters: [
      monsterTemplate("clock_gear", "齿轮侍从", [48, 56], [18000, 32000], [95, 150], [70, 110], [250, 380], [220, 330], [190, 280]),
      monsterTemplate("clock_ghost", "钟摆幽灵", [55, 64], [24000, 44000], [120, 190], [85, 135], [330, 500], [290, 430], [240, 360]),
      monsterTemplate("clock_guard", "逆时针守卫", [62, 70], [36000, 62000], [150, 240], [110, 170], [440, 660], [380, 560], [320, 470], "elite"),
    ],
    bossTemplate: monsterTemplate("clock_boss_keeper", "钟塔首领 · 整点守钟人", [70, 70], [280000, 280000], [360, 360], [260, 260], [6200, 6200], [5200, 5200], [2600, 2600], "boss"),
  },
  glast_heim: {
    name: "古城废墟",
    enemy: "幽灵剑士",
    boss: "古城首领 · 黑暗领主",
    bossSkill: "黑暗审判",
    recommendedPower: 7800,
    monsters: [
      monsterTemplate("glast_ghost_swordman", "幽灵剑士", [84, 92], [70000, 125000], [230, 360], [160, 250], [760, 1140], [680, 1020], [540, 760]),
      monsterTemplate("glast_abyss_knight", "深渊骑士", [92, 100], [95000, 180000], [310, 480], [220, 340], [980, 1480], [860, 1320], [680, 980]),
      monsterTemplate("glast_wraith", "古城恶灵", [100, 105], [120000, 240000], [390, 620], [260, 420], [1250, 1880], [1100, 1650], [820, 1180], "elite"),
    ],
    bossTemplate: monsterTemplate("glast_boss_dark_lord", "古城首领 · 黑暗领主", [105, 105], [950000, 950000], [900, 900], [650, 650], [14500, 14500], [12200, 12200], [6000, 6000], "boss"),
  },
  abyss_lake: {
    name: "深渊湖",
    enemy: "蓝龙幼体",
    boss: "深渊首领 · 远古巨龙",
    bossSkill: "龙息洪流",
    recommendedPower: 11500,
    monsters: [
      monsterTemplate("abyss_blue_dragon", "蓝龙幼体", [100, 110], [150000, 280000], [430, 680], [320, 520], [1150, 1720], [1010, 1520], [820, 1180]),
      monsterTemplate("abyss_dragonkin", "深渊龙人", [108, 118], [210000, 390000], [560, 850], [420, 680], [1450, 2180], [1280, 1920], [1050, 1500]),
      monsterTemplate("abyss_wyvern", "古代飞龙", [116, 125], [300000, 560000], [720, 1100], [560, 860], [1880, 2820], [1650, 2480], [1350, 1900], "elite"),
    ],
    bossTemplate: monsterTemplate("abyss_boss_ancient_dragon", "深渊首领 · 远古巨龙", [125, 125], [2600000, 2600000], [1600, 1600], [1200, 1200], [26000, 26000], [22000, 22000], [11000, 11000], "boss"),
  },
  sky: {
    name: "浮岛神殿",
    enemy: "星羽守卫",
    boss: "神殿首领 · 云阶执政官",
    bossSkill: "星辉审判",
    recommendedPower: 16500,
    monsters: [
      monsterTemplate("sky_guard", "星羽守卫", [88, 98], [90000, 160000], [260, 420], [180, 280], [720, 1080], [640, 960], [620, 860]),
      monsterTemplate("sky_priest", "云阶祭司", [96, 108], [120000, 220000], [340, 560], [230, 360], [920, 1380], [820, 1220], [760, 1080]),
      monsterTemplate("sky_judge", "神殿审判者", [108, 120], [180000, 340000], [480, 760], [320, 520], [1180, 1760], [1050, 1560], [980, 1380], "elite"),
    ],
    bossTemplate: monsterTemplate("sky_boss_archon", "神殿首领 · 云阶执政官", [120, 120], [1600000, 1600000], [1100, 1100], [850, 850], [18000, 18000], [15000, 15000], [7800, 7800], "boss"),
  },
};

Object.assign(mapMonsterConfig, {
  mine: {
    name: "蓝晶矿洞",
    enemy: "矿灯蝙蝠",
    boss: "矿洞首领 · 水晶甲虫",
    bossSkill: "晶壳反震",
    recommendedPower: 3200,
    monsters: [
      monsterTemplate("mine_bat", "矿灯蝙蝠", [52, 58], [22000, 42000], [110, 175], [80, 125], [420, 620], [360, 540], [260, 380]),
      monsterTemplate("mine_beetle", "蓝晶甲虫", [58, 65], [34000, 68000], [150, 220], [110, 170], [560, 840], [480, 720], [340, 500]),
      monsterTemplate("mine_golem", "矿洞傀儡", [64, 70], [52000, 98000], [190, 300], [150, 230], [720, 1080], [620, 930], [440, 640], "elite"),
    ],
    bossTemplate: monsterTemplate("mine_boss_crystal", "矿洞首领 · 水晶甲虫", [70, 70], [360000, 360000], [460, 460], [320, 320], [7600, 7600], [6200, 6200], [3000, 3000], "boss"),
  },
  clock: {
    name: "旧钟塔回廊",
    enemy: "齿轮侍从",
    boss: "钟塔首领 · 整点守钟人",
    bossSkill: "逆时钟回响",
    recommendedPower: 5200,
    monsters: [
      monsterTemplate("clock_gear", "齿轮侍从", [68, 74], [52000, 94000], [170, 270], [130, 200], [650, 980], [560, 850], [420, 620]),
      monsterTemplate("clock_ghost", "钟摆幽灵", [74, 82], [68000, 128000], [220, 330], [160, 250], [820, 1240], [720, 1080], [540, 780]),
      monsterTemplate("clock_guard", "逆时针守卫", [82, 88], [90000, 170000], [280, 430], [210, 330], [1050, 1580], [920, 1380], [700, 980], "elite"),
    ],
    bossTemplate: monsterTemplate("clock_boss_keeper", "钟塔首领 · 整点守钟人", [88, 88], [680000, 680000], [720, 720], [520, 520], [11500, 11500], [9600, 9600], [4700, 4700], "boss"),
  },
  sky: {
    name: "浮岛神殿",
    enemy: "星羽守卫",
    boss: "神殿首领 · 云阶执政官",
    bossSkill: "星辉审判",
    recommendedPower: 16500,
    monsters: [
      monsterTemplate("sky_guard", "星羽守卫", [120, 130], [380000, 680000], [760, 1120], [620, 900], [1850, 2780], [1650, 2480], [1400, 1980]),
      monsterTemplate("sky_priest", "云阶祭司", [130, 140], [520000, 920000], [960, 1320], [760, 1080], [2350, 3520], [2050, 3080], [1780, 2480]),
      monsterTemplate("sky_judge", "神殿审判者", [140, 150], [720000, 1280000], [1180, 1650], [920, 1320], [2900, 4350], [2550, 3820], [2200, 3080], "elite"),
    ],
    bossTemplate: monsterTemplate("sky_boss_archon", "神殿首领 · 云阶执政官", [150, 150], [5200000, 5200000], [2400, 2400], [1800, 1800], [42000, 42000], [36000, 36000], [18000, 18000], "boss"),
  },
});

const MAP_EXP_BALANCE = {
  grass: { base: [8, 24], job: [6, 18], bossBase: 140, bossJob: 110 },
  forest: { base: [30, 85], job: [26, 72], bossBase: 520, bossJob: 430 },
  sewer: { base: [80, 180], job: [65, 155], bossBase: 1300, bossJob: 1050 },
  desert: { base: [150, 320], job: [125, 270], bossBase: 2600, bossJob: 2100 },
  orc_village: { base: [260, 520], job: [220, 450], bossBase: 5200, bossJob: 4300 },
  mine: { base: [420, 760], job: [360, 660], bossBase: 8500, bossJob: 7200 },
  clock: { base: [680, 1180], job: [580, 1020], bossBase: 14500, bossJob: 12200 },
  glast_heim: { base: [1050, 1780], job: [900, 1550], bossBase: 24500, bossJob: 20500 },
  abyss_lake: { base: [1600, 2650], job: [1380, 2300], bossBase: 42000, bossJob: 35000 },
  sky: { base: [2300, 3800], job: [2000, 3300], bossBase: 72000, bossJob: 60000 },
};

applyMapExpBalance();

maps.forEach((map) => {
  const aliases = { grass: "grass", forest: "forest", mine: "mine", clock: "clock", sky: "sky" };
  const range = mapLevelRanges[aliases[map.id] || map.id] || mapLevelRanges.beginner_field;
  const monsterConfig = mapMonsterConfig[map.id] || {};
  Object.assign(map, {
    ...monsterConfig,
    minLevel: range.minLevel,
    maxLevel: range.maxLevel,
    recommendedPower: monsterConfig.recommendedPower || range.recommendedPower,
  });
});

function applyMapExpBalance() {
  Object.entries(MAP_EXP_BALANCE).forEach(([mapId, balance]) => {
    const config = mapMonsterConfig[mapId];
    if (!config) return;
    const monsters = config.monsters || [];
    monsters.forEach((monster, index) => {
      const start = index / Math.max(1, monsters.length);
      const end = (index + 1) / Math.max(1, monsters.length);
      monster.baseExpRange = sliceBalanceRange(balance.base, start, end);
      monster.jobExpRange = sliceBalanceRange(balance.job, start, end);
    });
    if (config.bossTemplate) {
      config.bossTemplate.baseExpRange = [balance.bossBase, balance.bossBase];
      config.bossTemplate.jobExpRange = [balance.bossJob, balance.bossJob];
    }
  });
}

function sliceBalanceRange(range, start, end) {
  const min = Math.round(range[0] + (range[1] - range[0]) * start);
  const max = Math.round(range[0] + (range[1] - range[0]) * end);
  return [min, Math.max(min, max)];
}

const jobTemplates = {
  novice: {
    id: "novice",
    name: "初学者",
    role: "front",
    baseDps: 4.8,
    baseHp: 150,
    baseDef: 3,
    baseAspd: 0.28,
    color: "#7d8b83",
    growth: { atkPct: 0.018, matkPct: 0.018, hpPct: 0.026, defPct: 0.018, aspdPct: 0.003 },
    skills: [
      skill("基础修炼", 1, "被动", "掌握最基本的武器和防具用法。", { atkPct: 0.04, defPct: 0.04 }),
      skill("急救", 3, "被动", "旅途中处理轻伤，提高生存能力。", { hpPct: 0.08 }),
      skill("投掷石头", 5, "主动", "丢出石块造成一次物理伤害。", { active: { stat: "atk", multiplier: 1.25, chance: 0.075 } }),
      skill("装死", 8, "被动", "用夸张的倒地姿势规避危险。", { defPct: 0.1, dropPct: 0.01 }),
    ],
  },
  swordman: {
    id: "swordman",
    name: "剑士",
    role: "front",
    baseDps: 7.6,
    baseHp: 230,
    baseDef: 9,
    baseAspd: 0.38,
    color: "#5d7fba",
    growth: { atkPct: 0.038, matkPct: 0.004, hpPct: 0.052, defPct: 0.045, aspdPct: 0.004 },
    skills: [
      skill("剑术修炼", 1, "被动", "提高近战武器熟练度。", { atkPct: 0.12 }),
      skill("狂击", 3, "主动", "以武器重击目标，威力受物攻影响。", { active: { stat: "atk", multiplier: 2.25, chance: 0.065 } }),
      skill("挑衅", 5, "主动", "激怒敌人露出破绽，造成伤害并提高输出。", { dpsPct: 0.04, active: { stat: "atk", multiplier: 1.45, chance: 0.05 } }),
      skill("快速回复", 8, "被动", "提高生命与防御。", { hpPct: 0.16, defPct: 0.08 }),
      skill("霸体训练", 10, "被动", "减少战斗停顿。", { aspdPct: 0.04 }),
    ],
  },
  mage: {
    id: "mage",
    name: "魔法师",
    role: "mid",
    baseDps: 8.4,
    baseHp: 145,
    baseDef: 3,
    baseAspd: 0.31,
    color: "#8b64a7",
    growth: { atkPct: 0.004, matkPct: 0.056, hpPct: 0.026, defPct: 0.018, aspdPct: 0.003 },
    skills: [
      skill("火箭术", 1, "主动", "凝聚火焰攻击，威力受魔攻影响。", { active: { stat: "matk", multiplier: 2.45, chance: 0.07 } }),
      skill("冰箭术", 3, "主动", "以冰箭贯穿目标，威力受魔攻影响。", { active: { stat: "matk", multiplier: 2.05, chance: 0.055 } }),
      skill("禅心", 5, "被动", "提高魔攻与金币收益。", { matkPct: 0.12, goldPct: 0.04 }),
      skill("火焰之壁", 8, "被动", "用魔力形成防护。", { defPct: 0.08, hpPct: 0.06 }),
      skill("圣灵召唤", 10, "主动", "召唤魔力光弹连续轰击。", { active: { stat: "matk", multiplier: 3.2, chance: 0.028 } }),
    ],
  },
  archer: {
    id: "archer",
    name: "弓箭手",
    role: "back",
    baseDps: 7.2,
    baseHp: 170,
    baseDef: 5,
    baseAspd: 0.42,
    color: "#5e9662",
    growth: { atkPct: 0.044, matkPct: 0.004, hpPct: 0.032, defPct: 0.024, aspdPct: 0.006 },
    skills: [
      skill("苍鹰之眼", 1, "被动", "提高远程精准度与暴击。", { atkPct: 0.08, critPct: 0.02 }),
      skill("二连矢", 3, "主动", "连续射出两箭，威力受物攻影响。", { active: { stat: "atk", multiplier: 2.15, chance: 0.075 } }),
      skill("心神凝聚", 5, "被动", "提高物攻与攻速。", { atkPct: 0.08, aspdPct: 0.04 }),
      skill("箭雨", 8, "主动", "向区域倾泻箭矢。", { active: { stat: "atk", multiplier: 1.8, chance: 0.05 } }),
      skill("精准射击", 10, "被动", "提高暴击与掉宝。", { critPct: 0.025, dropPct: 0.018 }),
    ],
  },
  acolyte: {
    id: "acolyte",
    name: "服事",
    role: "mid",
    baseDps: 6.2,
    baseHp: 185,
    baseDef: 6,
    baseAspd: 0.34,
    color: "#d4a85d",
    growth: { atkPct: 0.012, matkPct: 0.036, hpPct: 0.042, defPct: 0.036, aspdPct: 0.003 },
    skills: [
      skill("天使之赐福", 1, "被动", "祝福自身，提高物攻、魔攻与防御。", { atkPct: 0.05, matkPct: 0.05, defPct: 0.06 }),
      skill("治愈术", 3, "主动", "释放圣光治疗并伤害魔物，威力受魔攻影响。", { hpPct: 0.08, active: { stat: "matk", multiplier: 1.7, chance: 0.06 } }),
      skill("加速术", 5, "被动", "提高行动速度。", { aspdPct: 0.05 }),
      skill("钝器熟练", 8, "被动", "提高物攻与生命。", { atkPct: 0.08, hpPct: 0.08 }),
      skill("神圣之光", 10, "主动", "以神圣光芒攻击敌人。", { active: { stat: "matk", multiplier: 2.7, chance: 0.035 } }),
    ],
  },
  merchant: {
    id: "merchant",
    name: "商人",
    role: "front",
    baseDps: 6.8,
    baseHp: 210,
    baseDef: 7,
    baseAspd: 0.33,
    color: "#ba8750",
    growth: { atkPct: 0.032, matkPct: 0.006, hpPct: 0.042, defPct: 0.032, aspdPct: 0.003 },
    skills: [
      skill("低价买进", 1, "被动", "更会过日子，金币收益提高。", { goldPct: 0.08 }),
      skill("手推车攻击", 3, "主动", "用手推车撞击敌人，威力受物攻影响。", { active: { stat: "atk", multiplier: 2.35, chance: 0.06 } }),
      skill("露天商店", 5, "被动", "提高金币与掉宝收益。", { goldPct: 0.08, dropPct: 0.02 }),
      skill("强化手推车", 8, "被动", "提高物攻与防御。", { atkPct: 0.1, defPct: 0.08 }),
      skill("金钱攻击", 10, "主动", "把金币的气势砸向敌人。", { active: { stat: "atk", multiplier: 3.0, chance: 0.028 } }),
    ],
  },
  thief: {
    id: "thief",
    name: "盗贼",
    role: "back",
    baseDps: 7.4,
    baseHp: 165,
    baseDef: 4,
    baseAspd: 0.46,
    color: "#56637f",
    growth: { atkPct: 0.04, matkPct: 0.004, hpPct: 0.03, defPct: 0.02, aspdPct: 0.007 },
    skills: [
      skill("二刀连击", 1, "主动", "快速追加一次攻击，威力受物攻影响。", { active: { stat: "atk", multiplier: 1.9, chance: 0.09 } }),
      skill("残影", 3, "被动", "提高攻速与防御。", { aspdPct: 0.05, defPct: 0.05 }),
      skill("偷窃", 5, "被动", "提高掉宝概率。", { dropPct: 0.035 }),
      skill("施毒", 8, "主动", "用毒刃造成伤害，威力受物攻影响。", { active: { stat: "atk", multiplier: 2.25, chance: 0.04 } }),
      skill("隐匿突袭", 10, "主动", "从阴影中发动重击。", { critPct: 0.03, active: { stat: "atk", multiplier: 3.1, chance: 0.026 } }),
    ],
  },
};

const firstJobs = ["swordman", "mage", "archer", "acolyte", "merchant", "thief"];

const secondJobMap = {
  swordman: "knight",
  mage: "wizard",
  archer: "hunter",
  acolyte: "priest",
  merchant: "blacksmith",
  thief: "assassin",
};

const advancedSecondJobMap = {
  swordman: "lordKnight",
  mage: "highWizard",
  archer: "sniper",
  acolyte: "highPriest",
  merchant: "whiteSmith",
  thief: "assassinCross",
};

const thirdJobMap = {
  knight: "runeKnight",
  lordKnight: "runeKnight",
  wizard: "warlock",
  highWizard: "warlock",
  hunter: "ranger",
  sniper: "ranger",
  priest: "archbishop",
  highPriest: "archbishop",
  blacksmith: "mechanic",
  whiteSmith: "mechanic",
  assassin: "guillotineCross",
  assassinCross: "guillotineCross",
};

const secondJobTemplates = {
  knight: { id: "knight", name: "骑士", from: "swordman", role: "front", growth: { str: 1.35, agi: 0.9, vit: 1.35, int: 0.35, dex: 0.75, luk: 0.45 }, baseDps: 11.4, baseHp: 340, baseDef: 15, baseAspd: 0.42 },
  wizard: { id: "wizard", name: "巫师", from: "mage", role: "mid", growth: { str: 0.25, agi: 0.45, vit: 0.65, int: 1.65, dex: 1.0, luk: 0.45 }, baseDps: 12.6, baseHp: 210, baseDef: 6, baseAspd: 0.34 },
  hunter: { id: "hunter", name: "猎人", from: "archer", role: "back", growth: { str: 0.65, agi: 1.35, vit: 0.75, int: 0.45, dex: 1.55, luk: 0.85 }, baseDps: 11.2, baseHp: 250, baseDef: 8, baseAspd: 0.48 },
  priest: { id: "priest", name: "牧师", from: "acolyte", role: "mid", growth: { str: 0.45, agi: 0.55, vit: 1.05, int: 1.45, dex: 0.9, luk: 0.7 }, baseDps: 9.6, baseHp: 285, baseDef: 10, baseAspd: 0.38 },
  blacksmith: { id: "blacksmith", name: "铁匠", from: "merchant", role: "front", growth: { str: 1.45, agi: 0.75, vit: 1.2, int: 0.35, dex: 0.9, luk: 0.75 }, baseDps: 10.9, baseHp: 320, baseDef: 13, baseAspd: 0.38 },
  assassin: { id: "assassin", name: "刺客", from: "thief", role: "back", growth: { str: 1.0, agi: 1.6, vit: 0.65, int: 0.25, dex: 0.95, luk: 1.1 }, baseDps: 11.7, baseHp: 245, baseDef: 7, baseAspd: 0.55 },
};

Object.entries(secondJobTemplates).forEach(([id, job]) => {
  const parent = jobTemplates[job.from];
  jobTemplates[id] = {
    ...parent,
    ...job,
    color: parent.color,
    growth: { ...parent.growth, ...job.growth },
    skills: [
      ...parent.skills,
      skill(`${job.name}精通`, 1, "被动", `${job.name}职业训练，提高核心战斗属性。`, { atkPct: 0.1, matkPct: id === "wizard" || id === "priest" ? 0.12 : 0, hpPct: 0.08 }),
      skill(`${job.name}奥义`, 10, "主动", `${job.name}进阶技能，威力随 JOB 成长。`, { active: { stat: id === "wizard" || id === "priest" ? "matk" : "atk", multiplier: 3.8, chance: 0.035 } }),
    ],
  };
});

const advancedJobs = {
  lordKnight: ["领主骑士", "knight", 1.22],
  highWizard: ["超魔导士", "wizard", 1.22],
  sniper: ["神射手", "hunter", 1.22],
  highPriest: ["神官", "priest", 1.22],
  whiteSmith: ["神工匠", "blacksmith", 1.22],
  assassinCross: ["十字刺客", "assassin", 1.22],
  runeKnight: ["卢恩骑士", "knight", 1.45],
  warlock: ["大法师", "wizard", 1.45],
  ranger: ["游侠", "hunter", 1.45],
  archbishop: ["大主教", "priest", 1.45],
  mechanic: ["机匠", "blacksmith", 1.45],
  guillotineCross: ["十字斩首者", "assassin", 1.45],
};

Object.entries(advancedJobs).forEach(([id, [name, parentId, scale]]) => {
  const parent = jobTemplates[parentId];
  jobTemplates[id] = {
    ...parent,
    id,
    name,
    baseDps: parent.baseDps * scale,
    baseHp: parent.baseHp * scale,
    baseDef: parent.baseDef * scale,
    baseAspd: Math.min(0.62, parent.baseAspd + 0.03),
    growth: Object.fromEntries(Object.entries(parent.growth).map(([key, value]) => [key, typeof value === "number" ? value * scale : value])),
    skills: [
      ...parent.skills,
      skill(`${name}精通`, 1, "被动", `${name}职业训练。`, { atkPct: 0.14, matkPct: parentId === "wizard" || parentId === "priest" ? 0.14 : 0, hpPct: 0.1 }),
      skill(`${name}奥义`, 12, "主动", `${name}高阶技能，威力随 JOB 成长。`, { active: { stat: parentId === "wizard" || parentId === "priest" ? "matk" : "atk", multiplier: 4.6 * scale, chance: 0.03 } }),
    ],
  };
});

const jobAttributeProfiles = {
  novice: { label: "STR / DEX", scaling: { str: 0.006, dex: 0.004 } },
  swordman: { label: "STR / VIT / DEX", scaling: { str: 0.015, vit: 0.006, dex: 0.004 } },
  knight: { label: "STR / VIT / DEX", scaling: { str: 0.017, vit: 0.008, dex: 0.004 } },
  lordKnight: { label: "STR / VIT / DEX", scaling: { str: 0.019, vit: 0.009, dex: 0.005 } },
  runeKnight: { label: "STR / VIT / DEX", scaling: { str: 0.021, vit: 0.01, dex: 0.006 } },
  mage: { label: "INT / DEX", scaling: { int: 0.018, dex: 0.006 } },
  wizard: { label: "INT / DEX", scaling: { int: 0.021, dex: 0.008 } },
  highWizard: { label: "INT / DEX", scaling: { int: 0.023, dex: 0.009 } },
  warlock: { label: "INT / DEX", scaling: { int: 0.026, dex: 0.01 } },
  archer: { label: "DEX / AGI / LUK", scaling: { dex: 0.016, agi: 0.008, luk: 0.004 } },
  hunter: { label: "DEX / AGI / LUK", scaling: { dex: 0.018, agi: 0.01, luk: 0.006 } },
  sniper: { label: "DEX / AGI / LUK", scaling: { dex: 0.02, agi: 0.011, luk: 0.007 } },
  ranger: { label: "DEX / AGI / LUK", scaling: { dex: 0.023, agi: 0.012, luk: 0.008 } },
  acolyte: { label: "INT / VIT / DEX", scaling: { int: 0.014, vit: 0.008, dex: 0.004 } },
  priest: { label: "INT / VIT / DEX", scaling: { int: 0.017, vit: 0.01, dex: 0.005 } },
  highPriest: { label: "INT / VIT / DEX", scaling: { int: 0.019, vit: 0.011, dex: 0.006 } },
  archbishop: { label: "INT / VIT / DEX", scaling: { int: 0.022, vit: 0.012, dex: 0.007 } },
  merchant: { label: "STR / VIT / LUK", scaling: { str: 0.014, vit: 0.007, luk: 0.004 } },
  blacksmith: { label: "STR / VIT / LUK", scaling: { str: 0.018, vit: 0.009, luk: 0.006 } },
  whiteSmith: { label: "STR / VIT / LUK", scaling: { str: 0.02, vit: 0.01, luk: 0.007 } },
  mechanic: { label: "STR / VIT / LUK", scaling: { str: 0.023, vit: 0.011, luk: 0.008 } },
  thief: { label: "AGI / LUK / STR", scaling: { agi: 0.014, luk: 0.008, str: 0.004 } },
  assassin: { label: "AGI / LUK / STR", scaling: { agi: 0.018, luk: 0.011, str: 0.006 } },
  assassinCross: { label: "AGI / LUK / STR", scaling: { agi: 0.02, luk: 0.012, str: 0.007 } },
  guillotineCross: { label: "AGI / LUK / STR", scaling: { agi: 0.023, luk: 0.014, str: 0.008 } },
};

applyJobSkillScaling();

function applyJobSkillScaling() {
  Object.values(jobTemplates).forEach((job) => {
    const profile = jobAttributeProfiles[job.id] || jobAttributeProfiles[job.from] || jobAttributeProfiles.novice;
    job.skills = job.skills.map((entry) => {
      const next = { ...entry };
      if (!next.description.includes("属性关联")) next.description = `${next.description} 属性关联：${profile.label}。`;
      if (next.active) {
        next.active = {
          ...next.active,
          attributeScaling: { ...profile.scaling, ...(next.active.attributeScaling || {}) },
        };
      }
      return next;
    });
  });
}

const itemPool = [
  { name: "枫木短剑", slot: "weapon", rarity: "normal", atk: 9, matk: 0, def: 0, aspd: 0.01, luck: 0, gold: 0, crit: 0, drop: 0 },
  { name: "学徒法杖", slot: "weapon", rarity: "normal", atk: 2, matk: 12, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0 },
  { name: "猎风弓", slot: "weapon", rarity: "rare", atk: 21, matk: 0, def: 0, aspd: 0.05, luck: 2, gold: 0.03, crit: 0.03, drop: 0 },
  { name: "白银细剑", slot: "weapon", rarity: "rare", atk: 26, matk: 0, def: 1, aspd: 0.03, luck: 1, gold: 0.03, crit: 0.04, drop: 0 },
  { name: "星砂权杖", slot: "weapon", rarity: "epic", atk: 4, matk: 46, def: 0, aspd: 0, luck: 4, gold: 0.08, crit: 0.04, drop: 0.02 },
  { name: "晨辉重剑", slot: "weapon", rarity: "legend", atk: 78, matk: 8, def: 5, aspd: -0.02, luck: 6, gold: 0.12, crit: 0.07, drop: 0.04 },
  { name: "旅人披风", slot: "armor", rarity: "normal", atk: 0, matk: 0, def: 8, aspd: 0, luck: 1, gold: 0.03, crit: 0, drop: 0 },
  { name: "绿纹夹克", slot: "armor", rarity: "rare", atk: 2, matk: 0, def: 18, aspd: 0.02, luck: 2, gold: 0.07, crit: 0, drop: 0.01 },
  { name: "蓝晶护甲", slot: "armor", rarity: "epic", atk: 0, matk: 8, def: 42, aspd: 0, luck: 4, gold: 0.1, crit: 0.01, drop: 0.02 },
  { name: "钟楼礼装", slot: "armor", rarity: "legend", atk: 8, matk: 16, def: 64, aspd: 0.03, luck: 8, gold: 0.16, crit: 0.02, drop: 0.04 },
  { name: "草叶发带", slot: "headgear", rarity: "normal", atk: 1, matk: 1, def: 3, aspd: 0.01, luck: 2, gold: 0.02, crit: 0, drop: 0.01 },
  { name: "蓝晶头冠", slot: "headgear", rarity: "epic", atk: 5, matk: 18, def: 12, aspd: 0.02, luck: 8, gold: 0.08, crit: 0.02, drop: 0.04 },
  { name: "疾行短靴", slot: "shoes", rarity: "rare", atk: 3, matk: 0, def: 8, aspd: 0.07, luck: 1, gold: 0.05, crit: 0.01, drop: 0.01 },
  { name: "星尘长靴", slot: "shoes", rarity: "epic", atk: 7, matk: 7, def: 16, aspd: 0.09, luck: 5, gold: 0.08, crit: 0.02, drop: 0.03 },
  { name: "幸运铃铛", slot: "trinket", rarity: "rare", atk: 0, matk: 0, def: 2, aspd: 0.02, luck: 12, gold: 0.1, crit: 0.02, drop: 0.03 },
  { name: "露恩徽章", slot: "trinket", rarity: "epic", atk: 10, matk: 10, def: 8, aspd: 0.03, luck: 14, gold: 0.16, crit: 0.04, drop: 0.04 },
  { name: "星界罗盘", slot: "trinket", rarity: "legend", atk: 20, matk: 20, def: 16, aspd: 0.05, luck: 22, gold: 0.24, crit: 0.06, drop: 0.07 },
];

const equipmentTiers = [
  { id: "normal", name: "普通", weight: 520, scale: 0.92, rolls: [0.82, 1.04], affixes: 0, extra: {} },
  { id: "fine", name: "精良", weight: 260, scale: 1.12, rolls: [0.88, 1.1], affixes: 1, extra: { hp: [10, 24] } },
  { id: "rare", name: "稀有", weight: 125, scale: 1.38, rolls: [0.92, 1.16], affixes: 2, extra: { luck: [2, 7] } },
  { id: "epic", name: "史诗", weight: 58, scale: 1.72, rolls: [0.96, 1.22], affixes: 3, extra: { crit: [0.01, 0.035] } },
  { id: "ancient", name: "古代", weight: 24, scale: 2.18, rolls: [1.0, 1.3], affixes: 4, extra: { drop: [0.015, 0.05], gold: [0.03, 0.08] } },
  { id: "legend", name: "传说", weight: 8, scale: 2.85, rolls: [1.08, 1.42], affixes: 5, extra: { crit: [0.03, 0.08], drop: [0.035, 0.09], gold: [0.06, 0.14] } },
];

equipmentTiers.push({ id: "darkGold", name: "暗金", weight: 1, scale: 3.85, rolls: [1.2, 1.62], affixes: 6, extra: { crit: [0.05, 0.12], drop: [0.05, 0.12], gold: [0.1, 0.2] } });
equipmentTiers.push({ id: "mythic", name: "神话", weight: 0.2, scale: 5.2, rolls: [1.35, 1.85], affixes: 7, extra: { crit: [0.08, 0.16], drop: [0.08, 0.16], gold: [0.14, 0.26] } });

const ITEM_TIER_CONFIG = {
  tier1: { minLevel: 1, maxLevel: 20, scale: 1.0 },
  tier2: { minLevel: 21, maxLevel: 40, scale: 1.45 },
  tier3: { minLevel: 41, maxLevel: 60, scale: 2.1 },
  tier4: { minLevel: 61, maxLevel: 80, scale: 3.0 },
  tier5: { minLevel: 81, maxLevel: 100, scale: 4.2 },
  tier6: { minLevel: 101, maxLevel: 130, scale: 5.8 },
  tier7: { minLevel: 131, maxLevel: 160, scale: 7.5 },
  tier8: { minLevel: 161, maxLevel: 190, scale: 9.5 },
  tier9: { minLevel: 191, maxLevel: 220, scale: 12 },
};

const ITEM_TIER_LIST = Object.entries(ITEM_TIER_CONFIG).map(([id, config]) => ({ id, ...config }));

const SLOT_LEVEL_GROWTH = {
  weapon: 0.045,
  armor: 0.038,
  headgear: 0.032,
  shoes: 0.034,
  trinket: 0.035,
};

const SLOT_ROLE_DESCRIPTIONS = {
  weapon: "武器定位：ATK / MATK / ASPD，容易出现暴击、破甲、技能伤害、对怪物伤害。",
  armor: "防具定位：DEF / HP / HP%，容易出现减伤、闪避、生命恢复和抗性。",
  headgear: "头饰定位：DEF / 六维属性，容易出现经验收益、战力百分比和小幅技能伤害。",
  shoes: "鞋子定位：DEF / 闪避 / 生命恢复，容易出现攻速、巡逻效率和恢复强化。",
  trinket: "饰品定位：六维、暴击伤害、金币、掉率、卡片和材料收益。",
};

const AFFIX_TIERS = {
  flat: {
    atk: { label: "锐利", range: [12, 32] },
    matk: { label: "秘法", range: [12, 32] },
    def: { label: "坚固", range: [8, 24] },
    hp: { label: "生命", range: [80, 220] },
    hpRegen: { label: "复苏", range: [2, 8] },
    dodgeRate: { label: "灵动", range: [0.004, 0.016], cap: 0.05 },
    aspd: { label: "迅捷", range: [0.006, 0.024], cap: 0.08 },
    str: { label: "力量", range: [2, 6] },
    agi: { label: "敏捷", range: [2, 6] },
    vit: { label: "体质", range: [2, 6] },
    int: { label: "智力", range: [2, 6] },
    dex: { label: "灵巧", range: [2, 6] },
    luk: { label: "幸运", range: [2, 6] },
    gold: { label: "富足", range: [0.008, 0.025], cap: 0.12 },
    drop: { label: "寻宝", range: [0.006, 0.02], cap: 0.1 },
    equipmentDrop: { label: "鉴宝", range: [0.004, 0.014], cap: 0.08 },
    cardDrop: { label: "占星", range: [0.003, 0.012], cap: 0.06 },
    crit: { label: "会心", range: [0.006, 0.022], cap: 0.08 },
    critDamageBonus: { label: "锐意", range: [0.02, 0.06], cap: 0.24 },
  },
  percent: {
    atkPct: { label: "武勇", range: [0.018, 0.045], cap: 0.16 },
    matkPct: { label: "魔导", range: [0.018, 0.045], cap: 0.16 },
    hpPct: { label: "坚韧", range: [0.03, 0.075], cap: 0.24 },
    defPct: { label: "铁壁", range: [0.025, 0.065], cap: 0.22 },
    attackSpeedPct: { label: "疾风", range: [0.018, 0.045], cap: 0.16 },
    critRatePct: { label: "洞察", range: [0.012, 0.032], cap: 0.12 },
    critDamageBonus: { label: "锐利", range: [0.035, 0.09], cap: 0.32 },
    skillDamageBonus: { label: "咏唱", range: [0.025, 0.07], cap: 0.24 },
    monsterDamageBonus: { label: "猎魔", range: [0.025, 0.075], cap: 0.25 },
    bossDamageBonus: { label: "讨伐", range: [0.02, 0.065], cap: 0.22 },
    ignoreDefense: { label: "破甲", range: [0.015, 0.045], cap: 0.18 },
    damageReductionPct: { label: "守护", range: [0.015, 0.045], cap: 0.16 },
    dodgeRatePct: { label: "轻身", range: [0.012, 0.035], cap: 0.12 },
    hpRegenPct: { label: "回春", range: [0.04, 0.12], cap: 0.35 },
    baseExpBonus: { label: "研习", range: [0.025, 0.07], cap: 0.22 },
    jobExpBonus: { label: "历练", range: [0.025, 0.07], cap: 0.22 },
    powerPct: { label: "斗志", range: [0.015, 0.04], cap: 0.12 },
    materialQuantityBonus: { label: "采集", range: [0.025, 0.075], cap: 0.25 },
    equipmentDrop: { label: "鉴宝", range: [0.01, 0.03], cap: 0.12 },
    cardDrop: { label: "占星", range: [0.008, 0.025], cap: 0.1 },
    gold: { label: "富足", range: [0.02, 0.06], cap: 0.18 },
    drop: { label: "寻宝", range: [0.015, 0.045], cap: 0.16 },
    combatPaceBonus: { label: "巡猎", range: [0.01, 0.035], cap: 0.1 },
    patrolEfficiency: { label: "巡逻", range: [0.015, 0.045], cap: 0.15 },
  },
};

const MECHANIC_AFFIXES = {
  echo: { label: "回响", description: "主动技能释放时有 5% 概率额外释放一次。", effects: { echoChance: 0.05 }, slots: ["weapon", "headgear", "trinket"] },
  greed: { label: "贪婪", description: "击杀变异怪时有 3% 概率使普通材料数量翻倍。", effects: { mutationMaterialDoubleChance: 0.03 }, slots: ["trinket", "shoes"] },
  thorn: { label: "荆棘", description: "受到怪物攻击时，将 VIT 的 150% 转化为反击伤害。", effects: { thornVitMultiplier: 1.5 }, slots: ["armor"] },
  breaker: { label: "破军", description: "攻击时无视怪物 8% 防御。", effects: { ignoreDefense: 0.08 }, slots: ["weapon", "trinket"] },
  starlight: { label: "星辉", description: "BASE / JOB 经验收益 +8%。", effects: { baseExpBonus: 0.08, jobExpBonus: 0.08 }, slots: ["headgear", "trinket"] },
  recovery: { label: "复苏", description: "生命恢复效果 +15%。", effects: { hpRegenPct: 0.15 }, slots: ["armor", "shoes"] },
};

const SLOT_AFFIX_POOLS = {
  weapon: {
    flat: ["atk", "matk", "aspd", "crit", "str", "int", "dex"],
    percent: ["atkPct", "matkPct", "attackSpeedPct", "critRatePct", "critDamageBonus", "ignoreDefense", "skillDamageBonus", "monsterDamageBonus", "bossDamageBonus"],
    mechanic: ["echo", "breaker"],
  },
  armor: {
    flat: ["def", "hp", "hpRegen", "vit", "dodgeRate"],
    percent: ["hpPct", "defPct", "damageReductionPct", "dodgeRatePct", "hpRegenPct"],
    mechanic: ["thorn", "recovery"],
  },
  headgear: {
    flat: ["def", "str", "agi", "vit", "int", "dex", "luk"],
    percent: ["baseExpBonus", "jobExpBonus", "powerPct", "skillDamageBonus", "matkPct", "critRatePct"],
    mechanic: ["echo", "starlight"],
  },
  shoes: {
    flat: ["def", "hpRegen", "dodgeRate", "agi", "vit"],
    percent: ["attackSpeedPct", "patrolEfficiency", "combatPaceBonus", "hpRegenPct", "dodgeRatePct", "hpPct"],
    mechanic: ["greed", "recovery"],
  },
  trinket: {
    flat: ["str", "agi", "vit", "int", "dex", "luk", "critDamageBonus", "gold", "drop"],
    percent: ["critDamageBonus", "gold", "drop", "equipmentDrop", "cardDrop", "materialQuantityBonus", "monsterDamageBonus", "baseExpBonus", "jobExpBonus"],
    mechanic: ["echo", "greed", "breaker", "starlight"],
  },
};

const salvageRewards = {
  normal: { dust: [1, 2] },
  fine: { dust: [2, 4], ore: [1, 1] },
  rare: { ore: [2, 4], crystal: [1, 1] },
  epic: { crystal: [2, 4], rune: [1, 2] },
  ancient: { rune: [3, 5], ancientCore: [1, 2] },
  legend: { ancientCore: [2, 4], starShard: [1, 2] },
};
salvageRewards.darkGold = { ancientCore: [4, 7], starShard: [2, 4] };
salvageRewards.mythic = { ancientCore: [8, 12], starShard: [4, 8], mythicEssence: [1, 2] };

const materialNames = {
  dust: "研磨粉",
  ore: "精炼矿",
  crystal: "蓝晶碎片",
  rune: "露恩石",
  ancientCore: "古代核心",
  starShard: "星界碎片",
  mythicEssence: "神话精粹",
  darkGoldFragment: "暗金碎片",
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
  socketStone: "打孔石",
  advancedSocketStone: "高级打孔石",
  mythicSocketStone: "神话打孔石",
  cardRemover: "卡片拆除器",
  enhanceProtect: "强化保护卷",
  enhanceAsh: "强化灰烬",
};

const MATERIAL_DB = Object.fromEntries(
  Object.entries(materialNames).map(([id, name]) => [
    id,
    {
      id,
      name,
      rarity: ["ancientCore", "starShard", "abyssCore", "mythicEssence"].includes(id) ? "legend" : ["crystal", "rune", "abyssShard"].includes(id) ? "epic" : ["ore"].includes(id) ? "rare" : "normal",
      type: "material",
      description: "装备分解、精造、赋能和套装打造材料。",
    },
  ]),
);
Object.entries(ZODIAC_CARD_BY_SET).forEach(([, materialId]) => {
  MATERIAL_DB[materialId] = {
    id: materialId,
    name: materialNames[materialId] || materialId,
    rarity: "legend",
    type: "zodiac_card",
    description: "分解对应星座套装部件获得，可用于打造星座时装。",
  };
});
MATERIAL_DB.mythicEssence = {
  id: "mythicEssence",
  name: materialNames.mythicEssence,
  rarity: "mythic",
  type: "material",
  description: "神话装备分解获得的高阶材料。",
};
MATERIAL_DB.darkGoldFragment = {
  id: "darkGoldFragment",
  name: materialNames.darkGoldFragment,
  rarity: "darkGold",
  type: "material",
  description: "高级 Boss 与深渊 Boss 掉落，可在铁匠铺兑换暗金装备。",
};
["socketStone", "advancedSocketStone", "mythicSocketStone", "cardRemover"].forEach((id) => {
  MATERIAL_DB[id] = {
    id,
    name: materialNames[id],
    rarity: id === "mythicSocketStone" ? "mythic" : id === "advancedSocketStone" ? "legend" : "epic",
    type: "socket_material",
    description: id === "cardRemover" ? "拆除装备卡槽中的卡片，卡片会回到卡片背包。" : "装备打孔材料，用于开启卡片镶嵌槽。",
  };
});

const COSTUME_DB = {
  athena_wings: {
    id: "athena_wings",
    name: "雅典娜之翼",
    slot: "back",
    rarity: "mythic",
    image: "assets/images/costumes/athena_wings.png",
    description: "由十二星座圣卡共同铸成的神圣羽翼。",
    effects: {
      baseExpBonus: 0.08,
      jobExpBonus: 0.08,
      goldBonus: 0.08,
      monsterDamageBonus: 0.05,
    },
    cost: {
      aries_card: 1,
      taurus_card: 1,
      gemini_card: 1,
      cancer_card: 1,
      leo_card: 1,
      virgo_card: 1,
      libra_card: 1,
      scorpio_card: 1,
      sagittarius_card: 1,
      capricorn_card: 1,
      aquarius_card: 1,
      pisces_card: 1,
    },
    uniqueCraft: true,
  },
};

const bossEssenceByMap = ["grassEssence", "forestEssence", "sewerEssence", "desertEssence", "orcEssence", "mineEssence", "clockEssence", "glastEssence", "abyssEssence", "skyEssence"];
const monsterSpriteSources = {
  grass: {
    normal: "普通",
    boss: "下水道首领 · 黄金盗虫",
  },
  forest: {
    normal: "普通",
    boss: "assets/images/monsters/boss_forest_guardian.png",
  },
  mine: {
    normal: "普通",
    boss: "assets/images/monsters/boss_crystal_beetle.png",
  },
  clock: {
    normal: "普通",
    boss: "钟塔首领 · 整点守钟人",
  },
  sky: {
    normal: "普通",
    boss: "神殿首领 · 云阶执政官",
  },
};
const monsterSpriteCache = {};
const attributeKeys = ["str", "agi", "vit", "int", "dex", "luk"];
const randomStatRanges = {
  normal: [0, 2],
  fine: [0, 3],
  rare: [4, 8],
  epic: [8, 16],
  ancient: [14, 24],
  legend: [20, 40],
};
randomStatRanges.darkGold = [45, 80];
randomStatRanges.mythic = [80, 140];
const PLAYER_CRIT_RATE_CAP = 1.0;
const battleStatConfig = {
  physical: { str: 2, dex: 0.5 },
  magic: { int: 2, dex: 0.4 },
  hpPerVit: 20,
  hpPerLevel: 10,
  defensePerVit: 0.5,
  hpRegenBase: 1,
  hpRegenPerVit: 0.2,
  hpRegenPerLevel: 0.05,
  aspdPerAgi: 0.01,
  dodgePerAgi: 0.002,
  dodgePerLevel: 0.0005,
  critPerDex: 0.0005,
  critPerLuk: 0.001,
  dropPerLuk: 0.0005,
  maxCrit: PLAYER_CRIT_RATE_CAP,
  maxDodge: 0.6,
  minAspd: 0.16,
  maxAspd: 0.95,
};
const SKILL_MAX_LEVEL = 30;
const SKILL_EXP_REQUIREMENTS = [0, 20, 45, 80, 130, 200, 300, 440, 620, 850, 1150, 1500, 1950, 2500, 3200, 4100, 5200, 6600, 8300, 10400, 13000, 16200, 20200, 25000, 31000, 38500, 47500, 58500, 72000, 88000];
const SKILL_MILESTONES = [15, 20, 25, 30];
const SKILL_MILESTONE_BONUSES = {
  novice: [
    { milestoneMult: 0.05, hpPct: 0.03 },
    { milestoneMult: 0.08, baseExpBonus: 0.05 },
    { milestoneMult: 0.10 },
    { milestoneMult: 0.15, atkPct: 0.03, matkPct: 0.03 },
  ],
  swordman: [
    { milestoneMult: 0.05 },
    { milestoneMult: 0.08 },
    { milestoneMult: 0.10, hpPct: 0.03 },
    { milestoneMult: 0.15, eliteDamageBonus: 0.08 },
  ],
  mage: [
    { milestoneMult: 0.05 },
    { milestoneMult: 0.08, skillDamageBonus: 0.05 },
    { milestoneMult: 0.10, abyssDamageBonus: 0.05 },
    { milestoneMult: 0.15, echoChance: 0.05 },
  ],
  archer: [
    { milestoneMult: 0.05, aspdPct: 0.03 },
    { milestoneMult: 0.08, critDamageBonus: 0.08 },
    { milestoneMult: 0.10 },
    { milestoneMult: 0.15, critDamageBonus: 0.12 },
  ],
  acolyte: [
    { milestoneMult: 0.05, hpRegenPct: 0.08 },
    { milestoneMult: 0.08 },
    { milestoneMult: 0.10, hpPct: 0.05 },
    { milestoneMult: 0.15, damageReductionPct: 0.05 },
  ],
  merchant: [
    { milestoneMult: 0.05, goldBonus: 0.05 },
    { milestoneMult: 0.08 },
    { milestoneMult: 0.10, materialQuantityBonus: 0.05 },
    { milestoneMult: 0.15, goldBonus: 0.08 },
  ],
  thief: [
    { milestoneMult: 0.05, dropPct: 0.03 },
    { milestoneMult: 0.08, critRatePct: 0.03 },
    { milestoneMult: 0.10 },
    { milestoneMult: 0.15, rareDropBonus: 0.03 },
  ],
};
const SKILL_MILESTONE_BONUSES_BY_SKILL = {
  [skillIdFor("基础修炼", 1, "被动")]: [
    { desc: "基础攻防更扎实", milestoneMult: 0.04, atkPct: 0.02, defPct: 0.02 },
    { desc: "旅途经验吸收提高", milestoneMult: 0.06, baseExpBonus: 0.03, jobExpBonus: 0.03 },
    { desc: "全能修炼成型", milestoneMult: 0.08, hpPct: 0.03 },
    { desc: "初心者潜能觉醒", milestoneMult: 0.12, atkPct: 0.03, matkPct: 0.03, damageReductionPct: 0.02 },
  ],
  [skillIdFor("急救", 3, "被动")]: [
    { desc: "生命训练强化", milestoneMult: 0.04, hpPct: 0.04 },
    { desc: "恢复技巧稳定", milestoneMult: 0.06, hpRegenPct: 0.08 },
    { desc: "危急处理熟练", milestoneMult: 0.08, damageReductionPct: 0.015 },
    { desc: "野外救护专家", milestoneMult: 0.12, hpPct: 0.06, hpRegenPct: 0.12 },
  ],
  [skillIdFor("投掷石头", 5, "主动")]: [
    { desc: "投掷更精准", milestoneMult: 0.05 },
    { desc: "对普通魔物伤害提高", milestoneMult: 0.08, monsterDamageBonus: 0.04 },
    { desc: "弱点命中更稳定", milestoneMult: 0.1, skillDamageBonus: 0.03 },
    { desc: "石块也能砸出奇迹", milestoneMult: 0.15, bossDamageBonus: 0.05 },
  ],
  [skillIdFor("装死", 8, "被动")]: [
    { desc: "规避危险能力提高", milestoneMult: 0.04, defPct: 0.03 },
    { desc: "装得更像，掉宝更稳", milestoneMult: 0.06, dropPct: 0.015 },
    { desc: "濒危时更能撑住", milestoneMult: 0.08, damageReductionPct: 0.02 },
    { desc: "摸鱼大师", milestoneMult: 0.12, rareDropBonus: 0.02, hpPct: 0.04 },
  ],
  [skillIdFor("剑术修炼", 1, "被动")]: [
    { desc: "剑系物攻提高", milestoneMult: 0.04, atkPct: 0.04 },
    { desc: "Boss 破绽识别", milestoneMult: 0.06, bossDamageBonus: 0.03 },
    { desc: "剑压破防", milestoneMult: 0.08, ignoreDefense: 0.03 },
    { desc: "剑术大成", milestoneMult: 0.12, finalDamageBonus: 0.04, atkPct: 0.04 },
  ],
  [skillIdFor("狂击", 3, "主动")]: [
    { desc: "重击威力提高", milestoneMult: 0.05, bossDamageBonus: 0.03 },
    { desc: "STR 贯注，技能伤害提高", milestoneMult: 0.08, skillDamageBonus: 0.04 },
    { desc: "暴击时威力更高", milestoneMult: 0.1, critDamageBonus: 0.08 },
    { desc: "粉碎首领防线", milestoneMult: 0.15, bossDamageBonus: 0.08, eliteDamageBonus: 0.06 },
  ],
  [skillIdFor("挑衅", 5, "主动")]: [
    { desc: "破绽打击更稳定", milestoneMult: 0.05 },
    { desc: "削弱精英防守", milestoneMult: 0.08, eliteDamageBonus: 0.04 },
    { desc: "挑衅后输出节奏提高", milestoneMult: 0.1, finalDamageBonus: 0.025 },
    { desc: "首领怒火反成破绽", milestoneMult: 0.15, bossDamageBonus: 0.07 },
  ],
  [skillIdFor("快速回复", 8, "被动")]: [
    { desc: "生命训练强化", milestoneMult: 0.04, hpPct: 0.05 },
    { desc: "防御恢复提高", milestoneMult: 0.06, defPct: 0.03, hpRegenPct: 0.08 },
    { desc: "高压战斗更稳定", milestoneMult: 0.08, damageReductionPct: 0.02 },
    { desc: "钢铁体魄", milestoneMult: 0.12, hpPct: 0.08, defPct: 0.05 },
  ],
  [skillIdFor("霸体训练", 10, "被动")]: [
    { desc: "行动停顿减少", milestoneMult: 0.04, aspdPct: 0.025 },
    { desc: "受击后节奏更稳", milestoneMult: 0.06, damageReductionPct: 0.015 },
    { desc: "高压环境保持输出", milestoneMult: 0.08, eliteDamageBonus: 0.04 },
    { desc: "霸体成型", milestoneMult: 0.12, aspdPct: 0.04, bossDamageBonus: 0.04 },
  ],
  [skillIdFor("火箭术", 1, "主动")]: [
    { desc: "火焰凝聚提高", milestoneMult: 0.05, skillDamageBonus: 0.03 },
    { desc: "INT 贯注，魔法爆发提高", milestoneMult: 0.08, skillDamageBonus: 0.05 },
    { desc: "深渊火焰适应", milestoneMult: 0.1, abyssDamageBonus: 0.05 },
    { desc: "魔力回响", milestoneMult: 0.15, echoChance: 0.04 },
  ],
  [skillIdFor("冰箭术", 3, "主动")]: [
    { desc: "冰箭穿透提高", milestoneMult: 0.05 },
    { desc: "精英压制增强", milestoneMult: 0.08, eliteDamageBonus: 0.04 },
    { desc: "寒气削弱 Boss", milestoneMult: 0.1, bossDamageBonus: 0.05 },
    { desc: "极寒贯穿", milestoneMult: 0.15, skillDamageBonus: 0.06, ignoreDefense: 0.03 },
  ],
  [skillIdFor("禅心", 5, "被动")]: [
    { desc: "魔攻修炼加深", milestoneMult: 0.04, matkPct: 0.04 },
    { desc: "经验吸收提高", milestoneMult: 0.06, baseExpBonus: 0.04, jobExpBonus: 0.04 },
    { desc: "技能伤害提高", milestoneMult: 0.08, skillDamageBonus: 0.04 },
    { desc: "魔力循环完成", milestoneMult: 0.12, echoChance: 0.04, matkPct: 0.04 },
  ],
  [skillIdFor("火焰之壁", 8, "被动")]: [
    { desc: "魔力护壁更稳", milestoneMult: 0.04, defPct: 0.03 },
    { desc: "生命防护提高", milestoneMult: 0.06, hpPct: 0.04 },
    { desc: "深渊火壁适应", milestoneMult: 0.08, abyssDamageReduction: 0.03 },
    { desc: "烈焰屏障", milestoneMult: 0.12, damageReductionPct: 0.04 },
  ],
  [skillIdFor("圣灵召唤", 10, "主动")]: [
    { desc: "圣灵光弹强化", milestoneMult: 0.05 },
    { desc: "技能爆发提高", milestoneMult: 0.08, skillDamageBonus: 0.05 },
    { desc: "对深渊魔物更有效", milestoneMult: 0.1, abyssDamageBonus: 0.06 },
    { desc: "圣灵连锁回响", milestoneMult: 0.15, echoChance: 0.05 },
  ],
  [skillIdFor("苍鹰之眼", 1, "被动")]: [
    { desc: "远程物攻提高", milestoneMult: 0.04, atkPct: 0.03 },
    { desc: "暴击训练强化", milestoneMult: 0.06, critRatePct: 0.025 },
    { desc: "暴击伤害提高", milestoneMult: 0.08, critDamageBonus: 0.08 },
    { desc: "鹰眼锁定首领", milestoneMult: 0.12, bossDamageBonus: 0.05 },
  ],
  [skillIdFor("二连矢", 3, "主动")]: [
    { desc: "连射伤害提高", milestoneMult: 0.05 },
    { desc: "DEX 贯注，弱点射击", milestoneMult: 0.08, critDamageBonus: 0.08 },
    { desc: "攻速联动强化", milestoneMult: 0.1, skillChanceBonus: 0.06 },
    { desc: "首领贯穿射击", milestoneMult: 0.15, bossDamageBonus: 0.08 },
  ],
  [skillIdFor("心神凝聚", 5, "被动")]: [
    { desc: "攻击专注提高", milestoneMult: 0.04, atkPct: 0.03 },
    { desc: "攻速节奏提高", milestoneMult: 0.06, aspdPct: 0.03 },
    { desc: "暴击收益提高", milestoneMult: 0.08, critDamageBonus: 0.08 },
    { desc: "凝神贯通", milestoneMult: 0.12, finalDamageBonus: 0.035 },
  ],
  [skillIdFor("箭雨", 8, "主动")]: [
    { desc: "箭雨覆盖提高", milestoneMult: 0.05 },
    { desc: "清怪节奏提高", milestoneMult: 0.08, skillChanceBonus: 0.05 },
    { desc: "对变异怪更有效", milestoneMult: 0.1, eliteDamageBonus: 0.05 },
    { desc: "箭幕压制", milestoneMult: 0.15, monsterDamageBonus: 0.08 },
  ],
  [skillIdFor("精准射击", 10, "被动")]: [
    { desc: "暴击率提高", milestoneMult: 0.04, critRatePct: 0.025 },
    { desc: "掉宝瞄准提高", milestoneMult: 0.06, dropPct: 0.015 },
    { desc: "稀有目标识别", milestoneMult: 0.08, rareDropBonus: 0.025 },
    { desc: "精准猎手", milestoneMult: 0.12, bossDamageBonus: 0.04, critDamageBonus: 0.1 },
  ],
  [skillIdFor("天使之赐福", 1, "被动")]: [
    { desc: "祝福基础属性提高", milestoneMult: 0.04, atkPct: 0.02, matkPct: 0.02 },
    { desc: "防护祝福强化", milestoneMult: 0.06, defPct: 0.03 },
    { desc: "生命祝福强化", milestoneMult: 0.08, hpPct: 0.04 },
    { desc: "天使庇护", milestoneMult: 0.12, damageReductionPct: 0.035 },
  ],
  [skillIdFor("治愈术", 3, "主动")]: [
    { desc: "圣光伤害提高", milestoneMult: 0.05 },
    { desc: "释放时生命恢复更稳", milestoneMult: 0.08, hpRegenPct: 0.1 },
    { desc: "生存压力降低", milestoneMult: 0.1, damageReductionPct: 0.025 },
    { desc: "神圣循环", milestoneMult: 0.15, hpPct: 0.06 },
  ],
  [skillIdFor("加速术", 5, "被动")]: [
    { desc: "行动速度提高", milestoneMult: 0.04, aspdPct: 0.03 },
    { desc: "闪避节奏提高", milestoneMult: 0.06, dodgeRatePct: 0.03 },
    { desc: "挂机节奏更快", milestoneMult: 0.08, combatPaceBonus: 0.02 },
    { desc: "神速祝福", milestoneMult: 0.12, aspdPct: 0.05 },
  ],
  [skillIdFor("钝器熟练", 8, "被动")]: [
    { desc: "钝器物攻提高", milestoneMult: 0.04, atkPct: 0.03 },
    { desc: "体魄训练提高", milestoneMult: 0.06, hpPct: 0.04 },
    { desc: "首领打击更强", milestoneMult: 0.08, bossDamageBonus: 0.04 },
    { desc: "圣锤熟练", milestoneMult: 0.12, finalDamageBonus: 0.035 },
  ],
  [skillIdFor("神圣之光", 10, "主动")]: [
    { desc: "圣光威力提高", milestoneMult: 0.05 },
    { desc: "魔法技能伤害提高", milestoneMult: 0.08, skillDamageBonus: 0.04 },
    { desc: "对 Boss 圣光压制", milestoneMult: 0.1, bossDamageBonus: 0.05 },
    { desc: "神圣审判", milestoneMult: 0.15, eliteDamageBonus: 0.08 },
  ],
  [skillIdFor("低价买进", 1, "被动")]: [
    { desc: "金币收益提高", milestoneMult: 0.04, goldBonus: 0.04 },
    { desc: "材料使用更精明", milestoneMult: 0.06, materialQuantityBonus: 0.03 },
    { desc: "稀有交易嗅觉", milestoneMult: 0.08, rareDropBonus: 0.02 },
    { desc: "商道精通", milestoneMult: 0.12, goldBonus: 0.08 },
  ],
  [skillIdFor("手推车攻击", 3, "主动")]: [
    { desc: "推车冲击提高", milestoneMult: 0.05 },
    { desc: "VIT 提高手推车威力", milestoneMult: 0.08, skillDamageBonus: 0.035 },
    { desc: "对精英怪冲击更强", milestoneMult: 0.1, eliteDamageBonus: 0.05 },
    { desc: "重载冲撞", milestoneMult: 0.15, bossDamageBonus: 0.07 },
  ],
  [skillIdFor("露天商店", 5, "被动")]: [
    { desc: "金币收益提高", milestoneMult: 0.04, goldBonus: 0.04 },
    { desc: "物品掉率提高", milestoneMult: 0.06, dropPct: 0.015 },
    { desc: "材料收益提高", milestoneMult: 0.08, materialQuantityBonus: 0.04 },
    { desc: "名店招牌", milestoneMult: 0.12, rareDropBonus: 0.025 },
  ],
  [skillIdFor("强化手推车", 8, "被动")]: [
    { desc: "物攻防御提高", milestoneMult: 0.04, atkPct: 0.03 },
    { desc: "车体护甲强化", milestoneMult: 0.06, defPct: 0.04 },
    { desc: "高压搬运稳定", milestoneMult: 0.08, damageReductionPct: 0.02 },
    { desc: "重装手推车", milestoneMult: 0.12, hpPct: 0.05, atkPct: 0.04 },
  ],
  [skillIdFor("金钱攻击", 10, "主动")]: [
    { desc: "金钱气势增强", milestoneMult: 0.05 },
    { desc: "金币收益转化伤害", milestoneMult: 0.08, skillDamageBonus: 0.04 },
    { desc: "砸向首领更痛", milestoneMult: 0.1, bossDamageBonus: 0.06 },
    { desc: "财力压制", milestoneMult: 0.15, finalDamageBonus: 0.04 },
  ],
  [skillIdFor("二刀连击", 1, "主动")]: [
    { desc: "连击伤害提高", milestoneMult: 0.05 },
    { desc: "LUK 提高暴击收益", milestoneMult: 0.08, critDamageBonus: 0.08 },
    { desc: "攻速带动触发", milestoneMult: 0.1, skillChanceBonus: 0.06 },
    { desc: "十字连斩雏形", milestoneMult: 0.15, finalDamageBonus: 0.035 },
  ],
  [skillIdFor("残影", 3, "被动")]: [
    { desc: "攻速闪避提高", milestoneMult: 0.04, aspdPct: 0.03 },
    { desc: "防御姿态更灵活", milestoneMult: 0.06, defPct: 0.03 },
    { desc: "深渊闪避适应", milestoneMult: 0.08, abyssDamageReduction: 0.025 },
    { desc: "残影成型", milestoneMult: 0.12, damageReductionPct: 0.03, aspdPct: 0.04 },
  ],
  [skillIdFor("偷窃", 5, "被动")]: [
    { desc: "物品掉率提高", milestoneMult: 0.04, dropPct: 0.02 },
    { desc: "变异怪材料收益提高", milestoneMult: 0.06, materialQuantityBonus: 0.035 },
    { desc: "稀有装备嗅觉提高", milestoneMult: 0.08, rareDropBonus: 0.03 },
    { desc: "盗贼本能", milestoneMult: 0.12, dropPct: 0.025, rareDropBonus: 0.035 },
  ],
  [skillIdFor("施毒", 8, "主动")]: [
    { desc: "毒刃伤害提高", milestoneMult: 0.05 },
    { desc: "对精英怪毒性更强", milestoneMult: 0.08, eliteDamageBonus: 0.05 },
    { desc: "深渊毒性适应", milestoneMult: 0.1, abyssDamageBonus: 0.05 },
    { desc: "致命毒刃", milestoneMult: 0.15, finalDamageBonus: 0.04 },
  ],
  [skillIdFor("隐匿突袭", 10, "主动")]: [
    { desc: "突袭伤害提高", milestoneMult: 0.05, critDamageBonus: 0.06 },
    { desc: "暴击突袭强化", milestoneMult: 0.08, critDamageBonus: 0.1 },
    { desc: "首领背刺强化", milestoneMult: 0.1, bossDamageBonus: 0.06 },
    { desc: "暗影处决", milestoneMult: 0.15, abyssExecuteDamageBonus: 0.08 },
  ],
};
const imageExtensions = ["png", "gif", "webp"];
const rarityOrder = ["normal", "fine", "rare", "epic", "ancient", "legend", "darkGold", "mythic"];
const rarityDisplay = {
  normal: "普通",
  fine: "精良",
  rare: "稀有",
  epic: "史诗",
  ancient: "古代",
  legend: "传说",
};

rarityDisplay.darkGold = "暗金";
rarityDisplay.mythic = "神话";

const EQUIPMENT_SUBTYPE_LABELS = {
  sword: "单手剑",
  oneHandSword: "单手剑",
  twoHandSword: "双手剑",
  dagger: "短剑",
  spear: "长矛",
  axe: "斧",
  mace: "钝器",
  staff: "法杖",
  oneHandStaff: "法杖",
  bow: "弓",
  katar: "拳刃",
  book: "魔导书",
  knuckle: "拳套",
  cloth: "布甲",
  leather: "皮甲",
  mail: "锁甲",
  plate: "重甲",
  robe: "法袍",
  cap: "帽子",
  helm: "头盔",
  crown: "冠冕",
  mask: "面具",
  circlet: "发圈",
  boots: "长靴",
  shoes: "鞋",
  greaves: "护胫",
  sandals: "便鞋",
  ring: "戒指",
  necklace: "项链",
  earring: "耳饰",
  charm: "护符",
  brooch: "胸针",
};

function inferEquipmentSubType(item = {}) {
  if (item.subType && EQUIPMENT_SUBTYPE_LABELS[item.subType]) return item.subType;
  const type = item.weaponType || item.armorType || item.equipType || "";
  if (type && EQUIPMENT_SUBTYPE_LABELS[type]) return type;
  const name = String(item.name || "");
  const slot = normalizeEquipmentSlot(item.equipSlot || item.slot || "");
  if (slot === "weapon") {
    if (/短剑|匕首/.test(name)) return "dagger";
    if (/矛|枪/.test(name)) return "spear";
    if (/斧/.test(name)) return "axe";
    if (/锤|钉锤|权杖/.test(name)) return "mace";
    if (/杖|魔杖/.test(name)) return "staff";
    if (/弓/.test(name)) return "bow";
    if (/拳刃/.test(name)) return "katar";
    if (/书|魔导/.test(name)) return "book";
    if (/拳套/.test(name)) return "knuckle";
    if (/双手|巨剑|太刀|武士刀/.test(name)) return "twoHandSword";
    return "sword";
  }
  if (slot === "armor") {
    if (/袍/.test(name)) return "robe";
    if (/皮/.test(name)) return "leather";
    if (/锁|链/.test(name)) return "mail";
    if (/铠|甲/.test(name)) return "plate";
    return "cloth";
  }
  if (slot === "headgear") {
    if (/冠|王冠/.test(name)) return "crown";
    if (/盔|头盔/.test(name)) return "helm";
    if (/面具|面罩/.test(name)) return "mask";
    if (/发圈|发箍/.test(name)) return "circlet";
    return "cap";
  }
  if (slot === "shoes") {
    if (/护胫/.test(name)) return "greaves";
    if (/便鞋|拖鞋|凉鞋/.test(name)) return "sandals";
    if (/鞋/.test(name)) return "shoes";
    return "boots";
  }
  if (slot === "trinket") {
    if (/项链|吊坠|颈链/.test(name)) return "necklace";
    if (/耳/.test(name)) return "earring";
    if (/护符|印记/.test(name)) return "charm";
    if (/胸针|别针/.test(name)) return "brooch";
    return "ring";
  }
  return "";
}

function equipmentSubTypeName(item = {}) {
  const subType = inferEquipmentSubType(item);
  return subType ? EQUIPMENT_SUBTYPE_LABELS[subType] || subType : "";
}

const oneHandSwordPoolFiltered = [
  { id: "one_hand_sword_long_sword", name: "长剑", slot: "weapon", rarity: "normal", atk: 25, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_scimitar", name: "圆月刀", slot: "weapon", rarity: "normal", atk: 39, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_honor_sword", name: "荣誉宝剑", slot: "weapon", rarity: "normal", atk: 50, matk: 50, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_ceremonial_dagger", name: "祭礼短剑", slot: "weapon", rarity: "normal", atk: 60, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_piercing_sword", name: "击刺长剑", slot: "weapon", rarity: "rare", atk: 70, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_saber", name: "弯刀", slot: "weapon", rarity: "rare", atk: 85, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_round_hilt_saber", name: "圆柄马刀", slot: "weapon", rarity: "rare", atk: 100, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_p_cavalry_i", name: "P.骑兵剑Ⅰ", slot: "weapon", rarity: "rare", atk: 147, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_haedonggum", name: "海东剑", slot: "weapon", rarity: "epic", atk: 120, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 0, luk: 0 },
  { id: "one_hand_sword_katana", name: "日本刀", slot: "weapon", rarity: "epic", atk: 130, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_water_ripple", name: "水纹之剑", slot: "weapon", rarity: "epic", atk: 150, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_tremor", name: "战栗诡剑", slot: "weapon", rarity: "epic", atk: 190, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 5, agi: 5, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_boss_sword", name: "首领之剑", slot: "weapon", rarity: "legend", atk: 150, matk: 0, def: 2, aspd: 0, luck: 0, gold: 0, crit: 0.02, drop: 0.02, str: 2, agi: 2, vit: 2, int: 2, dex: 2, luk: 2 },
  { id: "one_hand_sword_crimson", name: "红莲剑", slot: "weapon", rarity: "legend", atk: 160, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 2, agi: 0, vit: 0, int: 2, dex: 0, luk: 0 },
  { id: "one_hand_sword_youjian_shiguang", name: "妖剑 弒光", slot: "weapon", rarity: "legend", atk: 170, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0.03, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 3, luk: 0 },
  { id: "one_hand_sword_false_belief", name: "虚伪信念长剑", slot: "weapon", rarity: "legend", atk: 210, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
].map((item) => ({
  weaponType: "oneHandSword",
  equipType: "oneHandSword",
  source: "monster_drop",
  quality: item.rarity,
  level: 1,
  requiredLevel: 1,
  requiredJob: [],
  allowedJobs: ["novice", "swordman", "knight", "lordKnight", "runeKnight", "merchant", "blacksmith", "whiteSmith", "mechanic", "thief", "assassin", "assassinCross", "guillotineCross"],
  image: `assets/images/equipment/${item.id}.png`,
  description: "单手剑武器池掉落装备。",
  ...item,
}));

const equipmentTemplateDb = Object.fromEntries(oneHandSwordPoolFiltered.map((item) => [item.id, item]));

const oneHandStaffPoolFiltered = [
  { name: "手杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "normal", atk: 15, matk: 30, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "橡木魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "normal", atk: 25, matk: 45, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 1, dex: 0, luk: 0 },
  { name: "智慧魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "normal", atk: 40, matk: 70, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 2, dex: 0, luk: 0 },
  { name: "P.魔杖Ⅰ", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "normal", atk: 60, matk: 125, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 2, dex: 0, luk: 0 },
  { name: "言灵魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "rare", atk: 60, matk: 95, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 0, luk: 0 },
  { name: "骷髅魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "rare", atk: 40, matk: 110, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 4, dex: 0, luk: 0 },
  { name: "生存的魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "rare", atk: 50, matk: 120, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 2, luk: 0 },
  { name: "圣杖 英灵", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "rare", atk: 75, matk: 105, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 0, luk: 0 },
  { name: "里奇的骷髅魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "epic", atk: 60, matk: 170, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 1, dex: 1, luk: 0 },
  { name: "锐利波之杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "epic", atk: 80, matk: 145, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 4, dex: 0, luk: 0 },
  { name: "水晶魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "epic", atk: 30, matk: 125, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 0, luk: 0 },
  { name: "魔法师的魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "epic", atk: 70, matk: 125, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 4, dex: 3, luk: 0 },
  { name: "邪恶权杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 60, matk: 120, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 5, dex: 0, luk: 0 },
  { name: "黑暗的荆棘骷髅杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 60, matk: 160, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 3, luk: 0 },
  { name: "销魂杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 80, matk: 170, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 2, luk: 0 },
  { name: "驱魔圣杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 50, matk: 140, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
];

const twoHandSwordPoolFiltered = [
  { name: "武士刀", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "normal", atk: 60, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "双手剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "normal", atk: 90, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "亚尔特剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "normal", atk: 115, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "双手重剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "normal", atk: 140, matk: 0, def: 5, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "P.双手剑Ⅰ", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "rare", atk: 162, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "P.双手剑Ⅱ", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "rare", atk: 185, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "双手巨剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "rare", atk: 160, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "十字巨剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "rare", atk: 180, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "克拉斯拿雅剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "epic", atk: 200, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "突袭队长的亚蓝斯之剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "epic", atk: 200, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0.2, drop: 0, str: 2, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "击砍魔神巨剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "epic", atk: 225, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "绯红色双手巨剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "epic", atk: 170, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "名刀 不知火", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "legend", atk: 155, matk: 0, def: 0, aspd: 0.08, luck: 0, gold: 0, crit: 0.3, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "秘刀 十六夜月", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "legend", atk: 200, matk: 0, def: 0, aspd: 2, luck: 0, gold: 0, crit: 0, drop: 0, str: -5, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "战神十字巨剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "legend", atk: 260, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "王室骑士巨剑", slot: "weapon", weaponType: "twoHandSword", equipType: "twoHandSword", rarity: "legend", atk: 280, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0.1, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
];

const bodyArmorPoolFiltered = [
  { name: "棉衬衫", slot: "body", armorType: "bodyArmor", rarity: "normal", def: 10 },
  { name: "皮制外套", slot: "body", armorType: "bodyArmor", rarity: "normal", def: 15 },
  { name: "冒险衣", slot: "body", armorType: "bodyArmor", rarity: "normal", def: 20 },
  { name: "大衣", slot: "body", armorType: "bodyArmor", rarity: "normal", def: 37 },
  { name: "铁制铠甲", slot: "body", armorType: "bodyArmor", rarity: "rare", def: 35 },
  { name: "钢铁锁子甲", slot: "body", armorType: "bodyArmor", rarity: "rare", def: 55 },
  { name: "钢铁铠甲", slot: "body", armorType: "bodyArmor", rarity: "rare", def: 70 },
  { name: "秘衣 美德", slot: "body", armorType: "bodyArmor", rarity: "rare", def: 59, int: 1 },
  { name: "变色龙铠甲", slot: "body", armorType: "bodyArmor", rarity: "epic", def: 55 },
  { name: "急速冲刺铠甲", slot: "body", armorType: "bodyArmor", rarity: "epic", def: 20, vit: 1 },
  { name: "那迦鳞片铠甲", slot: "body", armorType: "bodyArmor", rarity: "epic", atk: 20, def: 45 },
  { name: "生命链接", slot: "body", armorType: "bodyArmor", rarity: "epic", def: 75, vit: 2 },
  { name: "布林喜德", slot: "body", armorType: "bodyArmor", rarity: "legend", def: 120 },
  { name: "陈旧内裤", slot: "body", armorType: "bodyArmor", rarity: "legend", def: 60, str: 2, vit: 2 },
  { name: "华丽的勇士紫光外套", slot: "body", armorType: "bodyArmor", rarity: "legend", def: 10 },
  { name: "暴躁龙内衣", slot: "body", armorType: "bodyArmor", rarity: "legend", def: 20, agi: 5 },
];

const headTopPoolFiltered = [
  { name: "发箍", slot: "headTop", armorType: "headTop", rarity: "normal", def: 1 },
  { name: "方头巾", slot: "headTop", armorType: "headTop", rarity: "normal", def: 1 },
  { name: "猫耳发圈", slot: "headTop", armorType: "headTop", rarity: "normal", def: 2 },
  { name: "兔耳发圈", slot: "headTop", armorType: "headTop", rarity: "normal", def: 2, luk: 2 },
  { name: "圆帽", slot: "headTop", armorType: "headTop", rarity: "rare", def: 5 },
  { name: "无边帽", slot: "headTop", armorType: "headTop", rarity: "rare", def: 7 },
  { name: "金属头盔", slot: "headTop", armorType: "headTop", rarity: "rare", def: 13 },
  { name: "王冠", slot: "headTop", armorType: "headTop", rarity: "rare", def: 7, int: 2 },
  { name: "天使头盔", slot: "headTop", armorType: "headTop", rarity: "epic", def: 10, agi: 1, luk: 1 },
  { name: "厨师帽", slot: "headTop", armorType: "headTop", rarity: "epic", def: 3, dex: 1 },
  { name: "魔法师帽", slot: "headTop", armorType: "headTop", rarity: "epic", def: 2, int: 2 },
  { name: "矿坑安全帽", slot: "headTop", armorType: "headTop", rarity: "epic", def: 9, dex: 2 },
  { name: "哥夫内的头具", slot: "headTop", armorType: "headTop", rarity: "legend", def: 10, vit: 3 },
  { name: "鸟窝", slot: "headTop", armorType: "headTop", rarity: "legend", def: 2, agi: 2 },
  { name: "爱丽丝女仆娃娃", slot: "headTop", armorType: "headTop", rarity: "legend", def: 1, str: 1 },
  { name: "海盗船长帽", slot: "headTop", armorType: "headTop", rarity: "legend", def: 11, vit: 1 },
];

const shoesPoolFiltered = [
  { name: "轻便鞋", slot: "shoes", armorType: "shoes", rarity: "normal", def: 5 },
  { name: "长靴", slot: "shoes", armorType: "shoes", rarity: "normal", def: 10 },
  { name: "战士长靴", slot: "shoes", armorType: "shoes", rarity: "normal", def: 16 },
  { name: "玻璃鞋", slot: "shoes", armorType: "shoes", rarity: "normal", def: 5, luk: 5 },
  { name: "脚链", slot: "shoes", armorType: "shoes", rarity: "rare", def: 18 },
  { name: "重靴", slot: "shoes", armorType: "shoes", rarity: "rare", def: 27 },
  { name: "安全鞋", slot: "shoes", armorType: "shoes", rarity: "rare", def: 22 },
  { name: "兔子拖鞋", slot: "shoes", armorType: "shoes", rarity: "rare", def: 9, luk: 3 },
  { name: "傅里哥长靴", slot: "shoes", armorType: "shoes", rarity: "epic", def: 12, agi: 2 },
  { name: "迪塔乐长靴", slot: "shoes", armorType: "shoes", rarity: "epic", def: 13, vit: 5 },
  { name: "哥夫内军靴", slot: "shoes", armorType: "shoes", rarity: "epic", def: 13 },
  { name: "巴基力的长靴", slot: "shoes", armorType: "shoes", rarity: "epic", def: 13 },
  { name: "史雷普尼尔之靴", slot: "shoes", armorType: "shoes", rarity: "legend", def: 40, int: 25 },
  { name: "变形长靴", slot: "shoes", armorType: "shoes", rarity: "legend", def: 10 },
  { name: "城战重靴", slot: "shoes", armorType: "shoes", rarity: "legend", def: 30 },
  { name: "阴暗步行长靴", slot: "shoes", armorType: "shoes", rarity: "legend", def: 0 },
];

const accessoryPoolFiltered = [
  { name: "力量戒指", slot: "accessory", armorType: "accessory", rarity: "normal", str: 2 },
  { name: "智力耳环", slot: "accessory", armorType: "accessory", rarity: "normal", int: 2 },
  { name: "体力项链", slot: "accessory", armorType: "accessory", rarity: "normal", vit: 2 },
  { name: "防御手套", slot: "accessory", armorType: "accessory", rarity: "normal", dex: 2 },
  { name: "敏捷别针", slot: "accessory", armorType: "accessory", rarity: "rare", agi: 2 },
  { name: "幸运珠链", slot: "accessory", armorType: "accessory", rarity: "rare", luk: 2 },
  { name: "防御戒指", slot: "accessory", armorType: "accessory", rarity: "rare", def: 3 },
  { name: "潜能戒指", slot: "accessory", armorType: "accessory", rarity: "rare", crit: 0.05 },
  { name: "智慧手套", slot: "accessory", armorType: "accessory", rarity: "epic", def: 1, int: 1 },
  { name: "黑狐颈链", slot: "accessory", armorType: "accessory", rarity: "epic", def: 1, agi: 1 },
  { name: "怪盗戒指", slot: "accessory", armorType: "accessory", rarity: "epic", atk: 10, crit: 0.1 },
  { name: "下级精灵的戒指", slot: "accessory", armorType: "accessory", rarity: "epic", str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 },
  { name: "火焰国王戒指", slot: "accessory", armorType: "accessory", rarity: "legend", atk: 15, str: 2, vit: 1 },
  { name: "共鸣戒指", slot: "accessory", armorType: "accessory", rarity: "legend", def: 2, agi: 2, vit: 1 },
  { name: "共和国纪念日戒指", slot: "accessory", armorType: "accessory", rarity: "legend", str: 3, agi: 3, vit: 3, int: 3, dex: 3, luk: 3 },
  { name: "永恒戒指", slot: "accessory", armorType: "accessory", rarity: "legend" },
];

const roStyleEquipmentPoolFiltered = [
  { id: "ro_dagger_damascus", name: "大马士革短剑", slot: "weapon", subType: "dagger", weaponType: "dagger", equipType: "dagger", rarity: "epic", atk: 150, agi: 3, dex: 2, crit: 0.04 },
  { id: "ro_spear_trident", name: "三叉戟", slot: "weapon", subType: "spear", weaponType: "spear", equipType: "spear", rarity: "rare", atk: 170, str: 2, dex: 2 },
  { id: "ro_axe_orc_battle", name: "兽人战斧", slot: "weapon", subType: "axe", weaponType: "axe", equipType: "axe", rarity: "epic", atk: 235, str: 5, vit: 2 },
  { id: "ro_mace_golden", name: "黄金钉锤", slot: "weapon", subType: "mace", weaponType: "mace", equipType: "mace", rarity: "legend", atk: 220, matk: 60, str: 4, vit: 4, bossDamageBonus: 0.035 },
  { id: "ro_bow_hunter", name: "猎人之弓", slot: "weapon", subType: "bow", weaponType: "bow", equipType: "bow", rarity: "epic", atk: 185, dex: 6, agi: 3, crit: 0.05 },
  { id: "ro_katar_briar", name: "刺藤拳刃", slot: "weapon", subType: "katar", weaponType: "katar", equipType: "katar", rarity: "legend", atk: 245, agi: 6, luk: 6, crit: 0.08, critDamageBonus: 0.08 },
  { id: "ro_book_arcane", name: "星纹魔导书", slot: "weapon", subType: "book", weaponType: "book", equipType: "book", rarity: "epic", atk: 70, matk: 210, int: 6, dex: 3, skillDamageBonus: 0.035 },
  { id: "ro_knuckle_iron", name: "铁腕拳套", slot: "weapon", subType: "knuckle", weaponType: "knuckle", equipType: "knuckle", rarity: "rare", atk: 135, str: 3, agi: 2, aspd: 0.04 },
  { id: "ro_staff_dark_lord", name: "黑暗领主之杖", slot: "weapon", subType: "staff", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 80, matk: 285, int: 8, skillDamageBonus: 0.06, abyssDamageBonus: 0.04 },
  { id: "ro_sword_ancient_dragonfang", name: "远古龙牙剑", slot: "weapon", subType: "sword", weaponType: "oneHandSword", equipType: "oneHandSword", rarity: "legend", atk: 285, str: 6, dex: 4, finalDamageBonus: 0.04 },
  { id: "ro_robe_priest", name: "圣职者长袍", slot: "body", subType: "robe", armorType: "bodyArmor", rarity: "epic", def: 68, hp: 260, int: 4, vit: 4, hpRegenPct: 0.04 },
  { id: "ro_plate_glast_knight", name: "古城骑士铠", slot: "body", subType: "plate", armorType: "bodyArmor", rarity: "legend", def: 135, hp: 520, str: 4, vit: 8, damageReductionPct: 0.035 },
  { id: "ro_armor_abyss_dragon_scale", name: "深渊龙鳞甲", slot: "body", subType: "plate", armorType: "bodyArmor", rarity: "legend", def: 160, hp: 680, vit: 9, abyssDamageReduction: 0.04 },
  { id: "ro_head_angel_circlet", name: "天使发圈", slot: "headTop", subType: "circlet", armorType: "headTop", rarity: "epic", def: 12, int: 3, luk: 3, baseExpBonus: 0.025 },
  { id: "ro_head_dark_lord_crown", name: "黑暗领主冠冕", slot: "headTop", subType: "crown", armorType: "headTop", rarity: "legend", def: 26, int: 7, dex: 3, skillDamageBonus: 0.04 },
  { id: "ro_shoes_abyss_walker", name: "深渊行者战靴", slot: "shoes", subType: "boots", armorType: "shoes", rarity: "legend", def: 46, hp: 220, agi: 6, abyssDamageReduction: 0.025, patrolEfficiency: 0.04 },
  { id: "ro_trinket_dragonblood", name: "龙血吊坠", slot: "accessory", subType: "necklace", armorType: "accessory", rarity: "legend", hp: 240, str: 3, vit: 3, lifeSteal: 0.025, bossDamageBonus: 0.025 },
  { id: "ro_trinket_abyss_mark", name: "深渊印记", slot: "accessory", subType: "charm", armorType: "accessory", rarity: "legend", atk: 18, matk: 18, abyssDamageBonus: 0.05, mythicWeightBonus: 0.003 },
];

const extraEquipmentPools = [
  ...oneHandStaffPoolFiltered,
  ...twoHandSwordPoolFiltered,
  ...bodyArmorPoolFiltered,
  ...headTopPoolFiltered,
  ...shoesPoolFiltered,
  ...accessoryPoolFiltered,
  ...roStyleEquipmentPoolFiltered,
].map((item, index) => normalizeEquipmentTemplate(item, `extra_equipment_${index}`));

const allEquipmentTemplates = [...oneHandSwordPoolFiltered, ...extraEquipmentPools];
Object.assign(
  equipmentTemplateDb,
  Object.fromEntries(allEquipmentTemplates.flatMap((item) => [[item.id, item], [item.name, item]])),
);

const equipmentDropTables = {
  beginner_field: [
    ["one_hand_sword_long_sword", 0.06, 1, 8],
    ["one_hand_sword_scimitar", 0.04, 1, 10],
    ["one_hand_sword_honor_sword", 0.025, 3, 12],
    ["one_hand_sword_ceremonial_dagger", 0.015, 4, 14],
    ["one_hand_sword_piercing_sword", 0.008, 8, 16],
  ],
  prontera_south: [
    ["one_hand_sword_scimitar", 0.05, 5, 14],
    ["one_hand_sword_honor_sword", 0.035, 6, 16],
    ["one_hand_sword_ceremonial_dagger", 0.022, 8, 18],
    ["one_hand_sword_piercing_sword", 0.015, 10, 20],
    ["one_hand_sword_saber", 0.01, 12, 22],
    ["one_hand_sword_round_hilt_saber", 0.006, 14, 24],
  ],
  sewer: [
    ["one_hand_sword_piercing_sword", 0.02, 16, 26],
    ["one_hand_sword_saber", 0.015, 18, 28],
    ["one_hand_sword_round_hilt_saber", 0.01, 20, 30],
    ["one_hand_sword_p_cavalry_i", 0.007, 22, 30],
    ["one_hand_sword_haedonggum", 0.0025, 24, 30],
  ],
  orc_village: [
    ["one_hand_sword_round_hilt_saber", 0.018, 22, 30],
    ["one_hand_sword_p_cavalry_i", 0.012, 24, 30],
    ["one_hand_sword_haedonggum", 0.006, 25, 30],
    ["one_hand_sword_katana", 0.0045, 26, 30],
    ["one_hand_sword_water_ripple", 0.003, 27, 30],
  ],
  glast_heim_outside: [
    ["one_hand_sword_haedonggum", 0.009, 25, 30],
    ["one_hand_sword_katana", 0.007, 26, 30],
    ["one_hand_sword_water_ripple", 0.005, 27, 30],
    ["one_hand_sword_tremor", 0.0025, 28, 30],
    ["one_hand_sword_boss_sword", 0.0006, 30, 30],
  ],
  glast_heim_deep: [
    ["one_hand_sword_water_ripple", 0.007, 48, 58],
    ["one_hand_sword_tremor", 0.0045, 50, 60],
    ["one_hand_sword_boss_sword", 0.0012, 55, 65],
    ["one_hand_sword_crimson", 0.0009, 55, 65],
    ["one_hand_sword_youjian_shiguang", 0.0006, 58, 65],
  ],
  abyss_temple: [
    ["one_hand_sword_boss_sword", 0.002, 62, 75],
    ["one_hand_sword_crimson", 0.0015, 65, 78],
    ["one_hand_sword_youjian_shiguang", 0.001, 68, 80],
    ["one_hand_sword_false_belief", 0.0008, 70, 82],
  ],
  sky_temple: [
    ["one_hand_sword_boss_sword", 0.0025, 72, 85],
    ["one_hand_sword_crimson", 0.002, 75, 88],
    ["one_hand_sword_youjian_shiguang", 0.0014, 78, 90],
    ["one_hand_sword_false_belief", 0.001, 80, 92],
  ],
};

const mapDropTableAlias = {
  grass: "beginner_field",
  forest: "prontera_south",
  sewer: "sewer",
  desert: "orc_village",
  orc_village: "orc_village",
  mine: "glast_heim_outside",
  clock: "glast_heim_deep",
  glast_heim: "glast_heim_deep",
  abyss_lake: "abyss_temple",
  sky: "sky_temple",
};

const extraEquipmentDropPlan = {
  beginner_field: { normal: [0.015, 1, 8], rare: [0.003, 6, 14] },
  prontera_south: { normal: [0.02, 5, 16], rare: [0.006, 10, 22], epic: [0.001, 18, 26] },
  sewer: { rare: [0.008, 16, 28], epic: [0.002, 22, 30] },
  orc_village: { rare: [0.01, 20, 30], epic: [0.003, 24, 30], legend: [0.00025, 30, 30] },
  glast_heim_outside: { epic: [0.003, 25, 30], legend: [0.0005, 30, 30] },
  glast_heim_deep: { epic: [0.0032, 50, 60], legend: [0.00115, 55, 65] },
  abyss_temple: { epic: [0.002, 62, 76], legend: [0.0016, 62, 78] },
  sky_temple: { epic: [0.0024, 72, 86], legend: [0.002, 72, 88] },
};

// Online equipment drops use one map-level budget; adding templates changes variety, not total frequency.
const ONLINE_EQUIPMENT_BASE_DROP_RATES = {
  grass: 0.02,
  forest: 0.022,
  sewer: 0.024,
  desert: 0.026,
  orc_village: 0.028,
  mine: 0.03,
  clock: 0.032,
  glast_heim: 0.034,
  abyss_lake: 0.037,
  sky: 0.04,
};

Object.entries(extraEquipmentDropPlan).forEach(([mapId, plan]) => {
  extraEquipmentPools.forEach((item) => {
    const rule = plan[item.rarity];
    if (!rule) return;
    equipmentDropTables[mapId].push([item.id, rule[0], rule[1], rule[2]]);
  });
});

Object.keys(equipmentDropTables).forEach((mapId) => {
  equipmentDropTables[mapId] = equipmentDropTables[mapId].map(([equipmentId, dropRate, minLevel, maxLevel]) => {
    const template = equipmentTemplateDb[equipmentId] || {};
    return {
      equipmentId,
      itemName: template.name || equipmentId,
      rarity: template.rarity || "normal",
      dropRate,
      minLevel,
      maxLevel,
      mapId,
      monsterIds: [],
      weight: 1,
    };
  });
});

const equipmentSets = {
  taurus_aldbaran: {
    id: "taurus_aldbaran",
    name: "金牛座-阿鲁迪巴套装",
    talentName: "金牛座的天赋",
    talentDescription: "金币收益 +500%，BASE经验 +100%，JOB经验 +100%，材料数量 +50%",
    effects: {
      full: { monsterGoldPct: 5, baseExpPct: 1, jobExpPct: 1, materialQuantityPct: 0.5 },
      pieces: {},
    },
    items: [
      { id: "taurus_aldbaran_helmet", name: "金牛座-阿鲁迪巴之盔", slot: "headgear", rarity: "legend", level: 30, requiredLevel: 30, atk: 16, matk: 4, def: 48, hp: 220, str: 4, vit: 8, gold: 0.08, materials: { ancientCore: 2, starShard: 1 }, goldCost: 1800, description: "金牛座-阿鲁迪巴套装部件。"},
      { id: "taurus_aldbaran_armor", name: "金牛座-阿鲁迪巴之铠", slot: "armor", rarity: "legend", level: 30, requiredLevel: 30, atk: 12, matk: 0, def: 82, hp: 520, str: 6, vit: 12, gold: 0.12, materials: { ancientCore: 3, rune: 6 }, goldCost: 2400, description: "金牛座-阿鲁迪巴套装部件。"},
      { id: "taurus_aldbaran_boots", name: "金牛座-阿鲁迪巴之靴", slot: "shoes", rarity: "epic", level: 30, requiredLevel: 30, atk: 10, matk: 0, def: 36, hp: 180, agi: 4, vit: 6, gold: 0.06, materials: { crystal: 8, rune: 4 }, goldCost: 1500, description: "金牛座-阿鲁迪巴套装部件。"},
      { id: "taurus_aldbaran_ring", name: "金牛座-阿鲁迪巴之戒", slot: "trinket", rarity: "legend", level: 30, requiredLevel: 30, atk: 28, matk: 12, def: 12, hp: 120, str: 8, luk: 4, gold: 0.16, materials: { ancientCore: 2, starShard: 1 }, goldCost: 2000, description: "金牛座-阿鲁迪巴套装部件。"},
      { id: "taurus_aldbaran_weapon", name: "金牛座-阿鲁迪巴之斧", slot: "weapon", rarity: "legend", level: 30, requiredLevel: 30, weaponType: "axe", equipType: "axe", atk: 260, matk: 0, def: 16, hp: 160, str: 16, vit: 8, crit: 0.04, gold: 0.18, materials: { ancientCore: 4, starShard: 2 }, goldCost: 3200, description: "金牛座-阿鲁迪巴套装部件。"},
    ],
  },
};

const zodiacSetPlans = [
  ["aries_mu", "白羊座-穆套装", "白羊座的天赋", "物理爆发", "白羊座-穆", "权杖", { physicalAttackPct: 0.25, critDamagePct: 0.3, bossDamagePct: 0.15 }, { atk: 210, matk: 60, def: 180, hp: 650, str: 28, dex: 12, crit: 0.06 }],
  ["gemini_saga", "双子座-撒加套装", "双子座的天赋", "物魔双修", "双子座-撒加", "法杖", { physicalAttackPct: 0.15, magicAttackPct: 0.15, skillDamagePct: 0.2, critRatePct: 0.05 }, { atk: 180, matk: 180, def: 150, hp: 560, str: 16, int: 16, dex: 14, crit: 0.04 }],
  ["cancer_deathmask", "巨蟹座-迪斯马斯克套装", "巨蟹座的天赋", "刷材料/弱化怪物", "巨蟹座-迪斯马斯克", "镰刀", { itemDropPct: 0.8, ignoreDefensePct: 0.1, mutationDamagePct: 0.2 }, { atk: 170, matk: 90, def: 170, hp: 720, vit: 18, luk: 18, drop: 0.08 }],
  ["leo_aiolia", "狮子座-艾欧里亚套装", "狮子座的天赋", "高速攻击", "狮子座-艾欧里亚", "拳刃", { attackSpeedPct: 0.2, critRatePct: 0.08, normalAttackPct: 0.25 }, { atk: 230, def: 135, hp: 520, str: 18, agi: 30, luk: 12, aspd: 0.22, crit: 0.06 }],
  ["virgo_shaka", "处女座-沙加套装", "处女座的天赋", "魔法/生存", "处女座-沙加", "法杖", { magicAttackPct: 0.3, maxHpPct: 0.2, damageReductionPct: 0.1 }, { matk: 260, def: 170, hp: 920, int: 34, vit: 18, dex: 10 }],
  ["libra_dohko", "天秤座-童虎套装", "天秤座的天赋", "均衡战力", "天秤座-童虎", "圣剑", { attrPct: 0.15, powerPct: 0.1, defensePct: 0.15 }, { atk: 180, matk: 120, def: 220, hp: 780, str: 14, agi: 14, vit: 14, int: 14, dex: 14, luk: 14 }],
  ["scorpio_milo", "天蝎座-米罗套装", "天蝎座的天赋", "暴击/持续伤害", "天蝎座-米罗", "短剑", { critRatePct: 0.1, critDamagePct: 0.4, eliteDamagePct: 0.2 }, { atk: 245, def: 130, hp: 560, agi: 18, dex: 18, luk: 28, crit: 0.1 }],
  ["sagittarius_aiolos", "射手座-艾俄洛斯套装", "射手座的天赋", "高命中/高伤害", "射手座-艾俄洛斯", "长弓", { dexPct: 0.25, physicalAttackPct: 0.2, bossDamagePct: 0.25 }, { atk: 270, def: 125, hp: 590, dex: 36, agi: 18, luk: 10, crit: 0.06 }],
  ["capricorn_shura", "摩羯座-修罗套装", "摩羯座的天赋", "破防", "摩羯座-修罗", "圣剑", { physicalAttackPct: 0.3, ignoreDefensePct: 0.15, skillDamagePct: 0.15 }, { atk: 310, def: 150, hp: 660, str: 38, dex: 12, crit: 0.05 }],
  ["aquarius_camyu", "水瓶座-卡妙套装", "水瓶座的天赋", "魔攻/控制", "水瓶座-卡妙", "法杖", { magicAttackPct: 0.35, monsterAttackSpeedReductionPct: 0.1, damageReductionPct: 0.08 }, { matk: 330, def: 165, hp: 700, int: 40, dex: 16, vit: 12 }],
  ["pisces_aphrodite", "双鱼座-阿布罗狄套装", "双鱼座的天赋", "掉落/卡片", "双鱼座-阿布罗狄", "玫瑰", { cardDropPct: 0.8, itemDropPct: 0.3, lukPct: 0.2 }, { atk: 190, matk: 170, def: 140, hp: 580, dex: 14, luk: 36, drop: 0.1 }],
];

Object.assign(equipmentSets, Object.fromEntries(zodiacSetPlans.map(([id, name, talentName, role, prefix, weapon, effects, stats]) => [
  id,
  createZodiacSet({ id, name, talentName, role, prefix, weapon, effects, stats }),
])));

Object.assign(equipmentSets, {
  poring_adventurer: createTransitionSet({
    id: "poring_adventurer",
    name: "波波冒险者套装",
    talentName: "波波冒险者守护",
    talentDescription: "2件最大生命 +8%，3件最大生命 +12%、物品掉率 +2%",
    level: 8,
    rarity: "rare",
    effects: {
      pieces: {
        2: { maxHpPct: 0.08 },
        3: { maxHpPct: 0.12, itemDropPct: 0.02 },
      },
    },
    items: [
      { key: "hat", name: "波波冒险帽", slot: "headgear", def: 8, hp: 55, vit: 2 },
      { key: "coat", name: "波波冒险衣", slot: "armor", def: 18, hp: 120, vit: 3 },
      { key: "shoes", name: "波波冒险鞋", slot: "shoes", def: 10, hp: 60, agi: 2 },
    ],
  }),
  forest_patroller: createTransitionSet({
    id: "forest_patroller",
    name: "森林巡游者套装",
    talentName: "森林巡游者节奏",
    talentDescription: "2件攻击速度 +4%，3件攻击速度 +6%、BASE/JOB经验 +5%",
    level: 18,
    rarity: "epic",
    effects: {
      pieces: {
        2: { attackSpeedPct: 0.04 },
        3: { attackSpeedPct: 0.06, baseExpPct: 0.05, jobExpPct: 0.05 },
      },
    },
    items: [
      { key: "hat", name: "森林巡游帽", slot: "headgear", def: 14, dex: 3, luk: 2 },
      { key: "armor", name: "森林巡游甲", slot: "armor", def: 34, hp: 210, vit: 4 },
      { key: "boots", name: "森林巡游靴", slot: "shoes", def: 18, agi: 5, aspd: 0.03 },
    ],
  }),
});

ensureSetProgressionBonuses();

function createZodiacSet(plan) {
  const slotPlan = [
    ["crown", "之冠", "headgear", 0.18],
    ["armor", "圣衣", "armor", 0.28],
    ["boots", "战靴", "shoes", 0.16],
    ["ring", "指环", "trinket", 0.14],
    ["weapon", plan.weapon, "weapon", 0.34],
  ];
  return {
    id: plan.id,
    name: plan.name,
    talentName: plan.talentName,
    talentDescription: describeZodiacEffects(plan.effects),
    role: plan.role,
    effects: { full: plan.effects, pieces: {} },
    items: slotPlan.map(([key, suffix, slot, weight]) => ({
      id: `${plan.id}_${key}`,
      name: `${plan.prefix}${suffix}`,
      slot,
      rarity: "legend",
      level: 36,
      requiredLevel: 35,
      weaponType: slot === "weapon" ? "zodiacWeapon" : "",
      equipType: slot === "weapon" ? "zodiacWeapon" : slot,
      atk: Math.round((plan.stats.atk || 0) * weight),
      matk: Math.round((plan.stats.matk || 0) * weight),
      def: Math.round((plan.stats.def || 0) * weight),
      hp: Math.round((plan.stats.hp || 0) * weight),
      str: Math.round((plan.stats.str || 0) * weight),
      agi: Math.round((plan.stats.agi || 0) * weight),
      vit: Math.round((plan.stats.vit || 0) * weight),
      int: Math.round((plan.stats.int || 0) * weight),
      dex: Math.round((plan.stats.dex || 0) * weight),
      luk: Math.round((plan.stats.luk || 0) * weight),
      aspd: Number(((plan.stats.aspd || 0) * weight).toFixed(3)),
      crit: Number(((plan.stats.crit || 0) * weight).toFixed(3)),
      drop: Number(((plan.stats.drop || 0) * weight).toFixed(3)),
      craftable: false,
      source: "monster_drop",
      description: `${plan.name}部件。集齐 5 件可激活${plan.talentName}。`,
    })),
  };
}

function createTransitionSet(plan) {
  return {
    id: plan.id,
    name: plan.name,
    talentName: plan.talentName,
    talentDescription: plan.talentDescription,
    effects: { full: plan.effects?.pieces?.[3] || plan.effects?.full || {}, pieces: plan.effects?.pieces || {} },
    items: plan.items.map((item) => ({
      id: `${plan.id}_${item.key}`,
      name: item.name,
      slot: item.slot,
      rarity: plan.rarity,
      level: plan.level,
      requiredLevel: Math.max(1, plan.level - 3),
      atk: item.atk || 0,
      matk: item.matk || 0,
      def: item.def || 0,
      hp: item.hp || 0,
      str: item.str || 0,
      agi: item.agi || 0,
      vit: item.vit || 0,
      int: item.int || 0,
      dex: item.dex || 0,
      luk: item.luk || 0,
      aspd: item.aspd || 0,
      craftable: false,
      source: "monster_drop",
      description: `${plan.name}部件，通过怪物掉落获得。`,
    })),
  };
}

function ensureSetProgressionBonuses() {
  Object.values(equipmentSets).forEach((set) => {
    set.effects = set.effects || { full: {}, pieces: {} };
    set.effects.full = set.effects.full || {};
    const existingPieces = set.effects.pieces || {};
    if (Object.keys(existingPieces).length) {
      set.effects.pieces = existingPieces;
      return;
    }
    if (set.id === "taurus_aldbaran") {
      set.effects.pieces = {
        2: { monsterGoldPct: 0.5 },
        3: { monsterGoldPct: 1, baseExpPct: 0.2, jobExpPct: 0.2 },
        5: { ...set.effects.full },
      };
      return;
    }
    const maxPieces = Math.min(5, set.items?.length || 5);
    set.effects.pieces = {
      2: scaleSetEffects(set.effects.full, 0.2),
      3: scaleSetEffects(set.effects.full, 0.35),
      [maxPieces]: { ...set.effects.full },
    };
  });
}

function scaleSetEffects(effects = {}, scale = 1) {
  return Object.fromEntries(
    Object.entries(effects)
      .filter(([, value]) => typeof value === "number")
      .map(([key, value]) => [key, Number((value * scale).toFixed(3))]),
  );
}

function describeZodiacEffects(effects = {}) {
  const labels = [
    ["monsterGoldPct", "金币收益"],
    ["baseExpPct", "BASE经验"],
    ["jobExpPct", "JOB经验"],
    ["materialQuantityPct", "材料数量"],
    ["physicalAttackPct", "物理攻击"],
    ["magicAttackPct", "魔法攻击"],
    ["skillDamagePct", "技能伤害"],
    ["normalAttackPct", "普通攻击"],
    ["attackSpeedPct", "攻击速度"],
    ["critRatePct", "暴击率"],
    ["critDamagePct", "暴击伤害"],
    ["bossDamagePct", "Boss伤害"],
    ["mutationDamagePct", "变异怪伤害"],
    ["eliteDamagePct", "精英怪伤害"],
    ["itemDropPct", "物品掉率"],
    ["cardDropPct", "卡片掉率"],
    ["equipmentDropPct", "装备掉率"],
    ["ignoreDefensePct", "破甲"],
    ["maxHpPct", "最大生命"],
    ["damageReductionPct", "受到伤害降低"],
    ["defensePct", "防御"],
    ["powerPct", "战力"],
    ["attrPct", "六维属性"],
    ["lukPct", "LUK"],
    ["dexPct", "DEX"],
    ["abyssDamageBonus", "深渊怪物伤害"],
    ["abyssDamageReduction", "深渊减伤"],
    ["abyssBossDamageBonus", "深渊Boss伤害"],
    ["mythicWeightBonus", "神话装备品质权重"],
    ["abyssGoldPct", "深渊金币"],
    ["abyssBaseExpPct", "深渊BASE经验"],
    ["abyssJobExpPct", "深渊JOB经验"],
    ["abyssMaterialDropBonus", "深渊材料掉率"],
    ["abyssCardDropBonus", "深渊卡片掉率"],
    ["abyssItemDropBonus", "深渊物品掉率"],
    ["abyssSkillChanceBonus", "深渊技能触发"],
    ["abyssDefenseReduction", "深渊破防"],
    ["abyssAttackSpeedPct", "深渊攻速"],
    ["abyssCritRatePct", "深渊暴击率"],
    ["abyssMagicDamageBonus", "深渊魔法伤害"],
    ["abyssAttrPct", "深渊六维"],
    ["abyssPowerPct", "深渊战力"],
    ["abyssCritDamageBonus", "深渊暴击伤害"],
    ["abyssEliteDamageBonus", "深渊精英怪伤害"],
    ["abyssDexPct", "深渊DEX"],
    ["abyssIgnoreDefense", "深渊破甲"],
    ["abyssBossDamageReduction", "深渊Boss减伤"],
  ];
  return labels
    .filter(([key]) => effects[key])
    .map(([key, label]) => label + " " + formatSignedPercent(effects[key]))
    .join("、");
}

Object.values(equipmentSets).forEach((set) => {
  set.items = set.items.map((item) => ({
    setId: set.id,
    setName: set.name,
    image: "assets/images/equipment/" + item.id + ".png",
    quality: item.rarity,
    requiredJob: [],
    baseStats: {
      atk: item.atk || 0,
      matk: item.matk || 0,
      def: item.def || 0,
      hp: item.hp || 0,
      str: item.str || 0,
      agi: item.agi || 0,
      vit: item.vit || 0,
      int: item.int || 0,
      dex: item.dex || 0,
      luk: item.luk || 0,
      crit: item.crit || 0,
      drop: item.drop || 0,
      gold: item.gold || 0,
    },
    enhanceLevel: 0,
    materials: {},
    goldCost: 0,
    ...item,
    craftable: item.craftable === true,
    allowFreeCraft: item.allowFreeCraft === true,
  }));
});

Object.values(equipmentSets).forEach((set) => {
  set.items.forEach((item) => {
    equipmentTemplateDb[item.id] = item;
    equipmentTemplateDb[item.name] = item;
  });
});

const zodiacSetDropMap = {
  grass: ["aries_mu", "taurus_aldbaran"],
  forest: ["gemini_saga", "cancer_deathmask"],
  sewer: ["cancer_deathmask", "leo_aiolia"],
  desert: ["leo_aiolia", "virgo_shaka"],
  orc_village: ["virgo_shaka", "libra_dohko"],
  mine: ["libra_dohko", "scorpio_milo"],
  clock: ["scorpio_milo", "sagittarius_aiolos"],
  glast_heim: ["sagittarius_aiolos", "capricorn_shura"],
  abyss_lake: ["capricorn_shura", "aquarius_camyu"],
  sky: ["aquarius_camyu", "pisces_aphrodite"],
};

const transitionSetDropMap = {
  grass: ["poring_adventurer"],
  forest: ["forest_patroller"],
};

const TRANSITION_SET_DROP_RATES = {
  normal: 0.008,
  hard: 0.012,
  abyss: 0.015,
  boss: 0.045,
  hardBoss: 0.06,
  abyssBoss: 0.08,
};

const jobSpriteSources = {
  novice: "assets/images/classes/novice.png",
  swordman: "assets/images/classes/swordman.png",
  knight: "assets/images/classes/knight.png",
  lordKnight: "assets/images/classes/lordKnight.png",
  runeKnight: "assets/images/classes/runeKnight.png",
  mage: "assets/images/classes/mage.png",
  wizard: "assets/images/classes/wizard.png",
  highWizard: "assets/images/classes/highWizard.png",
  warlock: "assets/images/classes/warlock.png",
  archer: "assets/images/classes/archer.png",
  hunter: "assets/images/classes/hunter.png",
  sniper: "assets/images/classes/sniper.png",
  ranger: "assets/images/classes/ranger.png",
  acolyte: "assets/images/classes/acolyte.png",
  priest: "assets/images/classes/priest.png",
  highPriest: "assets/images/classes/highPriest.png",
  archbishop: "assets/images/classes/archbishop.png",
  merchant: "assets/images/classes/merchant.png",
  blacksmith: "assets/images/classes/blacksmith.png",
  whiteSmith: "assets/images/classes/whiteSmith.png",
  mechanic: "assets/images/classes/mechanic.png",
  thief: "assets/images/classes/thief.png",
  assassin: "assets/images/classes/assassin.png",
  assassinCross: "assets/images/classes/assassinCross.png",
  guillotineCross: "assets/images/classes/guillotineCross.png",
};

const jobSpriteExtensions = imageExtensions;
const jobSpriteCache = {};

const affixPool = [
  { stat: "atk", range: [4, 18], label: "锐利" },
  { stat: "matk", range: [4, 18], label: "秘法" },
  { stat: "def", range: [3, 16], label: "坚固" },
  { stat: "hp", range: [18, 90], label: "生命" },
  { stat: "aspd", range: [0.005, 0.035], label: "迅捷" },
  { stat: "luck", range: [2, 14], label: "LUK" },
  { stat: "crit", range: [0.006, 0.03], label: "会心" },
  { stat: "drop", range: [0.006, 0.035], label: "寻宝" },
  { stat: "gold", range: [0.01, 0.06], label: "富足" },
];

const legacyCardPool = [
  { id: "jelly", name: "果冻波波卡片", map: 0, cardType: "monster", rarity: "rare", hpPct: 0.08, gold: 0.06, monsterId: "grass_poring", description: "南门草地上最常见的魔物。" },
  { id: "mushroom", name: "蘑菇卡片", map: 1, cardType: "monster", rarity: "rare", atkPct: 0.05, defPct: 0.06, dps: 0.04, monsterId: "forest_mushroom", description: "斑光森林中的发光菌类。" },
  { id: "golden_bug", name: "黄金盗虫旧卡片", map: 2, cardType: "monster", rarity: "rare", defPct: 0.08, drop: 0.02, monsterId: "sewer_bug_larva", description: "下水道深处金色甲虫的旧日遗骸。" },
  { id: "scorpion_king", name: "蝎王卡片", map: 3, cardType: "monster", rarity: "rare", atkPct: 0.06, crit: 0.025, monsterId: "desert_wolf", description: "梦罗克沙漠的毒蝎霸主。" },
  { id: "bat", name: "矿灯卡片", map: 5, cardType: "monster", rarity: "rare", aspdPct: 0.035, crit: 0.035, drop: 0.025, monsterId: "mine_bat", description: "蓝晶矿洞中闪烁微光的蝙蝠。" },
  { id: "gear", name: "齿轮卡片", map: 6, cardType: "monster", rarity: "rare", atkPct: 0.06, matkPct: 0.06, defPct: 0.1, dps: 0.08, monsterId: "clock_gear", description: "旧钟塔回廊中掉落的齿轮残骸。" },
  { id: "ancient_dragon", name: "远古巨龙旧卡片", map: 8, cardType: "monster", rarity: "rare", atkPct: 0.1, hpPct: 0.1, crit: 0.04, monsterId: "abyss_lake_dragon", description: "深渊湖畔远古巨龙的鳞片。" },
  { id: "feather", name: "星羽卡片", map: 9, cardType: "monster", rarity: "rare", matkPct: 0.1, gold: 0.12, drop: 0.04, crit: 0.025, monsterId: "sky_guard", description: "浮岛神殿的星之守护者。" },
];

const BOSS_CARD_SYNTHESIS_COST = 100;

const bossCardPool = [
  { id: "baphomet", name: "巴风特卡片", map: 9, cardType: "boss", rarity: "mythic", bossOnly: true, uniqueSocket: true, skillDamageBonus: 0.08, bossDamageBonus: 0.06, splashTargets: 2, splashDamagePct: 0.45, monsterId: "sky_boss_archon", description: "攻击溅射附近敌人；Boss 单体战时获得额外技能与 Boss 伤害。" },
  { id: "dracula", name: "德古拉卡片", map: 7, cardType: "boss", rarity: "darkGold", bossOnly: true, uniqueSocket: true, lifeSteal: 0.08, skillHitHealPct: 0.01, hpPct: 0.04, monsterId: "glast_boss_dark_lord", description: "提供吸血，并在主动技能命中时少量恢复生命。" },
  { id: "doppelganger", name: "多佩雷根卡片", map: 6, cardType: "boss", rarity: "legend", bossOnly: true, attackSpeedPct: 0.12, normalAttackDamageBonus: 0.08, crit: 0.03, monsterId: "clock_boss_keeper", description: "高速攻击型 Boss 卡，强化普攻节奏与暴击。" },
  { id: "phreeoni", name: "皮里恩卡片", map: 3, cardType: "boss", rarity: "legend", bossOnly: true, hitRate: 0.2, dex: 10, higherLevelDamageBonus: 0.05, monsterId: "desert_boss_scorpion_king", description: "大幅提高命中，并提升挑战高等级怪物时的稳定性。" },
  { id: "orc_hero", name: "兽人英雄卡片", map: 4, cardType: "boss", rarity: "legend", bossOnly: true, vit: 15, hpPct: 0.1, statusResist: 0.5, monsterId: "orc_boss_hero", description: "高生存 Boss 卡，提高体质、生命，并降低怪物暴击威胁。" },
  { id: "moonlight_flower", name: "月夜猫卡片", map: 1, cardType: "boss", rarity: "legend", bossOnly: true, attackSpeedPct: 0.06, patrolEfficiency: 0.1, offlineEfficiencyBonus: 0.05, bossDamageBonus: -0.03, monsterId: "forest_boss_guardian", description: "挂机与巡逻效率卡，牺牲少量 Boss 输出换取长期收益。" },
  { id: "drake", name: "海盗之王卡片", map: 2, cardType: "boss", rarity: "legend", bossOnly: true, bossDamageBonus: 0.15, eliteDamageBonus: 0.1, hitRate: 0.08, monsterId: "sewer_boss_golden_bug", description: "稳定的 Boss 战输出卡，适合首领挑战。" },
  { id: "turtle_general", name: "龟将军卡片", map: 5, cardType: "boss", rarity: "darkGold", bossOnly: true, finalDamageBonus: 0.1, physicalFinalDamageBonus: 0.1, fireBurstChance: 0.06, fireBurstAtkPct: 0.8, monsterId: "mine_boss_crystal", description: "提高最终物理伤害，并有概率触发火焰爆发。" },
  { id: "dark_lord", name: "黑暗领主卡片", map: 7, cardType: "boss", rarity: "darkGold", bossOnly: true, matkPct: 0.12, skillDamageBonus: 0.08, meteorCounterChance: 0.08, meteorCounterMatkPct: 1.2, monsterId: "glast_boss_dark_lord", description: "魔法型 Boss 卡，受击时有概率以陨石反击。" },
  { id: "golden_thief_bug", name: "黄金盗虫卡片", map: 2, cardType: "boss", rarity: "mythic", bossOnly: true, uniqueSocket: true, magicDamageReduction: 0.25, skillDamageReduction: 0.25, abyssDamageReduction: 0.05, skillCooldownPenalty: 0.1, monsterId: "sewer_boss_golden_bug", description: "强力插卡防御卡，降低技能、魔法与深渊伤害，但会降低主动技能触发节奏。" },
];

const cardPool = [...legacyCardPool, ...bossCardPool];

const cardDropTables = cardPool.reduce((tables, card) => {
  const mapId = maps[card.map]?.id || "map_" + card.map;
  tables[mapId] = tables[mapId] || [];
  const bossRate = card.rarity === "mythic" ? 0.00005 : card.rarity === "darkGold" ? 0.00012 : 0.00025;
  tables[mapId].push({
    cardId: card.id,
    name: card.name,
    rarity: card.rarity || "rare",
    type: "card",
    source: card.bossOnly ? "boss_drop" : "monster_drop",
    bossOnly: Boolean(card.bossOnly),
    dropRate: card.bossOnly ? bossRate : 0.0005 + card.map * 0.00015,
  });
  return tables;
}, {});

function awakenedCardEffects(card) {
  const rarity = card?.rarity || "rare";
  const table = {
    normal: { attr: 3, drop: 0.005, monsterDamage: 0.01 },
    fine: { attr: 3, drop: 0.005, monsterDamage: 0.01 },
    rare: { attr: 5, drop: 0.01, monsterDamage: 0.02 },
    epic: { attr: 8, drop: 0.015, monsterDamage: 0.03 },
    ancient: { attr: 10, drop: 0.018, monsterDamage: 0.04 },
    legend: { attr: 12, drop: 0.02, monsterDamage: 0.05 },
    darkGold: { attr: 20, drop: 0.03, monsterDamage: 0.08 },
    mythic: { attr: 28, drop: 0.04, monsterDamage: 0.1 },
  };
  return table[rarity] || table.rare;
}

const materialDropTables = {
  grass: [
    { materialId: "dust", dropRate: 0.08, minQty: 1, maxQty: 3 },
    { materialId: "ore", dropRate: 0.018, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0003, minQty: 1, maxQty: 1 },
  ],
  forest: [
    { materialId: "dust", dropRate: 0.06, minQty: 1, maxQty: 3 },
    { materialId: "ore", dropRate: 0.035, minQty: 1, maxQty: 2 },
    { materialId: "crystal", dropRate: 0.01, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0004, minQty: 1, maxQty: 1 },
  ],
  sewer: [
    { materialId: "dust", dropRate: 0.05, minQty: 1, maxQty: 3 },
    { materialId: "ore", dropRate: 0.045, minQty: 1, maxQty: 2 },
    { materialId: "crystal", dropRate: 0.018, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.00055, minQty: 1, maxQty: 1 },
  ],
  desert: [
    { materialId: "ore", dropRate: 0.055, minQty: 1, maxQty: 3 },
    { materialId: "crystal", dropRate: 0.024, minQty: 1, maxQty: 2 },
    { materialId: "rune", dropRate: 0.006, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0007, minQty: 1, maxQty: 1 },
  ],
  orc_village: [
    { materialId: "ore", dropRate: 0.065, minQty: 1, maxQty: 3 },
    { materialId: "crystal", dropRate: 0.03, minQty: 1, maxQty: 2 },
    { materialId: "rune", dropRate: 0.01, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.004, minQty: 1, maxQty: 1 },
    { materialId: "elunium", dropRate: 0.004, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0009, minQty: 1, maxQty: 1 },
  ],
  mine: [
    { materialId: "ore", dropRate: 0.07, minQty: 1, maxQty: 3 },
    { materialId: "crystal", dropRate: 0.03, minQty: 1, maxQty: 2 },
    { materialId: "rune", dropRate: 0.008, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.01, minQty: 1, maxQty: 1 },
    { materialId: "elunium", dropRate: 0.008, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0011, minQty: 1, maxQty: 1 },
  ],
  clock: [
    { materialId: "crystal", dropRate: 0.05, minQty: 1, maxQty: 3 },
    { materialId: "rune", dropRate: 0.025, minQty: 1, maxQty: 2 },
    { materialId: "ancientCore", dropRate: 0.006, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.018, minQty: 1, maxQty: 2 },
    { materialId: "elunium", dropRate: 0.015, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0014, minQty: 1, maxQty: 1 },
  ],
  glast_heim: [
    { materialId: "rune", dropRate: 0.045, minQty: 1, maxQty: 3 },
    { materialId: "ancientCore", dropRate: 0.014, minQty: 1, maxQty: 2 },
    { materialId: "starShard", dropRate: 0.0035, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.025, minQty: 1, maxQty: 2 },
    { materialId: "elunium", dropRate: 0.022, minQty: 1, maxQty: 2 },
    { materialId: "enhanceProtect", dropRate: 0.0017, minQty: 1, maxQty: 1 },
  ],
  abyss_lake: [
    { materialId: "rune", dropRate: 0.05, minQty: 1, maxQty: 3 },
    { materialId: "ancientCore", dropRate: 0.02, minQty: 1, maxQty: 2 },
    { materialId: "starShard", dropRate: 0.007, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.035, minQty: 1, maxQty: 3 },
    { materialId: "elunium", dropRate: 0.03, minQty: 1, maxQty: 2 },
    { materialId: "enhanceProtect", dropRate: 0.002, minQty: 1, maxQty: 1 },
  ],
  sky: [
    { materialId: "rune", dropRate: 0.04, minQty: 1, maxQty: 3 },
    { materialId: "ancientCore", dropRate: 0.018, minQty: 1, maxQty: 2 },
    { materialId: "starShard", dropRate: 0.006, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.04, minQty: 1, maxQty: 3 },
    { materialId: "elunium", dropRate: 0.035, minQty: 1, maxQty: 2 },
    { materialId: "enhanceProtect", dropRate: 0.0024, minQty: 1, maxQty: 1 },
  ],
};

const els = {};
let state = createDefaultState();
let lastTick = performance.now();
let saveTimer = 0;
let toastTimer = 0;
let loopDt = 0;
let offlineRewardModalOpen = false;
let refineResultState = null;
let recentSkillLevelUps = {};
let recentSkillExpGains = {};
let recentLootFeedback = [];
let skillFeedbackTimer = 0;
let sessionStatsLastRenderAt = 0;
let sessionStatsMapId = "";
let equipmentFilter = "all";
let equipmentSort = "score";
let equipmentShowAll = false;
let smithyActiveTab = "enhance";
const equipmentDetailExpandedState = {};
const runtimeSessionStats = {
  startedAt: Date.now(),
  events: [],
  kills: 0,
  bossKills: 0,
  abyssKills: 0,
  gold: 0,
  baseExp: 0,
  jobExp: 0,
  materials: {},
  cards: {},
  equipmentCount: 0,
  equipmentByRarity: Object.fromEntries(rarityOrder.map((rarity) => [rarity, 0])),
  zodiacEquipmentCount: 0,
  abyssEquipmentCount: 0,
  abyssSetEquipmentCount: 0,
  autoSalvagedCount: 0,
  refineSuccessCount: 0,
  refineFailCount: 0,
  achievementsCompleted: 0,
};
let selectedSlot = "front";
let activePage = "adventure";
let auth = loadAuth();
let remoteSaveInFlight = false;
let remoteSaveQueued = false;

function skill(name, level, kind, description, options) {
  return {
    id: options.id || skillIdFor(name, level, kind),
    name,
    level,
    kind,
    description,
    atkPct: options.atkPct || 0,
    matkPct: options.matkPct || 0,
    hpPct: options.hpPct || 0,
    defPct: options.defPct || 0,
    aspdPct: options.aspdPct || 0,
    critPct: options.critPct || 0,
    goldPct: options.goldPct || 0,
    dropPct: options.dropPct || 0,
    dpsPct: options.dpsPct || 0,
    active: options.active || null,
  };
}

function skillIdFor(name, level, kind) {
  return `skill_${String(name).replace(/\s+/g, "_")}_${level}_${kind}`;
}

function defaultTrainingPct() {
  return { str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 };
}

function defaultOfflineRewards() {
  return {
    seconds: 0,
    gold: 0,
    baseExp: 0,
    jobExp: 0,
    items: [],
    equipments: [],
    cards: [],
    materials: [],
    autoSalvagedMaterials: {},
    skippedEquipment: 0,
    durationMs: 0,
    cappedDurationMs: 0,
    mapId: "",
    calculatedAt: "",
    killCount: 0,
    noRewardsReason: "",
  };
}

function defaultVipState() {
  return { level: 0, exp: 0, totalExp: 0, dailyGiftClaimed: "", bossFirstKills: {}, onlineSecondsToday: 0, onlineRewardClaimed: "" };
}

function defaultQuestState() {
  return { active: [], completed: [], lastRefreshAt: "" };
}

function defaultSkillGrowth() {
  return {};
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultDailyGoals() {
  return {
    date: todayKey(),
    claimedAll: false,
    goals: [
      { id: "daily_kills", title: "今日清扫", target: 500, progress: 0, claimed: false, reward: { vipExp: 20, materials: { dust: 20 } } },
      { id: "daily_boss", title: "首领讨伐", target: 5, progress: 0, claimed: false, reward: { vipExp: 30, materials: { grassEssence: 1 } } },
      { id: "daily_equipment", title: "装备搜寻", target: 10, progress: 0, claimed: false, reward: { vipExp: 20, materials: { ore: 10 } } },
      { id: "daily_refine", title: "星炼尝试", target: 1, progress: 0, claimed: false, reward: { vipExp: 15, materials: { crystal: 3 } } },
      { id: "daily_loot", title: "战利品领取", target: 1, progress: 0, claimed: false, reward: { vipExp: 10, materials: { dust: 10 } } },
    ],
  };
}

function normalizeDailyGoals(dailyGoals = {}) {
  if (dailyGoals.date !== todayKey()) return defaultDailyGoals();
  const defaults = defaultDailyGoals();
  const savedGoals = Array.isArray(dailyGoals.goals) ? dailyGoals.goals : [];
  return {
    date: defaults.date,
    claimedAll: Boolean(dailyGoals.claimedAll),
    goals: defaults.goals.map((goal) => {
      const saved = savedGoals.find((entry) => entry.id === goal.id) || {};
      return { ...goal, progress: Math.max(0, Number(saved.progress || 0)), claimed: Boolean(saved.claimed) };
    }),
  };
}

function updateDailyGoalProgress(id, amount = 1) {
  state.dailyGoals = normalizeDailyGoals(state.dailyGoals);
  const goal = state.dailyGoals.goals.find((entry) => entry.id === id);
  if (!goal || goal.claimed) return;
  goal.progress = Math.min(goal.target, Number(goal.progress || 0) + Math.max(0, Number(amount) || 0));
}

function claimDailyGoal(id) {
  try {
    state.dailyGoals = normalizeDailyGoals(state.dailyGoals);
    const goal = state.dailyGoals.goals.find((entry) => entry.id === id);
    if (!goal) { showToast("目标数据异常"); return; }
    if (goal.claimed) { showToast("该奖励已领取"); return; }
    if (Number(goal.progress || 0) < goal.target) { showToast("目标尚未完成"); return; }
    grantGenericReward(goal.reward || {});
    goal.claimed = true;
    if (!state.dailyGoals.claimedAll && state.dailyGoals.goals.every((entry) => entry.claimed)) {
      grantGenericReward({ vipExp: 50, materials: { starShard: 1, dust: 10 } });
      state.dailyGoals.claimedAll = true;
      addLog("每日目标全部完成，获得额外奖励。");
    }
    addLog(`每日目标完成：${goal.title}。`);
    save();
    renderAll();
  } catch (e) {
    console.error("claimDailyGoal", e);
    showToast("领取失败，请刷新重试");
  }
}

function grantGenericReward(reward = {}) {
  if (reward.vipExp) gainVipExp(reward.vipExp);
  if (reward.gold) state.gold += reward.gold;
  if (reward.materials) addMaterials(reward.materials);
}

function getSkillGrowthEntry(skillOrId) {
  const skillId = typeof skillOrId === "string" ? skillOrId : skillOrId?.id;
  if (!skillId) return { level: 1, exp: 0, totalExp: 0, specialization: "" };
  const current = state.skillGrowth?.[skillId] || {};
  return {
    level: clampNumber(Math.floor(current.level || 1), 1, SKILL_MAX_LEVEL),
    exp: Math.max(0, Number(current.exp) || 0),
    totalExp: Math.max(0, Number(current.totalExp) || 0),
    specialization: current.specialization || "",
  };
}

function ensureSkillGrowthEntry(skillOrId) {
  const skillId = typeof skillOrId === "string" ? skillOrId : skillOrId?.id;
  if (!skillId) return null;
  state.skillGrowth = state.skillGrowth || {};
  const normalized = getSkillGrowthEntry(skillId);
  state.skillGrowth[skillId] = normalized;
  return state.skillGrowth[skillId];
}

function getSkillExpRequirement(level) {
  if (level >= SKILL_MAX_LEVEL) return 0;
  return SKILL_EXP_REQUIREMENTS[level] || SKILL_EXP_REQUIREMENTS[SKILL_EXP_REQUIREMENTS.length - 1] || 999;
}

function gainSkillExp(skillOrId, amount, reason = "") {
  const entry = ensureSkillGrowthEntry(skillOrId);
  if (!entry) return;
  const gain = Math.max(0, Number(amount) || 0);
  if (!gain || entry.level >= SKILL_MAX_LEVEL) return;
  const skillId = typeof skillOrId === "string" ? skillOrId : skillOrId?.id;
  entry.exp += gain;
  entry.totalExp += gain;
  if (skillId) {
    const lastGain = recentSkillExpGains[skillId];
    recentSkillExpGains[skillId] = {
      amount: lastGain && Date.now() - lastGain.time < 1200 ? lastGain.amount + gain : gain,
      time: Date.now(),
    };
  }
  while (entry.level < SKILL_MAX_LEVEL) {
    const need = getSkillExpRequirement(entry.level);
    if (entry.exp < need) break;
    entry.exp -= need;
    entry.level += 1;
    const name = typeof skillOrId === "string" ? skillOrId : skillOrId?.name || "技能";
    if (skillId) recentSkillLevelUps[skillId] = Date.now();
    showToast(`技能升级：${name} Lv.${entry.level}`);
    addLog(`技能升级：${name} Lv.${entry.level}${reason ? `（${reason}）` : ""}。`);
  }
  if (entry.level >= SKILL_MAX_LEVEL) entry.exp = 0;
}

function isSkillRecentlyLeveled(skillId) {
  return Boolean(skillId && recentSkillLevelUps[skillId] && Date.now() - recentSkillLevelUps[skillId] < 900);
}

function getRecentSkillExpGain(skillId) {
  const entry = recentSkillExpGains[skillId];
  if (!entry || Date.now() - entry.time > 1200) return 0;
  return entry.amount || 0;
}

function getSkillLevel(skillOrId) {
  return getSkillGrowthEntry(skillOrId).level;
}

function getSkillJob(skillOrId) {
  const skillId = typeof skillOrId === "string" ? skillOrId : skillOrId?.id;
  for (const [jobId, job] of Object.entries(jobTemplates)) {
    if ((job.skills || []).some((s) => s.id === skillId)) return jobId;
  }
  return "novice";
}

function getSkillMilestoneBonuses(skillOrId) {
  const level = getSkillLevel(skillOrId);
  const bonuses = getSkillMilestoneEntries(skillOrId);
  const result = { milestoneMult: 0 };
  SKILL_MILESTONES.forEach((ms, i) => {
    if (level >= ms && bonuses[i]) Object.entries(bonuses[i]).forEach(([k, v]) => {
      if (typeof v !== "number") return;
      result[k] = (result[k] || 0) + v;
    });
  });
  return result;
}

function getSkillMilestoneEntries(skillOrId) {
  const skillId = typeof skillOrId === "string" ? skillOrId : skillOrId?.id;
  if (skillId && SKILL_MILESTONE_BONUSES_BY_SKILL[skillId]) return SKILL_MILESTONE_BONUSES_BY_SKILL[skillId];
  const job = getSkillJob(skillOrId);
  return SKILL_MILESTONE_BONUSES[job] || SKILL_MILESTONE_BONUSES.novice;
}

function getSkillMilestoneRows(skillOrId) {
  const level = getSkillLevel(skillOrId);
  return SKILL_MILESTONES.map((milestoneLevel, index) => {
    const entry = getSkillMilestoneEntries(skillOrId)[index] || {};
    return {
      level: milestoneLevel,
      active: level >= milestoneLevel,
      text: describeSkillMilestone(entry),
    };
  });
}

function describeSkillMilestone(entry = {}) {
  const desc = entry.desc ? [entry.desc] : [];
  const stats = Object.entries(entry)
    .filter(([key, value]) => key !== "desc" && key !== "milestoneMult" && Number(value || 0) !== 0)
    .map(([key, value]) => `${skillMilestoneStatName(key)} ${formatSkillMilestoneValue(key, value)}`);
  if (entry.milestoneMult) stats.unshift(`技能效果 ${formatSkillMilestoneValue("milestoneMult", entry.milestoneMult)}`);
  return [...desc, ...stats].join("，") || "技能效果提高";
}

function skillMilestoneStatName(key) {
  const names = {
    milestoneMult: "技能效果",
    atkPct: "物攻",
    matkPct: "魔攻",
    hpPct: "生命",
    defPct: "防御",
    aspdPct: "攻速",
    critRatePct: "暴击率",
    critDamageBonus: "暴击伤害",
    skillDamageBonus: "技能伤害",
    monsterDamageBonus: "对怪物伤害",
    bossDamageBonus: "Boss伤害",
    eliteDamageBonus: "精英/首领伤害",
    finalDamageBonus: "最终伤害",
    ignoreDefense: "破甲",
    damageReductionPct: "伤害减免",
    dodgeRatePct: "闪避",
    hpRegenPct: "生命恢复",
    goldBonus: "金币收益",
    dropPct: "物品掉率",
    rareDropBonus: "稀有掉率",
    materialQuantityBonus: "材料数量",
    baseExpBonus: "BASE经验",
    jobExpBonus: "JOB经验",
    echoChance: "回响概率",
    abyssDamageBonus: "深渊伤害",
    abyssDamageReduction: "深渊减伤",
    abyssExecuteDamageBonus: "深渊斩杀",
    skillChanceBonus: "技能触发",
    combatPaceBonus: "战斗节奏",
  };
  return names[key] || key;
}

function formatSkillMilestoneValue(key, value) {
  const num = Number(value || 0);
  if (!num) return "";
  return `${num > 0 ? "+" : "-"}${percent(Math.abs(num))}`;
}

function getSkillLevelMultiplier(skill) {
  const spec = getSkillGrowthEntry(skill).specialization;
  const specBonus = spec === "power" ? 0.2 : spec === "frequency" ? -0.08 : 0;
  const ms = getSkillMilestoneBonuses(skill);
  return 1 + (Math.max(1, getSkillLevel(skill)) - 1) * 0.02 + specBonus + (ms.milestoneMult || 0);
}

function getPassiveSkillMultiplier(skill) {
  const spec = getSkillGrowthEntry(skill).specialization;
  const specBonus = passiveSpecApplies(skill, spec) ? (spec === "enhance" ? 0.15 : 0.1) : 0;
  const ms = getSkillMilestoneBonuses(skill);
  return 1 + (Math.max(1, getSkillLevel(skill)) - 1) * 0.015 + specBonus + (ms.milestoneMult || 0);
}

function passiveSpecApplies(skill, spec) {
  if (!spec) return false;
  if (spec === "enhance") return true;
  if (spec === "utility") return Boolean(skill.goldPct || skill.dropPct);
  if (spec === "survival") return Boolean(skill.hpPct || skill.defPct);
  if (spec === "combat") return Boolean(skill.atkPct || skill.matkPct || skill.aspdPct || skill.critPct || skill.dpsPct);
  return false;
}

function getSkillSpecializationOptions(skill) {
  return Object.values(skill.active ? ACTIVE_SKILL_SPECIALIZATIONS : PASSIVE_SKILL_SPECIALIZATIONS);
}

function selectSkillSpecialization(skillId, specId) {
  const skillEntry = allJobSkills().find((entry) => entry.id === skillId);
  if (!skillEntry) return;
  const growth = ensureSkillGrowthEntry(skillId);
  if (growth.level < 15) {
    showToast("技能 Lv.15 后解锁专精");
    return;
  }
  if (growth.specialization) {
    showToast("该技能已选择专精");
    return;
  }
  const option = getSkillSpecializationOptions(skillEntry).find((entry) => entry.id === specId);
  if (!option) return;
  if (!window.confirm(`选择专精「${option.name}」？本次暂不支持重选。`)) return;
  growth.specialization = option.id;
  addLog(`技能专精：${skillEntry.name} 选择 ${option.name}。`);
  renderAll();
  save();
}

function allJobSkills() {
  return Object.values(jobTemplates).flatMap((job) => job.skills || []);
}

function normalizeEquipmentTemplate(item, fallbackId) {
  const rawSlot = item.slot || "trinket";
  const equipSlot = normalizeEquipmentSlot(rawSlot);
  const id = item.id || fallbackId;
  return {
    id,
    name: item.name,
    slot: rawSlot,
    equipSlot,
    weaponType: item.weaponType || "",
    armorType: item.armorType || "",
    subType: item.subType || inferEquipmentSubType({ ...item, equipSlot }),
    equipType: item.equipType || item.weaponType || item.armorType || rawSlot,
    rarity: item.rarity || "normal",
    quality: item.quality || item.rarity || "normal",
    level: item.level || 1,
    requiredLevel: item.requiredLevel || 1,
    requiredJob: item.requiredJob || [],
    allowedJobs: item.allowedJobs || [],
    image: item.image || `assets/images/equipment/${id}.png`,
    source: item.source || "monster_drop",
    description: item.description || "",
    atk: item.atk || 0,
    matk: item.matk || 0,
    def: item.def || 0,
    hp: item.hp || 0,
    aspd: item.aspd || 0,
    luck: item.luck || 0,
    gold: item.gold || 0,
    crit: item.crit || 0,
    drop: item.drop || 0,
    str: item.str || 0,
    agi: item.agi || 0,
    vit: item.vit || 0,
    int: item.int || 0,
    dex: item.dex || 0,
    luk: item.luk || 0,
    hpRegen: item.hpRegen || 0,
    dodgeRate: item.dodgeRate || 0,
    atkPct: item.atkPct || 0,
    matkPct: item.matkPct || 0,
    hpPct: item.hpPct || 0,
    defPct: item.defPct || 0,
    attackSpeedPct: item.attackSpeedPct || 0,
    critRatePct: item.critRatePct || 0,
    critDamageBonus: item.critDamageBonus || 0,
    skillDamageBonus: item.skillDamageBonus || 0,
    monsterDamageBonus: item.monsterDamageBonus || 0,
    bossDamageBonus: item.bossDamageBonus || 0,
    finalDamageBonus: item.finalDamageBonus || 0,
    eliteDamageBonus: item.eliteDamageBonus || 0,
    rareDropBonus: item.rareDropBonus || 0,
    damageReductionPct: item.damageReductionPct || 0,
    lifeSteal: item.lifeSteal || 0,
    baseExpBonus: item.baseExpBonus || 0,
    jobExpBonus: item.jobExpBonus || 0,
    equipmentDrop: item.equipmentDrop || 0,
    cardDrop: item.cardDrop || 0,
    materialQuantityBonus: item.materialQuantityBonus || 0,
    patrolEfficiency: item.patrolEfficiency || 0,
    hitRate: item.hitRate || 0,
    abyssDamageBonus: item.abyssDamageBonus || 0,
    abyssBossDamageBonus: item.abyssBossDamageBonus || 0,
    abyssDamageReduction: item.abyssDamageReduction || 0,
    mythicWeightBonus: item.mythicWeightBonus || 0,
  };
}

function normalizeEquipmentSlot(slot) {
  return (
    {
      body: "armor",
      bodyArmor: "armor",
      headTop: "headgear",
      accessory: "trinket",
    }[slot] || slot
  );
}

function equipmentSlot(item) {
  return item?.equipSlot || normalizeEquipmentSlot(item?.slot || "trinket");
}

function createDefaultState() {
  const runtime = window.RuneFrontierStateRuntime;
  if (runtime && typeof runtime.createDefaultState === "function") return runtime.createDefaultState();
  const starterItems = [
    createItem(itemPool[0], 1, "normal"),
    createItem(itemPool[6], 1, "normal"),
    createItem(itemPool[10], 1, "normal"),
    createItem(itemPool[12], 1, "normal"),
    createItem(itemPool[14], 1, "normal"),
  ];

  return {
    gold: 100,
    baseExp: 0,
    currentMap: 0,
    currentDifficulty: "normal",
    bestMap: 0,
    areaKills: 0,
    totalKills: 0,
    equipmentPityKills: 0,
    mapDifficultyProgress: { grass: { normal: { unlocked: true, cleared: false }, hard: { unlocked: false, cleared: false }, abyss: { unlocked: false, cleared: false } } },
    paused: false,
    enemyHp: 0,
    enemyMaxHp: 0,
    enemyBoss: false,
    enemyLevel: 1,
    enemyTemplateId: "",
    enemyMutationId: "",
    enemyGroup: null,
    enemyAttackTimer: 0,
    playerAttackTimer: 0,
    damageCarry: 0,
    regenTimer: 0,
    offlinePending: null,
    offlineRewards: defaultOfflineRewards(),
    hero: {
      id: "main",
      name: "露恩学徒",
      baseLevel: 1,
      baseExp: 0,
      jobId: "novice",
      jobLevel: 1,
      jobExp: 0,
      jobHistory: ["novice"],
      attributes: { str: 5, agi: 5, vit: 5, int: 5, dex: 5, luk: 5 },
      trainingPct: defaultTrainingPct(),
      currentHp: null,
      maxHp: null,
      renameUsed: false,
      rebirths: 0,
    },
    formation: {
      front: "main",
      mid: null,
      back: null,
    },
    inventory: starterItems,
    equipped: {
      weapon: starterItems[0].id,
      armor: starterItems[1].id,
      headgear: starterItems[2].id,
      shoes: starterItems[3].id,
      trinket: starterItems[4].id,
    },
    cards: {},
    awakenedCards: {},
    cardFavorites: {},
    cardResearch: {},
    craftedSetItems: {},
    materials: {},
    monsterCodex: {},
    cardCodex: {},
    codexRewardsClaimed: { monster: {}, card: {} },
    selectedEnhanceItem: null,
    shopState: { dailyPurchases: {}, weeklyPurchases: {}, totalPurchases: {}, lastDailyRefresh: "", lastWeeklyRefresh: "" },
    autoSalvage: { enabled: false, maxRarity: "normal", autoDismantleAbyss: false },
    autoDismantleAbyss: false,
    settings: { autoBoss: false, autoBossCooldownUntil: 0, soundEnabled: false, soundVolume: 0.55 },
    zodiacCollection: {},
    costumes: { owned: [], equipped: { back: null } },
    mapExploration: {},
    achievementProgress: {},
    titles: { owned: [], equipped: null },
    rebirthPrestige: { level: 0, exp: 0, totalRebirths: 0 },
    lastOfflineRewardsForView: null,
    recentLoot: [],
    lootFeed: [],
    lootNotifyUnread: false,
    lastLootViewedAt: 0,
    lastLootUpdatedAt: 0,
    dailyGoals: defaultDailyGoals(),
    vip: defaultVipState(),
    quests: defaultQuestState(),
    skillGrowth: defaultSkillGrowth(),
    mapPoolVersion: MAP_POOL_VERSION,
    floatTexts: [],
    skillLog: [],
    log: ["初学者在南门登记冒险。"],
    lastSavedAt: Date.now(),
    lastActiveAt: Date.now(),
  };
}

function init() {
  cacheElements();
  load();
  sanitizeProgression();
  spawnEnemy(false);
  bindEvents();
  refreshAuthUi();
  restoreSession();
  renderAll();
  requestAnimationFrame(loop);
}

function cacheElements() {
  [
    "saveState",
    "authUser",
    "authPass",
    "authStatus",
    "loginButton",
    "registerButton",
    "logoutButton",
    "goldValue",
    "teamLevelValue",
    "expValue",
    "powerValue",
    "gpsValue",
    "mapName",
    "pauseButton",
    "pauseIcon",
    "sceneCanvas",
    "enemyName",
    "enemyHpText",
    "enemyHpBar",
    "playerHpName",
    "playerHpText",
    "playerHpBar",
    "playerHpRegen",
    "frontHero",
    "midHero",
    "backHero",
    "bossButton",
    "autoBossToggle",
    "claimButton",
    "offlineEntry",
    "offlineEntryTitle",
    "offlineEntryMeta",
    "offlineViewButton",
    "offlineRewardModal",
    "offlineRewardBody",
    "offlineRewardClose",
    "offlineRewardSkip",
    "offlineRewardConfirm",
    "combatSidebar",
    "refineResultModal",
    "refineResultTitle",
    "refineResultBody",
    "refineResultClose",
    "refineResultConfirm",
    "refineResultContinue",
    "resetButton",
    "upgradeAllButton",
    "equipBestButton",
    "salvageAllButton",
    "heroList",
    "equippedSlots",
    "materialList",
    "equipmentGrid",
    "equipmentFilterBar",
    "mapList",
    "cardList",
    "codexContent",
    "shopContent",
    "vipPanel",
    "taskPage",
    "refreshDailyButton",
    "questList",
    "partyList",
    "academyStatus",
    "academyGrid",
    "townTips",
    "townIdentity",
    "jobTree",
    "smithySetList",
    "smithyPageContent",
    "logList",
    "toast",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function ensureRefineActionButtons() {
  const modal = document.getElementById("refineResultModal");
  if (!modal) return;
  const actions = modal.querySelector(".modal-actions");
  if (!actions) return;
  let continueButton = document.getElementById("refineResultContinue");
  if (!continueButton) {
    continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.id = "refineResultContinue";
    continueButton.className = "refine-action-primary";
    continueButton.textContent = "继续操作";
    actions.appendChild(continueButton);
  }
  const title = document.getElementById("refineResultTitle");
  if (title) title.textContent = "操作结果";
  const close = document.getElementById("refineResultClose");
  if (close) {
    close.textContent = "×";
    close.setAttribute("aria-label", "关闭");
  }
  const confirm = document.getElementById("refineResultConfirm");
  if (confirm) confirm.textContent = "关闭";
  continueButton.textContent = "继续操作";
}

// [BRIDGE] Event wiring — 40+ listeners. All callbacks invoke game.js functions that delegate to runtime modules where applicable.
// Non-delegated callbacks (presentation/DOM): openOfflineRewardModal, closeOfflineRewardModal, closeRefineResultModal, showToast, punchCardSlot, setAutoBossEnabled, loadAuth, refreshAuthUi, logout, toggleAutoBoss, ensureSettings.
// Delegated callbacks: challengeBoss, claimOffline, refineItem, renderAll, salvageItem, salvageAllUnequipped, equipBest, enhanceItem, empowerItem, buyShopItem, claimCodexReward, toggleItemLock.
function bindEvents() {
  ensureRefineActionButtons();
  cacheElements();
  document.querySelectorAll(".page-tabs button").forEach((button) => {
    button.addEventListener("click", () => {
      activePage = button.dataset.page;
      renderPages();
    });
  });

  els.pauseButton.addEventListener("click", () => {
    state.paused = !state.paused;
    addLog(state.paused ? "角色在城外扎营休息。" : "角色重新出发。");
    renderAll();
  });

  els.bossButton.addEventListener("click", () => {
    challengeBoss({ auto: false });
  });
  if (els.autoBossToggle) {
    els.autoBossToggle.addEventListener("change", (event) => {
      setAutoBossEnabled(event.target.checked);
    });
  }

  els.claimButton.addEventListener("click", openOfflineRewardModal);
  if (els.offlineViewButton) els.offlineViewButton.addEventListener("click", openOfflineRewardModal);
  if (els.offlineRewardClose) els.offlineRewardClose.addEventListener("click", closeOfflineRewardModal);
  if (els.offlineRewardSkip) els.offlineRewardSkip.addEventListener("click", closeOfflineRewardModal);
  if (els.offlineRewardConfirm) els.offlineRewardConfirm.addEventListener("click", claimOffline);
  document.querySelectorAll("[data-close-offline-modal]").forEach((node) => {
    node.addEventListener("click", closeOfflineRewardModal);
  });
  if (els.refineResultClose) els.refineResultClose.addEventListener("click", closeRefineResultModal);
  if (els.refineResultConfirm) els.refineResultConfirm.addEventListener("click", closeRefineResultModal);
  if (els.refineResultContinue) {
    els.refineResultContinue.addEventListener("click", () => {
      if (refineResultState?.type === "socket") {
        const socketItem = state.inventory.find((entry) => entry.id === refineResultState.itemId);
        if (!socketItem) {
          showToast("装备已不存在");
          closeRefineResultModal();
          return;
        }
        punchCardSlot(socketItem.id);
        return;
      }
      const itemId = refineResultState?.itemId;
      if (!itemId) return;
      const item = state.inventory.find((entry) => entry.id === itemId);
      if (!item) {
        showToast("装备已不存在");
        closeRefineResultModal();
        return;
      }
      if (!canContinueRefine(item)) return;
      refineItem(itemId);
    });
  }
  document.querySelectorAll("[data-close-refine-modal]").forEach((node) => {
    node.addEventListener("click", closeRefineResultModal);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (refineResultState) closeRefineResultModal();
    if (offlineRewardModalOpen) closeOfflineRewardModal();
  });
  els.resetButton.addEventListener("click", resetSave);
  els.loginButton.addEventListener("click", () => submitAuth("login"));
  els.registerButton.addEventListener("click", () => submitAuth("register"));
  els.logoutButton.addEventListener("click", logout);
  els.authPass.addEventListener("keydown", (event) => {
    if (event.key === "Enter") submitAuth("login");
  });
  els.upgradeAllButton.addEventListener("click", trainBase);
  els.equipBestButton.addEventListener("click", equipBest);
  els.salvageAllButton.addEventListener("click", salvageAllUnequipped);
  els.materialList.addEventListener("change", (event) => {
    if (event.target.matches("[data-auto-salvage-enabled]")) {
      state.autoSalvage.enabled = event.target.checked;
      save();
    }
    if (event.target.matches("[data-auto-salvage-rarity]")) {
      state.autoSalvage.maxRarity = event.target.value;
      save();
    }
    if (event.target.matches("[data-auto-dismantle-abyss]")) {
      state.autoSalvage.autoDismantleAbyss = event.target.checked;
      state.autoDismantleAbyss = event.target.checked;
      save();
    }
    renderEquipment();
  });
  els.materialList.addEventListener("click", (event) => {
    const batchButton = event.target.closest("button[data-batch-equipment]");
    if (batchButton) {
      runEquipmentBatchAction(batchButton.dataset.batchEquipment);
      return;
    }
    const equipCostumeButton = event.target.closest("button[data-equip-costume]");
    if (equipCostumeButton) {
      equipCostume(equipCostumeButton.dataset.equipCostume);
      return;
    }
    const unequipCostumeButton = event.target.closest("button[data-unequip-costume]");
    if (unequipCostumeButton) {
      unequipCostume(unequipCostumeButton.dataset.unequipCostume);
    }
  });
  els.heroList.addEventListener("click", (event) => {
    const trainButton = event.target.closest("button[data-upgrade]");
    if (trainButton) trainBase();
    const batchButton = event.target.closest("button[data-batch-upgrade]");
    if (batchButton) batchTrainBase();
    const rebirthButton = event.target.closest("button[data-rebirth]");
    if (rebirthButton) rebirthHero();
    const renameButton = event.target.closest("button[data-rename-hero]");
    if (renameButton) renameHero();
    const specButton = event.target.closest("button[data-skill-spec]");
    if (specButton) selectSkillSpecialization(specButton.dataset.skillId, specButton.dataset.skillSpec);
    const titleButton = event.target.closest("button[data-equip-title]");
    if (titleButton) equipTitle(titleButton.dataset.equipTitle || null);
  });

  document.querySelectorAll(".slot").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSlot = button.dataset.slot;
      renderAll();
    });
  });

  els.equipmentFilterBar.addEventListener("click", (event) => {
    const filterButton = event.target.closest("button[data-equipment-filter]");
    if (filterButton) {
      equipmentFilter = filterButton.dataset.equipmentFilter || "all";
      equipmentShowAll = false;
      renderEquipment();
      return;
    }
    const showAllButton = event.target.closest("button[data-equipment-show-all]");
    if (showAllButton) {
      equipmentShowAll = !equipmentShowAll;
      renderEquipment();
      return;
    }
  });
  els.equipmentFilterBar.addEventListener("change", (event) => {
    const sortSelect = event.target.closest("select[data-equipment-sort]");
    if (!sortSelect) return;
    equipmentSort = sortSelect.value || "score";
    renderEquipment();
  });

  els.equipmentGrid.addEventListener("click", (event) => {
    const detailSummary = event.target.closest("summary[data-equipment-detail-toggle]");
    if (detailSummary) {
      event.preventDefault();
      toggleEquipmentDetailExpanded(detailSummary.dataset.equipmentDetailToggle);
      return;
    }
    const equipButton = event.target.closest("button[data-equip-item]");
    if (equipButton) {
      equipItem(equipButton.dataset.equipItem);
      return;
    }
    const salvageButton = event.target.closest("button[data-salvage-item]");
    if (salvageButton) {
      salvageItem(salvageButton.dataset.salvageItem);
      return;
    }
    const refineButton = event.target.closest("button[data-refine-item]");
    if (refineButton) {
      refineItem(refineButton.dataset.refineItem);
      return;
    }
    const empowerButton = event.target.closest("button[data-empower-item]");
    if (empowerButton) {
      empowerItem(empowerButton.dataset.empowerItem);
      return;
    }
    const lockButton = event.target.closest("button[data-lock-item]");
    if (lockButton) {
      toggleItemLock(lockButton.dataset.lockItem);
      return;
    }
    const collectButton = event.target.closest("button[data-collect-zodiac]");
    if (collectButton) {
      collectZodiacItem(collectButton.dataset.collectZodiac);
      return;
    }
    const zodiacSalvageButton = event.target.closest("button[data-zodiac-salvage]");
    if (zodiacSalvageButton) {
      decomposeZodiacItem(zodiacSalvageButton.dataset.zodiacSalvage);
      return;
    }
    const punchButton = event.target.closest("button[data-punch-card-slot]");
    if (punchButton) {
      punchCardSlot(punchButton.dataset.punchCardSlot);
      return;
    }
    const socketButton = event.target.closest("button[data-socket-card]");
    if (socketButton) {
      const row = socketButton.closest(".card-socket-row");
      const select = row?.querySelector("select[data-card-socket-select]");
      socketCardToEquipment(socketButton.dataset.socketCard, socketButton.dataset.socketIndex, select?.value || "");
      return;
    }
    const removeSocketButton = event.target.closest("button[data-remove-socket-card]");
    if (removeSocketButton) {
      removeSocketedCard(removeSocketButton.dataset.removeSocketCard, removeSocketButton.dataset.socketIndex);
    }
  });

  els.mapList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-map]");
    if (!button) return;
    const index = Number(button.dataset.map);
    if (index > state.bestMap) return;
    const diff = button.dataset.difficulty || "normal";
    const dp = (state.mapDifficultyProgress || {})[maps[index].id];
    if (dp) {
      const entry = dp[diff];
      if (!entry || !entry.unlocked) {
        if (diff === "hard") showToast("请先通关本章普通难度以解锁困难。");
        else if (diff === "abyss") showToast("请先通关本章困难难度以解锁深渊。");
        else showToast("该难度尚未解锁。");
        return;
      }
    }
    state.currentMap = index;
    state.currentDifficulty = DIFFICULTY_CONFIG[button.dataset.difficulty] ? button.dataset.difficulty : state.currentDifficulty || "normal";
    state.areaKills = 0;
    spawnEnemy(false);
    addLog(`前往 ${maps[index].name}。`);
    renderAll();
  });

  els.cardList.addEventListener("click", (event) => {
    const synthButton = event.target.closest("button[data-synthesize-boss-card]");
    if (synthButton) {
      synthesizeBossCard(synthButton.dataset.synthesizeBossCard);
      return;
    }
    const awakenButton = event.target.closest("button[data-awaken-card]");
    if (awakenButton) {
      awakenCard(awakenButton.dataset.awakenCard);
      return;
    }
    const button = event.target.closest("button[data-card-favorite]");
    if (!button) return;
    const id = button.dataset.cardFavorite;
    state.cardFavorites[id] = !state.cardFavorites[id];
    addLog(`${cardName(id)} ${state.cardFavorites[id] ? "加入收藏" : "移出收藏"}。`);
    renderAll();
  });

  document.querySelectorAll(".codex-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      codexActiveTab = btn.dataset.codexTab || "monster";
      renderCodex();
    });
  });

  document.querySelectorAll("[data-shop-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      shopActiveTab = btn.dataset.shopTab || "normal";
      renderShop();
    });
  });

els.shopContent.addEventListener("click", (event) => {
  const buyBtn = event.target.closest("button[data-buy-shop]");
  if (buyBtn) buyShopItem(buyBtn.dataset.buyShop);
});

els.vipPanel.addEventListener("click", (event) => {
  const giftBtn = event.target.closest("button[data-claim-vip-gift]");
  if (giftBtn) claimVipDailyGift();
});

  els.codexContent.addEventListener("click", (event) => {
    const claimBtn = event.target.closest("button[data-claim-codex]");
    if (claimBtn) {
      claimCodexReward(claimBtn.dataset.claimCodex, claimBtn.dataset.monsterId, claimBtn.dataset.milestone);
    }
  });

  els.taskPage.addEventListener("click", (event) => {
    const dailyButton = event.target.closest("button[data-claim-daily-goal]");
    if (dailyButton) {
      claimDailyGoal(dailyButton.dataset.claimDailyGoal);
      return;
    }
    const achievementButton = event.target.closest("button[data-claim-achievement]");
    if (achievementButton) {
      claimAchievementReward(achievementButton.dataset.claimAchievement);
      return;
    }
    const button = event.target.closest("button[data-claim-quest]");
    if (!button) return;
    claimQuestReward(button.dataset.claimQuest);
  });

  els.refreshDailyButton.addEventListener("click", () => {
    refreshDailyQuestsIfNeeded(true);
    showToast("日常任务已刷新");
    renderAll();
    save();
  });

  els.academyGrid.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-change-job]");
    if (!button) return;
    changeJob(button.dataset.changeJob);
  });

  if (els.smithySetList) els.smithySetList.addEventListener("click", (event) => {
    const tabButton = event.target.closest("button[data-smithy-tab]");
    if (tabButton) {
      smithyActiveTab = tabButton.dataset.smithyTab || "enhance";
      renderSmithyPage();
      return;
    }
    const button = event.target.closest("button[data-craft-set-item]");
    if (button) {
      craftSetItem(button.dataset.craftSetItem);
      return;
    }
    const costumeButton = event.target.closest("button[data-craft-costume]");
    if (costumeButton) {
      craftCostume(costumeButton.dataset.craftCostume);
      return;
    }
    const darkGoldButton = event.target.closest("button[data-darkgold-exchange]");
    if (darkGoldButton) {
      exchangeDarkGoldEquipment(darkGoldButton.dataset.darkgoldExchange, darkGoldButton.dataset.slot || "");
      return;
    }
    const enhanceButton = event.target.closest("button[data-enhance-item]");
    if (enhanceButton) {
      enhanceItem(enhanceButton.dataset.enhanceItem);
      return;
    }
    const refineButton = event.target.closest("button[data-refine-item]");
    if (refineButton) {
      refineItem(refineButton.dataset.refineItem);
      return;
    }
    const punchButton = event.target.closest("button[data-punch-card-slot]");
    if (punchButton) {
      punchCardSlot(punchButton.dataset.punchCardSlot);
    }
  });
  if (els.smithySetList) els.smithySetList.addEventListener("change", (event) => {
    const select = event.target.closest("select[data-enhance-select]");
    if (select) {
      state.selectedEnhanceItem = select.value;
      renderSmithyPage();
    }
  });

  els.smithyPageContent.addEventListener("click", (event) => {
    const tabButton = event.target.closest("button[data-smithy-tab]");
    if (tabButton) {
      smithyActiveTab = tabButton.dataset.smithyTab || "enhance";
      renderSmithyPage();
      return;
    }
    const craftButton = event.target.closest("button[data-craft-set-item]");
    if (craftButton) {
      craftSetItem(craftButton.dataset.craftSetItem);
      return;
    }
    const costumeButton = event.target.closest("button[data-craft-costume]");
    if (costumeButton) {
      craftCostume(costumeButton.dataset.craftCostume);
      return;
    }
    const darkGoldButton = event.target.closest("button[data-darkgold-exchange]");
    if (darkGoldButton) {
      exchangeDarkGoldEquipment(darkGoldButton.dataset.darkgoldExchange, darkGoldButton.dataset.slot || "");
      return;
    }
    const enhanceButton = event.target.closest("button[data-enhance-item]");
    if (enhanceButton) {
      enhanceItem(enhanceButton.dataset.enhanceItem);
      return;
    }
    const refineButton = event.target.closest("button[data-refine-item]");
    if (refineButton) {
      refineItem(refineButton.dataset.refineItem);
      return;
    }
    const punchButton = event.target.closest("button[data-punch-card-slot]");
    if (punchButton) {
      punchCardSlot(punchButton.dataset.punchCardSlot);
    }
  });
  els.smithyPageContent.addEventListener("change", (event) => {
    const select = event.target.closest("select[data-enhance-select]");
    if (select) {
      state.selectedEnhanceItem = select.value;
      renderSmithyPage();
    }
  });

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    if (actionButton.dataset.action === "toggle-auto-boss") {
      toggleAutoBoss();
    }
  });

  window.addEventListener("beforeunload", save);
}

function ensureSettings() {
  state.settings = { autoBoss: false, autoBossCooldownUntil: 0, soundEnabled: false, soundVolume: 0.55, ...(state.settings || {}) };
  if (typeof state.autoBoss !== "undefined") {
    state.settings.autoBoss = Boolean(state.settings.autoBoss || state.autoBoss);
    delete state.autoBoss;
  }
  state.settings.autoBoss = Boolean(state.settings.autoBoss);
  state.settings.autoBossCooldownUntil = Math.max(0, Number(state.settings.autoBossCooldownUntil) || 0);
  state.settings.soundEnabled = Boolean(state.settings.soundEnabled);
  state.settings.soundVolume = clampNumber(Number(state.settings.soundVolume) || 0.55, 0, 1);
  return state.settings;
}

function getAutoBossEnabled() {
  return Boolean(ensureSettings().autoBoss);
}

function setAutoBossEnabled(enabled) {
  const next = Boolean(enabled);
  const settings = ensureSettings();
  if (settings.autoBoss === next) {
    renderFast();
    return;
  }
  settings.autoBoss = next;
  showToast(settings.autoBoss ? "自动挑战BOSS已开启" : "自动挑战BOSS已关闭");
  addLog(settings.autoBoss ? "已开启自动挑战 BOSS。" : "已关闭自动挑战 BOSS。");
  if (settings.autoBoss) tryAutoChallengeBoss("toggle");
  renderAll();
  save();
}

function toggleAutoBoss() {
  setAutoBossEnabled(!getAutoBossEnabled());
}

function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || { token: "", username: "" };
  } catch {
    return { token: "", username: "" };
  }
}

function persistAuth(nextAuth) {
  auth = nextAuth;
  if (auth.token) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
  refreshAuthUi();
}

function refreshAuthUi() {
  const loggedIn = Boolean(auth.token && auth.username);
  els.authUser.value = loggedIn ? auth.username : els.authUser.value;
  els.authUser.disabled = loggedIn;
  els.authPass.disabled = loggedIn;
  els.loginButton.classList.toggle("hidden", loggedIn);
  els.registerButton.classList.toggle("hidden", loggedIn);
  els.logoutButton.classList.toggle("hidden", !loggedIn);
  els.authStatus.textContent = loggedIn ? `${auth.username} 已登录` : "游客存档";
}

async function submitAuth(mode) {
  const username = els.authUser.value.trim();
  const password = els.authPass.value;
  if (!username || !password) {
    showToast("请输入用户名和密码");
    return;
  }
  try {
    const result = await apiRequest(`/api/${mode}`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    persistAuth({ token: result.token, username: result.username });
    els.authPass.value = "";
    showToast(mode === "register" ? "注册成功，已登录" : "登录成功");
    await loadRemoteSave();
    save();
  } catch (error) {
    showToast(error.message || "账号服务暂不可用");
  }
}

async function restoreSession() {
  if (!auth.token) return;
  try {
    const result = await apiRequest("/api/me");
    persistAuth({ token: auth.token, username: result.username });
    await loadRemoteSave();
  } catch {
    persistAuth({ token: "", username: "" });
    els.saveState.textContent = "游客存档";
  }
}

async function loadRemoteSave() {
  if (!auth.token) return;
  const result = await apiRequest("/api/save");
  if (!result.state) {
    els.saveState.textContent = "账号已连接";
    return;
  }
  state = mergeState(createDefaultState(), result.state);
  sanitizeProgression();
  const elapsed = Math.max(0, Math.floor((Date.now() - (state.lastActiveAt || state.lastSavedAt || Date.now())) / 1000));
  state.offlinePending = mergeOfflineRewards(state.offlineRewards, buildOfflineReward(elapsed));
  state.offlineRewards = state.offlinePending;
  spawnEnemy(false);
  renderAll();
}

async function logout() {
  try {
    if (auth.token) await apiRequest("/api/logout", { method: "POST" });
  } catch {
    // Logging out locally is still useful if the network is unavailable.
  }
  persistAuth({ token: "", username: "" });
  els.authPass.value = "";
  showToast("已退出账号，当前使用本地存档");
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (auth.token) headers.Authorization = `Bearer ${auth.token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data.error || "请求失败");
  return data;
}

function load() {
  const runtime = window.RuneFrontierStateRuntime;
  if (runtime && typeof runtime.load === "function") return runtime.load();
  const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
  if (!raw) {
    state.offlinePending = buildOfflineReward(0);
    state.offlineRewards = state.offlinePending;
    return;
  }

  try {
    const saved = JSON.parse(raw);
    state = mergeState(createDefaultState(), saved);
    sanitizeProgression();
    const elapsed = Math.max(0, Math.floor((Date.now() - (state.lastActiveAt || state.lastSavedAt || Date.now())) / 1000));
    state.offlinePending = mergeOfflineRewards(state.offlineRewards, buildOfflineReward(elapsed));
    state.offlineRewards = state.offlinePending;
  } catch {
    state = createDefaultState();
    state.offlinePending = buildOfflineReward(0);
    state.offlineRewards = state.offlinePending;
  }
}

function mergeState(base, saved) {
  const runtime = window.RuneFrontierStateRuntime;
  if (runtime && typeof runtime.mergeState === "function") return runtime.mergeState(base, saved);
  const oldHero = Array.isArray(saved.heroes) ? saved.heroes.find((hero) => hero.unlocked) || saved.heroes[0] : null;
  const hero = saved.hero || {
    ...base.hero,
    baseLevel: saved.teamLevel || oldHero?.level || 1,
    baseExp: saved.exp || 0,
    jobLevel: Math.max(1, Math.floor(oldHero?.jobLevel || 1)),
    jobExp: 0,
  };
  const inventory = Array.isArray(saved.inventory) && saved.inventory.length ? saved.inventory : base.inventory;

  return {
    ...base,
    ...saved,
    baseExp: saved.baseExp ?? saved.exp ?? hero.baseExp ?? 0,
    hero: {
      ...base.hero,
      ...hero,
      jobId: jobTemplates[hero.jobId] ? hero.jobId : "novice",
      jobHistory: Array.isArray(hero.jobHistory) ? hero.jobHistory : ["novice"],
      attributes: { ...base.hero.attributes, ...(hero.attributes || {}) },
      trainingPct: { ...defaultTrainingPct(), ...(hero.trainingPct || {}) },
      currentHp: Number.isFinite(hero.currentHp) ? hero.currentHp : null,
      maxHp: Number.isFinite(hero.maxHp) ? hero.maxHp : null,
      renameUsed: Boolean(hero.renameUsed),
      rebirths: hero.rebirths || 0,
    },
    formation: { ...base.formation, ...(saved.formation || {}), front: "main" },
    equipped: { ...base.equipped, ...(saved.equipped || {}) },
    cards: { ...base.cards, ...(saved.cards || {}) },
    awakenedCards: { ...base.awakenedCards, ...(saved.awakenedCards || {}) },
    cardFavorites: { ...base.cardFavorites, ...(saved.cardFavorites || {}) },
    cardResearch: { ...base.cardResearch, ...(saved.cardResearch || {}) },
    craftedSetItems: { ...base.craftedSetItems, ...(saved.craftedSetItems || {}) },
    materials: { ...base.materials, ...(saved.materials || {}) },
    monsterCodex: saved.monsterCodex || base.monsterCodex || {},
    cardCodex: saved.cardCodex || base.cardCodex || {},
    codexRewardsClaimed: { monster: { ...(base.codexRewardsClaimed?.monster || {}), ...(saved.codexRewardsClaimed?.monster || {}) }, card: { ...(base.codexRewardsClaimed?.card || {}), ...(saved.codexRewardsClaimed?.card || {}) } },
    autoSalvage: { ...base.autoSalvage, ...(saved.autoSalvage || {}), autoDismantleAbyss: Boolean(saved.autoSalvage?.autoDismantleAbyss || saved.autoDismantleAbyss) },
    autoDismantleAbyss: Boolean(saved.autoDismantleAbyss || saved.autoSalvage?.autoDismantleAbyss),
    settings: { ...base.settings, ...(saved.settings || {}), autoBoss: Boolean(saved.settings?.autoBoss || saved.autoBoss) },
    zodiacCollection: normalizeZodiacCollection(saved.zodiacCollection || base.zodiacCollection),
    costumes: normalizeCostumes(saved.costumes || base.costumes),
    mapExploration: normalizeMapExploration(saved.mapExploration || base.mapExploration),
    achievementProgress: normalizeAchievementProgress(saved.achievementProgress || saved.achievements || base.achievementProgress),
    titles: normalizeTitles(saved.titles || base.titles),
    rebirthPrestige: normalizeRebirthPrestige(saved.rebirthPrestige || base.rebirthPrestige, hero.rebirths || 0),
    lastOfflineRewardsForView: saved.lastOfflineRewardsForView ? normalizeOfflineRewards(saved.lastOfflineRewardsForView) : null,
    recentLoot: normalizeRecentLoot(saved.recentLoot || base.recentLoot),
    lootNotifyUnread: Boolean(saved.lootNotifyUnread),
    lastLootViewedAt: Number(saved.lastLootViewedAt || 0),
    lastLootUpdatedAt: Number(saved.lastLootUpdatedAt || 0),
    dailyGoals: normalizeDailyGoals(saved.dailyGoals || base.dailyGoals),
    vip: { ...base.vip, ...(saved.vip || {}) },
    quests: normalizeQuests(saved.quests || base.quests),
    skillGrowth: { ...defaultSkillGrowth(), ...(saved.skillGrowth || {}) },
    mapPoolVersion: saved.mapPoolVersion || 0,
    needsMapPoolMigration: saved.mapPoolVersion !== MAP_POOL_VERSION,
    offlineRewards: normalizeOfflineRewards(saved.offlineRewards || saved.offlinePending || base.offlineRewards),
    floatTexts: [],
    skillLog: Array.isArray(saved.skillLog) ? saved.skillLog.slice(0, 8) : [],
    inventory: inventory.map(normalizeItem),
    log: Array.isArray(saved.log) && saved.log.length ? saved.log.slice(0, 24) : base.log,
    mapDifficultyProgress: normalizeMapDifficultyProgress(saved.mapDifficultyProgress, saved.bestMap, saved.currentDifficulty),
    shopState: saved.shopState || base.shopState || { dailyPurchases: {}, weeklyPurchases: {}, totalPurchases: {}, lastDailyRefresh: "", lastWeeklyRefresh: "" },
  };
}

function normalizeMapDifficultyProgress(progress, legacyBestMap, legacyDifficulty) {
  const allMaps = maps;
  const defaults = {};
  allMaps.forEach((map, index) => {
    const existing = (progress && progress[map.id]) || {};
    const normalUnlocked = index === 0 || Boolean(existing.normal?.unlocked) || ((existing.normal?.cleared && index > 0) ? true : false);
    const hardUnlocked = Boolean(existing.hard?.unlocked) || Boolean(existing.hard?.cleared);
    const abyssUnlocked = Boolean(existing.abyss?.unlocked) || Boolean(existing.abyss?.cleared);
    if (!progress && legacyBestMap !== undefined && index <= legacyBestMap) {
      defaults[map.id] = {
        normal: { unlocked: true, cleared: Boolean(existing.normal?.cleared) },
        hard: { unlocked: hardUnlocked || (legacyDifficulty === "hard" && index === legacyBestMap ? true : false), cleared: Boolean(existing.hard?.cleared) },
        abyss: { unlocked: abyssUnlocked || (legacyDifficulty === "abyss" && index === legacyBestMap ? true : false), cleared: Boolean(existing.abyss?.cleared) },
      };
    } else {
      defaults[map.id] = {
        normal: { unlocked: normalUnlocked, cleared: Boolean(existing.normal?.cleared) },
        hard: { unlocked: hardUnlocked, cleared: Boolean(existing.hard?.cleared) },
        abyss: { unlocked: abyssUnlocked, cleared: Boolean(existing.abyss?.cleared) },
      };
    }
  });
  return defaults;
}

function sanitizeProgression() {
  const runtime = window.RuneFrontierStateRuntime;
  if (runtime && typeof runtime.sanitizeProgression === "function") return runtime.sanitizeProgression();
  migrateMapPoolIfNeeded();
  if (state.materials && state.materials.grassBossSoul > 0) {
    state.materials.grassEssence = (state.materials.grassEssence || 0) + state.materials.grassBossSoul;
    state.materials.grassBossSoul = 0;
  }
  state.bestMap = clampNumber(state.bestMap, 0, maps.length - 1);
  state.currentMap = clampNumber(state.currentMap, 0, state.bestMap);
  state.currentDifficulty = DIFFICULTY_CONFIG[state.currentDifficulty] ? state.currentDifficulty : "normal";
  const dp = (state.mapDifficultyProgress || {})[currentMap().id];
  if (dp && state.currentDifficulty !== "normal") {
    const entry = dp[state.currentDifficulty];
    if (!entry || !entry.unlocked) state.currentDifficulty = "normal";
  }
  state.areaKills = clampNumber(state.areaKills, 0, bossRequirement());
  state.hero.baseLevel = Math.max(1, Math.floor(state.hero.baseLevel || 1));
  state.hero.jobLevel = Math.max(1, Math.floor(state.hero.jobLevel || 1));
  state.hero.attributes = { str: 5, agi: 5, vit: 5, int: 5, dex: 5, luk: 5, ...(state.hero.attributes || {}) };
  state.hero.trainingPct = { ...defaultTrainingPct(), ...(state.hero.trainingPct || {}) };
  state.hero.renameUsed = Boolean(state.hero.renameUsed);
  state.skillGrowth = { ...defaultSkillGrowth(), ...(state.skillGrowth || {}) };
  state.enemyLevel = Math.max(1, Math.floor(state.enemyLevel || 1));
  state.enemyTemplateId = state.enemyTemplateId || "";
  state.enemyMutationId = state.enemyMutationId || "";
  state.enemyGroup = normalizeEnemyGroup(state.enemyGroup);
  state.enemyAttackTimer = state.enemyAttackTimer || 0;
  state.playerAttackTimer = state.playerAttackTimer || 0;
  state.damageCarry = Math.max(0, Number(state.damageCarry) || 0);
  state.regenTimer = state.regenTimer || 0;
  ["body", "bodyArmor", "headTop", "accessory"].forEach((slot) => {
    const mapped = normalizeEquipmentSlot(slot);
    if (state.equipped?.[slot] && !state.equipped[mapped]) state.equipped[mapped] = state.equipped[slot];
    if (state.equipped && slot !== mapped) delete state.equipped[slot];
  });
  state.craftedSetItems = state.craftedSetItems || {};
  state.lootFeed = normalizeLootFeed(state.lootFeed);
  state.awakenedCards = state.awakenedCards || {};
  state.autoSalvage = { enabled: false, maxRarity: "normal", autoDismantleAbyss: false, ...(state.autoSalvage || {}) };
  state.autoDismantleAbyss = Boolean(state.autoDismantleAbyss || state.autoSalvage.autoDismantleAbyss);
  state.autoSalvage.autoDismantleAbyss = state.autoDismantleAbyss;
  state.recentLoot = normalizeRecentLoot(state.recentLoot);
  state.lootNotifyUnread = Boolean(state.lootNotifyUnread);
  state.lastLootViewedAt = Number(state.lastLootViewedAt || 0);
  state.lastLootUpdatedAt = Number(state.lastLootUpdatedAt || 0);
  ensureSettings();
  state.zodiacCollection = normalizeZodiacCollection(state.zodiacCollection);
  state.costumes = normalizeCostumes(state.costumes);
  state.mapExploration = normalizeMapExploration(state.mapExploration);
  state.achievementProgress = normalizeAchievementProgress(state.achievementProgress);
  state.titles = normalizeTitles(state.titles);
  state.rebirthPrestige = normalizeRebirthPrestige(state.rebirthPrestige, state.hero.rebirths || 0);
  normalizeSkillGrowthSpecializations();
  if (!rarityOrder.includes(state.autoSalvage.maxRarity) || ["ancient", "legend", "darkGold", "mythic"].includes(state.autoSalvage.maxRarity)) state.autoSalvage.maxRarity = "normal";
  state.vip = normalizeVip(state.vip);
  state.quests = normalizeQuests(state.quests);
  ensureQuestLists();
  if (!jobTemplates[state.hero.jobId]) state.hero.jobId = "novice";
  state.formation.front = "main";
  state.formation.mid = null;
  state.formation.back = null;
  syncHeroHp(computeStats(), false);
}

function migrateMapPoolIfNeeded() {
  if (!state.needsMapPoolMigration) return;
  const oldOrderToId = ["grass", "forest", "mine", "clock", "sky"];
  const mapIdToIndex = Object.fromEntries(maps.map((map, index) => [map.id, index]));
  const migrateIndex = (index) => mapIdToIndex[oldOrderToId[index]] ?? clampNumber(index || 0, 0, maps.length - 1);
  state.currentMap = migrateIndex(state.currentMap || 0);
  state.bestMap = migrateIndex(state.bestMap || 0);
  state.mapPoolVersion = MAP_POOL_VERSION;
  state.needsMapPoolMigration = false;
}

function normalizeVip(vip = {}) {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.normalizeVip === "function") {
    return runtime.normalizeVip(vip);
  }
  return {
    level: clampNumber(Math.floor(vip.level || 0), 0, VIP_MAX_LEVEL),
    exp: Math.max(0, Math.floor(vip.exp || 0)),
    totalExp: Math.max(0, Math.floor(vip.totalExp || vip.exp || 0)),
    dailyGiftClaimed: typeof vip.dailyGiftClaimed === "string" ? vip.dailyGiftClaimed : "",
    bossFirstKills: vip.bossFirstKills && typeof vip.bossFirstKills === "object" ? vip.bossFirstKills : {},
    onlineSecondsToday: Math.max(0, Number(vip.onlineSecondsToday || 0)),
    onlineRewardClaimed: typeof vip.onlineRewardClaimed === "string" ? vip.onlineRewardClaimed : "",
  };
}

function normalizeZodiacCollection(collection = {}) {
  return Object.fromEntries(
    Object.entries(collection || {}).map(([setId, entry]) => [
      setId,
      {
        collectedPieceIds: Array.isArray(entry?.collectedPieceIds) ? [...new Set(entry.collectedPieceIds.filter(Boolean))] : [],
        abyssCollectedPieceIds: Array.isArray(entry?.abyssCollectedPieceIds) ? [...new Set(entry.abyssCollectedPieceIds.filter(Boolean))] : [],
        active: Boolean(entry?.active),
        abyssActive: Boolean(entry?.abyssActive),
      },
    ]),
  );
}

function normalizeCostumes(costumes = {}) {
  const owned = Array.isArray(costumes.owned) ? [...new Set(costumes.owned.filter((id) => COSTUME_DB[id]))] : [];
  const equippedBack = costumes.equipped?.back && owned.includes(costumes.equipped.back) ? costumes.equipped.back : null;
  return {
    owned,
    equipped: { back: equippedBack },
  };
}

function normalizeMapExploration(exploration = {}) {
  return Object.fromEntries(
    maps.map((map) => {
      const entry = exploration?.[map.id] || {};
      const points = Math.max(0, Math.floor(entry.points || 0));
      return [
        map.id,
        {
          points,
          level: getMapExplorationLevelFromPoints(points),
          claimedMilestones: Array.isArray(entry.claimedMilestones) ? entry.claimedMilestones : [],
        },
      ];
    }),
  );
}

function normalizeAchievementProgress(progress = {}) {
  const source = progress.unlocked ? {} : progress;
  return Object.fromEntries(
    ACHIEVEMENT_DB.map((achievement) => {
      const entry = source?.[achievement.id] || {};
      const value = Math.max(0, Math.floor(entry.progress || 0));
      return [achievement.id, { progress: value, unlocked: Boolean(entry.unlocked || value >= achievement.target), claimed: Boolean(entry.claimed) }];
    }),
  );
}

function normalizeTitles(titles = {}) {
  const owned = Array.isArray(titles.owned) ? [...new Set(titles.owned.filter((id) => TITLE_DB[id]))] : [];
  return { owned, equipped: owned.includes(titles.equipped) ? titles.equipped : null };
}

function normalizeRebirthPrestige(prestige = {}, rebirths = 0) {
  const totalRebirths = Math.max(Number(prestige.totalRebirths || 0), Number(rebirths || 0));
  return {
    level: Math.max(Number(prestige.level || 0), totalRebirths),
    exp: Math.max(0, Number(prestige.exp || 0)),
    totalRebirths,
  };
}

function getRebirthPrestigeBonuses() {
  const level = normalizeRebirthPrestige(state.rebirthPrestige, state.hero?.rebirths || 0).level;
  return {
    rarePlusWeightBonus: level * 0.01,
    epicPlusWeightBonus: level * 0.005,
    legendPlusWeightBonus: level * 0.002,
    darkGoldPlusWeightBonus: level * 0.0008,
    mythicWeightBonus: level * 0.0003,
  };
}

function applyRebirthPrestigeDropWeight(drop, weight, stats = computeStats(), context = {}) {
  const rank = rarityRank(drop?.rarity || "normal");
  const bonus = getRebirthPrestigeBonuses();
  let multiplier = 1;
  if (rank >= rarityRank("rare")) multiplier += bonus.rarePlusWeightBonus;
  if (rank >= rarityRank("epic")) multiplier += bonus.epicPlusWeightBonus;
  if (rank >= rarityRank("legend")) multiplier += bonus.legendPlusWeightBonus;
  if (rank >= rarityRank("darkGold")) multiplier += bonus.darkGoldPlusWeightBonus;
  if (rank >= rarityRank("mythic")) multiplier += bonus.mythicWeightBonus;
  if (rank >= rarityRank("rare")) multiplier += Math.min(1, stats.rareDropBonus || 0);
  if (context.boss && rank >= rarityRank("rare")) multiplier += Math.min(1, stats.bossQualityWeight || 0);
  const mapBonus = getMapQualityBonus();
  if (rank >= rarityRank("epic")) multiplier += mapBonus.epicWeightBonus || 0;
  if (rank >= rarityRank("ancient")) multiplier += mapBonus.ancientWeightBonus || 0;
  if (rank >= rarityRank("legend")) multiplier += mapBonus.legendWeightBonus || 0;
  if (rank >= rarityRank("darkGold")) multiplier += mapBonus.darkGoldWeightBonus || 0;
  if (rank >= rarityRank("mythic")) multiplier += mapBonus.mythicWeightBonus || 0;
  return weight * multiplier;
}

function normalizeSkillGrowthSpecializations() {
  Object.entries(state.skillGrowth || {}).forEach(([skillId, entry]) => {
    if (!entry || typeof entry !== "object") return;
    entry.specialization = entry.specialization || "";
    state.skillGrowth[skillId] = entry;
  });
}

function ensureQuestLists() {
  const existing = new Set(state.quests.active.map((quest) => quest.id));
  generateMainQuests().forEach((quest) => {
    if (!existing.has(quest.id) && !state.quests.completed.includes(quest.id)) state.quests.active.push(quest);
  });
  refreshDailyQuestsIfNeeded(false);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function refreshDailyQuestsIfNeeded(force = false) {
  const today = todayKey();
  const hasUnclaimedDaily = state.quests.active.some((quest) => quest.category === "daily" && quest.completed && !quest.claimed);
  const currentDaily = state.quests.active.filter((quest) => quest.category === "daily");
  if (!force && state.quests.lastRefreshAt === today && currentDaily.length) return;
  if (!force && hasUnclaimedDaily) return;
  state.quests.active = state.quests.active.filter((quest) => quest.category !== "daily" || (quest.completed && !quest.claimed));
  if (!hasUnclaimedDaily) {
    state.quests.active.push(...generateDailyQuests());
    state.quests.lastRefreshAt = today;
  }
}

function generateMainQuests() {
  const plans = [
    ["grass", "清理南门青草地", 30, 20, { dust: 10 }, ["normal", "fine"]],
    ["forest", "森林巡逻", 50, 40, { ore: 5 }, ["rare"]],
    ["sewer", "下水道清扫", 80, 60, { crystal: 2 }, ["rare", "epic"]],
    ["desert", "沙漠补给线", 100, 80, { ore: 8, crystal: 3 }, ["rare", "epic"]],
    ["orc_village", "兽人村落讨伐", 120, 110, { rune: 2 }, ["epic"]],
    ["mine", "蓝晶矿洞巡查", 140, 150, { crystal: 6, rune: 3 }, ["epic", "legend"]],
    ["clock", "钟塔回廊校准", 160, 220, { ancientCore: 1 }, ["epic", "legend"]],
    ["glast_heim", "古城废墟肃清", 180, 320, { ancientCore: 2 }, ["legend"]],
    ["abyss_lake", "深渊湖龙影", 200, 460, { starShard: 1 }, ["legend", "darkGold"]],
    ["sky", "浮岛神殿巡礼", 240, 650, { starShard: 2 }, ["legend", "darkGold"]],
  ];
  return plans.map(([mapId, title, count, vipExp, materials, rarityRange], index) => createQuest({
    id: `main_${index + 1}_${mapId}`,
    category: "main",
    title,
    targetMapId: mapId,
    requiredCount: count,
    rewards: { vipExp, materials, randomEquipment: { mapId, rarityRange } },
  }));
}

function generateDailyQuests() {
  const highestMap = maps[Math.min(state.bestMap, maps.length - 1)] || maps[0];
  return [
    createQuest({
      id: `daily_hunt_${todayKey()}`,
      category: "daily",
      title: "今日讨伐",
      targetMapId: highestMap.id,
      requiredCount: 100,
      rewards: { vipExp: 30, materials: randomDailyMaterials(), randomEquipment: { mapId: highestMap.id, rarityRange: ["normal", "rare"] } },
    }),
    createQuest({
      id: `daily_hard_${todayKey()}`,
      category: "daily",
      title: "困难试炼",
      targetDifficulty: "hard",
      requiredCount: 50,
      rewards: { vipExp: 50, materials: { crystal: 2 }, randomEquipment: { mapId: highestMap.id, rarityRange: ["rare", "epic"] } },
    }),
    createQuest({
      id: `daily_mutation_${todayKey()}`,
      category: "daily",
      title: "变异追猎",
      targetMutation: true,
      requiredCount: 5,
      rewards: { vipExp: 80, materials: { rune: 2, ancientCore: 1 }, randomEquipment: { mapId: highestMap.id, rarityRange: ["epic", "legend"] } },
    }),
  ];
}

function createQuest(config) {
  const mapName = config.targetMapId ? maps.find((map) => map.id === config.targetMapId)?.name || config.targetMapId : "任意地图";
  const difficultyText = config.targetDifficulty === "hard" ? "困难模式" : "任意难度";
  const mutationText = config.targetMutation ? "变异怪" : config.targetBoss ? "首领" : "魔物";
  return normalizeQuest({
    type: "kill",
    currentCount: 0,
    completed: false,
    claimed: false,
    description: `击杀 ${mapName} ${difficultyText} ${mutationText} ${config.requiredCount} ֻ`,
    ...config,
  });
}

function randomDailyMaterials() {
  const pool = [{ dust: 12 }, { ore: 8 }, { crystal: 3 }, { rune: 1 }];
  return pool[Math.floor(Math.random() * pool.length)];
}

function updateQuestProgress(context) {
  let changed = false;
  state.quests.active.forEach((quest) => {
    if (quest.claimed || quest.completed || quest.type !== "kill") return;
    if (quest.targetMapId && quest.targetMapId !== context.mapId) return;
    if (quest.targetMonsterId && quest.targetMonsterId !== context.monsterId) return;
    if (quest.targetDifficulty && quest.targetDifficulty !== context.difficulty) return;
    if (quest.targetMutation && !context.isMutated) return;
    if (quest.targetBoss && !context.isBoss) return;
    quest.currentCount = Math.min(quest.requiredCount, quest.currentCount + (context.count || 1));
    if (quest.currentCount >= quest.requiredCount) {
      quest.completed = true;
      addLog(`任务完成：${quest.title}`);
      showToast(`任务完成：${quest.title}`);
    }
    changed = true;
  });
  if (changed) save();
}

function explorationGainForKill({ isBoss = false, isMutated = false, difficulty = "normal", isElite = false } = {}) {
  let amount = isBoss ? 10 : isMutated ? 5 : isElite ? 2 : 1;
  if (difficulty === "hard") amount *= 1.5;
  if (difficulty === "abyss") amount *= 3;
  return amount;
}

function gainMapExploration(mapId, amount, { offline = false } = {}) {
  if (!mapId || !amount) return;
  state.mapExploration = normalizeMapExploration(state.mapExploration);
  const entry = state.mapExploration[mapId] || { points: 0, level: 0, claimedMilestones: [] };
  const gain = Math.max(0, Math.floor(amount * (offline ? 0.3 : 1)));
  if (!gain) return;
  const before = entry.level || 0;
  entry.points += gain;
  entry.level = getMapExplorationLevelFromPoints(entry.points);
  state.mapExploration[mapId] = entry;
  updateAchievementProgress("exploreLv5_1", entry.level >= 5 ? 1 : 0, { absolute: true });
  if (entry.level > before) addLog(`${mapNameById(mapId)} 探索度提升至 Lv.${entry.level}。`);
}

function getMapExplorationLevelFromPoints(points) {
  let level = 0;
  MAP_EXPLORATION_REQUIREMENTS.forEach((need, index) => {
    if (index > 0 && points >= need) level = index;
  });
  return Math.min(10, level);
}

function getMapExplorationEntry(mapId) {
  state.mapExploration = normalizeMapExploration(state.mapExploration);
  return state.mapExploration[mapId] || { points: 0, level: 0, claimedMilestones: [] };
}

function getMapExplorationBonuses(mapId) {
  const level = getMapExplorationEntry(mapId).level || 0;
  return {
    goldBonus: level * 0.01,
    expBonus: level * 0.01,
    itemDropBonus: level * 0.005,
    equipmentDropBonus: Math.floor(level / 5) * 0.01,
    bossDamageBonus: Math.floor(level / 5) * 0.02,
  };
}

function mapNameById(mapId) {
  return maps.find((map) => map.id === mapId)?.name || mapId;
}

function getAchievementEntry(id) {
  state.achievementProgress = normalizeAchievementProgress(state.achievementProgress);
  return state.achievementProgress[id];
}

function updateAchievementProgress(id, amount = 1, options = {}) {
  const achievement = ACHIEVEMENT_DB.find((entry) => entry.id === id);
  if (!achievement) return;
  const entry = getAchievementEntry(id);
  const before = entry.unlocked;
  entry.progress = options.absolute ? Math.max(entry.progress, Math.floor(amount || 0)) : entry.progress + Math.floor(amount || 0);
  entry.unlocked = entry.progress >= achievement.target;
  if (!before && entry.unlocked) {
    addLog(`成就完成：${achievement.title}`);
    showToast(`成就完成：${achievement.title}`);
  }
}

function trackKillAchievements({ isBoss = false, difficulty = "normal" } = {}) {
  updateAchievementProgress("totalKills_100", 1);
  updateAchievementProgress("totalKills_1000", 1);
  if (isBoss) updateAchievementProgress("bossKills_10", 1);
  if (isBoss && difficulty === "abyss") updateAchievementProgress("abyssBoss_1", 1);
}

function trackEquipmentAchievement(item) {
  if (item?.rarity === "legend") updateAchievementProgress("legendItem_1", 1);
  if (item?.rarity === "darkGold") updateAchievementProgress("darkGoldItem_1", 1);
  if (item?.rarity === "mythic") updateAchievementProgress("mythicItem_1", 1);
}

function claimAchievementReward(id) {
  const achievement = ACHIEVEMENT_DB.find((entry) => entry.id === id);
  const entry = getAchievementEntry(id);
  if (!achievement || !entry?.unlocked || entry.claimed) return;
  const reward = achievement.reward || {};
  if (reward.gold) state.gold += reward.gold;
  if (reward.vipExp) gainVipExp(reward.vipExp);
  if (reward.materials) Object.entries(reward.materials).forEach(([materialId, qty]) => {
    state.materials[materialId] = (state.materials[materialId] || 0) + qty;
  });
  if (reward.titleId) grantTitle(reward.titleId);
  entry.claimed = true;
  showToast(`已领取成就：${achievement.title}`);
  renderAll();
  save();
}

function grantTitle(titleId) {
  if (!TITLE_DB[titleId]) return;
  state.titles = normalizeTitles(state.titles);
  if (!state.titles.owned.includes(titleId)) state.titles.owned.push(titleId);
  if (!state.titles.equipped) state.titles.equipped = titleId;
}

function equipTitle(titleId) {
  state.titles = normalizeTitles(state.titles);
  if (titleId && !state.titles.owned.includes(titleId)) return;
  state.titles.equipped = titleId || null;
  renderAll();
  save();
}

function claimQuestReward(questId) {
  const quest = state.quests.active.find((entry) => entry.id === questId);
  if (!quest || quest.claimed || !quest.completed) return;
  const equipmentReward = quest.rewards.randomEquipment;
  if (equipmentReward && state.inventory.length >= getInventoryLimit()) {
    showToast("背包已满，无法领取装备奖励");
    return;
  }
  const materials = quest.rewards.materials || {};
  addMaterials(materials);
  const item = equipmentReward ? createQuestRewardEquipment(equipmentReward) : null;
  if (item) {
    state.inventory.unshift(item);
    trackEquipmentAchievement(item);
  }
  if (quest.rewards.vipExp) gainVipExp(quest.rewards.vipExp);
  quest.claimed = true;
  if (!state.quests.completed.includes(quest.id)) state.quests.completed.push(quest.id);
  updateAchievementProgress("tasks_10", 1);
  addLog(`领取任务奖励：${quest.title}`);
  renderAll();
  save();
}

function createQuestRewardEquipment(config) {
  const tableId = mapDropTableAlias[config.mapId] || config.mapId || mapDropTableAlias[currentMap().id] || currentMap().id;
  const allowed = config.rarityRange || ["normal", "rare"];
  const rows = (equipmentDropTables[tableId] || []).filter((drop) => allowed.includes(drop.rarity));
  const pick = rows.length ? weightedChoice(rows, (drop) => Math.max(0.0001, drop.dropRate)) : null;
  const template = pick ? equipmentTemplateDb[pick.equipmentId] : allEquipmentTemplates.find((item) => allowed.includes(item.rarity)) || itemPool[0];
  const rarity = pick?.rarity || (allowed.includes("darkGold") ? "darkGold" : template.rarity || allowed[0] || "normal");
  const dropLevel = pick ? randomInt(pick.minLevel, pick.maxLevel) : Math.max(1, state.hero.baseLevel);
  return createItem(template, dropLevel, rarity, { dropMapId: config.mapId || currentMap().id, dropLevel });
}

function gainVipExp(amount) {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.gainVipExp === "function") return runtime.gainVipExp(amount);
  const gain = Math.max(0, Math.floor(amount || 0));
  if (!gain) return;
  state.vip.exp += gain;
  state.vip.totalExp += gain;
  while (state.vip.level < VIP_MAX_LEVEL) {
    const nextLevel = state.vip.level + 1;
    const need = VIP_EXP_REQUIREMENTS[nextLevel] || Infinity;
    if (state.vip.totalExp < need) break;
    state.vip.level = nextLevel;
    addLog(`冒险者荣誉等级提升至 Lv.${state.vip.level}`);
    if (VIP_MILESTONE_BONUSES[nextLevel]) {
      showToast(`新特权解锁：${VIP_MILESTONE_BONUSES[nextLevel].label}`);
      addLog(`新特权解锁：${VIP_MILESTONE_BONUSES[nextLevel].label}`);
    }
  }
}

function save() {
  const runtime = window.RuneFrontierStateRuntime;
  if (runtime && typeof runtime.save === "function") return runtime.save();
  state.lastSavedAt = Date.now();
  state.lastActiveAt = state.lastSavedAt;
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  els.saveState.textContent = auth.token ? "同步中" : "已存档";
  queueRemoteSave();
}

function queueRemoteSave() {
  if (!auth.token) return;
  remoteSaveQueued = true;
  if (remoteSaveInFlight) return;
  flushRemoteSave();
}

async function flushRemoteSave() {
  if (!auth.token || !remoteSaveQueued) return;
  remoteSaveInFlight = true;
  remoteSaveQueued = false;
  const snapshot = JSON.parse(JSON.stringify(state));
  try {
    await apiRequest("/api/save", {
      method: "POST",
      body: JSON.stringify({ state: snapshot }),
    });
    els.saveState.textContent = "云端已同步";
  } catch {
    els.saveState.textContent = "云端同步失败";
  } finally {
    remoteSaveInFlight = false;
    if (remoteSaveQueued) flushRemoteSave();
  }
}

function loop(now) {
  const dt = Math.min(0.12, (now - lastTick) / 1000);
  lastTick = now;
  loopDt = dt;

  updateRecovery(dt);
  if (!state.paused) updateCombat(dt);
  updateFloatTexts(dt);

  saveTimer += dt;
  if (saveTimer >= 4) {
    saveTimer = 0;
    save();
  }

  drawScene(now / 1000);
  renderFast();
  requestAnimationFrame(loop);
}

/* ═══════════════════════════════════════════════════════════════════
 * [LEGACY-AUDIT] Fallback zone — ~78 legacyXxx functions
 * All are superseded by module runtime delegation. Remaining as
 * startup-safety fallback. Safe to delete ONLY after:
 *  - Runtime parity verified via regression comparison
 *  - All 9 runtimes install successfully in production
 *  - No direct callers remain in event handlers or tests
 * ═══════════════════════════════════════════════════════════════════ */

function legacyUpdateCombat(dt) {
  if (state.enemyHp <= 0 || state.enemyMaxHp <= 0) spawnEnemy(false);

  const stats = computeStats();
  tryAutoChallengeBoss("tick", stats);
  if ((state.hero.currentHp || 0) <= 0) {
    state.paused = true;
    return;
  }
  state.playerAttackTimer = (state.playerAttackTimer || 0) + dt;
  const attackInterval = clampNumber(1 / Math.max(0.01, stats.attackSpeed), 0.6, 4.5);
  const attacks = Math.min(3, Math.floor(state.playerAttackTimer / attackInterval));
  if (attacks > 0) {
    state.playerAttackTimer -= attacks * attackInterval;
    const critChance = Math.min(PLAYER_CRIT_RATE_CAP, stats.crit);
    for (let hit = 0; hit < attacks && state.enemyHp > 0; hit += 1) {
      const targetBonus = getTargetDamageBonus(stats);
      const monsterGuard = Math.min(0.65, currentMonsterStats().damageReduction || 0);
      const rawHitDamage = Math.max(0, stats.dps * attackInterval * (1 + targetBonus + (stats.normalAttackBonus || 0)) * (1 - monsterGuard));
      const isCrit = Math.random() < critChance;
      const finalDamage = normalizeDamage(isCrit ? rawHitDamage * (1.85 + (stats.critDamageBonus || 0)) : rawHitDamage);
      state.enemyHp -= finalDamage;
      showDamageNumber("monster", finalDamage, isCrit ? "crit" : "player");
      showHitFeedback(isCrit ? "crit" : "normal");
      applySplashDamageToEncounter(finalDamage, stats);
      if (stats.fireBurstChance && Math.random() < stats.fireBurstChance && state.enemyHp > 0) {
        const burstDamage = normalizeDamage(stats.physicalAttack * (stats.fireBurstAtkPct || 0.8) * (1 + targetBonus) * (1 - monsterGuard));
        state.enemyHp -= burstDamage;
        showDamageNumber("monster", burstDamage, "skill", { skillName: "火焰爆发" });
        showSkillCastFeedback("火焰爆发");
      }
      if (state.currentMap < 4 || stats.lifeSteal) {
        const stealRate = (state.currentMap < 4 ? 0.2 : 0) + Math.min(0.25, stats.lifeSteal || 0);
        const steal = Math.round(finalDamage * stealRate * (1 - Math.min(0.75, currentMonsterStats().antiLifeSteal || 0)));
        if (steal > 0) state.hero.currentHp = Math.min(stats.maxHp, (state.hero.currentHp || 0) + steal);
      }
    }
  }
  rollActiveSkill(dt, stats);
  if (state.enemyHp > 0) updateMonsterAttack(dt, stats);

  if (state.enemyHp <= 0) defeatEnemy();
}

function updateCombat(dt) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.updateCombat === "function") return runtime.updateCombat(dt);
  return legacyUpdateCombat(dt);
}

function legacyGetTargetDamageBonus(stats) {
  const monster = currentMonsterStats();
  let bonus = stats.monsterDamageBonus || 0;
  const levelGap = Math.max(0, (monster.level || 1) - (state.hero.baseLevel || 1));
  if (levelGap > 0) bonus += Math.min(stats.higherLevelDamageBonus || 0, levelGap * 0.01) + Math.min(0.12, (stats.hitRate || 0) * 0.25);
  if (state.enemyBoss || monster.type === "boss") bonus += stats.bossDamageBonus || 0;
  if (state.currentDifficulty === "abyss" && (state.enemyBoss || monster.type === "boss")) bonus += stats.abyssBossDamageBonus || 0;
  if (monster.mutation) bonus += stats.mutationDamageBonus || 0;
  if (monster.type === "elite" || monster.mutation || state.enemyBoss) bonus += (stats.eliteDamageBonus || 0) + (state.currentDifficulty === "abyss" ? stats.abyssEliteDamageBonus || 0 : 0);
  if (state.currentDifficulty === "abyss") {
    bonus += stats.abyssDamageBonus || 0;
    if ((state.enemyHp || 0) / Math.max(1, state.enemyMaxHp || 1) <= 0.2) bonus += stats.abyssExecuteDamageBonus || 0;
  }
  bonus += stats.finalDamageBonus || 0;
  bonus += Math.min(0.5, stats.ignoreDefensePct || 0);
  return Math.min(3, bonus);
}

function getTargetDamageBonus(stats) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.getTargetDamageBonus === "function") return runtime.getTargetDamageBonus(stats);
  return legacyGetTargetDamageBonus(stats);
}

function applySplashDamageToEncounter(baseDamage, stats = {}) {
  const targets = Math.max(0, Math.floor(stats.splashTargets || 0));
  const ratio = Math.max(0, Number(stats.splashDamagePct || 0));
  if (!targets || ratio <= 0 || state.enemyBoss) return;
  updateActiveEnemyHpInGroup();
  const group = state.enemyGroup;
  if (!group?.monsters?.length) return;
  const splashDamage = normalizeDamage(baseDamage * ratio);
  if (splashDamage <= 0) return;
  group.monsters
    .map((monster, index) => ({ monster, index }))
    .filter((entry) => entry.index !== group.activeIndex && entry.monster.alive)
    .slice(0, targets)
    .forEach(({ monster }) => {
      // 保留 1 点生命，避免溅射跳过逐只击杀奖励结算。
      monster.currentHp = Math.max(1, Number(monster.currentHp || monster.maxHp || 1) - splashDamage);
      monster.alive = monster.currentHp > 0;
    });
  showDamageNumber("monster", splashDamage, "skill", { skillName: "溅射" });
}

function legacyIsBossChallengeReady() {
  return Number(state.areaKills || 0) >= bossRequirement();
}

function isBossChallengeReady() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.isBossChallengeReady === "function") return runtime.isBossChallengeReady();
  return legacyIsBossChallengeReady();
}

function legacyIsCurrentlyFightingBoss() {
  return Boolean(state.enemyBoss);
}

function isCurrentlyFightingBoss() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.isCurrentlyFightingBoss === "function") return runtime.isCurrentlyFightingBoss();
  return legacyIsCurrentlyFightingBoss();
}

function legacyCanHeroFight(stats = computeStats()) {
  return (state.hero.currentHp || 0) > 0 && (state.hero.currentHp || 0) / Math.max(1, stats.maxHp) >= 0.3;
}

function canHeroFight(stats = computeStats()) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.canHeroFight === "function") return runtime.canHeroFight(stats);
  return legacyCanHeroFight(stats);
}

function legacyIsAutoBossInCooldown() {
  return Date.now() < (ensureSettings().autoBossCooldownUntil || 0);
}

function isAutoBossInCooldown() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.isAutoBossInCooldown === "function") return runtime.isAutoBossInCooldown();
  return legacyIsAutoBossInCooldown();
}

function legacyChallengeBoss({ auto = false } = {}) {
  const stats = computeStats();
  if (isCurrentlyFightingBoss()) return false;
  if (!isBossChallengeReady()) {
    if (!auto) showToast(`还需要清理 ${bossRequirement() - state.areaKills} 只魔物`);
    return false;
  }
  if (!canHeroFight(stats)) {
    if (!auto) showToast("生命值不足，无法挑战 BOSS");
    return false;
  }
  if (auto && isAutoBossInCooldown()) return false;
  spawnEnemy(true);
  addLog(`${auto ? "自动挑战 BOSS" : bossDisplayName(currentMap()) + " 出现在道路尽头"}${auto ? `：${bossDisplayName(currentMap())}` : "。"}`);
  renderAll();
  return true;
}

function challengeBoss({ auto = false } = {}) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.challengeBoss === "function") return runtime.challengeBoss({ auto });
  return legacyChallengeBoss({ auto });
}

function legacyTryAutoChallengeBoss(reason = "tick", stats = computeStats()) {
  const ready = isBossChallengeReady();
  const enabled = getAutoBossEnabled();
  const fightingBoss = isCurrentlyFightingBoss();
  const canFight = canHeroFight(stats);
  const cooldown = isAutoBossInCooldown();
  if (!enabled || !ready || fightingBoss || state.paused || !canFight || cooldown) return false;
  return challengeBoss({ auto: true });
}

function tryAutoChallengeBoss(reason = "tick", stats = computeStats()) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.tryAutoChallengeBoss === "function") return runtime.tryAutoChallengeBoss(reason, stats);
  return legacyTryAutoChallengeBoss(reason, stats);
}

function legacyGetAutoBossStatusText(stats = computeStats()) {
  if (!getAutoBossEnabled()) return "已关闭";
  if (state.paused) return "战斗暂停中";
  if (isCurrentlyFightingBoss()) return "正在挑战";
  const cooldownLeft = Math.max(0, Math.ceil(((ensureSettings().autoBossCooldownUntil || 0) - Date.now()) / 1000));
  if (cooldownLeft > 0) return `冷却中 ${cooldownLeft}秒`;
  if (!canHeroFight(stats)) return "生命不足";
  if (isBossChallengeReady()) return "可挑战";
  return "等待进度";
}

function getAutoBossStatusText(stats = computeStats()) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.getAutoBossStatusText === "function") return runtime.getAutoBossStatusText(stats);
  return legacyGetAutoBossStatusText(stats);
}

function legacyHandleAutoBossFailure() {
  ensureSettings().autoBossCooldownUntil = Date.now() + AUTO_BOSS_FAIL_COOLDOWN_MS;
  addLog("自动挑战 BOSS 失败，进入冷却。");
  return true;
}

function handleAutoBossFailure() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.handleAutoBossFailure === "function") return runtime.handleAutoBossFailure();
  return legacyHandleAutoBossFailure();
}

function legacyUpdateRecovery(dt) {
  const stats = computeStats();
  if ((state.hero.currentHp || 0) >= stats.maxHp) return;
  state.regenTimer = (state.regenTimer || 0) + dt;
  if (state.regenTimer < HP_REGEN_INTERVAL) return;
  state.regenTimer = 0;
  const before = state.hero.currentHp || 0;
  state.hero.currentHp = Math.min(stats.maxHp, before + stats.hpRegen);
  const healed = Math.round(state.hero.currentHp - before);
  if (healed > 0) {
    showDamageNumber("hero", healed, "heal");
    if (Math.random() < 0.35 || before <= 0) addLog(`你恢复了 ${formatNumber(healed)} 点生命值。`);
  }
}

function updateRecovery(dt) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.updateRecovery === "function") return runtime.updateRecovery(dt);
  return legacyUpdateRecovery(dt);
}

function legacyUpdateMonsterAttack(dt, stats) {
  state.enemyAttackTimer = (state.enemyAttackTimer || 0) + dt;
  const interval = Math.max(0.72, (MONSTER_ATTACK_INTERVAL - state.currentMap * 0.06 - (state.enemyBoss ? 0.18 : 0)) * (1 + (stats.setBonuses?.monsterAttackSpeedReductionPct || 0)));
  if (state.enemyAttackTimer < interval) return;
  state.enemyAttackTimer = 0;
  const monster = currentMonsterStats();
  if (Math.random() < stats.dodgeRate) {
    showDamageNumber("hero", 0, "miss");
    return;
  }
  const defenseK = 80 + state.hero.baseLevel * 4;
  const piercedDefense = Math.max(0, stats.defense * (1 - Math.min(0.75, monster.armorPierce || 0)));
  const abyssReduction = state.currentDifficulty === "abyss" ? Math.min(0.6, stats.abyssDamageReduction || 0) : 0;
  const specialReduction = Math.min(0.45, Math.max(stats.magicDamageReduction || 0, stats.skillDamageReduction || 0) * (state.enemyBoss || monster.type === "elite" ? 1 : 0.35));
  const damageReductionPct = Math.min(0.75, Math.max(0, (stats.damageReductionPct || stats.setBonuses?.damageReductionPct || 0) + abyssReduction + specialReduction - (monster.abyssSuppression || 0)));
  const effectiveCritChance = (monster.critChance || 0) * (1 - Math.min(0.75, (stats.statusResist || 0) * 0.5));
  const isCrit = Math.random() < effectiveCritChance;
  const hpRatio = (state.hero.currentHp || stats.maxHp) / Math.max(1, stats.maxHp);
  const executeBonus = hpRatio <= 0.35 ? monster.executeDamage || 0 : 0;
  const critMultiplier = isCrit ? 1 + (monster.critDamage || 0) : 1;
  const livingCount = Math.max(1, (state.enemyGroup?.monsters || []).filter((entry) => entry.alive).length || 1);
  const encounterAssist = state.enemyBoss ? 1 : Math.min(1.75, 1 + (livingCount - 1) * 0.18);
  const damage = normalizeDamage((monster.attack * defenseK) / (defenseK + piercedDefense) * (1 - damageReductionPct) * critMultiplier * (1 + executeBonus) * encounterAssist);
  state.hero.currentHp = Math.max(0, (state.hero.currentHp || stats.maxHp) - damage);
  showDamageNumber("hero", damage, isCrit ? "crit" : "monster");
  if (els.playerHpBar) {
    els.playerHpBar.classList.add("player-hp-flash");
    window.setTimeout(() => els.playerHpBar && els.playerHpBar.classList.remove("player-hp-flash"), 200);
  }
  if (state.enemyHp > 0 && stats.thornVitMultiplier > 0) {
    const thornDamage = normalizeDamage((stats.attrs?.vit || 0) * stats.thornVitMultiplier);
    state.enemyHp -= thornDamage;
    showDamageNumber("monster", thornDamage, "player");
  }
  if (state.enemyHp > 0 && stats.meteorCounterChance && Math.random() < stats.meteorCounterChance) {
    const meteorDamage = normalizeDamage((stats.magicAttack || stats.matkPower || 0) * (stats.meteorCounterMatkPct || 1));
    state.enemyHp -= meteorDamage;
    showDamageNumber("monster", meteorDamage, "skill", { skillName: "陨石反击" });
    showSkillCastFeedback("陨石反击");
  }
  if (state.hero.currentHp <= 0) {
    state.paused = true;
    if (state.enemyBoss && getAutoBossEnabled()) {
      handleAutoBossFailure();
    }
    addLog(`${getDifficultyFailureHint(monster)}角色生命值归零，战斗停止。`);
  }
}

function updateMonsterAttack(dt, stats) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.updateMonsterAttack === "function") return runtime.updateMonsterAttack(dt, stats);
  return legacyUpdateMonsterAttack(dt, stats);
}

function getDifficultyFailureHint(monster = currentMonsterStats()) {
  if (state.currentDifficulty === "abyss") return "深渊难度压力过高：建议提升深渊减伤、生命、防御、吸血和深渊伤害。";
  if (state.currentDifficulty === "hard") return "困难难度压力过高：建议提升星炼等级、生命、防御、吸血和 Boss 伤害。";
  if ((monster?.attack || 0) > (computeStats().maxHp || 1) * 0.12) return "生存评分不足：建议提升生命、防御和伤害减免。";
  return "";
}

function updateFloatTexts(dt) {
  state.floatTexts.forEach((entry) => {
    entry.age += dt;
    entry.y -= 24 * dt;
  });
  state.floatTexts = state.floatTexts.filter((entry) => entry.age < entry.ttl);
}

function legacyRollActiveSkill(dt, stats) {
  const activeSkills = getUnlockedSkills().filter((entry) => entry.active);
  for (const entry of activeSkills) {
    const spec = getSkillGrowthEntry(entry).specialization;
    const ms = getSkillMilestoneBonuses(entry);
    const abyssChance = state.currentDifficulty === "abyss" ? stats.setBonuses?.abyssSkillChanceBonus || 0 : 0;
    const chance = entry.active.chance * dt * (1 + Math.min(0.35, stats.luck * 0.002) + abyssChance + (ms.skillChanceBonus || 0)) * (spec === "frequency" ? 1.2 : 1) * (1 - Math.min(0.35, stats.skillCooldownPenalty || 0));
    if (Math.random() >= chance) continue;
    const source = entry.active.stat === "matk" ? stats.matkPower : stats.atkPower;
    const jobPower = 1 + state.hero.jobLevel * 0.018 + Math.floor(state.hero.jobLevel / 10) * 0.06;
    const monsterGuard = Math.min(0.65, currentMonsterStats().damageReduction || 0);
    const damage = normalizeDamage(
      source *
        entry.active.multiplier *
        getSkillLevelMultiplier(entry) *
        jobPower *
        skillAttributeMultiplier(entry.active, stats) *
        (1 + stats.crit * 0.35) *
        (1 + getTargetDamageBonus(stats) + (stats.skillDamageBonus || 0) + (ms.skillDamageBonus || 0) + (state.enemyBoss ? ms.bossDamageBonus || 0 : 0) + ((currentMonsterStats().type === "elite" || currentMonsterStats().mutation || state.enemyBoss) ? ms.eliteDamageBonus || 0 : 0) + (state.currentDifficulty === "abyss" ? (ms.abyssDamageBonus || 0) + (ms.abyssExecuteDamageBonus || 0) : 0) + (ms.monsterDamageBonus || 0) + (ms.finalDamageBonus || 0) + (spec === "boss_damage" && state.enemyBoss ? 0.25 : 0) + (spec === "pierce" ? 0.1 : 0)) *
        (1 - monsterGuard),
    );
    state.enemyHp -= damage;
    showDamageNumber("monster", damage, "skill", { skillName: entry.name });
    showHitFeedback("skill");
    showSkillCastFeedback(entry);
    if (state.currentMap < 4 || stats.skillHitHealPct) {
      const steal = Math.round(damage * (state.currentMap < 4 ? 0.2 : 0) + damage * (stats.skillHitHealPct || 0));
      if (steal > 0) state.hero.currentHp = Math.min(stats.maxHp, (state.hero.currentHp || 0) + steal);
    }
    noteSkillCast(entry.name, damage);
    gainSkillExp(entry, state.enemyBoss ? 2 : 1, "战斗施放");
    if (state.enemyHp <= 0) gainSkillExp(entry, state.enemyBoss ? 1 : 0.5, "技能终结");
    const echoChance = Math.min(0.25, (stats.echoChance || 0) + (ms.echoChance || 0));
    if (echoChance && Math.random() < echoChance && state.enemyHp > 0) {
      const echoDamage = normalizeDamage(damage * 0.7);
      state.enemyHp -= echoDamage;
      showDamageNumber("monster", echoDamage, "skill", { skillName: "回响" });
      showHitFeedback("skill");
      showSkillCastFeedback({ name: "回响" });
      if (state.currentMap < 4 || stats.skillHitHealPct) {
        const steal = Math.round(echoDamage * (state.currentMap < 4 ? 0.2 : 0) + echoDamage * (stats.skillHitHealPct || 0));
        if (steal > 0) state.hero.currentHp = Math.min(stats.maxHp, (state.hero.currentHp || 0) + steal);
      }
      noteSkillCast("回响", echoDamage);
    }
    break;
  }
}

function rollActiveSkill(dt, stats) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.rollActiveSkill === "function") return runtime.rollActiveSkill(dt, stats);
  return legacyRollActiveSkill(dt, stats);
}

function legacySkillAttributeMultiplier(active = {}, stats = {}) {
  return Object.entries(active.attributeScaling || {}).reduce((sum, [stat, scale]) => {
    const value = Math.max(0, stats.attrs?.[stat] || 0);
    return sum + Math.sqrt(value) * scale * 2.5;
  }, 1);
}

function skillAttributeMultiplier(active = {}, stats = {}) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.skillAttributeMultiplier === "function") return runtime.skillAttributeMultiplier(active, stats);
  return legacySkillAttributeMultiplier(active, stats);
}

function noteSkillCast(name, damage) {
  const text = `${name} 造成 ${formatNumber(sanitizeDamage(damage))} 伤害`;
  state.skillLog.unshift(text);
  state.skillLog = state.skillLog.slice(0, 6);
  if (Math.random() < 0.35) addLog(text);
  renderQuestList();
  renderPartyList();
  renderLog();
}

function addFloatText(text, x, y, color) {
  state.floatTexts.unshift({
    text,
    x: x + Math.random() * 44 - 22,
    y: y + Math.random() * 18 - 9,
    age: 0,
    ttl: 1.6,
    color,
  });
  state.floatTexts = state.floatTexts.slice(0, 12);
}

function showDamageNumber(target, amount, type = "player", options = {}) {
  const wrap = document.querySelector(".scene-wrap");
  if (type !== "miss" && (!Number.isFinite(Number(amount)) || Number(amount) <= 0)) return;
  const value = type === "heal" ? normalizeDamage(amount, { allowZero: true }) : normalizeDamage(amount, { allowZero: type === "miss" });
  if (type === "heal" && value <= 0) return;
  const text =
    type === "miss"
      ? "MISS"
      : type === "heal"
        ? `+${formatNumber(value)}`
        : type === "skill"
          ? `${options.skillName ? `${options.skillName}！` : ""}-${formatNumber(value)}`
        : type === "crit"
          ? `暴击！-${formatNumber(value)}`
          : `-${formatNumber(value)}`;
  if (target === "monster") {
    addFloatText(text, 680, 260, type === "crit" ? "#ff7a3d" : type === "skill" ? "#6d5dfc" : "#f5efe2");
  } else {
    addFloatText(text, 190, 260, type === "heal" ? "#2f9e55" : type === "miss" ? "#7b8a9a" : "#b74236");
  }
  if (!wrap) return;
  const floats = wrap.querySelectorAll(".damage-float");
  if (floats.length > 18) floats[0].remove();
  const el = document.createElement("span");
  el.className = `damage-float damage-number damage-${type === "crit" ? "crit" : type === "skill" ? "skill" : type === "miss" ? "miss" : type === "heal" ? "heal" : target === "monster" ? (state.enemyBoss ? "boss" : "normal") : "player"}`;
  el.textContent = text;
  const baseLeft = target === "monster" ? 74 : 22;
  const baseTop = target === "monster" ? 45 : 50;
  el.style.left = `${baseLeft + randomFloat(-4, 4)}%`;
  el.style.top = `${baseTop + randomFloat(-4, 4)}%`;
  wrap.appendChild(el);
  window.setTimeout(() => el.remove(), 900);
}

function showHitFeedback(kind = "normal") {
  const wrap = document.querySelector(".scene-wrap");
  if (!wrap) return;
  const className = state.enemyBoss ? "boss-hit-shake" : kind === "crit" ? "hit-crit-shake" : kind === "skill" ? "hit-skill-shake" : "hit-shake";
  wrap.classList.remove("hit-shake", "hit-crit-shake", "hit-skill-shake", "boss-hit-shake");
  void wrap.offsetWidth;
  wrap.classList.add(className);
  window.setTimeout(() => wrap.classList.remove(className), kind === "skill" ? 240 : kind === "crit" ? 190 : 140);
  playSfx(kind === "crit" ? "crit_hit" : kind === "skill" ? "skill_cast" : "attack_hit");
}

function showSkillCastFeedback(skill) {
  const wrap = document.querySelector(".scene-wrap");
  const name = typeof skill === "string" ? skill : skill?.name;
  if (!wrap || !name) return;
  window.clearTimeout(skillFeedbackTimer);
  const existing = wrap.querySelectorAll(".skill-cast-feedback");
  if (existing.length > 1) existing[0].remove();
  const el = document.createElement("span");
  el.className = "skill-cast-feedback";
  el.textContent = `${name}！`;
  wrap.appendChild(el);
  skillFeedbackTimer = window.setTimeout(() => el.remove(), 760);
}

function showMonsterDeathFeedback(monster = currentMonsterStats()) {
  const wrap = document.querySelector(".scene-wrap");
  if (!wrap) return;
  const isAbyssBoss = state.enemyBoss && state.currentDifficulty === "abyss";
  const className = isAbyssBoss ? "abyss-boss-death-pop" : state.enemyBoss ? "boss-death-pop" : monster?.mutation ? "mutation-death-pop" : "monster-death-pop";
  const el = document.createElement("span");
  el.className = `death-pop ${className}`;
  wrap.appendChild(el);
  window.setTimeout(() => el.remove(), state.enemyBoss ? 1500 : 760);
  if (state.enemyBoss) { wrap.classList.add("boss-death-shake"); wrap.classList.add("boss-death-flash"); window.setTimeout(() => { wrap.classList.remove("boss-death-shake"); wrap.classList.remove("boss-death-flash"); }, 1100); }
  playSfx(state.enemyBoss ? "boss_die" : "monster_die");
}

function showBossBanner(map = currentMap()) {
  const wrap = document.querySelector(".scene-wrap");
  if (!wrap) return;
  wrap.querySelectorAll(".boss-banner").forEach((entry) => entry.remove());
  const el = document.createElement("div");
  el.className = `boss-banner ${state.currentDifficulty === "abyss" ? "boss-banner-abyss" : ""} boss-banner-show`;
  el.innerHTML = `<strong>${state.currentDifficulty === "abyss" ? "深渊 BOSS 出现！" : "BOSS 出现！"}</strong><span>${escapeHtml(bossDisplayName(map))}</span>`;
  wrap.appendChild(el);
  window.setTimeout(() => el.remove(), 1300);
  playSfx("boss_spawn");
}

function showLootDropFeedback(item) {
  if (!item || !shouldShowLootFeedback(item)) return;
  const wrap = document.querySelector(".scene-wrap");
  if (!wrap) return;
  recentLootFeedback.push(item);
  recentLootFeedback = recentLootFeedback
    .sort((a, b) => lootFeedbackRank(b) - lootFeedbackRank(a))
    .slice(0, 3);
  const top = recentLootFeedback[0];
  wrap.querySelectorAll(".loot-drop-banner").forEach((entry) => entry.remove());
  const el = document.createElement("div");
  const rarity = top.rarity || "rare";
  el.className = `loot-drop-banner loot-drop-${rarity} ${top.setId ? "loot-drop-set" : ""}`;
  el.innerHTML = `<strong>${escapeHtml(lootFeedbackTitle(top))}</strong><span>${escapeHtml(getDisplayItemName(top))}</span>`;
  wrap.appendChild(el);
  window.setTimeout(() => {
    el.remove();
    recentLootFeedback = recentLootFeedback.filter((entry) => entry.id !== top.id);
  }, 1600);
  playSfx(rarity === "mythic" ? "mythic_drop" : rarity === "legend" || rarity === "darkGold" ? "legend_drop" : "rare_drop");
}

function shouldShowLootFeedback(item) {
  return Boolean(item.setId || rarityRank(item.rarity) >= rarityRank("epic"));
}

function lootFeedbackRank(item) {
  return (item.setId ? 20 : 0) + Math.max(0, rarityRank(item.rarity));
}

function lootFeedbackTitle(item) {
  if (item.setId) return "获得星座装备！";
  if (item.rarity === "mythic") return "获得神话装备！";
  if (item.rarity === "darkGold") return "获得暗金装备！";
  return `获得${rarityName(item.rarity)}装备！`;
}

function playSfx(name) {
  const settings = ensureSettings();
  if (!settings.soundEnabled || !name) return;
  try {
    const audio = new Audio(`assets/audio/${name}.mp3`);
    audio.volume = clampNumber(settings.soundVolume, 0, 1);
    const pending = audio.play();
    if (pending?.catch) pending.catch(() => {});
  } catch {
    // Audio is optional; missing files or autoplay restrictions should never break combat.
  }
}

function showAutoSalvageFeedback(item, rewards = {}, options = {}) {
  if (options.offline || rarityRank(item?.rarity) < rarityRank("rare")) return;
  const wrap = document.querySelector(".scene-wrap");
  if (!wrap) return;
  const el = document.createElement("div");
  el.className = "auto-salvage-feedback";
  el.textContent = `${rarityName(item.rarity)}${getDisplayItemName(item)} → 分解 → ${materialText(rewards)}`;
  wrap.appendChild(el);
  window.setTimeout(() => el.remove(), 1500);
}

function recordSessionReward(delta = {}) {
  const mapId = currentMap().id;
  if (sessionStatsMapId && sessionStatsMapId !== mapId) {
    runtimeSessionStats.events = [];
  }
  sessionStatsMapId = mapId;
  const now = Date.now();
  runtimeSessionStats.events.push({
    at: now,
    kills: Number(delta.kills || 0),
    gold: Number(delta.gold || 0),
    baseExp: Number(delta.baseExp || 0),
    jobExp: Number(delta.jobExp || 0),
    materials: Number(delta.materials || 0),
    equipments: Number(delta.equipments || 0),
    cards: Number(delta.cards || 0),
    autoSalvaged: Number(delta.autoSalvaged || 0),
  });
  runtimeSessionStats.kills += Number(delta.kills || 0);
  runtimeSessionStats.bossKills += Number(delta.bossKills || 0);
  runtimeSessionStats.abyssKills += Number(delta.abyssKills || 0);
  runtimeSessionStats.gold += Number(delta.gold || 0);
  runtimeSessionStats.baseExp += Number(delta.baseExp || 0);
  runtimeSessionStats.jobExp += Number(delta.jobExp || 0);
  if (Number(delta.materials || 0) > 0) {
    runtimeSessionStats.materials._total = (runtimeSessionStats.materials._total || 0) + Number(delta.materials || 0);
  }
  runtimeSessionStats.equipmentCount += Number(delta.equipments || 0);
  runtimeSessionStats.autoSalvagedCount += Number(delta.autoSalvaged || 0);
  pruneSessionRewardEvents(now);
}

function pruneSessionRewardEvents(now = Date.now()) {
  runtimeSessionStats.events = runtimeSessionStats.events.filter((entry) => now - entry.at <= 60_000);
}

function getSessionRewardSummary() {
  pruneSessionRewardEvents();
  return runtimeSessionStats.events.reduce(
    (sum, entry) => {
      sum.kills += entry.kills || 0;
      sum.gold += entry.gold || 0;
      sum.baseExp += entry.baseExp || 0;
      sum.jobExp += entry.jobExp || 0;
      sum.materials += entry.materials || 0;
      sum.equipments += entry.equipments || 0;
      sum.cards += entry.cards || 0;
      sum.autoSalvaged += entry.autoSalvaged || 0;
      return sum;
    },
    { kills: 0, gold: 0, baseExp: 0, jobExp: 0, materials: 0, equipments: 0, cards: 0, autoSalvaged: 0 },
  );
}

function renderSessionRewardPanel() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderSessionRewardPanel === "function") return runtime.renderSessionRewardPanel();
  const summary = getSessionRewardSummary();
  const totalDropped = runtimeSessionStats.equipmentCount + runtimeSessionStats.autoSalvagedCount;
  const highestRarity = [...rarityOrder].reverse().find((rarity) => (runtimeSessionStats.equipmentByRarity?.[rarity] || 0) > 0);
  const materialTotal = Object.values(runtimeSessionStats.materials || {}).reduce((sum, amount) => sum + Number(amount || 0), 0);
  return `
    <div class="party-item session-reward-panel">
      <span class="party-name">近60秒收益</span>
      <div class="session-reward-grid">
        <span>击杀 <strong>${formatNumber(summary.kills)}</strong></span>
        <span>金币 <strong>+${formatNumber(summary.gold)}</strong></span>
        <span>BASE <strong>+${formatNumber(summary.baseExp)}</strong></span>
        <span>JOB <strong>+${formatNumber(summary.jobExp)}</strong></span>
        <span>材料 <strong>${formatNumber(summary.materials)}</strong></span>
        <span>装备 <strong>${formatNumber(summary.equipments)}</strong></span>
      </div>
      <details class="session-total-detail">
        <summary>本次在线收益</summary>
        <div class="session-reward-grid">
          <span>时长 <strong>${formatDuration(Math.floor((Date.now() - runtimeSessionStats.startedAt) / 1000))}</strong></span>
          <span>击杀 <strong>${formatNumber(runtimeSessionStats.kills)}</strong></span>
          <span>Boss <strong>${formatNumber(runtimeSessionStats.bossKills)}</strong></span>
          <span>深渊 <strong>${formatNumber(runtimeSessionStats.abyssKills)}</strong></span>
          <span>装备 <strong>${formatNumber(runtimeSessionStats.equipmentCount)}</strong></span>
          <span>掉落总数 <strong>${formatNumber(totalDropped)}</strong></span>
          <span>入包保留 <strong>${formatNumber(runtimeSessionStats.equipmentCount)}</strong></span>
          <span>神话 <strong>${formatNumber(runtimeSessionStats.equipmentByRarity.mythic || 0)}</strong></span>
          <span>深渊装 <strong>${formatNumber(runtimeSessionStats.abyssEquipmentCount)}</strong></span>
          <span>自动分解 <strong>${formatNumber(runtimeSessionStats.autoSalvagedCount)}</strong></span>
          <span>最高品质 <strong>${highestRarity ? rarityName(highestRarity) : "暂无"}</strong></span>
          <span>材料总数 <strong>${formatNumber(materialTotal)}</strong></span>
        </div>
        ${state.autoSalvage?.enabled ? `<p class="slot-meta">已开启自动分解：符合设置的低品质装备会自动转为材料，不会直接进入背包。</p>` : ""}
      </details>
    </div>
  `;
}

function legacyNormalizeDamage(value, options = {}) {
  const normalized = Object.is(value, -0) ? 0 : Number(value);
  const allowZero = typeof options === "boolean" ? options : Boolean(options.allowZero);
  if (!Number.isFinite(normalized)) return allowZero ? 0 : 1;
  if (allowZero) return Math.max(0, Math.floor(normalized));
  return Math.max(1, Math.floor(normalized));
}

function normalizeDamage(value, options = {}) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.normalizeDamage === "function") return runtime.normalizeDamage(value, options);
  return legacyNormalizeDamage(value, options);
}

function legacySanitizeDamage(value, allowZero = false) {
  return normalizeDamage(value, { allowZero });
}

function sanitizeDamage(value, allowZero = false) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.sanitizeDamage === "function") return runtime.sanitizeDamage(value, allowZero);
  return legacySanitizeDamage(value, allowZero);
}

function legacyGrantBossEssence(mapIndex) {
  const id = bossEssenceByMap[mapIndex] || bossEssenceByMap[0];
  const amount = applyMaterialQuantityBonus(1 + Math.floor(mapIndex / 2));
  state.materials[id] = (state.materials[id] || 0) + amount;
  recordSessionReward({ materials: amount });
  recordRecentLoot({ materials: [{ materialId: id, name: materialNames[id] || id, qty: amount }] }, "Boss战利品");
  addLog(`获得 ${materialNames[id]} × ${amount}。`);
}

function grantBossEssence(mapIndex) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.grantBossEssence === "function") {
    return runtime.grantBossEssence(mapIndex);
  }
  return legacyGrantBossEssence(mapIndex);
}

function applyMaterialQuantityBonus(amount, stats = computeStats()) {
  const baseAmount = Math.max(0, Number(amount) || 0);
  const boosted = baseAmount * (1 + (stats.materialQuantityBonus || 0));
  const whole = Math.floor(boosted);
  return whole + (Math.random() < boosted - whole ? 1 : 0);
}

function legacyDefeatEnemy() {
  const map = currentMap();
  const monster = currentMonsterStats();
  updateActiveEnemyHpInGroup();
  const bossBonus = state.enemyBoss ? 2 : 1;
  const stats = computeStats();
  const goldGain = Math.round(monster.gold * bossBonus * stats.goldMultiplier * stats.monsterGoldMultiplier);
  const baseExpGain = Math.round(monster.exp * stats.baseExpMultiplier);
  const jobExpGain = Math.round(monster.jobExp * (state.hero.jobId === "novice" ? 1.12 : 1) * stats.jobExpMultiplier);

  state.gold += goldGain;
  showMonsterDeathFeedback(monster);
  addFloatText(`+${formatNumber(baseExpGain)} BASE`, 330, 168, "#456e91");
  addFloatText(`+${formatNumber(jobExpGain)} JOB`, 330, 202, "#6a5f9f");
  gainExp(baseExpGain, jobExpGain);
  state.totalKills += 1;
  recordSessionReward({ kills: 1, bossKills: state.enemyBoss ? 1 : 0, abyssKills: state.currentDifficulty === "abyss" ? 1 : 0, gold: goldGain, baseExp: baseExpGain, jobExp: jobExpGain });
  recordRecentLoot({ gold: goldGain, baseExp: baseExpGain, jobExp: jobExpGain, killCount: 1 }, state.enemyBoss ? "Boss战利品" : state.currentDifficulty === "abyss" ? "深渊战利品" : "战斗战利品");
  updateDailyGoalProgress("daily_kills", 1);
  if (state.enemyBoss) updateDailyGoalProgress("daily_boss", 1);
  if (monster.id) {
    state.monsterCodex[monster.id] = state.monsterCodex[monster.id] || { killCount: 0, firstKilled: false, rewardsClaimed: {} };
    state.monsterCodex[monster.id].killCount += 1;
    if (!state.monsterCodex[monster.id].firstKilled) state.monsterCodex[monster.id].firstKilled = true;
  }

  if (state.enemyBoss) {
    grantBossEssence(state.currentMap);
    state.areaKills = 0;
    const diffProgress = state.mapDifficultyProgress || {};
    const mapId = currentMap().id;
    if (!diffProgress[mapId]) diffProgress[mapId] = { normal: { unlocked: true, cleared: false }, hard: { unlocked: false, cleared: false }, abyss: { unlocked: false, cleared: false } };
    if (state.currentDifficulty === "normal") {
      diffProgress[mapId].normal.cleared = true;
      diffProgress[mapId].hard.unlocked = true;
      addLog(`${currentMap().name} 普通难度通关，困难难度解锁。`);
    } else if (state.currentDifficulty === "hard") {
      diffProgress[mapId].hard.cleared = true;
      diffProgress[mapId].abyss.unlocked = true;
      addLog(`${currentMap().name} 困难难度通关，深渊难度解锁。`);
    } else if (state.currentDifficulty === "abyss") {
      diffProgress[mapId].abyss.cleared = true;
    }
    if (getAutoBossEnabled()) addLog("自动挑战 BOSS 成功。");
    if (state.currentDifficulty === "normal" && state.currentMap < maps.length - 1) {
      state.bestMap = Math.max(state.bestMap, state.currentMap + 1);
      const nextMapId = maps[state.currentMap + 1].id;
      if (!diffProgress[nextMapId]) diffProgress[nextMapId] = { normal: { unlocked: true, cleared: false }, hard: { unlocked: false, cleared: false }, abyss: { unlocked: false, cleared: false } };
      diffProgress[nextMapId].normal.unlocked = true;
      addLog(`首领退却，${maps[state.currentMap + 1].name} 开放。`);
    } else if (state.currentDifficulty === "normal" && state.currentMap >= maps.length - 1) {
      addLog("浮岛神殿的钟声传遍边境。");
    }
    state.mapDifficultyProgress = diffProgress;
    if (!state.vip.bossFirstKills) state.vip.bossFirstKills = {};
    const bossKey = `${currentMap().id}_${state.currentDifficulty}`;
    if (!state.vip.bossFirstKills[bossKey]) {
      state.vip.bossFirstKills[bossKey] = true;
      const vipBossReward = state.currentDifficulty === "abyss" ? 200 : state.currentDifficulty === "hard" ? 150 : 100;
      gainVipExp(vipBossReward + Math.floor(state.currentMap * 15));
      addLog(`首次击败 ${currentMap().name} ${DIFFICULTY_CONFIG[state.currentDifficulty]?.label} Boss，获得冒险者荣誉经验 +${vipBossReward + Math.floor(state.currentMap * 15)}。`);
    }
  } else {
    state.areaKills = Math.min(bossRequirement(), state.areaKills + 1);
  }
  const groupHasMoreMonsters = !state.enemyBoss && hasLivingEncounterMembers();
  const shouldAutoBossAfterKill = !state.enemyBoss && !groupHasMoreMonsters && isBossChallengeReady() && getAutoBossEnabled();

  const equipmentDropCount = rollDrops({ boss: state.enemyBoss, monster });
  const mutationEquipmentDropCount = monster.mutation
    ? rollMutationExtraDrops(monster, stats, equipmentDropCount)
    : 0;
  if (monster.mutation) {
    addLog("击败变异怪，获得额外奖励判定。");
  }
  grantPassiveSkillKillExp({ isBoss: state.enemyBoss, isMutated: Boolean(monster.mutation) });
  updateQuestProgress({
    mapId: map.id,
    monsterId: monster.id,
    difficulty: state.currentDifficulty,
    isMutated: Boolean(monster.mutation),
    isBoss: state.enemyBoss,
    count: 1,
  });
  gainMapExploration(map.id, explorationGainForKill({ isBoss: state.enemyBoss, isMutated: Boolean(monster.mutation), difficulty: state.currentDifficulty }));
  trackKillAchievements({ isBoss: state.enemyBoss, isMutated: Boolean(monster.mutation), difficulty: state.currentDifficulty });
  if (!state.enemyBoss) {
    const hadEquipment = equipmentDropCount + mutationEquipmentDropCount > 0;
    if (hadEquipment) {
      state.equipmentPityKills = 0;
    } else {
      state.equipmentPityKills = (state.equipmentPityKills || 0) + 1;
      if (state.equipmentPityKills >= getEquipmentPityThreshold()) {
        const pityStats = computeStats();
        const pityDrops = rollEquipmentTableDrops(pityStats, { boss: false, guaranteed: true });
        if (pityDrops > 0) state.equipmentPityKills = 0;
      }
    }
  }
  if (shouldAutoBossAfterKill) {
    challengeBoss({ auto: true });
  } else if (groupHasMoreMonsters) {
    syncActiveEnemyFromGroup();
  } else {
    spawnEnemy(false);
  }
  renderAll();
}

function defeatEnemy() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.settleDefeatedEnemy === "function") {
    return runtime.settleDefeatedEnemy({
      map: currentMap(),
      monster: currentMonsterStats(),
      isBoss: Boolean(state.enemyBoss),
      difficulty: state.currentDifficulty,
      stats: computeStats(),
    });
  }
  return legacyDefeatEnemy();
}

function spawnEnemy(isBoss) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.spawnEnemy === "function") {
    return runtime.spawnEnemy(isBoss);
  }
  return legacySpawnEnemy(isBoss);
}

function legacySpawnEnemy(isBoss) {
  const map = currentMap();
  state.enemyBoss = Boolean(isBoss);
  state.enemyGroup = createEnemyGroup(map, state.enemyBoss);
  syncActiveEnemyFromGroup();
  state.enemyAttackTimer = 0;
  state.playerAttackTimer = 0;
  state.damageCarry = 0;
  if (state.enemyBoss) showBossBanner(map);
  (state.enemyGroup?.monsters || []).forEach((monster) => {
    if (monster.mutation) addLog(`遭遇变异怪：${monster.name}。`);
  });
}

function currentMonsterStats() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.currentMonsterStats === "function") {
    return runtime.currentMonsterStats();
  }
  return legacyCurrentMonsterStats();
}

function legacyCurrentMonsterStats() {
  if (state.enemy) return { ...state.enemy, currentHp: state.enemyHp };
  const map = currentMap();
  const template = getMonsterTemplate(map, state.enemyTemplateId, state.enemyBoss);
  return buildMonsterStats(map, state.enemyBoss, state.enemyLevel || getMapLevelRange(map).minLevel, template);
}

function normalizeEnemyGroup(group) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.normalizeEnemyGroup === "function") {
    return runtime.normalizeEnemyGroup(group);
  }
  return legacyNormalizeEnemyGroup(group);
}

function legacyNormalizeEnemyGroup(group) {
  if (!group || !Array.isArray(group.monsters) || !group.monsters.length) return null;
  const monsters = group.monsters.map((monster) => ({
    ...monster,
    currentHp: clampNumber(Number(monster.currentHp ?? monster.maxHp ?? 1), 0, Number(monster.maxHp || 1)),
    maxHp: Math.max(1, Number(monster.maxHp || 1)),
    alive: monster.alive !== false && Number(monster.currentHp ?? monster.maxHp ?? 1) > 0,
  }));
  const activeIndex = clampNumber(Number(group.activeIndex || 0), 0, monsters.length - 1);
  return { ...group, activeIndex, monsters };
}

function createEnemyGroup(map, isBoss = false) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.createEnemyGroup === "function") {
    return runtime.createEnemyGroup(map, isBoss);
  }
  return legacyCreateEnemyGroup(map, isBoss);
}

function legacyCreateEnemyGroup(map, isBoss = false) {
  const size = getEncounterSize(isBoss);
  const monsters = Array.from({ length: size }, () => createEncounterMonster(map, isBoss));
  const label = isBoss ? "首领遭遇" : getEncounterLabel(monsters);
  return { label, activeIndex: 0, monsters };
}

function getEncounterSize(isBoss = false) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.getEncounterSize === "function") {
    return runtime.getEncounterSize(isBoss);
  }
  return legacyGetEncounterSize(isBoss);
}

function legacyGetEncounterSize(isBoss = false) {
  if (isBoss) return 1;
  if (state.currentDifficulty === "abyss") return randomInt(2, 5);
  if (state.currentDifficulty === "hard") return randomInt(2, 4);
  return randomInt(1, 3);
}

function getEncounterLabel(monsters = []) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.getEncounterLabel === "function") {
    return runtime.getEncounterLabel(monsters);
  }
  return legacyGetEncounterLabel(monsters);
}

function legacyGetEncounterLabel(monsters = []) {
  if (state.currentDifficulty === "abyss") return monsters.some((m) => m.mutation) ? "深渊突袭" : "深渊遭遇";
  if (monsters.some((m) => m.mutation)) return "变异突袭";
  if (monsters.some((m) => m.type === "elite")) return "精英带队";
  return monsters.length > 1 ? "小队遭遇" : "单体遭遇";
}

function createEncounterMonster(map, isBoss = false) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.createEncounterMonster === "function") {
    return runtime.createEncounterMonster(map, isBoss);
  }
  return legacyCreateEncounterMonster(map, isBoss);
}

function legacyCreateEncounterMonster(map, isBoss = false) {
  const template = pickMonsterTemplate(map, isBoss);
  const mutationId = isBoss ? "" : rollMonsterMutation()?.id || "";
  const level = rollMonsterLevel(map, isBoss, template);
  const monster = buildMonsterStats(map, isBoss, level, template, mutationId);
  return {
    ...monster,
    templateId: template.id,
    mutationId,
    currentHp: monster.maxHp,
    alive: true,
  };
}

function syncActiveEnemyFromGroup() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.syncActiveEnemyFromGroup === "function") {
    return runtime.syncActiveEnemyFromGroup();
  }
  return legacySyncActiveEnemyFromGroup();
}

function legacySyncActiveEnemyFromGroup() {
  const group = normalizeEnemyGroup(state.enemyGroup);
  state.enemyGroup = group;
  const active = group?.monsters?.find((monster) => monster.alive);
  if (!active) {
    state.enemy = null;
    state.enemyHp = 0;
    state.enemyMaxHp = 0;
    return null;
  }
  group.activeIndex = group.monsters.indexOf(active);
  state.enemy = { ...active };
  state.enemyTemplateId = active.templateId || active.id || "";
  state.enemyMutationId = active.mutationId || "";
  state.enemyLevel = active.level || 1;
  state.enemyMaxHp = active.maxHp || 1;
  state.enemyHp = clampNumber(Number(active.currentHp ?? active.maxHp ?? 1), 0, state.enemyMaxHp);
  return active;
}

function updateActiveEnemyHpInGroup() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.updateActiveEnemyHpInGroup === "function") {
    return runtime.updateActiveEnemyHpInGroup();
  }
  return legacyUpdateActiveEnemyHpInGroup();
}

function legacyUpdateActiveEnemyHpInGroup() {
  const group = state.enemyGroup;
  if (!group || !Array.isArray(group.monsters)) return;
  const monster = group.monsters[group.activeIndex];
  if (!monster) return;
  monster.currentHp = Math.max(0, Number(state.enemyHp) || 0);
  monster.alive = monster.currentHp > 0;
}

function hasLivingEncounterMembers() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.hasLivingEncounterMembers === "function") {
    return runtime.hasLivingEncounterMembers();
  }
  return legacyHasLivingEncounterMembers();
}

function legacyHasLivingEncounterMembers() {
  updateActiveEnemyHpInGroup();
  return Boolean((state.enemyGroup?.monsters || []).some((monster) => monster.alive));
}

function getMapLevelRange(mapOrId) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.getMapLevelRange === "function") {
    return runtime.getMapLevelRange(mapOrId);
  }
  return legacyGetMapLevelRange(mapOrId);
}

function legacyGetMapLevelRange(mapOrId) {
  const id = typeof mapOrId === "string" ? mapOrId : mapOrId?.id;
  if (mapLevelRanges[id]) return mapLevelRanges[id];
  const tableId = mapDropTableAlias[id] || id;
  return mapLevelRanges[tableId] || mapLevelRanges.beginner_field;
}

function bossDisplayName(map = currentMap(), difficulty = state.currentDifficulty) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.bossDisplayName === "function") {
    return runtime.bossDisplayName(map, difficulty);
  }
  return legacyBossDisplayName(map, difficulty);
}

function legacyBossDisplayName(map = currentMap(), difficulty = state.currentDifficulty) {
  const name = map?.boss || "地图首领";
  return difficulty === "abyss" ? `深渊 ${name}` : name;
}

function pickMonsterTemplate(map, isBoss = false) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.pickMonsterTemplate === "function") {
    return runtime.pickMonsterTemplate(map, isBoss);
  }
  return legacyPickMonsterTemplate(map, isBoss);
}

function legacyPickMonsterTemplate(map, isBoss = false) {
  if (isBoss) return map.bossTemplate || monsterTemplate(`${map.id}_boss`, map.boss, [map.maxLevel, map.maxLevel], [map.baseHp * map.bossMultiplier, map.baseHp * map.bossMultiplier], [20, 20], [10, 10], [map.baseExp * 8, map.baseExp * 8], [map.jobExp * 8, map.jobExp * 8], [map.gold * 8, map.gold * 8], "boss");
  const monsters = Array.isArray(map.monsters) && map.monsters.length ? map.monsters : [monsterTemplate(`${map.id}_monster`, map.enemy, [map.minLevel, map.maxLevel], [map.baseHp, map.baseHp * 2], getMapLevelRange(map).attackRange, [1, 10], [map.baseExp, map.baseExp * 2], [map.jobExp, map.jobExp * 2], [map.gold, map.gold * 2])];
  const elite = monsters.filter((entry) => entry.type === "elite");
  if (elite.length && Math.random() < 0.1) return elite[Math.floor(Math.random() * elite.length)];
  const normal = monsters.filter((entry) => entry.type !== "elite");
  const pool = normal.length ? normal : monsters;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getMonsterTemplate(map, templateId, isBoss = false) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.getMonsterTemplate === "function") {
    return runtime.getMonsterTemplate(map, templateId, isBoss);
  }
  return legacyGetMonsterTemplate(map, templateId, isBoss);
}

function legacyGetMonsterTemplate(map, templateId, isBoss = false) {
  if (isBoss) return map.bossTemplate || pickMonsterTemplate(map, true);
  const monsters = Array.isArray(map.monsters) ? map.monsters : [];
  return monsters.find((entry) => entry.id === templateId) || monsters[0] || pickMonsterTemplate(map, false);
}

function currentDifficultyConfig() {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.currentDifficultyConfig === "function") {
    return runtime.currentDifficultyConfig();
  }
  return legacyCurrentDifficultyConfig();
}

function legacyCurrentDifficultyConfig() {
  return DIFFICULTY_CONFIG[state.currentDifficulty] || DIFFICULTY_CONFIG.normal;
}

function getMutationById(id) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.getMutationById === "function") {
    return runtime.getMutationById(id);
  }
  return legacyGetMutationById(id);
}

function legacyGetMutationById(id) {
  return MUTATION_TYPES.find((mutation) => mutation.id === id) || null;
}

function rollMonsterMutation(difficulty = state.currentDifficulty) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.rollMonsterMutation === "function") {
    return runtime.rollMonsterMutation(difficulty);
  }
  return legacyRollMonsterMutation(difficulty);
}

function legacyRollMonsterMutation(difficulty = state.currentDifficulty) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.normal;
  if (Math.random() >= config.mutationChance) return null;
  return MUTATION_TYPES[Math.floor(Math.random() * MUTATION_TYPES.length)];
}

function rollMonsterLevel(map, isBoss = false, template = null) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.rollMonsterLevel === "function") {
    return runtime.rollMonsterLevel(map, isBoss, template);
  }
  return legacyRollMonsterLevel(map, isBoss, template);
}

function legacyRollMonsterLevel(map, isBoss = false, template = null) {
  const range = getMapLevelRange(map);
  const levelRange = template?.levelRange || [range.minLevel, range.maxLevel];
  const minLevel = clampNumber(levelRange[0], range.minLevel, isBoss ? range.maxLevel + 5 : range.maxLevel);
  const maxLevel = clampNumber(levelRange[1], minLevel, isBoss ? range.maxLevel + 5 : range.maxLevel);
  return randomInt(minLevel, maxLevel);
}

function buildMonsterStats(map, isBoss, level, template = null, mutationId = state.enemyMutationId) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.buildMonsterStats === "function") {
    return runtime.buildMonsterStats(map, isBoss, level, template, mutationId);
  }
  return legacyBuildMonsterStats(map, isBoss, level, template, mutationId);
}

function legacyBuildMonsterStats(map, isBoss, level, template = null, mutationId = state.enemyMutationId) {
  const monster = template || getMonsterTemplate(map, state.enemyTemplateId, isBoss);
  const difficulty = currentDifficultyConfig();
  const mutation = isBoss ? null : getMutationById(mutationId);
  const levelRange = monster.levelRange || [map.minLevel || 1, map.maxLevel || 1];
  const levelRatio = levelRange[1] === levelRange[0] ? 1 : clampNumber((level - levelRange[0]) / (levelRange[1] - levelRange[0]), 0, 1);
  const nameParts = [];
  if (state.currentDifficulty !== "normal") nameParts.push(difficulty.label || "困难");
  if (mutation) nameParts.push(mutation.prefix);
  nameParts.push(monster.name || (isBoss ? map.boss : map.enemy));
  const expMultiplier = (isBoss ? BOSS_EXP_MULTIPLIER : 1) * (mutation?.exp || 1) * difficulty.exp;
  const jobExpMultiplier = (isBoss ? BOSS_EXP_MULTIPLIER : 1) * (mutation?.jobExp || 1) * difficulty.jobExp;
  const baseStats = {
    maxHp: Math.max(1, Math.round(lerpRange(monster.hpRange, map.baseHp || 1, levelRatio) * (mutation?.hp || 1) * difficulty.hp)),
    attack: Math.max(1, Math.round(lerpRange(monster.attackRange, getMapLevelRange(map).attackRange[0], levelRatio) * (mutation?.attack || 1) * difficulty.attack)),
    defense: Math.max(1, Math.round(lerpRange(monster.defenseRange, 1, levelRatio) * (mutation?.defense || 1) * difficulty.defense)),
    exp: Math.max(1, Math.round(lerpRange(monster.baseExpRange, map.baseExp || 1, levelRatio) * BASE_EXP_GLOBAL_MULTIPLIER * expMultiplier)),
    jobExp: Math.max(1, Math.round(lerpRange(monster.jobExpRange, map.jobExp || map.baseExp || 1, levelRatio) * JOB_EXP_GLOBAL_MULTIPLIER * jobExpMultiplier)),
    gold: Math.max(1, Math.round(lerpRange(monster.goldRange, map.gold || 1, levelRatio) * (mutation?.gold || 1) * difficulty.gold)),
  };
  const baselineStats = applyDifficultyTierBaseline(map, baseStats, isBoss, state.currentDifficulty);
  const difficultyType = getMonsterDifficultyType({ isBoss, monster, mutation, difficultyId: state.currentDifficulty });
  const finalStats = applyMonsterDifficultyModifier(baselineStats, difficultyType);
  return {
    id: monster.id || `${map.id}_${isBoss ? "boss" : "monster"}`,
    name: nameParts.join(" "),
    type: monster.type || (isBoss ? "boss" : "normal"),
    difficultyType,
    mutation,
    difficulty: state.currentDifficulty,
    level,
    maxHp: finalStats.maxHp,
    currentHp: state.enemyHp,
    attack: finalStats.attack,
    defense: finalStats.defense,
    armorPierce: finalStats.armorPierce || 0,
    critChance: finalStats.critChance || 0,
    critDamage: finalStats.critDamage || 0,
    executeDamage: finalStats.executeDamage || 0,
    damageReduction: finalStats.damageReduction || 0,
    antiLifeSteal: finalStats.antiLifeSteal || 0,
    abyssSuppression: finalStats.abyssSuppression || 0,
    abyssPower: finalStats.abyssPower || 0,
    hit: finalStats.hit || 1,
    recommendedScores: getRecommendedScoresForMonster(map, difficultyType, isBoss),
    exp: finalStats.exp,
    jobExp: finalStats.jobExp,
    gold: finalStats.gold,
    image: monsterImageSource(monster.id || `${map.id}_${isBoss ? "boss" : "monster"}`),
    mapId: map.id,
  };
}

function getMonsterDifficultyType({ isBoss = false, monster = {}, mutation = null, difficultyId = state.currentDifficulty } = {}) {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.getMonsterDifficultyType === "function") {
    return runtime.getMonsterDifficultyType({ isBoss, monster, mutation, difficultyId });
  }
  return legacyGetMonsterDifficultyType({ isBoss, monster, mutation, difficultyId });
}

function legacyGetMonsterDifficultyType({ isBoss = false, monster = {}, mutation = null, difficultyId = state.currentDifficulty } = {}) {
  const eliteLike = monster.type === "elite" || mutation?.id === "elite";
  if (difficultyId === "abyss" && isBoss) return "abyssBoss";
  if (difficultyId === "abyss" && eliteLike) return "abyssElite";
  if (difficultyId === "abyss") return "abyss";
  if (difficultyId === "hard" && isBoss) return "hardBoss";
  if (difficultyId === "hard" && eliteLike) return "hardElite";
  if (difficultyId === "hard") return "hard";
  if (isBoss) return "boss";
  if (eliteLike) return "elite";
  return "normal";
}

function applyMonsterDifficultyModifier(stats = {}, type = "normal") {
  const runtime = window.RuneFrontierCombatRuntime;
  if (runtime && typeof runtime.applyMonsterDifficultyModifier === "function") {
    return runtime.applyMonsterDifficultyModifier(stats, type);
  }
  return legacyApplyMonsterDifficultyModifier(stats, type);
}

function legacyApplyMonsterDifficultyModifier(stats = {}, type = "normal") {
  const modifier = MONSTER_DIFFICULTY_MODIFIERS[type] || MONSTER_DIFFICULTY_MODIFIERS.normal;
  const critDamage = Math.max(Number(stats.critDamage || 0), Number(modifier.critDamage || 1.5) - 1);
  return {
    ...stats,
    maxHp: Math.max(1, Math.round(Number(stats.maxHp || 1) * Number(modifier.hp || 1))),
    attack: Math.max(1, Math.round(Number(stats.attack || 1) * Number(modifier.atk || 1))),
    defense: Math.max(1, Math.round(Number(stats.defense || 1) * Number(modifier.def || 1))),
    hit: Number(modifier.hit || stats.hit || 1),
    critChance: Math.max(Number(stats.critChance || 0), Number(modifier.critChance || 0)),
    critDamage,
    damageReduction: Math.max(Number(stats.damageReduction || 0), Number(modifier.damageReduction || 0)),
    armorPierce: Math.max(Number(stats.armorPierce || 0), Number(modifier.armorPierce || 0)),
    executeDamage: Math.max(Number(stats.executeDamage || 0), Number(modifier.executeDamage || 0)),
    antiLifeSteal: Math.max(Number(stats.antiLifeSteal || 0), Number(modifier.antiLifeSteal || 0)),
    abyssSuppression: Math.max(Number(stats.abyssSuppression || 0), Number(modifier.abyssSuppression || 0)),
    abyssPower: Math.max(Number(stats.abyssPower || 0), Number(modifier.abyssPower || 0)),
  };
}

function getRecommendedScoresForMonster(map = currentMap(), difficultyType = "normal", isBoss = false) {
  const difficultyId = difficultyType.startsWith("abyss") ? "abyss" : state.currentDifficulty;
  return getRecommendedScoresForMap(map, difficultyId, isBoss, difficultyType);
}

function getRecommendedScoresForMap(map = currentMap(), difficultyId = state.currentDifficulty, isBoss = false, difficultyType = "") {
  const range = getMapLevelRange(map);
  const basePower = difficultyId === "abyss"
    ? ABYSS_MAP_TIER_SCALE[map.id]?.recommendedPower || 120000
    : difficultyId === "hard"
      ? HARD_MAP_TIER_SCALE[map.id]?.recommendedPower || 130000
    : Math.round((range.recommendedPower || map.recommendedPower || 80) * (DIFFICULTY_CONFIG[difficultyId]?.power || 1));
  const type = difficultyType || getMonsterDifficultyType({ isBoss, monster: { type: isBoss ? "boss" : "normal" }, difficultyId });
  const typeScale = {
    normal: 1,
    elite: 1.25,
    boss: 1.65,
    hard: 1.08,
    hardElite: 1.42,
    hardBoss: 2.05,
    abyss: 1,
    abyssElite: 1.28,
    abyssBoss: 1.9,
  }[type] || 1;
  const target = Math.max(1, Math.round(basePower * typeScale));
  const output = Math.round(target * (isBoss || type.includes("Boss") ? 0.52 : 0.42));
  const survival = Math.round(target * (difficultyId === "abyss" ? 0.45 : difficultyId === "hard" ? 0.42 : 0.36));
  return {
    output,
    survival,
    boss: isBoss || type.includes("Boss") || difficultyId === "hard" ? Math.round(target * (difficultyId === "hard" ? 0.26 : 0.32)) : 0,
    abyss: difficultyId === "abyss" || type.startsWith("abyss") ? Math.round(target * 0.38) : 0,
  };
}

function applyDifficultyTierBaseline(map, stats, isBoss = false, difficultyId = state.currentDifficulty) {
  if (difficultyId === "abyss") return applyAbyssBaseline(map, stats, isBoss);
  if (difficultyId === "hard") return applyHardBaseline(map, stats, isBoss);
  return stats;
}

function applyHardBaseline(map, stats, isBoss = false) {
  const scale = HARD_MAP_TIER_SCALE[map.id] || HARD_MAP_TIER_SCALE.grass;
  const tier = DIFFICULTY_TIER_MODIFIERS.hard;
  const boss = isBoss ? { hp: 1.85, attack: 1.45, defense: 1.32, exp: 1.65, jobExp: 1.65, gold: 1.55 } : { hp: 1, attack: 1, defense: 1, exp: 1, jobExp: 1, gold: 1 };
  const attackScale = scale.attack * boss.attack;
  return {
    maxHp: Math.max(stats.maxHp, Math.round(HARD_BASELINE.hp * scale.hp * boss.hp)),
    attack: Math.max(stats.attack, Math.round(HARD_BASELINE.attack * attackScale)),
    defense: Math.max(stats.defense, Math.round(HARD_BASELINE.defense * scale.defense * boss.defense)),
    exp: Math.max(stats.exp, Math.round(HARD_BASELINE.baseExp * scale.exp * boss.exp)),
    jobExp: Math.max(stats.jobExp, Math.round(HARD_BASELINE.jobExp * scale.exp * boss.jobExp)),
    gold: Math.max(stats.gold, Math.round(HARD_BASELINE.gold * scale.gold * boss.gold)),
    armorPierce: isBoss ? Math.max(0.08, (tier.armorPierce || 0) + 0.03) : (tier.armorPierce || 0.03),
    critChance: Math.min(0.28, 0.06 + scale.attack * 0.018 + (isBoss ? 0.06 : 0)),
    critDamage: Math.min(0.85, 0.28 + scale.attack * 0.03 + (isBoss ? 0.18 : 0)),
    executeDamage: isBoss ? Math.min(0.25, 0.08 + scale.attack * 0.02) : 0,
    damageReduction: tier.damageReduction || 0,
  };
}

function applyAbyssBaseline(map, stats, isBoss = false) {
  const scale = ABYSS_MAP_TIER_SCALE[map.id] || ABYSS_MAP_TIER_SCALE.grass;
  const tier = DIFFICULTY_TIER_MODIFIERS.abyss;
  const boss = isBoss ? ABYSS_BOSS_EXTRA_MULTIPLIER : { hp: 1, attack: 1, defense: 1, exp: 1, jobExp: 1, gold: 1 };
  const attackScale = scale.attack * boss.attack;
  return {
    maxHp: Math.max(stats.maxHp, Math.round(ABYSS_BASELINE.hp * scale.hp * boss.hp)),
    attack: Math.max(stats.attack, Math.round(ABYSS_BASELINE.attack * attackScale)),
    defense: Math.max(stats.defense, Math.round(ABYSS_BASELINE.defense * scale.defense * boss.defense)),
    exp: Math.max(stats.exp, Math.round(ABYSS_BASELINE.baseExp * scale.exp * boss.exp)),
    jobExp: Math.max(stats.jobExp, Math.round(ABYSS_BASELINE.jobExp * scale.exp * boss.jobExp)),
    gold: Math.max(stats.gold, Math.round(ABYSS_BASELINE.gold * scale.gold * boss.gold)),
    armorPierce: Math.min(0.55, (tier.armorPierce || 0.18) + scale.attack * 0.025 + (isBoss ? 0.08 : 0)),
    critChance: Math.min(0.38, 0.08 + scale.attack * 0.018 + (isBoss ? 0.08 : 0)),
    critDamage: Math.min(1.2, 0.35 + scale.attack * 0.035 + (isBoss ? 0.25 : 0)),
    executeDamage: Math.min(0.55, 0.12 + scale.attack * 0.02 + (isBoss ? 0.12 : 0)),
    damageReduction: tier.damageReduction || 0,
    antiLifeSteal: tier.antiLifeSteal || 0,
    abyssSuppression: tier.abyssSuppression || 0,
    abyssPower: attackScale,
  };
}

function lerpRange(range, fallback, ratio) {
  if (!Array.isArray(range)) return fallback;
  const min = Number(range[0]);
  const max = Number(range[1]);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return fallback;
  return min + (max - min) * ratio;
}

function legacyRollDrops(options = {}) {
  const stats = computeStats();
  const isBoss = Boolean(options.boss);
  const equipmentDropCount = rollEquipmentTableDrops(stats, { boss: isBoss });
  const zodiacDropCount = rollZodiacSetDrops(options.monster || currentMonsterStats(), stats, { boss: isBoss });
  const transitionDropCount = rollTransitionSetDrops(options.monster || currentMonsterStats(), stats, { boss: isBoss });
  const mythicDropCount = rollMythicEquipmentDrop(options.monster || currentMonsterStats(), stats, { boss: isBoss });
  rollMapMaterialDrops(stats, { boss: isBoss });
  maybeDropMythicEssence(stats, { boss: isBoss });
  maybeDropDarkGoldFragments(stats, { boss: isBoss });
  maybeDropSocketMaterials(stats, { boss: isBoss });

  rollCardDropsFromTable(stats, { boss: isBoss });
  maybeDropBossCardFragments(stats, { boss: isBoss });
  return equipmentDropCount + zodiacDropCount + transitionDropCount + mythicDropCount;
}

function rollDrops(options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.rollDrops === "function") {
    return runtime.rollDrops(options);
  }
  return legacyRollDrops(options);
}

function legacyGrantCardDrop(card, rarity = "rare", source = "卡片掉落") {
  if (!card?.id) return;
  state.cards[card.id] = (state.cards[card.id] || 0) + 1;
  state.cardCodex[card.id] = state.cardCodex[card.id] || { obtained: false, obtainCount: 0, firstObtainedAt: 0 };
  state.cardCodex[card.id].obtained = true;
  state.cardCodex[card.id].obtainCount += 1;
  if (!state.cardCodex[card.id].firstObtainedAt) state.cardCodex[card.id].firstObtainedAt = Date.now();
  recordSessionReward({ cards: 1 });
  recordRecentLoot({ cards: [{ cardId: card.id, name: card.name, rarity: rarity || card.rarity || "rare", qty: 1 }] }, source);
  addLog(`${source}：${card.name}。`);
}

function grantCardDrop(card, rarity = "rare", source = "卡片掉落") {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.grantCardDrop === "function") {
    return runtime.grantCardDrop(card, rarity, source);
  }
  return legacyGrantCardDrop(card, rarity, source);
}

function legacyRollCardDropsFromTable(stats = computeStats(), options = {}) {
  const rows = cardDropTables[currentMap().id] || [];
  const difficulty = currentDifficultyConfig();
  const isBoss = Boolean(options.boss);
  rows.forEach((drop) => {
    if (drop.bossOnly && !isBoss) return;
    const bossMultiplier = drop.bossOnly ? (state.currentDifficulty === "abyss" ? 2.5 : 1) : (isBoss ? 1.5 : 1);
    const finalDropRate = drop.dropRate * (1 + Number(stats.cardDropBonus ?? stats.dropBonus ?? 0)) * difficulty.cardDrop * bossMultiplier;
    if (Math.random() >= finalDropRate) return;
    const card = getSocketCard(drop.cardId);
    if (!card) return;
    grantCardDrop(card, drop.rarity || card.rarity || "rare", drop.bossOnly ? "Boss卡片掉落" : "卡片掉落");
  });
}

function rollCardDropsFromTable(stats = computeStats(), options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.rollCardDropsFromTable === "function") {
    return runtime.rollCardDropsFromTable(stats, options);
  }
  return legacyRollCardDropsFromTable(stats, options);
}

function legacyMaybeDropBossCardFragments(stats = computeStats(), options = {}) {
  if (!options.boss) return;
  const difficulty = state.currentDifficulty || "normal";
  const baseRate = difficulty === "abyss" ? 0.85 : difficulty === "hard" ? 0.45 : 0.25;
  const rate = Math.min(1, baseRate * (1 + Math.min(1, Number(stats.cardDropBonus || stats.dropBonus || 0))));
  if (Math.random() >= rate) return;
  const qty = difficulty === "abyss" ? randomInt(2, 4) : difficulty === "hard" ? randomInt(1, 2) : 1;
  state.materials.bossCardShard = (state.materials.bossCardShard || 0) + qty;
  recordSessionReward({ materials: qty });
  recordRecentLoot({ materials: [{ materialId: "bossCardShard", name: materialNames.bossCardShard, qty, rarity: "legend" }] }, "Boss卡片碎片");
  addLog(`获得 ${materialNames.bossCardShard} ×${qty}。`);
}

function maybeDropBossCardFragments(stats = computeStats(), options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.maybeDropBossCardFragments === "function") {
    return runtime.maybeDropBossCardFragments(stats, options);
  }
  return legacyMaybeDropBossCardFragments(stats, options);
}

function legacyMaybeDropSocketMaterials(stats = computeStats(), options = {}) {
  const difficultyId = state.currentDifficulty || "normal";
  const isBoss = Boolean(options.boss);
  const entries = [
    { id: "socketStone", rate: isBoss ? 0.08 : 0.0025, qty: [1, 1] },
    { id: "advancedSocketStone", rate: isBoss ? 0.025 : 0.0007, qty: [1, 1], minMap: 4 },
    { id: "mythicSocketStone", rate: difficultyId === "abyss" ? (isBoss ? 0.012 : 0.00045) : 0, qty: [1, 1] },
    { id: "cardRemover", rate: isBoss ? 0.035 : 0.001, qty: [1, 1] },
  ];
  entries.forEach((entry) => {
    if ((state.currentMap || 0) < (entry.minMap || 0)) return;
    const rate = Math.min(0.3, entry.rate * (1 + Math.min(1, Number(stats.dropBonus || 0) + Number(stats.materialDropBonus || 0))));
    if (rate <= 0 || Math.random() >= rate) return;
    const qty = randomInt(entry.qty[0], entry.qty[1]);
    state.materials[entry.id] = (state.materials[entry.id] || 0) + qty;
    recordSessionReward({ materials: qty });
    recordRecentLoot({ materials: [{ materialId: entry.id, name: materialNames[entry.id] || entry.id, qty, rarity: MATERIAL_DB[entry.id]?.rarity || "epic" }] }, isBoss ? "Boss打孔材料" : "打孔材料");
    addLog(`获得 ${materialNames[entry.id] || entry.id} ×${qty}。`);
  });
}

function maybeDropSocketMaterials(stats = computeStats(), options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.maybeDropSocketMaterials === "function") {
    return runtime.maybeDropSocketMaterials(stats, options);
  }
  return legacyMaybeDropSocketMaterials(stats, options);
}

function legacyMaybeDropDarkGoldFragments(stats = computeStats(), options = {}) {
  if (!options.boss) return;
  const difficultyId = state.currentDifficulty || "normal";
  const config = DARK_GOLD_FRAGMENT_DROPS[difficultyId] || DARK_GOLD_FRAGMENT_DROPS.normal;
  const mapIndex = Math.max(0, state.currentMap || 0);
  if (mapIndex < (config.minMapIndex || 0)) return;
  const equipmentBonus = Math.min(1.2, Number(stats.equipmentDropBonus || 0));
  const finalRate = Math.min(1, (config.rate || 0) * (1 + equipmentBonus * 0.35));
  if (Math.random() >= finalRate) return;
  const qtyRange = Array.isArray(config.qty) ? config.qty : [1, 1];
  const qty = randomInt(qtyRange[0] || 1, qtyRange[1] || qtyRange[0] || 1);
  state.materials.darkGoldFragment = (state.materials.darkGoldFragment || 0) + qty;
  recordSessionReward({ materials: qty });
  recordRecentLoot({ materials: [{ materialId: "darkGoldFragment", name: materialNames.darkGoldFragment, qty, rarity: "darkGold" }] }, difficultyId === "abyss" ? "深渊Boss材料" : "Boss材料");
  addLog(`获得 ${materialNames.darkGoldFragment} ×${qty}。`);
}

function maybeDropDarkGoldFragments(stats = computeStats(), options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.maybeDropDarkGoldFragments === "function") {
    return runtime.maybeDropDarkGoldFragments(stats, options);
  }
  return legacyMaybeDropDarkGoldFragments(stats, options);
}

function legacyRollMythicEquipmentDrop(monster, stats, options = {}) {
  if (state.currentDifficulty !== "abyss") return 0;
  const isBoss = Boolean(options.boss);
  const baseRate = isBoss ? MYTHIC_DROP_RATES.abyssBoss : monster?.mutation ? MYTHIC_DROP_RATES.abyssMutation : MYTHIC_DROP_RATES.abyssNormal;
  const bossBoost = isBoss ? ABYSS_BOSS_EXTRA_MULTIPLIER.mythicDrop || 1 : 1;
  const rate = baseRate * bossBoost;
  if (Math.random() >= rate) return 0;
  const item = createMutationEquipment("mythic");
  if (!item) return 0;
  addEquipmentToInventory(item, { logDrop: true });
  addLogHtml(`神话装备现世：${renderItemName(item)}`);
  return 1;
}

function rollMythicEquipmentDrop(monster, stats, options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.rollMythicEquipmentDrop === "function") {
    return runtime.rollMythicEquipmentDrop(monster, stats, options);
  }
  return legacyRollMythicEquipmentDrop(monster, stats, options);
}

function legacyRollMapMaterialDrops(stats, options = {}) {
  const rows = materialDropTables[currentMap().id] || [];
  if (!rows.length) return;
  const difficulty = currentDifficultyConfig();
  const bossMultiplier = options.boss ? 2.5 : 1;
  rows.forEach((drop) => {
    const abyssBonus = state.currentDifficulty === "abyss" ? stats.abyssMaterialDropBonus || 0 : 0;
    const finalDropRate = drop.dropRate * (1 + stats.dropBonus + abyssBonus) * difficulty.materialDrop * bossMultiplier;
    if (Math.random() >= finalDropRate) return;
    const qty = applyMaterialQuantityBonus(randomInt(drop.minQty || 1, drop.maxQty || drop.minQty || 1), stats);
    state.materials[drop.materialId] = (state.materials[drop.materialId] || 0) + qty;
    recordSessionReward({ materials: qty });
    recordRecentLoot({ materials: [{ materialId: drop.materialId, name: materialNames[drop.materialId] || drop.materialId, qty }] }, options.boss ? "Boss材料" : "材料掉落");
    addLog(`获得材料：${materialNames[drop.materialId] || drop.materialId} × ${qty}。`);
  });
}

function rollMapMaterialDrops(stats, options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.rollMapMaterialDrops === "function") {
    return runtime.rollMapMaterialDrops(stats, options);
  }
  return legacyRollMapMaterialDrops(stats, options);
}

function legacyRollZodiacSetDrops(monster, stats, options = {}) {
  const map = currentMap();
  const setIds = zodiacSetDropMap[map.id] || [];
  if (!setIds.length) return 0;
  const isBoss = Boolean(options.boss);
  const isHard = state.currentDifficulty === "hard";
  const isAbyss = state.currentDifficulty === "abyss";
  const isMutated = Boolean(monster?.mutation);
  const baseRate = isBoss
    ? isAbyss
      ? ZODIAC_SET_DROP_RATES.hardBoss * 1.35 * ABYSS_BOSS_EXTRA_MULTIPLIER.abyssSetDrop
      : isHard
      ? ZODIAC_SET_DROP_RATES.hardBoss
      : ZODIAC_SET_DROP_RATES.boss
    : isMutated
      ? isAbyss
        ? ZODIAC_SET_DROP_RATES.hardMutation * 1.25
        : isHard
        ? ZODIAC_SET_DROP_RATES.hardMutation
        : ZODIAC_SET_DROP_RATES.mutation
      : isAbyss
        ? ZODIAC_SET_DROP_RATES.hard * 1.2
        : isHard
        ? ZODIAC_SET_DROP_RATES.hard
        : ZODIAC_SET_DROP_RATES.normal;
  const rate = baseRate * (1 + Math.min(1.5, stats.equipmentDropBonus || 0));
  if (Math.random() >= rate) return 0;
  const set = equipmentSets[setIds[Math.floor(Math.random() * setIds.length)]];
  if (!set?.items?.length) return 0;
  const darkRate = (isBoss ? ZODIAC_SET_DROP_RATES.darkGoldBoss : ZODIAC_SET_DROP_RATES.darkGoldNormal) * (isAbyss ? 1.5 : isHard ? 1.25 : 1) * (1 + Math.min(1, stats.equipmentDropBonus || 0));
  const qualityWeight = (stats.mythicWeightBonus || 0) + (isBoss ? stats.bossQualityWeight || 0 : 0);
  const mythicRate = isAbyss ? (isBoss ? MYTHIC_DROP_RATES.abyssBoss * ABYSS_BOSS_EXTRA_MULTIPLIER.mythicDrop : MYTHIC_DROP_RATES.abyssNormal) * 0.5 * (1 + Math.min(1.5, qualityWeight)) : 0;
  const rarity = Math.random() < mythicRate ? "mythic" : Math.random() < darkRate ? "darkGold" : "legend";
  const template = set.items[Math.floor(Math.random() * set.items.length)];
  const dropLevel = monster?.level || template.level || getMapLevelRange(map).maxLevel;
  const item = createItem(template, dropLevel, rarity, { dropMapId: map.id, dropLevel, difficulty: state.currentDifficulty, allowMythic: rarity === "mythic" });
  addEquipmentToInventory(item, { logDrop: true });
  return 1;
}

function rollZodiacSetDrops(monster, stats, options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.rollZodiacSetDrops === "function") {
    return runtime.rollZodiacSetDrops(monster, stats, options);
  }
  return legacyRollZodiacSetDrops(monster, stats, options);
}

function legacyRollTransitionSetDrops(monster, stats, options = {}) {
  const map = currentMap();
  const setIds = transitionSetDropMap[map.id] || [];
  if (!setIds.length) return 0;
  const isBoss = Boolean(options.boss);
  const isHard = state.currentDifficulty === "hard";
  const isAbyss = state.currentDifficulty === "abyss";
  const baseRate = isBoss
    ? isAbyss
      ? TRANSITION_SET_DROP_RATES.abyssBoss
      : isHard
      ? TRANSITION_SET_DROP_RATES.hardBoss
      : TRANSITION_SET_DROP_RATES.boss
    : isAbyss
      ? TRANSITION_SET_DROP_RATES.abyss
      : isHard
      ? TRANSITION_SET_DROP_RATES.hard
      : TRANSITION_SET_DROP_RATES.normal;
  const rate = baseRate * (1 + Math.min(1.2, stats.equipmentDropBonus || 0));
  if (Math.random() >= rate) return 0;
  const set = equipmentSets[setIds[Math.floor(Math.random() * setIds.length)]];
  if (!set?.items?.length) return 0;
  const template = set.items[Math.floor(Math.random() * set.items.length)];
  const dropLevel = monster?.level || template.level || getMapLevelRange(map).maxLevel;
    const item = createItem(template, dropLevel, template.rarity || "rare", { dropMapId: map.id, dropLevel, difficulty: state.currentDifficulty });
  addEquipmentToInventory(item, { logDrop: true });
  return 1;
}

function rollTransitionSetDrops(monster, stats, options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.rollTransitionSetDrops === "function") {
    return runtime.rollTransitionSetDrops(monster, stats, options);
  }
  return legacyRollTransitionSetDrops(monster, stats, options);
}

function legacyRollEquipmentTableDrops(stats, options = {}) {
  const map = currentMap();
  const tableId = mapDropTableAlias[map.id] || map.id;
  const rows = equipmentDropTables[tableId] || [];
  const drops = rollEquipmentDropsFromTable(rows, stats, options);
  drops.forEach((item) => addEquipmentToInventory(item, { logDrop: true }));
  return drops.length;
}

function rollEquipmentTableDrops(stats, options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (!options.offline && runtime && typeof runtime.rollEquipmentTableDrops === "function") {
    return runtime.rollEquipmentTableDrops(stats, options);
  }
  return legacyRollEquipmentTableDrops(stats, options);
}

function legacyRollEquipmentDropsFromTable(rows, stats, options = {}) {
  if (!Array.isArray(rows) || !rows.length) return [];
  const isOffline = options.offline === true;
  const isBoss = options.boss === true;
  const guaranteed = options.guaranteed === true;
  const maxDrops = isBoss ? MAX_BOSS_EQUIPMENT_DROPS : MAX_EQUIPMENT_DROPS_PER_KILL;
  const weighted = rows
    .map((drop) => {
      const finalRate = getEffectiveEquipmentDropRate(drop, stats, { offline: isOffline, boss: isBoss });
      return { drop, finalRate };
    })
    .filter((entry) => entry.finalRate > 0 && equipmentTemplateDb[entry.drop.equipmentId]);
  const drops = [];
  for (let attempt = 0; attempt < maxDrops && weighted.length; attempt += 1) {
    const totalChance = isOffline
      ? Math.min(0.75, weighted.reduce((sum, entry) => sum + entry.finalRate, 0))
      : getOnlineEquipmentDropChance(stats, { boss: isBoss, rows });
    if (!guaranteed && Math.random() >= totalChance) break;
    const pick = weightedChoice(weighted, (entry) => applyRebirthPrestigeDropWeight(entry.drop, Math.max(0, Number(entry.drop.dropRate || 0)), stats, { boss: isBoss }));
    if (!pick) break;
    const template = equipmentTemplateDb[pick.drop.equipmentId];
    const bonus = DIFFICULTY_DROP_LEVEL_BONUS[state.currentDifficulty] || DIFFICULTY_DROP_LEVEL_BONUS.normal;
    const minLv = clampNumber((pick.drop.minLevel || 1) + (bonus.min || 0), 1, MAX_EQUIPMENT_LEVEL);
    const maxLv = clampNumber((pick.drop.maxLevel || 1) + (bonus.max || 0), 1, MAX_EQUIPMENT_LEVEL);
    const dropLevel = randomInt(Math.min(minLv, maxLv), Math.max(minLv, maxLv));
    const darkGoldUpgradeRate = getDarkGoldUpgradeRate({ mapId: pick.drop.mapId || currentMap().id, stats, boss: isBoss, drop: pick.drop });
    const mythicQualityWeight = (stats.mythicWeightBonus || 0) + (isBoss ? stats.bossQualityWeight || 0 : 0);
    const rolledRarity = state.currentDifficulty === "abyss" && Math.random() < Math.min(0.08, mythicQualityWeight)
      ? "mythic"
      : Math.random() < darkGoldUpgradeRate
      ? "darkGold"
      : template.rarity;
    drops.push(createItem(template, dropLevel, rolledRarity, { dropMapId: pick.drop.mapId || currentMap().id, dropLevel, difficulty: state.currentDifficulty, allowMythic: rolledRarity === "mythic" }));
    if (!isBoss) break;
  }
  return drops;
}

function rollEquipmentDropsFromTable(rows, stats, options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (!options.offline && runtime && typeof runtime.rollEquipmentDropsFromTable === "function") {
    return runtime.rollEquipmentDropsFromTable(rows, stats, options);
  }
  return legacyRollEquipmentDropsFromTable(rows, stats, options);
}

function getEquipmentPityThreshold() {
  const configured = EQUIPMENT_PITY_THRESHOLDS[currentMap().id] || {};
  return Number(configured[state.currentDifficulty] || configured.normal || 60);
}

function getMapQualityBonus() {
  const mapId = currentMap().id;
  const diff = state.currentDifficulty;
  const bonus = { epicWeightBonus: 0, ancientWeightBonus: 0, legendWeightBonus: 0, darkGoldWeightBonus: 0, mythicWeightBonus: 0 };
  if (["abyss_lake", "sky"].includes(mapId)) {
    bonus.epicWeightBonus = 0.02; bonus.ancientWeightBonus = 0.01; bonus.legendWeightBonus = 0.005;
    if (diff === "hard") { bonus.ancientWeightBonus = 0.02; bonus.legendWeightBonus = 0.008; bonus.darkGoldWeightBonus = 0.002; }
    if (diff === "abyss") { bonus.ancientWeightBonus = 0.03; bonus.legendWeightBonus = 0.012; bonus.darkGoldWeightBonus = 0.004; bonus.mythicWeightBonus = 0.0005; }
  } else if (["mine", "clock", "glast_heim"].includes(mapId)) {
    if (diff === "hard") { bonus.ancientWeightBonus = 0.01; bonus.legendWeightBonus = 0.003; }
    if (diff === "abyss") { bonus.ancientWeightBonus = 0.015; bonus.legendWeightBonus = 0.006; bonus.darkGoldWeightBonus = 0.001; }
  }
  return bonus;
}

function getDarkGoldUpgradeRate({ mapId, stats = {}, boss = false, drop = {} } = {}) {
  const difficultyId = state.currentDifficulty || "normal";
  const mapRates = DARK_GOLD_UPGRADE_RATES[difficultyId] || DARK_GOLD_UPGRADE_RATES.normal;
  const baseRate = Number(mapRates[mapId || currentMap().id] || 0);
  if (baseRate <= 0) return 0;
  if (rarityRank(drop.rarity || "normal") < rarityRank("legend")) return 0;
  const bossMultiplier = boss ? (DARK_GOLD_UPGRADE_RATES.bossMultiplier?.[difficultyId] || 1) : 1;
  const prestige = getRebirthPrestigeBonuses();
  const equipmentBonus = Math.min(1.2, Number(stats.equipmentDropBonus || 0));
  const rareBonus = Math.min(0.8, Number(stats.rareDropBonus || 0) + Number(prestige.darkGoldPlusWeightBonus || 0) + (boss ? Number(stats.bossQualityWeight || 0) : 0));
  return Math.min(0.08, baseRate * bossMultiplier * (1 + equipmentBonus * 0.35 + rareBonus));
}

function getEffectiveEquipmentDropRate(drop, stats, options = {}) {
  const baseRate = Math.max(0, Number(drop?.dropRate) || 0);
  const rateMultiplier = options.offline ? OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER + (getVipMilestoneBonuses().offlineEquipPenaltyReduction || 0) : EQUIPMENT_DROP_RATE_MULTIPLIER;
  const bossMultiplier = options.boss ? BOSS_EQUIPMENT_DROP_RATE_MULTIPLIER : 1;
  const abyssBossMultiplier = state.currentDifficulty === "abyss" && options.boss ? ABYSS_BOSS_EXTRA_MULTIPLIER.equipmentDrop || 1 : 1;
  const difficulty = currentDifficultyConfig();
  const contextualEquipmentBonus = (stats?.equipmentDropBonus ?? stats?.dropBonus ?? 0) + (options.boss ? Number(stats?.bossEquipDropBonus || 0) : 0);
  return baseRate * (1 + contextualEquipmentBonus) * rateMultiplier * bossMultiplier * abyssBossMultiplier * difficulty.equipmentDrop;
}

function getOnlineEquipmentDropChance(stats, options = {}) {
  const mapId = currentMap().id;
  const rows = Array.isArray(options.rows) ? options.rows : [];
  const configuredRate = Number(ONLINE_EQUIPMENT_BASE_DROP_RATES[mapId]);
  const fallbackRate = rows.reduce((sum, drop) => sum + Math.max(0, Number(drop?.dropRate || 0)), 0) * EQUIPMENT_DROP_RATE_MULTIPLIER;
  const baseRate = Number.isFinite(configuredRate) ? configuredRate : fallbackRate;
  const equipmentBonus = Number(stats?.equipmentDropBonus ?? stats?.dropBonus ?? 0) + (options.boss ? Number(stats?.bossEquipDropBonus || 0) : 0);
  const bossMultiplier = options.boss ? BOSS_EQUIPMENT_DROP_RATE_MULTIPLIER : 1;
  const abyssBossMultiplier = state.currentDifficulty === "abyss" && options.boss ? ABYSS_BOSS_EXTRA_MULTIPLIER.equipmentDrop || 1 : 1;
  return Math.min(0.75, baseRate * (1 + equipmentBonus) * bossMultiplier * abyssBossMultiplier * currentDifficultyConfig().equipmentDrop);
}

function legacyRollMutationExtraDrops(monster, stats, existingEquipmentDrops = 0) {
  const mutation = monster.mutation;
  if (!mutation) return 0;
  const difficulty = currentDifficultyConfig();
  const dropBonus = Math.min(1.5, stats.dropBonus || 0);
  const equipmentDropBonus = Math.min(1.5, stats.equipmentDropBonus ?? stats.dropBonus ?? 0);
  const hardExtra = state.currentDifficulty === "abyss" ? 2 : state.currentDifficulty === "hard" ? 1.5 : 1;
  const materialRate = MUTATION_EXTRA_DROPS.materialBonusRate * hardExtra * (1 + dropBonus) * (mutation.rareMaterialBonus || 1);
  const rareMaterialRate = MUTATION_EXTRA_DROPS.rareMaterialBonusRate * hardExtra * (1 + dropBonus) * (mutation.rareMaterialBonus || 1);
  if (Math.random() < materialRate * difficulty.materialDrop) grantMutationMaterial(false);
  if (Math.random() < rareMaterialRate * difficulty.materialDrop) grantMutationMaterial(true);

  const maxEquipment = state.enemyBoss ? MAX_BOSS_EQUIPMENT_DROPS : MAX_EQUIPMENT_DROPS_PER_KILL;
  if (existingEquipmentDrops >= maxEquipment) return 0;
  const highRate = MUTATION_EXTRA_DROPS.highRarityEquipmentRate * hardExtra * (1 + equipmentDropBonus) * (mutation.highRarityEquipmentBonus || 1);
  const darkRate = MUTATION_EXTRA_DROPS.darkGoldEquipmentRate * (state.currentDifficulty === "abyss" ? 1.5 : state.currentDifficulty === "hard" ? 1.2 : 1) * (1 + equipmentDropBonus) * (mutation.highRarityEquipmentBonus || 1);
  if (Math.random() < darkRate) {
    const item = createMutationEquipment("darkGold");
    if (item) {
      addEquipmentToInventory(item, { logDrop: true });
      return 1;
    }
  } else if (Math.random() < highRate) {
    const item = createMutationEquipment(state.currentMap >= 3 ? "legend" : "epic");
    if (item) {
      addEquipmentToInventory(item, { logDrop: true });
      return 1;
    }
  }
  return 0;
}

function rollMutationExtraDrops(monster, stats, existingEquipmentDrops = 0) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.rollMutationExtraDrops === "function") {
    return runtime.rollMutationExtraDrops(monster, stats, existingEquipmentDrops);
  }
  return legacyRollMutationExtraDrops(monster, stats, existingEquipmentDrops);
}

function legacyGrantMutationMaterial(rareOnly = false) {
  const pool = rareOnly ? ["rune", "ancientCore", "starShard"] : ["ore", "crystal", "rune"];
  const material = pool[Math.min(pool.length - 1, Math.floor(Math.random() * pool.length))];
  const stats = computeStats();
  let amount = applyMaterialQuantityBonus(rareOnly ? 1 : randomInt(1, 2), stats);
  if (!rareOnly && Math.random() < (stats.mutationMaterialDoubleChance || 0)) amount *= 2;
  state.materials[material] = (state.materials[material] || 0) + amount;
  recordSessionReward({ materials: amount });
  recordRecentLoot({ materials: [{ materialId: material, name: materialNames[material] || material, qty: amount }] }, "变异怪材料");
  addLog(`变异怪额外掉落 ${materialNames[material] || material} × ${amount}。`);
}

function grantMutationMaterial(rareOnly = false) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.grantMutationMaterial === "function") {
    return runtime.grantMutationMaterial(rareOnly);
  }
  return legacyGrantMutationMaterial(rareOnly);
}

function legacyMaybeDropMythicEssence(stats = computeStats(), options = {}) {
  if (state.currentDifficulty !== "abyss") return;
  const rate = 0.002 * (options.boss ? 3 : 1) * (1 + (stats.mythicEssenceDropBonus || 0));
  if (Math.random() >= rate) return;
  state.materials.mythicEssence = (state.materials.mythicEssence || 0) + 1;
  recordRecentLoot({ materials: [{ materialId: "mythicEssence", name: materialNames.mythicEssence, qty: 1 }] }, options.boss ? "深渊Boss材料" : "深渊材料");
  addLog("深渊凝结出 神话精粹 ×1。");
}

function maybeDropMythicEssence(stats = computeStats(), options = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.maybeDropMythicEssence === "function") {
    return runtime.maybeDropMythicEssence(stats, options);
  }
  return legacyMaybeDropMythicEssence(stats, options);
}

function createMutationEquipment(rarity) {
  const tableId = mapDropTableAlias[currentMap().id] || currentMap().id;
  const rows = (equipmentDropTables[tableId] || []).filter((drop) => rarityRank(drop.rarity) >= rarityRank(rarity === "darkGold" ? "legend" : rarity));
  const pick = rows.length ? weightedChoice(rows, (drop) => Math.max(0.0001, drop.dropRate)) : null;
  const fallback = allEquipmentTemplates.filter((item) => rarityRank(item.rarity) >= rarityRank("legend"));
  const template = pick ? equipmentTemplateDb[pick.equipmentId] : fallback[Math.floor(Math.random() * fallback.length)];
  if (!template) return null;
  const bonus = DIFFICULTY_DROP_LEVEL_BONUS[state.currentDifficulty] || DIFFICULTY_DROP_LEVEL_BONUS.normal;
  const rawLevel = pick ? randomInt(pick.minLevel, pick.maxLevel) : (currentMonsterStats().level || 30);
  const dropLevel = clampNumber(rawLevel + randomInt(bonus.min, bonus.max), 1, MAX_EQUIPMENT_LEVEL);
  return createItem(template, dropLevel, rarity, { dropMapId: currentMap().id, dropLevel, difficulty: state.currentDifficulty, allowMythic: rarity === "mythic" });
}

function weightedChoice(items, weightFn) {
  const total = items.reduce((sum, item) => sum + Math.max(0, weightFn(item)), 0);
  if (total <= 0) return null;
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= Math.max(0, weightFn(item));
    if (roll <= 0) return item;
  }
  return items[items.length - 1] || null;
}

function rarityRank(rarity) {
  return rarityOrder.indexOf(rarity || "normal");
}

function shouldAutoSalvage(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.shouldAutoSalvage === "function") return runtime.shouldAutoSalvage(item);
  const setting = state.autoSalvage || {};
  if (!setting.enabled || item.locked || item.setId || item.rarity === "mythic" || item.rarity === "darkGold") return false;
  if (isAbyssEquipment(item) && !(setting.autoDismantleAbyss || state.autoDismantleAbyss)) return false;
  return rarityRank(item.rarity) >= 0 && rarityRank(item.rarity) <= rarityRank(setting.maxRarity || "normal");
}

function legacyAddEquipmentToInventory(item, options = {}) {
  const normalized = legacyNormalizeItem(item);
  if (shouldAutoSalvage(normalized)) {
    const rewards = getSalvageRewards(normalized);
    addMaterials(rewards);
    if (!options.offline) recordSessionReward({ autoSalvaged: 1, materials: Object.values(rewards).reduce((sum, amount) => sum + Number(amount || 0), 0) });
    if (!options.offline) recordRecentLoot({ autoSalvagedMaterials: rewards, salvagedMaterials: rewards }, "自动分解");
    if (!options.offline) {
      autoSalvageBatchCount += 1;
      Object.entries(rewards).forEach(([id, qty]) => { autoSalvageBatchMaterials[id] = (autoSalvageBatchMaterials[id] || 0) + qty; });
    }
    showAutoSalvageFeedback(normalized, rewards, options);
    if (options.logDrop) addLog(`自动分解 ${rarityName(normalized.rarity)}装备：${getDisplayItemName(normalized)}，获得 ${materialText(rewards)}。`);
    return { added: false, salvaged: true, rewards };
  }
  if (state.inventory.length >= getInventoryLimit()) {
    if (options.logDrop) addLog("背包已满，装备掉落未能拾取。");
    return { added: false, skipped: true };
  }
  state.inventory.unshift(normalized);
  if (!options.offline) {
    recordSessionReward({ equipments: 1 });
    runtimeSessionStats.equipmentByRarity[normalized.rarity] = (runtimeSessionStats.equipmentByRarity[normalized.rarity] || 0) + 1;
    if (normalized.setId) runtimeSessionStats.zodiacEquipmentCount += 1;
    if (isAbyssEquipment(normalized)) runtimeSessionStats.abyssEquipmentCount += 1;
    if (isAbyssEquipment(normalized) && normalized.setId) runtimeSessionStats.abyssSetEquipmentCount += 1;
    updateDailyGoalProgress("daily_equipment", 1);
  }
  trackEquipmentAchievement(normalized);
  if (options.logDrop) {
    addDropLog(normalized);
    if (!options.offline) { showLootDropFeedback(normalized); showRareLootBroadcast(normalized); }
  }
  if (!options.offline) recordRecentLoot({ equipments: [normalized], equipment: [normalized] }, isAbyssEquipment(normalized) ? "深渊装备掉落" : state.enemyBoss ? "Boss装备掉落" : "装备掉落");
  return { added: true };
}

function addEquipmentToInventory(item, options = {}) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.addEquipmentToInventory === "function") {
    return runtime.addEquipmentToInventory(item, options);
  }
  return legacyAddEquipmentToInventory(item, options);
}

function addMaterials(rewards = {}) {
  Object.entries(rewards).forEach(([material, amount]) => {
    state.materials[material] = (state.materials[material] || 0) + amount;
  });
}

function addDropLog(item) {
  const prefix = item.rarity === "normal" ? "获得装备" : `获得${rarityName(item.rarity)}装备`;
  addLogHtml(`${escapeHtml(prefix)}：${renderItemName(item)}`);
}

function createScaledItem(mapIndex) {
  const template = itemPool[Math.floor(Math.random() * itemPool.length)];
  const level = Math.min(30, Math.max(1, state.hero.baseLevel + mapIndex + Math.floor(Math.random() * 3)));
  return createItem(template, level, null, { dropMapId: currentMap().id, dropLevel: level, difficulty: state.currentDifficulty });
}

function getItemTierForLevel(level) {
  const safeLevel = Math.max(1, Number(level) || 1);
  return ITEM_TIER_LIST.find((tier) => safeLevel >= tier.minLevel && safeLevel <= tier.maxLevel) || ITEM_TIER_LIST[ITEM_TIER_LIST.length - 1];
}

function inferItemTier(item = {}) {
  if (item.itemTier && ITEM_TIER_CONFIG[item.itemTier]) return { id: item.itemTier, ...ITEM_TIER_CONFIG[item.itemTier] };
  return getItemTierForLevel(item.dropLevel || item.level || 1);
}

function getSlotLevelGrowth(slot) {
  return SLOT_LEVEL_GROWTH[normalizeEquipmentSlot(slot)] || 0.035;
}

function getTemplateBaseStats(template = {}) {
  const stats = {};
  [
    "atk",
    "matk",
    "def",
    "hp",
    "aspd",
    "luck",
    "str",
    "agi",
    "vit",
    "int",
    "dex",
    "luk",
    "gold",
    "crit",
    "drop",
  ].forEach((key) => {
    if (template[key]) stats[canonicalItemStat(key)] = template[key];
  });
  return stats;
}

function safeHeroBaseLevel() {
  try {
    return state?.hero?.baseLevel || 1;
  } catch {
    return 1;
  }
}

function legacyCreateItem(template, level, forcedTierId = null, context = {}) {
  const fixedTier = template.source === "monster_drop" || template.setId;
  const tier = forcedTierId
    ? equipmentTiers.find((entry) => entry.id === forcedTierId)
    : fixedTier && template.rarity
      ? equipmentTiers.find((entry) => entry.id === template.rarity) || rollEquipmentTier()
      : rollEquipmentTier();
  let safeTier = tier || equipmentTiers[0];
  if (safeTier.id === "mythic" && !canCreateMythic(context)) {
    safeTier = equipmentTiers.find((entry) => entry.id === "darkGold") || equipmentTiers.find((entry) => entry.id === "legend") || equipmentTiers[0];
  }
  const dropLevel = Math.max(1, Math.round(context.dropLevel || level || safeHeroBaseLevel()));
  const itemTier = context.itemTier ? { id: context.itemTier, ...ITEM_TIER_CONFIG[context.itemTier] } : getItemTierForLevel(dropLevel);
  const slotGrowth = getSlotLevelGrowth(template.slot);
  const quality = randomFloat(safeTier.rolls[0], safeTier.rolls[1]);
  const statScale = safeTier.scale * itemTier.scale * quality * (1 + level * slotGrowth);
  const item = {
    id: `${template.slot}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    instanceId: "",
    templateId: template.id || "",
    name: template.name,
    slot: template.slot,
    equipSlot: template.equipSlot || normalizeEquipmentSlot(template.slot),
    weaponType: template.weaponType || "",
    armorType: template.armorType || "",
    subType: template.subType || inferEquipmentSubType(template),
    equipType: template.equipType || template.weaponType || template.armorType || template.slot,
    source: template.source || "monster_drop",
    image: template.image || equipmentImagePath(template.id || template.name || template.slot),
    requiredLevel: template.requiredLevel || 1,
    requiredJob: template.requiredJob || [],
    allowedJobs: template.allowedJobs || [],
    setId: template.setId || "",
    setName: template.setName || "",
    baseStats: template.baseStats || {},
    description: template.description || "",
    rarity: safeTier.id,
    tier: safeTier.id,
    itemTier: itemTier.id,
    dropMapId: context.dropMapId || "",
    dropLevel,
    sourceDifficulty: context.difficulty || "",
    abyssForged: context.difficulty === "abyss",
    prefix: context.difficulty === "abyss" ? "深渊" : "",
    abyssBonus: {},
    abyssAffixes: [],
    abyssBonusApplied: false,
    abyssSetVariant: false,
    abyssSetBonusApplied: false,
    originalSetId: template.setId || "",
    cardSlots: [],
    templateBaseStats: getTemplateBaseStats(template),
    quality: Math.round(quality * 100),
    refine: 0,
    refineFailCount: 0,
    empower: 0,
    locked: false,
    affixes: [],
    affixDetails: [],
    mechanicAffixes: [],
    ranges: {},
    randomStats: shouldRollRandomStats(template) ? rollRandomStats(safeTier.id) : defaultRandomStats(),
    level,
    atk: Math.round((template.atk || 0) * statScale),
    matk: Math.round((template.matk || 0) * statScale),
    def: Math.round((template.def || 0) * statScale),
    hp: Math.round((template.hp || 0) * statScale),
    aspd: Number(((template.aspd || 0) * (1 + level * 0.018)).toFixed(3)),
    luck: Math.round((template.luck || 0) * statScale),
    str: Math.round((template.str || 0) * statScale),
    agi: Math.round((template.agi || 0) * statScale),
    vit: Math.round((template.vit || 0) * statScale),
    int: Math.round((template.int || 0) * statScale),
    dex: Math.round((template.dex || 0) * statScale),
    luk: Math.round((template.luk || 0) * statScale),
    gold: Number(((template.gold || 0) * (1 + level * 0.025)).toFixed(3)),
    crit: Number(((template.crit || 0) * (1 + level * 0.018)).toFixed(3)),
    drop: Number(((template.drop || 0) * (1 + level * 0.018)).toFixed(3)),
    hpRegen: Math.round((template.hpRegen || 0) * statScale),
    dodgeRate: Number(((template.dodgeRate || 0) * (1 + level * 0.018)).toFixed(3)),
    atkPct: template.atkPct || 0,
    matkPct: template.matkPct || 0,
    hpPct: template.hpPct || 0,
    defPct: template.defPct || 0,
    attackSpeedPct: template.attackSpeedPct || 0,
    critRatePct: template.critRatePct || 0,
    critDamageBonus: template.critDamageBonus || 0,
    skillDamageBonus: template.skillDamageBonus || 0,
    monsterDamageBonus: template.monsterDamageBonus || 0,
    bossDamageBonus: template.bossDamageBonus || 0,
    finalDamageBonus: template.finalDamageBonus || 0,
    eliteDamageBonus: template.eliteDamageBonus || 0,
    rareDropBonus: template.rareDropBonus || 0,
    damageReductionPct: template.damageReductionPct || 0,
    lifeSteal: template.lifeSteal || 0,
    dodgeRatePct: template.dodgeRatePct || 0,
    hpRegenPct: template.hpRegenPct || 0,
    ignoreDefense: template.ignoreDefense || 0,
    baseExpBonus: template.baseExpBonus || 0,
    jobExpBonus: template.jobExpBonus || 0,
    equipmentDrop: template.equipmentDrop || 0,
    cardDrop: template.cardDrop || 0,
    materialQuantityBonus: template.materialQuantityBonus || 0,
    powerPct: template.powerPct || 0,
    combatPaceBonus: template.combatPaceBonus || 0,
    patrolEfficiency: template.patrolEfficiency || 0,
    hitRate: template.hitRate || 0,
    statusResist: template.statusResist || 0,
    abyssDamageBonus: template.abyssDamageBonus || 0,
    abyssBossDamageBonus: template.abyssBossDamageBonus || 0,
    abyssDamageReduction: template.abyssDamageReduction || 0,
    mythicWeightBonus: template.mythicWeightBonus || 0,
    echoChance: template.echoChance || 0,
    mutationMaterialDoubleChance: template.mutationMaterialDoubleChance || 0,
    thornVitMultiplier: template.thornVitMultiplier || 0,
  };
  item.instanceId = item.id;

  addBaseRanges(item, template, safeTier, level, itemTier, slotGrowth);
  applyTierExtra(item, safeTier, level, itemTier);
  applyRandomAffixes(item, safeTier, level, itemTier);
  applyAbyssEquipmentBonus(item);
  return item;
}

function createItem(template, level, forcedTierId = null, context = {}) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.createItem === "function") {
    return runtime.createItem(template, level, forcedTierId, context);
  }
  return legacyCreateItem(template, level, forcedTierId, context);
}

function applyAbyssEquipmentBonus(item) {
  if (!item || !item.abyssForged || item.abyssBonusApplied) return item;
  ["atk", "matk", "def", "hp"].forEach((key) => {
    const value = Number(item[key] || 0);
    if (value > 0) item[key] = Math.round(value * ABYSS_EQUIPMENT_BONUS.statMultiplier);
  });
  item.randomStats = normalizeRandomStats(item.randomStats);
  attributeKeys.forEach((key) => {
    const value = Number(item.randomStats[key] || 0);
    if (value > 0) item.randomStats[key] = Math.round(value * ABYSS_EQUIPMENT_BONUS.randomStatMultiplier);
  });
  item.abyssBonus = { ...ABYSS_EQUIPMENT_BONUS.extra, ...(item.abyssBonus || {}) };
  item.abyssAffixes = Array.isArray(item.abyssAffixes) ? item.abyssAffixes : [];
  if (!item.abyssAffixes.length) item.abyssAffixes = rollAbyssAffixes(item);
  item.abyssBonusApplied = true;
  item.sourceDifficulty = "abyss";
  item.prefix = item.prefix || "深渊";
  applyAbyssSetItemBonus(item);
  return item;
}

function applyAbyssSetItemBonus(item) {
  if (!item?.setId || !item.abyssForged || item.abyssSetBonusApplied) return item;
  ["atk", "matk", "def", "hp"].forEach((key) => {
    const value = Number(item[key] || 0);
    if (value > 0) item[key] = Math.round(value * ABYSS_SET_ITEM_BONUS.statMultiplier);
  });
  item.randomStats = normalizeRandomStats(item.randomStats);
  attributeKeys.forEach((key) => {
    const value = Number(item.randomStats[key] || 0);
    if (value > 0) item.randomStats[key] = Math.round(value * ABYSS_SET_ITEM_BONUS.randomStatMultiplier);
  });
  item.abyssBonus = { ...(item.abyssBonus || {}), ...ABYSS_SET_ITEM_BONUS.extra };
  item.abyssSetVariant = true;
  item.abyssSetBonusApplied = true;
  item.originalSetId = item.originalSetId || item.setId;
  return item;
}

function rollAbyssAffixes(item = {}) {
  if (!isAbyssEquipment(item)) return [];
  const rank = rarityRank(item.rarity);
  const count = rank >= rarityRank("mythic") ? (Math.random() < 0.45 ? 2 : 1) : rank >= rarityRank("legend") ? (Math.random() < 0.2 ? 2 : 1) : rank >= rarityRank("epic") ? (Math.random() < 0.55 ? 1 : 0) : 1;
  const pool = [...ABYSS_AFFIX_POOL];
  const result = [];
  while (result.length < count && pool.length) {
    const index = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

const CARD_SOCKET_MAX_BY_RARITY = { normal: 0, fine: 0, rare: 1, epic: 1, ancient: 2, legend: 2, darkGold: 3, mythic: 4 };
const BOSS_SOCKET_CARD_IDS = new Set(bossCardPool.map((card) => card.id));
const UNIQUE_SOCKET_CARD_IDS = new Set(bossCardPool.filter((card) => card.uniqueSocket).map((card) => card.id));

function createEquipmentCardSlots() {
  return [];
}

function normalizeCardSlots(slots) {
  if (!Array.isArray(slots)) return [];
  return slots.map((slot) => ({ cardId: slot?.cardId || null }));
}

function getMaxEquipmentCardSlots(item = {}) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getMaxEquipmentCardSlots === "function") return runtime.getMaxEquipmentCardSlots(item);
  const base = CARD_SOCKET_MAX_BY_RARITY[item.rarity || "normal"] || 0;
  return Math.min(5, base + (isAbyssEquipment(item) && base > 0 ? 1 : 0));
}

function getEquipmentCardSlotCount(item = {}) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getEquipmentCardSlotCount === "function") return runtime.getEquipmentCardSlotCount(item);
  return normalizeCardSlots(item.cardSlots).length;
}

function getSocketCard(cardId) {
  return cardPool.find((entry) => entry.id === cardId) || null;
}

function isBossSocketCard(card = {}) {
  return getCardType(card) === "boss" || BOSS_SOCKET_CARD_IDS.has(card.id);
}

function getSocketedCardIds(item = {}) {
  return normalizeCardSlots(item.cardSlots).map((slot) => slot.cardId).filter(Boolean);
}

function getEquippedSocketedCardIds() {
  return Object.values(state.equipped || {})
    .map((id) => state.inventory.find((item) => item.id === id))
    .filter(Boolean)
    .flatMap(getSocketedCardIds);
}

function getSocketCardEffects(card = {}) {
  const effects = {};
  const directStats = [
    "atk", "matk", "def", "hp", "str", "agi", "vit", "int", "dex", "luk",
    "atkPct", "matkPct", "hpPct", "defPct", "attackSpeedPct", "critRatePct",
    "critDamageBonus", "skillDamageBonus", "monsterDamageBonus", "bossDamageBonus",
    "abyssDamageBonus", "abyssBossDamageBonus", "abyssDamageReduction", "damageReductionPct",
    "finalDamageBonus", "physicalFinalDamageBonus", "eliteDamageBonus", "rareDropBonus", "lifeSteal", "hitRate",
    "dodgeRatePct", "baseExpBonus", "jobExpBonus", "equipmentDrop", "cardDrop",
    "materialQuantityBonus", "mythicWeightBonus", "mythicEssenceDropBonus", "drop", "gold",
    "crit", "aspd", "aspdPct", "normalAttackDamageBonus", "higherLevelDamageBonus",
    "offlineEfficiencyBonus", "magicDamageReduction", "skillDamageReduction", "skillCooldownPenalty",
    "skillHitHealPct", "splashTargets", "splashDamagePct", "fireBurstChance", "fireBurstAtkPct",
    "meteorCounterChance", "meteorCounterMatkPct", "statusResist", "patrolEfficiency",
  ];
  directStats.forEach((stat) => {
    if (Number(card[stat] || 0)) effects[stat] = (effects[stat] || 0) + Number(card[stat] || 0);
  });
  if (Number(card.dps || 0)) effects.monsterDamageBonus = (effects.monsterDamageBonus || 0) + Number(card.dps || 0);
  if (Number(card.aspdPct || 0)) effects.attackSpeedPct = (effects.attackSpeedPct || 0) + Number(card.aspdPct || 0);
  return effects;
}

function computeCardSocketBonuses(item = {}) {
  return normalizeCardSlots(item.cardSlots).reduce((sum, slot) => {
    const card = getSocketCard(slot.cardId);
    if (!card) return sum;
    Object.entries(getSocketCardEffects(card)).forEach(([stat, value]) => {
      sum[stat] = (sum[stat] || 0) + Number(value || 0);
    });
    return sum;
  }, {});
}

function getCardSocketCost(item = {}) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getCardSocketCost === "function") return runtime.getCardSocketCost(item);
  const current = getEquipmentCardSlotCount(item);
  const next = current + 1;
  const rarity = item.rarity || "normal";
  if (getMaxEquipmentCardSlots(item) <= current) return null;
  if (["rare", "epic"].includes(rarity)) return { materials: { socketStone: next }, gold: 120000 * next };
  if (["ancient", "legend"].includes(rarity)) return { materials: { advancedSocketStone: next, crystal: 4 * next }, gold: 450000 * next };
  if (["darkGold", "mythic"].includes(rarity)) return { materials: { mythicSocketStone: next, ancientCore: 2 * next }, gold: 1200000 * next };
  return null;
}

function getCardSocketChance(item = {}) {
  const next = getEquipmentCardSlotCount(item) + 1;
  if (next <= 1) return 0.8;
  if (next === 2) return 0.5;
  return 0.25;
}

function canAffordSocketCost(cost) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.canAffordSocketCost === "function") return runtime.canAffordSocketCost(cost);
  if (!cost) return false;
  return state.gold >= Number(cost.gold || 0) && hasMaterials(cost.materials || {});
}

function cardSocketCostText(cost) {
  if (!cost) return "不可打孔";
  return `${materialText(cost.materials || {})}${cost.gold ? ` · 金币 ${formatNumber(cost.gold)}` : ""}`;
}

function punchCardSlot(itemId) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item) return showToast("装备不存在");
  item.cardSlots = normalizeCardSlots(item.cardSlots);
  const maxSlots = getMaxEquipmentCardSlots(item);
  if (item.cardSlots.length >= maxSlots) return showToast("该装备卡槽已达上限");
  const cost = getCardSocketCost(item);
  if (!cost || !canAffordSocketCost(cost)) return showToast("打孔材料或金币不足");
  state.gold = Math.max(0, state.gold - Number(cost.gold || 0));
  consumeMaterials(cost.materials || {});
  const beforeSlots = item.cardSlots.length;
  const chance = getCardSocketChance(item);
  const success = Math.random() < chance;
  if (success) item.cardSlots.push({ cardId: null });
  addLog(`${getDisplayItemName(item)} 打孔${success ? "成功" : "失败"}，当前卡槽 ${item.cardSlots.length}/${maxSlots}。`);
  showRefineResultModal({
    type: "socket",
    success,
    itemId: item.id,
    itemName: getDisplayItemName(item),
    beforeSlots,
    afterSlots: item.cardSlots.length,
    maxSlots,
    chance,
    cost,
  });
  showToast(success ? "打孔成功" : "打孔失败");
  renderAll();
  save();
}

function canSocketCard(item, slotIndex, cardId) {
  const slots = normalizeCardSlots(item.cardSlots);
  const card = getSocketCard(cardId);
  if (!item || !card || !slots[slotIndex] || slots[slotIndex].cardId) return { ok: false, reason: "卡槽或卡片无效" };
  if ((state.cards[cardId] || 0) <= 0) return { ok: false, reason: "卡片数量不足" };
  if (slots.some((slot) => slot.cardId === cardId)) return { ok: false, reason: "同一件装备不能重复镶嵌同名卡片" };
  if (isBossSocketCard(card) && slots.some((slot) => isBossSocketCard(getSocketCard(slot.cardId)))) return { ok: false, reason: "同一件装备最多镶嵌 1 张 Boss 卡" };
  const equippedElsewhereHasUnique = Object.values(state.equipped || {})
    .map((id) => state.inventory.find((entry) => entry.id === id))
    .filter((entry) => entry && entry.id !== item.id)
    .some((entry) => getSocketedCardIds(entry).includes(cardId));
  if (UNIQUE_SOCKET_CARD_IDS.has(cardId) && equippedElsewhereHasUnique) {
    return { ok: false, reason: "该强力卡片全身只能生效 1 张" };
  }
  return { ok: true, reason: "" };
}

function socketCardToEquipment(itemId, slotIndex, cardId) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  const index = Number(slotIndex);
  const check = canSocketCard(item, index, cardId);
  if (!check.ok) return showToast(check.reason);
  item.cardSlots = normalizeCardSlots(item.cardSlots);
  item.cardSlots[index].cardId = cardId;
  state.cards[cardId] = Math.max(0, (state.cards[cardId] || 0) - 1);
  addLog(`${getDisplayItemName(item)} 镶嵌 ${cardName(cardId)}。`);
  showToast("卡片镶嵌成功");
  renderAll();
  save();
}

function removeSocketedCard(itemId, slotIndex) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  const index = Number(slotIndex);
  if (!item) return showToast("装备不存在");
  item.cardSlots = normalizeCardSlots(item.cardSlots);
  const slot = item.cardSlots[index];
  if (!slot?.cardId) return showToast("该卡槽没有卡片");
  if ((state.materials.cardRemover || 0) < 1) return showToast("卡片拆除器不足");
  const cardId = slot.cardId;
  state.materials.cardRemover = Math.max(0, (state.materials.cardRemover || 0) - 1);
  slot.cardId = null;
  state.cards[cardId] = (state.cards[cardId] || 0) + 1;
  addLog(`${getDisplayItemName(item)} 拆除 ${cardName(cardId)}，卡片已返还。`);
  showToast("卡片已拆除");
  renderAll();
  save();
}

function canEquipSocketCards(item = {}) {
  const uniqueCards = getSocketedCardIds(item).filter((cardId) => UNIQUE_SOCKET_CARD_IDS.has(cardId));
  if (!uniqueCards.length) return { ok: true, reason: "" };
  const otherEquippedIds = Object.entries(state.equipped || {})
    .filter(([, equippedId]) => equippedId && equippedId !== item.id)
    .map(([, equippedId]) => equippedId);
  const otherCards = otherEquippedIds
    .map((id) => state.inventory.find((entry) => entry.id === id))
    .filter(Boolean)
    .flatMap(getSocketedCardIds);
  const duplicate = uniqueCards.find((cardId) => otherCards.includes(cardId));
  if (duplicate) return { ok: false, reason: `${cardName(duplicate)} 全身只能生效 1 张` };
  return { ok: true, reason: "" };
}

function isAbyssEquipment(item = {}) {
  return Boolean(item.abyssForged || item.sourceDifficulty === "abyss" || item.prefix === "深渊");
}

function legacyGetDisplayItemName(item = {}) {
  const baseName = item.name || item.templateName || "未知装备";
  if (isAbyssEquipment(item) && !baseName.startsWith("深渊 ")) return `深渊 ${baseName}`;
  return baseName;
}

function getDisplayItemName(item = {}) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getEquipmentDisplayName === "function") {
    return runtime.getEquipmentDisplayName(item);
  }
  return legacyGetDisplayItemName(item);
}

function canCreateMythic(context = {}) {
  return context.allowMythic === true || context.difficulty === "abyss" || state?.currentDifficulty === "abyss";
}

function legacyNormalizeItem(item) {
  const fallbackPower = item.power || 0;
  const normalized = {
    id: item.id || `legacy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    instanceId: item.instanceId || item.id || "",
    templateId: item.templateId || "",
    name: item.name || "旧式装备",
    slot: item.slot || "trinket",
    equipSlot: item.equipSlot || normalizeEquipmentSlot(item.slot || "trinket"),
    weaponType: item.weaponType || "",
    armorType: item.armorType || "",
    subType: item.subType || inferEquipmentSubType(item),
    equipType: item.equipType || item.weaponType || item.armorType || item.slot || "trinket",
    source: item.source || "legacy",
    image: item.image || equipmentImagePath(item.templateId || item.id || item.name || "equipment"),
    requiredLevel: item.requiredLevel || 1,
    requiredJob: Array.isArray(item.requiredJob) ? item.requiredJob : [],
    allowedJobs: Array.isArray(item.allowedJobs) ? item.allowedJobs : [],
    setId: item.setId || "",
    setName: item.setName || "",
    baseStats: item.baseStats || {},
    description: item.description || "",
    rarity: item.rarity || "normal",
    tier: item.tier || item.rarity || "normal",
    itemTier: inferItemTier(item).id,
    dropMapId: item.dropMapId || "",
    dropLevel: item.dropLevel || item.level || 1,
    sourceDifficulty: item.sourceDifficulty || "",
    abyssForged: Boolean(item.abyssForged || item.sourceDifficulty === "abyss" || item.prefix === "深渊"),
    prefix: item.prefix || (item.sourceDifficulty === "abyss" || item.abyssForged ? "深渊" : ""),
    abyssBonus: item.abyssBonus || {},
    abyssAffixes: Array.isArray(item.abyssAffixes) ? item.abyssAffixes : [],
    abyssBonusApplied: Boolean(item.abyssBonusApplied),
    abyssSetVariant: Boolean(item.abyssSetVariant || ((item.abyssForged || item.sourceDifficulty === "abyss") && item.setId)),
    abyssSetBonusApplied: Boolean(item.abyssSetBonusApplied),
    originalSetId: item.originalSetId || item.setId || "",
    cardSlots: normalizeCardSlots(item.cardSlots),
    templateBaseStats: item.templateBaseStats || {},
    quality: item.quality || 100,
    refine: item.refine || 0,
    refineFailCount: Math.max(0, Math.floor(item.refineFailCount || 0)),
    empower: item.empower || 0,
    locked: Boolean(item.locked),
    affixes: Array.isArray(item.affixes) ? item.affixes : [],
    affixDetails: Array.isArray(item.affixDetails) ? item.affixDetails : [],
    mechanicAffixes: Array.isArray(item.mechanicAffixes) ? item.mechanicAffixes : [],
    ranges: item.ranges || inferItemRanges(item),
    randomStats: normalizeRandomStats(item.randomStats),
    level: item.level || 1,
    atk: item.atk ?? Math.round(fallbackPower * 0.6),
    matk: item.matk ?? Math.round(fallbackPower * 0.35),
    def: item.def ?? Math.round(fallbackPower * 0.25),
    hp: item.hp ?? 0,
    aspd: item.aspd ?? 0,
    luck: item.luck ?? 0,
    str: item.str ?? 0,
    agi: item.agi ?? 0,
    vit: item.vit ?? 0,
    int: item.int ?? 0,
    dex: item.dex ?? 0,
    luk: item.luk ?? 0,
    gold: item.gold ?? 0,
    crit: item.crit ?? 0,
    drop: item.drop ?? 0,
    hpRegen: item.hpRegen ?? 0,
    dodgeRate: item.dodgeRate ?? 0,
    atkPct: item.atkPct ?? 0,
    matkPct: item.matkPct ?? 0,
    hpPct: item.hpPct ?? 0,
    defPct: item.defPct ?? 0,
    attackSpeedPct: item.attackSpeedPct ?? 0,
    critRatePct: item.critRatePct ?? 0,
    critDamageBonus: item.critDamageBonus ?? 0,
    skillDamageBonus: item.skillDamageBonus ?? 0,
    monsterDamageBonus: item.monsterDamageBonus ?? 0,
    bossDamageBonus: item.bossDamageBonus ?? 0,
    finalDamageBonus: item.finalDamageBonus ?? 0,
    eliteDamageBonus: item.eliteDamageBonus ?? 0,
    rareDropBonus: item.rareDropBonus ?? 0,
    damageReductionPct: item.damageReductionPct ?? 0,
    dodgeRatePct: item.dodgeRatePct ?? 0,
    hpRegenPct: item.hpRegenPct ?? 0,
    ignoreDefense: item.ignoreDefense ?? 0,
    baseExpBonus: item.baseExpBonus ?? 0,
    jobExpBonus: item.jobExpBonus ?? 0,
    equipmentDrop: item.equipmentDrop ?? 0,
    cardDrop: item.cardDrop ?? 0,
    materialQuantityBonus: item.materialQuantityBonus ?? 0,
    powerPct: item.powerPct ?? 0,
    combatPaceBonus: item.combatPaceBonus ?? 0,
    patrolEfficiency: item.patrolEfficiency ?? 0,
    hitRate: item.hitRate ?? 0,
    statusResist: item.statusResist ?? 0,
    echoChance: item.echoChance ?? 0,
    mutationMaterialDoubleChance: item.mutationMaterialDoubleChance ?? 0,
    thornVitMultiplier: item.thornVitMultiplier ?? 0,
    enhanceLevel: item.enhanceLevel || 0,
    specialPassives: Array.isArray(item.specialPassives) ? item.specialPassives : [],
  };
  applyAbyssEquipmentBonus(normalized);
  applyAbyssSetItemBonus(normalized);
  return normalized;
}

function normalizeItem(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.normalizeItem === "function") {
    return runtime.normalizeItem(item);
  }
  return legacyNormalizeItem(item);
}

function defaultRandomStats() {
  return Object.fromEntries(attributeKeys.map((stat) => [stat, 0]));
}

function normalizeRandomStats(stats = {}) {
  return { ...defaultRandomStats(), ...(stats || {}) };
}

function shouldRollRandomStats(template) {
  return template.source === "monster_drop";
}

function rollRandomStats(rarity) {
  const range = randomStatRanges[rarity] || randomStatRanges.normal;
  return Object.fromEntries(attributeKeys.map((stat) => [stat, randomInt(range[0], range[1])]));
}

function rollEquipmentTier() {
  const total = equipmentTiers.reduce((sum, tier) => sum + tier.weight, 0);
  let roll = Math.random() * total;
  for (const tier of equipmentTiers) {
    roll -= tier.weight;
    if (roll <= 0) return tier;
  }
  return equipmentTiers[0];
}

function addBaseRanges(item, template, tier, level, itemTier, levelGrowth) {
  const addRange = (stat, value, transform = (v) => Math.round(v)) => {
    if (!value) return;
    const key = canonicalItemStat(stat);
    const growth = 1 + level * levelGrowth;
    const min = transform(value * tier.scale * itemTier.scale * tier.rolls[0] * growth);
    const max = transform(value * tier.scale * itemTier.scale * tier.rolls[1] * growth);
    item.ranges[key] = mergeRange(item.ranges[key], [min, max]);
  };
  addRange("atk", template.atk);
  addRange("matk", template.matk);
  addRange("def", template.def);
  addRange("hp", template.hp);
  attributeKeys.forEach((stat) => addRange(stat, template[stat]));
  if (template.aspd) {
    const value = template.aspd * (1 + level * 0.018);
    item.ranges.aspd = mergeRange(item.ranges.aspd, [Number(value.toFixed(3)), Number(value.toFixed(3))]);
  }
  addRange("luck", template.luck);
  if (template.gold) item.ranges.gold = mergeRange(item.ranges.gold, [template.gold, Number((template.gold * (1 + level * 0.025)).toFixed(3))]);
  if (template.crit) item.ranges.crit = mergeRange(item.ranges.crit, [template.crit, Number((template.crit * (1 + level * 0.018)).toFixed(3))]);
  if (template.drop) item.ranges.drop = mergeRange(item.ranges.drop, [template.drop, Number((template.drop * (1 + level * 0.018)).toFixed(3))]);
}

function applyTierExtra(item, tier, level, itemTier = getItemTierForLevel(level)) {
  Object.entries(tier.extra).forEach(([stat, range]) => {
    const key = canonicalItemStat(stat);
    addItemStat(item, key, rollStat(range, level, itemTier));
    item.ranges[key] = mergeRange(item.ranges[key], [rollStatMin(range, level, itemTier), rollStatMax(range, level, itemTier)]);
  });
}

function applyRandomAffixes(item, tier, level, itemTier = getItemTierForLevel(level)) {
  const slot = equipmentSlot(item);
  const pool = SLOT_AFFIX_POOLS[slot] || SLOT_AFFIX_POOLS.trinket;
  let mechanicUsed = false;
  for (let i = 0; i < tier.affixes; i += 1) {
    const type = rollAffixType(tier.id, mechanicUsed);
    if (type === "mechanic") {
      const id = randomPick(pool.mechanic || []);
      const mechanic = id ? MECHANIC_AFFIXES[id] : null;
      if (!mechanic) continue;
      mechanicUsed = true;
      item.mechanicAffixes.push(id);
      item.affixes.push(`【${mechanic.label}】${mechanic.description}`);
      item.affixDetails.push({ type: "mechanic", id, label: mechanic.label, description: mechanic.description });
      continue;
    }
    const stat = randomPick(pool[type] || pool.flat || []);
    const affix = AFFIX_TIERS[type]?.[stat];
    if (!affix) continue;
    const key = canonicalItemStat(stat);
    const value = rollAffixStat(affix, level, itemTier, tier, type);
    addItemStat(item, key, value, affix.cap);
    item.ranges[key] = mergeRange(item.ranges[key], [rollAffixStatMin(affix, level, itemTier, tier, type), rollAffixStatMax(affix, level, itemTier, tier, type)]);
    item.affixes.push(`${type === "percent" ? "[百分比]" : "[固定]"}${affix.label}${formatStatValue(key, value)}`);
    item.affixDetails.push({ type, stat: key, label: affix.label, value });
  }
}

function rollAffixType(rarity, mechanicUsed) {
  const rank = rarityRank(rarity);
  if (!mechanicUsed && rank >= rarityRank("legend")) {
    const chance = rarity === "darkGold" ? 0.06 : 0.02;
    if (Math.random() < chance) return "mechanic";
  }
  if (rank <= rarityRank("fine")) return "flat";
  if (rank === rarityRank("rare")) return Math.random() < 0.08 ? "percent" : "flat";
  if (rank === rarityRank("epic")) return Math.random() < 0.45 ? "percent" : "flat";
  if (rank === rarityRank("ancient")) return Math.random() < 0.65 ? "percent" : "flat";
  return Math.random() < 0.78 ? "percent" : "flat";
}

function randomPick(items) {
  return items?.length ? items[Math.floor(Math.random() * items.length)] : null;
}

function rollAffixStat(affix, level, itemTier, tier, type) {
  const min = rollAffixStatMin(affix, level, itemTier, tier, type);
  const max = rollAffixStatMax(affix, level, itemTier, tier, type);
  const value = randomFloat(min, max);
  return max < 1 ? Number(value.toFixed(3)) : Math.round(value);
}

function rollAffixStatMin(affix, level, itemTier, tier, type) {
  return scaleAffixValue(affix.range[0], level, itemTier, tier, type);
}

function rollAffixStatMax(affix, level, itemTier, tier, type) {
  return scaleAffixValue(affix.range[1], level, itemTier, tier, type);
}

function scaleAffixValue(value, level, itemTier, tier, type) {
  const rarityScale = Math.max(0.9, Math.sqrt(tier.scale));
  const tierScale = type === "percent" ? Math.sqrt(itemTier.scale) : itemTier.scale;
  const growth = type === "percent" ? 1 + level * 0.006 : 1 + level * 0.025;
  const result = value * rarityScale * tierScale * growth;
  return value < 1 ? Number(result.toFixed(3)) : Math.round(result);
}

function rollStat(range, level, itemTier = getItemTierForLevel(level)) {
  const value = randomFloat(range[0], range[1]) * itemTier.scale * (1 + level * 0.025);
  return range[1] < 1 ? Number(value.toFixed(3)) : Math.round(value);
}

function rollStatMin(range, level, itemTier = getItemTierForLevel(level)) {
  const value = range[0] * itemTier.scale * (1 + level * 0.025);
  return range[1] < 1 ? Number(value.toFixed(3)) : Math.round(value);
}

function rollStatMax(range, level, itemTier = getItemTierForLevel(level)) {
  const value = range[1] * itemTier.scale * (1 + level * 0.025);
  return range[1] < 1 ? Number(value.toFixed(3)) : Math.round(value);
}

function addItemStat(item, stat, value, cap = null) {
  const key = canonicalItemStat(stat);
  const next = (item[key] || 0) + value;
  const capped = cap == null ? next : Math.min(cap, next);
  item[key] = Number(capped.toFixed(statIsPercent(key) ? 3 : 0));
}

function canonicalItemStat(stat) {
  return stat === "luck" ? "luk" : stat;
}

function mergeRange(current, next) {
  if (!current) return next;
  return [current[0] + next[0], current[1] + next[1]];
}

function inferItemRanges(item) {
  const ranges = {};
  ["atk", "matk", "def", "hp", "hpRegen", "aspd", "dodgeRate", "str", "agi", "vit", "int", "dex", "luk", "crit", "drop", "gold", "atkPct", "matkPct", "hpPct", "defPct", "attackSpeedPct", "critRatePct", "critDamageBonus", "skillDamageBonus", "monsterDamageBonus", "bossDamageBonus", "damageReductionPct", "dodgeRatePct", "hpRegenPct", "ignoreDefense", "baseExpBonus", "jobExpBonus", "equipmentDrop", "cardDrop", "materialQuantityBonus"].forEach((stat) => {
    const value = getItemStatValue(item, stat);
    if (!value) return;
    const min = statIsPercent(stat) ? Number((value * 0.9).toFixed(3)) : Math.floor(value * 0.9);
    const max = statIsPercent(stat) ? Number((value * 1.1).toFixed(3)) : Math.ceil(value * 1.1);
    ranges[stat] = [min, max];
  });
  return ranges;
}

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function gainExp(baseAmount, jobAmount) {
  state.hero.baseExp += baseAmount;
  state.hero.jobExp += jobAmount;

  while (state.hero.baseExp >= baseExpCost() && state.hero.baseLevel < maxBaseLevel()) {
    state.hero.baseExp -= baseExpCost();
    state.hero.baseLevel += 1;
    state.gold += Math.round(30 + state.hero.baseLevel * 8);
    addLog(`BASE 等级提升到 ${state.hero.baseLevel}。`);
  }
  if (state.hero.baseLevel >= maxBaseLevel()) {
    state.hero.baseExp = Math.min(state.hero.baseExp, baseExpCost() - 1);
  }

  while (state.hero.jobExp >= jobExpCost()) {
    state.hero.jobExp -= jobExpCost();
    state.hero.jobLevel += 1;
    addLog(`JOB 等级提升到 ${state.hero.jobLevel}。`);
    if (state.hero.jobId === "novice" && state.hero.jobLevel === 10) {
      addLog("JOB 10 已达成，可前往城镇转职学院。");
    }
  }
}

function maxBaseLevel() {
  return 99 + (state.hero.rebirths || 0) * 30;
}

function trainBase() {
  if (state.hero.baseLevel >= maxBaseLevel()) {
    showToast("已达到当前 BASE 上限，可以转生突破");
    return;
  }
  const cost = heroTrainCost();
  if (state.gold < cost) {
    showToast("金币不足");
    return;
  }
  state.gold -= cost;
  state.hero.baseLevel += 1;
  const trainedStat = grantTrainingPct();
  addLog(`完成基础训练，BASE 提升到 ${state.hero.baseLevel}，${trainedStat.toUpperCase()} 训练附加提高。`);
  renderAll();
  save();
}

function batchTrainBase() {
  if (state.hero.baseLevel >= maxBaseLevel()) {
    showToast("已达到当前 BASE 上限，可以转生突破");
    return;
  }
  const startLevel = state.hero.baseLevel;
  let trained = 0;
  let totalCost = 0;
  let skipNoGold = false;
  while (state.hero.baseLevel < maxBaseLevel()) {
    const cost = heroTrainCost();
    if (state.gold < cost) {
      skipNoGold = true;
      break;
    }
    state.gold -= cost;
    state.hero.baseLevel += 1;
    grantTrainingPct();
    trained += 1;
    totalCost += cost;
  }
  if (trained === 0) {
    showToast(skipNoGold ? "金币不足，无法训练" : "已达到当前 BASE 上限，可以转生突破");
    return;
  }
  const skippedText = state.hero.baseLevel >= maxBaseLevel() ? "" : skipNoGold ? "，金币不足停止" : "";
  addLog(`批量训练完成：成功提升 ${trained} 级（${startLevel} → ${state.hero.baseLevel}），消耗金币 ${formatNumber(totalCost)}${skippedText}。`);
  showToast(`批量训练完成：+${trained} 级，消耗 ${formatNumber(totalCost)} 金币`);
  renderAll();
  save();
}

function grantTrainingPct() {
  state.hero.trainingPct = { ...defaultTrainingPct(), ...(state.hero.trainingPct || {}) };
  const stat = attributeKeys[(state.hero.baseLevel + state.hero.jobLevel + (state.hero.rebirths || 0)) % attributeKeys.length];
  state.hero.trainingPct[stat] = Number(((state.hero.trainingPct[stat] || 0) + 0.01).toFixed(3));
  return stat;
}

function changeJob(jobId) {
  const job = jobTemplates[jobId];
  if (!job) return;
  const isFirst = state.hero.jobId === "novice" && firstJobs.includes(jobId);
  const nextJobId = getNextJobId();
  const isNext = nextJobId === jobId;
  const requiredJobLevel = isFirst ? 10 : 50;
  if ((isFirst || isNext) && state.hero.jobLevel < requiredJobLevel) {
    showToast(`需要 JOB ${requiredJobLevel}`);
    return;
  }
  if (!isFirst && !isNext) {
    showToast("当前职业无法转职为该职业");
    return;
  }
  state.hero.jobId = jobId;
  state.hero.jobLevel = 1;
  state.hero.jobExp = 0;
  state.hero.jobHistory = [...new Set([...(state.hero.jobHistory || ["novice"]), jobId])];
  state.formation.front = "main";
  addLog(`在转职学院完成登记，转职为 ${job.name}。`);
  activePage = "heroes";
  renderAll();
  save();
}

function getNextJobId() {
  const current = state.hero.jobId;
  if (current === "novice") return null;
  if (firstJobs.includes(current)) {
    return state.hero.rebirths > 0 ? advancedSecondJobMap[current] : secondJobMap[current];
  }
  return thirdJobMap[current] || null;
}

function rebirthHero() {
  if (state.hero.baseLevel < maxBaseLevel()) {
    showToast(`BASE ${maxBaseLevel()} 后可转生`);
    return;
  }
  state.hero.rebirths = (state.hero.rebirths || 0) + 1;
  state.rebirthPrestige = normalizeRebirthPrestige(state.rebirthPrestige, state.hero.rebirths);
  state.rebirthPrestige.totalRebirths = state.hero.rebirths;
  state.rebirthPrestige.level = state.hero.rebirths;
  state.rebirthPrestige.exp += 100 + state.hero.rebirths * 25;
  state.hero.baseLevel = 1;
  state.hero.baseExp = 0;
  state.hero.jobId = "novice";
  state.hero.jobLevel = 1;
  state.hero.jobExp = 0;
  state.hero.jobHistory = ["novice"];
  Object.keys(state.hero.attributes).forEach((stat) => {
    state.hero.attributes[stat] += 2 + state.hero.rebirths;
  });
  state.formation.front = "main";
  addLog(`完成第 ${state.hero.rebirths} 次转生，转生声望提升至 Lv.${state.rebirthPrestige.level}。`);
  activePage = "heroes";
  spawnEnemy(false);
  renderAll();
  save();
}

function renameHero() {
  if (state.hero.renameUsed) {
    showToast("你已经使用过改名机会");
    return;
  }
  const nextName = window.prompt("请输入新的角色名（2-12 个字符）", state.hero.name || "");
  if (nextName === null) return;
  const name = nextName.trim();
  if (name === state.hero.name) {
    showToast("新名字不能和当前名字相同");
    return;
  }
  if (name.length < 2 || name.length > 12) {
    showToast("名字长度需要 2-12 个字符");
    return;
  }
  if (!/^[\u4e00-\u9fa5A-Za-z0-9_\-\s]+$/.test(name)) {
    showToast("名字不能包含特殊字符");
    return;
  }
  state.hero.name = name;
  state.hero.renameUsed = true;
  addLog(`角色改名为 ${name}。`);
  renderAll();
  save();
}

function equipItem(id) {
  const item = state.inventory.find((entry) => entry.id === id);
  if (!item) return;
  const socketCheck = canEquipSocketCards(item);
  if (!socketCheck.ok) {
    showToast(socketCheck.reason);
    return;
  }
  state.equipped[equipmentSlot(item)] = item.id;
  addLog(`装备 ${getDisplayItemName(item)}。`);
  renderAll();
}

function salvageItem(id, options = {}) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.salvageItem === "function") return runtime.salvageItem(id, options);
  const item = state.inventory.find((entry) => entry.id === id);
  if (!item) return { ok: false };
  if (item.locked) {
    if (!options.silent) showToast("已锁定的装备不能分解");
    return { ok: false };
  }
  if (Object.values(state.equipped).includes(id)) {
    if (!options.silent) showToast("已装备的物品不能分解");
    return { ok: false };
  }
  const rewards = getSalvageRewards(item);
  addMaterials(rewards);
  state.inventory = state.inventory.filter((entry) => entry.id !== id);
  addLog(`分解 ${getDisplayItemName(item)}，获得 ${materialText(rewards)}。`);
  if (!options.silent) showSalvageResultModal("分解完成", 1, rewards);
  renderAll();
  save();
  return { ok: true, item, rewards };
}

function getSalvageRewards(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getSalvageRewards === "function") return runtime.getSalvageRewards(item);
  const tier = item.tier || item.rarity || "normal";
  const table = salvageRewards[tier] || salvageRewards.normal;
  const rewards = {};
  Object.entries(table).forEach(([material, range]) => {
    rewards[material] = randomInt(range[0], range[1]) + Math.floor((item.level || 1) / 12);
  });
  if (isAbyssEquipment(item)) {
    const rank = Math.max(0, rarityRank(item.rarity));
    rewards.abyssShard = (rewards.abyssShard || 0) + 2 + Math.floor((item.level || 1) / 20) + rank;
    if (rank >= rarityRank("epic")) rewards.abyssCore = (rewards.abyssCore || 0) + (rank >= rarityRank("mythic") ? 3 : rank >= rarityRank("darkGold") ? 2 : 1);
  }
  return rewards;
}

function salvageAllUnequipped() {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.salvageAllUnequipped === "function") return runtime.salvageAllUnequipped();
  const equippedIds = new Set(Object.values(state.equipped).filter(Boolean));
  const targets = state.inventory.filter((item) => !equippedIds.has(item.id) && !item.locked);
  if (!targets.length) {
    showToast("没有可分解的未穿戴装备");
    return;
  }
  const totals = {};
  targets.forEach((item) => {
    const rewards = getSalvageRewards(item);
    Object.entries(rewards).forEach(([material, amount]) => {
      totals[material] = (totals[material] || 0) + amount;
      state.materials[material] = (state.materials[material] || 0) + amount;
    });
  });
  state.inventory = state.inventory.filter((item) => equippedIds.has(item.id) || item.locked);
  addLog(`批量分解 ${targets.length} 件未穿戴装备，获得 ${materialText(totals)}。`);
  showSalvageResultModal("批量分解完成", targets.length, totals);
  renderAll();
  save();
}

function showSalvageResultModal(title, count, rewards = {}) {
  const lines = Object.entries(rewards)
    .filter(([, amount]) => Number(amount || 0) > 0)
    .map(([material, amount]) => `- ${materialNames[material] || material} x${formatNumber(amount)}`);
  const body = lines.length ? lines.join("\n") : "没有获得材料";
  const countLine = count > 1 ? `\n共分解装备：${formatNumber(count)} 件\n` : "";
  window.alert(`${title}${countLine}\n获得材料：\n${body}`);
}

function toggleItemLock(id) {
  const item = state.inventory.find((entry) => entry.id === id);
  if (!item) return;
  item.locked = !item.locked;
  showToast(item.locked ? "装备已锁定" : "装备已解锁");
  renderEquipment();
  save();
}

function empowerItem(id) {
  const item = state.inventory.find((entry) => entry.id === id);
  if (!item) return;
  const current = item.empower || 0;
  if (current >= 10) {
    showToast("赋能已满");
    return;
  }
  const cost = getEmpowerCost(item);
  if (!hasMaterials(cost)) {
    showToast(`赋能材料不足：${materialText(cost)}`);
    return;
  }
  consumeMaterials(cost);
  item.empower = current + 1;
  addLog(`${getDisplayItemName(item)} 赋能提升到 ${item.empower} 阶。`);
  renderAll();
  save();
}

function getEmpowerCost(item) {
  const next = (item.empower || 0) + 1;
  const essenceIndex = Math.min(bossEssenceByMap.length - 1, Math.max(0, Math.floor((item.level || 1) / 7)));
  const essence = bossEssenceByMap[essenceIndex];
  const cost = { [essence]: 1 + Math.floor(next / 4) };
  if (next >= 4) cost.rune = Math.floor(next / 2);
  if (next >= 7) cost.ancientCore = 1 + Math.floor((next - 7) / 2);
  return cost;
}

function refineItem(id) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.refineItem === "function") return runtime.refineItem(id);
  const item = state.inventory.find((entry) => entry.id === id);
  if (!item) return;
  const current = item.refine || 0;
  if (current >= 15) {
    showToast("已达到 15 星");
    return;
  }
  const cost = getRefineCost(item);
  if (!hasMaterials(cost)) {
    showToast(`材料不足：${materialText(cost)}`);
    return;
  }
  const pityBonus = (item.refineFailCount || 0) * 0.015;
  const beforeStats = snapshotRefineStats(item);
  consumeMaterials(cost);
  const chance = getRefineChance(current + 1, item);
  if (Math.random() < chance) {
    item.refine = current + 1;
    item.refineFailCount = 0;
    runtimeSessionStats.refineSuccessCount += 1;
    updateDailyGoalProgress("daily_refine", 1);
    const afterStats = snapshotRefineStats(item);
    const deltaStats = diffRefineStats(beforeStats, afterStats);
    addLog(`${getDisplayItemName(item)} 星炼成功，达到 ${item.refine} 星，保底已重置。`);
    showRefineResultModal({
      itemId: item.id,
      success: true,
      itemName: getDisplayItemName(item),
      beforeLevel: current,
      afterLevel: item.refine,
      chance,
      pityBonus,
      cost,
      afterStats: renderRefineStatDelta(deltaStats) || "属性已提升",
      unlockedStar15Bonus: item.refine >= 15 && Object.keys(star15Bonus(item)).length > 0,
    });
    if (item.refine >= 10) updateAchievementProgress("refine10_1", 1, { absolute: true });
  } else {
    item.refineFailCount = (item.refineFailCount || 0) + 1;
    runtimeSessionStats.refineFailCount += 1;
    updateDailyGoalProgress("daily_refine", 1);
    addLog(`${getDisplayItemName(item)} 星炼失败，星级保持 ${current} 星，保底成功率提升 +1.5%。`);
    showRefineResultModal({
      itemId: item.id,
      success: false,
      itemName: getDisplayItemName(item),
      beforeLevel: current,
      afterLevel: current,
      chance,
      pityBonus,
      nextPityBonus: (item.refineFailCount || 0) * 0.015,
      cost,
      unlockedStar15Bonus: false,
    });
  }
  renderAll();
  save();
}

function snapshotRefineStats(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.snapshotRefineStats === "function") return runtime.snapshotRefineStats(item);
  const stats = getEffectiveItemStats(item);
  return Object.fromEntries(
    Object.entries(stats)
      .filter(([key, value]) => key !== "luck" && Number.isFinite(Number(value)) && Number(value) !== 0)
      .map(([key, value]) => [key, Number(value || 0)]),
  );
}

function diffRefineStats(before = {}, after = {}, statIsPercentFn = statIsPercent) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.diffRefineStats === "function") return runtime.diffRefineStats(before, after);
  const diff = {};
  Object.keys(after).forEach((key) => {
    const delta = Number(((after[key] || 0) - (before[key] || 0)).toFixed(statIsPercent(key) ? 3 : 0));
    if (delta) diff[key] = delta;
  });
  return diff;
}

function renderRefineStatDelta(delta = {}) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderRefineStatDelta === "function") return runtime.renderRefineStatDelta(delta);
  return Object.entries(delta)
    .map(([stat, value]) => statLabel(stat, value))
    .filter(Boolean)
    .join(" · ");
}

function getRefineChance(nextStar, item = null) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getRefineChance === "function") return runtime.getRefineChance(nextStar, item);
  const chances = [1, 0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.35, 0.29, 0.23, 0.18, 0.14, 0.1, 0.07];
  return Math.min(0.85, (chances[nextStar - 1] || 0.05) + (item ? (item.refineFailCount || 0) * 0.015 : 0));
}

function getRefineCost(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getRefineCost === "function") return runtime.getRefineCost(item);
  const next = (item.refine || 0) + 1;
  if (next <= 3) return { dust: 2 + next };
  if (next <= 6) return { ore: 2 + next, dust: 2 };
  if (next <= 9) return { crystal: next, ore: 3 };
  if (next <= 12) return { rune: next - 5, crystal: 4 };
  return { ancientCore: next - 10, rune: 6, starShard: next >= 14 ? 1 : 0 };
}

function hasMaterials(cost) {
  return Object.entries(cost).every(([id, amount]) => !amount || (state.materials[id] || 0) >= amount);
}

function consumeMaterials(cost) {
  Object.entries(cost).forEach(([id, amount]) => {
    if (!amount) return;
    state.materials[id] = Math.max(0, (state.materials[id] || 0) - amount);
  });
}

function equipBest() {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.equipBest === "function") return runtime.equipBest();
  ["weapon", "armor", "headgear", "shoes", "trinket"].forEach((slot) => {
    const best = state.inventory
      .filter((item) => equipmentSlot(item) === slot)
      .sort((a, b) => itemScore(b) - itemScore(a))[0];
    if (best) state.equipped[slot] = best.id;
  });
  addLog("工坊已整理装备。");
  renderAll();
}

function legacyClaimOffline() {
  const pending = normalizeOfflineRewards(state.offlinePending || state.offlineRewards);
  if (!pending || (pending.seconds <= 0 && !pending.equipments.length)) {
    showToast("暂无离线收益");
    return;
  }
  state.gold += pending.gold;
  gainExp(pending.baseExp, pending.jobExp);
  let claimSkippedEquipment = 0;
  const offlineAutoSalvaged = {};
  const unclaimedEquipment = [];
  pending.equipments.forEach((item) => {
    const result = addEquipmentToInventory(item, { logDrop: false, offline: true });
    if (result.skipped) {
      claimSkippedEquipment += 1;
      unclaimedEquipment.push(item);
    }
    if (result.salvaged) {
      Object.entries(result.rewards || {}).forEach(([id, qty]) => {
        offlineAutoSalvaged[id] = (offlineAutoSalvaged[id] || 0) + qty;
      });
    }
  });
  pending.autoSalvagedMaterials = offlineAutoSalvaged;
  pending.skippedEquipment += claimSkippedEquipment;
  pending.cards.forEach((card) => {
    state.cards[card.cardId] = (state.cards[card.cardId] || 0) + (card.qty || 0);
    state.cardCodex[card.cardId] = state.cardCodex[card.cardId] || { obtained: false, obtainCount: 0, firstObtainedAt: 0 };
    state.cardCodex[card.cardId].obtained = true;
    state.cardCodex[card.cardId].obtainCount += (card.qty || 0);
    if (!state.cardCodex[card.cardId].firstObtainedAt) state.cardCodex[card.cardId].firstObtainedAt = Date.now();
  });
  pending.materials.forEach((material) => {
    state.materials[material.materialId] = (state.materials[material.materialId] || 0) + (material.qty || 0);
  });
  state.lastOfflineRewardsForView = pending;
  recordRecentLoot(pending, "离线收益");
  state.offlinePending = buildOfflineReward(0);
  if (unclaimedEquipment.length) {
    state.offlinePending.seconds = 1;
    state.offlinePending.equipments = unclaimedEquipment;
    state.offlinePending.skippedEquipment = unclaimedEquipment.length;
  }
  state.offlineRewards = state.offlinePending;
  closeOfflineRewardModal();
  showToast("离线收益已领取");
  updateDailyGoalProgress("daily_loot", 1);
  renderAll();
  save();
}

function claimOffline() {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.claimOfflineRewards === "function") {
    return runtime.claimOfflineRewards();
  }
  return legacyClaimOffline();
}

function legacyGetPendingOfflineRewards() {
  return normalizeOfflineRewards(state.offlinePending || state.offlineRewards);
}

function legacyHasPendingOfflineRewards() {
  const pending = legacyGetPendingOfflineRewards();
  return Boolean(pending && (
    pending.seconds > 0 ||
    pending.gold > 0 ||
    pending.baseExp > 0 ||
    pending.jobExp > 0 ||
    pending.equipments.length ||
    pending.cards.length ||
    pending.materials.length ||
    offlineObjectTotal(pending.autoSalvagedMaterials) > 0
  ));
}

function legacyGetLootRewardsForView() {
  return legacyHasPendingOfflineRewards() ? legacyGetPendingOfflineRewards() : getLatestRecentLootRewards();
}

function getPendingOfflineRewards() {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.getPendingOfflineRewards === "function") {
    return runtime.getPendingOfflineRewards();
  }
  return legacyGetPendingOfflineRewards();
}

function hasPendingOfflineRewards() {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.hasPendingOfflineRewards === "function") {
    return runtime.hasPendingOfflineRewards();
  }
  return legacyHasPendingOfflineRewards();
}

function getLootRewardsForView() {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.getLootRewardsForView === "function") {
    return runtime.getLootRewardsForView();
  }
  return legacyGetLootRewardsForView();
}

function openOfflineRewardModal() {
  const hasPending = hasPendingOfflineRewards();
  offlineRewardModalOpen = true;
  if (!hasPending) markLootViewed();
  renderOfflineRewardModal();
  save();
}

function closeOfflineRewardModal() {
  offlineRewardModalOpen = false;
  renderOfflineRewardModal();
}

function renderOfflineRewardModal() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineRewardModal === "function") return runtime.renderOfflineRewardModal();
  if (!els.offlineRewardModal || !els.offlineRewardBody) return;
  const visible = offlineRewardModalOpen;
  els.offlineRewardModal.classList.toggle("hidden", !visible);
  els.offlineRewardModal.setAttribute("aria-hidden", visible ? "false" : "true");
  if (!visible) {
    els.offlineRewardBody.innerHTML = "";
    return;
  }
  try {
    els.offlineRewardBody.innerHTML = renderOfflineRewardSummary(getLootRewardsForView());
  } catch (error) {
    console.error("renderOfflineRewardSummary failed", error);
    els.offlineRewardBody.innerHTML = renderLootFallback(error);
  }
}

function showRefineResultModal(result) {
  refineResultState = result || null;
  renderRefineResultModal();
}

function closeRefineResultModal() {
  refineResultState = null;
  renderRefineResultModal();
}

function canContinueRefine(item) {
  if (!item || (item.refine || 0) >= 15) return false;
  return hasMaterials(getRefineCost(item));
}

function getRefineMilestone(level) {
  if (level >= 15) return { title: "满星星炼达成", desc: "已激活 15 星部位奖励。", badge: "refine-milestone-15" };
  if (level >= 10) return { title: "星炼力量稳定成型", desc: "装备获得更高阶星炼徽标。", badge: "refine-milestone-10" };
  if (level >= 7) return { title: "星炼光辉初现", desc: "装备获得高级星炼徽标。", badge: "refine-milestone-7" };
  return null;
}

function renderRefineResultModal() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderRefineResultModal === "function") return runtime.renderRefineResultModal();
  if (!els.refineResultModal || !els.refineResultBody || !els.refineResultTitle) return;
  const visible = Boolean(refineResultState);
  els.refineResultModal.classList.toggle("hidden", !visible);
  els.refineResultModal.setAttribute("aria-hidden", visible ? "false" : "true");
  if (!visible) {
    els.refineResultBody.innerHTML = "";
    return;
  }
  const result = refineResultState;
  if (result.type === "socket") {
    els.refineResultTitle.textContent = result.success ? "打孔成功！" : "打孔失败";
    if (els.refineResultConfirm) els.refineResultConfirm.textContent = "关闭";
    if (els.refineResultContinue) {
      els.refineResultContinue.textContent = "继续打孔";
      const item = state.inventory.find((entry) => entry.id === result.itemId);
      const cost = item ? getCardSocketCost(item) : null;
      els.refineResultContinue.disabled = !item || getEquipmentCardSlotCount(item) >= getMaxEquipmentCardSlots(item) || !cost || !canAffordSocketCost(cost);
    }
    els.refineResultBody.innerHTML = `
      <div class="refine-result-card ${result.success ? "refine-result-success" : "refine-result-fail"}">
        <div class="refine-result-kicker">${result.success ? "孔位开启" : "匠火未稳"}</div>
        <strong class="refine-result-item-name">${escapeHtml(result.itemName)}</strong>
        <div class="refine-level-change">孔位 ${formatNumber(result.beforeSlots || 0)} / ${formatNumber(result.maxSlots || 0)} → ${formatNumber(result.afterSlots || 0)} / ${formatNumber(result.maxSlots || 0)}</div>
        <p class="refine-result-flavor">${result.success ? "装备结构稳定，新的卡槽已经开启。" : "打孔失败，但装备未损坏，星炼与精炼等级保持不变。"}</p>
        <div class="refine-result-grid">
          <div class="refine-result-line refine-rate-line"><span>本次成功率</span><strong>${percent(result.chance || 0)}</strong></div>
          <div class="refine-result-line refine-cost-line"><span>消耗材料</span><strong>${escapeHtml(cardSocketCostText(result.cost || {}))}</strong></div>
          <div class="refine-result-line refine-pity-line"><span>失败结果</span><strong>只消耗材料和金币，装备不损坏</strong></div>
        </div>
      </div>
    `;
    return;
  }
  const item = state.inventory.find((entry) => entry.id === result.itemId);
  const continueEnabled = canContinueRefine(item);
  const milestone = result.success ? getRefineMilestone(result.afterLevel) : null;
  els.refineResultTitle.textContent = result.success ? "星炼成功！" : "星炼失败";
  if (els.refineResultConfirm) els.refineResultConfirm.textContent = "关闭";
  if (els.refineResultContinue) {
    els.refineResultContinue.textContent = result.success ? "继续星炼" : "再次尝试";
    els.refineResultContinue.disabled = !continueEnabled;
    els.refineResultContinue.title = continueEnabled ? "" : "材料不足或已达到 15 星";
  }
  els.refineResultBody.innerHTML = `
    <div class="refine-result-card ${result.success ? "refine-result-success" : "refine-result-fail"}">
      <div class="refine-result-kicker">${result.success ? "锻造回响" : "炉火余温"}</div>
      <strong class="refine-result-item-name">${escapeHtml(result.itemName)}</strong>
      <div class="refine-level-change">${result.success ? `星炼等级 ★${result.beforeLevel} → ★${result.afterLevel}　　当前星炼：★${result.afterLevel}` : `星炼等级 ★${result.beforeLevel} 保持不变`}</div>
      <p class="refine-result-flavor">${result.success ? "火星四溅，装备的力量被重新唤醒。" : "炉火熄灭了一瞬，但下一次成功率提高了。"}</p>
      <div class="refine-result-grid">
        <div class="refine-result-line refine-rate-line"><span>本次成功率</span><strong>${Math.round((result.chance || 0) * 100)}%</strong></div>
        ${(result.pityBonus || 0) > 0 ? `<div class="refine-result-line refine-pity-line"><span>保底加成</span><strong>+${(result.pityBonus * 100).toFixed(1)}%</strong></div>` : ""}
      </div>
      ${result.success && continueEnabled ? `<div class="refine-result-line refine-rate-line"><span>下次星炼成功率</span><strong>${Math.round(getRefineChance(result.afterLevel + 1, item) * 100)}%</strong></div>` : ""}
      <div class="refine-result-line refine-cost-line"><span>消耗材料</span><strong>${escapeHtml(materialText(result.cost || {})) || "无"}</strong></div>
      ${result.success && result.afterStats ? `<div class="refine-result-line refine-stat-gain"><span>本次提升</span><strong>${escapeHtml(result.afterStats)}</strong></div>` : ""}
      ${!result.success && typeof result.nextPityBonus === "number" ? `<div class="refine-result-line refine-pity-line"><span>下次保底加成</span><strong>+${(result.nextPityBonus * 100).toFixed(1)}%</strong></div>` : ""}
      ${milestone ? `<div class="refine-milestone ${milestone.badge}"><strong>${milestone.title}</strong><span>${milestone.desc}</span></div>` : ""}
      ${result.unlockedStar15Bonus ? `<div class="refine-result-line refine-stat-gain"><span>满星奖励</span><strong>已激活 15 星部位奖励</strong></div>` : ""}
    </div>
  `;
}

function resetSave() {
  const runtime = window.RuneFrontierStateRuntime;
  if (runtime && typeof runtime.resetSave === "function") return runtime.resetSave();
  const ok = window.confirm("确定重置当前存档？");
  if (!ok) return;
  localStorage.removeItem(SAVE_KEY);
  state = createDefaultState();
  state.offlinePending = buildOfflineReward(0);
  state.offlineRewards = state.offlinePending;
  activePage = "adventure";
  spawnEnemy(false);
  addLog("存档已重置。");
  renderAll();
  save();
}

function buildOfflineReward(seconds) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.buildOfflineReward === "function") {
    return runtime.buildOfflineReward(seconds);
  }
  return calculateOfflineRewards(state.hero, Math.max(0, seconds) * 1000, currentMap().id);
}

function normalizeOfflineRewards(rewards = {}) {
  const source = rewards || {};
  const equipmentList = Array.isArray(source.equipments)
    ? source.equipments
    : Array.isArray(source.equipment)
      ? source.equipment
      : [];
  const pendingEquipment = Array.isArray(source.pendingEquipment)
    ? source.pendingEquipment
    : Array.isArray(source.offlinePending?.equipments)
      ? source.offlinePending.equipments
      : [];
  const materialList = Array.isArray(source.materials)
    ? source.materials
    : offlineMaterialObjectToList(source.materials || {});
  const cardList = Array.isArray(source.cards)
    ? source.cards
    : Object.entries(source.cards || {}).map(([cardId, value]) => {
        const card = cardPool.find((entry) => entry.id === cardId) || {};
        const qty = typeof value === "object" ? value.count || value.qty || 0 : value;
        return { cardId, name: card.name || cardId, rarity: card.rarity || "rare", qty };
      });
  const autoSalvagedMaterials = source.autoSalvagedMaterials || source.salvagedMaterials || source.salvageMaterials || {};
  const durationMs = Number(source.durationMs || source.offlineMs || source.duration || 0);
  const cappedDurationMs = Number(source.cappedDurationMs || source.cappedMs || durationMs || 0);
  const seconds = Number(source.seconds || source.offlineSeconds || Math.floor((cappedDurationMs || durationMs) / 1000) || 0);
  return {
    ...defaultOfflineRewards(),
    ...source,
    seconds,
    durationMs,
    cappedDurationMs,
    gold: Number(source.gold || 0),
    baseExp: Number(source.baseExp || 0),
    jobExp: Number(source.jobExp || 0),
    items: Array.isArray(source.items) ? source.items : [],
    equipments: [...equipmentList, ...pendingEquipment].filter(Boolean).map(normalizeItem),
    cards: cardList.filter((card) => Number(card.qty || 0) > 0),
    materials: materialList.filter((material) => Number(material.qty || 0) > 0),
    autoSalvagedMaterials,
    skippedEquipment: Number(source.skippedEquipment || pendingEquipment.length || 0),
    killCount: Number(source.killCount || source.kills || 0),
    noRewardsReason: source.noRewardsReason || "",
  };
}

function legacyNormalizeRecentLoot(entries = []) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => {
      const rewards = normalizeOfflineRewards(entry?.rewards || entry || {});
      return {
        id: entry?.id || `loot-${Date.now().toString(36)}`,
        source: entry?.source || "最近战利品",
        time: Number(entry?.time || entry?.createdAt || Date.now()),
        rewards,
      };
    })
    .filter((entry) => {
      const rewards = entry.rewards;
      return rewards.gold > 0 || rewards.baseExp > 0 || rewards.jobExp > 0 || rewards.equipments.length || rewards.cards.length || rewards.materials.length || offlineObjectTotal(rewards.autoSalvagedMaterials) > 0;
    })
    .sort((a, b) => b.time - a.time)
    .slice(0, 12);
}

function normalizeRecentLoot(entries = []) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.normalizeRecentLoot === "function") {
    return runtime.normalizeRecentLoot(entries);
  }
  return legacyNormalizeRecentLoot(entries);
}

function legacyRecordRecentLoot(rewards = {}, source = "最近战利品") {
  const normalized = normalizeOfflineRewards(rewards);
  const hasContent = normalized.gold > 0 || normalized.baseExp > 0 || normalized.jobExp > 0 || normalized.equipments.length || normalized.cards.length || normalized.materials.length || offlineObjectTotal(normalized.autoSalvagedMaterials) > 0;
  if (!hasContent) return;
  const entry = {
    id: `loot-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    source,
    time: Date.now(),
    rewards: normalized,
  };
  state.recentLoot = [entry, ...legacyNormalizeRecentLoot(state.recentLoot)].slice(0, 12);
  const hasRealLoot = normalized.equipments.length || normalized.cards.length || normalized.materials.length || offlineObjectTotal(normalized.autoSalvagedMaterials) > 0 || source.includes("离线");
  if (hasRealLoot) state.lootNotifyUnread = true;
  state.lastLootUpdatedAt = entry.time;
}

function recordRecentLoot(rewards = {}, source = "最近战利品") {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.recordRecentLoot === "function") {
    return runtime.recordRecentLoot(rewards, source);
  }
  return legacyRecordRecentLoot(rewards, source);
}

function normalizeLootFeed(entries = []) {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => ({
      id: entry?.id || `feed-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      name: entry?.name || "",
      qty: Math.max(1, Number(entry?.qty || 1)),
      rarity: entry?.rarity || "normal",
      source: entry?.source || "",
      kind: entry?.kind || "loot",
      time: Number(entry?.time || Date.now()),
    }))
    .filter((entry) => entry.name)
    .sort((a, b) => b.time - a.time)
    .slice(0, 30);
}

function recordLootFeedEntry(rewards, source = "最近战利品", time = Date.now()) {
  const safe = normalizeOfflineRewards(rewards);
  const rows = [];
  safe.equipments.forEach((item) => {
    rows.push({
      name: getDisplayItemName(item) || item.name || "装备",
      qty: 1,
      rarity: item.rarity || "normal",
      source,
      kind: item.setId ? "set" : "equipment",
      time,
    });
  });
  safe.cards.forEach((card) => {
    rows.push({
      name: card.name || card.cardId || "卡片",
      qty: Number(card.qty || 1),
      rarity: card.rarity || "rare",
      source,
      kind: "card",
      time,
    });
  });
  safe.materials.forEach((material) => {
    rows.push({
      name: materialNames[material.materialId] || material.name || material.materialId || "材料",
      qty: Number(material.qty || 1),
      rarity: MATERIAL_DB[material.materialId]?.rarity || material.rarity || "normal",
      source,
      kind: "material",
      time,
    });
  });
  Object.entries(safe.autoSalvagedMaterials || {}).forEach(([materialId, qty]) => {
    rows.push({
      name: materialNames[materialId] || materialId,
      qty: Number(qty || 0),
      rarity: MATERIAL_DB[materialId]?.rarity || "normal",
      source: "自动分解",
      kind: "salvage",
      time,
    });
  });
  const visibleRows = rows.filter((row) => row.qty > 0);
  if (!visibleRows.length) return;
  state.lootFeed = normalizeLootFeed([
    ...visibleRows.map((row, index) => ({ ...row, id: `feed-${time.toString(36)}-${index}-${Math.random().toString(36).slice(2, 5)}` })),
    ...(state.lootFeed || []),
  ]);
}

function legacyGetLatestRecentLootRewards() {
  state.recentLoot = normalizeRecentLoot(state.recentLoot);
  if (!state.recentLoot.length) return null;
  const newest = state.recentLoot[0].time;
  const batch = state.recentLoot.filter((entry) => newest - entry.time <= 10000).slice(0, 8);
  return legacyMergeRecentLootRewards(batch.map((entry) => entry.rewards));
}

function legacyMarkRecentLootViewed() {
  state.lootNotifyUnread = false;
  state.lastLootViewedAt = Date.now();
}

function markLootViewed() {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.markLootViewed === "function") {
    return runtime.markLootViewed();
  }
  return legacyMarkRecentLootViewed();
}

function legacyMergeRecentLootRewards(rewardsList = []) {
  const merged = defaultOfflineRewards();
  rewardsList.reverse().forEach((raw) => {
    const rewards = normalizeOfflineRewards(raw);
    merged.gold += rewards.gold;
    merged.baseExp += rewards.baseExp;
    merged.jobExp += rewards.jobExp;
    merged.killCount += rewards.killCount || 0;
    merged.equipments.push(...rewards.equipments);
    merged.cards = mergeCountEntries([...merged.cards, ...rewards.cards], "cardId");
    merged.materials = mergeCountEntries([...merged.materials, ...rewards.materials], "materialId");
    Object.entries(rewards.autoSalvagedMaterials || {}).forEach(([material, amount]) => {
      merged.autoSalvagedMaterials[material] = (merged.autoSalvagedMaterials[material] || 0) + Number(amount || 0);
    });
    merged.skippedEquipment += rewards.skippedEquipment || 0;
  });
  return merged;
}

function getLatestRecentLootRewards() {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.getLatestRecentLootRewards === "function") {
    return runtime.getLatestRecentLootRewards(state);
  }
  return legacyGetLatestRecentLootRewards();
}

function mergeRecentLootRewards(rewardsList = []) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.mergeLootRewards === "function") {
    return runtime.mergeLootRewards(rewardsList);
  }
  return legacyMergeRecentLootRewards(rewardsList);
}

function normalizeQuests(quests = {}) {
  return {
    active: Array.isArray(quests.active) ? quests.active.map(normalizeQuest).filter(Boolean) : [],
    completed: Array.isArray(quests.completed) ? quests.completed : [],
    lastRefreshAt: quests.lastRefreshAt || "",
  };
}

function normalizeQuest(quest) {
  if (!quest || !quest.id) return null;
  return {
    id: quest.id,
    category: quest.category || "daily",
    title: quest.title || "任务",
    description: quest.description || "",
    type: quest.type || "kill",
    targetMapId: quest.targetMapId || "",
    targetMonsterId: quest.targetMonsterId || "",
    targetDifficulty: quest.targetDifficulty || "",
    targetMutation: Boolean(quest.targetMutation),
    targetBoss: Boolean(quest.targetBoss),
    requiredCount: Math.max(1, Math.floor(quest.requiredCount || 1)),
    currentCount: Math.max(0, Math.floor(quest.currentCount || 0)),
    rewards: {
      vipExp: quest.rewards?.vipExp || 0,
      materials: quest.rewards?.materials || {},
      randomEquipment: quest.rewards?.randomEquipment || null,
    },
    completed: Boolean(quest.completed),
    claimed: Boolean(quest.claimed),
  };
}

function mergeOfflineRewards(existing, fresh) {
  const a = normalizeOfflineRewards(existing);
  const b = normalizeOfflineRewards(fresh);
  if (a.seconds <= 0) return b;
  if (b.seconds <= 0) return a;
  const merged = {
    ...defaultOfflineRewards(),
    seconds: a.seconds + b.seconds,
    durationMs: a.durationMs + b.durationMs,
    cappedDurationMs: a.cappedDurationMs + b.cappedDurationMs,
    gold: a.gold + b.gold,
    baseExp: a.baseExp + b.baseExp,
    jobExp: a.jobExp + b.jobExp,
    equipments: [...a.equipments, ...b.equipments],
    cards: mergeCountEntries([...a.cards, ...b.cards], "cardId"),
    materials: mergeCountEntries([...a.materials, ...b.materials], "materialId"),
    autoSalvagedMaterials: mergeMaterialObjects(a.autoSalvagedMaterials || {}, b.autoSalvagedMaterials || {}),
    skippedEquipment: a.skippedEquipment + b.skippedEquipment,
    mapId: b.mapId || a.mapId,
    calculatedAt: b.calculatedAt || a.calculatedAt,
    killCount: (a.killCount || 0) + (b.killCount || 0),
    noRewardsReason: b.noRewardsReason || a.noRewardsReason || "",
  };
  return merged;
}

function mergeCountEntries(entries, idKey) {
  const map = new Map();
  entries.forEach((entry) => {
    const id = entry[idKey];
    if (!id) return;
    const current = map.get(id) || { ...entry, qty: 0 };
    current.qty += entry.qty || 0;
    map.set(id, current);
  });
  return [...map.values()];
}

function mergeMaterialRewardIntoList(list, rewards = {}) {
  Object.entries(rewards).forEach(([materialId, qty]) => {
    const found = list.find((entry) => entry.materialId === materialId);
    if (found) found.qty += qty;
    else list.push({ materialId, name: materialNames[materialId] || materialId, rarity: MATERIAL_DB[materialId]?.rarity || "normal", qty });
  });
}

function mergeMaterialObjects(a = {}, b = {}) {
  const merged = { ...a };
  Object.entries(b).forEach(([id, qty]) => {
    merged[id] = (merged[id] || 0) + qty;
  });
  return merged;
}

function calculateOfflineRewards(character, offlineMs, mapId) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.calculateOfflineRewards === "function") {
    return runtime.calculateOfflineRewards(character, offlineMs, mapId);
  }
  return legacyCalculateOfflineRewards(character, offlineMs, mapId);
}

function legacyCalculateOfflineRewards(character, offlineMs, mapId) {
  const rewards = defaultOfflineRewards();
  const durationMs = Math.max(0, Math.floor(offlineMs || 0));
  const cappedDurationMs = Math.min(durationMs, (MAX_OFFLINE_SECONDS + (getVipMilestoneBonuses().offlineHoursBonus || 0) * 3600) * 1000);
  rewards.durationMs = durationMs;
  rewards.cappedDurationMs = cappedDurationMs;
  rewards.seconds = Math.floor(cappedDurationMs / 1000);
  rewards.mapId = mapId || currentMap().id;
  rewards.calculatedAt = new Date().toISOString();
  if (cappedDurationMs <= 0) return rewards;

  const stats = computeStats();
  if ((character?.currentHp ?? state.hero.currentHp ?? stats.maxHp) <= 0) {
    rewards.noRewardsReason = "角色生命值为 0，离线战斗停止。";
    return rewards;
  }

  const mapIndex = Math.max(0, maps.findIndex((map) => map.id === rewards.mapId));
  const map = maps[mapIndex] || currentMap();
  const seconds = cappedDurationMs / 1000;
  const averageHp = estimateMapAverageMonsterHp(map);
  const onlineKills = Math.max(0, stats.dps / Math.max(1, averageHp)) * seconds;
  const killCount = Math.min(OFFLINE_MAX_KILLS, Math.floor(onlineKills * Math.min(1, OFFLINE_EFFICIENCY + (getVipMilestoneBonuses().offlineEfficiencyBonus || 0) + (stats.offlineEfficiencyBonus || 0))));
  rewards.killCount = killCount;
  if (killCount <= 0) return rewards;

  let mutationKills = 0;
  for (let kill = 0; kill < killCount; kill += 1) {
    const monster = buildOfflineMonsterStats(map);
    if (monster.mutation) mutationKills += 1;
    rewards.gold += Math.round(monster.gold * stats.goldMultiplier * stats.monsterGoldMultiplier);
    rewards.baseExp += Math.round(monster.exp * stats.baseExpMultiplier);
    rewards.jobExp += Math.round(monster.jobExp * stats.jobExpMultiplier);
  }

  rollOfflineEquipmentDrops(rewards, stats, map, mapIndex, killCount);
  rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills);
  rollOfflineTransitionSetDrops(rewards, stats, map, killCount);
  rollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills);
  rollOfflineCardDrops(rewards, stats, map, mapIndex, killCount);
  rollOfflineMaterialDrops(rewards, stats, map, killCount);
  rollOfflineMutationExtraDrops(rewards, stats, map, mutationKills);
  gainMapExploration(map.id, killCount + mutationKills * 4, { offline: true });
  return rewards;
}

function estimateMapAverageMonsterHp(map) {
  const monsters = Array.isArray(map.monsters) && map.monsters.length ? map.monsters : [pickMonsterTemplate(map, false)];
  const total = monsters.reduce((sum, template) => {
    const levelRange = template.levelRange || [map.minLevel || 1, map.maxLevel || 1];
    const level = Math.floor((levelRange[0] + levelRange[1]) / 2);
    return sum + buildMonsterStats(map, false, level, template).maxHp;
  }, 0);
  return total / Math.max(1, monsters.length);
}

function buildOfflineMonsterStats(map) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.buildOfflineMonsterStats === "function") {
    return runtime.buildOfflineMonsterStats(map);
  }
  return legacyBuildOfflineMonsterStats(map);
}

function legacyBuildOfflineMonsterStats(map) {
  const template = pickMonsterTemplate(map, false);
  const level = rollMonsterLevel(map, false, template);
  const previousMutation = state.enemyMutationId;
  const mutation = rollMonsterMutation(state.currentDifficulty);
  state.enemyMutationId = mutation?.id || "";
  const monster = buildMonsterStats(map, false, level, template);
  state.enemyMutationId = previousMutation;
  return monster;
}

function rollOfflineEquipmentDrops(rewards, stats, map, mapIndex, killCount) {
  const tableId = mapDropTableAlias[map.id] || map.id;
  const rows = equipmentDropTables[tableId] || [];
  const capacity = { freeSlots: Math.max(0, getInventoryLimit() - state.inventory.length) };
  for (let kill = 0; kill < killCount; kill += 1) {
    const drops = rollEquipmentDropsFromTable(rows, stats, { offline: true });
    processOfflineGeneratedEquipment(rewards, drops, capacity);
  }
}

function canOfflineFullSalvage(item) {
  return !item.setId && !["darkGold", "mythic"].includes(item.rarity) && rarityRank(item.rarity) <= rarityRank("epic");
}

function processOfflineGeneratedEquipment(rewards, items, capacity, options = {}) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.processGeneratedOfflineEquipment === "function") {
    return runtime.processGeneratedOfflineEquipment(rewards, items, capacity, options);
  }
  (items || []).forEach((item) => {
    if (shouldAutoSalvage(item)) {
      mergeMaterialRewardIntoList(rewards.materials, getSalvageRewards(item));
      return;
    }
    if (capacity.freeSlots <= 0) {
      if (canOfflineFullSalvage(item)) {
        mergeMaterialRewardIntoList(rewards.materials, getSalvageRewards(item));
      } else {
        rewards.equipments.push(item);
      }
      return;
    }
    capacity.freeSlots -= 1;
    rewards.equipments.push(item);
  });
  return capacity;
}

function legacyRollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills = 0) {
  const setIds = zodiacSetDropMap[map.id] || [];
  if (!setIds.length) return;
  const capacity = { freeSlots: Math.max(0, getInventoryLimit() - state.inventory.length - rewards.equipments.length) };
  const isHard = state.currentDifficulty === "hard";
  const isAbyss = state.currentDifficulty === "abyss";
  const baseRate = (isAbyss ? ZODIAC_SET_DROP_RATES.hard * 1.2 : isHard ? ZODIAC_SET_DROP_RATES.hard : ZODIAC_SET_DROP_RATES.normal) * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER;
  const mutationRate = (isAbyss ? ZODIAC_SET_DROP_RATES.hardMutation * 1.25 : isHard ? ZODIAC_SET_DROP_RATES.hardMutation : ZODIAC_SET_DROP_RATES.mutation) * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER;
  const dropBonus = 1 + Math.min(1.5, stats.equipmentDropBonus || 0);
  for (let kill = 0; kill < Math.min(killCount, OFFLINE_MAX_KILLS); kill += 1) {
    const rate = (baseRate + (kill < mutationKills ? mutationRate : 0)) * dropBonus;
    if (Math.random() >= rate) continue;
    const set = equipmentSets[setIds[Math.floor(Math.random() * setIds.length)]];
    if (!set?.items?.length) continue;
    const darkRate = ZODIAC_SET_DROP_RATES.darkGoldNormal * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER * (isAbyss ? 1.5 : isHard ? 1.25 : 1) * dropBonus;
    const mythicRate = isAbyss ? MYTHIC_DROP_RATES.abyssNormal * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER * 0.5 * dropBonus : 0;
    const rarity = Math.random() < mythicRate ? "mythic" : Math.random() < darkRate ? "darkGold" : "legend";
    const template = set.items[Math.floor(Math.random() * set.items.length)];
    const dropLevel = template.level || getMapLevelRange(map).maxLevel;
    const item = createItem(template, dropLevel, rarity, { dropMapId: map.id, dropLevel, difficulty: state.currentDifficulty, allowMythic: rarity === "mythic" });
    processOfflineGeneratedEquipment(rewards, [item], capacity);
  }
}

function rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills = 0) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.rollOfflineZodiacSetDrops === "function") {
    return runtime.rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills);
  }
  return legacyRollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills);
}

function legacyRollOfflineTransitionSetDrops(rewards, stats, map, killCount) {
  const setIds = transitionSetDropMap[map.id] || [];
  if (!setIds.length) return;
  const capacity = { freeSlots: Math.max(0, getInventoryLimit() - state.inventory.length - rewards.equipments.length) };
  const isHard = state.currentDifficulty === "hard";
  const isAbyss = state.currentDifficulty === "abyss";
  const baseRate = (isAbyss ? TRANSITION_SET_DROP_RATES.hard * 1.2 : isHard ? TRANSITION_SET_DROP_RATES.hard : TRANSITION_SET_DROP_RATES.normal) * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER;
  const dropBonus = 1 + Math.min(1.2, stats.equipmentDropBonus || 0);
  for (let kill = 0; kill < Math.min(killCount, OFFLINE_MAX_KILLS); kill += 1) {
    if (Math.random() >= baseRate * dropBonus) continue;
    const set = equipmentSets[setIds[Math.floor(Math.random() * setIds.length)]];
    if (!set?.items?.length) continue;
    const template = set.items[Math.floor(Math.random() * set.items.length)];
    const dropLevel = template.level || getMapLevelRange(map).maxLevel;
    const item = createItem(template, dropLevel, template.rarity || "rare", { dropMapId: map.id, dropLevel, difficulty: state.currentDifficulty });
    processOfflineGeneratedEquipment(rewards, [item], capacity);
  }
}

function rollOfflineTransitionSetDrops(rewards, stats, map, killCount) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.rollOfflineTransitionSetDrops === "function") {
    return runtime.rollOfflineTransitionSetDrops(rewards, stats, map, killCount);
  }
  return legacyRollOfflineTransitionSetDrops(rewards, stats, map, killCount);
}

function legacyRollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills = 0) {
  if (state.currentDifficulty !== "abyss") return;
  const capacity = { freeSlots: Math.max(0, getInventoryLimit() - state.inventory.length - rewards.equipments.length) };
  const dropBonus = 1 + Math.min(1.5, stats.equipmentDropBonus || 0);
  for (let kill = 0; kill < Math.min(killCount, OFFLINE_MAX_KILLS); kill += 1) {
    const baseRate = kill < mutationKills ? MYTHIC_DROP_RATES.abyssMutation : MYTHIC_DROP_RATES.abyssNormal;
    if (Math.random() >= baseRate * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER * dropBonus) continue;
    const item = createMutationEquipment("mythic");
    if (!item) continue;
    processOfflineGeneratedEquipment(rewards, [item], capacity);
  }
}

function rollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills = 0) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.rollOfflineMythicDrops === "function") {
    return runtime.rollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills);
  }
  return legacyRollOfflineMythicDrops(rewards, stats, map, killCount, mutationKills);
}

function legacyRollOfflineCardDrops(rewards, stats, map, mapIndex, killCount) {
  const rows = cardDropTables[map.id] || [];
  const found = {};
  const difficulty = currentDifficultyConfig();
  for (let kill = 0; kill < killCount; kill += 1) {
    rows.forEach((drop) => {
      if (drop.bossOnly) return;
      const finalDropRate = drop.dropRate * (1 + Number(stats.cardDropBonus ?? stats.dropBonus ?? 0)) * difficulty.cardDrop;
      if (Math.random() >= finalDropRate) return;
      const card = cardPool.find((entry) => entry.id === drop.cardId);
      if (!card) return;
      found[card.id] = found[card.id] || { cardId: card.id, name: card.name, rarity: drop.rarity || "rare", qty: 0 };
      found[card.id].qty += 1;
    });
  }
  rewards.cards = Object.values(found);
}

function rollOfflineCardDrops(rewards, stats, map, mapIndex, killCount) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.rollOfflineCardDrops === "function") {
    return runtime.rollOfflineCardDrops(rewards, stats, map, mapIndex, killCount);
  }
  return legacyRollOfflineCardDrops(rewards, stats, map, mapIndex, killCount);
}

function legacyRollOfflineMaterialDrops(rewards, stats, map, killCount) {
  const rows = materialDropTables[map.id] || [];
  const found = {};
  const difficulty = currentDifficultyConfig();
  for (let kill = 0; kill < killCount; kill += 1) {
    rows.forEach((drop) => {
      const finalDropRate = drop.dropRate * (1 + stats.dropBonus) * difficulty.materialDrop;
      if (Math.random() >= finalDropRate) return;
      const qty = applyMaterialQuantityBonus(randomInt(drop.minQty || 1, drop.maxQty || drop.minQty || 1), stats);
      found[drop.materialId] = found[drop.materialId] || { materialId: drop.materialId, name: materialNames[drop.materialId] || drop.materialId, rarity: MATERIAL_DB[drop.materialId]?.rarity || "normal", qty: 0 };
      found[drop.materialId].qty += qty;
    });
  }
  rewards.materials = mergeCountEntries([...rewards.materials, ...Object.values(found)], "materialId");
}

function rollOfflineMaterialDrops(rewards, stats, map, killCount) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.rollOfflineMaterialDrops === "function") {
    return runtime.rollOfflineMaterialDrops(rewards, stats, map, killCount);
  }
  return legacyRollOfflineMaterialDrops(rewards, stats, map, killCount);
}

function legacyRollOfflineMutationExtraDrops(rewards, stats, map, mutationKills) {
  if (!mutationKills) return;
  const difficulty = currentDifficultyConfig();
  const dropBonus = Math.min(1.5, stats.dropBonus || 0);
  const equipmentDropBonus = Math.min(1.5, stats.equipmentDropBonus ?? stats.dropBonus ?? 0);
  const isAbyss = state.currentDifficulty === "abyss";
  const hardExtra = isAbyss ? 2 : state.currentDifficulty === "hard" ? 1.5 : 1;
  const materialRate = MUTATION_EXTRA_DROPS.materialBonusRate * hardExtra * (1 + dropBonus) * difficulty.materialDrop * OFFLINE_EFFICIENCY;
  const rareMaterialRate = MUTATION_EXTRA_DROPS.rareMaterialBonusRate * hardExtra * (1 + dropBonus) * difficulty.materialDrop * OFFLINE_EFFICIENCY;
  const highRate = MUTATION_EXTRA_DROPS.highRarityEquipmentRate * hardExtra * (1 + equipmentDropBonus) * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER;
  const darkRate = MUTATION_EXTRA_DROPS.darkGoldEquipmentRate * (isAbyss ? 1.5 : state.currentDifficulty === "hard" ? 1.2 : 1) * (1 + equipmentDropBonus) * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER;
  const mythicRate = isAbyss ? MYTHIC_DROP_RATES.abyssMutation * (1 + equipmentDropBonus) * OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER : 0;
  const capacity = { freeSlots: Math.max(0, getInventoryLimit() - state.inventory.length - rewards.equipments.length) };

  for (let i = 0; i < mutationKills; i += 1) {
    if (Math.random() < materialRate) {
      let qty = applyMaterialQuantityBonus(randomInt(1, 2), stats);
      if (Math.random() < (stats.mutationMaterialDoubleChance || 0)) qty *= 2;
      mergeMaterialRewardIntoList(rewards.materials, { ore: qty });
    }
    if (Math.random() < rareMaterialRate) mergeMaterialRewardIntoList(rewards.materials, { rune: applyMaterialQuantityBonus(1, stats) });

    const rarity = Math.random() < mythicRate ? "mythic" : Math.random() < darkRate ? "darkGold" : Math.random() < highRate ? (maps.indexOf(map) >= 3 ? "legend" : "epic") : "";
    if (!rarity) continue;
    const item = createMutationEquipment(rarity);
    if (!item) continue;
    processOfflineGeneratedEquipment(rewards, [item], capacity);
  }
}

function rollOfflineMutationExtraDrops(rewards, stats, map, mutationKills) {
  const runtime = window.RuneFrontierOfflineRuntime;
  if (runtime && typeof runtime.rollOfflineMutationExtraDrops === "function") {
    return runtime.rollOfflineMutationExtraDrops(rewards, stats, map, mutationKills);
  }
  return legacyRollOfflineMutationExtraDrops(rewards, stats, map, mutationKills);
}

function renderOfflineRewardSummary(rewards) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineRewardSummary === "function") return runtime.renderOfflineRewardSummary(rewards);
  try {
    return renderLootSummaryCard(normalizeLootRewards(rewards));
  } catch (error) {
    console.error("renderOfflineRewardSummary failed", error);
    return renderLootFallback(error);
  }
}

function legacyNormalizeLootRewards(input = {}) {
  const rewards = input || {};
  const normalized = normalizeOfflineRewards(rewards);
  const pendingCount = Math.min(Number(normalized.skippedEquipment || 0), normalized.equipments.length);
  const pendingEquipment = Array.isArray(rewards.pendingEquipment)
    ? rewards.pendingEquipment
    : pendingCount
      ? normalized.equipments.slice(-pendingCount)
      : [];
  const equipment = Array.isArray(rewards.equipment)
    ? rewards.equipment
    : pendingCount
      ? normalized.equipments.slice(0, -pendingCount)
      : normalized.equipments;
  return {
    seconds: Number(normalized.seconds || rewards.offlineSeconds || rewards.duration || 0),
    kills: Number(normalized.killCount || rewards.kills || 0),
    gold: Number(normalized.gold || 0),
    baseExp: Number(normalized.baseExp || rewards.exp || 0),
    jobExp: Number(normalized.jobExp || 0),
    materials: Array.isArray(normalized.materials) ? normalized.materials : [],
    cards: Array.isArray(normalized.cards) ? normalized.cards : [],
    equipment: Array.isArray(equipment) ? equipment.filter(Boolean).map(normalizeItem) : [],
    salvagedMaterials: normalized.autoSalvagedMaterials || rewards.salvagedMaterials || rewards.salvageMaterials || {},
    autoSalvaged: Number(rewards.autoSalvaged || rewards.salvagedCount || offlineObjectTotal(normalized.autoSalvagedMaterials) || 0),
    pendingEquipment: Array.isArray(pendingEquipment) ? pendingEquipment.filter(Boolean).map(normalizeItem) : [],
    skippedEquipment: Number(normalized.skippedEquipment || 0),
    noRewardsReason: normalized.noRewardsReason || "",
    errors: Array.isArray(rewards.errors) ? rewards.errors : [],
  };
}

function normalizeLootRewards(input = {}) {
  const runtime = window.RuneFrontierDropsRuntime;
  if (runtime && typeof runtime.normalizeLootRewards === "function") {
    return runtime.normalizeLootRewards(input);
  }
  return legacyNormalizeLootRewards(input);
}

function renderLootSummaryCard(rewards) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderLootSummaryCard === "function") return runtime.renderLootSummaryCard(rewards);
  const hasAny = rewards.seconds > 0 || rewards.gold > 0 || rewards.baseExp > 0 || rewards.jobExp > 0 || rewards.materials.length || rewards.cards.length || rewards.equipment.length || rewards.pendingEquipment.length || offlineObjectTotal(rewards.salvagedMaterials) > 0;
  if (!hasAny) {
    return `<article class="loot-modal"><div class="loot-empty"><h3>暂无战利品</h3><p>如果你刚上线，请等待离线收益结算完成。</p></div></article>`;
  }
  return `
    <article class="loot-modal">
      <header class="offline-reward-header">
        <span class="offline-chest-icon" aria-hidden="true">◇</span>
        <div>
          <strong>${rewards.seconds > 0 ? "离线战利品" : "最近战利品"}</strong>
          <p>稳定清点模式，所有收益以真实结算为准</p>
        </div>
        <div class="offline-time-pill">${rewards.seconds > 0 ? `离线 ${formatDuration(rewards.seconds)}` : "最新获得"}</div>
      </header>
      ${rewards.noRewardsReason ? `<p class="offline-reason">${escapeHtml(rewards.noRewardsReason)}</p>` : ""}
      <div class="loot-summary-grid">
        ${renderLootSummaryMini("击杀", rewards.kills)}
        ${renderLootSummaryMini("金币", rewards.gold)}
        ${renderLootSummaryMini("BASE经验", rewards.baseExp)}
        ${renderLootSummaryMini("JOB经验", rewards.jobExp)}
        ${renderLootSummaryMini("材料", offlineListTotal(rewards.materials))}
        ${renderLootSummaryMini("装备", rewards.equipment.length)}
        ${renderLootSummaryMini("待领取装备", rewards.pendingEquipment.length)}
      </div>
      ${renderLootMaterialSection(rewards.materials)}
      ${renderLootEquipmentSection(rewards.equipment, "获得装备")}
      ${renderLootCardSection(rewards.cards)}
      ${renderLootSalvageSection(rewards.salvagedMaterials)}
      ${renderLootPendingSection(rewards.pendingEquipment)}
    </article>`;
}

function renderLootFallback(error) {
  return `
    <article class="loot-modal">
      <div class="loot-fallback">
        <h3>战利品显示异常</h3>
        <p>收益数据已经结算，但显示时发生异常。</p>
        <p>请刷新页面或稍后再试。</p>
        ${error ? `<small>${escapeHtml(error.message || String(error))}</small>` : ""}
      </div>
    </article>`;
}

function renderLootSummaryMini(label, value) {
  return `<div class="loot-summary-card"><span>${escapeHtml(label)}</span><strong>${formatNumber(value || 0)}</strong></div>`;
}

function renderLootMaterialSection(materials = []) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderLootMaterialSection === "function") return runtime.renderLootMaterialSection(materials);
  if (!Array.isArray(materials) || !materials.length) return "";
  return `<section class="loot-section"><h3 class="loot-section-title">材料</h3><div class="loot-item-grid">${materials.map(renderOfflineMaterialChip).join("")}</div></section>`;
}

function renderLootSalvageSection(materials = {}) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderLootSalvageSection === "function") return runtime.renderLootSalvageSection(materials);
  const list = offlineMaterialObjectToList(materials || {});
  if (!list.length) return "";
  return `<section class="loot-section"><h3 class="loot-section-title">自动分解</h3><div class="loot-item-grid">${list.map((item) => renderOfflineMaterialChip(item, "loot-material-chip")).join("")}</div></section>`;
}

function renderLootCardSection(cards = []) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderLootCardSection === "function") return runtime.renderLootCardSection(cards);
  if (!Array.isArray(cards) || !cards.length) return "";
  return `<section class="loot-section"><h3 class="loot-section-title">卡片</h3><div class="loot-item-grid">${cards.map((card) => `<div class="loot-equipment-row">${renderItemName({ name: card.name || card.cardId || "未知卡片", rarity: card.rarity || "rare" })}<small>×${formatNumber(card.qty || 0)}</small></div>`).join("")}</div></section>`;
}

function renderLootEquipmentSection(equipment = [], title = "装备") { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderLootEquipmentSection === "function") return runtime.renderLootEquipmentSection(equipment, title);
  if (!Array.isArray(equipment) || !equipment.length) return "";
  const sorted = sortOfflineEquipment(equipment).slice(0, 8);
  return `<section class="loot-section"><h3 class="loot-section-title">${escapeHtml(title)}</h3><div class="loot-item-grid">${sorted.map((item) => renderOfflineEquipmentItem(item)).join("")}</div>${equipment.length > sorted.length ? `<p class="loot-empty">还有 ${formatNumber(equipment.length - sorted.length)} 件装备</p>` : ""}</section>`;
}

function renderLootPendingSection(equipment = []) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderLootPendingSection === "function") return runtime.renderLootPendingSection(equipment);
  if (!Array.isArray(equipment) || !equipment.length) return "";
  return `<section class="loot-section loot-pending-warning"><h3 class="loot-section-title">待领取装备（${formatNumber(equipment.length)}）</h3><p>背包已满，以下装备已暂存，收益没有丢失。清理背包后可继续领取。</p><div class="loot-item-grid">${equipment.slice(0, 8).map((item) => renderOfflineEquipmentItem(item)).join("")}</div>${equipment.length > 8 ? `<p class="loot-empty">还有 ${formatNumber(equipment.length - 8)} 件待领取装备</p>` : ""}</section>`;
}

function renderOfflineOverview(rewards, claimedEquipment, pendingEquipment) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineOverview === "function") return runtime.renderOfflineOverview(rewards, claimedEquipment, pendingEquipment);
  const materialTotal = offlineListTotal(rewards.materials);
  const cardTotal = offlineListTotal(rewards.cards);
  const salvageTotal = offlineObjectTotal(rewards.autoSalvagedMaterials);
  return `
    <div class="offline-overview-grid">
      ${renderOfflineOverviewCard("金币", rewards.gold, "gold")}
      ${renderOfflineOverviewCard("BASE经验", rewards.baseExp, "base")}
      ${renderOfflineOverviewCard("JOB经验", rewards.jobExp, "job")}
      ${renderOfflineOverviewCard("材料", materialTotal, "material")}
      ${renderOfflineOverviewCard("卡片", cardTotal, "card")}
      ${renderOfflineOverviewCard("装备", claimedEquipment.length, "equipment")}
      ${renderOfflineOverviewCard("自动分解", salvageTotal, "salvage")}
      ${pendingEquipment.length ? renderOfflineOverviewCard("待领取", pendingEquipment.length, "pending") : ""}
    </div>
  `;
}

function renderOfflineOverviewCard(label, value, type) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineOverviewCard === "function") return runtime.renderOfflineOverviewCard(label, value, type);
  return `
    <div class="offline-overview-card offline-overview-${type}">
      <span>${escapeHtml(label)}</span>
      <strong class="offline-number">+${formatNumber(value || 0)}</strong>
    </div>
  `;
}

function renderOfflineGoldExpSection(rewards) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineGoldExpSection === "function") return runtime.renderOfflineGoldExpSection(rewards);
  return `
    <section class="offline-reward-section offline-gold-exp-section">
      <div class="offline-reward-section-title">金币与经验</div>
      <div class="offline-gain-strip">
        <div class="offline-gain offline-gain-gold"><span>金币</span><strong class="offline-number">+${formatNumber(rewards.gold)}</strong></div>
        <div class="offline-gain offline-gain-base"><span>BASE EXP</span><strong class="offline-number">+${formatNumber(rewards.baseExp)}</strong></div>
        <div class="offline-gain offline-gain-job"><span>JOB EXP</span><strong class="offline-number">+${formatNumber(rewards.jobExp)}</strong></div>
      </div>
      <p class="offline-source-note">离线效率 ${Math.round(OFFLINE_EFFICIENCY * 100)}% · 最大离线时间 ${formatDuration(MAX_OFFLINE_SECONDS)} · VIP 与套装收益已计入本次真实结算</p>
    </section>
  `;
}

function renderOfflineMaterialSection(rewards) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineMaterialSection === "function") return runtime.renderOfflineMaterialSection(rewards);
  const materials = rewards.materials || [];
  if (!materials.length) return renderOfflineEmptySection("材料", "无材料掉落");
  return `
    <section class="offline-reward-section">
      <div class="offline-reward-section-title">材料</div>
      <div class="offline-loot-grid">
        ${materials.map((material) => renderOfflineMaterialChip(material)).join("")}
      </div>
    </section>
  `;
}

function renderOfflineSalvageSection(rewards) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineSalvageSection === "function") return runtime.renderOfflineSalvageSection(rewards);
  const materials = offlineMaterialObjectToList(rewards.autoSalvagedMaterials || {});
  if (!materials.length) return "";
  return `
    <section class="offline-reward-section offline-salvage-section">
      <div class="offline-reward-section-title">自动分解回收</div>
      <p class="offline-source-note">离线期间自动分解了部分装备，回收出以下材料：</p>
      <div class="offline-loot-grid">
        ${materials.map((material) => renderOfflineMaterialChip(material, "offline-salvage-item")).join("")}
      </div>
    </section>
  `;
}

function renderOfflineCardSection(rewards) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineCardSection === "function") return runtime.renderOfflineCardSection(rewards);
  const cards = rewards.cards || [];
  if (!cards.length) return renderOfflineEmptySection("卡片", "无卡片掉落");
  return `
    <section class="offline-reward-section">
      <div class="offline-reward-section-title">卡片</div>
      <div class="offline-loot-grid">
        ${cards
          .map((card) => `
            <div class="offline-loot-item ${offlineHighlightClass(card)}">
              <span class="offline-loot-icon">卡</span>
              <div>
                ${renderItemName({ name: card.name, rarity: card.rarity || "rare" })}
                <small>${rarityName(card.rarity || "rare")} · 数量 ${formatNumber(card.qty || 0)}</small>
              </div>
            </div>
          `)
          .join("")}
      </div>
    </section>
  `;
}

function renderOfflineEquipmentSection(equipment, title) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineEquipmentSection === "function") return runtime.renderOfflineEquipmentSection(equipment, title);
  const sorted = sortOfflineEquipment(equipment || []);
  if (!sorted.length) return renderOfflineEmptySection(title, "无装备掉落");
  const visible = sorted.slice(0, 6);
  const hiddenCount = sorted.length - visible.length;
  return `
    <section class="offline-reward-section">
      <div class="offline-reward-section-title">${escapeHtml(title)}</div>
      <div class="offline-loot-grid">
        ${visible.map((item) => renderOfflineEquipmentItem(item)).join("")}
      </div>
      ${hiddenCount > 0 ? `<p class="offline-more">还有 ${formatNumber(hiddenCount)} 件装备已入袋</p>` : ""}
    </section>
  `;
}

function renderOfflinePendingEquipmentSection(equipment) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflinePendingEquipmentSection === "function") return runtime.renderOfflinePendingEquipmentSection(equipment);
  const sorted = sortOfflineEquipment(equipment || []);
  if (!sorted.length) return "";
  return `
    <section class="offline-reward-section offline-pending-list">
      <div class="offline-reward-section-title">待领取装备</div>
      <p class="offline-source-note">由于背包空间不足，以下装备已暂存，请清理背包后领取。</p>
      <div class="offline-loot-grid">
        ${sorted.slice(0, 8).map((item) => renderOfflineEquipmentItem(item)).join("")}
      </div>
      ${sorted.length > 8 ? `<p class="offline-more">还有 ${formatNumber(sorted.length - 8)} 件待领取装备</p>` : ""}
    </section>
  `;
}

function renderOfflineEquipmentItem(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineEquipmentItem === "function") return runtime.renderOfflineEquipmentItem(item);
  const setText = item.setName ? `<small>${renderSetName(item.setName)}</small>` : "";
  return `
    <div class="offline-loot-item ${offlineHighlightClass(item)}">
      <span class="offline-loot-icon">${slotName(equipmentSlot(item)).slice(0, 1)}</span>
      <div>
        ${renderItemName(item)}
        <small>${rarityName(item.rarity)} · ${slotName(equipmentSlot(item))}${item.refine ? ` · +${item.refine}` : ""}</small>
        ${setText}
      </div>
    </div>
  `;
}

function renderOfflineMaterialChip(material, extraClass = "") { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineMaterialChip === "function") return runtime.renderOfflineMaterialChip(material, extraClass);
  const rarity = material.rarity || MATERIAL_DB[material.materialId]?.rarity || "normal";
  const name = material.name || materialNames[material.materialId] || material.materialId;
  return `
    <div class="offline-loot-item offline-material-chip ${extraClass}">
      <span class="offline-loot-icon">材</span>
      <div>
        ${renderItemName({ name, rarity })}
        <small>数量 <span class="offline-number">+${formatNumber(material.qty || 0)}</span></small>
        <span class="offline-progress-bar"><span class="offline-progress-fill"></span></span>
      </div>
    </div>
  `;
}

function renderOfflineEmptySection(title, text) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderOfflineEmptySection === "function") return runtime.renderOfflineEmptySection(title, text);
  return `
    <section class="offline-reward-section offline-empty-section">
      <div class="offline-reward-section-title">${escapeHtml(title)}</div>
      <p>${escapeHtml(text)}</p>
    </section>
  `;
}

function offlineMaterialObjectToList(materials = {}) {
  return Object.entries(materials)
    .filter(([, qty]) => qty > 0)
    .map(([materialId, qty]) => ({
      materialId,
      name: materialNames[materialId] || materialId,
      rarity: MATERIAL_DB[materialId]?.rarity || "normal",
      qty,
    }));
}

function offlineListTotal(list = []) {
  return list.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
}

function offlineObjectTotal(obj = {}) {
  return Object.values(obj).reduce((sum, value) => sum + (Number(value) || 0), 0);
}

function sortOfflineEquipment(equipment) {
  return [...equipment].sort((a, b) => {
    const setScore = Number(Boolean(b.setId || b.setName)) - Number(Boolean(a.setId || a.setName));
    if (setScore) return setScore;
    return (rarityOrder.indexOf(b.rarity) || 0) - (rarityOrder.indexOf(a.rarity) || 0);
  });
}

function offlineHighlightClass(item = {}) {
  if (item.setId || item.setName) return "offline-highlight-set";
  if (item.rarity === "mythic") return "offline-highlight-mythic";
  if (item.rarity === "darkGold") return "offline-highlight-darkgold";
  if (item.rarity === "legend") return "offline-highlight-legend";
  if (item.rarity === "epic" || item.rarity === "ancient") return "offline-highlight-rare";
  return "";
}

function summarizeByName(items) {
  const map = new Map();
  items.forEach((item) => {
    const key = item.templateId || item.name;
    const entry = map.get(key) || { item, qty: 0 };
    entry.qty += 1;
    map.set(key, entry);
  });
  return [...map.values()];
}

function computeStats() {
  const equip = computeEquipmentFullStats();
  const costumeEffects = getCostumeEffects();
  Object.entries(costumeEffects).forEach(([stat, value]) => {
    equip[stat] = (equip[stat] || 0) + value;
  });
  const titleEffects = getTitleEffects();
  Object.entries(titleEffects).forEach(([stat, value]) => {
    const key = stat === "goldBonus" ? "gold" : stat;
    equip[key] = (equip[key] || 0) + value;
  });
  const explorationBonuses = getMapExplorationBonuses(currentMap().id);
  const passive = getPassiveSkillTotals();
  const job = currentJob();
  const level = state.hero.baseLevel;
  const jobLevel = state.hero.jobLevel;
  const cardStats = getCardStats();
  const vipBonuses = getVipBonuses();
  const attrBreakdown = calculateFinalStats({ equip });
  const attrs = { ...attrBreakdown.final };
  attributeKeys.forEach((stat) => {
    attrs[stat] += cardStats[stat] || 0;
  });
  const setBonuses = computeSetBonuses();
  const isAbyss = state.currentDifficulty === "abyss";
  attributeKeys.forEach((stat) => {
    if (setBonuses.attrPct) attrs[stat] = Math.round(attrs[stat] * (1 + setBonuses.attrPct));
    if (setBonuses[`${stat}Pct`]) attrs[stat] = Math.round(attrs[stat] * (1 + setBonuses[`${stat}Pct`]));
    if (isAbyss && setBonuses.abyssAttrPct) attrs[stat] = Math.round(attrs[stat] * (1 + setBonuses.abyssAttrPct));
  });
  if (isAbyss && setBonuses.abyssDexPct) attrs.dex = Math.round(attrs.dex * (1 + setBonuses.abyssDexPct));
  if (isAbyss && setBonuses.abyssAttackSpeedPct) equip.attackSpeedPct = (equip.attackSpeedPct || 0) + setBonuses.abyssAttackSpeedPct;
  if (isAbyss && setBonuses.abyssCritRatePct) equip.critRatePct = (equip.critRatePct || 0) + setBonuses.abyssCritRatePct;
  if (isAbyss && setBonuses.abyssMagicDamageBonus) equip.matkPct = (equip.matkPct || 0) + setBonuses.abyssMagicDamageBonus;
  if (equip.patrolEfficiency) equip.combatPaceBonus = (equip.combatPaceBonus || 0) + equip.patrolEfficiency * 0.5;
  const battleStats = calculateBattleStats({ attrs, equip, passive, cardStats, job, level, jobLevel, setBonuses });
  syncHeroHp({ maxHp: battleStats.maxHp }, false);
  const dps = battleStats.dps;
  const itemDropBonus = calculateDropBonus({ equip, cardStats, passive, attrs, vipBonuses }) + setBonuses.itemDropPct + explorationBonuses.itemDropBonus;
  const equipmentDropBonus = calculateEquipmentDropBonus({ equip, cardStats, passive, attrs, vipBonuses }) + setBonuses.equipmentDropPct + explorationBonuses.equipmentDropBonus;
  const codexS = getCodexBonusStats();
  const vipMs = getVipMilestoneBonuses();
  const bossDamageBonusTotal = setBonuses.bossDamagePct + (equip.bossDamageBonus || 0) + (passive.bossDamageBonus || 0) + explorationBonuses.bossDamageBonus + (codexS.bossDamage || 0);
  const critDamageBonusTotal = setBonuses.critDamagePct + (equip.critDamageBonus || 0) + (passive.critDamageBonus || 0) + (isAbyss ? setBonuses.abyssCritDamageBonus || 0 : 0);
  const damageReductionTotal = setBonuses.damageReductionPct + (equip.damageReductionPct || 0) + (passive.damageReductionPct || 0) + (isAbyss ? (setBonuses.abyssDamageReduction || 0) + (equip.abyssDamageReduction || 0) + (passive.abyssDamageReduction || 0) + (state.enemyBoss ? setBonuses.abyssBossDamageReduction || 0 : 0) : 0);
  const abyssDamageBonusTotal = (setBonuses.abyssDamageBonus || 0) + (equip.abyssDamageBonus || 0) + (passive.abyssDamageBonus || 0);
  const mythicWeightBonusTotal = (setBonuses.mythicWeightBonus || 0) + (equip.mythicWeightBonus || 0) + (equip.rebirthPrestigeWeightBonus || 0) + getRebirthPrestigeBonuses().mythicWeightBonus + (codexS.mythicQualityWeight || 0);

  return {
    dps,
    power: calculatePower({ attrs, equip, battleStats, setBonuses }),
    hp: Math.round(battleStats.maxHp * (1 + (codexS.hpBonus || 0))),
    maxHp: Math.round(battleStats.maxHp * (1 + (codexS.hpBonus || 0))),
    currentHp: Math.min(Math.round(battleStats.maxHp * (1 + (codexS.hpBonus || 0))), state.hero.currentHp ?? battleStats.maxHp),
    defense: Math.round(battleStats.defense * (1 + (codexS.defBonus || 0))),
    atk: equip.atk,
    matk: equip.matk,
    atkPower: battleStats.physicalAttack,
    matkPower: battleStats.magicAttack,
    physicalAttack: battleStats.physicalAttack,
    magicAttack: battleStats.magicAttack,
    aspd: battleStats.attackSpeed,
    attackSpeed: battleStats.attackSpeed,
    hpRegen: battleStats.hpRegen,
    dodgeRate: battleStats.dodgeRate,
    luck: attrs.luk,
    attrs,
    baseAttrs: attrBreakdown.base,
    trainingPct: attrBreakdown.trainingPct,
    setBonuses,
    monsterDamageBonus: Math.min(2, (cardStats.monsterDamage || 0) + (equip.monsterDamageBonus || 0) + (passive.monsterDamageBonus || 0)),
    bossDamageBonus: bossDamageBonusTotal,
    mutationDamageBonus: setBonuses.mutationDamagePct,
    eliteDamageBonus: setBonuses.eliteDamagePct + (equip.eliteDamageBonus || 0) + (passive.eliteDamageBonus || 0),
    normalAttackBonus: setBonuses.normalAttackPct + (equip.normalAttackDamageBonus || 0),
    skillDamageBonus: setBonuses.skillDamagePct + (equip.skillDamageBonus || 0) + (passive.skillDamageBonus || 0) + (isAbyss ? (setBonuses.abyssSkillDamageBonus || 0) + (equip.abyssSkillDamageBonus || 0) : 0),
    critDamageBonus: critDamageBonusTotal,
    critDamage: 1.85 + critDamageBonusTotal,
    ignoreDefensePct: setBonuses.ignoreDefensePct + (equip.ignoreDefense || 0) + (passive.ignoreDefense || 0) + (isAbyss ? setBonuses.abyssIgnoreDefense || 0 : 0),
    finalDamageBonus: (equip.finalDamageBonus || 0) + (equip.physicalFinalDamageBonus || 0) + (passive.finalDamageBonus || 0),
    lifeSteal: Math.min(0.35, (equip.lifeSteal || 0) + (passive.lifeSteal || passive.lifeStealPct || 0)),
    goldMultiplier: 1 + calculateGoldBonus({ equip, cardStats, passive, vipBonuses }) + explorationBonuses.goldBonus + (isAbyss ? setBonuses.abyssGoldPct || 0 : 0) + (codexS.goldBonus || 0),
    monsterGoldMultiplier: 1 + setBonuses.monsterGoldPct,
    baseExpMultiplier: 1 + setBonuses.baseExpPct + (equip.baseExpBonus || 0) + (passive.baseExpBonus || 0) + explorationBonuses.expBonus + (isAbyss ? setBonuses.abyssBaseExpPct || 0 : 0) + (codexS.expBonus || 0),
    jobExpMultiplier: 1 + setBonuses.jobExpPct + (equip.jobExpBonus || 0) + (passive.jobExpBonus || 0) + explorationBonuses.expBonus + (isAbyss ? setBonuses.abyssJobExpPct || 0 : 0),
    materialQuantityBonus: setBonuses.materialQuantityPct + (equip.materialQuantityBonus || 0) + (passive.materialQuantityBonus || 0),
    damageReductionPct: damageReductionTotal,
    echoChance: Math.min(0.25, (equip.echoChance || 0) + (passive.echoChance || 0)),
    skillHitHealPct: Math.min(0.05, equip.skillHitHealPct || 0),
    magicDamageReduction: Math.min(0.6, equip.magicDamageReduction || 0),
    skillDamageReduction: Math.min(0.6, equip.skillDamageReduction || 0),
    skillCooldownPenalty: Math.min(0.35, equip.skillCooldownPenalty || 0),
    offlineEfficiencyBonus: Math.min(0.2, equip.offlineEfficiencyBonus || 0),
    mutationMaterialDoubleChance: Math.min(0.25, equip.mutationMaterialDoubleChance || 0),
    thornVitMultiplier: Math.min(5, equip.thornVitMultiplier || 0),
    combatPaceBonus: Math.min(0.25, (equip.combatPaceBonus || 0) + (passive.combatPaceBonus || 0) + (equip.patrolEfficiency || 0) * 0.5),
    hitRate: equip.hitRate || 0,
    statusResist: equip.statusResist || 0,
    higherLevelDamageBonus: equip.higherLevelDamageBonus || 0,
    splashTargets: equip.splashTargets || 0,
    splashDamagePct: equip.splashDamagePct || 0,
    fireBurstChance: Math.min(0.25, equip.fireBurstChance || 0),
    fireBurstAtkPct: equip.fireBurstAtkPct || 0,
    meteorCounterChance: Math.min(0.25, equip.meteorCounterChance || 0),
    meteorCounterMatkPct: equip.meteorCounterMatkPct || 0,
    abyssDamageBonus: abyssDamageBonusTotal,
    abyssBossDamageBonus: (setBonuses.abyssBossDamageBonus || 0) + (equip.abyssBossDamageBonus || 0),
    abyssDamageReduction: (isAbyss ? (setBonuses.abyssDamageReduction || 0) + (equip.abyssDamageReduction || 0) + (passive.abyssDamageReduction || 0) + (state.enemyBoss ? setBonuses.abyssBossDamageReduction || 0 : 0) : 0),
    abyssMaterialDropBonus: (setBonuses.abyssMaterialDropBonus || 0) + (equip.abyssMaterialDropBonus || 0) + (vipMs.abyssMaterialDropBonus || 0),
    mythicWeightBonus: mythicWeightBonusTotal,
    bossQualityWeight: codexS.bossQualityWeight || 0,
    mythicEssenceDropBonus: (equip.mythicEssenceDropBonus || 0) + (vipMs.mythicEssenceDropBonus || 0),
    rareDropBonus: (equip.rareDropBonus || 0) + (passive.rareDropBonus || 0) + (vipMs.rareQualityWeightBonus || 0),
    abyssExecuteDamageBonus: (equip.abyssExecuteDamageBonus || 0) + (passive.abyssExecuteDamageBonus || 0),
    rawCritRate: battleStats.rawCritRate,
    crit: battleStats.critRate,
    critRate: battleStats.critRate,
    dropBonus: Math.min(2.5, itemDropBonus + (isAbyss ? setBonuses.abyssItemDropBonus || 0 : 0) + (codexS.dropBonus || 0) + (codexS.materialDropBonus || 0)),
    cardDropBonus: Math.min(3, itemDropBonus + setBonuses.cardDropPct + (equip.cardDrop || 0) + (isAbyss ? setBonuses.abyssCardDropBonus || 0 : 0)),
    equipmentDropBonus: Math.min(2.5, equipmentDropBonus),
    bossEquipDropBonus: codexS.bossEquipDropBonus || 0,
    cardFind: attrs.luk * 0.00008,
    vipBonuses,
    explorationBonuses,
    passive,
  };
}

function getCostumeEffects() {
  state.costumes = normalizeCostumes(state.costumes);
  return Object.values(state.costumes.equipped || {}).reduce((sum, costumeId) => {
    const costume = COSTUME_DB[costumeId];
    Object.entries(costume?.effects || {}).forEach(([stat, value]) => {
      const key = stat === "goldBonus" ? "gold" : stat;
      sum[key] = (sum[key] || 0) + value;
    });
    return sum;
  }, {});
}

function getTitleEffects() {
  state.titles = normalizeTitles(state.titles);
  const title = TITLE_DB[state.titles.equipped];
  return title?.effects || {};
}

function getPassiveSkillTotals() {
  const totals = getUnlockedSkills().reduce(
    (sum, entry) => {
      if (entry.active) return sum;
      const growth = getPassiveSkillMultiplier(entry);
      const ms = getSkillMilestoneBonuses(entry);
      sum.atkPct += entry.atkPct * growth + (ms.atkPct || 0);
      sum.matkPct += entry.matkPct * growth + (ms.matkPct || 0);
      sum.hpPct += entry.hpPct * growth + (ms.hpPct || 0);
      sum.defPct += entry.defPct * growth + (ms.defPct || 0);
      sum.aspdPct += entry.aspdPct * growth + (ms.aspdPct || 0);
      sum.critPct += entry.critPct * growth + (ms.critRatePct || 0);
      sum.goldPct += entry.goldPct * growth + (ms.goldBonus || 0);
      sum.dropPct += entry.dropPct * growth + (ms.dropPct || 0);
      sum.dpsPct += entry.dpsPct * growth;
      sum.critDamageBonus = (sum.critDamageBonus || 0) + (ms.critDamageBonus || 0);
      sum.skillDamageBonus = (sum.skillDamageBonus || 0) + (ms.skillDamageBonus || 0);
      sum.damageReductionPct = (sum.damageReductionPct || 0) + (ms.damageReductionPct || 0);
      sum.rareDropBonus = (sum.rareDropBonus || 0) + (ms.rareDropBonus || 0);
      sum.echoChance = (sum.echoChance || 0) + (ms.echoChance || 0);
      sum.materialQuantityBonus = (sum.materialQuantityBonus || 0) + (ms.materialQuantityBonus || 0);
      sum.baseExpBonus = (sum.baseExpBonus || 0) + (ms.baseExpBonus || 0);
      sum.jobExpBonus = (sum.jobExpBonus || 0) + (ms.jobExpBonus || 0);
      sum.eliteDamageBonus = (sum.eliteDamageBonus || 0) + (ms.eliteDamageBonus || 0);
      sum.monsterDamageBonus = (sum.monsterDamageBonus || 0) + (ms.monsterDamageBonus || 0);
      sum.bossDamageBonus = (sum.bossDamageBonus || 0) + (ms.bossDamageBonus || 0);
      sum.finalDamageBonus = (sum.finalDamageBonus || 0) + (ms.finalDamageBonus || 0);
      sum.ignoreDefense = (sum.ignoreDefense || 0) + (ms.ignoreDefense || 0);
      sum.combatPaceBonus = (sum.combatPaceBonus || 0) + (ms.combatPaceBonus || 0);
      sum.dodgeRatePct = (sum.dodgeRatePct || 0) + (ms.dodgeRatePct || 0);
      sum.abyssDamageBonus = (sum.abyssDamageBonus || 0) + (ms.abyssDamageBonus || 0);
      sum.abyssDamageReduction = (sum.abyssDamageReduction || 0) + (ms.abyssDamageReduction || 0);
      sum.abyssExecuteDamageBonus = (sum.abyssExecuteDamageBonus || 0) + (ms.abyssExecuteDamageBonus || 0);
      sum.hpRegenPct = (sum.hpRegenPct || 0) + (ms.hpRegenPct || 0);
      return sum;
    },
    { atkPct: 0, matkPct: 0, hpPct: 0, defPct: 0, aspdPct: 0, critPct: 0, goldPct: 0, dropPct: 0, dpsPct: 0 },
  );
  return totals;
}

function getVipBonuses(level = state.vip?.level || 0) {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.getVipBonuses === "function") return runtime.getVipBonuses(level);
  const capped = clampNumber(Math.floor(level || 0), 0, VIP_MAX_LEVEL);
  return {
    gold: capped * VIP_BONUS_PER_LEVEL.gold,
    itemDrop: capped * VIP_BONUS_PER_LEVEL.itemDrop,
    equipmentDrop: capped * VIP_BONUS_PER_LEVEL.equipmentDrop,
  };
}

function getVipProgressInfo(vipInput = state.vip) {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.getVipProgressInfo === "function") return runtime.getVipProgressInfo(vipInput);
  const vip = normalizeVip(vipInput);
  const level = clampNumber(Math.floor(vip.level || 0), 0, VIP_MAX_LEVEL);
  const totalExp = Math.max(0, Math.floor(vip.totalExp || vip.exp || 0));
  const currentLevelReq = Math.max(0, Number(VIP_EXP_REQUIREMENTS[level] || 0));
  const nextLevelReq = Math.max(currentLevelReq, Number(VIP_EXP_REQUIREMENTS[level + 1] || VIP_EXP_REQUIREMENTS[VIP_MAX_LEVEL] || currentLevelReq));
  if (level >= VIP_MAX_LEVEL) {
    return {
      level,
      totalExp,
      currentLevelExp: 0,
      requiredForNext: 0,
      remaining: 0,
      progressPct: 1,
      isMax: true,
    };
  }
  const currentLevelExp = Math.max(0, totalExp - currentLevelReq);
  const requiredForNext = Math.max(1, nextLevelReq - currentLevelReq);
  const remaining = Math.max(0, nextLevelReq - totalExp);
  return {
    level,
    totalExp,
    currentLevelExp: Math.min(currentLevelExp, requiredForNext),
    requiredForNext,
    remaining,
    progressPct: clampNumber(currentLevelExp / requiredForNext, 0, 1),
    isMax: false,
  };
}

function getVipMilestoneBonuses(level = state.vip?.level || 0) {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.getVipMilestoneBonuses === "function") return runtime.getVipMilestoneBonuses(level);
  const capped = clampNumber(Math.floor(level || 0), 0, VIP_MAX_LEVEL);
  const bonuses = {};
  Object.entries(VIP_MILESTONE_BONUSES).forEach(([ml, bonus]) => {
    if (capped >= Number(ml)) Object.entries(bonus).forEach(([k, v]) => { if (k !== "label") bonuses[k] = (bonuses[k] || 0) + (Number(v) || 0); });
  });
  return bonuses;
}

function getUnlockedVipMilestones(level = state.vip?.level || 0) {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.getUnlockedVipMilestones === "function") return runtime.getUnlockedVipMilestones(level);
  const capped = clampNumber(Math.floor(level || 0), 0, VIP_MAX_LEVEL);
  return Object.entries(VIP_MILESTONE_BONUSES).filter(([ml]) => capped >= Number(ml)).map(([ml, b]) => ({ level: Number(ml), ...b }));
}

function getNextVipMilestone(level = state.vip?.level || 0) {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.getNextVipMilestone === "function") return runtime.getNextVipMilestone(level);
  const capped = clampNumber(Math.floor(level || 0), 0, VIP_MAX_LEVEL);
  const next = Object.entries(VIP_MILESTONE_BONUSES).find(([ml]) => capped < Number(ml));
  return next ? { level: Number(next[0]), ...next[1] } : null;
}

function getInventoryLimit() {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.getInventoryLimit === "function") return runtime.getInventoryLimit();
  return INVENTORY_LIMIT + (getVipMilestoneBonuses().inventoryLimitBonus || 0);
}

function claimVipDailyGift() {
  const runtime = window.RuneFrontierVipRuntime;
  if (runtime && typeof runtime.claimVipDailyGift === "function") return runtime.claimVipDailyGift();
  state.vip = normalizeVip(state.vip);
  if (state.vip.dailyGiftClaimed === todayKey()) { showToast("今日礼包已领取"); return; }
  let giftLevel = 0;
  [1,5,10,15,20].reverse().forEach((lv) => { if (state.vip.level >= lv && giftLevel === 0) giftLevel = lv; });
  const gift = VIP_DAILY_GIFT[giftLevel] || VIP_DAILY_GIFT[0];
  if (gift.materials) addMaterials(gift.materials);
  state.vip.dailyGiftClaimed = todayKey();
  addLog(`领取冒险者每日礼包（Lv.${giftLevel}）。`);
  showToast("每日礼包已领取");
  renderAll();
  save();
}

function showRareLootBroadcast(item) {
  if (!item || !(getVipMilestoneBonuses().rareLootBroadcast)) return;
  const rank = rarityRank(item.rarity || "normal");
  let prefix = "";
  if (item.setId) prefix = "【星座套装】";
  else if (rank >= rarityRank("mythic")) prefix = "【神话现世】";
  else if (rank >= rarityRank("darkGold")) prefix = "【暗金降临】";
  else if (rank >= rarityRank("legend")) prefix = "【传说现世】";
  else if (rank >= rarityRank("ancient")) prefix = "【远古遗物】";
  else if (rank >= rarityRank("epic")) prefix = "【稀有掉落】";
  else return;
  addLogHtml(`${prefix} 获得 ${renderItemName(item)}`);
}

function calculateFinalStats(character = {}) {
  return computeAttributes(character.equip || {});
}

function calculateBattleStats({ attrs, equip, passive, cardStats, job, level, jobLevel, setBonuses = {} }) {
  const growth = job.growth || {};
  const jobAtkPct = (growth.atkPct || 0) * jobLevel + passive.atkPct + cardStats.atkPct + (setBonuses.physicalAttackPct || 0) + (equip.atkPct || 0);
  const jobMatkPct = (growth.matkPct || 0) * jobLevel + passive.matkPct + cardStats.matkPct + (setBonuses.magicAttackPct || 0) + (equip.matkPct || 0);
  const jobHpPct = (growth.hpPct || 0) * jobLevel + passive.hpPct + cardStats.hpPct + (setBonuses.maxHpPct || 0) + (equip.hpPct || 0);
  const jobDefPct = (growth.defPct || 0) * jobLevel + passive.defPct + cardStats.defPct + (setBonuses.defensePct || 0) + (equip.defPct || 0);
  const jobAspdPct = (growth.aspdPct || 0) * jobLevel + passive.aspdPct + cardStats.aspdPct + (setBonuses.attackSpeedPct || 0) + (equip.attackSpeedPct || 0);
  const baseAttack = job.baseDps + level * 1.1 + jobLevel * 0.18;
  const baseMagic = job.baseDps + level * 0.78 + jobLevel * 0.16;
  const physicalAttack =
    (baseAttack + equip.atk + attrs.str * battleStatConfig.physical.str + attrs.dex * battleStatConfig.physical.dex) * (1 + jobAtkPct);
  const magicAttack =
    (baseMagic + equip.matk + attrs.int * battleStatConfig.magic.int + attrs.dex * battleStatConfig.magic.dex) * (1 + jobMatkPct);
  const attackSpeed = clampNumber(
    job.baseAspd * (1 + jobAspdPct) + attrs.agi * battleStatConfig.aspdPerAgi + equip.aspd,
    battleStatConfig.minAspd,
    battleStatConfig.maxAspd,
  );
  const maxHp = Math.round((job.baseHp + equip.hp + attrs.vit * battleStatConfig.hpPerVit + level * battleStatConfig.hpPerLevel + jobLevel * 10) * (1 + jobHpPct));
  const defense = Math.round((job.baseDef + equip.def + attrs.vit * battleStatConfig.defensePerVit) * (1 + jobDefPct));
  const hpRegen = Math.max(1, Math.round((battleStatConfig.hpRegenBase + (equip.hpRegen || 0) + attrs.vit * battleStatConfig.hpRegenPerVit + level * battleStatConfig.hpRegenPerLevel) * (1 + (equip.hpRegenPct || 0))));
  const rawCritRate = calculateRawCritRate({ equip, cardStats, passive, attrs }) + (setBonuses.critRatePct || 0) + (equip.critRatePct || 0);
  const critRate = clampNumber(rawCritRate, 0, PLAYER_CRIT_RATE_CAP);
  const dodgeRate = clampNumber(calculateDodgeRate({ attrs, level }) + (equip.dodgeRate || 0) + (equip.dodgeRatePct || 0), 0, battleStatConfig.maxDodge);
  const mainPower = Math.max(physicalAttack, magicAttack);
  const dps = mainPower * attackSpeed * COMBAT_PACE * (1 + passive.dpsPct + cardStats.dps + (setBonuses.powerPct || 0) + (equip.powerPct || 0) + (equip.combatPaceBonus || 0));
  return { physicalAttack, magicAttack, maxHp, defense, hpRegen, attackSpeed, dodgeRate, rawCritRate, critRate, dps };
}

function calculateDropBonus({ equip, cardStats, passive, attrs, vipBonuses }) {
  return Math.min(2, equip.drop + cardStats.drop + passive.dropPct + attrs.luk * battleStatConfig.dropPerLuk + (vipBonuses?.itemDrop || 0));
}

function calculateEquipmentDropBonus({ equip, cardStats, passive, attrs, vipBonuses }) {
  return Math.min(2, equip.drop + (equip.equipmentDrop || 0) + cardStats.drop + passive.dropPct + attrs.luk * battleStatConfig.dropPerLuk + (vipBonuses?.equipmentDrop || 0));
}

function calculateGoldBonus({ equip, cardStats, passive, vipBonuses }) {
  return equip.gold + cardStats.gold + passive.goldPct + (vipBonuses?.gold || 0);
}

function calculateCritRate({ equip, cardStats, passive, attrs }) {
  return clampNumber(calculateRawCritRate({ equip, cardStats, passive, attrs }), 0, PLAYER_CRIT_RATE_CAP);
}

function calculateRawCritRate({ equip, cardStats, passive, attrs }) {
  return Math.max(0, (equip.crit || 0) + (cardStats.crit || 0) + (passive.critPct || 0) + (attrs.dex || 0) * battleStatConfig.critPerDex + (attrs.luk || 0) * battleStatConfig.critPerLuk);
}

function calculateDodgeRate({ attrs, level }) {
  return clampNumber(attrs.agi * battleStatConfig.dodgePerAgi + level * battleStatConfig.dodgePerLevel, 0, battleStatConfig.maxDodge);
}

function calculateHpRegen(character = {}) {
  return Math.max(1, Math.round(battleStatConfig.hpRegenBase + (character.vit || 0) * battleStatConfig.hpRegenPerVit + (character.level || 1) * battleStatConfig.hpRegenPerLevel));
}

function syncHeroHp(stats, fillMissing = false) {
  const maxHp = Math.max(1, Math.round(stats.maxHp || stats.hp || state.hero.maxHp || 1));
  const hadHp = Number.isFinite(state.hero.currentHp);
  const wasFull = Number.isFinite(state.hero.maxHp) && state.hero.currentHp >= state.hero.maxHp;
  state.hero.maxHp = maxHp;
  if (!hadHp || fillMissing || wasFull) {
    state.hero.currentHp = maxHp;
  } else {
    state.hero.currentHp = clampNumber(state.hero.currentHp, 0, maxHp);
  }
}

function computeAttributes(equip = {}) {
  const job = currentJob();
  const base = state.hero.attributes || {};
  const rebirthBonus = (state.hero.rebirths || 0) * 3;
  const baseLevel = state.hero.baseLevel - 1;
  const jobGain = Math.floor((state.hero.jobLevel - 1) * 0.35);
  const growth = job.growth || {};
  const trainingPct = { ...defaultTrainingPct(), ...(state.hero.trainingPct || {}) };
  const baseGrowth = {
    str: 0.24 + (growth.str || 0.75) * 0.34,
    agi: 0.24 + (growth.agi || 0.75) * 0.34,
    vit: 0.24 + (growth.vit || 0.75) * 0.34,
    int: 0.24 + (growth.int || 0.75) * 0.34,
    dex: 0.24 + (growth.dex || 0.75) * 0.34,
    luk: 0.18 + (growth.luk || 0.55) * 0.28,
  };
  const raw = {
    str: (base.str || 5) + rebirthBonus + baseLevel * baseGrowth.str + jobGain * (growth.str || 0.75) + (equip.str || 0),
    agi: (base.agi || 5) + rebirthBonus + baseLevel * baseGrowth.agi + jobGain * (growth.agi || 0.75) + (equip.agi || 0),
    vit: (base.vit || 5) + rebirthBonus + baseLevel * baseGrowth.vit + jobGain * (growth.vit || 0.75) + (equip.vit || 0),
    int: (base.int || 5) + rebirthBonus + baseLevel * baseGrowth.int + jobGain * (growth.int || 0.75) + (equip.int || 0),
    dex: (base.dex || 5) + rebirthBonus + baseLevel * baseGrowth.dex + jobGain * (growth.dex || 0.75) + (equip.dex || 0),
    luk: (base.luk || 5) + rebirthBonus + baseLevel * baseGrowth.luk + jobGain * (growth.luk || 0.55) + (equip.luk || 0),
  };
  return {
    base: Object.fromEntries(attributeKeys.map((stat) => [stat, Math.round(raw[stat])])),
    final: Object.fromEntries(attributeKeys.map((stat) => [stat, Math.round(raw[stat] * (1 + (trainingPct[stat] || 0)))])),
    trainingPct,
  };
}

function computeSetBonuses() {
  const equippedItems = Object.values(state.equipped)
    .map((id) => state.inventory.find((item) => item.id === id))
    .filter(Boolean);
  const empty = {
    activeSets: [],
    activeSetStages: {},
    pieceCounts: {},
    monsterGoldPct: 0,
    baseExpPct: 0,
    jobExpPct: 0,
    materialQuantityPct: 0,
    physicalAttackPct: 0,
    magicAttackPct: 0,
    skillDamagePct: 0,
    normalAttackPct: 0,
    attackSpeedPct: 0,
    critRatePct: 0,
    critDamagePct: 0,
    bossDamagePct: 0,
    mutationDamagePct: 0,
    eliteDamagePct: 0,
    itemDropPct: 0,
    cardDropPct: 0,
    equipmentDropPct: 0,
    ignoreDefensePct: 0,
    maxHpPct: 0,
    damageReductionPct: 0,
    defensePct: 0,
    powerPct: 0,
    attrPct: 0,
    strPct: 0,
    agiPct: 0,
    vitPct: 0,
    intPct: 0,
    dexPct: 0,
    lukPct: 0,
    monsterAttackSpeedReductionPct: 0,
    abyssDamageBonus: 0,
    abyssDamageReduction: 0,
    abyssBossDamageBonus: 0,
    abyssMaterialDropBonus: 0,
    abyssSkillDamageBonus: 0,
    mythicWeightBonus: 0,
    abyssGoldPct: 0,
    abyssBaseExpPct: 0,
    abyssJobExpPct: 0,
    abyssCardDropBonus: 0,
    abyssItemDropBonus: 0,
    setPowerBonus: 0,
    abyssPieceCounts: {},
    abyssCollectionCounts: {},
    abyssActiveSetStages: {},
  };
  return Object.values(equipmentSets).reduce(
    (sum, set) => {
      const requiredIds = set.items.map((item) => item.id);
      const equippedTemplateIds = equippedItems.map((item) => item.templateId || item.id);
      const equippedPieces = requiredIds.filter((id) => equippedTemplateIds.includes(id)).length;
      const collection = isZodiacSetId(set.id) ? state.zodiacCollection?.[set.id] : null;
      const collectedIds = Array.isArray(collection?.collectedPieceIds) ? collection.collectedPieceIds : [];
      const abyssCollectedIds = Array.isArray(collection?.abyssCollectedPieceIds) ? collection.abyssCollectedPieceIds : [];
      const collectedPieces = requiredIds.filter((id) => collectedIds.includes(id)).length;
      const abyssEquippedPieces = equippedItems.filter((item) => item.setId === set.id && isAbyssEquipment(item)).length;
      const abyssCollectedPieces = requiredIds.filter((id) => abyssCollectedIds.includes(id)).length;
      const pieces = Math.max(equippedPieces, collectedPieces);
      const abyssPieces = Math.max(abyssEquippedPieces, abyssCollectedPieces);
      const stages = set.effects?.pieces && Object.keys(set.effects.pieces).length ? set.effects.pieces : { [requiredIds.length]: set.effects?.full || {} };
      Object.entries(stages).forEach(([stage, effects]) => {
        const need = Number(stage);
        if (!need || pieces < need) return;
        sum.activeSetStages[set.id] = sum.activeSetStages[set.id] || [];
        sum.activeSetStages[set.id].push(need);
        if (need >= requiredIds.length && !sum.activeSets.includes(set.id)) sum.activeSets.push(set.id);
        addEffectNumbers(sum, effects);
      });
      Object.entries(ABYSS_SET_STAGES).forEach(([stage, effects]) => {
        const need = Number(stage);
        if (!need || abyssPieces < need) return;
        sum.abyssActiveSetStages[set.id] = sum.abyssActiveSetStages[set.id] || [];
        sum.abyssActiveSetStages[set.id].push(need);
        addEffectNumbers(sum, effects);
      });
      if (abyssPieces >= requiredIds.length) addEffectNumbers(sum, ABYSS_ZODIAC_SET_EFFECTS[set.id] || {});
      sum.pieceCounts[set.id] = pieces;
      sum.abyssPieceCounts[set.id] = abyssPieces;
      sum.abyssCollectionCounts[set.id] = abyssCollectedPieces;
      return sum;
    },
    empty,
  );
}

function addEffectNumbers(target, effects = {}) {
  Object.entries(effects || {}).forEach(([key, value]) => {
    if (typeof value === "number") target[key] = (target[key] || 0) + value;
  });
}

function calculatePower({ attrs, equip, battleStats, setBonuses }) {
  const equippedItems = Object.values(state.equipped)
    .map((id) => state.inventory.find((item) => item.id === id))
    .filter(Boolean);
  const refinePower = equippedItems.reduce((sum, item) => sum + (item.refine || 0) * 18 + (item.empower || 0) * 22, 0);
  const rarityPower = equippedItems.reduce((sum, item) => sum + (rarityOrder.indexOf(item.rarity) + 1) * 14 + (item.level || 1) * 3, 0);
  const setPower = (setBonuses?.activeSets?.length || 0) * 120;
  const enhancePower = equippedItems.reduce((sum, item) => sum + (item.enhanceLevel || 0) * 35 + ((item.specialPassives || []).length ? 80 : 0), 0);
  return Math.round(
    (attrs.str * 1.2 +
      attrs.agi * 1.1 +
      attrs.vit * 1.3 +
      attrs.int * 1.2 +
      attrs.dex * 1.1 +
      attrs.luk * 0.8 +
      equip.atk * 1.5 +
      equip.matk * 1.3 +
      equip.def * 1.2 +
      battleStats.physicalAttack * 0.65 +
      battleStats.magicAttack * 0.58 +
      battleStats.maxHp * 0.08 +
      battleStats.defense * 1.1 +
      battleStats.hpRegen * 2.5 +
      battleStats.attackSpeed * 140 +
      battleStats.critRate * 180 +
      battleStats.dodgeRate * 160 +
      (equip.hpPct || 0) * 450 +
      (equip.defPct || 0) * 420 +
      (equip.damageReductionPct || 0) * 900 +
      (equip.critDamageBonus || 0) * 260 +
      (equip.ignoreDefense || 0) * 320 +
      (equip.skillDamageBonus || 0) * 320 +
      (equip.monsterDamageBonus || 0) * 300 +
      (equip.bossDamageBonus || 0) * 260 +
      (equip.echoChance || 0) * 220 +
      (equip.thornVitMultiplier || 0) * 55 +
      (equip.hpRegenPct || 0) * 180 +
      (equip.baseExpBonus || 0) * 45 +
      (equip.jobExpBonus || 0) * 45 +
      refinePower +
      rarityPower +
      setPower +
      enhancePower) *
      (1 + (setBonuses?.powerPct || 0) + (equip.powerPct || 0)),
  );
}

function renderSetTalentStatus() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSetTalentStatus === "function") return runtime.renderSetTalentStatus();
  const bonuses = computeSetBonuses();
  const chips = Object.values(equipmentSets)
    .filter((set) => (bonuses.pieceCounts[set.id] || 0) > 0)
    .map((set) => {
      const pieces = bonuses.pieceCounts[set.id] || 0;
      const stages = set.effects?.pieces && Object.keys(set.effects.pieces).length ? set.effects.pieces : { [set.items.length]: set.effects?.full || {} };
      const stageText = Object.entries(stages)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([stage, effects]) => {
          const active = pieces >= Number(stage);
          return `${stage}件${active ? "已激活" : "未激活"}：${escapeHtml(describeZodiacEffects(effects) || set.talentDescription || "")}`;
        })
        .join("；");
      const hasActive = Object.entries(stages).some(([stage]) => pieces >= Number(stage));
      return `<span class="set-talent-chip ${hasActive ? "active" : "inactive"}" title="${escapeAttr(stageText)}">${escapeHtml(set.name)} ${pieces}/${set.items.length}${hasActive ? " ✓" : ""}</span>`;
    });
  if (!chips.length) return "";
  return `<details class="set-talent-details"><summary>套装效果（${chips.length} 套已穿戴）<button class="ghost set-talent-all-btn" type="button" onclick="event.stopPropagation();this.closest('details').querySelector('.set-talent-all').classList.toggle('hidden')">查看全套装</button></summary><div class="set-talent-chips">${chips.join("")}</div><div class="set-talent-all hidden">${Object.values(equipmentSets).map((set) => { const p = bonuses.pieceCounts[set.id]||0; return `<p>${escapeHtml(set.name)} (${p}/${set.items.length})</p>`; }).join("")}</div></details>`;
}

function createEmptyCardBonusStats() {
  return { atkPct: 0, matkPct: 0, hpPct: 0, defPct: 0, aspdPct: 0, dps: 0, gold: 0, crit: 0, drop: 0, monsterDamage: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 };
}

function isBossSocketCard(card = {}) {
  return getCardType(card) === "boss" || Boolean(card.bossOnly);
}

function computeOwnedCardBonuses() {
  const totals = createEmptyCardBonusStats();
  Object.entries(state.cards || {}).forEach(([id, count]) => {
    if ((Number(count) || 0) <= 0) return;
    const card = cardPool.find((entry) => entry.id === id);
    if (!card || isBossSocketCard(card)) return;
    Object.entries(getSocketCardEffects(card)).forEach(([stat, value]) => {
      if (stat === "monsterDamageBonus") totals.monsterDamage += Number(value || 0);
      else if (stat === "attackSpeedPct") totals.aspdPct += Number(value || 0);
      else if (stat === "aspdPct") return;
      else if (stat in totals) totals[stat] += Number(value || 0);
    });
    totals.dps += card.dps || 0;
  });
  return totals;
}

function getCardStats() {
  const totals = computeOwnedCardBonuses();
  Object.entries(state.awakenedCards || {}).forEach(([id, count]) => {
    const card = cardPool.find((entry) => entry.id === id);
    if (!card || isBossSocketCard(card) || count <= 0) return;
    const effect = awakenedCardEffects(card);
    attributeKeys.forEach((stat) => {
      totals[stat] += effect.attr * count;
    });
    totals.drop += effect.drop * count;
    totals.monsterDamage += effect.monsterDamage * count;
  });
  Object.entries(state.cardCodex || {}).forEach(([id, data]) => {
    const level = getCardResearchLevel(data.obtainCount || 0);
    if (level <= 0) return;
    const card = cardPool.find((entry) => entry.id === id);
    if (!card || isBossSocketCard(card)) return;
    const type = getCardType(card);
    const bonuses = CODEX_RESEARCH_BONUSES[type] || CODEX_RESEARCH_BONUSES.normal;
    for (let i = 0; i < level; i += 1) {
      const b = bonuses[i] || {};
      Object.entries(b).forEach(([key, val]) => {
        if (attributeKeys.includes(key)) totals[key] = (totals[key] || 0) + (val || 0);
        else if (key === "hpPct") totals.hpPct = (totals.hpPct || 0) + (val || 0);
        else if (key === "bossDamage") totals.bossDamage = (totals.bossDamage || 0) + (val || 0);
        else if (key === "abyssDamage") totals.abyssDamage = (totals.abyssDamage || 0) + (val || 0);
        else if (key === "abyssDamageReduction") totals.abyssDamageReduction = (totals.abyssDamageReduction || 0) + (val || 0);
        else if (key === "bossQualityWeight") totals.bossQualityWeight = (totals.bossQualityWeight || 0) + (val || 0);
        else if (key === "mythicQualityWeight") totals.mythicQualityWeight = (totals.mythicQualityWeight || 0) + (val || 0);
        else if (key === "allStats") attributeKeys.forEach((stat) => { totals[stat] = (totals[stat] || 0) + (val || 0); });
        else if (key === "drop") totals.drop = (totals.drop || 0) + (val || 0);
        else if (key === "gold") totals.gold = (totals.gold || 0) + (val || 0);
      });
    }
  });
  return totals;
}

function renderAll() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderAll === "function") return runtime.renderAll();
  const stats = computeStats();
  els.mapName.textContent = currentMap().name;
  els.goldValue.textContent = formatNumber(state.gold);
  els.teamLevelValue.textContent = state.hero.baseLevel;
  els.expValue.textContent = `B ${formatNumber(state.hero.baseExp)}/${formatNumber(baseExpCost())} · J ${formatNumber(state.hero.jobExp)}/${formatNumber(jobExpCost())}`;
  els.powerValue.textContent = formatNumber(stats.power);
  els.gpsValue.textContent = `${formatNumber(estimateGoldPerSecond())}/秒`;
  els.pauseIcon.textContent = state.paused ? "▶" : "Ⅱ";
  els.saveState.textContent = "已同步";

  renderPages();
  renderFormation();
  renderHeroes();
  renderTown();
  renderSmithyPage();
  renderEquipment();
  renderMaps();
  renderCards();
  renderCodex();
  renderShop();
  renderVip();
  renderTasks();
  renderQuestList();
  renderPartyList();
  renderLog();
  renderFast();
}

function renderPages() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderPages === "function") return runtime.renderPages();
  document.querySelectorAll(".page-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === activePage);
  });
  document.querySelectorAll(".page-view").forEach((view) => {
    view.classList.toggle("active", view.dataset.view === activePage);
  });
}

let combatSidebarLastRender = 0;
let autoSalvageBatchCount = 0;
let autoSalvageBatchMaterials = {};
let autoSalvageBatchLastFlush = 0;

function renderCombatSidebar() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCombatSidebar === "function") return runtime.renderCombatSidebar();
  if (!els.combatSidebar) return;
  const now = Date.now();
  if (now - combatSidebarLastRender < 2000) return;
  combatSidebarLastRender = now;
  const mats = ["dust", "ore", "crystal", "rune", "oridecon", "elunium"];
  const matRows = mats.map((id) => {
    const qty = formatNumber(state.materials[id] || 0);
    const matRarity = (MATERIAL_DB[id] && MATERIAL_DB[id].rarity) || "normal";
    return `<span class="combat-mat-row loot-rarity-${matRarity}"><strong>${escapeHtml(materialNames[id] || id)}</strong>×${qty}</span>`;
  }).join("");
  const lootRows = renderCombatLootFeed();
  els.combatSidebar.innerHTML = `
    ${renderEncounterPanel()}
    <div class="combat-sidebar-section">
      <small class="combat-sidebar-title">核心材料</small>
      <div class="combat-mat-grid">${matRows}</div>
    </div>
    <div class="combat-sidebar-section">
      <small class="combat-sidebar-title">掉落播报</small>
      <div class="combat-loot-feed">${lootRows || "<span class='combat-loot-empty'>暂无掉落</span>"}</div>
    </div>
  `;
}

function renderCombatLootFeed() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderCombatLootFeed === "function") return runtime.renderCombatLootFeed();
  const rows = buildLootFeedFromRecentLoot()
    .sort((a, b) => b.time - a.time || lootFeedRank(b) - lootFeedRank(a))
    .slice(0, 7)
    .map(renderCombatLootRow)
    .join("");
  return rows || "<span class='combat-loot-empty'>暂无掉落</span>";
}

function buildLootFeedFromRecentLoot() {
  const rows = [];
  normalizeRecentLoot(state.recentLoot).forEach((entry) => {
    const rewards = normalizeOfflineRewards(entry.rewards || entry);
    rewards.equipments.forEach((item) => rows.push({
      name: getDisplayItemName(item) || item.name || "装备",
      rarity: item.rarity || "normal",
      qty: 1,
      source: entry.source || "",
      kind: item.setId ? "set" : "equipment",
      time: entry.time,
    }));
    rewards.cards.forEach((card) => rows.push({
      name: card.name || card.cardId || "卡片",
      rarity: card.rarity || "rare",
      qty: card.qty || 1,
      source: entry.source || "",
      kind: "card",
      time: entry.time,
    }));
    rewards.materials.forEach((material) => rows.push({
      name: materialNames[material.materialId] || material.name || material.materialId || "材料",
      rarity: MATERIAL_DB[material.materialId]?.rarity || material.rarity || "normal",
      qty: material.qty || 1,
      source: entry.source || "",
      kind: "material",
      time: entry.time,
    }));
  });
  return rows;
}

function renderCombatLootRow(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCombatLootRow === "function") return runtime.renderCombatLootRow(item);
  const meta = lootSourceMeta(item.source);
  const kind = lootKindMeta(item.kind);
  const isNew = Date.now() - Number(item.time || 0) < 5000;
  return `<span class="combat-loot-row loot-rarity-${item.rarity || "normal"} ${isNew ? "loot-new" : ""} ${lootFeedRank(item) >= 60 ? "loot-important" : ""}">
    <small class="loot-src-tag ${meta.className}">${meta.label}</small>
    <small class="loot-kind-tag">${kind}</small>
    <span class="loot-row-name">+ ${escapeHtml(item.name || "战利品")}</span>
    ${Number(item.qty || 1) > 1 ? `<strong class="loot-row-qty">×${formatNumber(item.qty)}</strong>` : ""}
  </span>`;
}

function lootSourceMeta(source = "") {
  if (source.includes("深渊")) return { label: "深渊", className: "loot-source-abyss" };
  if (source.includes("Boss") || source.includes("首领")) return { label: "Boss", className: "loot-source-boss" };
  if (source.includes("变异")) return { label: "变异", className: "loot-source-mutation" };
  if (source.includes("自动分解")) return { label: "分解", className: "loot-source-salvage" };
  if (source.includes("离线")) return { label: "离线", className: "loot-source-offline" };
  return { label: "掉落", className: "loot-source-normal" };
}

function lootKindMeta(kind = "") {
  if (kind === "set") return "套装";
  if (kind === "equipment") return "装备";
  if (kind === "card") return "卡片";
  if (kind === "salvage") return "回收";
  return "材料";
}

function lootFeedRank(item) {
  const rarityScore = { mythic: 100, darkGold: 92, legend: 84, ancient: 72, epic: 62, rare: 45, fine: 25, normal: 10 }[item.rarity] || 10;
  const kindScore = item.kind === "set" ? 15 : item.kind === "equipment" ? 10 : item.kind === "card" ? 8 : 0;
  return rarityScore + kindScore;
}

function renderEncounterPanel() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderEncounterPanel === "function") return runtime.renderEncounterPanel();
  const group = normalizeEnemyGroup(state.enemyGroup);
  if (!group || !group.monsters.length) return "";
  const living = group.monsters.filter((monster) => monster.alive).length;
  const rows = group.monsters.map((monster, index) => {
    const maxHp = Math.max(1, Number(monster.maxHp || 1));
    const currentHp = Math.max(0, Number(monster.currentHp ?? maxHp));
    const ratio = Math.max(0, Math.min(1, currentHp / maxHp));
    const active = index === group.activeIndex && monster.alive;
    const tags = [
      monster.difficulty === "abyss" ? "深渊" : "",
      monster.mutation ? "变异" : "",
      monster.type === "elite" ? "精英" : "",
      monster.type === "boss" || state.enemyBoss ? "Boss" : "",
    ].filter(Boolean);
    return `<div class="encounter-row ${active ? "is-active" : ""} ${monster.alive ? "" : "is-dead"}">
      <span class="encounter-index">${active ? "▶" : index + 1}</span>
      <span class="encounter-name">${escapeHtml(monster.name || "魔物")}</span>
      ${tags.length ? `<span class="encounter-tag">${tags[0]}</span>` : ""}
      <div class="encounter-mini-hp"><div style="width:${ratio * 100}%"></div></div>
      <span class="encounter-hp-text">${monster.alive ? `${Math.round(ratio * 100)}%` : "已击败"}</span>
    </div>`;
  }).join("");
  return `<div class="combat-sidebar-section encounter-panel">
    <small class="combat-sidebar-title">${escapeHtml(group.label || "遭遇战")} · 存活 ${living}/${group.monsters.length}</small>
    <div class="encounter-list">${rows}</div>
  </div>`;
}

function renderFast() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderFast === "function") return runtime.renderFast();
  const stats = computeStats();
  updateActiveEnemyHpInGroup();
  renderCombatSidebar();
  if (state.vip) {
    state.vip.onlineSecondsToday = (state.vip.onlineSecondsToday || 0) + (loopDt || 0.1);
    if (state.vip.onlineSecondsToday >= 1800 && state.vip.onlineRewardClaimed !== todayKey()) {
      gainVipExp(30);
      state.vip.onlineRewardClaimed = todayKey();
      addLog("在线满 30 分钟，获得冒险者荣誉经验 +30。");
    }
  }
  if (autoSalvageBatchCount > 0 && Date.now() - autoSalvageBatchLastFlush > 30000) {
    addLog(`自动分解 ${autoSalvageBatchCount} 件装备，获得：${materialText(autoSalvageBatchMaterials)}`);
    autoSalvageBatchCount = 0;
    autoSalvageBatchMaterials = {};
    autoSalvageBatchLastFlush = Date.now();
  }
  els.goldValue.textContent = formatNumber(state.gold);
  els.teamLevelValue.textContent = state.hero.baseLevel;
  els.powerValue.textContent = formatNumber(stats.power);
  els.gpsValue.textContent = `${formatNumber(estimateGoldPerSecond())}/秒`;

  const enemyCurrentHp = Math.max(0, Number(state.enemyHp) || 0);
  const enemyMaxHp = Math.max(1, Number(state.enemyMaxHp) || 1);
  const ratio = Math.max(0, Math.min(1, enemyCurrentHp / enemyMaxHp));
  const monster = currentMonsterStats();
  if (els.enemyName) els.enemyName.textContent = `${monster.name} Lv.${monster.level}`;
  if (els.enemyHpText) els.enemyHpText.textContent = `${formatNumber(Math.ceil(enemyCurrentHp))}/${formatNumber(enemyMaxHp)}`;
  if (els.enemyHpBar) els.enemyHpBar.style.width = `${ratio * 100}%`;
  const playerCurrentHp = Math.max(0, Number(state.hero.currentHp) || 0);
  const playerMaxHp = Math.max(1, Number(stats.maxHp) || 1);
  const hpRatio = Math.max(0, Math.min(1, playerCurrentHp / playerMaxHp));
  if (els.playerHpName) els.playerHpName.textContent = state.hero.currentHp <= 0 ? `${state.hero.name} · 战斗停止` : state.hero.name;
  if (els.playerHpText) els.playerHpText.textContent = `${formatNumber(playerCurrentHp)}/${formatNumber(playerMaxHp)}`;
  if (els.playerHpBar) {
    els.playerHpBar.style.width = `${hpRatio * 100}%`;
    els.playerHpBar.classList.toggle("danger", hpRatio < 0.3);
  }
  if (els.playerHpRegen) els.playerHpRegen.textContent = `每 ${HP_REGEN_INTERVAL} 秒恢复 ${formatNumber(stats.hpRegen)} HP`;
  els.bossButton.disabled = state.enemyBoss || !isBossChallengeReady();
  if (els.autoBossToggle) {
    els.autoBossToggle.checked = getAutoBossEnabled();
    const line = els.autoBossToggle.closest(".toggle-line");
    if (line) {
      const text = ` 自动挑战BOSS：${getAutoBossStatusText(stats)}`;
      [...line.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).forEach((node) => {
        node.textContent = text;
      });
      line.classList.toggle("is-on", getAutoBossEnabled());
    }
  }

  const pending = getPendingOfflineRewards();
  const hasPendingEquipment = Boolean(pending?.equipments?.length);
  const hasPending = hasPendingOfflineRewards();
  const hasViewLoot = Boolean(getLootRewardsForView());
  els.claimButton.disabled = !hasViewLoot;
  els.claimButton.textContent = hasPending ? "查看离线收益" : hasViewLoot ? "查看最近战利品" : "暂无离线收益";
  if (els.offlineEntry) els.offlineEntry.classList.toggle("hidden", !hasViewLoot);
  if (els.offlineEntryTitle) els.offlineEntryTitle.textContent = hasPending ? "离线收益待领取" : hasViewLoot ? "最近战利品" : "暂无离线收益";
  if (els.offlineEntryMeta) {
    els.offlineEntryMeta.textContent = hasPending
      ? `离线 ${formatDuration(pending.seconds)} · 击败 ${formatNumber(pending.killCount || 0)} 只怪物`
      : hasViewLoot ? (state.lootNotifyUnread ? "有新的战利品可查看。" : "最近一次战利品可查看。") : "战利品会在这里展示。";
  }
  if (els.offlineViewButton) els.offlineViewButton.disabled = !hasViewLoot;
  if (Date.now() - sessionStatsLastRenderAt > 5000) {
    sessionStatsLastRenderAt = Date.now();
    renderPartyList();
  }
  renderOfflineRewardModal();
  renderRefineResultModal();
}

function renderFormation() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderFormation === "function") return runtime.renderFormation();
  ["front", "mid", "back"].forEach((slot) => {
    const button = document.querySelector(`.slot[data-slot="${slot}"]`);
    button.classList.toggle("active", selectedSlot === slot);
    els[`${slot}Hero`].textContent = slot === "front" ? currentJob().name : "未开放";
  });
}

function formatCritRateSummary(stats = {}) {
  const raw = Math.max(0, Number(stats.rawCritRate ?? stats.critRate ?? 0));
  const finalRate = Math.min(PLAYER_CRIT_RATE_CAP, Math.max(0, Number(stats.critRate ?? raw)));
  if (raw > PLAYER_CRIT_RATE_CAP + 0.0001) return `暴击率 ${percent(finalRate)}（原始 ${percent(raw)}，已达上限）`;
  return `暴击率 ${percent(finalRate)} / 上限 ${percent(PLAYER_CRIT_RATE_CAP)}`;
}

function statLine(label, value, statKey = "", options = {}) {
  const numeric = Number(value || 0);
  if (!options.showZero && !numeric) return "";
  const display = options.percent
    ? percent(numeric)
    : options.decimals !== undefined
      ? numeric.toFixed(options.decimals)
      : statKey
        ? formatStatValue(statKey, numeric).replace(/^\+/, "")
        : formatNumber(Math.round(numeric));
  const note = options.note ? `<small>${escapeHtml(options.note)}</small>` : "";
  return `<span>${escapeHtml(label)} <strong>${display}</strong>${note}</span>`;
}

function renderStatGroup(title, rows) {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderStatGroup === "function") return runtime.renderStatGroup(title, rows);
  const content = rows.filter(Boolean).join("");
  if (!content) return "";
  return `<section class="hero-stat-section"><strong>${escapeHtml(title)}</strong><div class="stat-grid">${content}</div></section>`;
}

function renderCharacterStatSections(stats = computeStats()) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCharacterStatSections === "function") return runtime.renderCharacterStatSections(stats);
  const attrs = stats.attrs || {};
  return `<div class="character-stat-panels">
    ${renderStatGroup("基础属性", [
      statLine("BASE等级", state.hero.baseLevel, "", { showZero: true }),
      statLine("JOB等级", state.hero.jobLevel, "", { showZero: true }),
      statLine("转生次数", state.hero.rebirths || 0, "", { showZero: true }),
      statLine("生命", stats.maxHp, "", { showZero: true }),
      statLine("攻击", stats.physicalAttack || stats.atkPower, "", { showZero: true }),
      statLine("魔法攻击", stats.magicAttack || stats.matkPower, "", { showZero: true }),
      statLine("防御", stats.defense, "", { showZero: true }),
      ...attributeKeys.map((stat) => statLine(stat.toUpperCase(), attrs[stat], "", { showZero: true })),
    ])}
    ${renderStatGroup("战斗属性", [
      `<span>${formatCritRateSummary(stats)}<small>造成暴击的概率，玩家最高生效 100%。</small></span>`,
      statLine("暴击伤害", stats.critDamage || (1.85 + (stats.critDamageBonus || 0)), "", { percent: true, showZero: true, note: "目前无硬上限" }),
      statLine("攻速", stats.attackSpeed || stats.aspd, "", { showZero: true, decimals: 2 }),
      statLine("命中", stats.hitRate, "hitRate"),
      statLine("闪避", stats.dodgeRate, "", { percent: true }),
      statLine("吸血", stats.lifeSteal, "lifeSteal"),
      statLine("伤害减免", stats.damageReductionPct, "damageReductionPct"),
      statLine("最终伤害", stats.finalDamageBonus, "finalDamageBonus"),
    ])}
    ${renderStatGroup("Boss / 深渊属性", [
      statLine("Boss伤害", stats.bossDamageBonus, "bossDamageBonus"),
      statLine("Boss减伤", stats.bossDamageReduction, "bossDamageReduction"),
      statLine("精英/首领伤害", stats.eliteDamageBonus, "eliteDamageBonus"),
      statLine("深渊伤害", stats.abyssDamageBonus, "abyssDamageBonus"),
      statLine("深渊减伤", stats.abyssDamageReduction, "abyssDamageReduction", { note: "深渊相关战斗生效" }),
      statLine("深渊材料掉率", stats.abyssMaterialDropBonus, "abyssMaterialDropBonus"),
      statLine("神话品质权重", stats.mythicWeightBonus, "mythicWeightBonus", { note: "权重，不是直接掉率" }),
    ])}
    ${renderStatGroup("收益属性", [
      statLine("金币收益", (stats.goldMultiplier || 1) - 1, "goldBonus"),
      statLine("BASE经验", (stats.baseExpMultiplier || 1) - 1, "baseExpBonus"),
      statLine("JOB经验", (stats.jobExpMultiplier || 1) - 1, "jobExpBonus"),
      statLine("材料/普通掉落率", stats.dropBonus, "dropBonus", { note: "不等于高品质直接掉率" }),
      statLine("装备掉率", stats.equipmentDropBonus, "equipmentDrop"),
      statLine("卡片掉率", stats.cardDropBonus, "cardDrop"),
      statLine("稀有品质权重", stats.rareDropBonus, "rareDropBonus", { note: "影响品质倾向" }),
    ])}
    <p class="slot-meta">属性计算说明：装备详情显示单件装备自身属性；角色页面显示基础、职业成长、装备、精炼、星炼、卡片、套装、图鉴、称号、VIP/冒险者荣誉、深渊词条等来源汇总后的最终生效属性。百分比属性通常在最终计算时生效，不会直接写入装备原始数值。</p>
  </div>`;
}

function getCharacterStatBreakdown(stats = computeStats()) {
  const equip = computeEquipmentFullStats();
  const cardStats = getCardStats();
  const titleEffects = getTitleEffects();
  const vipBonuses = stats.vipBonuses || getVipBonuses();
  const exploration = stats.explorationBonuses || getMapExplorationBonuses(currentMap().id);
  const setBonuses = stats.setBonuses || {};
  const codex = getCodexBonusStats();
  return {
    final: {
      atk: stats.physicalAttack || stats.atkPower || 0,
      matk: stats.magicAttack || stats.matkPower || 0,
      def: stats.defense || 0,
      hp: stats.maxHp || 0,
      critRate: stats.critRate || 0,
      rawCritRate: stats.rawCritRate || stats.critRate || 0,
      critDamage: stats.critDamage || 1.85 + (stats.critDamageBonus || 0),
      lifeSteal: stats.lifeSteal || 0,
      damageReduction: stats.damageReductionPct || 0,
      bossDamage: stats.bossDamageBonus || 0,
      abyssDamage: stats.abyssDamageBonus || 0,
      abyssReduction: stats.abyssDamageReduction || 0,
    },
    sources: {
      "基础/职业": { atk: state.hero.baseLevel * 2, hp: state.hero.baseLevel * 10, def: currentJob().baseDef || 0 },
      装备: { atk: equip.atk || 0, matk: equip.matk || 0, def: equip.def || 0, hp: equip.hp || 0, critRate: (equip.crit || 0) + (equip.critRatePct || 0), critDamage: equip.critDamageBonus || 0, bossDamage: equip.bossDamageBonus || 0, abyssDamage: equip.abyssDamageBonus || 0 },
      星炼: estimateRefineSourceStats(),
      卡片: { atk: cardStats.atk || 0, matk: cardStats.matk || 0, hp: cardStats.hp || 0, critRate: cardStats.crit || 0, bossDamage: cardStats.bossDamageBonus || 0 },
      套装: { critRate: setBonuses.critRatePct || 0, critDamage: setBonuses.critDamagePct || 0, bossDamage: setBonuses.bossDamagePct || 0, abyssDamage: setBonuses.abyssDamageBonus || 0, abyssReduction: setBonuses.abyssDamageReduction || 0 },
      图鉴: { hp: codex.hpBonus || 0, def: codex.defBonus || 0, bossDamage: codex.bossDamage || 0, abyssDamage: codex.abyssDamage || 0 },
      称号: titleEffects,
      "VIP/冒险者荣誉": { gold: vipBonuses.gold || 0, drop: vipBonuses.itemDrop || 0, equipmentDrop: vipBonuses.equipmentDrop || 0 },
      探索: { gold: exploration.goldBonus || 0, exp: exploration.expBonus || 0, drop: exploration.itemDropBonus || 0, equipmentDrop: exploration.equipmentDropBonus || 0, bossDamage: exploration.bossDamageBonus || 0 },
      其他加成: { finalDamage: stats.finalDamageBonus || 0, rareDrop: stats.rareDropBonus || 0, mythicWeight: stats.mythicWeightBonus || 0 },
    },
  };
}

function estimateRefineSourceStats() {
  return Object.values(state.equipped || {}).reduce((sum, id) => {
    const item = state.inventory.find((entry) => entry.id === id);
    if (!item) return sum;
    const growth = getRefineGrowthStats(item);
    Object.entries(growth || {}).forEach(([stat, value]) => {
      sum[stat] = (sum[stat] || 0) + Number(value || 0);
    });
    return sum;
  }, {});
}

function renderCharacterStatBreakdown(stats = computeStats()) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCharacterStatBreakdown === "function") return runtime.renderCharacterStatBreakdown(stats);
  const breakdown = getCharacterStatBreakdown(stats);
  const rows = Object.entries(breakdown.sources || {}).map(([source, values]) => {
    const text = Object.entries(values || {})
      .map(([stat, value]) => {
        const numeric = Number(value || 0);
        if (!numeric) return "";
        return `${statLabelName(stat)} ${formatStatValue(stat, numeric)}`;
      })
      .filter(Boolean)
      .slice(0, 5)
      .join(" · ");
    return text ? `<div class="power-source-row"><span>${escapeHtml(source)}</span><strong>${escapeHtml(text)}</strong></div>` : "";
  }).filter(Boolean).join("");
  return `<section class="power-source-panel">
    <div class="power-source-title">关键属性来源 <small>透明化估算</small></div>
    <div class="power-source-list">${rows || `<div class="power-source-row"><span>暂无明显来源</span><strong>继续获取装备和卡片</strong></div>`}</div>
  </section>`;
}

function renderHeroes() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderHeroes === "function") return runtime.renderHeroes();
  const stats = computeStats();
  const job = currentJob();
  const nextSkill = getNextJobSkill();
  const jobProgress = Math.min(1, state.hero.jobExp / jobExpCost()) * 100;
  const attrs = stats.attrs;
  const atBaseCap = state.hero.baseLevel >= maxBaseLevel();
  const prestige = normalizeRebirthPrestige(state.rebirthPrestige, state.hero.rebirths || 0);
  const prestigeBonus = getRebirthPrestigeBonuses();
  const ratingScores = calculatePlayerRatingScores(stats);
  els.heroList.innerHTML = `
    <article class="hero-card">
      <div class="hero-portrait" style="background-image:${imageBackgroundList(classImageCandidates(job.id))}">
        <div class="avatar ${job.id}" aria-hidden="true"></div>
      </div>
      <div class="hero-info">
        <div class="hero-title">
          <strong>${state.hero.name} · ${job.name} ${!state.hero.renameUsed ? `<button class="rename-icon" type="button" data-rename-hero title="修改名字">&#9998;</button>` : ""}</strong>
          <span>BASE ${state.hero.baseLevel}/${maxBaseLevel()} / JOB ${state.hero.jobLevel} / 转生 ${state.hero.rebirths || 0}</span>
        </div>
        <div class="hero-stats">
          <span>战力 ${formatNumber(stats.power)}</span>
          <span>输出 ${formatNumber(stats.dps)}</span>
          <span>生命 ${formatNumber(state.hero.currentHp || 0)}/${formatNumber(stats.maxHp)}</span>
          <span>防御 ${formatNumber(stats.defense)}</span>
        </div>
        <div class="stat-grid">
          <span>攻速 ${stats.aspd.toFixed(2)}</span>
          <span>物攻 ${formatNumber(stats.atkPower)}</span>
          <span>魔攻 ${formatNumber(stats.matkPower)}</span>
          <span>生命恢复 每 ${HP_REGEN_INTERVAL} 秒 +${formatNumber(stats.hpRegen)}</span>
          <span>闪避 ${percent(stats.dodgeRate)}</span>
          <span>${formatCritRateSummary(stats)}</span>
          <span>暴击伤害 ${percent(stats.critDamage || (1.85 + (stats.critDamageBonus || 0)))}</span>
          <span>${nextSkill ? `下个 Job ${nextSkill.level}` : "技能完成"}</span>
        </div>
        <div class="hero-stat-section">
          <strong>核心评分</strong>
          <div class="stat-grid">
            <span>综合 ${formatNumber(stats.power)}</span>
            <span>输出 ${formatNumber(ratingScores.output)}</span>
            <span>生存 ${formatNumber(ratingScores.survival)}</span>
            <span>Boss ${formatNumber(ratingScores.boss)}</span>
            <span>深渊 ${formatNumber(ratingScores.abyss)}</span>
            <span>打宝 ${formatNumber(ratingScores.treasure || 0)}</span>
          </div>
        </div>
        <div class="attribute-grid">
          ${attributeKeys.map((stat) => `<span>${stat.toUpperCase()} ${attrs[stat]} (${stats.baseAttrs[stat] || 0} +${attrs[stat] - (stats.baseAttrs[stat] || 0)})<small>训练 ${formatStatValue(`${stat}Pct`, stats.trainingPct[stat] || 0)}</small></span>`).join("")}
        </div>
        <div class="hero-actions-inline">
          <button type="button" data-upgrade="base" ${atBaseCap ? "disabled" : ""}>训练 ${formatNumber(heroTrainCost())}</button>
          <button type="button" data-batch-upgrade="base" ${atBaseCap ? "disabled" : ""}>批量训练</button>
          <button class="ghost" type="button" data-rebirth ${atBaseCap ? "" : "disabled"}>转生</button>
        </div>
        <details class="hero-details">
          <summary>属性来源 · 套装 · 称号 · 技能</summary>
          ${renderCharacterStatSections(stats)}
          ${renderCharacterStatBreakdown(stats)}
          <div class="set-talent">${renderSetTalentStatus()}</div>
          ${renderTitlePanel()}
          ${renderPowerSourcePanel(stats)}
          <section class="title-panel">
            <strong>转生声望 Lv.${prestige.level}</strong>
            <small>累计转生 ${prestige.totalRebirths} 次 · 影响装备品质权重，不增加装备掉落数量</small>
            <small>稀有+ +${percent(prestigeBonus.rarePlusWeightBonus)} · 史诗+ +${percent(prestigeBonus.epicPlusWeightBonus)} · 传说+ +${percent(prestigeBonus.legendPlusWeightBonus)} · 暗金+ +${percent(prestigeBonus.darkGoldPlusWeightBonus)} · 神话 +${percent(prestigeBonus.mythicWeightBonus)}</small>
          </section>
          <p class="job-growth">${describeJobGrowth()}</p>
          <section class="skill-panel">${renderSkillPanel()}</section>
        </details>
        <div class="meter"><div style="width:${jobProgress}%"></div></div>
      </div>
    </article>
  `;
}

function renderPowerSourcePanel(stats) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderPowerSourcePanel === "function") return runtime.renderPowerSourcePanel(stats);
  const equip = computeEquipmentFullStats();
  const setBonuses = stats.setBonuses || {};
  const cardStats = getCardStats();
  const titleEffects = getTitleEffects();
  const vipBonuses = stats.vipBonuses || getVipBonuses();
  const exploration = stats.explorationBonuses || getMapExplorationBonuses(currentMap().id);
  const baseValue = attributeKeys.reduce((sum, stat) => sum + (stats.baseAttrs?.[stat] || 0) * 12, 0) + state.hero.baseLevel * 18 + state.hero.jobLevel * 10;
  const equipmentValue =
    (equip.atk || 0) * 1.6 +
    (equip.matk || 0) * 1.6 +
    (equip.def || 0) * 1.3 +
    (equip.hp || 0) * 0.12 +
    attributeKeys.reduce((sum, stat) => sum + (equip[stat] || 0) * 10, 0);
  const refineValue = Object.values(state.equipped || {}).reduce((sum, id) => {
    const item = state.inventory.find((entry) => entry.id === id);
    return sum + (item?.refine || 0) * 42;
  }, 0);
  const enchantValue = Object.values(state.equipped || {}).reduce((sum, id) => {
    const item = state.inventory.find((entry) => entry.id === id);
    const sources = [item?.enchant, item?.empowerment, item?.imbue, item?.empower].filter(Boolean);
    return sum + sources.reduce((inner, source) => inner + Object.values(source || {}).reduce((total, value) => total + Math.abs(Number(value || 0)) * 80, 0), 0);
  }, 0);
  const setValue =
    (setBonuses.activeSets?.length || 0) * 260 +
    ((setBonuses.powerPct || 0) + (setBonuses.setPowerBonus || 0) + (setBonuses.abyssDamageBonus || 0) + (setBonuses.abyssDamageReduction || 0)) * 2200;
  const cardValue =
    attributeKeys.reduce((sum, stat) => sum + (cardStats[stat] || 0) * 9, 0) +
    ((cardStats.atkPct || 0) + (cardStats.matkPct || 0) + (cardStats.hpPct || 0) + (cardStats.monsterDamage || 0)) * 1800;
  const titleValue = Object.values(titleEffects || {}).reduce((sum, value) => sum + Math.abs(Number(value || 0)) * 900, 0);
  const vipValue = ((vipBonuses.gold || 0) + (vipBonuses.itemDrop || 0) + (vipBonuses.equipmentDrop || 0)) * 520;
  const explorationValue = ((exploration.goldBonus || 0) + (exploration.expBonus || 0) + (exploration.itemDropBonus || 0) + (exploration.equipmentDropBonus || 0) + (exploration.bossDamageBonus || 0)) * 900;
  const abyssValue = ((stats.abyssDamageBonus || 0) + (stats.abyssBossDamageBonus || 0) + (stats.damageReductionPct || 0) + (stats.mythicWeightBonus || 0)) * 1900;
  const rows = [
    ["基础属性", baseValue],
    ["装备", equipmentValue],
    ["星炼", refineValue],
    ["赋能", enchantValue],
    ["套装", setValue],
    ["卡片", cardValue],
    ["称号", titleValue],
    ["VIP", vipValue],
    ["探索", explorationValue],
    ["深渊加成", abyssValue],
  ].map(([label, value]) => [label, Math.max(0, Math.round(value || 0))]);
  const max = Math.max(1, ...rows.map(([, value]) => value));
  return `<section class="power-source-panel">
    <div class="power-source-title">战力来源拆解 <small>估算</small></div>
    <div class="power-source-list">
      ${rows
        .filter(([, value]) => value > 0)
        .map(
          ([label, value]) => `<div class="power-source-row">
            <span>${label}</span>
            <div class="power-source-bar"><i style="width:${Math.max(4, (value / max) * 100)}%"></i></div>
            <strong>${formatNumber(value)}</strong>
          </div>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderTown() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderTown === "function") return runtime.renderTown();
  const canFirst = state.hero.jobId === "novice" && state.hero.jobLevel >= 10;
  const nextJobId = getNextJobId();
  const canAdvance = Boolean(nextJobId) && state.hero.jobLevel >= 50;
  if (els.townIdentity) {
    els.townIdentity.innerHTML = `<div class="town-identity-card">
      <strong>${currentJob().name}</strong>
      <span>BASE ${state.hero.baseLevel}/${maxBaseLevel()} · JOB ${state.hero.jobLevel} · 转生 ${state.hero.rebirths || 0}</span>
      <span class="academy-meta">${state.hero.jobHistory.map((id) => jobTemplates[id]?.name || id).join(" → ")}</span>
    </div>`;
  }
  if (els.academyStatus) {
    els.academyStatus.textContent =
      state.hero.jobId === "novice"
        ? canFirst ? "已满足 JOB 10，可选择一转职业" : `初学者 JOB ${state.hero.jobLevel}/10，继续打怪获取 JOB 经验`
        : nextJobId ? canAdvance ? `已满足 JOB 50，可转职为 ${jobTemplates[nextJobId].name}` : `${currentJob().name} JOB ${state.hero.jobLevel}/50，继续修炼下一阶段` : `已完成当前职业树：${currentJob().name}`;
  }
  if (els.academyGrid) {
    const academyJobs = state.hero.jobId === "novice" ? firstJobs : nextJobId ? [nextJobId] : [];
    els.academyGrid.innerHTML = academyJobs.map((id) => {
      const job = jobTemplates[id];
      const disabled = state.hero.jobId === "novice" ? !canFirst : !canAdvance;
      return `<article class="academy-card"><span class="academy-name">${job.name}</span><p class="academy-meta">${job.role==="front"?"角色1":job.role==="mid"?"角色2":"角色3"} · ${job.skills.map((e)=>e.name).slice(0,3).join(" / ")}</p><p class="academy-meta">${jobSummary(job)}</p><button type="button" data-change-job="${id}" ${disabled?"disabled":""}>转职</button></article>`;
    }).join("") || `<article class="academy-card"><span class="academy-name">学院记录</span><p class="academy-meta">当前已完成三转职业树，继续转生突破 BASE 上限。</p></article>`;
  }
  if (els.jobTree) {
    const path = (state.hero.jobHistory || ["novice"]).concat(nextJobId ? [nextJobId] : []);
    els.jobTree.innerHTML = `<div class="job-tree-line">${path.map((id, i) => `<span class="job-tree-node ${i < path.length-1 ? "active" : "next"}">${jobTemplates[id]?.name || id}</span>${i < path.length-1 ? `<span class="job-tree-arrow">→</span>` : ""}`).join("")}</div>`;
  }
}

function renderSmithy() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSmithy === "function") return runtime.renderSmithy();
  const html = renderSmithyContent();
  if (els.smithySetList) els.smithySetList.innerHTML = html;
  return html;
}

function renderSmithyContent() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSmithyContent === "function") return runtime.renderSmithyContent();
  const tabs = [
    ["enhance", "装备精炼"],
    ["star", "装备星炼"],
    ["socket", "装备打孔"],
    ["set", "套装打造"],
    ["costume", "时装打造"],
    ["materials", "材料说明"],
  ];
  const craftableSets = Object.values(equipmentSets)
    .map((set) => ({
      ...set,
      items: (set.items || []).filter((item) => item.craftable === true),
    }))
    .filter((set) => set.items.length > 0);
  const setCraftHtml = craftableSets
    .map((set) => {
      const bonuses = computeSetBonuses();
      const pieces = bonuses.pieceCounts[set.id] || 0;
      return `
        <article class="smithy-set">
          <div class="smithy-set-head">
            <span class="set-name">${set.name}</span>
            <span class="academy-meta">${pieces}/${set.items.length} 已穿戴</span>
          </div>
          <p class="academy-meta">套装天赋：${set.talentName}，${set.talentDescription}</p>
          <div class="smithy-items">
            ${set.items
              .map((item) => {
                const owned = state.inventory.some((entry) => (entry.templateId || entry.id) === item.id);
                const cost = { ...(item.materials || {}) };
                const goldCost = Number(item.goldCost || 0);
                const hasAnyMaterialCost = Object.values(cost).some((amount) => Number(amount || 0) > 0);
                const missingCost = goldCost <= 0 && !hasAnyMaterialCost && item.allowFreeCraft !== true;
                const disabled = missingCost || state.gold < goldCost || !hasMaterials(cost) || (item.uniqueCraft === true && owned);
                return `
                  <div class="smithy-item">
                    <span class="item-icon" style="background-image:${imageBackgroundList(itemImageCandidates(item))}"></span>
                    <div>
                      ${renderItemName(item)}
                      <p class="academy-meta">${slotName(item.slot)} · ${renderSetName(set.name)}</p>
                      <p class="academy-meta">打造：金币 ${formatNumber(goldCost)} · ${materialText(cost)}</p>
                    </div>
                    <button type="button" data-craft-set-item="${item.id}" ${disabled ? "disabled" : ""}>${item.uniqueCraft === true && owned ? "已拥有" : "打造"}</button>
                  </div>
                `;
              })
              .join("")}
          </div>
        </article>
      `;
    })
    .join("");
  const costumeCraftHtml = Object.values(COSTUME_DB)
    .map((costume) => {
      const owned = state.costumes?.owned?.includes(costume.id);
      const disabled = !hasMaterials(costume.cost || {}) || (costume.uniqueCraft && owned);
      return `<article class="smithy-item smithy-costume">
        <span class="item-icon" style="background-image:${imageBackgroundList([costume.image])}"></span>
        <div>
          ${renderItemName(costume)}
          <p class="academy-meta">${escapeHtml(costume.description)}</p>
          <p class="academy-meta">打造：${materialText(costume.cost || {})}</p>
        </div>
        <button type="button" data-craft-costume="${costume.id}" ${disabled ? "disabled" : ""}>${owned ? "已拥有" : "打造"}</button>
      </article>`;
    })
    .join("");
  const panes = {
    enhance: `<section class="smithy-category"><h3>装备精炼</h3>${renderEnhancePanel()}</section><section class="smithy-category"><h3>暗金兑换</h3>${renderDarkGoldExchangePanel()}</section>`,
    star: `<section class="smithy-category"><h3>装备星炼</h3>${renderStarRefineSmithyPanel()}</section>`,
    socket: `<section class="smithy-category"><h3>装备打孔</h3>${renderCardSocketSmithyPanel()}</section>`,
    set: `<section class="smithy-category"><h3>套装打造</h3>${setCraftHtml || `<p class="academy-meta">星座套装通过怪物掉落获得。已穿戴部件可在装备页查看套装进度，未穿戴部件在图鉴页查看全貌。</p>`}</section>`,
    costume: `<section class="smithy-category"><h3>时装打造</h3>${costumeCraftHtml}</section>`,
    materials: `<section class="smithy-category"><h3>材料说明</h3>${renderSmithyMaterialGuide()}</section>`,
  };
  if (!panes[smithyActiveTab]) smithyActiveTab = "enhance";
  return `
    <div class="smithy-tabs">${tabs.map(([id, label]) => `<button type="button" data-smithy-tab="${id}" class="smithy-tab ${smithyActiveTab === id ? "active" : ""}">${label}</button>`).join("")}</div>
    <div class="smithy-tab-panel">${panes[smithyActiveTab]}</div>
  `;
}

function renderStarRefineSmithyPanel() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderStarRefineSmithyPanel === "function") return runtime.renderStarRefineSmithyPanel();
  const items = [...state.inventory]
    .filter((item) => (item.refine || 0) < 15)
    .sort((a, b) => itemScore(b) - itemScore(a))
    .slice(0, 24);
  if (!items.length) return `<p class="academy-meta">暂无可星炼装备。</p>`;
  return `<div class="smithy-items">${items.map((item) => {
    const next = (item.refine || 0) + 1;
    const cost = getRefineCost(item);
    const disabled = next > 15 || !hasMaterials(cost);
    return `<article class="smithy-item">
      <span class="item-icon" style="background-image:${imageBackgroundList(itemImageCandidates(item))}"></span>
      <div>
        ${renderItemName(item)}
        <p class="academy-meta">${slotName(equipmentSlot(item))} · ${rarityName(item.rarity)} · 当前 ★${item.refine || 0}</p>
        <p class="academy-meta">目标：★${item.refine || 0} → ★${next} · 成功率 ${Math.round(getRefineChance(next, item) * 100)}%</p>
        <p class="academy-meta">消耗：${materialText(cost)}</p>
      </div>
      <button type="button" data-refine-item="${item.id}" ${disabled ? "disabled" : ""}>星炼</button>
    </article>`;
  }).join("")}</div>`;
}

function renderCardSocketSmithyPanel() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCardSocketSmithyPanel === "function") return runtime.renderCardSocketSmithyPanel();
  const candidates = state.inventory
    .filter((item) => getMaxEquipmentCardSlots(item) > getEquipmentCardSlotCount(item))
    .sort((a, b) => itemScore(b) - itemScore(a))
    .slice(0, 24);
  if (!candidates.length) return `<p class="academy-meta">暂无可打孔装备。装备掉落默认无槽，需要用打孔石开启卡槽。</p>`;
  return `<div class="smithy-items">${candidates
    .map((item) => {
      const slots = getEquipmentCardSlotCount(item);
      const maxSlots = getMaxEquipmentCardSlots(item);
      const cost = getCardSocketCost(item);
      const disabled = !cost || !canAffordSocketCost(cost);
      const chance = getCardSocketChance(item);
      return `<article class="smithy-item">
        <span class="item-icon" style="background-image:${imageBackgroundList(itemImageCandidates(item))}"></span>
        <div>
          ${renderItemName(item)}
          <p class="academy-meta">${slotName(equipmentSlot(item))} · ${rarityName(item.rarity)} · 孔位 ${slots}/${maxSlots}</p>
          <p class="academy-meta">下一级：开启第 ${slots + 1} 个孔位 · 成功率 ${percent(chance)}</p>
          <p class="academy-meta">消耗：${cardSocketCostText(cost)}</p>
          <p class="academy-meta">失败结果：只消耗材料和金币，装备不损坏。</p>
        </div>
        <button type="button" data-punch-card-slot="${item.id}" ${disabled ? "disabled" : ""}>打孔</button>
      </article>`;
    })
    .join("")}</div>`;
}

function renderSmithyMaterialGuide() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSmithyMaterialGuide === "function") return runtime.renderSmithyMaterialGuide();
  const rows = [
    ["socketStone", "用于普通装备开启孔位。主要来源：商店、Boss、困难地图。"],
    ["advancedSocketStone", "用于高品质装备或第 2 / 第 3 孔。主要来源：Boss、商店、高阶材料。"],
    ["mythicSocketStone", "用于暗金、神话或深渊装备高级孔位。主要来源：深渊、Boss、商店。"],
    ["cardRemover", "用于拆除装备卡槽中的卡片，卡片会回到卡片背包。"],
    ["oridecon", "武器精炼材料，主要用于 +N 精炼。"],
    ["elunium", "防具精炼材料，主要用于 +N 精炼。"],
    ["starShard", "高阶星炼、套装打造和神话相关材料。"],
  ];
  return `<div class="material-grid">${rows.map(([id, desc]) => `<article class="material-card">
    <span class="material-name ${getRarityClass({ rarity: MATERIAL_DB[id]?.rarity || "normal" })}">${escapeHtml(materialNames[id] || id)}</span>
    <strong class="material-count">×${formatNumber(state.materials[id] || 0)}</strong>
    <small class="material-desc">${escapeHtml(desc)}</small>
  </article>`).join("")}</div>`;
}

function renderDarkGoldExchangePanel() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderDarkGoldExchangePanel === "function") return runtime.renderDarkGoldExchangePanel();
  const fragmentCount = state.materials.darkGoldFragment || 0;
  const slotOptions = [
    ["weapon", "武器"],
    ["armor", "铠甲"],
    ["headgear", "头饰"],
    ["shoes", "鞋子"],
    ["trinket", "饰品"],
  ];
  const entries = [
    { mode: "random", title: "随机暗金装备", desc: "从全装备池中随机生成 1 件暗金装备。", cost: DARK_GOLD_EXCHANGE_COSTS.random },
    { mode: "map", title: "当前地图池暗金", desc: "从当前地图装备池中随机生成 1 件暗金装备。", cost: DARK_GOLD_EXCHANGE_COSTS.map },
  ];
  const baseCards = entries.map((entry) => renderDarkGoldExchangeCard(entry, fragmentCount)).join("");
  const slotCards = slotOptions.map(([slot, label]) => renderDarkGoldExchangeCard({
    mode: "slot",
    slot,
    title: `指定${label}暗金`,
    desc: `从${label}装备池中随机生成 1 件暗金装备。`,
    cost: DARK_GOLD_EXCHANGE_COSTS.slot,
  }, fragmentCount)).join("");
  return `<div class="smithy-items">
    <p class="academy-meta">当前 ${materialNames.darkGoldFragment}：${formatNumber(fragmentCount)}。暗金兑换不会影响普通掉落，适合作为 Boss 刷取保底。</p>
    ${baseCards}${slotCards}
  </div>`;
}

function renderDarkGoldExchangeCard(entry, fragmentCount) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderDarkGoldExchangeCard === "function") return runtime.renderDarkGoldExchangeCard(entry, fragmentCount);
  const disabled = fragmentCount < entry.cost || state.inventory.length >= getInventoryLimit();
  return `<div class="smithy-item">
    <span class="item-icon rarity-darkGold">暗</span>
    <div>
      <strong class="rarity-darkGold">${escapeHtml(entry.title)}</strong>
      <p class="academy-meta">${escapeHtml(entry.desc)}</p>
      <p class="academy-meta">消耗：${materialNames.darkGoldFragment} ×${formatNumber(entry.cost)}</p>
    </div>
    <button type="button" data-darkgold-exchange="${entry.mode}" ${entry.slot ? `data-slot="${entry.slot}"` : ""} ${disabled ? "disabled" : ""}>兑换</button>
  </div>`;
}

function getEnhanceMilestoneBonuses(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getEnhanceMilestoneBonuses === "function") return runtime.getEnhanceMilestoneBonuses(item);
  const level = item?.enhanceLevel || 0;
  const slot = equipmentSlot(item);
  const bonuses = {};
  ENHANCE_MILESTONE_LEVELS.forEach((ms, i) => {
    if (level >= ms) {
      const tier = ENHANCE_MILESTONE_BONUSES[slot] || [];
      if (tier[i]) Object.entries(tier[i]).forEach(([k, v]) => { bonuses[k] = (bonuses[k] || 0) + (v || 0); });
    }
  });
  return bonuses;
}

function getEnhanceDowngrade(nextLevel) {
  if (nextLevel <= 4) return 0;
  if (nextLevel <= 7) return 0;
  if (nextLevel <= 10) return 1;
  return Math.random() < 0.5 ? 1 : 2;
}

function getEnhanceFailResultText(nextLevel) {
  if (nextLevel <= 7) return "不掉级，仅消耗材料";
  if (nextLevel <= 10) return "失败掉 1 级";
  return "失败掉 1~2 级";
}

function getEnhanceSafeZoneText(nextLevel) {
  if (nextLevel <= 4) return "安全区：失败不掉级";
  return "非安全区";
}

function renderEnhancePanel() {
  const equipped = Object.entries(state.equipped)
    .map(([slot, id]) => ({ slot, item: state.inventory.find((i) => i.id === id) }))
    .filter((entry) => entry.item);
  if (!equipped.length) return `<p class="academy-meta">请先装备装备。</p>`;
  const selected = state.selectedEnhanceItem ? state.inventory.find((i) => i.id === state.selectedEnhanceItem && Object.values(state.equipped).includes(i.id)) : equipped[0].item;
  const currentLevel = (selected?.enhanceLevel || 0);
  const nextLevel = currentLevel + 1;
  const atCap = currentLevel >= ENHANCE_MAX_LEVEL;
  const chance = atCap ? 0 : ENHANCE_CHANCES[nextLevel - 1] || 0;
  const passiveChance = atCap ? 0 : ENHANCE_PASSIVE_CHANCES[nextLevel - 1] || 0;
  const cost = getEnhanceCost(selected);
  const effect = getEnhanceEffect(selected, nextLevel);
  const safeZone = getEnhanceSafeZoneText(nextLevel);
  const failResult = getEnhanceFailResultText(nextLevel);
  const milestones = getEnhanceMilestoneBonuses(selected);
  const nextMilestone = ENHANCE_MILESTONE_LEVELS.find((ms) => ms > currentLevel);
  const nextMilestoneText = nextMilestone ? `，下一阶段 +${nextMilestone}` : "";
  const protectCount = state.materials.enhanceProtect || 0;
  const needsProtect = nextLevel >= 8;
  return `<div class="enhance-panel">
    <div class="enhance-select">
      <strong>当前精炼</strong>
      <select data-enhance-select>${equipped.map((entry) => `<option value="${entry.item.id}" ${(selected?.id === entry.item.id) ? "selected" : ""}>+${entry.item.enhanceLevel || 0} ${getDisplayItemName(entry.item)} (${slotName(entry.slot)})</option>`).join("")}</select>
    </div>
    ${selected ? `
    <div class="enhance-info">
      <p>当前精炼等级：+${currentLevel}${atCap ? " (已满级)" : ""}</p>
      ${!atCap ? `<p>目标精炼：+${currentLevel} → +${nextLevel}</p>` : ""}
      ${!atCap ? `<p>成功率：${Math.round(chance * 100)}%</p>` : ""}
      ${!atCap ? `<p>失败结果：${failResult}</p>` : ""}
      ${!atCap ? `<p>安全区：${safeZone}${nextMilestoneText}</p>` : ""}
      ${!atCap && needsProtect ? `<p>精炼保护卷：${protectCount} 个剩余</p>` : ""}
      ${!atCap && passiveChance > 0 ? `<p>高精炼特效概率：${Math.round(passiveChance * 100)}%</p>` : ""}
      ${!atCap ? `<p>精炼效果：${escapeHtml(effect)}</p>` : ""}
      ${!atCap ? `<p>消耗：${materialText(cost.materials || {})} · 金币 ${formatNumber(cost.gold || 0)}</p>` : ""}
      ${currentLevel >= 6 ? `<p>可能出现：${ENHANCE_PASSIVE_POOL.map((id) => ENHANCE_PASSIVE_DB[id]?.name || id).join(" / ")}</p>` : ""}
    </div>
    ${!atCap ? `<button type="button" data-enhance-item="${selected.id}" ${!hasMaterials(cost.materials || {}) || state.gold < (cost.gold || 0) ? "disabled" : ""}>开始精炼</button>` : ""}
    ${currentLevel > 0 ? `<p class="enhance-current">${renderEnhanceEffectText(selected)}</p>` : ""}
    ` : `<p class="academy-meta">请选择一件装备。</p>`}
  </div>`;
}

function renderEnhanceEffectText(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEnhanceEffectText === "function") return runtime.renderEnhanceEffectText(item);
  if (!item || !item.enhanceLevel) return "";
  const eff = getEnhanceEffect(item, item.enhanceLevel);
  const ms = getEnhanceMilestoneBonuses(item);
  const parts = [`精炼 +${item.enhanceLevel}`];
  if (eff) parts.push(eff);
  if (Object.keys(ms).length) parts.push("里程碑已激活");
  if ((item.specialPassives || []).length) {
    (item.specialPassives || []).forEach((id) => {
      const p = ENHANCE_PASSIVE_DB[id];
      if (p) parts.push(`特效：${p.name}（${p.desc}）`);
    });
  }
  return parts.join(" · ");
}

function getEnhanceCost(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getEnhanceCost === "function") return runtime.getEnhanceCost(item);
  if (!item) return { materials: {}, gold: 0 };
  const next = (item.enhanceLevel || 0) + 1;
  const slot = equipmentSlot(item);
  const materials = {};
  if (next <= 4) {
    if (slot === "weapon") materials.oridecon = 1 + Math.floor(next / 2);
    else materials.elunium = 1 + Math.floor(next / 2);
    if (slot === "trinket") { materials.elunium = (materials.elunium || 0) + 1; if (next >= 3) materials.oridecon = 1; }
  } else if (next <= 7) {
    if (slot === "weapon") materials.oridecon = 2 + Math.floor(next / 3);
    else materials.elunium = 2 + Math.floor(next / 3);
    materials.ore = 3 + next;
    if (slot === "trinket") materials.elunium = (materials.elunium || 0) + 1;
  } else if (next <= 10) {
    if (slot === "weapon") materials.oridecon = 3 + Math.floor(next / 3);
    else materials.elunium = 3 + Math.floor(next / 3);
    materials.ancientCore = Math.floor((next - 5) / 2);
    if (slot === "trinket") { materials.elunium = (materials.elunium || 0) + 2; materials.oridecon = 1; }
  } else {
    if (slot === "weapon") materials.oridecon = 3 + Math.floor(next / 3);
    else materials.elunium = 3 + Math.floor(next / 3);
    materials.starShard = next >= 13 ? 2 : 1;
    materials.mythicEssence = next >= 14 ? 1 : 0;
    if (slot === "trinket") { materials.elunium = (materials.elunium || 0) + 2; materials.oridecon = 2; }
  }
  const gold = Math.round((next <= 4 ? 3000 : next <= 7 ? 15000 : next <= 10 ? 80000 : 300000) * Math.pow(next <= 7 ? 1.25 : 1.18, next - 1));
  return { materials, gold };
}

function getEnhanceEffect(item, level) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getEnhanceEffect === "function") return runtime.getEnhanceEffect(item, level);
  if (!item || !level) return "";
  const slot = equipmentSlot(item);
  const pct = Math.round(level * (slot === "weapon" ? 3 : slot === "armor" ? 2.5 : 2) * 10) / 10;
  const labels = [];
  if (slot === "weapon") labels.push(`攻击 +${pct}%`, `魔攻 +${pct}%`);
  else if (slot === "armor") labels.push(`防御 +${pct}%`, `生命 +${(pct * 0.6).toFixed(1)}%`);
  else if (slot === "headgear") labels.push(`生命 +${pct}%`);
  else if (slot === "shoes") labels.push(`攻速 +${(pct * 0.3).toFixed(1)}%`);
  else labels.push(`全属性 +${(pct * 0.35).toFixed(1)}%`);
  const ms = getEnhanceMilestoneBonuses(item);
  if (Object.keys(ms).length) {
    Object.entries(ms).forEach(([k, v]) => {
      if (v) labels.push(`${statLabelName(k) || k} +${statIsPercent(k) || typeof v === "number" && v < 1 ? (v * 100).toFixed(1) + "%" : formatNumber(v)}`);
    });
  }
  return labels.join(" · ");
}

function enhanceItem(itemId) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.enhanceItem === "function") return runtime.enhanceItem(itemId);
  const item = state.inventory.find((i) => i.id === itemId);
  if (!item) return;
  const current = item.enhanceLevel || 0;
  if (current >= ENHANCE_MAX_LEVEL) { showToast("已达精炼上限"); return; }
  const nextLevel = current + 1;
  const cost = getEnhanceCost(item);
  if (state.gold < (cost.gold || 0) || !hasMaterials(cost.materials || {})) { showToast("材料不足"); return; }
  state.gold -= cost.gold || 0;
  consumeMaterials(cost.materials || {});
  const chance = ENHANCE_CHANCES[nextLevel - 1] || 0;
  if (Math.random() < chance) {
    item.enhanceLevel = nextLevel;
    const passiveChance = ENHANCE_PASSIVE_CHANCES[nextLevel - 1] || 0;
    if (Math.random() < passiveChance && (!item.specialPassives || !item.specialPassives.length)) {
      const passiveId = ENHANCE_PASSIVE_POOL[Math.floor(Math.random() * ENHANCE_PASSIVE_POOL.length)];
      item.specialPassives = [passiveId];
      addLog(`${getDisplayItemName(item)} 精炼至 +${item.enhanceLevel}，获得高精炼特效：${ENHANCE_PASSIVE_DB[passiveId]?.name || passiveId}。`);
      showToast(`精炼成功！获得 ${ENHANCE_PASSIVE_DB[passiveId]?.name || passiveId}`);
    } else {
      addLog(`${getDisplayItemName(item)} 精炼至 +${item.enhanceLevel}。`);
      showToast(`精炼成功 +${item.enhanceLevel}`);
    }
  } else {
    const downgrade = getEnhanceDowngrade(nextLevel);
    if (downgrade > 0 && nextLevel >= 8 && (state.materials.enhanceProtect || 0) > 0) {
      state.materials.enhanceProtect -= 1;
      addLog(`${getDisplayItemName(item)} 精炼失败，精炼保护卷已消耗，等级保持不变。`);
      showToast("精炼失败，保护卷已消耗");
    } else if (downgrade > 0) {
      item.enhanceLevel = Math.max(0, current - downgrade);
      addLog(`${getDisplayItemName(item)} 精炼失败，降级至 +${item.enhanceLevel}。`);
      showToast(`精炼失败，降级至 +${item.enhanceLevel}`);
    } else {
      addLog(`${getDisplayItemName(item)} 精炼失败，材料已消耗。`);
      showToast("精炼失败，材料已消耗");
    }
  }
  renderAll();
  save();
}


function renderSmithyPage() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSmithyPage === "function") return runtime.renderSmithyPage();
  if (!els.smithyPageContent) return;
  els.smithyPageContent.innerHTML = renderSmithyContent();
}

function craftSetItem(itemId) {
  const template = Object.values(equipmentSets).flatMap((set) => set.items.map((item) => ({ ...item, setId: set.id, setName: set.name }))).find((item) => item.id === itemId);
  if (!template) return;
  if (template.craftable !== true) {
    showToast("该装备不能通过铁匠铺打造");
    return;
  }
  if (template.uniqueCraft === true && state.inventory.some((item) => (item.templateId || item.id) === template.id)) {
    showToast("已拥有该套装部件");
    return;
  }
  const cost = template.materials || {};
  const goldCost = Number(template.goldCost || 0);
  const hasAnyMaterialCost = Object.values(cost).some((amount) => Number(amount || 0) > 0);
  if (goldCost <= 0 && !hasAnyMaterialCost && template.allowFreeCraft !== true) {
    showToast("该装备没有配置打造成本，禁止打造");
    return;
  }
  if (state.gold < goldCost || !hasMaterials(cost)) {
    showToast("打造材料或金币不足");
    return;
  }
  state.gold -= goldCost;
  consumeMaterials(cost);
  const craftLevel = template.craftLevel || state.hero.baseLevel || template.level || 1;
  const item = createItem({ ...template, source: "crafted_set" }, craftLevel, template.rarity, { dropMapId: "smithy", dropLevel: craftLevel, itemTier: template.craftTier });
  item.refine = 0;
  item.templateId = template.id;
  item.setId = template.setId;
  item.setName = template.setName;
  state.inventory.unshift(item);
  trackEquipmentAchievement(item);
  state.craftedSetItems[template.id] = true;
  addLogHtml(`铁匠铺打造：${renderItemName(item)} · ${renderSetName(item.setName)}`);
  renderAll();
  save();
}

function exchangeDarkGoldEquipment(mode = "random", slot = "") {
  const normalizedMode = ["random", "slot", "map"].includes(mode) ? mode : "random";
  const cost = DARK_GOLD_EXCHANGE_COSTS[normalizedMode] || DARK_GOLD_EXCHANGE_COSTS.random;
  if ((state.materials.darkGoldFragment || 0) < cost) {
    showToast(`${materialNames.darkGoldFragment}不足`);
    return;
  }
  if (state.inventory.length >= getInventoryLimit()) {
    showToast("背包已满");
    return;
  }
  const item = createDarkGoldExchangeItem(normalizedMode, slot);
  if (!item) {
    showToast("暂无可兑换的暗金装备池");
    return;
  }
  state.materials.darkGoldFragment = Math.max(0, (state.materials.darkGoldFragment || 0) - cost);
  state.inventory.unshift(item);
  trackEquipmentAchievement(item);
  recordRecentLoot({ equipments: [item], equipment: [item] }, "暗金兑换");
  addLogHtml(`暗金兑换获得：${renderItemName(item)}`);
  showToast(`获得 ${getDisplayItemName(item)}`);
  renderAll();
  save();
}

function createDarkGoldExchangeItem(mode = "random", slot = "") {
  const map = currentMap();
  const tableId = mapDropTableAlias[map.id] || map.id;
  let templates = [];
  if (mode === "map") {
    templates = (equipmentDropTables[tableId] || [])
      .filter((drop) => equipmentTemplateDb[drop.equipmentId])
      .map((drop) => equipmentTemplateDb[drop.equipmentId]);
  } else {
    templates = allEquipmentTemplates.filter((template) => template && rarityRank(template.rarity) >= rarityRank("rare"));
  }
  if (mode === "slot" && slot) {
    templates = templates.filter((template) => equipmentSlot(template) === slot);
  }
  if (!templates.length) {
    templates = allEquipmentTemplates.filter((template) => template && rarityRank(template.rarity) >= rarityRank("legend"));
  }
  const template = templates[Math.floor(Math.random() * templates.length)];
  if (!template) return null;
  const mapRange = getMapLevelRange(map);
  const baseLevel = mode === "map" ? mapRange.maxLevel : Math.max(mapRange.maxLevel, state.hero.baseLevel || template.level || 1);
  const dropLevel = clampNumber(baseLevel + randomInt(8, 18), 1, MAX_EQUIPMENT_LEVEL);
  return createItem(template, dropLevel, "darkGold", { dropMapId: mode === "map" ? map.id : "dark_gold_exchange", dropLevel, difficulty: state.currentDifficulty });
}

function isZodiacSetId(setId) {
  return Boolean(setId && (setId === "taurus_aldbaran" || ZODIAC_CARD_BY_SET[setId]));
}

function isZodiacItem(item) {
  return Boolean(item?.setId && isZodiacSetId(item.setId));
}

function ensureZodiacCollectionEntry(setId) {
  state.zodiacCollection = normalizeZodiacCollection(state.zodiacCollection);
  state.zodiacCollection[setId] = state.zodiacCollection[setId] || { collectedPieceIds: [], abyssCollectedPieceIds: [], active: false, abyssActive: false };
  return state.zodiacCollection[setId];
}

function collectZodiacItem(itemId, options = {}) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item || !isZodiacItem(item)) {
    showToast("只有星座套装部件可以收藏");
    return;
  }
  const templateId = item.templateId || item.id;
  const entry = ensureZodiacCollectionEntry(item.setId);
  if (entry.collectedPieceIds.includes(templateId)) {
    if (!isAbyssEquipment(item) || entry.abyssCollectedPieceIds?.includes(templateId)) {
      showToast("该星座部位已收藏，可选择分解重复部件");
      return;
    }
  }
  if (isAbyssEquipment(item) && entry.abyssCollectedPieceIds?.includes(templateId)) {
    showToast("该深渊星座部位已收藏");
    return;
  }
  const ok = options.skipConfirm || window.confirm(`收藏 ${getDisplayItemName(item)}？收藏后装备会从背包消失，单件属性不再生效。`);
  if (!ok) return;
  Object.keys(state.equipped || {}).forEach((slot) => {
    if (state.equipped[slot] === item.id) state.equipped[slot] = null;
  });
  state.inventory = state.inventory.filter((entry) => entry.id !== item.id);
  if (!entry.collectedPieceIds.includes(templateId)) entry.collectedPieceIds.push(templateId);
  if (isAbyssEquipment(item)) {
    entry.abyssCollectedPieceIds = Array.isArray(entry.abyssCollectedPieceIds) ? entry.abyssCollectedPieceIds : [];
    if (!entry.abyssCollectedPieceIds.includes(templateId)) entry.abyssCollectedPieceIds.push(templateId);
  }
  const set = equipmentSets[item.setId];
  entry.active = Boolean(set && entry.collectedPieceIds.length >= set.items.length);
  entry.abyssActive = Boolean(set && (entry.abyssCollectedPieceIds || []).length >= set.items.length);
  if (entry.active) updateAchievementProgress("zodiacSet_1", 1, { absolute: true });
  addLog(`${item.setName || set?.name || "星座套装"} 收藏进度 ${entry.collectedPieceIds.length}/${set?.items?.length || 5}${isAbyssEquipment(item) ? `，深渊收藏 ${(entry.abyssCollectedPieceIds || []).length}/${set?.items?.length || 5}` : ""}。`);
  renderAll();
  save();
}

function decomposeZodiacItem(itemId, options = {}) {
  const item = state.inventory.find((entry) => entry.id === itemId);
  if (!item || !isZodiacItem(item)) {
    showToast("只有星座套装部件可以分解为圣卡");
    return;
  }
  const equipped = Object.values(state.equipped || {}).includes(item.id);
  if (equipped) {
    showToast("请先卸下已装备的星座部件");
    return;
  }
  const materialId = ZODIAC_CARD_BY_SET[item.setId];
  if (!materialId) return;
  let qty = item.rarity === "mythic" ? 3 : item.rarity === "darkGold" ? 2 : 1;
  if (isAbyssEquipment(item)) qty += item.rarity === "mythic" ? 2 : 1;
  const ok = options.skipConfirm || window.confirm(`分解 ${getDisplayItemName(item)}？将获得 ${materialNames[materialId]} ×${qty}。`);
  if (!ok) return;
  state.inventory = state.inventory.filter((entry) => entry.id !== item.id);
  state.materials[materialId] = (state.materials[materialId] || 0) + qty;
  addLog(`分解星座装备，获得 ${materialNames[materialId]} ×${qty}。`);
  renderAll();
  save();
}

function craftCostume(costumeId) {
  const costume = COSTUME_DB[costumeId];
  if (!costume) return;
  state.costumes = normalizeCostumes(state.costumes);
  if (costume.uniqueCraft && state.costumes.owned.includes(costume.id)) {
    showToast("已拥有该时装");
    return;
  }
  if (!hasMaterials(costume.cost || {})) {
    showToast(`时装材料不足：${materialText(costume.cost || {})}`);
    return;
  }
  consumeMaterials(costume.cost || {});
  state.costumes.owned.push(costume.id);
  state.costumes.equipped[costume.slot] = costume.id;
  addLog(`打造时装成功：${costume.name}，已自动穿戴。`);
  showToast(`获得时装：${costume.name}`);
  renderAll();
  save();
}

function equipCostume(costumeId) {
  const costume = COSTUME_DB[costumeId];
  state.costumes = normalizeCostumes(state.costumes);
  if (!costume || !state.costumes.owned.includes(costumeId)) return;
  state.costumes.equipped[costume.slot] = costumeId;
  addLog(`已穿戴时装：${costume.name}。`);
  renderAll();
  save();
}

function unequipCostume(slot) {
  state.costumes = normalizeCostumes(state.costumes);
  if (!state.costumes.equipped?.[slot]) return;
  state.costumes.equipped[slot] = null;
  addLog("已卸下时装。");
  renderAll();
  save();
}

function equippedSlotMeta(item) {
  if (!item) return "未装备";
  return `<div class="equipped-slot-summary">
    <div class="equipped-slot-title">${renderItemName(item, `Lv.${item.level} ${refineText(item)} ${empowerText(item)}`)}</div>
    ${item.setName ? `<div class="equip-meta">${renderSetName(item.setName)}</div>` : ""}
    ${renderEquipmentSummaryStats(item, 3)}
  </div>`;
}

function getEquipmentSummaryEntries(item, limit = 4) {
  const stats = getEffectiveItemStats(item, false);
  const priority = [
    "atk",
    "matk",
    "def",
    "hp",
    "str",
    "agi",
    "vit",
    "int",
    "dex",
    "luk",
    "crit",
    "critRatePct",
    "critDamageBonus",
    "aspd",
    "attackSpeedPct",
    "lifeSteal",
    "damageReductionPct",
    "bossDamageBonus",
    "abyssDamageBonus",
    "abyssDamageReduction",
    "finalDamageBonus",
    "drop",
    "rareDropBonus",
    "gold",
  ];
  return priority
    .map((stat) => equipmentStatEntry(stats, stat))
    .filter(Boolean)
    .slice(0, limit);
}

function renderEquipmentSummaryStats(item, limit = 4) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentSummaryStats === "function") return runtime.renderEquipmentSummaryStats(item, limit);
  const entries = getEquipmentSummaryEntries(item, limit);
  if (!entries.length) return `<div class="equipment-card-empty">无核心属性</div>`;
  return `<div class="equipment-summary-grid">${entries
    .map((entry) => `<span class="equipment-summary-chip"><span>${escapeHtml(entry.label)}</span><strong>${formatStatValue(entry.stat, entry.value)}</strong></span>`)
    .join("")}</div>`;
}

function renderEquipmentCardScore(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentCardScore === "function") return runtime.renderEquipmentCardScore(item);
  const scores = calculateEquipmentScores(item, currentJob());
  return `<div class="equipment-card-score">
    <span>综合评分</span>
    <strong>${formatNumber(scores.comprehensive)}</strong>
  </div>`;
}

function renderEquipmentStateBadges(item, equipped, nextStar) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentStateBadges === "function") return runtime.renderEquipmentStateBadges(item, equipped, nextStar);
  const badges = [];
  if (equipped) badges.push("已装备");
  if (item.locked) badges.push("已锁定");
  if (nextStar <= 15) badges.push("可星炼");
  if (isAbyssEquipment(item)) badges.push("深渊");
  const slotCount = getEquipmentCardSlotCount(item);
  const maxSlots = getMaxEquipmentCardSlots(item);
  if (maxSlots > 0) badges.push(`卡槽 ${slotCount}/${maxSlots}`);
  return badges.length ? `<div class="equipment-badge-row equipment-state-tags">${badges.map((text) => `<span class="equipment-badge">${text}</span>`).join("")}</div>` : "";
}

function equipmentDetailKey(item) {
  return String(item?.uid || item?.instanceId || item?.id || "");
}

function pruneEquipmentDetailExpandedState() {
  const validKeys = new Set((state.inventory || []).map(equipmentDetailKey).filter(Boolean));
  Object.keys(equipmentDetailExpandedState).forEach((key) => {
    if (!validKeys.has(key)) delete equipmentDetailExpandedState[key];
  });
}

function toggleEquipmentDetailExpanded(key) {
  if (!key) return;
  equipmentDetailExpandedState[key] = !equipmentDetailExpandedState[key];
  renderEquipment();
}

function renderEquipment() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipment === "function") return runtime.renderEquipment();
  pruneEquipmentDetailExpandedState();
  els.equippedSlots.innerHTML = ["weapon", "armor", "headgear", "shoes", "trinket"]
    .map((slot) => {
      const item = state.inventory.find((entry) => entry.id === state.equipped[slot]);
      return `
        <div class="slot-card">
          <span class="slot-name">${slotName(slot)}</span>
          <div class="slot-meta">${equippedSlotMeta(item)}</div>
        </div>
      `;
    })
    .join("");

  els.materialList.innerHTML = `
    ${renderMaterialGroups()}
    ${renderEquipmentBatchPanel()}
    ${renderZodiacCollectionPanel()}
    ${renderCostumePanel()}
    <div class="slot-card auto-salvage-card">
      <span class="slot-name">自动分解</span>
      <p class="slot-meta">仅对新获得装备生效，不会默认分解传说/暗金/神话/套装。</p>
      <label class="setting-line"><input type="checkbox" data-auto-salvage-enabled ${state.autoSalvage?.enabled ? "checked" : ""}> 开启自动分解</label>
      <select data-auto-salvage-rarity>
        ${["normal", "fine", "rare", "epic"].map((rarity) => `<option value="${rarity}" ${state.autoSalvage?.maxRarity === rarity ? "selected" : ""}>${rarityName(rarity)}及以下</option>`).join("")}
      </select>
      <label class="setting-line"><input type="checkbox" data-auto-dismantle-abyss ${state.autoSalvage?.autoDismantleAbyss ? "checked" : ""}> 允许自动分解深渊装备</label>
      <small class="slot-meta">套装、暗金、神话、锁定装备仍会被保护。</small>
    </div>
  `;

  const filtered = sortEquipmentList(filterEquipmentList([...state.inventory]));
  const visible = equipmentShowAll ? filtered : filtered.slice(0, 18);
  els.equipmentFilterBar.innerHTML = renderEquipmentFilterBar(filtered.length);
  els.equipmentGrid.innerHTML = `
    ${visible.length ? visible
    .map((item) => {
      const equipped = state.equipped[equipmentSlot(item)] === item.id;
      const refineCost = getRefineCost(item);
      const empowerCost = getEmpowerCost(item);
      const nextStar = (item.refine || 0) + 1;
      const nextEmpower = (item.empower || 0) + 1;
      const detailKey = equipmentDetailKey(item);
      const detailExpanded = Boolean(equipmentDetailExpandedState[detailKey]);
      return `
        <article class="equip-item equipment-detail-card ${equipmentVisualClass(item)} ${equipped ? "equipped" : ""} ${(item.enhanceLevel || 0) >= 10 ? "enhance-glow" : ""}" data-tooltip="${escapeAttr(itemRangeTooltip(item))}" title="${escapeAttr(itemRangeTooltip(item))}">
          <div class="equip-head equipment-detail-header">
              <span class="item-icon" style="background-image:${imageBackgroundList(itemImageCandidates(item))}"></span>
            <div class="equipment-name-main">
              <span class="equip-name equipment-name-row">${renderItemName(item, `Lv.${item.level} ${refineText(item)} ${empowerText(item)}`)}</span>
              ${renderEquipmentBadges(item)}
              ${renderEquipmentUsageTags(item)}
              ${renderEquipmentStateBadges(item, equipped, nextStar)}
            </div>
          </div>
          <span class="equip-meta">${slotName(item.slot)} · ${rarityName(item.rarity)}</span>
          ${isAbyssEquipment(item) ? `<span class="equip-meta">来源：深渊难度</span>` : ""}
          ${item.setName ? `<span class="equip-meta">${renderSetName(item.setName)}</span>` : ""}
          ${renderEquipmentCardScore(item)}
          ${renderEquipmentSummaryStats(item, 4)}
          <details class="equipment-detail-toggle" data-equipment-detail-key="${escapeAttr(detailKey)}" ${detailExpanded ? "open" : ""}>
            <summary data-equipment-detail-toggle="${escapeAttr(detailKey)}">${detailExpanded ? "收起完整属性" : "查看完整属性"}</summary>
            ${renderCardSocketSection(item)}
            ${renderEquipmentStatSections(item)}
            ${renderSalvagePreviewSection(item)}
            <span class="equip-meta">星炼 ${Math.round(getRefineChance(nextStar, item) * 100)}% · 保底 +${Math.round((item.refineFailCount || 0) * 1.5 * 10) / 10}% · ${nextStar <= 15 ? materialText(refineCost) : "已满星"}</span>
            <span class="equip-meta">赋能 ${nextEmpower <= 10 ? materialText(empowerCost) : "已满阶"}</span>
          </details>
          <div class="equip-actions equipment-action-row">
            <button type="button" data-equip-item="${item.id}">${equipped ? "已装备" : "装备"}</button>
            <button type="button" data-refine-item="${item.id}" ${nextStar > 15 || !hasMaterials(refineCost) ? "disabled" : ""}>星炼</button>
            <button type="button" data-empower-item="${item.id}" ${nextEmpower > 10 || !hasMaterials(empowerCost) ? "disabled" : ""}>赋能</button>
            <button class="ghost" type="button" data-lock-item="${item.id}">${item.locked ? "解锁" : "锁定"}</button>
            ${isZodiacItem(item) ? `<button class="ghost" type="button" data-collect-zodiac="${item.id}">收藏</button><button class="ghost" type="button" data-zodiac-salvage="${item.id}" ${equipped || item.locked ? "disabled" : ""}>星座分解</button>` : ""}
            <button class="ghost" type="button" data-salvage-item="${item.id}" ${equipped || item.locked || isZodiacItem(item) ? "disabled" : ""}>分解</button>
          </div>
        </article>
      `;
    })
    .join("") : `<article class="slot-card equipment-empty-state"><span class="slot-name">没有符合条件的装备</span><p class="slot-meta">可以切换筛选或继续挂机获取装备。</p></article>`}
  `;
}

function renderEquipmentFilterBar(count) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentFilterBar === "function") return runtime.renderEquipmentFilterBar(count);
  const filters = [
    ["all", "全部"],
    ["equipped", "已装备"],
    ["weapon", "武器"],
    ["armor", "防具"],
    ["headgear", "头饰"],
    ["shoes", "鞋子"],
    ["trinket", "饰品"],
    ["socketed", "有孔"],
    ["socketable", "可打孔"],
    ["set", "套装"],
    ["abyss", "深渊"],
    ["mythic", "神话"],
    ["darkGold", "暗金"],
    ["legend", "传说"],
    ["locked", "已锁定"],
    ["refinable", "可星炼"],
    ["salvageable", "可分解"],
  ];
  return `<div class="equipment-filter-bar">
    ${filters.map(([id, label]) => `<button type="button" data-equipment-filter="${id}" class="eq-filter-btn${equipmentFilter === id ? " active" : ""}">${label}</button>`).join("")}
    <label class="equipment-sort-control">排序
      <select data-equipment-sort>
        ${[
          ["score", "综合评分"],
          ["level", "装备等级"],
          ["rarity", "品质"],
          ["refine", "星炼等级"],
          ["sockets", "孔位数量"],
          ["recent", "最近获得"],
          ["output", "输出评分"],
          ["survival", "生存评分"],
          ["abyss", "深渊评分"],
          ["treasure", "打宝评分"],
        ].map(([id, label]) => `<option value="${id}" ${equipmentSort === id ? "selected" : ""}>${label}</option>`).join("")}
      </select>
    </label>
    <button type="button" data-equipment-show-all class="eq-filter-btn">${equipmentShowAll ? "收起" : `显示全部（${count}）`}</button>
  </div>`;
}

function filterEquipmentList(items) {
  const equippedIds = new Set(Object.values(state.equipped || {}).filter(Boolean));
  return items.filter((item) => {
    const slot = equipmentSlot(item);
    if (equipmentFilter === "equipped") return equippedIds.has(item.id);
    if (["weapon", "armor", "headgear", "shoes", "trinket"].includes(equipmentFilter)) return slot === equipmentFilter;
    if (equipmentFilter === "socketed") return getEquipmentCardSlotCount(item) > 0;
    if (equipmentFilter === "socketable") return getMaxEquipmentCardSlots(item) > getEquipmentCardSlotCount(item);
    if (equipmentFilter === "set") return Boolean(item.setId);
    if (equipmentFilter === "abyss") return isAbyssEquipment(item);
    if (equipmentFilter === "mythic") return item.rarity === "mythic";
    if (equipmentFilter === "darkGold") return item.rarity === "darkGold";
    if (equipmentFilter === "legend") return item.rarity === "legend";
    if (equipmentFilter === "locked") return Boolean(item.locked);
    if (equipmentFilter === "refinable") return (item.refine || 0) < 15 && hasMaterials(getRefineCost(item));
    if (equipmentFilter === "salvageable") return !equippedIds.has(item.id) && !item.locked && !isHighValueEquipment(item);
    return true;
  });
}

function sortEquipmentList(items) {
  const indexed = items.map((item, index) => ({ item, index }));
  const scoreOf = (item, key) => {
    const scores = calculateEquipmentScores(item, currentJob());
    if (key === "output") return scores.output || 0;
    if (key === "survival") return scores.survival || 0;
    if (key === "abyss") return scores.abyss || 0;
    if (key === "treasure") return scores.treasure || 0;
    return scores.comprehensive || itemScore(item);
  };
  indexed.sort((a, b) => {
    if (equipmentSort === "recent") return a.index - b.index;
    if (equipmentSort === "level") return (b.item.level || 0) - (a.item.level || 0);
    if (equipmentSort === "rarity") return rarityRank(b.item.rarity) - rarityRank(a.item.rarity);
    if (equipmentSort === "refine") return (b.item.refine || 0) - (a.item.refine || 0);
    if (equipmentSort === "sockets") return getEquipmentCardSlotCount(b.item) - getEquipmentCardSlotCount(a.item);
    return scoreOf(b.item, equipmentSort) - scoreOf(a.item, equipmentSort);
  });
  return indexed.map((entry) => entry.item);
}

function renderEquipmentBatchPanel() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentBatchPanel === "function") return runtime.renderEquipmentBatchPanel();
  return `<div class="slot-card equipment-batch-card">
    <span class="slot-name">装备批量处理</span>
    <p class="slot-meta">批量操作会跳过已穿戴、已锁定和高价值风险装备。</p>
    <div class="equipment-action-row">
      <button type="button" data-batch-equipment="lock-high-value">一键锁定高价值</button>
      <button type="button" data-batch-equipment="salvage-low">一键分解低品质</button>
      <button type="button" data-batch-equipment="salvage-normal-fine-rare">一键分解稀有及以下</button>
      <button type="button" data-batch-equipment="collect-zodiac">一键收藏星座</button>
      <button type="button" data-batch-equipment="salvage-duplicate-zodiac">一键分解重复星座</button>
    </div>
  </div>`;
}

function isHighValueEquipment(item) {
  return Boolean(
    rarityRank(item.rarity) >= rarityRank("legend") ||
      item.setId ||
      isAbyssEquipment(item) ||
      item.rarity === "mythic" ||
      item.rarity === "darkGold" ||
      (item.mechanicAffixes || []).length ||
      (item.abyssAffixes || []).length ||
      (item.refine || 0) >= 7 ||
      (item.empower || 0) > 0,
  );
}

function runEquipmentBatchAction(action) {
  if (action === "lock-high-value") {
    const targets = state.inventory.filter((item) => !item.locked && isHighValueEquipment(item));
    if (!targets.length) return showToast("暂无需要锁定的高价值装备");
    if (!window.confirm(`将锁定 ${targets.length} 件高价值装备，是否继续？`)) return;
    targets.forEach((item) => (item.locked = true));
    showToast(`已锁定 ${targets.length} 件装备`);
  } else if (action === "salvage-low" || action === "salvage-normal-fine-rare") {
    const equippedIds = new Set(Object.values(state.equipped || {}).filter(Boolean));
    const targets = state.inventory.filter((item) => !equippedIds.has(item.id) && !item.locked && ["normal", "fine", "rare"].includes(item.rarity) && !isHighValueEquipment(item));
    if (!targets.length) return showToast("暂无可安全批量分解的低品质装备");
    if (!window.confirm(`将分解 ${targets.length} 件低品质装备，是否继续？`)) return;
    const totals = {};
    let count = 0;
    targets.forEach((item) => {
      const result = salvageItem(item.id, { silent: true });
      if (!result?.ok) return;
      count += 1;
      Object.entries(result.rewards || {}).forEach(([material, amount]) => {
        totals[material] = (totals[material] || 0) + Number(amount || 0);
      });
    });
    showSalvageResultModal("批量分解完成", count, totals);
    showToast(`已分解 ${targets.length} 件装备`);
  } else if (action === "collect-zodiac") {
    const targets = state.inventory.filter((item) => isZodiacItem(item) && !item.locked && !Object.values(state.equipped || {}).includes(item.id));
    if (!targets.length) return showToast("暂无可收藏星座装备");
    if (!window.confirm(`将尝试收藏 ${targets.length} 件星座装备，已收藏部位会跳过，是否继续？`)) return;
    targets.forEach((item) => collectZodiacItem(item.id, { skipConfirm: true }));
  } else if (action === "salvage-duplicate-zodiac") {
    const targets = state.inventory.filter((item) => isDuplicateZodiacPiece(item) && !item.locked && !Object.values(state.equipped || {}).includes(item.id) && !["darkGold", "mythic"].includes(item.rarity) && !isAbyssEquipment(item));
    if (!targets.length) return showToast("暂无可安全分解的重复星座装备");
    if (!window.confirm(`将分解 ${targets.length} 件重复星座装备，是否继续？`)) return;
    targets.forEach((item) => decomposeZodiacItem(item.id, { skipConfirm: true }));
  }
  renderAll();
  save();
}

function isDuplicateZodiacPiece(item) {
  if (!isZodiacItem(item)) return false;
  const entry = state.zodiacCollection?.[item.setId];
  return Boolean(entry?.collectedPieceIds?.includes(item.templateId || item.id));
}

function equipmentVisualClass(item) {
  return [
    isAbyssEquipment(item) ? "equipment-detail-abyss" : "",
    item.rarity === "mythic" ? "equipment-detail-mythic" : "",
    item.rarity === "darkGold" ? "equipment-detail-darkgold" : "",
    item.setId ? "equipment-detail-set" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function renderEquipmentBadges(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentBadges === "function") return runtime.renderEquipmentBadges(item);
  const subTypeName = equipmentSubTypeName(item);
  const badges = [
    { text: rarityName(item.rarity), cls: "equipment-badge-rarity" },
    { text: slotName(item.slot), cls: "equipment-badge-slot" },
  ];
  if (subTypeName) badges.push({ text: subTypeName, cls: "equipment-badge-slot" });
  if (isAbyssEquipment(item)) badges.push({ text: "深渊", cls: "equipment-badge-abyss" });
  if (item.rarity === "mythic") badges.push({ text: "神话", cls: "equipment-badge-mythic" });
  if (item.setId) badges.push({ text: "套装", cls: "equipment-badge-set" });
  return `<div class="equipment-badge-row">${badges.map((badge) => `<span class="equipment-badge ${badge.cls}">${escapeHtml(badge.text)}</span>`).join("")}</div>`;
}

function renderMaps() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderMaps === "function") return runtime.renderMaps();
  els.mapList.innerHTML = maps
    .map((map, index) => {
      const locked = index > state.bestMap;
      const active = index === state.currentMap;
      const progress = active ? progressText() : locked ? "未开放" : "可探索";
      const dp = (state.mapDifficultyProgress || {})[map.id] || { normal: { unlocked: index === 0, cleared: false }, hard: { unlocked: false, cleared: false }, abyss: { unlocked: false, cleared: false } };
      const normalLocked = locked || !Boolean(dp.normal?.unlocked);
      const hardLocked = locked || !Boolean(dp.hard?.unlocked);
      const abyssLocked = locked || !Boolean(dp.abyss?.unlocked);
      const diffLabel = (d) => {
        const entry = dp[d];
        if (!entry) return "未开放";
        if (entry.cleared) return "已通关";
        if (entry.unlocked) return "已解锁";
        return d === "hard" ? "通关普通后解锁" : "通关困难后解锁";
      };
      const tooltip = mapDropTooltip(map);
      const range = getMapLevelRange(map);
      const previewDifficulty = active ? state.currentDifficulty : "normal";
      const preview = getMapPreviewStats(map, previewDifficulty);
      const recommendedScores = getRecommendedScoresForMap(map, previewDifficulty, false);
      const monsterNames = (map.monsters || []).map((monster) => monster.name).join(" / ");
      const difficultyLabel = active ? DIFFICULTY_CONFIG[state.currentDifficulty]?.label || "普通" : "普通 / 困难 / 深渊";
      const displayPower = previewDifficulty === "abyss"
        ? ABYSS_MAP_TIER_SCALE[map.id]?.recommendedPower || 350000
        : previewDifficulty === "hard"
          ? HARD_MAP_TIER_SCALE[map.id]?.recommendedPower || 130000
          : Math.round(range.recommendedPower * (DIFFICULTY_CONFIG[previewDifficulty]?.power || 1));
      const bossName = bossDisplayName(map, previewDifficulty);
      const exploration = getMapExplorationEntry(map.id);
      const nextNeed = MAP_EXPLORATION_REQUIREMENTS[Math.min(10, exploration.level + 1)] || MAP_EXPLORATION_REQUIREMENTS[10];
      const prevNeed = MAP_EXPLORATION_REQUIREMENTS[exploration.level] || 0;
      const exploreProgress = exploration.level >= 10 ? 100 : Math.min(100, ((exploration.points - prevNeed) / Math.max(1, nextNeed - prevNeed)) * 100);
      const exploreBonuses = getMapExplorationBonuses(map.id);
      return `
        <div class="map-item ${active ? "active" : ""} ${locked ? "locked" : ""}" data-tooltip="${escapeAttr(tooltip)}" title="${escapeAttr(tooltip)}">
          <div>
            <span class="map-name">${map.name}</span>
            <p class="map-meta">怪物：${monsterNames || map.enemy}</p>
            <p class="map-meta">推荐等级 ${range.minLevel}-${range.maxLevel} · 推荐战力 ${formatNumber(displayPower)} · 当前难度 ${difficultyLabel}</p>
            <p class="map-meta">等级 ${preview.levelRange[0]}-${preview.levelRange[1]} · HP ${formatRangeNumber(preview.hpRange)} · 攻击 ${formatRangeNumber(preview.attackRange)} · 防御 ${formatRangeNumber(preview.defenseRange)}</p>
            <p class="map-meta">推荐评分：输出 ${formatNumber(recommendedScores.output)} · 生存 ${formatNumber(recommendedScores.survival)}${recommendedScores.abyss ? ` · 深渊 ${formatNumber(recommendedScores.abyss)}` : ""}</p>
            <p class="map-meta">难度倍率：HP x${preview.difficulty.hp} / ATK x${preview.difficulty.attack} / EXP x${preview.difficulty.exp}</p>
            ${
              previewDifficulty === "abyss"
                ? `<p class="map-meta map-abyss-preview">深渊主要掉落：深渊前缀装备 / 深渊化套装 / 神话装备。神话掉率极低，变异怪与 Boss 机会更高。</p>`
                : ""
            }
            <p class="map-boss">${bossName} · ${map.bossSkill}</p>
            <p class="map-meta">进度 ${progress} · BASE ${map.baseExp} · JOB ${map.jobExp}</p>
            <div class="map-exploration">
              <div class="exploration-level">探索 Lv.${exploration.level} · ${formatNumber(exploration.points)} / ${formatNumber(nextNeed)}</div>
              <div class="exploration-progress"><span class="exploration-progress-fill" style="width:${exploreProgress}%"></span></div>
              <p class="exploration-bonus-list">金币/经验 +${percent(exploreBonuses.goldBonus)} · 材料掉率 +${percent(exploreBonuses.itemDropBonus)} · 装备掉率 +${percent(exploreBonuses.equipmentDropBonus)}</p>
            </div>
          </div>
          <div class="map-actions">
            <button type="button" data-map="${index}" data-difficulty="normal" ${normalLocked ? "disabled" : ""} title="${diffLabel("normal")}">普通</button>
            <button type="button" data-map="${index}" data-difficulty="hard" ${hardLocked ? "disabled" : ""} title="${diffLabel("hard")}">困难</button>
            <button type="button" data-map="${index}" data-difficulty="abyss" ${abyssLocked ? "disabled" : ""} title="${diffLabel("abyss")}">深渊</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderCards() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCards === "function") return runtime.renderCards();
  const cards = [...cardPool].sort((a, b) => {
    const favDelta = Number(Boolean(state.cardFavorites[b.id])) - Number(Boolean(state.cardFavorites[a.id]));
    return favDelta || a.map - b.map;
  });
  const grouped = cards.reduce((sum, card) => {
    const type = getCardType(card);
    sum[type] = sum[type] || [];
    sum[type].push(card);
    return sum;
  }, {});
  els.cardList.innerHTML = renderBossCardSynthesis() + Object.entries(grouped)
    .map(([type, rows]) => `<section class="card-type-section"><h3>${cardTypeLabel(type)}</h3>${rows
      .map((card) => {
        const count = state.cards[card.id] || 0;
        const awakened = state.awakenedCards?.[card.id] || 0;
        const favorite = Boolean(state.cardFavorites[card.id]);
        const locked = count <= 0;
        const effect = awakenedCardEffects(card);
        const typeLabel = getCardType(card);
        return `
        <div class="card-item ${favorite ? "favorite" : ""} ${locked ? "locked" : ""}">
          <div>
            <span class="card-name">${card.name} x ${count} · 觉醒 ${awakened}</span>
            <p class="card-meta">${cardEffectText(card)}</p>
            <p class="card-meta">${cardActivationText(card, count)}</p>
            <p class="card-meta">觉醒：六维 +${effect.attr} · 掉率 +${percent(effect.drop)} · 对怪伤害 +${percent(effect.monsterDamage)}</p>
            <p class="card-meta">用途：${cardUsageText(typeLabel, card)}</p>
            <p class="card-meta">${isBossSocketCard(card) ? "镶嵌：需要插入已打孔装备后生效；研究：后续开放。" : "持有：拥有后自动生效；研究：后续开放。"}</p>
          </div>
          <button class="ghost" data-awaken-card="${card.id}" type="button" ${count < AWAKEN_CARD_COST ? "disabled" : ""}>觉醒</button>
          <button class="favorite-button ${favorite ? "active" : ""}" data-card-favorite="${card.id}" type="button" ${locked ? "disabled" : ""}>☆</button>
        </div>
      `;
      })
      .join("")}</section>`)
    .join("");
}

function renderBossCardSynthesis() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderBossCardSynthesis === "function") return runtime.renderBossCardSynthesis();
  const shardCount = Number(state.materials?.bossCardShard || 0);
  return `
    <section class="card-type-section boss-card-synthesis">
      <h3>Boss卡合成</h3>
      <p class="card-meta">消耗 ${materialNames.bossCardShard || "Boss卡片碎片"} ×${BOSS_CARD_SYNTHESIS_COST}，可合成指定 Boss 卡。</p>
      <div class="card-synthesis-grid">
        ${bossCardPool
          .map((card) => `
            <div class="card-item">
              <div>
                <span class="card-name">${card.name}</span>
                <p class="card-meta">${cardEffectText(card)}</p>
                <p class="card-meta">碎片：${shardCount}/${BOSS_CARD_SYNTHESIS_COST}</p>
              </div>
              <button type="button" data-synthesize-boss-card="${card.id}" ${shardCount < BOSS_CARD_SYNTHESIS_COST ? "disabled" : ""}>合成</button>
            </div>
          `)
          .join("")}
      </div>
    </section>
  `;
}

function synthesizeBossCard(cardId) {
  const card = bossCardPool.find((entry) => entry.id === cardId);
  if (!card) return showToast("未找到可合成的Boss卡。");
  if ((state.materials.bossCardShard || 0) < BOSS_CARD_SYNTHESIS_COST) {
    return showToast(`${materialNames.bossCardShard || "Boss卡片碎片"}不足。`);
  }
  state.materials.bossCardShard -= BOSS_CARD_SYNTHESIS_COST;
  grantCardDrop(card, card.rarity || "legend", "Boss卡合成");
  showToast(`合成成功：${card.name}`);
  save();
  renderAll();
}

function getCardType(card = {}) {
  if (card.cardType) return card.cardType;
  if (String(card.id || "").includes("boss")) return "boss";
  if (state.currentDifficulty === "abyss" && String(card.id || "").includes("abyss")) return "abyss";
  return "monster";
}

function cardTypeLabel(type) {
  return { monster: "普通怪卡", elite: "精英怪卡", boss: "Boss卡", abyss: "深渊卡", zodiac: "星座圣卡" }[type] || "普通怪卡";
}

function cardSourceText(card = {}) {
  const mapName = maps[card.map]?.name || "未知地图";
  if (card.bossOnly) return `${mapName} Boss 极低概率掉落 / Boss碎片合成`;
  return `${mapName} 稀有掉落`;
}

function cardActivationText(card = {}, count = 0) {
  if (isBossSocketCard(card)) {
    return Number(count || 0) > 0 ? "插卡属性：需要镶嵌到装备后生效" : `插卡属性：未获得 · ${cardSourceText(card)}`;
  }
  return Number(count || 0) > 0 ? "持有属性：已生效" : `持有属性：未获得 · ${cardSourceText(card)}`;
}

function cardUsageText(type, card = {}) {
  const byId = {
    baphomet: "遭遇战清场 / 技能伤害 / Boss单体补偿",
    dracula: "续航吸血 / 技能命中回血 / 高难挂机稳定",
    doppelganger: "攻速普攻 / 暴击节奏 / 持续输出",
    phreeoni: "命中稳定 / 越级挑战 / 高等级怪对策",
    orc_hero: "生命防御 / 暴击抗性 / 高难生存",
    moonlight_flower: "挂机效率 / 巡逻效率 / 离线收益",
    drake: "Boss挑战 / 精英首领伤害 / 命中补强",
    turtle_general: "物理爆发 / 最终伤害 / 火焰爆发",
    dark_lord: "魔法输出 / 技能伤害 / 受击反击",
    golden_thief_bug: "插卡防御 / 魔法技能减伤 / 深渊减伤",
  };
  if (byId[card.id]) return byId[card.id];
  const uses = {
    monster: "持有基础属性 / 觉醒成长 / 后续研究",
    elite: "持有战斗收益 / 暴击攻速掉率 / 后续研究",
    boss: "插卡构筑 / Boss挑战 / 高价值装备养成",
    abyss: "深渊伤害 / 深渊减伤 / 神话权重",
    zodiac: "时装打造 / 星座收藏 / 高级转化材料",
  };
  return uses[type] || uses.monster;
}

let codexActiveTab = "monster";
let shopActiveTab = "normal";

function renderCodex() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCodex === "function") return runtime.renderCodex();
  if (!els.codexContent) return;
  els.codexContent.innerHTML = (codexActiveTab === "monster" ? renderCodexBonusesSummary() + renderMonsterCodex() : renderCodexBonusesSummary() + renderCardCodex());
  document.querySelectorAll(".codex-tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.codexTab === codexActiveTab);
  });
}

function buildMonsterNameMap() {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.buildMonsterNameMap === "function") return runtime.buildMonsterNameMap();
  const map = {};
  Object.values(mapMonsterConfig || {}).forEach((cfg) => {
    (cfg.monsters || []).forEach((m) => { if (m && m.id) map[m.id] = m.name || m.id; });
    const boss = cfg.bossTemplate;
    if (boss && boss.id) map[boss.id] = boss.name || boss.id;
  });
  return map;
}

function buildMonsterSourceMap() {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.buildMonsterSourceMap === "function") return runtime.buildMonsterSourceMap();
  const map = {};
  Object.entries(mapMonsterConfig || {}).forEach(([, cfg]) => {
    const mapName = cfg.name || "";
    (cfg.monsters || []).forEach((m) => {
      if (m && m.id) { if (!map[m.id]) map[m.id] = []; if (mapName && !map[m.id].includes(mapName)) map[m.id].push(mapName); }
    });
    const boss = cfg.bossTemplate;
    if (boss && boss.id && cfg.name) { if (!map[boss.id]) map[boss.id] = []; if (!map[boss.id].includes(cfg.name)) map[boss.id].push(cfg.name); }
  });
  return map;
}

function buildMonsterCardDropMap() {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.buildMonsterCardDropMap === "function") return runtime.buildMonsterCardDropMap();
  const map = {};
  cardPool.forEach((c) => { if (c.monsterId) { if (!map[c.monsterId]) map[c.monsterId] = []; map[c.monsterId].push(c.name || c.id); } });
  return map;
}

function getMonsterTypeLabel(id) {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.getMonsterTypeLabel === "function") return runtime.getMonsterTypeLabel(id);
  let type = null;
  Object.values(mapMonsterConfig || {}).forEach((cfg) => {
    if (cfg.bossTemplate && cfg.bossTemplate.id === id) type = cfg.name && cfg.name.includes("深渊") ? "深渊Boss" : "Boss";
    (cfg.monsters || []).forEach((m) => {
      if (m && m.id === id) {
        if (!type) type = m.type === "elite" ? "精英" : cfg.name && cfg.name.includes("深渊") ? "深渊怪" : "普通";
      }
    });
  });
  return type || "普通";
}

function renderMonsterCodex() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderMonsterCodex === "function") return runtime.renderMonsterCodex();
  const nameMap = buildMonsterNameMap();
  const sourceMap = buildMonsterSourceMap();
  const cardDropMap = buildMonsterCardDropMap();
  const allMonsterIds = new Set();
  Object.values(mapMonsterConfig || {}).forEach((cfg) => {
    (cfg.monsters || []).forEach((m) => { if (m && m.id) allMonsterIds.add(m.id); });
    if (cfg.bossTemplate && cfg.bossTemplate.id) allMonsterIds.add(cfg.bossTemplate.id);
  });
  cardPool.forEach((c) => { if (c.monsterId) allMonsterIds.add(c.monsterId); });
  const entries = [...allMonsterIds].map((id) => {
    const data = state.monsterCodex[id] || { killCount: 0, firstKilled: false, rewardsClaimed: {} };
    const name = nameMap[id] || materialNames[id] || id.replace(/_/g, " ");
    const sources = sourceMap[id] || [];
    const typeLabel = getMonsterTypeLabel(id);
    const cards = cardDropMap[id] || [];
    return { id, name, sources, typeLabel, cards, ...data };
  }).sort((a, b) => (b.killCount || 0) - (a.killCount || 0));
  return `<div class="codex-grid">${entries.map((entry) => {
    const kc = entry.killCount || 0;
    const unlocked = kc > 0;
    return `<article class="codex-card ${unlocked ? "unlocked" : "locked"}">
      <div class="codex-head">
        <strong>${unlocked ? escapeHtml(entry.name) : "？？？"}</strong>
        <small>击杀 ${formatNumber(kc)}</small>
      </div>
      <p class="codex-desc">${escapeHtml(entry.typeLabel)} · 熟练度 Lv.${getMonsterMasteryLevel(kc)} · 下阶 ${kc}/${(CODEX_MASTERY_THRESHOLDS[Math.min(5, getMonsterMasteryLevel(kc) + 1)] || "—")}</p>
      ${unlocked ? `<p class="codex-desc">${escapeHtml(entry.typeLabel)}${entry.sources.length ? " · 出现：" + entry.sources.map((s) => escapeHtml(s)).join(" / ") : ""}</p>` : ""}
      ${entry.cards.length ? `<p class="codex-desc">可能掉落：${entry.cards.map((s) => escapeHtml(s)).join(" / ")}</p>` : ""}
      <div class="codex-milestones">${CODEX_KILL_MILESTONES.map((ms, i) => {
        const done = kc >= ms;
        const claimed = entry.rewardsClaimed?.[ms] || false;
        const mType = getMonsterTypeForCodex(entry.id);
        const rewardList = CODEX_KILL_REWARDS[mType] || CODEX_KILL_REWARDS.normal;
        const reward = rewardList[i] || {};
        const label = CODEX_MILESTONE_LABELS[i] || (ms >= 10000 ? formatNumber(ms / 10000) + "万" : ms >= 1000 ? formatNumber(ms / 1000) + "千" : formatNumber(ms));
        let btnText = claimed ? "已领取" : done ? "可领取" : "未达成";
        let disabled = !done || claimed ? "disabled" : "";
        const itemsText = reward.items ? achievementRewardText(reward.items) : "";
        const statsText = reward.stats && Object.keys(reward.stats).length ? "永久属性：" + Object.entries(reward.stats).map(([k, v]) => `${statLabelName(k) || k} +${(v * 100).toFixed(2)}%`).join(" · ") : "";
        const rewardHtml = [itemsText ? `<span class="codex-reward-items">物品：${escapeHtml(itemsText)}</span>` : "", statsText ? `<span class="codex-reward-stats">${escapeHtml(statsText)}</span>` : ""].filter(Boolean).join("<br>") || "奖励";
        return `<span class="codex-milestone">
          <small>${escapeHtml(label)}</small>
          <span>${rewardHtml}</span>
          <button type="button" data-claim-codex="monster" data-monster-id="${entry.id}" data-milestone="${ms}" ${disabled}>${btnText}</button>
        </span>`;
      }).join("")}</div>
    </article>`;
  }).join("")}</div>`;
}

function renderCardCodex() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCardCodex === "function") return runtime.renderCardCodex();
  const allCards = cardPool.map((c) => {
    const data = state.cardCodex[c.id] || { obtained: false, obtainCount: 0, rewardsClaimed: {} };
    return { id: c.id, name: c.name, rarity: c.rarity || "rare", ...data };
  }).sort((a, b) => (b.obtainCount || 0) - (a.obtainCount || 0));
  const totalObtained = allCards.filter((c) => c.obtained).length;
  return `<div class="codex-collection-banner">
    <strong>卡片收集进度</strong>
    <span>已获得不同卡片：${totalObtained} 张</span>
    <div class="codex-milestones" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">${CODEX_CARD_MILESTONES.map((ms, i) => {
      const done = totalObtained >= ms;
      const claimed = state.codexRewardsClaimed?.card?.[ms] || false;
      const reward = CODEX_CARD_REWARDS[i] || {};
      let btnText = claimed ? "已领取" : done ? "可领取" : "未达成";
      let disabled = !done || claimed ? "disabled" : "";
      return `<span class="codex-milestone">
        <small>${ms}张</small>
        <span>${achievementRewardText(reward) || "奖励"}</span>
        <button type="button" data-claim-codex="card" data-milestone="${ms}" ${disabled}>${btnText}</button>
      </span>`;
    }).join("")}</div>
  </div>
  <div class="codex-grid">${allCards.map((entry) => {
    return `<article class="codex-card ${entry.obtained ? "unlocked" : "locked"}">
      <div class="codex-head">
        <span class="card-item-name">${entry.obtained ? escapeHtml(entry.name) : "？？？"}</span>
        <small>${entry.obtained ? `获得 ${entry.obtainCount} 张 · 研究 Lv.${getCardResearchLevel(entry.obtainCount)}` : "未获得"}</small>
      </div>
      ${entry.obtained ? `<p class="codex-desc">${escapeHtml(cardEffectText(cardPool.find((c) => c.id === entry.id) || {}))}</p>` : ""}
    </article>`;
  }).join("")}</div>`;
}

function claimCodexReward(type, monsterId, milestone) {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.claimCodexReward === "function") return runtime.claimCodexReward(type, monsterId, milestone);
  const num = Number(milestone);
  if (type === "monster") {
    const entry = state.monsterCodex[monsterId] || { killCount: 0, rewardsClaimed: {} };
    if (!entry.rewardsClaimed) entry.rewardsClaimed = {};
    if (entry.rewardsClaimed[num]) { showToast("已领取"); return; }
    const idx = CODEX_KILL_MILESTONES.indexOf(num);
    if (idx < 0 || (entry.killCount || 0) < num) { showToast("未达成"); return; }
    const mType = getMonsterTypeForCodex(monsterId);
    const rewardList = CODEX_KILL_REWARDS[mType] || CODEX_KILL_REWARDS.normal;
    const reward = rewardList[idx] || {};
    if (reward.items) grantGenericReward(reward.items);
    entry.rewardsClaimed[num] = true;
    state.monsterCodex[monsterId] = entry;
    const mnMap = buildMonsterNameMap();
    const mName = mnMap[monsterId] || materialNames[monsterId] || monsterId;
    addLog(`怪物图鉴奖励领取：${mName} ${num} 次击杀。`);
    showToast(`领取成功：${mName} ${num}次击杀奖励`);
  } else if (type === "card") {
    state.codexRewardsClaimed.card = state.codexRewardsClaimed.card || {};
    if (state.codexRewardsClaimed.card[num]) { showToast("已领取"); return; }
    const total = Object.values(state.cardCodex).filter((c) => c.obtained).length;
    if (total < num) { showToast("未达成"); return; }
    const idx = CODEX_CARD_MILESTONES.indexOf(num);
    if (idx < 0) { showToast("奖励数据异常"); return; }
    const reward = CODEX_CARD_REWARDS[idx] || {};
    grantGenericReward(reward);
    state.codexRewardsClaimed.card[num] = true;
    addLog(`卡片图鉴奖励领取：收集 ${num} 张不同卡片。`);
    showToast(`领取成功：收集 ${num} 张卡片里程碑奖励`);
  }
  renderAll();
  save();
}

function getCodexBonusStats() {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.getCodexBonusStats === "function") return runtime.getCodexBonusStats();
  const stats = { goldBonus: 0, expBonus: 0, dropBonus: 0, materialDropBonus: 0, hpBonus: 0, defBonus: 0, critRateBonus: 0, bossDamage: 0, bossDamageReduction: 0, bossEquipDropBonus: 0, bossQualityWeight: 0, abyssDamage: 0, abyssDamageReduction: 0, abyssMaterialDropBonus: 0, mythicQualityWeight: 0, cardDamage: 0, eliteDamageBonus: 0 };
  Object.entries(state.monsterCodex || {}).forEach(([monsterId, data]) => {
    const mType = getMonsterTypeForCodex(monsterId);
    const rewardList = CODEX_KILL_REWARDS[mType] || CODEX_KILL_REWARDS.normal;
    const claimed = data.rewardsClaimed || {};
    CODEX_KILL_MILESTONES.forEach((ms, i) => {
      if (claimed[ms]) {
        const r = rewardList[i] || {};
        if (r.stats) Object.entries(r.stats).forEach(([k, v]) => { stats[k] = (stats[k] || 0) + (v || 0); });
      }
    });
  });
  Object.keys(CODEX_STAT_CAPS).forEach((k) => { if (stats[k] !== undefined) stats[k] = Math.min(stats[k], CODEX_STAT_CAPS[k]); });
  return stats;
}

function getMonsterMasteryLevel(killCount) {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.getMonsterMasteryLevel === "function") return runtime.getMonsterMasteryLevel(killCount);
  const kc = Number(killCount) || 0;
  for (let i = CODEX_MASTERY_THRESHOLDS.length - 1; i > 0; i -= 1) if (kc >= CODEX_MASTERY_THRESHOLDS[i]) return i;
  return 0;
}

function getCardResearchLevel(obtainCount) {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.getCardResearchLevel === "function") return runtime.getCardResearchLevel(obtainCount);
  const oc = Number(obtainCount) || 0;
  for (let i = CODEX_RESEARCH_THRESHOLDS.length - 1; i > 0; i -= 1) if (oc >= CODEX_RESEARCH_THRESHOLDS[i]) return i;
  return 0;
}

function getMonsterTypeForCodex(monsterId) {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.getMonsterTypeForCodex === "function") return runtime.getMonsterTypeForCodex(monsterId);
  return getMonsterTypeLabel(monsterId) === "Boss" ? "boss" : getMonsterTypeLabel(monsterId) === "深渊Boss" ? "abyssBoss" : getMonsterTypeLabel(monsterId) === "深渊怪" ? "abyss" : getMonsterTypeLabel(monsterId) === "精英" ? "elite" : "normal";
}

function getCardTypeForCodex(cardId) {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.getCardTypeForCodex === "function") return runtime.getCardTypeForCodex(cardId);
  const card = cardPool.find((c) => c.id === cardId);
  if (!card) return "normal";
  const type = getCardType(card);
  if (type === "boss") return "boss";
  if (type === "abyss") return "abyss";
  return "normal";
}

function getCodexBonuses() {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.getCodexBonuses === "function") return runtime.getCodexBonuses();
  const bonuses = {
    goldBonus: 0, expBonus: 0, dropBonus: 0, materialDropBonus: 0, hpBonus: 0, defBonus: 0,
    critRateBonus: 0, bossDamage: 0, bossDamageReduction: 0, bossEquipDropBonus: 0, bossQualityWeight: 0,
    abyssDamage: 0, abyssDamageReduction: 0, abyssMaterialDropBonus: 0, mythicQualityWeight: 0,
    allStats: 0, hpPct: 0, cardDamage: 0,
    str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0,
  };
  Object.entries(state.monsterCodex || {}).forEach(([monsterId, data]) => {
    const level = getMonsterMasteryLevel(data.killCount || 0);
    if (level <= 0) return;
    const type = getMonsterTypeForCodex(monsterId);
    const tierBonuses = CODEX_MASTERY_BONUSES[type] || CODEX_MASTERY_BONUSES.normal;
    for (let i = 0; i < level; i += 1) {
      const b = tierBonuses[i] || {};
      Object.entries(b).forEach(([key, val]) => { bonuses[key] = (bonuses[key] || 0) + (val || 0); });
    }
  });
  Object.entries(state.cardCodex || {}).forEach(([cardId, data]) => {
    const level = getCardResearchLevel(data.obtainCount || 0);
    if (level <= 0) return;
    const type = getCardTypeForCodex(cardId);
    const tierBonuses = CODEX_RESEARCH_BONUSES[type] || CODEX_RESEARCH_BONUSES.normal;
    for (let i = 0; i < level; i += 1) {
      const b = tierBonuses[i] || {};
      Object.entries(b).forEach(([key, val]) => { bonuses[key] = (bonuses[key] || 0) + (val || 0); });
    }
  });
  const totalLevel = getTotalCodexLevel();
  bonuses.allStats = (bonuses.allStats || 0) + totalLevel * 0.001;
  bonuses.dropBonus = (bonuses.dropBonus || 0) + Math.floor(totalLevel / 5) * 0.002;
  bonuses.bossQualityWeight = (bonuses.bossQualityWeight || 0) + Math.floor(totalLevel / 10) * 0.001;
  bonuses.mythicQualityWeight = (bonuses.mythicQualityWeight || 0) + Math.floor(totalLevel / 20) * 0.0005;
  bonuses.dropBonus = Math.min(bonuses.dropBonus, CODEX_CAPS.globalDrop);
  bonuses.cardDamage = Math.min(bonuses.cardDamage, CODEX_CAPS.cardDamage);
  bonuses.bossQualityWeight = Math.min(bonuses.bossQualityWeight, CODEX_CAPS.bossQualityWeight);
  bonuses.mythicQualityWeight = Math.min(bonuses.mythicQualityWeight, CODEX_CAPS.mythicQualityWeight);
  bonuses.allStats = Math.min(bonuses.allStats, CODEX_CAPS.allStats);
  bonuses.abyssDamage = Math.min(bonuses.abyssDamage, CODEX_CAPS.abyssDamage);
  bonuses.abyssDamageReduction = Math.min(bonuses.abyssDamageReduction, CODEX_CAPS.abyssReduction);
  bonuses.bossDamage = Math.min(bonuses.bossDamage, CODEX_CAPS.bossDamage);
  bonuses.hpBonus = Math.min(bonuses.hpBonus, CODEX_CAPS.hpDef);
  bonuses.defBonus = Math.min(bonuses.defBonus, CODEX_CAPS.hpDef);
  return bonuses;
}

function getTotalCodexLevel() {
  const runtime = window.RuneFrontierCodexRuntime;
  if (runtime && typeof runtime.getTotalCodexLevel === "function") return runtime.getTotalCodexLevel();
  let sum = 0;
  Object.values(state.monsterCodex || {}).forEach((d) => { sum += getMonsterMasteryLevel(d.killCount || 0); });
  Object.values(state.cardCodex || {}).forEach((d) => { sum += getCardResearchLevel(d.obtainCount || 0); });
  return Math.floor(sum / 10);
}

function renderCodexBonusesSummary() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCodexBonusesSummary === "function") return runtime.renderCodexBonusesSummary();
  const b = getCodexBonuses();
  const tl = getTotalCodexLevel();
  const monsterSum = Object.values(state.monsterCodex || {}).reduce((s, d) => s + getMonsterMasteryLevel(d.killCount || 0), 0);
  const cardSum = Object.values(state.cardCodex || {}).reduce((s, d) => s + getCardResearchLevel(d.obtainCount || 0), 0);
  const lines = [`全属性 +${(b.allStats * 100).toFixed(1)}%`, `掉落 +${(b.dropBonus * 100).toFixed(2)}%`, `Boss伤害 +${(b.bossDamage * 100).toFixed(1)}%`];
  if (b.abyssDamage > 0) lines.push(`深渊伤害 +${(b.abyssDamage * 100).toFixed(1)}%`);
  if (b.hpBonus > 0) lines.push(`生命 +${(b.hpBonus * 100).toFixed(1)}%`);
  return `<div class="codex-collection-banner">
    <strong>总图鉴等级 Lv.${tl}</strong><small>经验 ${monsterSum + cardSum}（怪物熟练 ${monsterSum} + 卡片研究 ${cardSum}）</small>
    <p class="codex-desc">当前加成：${lines.join(" · ")}</p>
  </div>`;
}

function normalizeShopState() {
  const runtime = window.RuneFrontierShopRuntime;
  if (runtime && typeof runtime.normalizeShopState === "function") return runtime.normalizeShopState();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const day = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  const weekKey = weekStart.toISOString().slice(0, 10);
  if (state.shopState.lastDailyRefresh !== today) {
    state.shopState.dailyPurchases = {};
    state.shopState.lastDailyRefresh = today;
  }
  if (state.shopState.lastWeeklyRefresh !== weekKey) {
    state.shopState.weeklyPurchases = {};
    state.shopState.lastWeeklyRefresh = weekKey;
  }
  state.shopState.totalPurchases = state.shopState.totalPurchases || {};
}

function getShopPurchaseCount(itemId, type) {
  const runtime = window.RuneFrontierShopRuntime;
  if (runtime && typeof runtime.getShopPurchaseCount === "function") return runtime.getShopPurchaseCount(itemId, type);
  normalizeShopState();
  if (type === "daily") return state.shopState.dailyPurchases[itemId] || 0;
  if (type === "weekly") return state.shopState.weeklyPurchases[itemId] || 0;
  return state.shopState.totalPurchases[itemId] || 0;
}

function formatShopCostItem(id, amount) {
  const runtime = window.RuneFrontierShopRuntime;
  if (runtime && typeof runtime.formatShopCostItem === "function") return runtime.formatShopCostItem(id, amount);
  const safeAmount = Number(amount || 0);
  const amountText = Number.isFinite(safeAmount) ? Math.round(safeAmount).toLocaleString("zh-CN") : "0";
  if (id === "gold") return `金币 ${amountText}`;
  const name = materialNames[id] || `未知材料(${id})`;
  return `${name} ×${amountText}`;
}

function formatShopCost(cost = {}) {
  const runtime = window.RuneFrontierShopRuntime;
  if (runtime && typeof runtime.formatShopCost === "function") return runtime.formatShopCost(cost);
  const entries = Object.entries(cost || {}).filter(([, amount]) => Number(amount || 0) > 0);
  if (!entries.length) return "无消耗";
  return entries.map(([id, amount]) => formatShopCostItem(id, amount)).join(" + ");
}

function formatShopLimitText(item) {
  const runtime = window.RuneFrontierShopRuntime;
  if (runtime && typeof runtime.formatShopLimitText === "function") return runtime.formatShopLimitText(item);
  if (item.totalLimit) return `总计 ${getShopPurchaseCount(item.id, "total")}/${item.totalLimit}`;
  if (item.weeklyLimit) return `本周 ${getShopPurchaseCount(item.id, "weekly")}/${item.weeklyLimit}`;
  if (item.dailyLimit) return `今日 ${getShopPurchaseCount(item.id, "daily")}/${item.dailyLimit}`;
  return "";
}

function canBuyShopItem(item) {
  const runtime = window.RuneFrontierShopRuntime;
  if (runtime && typeof runtime.canBuyShopItem === "function") return runtime.canBuyShopItem(item);
  const tab = shopActiveTab;
  if (item.totalLimit && getShopPurchaseCount(item.id, "total") >= item.totalLimit) return "已售罄";
  if (item.weeklyLimit && getShopPurchaseCount(item.id, "weekly") >= item.weeklyLimit) return "本周已售罄";
  if (item.dailyLimit && getShopPurchaseCount(item.id, "daily") >= item.dailyLimit) return "今日已售罄";
  if (item.requireAbyss) {
    if (!state.mapDifficultyProgress || !Object.values(state.mapDifficultyProgress).some((d) => d.abyss?.unlocked || d.abyss?.cleared)) return "进入深渊后解锁";
  }
  if (item.requireBossCleared && !state.enemyBoss && !(state.totalKills > 0)) return "需击败过Boss";
  for (const [key, amount] of Object.entries(item.cost || {})) {
    if (key === "gold" && state.gold < amount) return "金币不足";
    if (key !== "gold" && (state.materials[key] || 0) < amount) return `${materialNames[key] || `未知材料(${key})`}不足`;
  }
  return null;
}

function buyShopItem(itemId) {
  const runtime = window.RuneFrontierShopRuntime;
  if (runtime && typeof runtime.buyShopItem === "function") return runtime.buyShopItem(itemId);
  const tab = shopActiveTab;
  const list = (typeof SHOP_ITEMS !== "undefined" ? SHOP_ITEMS[tab] : null);
  if (!list) return;
  const item = list.find((i) => i.id === itemId);
  if (!item) return;
  const blockReason = canBuyShopItem(item);
  if (blockReason) { showToast(blockReason); return; }
  for (const [key, amount] of Object.entries(item.cost || {})) {
    if (key === "gold") state.gold -= amount;
    else state.materials[key] = (state.materials[key] || 0) - amount;
  }
  const countType = item.totalLimit ? "total" : item.weeklyLimit ? "weekly" : "daily";
  if (countType === "total") state.shopState.totalPurchases[itemId] = (state.shopState.totalPurchases[itemId] || 0) + 1;
  else if (countType === "weekly") state.shopState.weeklyPurchases[itemId] = (state.shopState.weeklyPurchases[itemId] || 0) + 1;
  else state.shopState.dailyPurchases[itemId] = (state.shopState.dailyPurchases[itemId] || 0) + 1;
  if (item.priceScale) {
    const count = getShopPurchaseCount(itemId, "total");
    item.cost.gold = Math.round(1000000 * Math.pow(item.priceScale, count));
  }
  if (item.reward.materials) addMaterials(item.reward.materials);
  if (item.reward.materialBox) {
    Object.entries(item.reward.materialBox).forEach(([mat, range]) => {
      const qty = randomInt(range[0], range[1]);
      if (qty > 0) addMaterials({ [mat]: qty });
    });
  }
  if (item.reward.bagExpand && item.reward.bagExpand > 0) {
  }
  if (item.reward.bossTicket) {
  }
  addLog(`商店购买：${item.name}。`);
  showToast(`购买成功：${item.name}`);
  renderAll();
  save();
}

function renderShop() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderShop === "function") return runtime.renderShop();
  if (!els.shopContent) return;
  const tab = shopActiveTab;
  const list = (typeof SHOP_ITEMS !== "undefined" ? SHOP_ITEMS[tab] : null) || [];
  normalizeShopState();
  document.querySelectorAll("[data-shop-tab]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.shopTab === tab);
  });
  const hasAbyss = state.mapDifficultyProgress && Object.values(state.mapDifficultyProgress).some((d) => d.abyss?.unlocked || d.abyss?.cleared);
  els.shopContent.innerHTML = `<div class="codex-grid">${list.map((item) => {
    const reason = canBuyShopItem(item);
    const locked = reason && !reason.includes("不足") ? reason : "";
    const btnDisabled = reason ? "disabled" : "";
    const btnText = reason || "购买";
    const limitText = formatShopLimitText(item);
    const costText = formatShopCost(item.cost);
    return `<article class="shop-card ${locked ? "locked" : ""}">
      <div class="shop-head">
        <strong>${escapeHtml(item.name)}</strong>
        ${limitText ? `<small>${limitText}</small>` : ""}
      </div>
      <p class="shop-desc">${escapeHtml(item.desc)}</p>
      <p class="shop-cost">价格：${escapeHtml(costText)}</p>
      ${locked ? `<p class="shop-lock">${escapeHtml(locked)}</p>` : ""}
      <button type="button" data-buy-shop="${item.id}" ${btnDisabled}>${escapeHtml(btnText)}</button>
    </article>`;
  }).join("")}</div>`;
}

function renderVip() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderVip === "function") return runtime.renderVip();
  const vip = normalizeVip(state.vip);
  const progressInfo = getVipProgressInfo(vip);
  const bonuses = getVipBonuses(vip.level);
  const unlocked = getUnlockedVipMilestones(vip.level);
  const next = getNextVipMilestone(vip.level);
  const msHtml = unlocked.length
    ? unlocked.map((m) => `<span class="vip-milestone unlocked">✓ Lv.${m.level} ${escapeHtml(m.label)}</span>`).join("")
    : `<span class="vip-milestone">暂未解锁阶段特权，继续完成任务和成就提升荣誉。</span>`;
  const nextHtml = next
    ? `<p class="vip-next">下一阶段：Lv.${next.level} — ${escapeHtml(next.label)}<br>距离下一等级还需：${formatNumber(progressInfo.remaining)} 经验</p>`
    : `<p class="vip-next">已解锁全部冒险者荣誉特权。</p>`;
  const giftAvailable = state.vip?.dailyGiftClaimed !== todayKey();
  const dailyGiftHtml = giftAvailable ? `<button type="button" class="ghost" data-claim-vip-gift>领取每日礼包</button>` : `<span class="vip-next">今日礼包已领取</span>`;
  els.vipPanel.innerHTML = `
    <section class="vip-page-grid">
      <article class="vip-card vip-summary-card">
        <span class="vip-level">冒险者荣誉 Lv.${vip.level}</span>
        <p class="vip-meta">${progressInfo.isMax ? "已满级" : `进度 ${formatNumber(progressInfo.currentLevelExp)} / ${formatNumber(progressInfo.requiredForNext)} · 距离下一级 ${formatNumber(progressInfo.remaining)}`}</p>
        <div class="vip-progress"><div style="width:${Math.round(progressInfo.progressPct * 100)}%"></div></div>
        <div class="vip-daily-gift">${dailyGiftHtml}</div>
      </article>
      <article class="vip-card">
        <strong>当前基础收益</strong>
        <div class="vip-bonus-grid">
          <span>金币收益 <b>+${percent(bonuses.gold)}</b></span>
          <span>材料掉率 <b>+${percent(bonuses.itemDrop)}</b></span>
          <span>装备掉率 <b>+${percent(bonuses.equipmentDrop)}</b></span>
        </div>
      </article>
      <article class="vip-card">
        <strong>已解锁特权</strong>
        <div class="vip-milestones">${msHtml}</div>
      </article>
      <article class="vip-card">
        <strong>下一阶段特权</strong>
        ${nextHtml}
      </article>
    </section>
    <details class="vip-card vip-level-preview">
      <summary>全部等级预览</summary>
      <section class="vip-table">
        ${Array.from({ length: VIP_MAX_LEVEL }, (_, index) => {
          const level = index + 1;
          const row = getVipBonuses(level);
          const hasMs = VIP_MILESTONE_BONUSES[level];
          return `<div class="vip-row ${vip.level >= level ? "active" : ""}">
            <strong>Lv.${level}${hasMs ? " ★" : ""}</strong>
            <span>累计 ${formatNumber(VIP_EXP_REQUIREMENTS[level])}</span>
            <span>金币 +${percent(row.gold)}</span>
            <span>材料 +${percent(row.itemDrop)}</span>
            <span>装备 +${percent(row.equipmentDrop)}</span>
            ${hasMs ? `<span class="vip-milestone-tag">${escapeHtml(hasMs.label)}</span>` : "<span></span>"}
          </div>`;
        }).join("")}
      </section>
    </details>
  `;
}

function renderTasks() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderTasks === "function") return runtime.renderTasks();
  const main = state.quests.active.filter((quest) => quest.category === "main");
  const daily = state.quests.active.filter((quest) => quest.category === "daily");
  els.taskPage.innerHTML = `
    ${renderTaskSection("主线任务", main)}
    ${renderTaskSection("日常任务", daily)}
    ${renderDailyGoals()}
    ${renderAchievementPage()}
  `;
}

function renderDailyGoals() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderDailyGoals === "function") return runtime.renderDailyGoals();
  state.dailyGoals = normalizeDailyGoals(state.dailyGoals);
  return `<section class="quest-section daily-goal-section">
    <h3>每日目标</h3>
    <div class="quest-task-list">${state.dailyGoals.goals.map((goal) => {
      const done = Number(goal.progress || 0) >= goal.target;
      return `<article class="quest-card ${done ? "quest-completed" : ""} ${goal.claimed ? "quest-claimed" : ""}">
        <div>
          <strong class="quest-title">${escapeHtml(goal.title)}</strong>
          <p class="quest-desc">${formatNumber(Math.min(goal.progress, goal.target))} / ${formatNumber(goal.target)}</p>
          <div class="quest-progress"><span style="width:${Math.min(100, (goal.progress / goal.target) * 100)}%"></span></div>
          <p class="quest-rewards">${achievementRewardText(goal.reward)}</p>
        </div>
        <button class="quest-claim-btn" data-claim-daily-goal="${goal.id}" type="button" ${!done || goal.claimed ? "disabled" : ""}>${goal.claimed ? "已领取" : done ? "领取奖励" : "进行中"}</button>
      </article>`;
    }).join("")}</div>
  </section>`;
}

function renderAchievementPage() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderAchievementPage === "function") return runtime.renderAchievementPage();
  const groups = ACHIEVEMENT_DB.reduce((map, achievement) => {
    map[achievement.category] = map[achievement.category] || [];
    map[achievement.category].push(achievement);
    return map;
  }, {});
  return `<section class="achievement-page">
    <h3>成就</h3>
    ${Object.entries(groups)
      .map(([category, achievements]) => `<div class="achievement-section"><h4>${category}</h4><div class="achievement-list">${achievements.map(renderAchievementCard).join("")}</div></div>`)
      .join("")}
  </section>`;
}

function renderAchievementCard(achievement) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderAchievementCard === "function") return runtime.renderAchievementCard(achievement);
  const entry = getAchievementEntry(achievement.id);
  const done = entry.unlocked || entry.progress >= achievement.target;
  return `<article class="achievement-card ${done ? "achievement-done" : ""} ${entry.claimed ? "achievement-claimed" : ""}">
    <div>
      <strong class="achievement-title">${achievement.title}</strong>
      <p class="quest-desc">${achievement.description}</p>
      <div class="quest-progress achievement-progress"><span style="width:${Math.min(100, (entry.progress / achievement.target) * 100)}%"></span></div>
      <p class="quest-desc">${formatNumber(Math.min(entry.progress, achievement.target))} / ${formatNumber(achievement.target)}</p>
      <p class="quest-rewards">${achievementRewardText(achievement.reward)}</p>
    </div>
    <button class="achievement-claim-btn" type="button" data-claim-achievement="${achievement.id}" ${!done || entry.claimed ? "disabled" : ""}>${entry.claimed ? "已领取" : done ? "领取奖励" : "进行中"}</button>
  </article>`;
}

function achievementRewardText(reward = {}) {
  const parts = [];
  if (reward.gold) parts.push(`金币 ${formatNumber(reward.gold)}`);
  if (reward.vipExp) parts.push(`VIP经验 ${formatNumber(reward.vipExp)}`);
  if (reward.materials) parts.push(materialText(reward.materials));
  if (reward.titleId) parts.push(`称号「${TITLE_DB[reward.titleId]?.name || reward.titleId}」`);
  return `奖励：${parts.join(" · ") || "无"}`;
}

function renderTaskSection(title, quests) {
  return `<section class="quest-section">
    <h3>${title}</h3>
    <div class="quest-task-list">${quests.map(renderTaskCard).join("") || `<p class="quest-desc">暂无任务</p>`}</div>
  </section>`;
}

function renderTaskCard(quest) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderTaskCard === "function") return runtime.renderTaskCard(quest);
  const done = quest.completed || quest.currentCount >= quest.requiredCount;
  const claimed = quest.claimed;
  const buttonText = claimed ? "已领取" : done ? "领取奖励" : "进行中";
  return `<article class="quest-card ${done ? "quest-completed" : ""} ${claimed ? "quest-claimed" : ""}">
    <div>
      <strong class="quest-title">${quest.title}</strong>
      <p class="quest-desc">${quest.description}</p>
      <div class="quest-progress"><span style="width:${Math.min(100, (quest.currentCount / quest.requiredCount) * 100)}%"></span></div>
      <p class="quest-desc">${formatNumber(quest.currentCount)} / ${formatNumber(quest.requiredCount)}</p>
      <p class="quest-rewards">${questRewardText(quest.rewards)}</p>
    </div>
    <button class="quest-claim-btn" data-claim-quest="${quest.id}" type="button" ${!done || claimed ? "disabled" : ""}>${buttonText}</button>
  </article>`;
}

function questRewardText(rewards = {}) {
  const parts = [];
  if (rewards.vipExp) parts.push(`VIP经验 ${rewards.vipExp}`);
  if (rewards.materials && Object.keys(rewards.materials).length) parts.push(materialText(rewards.materials));
  if (rewards.randomEquipment) parts.push("随机装备 x 1");
  return `奖励：${parts.join(" · ") || "无"}`;
}

function awakenCard(id) {
  const count = state.cards[id] || 0;
  if (count < AWAKEN_CARD_COST) {
    showToast("卡片数量不足 100 张");
    return;
  }
  state.cards[id] = count - AWAKEN_CARD_COST;
  state.awakenedCards[id] = (state.awakenedCards[id] || 0) + 1;
  addLog(`${cardName(id)} 觉醒成功，获得 1 张觉醒卡片。`);
  renderAll();
  save();
}

function renderQuestList() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderQuestList === "function") return runtime.renderQuestList();
  if (!els.questList) return;
  const progress = progressText();
  els.questList.innerHTML = `
    <div class="quest-item">
      <span class="quest-name">清理魔物</span>
      <p class="quest-meta">${state.enemyBoss ? progress : `${progress} 后可挑战本地图首领`}</p>
    </div>
    <div class="quest-item">
      <span class="quest-name">当前首领</span>
      <p class="quest-meta">${bossDisplayName(currentMap())} · ${currentMap().bossSkill}</p>
    </div>
    <div class="quest-item">
      <span class="quest-name">技能触发</span>
      <p class="quest-meta">${state.skillLog[0] || "挂机时会按概率释放已解锁主动技能"}</p>
    </div>
  `;
}

function renderPartyList() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderPartyList === "function") return runtime.renderPartyList();
  if (!els.partyList) return;
  const stats = computeStats();
  els.partyList.innerHTML = `
    ${renderAdvicePanel(stats)}
    <div class="party-item">
      <span class="party-name">主角 · ${currentJob().name}</span>
      <p class="party-meta">BASE ${state.hero.baseLevel} · JOB ${state.hero.jobLevel} · 输出 ${formatNumber(stats.dps)}</p>
    </div>
    <div class="party-item">
      <span class="party-name">技能记录</span>
      <p class="party-meta">${state.skillLog.slice(0, 3).join(" / ") || "尚未触发主动技能"}</p>
    </div>
    ${renderSessionRewardPanel()}
  `;
}

function renderAdvicePanel(stats = computeStats()) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderAdvicePanel === "function") return runtime.renderAdvicePanel(stats);
  const goal = getCurrentGoal(stats);
  const weakness = getPlayerWeakness(stats);
  const actions = getRecommendedActions(stats, weakness).slice(0, 4);
  const scoreGap = getCurrentRecommendedScoreGap(stats, goal.gateTarget);
  return `<div class="party-item advice-panel">
    <span class="party-name">当前建议</span>
    <div class="advice-focus"><strong>当前目标：${escapeHtml(goal.title)}</strong><small>${escapeHtml(goal.reason)}</small></div>
    ${renderRecommendedScoreGap(scoreGap)}
    <div class="advice-focus"><strong>当前短板：${escapeHtml(weakness.title)}</strong><small>${escapeHtml(weakness.description)}</small></div>
    <div class="advice-list">
      <span>推荐提升：${weakness.recommended.map((entry) => `${escapeHtml(entry.name)}（${escapeHtml(entry.reason)}）`).join("、")}</span>
      ${actions.length ? actions.map((text) => `<span>${escapeHtml(text)}</span>`).join("") : "<span>当前成长状态良好，继续挂机即可。</span>"}
    </div>
  </div>`;
}

function calculatePlayerRatingScores(stats = computeStats()) {
  const output = Math.round(
    (stats.dps || 0) * 220 +
      Math.max(stats.physicalAttack || 0, stats.magicAttack || 0) * 80 +
      (stats.critRate || stats.crit || 0) * 24000 +
      (stats.critDamageBonus || 0) * 22000 +
      (stats.finalDamageBonus || 0) * 36000 +
      (stats.skillDamageBonus || 0) * 18000,
  );
  const survival = Math.round(
    (stats.maxHp || 0) * 0.75 +
      (stats.defense || 0) * 430 +
      (stats.damageReductionPct || 0) * 65000 +
      (stats.dodgeRate || 0) * 26000 +
      (stats.hpRegen || 0) * 80,
  );
  const boss = Math.round(output * 0.42 + (stats.bossDamageBonus || 0) * 52000 + (stats.eliteDamageBonus || 0) * 36000 + (stats.finalDamageBonus || 0) * 24000);
  const abyss = Math.round(
    output * 0.24 +
      survival * 0.28 +
      (stats.abyssDamageBonus || 0) * 76000 +
      (stats.abyssDamageReduction || 0) * 90000 +
      (stats.abyssBossDamageBonus || 0) * 52000 +
      (stats.mythicWeightBonus || 0) * 26000,
  );
  return {
    output: Math.max(0, output),
    survival: Math.max(0, survival),
    boss: Math.max(0, boss),
    abyss: Math.max(0, abyss),
  };
}

function getCurrentRecommendedScoreGap(stats = computeStats(), gateTarget = null) {
  const monster = currentMonsterStats();
  const difficultyType = gateTarget?.difficultyType || monster.difficultyType || getMonsterDifficultyType({ isBoss: state.enemyBoss, monster, mutation: monster.mutation, difficultyId: state.currentDifficulty });
  const recommended = gateTarget
    ? getRecommendedScoresForMap(gateTarget.map || currentMap(), gateTarget.difficulty || state.currentDifficulty, Boolean(gateTarget.isBoss), difficultyType)
    : monster.recommendedScores || getRecommendedScoresForMonster(currentMap(), difficultyType, state.enemyBoss);
  const player = calculatePlayerRatingScores(stats);
  const keys = ["output", "survival"];
  if (state.enemyBoss || recommended.boss > 0 || gateTarget?.difficulty === "hard") keys.push("boss");
  if (state.currentDifficulty === "abyss" || recommended.abyss > 0 || gateTarget?.difficulty === "abyss") keys.push("abyss");
  return keys.map((key) => ({
    key,
    label: { output: "输出评分", survival: "生存评分", boss: "Boss评分", abyss: "深渊评分" }[key] || key,
    current: Math.max(0, Math.round(player[key] || 0)),
    required: Math.max(0, Math.round(recommended[key] || 0)),
  })).filter((entry) => entry.required > 0);
}

function renderRecommendedScoreGap(entries = []) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderRecommendedScoreGap === "function") return runtime.renderRecommendedScoreGap(entries);
  if (!entries.length) return "";
  return `<div class="advice-focus advice-score-gap">
    <strong>推荐评分</strong>
    <div class="advice-list">${entries.map((entry) => {
      const low = entry.current < entry.required * 0.88;
      return `<span class="${low ? "warning" : ""}">${entry.label}：${formatNumber(entry.current)} / ${formatNumber(entry.required)}</span>`;
    }).join("")}</div>
  </div>`;
}

function getCurrentGoal(stats = computeStats()) {
  if (state.hero.baseLevel >= maxBaseLevel()) return { title: "进行转生", reason: "你已达到当前 BASE 上限，转生后可提高成长上限和稀有装备品质权重。" };
  if (hasPendingOfflineRewards() || state.lootNotifyUnread) return { title: "查看最近战利品", reason: "有新的战利品尚未清点，先处理新装备和材料能避免背包压力。" };
  if ((state.inventory || []).length >= getInventoryLimit() * 0.85) return { title: "处理装备", reason: "背包空间紧张，建议分解低品质装备并锁定高价值装备。" };
  if (isBossChallengeReady()) return { title: "挑战 Boss", reason: "当前地图首领进度已满，Boss 更容易产出高品质装备和首领材料。" };
  const gate = getDifficultyGateTarget();
  if (gate?.difficulty === "hard") return { title: "准备进入困难难度", reason: "你已经接近普通地图毕业，但困难是新的难度阶级，怪物攻击、生存压力、命中和暴击都会明显提高。", gateTarget: gate };
  if (gate?.difficulty === "abyss") return { title: "准备进入深渊", reason: "深渊是终局入口，能刷困难高级地图并不代表可以稳定刷深渊，需要深渊伤害、深渊减伤和更高生存能力。", gateTarget: gate };
  const abyssPower = ABYSS_MAP_TIER_SCALE[currentMap().id]?.recommendedPower || 120000;
  if (stats.power >= abyssPower && (stats.abyssDamageBonus || 0) + (stats.abyssDamageReduction || 0) < 0.22) return { title: "提升深渊能力", reason: "你已接近深渊门槛，但深渊伤害和深渊减伤仍偏低。" };
  if (stats.power >= abyssPower) return { title: "推荐刷深渊", reason: "当前战力已达到本地图深渊推荐区间，可以尝试获取深渊前缀和神话装备。" };
  if ((state.inventory || []).some((item) => isZodiacItem(item) && !isDuplicateZodiacPiece(item) && !item.locked)) return { title: "收藏星座装备", reason: "背包中有未收藏的星座部件，收藏进度能带来套装图鉴收益。" };
  return { title: "推荐推图", reason: "继续提升等级、装备和精造，逐步推进到更高地图和 Boss。" };
}

function getDifficultyGateTarget() {
  const lastMapIndex = Math.max(0, maps.length - 1);
  if (state.currentDifficulty === "normal" && state.currentMap >= lastMapIndex) {
    return { difficulty: "hard", difficultyType: "hard", map: maps[0], isBoss: false };
  }
  if (state.currentDifficulty === "hard" && state.currentMap >= lastMapIndex) {
    return { difficulty: "abyss", difficultyType: "abyss", map: maps[0], isBoss: false };
  }
  return null;
}

function getPlayerWeakness(stats = computeStats()) {
  const monster = currentMonsterStats();
  const gaps = getCurrentRecommendedScoreGap(stats, getDifficultyGateTarget());
  const low = (key, ratio = 0.88) => gaps.some((entry) => entry.key === key && entry.current < entry.required * ratio);
  const killSeconds = monster.maxHp / Math.max(1, stats.dps);
  const hpScore = stats.maxHp / Math.max(1, monster.attack * 8);
  const abyssPower = ABYSS_MAP_TIER_SCALE[currentMap().id]?.recommendedPower || 120000;
  const equipped = Object.values(state.equipped || {}).map((id) => state.inventory.find((item) => item.id === id)).filter(Boolean);
  const avgRank = equipped.length ? equipped.reduce((sum, item) => sum + Math.max(0, rarityRank(item.rarity)), 0) / equipped.length : 0;
  if (state.hero.baseLevel >= maxBaseLevel()) return weaknessPreset("可转生");
  if (low("abyss", 0.9)) return weaknessPreset("深渊能力不足");
  if (low("boss", 0.9)) return weaknessPreset("Boss能力不足");
  if (low("survival", 0.85)) return weaknessPreset("生存不足");
  if (low("output", 0.85)) return weaknessPreset("输出不足");
  if ((state.currentDifficulty === "abyss" || stats.power >= abyssPower * 0.75) && ((stats.abyssDamageBonus || 0) < 0.18 || (stats.abyssDamageReduction || 0) < 0.08)) return weaknessPreset("深渊能力不足");
  if (hpScore < 1.4 || (stats.damageReductionPct || 0) < 0.05) return weaknessPreset("生存不足");
  if (killSeconds > 18) return weaknessPreset("输出不足");
  if ((stats.critRate || stats.crit || 0) < 0.12 && (stats.critDamageBonus || 0) < 0.2) return weaknessPreset("暴击不足");
  if (isBossChallengeReady() && ((stats.bossDamageBonus || 0) + (stats.eliteDamageBonus || 0)) < 0.12) return weaknessPreset("Boss能力不足");
  if (avgRank < rarityRank("epic")) return weaknessPreset("装备质量不足");
  return weaknessPreset("成长正常");
}

function weaknessPreset(type) {
  const presets = {
    输出不足: { title: "输出不足", description: "击杀效率偏低，建议提升武器、攻击、暴击率、暴击伤害和最终伤害。", recommended: [["攻击", "提高普攻和物理技能伤害"], ["暴击率", "增加爆发频率"], ["暴击伤害", "放大暴击收益"], ["攻速", "提高攻击频率"], ["最终伤害", "直接提高输出"]] },
    生存不足: { title: "生存不足", description: "生命、防御或减伤偏低，在高难地图中容易被击杀。", recommended: [["生命", "提高承伤空间"], ["防御", "降低怪物基础伤害"], ["伤害减免", "稳定降低最终伤害"], ["吸血", "提高持续挂机稳定性"], ["生命恢复", "补足续航"]] },
    暴击不足: { title: "暴击不足", description: "暴击体系尚未成型，爆发能力偏弱。", recommended: [["暴击率", "提高暴击触发"], ["暴击伤害", "提高暴击收益"], ["LUK", "提供暴击和掉率"], ["攻速", "增加触发次数"]] },
    Boss能力不足: { title: "Boss 能力不足", description: "Boss 专项伤害偏低，挑战首领时效率和安全性不足。", recommended: [["Boss伤害", "提高首领战输出"], ["精英/首领伤害", "覆盖精英与 Boss"], ["最终伤害", "提高所有输出"], ["暴击伤害", "提升爆发"], ["吸血", "提高 Boss 战续航"]] },
    深渊能力不足: { title: "深渊能力不足", description: "深渊伤害和深渊减伤不足，进入深渊后效率较低且死亡风险较高。", recommended: [["深渊伤害", "提高深渊怪击杀效率"], ["深渊减伤", "降低深渊怪物伤害"], ["生命", "提高容错"], ["防御", "减少承伤"], ["吸血", "提升深渊续航"]] },
    装备质量不足: { title: "装备质量不足", description: "当前穿戴装备平均品质偏低，武器或防具可能落后于当前阶段。", recommended: [["武器攻击", "提升主要输出"], ["装备品质", "提高基础面板"], ["装备精造", "提升装备成长"], ["暗金/神话/深渊装备", "进入后期装备目标"]] },
    可转生: { title: "可转生", description: "你已达到当前等级上限，转生能提高成长上限和稀有装备品质权重。", recommended: [["转生", "突破等级上限"], ["基础六维", "转生后成长更高"], ["装备品质权重", "提高稀有装备倾向"]] },
    成长正常: { title: "成长正常", description: "当前没有明显短板，继续挂机、推图或挑战 Boss 即可。", recommended: [["推图", "解锁更高收益地图"], ["Boss", "获取高品质装备"], ["精造", "稳定提升战力"]] },
  };
  const preset = presets[type] || presets.成长正常;
  return { ...preset, recommended: preset.recommended.map(([name, reason]) => ({ name, reason })) };
}

function getRecommendedActions(stats = computeStats(), weakness = getPlayerWeakness(stats)) {
  const actions = [];
  if (state.lootNotifyUnread || hasPendingOfflineRewards()) actions.push("查看最近战利品，处理新获得的装备和材料。");
  if (state.hero.baseLevel >= maxBaseLevel()) actions.push("优先进行转生，提升成长上限和稀有装备品质权重。");
  if (isBossChallengeReady()) actions.push("挑战当前 Boss，尝试获取更高品质装备。");
  if ((state.inventory || []).length >= getInventoryLimit() * 0.75) actions.push("分解低品质装备，腾出背包并获取强化材料。");
  if (weakness.title.includes("深渊")) actions.push("刷取深渊装备，优先选择深渊减伤、深渊伤害和生命词条。");
  if (weakness.title.includes("输出")) actions.push("强化当前武器，优先替换输出评分更高的装备。");
  if (weakness.title.includes("生存")) actions.push("优先提升防具和鞋子，寻找生命、防御、伤害减免属性。");
  if (weakness.title.includes("Boss")) actions.push("准备 Boss 装，优先选择 Boss伤害、精英/首领伤害和吸血。");
  if (!actions.length) actions.push("继续挂机积累资源，并尝试挑战下一张地图。");
  if (state.autoSalvage?.enabled) actions.push("已开启自动分解：普通品质装备自动转化为材料。");
  return [...new Set(actions)];
}

function renderLog() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderLog === "function") return runtime.renderLog();
  els.logList.innerHTML = state.log
    .map((entry) => {
      if (typeof entry === "object" && entry.html) return `<li>${entry.html}</li>`;
      return `<li>${escapeHtml(String(entry))}</li>`;
    })
    .join("");
}

function drawScene(time) {
  const canvas = els.sceneCanvas;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const map = currentMap();
  const colors = map.palette;

  ctx.clearRect(0, 0, width, height);
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, colors[0]);
  sky.addColorStop(0.68, "#f3e6c8");
  sky.addColorStop(1, "#d7b77a");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  drawCloud(ctx, 100 + Math.sin(time * 0.2) * 16, 80, 1.2);
  drawCloud(ctx, 670 + Math.cos(time * 0.17) * 22, 95, 0.9);

  ctx.fillStyle = colors[2];
  drawHill(ctx, -80, 330, 330, 150);
  drawHill(ctx, 190, 340, 360, 170);
  drawHill(ctx, 520, 330, 420, 160);

  ctx.fillStyle = colors[1];
  ctx.fillRect(0, 340, width, 180);
  ctx.fillStyle = "rgba(255, 250, 240, 0.28)";
  for (let i = 0; i < 16; i += 1) {
    const x = (i * 72 + time * 24) % (width + 80) - 40;
    ctx.fillRect(x, 394 + Math.sin(i) * 18, 40, 3);
  }

  drawHero(ctx, 190, 344 + Math.sin(time * 3.1) * 4, currentJob().color, currentJob().id, time);
  drawEnemy(ctx, 680, 340 + Math.sin(time * 2) * 7, state.enemyBoss ? 1.55 : 1, time);
  drawFloatTexts(ctx);

  ctx.fillStyle = "rgba(49, 84, 65, 0.24)";
  ctx.fillRect(0, height - 34, width, 34);
}

function drawFloatTexts(ctx) {
  ctx.save();
  ctx.font = "800 24px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  state.floatTexts.forEach((entry) => {
    const alpha = Math.max(0, 1 - entry.age / entry.ttl);
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 250, 240, 0.9)";
    ctx.fillStyle = entry.color;
    ctx.strokeText(entry.text, entry.x, entry.y);
    ctx.fillText(entry.text, entry.x, entry.y);
  });
  ctx.restore();
}

function drawCloud(ctx, x, y, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255, 250, 240, 0.74)";
  ctx.beginPath();
  ctx.arc(0, 18, 24, 0, Math.PI * 2);
  ctx.arc(28, 8, 30, 0, Math.PI * 2);
  ctx.arc(62, 20, 22, 0, Math.PI * 2);
  ctx.fillRect(-4, 18, 72, 24);
  ctx.fill();
  ctx.restore();
}

function drawHill(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.quadraticCurveTo(x + w * 0.5, y - h, x + w, y + h);
  ctx.closePath();
  ctx.fill();
}

function drawHero(ctx, x, y, color, kind, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(39, 49, 59, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 58, 42, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  if (drawAuthorizedJobSprite(ctx, kind, time)) {
    ctx.restore();
    return;
  }

  const bounce = Math.sin(time * 4) * 2;
  const magicJobs = ["mage", "wizard", "highWizard", "warlock", "acolyte", "priest", "highPriest", "archbishop"];
  const bowJobs = ["archer", "hunter", "sniper", "ranger"];
  const knifeJobs = ["thief", "assassin", "assassinCross", "guillotineCross"];
  const smithJobs = ["merchant", "blacksmith", "whiteSmith", "mechanic"];
  const swordJobs = ["swordman", "knight", "lordKnight", "runeKnight"];

  ctx.translate(0, bounce);
  ctx.strokeStyle = "#3e3029";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-13, 30);
  ctx.lineTo(-21, 58);
  ctx.moveTo(13, 30);
  ctx.lineTo(23, 58);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-22, 0, 44, 42, 9);
  ctx.fill();
  ctx.fillStyle = "rgba(255,250,240,0.55)";
  ctx.fillRect(-15, 7, 30, 6);

  ctx.fillStyle = "#f2c28d";
  ctx.beginPath();
  ctx.arc(0, -18, 23, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2b2730";
  ctx.beginPath();
  ctx.arc(-8, -19, 3, 0, Math.PI * 2);
  ctx.arc(8, -19, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6d4633";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, -13, 9, 0.2, Math.PI - 0.2);
  ctx.stroke();

  ctx.fillStyle = "#6b4a3d";
  ctx.beginPath();
  ctx.arc(0, -29, 24, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = magicJobs.includes(kind) ? "#fff1b8" : swordJobs.includes(kind) ? "#d8c08a" : bowJobs.includes(kind) ? "#79a86a" : knifeJobs.includes(kind) ? "#756b9d" : smithJobs.includes(kind) ? "#c48b55" : "#d8c08a";
  ctx.beginPath();
  if (magicJobs.includes(kind)) {
    ctx.moveTo(-18, -34);
    ctx.lineTo(0, -66);
    ctx.lineTo(18, -34);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.roundRect(-22, -40, 44, 13, 5);
    ctx.fill();
    ctx.fillRect(-12, -52, 24, 15);
  }

  ctx.fillStyle = color;
  ctx.strokeStyle = "#fffaf0";
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (magicJobs.includes(kind)) {
    ctx.moveTo(26, 24);
    ctx.lineTo(34, -34);
    ctx.stroke();
    ctx.fillStyle = "#d48c3d";
    ctx.beginPath();
    ctx.arc(34, -38, 7 + Math.sin(time * 5) * 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (bowJobs.includes(kind)) {
    ctx.arc(32, 10, 28, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.fillStyle = "#fffaf0";
    ctx.beginPath();
    ctx.moveTo(32, 10);
    ctx.lineTo(58, -2 + Math.sin(time * 8) * 2);
    ctx.lineTo(32, 14);
    ctx.fill();
  } else if (knifeJobs.includes(kind)) {
    ctx.moveTo(24, 18);
    ctx.lineTo(45, -2);
    ctx.moveTo(-24, 18);
    ctx.lineTo(-45, -2);
    ctx.stroke();
  } else if (smithJobs.includes(kind)) {
    ctx.moveTo(24, 14);
    ctx.lineTo(48, -14);
    ctx.stroke();
    ctx.fillStyle = "#9a7052";
    ctx.fillRect(42, -24, 18, 16);
  } else {
    ctx.moveTo(23, 10 + Math.sin(time * 6) * 4);
    ctx.lineTo(54, -28 + Math.sin(time * 6) * 4);
    ctx.stroke();
  }
  ctx.restore();
}

function drawAuthorizedJobSprite(ctx, kind, time) {
  const sprite = getJobSprite(kind);
  if (!sprite || !sprite.complete || !sprite.naturalWidth) return false;
  const height = kind === "novice" ? 86 : 100;
  const width = Math.round(height * (sprite.naturalWidth / sprite.naturalHeight));
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite, -width / 2, -46 + Math.sin(time * 4) * 2, width, height);
  ctx.restore();
  return true;
}

function getJobSprite(kind) {
  const baseSrc = jobSpriteSources[kind] || jobSpriteSources.novice;
  if (!baseSrc) return null;
  const candidates = spriteCandidates(baseSrc);
  let entry = jobSpriteCache[kind];
  if (!entry) {
    entry = jobSpriteCache[kind] = { index: 0, image: null };
  }
  if (!entry.image || entry.image.failed) {
    if (entry.image?.failed) entry.index += 1;
    if (entry.index >= candidates.length) return null;
    const image = new Image();
    image.src = candidates[entry.index];
    image.onerror = () => {
      image.failed = true;
    };
    entry.image = image;
  }
  return entry.image.failed ? null : entry.image;
}

function spriteCandidates(src) {
  const withoutExt = src.replace(/\.(png|gif|webp)$/i, "");
  const legacy = withoutExt.replace("assets/images/classes/", "assets/job-sprites/");
  return [
    ...jobSpriteExtensions.map((ext) => `${withoutExt}.${ext}`),
    ...jobSpriteExtensions.map((ext) => `${legacy}.${ext}`),
  ];
}

function classImageCandidates(jobId) {
  const base = `assets/images/classes/${jobId}`;
  const legacy = `assets/job-sprites/${jobId}`;
  return [
    ...imageExtensions.map((ext) => `${base}.${ext}`),
    ...imageExtensions.map((ext) => `${legacy}.${ext}`),
  ];
}

function imageCandidates(src) {
  const base = src.replace(/\.(png|gif|webp)$/i, "");
  return imageExtensions.map((ext) => `${base}.${ext}`);
}

function monsterImageSource(monsterId) {
  const safe = String(monsterId || "monster").replace(/[^A-Za-z0-9_-]/g, "_");
  return `assets/images/monsters/${safe}.png`;
}

function equipmentImagePath(id) {
  const safe = String(id || "equipment").replace(/[^A-Za-z0-9_-]/g, "_");
  return `assets/images/equipment/${safe}.png`;
}

function itemImageCandidates(item) {
  const src = item.image || equipmentImagePath(item.templateId || item.id || item.name);
  return imageCandidates(src);
}

function imageBackgroundList(candidates) {
  return candidates.map((src) => `url("${escapeAttr(src)}")`).join(", ");
}

function drawEnemy(ctx, x, y, scale, time) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  if (drawMonsterSprite(ctx, currentMap().id, state.enemyBoss, time)) {
    ctx.restore();
    return;
  }
  const squash = 1 + Math.sin(time * 3) * 0.06;
  const mapId = currentMap().id;

  ctx.fillStyle = "rgba(39, 49, 59, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 58, 55, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  const palette =
    mapId === "forest"
      ? ["#ffd47a", "#8a9b4d"]
      : mapId === "mine"
        ? ["#b9d3ff", "#535f8a"]
        : mapId === "clock"
          ? ["#f5d27f", "#9a6a34"]
          : mapId === "sky"
            ? ["#fff4ba", "#8896d7"]
            : ["#f6b2bd", "#c95f4f"];
  const body = ctx.createRadialGradient(-18, -10, 12, 0, 8, 68);
  body.addColorStop(0, palette[0]);
  body.addColorStop(1, palette[1]);
  ctx.fillStyle = body;
  ctx.beginPath();
  if (mapId === "forest") {
    ctx.ellipse(0, 18, 48, 50 * squash, 0, 0, Math.PI * 2);
  } else if (mapId === "clock") {
    ctx.roundRect(-48, -18, 96, 78 * squash, 16);
  } else {
    ctx.ellipse(0, 18, 58, 46 * squash, 0, 0, Math.PI * 2);
  }
  ctx.fill();

  if (mapId === "forest") {
    ctx.fillStyle = "#fff1d0";
    ctx.beginPath();
    ctx.arc(-24, -28, 24, 0, Math.PI * 2);
    ctx.arc(24, -28, 24, 0, Math.PI * 2);
    ctx.fill();
  }
  if (mapId === "mine") {
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.moveTo(-10, -22);
    ctx.lineTo(12, -8);
    ctx.lineTo(-12, 6);
    ctx.closePath();
    ctx.fill();
  }
  if (mapId === "sky") {
    ctx.fillStyle = "rgba(255,250,240,0.9)";
    ctx.beginPath();
    ctx.ellipse(-54, 8, 28, 10, -0.45, 0, Math.PI * 2);
    ctx.ellipse(54, 8, 28, 10, 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#27313b";
  ctx.beginPath();
  ctx.arc(-18, 6, 5, 0, Math.PI * 2);
  ctx.arc(18, 6, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#27313b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(0, 14, 17, 0.15, Math.PI - 0.15);
  ctx.stroke();

  if (state.enemyBoss) {
    ctx.fillStyle = "#d48c3d";
    ctx.beginPath();
    ctx.moveTo(-28, -40);
    ctx.lineTo(-10, -74);
    ctx.lineTo(0, -38);
    ctx.lineTo(10, -74);
    ctx.lineTo(28, -40);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawMonsterSprite(ctx, mapId, isBoss, time) {
  const sprite = getMonsterSprite(state.enemy?.id || mapId, isBoss);
  if (!sprite || !sprite.complete || !sprite.naturalWidth) return false;
  const maxHeight = isBoss ? 132 : 104;
  const maxWidth = isBoss ? 150 : 122;
  const ratio = Math.min(maxWidth / sprite.naturalWidth, maxHeight / sprite.naturalHeight);
  const width = Math.max(24, Math.round(sprite.naturalWidth * ratio));
  const height = Math.max(24, Math.round(sprite.naturalHeight * ratio));
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "rgba(39, 49, 59, 0.2)";
  ctx.beginPath();
  ctx.ellipse(0, 58, Math.max(34, width * 0.38), 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.drawImage(sprite, -width / 2, 55 - height + Math.sin(time * 2.8) * 2, width, height);
  if (isBoss) {
    ctx.fillStyle = "#d48c3d";
    ctx.beginPath();
    ctx.moveTo(-28, -height + 28);
    ctx.lineTo(-10, -height - 4);
    ctx.lineTo(0, -height + 30);
    ctx.lineTo(10, -height - 4);
    ctx.lineTo(28, -height + 28);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  return true;
}

function getMonsterSprite(monsterId, isBoss) {
  const source = monsterImageSource(monsterId);
  if (!source) return null;
  const key = `${monsterId}:${isBoss ? "boss" : "normal"}`;
  const candidates = imageCandidates(source);
  let entry = monsterSpriteCache[key];
  if (!entry) entry = monsterSpriteCache[key] = { index: 0, image: null };
  if (!entry.image || entry.image.failed) {
    if (entry.image?.failed) entry.index += 1;
    if (entry.index >= candidates.length) return null;
    const image = new Image();
    image.src = candidates[entry.index];
    image.onerror = () => {
      image.failed = true;
    };
    entry.image = image;
  }
  return entry.image.failed ? null : entry.image;
}

function currentJob() {
  return jobTemplates[state.hero.jobId] || jobTemplates.novice;
}

function currentMap() {
  return maps[state.currentMap] || maps[0];
}

function mapScale() {
  return mapScaleForIndex(state.currentMap);
}

function mapScaleForIndex(index) {
  return 1 + index * 0.46 + Math.floor(state.totalKills / 80) * 0.06;
}

function bossRequirement() {
  return 16 + state.currentMap * 5;
}

function progressText() {
  if (state.enemyBoss) return "首领战斗中";
  const required = bossRequirement();
  return `${Math.min(state.areaKills, required)}/${required}`;
}

function baseExpCost() {
  return Math.round((180 + (state.hero.rebirths || 0) * 45) * Math.pow(state.hero.baseLevel, 1.82));
}

function jobExpCost() {
  const base = state.hero.jobId === "novice" ? 92 : 175;
  return Math.round(base * Math.pow(state.hero.jobLevel, 1.72));
}

function heroTrainCost() {
  return Math.round(170 * Math.pow(state.hero.baseLevel, 1.78) * (1 + (state.hero.rebirths || 0) * 0.22));
}

function estimateGoldPerSecond() {
  const map = currentMap();
  const stats = computeStats();
  const monster = currentMonsterStats();
  return (stats.dps / Math.max(1, monster.maxHp)) * monster.gold * stats.goldMultiplier * stats.monsterGoldMultiplier;
}

function computeEquipmentFullStats() {
  return Object.values(state.equipped)
    .map((id) => state.inventory.find((item) => item.id === id))
    .filter(Boolean)
    .reduce(
      (sum, item) => {
        const effective = getEffectiveItemStats(item);
        sum.atk += effective.atk || 0;
        sum.matk += effective.matk || 0;
        sum.def += effective.def || 0;
        sum.hp += effective.hp || 0;
        sum.aspd += effective.aspd || 0;
        attributeKeys.forEach((stat) => {
          sum[stat] += effective[stat] || 0;
        });
        sum.gold += effective.gold || 0;
        sum.crit += effective.crit || 0;
        sum.drop += effective.drop || 0;
        ["atkPct", "matkPct", "hpPct", "defPct", "attackSpeedPct", "critRatePct", "critDamageBonus", "skillDamageBonus", "monsterDamageBonus", "bossDamageBonus", "bossDamageReduction", "damageReductionPct", "damageReduction", "lifeSteal", "blockRate", "antiCrit", "dodgeRatePct", "hpRegenPct", "ignoreDefense", "baseExpBonus", "jobExpBonus", "equipmentDrop", "cardDrop", "materialQuantityBonus", "powerPct", "combatPaceBonus", "patrolEfficiency", "hitRate", "statusResist", "echoChance", "mutationMaterialDoubleChance", "thornVitMultiplier", "abyssDamageBonus", "abyssBossDamageBonus", "abyssDamageReduction", "abyssPower", "abyssResist", "abyssMaterialDropBonus", "abyssSkillDamageBonus", "mythicWeightBonus", "mythicEssenceDropBonus", "rebirthPrestigeWeightBonus", "abyssExecuteDamageBonus", "setPowerBonus", "finalDamageBonus", "physicalFinalDamageBonus", "eliteDamageBonus", "rareDropBonus", "normalAttackDamageBonus", "higherLevelDamageBonus", "offlineEfficiencyBonus", "magicDamageReduction", "skillDamageReduction", "skillCooldownPenalty", "skillHitHealPct", "splashTargets", "splashDamagePct", "fireBurstChance", "fireBurstAtkPct", "meteorCounterChance", "meteorCounterMatkPct"].forEach((stat) => {
          sum[stat] += effective[stat] || 0;
        });
        return sum;
      },
      {
        atk: 0,
        matk: 0,
        def: 0,
        hp: 0,
        aspd: 0,
        luck: 0,
        str: 0,
        agi: 0,
        vit: 0,
        int: 0,
        dex: 0,
        luk: 0,
        gold: 0,
        crit: 0,
        drop: 0,
        atkPct: 0,
        matkPct: 0,
        hpPct: 0,
        defPct: 0,
        attackSpeedPct: 0,
        critRatePct: 0,
        critDamageBonus: 0,
        skillDamageBonus: 0,
        monsterDamageBonus: 0,
        bossDamageBonus: 0,
        bossDamageReduction: 0,
        damageReductionPct: 0,
        damageReduction: 0,
        lifeSteal: 0,
        blockRate: 0,
        antiCrit: 0,
        dodgeRatePct: 0,
        hpRegenPct: 0,
        ignoreDefense: 0,
        baseExpBonus: 0,
        jobExpBonus: 0,
        equipmentDrop: 0,
        cardDrop: 0,
        materialQuantityBonus: 0,
        powerPct: 0,
        combatPaceBonus: 0,
        patrolEfficiency: 0,
        hitRate: 0,
        statusResist: 0,
        echoChance: 0,
        mutationMaterialDoubleChance: 0,
        thornVitMultiplier: 0,
        abyssDamageBonus: 0,
        abyssBossDamageBonus: 0,
        abyssDamageReduction: 0,
        abyssPower: 0,
        abyssResist: 0,
        abyssMaterialDropBonus: 0,
        abyssSkillDamageBonus: 0,
        mythicWeightBonus: 0,
        mythicEssenceDropBonus: 0,
        rebirthPrestigeWeightBonus: 0,
        abyssExecuteDamageBonus: 0,
        setPowerBonus: 0,
        finalDamageBonus: 0,
        physicalFinalDamageBonus: 0,
        eliteDamageBonus: 0,
        rareDropBonus: 0,
        normalAttackDamageBonus: 0,
        higherLevelDamageBonus: 0,
        offlineEfficiencyBonus: 0,
        magicDamageReduction: 0,
        skillDamageReduction: 0,
        skillCooldownPenalty: 0,
        skillHitHealPct: 0,
        splashTargets: 0,
        splashDamagePct: 0,
        fireBurstChance: 0,
        fireBurstAtkPct: 0,
        meteorCounterChance: 0,
        meteorCounterMatkPct: 0,
      },
    );
}

function itemScore(item) {
  const effective = getEffectiveItemStats(item);
  const attrScore = attributeKeys.reduce((sum, stat) => sum + (effective[stat] || 0) * 2.6, 0);
  return (
    effective.atk * 2.2 +
    effective.matk * 2.2 +
    effective.def * 1.4 +
    effective.hp * 0.18 +
    (effective.hpPct || 0) * 240 +
    (effective.damageReductionPct || 0) * 420 +
    attrScore +
    effective.aspd * 280 +
    effective.gold * 120 +
    effective.crit * 260 +
    effective.drop * 160 +
    (effective.skillDamageBonus || 0) * 260 +
    (effective.monsterDamageBonus || 0) * 240 +
    (effective.critDamageBonus || 0) * 220 +
    (effective.normalAttackDamageBonus || 0) * 220 +
    (effective.finalDamageBonus || 0) * 320 +
    (effective.physicalFinalDamageBonus || 0) * 260 +
    (effective.eliteDamageBonus || 0) * 220 +
    (effective.bossDamageBonus || 0) * 260 +
    (effective.abyssDamageReduction || 0) * 260 +
    (effective.magicDamageReduction || 0) * 220 +
    (effective.skillDamageReduction || 0) * 220 +
    (effective.hitRate || 0) * 160 +
    (effective.statusResist || 0) * 90 +
    (item.refine || 0) * 18 +
    (item.empower || 0) * 22
  );
}

function getUnlockedSkills() {
  return currentJob().skills.filter((entry) => state.hero.jobLevel >= entry.level);
}

function grantPassiveSkillKillExp(context = {}) {
  const amount = context.isBoss ? 1 : context.isMutated ? 0.5 : 0.2;
  getUnlockedSkills()
    .filter((entry) => !entry.active)
    .forEach((entry) => gainSkillExp(entry, amount, "被动修炼"));
}

function getNextJobSkill() {
  return currentJob().skills.find((entry) => state.hero.jobLevel < entry.level) || null;
}

function renderSkillPanel() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSkillPanel === "function") return runtime.renderSkillPanel();
  return `
    <div class="skill-page-header">
      ${renderSkillSummaryCard()}
      <div class="skill-list">${renderJobSkills()}</div>
    </div>
  `;
}

function renderTitlePanel() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderTitlePanel === "function") return runtime.renderTitlePanel();
  state.titles = normalizeTitles(state.titles);
  const equipped = TITLE_DB[state.titles.equipped];
  const titleCards = Object.values(TITLE_DB)
    .map((title) => {
      const owned = state.titles.owned.includes(title.id);
      const active = state.titles.equipped === title.id;
      return `<div class="title-chip ${owned ? "owned" : "locked"} ${active ? "active" : ""}">
        ${renderItemName({ name: title.name, rarity: title.rarity })}
        <small>${escapeHtml(title.source)} · ${titleEffectText(title.effects)}</small>
        ${owned ? `<button class="ghost" type="button" data-equip-title="${active ? "" : title.id}">${active ? "卸下" : "装备"}</button>` : ""}
      </div>`;
    })
    .join("");
  return `<section class="title-panel">
    <strong>当前称号：${equipped ? renderItemName({ name: equipped.name, rarity: equipped.rarity }) : "未装备"}</strong>
    <div class="title-list">${titleCards}</div>
  </section>`;
}

function titleEffectText(effects = {}) {
  return Object.entries(effects).map(([stat, value]) => statLabel(stat, value)).filter(Boolean).join(" · ") || "外观称号";
}

function renderSkillSummaryCard() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSkillSummaryCard === "function") return runtime.renderSkillSummaryCard();
  const job = currentJob();
  const skills = job.skills || [];
  const maxed = skills.filter((entry) => getSkillGrowthEntry(entry).level >= SKILL_MAX_LEVEL).length;
  return `
    <article class="skill-summary-card">
      <div>
        <strong>${job.name} 技能修炼</strong>
        <p>${jobSummary(job)} · 当前技能 ${skills.length} 个 · 满级 ${maxed} 个</p>
      </div>
      <div class="skill-summary-tags">
        <span>职业定位：${job.role === "front" ? "角色1" : job.role === "mid" ? "角色2" : "角色3"}</span>
        <span>成长说明：主动技能靠释放提升，被动技能靠战斗修炼提升</span>
      </div>
    </article>
  `;
}

function renderJobSkills() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderJobSkills === "function") return runtime.renderJobSkills();
  const level = state.hero.jobLevel;
  return currentJob()
    .skills.map((entry) => {
      const unlocked = level >= entry.level;
      const tip = skillTooltip(entry);
      const growth = getSkillGrowthEntry(entry);
      const need = getSkillExpRequirement(growth.level);
      const detailText = unlocked ? (growth.level >= SKILL_MAX_LEVEL ? "MAX" : `${formatNumber(growth.exp)}/${formatNumber(need)}`) : `Job ${entry.level} 解锁`;
      const effectText = unlocked
        ? entry.active
          ? `当前加成：伤害倍率 +${Math.round((getSkillLevelMultiplier(entry) - 1) * 100)}%`
          : `当前加成：被动效果 +${Math.round((getPassiveSkillMultiplier(entry) - 1) * 100)}%`
        : `未解锁 · ${entry.kind}`;
      const relation = skillScalingLabel(entry).replace("属性关联：", "");
      const gainPreview = getRecentSkillExpGain(entry.id);
      const leveled = isSkillRecentlyLeveled(entry.id);
      const progress = unlocked && growth.level < SKILL_MAX_LEVEL ? Math.min(100, (growth.exp / Math.max(1, need)) * 100) : 100;
      const nextMs = SKILL_MILESTONES.find((msLv) => msLv > growth.level) || "";
      const msText = unlocked && SKILL_MILESTONES.some((msLv) => growth.level >= msLv) ? ` · 里程碑 Lv.${SKILL_MILESTONES.filter((lv) => growth.level >= lv).join("/")} 已激活` : unlocked && nextMs ? ` · 下个里程碑 Lv.${nextMs}：${describeNextSkillMilestone(entry, nextMs)}` : "";
      return `
        <article class="skill-card ${unlocked ? "unlocked" : ""} ${entry.active ? "skill-card-active" : "skill-card-passive"} ${leveled ? "skill-card-leveled" : ""}" data-tooltip="${escapeAttr(tip)}" title="${escapeAttr(tip)}">
          <div class="skill-title-row">
            <div class="skill-title-stack">
              <strong class="skill-name">${entry.name}</strong>
              <div class="skill-attribute-tags">
                <span class="skill-type-badge">${entry.kind}</span>
                ${relation.split(" / ").map((tag) => `<span class="skill-attribute-tag">${escapeHtml(tag)}</span>`).join("")}
              </div>
            </div>
            <div class="skill-title-side">
              <span class="skill-level-badge">Lv.${growth.level}</span>
              ${growth.level >= SKILL_MAX_LEVEL ? `<span class="skill-max-badge">MAX</span>` : ""}
            </div>
          </div>
          <p class="skill-desc">${escapeHtml(entry.description)}</p>
          <div class="skill-effect-summary">
            <span>${effectText}</span>
            ${entry.active ? `<span>触发：${percent(entry.active?.chance || 0)}/秒</span>` : `<span>修炼：战斗中持续积累经验</span>`}
          </div>
          ${unlocked && msText ? `<p class="skill-milestone-text">${escapeHtml(msText)}</p>` : ""}
          <div class="skill-exp-row">
            <span class="skill-exp-text">经验：${detailText}</span>
            ${gainPreview > 0 && unlocked && growth.level < SKILL_MAX_LEVEL ? `<span class="skill-exp-gain">+${Number.isInteger(gainPreview) ? gainPreview : gainPreview.toFixed(1)} 技能经验</span>` : ""}
          </div>
          <div class="skill-exp-bar ${growth.level >= SKILL_MAX_LEVEL ? "is-max" : ""}">
            <div class="skill-exp-fill" style="width:${progress}%"></div>
          </div>
          <details class="skill-detail">
            <summary class="skill-detail-toggle">查看详情</summary>
            <div class="skill-card-foot">
              <span>${skillScalingLabel(entry)}</span>
              <span>${unlocked ? (growth.level >= SKILL_MAX_LEVEL ? "已满级" : `下一级需求 ${formatNumber(need)}`) : `Job ${entry.level} 解锁`}</span>
            </div>
            ${renderSkillMilestonePanel(entry, unlocked)}
            ${renderSkillSpecialization(entry, unlocked, growth)}
          </details>
        </article>
      `;
    })
    .join("");
}

function describeNextSkillMilestone(entry, nextLevel) {
  const rows = getSkillMilestoneRows(entry);
  const row = rows.find((item) => item.level === nextLevel);
  return row?.text || "技能效果提高";
}

function renderSkillMilestonePanel(entry, unlocked) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSkillMilestonePanel === "function") return runtime.renderSkillMilestonePanel(entry, unlocked);
  if (!unlocked) return "";
  const rows = getSkillMilestoneRows(entry);
  return `<div class="skill-milestone-panel">
    <strong>技能里程碑</strong>
    ${rows.map((row) => `<div class="skill-milestone-row ${row.active ? "active" : "locked"}">
      <span>Lv.${row.level}</span>
      <small>${row.active ? "已激活" : "未激活"} · ${escapeHtml(row.text)}</small>
    </div>`).join("")}
  </div>`;
}

function renderSkillSpecialization(entry, unlocked, growth) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSkillSpecialization === "function") return runtime.renderSkillSpecialization(entry, unlocked, growth);
  if (!unlocked) return "";
  if (growth.level < 15) return `<div class="skill-specialization spec-locked">专精：技能 Lv.15 解锁</div>`;
  const selected = growth.specialization;
  const options = getSkillSpecializationOptions(entry);
  if (selected) {
    const option = options.find((spec) => spec.id === selected);
    return `<div class="skill-specialization spec-selected">专精：${escapeHtml(option?.name || selected)}<small>${escapeHtml(option?.description || "")}</small></div>`;
  }
  return `<div class="skill-specialization">
    <strong>选择专精</strong>
    <div class="spec-option-list">
      ${options.map((option) => `<button class="ghost spec-option-card" type="button" data-skill-id="${entry.id}" data-skill-spec="${option.id}"><strong>${option.name}</strong><small>${option.description}</small></button>`).join("")}
    </div>
  </div>`;
}

function skillTooltip(entry) {
  const boosts = [];
  if (entry.atkPct) boosts.push(`物攻 +${percent(entry.atkPct)}`);
  if (entry.matkPct) boosts.push(`魔攻 +${percent(entry.matkPct)}`);
  if (entry.hpPct) boosts.push(`生命 +${percent(entry.hpPct)}`);
  if (entry.defPct) boosts.push(`防御 +${percent(entry.defPct)}`);
  if (entry.aspdPct) boosts.push(`攻速 +${percent(entry.aspdPct)}`);
  if (entry.critPct) boosts.push(`暴击 +${percent(entry.critPct)}`);
  if (entry.goldPct) boosts.push(`金币 +${percent(entry.goldPct)}`);
  if (entry.dropPct) boosts.push(`掉宝 +${percent(entry.dropPct)}`);
  if (entry.dpsPct) boosts.push(`伤害 +${percent(entry.dpsPct)}`);
  if (entry.active) boosts.push(`挂机释放 ${percent(entry.active.chance)}/秒，威力 ${formatSkillMultiplier(entry.active.multiplier)}，受${entry.active.stat === "matk" ? "魔攻" : "物攻"}与JOB等级影响`);
  const growth = getSkillGrowthEntry(entry);
  const need = getSkillExpRequirement(growth.level);
  const scalingText = skillScalingLabel(entry);
  const progressText = growth.level >= SKILL_MAX_LEVEL ? "已满级" : `经验 ${formatNumber(growth.exp)}/${formatNumber(need)}`;
  return `${entry.name}（${entry.kind}）\n${entry.description}\n${scalingText}\n${progressText}\n${boosts.join(" · ") || "无额外属性"}`;
}

function formatSkillMultiplier(value) {
  const normalized = Math.round((Number(value) || 0) * 100) / 100;
  const text = Number.isInteger(normalized) ? normalized.toFixed(0) : normalized.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return `${text}x`;
}

function skillScalingLabel(entry) {
  const keys = Object.keys(entry.active?.attributeScaling || {});
  if (keys.length) return `属性关联：${keys.map((key) => key.toUpperCase()).join(" / ")}`;
  if (entry.active) return `属性关联：${entry.active.stat === "matk" ? "INT / DEX" : "STR / DEX"}`;
  if (entry.atkPct || entry.hpPct || entry.defPct) return "属性关联：STR / VIT";
  if (entry.matkPct) return "属性关联：INT / DEX";
  if (entry.aspdPct) return "属性关联：AGI";
  if (entry.critPct || entry.dropPct) return "属性关联：LUK / DEX";
  return "属性关联：职业修炼";
}

function describeJobGrowth() {
  const job = currentJob();
  const level = state.hero.jobLevel;
  const passive = getPassiveSkillTotals();
  const main = job.id === "mage" || job.id === "acolyte" ? `魔攻 +${percent((job.growth.matkPct || 0) * level + passive.matkPct)}` : `物攻 +${percent((job.growth.atkPct || 0) * level + passive.atkPct)}`;
  return `${job.name}成长 · ${main} · 生命 +${percent((job.growth.hpPct || 0) * level + passive.hpPct)} · 防御 +${percent((job.growth.defPct || 0) * level + passive.defPct)} · 攻速 +${percent((job.growth.aspdPct || 0) * level + passive.aspdPct)}`;
}

function jobSummary(job) {
  const tags = [];
  if ((job.growth.atkPct || 0) > 0.03) tags.push("物攻成长");
  if ((job.growth.matkPct || 0) > 0.03) tags.push("魔攻成长");
  if ((job.growth.hpPct || 0) > 0.04) tags.push("生存成长");
  if ((job.growth.aspdPct || 0) > 0.005) tags.push("攻速成长");
  return tags.join(" · ") || "均衡成长";
}

function getMapPreviewStats(map, difficultyId = "normal") {
  const difficulty = DIFFICULTY_CONFIG[difficultyId] || DIFFICULTY_CONFIG.normal;
  const range = getMapLevelRange(map);
  const monsters = Array.isArray(map.monsters) && map.monsters.length ? map.monsters : [monsterTemplate(`${map.id}_preview`, map.enemy, [range.minLevel, range.maxLevel], [map.baseHp || 1, map.baseHp || 1], range.attackRange, [1, 1], [map.baseExp || 1, map.baseExp || 1], [map.jobExp || map.baseExp || 1, map.jobExp || map.baseExp || 1], [map.gold || 1, map.gold || 1])];
  const merged = monsters.reduce(
    (sum, monster) => ({
      levelRange: mergeMinMax(sum.levelRange, monster.levelRange || [range.minLevel, range.maxLevel]),
      hpRange: mergeMinMax(sum.hpRange, scaleRange(monster.hpRange || [map.baseHp || 1, map.baseHp || 1], difficulty.hp)),
      attackRange: mergeMinMax(sum.attackRange, scaleRange(monster.attackRange || range.attackRange, difficulty.attack)),
      defenseRange: mergeMinMax(sum.defenseRange, scaleRange(monster.defenseRange || [1, 1], difficulty.defense)),
    }),
    { levelRange: null, hpRange: null, attackRange: null, defenseRange: null },
  );
  if (difficultyId === "abyss") {
    const scale = ABYSS_MAP_TIER_SCALE[map.id] || ABYSS_MAP_TIER_SCALE.grass;
    merged.levelRange = [Math.max(ABYSS_BASELINE.minLevel, merged.levelRange?.[0] || ABYSS_BASELINE.minLevel), Math.max(ABYSS_BASELINE.minLevel, merged.levelRange?.[1] || ABYSS_BASELINE.minLevel)];
    merged.hpRange = [Math.max(merged.hpRange?.[0] || 1, Math.round(ABYSS_BASELINE.hp * scale.hp)), Math.max(merged.hpRange?.[1] || 1, Math.round(ABYSS_BASELINE.hp * scale.hp * 1.35))];
    merged.attackRange = [Math.max(merged.attackRange?.[0] || 1, Math.round(ABYSS_BASELINE.attack * scale.attack)), Math.max(merged.attackRange?.[1] || 1, Math.round(ABYSS_BASELINE.attack * scale.attack * 1.3))];
    merged.defenseRange = [Math.max(merged.defenseRange?.[0] || 1, Math.round(ABYSS_BASELINE.defense * scale.defense)), Math.max(merged.defenseRange?.[1] || 1, Math.round(ABYSS_BASELINE.defense * scale.defense * 1.25))];
  } else if (difficultyId === "hard") {
    const scale = HARD_MAP_TIER_SCALE[map.id] || HARD_MAP_TIER_SCALE.grass;
    merged.levelRange = [Math.max(HARD_BASELINE.minLevel, merged.levelRange?.[0] || HARD_BASELINE.minLevel), Math.max(HARD_BASELINE.minLevel, merged.levelRange?.[1] || HARD_BASELINE.minLevel)];
    merged.hpRange = [Math.max(merged.hpRange?.[0] || 1, Math.round(HARD_BASELINE.hp * scale.hp)), Math.max(merged.hpRange?.[1] || 1, Math.round(HARD_BASELINE.hp * scale.hp * 1.22))];
    merged.attackRange = [Math.max(merged.attackRange?.[0] || 1, Math.round(HARD_BASELINE.attack * scale.attack)), Math.max(merged.attackRange?.[1] || 1, Math.round(HARD_BASELINE.attack * scale.attack * 1.18))];
    merged.defenseRange = [Math.max(merged.defenseRange?.[0] || 1, Math.round(HARD_BASELINE.defense * scale.defense)), Math.max(merged.defenseRange?.[1] || 1, Math.round(HARD_BASELINE.defense * scale.defense * 1.16))];
  }
  return { ...merged, difficulty };
}

function scaleRange(range, multiplier) {
  return [Math.max(1, Math.round((range?.[0] || 1) * multiplier)), Math.max(1, Math.round((range?.[1] || range?.[0] || 1) * multiplier))];
}

function mergeMinMax(current, next) {
  if (!current) return [next[0], next[1]];
  return [Math.min(current[0], next[0]), Math.max(current[1], next[1])];
}

function formatRangeNumber(range) {
  return `${formatNumber(range?.[0] || 0)}-${formatNumber(range?.[1] || 0)}`;
}

function mapDropTooltip(map) {
  const range = getMapLevelRange(map);
  const normal = getMapPreviewStats(map, "normal");
  const hard = getMapPreviewStats(map, "hard");
  const abyss = getMapPreviewStats(map, "abyss");
  const monsterNames = (map.monsters || []).map((monster) => monster.name).join(" / ");
  return `${map.name}\n推荐等级：${range.minLevel}-${range.maxLevel}\n普通攻击：${formatRangeNumber(normal.attackRange)}\n困难攻击：${formatRangeNumber(hard.attackRange)}\n深渊攻击：${formatRangeNumber(abyss.attackRange)}\n怪物：${monsterNames || map.enemy}\n存在变异怪；深渊难度有极低概率掉落神话装备。`;
}

function tierFeatureText() {
  return "普通基础 / 精良生命 / 稀有幸运 / 史诗暴击 / 古代掉宝金币 / 传说多词条";
}

function tierDropPercent(tier) {
  const total = equipmentTiers.reduce((sum, entry) => sum + entry.weight, 0);
  return `${((tier.weight / total) * 100).toFixed(tier.weight < 30 ? 1 : 0)}%`;
}

function itemRangeTooltip(item) {
  const next = (item.refine || 0) + 1;
  const refineInfo = next <= 15 ? `${next}星成功率 ${Math.round(getRefineChance(next, item) * 100)}%，保底 +${Math.round((item.refineFailCount || 0) * 1.5 * 10) / 10}%，消耗 ${materialText(getRefineCost(item))}` : "已达到 15 星";
  const empowerNext = (item.empower || 0) + 1;
  const empowerInfo = empowerNext <= 10 ? `${empowerNext}阶消耗 ${materialText(getEmpowerCost(item))}` : "已满阶";
  const starBonus = star15Bonus(item);
  const starInfo = item.refine >= 15 && Object.keys(starBonus).length ? `\n15星附加\n${statObjectText(starBonus)}` : "";
  const tierInfo = inferItemTier(item);
  const basicInfo = `基础信息\n品质：${rarityName(item.rarity)}\n等阶：${item.itemTier || tierInfo.id}（Lv.${tierInfo.minLevel}-${tierInfo.maxLevel}）\n等级：${item.level || 1}\n部位：${slotName(equipmentSlot(item))}\n${SLOT_ROLE_DESCRIPTIONS[equipmentSlot(item)] || ""}`;
  const attrInfo = `基础属性\n${itemAttrText(item)}`;
  const affixInfo = (item.affixes || []).length ? (item.affixes || []).join("\n") : "无随机词条";
  const mechanicInfo = (item.mechanicAffixes || []).length
    ? item.mechanicAffixes.map((id) => `【${MECHANIC_AFFIXES[id]?.label || id}】${MECHANIC_AFFIXES[id]?.description || ""}`).join("\n")
    : "无机制词条";
  const setInfo = item.setId ? `\n套装效果\n${setStageTooltip(item.setId)}` : "";
  return `${basicInfo}\n\n${attrInfo}\n\n随机词条\n${affixInfo}\n\n机制词条\n${mechanicInfo}\n\n星炼\n${refineInfo}\n赋能\n${empowerInfo}${starInfo}${setInfo}`;
}

function setStageTooltip(setId) {
  const set = equipmentSets[setId];
  if (!set) return "";
  const bonuses = computeSetBonuses();
  const pieces = bonuses.pieceCounts[setId] || 0;
  const stages = set.effects?.pieces && Object.keys(set.effects.pieces).length ? set.effects.pieces : { [set.items.length]: set.effects?.full || {} };
  return Object.entries(stages)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([stage, effects]) => `${stage}件${pieces >= Number(stage) ? "已激活" : "未激活"}：${describeZodiacEffects(effects)}`)
    .join("\n");
}

const itemStatDescriptions = {
  atk: "物理攻击，提高普通攻击和物理技能伤害。",
  matk: "魔法攻击，提高魔法技能伤害。",
  def: "防御，降低受到的怪物伤害。",
  hp: "生命，提高最大生命值。",
  aspd: "攻击速度，提高攻击频率。",
  crit: "暴击率，提高造成暴击的概率。",
  drop: "物品掉率，提高材料、卡片等物品掉落概率。",
  gold: "金币收益，提高打怪金币收益。",
  str: "力量，提高物理攻击。",
  agi: "敏捷，提高攻击速度和闪避。",
  vit: "体质，提高生命值、防御和生命恢复。",
  int: "智力，提高魔法攻击。",
  dex: "灵巧，提高少量物理/魔法攻击和少量暴击率。",
  luk: "幸运，提高暴击率和少量物品掉率。",
  sharp: "锐利，提高暴击伤害。",
  sharpness: "锐利，提高暴击伤害。",
  ignoreDefense: "破甲，攻击时无视目标部分防御。",
  monsterDamageBonus: "对怪物伤害，提高对怪物的最终伤害。",
  bossDamageBonus: "Boss伤害，提高对 Boss 的最终伤害。",
  materialQuantityBonus: "材料收益，提高材料掉落数量。",
  baseExpBonus: "经验收益，提高 BASE 经验收益。",
  jobExpBonus: "经验收益，提高 JOB 经验收益。",
};

function getItemDisplayRanges(item) {
  const ranges = {};
  Object.entries(item.ranges || {}).forEach(([stat, range]) => {
    const key = canonicalItemStat(stat);
    ranges[key] = mergeRange(ranges[key], range);
  });
  return ranges;
}

function refineText(item) {
  const star = item.refine || 0;
  return star > 0 && star < 7 ? `★${star}` : "";
}

function empowerText(item) {
  const level = item.empower || 0;
  return level > 0 ? `赋${level}` : "";
}

function getSalvageRewardsPreview(item) {
  const tier = item.tier || item.rarity || "normal";
  const table = salvageRewards[tier] || salvageRewards.normal;
  const rewards = {};
  Object.entries(table).forEach(([material, range]) => {
    const bonus = Math.floor((item.level || 1) / 12);
    rewards[material] = `${range[0] + bonus}-${range[1] + bonus}`;
  });
  if (isAbyssEquipment(item)) {
    const rank = Math.max(0, rarityRank(item.rarity));
    rewards.abyssShard = `${2 + Math.floor((item.level || 1) / 20) + rank}`;
    if (rank >= rarityRank("epic")) rewards.abyssCore = rank >= rarityRank("mythic") ? "3" : rank >= rarityRank("darkGold") ? "2" : "1";
  }
  return rewards;
}

function materialInventoryText() {
  return Object.entries(materialNames)
    .map(([id, name]) => `${name} ${state.materials[id] || 0}`)
    .join(" · ");
}

function renderMaterialGroups() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderMaterialGroups === "function") return runtime.renderMaterialGroups();
  const groups = [
    { title: "基础材料", ids: ["dust", "ore", "crystal", "rune"] },
    { title: "精炼 / 星炼材料", ids: ["ancientCore", "starShard", "mythicEssence", "oridecon", "elunium", "enhanceProtect"] },
    { title: "打孔 / 镶嵌材料", ids: ["socketStone", "advancedSocketStone", "mythicSocketStone", "cardRemover"] },
    { title: "深渊材料", ids: ["abyssShard", "abyssCore"] },
    { title: "首领魂", ids: [...bossEssenceByMap, "bossSoul"] },
    { title: "卡片材料", ids: ["bossCardShard"] },
    { title: "星座圣卡", ids: Object.values(ZODIAC_CARD_BY_SET) },
  ];
  const used = new Set(groups.flatMap((group) => group.ids));
  const specialIds = Object.keys(materialNames).filter((id) => !used.has(id));
  if (specialIds.length) groups.push({ title: "特殊材料", ids: specialIds });
  return `<section class="material-page">
    ${groups
      .map((group) => {
        const rows = group.ids
          .filter((id) => (state.materials[id] || 0) > 0 || group.title === "星座圣卡" || group.title === "打孔 / 镶嵌材料" || ["rune", "ancientCore", "starShard"].includes(id))
          .map((id) => {
            const material = MATERIAL_DB[id] || {};
            return `<article class="material-card">
              <span class="material-name ${getRarityClass({ rarity: material.rarity || "normal" })}">${escapeHtml(materialNames[id] || id)}</span>
              <strong class="material-count">×${formatNumber(state.materials[id] || 0)}</strong>
              <small class="material-desc">${escapeHtml(material.description || "材料")}</small>
            </article>`;
          })
          .join("");
        if (!rows) return "";
        return `<div class="material-group"><h4 class="material-group-title">${group.title}</h4><div class="material-grid">${rows}</div></div>`;
      })
      .join("")}
  </section>`;
}

function renderZodiacCollectionPanel() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderZodiacCollectionPanel === "function") return runtime.renderZodiacCollectionPanel();
  const cards = Object.values(equipmentSets)
    .filter((set) => isZodiacSetId(set.id))
    .map((set) => {
      const entry = state.zodiacCollection?.[set.id] || { collectedPieceIds: [] };
      const collected = new Set(entry.collectedPieceIds || []);
      const count = set.items.filter((item) => collected.has(item.id)).length;
      const active = count >= set.items.length;
      return `<article class="zodiac-collection-card ${active ? "active" : ""}">
        <div>
          <span class="set-name">${set.name}</span>
          <p class="slot-meta">收藏进度 ${count}/${set.items.length} · ${active ? "图鉴属性已激活" : "集齐后激活图鉴属性"}</p>
        </div>
      </article>`;
    })
    .join("");
  return `<section class="slot-card zodiac-collection-panel"><span class="slot-name">星座收藏</span><div class="zodiac-collection-grid">${cards}</div></section>`;
}

function renderCostumePanel() { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCostumePanel === "function") return runtime.renderCostumePanel();
  state.costumes = normalizeCostumes(state.costumes);
  const owned = state.costumes.owned.map((id) => COSTUME_DB[id]).filter(Boolean);
  const current = COSTUME_DB[state.costumes.equipped?.back || ""];
  return `<section class="slot-card costume-panel">
    <span class="slot-name">时装栏</span>
    <p class="slot-meta">背饰：${current ? renderItemName(current) : "未穿戴"}</p>
    <div class="costume-list">
      ${
        owned.length
          ? owned
              .map((costume) => {
                const equipped = state.costumes.equipped?.[costume.slot] === costume.id;
                return `<article class="costume-card">
                  <span class="item-icon" style="background-image:${imageBackgroundList([costume.image])}"></span>
                  <div><strong>${renderItemName(costume)}</strong><p class="slot-meta">${escapeHtml(costume.description)}</p></div>
                  <button type="button" data-equip-costume="${costume.id}" ${equipped ? "disabled" : ""}>${equipped ? "已穿戴" : "穿戴"}</button>
                  ${equipped ? `<button class="ghost" type="button" data-unequip-costume="${costume.slot}">卸下</button>` : ""}
                </article>`;
              })
              .join("")
          : `<p class="slot-meta">暂无时装，可在铁匠铺的时装打造中制作。</p>`
      }
    </div>
  </section>`;
}

function materialText(rewards) {
  return Object.entries(rewards)
    .filter(([, amount]) => amount && amount !== "0-0")
    .map(([id, amount]) => `${materialNames[id] || id} × ${amount}`)
    .join(" · ");
}

function itemAttrText(item) {
  const effective = getEffectiveItemStats(item, false);
  const attrs = ["atk", "matk", "def", "hp", "hpRegen", "str", "agi", "vit", "int", "dex", "luk", "aspd", "dodgeRate", "crit", "drop", "gold", "atkPct", "matkPct", "hpPct", "defPct", "attackSpeedPct", "critRatePct", "critDamageBonus", "skillDamageBonus", "monsterDamageBonus", "bossDamageBonus", "finalDamageBonus", "eliteDamageBonus", "rareDropBonus", "damageReductionPct", "dodgeRatePct", "hpRegenPct", "ignoreDefense", "baseExpBonus", "jobExpBonus", "equipmentDrop", "cardDrop", "materialQuantityBonus", "combatPaceBonus", "abyssDamageBonus", "abyssBossDamageBonus", "abyssDamageReduction", "abyssMaterialDropBonus", "abyssSkillDamageBonus", "mythicWeightBonus"]
    .map((stat) => statLabel(stat, getItemStatValue(effective, stat)))
    .filter(Boolean);
  return attrs.join(" · ") || "无属性";
}

function renderEquipmentUsageTags(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentUsageTags === "function") return runtime.renderEquipmentUsageTags(item);
  const tags = getEquipmentUsageTags(item, currentJob()).slice(0, 3);
  return `<div class="equipment-badge-row equipment-usage-tags">
    <span class="equipment-badge equipment-badge-slot">推荐用途</span>
    ${tags.map((tag) => `<span class="equipment-badge">${escapeHtml(tag)}</span>`).join("")}
  </div>`;
}

function getEquipmentUsageTags(item, job = currentJob()) {
  const scores = calculateEquipmentScores(item, job);
  const stats = getEffectiveItemStats(item, true);
  const tags = [];
  if (scores.abyss >= 500 || isAbyssEquipment(item) || getItemStatValue(stats, "abyssDamageBonus") || getItemStatValue(stats, "abyssDamageReduction")) tags.push("深渊装");
  if (scores.boss >= 450 || getItemStatValue(stats, "bossDamageBonus") || getItemStatValue(stats, "eliteDamageBonus")) tags.push("Boss装");
  if (scores.output >= Math.max(500, scores.survival * 0.9, scores.treasure * 2)) tags.push("输出装");
  if (scores.survival >= Math.max(500, scores.output * 0.55)) tags.push("生存装");
  if (scores.treasure >= 160) tags.push("打宝装");
  if (isJobFocusedEquipment(stats, job)) tags.push("职业装");
  return [...new Set(tags)].slice(0, 3).length ? [...new Set(tags)].slice(0, 3) : ["通用装"];
}

function isJobFocusedEquipment(stats, job = currentJob()) {
  const id = job?.id || "";
  const mainStatsByJob = {
    novice: ["str", "agi", "int", "dex"],
    swordman: ["str", "vit", "dex"],
    knight: ["str", "vit", "dex"],
    lordKnight: ["str", "vit", "dex"],
    runeKnight: ["str", "vit", "dex"],
    mage: ["int", "dex"],
    wizard: ["int", "dex"],
    highWizard: ["int", "dex"],
    warlock: ["int", "dex"],
    archer: ["dex", "agi", "luk"],
    hunter: ["dex", "agi", "luk"],
    sniper: ["dex", "agi", "luk"],
    ranger: ["dex", "agi", "luk"],
    acolyte: ["int", "vit", "dex"],
    priest: ["int", "vit", "dex"],
    highPriest: ["int", "vit", "dex"],
    archbishop: ["int", "vit", "dex"],
    merchant: ["str", "vit", "luk"],
    blacksmith: ["str", "vit", "luk"],
    whiteSmith: ["str", "vit", "luk"],
    mechanic: ["str", "vit", "luk"],
    thief: ["agi", "luk", "str"],
    assassin: ["agi", "luk", "str"],
    assassinCross: ["agi", "luk", "str"],
    guillotineCross: ["agi", "luk", "str"],
  };
  const mainStats = mainStatsByJob[id] || ["str", "agi", "vit", "int", "dex", "luk"];
  const mainTotal = mainStats.reduce((sum, stat) => sum + getItemStatValue(stats, stat), 0);
  return mainTotal >= 18 || getItemStatValue(stats, "skillDamageBonus") >= 0.04;
}

function legacyCalculateEquipmentScores(item, job = currentJob()) {
  const stats = getEffectiveItemStats(item || {}, true);
  const attrTotal = attributeKeys.reduce((sum, stat) => sum + getItemStatValue(stats, stat), 0);
  const output =
    getItemStatValue(stats, "atk") * 1.7 +
    getItemStatValue(stats, "matk") * 1.7 +
    attrTotal * 8 +
    getItemStatValue(stats, "aspd") * 900 +
    getItemStatValue(stats, "attackSpeedPct") * 2600 +
    getItemStatValue(stats, "crit") * 3500 +
    getItemStatValue(stats, "critRatePct") * 3500 +
    getItemStatValue(stats, "critDamageBonus") * 4200 +
    getItemStatValue(stats, "finalDamageBonus") * 6200 +
    getItemStatValue(stats, "skillDamageBonus") * 4200 +
    getItemStatValue(stats, "monsterDamageBonus") * 3600;
  const survival =
    getItemStatValue(stats, "hp") * 0.35 +
    getItemStatValue(stats, "def") * 2.6 +
    getItemStatValue(stats, "vit") * 12 +
    getItemStatValue(stats, "hpPct") * 6200 +
    getItemStatValue(stats, "defPct") * 4200 +
    getItemStatValue(stats, "damageReductionPct") * 9000 +
    getItemStatValue(stats, "lifeSteal") * 7000 +
    getItemStatValue(stats, "hpRegen") * 3 +
    getItemStatValue(stats, "hpRegenPct") * 2800 +
    getItemStatValue(stats, "dodgeRate") * 3000 +
    getItemStatValue(stats, "dodgeRatePct") * 2600 +
    getItemStatValue(stats, "blockRate") * 3200 +
    getItemStatValue(stats, "antiCrit") * 2600;
  const boss =
    output * 0.28 +
    getItemStatValue(stats, "bossDamageBonus") * 8500 +
    getItemStatValue(stats, "eliteDamageBonus") * 6200 +
    getItemStatValue(stats, "bossDamageReduction") * 5000 +
    getItemStatValue(stats, "finalDamageBonus") * 4200 +
    getItemStatValue(stats, "critDamageBonus") * 2400 +
    getItemStatValue(stats, "lifeSteal") * 3000;
  const abyss =
    output * 0.18 +
    survival * 0.18 +
    (isAbyssEquipment(item) ? 900 : 0) +
    getItemStatValue(stats, "abyssDamageBonus") * 12000 +
    getItemStatValue(stats, "abyssDamageReduction") * 14000 +
    getItemStatValue(stats, "abyssBossDamageBonus") * 9500 +
    getItemStatValue(stats, "abyssResist") * 8000 +
    getItemStatValue(stats, "abyssPower") * 5000 +
    getItemStatValue(stats, "mythicWeightBonus") * 11000;
  const treasure =
    getItemStatValue(stats, "drop") * 3600 +
    getItemStatValue(stats, "gold") * 2000 +
    getItemStatValue(stats, "goldBonus") * 2000 +
    getItemStatValue(stats, "rareDropBonus") * 5200 +
    getItemStatValue(stats, "equipmentDrop") * 4600 +
    getItemStatValue(stats, "cardDrop") * 3800 +
    getItemStatValue(stats, "materialQuantityBonus") * 3200 +
    getItemStatValue(stats, "baseExpBonus") * 1800 +
    getItemStatValue(stats, "jobExpBonus") * 1800 +
    getItemStatValue(stats, "abyssMaterialDropBonus") * 3200 +
    getItemStatValue(stats, "mythicEssenceDropBonus") * 6000;
  const comprehensive = output * 0.38 + survival * 0.26 + boss * 0.16 + abyss * 0.14 + treasure * 0.06;
  return {
    comprehensive: Math.max(0, Math.round(comprehensive)),
    output: Math.max(0, Math.round(output)),
    survival: Math.max(0, Math.round(survival)),
    boss: Math.max(0, Math.round(boss)),
    abyss: Math.max(0, Math.round(abyss)),
    treasure: Math.max(0, Math.round(treasure)),
  };
}

function calculateEquipmentScores(item, job = currentJob()) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.calculateEquipmentScores === "function") {
    return runtime.calculateEquipmentScores(item, job);
  }
  return legacyCalculateEquipmentScores(item, job);
}

function compareEquipmentScores(newItem, currentItem, job = currentJob()) {
  if (!currentItem) return { empty: true };
  const next = calculateEquipmentScores(newItem, job);
  const current = calculateEquipmentScores(currentItem, job);
  const keys = ["output", "survival", "boss", "abyss", "treasure"];
  return Object.fromEntries(keys.map((key) => [key, (next[key] - current[key]) / Math.max(1, current[key])]));
}

function formatScoreDelta(value) {
  const finite = Number.isFinite(Number(value)) ? Number(value) : 0;
  const sign = finite > 0 ? "+" : "";
  return `${sign}${(finite * 100).toFixed(1)}%`;
}

function renderEquipmentScores(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentScores === "function") return runtime.renderEquipmentScores(item);
  const scores = calculateEquipmentScores(item, currentJob());
  const entries = [
    ["综合", scores.comprehensive],
    ["输出", scores.output],
    ["生存", scores.survival],
    ["Boss", scores.boss],
    ["深渊", scores.abyss],
    ["打宝", scores.treasure],
  ];
  return `<div class="equip-section equipment-stat-section">
    <strong class="equipment-section-title">装备评分</strong>
    <div class="equipment-stat-grid">${entries.map(([label, value]) => `<span class="equipment-stat-chip"><span class="equipment-stat-name">${label}</span><span class="equipment-stat-value">${formatNumber(value)}</span></span>`).join("")}</div>
  </div>`;
}

function renderEquipmentScoreComparison(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentScoreComparison === "function") return runtime.renderEquipmentScoreComparison(item);
  const slot = equipmentSlot(item);
  const equippedId = state.equipped?.[slot];
  const current = state.inventory.find((entry) => entry.id === equippedId);
  if (!current) return `<div class="equip-section equipment-stat-section"><strong class="equipment-section-title">替换预估</strong><small class="slot-meta">当前部位未装备。</small></div>`;
  if (current.id === item.id) return "";
  const diff = compareEquipmentScores(item, current, currentJob());
  const rows = [
    ["输出", diff.output],
    ["生存", diff.survival],
    ["Boss", diff.boss],
    ["深渊", diff.abyss],
    ["打宝", diff.treasure],
  ];
  return `<div class="equip-section equipment-stat-section">
    <strong class="equipment-section-title">替换预估</strong>
    <div class="equipment-stat-grid">${rows.map(([label, value]) => `<span class="equipment-stat-chip"><span class="equipment-stat-name">${label}</span><span class="equipment-stat-value">${formatScoreDelta(value)}</span></span>`).join("")}</div>
  </div>`;
}

function equipmentStatEntry(stats, stat) {
  const value = getItemStatValue(stats, stat);
  if (!Number.isFinite(value) || value === 0) return null;
  return { stat, label: statLabelName(stat), value };
}

function groupEquipmentStats(item) {
  const effective = getEffectiveItemStats(item, false);
  const groups = [
    { title: "基础属性", stats: ["atk", "matk", "def", "hp"] },
    { title: "职业属性", stats: ["str", "agi", "vit", "int", "dex", "luk"] },
    { title: "输出属性", stats: ["aspd", "crit", "critRatePct", "critDamageBonus", "attackSpeedPct", "finalDamageBonus", "physicalFinalDamageBonus", "normalAttackDamageBonus", "skillDamageBonus", "monsterDamageBonus", "atkPct", "matkPct"] },
    { title: "生存属性", stats: ["lifeSteal", "skillHitHealPct", "damageReductionPct", "magicDamageReduction", "skillDamageReduction", "hpRegen", "hpRegenPct", "dodgeRate", "dodgeRatePct", "blockRate", "antiCrit", "hpPct", "defPct"] },
    { title: "Boss属性", stats: ["bossDamageBonus", "eliteDamageBonus", "bossDamageReduction"] },
    { title: "深渊属性", stats: ["abyssDamageBonus", "abyssDamageReduction", "abyssBossDamageBonus", "abyssPower", "abyssResist", "abyssMaterialDropBonus", "abyssSkillDamageBonus", "mythicWeightBonus", "mythicEssenceDropBonus", "abyssExecuteDamageBonus"] },
    { title: "收益属性", stats: ["gold", "drop", "goldBonus", "rareDropBonus", "equipmentDrop", "cardDrop", "materialQuantityBonus", "baseExpBonus", "jobExpBonus", "offlineEfficiencyBonus"] },
  ];
  return groups
    .map((group) => ({ ...group, entries: group.stats.map((stat) => equipmentStatEntry(effective, stat)).filter(Boolean) }))
    .filter((group) => group.entries.length);
}

function renderEquipmentStatSections(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentStatSections === "function") return runtime.renderEquipmentStatSections(item);
  const statGroups = groupEquipmentStats(item);
  const specialStats = ["ignoreDefense", "echoChance", "splashTargets", "splashDamagePct", "fireBurstChance", "fireBurstAtkPct", "meteorCounterChance", "meteorCounterMatkPct", "skillCooldownPenalty", "higherLevelDamageBonus", "mutationMaterialDoubleChance", "thornVitMultiplier", "combatPaceBonus", "patrolEfficiency", "hitRate", "statusResist", "powerPct", "setPowerBonus"]
    .map((stat) => equipmentStatEntry(getEffectiveItemStats(item, false), stat))
    .filter(Boolean);
  const abyssStats = Object.entries(item.abyssBonus || {})
    .map(([stat, value]) => ({ stat, label: statLabelName(stat), value }))
    .filter((entry) => entry.value);
  const abyssAffixStats = (item.abyssAffixes || []).flatMap((affix) =>
    Object.entries(affix.effects || {}).map(([stat, value]) => ({ stat, label: affix.name || statLabelName(stat), value, desc: affix.desc || "" })),
  );
  const mechanicStats = [...(item.affixes || []), ...(item.mechanicAffixes || []).map((id) => `【${MECHANIC_AFFIXES[id]?.label || id}】`)]
    .filter(Boolean);
  const refineStats = item.refine ? statObjectText(star15Bonus(item)) : "";
  const setText = item.setId ? renderEquipmentSetProgress(item) : "";
  return `
    ${renderEquipmentScores(item)}
    ${renderEquipmentScoreComparison(item)}
    ${statGroups.map((group) => `<div class="equip-section equipment-stat-section"><strong class="equipment-section-title">${group.title}</strong>${renderStatChipGrid(group.entries)}</div>`).join("")}
    ${randomStatsHtml(item)}
    ${(mechanicStats.length || specialStats.length) ? `<div class="equip-section equipment-stat-section"><strong class="equipment-section-title">特殊词条</strong>${renderStatChipGrid(specialStats, "equipment-special-chip")}${mechanicStats.length ? `<div class="equipment-mechanic-tags">${mechanicStats.map((text) => `<span>${escapeHtml(text)}</span>`).join("")}</div>` : ""}</div>` : ""}
    ${(abyssStats.length || abyssAffixStats.length) ? `<div class="equip-section equipment-stat-section equipment-abyss-section"><strong class="equipment-section-title">深渊加成</strong>${renderStatChipGrid(abyssStats, "equipment-special-chip")}${renderStatChipGrid(abyssAffixStats, "equipment-special-chip abyss-affix-chip")}</div>` : ""}
    ${renderEmpowerSection(item)}
    ${renderRefineSection(item, refineStats)}
    ${setText}
  `;
}

function renderSalvagePreviewSection(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSalvagePreviewSection === "function") return runtime.renderSalvagePreviewSection(item);
  const rewards = getSalvageRewardsPreview(item);
  const entries = Object.entries(rewards || {}).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== 0);
  if (!entries.length) return "";
  return `<div class="equip-section equipment-stat-section">
    <strong class="equipment-section-title">分解预览</strong>
    <div class="equipment-stat-grid">${entries
      .map(([materialId, value]) => `<span class="equipment-stat-chip"><span class="equipment-stat-name">${materialNames[materialId] || materialId}</span><span class="equipment-stat-value">${value}</span></span>`)
      .join("")}</div>
  </div>`;
}

function cardSocketEffectText(card = {}) {
  const effects = getSocketCardEffects(card);
  const rows = Object.entries(effects)
    .map(([stat]) => equipmentStatEntry(effects, stat))
    .filter(Boolean)
    .slice(0, 5)
    .map((entry) => `${entry.label} ${formatStatValue(entry.stat, entry.value)}`);
  return rows.join(" · ") || "无属性";
}

function renderCardSocketOptions(selected = "") { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCardSocketOptions === "function") return runtime.renderCardSocketOptions(selected);
  const owned = cardPool.filter((card) => (state.cards[card.id] || 0) > 0);
  if (!owned.length) return `<option value="">暂无可用卡片</option>`;
  return `<option value="">选择卡片</option>${owned
    .map((card) => `<option value="${card.id}" ${selected === card.id ? "selected" : ""}>${escapeHtml(card.name)} ×${formatNumber(state.cards[card.id] || 0)}</option>`)
    .join("")}`;
}

function renderCardSocketSection(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderCardSocketSection === "function") return runtime.renderCardSocketSection(item);
  const slots = normalizeCardSlots(item.cardSlots);
  const maxSlots = getMaxEquipmentCardSlots(item);
  const cost = getCardSocketCost(item);
  const canPunch = maxSlots > slots.length && cost && canAffordSocketCost(cost);
  const slotRows = slots.length
    ? slots
        .map((slot, index) => {
          const card = getSocketCard(slot.cardId);
          if (card) {
            return `<div class="equipment-stat-chip card-socket-row">
              <span class="equipment-stat-name">${escapeHtml(card.name)}</span>
              <span class="equipment-stat-value">${escapeHtml(cardSocketEffectText(card))}</span>
              <button type="button" class="ghost" data-remove-socket-card="${item.id}" data-socket-index="${index}" ${(state.materials.cardRemover || 0) < 1 ? "disabled" : ""}>拆除</button>
            </div>`;
          }
          return `<div class="equipment-stat-chip card-socket-row">
            <span class="equipment-stat-name">空卡槽 ${index + 1}</span>
            <select data-card-socket-select="${item.id}" data-socket-index="${index}">${renderCardSocketOptions()}</select>
            <button type="button" data-socket-card="${item.id}" data-socket-index="${index}">镶嵌</button>
          </div>`;
        })
        .join("")
    : `<small class="slot-meta">当前没有卡槽，需要先打孔。</small>`;
  return `<div class="equip-section equipment-stat-section equipment-card-socket-section">
    <strong class="equipment-section-title">卡槽 ${slots.length}/${maxSlots}</strong>
    <div class="equipment-stat-grid">${slotRows}</div>
    ${
      maxSlots > slots.length
        ? `<small class="slot-meta">打孔消耗：${cardSocketCostText(cost)}</small><button type="button" data-punch-card-slot="${item.id}" ${!canPunch ? "disabled" : ""}>开启卡槽</button>`
        : `<small class="slot-meta">卡槽已达上限。</small>`
    }
    ${slots.some((slot) => slot.cardId) ? `<small class="slot-meta">拆除卡片消耗：${materialNames.cardRemover} ×1。</small>` : ""}
  </div>`;
}

function renderRefineSection(item, refineStats = "") { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderRefineSection === "function") return runtime.renderRefineSection(item, refineStats);
  const next = (item.refine || 0) + 1;
  const chance = next <= 15 ? percent(getRefineChance(next, item)) : "MAX";
  const pity = `${Math.round((item.refineFailCount || 0) * 1.5 * 10) / 10}%`;
  const milestone = item.refine >= 15 ? "满星奖励已激活" : item.refine >= 10 ? "+10 已达成，+15 未达成" : item.refine >= 7 ? "+7 已达成，+10 未达成" : "+7 未达成";
  const growthStats = getRefineGrowthStats(item);
  const growthText = renderRefineStatDelta(growthStats);
  return `<div class="equip-section equipment-refine-section"><strong class="equipment-section-title">星炼</strong><div class="equipment-stat-grid">
    <span class="equipment-stat-chip"><span class="equipment-stat-name">当前等级</span><span class="equipment-stat-value">+${item.refine || 0}</span></span>
    <span class="equipment-stat-chip"><span class="equipment-stat-name">下级成功率</span><span class="equipment-stat-value">${chance}</span></span>
    <span class="equipment-stat-chip"><span class="equipment-stat-name">保底加成</span><span class="equipment-stat-value">+${pity}</span></span>
  </div><small class="slot-meta">星炼成长：${growthText || "该装备暂无可星炼成长属性。"}</small><small class="slot-meta">里程碑：${milestone}${refineStats ? ` · 15星奖励：${refineStats}` : " · 满星奖励：未激活"}</small></div>`;
}

function renderEmpowerSection(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEmpowerSection === "function") return runtime.renderEmpowerSection(item);
  const level = item.empower || 0;
  if (!level) return "";
  const flatBonus = level * 4;
  const percentBonus = Number((level * 1.2).toFixed(1));
  const nextCost = level < 10 ? materialText(getEmpowerCost(item)) : "已满阶";
  return `<div class="equip-section equipment-enchant-section"><strong class="equipment-section-title enchant-title">赋能属性</strong><div class="equipment-stat-grid">
    <span class="equipment-stat-chip enchant-chip"><span class="equipment-stat-name">赋能等级</span><span class="equipment-stat-value">+${level}</span></span>
    <span class="equipment-stat-chip enchant-chip"><span class="equipment-stat-name">固定属性</span><span class="equipment-stat-value">约 +${flatBonus}%</span></span>
    <span class="equipment-stat-chip enchant-chip"><span class="equipment-stat-name">百分比属性</span><span class="equipment-stat-value">约 +${percentBonus}%</span></span>
  </div><small class="slot-meta">下阶消耗：${nextCost}</small></div>`;
}

function renderStatChipGrid(entries, extraClass = "") { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderStatChipGrid === "function") return runtime.renderStatChipGrid(entries, extraClass);
  if (!entries.length) return "";
  return `<div class="equipment-stat-grid">${entries
    .map((entry) => `<span class="equipment-stat-chip ${extraClass}"><span class="equipment-stat-name">${escapeHtml(entry.label)}</span><span class="equipment-stat-value">${formatStatValue(entry.stat, entry.value)}</span></span>`)
    .join("")}</div>`;
}

function renderEquipmentSetProgress(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderEquipmentSetProgress === "function") return runtime.renderEquipmentSetProgress(item);
  const display = getSetDisplayState(item);
  if (!display.hasSet) return "";
  const normalRows = display.effects
    .filter((entry) => !entry.abyss)
    .map((entry) => `<span class="set-stage-chip ${entry.active ? "active" : "inactive"}">${entry.stage}件：${escapeHtml(entry.desc)} · ${entry.source}</span>`)
    .join("");
  const abyssRows = display.effects
    .filter((entry) => entry.abyss)
    .map((entry) => `<span class="set-stage-chip abyss-stage ${entry.active ? "active" : "inactive"}">${entry.stage}件：${escapeHtml(entry.desc)} · ${entry.source}</span>`)
    .join("");
  return `<div class="equip-section equipment-set-section">
    <strong class="equipment-section-title">套装</strong>
    <span>${renderSetName(display.setName)}</span>
    <p class="slot-meta">穿戴 ${display.wornCount}/${display.totalPieces} · 收藏 ${display.collectionCount}/${display.totalPieces}</p>
    <p class="slot-meta">当前按穿戴 / 收藏中较高件数生效。</p>
    ${(display.abyssWornCount || display.abyssCollectionCount) ? `<p class="slot-meta">深渊穿戴 ${display.abyssWornCount}/${display.totalPieces} · 深渊收藏 ${display.abyssCollectionCount}/${display.totalPieces}</p>` : ""}
    <div class="set-stage-list">${normalRows}</div>
    ${abyssRows ? `<div class="set-stage-list abyss-set-list"><strong class="equipment-section-title">深渊套装效果</strong>${abyssRows}<small class="slot-meta">深渊套装效果仅在深渊难度生效。</small></div>` : ""}
    <small class="slot-meta">同名套装穿戴与收藏效果不重复叠加。</small>
  </div>`;
}

function getSetDisplayState(item = {}) {
  const set = equipmentSets[item.setId];
  if (!set) return { hasSet: false };
  const requiredIds = (set.items || []).map((piece) => piece.id);
  const wornItems = Object.values(state.equipped || {})
    .map((id) => state.inventory.find((entry) => entry.id === id))
    .filter((entry) => entry?.setId === item.setId);
  const wornTemplateIds = wornItems.map((entry) => entry.templateId || entry.id);
  const collection = state.zodiacCollection?.[item.setId] || {};
  const collected = Array.isArray(collection.collectedPieceIds) ? collection.collectedPieceIds : [];
  const abyssCollected = Array.isArray(collection.abyssCollectedPieceIds) ? collection.abyssCollectedPieceIds : [];
  const wornCount = requiredIds.filter((id) => wornTemplateIds.includes(id)).length;
  const collectionCount = requiredIds.filter((id) => collected.includes(id)).length;
  const abyssWornCount = wornItems.filter(isAbyssEquipment).length;
  const abyssCollectionCount = requiredIds.filter((id) => abyssCollected.includes(id)).length;
  const normalPieces = Math.max(wornCount, collectionCount);
  const abyssPieces = Math.max(abyssWornCount, abyssCollectionCount);
  const normalStages = set.effects?.pieces || { [requiredIds.length]: set.effects?.full || {} };
  const effects = [];
  Object.entries(normalStages).forEach(([stage, stageEffects]) => {
    const need = Number(stage);
    const source = collectionCount >= need ? "收藏激活" : wornCount >= need ? "穿戴激活" : "未激活";
    effects.push({ stage: need, source, active: normalPieces >= need, desc: describeZodiacEffects(stageEffects) || "套装效果" });
  });
  Object.entries(ABYSS_SET_STAGES).forEach(([stage, stageEffects]) => {
    const need = Number(stage);
    const source = abyssCollectionCount >= need ? "深渊收藏激活" : abyssWornCount >= need ? "深渊穿戴激活" : "未激活";
    effects.push({ stage: need, source, active: abyssPieces >= need, desc: describeZodiacEffects(stageEffects) || "深渊套装效果", abyss: true });
  });
  if (ABYSS_ZODIAC_SET_EFFECTS[item.setId]) {
    effects.push({ stage: requiredIds.length, source: abyssPieces >= requiredIds.length ? "深渊完整激活" : "未激活", active: abyssPieces >= requiredIds.length, desc: describeZodiacEffects(ABYSS_ZODIAC_SET_EFFECTS[item.setId]), abyss: true });
  }
  return {
    hasSet: true,
    setId: item.setId,
    setName: set.name || item.setName,
    wornCount,
    collectionCount,
    abyssWornCount,
    abyssCollectionCount,
    totalPieces: requiredIds.length,
    effects,
    duplicateSuppressed: true,
  };
}

function countEquippedSetPieces(setId) {
  return Object.values(state.equipped || {}).filter((itemId) => state.inventory.find((item) => item.id === itemId)?.setId === setId).length;
}

function statObjectText(stats) {
  return Object.entries(stats)
    .map(([stat, value]) => statLabel(stat, value))
    .filter(Boolean)
    .join(" · ");
}

function getItemStatValue(item, key) {
  if (key === "luk") return Number(item.luk || 0) + Number(item.luck || 0);
  return Number(item[key] || 0);
}

function randomStatEntries(item) {
  const randomStats = normalizeRandomStats(item.randomStats);
  return attributeKeys
    .filter((stat) => randomStats[stat])
    .map((stat) => ({ stat, value: randomStats[stat] || 0 }));
}

function randomStatText(item) {
  return randomStatEntries(item)
    .map((entry) => `${entry.stat.toUpperCase()} +${entry.value}`)
    .join(" · ");
}

function randomStatsHtml(item) {
  return renderRandomStatsPanel(item);
}

function renderRandomStatsPanel(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderRandomStatsPanel === "function") return runtime.renderRandomStatsPanel(item);
  const entries = randomStatEntries(item);
  if (!entries.length) return "";
  const chips = entries
    .map((entry) => `<span class="random-stat-chip"><span class="stat-name">${entry.stat.toUpperCase()}</span> <span class="stat-value">+${entry.value}</span></span>`)
    .join("");
  return `<div class="random-stats-panel"><div class="random-stats-title">随机附加</div><div class="random-stat-chips">${chips}</div></div>`;
}

function legacyGetEffectiveItemStats(item, includeRandom = true) {
  const multiplier = refineMultiplier(item.refine || 0);
  const empowerMultiplier = 1 + (item.empower || 0) * 0.04;
  const scaleFlat = (value) => Math.round((value || 0) * multiplier * empowerMultiplier);
  const scalePercent = (value, stat = "") => Number(((value || 0) * (refineGrowthFactorForStat(stat, item.refine || 0) + (item.empower || 0) * 0.012)).toFixed(3));
  const addScaledStat = (target, stat, value, { applyRefine = true } = {}) => {
    const numeric = Number(value || 0);
    if (!Number.isFinite(numeric) || numeric === 0) return;
    const factor = applyRefine ? refineGrowthFactorForStat(stat, item.refine || 0) : 1;
    const decimals = statIsPercent(stat) || stat.endsWith("Bonus") || stat.endsWith("Pct") || stat === "thornVitMultiplier" ? 3 : 0;
    const scaled = decimals ? Number((numeric * factor).toFixed(decimals)) : Math.round(numeric * factor);
    target[stat] = Number(((target[stat] || 0) + scaled).toFixed(decimals));
  };
  const stats = {
    atk: scaleFlat(item.atk),
    matk: scaleFlat(item.matk),
    def: scaleFlat(item.def),
    hp: scaleFlat(item.hp),
    luck: 0,
    str: scaleFlat(item.str),
    agi: scaleFlat(item.agi),
    vit: scaleFlat(item.vit),
    int: scaleFlat(item.int),
    dex: scaleFlat(item.dex),
    luk: scaleFlat(item.luk) + scaleFlat(item.luck),
    aspd: scalePercent(item.aspd, "aspd"),
    crit: scalePercent(item.crit, "crit"),
    drop: scalePercent(item.drop, "drop"),
    gold: scalePercent(item.gold, "gold"),
    hpRegen: scaleFlat(item.hpRegen),
    dodgeRate: scalePercent(item.dodgeRate, "dodgeRate"),
    atkPct: scalePercent(item.atkPct, "atkPct"),
    matkPct: scalePercent(item.matkPct, "matkPct"),
    hpPct: scalePercent(item.hpPct, "hpPct"),
    defPct: scalePercent(item.defPct, "defPct"),
    attackSpeedPct: scalePercent(item.attackSpeedPct, "attackSpeedPct"),
    critRatePct: scalePercent(item.critRatePct, "critRatePct"),
    critDamageBonus: scalePercent(item.critDamageBonus, "critDamageBonus"),
    skillDamageBonus: scalePercent(item.skillDamageBonus, "skillDamageBonus"),
    monsterDamageBonus: scalePercent(item.monsterDamageBonus, "monsterDamageBonus"),
    bossDamageBonus: scalePercent(item.bossDamageBonus, "bossDamageBonus"),
    bossDamageReduction: scalePercent(item.bossDamageReduction, "bossDamageReduction"),
    finalDamageBonus: scalePercent(item.finalDamageBonus, "finalDamageBonus"),
    eliteDamageBonus: scalePercent(item.eliteDamageBonus, "eliteDamageBonus"),
    rareDropBonus: scalePercent(item.rareDropBonus, "rareDropBonus"),
    damageReductionPct: scalePercent(item.damageReductionPct, "damageReductionPct"),
    damageReduction: scalePercent(item.damageReduction, "damageReduction"),
    lifeSteal: scalePercent(item.lifeSteal, "lifeSteal"),
    blockRate: scalePercent(item.blockRate, "blockRate"),
    antiCrit: scalePercent(item.antiCrit, "antiCrit"),
    dodgeRatePct: scalePercent(item.dodgeRatePct, "dodgeRatePct"),
    hpRegenPct: scalePercent(item.hpRegenPct, "hpRegenPct"),
    ignoreDefense: scalePercent(item.ignoreDefense, "ignoreDefense"),
    baseExpBonus: scalePercent(item.baseExpBonus, "baseExpBonus"),
    jobExpBonus: scalePercent(item.jobExpBonus, "jobExpBonus"),
    expBonus: scalePercent(item.expBonus, "expBonus"),
    equipmentDrop: scalePercent(item.equipmentDrop, "equipmentDrop"),
    cardDrop: scalePercent(item.cardDrop, "cardDrop"),
    materialQuantityBonus: scalePercent(item.materialQuantityBonus, "materialQuantityBonus"),
    powerPct: scalePercent(item.powerPct, "powerPct"),
    combatPaceBonus: scalePercent(item.combatPaceBonus, "combatPaceBonus"),
    patrolEfficiency: scalePercent(item.patrolEfficiency, "patrolEfficiency"),
    hitRate: scalePercent(item.hitRate, "hitRate"),
    statusResist: scalePercent(item.statusResist, "statusResist"),
    echoChance: scalePercent(item.echoChance, "echoChance"),
    mutationMaterialDoubleChance: scalePercent(item.mutationMaterialDoubleChance, "mutationMaterialDoubleChance"),
    thornVitMultiplier: Number(((item.thornVitMultiplier || 0) * refineGrowthFactorForStat("thornVitMultiplier", item.refine || 0)).toFixed(3)),
    abyssPower: scalePercent(item.abyssPower, "abyssPower"),
    abyssResist: scalePercent(item.abyssResist, "abyssResist"),
  };
  [
    "abyssDamageBonus",
    "abyssBossDamageBonus",
    "abyssDamageReduction",
    "abyssMaterialDropBonus",
    "abyssSkillDamageBonus",
    "abyssExecuteDamageBonus",
    "mythicWeightBonus",
    "mythicEssenceDropBonus",
    "rebirthPrestigeWeightBonus",
    "setPowerBonus",
    "finalDamageBonus",
    "eliteDamageBonus",
    "rareDropBonus",
    "bossDamageReduction",
  ].forEach((stat) => {
    if (!(stat in stats)) addScaledStat(stats, stat, item[stat]);
  });
  (item.mechanicAffixes || []).forEach((id) => {
    const mechanic = MECHANIC_AFFIXES[id];
    Object.entries(mechanic?.effects || {}).forEach(([stat, value]) => {
      addScaledStat(stats, stat, value);
    });
  });
  Object.entries(item.abyssBonus || {}).forEach(([stat, value]) => {
    addScaledStat(stats, stat, value);
  });
  (item.abyssAffixes || []).forEach((affix) => {
    Object.entries(affix?.effects || {}).forEach(([stat, value]) => {
      addScaledStat(stats, stat, value);
    });
  });
  Object.entries(computeCardSocketBonuses(item)).forEach(([stat, value]) => {
    stats[stat] = Number(((stats[stat] || 0) + Number(value || 0)).toFixed(statIsPercent(stat) || stat.endsWith("Bonus") ? 3 : 0));
  });
  if (includeRandom) {
    const randomStats = normalizeRandomStats(item.randomStats);
    attributeKeys.forEach((stat) => {
      stats[stat] += Math.round((randomStats[stat] || 0) * multiplier);
    });
  }
  const bonus = star15Bonus(item);
  Object.entries(bonus).forEach(([stat, value]) => {
    stats[stat] = Number(((stats[stat] || 0) + value).toFixed(statIsPercent(stat) || stat.endsWith("Bonus") ? 3 : 0));
  });
  return stats;
}

function getEffectiveItemStats(item, includeRandom = true) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getEffectiveItemStats === "function") {
    return runtime.getEffectiveItemStats(item, includeRandom);
  }
  return legacyGetEffectiveItemStats(item, includeRandom);
}

function refineMultiplier(star) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.refineMultiplier === "function") return runtime.refineMultiplier(star);
  return 1 + Math.max(0, Number(star) || 0) * 0.02;
}

function refineGrowthFactorForStat(stat, star = 0) {
  const level = Math.max(0, Number(star) || 0);
  if (!level) return 1;
  const flatStats = new Set(["atk", "matk", "def", "hp", "hpRegen", "str", "agi", "vit", "int", "dex", "luk", "luck"]);
  if (flatStats.has(stat)) return refineMultiplier(level);
  const highValueStats = new Set([
    "finalDamageBonus",
    "bossDamageBonus",
    "eliteDamageBonus",
    "abyssDamageBonus",
    "abyssBossDamageBonus",
    "abyssDamageReduction",
    "rareDropBonus",
    "drop",
    "gold",
    "goldBonus",
    "baseExpBonus",
    "jobExpBonus",
    "expBonus",
    "equipmentDrop",
    "cardDrop",
    "materialQuantityBonus",
    "mythicWeightBonus",
    "mythicEssenceDropBonus",
    "rebirthPrestigeWeightBonus",
    "echoChance",
    "mutationMaterialDoubleChance",
  ]);
  if (highValueStats.has(stat)) return 1 + level * 0.006;
  return 1 + level * 0.01;
}

function getRefineGrowthStats(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getRefineGrowthStats === "function") return runtime.getRefineGrowthStats(item);
  const refine = item?.refine || 0;
  if (!item || refine <= 0) return {};
  const before = getEffectiveItemStats({ ...item, refine: 0, refineFailCount: 0 });
  const after = getEffectiveItemStats(item);
  return diffRefineStats(before, after);
}

function star15Bonus(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.star15Bonus === "function") return runtime.star15Bonus(item);
  if ((item.refine || 0) < 15 || !["rare", "epic", "ancient", "legend", "darkGold", "mythic"].includes(item.rarity)) {
    return {};
  }
  const slot = equipmentSlot(item);
  if (slot === "weapon") return item.matk > item.atk ? { atk: 8, matk: 22, skillDamageBonus: 0.03 } : { atk: 22, matk: 8, skillDamageBonus: 0.03 };
  if (slot === "armor") return { hp: 20, damageReductionPct: 0.02 };
  if (slot === "headgear") return { critRatePct: 0.01, allStats: 2 };
  if (slot === "shoes") return { dodgeRatePct: 0.01, attackSpeedPct: 0.01 };
  return { critDamageBonus: 0.04, drop: 0.01, gold: 0.01 };
}

function getRefineMilestoneBonuses(item) {
  const runtime = window.RuneFrontierEquipmentRuntime;
  if (runtime && typeof runtime.getRefineMilestoneBonuses === "function") return runtime.getRefineMilestoneBonuses(item);
  const star = item?.refine || 0;
  const slot = equipmentSlot(item);
  const bonuses = {};
  const tiers = {
    weapon: [{ str: 2 }, { skillDamageBonus: 0.01 }, { str: 2 }, { bossDamageBonus: 0.02 }, { finalDamageBonus: 0.02 }],
    armor: [{ vit: 2 }, { hp: 20 }, { damageReductionPct: 0.01 }, { hp: 30 }, { damageReductionPct: 0.02 }],
    headgear: [{ int: 2 }, { critRatePct: 0.005 }, { baseExpBonus: 0.01 }, { allStats: 1 }, { skillDamageBonus: 0.01 }],
    shoes: [{ agi: 2 }, { dodgeRatePct: 0.01 }, { attackSpeedPct: 0.01 }, { hpRegenPct: 0.02 }, { combatPaceBonus: 0.01 }],
    trinket: [{ luk: 2 }, { drop: 0.005 }, { gold: 0.01 }, { cardDrop: 0.005 }, { drop: 0.01 }],
  };
  const tier = tiers[slot] || tiers.trinket;
  if (star >= 3) Object.entries(tier[0] || {}).forEach(([k, v]) => { bonuses[k] = (bonuses[k] || 0) + (v || 0); });
  if (star >= 6) Object.entries(tier[1] || {}).forEach(([k, v]) => { bonuses[k] = (bonuses[k] || 0) + (v || 0); });
  if (star >= 9) Object.entries(tier[2] || {}).forEach(([k, v]) => { bonuses[k] = (bonuses[k] || 0) + (v || 0); });
  if (star >= 12) Object.entries(tier[3] || {}).forEach(([k, v]) => { bonuses[k] = (bonuses[k] || 0) + (v || 0); });
  if (star >= 15) Object.entries(tier[4] || {}).forEach(([k, v]) => { bonuses[k] = (bonuses[k] || 0) + (v || 0); });
  return bonuses;
}

function cardEffectText(card) {
  const attrs = Object.entries(getSocketCardEffects(card || {}))
    .map(([stat, value]) => statLabel(stat, value))
    .filter(Boolean);
  if (card?.description) attrs.push(card.description);
  return attrs.join(" · ") || "无属性";
}

function statLabel(stat, value) {
  if (!value) return "";
  if (stat === "skillCooldownPenalty") return `${statLabelName(stat)} -${percent(Math.abs(value))}`;
  return `${statLabelName(stat)} ${formatStatValue(stat, value)}`;
}

function statLabelName(stat) {
  const names = {
    atk: "攻击",
    matk: "魔法攻击",
    def: "防御",
    hp: "生命",
    maxHp: "生命",
    str: "STR",
    agi: "AGI",
    vit: "VIT",
    int: "INT",
    dex: "DEX",
    luk: "LUK",
    aspd: "攻速",
    luck: "幸运",
    crit: "暴击率",
    critRate: "暴击率",
    drop: "物品掉率",
    gold: "金币获取",
    hpRegen: "生命恢复",
    dodgeRate: "闪避",
    atkPct: "攻击",
    matkPct: "魔法攻击",
    hpPct: "生命",
    defPct: "防御",
    aspdPct: "攻速",
    attackSpeedPct: "攻速",
    critRatePct: "暴击率",
    critDamageBonus: "暴击伤害",
    skillDamageBonus: "技能伤害",
    monsterDamageBonus: "对怪物伤害",
    bossDamageBonus: "Boss伤害",
    finalDamageBonus: "最终伤害",
    physicalFinalDamageBonus: "物理最终伤害",
    eliteDamageBonus: "精英/首领伤害",
    bossDamageReduction: "Boss减伤",
    rareDropBonus: "稀有掉率",
    abyssDamageBonus: "深渊伤害",
    abyssBossDamageBonus: "深渊Boss伤害",
    abyssDamageReduction: "深渊减伤",
    abyssPower: "深渊强度",
    abyssResist: "深渊抗性",
    abyssMaterialDropBonus: "深渊材料掉率",
    abyssSkillDamageBonus: "深渊技能伤害",
    abyssGoldPct: "深渊金币",
    abyssBaseExpPct: "深渊BASE经验",
    abyssJobExpPct: "深渊JOB经验",
    abyssCardDropBonus: "深渊卡片掉率",
    abyssItemDropBonus: "深渊物品掉率",
    mythicWeightBonus: "神话权重",
    mythicEssenceDropBonus: "神话精粹掉率",
    rebirthPrestigeWeightBonus: "转生声望加成",
    abyssExecuteDamageBonus: "深渊斩杀",
    setPowerBonus: "套装战力",
    goldBonus: "金币收益",
    expBonus: "经验获取",
    damageReduction: "伤害减免",
    damageReductionPct: "伤害减免",
    lifeSteal: "吸血",
    blockRate: "格挡",
    antiCrit: "抗暴",
    dodgeRatePct: "闪避率",
    hpRegenPct: "生命恢复",
    ignoreDefense: "破甲",
    baseExpBonus: "BASE经验",
    jobExpBonus: "JOB经验",
    equipmentDrop: "装备掉率",
    cardDrop: "卡片掉率",
    materialQuantityBonus: "材料数量",
    powerPct: "战力",
    combatPaceBonus: "战斗节奏",
    patrolEfficiency: "巡逻效率",
    offlineEfficiencyBonus: "离线效率",
    hitRate: "命中",
    statusResist: "异常/暴击抗性",
    echoChance: "回响",
    normalAttackDamageBonus: "普攻伤害",
    higherLevelDamageBonus: "越级伤害",
    magicDamageReduction: "魔法减伤",
    skillDamageReduction: "技能减伤",
    skillCooldownPenalty: "技能触发节奏",
    skillHitHealPct: "技能命中回血",
    splashTargets: "溅射目标",
    splashDamagePct: "溅射伤害",
    fireBurstChance: "火焰爆发概率",
    fireBurstAtkPct: "火焰爆发伤害",
    meteorCounterChance: "陨石反击概率",
    meteorCounterMatkPct: "陨石反击伤害",
    mutationMaterialDoubleChance: "贪婪",
    thornVitMultiplier: "荆棘",
    strPct: "STR",
    agiPct: "AGI",
    vitPct: "VIT",
    intPct: "INT",
    dexPct: "DEX",
    lukPct: "LUK",
    dps: "战力",
    dropBonus: "物品掉率",
    materialDropBonus: "材料掉率",
    hpBonus: "生命",
    defBonus: "防御",
    critRateBonus: "暴击率",
    bossDamage: "Boss伤害",
    bossEquipDropBonus: "Boss装备掉率",
    bossQualityWeight: "稀有品质权重",
    abyssDamage: "深渊伤害",
    mythicQualityWeight: "神话品质权重",
    cardDamage: "对该怪物伤害",
  };
  return names[stat] || stat;
}

function formatStatValue(stat, value) {
  const sign = value > 0 ? "+" : "";
  if (statIsPercent(stat)) return `${sign}${percent(value)}`;
  return `${sign}${Math.round(value)}`;
}

function formatRangeValue(stat, range) {
  const ordered = range[0] <= range[1] ? range : [range[1], range[0]];
  return `${formatStatValue(stat, ordered[0])} 到 ${formatStatValue(stat, ordered[1])}`;
}

function statIsPercent(stat) {
  return [
    "aspd",
    "crit",
    "critRate",
    "drop",
    "gold",
    "dodgeRate",
    "atkPct",
    "matkPct",
    "hpPct",
    "defPct",
    "aspdPct",
    "attackSpeedPct",
    "critRatePct",
    "critDamageBonus",
    "skillDamageBonus",
    "monsterDamageBonus",
    "bossDamageBonus",
    "bossDamageReduction",
    "finalDamageBonus",
    "physicalFinalDamageBonus",
    "eliteDamageBonus",
    "rareDropBonus",
    "normalAttackDamageBonus",
    "higherLevelDamageBonus",
    "abyssDamageBonus",
    "abyssBossDamageBonus",
    "abyssDamageReduction",
    "abyssPower",
    "abyssResist",
    "abyssMaterialDropBonus",
    "abyssSkillDamageBonus",
    "abyssGoldPct",
    "abyssBaseExpPct",
    "abyssJobExpPct",
    "abyssCardDropBonus",
    "abyssItemDropBonus",
    "mythicWeightBonus",
    "mythicEssenceDropBonus",
    "rebirthPrestigeWeightBonus",
    "abyssExecuteDamageBonus",
    "setPowerBonus",
    "abyssSkillChanceBonus",
    "abyssDefenseReduction",
    "abyssAttackSpeedPct",
    "abyssCritRatePct",
    "abyssMagicDamageBonus",
    "abyssAttrPct",
    "abyssPowerPct",
    "abyssCritDamageBonus",
    "abyssEliteDamageBonus",
    "abyssDexPct",
    "abyssIgnoreDefense",
    "abyssBossDamageReduction",
    "goldBonus",
    "expBonus",
    "damageReduction",
    "lifeSteal",
    "blockRate",
    "antiCrit",
    "ignoreDefense",
    "damageReductionPct",
    "dodgeRatePct",
    "hpRegenPct",
    "baseExpBonus",
    "jobExpBonus",
    "equipmentDrop",
    "cardDrop",
    "materialQuantityBonus",
    "powerPct",
    "combatPaceBonus",
    "patrolEfficiency",
    "offlineEfficiencyBonus",
    "hitRate",
    "statusResist",
    "echoChance",
    "magicDamageReduction",
    "skillDamageReduction",
    "skillCooldownPenalty",
    "skillHitHealPct",
    "splashDamagePct",
    "fireBurstChance",
    "fireBurstAtkPct",
    "meteorCounterChance",
    "meteorCounterMatkPct",
    "mutationMaterialDoubleChance",
    "strPct",
    "agiPct",
    "vitPct",
    "intPct",
    "dexPct",
    "lukPct",
    "dps",
  ].includes(stat);
}

function cardName(id) {
  return cardPool.find((card) => card.id === id)?.name || "卡片";
}

function slotName(slot) {
  const aliases = { body: "armor", headTop: "headgear", accessory: "trinket", bodyArmor: "armor" };
  slot = aliases[slot] || slot;
  return (
    {
      front: "角色1",
      mid: "角色2",
      back: "角色3",
      weapon: "武器",
      armor: "防具",
      headgear: "头饰",
      shoes: "鞋子",
      trinket: "饰品",
    }[slot] || slot
  );
}

function rarityName(rarity) {
  return rarityDisplay[rarity] || rarity;
}

function getRarityClass(itemOrRarity) {
  const rarity = typeof itemOrRarity === "string" ? itemOrRarity : itemOrRarity?.rarity || "normal";
  const classes = ["item-name", `rarity-${rarity}`];
  if (isHighestRarity(rarity)) classes.push("rarity-highest", "text-shine");
  return classes.join(" ");
}

function getRarityLabel(rarity) {
  return rarityName(rarity);
}

function isHighestRarity(rarity) {
  const available = [
    ...equipmentTiers.map((tier) => tier.id),
    ...Object.values(equipmentSets).flatMap((set) => set.items.map((item) => item.rarity)),
    ...oneHandSwordPoolFiltered.map((item) => item.rarity),
  ];
  const highest = [...new Set(available)].sort((a, b) => rarityOrder.indexOf(b) - rarityOrder.indexOf(a))[0] || "legend";
  return rarity === highest;
}

function getRefineBadgeClass(refineLevel) {
  if (refineLevel >= 10) return "refine-badge-10";
  if (refineLevel >= 9) return "refine-badge-9";
  if (refineLevel >= 8) return "refine-badge-8";
  if (refineLevel >= 7) return "refine-badge-7";
  return "";
}

function renderRefineBadge(item) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderRefineBadge === "function") return runtime.renderRefineBadge(item);
  const refine = item?.refine || 0;
  if (refine < 7) return "";
  return `<span class="refine-badge ${getRefineBadgeClass(refine)}" title="星炼 ★${refine}">星★${refine}</span>`;
}

function renderItemName(item, extraText = "") { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderItemName === "function") return runtime.renderItemName(item, extraText);
  const cleanExtra = String(extraText || "").replace(/\s+/g, " ").trim();
  const prefix = (item?.enhanceLevel || 0) > 0 ? `+${item.enhanceLevel} ` : "";
  return `<span class="${getRarityClass(item)}">${prefix}${escapeHtml(getDisplayItemName(item))}${cleanExtra ? ` ${escapeHtml(cleanExtra)}` : ""}</span>${renderRefineBadge(item)}`;
}

function renderSetName(setName) { const runtime = window.RuneFrontierRenderRuntime; if (runtime && typeof runtime.renderSetName === "function") return runtime.renderSetName(setName);
  return `<span class="set-name">${escapeHtml(setName)}</span>`;
}

function addLog(text) {
  const stamp = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  state.log.unshift(`${stamp} ${text}`);
  state.log = state.log.slice(0, 24);
}

function addLogHtml(html) {
  const stamp = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  state.log.unshift({ html: `${escapeHtml(stamp)} ${html}` });
  state.log = state.log.slice(0, 24);
}

// [CLEANED] Format/math utilities (formatNumber, formatDuration, percent, escapeHtml, etc.)
// moved to tools.js. Loaded before game.js in index.html. See tools.js for authoritative source.

function showToast(text) {
  els.toast.textContent = text;
  els.toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 1800);
}

// [AUTHORITY] equipment-runtime: 28 config tables exposed. Module-owned: itemFactory, itemStats, itemScore, itemNaming, dismantle, refine, starRefine, socket. Deferred: equipmentTiers, ITEM_TIER_CONFIG, salvageRewards (in game.js data section).
window.RuneFrontierLegacyEquipmentContext = () => Object.freeze({
  getState() {
    return state;
  },
  getEquipmentTiers() {
    return equipmentTiers;
  },
  getItemTierConfig(id) {
    return ITEM_TIER_CONFIG[id] || {};
  },
  getItemTierForLevel,
  inferItemTier,
  getSlotLevelGrowth,
  normalizeEquipmentSlot,
  inferEquipmentSubType,
  equipmentImagePath,
  getTemplateBaseStats,
  shouldRollRandomStats,
  rollRandomStats,
  defaultRandomStats,
  normalizeRandomStats,
  normalizeCardSlots,
  inferItemRanges,
  rollEquipmentTier,
  randomFloat,
  randomInt,
  addBaseRanges,
  applyTierExtra,
  applyRandomAffixes,
  applyAbyssEquipmentBonus,
  applyAbyssSetItemBonus,
  canCreateMythic,
  safeHeroBaseLevel,
  rarityRank,
  isAbyssEquipment,
  createItemId(slot) {
    return `${slot}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  },
  createLegacyItemId() {
    return `legacy-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  },
  getSalvageTable(tier) {
    return salvageRewards[tier] || salvageRewards.normal;
  },
  getInventoryLimit,
  addMaterials,
  recordSessionReward,
  recordRecentLoot,
  recordAutoSalvageBatch(rewards) {
    autoSalvageBatchCount += 1;
    Object.entries(rewards).forEach(([id, qty]) => {
      autoSalvageBatchMaterials[id] = (autoSalvageBatchMaterials[id] || 0) + qty;
    });
  },
  showAutoSalvageFeedback,
  logAutoSalvage(item, rewards) {
    addLog(`自动分解 ${rarityName(item.rarity)}装备：${getDisplayItemName(item)}，获得 ${materialText(rewards)}。`);
  },
  logInventoryFull() {
    addLog("背包已满，装备掉落未能拾取。");
  },
  recordEquipmentSessionReward(item) {
    recordSessionReward({ equipments: 1 });
    runtimeSessionStats.equipmentByRarity[item.rarity] = (runtimeSessionStats.equipmentByRarity[item.rarity] || 0) + 1;
    if (item.setId) runtimeSessionStats.zodiacEquipmentCount += 1;
    if (isAbyssEquipment(item)) runtimeSessionStats.abyssEquipmentCount += 1;
    if (isAbyssEquipment(item) && item.setId) runtimeSessionStats.abyssSetEquipmentCount += 1;
    updateDailyGoalProgress("daily_equipment", 1);
  },
  trackEquipmentAchievement,
  addDropLog,
  showDropFeedback(item) {
    showLootDropFeedback(item);
    showRareLootBroadcast(item);
  },
  isBossEncounter() {
    return Boolean(state.enemyBoss);
  },
  showToast,
  logManualSalvage(item, rewards) {
    addLog(`分解 ${getDisplayItemName(item)}，获得 ${materialText(rewards)}。`);
  },
  showSalvageResult(count, rewards) {
    showSalvageResultModal("分解完成", count, rewards);
  },
  render: renderAll,
  save,
  getMechanicAffixEffects(id) {
    return MECHANIC_AFFIXES[id]?.effects || {};
  },
  computeCardSocketBonuses(item) {
    return computeCardSocketBonuses(item);
  },
  equipmentSlot,
  getDisplayItemName,
  getEffectiveItemStats,
  getRuntimeSessionStats() { return runtimeSessionStats; },
  updateDailyGoalProgress,
  updateAchievementProgress,
  hasMaterials,
  consumeMaterials,
  materialText,
  statIsPercent,
  statLabelName,
  formatNumber,
  itemScore,
  showRefineResult: showRefineResultModal,
  renderRefineStatDelta,
  getEnhanceMaxLevel() { return ENHANCE_MAX_LEVEL; },
  getEnhanceChances() { return ENHANCE_CHANCES; },
  getEnhanceMilestoneLevels() { return ENHANCE_MILESTONE_LEVELS; },
  getEnhanceMilestoneBonuses() { return ENHANCE_MILESTONE_BONUSES; },
  getEnhancePassiveChances() { return ENHANCE_PASSIVE_CHANCES; },
  getEnhancePassivePool() { return ENHANCE_PASSIVE_POOL; },
  getEnhancePassiveDb() { return ENHANCE_PASSIVE_DB; },
  getEnhanceDowngrade,
  getCardSocketMaxByRarity() { return CARD_SOCKET_MAX_BY_RARITY; },
});

// [AUTHORITY] drops-runtime: 20 config refs. Module-owned: online/offline drop rolling, loot normalization. Deferred: equipmentDropTables, materialDropTables, cardDropTables, cardPool (in game.js data section).
window.RuneFrontierLegacyDropsContext = () => Object.freeze({
  getState() {
    return state;
  },
  now() {
    return Date.now();
  },
  createEntryId(time) {
    return `loot-${time.toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  },
  createEmptyRewards: defaultOfflineRewards,
  normalizeBaseRewards: normalizeOfflineRewards,
  normalizeEquipment: normalizeItem,
  normalizeRewards: normalizeOfflineRewards,
  objectTotal: offlineObjectTotal,
  currentMap,
  getDifficultyConfig: currentDifficultyConfig,
  computeStats,
  getMaterialDropTable(mapId) {
    return materialDropTables[mapId] || [];
  },
  getCardDropTable(mapId) {
    return cardDropTables[mapId] || [];
  },
  getCard(cardId) {
    return getSocketCard(cardId);
  },
  getMaterialName(materialId) {
    return materialNames[materialId] || materialId;
  },
  getMaterialRarity(materialId) {
    return MATERIAL_DB[materialId]?.rarity || "";
  },
  getDarkGoldFragmentDropConfig(difficultyId) {
    return DARK_GOLD_FRAGMENT_DROPS[difficultyId] || DARK_GOLD_FRAGMENT_DROPS.normal;
  },
  getZodiacSetIds(mapId) {
    return zodiacSetDropMap[mapId] || [];
  },
  getTransitionSetIds(mapId) {
    return transitionSetDropMap[mapId] || [];
  },
  getEquipmentSet(setId) {
    return equipmentSets[setId];
  },
  getZodiacSetDropRates() {
    return ZODIAC_SET_DROP_RATES;
  },
  getTransitionSetDropRates() {
    return TRANSITION_SET_DROP_RATES;
  },
  getMythicDropRates() {
    return MYTHIC_DROP_RATES;
  },
  getAbyssBossMultiplier() {
    return ABYSS_BOSS_EXTRA_MULTIPLIER;
  },
  getMapLevelRange,
  getMutationExtraDrops() {
    return MUTATION_EXTRA_DROPS;
  },
  currentMapIndex() {
    return state.currentMap || 0;
  },
  currentMonsterStats,
  isBossEncounter() {
    return Boolean(state.enemyBoss);
  },
  createMutationEquipment,
  renderItemName,
  addLogHtml,
  applyMaterialQuantityBonus,
  recordSessionReward,
  recordRecentLoot,
  addLog,
  getDropTableId(mapId) {
    return mapDropTableAlias[mapId] || mapId;
  },
  getEquipmentDropTable(tableId) {
    return equipmentDropTables[tableId] || [];
  },
  getEquipmentTemplate(id) {
    return equipmentTemplateDb[id];
  },
  getMaxEquipmentDrops(isBoss) {
    return isBoss ? MAX_BOSS_EQUIPMENT_DROPS : MAX_EQUIPMENT_DROPS_PER_KILL;
  },
  getEffectiveEquipmentDropRate,
  getOnlineEquipmentDropChance,
  weightedChoice,
  applyRebirthPrestigeDropWeight,
  getDarkGoldUpgradeRate,
  getDifficultyDropLevelBonus() {
    return DIFFICULTY_DROP_LEVEL_BONUS[state.currentDifficulty] || DIFFICULTY_DROP_LEVEL_BONUS.normal;
  },
  clampLevel(value) {
    return clampNumber(value, 1, MAX_EQUIPMENT_LEVEL);
  },
  randomInt,
  random() {
    return Math.random();
  },
  currentDifficulty() {
    return state.currentDifficulty;
  },
  createItem(template, level, forcedTierId, context) {
    const runtime = window.RuneFrontierEquipmentRuntime;
    return runtime?.createItem
      ? runtime.createItem(template, level, forcedTierId, context)
      : legacyCreateItem(template, level, forcedTierId, context);
  },
  addEquipmentToInventory(item, options) {
    const runtime = window.RuneFrontierEquipmentRuntime;
    return runtime?.addEquipmentToInventory
      ? runtime.addEquipmentToInventory(item, options)
      : legacyAddEquipmentToInventory(item, options);
  },
});

// [AUTHORITY] offline-runtime: 15 config refs. Module-owned: calculateOfflineRewards, buildOfflineMonsterStats, all rollOffline*Drops. Deferred: OFFLINE_EFFICIENCY, OFFLINE_MAX_KILLS (constants in game.js).
window.RuneFrontierLegacyOfflineContext = () => Object.freeze({
  getState() {
    return state;
  },
  now() {
    return Date.now();
  },
  createEmptyRewards: defaultOfflineRewards,
  normalizeLootRewards,
  objectTotal: offlineObjectTotal,
  getLatestRecentLootRewards,
  currentDifficulty() {
    return state.currentDifficulty;
  },
  currentMap,
  getMaps() {
    return maps;
  },
  computeStats,
  getDifficultyConfig: currentDifficultyConfig,
  getVipMilestoneBonuses,
  getCardDropTable(mapId) {
    return cardDropTables[mapId] || [];
  },
  getMaterialDropTable(mapId) {
    return materialDropTables[mapId] || [];
  },
  getDropTableAlias(mapId) {
    return mapDropTableAlias[mapId] || mapId;
  },
  getEquipmentDropTable(tableId) {
    return equipmentDropTables[tableId] || [];
  },
  getCard(cardId) {
    return getSocketCard(cardId);
  },
  getMaterialName(materialId) {
    return materialNames[materialId] || materialId;
  },
  getMaterialRarity(materialId) {
    return MATERIAL_DB[materialId]?.rarity || "";
  },
  getZodiacSetIds(mapId) {
    return zodiacSetDropMap[mapId] || [];
  },
  getTransitionSetIds(mapId) {
    return transitionSetDropMap[mapId] || [];
  },
  getEquipmentSet(setId) {
    return equipmentSets[setId];
  },
  getZodiacSetDropRates() {
    return ZODIAC_SET_DROP_RATES;
  },
  getTransitionSetDropRates() {
    return TRANSITION_SET_DROP_RATES;
  },
  getMythicDropRates() {
    return MYTHIC_DROP_RATES;
  },
  getMutationExtraDrops() {
    return MUTATION_EXTRA_DROPS;
  },
  getMapLevelRange,
  getMaxOfflineSeconds() {
    return MAX_OFFLINE_SECONDS;
  },
  getMapIndex(map) {
    return maps.indexOf(map);
  },
  getOfflineEquipmentDropRateMultiplier() {
    return OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER;
  },
  getOfflineEfficiency() {
    return OFFLINE_EFFICIENCY;
  },
  getOfflineMaxKills() {
    return OFFLINE_MAX_KILLS;
  },
  getInventoryLimit,
  random() {
    return Math.random();
  },
  randomInt,
  applyMaterialQuantityBonus,
  createItem,
  createMutationEquipment,
  pickMonsterTemplate,
  rollMonsterLevel,
  rollMonsterMutation,
  buildMonsterStats,
  rollEquipmentDropsFromTable,
  gainMapExploration,
  getEquipmentRuntime() {
    return window.RuneFrontierEquipmentRuntime;
  },
  canOfflineFullSalvage,
  mergeMaterialReward: mergeMaterialRewardIntoList,
  gainExp,
  grantCards(cards) {
    (cards || []).forEach((card) => {
      state.cards[card.cardId] = (state.cards[card.cardId] || 0) + (card.qty || 0);
      state.cardCodex[card.cardId] = state.cardCodex[card.cardId] || { obtained: false, obtainCount: 0, firstObtainedAt: 0 };
      state.cardCodex[card.cardId].obtained = true;
      state.cardCodex[card.cardId].obtainCount += card.qty || 0;
      if (!state.cardCodex[card.cardId].firstObtainedAt) state.cardCodex[card.cardId].firstObtainedAt = Date.now();
    });
  },
  grantMaterials(materials) {
    (materials || []).forEach((material) => {
      state.materials[material.materialId] = (state.materials[material.materialId] || 0) + (material.qty || 0);
    });
  },
  recordRecentLoot,
  showToast,
  afterClaim() {
    closeOfflineRewardModal();
    showToast("\u79bb\u7ebf\u6536\u76ca\u5df2\u9886\u53d6");
    updateDailyGoalProgress("daily_loot", 1);
    renderAll();
    save();
  },
  calculateOfflineRewards,
  buildOfflineReward,
  rollOfflineEquipmentDrops,
  rollOfflineCardDrops,
  rollOfflineMaterialDrops,
  rollOfflineZodiacSetDrops,
  rollOfflineTransitionSetDrops,
  rollOfflineMythicDrops,
  rollOfflineMutationExtraDrops,
});

// [AUTHORITY] combat-runtime: 42 config refs. Module-owned: updateCombat, boss state, damage, skills, settlement, monster pipeline, encounter pipeline. Deferred: maps, DIFFICULTY_CONFIG, MONSTER_DIFFICULTY_MODIFIERS (in game.js data section).
window.RuneFrontierLegacyCombatContext = () => Object.freeze({
  getState() {
    return state;
  },
  currentMap,
  currentMonsterStats,
  currentMapIndex() {
    return state.currentMap || 0;
  },
  getMaps() {
    return maps;
  },
  getDifficultyConfigs() {
    return DIFFICULTY_CONFIG;
  },
  getMapLevelRanges() {
    return mapLevelRanges;
  },
  getMutations() {
    return MUTATION_TYPES;
  },
  getMonsterDifficultyModifiers() {
    return MONSTER_DIFFICULTY_MODIFIERS;
  },
  getDifficultyTierModifiers() {
    return DIFFICULTY_TIER_MODIFIERS;
  },
  getHardMapTierScales() {
    return HARD_MAP_TIER_SCALE;
  },
  getAbyssMapTierScales() {
    return ABYSS_MAP_TIER_SCALE;
  },
  getAbyssBossExtraMultipliers() {
    return ABYSS_BOSS_EXTRA_MULTIPLIER;
  },
  getHardBaselines() {
    return HARD_BASELINE;
  },
  getAbyssBaselines() {
    return ABYSS_BASELINE;
  },
  getBossExpMultiplier() {
    return BOSS_EXP_MULTIPLIER;
  },
  getBaseExpGlobalMultiplier() {
    return BASE_EXP_GLOBAL_MULTIPLIER;
  },
  getJobExpGlobalMultiplier() {
    return JOB_EXP_GLOBAL_MULTIPLIER;
  },
  randomInt,
  clampNumber,
  lerpRange,
  monsterImageSource,
  showBossBanner,
  getDropTableAlias(mapId) {
    return mapDropTableAlias[mapId] || mapId;
  },
  getBossEssenceId(mapIndex) {
    return bossEssenceByMap[mapIndex] || bossEssenceByMap[0];
  },
  getMaterialName(materialId) {
    return materialNames[materialId] || materialId;
  },
  getDifficultyLabel(difficulty) {
    return DIFFICULTY_CONFIG[difficulty]?.label || difficulty;
  },
  applyMaterialQuantityBonus,
  computeStats,
  random() {
    return Math.random();
  },
  getPlayerCritRateCap() {
    return PLAYER_CRIT_RATE_CAP;
  },
  getHpRegenInterval() {
    return HP_REGEN_INTERVAL;
  },
  getMonsterAttackInterval() {
    return MONSTER_ATTACK_INTERVAL;
  },
  ensureSettings,
  now() {
    return Date.now();
  },
  getAutoBossFailCooldownMs() {
    return AUTO_BOSS_FAIL_COOLDOWN_MS;
  },
  showToast,
  bossDisplayName,
  gainExp,
  gainVipExp,
  getAutoBossEnabled,
  bossRequirement,
  updateDailyGoalProgress,
  recordSessionReward,
  recordRecentLoot,
  addLog,
  formatNumber,
  showDamageNumber,
  showHitFeedback,
  showSkillCastFeedback,
  applySplashDamageToEncounter,
  flashPlayerHp() {
    if (!els.playerHpBar) return;
    els.playerHpBar.classList.add("player-hp-flash");
    window.setTimeout(() => els.playerHpBar && els.playerHpBar.classList.remove("player-hp-flash"), 200);
  },
  presentKillRewards({ monster, baseExpGain, jobExpGain }) {
    showMonsterDeathFeedback(monster);
    addFloatText(`+${formatNumber(baseExpGain)} BASE`, 330, 168, "#456e91");
    addFloatText(`+${formatNumber(jobExpGain)} JOB`, 330, 202, "#6a5f9f");
  },
  updateActiveEnemyHpInGroup,
  hasLivingEncounterMembers,
  isBossChallengeReady,
  tryAutoChallengeBoss,
  handleAutoBossFailure,
  getDifficultyFailureHint,
  getUnlockedSkills,
  getSkillGrowthEntry,
  getSkillMilestoneBonuses,
  getSkillLevelMultiplier,
  noteSkillCast,
  gainSkillExp,
  rollDrops,
  rollMutationExtraDrops,
  grantPassiveSkillKillExp,
  updateQuestProgress,
  explorationGainForKill,
  gainMapExploration,
  trackKillAchievements,
  getEquipmentPityThreshold,
  rollGuaranteedEquipmentDrop() {
    return rollEquipmentTableDrops(computeStats(), { boss: false, guaranteed: true });
  },
  challengeBoss,
  defeatEnemy,
  syncActiveEnemyFromGroup,
  spawnEnemy,
  render: renderAll,
});

// [AUTHORITY] vip-runtime: 10 config refs. Module-owned: all calculation/pure functions. Deferred: VIP_EXP_REQUIREMENTS, VIP_BONUS_PER_LEVEL, VIP_MILESTONE_BONUSES, VIP_DAILY_GIFT (constants in game.js).
window.RuneFrontierLegacyVipContext = () => Object.freeze({
  getState() { return state; },
  getVipMaxLevel() { return VIP_MAX_LEVEL; },
  getVipExpRequirements() { return VIP_EXP_REQUIREMENTS; },
  getVipBonusPerLevel() { return VIP_BONUS_PER_LEVEL; },
  getVipMilestones() { return VIP_MILESTONE_BONUSES; },
  getVipDailyGifts() { return VIP_DAILY_GIFT; },
  getBaseInventoryLimit() { return INVENTORY_LIMIT; },
  todayKey() { return new Date().toISOString().slice(0, 10); },
  addLog,
  showToast,
  addMaterials,
  renderAll,
  save,
});

// [AUTHORITY] codex-runtime: 12 config refs. Module-owned: all calculation/pure functions. Deferred: CODEX_KILL_MILESTONES, CODEX_KILL_REWARDS, CODEX_CAPS, CODEX_MASTERY_BONUSES, CODEX_RESEARCH_BONUSES, mapMonsterConfig (constants in game.js).
window.RuneFrontierLegacyCodexContext = () => Object.freeze({
  getState() { return state; },
  getMapMonsterConfig() { return mapMonsterConfig; },
  getCardPool() { return cardPool; },
  getCardType,
  getCodexKillMilestones() { return CODEX_KILL_MILESTONES; },
  getCodexKillRewards() { return CODEX_KILL_REWARDS; },
  getCodexCardMilestones() { return CODEX_CARD_MILESTONES; },
  getCodexCardRewards() { return CODEX_CARD_REWARDS; },
  getCodexMasteryThresholds() { return CODEX_MASTERY_THRESHOLDS; },
  getCodexResearchThresholds() { return CODEX_RESEARCH_THRESHOLDS; },
  getCodexStatCaps() { return CODEX_STAT_CAPS; },
  getCodexCaps() { return CODEX_CAPS; },
  getCodexMasteryBonuses() { return CODEX_MASTERY_BONUSES; },
  getCodexResearchBonuses() { return CODEX_RESEARCH_BONUSES; },
  grantGenericReward,
  getMonsterName(id) { return (buildMonsterNameMap() || {})[id] || materialNames[id] || id; },
  addLog,
  showToast,
  renderAll,
  save,
});

// [AUTHORITY] shop-runtime: 5 config refs. Module-owned: all calculation/pure functions. Deferred: SHOP_ITEMS (constant in game.js).
window.RuneFrontierLegacyShopContext = () => Object.freeze({
  getState() { return state; },
  getShopActiveTab() { return shopActiveTab; },
  getShopItems() { return typeof SHOP_ITEMS !== "undefined" ? SHOP_ITEMS : {}; },
  getMaterialName(materialId) { return materialNames[materialId] || materialId; },
  randomInt,
  addMaterials,
  addLog,
  showToast,
  renderAll,
  save,
});

// [AUTHORITY] state-runtime: Not yet module-owned. Delegation bridges exist on load/save/mergeState/sanitizeProgression/createDefaultState/resetSave.
window.RuneFrontierLegacyStateContext = () => Object.freeze({
  getState() { return state; },
  load, save, mergeState, sanitizeProgression, createDefaultState, resetSave,
  getInventoryLimit,
  SAVE_KEY: () => SAVE_KEY,
  LEGACY_SAVE_KEY: () => LEGACY_SAVE_KEY,
  getAuthKey() { return AUTH_KEY; },
  loadAuth, refreshAuthUi,
});

// [DEV-DIAGNOSTIC-ADAPTER] Live access only: diagnostics must follow state replacements after load/reset.
window.RuneFrontierLegacyDevContext = () => Object.freeze({
  getState() { return state; },
  getMaps() { return maps.map((map) => ({ id: map.id, name: map.name })); },
  getMapDropTableAlias() { return mapDropTableAlias; },
  getEquipmentDropTables() { return equipmentDropTables; },
  getMaterialDropTables() { return materialDropTables; },
  getMaterialNames() { return materialNames; },
  getMaterialDb() { return MATERIAL_DB; },
  getInventoryLimit,
  getVipProgressInfo() { return getVipProgressInfo(state.vip); },
  getPlayerCritRateCap() { return PLAYER_CRIT_RATE_CAP; },
  getApiPresence() {
    return {
      renderAll: typeof renderAll === "function",
      renderEquipment: typeof renderEquipment === "function",
      renderSmithyPage: typeof renderSmithyPage === "function",
      renderVip: typeof renderVip === "function",
      renderCodex: typeof renderCodex === "function",
      renderShop: typeof renderShop === "function",
      computeStats: typeof computeStats === "function",
      getEffectiveItemStats: typeof getEffectiveItemStats === "function",
      calculateEquipmentScores: typeof calculateEquipmentScores === "function",
      getVipProgressInfo: typeof getVipProgressInfo === "function",
      getInventoryLimit: typeof getInventoryLimit === "function",
      recordRecentLoot: typeof recordRecentLoot === "function",
      rollDrops: typeof rollDrops === "function",
      claimOffline: typeof claimOffline === "function",
      tryAutoChallengeBoss: typeof tryAutoChallengeBoss === "function",
    };
  },
  sanitizeProgression,
  save,
  renderAll,
});

// [DEV-DIAGNOSTIC-ADAPTER] Moved to src/dev/devBridge.js + src/main.js installation.
// window.RuneFrontierDevBridge is now created by main.js in DEV_MODE via createDevBridge().

let legacyRuntimeStarted = false;

window.bootstrapLegacyRuntime = () => {
  if (legacyRuntimeStarted) return false;
  legacyRuntimeStarted = true;
  init();
  return true;
};

window.addEventListener("load", () => {
  if (!legacyRuntimeStarted) {
    console.warn("[Rune Frontier] Module bootstrap unavailable; starting classic runtime fallback.");
    window.bootstrapLegacyRuntime();
  }
});
