# Bug 记录

> 最后更新：2026-05-29

## 待修复

### 1. 战斗画面缩放异常

**描述**：RO UI 改版后战斗场景画面缩放显示异常。

**可能原因**：`styles.css` 中新增的 `@media (min-width: 821px) .ro-stage-card .scene-wrap canvas { max-height: 340px }` 可能冲突了游戏代码对 canvas 的尺寸设置。

**涉及文件**：`styles.css`

---

### 2. 技能栏冷却黑框缩放异常

**描述**：技能栏图标冷却时黑色遮罩（`.skill-bar-overlay`）高度缩放不正确，可能溢出或不对齐。

**可能原因**：RO 样式 `.ro-stage-card .skill-bar-icon` 修改了图标尺寸，遮罩的 `height` 百分比计算基准变了。

**涉及文件**：`styles.css`

---

### 3. 图鉴页 — 卡片图鉴打不开

**描述**：图鉴页（codex）的"卡片"子标签页无法切换/打开。

**可能原因**：`renderCodex` 或 `codexPage.js` 的 tab 切换逻辑有问题，或 CSS 隐藏了卡片面板。

**涉及文件**：`game.js`（renderCodex）、`src/ui/codexPage.js`、`styles.css`

---

### 4. 商店页 — 只能查看普通商店

**描述**：商店页面只能显示"普通"分类，无法切换到增强/Boss/深渊等其他商店标签。

**可能原因**：`renderShop` tab 切换逻辑或 `data-shop-tab` 事件处理有问题。

**涉及文件**：`game.js`（renderShop）、`src/ui/shopPage.js`、`styles.css`

---

## 已修复 (2026-05-28)

### 5. 自动挑战BOSS — 每帧无意义调用 tryAutoChallengeBoss

**描述**：`updateCombat` 每个战斗帧（~60fps）都调用 `tryAutoChallengeBoss('tick')`，即使所有条件明显不满足（已在对战Boss、冷却中、暂停等），仍会触发 `computeStats()` 等无谓计算。

**修复**：在 `src/systems/combat/normalCombat.js` 中新增 `lastAutoBossAttemptTime` 节流变量，限制每秒最多调用一次。

**涉及文件**：`src/systems/combat/normalCombat.js`

---

### 6. 自动挑战BOSS — 击杀后结算绕过暂停检查

**描述**：`settlement.js` 击杀结算后直接调用 `challengeBoss({auto:true})`，跳过了 `tryAutoChallengeBoss` 中的 `state.paused` 检查。若在击杀瞬间战斗恰好暂停，Boss 仍会生成。

**修复**：将结算路径改为调用 `tryAutoChallengeBoss('settlement', stats)`，经过完整守卫链路。

**涉及文件**：`src/systems/combat/settlement.js`

---

### 7. 自动挑战BOSS — 无战力门槛检查

**描述**：`canHeroFight` 仅检查 HP ≥ 30%，从未将玩家战力与地图 `recommendedPower` 进行对比。自动挑战可能以远低于推荐值的战力发起 Boss 战，导致必败。

**修复**：在 `bossCombat.js` 的 `tryAutoChallengeBoss` 中新增检查：玩家战力 < `recommendedPower × 50%` 时阻止自动挑战，带一次性日志提示。

**涉及文件**：`src/systems/combat/bossCombat.js`

---

### 8. 自动挑战BOSS — 转生模式死亡不进入冷却

**描述**：非转生模式下，被 Boss 击杀会调用 `handleAutoBossFailure` 设置 60 秒冷却。但转生模式下复活后 `spawnEnemy(false)`，且不触发冷却，可能导致印记反复流失的循环。

**修复**：在转生模式复活分支中，若 `state.enemyBoss && getAutoBossEnabled()` 也调用 `handleAutoBossFailure`。

**涉及文件**：`src/systems/combat/normalCombat.js`

---

### 9. 自动挑战BOSS — 失败冷却硬编码 60 秒

**描述**：`AUTO_BOSS_FAIL_COOLDOWN_MS = 60 * 1000` 硬编码在 `data.js` 中，无法通过任何游戏机制（VIP、转生、升级）缩短。

**修复**：`game.js` 的 `getAutoBossFailCooldownMs` 现在根据 `state.vip.level` 动态计算：每个 VIP 等级 -2%，下限 30%（即最高可缩减至约 18 秒）。

**涉及文件**：`game.js`

---

### 10. 自动挑战BOSS — auto=true 时静默失败

**描述**：`challengeBoss({auto:true})` 在不满足条件时跳过 Toast 通知（`if (!auto)` 守卫），玩家完全不知道自动挑战为何未生效。

**修复**：在 `auto` 模式下，不满足击杀数或生命值条件时，新增 `addLog` 日志提示（"自动挑战 BOSS：击杀数不足"/"生命值不足"）。

**涉及文件**：`src/systems/combat/bossCombat.js`

---

## 已修复 (2026-05-29)

### 11. 清档后登录/注册 — Cannot read properties of undefined

**描述**：清档后，使用账号 `happycon01` 登录或注册都会报错：`Cannot read properties of undefined (reading 'happycon01')`。

**可能原因**：账号数据库被清成 `{}` 或缺少 `users` / `sessions` 时，登录注册逻辑仍直接读取 `db.users[username]`。

**修复**：新增账号库归一化逻辑，读取数据库后自动补齐 `users` 和 `sessions`，并补充空库、缺失库、已有用户保留的测试。

**涉及文件**：`server.js`、`scripts/test.mjs`

---

### 12. 装备页 — 分解未穿戴无效

**描述**：点击“分解未穿戴”后没有按预期批量分解背包中未穿戴的装备。

**可能原因**：批量分解复用了自动分解保护判断，导致未穿戴但被保护策略命中的装备也被跳过。

**修复**：批量分解改为只排除已穿戴和锁定装备，普通保护策略仍只用于自动分解。

**涉及文件**：`src/systems/equipment/dismantle.js`、`scripts/test.mjs`

---

### 13. 图鉴页 — 怪物图鉴奖励领取失效

**描述**：图鉴页面达到击杀里程碑后，点击领取没有正确发放奖励或记录已领取状态。

**可能原因**：DOM 传入的里程碑是字符串，而奖励配置按数字下标读取；同时怪物奖励实际存放在 `reward.items` 中，领取逻辑没有正确转交给通用奖励发放。

**修复**：领取时将里程碑转为数字，按数字索引记录 `rewardsClaimed`，并发放对应的 `reward.items`。

**涉及文件**：`src/systems/codex.js`、`scripts/test.mjs`

---

### 14. 切到其它页面/后台后回血不补算

**描述**：角色受伤后切到其它页面或浏览器后台，回来时回血没有按离开时间补回来。

**可能原因**：浏览器会节流后台 `requestAnimationFrame`，主循环恢复后又把 `dt` 限制到 `0.12` 秒；回血模块也一次最多只结算一跳回血。

**修复**：主循环保留未限速的真实经过时间给回血系统使用，回血模块按经过时间一次性结算多段回血，并保留未满一跳的剩余计时。

**涉及文件**：`game.js`、`src/systems/combat/normalCombat.js`、`scripts/test.mjs`

---

### 15. 离线收益 — 未开自动 Boss 时 300 击杀 0 装备

**描述**：未勾选自动打 Boss 时，离线收益显示约 300 只击杀，但装备掉落为 0。

**可能原因**：离线普通怪装备掉落只按低离线掉率逐次随机，没有复用在线击杀的装备保底；未开自动 Boss 时没有 Boss 掉落兜底，长时间离线仍可能显示 0 件装备。

**修复**：离线普通击杀也累计 `equipmentPityKills`，达到当前地图装备保底阈值后触发一次 `guaranteed` 装备掉落，并在成功掉落后重置保底计数。

**涉及文件**：`src/systems/offline.js`、`game.js`、`scripts/test.mjs`

---

## 验证记录（上次浏览器测试）

以下问题在 2026-05-27 浏览器验证中被发现，已部分修复：

| # | 问题 | 状态 |
|---|------|------|
| 1 | Boss 按钮珊瑚色覆盖木纹 | ✅ 已修复 (加 !important) |
| 2 | 手机分页过高 207px | ✅ 已修复 (横向滚动) |
| 3 | 桌面战斗卡过高 | 🔲 回退 canvas 尺寸限制后待验证 |
| 4 | 手机末项分页拉伸 | ✅ 已修复 |
| 5 | playwright 依赖 | ✅ 已移除 |

## 性能待跟踪

- 角色页偶现明显交互卡顿，无法稳定复现，建议单独跟踪。
