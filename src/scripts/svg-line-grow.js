import { gsap } from 'gsap';

export function initSvgLineGrow({ path, repeat = -1, speed = 1, onComplete } = {}) {
  if (!path) return { destroy() {} };

  const originalStyle = path.getAttribute('style');
  const pathLength = path.getTotalLength();
  const media = gsap.matchMedia();

  media.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: 0,
      autoAlpha: 1,
      filter: 'none'
    });
  });

  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      autoAlpha: 1
    });

    const timeline = gsap.timeline({
      paused: true,
      repeat,
      onComplete,
      yoyo: true,
      defaults: {
        duration: 2,
        ease: 'power2.inOut'
      }
    });

    timeline
      .to(path, {
        strokeDashoffset: 0,
        ease: 'power1.inOut'
      })
      .to(path, {
        duration: 1,
        filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
        repeat: 1,
        yoyo: true
      }, '-=1');

    timeline.timeScale(speed);
    let observer = null;

    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
          timeline.play();
        } else {
          timeline.pause();
        }
      });
      observer.observe(path);
    } else {
      timeline.play();
    }

    return () => {
      observer?.disconnect();
      timeline.kill();
    };
  });

  return {
    destroy() {
      media.revert();

      if (originalStyle === null) {
        path.removeAttribute('style');
      } else {
        path.setAttribute('style', originalStyle);
      }
    }
  };
}
