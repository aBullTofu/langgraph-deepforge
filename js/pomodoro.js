/* ============================================================
   LangGraph DeepForge — pomodoro.js
   Floating Pomodoro timer, auto work/break cycle
   ============================================================ */

(function() {
  'use strict';

  var STORAGE_KEY = 'langgraph_pomodoro';
  var settings = loadSettings();
  var timer = null;
  var secondsLeft = settings.work * 60;
  var state = 'stopped'; // stopped | working | breaking

  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e) { return {}; }
  }
  function saveSettings() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  if (!settings.work) settings.work = 25;
  if (!settings.break) settings.break = 5;
  if (settings.autoStart === undefined) settings.autoStart = true;

  /* ── DOM ── */
  function buildWidget() {
    var el = document.createElement('div');
    el.id = 'pomodoro';
    el.innerHTML =
      '<div class="pomo-display" id="pomo-display">' +
        '<span class="pomo-icon">' + (state === 'breaking' ? '☕' : '🍅') + '</span> ' +
        '<span id="pomo-time">' + formatTime(secondsLeft) + '</span>' +
      '</div>' +
      '<div class="pomo-controls" id="pomo-controls">' +
        '<button id="pomo-toggle" title="' + I18N.t('pomo.toggle') + '">⏯</button>' +
        '<button id="pomo-skip" title="' + I18N.t('pomo.skip') + '">⏭</button>' +
        '<button id="pomo-settings-btn" title="' + I18N.t('pomo.settings') + '">⚙</button>' +
      '</div>' +
      '<div class="pomo-settings" id="pomo-settings" style="display:none">' +
        '<label>' + I18N.t('pomo.work') + ' <input type="number" id="pomo-work" min="1" max="120" value="' + settings.work + '"> ' + I18N.t('pomo.minutes') + '</label>' +
        '<label>' + I18N.t('pomo.break') + ' <input type="number" id="pomo-break" min="1" max="60" value="' + settings.break + '"> ' + I18N.t('pomo.minutes') + '</label>' +
        '<label><input type="checkbox" id="pomo-autostart"' + (settings.autoStart ? ' checked' : '') + '> ' + I18N.t('pomo.auto_start') + '</label>' +
        '<button id="pomo-apply">' + I18N.t('pomo.apply') + '</button>' +
      '</div>';
    document.body.appendChild(el);

    document.getElementById('pomo-toggle').onclick = toggle;
    document.getElementById('pomo-skip').onclick = skip;
    document.getElementById('pomo-settings-btn').onclick = function() {
      var s = document.getElementById('pomo-settings');
      s.style.display = s.style.display === 'none' ? 'block' : 'none';
    };
    document.getElementById('pomo-apply').onclick = applySettings;
    document.getElementById('pomo-display').ondblclick = function() {
      var s = document.getElementById('pomo-settings');
      s.style.display = s.style.display === 'none' ? 'block' : 'none';
    };

    updateDisplay();
  }

  function updateDisplay() {
    var timeEl = document.getElementById('pomo-time');
    var iconEl = document.querySelector('.pomo-icon');
    if (timeEl) timeEl.textContent = formatTime(secondsLeft);
    if (iconEl) iconEl.textContent = state === 'breaking' ? '☕' : '🍅';

    var widget = document.getElementById('pomodoro');
    if (widget) {
      widget.className = 'pomodoro pomo-' + state;
    }
  }

  /* ── Timer Logic ── */
  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function start(duration, newState) {
    stop();
    secondsLeft = duration;
    state = newState;
    updateDisplay();

    timer = setInterval(function() {
      secondsLeft--;
      updateDisplay();
      if (secondsLeft <= 0) {
        complete();
      }
    }, 1000);
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function toggle() {
    if (state === 'stopped') {
      start(settings.work * 60, 'working');
    } else if (timer) {
      stop();
      state = 'stopped';
      updateDisplay();
    } else {
      start(secondsLeft, state);
    }
  }

  function skip() {
    complete();
  }

  function complete() {
    stop();
    if (state === 'working') {
      showPomoToast(I18N.t('pomo.toast_break'));
      start(settings.break * 60, 'breaking');
    } else if (state === 'breaking') {
      showPomoToast(I18N.t('pomo.toast_work'));
      start(settings.work * 60, 'working');
    }
  }

  function applySettings() {
    var w = parseInt(document.getElementById('pomo-work').value) || 25;
    var b = parseInt(document.getElementById('pomo-break').value) || 5;
    var a = document.getElementById('pomo-autostart').checked;
    settings.work = w;
    settings.break = b;
    settings.autoStart = a;
    saveSettings();
    document.getElementById('pomo-settings').style.display = 'none';

    if (state !== 'stopped') {
      stop();
    }
    start(w * 60, 'working');
    showPomoToast(I18N.t('pomo.toast_updated'));
  }

  function showPomoToast(msg) {
    var t = document.getElementById('pomo-toast');
    if (t) t.remove();
    t = document.createElement('div');
    t.id = 'pomo-toast';
    t.className = 'pomo-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.classList.add('show'); }, 10);
    setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 300); }, 3500);
  }

  /* ── Init ── */
  buildWidget();
  if (settings.autoStart) {
    start(settings.work * 60, 'working');
  } else {
    state = 'stopped';
    updateDisplay();
  }

})();
