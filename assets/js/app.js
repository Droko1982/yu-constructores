/* =============================================================================
   YU Constructora · Lógica del sitio
   Autor: Dr. Mauricio Rodríguez Herrera
   ============================================================================= */
(function () {
  'use strict';

  var WA_NUMBER = '573046557120';
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
    var setMenu = function (open) {
      mobileNav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', t(open ? 'a11y.menuClose' : 'a11y.menu'));
      document.body.classList.toggle('is-locked', open);
      burger.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
      if (open) mobileNav.scrollTop = 0;
    };

    burger.addEventListener('click', function () {
      setMenu(!mobileNav.classList.contains('is-open'));
    });
    $$('a', mobileNav).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    /* Escape cierra y devuelve el foco al botón, como cualquier diálogo. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        setMenu(false);
        burger.focus();
      }
    });
    /*
      Al pasar a escritorio el botón desaparece: si el menú se quedara abierto,
      el cuerpo seguiría bloqueado y la página no se podría desplazar.
    */
    window.addEventListener('resize', function () {
      if (mobileNav.classList.contains('is-open') && getComputedStyle(burger).display === 'none') {
        setMenu(false);
      }
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
  /*
    En las páginas secundarias los enlaces del menú apuntan a la portada
    ("../#servicios"), que no es un selector CSS válido: pasárselo a
    querySelector lanza una excepción y detendría el resto del guion. Solo se
    consultan los que son anclas de esta misma página.
  */
  var navLinks = $$('#nav a');
  var sections = navLinks
    .map(function (a) {
      var href = a.getAttribute('href') || '';
      return href.charAt(0) === '#' && href.length > 1 ? document.querySelector(href) : null;
    })
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

  /*
    Activa una diapositiva aplazada. El srcset del <source> debe escribirse
    ANTES que el src del <img>: el navegador resuelve <picture> en cuanto la
    imagen recibe una fuente, así que al revés ya habría elegido el JPEG y la
    variante WebP no se usaría.
  */
  function heroLoad(img) {
    if (!img || img.src) return;
    var pic = img.parentNode;
    if (pic && pic.tagName === 'PICTURE') {
      $$('source[data-srcset]', pic).forEach(function (s) {
        s.setAttribute('srcset', s.getAttribute('data-srcset'));
        s.removeAttribute('data-srcset');
      });
    }
    if (img.dataset.src) img.src = img.dataset.src;
  }

  function heroGo(i) {
    if (!heroImgs.length) return;
    heroIx = (i + heroImgs.length) % heroImgs.length;
    heroImgs.forEach(function (img, n) {
      if (n === heroIx) heroLoad(img);
      img.classList.toggle('is-active', n === heroIx);
    });
    heroDots.forEach(function (d, n) { d.setAttribute('aria-current', n === heroIx ? 'true' : 'false'); });

    // Precarga la siguiente
    heroLoad(heroImgs[(heroIx + 1) % heroImgs.length]);
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

  /*
    Las fotos del visor se piden en WebP (variante de 1280 px, en torno a la
    mitad de peso). Si el navegador no la trae —formato no soportado o archivo
    ausente porque la foto es nueva y no se ha generado— se cae al .jpg
    original. Se marca el nodo para no reintentar en bucle.
  */
  function swapToJpeg(img) {
    // Al cerrar el visor se vacía el src, y eso también dispara "error".
    if (img.dataset.fallback === 'done' || !/-1280\.webp$/.test(img.src)) return;
    img.dataset.fallback = 'done';
    img.src = img.src.replace(/-1280\.webp$/, '.jpg');
  }

  function lbRender() {
    if (!lbState.imgs.length) return;
    delete lbImg.dataset.fallback;
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
      lbState.imgs.push(ASSET_BASE + 'assets/img/proyectos/' + slug + '-' + i + '-1280.webp');
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
      im.addEventListener('error', function () { swapToJpeg(im); });
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
    lbImg.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  projectEls.forEach(function (p) {
    p.addEventListener('click', function (e) {
      /*
        La tarjeta abre el visor, pero también contiene el enlace a la página de
        la obra. Sin esta comprobación, pulsar el enlace dispararía las dos
        cosas: se abriría la galería y acto seguido el navegador cambiaría de
        página, dejando el visor abierto al volver atrás.
      */
      if (e.target.closest && e.target.closest('a')) return;

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
    lbImg.addEventListener('error', function () { swapToJpeg(lbImg); });
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

  /* ------------------------------------------------------------- Medición --
     Registra los momentos que valen dinero: un clic en WhatsApp, el envío del
     cotizador y el del formulario. Sin esto solo se sabe cuánta gente entra,
     que es el dato menos accionable de todos.

     No pone cookies ni identifica a nadie: cuenta sucesos anónimos. Si no hay
     analítica cargada —o la bloquea el navegador— la función no hace nada y el
     sitio funciona igual, así que nunca puede romper una conversión. */
  function track(evento, detalle) {
    try {
      if (typeof window.zaraz !== 'undefined' && window.zaraz.track) {
        window.zaraz.track(evento, detalle || {});
      } else if (typeof window.plausible === 'function') {
        window.plausible(evento, { props: detalle || {} });
      } else if (typeof window.gtag === 'function') {
        window.gtag('event', evento, detalle || {});
      }
    } catch (e) { /* la medición jamás debe interrumpir al visitante */ }
  }

  /* Un solo oyente en el documento: capta también los enlaces que el guion
     crea después, como los del visor de galería. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('wa.me/') > -1) {
      /* Varios enlaces comparten data-wa="quote" —el botón flotante y el del
         cotizador— así que el origen se afina con el id o la clase. Saber si la
         gente escribe desde el cotizador o desde el botón flotante cambia qué
         conviene mejorar. */
      var origen = a.id ||
        (a.classList.contains('fab-wa') ? 'flotante' : (a.getAttribute('data-wa') || 'enlace'));
      track('whatsapp', { origen: origen, pagina: location.pathname });
    } else if (href.indexOf('tel:') === 0) {
      track('llamada', { pagina: location.pathname });
    } else if (href.indexOf('mailto:') === 0) {
      track('correo', { pagina: location.pathname });
    }
  }, true);

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
          // Queda constancia del consentimiento en el propio correo: la Ley 1581
          // exige poder probar que el titular autorizó el tratamiento.
          autorizacion: $('#cConsent').checked
            ? 'Autorizó el tratamiento de datos el ' + new Date().toLocaleString('es-CO')
            : 'NO autorizó',
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
          track('formulario', { estado: 'enviado' });
        })
        .catch(function () {
          formStatus.textContent = t('form.err');
          formStatus.className = 'form-status err';
          // Un fallo de envío es una solicitud perdida: interesa tanto o más
          // que un envío correcto, porque avisa de que algo dejó de funcionar.
          track('formulario', { estado: 'error' });
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
