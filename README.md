# YU Constructora — sitio web oficial

Sitio web de **YU Construcciones S.A.S.** (NIT 901400072-5), constructora de obra civil e
infraestructura con sede en Armenia, Quindío, Colombia.

🔗 **Sitio publicado:** https://yuconstructora.com/

---

## Qué incluye

| Área | Detalle |
|---|---|
| **Diseño** | Modo oscuro por defecto + modo claro, paleta tomada del logotipo oficial (ámbar `#f5a302` sobre carbón `#12161a`), tipografía Barlow / Barlow Condensed |
| **Idiomas** | Español (`/`), Inglés (`/en/`) y Portugués (`/pt/`) — **páginas estáticas independientes**, no traducción por JavaScript, para que cada idioma se indexe con su propio HTML, `<title>`, descripción y datos estructurados |
| **Tamaño** | **54 páginas** indexables: portada, 6 servicios, 9 obras, cobertura y política de datos, cada una en los tres idiomas |
| **Contenido** | Héroe con carrusel de obra real, franja de atención post-sismo, 10 servicios (6 con página propia), 9 obras con página y galería completa (41 fotografías), proceso de 5 etapas, cobertura por municipios, 6 diferenciadores, cotizador rápido, 11 preguntas frecuentes, contacto |
| **Captación** | Botón flotante de WhatsApp, cotizador que arma el mensaje listo para enviar, formulario de contacto por FormSubmit con casilla de autorización de datos, y triaje por fotografía en WhatsApp para daños de sismo y arreglos pequeños |
| **SEO** | Datos estructurados `GeneralContractor` + `WebSite` + `WebPage` + `ItemList` + `FAQPage` + `Service` + `CreativeWork` por obra + `BreadcrumbList` en cada página secundaria. `sitemap.xml` con `hreflang`, prioridad por tipo de página y las fotografías de cada obra, `robots.txt`, Open Graph con **imagen propia por página** (la obra o el servicio que se comparte, no la genérica), Twitter Cards. `areaServed` con la región, los cuatro departamentos y quince municipios |
| **Accesibilidad** | Enlace de salto, roles ARIA, navegación por teclado en la galería, `prefers-reduced-motion`, foco visible, respaldo en `<noscript>` para el contenido animado, HTML validado |
| **Rendimiento** | **Cero dependencias externas**: tipografías auto-alojadas (sin Google Fonts), iconos SVG en línea, carga diferida, precarga del héroe y de las dos fuentes críticas. Imágenes responsivas en WebP con respaldo JPEG (un teléfono baja 2,0 MB en lugar de 11,1 MB) y diccionario servido por idioma (20 KB en lugar de 58 KB) |

## Estructura

```
yu-constructores/
├── index.html              # Página en español (FUENTE: aquí se edita la estructura)
├── en/index.html           # Generada — no editar a mano
├── pt/index.html           # Generada — no editar a mano
├── 404.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest        # PWA / icono en escritorio
├── .nojekyll               # Evita el procesado Jekyll en GitHub Pages
├── AUTHORS.md
│
│  ── Todo lo de abajo se GENERA. No editar a mano. ──
├── en/  ·  pt/             # Portadas en inglés y portugués
├── servicios/…             # 6 páginas de servicio  (en/services/, pt/servicos/)
├── proyectos/…             # 9 páginas de obra      (en/projects/, pt/projetos/)
├── cobertura/              # Zonas de operación     (en/coverage/, pt/cobertura/)
├── politica-de-datos/      # Política de datos      (en/privacy-policy/, pt/politica-de-dados/)
│
├── tools/                  # Nada de aquí se publica: son las fuentes de compilación
│   ├── build-i18n.js       # Genera las 48 páginas + sitemap + robots + rutas del 404
│   ├── build-images.js     # Genera las variantes .webp a partir de los .jpg
│   ├── i18n.js             # FUENTE: diccionarios ES · EN · PT (270 claves por idioma)
│   └── pages/              # FUENTE de las páginas secundarias, un archivo por idioma
│       ├── cobertura.{es,en,pt}.html
│       ├── privacidad.{es,en,pt}.html
│       ├── obra-civil / acueducto / taludes / remodelaciones .{es,en,pt}.html
│       ├── sismo.{es,en,pt}.html          # reparación de daños por sismo
│       ├── obras-menores.{es,en,pt}.html  # arreglos y trabajos de un día
│       └── obra-p1 … obra-p9 .{es,en,pt}.html     # una por obra ejecutada
└── assets/
    ├── css/fonts.css       # @font-face de las tipografías auto-alojadas
    ├── css/styles.css      # Estilos (tokens de tema, componentes, responsive)
    ├── fonts/              # Barlow y Barlow Condensed (woff2, subconjuntos latin)
    ├── js/i18n.{es,en,pt}.js  # Generados — cada página carga solo el suyo (20 KB)
    ├── js/app.js           # Tema, carrusel, filtros, galería, cotizador, formulario
    └── img/
        ├── brand/          # Logotipos, héroes, imagen Open Graph
        └── proyectos/      # 41 fotografías (32 de obra + 9 miniaturas)
                            # cada .jpg tiene sus .webp por anchura (generados)
```

> **Importante:** `en/index.html`, `pt/index.html`, `assets/js/i18n.{es,en,pt}.js`,
> `sitemap.xml` y `robots.txt` se generan. Después de tocar `index.html` o
> `tools/i18n.js` hay que ejecutar:
>
> ```bash
> node tools/build-i18n.js
> ```
>
> El generador falla en voz alta si falta una clave en algún idioma, así que sirve
> también como validación.

### Comprobar antes de publicar

```bash
node tools/check.js
```

Recorre las 54 páginas y falla con código 1 si encuentra algo. Comprueba recursos y
enlaces rotos, `data-page` sin resolver, anclas sin destino, marcado mal anidado, títulos
o descripciones duplicados o demasiado largos, imágenes sin `alt`, `hreflang` que no se
autorreferencia, JSON-LD inválido, **que exista un único número de contacto en todo el
sitio**, **que el menú móvil no vuelva a quedar dentro de `<header>`** y **que ningún
`aria-label` esté escrito a mano** (uno escrito a mano se queda en español en `/en/` y
`/pt/`).

Ese último control existe por un motivo concreto: un teléfono desactualizado en una sola
página perdida es un cliente perdido, y es el tipo de error que no da la cara al revisar
a ojo.

### Imágenes

Cada `.jpg` tiene versiones `.webp` en varias anchuras, que el HTML ofrece dentro de
`<picture>` con el `.jpg` como respaldo. El héroe es lo que Google mide como LCP: a
1920 px pesa 439 KB y a 768 px, 82 KB, así que un teléfono ya no descarga la versión
de escritorio.

Tras añadir o reemplazar fotografías:

```bash
npm install --no-save sharp     # solo la primera vez de cada sesión
node tools/build-images.js      # --force para reconvertirlo todo
```

`--no-save` instala en `node_modules/` sin crear `package.json`: el sitio publicado
sigue sin dependencias y la carpeta puede borrarse al terminar. El generador solo
convierte lo que haya cambiado.

### Añadir una página nueva

Las páginas secundarias aportan solo el contenido de `<main>`; el generador las
envuelve con la cabecera, el pie y el sprite de iconos de `index.html`, de modo que la
navegación y el estilo no se duplican.

1. Crear `tools/pages/mi-pagina.{es,en,pt}.html` con el contenido y, arriba del todo,
   dos comentarios obligatorios:
   ```html
   <!-- title: Título para la pestaña y el buscador -->
   <!-- description: Resumen de 150-160 caracteres. -->
   ```
2. Registrarla en la lista `PAGES` de `tools/build-i18n.js`, con un slug propio por idioma:
   ```js
   { id: 'mi-pagina', content: 'tools/pages/mi-pagina',
     slug: { es: 'mi-pagina', en: 'my-page', pt: 'minha-pagina' } }
   ```
3. Ejecutar `node tools/build-i18n.js`.

El generador se encarga del canónico, el `hreflang` entre las tres versiones, el
`BreadcrumbList`, el conmutador de idioma, las rutas relativas según la profundidad y la
entrada en el `sitemap.xml`. Para enlazar desde otra página se escribe el destino por su
identificador y la ruta se resuelve sola:

```html
<a href="#" data-page="mi-pagina">Ver la página</a>
```

## Atención por el sismo del 10 de agosto de 2026

El 10/08/2026 un sismo de **magnitud 7,4** con epicentro cerca de San José del Palmar
(Chocó) y 96 km de profundidad golpeó el centro y el occidente del país. El Eje Cafetero
—la zona de trabajo de la empresa— fue de lo más afectado: Armenia reportó 174 heridos y
cinco edificios colapsados, y Pereira y Manizales, colapsos y caídas de fachada. Entre la
infraestructura dañada está el **Aeropuerto Internacional Matecaña**, donde YU ya ejecutó
dos obras.

Lo que se añadió al sitio el 14/08/2026:

| Añadido | Dónde |
|---|---|
| **Página de reparación de daños por sismo** | `tools/pages/sismo.{es,en,pt}.html` → `/servicios/reparacion-danos-sismo-armenia-quindio/` y sus versiones EN · PT |
| **Página de reparaciones menores** | `tools/pages/obras-menores.{es,en,pt}.html` → `/servicios/reparaciones-menores-arreglos-armenia/` y sus versiones EN · PT |
| **Franja de atención en la portada** | Sección `#post-sismo` de `index.html`, entre las cifras y los servicios |
| **Dos servicios nuevos** | Tarjetas 9 y 10 (`svc.9.*`, `svc.10.*`), con página propia y nodo `Service` |
| **Dos opciones del cotizador** | «Daño por sismo» y «Arreglo pequeño» (`quote.type6`, `quote.type7`) |
| **Tres preguntas frecuentes** | `faq.q9`–`faq.q11`, que entran solas al `FAQPage` |
| **Dos mensajes de WhatsApp** | `wa.sismo` y `wa.menores`, medidos por separado en la analítica |

Tres decisiones que conviene no deshacer sin pensarlo:

- **El slug no lleva la fecha ni la palabra «terremoto».** Es
  `reparacion-danos-sismo-armenia-quindio`, no `terremoto-agosto-2026`. El daño sísmico se
  repara durante años y la región es zona de amenaza sísmica alta: la página tiene que
  seguir sirviendo cuando la noticia pase.
- **La franja informa, no alarma.** Acento en el ámbar de la marca, sin rojo de emergencia
  y sin animación. Quien llega ahí acaba de pasar por un terremoto.
- **El sitio dice explícitamente que YU no hace la evaluación oficial de daños.** La hace
  gratis la oficina de gestión del riesgo de la alcaldía y es la que vale ante aseguradoras
  y ayudas del Estado. Decirlo cuesta cero y es lo que separa a una constructora seria de
  la oferta improvisada que aparece después de un desastre. La página también advierte que
  el reforzamiento estructural exige licencia de construcción (Ley 400 de 1997 y NSR-10).

> **Revisión pendiente del ingeniero.** Los criterios para distinguir una fisura
> superficial de un daño estructural están redactados como orientación general y así se
> declaran, pero conviene que el Ing. Diego Luis Arango Jaramillo los valide antes de dejar
> el texto como definitivo.

## Arreglo del menú móvil · 1 de septiembre de 2026

El cliente avisó de que en el teléfono, al tocar las tres rayitas, «solo sale una
pestañita»: el panel se abría recortado y únicamente asomaba **Inicio**. Pasaba en las
**54 páginas**, en los tres idiomas, y no era del contenido sino de una regla de CSS que
casi nadie tiene presente:

> Un elemento con `filter` o `backdrop-filter` se convierte en el **bloque contenedor** de
> sus descendientes `position: fixed`.

La cabecera lleva `backdrop-filter` para el efecto de cristal, y el panel del menú vivía
dentro de ella. En lugar de anclarse a la ventana, se anclaba a la barra: `inset:
var(--header-h) 0 0 0` dejaba un panel de 80 px de alto sobre 844 px de pantalla, con los
637 px de contenido recortados dentro.

Lo verificado con el navegador antes y después, a 390 × 844:

| | Antes | Después |
|---|---|---|
| Alto del panel | 80 px | 778 px |
| Enlaces visibles | 1 de 8 (a medias) | 8 de 8 |
| Se ancla a | `<header>` | la ventana |

Qué se cambió:

- **El panel salió de `<header>`** y es ahora un `<nav>` hermano. Es todo el arreglo; el
  resto es refuerzo.
- **`tools/check.js` falla** si alguien lo vuelve a meter dentro de la cabecera.
- El panel se compacta en pantallas bajas y pasa a **dos columnas** con el teléfono en
  horizontal, para que las ocho entradas quepan sin desplazarse.
- **Escape lo cierra** y devuelve el foco al botón; al pasar a escritorio se cierra solo,
  que si no el cuerpo se quedaba bloqueado y la página no se podía desplazar.
- El botón «Cotizar» del menú recupera su forma: `.mobile-nav a` le ganaba en
  especificidad y lo dejaba alineado a la izquierda y con el texto **blanco sobre ámbar**
  en modo oscuro.

### Lo que apareció al repasar el resto del sitio

Se recorrieron las 54 páginas con un navegador de verdad, en tres anchuras, comprobando
consola, recursos, desbordes, menú, galería, cotizador, formulario y anclas:

- **Siete `aria-label` escritos a mano** («Navegación principal», «Ubicación en Google
  Maps», «Correo electrónico», redes…) se quedaban en español en las 36 páginas de
  `/en/` y `/pt/`. Ahora salen del diccionario, y el comprobador impide que vuelva a
  colarse uno.
- **Zonas táctiles de 34 px** en la cabecera por debajo de 420 px de ancho. Subidas a
  40 px, que es el mínimo con el que un dedo no falla.
- **El nombre accesible del logotipo y del selector de idioma no contenía su texto
  visible**: quien navega por voz decía «pulsa YU Constructora» y no pasaba nada.
- El visor de galería llevaba `<img src="">`, que en algunos navegadores pide la página
  entera otra vez.

Lo que **no** se tocó: los tres héroes diferidos aparecen como «imágenes rotas» en
cualquier auditoría automática hasta que el carrusel los pide. Es deliberado —así el
teléfono baja una y no cuatro— y se queda como está.

## Activar la medición

El sitio trae la instalación lista pero **apagada**: sin token no se emite ninguna
etiqueta y no se recoge nada.

Se eligió **Cloudflare Web Analytics** porque no pone cookies, no recoge datos personales
y no necesita banner de consentimiento. Google Analytics obligaría a contradecir la
política de tratamiento de datos publicada, que promete justamente lo contrario.

1. En [dash.cloudflare.com](https://dash.cloudflare.com) → **Web Analytics** → añadir
   `yuconstructora.com`. No hace falta mover el DNS.
2. Copiar el `token` del fragmento que entrega.
3. Pegarlo en la constante `ANALYTICS_TOKEN` de `tools/build-i18n.js` y regenerar.
4. **Actualizar la política de datos**: el apartado 2 dice hoy que el sitio no usa
   herramientas de analítica. Con la medición activa deja de ser cierto y hay que
   corregirlo en los tres archivos `tools/pages/privacidad.*.html`.

`assets/js/app.js` registra además los sucesos que valen dinero —clic en WhatsApp
distinguiendo el origen, llamada, correo y envío del formulario, correcto o fallido—.
La función `track()` no hace nada si no hay analítica cargada, así que ni la medición ni
un bloqueador pueden romper una conversión.

## Cambiar de dominio

El dominio vive en **un solo sitio**, la constante `BASE` de `tools/build-i18n.js`.
Al regenerar, el valor se propaga al `hreflang`, al canónico, a Open Graph, a todo el
bloque JSON-LD, al `sitemap.xml` y al `robots.txt` de los tres idiomas:

```bash
YU_BASE=https://yuconstructora.com/ node tools/build-i18n.js
```

Para dejarlo fijo, editar la constante `BASE` en `tools/build-i18n.js`. En GitHub Pages
hay que añadir además un archivo `CNAME` con el dominio y apuntar el DNS.

## Datos de la empresa usados en el sitio

- **Razón social:** YU Construcciones S.A.S.
- **NIT:** 901400072-5
- **Dirección:** Calle 20 #12-32, piso 1, Sector Centro — Armenia, Quindío
- **WhatsApp y teléfono:** +57 304 655 7120
- **Correo:** yuconstruccionessas@gmail.com
- **Instagram:** [@yuconstructorasas](https://www.instagram.com/yuconstructorasas)
- **Google Maps:** https://maps.app.goo.gl/aVbfpvg7zthBdL8MA

## Cómo trabajarlo

No requiere compilación ni dependencias. Para verlo en local:

```bash
python -m http.server 8080
# luego abrir http://localhost:8080
```

### Cambiar textos
Todos los textos visibles viven en `tools/i18n.js`, en tres bloques (`es`, `en`, `pt`).
Buscar la clave, editar el valor en los tres idiomas y volver a generar:
`node tools/build-i18n.js`.

### Agregar un proyecto
1. Guardar las fotos en `assets/img/proyectos/` como `mi-proyecto-1.jpg`, `-2.jpg`… y una
   miniatura `mi-proyecto-thumb.jpg` (900×675).
2. Duplicar un bloque `<article class="project">` en `index.html` y ajustar
   `data-slug`, `data-count`, `data-cat` y `data-key`. La miniatura va dentro de un
   `<picture>`: copiar el de un proyecto vecino y cambiar el nombre del archivo.
3. Añadir las claves `prj.pN.t`, `prj.pN.l`, `prj.pN.d` y `prj.pN.alt` en los tres idiomas.
4. Añadir el proyecto a la lista `PROJECTS` de `tools/build-i18n.js`, para que entre
   en los datos estructurados y en el `sitemap.xml`.
5. Para darle página propia: crear `tools/pages/obra-pN.{es,en,pt}.html` —copiar una
   existente— con el marcador `<!-- galeria -->` donde vaya la rejilla de fotos, y
   registrarla en el bucle de páginas de obra de `tools/build-i18n.js`.
6. Ejecutar `node tools/build-images.js`, luego `node tools/build-i18n.js` y por último
   `node tools/check.js`.

### Formulario de contacto
Usa [FormSubmit](https://formsubmit.co) apuntando a `yuconstruccionessas@gmail.com`.
**El primer envío llega como correo de activación**: hay que abrirlo y confirmar el
enlace una sola vez para que los mensajes siguientes lleguen a la bandeja.

## Pendientes sugeridos

- [x] ~~Activar FormSubmit~~ — hecho y verificado de punta a punta el 23/07/2026.
- [x] ~~Publicar el horario de atención~~ — lunes a viernes de 8:00 a 18:00, visible en
      Contacto y declarado como `openingHoursSpecification` (28/07/2026).
- [x] ~~Conectar un dominio propio~~ — **yuconstructora.com** conectado el 24/07/2026
      (DNS en Namecheap, archivo `CNAME` y HTTPS de GitHub Pages).
- [x] ~~Centralizar el dominio~~ — vive solo en `BASE`; el generador lo propaga al HTML,
      al `sitemap.xml`, al `robots.txt` y a las rutas absolutas del `404.html` (28/07/2026).
- [x] ~~Imágenes responsivas~~ — WebP por anchura con respaldo JPEG; la primera carga en
      teléfono baja de 11,1 MB a 2,0 MB (28/07/2026).
- [x] ~~Declarar Facebook y TikTok~~ en `sameAs` y en el pie (28/07/2026).
- [x] ~~Registrar el sitio en Google Search Console~~ — dominio verificado por registro
      TXT y `sitemap.xml` aceptado (28/07/2026).
- [x] ~~Completar la ficha de Google Business Profile~~ — reclamada, verificada y con
      datos, servicios y fotografías (28/07/2026). Primera reseña recibida.
- [x] ~~Reforzar el Eje Cafetero~~ — página de cobertura propia y `areaServed` con la
      región, cuatro departamentos y quince municipios (28/07/2026). Deliberadamente **no**
      se creó una página por municipio: veinte páginas casi idénticas son *doorway pages*
      y Google las penaliza.
- [x] ~~Cambio de número de contacto~~ a +57 304 655 7120 (11/08/2026), sustituido en las
      51 fuentes y verificado en producción.

- [x] ~~Atención por el sismo del 10 de agosto de 2026~~ — dos servicios nuevos con página
      propia en los tres idiomas, franja en la portada, opciones de cotizador, tres FAQ y
      medición separada (14/08/2026). El sitio llegó a 54 URLs.
- [x] ~~Menú móvil recortado~~ — el panel salió de `<header>`, que con `backdrop-filter` lo
      recortaba a la altura de la barra en las 54 páginas (01/09/2026). Ver la sección
      «Arreglo del menú móvil».
- [x] ~~Imagen social por página~~ — al reenviar por WhatsApp el enlace de una obra o de un
      servicio, la vista previa muestra ya esa obra y no la imagen genérica (01/09/2026).

Lo que más pesa ahora está **fuera del código**, y con el sismo hay cosas que caducan:

- [ ] **Publicar los dos servicios nuevos en la ficha de Google** (Reparación de daños por
      sismo · Reparaciones menores) y poner una entrada en «Novedades» diciendo que se está
      atendiendo la emergencia. En búsqueda local, la ficha mueve más que la web, y ahora
      mismo es lo más urgente de todo lo que queda en esta lista.
- [ ] **Publicar obra real de reparación**: fotografías del antes y el después de las
      primeras reparaciones post-sismo, con municipio y fecha. Es lo que convierte la página
      nueva en algo que Google trata como experiencia de primera mano y no como texto de
      servicio. Se añaden como una obra más (ver «Agregar un proyecto»).
- [ ] **Ofrecerse a las alcaldías y a las administraciones de propiedad horizontal** del
      Quindío y Risaralda. La demanda de reparación post-sismo se contrata en bloque, no
      casa por casa, y YU ya tiene historial de obra pública en la región.
- [ ] **Seguir pidiendo reseñas.** Es el factor de mayor peso en el posicionamiento local
      que queda por trabajar. Nunca se incluyeron testimonios ficticios; el espacio del
      sitio está listo para cuando haya cinco o seis reales.
      **No añadir `aggregateRating` al sitio**: calificarse a sí mismo en la propia web
      incumple las normas de datos estructurados y arriesga una acción manual.
- [ ] **Publicar en la ficha cada semana.** La sección «Novedades» premia la actividad.
- [ ] **Actualizar el número nuevo fuera del sitio**: ficha de Google, Instagram,
      Facebook, TikTok, firmas de correo y directorios. La coherencia del NAP (nombre,
      dirección, teléfono) entre fuentes es un factor de posicionamiento local.

Pendientes de contenido:

- [x] ~~Política de tratamiento de datos~~ (Ley 1581 de 2012) — publicada en los tres
      idiomas, enlazada desde el pie y con casilla de autorización obligatoria en el
      formulario (28/07/2026). **Conviene que la revise un abogado** antes de darla por
      definitiva: el plazo de conservación de dos años es un supuesto razonable, no un
      dato que haya aportado la empresa.
- [x] ~~Páginas propias por servicio~~ — cuatro servicios con página propia en los tres
      idiomas, con `Service` y `BreadcrumbList`, enlazados desde su tarjeta de la portada
      (28/07/2026). **El texto técnico debería revisarlo el ingeniero.**
- [x] ~~Página propia por obra~~ — las nueve obras, en los tres idiomas, con galería
      completa, ficha de datos y `CreativeWork` (28/07/2026). El sitio llegó a 48 URLs.
- [ ] **Nombrar a las entidades contratantes** de la obra pública: el alcantarillado de
      La Miranda, los dos colegios y el Aeropuerto Matecaña. La empresa ya autorizó
      hacerlo, pero faltan los nombres exactos. Da más credibilidad que cualquier texto de
      marketing y suele abrir la puerta a un enlace desde el sitio de la entidad.
- [ ] Páginas para los otros cuatro servicios (mantenimiento de infraestructura,
      estructuras y cimentaciones, urbanismo, consultoría). Se añaden igual que las
      existentes; ver «Añadir una página nueva».
- [ ] **Que el ingeniero revise la guía de daños por sismo**, en particular la lista que
      separa la fisura superficial del daño estructural. Está redactada como orientación
      general y así lo advierte, pero es el texto del sitio con más consecuencias si alguien
      lo toma al pie de la letra.
- [ ] Sección de testimonios cuando haya cinco o seis reseñas reales, con enlace a la
      ficha y **sin** marcado de reseña.
- [ ] Nombrar las entidades contratantes de la obra pública (alcantarillado y colegios),
      si la empresa autoriza. Da más credibilidad que cualquier texto de marketing.
- [ ] Sumar certificados, RUP o pólizas escaneadas si se quieren mostrar públicamente.
- [x] ~~Añadir Facebook y TikTok~~ al pie y a `sameAs` (28/07/2026). Falta LinkedIn si se abre.

## Autoría

Sitio desarrollado por **Dr. Mauricio Rodríguez Herrera**. Ver [AUTHORS.md](AUTHORS.md).
