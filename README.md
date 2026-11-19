# Leonida Legend — GTA VI Trophy Guide & Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Krwanz/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Krwanz/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze, 28 hidden), built for the [gta6-trophy-guide-01 bounty](https://make.fun/c/gta6-trophy-guide-01) on make.fun.

## What it is

- **Every trophy, official and complete.** Each of the 55 trophies is shown with its official name, description and grade as Exophase and PSNProfiles list them, plus its kind (story, collectibles, activities), a hidden flag, a difficulty and time estimate, its roadmap stage, and a guide written for this page.
- **A tracker that saves.** Tick trophies off and the progress stays in the browser (localStorage). Export it to a JSON file and import it back on any machine. A progress bar and per-kind counts show where you stand.
- **Filters and search.** Filter by kind (story, missable, collectibles, activities, online), by grade, or search by name, mission or keyword.
- **A spoiler setting.** Turn it on and story trophies stay masked — name, description and guide — until you earn them.
- **A roadmap to the platinum.** Six stages in the order to play them, each with its trophies and its progress, built from the official descriptions.
- **The missable, flagged.** Only one trophy is flagged as possibly missable by the guides that have checked: Positive Mental Attitude. The guide says why and what to do in Chapter 1.
- **Cited guides.** Every guide names its sources beside it — Exophase, PSNProfiles, GTABase, Push Square, Output Lag, KeenGamer and others — with links where the source is a page. Where a trigger is not pinned down yet, the guide says so instead of inventing one.

## The facts it is built on

- 55 trophies, all single-player: there are no online trophies and no GTA Online mode at launch.
- The platinum, **Vice Got a Price!**, takes about 200 hours (Output Lag; Insider Gaming), up to 300 hours or more (Push Square), with the story near 50 hours and a 4/10 difficulty (GTADB).
- The game has no mission replay, so the roadmap tells you to keep a manual save at the start of every chapter and one before the final mission.
- Counts are PlayStation's tracked targets as PSNProfiles lists them: 42 Shooting Range challenges, 14 drone race locations, 18 meditation spots, 100 WAiNK locations, 52 areas of Leonida, 250 stunts (397 in the game, per Push Square), 5 bank vaults, 9 gangs, 8 garages.

## Try it

```sh
node serve.ts
```

Then open http://localhost:8080. It works with the network off: every file it loads is a file under `app/`, and it makes no network request at run time.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Layout

- `app/index.html` — the page: hero, progress, controls, roadmap, missables, trophy list.
- `app/app.js` — boot: loads the data, renders the tracker and wires the controls.
- `app/js/store.js` — progress in localStorage, export and import.
- `app/js/filters.js` — kind, grade and search filters, and the spoiler rule.
- `app/js/roadmap.js` — the six roadmap stages and the missable list.
- `app/data/trophies.json` — the 55 trophies with their guides and sources.
- `app/style.css` — the dark neon Leonida look. Original art only: no Rockstar logo, official artwork, box art or game screenshots.
- `screenshots/` — four real renders of the app: the checklist, a trophy guide open, the roadmap, and the spoiler setting at work.

## License

MIT — see `LICENSE`.
