const carousel = document.querySelector('[data-diagonal-carousel]');
const slides = [...carousel.querySelectorAll('[data-slide]')];
const timelineButtons = [...carousel.querySelectorAll('[data-go-to]')];
let currentIndex = 0;
let locked = false;
let pointerStart = null;

function wrap(index) {
  return (index + slides.length) % slides.length;
}

function render() {
  const previous = wrap(currentIndex - 1);
  const next = wrap(currentIndex + 1);

  slides.forEach((slide, index) => {
    const forwardDistance = wrap(index - currentIndex);
    let state = forwardDistance <= slides.length / 2 ? 'hidden-right' : 'hidden-left';
    if (index === currentIndex) state = 'active';
    if (index === previous) state = 'previous';
    if (index === next) state = 'next';
    slide.dataset.state = state;
    slide.setAttribute('aria-hidden', String(index !== currentIndex));
  });

  timelineButtons.forEach((button, index) => {
    button.classList.toggle('is-active', index === currentIndex);
    button.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
  });
}

function goTo(index) {
  const target = wrap(index);
  if (locked || target === currentIndex) return;
  locked = true;
  currentIndex = target;
  render();
  window.setTimeout(() => { locked = false; }, 1100);
}

slides.forEach((slide, index) => {
  slide.querySelector('button').addEventListener('click', () => goTo(index));
});

timelineButtons.forEach((button) => {
  button.addEventListener('click', () => goTo(Number(button.dataset.goTo)));
});

carousel.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') goTo(currentIndex + 1);
  if (event.key === 'ArrowLeft') goTo(currentIndex - 1);
});

carousel.addEventListener('pointerdown', (event) => {
  if (event.target.closest('[data-go-to]')) return;
  pointerStart = event.clientX;
  carousel.setPointerCapture(event.pointerId);
});

carousel.addEventListener('pointerup', (event) => {
  if (pointerStart === null) return;
  const distance = event.clientX - pointerStart;
  if (Math.abs(distance) > 40) goTo(currentIndex + (distance < 0 ? 1 : -1));
  pointerStart = null;
});

carousel.addEventListener('pointercancel', () => { pointerStart = null; });
render();
