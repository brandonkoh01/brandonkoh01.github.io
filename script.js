'use strict';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

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
    this.navLinks = $$('.nav-link');
    this.sections = $$('section[id]');

    this.init();
  }

  init() {
    this.setupScrollEffect();
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
      'a Mobile Developer.',
      'an AI enthusiast.',
      'a team player.',
      'a problem solver.',
    ];
    this.titleIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;

    if (this.typingText) {
      this.init();
    }
  }

  getTypingDelay() {
    const baseDelay = 80;
    const variance = 40;
    return baseDelay + Math.random() * variance;
  }

  getDeletingDelay() {
    const baseDelay = 35;
    const variance = 20;
    return baseDelay + Math.random() * variance;
  }

  init() {
    const cursor = this.typingText.querySelector('.cursor');
    if (!cursor) {
      const cursorSpan = document.createElement('span');
      cursorSpan.className = 'cursor animate-blink';
      cursorSpan.textContent = '|';
      this.typingText.appendChild(cursorSpan);
    }

    setTimeout(() => this.typeText(), 800);
  }

  typeText() {
    const currentTitle = this.titles[this.titleIndex];
    const cursor = this.typingText.querySelector('.cursor');
    let delay;

    if (!this.isDeleting) {
      // Typing
      const textNode = this.typingText.firstChild;
      const newText = currentTitle.substring(0, this.charIndex + 1);

      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = newText;
      } else {
        this.typingText.insertBefore(document.createTextNode(newText), cursor);
      }

      this.charIndex++;
      delay = this.getTypingDelay();

      const lastChar = newText.slice(-1);
      if ([',', '.', '!', '?'].includes(lastChar)) {
        delay += 150;
      }

      if (this.charIndex === currentTitle.length) {
        delay = 2500; 
        this.isDeleting = true;
      }
    } else {
      // Deleting
      const textNode = this.typingText.firstChild;
      if (textNode && textNode.nodeType === Node.TEXT_NODE) {
        textNode.textContent = currentTitle.substring(0, this.charIndex - 1);
      }

      this.charIndex--;
      delay = this.getDeletingDelay();

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.titleIndex = (this.titleIndex + 1) % this.titles.length;
        delay = 400; 
      }
    }

    setTimeout(() => this.typeText(), delay);
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

    new PerformanceOptimiser();

    document.body.classList.add('loaded');
  }
}

new App();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, Navigation, TypewriterEffect, ScrollAnimations };
}
