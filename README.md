# YU Constructores — sitio web oficial

Sitio web de **YU Construcciones S.A.S.** (NIT 901400072-5), constructora de obra civil e
infraestructura con sede en Armenia, Quindío, Colombia.

🔗 **Sitio publicado:** https://droko1982.github.io/yu-constructores/

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
| **Rendimiento** | **Cero dependencias externas**: tipografías auto-alojadas (sin Google Fonts), iconos SVG en línea, imágenes optimizadas (54 MB → 9,5 MB), carga diferida, precarga del héroe y de las dos fuentes críticas |

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
├── tools/
│   └── build-i18n.js       # Genera en/ y pt/ a partir de index.html + i18n.js
└── assets/
    ├── css/fonts.css       # @font-face de las tipografías auto-alojadas
    ├── css/styles.css      # Estilos (tokens de tema, componentes, responsive)
    ├── fonts/              # Barlow y Barlow Condensed (woff2, subconjuntos latin)
    ├── js/i18n.js          # Diccionarios ES · EN · PT (247 claves por idioma)
    ├── js/app.js           # Tema, carrusel, filtros, galería, cotizador, formulario
    └── img/
        ├── brand/          # Logotipos, héroes, imagen Open Graph
        └── proyectos/      # 34 fotografías de obra + miniaturas
```

> **Importante:** `en/index.html` y `pt/index.html` se generan. Después de tocar
> `index.html` o `assets/js/i18n.js` hay que ejecutar:
>
> ```bash
> node tools/build-i18n.js
> ```
>
> El generador falla en voz alta si falta una clave en algún idioma, así que sirve
> también como validación.

## Datos de la empresa usados en el sitio

- **Razón social:** YU Construcciones S.A.S.
- **NIT:** 901400072-5
- **Dirección:** Calle 20 #12-32, piso 1, Sector Centro — Armenia, Quindío
- **WhatsApp / teléfono:** +57 304 655 7120
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
Todos los textos visibles viven en `assets/js/i18n.js`, en tres bloques (`es`, `en`, `pt`).
Buscar la clave, editar el valor en los tres idiomas y volver a generar:
`node tools/build-i18n.js`.

### Agregar un proyecto
1. Guardar las fotos en `assets/img/proyectos/` como `mi-proyecto-1.jpg`, `-2.jpg`… y una
   miniatura `mi-proyecto-thumb.jpg` (900×675).
2. Duplicar un bloque `<article class="project">` en `index.html` y ajustar
   `data-slug`, `data-count`, `data-cat` y `data-key`.
3. Añadir las claves `prj.pN.t`, `prj.pN.l`, `prj.pN.d` y `prj.pN.alt` en los tres idiomas.
4. Ejecutar `node tools/build-i18n.js` y añadir la foto al `sitemap.xml`.

### Formulario de contacto
Usa [FormSubmit](https://formsubmit.co) apuntando a `yuconstruccionessas@gmail.com`.
**El primer envío llega como correo de activación**: hay que abrirlo y confirmar el
enlace una sola vez para que los mensajes siguientes lleguen a la bandeja.

## Pendientes sugeridos

- [ ] Confirmar el enlace de activación de FormSubmit desde el correo de la empresa.
- [ ] Conectar un dominio propio (p. ej. `yuconstructores.com`) y actualizar la
      constante `BASE` en `tools/build-i18n.js`, más `sitemap.xml` y `robots.txt`.
      Un dominio propio sube bastante el techo de posicionamiento frente a `github.io`.
- [ ] Registrar el sitio en Google Search Console y enviar el `sitemap.xml`.
- [ ] Reclamar y completar la ficha de Google Business Profile (horarios, fotos, servicios)
      — es el factor con mayor peso en el posicionamiento local en Armenia.
- [ ] Añadir reseñas reales de clientes cuando estén disponibles (no se incluyeron
      testimonios ficticios de forma deliberada).
- [ ] Sumar certificados, RUP o pólizas escaneadas si se quieren mostrar públicamente.

## Autoría

Sitio desarrollado por **Dr. Mauricio Rodríguez Herrera**. Ver [AUTHORS.md](AUTHORS.md).
