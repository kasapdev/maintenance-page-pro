/* =====================================================================
   Maintenance Page Generator Pro — app.js
   Wires the editor UI to the live preview iframe and the exporter.
   Classic script (no import/export). Depends on window.WUS (core.js) and
   window.MP_TEMPLATE (template.js), both loaded before this file.
   ===================================================================== */
(function () {
  'use strict';

  var WUS = window.WUS;
  var MP = window.MP_TEMPLATE;
  var STORE_KEY = 'maint.config'; // sub-prefixed under WUS namespace ("wus.maint.config")

  /* ---- Curated emoji options for the icon picker ---- */
  var EMOJIS = ['🛠️', '⚙️', '🚀', '⏳', '🔧', '🚧', '💡', '🔨', '🧰', '☕', '✨', '🛰️'];

  /* ---- Default config ---- */
  function defaults() {
    return {
      icon: '🛠️',
      title: 'We will be right back',
      message: "We're performing some scheduled maintenance to make things even better. We'll be back online shortly — thanks for your patience.",
      footer: '© ' + new Date().getFullYear() + ' Your Company — All rights reserved',
      countdown: false,
      deadline: '',
      progress: false,
      progressVal: 65,
      bgStyle: 'dark',
      bgColor: '#0b1020',
      bgColor2: '#1e1b4b',
      accent: '#6366f1',
      socials: [],
      customCss: ''
    };
  }

  /* ---- A realistic example to load on demand ---- */
  function example() {
    var d = new Date(Date.now() + 1000 * 60 * 60 * 26 + 1000 * 60 * 35); // ~26h35m out
    return {
      icon: '🚀',
      title: 'Launching something better',
      message: "Our team is rolling out a major upgrade with faster load times and a fresh new look. We'll be back before you know it.",
      footer: '© ' + new Date().getFullYear() + ' Northwind Studio · Made with care',
      countdown: true,
      deadline: toLocalInput(d),
      progress: true,
      progressVal: 78,
      bgStyle: 'mesh',
      bgColor: '#0a0a18',
      bgColor2: '#3b0764',
      accent: '#a855f7',
      socials: [
        { platform: 'x', url: 'https://x.com/northwind' },
        { platform: 'github', url: 'https://github.com/northwind' },
        { platform: 'email', url: 'hello@northwind.studio' }
      ],
      customCss: ''
    };
  }

  /* ---- Format a Date into the value a datetime-local input expects ---- */
  function toLocalInput(d) {
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) +
      'T' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  /* ---- DOM refs ---- */
  var $ = function (id) { return document.getElementById(id); };
  var els = {
    form: $('editorForm'),
    emojiGrid: $('emojiGrid'),
    iconCustom: $('iconCustom'),
    title: $('fTitle'),
    message: $('fMessage'),
    footer: $('fFooter'),
    countdown: $('fCountdown'),
    countdownField: $('countdownField'),
    deadline: $('fDeadline'),
    progress: $('fProgress'),
    progressField: $('progressField'),
    progressVal: $('fProgressVal'),
    progressOut: $('progressOut'),
    bgStyle: $('fBgStyle'),
    accent: $('fAccent'),
    accentHex: $('fAccentHex'),
    bgColor: $('fBgColor'),
    bgColorHex: $('fBgColorHex'),
    bgColor2: $('fBgColor2'),
    bgColor2Hex: $('fBgColor2Hex'),
    bgColorField: $('bgColorField'),
    bgColor2Field: $('bgColor2Field'),
    socialList: $('socialList'),
    addSocial: $('btnAddSocial'),
    customCss: $('fCustomCss'),
    frame: $('previewFrame'),
    workspace: document.querySelector('.workspace'),
    tabEdit: $('tabEdit'),
    tabPreview: $('tabPreview')
  };

  /* Current working state */
  var state = defaults();

  /* ===================================================================
     Rendering
     =================================================================== */
  var renderPreview = WUS.debounce(function () {
    try {
      var html = MP.build(state);
      els.frame.srcdoc = html;
    } catch (e) {
      WUS.toast('Preview failed to render', 'error');
      if (window.console) console.error(e);
    }
  }, 300);

  /* Build the emoji picker buttons once */
  function buildEmojiGrid() {
    els.emojiGrid.innerHTML = '';
    EMOJIS.forEach(function (emo) {
      var b = WUS.el('button', {
        type: 'button',
        'aria-label': 'Use icon ' + emo,
        'aria-pressed': 'false',
        text: emo
      });
      b.addEventListener('click', function () {
        state.icon = emo;
        els.iconCustom.value = '';
        syncEmojiPressed();
        save(); renderPreview();
      });
      els.emojiGrid.appendChild(b);
    });
  }
  function syncEmojiPressed() {
    var btns = els.emojiGrid.querySelectorAll('button');
    btns.forEach(function (b) {
      b.setAttribute('aria-pressed', b.textContent === state.icon ? 'true' : 'false');
    });
  }

  /* ===================================================================
     Social link rows
     =================================================================== */
  function platformOptions(selected) {
    var keys = ['x', 'instagram', 'github', 'linkedin', 'discord', 'email', 'website'];
    return keys.map(function (k) {
      var lbl = MP.SOCIAL_LABELS[k] || k;
      return '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + lbl + '</option>';
    }).join('');
  }

  function renderSocials() {
    els.socialList.innerHTML = '';
    if (!state.socials.length) {
      var empty = WUS.el('div', { class: 'social-empty', text: 'No links yet — add your socials so visitors can reach you.' });
      els.socialList.appendChild(empty);
      return;
    }
    state.socials.forEach(function (s, i) {
      var row = WUS.el('div', { class: 'social-row' });

      var sel = WUS.el('select', { 'aria-label': 'Platform' , html: platformOptions(s.platform) });
      sel.addEventListener('change', function () {
        state.socials[i].platform = sel.value;
        var ph = sel.value === 'email' ? 'you@example.com' : 'https://…';
        input.placeholder = ph;
        save(); renderPreview();
      });

      var input = WUS.el('input', {
        type: sel.value === 'email' ? 'text' : 'url',
        value: s.url || '',
        placeholder: s.platform === 'email' ? 'you@example.com' : 'https://…',
        'aria-label': 'Link URL'
      });
      input.addEventListener('input', function () {
        state.socials[i].url = input.value;
        save(); renderPreview();
      });

      var del = WUS.el('button', {
        type: 'button', class: 'btn btn--icon btn--ghost', 'aria-label': 'Remove link',
        html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>'
      });
      del.addEventListener('click', function () {
        state.socials.splice(i, 1);
        renderSocials(); save(); renderPreview();
      });

      row.appendChild(sel); row.appendChild(input); row.appendChild(del);
      els.socialList.appendChild(row);
    });
  }

  /* ===================================================================
     Two-way sync: form -> state, state -> form
     =================================================================== */
  function applyStateToForm() {
    els.title.value = state.title;
    els.message.value = state.message;
    els.footer.value = state.footer;
    els.iconCustom.value = (EMOJIS.indexOf(state.icon) === -1) ? state.icon : '';
    els.countdown.checked = !!state.countdown;
    els.deadline.value = state.deadline || '';
    els.progress.checked = !!state.progress;
    els.progressVal.value = state.progressVal;
    els.progressOut.textContent = state.progressVal;
    els.bgStyle.value = state.bgStyle;
    setColor('accent', state.accent);
    setColor('bgColor', state.bgColor);
    setColor('bgColor2', state.bgColor2);
    els.customCss.value = state.customCss;

    syncEmojiPressed();
    renderSocials();
    updateConditionalFields();
  }

  function setColor(name, val) {
    els[name].value = val;
    els[name + 'Hex'].value = val;
  }

  /* Show/hide dependent fields */
  function updateConditionalFields() {
    els.countdownField.hidden = !state.countdown;
    els.progressField.hidden = !state.progress;
    // Solid background only uses one color; gradient end hidden.
    var oneColor = state.bgStyle === 'solid';
    els.bgColor2Field.style.display = oneColor ? 'none' : '';
    // Light preset is fixed; keep pickers available for fine-tuning all styles.
  }

  /* ===================================================================
     Persistence
     =================================================================== */
  var save = WUS.debounce(function () {
    WUS.store.set(STORE_KEY, state);
  }, 250);

  function load() {
    var saved = WUS.store.get(STORE_KEY, null);
    if (saved && typeof saved === 'object') {
      state = Object.assign(defaults(), saved);
      if (!Array.isArray(state.socials)) state.socials = [];
    }
  }

  /* ===================================================================
     Export / copy
     =================================================================== */
  function currentHtml() { return MP.build(state); }

  function exportHtml() {
    try {
      WUS.download('maintenance.html', currentHtml(), 'text/html;charset=utf-8');
      WUS.toast('Downloaded maintenance.html');
    } catch (e) {
      WUS.toast('Export failed', 'error');
    }
  }

  function copyHtml() {
    WUS.copy(currentHtml(), 'HTML copied — paste it into a file & deploy');
  }

  function resetAll() {
    if (!window.confirm('Reset everything to the default maintenance page? This clears your saved config.')) return;
    state = defaults();
    WUS.store.remove(STORE_KEY);
    applyStateToForm();
    renderPreview();
    WUS.toast('Reset to defaults');
  }

  function loadExample() {
    state = example();
    applyStateToForm();
    save();
    renderPreview();
    WUS.toast('Example loaded — tweak away');
  }

  /* ===================================================================
     Help modal
     =================================================================== */
  var helpModal = $('helpModal');
  function openHelp() { helpModal.hidden = false; var c = $('helpClose'); if (c) c.focus(); }
  function closeHelp() { helpModal.hidden = true; }

  /* ===================================================================
     Mobile Edit/Preview toggle
     =================================================================== */
  function setView(view) {
    els.workspace.setAttribute('data-view', view);
    var editing = view === 'edit';
    els.tabEdit.setAttribute('aria-selected', editing ? 'true' : 'false');
    els.tabEdit.classList.toggle('is-active', editing);
    els.tabPreview.setAttribute('aria-selected', editing ? 'false' : 'true');
    els.tabPreview.classList.toggle('is-active', !editing);
  }

  /* ===================================================================
     Event wiring
     =================================================================== */
  function bind(elm, evt, key, transform) {
    if (!elm) return;
    elm.addEventListener(evt, function () {
      var v = transform ? transform(elm.value) : elm.value;
      state[key] = v;
      save(); renderPreview();
    });
  }

  function wireColor(name) {
    var picker = els[name], hex = els[name + 'Hex'];
    picker.addEventListener('input', function () {
      state[name] = picker.value;
      hex.value = picker.value;
      save(); renderPreview();
    });
    hex.addEventListener('input', function () {
      var v = hex.value.trim();
      if (/^#?[0-9a-fA-F]{6}$/.test(v)) {
        if (v[0] !== '#') v = '#' + v;
        state[name] = v;
        picker.value = v;
        save(); renderPreview();
      }
    });
  }

  function wireEvents() {
    bind(els.title, 'input', 'title');
    bind(els.message, 'input', 'message');
    bind(els.footer, 'input', 'footer');

    els.iconCustom.addEventListener('input', function () {
      var v = els.iconCustom.value.trim();
      if (v) { state.icon = v; syncEmojiPressed(); save(); renderPreview(); }
      else { syncEmojiPressed(); }
    });

    els.countdown.addEventListener('change', function () {
      state.countdown = els.countdown.checked;
      if (state.countdown && !state.deadline) {
        // Default to 24h out for a sensible starting point.
        state.deadline = toLocalInput(new Date(Date.now() + 864e5));
        els.deadline.value = state.deadline;
      }
      updateConditionalFields(); save(); renderPreview();
    });
    bind(els.deadline, 'input', 'deadline');

    els.progress.addEventListener('change', function () {
      state.progress = els.progress.checked;
      updateConditionalFields(); save(); renderPreview();
    });
    els.progressVal.addEventListener('input', function () {
      state.progressVal = Number(els.progressVal.value);
      els.progressOut.textContent = state.progressVal;
      save(); renderPreview();
    });

    els.bgStyle.addEventListener('change', function () {
      state.bgStyle = els.bgStyle.value;
      applyBgPreset(state.bgStyle);
      updateConditionalFields();
      applyStateToForm();
      save(); renderPreview();
    });

    wireColor('accent');
    wireColor('bgColor');
    wireColor('bgColor2');

    bind(els.customCss, 'input', 'customCss');

    els.addSocial.addEventListener('click', function () {
      state.socials.push({ platform: 'x', url: '' });
      renderSocials(); save();
    });

    // Toolbar
    $('btnExport').addEventListener('click', exportHtml);
    $('btnCopy').addEventListener('click', copyHtml);
    $('btnReset').addEventListener('click', resetAll);
    $('btnExample').addEventListener('click', loadExample);

    // Help modal
    var helpBtns = document.querySelectorAll('[data-shortcut-help]');
    helpBtns.forEach(function (b) { b.addEventListener('click', openHelp); });
    $('helpClose').addEventListener('click', closeHelp);
    helpModal.addEventListener('click', function (e) { if (e.target === helpModal) closeHelp(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !helpModal.hidden) closeHelp();
    });

    // Mobile tabs
    els.tabEdit.addEventListener('click', function () { setView('edit'); });
    els.tabPreview.addEventListener('click', function () { setView('preview'); });
  }

  /* When the user picks a background style, suggest tasteful default colors
     (only if they haven't customized for that style yet). */
  function applyBgPreset(style) {
    var presets = {
      dark: { bgColor: '#0b1020', bgColor2: '#1e1b4b' },
      light: { bgColor: '#f4f6fb', bgColor2: '#e7ecff' },
      mesh: { bgColor: '#0a0a18', bgColor2: '#3b0764' },
      solid: { bgColor: '#0f1117', bgColor2: '#0f1117' }
    };
    var p = presets[style];
    if (p) { state.bgColor = p.bgColor; state.bgColor2 = p.bgColor2; }
  }

  /* ===================================================================
     Keyboard shortcuts
     =================================================================== */
  function registerShortcuts() {
    WUS.registerShortcut('mod+e', function () { exportHtml(); }, 'Export standalone HTML');
    WUS.registerShortcut('mod+shift+c', function () { copyHtml(); }, 'Copy HTML to clipboard');
    WUS.registerShortcut('?', function () { openHelp(); }, 'Show keyboard shortcuts');
  }

  /* ===================================================================
     Init
     =================================================================== */
  function init() {
    try {
      load();
      buildEmojiGrid();
      wireEvents();
      registerShortcuts();
      applyStateToForm();
      renderPreview();
      // Default mobile view = edit.
      setView('edit');
    } catch (e) {
      if (window.console) console.error(e);
      WUS.toast('Something went wrong starting the app', 'error');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
