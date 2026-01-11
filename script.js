'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};


class Navigation {
  constructor() {
    this.navbar = $('#navbar');
    this.mobileNav = $('#mobileNav');
    this.navToggle = $('#navToggle');
    this.navMenu = $('#navMenu');
    this.navLinks = $$('.nav-link');
    this.sections = $$('section[id]');

    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupActiveLink();
  }

  setupScrollEffect() {
    const handleScroll = throttle(() => {
      if (window.scrollY > 100) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    }, 100);

    window.addEventListener('scroll', handleScroll);
  }

  setupMobileMenu() {
    this.navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navToggle.classList.toggle('active');
      this.navMenu.classList.toggle('hidden');
      const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
      this.navToggle.setAttribute('aria-expanded', !isExpanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mobileNav && !this.mobileNav.contains(e.target) && !this.navMenu.classList.contains('hidden')) {
        this.closeMenu();
      }
    });

    // Close menu when clicking a link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
  }

  closeMenu() {
    this.navToggle.classList.remove('active');
    this.navMenu.classList.add('hidden');
    this.navToggle.setAttribute('aria-expanded', 'false');
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = $(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupActiveLink() {
    let ticking = false;

    const updateActiveLink = () => {
      const scrollY = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      let currentSection = null;

      // Check if user has scrolled to the bottom of the page
      const isAtBottom = scrollY + windowHeight >= documentHeight - 50;

      if (isAtBottom && this.sections.length > 0) {
        // If at bottom, activate the last section
        currentSection = this.sections[this.sections.length - 1].getAttribute('id');
      } else {
        // Find the current section based on scroll position
        this.sections.forEach(section => {
          const sectionTop = section.offsetTop - 150;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollY >= sectionTop && scrollY < sectionBottom) {
            currentSection = section.getAttribute('id');
          }
        });
      }

      // Update active class only if section changed
      if (currentSection) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
          }
        });
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveLink);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set active state on page load
    updateActiveLink();
  }
}

class TypewriterEffect {
  constructor() {
    this.typingText = $('.hero-subtitle');
    this.titles = [
      'a Software Engineer.',
      'a problem solver.',
      'a team player.'
    ];
    this.titleIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.typingSpeed = 100;

    if (this.typingText) {
      this.init();
    }
  }

  init() {
    // Add cursor element if it doesn't exist
    const cursor = this.typingText.querySelector('.cursor');
    if (!cursor) {
      const cursorSpan = document.createElement('span');
      cursorSpan.className = 'cursor animate-blink';
      cursorSpan.textContent = '|';
      this.typingText.appendChild(cursorSpan);
    }

    // Start typing after a short delay
    setTimeout(() => this.typeText(), 1000);
  }

  typeText() {
    const currentTitle = this.titles[this.titleIndex];
    const cursor = this.typingText.querySelector('.cursor');

    if (!this.isDeleting) {
      // Typing
      const textNode = this.typingText.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = currentTitle.substring(0, this.charIndex + 1);
      } else {
        this.typingText.insertBefore(
          document.createTextNode(currentTitle.substring(0, this.charIndex + 1)),
          cursor
        );
      }

      this.charIndex++;
      this.typingSpeed = 100;

      if (this.charIndex === currentTitle.length) {
        // Pause at end
        this.typingSpeed = 2000;
        this.isDeleting = true;
      }
    } else {
      // Deleting
      const textNode = this.typingText.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = currentTitle.substring(0, this.charIndex - 1);
      }

      this.charIndex--;
      this.typingSpeed = 50;

      if (this.charIndex === 1) {
        this.isDeleting = false;
        this.titleIndex = (this.titleIndex + 1) % this.titles.length;
        this.typingSpeed = 500;
      }
    }

    setTimeout(() => this.typeText(), this.typingSpeed);
  }
}

class ScrollAnimations {
  constructor() {
    this.animatedElements = $$('[class*="animate-fade"]');
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    }
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.style.animationDelay || '0s';

          // Trigger animation
          setTimeout(() => {
            element.style.animationPlayState = 'running';
            element.style.opacity = '1';
          }, parseFloat(delay) * 1000);

          observer.unobserve(element);
        }
      });
    }, this.observerOptions);

    this.animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }
}

class ProjectsFilter {
  constructor() {
    this.filterButtons = $$('.filter-btn');
    this.projectCards = $$('.project-card');

    if (this.filterButtons.length > 0) {
      this.init();
    }
  }

  init() {
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.filterProjects(filter);
        this.updateActiveButton(btn);
      });
    });
  }

  filterProjects(filter) {
    this.projectCards.forEach(card => {
      const category = card.dataset.category;

      if (filter === 'all' || category === filter) {
        card.classList.remove('hide');
        card.style.display = 'block';
      } else {
        card.classList.add('hide');
        setTimeout(() => {
          if (card.classList.contains('hide')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  }

  updateActiveButton(activeBtn) {
    this.filterButtons.forEach(btn => {
      btn.classList.remove('active', 'bg-gradient-to-r', 'from-primary-500', 'to-secondary-500', 'text-white');
      btn.classList.add('bg-slate-200', 'text-slate-700');
    });

    activeBtn.classList.add('active', 'bg-gradient-to-r', 'from-primary-500', 'to-secondary-500', 'text-white');
    activeBtn.classList.remove('bg-slate-200', 'text-slate-700');
  }
}


class ParallaxEffects {
  constructor() {
    this.parallaxElements = $$('.animate-float');

    if (this.parallaxElements.length > 0 && window.innerWidth > 768) {
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', throttle(() => {
      const scrolled = window.pageYOffset;

      this.parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.05;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }, 10));
  }
}


class KeyboardNavigation {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('keydown', (e) => {
      // ESC key closes mobile menu
      if (e.key === 'Escape') {
        const navMenu = $('#navMenu');
        const navToggle = $('#navToggle');
        if (!navMenu.classList.contains('hidden')) {
          navToggle.classList.remove('active');
          navMenu.classList.add('hidden');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }
}


class PerformanceOptimiser {
  constructor() {
    this.init();
  }

  init() {
    this.lazyLoadImages();
  }

  lazyLoadImages() {
    if ('loading' in HTMLImageElement.prototype) {
      const images = $$('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
      });
    } else {
      // Fallback for older browsers
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.dataset.src || img.src;
              imageObserver.unobserve(img);
            }
          });
        });

        $$('img').forEach(img => imageObserver.observe(img));
      }
    }
  }
}


class App {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    new Navigation();
    new TypewriterEffect();
    new ScrollAnimations();

    new ProjectsFilter();

    new ParallaxEffects();
    new KeyboardNavigation();

    new PerformanceOptimiser();

    document.body.classList.add('loaded');
  }
}

new App();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, Navigation, TypewriterEffect, ScrollAnimations };
}
