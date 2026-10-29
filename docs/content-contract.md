# UI 內容資料與分類契約

範圍：項目資料、搜尋、篩選及網址。用語定義見 [CONTEXT.md](../CONTEXT.md)，介面位置見 [頁面規格](page-spec.md)。

## 分類規則

- 三個篩選維度：類型、觸發方式、技術。每組多選採 OR，跨組採 AND。
- 效果保留為卡片標籤與關鍵字搜尋資料，不作篩選維度。
- 觸發方式按詳細頁的實際啟動行為分類；列表自動示範與一般重播按鈕不影響分類。
- 觸發選項依序：自動播放、進入可視區、捲動連動、hover、點擊、長按、拖曳；只顯示資料中有使用的選項。
- Page Link Highlight 為文件，triggers 為空陣列；未選觸發方式時仍顯示。
- Number Scroll 依目前初始化播放歸自動播放；SVG Line Grow 歸進入可視區，循環不另列觸發方式。
- Infinite Drag Grid 類型為卡片、版面；Dock 為導覽、按鈕；其他單項分類查資料來源，避免另維護完整分類表。
- Subgrid Alignment 已自所有列表移除，不因保留路由或素材而重新收錄。

## 資料來源與欄位

- 列表組裝入口為 `src/data/ui-showcase.js`；按鈕群資料來自 `src/data/button-effects.js`，效果說明及版面資料沿用其既有來源。
- 每筆提供 `effects`、`types`、`triggers`、`packages` 陣列；packages 對外稱「技術」，保留欄位名稱相容性。
- `preview.kind`：inline（本地共用效果）、scene（原效果場景）、document（文件）。`preview.mode`：auto 或 static。
- `media.image`、`media.video` 為素材紀錄；沒有素材時保留 null，不以封面替代即時效果。素材維護才讀 [素材紀錄](preview-assets.md)。
- 本地素材放 public，欄位使用相對 public 路徑，組裝時補部署 base；也可使用完整 HTTPS 網址。
- 簡述應說明動作、觸發方式或適用場景，支援用途搜尋；列表維持最多兩行。
- 項目總數與完整分類以實際資料為準，規範不快取總數。

## 網址與搜尋

- 使用可重複的 types、triggers、packages 及 q；開啟網址應還原條件。
- 舊 `triggers=懸停` 正規化為 `triggers=hover`；移除舊 effects、category 參數，不推測轉換。
- 搜尋包含名稱、簡述、效果與技術等既有內容，忽略英文大小寫與前後空白；可與分類組合。

## 驗收

新增或變更項目時核對分類、搜尋、OR／AND、網址相容性、部署 base 與詳細路由。文件項目及已移除項目須保持上述例外。
