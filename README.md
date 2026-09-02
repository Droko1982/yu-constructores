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
| **Accesibilidad** | Enlace de salto, roles ARIA, navegación por teclado en la galería, `prefers-reduced-motion`, foco visible, respaldo en `<noscript>` para el contenido animado, HTML validado. **Contraste AA en los dos temas**: el ámbar de la marca se reserva para rellenos, bordes, iconos y el titular del héroe —todos sobre fondo oscuro—, y el texto sobre el fondo de la página usa `--brand-ink`, que en modo claro baja a `#8a5a00` |
| **Rendimiento** | **Cero dependencias externas**: tipografías auto-alojadas (sin Google Fonts), iconos SVG en línea, carga diferida, precarga del héroe y de las dos fuentes críticas. Imágenes responsivas en WebP con respaldo JPEG (un teléfono baja 2,0 MB en lugar de 11,1 MB) y diccionario servido por idioma (20 KB en lugar de 58 KB). **Ningún marco externo se carga solo**: el mapa de Google espera a que alguien lo pida |

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
│   ├── build-images.js     # Genera las .webp por anchura y la imagen social .jpg
│   ├── i18n.js             # FUENTE: diccionarios ES · EN · PT (314 claves por idioma)
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
enlaces rotos, `data-page` sin resolver, anclas sin destino —también las que apuntan
dentro de la propia página—, marcado mal anidado, títulos o descripciones duplicados o
demasiado largos, imágenes sin `alt`, `hreflang` que no se autorreferencia, JSON-LD
inválido o con `@id` que apuntan a un nodo definido en otra página, enlaces de WhatsApp
publicados sin mensaje, `og:image` inexistente o tan pesada que WhatsApp deje de dibujar
la vista previa, el `404.html` con sus rutas absolutas y su `noindex`, y el
`sitemap.xml` contrastado con el disco en los dos sentidos.

Y tres cosas que ya se rompieron una vez: **que exista un único número de contacto en todo
el sitio**, **que el menú móvil no vuelva a quedar dentro de `<header>`** y **que ningún
`aria-label` esté escrito a mano** (uno escrito a mano se queda en español en `/en/` y
`/pt/`).

El control del teléfono existe por un motivo concreto: un teléfono desactualizado en una sola
página perdida es un cliente perdido, y es el tipo de error que no da la cara al revisar
a ojo.

### Imágenes

Cada `.jpg` tiene versiones `.webp` en varias anchuras, que el HTML ofrece dentro de
`<picture>` con el `.jpg` como respaldo. El héroe es lo que Google mide como LCP: a
1920 px pesa 439 KB y a 768 px, 82 KB, así que un teléfono ya no descarga la versión
de escritorio.

De la primera fotografía de cada obra se genera además una **variante social**
(`-1-og.jpg`, 1200 px), que es la que viaja en `og:image` cuando alguien reenvía el
enlace de esa obra o del servicio que la usa de referencia. La original llega a 640 KB y
WhatsApp deja de dibujar la vista previa por encima de unos 600 KB. Si falta, el generador
se niega a compilar y dice qué comando la produce.

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

## Repaso de rendimiento, contraste y captación · 2 de septiembre de 2026

Con el menú ya arreglado se recorrió el sitio buscando lo que **cuesta sin verse**: peso
que el visitante descarga sin haberlo pedido, texto que no se puede leer, tarjetas que no
llevan a ninguna parte y envíos que se quedan colgados. Lo que salió se agrupa en cinco
frentes, y todo ello estaba publicado **en silencio**: ninguna de estas cosas da la cara
al revisar el sitio a ojo.

### 1. El mapa dejó de cargarse solo

El recuadro de Google Maps de la sección de cobertura era el marco más pesado de la
portada y salía en **cada visita**, lo pidiera alguien o no. Además contradecía en la
práctica lo que promete la política de datos: el navegador del visitante contactaba con
Google antes de que hiciera nada.

En su lugar hay ahora una tarjeta con la dirección y un botón; `app.js` la sustituye por
el `<iframe>` al pulsarlo. **No queda ningún marco externo que se cargue solo en ninguna
de las 54 páginas.** La política de datos declara Google Maps en su apartado 4, diciendo
expresamente que solo interviene si el visitante pide el mapa, y qué recibe Google cuando
lo pide.

### 2. El ámbar de la marca no vale para texto

`#f5a302` sobre blanco da **2,07:1**. El mínimo de la WCAG para texto es 4,5:1, así que en
modo claro cada epígrafe, enlace de tarjeta, ubicación de obra y cifra en ámbar estaba por
debajo. El ámbar no se cambió: se separó en dos tokens.

| Token | Oscuro | Claro | Para qué |
|---|---|---|---|
| `--brand` | `#f5a302` | `#f5a302` | Rellenos, bordes, iconos y el titular del héroe: todo sobre fondo oscuro en los dos temas |
| `--brand-ink` | `#f5a302` | `#8a5a00` — 5,9:1 sobre blanco | Todo lo que sea **texto sobre el fondo de la página** |

Al revisarlo aparecieron tres cosas más:

- **El botón de WhatsApp de las 48 páginas secundarias tenía el texto invisible**, en los
  dos temas: `.legal a` le ganaba en especificidad a `.btn--brand` y le pintaba el texto
  ámbar sobre fondo ámbar. Ahora es `.legal a:not(.btn)`, el mismo patrón que ya había
  hecho falta en `.mobile-nav`.
- **`outline: none` en el foco de los campos del formulario.** El halo de sombra que lo
  sustituía no lo dibujan los modos de alto contraste: quien navega con el tabulador se
  quedaba sin saber dónde estaba.
- **Al imprimir desde el modo oscuro**, el teléfono, el correo y la dirección salían en
  blanco sobre blanco: los navegadores no imprimen fondos, pero sí respetan el color del
  texto.

### 3. Peso que nadie había pedido

| | Antes | Después |
|---|---|---|
| Miniaturas del visor, obra de 6 fotos | 900 KB | 284 KB |
| Imagen social de una obra | hasta 640 KB | 220 KB como máximo |
| Segunda y tercera foto del héroe | a los 4 s de reloj | cuando el navegador queda ocioso |
| Cabecera en teléfono | `backdrop-filter` en cada fotograma del desplazamiento | fondo opaco |

- **Las miniaturas del visor se pedían a 1280 px** para pintarlas a 74. Ahora se piden a
  640: en el conjunto de las nueve obras son 2,7 MB que dejan de bajarse.
- **La imagen social se genera aparte** (`-1-og.jpg`, 1200 px). WhatsApp —por donde entra
  el trabajo— deja de dibujar la vista previa por encima de unos 600 KB, y la primera
  fotografía de los taludes del Matecaña pesa justo 640 KB. El comprobador avisa a partir
  de 300 KB y falla a partir de 500.
- **El carrusel arrancaba a los 4 s exactos**, que caen dentro de la ventana del LCP:
  ponía a bajar la segunda fotografía mientras el teléfono aún estaba pintando la primera.
  Ahora espera al `load` y a que el navegador quede ocioso, y **con ahorro de datos o red
  2G no arranca solo**; los puntos siguen ahí para pasarlas a mano.

### 4. El formulario ya no pierde solicitudes

- **No tenía límite de tiempo**: una conexión mala dejaba el botón en «Enviando…» para
  siempre, sin error y sin número de rescate. Ahora corta a los 12 s.
- **Si el envío falla, el error trae un enlace de WhatsApp con lo que la persona acababa
  de escribir**, en vez de pedirle que lo repita. Se arma con `createElement` y
  `textContent`, nunca con `innerHTML`: el contenido es del visitante.
- **Campo señuelo** oculto contra el relleno automático.
- **El asunto del correo dice de quién es y en qué idioma escribió**, y el cuerpo añade la
  página de origen. Con veinte correos idénticos en la bandeja no se sabía cuál atender
  primero ni de dónde había salido.
- **El cotizador ya no llega precontestado.** «Obra nueva · Solo tengo la idea · Lo antes
  posible» venían marcados de fábrica, así que el mensaje podía afirmar tres cosas que el
  visitante no había elegido nunca.

### 5. Tarjetas y enlaces que no llevaban a ninguna parte

- Los cuatro servicios sin página propia —mantenimiento, estructuras, urbanismo y
  consultoría— eran tarjetas **sin ninguna acción**. Ahora cada una abre WhatsApp con su
  propio mensaje.
- Cuatro enlaces del pie apuntaban a `#servicios` teniendo la página del servicio hecha.
- **El mensaje de WhatsApp dice ahora de dónde sale**: `wa.servicio` y `wa.obra` llevan
  `{servicio}` y `{obra}`, que el generador sustituye por el nombre traducido de esa
  página. Una sola clave sirve para las seis páginas de servicio y las nueve de obra.

### Lo que se endureció para que no vuelva a pasar

- El reescritor de enlaces de WhatsApp exigía que `data-wa` fuera pegado al `href` y en
  ese orden: bastaba un `class=` en medio para publicar un enlace **sin mensaje**, y sin
  aviso. Ahora localiza la etiqueta entera.
- Las tarjetas de obra se leían con una expresión que exigía los tres atributos en orden y
  no admitía una décima obra. Ahora se leen de una en una y la compilación falla si a
  alguna le falta un atributo.
- El visor se recortaba de las páginas secundarias con una expresión frágil; ahora va
  entre marcadores `<!-- visor -->` y la compilación falla si no están.
- **Cada página secundaria arrastraba `@id` que solo existían en la portada**: el
  `Service` de cada servicio se quedaba sin prestador y cada obra sin autor, con toda la
  señal de negocio local concentrada en tres páginas. Ahora las 48 llevan su propio nodo
  de organización y de sitio, derivado del JSON-LD de `index.html` para que el NAP siga
  teniendo una sola fuente.
- **Si `app.js` no llegaba a descargarse, las páginas de servicio y de obra salían en
  blanco**: todo su contenido vive dentro de `.reveal`, que nace invisible. El `<noscript>`
  cubría el JavaScript desactivado, no el guion que no llega. Ahora una animación de CSS
  lo destapa a los 4 s pase lo que pase.

## La medición

**Está activa** desde el 1 de septiembre de 2026, con **Cloudflare Web Analytics**. Se
eligió porque no pone cookies, no recoge datos personales y no necesita banner de
consentimiento; el apartado 2 de la política de datos la describe tal cual. Google
Analytics obligaría a contradecir esa política, que promete justamente lo contrario.

El token vive en la constante `ANALYTICS_TOKEN` de `tools/build-i18n.js` y admite la
variable de entorno `YU_ANALYTICS`. **Sin token no se emite ninguna etiqueta**, así que
dejarla vacía apaga la medición del todo:

```bash
YU_ANALYTICS= node tools/build-i18n.js     # regenera el sitio sin analítica
```

Para medir otro dominio: en [dash.cloudflare.com](https://dash.cloudflare.com) →
**Web Analytics** → añadir el dominio (no hace falta mover el DNS), copiar el `token` del
fragmento que entrega y ponerlo en la constante. Si algún día se cambia de herramienta,
hay que corregir el apartado 2 de los tres archivos `tools/pages/privacidad.*.html`.

`assets/js/app.js` registra además los sucesos que valen dinero —clic en WhatsApp
distinguiendo el origen, llamada, correo, apertura del mapa y envío del formulario,
correcto o fallido—. La función `track()` no hace nada si no hay analítica cargada, así
que ni la medición ni un bloqueador pueden romper una conversión.

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
- [x] ~~Repaso de rendimiento, contraste y captación~~ — el mapa dejó de cargarse solo,
      contraste AA en modo claro, 2,7 MB menos en las miniaturas del visor, el formulario
      con corte de tiempo y rescate por WhatsApp, y los datos estructurados de las 48
      páginas secundarias sostenidos por sí solos (02/09/2026). Ver la sección «Repaso de
      rendimiento, contraste y captación».

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
      existentes; ver «Añadir una página nueva». Mientras tanto, sus tarjetas ya abren
      WhatsApp con un mensaje propio en lugar de no llevar a ninguna parte (02/09/2026).
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
