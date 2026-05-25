// Platform abstraction layer
// Browser implementation. Future: swap implementations for WeChat Mini Games.

import * as storage from './browserStorage.js';

export const Platform = {
  storage,

  toast(msg) {
    // Uses the global showToast function from game.js if available
    if (typeof showToast !== 'undefined') {
      showToast(String(msg));
      return;
    }
    // Fallback: DOM toast element
    const el = document.getElementById('toast');
    if (el) {
      el.textContent = String(msg);
      el.classList.add('show');
      clearTimeout(el._timer);
      el._timer = setTimeout(() => el.classList.remove('show'), 2000);
    }
  },

  confirm(title, content) {
    return window.confirm(`${title}\n${content}`);
  },

  now() {
    return Date.now();
  },

  todayKey() {
    return new Date().toISOString().slice(0, 10);
  },

  isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  },
};

// Attach to window for legacy game.js access
window.Platform = Platform;
