import { gsap } from 'gsap';
import {
  Application,
  Container,
  DisplacementFilter,
  Filter,
  Graphics,
  Sprite,
  Texture,
  WRAP_MODES
} from 'pixi.js';

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform float uProgress;

  void main() {
    vec2 uv = vTextureCoord;
    float edge = 1.0 - uProgress;
    vec2 finalUV = vec2(max(uv.x, edge), uv.y);
    gl_FragColor = texture2D(uSampler, finalUV);
  }
`;

const EMPTY_REVEAL = {
  play() {},
  reset() {},
  destroy() {}
};

function createDisplacementTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;

  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  const stops = [
    [0, 128],
    [0.0625, 226],
    [0.125, 235],
    [0.1875, 105],
    [0.25, 1],
    [0.3125, 37],
    [0.375, 115],
    [0.4375, 123],
    [0.5, 95],
    [0.5625, 55],
    [0.625, 18],
    [0.6875, 0],
    [0.75, 9],
    [0.8125, 36],
    [0.875, 72],
    [0.9375, 106],
    [1, 128]
  ];

  stops.forEach(([position, gray]) => {
    gradient.addColorStop(position, `rgb(${gray}, ${gray}, ${gray})`);
  });
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = Texture.from(canvas);
  texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
  return texture;
}

function createEdgeStretchController({ app, render, texture, reduceMotion }) {
  const sprite = new Sprite(texture);
  sprite.width = app.screen.width;
  sprite.height = app.screen.height;
  app.stage.addChild(sprite);

  const uniforms = { uProgress: 0 };
  const filter = new Filter(undefined, FRAGMENT_SHADER, uniforms);
  sprite.filters = [filter];
  let tween = null;

  function animateTo(progress, duration, ease) {
    tween?.kill();
    tween = gsap.to(uniforms, {
      uProgress: progress,
      duration: reduceMotion ? 0 : duration,
      ease,
      overwrite: 'auto',
      onUpdate: render,
      onComplete: render
    });
  }

  return {
    play() {
      animateTo(1, 3, 'power2.inOut');
    },
    reset() {
      animateTo(0, 1, 'power2.out');
    },
    destroy() {
      tween?.kill();
    }
  };
}

function createDisplacementSlide({
  displacementTexture,
  height,
  sliceCount,
  texture,
  width
}) {
  const container = new Container();
  const sliceHeight = texture.height / sliceCount;
  const filters = [];
  const displacementSprites = [];

  for (let index = 0; index < sliceCount; index += 1) {
    const slice = new Container();
    const sliceY = index * sliceHeight;
    slice.y = sliceY;

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(0, 0, texture.width, sliceHeight);
    mask.endFill();
    slice.addChild(mask);
    slice.mask = mask;

    const image = new Sprite(texture);
    image.y = -sliceY;

    const displacementSprite = new Sprite(displacementTexture);
    displacementSprite.scale.set(0.4);
    displacementSprite.y = -100;

    const filter = new DisplacementFilter(displacementSprite);
    filter.scale.set(0, 300);
    image.filters = [filter];

    slice.addChild(displacementSprite, image);
    container.addChild(slice);
    filters.push(filter);
    displacementSprites.push(displacementSprite);
  }

  const coverScale = Math.max(width / texture.width, height / texture.height);
  container.pivot.set(texture.width / 2, texture.height / 2);
  container.position.set(width / 2, height / 2);
  container.scale.set(coverScale);

  return { container, displacementSprites, filters };
}

function createSliceDisplacementController({
  app,
  render,
  textures,
  sliceCount,
  reduceMotion,
  displacementTexture
}) {
  const slides = textures.map((texture, index) => {
    const slide = createDisplacementSlide({
      displacementTexture,
      height: app.screen.height,
      sliceCount,
      texture,
      width: app.screen.width
    });

    slide.container.alpha = index === 0 ? 1 : 0;
    slide.container.visible = index === 0;
    app.stage.addChild(slide.container);
    return slide;
  });
  let currentIndex = 0;
  let timeline = null;

  function prepareSlide(slide) {
    slide.filters.forEach((filter) => filter.scale.set(0, 300));
    slide.displacementSprites.forEach((sprite) => {
      sprite.y = -100;
    });
  }

  function normalizeSlide(slide) {
    slide.filters.forEach((filter) => filter.scale.set(0, 0));
    slide.displacementSprites.forEach((sprite) => {
      sprite.y = 0;
    });
  }

  function resetImmediately() {
    timeline?.kill();
    timeline = null;
    currentIndex = 0;

    slides.forEach((slide, index) => {
      if (index === 0) {
        normalizeSlide(slide);
      } else {
        prepareSlide(slide);
      }
      slide.container.alpha = index === 0 ? 1 : 0;
      slide.container.visible = index === 0;
    });
    render();
  }

  normalizeSlide(slides[0]);

  return {
    play() {
      if (slides.length < 2 || timeline?.isActive()) return;

      const current = slides[currentIndex];
      const nextIndex = (currentIndex + 1) % slides.length;
      const next = slides[nextIndex];
      const duration = reduceMotion ? 0 : 3;

      prepareSlide(next);
      next.container.alpha = 0;
      next.container.visible = true;

      timeline = gsap.timeline({
        onUpdate: render,
        onComplete() {
          current.container.visible = false;
          currentIndex = nextIndex;
          timeline = null;
          render();
        }
      });
      timeline.to(current.container, {
        alpha: 0,
        duration: reduceMotion ? 0 : 1.5,
        ease: 'power2.inOut'
      }, 0);
      timeline.to(next.container, {
        alpha: 1,
        duration: reduceMotion ? 0 : 1.5,
        ease: 'power2.inOut'
      }, 0);
      timeline.to(next.filters.map((filter) => filter.scale), {
        y: 0,
        duration,
        ease: 'circ.inOut'
      }, reduceMotion ? 0 : 0.2);
      timeline.to(next.displacementSprites, {
        y: 0,
        duration,
        ease: 'circ.inOut'
      }, reduceMotion ? 0 : 0.2);
    },
    reset() {
      resetImmediately();
    },
    destroy() {
      timeline?.kill();
    }
  };
}

export async function initWebGLImageReveal({
  container,
  imageUrl,
  imageUrls = [],
  variant = 'edge-stretch',
  slices = 10,
  width = 800,
  height = 500
} = {}) {
  const urls = variant === 'slice-displacement'
    ? (imageUrls.length ? imageUrls : [imageUrl].filter(Boolean))
    : [imageUrl].filter(Boolean);

  if (!container || !urls.length) return { ...EMPTY_REVEAL };

  const app = new Application({
    width,
    height,
    backgroundColor: 0x0d0d0d,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
    autoStart: false,
    sharedTicker: false
  });
  app.view.setAttribute('aria-hidden', 'true');
  container.appendChild(app.view);

  const textures = [];
  let controller = null;
  let displacementTexture = null;
  let destroyed = false;

  function render() {
    if (!destroyed) app.renderer.render(app.stage);
  }

  function destroyResources() {
    controller?.destroy();
    app.destroy(true, {
      children: true,
      texture: false,
      baseTexture: false
    });
    textures.forEach((texture) => texture.destroy(true));
    displacementTexture?.destroy(true);
  }

  try {
    for (const url of urls) {
      textures.push(await Texture.fromURL(url, { crossorigin: 'anonymous' }));
    }
  } catch (error) {
    destroyed = true;
    destroyResources();
    throw error;
  }

  if (destroyed) {
    destroyResources();
    return { ...EMPTY_REVEAL };
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (variant === 'slice-displacement') {
    displacementTexture = createDisplacementTexture();
    controller = createSliceDisplacementController({
      app,
      displacementTexture,
      reduceMotion,
      render,
      sliceCount: Math.max(1, Math.round(slices)),
      textures
    });
  } else {
    controller = createEdgeStretchController({
      app,
      reduceMotion,
      render,
      texture: textures[0]
    });
  }

  render();

  return {
    play() {
      controller.play();
    },
    reset() {
      controller.reset();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      destroyResources();
    }
  };
}
