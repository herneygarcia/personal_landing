/**
 * verify-v2.js — batería de verificación para el sitio v2/
 *
 * Uso: pegar el contenido completo en la consola de DevTools con la página
 * abierta (o ejecutarlo vía chrome-devtools MCP). Devuelve {page, lang, pass, fails, checks}.
 * Vive fuera de v2/ a propósito: no se publica con el sitio.
 *
 * IMPORTANTE — recargar SIEMPRE ignorando la caché (Cmd+Shift+R) antes de verificar.
 * `python3 -m http.server` no manda cabeceras de no-cache, así que un reload normal
 * puede servir el HTML/JS viejo y dar falsos negativos (o falsos positivos).
 *
 * Límite conocido: el iframe de Cal.com es de otro origen, así que desde JS solo se
 * puede comprobar que EXISTE, no si dentro muestra "Error Code: 404. Cal Link seems
 * to be wrong". Eso hay que mirarlo a ojo o con una captura de pantalla.
 */
(() => {
  const fails = [];
  const checks = [];
  const visible = (el) => getComputedStyle(el).display !== 'none';
  const check = (name, ok, detail) => {
    checks.push({ name, ok, detail: detail || '' });
    if (!ok) fails.push(`${name}${detail ? ': ' + detail : ''}`);
  };

  // 1. Ningún elemento del patrón data-es quedó sin texto
  const empties = [...document.querySelectorAll('[data-es]')]
    .filter(el => !el.textContent.trim())
    .map(el => el.dataset.es);
  check('data-es sin texto', empties.length === 0, empties.join(' | '));

  // 2. Cada par de idioma muestra exactamente un idioma
  const es = [...document.querySelectorAll('.es-only')];
  const en = [...document.querySelectorAll('.en-only')];
  check('pares es/en balanceados', es.length === en.length, `${es.length} es vs ${en.length} en`);
  const esVis = es.filter(visible).length;
  const enVis = en.filter(visible).length;
  const bothHidden = es.length && esVis === 0 && enVis === 0;
  check('un solo idioma visible',
    !bothHidden && (esVis === 0 || enVis === 0),
    `visibles: ${esVis} es / ${enVis} en`);

  // 3. Toggle de idioma coherente
  const lEs = document.querySelector('.lang-es');
  const lEn = document.querySelector('.lang-en');
  check('toggle muestra un solo label',
    !lEs || !lEn || (visible(lEs) !== visible(lEn)),
    lEs && lEn ? `ES:${visible(lEs)} EN:${visible(lEn)}` : 'sin toggle');

  // 4. lang del documento coincide con localStorage
  const stored = localStorage.getItem('lang') || 'es';
  check('html[lang] == localStorage.lang',
    document.documentElement.lang === stored,
    `html=${document.documentElement.lang} storage=${stored}`);

  // 5. Cero WhatsApp
  const html = document.documentElement.outerHTML;
  check('sin enlaces wa.me', !/wa\.me/.test(html));
  check('sin verde de WhatsApp', !/#25d366/i.test(html));

  // 6. Embed de Cal.com montado (solo donde exista el contenedor)
  const cal = document.querySelector('#cal-inline');
  if (cal) check('Cal.com montó un iframe', !!cal.querySelector('iframe'),
    'si falla, el event type sigue en Draft en cal.com');

  // 7. Enlaces internos resuelven (async, se reporta aparte)
  const rel = [...document.querySelectorAll('a[href]')]
    .map(a => a.getAttribute('href'))
    .filter(h => h && !/^(https?:|mailto:|tel:|#)/.test(h));
  const uniq = [...new Set(rel)];

  return Promise.all(uniq.map(h =>
    fetch(h, { method: 'HEAD' }).then(r => ({ h, ok: r.ok })).catch(() => ({ h, ok: false }))
  )).then(results => {
    const broken = results.filter(r => !r.ok).map(r => r.h);
    check('enlaces internos 200', broken.length === 0, broken.join(' | '));
    return {
      page: location.pathname,
      lang: stored,
      pass: fails.length === 0,
      fails,
      checks
    };
  });
})();
