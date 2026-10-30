export function initCustomScrollbar({ container, thumb, track } = {}) {
  if (!container || !thumb || !track) {
    return { update() {}, destroy() {} };
  }

  const original = {
    bodyCursor: document.body.style.cursor,
    bodyUserSelect: document.body.style.userSelect,
    thumbStyle: thumb.getAttribute('style'),
    trackStyle: track.getAttribute('style')
  };

  let frameId = 0;
  let isDragging = false;
  let startY = 0;
  let startThumbTop = 0;
  let currentThumbTop = 0;
  let observer = null;

  function renderThumbPosition() {
    frameId = 0;
    if (isDragging) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const trackHeight = track.clientHeight;
    const thumbHeight = thumb.clientHeight;

    if (scrollHeight <= clientHeight) {
      track.style.opacity = '0';
      track.style.pointerEvents = 'none';
      return;
    }

    track.style.opacity = '1';
    track.style.pointerEvents = 'auto';

    const maxScrollTop = scrollHeight - clientHeight;
    const maxThumbMove = Math.max(trackHeight - thumbHeight, 0);
    const ratio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;

    currentThumbTop = Math.min(Math.max(ratio * maxThumbMove, 0), maxThumbMove);
    thumb.style.transform = `translate3d(0, ${currentThumbTop}px, 0)`;
  }

  function updateThumbPosition() {
    if (frameId) return;
    frameId = window.requestAnimationFrame(renderThumbPosition);
  }

  function onDragStart(event) {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();
    isDragging = true;
    startY = event.clientY;
    startThumbTop = currentThumbTop;
    thumb.classList.add('active');
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  }

  function onDragMove(event) {
    if (!isDragging) return;

    event.preventDefault();
    const trackHeight = track.clientHeight;
    const thumbHeight = thumb.clientHeight;
    const maxThumbMove = Math.max(trackHeight - thumbHeight, 0);

    currentThumbTop = Math.max(
      0,
      Math.min(startThumbTop + event.clientY - startY, maxThumbMove)
    );
    thumb.style.transform = `translate3d(0, ${currentThumbTop}px, 0)`;

    const maxScrollTop = Math.max(container.scrollHeight - container.clientHeight, 0);
    const scrollRatio = maxThumbMove > 0 ? currentThumbTop / maxThumbMove : 0;
    container.scrollTop = scrollRatio * maxScrollTop;
  }

  function onDragEnd() {
    if (!isDragging) return;

    isDragging = false;
    thumb.classList.remove('active');
    document.body.style.userSelect = original.bodyUserSelect;
    document.body.style.cursor = original.bodyCursor;
  }

  if ('ResizeObserver' in window) {
    observer = new ResizeObserver(updateThumbPosition);
    observer.observe(container);
  }

  container.addEventListener('scroll', updateThumbPosition, { passive: true });
  thumb.addEventListener('mousedown', onDragStart);
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragEnd);
  window.addEventListener('resize', updateThumbPosition);
  renderThumbPosition();

  return {
    update: updateThumbPosition,
    destroy() {
      if (frameId) window.cancelAnimationFrame(frameId);
      container.removeEventListener('scroll', updateThumbPosition);
      thumb.removeEventListener('mousedown', onDragStart);
      document.removeEventListener('mousemove', onDragMove);
      document.removeEventListener('mouseup', onDragEnd);
      window.removeEventListener('resize', updateThumbPosition);
      observer?.disconnect();
      thumb.classList.remove('active');
      restoreAttribute(thumb, 'style', original.thumbStyle);
      restoreAttribute(track, 'style', original.trackStyle);
      document.body.style.userSelect = original.bodyUserSelect;
      document.body.style.cursor = original.bodyCursor;
    }
  };
}

function restoreAttribute(element, name, value) {
  if (value === null) {
    element.removeAttribute(name);
  } else {
    element.setAttribute(name, value);
  }
}
