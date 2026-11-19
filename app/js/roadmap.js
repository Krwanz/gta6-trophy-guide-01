// The platinum roadmap for Leonida Legend: six stages in the order to play
// them, built from the official trophy descriptions, plus the missable list.
// Stage numbers match each trophy's "stage" in trophies.json.

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Story first — chapters 1 to 4 and the final mission',
    blurb:
      'Play the story through. Keep a manual save at the start of every chapter and one before the final mission: there is no mission replay. Meditate at Lucia\u2019s balcony spot in Chapter 1, it counts toward Positive Mental Attitude.',
  },
  {
    stage: 2,
    title: 'Side characters and strangers',
    blurb:
      'Finish the final mission for Andy, Kenton, Billy, Randy and Tyrone, and complete 8 Strangers & Freaks mission strands across Leonida. Sweep the map between chapters so no strand is left behind.',
  },
  {
    stage: 3,
    title: 'Activities and skill challenges',
    blurb:
      'Sample all 9 activity types, then work the long ones: gold in all 42 Shooting Range challenges, drone race wins at all 14 locations, 20 different race wins, the fishing challenge against Cal, an arcade game and bowling.',
  },
  {
    stage: 4,
    title: 'Collectibles and exploration',
    blurb:
      'Meditate at all 18 spots, finish 3 card sets, WAiNK It at 100 locations, discover 100 vehicles, explore all 52 areas, buy all 8 garages and register 10 vehicles in the Scooter Bros app. One long sweep of the map covers most of this stage.',
  },
  {
    stage: 5,
    title: 'Robberies, money and one-off moments',
    blurb:
      'Rob the jewelry store undetected, 5 bank vaults, an armored truck and one illegal operation per gang; launder $250,000 of Marked Bills and spend $100,000 across the shops. Do the wanted-level and airport moments while you are out robbing.',
  },
  {
    stage: 6,
    title: 'Cleanup to 100% and the platinum',
    blurb:
      'Land 250 stunts, finish 50 challenges, then follow the in-game 100% checklist until A Long Road pops. The platinum, Vice Got a Price!, follows with it.',
  },
];

// Render the six stages into the ordered list, with per-stage progress.
export function renderRoadmap(listElement, trophies, earned) {
  listElement.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const stageTrophies = trophies.filter((trophy) => trophy.stage === stage.stage);
    const done = stageTrophies.filter((trophy) => earned.has(trophy.id)).length;
    const item = document.createElement('li');
    item.className = 'stageCard';
    item.id = `roadmap-stage-${stage.stage}`;

    const heading = document.createElement('h3');
    const number = document.createElement('span');
    number.className = 'stageNum';
    number.textContent = `Stage ${stage.stage} — `;
    heading.append(number, document.createTextNode(stage.title));
    item.append(heading);

    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    item.append(blurb);

    const progress = document.createElement('p');
    progress.className = 'stageProgress';
    progress.textContent = `Stage ${stage.stage}: ${done} of ${stageTrophies.length} earned`;
    item.append(progress);

    const names = document.createElement('p');
    names.className = 'stageTrophies';
    names.textContent = stageTrophies.map((trophy) => trophy.name).join(' · ');
    item.append(names);

    listElement.append(item);
  }
}

// Render the missable trophies into their section: the flag, the guide and
// the reason it can be missed, in the trophy's own words.
export function renderMissables(container, trophies, earned) {
  container.replaceChildren();
  const missables = trophies.filter((trophy) => trophy.missable === true);
  if (missables.length === 0) {
    const note = document.createElement('p');
    note.className = 'missableNote';
    note.textContent = 'No trophy on this list is flagged missable.';
    container.append(note);
    return;
  }
  for (const trophy of missables) {
    const card = document.createElement('article');
    card.className = 'missableCard';

    const heading = document.createElement('h3');
    heading.textContent = `${trophy.name} — ${trophy.grade} · possibly missable`;
    card.append(heading);

    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    card.append(guide);

    const note = document.createElement('p');
    note.className = 'missableNote';
    note.textContent = earned.has(trophy.id)
      ? 'Earned — safe.'
      : 'Not earned yet: do it during Chapter 1, before the chapter ends.';
    card.append(note);

    container.append(card);
  }
}
