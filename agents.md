# Dr. Herney García-Perdomo — Landing page & portafolio

## Qué es este proyecto

Sitio personal bilingüe (ES/EN) del Dr. Herney Andrés García-Perdomo, urólogo oncólogo y epidemiólogo clínico en Cali, Colombia. Sirve a dos públicos simultáneos:

1. **Pacientes** que buscan atención en urología oncológica — énfasis en confianza, credenciales y facilidad para agendar.
2. **Contactos académicos** que buscan publicaciones, métricas de investigación, afiliaciones y colaboración.

Sitio **estático**: HTML/CSS/JS vanilla, sin frameworks, sin dependencias, sin build. Se despliega tal cual.

Repositorio: `herneygarcia/personal_landing` (público).

## Estructura

```
.
├── index.html              # Página principal
├── consulta-virtual.html   # Agendamiento (embebe Cal.com)
├── styles.css              # Estilos, variables CSS, breakpoints
├── script.js               # Idioma, scroll suave, animaciones
├── favicon.ico
├── verify-v2.js            # Batería de verificación (no se carga en el sitio)
├── README.md
└── assets/
```

Fuera del repo pero presentes en local (ver `.gitignore`): el CV en `.docx`, notas `.rtf` y los scripts `make_cta.py`, `make_pay.py`, `make_timeline.py` que generaron las imágenes de `assets/`.

> Hubo una v1 en la raíz y una v2 en `v2/`. La v2 se promovió a la raíz y la v1 se eliminó. **Ya no existe ninguna carpeta `v2/`**: si una instrucción antigua menciona `v2/algo.html`, hoy es `algo.html`.

## Sistema bilingüe — leer antes de tocar nada

Idioma en `localStorage` bajo `lang` (por defecto `'es'`). `updateContent()` en `script.js` hace el cambio.

Conviven **dos patrones**:

1. **`data-es` / `data-en`** (`index.html`): el elemento va **vacío**, el JS escribe `textContent`.
   ```html
   <h2 data-es="Acerca de mí" data-en="About Me"></h2>
   ```
2. **`.es-only` / `.en-only`** (`consulta-virtual.html`): el texto real está en el HTML, el JS solo alterna `display`.
   ```html
   <span class="es-only">Texto</span><span class="en-only" style="display:none;">Text</span>
   ```

### Reglas que ya se rompieron una vez

- **No mezclar los dos patrones en una misma página.** Con `data-es`, si el JS falla la página queda en blanco porque el texto solo vive en un atributo. Para páginas nuevas, usar el patrón de `<span>`.
- **Nunca declarar `langToggle` ni `currentLang` en un `<script>` inline** en una página que también carga `script.js`. Son scripts clásicos con ámbito global compartido: el `const` duplicado lanza `SyntaxError` y **`script.js` no se ejecuta**, dejando navbar y footer vacíos.
- **No poner `data-es` en un `<a>` que contenga un `<img>`**: `updateContent()` reescribe el `textContent` del enlace y borra la imagen.
- `script.js` es **null-safe**: tiene guardas en `langToggle`, `navbar`, `btnPatients`, `btnAcademia` y `.lang-es`/`.lang-en`, y solo intercepta enlaces que empiezan por `#`. Cualquier página puede cargarlo. **Mantener esas guardas.**

### Imágenes bilingües

`updateContent()` tiene dos barridos independientes:

- `[data-src-es]` / `[data-src-en]` → cambia el `src` (ej. `timeline_es.png` ↔ `timeline_en.png`, `cta_es_circle.png` ↔ `cta_en_circle.png`).
- `[data-alt-es]` / `[data-alt-en]` → cambia solo el `alt`, para imágenes sin texto usadas en ambos idiomas (ej. `cta_icon_circle.png` del navbar).

## Diseño

**Paleta** (`:root` en `styles.css`): `--color-navy` `#1a4d5c` · `--color-teal` `#2a7f8f` · `--color-cream` `#f5f2ed` · `--color-orange` `#c4773f` · `--color-mustard` `#e8b04b`.

**Tipografía**: Fraunces (títulos; la itálica 700 se usa en las frases destacadas) + Inter (cuerpo). Ambas de Google Fonts.

**Espaciado**: `--spacing-xs` (0.5rem) → `--spacing-4xl` (6rem).

**Breakpoints**: 1100px (gaps del navbar), 768px (se oculta `.navbar-menu`), 480px (se oculta `.logo-text`).

**Navbar**: es un pill `position: fixed`. Cualquier página nueva necesita `padding-top` suficiente en su primera sección para no quedar tapada (`index.html` usa `margin-top` en `.hero`; `consulta-virtual.html` usa 160px en desktop y 175px en móvil). Sus gaps son ajustados a propósito: subirlos hace que el CTA se salga del pill.

## Contacto y pago

**Todo el contacto es por `mailto:`. No queda ningún enlace `wa.me` y no deben reintroducirse.** El botón flotante conserva la clase histórica `.floating-whatsapp` pero es un enlace de correo con los colores navy/teal de la marca.

`consulta-virtual.html` embebe `https://cal.com/herneygarcia/consulta-virtual` en un `<iframe>` (20 min, Cal Video, viernes 2–4 p.m. en cupos de 20 min).

**El pago no es automático**: Bre-B no tiene deep link y el sitio no tiene backend. El paciente reserva, transfiere **$350.000** a la llave **`@HGP166`** y envía el comprobante por correo. Para cobro automático la única vía dentro de Cal.com es la app de **PayPal** — Stripe no opera en Colombia.

## Verificación — obligatoria antes de dar algo por bueno

Servidor local: `python3 -m http.server 8000` desde la raíz.

> **Recargar SIEMPRE ignorando la caché.** `python3 -m http.server` no manda cabeceras de no-cache; una recarga normal sirve HTML/CSS viejos. Esto ya produjo varios diagnósticos falsos, en ambos sentidos.

`verify-v2.js` se pega en la consola de DevTools y devuelve `{pass, fails}`. Comprueba:

1. Cero errores de consola y cero recursos con estado ≥ 400.
2. Ningún `[data-es]` con `textContent` vacío.
3. Por cada par `.es-only`/`.en-only`, exactamente uno visible.
4. Coherencia del toggle y `document.documentElement.lang === localStorage.lang`.
5. Cero `wa.me` y cero `#25d366` en el DOM.
6. Enlaces internos que responden 200.

Además, a mano: probar el toggle ida y vuelta en ambas páginas, verificar que las imágenes bilingües cambian de `src`, y revisar 375 / 768 / 1280 px sin desbordamiento horizontal. Ojo: varias imágenes son `loading="lazy"` — hay que recorrer la página antes de afirmar que no cargan.

## Despliegue

GitHub Pages: Settings → Pages → rama `main`, carpeta `/ (root)`. Queda en `https://herneygarcia.github.io/personal_landing/`.

## Pendientes conocidos

- Las imágenes `assets/pay_*.png` ("Pague aquí", generadas por `make_pay.py`) **no se usan** en ninguna página.
- Está sin construir el bloque de pago con la llave Bre-B y el QR dentro de `consulta-virtual.html`; hoy el dato solo aparece en el paso 2 de "Cómo Funciona".
- El subtítulo de `consulta-virtual.html` todavía promete "Pago seguro en línea", que no corresponde al flujo real.
