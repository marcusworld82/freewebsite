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

// === SCROLL REVEAL ===
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const siblings = entry.target.closest('.services-grid, .reviews-grid, .process-grid, .counties-grid, .trust-grid, .about-list, .financing-features');
      if (siblings) {
        const all = siblings.querySelectorAll('.reveal');
        all.forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 80);
        });
        all.forEach(el => revealObserver.unobserve(el));
      } else {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 60);
        revealObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// === HERO STAGGER ON LOAD ===
const heroItems = document.querySelectorAll('.hero .reveal');
heroItems.forEach((el, i) => {
  setTimeout(() => el.classList.add('visible'), 200 + i * 150);
});

// === ACTIVE NAV LINK ON SCROLL ===
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
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));

// === FORM SUBMIT ===
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
  });
}
