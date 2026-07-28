/* =============================================================================
   YU Constructora · Generador de imágenes WebP
   -----------------------------------------------------------------------------
   Los JPEG del sitio ya venían optimizados, así que cambiar de formato apenas
   ahorraba un 20%. Lo que sí pesa es el tamaño: el héroe mide 1920 px y se le
   estaba enviando entero a teléfonos de 390 px, unas seis veces más datos de los
   necesarios, justo en la imagen que Google mide como LCP. El mismo héroe a
   768 px baja de 739 KB a 109 KB.

   Por eso aquí se generan varias anchuras en WebP y el HTML las ofrece con
   srcset, para que cada dispositivo descargue la que le corresponde. El .jpg
   original se conserva como respaldo dentro de <picture>: ningún navegador se
   queda sin imagen.

   No se toca assets/img/brand/og-image.jpg: las miniaturas de WhatsApp, Facebook
   y X las generan rastreadores que no siempre entienden WebP, y ahí el formato
   antiguo sigue siendo la apuesta segura.

   Uso:
     npm install --no-save sharp
     node tools/build-images.js [--force]

   "--no-save" instala en node_modules sin crear package.json: el repositorio
   sigue sin dependencias declaradas y la carpeta puede borrarse al terminar.

   Autor: Dr. Mauricio Rodríguez Herrera
   ============================================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error(
    'Falta el codificador de imágenes.\n\n' +
    '  npm install --no-save sharp\n' +
    '  node tools/build-images.js\n'
  );
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const QUALITY = 78;
const FORCE = process.argv.includes('--force');

/* Anchuras por tipo de imagen. Se descartan las que superen el original: no
   tiene sentido ampliar un archivo para que ocupe más sin ganar detalle.

   · heroes    — ocupan el ancho completo de la ventana
   · nosotros  — media columna en escritorio
   · thumb     — rejilla de tres columnas, una sola en teléfono
   · galería   — se abre bajo demanda en el visor, no afecta a la primera carga
*/
const RULES = [
  { test: /brand[/\\]hero-\d+\.jpe?g$/i, widths: [768, 1280, 1920] },
  { test: /brand[/\\]nosotros\.jpe?g$/i, widths: [640, 1200] },
  { test: /-thumb\.jpe?g$/i, widths: [450, 900] },
  /* Fotos de obra: 640 para la rejilla de la página de proyecto, 1280 para el
     visor a pantalla completa. La rejilla las muestra a un tercio de ancho, así
     que servirlas a 1280 sería descargar cuatro veces los píxeles necesarios.

     "nominal" significa que el número del nombre es una etiqueta, no una medida:
     estas dos variantes se piden por nombre exacto —desde el guion del visor y
     desde el <source> de la rejilla— así que deben existir siempre, incluso para
     las pocas fotos que son más angostas que 640 px. withoutEnlargement evita
     que se amplíen: se quedan en su tamaño y conservan el nombre acordado. */
  { test: /proyectos[/\\][a-z0-9-]+-\d+\.jpe?g$/i, widths: [640, 1280], nominal: true },
  { test: /.*/, widths: [1280] }
];

/* og-image.jpg queda fuera a propósito (ver cabecera). */
const SKIP = new Set(['og-image.jpg']);
const DIRS = ['assets/img/brand', 'assets/img/proyectos'];

function sources() {
  const out = [];
  for (const dir of DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      if (!/\.jpe?g$/i.test(name) || SKIP.has(name)) continue;
      out.push(path.join(abs, name));
    }
  }
  return out.sort();
}

function ruleFor(file) {
  const rel = path.relative(ROOT, file);
  return RULES.find((r) => r.test.test(rel));
}

/* Regenera solo lo que haga falta: si la variante existe y es más reciente que
   el original, se deja. Volver a ejecutar tras añadir una foto cuesta segundos
   en lugar de reconvertirlo todo. */
function fresh(src, dest) {
  return !FORCE && fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs;
}

const kb = (n) => (n / 1024).toFixed(0).padStart(5) + ' KB';
const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';

(async () => {
  const files = sources();
  if (!files.length) {
    console.error('No se encontró ninguna imagen .jpg en ' + DIRS.join(' ni '));
    process.exit(1);
  }

  let built = 0;
  let kept = 0;
  let jpgBytes = 0;
  let smallestWebp = 0;

  for (const src of files) {
    const meta = await sharp(src).metadata();
    const rel = path.relative(ROOT, src).replace(/\\/g, '/');
    const base = rel.replace(/\.jpe?g$/i, '');
    const srcBytes = fs.statSync(src).size;
    jpgBytes += srcBytes;

    /* El nombre de archivo puede ser una medida o una etiqueta:

       · Sin "nominal" y con varias anchuras, los archivos alimentan un srcset y
         el descriptor "1280w" debe corresponder a píxeles reales, así que se
         descartan las anchuras que superen el original.
       · Con "nominal", o con una sola anchura, el archivo se pide por su nombre
         exacto desde el HTML o el guion: tiene que existir siempre.
         withoutEnlargement evita ampliarlo, así que se queda en su tamaño real
         y conserva el nombre acordado. */
    const rule = ruleFor(src);
    let widths = rule.widths;
    if (!rule.nominal && widths.length > 1) {
      const fit = widths.filter((w) => w <= meta.width);
      widths = fit.length ? fit : [meta.width];
    }

    const made = [];
    for (const w of widths) {
      const dest = path.join(ROOT, base + '-' + w + '.webp');
      if (fresh(src, dest)) {
        kept++;
      } else {
        await sharp(src).resize({ width: w, withoutEnlargement: true })
          .webp({ quality: QUALITY, effort: 6 }).toFile(dest);
        built++;
      }
      made.push({ w, bytes: fs.statSync(dest).size });
    }

    smallestWebp += made[0].bytes;

    console.log(
      rel.padEnd(50) + kb(srcBytes) + ' →  ' +
      made.map((m) => m.w + 'px ' + kb(m.bytes).trim()).join(' · ')
    );
  }

  console.log(
    '\n' + files.length + ' originales · ' + built + ' variantes generadas, ' + kept + ' ya al día\n' +
    'Primera carga en teléfono: ' + mb(jpgBytes) + ' en JPEG  →  ' + mb(smallestWebp) +
    ' con la variante más pequeña (' + (100 - (smallestWebp / jpgBytes) * 100).toFixed(0) + '% menos)'
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
