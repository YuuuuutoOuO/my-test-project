# 🛡️ 數位領域：終極腦錢包 (Brainwallet & Toolkit)

這是一個追求 **「極致安全、絕對離線、零資料庫」** 的客戶端 (Client-side) 數位資產生成工具。
透過結合高熵值演算法與獨特的「文化防火牆 (注音符號)」，將你的大腦轉化為世界上最安全的硬體錢包。

---

## 🚀 核心設計理念

* **100% 離線執行 (Air-gapped Ready)**：所有核心加密套件 (`crypto-js`, `elliptic`) 皆已實體化至本機 `lib/` 目錄。拔除網路線、關閉 Wi-Fi，依然能完美運算。斷絕所有供應鏈攻擊 (Supply Chain Attack) 的風險。
* **無伺服器、無資料庫**：沒有 Firebase、沒有後端 API。你的密碼與私鑰「生成即銷毀」，只存在於當下瀏覽器的記憶體中。
* **文化防火牆 (Bopomofo Defense)**：利用台灣特有的注音符號作為高熵值輸入 (High Entropy Seed)。在 UTF-8 編碼下，注音的字元集與位元組特性，能完美免疫絕大多數針對英文與拼音的暴力字典攻擊 (Dictionary Attacks) 與彩虹表 (Rainbow Tables)。
* **多層語意鹽值 (Semantic Salt)**：拋棄危險的個人識別資訊 (PII)，改用如「PSA10 卡片編號」、「只有自己懂的童年味道」等非預期資料作為鹽值，達成降維打擊般的安全防護。

---

## 🛠️ 三大模組功能

### 1. 🔑 Passwords (高強度密碼生成器)
利用 SHA-256 雜湊演算法，將「服務名稱 + 腦秘密 + 鹽值」轉化為多種規格的密碼：
* `8-Char Alpha`：適用於一般老舊網站。
* `12-Char Alpha`：高強度英數混合。
* `24-Char Full`：**GODLIKE** 級別全字元密碼 (157+ bits 熵值)，駭客破到宇宙毀滅都算不出來。
* `12-Digit PIN`：純數字防護，適用於提款卡或手機解鎖。
* *附帶即時安全強度分析儀表板。*

### 2. ₿ Bitcoin (比特幣冷錢包)
基於 Secp256k1 橢圓曲線與 Base58Check 編碼，實作標準比特幣金鑰對：
* **Private Key (WIF)**：可直接匯入主流錢包 (如 Trust Wallet, Electrum)。
* **Public Key (Hex)**：壓縮格式公鑰。
* **BTC Address (Legacy)**：標準 `1` 開頭之比特幣接收地址。

### 3. 📈 Stocks (股票攤平計算機)
專為投資盯盤設計的即時運算模組：
* 輸入目前持有成本與預計加碼的股數/價格，無須按鈕，**即時顯示**攤平後的平均成本。

---

## 📂 專案目錄結構

\`\`\`text
my-brainwallet/
├── index.html            # 網站主介面 (UI 結構)
├── manifest.json         # PWA 漸進式網頁應用程式設定
├── sw.js                 # Service Worker (負責快取，掌控絕對離線能力)
├── README.md             # 專案說明文件
├── js/
│   └── app.js            # 核心運算邏輯與 DOM 操作
└── lib/                  # 實體化的第三方加密引擎
    ├── crypto-js.min.js  # 負責 SHA-256, RIPEMD-160 等雜湊運算
    ├── ripemd160.min.js  # 補齊 BTC 地址生成所需之演算法
    └── elliptic.min.js   # 負責 Secp256k1 橢圓曲線公私鑰推導
\`\`\`

---

## 💻 部署與使用方式

### A. 日常使用 (GitHub Pages)
1. 將此專案推送到 GitHub。
2. 於 Repository Settings 中開啟 GitHub Pages，指向 `main` 分支。
3. 首次載入後，`sw.js` 會將檔案快取至本機。往後即使手機處於飛航模式，仍可當作本機 App 開啟。

### B. 極致安全使用 (實體隔離 Air-gapped)
1. 將整包專案下載至隨身碟。
2. 插入一台**從未連上網路**的乾淨電腦 (Live OS 佳)。
3. 直接雙擊 `index.html`，輸入配方生成 BTC 私鑰並抄寫於紙上。
4. 關閉電腦，數位痕跡將徹底消失。

---

## ⚠️ 免責聲明與安全守則

1. **請勿遺忘你的配方**：密碼學是無情的。只要打錯一個注音的聲調位置，或是少打一個空白鍵，產生的錢包與密碼將完全不同。請務必牢記你的「輸入順序與邏輯」。
2. **資金風險自負**：本工具開源且所有運算皆於前端執行，開發者不對任何個人操作失誤或電腦中過早潛伏的惡意軟體 (Keylogger) 所導致的資產損失負責。大額加密貨幣資產，強烈建議搭配前述的「實體隔離」方式生成。

**Keep your secret safe. Enjoy the absolute zero-knowledge security.**