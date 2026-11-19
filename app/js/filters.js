// Filters: kind, search text, grade, and the spoiler rule.
// The spoiler setting hides story trophies (the hidden ones) until they are earned.
export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return false;
  return trophy.kind === kind;
}

export function matchesSearch(trophy, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [trophy.name, trophy.description, trophy.guide, ...(trophy.tags ?? [])].join(' ').toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function matchesGrade(trophy, grade) {
  return grade === 'all' || trophy.grade === grade;
}

export function isSpoilerHidden(trophy, spoilerOn, earnedSet) {
  return spoilerOn && trophy.kind === 'story' && !earnedSet.has(trophy.name);
}

export function displayName(trophy, spoilerOn, earnedSet) {
  return isSpoilerHidden(trophy, spoilerOn, earnedSet) ? 'Hidden story trophy' : trophy.name;
}

export function displayDescription(trophy, spoilerOn, earnedSet) {
  return isSpoilerHidden(trophy, spoilerOn, earnedSet)
    ? 'Hidden until earned — tick it off or switch the spoiler setting off to reveal it.'
    : trophy.description;
}

export function applyFilters(trophies, { kind, query, grade, hideEarned, spoilerOn, earnedSet }) {
  return trophies.filter((t) => {
    if (kind === 'online') return false;
    if (!matchesKind(t, kind)) return false;
    if (!matchesGrade(t, grade)) return false;
    if (!matchesSearch(t, query)) return false;
    if (hideEarned && earnedSet.has(t.name)) return false;
    return true;
  });
}
