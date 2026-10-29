export const buttonEffects = [
{
  "number": "166",
  "id": "dock-magnify",
  "title": "Dock 放大選單",
  "summary": "游標掃過時，附近圖示放大並向兩側讓位，背景外框維持固定高度。",
  "types": [
    "導覽",
    "按鈕"
  ],
  "triggers": [
    "hover"
  ],
  "effect": "放大",
  "instructions": "左右移動游標，圖示依距離向上放大並推開鄰項；離開後還原。背景外框高度固定。Tab 聚焦也可體驗，觸控點選可聚焦；範例不跳轉頁面，套用時可改為具名稱的連結。",
  "html": "<div class=\"dock-menu\" role=\"group\" aria-label=\"快捷選單\"><button type=\"button\" class=\"motion-button dock-item\" aria-label=\"首頁\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10\"/></svg></button><button type=\"button\" class=\"motion-button dock-item\" aria-label=\"搜尋\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0\"/></svg></button><button type=\"button\" class=\"motion-button dock-item\" aria-label=\"收藏\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z\"/></svg></button><button type=\"button\" class=\"motion-button dock-item\" aria-label=\"檔案\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 6h7l2 3h9v12H3ZM3 6V3h7l2 3\"/></svg></button><button type=\"button\" class=\"motion-button dock-item\" aria-label=\"圖片\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 3h18v18H3ZM3 17l6-6 4 4 3-3 5 5M16 7h.01\"/></svg></button><button type=\"button\" class=\"motion-button dock-item\" aria-label=\"訊息\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M3 3h18v14H9l-6 4Z\"/></svg></button><button type=\"button\" class=\"motion-button dock-item\" aria-label=\"個人\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 21v-2a8 8 0 0 1 16 0v2\"/></svg></button></div>"
},
  {
    "number": "095",
    "id": "magnetic-button",
    "title": "磁吸按鈕",
    "summary": "游標靠近時按鈕與文字以不同幅度輕微跟隨，離開後彈回原位。",
    "triggers": [
      "hover"
    ],
    "effect": "磁吸",
    "instructions": "將游標移到按鈕附近並移動，本體最多水平 12px、垂直 8px，文字額外跟隨 40%；離開作用範圍後一起彈回。觸控裝置保留一般按鈕操作。",
    "html": "<div class=\"button-magnetic-zone\"><button type=\"button\" class=\"motion-button\"><span class=\"button-label\">探索更多</span></button></div>"
  },
  {
    "number": "103",
    "id": "direction-aware-fill",
    "title": "游標擴散填滿按鈕",
    "summary": "底色由游標進入位置擴散填滿，離開時朝出口收回。",
    "triggers": [
      "hover"
    ],
    "effect": "填色",
    "instructions": "從不同方向移入、移出按鈕；鍵盤焦點從中央填滿。",
    "html": "<button type=\"button\" class=\"motion-button\"><span class=\"button-fill\" aria-hidden=\"true\"></span><span class=\"button-label\">立即聯絡</span></button>"
  },
  {
    "number": "110",
    "id": "rotating-border",
    "title": "旋轉光邊按鈕",
    "summary": "橘紅、紫與亮青色漸層沿按鈕邊框持續旋轉，帶出柔和光暈。",
    "triggers": [
      "自動播放"
    ],
    "effect": "光邊",
    "instructions": "進入畫面即自動旋轉，離屏與背景分頁暫停。",
    "html": "<button type=\"button\" class=\"motion-button\"><span class=\"button-border-clip\" aria-hidden=\"true\"><span class=\"button-border-light\"></span></span><span class=\"button-label\">開始使用</span></button>"
  },
  {
    "number": "234",
    "id": "ripple-click",
    "title": "按鈕漣漪回饋",
    "summary": "從點擊位置擴散漣漪，逐漸淡出，提供清楚的操作回饋。",
    "triggers": [
      "點擊"
    ],
    "effect": "漣漪",
    "instructions": "點選按鈕不同位置，或以 Enter / Space 從中央觸發；可連續操作。",
    "html": "<button type=\"button\" class=\"motion-button\"><span class=\"button-fill\" aria-hidden=\"true\"></span><span class=\"button-label\">送出表單</span></button>"
  },
  {
    "number": "236",
    "id": "hold-to-confirm",
    "title": "長按確認",
    "summary": "持續按住直到進度填滿才確認，提早放開會退回。",
    "triggers": [
      "長按"
    ],
    "effect": "進度填滿",
    "instructions": "按住滑鼠、觸控或 Enter / Space 1.2 秒完成確認。提早放開、移出、失焦或 Esc 取消。本示範不執行刪除或送出。",
    "html": "<button type=\"button\" class=\"motion-button\" aria-label=\"按住 1.2 秒確認\"><span class=\"button-fill\" aria-hidden=\"true\"></span><span class=\"button-label\" aria-live=\"polite\">按住確認</span></button>"
  },
  {
    "number": "237",
    "id": "icon-slide-button",
    "title": "箭頭接力按鈕",
    "summary": "右側箭頭滑出，左側新箭頭接力滑入，文字同步讓位。",
    "triggers": [
      "hover"
    ],
    "effect": "位移",
    "instructions": "滑入按鈕或使用 Tab 聚焦，箭頭和文字同步位移；離開後反向還原。",
    "html": "<button type=\"button\" class=\"motion-button\"><svg class=\"button-arrow button-arrow--in\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 12h15m-6-6 6 6-6 6\"/></svg><span class=\"button-label\">了解更多</span><svg class=\"button-arrow button-arrow--out\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 12h15m-6-6 6 6-6 6\"/></svg></button>"
  },
  {
    "number": "287",
    "id": "social-icon-fill",
    "title": "社群圖示填滿",
    "summary": "圓形圖示由下向上填色，圖示向上交替並輕微浮起。",
    "triggers": [
      "hover"
    ],
    "effect": "填色",
    "instructions": "滑入或以 Tab 聚焦任一圖示。這裡展示視覺效果，不開啟外部網站；套用時可將按鈕換成有名稱的連結。",
    "html": "<div class=\"social-buttons\"><button type=\"button\" class=\"motion-button\" aria-label=\"Instagram\"><span class=\"button-fill\" aria-hidden=\"true\"></span><svg class=\"social-icon social-icon--first\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M17 7h.01\"/></svg><svg class=\"social-icon social-icon--next\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M17 7h.01\"/></svg></button><button type=\"button\" class=\"motion-button\" aria-label=\"Threads\"><span class=\"button-fill\" aria-hidden=\"true\"></span><svg class=\"social-icon social-icon--first\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19 8c-1-5-12-6-14 1-2 7 2 12 8 11 7-1 7-10 0-10-6 0-6 7-2 7 4 0 6-10-1-10\"/></svg><svg class=\"social-icon social-icon--next\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19 8c-1-5-12-6-14 1-2 7 2 12 8 11 7-1 7-10 0-10-6 0-6 7-2 7 4 0 6-10-1-10\"/></svg></button><button type=\"button\" class=\"motion-button\" aria-label=\"Email\"><span class=\"button-fill\" aria-hidden=\"true\"></span><svg class=\"social-icon social-icon--first\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"m4 7 8 6 8-6\"/></svg><svg class=\"social-icon social-icon--next\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"m4 7 8 6 8-6\"/></svg></button><button type=\"button\" class=\"motion-button\" aria-label=\"Link\"><span class=\"button-fill\" aria-hidden=\"true\"></span><svg class=\"social-icon social-icon--first\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m10 14 4-4m-5 1-2 2a3.5 3.5 0 0 0 5 5l2-2m-4-8 2-2a3.5 3.5 0 0 1 5 5l-2 2\"/></svg><svg class=\"social-icon social-icon--next\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m10 14 4-4m-5 1-2 2a3.5 3.5 0 0 0 5 5l2-2m-4-8 2-2a3.5 3.5 0 0 1 5 5l-2 2\"/></svg></button></div>"
  }
];
