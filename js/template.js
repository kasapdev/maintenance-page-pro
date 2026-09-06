/* =====================================================================
   Maintenance Page Generator Pro — template.js
   Pure, dependency-free generator for the STANDALONE maintenance page.
   The exact same HTML string powers the live preview iframe (via srcdoc)
   and the exported maintenance.html download — so what you see is what
   you ship. No external network calls, no CDNs, system fonts only.
   Exposes: window.MP_TEMPLATE.build(config) -> full HTML document string.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- Minimal HTML escaper (template runs without WUS too) ---- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  /* Escape for use inside a JS string literal injected into the page. */
  function jsStr(s) {
    return JSON.stringify(String(s == null ? '' : s));
  }

  /* ---- Inline SVG icons for social platforms (currentColor) ---- */
  var SOCIAL_ICONS = {
    x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028ZM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
    website: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z"/></svg>'
  };

  var SOCIAL_LABELS = {
    x: 'X', instagram: 'Instagram', github: 'GitHub',
    linkedin: 'LinkedIn', discord: 'Discord', email: 'Email', website: 'Website'
  };

  /* ---- Build the <body> background CSS based on chosen style ---- */
  function backgroundCss(cfg) {
    var a = cfg.bgColor || '#0b1020';
    var b = cfg.bgColor2 || '#1e1b4b';
    var accent = cfg.accent || '#6366f1';
    switch (cfg.bgStyle) {
      case 'light':
        return [
          'background:' + a + ';',
          'background:linear-gradient(160deg,' + a + ' 0%, ' + b + ' 100%);',
          'background-size:200% 200%;animation:mpGradient 18s ease infinite;'
        ].join('');
      case 'solid':
        return 'background:' + a + ';';
      case 'mesh':
        return [
          'background-color:' + a + ';',
          'background-image:',
          'radial-gradient(at 18% 20%, ' + hexA(accent, .55) + ' 0px, transparent 50%),',
          'radial-gradient(at 82% 12%, ' + hexA(b, .50) + ' 0px, transparent 50%),',
          'radial-gradient(at 75% 82%, ' + hexA(accent, .40) + ' 0px, transparent 50%),',
          'radial-gradient(at 22% 78%, ' + hexA(b, .45) + ' 0px, transparent 50%);',
          'background-size:160% 160%;animation:mpGradient 22s ease infinite;'
        ].join('');
      case 'dark':
      default:
        return [
          'background:' + a + ';',
          'background:linear-gradient(135deg,' + a + ' 0%, ' + b + ' 55%, ' + a + ' 100%);',
          'background-size:240% 240%;animation:mpGradient 20s ease infinite;'
        ].join('');
    }
  }

  /* Convert #rrggbb to rgba() with alpha (for mesh blobs). */
  function hexA(hex, alpha) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n) || h.length !== 6) return 'rgba(99,102,241,' + alpha + ')';
    var r = (n >> 16) & 255, g = (n >> 8) & 255, bl = n & 255;
    return 'rgba(' + r + ',' + g + ',' + bl + ',' + alpha + ')';
  }

  /* Light backgrounds need dark text for contrast. */
  function isLightBg(cfg) {
    if (cfg.bgStyle === 'light') return true;
    if (cfg.bgStyle === 'solid' || cfg.bgStyle === 'mesh') return luminance(cfg.bgColor) > 0.62;
    return false;
  }
  function luminance(hex) {
    var h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (isNaN(n) || h.length !== 6) return 0;
    var r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /* Block script-executing URL schemes (javascript:, data:, vbscript:, file:)
     from ever landing in an exported page's href — a pasted link here becomes
     a live, clickable link on the real deployed site for every visitor. Plain
     http(s)/mailto links and bare domains (no scheme) are left untouched. */
  function isDangerousHref(href) {
    return /^\s*(javascript|data|vbscript|file):/i.test(String(href || ''));
  }

  /* ---- Social row markup ---- */
  function socialMarkup(cfg) {
    var links = (cfg.socials || []).filter(function (s) { return s && s.url && s.url.trim(); });
    if (!links.length) return '';
    var items = links.map(function (s) {
      var plat = SOCIAL_ICONS[s.platform] ? s.platform : 'website';
      var url = s.url.trim();
      var href = plat === 'email' ? (url.indexOf('mailto:') === 0 ? url : 'mailto:' + url) : url;
      if (isDangerousHref(href)) return '';
      var label = SOCIAL_LABELS[plat] || 'Link';
      return '<a class="mp-social" href="' + esc(href) + '" aria-label="' + esc(label) + '"' +
        (plat === 'email' ? '' : ' target="_blank" rel="noopener noreferrer"') + '>' +
        SOCIAL_ICONS[plat] + '</a>';
    }).filter(Boolean).join('');
    if (!items) return '';
    return '<nav class="mp-socials" aria-label="Social links">' + items + '</nav>';
  }

  /* ---- The countdown script (runs INSIDE the exported page) ---- */
  function countdownScript(cfg) {
    if (!cfg.countdown || !cfg.deadline) return '';
    var deadlineMs = new Date(cfg.deadline).getTime();
    if (isNaN(deadlineMs)) return '';
    return [
      '<script>(function(){',
      '  var target=' + deadlineMs + ';',
      '  var root=document.getElementById("mp-countdown");',
      '  if(!root)return;',
      '  var cells={d:document.getElementById("mp-d"),h:document.getElementById("mp-h"),m:document.getElementById("mp-m"),s:document.getElementById("mp-s")};',
      '  function pad(n){return (n<10?"0":"")+n;}',
      '  function tick(){',
      '    var diff=target-Date.now();',
      '    if(diff<=0){',
      '      root.innerHTML="<div class=\\"mp-back\\" role=\\"status\\">'+'\\u2728 We are back!</div>";',
      '      clearInterval(timer);return;',
      '    }',
      '    var s=Math.floor(diff/1000);',
      '    cells.d.textContent=pad(Math.floor(s/86400));',
      '    cells.h.textContent=pad(Math.floor(s%86400/3600));',
      '    cells.m.textContent=pad(Math.floor(s%3600/60));',
      '    cells.s.textContent=pad(s%60);',
      '  }',
      '  tick();var timer=setInterval(tick,1000);',
      '})();</' + 'script>'
    ].join('\n');
  }

  function countdownMarkup(cfg) {
    if (!cfg.countdown || !cfg.deadline) return '';
    if (isNaN(new Date(cfg.deadline).getTime())) return '';
    function unit(id, label) {
      return '<div class="mp-unit"><span class="mp-num" id="' + id + '">00</span><span class="mp-label">' + label + '</span></div>';
    }
    return '<div class="mp-countdown" id="mp-countdown" aria-live="polite">' +
      unit('mp-d', 'Days') + '<span class="mp-sep">:</span>' +
      unit('mp-h', 'Hours') + '<span class="mp-sep">:</span>' +
      unit('mp-m', 'Minutes') + '<span class="mp-sep">:</span>' +
      unit('mp-s', 'Seconds') + '</div>';
  }

  function progressMarkup(cfg) {
    if (!cfg.progress) return '';
    var pct = Math.max(0, Math.min(100, Number(cfg.progressVal) || 0));
    return '<div class="mp-progress-wrap">' +
      '<div class="mp-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Progress">' +
      '<span class="mp-progress-bar" style="width:' + pct + '%"></span></div>' +
      '<span class="mp-progress-pct">' + pct + '% complete</span></div>';
  }

  /* ---- Icon markup: emoji/text glyph in a glass disc ---- */
  function iconMarkup(cfg) {
    var icon = (cfg.icon || '🛠️').trim() || '🛠️';
    return '<div class="mp-icon" aria-hidden="true"><span>' + esc(icon) + '</span></div>';
  }

  /* ===================================================================
     build(config) -> complete standalone HTML document string
     =================================================================== */
  function build(cfg) {
    cfg = cfg || {};
    var lightText = isLightBg(cfg);
    var accent = cfg.accent || '#6366f1';
    var title = cfg.title || 'We will be right back';
    var message = cfg.message || '';
    var footer = cfg.footer || '';
    var custom = cfg.customCss || '';

    var textColor = lightText ? '#10131f' : '#f4f5fa';
    var subColor = lightText ? 'rgba(16,19,31,.66)' : 'rgba(244,245,250,.74)';
    var cardBg = lightText ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.06)';
    var cardBorder = lightText ? 'rgba(16,19,31,.10)' : 'rgba(255,255,255,.12)';
    var chipBg = lightText ? 'rgba(16,19,31,.05)' : 'rgba(255,255,255,.07)';

    var css = [
      '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}',
      'html,body{height:100%;}',
      'body{',
      '  font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji",sans-serif;',
      '  color:' + textColor + ';min-height:100vh;display:grid;place-items:center;padding:24px;',
      '  -webkit-font-smoothing:antialiased;line-height:1.55;overflow-x:hidden;',
      '  ' + backgroundCss(cfg),
      '}',
      '@keyframes mpGradient{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}',
      '@keyframes mpFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}',
      '@keyframes mpRise{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:none;}}',
      '@keyframes mpStripes{from{background-position:0 0;}to{background-position:40px 0;}}',
      '.mp-card{',
      '  position:relative;width:100%;max-width:560px;text-align:center;padding:48px 40px;',
      '  background:' + cardBg + ';border:1px solid ' + cardBorder + ';border-radius:28px;',
      '  -webkit-backdrop-filter:blur(22px) saturate(150%);backdrop-filter:blur(22px) saturate(150%);',
      '  box-shadow:0 30px 80px -24px rgba(0,0,0,.5);animation:mpRise .7s cubic-bezier(.16,1,.3,1) both;',
      '}',
      '.mp-icon{width:96px;height:96px;margin:0 auto 28px;border-radius:50%;display:grid;place-items:center;',
      '  font-size:46px;line-height:1;background:' + chipBg + ';border:1px solid ' + cardBorder + ';',
      '  box-shadow:0 0 0 8px ' + hexA(accent, lightText ? .12 : .16) + ';animation:mpFloat 5s ease-in-out infinite;}',
      '.mp-icon span{filter:drop-shadow(0 4px 10px rgba(0,0,0,.25));}',
      '.mp-title{font-size:clamp(1.7rem,1.1rem+2.6vw,2.6rem);font-weight:800;letter-spacing:-.02em;line-height:1.12;',
      '  background:linear-gradient(135deg,' + textColor + ',' + accent + ');-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;}',
      '.mp-message{margin-top:16px;font-size:clamp(1rem,.95rem+.3vw,1.12rem);color:' + subColor + ';max-width:46ch;margin-left:auto;margin-right:auto;}',
      /* countdown */
      '.mp-countdown{display:flex;align-items:flex-start;justify-content:center;gap:8px;margin-top:32px;flex-wrap:wrap;}',
      '.mp-unit{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:62px;padding:12px 8px;',
      '  background:' + chipBg + ';border:1px solid ' + cardBorder + ';border-radius:16px;}',
      '.mp-num{font-size:clamp(1.5rem,1.2rem+1vw,2rem);font-weight:800;font-variant-numeric:tabular-nums;color:' + textColor + ';letter-spacing:-.02em;}',
      '.mp-label{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:' + subColor + ';font-weight:700;}',
      '.mp-sep{font-size:1.6rem;font-weight:800;color:' + accent + ';align-self:center;padding-top:6px;}',
      '.mp-back{margin-top:32px;font-size:1.5rem;font-weight:800;color:' + accent + ';animation:mpRise .5s ease both;}',
      /* progress */
      '.mp-progress-wrap{margin-top:32px;}',
      '.mp-progress{height:10px;border-radius:99px;background:' + chipBg + ';border:1px solid ' + cardBorder + ';overflow:hidden;}',
      '.mp-progress-bar{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,' + accent + ',' + hexA(accent, .65) + ');',
      '  background-image:linear-gradient(90deg,' + accent + ',' + hexA(accent, .7) + '),repeating-linear-gradient(45deg,rgba(255,255,255,.18) 0 10px,transparent 10px 20px);',
      '  background-size:auto,40px 40px;animation:mpStripes 1s linear infinite;transition:width .6s cubic-bezier(.16,1,.3,1);}',
      '.mp-progress-pct{display:block;margin-top:10px;font-size:13px;font-weight:600;color:' + subColor + ';}',
      /* socials */
      '.mp-socials{display:flex;justify-content:center;gap:12px;margin-top:32px;flex-wrap:wrap;}',
      '.mp-social{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;color:' + textColor + ';',
      '  background:' + chipBg + ';border:1px solid ' + cardBorder + ';text-decoration:none;transition:transform .2s,background .2s,color .2s,border-color .2s;}',
      '.mp-social:hover{transform:translateY(-3px);background:' + accent + ';border-color:' + accent + ';color:#fff;}',
      '.mp-social svg{width:20px;height:20px;}',
      /* footer */
      '.mp-footer{margin-top:36px;font-size:13px;color:' + subColor + ';}',
      '@media(max-width:480px){.mp-card{padding:36px 22px;}.mp-unit{min-width:54px;}.mp-sep{display:none;}}',
      '@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}'
    ].join('\n');

    var body = [
      '<main class="mp-card">',
      iconMarkup(cfg),
      '<h1 class="mp-title">' + esc(title) + '</h1>',
      message ? '<p class="mp-message">' + esc(message) + '</p>' : '',
      countdownMarkup(cfg),
      progressMarkup(cfg),
      socialMarkup(cfg),
      footer ? '<footer class="mp-footer">' + esc(footer) + '</footer>' : '',
      '</main>'
    ].filter(Boolean).join('\n');

    var doc = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta name="robots" content="noindex">',
      '<title>' + esc(title) + '</title>',
      '<meta name="description" content="' + esc(message || title) + '">',
      '<style>',
      css,
      (custom ? '\n/* ----- Custom CSS ----- */\n' + custom : ''),
      '</style>',
      '</head>',
      '<body>',
      body,
      countdownScript(cfg),
      '</body>',
      '</html>'
    ].join('\n');

    return doc;
  }

  window.MP_TEMPLATE = {
    build: build,
    SOCIAL_LABELS: SOCIAL_LABELS,
    SOCIAL_ICONS: SOCIAL_ICONS
  };
})();
