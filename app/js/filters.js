// Filters: kind, search text, grade, difficulty, and the spoiler rule.
// The spoiler setting hides the hidden trophies (the 28 PlayStation hides until
// earned) until they are earned — not just the story ones.
export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return false;
  return trophy.kind === kind;
}

export function matchesSearch(trophy, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [trophy.name, trophy.description, trophy.guide, trophy.time ?? '', `difficulty ${trophy.difficulty ?? ''}`, ...(trophy.tags ?? [])].join(' ').toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function matchesGrade(trophy, grade) {
  return grade === 'all' || trophy.grade === grade;
}

export function matchesDifficulty(trophy, difficulty) {
  return difficulty === 'all' || String(trophy.difficulty ?? '') === difficulty;
}

export function isSpoilerHidden(trophy, spoilerOn, earnedSet) {
  return spoilerOn && trophy.hidden === true && !earnedSet.has(trophy.name);
}

export function displayName(trophy, spoilerOn, earnedSet) {
  return isSpoilerHidden(trophy, spoilerOn, earnedSet) ? 'Hidden trophy' : trophy.name;
}

export function displayDescription(trophy, spoilerOn, earnedSet) {
  return isSpoilerHidden(trophy, spoilerOn, earnedSet)
    ? 'Hidden until earned — tick it off or switch the spoiler setting off to reveal it.'
    : trophy.description;
}

export function applyFilters(trophies, { kind, query, grade, difficulty, hideEarned, spoilerOn, earnedSet }) {
  return trophies.filter((t) => {
    if (kind === 'online') return false;
    if (!matchesKind(t, kind)) return false;
    if (!matchesGrade(t, grade)) return false;
    if (!matchesDifficulty(t, difficulty)) return false;
    if (!matchesSearch(t, query)) return false;
    if (hideEarned && earnedSet.has(t.name)) return false;
    return true;
  });
}
