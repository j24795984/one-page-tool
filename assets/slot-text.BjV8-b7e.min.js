import { gsap } from 'gsap';

export function createSlotText({ element, text = '大吉利', symbols = '大吉利福財壽★♥7', duration = 2.4 } = {}) {
  const original = element.innerHTML;
  const originalLabel = element.getAttribute('aria-label');
  const characters = Array.from(text).slice(0, 8);
  const pool = Array.from(symbols || text || '★');
  const tracks = characters.map(character => {
    const window = document.createElement('span');
    window.className = 'slot-text__window';
    window.setAttribute('aria-hidden', 'true');
    const track = document.createElement('span');
    track.className = 'slot-text__track';
    const sequence = [character, ...Array.from({ length: 24 }, () => pool[Math.floor(Math.random() * pool.length)]), character];
    sequence.forEach(letter => {
      const row = document.createElement('span');
      row.className = 'slot-text__row';
      row.textContent = letter;
      track.append(row);
    });
    window.append(track);
    return window;
  });
  element.replaceChildren(...tracks);
  element.setAttribute('aria-label', characters.join(''));
  const timeline = gsap.timeline({ paused: true });
  tracks.forEach((window, index) => {
    const track = window.firstElementChild;
    const end = -100 * 25 / 26;
    timeline.to(track, { yPercent: end + 6, duration: Math.max(0.2, duration - 0.65) + index * 0.18, ease: 'power1.in' }, 0)
      .to(track, { yPercent: end, duration: 0.65, ease: 'back.out(1.2)' }, Math.max(0.2, duration - 0.65) + index * 0.18);
  });
  return {
    timeline,
    destroy() {
      timeline.kill();
      element.innerHTML = original;
      if (originalLabel === null) element.removeAttribute('aria-label');
      else element.setAttribute('aria-label', originalLabel);
    }
  };
}
