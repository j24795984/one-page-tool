import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DIRECTION_AXIS = {
  up: ['y', 1],
  down: ['y', -1],
  left: ['x', 1],
  right: ['x', -1]
};

function normalizeNumber(value, fallback, min, max) {
  const number = Number(value);

  if (!Number.isFinite(number)) return fallback;

  return Math.min(Math.max(number, min), max);
}

export function initObjectFadeActive({
  direction = 'up',
  options = {},
  root,
  scroller
}) {
  if (!root || !scroller) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const targets = [...root.querySelectorAll('[data-object-fade]')];
  const duration = normalizeNumber(options.duration, 0.75, 0, 5);
  const offset = normalizeNumber(options.offset, 56, 0, 300);
  const start = normalizeNumber(options.start, 84, 10, 100);
  const stagger = normalizeNumber(options.stagger, 0.12, 0, 2);
  const delay = normalizeNumber(options.delay, 0, 0, 5);
  const ease = options.ease || 'power2.out';
  const reset = options.reset !== false;
  const [axis, axisDirection] = DIRECTION_AXIS[direction] ?? DIRECTION_AXIS.up;
  const startVars = { [axis]: offset * axisDirection };
  const media = gsap.matchMedia();

  media.add(
    {
      allowMotion: '(prefers-reduced-motion: no-preference)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    ({ conditions }) => {
      if (conditions.reduceMotion) {
        gsap.set(targets, {
          autoAlpha: 1,
          clearProps: 'transform'
        });
        return;
      }

      gsap.set(targets, {
        autoAlpha: 0,
        ...startVars
      });

      const triggers = ScrollTrigger.batch(targets, {
        scroller,
        start: `top ${start}%`,
        interval: 0.08,
        batchMax: 3,
        once: !reset,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration,
            stagger,
            delay,
            ease,
            overwrite: 'auto'
          });
        },
        onLeaveBack: (batch) => {
          if (!reset) return;

          gsap.to(batch, {
            autoAlpha: 0,
            ...startVars,
            duration: 0.35,
            ease: 'power2.in',
            overwrite: 'auto'
          });
        }
      });

      return () => {
        gsap.killTweensOf(targets);
        triggers.forEach((trigger) => trigger.kill());
      };
    },
    root
  );

  ScrollTrigger.refresh();

  return () => {
    media.revert();
  };
}
