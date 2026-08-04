import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const defaults = {
  targets: '.luxy-el',
  targetSpeed: 0.02,
  scrub: true
};

class GsapParallax {
  constructor() {
    this.elements = [];
    this.tweens = [];
    this.initialized = false;
  }

  init({
    root = document,
    scroller = null,
    ...options
  } = {}) {
    this.destroy();
    this.settings = { ...defaults, ...options };
    this.root = root;
    this.scroller = scroller;
    this.elements = [...root.querySelectorAll(this.settings.targets)];

    if (!this.elements.length) return false;

    this.setupParallax();
    this.initialized = true;
    ScrollTrigger.refresh();
    return true;
  }

  setupParallax() {
    const scrollSource = this.scroller || window;
    const trigger = this.scroller ? this.root : document.body;

    this.tweens = this.elements.map((element) => {
      const speedY = parseFloat(element.getAttribute('data-speed-y')) || 1;
      const offset = parseFloat(element.getAttribute('data-offset')) || 0;

      gsap.set(element, { y: offset });

      return gsap.to(element, {
        y: () => (
          ScrollTrigger.maxScroll(scrollSource)
          * this.settings.targetSpeed
          * speedY
        ) + offset,
        ease: 'none',
        scrollTrigger: {
          trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: this.settings.scrub,
          scroller: this.scroller || undefined,
          invalidateOnRefresh: true
        }
      });
    });
  }

  refresh() {
    if (this.initialized) ScrollTrigger.refresh();
  }

  destroy() {
    this.tweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });

    if (this.elements.length) {
      gsap.set(this.elements, { clearProps: 'transform' });
    }

    this.elements = [];
    this.tweens = [];
    this.initialized = false;
  }
}

const parallax = new GsapParallax();

export { parallax };
