# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Krwanz/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Krwanz/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI: the official list with a cited guide for every trophy, a checklist that remembers, a roadmap to the platinum, and the missable trophies flagged.

Entry for make.fun `gta6-trophy-guide-01`: build the best GTA 6 trophy guide.
$250 total, 1st place $50. Deadline 2026-11-21T11:00:00Z.

## What it is

- **Checklist** — all 55 official trophies (1 platinum, 2 gold, 6 silver, 46 bronze) with their official name, description and grade. Tick one off and it stays ticked (localStorage); export your progress to a file and import it back.
- **Guide pane** — every trophy has a guide in our own words: what to do, where and how, when it can be missed, with steps and the sources each fact comes from.
- **Roadmap to the platinum** — five stages in order: story first (with a save plan), contacts and strangers, collectibles and exploration, activities and skill, then the 100% cleanup that ends with A Long Road and the platinum.
- **Missables** — 13 trophies flagged, built from the official descriptions: the chapter and mission trophies plus the choices trophy, with a four-step manual-save plan (reported guides say there is no mission replay).
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, by search text, and hide-earned. There are no online trophies — all 55 unlock in single-player — and the online filter says so.
- **Spoiler setting** — hides the names and descriptions of story trophies (and the guide, and the next-up hint) until they are earned.

## How honest it is

The game launched the day this guide was built, so the guide says plainly how far each fact is checked:

- Names, descriptions and grades are the official list as PlayStation publishes them (via Exophase and PSNProfiles, which agree on all 55).
- A guide marked **“from the official description”** is our own reading of that description, not yet checked in the game.
- A guide marked **“reported”** cites the named guide that reports the fact — for example the 42 Shooting Range gold medals (Push Square) or the 100% checklist (GTABase).
- Counts with no cited source are **not stated** — the guide points at the in-game tracker instead of inventing a number. Hidden trophies whose descriptions are jokes or riddles say so, and say their exact trigger is still unconfirmed.

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

Screenshots are real renders of the app in headless Chromium (1280×800, seeded with 13 of 55 earned, zero page errors): `1-checklist.jpg` (checklist with The Shootist guide open), `2-roadmap.jpg` (roadmap), `3-missables.jpg` (missables and the save plan), `4-spoiler.jpg` (spoiler setting on).
