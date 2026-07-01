/* ============================================================
   MAHAMUD AL HASAN — PORTFOLIO SCRIPTS
   ============================================================ */

'use strict';

/* --------------------------------------------------------
   1. NAVBAR — sticky scroll + active link tracking
   -------------------------------------------------------- */
const navbar  = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobile-menu');
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.querySelectorAll('.nav-links a, .mobile-menu a');
const sections   = document.querySelectorAll('section[id]');

// Scrolled state
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveLink();
}, { passive: true });

// Active link tracking via Intersection Observer
function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* --------------------------------------------------------
   2. SCROLL-REVEAL — Intersection Observer
   -------------------------------------------------------- */
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* --------------------------------------------------------
   3. ANIMATED COUNTERS
   -------------------------------------------------------- */
function animateCounter(el, target, suffix = '', duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const isDecimal = target % 1 !== 0;

  const update = () => {
    start += step;
    if (start >= target) {
      el.textContent = isDecimal ? target.toFixed(1) : Math.floor(target).toLocaleString();
      el.nextElementSibling && (el.nextElementSibling.textContent = suffix);
      return;
    }
    el.textContent = isDecimal ? start.toFixed(1) : Math.floor(start).toLocaleString();
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.stat-card');
      cards.forEach(card => {
        const numEl = card.querySelector('.stat-value');
        if (numEl && !numEl.dataset.counted) {
          numEl.dataset.counted = 'true';
          const target = parseFloat(numEl.dataset.target);
          const suffix = numEl.dataset.suffix || '';
          animateCounter(numEl, target, suffix, 1800);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* --------------------------------------------------------
   4. GALLERY TABS
   -------------------------------------------------------- */
const galleryTabs = document.querySelectorAll('.gallery-tab');
const galleryPanels = document.querySelectorAll('.gallery-panel');

galleryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    galleryTabs.forEach(t => t.classList.remove('active'));
    galleryPanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const target = document.getElementById(tab.dataset.target);
    if (target) target.classList.add('active');
  });
});

/* --------------------------------------------------------
   5. HERO PARALLAX (subtle)
   -------------------------------------------------------- */
const heroBg = document.querySelector('.hero-bg-img');
if (heroBg) {
  window.addEventListener('scroll', () => {
    const offset = window.scrollY * 0.25;
    heroBg.style.transform = `scale(1) translateY(${offset}px)`;
  }, { passive: true });
}

/* --------------------------------------------------------
   6. BACK TO TOP
   -------------------------------------------------------- */
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------
   7. FORM SUBMISSION (placeholder)
   -------------------------------------------------------- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#22c55e';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}

/* --------------------------------------------------------
   8. LAZY LOAD images via loading="lazy" — handled by HTML
      This just adds a fade-in on load
   -------------------------------------------------------- */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.5s';
  if (img.complete) {
    img.style.opacity = '1';
  } else {
    img.addEventListener('load', () => { img.style.opacity = '1'; });
  }
});

/* --------------------------------------------------------
   9. Cursor glow accent (desktop only)
   -------------------------------------------------------- */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,16,46,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* --------------------------------------------------------
   10. Stagger animation for grid children
   -------------------------------------------------------- */
document.querySelectorAll('.exp-grid, .projects-grid, .extras-strip, .gallery-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.1}s`;
    child.classList.add('reveal');
    revealObserver.observe(child);
  });
});

/* --------------------------------------------------------
   11. HERO TYPEWRITER — cycling role titles
   -------------------------------------------------------- */
(function heroTypewriter() {
  const el = document.getElementById('heroTypewriter');
  if (!el) return;

  const roles = ['FILMMAKER', 'JOURNALIST', 'VISUAL STORYTELLER', 'CONTENT CREATOR'];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const TYPING_SPEED   = 90;   // ms per character (typing)
  const DELETE_SPEED   = 50;   // ms per character (deleting)
  const PAUSE_AFTER    = 1800; // ms to pause after fully typed
  const PAUSE_BEFORE   = 300;  // ms to pause before typing next

  function tick() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      // Typing forward
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        // Fully typed — pause, then start deleting
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      // Deleting
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        // Fully deleted — move to next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Small initial delay so page loads first
  setTimeout(tick, 800);
})();
