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
  var contentEntries = null;
  var contentLookup = null;

  function decodeHtml(text) {
    var el = document.createElement('textarea');
    el.innerHTML = text;
    return el.value;
  }

  function normalizeEnglishFallback(text) {
    return text
      .replace(/[一-鿿]+/g, '')
      .replace(/，/g, ', ')
      .replace(/。/g, '.')
      .replace(/：/g, ': ')
      .replace(/；/g, '; ')
      .replace(/？/g, '?')
      .replace(/！/g, '!')
      .replace(/（/g, '(')
      .replace(/）/g, ')')
      .replace(/「|」|“|”/g, '"')
      .replace(/、/g, ', ')
      .replace(/\s{2,}/g, ' ');
  }

  function getContentData() {
    if (contentEntries && contentLookup) return { entries: contentEntries, lookup: contentLookup };

    contentEntries = [];
    contentLookup = {};
    function addEntry(key, value) {
      var decodedKey = decodeHtml(key);
      var decodedValue = decodeHtml(value);
      [[key, value], [decodedKey, decodedValue]].forEach(function(pair) {
        var k = pair[0];
        var v = pair[1];
        if (!k || contentLookup[k]) return;
        contentLookup[k] = v;
        if (/[一-鿿]/.test(k)) contentEntries.push({ key: k, value: v });
      });
    }

    Object.keys(DATA).forEach(function(key) {
      var entry = DATA[key];
      if (entry && entry.zh && entry.en) addEntry(entry.zh, entry.en);
    });
    Object.keys(CONTENT).forEach(function(key) {
      addEntry(key, CONTENT[key]);
    });
    contentEntries.sort(function(a, b) { return b.key.length - a.key.length; });
    return { entries: contentEntries, lookup: contentLookup };
  }

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
          var parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          var tag = parent.tagName;
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'NOSCRIPT') {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.closest) {
            if (lang === 'en' && parent.closest('.i18n-zh')) return NodeFilter.FILTER_REJECT;
            if (lang === 'zh' && parent.closest('.i18n-en')) return NodeFilter.FILTER_REJECT;
          }
          // Skip if parent has data-i18n (handled separately)
          if (parent.hasAttribute && parent.hasAttribute('data-i18n')) {
            return NodeFilter.FILTER_REJECT;
          }
          // Only accept text with content
          var text = node.textContent.trim();
          if (!text || text.length < 1) return NodeFilter.FILTER_REJECT;

          if (lang === 'zh') {
            return node.__originalZh ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
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

    var data = getContentData();
    var translated = data.lookup[text] || data.lookup[text.trim()] || data.lookup[text.replace(/\s+/g, ' ')];
    if (!translated) {
      translated = text;
      data.entries.forEach(function(entry) {
        if (translated.indexOf(entry.key) !== -1) {
          translated = translated.split(entry.key).join(entry.value);
        }
      });
    }

    if (translated && /[一-鿿]/.test(translated)) {
      translated = normalizeEnglishFallback(translated);
    }

    if (translated && translated !== text) {
      node.__originalZh = text;
      node.textContent = translated;
    }
  }

  function _restoreToZh(node) {
    if (node.__originalZh) {
      node.textContent = node.__originalZh;
      node.__originalZh = null;
    }
  }

  /* ── DOM Application ── */

  function applyToDOM() {
    if (window.__I18N_PAGE_TITLE && window.__I18N_PAGE_TITLE[lang]) {
      document.title = window.__I18N_PAGE_TITLE[lang];
    }

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
    el.textContent = lang === 'zh' ? '🌐 EN' : '🌐 ZH';
    el.title = lang === 'zh' ? 'Switch to English' : 'Switch to Chinese';
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
