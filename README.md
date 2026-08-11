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
| **Tamaño** | **48 páginas** indexables: portada, 4 servicios, 9 obras, cobertura y política de datos, cada una en los tres idiomas |
| **Contenido** | Héroe con carrusel de obra real, 8 servicios (4 con página propia), 9 obras con página y galería completa (41 fotografías), proceso de 5 etapas, cobertura por municipios, 6 diferenciadores, cotizador rápido, FAQ, contacto |
| **Captación** | Botón flotante de WhatsApp, cotizador que arma el mensaje listo para enviar, formulario de contacto por FormSubmit con casilla de autorización de datos |
| **SEO** | Datos estructurados `GeneralContractor` + `WebSite` + `WebPage` + `ItemList` + `FAQPage` + `Service` + `CreativeWork` por obra + `BreadcrumbList` en cada página secundaria. `sitemap.xml` con `hreflang` e imágenes, `robots.txt`, Open Graph, Twitter Cards. `areaServed` con la región, los cuatro departamentos y quince municipios |
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
├── servicios/…             # 4 páginas de servicio  (en/services/, pt/servicos/)
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

Recorre las 48 páginas y falla con código 1 si encuentra algo. Comprueba recursos y
enlaces rotos, `data-page` sin resolver, anclas sin destino, marcado mal anidado, títulos
o descripciones duplicados o demasiado largos, imágenes sin `alt`, `hreflang` que no se
autorreferencia, JSON-LD inválido, y **que exista un único número de contacto en todo el
sitio**.

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

Lo que más pesa ahora está **fuera del código**:

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
- [ ] Sección de testimonios cuando haya cinco o seis reseñas reales, con enlace a la
      ficha y **sin** marcado de reseña.
- [ ] Nombrar las entidades contratantes de la obra pública (alcantarillado y colegios),
      si la empresa autoriza. Da más credibilidad que cualquier texto de marketing.
- [ ] Sumar certificados, RUP o pólizas escaneadas si se quieren mostrar públicamente.
- [x] ~~Añadir Facebook y TikTok~~ al pie y a `sameAs` (28/07/2026). Falta LinkedIn si se abre.

## Autoría

Sitio desarrollado por **Dr. Mauricio Rodríguez Herrera**. Ver [AUTHORS.md](AUTHORS.md).
