import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const DIRECTION_VARS = {
  up: { y: 56 },
  down: { y: -56 },
  left: { x: 56 },
  right: { x: -56 }
};

export function initObjectFadeActive({
  direction = 'up',
  root,
  scroller
}) {
  if (!root || !scroller) return () => {};

  gsap.registerPlugin(ScrollTrigger);

  const targets = [...root.querySelectorAll('[data-object-fade]')];
  const startVars = DIRECTION_VARS[direction] ?? DIRECTION_VARS.up;
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
        start: 'top 84%',
        interval: 0.08,
        batchMax: 3,
        onEnter: (batch) => {
          gsap.to(batch, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        },
        onLeaveBack: (batch) => {
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
