/* ========================================================================
   Yalla Shoot Scraper v8 Worker - FINAL OPTIMIZED VERSION
   ========================================================================
   ✅ يدعم علامات الفردية والمزدوجة في HTML attributes
   ✅ يستخرج الوقت بشكل صحيح
   ✅ يصلح روابط الصور من yallaseha.net
   ✅ يحتوي على 6 endpoints
   ✅ CORS مفتوح
   ✅ Cache 1 ساعة
   ✅ نظام Logging للتشخيص
   ======================================================================== */

// ============== الإعدادات ==============
const BASE_URL = 'https://www.yallashoot-id1.xyz';
const CACHE_TTL_SECONDS = 3600; // ساعة واحدة

const TELEGRAM = {
  username: 'boot_RM',
  url: 'https://t.me/boot_RM',
  description: 'اشترك للدعاية والاعلان علي منتجك 📢📢 تواصل علي تلجرام'
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
  name: 'يلا شوت - Yalla Shoot | كورة لايف',
  short_name: 'يلا شوت',
  description: 'يلا شوت - جدول مباريات كرة القدم لايف - كأس العالم - beIN Sports',
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

// ============== Parser مُحسّن v8 ==============

function statusFromClass(classes) {
  if (classes.includes('live')) return 'live';
  if (classes.includes('not-started')) return 'upcoming';
  if (classes.includes('finished') || classes.includes('ft')) return 'finished';
  return 'unknown';
}

function parseMatches(html, section) {
  const matches = [];
  if (!html || html.length < 100) return matches;

  // 1) العثور على مواقع كل AY_Match block
  const positions = [];
  const searchStr = '<div class="AY_Match';
  let pos = 0;
  while (true) {
    const idx = html.indexOf(searchStr, pos);
    if (idx === -1) break;
    positions.push(idx);
    pos = idx + searchStr.length;
  }

  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1] : html.length;
    const block = html.substring(start, end);

    // أسماء الفرق - يدعم علامات الفردية والمزدوجة
    const tmNames = [];
    const nameRegex = /<div class=['"]TM_Name['"]>\s*([^<]+?)\s*<\/div>/g;
    let nm;
    while ((nm = nameRegex.exec(block)) !== null && tmNames.length < 2) {
      tmNames.push(nm[1].trim());
    }

    // الشعارات - يدعم علامات الفردية والمزدوجة
    const logos = [];
    const logoRegex = /data-src=['"]([^'"]+\.png)['"]/g;
    let lg;
    while ((lg = logoRegex.exec(block)) !== null && logos.length < 2) {
      logos.push(lg[1]);
    }

    if (tmNames.length < 2) continue;

    // الوقت - الأهم! يدعم علامات الفردية والمزدوجة
    const timeMatch = block.match(/<span class=['"]MT_Time['"][^>]*>([^<]+)<\/span>/);
    const time = timeMatch ? timeMatch[1].trim() : '';

    // النتيجة
    const goals = [];
    const goalRegex = /<span class=['"]RS-goals['"]>\s*(\d+)\s*<\/span>/g;
    let gm;
    while ((gm = goalRegex.exec(block)) !== null) goals.push(parseInt(gm[1]));
    const homeGoals = goals[0] ?? 0;
    const awayGoals = goals[1] ?? 0;

    // الحالة من class AY_Match
    const clsMatch = block.match(/<div class=['"]AY_Match[^'"]*?\s+(live|not-started|finished|ft)[^'"]*['"]/);
    const status = clsMatch ? statusFromClass([clsMatch[1]]) : 'unknown';

    // نص الحالة
    const statMatch = block.match(/<div class=['"]MT_Stat['"]>\s*([^<]+?)\s*<\/div>/);
    const statusLabel = STATUS_LABELS[status] || (statMatch ? statMatch[1].trim() : '');

    // معلومات (القناة، المعلق، المسابقة)
    let channel = '', comp = '', country = '';
    const infoMatch = block.match(/<div class=['"]MT_Info['"]>\s*<ul>([\s\S]*?)<\/ul>/);
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
    const watchMatch = block.match(/<a href=['"]([^'"]+)['"][^>]*title=['"]شاهد[^'"]*['"]/);
    
    // إصلاح روابط الشعارات (yallaseha.net → yallashoot-id1.xyz)
    const homeLogo = (logos[0] || '').replace('https://yallaseha.net', 'https://www.yallashoot-id1.xyz');
    const awayLogo = (logos[1] || '').replace('https://yallaseha.net', 'https://www.yallashoot-id1.xyz');

    matches.push({
      id: section + '-' + matches.length,
      section: section,
      home_team: { name: tmNames[0], logo: homeLogo },
      away_team: { name: tmNames[1], logo: awayLogo },
      time: time,
      score: { home: homeGoals, away: awayGoals, display: homeGoals + ' - ' + awayGoals },
      status: status,
      status_label: statusLabel,
      channel: channel,
      country: country,
      competition: comp,
      watch_url: watchMatch ? watchMatch[1].trim() : ''
    });
  }
  return matches;
}

// ============== سكرابينغ ==============

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
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none'
      }
    });
    if (!r.ok) {
      console.error(`[Worker v8] Failed ${section}: HTTP ${r.status}`);
      return [];
    }
    const html = await r.text();
    const matches = parseMatches(html, section);
    console.log(`[Worker v8] ${section}: scraped ${matches.length} matches`);
    return matches;
  } catch (e) {
    console.error(`[Worker v8] Error scraping ${section}:`, e.message);
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
    version: '8.0',
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

// ============== HTTP Helpers ==============

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data, null, 2), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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

// ============== نقطة الدخول الرئيسية ==============

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const cacheKey = request; // استخدام request كمفتاح cache

    // CORS Preflight
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

    // ===== Scraping Endpoints =====
    if (path === '/' || path === '/scrape/all') {
      const cache = caches.default;
      const cached = await cache.match(cacheKey);
      if (cached) return cached;

      const matches = await scrapeAllSections();
      const response = jsonResponse(buildAllResponse(matches));
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    const m = path.match(/^\/scrape\/(yesterday|today|tomorrow)\/?$/);
    if (m) {
      const section = m[1];
      const cache = caches.default;
      const cached = await cache.match(cacheKey);
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
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }

    // ===== Debug Endpoint =====
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

        const ayPositions = [];
        let p = 0;
        while (true) {
          const i = html.indexOf('<div class="AY_Match', p);
          if (i === -1) break;
          ayPositions.push(i);
          p = i + 1;
        }

        return jsonResponse({
          target_url: targetUrl,
          status: r.status,
          html_length: html.length,
          AY_Match_count: ayPositions.length,
          matches_parsed: matches.length,
          sample_matches: matches.slice(0, 3),
          first_match_data: matches.length > 0 ? {
            home: matches[0].home_team.name,
            away: matches[0].away_team.name,
            time: matches[0].time,
            score: matches[0].score.display,
            status: matches[0].status,
            has_watch_url: matches[0].watch_url ? 'yes' : 'no'
          } : null,
          fix_info: {
            telegram: TELEGRAM,
            parser_version: 'v8-fixed-regex',
            single_quotes_supported: true
          }
        });
      } catch (e) {
        return jsonResponse({ error: e.message, stack: e.stack }, 500);
      }
    }

    // ===== Health Check =====
    if (path === '/health') {
      return jsonResponse({
        status: 'ok',
        version: '8.0',
        timestamp: new Date().toISOString(),
        cache_ttl_seconds: CACHE_TTL_SECONDS,
        telegram_channel: TELEGRAM,
        endpoints: {
          pwa: ['/manifest.json', '/sw.js', '/icon-192.png', '/icon-maskable.png'],
          scraping: ['/scrape/all', '/scrape/today', '/scrape/yesterday', '/scrape/tomorrow'],
          utility: ['/health', '/debug']
        },
        message: 'Worker v8 - all systems operational!'
      });
    }

    // ===== 404 =====
    return new Response(JSON.stringify({
      error: 'Not Found',
      available_endpoints: [
        '/health',
        '/scrape/all',
        '/scrape/today',
        '/scrape/yesterday',
        '/scrape/tomorrow',
        '/manifest.json',
        '/sw.js',
        '/icon-192.png',
        '/icon-maskable.png',
        '/debug'
      ]
    }, null, 2), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
