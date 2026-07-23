/* =============================================================================
   YU Constructores · Generador de páginas por idioma
   -----------------------------------------------------------------------------
   Toma index.html (fuente en español) y produce en/index.html y pt/index.html
   con el HTML ya traducido, para que los buscadores indexen contenido real en
   cada idioma en lugar de texto que solo cambia por JavaScript.

   Uso:  node tools/build-i18n.js
   Autor: Dr. Mauricio Rodríguez Herrera
   ============================================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://droko1982.github.io/yu-constructores/';

global.window = {};
// eslint-disable-next-line no-eval
eval(fs.readFileSync(path.join(ROOT, 'assets/js/i18n.js'), 'utf8'));
const DICT = global.window.YU_I18N;

const LOCALES = {
  es: { htmlLang: 'es-CO', ogLocale: 'es_CO', dir: '', up: '' },
  en: { htmlLang: 'en', ogLocale: 'en_US', dir: 'en', up: '../' },
  pt: { htmlLang: 'pt-BR', ogLocale: 'pt_BR', dir: 'pt', up: '../' }
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

/* ---------------------------------------------------- Traducción del cuerpo */
function translateBody(html, lang) {
  const T = DICT[lang];
  const missing = [];
  const get = (k) => {
    if (!Object.prototype.hasOwnProperty.call(T, k)) { missing.push(k); return null; }
    return T[k];
  };

  // Contenido de texto: <tag ... data-i18n="clave">…</tag>
  html = html.replace(
    /<(\w+)((?:[^>]*?)\sdata-i18n="([^"]+)"(?:[^>]*?))>([\s\S]*?)<\/\1>/g,
    (m, tag, attrs, key, inner) => {
      if (new RegExp('<' + tag + '[\\s>]', 'i').test(inner)) {
        throw new Error('Elemento anidado del mismo tipo en data-i18n="' + key + '"');
      }
      const v = get(key);
      return v === null ? m : `<${tag}${attrs}>${esc(v)}</${tag}>`;
    }
  );

  // Contenido con marcado permitido: data-i18n-html
  html = html.replace(
    /<(\w+)((?:[^>]*?)\sdata-i18n-html="([^"]+)"(?:[^>]*?))>([\s\S]*?)<\/\1>/g,
    (m, tag, attrs, key) => {
      const v = get(key);
      return v === null ? m : `<${tag}${attrs}>${v}</${tag}>`;
    }
  );

  // Atributos traducibles
  const ATTRS = [
    ['data-i18n-ph', 'placeholder'],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-title', 'title'],
    ['data-i18n-alt', 'alt']
  ];
  for (const [marker, target] of ATTRS) {
    html = html.replace(new RegExp('<\\w+[^>]*\\s' + marker + '="([^"]+)"[^>]*>', 'g'), (tagStr, key) => {
      const v = get(key);
      if (v === null) return tagStr;
      const re = new RegExp('\\s' + target + '="[^"]*"');
      return re.test(tagStr)
        ? tagStr.replace(re, ` ${target}="${escAttr(v)}"`)
        : tagStr.replace(/>$/, ` ${target}="${escAttr(v)}">`);
    });
  }

  if (missing.length) {
    throw new Error('Claves ausentes en "' + lang + '": ' + [...new Set(missing)].join(', '));
  }
  return html;
}

/* --------------------------------------------------- Datos estructurados */
function buildFaqJsonLd(lang, pageUrl) {
  const T = DICT[lang];
  const items = [];
  for (let i = 1; i <= 8; i++) {
    items.push({
      '@type': 'Question',
      name: T['faq.q' + i],
      acceptedAnswer: { '@type': 'Answer', text: T['faq.a' + i] }
    });
  }
  return { '@type': 'FAQPage', '@id': pageUrl + '#faq', inLanguage: lang, mainEntity: items };
}

function buildServiceList(lang) {
  const T = DICT[lang];
  const out = [];
  for (let i = 1; i <= 8; i++) {
    out.push({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: T['svc.' + i + '.t'],
        description: T['svc.' + i + '.d'],
        serviceType: T['svc.' + i + '.t'],
        provider: { '@id': BASE + '#organizacion' },
        areaServed: [
          { '@type': 'AdministrativeArea', name: 'Quindío' },
          { '@type': 'Country', name: 'Colombia' }
        ]
      }
    });
  }
  return out;
}

const PROJECTS = [
  ['p1', 'casa-campestre-lote-78'],
  ['p3', 'casa-del-bosque'],
  ['p9', 'taludes-aeropuerto-matecana'],
  ['p4', 'alcantarillado-la-miranda'],
  ['p5', 'planta-frigopork'],
  ['p8', 'acueducto-aeropuerto-matecana'],
  ['p2', 'casa-chambery-lote-9c'],
  ['p6', 'colegio-libre-circasia'],
  ['p7', 'colegio-san-vicente-genova']
];

function buildProjectList(lang, pageUrl) {
  const T = DICT[lang];
  return {
    '@type': 'ItemList',
    '@id': pageUrl + '#proyectos',
    name: T['prj.title'],
    numberOfItems: PROJECTS.length,
    itemListElement: PROJECTS.map(([key, slug], n) => ({
      '@type': 'ListItem',
      position: n + 1,
      item: {
        '@type': 'CreativeWork',
        name: T['prj.' + key + '.t'],
        description: T['prj.' + key + '.d'],
        locationCreated: { '@type': 'Place', name: T['prj.' + key + '.l'] },
        creator: { '@id': BASE + '#organizacion' },
        image: BASE + 'assets/img/proyectos/' + slug + '-thumb.jpg'
      }
    }))
  };
}

function rebuildJsonLd(html, lang, pageUrl) {
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) throw new Error('No se encontró el bloque JSON-LD');
  const data = JSON.parse(m[1]);
  const T = DICT[lang];

  data['@graph'] = data['@graph'].filter((n) => n['@type'] !== 'FAQPage' && n['@type'] !== 'ItemList');

  for (const node of data['@graph']) {
    if (node['@type'] === 'GeneralContractor') {
      node.description = T['meta.desc'];
      node.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: T['svc.title'],
        itemListElement: buildServiceList(lang)
      };
    }
    if (node['@type'] === 'WebSite') {
      node.inLanguage = LOCALES[lang].htmlLang;
    }
  }

  data['@graph'].push({
    '@type': 'WebPage',
    '@id': pageUrl + '#pagina',
    url: pageUrl,
    name: T['meta.title'],
    description: T['meta.desc'],
    inLanguage: LOCALES[lang].htmlLang,
    isPartOf: { '@id': BASE + '#sitio' },
    about: { '@id': BASE + '#organizacion' },
    primaryImageOfPage: BASE + 'assets/img/brand/og-image.jpg'
  });
  data['@graph'].push(buildProjectList(lang, pageUrl));
  data['@graph'].push(buildFaqJsonLd(lang, pageUrl));

  return html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    '<script type="application/ld+json">\n' + JSON.stringify(data, null, 2) + '\n</script>'
  );
}

/* ------------------------------------------------------ Cabecera del documento */
function rewriteHead(html, lang) {
  const T = DICT[lang];
  const L = LOCALES[lang];
  const pageUrl = BASE + (L.dir ? L.dir + '/' : '');

  html = html.replace(/<html lang="[^"]*"/, `<html lang="${L.htmlLang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(T['meta.title'])}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(">)/, `$1${escAttr(T['meta.desc'])}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(">)/, `$1${pageUrl}$2`);

  html = html.replace(/(<meta property="og:title" content=")[^"]*(">)/, `$1${escAttr(T['meta.title'])}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(">)/, `$1${escAttr(T['meta.desc'])}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${pageUrl}$2`);
  html = html.replace(/(<meta property="og:locale" content=")[^"]*(">)/, `$1${L.ogLocale}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(">)/, `$1${escAttr(T['meta.title'])}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(">)/, `$1${escAttr(T['meta.desc'])}$2`);

  const alts = Object.keys(LOCALES).filter((l) => l !== lang).map((l) => LOCALES[l].ogLocale);
  html = html.replace(/(<meta property="og:locale:alternate" content="[^"]*">\s*)+/,
    alts.map((a) => `<meta property="og:locale:alternate" content="${a}">\n`).join(''));

  // Rutas relativas hacia la raíz del sitio
  if (L.up) {
    html = html.replace(/(\s(?:href|src|data-src)=")(assets\/)/g, `$1${L.up}$2`);
    html = html.replace(/(\s(?:href|src)=")(site\.webmanifest)/g, `$1${L.up}$2`);
  }

  // Conmutador de idioma
  const hrefs = { es: L.up || './', en: (L.up || '') + (lang === 'en' ? './' : 'en/'), pt: (L.up || '') + (lang === 'pt' ? './' : 'pt/') };
  if (lang === 'en') { hrefs.en = './'; hrefs.pt = '../pt/'; }
  if (lang === 'pt') { hrefs.pt = './'; hrefs.en = '../en/'; }
  for (const l of ['es', 'en', 'pt']) {
    html = html.replace(
      new RegExp(`(<a href=")[^"]*(" hreflang="${l}" lang="${l}" data-lang="${l}")(?:\\s+aria-current="true")?`),
      `$1${hrefs[l]}$2${l === lang ? ' aria-current="true"' : ''}`
    );
  }
  html = html.replace(/(<span id="langCurrent">)[^<]*(<\/span>)/, `$1${lang.toUpperCase()}$2`);

  return rebuildJsonLd(html, lang, pageUrl);
}

/* ------------------------------------------------------------------ Salida */
const source = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const built = [];

for (const lang of Object.keys(LOCALES)) {
  let out = translateBody(source, lang);
  out = rewriteHead(out, lang);

  const dir = LOCALES[lang].dir;
  const dest = dir ? path.join(ROOT, dir, 'index.html') : path.join(ROOT, 'index.html');
  if (dir) fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
  fs.writeFileSync(dest, out, 'utf8');
  built.push(`${dir || '/'} → ${(out.length / 1024).toFixed(0)} KB`);
}

console.log('Páginas generadas:\n  ' + built.join('\n  '));
