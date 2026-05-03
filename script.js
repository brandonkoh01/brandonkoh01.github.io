'use strict';

const $$ = (selector) => document.querySelectorAll(selector);
const prefersReducedMotion = () => (
  typeof window !== 'undefined'
  && typeof window.matchMedia === 'function'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

class ScrollAnimations {
  constructor() {
    this.animatedElements = $$('.reveal-on-scroll');
    this.observerOptions = {
      threshold: 0.18,
      rootMargin: '0px 0px -12% 0px'
    };

    this.init();
  }

  init() {
    if (this.animatedElements.length === 0) {
      return;
    }

    this.prepareStagger();

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      this.animatedElements.forEach(element => element.classList.add('is-visible', 'has-settled'));
      return;
    }

    this.setupObserver();
  }

  prepareStagger() {
    this.animatedElements.forEach(section => {
      const label = section.querySelector('.section-label');
      const content = section.querySelector('.section-content');
      const staggeredItems = section.querySelectorAll('.skill-group, .timeline-item, .project-item');

      if (label) {
        label.style.setProperty('--reveal-delay', '0ms');
      }

      if (content) {
        content.style.setProperty('--reveal-delay', '90ms');
      }

      staggeredItems.forEach((item, index) => {
        item.style.setProperty('--reveal-delay', `${160 + index * 70}ms`);
      });
    });
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          window.setTimeout(() => {
            entry.target.classList.add('has-settled');
          }, this.getSettleDelay(entry.target));
          observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    this.animatedElements.forEach(element => observer.observe(element));
  }

  getSettleDelay(section) {
    const staggeredItemCount = section.querySelectorAll('.skill-group, .timeline-item, .project-item').length;
    const lastStaggerDelay = staggeredItemCount > 0 ? 160 + (staggeredItemCount - 1) * 70 : 90;

    return lastStaggerDelay + 700;
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
    document.documentElement.classList.add('motion-ready');

    new ScrollAnimations();
  }
}

new App();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, ScrollAnimations };
}
