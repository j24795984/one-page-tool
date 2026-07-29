import { gsap } from 'gsap';

const TEXT_FADE_SELECTOR = [
  '[data-fade-text]',
  '[data-fade-brtext]',
  '[data-fade-3dtext]'
].join(', ');
const TEXT_TOKEN_PATTERN =
  /(\s+|[\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]|[^\s\u3000-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]+)/gu;

function createCharacter(character) {
  const span = document.createElement('span');
  span.className = 'text-fade-character';
  span.setAttribute('aria-hidden', 'true');
  span.textContent = character === ' ' ? '\u00a0' : character;
  return span;
}

function createTextFragment(text) {
  const fragment = document.createDocumentFragment();
  const characters = [];
  const tokens = text.match(TEXT_TOKEN_PATTERN) || [];

  tokens.forEach((token) => {
    if (/^\s+$/u.test(token)) {
      fragment.appendChild(document.createTextNode(token));
      return;
    }

    const word = document.createElement('span');
    word.className = 'text-fade-word';

    for (const character of token) {
      const span = createCharacter(character);
      word.appendChild(span);
      characters.push(span);
    }

    fragment.appendChild(word);
  });

  return { fragment, characters };
}

function splitPlainText(fadeText) {
  const text = (fadeText.textContent || '').replace(/\s+/g, ' ').trim();
  if (!text) return [];

  fadeText.setAttribute('aria-label', text);
  const { fragment, characters } = createTextFragment(text);
  fadeText.replaceChildren(fragment);
  return characters;
}

function splitTextPreservingBreaks(fadeText) {
  const readableText = (fadeText.innerText || '')
    .replace(/\s+\n/g, '\n')
    .trim()
    .replace(/\n+/g, '\n');
  if (!readableText) return [];

  fadeText.setAttribute('aria-label', readableText);

  const walker = document.createTreeWalker(fadeText, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue && !/^\s*$/.test(walker.currentNode.nodeValue)) {
      textNodes.push(walker.currentNode);
    }
  }

  const characters = [];

  textNodes.forEach((textNode) => {
    const { fragment, characters: nodeCharacters } = createTextFragment(
      textNode.nodeValue
    );

    textNode.parentNode.replaceChild(fragment, textNode);
    characters.push(...nodeCharacters);
  });

  return characters;
}

function getEffectType(fadeText) {
  if (fadeText.hasAttribute('data-fade-3dtext')) return '3d';
  if (fadeText.hasAttribute('data-fade-brtext')) return 'br';
  return 'up';
}

function getAnimation(effectType, isFirstPageEnter) {
  if (effectType === '3d') {
    return {
      from: {
        opacity: 0,
        transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,0.1,0,24,0,0,1)'
      },
      to: {
        opacity: 1,
        transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,0.1,0,0,0,0,1)',
        delay: isFirstPageEnter ? 1 : 0,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.03,
        force3D: true
      }
    };
  }

  if (effectType === 'br') {
    return {
      from: {
        opacity: 0,
        xPercent: 24,
        transformPerspective: 800,
        force3D: true
      },
      to: {
        opacity: 1,
        xPercent: 0,
        delay: isFirstPageEnter ? 0.5 : 0,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.05,
        force3D: true
      }
    };
  }

  return {
    from: {
      opacity: 0,
      y: 24
    },
    to: {
      opacity: 1,
      y: 0,
      delay: isFirstPageEnter ? 1 : 0,
      duration: 1.5,
      ease: 'power2.out',
      stagger: 0.03,
      force3D: true
    }
  };
}

export function initFadeText({
  root = document,
  scroller = null
} = {}) {
  if (!root) return () => {};

  const fadeTexts = [...root.querySelectorAll(TEXT_FADE_SELECTOR)];
  if (!fadeTexts.length) return () => {};

  const snapshots = fadeTexts.map((fadeText) => ({
    fadeText,
    html: fadeText.innerHTML,
    ariaLabel: fadeText.getAttribute('aria-label'),
    style: fadeText.getAttribute('style')
  }));
  const observers = [];
  const animatedCharacters = [];
  let isFirstPageEnter = true;
  const enterTimer = window.setTimeout(() => {
    isFirstPageEnter = false;
  }, 100);

  fadeTexts.forEach((fadeText) => {
    const effectType = getEffectType(fadeText);
    const characters = effectType === 'br'
      ? splitTextPreservingBreaks(fadeText)
      : splitPlainText(fadeText);
    if (!characters.length) return;

    animatedCharacters.push(...characters);

    const startPercent = parseFloat(fadeText.getAttribute('data-fadeT-start')) || 90;
    const observerOptions = effectType === 'br'
      ? {
          root: scroller,
          rootMargin: `0px 0px -${100 - startPercent}% 0px`,
          threshold: 0.2
        }
      : {
          root: scroller,
          threshold: 0.2
        };
    let hasAnimated = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || hasAnimated) return;

      hasAnimated = true;
      const animation = getAnimation(effectType, isFirstPageEnter);

      gsap.set(
        fadeText,
        effectType === 'br'
          ? { opacity: 1, perspective: 800 }
          : { opacity: 1 }
      );
      gsap.fromTo(characters, animation.from, animation.to);
      observer.unobserve(fadeText);
    }, observerOptions);

    observer.observe(fadeText);
    observers.push(observer);
  });

  return () => {
    window.clearTimeout(enterTimer);
    observers.forEach((observer) => observer.disconnect());
    gsap.killTweensOf(animatedCharacters);

    snapshots.forEach(({ fadeText, html, ariaLabel, style }) => {
      fadeText.innerHTML = html;

      if (ariaLabel === null) {
        fadeText.removeAttribute('aria-label');
      } else {
        fadeText.setAttribute('aria-label', ariaLabel);
      }

      if (style === null) {
        fadeText.removeAttribute('style');
      } else {
        fadeText.setAttribute('style', style);
      }
    });
  };
}
