import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse applications.md table
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
    const reportMatch = report.match(/\[([^\]]+)\]\(([^)]+)\)/);
    apps.push({
      num: parseInt(num) || 0,
      date,
      company,
      role,
      score: scoreMatch ? parseFloat(scoreMatch[1]) : 0,
      scoreRaw: score,
      status,
      hasPdf: pdf === '✅',
      reportFile: reportMatch ? reportMatch[2] : null,
      notes,
      url: null,
      keyPoints: [],
      atsKeywords: '',
    });
  }
  return apps.sort((a, b) => b.num - a.num);
}

// Parse pipeline.md to extract num -> url mapping
function parsePipelineUrls(filePath) {
  if (!existsSync(filePath)) return {};
  const content = readFileSync(filePath, 'utf-8');
  const map = {};
  for (const line of content.split('\n')) {
    if (!line.includes('|')) continue;
    const m = line.match(/https?:\/\/[^\s|]+/);
    const numM = line.match(/\|\s*0*(\d+)\s*\|/);
    if (m && numM) map[parseInt(numM[1])] = m[0].trim();
  }
  return map;
}

// Extract URL and key points from a report file
function parseReport(filePath) {
  if (!existsSync(filePath)) return { url: null, keyPoints: [], atsKeywords: '' };
  const content = readFileSync(filePath, 'utf-8');

  // URL
  const urlM = content.match(/\*\*URL:\*\*\s*(https?:\/\/[^\s\n]+)/);
  const url = urlM ? urlM[1].trim() : null;

  // ATS Keywords (Block E newer format)
  const atsM = content.match(/\*\*ATS Keywords[^:]*:\*\*\s*([^\n]+)/i);
  const atsKeywords = atsM ? atsM[1].trim() : '';

  // Key Talking Points (older format: ## Key Talking Points)
  const ktp = [];
  const ktpM = content.match(/## Key Talking Points\n([\s\S]*?)(?=\n##|$)/);
  if (ktpM) {
    for (const line of ktpM[1].split('\n')) {
      const pt = line.replace(/^[-*]\s*/, '').trim();
      if (pt) ktp.push(pt);
    }
  }

  // CV Emphasis bullets (Block E newer format)
  if (!ktp.length) {
    const cvM = content.match(/\*\*CV Emphasis:\*\*\n([\s\S]*?)(?=\n\*\*|\n##|$)/);
    if (cvM) {
      for (const line of cvM[1].split('\n')) {
        const pt = line.replace(/^[-*]\s*/, '').trim();
        if (pt) ktp.push(pt);
      }
    }
  }

  return { url, keyPoints: ktp.slice(0, 4), atsKeywords };
}

// Enrich applications with URLs and key points from pipeline + reports
function enrichApplications(apps, root) {
  const pipelineUrls = parsePipelineUrls(join(root, 'data', 'pipeline.md'));
  const reportsDir = join(root, 'reports');

  for (const app of apps) {
    // Try pipeline.md url first
    if (pipelineUrls[app.num]) app.url = pipelineUrls[app.num];

    // Try report file
    if (app.reportFile) {
      const reportPath = join(root, app.reportFile);
      const { url, keyPoints, atsKeywords } = parseReport(reportPath);
      if (!app.url && url) app.url = url;
      app.keyPoints = keyPoints;
      app.atsKeywords = atsKeywords;
    }

    // Fallback: scan reports directory by num prefix
    if (!app.url && existsSync(reportsDir)) {
      const padded = String(app.num).padStart(3, '0');
      const match = readdirSync(reportsDir).find(f => f.startsWith(padded + '-'));
      if (match) {
        const { url, keyPoints, atsKeywords } = parseReport(join(reportsDir, match));
        if (url) app.url = url;
        if (!app.keyPoints.length) app.keyPoints = keyPoints;
        if (!app.atsKeywords) app.atsKeywords = atsKeywords;
      }
    }
  }
  return apps;
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
    tr:hover td { background: #1e293b; }
    input, select { background:#1e293b; border:1px solid #334155; color:#e2e8f0; border-radius:0.5rem; padding:0.35rem 0.75rem; font-size:0.875rem; }
    input:focus, select:focus { outline:none; border-color:#60a5fa; }
    .answer-panel { display:none; }
    .answer-panel.open { display:block; }
    ::-webkit-scrollbar { width:6px; height:6px; }
    ::-webkit-scrollbar-track { background:#0f172a; }
    ::-webkit-scrollbar-thumb { background:#334155; border-radius:3px; }
    .copy-btn:active { transform:scale(0.95); }
    .toast { position:fixed; bottom:1.5rem; right:1.5rem; background:#1e293b; border:1px solid #4ade80; color:#4ade80; padding:0.6rem 1.2rem; border-radius:0.5rem; font-size:0.85rem; opacity:0; transition:opacity 0.2s; pointer-events:none; z-index:999; }
    .toast.show { opacity:1; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8">
<div class="max-w-7xl mx-auto">
  <div id="toast" class="toast">Copied to clipboard!</div>

  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
    <div>
      <h1 class="text-3xl font-bold text-white">Career-Ops</h1>
      <p class="text-slate-400 mt-1 text-sm">Haneel Teja Nalluru · Built ${buildDate}</p>
    </div>
    <div class="flex gap-3 flex-wrap">
      <div class="card rounded-xl px-5 py-3 text-center min-w-[72px]">
        <div class="text-2xl font-bold text-white">${total}</div>
        <div class="text-xs text-slate-400">Total</div>
      </div>
      <div class="card rounded-xl px-5 py-3 text-center min-w-[72px]">
        <div class="text-2xl font-bold text-green-400">${applied}</div>
        <div class="text-xs text-slate-400">Applied</div>
      </div>
      <div class="card rounded-xl px-5 py-3 text-center min-w-[72px]">
        <div class="text-2xl font-bold text-blue-400">${evaluated}</div>
        <div class="text-xs text-slate-400">Pending</div>
      </div>
      <div class="card rounded-xl px-5 py-3 text-center min-w-[72px]">
        <div class="text-2xl font-bold text-yellow-400">${actionable}</div>
        <div class="text-xs text-slate-400">Act Now</div>
      </div>
      <div class="card rounded-xl px-5 py-3 text-center min-w-[72px]">
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
    <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
      <h2 class="text-base font-semibold text-slate-300 flex items-center gap-2">
        <span class="text-yellow-400">●</span> Actionable Now
        <span class="text-slate-500 text-xs font-normal">(Score ≥ 4.0 · Not yet applied)</span>
      </h2>
      <button onclick="openAllActionable()" class="text-sm bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-1.5 rounded-lg transition-colors">
        Open All in Tabs →
      </button>
    </div>
    <p class="text-slate-600 text-xs mb-3">Click each card to see your pre-loaded answer pack. Open a job tab, paste answers, submit.</p>
    <div id="actionable-section"></div>
  </section>

  <!-- Full Pipeline Table -->
  <section>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
      <h2 class="text-base font-semibold text-slate-300 flex items-center gap-2">
        <span class="text-slate-400">●</span> Full Pipeline
      </h2>
      <div class="flex gap-2 flex-wrap">
        <input type="text" id="search" placeholder="Search…" style="width:180px" />
        <select id="status-filter">
          <option value="">All Status</option>
          <option>Applied</option>
          <option>Evaluated</option>
          <option>Discarded</option>
          <option>SKIP</option>
          <option>Interview</option>
          <option>Offer</option>
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
            <th class="px-3 py-3 text-left">Apply</th>
            <th class="px-3 py-3 text-left text-slate-600">Notes</th>
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
  const key = (s || 'SKIP').replace(/[^a-zA-Z]/g, '');
  return \`<span class="px-2 py-0.5 rounded text-xs font-medium badge-\${key}">\${s}</span>\`;
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(showToast);
}

function answerPack(a) {
  const lines = [
    \`=== APPLICATION PACK: \${a.company} — \${a.role} ===\`,
    \`Score: \${a.scoreRaw}  |  Date: \${a.date}\`,
    \`URL: \${a.url || 'Check pipeline.md'}\`,
    '',
    '--- KEY SELLING POINTS ---',
    ...a.keyPoints.map(p => '• ' + p),
    '',
  ];
  if (a.atsKeywords) {
    lines.push('--- ATS KEYWORDS TO USE ---');
    lines.push(a.atsKeywords);
    lines.push('');
  }
  lines.push('--- NOTES ---');
  lines.push(a.notes);
  lines.push('');
  lines.push('--- STANDARD FIELDS ---');
  lines.push('Name: Haneel Teja Nalluru');
  lines.push('Email: nalluruhaneel@gmail.com');
  lines.push('Current Role: Senior Business Architect');
  lines.push('Experience: 7+ years');
  lines.push('Key certs: PEGA CPBA, PEGA CSSA, PMP, CSM');
  lines.push('Expected CTC: Open to discussion');
  return lines.join('\\n');
}

function openAllActionable() {
  const list = DATA.filter(a => a.status === 'Evaluated' && a.score >= 4.0 && a.url);
  if (!list.length) { alert('No actionable roles with URLs found.'); return; }
  list.forEach(a => window.open(a.url, '_blank'));
}

function togglePanel(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}

function renderActive() {
  const active = DATA.filter(a => ['Applied','Interview','Responded','Offer'].includes(a.status));
  const el = document.getElementById('active-section');
  if (!active.length) { el.innerHTML = '<p class="text-slate-600 text-sm">No active applications yet.</p>'; return; }
  el.innerHTML = active.map(a => {
    const fu = new Date(a.date); fu.setDate(fu.getDate() + 7);
    const days = Math.ceil((fu - new Date()) / 86400000);
    const fuStr = fu.toISOString().split('T')[0];
    const urgCls = days <= 0 ? 'text-red-400' : days <= 3 ? 'text-yellow-400' : 'text-green-400';
    const urgLabel = days <= 0 ? 'Overdue' : days + 'd away';
    const openBtn = a.url ? \`<a href="\${a.url}" target="_blank" class="text-xs text-blue-400 hover:text-blue-300 underline">View posting →</a>\` : '';
    return \`<div class="card rounded-xl p-4 flex items-start justify-between gap-4 mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-white font-semibold">\${a.company}</span>
          <span class="text-slate-400 text-sm">\${a.role}</span>
          <span class="\${scoreClass(a.score)} text-sm">\${a.scoreRaw}</span>
          \${badge(a.status)}
          \${openBtn}
        </div>
        <div class="text-slate-500 text-xs mt-1">\${a.notes.substring(0,120)}\${a.notes.length>120?'…':''}</div>
      </div>
      <div class="text-right shrink-0">
        <div class="\${urgCls} text-sm font-medium">\${fuStr}</div>
        <div class="text-xs text-slate-500">Follow-up \${urgLabel}</div>
      </div>
    </div>\`;
  }).join('');
}

function renderActionable() {
  const list = DATA.filter(a => a.status === 'Evaluated' && a.score >= 4.0).sort((a,b) => b.score - a.score);
  const el = document.getElementById('actionable-section');
  if (!list.length) { el.innerHTML = '<p class="text-slate-600 text-sm">All high-score roles applied or discarded.</p>'; return; }
  el.innerHTML = list.map((a, i) => {
    const panelId = 'panel-' + a.num;
    const hasPoints = a.keyPoints.length > 0;
    const openBtn = a.url
      ? \`<a href="\${a.url}" target="_blank" class="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap">Open job →</a>\`
      : \`<span class="text-xs text-slate-600 px-3 py-1">No URL</span>\`;
    const copyBtn = \`<button onclick="copyText(answerPack(DATA.find(x=>x.num===\${a.num})))" class="copy-btn text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap">Copy answers</button>\`;
    const toggleBtn = hasPoints || a.atsKeywords
      ? \`<button onclick="togglePanel('\${panelId}')" class="text-xs text-slate-400 hover:text-white px-2 py-1 rounded transition-colors">Details ▾</button>\`
      : '';
    return \`<div class="card rounded-xl p-4 mb-3">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-slate-500 text-xs">#\${a.num}</span>
            <span class="text-white font-semibold">\${a.company}</span>
            <span class="text-slate-400 text-sm">\${a.role}</span>
          </div>
          <div class="text-slate-500 text-xs mt-1">\${a.notes.substring(0,120)}\${a.notes.length>120?'…':''}</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <span class="\${scoreClass(a.score)} text-xl font-bold">\${a.scoreRaw}</span>
          \${openBtn}
          \${copyBtn}
          \${toggleBtn}
        </div>
      </div>
      <div id="\${panelId}" class="answer-panel mt-3 pt-3 border-t border-slate-700">
        \${hasPoints ? \`<div class="mb-2"><div class="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">Key Selling Points</div><ul class="text-sm text-slate-300 space-y-1">\${a.keyPoints.map(p=>\`<li class="flex gap-2"><span class="text-yellow-400 mt-0.5">›</span><span>\${p}</span></li>\`).join('')}</ul></div>\` : ''}
        \${a.atsKeywords ? \`<div class="mt-2"><div class="text-xs text-slate-400 font-semibold mb-1 uppercase tracking-wider">ATS Keywords</div><div class="text-xs text-slate-400 bg-slate-800 rounded p-2">\${a.atsKeywords}</div></div>\` : ''}
      </div>
    </div>\`;
  }).join('');
}

function filtered() {
  const q = document.getElementById('search').value.toLowerCase();
  const sf = document.getElementById('status-filter').value;
  const scf = parseFloat(document.getElementById('score-filter').value) || 0;
  return DATA.filter(a => {
    if (q && !a.company.toLowerCase().includes(q) && !a.role.toLowerCase().includes(q) && !a.notes.toLowerCase().includes(q)) return false;
    if (sf && a.status !== sf) return false;
    if (scf && a.score < scf) return false;
    return true;
  }).sort((a, b) => {
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
  document.getElementById('pipeline-body').innerHTML = rows.map(a => {
    const applyCell = a.url
      ? \`<a href="\${a.url}" target="_blank" class="text-blue-400 hover:text-blue-300 text-xs underline whitespace-nowrap">Open →</a>\`
      : \`<span class="text-slate-700 text-xs">—</span>\`;
    return \`<tr class="border-t border-slate-800/60">
      <td class="px-3 py-2.5 text-slate-600">\${a.num}</td>
      <td class="px-3 py-2.5 text-slate-400 whitespace-nowrap">\${a.date}</td>
      <td class="px-3 py-2.5 text-white font-medium whitespace-nowrap">\${a.company}</td>
      <td class="px-3 py-2.5 text-slate-300">\${a.role}</td>
      <td class="px-3 py-2.5 \${scoreClass(a.score)} whitespace-nowrap">\${a.scoreRaw}</td>
      <td class="px-3 py-2.5">\${badge(a.status)}</td>
      <td class="px-3 py-2.5">\${applyCell}</td>
      <td class="px-3 py-2.5 text-slate-500 text-xs max-w-xs truncate" title="\${a.notes.replace(/"/g,'&quot;')}">\${a.notes}</td>
    </tr>\`;
  }).join('');
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
enrichApplications(apps, root);
const buildDate = new Date().toISOString().split('T')[0];
const html = generateHTML(apps, buildDate);

mkdirSync(join(root, 'docs'), { recursive: true });
writeFileSync(join(root, 'docs', 'index.html'), html, 'utf-8');

const applied = apps.filter(a => a.status === 'Applied').length;
const actionable = apps.filter(a => a.status === 'Evaluated' && a.score >= 4.0).length;
const withUrls = apps.filter(a => a.url).length;
console.log(`✅ Dashboard built: docs/index.html`);
console.log(`   ${apps.length} total · ${applied} applied · ${actionable} actionable · ${withUrls} with URLs`);
