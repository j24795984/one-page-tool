import { gsap } from 'gsap';
export function createEffect({ element } = {}) {
  const original = element.innerHTML;
  const label = element.getAttribute('aria-label');
  const text = element.textContent;
  const chars = Array.from(text).map(char => { const span = document.createElement('span'); span.className = 'text-motion__char'; span.textContent = char; span.setAttribute('aria-hidden', 'true'); return span; });
  element.replaceChildren(...chars);
  element.setAttribute('aria-label', text);
  const timeline = gsap.timeline({ paused: true });
  chars.forEach((char, index) => {
    timeline.to(char, { scaleY: 1.7, scaleX: 0.75, duration: 0.3, ease: 'power2.out' }, index * 0.12)
      .to(char, { scaleY: 1, scaleX: 1, duration: 0.52, ease: 'elastic.out(1,0.35)' }, index * 0.12 + 0.3);
  });
  return { timeline, destroy() { timeline.kill(); element.innerHTML = original; if (label === null) element.removeAttribute('aria-label'); else element.setAttribute('aria-label', label); } };
}
