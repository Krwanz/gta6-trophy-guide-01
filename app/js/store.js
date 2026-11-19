// Progress store: the earned set lives in localStorage and moves as a JSON file.
// The keys stay at v1 so a reader's saved ticks survive the v2 update; the
// exported file carries format v2 and the app version, and v1 files still import.
export const PROGRESS_KEY = 'leonida-legend-progress-v1';
export const SETTINGS_KEY = 'leonida-legend-settings-v1';
export const PROGRESS_FORMAT = 'leonida-legend-progress-v2';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveProgress(earnedSet) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earnedSet]));
}

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportProgressFile(earnedSet) {
  const payload = JSON.stringify({ format: PROGRESS_FORMAT, game: 'Grand Theft Auto VI', exportedAt: new Date().toISOString(), earned: [...earnedSet].sort() }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}

export function parseProgressFile(text) {
  const parsed = JSON.parse(text);
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('Not a progress file: expected a list of trophy names.');
  return new Set(names.filter((n) => typeof n === 'string'));
}
