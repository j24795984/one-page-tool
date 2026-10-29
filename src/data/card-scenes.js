// Extract effect-only markup from the maintained demo sources. No scripts are injected.
import horizontal from '../pages/demos/horizontal-scroll/index.astro?raw';
import diagonal from '../pages/demos/dramatic-diagonal-carousel/index.astro?raw';
import moduleDemo from '../pages/demos/text-fade-module/index.astro?raw';
import news from '../../public/demos/news-nav-demo.html?raw';
import svgDemo from '../components/SvgLineGrowDemo.vue?raw';
import horizontalCss from '../styles/horizontal-scroll.css?raw';
import diagonalCss from '../styles/dramatic-diagonal-carousel.css?raw';
import gridCss from '../styles/infinite-drag-grid.css?raw';
import textCss from '../styles/text-fade.css?raw';
import numberCss from '../styles/number-scroll.css?raw';
import objectCss from '../styles/object-fade-active.css?raw';
import scrollbarCss from '../styles/custom-scrollbar.css?raw';
import svgCss from '../styles/svg-line-grow.css?raw';
import text from './js-effects/text-fade.json';
import number from './js-effects/number-scroll.json';
import objects from './js-effects/object-fade-active.json';
import scrollbar from './js-effects/custom-scrollbar.json';
import guide from './js-effects/page-link-highlight.json';
import guideCss from '../styles/page-link-highlight.css?raw';

export { number, objects };
export function extractElement(source, marker) {
  const position = source.indexOf(marker);
  if (position < 0) throw new Error(`Missing demo marker: ${marker}`);
  const start = source.lastIndexOf('<', position);
  const tag = source.slice(start).match(/^<([\w-]+)/)[1];
  const pattern = new RegExp(`<(/?)${tag}(?:\\s[^>]*|)>`, 'g');
  pattern.lastIndex = start;
  let depth = 0, match;
  while ((match = pattern.exec(source))) {
    depth += match[1] ? -1 : 1;
    if (depth === 0) return source.slice(start, pattern.lastIndex);
  }
  throw new Error(`Unclosed demo element: ${marker}`);
}
const inlineCss = source => source.match(/<style[^>]*>([\s\S]*?)<\/style>/)?.[1] || '';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Virtual desktop viewport: keep demo proportions independent of the list's columns.
export function sceneCss(css) {
  return css.replace(/@media\s*\(max-width:[^)]+\)/g, '@media (max-width: 0px)')
    .replace(/([\d.]+)(?:d|s)?v([wh])/g, (_, n, axis) => `${Number(n) * (axis === 'w' ? 8 : 5)}px`);
}
export function getCardScene(id) {
  switch (id) {
    case 'page-link-highlight': {
      const sample = guide.groups[0].options[0].samples[0];
      return { html: `<section class="page-link-guide__code-section"><article><header><span>${escape(sample.label)}</span><code>${escape(sample.language)}</code></header><pre><code>${escape(sample.code)}</code></pre></article></section>`, css: guideCss + '.stage{padding:28px;}.page-link-guide__code-section{margin:0;}pre{white-space:pre-wrap;font-size:18px;}' };
    }
    case 'news-nav': return { html: extractElement(news, 'class="category-nav"'), css: inlineCss(news) + '.stage{display:grid;place-items:center;background:white;font-family:"Noto Serif TC",serif;}.category-link{font-size:38px;padding:0 30px;}' };
    case 'horizontal-scroll': return { html: extractElement(horizontal, 'class="horizontal-scroll__viewport"'), css: horizontalCss };
    case 'dramatic-diagonal-carousel': return { html: extractElement(diagonal, 'class="diagonal-carousel"'), css: diagonalCss.replace(':root', ':host') };
    case 'text-fade-module': return { html: extractElement(moduleDemo, 'class="module-demo__preview"').replace(/<p class="module-demo__label">.*?<\/p>/, ''), css: inlineCss(moduleDemo) + '.stage{display:grid;align-content:center;padding:40px;}.module-demo__preview{margin:0;}' };
    case 'text-fade': return { html: `<div class="text-fade-demo__content"><section class="text-fade-demo__section"><h3 data-fade-text class="text-fade-demo__text">${escape(text.preview.sections[0].lines.join(' '))}</h3></section></div>`, css: textCss + '.text-fade-demo__content{padding:40px;}.text-fade-demo__section{min-height:420px;border:0;}[data-fade-text]{opacity:1;}' };
    case 'number-scroll': return { html: `<div class="number-scroll">${number.defaults.prefix}${number.defaults.endValue.toLocaleString('en-US')}</div>`, css: numberCss + '.stage{display:grid;place-items:center;}.number-scroll{width:70%;margin:0;font-size:120px;text-align:center;}.number-scroll__visual{display:flex;width:100%;justify-content:center;}' };
    case 'object-fade-active': return { html: `<div class="object-fade-demo__grid">${objects.preview.cards.map((card,i)=>`<article class="object-fade-demo__card" data-object-fade><span class="object-fade-demo__card-index">0${i+1}</span><h3 class="object-fade-demo__card-title">${escape(card)}</h3></article>`).join('')}</div>`, css: objectCss + '.stage{overflow:hidden;}.object-fade-demo__grid{padding:32px;grid-template-columns:repeat(2,minmax(0,1fr));}' };
    case 'custom-scrollbar': return { html: `<div class="custom-scrollbar-demo"><div class="custom-scrollbar-demo__shell"><article class="custom-scrollbar-demo__container"><div class="custom-scrollbar-demo__content">${scrollbar.preview.sections.map(s=>`<section class="custom-scrollbar-demo__section"><p>${escape(s.number)}</p><div><h3>${escape(s.title)}</h3><span>${escape(s.body)}</span></div></section>`).join('')}</div></article><div class="custom-scrollbar-demo__track"><div class="custom-scrollbar-demo__thumb"></div></div></div></div>`, css: scrollbarCss };
    case 'svg-line-grow': return { html: `<div class="svg-line-grow-demo">${extractElement(svgDemo, 'class="svg-line-grow-demo__canvas"')}</div>`, css: svgCss + '.svg-line-grow-demo__canvas{height:100%;min-height:0;}.svg-line-grow-demo__canvas svg{height:380px;width:88px;}.svg-line-grow-demo__canvas path{opacity:1;stroke-dashoffset:0;}' };
    case 'infinite-drag-grid': return { html: `<div class="infinite-drag-grid-page"><div id="viewport"><div id="grid-container">${Array.from({length:9},(_,i)=>`<div class="card" style="transform:translate(${i%3*344}px,${Math.floor(i/3)*244}px)"><div class="card-img" style="background-image:url('https://picsum.photos/seed/${100+Math.floor(i/3)*7+i%3}/400/300')"></div><div class="card-label">PROJECT ${100+Math.floor(i/3)*7+i%3}</div></div>`).join('')}</div></div></div>`, css: gridCss };
    case 'webgl-image-reveal': return { html: '<img class="webgl-still" src="https://picsum.photos/id/1015/800/500" alt=""><div class="webgl-canvas"></div>', css: '.stage{background:#0d0d0d;}.webgl-still,.webgl-canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}.webgl-canvas canvas{width:100%!important;height:100%!important;}' };
    default: throw new Error(`No card scene: ${id}`);
  }
}
