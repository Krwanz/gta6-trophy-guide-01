// Filtering, search and the spoiler rule for Leonida Legend.
// These are pure functions over the trophy list, so the tracker logic can be
// read and tested without the page around it.

export const KINDS = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

export const KIND_LABELS = {
  all: 'All',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

// A trophy's kind for the filter buttons. "missable" is a flag, not a kind:
// the Missable button shows every trophy whose missable flag is set.
export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return trophy.kind === 'online';
  return trophy.kind === kind;
}

export function matchesGrade(trophy, grade) {
  return grade === 'all' || trophy.grade === grade;
}

// Search across the name, the official description and the guide text.
export function matchesQuery(trophy, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [trophy.name, trophy.description, trophy.guide, trophy.kind]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

// Apply the whole filter state at once. Returns the trophies to show.
export function filterTrophies(trophies, state) {
  return trophies.filter(
    (trophy) =>
      matchesKind(trophy, state.kind) &&
      matchesGrade(trophy, state.grade) &&
      matchesQuery(trophy, state.query),
  );
}

// The spoiler rule: with spoilers hidden, a story trophy that has not been
// earned yet shows a mask instead of its name, description and guide.
// Hidden (PlayStation-hidden) non-story trophies are shown: the setting hides
// story spoilers, and the hidden badge already says a trophy is secret.
export function isSpoilerMasked(trophy, earned, spoilerOn) {
  return spoilerOn === true && trophy.kind === 'story' && !earned.has(trophy.id);
}

// Count earned trophies per kind for the progress line.
export function countByKind(trophies, earned) {
  const counts = { story: [0, 0], collectibles: [0, 0], activities: [0, 0], online: [0, 0] };
  for (const trophy of trophies) {
    const slot = counts[trophy.kind];
    if (!slot) continue;
    slot[1] += 1;
    if (earned.has(trophy.id)) slot[0] += 1;
  }
  return counts;
}
