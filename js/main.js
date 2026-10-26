/* Bien être café · demo — intro, hero con la onda del logo, pasaje, carta, agenda, galería. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var html = document.documentElement;
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var esDesk = function () { return window.innerWidth >= 1100; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ================= fecha y horario en Buenos Aires ================= */
  var DIAS = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  var NOMBRES = { dom: 'domingo', lun: 'lunes', mar: 'martes', mie: 'miércoles', jue: 'jueves', vie: 'viernes', sab: 'sábado' };
  var EFECTIVO = { porDia: { mar: 20, mie: 20, jue: 20, vie: 20, sab: 15, dom: 15 }, feriado: 15, feriados: [] };
  var ABRE = 8 * 60, CIERRA = 21 * 60;
  function ahora() {
    var p = {};
    new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var fecha = p.year + '-' + p.month + '-' + p.day;
    var d = new Date(Date.UTC(+p.year, +p.month - 1, +p.day)).getUTCDay();
    return { fecha: fecha, dia: DIAS[d], diaN: d, min: (+p.hour % 24) * 60 + +p.minute };
  }
  function pctDe(dia, fecha) {
    if ((EFECTIVO.feriados || []).indexOf(fecha) >= 0) return EFECTIVO.feriado || 0;
    return (EFECTIVO.porDia || {})[dia] || 0;
  }
  var HOY = ahora();
  function textos() {
    HOY = ahora();
    var pct = pctDe(HOY.dia, HOY.fecha);
    var feriado = (EFECTIVO.feriados || []).indexOf(HOY.fecha) >= 0;
    var manana = DIAS[(HOY.diaN + 1) % 7];
    var chip, carta, est, estS, largo, cerrado = false;
    if (HOY.dia === 'lun') {
      chip = 'Hoy cerrado · mañana ' + pctDe('mar', '') + '% off en efectivo';
      carta = 'Mañana martes: ' + pctDe('mar', '') + '% off pagando en efectivo.';
    } else {
      chip = 'Hoy ' + (feriado ? 'feriado' : NOMBRES[HOY.dia]) + ': ' + pct + '% off en efectivo';
      carta = 'Hoy ' + (feriado ? 'feriado' : NOMBRES[HOY.dia]) + ', ' + pct + '% off pagando en efectivo al retirar.';
    }
    if (HOY.dia === 'lun') { est = 'Hoy descansamos'; estS = 'Abrimos mañana a las 8'; cerrado = true; }
    else if (HOY.min < ABRE) { est = 'Abrimos hoy a las 8'; estS = 'Hasta las 21'; cerrado = true; }
    else if (HOY.min >= CIERRA) { est = 'Ya cerramos por hoy'; estS = manana === 'lun' ? 'Volvemos el martes a las 8' : 'Abrimos mañana a las 8'; cerrado = true; }
    else { est = 'Abierto ahora'; estS = 'Cerramos a las 21'; }
    largo = cerrado ? est + ' · ' + estS.charAt(0).toLowerCase() + estS.slice(1) : 'Abierto ahora · cerramos a las 21';
    return { pct: HOY.dia === 'lun' ? 0 : pct, chip: chip, carta: carta, est: est, estS: estS, largo: largo, cerrado: cerrado };
  }
  function pintarTextos() {
    var t = textos();
    $$('[data-efectivo-txt]').forEach(function (e) { e.textContent = t.chip; });
    $$('[data-efectivo-carta]').forEach(function (e) { e.textContent = t.carta; });
    var et = $('[data-estado-t]'), es = $('[data-estado-s]');
    if (et) et.textContent = t.est; if (es) es.textContent = t.estS;
    var l = $('[data-estado-largo]'); if (l) { l.textContent = t.largo; l.classList.toggle('is-cerrado', t.cerrado); }
    return t;
  }
  var T = pintarTextos();

  /* ================= intro ================= */
  var intro = $('#intro'), hero = $('.hero'), hdr = $('#hdr');
  function entrarHero() {
    var d = 0;
    [$('.hero__chip'), $('.hero__eyebrow')].forEach(function (e) { if (e) e.style.setProperty('--d', d++); });
    $$('.hero__t .lin > span').forEach(function (e) { e.style.setProperty('--d', d++); });
    [$('.hero__p'), $('.hero__btns'), $('.hero__datos'), $('.hero__estado')].forEach(function (e) { if (e) e.style.setProperty('--d', d++); });
    hero.classList.add('is-in'); hdr.classList.add('is-in');
  }
  function arrancarIntro() {
    if (!html.classList.contains('con-intro') || !intro) { entrarHero(); html.classList.add('intro-listo'); return; }
    var movil = window.innerWidth < 768;
    var tTrazo = movil ? 750 : 1050, tWord = movil ? 420 : 650, tAbre = movil ? 600 : 800;
    var minAbre = movil ? 1050 : 1550, maxAbre = 2600;
    intro.style.setProperty('--t-trazo', tTrazo + 'ms');
    intro.style.setProperty('--t-word', tWord + 'ms');
    intro.style.setProperty('--t-abre', tAbre + 'ms');
    $$('.intro__word span').forEach(function (s, i) { s.style.setProperty('--i', i); });
    html.classList.add('intro-lock');
    var t0 = performance.now();
    requestAnimationFrame(function () { intro.classList.add('is-dibujo'); });
    var img = $('#heroImg');
    var listoImg = new Promise(function (r) { if (!img || (img.complete && img.naturalWidth)) r(); else { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); } });
    var listoFuentes = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    var tope = new Promise(function (r) { setTimeout(r, maxAbre); });
    Promise.race([Promise.all([listoImg, listoFuentes]), tope]).then(function () {
      var falta = Math.max(0, minAbre - (performance.now() - t0));
      setTimeout(abrir, falta);
    });
    var abierto = false;
    function abrir() {
      if (abierto) return; abierto = true;
      intro.classList.add('is-abre');
      setTimeout(entrarHero, tAbre * .45);
      setTimeout(function () { intro.classList.add('is-fin'); html.classList.remove('intro-lock'); html.classList.add('intro-listo'); }, tAbre + 60);
    }
    setTimeout(abrir, 4200); // seguro
  }
  arrancarIntro();

  /* ================= hero: la onda del logo en tiempo real ================= */
  var svg = $('#heroOnda'), fillP = svg && svg.querySelector('.hero__onda-fill'), lineP = svg && svg.querySelector('.hero__onda-linea');
  var fotoBox = $('.hero__foto');
  var SIGNOS = [1, -1, 1, 1]; // ∩ ∪ ∩ ∩, como el logo
  var W = 0, A = 0, B = 0, H = 0, corriendo = false, visible = true, boost = [0, 0, 0, 0], boostT = [0, 0, 0, 0], factorScroll = 1, punteroX = -1;
  function medir() {
    if (!fotoBox) return;
    W = fotoBox.clientWidth;
    var hw = W / 4;
    A = Math.min(hw * .44, 96);
    B = Math.round(A + 12);
    H = Math.ceil(B + A * 1.35 + 10);
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.style.height = H + 'px';
    dibujar(performance.now());
  }
  function curva(t) {
    var hw = W / 4, xs = [0], s = '';
    for (var k = 1; k < 4; k++) xs.push(hw * k + hw * .07 * Math.sin(t * .00042 + k * 2.1));
    xs.push(W);
    var amps = [];
    for (var i = 0; i < 4; i++) {
      var vari = 1 + .13 * Math.sin(t * .00055 + i * 1.7) + .05 * Math.sin(t * .0013 + i * 2.9);
      amps.push(A * SIGNOS[i] * vari * factorScroll * (1 + boost[i]));
    }
    for (var j = 3; j >= 0; j--) {
      var a = amps[j] * 1.33, x1 = xs[j + 1], x0 = xs[j];
      s += ' C' + x1.toFixed(1) + ' ' + (B - a).toFixed(1) + ' ' + x0.toFixed(1) + ' ' + (B - a).toFixed(1) + ' ' + x0.toFixed(1) + ' ' + B;
    }
    return s;
  }
  function dibujar(t) {
    if (!W) return;
    var c = curva(REDUCE ? 0 : t);
    fillP.setAttribute('d', 'M-2 -2 H' + (W + 2) + ' V' + B + ' L' + W + ' ' + B + c + ' L-2 ' + B + ' Z');
    lineP.setAttribute('d', 'M' + W + ' ' + B + c);
  }
  function loop(t) {
    if (!visible || document.hidden) { corriendo = false; return; }
    for (var i = 0; i < 4; i++) boost[i] += (boostT[i] - boost[i]) * .06;
    dibujar(t);
    requestAnimationFrame(loop);
  }
  function arrancarLoop() { if (REDUCE || corriendo) return; corriendo = true; requestAnimationFrame(loop); }
  if (svg) {
    medir();
    if ('ResizeObserver' in window) new ResizeObserver(medir).observe(fotoBox); else window.addEventListener('resize', medir);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) arrancarLoop(); }).observe(hero);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) arrancarLoop(); });
    arrancarLoop();
    if (HOVER) {
      hero.addEventListener('pointermove', function (e) {
        var r = fotoBox.getBoundingClientRect(); punteroX = e.clientX - r.left;
        for (var i = 0; i < 4; i++) boostT[i] = (punteroX >= W * i / 4 && punteroX < W * (i + 1) / 4 && e.clientY < r.top + H * 1.4 && e.clientY > r.top - 40) ? .16 : 0;
      }, { passive: true });
      hero.addEventListener('pointerleave', function () { boostT = [0, 0, 0, 0]; });
    }
  }

  /* ================= header / scroll ================= */
  var pasaje = $('#pasaje'), pasajeImgs = $$('.pasaje__img'), pasajePasos = $$('.pasaje__pasos li'), pasajeArco = $('.pasaje__arco'), pasajeBarra = $('.pasaje__barra'), pasoActual = 0;
  var tick = false;
  function onScroll() {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      tick = false;
      var y = window.scrollY, vh = window.innerHeight;
      hdr.classList.toggle('is-sombra', y > 8);
      if (hero) html.classList.toggle('en-hero', y < hero.offsetHeight * .55);
      if (hero) factorScroll = 1 - .35 * Math.min(1, Math.max(0, y / (hero.offsetHeight * .8)));
      if (REDUCE && svg) dibujar(0);
      if (pasaje) {
        var top = pasaje.offsetTop, alto = pasaje.offsetHeight - vh;
        var p = Math.min(1, Math.max(0, (y - top) / alto));
        var paso = p < .34 ? 0 : p < .67 ? 1 : 2;
        if (paso !== pasoActual) {
          pasoActual = paso;
          pasajeImgs.forEach(function (im, i) { im.classList.toggle('is-on', i === paso); });
          pasajePasos.forEach(function (li, i) { li.classList.toggle('is-on', i === paso); });
        }
        if (pasajeArco && !REDUCE) pasajeArco.style.setProperty('--s', (.86 + .14 * p).toFixed(3));
        if (pasajeBarra) pasajeBarra.style.setProperty('--p', p.toFixed(3));
      }
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // las fotos del pasaje: se cargan todas cuando el pasaje se acerca
  if (pasaje && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { pasajeImgs.forEach(function (i) { i.loading = 'eager'; }); o.disconnect(); } }, { rootMargin: '600px' }).observe(pasaje);
  }

  // link activo en la barra
  var navLinks = $$('.hdr__nav a');
  if ('IntersectionObserver' in window) {
    var secs = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { io.observe(s); });
  }

  /* ================= menú celu ================= */
  var menu = $('#menu'), btnMenu = $('.hdr__menu'), scrollGuardado = 0;
  function bloquear(on) {
    if (on) { scrollGuardado = window.scrollY; document.body.style.position = 'fixed'; document.body.style.top = -scrollGuardado + 'px'; document.body.style.width = '100%'; }
    else { document.body.style.position = ''; document.body.style.top = ''; document.body.style.width = ''; html.style.scrollBehavior = 'auto'; window.scrollTo(0, scrollGuardado); html.style.scrollBehavior = ''; }
  }
  function menuToggle(abrir) {
    if (!menu) return;
    var on = abrir === undefined ? menu.hidden : abrir;
    if (on === !menu.hidden) return;
    menu.hidden = !on; btnMenu.setAttribute('aria-expanded', on); btnMenu.setAttribute('aria-label', on ? 'Cerrar menú' : 'Abrir menú');
    bloquear(on);
  }
  if (btnMenu) btnMenu.addEventListener('click', function () { menuToggle(); });
  if (menu) menu.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a) return;
    e.preventDefault(); menuToggle(false);
    var dest = $(a.getAttribute('href')); if (dest) setTimeout(function () { dest.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' }); }, 30);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu && !menu.hidden) menuToggle(false); });
  window.addEventListener('resize', function () { if (esDesk() && menu && !menu.hidden) menuToggle(false); });

  /* ================= entradas al hacer scroll ================= */
  var ioRv = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); ioRv.unobserve(e.target); } });
  }, { threshold: .18, rootMargin: '0px 0px -6% 0px' }) : null;
  function observar(els) { els.forEach(function (el) { if (ioRv) ioRv.observe(el); else el.classList.add('visto'); }); }
  $$('.reglas__lista .regla').forEach(function (e, i) { e.style.setProperty('--d', i); });
  $$('.almuerzos .rv').forEach(function (e, i) { e.style.setProperty('--d', i); });
  observar($$('.rv, .g'));

  // mapa: se carga cuando se acerca
  var mapa = $('.visitanos__mapa iframe');
  if (mapa && 'IntersectionObserver' in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { mapa.src = mapa.dataset.src; o.disconnect(); } }, { rootMargin: '700px' }).observe(mapa);
  else if (mapa) mapa.src = mapa.dataset.src;

  var galImgs = $$('.jardin__galeria img');
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { galImgs.forEach(function (i) { i.loading = 'eager'; }); o.disconnect(); } }, { rootMargin: '900px' }).observe($('#jardin'));

  /* ================= arrastre con el mouse (galería y agenda) ================= */
  function arrastrable(el) {
    var activo = false, x0 = 0, s0 = 0, ultX = 0, ultT = 0, vel = 0, movio = false, raf = 0;
    el.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0 || el.scrollWidth <= el.clientWidth) return;
      activo = true; movio = false; x0 = ultX = e.clientX; s0 = el.scrollLeft; ultT = performance.now(); vel = 0;
      cancelAnimationFrame(raf);
    });
    window.addEventListener('pointermove', function (e) {
      if (!activo) return;
      var dx = e.clientX - x0;
      if (!movio && Math.abs(dx) > 4) { movio = true; el.classList.add('is-drag'); }
      if (!movio) return;
      e.preventDefault();
      el.scrollLeft = s0 - dx;
      var now = performance.now(), dt = Math.max(1, now - ultT);
      vel = .8 * ((ultX - e.clientX) / dt) + .2 * vel; ultX = e.clientX; ultT = now;
    }, { passive: false });
    function soltar() {
      if (!activo) return; activo = false;
      if (!movio) return;
      var v = vel * 16;
      (function inercia() {
        if (Math.abs(v) < .5) { el.classList.remove('is-drag'); return; }
        el.scrollLeft += v; v *= .92; raf = requestAnimationFrame(inercia);
      })();
    }
    window.addEventListener('pointerup', soltar); window.addEventListener('pointercancel', soltar);
    el.addEventListener('click', function (e) { if (movio) { e.preventDefault(); e.stopPropagation(); movio = false; } }, true);
    el.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }
  $$('[data-arrastre]').forEach(arrastrable);
  var gal = $('.jardin__galeria');
  $$('[data-gal]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = gal.querySelector('.g'); var paso = f ? f.getBoundingClientRect().width + 14 : 300;
      gal.scrollBy({ left: paso * Number(b.dataset.gal), behavior: REDUCE ? 'auto' : 'smooth' });
    });
  });

  /* ================= carta + agenda (con el kit) ================= */
  var CORTAS = { cafeteria: 1, 'cafe-frio': 1, adicionales: 1, bebidas: 1 };
  var INFO = {
    cafeteria: 'Café de especialidad. Leche vegetal +$2.000.',
    'cafe-frio': 'Para los días de calor en el jardín.',
    adicionales: 'Para sumarle a tu café.',
    te: 'Blends en hebras de Inti Zen.',
    bebidas: 'Con y sin alcohol.',
    promos: 'De 8 a 11:30 y de 16 a 21. Incluyen infusión caliente y jugo de naranja. Solo en el salón.',
    cocina: 'Tostones, prensados de chipá, croque madame y mbeju.',
    laminados: 'Medialunas, croissants y rolls.',
    pasteleria: 'Muchas tienen versión sin TACC: avisanos al pedir.',
    almuerzos: 'Todos los días de 12 a 16.'
  };
  var PORTADA = { cafeteria: 'p-039', 'cafe-frio': 'p-026', adicionales: 'p-039', te: 'p-033', bebidas: 'p-026', promos: 'p-039', cocina: 'p-028', laminados: 'p-042', pasteleria: 'p-034', almuerzos: 'p-023' };
  var app = $('#carta-app'), tabsEl = $('.carta__tabs'), indiceEl = $('.carta__indice'), panel = $('#cartaPanel'), fotoEl = $('#cartaFoto'), fotoT = $('#cartaFotoT'), swTacc = $('#swTacc');
  var K = null, cats = [], prods = [], actual = null, tacc = false, fotoActual = '';
  var money = function (n) { return n == null ? null : '$' + Math.round(n).toLocaleString('es-AR'); };

  function hayAlmuerzos() { return prods.some(function (p) { return p.categoria === 'almuerzos' && p.disponible !== false; }); }
  function itemsDe(cid) {
    return prods.filter(function (p) {
      if (p.categoria !== cid) return false;
      if (cid === 'almuerzos' && p.disponible === false) return false;
      if (tacc && (p.etiquetas || []).indexOf('sintacc') < 0) return false;
      return true;
    });
  }
  function catsVisibles() {
    return cats.filter(function (c) { return c.id !== 'agenda' && (c.id !== 'almuerzos' || hayAlmuerzos()) && itemsDe(c.id).length; });
  }
  function foto(p) { return p.foto ? (K ? K.asset(p.foto) : p.foto) : ''; }
  function fotoGrande(src) { return src.replace(/-480\.webp$/, '-800.webp'); }

  function platoHTML(p, i) {
    var tags = p.etiquetas || [], salon = tags.indexOf('salon') >= 0, st = tags.indexOf('sintacc') >= 0;
    var pr = money(p.precio), ef = (T.pct && p.precio != null && !salon) ? money(p.precio * (100 - T.pct) / 100) : null;
    var f = foto(p), acc;
    if (p.disponible === false) acc = '<span class="plato__salon">Sin stock hoy</span>';
    else if (p.precio == null) acc = '<span class="plato__salon">Consultar</span>';
    else if (salon) acc = '<span class="plato__salon">Solo en el salón</span>';
    else if (tacc && st) acc = '<button type="button" class="btn-tacc" data-tacc-add="' + esc(p.id) + '" aria-label="Sumar ' + esc(p.nombre) + ' en versión sin TACC">+ Sin TACC</button>';
    else acc = '<div data-kit-qty="' + esc(p.id) + '"></div>';
    return '<li class="plato' + (p.disponible === false ? ' is-off' : '') + '" style="--i:' + i + '" data-id="' + esc(p.id) + '"' + (f ? ' data-foto="' + esc(f) + '"' : '') + '>' +
      (f ? '<img class="plato__img" src="' + esc(f) + '" alt="" width="64" height="64" loading="lazy" decoding="async">' : '') +
      '<div class="plato__body"><p class="plato__n">' + esc(p.nombre) + (f ? '<span class="dot" aria-hidden="true"></span>' : '') + '</p>' +
      (p.descripcion ? '<p class="plato__d">' + esc(p.descripcion) + '</p>' : '') +
      (pr ? '<p class="plato__p"><b>' + pr + '</b>' + (ef ? '<span class="plato__ef">' + ef + ' en efectivo</span>' : '') + '</p>' : '') +
      ((st || tags.indexOf('nuevo') >= 0 || tags.indexOf('veggie') >= 0) ? '<div class="plato__tags">' +
        (st ? '<span class="tag tag--tacc">Versión sin TACC</span>' : '') + (tags.indexOf('nuevo') >= 0 ? '<span class="tag tag--nuevo">Nuevo</span>' : '') + (tags.indexOf('veggie') >= 0 ? '<span class="tag tag--veggie">Veggie</span>' : '') + '</div>' : '') +
      '</div><div class="plato__acc">' + acc + '</div></li>';
  }

  function render(enfocar) {
    var vis = catsVisibles();
    if (!vis.length) { panel.innerHTML = '<p class="carta-vacia">No hay platos para mostrar.</p>'; tabsEl.innerHTML = indiceEl.innerHTML = ''; return; }
    if (!vis.some(function (c) { return c.id === actual; })) actual = vis[0].id;
    var idx = vis.findIndex(function (c) { return c.id === actual; });
    tabsEl.innerHTML = vis.map(function (c) {
      return '<button type="button" role="tab" class="tab' + (c.id === actual ? ' is-on' : '') + '" aria-selected="' + (c.id === actual) + '" aria-controls="cartaPanel" data-cat="' + esc(c.id) + '">' + esc(c.nombre) + '</button>';
    }).join('');
    indiceEl.innerHTML = vis.map(function (c) {
      return '<button type="button" class="' + (c.id === actual ? 'is-on' : '') + '" aria-current="' + (c.id === actual) + '" data-cat="' + esc(c.id) + '"><span>' + esc(c.nombre) + '</span><small>' + itemsDe(c.id).length + '</small></button>';
    }).join('');
    var c = vis[idx], items = itemsDe(c.id);
    var salonCat = c.id === 'promos';
    var sub = items.length + (items.length === 1 ? ' opción' : ' opciones') + (salonCat ? ' · para disfrutar acá' : ' · se pueden pedir para retirar');
    var prev = vis[idx - 1], next = vis[idx + 1];
    panel.innerHTML =
      '<div class="cat-head"><h3>' + esc(c.nombre) + '</h3><p>' + esc(sub) + '</p></div>' +
      (tacc ? '<p class="cat-aviso cat-aviso--verde">Mostramos lo que tiene versión sin TACC. Al sumarlo, queda anotado en tu pedido.</p>' : (INFO[c.id] ? '<p class="cat-aviso">' + esc(INFO[c.id]) + '</p>' : '')) +
      '<ul class="platos' + (CORTAS[c.id] && !tacc ? ' platos--cortos' : '') + '">' + items.map(platoHTML).join('') + '</ul>' +
      '<div class="carta__pie">' + (prev ? '<button type="button" data-cat="' + esc(prev.id) + '">← ' + esc(prev.nombre) + '</button>' : '<span></span>') +
      (next ? '<button type="button" data-cat="' + esc(next.id) + '">' + esc(next.nombre) + ' →</button>' : '') + '</div>';
    if (K && K.carrito) K.carrito.sync(panel);
    ponerFoto(null, c);
    app.removeAttribute('aria-busy');
    // pestaña activa siempre a la vista
    var on = tabsEl.querySelector('.is-on');
    if (on) tabsEl.scrollTo({ left: on.offsetLeft - tabsEl.clientWidth / 2 + on.offsetWidth / 2, behavior: enfocar ? 'smooth' : 'auto' });
  }
  function ponerFoto(p, c) {
    if (!fotoEl) return;
    var src = p ? fotoGrande(foto(p)) : 'img/' + (PORTADA[c ? c.id : actual] || 'p-039') + '-800.webp';
    var tit = p ? p.nombre + ' · ' + money(p.precio) : (c ? c.nombre : '');
    fotoT.textContent = tit;
    if (src === fotoActual) return;
    fotoActual = src;
    fotoEl.classList.add('is-cambia');
    var im = new Image();
    im.onload = function () { fotoEl.src = src; fotoEl.alt = p ? p.nombre : ''; fotoEl.classList.remove('is-cambia'); };
    im.src = src;
  }
  function irA(cid, desdePie) {
    actual = cid; render(true);
    if (desdePie || !esDesk()) {
      var y = (esDesk() ? app : tabsEl).getBoundingClientRect().top + window.scrollY - (esDesk() ? 110 : 64);
      if (window.scrollY > y + 4 || desdePie) window.scrollTo({ top: y, behavior: REDUCE ? 'auto' : 'smooth' });
    }
  }
  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (b) { irA(b.dataset.cat, !!b.closest('.carta__pie')); return; }
    var t = e.target.closest('[data-tacc-add]');
    if (t && K && K.carrito) { K.carrito.agregar(t.dataset.taccAdd, 1, { nota: 'Versión sin TACC', origen: t }); t.textContent = '✓ Sumado'; setTimeout(function () { if (t.isConnected) t.textContent = '+ Sin TACC'; }, 1300); }
  });
  tabsEl.addEventListener('keydown', function (e) {
    if (['ArrowRight', 'ArrowLeft'].indexOf(e.key) < 0) return;
    var ts = $$('.tab', tabsEl), i = ts.indexOf(document.activeElement); if (i < 0) return;
    var n = ts[(i + (e.key === 'ArrowRight' ? 1 : -1) + ts.length) % ts.length]; irA(n.dataset.cat); var nn = tabsEl.querySelector('[data-cat="' + n.dataset.cat + '"]'); if (nn) nn.focus();
  });
  // foto del plato al pasar el mouse (desktop)
  var hoverRaf = 0, hoverEl = null;
  panel.addEventListener('pointerover', function (e) {
    if (!HOVER || !esDesk()) return;
    var li = e.target.closest('.plato'); if (!li || li === hoverEl) return;
    hoverEl = li; cancelAnimationFrame(hoverRaf);
    hoverRaf = requestAnimationFrame(function () {
      $$('.plato.is-hover', panel).forEach(function (x) { x.classList.remove('is-hover'); });
      li.classList.add('is-hover');
      var p = prods.find(function (x) { return x.id === li.dataset.id; });
      if (p && p.foto) ponerFoto(p); else ponerFoto(null, cats.find(function (c) { return c.id === actual; }));
    });
  });
  panel.addEventListener('pointerleave', function () { hoverEl = null; $$('.plato.is-hover', panel).forEach(function (x) { x.classList.remove('is-hover'); }); });
  swTacc.addEventListener('click', function () {
    tacc = !tacc; swTacc.setAttribute('aria-pressed', tacc);
    render(true);
  });

  /* ---- agenda ---- */
  var agendaEl = $('#agendaLista');
  function renderAgenda() {
    var evs = prods.filter(function (p) { return p.categoria === 'agenda' && p.disponible !== false; });
    var prox = evs.filter(function (p) { return (p.etiquetas || []).indexOf('pasado') < 0; });
    var pas = evs.filter(function (p) { return (p.etiquetas || []).indexOf('pasado') >= 0; });
    var card = function (p, pasado) {
      var partes = String(p.descripcion || '').split(/\s+[—–-]\s+/);
      var fecha = partes.length > 1 ? partes.shift() : '';
      var det = partes.join(' — ');
      var f = foto(p);
      return '<article class="pizarra' + (pasado ? ' pizarra--pasado' : '') + '">' +
        (pasado && f ? '<div class="pizarra__foto"><img src="' + esc(f) + '" alt="" loading="lazy" decoding="async"></div>' : '<img class="pizarra__logo" src="img/logo.svg" alt="" width="704" height="212">') +
        '<p class="pizarra__fecha">' + (pasado ? 'Así fue' + (fecha ? ' · ' + esc(fecha) : '') : 'Próximo' + (fecha ? ' · ' + esc(fecha) : '')) + '</p>' +
        '<h3>' + esc(p.nombre) + '</h3>' + (det ? '<p>' + esc(det) + '</p>' : '') +
        (pasado ? '' : '<a class="pizarra__cta" href="https://www.instagram.com/bienetrecafe/" target="_blank" rel="noopener">Más info en @bienetrecafe →</a>') +
        '</article>';
    };
    var extra = '<article class="pizarra pizarra--ig"><div class="pizarra__foto"><img src="img/pizarra-700.webp" alt="La pizarra de la entrada de Bien être café" loading="lazy" decoding="async"></div>' +
      '<p class="pizarra__fecha">Siempre</p><h3>Las novedades salen primero en Instagram</h3><p>Fechas, menús especiales y lo que se viene en el jardín.</p>' +
      '<a class="pizarra__cta" href="https://www.instagram.com/bienetrecafe/" target="_blank" rel="noopener">Seguir a @bienetrecafe →</a></article>';
    var cards = prox.map(function (p) { return card(p, false); }).concat(pas.map(function (p) { return card(p, true); }));
    if (cards.length % 3 !== 0) cards.push(extra);
    agendaEl.innerHTML = cards.join('');
    $$('.pizarra', agendaEl).forEach(function (e, i) { e.style.setProperty('--d', i); });
    observar($$('.pizarra', agendaEl));
    $('#agenda').hidden = !evs.length;
  }

  function cargar() {
    return Promise.all([K.store.getCategorias(), K.store.getProductos()]).then(function (r) {
      cats = r[0].slice().sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); }); prods = r[1];
      render(false); renderAgenda();
      $('#almuerzos').hidden = hayAlmuerzos();
    }).catch(function (err) { console.error('[demo] carta', err); panel.innerHTML = '<p class="carta-vacia">No pudimos cargar la carta. Probá recargar la página.</p>'; });
  }
  function conKit(kit) {
    if (K) return; K = kit;
    var ef = kit.config && kit.config.pagos && kit.config.pagos.efectivo;
    if (ef) { EFECTIVO = ef; T = pintarTextos(); }
    cargar();
    kit.store.onChange(cargar);
  }
  if (window.__kit) conKit(window.__kit);
  document.addEventListener('be:kit', function (e) { conKit(e.detail); });
  document.addEventListener('be:kit-error', function () { panel.innerHTML = '<p class="carta-vacia">No pudimos cargar la carta. Probá recargar la página.</p>'; });

  // el texto del día se actualiza si la página queda abierta
  setInterval(function () { T = pintarTextos(); }, 60000);
})();
