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
  renderCalcTable();
  updateReadout(lastHoverIdx);
});
renderLangLabel();

// ============================================================
// Seeded PRNG (mulberry32) — reproducible synthetic data
// ============================================================
function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Box-Muller → standard normal (for realistic price steps)
function gaussian(rng) {
  const u = Math.max(1e-12, rng());
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// ============================================================
// Price generation — geometric Brownian-like walk
// ============================================================
const PRESETS = {
  random: { start: 100,   drift: 0.0000, vol: 0.020, bars: 80, decimals: 2 },
  set:    { start: 1580,  drift: 0.0003, vol: 0.008, bars: 80, decimals: 2, seed: 42 },
  btc:    { start: 67000, drift: 0.0010, vol: 0.035, bars: 80, decimals: 0, seed: 101 },
  gold:   { start: 2340,  drift: 0.0008, vol: 0.007, bars: 80, decimals: 2, seed: 77 },
};

function generatePrices(cfg, seed) {
  const rng = mulberry32(seed);
  const prices = [cfg.start];
  for (let i = 1; i < cfg.bars; i++) {
    const shock = gaussian(rng);
    const step = cfg.drift + cfg.vol * shock;
    const next = prices[i - 1] * (1 + step);
    prices.push(Math.max(next, 0.01));
  }
  return prices;
}

// ============================================================
// RSI (Wilder smoothing)
// Returns arrays aligned with `prices` — warmup indices are null.
// ============================================================
function computeRSI(prices, period) {
  const n = prices.length;
  const change = new Array(n).fill(null);
  const gain = new Array(n).fill(null);
  const loss = new Array(n).fill(null);
  const avgGain = new Array(n).fill(null);
  const avgLoss = new Array(n).fill(null);
  const rs = new Array(n).fill(null);
  const rsi = new Array(n).fill(null);

  for (let i = 1; i < n; i++) {
    const d = prices[i] - prices[i - 1];
    change[i] = d;
    gain[i] = d > 0 ? d : 0;
    loss[i] = d < 0 ? -d : 0;
  }

  if (n < period + 1) return { change, gain, loss, avgGain, avgLoss, rs, rsi };

  // Seed (index = period): simple mean of first `period` changes
  let sumG = 0;
  let sumL = 0;
  for (let i = 1; i <= period; i++) {
    sumG += gain[i];
    sumL += loss[i];
  }
  avgGain[period] = sumG / period;
  avgLoss[period] = sumL / period;
  rs[period] = avgLoss[period] === 0 ? Infinity : avgGain[period] / avgLoss[period];
  rsi[period] = 100 - 100 / (1 + rs[period]);

  // Wilder smoothing for subsequent bars
  for (let i = period + 1; i < n; i++) {
    avgGain[i] = (avgGain[i - 1] * (period - 1) + gain[i]) / period;
    avgLoss[i] = (avgLoss[i - 1] * (period - 1) + loss[i]) / period;
    rs[i] = avgLoss[i] === 0 ? Infinity : avgGain[i] / avgLoss[i];
    rsi[i] = 100 - 100 / (1 + rs[i]);
  }

  return { change, gain, loss, avgGain, avgLoss, rs, rsi };
}

// ============================================================
// State
// ============================================================
let currentPreset = 'random';
let currentSeed = (Date.now() & 0xffffff) >>> 0;
let period = 14;
let prices = [];
let calc = null;
let lastHoverIdx = null;

function rebuild() {
  const cfg = PRESETS[currentPreset];
  const seed = cfg.seed ?? currentSeed;
  prices = generatePrices(cfg, seed);
  recompute();
  drawCharts();
  renderCalcTable();
  updateReadout(null);
}
function recompute() {
  calc = computeRSI(prices, period);
}

// ============================================================
// Number formatting
// ============================================================
function fmtPrice(p) {
  const dec = PRESETS[currentPreset].decimals;
  return p.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtNum(n, d = 2) {
  if (n === null || n === undefined) return '—';
  if (!isFinite(n)) return '∞';
  return n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
}

// ============================================================
// Calc table (first 20 bars)
// ============================================================
const calcTbody = document.getElementById('calc-tbody');
const calcDetail = document.getElementById('calc-detail');
let selectedRow = null;

function renderCalcTable() {
  if (!calc) return;
  const lang = getLang();
  const rows = Math.min(20, prices.length);
  calcTbody.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    const tr = document.createElement('tr');
    if (selectedRow === i) tr.classList.add('selected');
    tr.addEventListener('click', () => {
      selectedRow = selectedRow === i ? null : i;
      renderCalcTable();
      renderCalcDetail(selectedRow);
    });

    const chg = calc.change[i];
    const g = calc.gain[i];
    const l = calc.loss[i];
    const ag = calc.avgGain[i];
    const al = calc.avgLoss[i];
    const r = calc.rs[i];
    const rsiV = calc.rsi[i];

    const pendClass = 'pending';
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${fmtPrice(prices[i])}</td>
      <td class="${chg > 0 ? 'gain' : chg < 0 ? 'loss' : ''}">${chg === null ? '—' : fmtNum(chg, 2)}</td>
      <td class="gain">${g === null ? '—' : fmtNum(g, 2)}</td>
      <td class="loss">${l === null ? '—' : fmtNum(l, 2)}</td>
      <td class="${ag === null ? pendClass : ''}">${ag === null ? '—' : fmtNum(ag, 3)}</td>
      <td class="${al === null ? pendClass : ''}">${al === null ? '—' : fmtNum(al, 3)}</td>
      <td class="${r === null ? pendClass : ''}">${r === null ? '—' : (isFinite(r) ? fmtNum(r, 3) : '∞')}</td>
      <td class="rsi-cell ${rsiV === null ? pendClass : ''}">${rsiV === null ? '—' : fmtNum(rsiV, 2)}</td>
    `;
    calcTbody.append(tr);
  }
  renderCalcDetail(selectedRow);
}

function renderCalcDetail(i) {
  if (i === null || i === undefined) {
    calcDetail.hidden = true;
    calcDetail.innerHTML = '';
    return;
  }
  const lang = getLang();
  calcDetail.hidden = false;

  const p = prices[i];
  const prev = i > 0 ? prices[i - 1] : null;
  const chg = calc.change[i];
  const g = calc.gain[i];
  const l = calc.loss[i];
  const ag = calc.avgGain[i];
  const al = calc.avgLoss[i];
  const r = calc.rs[i];
  const rsiV = calc.rsi[i];

  if (i === 0) {
    calcDetail.innerHTML = lang === 'th'
      ? `<strong>แท่งที่ 1:</strong> เป็นแท่งแรก ไม่มี Δ ให้คำนวณ (ต้องมีราคาก่อนหน้า)`
      : `<strong>Bar 1:</strong> first bar — no previous close, so Δ cannot be computed.`;
    return;
  }

  if (i < period) {
    calcDetail.innerHTML = lang === 'th'
      ? `<strong>แท่งที่ ${i + 1}:</strong> อยู่ในช่วง warmup (ต้องสะสม ${period} การเปลี่ยนแปลงก่อน)<br>
         Δ = <code>${fmtPrice(p)} − ${fmtPrice(prev)} = ${fmtNum(chg, 2)}</code> ·
         Gain = <code>${fmtNum(g, 2)}</code>, Loss = <code>${fmtNum(l, 2)}</code>`
      : `<strong>Bar ${i + 1}:</strong> still in warmup (need ${period} changes first).<br>
         Δ = <code>${fmtPrice(p)} − ${fmtPrice(prev)} = ${fmtNum(chg, 2)}</code> ·
         Gain = <code>${fmtNum(g, 2)}</code>, Loss = <code>${fmtNum(l, 2)}</code>`;
    return;
  }

  if (i === period) {
    calcDetail.innerHTML = lang === 'th'
      ? `<strong>แท่งที่ ${i + 1} — RSI ตัวแรก!</strong><br>
         AvgGain₀ = mean(Gain[1..${period}]) = <code>${fmtNum(ag, 4)}</code><br>
         AvgLoss₀ = mean(Loss[1..${period}]) = <code>${fmtNum(al, 4)}</code><br>
         RS = ${fmtNum(ag, 4)} / ${fmtNum(al, 4)} = <code>${isFinite(r) ? fmtNum(r, 4) : '∞'}</code><br>
         RSI = 100 − 100/(1 + ${isFinite(r) ? fmtNum(r, 4) : '∞'}) = <code>${fmtNum(rsiV, 2)}</code>`
      : `<strong>Bar ${i + 1} — first RSI!</strong><br>
         AvgGain₀ = mean(Gain[1..${period}]) = <code>${fmtNum(ag, 4)}</code><br>
         AvgLoss₀ = mean(Loss[1..${period}]) = <code>${fmtNum(al, 4)}</code><br>
         RS = ${fmtNum(ag, 4)} / ${fmtNum(al, 4)} = <code>${isFinite(r) ? fmtNum(r, 4) : '∞'}</code><br>
         RSI = 100 − 100/(1 + ${isFinite(r) ? fmtNum(r, 4) : '∞'}) = <code>${fmtNum(rsiV, 2)}</code>`;
    return;
  }

  // Wilder smoothing bars
  const prevAG = calc.avgGain[i - 1];
  const prevAL = calc.avgLoss[i - 1];
  calcDetail.innerHTML = lang === 'th'
    ? `<strong>แท่งที่ ${i + 1} — Wilder smoothing</strong><br>
       AvgGain = (${fmtNum(prevAG, 4)} × ${period - 1} + ${fmtNum(g, 2)}) ÷ ${period} = <code>${fmtNum(ag, 4)}</code><br>
       AvgLoss = (${fmtNum(prevAL, 4)} × ${period - 1} + ${fmtNum(l, 2)}) ÷ ${period} = <code>${fmtNum(al, 4)}</code><br>
       RS = <code>${isFinite(r) ? fmtNum(r, 4) : '∞'}</code> · RSI = <code>${fmtNum(rsiV, 2)}</code>`
    : `<strong>Bar ${i + 1} — Wilder smoothing</strong><br>
       AvgGain = (${fmtNum(prevAG, 4)} × ${period - 1} + ${fmtNum(g, 2)}) ÷ ${period} = <code>${fmtNum(ag, 4)}</code><br>
       AvgLoss = (${fmtNum(prevAL, 4)} × ${period - 1} + ${fmtNum(l, 2)}) ÷ ${period} = <code>${fmtNum(al, 4)}</code><br>
       RS = <code>${isFinite(r) ? fmtNum(r, 4) : '∞'}</code> · RSI = <code>${fmtNum(rsiV, 2)}</code>`;
}

// ============================================================
// Chart rendering
// ============================================================
const priceCanvas = document.getElementById('price-chart');
const rsiCanvas = document.getElementById('rsi-chart');
const pctx = priceCanvas.getContext('2d');
const rctx = rsiCanvas.getContext('2d');

const PAD = { l: 48, r: 16, t: 14, b: 18 };

function priceBounds() {
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pad = (max - min) * 0.08 || 1;
  return { min: min - pad, max: max + pad };
}

function xForIndex(i, W) {
  const n = prices.length;
  if (n <= 1) return PAD.l;
  return PAD.l + ((W - PAD.l - PAD.r) * i) / (n - 1);
}

function drawGrid(ctx, W, H, yVals, fmt, isRsi) {
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (const v of yVals) {
    const y = v.y;
    ctx.beginPath();
    ctx.moveTo(PAD.l, y);
    ctx.lineTo(W - PAD.r, y);
    ctx.stroke();
    ctx.fillText(fmt(v.val), PAD.l - 6, y);
  }
}

function drawPriceChart(hoverIdx) {
  const W = priceCanvas.width;
  const H = priceCanvas.height;
  pctx.fillStyle = '#0f172a';
  pctx.fillRect(0, 0, W, H);

  const { min, max } = priceBounds();
  const plotH = H - PAD.t - PAD.b;
  const yFor = (p) => PAD.t + (1 - (p - min) / (max - min)) * plotH;

  const ticks = 4;
  const yVals = [];
  for (let i = 0; i <= ticks; i++) {
    const v = min + ((max - min) * i) / ticks;
    yVals.push({ val: v, y: yFor(v) });
  }
  drawGrid(pctx, W, H, yVals, (v) => fmtPrice(v));

  // Line
  pctx.strokeStyle = '#60a5fa';
  pctx.lineWidth = 1.8;
  pctx.beginPath();
  for (let i = 0; i < prices.length; i++) {
    const x = xForIndex(i, W);
    const y = yFor(prices[i]);
    if (i === 0) pctx.moveTo(x, y);
    else pctx.lineTo(x, y);
  }
  pctx.stroke();

  // Fill
  pctx.lineTo(xForIndex(prices.length - 1, W), H - PAD.b);
  pctx.lineTo(xForIndex(0, W), H - PAD.b);
  pctx.closePath();
  pctx.fillStyle = 'rgba(96, 165, 250, 0.08)';
  pctx.fill();

  // Crosshair
  if (hoverIdx !== null && hoverIdx !== undefined) {
    const x = xForIndex(hoverIdx, W);
    const y = yFor(prices[hoverIdx]);
    pctx.strokeStyle = 'rgba(255,255,255,0.25)';
    pctx.setLineDash([3, 3]);
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.moveTo(x, PAD.t);
    pctx.lineTo(x, H - PAD.b);
    pctx.stroke();
    pctx.setLineDash([]);
    pctx.fillStyle = '#60a5fa';
    pctx.beginPath();
    pctx.arc(x, y, 4, 0, Math.PI * 2);
    pctx.fill();
  }
}

function drawRsiChart(hoverIdx) {
  const W = rsiCanvas.width;
  const H = rsiCanvas.height;
  rctx.fillStyle = '#0f172a';
  rctx.fillRect(0, 0, W, H);

  const plotH = H - PAD.t - PAD.b;
  const yFor = (v) => PAD.t + (1 - v / 100) * plotH;

  // Zones
  const yOB = yFor(70);
  const yOS = yFor(30);
  rctx.fillStyle = 'rgba(248, 113, 113, 0.08)';
  rctx.fillRect(PAD.l, PAD.t, W - PAD.l - PAD.r, yOB - PAD.t);
  rctx.fillStyle = 'rgba(74, 222, 128, 0.08)';
  rctx.fillRect(PAD.l, yOS, W - PAD.l - PAD.r, (H - PAD.b) - yOS);

  // Gridlines at 0, 30, 50, 70, 100
  const yVals = [
    { val: 0,   y: yFor(0) },
    { val: 30,  y: yOS },
    { val: 50,  y: yFor(50) },
    { val: 70,  y: yOB },
    { val: 100, y: yFor(100) },
  ];
  drawGrid(rctx, W, H, yVals, (v) => v.toFixed(0), true);

  // OB/OS dashed lines emphasized
  rctx.setLineDash([4, 4]);
  rctx.strokeStyle = 'rgba(248, 113, 113, 0.5)';
  rctx.beginPath(); rctx.moveTo(PAD.l, yOB); rctx.lineTo(W - PAD.r, yOB); rctx.stroke();
  rctx.strokeStyle = 'rgba(74, 222, 128, 0.5)';
  rctx.beginPath(); rctx.moveTo(PAD.l, yOS); rctx.lineTo(W - PAD.r, yOS); rctx.stroke();
  rctx.setLineDash([]);

  // RSI line
  rctx.strokeStyle = '#a78bfa';
  rctx.lineWidth = 1.8;
  rctx.beginPath();
  let started = false;
  for (let i = 0; i < prices.length; i++) {
    const v = calc.rsi[i];
    if (v === null) continue;
    const x = xForIndex(i, W);
    const y = yFor(v);
    if (!started) { rctx.moveTo(x, y); started = true; }
    else rctx.lineTo(x, y);
  }
  rctx.stroke();

  // Crosshair
  if (hoverIdx !== null && hoverIdx !== undefined && calc.rsi[hoverIdx] !== null) {
    const x = xForIndex(hoverIdx, W);
    const y = yFor(calc.rsi[hoverIdx]);
    rctx.strokeStyle = 'rgba(255,255,255,0.25)';
    rctx.setLineDash([3, 3]);
    rctx.lineWidth = 1;
    rctx.beginPath();
    rctx.moveTo(x, PAD.t);
    rctx.lineTo(x, H - PAD.b);
    rctx.stroke();
    rctx.setLineDash([]);
    rctx.fillStyle = '#a78bfa';
    rctx.beginPath();
    rctx.arc(x, y, 4, 0, Math.PI * 2);
    rctx.fill();
  } else if (hoverIdx !== null && hoverIdx !== undefined) {
    // Still draw vertical crosshair during warmup
    const x = xForIndex(hoverIdx, W);
    rctx.strokeStyle = 'rgba(255,255,255,0.25)';
    rctx.setLineDash([3, 3]);
    rctx.lineWidth = 1;
    rctx.beginPath();
    rctx.moveTo(x, PAD.t);
    rctx.lineTo(x, H - PAD.b);
    rctx.stroke();
    rctx.setLineDash([]);
  }
}

function drawCharts(hoverIdx = lastHoverIdx) {
  drawPriceChart(hoverIdx);
  drawRsiChart(hoverIdx);
}

// ============================================================
// Hover
// ============================================================
function indexFromEvent(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
  const W = canvas.width;
  const n = prices.length;
  const plotW = W - PAD.l - PAD.r;
  const rel = (x - PAD.l) / plotW;
  let idx = Math.round(rel * (n - 1));
  if (idx < 0) idx = 0;
  if (idx > n - 1) idx = n - 1;
  return idx;
}

[priceCanvas, rsiCanvas].forEach((c) => {
  c.addEventListener('mousemove', (e) => {
    const idx = indexFromEvent(e, c);
    lastHoverIdx = idx;
    drawCharts(idx);
    updateReadout(idx);
  });
  c.addEventListener('mouseleave', () => {
    lastHoverIdx = null;
    drawCharts(null);
    updateReadout(null);
  });
});

// ============================================================
// Readout
// ============================================================
const readoutEl = document.getElementById('readout');

function signalLabel(rsiVal) {
  const lang = getLang();
  if (rsiVal === null || rsiVal === undefined) {
    return lang === 'th' ? 'warmup' : 'warmup';
  }
  if (rsiVal >= 70) return lang === 'th' ? '🔴 Overbought' : '🔴 Overbought';
  if (rsiVal <= 30) return lang === 'th' ? '🟢 Oversold' : '🟢 Oversold';
  if (rsiVal >= 50) return lang === 'th' ? '↗ Bullish bias' : '↗ Bullish bias';
  return lang === 'th' ? '↘ Bearish bias' : '↘ Bearish bias';
}

function updateReadout(idx) {
  const lang = getLang();
  if (idx === null || idx === undefined) {
    readoutEl.innerHTML = lang === 'th'
      ? '<div>เลื่อนเมาส์บนกราฟเพื่อดูค่า</div>'
      : '<div>Hover the chart to inspect values</div>';
    return;
  }
  const p = prices[idx];
  const r = calc.rsi[idx];
  readoutEl.innerHTML = `
    <span class="chip"><span>${lang === 'th' ? 'แท่งที่' : 'Bar'}</span><strong>${idx + 1}</strong></span>
    <span class="chip"><span>${lang === 'th' ? 'ราคา' : 'Price'}</span><strong>${fmtPrice(p)}</strong></span>
    <span class="chip">RSI <strong>${r === null ? '—' : fmtNum(r, 2)}</strong></span>
    <span class="chip">${signalLabel(r)}</span>
  `;
}

// ============================================================
// Controls
// ============================================================
const presetBtns = document.querySelectorAll('.preset-btn');
presetBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    presetBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentPreset = btn.dataset.preset;
    if (currentPreset === 'random') currentSeed = (Math.random() * 0xffffff) | 0;
    selectedRow = null;
    rebuild();
  });
});

document.getElementById('regenerate-btn').addEventListener('click', () => {
  // Only works for random (fixed-seed presets stay stable)
  if (currentPreset === 'random') {
    currentSeed = (Math.random() * 0xffffff) | 0;
  } else {
    // Jitter the seed so preset asset still gets a fresh-looking path
    PRESETS[currentPreset].seed = (PRESETS[currentPreset].seed * 1664525 + 1013904223) >>> 0;
  }
  selectedRow = null;
  rebuild();
});

const periodSlider = document.getElementById('period-slider');
const periodValue = document.getElementById('period-value');
periodSlider.addEventListener('input', () => {
  period = parseInt(periodSlider.value, 10);
  periodValue.textContent = period;
  recompute();
  drawCharts();
  renderCalcTable();
  updateReadout(lastHoverIdx);
});

// ============================================================
// Signal diagrams (static SVGs)
// ============================================================
const DIAGRAMS = {
  oversold: () => rsiMiniSvg([
    [0, 50], [15, 55], [25, 45], [35, 30], [50, 18], [62, 22], [75, 42], [90, 58], [100, 62],
  ], [{ at: 50, label: '30' }], '#4ade80'),
  overbought: () => rsiMiniSvg([
    [0, 50], [15, 48], [25, 55], [38, 72], [50, 82], [60, 78], [72, 62], [85, 45], [100, 40],
  ], [{ at: 25, label: '70', top: true }], '#f87171'),
  centerline: () => rsiMiniSvg([
    [0, 30], [18, 34], [32, 42], [46, 50], [58, 58], [72, 65], [86, 62], [100, 60],
  ], [{ at: 50, label: '50', neutral: true }], '#60a5fa'),
  'bull-div': () => divergenceSvg('bull'),
  'bear-div': () => divergenceSvg('bear'),
  failure: () => rsiMiniSvg([
    [0, 40], [12, 55], [22, 72], [30, 76], [40, 60], [52, 48], [62, 58], [72, 68], [82, 56], [100, 42],
  ], [{ at: 25, label: '70', top: true }], '#f59e0b'),
};

// Build a small SVG for an RSI line (values 0..100 mapped vertically; x in 0..100)
function rsiMiniSvg(points, markers, color) {
  const W = 280, H = 140;
  const pad = { l: 28, r: 10, t: 10, b: 16 };
  const plotW = W - pad.l - pad.r;
  const plotH = H - pad.t - pad.b;
  const xFor = (px) => pad.l + (px / 100) * plotW;
  const yFor = (v) => pad.t + (1 - v / 100) * plotH;

  const yOB = yFor(70);
  const yOS = yFor(30);
  const y50 = yFor(50);

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(p[0]).toFixed(1)} ${yFor(p[1]).toFixed(1)}`).join(' ');

  return `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${yOB - pad.t}" fill="rgba(248,113,113,0.08)"/>
      <rect x="${pad.l}" y="${yOS}" width="${plotW}" height="${(H - pad.b) - yOS}" fill="rgba(74,222,128,0.08)"/>
      <line x1="${pad.l}" y1="${yOB}" x2="${W - pad.r}" y2="${yOB}" stroke="rgba(248,113,113,0.55)" stroke-dasharray="3 3"/>
      <line x1="${pad.l}" y1="${yOS}" x2="${W - pad.r}" y2="${yOS}" stroke="rgba(74,222,128,0.55)" stroke-dasharray="3 3"/>
      <line x1="${pad.l}" y1="${y50}" x2="${W - pad.r}" y2="${y50}" stroke="rgba(255,255,255,0.12)"/>
      <text x="${pad.l - 4}" y="${yOB + 3}" fill="rgba(248,113,113,0.75)" font-size="10" font-family="JetBrains Mono, monospace" text-anchor="end">70</text>
      <text x="${pad.l - 4}" y="${yOS + 3}" fill="rgba(74,222,128,0.75)" font-size="10" font-family="JetBrains Mono, monospace" text-anchor="end">30</text>
      <text x="${pad.l - 4}" y="${y50 + 3}" fill="rgba(255,255,255,0.4)" font-size="10" font-family="JetBrains Mono, monospace" text-anchor="end">50</text>
      <path d="${path}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
  `;
}

// Divergence diagram: price (top) + RSI (bottom)
function divergenceSvg(kind) {
  const W = 280, H = 140;
  const pad = { l: 6, r: 10, t: 8, b: 8 };
  const mid = H / 2;
  const priceH = mid - pad.t - 4;
  const rsiH = H - mid - pad.b - 4;

  let pricePath, rsiPath, markerP1, markerP2, markerR1, markerR2;

  if (kind === 'bull') {
    // Price lower lows (down/down), RSI higher lows (up/down/up trending)
    pricePath = `M 20 ${pad.t + 20} L 90 ${pad.t + priceH - 4} L 160 ${pad.t + 40} L 230 ${pad.t + priceH}`;
    rsiPath =   `M 20 ${mid + 34} L 90 ${mid + rsiH - 8} L 160 ${mid + 24} L 230 ${mid + rsiH - 30}`;
    markerP1 = [90, pad.t + priceH - 4];
    markerP2 = [230, pad.t + priceH];
    markerR1 = [90, mid + rsiH - 8];
    markerR2 = [230, mid + rsiH - 30];
  } else {
    // Price higher highs, RSI lower highs
    pricePath = `M 20 ${pad.t + priceH} L 90 ${pad.t + 20} L 160 ${pad.t + priceH - 24} L 230 ${pad.t + 10}`;
    rsiPath =   `M 20 ${mid + rsiH - 8} L 90 ${mid + 12} L 160 ${mid + 34} L 230 ${mid + 22}`;
    markerP1 = [90, pad.t + 20];
    markerP2 = [230, pad.t + 10];
    markerR1 = [90, mid + 12];
    markerR2 = [230, mid + 22];
  }

  const priceColor = '#60a5fa';
  const rsiColor = '#a78bfa';
  const arrow = (x1, y1, x2, y2, color) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.2" stroke-dasharray="3 3"/>`;

  return `
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${pad.l}" y1="${mid}" x2="${W - pad.r}" y2="${mid}" stroke="rgba(255,255,255,0.12)" stroke-dasharray="2 4"/>
      <text x="${W - pad.r - 2}" y="${pad.t + 12}" fill="rgba(255,255,255,0.4)" font-size="10" text-anchor="end" font-family="Inter, sans-serif">Price</text>
      <text x="${W - pad.r - 2}" y="${mid + 12}" fill="rgba(255,255,255,0.4)" font-size="10" text-anchor="end" font-family="Inter, sans-serif">RSI</text>
      <path d="${pricePath}" fill="none" stroke="${priceColor}" stroke-width="2" stroke-linejoin="round"/>
      <path d="${rsiPath}" fill="none" stroke="${rsiColor}" stroke-width="2" stroke-linejoin="round"/>
      ${arrow(markerP1[0], markerP1[1], markerP2[0], markerP2[1], priceColor)}
      ${arrow(markerR1[0], markerR1[1], markerR2[0], markerR2[1], rsiColor)}
      <circle cx="${markerP1[0]}" cy="${markerP1[1]}" r="3" fill="${priceColor}"/>
      <circle cx="${markerP2[0]}" cy="${markerP2[1]}" r="3" fill="${priceColor}"/>
      <circle cx="${markerR1[0]}" cy="${markerR1[1]}" r="3" fill="${rsiColor}"/>
      <circle cx="${markerR2[0]}" cy="${markerR2[1]}" r="3" fill="${rsiColor}"/>
    </svg>
  `;
}

function renderSignalDiagrams() {
  document.querySelectorAll('.signal-diagram').forEach((el) => {
    const kind = el.dataset.diag;
    const builder = DIAGRAMS[kind];
    if (builder) el.innerHTML = builder();
  });
}

renderSignalDiagrams();

// ============================================================
// Init
// ============================================================
rebuild();
