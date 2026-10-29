import { gsap } from 'gsap';

// SVG circles carry data-percent; matching legend groups carry data-legend.
export function initDonutChart({ root, preview = false, running = true, onComplete } = {}) {
  const circles = [...root.querySelectorAll('[data-percent]')];
  const legends = [...root.querySelectorAll('[data-legend]')];
  const media = gsap.matchMedia();
  let timeline, observer, visible = false, enabled = running;
  const sync = () => {
    if (!timeline) return;
    if (document.hidden || (preview ? !enabled : !visible)) timeline.pause();
    else timeline.play();
  };
  media.add('(prefers-reduced-motion: no-preference)', () => {
    timeline = gsap.timeline({ paused: true, repeat: preview ? 1 : 0, yoyo: preview,
      repeatDelay: preview ? 0.3 : 0, onComplete, defaults: { ease: 'power2.out' } });
    circles.forEach((circle, index) => {
      const length = 2 * Math.PI * Number(circle.getAttribute('r'));
      const segment = length * (Number(circle.dataset.percent) / 100 - 0.012);
      timeline.fromTo(circle, { attr: { 'stroke-dasharray': `0 ${length}` } },
        { attr: { 'stroke-dasharray': `${segment} ${length - segment}` }, duration: 0.6 }, index * 0.6);
      timeline.fromTo(legends[index], { autoAlpha: 0, x: 18 },
        { autoAlpha: 1, x: 0, duration: 0.4 }, index * 0.6);
    });
    timeline.timeScale(preview ? 1.5 : 1);
    if (preview && !enabled) timeline.progress(1).pause();
    if (!preview) {
      observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.4;
        sync();
      }, { threshold: [0, 0.4] });
      observer.observe(root);
    }
    sync();
    return () => { observer?.disconnect(); timeline?.kill(); timeline = null; };
  });
  // Without an animation the SVG's authored attributes show the complete chart.
  document.addEventListener('visibilitychange', sync);
  return {
    setRunning(value) {
      enabled = value;
      if (value && timeline && !document.hidden) timeline.restart();
      else sync();
    },
    restart() { if (timeline && !document.hidden) timeline.restart(); },
    destroy() { document.removeEventListener('visibilitychange', sync); media.revert(); }
  };
}
