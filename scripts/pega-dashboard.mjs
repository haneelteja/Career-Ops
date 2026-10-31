import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { ROOT, me } from './profile-config.mjs';

// Personal values come from config/profile.yml (gitignored) — see scripts/README.md.
const ME = me();

// ── parsers ──────────────────────────────────────────────────────────────────

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
      num: parseInt(num) || 0, date, company, role,
      score: scoreMatch ? parseFloat(scoreMatch[1]) : 0,
      scoreRaw: score, status,
      hasPdf: pdf === '✅',
      reportFile: reportMatch ? reportMatch[2] : null,
      notes, url: null, keyPoints: [], atsKeywords: '',
      summary: '', coverLetter: '',
    });
  }
  return apps.sort((a, b) => b.num - a.num);
}

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

function parsePendingPipeline(filePath) {
  if (!existsSync(filePath)) return [];
  const content = readFileSync(filePath, 'utf-8');
  const pending = [];
  let inPending = false;
  for (const line of content.split('\n')) {
    if (line.trim() === '## Pending') { inPending = true; continue; }
    if (line.startsWith('## ') && line.trim() !== '## Pending') { inPending = false; continue; }
    if (inPending && line.match(/^- \[ \]/)) {
      const parts = line.replace(/^- \[ \]\s*/, '').split('|').map(s => s.trim());
      const allText = parts.join(' ');
      const verified = allText.includes('✅');
      const unverified = allText.includes('⚠️');
      const expPart = parts[3] || '';
      const exp = /\d/.test(expPart) && !expPart.includes('✅') && !expPart.includes('⚠️') ? expPart : '';
      pending.push({ url: parts[0] || '', company: parts[1] || '', role: parts[2] || '', exp, verified, unverified });
    }
  }
  return pending;
}

function parseScanHistory(filePath) {
  if (!existsSync(filePath)) return { lastDate: null, count: 0 };
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('url'));
  let lastDate = null;
  for (const line of lines) {
    const cols = line.split('\t');
    if (cols[1] && /\d{4}-\d{2}-\d{2}/.test(cols[1])) {
      if (!lastDate || cols[1] > lastDate) lastDate = cols[1];
    }
  }
  return { lastDate, count: lines.length };
}

function parseReport(filePath) {
  if (!existsSync(filePath)) return { url: null, keyPoints: [], atsKeywords: '' };
  const content = readFileSync(filePath, 'utf-8');
  const urlM = content.match(/\*\*URL:\*\*\s*(https?:\/\/[^\s\n]+)/);
  const url = urlM ? urlM[1].trim() : null;
  const atsM = content.match(/\*\*ATS Keywords[^:]*:\*\*\s*([^\n]+)/i);
  const atsKeywords = atsM ? atsM[1].trim() : '';
  const ktp = [];
  const ktpM = content.match(/## Key Talking Points\n([\s\S]*?)(?=\n##|$)/);
  if (ktpM) {
    for (const line of ktpM[1].split('\n')) {
      const pt = line.replace(/^[-*]\s*/, '').trim();
      if (pt) ktp.push(pt);
    }
  }
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

// ── content generators (Node.js, pre-computed at build time) ─────────────────

function computeSummary(a) {
  const isPega = /pega/i.test(a.role + ' ' + a.company);
  const isPO = /product owner|product manager/i.test(a.role);
  if (isPega) {
    return ME.summaries.pega || ME.summaries.default || '';
  }
  if (isPO) {
    return ME.summaries.product_owner || ME.summaries.default || '';
  }
  return ME.summaries.default || '';
}

function computeRoleFit(role, status) {
  const r = (role || '').toLowerCase();
  if (status === 'Applied') return 'applied';
  if (/lead business architect|pega lead|lba\b|lead system architect|senior system architect|ssa\b|pega architect|solutions architect|system architect/i.test(role)) return 'too-senior';
  if (/pega|pega bsa|pega ba|cpba|cssa.*ba/i.test(role)) return 'pega-target';
  if (/senior business analyst|sr\.?\s*business analyst|business analyst/i.test(role) && !/lead|architect|product owner/i.test(role)) return 'senior-ba';
  if (/product owner|product manager|data business|gen ai|scrum master|project manager|architect/i.test(role)) return 'not-pega';
  return 'other';
}

function computeCoverLetter(a) {
  const cl = ME.coverLetter;
  const defaults = cl.default_points || [];
  const pt1 = a.keyPoints[0] || defaults[0] || '';
  const pt2 = a.keyPoints[1] || defaults[1] || '';
  const pt3 = a.keyPoints[2] || defaults[2] || '';
  const intro = (cl.intro || '').replace(/\{role\}/g, a.role).replace(/\{company\}/g, a.company);
  const signature = [ME.name, [ME.email, ME.phone].filter(Boolean).join(' | '), ME.linkedin].filter(Boolean).join('\n');
  return `Dear Hiring Team,

${intro}

${pt1}. ${pt2}. ${cl.differentiator || ''}

${pt3}. I am confident I can add immediate value at ${a.company} and look forward to discussing this opportunity.

Best regards,
${signature}`;
}

// ── enrich ───────────────────────────────────────────────────────────────────

function enrichApplications(apps, root) {
  const pipelineUrls = parsePipelineUrls(join(root, 'data', 'pipeline.md'));
  const reportsDir = join(root, 'reports');
  for (const app of apps) {
    if (pipelineUrls[app.num]) app.url = pipelineUrls[app.num];
    if (app.reportFile) {
      const { url, keyPoints, atsKeywords } = parseReport(join(root, app.reportFile));
      if (!app.url && url) app.url = url;
      app.keyPoints = keyPoints;
      app.atsKeywords = atsKeywords;
    }
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
    app.summary = computeSummary(app);
    app.coverLetter = computeCoverLetter(app);
    app.roleFit = computeRoleFit(app.role, app.status);
    const slug = app.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const dateSlug = app.date || '';
    const pdfCandidates = [
      join(root, 'output', `${ME.cvPdfPrefix}-${slug}-${dateSlug}.pdf`),
      join(root, 'output', `${ME.cvPdfPrefix}-${slug}-${app.role.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)}-${dateSlug}.pdf`),
    ];
    const padded = String(app.num).padStart(3, '0');
    const reportSlug = existsSync(reportsDir)
      ? readdirSync(reportsDir).find(f => f.startsWith(padded + '-'))?.replace(/\.md$/, '')
      : null;
    if (reportSlug) pdfCandidates.unshift(join(root, 'output', `${ME.cvPdfPrefix}-${reportSlug.replace(/^\d{3}-/, '')}.pdf`));
    app.pdfPath = pdfCandidates.find(p => existsSync(p)) || null;
    app.isReviewBatch = app.date === '2026-05-17' && app.num >= 61;
  }
  return apps;
}

// ── HTML ─────────────────────────────────────────────────────────────────────

function esc(v) {
  return String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateHTML(apps, buildDate, pendingInbox, scanHistory) {
  const total = apps.length;
  const applied = apps.filter(a => a.status === 'Applied').length;
  const evaluated = apps.filter(a => a.status === 'Evaluated').length;
  const actionable = apps.filter(a => a.status === 'Evaluated' && a.score >= 4.0).length;
  const discarded = apps.filter(a => a.status === 'Discarded' || a.status === 'SKIP').length;
  const pendingCount = pendingInbox.length;
  const lastScan = scanHistory.lastDate || 'Never';
  const reviewBatch = apps.filter(a => a.isReviewBatch);
  const pegaTargets = apps.filter(a => (a.roleFit === 'pega-target' || a.roleFit === 'senior-ba') && a.status === 'Evaluated' && a.score >= 4.0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Career-Ops — ${esc(ME.name)}</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
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
    .panel { display:none; }
    .panel.open { display:block; }
    ::-webkit-scrollbar { width:6px; height:6px; }
    ::-webkit-scrollbar-track { background:#0f172a; }
    ::-webkit-scrollbar-thumb { background:#334155; border-radius:3px; }
    .copy-btn:active { transform:scale(0.95); }
    .toast { position:fixed; bottom:1.5rem; right:1.5rem; background:#1e293b; border:1px solid #4ade80; color:#4ade80; padding:0.6rem 1.2rem; border-radius:0.5rem; font-size:0.85rem; opacity:0; transition:opacity 0.2s; pointer-events:none; z-index:999; }
    .toast.show { opacity:1; }
    .tab-btn { padding:0.3rem 0.85rem; border-radius:0.4rem; font-size:0.75rem; cursor:pointer; transition:background 0.15s; border:1px solid transparent; }
    .tab-btn.active { background:#334155; color:#e2e8f0; border-color:#475569; }
    .tab-btn:not(.active) { color:#64748b; }
    .tab-btn:not(.active):hover { color:#94a3b8; background:#1e293b; }
    .tab-content { display:none; }
    .tab-content.active { display:block; }
    pre { white-space:pre-wrap; word-break:break-word; font-family:inherit; }
    .fit-pega-target { background:#14532d; color:#86efac; }
    .fit-senior-ba { background:#1e3a5f; color:#93c5fd; }
    .fit-too-senior { background:#3f1515; color:#fca5a5; }
    .fit-not-pega { background:#422006; color:#fcd34d; }
    .fit-applied { background:#166534; color:#bbf7d0; }
    .decision-apply { box-shadow: inset 0 0 0 2px #4ade80; }
    .decision-skip { opacity: 0.55; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-6">
<div class="max-w-7xl mx-auto">
  <div id="toast" class="toast">Copied!</div>

  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
    <div>
      <h1 class="text-2xl font-bold text-white">Career-Ops</h1>
      <p class="text-slate-500 text-xs mt-0.5">${esc(ME.name)} · Built ${buildDate}</p>
    </div>
    <div class="flex gap-2 flex-wrap">
      <div class="card rounded-xl px-4 py-2.5 text-center min-w-[58px]">
        <div class="text-xl font-bold text-white">${total}</div>
        <div class="text-xs text-slate-400">Total</div>
      </div>
      <div class="card rounded-xl px-4 py-2.5 text-center min-w-[58px]">
        <div class="text-xl font-bold text-green-400">${applied}</div>
        <div class="text-xs text-slate-400">Applied</div>
      </div>
      <div class="card rounded-xl px-4 py-2.5 text-center min-w-[58px]">
        <div class="text-xl font-bold text-blue-400">${evaluated}</div>
        <div class="text-xs text-slate-400">Pending</div>
      </div>
      <div class="card rounded-xl px-4 py-2.5 text-center min-w-[58px]">
        <div class="text-xl font-bold text-yellow-400">${actionable}</div>
        <div class="text-xs text-slate-400">Act Now</div>
      </div>
      <div class="card rounded-xl px-4 py-2.5 text-center min-w-[58px]${pendingCount > 0 ? ' border-blue-600' : ''}">
        <div class="text-xl font-bold ${pendingCount > 0 ? 'text-blue-400' : 'text-slate-500'}">${pendingCount}</div>
        <div class="text-xs text-slate-400">Inbox</div>
      </div>
      <div class="card rounded-xl px-4 py-2.5 text-center min-w-[58px]">
        <div class="text-xl font-bold text-slate-500">${discarded}</div>
        <div class="text-xs text-slate-400">Closed</div>
      </div>
    </div>
  </div>

  <!-- Scan bar -->
  <div class="card rounded-xl px-4 py-2.5 mb-6 flex flex-wrap items-center gap-3 text-xs text-slate-500">
    <span>Last scan: <span class="text-slate-300 font-medium">${lastScan}</span></span>
    <span class="text-slate-700">·</span>
    <span>Scanned: <span class="text-slate-300 font-medium">${scanHistory.count} URLs</span></span>
    <span class="text-slate-700">·</span>
    <span>Refresh after scan: <code class="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">npm run deploy</code></span>
  </div>

  <!-- Targeting + Review Queue -->
  <section class="mb-8">
    <div class="card rounded-xl px-4 py-3 mb-4 border border-emerald-800/40 bg-emerald-950/20">
      <p class="text-sm text-emerald-200/90"><strong>Your target:</strong> Senior Business Analyst or Business Analyst with <strong>Pega</strong> in the role/JD. Lead/LBA/SSA/Architect roles are marked <span class="text-red-300">Too senior</span> — review queue below for today's batch (${reviewBatch.length} roles).</p>
      <p class="text-xs text-slate-500 mt-1">Mark roles <strong>Apply</strong> or <strong>Skip</strong>, then click <strong>Copy decisions for agent</strong> and paste in Cursor — agent will upload resume and submit after you confirm.</p>
    </div>
    <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
      <h2 class="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
        <span class="text-emerald-400">●</span> Review Queue
        <span class="text-slate-600 normal-case font-normal">(2026-05-17 batch · ${pegaTargets.length} Pega/Sr BA ≥4.0)</span>
      </h2>
      <div class="flex gap-2 flex-wrap">
        <button onclick="exportDecisions()" class="text-xs bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors">Copy decisions for agent</button>
        <button onclick="clearDecisions()" class="text-xs text-slate-500 hover:text-slate-300 px-2 py-1.5">Clear marks</button>
      </div>
    </div>
    <div id="review-section"></div>
  </section>

  <!-- Active Applications -->
  <section class="mb-8">
    <h2 class="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2 uppercase tracking-wider">
      <span class="text-green-400">●</span> Active Applications
    </h2>
    <div id="active-section"></div>
  </section>

  <!-- Actionable Now -->
  <section class="mb-8">
    <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
      <h2 class="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
        <span class="text-yellow-400">●</span> Actionable Now
        <span class="text-slate-600 normal-case font-normal">(Score ≥ 4.0 · Evaluated)</span>
      </h2>
      <button onclick="openAllActionable()" class="text-xs bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-3 py-1.5 rounded-lg transition-colors">
        Open All in Tabs →
      </button>
    </div>
    <div id="actionable-section"></div>
  </section>

  ${pendingCount > 0 ? `
  <!-- Pipeline Inbox -->
  <section class="mb-8">
    <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
      <h2 class="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
        <span class="text-blue-400">●</span> Pipeline Inbox
        <span class="text-green-500 normal-case font-normal">${pendingInbox.filter(i=>i.verified).length} verified live</span>
        <span class="text-slate-700">·</span>
        <span class="text-yellow-600 normal-case font-normal">${pendingInbox.filter(i=>i.unverified).length} to verify</span>
      </h2>
      <span class="text-xs text-slate-600">Open verified jobs directly · unverified need a manual check first</span>
    </div>
    <div id="inbox-section"></div>
  </section>
  ` : ''}

  <!-- Full Pipeline Table -->
  <section>
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-3">
      <h2 class="text-xs font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
        <span class="text-slate-600">●</span> Full Pipeline
      </h2>
      <div class="flex gap-2 flex-wrap">
        <input type="text" id="search" placeholder="Search…" style="width:150px" />
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
        <select id="fit-filter">
          <option value="">All fit</option>
          <option value="pega-target">Pega target</option>
          <option value="senior-ba">Senior BA</option>
          <option value="too-senior">Too senior</option>
          <option value="review-batch">Today's batch</option>
        </select>
      </div>
    </div>
    <div class="overflow-x-auto rounded-xl border border-slate-700">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <th class="px-3 py-2.5 text-left cursor-pointer hover:text-white select-none" onclick="sort('num')"># <span id="sort-num"></span></th>
            <th class="px-3 py-2.5 text-left cursor-pointer hover:text-white select-none" onclick="sort('date')">Date <span id="sort-date"></span></th>
            <th class="px-3 py-2.5 text-left">Company</th>
            <th class="px-3 py-2.5 text-left">Role</th>
            <th class="px-3 py-2.5 text-left">Fit</th>
            <th class="px-3 py-2.5 text-left cursor-pointer hover:text-white select-none" onclick="sort('score')">Score <span id="sort-score"></span></th>
            <th class="px-3 py-2.5 text-left cursor-pointer hover:text-white select-none" onclick="sort('status')">Status <span id="sort-status"></span></th>
            <th class="px-3 py-2.5 text-left">Actions</th>
            <th class="px-3 py-2.5 text-left text-slate-600">Notes</th>
          </tr>
        </thead>
        <tbody id="pipeline-body"></tbody>
      </table>
    </div>
    <p id="row-count" class="text-slate-600 text-xs mt-2 pl-1"></p>
  </section>
</div>

<script>
const ME = ${JSON.stringify(ME).replace(/</g, '\\u003c')};
function escHtml(v) {
  return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const DATA = ${JSON.stringify(apps).replace(/</g, '\\u003c')};
const INBOX = ${JSON.stringify(pendingInbox).replace(/</g, '\\u003c')};
let sortKey = 'num', sortAsc = false;

function scoreClass(s) {
  if (s >= 4.0) return 'score-high font-semibold';
  if (s >= 3.5) return 'score-mid';
  if (s >= 3.0) return 'score-low';
  return 'score-skip';
}
function badge(s) {
  const key = (s || 'SKIP').replace(/[^a-zA-Z]/g,'');
  return '<span class="px-2 py-0.5 rounded text-xs font-medium badge-' + key + '">' + s + '</span>';
}
function fitBadge(fit) {
  const labels = { 'pega-target':'Pega target', 'senior-ba':'Senior BA', 'too-senior':'Too senior', 'not-pega':'Not Pega', 'applied':'Applied', 'other':'Other' };
  return '<span class="px-2 py-0.5 rounded text-xs font-medium fit-' + (fit||'other') + '">' + (labels[fit]||fit) + '</span>';
}
const DECISION_KEY = 'careerOpsDecisions';
function getDecisions() { try { return JSON.parse(localStorage.getItem(DECISION_KEY)||'{}'); } catch(e) { return {}; } }
function setDecision(num, action) {
  const d = getDecisions();
  if (action) d[num] = action; else delete d[num];
  localStorage.setItem(DECISION_KEY, JSON.stringify(d));
  renderReview();
  renderTable();
}
function exportDecisions() {
  const d = getDecisions();
  const lines = Object.entries(d).map(([num, action]) => {
    const a = DATA.find(x => x.num == num);
    return action.toUpperCase() + ' #' + num + ' ' + (a ? a.company + ' — ' + a.role : '') + (a && a.url ? ' | ' + a.url : '');
  });
  const text = lines.length ? 'Career-Ops review decisions:\\n' + lines.join('\\n') + '\\n\\nPlease apply to APPLY roles (upload resume + submit). Skip SKIP roles.' : 'No decisions marked yet. Use Apply/Skip on the review queue.';
  copy(text, 'Decisions copied for agent!');
}
function clearDecisions() { localStorage.removeItem(DECISION_KEY); renderReview(); renderTable(); showToast('Cleared'); }
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg || 'Copied!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}
function copy(text, msg) {
  navigator.clipboard.writeText(text).then(() => showToast(msg));
}
function togglePanel(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('open');
}
function switchTab(panelId, tab) {
  const p = document.getElementById(panelId);
  if (!p) return;
  p.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  p.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const btn = p.querySelector('[data-tab="' + tab + '"]');
  const cnt = p.querySelector('.tc-' + tab);
  if (btn) btn.classList.add('active');
  if (cnt) cnt.classList.add('active');
}
function genFullPack(a) {
  return [
    '=== APPLICATION PACK: ' + a.company + ' — ' + a.role + ' ===',
    'Score: ' + a.scoreRaw + '  |  Evaluated: ' + a.date,
    'URL: ' + (a.url || 'Check pipeline.md'),
    '',
    '--- STANDARD FIELDS ---',
    'Full Name: ' + ME.name,
    'Email: ' + ME.email,
    'Phone: ' + ME.phone,
    'LinkedIn: ' + ME.linkedin,
    'Location: ' + ME.location,
    'Total Experience: ' + ME.experience,
    'Current Company: ' + ME.currentCompany,
    'Current Role: ' + ME.currentTitle,
    'Expected CTC: ' + ME.expectedCtcLabel,
    'Work Authorization: ' + ME.workAuthorization,
    '',
    '--- PROFESSIONAL SUMMARY ---',
    a.summary,
    '',
    '--- COVER LETTER ---',
    a.coverLetter,
    '',
    '--- KEY SELLING POINTS ---',
    ...(a.keyPoints.length ? a.keyPoints.map(p => '• ' + p) : ['• See report for details']),
    '',
    '--- ATS KEYWORDS ---',
    a.atsKeywords || ME.atsKeywords,
    '',
    '--- SALARY RESPONSE ---',
    ME.salaryScript,
    '',
    '--- EVALUATION NOTES ---',
    a.notes,
  ].join('\\n');
}
function openAllActionable() {
  const list = DATA.filter(a => a.status === 'Evaluated' && a.score >= 4.0 && a.url);
  if (!list.length) { alert('No actionable roles with URLs found.'); return; }
  list.forEach(a => window.open(a.url, '_blank'));
}

// ── Active ──
function renderActive() {
  const active = DATA.filter(a => ['Applied','Interview','Responded','Offer'].includes(a.status));
  const el = document.getElementById('active-section');
  if (!active.length) { el.innerHTML = '<p class="text-slate-600 text-sm">No active applications yet.</p>'; return; }
  el.innerHTML = active.map(a => {
    const fu = new Date(a.date); fu.setDate(fu.getDate() + 7);
    const days = Math.ceil((fu - new Date()) / 86400000);
    const fuStr = fu.toISOString().split('T')[0];
    const urgCls = days <= 0 ? 'text-red-400 font-semibold' : days <= 3 ? 'text-yellow-400 font-semibold' : 'text-green-400';
    const urgLabel = days <= 0 ? 'Follow-up OVERDUE' : 'Follow-up in ' + days + 'd · ' + fuStr;
    const openBtn = a.url ? '<a href="' + a.url + '" target="_blank" class="text-xs text-blue-400 hover:text-blue-300 underline">View posting →</a>' : '';
    return '<div class="card rounded-xl p-4 flex items-start justify-between gap-4 mb-2.5">' +
      '<div class="flex-1 min-w-0">' +
        '<div class="flex items-center gap-2 flex-wrap">' +
          '<span class="text-white font-semibold">' + a.company + '</span>' +
          '<span class="text-slate-400 text-sm">' + a.role + '</span>' +
          '<span class="' + scoreClass(a.score) + ' text-sm">' + a.scoreRaw + '</span>' +
          badge(a.status) + openBtn +
        '</div>' +
        '<div class="text-slate-500 text-xs mt-1">' + a.notes.substring(0,130) + (a.notes.length>130?'…':'') + '</div>' +
      '</div>' +
      '<div class="' + urgCls + ' text-sm shrink-0 text-right whitespace-nowrap">' + urgLabel + '</div>' +
    '</div>';
  }).join('');
}

// ── Actionable ──
function renderActionable() {
  const list = DATA.filter(a => a.status === 'Evaluated' && a.score >= 4.0).sort((a,b) => b.score - a.score);
  const el = document.getElementById('actionable-section');
  if (!list.length) {
    el.innerHTML = '<div class="card rounded-xl p-6 text-center"><p class="text-slate-400 text-sm mb-1">All high-score roles applied or discarded.</p><p class="text-slate-600 text-xs">Run a fresh scan to refill the pipeline.</p></div>';
    return;
  }
  el.innerHTML = list.map(a => {
    const pid = 'panel-' + a.num;
    const openBtn = a.url
      ? '<a href="' + a.url + '" target="_blank" class="copy-btn text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap">Open job →</a>'
      : '<span class="text-xs text-slate-700 px-1">No URL</span>';
    const pts = a.keyPoints.length
      ? a.keyPoints.map(p => '<li class="flex gap-2"><span class="text-yellow-400 mt-0.5 shrink-0">›</span><span>' + p + '</span></li>').join('')
      : '<li class="text-slate-600 text-xs">No key points extracted — see full report.</li>';
    const kwds = a.atsKeywords
      ? '<div class="mt-3 pt-2 border-t border-slate-700"><p class="text-xs text-slate-500 mb-1 uppercase tracking-wider">ATS Keywords</p><p class="text-xs text-slate-400 bg-slate-900/50 rounded p-2">' + a.atsKeywords + '</p></div>'
      : '';
    return '<div class="card rounded-xl p-4 mb-3">' +
      '<div class="flex items-start justify-between gap-3 flex-wrap">' +
        '<div class="flex-1 min-w-0">' +
          '<div class="flex items-center gap-2 flex-wrap">' +
            '<span class="text-slate-500 text-xs">#' + a.num + '</span>' +
            '<span class="text-white font-semibold">' + a.company + '</span>' +
            '<span class="text-slate-400 text-sm">' + a.role + '</span>' +
            '<span class="' + scoreClass(a.score) + ' text-lg font-bold">' + a.scoreRaw + '</span>' +
          '</div>' +
          '<div class="text-slate-500 text-xs mt-1">' + a.notes.substring(0,130) + (a.notes.length>130?'…':'') + '</div>' +
        '</div>' +
        '<div class="flex items-center gap-1.5 flex-wrap shrink-0 mt-2 md:mt-0">' +
          openBtn +
          '<button onclick="copy(DATA.find(x=>x.num===' + a.num + ').summary,\\'Summary copied!\\')" class="copy-btn text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap">Copy Summary</button>' +
          '<button onclick="copy(DATA.find(x=>x.num===' + a.num + ').coverLetter,\\'Cover letter copied!\\')" class="copy-btn text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap">Copy Cover Letter</button>' +
          '<button onclick="copy(genFullPack(DATA.find(x=>x.num===' + a.num + ')),\\'Full pack copied!\\')" class="copy-btn text-xs bg-green-900 hover:bg-green-800 text-green-300 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap">Copy Full Pack</button>' +
          '<button onclick="togglePanel(\\'' + pid + '\\')" class="copy-btn text-xs text-slate-500 hover:text-slate-300 px-2 py-1.5 rounded transition-colors">▾ Details</button>' +
        '</div>' +
      '</div>' +
      '<div id="' + pid + '" class="panel mt-3 pt-3 border-t border-slate-700/60">' +
        '<div class="flex gap-1 mb-3">' +
          '<button data-tab="summary" class="tab-btn active" onclick="switchTab(\\'' + pid + '\\',\\'summary\\')">Summary</button>' +
          '<button data-tab="cover" class="tab-btn" onclick="switchTab(\\'' + pid + '\\',\\'cover\\')">Cover Letter</button>' +
          '<button data-tab="points" class="tab-btn" onclick="switchTab(\\'' + pid + '\\',\\'points\\')">Selling Points</button>' +
          '<button data-tab="fields" class="tab-btn" onclick="switchTab(\\'' + pid + '\\',\\'fields\\')">Form Fields</button>' +
        '</div>' +
        '<div class="tab-content tc-summary active bg-slate-800/60 rounded-lg p-3 text-sm text-slate-300 leading-relaxed">' + a.summary + '</div>' +
        '<div class="tab-content tc-cover bg-slate-800/60 rounded-lg p-3 text-sm text-slate-300 leading-relaxed"><pre>' + a.coverLetter.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</pre></div>' +
        '<div class="tab-content tc-points bg-slate-800/60 rounded-lg p-3"><ul class="text-sm text-slate-300 space-y-1.5">' + pts + '</ul>' + kwds + '</div>' +
        '<div class="tab-content tc-fields bg-slate-800/60 rounded-lg p-3 text-xs text-slate-300 space-y-1.5 font-mono">' +
          [['Name', ME.name], ['Email', ME.email], ['Phone', ME.phone], ['LinkedIn', ME.linkedin],
           ['Location', ME.location], ['Experience', ME.experience], ['Current company', ME.currentCompany],
           ['Current title', ME.currentTitle], ['Expected CTC', ME.expectedCtcLabel], ['Authorization', ME.workAuthorization]]
            .map(([k, v]) => '<div><span class="text-slate-500">' + k + ':</span> ' + escHtml(v) + '</div>').join('') +
          '<div class="pt-2 mt-1 border-t border-slate-700"><span class="text-slate-500">Salary script:</span> ' + escHtml(ME.salaryScript) + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ── Review queue ──
function renderReview() {
  const el = document.getElementById('review-section');
  if (!el) return;
  const decisions = getDecisions();
  const batch = DATA.filter(a => a.isReviewBatch).sort((a,b) => b.num - a.num);
  if (!batch.length) { el.innerHTML = '<p class="text-slate-600 text-sm">No batch roles.</p>'; return; }
  el.innerHTML = batch.map(a => {
    const dec = decisions[a.num];
    const cardCls = 'card rounded-xl p-4 mb-3 ' + (dec === 'apply' ? 'decision-apply' : dec === 'skip' ? 'decision-skip' : '');
    const rec = a.score >= 4.0 && (a.roleFit === 'pega-target' || a.roleFit === 'senior-ba') ? '<span class="text-xs text-emerald-400 font-medium">Recommended</span>' : '';
    return '<div class="' + cardCls + '">' +
      '<div class="flex flex-wrap items-start justify-between gap-3">' +
        '<div class="min-w-0 flex-1">' +
          '<div class="flex items-center gap-2 flex-wrap mb-1">' +
            '<span class="text-white font-semibold">#' + a.num + ' ' + a.company + '</span>' +
            fitBadge(a.roleFit) + badge(a.status) + rec +
          '</div>' +
          '<div class="text-slate-300 text-sm mb-1">' + a.role + '</div>' +
          '<div class="' + scoreClass(a.score) + ' text-sm font-medium">' + a.scoreRaw + '</div>' +
          '<p class="text-slate-500 text-xs mt-2 line-clamp-2">' + (a.notes||'') + '</p>' +
        '</div>' +
        '<div class="flex flex-col gap-2 shrink-0">' +
          '<button onclick="setDecision(' + a.num + ',\\'apply\\')" class="text-xs px-3 py-1.5 rounded-lg font-medium ' + (dec==='apply'?'bg-green-600 text-white':'bg-slate-700 text-slate-200 hover:bg-green-800') + '">Apply</button>' +
          '<button onclick="setDecision(' + a.num + ',\\'skip\\')" class="text-xs px-3 py-1.5 rounded-lg font-medium ' + (dec==='skip'?'bg-slate-600 text-white':'bg-slate-800 text-slate-400 hover:bg-slate-600') + '">Skip</button>' +
          (a.url ? '<a href="' + a.url + '" target="_blank" class="text-xs text-center text-blue-400 hover:text-blue-300">Open job →</a>' : '') +
          (a.reportFile ? '<a href="' + a.reportFile + '" target="_blank" class="text-xs text-center text-slate-500 hover:text-slate-300">Report</a>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ── Inbox ──
function renderInbox() {
  const el = document.getElementById('inbox-section');
  if (!el) return;
  if (!INBOX.length) { el.innerHTML = '<p class="text-slate-600 text-sm">No pending URLs.</p>'; return; }
  const sorted = [...INBOX].sort((a,b) => (b.verified?1:0)-(a.verified?1:0));
  el.innerHTML = sorted.map(item => {
    const borderCls = item.verified ? 'border-l-[3px] border-l-green-600' : item.unverified ? 'border-l-[3px] border-l-yellow-700' : 'border-l-[3px] border-l-slate-700';
    const vbadge = item.verified
      ? '<span class="text-xs bg-green-900/60 text-green-400 px-2 py-0.5 rounded font-medium">✅ Verified Live</span>'
      : item.unverified
        ? '<span class="text-xs bg-yellow-900/30 text-yellow-600 px-2 py-0.5 rounded font-medium">⚠️ Verify first</span>'
        : '';
    const expBadge = item.exp ? '<span class="text-xs text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">' + item.exp + '</span>' : '';
    const safeUrl = (item.url||'').replace(/\\\\/g,'\\\\\\\\').replace(/'/g,"\\\\'");
    return '<div class="card rounded-xl p-3 mb-2 flex items-center justify-between gap-3 ' + borderCls + '">' +
      '<div class="min-w-0 flex-1">' +
        '<div class="flex items-center gap-2 flex-wrap">' +
          '<span class="text-white text-sm font-semibold">' + (item.company||'') + '</span>' +
          '<span class="text-slate-400 text-xs">' + (item.role||'') + '</span>' +
          expBadge + vbadge +
        '</div>' +
      '</div>' +
      '<div class="flex items-center gap-2 shrink-0">' +
        '<button onclick="navigator.clipboard.writeText(\\'' + safeUrl + '\\').then(()=>showToast(\\'URL copied!\\'))" class="copy-btn text-xs text-slate-600 hover:text-slate-400 px-2 py-1.5 transition-colors" title="Copy URL">⎘</button>' +
        (item.url ? '<a href="' + item.url + '" target="_blank" class="copy-btn text-xs bg-blue-800 hover:bg-blue-700 text-blue-200 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap">Open Job →</a>' : '') +
      '</div>' +
    '</div>';
  }).join('');
}

// ── Table ──
function filtered() {
  const q = document.getElementById('search').value.toLowerCase();
  const sf = document.getElementById('status-filter').value;
  const scf = parseFloat(document.getElementById('score-filter').value) || 0;
  const ff = document.getElementById('fit-filter')?.value || '';
  return DATA.filter(a => {
    if (q && !a.company.toLowerCase().includes(q) && !a.role.toLowerCase().includes(q) && !a.notes.toLowerCase().includes(q)) return false;
    if (sf && a.status !== sf) return false;
    if (scf && a.score < scf) return false;
    if (ff === 'review-batch' && !a.isReviewBatch) return false;
    if (ff && ff !== 'review-batch' && a.roleFit !== ff) return false;
    return true;
  }).sort((a, b) => {
    if (sortKey === 'score' || sortKey === 'num') return sortAsc ? a[sortKey]-b[sortKey] : b[sortKey]-a[sortKey];
    return sortAsc ? String(a[sortKey]).localeCompare(String(b[sortKey])) : String(b[sortKey]).localeCompare(String(a[sortKey]));
  });
}
function sort(key) {
  if (sortKey === key) sortAsc = !sortAsc; else { sortKey = key; sortAsc = false; }
  ['num','date','score','status'].forEach(k => {
    const el = document.getElementById('sort-' + k);
    if (el) el.textContent = k === sortKey ? (sortAsc ? '↑' : '↓') : '';
  });
  renderTable();
}
function renderTable() {
  const rows = filtered();
  document.getElementById('pipeline-body').innerHTML = rows.map(a => {
    const actions = [];
    if (a.url) actions.push('<a href="' + a.url + '" target="_blank" class="text-blue-500 hover:text-blue-400 text-xs underline whitespace-nowrap">Open →</a>');
    if (a.status === 'Evaluated') {
      actions.push('<button onclick="copy(genFullPack(DATA.find(x=>x.num===' + a.num + ')),\\'Pack copied!\\')" class="copy-btn text-xs text-slate-600 hover:text-slate-300 transition-colors ml-1" title="Copy full application pack">⎘ Copy</button>');
    }
    return '<tr class="border-t border-slate-800/60">' +
      '<td class="px-3 py-2.5 text-slate-600 text-xs">' + a.num + '</td>' +
      '<td class="px-3 py-2.5 text-slate-500 whitespace-nowrap text-xs">' + a.date + '</td>' +
      '<td class="px-3 py-2.5 text-white font-medium whitespace-nowrap">' + a.company + '</td>' +
      '<td class="px-3 py-2.5 text-slate-300 text-sm">' + a.role + '</td>' +
      '<td class="px-3 py-2.5 whitespace-nowrap">' + fitBadge(a.roleFit) + '</td>' +
      '<td class="px-3 py-2.5 ' + scoreClass(a.score) + ' whitespace-nowrap">' + a.scoreRaw + '</td>' +
      '<td class="px-3 py-2.5">' + badge(a.status) + '</td>' +
      '<td class="px-3 py-2.5"><div class="flex items-center gap-1">' + actions.join('') + '</div></td>' +
      '<td class="px-3 py-2.5 text-slate-500 text-xs max-w-xs truncate" title="' + a.notes.replace(/"/g,'&quot;') + '">' + a.notes + '</td>' +
    '</tr>';
  }).join('');
  document.getElementById('row-count').textContent = 'Showing ' + rows.length + ' of ' + DATA.length + ' roles';
}

document.getElementById('search').addEventListener('input', renderTable);
document.getElementById('status-filter').addEventListener('change', renderTable);
document.getElementById('score-filter').addEventListener('change', renderTable);
const fitFilterEl = document.getElementById('fit-filter');
if (fitFilterEl) fitFilterEl.addEventListener('change', renderTable);

renderActive();
renderActionable();
renderReview();
renderInbox();
renderTable();
<\/script>
</body>
</html>`;
}

// ── main ─────────────────────────────────────────────────────────────────────

const root = ROOT;
const apps = parseApplications(join(root, 'data', 'applications.md'));
enrichApplications(apps, root);
const pendingInbox = parsePendingPipeline(join(root, 'data', 'pipeline.md'));
const scanHistory = parseScanHistory(join(root, 'data', 'scan-history.tsv'));
const buildDate = new Date().toISOString().split('T')[0];
const html = generateHTML(apps, buildDate, pendingInbox, scanHistory);

// Written under output/ (gitignored) so the dashboard is never committed or published.
const outDir = join(root, 'output', 'dashboard');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), html, 'utf-8');

const applied = apps.filter(a => a.status === 'Applied').length;
const actionable = apps.filter(a => a.status === 'Evaluated' && a.score >= 4.0).length;
const withUrls = apps.filter(a => a.url).length;
console.log(`✅ Dashboard built: output/dashboard/index.html`);
console.log(`   ${apps.length} total · ${applied} applied · ${actionable} actionable · ${withUrls} with URLs · ${pendingInbox.length} inbox · last scan ${scanHistory.lastDate || 'never'}`);
