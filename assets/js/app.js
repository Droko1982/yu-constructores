/* =============================================================================
   YU Constructora · Lógica del sitio
   Autor: Dr. Mauricio Rodríguez Herrera
   ============================================================================= */
(function () {
  'use strict';

  var WA_NUMBER = '573205940466';
  var SUPPORTED = ['es', 'en', 'pt'];
  var DICT = window.YU_I18N || {};
  var lang = 'es';

  /*
    Las páginas de idioma viven en subcarpetas (/en/, /pt/), así que las rutas
    que arma el guion deben partir de la raíz del sitio y no de la página actual.
    La deducimos de la ruta de este mismo archivo.
  */
  var ASSET_BASE = (function () {
    var s = document.currentScript;
    if (s && s.src) return s.src.replace(/assets\/js\/app\.js(?:[?#].*)?$/, '');
    return '';
  })();

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------------- Tema -- */
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('yu-theme', t); } catch (e) {}
  }

  var themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ------------------------------------------------------------- Idiomas -- */
  function t(key) {
    var table = DICT[lang] || DICT.es || {};
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : ((DICT.es || {})[key] || '');
  }

  /*
    Cada idioma se sirve como página estática propia (/, /en/, /pt/), de modo que
    los buscadores indexan HTML ya traducido en lugar de texto que cambia por JS.
    Aquí solo se lee el idioma del documento para los textos que genera el guion
    (mensaje del cotizador, títulos de la galería y avisos del formulario).
  */
  function readLang() {
    var l = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
    return SUPPORTED.indexOf(l) > -1 ? l : 'es';
  }

  var langBox = $('#lang');
  var langBtn = $('#langBtn');
  if (langBtn && langBox) {
    langBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = langBox.classList.toggle('is-open');
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      langBox.classList.remove('is-open');
      langBtn.setAttribute('aria-expanded', 'false');
    });
    langBox.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        langBox.classList.remove('is-open');
        langBtn.setAttribute('aria-expanded', 'false');
        langBtn.focus();
      }
    });
  }

  /* -------------------------------------------------------- Menú y scroll -- */
  var header = $('#header');
  var burger = $('#burger');
  var mobileNav = $('#mobileNav');
  var toTop = $('#toTop');

  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
      burger.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
    });
    $$('a', mobileNav).forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('is-locked');
        burger.querySelector('use').setAttribute('href', '#i-menu');
      });
    });
  }

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-stuck', y > 12);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------- Enlace activo del menú */
  var navLinks = $$('#nav a');
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navObs.observe(s); });
  }

  /* ----------------------------------------------------- Aparición suave -- */
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        obs.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(function (el) { revObs.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* --------------------------------------------------- Carrusel del héroe -- */
  var heroImgs = $$('.hero__media img');
  var heroDots = $$('#heroDots button');
  var heroIx = 0;
  var heroTimer = null;

  function heroGo(i) {
    if (!heroImgs.length) return;
    heroIx = (i + heroImgs.length) % heroImgs.length;
    heroImgs.forEach(function (img, n) {
      if (n === heroIx && img.dataset.src && !img.src) img.src = img.dataset.src;
      img.classList.toggle('is-active', n === heroIx);
    });
    heroDots.forEach(function (d, n) { d.setAttribute('aria-current', n === heroIx ? 'true' : 'false'); });

    // Precarga la siguiente
    var nx = heroImgs[(heroIx + 1) % heroImgs.length];
    if (nx && nx.dataset.src && !nx.src) nx.src = nx.dataset.src;
  }

  function heroPlay() {
    if (heroTimer) clearInterval(heroTimer);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    heroTimer = setInterval(function () { heroGo(heroIx + 1); }, 6500);
  }

  heroDots.forEach(function (d, n) {
    d.addEventListener('click', function () { heroGo(n); heroPlay(); });
  });

  if (heroImgs.length > 1) {
    setTimeout(function () { heroGo(1); heroPlay(); }, 4000);
  }

  /* -------------------------------------------------- Filtros de proyectos -- */
  var filterBtns = $$('#filters button');
  var projectEls = $$('#projects .project');

  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      filterBtns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      projectEls.forEach(function (p) {
        p.classList.toggle('is-hidden', f !== 'all' && p.getAttribute('data-cat') !== f);
      });
    });
  });

  /* ------------------------------------------------------ Visor de galería -- */
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbTitle = $('#lbTitle');
  var lbMeta = $('#lbMeta');
  var lbThumbs = $('#lbThumbs');
  var lbState = { imgs: [], i: 0, key: '', loc: '' };
  var lastFocus = null;

  function lbRender() {
    if (!lbState.imgs.length) return;
    lbImg.src = lbState.imgs[lbState.i];
    lbImg.alt = t('prj.' + lbState.key + '.t') + ' — ' + (lbState.i + 1) + '/' + lbState.imgs.length;
    lbTitle.textContent = t('prj.' + lbState.key + '.t');
    lbMeta.textContent = lbState.loc + ' · ' + (lbState.i + 1) + '/' + lbState.imgs.length;
    $$('button', lbThumbs).forEach(function (b, n) {
      b.setAttribute('aria-current', n === lbState.i ? 'true' : 'false');
    });
  }

  function lbOpen(slug, count, key, loc) {
    lbState.imgs = [];
    for (var i = 1; i <= count; i++) {
      lbState.imgs.push(ASSET_BASE + 'assets/img/proyectos/' + slug + '-' + i + '.jpg');
    }
    lbState.i = 0;
    lbState.key = key;
    lbState.loc = loc;

    lbThumbs.innerHTML = '';
    lbState.imgs.forEach(function (src, n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', String(n + 1));
      var im = document.createElement('img');
      im.src = src;
      im.loading = 'lazy';
      im.alt = '';
      b.appendChild(im);
      b.addEventListener('click', function () { lbState.i = n; lbRender(); });
      lbThumbs.appendChild(b);
    });

    lastFocus = document.activeElement;
    lb.classList.add('is-open');
    document.body.classList.add('is-locked');
    lbRender();
    $('#lbClose').focus();
  }

  function lbClose() {
    lb.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    lbImg.src = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  projectEls.forEach(function (p) {
    p.addEventListener('click', function () {
      var locEl = $('.project__loc span', p);
      lbOpen(
        p.getAttribute('data-slug'),
        parseInt(p.getAttribute('data-count'), 10) || 1,
        p.getAttribute('data-key'),
        locEl ? locEl.textContent : ''
      );
    });
  });

  if (lb) {
    $('#lbClose').addEventListener('click', lbClose);
    $('#lbPrev').addEventListener('click', function () {
      lbState.i = (lbState.i - 1 + lbState.imgs.length) % lbState.imgs.length;
      lbRender();
    });
    $('#lbNext').addEventListener('click', function () {
      lbState.i = (lbState.i + 1) % lbState.imgs.length;
      lbRender();
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowLeft') { lbState.i = (lbState.i - 1 + lbState.imgs.length) % lbState.imgs.length; lbRender(); }
      if (e.key === 'ArrowRight') { lbState.i = (lbState.i + 1) % lbState.imgs.length; lbRender(); }
    });
  }

  /* ---------------------------------------------------- Cotizador rápido --- */
  var quoteForm = $('#quoteForm');
  var quotePreview = $('#quotePreview');
  var quoteSend = $('#quoteSend');

  function pick(name, prefix) {
    var el = quoteForm ? quoteForm.querySelector('input[name="' + name + '"]:checked') : null;
    return el ? t(prefix + el.value) : '';
  }

  function buildQuote() {
    var lines = [t('quote.msgIntro'), ''];
    var tipo = pick('tipo', 'quote.type');
    var estado = pick('estado', 'quote.stage');
    var inicio = pick('inicio', 'quote.when');
    var area = ($('#qArea') || {}).value;
    var city = (($('#qCity') || {}).value || '').trim();
    var name = (($('#qName') || {}).value || '').trim();
    var detail = (($('#qDetail') || {}).value || '').trim();

    if (tipo) lines.push('• ' + t('quote.msgType') + ': ' + tipo);
    if (area) lines.push('• ' + t('quote.msgArea') + ': ' + area + ' m²');
    if (city) lines.push('• ' + t('quote.msgCity') + ': ' + city);
    if (estado) lines.push('• ' + t('quote.msgStage') + ': ' + estado);
    if (inicio) lines.push('• ' + t('quote.msgWhen') + ': ' + inicio);
    if (name) lines.push('• ' + t('quote.msgName') + ': ' + name);
    if (detail) lines.push('• ' + t('quote.msgDetail') + ': ' + detail);

    return lines.join('\n');
  }

  function updateQuote() {
    if (!quoteForm || !quotePreview || !quoteSend) return;
    var msg = buildQuote();
    quotePreview.textContent = msg;
    quoteSend.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }

  if (quoteForm) {
    quoteForm.addEventListener('input', updateQuote);
    quoteForm.addEventListener('change', updateQuote);
    quoteForm.addEventListener('submit', function (e) { e.preventDefault(); });
  }

  /* ------------------------------------------------ Formulario de contacto -- */
  var contactForm = $('#contactForm');
  var formStatus = $('#formStatus');
  var contactSubmit = $('#contactSubmit');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!contactForm.checkValidity()) { contactForm.reportValidity(); return; }

      var label = contactSubmit.querySelector('span');
      var original = label.textContent;
      label.textContent = t('form.sending');
      contactSubmit.disabled = true;
      formStatus.textContent = '';
      formStatus.className = 'form-status';

      fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: $('#cName').value,
          telefono: $('#cPhone').value,
          email: $('#cEmail').value,
          mensaje: $('#cMsg').value,
          _subject: 'Nueva solicitud desde el sitio de YU Constructora',
          _template: 'table',
          _captcha: 'false'
        })
      })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
        .then(function () {
          formStatus.textContent = t('form.ok');
          formStatus.className = 'form-status ok';
          contactForm.reset();
        })
        .catch(function () {
          formStatus.textContent = t('form.err');
          formStatus.className = 'form-status err';
        })
        .finally(function () {
          label.textContent = original;
          contactSubmit.disabled = false;
        });
    });
  }


  /* --------------------------------------- Sugerencia de idioma al visitante */
  /*
    Si el navegador no está en español y el visitante nunca ha elegido idioma,
    se ofrece el cambio con un aviso discreto. El contenido servido no cambia:
    solo se propone, para no afectar el posicionamiento en español.
  */
  var OFFERS = {
    en: { text: 'This site is available in English', cta: 'View in English' },
    pt: { text: 'Este site está disponível em português', cta: 'Ver em português' }
  };

  function maybeOfferLanguage() {
    if (lang !== 'es') return;
    try { if (localStorage.getItem('yu-lang-hint') === 'off') return; } catch (e) {}

    var nav = (navigator.language || 'es').slice(0, 2).toLowerCase();
    var offer = OFFERS[nav];
    if (!offer) return;

    var link = $('#lang [data-lang="' + nav + '"]');
    if (!link) return;

    var box = document.createElement('div');
    box.className = 'lang-hint';
    box.setAttribute('role', 'status');
    box.innerHTML =
      '<span>' + offer.text + '</span>' +
      '<a class="lang-hint__go" href="' + link.getAttribute('href') + '" hreflang="' + nav + '">' + offer.cta + '</a>' +
      '<button type="button" class="lang-hint__x" aria-label="Close">&times;</button>';
    document.body.appendChild(box);

    function dismiss() {
      box.classList.remove('is-in');
      try { localStorage.setItem('yu-lang-hint', 'off'); } catch (e) {}
      setTimeout(function () { box.remove(); }, 300);
    }

    box.querySelector('.lang-hint__x').addEventListener('click', dismiss);
    setTimeout(function () { box.classList.add('is-in'); }, 1200);
    setTimeout(function () { if (box.isConnected) dismiss(); }, 14000);
  }

  /* ------------------------------------------------------------- Arranque -- */
  var y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());

  lang = readLang();
  updateQuote();
  maybeOfferLanguage();
})();
