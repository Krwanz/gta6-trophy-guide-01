// Leonida Legend — entry program for gta6-trophy-guide-01 (Node 22, standard library only).
//
// The guide itself is app/: static files a browser opens at app/index.html, with no build step
// and no network at run time. The trophy list and every guide live in app/data/trophies.json,
// and screenshots/ holds real renders of the app in a browser, the first by name the cover.
//
// v2 check: before copying anything, this program reads app/data/trophies.json and refuses
// to hand in a guide that does not name all 55 official trophies with a guide each — a
// broken data file fails here, loudly, instead of passing the gate as an empty guide.
//
// This program is the handover: it copies app/ and screenshots/ from beside this file into
// the output directory and writes dossier.json there — the summary the judge reads (the
// screenshots, the first load's files and bytes, and the source outline) — using the vendored
// make.fun library. vendor/makefun-frontend.ts is the kit's copy and must stay untouched: the
// scorer rebuilds the dossier with its own copy and compares the two byte for byte.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader's container MAKEFUN_OUTPUT_DIR is unset and /output is used instead.

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// v2: the data file is the guide. Refuse a handover whose trophy file is broken.
const trophyData = JSON.parse(readFileSync(join(repoRoot, 'app', 'data', 'trophies.json'), 'utf8'));
const trophyList = Array.isArray(trophyData) ? trophyData : trophyData.trophies;
if (!Array.isArray(trophyList) || trophyList.length !== 55) {
  throw new Error(`trophies.json must name 55 trophies, found ${Array.isArray(trophyList) ? trophyList.length : 'none'}`);
}
for (const trophy of trophyList) {
  if (typeof trophy.name !== 'string' || !trophy.name.trim()) throw new Error('trophies.json holds a trophy with no name');
  if (typeof trophy.guide !== 'string' || !trophy.guide.trim()) throw new Error(`trophies.json: ${trophy.name} has no guide`);
  if (typeof trophy.difficulty !== 'number' || typeof trophy.time !== 'string') throw new Error(`trophies.json: ${trophy.name} is missing its difficulty or time estimate`);
}

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The gate's own caps, so a build that would fail the gate fails here first: at most 4
// screenshots of at most 256 KiB, app/ at most 993 files and directories and 48 MiB, and the
// dossier text at most 163840 bytes. Only text_max_bytes changes the dossier's bytes.
const dossierText = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outputDir, 'dossier.json'), dossierText);
console.log(`dossier written to ${join(outputDir, 'dossier.json')}`);
