// ============================================================
//  Smart Study Generator — Study Planner
//  File: js/planner.js
// ============================================================

'use strict';

/* ─── DOM refs ──────────────────────────────────────────── */
const plannerForm    = document.getElementById('plannerForm');
const subjectInput   = document.getElementById('subject');
const examDateInput  = document.getElementById('examDate');
const hoursRange     = document.getElementById('hoursPerDay');
const hoursVal       = document.getElementById('hoursVal');
const topicInput     = document.getElementById('topicInput');
const topicTagsEl    = document.getElementById('topicTags');
const weakInput      = document.getElementById('weakInput');
const weakTagsEl     = document.getElementById('weakTags');
const generateBtn    = document.getElementById('generateBtn');
const generateLabel  = document.getElementById('generateBtnLabel');
const generateLoad   = document.getElementById('generateBtnLoading');
const resetBtn       = document.getElementById('resetBtn');
const plannerEmpty   = document.getElementById('plannerEmpty');
const plannerResult  = document.getElementById('plannerResult');
const resultTitle    = document.getElementById('resultTitle');
const resultMeta     = document.getElementById('resultMeta');
const resultSummary  = document.getElementById('resultSummary');
const weakAlert      = document.getElementById('weakAlert');
const weakAlertText  = document.getElementById('weakAlertText');
const timetablePanel = document.getElementById('panel-timetable');
const schedulePanel  = document.getElementById('panel-schedule');
const topicsPanel    = document.getElementById('panel-topics');
const printBtn       = document.getElementById('printBtn');
const exportCsvBtn   = document.getElementById('exportCsvBtn');
const regenBtn       = document.getElementById('regenBtn');

/* ─── State ─────────────────────────────────────────────── */
const state = { topics: [], weakTopics: [] };

/* Set today as min exam date */
examDateInput.min = new Date().toISOString().split('T')[0];

/* ─── Hours range live update ───────────────────────────── */
hoursRange.addEventListener('input', () => {
  const v = parseFloat(hoursRange.value);
  hoursVal.textContent = v % 1 === 0 ? `${v} hrs` : `${v} hrs`;
  updateRangeFill(hoursRange);
});
updateRangeFill(hoursRange);

function updateRangeFill(range) {
  const pct = ((range.value - range.min) / (range.max - range.min)) * 100;
  range.style.background = `linear-gradient(90deg, var(--blue-50) ${pct}%, var(--blue-20) ${pct}%)`;
}

/* ─── Topic tags ─────────────────────────────────────────── */
initTagInput(topicInput, topicTagsEl, state.topics, false);
initTagInput(weakInput,  weakTagsEl,  state.weakTopics, true);

function initTagInput(input, container, arr, isWeak) {
  input.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
      e.preventDefault();
      addTag(input.value.trim().replace(/,$/, ''), arr, container, isWeak);
      input.value = '';
    }
    if (e.key === 'Backspace' && input.value === '' && arr.length) {
      arr.pop();
      renderTags(arr, container, isWeak);
    }
  });
  // Allow click on wrap to focus input
  input.parentElement.addEventListener('click', () => input.focus());
}

function addTag(text, arr, container, isWeak) {
  if (!text || arr.includes(text) || arr.length >= 20) return;
  arr.push(text);
  renderTags(arr, container, isWeak);
}

function renderTags(arr, container, isWeak) {
  container.innerHTML = '';
  arr.forEach((tag, i) => {
    const span = document.createElement('span');
    span.className = `topic-tag${isWeak ? ' topic-tag--weak' : ''}`;
    span.innerHTML = `${escHtml(tag)}<button class="topic-tag__remove" data-i="${i}" aria-label="Remove ${escHtml(tag)}">&times;</button>`;
    span.querySelector('.topic-tag__remove').addEventListener('click', () => {
      arr.splice(i, 1);
      renderTags(arr, container, isWeak);
    });
    container.appendChild(span);
  });
}

/* ─── Form validation ────────────────────────────────────── */
function validate() {
  let ok = true;
  const setErr = (id, msg) => {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.toggle('visible', !!msg); }
  };
  const inp = id => document.getElementById(id);

  inp('subject').classList.remove('has-error');
  inp('examDate').classList.remove('has-error');

  if (!subjectInput.value.trim()) {
    setErr('subjectErr', 'Please enter a subject or course name.');
    subjectInput.classList.add('has-error');
    ok = false;
  } else { setErr('subjectErr', ''); }

  if (!examDateInput.value) {
    setErr('examDateErr', 'Please choose your exam date.');
    examDateInput.classList.add('has-error');
    ok = false;
  } else if (new Date(examDateInput.value) <= new Date()) {
    setErr('examDateErr', 'Exam date must be in the future.');
    examDateInput.classList.add('has-error');
    ok = false;
  } else { setErr('examDateErr', ''); }

  if (state.topics.length === 0) {
    setErr('topicsErr', 'Add at least one topic to study.');
    ok = false;
  } else { setErr('topicsErr', ''); }

  return ok;
}

/* ─── Form submit ────────────────────────────────────────── */
plannerForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;
  generatePlan();
});

regenBtn?.addEventListener('click', () => {
  if (validate()) generatePlan();
});

/* ─── Generate plan ──────────────────────────────────────── */
function generatePlan() {
  // Show loading state
  generateLabel.hidden = true;
  generateLoad.hidden  = false;
  generateBtn.disabled = true;

  setTimeout(() => {
    buildPlan();
    generateLabel.hidden = false;
    generateLoad.hidden  = true;
    generateBtn.disabled = false;
  }, 1600 + Math.random() * 600);
}

function buildPlan() {
  const subject    = subjectInput.value.trim();
  const examDate   = new Date(examDateInput.value);
  const hoursPerDay = parseFloat(hoursRange.value);
  const intensity   = document.querySelector('input[name="intensity"]:checked')?.value || 'moderate';
  const prefBreaks  = document.getElementById('prefBreaks').checked;
  const prefRevision = document.getElementById('prefRevision').checked;
  const prefMockExam = document.getElementById('prefMockExam').checked;
  const prefWeekends = document.getElementById('prefWeekends').checked;
  const topics      = [...state.topics];
  const weakTopics  = [...state.weakTopics];

  const today     = new Date(); today.setHours(0,0,0,0);
  const totalDays = Math.ceil((examDate - today) / 86400000);

  if (totalDays < 1) return;

  // ── Show result panel ──
  plannerEmpty.hidden  = true;
  plannerResult.hidden = false;
  resultTitle.textContent = `${subject} — Study Plan`;
  resultMeta.textContent  = `${totalDays} days until exam · ${hoursPerDay} hrs/day · ${intensity} intensity`;

  // ── Summary cards ──
  const studyDays = prefWeekends
    ? totalDays - 1
    : Math.ceil((totalDays - 1) * 5 / 7);
  const totalHours = (studyDays * hoursPerDay).toFixed(0);
  const sessions   = topics.length * Math.ceil(totalDays / topics.length);

  resultSummary.innerHTML = [
    { icon: '📅', value: totalDays,   label: 'Days to Exam' },
    { icon: '⏱',  value: totalHours + 'h', label: 'Total Study Hours' },
    { icon: '📚', value: topics.length, label: 'Topics Covered' },
    { icon: '🎯', value: weakTopics.length || 0, label: 'Priority Topics' },
  ].map(c => `
    <div class="summary-card">
      <span class="summary-card__icon">${c.icon}</span>
      <div class="summary-card__value">${c.value}</div>
      <div class="summary-card__label">${c.label}</div>
    </div>
  `).join('');

  // ── Weak topic alert ──
  if (weakTopics.length) {
    weakAlert.hidden = false;
    weakAlertText.textContent =
      `You marked ${weakTopics.join(', ')} as weak/priority. ` +
      `IBM Granite AI has scheduled extra revision sessions for these topics ` +
      `and distributed them throughout your plan.`;
  } else {
    weakAlert.hidden = true;
  }

  // ── Build day-by-day schedule ──
  const days = buildDays({
    today, examDate, totalDays, topics, weakTopics,
    hoursPerDay, intensity, prefBreaks, prefRevision,
    prefMockExam, prefWeekends
  });

  renderTimetable(days);
  renderSchedule(topics, weakTopics, days, hoursPerDay);
  renderTopicBreakdown(topics, weakTopics, days);

  // Scroll to result
  plannerResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ─── Build days array ───────────────────────────────────── */
function buildDays({ today, examDate, totalDays, topics, weakTopics,
                     hoursPerDay, intensity, prefBreaks, prefRevision,
                     prefMockExam, prefWeekends }) {
  const INTENSITY_MULT = { relaxed: 0.7, moderate: 1, intensive: 1.3 };
  const mult = INTENSITY_MULT[intensity] || 1;
  const days = [];

  // Session duration in minutes
  const SESSION_MINS  = 50;
  const BREAK_MINS    = 10;
  const REVISION_MINS = 30;

  const totalTopics = topics.length;
  let topicIdx = 0;

  for (let d = 0; d < totalDays; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);

    const isExamDay = d === totalDays - 1;
    const isMockDay = prefMockExam && d === totalDays - 2 && totalDays > 3;
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isRest    = isWeekend && !prefWeekends && !isExamDay;
    const isToday   = d === 0;

    if (isExamDay) {
      days.push({ date, type: 'exam', sessions: [
        { time: 'All day', topic: '🎓 EXAM DAY', type: 'exam', color: '#da1e28' },
        { time: 'Before exam', topic: 'Light review only — no new material', type: 'break', color: '#6f6f6f' },
      ]});
      continue;
    }
    if (isRest) {
      days.push({ date, type: 'rest', sessions: [
        { time: 'Rest Day', topic: 'Weekend — take a break, rest and recharge 🛋', type: 'break', color: '#6f6f6f' },
      ]});
      continue;
    }
    if (isMockDay) {
      days.push({ date, type: 'mock', sessions: [
        { time: '09:00–11:00', topic: '📋 Mock Exam Simulation', type: 'mock', color: '#da1e28' },
        { time: '11:00–11:15', topic: 'Short break', type: 'break', color: '#6f6f6f' },
        { time: '11:15–12:00', topic: '📊 Review mock answers', type: 'revision', color: '#198038' },
      ]});
      continue;
    }

    // Normal study day
    const availMins = hoursPerDay * 60 * mult;
    const sessions  = [];
    let minutesSoFar = 0;
    const startHour = 9;

    // Pick topics for the day (distribute evenly)
    const topicsToday = [];
    const count = intensity === 'intensive' ? 3 : intensity === 'relaxed' ? 1 : 2;
    for (let i = 0; i < count && topicsToday.length < totalTopics; i++) {
      topicsToday.push(topics[topicIdx % totalTopics]);
      topicIdx++;
    }

    // Shuffle in weak topics more frequently
    if (weakTopics.length && d % 2 === 0) {
      const wt = weakTopics[d % weakTopics.length];
      if (!topicsToday.includes(wt)) topicsToday.unshift(wt);
    }

    topicsToday.forEach((topic, i) => {
      if (minutesSoFar >= availMins) return;
      const sTime = minutesToTime(startHour * 60 + minutesSoFar);
      minutesSoFar += SESSION_MINS;
      const eTime = minutesToTime(startHour * 60 + minutesSoFar);

      const isWeak  = weakTopics.includes(topic);
      const sType   = isWeak ? 'weak' : 'study';
      const sColor  = isWeak ? '#f1c21b' : '#0f62fe';

      sessions.push({
        time: `${sTime}–${eTime}`,
        topic: `${isWeak ? '⚠ ' : ''}${topic}`,
        type: sType, color: sColor,
      });

      // Pomodoro break
      if (prefBreaks && minutesSoFar < availMins) {
        const bStart = minutesToTime(startHour * 60 + minutesSoFar);
        minutesSoFar += BREAK_MINS;
        const bEnd = minutesToTime(startHour * 60 + minutesSoFar);
        sessions.push({ time: `${bStart}–${bEnd}`, topic: '☕ Pomodoro break', type: 'break', color: '#6f6f6f' });
      }
    });

    // Revision slot
    if (prefRevision && d % 3 === 2 && minutesSoFar + REVISION_MINS <= availMins) {
      const rStart = minutesToTime(startHour * 60 + minutesSoFar);
      minutesSoFar += REVISION_MINS;
      const rEnd = minutesToTime(startHour * 60 + minutesSoFar);
      sessions.push({ time: `${rStart}–${rEnd}`, topic: '🔁 Revision — previous topics', type: 'revision', color: '#198038' });
    }

    days.push({
      date,
      type: isToday ? 'today' : 'future',
      sessions,
      topics: topicsToday,
    });
  }
  return days;
}

/* ─── Render: Timetable ──────────────────────────────────── */
function renderTimetable(days) {
  const today = new Date(); today.setHours(0,0,0,0);

  timetablePanel.innerHTML = `<div class="timetable" id="timetableList"></div>`;
  const list = timetablePanel.querySelector('#timetableList');

  days.forEach((day, idx) => {
    const isToday = day.date.getTime() === today.getTime();
    const cardType = day.type === 'exam'  ? 'exam'
                   : day.type === 'rest'  ? 'rest'
                   : isToday             ? 'today'
                   : day.date < today    ? 'past'
                   : 'future';

    const badgeHtml = day.type === 'exam' ? `<span class="day-card__badge day-card__badge--exam">📋 EXAM</span>`
      : day.type === 'rest' ? `<span class="day-card__badge day-card__badge--rest">Rest</span>`
      : day.type === 'mock' ? `<span class="day-card__badge day-card__badge--revision">Mock</span>`
      : isToday ? `<span class="day-card__badge day-card__badge--today">Today</span>`
      : `<span class="day-card__badge day-card__badge--study">${day.sessions.filter(s=>s.type!=='break').length} sessions</span>`;

    const sessionsHtml = day.sessions.map(s => `
      <div class="session-row">
        <span class="session-row__time">${s.time}</span>
        <span class="session-row__dot" style="background:${s.color}"></span>
        <span class="session-row__topic">${escHtml(s.topic)}</span>
        <span class="session-row__type session-row__type--${s.type}">${capitalise(s.type)}</span>
      </div>
    `).join('');

    const card = document.createElement('div');
    card.className = `day-card day-card--${cardType}${isToday || idx===0 ? ' open' : ''}`;
    card.innerHTML = `
      <div class="day-card__header">
        <div class="day-card__date-wrap">
          <div class="day-card__date-circle">
            <span class="day-card__date-num">${day.date.getDate()}</span>
            <span class="day-card__date-mon">${day.date.toLocaleDateString('en',{month:'short'})}</span>
          </div>
          <div class="day-card__info">
            <div class="day-card__day-name">${day.date.toLocaleDateString('en',{weekday:'long'})}</div>
            <div class="day-card__meta">${day.date.toLocaleDateString('en',{day:'numeric',month:'long',year:'numeric'})}</div>
          </div>
        </div>
        <div class="day-card__badges">${badgeHtml}</div>
        <span class="day-card__chevron" aria-hidden="true">▼</span>
      </div>
      <div class="day-card__body">${sessionsHtml}</div>
    `;

    // Toggle open/close
    card.querySelector('.day-card__header').addEventListener('click', () => {
      card.classList.toggle('open');
    });

    list.appendChild(card);
  });
}

/* ─── Render: Revision schedule table ───────────────────── */
function renderSchedule(topics, weakTopics, days, hoursPerDay) {
  const studyDays = days.filter(d => d.type !== 'rest' && d.sessions.some(s => s.type !== 'break'));

  const rows = topics.map((topic, i) => {
    const isWeak    = weakTopics.includes(topic);
    const sessCount = studyDays.filter(d => d.topics?.includes(topic)).length;
    const hours     = (sessCount * 50 / 60).toFixed(1);
    const pct       = Math.min(100, Math.round((sessCount / Math.max(studyDays.length, 1)) * 100 * 3));
    const priority  = isWeak ? 'high' : i < topics.length / 3 ? 'medium' : 'low';

    return `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${escHtml(topic)}</strong>${isWeak ? ' <span class="weak-tag">⚠ Weak</span>' : ''}</td>
        <td>${sessCount} sessions</td>
        <td>${hours} hrs</td>
        <td>
          <div class="progress-cell">
            <div class="progress-bar-mini">
              <div class="progress-bar-mini__fill${isWeak ? ' progress-bar-mini__fill--weak' : ''}" style="width:${pct}%"></div>
            </div>
            <span class="progress-pct-label">${pct}%</span>
          </div>
        </td>
        <td><span class="priority-badge priority-badge--${priority}">${capitalise(priority)}</span></td>
      </tr>
    `;
  }).join('');

  schedulePanel.innerHTML = `
    <div class="schedule-table-wrap">
      <table class="schedule-table" aria-label="Revision schedule">
        <thead>
          <tr>
            <th>#</th>
            <th>Topic</th>
            <th>Sessions</th>
            <th>Hours</th>
            <th>Coverage</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

/* ─── Render: Topic breakdown ────────────────────────────── */
function renderTopicBreakdown(topics, weakTopics, days) {
  const studyDays = days.filter(d => d.sessions.some(s => s.type !== 'break'));

  const items = topics.map((topic, i) => {
    const isWeak    = weakTopics.includes(topic);
    const sessCount = studyDays.filter(d => d.topics?.includes(topic)).length;
    const hours     = (sessCount * 50 / 60).toFixed(1);
    const pct       = Math.min(100, Math.round((sessCount / Math.max(studyDays.length, 1)) * 100 * 3));

    return `
      <div class="topic-row${isWeak ? ' topic-row--weak' : ''}">
        <div class="topic-row__num">${i + 1}</div>
        <div class="topic-row__info">
          <div class="topic-row__name">${escHtml(topic)}</div>
          <div class="topic-row__meta">${sessCount} sessions &middot; ${hours} hrs allocated</div>
        </div>
        <div class="topic-row__right">
          ${isWeak ? '<span class="weak-tag">⚠ Priority</span>' : ''}
          <div class="progress-cell" style="min-width:120px">
            <div class="progress-bar-mini">
              <div class="progress-bar-mini__fill${isWeak ? ' progress-bar-mini__fill--weak' : ''}" style="width:${pct}%"></div>
            </div>
            <span class="progress-pct-label">${pct}%</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  topicsPanel.innerHTML = `<div class="topic-breakdown">${items}</div>`;
}

/* ─── Tabs ───────────────────────────────────────────────── */
document.querySelectorAll('.result-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.result-tab').forEach(t => {
      t.classList.remove('result-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('result-tab--active');
    tab.setAttribute('aria-selected', 'true');

    const target = tab.dataset.tab;
    [timetablePanel, schedulePanel, topicsPanel].forEach(p => p.hidden = true);
    document.getElementById(`panel-${target}`).hidden = false;
  });
});

/* ─── Print ──────────────────────────────────────────────── */
printBtn?.addEventListener('click', () => window.print());

/* ─── Export CSV ─────────────────────────────────────────── */
exportCsvBtn?.addEventListener('click', () => {
  const subject = subjectInput.value.trim() || 'Study Plan';
  const rows = [['Date', 'Day', 'Time', 'Topic', 'Type']];

  document.querySelectorAll('.day-card').forEach(card => {
    const dateStr = card.querySelector('.day-card__meta')?.textContent || '';
    const dayName = card.querySelector('.day-card__day-name')?.textContent || '';
    card.querySelectorAll('.session-row').forEach(row => {
      const time  = row.querySelector('.session-row__time')?.textContent || '';
      const topic = row.querySelector('.session-row__topic')?.textContent || '';
      const type  = row.querySelector('.session-row__type')?.textContent || '';
      rows.push([dateStr, dayName, time, topic, type]);
    });
  });

  const csv = rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${subject.replace(/\s+/g,'-')}-study-plan.csv`;
  a.click();
});

/* ─── Reset ──────────────────────────────────────────────── */
resetBtn?.addEventListener('click', () => {
  if (!confirm('Reset the form? Your plan will be cleared.')) return;
  plannerForm.reset();
  state.topics = [];
  state.weakTopics = [];
  renderTags(state.topics, topicTagsEl, false);
  renderTags(state.weakTopics, weakTagsEl, true);
  hoursVal.textContent = '3 hrs';
  updateRangeFill(hoursRange);
  plannerEmpty.hidden  = false;
  plannerResult.hidden = true;
  ['subjectErr','examDateErr','topicsErr'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('visible'); }
  });
  subjectInput.classList.remove('has-error');
  examDateInput.classList.remove('has-error');
});

/* ─── Scroll reveal ──────────────────────────────────────── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

/* ─── Helpers ────────────────────────────────────────────── */
function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
function capitalise(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}
function escHtml(str) {
  return String(str).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
