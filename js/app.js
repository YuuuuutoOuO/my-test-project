// ==========================================
// 全域變數與設定
// ==========================================
let currentMode = 'pass';
let realPasswords = {};
const charsets = {
    alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
    full: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?",
    num: "0123456789"
};

// ==========================================
// 模式切換邏輯 (密碼 / BTC / 股票)
// ==========================================
function switchMode(mode) {
    currentMode = mode;
    
    // 1. 更新上方按鈕樣式
    ['tabPass', 'tabBTC', 'tabStock'].forEach(id => {
        document.getElementById(id).className = 'tab-inactive px-4 py-2 rounded-xl text-xs font-black uppercase transition-all';
    });
    const activeTab = mode === 'pass' ? 'tabPass' : (mode === 'btc' ? 'tabBTC' : 'tabStock');
    document.getElementById(activeTab).className = 'tab-active px-4 py-2 rounded-xl text-xs font-black uppercase transition-all';

    // 2. 切換大標題
    const titles = { pass: 'BRAINWALLET', btc: 'BITCOIN WALLET', stock: 'STOCK AVERAGE' };
    document.getElementById('mainTitle').innerText = titles[mode];

    // 3. 切換顯示的區塊
    const isCrypto = (mode === 'pass' || mode === 'btc');
    document.getElementById('cryptoSection').classList.toggle('hidden', !isCrypto);
    document.getElementById('stockSection').classList.toggle('hidden', isCrypto);

    if (isCrypto) {
        document.getElementById('modePass').classList.toggle('hidden', mode !== 'pass');
        document.getElementById('modeBTC').classList.toggle('hidden', mode !== 'btc');
    }
}

// ==========================================
// 股票計算機邏輯 (即時運算)
// ==========================================
function calcStock() {
    const A = parseFloat(document.getElementById('stockA').value) || 0;
    const B = parseFloat(document.getElementById('stockB').value) || 0;
    const C = parseFloat(document.getElementById('stockC').value) || 0;
    const D = parseFloat(document.getElementById('stockD').value) || 0;

    const totalShares = B + D;
    let avg = 0;

    if (totalShares > 0) {
        avg = ((A * B) + (C * D)) / totalShares;
    }

    document.getElementById('stockResult').value = avg > 0 ? avg.toFixed(2) : "0.00";
}

// ==========================================
// 密碼與 BTC 加密共用工具
// ==========================================
function autoShow(el) {
    el.style.webkitTextSecurity = 'none';
    const btn = el.nextElementSibling;
    if(btn) { btn.innerHTML = '🙈'; btn.classList.add('text-blue-400'); }
}

function autoHide(el) {
    setTimeout(() => {
        el.style.webkitTextSecurity = 'disc';
        const btn = el.nextElementSibling;
        if(btn) { btn.innerHTML = '👁️'; btn.classList.remove('text-blue-400'); }
    }, 200);
}

function toggleView(id) {
    const el = document.getElementById(id);
    const btn = el.nextElementSibling;
    if (el.style.webkitTextSecurity === 'none') {
        el.style.webkitTextSecurity = 'disc';
        btn.innerHTML = '👁️'; btn.classList.remove('text-blue-400');
    } else {
        el.style.webkitTextSecurity = 'none';
        btn.innerHTML = '🙈'; btn.classList.add('text-blue-400');
    }
}

// 輔助工具：將 Uint8Array 安全地轉為 Hex 字串，防止 CryptoJS 解析失敗
function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

function base58Check(payloadArray) {
    const payloadHex = toHexString(payloadArray);
    const wa = CryptoJS.enc.Hex.parse(payloadHex);
    const hash1 = CryptoJS.SHA256(wa);
    const hash2 = CryptoJS.SHA256(hash1);
    const checksum = hash2.toString(CryptoJS.enc.Hex).substring(0, 8);
    
    const totalHex = payloadHex + checksum;
    const finalBuffer = new Uint8Array(totalHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    
    const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let digits = [0];
    for (let i = 0; i < finalBuffer.length; i++) {
        for (let j = 0; j < digits.length; j++) digits[j] <<= 8;
        digits[0] += finalBuffer[i];
        let carry = 0;
        for (let j = 0; j < digits.length; j++) {
            digits[j] += carry;
            carry = (digits[j] / 58) | 0;
            digits[j] %= 58;
        }
        while (carry) { digits.push(carry % 58); carry = (carry / 58) | 0; }
    }
    let res = '';
    for (let i = 0; finalBuffer[i] === 0 && i < finalBuffer.length - 1; i++) res += ALPHABET[0];
    for (let i = digits.length - 1; i >= 0; i--) res += ALPHABET[digits[i]];
    return res;
}

// ==========================================
// 加密生成核心 (Passwords & BTC)
// ==========================================
async function executeAction() {
    try {
        const svc = document.getElementById('service').value.toLowerCase().trim();
        const key = document.getElementById('masterKey').value;
        const salt = document.getElementById('userSalt').value;
        if (!svc || !key) return alert("請填寫必要欄位！");
        
        const base = svc + key + salt;
        const encoder = new TextEncoder();

        if (currentMode === 'pass') {
            const getPwd = async (s, c, l) => {
                const h = await crypto.subtle.digest('SHA-256', encoder.encode(base + s));
                const arr = new Uint8Array(h);
                let r = ""; for(let i=0; i<l; i++) r += c.charAt(arr[i % 32] % c.length);
                return r;
            };
            realPasswords.res8Alpha = await getPwd("@a8", charsets.alpha, 8);
            realPasswords.res12Alpha = await getPwd("@a12", charsets.alpha, 12);
            realPasswords.res24Full = await getPwd("@f24", charsets.full, 24);
            const nH = await crypto.subtle.digest('SHA-256', encoder.encode(base + "@n12"));
            realPasswords.resNum = BigInt('0x' + Array.from(new Uint8Array(nH)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0,16)).toString().substring(0,12);

            ['res8Alpha', 'res12Alpha', 'res24Full', 'resNum'].forEach(id => {
                const mask = id.includes('24') ? [4,4] : [3,3];
                document.getElementById(id).value = realPasswords[id].substring(0,mask[0]) + "****" + realPasswords[id].slice(-mask[1]);
            });
            document.getElementById('strengthContainer').classList.remove('hidden');
            document.getElementById('strengthBar').style.width = '100%';
            document.getElementById('strengthText').innerText = 'GODLIKE 🛡️';
        } else {
            const seed = await crypto.subtle.digest('SHA-256', encoder.encode(base + "@btc-wallet"));
            const privBytes = new Uint8Array(seed);
            const privHex = toHexString(privBytes);
            
            const wifData = new Uint8Array([0x80, ...privBytes, 0x01]);
            realPasswords.btcPriv = base58Check(wifData);
            
            const ec = new elliptic.ec('secp256k1');
            const keyPair = ec.keyFromPrivate(privHex);
            const pubHex = keyPair.getPublic(true, 'hex');
            realPasswords.btcPub = pubHex;
            
            const sha256Pub = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(pubHex));
            const ripemd160Hex = CryptoJS.RIPEMD160(sha256Pub).toString(CryptoJS.enc.Hex);
            
            const addrDataArray = [0x00];
            for (let i = 0; i < ripemd160Hex.length; i += 2) {
                addrDataArray.push(parseInt(ripemd160Hex.substring(i, i + 2), 16));
            }
            const addrData = new Uint8Array(addrDataArray);
            realPasswords.btcAddr = base58Check(addrData);

            ['btcPriv', 'btcPub', 'btcAddr'].forEach(id => {
                const mask = id === 'btcPub' ? [6,6] : [4,4];
                document.getElementById(id).value = realPasswords[id].substring(0,mask[0]) + "****" + realPasswords[id].slice(-mask[1]);
            });
        }
    } catch (e) {
        console.error(e);
        alert("運算發生錯誤！請確保您在有網路的環境下執行，以便載入加密組件。");
    }
}

function toggleResultView(id, btnId) {
    const el = document.getElementById(id);
    if (el.value.includes('****')) {
        el.value = realPasswords[id];
        document.getElementById(btnId).innerText = "🙈";
    } else {
        const mask = id.includes('24') || id === 'btcPub' ? [4,4] : [3,3];
        el.value = realPasswords[id].substring(0, mask[0]) + "****" + realPasswords[id].slice(-mask[1]);
        document.getElementById(btnId).innerText = "👁️";
    }
}

function copy(id) {
    navigator.clipboard.writeText(realPasswords[id]);
    const btn = event.currentTarget;
    btn.innerText = "✅"; setTimeout(() => btn.innerText = "📋", 1000);
}