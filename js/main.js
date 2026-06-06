/* ============================================================
   RODINA SOFTWARE — 2026 JS
   Animations, scroll effects, interactions
============================================================ */

// ===== LUCIDE ICONS =====
lucide.createIcons();

// ===== CURSOR GLOW =====
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');
let menuOpen = false;
function toggleMenu(open) {
  menuOpen = open;
  mobileMenu.classList.toggle('open', open);
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

// ===== STAGGER CHILDREN =====
const staggerGroups = document.querySelectorAll(
  '.portal-feature-copy, .why-grid, .industries-grid, .features-grid, .discussions-grid, .trust-grid, .contact-features'
);
staggerGroups.forEach(group => {
  group.querySelectorAll('.reveal').forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.09}s`;
  });
});

// ===== COUNTER ANIMATION =====
function animateCount(el, target, suffix) {
  const num = parseFloat(target);
  const dur = 1800;
  const start = performance.now();
  function update(now) {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = (Number.isInteger(num) ? Math.round(num * ease) : (num * ease).toFixed(1)) + suffix;
    if (t < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
const statNums = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const text = el.textContent.trim();
      const match = text.match(/([\d.]+)/);
      if (match) animateCount(el, match[1], text.replace(match[0], ''));
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObs.observe(el));

// ===== PARALLAX HERO BG =====
const heroBg = document.querySelector('.hero-bg img');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  }, { passive: true });
}

// ===== TILT ON CARDS =====
document.querySelectorAll('.industry-card, .discussion-card, .why-item').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    card.style.transform = `translateY(-6px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
  });
});

// ===== ACTIVE NAV =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
}, { passive: true });

// ===== FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '&#10003; Request Sent! We will be in touch.';
      btn.style.background = '#15803d';
      setTimeout(() => {
        btn.innerHTML = orig;
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
        lucide.createIcons();
      }, 4000);
    }, 1200);
  });
}