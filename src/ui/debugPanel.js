import { backupSave, exportSave } from '../state/save.js';
import { runFullSelfCheck, selfCheckSectionLabels } from '../dev/selfCheck.js';

let root = null;
let panel = null;
let resultHost = null;
let lastResult = null;

function escapeText(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatTime(value) {
  if (!value) return '尚未执行';
  return new Date(value).toLocaleString('zh-CN', { hour12: false });
}

function snapshotState() {
  return window.RuneFrontierDevBridge?.getSnapshot?.().state || null;
}

function downloadText(filename, content) {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function statusText(result) {
  if (!result) return '待检查';
  if (result.errors.length) return '有错误';
  if (result.warnings.length) return '有警告';
  return '通过';
}

function statusClass(result) {
  if (!result) return 'pending';
  if (result.errors.length) return 'error';
  if (result.warnings.length) return 'warning';
  return 'ok';
}

function renderResults(result) {
  const sections = result?.sections || {};
  const issues = [...(result?.errors || []), ...(result?.warnings || [])];
  resultHost.innerHTML = `
    <section class="dev-debug-overview ${statusClass(result)}">
      <strong>总体状态：${escapeText(statusText(result))}</strong>
      <span>错误 ${result?.errors?.length || 0}</span>
      <span>警告 ${result?.warnings?.length || 0}</span>
      <small>最近检查：${escapeText(formatTime(result?.checkedAt))}</small>
    </section>
    <section class="dev-debug-section-grid">
      ${Object.entries(selfCheckSectionLabels).map(([key, label]) => {
        const section = sections[key];
        return `<article class="dev-debug-status ${statusClass(section)}">
          <strong>${escapeText(label)}</strong>
          <span>${escapeText(statusText(section))}</span>
          <small>错误 ${section?.errors?.length || 0} / 警告 ${section?.warnings?.length || 0}</small>
        </article>`;
      }).join('')}
    </section>
    <details class="dev-debug-details" ${issues.length ? 'open' : ''}>
      <summary>问题详情 (${issues.length})</summary>
      ${issues.length
        ? `<div class="dev-debug-issue-list">${issues.map((entry) => `<div class="dev-debug-issue ${entry.severity}">
            <strong>[${escapeText(selfCheckSectionLabels[entry.section] || entry.section)}]</strong>
            <span>${escapeText(entry.message)}</span>
            ${entry.ref ? `<code>${escapeText(entry.ref)}</code>` : ''}
          </div>`).join('')}</div>`
        : '<p class="dev-debug-empty">当前自检未发现问题。</p>'}
    </details>`;
}

function executeMaintenance(action, promptText) {
  if (!window.confirm(promptText)) return;
  const ok = window.RuneFrontierDevBridge?.runMaintenance?.(action);
  if (!ok) {
    window.alert('操作不可用。');
    return;
  }
  lastResult = runFullSelfCheck();
  renderResults(lastResult);
}

function bindActions() {
  root.addEventListener('click', (event) => {
    const target = event.target.closest('[data-dev-action]');
    if (!target) return;
    const action = target.dataset.devAction;
    if (action === 'toggle') {
      panel.classList.toggle('open');
      panel.setAttribute('aria-hidden', String(!panel.classList.contains('open')));
      return;
    }
    if (action === 'close') {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      return;
    }
    if (action === 'check') {
      lastResult = runFullSelfCheck();
      renderResults(lastResult);
      return;
    }
    if (action === 'export') {
      const state = snapshotState();
      if (!state) return window.alert('无法读取存档快照。');
      downloadText(`rune-frontier-save-${Date.now()}.json`, exportSave(state));
      return;
    }
    if (action === 'summary') {
      const result = lastResult || runFullSelfCheck();
      console.table(Object.fromEntries(Object.entries(result.sections || {}).map(([key, section]) => [key, {
        status: statusText(section),
        errors: section.errors.length,
        warnings: section.warnings.length,
      }])));
      return;
    }
    if (action === 'rerender') {
      window.RuneFrontierDevBridge?.runMaintenance?.('render');
      return;
    }
    if (action === 'backup') {
      if (!window.confirm('备份当前存档到浏览器本地备份区？')) return;
      backupSave();
      window.alert('当前存档已备份。');
      return;
    }
    if (action === 'migrate') return executeMaintenance('migrate', '执行存档修复与迁移？此操作会更新并保存当前存档。');
    if (action === 'clear-log') return executeMaintenance('clear-log', '确定清理当前战斗日志？此操作不可撤销。');
    if (action === 'clear-recent-loot') return executeMaintenance('clear-recent-loot', '确定清理最近战利品记录？此操作不可撤销。');
  });
}

export function mountDebugPanel() {
  if (root || !window.RuneFrontierDevBridge) return;
  root = document.createElement('aside');
  root.className = 'dev-debug-root';
  root.innerHTML = `
    <button class="dev-debug-trigger" type="button" data-dev-action="toggle">调试</button>
    <section class="dev-debug-panel" aria-hidden="true" aria-label="开发调试面板">
      <header class="dev-debug-header">
        <div>
          <strong>开发调试面板</strong>
          <small>仅开发模式可见，自检不会改变真实存档。</small>
        </div>
        <button type="button" class="dev-debug-close" data-dev-action="close" aria-label="关闭">×</button>
      </header>
      <nav class="dev-debug-actions" aria-label="调试操作">
        <button type="button" data-dev-action="check">一键自检</button>
        <button type="button" data-dev-action="export">导出存档</button>
        <button type="button" data-dev-action="summary">输出摘要</button>
        <button type="button" data-dev-action="rerender">重新渲染</button>
      </nav>
      <div class="dev-debug-results"></div>
      <details class="dev-debug-danger">
        <summary>有状态变更操作</summary>
        <div class="dev-debug-actions">
          <button type="button" data-dev-action="backup">备份当前存档</button>
          <button type="button" data-dev-action="migrate">修复并迁移存档</button>
          <button type="button" data-dev-action="clear-log">清理战斗日志</button>
          <button type="button" data-dev-action="clear-recent-loot">清理最近战利品</button>
        </div>
      </details>
    </section>`;
  document.body.append(root);
  panel = root.querySelector('.dev-debug-panel');
  resultHost = root.querySelector('.dev-debug-results');
  bindActions();
  renderResults(null);
  window.RuneFrontierDev = Object.freeze({ runFullSelfCheck });
}
