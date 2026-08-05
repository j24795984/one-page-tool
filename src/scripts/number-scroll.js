import { gsap } from 'gsap';

const MAX_INTEGER_DIGITS = 9;
const MAX_DECIMALS = 3;
const MAX_AFFIX_LENGTH = 12;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeOptions(options) {
  const decimals = clamp(Math.trunc(Number(options.decimals) || 0), 0, MAX_DECIMALS);
  const maxValue = (10 ** MAX_INTEGER_DIGITS) - (10 ** -decimals);
  const start = clamp(Number(options.start) || 0, -maxValue, maxValue);
  const end = clamp(Number(options.end) || 0, -maxValue, maxValue);
  const direction = ['up', 'down'].includes(options.direction)
    ? options.direction
    : end >= start ? 'up' : 'down';

  return {
    start,
    end,
    decimals,
    direction,
    duration: clamp(Number(options.duration) || 0, 0, 10),
    ease: options.ease || 'power3.inOut',
    grouping: options.grouping !== false,
    prefix: String(options.prefix || '').slice(0, MAX_AFFIX_LENGTH),
    suffix: String(options.suffix || '').slice(0, MAX_AFFIX_LENGTH)
  };
}

function getIntegerDigitCount(value) {
  return Math.max(1, Math.trunc(Math.abs(value)).toString().length);
}

function getDigits(value, decimals, totalDigits) {
  return Math.abs(value)
    .toFixed(decimals)
    .replace('.', '')
    .padStart(totalDigits, ' ');
}

function formatValue(value, options) {
  const number = new Intl.NumberFormat('en-US', {
    useGrouping: options.grouping,
    minimumFractionDigits: options.decimals,
    maximumFractionDigits: options.decimals
  }).format(value);

  return `${options.prefix}${number}${options.suffix}`;
}

function createTextPart(className, text) {
  const part = document.createElement('span');
  part.className = className;
  part.textContent = text;
  return part;
}

function createDigitSequence(startCharacter, endCharacter, direction) {
  if (startCharacter === ' ' || endCharacter === ' ') {
    return startCharacter === endCharacter
      ? [startCharacter]
      : [startCharacter, endCharacter];
  }

  const start = Number(startCharacter);
  const end = Number(endCharacter);
  const increment = direction === 'down' ? -1 : 1;
  const distance = direction === 'down'
    ? (start - end + 10) % 10
    : (end - start + 10) % 10;
  const steps = distance + 10;
  const sequence = [start];

  for (let index = 1; index <= steps; index += 1) {
    sequence.push((start + (increment * index) + 100) % 10);
  }

  return sequence;
}

function createDigitColumn(startCharacter, endCharacter, direction) {
  const column = document.createElement('span');
  const track = document.createElement('span');
  const sequence = createDigitSequence(startCharacter, endCharacter, direction);

  column.className = 'number-scroll__digit';
  track.className = 'number-scroll__track';
  track.dataset.steps = String(sequence.length - 1);

  sequence.forEach((digit) => {
    const row = document.createElement('span');
    row.className = 'number-scroll__digit-row';
    row.textContent = digit === ' ' ? '\u00a0' : String(digit);
    track.appendChild(row);
  });

  column.appendChild(track);
  return column;
}

function createSeparator(character, minimumDigits) {
  const separator = createTextPart('number-scroll__separator', character);
  separator.dataset.minimumDigits = String(minimumDigits);
  return separator;
}

function setGroupingVisibility(separators, visibleDigits) {
  separators.forEach((separator) => {
    separator.style.opacity = visibleDigits >= Number(separator.dataset.minimumDigits)
      ? '1'
      : '0';
  });
}

export function initNumberScroll({ element, ...rawOptions } = {}) {
  if (!(element instanceof HTMLElement)) return () => {};

  const options = normalizeOptions(rawOptions);
  const originalHTML = element.innerHTML;
  const originalAriaLabel = element.getAttribute('aria-label');
  const integerDigits = Math.max(
    getIntegerDigitCount(options.start),
    getIntegerDigitCount(options.end)
  );
  const totalDigits = integerDigits + options.decimals;
  const startDigits = getDigits(options.start, options.decimals, totalDigits);
  const endDigits = getDigits(options.end, options.decimals, totalDigits);
  const visual = document.createElement('span');
  const liveValue = document.createElement('span');
  const tracks = [];
  const groupingSeparators = [];

  visual.className = 'number-scroll__visual';
  visual.setAttribute('aria-hidden', 'true');
  liveValue.className = 'number-scroll__sr-only';
  liveValue.setAttribute('aria-live', 'polite');
  liveValue.textContent = formatValue(options.start, options);

  if (options.prefix) {
    visual.appendChild(createTextPart('number-scroll__affix', options.prefix));
  }

  const sign = createTextPart(
    'number-scroll__sign',
    options.start < 0 ? '−' : options.end < 0 ? '\u00a0' : ''
  );
  if (sign.textContent) visual.appendChild(sign);

  for (let index = 0; index < integerDigits; index += 1) {
    if (options.grouping && index > 0 && (integerDigits - index) % 3 === 0) {
      const separator = createSeparator(',', integerDigits - index + 1);
      groupingSeparators.push(separator);
      visual.appendChild(separator);
    }

    const column = createDigitColumn(
      startDigits[index],
      endDigits[index],
      options.direction
    );
    tracks.push(column.firstElementChild);
    visual.appendChild(column);
  }

  if (options.decimals > 0) {
    visual.appendChild(createTextPart('number-scroll__separator', '.'));

    for (let index = integerDigits; index < totalDigits; index += 1) {
      const column = createDigitColumn(
        startDigits[index],
        endDigits[index],
        options.direction
      );
      tracks.push(column.firstElementChild);
      visual.appendChild(column);
    }
  }

  if (options.suffix) {
    visual.appendChild(createTextPart('number-scroll__affix', options.suffix));
  }

  element.replaceChildren(visual, liveValue);
  setGroupingVisibility(groupingSeparators, getIntegerDigitCount(options.start));

  const targetYPercent = (index, track) => {
    const steps = Number(track.dataset.steps);
    return -100 * (steps / (steps + 1));
  };
  const media = gsap.matchMedia();

  const finish = () => {
    setGroupingVisibility(groupingSeparators, getIntegerDigitCount(options.end));
    if (sign.textContent) sign.textContent = options.end < 0 ? '−' : '\u00a0';
    liveValue.textContent = formatValue(options.end, options);
  };

  media.add(
    {
      reduceMotion: '(prefers-reduced-motion: reduce)',
      allowMotion: '(prefers-reduced-motion: no-preference)'
    },
    ({ conditions }) => {
      gsap.set(tracks, { yPercent: 0 });

      if (conditions.reduceMotion || options.duration === 0) {
        gsap.set(tracks, { yPercent: targetYPercent });
        finish();
        return;
      }

      gsap.to(tracks, {
        yPercent: targetYPercent,
        duration: options.duration,
        ease: options.ease,
        stagger: {
          each: 0.035,
          from: 'end'
        },
        overwrite: 'auto',
        onStart: () => gsap.set(tracks, { willChange: 'transform' }),
        onComplete: () => {
          gsap.set(tracks, { clearProps: 'willChange' });
          finish();
        }
      });
    }
  );

  return () => {
    media.revert();
    element.innerHTML = originalHTML;

    if (originalAriaLabel === null) {
      element.removeAttribute('aria-label');
    } else {
      element.setAttribute('aria-label', originalAriaLabel);
    }
  };
}
