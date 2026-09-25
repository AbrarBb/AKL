/* ══════════════════════════════════
   script.js — Portfolio Logic v2
   Abrar Khatib Lajim
══════════════════════════════════ */

/* ── LOADER ─────────────────────────── */
(function(){
  const bar = document.getElementById('ld-bar');
  const ldr = document.getElementById('loader');
  let pct = 0;
  const iv = setInterval(()=>{
    pct += Math.random()*18 + 4;
    if(pct >= 100){
      pct = 100;
      clearInterval(iv);
      bar.style.width = '100%';
      setTimeout(()=> ldr.classList.add('out'), 500);
    }
    bar.style.width = pct + '%';
  }, 100);
})();


/* ── CUSTOM CURSOR ──────────────────── */
(function(){
  const c  = document.getElementById('cursor');
  const cr = document.getElementById('cursor-ring');
  let rx=0, ry=0;

  document.addEventListener('mousemove', e=>{
    c.style.left  = e.clientX + 'px';
    c.style.top   = e.clientY + 'px';
  });

  (function loop(){
    const cl = parseFloat(c.style.left)||0;
    const ct = parseFloat(c.style.top)||0;
    rx += (cl - rx) * .11;
    ry += (ct - ry) * .11;
    cr.style.left = rx + 'px';
    cr.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const hov = 'a,button,.bento-card,.work-item,.rcard,.sg,.st-row span,.si,.cl-item';
  document.addEventListener('mouseover', e=>{ if(e.target.closest(hov)) document.body.classList.add('ch'); });
  document.addEventListener('mouseout',  e=>{ if(e.target.closest(hov)) document.body.classList.remove('ch'); });
})();


/* ── NAV SCROLL ─────────────────────── */
(function(){
  const nav = document.getElementById('nav');
  window.addEventListener('scroll',()=> nav.classList.toggle('scrolled', scrollY > 60), {passive:true});
})();


/* ── MOBILE NAV ─────────────────────── */
(function(){
  const btn  = document.getElementById('burger');
  const menu = document.getElementById('mob-nav');
  btn.addEventListener('click',()=>{
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  document.querySelectorAll('[data-mc]').forEach(el=>{
    el.addEventListener('click',()=>{
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
})();


/* ── HERO GRID CANVAS ───────────────── */
(function(){
  const cv  = document.getElementById('grid-canvas');
  if(!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, particles=[];

  function resize(){
    W = cv.width  = cv.offsetWidth;
    H = cv.height = cv.offsetHeight;
  }

  class Dot {
    constructor(){ this.reset(); }
    reset(){
      this.x  = Math.random()*W;
      this.y  = Math.random()*H;
      this.vx = (Math.random()-.5)*.35;
      this.vy = (Math.random()-.5)*.35;
      this.r  = Math.random()*1.5+.4;
      this.a  = Math.random()*.4+.08;
      this.hot = Math.random() > .75;
    }
    step(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset(); }
    draw(){
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle = this.hot ? `rgba(255,69,0,${this.a})` : `rgba(230,220,210,${this.a*.6})`;
      ctx.fill();
    }
  }

  function lines(){
    const d = 110;
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<d){
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255,69,0,${(1-dist/d)*.06})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  function init(){
    resize();
    const n = Math.min(Math.floor(W*H/8000), 120);
    particles = Array.from({length:n},()=>new Dot());
  }

  function loop(){
    ctx.clearRect(0,0,W,H);
    lines();
    particles.forEach(p=>{p.step();p.draw();});
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize',()=>{ resize(); init(); },{passive:true});
  init(); loop();
})();


/* ── ROLE TYPEWRITER ────────────────── */
(function(){
  const roles = [
    'Founder @ Khatib Studio',
    'Indie Android Developer',
    'Smart Contract Researcher',
    'Flutter & Mobile Engineer',
    'Final-Year CSE @ EWU'
  ];
  const el = document.querySelector('.hero-tag span');
  if(!el) return;
  el.textContent = '';
  let ri=0, ci=0, del=false;

  function type(){
    const cur = roles[ri];
    el.textContent = del ? cur.slice(0,ci--) : cur.slice(0,ci++);
    let t = del ? 55 : 90;
    if(!del && ci > cur.length){ t=1800; del=true; }
    else if(del && ci < 0){ del=false; ci=0; ri=(ri+1)%roles.length; t=300; }
    setTimeout(type, t);
  }
  setTimeout(type, 2200);
})();


/* ── SCROLL REVEAL ──────────────────── */
(function(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold:.1, rootMargin:'0px 0px -30px 0px' });
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
})();


/* ── COUNTER ANIMATION ──────────────── */
(function(){
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el  = e.target;
      const end = +el.dataset.to;
      const dur = 1800;
      const t0  = performance.now();
      (function update(t){
        const p = Math.min((t-t0)/dur,1);
        const v = 1-Math.pow(1-p,3);
        el.textContent = Math.round(v*end);
        if(p<1) requestAnimationFrame(update);
        else el.textContent = end;
      })(t0);
      io.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('.cnt').forEach(el=>io.observe(el));
})();


/* ── FLOATING CTA SHOW/HIDE ─────────── */
(function(){
  const btn = document.getElementById('float-cta');
  window.addEventListener('scroll',()=>{
    btn.classList.toggle('show', scrollY > 400);
  },{passive:true});
})();


/* ── MAGNETIC HOVER ─────────────────── */
(function(){
  const targets = '.btn-outline, .cf-btn, .nav-hire';
  document.querySelectorAll(targets).forEach(el=>{
    el.addEventListener('mousemove',e=>{
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width/2))  * .28;
      const dy = (e.clientY - (r.top  + r.height/2)) * .28;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave',()=>{ el.style.transform=''; });
  });
})();


/* ── PARALLAX HERO ──────────────────── */
(function(){
  const av = document.querySelector('.avatar-wrap');
  if(!av) return;
  document.addEventListener('mousemove',e=>{
    const rx = (e.clientX/innerWidth  - .5) * 14;
    const ry = (e.clientY/innerHeight - .5) * 10;
    av.style.transform = `translate(${rx}px,${ry}px)`;
  },{passive:true});
})();


/* ── ACTIVE NAV ─────────────────────── */
(function(){
  const secs  = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nl');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        links.forEach(l=>{ l.style.color = l.getAttribute('href')==='#'+e.target.id ? 'var(--ac)' : ''; });
      }
    });
  },{threshold:.45});
  secs.forEach(s=>io.observe(s));
})();


/* ── CONTACT FORM ───────────────────── */
function handleForm(e){
  e.preventDefault();
  const note = document.getElementById('cf-note');
  const btn  = document.getElementById('cf-btn');
  const name  = document.getElementById('cf-name').value;
  const email = document.getElementById('cf-email').value;
  const msg   = document.getElementById('cf-msg').value;

  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';

  const ml = `mailto:contact.lajim@gmail.com?subject=${encodeURIComponent('Portfolio Contact from '+name)}&body=${encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\n'+msg)}`;

  setTimeout(()=>{
    window.location.href = ml;
    note.textContent = '✓ Opening your email client…';
    note.className = 'cf-note ok';
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    document.getElementById('cf').reset();
    setTimeout(()=>{ note.textContent=''; note.className='cf-note'; }, 4000);
  }, 500);
}
