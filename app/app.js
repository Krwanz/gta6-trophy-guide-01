// Leonida Legend boot: load the trophy list, render the tracker, the roadmap
// and the missables, and wire the controls. Progress is saved in localStorage
// and can be exported to a file and imported back.

import { loadEarned, saveEarned, downloadExport, parseImportDocument } from './js/store.js';
import { filterTrophies, isSpoilerMasked, countByKind } from './js/filters.js';
import { renderRoadmap, renderMissables } from './js/roadmap.js';

const listElement = document.getElementById('trophyList');
const emptyState = document.getElementById('emptyState');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressCounts = document.getElementById('progressCounts');
const searchInput = document.getElementById('searchInput');
const gradeFilter = document.getElementById('gradeFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const kindButtons = document.getElementById('kindButtons');

const state = { kind: 'all', grade: 'all', query: '', spoiler: false };
let trophies = [];
let sourceIndex = {};
let earned = loadEarned();

const response = await fetch('data/trophies.json');
const doc = await response.json();
trophies = doc.trophies;
sourceIndex = doc.sourceIndex ?? {};

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function sourceLinks(names) {
  const parts = [];
  for (const name of names) {
    const url = sourceIndex[name];
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.textContent = name;
      link.rel = 'noopener';
      parts.push(link);
    } else {
      parts.push(document.createTextNode(name));
    }
  }
  return parts;
}

// One trophy card: checkbox, official name, description and grade, kind and
// flag badges, difficulty and time, and the guide with its sources.
function buildTrophyCard(trophy) {
  const card = document.createElement('article');
  card.className = 'trophyCard';
  card.id = `trophy-${trophy.id}`;
  if (earned.has(trophy.id)) card.classList.add('isEarned');

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.className = 'earnedBox';
  box.checked = earned.has(trophy.id);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.id);
    else earned.delete(trophy.id);
    saveEarned(earned);
    renderAll();
  });
  card.append(box);

  const body = document.createElement('div');
  body.className = 'cardBody';
  card.append(body);

  const top = document.createElement('div');
  top.className = 'cardTop';
  body.append(top);

  const masked = isSpoilerMasked(trophy, earned, state.spoiler);
  // A masked trophy must not leak its name through the accessibility label.
  box.setAttribute('aria-label', `Earned: ${masked ? 'hidden story trophy' : trophy.name}`);
  const name = document.createElement('h3');
  name.className = 'trophyName';
  name.textContent = masked ? 'Hidden story trophy' : trophy.name;
  if (earned.has(trophy.id)) name.classList.add('isEarnedName');
  top.append(name);

  const grade = document.createElement('span');
  grade.className = `gradeBadge ${trophy.grade}`;
  grade.textContent = gradeLabel(trophy.grade);
  top.append(grade);

  const kind = document.createElement('span');
  kind.className = 'flagBadge kindFlag';
  kind.textContent = trophy.kind;
  top.append(kind);

  if (trophy.hidden) {
    const hidden = document.createElement('span');
    hidden.className = 'flagBadge hiddenFlag';
    hidden.textContent = 'Hidden on PSN';
    top.append(hidden);
  }
  if (trophy.missable) {
    const flag = document.createElement('span');
    flag.className = 'flagBadge missableFlag';
    flag.textContent = 'Possibly missable';
    top.append(flag);
  }

  const desc = document.createElement('p');
  desc.className = 'trophyDesc';
  desc.textContent = masked ? 'Earn it to reveal the name and description.' : trophy.description;
  body.append(desc);

  const meta = document.createElement('p');
  meta.className = 'trophyMeta';
  const target = trophy.count ? `Target: ${trophy.count} · ` : '';
  meta.textContent = `Stage ${trophy.stage} · ${target}Difficulty: ${trophy.difficulty} · Time: ${trophy.time}`;
  body.append(meta);

  const guideBox = document.createElement('div');
  guideBox.className = 'guideBox';
  body.append(guideBox);
  const guideHeading = document.createElement('h4');
  guideHeading.textContent = 'Guide';
  guideBox.append(guideHeading);
  const guideText = document.createElement('p');
  if (masked) {
    guideText.className = 'spoilerMasked';
    guideText.textContent = 'Guide hidden until this trophy is earned.';
  } else {
    guideText.textContent = trophy.guide;
  }
  guideBox.append(guideText);
  if (!masked && Array.isArray(trophy.sources) && trophy.sources.length > 0) {
    const sources = document.createElement('p');
    sources.className = 'guideSources';
    sources.append(document.createTextNode('Sources: '));
    const links = sourceLinks(trophy.sources);
    links.forEach((part, index) => {
      sources.append(part);
      if (index < links.length - 1) sources.append(document.createTextNode(' · '));
    });
    guideBox.append(sources);
  }

  return card;
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  progressFill.style.width = `${percent}%`;
  progressFill.parentElement.setAttribute('aria-valuenow', String(percent));
  progressText.textContent = `${done} of ${total} earned · ${percent}% — ${total - done} to go`;
  const counts = countByKind(trophies, earned);
  const order = ['story', 'collectibles', 'activities', 'online'];
  const labels = { story: 'Story', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };
  progressCounts.textContent = order
    .map((kind) => `${labels[kind]} ${counts[kind][0]}/${counts[kind][1]}`)
    .join(' · ');
}

function renderList() {
  const shown = filterTrophies(trophies, state);
  listElement.replaceChildren();
  for (const trophy of shown) listElement.append(buildTrophyCard(trophy));
  if (shown.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent =
      state.kind === 'online'
        ? 'No online trophies: all 55 trophies unlock in single player, and there is no GTA Online mode at launch.'
        : 'No trophies match these filters. Clear the search or pick another kind or grade.';
  } else {
    emptyState.hidden = true;
    emptyState.textContent = '';
  }
  document.getElementById('listHeading').textContent =
    state.kind === 'all' ? 'All 55 trophies' : `Trophies — ${state.kind}`;
}

function renderAll() {
  renderProgress();
  renderRoadmap(document.getElementById('roadmapList'), trophies, earned);
  renderMissables(document.getElementById('missableList'), trophies, earned);
  renderList();
}

kindButtons.addEventListener('click', (event) => {
  const button = event.target.closest('.kindBtn');
  if (!button) return;
  state.kind = button.dataset.kind;
  for (const other of kindButtons.querySelectorAll('.kindBtn')) {
    other.classList.toggle('isActive', other === button);
  }
  renderList();
});

gradeFilter.addEventListener('change', () => {
  state.grade = gradeFilter.value;
  renderList();
});

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  renderList();
});

spoilerToggle.addEventListener('change', () => {
  state.spoiler = spoilerToggle.checked;
  renderList();
});

document.getElementById('exportButton').addEventListener('click', () => {
  downloadExport(earned);
});

document.getElementById('importInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const { earned: imported, dropped } = parseImportDocument(
      await file.text(),
      new Set(trophies.map((trophy) => trophy.id)),
    );
    earned = imported;
    saveEarned(earned);
    renderAll();
    const note = dropped > 0 ? ` Imported ${earned.size} earned, ignored ${dropped} unknown.` : '';
    progressText.textContent += note;
  } catch {
    alert('That file is not a Leonida Legend progress file.');
  }
  event.target.value = '';
});

document.getElementById('resetButton').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies?')) return;
  earned = new Set();
  saveEarned(earned);
  renderAll();
});

// Deep links for sharing a view: #trophy-17 opens that trophy's card,
// #roadmap jumps to the roadmap, #spoiler turns the spoiler setting on.
function applyHash() {
  const hash = window.location.hash;
  if (hash === '#roadmap') {
    document.getElementById('roadmapSection').scrollIntoView();
    return;
  }
  if (hash === '#spoiler') {
    spoilerToggle.checked = true;
    state.spoiler = true;
    renderList();
    document.getElementById('controls').scrollIntoView();
    return;
  }
  const match = /^#trophy-(\d+)$/.exec(hash);
  if (!match) return;
  const card = document.getElementById(`trophy-${match[1]}`);
  if (!card) return;
  card.classList.add('isHighlighted');
  card.scrollIntoView({ block: 'center' });
}

window.addEventListener('hashchange', applyHash);
renderAll();
applyHash();
