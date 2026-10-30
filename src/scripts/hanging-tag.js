import { gsap } from 'gsap';

// One entrance/exit only. The host owns repetition and content changes.
export function createEffect({ element } = {}) {
  const sway = element.querySelector('[data-sway]');
  const lift = element.querySelector('[data-lift]');
  const tag = element.querySelector('[data-tag]');
  const nodes = [sway, lift, tag];
  const styles = nodes.map(node => node.getAttribute('style'));
  const timeline = gsap.timeline({ paused: true, defaults: { ease: 'power1.inOut' } });
  timeline.set(sway, { xPercent: 30 }, 0)
    .set(lift, { yPercent: 0, y: () => -element.clientHeight }, 0)
    .set(tag, { rotation: 42 }, 0)
    .to(sway, { xPercent: -15, duration: 0.45 }, 0)
    .to(sway, { xPercent: 7, duration: 0.35 }, 0.45)
    .to(sway, { xPercent: 0, duration: 0.3 }, 0.8)
    .to(lift, { y: 0, yPercent: 12, duration: 0.45 }, 0)
    .to(lift, { yPercent: 0, duration: 0.22 }, 0.45)
    .to(lift, { yPercent: 5, duration: 0.2 }, 0.67)
    .to(lift, { yPercent: 0, duration: 0.23 }, 0.87)
    .to(tag, { rotation: -15, duration: 0.45 }, 0)
    .to(tag, { rotation: 7, duration: 0.35 }, 0.45)
    .to(tag, { rotation: 0, duration: 0.3 }, 0.8)
    .addLabel('rest', 1.1)
    .to(lift, { yPercent: 16, duration: 0.25 }, 1.55)
    .to(lift, { y: () => -element.clientHeight, yPercent: 0, duration: 0.5, ease: 'power2.in' }, 1.8);
  return { timeline, destroy() { timeline.kill(); nodes.forEach((node, i) => styles[i] === null ? node.removeAttribute('style') : node.setAttribute('style', styles[i])); } };
}
