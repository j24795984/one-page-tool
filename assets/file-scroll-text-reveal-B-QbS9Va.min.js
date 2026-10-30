import { gsap } from 'gsap';
export function createEffect({ element, scroller } = {}) {
  const original = element.innerHTML;
  const label = element.getAttribute('aria-label');
  const text = element.textContent;
  const chars = Array.from(text).map(char => { const span = document.createElement('span'); span.className = 'text-motion__char'; span.textContent = char; span.setAttribute('aria-hidden', 'true'); return span; });
  element.replaceChildren(...chars);
  element.setAttribute('aria-label', text);
  const timeline = gsap.timeline({ paused: true }).fromTo(chars, { opacity: 0.15 }, { opacity: 1, duration: 0.2, stagger: 0.1, ease: 'none' });
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => { if (!scroller) return; const distance = scroller.scrollHeight - scroller.clientHeight; timeline.progress(media.matches ? 1 : distance > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / distance)) : 0).pause(); };
  let observer;
  if (scroller) {
    scroller.addEventListener('scroll', sync, { passive: true });
    media.addEventListener('change', sync);
    observer = new ResizeObserver(sync);
    observer.observe(scroller);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    sync();
  }
  return { timeline, sync, destroy() { observer?.disconnect(); scroller?.removeEventListener('scroll', sync); media.removeEventListener('change', sync); timeline.kill(); element.innerHTML = original; if (label === null) element.removeAttribute('aria-label'); else element.setAttribute('aria-label', label); } };
}
