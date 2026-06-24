<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:version='2' class='v2' expr:dir='data:blog.languageDirection' expr:lang='data:blog.locale' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>

<head>
<meta charset='UTF-8'/>
<meta content='width=device-width, initial-scale=1.0' name='viewport'/>
<meta content='IE=edge' http-equiv='X-UA-Compatible'/>

<!-- PWA Meta Tags -->
<meta name='theme-color' content='#0f7a3a'/>
<meta name='apple-mobile-web-app-capable' content='yes'/>
<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent'/>
<meta name='apple-mobile-web-app-title' content='يلا شوت'/>
<meta name='mobile-web-app-capable' content='yes'/>
<meta name='application-name' content='يلا شوت'/>
<meta name='description' content='جدول مباريات كرة القدم - تحديث تلقائي كل ساعة'/>
<link rel='manifest' href='https://kooora.mexcbingx15.workers.dev/manifest.json'/>
<link rel='apple-touch-icon' href='https://kooora.mexcbingx15.workers.dev/icon-192.png'/>
<link rel='icon' type='image/png' href='https://kooora.mexcbingx15.workers.dev/icon-192.png'/>

<b:include data='blog' name='all-head-content'/>
<title><data:blog.pageTitle/></title>
<link href='https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&amp;display=swap' rel='stylesheet'/>

<b:skin><![CDATA[/*
-----------------------------------------------
Yalla Shoot Blogger Template v3.0 - PWA
----------------------------------------------- */

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: #0e1116;
  color: #e6e9ef;
  font-family: 'Tajawal', 'Cairo', sans-serif;
  direction: rtl;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; transition: color .2s ease; }
a:hover { color: #1fbf63; }
img { max-width: 100%; height: auto; display: block; }

.container { max-width: 1200px; margin: 0 auto; padding: 0 16px; }

.site-header {
  background: linear-gradient(180deg, #11151c 0%, #0e1116 100%);
  border-bottom: 1px solid #1f2530;
  padding: 14px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
}
.header-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.logo { font-size: 26px; font-weight: 800; letter-spacing: -.5px; display: flex; align-items: center; gap: 8px; color: #fff; }
.logo .dot { width: 12px; height: 12px; background: #0f7a3a; border-radius: 50%; box-shadow: 0 0 12px #0f7a3a; }
.nav { display: flex; gap: 22px; flex-wrap: wrap; }
.nav a { font-weight: 600; font-size: 15px; color: #cfd4dd; }
.nav a.active, .nav a:hover { color: #1fbf63; }
.menu-toggle { display: none; background: transparent; border: 1px solid #2a3140; color: #e6e9ef; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 18px; }
@media (max-width: 720px) {
  .nav { display: none; flex-direction: column; width: 100%; padding-top: 12px; }
  .nav.open { display: flex; }
  .menu-toggle { display: inline-block; }
}

.page-title { text-align: center; padding: 28px 0 8px; }
.page-title h1 { font-size: 28px; font-weight: 800; letter-spacing: -.3px; color: #fff; }
.page-title .clock { margin-top: 6px; color: #9aa3b2; font-size: 13px; }
.page-title .live-indicator { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #1fbf63; margin-right: 12px; }
.page-title .live-indicator::before { content:''; width: 8px; height: 8px; background: #1fbf63; border-radius: 50%; animation: pulse 1.2s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }

.schedule-tabs { display: flex; justify-content: center; gap: 8px; margin: 18px 0 24px; flex-wrap: wrap; }
.schedule-tabs button { padding: 10px 18px; background: #181c24; border: 1px solid #232a37; border-radius: 999px; font-weight: 600; font-size: 14px; color: #cfd4dd; transition: all .2s ease; cursor: pointer; font-family: inherit; }
.schedule-tabs button.active, .schedule-tabs button:hover { background: #0f7a3a; border-color: #0f7a3a; color: #fff; }

.matches { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 14px; margin-bottom: 32px; }
.match-card { background: #181c24; border: 1px solid #232a37; border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 10px; transition: transform .15s ease, border-color .15s ease; animation: fadeIn .3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.match-card:hover { transform: translateY(-2px); border-color: #2f3a4d; }
.match-row { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; }
.team { display: flex; align-items: center; gap: 8px; min-width: 0; }
.team.home { justify-content: flex-end; text-align: right; }
.team.away { justify-content: flex-start; text-align: left; }
.team img { width: 36px; height: 36px; object-fit: contain; background: #0e1116; border-radius: 50%; padding: 4px; }
.team .name { font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.score { background: #0e1116; border: 1px solid #232a37; border-radius: 10px; padding: 8px 12px; text-align: center; min-width: 92px; }
.score .time { font-size: 13px; color: #9aa3b2; }
.score .result { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: 1px; }
.match-meta { display: flex; flex-wrap: wrap; gap: 6px 10px; font-size: 13px; color: #9aa3b2; }
.match-meta .badge { background: #0e1116; border: 1px solid #232a37; padding: 3px 8px; border-radius: 6px; font-size: 12px; }
.status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; }
.status.live { background: rgba(220, 38, 38, .15); color: #ff5a5a; }
.status.live::before { content:''; width: 8px; height: 8px; background:#ff5a5a; border-radius:50%; animation: pulse 1.2s infinite; }
.status.upcoming { background: rgba(31, 191, 99, .12); color: #1fbf63; }
.status.finished { background: rgba(154, 163, 178, .15); color: #9aa3b2; }
.watch-btn { display: inline-block; margin-top: 4px; padding: 9px 14px; background: #0f7a3a; color: #fff !important; border-radius: 8px; font-weight: 700; font-size: 14px; text-align: center; transition: background .2s ease; }
.watch-btn:hover { background: #1fbf63; color: #fff !important; }

.tg-card { background: linear-gradient(135deg, #1c2733 0%, #1f2a35 50%, #229ED9 200%); border: 1px solid #229ED9; border-radius: 14px; padding: 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 10px; position: relative; overflow: hidden; transition: transform .15s ease, border-color .15s ease; animation: fadeIn .3s ease; }
.tg-card:hover { transform: translateY(-2px); border-color: #2AABEE; }
.tg-card::before { content: ''; position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: rgba(34, 158, 217, .4); border-radius: 50%; filter: blur(30px); z-index: 0; }
.tg-card::after { content: ''; position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(34, 158, 217, .25); border-radius: 50%; filter: blur(25px); z-index: 0; }
.tg-icon { width: 54px; height: 54px; background: #229ED9; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 1; box-shadow: 0 4px 14px rgba(34, 158, 217, .5); }
.tg-icon svg { width: 30px; height: 30px; fill: #fff; }
.tg-card h3 { color: #fff; font-size: 17px; font-weight: 800; z-index: 1; }
.tg-card p { color: #cfd4dd; font-size: 13px; line-height: 1.5; z-index: 1; max-width: 280px; }
.tg-channel { display: inline-block; background: rgba(34, 158, 217, .15); color: #229ED9; font-weight: 800; font-size: 15px; padding: 6px 14px; border-radius: 8px; z-index: 1; }
.tg-btn { display: inline-block; padding: 10px 22px; background: #229ED9; color: #fff !important; border-radius: 10px; font-weight: 800; font-size: 14px; text-decoration: none; z-index: 1; transition: background .2s ease, transform .15s ease; box-shadow: 0 4px 12px rgba(34, 158, 217, .3); }
.tg-btn:hover { background: #2AABEE; color: #fff !important; transform: translateY(-1px); }

.pwa-install-prompt { position: fixed; bottom: 20px; left: 20px; right: 20px; max-width: 480px; margin: 0 auto; background: linear-gradient(135deg, #1c2733 0%, #229ED9 200%); border: 1px solid #229ED9; border-radius: 16px; padding: 16px 18px; display: flex; align-items: center; gap: 12px; z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,.5); animation: slideUp .4s ease; color: #fff; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.pwa-install-prompt.hidden { display: none; }
.pwa-install-prompt .pwa-icon { width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; }
.pwa-install-prompt .pwa-content { flex: 1; min-width: 0; }
.pwa-install-prompt .pwa-title { font-size: 14px; font-weight: 800; margin-bottom: 2px; }
.pwa-install-prompt .pwa-subtitle { font-size: 12px; color: #cfd4dd; }
.pwa-install-prompt .pwa-actions { display: flex; gap: 6px; flex-shrink: 0; }
.pwa-install-prompt .pwa-btn { padding: 8px 14px; border: none; border-radius: 8px; font-weight: 700; font-size: 13px; cursor: pointer; font-family: inherit; }
.pwa-install-prompt .pwa-btn-primary { background: #229ED9; color: #fff; }
.pwa-install-prompt .pwa-btn-primary:hover { background: #2AABEE; }
.pwa-install-prompt .pwa-btn-secondary { background: transparent; color: #9aa3b2; border: 1px solid #2a3140; }
.pwa-install-prompt .pwa-btn-secondary:hover { color: #fff; border-color: #4a5568; }

.ios-install-help { position: fixed; bottom: 20px; left: 20px; right: 20px; max-width: 480px; margin: 0 auto; background: rgba(28, 39, 51, .98); border: 1px solid #229ED9; border-radius: 16px; padding: 16px 18px; z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,.5); color: #fff; font-size: 13px; line-height: 1.5; }
.ios-install-help.hidden { display: none; }
.ios-install-help .ios-close { float: left; background: transparent; border: none; color: #9aa3b2; font-size: 20px; cursor: pointer; padding: 0; line-height: 1; }
.ios-install-help .ios-close:hover { color: #fff; }
.ios-install-help strong { color: #229ED9; }
.ios-install-help ol { padding-right: 20px; margin-top: 8px; }
.ios-install-help li { margin-bottom: 4px; }

.stats-bar { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin: 18px 0; font-size: 13px; }
.stats-bar .stat { background: #181c24; border: 1px solid #232a37; border-radius: 8px; padding: 8px 14px; }
.stats-bar .stat strong { color: #1fbf63; font-weight: 800; }

.section-head { display: flex; align-items: center; justify-content: space-between; margin: 28px 0 14px; border-right: 4px solid #0f7a3a; padding-right: 12px; }
.section-head h2 { font-size: 22px; font-weight: 800; color: #fff; }
.news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; margin-bottom: 36px; }
.news-card { background: #181c24; border: 1px solid #232a37; border-radius: 12px; overflow: hidden; transition: transform .15s ease, border-color .15s ease; }
.news-card:hover { transform: translateY(-2px); border-color: #2f3a4d; }
.news-card .thumb { width: 100%; height: 160px; background: #0e1116; object-fit: cover; }
.news-card .body { padding: 12px; }
.news-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 6px; color: #fff; }
.news-card .meta { font-size: 12px; color: #9aa3b2; }
.posts-list { display: grid; gap: 14px; }
.post-card { background: #181c24; border: 1px solid #232a37; border-radius: 12px; padding: 16px; }
.post-card h2 a { font-size: 20px; font-weight: 800; color: #fff; }
.post-card .post-body { margin-top: 8px; color: #cfd4dd; }
.post-card .post-footer { margin-top: 10px; font-size: 12px; color: #9aa3b2; }
.site-footer { border-top: 1px solid #1f2530; background: #11151c; padding: 22px 0; text-align: center; color: #9aa3b2; font-size: 13px; margin-top: 30px; }
.empty-state { text-align: center; padding: 60px 20px; color: #9aa3b2; background: #181c24; border: 1px dashed #2a3140; border-radius: 14px; grid-column: 1 / -1; }
.divider { height: 1px; background: #1f2530; margin: 22px 0; }
.last-update { text-align: center; color: #9aa3b2; font-size: 12px; margin-top: 12px; }
.last-update strong { color: #1fbf63; }
.error-banner { background: rgba(220, 38, 38, .1); border: 1px solid rgba(220, 38, 38, .3); color: #ff5a5a; padding: 12px; border-radius: 8px; text-align: center; margin: 12px 0; font-size: 13px; }

@media (max-width: 720px) {
  .tg-card { padding: 16px; }
  .tg-icon { width: 44px; height: 44px; }
  .tg-icon svg { width: 24px; height: 24px; }
  .tg-card h3 { font-size: 15px; }
  .tg-card p { font-size: 12px; }
  .tg-btn { padding: 8px 18px; font-size: 13px; }
  .pwa-install-prompt { left: 12px; right: 12px; bottom: 12px; padding: 12px 14px; }
  .pwa-install-prompt .pwa-icon { width: 40px; height: 40px; }
  .pwa-install-prompt .pwa-title { font-size: 13px; }
  .pwa-install-prompt .pwa-subtitle { font-size: 11px; }
  .pwa-install-prompt .pwa-btn { padding: 7px 10px; font-size: 12px; }
}
]]></b:skin>

<b:template-skin>
<![CDATA[
]]>
</b:template-skin>

</head>

<body expr:class='&quot;loading &quot; + data:blog.pageType'>

<header class='site-header'>
  <div class='container header-inner'>
    <a class='logo' expr:href='data:blog.homepageUrl'>
      <span class='dot'/>
      <span>يلا شوت</span>
    </a>
    <b:section class='nav-section' id='nav-section' showaddelement='false'>
      <b:widget id='LinkList1' locked='true' title='القائمة الرئيسية' type='LinkList' version='2' visible='true'>
        <b:includable id='main'>
          <nav class='nav' expr:id='&quot;nav-&quot; + data:widget.instanceId'>
            <b:loop values='data:links' var='link'>
              <a expr:href='data:link.target'><data:link.name/></a>
            </b:loop>
          </nav>
        </b:includable>
      </b:widget>
    </b:section>
    <button class='menu-toggle' onclick='document.querySelector(&quot;.nav&quot;).classList.toggle(&quot;open&quot;)' aria-label='القائمة'>☰</button>
  </div>
</header>

<main class='container'>

  <b:if cond='data:blog.pageType == &quot;index&quot;'>

    <section class='page-title'>
      <h1>جدول المباريات<span class='live-indicator'>تحديث كل ساعة</span></h1>
      <div class='clock'>بتوقيت القاهرة · <span id='liveClock'/></div>
    </section>

    <div class='stats-bar' id='statsBar'>
      <div class='stat'>إجمالي: <strong id='statTotal'>-</strong></div>
      <div class='stat'>🔴 مباشر: <strong id='statLive'>-</strong></div>
      <div class='stat'>🟢 لم تبدأ: <strong id='statUpcoming'>-</strong></div>
      <div class='stat'>⚫ انتهت: <strong id='statFinished'>-</strong></div>
    </div>

    <nav class='schedule-tabs'>
      <button data-tab='yesterday'>مباريات الأمس</button>
      <button data-tab='today' class='active'>مباريات اليوم</button>
      <button data-tab='tomorrow'>مباريات الغد</button>
    </nav>

    <div class='error-banner' id='errorBanner' style='display:none'>
      ⚠ تعذّر تحميل البيانات. تحقق من Worker URL أو اتصال الإنترنت.
    </div>

    <section class='matches' id='matchesGrid'>
      <div class='empty-state'>⏳ جاري تحميل المباريات...</div>
    </section>

    <p class='last-update' id='lastUpdate'></p>

    <div class='divider'/>

    <section class='section-head'>
      <h2>آخر الأخبار</h2>
      <a expr:href='data:blog.homepageUrl + &quot;search?max-results=10&quot;'>المزيد ←</a>
    </section>

    <section class='news-grid'>
      <b:section class='home-posts' id='home-posts' showaddelement='yes'>
        <b:widget id='Blog1' locked='false' title='مشاركات المدونة' type='Blog' version='2' visible='true'>
          <b:includable id='main'>
            <b:loop values='data:posts' var='post'>
              <article class='news-card'>
                <b:if cond='data:post.featuredImage'>
                  <img class='thumb' expr:src='data:post.featuredImage' expr:alt='data:post.title'/>
                </b:if>
                <div class='body'>
                  <h3><a expr:href='data:post.url'><data:post.title/></a></h3>
                  <div class='meta'><data:post.date/></div>
                </div>
              </article>
            </b:loop>
          </b:includable>
        </b:widget>
      </b:section>
    </section>

  </b:if>

  <b:if cond='data:blog.pageType == &quot;item&quot; or data:blog.pageType == &quot;archive&quot; or data:blog.pageType == &quot;static_page&quot;'>

    <section class='section-head'>
      <h2><data:blog.pageName/></h2>
    </section>

    <section class='posts-list'>
      <b:section class='post-section' id='post-section' showaddelement='yes'>
        <b:widget id='Blog2' locked='false' title='مشاركات المدونة' type='Blog' version='2' visible='true'>
          <b:includable id='main'>
            <b:loop values='data:posts' var='post'>
              <article class='post-card'>
                <h2><a expr:href='data:post.url'><data:post.title/></a></h2>
                <div class='post-body'><data:post.body/></div>
                <div class='post-footer'><data:post.date/> · <data:post.author/></div>
              </article>
            </b:loop>
          </b:includable>
        </b:widget>
      </b:section>
    </section>

  </b:if>

</main>

<!-- PWA Install Prompt (Android/Desktop Chrome) -->
<div class='pwa-install-prompt hidden' id='pwaInstallPrompt'>
  <img class='pwa-icon' src='https://kooora.mexcbingx15.workers.dev/icon-192.png' alt='يلا شوت'/>
  <div class='pwa-content'>
    <div class='pwa-title'>ثبّت تطبيق يلا شوت</div>
    <div class='pwa-subtitle'>وصول سريع + إشعارات المباريات</div>
  </div>
  <div class='pwa-actions'>
    <button class='pwa-btn pwa-btn-secondary' id='pwaDismissBtn'>لاحقاً</button>
    <button class='pwa-btn pwa-btn-primary' id='pwaInstallBtn'>تثبيت</button>
  </div>
</div>

<!-- iOS Safari Install Instructions -->
<div class='ios-install-help hidden' id='iosInstallHelp'>
  <button class='ios-close' id='iosCloseBtn' aria-label='إغلاق'>✕</button>
  <strong>📲 تثبيت التطبيق على iPhone/iPad:</strong>
  <ol>
    <li>اضغط على زر <strong>المشاركة</strong> أسفل الشاشة</li>
    <li>اختر <strong>&quot;إضافة إلى الشاشة الرئيسية&quot;</strong></li>
    <li>اضغط <strong>&quot;إضافة&quot;</strong> في الأعلى</li>
  </ol>
</div>

<footer class='site-footer'>
  <div class='container'>
    © <data:blog.title/> · جميع الحقوق محفوظة
  </div>
</footer>

<script>
/* ====================================================================
   الإعدادات (تم تعديلها لرابطك)
   ==================================================================== */
var WORKER_URL = 'https://kooora.mexcbingx15.workers.dev';

var TELEGRAM_CONFIG = {
  username: 'gmt_apt',
  url: 'https://t.me/gmt_apt',
  name: 'GMT APT',
  description: 'اشترك لتصلك تنبيهات المباريات والروابط أولاً بأول'
};

var TG_INSERT_AFTER = [2, 5];
var REFRESH_INTERVAL = 3600000; // ساعة

/* ===== Service Worker Registration ===== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function(){
    navigator.serviceWorker.register(WORKER_URL + '/sw.js', { scope: '/' })
      .then(function(reg){ console.log('[PWA] SW registered:', reg.scope); })
      .catch(function(err){ console.warn('[PWA] SW failed:', err); });
  });
}

/* ===== PWA Install Prompt ===== */
var deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', function(e){
  e.preventDefault();
  deferredInstallPrompt = e;
  if (!localStorage.getItem('pwa-dismissed')) {
    setTimeout(function(){
      var prompt = document.getElementById('pwaInstallPrompt');
      if (prompt && deferredInstallPrompt) prompt.classList.remove('hidden');
    }, 30000);
  }
});
document.getElementById('pwaInstallBtn').addEventListener('click', function(){
  var prompt = document.getElementById('pwaInstallPrompt');
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(function(choice){
    if (choice.outcome === 'accepted') prompt.classList.add('hidden');
    deferredInstallPrompt = null;
  });
});
document.getElementById('pwaDismissBtn').addEventListener('click', function(){
  document.getElementById('pwaInstallPrompt').classList.add('hidden');
  localStorage.setItem('pwa-dismissed', '1');
});
window.addEventListener('appinstalled', function(){
  document.getElementById('pwaInstallPrompt').classList.add('hidden');
});

/* ===== iOS Detection ===== */
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isInStandaloneMode = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;
if (isIOS && !isInStandaloneMode && !localStorage.getItem('ios-help-dismissed')) {
  setTimeout(function(){
    document.getElementById('iosInstallHelp').classList.remove('hidden');
  }, 30000);
}
document.getElementById('iosCloseBtn').addEventListener('click', function(){
  document.getElementById('iosInstallHelp').classList.add('hidden');
  localStorage.setItem('ios-help-dismissed', '1');
});

/* ===== Matches Loading ===== */
var MATCHES_DATA = null;
var ACTIVE_TAB = 'today';

async function loadMatches(){
  try {
    var res = await fetch(WORKER_URL + '/scrape/all', { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    MATCHES_DATA = await res.json();
    if (MATCHES_DATA.telegram) TELEGRAM_CONFIG = Object.assign(TELEGRAM_CONFIG, MATCHES_DATA.telegram);
    renderStats();
    renderTab(ACTIVE_TAB);
    updateLastUpdate(MATCHES_DATA.scraped_at);
    document.getElementById('errorBanner').style.display = 'none';
  } catch (e) {
    document.getElementById('errorBanner').style.display = 'block';
    document.getElementById('errorBanner').textContent = '⚠ تعذّر تحميل البيانات: ' + e.message;
    console.error('Load error:', e);
  }
}

function renderStats(){
  if (!MATCHES_DATA || !MATCHES_DATA.stats) return;
  var s = MATCHES_DATA.stats;
  document.getElementById('statTotal').textContent = s.total;
  document.getElementById('statLive').textContent = s.by_status.live;
  document.getElementById('statUpcoming').textContent = s.by_status.upcoming;
  document.getElementById('statFinished').textContent = s.by_status.finished;
}

function renderMatch(m){
  var watchLabel = m.status === 'finished' ? 'إعادة المباراة' : 'شاهد المباراة';
  return ''
    + '<article class="match-card">'
    + '  <div class="match-row">'
    + '    <div class="team home">'
    + '      <span class="name">' + esc(m.home_team.name) + '</span>'
    + '      <img src="' + esc(m.home_team.logo) + '" alt="' + esc(m.home_team.name) + '" onerror="this.style.opacity=.3"/>'
    + '    </div>'
    + '    <div class="score">'
    + '      <div class="time">' + esc(m.time) + '</div>'
    + '      <div class="result">' + esc(m.score.display) + '</div>'
    + '    </div>'
    + '    <div class="team away">'
    + '      <img src="' + esc(m.away_team.logo) + '" alt="' + esc(m.away_team.name) + '" onerror="this.style.opacity=.3"/>'
    + '      <span class="name">' + esc(m.away_team.name) + '</span>'
    + '    </div>'
    + '  </div>'
    + '  <div class="match-meta">'
    + (m.channel ? '    <span class="badge">' + esc(m.channel) + '</span>' : '')
    + (m.competition ? '    <span class="badge">' + esc(m.competition) + '</span>' : '')
    + '    <span class="status ' + m.status + '">' + esc(m.status_label) + '</span>'
    + '  </div>'
    + (m.watch_url ? '  <a class="watch-btn" href="' + esc(m.watch_url) + '" target="_blank" rel="noopener">' + watchLabel + '</a>' : '')
    + '</article>';
}

function renderTelegramCard(){
  var tg = TELEGRAM_CONFIG;
  return ''
    + '<div class="tg-card">'
    + '  <div class="tg-icon">'
    + '    <svg viewBox="0 0 24 24"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>'
    + '  </div>'
    + '  <h3>📲 لا تفوّت أي مباراة!</h3>'
    + '  <p>' + esc(tg.description) + '</p>'
    + '  <div class="tg-channel">@' + esc(tg.username) + '</div>'
    + '  <a class="tg-btn" href="' + esc(tg.url) + '" target="_blank" rel="noopener">اشترك الآن</a>'
    + '</div>';
}

function renderTab(tab){
  var grid = document.getElementById('matchesGrid');
  var data = (MATCHES_DATA && MATCHES_DATA.matches && MATCHES_DATA.matches[tab]) || [];
  if (data.length === 0) {
    grid.innerHTML = '<div class="empty-state">لا توجد مباريات في هذا اليوم</div>';
    return;
  }
  var html = '';
  data.forEach(function(m, idx){
    html += renderMatch(m);
    if (TG_INSERT_AFTER.indexOf(idx) !== -1) html += renderTelegramCard();
  });
  grid.innerHTML = html;
}

function updateLastUpdate(iso){
  if (!iso) return;
  var dt = new Date(iso);
  var txt = new Intl.DateTimeFormat('ar-EG', { timeZone: 'Africa/Cairo', dateStyle: 'medium', timeStyle: 'short' }).format(dt);
  document.getElementById('lastUpdate').innerHTML = 'آخر تحديث: <strong>' + txt + '</strong> · التحديث التالي بعد ساعة';
}

function esc(s){
  if (s == null) return '';
  return String(s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

document.querySelectorAll('.schedule-tabs button').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.schedule-tabs button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    ACTIVE_TAB = btn.dataset.tab;
    if (MATCHES_DATA) renderTab(ACTIVE_TAB);
  });
});

function updateClock(){
  var d = new Date();
  var txt = new Intl.DateTimeFormat('ar-EG', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(d);
  var el = document.getElementById('liveClock');
  if (el) el.textContent = txt;
}

loadMatches();
updateClock();
setInterval(updateClock, 1000);
setInterval(loadMatches, REFRESH_INTERVAL);
</script>

</body>
</html>
