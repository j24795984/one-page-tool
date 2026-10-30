import { gsap } from 'gsap';
export function createEffect({ element } = {}) {
  const layer = element.querySelector('[data-invert]');
  const original = layer.getAttribute('style');
  const timeline = gsap.timeline({ paused: true }).fromTo(layer,
    { clipPath: 'polygon(-30% 0, -10% 0, -30% 100%, -50% 100%)' },
    { clipPath: 'polygon(-30% 0, 150% 0, 130% 100%, -50% 100%)', duration: 3.4, ease: 'power1.inOut' });
  return { timeline, destroy() { timeline.kill(); if (original === null) layer.removeAttribute('style'); else layer.setAttribute('style', original); } };
}
