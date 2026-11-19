# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Krwanz/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Krwanz/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: the official list with a cited guide for every trophy, a checklist that remembers, a roadmap to the platinum, and the missable trophies flagged.

Entry for make.fun `gta6-trophy-guide-01`: build the best GTA 6 trophy guide.
$250 total, 1st place $50. Deadline 2026-11-21T11:00:00Z.

## What it is

- **Checklist** — all 55 official trophies (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden) with their official name, description and grade. Every trophy now carries a difficulty rating (1–5) and a time estimate of its own. Tick one off and it stays ticked (localStorage); export your progress to a file and import it back.
- **Guide pane** — every trophy has a guide in our own words: what to do, where and how, when it can be missed, with steps and the sources each fact comes from. 52 of the 55 guides are confirmed by the launch guides (PowerPyx, Push Square, GTABase); the 3 whose triggers are still unknown say so instead of inventing a method.
- **Roadmap to the platinum** — three stages with hour estimates, from PowerPyx: story first (60–80 hours, with the one possibly missable meditation in Chapter 1), then the 100% cleanup (about 100 hours), then the stranger strands and last one-offs (about 10 hours). About 200 hours in all, one playthrough.
- **Missables** — exactly 1 trophy flagged as possibly missable: Positive Mental Attitude, whose Chapter 1 balcony meditation is gone after Chapter 1. The first version of this guide flagged 13 story trophies as missable; the launch guides proved that wrong, and this version corrects it — plus a list of things that look missable but are not.
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, by difficulty, by search text, and hide-earned. There are no online trophies — all 55 unlock in single-player — and the online filter says so.
- **Spoiler setting** — hides the names and descriptions of all 28 hidden trophies (and the guide, and the next-up hint) until they are earned. The first version hid only the 18 story-kind trophies; this one hides the hidden list as PlayStation hides it.

## How honest it is

The game launched on 19 November 2026, and this version is built from the launch guides published that week:

- Names, descriptions and grades are the official list as PlayStation publishes them (via Exophase and PSNProfiles, which agree on all 55).
- A guide marked **“reported”** cites the named launch guide that confirms the method — PowerPyx's trophy guide and roadmap (18 Nov 2026), Push Square's guide, or GTABase.
- A guide marked **“unconfirmed”** (In The Beginning…, Bad Luck, I Guess, Ten Pin) states no method: PowerPyx lists those triggers as currently unknown.
- Difficulty (1–5) and time are this guide's own estimates per trophy, built from PowerPyx's roadmap. The set as a whole is 4/10 and about 200 hours (PowerPyx; Push Square says 250+).
- Counts with no cited source are **not stated** — the guide points at the in-game tracker instead of inventing a number. Cheats disable trophies and stop the game saving, so the guide warns against them on the platinum file.

An unofficial fan guide: no Rockstar Games logo, official artwork, box art or game screenshot anywhere — the look is its own.

## Run it

Static files under `app/` — no build step, no network at run time:

```sh
node serve.ts
# open http://localhost:8080
```

## Hand it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots are real renders of the app in headless Chromium (1280×800, seeded with 13 of 55 earned, zero page errors): `1-checklist.jpg` (checklist with The Shootist guide open, showing difficulty, time and sources), `2-roadmap.jpg` (roadmap, 3 stages with hour estimates), `3-missables.jpg` (the one possibly missable trophy and the save plan), `4-spoiler.jpg` (spoiler setting on, hidden trophies masked).
