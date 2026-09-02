/* =============================================================================
   YU Constructora · Generador de páginas por idioma
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

/* -----------------------------------------------------------------------------
   Dirección del sitio. Es el único lugar donde se escribe el dominio: el
   generador propaga este valor al HTML de todas las páginas, al sitemap, al
   robots.txt y a las rutas absolutas del 404. Para mudarse basta con cambiar
   esta línea (o exportar YU_BASE) y volver a ejecutar el generador.

   El dominio propio se conectó el 24/07/2026; el archivo CNAME de la raíz debe
   coincidir con lo que se ponga aquí.
   -------------------------------------------------------------------------- */
const BASE = (process.env.YU_BASE || 'https://yuconstructora.com/')
  .replace(/\/*$/, '/');

/* -----------------------------------------------------------------------------
   Analítica. Vacío = sin medición y sin ninguna etiqueta en el HTML.

   Se usa Cloudflare Web Analytics porque no pone cookies, no recoge datos
   personales y no necesita banner de consentimiento: la política de tratamiento
   de datos del sitio promete justamente eso, y Google Analytics obligaría a
   contradecirla.

   Para activarla: crear el sitio en dash.cloudflare.com → Web Analytics, copiar
   el token del fragmento que entrega y pegarlo aquí.
   -------------------------------------------------------------------------- */
const ANALYTICS_TOKEN = process.env.YU_ANALYTICS || '3d774664bfcf4c329fcb0e9c4f75d5b7';

global.window = {};
// eslint-disable-next-line no-eval
eval(fs.readFileSync(path.join(ROOT, 'tools/i18n.js'), 'utf8'));
const DICT = global.window.YU_I18N;

/* Cuántos servicios y cuántas preguntas hay se cuenta en el diccionario, no se
   escribe a mano: añadir una tarjeta o una pregunta a la portada no debería
   obligar a acordarse de tocar también el generador. El conteo sale del español
   porque es la fuente; si a otro idioma le falta la clave, el generador ya falla
   más adelante por su cuenta. */
const count = (re) => Object.keys(DICT.es).filter((k) => re.test(k)).length;
const N_SERVICES = count(/^svc\.\d+\.t$/);
const N_FAQ = count(/^faq\.q\d+$/);

const LOCALES = {
  es: { htmlLang: 'es-CO', ogLocale: 'es_CO', dir: '' },
  en: { htmlLang: 'en', ogLocale: 'en_US', dir: 'en' },
  pt: { htmlLang: 'pt-BR', ogLocale: 'pt_BR', dir: 'pt' }
};

/* -------------------------------------------------------- Páginas del sitio
   La portada es index.html. Las páginas secundarias aportan únicamente el
   contenido de <main> —un archivo por idioma, en tools/pages/— y el generador
   las envuelve con la cabecera, el pie y el sprite de iconos de la portada. Así
   la navegación y el estilo existen en un solo lugar.

   El slug cambia según el idioma a propósito: una URL en la lengua del visitante
   posiciona mejor que la misma cadena castellana repetida en las tres versiones.
   -------------------------------------------------------------------------- */
const PAGES = [
  { id: 'home', slug: { es: '', en: '', pt: '' } },
  {
    id: 'cobertura',
    content: 'tools/pages/cobertura',
    slug: { es: 'cobertura', en: 'coverage', pt: 'cobertura' }
  },
  {
    id: 'privacidad',
    content: 'tools/pages/privacidad',
    slug: { es: 'politica-de-datos', en: 'privacy-policy', pt: 'politica-de-dados' }
  },

  /* Páginas de servicio. "service" es el número de la tarjeta correspondiente en
     la portada: de ahí se toman el nombre y la descripción para el JSON-LD, sin
     duplicar textos. Los slugs incluyen la ciudad o el departamento porque la
     búsqueda real es «constructora en Armenia», no «constructora». */
  {
    id: 'obra-civil',
    content: 'tools/pages/obra-civil',
    service: 1,
    slug: {
      es: 'servicios/construccion-obra-civil-armenia',
      en: 'services/civil-works-construction',
      pt: 'servicos/construcao-de-obras-civis'
    }
  },
  {
    id: 'acueducto',
    content: 'tools/pages/acueducto',
    service: 2,
    slug: {
      es: 'servicios/acueducto-alcantarillado-quindio',
      en: 'services/water-and-sewer-networks',
      pt: 'servicos/redes-de-agua-e-esgoto'
    }
  },
  {
    id: 'taludes',
    content: 'tools/pages/taludes',
    service: 3,
    slug: {
      es: 'servicios/estabilizacion-de-taludes-muros-de-contencion',
      en: 'services/slope-stabilisation-retaining-walls',
      pt: 'servicos/estabilizacao-de-taludes-muros-de-contencao'
    }
  },
  {
    id: 'remodelaciones',
    content: 'tools/pages/remodelaciones',
    service: 4,
    slug: {
      es: 'servicios/remodelaciones-armenia-quindio',
      en: 'services/remodelling-and-refurbishment',
      pt: 'servicos/reformas-e-adequacoes'
    }
  },

  /* Atención por el sismo del 10 de agosto de 2026 (M 7,4, epicentro en San
     José del Palmar, Chocó). El slug lleva «reparacion-danos-sismo» y no la
     fecha ni la palabra «terremoto» a propósito: la página tiene que seguir
     sirviendo cuando la noticia pase, porque el daño sísmico se repara durante
     años y la región es zona de amenaza alta. */
  {
    id: 'sismo',
    content: 'tools/pages/sismo',
    service: 9,
    slug: {
      es: 'servicios/reparacion-danos-sismo-armenia-quindio',
      en: 'services/earthquake-damage-repair',
      pt: 'servicos/reparo-de-danos-por-sismo'
    }
  },
  {
    id: 'obras-menores',
    content: 'tools/pages/obras-menores',
    service: 10,
    slug: {
      es: 'servicios/reparaciones-menores-arreglos-armenia',
      en: 'services/small-repairs-and-minor-works',
      pt: 'servicos/pequenos-reparos-e-obras-menores'
    }
  }
];

/* Páginas de obra. "project" es la clave del proyecto en el diccionario, de
   donde salen título, ubicación, año y descripción ya traducidos; "slug" lleva
   el municipio porque la búsqueda útil es «constructora en Circasia», no el
   nombre de la obra. La galería se inyecta sola a partir de PROJECTS. */
for (const [key, slug, place] of [
  ['p1', 'casa-campestre-lote-78', 'alcala-valle'],
  ['p2', 'casa-chambery-lote-9c', 'pereira'],
  ['p3', 'casa-del-bosque', 'pereira'],
  ['p4', 'alcantarillado-la-miranda', 'armenia'],
  ['p5', 'planta-frigopork', 'la-victoria-valle'],
  ['p6', 'colegio-libre', 'circasia'],
  ['p7', 'colegio-san-vicente', 'genova'],
  ['p8', 'acueducto-aeropuerto-matecana', 'pereira'],
  ['p9', 'taludes-aeropuerto-matecana', 'pereira']
]) {
  PAGES.push({
    id: 'obra-' + key,
    project: key,
    content: 'tools/pages/obra-' + key,
    slug: {
      es: 'proyectos/' + slug + '-' + place,
      en: 'projects/' + slug + '-' + place,
      pt: 'projetos/' + slug + '-' + place
    }
  });
}

/* Dónde vive una página en un idioma: carpetas, URL absoluta y los prefijos
   relativos hacia la raíz del sitio y hacia la portada de ese idioma. */
function locate(page, lang) {
  // El slug puede llevar carpetas ("servicios/obra-civil"), así que se parte en
  // segmentos: de la profundidad real dependen todas las rutas relativas.
  const parts = [LOCALES[lang].dir, ...page.slug[lang].split('/')].filter(Boolean);
  const depth = parts.length;
  const toHome = depth - (LOCALES[lang].dir ? 1 : 0);
  return {
    parts,
    url: BASE + (parts.length ? parts.join('/') + '/' : ''),
    up: '../'.repeat(depth),                    // hasta la raíz del sitio
    home: '../'.repeat(toHome) || './',         // hasta la portada de este idioma
    file: path.join(ROOT, ...parts, 'index.html')
  };
}

/* Zona de operación, en un solo sitio: la usan el nodo de la empresa, cada
   servicio y cada obra. La región va antes que el país porque el negocio real
   está en el Eje Cafetero, aunque se ejecute en todo el territorio. */
const AREA_SERVED = [
  { '@type': 'AdministrativeArea', name: 'Eje Cafetero' },
  { '@type': 'AdministrativeArea', name: 'Quindío' },
  { '@type': 'AdministrativeArea', name: 'Risaralda' },
  { '@type': 'AdministrativeArea', name: 'Caldas' },
  { '@type': 'AdministrativeArea', name: 'Valle del Cauca' },
  { '@type': 'Country', name: 'Colombia' }
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => esc(s).replace(/"/g, '&quot;');

/* ------------------------------------------------------- Cambio de dominio
   El HTML fuente lleva la dirección del sitio escrita en medio centenar de
   sitios: hreflang, Open Graph, Twitter y todo el bloque JSON-LD. En lugar de
   enumerarlos uno por uno, se toma la dirección vigente del enlace canónico
   —que por definición apunta a la raíz en español— y se sustituye por BASE.
   Así mudarse de dominio es cambiar una constante, y la operación es idempotente:
   la segunda ejecución ya no encuentra nada que cambiar. */
function rebase(html) {
  const m = html.match(/<link rel="canonical" href="([^"]+)">/);
  if (!m) throw new Error('No se encontró el enlace canónico en index.html');
  const current = m[1];
  if (current === BASE) return html;
  if (!/^https?:\/\/[^/]+\//.test(current)) {
    throw new Error('El enlace canónico no es una dirección absoluta: ' + current);
  }
  console.log('Dominio: ' + current + ' → ' + BASE);
  return html.split(current).join(BASE);
}

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
      const attr = ` ${target}="${escAttr(v)}"`;
      return re.test(tagStr)
        ? tagStr.replace(re, () => attr)
        : tagStr.replace(/>$/, () => attr + '>');
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
  for (let i = 1; i <= N_FAQ; i++) {
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
  for (let i = 1; i <= N_SERVICES; i++) {
    out.push({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: T['svc.' + i + '.t'],
        description: T['svc.' + i + '.d'],
        serviceType: T['svc.' + i + '.t'],
        provider: { '@id': BASE + '#organizacion' },
        areaServed: AREA_SERVED
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
        temporalCoverage: T['prj.' + key + '.y'].replace('–', '/'),
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

  // Los nodos derivados se regeneran en cada ejecución; si no se purgan primero,
  // el generador los acumularía al reescribir index.html sobre sí mismo.
  const DERIVED = ['FAQPage', 'ItemList', 'WebPage'];
  data['@graph'] = data['@graph'].filter((n) => DERIVED.indexOf(n['@type']) === -1);

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
    dateModified: BUILD_DATE,
    primaryImageOfPage: BASE + 'assets/img/brand/og-image.jpg'
  });
  data['@graph'].push(buildProjectList(lang, pageUrl));
  data['@graph'].push(buildFaqJsonLd(lang, pageUrl));

  // Reemplazo con función: en una cadena de reemplazo, "$$" significa un "$"
  // literal y "$1" una retrorreferencia, así que el JSON se corrompería.
  const block = '<script type="application/ld+json">\n' + JSON.stringify(data, null, 2) + '\n</script>';
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => block);
}

/* --------------------------------- Datos estructurados de páginas secundarias
   Una página legal no necesita el catálogo de servicios ni el portafolio: basta
   con declarar de qué trata, a qué sitio pertenece y en qué punto del árbol
   está. El BreadcrumbList es lo que dibuja la miga de pan bajo el resultado de
   búsqueda. La organización se referencia por @id, ya descrita en la portada. */
function buildSecondaryJsonLd(html, lang, page, at, meta) {
  const T = DICT[lang];
  const homeUrl = BASE + (LOCALES[lang].dir ? LOCALES[lang].dir + '/' : '');

  /* Las páginas de servicio cuelgan de la sección «Servicios» de la portada, de
     modo que la miga de pan tiene tres niveles en lugar de dos. */
  const crumbs = [{ '@type': 'ListItem', position: 1, name: T['nav.home'], item: homeUrl }];
  if (page.service) {
    crumbs.push({ '@type': 'ListItem', position: 2, name: T['nav.services'], item: homeUrl + '#servicios' });
  }
  if (page.project) {
    crumbs.push({ '@type': 'ListItem', position: 2, name: T['nav.projects'], item: homeUrl + '#proyectos' });
  }
  /* La miga se dibuja bajo el resultado de búsqueda, así que lleva el nombre de
     la página a secas: el sufijo de marca del <title> ahí sobra. */
  const crumbName = meta.title.split(' | ')[0].trim();
  crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: crumbName, item: at.url });

  const graph = [
    /* El grafo de cada página tiene que sostenerse solo: estos dos nodos son
       los que hacen que publisher, provider y creator apunten a algo. */
    COMPACT.org,
    Object.assign({}, COMPACT.site, { inLanguage: LOCALES[lang].htmlLang }),
    {
      '@type': 'WebPage',
      '@id': at.url + '#pagina',
      url: at.url,
      name: meta.title,
      description: meta.desc,
      inLanguage: LOCALES[lang].htmlLang,
      isPartOf: { '@id': BASE + '#sitio' },
      publisher: { '@id': BASE + '#organizacion' },
      dateModified: BUILD_DATE,
      primaryImageOfPage: pageImage(page, lang).url
    },
    { '@type': 'BreadcrumbList', '@id': at.url + '#miga', itemListElement: crumbs }
  ];

  /* El nombre y la descripción del servicio se toman del diccionario, los mismos
     que ya usa la tarjeta de la portada: así no hay dos versiones del texto que
     puedan quedar desincronizadas. */
  if (page.service) {
    const n = page.service;
    if (!T['svc.' + n + '.t']) throw new Error('No existe la clave svc.' + n + '.t en "' + lang + '"');
    graph.push({
      '@type': 'Service',
      '@id': at.url + '#servicio',
      name: T['svc.' + n + '.t'],
      description: T['svc.' + n + '.d'],
      serviceType: T['svc.' + n + '.t'],
      url: at.url,
      provider: { '@id': BASE + '#organizacion' },
      areaServed: AREA_SERVED
    });
  }

  /* Cada obra se declara como CreativeWork, igual que en el listado de la
     portada, pero aquí con su URL propia y todas sus fotografías. */
  if (page.project) {
    const k = page.project;
    const p = PHOTOS[k];
    const imgs = [];
    for (let i = 1; i <= p.count; i++) {
      imgs.push(BASE + 'assets/img/proyectos/' + p.slug + '-' + i + '.jpg');
    }
    graph.push({
      '@type': 'CreativeWork',
      '@id': at.url + '#obra',
      name: T['prj.' + k + '.t'],
      url: at.url,
      description: T['prj.' + k + '.d'],
      temporalCoverage: T['prj.' + k + '.y'].replace('–', '/'),
      locationCreated: { '@type': 'Place', name: T['prj.' + k + '.l'] },
      creator: { '@id': BASE + '#organizacion' },
      inLanguage: LOCALES[lang].htmlLang,
      image: imgs
    });
  }

  const data = { '@context': 'https://schema.org', '@graph': graph };
  const block = '<script type="application/ld+json">\n' + JSON.stringify(data, null, 2) + '\n</script>';
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, () => block);
}

/* ------------------------------------------------------ Cabecera del documento */
function rewriteHead(html, lang, page, at, meta) {
  const L = LOCALES[lang];

  html = html.replace(/<html lang="[^"]*"/, () => `<html lang="${L.htmlLang}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(meta.title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(">)/, (_m, a, b) => a + escAttr(meta.desc) + b);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(">)/, (_m, a, b) => a + at.url + b);

  html = html.replace(/(<meta property="og:title" content=")[^"]*(">)/, (_m, a, b) => a + escAttr(meta.title) + b);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(">)/, (_m, a, b) => a + escAttr(meta.desc) + b);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(">)/, (_m, a, b) => a + at.url + b);
  html = html.replace(/(<meta property="og:locale" content=")[^"]*(">)/, (_m, a, b) => a + L.ogLocale + b);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(">)/, (_m, a, b) => a + escAttr(meta.title) + b);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(">)/, (_m, a, b) => a + escAttr(meta.desc) + b);

  const img = pageImage(page, lang);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(">)/, (_m, a, b) => a + img.url + b);
  html = html.replace(/(<meta property="og:image:width" content=")[^"]*(">)/, (_m, a, b) => a + img.w + b);
  html = html.replace(/(<meta property="og:image:height" content=")[^"]*(">)/, (_m, a, b) => a + img.h + b);
  html = html.replace(/(<meta property="og:image:alt" content=")[^"]*(">)/, (_m, a, b) => a + escAttr(img.alt) + b);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(">)/, (_m, a, b) => a + img.url + b);

  const alts = Object.keys(LOCALES).filter((l) => l !== lang).map((l) => LOCALES[l].ogLocale);
  html = html.replace(/(<meta property="og:locale:alternate" content="[^"]*">\s*)+/,
    alts.map((a) => `<meta property="og:locale:alternate" content="${a}">\n`).join(''));

  /* hreflang: cada versión debe apuntar a la traducción de ESTA página, no a la
     portada. Con slugs distintos por idioma, dejarlos fijos sería un error. */
  const alt = [`<link rel="alternate" hreflang="es-CO" href="${locate(page, 'es').url}">`]
    .concat(Object.keys(LOCALES).map((l) => `<link rel="alternate" hreflang="${l}" href="${locate(page, l).url}">`))
    .concat(`<link rel="alternate" hreflang="x-default" href="${locate(page, 'es').url}">`)
    .join('\n') + '\n';
  html = html.replace(/(<link rel="alternate" hreflang="[^"]*" href="[^"]*">\s*)+/, () => alt);

  // Rutas relativas hacia la raíz del sitio
  if (at.up) {
    html = html.replace(/(\s(?:href|src|data-src)=")(assets\/)/g, `$1${at.up}$2`);
    html = html.replace(/(\s(?:href|src)=")(site\.webmanifest)/g, `$1${at.up}$2`);

    // srcset e imagesrcset llevan varias rutas separadas por comas, así que hay
    // que anteponer el prefijo a todas. La primera va pegada a la comilla de
    // apertura, de ahí que las comillas también cuenten como separador.
    html = html.replace(/\s(?:data-)?(?:image)?srcset="([^"]*)"/g, (attr) =>
      attr.replace(/(^|[\s,"])(assets\/)/g, `$1${at.up}$2`));
  }

  /* Conmutador de idioma: lleva a la MISMA página en el otro idioma, respetando
     que cada una tiene su propio slug. */
  for (const l of Object.keys(LOCALES)) {
    const target = l === lang ? './' : at.up + locate(page, l).parts.join('/') + (locate(page, l).parts.length ? '/' : '');
    html = html.replace(
      new RegExp(`(<a href=")[^"]*(" hreflang="${l}" lang="${l}" data-lang="${l}")(?:\\s+aria-current="true")?`),
      (_m, a, b) => a + (target || './') + b + (l === lang ? ' aria-current="true"' : '')
    );
  }
  html = html.replace(/(<span id="langCurrent">)[^<]*(<\/span>)/, (_m, a, b) => a + lang.toUpperCase() + b);

  return page.id === 'home'
    ? rebuildJsonLd(html, lang, at.url)
    : buildSecondaryJsonLd(html, lang, page, at, meta);
}

/* --------------------------------------------- Mensajes de WhatsApp
   El texto va escrito en el href, no lo pone JavaScript. Así el enlace lleva el
   mensaje aunque el guion no haya cargado todavía, y no depende de que el
   navegador tenga en caché la misma versión del HTML y del guion. */
function writeWhatsAppLinks(html, lang, page) {
  const T = DICT[lang];
  /* Se localiza la etiqueta completa y luego se sustituye su href, igual que en
     rewritePageLinks. Antes se exigía que data-wa fuera pegado al href y en ese
     orden: bastaba meter un class= entre medias para que el enlace se publicara
     sin mensaje, y en silencio. */
  return html.replace(/<a\s[^>]*\sdata-wa="([a-z]+)"[^>]*>/g, (tag, key) => {
    let msg = T['wa.' + key];
    if (!msg) throw new Error('Falta la clave wa.' + key + ' en "' + lang + '"');

    /* {servicio} y {obra} se sustituyen por el nombre traducido de ESTA página:
       una sola clave sirve para las seis páginas de servicio y las nueve de
       obra, y el mensaje llega diciendo de dónde viene. */
    if (msg.indexOf('{servicio}') > -1) {
      if (!page || !page.service) throw new Error('wa.' + key + ' usa {servicio} en una página sin servicio: ' + (page && page.id));
      msg = msg.replace('{servicio}', T['svc.' + page.service + '.t']);
    }
    if (msg.indexOf('{obra}') > -1) {
      if (!page || !page.project) throw new Error('wa.' + key + ' usa {obra} en una página sin obra: ' + (page && page.id));
      msg = msg.replace('{obra}', T['prj.' + page.project + '.t']);
    }

    const href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    return /\shref="/.test(tag)
      ? tag.replace(/\shref="[^"]*"/, () => ' href="' + href + '"')
      : tag.replace(/^<a/, '<a href="' + href + '"');
  });
}

/* --------------------------------------------- Diccionario por idioma
   tools/i18n.js es la fuente y lleva los tres idiomas (57 KB), pero cada
   página solo necesita el suyo: el HTML ya viene traducido y el guion únicamente
   arma el mensaje del cotizador, los títulos de la galería y los avisos del
   formulario. Se emite un archivo por idioma y cada página carga el que le toca,
   con lo que la descarga baja a un tercio. El objeto conserva la forma
   { <idioma>: { … } } que espera app.js, así que el guion no cambia. */
function writeLangDict(lang) {
  const out =
    '/* Generado por tools/build-i18n.js a partir de tools/i18n.js — no editar a mano. */\n' +
    'window.YU_I18N = ' + JSON.stringify({ [lang]: DICT[lang] }, null, 2) + ';\n';
  fs.writeFileSync(path.join(ROOT, 'assets/js/i18n.' + lang + '.js'), out, 'utf8');
  return out.length;
}

/* Apunta la etiqueta <script> al diccionario del idioma de la página. Se aplica
   después de rewriteHead, que ya ha antepuesto "../" en /en/ y /pt/. */
function useLangDict(html, lang) {
  // Acepta "i18n.js" y también "i18n.es.js": el generador reescribe index.html
  // sobre sí mismo, así que a partir de la segunda ejecución la etiqueta del
  // documento fuente ya viene sustituida.
  const re = /((?:\.\.\/)*assets\/js\/)i18n(?:\.[a-z]{2})?\.js/;
  if (!re.test(html)) throw new Error('No se encontró la etiqueta de i18n.js');
  return html.replace(re, (_m, dir) => dir + 'i18n.' + lang + '.js');
}

/* ------------------------------------------------------- Rompe-caché
   GitHub Pages sirve los recursos con max-age=600. Sin una marca de versión, un
   visitante puede quedarse con el CSS o el guion viejo junto al HTML nuevo. La
   marca es el hash del contenido: solo cambia cuando el archivo cambia.

   El hash se calcula sobre el texto con saltos de línea normalizados. Git
   entrega los archivos con CRLF en Windows y con LF en Linux, así que hashear
   los bytes crudos daría una huella distinta en cada sistema y el generador
   reescribiría el HTML en cada clon sin que el contenido hubiera cambiado. */
function hashOf(relFromRoot) {
  const file = path.join(ROOT, relFromRoot);
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  return require('crypto').createHash('sha1').update(text, 'utf8').digest('hex').slice(0, 8);
}

function stampAssets(html) {
  return html.replace(
    /((?:\.\.\/)*assets\/(?:css|js)\/[a-z0-9.-]+\.(?:css|js))(?:\?v=[a-f0-9]+)?/g,
    (m, rel) => {
      // Las páginas secundarias en /en/ y /pt/ están a dos niveles: "../../assets/…"
      const hash = hashOf(rel.replace(/^(?:\.\.\/)+/, ''));
      return hash ? rel + '?v=' + hash : m;
    }
  );
}

/* --------------------------------------------------------------- Analítica
   La etiqueta va justo antes de </body>, con defer, para que no compita con el
   pintado. Si no hay token no se emite nada: el sitio queda exactamente igual
   que antes y la política de datos sigue siendo cierta al pie de la letra.

   La marca <!-- analitica --> permite que la operación sea idempotente: en la
   siguiente ejecución se reemplaza el bloque anterior en lugar de acumularlo. */
function writeAnalytics(html) {
  // Se reproduce el fragmento tal como lo entrega Cloudflare: type="module" ya
  // implica carga diferida, así que no hace falta añadir defer.
  const block = ANALYTICS_TOKEN
    ? '<!-- analitica -->\n<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" ' +
      'data-cf-beacon=\'{"token": "' + ANALYTICS_TOKEN + '"}\'></script>\n<!-- /analitica -->\n'
    : '';

  if (/<!-- analitica -->[\s\S]*?<!-- \/analitica -->\n?/.test(html)) {
    return html.replace(/<!-- analitica -->[\s\S]*?<!-- \/analitica -->\n?/, () => block);
  }
  return block ? html.replace('</body>', () => block + '</body>') : html;
}

/* ------------------------------------------------------------------ 404
   GitHub Pages entrega esta página con el contenido de 404.html pero bajo la
   URL que el visitante pidió. Si alguien escribe mal /servicios/obra-civil/,
   una ruta relativa como "assets/css/styles.css" se resolvería contra esa
   carpeta inexistente: la página saldría sin estilos y el botón de volver
   apuntaría a sí misma. Por eso aquí las rutas se dejan absolutas desde la raíz
   del dominio, calculadas a partir de BASE. */
function write404() {
  const file = path.join(ROOT, '404.html');
  if (!fs.existsSync(file)) return false;
  const root = new URL(BASE).pathname;   // p. ej. "/yu-constructores/"
  let h = fs.readFileSync(file, 'utf8');

  h = h.replace(/\s(href|src)="[^"]*?(assets\/[^"?]*)(?:\?v=[a-f0-9]+)?"/g, (m, attr, rel) => {
    const hash = /\.(css|js)$/.test(rel) ? hashOf(rel) : null;
    return ' ' + attr + '="' + root + rel + (hash ? '?v=' + hash : '') + '"';
  });
  h = h.replace(/(<a\s[^>]*)\shref="[^"]*"([^>]*\sdata-home)/, (_m, a, b) => a + ' href="' + root + '"' + b);

  fs.writeFileSync(file, h, 'utf8');
  return true;
}

/* ------------------------------------------------------------------ Salida */
const source = rebase(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'));

/* Cascarón compartido: todo lo que rodea a <main> en la portada. Las páginas
   secundarias lo reutilizan tal cual, de modo que la cabecera, el pie y el
   sprite de iconos siguen existiendo en un único sitio. */
const SHELL = (() => {
  const headEnd = source.indexOf('</head>');
  const mainOpen = source.indexOf('<main id="main">');
  const mainEnd = source.indexOf('</main>');
  if (headEnd < 0 || mainOpen < 0 || mainEnd < 0) {
    throw new Error('index.html no tiene la estructura esperada: </head>, <main id="main">, </main>');
  }
  // El visor se recorta de las páginas secundarias por estos marcadores: si
  // faltan, la compilación tiene que fallar antes de escribir nada.
  if (source.indexOf('<!-- visor -->') < 0 || source.indexOf('<!-- /visor -->') < 0) {
    throw new Error('index.html no delimita el visor con <!-- visor --> … <!-- /visor -->');
  }
  return {
    head: source.slice(0, headEnd),
    prelude: source.slice(headEnd, mainOpen),
    postlude: source.slice(mainEnd + '</main>'.length)
  };
})();

/* Secciones de la portada. En una página secundaria "#servicios" tiene que
   apuntar a "../#servicios". Se detectan solas para que añadir una sección
   nueva no obligue a tocar el generador. */
const SECTIONS = [...source.matchAll(/<section[^>]*\sid="([a-z0-9-]+)"/g)].map((m) => m[1]);

function pointAnchorsHome(html, at) {
  return html.replace(/href="#([a-z0-9-]+)"/g, (m, id) =>
    SECTIONS.indexOf(id) > -1 ? `href="${at.home}#${id}"` : m);
}

/* Enlaces entre páginas del sitio. En el HTML se escribe el destino por su
   identificador —data-page="privacidad"— y aquí se resuelve al slug del idioma
   que toca y a la profundidad desde la que se enlaza. Escribir la ruta a mano
   obligaría a mantener nueve variantes sincronizadas. */
function rewritePageLinks(html, lang, at) {
  // Se localiza la etiqueta completa y luego se sustituye su href: el atributo
  // no siempre va primero (en las tarjetas viene después de class) y exigirle
  // una posición fija dejaba enlaces sin resolver.
  // El identificador admite dígitos ("obra-p4"): sin ellos en la clase, los
  // nueve enlaces del portafolio se quedaban en href="#" sin avisar de nada.
  return html.replace(/<a\s[^>]*\sdata-page="([a-z0-9-]+)"[^>]*>/g, (tag, id) => {
    const target = PAGES.find((p) => p.id === id);
    if (!target) throw new Error('data-page desconocido: "' + id + '"');
    const parts = locate(target, lang).parts;
    const href = (at.up + parts.join('/') + (parts.length ? '/' : '')) || './';
    return /\shref="/.test(tag)
      ? tag.replace(/\shref="[^"]*"/, () => ' href="' + href + '"')
      : tag.replace(/^<a/, () => '<a href="' + href + '"');
  });
}

/* Número de fotografías de cada obra. Se lee de index.html en lugar de
   repetirse aquí, para que añadir una foto no obligue a tocar dos sitios. */
/* Fecha de esta compilación. Vive arriba porque la usan tanto el sitemap como
   dateModified, y las funciones de más abajo la necesitan antes de que el
   archivo termine de leerse. */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/* El número sale del JSON-LD de la portada, que es la fuente única que ya
   vigila tools/check.js. */
const WA_NUMBER = (() => {
  const ld = JSON.parse(source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const org = ld['@graph'].find((n) => n['@type'] === 'GeneralContractor');
  return org.telephone.replace(/[^\d]/g, '');
})();

/* Anchura y altura reales de un JPEG, leídas de su cabecera. og:image:width y
   og:image:height tienen que coincidir con la imagen: si mienten, WhatsApp y
   Facebook recortan mal la vista previa. Leerlo del archivo evita mantener una
   tabla de medidas a mano. */
function jpegSize(rel) {
  const b = fs.readFileSync(path.join(ROOT, rel));
  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xFF) { i++; continue; }
    const marker = b[i + 1];
    if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  throw new Error('No se pudo leer el tamaño de ' + rel);
}

/* Qué fotografía representa a cada página de servicio. El trabajo entra por
   WhatsApp: cuando alguien reenvía el enlace de una obra o de un servicio, la
   vista previa tiene que mostrar ESA obra y no la imagen genérica de la marca.
   Las páginas sin obra propia (sismo, arreglos menores, cobertura y la legal)
   se quedan con la imagen de marca: es preferible a ilustrarlas con algo que
   no les corresponde. */
/* La organización y el sitio, en versión compacta, para las páginas
   secundarias. Un @id que apunta a un nodo definido en OTRA página no lo
   resuelve nadie: hasta ahora el Service de cada página de servicio quedaba
   sin prestador y cada obra sin autor, con toda la señal de negocio local
   concentrada en las tres portadas.

   Se derivan del JSON-LD de index.html —no se copian a mano— para que el NAP
   siga teniendo una sola fuente, la que ya vigila tools/check.js. Se podan las
   propiedades que dependen del idioma (description y hasOfferCatalog, que el
   generador reescribe por idioma en la portada) y las que solo tienen sentido
   en la ficha completa. */
const COMPACT = (() => {
  const ld = JSON.parse(source.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const org = ld['@graph'].find((n) => n['@type'] === 'GeneralContractor');
  const site = ld['@graph'].find((n) => n['@type'] === 'WebSite');
  if (!org || !site) throw new Error('index.html no declara GeneralContractor y WebSite en su JSON-LD');

  const pick = (node, keys) => {
    const out = {};
    for (const k of keys) if (node[k] !== undefined) out[k] = node[k];
    return out;
  };
  return {
    org: pick(org, ['@type', '@id', 'name', 'alternateName', 'url', 'logo', 'image',
      'telephone', 'email', 'taxID', 'vatID', 'address', 'hasMap', 'sameAs', 'priceRange']),
    site: pick(site, ['@type', '@id', 'url', 'name', 'publisher'])
  };
})();

const SOCIAL_IMAGE = {
  'obra-civil': 'p1',
  'acueducto': 'p8',
  'taludes': 'p9',
  'remodelaciones': 'p2'
};

const PHOTOS = (() => {
  /* Se localiza primero la tarjeta y después se lee cada atributo por separado:
     así reordenarlos —o llegar a la obra número diez— deja de romper nada. */
  const out = {};
  for (const m of source.matchAll(/<article class="project[^"]*"[^>]*>/g)) {
    const tag = m[0];
    const slug = (tag.match(/\sdata-slug="([a-z0-9-]+)"/) || [])[1];
    const count = (tag.match(/\sdata-count="(\d+)"/) || [])[1];
    const key = (tag.match(/\sdata-key="(p\d+)"/) || [])[1];
    if (!slug || !count || !key) {
      throw new Error('Tarjeta de obra incompleta (faltan data-slug, data-count o data-key): ' + tag.slice(0, 120));
    }
    out[key] = { slug, count: Number(count) };
  }
  return out;
})();

/* Imagen social de una página: la de la obra si la tiene, la de la marca si
   no. El texto alternativo sale del diccionario, así que también viaja
   traducido en /en/ y /pt/. */
function pageImage(page, lang) {
  const key = page.project || SOCIAL_IMAGE[page.id];
  if (!key || !PHOTOS[key]) {
    return {
      url: BASE + 'assets/img/brand/og-image.jpg',
      w: 1200,
      h: 630,
      alt: DICT[lang]['meta.ogAlt']
    };
  }
  /* -1-og.jpg, no -1.jpg: la fotografía original llega a 640 KB y por encima de
     unos 600 KB WhatsApp deja de dibujar la vista previa. La variante social la
     produce tools/build-images.js; si falta, el generador falla en voz alta en
     lugar de publicar una tarjeta que no se ve. */
  const rel = 'assets/img/proyectos/' + PHOTOS[key].slug + '-1-og.jpg';
  if (!fs.existsSync(path.join(ROOT, rel))) {
    throw new Error('Falta la variante social ' + rel + ' — ejecute: node tools/build-images.js');
  }
  const size = jpegSize(rel);
  return { url: BASE + rel, w: size.w, h: size.h, alt: DICT[lang]['prj.' + key + '.alt'] };
}

/* Rejilla de fotografías de una obra. Se sirve la variante de 640 px, que es lo
   que ocupa una celda; el .jpg queda de respaldo. Las rutas se escriben
   relativas a la raíz y rewriteHead les antepone después los "../" que toquen. */
function buildGallery(key, lang) {
  const T = DICT[lang];
  const p = PHOTOS[key];
  if (!p) throw new Error('No se encontró data-count para la obra ' + key);
  const alt = T['prj.' + key + '.alt'] || T['prj.' + key + '.t'];
  const shots = [];
  for (let i = 1; i <= p.count; i++) {
    const base = 'assets/img/proyectos/' + p.slug + '-' + i;
    shots.push(
      '        <figure class="shot">\n' +
      '          <picture>\n' +
      `            <source type="image/webp" srcset="${base}-640.webp">\n` +
      `            <img src="${base}.jpg" loading="lazy" decoding="async" alt="${escAttr(alt)} (${i}/${p.count})">\n` +
      '          </picture>\n' +
      '        </figure>'
    );
  }
  return '      <div class="shots">\n' + shots.join('\n') + '\n      </div>';
}

/* El contenido de cada página secundaria vive en un archivo por idioma. El
   título y la descripción viajan como comentarios al principio, junto al texto
   que describen, en lugar de en una tabla aparte del generador. */
function readContent(page, lang) {
  const file = path.join(ROOT, page.content + '.' + lang + '.html');
  if (!fs.existsSync(file)) throw new Error('Falta el contenido: ' + path.relative(ROOT, file));
  const raw = fs.readFileSync(file, 'utf8');
  const title = raw.match(/<!--\s*title:\s*([\s\S]*?)\s*-->/);
  const desc = raw.match(/<!--\s*description:\s*([\s\S]*?)\s*-->/);
  if (!title || !desc) {
    throw new Error('Faltan los comentarios "title:" y "description:" en ' + path.relative(ROOT, file));
  }
  return {
    title: title[1].trim(),
    desc: desc[1].trim(),
    body: raw.replace(/<!--\s*(?:title|description):[\s\S]*?-->\s*/g, '').trim()
  };
}

const built = [];

// El diccionario se escribe antes de sellar, para que la huella de caché se
// calcule sobre el archivo recién generado y no sobre el de la vuelta anterior.
const dictBytes = {};
for (const lang of Object.keys(LOCALES)) dictBytes[lang] = writeLangDict(lang);

for (const page of PAGES) {
  for (const lang of Object.keys(LOCALES)) {
    const at = locate(page, lang);
    let meta;
    let out;

    if (page.id === 'home') {
      meta = { title: DICT[lang]['meta.title'], desc: DICT[lang]['meta.desc'] };
      out = source;
    } else {
      const content = readContent(page, lang);
      meta = { title: content.title, desc: content.desc };
      let body = content.body;
      if (page.project) {
        if (!body.includes('<!-- galeria -->')) {
          throw new Error('Falta el marcador <!-- galeria --> en ' + page.content + '.' + lang + '.html');
        }
        body = body.replace('<!-- galeria -->', () => buildGallery(page.project, lang));
      }
      out = SHELL.head + SHELL.prelude + '<main id="main">\n' + body + '\n</main>' + SHELL.postlude;

      // Aquí no hay héroe: precargarlo descargaría cientos de KB que no se pintan.
      out = out.replace(/\n?\s*<link rel="preload" as="image"[^>]*>/, '');

      // Ni galería: el visor sobra. app.js ya comprueba que exista antes de usarlo.
      out = out.replace(/<!-- visor -->[\s\S]*?<!-- \/visor -->\n?/, '');
    }

    out = translateBody(out, lang);
    out = rewriteHead(out, lang, page, at, meta);
    out = writeWhatsAppLinks(out, lang, page);
    if (page.id !== 'home') out = pointAnchorsHome(out, at);
    out = rewritePageLinks(out, lang, at);
    out = useLangDict(out, lang);
    out = writeAnalytics(out);
    out = stampAssets(out);

    fs.mkdirSync(path.dirname(at.file), { recursive: true });
    fs.writeFileSync(at.file, out, 'utf8');
    built.push(('/' + at.parts.join('/') + (at.parts.length ? '/' : '')).padEnd(26) +
      (out.length / 1024).toFixed(0).padStart(3) + ' KB');
  }
}

/* ------------------------------------------------- sitemap.xml y robots.txt
   Se generan a partir de BASE en lugar de mantenerse a mano: así el dominio
   vive en un solo sitio y las tres versiones de idioma declaran sus imágenes
   con el título traducido, no solo la española. */
const today = BUILD_DATE;

function sitemapAlternates(page) {
  return Object.keys(LOCALES)
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${locate(page, l).url}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${locate(page, 'es').url}"/>`)
    .join('\n');
}

function sitemapImages(lang) {
  const T = DICT[lang];
  return PROJECTS.map(([key, slug]) =>
    '    <image:image>\n' +
    `      <image:loc>${BASE}assets/img/proyectos/${slug}-thumb.jpg</image:loc>\n` +
    `      <image:title>${esc(T['prj.' + key + '.t'] + ' — ' + T['prj.' + key + '.l'])}</image:title>\n` +
    '    </image:image>'
  ).join('\n');
}

/* Las fotografías de una obra son la prueba del trabajo hecho, y la búsqueda de
   imágenes trae visitas propias. Cada página de obra declara las suyas —todas,
   no solo la miniatura— con el título traducido de esa obra. */
function sitemapProjectImages(key, lang) {
  const T = DICT[lang];
  const p = PHOTOS[key];
  const shots = [];
  for (let i = 1; i <= p.count; i++) {
    shots.push(
      '    <image:image>\n' +
      `      <image:loc>${BASE}assets/img/proyectos/${p.slug}-${i}.jpg</image:loc>\n` +
      `      <image:title>${esc(T['prj.' + key + '.t'] + ' — ' + T['prj.' + key + '.l'])}</image:title>\n` +
      '    </image:image>'
    );
  }
  return shots.join('\n');
}

const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml"\n' +
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n\n' +
  PAGES.flatMap((page) => Object.keys(LOCALES).map((lang) => {
    const at = locate(page, lang);
    const home = page.id === 'home';
    /* Jerarquía real del sitio: la portada primero; después las páginas de
       servicio, que son las que compiten por «constructora en Armenia»; luego
       las obras que las respaldan, y al final cobertura y la página legal.
       Antes todo lo que no fuera la portada valía 0.3, lo que dejaba la página
       de reparación de daños por sismo al mismo nivel que la política de
       datos. */
    const priority = home
      ? (LOCALES[lang].dir ? '0.9' : '1.0')
      : page.service ? '0.8'
        : page.project ? '0.6'
          : page.id === 'cobertura' ? '0.5'
            : '0.2';
    const changefreq = home || page.service ? 'monthly' : 'yearly';
    return '  <url>\n' +
      `    <loc>${at.url}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      `    <changefreq>${changefreq}</changefreq>\n` +
      `    <priority>${priority}</priority>\n` +
      sitemapAlternates(page) + '\n' +
      (home ? sitemapImages(lang) + '\n' : '') +
      (page.project ? sitemapProjectImages(page.project, lang) + '\n' : '') +
      '  </url>';
  })).join('\n\n') +
  '\n\n</urlset>\n';

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

const robots =
  'User-agent: *\n' +
  'Allow: /\n\n' +
  'Sitemap: ' + BASE + 'sitemap.xml\n';

fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots, 'utf8');

const has404 = write404();

console.log('Páginas generadas:\n  ' + built.join('\n  '));
console.log('sitemap.xml y robots.txt' + (has404 ? ' y 404.html' : '') +
  ' regenerados (lastmod ' + today + ')');
