/* ============================================================
   LangGraph DeepForge — i18n.js
   Internationalization engine: language switching, DOM updates
   ============================================================ */

var I18N = (function() {
  'use strict';

  var STORAGE_KEY = 'langgraph_lang';
  var DATA = window.__I18N_DATA || {};

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
    /* Notify other components */
    if (window.onLangChange) window.onLangChange(lang);
  }

  function getLang() {
    return lang;
  }

  /* ── DOM Application ── */

  function applyToDOM() {
    /* 1. data-i18n attributes — replace textContent */
    var elements = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    }

    /* 2. data-i18n-placeholder */
    var phs = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phs.length; j++) {
      var ph = phs[j];
      ph.placeholder = t(ph.getAttribute('data-i18n-placeholder'));
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
  }

  /* ── Language Switcher ── */

  function renderSwitcher() {
    var el = document.getElementById('i18n-switcher');
    if (el) return; // already rendered

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
    renderSwitcher: renderSwitcher
  };
})();
