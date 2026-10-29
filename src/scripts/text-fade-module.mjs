/**
 * Standalone GSAP text reveal. No automatic initialization or project imports.
 *
 * data-text-fade="timing(d:0.27;o:0.8;e:none) fade rise(y:9) blur(b:10)"
 * timing: d = seconds per character, o = overlap (0–1), s = stagger seconds
 *         (s takes precedence over o), e = GSAP ease name.
 * fade(from:0;to:1), rise(y:9), blur(b:10) may omit their parameters.
 * Effects run together on each character; order in the attribute is irrelevant.
 * Whitespace is preserved but does not consume animation steps.
 * Requires a browser with Intl.Segmenter and a caller-supplied GSAP 3 instance.
 *
 * Original effects:
 * ③ timing(d:0.48;s:0.13;e:none) fade rise(y:9)
 * ⑥ timing(d:0.27;o:0.8;e:none) fade
 * ⑧ timing(d:0.7;s:0.07;e:power2.out) fade blur(b:10)
 *
 * Usage:
 *   import { createTextFade, initTextFades } from './text-fade.mjs';
 *   const effect = createTextFade(element, { gsap }); // paused, start hidden
 *   effect.timeline.play();
 *   // Or compose without making the child timeline independently paused:
 *   master.add(effect.timeline.paused(false));
 *   master.to(logo, { opacity: 1 }, '+=0.2');
 *   // ScrollTrigger may control effect.timeline externally.
 *   effect.destroy(); // removes animation, restores original DOM nodes
 *
 *   const group = initTextFades({ gsap, root: document, paused: false });
 *   group.destroy();
 *
 * Use on text containers, not controls or containers with interactive children.
 * Reduced motion shows final content immediately (also when toggled at runtime).
 */

const DEFAULTS = {
  timing: { d: 0.27, o: 0.8, e: 'none' },
  fade: { from: 0, to: 1 },
  rise: { y: 9 },
  blur: { b: 10 },
};
const instances = new WeakMap();

/** Parse the data grammar without evaluating JavaScript. Invalid input throws. */
export function parseTextFade(source = '') {
  const result = { timing: { ...DEFAULTS.timing } };
  const seen = new Set();
  const input = source.trim() || 'fade';
  const token = /([a-z]+)(?:\(([^()]*)\))?(?:\s+|$)/gy;
  let position = 0;
  while (position < input.length) {
    token.lastIndex = position;
    const match = token.exec(input);
    if (!match) throw new SyntaxError(`Invalid text-fade syntax near: ${input.slice(position)}`);
    const [, name, body] = match;
    if (!Object.hasOwn(DEFAULTS, name) || seen.has(name)) {
      throw new SyntaxError(`Unknown or duplicate text-fade group: ${name}`);
    }
    seen.add(name);
    const values = { ...DEFAULTS[name] };
    const keys = new Set();
    for (const entry of (body || '').split(';').filter(value => value.trim())) {
      const pair = entry.trim().match(/^([a-z]+)\s*:\s*([^:]+)$/);
      if (!pair) throw new SyntaxError(`Invalid text-fade parameter: ${entry}`);
      const [, key, raw] = pair;
      if ((!Object.hasOwn(values, key) && !(name === 'timing' && key === 's')) || keys.has(key)) {
        throw new SyntaxError(`Unknown or duplicate parameter: ${name}.${key}`);
      }
      keys.add(key);
      const value = key === 'e' ? raw.trim() : Number(raw.trim());
      if (key !== 'e' && (!raw.trim() || !Number.isFinite(value))) {
        throw new TypeError(`Expected a finite number for ${name}.${key}`);
      }
      if (['d', 's', 'b'].includes(key) && value < 0
        || ['o', 'from', 'to'].includes(key) && (value < 0 || value > 1)) {
        throw new RangeError(`Out-of-range value for ${name}.${key}`);
      }
      values[key] = value;
    }
    result[name] = values;
    position = token.lastIndex;
  }
  if (![...seen].some(name => name !== 'timing')) result.fade = { ...DEFAULTS.fade };
  return result;
}

/** Create one reveal. Repeated calls on the same element return its instance. */
export function createTextFade(element, { gsap, paused = true } = {}) {
  if (instances.has(element)) return instances.get(element);
  if (!gsap?.timeline || !gsap?.context) throw new TypeError('Pass a GSAP 3 instance.');
  if (!element?.hasAttribute('data-text-fade')) throw new TypeError('Expected a data-text-fade element.');
  if (element.matches('a, button, input, textarea, select, [contenteditable]')
    || element.querySelector('a, button, input, textarea, select, [contenteditable], [data-text-fade]')) {
    throw new TypeError('Use text-fade on a text container without interactive or nested reveal elements.');
  }
  const options = parseTextFade(element.getAttribute('data-text-fade'));
  const doc = element.ownerDocument;
  const originalNodes = [...element.childNodes];
  const originalLabel = element.getAttribute('aria-label');
  const visual = doc.createElement('span');
  visual.style.display = 'contents';
  visual.setAttribute('aria-hidden', 'true');
  originalNodes.forEach(node => visual.appendChild(node.cloneNode(true)));

  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const walker = doc.createTreeWalker(visual, 4); // SHOW_TEXT
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  const characters = [];
  for (const node of textNodes) {
    const fragment = doc.createDocumentFragment();
    // Keep Latin words together while allowing CJK line wrapping; preserve whitespace/br.
    const tokens = node.data.match(/\s+|[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]|[^\s\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+/gu) || [];
    for (const token of tokens) {
      if (/^\s+$/u.test(token)) {
        fragment.appendChild(doc.createTextNode(token));
        continue;
      }
      const word = doc.createElement('span');
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
      for (const { segment } of segmenter.segment(token)) {
        const character = doc.createElement('span');
        character.style.display = 'inline-block';
        character.textContent = segment;
        word.appendChild(character);
        characters.push(character);
      }
      fragment.appendChild(word);
    }
    node.replaceWith(fragment);
  }

  const from = {};
  const to = {};
  if (options.fade) { from.opacity = options.fade.from; to.opacity = options.fade.to; }
  if (options.rise) { from.y = options.rise.y; to.y = 0; }
  if (options.blur) { from.filter = `blur(${options.blur.b}px)`; to.filter = 'blur(0px)'; }
  const motion = doc.defaultView.matchMedia('(prefers-reduced-motion: reduce)');
  let timeline;
  let destroyed = false;
  element.setAttribute('aria-label', originalLabel ?? element.textContent);
  element.replaceChildren(visual);
  const context = gsap.context(() => {
    timeline = gsap.timeline({ paused });
    if (characters.length) {
      const { d, o, s, e } = options.timing;
      timeline.fromTo(characters, from, {
        ...to, duration: motion.matches ? 0 : d,
        stagger: motion.matches ? 0 : (s ?? d * (1 - o)), ease: e,
      });
      if (motion.matches) timeline.progress(1);
    }
  });
  const reduce = event => { if (event.matches) timeline.progress(1).pause(); };
  motion.addEventListener('change', reduce);
  const instance = {
    timeline,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      motion.removeEventListener('change', reduce);
      timeline.scrollTrigger?.kill();
      context.revert();
      element.replaceChildren(...originalNodes);
      if (originalLabel === null) element.removeAttribute('aria-label');
      else element.setAttribute('aria-label', originalLabel);
      instances.delete(element);
    },
  };
  instances.set(element, instance);
  return instance;
}

/** Explicitly scan a root; importing this file alone does nothing. */
export function initTextFades({ root = document, gsap, paused = true } = {}) {
  const targets = [...root.querySelectorAll('[data-text-fade]')];
  if (root.matches?.('[data-text-fade]')) targets.unshift(root);
  // Validate the complete batch before hiding any text.
  targets.forEach(target => parseTextFade(target.getAttribute('data-text-fade')));
  const effects = [];
  const owned = [];
  try {
    for (const target of targets) {
      const existing = instances.has(target);
      const effect = createTextFade(target, { gsap, paused });
      effects.push(effect);
      if (!existing) owned.push(effect);
    }
  } catch (error) {
    owned.forEach(effect => effect.destroy());
    throw error;
  }
  return { effects, destroy: () => owned.forEach(effect => effect.destroy()) };
}
