/* ========================================================================
   Yalla Shoot Scraper v3.2 - FIXED PARSER
   ========================================================================
   الإصلاح: استخدام indexOf بدل regex لتجنب backtracking
   ======================================================================== */

// ============== الإعدادات الأساسية ==============

const BASE_URL = 'https://www.yallashoot-id1.xyz';
const CACHE_TTL_SECONDS = 3600;

const TELEGRAM = {
  username: 'gmt_apt',
  url: 'https://t.me/gmt_apt',
  description: 'اشترك لتصلك تنبيهات المباريات أولاً بأول'
};

const SECTIONS = {
  yesterday: 'matches-yesterday',
  today: 'matches-today',
  tomorrow: 'matches-tomorrow'
};

const STATUS_LABELS = {
  live: 'جارية الآن',
  upcoming: 'لم تبدأ بعد',
  finished: 'انتهت',
  unknown: ''
};

// ============== أيقونات PWA (SVG) ==============

const ICON_192_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><defs><linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0a3d1f"/><stop offset="100%" stop-color="#1a5c2f"/></linearGradient></defs><rect width="192" height="192" fill="url(#g)"/><text x="96" y="115" font-size="75" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">YS</text><circle cx="96" cy="150" r="14" fill="white" stroke="#0f7a3a" stroke-width="3"/></svg>';

const ICON_MASK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" fill="#0f7a3a"/><text x="96" y="110" font-size="65" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">YS</text><circle cx="96" cy="140" r="12" fill="white"/></svg>';

const MANIFEST = {
  name: 'يلا شوت - جدول المباريات',
  short_name: 'يلا شوت',
  description: 'جدول مباريات كرة القدم - تحديث تلقائي كل ساعة',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  lang: 'ar',
  dir: 'rtl',
  theme_color: '#0f7a3a',
  background_color: '#0e1116',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/svg+xml', purpose: 'any' },
    { src: '/icon-maskable.png', sizes: '192x192', type: 'image/svg+xml', purpose: 'maskable' }
  ]
};

const SW_CODE = 'self.addEventListener("install",e=>self.skipWaiting());self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));self.addEventListener("fetch",e=>{e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});';

// ============== Parser المُحسّن (بدون backtracking) ==============

function statusFromClass(classes) {
  if (classes.includes('live')) return 'live';
  if (classes.includes('not-started')) return 'upcoming';
  if (classes.includes('finished') || classes.includes('ft')) return 'finished';
  return 'unknown';
}

function parseMatches(html, section) {
  const matches = [];
  if (!html || html.length < 100) return matches;

  // الخطوة 1: إيجاد مواقع كل بطاقة AY_Match
  const positions = [];
  const searchStr = '<div class="AY_Match';
  let pos = 0;
  while (true) {
    const idx = html.indexOf(searchStr, pos);
    if (idx === -1) break;
    positions.push(idx);
    pos = idx + searchStr.length;
  }

  // الخطوة 2: استخراج كل بلوك على حدة
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1] : html.length;
    const block = html.substring(start, end);

    // استخراج أسماء الفرق (أول اسمين)
    const tmNames = [];
    const nameRegex = /<div class="TM_Name">\s*([^<]+?)\s*<\/div>/g;
    let nm;
    while ((nm = nameRegex.exec(block)) !== null && tmNames.length < 2) {
      tmNames.push(nm[1].trim());
    }

    // استخراج الشعارات (أول شعارين)
    const logos = [];
    const logoRegex = /data-src="([^"]+\.png)"/g;
    let lg;
    while ((lg = logoRegex.exec(block)) !== null && logos.length < 2) {
      logos.push(lg[1]);
    }

    if (tmNames.length < 2) continue;

    // الوقت
    const timeMatch = block.match(/<span class="MT_Time">\s*([^<]+?)\s*<\/span>/);
    const time = timeMatch ? timeMatch[1].trim() : '';

    // النتيجة
    const goals = [];
    const goalRegex = /<span class="RS-goals">\s*(\d+)\s*<\/span>/g;
    let gm;
    while ((gm = goalRegex.exec(block)) !== null) {
      goals.push(parseInt(gm[1]));
    }
    const homeGoals = goals[0] ?? 0;
    const awayGoals = goals[1] ?? 0;

    // الحالة من class
    const clsMatch = block.match(/<div class="AY_Match[^"]*?\s+(live|not-started|finished|ft)[^"]*"/);
    const status = clsMatch ? statusFromClass([clsMatch[1]]) : 'unknown';

    // الحالة من MT_Stat
    const statMatch = block.match(/<div class="MT_Stat">\s*([^<]+?)\s*<\/div>/);
    const statusLabel = STATUS_LABELS[status] || (statMatch ? statMatch[1].trim() : '');

    // معلومات (القناة، المسابقة)
    let channel = '', comp = '', country = '';
    const infoMatch = block.match(/<div class="MT_Info">\s*<ul>([\s\S]*?)<\/ul>/);
    if (infoMatch) {
      const lis = [];
      const liRegex = /<li>\s*<span>\s*([^<]+?)\s*<\/span>\s*<\/li>/g;
      let lm;
      while ((lm = liRegex.exec(infoMatch[1])) !== null) {
        lis.push(lm[1].trim());
      }
      channel = lis[0] || '';
      const fullComp = lis[2] || '';
      const parts = fullComp.split(',');
      country = (parts[0] || '').trim();
      comp = (parts.slice(1).join(',') || fullComp).trim();
    }

    // رابط المشاهدة
    const watchMatch = block.match(/<a href="([^"]+)"[^>]*title="شاهد[^"]*"/);
    const watchUrl = watchMatch ? watchMatch[1].trim() : '';

    matches.push({
      id: section + '-' + matches.length,
      section: section,
      home_team: { name: tmNames[0], logo: logos[0] || '' },
      away_team: { name: tmNames[1], logo: logos[1] || '' },
      time: time,
      score: {
        home: homeGoals,
        away: awayGoals,
        display: homeGoals + ' - ' + awayGoals
      },
      status: status,
      status_label: statusLabel,
      channel: channel,
      country: country,
      competition: comp,
      watch_url: watchUrl
    });
  }

  return matches;
}

async function scrapeSection(section) {
  const path = SECTIONS[section];
  if (!path) return [];
  try {
    const r = await fetch(BASE_URL + '/' + path + '/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    if (!r.ok) return [];
    const html = await r.text();
    return parseMatches(html, section);
  } catch (e) {
    return [];
  }
}

async function scrapeAllSections() {
  const [y, t, tm] = await Promise.all([
    scrapeSection('yesterday'),
    scrapeSection('today'),
    scrapeSection('tomorrow')
  ]);
  return { yesterday: y, today: t, tomorrow: tm };
}

function buildAllResponse(matches) {
  const all = [...matches.yesterday, ...matches.today, ...matches.tomorrow];
  return {
    source: BASE_URL,
    scraped_at: new Date().toISOString(),
    timezone: 'Africa/Cairo',
    version: '3.2',
    telegram: TELEGRAM,
    matches: matches,
    stats: {
      total: all.length,
      by_section: {
        yesterday: matches.yesterday.length,
        today: matches.today.length,
        tomorrow: matches.tomorrow.length
      },
      by_status: {
        live: all.filter(m => m.status === 'live').length,
        upcoming: all.filter(m => m.status === 'upcoming').length,
        finished: all.filter(m => m.status === 'finished').length
      }
    }
  };
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data, null, 2), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=' + CACHE_TTL_SECONDS
    }
  });
}

function svgResponse(svg) {
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=2592000',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// ============== نقطة الدخول ==============

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    }

    // ===== PWA =====
    if (path === '/manifest.json' || path === '/manifest.webmanifest') {
      return new Response(JSON.stringify(MANIFEST, null, 2), {
        headers: {
          'Content-Type': 'application/manifest+json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    if (path === '/sw.js') {
      return new Response(SW_CODE, {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Service-Worker-Allowed': '/',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

    if (path === '/icon-192.png' || path === '/icon-512.png') {
      return svgResponse(ICON_192_SVG);
    }

    if (path === '/icon-maskable.png') {
      return svgResponse(ICON_MASK_SVG);
    }

    // ===== Scraping =====
    if (path === '/' || path === '/scrape/all') {
      const cache = caches.default;
      const cached = await cache.match(request);
      if (cached) return cached;

      const matches = await scrapeAllSections();
      const response = jsonResponse(buildAllResponse(matches));
      ctx.waitUntil(cache.put(request, response.clone()));
      return response;
    }

    const m = path.match(/^\/scrape\/(yesterday|today|tomorrow)\/?$/);
    if (m) {
      const section = m[1];
      const cache = caches.default;
      const cached = await cache.match(request);
      if (cached) return cached;

      const matches = await scrapeAllSections();
      const response = jsonResponse({
        source: BASE_URL,
        section: section,
        scraped_at: new Date().toISOString(),
        telegram: TELEGRAM,
        count: matches[section].length,
        matches: matches[section]
      });
      ctx.waitUntil(cache.put(request, response.clone()));
      return response;
    }

    // ===== Debug =====
    if (path === '/debug') {
      const targetUrl = url.searchParams.get('url') || BASE_URL + '/matches-today/';
      try {
        const r = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8'
          }
        });
        const html = await r.text();
        const matches = parseMatches(html, 'debug');

        // معلومات تشخيصية
        const ayMatchPositions = [];
        let p = 0;
        while (true) {
          const i = html.indexOf('<div class="AY_Match', p);
          if (i === -1) break;
          ayMatchPositions.push(i);
          p = i + 1;
        }

        return jsonResponse({
          target_url: targetUrl,
          status: r.status,
          html_length: html.length,
          AY_Match_opening_count: ayMatchPositions.length,
          matches_parsed: matches.length,
          sample_matches: matches.slice(0, 3),
          first_match_block: matches.length > 0 ? html.substring(ayMatchPositions[0], ayMatchPositions[1] || html.length).substring(0, 1500) : ''
        });
      } catch (e) {
        return jsonResponse({ error: e.message, stack: e.stack }, 500);
      }
    }

    // ===== Health =====
    if (path === '/health') {
      return jsonResponse({
        status: 'ok',
        version: '3.2',
        timestamp: new Date().toISOString(),
        cache_ttl_seconds: CACHE_TTL_SECONDS,
        telegram_channel: TELEGRAM
      });
    }

    return new Response('Not Found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};
