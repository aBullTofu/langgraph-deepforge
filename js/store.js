/* ============================================================
   LangGraph DeepForge — store.js
   localStorage data layer for progress + notes + stage lock
   ============================================================ */

const STORE_KEY = 'langgraph_learn';

const STAGES = {
  foundation: { name: '基础篇', lessons: ['L01','L02','L03','L04'], color: '#6c8cff' },
  professional: { name: '专业篇', lessons: ['L05','L06','L07','L08'], color: '#4cdf80' },
  expert: { name: '专家篇', lessons: ['L09','L10','L11','L12'], color: '#ff5c5c' }
};

const STAGE_ORDER = ['foundation', 'professional', 'expert'];

/* ── Helpers ── */
function _load() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
  catch { return {}; }
}

function _save(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function _lessonStage(id) {
  for (const [key, stage] of Object.entries(STAGES)) {
    if (stage.lessons.includes(id)) return { key, ...stage };
  }
  return null;
}

/* ── Lesson CRUD ── */
function getLesson(id) {
  const data = _load();
  if (!data.lessons) data.lessons = {};
  return data.lessons[id] || { done: false, doneAt: null, notes: '' };
}

function markDone(id) {
  const data = _load();
  if (!data.lessons) data.lessons = {};
  const current = data.lessons[id] || { done: false, doneAt: null, notes: '' };
  current.done = !current.done;
  current.doneAt = current.done ? new Date().toISOString() : null;
  data.lessons[id] = current;
  _save(data);

  let newStageUnlocked = null;
  if (current.done) {
    const s = _lessonStage(id);
    if (s) {
      const idx = STAGE_ORDER.indexOf(s.key);
      if (idx < STAGE_ORDER.length - 1) {
        const nextStage = STAGES[STAGE_ORDER[idx + 1]];
        const allDone = s.lessons.every(lid => {
          const ls = data.lessons[lid];
          return ls && ls.done;
        });
        if (allDone) newStageUnlocked = nextStage.name;
      }
    }
  }
  return { done: current.done, newStageUnlocked };
}

function saveNotes(id, text) {
  const data = _load();
  if (!data.lessons) data.lessons = {};
  if (!data.lessons[id]) data.lessons[id] = { done: false, doneAt: null, notes: '' };
  data.lessons[id].notes = text;
  _save(data);
}

/* ── Export / Import ── */
function exportData() {
  const data = _load();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'langgraph-progress-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.lessons) throw new Error('Invalid format');
        _save(data);
        resolve(true);
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(new Error('Read failed'));
    reader.readAsText(file);
  });
}

/* ── Progress ── */
function getStageProgress() {
  const data = _load();
  const result = {};
  for (const [key, stage] of Object.entries(STAGES)) {
    let done = 0;
    stage.lessons.forEach(id => {
      const ls = data.lessons && data.lessons[id];
      if (ls && ls.done) done++;
    });
    result[key] = { name: stage.name, done, total: stage.lessons.length, color: stage.color };
  }
  return result;
}

function getTotalProgress() {
  const data = _load();
  let done = 0;
  for (let i = 1; i <= 12; i++) {
    const id = 'L' + String(i).padStart(2, '0');
    const ls = data.lessons && data.lessons[id];
    if (ls && ls.done) done++;
  }
  return { done, total: 12, pct: Math.round((done / 12) * 100) };
}

/* ── Stage Lock ── */
function isLessonUnlocked(id) {
  const s = _lessonStage(id);
  if (!s) return false;
  const idx = STAGE_ORDER.indexOf(s.key);
  if (idx === 0) return true; // foundation always unlocked

  const data = _load();
  const prevStage = STAGES[STAGE_ORDER[idx - 1]];
  return prevStage.lessons.every(lid => {
    const ls = data.lessons && data.lessons[lid];
    return ls && ls.done;
  });
}

function getCurrentLessonId() {
  const path = window.location.pathname;
  const match = path.match(/L(\d{2})/);
  return match ? 'L' + match[1] : null;
}

/* ── Phase Tracking ── */
const PHASE_ORDER = ['ignition', 'fable', 'godview', 'combat', 'forge'];

function getPhase(lessonId, phaseName) {
  const ls = getLesson(lessonId);
  if (!ls.phases) ls.phases = {};
  return ls.phases[phaseName] || false;
}

function markPhase(lessonId, phaseName) {
  const data = _load();
  if (!data.lessons) data.lessons = {};
  if (!data.lessons[lessonId]) data.lessons[lessonId] = { done: false, doneAt: null, notes: '' };
  if (!data.lessons[lessonId].phases) data.lessons[lessonId].phases = {};
  data.lessons[lessonId].phases[phaseName] = true;
  _save(data);

  const idx = PHASE_ORDER.indexOf(phaseName);
  return idx >= 0 && idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : null;
}

function isPhaseUnlocked(lessonId, phaseName) {
  if (phaseName === 'ignition' || phaseName === 'echo') return true;
  const idx = PHASE_ORDER.indexOf(phaseName);
  if (idx <= 0) return true;
  const prevPhase = PHASE_ORDER[idx - 1];
  return getPhase(lessonId, prevPhase) === true;
}

function allPhasesDone(lessonId) {
  return PHASE_ORDER.every(function(p) { return getPhase(lessonId, p); });
}

/* ── Stage Access ── */
function getHighestAccessibleStage() {
  // returns: 0=foundation, 1=professional, 2=expert
  const sp = getStageProgress();
  if (sp.foundation.done < sp.foundation.total) return 0;
  if (sp.professional.done < sp.professional.total) return 1;
  return 2;
}

/* ── Streak ── */
function getStreak() {
  const data = _load();
  return data.streak || { lastStudyDate: null, consecutiveDays: 0 };
}

function recordStudy() {
  const data = _load();
  if (!data.streak) data.streak = { lastStudyDate: null, consecutiveDays: 0 };
  const today = new Date().toISOString().slice(0, 10);
  if (data.streak.lastStudyDate === today) return data.streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (data.streak.lastStudyDate === yesterday) {
    data.streak.consecutiveDays++;
  } else {
    data.streak.consecutiveDays = 1;
  }
  data.streak.lastStudyDate = today;
  _save(data);
  return data.streak;
}
