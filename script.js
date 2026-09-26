/* ══════════════════════════════════
   script.js - Portfolio Logic v2
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


/* ═══════════════════════════════════════════
   PROJECT SHOWCASE MODAL CONTROLLER
═══════════════════════════════════════════ */
const PROJECTS_DATA = {
  citygo: {
    id: 'citygo',
    num: '01',
    name: 'CityGo',
    tagline: 'Public Transit & Fleet Supervisor Ecosystem',
    badge: 'Featured System',
    badgeClass: 'wi-badge--feat',
    period: 'December 2025',
    logoSrc: 'assets/logos/citygo-logo.png',
    logoFallbackIcon: 'bus',
    videoSrc: 'assets/videos/citygo.mp4',
    youtubeId: '28DNBCcHyEU',
    screenshots: [
      {
        src: 'assets/screenshots/citygo-1.png',
        title: 'Operations Dashboard & Real-Time Fleet Map',
        caption: 'CityGo Web Portal - Live bus GPS telemetry, automated schedule adherence, and route congestion mapping'
      }
    ],
    description: 'A multi-role transit ecosystem connecting passengers, fleet administrators, and bus supervisors into one synchronized core. Passengers track routes and arrival times, administrators supervise line schedules, and supervisors handle live vehicle dispatching.',
    architectureStory: 'CityGo is architected around a synchronized multi-client topology connecting a React/Supabase operational management portal with a dedicated Flutter driver/supervisor mobile application. To guarantee uninterrupted telemetry and prevent driver blindspots in low-connectivity urban routes, the Flutter client implements offline-first SQLite state caching with automatic background synchronization when cellular data resumes.',
    highlights: [
      'Tri-role unified architecture (Passenger web client, Admin operations panel, Flutter driver/supervisor app)',
      'Live transit telemetry with real-time ETA calculation and interactive route congestion mapping',
      'Resilient data synchronization utilizing Supabase real-time subscriptions with local SQLite fallback'
    ],
    tech: [
      { name: 'Flutter', icon: 'devicon-flutter-plain colored' },
      { name: 'Dart', icon: 'devicon-dart-plain colored' },
      { name: 'React', icon: 'devicon-react-original colored' },
      { name: 'Supabase', icon: 'devicon-supabase-plain colored' },
      { name: 'SQLite', icon: 'devicon-sqlite-plain colored' }
    ],
    links: [
      { label: 'Watch YouTube Demo', url: 'https://youtu.be/28DNBCcHyEU', icon: 'play-circle', primary: true },
      { label: 'Web App Repo', url: 'https://github.com/AbrarBb/citygo', icon: 'globe', primary: false },
      { label: 'Flutter Supervisor App', url: 'https://github.com/AbrarBb/citygo-supervisor', icon: 'github', primary: false }
    ]
  },

  noyza: {
    id: 'noyza',
    num: '02',
    name: 'Noyza',
    tagline: 'Real-Time Acoustic Decibel & Environment Suitability Evaluator',
    badge: 'Play Store',
    badgeClass: 'wi-badge--play',
    period: 'Khatib Studio · Android App',
    logoSrc: 'assets/logos/noyza-logo.png',
    logoFallbackIcon: 'activity',
    videoSrc: 'assets/videos/noyza.mp4',
    youtubeId: null,
    screenshots: [
      {
        src: 'assets/screenshots/noyza-1.png',
        title: 'Decibel Sound Meter & Environment Telemetry',
        caption: 'Noyza Android App - Real-time acoustic sound gauge, spectral frequency visualizer, and focus suitability logging'
      }
    ],
    description: 'A production Android application engineered under Khatib Studio, delivering real-time acoustic telemetry, decibel measurement, and ambient environment suitability scoring for studying, resting, and productivity.',
    architectureStory: 'Engineered using native Android AudioRecord API telemetry, capturing raw 16-bit PCM audio buffers and calculating precise root-mean-square (RMS) sound pressure levels (SPL) entirely on-device without recording or storing user audio. Built strictly adhering to Google Play vitals and Material 3 design guidelines.',
    highlights: [
      'Real-time decibel telemetry with peak frequency spectral analysis and threshold alerts',
      'Acoustic suitability classification algorithm categorizing environments into actionable focus tiers',
      '100% on-device processing ensuring zero audio data leaves the phone, fully compliant with privacy standards'
    ],
    tech: [
      { name: 'Java', icon: 'devicon-java-plain colored' },
      { name: 'Android SDK', icon: 'devicon-android-plain colored' },
      { name: 'AudioRecord API', iconLucide: 'activity' },
      { name: 'Material 3', iconLucide: 'layers' }
    ],
    links: [
      { label: 'View on Google Play', url: 'https://play.google.com/store/apps/dev?id=6004694038713258412', icon: 'smartphone', primary: true },
      { label: 'GitHub Repository', url: 'https://github.com/AbrarBb/Noyza', icon: 'github', primary: false }
    ]
  },

  cyvia: {
    id: 'cyvia',
    num: '03',
    name: 'Cyvia',
    tagline: 'Offline-First Private Cycle & Health Tracker',
    badge: 'Play Store',
    badgeClass: 'wi-badge--play',
    period: 'Khatib Studio · Android App',
    logoSrc: 'assets/logos/cyvia-logo.png',
    logoFallbackIcon: 'shield-check',
    videoSrc: 'assets/videos/cyvia.mp4',
    youtubeId: null,
    screenshots: [
      {
        src: 'assets/screenshots/cyvia-1.png',
        title: 'Private Cycle Timeline & Encrypted Local Data',
        caption: 'Cyvia Android App - Offline period timeline, symptom frequency trends, and zero-telemetry local database'
      }
    ],
    description: 'A production offline-first Android cycle tracking application designed to safeguard sensitive health data. Operates with zero network dependency, ensuring reproductive and biometric data remains exclusively on user hardware.',
    architectureStory: 'The offline-first architecture is Cyvia foundational engineering requirement. In an era of heightened concerns regarding reproductive data surveillance, all prediction algorithms, historical cycle data, and symptom tracking operate strictly against an encrypted local Room/SQLite database with zero cloud server endpoints or analytics trackers.',
    highlights: [
      'Strict offline-first local database architecture ensuring 100% data sovereignty',
      'On-device cycle prediction engine utilizing weighted moving averages of past cycle lengths',
      'Symptom tracking, ovulation window estimation, and exportable encrypted backup files'
    ],
    tech: [
      { name: 'Java', icon: 'devicon-java-plain colored' },
      { name: 'Android SDK', icon: 'devicon-android-plain colored' },
      { name: 'SQLite / Room', icon: 'devicon-sqlite-plain colored' },
      { name: 'Offline Architecture', iconLucide: 'shield-check' }
    ],
    links: [
      { label: 'View on Google Play', url: 'https://play.google.com/store/apps/dev?id=6004694038713258412', icon: 'smartphone', primary: true },
      { label: 'GitHub Repository', url: 'https://github.com/AbrarBb/Cyvia', icon: 'github', primary: false }
    ]
  },

  synaptalk: {
    id: 'synaptalk',
    num: '04',
    name: 'Synaptalk',
    tagline: 'AI Gaze-Assistive Communication Platform',
    badge: 'Capstone 2026',
    badgeClass: 'wi-badge--wip',
    period: 'Active Capstone · 2026',
    logoSrc: 'assets/logos/synaptalk-logo.png',
    logoFallbackIcon: 'eye',
    videoSrc: 'assets/videos/synaptalk.mp4',
    youtubeId: null,
    screenshots: [
      {
        src: 'assets/screenshots/synaptalk-1.png',
        title: 'Live Ocular Gaze Tracking & Virtual Keyboard',
        caption: 'Synaptalk Desktop UI - MediaPipe FaceMesh iris tracking overlay, predictive dwell virtual keyboard, and speech synthesis'
      }
    ],
    description: 'An AI-powered assistive communication platform using ocular gaze tracking to empower individuals with severe motor disabilities, ALS, or quadriplegia to compose speech and interact with the world through eye movements.',
    architectureStory: 'During initial prototyping, the engineering specification called for dual-modality input combining consumer EEG sensors with ocular tracking. Rigorous signal analysis revealed extreme noise-to-signal degradation from facial muscle twitches and high sensor latency. The team made a strategic pivot to excise the BCI layer and channel full focus into a high-precision computer vision pipeline using MediaPipe FaceMesh iris refinement and OpenCV, achieving sub-40ms dwell detection with regular webcams.',
    highlights: [
      'Sub-40ms ocular landmark detection leveraging MediaPipe FaceMesh and OpenCV',
      'Dwell-time virtual keyboard with predictive N-gram vocabulary completion',
      'Integrated SAPI / text-to-speech audio synthesis engine with pitch and rate modulation'
    ],
    tech: [
      { name: 'Flutter', icon: 'devicon-flutter-plain colored' },
      { name: 'Python', icon: 'devicon-python-plain colored' },
      { name: 'OpenCV', icon: 'devicon-opencv-plain colored' },
      { name: 'MediaPipe', iconLucide: 'sparkles' },
      { name: 'SAPI / TTS', iconLucide: 'volume-2' }
    ],
    links: [
      { label: 'Prototype Repository', url: 'https://github.com/AbrarBb/Prototype-1-February', icon: 'github', primary: true }
    ]
  },

  pragmaguard: {
    id: 'pragmaguard',
    num: '05',
    name: 'PragmaGuard',
    tagline: 'Forensic Smart Contract Rug-Pull Audit Platform',
    badge: 'Research Flagship',
    badgeClass: 'wi-badge--feat',
    period: 'March 2026',
    logoSrc: 'assets/logos/pragmaguard-logo.png',
    logoFallbackIcon: 'shield-alert',
    videoSrc: 'assets/videos/pragmaguard.mp4',
    youtubeId: null,
    screenshots: [
      {
        src: 'assets/screenshots/pragmaguard-1.png',
        title: 'Forensic Audit Dashboard & AST Decompiler',
        caption: 'PragmaGuard Workbench - Bytecode AST disassembly, rug-pull risk scoring gauge, and Sentence-BERT semantic similarity analysis'
      }
    ],
    description: 'Supervised faculty research: a forensic static analysis and intent-classification platform detecting rug-pull risks in Ethereum smart contracts using NLP, static bytecode AST analysis, and ensemble ML across 3,324 verified contracts.',
    architectureStory: 'PragmaGuard bridges the gap between conventional rule-based static analyzers and malicious semantic discrepancies. By decompiling EVM bytecode into Solidity ASTs and computing dense Sentence-BERT vector representations of developer comments and function headers, the platform identifies covert rug-pull hooks, privileged token minting functions, and liquidity drainage paths across a database of 3,324 verified Ethereum contracts.',
    highlights: [
      'Empirical study and forensic classification tested across 3,324 verified mainnet contracts',
      'Multi-modal pipeline fusing Slither AST parsing, decompiled bytecode CFG, and Sentence-BERT NLP embeddings',
      'Full-stack interactive audit workbench with FastAPI microservices and Next.js frontend'
    ],
    tech: [
      { name: 'Python', icon: 'devicon-python-plain colored' },
      { name: 'FastAPI', icon: 'devicon-fastapi-plain colored' },
      { name: 'PyTorch', icon: 'devicon-pytorch-original colored' },
      { name: 'Sentence-BERT', iconLucide: 'brain' },
      { name: 'Next.js', icon: 'devicon-nextjs-plain' }
    ],
    links: [
      { label: 'GitHub Repository', url: 'https://github.com/AbrarBb/PragmaGuard', icon: 'github', primary: true },
      { label: 'Hugging Face Space', url: 'https://huggingface.co/spaces/aklajim/PragmaGuard', icon: 'external-link', primary: false }
    ]
  },

  zkpvote: {
    id: 'zkpvote',
    num: '06',
    name: 'ZKPVote',
    tagline: 'Zero-Knowledge Cryptographic Voting Protocol',
    badge: 'Privacy Protocol',
    badgeClass: 'wi-badge--feat',
    period: '2025 · Web3 Prototype',
    logoSrc: 'assets/logos/zkpvote-logo.png',
    logoFallbackIcon: 'key-round',
    videoSrc: 'assets/videos/zkpvote.mp4',
    youtubeId: null,
    screenshots: [
      {
        src: 'assets/screenshots/zkpvote-1.png',
        title: 'zk-SNARK Ballot Generation & Testnet Verification',
        caption: 'ZKPVote Web3 Portal - Client-side zero-knowledge ballot casting, verifier contract execution, and homomorphic tallying log'
      }
    ],
    description: 'Privacy-preserving blockchain e-voting prototype demonstrating Zero-Knowledge Proofs and Homomorphic Encryption architecture for verifiable secret-ballot governance.',
    architectureStory: 'ZKPVote solves the cryptographic tension between ballot secrecy and public verifiability in decentralized elections. Utilizing client-side zk-SNARK proof generation in the browser, each voter proves their voting eligibility and ballot validity without revealing their identity or vote choice. Tallies are calculated on-chain over encrypted votes via additive homomorphic encryption.',
    highlights: [
      'Client-side zk-SNARK proof generation verifying ballot validity without revealing vote selection',
      'Additive homomorphic encryption enabling trustless on-chain tally aggregation',
      'Publicly auditable verification contract deployed and verifiable on Ethereum testnet'
    ],
    tech: [
      { name: 'Blockchain', iconLucide: 'shield' },
      { name: 'ZKP / zk-SNARKs', iconLucide: 'key-round' },
      { name: 'JavaScript', icon: 'devicon-javascript-plain colored' }
    ],
    links: [
      { label: 'Open Live Prototype', url: 'https://abrarbb.github.io/Blockchain-Based-Privacy-Preserving-E-Voting-System-prototype/', icon: 'external-link', primary: true }
    ]
  }
};

const PROJECT_KEYS = ['citygo', 'noyza', 'cyvia', 'synaptalk', 'pragmaguard', 'zkpvote'];

(function initProjectModal(){
  const modal = document.getElementById('project-modal');
  if(!modal) return;

  const backdrop = document.getElementById('pm-backdrop');
  const closeBtn = document.getElementById('pm-close');
  const prevBtn  = document.getElementById('pm-prev');
  const nextBtn  = document.getElementById('pm-next');
  const tabs     = document.querySelectorAll('.pm-tab');
  const panes    = document.querySelectorAll('.pm-tab-pane');
  const pickBtn  = document.getElementById('pm-pick-btn');
  const filePick = document.getElementById('pm-local-file-picker');

  let currentSlug = 'citygo';

  function openModal(slug){
    const proj = PROJECTS_DATA[slug];
    if(!proj) return;
    currentSlug = slug;

    // Header info
    document.getElementById('pm-num').textContent = proj.num;
    document.getElementById('pm-badge').textContent = proj.badge;
    document.getElementById('pm-period').textContent = proj.period;
    document.getElementById('pm-title').textContent = proj.name;
    document.getElementById('pm-tagline').textContent = proj.tagline;

    // Logo
    const logoEl = document.getElementById('pm-logo');
    logoEl.innerHTML = `
      <img src="${proj.logoSrc}" alt="${proj.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
      <div class="wi-logo-fallback ${proj.id}-fallback" style="display:none; width:100%; height:100%; align-items:center; justify-content:center;">
        <i data-lucide="${proj.logoFallbackIcon}" class="icon-md"></i>
      </div>
    `;

    // Video Section
    renderVideo(proj);

    // Screenshots Section
    renderScreenshots(proj);

    // Overview & Architecture Section
    renderOverview(proj);

    // Footer buttons
    renderFooterButtons(proj);

    // Reset tabs to video tab
    switchTab('video');

    // Open modal
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Re-initialize Lucide icons
    if(window.lucide) window.lucide.createIcons();
  }

  function closeModal(){
    // Pause video
    const videoEl = document.querySelector('#pm-video-wrap video');
    if(videoEl) videoEl.pause();

    // Clear iframe to stop audio
    const iframe = document.querySelector('#pm-video-wrap iframe');
    if(iframe) iframe.src = '';

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function switchTab(tabId){
    tabs.forEach(t=> t.classList.toggle('active', t.dataset.tab === tabId));
    panes.forEach(p=> p.classList.toggle('active', p.id === 'pane-' + tabId));
    if(window.lucide) window.lucide.createIcons();
  }

  function extractYouTubeId(url){
    if(!url) return null;
    const trimmed = url.trim();
    if(/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = trimmed.match(regExp);
    return match ? match[1] : null;
  }

  function renderVideo(proj){
    const wrap = document.getElementById('pm-video-wrap');
    const desc = document.getElementById('pm-video-desc');
    const pathHint = document.getElementById('pm-video-path-hint');

    pathHint.textContent = proj.videoSrc;
    desc.textContent = proj.description;

    // If project has youtubeId, embed responsive YouTube player with autoplay
    if(proj.youtubeId){
      pathHint.textContent = `https://youtu.be/${proj.youtubeId}`;
      wrap.innerHTML = `
        <iframe
          src="https://www.youtube-nocookie.com/embed/${proj.youtubeId}?autoplay=1&rel=0&modestbranding=1"
          title="${proj.name} Video Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          style="width:100%; height:100%; border:none; border-radius:12px;">
        </iframe>
      `;
      return;
    }

    // Interactive fallback with YouTube link paste bar + test local video button
    wrap.innerHTML = `
      <div class="pm-video-fallback" id="pm-video-fallback">
        <img class="pm-video-fallback-img" src="${proj.screenshots[0] ? proj.screenshots[0].src : ''}" alt="${proj.name} Preview" />
        <div class="pm-video-fallback-content">
          <div class="pm-play-bubble" title="Stream Video Demo">
            <i data-lucide="play" class="icon-lg"></i>
          </div>
          <h4 style="font-family:var(--fh); font-size:1.2rem; color:var(--fg);">${proj.name} Video Demo</h4>
          <p style="font-size:.82rem; color:var(--fg-m); line-height:1.6; max-width:440px;">
            Paste any YouTube video link below to stream instantly, or test a recorded local video file.
          </p>
          <div class="pm-yt-input-row">
            <input type="text" id="pm-yt-url-input" class="pm-yt-input" placeholder="Paste YouTube link (e.g. https://youtu.be/...)" />
            <button type="button" class="pm-yt-play-btn" id="pm-yt-play-btn">
              <i data-lucide="play-circle" class="icon-xs"></i>
              <span>Play</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const ytInput = document.getElementById('pm-yt-url-input');
    const ytBtn = document.getElementById('pm-yt-play-btn');
    function playEnteredYt(){
      const val = ytInput ? ytInput.value.trim() : '';
      const id = extractYouTubeId(val);
      if(id){
        proj.youtubeId = id;
        pathHint.textContent = `https://youtu.be/${id}`;
        wrap.innerHTML = `
          <iframe
            src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
            title="${proj.name} Video Demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="width:100%; height:100%; border:none; border-radius:12px;">
          </iframe>
        `;
      } else if(val) {
        alert('Please enter a valid YouTube link or video ID.');
      }
    }
    if(ytBtn) ytBtn.addEventListener('click', playEnteredYt);
    if(ytInput) ytInput.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') playEnteredYt(); });
  }

  function renderScreenshots(proj){
    const container = document.getElementById('pm-screens-gallery');
    if(!proj.screenshots || !proj.screenshots.length){
      container.innerHTML = `<p style="color:var(--fg-m); font-size:.85rem;">No screenshots available.</p>`;
      return;
    }

    container.innerHTML = proj.screenshots.map(s=>`
      <div class="pm-screen-card">
        <div class="pm-screen-img-wrap">
          <img src="${s.src}" alt="${s.title}" loading="lazy" />
        </div>
        <div class="pm-screen-caption">
          <div>
            <span>${proj.name}</span> · ${s.title}
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderOverview(proj){
    document.getElementById('pm-story-text').textContent = proj.architectureStory;

    const hlList = document.getElementById('pm-highlights');
    hlList.innerHTML = proj.highlights.map(h=>`
      <li>
        <i data-lucide="check-circle-2" class="icon-xs"></i>
        <span>${h}</span>
      </li>
    `).join('');

    const stackTags = document.getElementById('pm-stack-tags');
    stackTags.innerHTML = proj.tech.map(t=>{
      if(t.icon) return `<span><i class="${t.icon}"></i> ${t.name}</span>`;
      return `<span><i data-lucide="${t.iconLucide}" class="icon-xs"></i> ${t.name}</span>`;
    }).join('');

    const extLinks = document.getElementById('pm-external-links');
    extLinks.innerHTML = proj.links.map(l=>`
      <a href="${l.url}" target="_blank" rel="noopener" class="pm-ext-btn">
        <span class="pm-ext-left">
          <i data-lucide="${l.icon}" class="icon-xs"></i>
          <span>${l.label}</span>
        </span>
        <i data-lucide="arrow-up-right" class="icon-xs"></i>
      </a>
    `).join('');
  }

  function renderFooterButtons(proj){
    const container = document.getElementById('pm-footer-buttons');
    container.innerHTML = proj.links.map(l=>`
      <a href="${l.url}" target="_blank" rel="noopener" class="pm-action-btn ${l.primary ? 'pm-action-primary' : 'pm-action-secondary'}">
        <i data-lucide="${l.icon}" class="icon-xs"></i>
        <span>${l.label}</span>
      </a>
    `).join('');
  }

  function stepProject(dir){
    const idx = PROJECT_KEYS.indexOf(currentSlug);
    let nextIdx = idx + dir;
    if(nextIdx < 0) nextIdx = PROJECT_KEYS.length - 1;
    if(nextIdx >= PROJECT_KEYS.length) nextIdx = 0;
    openModal(PROJECT_KEYS[nextIdx]);
  }

  // Work item click listener
  document.querySelectorAll('.work-item[data-project]').forEach(item=>{
    item.addEventListener('click', ()=>{
      const slug = item.dataset.project;
      if(slug) openModal(slug);
    });
  });

  // Tab listeners
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=> switchTab(tab.dataset.tab));
  });

  // Close listeners
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(backdrop) backdrop.addEventListener('click', closeModal);

  // Prev / Next listeners
  if(prevBtn) prevBtn.addEventListener('click', ()=> stepProject(-1));
  if(nextBtn) nextBtn.addEventListener('click', ()=> stepProject(1));

  // Local file picker for testing recorded videos
  if(pickBtn && filePick){
    pickBtn.addEventListener('click', ()=> filePick.click());
    filePick.addEventListener('change', (e)=>{
      const file = e.target.files[0];
      if(file){
        const url = URL.createObjectURL(file);
        const wrap = document.getElementById('pm-video-wrap');
        wrap.innerHTML = `
          <video controls autoplay playsinline style="width:100%; height:100%; object-fit:contain; background:#000;">
            <source src="${url}" type="${file.type || 'video/mp4'}">
          </video>
        `;
        document.getElementById('pm-video-path-hint').textContent = `Loaded: ${file.name}`;
      }
    });
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e)=>{
    if(!modal.classList.contains('open')) return;
    if(e.key === 'Escape') closeModal();
    else if(e.key === 'ArrowLeft') stepProject(-1);
    else if(e.key === 'ArrowRight') stepProject(1);
  });

})();
