import { getLang, toggleLang, initLang, t } from '../../assets/i18n.js';
import { PATTERNS, CATEGORIES, BIAS } from './patterns.js';

initLang();

// ===== Language chrome =====
const langBtn = document.querySelector('.lang-btn');
function renderLangLabel() {
  if (langBtn) langBtn.textContent = getLang() === 'th' ? 'EN' : 'ไทย';
}
langBtn?.addEventListener('click', toggleLang);
document.addEventListener('langchange', () => {
  renderLangLabel();
  renderAnatomy();
  renderGalleries();
  renderBuilder();
  updateQuizUI();
});
renderLangLabel();

// ===== SVG helpers =====
const SVG_NS = 'http://www.w3.org/2000/svg';
function svg(tag, attrs = {}, ...children) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  for (const c of children) {
    if (c == null) continue;
    el.append(c.nodeType ? c : document.createTextNode(c));
  }
  return el;
}

const COLOR_BULL = '#10b981';
const COLOR_BEAR = '#ef4444';
const COLOR_DOJI = '#6b7280';
const COLOR_WICK = '#475569';
const COLOR_GRID = '#e2e8f0';

function candleColor(c) {
  if (Math.abs(c.c - c.o) < 0.001 * Math.max(1, Math.abs(c.h - c.l))) return COLOR_DOJI;
  return c.c >= c.o ? COLOR_BULL : COLOR_BEAR;
}

// Draws candles on a newly-created SVG. candles: array of {o,h,l,c}.
function makeChart(candles, opts = {}) {
  const {
    width = 360,
    height = 180,
    padding = 12,
    candleWidthRatio = 0.6,
    showGrid = true,
    labels = null,
  } = opts;

  const minL = Math.min(...candles.map(c => c.l));
  const maxH = Math.max(...candles.map(c => c.h));
  const range = maxH - minL || 1;
  const pad = range * 0.08;
  const yMin = minL - pad;
  const yMax = maxH + pad;
  const yRange = yMax - yMin;

  const innerW = width - 2 * padding;
  const innerH = height - 2 * padding;
  const slot = innerW / candles.length;
  const cw = slot * candleWidthRatio;

  const yScale = v => padding + ((yMax - v) / yRange) * innerH;

  const root = svg('svg', {
    class: 'candle-chart',
    viewBox: `0 0 ${width} ${height}`,
    xmlns: SVG_NS,
  });

  if (showGrid) {
    for (let i = 1; i < 4; i++) {
      const y = padding + (innerH / 4) * i;
      root.append(svg('line', {
        x1: padding, x2: width - padding, y1: y, y2: y,
        stroke: COLOR_GRID, 'stroke-width': 1, 'stroke-dasharray': '2,3',
      }));
    }
  }

  candles.forEach((c, i) => {
    const xCenter = padding + slot * i + slot / 2;
    const color = candleColor(c);
    const bodyTop = Math.max(c.o, c.c);
    const bodyBottom = Math.min(c.o, c.c);
    const yTop = yScale(bodyTop);
    const yBot = yScale(bodyBottom);
    const bodyH = Math.max(1.5, yBot - yTop);

    root.append(svg('line', {
      x1: xCenter, x2: xCenter, y1: yScale(c.h), y2: yScale(c.l),
      stroke: COLOR_WICK, 'stroke-width': 1.2,
    }));
    root.append(svg('rect', {
      x: xCenter - cw / 2, y: yTop, width: cw, height: bodyH,
      fill: color, stroke: color, 'stroke-width': 1,
    }));
  });

  if (labels) {
    for (const lbl of labels) root.append(lbl);
  }
  return root;
}

// ===== Anatomy diagram =====
function renderAnatomy() {
  const area = document.getElementById('anatomy-area');
  if (!area) return;
  const lang = getLang();

  const W = 520, H = 300;
  const root = svg('svg', {
    class: 'candle-chart',
    viewBox: `0 0 ${W} ${H}`,
    xmlns: SVG_NS,
  });

  // Single big bullish candle at left-center
  const cx = 160;
  const highY = 40, lowY = 260, openY = 190, closeY = 90;
  const bodyW = 38;

  // Wick
  root.append(svg('line', { x1: cx, x2: cx, y1: highY, y2: lowY, stroke: COLOR_WICK, 'stroke-width': 2 }));
  // Body
  root.append(svg('rect', { x: cx - bodyW / 2, y: closeY, width: bodyW, height: openY - closeY, fill: COLOR_BULL, stroke: COLOR_BULL }));

  // Arrows and labels
  const mkLabel = (x, y, textTh, textEn) => {
    const g = svg('g', {});
    g.append(svg('text', { x, y, 'font-size': 13, 'font-family': 'Inter, sans-serif', 'font-weight': 600, fill: '#1a1a1a' },
      lang === 'th' ? textTh : textEn));
    return g;
  };
  const line = (x1, y1, x2, y2) =>
    svg('line', { x1, y1, x2, y2, stroke: '#94a3b8', 'stroke-width': 1.2, 'stroke-dasharray': '3,3' });

  // High
  root.append(line(cx + bodyW / 2 + 2, highY, 330, highY));
  root.append(mkLabel(338, highY + 4, 'สูงสุด (High)', 'High'));

  // Low
  root.append(line(cx + bodyW / 2 + 2, lowY, 330, lowY));
  root.append(mkLabel(338, lowY + 4, 'ต่ำสุด (Low)', 'Low'));

  // Open (bottom of green body)
  root.append(line(cx + bodyW / 2 + 2, openY, 330, openY));
  root.append(mkLabel(338, openY + 4, 'เปิด (Open)', 'Open'));

  // Close (top of green body)
  root.append(line(cx + bodyW / 2 + 2, closeY, 330, closeY));
  root.append(mkLabel(338, closeY + 4, 'ปิด (Close)', 'Close'));

  // Upper shadow label
  root.append(svg('text', {
    x: cx + 30, y: 65, 'font-size': 11, fill: '#64748b', 'font-family': 'Inter, sans-serif',
  }, lang === 'th' ? 'ไส้บน (Upper wick)' : 'Upper wick'));

  // Body label
  root.append(svg('text', {
    x: cx + 30, y: 145, 'font-size': 11, fill: '#64748b', 'font-family': 'Inter, sans-serif',
  }, lang === 'th' ? 'ตัวแท่ง (Body)' : 'Body'));

  // Lower shadow label
  root.append(svg('text', {
    x: cx + 30, y: 230, 'font-size': 11, fill: '#64748b', 'font-family': 'Inter, sans-serif',
  }, lang === 'th' ? 'ไส้ล่าง (Lower wick)' : 'Lower wick'));

  area.innerHTML = '';
  area.append(root);
}

// ===== Interactive builder =====
function renderBuilder() {
  const chart = document.getElementById('builder-chart');
  const verdict = document.getElementById('builder-verdict');
  if (!chart) return;
  const o = +document.getElementById('input-o').value;
  const h = +document.getElementById('input-h').value;
  const l = +document.getElementById('input-l').value;
  const c = +document.getElementById('input-c').value;

  document.getElementById('val-o').textContent = o;
  document.getElementById('val-h').textContent = h;
  document.getElementById('val-l').textContent = l;
  document.getElementById('val-c').textContent = c;

  // Enforce constraint for display: visual always uses max/min
  const candle = { o, h: Math.max(h, o, c), l: Math.min(l, o, c), c };
  chart.innerHTML = '';
  chart.append(makeChart([candle], { width: 200, height: 260, padding: 20, candleWidthRatio: 0.5 }));

  // Heuristic verdict
  verdict.className = 'builder-verdict';
  const body = Math.abs(c - o);
  const range = Math.max(h, o, c) - Math.min(l, o, c) || 1;
  const upperWick = Math.max(h, o, c) - Math.max(o, c);
  const lowerWick = Math.min(o, c) - Math.min(l, o, c);
  const bodyRatio = body / range;

  let type = '', note = {};
  if (bodyRatio < 0.08) {
    verdict.classList.add('doji');
    if (lowerWick > upperWick * 2 && upperWick < range * 0.1) {
      type = 'Dragonfly Doji';
      note = { th: 'ไส้ล่างยาว สัญญาณ bullish reversal', en: 'Long lower wick — bullish reversal signal.' };
    } else if (upperWick > lowerWick * 2 && lowerWick < range * 0.1) {
      type = 'Gravestone Doji';
      note = { th: 'ไส้บนยาว สัญญาณ bearish reversal', en: 'Long upper wick — bearish reversal signal.' };
    } else {
      type = 'Doji';
      note = { th: 'ตลาดลังเล สองฝ่ายเสมอกัน', en: 'Market indecision — buyers and sellers balanced.' };
    }
  } else if (c > o) {
    verdict.classList.add('bull');
    if (lowerWick > body * 2 && upperWick < body * 0.5) {
      type = 'Hammer';
      note = { th: 'ไส้ล่างยาว บอกถึงการปฏิเสธราคาต่ำ หากอยู่ก้นเทรนด์ขาลง = bullish', en: 'Long lower wick rejects low prices. At a downtrend bottom: bullish.' };
    } else if (upperWick > body * 2 && lowerWick < body * 0.5) {
      type = 'Inverted Hammer';
      note = { th: 'ไส้บนยาว ที่ก้นเทรนด์ = bullish (อ่อนกว่า Hammer)', en: 'Long upper wick — at downtrend bottom, a weaker bullish signal.' };
    } else if (bodyRatio > 0.9) {
      type = 'Bullish Marubozu';
      note = { th: 'แท่งเขียวเต็มตัว แรงซื้อทรงพลัง', en: 'Full green body — strong buying pressure.' };
    } else if (upperWick > body && lowerWick > body) {
      type = 'Spinning Top';
      note = { th: 'ลังเล ไม่ชัดเจน', en: 'Indecision in the market.' };
    } else {
      type = getLang() === 'th' ? 'แท่งเขียวทั่วไป' : 'Regular Bullish Candle';
      note = { th: 'ผู้ซื้อควบคุมวันนี้', en: 'Buyers controlled the session.' };
    }
  } else if (c < o) {
    verdict.classList.add('bear');
    if (upperWick > body * 2 && lowerWick < body * 0.5) {
      type = 'Shooting Star';
      note = { th: 'ไส้บนยาว ที่ยอดเทรนด์ขาขึ้น = bearish reversal', en: 'Long upper wick — at uptrend top: bearish reversal.' };
    } else if (lowerWick > body * 2 && upperWick < body * 0.5) {
      type = 'Hanging Man';
      note = { th: 'รูปร่างเหมือน Hammer แต่ที่ยอดเทรนด์ = bearish', en: 'Hammer-shaped but at uptrend top: bearish reversal.' };
    } else if (bodyRatio > 0.9) {
      type = 'Bearish Marubozu';
      note = { th: 'แท่งแดงเต็มตัว แรงขายทรงพลัง', en: 'Full red body — strong selling pressure.' };
    } else if (upperWick > body && lowerWick > body) {
      type = 'Spinning Top';
      note = { th: 'ลังเล ไม่ชัดเจน', en: 'Indecision in the market.' };
    } else {
      type = getLang() === 'th' ? 'แท่งแดงทั่วไป' : 'Regular Bearish Candle';
      note = { th: 'ผู้ขายควบคุมวันนี้', en: 'Sellers controlled the session.' };
    }
  }

  verdict.innerHTML = `<strong>${type}</strong><span>${t(note)}</span>`;
}

// Wire builder sliders
['input-o', 'input-h', 'input-l', 'input-c'].forEach(id => {
  document.getElementById(id).addEventListener('input', renderBuilder);
});

// ===== Context chart generator =====
function seededRng(seed) {
  let s = Math.abs(seed) || 1;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function hashId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

function generateTrend(length, startPrice, direction, rng) {
  // direction: 'up' | 'down' | 'side'
  const drift = direction === 'up' ? 1.6 : direction === 'down' ? -1.6 : 0;
  const candles = [];
  let price = startPrice;
  for (let i = 0; i < length; i++) {
    const move = drift + (rng() - 0.5) * 2.5;
    const o = price;
    const cval = o + move;
    const vol = 1 + rng() * 1.8;
    const h = Math.max(o, cval) + rng() * vol;
    const l = Math.min(o, cval) - rng() * vol;
    candles.push({ o, h, l, c: cval });
    price = cval;
  }
  return candles;
}

function buildContextChart(pattern, beforeLen = 6, afterLen = 5) {
  const rng = seededRng(hashId(pattern.id));
  const beforeDir = pattern.context.before === 'downtrend' ? 'down'
    : pattern.context.before === 'uptrend' ? 'up' : 'side';
  const afterKey = pattern.context.after;
  const afterDir =
    afterKey === 'reversal_up' || afterKey === 'continuation_up' ? 'up'
    : afterKey === 'reversal_down' || afterKey === 'continuation_down' ? 'down'
    : 'side';

  const beforeStart = pattern.context.before === 'downtrend' ? 75
    : pattern.context.before === 'uptrend' ? 25 : 50;
  const before = generateTrend(beforeLen, beforeStart, beforeDir, rng);
  const lastBefore = before[before.length - 1];

  // Shift pattern candles so the first candle opens near the last before close
  const targetOpen = lastBefore.c;
  const offset = targetOpen - pattern.candles[0].o;
  const patternShifted = pattern.candles.map(c => ({
    o: c.o + offset,
    h: c.h + offset,
    l: c.l + offset,
    c: c.c + offset,
  }));

  const lastPattern = patternShifted[patternShifted.length - 1];
  const after = generateTrend(afterLen, lastPattern.c, afterDir, rng);

  return { all: [...before, ...patternShifted, ...after], patternStart: before.length, patternEnd: before.length + patternShifted.length };
}

function makeContextChart(pattern, opts = {}) {
  const { width = 520, height = 220 } = opts;
  const { all, patternStart, patternEnd } = buildContextChart(pattern);
  const chart = makeChart(all, { width, height, padding: 14, showGrid: true });

  // Highlight pattern region with translucent background
  const minL = Math.min(...all.map(c => c.l));
  const maxH = Math.max(...all.map(c => c.h));
  const range = maxH - minL;
  const pad = range * 0.08;
  const innerW = width - 28;
  const slot = innerW / all.length;

  const highlight = svg('rect', {
    x: 14 + slot * patternStart,
    y: 14,
    width: slot * (patternEnd - patternStart),
    height: height - 28,
    fill: 'rgba(37, 99, 235, 0.08)',
    stroke: 'rgba(37, 99, 235, 0.4)',
    'stroke-width': 1,
    'stroke-dasharray': '4,3',
    rx: 4,
  });
  chart.insertBefore(highlight, chart.firstChild);

  // Label above highlight
  const labelText = svg('text', {
    x: 14 + slot * patternStart + (slot * (patternEnd - patternStart)) / 2,
    y: 10,
    'text-anchor': 'middle',
    'font-size': 10,
    'font-weight': 600,
    fill: '#2563eb',
    'font-family': 'Inter, sans-serif',
  }, getLang() === 'th' ? 'รูปแบบ' : 'PATTERN');
  chart.append(labelText);

  return chart;
}

// ===== Galleries =====
function stars(n) {
  const full = '★'.repeat(n);
  const empty = `<span class="empty">${'★'.repeat(5 - n)}</span>`;
  return `${full}${empty}`;
}

function buildCard(pattern) {
  const card = document.createElement('div');
  card.className = 'pattern-card';
  card.addEventListener('click', () => openModal(pattern));

  const chartWrap = document.createElement('div');
  chartWrap.className = 'pattern-card__chart';
  chartWrap.append(makeChart(pattern.candles, { width: 180, height: 110, padding: 10, showGrid: false, candleWidthRatio: 0.5 }));

  const name = document.createElement('div');
  name.className = 'pattern-card__name';
  name.textContent = t(pattern.name);

  const meta = document.createElement('div');
  meta.className = 'pattern-card__meta';
  const biasCls = pattern.bias === 'bullish' ? 'bull' : pattern.bias === 'bearish' ? 'bear' : 'neutral';
  meta.innerHTML = `
    <span class="bias-tag ${biasCls}">${t(BIAS[pattern.bias])}</span>
    <span class="stars" title="Reliability">${stars(pattern.reliability)}</span>
  `;

  card.append(chartWrap, name, meta);
  return card;
}

function renderGalleries() {
  const buckets = {
    single: document.getElementById('gallery-single'),
    two: document.getElementById('gallery-two'),
    three: document.getElementById('gallery-three'),
    cont: document.getElementById('gallery-cont'),
  };
  for (const key of Object.keys(buckets)) buckets[key].innerHTML = '';
  for (const p of PATTERNS) {
    buckets[p.category].append(buildCard(p));
  }
}

// ===== Modal =====
const modal = document.getElementById('pattern-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

function openModal(pattern) {
  modalTitle.textContent = t(pattern.name);
  modalBody.innerHTML = '';

  // Chart
  const chartWrap = document.createElement('div');
  chartWrap.className = 'modal-chart';
  chartWrap.append(makeContextChart(pattern, { width: 600, height: 240 }));
  modalBody.append(chartWrap);

  // Meta
  const biasCls = pattern.bias === 'bullish' ? 'bull' : pattern.bias === 'bearish' ? 'bear' : 'neutral';
  const categoryLabel = t(CATEGORIES[pattern.category]);
  const biasLabel = t(BIAS[pattern.bias]);
  const contextMap = {
    downtrend: { th: 'หลังเทรนด์ขาลง', en: 'After downtrend' },
    uptrend: { th: 'หลังเทรนด์ขาขึ้น', en: 'After uptrend' },
    any: { th: 'เทรนด์ใดก็ได้', en: 'Any trend' },
  };
  const meta = document.createElement('div');
  meta.className = 'modal-meta';
  meta.innerHTML = `
    <div><span class="label">${t({ th: 'หมวด', en: 'Category' })}:</span> <strong>${categoryLabel}</strong></div>
    <div><span class="label">${t({ th: 'ทิศทาง', en: 'Bias' })}:</span> <span class="bias-tag ${biasCls}">${biasLabel}</span></div>
    <div><span class="label">${t({ th: 'บริบท', en: 'Context' })}:</span> <strong>${t(contextMap[pattern.context.before])}</strong></div>
    <div><span class="label">${t({ th: 'ความน่าเชื่อถือ', en: 'Reliability' })}:</span> <span class="stars">${stars(pattern.reliability)}</span></div>
  `;
  modalBody.append(meta);

  // Sections
  const sections = [
    { title: { th: 'ลักษณะ', en: 'Description' }, content: pattern.description },
    { title: { th: 'จิตวิทยาตลาด', en: 'Market Psychology' }, content: pattern.psychology },
    { title: { th: 'วิธีตีความ', en: 'How to Read' }, content: pattern.signal },
  ];
  for (const s of sections) {
    const block = document.createElement('div');
    block.className = 'modal-section';
    block.innerHTML = `<h4>${t(s.title)}</h4><p>${t(s.content)}</p>`;
    modalBody.append(block);
  }

  modal.classList.add('open');
  modalBackdrop.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('open');
  modalBackdrop.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== Quiz =====
const QUIZ_KEY = 'mysandbox.candlestick.quiz';
function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(QUIZ_KEY)) || { correct: 0, total: 0, streak: 0, best: 0 };
  } catch {
    return { correct: 0, total: 0, streak: 0, best: 0 };
  }
}
function saveStats(s) { localStorage.setItem(QUIZ_KEY, JSON.stringify(s)); }

let quizStats = loadStats();
let quizCurrent = null;
let quizAnswered = false;

function pickRandom(arr, n, exclude) {
  const pool = arr.filter(x => x.id !== exclude);
  const out = [];
  while (out.length < n && pool.length) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function newQuestion() {
  const correct = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  const distractors = pickRandom(PATTERNS, 3, correct.id);
  const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
  quizCurrent = { correct, options };
  quizAnswered = false;

  const chartEl = document.getElementById('quiz-chart');
  chartEl.innerHTML = '';
  chartEl.append(makeContextChart(correct, { width: 600, height: 240 }));

  const optionsEl = document.getElementById('quiz-options');
  optionsEl.innerHTML = '';
  for (const p of options) {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = t(p.name);
    btn.addEventListener('click', () => handleAnswer(p, btn));
    optionsEl.append(btn);
  }

  document.getElementById('quiz-feedback').className = 'quiz-feedback';
  document.getElementById('quiz-feedback').innerHTML = '';
  document.getElementById('quiz-next').style.display = 'none';
}

function handleAnswer(pickedPattern, btn) {
  if (quizAnswered) return;
  quizAnswered = true;
  const correct = quizCurrent.correct;
  const isCorrect = pickedPattern.id === correct.id;

  quizStats.total += 1;
  if (isCorrect) {
    quizStats.correct += 1;
    quizStats.streak += 1;
    if (quizStats.streak > quizStats.best) quizStats.best = quizStats.streak;
  } else {
    quizStats.streak = 0;
  }
  saveStats(quizStats);
  updateQuizUI();

  // Mark buttons
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach(b => {
    b.setAttribute('disabled', 'true');
    if (b.textContent === t(correct.name)) b.classList.add('correct');
    if (b === btn && !isCorrect) b.classList.add('wrong');
  });

  const fb = document.getElementById('quiz-feedback');
  fb.className = `quiz-feedback visible ${isCorrect ? 'correct' : 'wrong'}`;
  fb.innerHTML = isCorrect
    ? `<strong>${t({ th: '✓ ถูกต้อง!', en: '✓ Correct!' })}</strong> ${t(correct.signal)}`
    : `<strong>${t({ th: '✗ ผิด', en: '✗ Wrong' })}</strong> — ${t({ th: 'คำตอบที่ถูกคือ', en: 'Correct answer:' })} <strong>${t(correct.name)}</strong>. ${t(correct.signal)}`;
  document.getElementById('quiz-next').style.display = 'inline-flex';
}

function updateQuizUI() {
  document.getElementById('quiz-score').textContent = `${quizStats.correct} / ${quizStats.total}`;
  document.getElementById('quiz-accuracy').textContent =
    quizStats.total === 0 ? '—' : `${((quizStats.correct / quizStats.total) * 100).toFixed(0)}%`;
  document.getElementById('quiz-streak').textContent = quizStats.streak;
  document.getElementById('quiz-best').textContent = quizStats.best;
}

document.getElementById('quiz-next').addEventListener('click', newQuestion);
document.getElementById('quiz-reset').addEventListener('click', () => {
  if (!confirm(t({ th: 'ล้างสถิติทั้งหมด?', en: 'Reset all stats?' }))) return;
  quizStats = { correct: 0, total: 0, streak: 0, best: 0 };
  saveStats(quizStats);
  updateQuizUI();
});

// ===== Boot =====
renderAnatomy();
renderBuilder();
renderGalleries();
updateQuizUI();
newQuestion();
