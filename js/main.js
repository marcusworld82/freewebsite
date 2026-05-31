// === LUCIDE ICONS ===
lucide.createIcons();

// === NAV SCROLL STATE ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// === MOBILE MENU ===
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============================================================
// HERO CANVAS — Particle Grid + Meteor Streaks
// ============================================================
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, meteors, animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.2 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.02;
      this.alpha = 0.15 + Math.abs(Math.sin(this.pulse)) * 0.35;
      if (this.y < -10) this.reset(false);
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249,115,22,${this.alpha})`;
      ctx.fill();
    }
  }

  class Meteor {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W * 1.5;
      this.y = -40;
      this.len = Math.random() * 120 + 60;
      this.speed = Math.random() * 6 + 4;
      this.angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.2;
      this.width = Math.random() * 1.5 + 0.5;
      this.active = false;
      this.timer = Math.random() * 300 + 100;
    }
    update() {
      if (!this.active) {
        this.timer--;
        if (this.timer <= 0) this.active = true;
        return;
      }
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= 0.008;
      if (this.alpha <= 0 || this.y > H + 40) this.reset();
    }
    draw() {
      if (!this.active || this.alpha <= 0) return;
      const tx = this.x - Math.cos(this.angle) * this.len;
      const ty = this.y - Math.sin(this.angle) * this.len;
      const grad = ctx.createLinearGradient(tx, ty, this.x, this.y);
      grad.addColorStop(0, `rgba(249,115,22,0)`);
      grad.addColorStop(1, `rgba(251,191,36,${this.alpha})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.width;
      ctx.stroke();
    }
  }

  function drawGrid() {
    const spacing = 60;
    ctx.strokeStyle = 'rgba(249,115,22,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 120 }, () => new Particle());
    meteors = Array.from({ length: 6 }, () => new Meteor());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    // connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(249,115,22,${0.06 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    meteors.forEach(m => { m.update(); m.draw(); });
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init();
  loop();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
})();

// ============================================================
// FLOATING BACKGROUND ORBS (sections below hero)
// ============================================================
(function initOrbs() {
  const canvas = document.getElementById('orbCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, orbs, animId;

  function resize() {
    W = canvas.width = document.body.scrollWidth;
    H = canvas.height = document.body.scrollHeight;
  }

  class Orb {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * (W || window.innerWidth);
      this.y = Math.random() * (H || document.body.scrollHeight);
      this.r = Math.random() * 220 + 80;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = (Math.random() - 0.5) * 0.18;
      this.alpha = Math.random() * 0.07 + 0.02;
      this.hue = Math.random() > 0.6 ? '249,115,22' : '251,191,36';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -this.r) this.x = W + this.r;
      if (this.x > W + this.r) this.x = -this.r;
      if (this.y < -this.r) this.y = H + this.r;
      if (this.y > H + this.r) this.y = -this.r;
    }
    draw() {
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
      g.addColorStop(0, `rgba(${this.hue},${this.alpha})`);
      g.addColorStop(1, `rgba(${this.hue},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  function init() {
    resize();
    orbs = Array.from({ length: 14 }, () => new Orb());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    orbs.forEach(o => { o.update(); o.draw(); });
    animId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    clearTimeout(window._orbResizeTimer);
    window._orbResizeTimer = setTimeout(() => { resize(); orbs.forEach(o => o.init()); }, 300);
  }, { passive: true });

  init();
  loop();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
})();

// ============================================================
// SECTION SLIDE TRANSITIONS
// ============================================================
(function initSectionTransitions() {
  // Each section slides in from a direction as it enters the viewport
  const slideMap = [
    { selector: '.trust-bar',          dir: 'up' },
    { selector: '#services',           dir: 'up' },
    { selector: '.about-section',      dir: 'left' },
    { selector: '.process-section',    dir: 'up' },
    { selector: '.credentials-section',dir: 'right' },
    { selector: '.financing-section',  dir: 'left' },
    { selector: '.reviews-section',    dir: 'up' },
    { selector: '.area-section',       dir: 'right' },
    { selector: '.contact-section',    dir: 'up' },
  ];

  const dirMap = {
    up:    'translateY(60px)',
    down:  'translateY(-60px)',
    left:  'translateX(-60px)',
    right: 'translateX(60px)',
  };

  slideMap.forEach(({ selector, dir }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.transition = 'opacity 0.85s cubic-bezier(0.4,0,0.2,1), transform 0.85s cubic-bezier(0.4,0,0.2,1)';
    el.style.opacity = '0';
    el.style.transform = dirMap[dir];
    el.style.willChange = 'opacity, transform';

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translate(0,0)';
          });
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.08 });

    obs.observe(el);
  });
})();

// ============================================================
// HERO PARALLAX
// ============================================================
(function initParallax() {
  const heroImg = document.querySelector('.hero-img');
  const heroCanvas = document.getElementById('heroCanvas');
  if (!heroImg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        heroImg.style.transform = `scale(1) translateY(${y * 0.25}px)`;
        if (heroCanvas) heroCanvas.style.transform = `translateY(${y * 0.1}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ============================================================
// SMOOTH ANCHOR SCROLL WITH SLIDE OUT
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ============================================================
// SCROLL REVEAL (cards & inline elements)
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const group = entry.target.closest('.services-grid, .reviews-grid, .process-grid, .counties-grid, .trust-grid, .about-list, .financing-features, .creds-grid');
      if (group) {
        const all = group.querySelectorAll('.reveal');
        all.forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 90);
        });
        all.forEach(el => revealObserver.unobserve(el));
      } else {
        setTimeout(() => entry.target.classList.add('visible'), 60);
        revealObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Hero reveal on load
const heroItems = document.querySelectorAll('.hero .reveal');
heroItems.forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 200 + i * 160);
});

// ============================================================
// ACTIVE NAV LINK
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => sectionObserver.observe(s));

// ============================================================
// FORM SUBMIT STATE
// ============================================================
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', () => {
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
  });
}

// ============================================================
// CURSOR GLOW (desktop only)
// ============================================================
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let mx = -200, my = -200, cx = -200, cy = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  function animGlow() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.transform = `translate(${cx - 150}px, ${cy - 150}px)`;
    requestAnimationFrame(animGlow);
  }
  animGlow();
  document.querySelectorAll('.btn, .service-card, .review-card, .nav-links a').forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('active'));
    el.addEventListener('mouseleave', () => glow.classList.remove('active'));
  });
})();
