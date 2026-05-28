# PC Desktop Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 Rune Frontier Idle 的第一版 Windows 桌面基础：Electron 能启动现有游戏，存档通过平台适配器进入桌面本地文件，同时 Web 版行为保持不变。

**Architecture:** 新增 `desktop/` Electron 壳，主进程负责窗口和本地文件存档，preload 只暴露最小同步存储 API。`src/platform/` 拆出浏览器/桌面存储适配器，`game.js` 只通过平台存储读写存档，不再在核心存档路径直接依赖 `localStorage`。

**Tech Stack:** Node.js 18+、Electron、electron-builder、Vanilla JS ES modules、现有 `npm run check` / `npm test`。

---

## 范围

本计划只覆盖设计文档里的“第一实施切片”：

- Electron Windows 桌面壳。
- 桌面平台适配器骨架。
- 本地 JSON 存档路径。
- Web 版兼容。
- 桌面端重启后能保留进度。

不包含 PC UI 重排、战斗表现升级、云同步、Steam/itch.io 发行包装。

## 文件结构

- Create: `desktop/saveStore.cjs`
  - 负责桌面本地 JSON 文件存取。
  - 不依赖 DOM，不依赖 renderer。
- Create: `desktop/main.cjs`
  - Electron 主进程入口。
  - 创建窗口，挂载 IPC 存储通道。
- Create: `desktop/preload.cjs`
  - 通过 `contextBridge` 暴露 `window.runeDesktop.storage`。
  - renderer 只看到同步存储方法。
- Create: `src/platform/storageKeys.js`
  - 统一存档 key，避免浏览器/桌面适配器各自维护一份。
- Create: `src/platform/desktopStorage.js`
  - 桌面端存储适配器，API 对齐 `browserStorage.js`。
- Create: `src/platform/storageProvider.js`
  - 根据 `window.runeDesktop` 选择桌面或浏览器存储。
- Modify: `src/platform/browserStorage.js`
  - 复用 `storageKeys.js`。
- Modify: `src/platform/platform.js`
  - 通过 `storageProvider.js` 暴露 `Platform.storage`。
- Modify: `src/state/save.js`
  - 从 `storageProvider.js` 读取存档 API。
- Modify: `src/main.js`
  - 初始化 storage provider，而不是硬编码浏览器存储。
- Modify: `game.js`
  - `load` / `save` / `resetSave` 通过平台存储路径读写。
- Modify: `scripts/check.mjs`
  - 把 `desktop/*.cjs` 纳入语法检查。
- Modify: `scripts/test.mjs`
  - 增加桌面存储与平台路由的迁移守护断言。
- Modify: `package.json`
  - 增加 Electron 运行、Windows 打包脚本和 electron-builder 配置。
- Modify: `package-lock.json`
  - 由 `npm install --save-dev electron electron-builder` 更新。

---

### Task 1: 写桌面基础的失败检查

**Files:**
- Modify: `scripts/check.mjs`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: 扩展语法检查，让缺失的桌面入口先失败**

Replace `scripts/check.mjs` with:

```js
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const moduleFiles = [];

function collectJsFiles(directory) {
  if (!existsSync(directory)) return;
  for (const name of readdirSync(directory)) {
    const file = join(directory, name);
    if (statSync(file).isDirectory()) collectJsFiles(file);
    else if (file.endsWith('.js')) moduleFiles.push(file);
  }
}

function checkClassic(file) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${relative(root, file)}\n${result.stderr || result.stdout}`);
}

function checkModule(file) {
  const result = spawnSync(process.execPath, ['--input-type=module', '--check'], {
    input: readFileSync(file, 'utf8'),
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`${relative(root, file)}\n${result.stderr || result.stdout}`);
}

try {
  const classicFiles = [
    join(root, 'game.js'),
    join(root, 'server.js'),
    join(root, 'desktop/main.cjs'),
    join(root, 'desktop/preload.cjs'),
    join(root, 'desktop/saveStore.cjs'),
  ];
  classicFiles.forEach(checkClassic);
  collectJsFiles(join(root, 'src'));
  moduleFiles.sort().forEach(checkModule);
  console.log(`Syntax check passed: ${classicFiles.length} classic scripts and ${moduleFiles.length} browser modules.`);
} catch (error) {
  console.error('Syntax check failed:');
  console.error(error.message);
  process.exitCode = 1;
}
```

- [ ] **Step 2: 在迁移测试里加入桌面路由断言**

In `scripts/test.mjs`, add these source reads after `const main = read('src/main.js');`:

```js
const platformSource = read('src/platform/platform.js');
const browserStorageSource = read('src/platform/browserStorage.js');
const desktopStorageSource = read('src/platform/desktopStorage.js');
const storageProviderSource = read('src/platform/storageProvider.js');
const stateSaveSource = read('src/state/save.js');
const desktopMainSource = read('desktop/main.cjs');
const desktopPreloadSource = read('desktop/preload.cjs');
const desktopSaveStoreSource = read('desktop/saveStore.cjs');
const packageJsonSource = read('package.json');
```

Add this assertion block after the existing platform/module status assertions:

```js
assert.match(platformSource, /from '\.\/storageProvider\.js'/, 'Platform must route storage through the provider.');
assert.match(main, /import '\.\/platform\/storageProvider\.js'/, 'Module entry must initialize the storage provider.');
assert.doesNotMatch(main, /import '\.\/platform\/browserStorage\.js'/, 'Module entry must not hard-code browser storage.');
assert.match(browserStorageSource, /from '\.\/storageKeys\.js'/, 'Browser storage must share storage keys.');
assert.match(desktopStorageSource, /window\.runeDesktop/, 'Desktop storage must use the preload bridge.');
assert.match(storageProviderSource, /runeDesktop/, 'Storage provider must detect the desktop bridge.');
assert.match(stateSaveSource, /from '\.\.\/platform\/storageProvider\.js'/, 'State save module must use the storage provider.');
assert.doesNotMatch(stateSaveSource, /browserStorage\.js/, 'State save module must not import browser storage directly.');
assert.match(game, /getStorageAdapter\(\)/, 'Classic runtime must route save/load through a storage adapter helper.');
assert.match(game, /storage\.getSave\(\)/, 'Classic runtime load must use storage.getSave.');
assert.match(game, /storage\.setSave\(state\)/, 'Classic runtime save must use storage.setSave.');
assert.match(game, /storage\.clearSave\(\)/, 'Classic runtime reset must use storage.clearSave.');
assert.match(desktopMainSource, /new BrowserWindow/, 'Desktop main process must create the game window.');
assert.match(desktopMainSource, /preload\.cjs/, 'Desktop main process must install the preload bridge.');
assert.match(desktopMainSource, /rune-storage:get/, 'Desktop main process must handle storage reads.');
assert.match(desktopPreloadSource, /contextBridge\.exposeInMainWorld\('runeDesktop'/, 'Preload must expose runeDesktop.');
assert.match(desktopPreloadSource, /sendSync\('rune-storage:set'/, 'Preload storage writes must be synchronous for the legacy save path.');
assert.match(desktopSaveStoreSource, /app\.getPath\('userData'\)/, 'Desktop saves must live under Electron userData.');
assert.match(desktopSaveStoreSource, /JSON\.stringify\(value,\s*null,\s*2\)/, 'Desktop save files must be readable JSON.');
assert.match(packageJsonSource, /"desktop":\s*"electron desktop\/main\.cjs"/, 'Package scripts must expose the desktop runner.');
assert.match(packageJsonSource, /"dist:win":\s*"electron-builder --win portable"/, 'Package scripts must expose a Windows portable build.');
```

- [ ] **Step 3: Run the failing checks**

Run:

```powershell
npm run check
```

Expected: FAIL because `desktop/main.cjs` does not exist.

Run:

```powershell
npm test
```

Expected: FAIL because `src/platform/desktopStorage.js` or `desktop/main.cjs` does not exist.

- [ ] **Step 4: Commit the failing checks**

```powershell
git add -- scripts/check.mjs scripts/test.mjs
git commit -m "test: cover desktop foundation routing"
```

---

### Task 2: 增加 Electron 依赖和运行脚本

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install desktop dependencies**

Run:

```powershell
npm install --save-dev electron electron-builder
```

Expected: `package.json` gains `devDependencies`, and `package-lock.json` is updated.

- [ ] **Step 2: Add package scripts and build metadata**

In `package.json`, keep the existing fields and ensure these entries exist:

```json
{
  "scripts": {
    "start": "node server.js",
    "check": "node scripts/check.mjs",
    "test": "node scripts/test.mjs",
    "desktop": "electron desktop/main.cjs",
    "dist:win": "electron-builder --win portable"
  },
  "build": {
    "appId": "com.runefrontier.idle",
    "productName": "Rune Frontier Idle",
    "directories": {
      "output": "dist"
    },
    "files": [
      "desktop/**/*",
      "assets/**/*",
      "src/**/*",
      "data.js",
      "tools.js",
      "game.js",
      "index.html",
      "styles.css",
      "unified-equipment-ui.css",
      "server.js",
      "package.json"
    ],
    "extraMetadata": {
      "main": "desktop/main.cjs"
    },
    "win": {
      "target": [
        "portable"
      ]
    }
  }
}
```

- [ ] **Step 3: Run checks**

Run:

```powershell
npm run check
```

Expected: still FAIL because desktop files are not created yet.

Run:

```powershell
npm test
```

Expected: still FAIL because desktop files and storage provider are not created yet.

- [ ] **Step 4: Commit dependencies and scripts**

```powershell
git add -- package.json package-lock.json
git commit -m "build: add electron desktop scripts"
```

---

### Task 3: 新增 Electron 桌面壳

**Files:**
- Create: `desktop/saveStore.cjs`
- Create: `desktop/main.cjs`
- Create: `desktop/preload.cjs`

- [ ] **Step 1: Create desktop save store**

Create `desktop/saveStore.cjs`:

```js
const fs = require('node:fs');
const path = require('node:path');

const FILE_NAMES = Object.freeze({
  'rune-frontier-idle-save-v2': 'save-v2.json',
  'rune-frontier-idle-save-v1': 'save-v1.json',
  'rune-frontier-idle-save-v2-backup': 'save-v2-backup.json',
});

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function fileNameForKey(key) {
  return FILE_NAMES[key] || `${String(key).replace(/[^a-zA-Z0-9._-]/g, '_')}.json`;
}

function filePathForKey(app, key) {
  const dir = path.join(app.getPath('userData'), 'saves');
  ensureDir(dir);
  return path.join(dir, fileNameForKey(key));
}

function read(app, key) {
  const file = filePathForKey(app, key);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn(`Failed to read desktop save ${file}:`, error);
    return null;
  }
}

function write(app, key, value) {
  const file = filePathForKey(app, key);
  const temp = `${file}.tmp`;
  try {
    fs.writeFileSync(temp, JSON.stringify(value, null, 2), 'utf8');
    fs.renameSync(temp, file);
    return true;
  } catch (error) {
    console.warn(`Failed to write desktop save ${file}:`, error);
    try {
      if (fs.existsSync(temp)) fs.unlinkSync(temp);
    } catch {
      // Best effort cleanup only.
    }
    return false;
  }
}

function remove(app, key) {
  const file = filePathForKey(app, key);
  try {
    if (fs.existsSync(file)) fs.unlinkSync(file);
    return true;
  } catch (error) {
    console.warn(`Failed to remove desktop save ${file}:`, error);
    return false;
  }
}

module.exports = { read, write, remove, filePathForKey };
```

- [ ] **Step 2: Create Electron main process**

Create `desktop/main.cjs`:

```js
const path = require('node:path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const saveStore = require('./saveStore.cjs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    backgroundColor: '#15110c',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));
}

function installStorageIpc() {
  ipcMain.on('rune-storage:get', (event, key) => {
    event.returnValue = saveStore.read(app, key);
  });

  ipcMain.on('rune-storage:set', (event, key, value) => {
    event.returnValue = saveStore.write(app, key, value);
  });

  ipcMain.on('rune-storage:remove', (event, key) => {
    event.returnValue = saveStore.remove(app, key);
  });

  ipcMain.on('rune-storage:path', (event, key) => {
    event.returnValue = saveStore.filePathForKey(app, key);
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  installStorageIpc();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

- [ ] **Step 3: Create preload bridge**

Create `desktop/preload.cjs`:

```js
const { contextBridge, ipcRenderer } = require('electron');

function callStorage(channel, ...args) {
  return ipcRenderer.sendSync(channel, ...args);
}

contextBridge.exposeInMainWorld('runeDesktop', {
  platform: 'electron',
  storage: {
    get(key) {
      return callStorage('rune-storage:get', key);
    },
    set(key, value) {
      return callStorage('rune-storage:set', key, value);
    },
    remove(key) {
      return callStorage('rune-storage:remove', key);
    },
    path(key) {
      return callStorage('rune-storage:path', key);
    },
  },
});
```

- [ ] **Step 4: Run checks**

Run:

```powershell
npm run check
```

Expected: syntax check passes for `desktop/*.cjs`; tests may still fail because platform routing is not implemented.

Run:

```powershell
npm test
```

Expected: FAIL on storage provider assertions.

- [ ] **Step 5: Commit desktop shell**

```powershell
git add -- desktop/saveStore.cjs desktop/main.cjs desktop/preload.cjs
git commit -m "feat: add electron desktop shell"
```

---

### Task 4: 拆分浏览器/桌面存储适配器

**Files:**
- Create: `src/platform/storageKeys.js`
- Create: `src/platform/desktopStorage.js`
- Create: `src/platform/storageProvider.js`
- Modify: `src/platform/browserStorage.js`
- Modify: `src/platform/platform.js`
- Modify: `src/state/save.js`
- Modify: `src/main.js`

- [ ] **Step 1: Create shared storage keys**

Create `src/platform/storageKeys.js`:

```js
export const STORAGE_KEYS = Object.freeze({
  save: 'rune-frontier-idle-save-v2',
  legacySave: 'rune-frontier-idle-save-v1',
  backup: 'rune-frontier-idle-save-v2-backup',
});
```

- [ ] **Step 2: Update browser storage to import shared keys**

Replace `src/platform/browserStorage.js` with:

```js
// Browser localStorage wrapper.

import { STORAGE_KEYS } from './storageKeys.js';

export { STORAGE_KEYS };

export function get(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('Storage full or unavailable:', e);
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getSave() {
  return get(STORAGE_KEYS.save) || get(STORAGE_KEYS.legacySave);
}

export function setSave(state) {
  return set(STORAGE_KEYS.save, state);
}

export function clearSave() {
  remove(STORAGE_KEYS.save);
  remove(STORAGE_KEYS.legacySave);
}

export function getBackup() {
  return get(STORAGE_KEYS.backup);
}

export function setBackup(state) {
  return set(STORAGE_KEYS.backup, state);
}

window.storage = { get, set, remove, getSave, setSave, clearSave, getBackup, setBackup, keys: STORAGE_KEYS };
```

- [ ] **Step 3: Create desktop storage adapter**

Create `src/platform/desktopStorage.js`:

```js
import { STORAGE_KEYS } from './storageKeys.js';

export { STORAGE_KEYS };

function bridge() {
  return window.runeDesktop?.storage || null;
}

export function isAvailable() {
  return Boolean(bridge());
}

export function get(key) {
  const storage = bridge();
  return storage ? storage.get(key) : null;
}

export function set(key, value) {
  const storage = bridge();
  return storage ? Boolean(storage.set(key, value)) : false;
}

export function remove(key) {
  const storage = bridge();
  return storage ? Boolean(storage.remove(key)) : false;
}

export function getSave() {
  return get(STORAGE_KEYS.save) || get(STORAGE_KEYS.legacySave);
}

export function setSave(state) {
  return set(STORAGE_KEYS.save, state);
}

export function clearSave() {
  remove(STORAGE_KEYS.save);
  remove(STORAGE_KEYS.legacySave);
}

export function getBackup() {
  return get(STORAGE_KEYS.backup);
}

export function setBackup(state) {
  return set(STORAGE_KEYS.backup, state);
}
```

- [ ] **Step 4: Create storage provider**

Create `src/platform/storageProvider.js`:

```js
import * as browserStorage from './browserStorage.js';
import * as desktopStorage from './desktopStorage.js';
import { STORAGE_KEYS } from './storageKeys.js';

function selectStorage() {
  return desktopStorage.isAvailable() ? desktopStorage : browserStorage;
}

export { STORAGE_KEYS };

export function isDesktopStorage() {
  return desktopStorage.isAvailable();
}

export function get(key) {
  return selectStorage().get(key);
}

export function set(key, value) {
  return selectStorage().set(key, value);
}

export function remove(key) {
  return selectStorage().remove(key);
}

export function getSave() {
  return selectStorage().getSave();
}

export function setSave(state) {
  return selectStorage().setSave(state);
}

export function clearSave() {
  return selectStorage().clearSave();
}

export function getBackup() {
  return selectStorage().getBackup();
}

export function setBackup(state) {
  return selectStorage().setBackup(state);
}

window.storage = { get, set, remove, getSave, setSave, clearSave, getBackup, setBackup, keys: STORAGE_KEYS };
```

- [ ] **Step 5: Route Platform through storage provider**

In `src/platform/platform.js`, replace:

```js
import * as storage from './browserStorage.js';
```

with:

```js
import * as storage from './storageProvider.js';
```

- [ ] **Step 6: Route state save through storage provider**

In `src/state/save.js`, replace:

```js
} from '../platform/browserStorage.js';
```

with:

```js
} from '../platform/storageProvider.js';
```

- [ ] **Step 7: Initialize storage provider from main entry**

In `src/main.js`, replace:

```js
import './platform/browserStorage.js';
import { Platform } from './platform/platform.js';
```

with:

```js
import './platform/storageProvider.js';
import { Platform } from './platform/platform.js';
```

- [ ] **Step 8: Run checks**

Run:

```powershell
npm run check
```

Expected: PASS.

Run:

```powershell
npm test
```

Expected: tests may still fail on `game.js` storage adapter assertions until Task 5 is complete.

- [ ] **Step 9: Commit storage split**

```powershell
git add -- src/platform/storageKeys.js src/platform/desktopStorage.js src/platform/storageProvider.js src/platform/browserStorage.js src/platform/platform.js src/state/save.js src/main.js
git commit -m "feat: split platform storage adapters"
```

---

### Task 5: 把 legacy 存档路径切到平台存储

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add storage helper functions near the existing `load` function**

In `game.js`, insert this block immediately before `function load() {`:

```js
function getStorageAdapter() {
  return window.Platform?.storage || window.storage || null;
}

function readStoredSave() {
  const storage = getStorageAdapter();
  if (storage && typeof storage.getSave === "function") return storage.getSave();
  const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function writeStoredSave() {
  const storage = getStorageAdapter();
  if (storage && typeof storage.setSave === "function") return storage.setSave(state);
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  return true;
}

function clearStoredSave() {
  const storage = getStorageAdapter();
  if (storage && typeof storage.clearSave === "function") return storage.clearSave();
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(LEGACY_SAVE_KEY);
  return true;
}
```

- [ ] **Step 2: Replace legacy load storage parsing**

In `function load()`, replace:

```js
  const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem(LEGACY_SAVE_KEY);
  if (!raw) {
    state.offlinePending = buildOfflineReward(0);
    state.offlineRewards = state.offlinePending;
    return;
  }

  try {
    const saved = JSON.parse(raw);
    state = mergeState(createDefaultState(), saved);
```

with:

```js
  const saved = readStoredSave();
  if (!saved) {
    state.offlinePending = buildOfflineReward(0);
    state.offlineRewards = state.offlinePending;
    return;
  }

  try {
    state = mergeState(createDefaultState(), saved);
```

- [ ] **Step 3: Replace legacy save storage write**

In `function save()`, replace:

```js
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
```

with:

```js
  writeStoredSave();
```

- [ ] **Step 4: Replace legacy reset storage clear**

In `function resetSave()`, replace:

```js
  localStorage.removeItem(SAVE_KEY);
```

with:

```js
  clearStoredSave();
```

- [ ] **Step 5: Run checks**

Run:

```powershell
npm run check
```

Expected: PASS.

Run:

```powershell
npm test
```

Expected: PASS with the existing migration test success message.

- [ ] **Step 6: Commit legacy storage routing**

```powershell
git add -- game.js
git commit -m "feat: route legacy saves through platform storage"
```

---

### Task 6: 手动验证桌面启动和本地存档

**Files:**
- No source file changes expected.

- [ ] **Step 1: Launch Web mode**

Run:

```powershell
npm start
```

Expected: server starts without syntax/runtime errors. Open the existing Web page and confirm the game loads with the browser save path.

- [ ] **Step 2: Launch desktop mode**

Run:

```powershell
npm run desktop
```

Expected: a Windows desktop window opens Rune Frontier Idle from `index.html`.

- [ ] **Step 3: Verify desktop save persists**

Manual steps:

1. In the desktop window, make a visible state change such as gaining gold, changing page, or triggering a normal save.
2. Close the desktop window.
3. Run `npm run desktop` again.
4. Confirm the changed state is still present.

Expected: progress survives restart through the desktop JSON save.

- [ ] **Step 4: Inspect save file path through DevTools if needed**

In the desktop renderer console, run:

```js
window.runeDesktop.storage.path('rune-frontier-idle-save-v2')
```

Expected: returns a path under Electron `userData`, ending in `saves\save-v2.json` on Windows.

- [ ] **Step 5: Run final automated checks**

Run:

```powershell
npm run check
```

Expected: PASS.

Run:

```powershell
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit verification note if source changed during manual fixes**

If manual verification required a source fix, commit only the changed source files:

```powershell
git status --short
git add -- path\to\changed-file
git commit -m "fix: stabilize desktop save smoke test"
```

If no files changed, do not create an empty commit.

---

## Self-Review

**Spec coverage:**

- Electron 桌面壳：Task 2 和 Task 3 覆盖。
- 桌面平台适配器：Task 4 覆盖。
- 存档加载/保存走适配器：Task 4 和 Task 5 覆盖。
- Web 版保持可用：Task 5 和 Task 6 的 `npm start` / 自动检查覆盖。
- Windows 桌面版重启后保留进度：Task 6 覆盖。

**Not in this plan:**

- PC UI 客户端化。
- Canvas 战斗表现升级。
- 云同步。
- Windows 安装包美术包装。
- Steam/itch.io 商店接入。

These are intentionally outside the first foundation slice.

**Placeholder scan result:** No placeholder markers or incomplete task wording is intended in this plan. Each code-changing task includes concrete file paths, code blocks, commands, expected results, and commit boundaries.
