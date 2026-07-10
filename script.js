const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-links');
const topbar = document.querySelector('.topbar');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const backToTop = document.querySelector('.back-to-top');
const revealElements = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('section[id]');

const isTouchDevice = () =>
  window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
  window.matchMedia('(max-width: 640px)').matches;

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
};

const updateTopbarOnScroll = () => {
  if (!topbar) return;
  topbar.classList.toggle('scrolled', window.scrollY > 32);
};

const updateBackToTop = () => {
  if (!backToTop) return;
  backToTop.classList.toggle('visible', window.scrollY > 500);
};

const updateActiveOnScroll = () => {
  const offset = window.scrollY + window.innerHeight * 0.35;
  let currentId = sections[0]?.id || '';
  sections.forEach((section) => {
    if (section.offsetTop <= offset) {
      currentId = section.id;
    }
  });
  setActiveLink(currentId);
};

const closeMobileMenu = () => {
  navMenu?.classList.remove('open');
  mobileMenuToggle?.classList.remove('open');
  topbar?.classList.remove('menu-open');
  mobileMenuToggle?.setAttribute('aria-expanded', 'false');
};

const handleScroll = () => {
  updateActiveOnScroll();
  updateTopbarOnScroll();
  updateBackToTop();
};

window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('resize', updateActiveOnScroll);
handleScroll();

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    setActiveLink(link.getAttribute('href').slice(1));
    closeMobileMenu();
  });
});

if (mobileMenuToggle && navMenu && topbar) {
  mobileMenuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    mobileMenuToggle.classList.toggle('open', isOpen);
    topbar.classList.toggle('menu-open', isOpen);
    mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.addEventListener('click', (event) => {
  if (!topbar?.classList.contains('menu-open')) return;
  if (!topbar.contains(event.target)) {
    closeMobileMenu();
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

if (!isTouchDevice() && cursorDot && cursorOutline) {
  document.body.classList.add('has-custom-cursor');

  const setCursorPosition = (x, y) => {
    cursorDot.style.left = `${x}px`;
    cursorDot.style.top = `${y}px`;
    cursorOutline.style.left = `${x}px`;
    cursorOutline.style.top = `${y}px`;
  };

  document.addEventListener('mousemove', (event) => {
    setCursorPosition(event.clientX, event.clientY);
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
  });

  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('cursor-hover');
    });
    element.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('cursor-hover');
    });
  });
} else {
  document.querySelectorAll('.cursor').forEach((el) => el.remove());
}
