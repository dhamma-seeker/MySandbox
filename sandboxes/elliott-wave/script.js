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
renderLangLabel();

document.addEventListener('langchange', () => {
  renderLangLabel();
  renderDegreesTable();
  renderWavePsy(activeWave);
  drawBuilder();
  renderRules();
  renderBuilderSliders();
  drawFractal();
  drawFib();
  renderVariantGrid();
  renderQuizCard();
});

// ============================================================
// SECTION 2 — Wave 5-3 hover/tap psychology
// ============================================================
const PSY = {
  '0': { th: 'จุดเริ่มต้น', en: 'Starting point', phase: 'Bottom', psy: {
    th: 'ตลาดอยู่ในภาวะหดหู่หลังจาก downtrend ที่ผ่านมา ราคาต่ำสุด ความเชื่อมั่นต่ำสุด นักลงทุนส่วนใหญ่ยอมแพ้',
    en: 'Market is in despair after the previous downtrend. Lowest price, lowest sentiment. Most investors have given up.'
  }},
  '1': { th: 'คลื่น 1', en: 'Wave 1', phase: 'Disbelief', psy: {
    th: 'ราคาเริ่มขึ้นเบาๆ คนส่วนใหญ่ยังคิดว่าเป็นแค่ bounce ของ downtrend ไม่ค่อยมีคนเชื่อ volume ปานกลาง',
    en: 'Price ticks up. Most still see it as a bounce in the downtrend. Few believe. Modest volume.'
  }},
  '2': { th: 'คลื่น 2', en: 'Wave 2', phase: 'Skepticism', psy: {
    th: 'ราคาย่อลงแรง 50–61.8% ของคลื่น 1 หลายคนเชื่อว่า downtrend กลับมาแล้ว — แต่ห้ามต่ำกว่าจุดเริ่มคลื่น 1',
    en: 'Sharp pullback (50–61.8% of W1). Many believe downtrend resumed — but it must NOT break below W1\'s start.'
  }},
  '3': { th: 'คลื่น 3', en: 'Wave 3', phase: 'Acceptance / Strongest', psy: {
    th: 'คลื่นที่แรงและยาวที่สุด — ทุกคนเริ่มเชื่อ ข่าวดีเริ่มทยอยออก volume สูง breakout เด็ดขาด มัก extend 161.8%+',
    en: 'The strongest, often longest wave. Everyone now believes. Good news flows in. High volume, decisive breakout. Often 161.8%+.'
  }},
  '4': { th: 'คลื่น 4', en: 'Wave 4', phase: 'Profit-taking', psy: {
    th: 'คลื่นปรับฐานแบบ "พักหายใจ" คนเก่าทยอยขายทำกำไร มักเป็น sideways/triangle และตื้นกว่าคลื่น 2 (~38.2%)',
    en: 'A "breather" pullback — early holders take profits. Often sideways/triangular, and shallower than W2 (~38.2%).'
  }},
  '5': { th: 'คลื่น 5', en: 'Wave 5', phase: 'Euphoria', psy: {
    th: 'คนทั่วไปแห่เข้าซื้อตอนปลายเทรนด์ — ข่าวดีพาดหัวทุกที่ แต่ volume เริ่มลด divergence ในตัวชี้วัดเริ่มเห็น',
    en: 'Retail piles in at trend\'s end. Good news everywhere. But volume often weakens; momentum divergence appears.'
  }},
  'A': { th: 'คลื่น A', en: 'Wave A', phase: 'Denial', psy: {
    th: 'ราคาตกลงครั้งแรกหลัง top — คนส่วนใหญ่ยังคิดว่า "แค่ correction ปกติ ของถูกแล้ว ซื้อเพิ่ม"',
    en: 'First drop after top. Most still think "just a normal correction, buy the dip."'
  }},
  'B': { th: 'คลื่น B', en: 'Wave B', phase: 'Bull Trap', psy: {
    th: 'ราคาดีดกลับ "หลอก" ให้คิดว่า uptrend ยังไม่จบ — คลื่น B มักไม่ทำ high ใหม่ และ volume ต่ำ',
    en: 'A relief bounce that "tricks" people into thinking uptrend resumes. Usually fails to make new high; low volume.'
  }},
  'C': { th: 'คลื่น C', en: 'Wave C', phase: 'Capitulation', psy: {
    th: 'ขายแบบยอมแพ้ — ราคาทะลุต่ำกว่าจุดต่ำของ A เกือบทุกครั้ง คลื่น C มักยาว = คลื่น A หรือ 161.8% ของ A',
    en: 'Capitulation. Price almost always breaks below A\'s low. C often equals A or extends to 161.8% × A.'
  }},
};

const psyEl = document.getElementById('wavePsy');
let activeWave = null;
function renderWavePsy(key) {
  if (!psyEl) return;
  if (!key || !PSY[key]) {
    psyEl.innerHTML = `
      <span class="wave-psy__hint" data-lang-th>← เลื่อนเมาส์/แตะจุดคลื่นเพื่อดูจิตวิทยา</span>
      <span class="wave-psy__hint" data-lang-en>← Hover/tap a wave dot to see psychology</span>`;
    return;
  }
  const w = PSY[key];
  const isCorr = ['A','B','C'].includes(key);
  psyEl.innerHTML = `
    <div class="wave-psy__title ${isCorr ? 'corr' : ''}">${t({th: w.th, en: w.en})} <span class="wave-psy__phase">— ${w.phase}</span></div>
    <div>${t(w.psy)}</div>`;
}
document.querySelectorAll('.wv-dots circle').forEach(dot => {
  const k = dot.getAttribute('data-wave');
  const activate = () => {
    document.querySelectorAll('.wv-dots circle').forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    activeWave = k;
    renderWavePsy(k);
  };
  dot.addEventListener('mouseenter', activate);
  dot.addEventListener('click', activate);
  dot.addEventListener('touchstart', e => { e.preventDefault(); activate(); }, { passive: false });
});

// ============================================================
// SECTION 3 — 9 Wave Degrees table
// ============================================================
const DEGREES = [
  { name: { th: 'Grand Supercycle', en: 'Grand Supercycle' }, imp: 'Ⓘ Ⓘ Ⓘ Ⓘ Ⓘ',     corr: 'Ⓐ Ⓑ Ⓒ',     dur: { th: 'หลายร้อยปี (multi-century)', en: 'Multi-century' } },
  { name: { th: 'Supercycle',       en: 'Supercycle'       }, imp: 'I II III IV V',  corr: 'A B C',     dur: { th: 'หลายสิบปี', en: 'Decades' } },
  { name: { th: 'Cycle',            en: 'Cycle'            }, imp: 'I II III IV V',  corr: 'a b c',     dur: { th: 'หลายปี', en: 'Years' } },
  { name: { th: 'Primary',          en: 'Primary'          }, imp: '① ② ③ ④ ⑤',     corr: 'Ⓐ Ⓑ Ⓒ',     dur: { th: 'เดือน – ปี', en: 'Months – years' } },
  { name: { th: 'Intermediate',     en: 'Intermediate'     }, imp: '(1)(2)(3)(4)(5)', corr: '(A)(B)(C)', dur: { th: 'สัปดาห์ – เดือน', en: 'Weeks – months' } },
  { name: { th: 'Minor',            en: 'Minor'            }, imp: '1 2 3 4 5',      corr: 'A B C',     dur: { th: 'สัปดาห์', en: 'Weeks' } },
  { name: { th: 'Minute',           en: 'Minute'           }, imp: '(i)(ii)(iii)(iv)(v)', corr: '(a)(b)(c)', dur: { th: 'วัน – สัปดาห์', en: 'Days – weeks' } },
  { name: { th: 'Minuette',         en: 'Minuette'         }, imp: 'i ii iii iv v',  corr: 'a b c',     dur: { th: 'ชั่วโมง – วัน', en: 'Hours – days' } },
  { name: { th: 'Subminuette',      en: 'Subminuette'      }, imp: '1 2 3 4 5',      corr: 'a b c',     dur: { th: 'นาที – ชั่วโมง', en: 'Minutes – hours' } },
];

function renderDegreesTable() {
  const tbody = document.getElementById('degreesTable');
  if (!tbody) return;
  tbody.innerHTML = DEGREES.map((d, i) => {
    const hue = 220 - i * 10;
    return `<tr style="border-left-color:hsl(${hue} 70% 55%);">
      <td class="deg-name">${t(d.name)}</td>
      <td class="deg-not">${d.imp}</td>
      <td class="deg-not deg-not--corr">${d.corr}</td>
      <td>${t(d.dur)}</td>
    </tr>`;
  }).join('');
}
renderDegreesTable();

// ============================================================
// SECTION 4 — Wave Builder (canvas + sliders)
// ============================================================
// Points are (xFraction, yFraction) in [0..1] of canvas (y inverted: 1=bottom, 0=top)
// 6 points: 0 (start, fixed), 1, 2, 3, 4, 5
const DEFAULT_PTS = [
  { x: 0.05, y: 0.10, fixed: true },
  { x: 0.20, y: 0.45 },
  { x: 0.30, y: 0.30 },
  { x: 0.55, y: 0.80 },
  { x: 0.65, y: 0.65 },
  { x: 0.92, y: 0.95 },
];
let pts = DEFAULT_PTS.map(p => ({ ...p }));
const canvas = document.getElementById('builderCanvas');
const ctx = canvas?.getContext('2d');
const CW = 720, CH = 380;

function pxOf(p) {
  return { x: 30 + p.x * (CW - 60), y: 20 + (1 - p.y) * (CH - 60) };
}
function drawBuilder() {
  if (!ctx) return;
  // crisp on retina
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== CW * dpr) {
    canvas.width = CW * dpr;
    canvas.height = CH * dpr;
    ctx.scale(dpr, dpr);
  }
  ctx.clearRect(0, 0, CW, CH);

  // grid
  ctx.strokeStyle = '#e5e5e5';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let g = 0; g <= 4; g++) {
    const y = 20 + g * (CH - 60) / 4;
    ctx.moveTo(30, y); ctx.lineTo(CW - 30, y);
  }
  ctx.stroke();
  ctx.fillStyle = '#888';
  ctx.font = '11px Inter, sans-serif';
  ctx.fillText(t({th:'ราคา', en:'Price'}), 6, 26);
  ctx.fillText(t({th:'เวลา →', en:'Time →'}), CW - 80, CH - 8);

  // wave 1 high horizontal guide (for rule 3)
  const w1high = pxOf(pts[1]);
  ctx.strokeStyle = '#fed7aa';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, w1high.y); ctx.lineTo(CW - 30, w1high.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#9a3412';
  ctx.font = '10px Inter';
  ctx.fillText('Wave 1 high', CW - 95, w1high.y - 4);

  // line
  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  pts.forEach((p, i) => {
    const px = pxOf(p);
    if (i === 0) ctx.moveTo(px.x, px.y); else ctx.lineTo(px.x, px.y);
  });
  ctx.stroke();

  // dots + labels
  pts.forEach((p, i) => {
    const px = pxOf(p);
    ctx.beginPath();
    ctx.arc(px.x, px.y, p.fixed ? 5 : 8, 0, Math.PI * 2);
    ctx.fillStyle = p.fixed ? '#888' : '#2563eb';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (i > 0) {
      ctx.fillStyle = '#1e40af';
      ctx.font = '700 13px Inter';
      ctx.fillText(String(i), px.x + 11, px.y - 8);
    } else {
      ctx.fillStyle = '#666';
      ctx.font = '11px Inter';
      ctx.fillText(t({th:'เริ่ม', en:'start'}), px.x - 8, px.y + 18);
    }
  });
}

// Rule checking
function checkRules() {
  // Working with y as "altitude": higher y = higher price.
  const y = pts.map(p => p.y);
  // Rule 1: Wave 2's low must not go below start (y[2] >= y[0])
  const r1 = y[2] >= y[0] - 1e-9;
  // Rule 2: Wave 3 must not be the SHORTEST among 1, 3, 5
  const lenW1 = y[1] - y[0];
  const lenW3 = y[3] - y[2];
  const lenW5 = y[5] - y[4];
  const r2 = !(lenW3 < lenW1 && lenW3 < lenW5); // not shortest
  // Rule 3: Wave 4 must not overlap Wave 1's price territory
  // Wave 4's low (y[4]) must be ABOVE Wave 1's high (y[1])
  const r3 = y[4] > y[1];
  // Bonus alignment: must be impulse direction (general up)
  const isUp = y[1] > y[0] && y[3] > y[2] && y[5] > y[4];
  return { r1, r2, r3, isUp, lenW1, lenW3, lenW5 };
}

const RULES_LBL = [
  { th: 'คลื่น 2 ห้ามต่ำกว่าจุดเริ่มคลื่น 1', en: 'Wave 2 must not go below Wave 1\'s start' },
  { th: 'คลื่น 3 ห้ามสั้นที่สุดในสามคลื่น (1, 3, 5)', en: 'Wave 3 must not be the shortest of (1, 3, 5)' },
  { th: 'คลื่น 4 ห้ามทับเขตราคาคลื่น 1', en: 'Wave 4 must not overlap Wave 1\'s territory' },
];

function renderRules() {
  const box = document.getElementById('builderRules');
  if (!box) return;
  const r = checkRules();
  const items = [r.r1, r.r2, r.r3];
  box.innerHTML = items.map((ok, i) => `
    <div class="rule-pill ${ok ? 'ok' : 'fail'}">
      <span class="rule-pill__icon">${ok ? '✅' : '❌'}</span>
      <span class="rule-pill__text">${t(RULES_LBL[i])}</span>
    </div>
  `).join('') + (items.every(x => x) ? `
    <div class="rule-pill ok" style="background:#dbeafe;border-color:#93c5fd;color:#1e3a8a;">
      <span class="rule-pill__icon">🎉</span>
      <span class="rule-pill__text">${t({th:'ยอดเยี่ยม! โครงสร้าง impulse ถูกต้องตามกฎทั้ง 3 ข้อ', en:'Perfect! Valid impulse structure under all 3 rules.'})}</span>
    </div>` : '');
}

// Slider (mobile) — 5 sliders for points 1..5 (y only, x fixed evenly)
function renderBuilderSliders() {
  const wrap = document.getElementById('builderSliders');
  if (!wrap) return;
  wrap.innerHTML = pts.slice(1).map((p, i) => {
    const idx = i + 1;
    return `<label>
      <span>Wave ${idx}</span>
      <input type="range" min="0" max="100" step="0.5" value="${(p.y * 100).toFixed(1)}" data-idx="${idx}">
      <output>${(p.y * 100).toFixed(0)}</output>
    </label>`;
  }).join('');
  wrap.querySelectorAll('input[type=range]').forEach(input => {
    input.addEventListener('input', e => {
      const idx = +e.target.dataset.idx;
      const v = +e.target.value / 100;
      pts[idx].y = v;
      e.target.nextElementSibling.value = (v * 100).toFixed(0);
      drawBuilder();
      renderRules();
    });
  });
}

// Dragging on canvas
let dragging = -1;
function eventToLocal(ev) {
  const rect = canvas.getBoundingClientRect();
  const tx = (ev.touches ? ev.touches[0].clientX : ev.clientX) - rect.left;
  const ty = (ev.touches ? ev.touches[0].clientY : ev.clientY) - rect.top;
  const x = tx / rect.width * CW;
  const y = ty / rect.height * CH;
  return { x, y };
}
function findHit(local) {
  for (let i = pts.length - 1; i > 0; i--) {
    const px = pxOf(pts[i]);
    const dx = px.x - local.x, dy = px.y - local.y;
    if (dx * dx + dy * dy < 22 * 22) return i;
  }
  return -1;
}
canvas?.addEventListener('mousedown', e => {
  const lc = eventToLocal(e);
  dragging = findHit(lc);
});
canvas?.addEventListener('touchstart', e => {
  const lc = eventToLocal(e);
  dragging = findHit(lc);
  if (dragging > 0) e.preventDefault();
}, { passive: false });
function moveHandler(e) {
  if (dragging <= 0) return;
  const lc = eventToLocal(e);
  const newX = (lc.x - 30) / (CW - 60);
  const newY = 1 - (lc.y - 20) / (CH - 60);
  // clamp
  pts[dragging].x = Math.min(0.99, Math.max(pts[dragging - 1].x + 0.02,
                       Math.min(dragging < pts.length - 1 ? pts[dragging + 1].x - 0.02 : 0.99, newX)));
  pts[dragging].y = Math.min(1, Math.max(0, newY));
  drawBuilder();
  renderRules();
  renderBuilderSliders();
  if (e.cancelable) e.preventDefault();
}
canvas?.addEventListener('mousemove', moveHandler);
canvas?.addEventListener('touchmove', moveHandler, { passive: false });
['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(ev =>
  canvas?.addEventListener(ev, () => { dragging = -1; })
);

document.getElementById('builderReset')?.addEventListener('click', () => {
  pts = DEFAULT_PTS.map(p => ({ ...p }));
  drawBuilder();
  renderRules();
  renderBuilderSliders();
});

drawBuilder();
renderRules();
renderBuilderSliders();

// ============================================================
// SECTION 5 — Fractal zoom
// ============================================================
const fractalSvg = document.getElementById('fractalSvg');
const fractalLevelEl = document.getElementById('fractalLevel');
let fractalLevel = 0; // 0 = main 5-3, 1 = inside W3 (5 sub-waves), 2 = inside sub-W3

const FRAC_LEVELS = [
  {
    label: { th: 'ระดับ 0 — ภาพรวม Cycle (5 คลื่น)', en: 'Level 0 — Full Cycle (5 waves)' },
    pts: [[40,260],[200,180],[260,210],[420,90],[480,130],[700,30]],
    labels: ['','1','2','3','4','5'],
    highlight: [2,3], // segment to zoom (W3 = pts[2]→pts[3])
  },
  {
    label: { th: 'ระดับ 1 — ซูมเข้า Wave 3 (เห็น 5 คลื่นย่อย)', en: 'Level 1 — Inside Wave 3 (5 sub-waves visible)' },
    pts: [[40,260],[180,170],[230,200],[400,100],[450,135],[700,30]],
    labels: ['','(i)','(ii)','(iii)','(iv)','(v)'],
    highlight: [2,3],
  },
  {
    label: { th: 'ระดับ 2 — ซูมเข้า sub-Wave (iii) (fractal ลึกขึ้น)', en: 'Level 2 — Inside sub-Wave (iii) (deeper fractal)' },
    pts: [[40,260],[170,180],[210,210],[400,110],[460,140],[700,30]],
    labels: ['','i','ii','iii','iv','v'],
    highlight: [2,3],
  },
];

function drawFractal() {
  if (!fractalSvg) return;
  const lv = FRAC_LEVELS[fractalLevel];
  const pts2 = lv.pts;
  const path = pts2.map((p,i) => (i===0?'M':'L') + p[0] + ',' + p[1]).join(' ');
  // highlight segment
  const hi1 = pts2[lv.highlight[0]], hi2 = pts2[lv.highlight[1]];
  const hiPath = `M${hi1[0]},${hi1[1]} L${hi2[0]},${hi2[1]}`;
  // axis
  fractalSvg.innerHTML = `
    <line x1="30" y1="20" x2="30" y2="290" stroke="#e5e5e5"/>
    <line x1="30" y1="290" x2="780" y2="290" stroke="#e5e5e5"/>
    <path d="${hiPath}" stroke="#fbbf24" stroke-width="14" fill="none" stroke-linecap="round" opacity="0.45"/>
    <path class="frac-line" d="${path}" stroke="#2563eb"/>
    ${pts2.map((p,i) => `
      <circle class="frac-dot" cx="${p[0]}" cy="${p[1]}" r="6" fill="${i===0?'#888':'#2563eb'}"/>
      <text class="frac-label" x="${p[0]+10}" y="${p[1]-8}" fill="#1e40af">${lv.labels[i]}</text>
    `).join('')}
    <text x="780" y="305" text-anchor="end" font-size="11" fill="#888">Time →</text>
    <text x="35" y="20" text-anchor="start" font-size="11" fill="#fbbf24" font-weight="600">
      ${t({th:'พื้นที่ที่จะซูม →', en:'Zoom region →'})}
    </text>
  `;
  if (fractalLevelEl) fractalLevelEl.textContent = t(lv.label);
}
document.getElementById('fractalZoomIn')?.addEventListener('click', () => {
  if (fractalLevel < FRAC_LEVELS.length - 1) { fractalLevel++; drawFractal(); }
});
document.getElementById('fractalZoomOut')?.addEventListener('click', () => {
  if (fractalLevel > 0) { fractalLevel--; drawFractal(); }
});
drawFractal();

// ============================================================
// SECTION 6 — Fibonacci retrace + projection
// ============================================================
const fibSvg = document.getElementById('fibSvg');
const fibW2 = document.getElementById('fibW2');
const fibW3 = document.getElementById('fibW3');
const fibW4 = document.getElementById('fibW4');
const fibW2Out = document.getElementById('fibW2Out');
const fibW3Out = document.getElementById('fibW3Out');
const fibW4Out = document.getElementById('fibW4Out');

function drawFib() {
  if (!fibSvg) return;
  const w2pct = +fibW2.value;
  const w3pct = +fibW3.value;
  const w4pct = +fibW4.value;
  if (fibW2Out) fibW2Out.textContent = w2pct.toFixed(1) + '%';
  if (fibW3Out) fibW3Out.textContent = w3pct.toFixed(1) + '%';
  if (fibW4Out) fibW4Out.textContent = w4pct.toFixed(1) + '%';

  // Layout: time axis 0..800, price axis 320..40 (top is 40)
  const SX = 40, EX = 760;
  const BOT = 320, TOP = 40;
  const totalW = EX - SX;

  // Wave 1: 0 → 100 in price units (we'll scale to height)
  // Define unit length = 80px in y
  const unit = 80;
  const start = { x: SX + 10,  y: BOT - 10 };
  const w1   = { x: SX + 100, y: start.y - unit };
  const w2   = { x: SX + 160, y: w1.y + unit * (w2pct / 100) };
  // Wave 3 length = w3pct% of W1 length
  const w3   = { x: SX + 320, y: w2.y - unit * (w3pct / 100) };
  // Wave 4: retrace w4pct% of Wave 3
  const w4   = { x: SX + 400, y: w3.y + unit * (w3pct / 100) * (w4pct / 100) };
  // Wave 5: equal length to W1
  const w5   = { x: SX + 540, y: w4.y - unit };

  // Validity rules check (for hint)
  const ok2 = w2.y < start.y;
  const lenW1 = start.y - w1.y;
  const lenW3 = w2.y - w3.y;
  const lenW5 = w4.y - w5.y;
  const ok3 = !(lenW3 < lenW1 && lenW3 < lenW5);
  const ok4 = w4.y < w1.y; // wave 4 above wave 1 high

  const polyPts = [start, w1, w2, w3, w4, w5];
  const polyStr = polyPts.map(p => `${p.x},${p.y}`).join(' ');

  // Fib lines for retracements (w1 levels)
  const fibLevels = [0.236, 0.382, 0.5, 0.618, 0.786];
  const fibLines = fibLevels.map(level => {
    const y = w1.y + lenW1 * level;
    return `<line x1="${start.x}" y1="${y}" x2="${EX}" y2="${y}" stroke="#cbd5e1" stroke-width="0.5" stroke-dasharray="3 3"/>
            <text x="${EX-4}" y="${y-3}" text-anchor="end" font-size="9" fill="#64748b">${(level*100).toFixed(1)}%</text>`;
  }).join('');

  // Highlight current W2 retrace level
  const w2Y = w2.y;
  const w2Hi = `<line x1="${start.x}" y1="${w2Y}" x2="${EX}" y2="${w2Y}" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="5 3"/>
                <text x="${EX-4}" y="${w2Y-4}" text-anchor="end" font-size="11" fill="#dc2626" font-weight="600">W2 = ${w2pct.toFixed(1)}%</text>`;

  // Wave3 extension target line (from start)
  const w3Hi = `<line x1="${start.x}" y1="${w3.y}" x2="${EX}" y2="${w3.y}" stroke="#16a34a" stroke-width="1.2" stroke-dasharray="5 3"/>
                <text x="${EX-4}" y="${w3.y-4}" text-anchor="end" font-size="11" fill="#16a34a" font-weight="600">W3 ext = ${w3pct.toFixed(1)}% of W1</text>`;

  fibSvg.innerHTML = `
    <line x1="${SX}" y1="${TOP}" x2="${SX}" y2="${BOT}" stroke="#e5e5e5"/>
    <line x1="${SX}" y1="${BOT}" x2="${EX+30}" y2="${BOT}" stroke="#e5e5e5"/>
    ${fibLines}
    ${w2Hi}
    ${w3Hi}
    <polyline points="${polyStr}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
    ${polyPts.map((p,i) => i === 0 ? '' : `
      <circle cx="${p.x}" cy="${p.y}" r="6" fill="#2563eb" stroke="white" stroke-width="2"/>
      <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" font-size="13" font-weight="700" fill="#1e40af">${i}</text>
    `).join('')}
    <circle cx="${start.x}" cy="${start.y}" r="5" fill="#888" stroke="white" stroke-width="2"/>
    ${(!ok2 || !ok3 || !ok4) ? `<text x="${SX+8}" y="${TOP+14}" font-size="12" fill="#dc2626" font-weight="600">⚠ ${t({th:'ค่าปัจจุบันละเมิดกฎ', en:'current values break a rule'})}</text>` : ''}
  `;
}
[fibW2, fibW3, fibW4].forEach(s => s?.addEventListener('input', drawFib));
drawFib();

// ============================================================
// SECTION 7 — Variant gallery (imperfect-but-valid patterns)
// ============================================================
const VARIANTS = [
  {
    title: { th: 'Extended 3rd', en: 'Extended Third' },
    type: 'imp',
    sub: { th: 'คลื่น 3 ยาวเกิน 161.8% มาก (พบบ่อยที่สุด)', en: 'Wave 3 stretches well past 161.8% (most common)' },
    pts: [[20,170],[60,140],[80,150],[260,40],[290,80],[330,30]],
    labels: ['','1','2','3','4','5'],
    desc: { th: 'ในความเป็นจริง คลื่น 3 คือ "extended wave" บ่อยที่สุด — กินสัดส่วนเวลาและระยะมากที่สุดของ impulse', en: 'In reality, Wave 3 is the "extended wave" most often — dominating both time and distance.' },
  },
  {
    title: { th: 'Truncated 5th', en: 'Truncated Fifth' },
    type: 'imp',
    sub: { th: 'คลื่น 5 ทำ high ไม่ผ่านยอดคลื่น 3', en: 'Wave 5 fails to exceed Wave 3\'s high' },
    pts: [[20,170],[80,130],[110,145],[200,40],[240,80],[300,55]],
    labels: ['','1','2','3','4','5'],
    desc: { th: 'สัญญาณอ่อนแอ — คนเริ่มไม่กล้าซื้อต่อ บ่งชี้ว่า downtrend ใหญ่อาจตามมา', en: 'A weakness signal — buyers exhausted; suggests a major downtrend may follow.' },
  },
  {
    title: { th: 'Leading Diagonal', en: 'Leading Diagonal' },
    type: 'imp',
    sub: { th: 'คลื่น 1 หรือ A เป็นรูป wedge', en: 'Wave 1 or A appears as a wedge' },
    pts: [[20,160],[100,110],[130,140],[200,80],[230,110],[300,60]],
    labels: ['','1','2','3','4','5'],
    desc: { th: 'คลื่น 4 ทับเขตคลื่น 1 ได้ "เฉพาะใน diagonal" — ข้อยกเว้นเดียวของกฎข้อ 3', en: 'Wave 4 is allowed to overlap Wave 1 ONLY in diagonals — the sole exception to rule #3.' },
  },
  {
    title: { th: 'ZigZag (5-3-5)', en: 'ZigZag (5-3-5)' },
    type: 'corr',
    sub: { th: 'คลื่นปรับฐาน "ชัน" ทั่วไป', en: 'Sharp standard correction' },
    pts: [[20,40],[160,140],[200,90],[330,180]],
    labels: ['','A','B','C'],
    desc: { th: 'A และ C ลึก — wave B ดีดกลับเล็กน้อย ไม่ทำ high ใหม่ พบบ่อยใน intermediate degree', en: 'A and C are deep; B bounces but does not exceed prior high. Common at intermediate degree.' },
  },
  {
    title: { th: 'Flat (3-3-5)', en: 'Flat (3-3-5)' },
    type: 'corr',
    sub: { th: 'B กลับขึ้นเกือบเท่าจุดเริ่ม', en: 'B retraces nearly 100% of A' },
    pts: [[20,50],[120,130],[220,55],[330,140]],
    labels: ['','A','B','C'],
    desc: { th: 'แบนนิ่งคล้าย sideways — B retrace 90-105% ของ A; C จบลึกกว่า A เล็กน้อย', en: 'Sideways-looking; B retraces 90–105% of A; C ends slightly past A.' },
  },
  {
    title: { th: 'Expanded Flat', en: 'Expanded Flat' },
    type: 'corr',
    sub: { th: 'B ทำ high ใหม่ก่อนที่ C จะลงแรง', en: 'B exceeds prior high before C dives' },
    pts: [[20,50],[120,140],[220,30],[330,160]],
    labels: ['','A','B','C'],
    desc: { th: '"กับดักนักลงทุน" — B หลอกว่ายังไป trend ต่อ แต่ C จบที่ระดับลึกกว่า A มาก', en: '"Investor trap" — B suggests trend continuation, but C ends much deeper than A.' },
  },
  {
    title: { th: 'Triangle (Contracting)', en: 'Contracting Triangle' },
    type: 'corr',
    sub: { th: 'รูปกรวยแคบลง 5 คลื่น a-b-c-d-e', en: 'Narrowing 5-leg correction' },
    pts: [[20,40],[80,150],[140,60],[200,135],[260,75],[320,120]],
    labels: ['','a','b','c','d','e'],
    desc: { th: 'พบเฉพาะใน wave 4 หรือ wave B — "พักสะสมพลัง" ก่อน breakout ทิศทางเดิม', en: 'Found only in wave 4 or B — "consolidation" before breakout in the prior direction.' },
  },
  {
    title: { th: 'Combination (W-X-Y)', en: 'Combination (W-X-Y)' },
    type: 'corr',
    sub: { th: 'corrective ซับซ้อน 2 patterns เชื่อมด้วย X', en: 'Two corrections joined by an X-wave' },
    pts: [[20,40],[80,120],[110,90],[180,140],[230,80],[330,160]],
    labels: ['','W','x','x','X','Y'],
    desc: { th: 'แสดงให้เห็นว่า correction ในชีวิตจริง "ไม่ใช่ 3 คลื่นเรียบง่าย" บ่อยมาก — มี 7 หรือ 11 คลื่นย่อยก็ได้', en: 'Shows real-world corrections are often NOT a simple 3-wave move — they may have 7 or 11 sub-waves.' },
  },
  {
    title: { th: 'Choppy / Whipsaw', en: 'Choppy / Whipsaw' },
    type: 'imp',
    sub: { th: 'noise สูง แต่นับ 5 คลื่นได้', en: 'High noise, but 5-wave count holds' },
    pts: [[20,170],[55,150],[70,165],[85,155],[120,135],[145,148],[180,118],[210,135],[250,75],[270,95],[300,50]],
    labels: ['','','','','','2','','','3','4','5'],
    desc: { th: 'กราฟจริงมีหนามแหลมและการหดตัวเล็กๆ มากมาย — Elliott counter ที่เก่งจะมองข้าม noise และเห็นโครงคลื่นใหญ่', en: 'Real charts have many spikes and tiny pullbacks. A skilled counter ignores noise and reads the larger structure.' },
  },
];

function svgPathFromPts(pts2) {
  return pts2.map((p,i) => (i===0?'M':'L') + p[0] + ',' + p[1]).join(' ');
}

function renderVariantGrid() {
  const grid = document.getElementById('variantGrid');
  if (!grid) return;
  grid.innerHTML = VARIANTS.map(v => {
    const w = 360, h = 200;
    const path = svgPathFromPts(v.pts);
    const color = v.type === 'imp' ? '#2563eb' : '#dc2626';
    const dotsAndLabels = v.pts.map((p,i) => `
      <circle class="var-dot" cx="${p[0]}" cy="${p[1]}" r="4" fill="${i===0?'#888':color}"/>
      ${v.labels[i] ? `<text class="var-label" x="${p[0]+6}" y="${p[1]-6}" fill="${color}">${v.labels[i]}</text>` : ''}
    `).join('');
    return `<div class="variant-card">
      <div class="variant-card__title ${v.type==='corr'?'corr':''}">${t(v.title)}</div>
      <div class="variant-card__sub">${t(v.sub)}</div>
      <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet">
        <line x1="10" y1="190" x2="${w-5}" y2="190" stroke="#e5e5e5"/>
        <path class="var-line" d="${path}" stroke="${color}"/>
        ${dotsAndLabels}
      </svg>
      <div class="variant-card__desc">${t(v.desc)}</div>
    </div>`;
  }).join('');
}
renderVariantGrid();

// ============================================================
// SECTION 8 — Flashcard quiz with score/streak
// ============================================================
const QUESTIONS = [
  { q: { th: 'ใครคือผู้ค้นพบทฤษฎี Elliott Wave และในปีใด?', en: 'Who discovered Elliott Wave Theory and in what year?' },
    a: { th: 'Ralph Nelson Elliott — ตีพิมพ์ครั้งแรกปี 1934', en: 'Ralph Nelson Elliott — first published in 1934' } },
  { q: { th: 'โครงสร้างพื้นฐาน 1 รอบ Elliott Wave มีกี่คลื่น?', en: 'How many waves are in one full Elliott cycle?' },
    a: { th: '8 คลื่น = 5 impulse (1-2-3-4-5) + 3 corrective (A-B-C)', en: '8 waves = 5 impulse (1-2-3-4-5) + 3 corrective (A-B-C)' } },
  { q: { th: 'กฎข้อที่ 1 ของ Impulse Wave คืออะไร?', en: 'What is Rule #1 of Impulse Waves?' },
    a: { th: 'คลื่น 2 ห้าม retrace เกิน 100% ของคลื่น 1 (ห้ามลงต่ำกว่าจุดเริ่มคลื่น 1)', en: 'Wave 2 must NOT retrace beyond 100% of Wave 1 (cannot break below W1\'s start).' } },
  { q: { th: 'กฎข้อที่ 2 — คลื่น 3 ต้องเป็นอย่างไร?', en: 'Rule #2 — what about Wave 3?' },
    a: { th: 'คลื่น 3 ต้องไม่เป็นคลื่นที่สั้นที่สุดในสามคลื่น (1, 3, 5) — มักยาวที่สุด', en: 'Wave 3 must NOT be the shortest among waves 1, 3, 5 — usually it is the longest.' } },
  { q: { th: 'กฎข้อที่ 3 — คลื่น 4 ต้องเป็นอย่างไร?', en: 'Rule #3 — what about Wave 4?' },
    a: { th: 'คลื่น 4 ห้าม overlap เข้าไปในเขตราคาคลื่น 1 (ยกเว้น diagonal triangle)', en: 'Wave 4 must NOT overlap Wave 1\'s price territory (except in diagonals).' } },
  { q: { th: 'จิตวิทยาของคลื่น 3 เป็นอย่างไร?', en: 'What is the crowd psychology of Wave 3?' },
    a: { th: 'Acceptance + ตื่นเต้น — ทุกคนเริ่มเชื่อ ข่าวดีออกมา volume สูงสุด คลื่นแรงและยาวที่สุด', en: 'Acceptance + excitement — everyone believes, good news flows, highest volume, strongest move.' } },
  { q: { th: 'จิตวิทยาของคลื่น 5 ต่างจากคลื่น 3 ตรงไหน?', en: 'How does Wave 5 psychology differ from Wave 3?' },
    a: { th: 'Wave 5 = Euphoria (รายย่อยแห่เข้า) แต่ momentum/volume เริ่มอ่อนแอ มี divergence', en: 'Wave 5 = Euphoria (retail piles in), but momentum/volume weakens — divergence appears.' } },
  { q: { th: 'อัตราส่วน Fibonacci ที่คลื่น 2 มัก retrace กี่เปอร์เซ็นต์?', en: 'What Fibonacci retracement does Wave 2 typically reach?' },
    a: { th: '50% – 61.8% (deep retrace) หรือ 38.2% (shallow) — บ่อยที่สุดคือ 50–61.8%', en: '50% – 61.8% (deep) or 38.2% (shallow) — typically 50–61.8%' } },
  { q: { th: 'อัตราส่วน extension ที่ทั่วไปของคลื่น 3?', en: 'Typical extension ratio of Wave 3?' },
    a: { th: '161.8% ของคลื่น 1 (ปกติ) หรือ 261.8% / 423.6% (extended)', en: '161.8% of Wave 1 (typical), or 261.8% / 423.6% (extended)' } },
  { q: { th: 'หลักการ "Alternation" คืออะไร?', en: 'What is the "Alternation" principle?' },
    a: { th: 'ถ้าคลื่น 2 เป็น sharp/deep แล้ว คลื่น 4 มักเป็น sideways/shallow และกลับกัน — สลับลักษณะ', en: 'If Wave 2 is sharp/deep, Wave 4 tends to be sideways/shallow — and vice versa. They alternate in character.' } },
  { q: { th: 'ทฤษฎี Elliott Wave มีระดับ (degrees) ทั้งหมดกี่ระดับ?', en: 'How many wave degrees does Elliott Theory define?' },
    a: { th: '9 ระดับ — Grand Supercycle, Supercycle, Cycle, Primary, Intermediate, Minor, Minute, Minuette, Subminuette', en: '9 degrees — Grand Supercycle, Supercycle, Cycle, Primary, Intermediate, Minor, Minute, Minuette, Subminuette' } },
  { q: { th: 'Truncated 5th คืออะไร?', en: 'What is a "Truncated Fifth"?' },
    a: { th: 'คลื่น 5 ที่ไม่สามารถทำ high ใหม่ผ่านยอดคลื่น 3 ได้ — เป็นสัญญาณอ่อนแอบ่งบอก downtrend ใหญ่', en: 'A Wave 5 that fails to exceed Wave 3\'s peak — a weakness signal hinting at a major downtrend.' } },
  { q: { th: 'Corrective Wave มี pattern หลักๆ อะไรบ้าง?', en: 'What are the main corrective wave patterns?' },
    a: { th: 'ZigZag (5-3-5), Flat (3-3-5), Triangle (3-3-3-3-3), Combination (W-X-Y / W-X-Y-X-Z)', en: 'ZigZag (5-3-5), Flat (3-3-5), Triangle (3-3-3-3-3), Combinations (W-X-Y / W-X-Y-X-Z)' } },
  { q: { th: 'Triangle correction พบได้ในตำแหน่งใดเท่านั้น?', en: 'In which positions can Triangle corrections appear?' },
    a: { th: 'เฉพาะคลื่น 4, คลื่น B, หรือคลื่น X (Triangle ไม่เกิดในคลื่น 2 หรือ A)', en: 'Only in Wave 4, Wave B, or Wave X. Triangles do NOT occur as Wave 2 or Wave A.' } },
  { q: { th: 'อัตราส่วน Wave C เทียบกับ Wave A?', en: 'Wave C ratio relative to Wave A?' },
    a: { th: '≈ Wave A หรือ 161.8% ของ A (ใน expanded flat)', en: '≈ Wave A, or 161.8% × A (in expanded flat)' } },
  { q: { th: 'ในข้อยกเว้น "diagonal triangle" คลื่นไหนได้รับอนุญาตให้ overlap?', en: 'In a "diagonal triangle" exception, which waves can overlap?' },
    a: { th: 'คลื่น 4 และคลื่น 1 (ทับเขตกันได้) — ปรากฏใน Leading Diagonal (W1/A) หรือ Ending Diagonal (W5/C)', en: 'Wave 4 may overlap Wave 1 — found in Leading Diagonal (W1/A) or Ending Diagonal (W5/C).' } },
  { q: { th: 'ทำไม Elliott Wave ถูกวิจารณ์ว่า subjective?', en: 'Why is Elliott Wave criticized as subjective?' },
    a: { th: 'เพราะนักวิเคราะห์อาจตีความ count ต่างกัน + มี alternative count หลายแบบ — ต้องใช้ร่วม indicator/risk mgmt', en: 'Analysts may interpret counts differently + multiple alternative counts exist — use with other tools and risk mgmt.' } },
  { q: { th: 'ถ้าราคาทะลุกฎข้อใดข้อหนึ่ง ควรทำอย่างไร?', en: 'If price violates any rule, what should you do?' },
    a: { th: '"Invalidate & Recount" — ทิ้ง count เดิมทันที นับใหม่ ห้ามดื้อกับ count เดิม', en: '"Invalidate & Recount" — immediately abandon the old count and re-label. Never stick to a broken count.' } },
  { q: { th: 'Fractal nature ของ Elliott Wave หมายความว่าอย่างไร?', en: 'What does the "fractal nature" of Elliott Wave mean?' },
    a: { th: 'คลื่นใหญ่ประกอบด้วยคลื่นเล็ก คลื่นเล็กประกอบด้วยคลื่นเล็กกว่า — pattern ซ้ำในทุก timeframe', en: 'Larger waves are composed of smaller waves, which contain even smaller waves — the pattern repeats at every timeframe.' } },
  { q: { th: 'Elliott Wave ทำงานได้ดีใน timeframe ระดับใด?', en: 'On what timeframe does Elliott Wave work best?' },
    a: { th: 'TF ใหญ่ (1H, 4H, Daily, Weekly) — TF เล็กเกิน (1m, 5m) noise สูง count ไม่น่าเชื่อถือ', en: 'Higher TFs (1H, 4H, Daily, Weekly). Very low TFs (1m, 5m) have too much noise — counts unreliable.' } },
];

// State
let order = QUESTIONS.map((_, i) => i);
let cursor = 0;
let stats = loadQuizStats();
let revealed = false;

function loadQuizStats() {
  try {
    const raw = JSON.parse(localStorage.getItem('mysandbox.elliott.quiz') || '{}');
    return { score: raw.score || 0, streak: raw.streak || 0, best: raw.best || 0 };
  } catch { return { score: 0, streak: 0, best: 0 }; }
}
function saveQuizStats() {
  localStorage.setItem('mysandbox.elliott.quiz', JSON.stringify(stats));
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function renderQuizCard() {
  const front = document.getElementById('qFront');
  const back = document.getElementById('qBack');
  const badge = document.getElementById('qBadge');
  const card = document.getElementById('flashcard');
  const remain = document.getElementById('qRemain');
  if (!front || !back) return;
  if (cursor >= order.length) {
    // Done state
    front.innerHTML = `🎉 <span data-lang-th>เก่งมาก! ทำครบทุกข้อแล้ว</span><span data-lang-en>Great work! All cards done.</span>`;
    back.innerHTML = `<span data-lang-th>กด "เริ่มใหม่" เพื่อเล่นรอบใหม่</span><span data-lang-en>Press "Restart" to play again</span>`;
    badge.textContent = '✓';
    if (remain) remain.textContent = '0';
    card?.classList.remove('flipped');
    document.getElementById('qRight').disabled = true;
    document.getElementById('qWrong').disabled = true;
    return;
  }
  const idx = order[cursor];
  const q = QUESTIONS[idx];
  front.innerHTML = `${t(q.q)}`;
  back.innerHTML = `${t(q.a)}`;
  badge.textContent = `Q${cursor + 1}/${order.length}`;
  if (remain) remain.textContent = String(order.length - cursor);
  card?.classList.remove('flipped');
  revealed = false;
  document.getElementById('qRight').disabled = true;
  document.getElementById('qWrong').disabled = true;
  renderQuizStats();
}

function renderQuizStats() {
  document.getElementById('qScore').textContent = stats.score;
  document.getElementById('qStreak').textContent = stats.streak;
  document.getElementById('qBest').textContent = stats.best;
}

function flipCard() {
  if (cursor >= order.length) return;
  const card = document.getElementById('flashcard');
  card.classList.toggle('flipped');
  revealed = card.classList.contains('flipped');
  document.getElementById('qRight').disabled = !revealed;
  document.getElementById('qWrong').disabled = !revealed;
}

document.getElementById('flashcard')?.addEventListener('click', flipCard);
document.getElementById('flashcard')?.addEventListener('keydown', e => {
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
});

document.getElementById('qRight')?.addEventListener('click', () => {
  if (!revealed) return;
  stats.score += 10 + Math.min(stats.streak, 10);
  stats.streak += 1;
  if (stats.streak > stats.best) stats.best = stats.streak;
  saveQuizStats();
  cursor++;
  renderQuizCard();
});

document.getElementById('qWrong')?.addEventListener('click', () => {
  if (!revealed) return;
  stats.streak = 0;
  saveQuizStats();
  // re-queue this question towards the back
  const missed = order[cursor];
  order.splice(cursor, 1);
  const insertAt = Math.min(cursor + 3, order.length);
  order.splice(insertAt, 0, missed);
  renderQuizCard();
});

document.getElementById('qReset')?.addEventListener('click', () => {
  stats = { score: 0, streak: 0, best: stats.best };
  saveQuizStats();
  order = QUESTIONS.map((_, i) => i);
  cursor = 0;
  document.getElementById('qRight').disabled = false;
  document.getElementById('qWrong').disabled = false;
  renderQuizCard();
});

document.getElementById('qShuffle')?.addEventListener('click', () => {
  order = QUESTIONS.map((_, i) => i);
  shuffle(order);
  cursor = 0;
  document.getElementById('qRight').disabled = false;
  document.getElementById('qWrong').disabled = false;
  renderQuizCard();
});

// Init quiz
shuffle(order);
renderQuizCard();
