/* Verificación del sitio generado: recursos, enlaces, marcado, SEO y contacto. */
'use strict';
const fs = require('fs');
const path = require('path');

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr', 'use', 'path', 'circle', 'rect', 'polyline', 'line']);

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'tools', 'assets'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === 'index.html') pages.push(path.relative('.', p).split(path.sep).join('/'));
  }
})('.');
pages.sort();

const problems = [];
const add = (sev, page, msg) => problems.push({ sev, page, msg });
const titles = {}, descs = {}, canons = {};
let assets = 0, links = 0;

/* Número de contacto esperado: se toma del JSON-LD de la portada y se exige
   que TODO el sitio use el mismo. Un teléfono desactualizado en una sola
   página es un cliente perdido. */
const homeLd = JSON.parse(fs.readFileSync('index.html', 'utf8')
  .match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const TEL = homeLd['@graph'].find((n) => n['@type'] === 'GeneralContractor').telephone.replace('+', '');
const phones = new Set();

for (const page of pages) {
  const dir = path.dirname(page);
  const h = fs.readFileSync(page, 'utf8');
  const body = h.slice(h.indexOf('<body'));

  /* --- recursos --- */
  const refs = new Set();
  for (const m of h.matchAll(/\s(?:href|src|data-src)="((?:\.\.\/)*assets\/[^"]+)"/g)) refs.add(m[1]);
  for (const m of h.matchAll(/\s(?:data-)?(?:image)?srcset="([^"]+)"/g)) {
    m[1].split(',').forEach((p) => { const u = p.trim().split(/\s+/)[0]; if (u) refs.add(u); });
  }
  for (const r of refs) {
    assets++;
    if (!fs.existsSync(path.join(dir, r.split('?')[0]))) add('ERROR', page, 'recurso roto: ' + r);
  }

  /* --- enlaces internos --- */
  for (const m of h.matchAll(/href="((?:\.\.\/)+[a-z0-9/-]*|[a-z0-9-]+(?:\/[a-z0-9-]+)*\/)"/g)) {
    if (!m[1] || m[1] === './') continue;
    links++;
    if (!fs.existsSync(path.join(dir, m[1], 'index.html'))) add('ERROR', page, 'enlace roto: ' + m[1]);
  }
  for (const m of h.matchAll(/<a\s[^>]*\sdata-page="([a-z0-9-]+)"[^>]*>/g)) {
    const href = (m[0].match(/\shref="([^"]*)"/) || [])[1];
    links++;
    if (!href || href === '#') add('ERROR', page, 'data-page sin resolver: ' + m[1]);
    else if (!fs.existsSync(path.join(dir, href, 'index.html'))) add('ERROR', page, 'data-page roto: ' + href);
  }
  for (const m of h.matchAll(/href="((?:\.\.\/)+)#([a-z-]+)"/g)) {
    const target = path.join(dir, m[1], 'index.html');
    links++;
    if (!fs.existsSync(target)) add('ERROR', page, 'ancla rota: ' + m[1] + '#' + m[2]);
    else if (!fs.readFileSync(target, 'utf8').includes('id="' + m[2] + '"')) {
      add('ERROR', page, 'ancla sin destino: ' + m[1] + '#' + m[2]);
    }
  }

  /* --- teléfono coherente --- */
  // Se normaliza a solo dígitos: "+57 304…" y "wa.me/57304…" son el mismo número
  for (const m of h.matchAll(/wa\.me\/(\d+)/g)) phones.add(m[1]);
  for (const m of h.matchAll(/\+57\s?\d[\d\s]{8,}/g)) phones.add(m[0].replace(/\D/g, ''));

  /* --- marcado bien formado --- */
  const clean = h.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '');
  const stack = [];
  for (const m of clean.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g)) {
    const tag = m[2].toLowerCase();
    if (VOID.has(tag) || /\/\s*$/.test(m[3])) continue;
    if (m[1] !== '/') stack.push(tag);
    else if (stack.pop() !== tag) { add('ERROR', page, 'marcado mal anidado en </' + tag + '>'); break; }
  }
  if (stack.length) add('ERROR', page, 'etiquetas sin cerrar: ' + stack.slice(-3).join(', '));

  /* --- estructura del menú móvil ---
     El panel tiene que quedar FUERA de <header>: la cabecera lleva
     backdrop-filter y eso la convierte en bloque contenedor de sus hijos
     position:fixed, con lo que el menú se recorta a la altura de la barra y
     solo asoma el primer enlace. Pasó en producción; que no vuelva a pasar. */
  const headOpen = body.indexOf('<header');
  const headClose = body.indexOf('</header>');
  const navPos = body.indexOf('id="mobileNav"');
  if (navPos === -1) add('ERROR', page, 'falta el menú móvil (#mobileNav)');
  else if (headOpen !== -1 && headClose !== -1 && navPos > headOpen && navPos < headClose) {
    add('ERROR', page, '#mobileNav está dentro de <header>: el panel se recortará en móvil');
  }

  /* --- etiquetas accesibles traducidas ---
     Un aria-label escrito a mano se queda en español en /en/ y /pt/. Todos
     deben venir de una clave del diccionario, salvo los puramente numéricos
     (los puntos del carrusel). */
  for (const m of body.matchAll(/<[a-zA-Z][^>]*\saria-label="([^"]*)"[^>]*>/g)) {
    if (/^\d+$/.test(m[1])) continue;
    if (!/data-i18n-aria=/.test(m[0])) add('ERROR', page, 'aria-label sin traducir: "' + m[1] + '"');
  }

  /* --- SEO --- */
  const t = (h.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
  const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const c = (h.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '';
  (titles[t] = titles[t] || []).push(page);
  (descs[d] = descs[d] || []).push(page);
  (canons[c] = canons[c] || []).push(page);
  if (!t) add('ERROR', page, 'sin <title>');
  if (!d) add('ERROR', page, 'sin meta description');
  if (t.length > 62) add('AVISO', page, 'title de ' + t.length + ' caracteres');
  if (d.length > 165) add('AVISO', page, 'description de ' + d.length + ' caracteres');

  const heads = [...body.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  const h1 = heads.filter((n) => n === 1).length;
  if (h1 !== 1) add('ERROR', page, 'tiene ' + h1 + ' <h1>');

  for (const m of body.matchAll(/<img\s[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) add('ERROR', page, 'img sin alt');
  }

  const alts = [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  if (!alts.length) add('ERROR', page, 'sin hreflang');
  else if (!alts.some((a) => a[2] === c)) add('ERROR', page, 'hreflang no se autorreferencia');

  try {
    const ld = JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const wp = ld['@graph'].find((n) => n['@type'] === 'WebPage');
    if (wp && wp.url !== c) add('ERROR', page, 'URL del WebPage distinta del canónico');
  } catch (e) { add('ERROR', page, 'JSON-LD inválido: ' + e.message); }
}

for (const [t, ps] of Object.entries(titles)) if (ps.length > 1) add('ERROR', ps[0], 'title duplicado en ' + ps.length + ' páginas');
for (const [d, ps] of Object.entries(descs)) if (ps.length > 1) add('ERROR', ps[0], 'description duplicada en ' + ps.length + ' páginas');
for (const [c, ps] of Object.entries(canons)) if (ps.length > 1) add('ERROR', ps[0], 'canónico duplicado: ' + c);

/* Teléfonos: debe haber uno solo en todo el sitio */
const wrong = [...phones].filter((p) => p.replace(/^\+/, '') !== TEL);
if (wrong.length) add('ERROR', 'TODO EL SITIO', 'números distintos del oficial (' + TEL + '): ' + wrong.join(', '));

const errs = problems.filter((p) => p.sev === 'ERROR');
const warns = problems.filter((p) => p.sev === 'AVISO');
for (const p of [...errs, ...warns]) console.log(p.sev.padEnd(6) + p.page.padEnd(62) + p.msg);

console.log('\n' + pages.length + ' páginas · ' + assets + ' recursos · ' + links + ' enlaces');
console.log('teléfono único en todo el sitio: +' + TEL + '  (' + phones.size + ' variante' + (phones.size === 1 ? '' : 's') + ' encontrada' + (phones.size === 1 ? '' : 's') + ')');
console.log(errs.length + ' errores · ' + warns.length + ' avisos');
process.exit(errs.length ? 1 : 0);
