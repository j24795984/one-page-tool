export function getPatternDetails(baseUrl) {
  return [
  {
    subtitle: '斜角構圖、時間軸與滑動切換介面',
    description: '以斜切遮罩建立具有編輯感的輪播構圖，並用垂直時間軸呈現各張內容的位置。適合攝影、建築或品牌作品集等需要強烈視覺節奏的全頁展示。',
    effect: '畫面以大型斜切影像作為視覺核心，切換時圖片、遮罩與文字依序移動，右側時間點同步標示目前內容。使用者可以點擊時間點或操作輪播，在不同作品之間建立具有方向感的過場。',
    useCase: '適合攝影集、建築案例、品牌形象與活動主視覺。當內容數量不多，但每一筆都需要大幅影像與強烈敘事感時特別合適。',
    technologies: ['CSS Transform', 'CSS Transition', '原生 JavaScript', 'Keyboard Control'],
    introduction: '沿用獨立展示中的 data-diagonal-carousel、data-slide 與 data-go-to 結構，引入 dramatic-diagonal-carousel.css；待 DOM 建立後載入 dramaticDiagonalCarousel.js。此實作不需要外部套件。',
    parameters: [
      { name: 'data-go-to', description: '指定要切換的 slide 索引，從 0 開始；時間點與 slide 順序需一致。' },
      { name: '--diagonal-duration', description: 'CSS 位移時間，預設 1100ms；變更時須同步調整 goTo() 中的操作鎖定時間。' },
      { name: '--diagonal-ease', description: 'CSS 位移緩動曲線；使用左右方向鍵或橫向滑動超過 40px 可切換。' }
    ],
    execution: [
      '先建立重疊的 slide 結構，將每張圖片放入斜切遮罩中，並讓非目前項目保持在舞台外或不可見狀態。',
      '依目前索引計算前一張與下一張內容，更新 slide、時間點及輔助文字的 active 狀態。',
      '更新 slide 的 data-state，由 CSS Transition 處理位移、縮放與透明度；圖片以反向旋轉補償斜角構圖。',
      '點擊右側時間點時切換到指定索引；鍵盤與滑動操作則依方向前進或返回一張。',
      '動畫完成後清除暫時狀態並解除操作鎖定，避免快速連點造成多組時間軸互相覆蓋。'
    ],
    href: `${baseUrl}ui-patterns/dramatic-diagonal-carousel/`
  },
  {
    subtitle: 'GSAP + ScrollTrigger 橫向作品展示',
    description: '將頁面的垂直捲動進度映射到橫向內容位移，搭配 Sticky 舞台與平滑捲動形成連續瀏覽體驗。此範例以桌面寬度為主要展示情境。',
    effect: '使用者仍以一般方式向下捲動，但進入展示區後，固定在視窗中的作品列會由右向左移動。當最後一張內容進入畫面，頁面才恢復垂直捲動並前往下一個段落。',
    useCase: '適合作品集、品牌歷程、產品系列與時間軸內容。建議用於桌面版，並為手機提供一般直向列表，避免狹窄畫面中的橫向內容過度壓縮。',
    technologies: ['CSS Sticky', 'GSAP', 'ScrollTrigger', 'Lenis'],
    introduction: '沿用獨立展示的 section、stage 與 list 三層結構，引入 horizontal-scroll.css、lenis/dist/lenis.css，並載入 GSAP、ScrollTrigger 與 Lenis。此展示在寬度大於 600px 且未啟用減少動態時執行。',
    parameters: [
      { name: '.js-horizontal-section / stage / list', description: '分別對應捲動區間、固定舞台與橫向列表；這三個元素決定移動範圍。' },
      { name: 'scrub', description: '目前為 true，讓水平位移與捲動進度同步。' },
      { name: '--horizontal-scroll-distance', description: '程式以列表總寬度減去舞台寬度自動計算，視窗尺寸改變時重新測量。' }
    ],
    execution: [
      '以外層 section 提供足夠的垂直捲動距離，內層 stage 使用 position: sticky 固定在視窗頂端。',
      '讀取橫向列表的 scrollWidth，再減去 stage 可視寬度，取得內容實際需要水平移動的總距離。',
      '將計算結果同步寫入外層高度，確保垂直捲動距離與橫向移動距離一致。',
      '建立 ScrollTrigger，把 section 的捲動進度映射到列表的 translateX，並使用 scrub 讓位移跟隨滾輪進度。',
      'Lenis 負責平滑捲動輸入，並與 GSAP ticker 及 ScrollTrigger 更新週期同步；視窗縮放時重新測量全部距離。'
    ],
    href: `${baseUrl}ui-patterns/horizontal-scroll/`
  },
  {
    subtitle: 'GSAP Draggable 無限循環卡片網格',
    description: '利用座標循環與拖曳慣性，讓卡片網格在各方向持續延伸。適合作品牆、靈感圖庫與需要自由探索感的視覺索引。',
    effect: '使用者可以往任意方向拖曳整片卡片牆，放手後會依拖曳速度繼續滑行。卡片離開一側邊界後會從另一側重新出現，因此視覺上沒有明確的起點與終點。',
    useCase: '適合作品探索、圖片靈感牆、品牌案例索引或藝術專案。內容需要以視覺探索為主，且不要求固定閱讀順序。',
    technologies: ['GSAP Draggable', 'InertiaPlugin', 'gsap.utils.wrap', 'quickSetter'],
    introduction: '建立 #viewport 與其內的 #grid-container，引入 infinite-drag-grid.css，載入 GSAP 並註冊 Draggable、InertiaPlugin。使用獨立展示中的初始化與 render 流程建立循環網格。',
    parameters: [
      { name: 'cardW / cardH / gap', description: 'JavaScript 預設為 320 / 220 / 24px；修改時需同步 CSS 的 --card-w、--card-h、--gap。' },
      { name: 'inertia', description: '目前為 true，放手後依拖曳速度繼續滑行，需要 InertiaPlugin。' },
      { name: 'background-image', description: '替換卡片圖片來源；實際專案可改用自己的圖片與標題資料。' }
    ],
    execution: [
      '根據視窗、卡片尺寸與間距計算需要生成的欄數及列數，並在畫面外額外建立緩衝卡片。',
      '記錄每張卡片的初始座標，使用 gsap.utils.wrap 建立 X、Y 軸的循環範圍。',
      'Draggable 只移動承載網格的容器，拖曳更新時再將容器位移加回每張卡片的初始座標。',
      '座標超出循環範圍時由 wrap 換算到另一側，並透過 quickSetter 直接更新 transform，降低大量卡片重繪的成本。',
      'InertiaPlugin 處理放手後的慣性；視窗尺寸改變時重新建立網格與循環邊界。'
    ],
    href: `${baseUrl}ui-patterns/infinite-drag-grid/`
  },
  {
    subtitle: 'Subgrid 軌道繼承與卡片欄位對齊',
    description: '示範巢狀元素如何繼承父層 Grid 軌道，以及不同內容長度的卡片如何共用列高，維持圖片、標題、內容與操作按鈕的一致對齊。',
    effect: '多張卡片即使標題與內文長度不同，圖片、標題、說明及底部按鈕仍會落在相同水平線。巢狀表單或內容群組也能直接沿用外層欄線，不必重複宣告每一欄寬度。',
    useCase: '適合方案比較、商品卡片、文章列表、規格表與需要跨層級對齊的表單。它解決的是內容結構不同、但視覺基準必須一致的版面問題。',
    technologies: ['CSS Grid', 'CSS Subgrid', 'Shared Row Tracks', 'Responsive Layout'],
    introduction: '使用 CSS Grid 建立父層共用軌道，讓子群組或卡片以 subgrid 繼承。獨立展示內含軌道繼承與卡片對齊的 HTML、CSS 範例，不需要 JavaScript 套件。',
    parameters: [
      { name: 'grid-template-columns', description: '決定父層欄數與欄寬；窄螢幕應改為較少欄數。' },
      { name: 'grid-row: span 4', description: '讓卡片跨越圖片、標題、內文與按鈕四列；結構增減時需同步調整。' },
      { name: 'grid-template-rows: subgrid', description: '讓同一排卡片共用列高，使內文長短不同時仍能對齊。' }
    ],
    execution: [
      '先在父層定義共用的欄或列軌道，讓所有需要互相對齊的項目位於同一個 Grid 格線系統。',
      '巢狀群組使用 grid-template-columns: subgrid，並跨越父層指定欄位，直接繼承父層欄寬與格線。',
      '卡片列表在父層建立圖片、標題、內容與操作區四列，每張卡片跨越四列並把 grid-template-rows 設為 subgrid。',
      '瀏覽器會以同一列中最高的內容決定列高，因此其他卡片的後續區塊自然維持一致對齊。',
      '在窄螢幕切換欄數或改為單欄排列，保留內容順序，同時避免固定欄寬造成水平溢出。'
    ],
    href: `${baseUrl}ui-patterns/grid-subgrid/`
  }
];
}
