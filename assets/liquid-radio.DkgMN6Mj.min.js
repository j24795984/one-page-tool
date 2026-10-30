import { gsap } from 'gsap';

export function initLiquidRadio({ root, running = true } = {}) {
  const inputs = [...root.querySelectorAll('input[type="radio"]')];
  const dot = root.querySelector('[data-liquid-dot]');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motion, enabled = running;
  const selected = () => Math.max(0, inputs.findIndex(input => input.checked));
  const position = index => {
    const label = inputs[index].closest('label');
    return label.offsetTop + (label.offsetHeight - dot.offsetHeight) / 2;
  };
  function move(index, animate = true) {
    motion?.kill();
    inputs[index].checked = true;
    const y = position(index);
    if (!animate || preference.matches) {
      gsap.set(dot, { y, scaleX: 1, scaleY: 1, borderRadius: '50%' });
      return;
    }
    motion = gsap.timeline();
    motion.to(dot, { scaleX: 0.65, scaleY: 2.3, borderRadius: '55% 55% 42% 42%', duration: 0.12 })
      .to(dot, { y, duration: 0.32, ease: 'power2.inOut' }, 0.04)
      .to(dot, { scaleX: 1, scaleY: 1, borderRadius: '50%', duration: 0.48, ease: 'elastic.out(1, 0.4)' }, 0.28);
  }
  function sync() {
    if (document.hidden || !enabled) motion?.pause();
    else motion?.resume();
    if (preference.matches) move(selected(), false);
  }
  function change(event) {
    const index = inputs.indexOf(event.target);
    if (index >= 0) move(index);
  }
  const resize = new ResizeObserver(() => move(selected(), false));
  resize.observe(root);
  root.addEventListener('change', change);
  document.addEventListener('visibilitychange', sync);
  preference.addEventListener('change', sync);
  move(selected(), false);
  return {
    controls: inputs.map((input,index)=>({element:input.closest('label'),click:()=>move(index),cancel:()=>move(selected(),false)})),
    setRunning(value) { enabled = value; sync(); },
    destroy() {
      motion?.kill(); resize.disconnect();
      root.removeEventListener('change', change);
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', sync);
      gsap.set(dot, { clearProps: 'all' });
    }
  };
}
