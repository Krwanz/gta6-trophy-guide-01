// Progress store for Leonida Legend: the earned set lives in localStorage only,
// and can be exported to a file and imported back. Nothing leaves the browser.

export const STORAGE_KEY = 'leonida-legend-earned-v1';
export const EXPORT_FILENAME = 'leonida-legend-progress.json';

// Read the earned trophy ids from localStorage. A corrupt value is ignored.
export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

// Persist the earned trophy ids.
export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

// Build the export document: the earned ids plus a label so an imported file
// can be recognised as one of ours.
export function buildExportDocument(earned) {
  return {
    app: 'Leonida Legend',
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
}

// Parse an imported file. Unknown ids are dropped, duplicates collapse.
// Returns { earned, dropped } so the caller can say what was ignored.
export function parseImportDocument(text, validIds) {
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('not a progress file');
  const earned = new Set();
  let dropped = 0;
  for (const id of list) {
    if (Number.isInteger(id) && validIds.has(id)) earned.add(id);
    else dropped += 1;
  }
  return { earned, dropped };
}

// Download the export document as a JSON file.
export function downloadExport(earned) {
  const blob = new Blob([JSON.stringify(buildExportDocument(earned), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = EXPORT_FILENAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
