/* ============================================================
   CONFIGURACIÓN: rellena aquí tus datos (un único sitio).
   Mientras un valor empiece por "[" se mostrará como marcador.
   Ejemplos: email: 'tunombre@correo.com'
             github: 'https://github.com/tuusuario'
   ============================================================ */
var CONFIG = {
  email:    'izanhernandez92@gmail.com',
  linkedin: '[LINKEDIN AQUÍ]',
  github:   '[GITHUB AQUÍ]',
  kit:      '[ENLACE AQUÍ]',   // Kit multimedia
  freno:    '[ENLACE AQUÍ]',   // Freno AI
  vantor:   '[ENLACE AQUÍ]',   // Vantor V12
  outfit:   '[ENLACE AQUÍ]'    // Ouftit AI
};

for (var k in CONFIG) CONFIG[k] = CONFIG[k].replace(/^\[(.*(@|https?:).*)\]$/, '$1');

(function(){
  var PAGES = [['index.html','Inicio','inicio'],['sobre-mi.html','Sobre mí','sobre-mi'],['habilidades.html','Qué sé hacer','habilidades'],['proyectos.html','Proyectos','proyectos'],['valores.html','Qué defiendo','valores'],['contacto.html','Contacto','contacto']];
  var cur = document.body.dataset.page;

  // Cabecera y pie compartidos
  var h = document.getElementById('site-header');
  if(h){
    var items = PAGES.map(function(p){
      return '<li><a href="'+p[0]+'"'+(p[2]===cur?' aria-current="page"':'')+(p[2]==='contacto'?' class="nav-cta"':'')+'>'+p[1]+'</a></li>';
    }).join('');
    h.outerHTML = '<header><nav class="wrap" aria-label="Navegación principal"><a class="logo" href="index.html">Izan<span>.</span>dev</a><button class="burger" aria-expanded="false" aria-controls="menu">Menú</button><ul class="menu" id="menu">'+items+'</ul></nav></header>';
  }
  var f = document.getElementById('site-footer');
  if(f) f.innerHTML = '<div class="wrap">© '+new Date().getFullYear()+' Izan Hernández García Cabañes Fernández · Portfolio de la actividad “Crea tu marca personal” (IPE II)</div>';

  var b = document.querySelector('.burger'), m = document.getElementById('menu');
  b.addEventListener('click', function(){ b.setAttribute('aria-expanded', m.classList.toggle('open')); });

  // Enlaces desde CONFIG
  document.querySelectorAll('[data-link]').forEach(function(a){
    var k = a.dataset.link, v = CONFIG[k] || '', ph = !v || v.charAt(0) === '[';
    var t = a.querySelector('.val') || a;
    if(ph){ a.setAttribute('href','#'); t.innerHTML = '<span class="ph">'+(v || '[ENLACE AQUÍ]')+'</span>'; return; }
    a.href = k === 'email' ? 'mailto:'+v : v;
    if(/^https?/.test(v)){ a.target = '_blank'; a.rel = 'noopener'; }
    if(a.querySelector('.val')) t.textContent = v.replace(/^https?:\/\/(www\.)?/, '');
  });

  // Formulario de contacto: el mensaje llega a tu email sin abrir ningún programa
  function nativePost(em, d){
    var f = document.createElement('form'); f.method = 'POST'; f.action = 'https://formsubmit.co/' + em;
    var fields = {name:d.get('nombre'), email:d.get('correo'), message:d.get('mensaje'), _subject:d.get('asunto'), _template:'table', _captcha:'false', _next:location.href.split(/[?#]/)[0] + '?enviado=1'};
    for(var k in fields){ var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = fields[k]; f.appendChild(i); }
    document.body.appendChild(f); f.submit();
  }
  var form = document.getElementById('contact-form');
  if(form){
    if(/[?&]enviado=1/.test(location.search)) document.getElementById('status').textContent = '¡Mensaje enviado! Te responderé pronto.';
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var s = document.getElementById('status'), btn = form.querySelector('button'), em = CONFIG.email;
      if(em.charAt(0) === '['){ s.textContent = 'Aún falta configurar el email en js/main.js.'; return; }
      var d = new FormData(form);
      btn.disabled = true; s.textContent = 'Enviando…';
      fetch('https://formsubmit.co/ajax/' + em, {
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify({name:d.get('nombre'), email:d.get('correo'), message:d.get('mensaje'), _subject:d.get('asunto'), _template:'table', _captcha:'false'})
      }).then(function(r){ return r.json(); }).then(function(j){
        if(j.success === true || j.success === 'true'){ form.reset(); s.textContent = '¡Mensaje enviado! Te responderé pronto.'; btn.disabled = false; }
        else throw new Error(j.message || 'fallo');
      }).catch(function(err){
        console.warn('Envío AJAX fallido:', err);
        s.textContent = 'Reintentando con envío directo…';
        setTimeout(function(){ nativePost(em, d); }, 500);
      });
    });
  }

  // Aparición al hacer scroll
  var els = document.querySelectorAll('main .card,main .tags,main .sub,main .lead,main .band,main .hero .wrap,main h1.title,main h2');
  els.forEach(function(e){ e.classList.add('rv'); });
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.12});
    els.forEach(function(e){ io.observe(e); });
  } else els.forEach(function(e){ e.classList.add('in'); });

  // Fondo animado: red de nodos
  var c = document.createElement('canvas'); c.id = 'bg'; c.setAttribute('aria-hidden','true');
  document.body.insertBefore(c, document.body.firstChild);
  var x = c.getContext('2d'), reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, pts = [], W, H, rgb;
  function size(){
    W = c.width = innerWidth; H = c.height = innerHeight;
    rgb = getComputedStyle(document.documentElement).getPropertyValue('--canvas').trim();
    pts = []; for(var i = 0, n = Math.min(70, W*H/22000|0); i < n; i++) pts.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.3, vy:(Math.random()-.5)*.3});
  }
  function draw(){
    x.clearRect(0,0,W,H);
    for(var i = 0; i < pts.length; i++){
      var p = pts[i];
      if(!reduce){ p.x += p.vx; p.y += p.vy; if(p.x<0||p.x>W) p.vx*=-1; if(p.y<0||p.y>H) p.vy*=-1; }
      x.fillStyle = 'rgba('+rgb+',.7)'; x.beginPath(); x.arc(p.x,p.y,2,0,6.283); x.fill();
      for(var j = i+1; j < pts.length; j++){
        var q = pts[j], d = Math.hypot(p.x-q.x, p.y-q.y);
        if(d < 140){ x.strokeStyle = 'rgba('+rgb+','+(.25*(1-d/140))+')'; x.beginPath(); x.moveTo(p.x,p.y); x.lineTo(q.x,q.y); x.stroke(); }
      }
    }
    if(!reduce) requestAnimationFrame(draw);
  }
  size(); draw();
  addEventListener('resize', function(){ size(); if(reduce) draw(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(){ size(); if(reduce) draw(); });
})();
