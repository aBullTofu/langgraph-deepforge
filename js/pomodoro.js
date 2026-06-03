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

  // defaults
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
        '<button id="pomo-toggle" title="暂停/继续">⏯</button>' +
        '<button id="pomo-skip" title="跳过">⏭</button>' +
        '<button id="pomo-settings-btn" title="设置">⚙</button>' +
      '</div>' +
      '<div class="pomo-settings" id="pomo-settings" style="display:none">' +
        '<label>工作 <input type="number" id="pomo-work" min="1" max="120" value="' + settings.work + '"> 分钟</label>' +
        '<label>休息 <input type="number" id="pomo-break" min="1" max="60" value="' + settings.break + '"> 分钟</label>' +
        '<label><input type="checkbox" id="pomo-autostart"' + (settings.autoStart ? ' checked' : '') + '> 自动开始</label>' +
        '<button id="pomo-apply">应用</button>' +
      '</div>';
    document.body.appendChild(el);

    // Events
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
      showPomoToast('🍅 该休息了！站起来走动一下。');
      start(settings.break * 60, 'breaking');
    } else if (state === 'breaking') {
      showPomoToast('💪 休息结束，继续学习！');
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

    // Restart with new work duration
    if (state !== 'stopped') {
      stop();
    }
    start(w * 60, 'working');
    showPomoToast('⚙ 设置已更新');
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
