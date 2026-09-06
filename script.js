// ============================================================
// V2 BOLD EDITORIAL - JavaScript
// ============================================================

// ============================================================
// Language Toggle & Bilingual Content Management
// ============================================================

const langToggle = document.getElementById('langToggle');
const htmlElement = document.documentElement;
let currentLang = localStorage.getItem('lang') || 'es';

function initLanguage() {
  htmlElement.lang = currentLang;
  document.body.lang = currentLang;
  updateContent();
  updateLanguageToggle();
}

if (langToggle) langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  htmlElement.lang = currentLang;
  document.body.lang = currentLang;
  localStorage.setItem('lang', currentLang);
  updateContent();
  updateLanguageToggle();
});

function updateContent() {
  const elements = document.querySelectorAll('[data-es]');
  elements.forEach(el => {
    const content = currentLang === 'es' ? el.dataset.es : el.dataset.en;
    if (el.tagName === 'A' || el.tagName === 'BUTTON') {
      el.textContent = content;
    } else if (el.textContent === el.dataset.es || el.textContent === el.dataset.en || el.textContent === '') {
      el.textContent = content;
    } else {
      el.textContent = content;
    }
  });

  // Toggle paired language spans (pages that keep real text in the HTML)
  document.querySelectorAll('.es-only').forEach(el => {
    el.style.display = currentLang === 'es' ? '' : 'none';
  });
  document.querySelectorAll('.en-only').forEach(el => {
    el.style.display = currentLang === 'en' ? '' : 'none';
  });

  // Swap language-specific images
  document.querySelectorAll('[data-src-es]').forEach(img => {
    img.src = currentLang === 'es' ? img.dataset.srcEs : img.dataset.srcEn;
  });

  // Alt text can change on its own (a single image used in both languages)
  document.querySelectorAll('[data-alt-es]').forEach(img => {
    img.alt = currentLang === 'es' ? img.dataset.altEs : img.dataset.altEn;
  });

  // Update education timeline image based on language
  const timelineImg = document.getElementById('educationTimelineImg');
  if (timelineImg) {
    timelineImg.src = currentLang === 'es' ? 'assets/timeline_es.png' : 'assets/timeline_en.png';
    timelineImg.alt = currentLang === 'es' ? 'Formación Académica' : 'Formal Education';
  }
}

function updateLanguageToggle() {
  const langEs = document.querySelector('.lang-es');
  const langEn = document.querySelector('.lang-en');
  if (!langEs || !langEn) return;
  if (currentLang === 'es') {
    langEs.style.display = 'none';
    langEn.style.display = 'inline';
  } else {
    langEs.style.display = 'inline';
    langEn.style.display = 'none';
  }
}

// ============================================================
// Navigation - Floating Pill Shrink on Scroll
// ============================================================

const navbar = document.getElementById('navbar');

if (navbar) window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    navbar.classList.add('shrink');
  } else {
    navbar.classList.remove('shrink');
  }
});

// ============================================================
// Navigation & Smooth Scroll
// ============================================================

const navLinks = document.querySelectorAll('.nav-link');
const btnPatients = document.getElementById('btnPatients');
const btnAcademia = document.getElementById('btnAcademia');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    // Only intercept in-page anchors; let cross-page links (index.html#x) navigate.
    if (!targetId || !targetId.startsWith('#')) return;
    e.preventDefault();
    smoothScroll(targetId);
  });
});

if (btnPatients) btnPatients.addEventListener('click', () => {
  smoothScroll('#pacientes');
});

if (btnAcademia) btnAcademia.addEventListener('click', () => {
  smoothScroll('#academia');
});

function smoothScroll(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (target) {
    const headerOffset = 120;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// ============================================================
// Marquee Animation - Duplicate Content
// ============================================================

function initMarquee() {
  const marqueeContent = document.getElementById('marqueeContent');
  if (!marqueeContent) return;

  // Get all span elements
  const items = marqueeContent.querySelectorAll('span');

  // Clone all items to create seamless loop
  items.forEach(item => {
    const clone = item.cloneNode(true);
    marqueeContent.appendChild(clone);
  });
}

// ============================================================
// Scroll Reveal Animation
// ============================================================

const observerOptions = {
  threshold: 0.08,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = entry.target.dataset.initialTransform || 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

function initScrollReveal() {
  const animateElements = document.querySelectorAll(
    '.condition-card, .clinic-card, .book-card, .metric-band, .publication-item, .role-card, .trajectory-dot, .badge, .about-content'
  );

  animateElements.forEach((el, index) => {
    el.style.opacity = '0';

    // Store initial transform based on element type
    if (el.classList.contains('book-card')) {
      const bookNum = parseInt(el.classList[1]?.replace('book-', '')) || 1;
      const rotations = [-3, -1, 0, 1, 3];
      el.dataset.initialTransform = `translateY(-10px) rotate(0deg) scale(1.05)`;
    } else if (el.classList.contains('timeline-item')) {
      el.dataset.initialTransform = 'translateY(0)';
    } else {
      el.dataset.initialTransform = 'translateY(0)';
    }

    el.style.transform = el.getAttribute('data-initial-transform') || 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ============================================================
// Email Contact Links (replaced WhatsApp)
// ============================================================
// Email links use mailto: with pre-filled subject and body.
// Language toggle doesn't require dynamic updates for mailto links.

// ============================================================
// Keyboard Accessibility
// ============================================================

const interactiveElements = document.querySelectorAll('a, button');
interactiveElements.forEach(el => {
  el.addEventListener('focus', () => {
    el.style.outline = '2px solid #2a7f8f';
    el.style.outlineOffset = '2px';
  });

  el.addEventListener('blur', () => {
    el.style.outline = 'none';
  });
});

// ============================================================
// Initialization
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initMarquee();
  initScrollReveal();

  console.log('V2 Bold Editorial - Language:', currentLang);
  console.log('Bilingual content system active');
  console.log('Marquee, scroll reveal, and animations initialized');
});
