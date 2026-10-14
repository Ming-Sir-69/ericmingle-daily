#!/usr/bin/env node
/*
 * 四时日报 build script — no dependencies.
 *
 *   node scripts/build.js            -> public/   (real entries only)
 *   node scripts/build.js --demo     -> public-demo/ (adds entries-demo/*.json, marked 示例)
 *
 * Each entry renders with the template version it was written with (entry.template),
 * so old days keep their old look. templates/current decides the version for new entries.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEMO = process.argv.includes('--demo');
const OUT = path.join(ROOT, DEMO ? 'public-demo' : 'public');
const WEEK_DAYS = 7;

const WEEKDAY = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const SECTION_ICON = { system: 'icon-system', accounts: 'icon-accounts', ai: 'icon-ai', dev: 'icon-dev' };

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const safeUrl = (u) => (/^https:\/\//.test(u || '') ? esc(u) : '');

function readJSONDir(dir, demo) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).map((f) => {
    const e = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (e.date !== f.slice(0, -5) || new Date(`${e.date}T00:00:00Z`).toISOString().slice(0, 10) !== e.date) {
      throw new Error(`Invalid entry date in ${f}`);
    }
    if (e.template && !/^v\d+$/.test(e.template)) throw new Error(`Invalid template version in ${f}`);
    e._demo = !!demo;
    return e;
  });
}

function dateParts(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, wd };
}
const dateline = (iso) => { const p = dateParts(iso); return `${WEEKDAY[p.wd]} · ${p.y}年${p.m}月${p.d}日`; };
const shortDate = (iso) => { const p = dateParts(iso); return `${p.m}月${p.d}日 ${WEEKDAY[p.wd]}`; };
const daysBetween = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 86400000);

/* ---------------- templates ---------------- */
const tplCache = {};
function template(version) {
  if (tplCache[version]) return tplCache[version];
  const dir = path.join(ROOT, 'templates', version);
  if (!fs.existsSync(dir)) throw new Error(`template ${version} not found`);
  const partials = {};
  for (const f of fs.readdirSync(path.join(dir, 'partials'))) {
    partials[f.replace(/\.html$/, '')] = fs.readFileSync(path.join(dir, 'partials', f), 'utf8');
  }
  tplCache[version] = {
    brief: fs.readFileSync(path.join(dir, 'brief.html'), 'utf8'),
    hub: fs.readFileSync(path.join(dir, 'hub.html'), 'utf8'),
    partials,
  };
  return tplCache[version];
}
const fill = (tpl, map) => tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in map ? map[k] : m));
const wrapDoc = (body) => `<!doctype html>\n<html lang="zh-Hans">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="robots" content="noindex, nofollow">\n</head>\n<body>\n${body}\n</body>\n</html>\n`;

/* ---------------- daily page ---------------- */
function renderItem(it) {
  const title = it.url
    ? `<a class="item-title" href="${safeUrl(it.url)}">${esc(it.title)}</a>`
    : `<span class="item-title">${esc(it.title)}</span>`;
  const src = it.source
    ? (it.url ? `<a class="src" href="${safeUrl(it.url)}">${esc(it.source)}</a>` : esc(it.source))
    : '';
  const impact = it.impact ? `\n              <p class="impact">${esc(it.impact)}</p>` : '';
  return `          <li class="item"><div>
              ${title}
              <p>${src}${esc(it.body)}</p>${impact}
          </div></li>`;
}

function renderSections(entry, tpl) {
  const out = [];
  const dividers = ['divider-1', 'divider-2', 'divider-3'];
  (entry.sections || []).forEach((sec, i) => {
    if (i > 0) {
      const d = tpl.partials[dividers[(i - 1) % dividers.length]] || '';
      out.push(`      <div class="divider" aria-hidden="true">\n${d}      </div>`);
    }
    const icon = tpl.partials[SECTION_ICON[sec.key]] || tpl.partials['icon-ai'] || '';
    const parts = [`      <section>
        <div class="sec-head">
          <div class="sec-icon">
${icon}          </div>
          <h2>${esc(sec.title)}</h2>
        </div>`];
    (sec.groups || []).forEach((g) => {
      if (g.heading) parts.push(`        <h3>${esc(g.heading)}</h3>`);
      if (g.items && g.items.length) parts.push(`        <ol class="items">\n${g.items.map(renderItem).join('\n')}\n        </ol>`);
      if (g.note) parts.push(`        <p class="calm${g.items && g.items.length ? ' after' : ''}">${esc(g.note)}</p>`);
    });
    parts.push('      </section>');
    out.push(parts.join('\n'));
  });
  return out.join('\n\n');
}

function renderDay(entry) {
  const tpl = template(entry.template || 'v1');
  const s = entry.scene || {};
  const p = dateParts(entry.date);
  const acts = (entry.acts || []).map((a) => `      <div class="act"><b>${esc(a.time)}</b><p>${esc(a.text)}</p></div>`).join('\n');
  return wrapDoc(fill(tpl.brief, {
    TITLE: `晨间简报 ${p.m}月${p.d}日`,
    HUB_URL: '../index.html',
    LEVEL: esc(s.level || ((p.wd + 6) % 7) + 1),
    SEASON: esc(s.season || 'autumn'),
    WEATHER: esc(s.weather || 'partly'),
    HOLIDAY: esc(s.holiday || 'none'),
    DATELINE: dateline(entry.date),
    HEADLINE: esc(entry.headline),
    ACTS: acts,
    SECTIONS: renderSections(entry, tpl),
  }));
}

/* ---------------- mini scene (status card picture) ---------------- */
const SEASON = {
  spring: { far: '#B7D69D', mid: '#8FC073', near: '#74AA5C', leafD: '#4F8A4A', leafM: '#7DB063', leafL: '#B3D88A' },
  summer: { far: '#A8CB93', mid: '#82B46A', near: '#66A055', leafD: '#3E7040', leafM: '#5E9450', leafL: '#93C36E' },
  autumn: { far: '#C9C48F', mid: '#A8B06A', near: '#8E9F55', leafD: '#B0602C', leafM: '#D88B3C', leafL: '#EDB766' },
  winter: { far: '#BAC3B4', mid: '#9FAB99', near: '#8B9985', leafD: '#5E6E5C', leafM: '#7F8E7A', leafL: '#A7B2A1' },
};
const SKY = {
  sunny: ['#7FB8E4', '#EEF3E6'], partly: ['#8CC0E6', '#EEF3E6'], windy: ['#8CC0E6', '#EEF3E6'],
  cloudy: ['#B4C1CC', '#E9ECEA'], rain: ['#9AA9B7', '#DCE2E3'],
};
const SKY_OP = [0, 0, 0.14, 0.32, 0.6, 0.8, 0.93, 1];

function cloud(x, y, k, fill, shade) {
  return `<g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="8" rx="34" ry="8" fill="${shade}"/><circle cx="-16" cy="2" r="11" fill="${fill}"/><circle cx="2" cy="-4" r="15" fill="${fill}"/><circle cx="19" cy="3" r="10" fill="${fill}"/><ellipse cx="0" cy="6" rx="32" ry="6" fill="${fill}"/></g>`;
}

function miniScene(scene, id) {
  const lv = Math.min(7, Math.max(1, Number(scene.level) || 1));
  const se = SEASON[scene.season] || SEASON.autumn;
  const w = SKY[scene.weather] ? scene.weather : 'partly';
  const sky = SKY[w];
  const o = [];
  o.push(`<svg class="scene-mini" viewBox="0 0 600 200" role="img" aria-label="当天的风景">`);
  o.push(`<defs><linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>`);
  o.push(`<rect width="600" height="200" fill="#F9F8F4"/>`);
  o.push(`<rect width="600" height="200" fill="url(#sky-${id})" opacity="${SKY_OP[lv]}"/>`);
  if (w === 'cloudy' || w === 'rain') o.push(`<rect width="600" height="200" fill="#C3CCD3" opacity="${w === 'rain' ? 0.45 : 0.3}"/>`);
  // sun
  if (w === 'sunny' || w === 'partly' || w === 'windy' || w === 'cloudy') {
    const op = w === 'cloudy' ? 0.35 : 1;
    if (lv >= 4) o.push(`<g opacity="${op}"><circle cx="150" cy="62" r="40" fill="#FFF1C2" opacity=".7"/><circle cx="150" cy="62" r="18" fill="#FFE59A"/></g>`);
    else o.push(`<g opacity="${op}"><circle cx="150" cy="100" r="20" fill="#F6E4DA"/><circle cx="150" cy="100" r="11" fill="#E3A587"/><circle cx="149" cy="99" r="8" fill="#C6613F"/></g>`);
  }
  if (scene.holiday === 'midautumn') o.push(`<circle cx="500" cy="56" r="26" fill="#FBEBC0" opacity=".5"/><circle cx="500" cy="56" r="14" fill="#FBEBC0"/>`);
  if (scene.holiday === 'newyear') {
    const rays = [];
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; rays.push(`<path d="M${(480 + Math.cos(a) * 6).toFixed(1)} ${(52 + Math.sin(a) * 6).toFixed(1)} L${(480 + Math.cos(a) * 20).toFixed(1)} ${(52 + Math.sin(a) * 20).toFixed(1)}" stroke="${i % 2 ? '#F2C14E' : '#C6613F'}" stroke-width="2" stroke-linecap="round"/>`); }
    o.push(rays.join(''));
  }
  // clouds
  const cf = w === 'rain' ? '#E3E7EA' : w === 'cloudy' ? '#F2F4F5' : '#FFFFFF';
  const cs = w === 'rain' ? '#B5BFC8' : '#C6D7EA';
  const nClouds = { sunny: 1, partly: 2, windy: 2, cloudy: 3, rain: 3 }[w] + (lv >= 3 ? 1 : 0);
  const spots = [[330, 70, 1], [90, 110, 0.7], [470, 100, 0.8], [230, 50, 0.6]];
  for (let i = 0; i < Math.min(nClouds, spots.length); i++) o.push(cloud(spots[i][0], spots[i][1], spots[i][2], cf, cs));
  if (lv >= 6) o.push(cloud(400, 44, 1.5, cf, cs));
  // ground
  if (lv < 4) {
    o.push(`<path d="M300 162 C 360 146, 430 140, 500 148 S 580 150, 620 156 V 164 H 300 Z" fill="${se.far}" opacity=".6"/>`);
    o.push(`<path d="M0 162 C 120 159, 240 164, 360 161 S 520 158, 600 161" fill="none" stroke="#2E2C27" stroke-width="2"/>`);
    o.push(`<path d="M470 161 V 143" stroke="#2E2C27" stroke-width="1.6"/><ellipse cx="470" cy="134" rx="11" ry="13" fill="${se.leafL}"/><ellipse cx="471" cy="131" rx="7" ry="8" fill="${se.leafM}"/>`);
    if (lv >= 2) o.push(`<circle cx="492" cy="159" r="2" fill="#F5D266"/><circle cx="500" cy="160" r="1.6" fill="#C6613F"/>`);
  } else {
    o.push(`<path d="M0 140 C 100 124, 200 126, 300 134 S 480 120, 600 132 V 200 H 0 Z" fill="${se.far}"/>`);
    o.push(`<path d="M0 158 C 120 146, 240 148, 340 154 S 500 142, 600 150 V 200 H 0 Z" fill="${se.mid}"/>`);
    if (lv >= 5) o.push(`<rect x="408" y="138" width="20" height="13" fill="#F6EFE2"/><path d="M404 139 L418 128 L432 139 Z" fill="#C8553A"/><rect x="412" y="142" width="4" height="4" fill="#F4C766"/>`);
    o.push(`<path d="M226 176 C 228 164, 225 156, 229 146 L 235 146 C 238 158, 235 166, 239 176 Z" fill="#6E5240"/>`);
    o.push(`<ellipse cx="232" cy="128" rx="36" ry="24" fill="${se.leafD}"/><ellipse cx="226" cy="122" rx="28" ry="18" fill="${se.leafM}"/><ellipse cx="220" cy="114" rx="15" ry="9" fill="${se.leafL}"/>`);
    o.push(`<path d="M0 178 C 140 168, 260 170, 360 174 S 520 166, 600 170 V 200 H 0 Z" fill="${se.near}"/>`);
    if (lv >= 5) o.push(`<circle cx="120" cy="182" r="2.4" fill="#F5D266"/><circle cx="330" cy="180" r="2" fill="#FFFFFF"/><circle cx="520" cy="178" r="2.4" fill="#F5D266"/>`);
    if (lv >= 7) o.push(`<path d="M100 92 C 96 120, 90 150, 84 176" stroke="#2E2C27" stroke-width=".8" opacity=".5" fill="none"/><path d="M100 76 L110 88 L100 102 L90 88 Z" fill="#C8553A"/>`);
  }
  if (scene.holiday === 'lunar' || scene.holiday === 'midautumn') {
    const c = scene.holiday === 'lunar' ? '#D2402F' : '#E8833A';
    const [x1, y1, x2, y2] = lv >= 4 ? [210, 150, 254, 148] : [480, 146, 486, 146];
    o.push(`<circle cx="${x1}" cy="${y1}" r="5" fill="${c}"/>`);
    if (lv >= 4) o.push(`<circle cx="${x2}" cy="${y2}" r="4.5" fill="${c}"/>`);
  }
  if (w === 'rain') {
    const lines = [];
    for (let i = 0; i < 40; i++) { const x = (i * 157) % 610; const y = 20 + ((i * 53) % 150); lines.push(`M${x} ${y} l-3 10`); }
    o.push(`<path d="${lines.join(' ')}" stroke="#7D93A8" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>`);
  }
  if (w === 'windy') o.push(`<path d="M60 90 C 180 70, 320 110, 460 84 S 560 72, 600 80" stroke="#FFFFFF" stroke-width="2" fill="none" opacity=".8"/>`);
  o.push('</svg>');
  return o.join('');
}

/* ---------------- hub ---------------- */
const tagList = (tags, max) => (tags && tags.length ? `<ul class="tags">${tags.slice(0, max).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '');
const demoMark = (e) => (e._demo ? '<span class="demo">示例</span>' : '');

function renderToday(e) {
  if (!e) return '  <p class="empty">还没有日报记录。</p>';
  return `  <section class="today">
    <div class="frame">${miniScene(e.scene || {}, 'today')}</div>
    <p class="dateline">${dateline(e.date)} · 最新一期${demoMark(e)}</p>
    <h3>${esc(e.headline)}</h3>
    ${tagList(e.tags, 6)}
    <a class="open" href="d/${esc(e.date)}.html">打开最新一期的完整简报</a>
  </section>`;
}

function renderWeekRow(e) {
  const body = (e.sections || []).map((sec) => {
    const items = [];
    (sec.groups || []).forEach((g) => (g.items || []).forEach((it) => items.push(`<li>${esc(it.title)}${it.impact ? `<em>影响：${esc(it.impact)}</em>` : ''}</li>`)));
    if (!items.length) {
      const note = (sec.groups || []).map((g) => g.note).filter(Boolean)[0];
      if (!note) return '';
      items.push(`<li>${esc(note)}</li>`);
    }
    return `<div><h4>${esc(sec.title)}</h4><ul>${items.join('')}</ul></div>`;
  }).join('');
  return `    <details class="day">
      <summary>
        <div class="thumb">${miniScene(e.scene || {}, e.date)}</div>
        <div class="meta"><b>${shortDate(e.date)}${demoMark(e)}</b><span>${esc(e.headline)}</span>${tagList(e.tags, 3)}</div>
        <span class="chev" aria-hidden="true">›</span>
      </summary>
      <div class="body">${body}<a class="full" href="d/${esc(e.date)}.html">打开当天完整页面</a></div>
    </details>`;
}

function renderCard(e) {
  return `    <div class="card">
      <div class="thumb">${miniScene(e.scene || {}, 'c' + e.date)}</div>
      <b>${shortDate(e.date)}${demoMark(e)}</b>
      <span>${esc(e.headline)}</span>
      ${tagList(e.tags, 2)}
    </div>`;
}

function renderHub(entries, version) {
  const tpl = template(version);
  const sorted = entries.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const today = sorted[0];
  const week = sorted.slice(1).filter((e) => daysBetween(today.date, e.date) < WEEK_DAYS);
  const earlier = sorted.slice(1).filter((e) => daysBetween(today.date, e.date) >= WEEK_DAYS);
  return wrapDoc(fill(tpl.hub, {
    TODAY: renderToday(today),
    WEEK: week.length ? `    <div class="week">\n${week.map(renderWeekRow).join('\n')}\n    </div>` : '    <p class="empty">这一周的其他日子还没有记录。</p>',
    EARLIER: earlier.length ? `    <div class="wall">\n${earlier.map(renderCard).join('\n')}\n    </div>` : '    <p class="empty">一周以前的日子会缩成小卡片放在这里。</p>',
    FOOTER: `模板 ${esc(version)} · 共 ${entries.filter((e) => !e._demo).length} 天记录`,
  }));
}

/* ---------------- main ---------------- */
function main() {
  const version = fs.readFileSync(path.join(ROOT, 'templates', 'current'), 'utf8').trim();
  let entries = readJSONDir(path.join(ROOT, 'entries'), false);
  if (DEMO) entries = entries.concat(readJSONDir(path.join(ROOT, 'entries-demo'), true));
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(path.join(OUT, 'd'), { recursive: true });
  for (const e of entries) fs.writeFileSync(path.join(OUT, 'd', `${e.date}.html`), renderDay(e));
  fs.writeFileSync(path.join(OUT, 'index.html'), entries.length ? renderHub(entries, version) : wrapDoc('<p>还没有日报记录。</p>'));
  console.log(`built ${entries.length} day(s) -> ${path.relative(ROOT, OUT)}/ (template ${version})`);
}
main();
