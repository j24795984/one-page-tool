import { buttonEffects } from './button-effects.js';
import { getPatternDetails } from './ui-patterns.js';
const effectFiles = import.meta.glob('./js-effects/*.json', { eager: true, import: 'default' });

export function createUiShowcaseItems(baseUrl) {
  const items = [
    {
      title: '分類導覽滑動效果',
      summary: '滑鼠移入或切換分類時，圓點跟隨選項滑動，適合分類導覽。',
      category: '導覽與操作',
      tags: ['JavaScript', 'Navigation'],
      effects: ['選取高亮'],
      triggers: ['hover', '點擊'],
      types: ['導覽'],
      packages: ['原生 JS'],
      media: { image: 'ui-previews/news-nav.webp', video: null },
      href: `${baseUrl}js-effects/news-nav/`
    },
    {
      title: 'Page Link Highlight',
      summary: '依目前網址標示導覽項目，並比較第三方平台與各路由架構的接法。',
      category: '導覽與操作',
      tags: ['JavaScript', 'Routing'],
      variants: 3,

      effects: ["選取高亮"],
      triggers: [],
      types: ["導覽"],
      packages: ["原生 JS"],
      media: { image: 'ui-previews/page-link-highlight.webp', video: null },
      href: `${baseUrl}js-effects/page-link-highlight/`
    },
    {
      category: '文字與數字',
      tags: ['JavaScript', 'Text'],
      summary: '捲入畫面時逐字上浮淡入，提供三種版本，適合標題與短句。',

      effects: ["淡入"],
      triggers: ['進入可視區'],
      types: ["文字"],
      packages: ["GSAP"],
      media: { image: 'ui-previews/text-fade.webp', video: null },
      href: `${baseUrl}js-effects/text-fade/`
    },
    {
      title: 'Text Fade Module',
      summary: '組合逐字淡入、上移與模糊，自動播放，適合開場標題。',
      category: '文字與數字',
      tags: ['JavaScript', 'Text'],
      effects: ['淡入'],
      triggers: ['自動播放'],
      types: ['文字'],
      packages: ['GSAP'],
      media: { image: 'ui-previews/text-fade-module.webp', video: null },
      href: `${baseUrl}js-effects/text-fade-module/`
    },
    {
      category: '進場與顯示',
      tags: ['JavaScript', 'Observer'],
      summary: '捲入畫面時讓卡片依序位移淡入，適合圖文區塊與列表進場。',

      effects: ["淡入"],
      triggers: ['進入可視區'],
      types: ["卡片"],
      packages: ["GSAP"],
      media: { image: 'ui-previews/object-fade-active.webp', video: null },
      href: `${baseUrl}js-effects/object-fade-active/`
    },
    {
      category: '捲動與視差',
      tags: ['JavaScript', 'Parallax'],
      summary: '圖片隨捲動以不同速度位移，適合主視覺與圖文段落的景深效果。',

      effects: ["視差","捲動連動"],
      triggers: ['捲動連動'],
      types: ["圖片"],
      packages: ["GSAP"],
      media: { image: 'ui-previews/parallax.webp', video: null },
      href: `${baseUrl}js-effects/parallax/`
    },
    {
      summary: '向下捲動時固定舞台並橫移卡片，適合作品集與流程展示。',
      title: 'Horizontal Scroll',
      category: '捲動與視差',
      tags: ['GSAP', 'ScrollTrigger', 'Lenis'],

      effects: ["捲動連動"],
      triggers: ['捲動連動'],
      types: ["卡片","版面"],
      packages: ["GSAP","Lenis"],
      media: { image: 'ui-previews/horizontal-scroll.webp', video: null },
      href: `${baseUrl}ui-patterns/horizontal-scroll/`
    },
    {
      summary: '點選時段或左右滑動切換斜角圖片，適合作品集與影像展示。',
      title: 'Dramatic Diagonal Carousel',
      category: '輪播與切換',
      tags: ['CSS Transform', 'JavaScript'],

      effects: ["輪播"],
      triggers: ['點擊', '拖曳'],
      types: ["圖片"],
      packages: ["原生 JS"],
      media: { image: 'ui-previews/dramatic-diagonal-carousel.webp', video: null },
      href: `${baseUrl}ui-patterns/dramatic-diagonal-carousel/`
    },
    {
      summary: '向任意方向拖曳圖片網格，放手後慣性滑行，適合自由探索作品牆。',
      title: 'Infinite Drag Grid',
      category: '拖曳與探索',
      tags: ['GSAP', 'Draggable'],

      effects: ["拖曳"],
      triggers: ['拖曳'],
      types: ["卡片","版面"],
      packages: ["GSAP"],
      media: { image: 'ui-previews/infinite-drag-grid.webp', video: null },
      href: `${baseUrl}ui-patterns/infinite-drag-grid/`
    },
    {
      category: '文字與數字',
      tags: ['GSAP', 'Number'],
      summary: '數值更新時逐位垂直滾動，適合營收、統計與累積數量。',

      effects: ["數字滾動"],
      triggers: ['自動播放'],
      types: ["數字"],
      packages: ["GSAP"],
      media: { image: 'ui-previews/number-scroll.webp', video: null },
      href: `${baseUrl}js-effects/number-scroll/`
    },
    {
      summary: 'SVG 線條循環描繪並收回，適合單一路徑圖形與引導線。',
      category: '圖形與線條',
      tags: ['SVG', 'JavaScript'],

      effects: ["描繪"],
      triggers: ['進入可視區'],
      types: ["圖形"],
      packages: ["GSAP"],
      media: { image: 'ui-previews/svg-line-grow.webp', video: null },
      href: `${baseUrl}js-effects/svg-line-grow/`
    },
    {
      summary: '播放時延伸像素或扭曲切片揭露圖片，適合主視覺與輪播轉場。',
      category: '圖片與材質',
      tags: ['WebGL', 'PixiJS'],

      effects: ["揭露","輪播"],
      triggers: ['點擊'],
      types: ["圖片"],
      packages: ["GSAP","PixiJS"],
      media: { image: 'ui-previews/webgl-image-reveal.webp', video: null },
      href: `${baseUrl}js-effects/webgl-image-reveal/`
    },
    {
      category: '捲動與視差',
      tags: ['JavaScript', 'Scrollbar'],
      summary: '捲動內容時同步滑塊，也可拖曳控制位置，適合固定高度的閱讀面板。',

      effects: ["捲動連動","拖曳"],
      triggers: ['捲動連動', '拖曳'],
      types: ["版面"],
      packages: ["原生 JS"],
      media: { image: 'ui-previews/custom-scrollbar.webp', video: null },
      href: `${baseUrl}js-effects/custom-scrollbar/`
    },
    {
      title: '圓餅圖分段',
      summary: '進入畫面後依序描繪四段環圈，圖例同步滑入，適合流量來源與占比統計。',
      category: '圖形與線條',
      tags: ['SVG', 'Donut Chart Segments'],
      effects: ['描繪'],
      triggers: ['進入可視區'],
      types: ['圖形'],
      packages: ['GSAP'],
      media: { image: null, video: null },
      href: `${baseUrl}js-effects/donut-chart-segments/`
    },

    {
      title: '水滴單選 Liquid Radio',
      summary: '切換單選項時，圓點拉長成水滴移向新選項，再彈回圓形，適合表單選擇。',
      category: '表單與控制項',
      tags: ['Liquid Radio', '表單'],
      effects: ['選取高亮'],
      triggers: ['點擊'],
      types: ['表單'],
      packages: ['GSAP'],
      media: { image: null, video: null },
      href: `${baseUrl}js-effects/liquid-radio/`
    },
  ];
  items.push(...buttonEffects.map(effect => ({ title: effect.title, summary: effect.summary, category: '按鈕與操作', tags: [effect.number], effects: [effect.effect], triggers: effect.triggers, types: effect.types ?? ['按鈕'], packages: ['GSAP'], media: { image: null, video: null }, href: `${baseUrl}js-effects/${effect.id}/` })));
  const patterns = getPatternDetails(baseUrl);
  return items.map((item) => {
    const slug = item.href.split('/').filter(Boolean).at(-1);
    const effect = effectFiles['./js-effects/' + slug + '.json'];
    const pattern = patterns.find((entry) => entry.href === item.href);
    return {
      ...pattern,
      ...item,
      id: slug,
      preview: [...buttonEffects.map(effect => effect.id), 'liquid-radio', 'donut-chart-segments', 'text-fade', 'text-fade-module', 'number-scroll', 'object-fade-active', 'svg-line-grow'].includes(slug)
        ? { kind: 'inline', mode: 'auto' }
        : slug === 'page-link-highlight'
          ? { kind: 'document', mode: 'static' }
          : { kind: 'scene', mode: 'auto' },
      sourceType: 'self-made',
      media: Object.fromEntries(Object.entries(item.media).map(([key, value]) => [key, value ? (/^(https?:)?\/\//.test(value) ? value : baseUrl + value.replace(/^\//, '')) : null])),
      summary: item.summary ?? effect?.info?.summary ?? pattern?.subtitle ?? '依平台與路由架構選擇導覽狀態實作方式。',
      title: effect?.info?.title ?? item.title
    };
  });
}
