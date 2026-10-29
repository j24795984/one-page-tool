
    import gsap from 'gsap';
    import { Draggable } from 'gsap/Draggable';
    import { InertiaPlugin } from 'gsap/InertiaPlugin';

    gsap.registerPlugin(Draggable, InertiaPlugin);


export function initInfiniteGrid(viewport, container, { interactive = true } = {}) {
    const cardW = 320;
    const cardH = 220;
    const gap = 24;
    const cellW = cardW + gap;
    const cellH = cardH + gap;

    let cardObjects = [];
    let wrapX;
    let wrapY;
    let totalW;
    let totalH;

    function init() {
      container.innerHTML = '';
      cardObjects = [];

      const cols = Math.ceil(viewport.clientWidth / cellW) + 4;
      const rows = Math.ceil(viewport.clientHeight / cellH) + 4;
      totalW = cols * cellW;
      totalH = rows * cellH;

      wrapX = gsap.utils.wrap(-cellW, totalW - cellW);
      wrapY = gsap.utils.wrap(-cellH, totalH - cellH);

      for (let i = 0; i < cols * rows; i++) {
        const el = document.createElement('div');
        const seed = i + 100;

        el.className = 'card';
        el.innerHTML = `
          <div class="card-img" style="background-image: url('https://picsum.photos/seed/${seed}/400/300')"></div>
          <div class="card-label">PROJECT ${seed}</div>
        `;

        container.appendChild(el);

        const startX = (i % cols) * cellW;
        const startY = Math.floor(i / cols) * cellH;
        const setX = gsap.quickSetter(el, 'x', 'px');
        const setY = gsap.quickSetter(el, 'y', 'px');

        cardObjects.push({ el, startX, startY, setX, setY });
      }
    }

    function render() {
      const gridX = gsap.getProperty(container, 'x');
      const gridY = gsap.getProperty(container, 'y');

      cardObjects.forEach((card) => {
        const nextX = wrapX(card.startX + gridX) - gridX;
        const nextY = wrapY(card.startY + gridY) - gridY;

        card.setX(nextX);
        card.setY(nextY);
      });
    }

    const drag = interactive ? Draggable.create(container, {
      trigger: viewport,
      type: 'x,y',
      inertia: true,
      onDrag: render,
      onThrowUpdate: render,
      onClick(event) {
        const card = event.target.closest('.card');

        if (card) {
          alert(`點擊成功：${card.innerText}`);
        }
      },
      onPress: () => {
        viewport.style.cursor = 'grabbing';
      },
      onRelease: () => {
        viewport.style.cursor = 'grab';
      }
    }) : [];

    init(); render();
    const observer = new ResizeObserver(() => { init(); render(); });
    observer.observe(viewport);
    return { render, destroy() { observer.disconnect(); drag.forEach(d => d.kill()); gsap.killTweensOf(container); container.replaceChildren(); gsap.set(container, {clearProps:'transform'}); } };
}
