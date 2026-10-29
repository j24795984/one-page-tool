# One Page Tool

個人前端資源庫。目前實作 UI 庫與小工具，字體庫仍待規劃；UI 庫依「效果、類型、套件」篩選。分類定義見 [CONTEXT.md](CONTEXT.md)，已確認的版面與互動規則見 [設計規範](docs/design-guidelines.md)及[頁面規格](docs/page-spec.md)。

## 資料夾對照

```text
one-page-tool/
├─ docs/                    設計與頁面規格
├─ public/                  不經打包、直接提供給瀏覽器的檔案
│  └─ demos/                獨立 HTML 展示，例如 news-nav-demo.html
├─ scripts/                 專案建置後處理程式
├─ src/
│  ├─ components/           共用介面、詳細頁版型與效果展示元件
│  ├─ data/                 UI 卡片、UI pattern、工具與效果說明資料
│  │  └─ js-effects/        JS 效果的說明 JSON
│  ├─ layouts/              Astro 共用頁面版型
│  ├─ pages/                網址對應的頁面與下載端點
│  │  ├─ ui/                UI 庫列表
│  │  ├─ js-effects/        部分 UI 效果詳細頁（既有網址）
│  │  ├─ ui-patterns/       其他 UI 效果詳細頁（既有網址）
│  │  ├─ demos/             可獨立開啟的展示頁
│  │  ├─ downloads/         由原始程式產生的下載檔
│  │  └─ tools/             小工具列表及詳細頁
│  ├─ scripts/              效果與篩選使用的 JavaScript 原始碼
│  └─ styles/               共用及各效果樣式
├─ tests/                   現有功能測試
├─ astro.config.mjs         Astro 設定與部署 base
└─ package.json             套件與指令
```

`dist/`、`.astro/`、`node_modules/` 是產出或依賴目錄，不編輯其中的檔案。`src/pages/js-effects/` 與 `src/pages/ui-patterns/` 都屬於網站上的「UI 庫」；保留兩組既有網址，網站分類以資料欄位為準。

## 一筆 UI 內容放在哪裡

1. 在 [`src/data/ui-showcase.js`](src/data/ui-showcase.js) 登錄卡片、詳細頁網址，以及 `effects`、`types`、`packages`。所有列表使用與內頁高度一致的效果區，自動演示、不互動，排除頁面標題／說明／返回及工具列；完整操作在詳細頁；以 `preview.kind`（inline／scene／document）與 `preview.mode`（auto／static）定義方式，不在列表嵌入完整頁面；`media.image`／`media.video` 保留素材紀錄。執行限制與驗收見 [預覽實作計畫](docs/live-preview-plan.md)。
2. JS 效果的說明放在 `src/data/js-effects/<slug>.json`，包含標題、摘要、引入方式與控制項目；既有 UI pattern 的說明資料則在 `src/data/ui-patterns.js`。詳細頁依既有網址放在 `src/pages/js-effects/<slug>/` 或 `src/pages/ui-patterns/<slug>/`。
3. 可重用的效果程式放在 `src/scripts/`，對應樣式放在 `src/styles/`；互動展示元件放在 `src/components/`。
4. 獨立展示放在 `src/pages/demos/<slug>/`。原生 HTML 若要保持原檔直接展示，放在 `public/demos/`。WebP／WebM 預覽素材放在 `public/`，於資料欄位填相對於 `public/` 的路徑。
5. 下載檔若與 `src/scripts/` 的程式相同，以該程式為唯一來源，從 `src/pages/downloads/` 提供下載，避免手動維護第二份副本。

目前的例子：分類導覽的原生 HTML 位於 `public/demos/news-nav-demo.html`；Text Fade Module 原始碼位於 `src/scripts/text-fade-module.mjs`，其展示頁和下載端點分別位於 `src/pages/demos/text-fade-module/`、`src/pages/downloads/text-fade.mjs.ts`。

## 開發

專案使用 npm，不使用 pnpm。依專案指示，需要本地伺服器與自動編譯時才啟動 `astro dev --background`；其他開發與驗收規則見 [AGENTS.md](AGENTS.md)。
