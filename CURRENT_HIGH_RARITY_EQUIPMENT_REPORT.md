# 当前高稀有装备来源报告

## 结论

1. 当前暗金装备不是固定模板，而是由任意装备模板在生成实例时 roll 到 `darkGold` 品质得到。
2. 当前神话装备已存在，也不是固定模板，而是由任意装备模板在深渊难度中 roll 到 `mythic` 品质得到。
3. 星座套支持暗金 / 神话版本：星座部件模板固定，掉落时可强制生成 `darkGold` 或 `mythic` 品质实例。
4. 深渊套装支持暗金 / 神话版本：深渊难度掉落的套装会保留原 `setId`，并额外带有 `abyssForged`、`abyssSetVariant`、`abyssBonus` 与 `abyssAffixes`。

## 神话装备

当前没有固定的“神话装备模板列表”。神话装备由以下来源动态生成：

- `rollMythicEquipmentDrop()`：深渊普通怪、深渊变异怪、深渊 Boss 极低概率生成神话装备。
- `rollMutationExtraDrops()`：深渊变异怪额外掉落判定中可生成神话装备。
- `rollZodiacSetDrops()`：深渊星座套装掉落判定中可生成神话星座套装部件。
- `createMutationEquipment("mythic")`：从当前地图掉落表或高稀有模板池中选模板，生成神话品质实例。

神话品质配置：

```js
{
  id: "mythic",
  name: "神话",
  weight: 0.2,
  scale: 5.2,
  rolls: [1.35, 1.85],
  affixes: 7,
  extra: {
    crit: [0.08, 0.16],
    drop: [0.08, 0.16],
    gold: [0.14, 0.26]
  }
}
```

## 暗金装备

当前没有固定的“暗金装备模板列表”。暗金装备由以下来源动态生成：

- 普通装备实例生成时 roll 到 `darkGold` 品质。
- `rollZodiacSetDrops()`：星座套装掉落时可生成暗金星座套装部件。
- `rollMutationExtraDrops()`：变异怪额外掉落判定中可生成暗金装备。
- `createMutationEquipment("darkGold")`：从当前地图掉落表或高稀有模板池中选模板，生成暗金品质实例。

暗金品质配置：

```js
{
  id: "darkGold",
  name: "暗金",
  weight: 1,
  scale: 3.85,
  rolls: [1.2, 1.62],
  affixes: 6,
  extra: {
    crit: [0.05, 0.12],
    drop: [0.05, 0.12],
    gold: [0.1, 0.2]
  }
}
```

## 深渊装备来源

深渊难度生成的装备实例会带：

- `abyssForged: true`
- `prefix: "深渊"`
- `sourceDifficulty: "abyss"`
- `abyssBonus`
- `abyssAffixes`

深渊套装额外带：

- `abyssSetVariant: true`
- `abyssSetBonusApplied: true`
- `originalSetId`

## 备注

当前高稀有装备的核心逻辑是“模板 + 品质 + 来源难度 + 实例属性”的组合。也就是说，同一件模板装备可以成为普通、暗金、神话、深渊暗金、深渊神话、深渊星座套装等不同实例。
