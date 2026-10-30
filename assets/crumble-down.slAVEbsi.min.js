import { gsap } from 'gsap';
export function createEffect({ element } = {}) {
  const original = element.innerHTML;
  const label = element.getAttribute('aria-label');
  const text = element.textContent;
  const chars = Array.from(text).map((char) => { const span = document.createElement('span'); span.className = 'text-motion__char'; span.textContent = char; span.setAttribute('aria-hidden', 'true'); return span; });
  element.replaceChildren(...chars);
  element.setAttribute('aria-label', text);
  const timeline = gsap.timeline({ paused: true });
  timeline.to(chars, { rotation: i => i % 2 ? 7 : -7, duration: 0.25, stagger: 0.055 })
    .to(chars, { y: '2.4em', x: i => `${(i % 3 - 1) * 0.35}em`, rotation: i => i % 2 ? 55 : -45, opacity: 0, duration: 0.75, stagger: 0.09, ease: 'power2.in' }, 0.3);
  return { timeline, destroy() { timeline.kill(); element.innerHTML = original; if (label === null) element.removeAttribute('aria-label'); else element.setAttribute('aria-label', label); } };
}
