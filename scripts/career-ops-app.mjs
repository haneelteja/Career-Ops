#!/usr/bin/env node
/**
 * Local Career-Ops web app (localhost only).
 *
 * Not a cloud SaaS — no remote login. Serves the private dashboard plus a
 * small JSON API for inbox / pipeline / daily scans / next actions.
 *
 *   npm run app          → rebuild dashboard + serve http://127.0.0.1:8787
 *   CAREER_OPS_TOKEN=x   → optional local gate (Authorization: Bearer x)
 *   CAREER_OPS_PORT=8787 → port override
 */
import { createServer } from 'http';
import { execFileSync } from 'child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { ROOT, me } from './profile-config.mjs';

const PORT = Number(process.env.CAREER_OPS_PORT || 8787);
const TOKEN = process.env.CAREER_OPS_TOKEN || '';
const HOST = '127.0.0.1';

function rebuildDashboard() {
  execFileSync(process.execPath, [join(ROOT, 'scripts', 'pega-dashboard.mjs')], {
    cwd: ROOT,
    stdio: 'inherit',
  });
}

function parsePending(filePath) {
  if (!existsSync(filePath)) return [];
  const rows = [];
  for (const line of readFileSync(filePath, 'utf-8').split('\n')) {
    if (!/^- \[[ xX]\]/.test(line)) continue;
    const done = /^- \[[xX]\]/.test(line);
    const body = line.replace(/^- \[[ xX]\]\s*/, '');
    const parts = body.split('|').map((s) => s.trim());
    if (parts.length < 2) continue;
    rows.push({
      done,
      url: parts[0]?.startsWith('http') ? parts[0] : '',
      company: parts[1] || '',
      role: parts[2] || '',
      num: parts[3] || '',
      score: parts[4] || '',
      notes: parts.slice(5).join(' | ') || parts[parts.length - 1] || '',
      raw: body,
    });
  }
  return rows;
}

function listDailyScans() {
  const out = join(ROOT, 'output');
  if (!existsSync(out)) return [];
  return readdirSync(out)
    .filter((f) => /^daily-pega-ba-scan-\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .reverse()
    .map((f) => {
      const p = join(out, f);
      return {
        file: f,
        path: `output/${f}`,
        date: f.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || '',
        bytes: statSync(p).size,
        headline: readFileSync(p, 'utf-8').split('\n').slice(0, 8).join('\n'),
      };
    });
}

function nextActions() {
  const pending = parsePending(join(ROOT, 'data', 'pipeline.md')).filter((r) => !r.done);
  const top = pending.slice(0, 8);
  const virtusa = pending.find((r) => /P-100973|Virtusa/i.test(r.raw));
  const actions = [];
  if (virtusa) {
    actions.push({
      priority: 1,
      title: 'Decide Virtusa P-100973',
      detail:
        'CV has no Appeals & Grievances / healthcare evidence → default SKIP unless Pradeep confirms the gate is soft and CTC ≥ ₹10L.',
      url: virtusa.url || 'https://virtusa.com/careers/job-search/global/en/job/P-100973/Senior-Consultant',
      report: 'output/virtusa-p-100973-decision-2026-11-01.md',
    });
  }
  actions.push({
    priority: 2,
    title: 'Run daily ATS scan onto main',
    detail: 'Use prompts/daily-pega-ba-scan.md; commit only output/daily-pega-ba-scan-YYYY-MM-DD.md on main.',
    command: 'npm run scan:ats',
  });
  actions.push({
    priority: 3,
    title: 'Open local dashboard',
    detail: `http://${HOST}:${PORT}/`,
  });
  for (const row of top.slice(0, 3)) {
    actions.push({
      priority: 10 + actions.length,
      title: `${row.company} — ${row.role}`.slice(0, 80),
      detail: row.notes,
      url: row.url || undefined,
    });
  }
  return actions;
}

function apiState() {
  const meInfo = me();
  return {
    ok: true,
    app: 'career-ops-local',
    host: HOST,
    port: PORT,
    candidate: meInfo.name || null,
    city: meInfo.city || null,
    generatedAt: new Date().toISOString(),
    pending: parsePending(join(ROOT, 'data', 'pipeline.md')),
    dailyScans: listDailyScans().slice(0, 15),
    nextActions: nextActions(),
    endpoints: {
      ui: '/',
      state: '/api/state',
      health: '/api/health',
      rebuild: 'POST /api/rebuild',
    },
  };
}

function authorized(req) {
  if (!TOKEN) return true;
  const h = req.headers.authorization || '';
  const q = new URL(req.url, `http://${HOST}`).searchParams.get('token');
  return h === `Bearer ${TOKEN}` || q === TOKEN;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
};

function send(res, code, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(code, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

rebuildDashboard();

const server = createServer((req, res) => {
  if (!authorized(req)) {
    send(res, 401, 'Unauthorized — set CAREER_OPS_TOKEN and pass Bearer token\n');
    return;
  }

  const url = new URL(req.url, `http://${HOST}`);
  const path = url.pathname;

  if (path === '/api/health') {
    send(res, 200, JSON.stringify({ ok: true, ts: Date.now() }), MIME['.json']);
    return;
  }

  if (path === '/api/state') {
    send(res, 200, JSON.stringify(apiState(), null, 2), MIME['.json']);
    return;
  }

  if (path === '/api/rebuild' && req.method === 'POST') {
    try {
      rebuildDashboard();
      send(res, 200, JSON.stringify({ ok: true }), MIME['.json']);
    } catch (e) {
      send(res, 500, JSON.stringify({ ok: false, error: String(e) }), MIME['.json']);
    }
    return;
  }

  if (path === '/api/inbox') {
    send(
      res,
      200,
      JSON.stringify(parsePending(join(ROOT, 'data', 'pipeline.md')), null, 2),
      MIME['.json'],
    );
    return;
  }

  // Static: dashboard UI + selected output files
  let filePath;
  if (path === '/' || path === '/index.html') {
    filePath = join(ROOT, 'output', 'dashboard', 'index.html');
  } else if (path.startsWith('/output/')) {
    filePath = join(ROOT, path.slice(1));
  } else if (path === '/app') {
    // Lightweight app shell linking API + dashboard
    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Career-Ops Local</title>
<style>body{font-family:system-ui;background:#0f172a;color:#e2e8f0;margin:2rem;max-width:960px}
a{color:#93c5fd} pre{background:#1e293b;padding:1rem;border-radius:8px;overflow:auto;font-size:12px}
.card{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:1rem;margin:1rem 0}
</style></head><body>
<h1>Career-Ops (local)</h1>
<p>Private localhost app — not published. <a href="/">Open dashboard UI</a> · <a href="/api/state">JSON state</a></p>
<div class="card" id="actions"><h2>Next actions</h2><p>Loading…</p></div>
<div class="card"><h2>Inbox (open)</h2><pre id="inbox">…</pre></div>
<script>
fetch('/api/state').then(r=>r.json()).then(s=>{
  document.getElementById('actions').innerHTML = '<h2>Next actions</h2>' + s.nextActions.map(a =>
    '<div><strong>#'+a.priority+' '+a.title+'</strong><br><span style="color:#94a3b8">'+a.detail+'</span>' +
    (a.url?' · <a href="'+a.url+'" target="_blank">link</a>':'') +
    (a.command?' · <code>'+a.command+'</code>':'') + '</div>'
  ).join('<hr style="border-color:#334155">');
  document.getElementById('inbox').textContent = JSON.stringify(s.pending.filter(p=>!p.done).slice(0,20), null, 2);
});
</script>
</body></html>`;
    send(res, 200, html, MIME['.html']);
    return;
  } else {
    send(res, 404, 'Not found\n');
    return;
  }

  if (!existsSync(filePath) || !filePath.startsWith(ROOT)) {
    send(res, 404, 'Not found\n');
    return;
  }
  const type = MIME[extname(filePath)] || 'application/octet-stream';
  send(res, 200, readFileSync(filePath), type);
});

server.listen(PORT, HOST, () => {
  const who = me().name || 'candidate';
  console.log(`\nCareer-Ops local app for ${who}`);
  console.log(`  Dashboard: http://${HOST}:${PORT}/`);
  console.log(`  App shell: http://${HOST}:${PORT}/app`);
  console.log(`  API:       http://${HOST}:${PORT}/api/state`);
  if (TOKEN) console.log('  Auth:      Bearer token required (CAREER_OPS_TOKEN)');
  else console.log('  Auth:      none (localhost only — set CAREER_OPS_TOKEN to gate)');
  console.log('');
});
