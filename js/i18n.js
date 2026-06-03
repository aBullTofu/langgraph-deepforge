/* ============================================================
   LangGraph DeepForge — i18n.js
   Internationalization engine: language switching, DOM updates,
   text-node content translation
   ============================================================ */

var I18N = (function() {
  'use strict';

  var STORAGE_KEY = 'langgraph_lang';
  var DATA = window.__I18N_DATA || {};
  var CONTENT = window.__I18N_CONTENT || {};

  var lang = localStorage.getItem(STORAGE_KEY) || 'zh';

  /* ── Public API ── */

  function t(key, params) {
    var entry = DATA[key];
    if (!entry) return key;
    var str = entry[lang] || entry['zh'] || key;
    if (params) {
      Object.keys(params).forEach(function(k) {
        str = str.replace('{{' + k + '}}', params[k]);
      });
    }
    return str;
  }

  function setLang(newLang) {
    lang = newLang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyToDOM();
    updateSwitcherUI();
    /* Update document title from page-level config */
    if (window.__I18N_PAGE_TITLE && window.__I18N_PAGE_TITLE[lang]) {
      document.title = window.__I18N_PAGE_TITLE[lang];
    }
    if (window.onLangChange) window.onLangChange(lang);
  }

  function getLang() {
    return lang;
  }

  /* ── Content Translation (text-node level) ── */

  function translateTextNodes(root) {
    if (!CONTENT || Object.keys(CONTENT).length === 0) return;

    var walker = document.createTreeWalker(
      root || document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip script, style, pre, code, textarea
          var parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          var tag = parent.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'PRE' ||
              tag === 'CODE' || tag === 'TEXTAREA' || tag === 'NOSCRIPT') {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip if inside i18n block (already handled)
          if (parent.closest && (parent.closest('.i18n-zh') || parent.closest('.i18n-en'))) {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip if parent has data-i18n (handled separately)
          if (parent.hasAttribute && parent.hasAttribute('data-i18n')) {
            return NodeFilter.FILTER_REJECT;
          }
          // Only accept text with content
          var text = node.textContent.trim();
          if (!text || text.length < 1) return NodeFilter.FILTER_REJECT;

          // In en mode: accept nodes containing Chinese (to translate them)
          // In zh mode: accept nodes that were previously translated (to restore)
          // We detect "previously translated" by checking if the parent
          // has a data-original-zh attribute
          if (lang === 'zh') {
            return parent.hasAttribute && parent.hasAttribute('data-original-zh')
              ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          } else {
            // In en mode, accept nodes that contain Chinese characters
            return /[一-鿿]/.test(node.textContent)
              ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
          }
        }
      }
    );

    var node;
    while (node = walker.nextNode()) {
      if (lang === 'en') {
        _translateToEn(node);
      } else {
        _restoreToZh(node);
      }
    }
  }

  function _translateToEn(node) {
    var text = node.textContent;
    var parent = node.parentElement;
    if (!parent) return;

    // Try exact match first
    var translated = CONTENT[text];
    if (!translated) {
      // Try trimmed match
      translated = CONTENT[text.trim()];
    }
    if (!translated) {
      // Try whitespace-normalized match
      var normalized = text.replace(/\s+/g, ' ');
      translated = CONTENT[normalized];
    }
    if (translated) {
      // Save original Chinese for restoration
      parent.setAttribute('data-original-zh', text);
      node.textContent = translated;
    }
    // If no match, leave as-is (shows Chinese)
  }

  function _restoreToZh(node) {
    var parent = node.parentElement;
    if (!parent) return;
    var original = parent.getAttribute('data-original-zh');
    if (original) {
      node.textContent = original;
      parent.removeAttribute('data-original-zh');
    }
  }

  /* ── DOM Application ── */

  function applyToDOM() {
    /* 1. data-i18n attributes */
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    }

    /* 2. data-i18n-placeholder */
    var phs = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phs.length; j++) {
      phs[j].placeholder = t(phs[j].getAttribute('data-i18n-placeholder'));
    }

    /* 3. data-i18n-title */
    var titles = document.querySelectorAll('[data-i18n-title]');
    for (var k = 0; k < titles.length; k++) {
      titles[k].title = t(titles[k].getAttribute('data-i18n-title'));
    }

    /* 4. Toggle .i18n-zh / .i18n-en blocks */
    document.documentElement.lang = lang;
    var zhBlocks = document.querySelectorAll('.i18n-zh');
    var enBlocks = document.querySelectorAll('.i18n-en');
    for (var m = 0; m < zhBlocks.length; m++) {
      zhBlocks[m].hidden = (lang !== 'zh');
    }
    for (var n = 0; n < enBlocks.length; n++) {
      enBlocks[n].hidden = (lang !== 'en');
    }

    /* 5. Content-level text translation */
    translateTextNodes();
  }

  /* ── Language Switcher ── */

  function renderSwitcher() {
    var el = document.getElementById('i18n-switcher');
    if (el) return;

    el = document.createElement('button');
    el.id = 'i18n-switcher';
    el.className = 'i18n-switcher';
    el.title = 'Switch Language / 切换语言';
    el.onclick = function() {
      setLang(lang === 'zh' ? 'en' : 'zh');
    };
    document.body.appendChild(el);
    updateSwitcherUI();
  }

  function updateSwitcherUI() {
    var el = document.getElementById('i18n-switcher');
    if (!el) return;
    el.textContent = lang === 'zh' ? '🌐 EN' : '🌐 中';
    el.setAttribute('data-lang', lang);
  }

  /* ── Init ── */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        renderSwitcher();
        applyToDOM();
      });
    } else {
      renderSwitcher();
      applyToDOM();
    }
  }

  init();

  return {
    t: t,
    setLang: setLang,
    getLang: getLang,
    applyToDOM: applyToDOM,
    translateTextNodes: translateTextNodes,
    renderSwitcher: renderSwitcher
  };
})();
