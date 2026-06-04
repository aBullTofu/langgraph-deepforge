/* ============================================================
   LangGraph DeepForge — app.js
   UI: dynamic nav, phase lock, progress, streak, celebrations
   ============================================================ */

(function() {
  'use strict';

  var basePrefix = /\/(lessons|reference)\//.test(window.location.pathname) ? '../' : '';

  var lessonId = getCurrentLessonId();
  recordStudy();

  /* ════════════════ Stage Lock Guard ════════════════ */
  if (lessonId && !isLessonUnlocked(lessonId)) {
    document.body.innerHTML = '';
    document.write('<meta http-equiv="refresh" content="0;url=' + basePrefix + 'reference/learning-path.html">');
    return;
  }

  /* ════════════════ Dynamic Nav ════════════════ */
  function renderDynamicNav() {
    var nav = document.querySelector('.nav-bar');
    if (!nav) return;
    var stage = getHighestAccessibleStage();
    var sp = getStageProgress();
    var tp = getTotalProgress();
    var streak = getStreak();

    var items = [
      { href: basePrefix + 'index.html', label: I18N.t('nav.overview') }
    ];

    items.push(
      { href: basePrefix + 'lessons/L01-state-nodes-edges.html', label: 'L01' },
      { href: basePrefix + 'lessons/L02-first-llm-agent.html', label: 'L02' },
      { href: basePrefix + 'lessons/L03-tools.html', label: 'L03' },
      { href: basePrefix + 'lessons/L04-agent-loop.html', label: 'L04' }
    );

    if (stage >= 1) {
      items.push(
        { href: basePrefix + 'lessons/L05-memory-persistence.html', label: 'L05' },
        { href: basePrefix + 'lessons/L06-human-in-the-loop.html', label: 'L06' },
        { href: basePrefix + 'lessons/L07-streaming.html', label: 'L07' },
        { href: basePrefix + 'lessons/L08-error-handling.html', label: 'L08' }
      );
    }

    if (stage >= 2) {
      items.push(
        { href: basePrefix + 'lessons/L09-subgraphs.html', label: 'L09' },
        { href: basePrefix + 'lessons/L10-multi-agent.html', label: 'L10' },
        { href: basePrefix + 'lessons/L11-parallel-send.html', label: 'L11' },
        { href: basePrefix + 'lessons/L12-production.html', label: 'L12' }
      );
    }

    items.push({ href: basePrefix + 'reference/learning-path.html', label: I18N.t('nav.roadmap') });
    items.push({ href: basePrefix + 'reference/fables.html', label: I18N.t('nav.fables') });

    if (sp.foundation.done >= 1) {
      items.push({ href: basePrefix + 'reference/pitfalls.html', label: I18N.t('nav.pitfalls') });
    }
    if (sp.foundation.done >= sp.foundation.total) {
      items.push({ href: basePrefix + 'reference/meta-learning-guide.html', label: I18N.t('nav.meta') });
      items.push({ href: basePrefix + 'reference/interview-bank.html', label: I18N.t('nav.interview') });
      items.push({ href: basePrefix + 'reference/answer-bank.html', label: I18N.t('nav.answers') });
    }

    var streakStr = streak.consecutiveDays > 1 ? ' \u{1F525} ' + streak.consecutiveDays + I18N.t('misc.days') : '';

    var html = '';
    var currentPage = window.location.pathname.split('/').pop() || '';
    items.forEach(function(item) {
      var itemFilename = item.href.split('/').pop();
      var active = (currentPage === itemFilename) ? ' class="active"' : '';
      html += '<a href="' + item.href + '"' + active + '>' + item.label + '</a>';
    });
    html += '<span style="margin-left:auto;font-family:var(--mono);color:var(--accent);font-size:0.85em">' +
      tp.done + '/' + tp.total + streakStr + '</span>';

    nav.innerHTML = html;
  }

  /* ════════════════ Floating Progress Widget ════════════════ */
  function renderFloatingWidget() {
    var p = getTotalProgress();
    var streak = getStreak();
    var el = document.getElementById('float-progress');
    if (!el) {
      el = document.createElement('a');
      el.id = 'float-progress';
      el.href = basePrefix + 'reference/learning-path.html';
      el.title = I18N.t('dashboard.view_progress');
      document.body.appendChild(el);
    }
    var streakStr = streak.consecutiveDays > 1 ? ' \u{1F525}' + streak.consecutiveDays : '';
    el.innerHTML = '<span class="fp-num">' + p.done + '</span>/' + p.total + streakStr;
  }

  /* ════════════════ Celebration Banner ════════════════ */
  function showCelebration(msg) {
    var b = document.getElementById('celebration');
    if (b) b.remove();
    b = document.createElement('div');
    b.id = 'celebration';
    b.className = 'celebration';
    b.textContent = msg;
    document.body.appendChild(b);
    setTimeout(function() { b.classList.add('show'); }, 10);
    setTimeout(function() { b.classList.remove('show'); setTimeout(function() { b.remove(); }, 400); }, 3000);
  }

  /* ════════════════ Complete Button ════════════════ */
  function renderCompleteBtn() {
    var container = document.getElementById('complete-section');
    if (!container || !lessonId) return;

    var lesson = getLesson(lessonId);
    container.innerHTML = '';

    var btn = document.createElement('button');
    btn.className = 'complete-btn' + (lesson.done ? ' done' : '');
    btn.textContent = lesson.done ? I18N.t('lesson.mark_undo') : I18N.t('lesson.mark_done');
    btn.onclick = function() {
      if (!lesson.done) {
        showConfirm(I18N.t('confirm.title'), I18N.t('confirm.body'), function() {
          var result = markDone(lessonId);
          renderCompleteBtn();
          renderFloatingWidget();
          renderDynamicNav();
          if (typeof updateDashboard === 'function') updateDashboard();
          if (result.newStageUnlocked) {
            var msg = I18N.t('celebrate.' + (result.newStageUnlocked === '专家篇' ? 'expert' : 'professional'));
            showCelebration(msg);
          }
          updateNextLessonLink();
        });
      } else {
        markDone(lessonId);
        renderCompleteBtn();
        renderFloatingWidget();
        renderDynamicNav();
        if (typeof updateDashboard === 'function') updateDashboard();
        updateNextLessonLink();
      }
    };
    container.appendChild(btn);
  }

  /* ════════════════ Next Lesson Link ════════════════ */
  function updateNextLessonLink() {
    var link = document.getElementById('next-lesson-link');
    if (!link || !lessonId) return;
    if (allPhasesDone(lessonId) && getLesson(lessonId).done) {
      link.style.display = '';
    } else {
      link.style.display = 'none';
    }
  }

  /* ════════════════ Notes Panel ════════════════ */
  function initNotesPanel() {
    var textarea = document.getElementById('lesson-notes');
    if (!textarea || !lessonId) return;

    var lesson = getLesson(lessonId);
    textarea.value = lesson.notes || '';
    textarea.style.display = 'block';

    var debounceTimer;
    textarea.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function() {
        saveNotes(lessonId, textarea.value);
      }, 1000);
    });

    window._exportNotes = function() { exportData(); };
    window._importNotes = function() {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = function(e) {
        importData(e.target.files[0]).then(function() {
          var updated = getLesson(lessonId);
          textarea.value = updated.notes || '';
          renderCompleteBtn();
          renderFloatingWidget();
          renderDynamicNav();
          if (typeof updateDashboard === 'function') updateDashboard();
          showToast(I18N.t('data.loaded'));
        }).catch(function() {
          showToast(I18N.t('data.format_error'));
        });
      };
      input.click();
    };
  }

  /* ════════════════ Confirm Dialog ════════════════ */
  function showConfirm(title, message, onOk) {
    var overlay = document.getElementById('confirm-overlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'confirm-overlay';
    overlay.className = 'confirm-overlay';
    overlay.innerHTML =
      '<div class="confirm-dialog">' +
        '<h3>' + title + '</h3>' +
        '<p>' + message + '</p>' +
        '<div class="confirm-actions">' +
          '<button class="confirm-cancel">' + I18N.t('confirm.cancel') + '</button>' +
          '<button class="confirm-ok">' + I18N.t('confirm.ok') + '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.querySelector('.confirm-cancel').onclick = function() { overlay.remove(); };
    overlay.querySelector('.confirm-ok').onclick = function() { overlay.remove(); onOk(); };
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  }

  /* ════════════════ Toast ════════════════ */
  function showToast(msg) {
    var t = document.getElementById('toast');
    if (t) t.remove();
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.classList.add('show'); }, 10);
    setTimeout(function() { t.classList.remove('show'); setTimeout(function() { t.remove(); }, 300); }, 2500);
  }

  /* ════════════════ Phase Lock ════════════════ */
  function injectPhaseButtons() {
    var phases = document.querySelectorAll('.phase[data-phase]');
    phases.forEach(function(phase) {
      var phaseName = phase.dataset.phase;
      if (phaseName === 'echo') return;

      if (phase.querySelector('.phase-complete-btn')) return;

      var done = getPhase(lessonId, phaseName);
      var btn = document.createElement('button');
      btn.className = 'phase-complete-btn' + (done ? ' done' : '');
      btn.textContent = done ? I18N.t('phase.done') : I18N.t('phase.mark');

      btn.onclick = function() {
        if (done) return;
        var next = markPhase(lessonId, phaseName);
        btn.textContent = I18N.t('phase.done');
        btn.className = 'phase-complete-btn done';

        if (next) {
          var nextPhase = document.querySelector('.phase[data-phase=\"' + next + '\"]');
          if (nextPhase) {
            nextPhase.classList.remove('locked-content');
            nextPhase.style.opacity = '0';
            nextPhase.style.transform = 'translateY(8px)';
            nextPhase.style.transition = 'opacity 0.3s, transform 0.3s';
            requestAnimationFrame(function() {
              nextPhase.style.opacity = '1';
              nextPhase.style.transform = 'translateY(0)';
            });
            injectPhaseButtons();
          }
        }

        if (phaseName === 'forge' || allPhasesDone(lessonId)) {
          var completeSection = document.getElementById('complete-section');
          if (completeSection) {
            completeSection.style.opacity = '1';
            completeSection.style.pointerEvents = 'auto';
          }
          updateNextLessonLink();
        }

        showToast(I18N.t('phase.completed_toast', { name: I18N.t('phase.' + phaseName + '.label') }));
      };

      phase.appendChild(btn);
    });
  }

  function initPhaseLock() {
    if (!lessonId) return;

    var phases = document.querySelectorAll('.phase[data-phase]');
    var existingPhases = [];
    phases.forEach(function(p) { existingPhases.push(p.dataset.phase); });

    phases.forEach(function(phase) {
      var phaseName = phase.dataset.phase;
      var myIdx = existingPhases.indexOf(phaseName);
      var prevPhase = myIdx > 0 ? existingPhases[myIdx - 1] : null;
      if (prevPhase && !getPhase(lessonId, prevPhase)) {
        phase.classList.add('locked-content');
      }
    });

    if (!allPhasesDone(lessonId)) {
      var completeSection = document.getElementById('complete-section');
      if (completeSection) {
        completeSection.style.opacity = '0.4';
        completeSection.style.pointerEvents = 'none';
      }
    }

    injectPhaseButtons();
  }

  /* ════════════════ Index Dashboard ════════════════ */
  function renderDashboard() {
    var dash = document.getElementById('continue-dashboard');
    if (!dash) return;

    var sp = getStageProgress();
    var tp = getTotalProgress();
    var streak = getStreak();

    var continueLesson = null;
    for (var i = 1; i <= 12; i++) {
      var id = 'L' + String(i).padStart(2, '0');
      if (!isLessonUnlocked(id)) break;
      var ls = getLesson(id);
      if (!ls.done) { continueLesson = id; break; }
    }
    if (!continueLesson) continueLesson = 'L01';

    var lessonNames = {
      L01: I18N.t('lesson.L01.title'), L02: I18N.t('lesson.L02.title'),
      L03: I18N.t('lesson.L03.title'), L04: I18N.t('lesson.L04.title'),
      L05: I18N.t('lesson.L05.title'), L06: I18N.t('lesson.L06.title'),
      L07: I18N.t('lesson.L07.title'), L08: I18N.t('lesson.L08.title'),
      L09: I18N.t('lesson.L09.title'), L10: I18N.t('lesson.L10.title'),
      L11: I18N.t('lesson.L11.title'), L12: I18N.t('lesson.L12.title')
    };
    var lessonFiles = {
      L01: basePrefix + 'lessons/L01-state-nodes-edges.html', L02: basePrefix + 'lessons/L02-first-llm-agent.html',
      L03: basePrefix + 'lessons/L03-tools.html', L04: basePrefix + 'lessons/L04-agent-loop.html',
      L05: basePrefix + 'lessons/L05-memory-persistence.html', L06: basePrefix + 'lessons/L06-human-in-the-loop.html',
      L07: basePrefix + 'lessons/L07-streaming.html', L08: basePrefix + 'lessons/L08-error-handling.html',
      L09: basePrefix + 'lessons/L09-subgraphs.html', L10: basePrefix + 'lessons/L10-multi-agent.html',
      L11: basePrefix + 'lessons/L11-parallel-send.html', L12: basePrefix + 'lessons/L12-production.html'
    };

    var phasesDone = 0;
    var phasesTotal = 0;
    var phaseNames = ['ignition', 'fable', 'godview', 'combat', 'forge'];
    phaseNames.forEach(function(p) {
      if (getPhase(continueLesson, p)) phasesDone++;
      phasesTotal++;
    });

    var phaseLine = phasesDone > 0 ? I18N.t('dashboard.phase', { n: phasesDone + 1 }) + '/' + phasesTotal : I18N.t('dashboard.start');

    var stages = ['foundation', 'professional', 'expert'];
    var stageEmoji = ['\u{1F7E2}', '\u{1F7E1}', '\u{1F534}'];
    var stageBars = '';
    var nextMilestone = '';
    stages.forEach(function(key, idx) {
      var s = sp[key];
      var pct = Math.round((s.done / s.total) * 100);
      var locked = idx > 0 && sp[stages[idx - 1]].done < sp[stages[idx - 1]].total;
      stageBars += '<div class="dashboard-row">' +
        '<span class="stage-label" style="color:' + s.color + '">' + stageEmoji[idx] + ' ' + I18N.t('stage.' + key) + '</span>' +
        '<span class="stage-bar"><span class="stage-fill" style="width:' + pct + '%;background:' + s.color + '"></span></span>' +
        '<span class="stage-num">' + s.done + '/' + s.total + '</span>';
      if (locked) stageBars += '<span class="stage-lock">\u{1F512}</span>';
      stageBars += '</div>';

      if (!locked && s.done < s.total && !nextMilestone) {
        var remaining = s.total - s.done;
        var nextStageName = stages[idx + 1] ? I18N.t('stage.' + stages[idx + 1]) : I18N.t('dashboard.all_done');
        nextMilestone = I18N.t('dashboard.more_unlock', { n: remaining, stage: nextStageName });
      }
    });

    var streakStr = streak.consecutiveDays > 1 ? I18N.t('dashboard.streak', { n: streak.consecutiveDays }) : '';

    dash.innerHTML =
      '<a href="' + lessonFiles[continueLesson] + '" class="continue-btn">' +
        '▶ ' + continueLesson + ' · ' + lessonNames[continueLesson] + '<br>' +
        '<span style="font-size:0.7em;opacity:0.7">' + phaseLine + '</span>' +
      '</a>' +
      '<div style="margin-top:24px">' + stageBars + '</div>' +
      (nextMilestone ? '<p style="text-align:center;color:var(--text-2);margin-top:12px;font-size:0.9em">' + nextMilestone + '</p>' : '') +
      (streakStr ? '<p style="text-align:center;margin-top:8px;font-size:0.9em">' + streakStr + '</p>' : '') +
      '<p style="text-align:center;margin-top:4px;font-size:0.85em;color:var(--text-2)">' + I18N.t('dashboard.progress') + ': ' + tp.done + '/' + tp.total + ' (' + tp.pct + '%)</p>';
  }

  /* ════════════════ Re-render on language change ════════════════ */
  window.onLangChange = function() {
    renderDynamicNav();
    renderFloatingWidget();
    renderCompleteBtn();
    renderDashboard();
  };

  /* ════════════════ Init ════════════════ */
  renderDynamicNav();
  initPhaseLock();
  renderFloatingWidget();
  renderCompleteBtn();
  initNotesPanel();
  renderDashboard();
  updateNextLessonLink();

})();
