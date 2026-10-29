# UI 庫素材紀錄與維護

範圍：歷史封面與素材來源，只在處理素材時讀取。列表目前使用實際效果；執行規則見 [預覽與互動](preview-interaction.md)。

2026-10-29：以下 14 張 WebP 封面擷取自本專案正在執行的展示頁，未使用競品素材或另造示意動畫。輸出尺寸皆為 800 × 500（16:10），WebP 品質 85。

## 素材來源

檔案位於 `public/ui-previews/`，名稱為下表 ID 加上 `.webp`。來源路徑需加上部署 base `/one-page-tool/`。

| ID | 擷取來源 | 畫面狀態 |
| --- | --- | --- |
| news-nav | `/js-effects/news-nav/` | 分類導覽與選取圓點 |
| page-link-highlight | `/js-effects/page-link-highlight/` | 第三方平台架構說明；此項為文件截圖 |
| text-fade | `/js-effects/text-fade/` | 捲入文字效果展示 |
| text-fade-module | `/demos/text-fade-module/` | 逐字淡入完成 |
| object-fade-active | `/js-effects/object-fade-active/` | 捲入卡片展示 |
| parallax | `/js-effects/parallax/` | 捲入視差圖片 |
| horizontal-scroll | `/demos/horizontal-scroll/` | 橫向卡片進入固定舞台 |
| dramatic-diagonal-carousel | `/demos/dramatic-diagonal-carousel/` | 圖片載入後的斜角輪播 |
| infinite-drag-grid | `/demos/infinite-drag-grid/` | 圖片載入後的拖曳網格 |
| number-scroll | `/js-effects/number-scroll/` | 數值展示 |
| svg-line-grow | `/js-effects/svg-line-grow/` | SVG 路徑繪製中 |
| webgl-image-reveal | `/js-effects/webgl-image-reveal/` | 貼圖載入並播放還原後 |
| custom-scrollbar | `/js-effects/custom-scrollbar/` | 閱讀面板與右側滑塊 |
| grid-subgrid | `/demos/grid-subgrid/` | 三張卡片與跨列對齊 |

圖片類展示沿用各頁原有的 Unsplash／Picsum 圖片，詳細來源仍以展示頁的資料與標示為準。

## 更新方式

1. 開啟對應展示頁，等待圖片與字型載入，透過正常操作進入可辨識的效果狀態。
2. 擷取實際畫面，裁切到效果區，排除側欄、瀏覽器介面與開發工具列。
3. 以 16:10 輸出 800 × 500 WebP；需要保留完整內容時使用等比縮放與留白，避免裁掉關鍵效果。
4. 更新 `src/data/ui-showcase.js` 的 `media.image`，填入 `ui-previews/<id>.webp`；檢查素材尺寸及部署 base 下的檔案網址；素材欄位不改變即時展示模式。
5. 有真實錄製的 WebM 時再填入 `media.video`，保留 WebP 為封面。影片欄位僅記錄素材；若要啟用影片展示，須另訂使用情境與驗收。

目前全數為靜態封面，`media.video` 保留 `null`。沒有素材時欄位保留 null，列表照既有實際效果展示。

## 使用狀態更新

即時預覽上線後，以上封面保留作歷史素材與後續備用，不再作列表卡片的主要展示。Subgrid Alignment 的封面保留作歷史素材，該項目已移出列表。
