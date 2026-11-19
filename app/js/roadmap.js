// Roadmap stages and missable reasons, built from the official descriptions.
// Stage order is the order to earn them in; every trophy belongs to exactly one stage.
export const ROADMAP_STAGES = [
  {
    title: 'Story first — and save like you mean it',
    text: 'Play Chapters 1–4 and the finale, keeping a manual save at the start of every chapter and a separate save before the final mission. Reported guides say there is no mission replay, so these saves are the only way back.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 48],
  },
  {
    title: 'Contacts and strangers',
    text: 'Finish the five contact strands (Andy, Kenton, Billy, Randy, Tyrone), the 8 stranger strands across Leonida, and Bret’s unique-animal hunt. Pick strands up whenever their icons appear — do not save them all for the end.',
    trophyIds: [22, 23, 24, 26, 27, 25, 29],
  },
  {
    title: 'Collectibles and exploration',
    text: 'Sweep Leonida region by region: meditation spots, card sets, WAiNK locations, vehicles, every area of the map, garage properties and Scooter Bros registrations. One trip can feed three trophies at once.',
    trophyIds: [28, 30, 31, 35, 42, 54, 55],
  },
  {
    title: 'Activities and skill',
    text: 'The long middle: 250 stunts, all 9 activity types, 42 Shooting Range gold medals, drone races at all 14 locations, 20 race wins, 50 challenges, robberies, and the one-off moments — the cocktail on Ocean Beach, the showroom smash, the melee drive-by.',
    trophyIds: [15, 16, 17, 18, 19, 20, 21, 32, 33, 34, 36, 37, 38, 39, 40, 41, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53],
  },
  {
    title: 'Cleanup and 100% — the platinum',
    text: 'Open Progress > Stats > 100% Completion after the story and clear what it shows: all robberies, vaults, gang operations, underwater finds, shooting ranges, drone races and Target Decks, plus 70 of the 80 challenges. A Long Road pops at 100% — and the platinum with it.',
    trophyIds: [14, 1],
  },
];

export const MISSABLE_REASONS = {
  2: 'Opening mission — replay it only from a manual save.',
  3: 'Chapter 1 completion — no mission replay reported.',
  4: 'Chapter 2 completion — no mission replay reported.',
  5: 'Chapter 3 completion — no mission replay reported.',
  6: 'Chapter 4 completion — no mission replay reported.',
  7: 'The final mission — keep a dedicated save before it.',
  8: 'Story mission Breakfast Run — no mission replay reported.',
  9: 'Story mission The Cartel Heist — no mission replay reported.',
  10: 'Story mission Child’s Play — no mission replay reported.',
  11: 'Story mission Headliners — no mission replay reported.',
  12: 'Story mission VCIA Takedown — no mission replay reported.',
  13: 'Story mission Operation Savage Glory — no mission replay reported.',
  48: 'Choices made in the story — a choice cannot be unmade without a save.',
};

export function stageForTrophy(trophyId) {
  return ROADMAP_STAGES.findIndex((stage) => stage.trophyIds.includes(trophyId)) + 1;
}

export function nextUpTrophy(trophies, earnedSet) {
  for (const stage of ROADMAP_STAGES) {
    for (const id of stage.trophyIds) {
      const trophy = trophies.find((t) => t.id === id);
      if (trophy && !earnedSet.has(trophy.name)) return { trophy, stage: stage.title };
    }
  }
  return null;
}
