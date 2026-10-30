# 搜尋框瀏覽器回歸

需正在執行的 Astro 開發伺服器。測試頁使用實際 CSS、效果模組、控制權管理器及互動模擬器；檢查每次開關 200ms 時仍有中間影格。

1. 暫時將 `tests/browser/search-regression.html` 複製至 `public/search-regression.html`。
2. 瀏覽 `/one-page-tool/search-regression.html?variant=expand&preview=1` 及 `?variant=morph&preview=1`。
3. 約 10 秒後兩者皆須顯示 `pass: true`；移除 `preview=1` 可獨立檢查效果。測試時使用前景頁面並關閉減少動態偏好。
4. 完成後移除暫存的 `public/search-regression.html`，避免發布測試頁。

回歸涵蓋非同步方向更新造成收合跳至起點，以及 focusin 接管在切換方向前觸發 play 造成展開跳至終點。
