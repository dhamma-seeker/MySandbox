import { getLang, toggleLang, initLang, t } from '../../assets/i18n.js';
initLang();

// ============================================================
// Language chrome
// ============================================================
const langBtn = document.querySelector('.lang-btn');
function renderLangLabel() {
  if (langBtn) langBtn.textContent = getLang() === 'th' ? 'EN' : 'ไทย';
}
langBtn?.addEventListener('click', toggleLang);
document.addEventListener('langchange', () => {
  renderLangLabel();
  redrawAll();
  updateMainReadout(lastHoverIdx);
  applyScenarioNote();
});
renderLangLabel();

// ============================================================
// Datasets — real OHLCV (approximated for clarity)
// Format: [date, open, high, low, close, volume(M)]
// ============================================================
const DATA = {
  // AAPL Aug 1 – Nov 7, 2024 (70 trading days)
  aapl: {
    label: 'AAPL · Aug–Nov 2024',
    decimals: 2,
    volUnit: 'M',
    bars: [
      ['2024-08-01', 224.0, 224.40, 217.20, 218.40, 62],
      ['2024-08-02', 219.2, 225.60, 217.00, 219.90, 105],
      ['2024-08-05', 199.1, 213.50, 196.00, 209.30, 119],
      ['2024-08-06', 205.3, 209.40, 201.10, 207.20, 70],
      ['2024-08-07', 206.9, 213.60, 206.00, 209.80, 63],
      ['2024-08-08', 213.1, 214.20, 208.80, 213.30, 47],
      ['2024-08-09', 212.1, 216.80, 211.90, 216.20, 43],
      ['2024-08-12', 216.1, 219.50, 215.60, 217.50, 38],
      ['2024-08-13', 219.0, 222.00, 219.00, 221.30, 44],
      ['2024-08-14', 220.6, 223.00, 219.70, 221.70, 41],
      ['2024-08-15', 224.6, 225.40, 222.00, 224.70, 46],
      ['2024-08-16', 223.9, 226.80, 223.70, 226.00, 44],
      ['2024-08-19', 225.7, 225.90, 223.00, 225.90, 40],
      ['2024-08-20', 225.7, 227.20, 225.00, 226.50, 30],
      ['2024-08-21', 226.5, 226.80, 223.00, 226.40, 34],
      ['2024-08-22', 227.8, 228.30, 224.30, 224.50, 44],
      ['2024-08-23', 225.7, 228.20, 224.30, 226.80, 39],
      ['2024-08-26', 226.8, 227.30, 223.90, 227.20, 30],
      ['2024-08-27', 225.6, 228.90, 224.90, 228.00, 35],
      ['2024-08-28', 227.9, 229.90, 225.70, 226.50, 39],
      ['2024-08-29', 230.1, 232.90, 228.90, 229.80, 51],
      ['2024-08-30', 230.2, 230.40, 227.50, 229.00, 51],
      ['2024-09-03', 228.5, 229.00, 221.20, 222.80, 51],
      ['2024-09-04', 221.7, 224.00, 220.80, 222.00, 43],
      ['2024-09-05', 222.0, 223.00, 219.00, 222.40, 36],
      ['2024-09-06', 223.0, 225.00, 219.80, 220.80, 48],
      ['2024-09-09', 220.8, 221.30, 216.70, 220.90, 67],
      ['2024-09-10', 219.0, 223.00, 217.60, 220.10, 51],
      ['2024-09-11', 222.4, 223.10, 219.60, 222.70, 44],
      ['2024-09-12', 222.5, 223.50, 219.80, 222.80, 37],
      ['2024-09-13', 223.6, 224.00, 221.90, 222.50, 36],
      ['2024-09-16', 216.9, 218.00, 213.90, 216.30, 59],
      ['2024-09-17', 215.7, 216.90, 213.20, 216.80, 46],
      ['2024-09-18', 217.6, 222.70, 217.50, 220.70, 59],
      ['2024-09-19', 224.0, 229.80, 224.00, 228.90, 66],
      ['2024-09-20', 229.2, 230.00, 227.00, 228.20, 85],
      ['2024-09-23', 227.3, 230.00, 225.00, 226.50, 43],
      ['2024-09-24', 228.7, 229.40, 227.30, 227.70, 41],
      ['2024-09-25', 228.5, 229.50, 227.00, 226.40, 42],
      ['2024-09-26', 227.3, 228.50, 225.40, 227.50, 37],
      ['2024-09-27', 228.5, 229.50, 227.30, 227.80, 33],
      ['2024-09-30', 230.1, 233.00, 229.70, 233.00, 54],
      ['2024-10-01', 229.5, 229.70, 223.70, 226.20, 63],
      ['2024-10-02', 225.9, 227.40, 223.00, 226.80, 33],
      ['2024-10-03', 225.6, 226.70, 223.40, 225.70, 33],
      ['2024-10-04', 227.9, 228.00, 224.10, 226.80, 37],
      ['2024-10-07', 224.5, 225.70, 221.30, 221.70, 39],
      ['2024-10-08', 224.3, 225.70, 223.20, 225.80, 33],
      ['2024-10-09', 225.2, 229.70, 224.80, 229.50, 33],
      ['2024-10-10', 227.8, 229.50, 227.20, 229.00, 29],
      ['2024-10-11', 229.3, 229.40, 227.30, 227.60, 32],
      ['2024-10-14', 228.7, 232.00, 228.60, 231.30, 39],
      ['2024-10-15', 233.6, 237.50, 232.40, 233.90, 63],
      ['2024-10-16', 231.6, 232.10, 229.80, 231.80, 34],
      ['2024-10-17', 233.4, 233.90, 230.10, 232.20, 33],
      ['2024-10-18', 236.2, 236.60, 234.40, 235.00, 46],
      ['2024-10-21', 234.5, 236.90, 234.00, 236.50, 37],
      ['2024-10-22', 235.7, 236.40, 232.60, 235.90, 39],
      ['2024-10-23', 234.1, 235.10, 227.80, 230.80, 53],
      ['2024-10-24', 229.8, 231.00, 228.00, 230.60, 30],
      ['2024-10-25', 229.7, 233.20, 229.60, 231.40, 39],
      ['2024-10-28', 233.3, 234.70, 232.60, 233.40, 36],
      ['2024-10-29', 233.1, 234.30, 232.30, 233.70, 36],
      ['2024-10-30', 232.6, 233.50, 229.60, 230.10, 47],
      ['2024-10-31', 229.3, 229.80, 225.00, 225.90, 64],
      ['2024-11-01', 220.0, 225.40, 220.00, 222.90, 65],
      ['2024-11-04', 220.0, 222.80, 219.70, 222.00, 45],
      ['2024-11-05', 221.8, 223.60, 219.10, 223.50, 29],
      ['2024-11-06', 222.6, 225.40, 221.90, 222.70, 53],
      ['2024-11-07', 224.6, 227.30, 224.60, 227.50, 40],
    ],
    scenarios: {
      // indices to highlight + label keys
      confirm:    { idx: [33, 34, 35, 41], note: { th: '🍎 19–20 ก.ย. + 30 ก.ย. — ราคาเบรกขึ้นพร้อมวอลุ่มเด่น (Fed cut + iPhone) → เทรนด์ขาขึ้นยืนยัน', en: '🍎 Sep 19–20 + Sep 30 — price breaks higher with above-avg volume (Fed cut + iPhone) → uptrend confirmed.' } },
      climax:     { idx: [2], note: { th: '🍎 5 ส.ค. 2024 (Black Monday) — วอลุ่ม 119M เทียบค่าเฉลี่ย ~50M (≈2.4×) + แท่งเต็ม high-low กว้าง = panic climax → ฟื้นภายในไม่กี่วัน', en: '🍎 Aug 5, 2024 (Black Monday) — 119M volume vs ~50M average (~2.4×) on a wide-range bar = panic climax → recovered within days.' } },
      divergence: { idx: [52, 53, 54, 55, 56], note: { th: '🍎 14–21 ต.ค. — ราคาทำ new high แตะ ~$237 แต่วอลุ่มลดต่อเนื่อง = bearish divergence ก่อน earnings selloff 31 ต.ค.', en: '🍎 Oct 14–21 — price prints new highs near $237 but volume keeps fading = bearish divergence ahead of the Oct 31 earnings selloff.' } },
      breakout:   { idx: [34, 35], note: { th: '🍎 19–20 ก.ย. — Fed cut 50bp ราคาเบรกแนวต้าน $228 ด้วยวอลุ่ม 66M+85M (≈1.4–1.8× ของค่าเฉลี่ย) = breakout ของจริง', en: '🍎 Sep 19–20 — 50bp Fed cut, price clears $228 resistance on 66M then 85M volume (≈1.4–1.8× average) = a real breakout.' } },
    },
  },

  // GME Jan 11 – Feb 5, 2021 (19 trading days)
  gme: {
    label: 'GME · Jan–Feb 2021',
    decimals: 2,
    volUnit: 'M',
    bars: [
      ['2021-01-11',  20.50,  22.00,  18.94,  19.94, 14.4],
      ['2021-01-12',  20.20,  20.65,  19.10,  19.95,  7.1],
      ['2021-01-13',  20.40,  38.65,  20.04,  31.40,144.5],
      ['2021-01-14',  33.59,  43.06,  30.10,  39.91, 93.7],
      ['2021-01-15',  37.80,  39.84,  32.74,  35.50, 46.8],
      ['2021-01-19',  38.49,  43.49,  35.50,  39.36, 74.7],
      ['2021-01-20',  39.62,  43.30,  37.00,  39.12, 33.4],
      ['2021-01-21',  39.23,  46.39,  36.50,  43.03, 57.1],
      ['2021-01-22',  42.59,  76.76,  42.32,  65.01,196.7],
      ['2021-01-25',  96.73, 159.18,  61.13,  76.79,177.9],
      ['2021-01-26',  88.56, 150.00,  80.20, 147.98,178.6],
      ['2021-01-27', 354.83, 380.00, 249.00, 347.51, 93.4],
      ['2021-01-28', 265.00, 483.00, 112.25, 193.60, 58.8],
      ['2021-01-29', 379.71, 413.98, 250.00, 325.00, 50.6],
      ['2021-02-01', 316.56, 322.00, 212.00, 225.00, 37.4],
      ['2021-02-02', 140.76, 158.00,  74.22,  90.00, 78.2],
      ['2021-02-03', 112.01, 113.40,  85.25,  92.41, 42.7],
      ['2021-02-04',  91.19,  91.50,  53.33,  53.50, 62.8],
      ['2021-02-05',  54.04,  95.00,  51.00,  63.77, 82.0],
    ],
    scenarios: {
      confirm:    { idx: [2, 3, 8, 9], note: { th: '🎮 13–14 + 22–25 ม.ค. — แต่ละครั้งราคาขึ้น วอลุ่มเพิ่มอย่างมหาศาล = แรงซื้อจริง (รีเทลแห่เข้า + short squeeze)', en: '🎮 Jan 13–14 & Jan 22–25 — each price surge comes with massive rising volume = real buying (retail rush + short squeeze).' } },
      climax:     { idx: [9, 10, 11], note: { th: '🎮 25–27 ม.ค. — Climax เต็มขั้น: ราคาพุ่งจาก $76 → $347 พร้อมวอลุ่มแตะ 178–197M = "วันสุดท้าย" ที่ FOMO เข้าตลาด ตามด้วยการล่ม', en: '🎮 Jan 25–27 — full climax: price rockets $76 → $347 with 178–197M volume = the "last buyers" entering on FOMO, followed by collapse.' } },
      divergence: { idx: [11, 12, 13], note: { th: '🎮 27–29 ม.ค. — ราคา $347 → $193 → $325 (โยนแรง) แต่วอลุ่มลดจาก 93M → 50M = แรงซื้อหมดแล้ว momentum หาย', en: '🎮 Jan 27–29 — wild swings $347 → $193 → $325 yet volume falls 93M → 50M = buyers exhausted, momentum gone.' } },
      breakout:   { idx: [2, 8], note: { th: '🎮 13 ม.ค. + 22 ม.ค. — เบรกจาก $20 → $31 (vol 144M, ~10× ของก่อนหน้า) และ $43 → $65 (vol 197M) = breakout ที่ชัดเจนมาก', en: '🎮 Jan 13 & Jan 22 — break from $20 → $31 on 144M (~10× prior) and $43 → $65 on 197M = textbook breakout volume.' } },
    },
  },

  // PTT Thailand — 2024 sideways → breakout (synthetic-realistic ~50 bars)
  ptt: {
    label: 'PTT · 2024',
    decimals: 2,
    volUnit: 'M',
    bars: [
      ['2024-04-01', 35.50, 35.75, 35.25, 35.50, 22],
      ['2024-04-02', 35.50, 35.75, 35.25, 35.25, 18],
      ['2024-04-03', 35.25, 35.50, 35.00, 35.00, 25],
      ['2024-04-04', 35.00, 35.25, 34.75, 34.75, 28],
      ['2024-04-05', 34.75, 35.00, 34.50, 34.75, 24],
      ['2024-04-08', 34.75, 35.00, 34.50, 34.50, 21],
      ['2024-04-09', 34.50, 34.75, 34.25, 34.50, 19],
      ['2024-04-10', 34.50, 34.75, 34.25, 34.25, 23],
      ['2024-04-11', 34.25, 34.50, 34.00, 34.25, 26],
      ['2024-04-12', 34.25, 34.50, 34.00, 34.00, 30],
      ['2024-04-17', 34.00, 34.25, 33.75, 33.75, 35],
      ['2024-04-18', 33.75, 34.00, 33.50, 33.75, 28],
      ['2024-04-19', 33.75, 34.00, 33.50, 33.50, 32],
      ['2024-04-22', 33.50, 33.75, 33.25, 33.50, 24],
      ['2024-04-23', 33.50, 33.75, 33.25, 33.75, 22],
      ['2024-04-24', 33.75, 34.00, 33.50, 33.50, 25],
      ['2024-04-25', 33.50, 33.75, 33.25, 33.25, 28],
      ['2024-04-26', 33.25, 33.50, 33.00, 33.00, 31],
      ['2024-04-29', 33.00, 33.25, 32.75, 33.00, 27],
      ['2024-04-30', 33.00, 33.25, 32.75, 32.75, 24],
      ['2024-05-02', 32.75, 33.00, 32.50, 32.50, 35],
      ['2024-05-03', 32.50, 32.75, 32.25, 32.50, 32],
      ['2024-05-07', 32.50, 32.75, 32.25, 32.75, 28],
      ['2024-05-08', 32.75, 33.00, 32.50, 32.75, 22],
      ['2024-05-09', 32.75, 33.00, 32.50, 33.00, 24],
      ['2024-05-10', 33.00, 33.25, 32.75, 33.00, 21],
      ['2024-05-13', 33.00, 33.25, 32.75, 33.25, 26],
      ['2024-05-14', 33.25, 33.50, 33.00, 33.25, 23],
      ['2024-05-15', 33.25, 33.75, 33.00, 33.50, 38],
      ['2024-05-16', 33.50, 34.00, 33.25, 33.75, 42],
      ['2024-05-17', 33.75, 34.50, 33.50, 34.25, 58],
      ['2024-05-20', 34.25, 35.00, 34.00, 34.75, 65],
      ['2024-05-21', 34.75, 35.50, 34.50, 35.25, 78],
      ['2024-05-22', 35.25, 36.25, 35.00, 36.00, 95],
      ['2024-05-23', 36.00, 36.50, 35.50, 35.75, 52],
      ['2024-05-24', 35.75, 36.25, 35.50, 36.00, 38],
      ['2024-05-27', 36.00, 36.50, 35.75, 36.25, 41],
      ['2024-05-28', 36.25, 36.75, 36.00, 36.50, 44],
      ['2024-05-29', 36.50, 37.00, 36.25, 36.75, 47],
      ['2024-05-30', 36.75, 37.25, 36.50, 37.00, 51],
      ['2024-05-31', 37.00, 37.25, 36.75, 37.00, 33],
      ['2024-06-03', 37.00, 37.25, 36.75, 37.00, 28],
      ['2024-06-04', 37.00, 37.25, 36.75, 37.25, 31],
      ['2024-06-05', 37.25, 37.50, 37.00, 37.25, 35],
      ['2024-06-06', 37.25, 37.50, 37.00, 37.00, 29],
      ['2024-06-07', 37.00, 37.25, 36.75, 36.75, 32],
      ['2024-06-10', 36.75, 37.00, 36.25, 36.50, 38],
      ['2024-06-11', 36.50, 36.75, 36.00, 36.00, 42],
      ['2024-06-12', 36.00, 36.25, 35.75, 36.25, 36],
      ['2024-06-13', 36.25, 36.50, 36.00, 36.25, 31],
    ],
    scenarios: {
      confirm:    { idx: [29, 30, 31, 32, 33], note: { th: '🛢 17–22 พ.ค. — ราคาเบรกแนว ฿34 ขึ้นไปด้วยวอลุ่มเพิ่มทุกวัน 58→65→78→95M = trend confirmation ชัด', en: '🛢 May 17–22 — price clears ฿34 with rising volume each day 58→65→78→95M = clear trend confirmation.' } },
      climax:     { idx: [33], note: { th: '🛢 22 พ.ค. — วอลุ่ม 95M (≈3× ค่าเฉลี่ย) บนแท่งใหญ่ที่ ฿36 = climax ระยะสั้น ตามด้วย consolidation', en: '🛢 May 22 — 95M volume (~3× average) on a wide bar at ฿36 = short-term climax, followed by consolidation.' } },
      divergence: { idx: [38, 39, 40], note: { th: '🛢 30 พ.ค.–3 มิ.ย. — ราคาขึ้นต่อแตะ ฿37 แต่วอลุ่มลด 51→33→28M = ราคาขึ้นแบบ "ไม่มีคนตาม" ก่อนย่อ', en: '🛢 May 30 – Jun 3 — price grinds higher to ฿37 but volume fades 51→33→28M = drift without followers, then pullback.' } },
      breakout:   { idx: [28, 29, 30], note: { th: '🛢 15–17 พ.ค. — เบรกจากกรอบ ฿32–34 ที่กดมา 6 สัปดาห์ ด้วยวอลุ่มขยับขึ้นเรื่อย ๆ = breakout ที่ "หายใจได้"', en: '🛢 May 15–17 — break out of a 6-week ฿32–34 range on steadily rising volume = a breathable breakout.' } },
    },
  },
};

// ============================================================
// State
// ============================================================
let currentDsKey = 'aapl';
let currentScenario = null;
let lastHoverIdx = -1;
let activeIndicator = 'obv';

function getDs() { return DATA[currentDsKey]; }

// ============================================================
// Indicator computations
// ============================================================
function computeOBV(bars) {
  const out = [bars[0][5]];
  for (let i = 1; i < bars.length; i++) {
    const cur = bars[i][4], prev = bars[i - 1][4], v = bars[i][5];
    out[i] = out[i - 1] + (cur > prev ? v : cur < prev ? -v : 0);
  }
  return out;
}

function computeVWAP(bars) {
  // session-style cumulative VWAP from start
  const out = [];
  let cumPV = 0, cumV = 0;
  for (let i = 0; i < bars.length; i++) {
    const [, , h, l, c, v] = bars[i];
    const tp = (h + l + c) / 3;
    cumPV += tp * v;
    cumV += v;
    out[i] = cumPV / cumV;
  }
  return out;
}

function computeAD(bars) {
  const out = [];
  let acc = 0;
  for (let i = 0; i < bars.length; i++) {
    const [, , h, l, c, v] = bars[i];
    const range = h - l;
    const mfm = range === 0 ? 0 : ((c - l) - (h - c)) / range;
    acc += mfm * v;
    out[i] = acc;
  }
  return out;
}

function computeMFI(bars, period = 14) {
  const out = new Array(bars.length).fill(null);
  const tp = bars.map(([, , h, l, c]) => (h + l + c) / 3);
  const rmf = bars.map((b, i) => tp[i] * b[5]);
  for (let i = period; i < bars.length; i++) {
    let pos = 0, neg = 0;
    for (let k = i - period + 1; k <= i; k++) {
      if (k === 0) continue;
      if (tp[k] > tp[k - 1]) pos += rmf[k];
      else if (tp[k] < tp[k - 1]) neg += rmf[k];
    }
    if (neg === 0) { out[i] = 100; continue; }
    const ratio = pos / neg;
    out[i] = 100 - 100 / (1 + ratio);
  }
  return out;
}

function computeProfile(bars, binCount = 24) {
  const lows = bars.map(b => b[3]);
  const highs = bars.map(b => b[2]);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const step = (max - min) / binCount || 1;
  const bins = new Array(binCount).fill(0);
  for (const b of bars) {
    const [, , h, l, , v] = b;
    // distribute volume across bins this bar overlaps
    const lowIdx = Math.max(0, Math.floor((l - min) / step));
    const highIdx = Math.min(binCount - 1, Math.floor((h - min) / step));
    const span = highIdx - lowIdx + 1;
    const slice = v / span;
    for (let k = lowIdx; k <= highIdx; k++) bins[k] += slice;
  }
  // POC and Value Area (70%)
  let pocIdx = 0;
  for (let i = 1; i < binCount; i++) if (bins[i] > bins[pocIdx]) pocIdx = i;
  const total = bins.reduce((s, x) => s + x, 0);
  const target = total * 0.7;
  let lo = pocIdx, hi = pocIdx, sum = bins[pocIdx];
  while (sum < target && (lo > 0 || hi < binCount - 1)) {
    const left  = lo > 0 ? bins[lo - 1] : -1;
    const right = hi < binCount - 1 ? bins[hi + 1] : -1;
    if (right >= left) { hi += 1; sum += bins[hi]; }
    else               { lo -= 1; sum += bins[lo]; }
  }
  return { bins, min, max, step, pocIdx, vaLo: lo, vaHi: hi, total };
}

function avgVolume(bars, lookback = 20) {
  // simple SMA of volume; null until lookback bars
  const out = new Array(bars.length).fill(null);
  for (let i = lookback - 1; i < bars.length; i++) {
    let s = 0;
    for (let k = i - lookback + 1; k <= i; k++) s += bars[k][5];
    out[i] = s / lookback;
  }
  return out;
}

// ============================================================
// Canvas helpers
// ============================================================
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

const PAD = { l: 56, r: 14, t: 12, b: 24 };

function fmt(n, d = 2) { return Number(n).toFixed(d); }
function fmtVol(v) {
  if (v >= 1000) return (v / 1000).toFixed(2) + 'B';
  if (v >= 1)    return v.toFixed(1) + 'M';
  return (v * 1000).toFixed(0) + 'K';
}

function priceBounds(bars, padFrac = 0.04) {
  let lo = Infinity, hi = -Infinity;
  for (const b of bars) {
    if (b[3] < lo) lo = b[3];
    if (b[2] > hi) hi = b[2];
  }
  const range = hi - lo || 1;
  return { lo: lo - range * padFrac, hi: hi + range * padFrac };
}

function xForIdx(i, n, w) {
  return PAD.l + ((w - PAD.l - PAD.r) * (i + 0.5)) / n;
}
function yForPrice(p, lo, hi, h) {
  return PAD.t + ((hi - p) / (hi - lo)) * (h - PAD.t - PAD.b);
}

function drawGrid(ctx, w, h, lines, fmtFn) {
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 1;
  for (const { y, val } of lines) {
    ctx.beginPath();
    ctx.moveTo(PAD.l, y);
    ctx.lineTo(w - PAD.r, y);
    ctx.stroke();
    ctx.fillText(fmtFn(val), PAD.l - 6, y);
  }
}

function makeYLines(lo, hi, h, count = 5, fmtVal) {
  const lines = [];
  for (let i = 0; i <= count; i++) {
    const v = lo + ((hi - lo) * i) / count;
    lines.push({ y: yForPrice(v, lo, hi, h), val: v });
  }
  return lines;
}

// ============================================================
// Main candlestick + volume chart
// ============================================================
const mainPriceCanvas = document.getElementById('main-price');
const mainVolCanvas = document.getElementById('main-volume');
const tooltipEl = document.getElementById('main-tooltip');
const readoutEl = document.getElementById('main-readout');
const chartWrap = mainPriceCanvas.parentElement;

function drawCandles(ds, scenarioIdx, hoverIdx) {
  const { ctx, w, h } = setupCanvas(mainPriceCanvas);
  const bars = ds.bars;
  const { lo, hi } = priceBounds(bars);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  drawGrid(ctx, w, h, makeYLines(lo, hi, h, 5), (v) => fmt(v, ds.decimals));

  // candle width
  const colWidth = (w - PAD.l - PAD.r) / bars.length;
  const bodyWidth = Math.max(2, colWidth * 0.75);

  for (let i = 0; i < bars.length; i++) {
    const [, o, hi_, lo_, c] = bars[i];
    const x = xForIdx(i, bars.length, w);
    const yO = yForPrice(o, lo, hi, h);
    const yH = yForPrice(hi_, lo, hi, h);
    const yL = yForPrice(lo_, lo, hi, h);
    const yC = yForPrice(c, lo, hi, h);
    const up = c >= o;

    const inScenario = scenarioIdx && scenarioIdx.includes(i);
    const isHover = i === hoverIdx;

    let bull = up ? '#22c55e' : '#ef4444';
    let alpha = 1;
    if (scenarioIdx && !inScenario) alpha = 0.25;
    if (isHover) alpha = 1;

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = bull;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, yH);
    ctx.lineTo(x, yL);
    ctx.stroke();

    ctx.fillStyle = bull;
    const top = Math.min(yO, yC);
    const bh = Math.max(1, Math.abs(yC - yO));
    ctx.fillRect(x - bodyWidth / 2, top, bodyWidth, bh);

    if (inScenario) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - bodyWidth / 2 - 2, yH - 2, bodyWidth + 4, yL - yH + 4);
    }
    if (isHover) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, PAD.t);
      ctx.lineTo(x, h - PAD.b);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.globalAlpha = 1;
}

function drawVolumeBars(ds, scenarioIdx, hoverIdx) {
  const { ctx, w, h } = setupCanvas(mainVolCanvas);
  const bars = ds.bars;
  let maxV = 0;
  for (const b of bars) if (b[5] > maxV) maxV = b[5];

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // y-axis label "Vol"
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(`Vol max ${fmtVol(maxV)}`, w - PAD.r, 4);

  const avgV = avgVolume(bars, 20);
  const colWidth = (w - PAD.l - PAD.r) / bars.length;
  const bodyWidth = Math.max(2, colWidth * 0.75);
  const usableH = h - PAD.t - PAD.b;

  for (let i = 0; i < bars.length; i++) {
    const [, o, , , c, v] = bars[i];
    const x = xForIdx(i, bars.length, w);
    const up = c >= o;
    const barH = (v / maxV) * usableH;
    const top = h - PAD.b - barH;

    const inScenario = scenarioIdx && scenarioIdx.includes(i);
    let alpha = 1;
    if (scenarioIdx && !inScenario) alpha = 0.25;
    if (i === hoverIdx) alpha = 1;

    ctx.globalAlpha = alpha;
    ctx.fillStyle = up ? 'rgba(34,197,94,0.85)' : 'rgba(239,68,68,0.85)';
    ctx.fillRect(x - bodyWidth / 2, top, bodyWidth, barH);

    if (inScenario) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - bodyWidth / 2 - 1, top - 1, bodyWidth + 2, barH + 2);
    }
  }

  // SMA-20 of volume line
  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(250,204,21,0.85)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < bars.length; i++) {
    if (avgV[i] == null) continue;
    const x = xForIdx(i, bars.length, w);
    const y = h - PAD.b - (avgV[i] / maxV) * usableH;
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  if (hoverIdx >= 0) {
    const x = xForIdx(hoverIdx, bars.length, w);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, PAD.t);
    ctx.lineTo(x, h - PAD.b);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function updateMainReadout(idx) {
  const ds = getDs();
  const lang = getLang();
  if (idx < 0 || idx >= ds.bars.length) {
    readoutEl.innerHTML = lang === 'th'
      ? '<span class="muted">เลื่อนเมาส์/แตะที่กราฟเพื่อดูข้อมูล</span>'
      : '<span class="muted">Hover or tap the chart to inspect bars.</span>';
    return;
  }
  const [date, o, h, l, c, v] = ds.bars[idx];
  const prev = idx > 0 ? ds.bars[idx - 1] : null;
  const chg = prev ? c - prev[4] : 0;
  const chgPct = prev ? (chg / prev[4]) * 100 : 0;
  const dec = ds.decimals;
  const avgV = avgVolume(ds.bars, 20)[idx];
  const ratio = avgV ? v / avgV : null;
  const up = c >= o;

  // Interpretation
  let interp = '';
  if (idx > 0) {
    const priceDir = c > prev[4] ? 'up' : c < prev[4] ? 'down' : 'flat';
    const volDir   = ratio == null ? null : ratio > 1.5 ? 'high' : ratio < 0.7 ? 'low' : 'normal';
    if (lang === 'th') {
      const dirTxt = priceDir === 'up' ? 'ราคา↑' : priceDir === 'down' ? 'ราคา↓' : 'ราคา–';
      const volTxt = volDir === 'high' ? 'วอลุ่มสูง' : volDir === 'low' ? 'วอลุ่มต่ำ' : 'วอลุ่มปกติ';
      let tag = '';
      if (priceDir === 'up'   && volDir === 'high') tag = '<strong>Healthy bullish</strong> — เงินใหม่ไหลเข้า เทรนด์ขาขึ้นยืนยัน';
      else if (priceDir === 'up'   && volDir === 'low')  tag = '<strong>Weak rally</strong> — ขึ้นเพราะคนขายน้อย ระวัง false high';
      else if (priceDir === 'down' && volDir === 'high') tag = '<strong>Distribution / panic</strong> — แรงขายมีน้ำหนัก';
      else if (priceDir === 'down' && volDir === 'low')  tag = '<strong>Healthy pullback</strong> — ย่อแบบไม่มีคนทิ้ง';
      else if (volDir === 'high') tag = '<strong>Indecision + heavy volume</strong> — ราวๆ ระดับสำคัญ';
      else tag = 'พฤติกรรมปกติ';
      interp = `${dirTxt} · ${volTxt} → ${tag}`;
    } else {
      const dirTxt = priceDir === 'up' ? 'price↑' : priceDir === 'down' ? 'price↓' : 'price flat';
      const volTxt = volDir === 'high' ? 'high vol' : volDir === 'low' ? 'low vol' : 'normal vol';
      let tag = '';
      if (priceDir === 'up'   && volDir === 'high') tag = '<strong>Healthy bullish</strong> — fresh money flowing in.';
      else if (priceDir === 'up'   && volDir === 'low')  tag = '<strong>Weak rally</strong> — rising on thin trade.';
      else if (priceDir === 'down' && volDir === 'high') tag = '<strong>Distribution / panic</strong> — selling has weight.';
      else if (priceDir === 'down' && volDir === 'low')  tag = '<strong>Healthy pullback</strong> — drift down, no real selling.';
      else if (volDir === 'high') tag = '<strong>Indecision + heavy volume</strong> — at a key level.';
      else tag = 'Routine activity.';
      interp = `${dirTxt} · ${volTxt} → ${tag}`;
    }
  }

  const chgCls = chg > 0 ? 'pos' : chg < 0 ? 'neg' : '';
  const chgSign = chg > 0 ? '+' : '';
  const ratioTxt = ratio == null ? '—' : ratio.toFixed(2) + '×';

  readoutEl.innerHTML = lang === 'th'
    ? `<strong>${date}</strong> · O <code>${fmt(o, dec)}</code> · H <code>${fmt(h, dec)}</code> · L <code>${fmt(l, dec)}</code> · C <code>${fmt(c, dec)}</code>
       · Δ <span class="${chgCls}">${chgSign}${fmt(chg, dec)}</span> (<span class="${chgCls}">${chgSign}${fmt(chgPct, 2)}%</span>)
       <br>Volume: <code>${fmtVol(v)}</code> · เทียบเฉลี่ย 20 วัน: <code>${ratioTxt}</code>
       <br>${interp}`
    : `<strong>${date}</strong> · O <code>${fmt(o, dec)}</code> · H <code>${fmt(h, dec)}</code> · L <code>${fmt(l, dec)}</code> · C <code>${fmt(c, dec)}</code>
       · Δ <span class="${chgCls}">${chgSign}${fmt(chg, dec)}</span> (<span class="${chgCls}">${chgSign}${fmt(chgPct, 2)}%</span>)
       <br>Volume: <code>${fmtVol(v)}</code> · vs 20-day avg: <code>${ratioTxt}</code>
       <br>${interp}`;
}

function showTooltip(idx, mouseX, mouseY) {
  const ds = getDs();
  if (idx < 0 || idx >= ds.bars.length) {
    tooltipEl.classList.remove('visible');
    return;
  }
  const [date, o, h, l, c, v] = ds.bars[idx];
  const dec = ds.decimals;
  const up = c >= o;
  const arrow = up ? '▲' : '▼';
  const color = up ? '#22c55e' : '#ef4444';
  tooltipEl.innerHTML =
    `<div style="color:${color};font-weight:600;">${arrow} ${date}</div>` +
    `O ${fmt(o, dec)}  H ${fmt(h, dec)}<br>` +
    `L ${fmt(l, dec)}  C ${fmt(c, dec)}<br>` +
    `Vol ${fmtVol(v)}`;
  const wrapRect = chartWrap.getBoundingClientRect();
  const tipRect = tooltipEl.getBoundingClientRect();
  let tx = mouseX + 14;
  let ty = mouseY - 10;
  if (tx + tipRect.width > wrapRect.width - 6) tx = mouseX - tipRect.width - 14;
  if (ty < 6) ty = 6;
  tooltipEl.style.left = tx + 'px';
  tooltipEl.style.top = ty + 'px';
  tooltipEl.classList.add('visible');
}

function pointerToIdx(clientX) {
  const rect = mainPriceCanvas.getBoundingClientRect();
  const ds = getDs();
  const x = clientX - rect.left;
  const span = rect.width - PAD.l - PAD.r;
  const i = Math.floor(((x - PAD.l) / span) * ds.bars.length);
  return Math.max(0, Math.min(ds.bars.length - 1, i));
}

function attachMainHover() {
  function onMove(e) {
    const cx = (e.touches ? e.touches[0].clientX : e.clientX);
    const cy = (e.touches ? e.touches[0].clientY : e.clientY);
    const wrapRect = chartWrap.getBoundingClientRect();
    const localX = cx - wrapRect.left;
    const localY = cy - wrapRect.top;
    const idx = pointerToIdx(cx);
    lastHoverIdx = idx;
    drawMain();
    showTooltip(idx, localX, localY);
    updateMainReadout(idx);
  }
  function onLeave() {
    lastHoverIdx = -1;
    drawMain();
    tooltipEl.classList.remove('visible');
    updateMainReadout(-1);
  }
  chartWrap.addEventListener('mousemove', onMove);
  chartWrap.addEventListener('mouseleave', onLeave);
  chartWrap.addEventListener('touchstart', onMove, { passive: true });
  chartWrap.addEventListener('touchmove', onMove, { passive: true });
  chartWrap.addEventListener('touchend', onLeave);
}

function drawMain() {
  const ds = getDs();
  const sIdx = currentScenario ? ds.scenarios[currentScenario]?.idx : null;
  drawCandles(ds, sIdx, lastHoverIdx);
  drawVolumeBars(ds, sIdx, lastHoverIdx);
}

// ============================================================
// Dataset switcher
// ============================================================
document.querySelectorAll('.ds-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ds-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentDsKey = btn.dataset.ds;
    currentScenario = null;
    document.querySelectorAll('.sc-btn').forEach((b) => b.classList.remove('active'));
    lastHoverIdx = -1;
    redrawAll();
    updateMainReadout(-1);
    applyScenarioNote();
  });
});

// ============================================================
// Scenario buttons
// ============================================================
const scenarioNoteEl = document.getElementById('scenario-note');
function applyScenarioNote() {
  const ds = getDs();
  if (!currentScenario) {
    scenarioNoteEl.innerHTML = '';
    return;
  }
  const sc = ds.scenarios[currentScenario];
  if (!sc) { scenarioNoteEl.innerHTML = ''; return; }
  scenarioNoteEl.innerHTML = sc.note[getLang()] || sc.note.en;
}

document.querySelectorAll('.sc-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const sc = btn.dataset.sc;
    if (sc === 'reset') {
      currentScenario = null;
      document.querySelectorAll('.sc-btn').forEach((b) => b.classList.remove('active'));
    } else {
      const wasActive = btn.classList.contains('active');
      document.querySelectorAll('.sc-btn').forEach((b) => b.classList.remove('active'));
      if (wasActive) {
        currentScenario = null;
      } else {
        btn.classList.add('active');
        currentScenario = sc;
      }
    }
    drawMain();
    applyScenarioNote();
  });
});

// ============================================================
// Indicator panels — always use AAPL dataset
// ============================================================
function lineChart(canvas, values, opts) {
  const { ctx, w, h } = setupCanvas(canvas);
  const bars = DATA.aapl.bars;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Find numeric range
  const valid = values.filter((v) => v !== null && !isNaN(v));
  let lo = Math.min(...valid);
  let hi = Math.max(...valid);
  if (opts.fixedRange) { lo = opts.fixedRange[0]; hi = opts.fixedRange[1]; }
  const range = hi - lo || 1;
  lo -= range * 0.04;
  hi += range * 0.04;

  drawGrid(ctx, w, h, makeYLines(lo, hi, h, 4), opts.fmt || ((v) => fmt(v, 0)));

  // Threshold bands (for MFI 20/80)
  if (opts.bands) {
    for (const b of opts.bands) {
      const y = yForPrice(b.val, lo, hi, h);
      ctx.strokeStyle = b.color || 'rgba(250,204,21,0.5)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD.l, y);
      ctx.lineTo(w - PAD.r, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = b.color || 'rgba(250,204,21,0.7)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(b.label, PAD.l + 4, y - 4);
    }
  }

  // Optional: overlay candlestick price line behind (for VWAP)
  if (opts.overlayPrice) {
    const pb = priceBounds(bars);
    ctx.globalAlpha = 0.85;
    for (let i = 0; i < bars.length; i++) {
      const [, o, hi_, lo_, c] = bars[i];
      const x = xForIdx(i, bars.length, w);
      const yO = yForPrice(o, pb.lo, pb.hi, h);
      const yH = yForPrice(hi_, pb.lo, pb.hi, h);
      const yL = yForPrice(lo_, pb.lo, pb.hi, h);
      const yC = yForPrice(c, pb.lo, pb.hi, h);
      const colW = Math.max(2, ((w - PAD.l - PAD.r) / bars.length) * 0.7);
      const up = c >= o;
      ctx.strokeStyle = up ? '#22c55e' : '#ef4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yH);
      ctx.lineTo(x, yL);
      ctx.stroke();
      ctx.fillStyle = up ? '#22c55e' : '#ef4444';
      const top = Math.min(yO, yC);
      const bh = Math.max(1, Math.abs(yC - yO));
      ctx.fillRect(x - colW / 2, top, colW, bh);
    }
    ctx.globalAlpha = 1;

    // VWAP line drawn in price space
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (let i = 0; i < values.length; i++) {
      const x = xForIdx(i, values.length, w);
      const y = yForPrice(values[i], pb.lo, pb.hi, h);
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    return;
  }

  // Draw the indicator line
  ctx.strokeStyle = opts.color || '#60a5fa';
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v == null) continue;
    const x = xForIdx(i, values.length, w);
    const y = yForPrice(v, lo, hi, h);
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Annotation arrows for divergence (optional)
  if (opts.annotations) {
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (const a of opts.annotations) {
      const x = xForIdx(a.idx, values.length, w);
      const y = yForPrice(values[a.idx], lo, hi, h);
      ctx.fillText(a.label, x, y - 8);
    }
  }
}

function drawProfile() {
  const priceCanvas = document.getElementById('profile-price');
  const histCanvas = document.getElementById('profile-hist');
  const bars = DATA.aapl.bars;
  const profile = computeProfile(bars, 20);

  // Price candles
  const { ctx: pctx, w: pw, h: ph } = setupCanvas(priceCanvas);
  const pb = priceBounds(bars);
  pctx.fillStyle = '#0f172a';
  pctx.fillRect(0, 0, pw, ph);
  drawGrid(pctx, pw, ph, makeYLines(pb.lo, pb.hi, ph, 5), (v) => fmt(v, 2));

  for (let i = 0; i < bars.length; i++) {
    const [, o, hi_, lo_, c] = bars[i];
    const x = xForIdx(i, bars.length, pw);
    const yO = yForPrice(o, pb.lo, pb.hi, ph);
    const yH = yForPrice(hi_, pb.lo, pb.hi, ph);
    const yL = yForPrice(lo_, pb.lo, pb.hi, ph);
    const yC = yForPrice(c, pb.lo, pb.hi, ph);
    const colW = Math.max(2, ((pw - PAD.l - PAD.r) / bars.length) * 0.7);
    const up = c >= o;
    pctx.strokeStyle = up ? '#22c55e' : '#ef4444';
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.moveTo(x, yH);
    pctx.lineTo(x, yL);
    pctx.stroke();
    pctx.fillStyle = up ? '#22c55e' : '#ef4444';
    const top = Math.min(yO, yC);
    const bh = Math.max(1, Math.abs(yC - yO));
    pctx.fillRect(x - colW / 2, top, colW, bh);
  }

  // POC + VA lines
  const pocPrice = profile.min + (profile.pocIdx + 0.5) * profile.step;
  const vaLoPrice = profile.min + profile.vaLo * profile.step;
  const vaHiPrice = profile.min + (profile.vaHi + 1) * profile.step;
  const yPOC = yForPrice(pocPrice, pb.lo, pb.hi, ph);
  const yVAL = yForPrice(vaLoPrice, pb.lo, pb.hi, ph);
  const yVAH = yForPrice(vaHiPrice, pb.lo, pb.hi, ph);

  pctx.strokeStyle = '#fbbf24';
  pctx.lineWidth = 2;
  pctx.beginPath();
  pctx.moveTo(PAD.l, yPOC);
  pctx.lineTo(pw - PAD.r, yPOC);
  pctx.stroke();
  pctx.fillStyle = '#fbbf24';
  pctx.font = 'bold 11px "JetBrains Mono", monospace';
  pctx.textAlign = 'left';
  pctx.fillText('POC', pw - PAD.r - 36, yPOC - 4);

  pctx.strokeStyle = 'rgba(96,165,250,0.7)';
  pctx.setLineDash([4, 4]);
  pctx.lineWidth = 1;
  pctx.beginPath();
  pctx.moveTo(PAD.l, yVAH); pctx.lineTo(pw - PAD.r, yVAH); pctx.stroke();
  pctx.beginPath();
  pctx.moveTo(PAD.l, yVAL); pctx.lineTo(pw - PAD.r, yVAL); pctx.stroke();
  pctx.setLineDash([]);
  pctx.fillStyle = 'rgba(96,165,250,1)';
  pctx.fillText('VAH', pw - PAD.r - 28, yVAH - 4);
  pctx.fillText('VAL', pw - PAD.r - 28, yVAL + 12);

  // Histogram
  const { ctx: hctx, w: hw, h: hh } = setupCanvas(histCanvas);
  hctx.fillStyle = '#0f172a';
  hctx.fillRect(0, 0, hw, hh);
  const maxBin = Math.max(...profile.bins);
  const binsCount = profile.bins.length;
  for (let i = 0; i < binsCount; i++) {
    const v = profile.bins[i];
    const yTop = yForPrice(profile.min + (i + 1) * profile.step, pb.lo, pb.hi, hh);
    const yBot = yForPrice(profile.min + i * profile.step, pb.lo, pb.hi, hh);
    const barH = Math.max(1, yBot - yTop - 1);
    const barW = (v / maxBin) * (hw - 16);
    let color = 'rgba(96,165,250,0.65)';
    if (i === profile.pocIdx) color = '#fbbf24';
    else if (i >= profile.vaLo && i <= profile.vaHi) color = 'rgba(96,165,250,0.85)';
    hctx.fillStyle = color;
    hctx.fillRect(8, yTop, barW, barH);
  }

  // Readout
  const lang = getLang();
  const note = lang === 'th'
    ? `<strong>POC</strong> ≈ <code>$${fmt(pocPrice, 2)}</code> · <strong>Value Area (70%)</strong>: <code>$${fmt(vaLoPrice, 2)} – $${fmt(vaHiPrice, 2)}</code>
       <br>ราคาในช่วงนี้คือ "เขตคุณค่า" ที่ AAPL ซื้อขายกันมากที่สุด — ทำหน้าที่เป็นแม่เหล็กเมื่อราคาออกไปไกล`
    : `<strong>POC</strong> ≈ <code>$${fmt(pocPrice, 2)}</code> · <strong>Value Area (70%)</strong>: <code>$${fmt(vaLoPrice, 2)} – $${fmt(vaHiPrice, 2)}</code>
       <br>This price band is where AAPL trades most — it acts as a magnet when price strays.`;
  document.getElementById('profile-readout').innerHTML = note;
}

// ============================================================
// Indicator drawing dispatcher
// ============================================================
function drawIndicator(name) {
  const bars = DATA.aapl.bars;
  const lang = getLang();

  if (name === 'obv') {
    const v = computeOBV(bars);
    lineChart(document.getElementById('obv-canvas'), v, { color: '#60a5fa', fmt: (x) => fmtVol(x) });
    const last = v[v.length - 1];
    const first = v[0];
    document.getElementById('obv-readout').innerHTML = lang === 'th'
      ? `OBV เริ่มที่ <code>${fmtVol(first)}</code> และจบที่ <code>${fmtVol(last)}</code> — เส้นทำ new high ตามราคาในช่วงต้น ต.ค. แสดง<strong>การสะสม</strong> ก่อนเทรนด์ใหญ่ขึ้น`
      : `OBV starts at <code>${fmtVol(first)}</code> and ends at <code>${fmtVol(last)}</code> — it makes new highs alongside price in early Oct, signaling <strong>accumulation</strong> ahead of the larger move.`;
  }
  else if (name === 'vwap') {
    const v = computeVWAP(bars);
    lineChart(document.getElementById('vwap-canvas'), v, { overlayPrice: true });
    const lastClose = bars[bars.length - 1][4];
    const lastVwap = v[v.length - 1];
    const above = lastClose > lastVwap;
    document.getElementById('vwap-readout').innerHTML = lang === 'th'
      ? `Close ล่าสุด <code>$${fmt(lastClose, 2)}</code> · VWAP <code>$${fmt(lastVwap, 2)}</code> → ราคาอยู่ <strong>${above ? 'เหนือ' : 'ใต้'}</strong> VWAP — bias ${above ? 'ขาขึ้น' : 'ขาลง'}`
      : `Latest close <code>$${fmt(lastClose, 2)}</code> · VWAP <code>$${fmt(lastVwap, 2)}</code> → price is <strong>${above ? 'above' : 'below'}</strong> VWAP — ${above ? 'bullish' : 'bearish'} bias.`;
  }
  else if (name === 'ad') {
    const v = computeAD(bars);
    lineChart(document.getElementById('ad-canvas'), v, { color: '#a78bfa', fmt: (x) => fmtVol(x) });
    document.getElementById('ad-readout').innerHTML = lang === 'th'
      ? `เส้น A/D สูงขึ้นต่อเนื่องในช่วง ส.ค.–ต.ค. = <strong>การสะสม</strong> close ส่วนใหญ่อยู่ครึ่งบนของแท่ง แม้บางวันราคาแกว่ง`
      : `A/D climbs through Aug–Oct = <strong>accumulation</strong> — closes tend to land in the upper half of bars, even on choppy days.`;
  }
  else if (name === 'mfi') {
    const v = computeMFI(bars, 14);
    lineChart(document.getElementById('mfi-canvas'), v, {
      color: '#fb7185',
      fixedRange: [0, 100],
      fmt: (x) => fmt(x, 0),
      bands: [
        { val: 80, label: 'Overbought 80', color: 'rgba(239,68,68,0.7)' },
        { val: 50, label: '50',            color: 'rgba(255,255,255,0.25)' },
        { val: 20, label: 'Oversold 20',   color: 'rgba(34,197,94,0.7)' },
      ],
    });
    const last = v[v.length - 1];
    let tag = '';
    if (last > 80)      tag = lang === 'th' ? 'overbought (อาจกลับลง)' : 'overbought (potential pullback)';
    else if (last < 20) tag = lang === 'th' ? 'oversold (อาจรีบาวด์)' : 'oversold (potential bounce)';
    else                tag = lang === 'th' ? 'อยู่ในโซนกลาง' : 'mid-zone — neutral';
    document.getElementById('mfi-readout').innerHTML = lang === 'th'
      ? `MFI ล่าสุด ≈ <code>${last == null ? '—' : fmt(last, 1)}</code> — ${tag}`
      : `Latest MFI ≈ <code>${last == null ? '—' : fmt(last, 1)}</code> — ${tag}`;
  }
  else if (name === 'profile') {
    drawProfile();
  }
}

// Tab switching
document.querySelectorAll('.ind-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ind-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.ind-panel').forEach((p) => p.classList.add('hidden'));
    tab.classList.add('active');
    activeIndicator = tab.dataset.ind;
    document.getElementById(`ind-${activeIndicator}`).classList.remove('hidden');
    drawIndicator(activeIndicator);
  });
});

// ============================================================
// Master redraw + responsive
// ============================================================
function redrawAll() {
  drawMain();
  drawIndicator(activeIndicator);
}

attachMainHover();
window.addEventListener('resize', () => {
  // small debounce
  clearTimeout(window.__volRedraw);
  window.__volRedraw = setTimeout(redrawAll, 80);
});

// initial paint (need a tick so layout is resolved)
requestAnimationFrame(() => {
  redrawAll();
  updateMainReadout(-1);
});
