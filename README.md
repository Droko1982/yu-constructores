# YU Constructores — sitio web oficial

Sitio web de **YU Construcciones S.A.S.** (NIT 901400072-5), constructora de obra civil e
infraestructura con sede en Armenia, Quindío, Colombia.

🔗 **Sitio publicado:** https://droko1982.github.io/yu-constructores/

---

## Qué incluye

| Área | Detalle |
|---|---|
| **Diseño** | Modo oscuro por defecto + modo claro, paleta tomada del logotipo oficial (ámbar `#f5a302` sobre carbón `#12161a`), tipografía Barlow / Barlow Condensed |
| **Idiomas** | Español (predeterminado), Inglés y Portugués — conmutador en la cabecera, persistencia en `localStorage` y parámetro `?lang=` |
| **Contenido** | Héroe con carrusel de obra real, 8 servicios, 9 proyectos con galería completa (34 fotografías), proceso de 5 etapas, cobertura por municipios, 6 diferenciadores, cotizador rápido, FAQ, contacto |
| **Captación** | Botón flotante de WhatsApp, cotizador que arma el mensaje listo para enviar, formulario de contacto por FormSubmit |
| **SEO** | Datos estructurados `GeneralContractor` + `FAQPage` + `WebSite`, `sitemap.xml` con `hreflang` e imágenes, `robots.txt`, Open Graph, Twitter Cards, metadatos `geo.*`, textos orientados a búsquedas locales del Quindío |
| **Accesibilidad** | Enlace de salto, roles ARIA, navegación por teclado en la galería, `prefers-reduced-motion`, foco visible |
| **Rendimiento** | Sin dependencias JavaScript externas, iconos SVG en línea, imágenes optimizadas (54 MB → 9,5 MB), carga diferida, precarga del héroe |

## Estructura

```
yu-constructores/
├── index.html              # Página única con todo el contenido
├── 404.html                # Página de error
├── robots.txt
├── sitemap.xml
├── site.webmanifest        # PWA / icono en escritorio
├── .nojekyll               # Evita el procesado Jekyll en GitHub Pages
├── AUTHORS.md
└── assets/
    ├── css/styles.css      # Estilos (tokens de tema, componentes, responsive)
    ├── js/i18n.js          # Diccionarios ES · EN · PT
    ├── js/app.js           # Tema, idiomas, carrusel, filtros, galería, cotizador, formulario
    └── img/
        ├── brand/          # Logotipos, héroes, imagen Open Graph
        └── proyectos/      # 34 fotografías de obra + miniaturas
```

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
Buscar la clave y editar el valor en los tres idiomas.

### Agregar un proyecto
1. Guardar las fotos en `assets/img/proyectos/` como `mi-proyecto-1.jpg`, `-2.jpg`… y una
   miniatura `mi-proyecto-thumb.jpg` (900×675).
2. Duplicar un bloque `<button class="project">` en `index.html` y ajustar
   `data-slug`, `data-count`, `data-cat` y `data-key`.
3. Añadir las claves `prj.pN.t`, `prj.pN.l` y `prj.pN.d` en los tres idiomas de `i18n.js`.

### Formulario de contacto
Usa [FormSubmit](https://formsubmit.co) apuntando a `yuconstruccionessas@gmail.com`.
**El primer envío llega como correo de activación**: hay que abrirlo y confirmar el
enlace una sola vez para que los mensajes siguientes lleguen a la bandeja.

## Pendientes sugeridos

- [ ] Confirmar el enlace de activación de FormSubmit desde el correo de la empresa.
- [ ] Conectar un dominio propio (p. ej. `yuconstructores.com`) y actualizar las URL
      absolutas en `index.html`, `sitemap.xml` y `robots.txt`.
- [ ] Registrar el sitio en Google Search Console y enviar el `sitemap.xml`.
- [ ] Reclamar y completar la ficha de Google Business Profile (horarios, fotos, servicios)
      — es el factor con mayor peso en el posicionamiento local en Armenia.
- [ ] Añadir reseñas reales de clientes cuando estén disponibles (no se incluyeron
      testimonios ficticios de forma deliberada).
- [ ] Sumar certificados, RUP o pólizas escaneadas si se quieren mostrar públicamente.

## Autoría

Sitio desarrollado por **Dr. Mauricio Rodríguez Herrera**. Ver [AUTHORS.md](AUTHORS.md).
