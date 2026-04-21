import { getHabits, saveHabits, getLog, setLog } from './storage.js';
import { renderAnimalSVG, rateToStage, getCurrentAnimal, ANIMAL_NAMES } from './animals.js';

// ── 목표 이력 조회 ─────────────────────────────────────
// dateStr 시점에 유효했던 target/criteria를 반환
function getTargetAt(habit, dateStr) {
  const history = habit.targetHistory ?? [];
  // from 오름차순 정렬 후, dateStr 이하인 마지막 항목
  const sorted = [...history].sort((a, b) => a.from.localeCompare(b.from));
  let active = sorted[0] ?? { target: habit.target, criteria: habit.criteria };
  for (const entry of sorted) {
    if (entry.from <= dateStr) active = entry;
    else break;
  }
  return active;
}

// 다음 주 월요일 날짜 반환
function nextMonday() {
  const d = new Date();
  const daysUntilMonday = ((8 - d.getDay()) % 7) || 7; // 오늘이 월요일이어도 다음 월요일
  d.setDate(d.getDate() + daysUntilMonday);
  return formatDate(d);
}

// target/criteria 변경은 다음 주 월요일부터 적용
function applyTargetChange(habit, newTarget, newCriteria) {
  const from = nextMonday();
  const history = habit.targetHistory ? [...habit.targetHistory] : [];
  const idx = history.findIndex(e => e.from === from);
  const entry = { from, target: newTarget, criteria: newCriteria };
  if (idx >= 0) history[idx] = entry;
  else history.push(entry);
  return { ...habit, target: newTarget, criteria: newCriteria, targetHistory: history };
}

// ── 날짜 유틸 ──────────────────────────────────────────
function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDate(d) {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

// ── 상태 ──────────────────────────────────────────────
let habits = getHabits();
const weekDates = getWeekDates();

// ── 테이블 렌더 ───────────────────────────────────────
function renderTable() {
  const tbody = document.getElementById('habit-tbody');
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

  habits.forEach(habit => {
    const tr = document.createElement('tr');

    // 이름 (+ 모바일용 목표 뱃지)
    const tdName = document.createElement('td');
    tdName.className = 'td-name';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.value = habit.name;
    nameInput.style.width = '100%';
    nameInput.addEventListener('change', () => {
      habit.name = nameInput.value.trim() || habit.name;
      saveHabits(habits);
    });
    tdName.appendChild(nameInput);
    // 모바일에서 목표/기준을 이름 아래 뱃지로 표시
    const badge = document.createElement('div');
    badge.className = 'mobile-target-badge';
    badge.textContent = `주 ${habit.target}회 ${habit.criteria}`;
    tdName.appendChild(badge);
    tr.appendChild(tdName);

    // 목표 + 기준 + 저장 (하나의 셀)
    const tdTarget = document.createElement('td');
    tdTarget.className = 'td-target';
    tdTarget.style.whiteSpace = 'nowrap';

    const targetInput = document.createElement('input');
    targetInput.type = 'number';
    targetInput.value = habit.target;
    targetInput.min = 1;
    targetInput.style.width = '32px';

    const sel = document.createElement('select');
    sel.style.width = '44px';
    ['이상', '이하'].forEach(opt => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      if (habit.criteria === opt) o.selected = true;
      sel.appendChild(o);
    });

    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-small target-save-btn';
    saveBtn.textContent = '저장';
    saveBtn.style.cssText = 'width:auto; padding:0 6px; font-size:9px;';
    saveBtn.title = '다음 주 월요일부터 적용됩니다';

    // 값이 바뀌면 저장 버튼 활성화
    const markDirty = () => {
      saveBtn.style.background = '#ffff80';
      saveBtn.textContent = '저장*';
    };
    targetInput.addEventListener('input', markDirty);
    sel.addEventListener('change', markDirty);

    saveBtn.addEventListener('click', () => {
      const newTarget = Math.max(1, parseInt(targetInput.value) || 1);
      const newCriteria = sel.value;
      const updated = applyTargetChange(habit, newTarget, newCriteria);
      Object.assign(habit, updated);
      saveHabits(habits);
      // 뱃지 업데이트
      badge.textContent = `주 ${newTarget}회 ${newCriteria} (다음주부터)`;
      saveBtn.style.background = '';
      saveBtn.textContent = '저장';
      updateStatusBar();
    });

    tdTarget.appendChild(targetInput);
    tdTarget.appendChild(sel);
    tdTarget.appendChild(saveBtn);
    tr.appendChild(tdTarget);

    // 기준 열은 colSpan으로 합쳤으므로 빈 td 추가 안 함

    // 요일 체크박스
    weekDates.forEach(date => {
      const dateStr = formatDate(date);
      const log = getLog(dateStr);
      const td = document.createElement('td');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'habit-check';
      cb.checked = !!log[habit.id];
      cb.addEventListener('change', () => {
        setLog(dateStr, habit.id, cb.checked);
        updateStatusBar();
      });
      td.appendChild(cb);
      tr.appendChild(td);
    });

    // 삭제 버튼
    const tdDel = document.createElement('td');
    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-small';
    delBtn.textContent = '✕';
    delBtn.title = '습관 삭제';
    delBtn.addEventListener('click', () => {
      if (confirm(`"${habit.name}" 습관을 삭제할까요?`)) {
        habits = habits.filter(h => h.id !== habit.id);
        saveHabits(habits);
        renderTable();
        updateStatusBar();
      }
    });
    tdDel.appendChild(delBtn);
    tr.appendChild(tdDel);

    tbody.appendChild(tr);
  });
}

function addHabit() {
  const today = formatDate(new Date());
  const newHabit = {
    id: crypto.randomUUID(),
    name: '새 습관',
    target: 1,
    criteria: '이상',
    targetHistory: [{ from: today, target: 1, criteria: '이상' }]
  };
  habits = [...habits, newHabit];
  saveHabits(habits);
  renderTable();
  const lastInput = document.querySelector('#habit-tbody tr:last-child td.td-name input');
  if (lastInput) { lastInput.focus(); lastInput.select(); }
}

// ── 달성률 ────────────────────────────────────────────
// 습관별 주간 체크 수를 집계하고, 목표 대비 달성 비율 평균을 반환
function calcWeeklyRate() {
  if (!habits.length) return 0;

  let totalScore = 0;
  habits.forEach(habit => {
    // 주 마지막날(일요일) 기준으로 그 주에 유효했던 target/criteria 사용
    const refDate = formatDate(weekDates[6]);
    const { target, criteria } = getTargetAt(habit, refDate);

    const weekChecks = weekDates.reduce((sum, date) => {
      const log = getLog(formatDate(date));
      return sum + (log[habit.id] ? 1 : 0);
    }, 0);

    if (criteria === '이하') {
      totalScore += weekChecks <= target ? 1 : target / weekChecks;
    } else {
      totalScore += Math.min(weekChecks / target, 1);
    }
  });

  return Math.round((totalScore / habits.length) * 100);
}

// 습관별 이번 주 달성도(0.0~1.0) 반환
function calcHabitRate(habit) {
  const refDate = formatDate(weekDates[6]);
  const { target, criteria } = getTargetAt(habit, refDate);
  const checks = weekDates.reduce((sum, date) => {
    return sum + (getLog(formatDate(date))[habit.id] ? 1 : 0);
  }, 0);
  if (criteria === '이하') return checks <= target ? 1 : target / checks;
  return Math.min(checks / target, 1);
}

function updateStatusBar() {
  const rate = calcWeeklyRate();
  const rateEl = document.getElementById('status-rate');
  const fill = document.getElementById('progress-fill');
  const countEl = document.getElementById('status-count');
  if (rateEl) rateEl.textContent = `${rate}%`;
  if (fill) fill.style.width = `${rate}%`;
  if (countEl) countEl.textContent = `습관 ${habits.length}개`;
  renderDashboard();
  renderAnimalPanel(rate);
}

// ── 대시보드 ──────────────────────────────────────────
function renderDashboard() {
  const list = document.getElementById('dashboard-list');
  const empty = document.getElementById('dashboard-empty');
  if (!list) return;

  while (list.firstChild) list.removeChild(list.firstChild);

  if (!habits.length) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  habits.forEach(habit => {
    const rate = calcHabitRate(habit);
    const pct = Math.round(rate * 100);
    const refDate = formatDate(weekDates[6]);
    const { target, criteria } = getTargetAt(habit, refDate);
    const checks = weekDates.reduce((sum, date) => {
      return sum + (getLog(formatDate(date))[habit.id] ? 1 : 0);
    }, 0);

    const row = document.createElement('div');
    row.style.cssText = 'display:flex; align-items:center; gap:6px;';

    const label = document.createElement('span');
    label.style.cssText = 'width:100px; font-size:10px; flex-shrink:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;';
    label.textContent = habit.name;
    label.title = habit.name;

    const barWrap = document.createElement('div');
    barWrap.style.cssText = 'flex:1; height:16px; box-shadow:inset 1px 1px #808080, inset -1px -1px #fff; background:white; overflow:hidden;';

    const barFill = document.createElement('div');
    barFill.style.cssText = `height:100%; width:${pct}%; background:${pct >= 100 ? '#008000' : '#000080'}; transition:width 0.3s;`;
    barWrap.appendChild(barFill);

    const pctLabel = document.createElement('span');
    pctLabel.style.cssText = 'font-size:10px; width:32px; text-align:right; flex-shrink:0;';
    pctLabel.textContent = `${pct}%`;

    const detail = document.createElement('span');
    detail.style.cssText = 'font-size:9px; color:#808080; width:48px; flex-shrink:0;';
    detail.textContent = `${checks}/${target}${criteria === '이하' ? '↓' : '↑'}`;

    row.appendChild(label);
    row.appendChild(barWrap);
    row.appendChild(pctLabel);
    row.appendChild(detail);
    list.appendChild(row);
  });
}

// ── 날짜 헤더 렌더 ────────────────────────────────────
function renderDateHeaders() {
  const headerRow = document.getElementById('date-header-row');
  const dayThs = headerRow.querySelectorAll('th.col-day');
  dayThs.forEach((th, i) => {
    const d = weekDates[i];
    while (th.firstChild) th.removeChild(th.firstChild);

    th.appendChild(document.createTextNode(DAY_LABELS[i]));
    const span = document.createElement('span');
    span.className = 'day-header-label';
    span.textContent = `${d.getMonth()+1}/${d.getDate()}`;
    th.appendChild(span);

    if (formatDate(d) === formatDate(new Date())) {
      th.style.color = '#000080';
      th.style.fontWeight = 'bold';
    }
  });
}

function renderTitleDate() {
  const el = document.getElementById('title-week-range');
  if (!el) return;
  const s = weekDates[0], e = weekDates[6];
  el.textContent = `${s.getFullYear()}년 ${s.getMonth()+1}월 ${s.getDate()}일 ~ ${e.getMonth()+1}월 ${e.getDate()}일`;
}

// ── 동물 패널 ──────────────────────────────────────
const STAGE_LABELS = ['', '윤곽선 (0-25%)', '25% 채색 (26-50%)', '75% 채색 (51-75%)', '풀컬러 ✦ (76-100%)'];

function renderAnimalPanel(rate) {
  const canvas = document.getElementById('animal-canvas');
  const nameEl = document.getElementById('animal-name');
  const stageEl = document.getElementById('animal-stage-label');
  const stagesEl = document.getElementById('animal-stages');
  if (!canvas) return;

  const animalKey = getCurrentAnimal();
  const stage = rateToStage(rate);

  canvas.innerHTML = renderAnimalSVG(animalKey, stage);
  nameEl.textContent = ANIMAL_NAMES[animalKey] ?? animalKey;
  stageEl.textContent = `달성률 ${rate}% · ${STAGE_LABELS[stage]}`;

  // 4단계 프리뷰 스팟
  while (stagesEl.firstChild) stagesEl.removeChild(stagesEl.firstChild);
  for (let s = 1; s <= 4; s++) {
    const wrap = document.createElement('div');
    wrap.style.cssText = `opacity:${stage >= s ? 1 : 0.3}; cursor:pointer; border:${stage === s ? '2px solid #A855F7' : '2px solid transparent'};`;
    wrap.title = STAGE_LABELS[s];
    wrap.innerHTML = renderAnimalSVG(animalKey, s);
    // SVG 크기 줄이기
    const svg = wrap.querySelector('svg');
    if (svg) { svg.setAttribute('width', '40'); svg.setAttribute('height', '40'); }
    stagesEl.appendChild(wrap);
  }
}

// ── 초기화 ────────────────────────────────────────────
function init() {
  document.getElementById('btn-add-habit').addEventListener('click', addHabit);
  renderDateHeaders();
  renderTitleDate();
  renderTable();
  updateStatusBar();
  renderDashboard();
}

document.addEventListener('DOMContentLoaded', init);
