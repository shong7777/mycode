面試題-文字聊天室

使用ajax介接php PDO 用以查詢、新增mysql資料
以前端網頁定時request刷新會話內容
首次開啟網頁需輸入暱稱才能加入聊天室，暱稱儲存在session以供調用，session未消失前重複登入不須重新輸入暱稱。
暱稱限制不得為空白或超過20字元。(utf8編碼)
登入未完成網頁顯示登入中。
登入成功後會傳送訊息給所有人，並顯示聊天介面。
聊天室窗內包含顯示區、文字框、送出按鈕、清除按鈕、日間模式按鈕、夜間模式按鈕。
文字框輸入限制不可為空白或超過50字元(utf8編碼)。
在fucus文字框時可使用enter觸發送出訊息。
送出按鈕以及enter在送出訊息未處理完成前會失去送出訊息功能，避免重複送出。
訊息送出完成後會將文字框內容清空。
清除按鈕點擊後會將文字框內容清空。
每指定時間內會刷新聊天內容，送出訊息完成後也會刷新。
日間模式按鈕點擊後會將背景與文字顏色替換成日間配色。
夜間模式按鈕點擊後會將背景與文字顏色替換成夜間配色。
支援手機rwd(包含safari)