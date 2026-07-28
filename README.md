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
| **Contenido** | Héroe con carrusel de obra real, 8 servicios, 9 proyectos con galería completa (34 fotografías), proceso de 5 etapas, cobertura por municipios, 6 diferenciadores, cotizador rápido, FAQ, contacto |
| **Captación** | Botón flotante de WhatsApp, cotizador que arma el mensaje listo para enviar, formulario de contacto por FormSubmit |
| **SEO** | Datos estructurados `GeneralContractor` + `WebSite` + `WebPage` + `ItemList` (portafolio) + `FAQPage` + `Service` × 8, `sitemap.xml` con `hreflang` e imágenes, `robots.txt`, Open Graph, Twitter Cards, metadatos `geo.*`, anclas por servicio, textos orientados a búsquedas locales del Quindío |
| **Accesibilidad** | Enlace de salto, roles ARIA, navegación por teclado en la galería, `prefers-reduced-motion`, foco visible, HTML validado (sin contenido de flujo dentro de `<button>`, jerarquía de encabezados correcta) |
| **Rendimiento** | **Cero dependencias externas**: tipografías auto-alojadas (sin Google Fonts), iconos SVG en línea, carga diferida, precarga del héroe y de las dos fuentes críticas. Imágenes responsivas en WebP con respaldo JPEG (un teléfono baja 4,6 MB en lugar de 11,1 MB) y diccionario servido por idioma (18 KB en lugar de 56 KB) |

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
├── politica-de-datos/      # Generada — política de datos (ES)
├── en/privacy-policy/      # Generada — política de datos (EN)
├── pt/politica-de-dados/   # Generada — política de datos (PT)
├── servicios/…             # Generadas — 4 páginas de servicio (ES)
├── en/services/…           # Generadas — 4 páginas de servicio (EN)
├── pt/servicos/…           # Generadas — 4 páginas de servicio (PT)
├── tools/                  # Nada de aquí se publica: son las fuentes de compilación
│   ├── build-i18n.js       # Genera todas las páginas a partir de index.html + i18n.js
│   ├── build-images.js     # Genera las variantes .webp a partir de los .jpg
│   ├── i18n.js             # FUENTE: diccionarios ES · EN · PT (263 claves por idioma)
│   └── pages/              # FUENTE de las páginas secundarias, un archivo por idioma
│       ├── privacidad.{es,en,pt}.html
│       ├── obra-civil.{es,en,pt}.html
│       ├── acueducto.{es,en,pt}.html
│       ├── taludes.{es,en,pt}.html
│       └── remodelaciones.{es,en,pt}.html
└── assets/
    ├── css/fonts.css       # @font-face de las tipografías auto-alojadas
    ├── css/styles.css      # Estilos (tokens de tema, componentes, responsive)
    ├── fonts/              # Barlow y Barlow Condensed (woff2, subconjuntos latin)
    ├── js/i18n.{es,en,pt}.js  # Generados — cada página carga solo el suyo (18 KB)
    ├── js/app.js           # Tema, carrusel, filtros, galería, cotizador, formulario
    └── img/
        ├── brand/          # Logotipos, héroes, imagen Open Graph
        └── proyectos/      # 34 fotografías de obra + miniaturas
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
- **WhatsApp y teléfono:** +57 320 594 0466
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
5. Ejecutar `node tools/build-images.js` y después `node tools/build-i18n.js`.

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
      teléfono baja de 11,1 MB a 4,6 MB (28/07/2026).

Lo que más pesa ahora está **fuera del código**:

- [ ] **Completar la ficha de Google Business Profile** (`kgmid /g/11z74qkm_s`). La ficha
      ya existe, pero le falta contenido: enlazar este sitio como web oficial, publicar
      el horario, subir fotos de obra y listar los servicios. Es el factor con mayor peso
      en el posicionamiento local en Armenia, por encima de cualquier ajuste del sitio.
- [ ] **Pedir reseñas a clientes anteriores.** No se incluyeron testimonios ficticios de
      forma deliberada; el espacio está listo para cuando existan reseñas reales.
- [ ] **Registrar el sitio en Google Search Console** y enviar el `sitemap.xml`. Hoy no
      hay forma de saber si Google indexó el sitio ni con qué consultas aparece.
      Conviene reclamar el dominio propio, no la dirección de `github.io`.

Pendientes de contenido:

- [x] ~~Política de tratamiento de datos~~ (Ley 1581 de 2012) — publicada en los tres
      idiomas, enlazada desde el pie y con casilla de autorización obligatoria en el
      formulario (28/07/2026). **Conviene que la revise un abogado** antes de darla por
      definitiva: el plazo de conservación de dos años es un supuesto razonable, no un
      dato que haya aportado la empresa.
- [x] ~~Páginas propias por servicio~~ — cuatro servicios con página propia en los tres
      idiomas, cada uno con su `Service` y `BreadcrumbList` en los datos estructurados y
      enlazado desde su tarjeta de la portada (28/07/2026). El sitio pasó de 3 a 18 URLs
      indexables. **El texto técnico debería revisarlo el ingeniero** antes de darlo por
      bueno.
- [ ] Páginas para los otros cuatro servicios (mantenimiento de infraestructura,
      estructuras y cimentaciones, urbanismo, consultoría). Se añaden igual que las
      existentes; ver «Añadir una página nueva».
- [ ] Página propia por proyecto, con la galería completa y datos estructurados
      `CreativeWork`. Son nueve obras reales con 41 fotografías ya disponibles.
- [ ] Nombrar las entidades contratantes de la obra pública (alcantarillado y colegios),
      si la empresa autoriza. Da más credibilidad que cualquier texto de marketing.
- [ ] Sumar certificados, RUP o pólizas escaneadas si se quieren mostrar públicamente.
- [x] ~~Añadir Facebook y TikTok~~ al pie y a `sameAs` (28/07/2026). Falta LinkedIn si se abre.

## Autoría

Sitio desarrollado por **Dr. Mauricio Rodríguez Herrera**. Ver [AUTHORS.md](AUTHORS.md).
