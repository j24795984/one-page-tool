export function createUiShowcaseItems(baseUrl) {
  return [
    {
      title: 'Page Link Highlight',
      category: '導覽與狀態',
      tags: ['JavaScript', 'Routing'],
      variants: 3,
      preview: 'navigation',
      href: `${baseUrl}js-effects/page-link-highlight/`
    },
    {
      title: 'Text Fade',
      category: '進場與顯示',
      tags: ['JavaScript', 'Text'],
      preview: 'text-fade',
      href: `${baseUrl}js-effects/text-fade/`
    },
    {
      title: 'Object Fade Active',
      category: '進場與顯示',
      tags: ['JavaScript', 'Observer'],
      preview: 'object-fade',
      href: `${baseUrl}js-effects/object-fade-active/`
    },
    {
      title: 'Parallax Image',
      category: '捲動效果',
      tags: ['JavaScript', 'Parallax'],
      preview: 'parallax',
      href: `${baseUrl}js-effects/parallax/`
    },
    {
      title: 'Horizontal Scroll',
      category: '捲動效果',
      tags: ['GSAP', 'ScrollTrigger', 'Lenis'],
      preview: 'horizontal',
      href: `${baseUrl}ui-patterns/horizontal-scroll/`
    },
    {
      title: 'Dramatic Diagonal Carousel',
      category: '輪播與切換',
      tags: ['CSS Transform', 'JavaScript'],
      preview: 'carousel',
      href: `${baseUrl}ui-patterns/dramatic-diagonal-carousel/`
    },
    {
      title: 'Infinite Drag Grid',
      category: '拖曳與探索',
      tags: ['GSAP', 'Draggable'],
      preview: 'drag-grid',
      href: `${baseUrl}ui-patterns/infinite-drag-grid/`
    },
    {
      title: 'Number Scroll',
      category: '數字與資料',
      tags: ['GSAP', 'Number'],
      preview: 'number',
      href: `${baseUrl}js-effects/number-scroll/`
    },
    {
      title: 'SVG Line Drawing',
      category: '圖形與線條',
      tags: ['SVG', 'JavaScript'],
      preview: 'line',
      href: `${baseUrl}js-effects/svg-line-grow/`
    },
    {
      title: 'WebGL Image Reveal',
      category: '圖片與材質',
      tags: ['WebGL', 'PixiJS'],
      preview: 'image-reveal',
      href: `${baseUrl}js-effects/webgl-image-reveal/`
    },
    {
      title: 'Custom Scrollbar',
      category: '捲動介面',
      tags: ['JavaScript', 'Scrollbar'],
      preview: 'scrollbar',
      href: `${baseUrl}js-effects/custom-scrollbar/`
    },
    {
      title: 'Subgrid Alignment',
      category: '版面配置',
      tags: ['CSS Grid', 'Subgrid'],
      preview: 'subgrid',
      href: `${baseUrl}ui-patterns/grid-subgrid/`
    }
  ];
}
