// Roadmap stages and the missable reason, built from the launch guides.
// PowerPyx's roadmap has three steps: story (60-80 hours), the 100% checklist
// (about 100 hours), then strangers and cleanup (about 10 hours). Every trophy
// belongs to exactly one stage, and the order is the order to earn them in.
export const ROADMAP_STAGES = [
  {
    title: 'Story first — 60 to 80 hours, and the one missable',
    text: 'Play the five chapters through. The story trophies are all automatic and none of them can be missed — PowerPyx says so for every one — but do the Chapter 1 balcony meditation for Positive Mental Attitude before Chapter 1 ends: it is the only trophy that may be missable. Along the way, take optional missions as they appear (the 100% checklist wants any 100 of them), scan new vehicles with WAiNK (200 of 277 needed later) and study new animals through binoculars (100 of 255). Keep a save at the start and end of each chapter: there are 15 manual slots and no mission replay.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 48, 28],
  },
  {
    title: 'The 100% checklist — about 100 hours',
    text: 'After the story, open Progress > Stats > 100% Completion and work through what it shows. PowerPyx calls it lenient, closer to 60% true completion: 70 of 80 challenges, 15 of 18 meditations and 300 stunts, with everything required only for robberies, underwater discoveries, shooting ranges, drone races and Bret\u2019s quests. This is where A Long Road, the hardest trophy, is earned — and most of this stage\u2019s trophies pop on the way there.',
    trophyIds: [14, 15, 16, 17, 18, 19, 29, 30, 31, 32, 35, 36, 40, 42, 43, 52, 53, 54, 55],
  },
  {
    title: 'Strangers, contacts and cleanup — about 10 hours',
    text: 'Strangers & Freaks is not part of the 100% checklist, so the 8 stranger strands may still be open, along with the five contact questlines (Andy, Kenton, Billy, Randy, Tyrone) and the one-off moments — the plane from VCIA, the tank at Mile Zero, the blue Banshee, the UFO after 2AM. Finish whatever the checklist left, and the platinum follows. Three trophies are still unconfirmed at launch (In The Beginning…, Bad Luck, I Guess and Ten Pin): PowerPyx lists their triggers as currently unknown, so this guide does not pretend to know them.',
    trophyIds: [1, 20, 21, 22, 23, 24, 25, 26, 27, 33, 34, 37, 38, 39, 41, 44, 45, 46, 47, 49, 50, 51],
  },
];

export const MISSABLE_REASONS = {
  28: 'The Chapter 1 balcony meditation at Jason\u2019s house is gone after Chapter 1 — and it is still unclear whether the trophy needs it. Do it when it comes up.',
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
