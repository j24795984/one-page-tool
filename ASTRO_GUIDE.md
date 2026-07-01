# Astro 專案開發與部署指南

這份指南將說明如何在目前的 `one-page-tool` 專案中使用 Astro 進行本機開發、建立新網頁、進行編譯以及部署。

---

## 1. 本機開發與檢視 (Local Development)

目前專案已經支援兩種啟動本地伺服器的方式：

### 方式 A：背景模式 (推薦)
依據專案規範，您可以將伺服器啟動於系統背景，這不會佔用您的終端機視窗：

* **啟動伺服器**：
  ```bash
  npx astro dev --background
  ```
* **管理背景伺服器**：
  * **檢查狀態**：`npx astro dev status` (查看伺服器是否正常運行)
  * **查看日誌**：`npx astro dev logs` (查看錯誤或載入資訊)
  * **停止伺服器**：`npx astro dev stop`

### 方式 B：前台互動模式
如果您想即時看見終端機輸出的偵錯訊息，可以使用標準命令：
```bash
npm run dev
# 或 npx astro dev
```
* 按下 `q` + `Enter` 可停止伺服器。

👉 啟動後，請在瀏覽器打開網址：**`http://localhost:4321`**

---

## 2. 專案目錄結構說明

目前專案的結構如下：
```text
one-page-tool/
├── src/
│   ├── pages/                   # 網頁路由目錄
│   │   ├── index.astro          # 入口首頁 (http://localhost:4321/)
│   │   └── tools/
│   │       └── view-lottie-animate/
│   │           └── index.astro  # Lottie 工具頁 (http://localhost:4321/tools/view-lottie-animate)
│   └── styles/
│       └── global.css           # 全域 CSS (包含 Tailwind V4 配置)
├── public/                      # 靜態資源目錄 (圖片、favicon，不經過編譯直接複製)
├── astro.config.mjs             # Astro 核心設定檔
├── package.json                 # Node.js 專案依賴管理
└── tsconfig.json                # TypeScript 設定
```

---

## 3. 如何新增網頁與元件 (Routing & Components)

### 新增頁面 (Routing)
Astro 使用 **檔案架構路由 (File-based Routing)**，您只要在 `src/pages/` 中建立檔案，它就會自動生成對應的網址。

* **新增多頁面工具**：
  1. 在 `src/pages/tools/` 下新建資料夾，例如 `image-compressor`。
  2. 建立 `index.astro` 檔案：`src/pages/tools/image-compressor/index.astro`。
  3. 這時造訪 `http://localhost:4321/tools/image-compressor` 就會是您的新頁面！

* **Astro 檔案結構**：
  Astro 檔案主要分為兩部分：
  ```astro
  ---
  // 1. Frontmatter 區塊 (使用三個減號包覆)
  // 這部分的 JavaScript/TypeScript 只在「編譯期」或「伺服器端」執行。
  // 您可以在這裡 import 元件、CSS，或是處理靜態資料。
  import '../../../styles/global.css'; 
  ---

  <!-- 2. HTML 區塊 -->
  <!-- 這裡寫您一般的 HTML。您可以在這裡寫 Tailwind class，它會自動被編譯。 -->
  <html lang="zh-TW">
    <body>
      <h1 class="text-3xl font-bold text-blue-600">我的新工具</h1>
      
      <!-- 3. 用戶端 JS 區塊 (Astro 會自動幫您打包 bundle) -->
      <script>
        console.log("這段程式碼會在瀏覽器端執行！");
      </script>
    </body>
  </html>
  ```

---

## 4. 建立編譯與生產環境測試 (Build & Preview)

當開發完成，準備上傳部署到靜態平台（如 GitHub Pages）時，需要將專案編譯成純網頁檔。

### 第一步：執行編譯
在根目錄下執行：
```bash
npm run build
# 或 npx astro build
```
* **結果**：Astro 會在根目錄下產生一個 `dist/` 資料夾。這個資料夾內就是純靜態的 `HTML`、`CSS` 和 `JS`。

### 第二步：本機預覽編譯結果
為了確保打包出來的檔案沒有任何路徑或載入錯誤，建議在發布前先預覽：
```bash
npm run preview
# 或 npx astro preview
```
👉 這會啟動一個本地伺服器，專門用來讀取 `dist/` 資料夾，讓您進行最終確認。

---

## 5. 部署到 GitHub Pages (Git 靜態平台)

若要部署到 GitHub Pages 等非網域根目錄的平台（例如網址為 `https://username.github.io/one-page-tool/`），需要做以下兩項設定：

### 1. 修改 `astro.config.mjs`
您需要指定專案的 `site` (個人網域) 和 `base` (專案子目錄路徑)：
```javascript
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // 替換為您的 GitHub Pages 網址與路徑
  site: 'https://<YOUR_GITHUB_USERNAME>.github.io',
  base: '/one-page-tool', 
  vite: {
    plugins: [tailwindcss()]
  }
});
```

### 2. 上傳部署
您只需要將編譯產生的 **`dist/` 資料夾內的所有內容** 上傳到您 GitHub 倉庫的部署分支（例如 `gh-pages` 分支），或者使用 GitHub Actions 自動編譯發布即可！
