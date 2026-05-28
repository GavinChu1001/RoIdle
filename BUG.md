# Bug 记录

> 最后更新：2026-05-27

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
