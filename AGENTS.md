## 專案規範：依任務載入、完成前核對

新任務先讀 [規範入口](docs/README.md)，依工作流讀取適用文件；不再固定全讀設計、頁面與用語三份文件。跨領域任務取所需文件聯集，新增效果依入口的完整流程執行。

1. 修改前簡述已讀文件及適用規則。同任務文件未變更時不重讀；更新後核對受影響段落。
2. 以使用者最新指示及已確認規範為準；程式行為、歷史紀錄與待定事項不能替代正式決策。
3. 新決策寫入唯一責任文件；其他位置改用引用。規範允許的實作細節自行決定；僅釐清無法由現有指示解決且影響結果的衝突。
4. 所需文件缺失時先定位；仍缺失則說明並暫停依賴部分，繼續不受影響工作。
5. 完成前核對本次受影響的規範及驗收；回報已驗證、未驗證與不符合項目。

AGENTS.md 與 CLAUDE.md 在目前工作區為同一份檔案的硬連結，修改其中一份即可；維持兩個入口內容相同。

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
