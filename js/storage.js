const STORAGE_KEY = 'habit-tracker-v1';

const defaultData = () => ({
  habits: [],
  logs: {},
  monthlyStats: {}
});

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultData();
  } catch {
    return defaultData();
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getHabits() {
  return loadData().habits.map(migrateHabit);
}

// 구버전 습관(targetHistory 없는 것)을 마이그레이션
function migrateHabit(habit) {
  if (habit.targetHistory) return habit;
  return {
    ...habit,
    targetHistory: [{ from: '2000-01-01', target: habit.target, criteria: habit.criteria }]
  };
}

export function saveHabits(habits) {
  const data = loadData();
  saveData({ ...data, habits });
}

export function getLog(dateStr) {
  const data = loadData();
  const [year, month] = dateStr.split('-');
  const monthKey = `${year}-${month}`;
  return data.logs?.[monthKey]?.[dateStr] ?? {};
}

export function setLog(dateStr, habitId, checked) {
  const data = loadData();
  const [year, month] = dateStr.split('-');
  const monthKey = `${year}-${month}`;

  if (!data.logs[monthKey]) data.logs[monthKey] = {};
  if (!data.logs[monthKey][dateStr]) data.logs[monthKey][dateStr] = {};
  data.logs[monthKey][dateStr][habitId] = checked;

  saveData(data);
}
