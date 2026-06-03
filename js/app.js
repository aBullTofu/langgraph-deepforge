/* ============================================================
   LangGraph DeepForge — app.js
   UI: dynamic nav, phase lock, progress, streak, celebrations
   ============================================================ */

(function() {
  'use strict';

  const lessonId = getCurrentLessonId();
  recordStudy();

  /* ════════════════ Stage Lock Guard ════════════════ */
  if (lessonId && !isLessonUnlocked(lessonId)) {
    document.body.innerHTML = '';
    document.write('<meta http-equiv="refresh" content="0;url=reference/learning-path.html">');
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
      { href: 'index.html', label: '\u{1F3E0} 总览' }
    ];

    // Always show foundation lessons
    items.push(
      { href: 'lessons/L01-state-nodes-edges.html', label: 'L01' },
      { href: 'lessons/L02-first-llm-agent.html', label: 'L02' },
      { href: 'lessons/L03-tools.html', label: 'L03' },
      { href: 'lessons/L04-agent-loop.html', label: 'L04' }
    );

    // Professional lessons visible from stage 1+
    if (stage >= 1) {
      items.push(
        { href: 'lessons/L05-memory-persistence.html', label: 'L05' },
        { href: 'lessons/L06-human-in-the-loop.html', label: 'L06' },
        { href: 'lessons/L07-streaming.html', label: 'L07' },
        { href: 'lessons/L08-error-handling.html', label: 'L08' }
      );
    }

    // Expert lessons visible from stage 2
    if (stage >= 2) {
      items.push(
        { href: 'lessons/L09-subgraphs.html', label: 'L09' },
        { href: 'lessons/L10-multi-agent.html', label: 'L10' },
        { href: 'lessons/L11-parallel-send.html', label: 'L11' },
        { href: 'lessons/L12-production.html', label: 'L12' }
      );
    }

    // Resource pages unlock progressively
    items.push({ href: 'reference/learning-path.html', label: '\u{1F5FA} 路线' });
    items.push({ href: 'reference/fables.html', label: '\u{1F4D6} 寓言' });

    if (sp.foundation.done >= 1) {
      items.push({ href: 'reference/pitfalls.html', label: '⚠ 避坑' });
    }
    if (sp.foundation.done >= sp.foundation.total) {
      items.push({ href: 'reference/meta-learning-guide.html', label: '\u{1F9E0} 元学习' });
      items.push({ href: 'reference/interview-bank.html', label: '\u{1F3D4} 面试' });
      items.push({ href: 'reference/answer-bank.html', label: '\u{1F4D6} 答案' });
    }

    // Progress widget
    var streakStr = streak.consecutiveDays > 1 ? ' \u{1F525} ' + streak.consecutiveDays + '天' : '';

    var html = '';
    var currentPage = window.location.pathname.split('/').pop() || '';
    items.forEach(function(item) {
      var active = (currentPage === item.href) ? ' class="active"' : '';
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
      el.href = 'reference/learning-path.html';
      el.title = '查看学习进度';
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
    btn.textContent = lesson.done ? '✅ 已完成 · 点击撤销' : '☐ 标记为已完成';
    btn.onclick = function() {
      if (!lesson.done) {
        showConfirm('确认完成？', '你确定已经走完了 Ignition → Fable → GodView → Combat → Forge → Echo 六个阶段吗？', function() {
          var result = markDone(lessonId);
          renderCompleteBtn();
          renderFloatingWidget();
          renderDynamicNav();
          if (typeof updateDashboard === 'function') updateDashboard();
          if (result.newStageUnlocked) {
            var stageNames = { '专业篇': '\u{1F525} 专业篇通关！生产级 Agent 技能已掌握。专家篇已解锁 →',
              '专家篇': '\u{1F3C6} 专家篇通关！你已能设计生产级多 Agent 系统。' };
            var msg = stageNames[result.newStageUnlocked] || ('\u{1F389} ' + result.newStageUnlocked + ' 已解锁！');
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
          showToast('✅ 数据已加载');
        }).catch(function() {
          showToast('❌ 文件格式错误');
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
          '<button class="confirm-cancel">取消</button>' +
          '<button class="confirm-ok">确认完成</button>' +
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
      btn.textContent = done ? '✓ 已完成' : '☐ 确认完成此阶段';

      btn.onclick = function() {
        if (done) return;
        var next = markPhase(lessonId, phaseName);
        btn.textContent = '✓ 已完成';
        btn.className = 'phase-complete-btn done';

        if (next) {
          var nextPhase = document.querySelector('.phase[data-phase=\"' + next + '\"]');
          if (nextPhase) {
            nextPhase.classList.remove('locked-content');
            // Animate
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

        showToast('✓ ' + phaseName + ' 完成！');
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

    // Find current lesson to continue
    var continueLesson = null;
    for (var i = 1; i <= 12; i++) {
      var id = 'L' + String(i).padStart(2, '0');
      if (!isLessonUnlocked(id)) break;
      var ls = getLesson(id);
      if (!ls.done) { continueLesson = id; break; }
    }
    if (!continueLesson) continueLesson = 'L01';

    var lessonNames = {
      L01: 'State / Node / Edge', L02: '第一个 LLM Agent', L03: 'Tools（工具集成）',
      L04: 'Agent Loop（ReAct 循环）', L05: 'Memory & Persistence',
      L06: 'Human-in-the-Loop', L07: 'Streaming（流式输出）',
      L08: 'Error Handling', L09: 'Subgraphs', L10: 'Multi-Agent',
      L11: 'Parallel & Send', L12: 'Production（生产部署）'
    };
    var lessonFiles = {
      L01: 'lessons/L01-state-nodes-edges.html', L02: 'lessons/L02-first-llm-agent.html',
      L03: 'lessons/L03-tools.html', L04: 'lessons/L04-agent-loop.html',
      L05: 'lessons/L05-memory-persistence.html', L06: 'lessons/L06-human-in-the-loop.html',
      L07: 'lessons/L07-streaming.html', L08: 'lessons/L08-error-handling.html',
      L09: 'lessons/L09-subgraphs.html', L10: 'lessons/L10-multi-agent.html',
      L11: 'lessons/L11-parallel-send.html', L12: 'lessons/L12-production.html'
    };

    // Count phases done for current lesson
    var phasesDone = 0;
    var phasesTotal = 0;
    var phaseNames = ['ignition', 'fable', 'godview', 'combat', 'forge'];
    phaseNames.forEach(function(p) {
      if (getPhase(continueLesson, p)) phasesDone++;
      phasesTotal++;
    });

    var phaseLine = phasesDone > 0 ? '继续 Phase ' + (phasesDone + 1) + '/' + phasesTotal : '开始学习';

    // Stage progress
    var stages = ['foundation', 'professional', 'expert'];
    var stageEmoji = ['\u{1F7E2}', '\u{1F7E1}', '\u{1F534}'];
    var stageBars = '';
    var nextMilestone = '';
    stages.forEach(function(key, idx) {
      var s = sp[key];
      var pct = Math.round((s.done / s.total) * 100);
      var locked = idx > 0 && sp[stages[idx - 1]].done < sp[stages[idx - 1]].total;
      stageBars += '<div class="dashboard-row">' +
        '<span class="stage-label" style="color:' + s.color + '">' + stageEmoji[idx] + ' ' + s.name + '</span>' +
        '<span class="stage-bar"><span class="stage-fill" style="width:' + pct + '%;background:' + s.color + '"></span></span>' +
        '<span class="stage-num">' + s.done + '/' + s.total + '</span>';
      if (locked) stageBars += '<span class="stage-lock">\u{1F512}</span>';
      stageBars += '</div>';

      if (!locked && s.done < s.total && !nextMilestone) {
        var remaining = s.total - s.done;
        nextMilestone = '再完成 <strong>' + remaining + '</strong> 课解锁' +
          (stages[idx + 1] ? ' <strong>' + sp[stages[idx + 1]].name + '</strong>' : '全部内容');
      }
    });

    var streakStr = streak.consecutiveDays > 1 ? '\u{1F525} 连续学习 ' + streak.consecutiveDays + ' 天' : '';

    dash.innerHTML =
      '<a href="' + lessonFiles[continueLesson] + '" class="continue-btn">' +
        '▶ ' + continueLesson + ' · ' + lessonNames[continueLesson] + '<br>' +
        '<span style="font-size:0.7em;opacity:0.7">' + phaseLine + '</span>' +
      '</a>' +
      '<div style="margin-top:24px">' + stageBars + '</div>' +
      (nextMilestone ? '<p style="text-align:center;color:var(--text-2);margin-top:12px;font-size:0.9em">' + nextMilestone + '</p>' : '') +
      (streakStr ? '<p style="text-align:center;margin-top:8px;font-size:0.9em">' + streakStr + '</p>' : '') +
      '<p style="text-align:center;margin-top:4px;font-size:0.85em;color:var(--text-2)">总进度: ' + tp.done + '/' + tp.total + ' (' + tp.pct + '%)</p>';
  }

  /* ════════════════ Init ════════════════ */
  renderDynamicNav();
  initPhaseLock();
  renderFloatingWidget();
  renderCompleteBtn();
  initNotesPanel();
  renderDashboard();
  updateNextLessonLink();

})();
