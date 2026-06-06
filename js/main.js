/* ============================================================
   RODINA SOFTWARE — 2026 JS
   Animations, scroll effects, canvas, interactions
============================================================ */

// ===== LUCIDE ICONS =====
lucide.createIcons();

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = -1000, mouseY = -1000;
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorGlow.style.left = mouseX + 'px';
  cursorGlow.style.top = mouseY + 'px';
});

// ===== BACKGROUND CANVAS ORBS =====
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
let bgW, bgH;

const orbs = [
  { x: 0.2, y: 0.2, r: 350, color: 'rgba(108,99,255,0.18)', vx: 0.0003, vy: 0.0002 },
  { x: 0.8, y: 0.7, r: 300, color: 'rgba(167,139,250,0.14)', vx: -0.0002, vy: 0.0003 },
  { x: 0.5, y: 0.5, r: 250, color: 'rgba(56,189,248,0.1)', vx: 0.0002, vy: -0.0002 },
  { x: 0.1, y: 0.8, r: 200, color: 'rgba(108,99,255,0.1)', vx: 0.0004, vy: -0.0003 },
];

function resizeBgCanvas() {
  bgW = bgCanvas.width = window.innerWidth;
  bgH = bgCanvas.height = window.innerHeight;
}
resizeBgCanvas();
window.addEventListener('resize', resizeBgCanvas);

let orbT = 0;
function drawBg() {
  bgCtx.clearRect(0, 0, bgW, bgH);
  orbT += 0.5;
  orbs.forEach((o) => {
    const x = (Math.sin(orbT * o.vx * 1000) * 0.15 + o.x) * bgW;
    const y = (Math.cos(orbT * o.vy * 1000) * 0.15 + o.y) * bgH;
    const grad = bgCtx.createRadialGradient(x, y, 0, x, y, o.r);
    grad.addColorStop(0, o.color);
    grad.addColorStop(1, 'transparent');
    bgCtx.beginPath();
    bgCtx.arc(x, y, o.r, 0, Math.PI * 2);
    bgCtx.fillStyle = grad;
    bgCtx.fill();
  });
  requestAnimationFrame(drawBg);
}
drawBg();

// ===== FLOATING PARTICLES =====
const particlesContainer = document.getElementById('heroParticles');
const PARTICLE_COUNT = 60;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('div');
  const size = Math.random() * 3 + 1;
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const delay = Math.random() * 8;
  const duration = Math.random() * 10 + 8;
  const opacity = Math.random() * 0.4 + 0.05;
  p.style.cssText = `
    position:absolute;
    left:${x}%;
    top:${y}%;
    width:${size}px;
    height:${size}px;
    background:rgba(108,99,255,${opacity});
    border-radius:50%;
    animation:particleFloat ${duration}s ${delay}s ease-in-out infinite alternate;
    pointer-events:none;
  `;
  particlesContainer.appendChild(p);
}

const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes particleFloat {
    0% { transform: translateY(0) translateX(0); opacity: 0.05; }
    50% { opacity: 0.4; }
    100% { transform: translateY(-60px) translateX(20px); opacity: 0.05; }
  }
`;
document.head.appendChild(styleEl);

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
let menuOpen = false;

function toggleMenu(open) {
  menuOpen = open;
  mobileMenu.classList.toggle('open', open);
  hamburger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
  const spans = hamburger.querySelectorAll('span');
  if (open) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
}
hamburger.addEventListener('click', () => toggleMenu(!menuOpen));
mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revealObserver.observe(el));

// ===== STAGGERED CHILDREN =====
const staggerGroups = document.querySelectorAll('.portal-grid, .why-grid, .industries-grid, .features-grid, .discussions-grid');
staggerGroups.forEach(group => {
  const children = group.querySelectorAll('.reveal');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.08}s`;
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  const isDecimal = target.toString().includes('.');
  const num = parseFloat(target);
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = num * ease;
    el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const text = el.textContent.trim();
      const numMatch = text.match(/([\d.]+)/);
      if (numMatch) {
        const suffix = text.replace(numMatch[0], '');
        animateCounter(el, numMatch[1], suffix);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

// ===== PARALLAX ON HERO VISUAL =====
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroVisual.style.transform = `translateY(${scrolled * 0.06}px)`;
  }, { passive: true });
}

// ===== TILT EFFECT ON CARDS =====
const tiltCards = document.querySelectorAll('.portal-card, .industry-card, .discussion-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ===== SMOOTH ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });

// ===== FORM SUBMIT =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '&#10003; Request Sent! We will be in touch.';
      btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 4000);
    }, 1200);
  });
}

// ===== GRID LINE BG ON SECTION HOVER =====
const whyItems = document.querySelectorAll('.why-item');
whyItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.background = 'rgba(108,99,255,0.06)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.background = '';
  });
});