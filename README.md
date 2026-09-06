# Dr. Herney Andrés García-Perdomo — Landing page

Sitio personal bilingüe (español / inglés) del Dr. Herney Andrés García-Perdomo, urólogo oncólogo y epidemiólogo clínico en Cali, Colombia.

Atiende a dos públicos a la vez: **pacientes** que buscan atención en urología oncológica, y **contactos académicos** que buscan publicaciones, métricas de investigación y afiliaciones.

Es un sitio **estático**: HTML, CSS y JavaScript sin frameworks, sin dependencias y sin proceso de compilación. Se puede abrir directamente o servir desde cualquier hosting estático.

---

## Estructura

```
.
├── index.html              # Página principal (hero, pacientes, academia, contacto)
├── consulta-virtual.html   # Agendamiento de consulta virtual (embebe Cal.com)
├── styles.css              # Todos los estilos, variables CSS y breakpoints
├── script.js               # Idioma, scroll suave, animaciones
├── favicon.ico
├── verify-v2.js            # Batería de verificación para consola de DevTools
└── assets/                 # Imágenes: retratos, logo, timeline, figuras de agendar
```

---

## Sistema bilingüe

El idioma se guarda en `localStorage` bajo la clave `lang` (por defecto `'es'`) y se cambia con el botón del navbar. `updateContent()` en `script.js` hace todo el trabajo.

Conviven **dos patrones**, y la diferencia importa:

**1. `data-es` / `data-en`** — usado en `index.html`. El elemento va **vacío** en el HTML y el JavaScript le escribe el `textContent`:

```html
<h2 class="section-title" data-es="Acerca de mí" data-en="About Me"></h2>
```

**2. `.es-only` / `.en-only`** — usado en `consulta-virtual.html`. El texto real está escrito en el HTML y el JavaScript solo alterna la visibilidad:

```html
<h1>
  <span class="es-only">Consulta Virtual Especializada</span>
  <span class="en-only" style="display:none;">Specialized Virtual Consultation</span>
</h1>
```

### ⚠️ Dos reglas que no se pueden romper

Estas dos cosas ya dejaron la página en blanco una vez:

- **No mezcles ambos patrones en una misma página.** Con `data-es`, si el JavaScript falla la página queda literalmente vacía, porque el texto solo existe en un atributo. El patrón de `<span>` sobrevive a un fallo de JS. Una página nueva debería usar el segundo.
- **Nunca declares `langToggle` ni `currentLang` en un `<script>` inline** de una página que además cargue `script.js`. Ambos son scripts clásicos y comparten el ámbito global: el `const` duplicado lanza `SyntaxError` y **`script.js` no se ejecuta en absoluto**, dejando el navbar y el pie de página vacíos.

### Imágenes que cambian de idioma

`updateContent()` también intercambia imágenes:

```html
<!-- imagen distinta por idioma -->
<img data-src-es="assets/cta_es_circle.png" data-src-en="assets/cta_en_circle.png">

<!-- una sola imagen, solo cambia el texto alternativo -->
<img src="assets/cta_icon_circle.png" data-alt-es="Agenda tu cita" data-alt-en="Book your appointment">
```

No pongas `data-es` en un `<a>` que contenga un `<img>`: `updateContent()` reescribe el `textContent` del enlace y **borraría la imagen**.

---

## Diseño

**Paleta** (variables en `:root` de `styles.css`):

| Variable | Valor | Uso |
|---|---|---|
| `--color-navy` | `#1a4d5c` | Color principal |
| `--color-teal` | `#2a7f8f` | Acentos e interacción |
| `--color-cream` | `#f5f2ed` | Fondo |
| `--color-orange` | `#c4773f` | Destacados |
| `--color-mustard` | `#e8b04b` | Etiquetas |

**Tipografías** (Google Fonts): **Fraunces** para títulos, incluida la itálica 700 para las frases destacadas; **Inter** para el cuerpo.

**Espaciado**: escala de `--spacing-xs` (0.5rem) a `--spacing-4xl` (6rem).

**Breakpoints**: 1100px (ajuste del navbar), 768px (se oculta el menú), 480px (se oculta el texto del logo).

---

## Consulta virtual

`consulta-virtual.html` embebe el agendamiento de Cal.com en un `<iframe>`:

```
https://cal.com/herneygarcia/consulta-virtual
```

Configurado en Cal.com: 20 minutos, Cal Video (videollamada automática), zona horaria America/Bogotá, viernes de 2:00 a 4:00 p.m. en cupos de 20 minutos.

**El cobro no es automático.** Bre-B no tiene enlace ni esquema de URL que un botón web pueda abrir, y el sitio no tiene backend que pueda confirmar un pago. Hoy el paciente reserva su cupo, transfiere **$350.000** por Bre-B a la llave **`@HGP166`** y envía el comprobante por correo antes de la consulta.

Si en algún momento se quiere cobro automático que bloquee la reserva hasta pagar, la vía es instalar la app de **PayPal** en Cal.com y activarla en el Event Type. Stripe no sirve: no opera en Colombia.

---

## Desarrollo

Servir en local desde la raíz del proyecto:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

### Verificación

`verify-v2.js` es una batería de aserciones para pegar en la consola de DevTools. Devuelve `{pass, fails}` y comprueba errores de consola, textos vacíos, coherencia del idioma, enlaces internos y ausencia de enlaces de WhatsApp.

> **Recarga siempre ignorando la caché** (`Cmd+Shift+R`). `python3 -m http.server` no envía cabeceras de no-cache, así que una recarga normal puede servir el HTML o el CSS viejos y dar resultados falsos — tanto positivos como negativos.

---

## Despliegue

Cualquier hosting estático sirve. Para **GitHub Pages**: Settings → Pages → Source: `Deploy from a branch` → rama `main`, carpeta `/ (root)`. El sitio queda en `https://herneygarcia.github.io/personal_landing/`.

Para un dominio propio, añadir un archivo `CNAME` con el dominio y apuntar el DNS a GitHub Pages.

---

## Contacto

Todo el contacto del sitio es por correo electrónico (`mailto:`); no hay enlaces de WhatsApp.

- herney.garcia@correounivalle.edu.co
- herneygarcia@me.com
- ORCID: [0000-0001-6945-8261](https://orcid.org/0000-0001-6945-8261)
