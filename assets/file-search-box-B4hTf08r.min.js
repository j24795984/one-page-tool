// CSS owns motion; this module owns actual input state and outside dismissal.
export function initSearchBox({ root, running = true }) {
  const input = root.querySelector('input');
  const opener = root.querySelector('[data-open]');
  const field = root.querySelector('[data-field]');
  let open = false, simulated = false;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  // Keep the CSS animation instances: reverse their playheads, including mid-motion.
  const animations = root.getAnimations({ subtree: true });
  animations.forEach(animation => { animation.pause(); animation.currentTime = 0; });
  root.dataset.rest = 'closed';
  const finish = () => { if (!open) root.dataset.rest = 'closed'; };
  animations.forEach(animation => animation.addEventListener('finish', finish));
  const sync = () => {
    animations.forEach(animation => {
      const end = animation.effect.getComputedTiming().endTime;
      if (preference.matches) { animation.pause(); animation.currentTime = open ? end : 0; }
      else if (!running || document.hidden) animation.pause();
      else if (open ? Number(animation.currentTime) < end : Number(animation.currentTime) > 0) animation.play();
    });
    if (preference.matches) finish();
  };
  const setOpen = (value, manual = false) => {
    if (value === open) { if (value && manual) input.focus(); return; }
    open = value;
    animations.forEach(animation => {
      // updatePlaybackRate is asynchronous. Calling play immediately afterwards
      // can rewind a finished animation using its OLD direction before it flips.
      const time = animation.currentTime ?? 0;
      animation.pause();
      animation.playbackRate = value ? 1 : -1;
      animation.currentTime = time;
    });

    root.dataset.rest = '';
    root.dataset.state = value ? 'open' : 'closed';
    opener.setAttribute('aria-expanded', String(value));
    opener.hidden = value;
    field.inert = !value;
    field.setAttribute('aria-hidden', String(!value));
    if (manual && value) input.focus({ preventScroll: true });
    if (!value && root.contains(document.activeElement)) document.activeElement.blur();
    sync();
    if (!value && animations.every(animation => Number(animation.currentTime) === 0)) finish();
  };
  const click = () => { simulated = false; setOpen(true, true); };
  const outside = event => { if (!root.contains(event.target)) { simulated = false; setOpen(false); } };
  const key = event => { if (event.key === 'Escape') { event.preventDefault(); simulated = false; setOpen(false); opener.focus(); } };
  const submit = event => event.preventDefault();
  opener.addEventListener('click', click);
  document.addEventListener('pointerdown', outside, true);
  root.addEventListener('keydown', key);
  root.addEventListener('submit', submit);
  const setRunning = value => { running = value; sync(); };
  const visibility = () => setRunning(running);
  document.addEventListener('visibilitychange', visibility);
  preference.addEventListener('change', sync);
  setRunning(running);
  return {
    controls: [
      { element: root, click() { simulated = true; setOpen(true); }, cancel() { if (simulated) { simulated = false; setOpen(false); } } },
      { element: root.parentElement.querySelector('[data-outside]'), click() { simulated = false; setOpen(false); } }
    ],
    setRunning,
    destroy() { animations.forEach(animation => { animation.removeEventListener('finish', finish); animation.cancel(); }); preference.removeEventListener('change', sync); opener.removeEventListener('click', click); document.removeEventListener('pointerdown', outside, true); root.removeEventListener('keydown', key); root.removeEventListener('submit', submit); document.removeEventListener('visibilitychange', visibility); }
  };
}

