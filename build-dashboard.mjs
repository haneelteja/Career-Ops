import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseApplications(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const apps = [];

  for (const line of content.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 8) continue;
    if (cols[0] === '#' || cols[0].startsWith('-')) continue;

    const [num, date, company, role, score, status, pdf, report, ...rest] = cols;
    const notes = rest.join(' | ');

    const scoreMatch = score.match(/(\d+\.?\d*)/);
    const scoreValue = scoreMatch ? parseFloat(scoreMatch[1]) : 0;

    const reportMatch = report.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const reportUrl = reportMatch ? reportMatch[2] : null;

    apps.push({
      num: parseInt(num) || 0,
      date,
      company,
      role,
      score: scoreValue,
      scoreRaw: score,
      status,
      hasPdf: pdf === '✅',
      reportUrl,
      notes,
    });
  }

  return apps.sort((a, b) => b.num - a.num);
}

function generateHTML(apps, buildDate) {
  const total = apps.length;
  const applied = apps.filter(a => a.status === 'Applied').length;
  const evaluated = apps.filter(a => a.status === 'Evaluated').length;
  const actionable = apps.filter(a => a.status === 'Evaluated' && a.score >= 4.0).length;
  const discarded = apps.filter(a => a.status === 'Discarded' || a.status === 'SKIP').length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Career-Ops — Haneel Teja Nalluru</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: #0f172a; color: #e2e8f0; font-family: system-ui, -apple-system, sans-serif; }
    .card { background: #1e293b; border: 1px solid #334155; }
    .score-high { color: #4ade80; }
    .score-mid  { color: #facc15; }
    .score-low  { color: #f97316; }
    .score-skip { color: #6b7280; }
    .badge-Applied    { background:#166534; color:#bbf7d0; }
    .badge-Evaluated  { background:#1e3a5f; color:#93c5fd; }
    .badge-Discarded  { background:#3f1515; color:#fca5a5; }
    .badge-SKIP       { background:#1f2937; color:#6b7280; }
    .badge-Interview  { background:#3b0764; color:#d8b4fe; }
    .badge-Offer      { background:#14532d; color:#86efac; }
    .badge-Responded  { background:#4a2300; color:#fdba74; }
    .badge-Rejected   { background:#3f1515; color:#fca5a5; }
    tr:hover td       { background: #1e293b; }
    input, select     { background:#1e293b; border:1px solid #334155; color:#e2e8f0; border-radius:0.5rem; padding:0.35rem 0.75rem; font-size:0.875rem; }
    input:focus, select:focus { outline:none; border-color:#60a5fa; }
    ::-webkit-scrollbar { width:6px; height:6px; }
    ::-webkit-scrollbar-track { background:#0f172a; }
    ::-webkit-scrollbar-thumb { background:#334155; border-radius:3px; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">
<div class="max-w-7xl mx-auto">

  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div>
      <h1 class="text-3xl font-bold text-white">Career-Ops</h1>
      <p class="text-slate-400 mt-1 text-sm">Haneel Teja Nalluru · Built ${buildDate}</p>
    </div>
    <div class="flex gap-3 flex-wrap">
      <div class="card rounded-xl px-5 py-3 text-center min-w-[80px]">
        <div class="text-2xl font-bold text-white">${total}</div>
        <div class="text-xs text-slate-400">Evaluated</div>
      </div>
      <div class="card rounded-xl px-5 py-3 text-center min-w-[80px]">
        <div class="text-2xl font-bold text-green-400">${applied}</div>
        <div class="text-xs text-slate-400">Applied</div>
      </div>
      <div class="card rounded-xl px-5 py-3 text-center min-w-[80px]">
        <div class="text-2xl font-bold text-blue-400">${evaluated}</div>
        <div class="text-xs text-slate-400">Pending</div>
      </div>
      <div class="card rounded-xl px-5 py-3 text-center min-w-[80px]">
        <div class="text-2xl font-bold text-yellow-400">${actionable}</div>
        <div class="text-xs text-slate-400">Act Now</div>
      </div>
      <div class="card rounded-xl px-5 py-3 text-center min-w-[80px]">
        <div class="text-2xl font-bold text-slate-500">${discarded}</div>
        <div class="text-xs text-slate-400">Closed</div>
      </div>
    </div>
  </div>

  <!-- Active Applications -->
  <section class="mb-8">
    <h2 class="text-base font-semibold text-slate-300 mb-3 flex items-center gap-2">
      <span class="text-green-400">●</span> Active Applications
    </h2>
    <div id="active-section"></div>
  </section>

  <!-- Actionable Now -->
  <section class="mb-8">
    <h2 class="text-base font-semibold text-slate-300 mb-3 flex items-center gap-2">
      <span class="text-yellow-400">●</span> Actionable Now
      <span class="text-slate-500 text-xs font-normal">(Score ≥ 4.0 · Not yet applied)</span>
    </h2>
    <div id="actionable-section"></div>
  </section>

  <!-- Full Pipeline Table -->
  <section>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
      <h2 class="text-base font-semibold text-slate-300 flex items-center gap-2">
        <span class="text-slate-400">●</span> Full Pipeline
      </h2>
      <div class="flex gap-2 flex-wrap">
        <input type="text" id="search" placeholder="Search company / role…" style="width:200px" />
        <select id="status-filter">
          <option value="">All Status</option>
          <option>Applied</option>
          <option>Evaluated</option>
          <option>Discarded</option>
          <option>SKIP</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Responded</option>
          <option>Rejected</option>
        </select>
        <select id="score-filter">
          <option value="">All Scores</option>
          <option value="4">≥ 4.0</option>
          <option value="3.5">≥ 3.5</option>
          <option value="3">≥ 3.0</option>
        </select>
      </div>
    </div>

    <div class="overflow-x-auto rounded-xl border border-slate-700">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <th class="px-3 py-3 text-left cursor-pointer select-none hover:text-white" onclick="sort('num')"># <span id="sort-num"></span></th>
            <th class="px-3 py-3 text-left cursor-pointer select-none hover:text-white" onclick="sort('date')">Date <span id="sort-date"></span></th>
            <th class="px-3 py-3 text-left">Company</th>
            <th class="px-3 py-3 text-left">Role</th>
            <th class="px-3 py-3 text-left cursor-pointer select-none hover:text-white" onclick="sort('score')">Score <span id="sort-score"></span></th>
            <th class="px-3 py-3 text-left cursor-pointer select-none hover:text-white" onclick="sort('status')">Status <span id="sort-status"></span></th>
            <th class="px-3 py-3 text-left text-slate-600 max-w-xs">Notes</th>
          </tr>
        </thead>
        <tbody id="pipeline-body"></tbody>
      </table>
    </div>
    <p id="row-count" class="text-slate-600 text-xs mt-2 pl-1"></p>
  </section>

</div>

<script>
const DATA = ${JSON.stringify(apps)};
let sortKey = 'num', sortAsc = false;

function scoreClass(s) {
  if (s >= 4.0) return 'score-high font-semibold';
  if (s >= 3.5) return 'score-mid';
  if (s >= 3.0) return 'score-low';
  return 'score-skip';
}

function badge(s) {
  const cls = 'badge-' + (s || 'SKIP').replace(/[^a-zA-Z]/g,'');
  return \`<span class="px-2 py-0.5 rounded text-xs font-medium \${cls}">\${s}</span>\`;
}

function renderActive() {
  const active = DATA.filter(a => a.status === 'Applied' || a.status === 'Interview' || a.status === 'Responded' || a.status === 'Offer');
  const el = document.getElementById('active-section');
  if (!active.length) { el.innerHTML = '<p class="text-slate-600 text-sm">No active applications yet.</p>'; return; }
  el.innerHTML = active.map(a => {
    const followUp = new Date(a.date); followUp.setDate(followUp.getDate() + 7);
    const today = new Date();
    const days = Math.ceil((followUp - today) / 86400000);
    const fuStr = followUp.toISOString().split('T')[0];
    const urgCls = days <= 0 ? 'text-red-400' : days <= 3 ? 'text-yellow-400' : 'text-green-400';
    const urgLabel = days <= 0 ? 'Follow-up overdue' : \`Follow-up in \${days}d\`;
    return \`<div class="card rounded-xl p-4 flex items-start justify-between gap-4 mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-white font-semibold">\${a.company}</span>
          <span class="text-slate-400 text-sm">\${a.role}</span>
          <span class="\${scoreClass(a.score)} text-sm">\${a.scoreRaw}</span>
          \${badge(a.status)}
        </div>
        <div class="text-slate-500 text-xs mt-1 truncate">Applied: \${a.date} · \${a.notes.substring(0,100)}\${a.notes.length>100?'…':''}</div>
      </div>
      <div class="text-right shrink-0">
        <div class="\${urgCls} text-sm font-medium">\${fuStr}</div>
        <div class="text-xs text-slate-500">\${urgLabel}</div>
      </div>
    </div>\`;
  }).join('');
}

function renderActionable() {
  const list = DATA.filter(a => a.status === 'Evaluated' && a.score >= 4.0).sort((a,b) => b.score - a.score);
  const el = document.getElementById('actionable-section');
  if (!list.length) { el.innerHTML = '<p class="text-slate-600 text-sm">All high-score roles applied or discarded — time to scan for new ones.</p>'; return; }
  el.innerHTML = list.map(a => \`
    <div class="card rounded-xl p-4 flex items-start justify-between gap-4 mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-slate-500 text-xs">#\${a.num}</span>
          <span class="text-white font-semibold">\${a.company}</span>
          <span class="text-slate-400 text-sm">\${a.role}</span>
        </div>
        <div class="text-slate-500 text-xs mt-1 truncate">\${a.notes.substring(0,120)}\${a.notes.length>120?'…':''}</div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <span class="\${scoreClass(a.score)} text-xl font-bold">\${a.scoreRaw}</span>
        \${badge(a.status)}
      </div>
    </div>
  \`).join('');
}

function filtered() {
  const q = document.getElementById('search').value.toLowerCase();
  const sf = document.getElementById('status-filter').value;
  const scf = parseFloat(document.getElementById('score-filter').value) || 0;
  return DATA
    .filter(a => {
      if (q && !a.company.toLowerCase().includes(q) && !a.role.toLowerCase().includes(q) && !a.notes.toLowerCase().includes(q)) return false;
      if (sf && a.status !== sf) return false;
      if (scf && a.score < scf) return false;
      return true;
    })
    .sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'score' || sortKey === 'num') return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
}

function sort(key) {
  if (sortKey === key) sortAsc = !sortAsc; else { sortKey = key; sortAsc = false; }
  ['num','date','score','status'].forEach(k => {
    const el = document.getElementById('sort-'+k);
    if (el) el.textContent = k === sortKey ? (sortAsc ? '↑' : '↓') : '';
  });
  renderTable();
}

function renderTable() {
  const rows = filtered();
  document.getElementById('pipeline-body').innerHTML = rows.map(a => \`
    <tr class="border-t border-slate-800/60">
      <td class="px-3 py-2.5 text-slate-600">\${a.num}</td>
      <td class="px-3 py-2.5 text-slate-400 whitespace-nowrap">\${a.date}</td>
      <td class="px-3 py-2.5 text-white font-medium whitespace-nowrap">\${a.company}</td>
      <td class="px-3 py-2.5 text-slate-300">\${a.role}</td>
      <td class="px-3 py-2.5 \${scoreClass(a.score)} whitespace-nowrap">\${a.scoreRaw}</td>
      <td class="px-3 py-2.5">\${badge(a.status)}</td>
      <td class="px-3 py-2.5 text-slate-500 text-xs max-w-xs truncate" title="\${a.notes.replace(/"/g,'&quot;')}">\${a.notes}</td>
    </tr>
  \`).join('');
  document.getElementById('row-count').textContent = \`\${rows.length} of \${DATA.length} roles\`;
}

document.getElementById('search').addEventListener('input', renderTable);
document.getElementById('status-filter').addEventListener('change', renderTable);
document.getElementById('score-filter').addEventListener('change', renderTable);

renderActive();
renderActionable();
renderTable();
</script>
</body>
</html>`;
}

const root = __dirname;
const apps = parseApplications(join(root, 'data', 'applications.md'));
const buildDate = new Date().toISOString().split('T')[0];
const html = generateHTML(apps, buildDate);

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs', 'index.html'), html, 'utf-8');

const applied = apps.filter(a => a.status === 'Applied').length;
const actionable = apps.filter(a => a.status === 'Evaluated' && a.score >= 4.0).length;
console.log(`✅ Dashboard built: docs/index.html`);
console.log(`   ${apps.length} total · ${applied} applied · ${actionable} actionable`);
