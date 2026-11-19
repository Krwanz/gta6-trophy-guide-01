// Leonida Legend — boot and rendering for the GTA VI trophy guide and tracker.
import { loadProgress, saveProgress, loadSettings, saveSettings, exportProgressFile, parseProgressFile } from './js/store.js';
import { applyFilters, displayName, displayDescription, isSpoilerHidden } from './js/filters.js';
import { ROADMAP_STAGES, MISSABLE_REASONS, nextUpTrophy } from './js/roadmap.js';

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;
const sourceInfo = data.sources ?? {};

let earned = loadProgress();
const settings = loadSettings();
let selectedName = null;
let activeKind = 'all';
let activeTab = 'checklist';

const listEl = document.getElementById('trophyList');
const detailEmpty = document.getElementById('detailEmpty');
const detailCard = document.getElementById('detailCard');
const searchInput = document.getElementById('search');
const gradeFilter = document.getElementById('gradeFilter');
const hideEarnedBox = document.getElementById('hideEarned');
const spoilerBox = document.getElementById('spoilerToggle');
const filterNote = document.getElementById('filterNote');
const emptyState = document.getElementById('emptyState');
const onlineState = document.getElementById('onlineState');

spoilerBox.checked = settings.spoiler === true;

function gradeCounts() {
  const counts = { platinum: [0, 1], gold: [0, 2], silver: [0, 6], bronze: [0, 46] };
  for (const t of trophies) if (earned.has(t.name)) counts[t.grade][0] += 1;
  return counts;
}

function renderProgress() {
  const counts = gradeCounts();
  document.getElementById('earnedCount').textContent = String(earned.size);
  document.getElementById('progressFill').style.width = `${(earned.size / trophies.length) * 100}%`;
  document.getElementById('progressBar').setAttribute('aria-valuenow', String(earned.size));
  document.getElementById('gradeCounts').textContent =
    `Platinum ${counts.platinum[0]}/${counts.platinum[1]} · Gold ${counts.gold[0]}/${counts.gold[1]} · Silver ${counts.silver[0]}/${counts.silver[1]} · Bronze ${counts.bronze[0]}/${counts.bronze[1]}`;
  const next = nextUpTrophy(trophies, earned);
  document.getElementById('nextUp').textContent = next
    ? (spoilerBox.checked && next.trophy.kind === 'story'
      ? `Next up: a hidden story trophy — ${next.stage}.`
      : `Next up: ${next.trophy.name} — ${next.stage}.`)
    : 'All 55 earned — Vice Got a Price! is yours, Leonida Legend.';
}

function toggleEarned(name) {
  if (earned.has(name)) earned.delete(name);
  else earned.add(name);
  saveProgress(earned);
  renderProgress();
  renderList();
  renderDetail();
}

function openDetail(name) {
  selectedName = name;
  renderList();
  renderDetail();
  document.getElementById('detailPane').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderList() {
  const visible = applyFilters(trophies, {
    kind: activeKind,
    query: searchInput.value,
    grade: gradeFilter.value,
    hideEarned: hideEarnedBox.checked,
    spoilerOn: spoilerBox.checked,
    earnedSet: earned,
  });
  listEl.replaceChildren();
  emptyState.hidden = visible.length !== 0 || activeKind === 'online';
  onlineState.hidden = activeKind !== 'online';
  filterNote.textContent = activeKind === 'online'
    ? 'Online filter: there are no online trophies — all 55 unlock in single-player.'
    : `Showing ${visible.length} of 55 trophies${earned.size ? ` · ${earned.size} earned` : ''}. Tick a trophy to mark it earned — progress is saved in this browser.`;
  for (const trophy of visible) {
    const hidden = isSpoilerHidden(trophy, spoilerBox.checked, earned);
    const row = document.createElement('li');
    row.className = 'trophy-row' + (earned.has(trophy.name) ? ' earned' : '') + (selectedName === trophy.name ? ' selected' : '');
    row.addEventListener('click', (event) => {
      if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'BUTTON') openDetail(trophy.name);
    });
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('change', () => toggleEarned(trophy.name));
    const medal = document.createElement('span');
    medal.className = `medal ${trophy.grade}`;
    medal.title = trophy.grade;
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = displayName(trophy, spoilerBox.checked, earned);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(trophy, spoilerBox.checked, earned);
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    const gradeTag = document.createElement('span');
    gradeTag.className = `tag grade-${trophy.grade}`;
    gradeTag.textContent = trophy.grade;
    meta.append(gradeTag);
    if (trophy.missable) {
      const flag = document.createElement('span');
      flag.className = 'tag missable';
      flag.textContent = 'Missable';
      meta.append(flag);
    }
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = trophy.kind;
    meta.append(kindTag);
    body.append(name, desc, meta);
    const guideBtn = document.createElement('button');
    guideBtn.type = 'button';
    guideBtn.className = 'trophy-guide-btn';
    guideBtn.textContent = 'Guide';
    guideBtn.addEventListener('click', () => openDetail(trophy.name));
    row.append(box, medal, body, guideBtn);
    listEl.append(row);
  }
}

function renderDetail() {
  const trophy = trophies.find((t) => t.name === selectedName);
  if (!trophy) {
    detailEmpty.hidden = false;
    detailCard.hidden = true;
    return;
  }
  const hidden = isSpoilerHidden(trophy, spoilerBox.checked, earned);
  detailEmpty.hidden = true;
  detailCard.hidden = false;
  document.getElementById('detailMedal').className = `medal ${trophy.grade}`;
  document.getElementById('detailGrade').textContent = trophy.grade;
  document.getElementById('detailKind').textContent = `· ${trophy.kind}${trophy.missable ? ' · missable' : ''}`;
  document.getElementById('detailName').textContent = hidden ? 'Hidden story trophy' : trophy.name;
  document.getElementById('detailDesc').textContent = hidden
    ? 'Hidden until earned — the spoiler setting is on.'
    : trophy.description;
  document.getElementById('detailFlags').textContent = trophy.missable
    ? `⚠ Missable — ${MISSABLE_REASONS[trophy.id] ?? 'keep a manual save.'}`
    : '';
  document.getElementById('detailGuide').textContent = hidden
    ? 'The guide is hidden with the spoiler setting. Earn this trophy, or switch the spoiler setting off, to read it.'
    : trophy.guide;
  const steps = document.getElementById('detailSteps');
  steps.replaceChildren();
  if (!hidden) {
    for (const step of trophy.steps ?? []) {
      const li = document.createElement('li');
      li.textContent = step;
      steps.append(li);
    }
  }
  const sources = document.getElementById('detailSources');
  sources.replaceChildren();
  if (!hidden) {
    for (const code of trophy.sources ?? []) {
      const info = sourceInfo[code];
      if (!info) continue;
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = info.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = info.name;
      li.append(link);
      sources.append(li);
    }
  }
  document.getElementById('detailVerified').textContent = hidden
    ? ''
    : trophy.verified === 'reported'
      ? 'How this is checked: reported — the facts above cite the named guides beside them.'
      : 'How this is checked: from the official description — our own advice, not yet checked in the game.';
  const earnedBox = document.getElementById('detailEarned');
  earnedBox.checked = earned.has(trophy.name);
  earnedBox.onchange = () => toggleEarned(trophy.name);
}

function renderRoadmap() {
  const stagesEl = document.getElementById('roadmapStages');
  stagesEl.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = document.createElement('li');
    const title = document.createElement('h3');
    title.textContent = stage.title;
    const text = document.createElement('p');
    text.textContent = stage.text;
    const names = document.createElement('p');
    names.className = 'stage-trophies';
    const done = stage.trophyIds.filter((id) => earned.has(trophies.find((t) => t.id === id)?.name)).length;
    names.innerHTML = '';
    const count = document.createElement('span');
    count.className = 'stage-count';
    count.textContent = `${done}/${stage.trophyIds.length} earned — `;
    names.append(count);
    names.append(stage.trophyIds.map((id) => trophies.find((t) => t.id === id)?.name).join(' · '));
    li.append(title, text, names);
    stagesEl.append(li);
  }
}

function renderMissables() {
  const missable = trophies.filter((t) => t.missable);
  document.getElementById('missableCount').textContent = String(missable.length);
  const listEl2 = document.getElementById('missableList');
  listEl2.replaceChildren();
  for (const trophy of missable) {
    const li = document.createElement('li');
    const name = document.createElement('strong');
    name.textContent = `${trophy.name} — ${trophy.grade}`;
    const why = document.createElement('div');
    why.className = 'why';
    why.textContent = `${trophy.description} ${MISSABLE_REASONS[trophy.id] ?? ''}`;
    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'trophy-guide-btn';
    open.textContent = 'Open guide';
    open.addEventListener('click', () => {
      switchTab('checklist');
      openDetail(trophy.name);
    });
    li.append(name, why, open);
    listEl2.append(li);
  }
}

function renderSources() {
  const list = document.getElementById('sourceList');
  list.replaceChildren();
  for (const info of Object.values(sourceInfo)) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = info.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = info.name;
    li.append(link);
    list.append(li);
  }
}

function switchTab(tab) {
  activeTab = tab;
  for (const button of document.querySelectorAll('.tab')) {
    button.classList.toggle('active', button.dataset.tab === tab);
  }
  for (const panel of document.querySelectorAll('.panel')) {
    panel.classList.toggle('active', panel.id === `panel-${tab}`);
  }
  if (tab === 'roadmap') renderRoadmap();
  if (tab === 'missables') renderMissables();
}

for (const button of document.querySelectorAll('.tab')) {
  button.addEventListener('click', () => switchTab(button.dataset.tab));
}
for (const chip of document.querySelectorAll('.chip')) {
  chip.addEventListener('click', () => {
    activeKind = chip.dataset.kind;
    for (const other of document.querySelectorAll('.chip')) other.classList.toggle('active', other === chip);
    renderList();
  });
}
searchInput.addEventListener('input', renderList);
gradeFilter.addEventListener('change', renderList);
hideEarnedBox.addEventListener('change', renderList);
spoilerBox.addEventListener('change', () => {
  saveSettings({ ...settings, spoiler: spoilerBox.checked });
  renderProgress();
  renderList();
  renderDetail();
});
document.getElementById('exportBtn').addEventListener('click', () => exportProgressFile(earned));
document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    earned = parseProgressFile(await file.text());
    saveProgress(earned);
    renderProgress();
    renderList();
    renderDetail();
  } catch (error) {
    alert(`Could not import that file: ${error.message}`);
  }
  event.target.value = '';
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  earned = new Set();
  saveProgress(earned);
  renderProgress();
  renderList();
  renderDetail();
});

renderProgress();
renderList();
renderRoadmap();
renderMissables();
renderSources();
