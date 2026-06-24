/* ========================================================================
   Yalla Shoot Scraper v3.1 - Worker كامل
   ========================================================================
   يقوم بـ:
   1. سكرابينغ مباريات yallashoot-id1.xyz كل ساعة
   2. خدمة PWA (manifest + sw + icons)
   3. دعم تيليجرام @gmt_apt في البيانات
   ======================================================================== */

// ============== الإعدادات الأساسية ==============

const BASE_URL = 'https://www.yallashoot-id1.xyz';
const CACHE_TTL_SECONDS = 3600; // ساعة واحدة - احتراماً للموقع

// معلومات قناة تيليجرام
const TELEGRAM = {
  username: 'gmt_apt',
  url: 'https://t.me/gmt_apt',
  description: 'اشترك لتصلك تنبيهات المباريات أولاً بأول'
};

// أسماء أقسام الموقع
const SECTIONS = {
  yesterday: 'matches-yesterday',
  today: 'matches-today',
  tomorrow: 'matches-tomorrow'
};

// ترجمة الحالات
const STATUS_LABELS = {
  live: 'جارية الآن',
  upcoming: 'لم تبدأ بعد',
  finished: 'انتهت',
  unknown: 'غير معروف'
};

// ============== أيقونات PWA (SVG - خفيفة الحجم) ==============

const ICON_192_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><defs><linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0a3d1f"/><stop offset="100%" stop-color="#1a5c2f"/></linearGradient></defs><rect width="192" height="192" fill="url(#g)"/><text x="96" y="115" font-size="75" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">YS</text><circle cx="96" cy="150" r="14" fill="white" stroke="#0f7a3a" stroke-width="3"/></svg>';

const ICON_MASK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect width="192" height="192" fill="#0f7a3a"/><text x="96" y="110" font-size="65" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">YS</text><circle cx="96" cy="140" r="12" fill="white"/></svg>';

// ============== PWA Manifest ==============

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

// ============== Service Worker Code ==============

const SW_CODE = [
  'self.addEventListener("install", e => self.skipWaiting());',
  'self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));',
  'self.addEventListener("fetch", e => {',
  '  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));',
  '});'
].join('\n');

// ============== دوال مساعدة ==============

function statusFromClass(classes) {
  if (classes.includes('live')) return 'live';
  if (classes.includes('not-started')) return 'upcoming';
  if (classes.includes('finished') || classes.includes('ft')) return 'finished';
  return 'unknown';
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

// ============== سكرابينغ yallashoot ==============

function parseMatches(html, section) {
  const matches = [];
  if (!html) return matches;

  const blocks = html.match(/<div class="AY_Match[^"]*"[^>]*>[\s\S]*?(?=<div class="AY_Match|$)/g) || [];

  for (const block of blocks) {
    const home = block.match(/<div class="MT_Team TM1"[\s\S]*?alt="([^"]*)"[^>]*?data-src="([^"]*)"[\s\S]*?<div class="TM_Name">\s*([^<]+?)\s*<\/div>/);
    const away = block.match(/<div class="MT_Team TM2"[\s\S]*?alt="([^"]*)"[^>]*?data-src="([^"]*)"[\s\S]*?<div class="TM_Name">\s*([^<]+?)\s*<\/div>/);
    if (!home || !away) continue;

    const t = block.match(/<span class="MT_Time">\s*([^<]+?)\s*<\/span>/);
    const goals = [...block.matchAll(/<span class="RS-goals">\s*(\d+)\s*<\/span>/g)].map(m => parseInt(m[1]));
    const cls = (block.match(/<div class="AY_Match\s+([^"]+)"/) || [])[1] || '';
    const status = statusFromClass(cls.split(/\s+/));

    const infoBlock = block.match(/<div class="MT_Info">\s*<ul>([\s\S]*?)<\/ul>/);
    let channel = '', comp = '';
    if (infoBlock) {
      const lis = [...infoBlock[1].matchAll(/<li>\s*<span>\s*([^<]+?)\s*<\/span>\s*<\/li>/g)].map(m => m[1].trim());
      channel = lis[0] || '';
      const fullComp = lis[2] || '';
      const parts = fullComp.split(',');
      comp = (parts.slice(1).join(',') || fullComp).trim();
    }

    const watch = block.match(/<a href="([^"]+)"[^>]*title="شاهد[^"]*"/);

    matches.push({
      id: section + '-' + matches.length,
      section: section,
      home_team: { name: home[3].trim(), logo: home[2].trim() },
      away_team: { name: away[3].trim(), logo: away[2].trim() },
      time: t ? t[1].trim() : '',
      score: {
        home: goals[0] ?? 0,
        away: goals[1] ?? 0,
        display: (goals[0] ?? 0) + ' - ' + (goals[1] ?? 0)
      },
      status: status,
      status_label: STATUS_LABELS[status] || '',
      channel: channel,
      competition: comp,
      watch_url: watch ? watch[1].trim() : ''
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

// ============== بناء الاستجابات ==============

function buildAllResponse(matches) {
  const all = [...matches.yesterday, ...matches.today, ...matches.tomorrow];
  return {
    source: BASE_URL,
    scraped_at: new Date().toISOString(),
    timezone: 'Africa/Cairo',
    version: '3.1',
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

// ============== نقطة الدخول الرئيسية ==============

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ===== CORS Preflight =====
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // ===== PWA Endpoints =====

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

    // ===== Scraping Endpoints (مع Cache صحيح) =====

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

    // ===== Debug Endpoint (لتشخيص المشاكل) =====

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
        return jsonResponse({
          target_url: targetUrl,
          status: r.status,
          html_length: html.length,
          html_first_500: html.substring(0, 500),
          html_last_500: html.substring(html.length - 500),
          has_AY_Match: html.includes('AY_Match'),
          has_MT_Team: html.includes('MT_Team'),
          has_class_AY_Match: html.includes('class="AY_Match'),
          AY_Match_count: (html.match(/AY_Match/g) || []).length,
          MT_Team_count: (html.match(/MT_Team/g) || []).length,
          matches_parsed: matches.length,
          sample_matches: matches.slice(0, 2)
        });
      } catch (e) {
        return jsonResponse({ error: e.message, stack: e.stack }, 500);
      }
    }

    // ===== Health Check =====

    if (path === '/health') {
      return jsonResponse({
        status: 'ok',
        version: '3.1',
        timestamp: new Date().toISOString(),
        cache_ttl_seconds: CACHE_TTL_SECONDS,
        telegram_channel: TELEGRAM,
        endpoints: {
          pwa: ['/manifest.json', '/sw.js', '/icon-192.png', '/icon-maskable.png'],
          scraping: ['/scrape/all', '/scrape/today', '/scrape/yesterday', '/scrape/tomorrow'],
          utility: ['/health', '/debug']
        }
      });
    }

    return new Response('Not Found. Available endpoints:\n/health, /scrape/all, /scrape/today, /manifest.json, /icon-192.png, /debug?url=...', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
};
