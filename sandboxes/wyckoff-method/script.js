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
  updateLaw1();
  updateLaw2();
  updateLaw3(currentEvr);
  drawCycle();
  drawAccum();
  drawDist();
  drawVP();
  renderVPTabs();
  drawCarousel();
  renderRealGrid();
  renderQuizCard();
  // Re-render game labels (scenario select option)
  refreshScenarioOptions();
});

// ============================================================
// SECTION 2 — Three Laws
// ============================================================
// Law 1: Supply & Demand
const demandSlider = document.getElementById('demandSlider');
const supplySlider = document.getElementById('supplySlider');
const law1Out = document.getElementById('law1Out');
function updateLaw1() {
  if (!demandSlider) return;
  const d = +demandSlider.value, s = +supplySlider.value;
  const diff = d - s;
  let cls = 'flat', msg;
  if (diff > 8) {
    cls = 'up';
    msg = t({
      th: `🔼 Demand เด่นกว่า ${diff} หน่วย → ราคาขึ้น (markup)`,
      en: `🔼 Demand exceeds Supply by ${diff} → price rises (markup)`,
    });
  } else if (diff < -8) {
    cls = 'down';
    msg = t({
      th: `🔽 Supply เด่นกว่า ${-diff} หน่วย → ราคาลง (markdown)`,
      en: `🔽 Supply exceeds Demand by ${-diff} → price falls (markdown)`,
    });
  } else {
    cls = 'flat';
    msg = t({
      th: `↔ ใกล้สมดุล (Δ${diff}) → sideways / trading range`,
      en: `↔ Near balance (Δ${diff}) → sideways / trading range`,
    });
  }
  law1Out.className = 'law-card__readout ' + cls;
  law1Out.textContent = msg;
}
demandSlider?.addEventListener('input', updateLaw1);
supplySlider?.addEventListener('input', updateLaw1);

// Law 2: Cause & Effect (PnF count visualization)
const causeSlider = document.getElementById('causeSlider');
const causeSvg = document.getElementById('causeSvg');
const law2Out = document.getElementById('law2Out');
function updateLaw2() {
  if (!causeSvg) return;
  const cause = +causeSlider.value; // 10..100
  const effect = cause * 1.5;        // simple proportional
  // SVG: draw a "trading range" box of width = cause, then arrow up effect units
  const W = 320, H = 140;
  const baseY = 110;
  const rangeStart = 20;
  const rangeWidth = cause * 1.5;
  const trendStart = rangeStart + rangeWidth + 4;
  const trendHeight = effect * 0.9;
  const trendTop = baseY - trendHeight;
  causeSvg.innerHTML = `
    <rect x="${rangeStart}" y="${baseY-30}" width="${rangeWidth}" height="30"
          fill="#fef3c7" stroke="#d97706" stroke-width="1.2"/>
    <text x="${rangeStart + rangeWidth/2}" y="${baseY-12}" text-anchor="middle" font-size="10" font-weight="700" fill="#9a3412">
      Cause (${cause})
    </text>
    <line x1="${trendStart}" y1="${baseY}" x2="${trendStart + trendHeight*0.6}" y2="${trendTop}"
          stroke="#16a34a" stroke-width="2.5" marker-end="url(#causeArrow)"/>
    <defs><marker id="causeArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#16a34a"/>
    </marker></defs>
    <text x="${trendStart + trendHeight*0.6 + 6}" y="${trendTop + 6}" font-size="11" font-weight="700" fill="#14532d">
      Effect (${effect.toFixed(0)})
    </text>
    <line x1="0" y1="${baseY}" x2="${W}" y2="${baseY}" stroke="#e5e5e5"/>
  `;
  law2Out.textContent = t({
    th: `Cause = ${cause} → คาดว่า Effect (trend size) ≈ ${effect.toFixed(0)} (Wyckoff ใช้ PnF count, ratio ~1.5x)`,
    en: `Cause = ${cause} → expected Effect (trend size) ≈ ${effect.toFixed(0)} (Wyckoff uses PnF count, ratio ~1.5x)`,
  });
}
causeSlider?.addEventListener('input', updateLaw2);

// Law 3: Effort vs Result (3 scenarios)
const evrSvg = document.getElementById('evrSvg');
const law3Out = document.getElementById('law3Out');
let currentEvr = 'healthy';
function updateLaw3(scenario) {
  if (!evrSvg) return;
  currentEvr = scenario || 'healthy';
  // 4 candles + 4 volume bars
  const W = 320, H = 160;
  const candleY0 = 20, candleH = 80;
  const volY0 = 120, volH = 30;
  let candles, vols, msg;
  if (currentEvr === 'healthy') {
    candles = [{o:60,c:50,h:55,l:45},{o:50,c:42,h:46,l:40},{o:42,c:30,h:36,l:28},{o:30,c:18,h:24,l:16}]; // strong up
    vols = [40, 50, 70, 85];
    msg = t({
      th: '✅ Healthy markup — แท่งเทียนแรงขึ้น volume ก็ขึ้นตาม → effort และ result สอดคล้อง trend ยังแข็งแรง',
      en: '✅ Healthy markup — candles get stronger and volume increases → effort matches result, trend is healthy',
    });
  } else if (currentEvr === 'climax') {
    candles = [{o:60,c:50,h:55,l:45},{o:50,c:30,h:50,l:25},{o:30,c:10,h:15,l:5},{o:10,c:25,h:30,l:5}]; // climax + reversal
    vols = [50, 75, 95, 60];
    msg = t({
      th: '⚠️ Climax — แท่งใหญ่มาก + volume สูงสุดผิดปกติ แต่ราคากลับตัว = "การส่งของ" ของ Composite Man (ระวังกลับเทรนด์)',
      en: '⚠️ Climax — huge candle + abnormally high volume but price reverses = Composite Man "delivery" (watch for reversal)',
    });
  } else { // nodemand
    candles = [{o:60,c:50,h:54,l:48},{o:50,c:48,h:52,l:46},{o:48,c:46,h:50,l:44},{o:46,c:48,h:52,l:43}]; // tiny up moves
    vols = [50, 30, 20, 15];
    msg = t({
      th: '⚠️ No Demand — ราคาขึ้นนิดหน่อย แต่ volume ลดลง = Composite Man ไม่ได้ดันต่อ → trend อ่อนแรง',
      en: '⚠️ No Demand — price ticks up but volume fades = Composite Man not pushing → weakening trend',
    });
  }
  // Render
  let parts = `<line x1="0" y1="${candleY0+candleH}" x2="${W}" y2="${candleY0+candleH}" stroke="#e5e5e5"/>`;
  parts += `<line x1="0" y1="${volY0+volH}" x2="${W}" y2="${volY0+volH}" stroke="#e5e5e5"/>`;
  candles.forEach((c, i) => {
    const x = 30 + i * 70;
    const top = Math.min(c.o, c.c);
    const bot = Math.max(c.o, c.c);
    const isUp = c.c < c.o;
    const color = isUp ? '#16a34a' : '#dc2626';
    parts += `<line x1="${x+10}" y1="${candleY0+c.h*0.8}" x2="${x+10}" y2="${candleY0+c.l*0.8}" stroke="${color}" stroke-width="1.5"/>`;
    parts += `<rect x="${x}" y="${candleY0+top*0.8}" width="20" height="${(bot-top)*0.8 + 2}" fill="${color}"/>`;
    // volume bar
    const vh = vols[i] * 0.3;
    const vColor = currentEvr === 'climax' && i === 2 ? '#dc2626' : (vols[i] > 60 ? '#2563eb' : '#94a3b8');
    parts += `<rect x="${x}" y="${volY0+volH-vh}" width="20" height="${vh}" fill="${vColor}"/>`;
  });
  parts += `<text x="6" y="${candleY0+8}" font-size="9" fill="#888">Price</text>`;
  parts += `<text x="6" y="${volY0+10}" font-size="9" fill="#888">Vol</text>`;
  evrSvg.innerHTML = parts;
  law3Out.textContent = msg;
  document.querySelectorAll('#law3 .btn-secondary.mini').forEach(b => {
    b.classList.toggle('active', b.dataset.evr === currentEvr);
  });
}
document.querySelectorAll('#law3 .btn-secondary.mini').forEach(btn => {
  btn.addEventListener('click', () => updateLaw3(btn.dataset.evr));
});
updateLaw1();
updateLaw2();
updateLaw3('healthy');

// ============================================================
// SECTION 3 — 4-phase Cycle
// ============================================================
const CYCLE_PHASES = [
  { key: 'accum', label: { th: 'Accumulation (สะสม)', en: 'Accumulation' }, color: '#16a34a',
    desc: { th: 'Composite Man ทยอยซื้อในช่วงที่รายย่อยหมดความเชื่อมั่น sideways นาน volume ค่อยๆ ลด',
            en: 'Composite Man buys while retail loses faith. Long sideways, volume gradually decreases.' } },
  { key: 'markup', label: { th: 'Markup (ดันขึ้น)', en: 'Markup' }, color: '#2563eb',
    desc: { th: 'หลังสะสมเสร็จ Composite Man ดันราคาขึ้น breakout จาก range volume เพิ่ม สื่อข่าวดีตามมา',
            en: 'After accumulation, Composite Man pushes price up. Breakout from range, rising volume, good news follows.' } },
  { key: 'dist', label: { th: 'Distribution (แจกจ่าย)', en: 'Distribution' }, color: '#d97706',
    desc: { th: 'Composite Man ทยอย "แจก" หุ้นให้รายย่อยที่กระตือรือร้น sideways ใกล้ยอด volume สูง',
            en: 'Composite Man unloads shares onto enthusiastic retail. Sideways near top, high volume.' } },
  { key: 'markdown', label: { th: 'Markdown (ทุบลง)', en: 'Markdown' }, color: '#dc2626',
    desc: { th: 'ราคาทรุดลงรวดเร็ว สื่อข่าวร้ายตามมา รายย่อยติดดอย Composite Man ปิดสถานะ short ทำกำไร',
            en: 'Price drops fast, bad news follows. Retail trapped. Composite Man closes shorts at a profit.' } },
];
function drawCycle() {
  const svg = document.getElementById('cycleSvg');
  if (!svg) return;
  const W = 800, H = 280;
  // Sine-ish wave: x=0..800, accum (rising slowly + sideways), markup, dist, markdown
  // We'll use 4 segment linear pseudo-curve
  const pts = [];
  // accum: sideways at low
  for (let x = 0; x <= 200; x++) {
    const noise = Math.sin(x * 0.18) * 8;
    pts.push([x, 220 - x * 0.05 + noise]);
  }
  // markup: rise
  for (let x = 200; x <= 400; x++) {
    pts.push([x, 215 - (x - 200) * 0.85]);
  }
  // dist: sideways at high
  for (let x = 400; x <= 600; x++) {
    const noise = Math.sin((x - 400) * 0.18) * 8;
    pts.push([x, 45 + noise + (x - 400) * 0.02]);
  }
  // markdown: fall
  for (let x = 600; x <= 800; x++) {
    pts.push([x, 50 + (x - 600) * 0.85]);
  }
  const pathStr = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');

  // Phase bands
  const bands = [
    { x: 0, w: 200, color: '#dcfce7', key: 'accum' },
    { x: 200, w: 200, color: '#dbeafe', key: 'markup' },
    { x: 400, w: 200, color: '#fef3c7', key: 'dist' },
    { x: 600, w: 200, color: '#fee2e2', key: 'markdown' },
  ];
  let parts = bands.map(b => `<rect x="${b.x}" y="20" width="${b.w}" height="240" fill="${b.color}" opacity="0.8"/>`).join('');
  parts += bands.map((b, i) => {
    const c = CYCLE_PHASES[i];
    return `<text x="${b.x + b.w/2}" y="40" text-anchor="middle" font-size="13" font-weight="700" fill="${c.color}">${t(c.label)}</text>`;
  }).join('');
  parts += `<path d="${pathStr}" fill="none" stroke="#1e293b" stroke-width="2.5"/>`;
  // Annotations
  parts += `<text x="100" y="265" text-anchor="middle" font-size="10" fill="#16a34a">PS · SC · AR · ST · Spring · LPS</text>`;
  parts += `<text x="500" y="265" text-anchor="middle" font-size="10" fill="#d97706">PSY · BC · AR · ST · UTAD · LPSY</text>`;
  svg.innerHTML = parts;

  // legend
  const legend = document.getElementById('cycleLegend');
  legend.innerHTML = CYCLE_PHASES.map(p => `
    <div class="cycle-leg-item" style="border-left-color:${p.color};">
      <h4 style="color:${p.color};">${t(p.label)}</h4>
      <p>${t(p.desc)}</p>
    </div>
  `).join('');
}
drawCycle();

// ============================================================
// SECTION 4/5 — Schematic events data
// ============================================================
const ACCUM_EVENTS = [
  { code: 'PS',  name: { th: 'Preliminary Support', en: 'Preliminary Support' }, phase: 'A',
    pos: { x: 110, y: 250 },
    meaning: { th: 'แรงซื้อแรกที่หยุดการลง — Composite Man เริ่มเก็บของ', en: 'First buying that halts the decline — Composite Man begins to absorb supply' },
    detail: { th: 'volume เพิ่มขึ้น แท่งเทียนเริ่มไม่ลงต่อ แต่อาจยังลงต่ออีกได้', en: 'Volume increases, candles stop dropping — but more decline can still follow' } },
  { code: 'SC',  name: { th: 'Selling Climax', en: 'Selling Climax' }, phase: 'A',
    pos: { x: 175, y: 305 },
    meaning: { th: 'จุดยอมแพ้ของรายย่อย — volume สูงสุด, แท่งยาวมาก', en: 'Capitulation by retail — peak volume, long red candles' },
    detail: { th: 'Composite Man ดูดของในจังหวะที่ทุกคนเทขาย — มักเป็นจุดต่ำของ trading range', en: 'Composite Man absorbs supply during panic — typically marks the trading range low' } },
  { code: 'AR',  name: { th: 'Automatic Rally', en: 'Automatic Rally' }, phase: 'A',
    pos: { x: 245, y: 130 },
    meaning: { th: 'แรงดีดอัตโนมัติ — short covering + แรงซื้อใหม่', en: 'Automatic bounce — short covering + fresh demand' },
    detail: { th: 'ขึ้นอย่างรวดเร็วเพราะไม่มีของขายเพียงพอ — มักเป็น top ของ range', en: 'Sharp rise as supply is exhausted — typically marks the range top' } },
  { code: 'ST',  name: { th: 'Secondary Test', en: 'Secondary Test' }, phase: 'A',
    pos: { x: 315, y: 290 },
    meaning: { th: 'การทดสอบ supply ครั้งที่ 2 — ถ้า volume ต่ำกว่า SC = supply หมดแล้ว', en: '2nd test of supply — if volume < SC, supply is exhausted' },
    detail: { th: 'ราคาลงใกล้ๆ SC แต่ไม่ทะลุ และ volume ต่ำกว่า — สัญญาณว่า Composite Man ดูดได้พอแล้ว', en: 'Price approaches SC but volume is lower — suggests Composite Man has accumulated enough' } },
  { code: 'B-test1', name: { th: 'Test ใน Phase B', en: 'Test (Phase B)' }, phase: 'B',
    pos: { x: 400, y: 250 },
    meaning: { th: 'การ "ขย่ม" ใน Phase B — ทดสอบว่ามี supply เหลือไหม', en: 'A shake within Phase B — testing for remaining supply' },
    detail: { th: 'volume เริ่มลด แสดงว่าผู้ขายเริ่มหมดสายและ Composite Man กำลังเก็บของในเงียบ', en: 'Volume fading shows sellers exhausted; Composite Man absorbs quietly' } },
  { code: 'B-test2', name: { th: 'Test ใน Phase B', en: 'Test (Phase B)' }, phase: 'B',
    pos: { x: 470, y: 160 },
    meaning: { th: 'rally ภายในกรอบ — ขึ้นไม่ทะลุยอด AR', en: 'Rally within the range — fails to exceed AR' },
    detail: { th: 'volume ที่ขึ้นต่ำลงเรื่อยๆ = "no demand" ในระดับ range สถานการณ์ใกล้พร้อม Spring', en: 'Decreasing volume on rallies = "no demand" within the range — Spring approaches' } },
  { code: 'SP',  name: { th: 'Spring (กับดักหมี)', en: 'Spring (Bear Trap)' }, phase: 'C',
    pos: { x: 565, y: 325 },
    meaning: { th: '⭐ False breakdown ใต้ support — ทดสอบครั้งสุดท้าย ก่อนดันขึ้น', en: '⭐ False breakdown below support — final shake before markup' },
    detail: { th: 'volume สูงขึ้นชั่วครู่ แท่งเทียนกลับขึ้นเร็ว ไม่ปิดต่ำกว่า support — Composite Man ดูดของรอบสุดท้าย', en: 'Brief volume spike, quick recovery, no close below support — Composite Man final absorption' } },
  { code: 'TST', name: { th: 'Test of Spring', en: 'Test of Spring' }, phase: 'C',
    pos: { x: 620, y: 280 },
    meaning: { th: 'การทดสอบ Spring — ราคา dip ลงอีกแต่ volume ต่ำมาก', en: 'Test of the Spring — another dip but on very low volume' },
    detail: { th: 'ยืนยันว่า supply หมดแล้ว — จุดเข้าที่ต่ำที่สุดและปลอดภัยที่สุด', en: 'Confirms supply is dry — the lowest and safest entry point' } },
  { code: 'SOS', name: { th: 'Sign of Strength', en: 'Sign of Strength' }, phase: 'D',
    pos: { x: 700, y: 95 },
    meaning: { th: 'แท่งเทียนยาวแข็งแรง + volume สูง — ทะลุ "creek" (resistance)', en: 'Strong wide candle + high volume — jumps the "creek" (resistance)' },
    detail: { th: 'สัญญาณชัดเจนว่า markup เริ่มแล้ว — ราคาทำ higher high แรงและเร็ว', en: 'Clear signal markup has started — strong, decisive higher high' } },
  { code: 'LPS', name: { th: 'Last Point of Support', en: 'Last Point of Support' }, phase: 'D',
    pos: { x: 765, y: 165 },
    meaning: { th: '⭐ Pullback ครั้งสุดท้ายไปทดสอบ creek (อดีต resistance = support ใหม่)', en: '⭐ Final pullback to test the creek (former resistance = new support)' },
    detail: { th: 'volume ต่ำ ราคาไม่ลงต่อ — จุดเข้าหลักของ Wyckoff trader', en: 'Low volume, no breakdown — the main Wyckoff entry point' } },
  { code: 'BU',  name: { th: 'Back-up to Edge of Creek', en: 'Back-up to Edge of Creek' }, phase: 'D',
    pos: { x: 825, y: 100 },
    meaning: { th: 'continuation move — confirm trend ใหม่', en: 'Continuation move — confirms the new trend' },
    detail: { th: 'หลัง LPS ราคา rally ต่อ — โครงสร้าง higher highs / higher lows ชัดแล้ว เข้าสู่ Phase E (markup)', en: 'After LPS, rally resumes. Higher highs/lows established. Phase E (markup) begins.' } },
];

const DIST_EVENTS = [
  { code: 'PSY', name: { th: 'Preliminary Supply', en: 'Preliminary Supply' }, phase: 'A',
    pos: { x: 110, y: 100 },
    meaning: { th: 'แรงขายแรกที่หยุดการขึ้น — Composite Man เริ่ม "ปล่อย" ของ', en: 'First selling that halts the rise — Composite Man starts to distribute' },
    detail: { th: 'volume เพิ่ม แท่งเทียนเริ่มไม่ขึ้นต่อ แต่ trend ยังแข็งแรง อาจขึ้นต่อได้', en: 'Volume rises, candles stall — trend may still continue briefly' } },
  { code: 'BC',  name: { th: 'Buying Climax', en: 'Buying Climax' }, phase: 'A',
    pos: { x: 175, y: 55 },
    meaning: { th: 'จุดสูงสุดของความตื่นเต้น — volume สูงสุด ราคาทำ high ใหม่', en: 'Peak euphoria — peak volume, fresh high' },
    detail: { th: 'Composite Man ใช้จังหวะที่ทุกคนแห่ซื้อในการแจกจ่ายของ — มักเป็นจุดสูงของ range', en: 'Composite Man unloads while retail piles in — typically the range high' } },
  { code: 'AR',  name: { th: 'Automatic Reaction', en: 'Automatic Reaction' }, phase: 'A',
    pos: { x: 245, y: 220 },
    meaning: { th: 'การตกลงอัตโนมัติ — ขาดแรงซื้อต่อเนื่อง', en: 'Automatic drop — buying exhausted' },
    detail: { th: 'ราคาตกแรงเพราะไม่มี demand เพียงพอ — กำหนด range bottom', en: 'Sharp drop as demand evaporates — establishes range bottom' } },
  { code: 'ST',  name: { th: 'Secondary Test', en: 'Secondary Test' }, phase: 'A',
    pos: { x: 315, y: 75 },
    meaning: { th: 'ขึ้นไปทดสอบ BC — ถ้า volume ต่ำกว่า BC = demand หมดแล้ว', en: '2nd rally to test BC — if volume < BC, demand is exhausted' },
    detail: { th: 'ราคาขึ้นใกล้ BC แต่ volume เบา — สัญญาณว่า Composite Man แจกของได้พอแล้ว', en: 'Price approaches BC on light volume — Composite Man has distributed enough' } },
  { code: 'B-test1', name: { th: 'Test ใน Phase B', en: 'Test (Phase B)' }, phase: 'B',
    pos: { x: 400, y: 130 },
    meaning: { th: 'ขย่มภายใน range — ทดสอบ demand', en: 'Shake within range — testing for remaining demand' },
    detail: { th: 'oscillation ใน range — แต่ volume เริ่มลด demand เริ่มหมด', en: 'Range oscillation, volume fading, demand drying up' } },
  { code: 'B-test2', name: { th: 'Test ใน Phase B', en: 'Test (Phase B)' }, phase: 'B',
    pos: { x: 470, y: 200 },
    meaning: { th: 'ลงไปทดสอบ AR — ใกล้ Phase C', en: 'Drop testing AR — Phase C nears' },
    detail: { th: 'pattern เริ่มเปลี่ยน — sellers เด่นกว่า buyers ทุกครั้งที่ rally', en: 'Pattern shifts — sellers dominate on every rally' } },
  { code: 'UTAD', name: { th: 'Upthrust After Distribution', en: 'Upthrust After Distribution' }, phase: 'C',
    pos: { x: 565, y: 35 },
    meaning: { th: '⭐ False breakout เหนือยอด BC — กับดักกระทิงครั้งสุดท้าย', en: '⭐ False breakout above BC — final bull trap' },
    detail: { th: 'volume สูงชั่วครู่ ราคากลับลง ไม่ปิดเหนือ BC — Composite Man แจกรอบสุดท้าย', en: 'Brief volume spike, fails to hold above BC — Composite Man final distribution' } },
  { code: 'TST', name: { th: 'Test of UTAD', en: 'Test of UTAD' }, phase: 'C',
    pos: { x: 620, y: 80 },
    meaning: { th: 'การ rally ทดสอบ UTAD แต่ volume ต่ำมาก', en: 'Rally testing UTAD on very low volume' },
    detail: { th: 'ยืนยันว่า demand หมด — markdown กำลังจะเริ่ม', en: 'Confirms demand is dry — markdown is imminent' } },
  { code: 'SOW', name: { th: 'Sign of Weakness', en: 'Sign of Weakness' }, phase: 'D',
    pos: { x: 700, y: 280 },
    meaning: { th: 'แท่งเทียนแดงยาว + volume สูง — ทะลุ "ice" (support)', en: 'Wide red candle + high volume — breaks the "ice" (support)' },
    detail: { th: 'สัญญาณชัดเจนว่า markdown เริ่มแล้ว — โครงสร้าง lower lows / lower highs ตามมา', en: 'Clear signal markdown has started — lower highs/lows follow' } },
  { code: 'LPSY', name: { th: 'Last Point of Supply', en: 'Last Point of Supply' }, phase: 'D',
    pos: { x: 765, y: 200 },
    meaning: { th: '⭐ Rally อ่อนๆ ครั้งสุดท้ายขึ้นไปทดสอบ ice (อดีต support = resistance ใหม่)', en: '⭐ Final weak rally to retest ice (former support = new resistance)' },
    detail: { th: 'volume ต่ำ ไม่ทำ high ใหม่ — จุดเข้า short ที่ดีที่สุดของ Wyckoff trader', en: 'Low volume, no new high — the best Wyckoff short entry' } },
  { code: 'BD',  name: { th: 'Breakdown', en: 'Breakdown' }, phase: 'D',
    pos: { x: 825, y: 320 },
    meaning: { th: 'continuation drop — confirm downtrend ใหม่', en: 'Continuation drop — confirms new downtrend' },
    detail: { th: 'หลัง LPSY ราคาทรุดต่อ — เข้าสู่ Phase E (markdown)', en: 'After LPSY, price collapses. Phase E (markdown) begins.' } },
];

// ============================================================
// SECTION 4 — Accumulation Schematic
// ============================================================
function drawAccum() { drawSchematic(document.getElementById('accumSvg'), ACCUM_EVENTS, 'accum', document.getElementById('accumReadout')); }
function drawDist()  { drawSchematic(document.getElementById('distSvg'),  DIST_EVENTS,  'dist',  document.getElementById('distReadout'));  }

// Helper: build price polyline from event positions, smoothing through control points
function buildPricePath(events, type) {
  // We add some intermediate "non-event" points to make the curve look natural.
  // For accumulation: pre-PS downtrend, post-SC bounce, B-phase oscillation, post-Spring snap, post-SOS pullback path
  const pts = [];
  if (type === 'accum') {
    pts.push([20, 90]);     // pre context: high at left
    pts.push([60, 200]);    // descending
    pts.push([events[0].pos.x, events[0].pos.y]);  // PS
    pts.push([140, 285]);   // continued down
    pts.push([events[1].pos.x, events[1].pos.y]);  // SC
    pts.push([events[2].pos.x, events[2].pos.y]);  // AR
    pts.push([280, 230]);
    pts.push([events[3].pos.x, events[3].pos.y]);  // ST
    // Phase B
    pts.push([350, 200]);
    pts.push([events[4].pos.x, events[4].pos.y]);  // B-test1
    pts.push([435, 180]);
    pts.push([events[5].pos.x, events[5].pos.y]);  // B-test2
    pts.push([510, 230]);
    pts.push([540, 280]);
    pts.push([events[6].pos.x, events[6].pos.y]);  // Spring (lowest)
    pts.push([590, 250]);
    pts.push([events[7].pos.x, events[7].pos.y]);  // Test of Spring
    pts.push([660, 220]);
    pts.push([events[8].pos.x, events[8].pos.y]);  // SOS
    pts.push([735, 130]);
    pts.push([events[9].pos.x, events[9].pos.y]);  // LPS
    pts.push([795, 130]);
    pts.push([events[10].pos.x, events[10].pos.y]); // BU
    pts.push([870, 70]);
  } else {
    // Distribution mirror
    pts.push([20, 290]);
    pts.push([60, 180]);
    pts.push([events[0].pos.x, events[0].pos.y]); // PSY
    pts.push([140, 95]);
    pts.push([events[1].pos.x, events[1].pos.y]); // BC
    pts.push([events[2].pos.x, events[2].pos.y]); // AR
    pts.push([280, 150]);
    pts.push([events[3].pos.x, events[3].pos.y]); // ST
    pts.push([350, 180]);
    pts.push([events[4].pos.x, events[4].pos.y]); // B-test1
    pts.push([435, 200]);
    pts.push([events[5].pos.x, events[5].pos.y]); // B-test2
    pts.push([510, 150]);
    pts.push([540, 90]);
    pts.push([events[6].pos.x, events[6].pos.y]); // UTAD (highest)
    pts.push([590, 130]);
    pts.push([events[7].pos.x, events[7].pos.y]); // Test of UTAD
    pts.push([660, 200]);
    pts.push([events[8].pos.x, events[8].pos.y]); // SOW
    pts.push([735, 250]);
    pts.push([events[9].pos.x, events[9].pos.y]); // LPSY
    pts.push([795, 270]);
    pts.push([events[10].pos.x, events[10].pos.y]); // Breakdown
    pts.push([870, 360]);
  }
  return pts;
}

function drawSchematic(svg, events, type, readout) {
  if (!svg) return;
  const pricePts = buildPricePath(events, type);
  const pathStr = pricePts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  // Trading range: top = AR.y, bottom = SC.y (or BC.y / AR.y for dist)
  let rangeTop, rangeBot, lineStyle;
  if (type === 'accum') {
    rangeTop = events[2].pos.y; // AR
    rangeBot = events[1].pos.y; // SC
    lineStyle = 'creek-line';
  } else {
    rangeTop = events[1].pos.y; // BC
    rangeBot = events[2].pos.y; // AR
    lineStyle = 'ice-line';
  }
  const rangeStartX = events[0].pos.x - 10;
  const rangeEndX = events[7].pos.x + 30;

  // Phase bands — divide trading range into 5 phases by event positions
  const phaseBoundaries = type === 'accum'
    ? [events[3].pos.x + 10, events[5].pos.x + 30, events[7].pos.x + 20, events[9].pos.x + 20]
    : [events[3].pos.x + 10, events[5].pos.x + 30, events[7].pos.x + 20, events[9].pos.x + 20];
  const phaseLabels = ['A', 'B', 'C', 'D', 'E'];
  const phaseStarts = [rangeStartX, ...phaseBoundaries];
  const phaseEnds = [...phaseBoundaries, 880];

  let parts = '';
  // Phase bands
  phaseLabels.forEach((p, i) => {
    parts += `<rect class="phase-band ${p.toLowerCase()}" x="${phaseStarts[i]}" y="20" width="${phaseEnds[i] - phaseStarts[i]}" height="350"/>`;
    parts += `<text class="phase-text" x="${(phaseStarts[i] + phaseEnds[i]) / 2}" y="40">Phase ${p}</text>`;
  });
  // Trading range box
  parts += `<rect class="range-band" x="${rangeStartX}" y="${rangeTop}" width="${rangeEndX - rangeStartX}" height="${rangeBot - rangeTop}"/>`;
  // Creek/Ice line
  parts += `<line class="${lineStyle}" x1="${rangeStartX}" y1="${rangeTop}" x2="880" y2="${rangeTop}"/>`;
  parts += `<line class="${lineStyle}" x1="${rangeStartX}" y1="${rangeBot}" x2="${events[7].pos.x + 60}" y2="${rangeBot}"/>`;
  // Range labels
  parts += `<text x="${rangeStartX - 4}" y="${rangeTop + 4}" font-size="10" text-anchor="end" fill="${type === 'accum' ? '#16a34a' : '#dc2626'}" font-weight="600">${type === 'accum' ? 'creek' : 'ice'} (resistance)</text>`;
  parts += `<text x="${rangeStartX - 4}" y="${rangeBot + 4}" font-size="10" text-anchor="end" fill="#888">${type === 'accum' ? 'support' : 'support'}</text>`;
  // Price path
  parts += `<path d="${pathStr}" fill="none" stroke="#1e293b" stroke-width="2"/>`;
  // Event dots + labels
  events.forEach(ev => {
    const cls = type === 'dist' ? 'ev-dot dist' : 'ev-dot';
    parts += `<circle class="${cls}" cx="${ev.pos.x}" cy="${ev.pos.y}" r="6" data-code="${ev.code}"/>`;
    // Label position: above for low events, below for high events
    const labelY = ev.pos.y < 200 ? ev.pos.y - 12 : ev.pos.y + 18;
    parts += `<text class="ev-label" x="${ev.pos.x}" y="${labelY}" text-anchor="middle">${ev.code.replace('B-test1','').replace('B-test2','')}</text>`;
  });
  // Volume panel
  const volBars = buildVolumeBars(events, type);
  parts += `<line class="vol-axis" x1="20" y1="395" x2="880" y2="395"/>`;
  parts += `<line class="vol-axis" x1="20" y1="465" x2="880" y2="465"/>`;
  parts += `<text class="vol-label" x="22" y="408">Volume</text>`;
  volBars.forEach(b => {
    parts += `<rect class="vol-bar ${b.cls}" x="${b.x}" y="${465 - b.h}" width="6" height="${b.h}"/>`;
  });

  svg.innerHTML = parts;

  // Hover handlers
  svg.querySelectorAll('.ev-dot').forEach(dot => {
    const code = dot.getAttribute('data-code');
    const ev = events.find(e => e.code === code);
    const activate = () => {
      svg.querySelectorAll('.ev-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      renderEventReadout(readout, ev, type);
    };
    dot.addEventListener('mouseenter', activate);
    dot.addEventListener('click', activate);
    dot.addEventListener('touchstart', e => { e.preventDefault(); activate(); }, { passive: false });
  });
}

function buildVolumeBars(events, type) {
  // Generate ~80 bars across width 20..880, peaking at climax events
  const bars = [];
  const climaxX = type === 'accum' ? events[1].pos.x : events[1].pos.x; // SC or BC
  const springX = type === 'accum' ? events[6].pos.x : events[6].pos.x; // Spring or UTAD
  const sosX = type === 'accum' ? events[8].pos.x : events[8].pos.x;    // SOS or SOW
  for (let x = 20; x < 880; x += 11) {
    let h = 8 + Math.random() * 8;
    // Pre-climax declining
    if (x < climaxX - 30) h += 6 - (climaxX - x) * 0.05;
    // Climax peak
    if (Math.abs(x - climaxX) < 12) h = 55 + Math.random() * 6;
    if (Math.abs(x - climaxX) < 30) h = Math.max(h, 28);
    // AR moderate
    if (Math.abs(x - events[2].pos.x) < 18) h = 22 + Math.random() * 8;
    // Phase B fading
    if (x > events[3].pos.x && x < events[6].pos.x - 25) h *= 0.55;
    // Spring/UTAD spike
    if (Math.abs(x - springX) < 12) h = 45 + Math.random() * 6;
    // Test of spring/UTAD: low volume
    if (Math.abs(x - events[7].pos.x) < 12) h *= 0.4;
    // SOS/SOW high
    if (Math.abs(x - sosX) < 18) h = 38 + Math.random() * 8;
    // LPS/LPSY low
    if (Math.abs(x - events[9].pos.x) < 14) h *= 0.5;
    // BU/BD high
    if (Math.abs(x - events[10].pos.x) < 16) h = 30 + Math.random() * 6;
    let cls = 'low';
    if (h > 35) cls = type === 'dist' ? 'distHi' : 'high';
    else if (h > 20) cls = '';
    bars.push({ x, h: Math.max(2, h), cls });
  }
  return bars;
}

function renderEventReadout(readout, ev, type) {
  if (!readout || !ev) return;
  readout.innerHTML = `
    <h4><span class="ev-code">${ev.code}</span> ${t(ev.name)} <span class="ev-phase">— Phase ${ev.phase}</span></h4>
    <div class="ev-meaning">${t(ev.meaning)}</div>
    <div class="ev-detail">${t(ev.detail)}</div>
  `;
}

drawAccum();
drawDist();

// ============================================================
// SECTION 6 — Volume × Price scenarios
// ============================================================
const VP_SCENARIOS = [
  { key: 'sc',     label: { th: 'Selling Climax (SC)', en: 'Selling Climax (SC)' }, mood: 'bull',
    candles: [{type:'red',o:80,c:65},{type:'red',o:65,c:50},{type:'red',o:50,c:25,wide:true},{type:'green',o:25,c:45},{type:'green',o:45,c:55}],
    vols:    [40, 55, 95, 60, 50],
    title: { th: 'Selling Climax — จุดยอมแพ้', en: 'Selling Climax — Capitulation' },
    desc: { th: 'แท่งแดงใหญ่ + volume สูงสุดผิดปกติ จากนั้นเริ่มกลับขึ้น = Composite Man เริ่มดูดของ', en: 'Huge red candle + abnormally high volume, then recovery starts = Composite Man absorbs supply' },
    cues: { th: ['volume สูงสุดในรอบหลายวัน', 'แท่งยาวมาก แต่ปิดสูงกว่าจุดต่ำสุด', 'ตามด้วย AR แรง = ยืนยัน climax'],
            en: ['Highest volume in many days', 'Very wide bar, but closes off the low', 'Followed by strong AR = climax confirmed'] } },
  { key: 'spring', label: { th: 'Spring (กับดักหมี)', en: 'Spring (Bear Trap)' }, mood: 'bull',
    candles: [{type:'red',o:50,c:45},{type:'red',o:45,c:35},{type:'red',o:35,c:20,wide:true},{type:'green',o:20,c:42,wide:true},{type:'green',o:42,c:48}],
    vols:    [25, 30, 80, 70, 25],
    title: { th: 'Spring — false breakdown', en: 'Spring — False Breakdown' },
    desc: { th: 'ทะลุ support ชั่วครู่ + volume เพิ่ม แล้วกลับขึ้นเร็วปิดเหนือ support = bear trap', en: 'Briefly pierces support + volume rises, then snaps back above support = bear trap' },
    cues: { th: ['ทะลุ support ใต้ trading range เพียงสั้นๆ', 'volume เพิ่มเฉพาะแท่งที่ทะลุ', 'ปิดเหนือ support ทันทีในแท่งเดียวกันหรือถัดไป', 'หลัง spring ตามด้วย Test ที่ volume ต่ำมาก'],
            en: ['Pierces below support briefly', 'Volume spikes only on the breach bar', 'Closes back above support same/next bar', 'Followed by a low-volume Test'] } },
  { key: 'sos',    label: { th: 'Sign of Strength (SOS)', en: 'Sign of Strength (SOS)' }, mood: 'bull',
    candles: [{type:'green',o:40,c:48},{type:'green',o:48,c:55},{type:'green',o:55,c:78,wide:true},{type:'green',o:78,c:82},{type:'green',o:82,c:85}],
    vols:    [25, 35, 90, 50, 40],
    title: { th: 'SOS — ทะลุ creek', en: 'SOS — Crossing the Creek' },
    desc: { th: 'แท่งเขียวยาวแข็งแรง + volume สูง ทะลุ resistance ของ trading range = markup เริ่มแล้ว', en: 'Wide strong green candle + high volume breaking range resistance = markup begins' },
    cues: { th: ['แท่งเขียวกว้างกว่าค่าเฉลี่ย', 'volume สูงสุดของช่วง', 'ปิดเหนือ creek (resistance) ชัดเจน', 'การ pullback ตามมาคือ LPS'],
            en: ['Candle wider than average', 'Highest volume in the range', 'Closes clearly above the creek (resistance)', 'The following pullback = LPS'] } },
  { key: 'utad',   label: { th: 'UTAD — กับดักกระทิง', en: 'UTAD — Bull Trap' }, mood: 'bear',
    candles: [{type:'green',o:50,c:60},{type:'green',o:60,c:70},{type:'green',o:70,c:90,wide:true},{type:'red',o:90,c:55,wide:true},{type:'red',o:55,c:48}],
    vols:    [30, 40, 85, 90, 50],
    title: { th: 'UTAD — false breakout เหนือ BC', en: 'UTAD — False Breakout above BC' },
    desc: { th: 'ทะลุยอด range ชั่วครู่ + volume สูง แล้วกลับลงทันที = bull trap จุดเริ่ม markdown', en: 'Briefly breaks range high + high volume, then reverses sharply = bull trap, markdown begins' },
    cues: { th: ['ทะลุยอด BC เพียงสั้นๆ', 'volume สูงตอนที่ผู้ซื้อตามเข้า', 'แท่งกลับเป็นแดงยาวในวันถัดไป', 'ตามด้วย Test of UTAD ที่ volume ต่ำ'],
            en: ['Pierces above BC briefly', 'High volume as buyers chase', 'Reverses with a long red bar next session', 'Followed by low-volume Test of UTAD'] } },
  { key: 'noDem',  label: { th: 'No Demand (ไม่มี demand)', en: 'No Demand' }, mood: 'warn',
    candles: [{type:'green',o:50,c:60,wide:true},{type:'green',o:60,c:62},{type:'green',o:62,c:64},{type:'green',o:64,c:65},{type:'red',o:65,c:60}],
    vols:    [70, 18, 12, 10, 25],
    title: { th: 'No Demand — Composite Man ไม่ดันต่อ', en: 'No Demand — Composite Man Not Pushing' },
    desc: { th: 'ราคาขยับขึ้นเล็กน้อยแต่ volume ลดลงเรื่อยๆ = ไม่มี demand จริง trend เริ่มอ่อนแอ', en: 'Price ticks up but volume keeps fading = no real demand, trend weakening' },
    cues: { th: ['แท่งเขียวเล็กลงเรื่อยๆ', 'volume ลดลงทุกแท่งที่ขึ้น', 'มักเกิดใน Phase B ของ distribution', 'เป็นสัญญาณ pre-UTAD'],
            en: ['Green bars get smaller', 'Volume fades on every up bar', 'Common in Phase B of distribution', 'A pre-UTAD signal'] } },
  { key: 'noSup',  label: { th: 'No Supply — supply หมด', en: 'No Supply' }, mood: 'bull',
    candles: [{type:'red',o:60,c:50,wide:true},{type:'red',o:50,c:48},{type:'red',o:48,c:46},{type:'red',o:46,c:45},{type:'green',o:45,c:50}],
    vols:    [70, 18, 12, 10, 35],
    title: { th: 'No Supply — supply หมดแล้ว', en: 'No Supply — Supply Exhausted' },
    desc: { th: 'ราคาขยับลงเล็กน้อยแต่ volume ลดลง = ไม่มี supply เหลือ Composite Man เก็บได้พอแล้ว', en: 'Price ticks down but volume fades = no real supply left, Composite Man has accumulated enough' },
    cues: { th: ['แท่งแดงเล็กลงเรื่อยๆ', 'volume ลดลงทุกแท่งที่ลง', 'มักเกิดใน Phase B ของ accumulation', 'เป็นสัญญาณ pre-Spring'],
            en: ['Red bars get smaller', 'Volume fades on every down bar', 'Common in Phase B of accumulation', 'A pre-Spring signal'] } },
];

let currentVP = 0;
function renderVPTabs() {
  const tabs = document.getElementById('vpTabs');
  if (!tabs) return;
  tabs.innerHTML = VP_SCENARIOS.map((s, i) =>
    `<button class="vp-tab ${i === currentVP ? 'active' : ''}" data-i="${i}">${t(s.label)}</button>`
  ).join('');
  tabs.querySelectorAll('.vp-tab').forEach(b => {
    b.addEventListener('click', () => {
      currentVP = +b.dataset.i;
      drawVP();
      renderVPTabs();
    });
  });
}
function drawVP() {
  const cv = document.getElementById('vpCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = 720, H = 380;
  const dpr = window.devicePixelRatio || 1;
  if (cv.width !== W * dpr) {
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.scale(dpr, dpr);
  }
  ctx.clearRect(0, 0, W, H);
  const sc = VP_SCENARIOS[currentVP];
  // Layout: price area top 0..240, volume 270..360
  const cw = 100; // candle width slot
  const cw0 = 90; // start x
  // Price scale: candle values 0..100 → y mapped to 220..30
  const py = v => 220 - v * 1.9;
  // Draw price grid
  ctx.strokeStyle = '#e5e5e5';
  ctx.beginPath();
  for (let g = 0; g <= 4; g++) { const y = 30 + g * 50; ctx.moveTo(40, y); ctx.lineTo(W - 20, y); }
  ctx.stroke();
  // Candles
  sc.candles.forEach((c, i) => {
    const cx = cw0 + i * cw;
    const top = Math.min(c.o, c.c);
    const bot = Math.max(c.o, c.c);
    const isUp = c.c > c.o;
    const color = isUp ? '#16a34a' : '#dc2626';
    const wickHi = Math.max(c.o, c.c) + (c.wide ? 5 : 3);
    const wickLo = Math.min(c.o, c.c) - (c.wide ? 5 : 3);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + 18, py(wickHi));
    ctx.lineTo(cx + 18, py(wickLo));
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fillRect(cx, py(bot), 36, py(top) - py(bot) + 1);
  });
  // Volume area
  ctx.strokeStyle = '#e5e5e5';
  ctx.beginPath();
  ctx.moveTo(40, 270); ctx.lineTo(W - 20, 270);
  ctx.moveTo(40, 360); ctx.lineTo(W - 20, 360);
  ctx.stroke();
  ctx.fillStyle = '#888';
  ctx.font = '11px Inter';
  ctx.fillText('Volume', 44, 282);
  // Volume bars
  const maxV = 100;
  sc.vols.forEach((v, i) => {
    const cx = cw0 + i * cw;
    const h = (v / maxV) * 80;
    let color = '#94a3b8';
    if (v > 70) color = sc.mood === 'bear' ? '#d97706' : '#2563eb';
    else if (v < 25) color = '#cbd5e1';
    ctx.fillStyle = color;
    ctx.fillRect(cx, 360 - h, 36, h);
    // value label
    ctx.fillStyle = '#666';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(v, cx + 8, 360 - h - 4);
  });
  // Title
  ctx.fillStyle = '#1e293b';
  ctx.font = '700 14px Inter';
  ctx.fillText(t(sc.title), 44, 22);

  // Readout
  const out = document.getElementById('vpReadout');
  const moodCls = sc.mood;
  const moodLbl = t({
    bull: { th: 'สัญญาณขาขึ้น', en: 'Bullish signal' },
    bear: { th: 'สัญญาณขาลง', en: 'Bearish signal' },
    warn: { th: 'สัญญาณเตือน', en: 'Warning signal' },
    neutral: { th: 'สัญญาณกลาง', en: 'Neutral signal' },
  }[moodCls]);
  out.innerHTML = `
    <h4>${t(sc.title)} <span class="vp-tag ${moodCls}">${moodLbl}</span></h4>
    <p>${t(sc.desc)}</p>
    <ul style="margin-top:6px;padding-left:20px;">
      ${t(sc.cues).map(c => `<li>${c}</li>`).join('')}
    </ul>
  `;
}

renderVPTabs();
drawVP();

// ============================================================
// SECTION 7 — Schematic Lab (Game + Carousel)
// ============================================================
const labTabs = document.querySelectorAll('.lab-tab');
labTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    labTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const mode = tab.dataset.mode;
    document.getElementById('labGame').style.display = mode === 'game' ? '' : 'none';
    document.getElementById('labCarousel').style.display = mode === 'carousel' ? '' : 'none';
    if (mode === 'carousel') drawCarousel();
  });
});

// ---- Game mode: drag-and-drop labeling ----
const GAME_TIME = 90;
let gameTimer = null;
let gameTimeLeft = GAME_TIME;
let gameScore = 0;
let gameCorrect = 0;
let gameRunning = false;
let gameScenario = 'accum';
let gameZones = []; // [{code, x, y}]
let gamePlaced = {}; // code -> true if correctly placed
let gameBank = []; // remaining label codes
let bestScore = +(localStorage.getItem('mysandbox.wyckoff.lab.best') || 0);

function refreshScenarioOptions() {
  const sel = document.getElementById('labScenarioSel');
  if (!sel) return;
  sel.innerHTML = `
    <option value="accum">${t({th:'Accumulation', en:'Accumulation'})}</option>
    <option value="dist">${t({th:'Distribution', en:'Distribution'})}</option>
  `;
  sel.value = gameScenario;
}
refreshScenarioOptions();
document.getElementById('labScenarioSel')?.addEventListener('change', e => {
  gameScenario = e.target.value;
  resetGame();
});

function pickGameEvents() {
  const all = gameScenario === 'accum' ? ACCUM_EVENTS : DIST_EVENTS;
  // Skip the generic B-test entries — too repetitive for a game
  return all.filter(e => !e.code.startsWith('B-'));
}

function buildGameBoard() {
  const events = pickGameEvents();
  gameZones = events.map(e => ({ code: e.code, x: e.pos.x, y: e.pos.y, name: e.name }));
  // Shuffle bank
  gameBank = events.map(e => e.code);
  shuffle(gameBank);
  gamePlaced = {};
  drawGameBoard();
  drawGameBank();
}

function drawGameBoard() {
  const svg = document.getElementById('labGameSvg');
  if (!svg) return;
  const events = pickGameEvents();
  const pricePts = buildPricePath(gameScenario === 'accum' ? ACCUM_EVENTS : DIST_EVENTS, gameScenario);
  const pathStr = pricePts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  let parts = `<path d="${pathStr}" fill="none" stroke="#1e293b" stroke-width="2"/>`;
  // creek/ice
  let rangeTop, rangeBot, lineCls;
  if (gameScenario === 'accum') {
    rangeTop = ACCUM_EVENTS[2].pos.y;
    rangeBot = ACCUM_EVENTS[1].pos.y;
    lineCls = 'creek-line';
  } else {
    rangeTop = DIST_EVENTS[1].pos.y;
    rangeBot = DIST_EVENTS[2].pos.y;
    lineCls = 'ice-line';
  }
  parts = `<rect class="range-band" x="100" y="${rangeTop}" width="730" height="${rangeBot - rangeTop}"/>` +
          `<line class="${lineCls}" x1="100" y1="${rangeTop}" x2="880" y2="${rangeTop}"/>` +
          `<line class="${lineCls}" x1="100" y1="${rangeBot}" x2="700" y2="${rangeBot}"/>` + parts;
  // Drop zones
  events.forEach(ev => {
    const placed = gamePlaced[ev.code];
    const cls = placed === 'correct' ? 'drop-zone correct' : (placed === 'wrong' ? 'drop-zone wrong' : 'drop-zone');
    parts += `<rect class="${cls}" data-code="${ev.code}" x="${ev.pos.x - 22}" y="${ev.pos.y - 14}" width="44" height="28" rx="14"/>`;
    if (placed === 'correct') {
      parts += `<text class="drop-label" x="${ev.pos.x}" y="${ev.pos.y + 4}">${ev.code}</text>`;
    }
  });
  svg.innerHTML = parts;

  // Wire drop zones
  svg.querySelectorAll('.drop-zone').forEach(z => {
    z.addEventListener('dragover', e => { if (gameRunning) { e.preventDefault(); z.classList.add('over'); } });
    z.addEventListener('dragleave', () => z.classList.remove('over'));
    z.addEventListener('drop', e => {
      e.preventDefault();
      z.classList.remove('over');
      if (!gameRunning) return;
      const code = e.dataTransfer.getData('text/plain');
      handleDrop(z.getAttribute('data-code'), code);
    });
    // Touch handler — accept current touch drag target
    z.addEventListener('touchend', () => {
      if (!gameRunning || !touchDragCode) return;
      handleDrop(z.getAttribute('data-code'), touchDragCode);
    });
  });
}

function drawGameBank() {
  const bank = document.getElementById('labBank');
  if (!bank) return;
  bank.innerHTML = gameBank
    .filter(c => !gamePlaced[c] || gamePlaced[c] !== 'correct')
    .map(code => `<div class="label-pill" draggable="true" data-code="${code}">${code}</div>`).join('');
  // Wire drag events
  bank.querySelectorAll('.label-pill').forEach(pill => {
    pill.addEventListener('dragstart', e => {
      if (!gameRunning) { e.preventDefault(); return; }
      e.dataTransfer.setData('text/plain', pill.dataset.code);
      pill.classList.add('dragging');
    });
    pill.addEventListener('dragend', () => pill.classList.remove('dragging'));
    // Touch fallback
    pill.addEventListener('touchstart', () => {
      if (!gameRunning) return;
      touchDragCode = pill.dataset.code;
      pill.classList.add('dragging');
    });
    pill.addEventListener('touchend', () => {
      pill.classList.remove('dragging');
      setTimeout(() => { touchDragCode = null; }, 50);
    });
  });
}
let touchDragCode = null;

function handleDrop(zoneCode, draggedCode) {
  if (gamePlaced[zoneCode] === 'correct') return;
  if (zoneCode === draggedCode) {
    gamePlaced[zoneCode] = 'correct';
    gameCorrect++;
    gameScore += 10;
    updateGameHUD();
    drawGameBoard();
    drawGameBank();
    // Check win
    const totalZones = pickGameEvents().length;
    if (gameCorrect >= totalZones) finishGame(true);
  } else {
    gameScore = Math.max(0, gameScore - 3);
    gamePlaced[zoneCode] = 'wrong';
    drawGameBoard();
    setTimeout(() => {
      if (gamePlaced[zoneCode] === 'wrong') {
        delete gamePlaced[zoneCode];
        drawGameBoard();
      }
    }, 600);
    updateGameHUD();
  }
}

function updateGameHUD() {
  document.getElementById('labScore').textContent = gameScore;
  document.getElementById('labCorrect').textContent = gameCorrect;
  document.getElementById('labTime').textContent = gameTimeLeft;
  document.getElementById('labBest').textContent = bestScore;
}

function startGame() {
  if (gameRunning) return;
  gameRunning = true;
  gameScore = 0;
  gameCorrect = 0;
  gameTimeLeft = GAME_TIME;
  buildGameBoard();
  updateGameHUD();
  gameTimer = setInterval(() => {
    gameTimeLeft--;
    updateGameHUD();
    if (gameTimeLeft <= 0) finishGame(false);
  }, 1000);
}
function finishGame(won) {
  gameRunning = false;
  clearInterval(gameTimer);
  gameTimer = null;
  if (won) gameScore += gameTimeLeft * 2; // time bonus
  if (gameScore > bestScore) {
    bestScore = gameScore;
    localStorage.setItem('mysandbox.wyckoff.lab.best', bestScore);
  }
  updateGameHUD();
  // Show end message in bank
  const bank = document.getElementById('labBank');
  if (bank) {
    bank.innerHTML = won
      ? `<div style="font-weight:700;color:#16a34a;">🏆 ${t({th:'ครบทุกป้ายภายในเวลา! +bonus เวลาเหลือ', en:'All labels placed! +time bonus'})}</div>`
      : `<div style="font-weight:700;color:#dc2626;">⏱️ ${t({th:'หมดเวลา — กด "▶ เริ่มเกม" เพื่อลองใหม่', en:'Time up — press "▶ Start" to retry'})}</div>`;
  }
}
function resetGame() {
  clearInterval(gameTimer);
  gameRunning = false;
  gameScore = 0;
  gameCorrect = 0;
  gameTimeLeft = GAME_TIME;
  gamePlaced = {};
  buildGameBoard();
  updateGameHUD();
}

document.getElementById('labStart')?.addEventListener('click', startGame);
document.getElementById('labReset')?.addEventListener('click', resetGame);
buildGameBoard();
updateGameHUD();

// ---- Carousel mode: pre-built scenario walk-through ----
const CAROUSEL = [
  {
    title: { th: '1. Standard Accumulation (ครบ Phase A-E)', en: '1. Standard Accumulation (Phases A-E)' },
    type: 'accum', events: ACCUM_EVENTS,
    description: { th: 'การสะสมแบบสมบูรณ์ตามตำรา — มี PS, SC, AR, ST, Phase B sideways, Spring + Test, SOS, LPS และ BU/JAC',
                   en: 'Textbook complete accumulation — PS, SC, AR, ST, Phase B sideways, Spring + Test, SOS, LPS, and BU/JAC' },
    keys: { th: ['SC + AR กำหนดขอบ trading range', 'Phase B sideways นาน — volume ค่อยๆ ลด',
                'Spring เป็น false breakdown ใต้ SC', 'LPS = จุดเข้าหลัก (entry) ของ Wyckoff trader'],
            en: ['SC + AR set the range edges', 'Long Phase B sideways with fading volume',
                'Spring = false breakdown below SC', 'LPS = main Wyckoff entry'] },
  },
  {
    title: { th: '2. Standard Distribution (ครบ Phase A-E)', en: '2. Standard Distribution (Phases A-E)' },
    type: 'dist', events: DIST_EVENTS,
    description: { th: 'การแจกจ่ายแบบสมบูรณ์ — กลับด้านของ accumulation: PSY, BC, AR, ST, Phase B, UTAD + Test, SOW, LPSY, breakdown',
                   en: 'Textbook complete distribution — mirror of accumulation: PSY, BC, AR, ST, Phase B, UTAD + Test, SOW, LPSY, breakdown' },
    keys: { th: ['BC + AR กำหนดขอบ trading range', 'UTAD = false breakout เหนือ BC (กับดักกระทิง)',
                'LPSY = จุดเข้า short ที่ดีที่สุด', 'หลัง LPSY → ทะลุ ice = markdown เริ่ม'],
            en: ['BC + AR set the range edges', 'UTAD = false breakout above BC (bull trap)',
                'LPSY = best short entry', 'After LPSY → break the ice = markdown begins'] },
  },
  {
    title: { th: '3. Quick Spring (ไม่มี Test ชัดเจน)', en: '3. Quick Spring (no clear Test)' },
    type: 'accum', events: ACCUM_EVENTS,
    description: { th: 'บางครั้ง Composite Man "รีบ" — Spring เกิดแล้วราคาวิ่งขึ้นเลยไม่มี Test ชัด ทำให้พลาดจุดเข้า ต้องใช้ LPS แทน',
                   en: 'Sometimes Composite Man is in a hurry — Spring happens then price runs up without a clear Test. Use LPS for entry instead.' },
    keys: { th: ['Spring ทันที + SOS เร็ว', 'ไม่มี Test ที่ชัดเจน', 'Entry ที่ปลอดภัย = LPS หลัง SOS', 'มักพบในตลาด crypto / momentum stocks'],
            en: ['Spring + immediate SOS', 'No clear Test', 'Safe entry = LPS after SOS', 'Common in crypto / momentum stocks'] },
  },
  {
    title: { th: '4. Failed Spring (กับดักไม่สำเร็จ)', en: '4. Failed Spring (the trap fails)' },
    type: 'accum', events: ACCUM_EVENTS,
    description: { th: 'Spring เกิดแต่ไม่กลับขึ้น — ราคาทะลุลงต่อ = ไม่ใช่ accumulation จริง อาจเป็น re-distribution หรือ continuation downtrend',
                   en: 'Spring occurs but fails to recover — price keeps falling = not real accumulation, possibly re-distribution or continuation downtrend' },
    keys: { th: ['Spring โดน invalidate เมื่อราคาปิดต่ำกว่า support 2 แท่งติด', 'volume ที่ Spring ไม่สูงพอ', 'หยุด stop ใต้จุด Spring เสมอ', 'การ recount เป็นโครงสร้าง bearish ใหม่'],
            en: ['Spring invalidated when price closes below support 2 bars in a row', 'Volume on Spring not high enough', 'Always stop below Spring low', 'Recount as new bearish structure'] },
  },
  {
    title: { th: '5. Re-accumulation (พักก่อนไปต่อ)', en: '5. Re-accumulation (pause before continuation)' },
    type: 'accum', events: ACCUM_EVENTS,
    description: { th: 'ไม่ใช่ทุก trading range จะเป็นจุดกลับตัวหลัก — บางทีคือ "พัก" ระหว่าง markup เพื่อสะสมต่อก่อน trend ต่อ',
                   en: 'Not every range is a major reversal — sometimes it\'s a pause within markup, accumulating again before trend resumes' },
    keys: { th: ['อยู่ใน uptrend อยู่แล้วก่อน range', 'ขนาด range เล็กกว่า accumulation หลัก', 'breakout ทิศเดียวกับ trend เดิม', 'จุดเข้า = pullback to creek (เหมือน LPS)'],
            en: ['In an uptrend before the range', 'Smaller range than primary accumulation', 'Breaks out in the trend direction', 'Entry = pullback to creek (like LPS)'] },
  },
];
let carIdx = 0;

function drawCarousel() {
  const svg = document.getElementById('carSvg');
  const titleEl = document.getElementById('carTitle');
  const readout = document.getElementById('carReadout');
  if (!svg) return;
  const sc = CAROUSEL[carIdx];
  titleEl.textContent = t(sc.title);
  // Reuse drawSchematic-like logic but in this svg
  const events = sc.events;
  const pricePts = buildPricePath(events, sc.type);
  const pathStr = pricePts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ',' + p[1]).join(' ');
  let parts = '';
  let rangeTop, rangeBot, lineCls;
  if (sc.type === 'accum') {
    rangeTop = events[2].pos.y; rangeBot = events[1].pos.y; lineCls = 'creek-line';
  } else {
    rangeTop = events[1].pos.y; rangeBot = events[2].pos.y; lineCls = 'ice-line';
  }
  parts += `<rect class="range-band" x="100" y="${rangeTop}" width="700" height="${rangeBot - rangeTop}"/>`;
  parts += `<line class="${lineCls}" x1="100" y1="${rangeTop}" x2="880" y2="${rangeTop}"/>`;
  parts += `<line class="${lineCls}" x1="100" y1="${rangeBot}" x2="700" y2="${rangeBot}"/>`;
  parts += `<path d="${pathStr}" fill="none" stroke="#1e293b" stroke-width="2"/>`;
  events.forEach(ev => {
    const cls = sc.type === 'dist' ? 'ev-dot dist' : 'ev-dot';
    parts += `<circle class="${cls}" cx="${ev.pos.x}" cy="${ev.pos.y}" r="6"/>`;
    const labelY = ev.pos.y < 200 ? ev.pos.y - 12 : ev.pos.y + 18;
    parts += `<text class="ev-label" x="${ev.pos.x}" y="${labelY}" text-anchor="middle">${ev.code.replace('B-test1','').replace('B-test2','')}</text>`;
  });
  svg.innerHTML = parts;
  readout.innerHTML = `
    <h4>${t(sc.title)}</h4>
    <p>${t(sc.description)}</p>
    <ul>${t(sc.keys).map(k => `<li>${k}</li>`).join('')}</ul>
  `;
}
document.getElementById('carPrev')?.addEventListener('click', () => {
  carIdx = (carIdx - 1 + CAROUSEL.length) % CAROUSEL.length;
  drawCarousel();
});
document.getElementById('carNext')?.addEventListener('click', () => {
  carIdx = (carIdx + 1) % CAROUSEL.length;
  drawCarousel();
});

// ============================================================
// SECTION 8 — Real charts (variant gallery)
// ============================================================
const REAL_VARIANTS = [
  {
    title: { th: 'Spring แบบ "ไหลยาว"', en: 'Drawn-out Spring' }, type: 'accum',
    sub: { th: 'กว่า Spring จะเกิดต้อง shake หลายครั้ง', en: 'Multiple shakes before Spring occurs' },
    pts: [[10,80],[40,160],[80,140],[120,170],[160,150],[200,180],[240,160],[280,200],[310,170],[340,30]],
    desc: { th: 'Composite Man "ทดสอบ" supply หลายครั้งก่อนตัดสินใจดันขึ้น — pattern จริงในตลาดหุ้นที่ liquidity ต่ำ',
            en: 'Composite Man tests supply multiple times before deciding to mark up — real pattern in lower-liquidity stocks' },
  },
  {
    title: { th: 'No Spring → SOS โดยตรง', en: 'No Spring → direct SOS' }, type: 'accum',
    sub: { th: 'บางที accumulation จบแบบเงียบๆ', en: 'Sometimes accumulation ends quietly' },
    pts: [[10,90],[60,150],[100,130],[140,160],[180,120],[220,150],[260,130],[300,40]],
    desc: { th: 'ไม่ทุกครั้งจะเห็น Spring ชัดๆ — บางที Composite Man สะสมนานพอ ไม่ต้อง shake สุดท้าย ตรงไป SOS เลย',
            en: 'Not every accumulation shows a clear Spring — sometimes after long absorption, Composite Man goes directly to SOS' },
  },
  {
    title: { th: 'UTAD แบบ flat', en: 'Flat UTAD' }, type: 'dist',
    sub: { th: 'UTAD ไม่ทำ high ใหม่ชัดเจน', en: 'UTAD without clear new high' },
    pts: [[10,250],[40,40],[80,90],[120,55],[160,100],[200,50],[240,100],[280,180],[320,250]],
    desc: { th: 'UTAD ไม่ต้องเป็น "ทะลุยอด" เสมอ — บางทีแค่ touch BC แล้วกลับลง = ก็ถือเป็น UTAD ได้',
            en: 'UTAD doesn\'t always pierce above — sometimes just a touch of BC then reversal counts as UTAD' },
  },
  {
    title: { th: 'Re-accumulation ใน uptrend', en: 'Re-accumulation in uptrend' }, type: 'accum',
    sub: { th: 'พักหายใจระหว่าง markup', en: 'A breather within markup' },
    pts: [[10,250],[40,180],[80,210],[120,170],[160,190],[200,160],[240,180],[280,140],[320,30]],
    desc: { th: 'อยู่ใน uptrend แล้วเกิด range เล็กก่อนวิ่งต่อ — รูปร่างเหมือน accumulation แต่ context = continuation',
            en: 'In an uptrend, a small range forms before continuation — looks like accumulation but context = continuation' },
  },
  {
    title: { th: 'Multiple ST ก่อน Spring', en: 'Multiple STs before Spring' }, type: 'accum',
    sub: { th: 'Phase A ลากยาวก่อนเข้า Phase B', en: 'Phase A drags before Phase B' },
    pts: [[10,80],[40,200],[70,160],[100,210],[130,170],[160,220],[190,180],[220,225],[250,150],[290,30]],
    desc: { th: 'บางหุ้น Composite Man ทยอยทดสอบ supply 3-4 ครั้งใน Phase A ก่อน trading range จะเริ่มชัด',
            en: 'In some stocks, Composite Man tests supply 3-4 times in Phase A before the trading range becomes clear' },
  },
  {
    title: { th: 'Failed Distribution → re-accumulation', en: 'Failed Distribution → re-accumulation' }, type: 'accum',
    sub: { th: 'ดูเป็น distribution แต่กลับเป็น continuation', en: 'Looks like distribution but becomes continuation' },
    pts: [[10,250],[40,80],[80,150],[120,80],[160,160],[200,90],[240,150],[280,100],[320,30]],
    desc: { th: 'Trading range ใกล้ยอด → ดูเหมือนกำลังจะ distribute → แต่กลับ break out ขึ้นต่อ ตอบโจทย์ "context สำคัญกว่า pattern"',
            en: 'Range near top → looks like distribution → but breaks out upward instead. "Context matters more than pattern."' },
  },
];

function renderRealGrid() {
  const grid = document.getElementById('realGrid');
  if (!grid) return;
  grid.innerHTML = REAL_VARIANTS.map(v => {
    const path = v.pts.map((p,i) => (i===0?'M':'L') + p[0] + ',' + p[1]).join(' ');
    const color = v.type === 'dist' ? '#d97706' : '#16a34a';
    const dots = v.pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.5" fill="${color}"/>`).join('');
    return `<div class="variant-card">
      <div class="variant-card__title ${v.type==='dist'?'dist':''}">${t(v.title)}</div>
      <div class="variant-card__sub">${t(v.sub)}</div>
      <svg viewBox="0 0 360 270" preserveAspectRatio="xMidYMid meet">
        <line x1="5" y1="260" x2="355" y2="260" stroke="#e5e5e5"/>
        <path d="${path}" fill="none" stroke="${color}" stroke-width="1.8"/>
        ${dots}
      </svg>
      <div class="variant-card__desc">${t(v.desc)}</div>
    </div>`;
  }).join('');
}
renderRealGrid();

// ============================================================
// SECTION 9 — Flashcard quiz
// ============================================================
const QUESTIONS = [
  { q: { th: 'ใครคือผู้พัฒนา Wyckoff Method และในยุคใด?', en: 'Who developed the Wyckoff Method and when?' },
    a: { th: 'Richard D. Wyckoff (1873–1934) นักเทรดและบรรณาธิการ Wall Street ในยุคต้น 1900s', en: 'Richard D. Wyckoff (1873–1934), an early-1900s trader and Wall Street publisher.' } },
  { q: { th: '"The Composite Man" คืออะไร?', en: 'What is "The Composite Man"?' },
    a: { th: 'แนวคิดสมมติว่าตลาดถูกขับเคลื่อนโดยผู้เล่นยักษ์รายเดียวที่มีแผนชัดเจน — ใช้เป็น mental model ในการอ่าน price action', en: 'A mental model: imagine the market is driven by one giant operator with a plan, and learn to read his footprints.' } },
  { q: { th: 'กฎ 3 ข้อของ Wyckoff คืออะไร?', en: 'What are Wyckoff\'s 3 Laws?' },
    a: { th: '1) Supply & Demand 2) Cause & Effect 3) Effort vs Result', en: '1) Supply & Demand 2) Cause & Effect 3) Effort vs Result' } },
  { q: { th: 'วงจรตลาด 4 เฟสของ Wyckoff?', en: 'Wyckoff\'s 4-phase market cycle?' },
    a: { th: 'Accumulation → Markup → Distribution → Markdown', en: 'Accumulation → Markup → Distribution → Markdown' } },
  { q: { th: 'PS, SC, AR, ST อยู่ใน Phase ใดของ Accumulation?', en: 'PS, SC, AR, ST belong to which Phase of Accumulation?' },
    a: { th: 'Phase A — เป็นเฟส "หยุด downtrend" และกำหนด trading range', en: 'Phase A — the phase that "stops the downtrend" and defines the trading range.' } },
  { q: { th: '"Spring" คืออะไร?', en: 'What is a "Spring"?' },
    a: { th: 'False breakdown ใต้ support ใน Phase C — ทำให้รายย่อย stop-loss/short ก่อนกลับขึ้น = bear trap', en: 'A false breakdown below support in Phase C — triggers retail stops/shorts before reversing = bear trap.' } },
  { q: { th: 'จุด entry หลักของ Wyckoff trader (Accumulation) คือ?', en: 'Main Wyckoff entry point for accumulation?' },
    a: { th: 'LPS (Last Point of Support) ใน Phase D — หลัง SOS pullback ลงไปทดสอบ creek แล้วยืน', en: 'LPS (Last Point of Support) in Phase D — after SOS pulls back to test the creek and holds.' } },
  { q: { th: '"SOS" หมายถึงอะไร และอยู่ Phase ใด?', en: 'What does "SOS" mean and which Phase?' },
    a: { th: 'Sign of Strength — แท่งยาวแข็งแรง + volume สูง ทะลุ creek (resistance) ใน Phase D', en: 'Sign of Strength — wide strong candle + high volume crossing the creek (resistance) in Phase D.' } },
  { q: { th: '"Creek" และ "Ice" หมายถึงอะไรในศัพท์ Wyckoff?', en: 'What do "Creek" and "Ice" mean in Wyckoff terms?' },
    a: { th: 'Creek = แนวต้านบนของ accumulation (resistance) | Ice = แนวรับบนของ distribution (support)', en: 'Creek = upper resistance of accumulation | Ice = lower support of distribution.' } },
  { q: { th: '"UTAD" หมายถึงอะไร และอยู่ Phase ใด?', en: 'What does "UTAD" mean and which Phase?' },
    a: { th: 'Upthrust After Distribution — false breakout เหนือ BC ใน Phase C ของ distribution = bull trap', en: 'Upthrust After Distribution — a false breakout above BC in Phase C of distribution = bull trap.' } },
  { q: { th: 'จุด entry หลักของ Wyckoff trader (Distribution) คือ?', en: 'Main Wyckoff entry point for distribution?' },
    a: { th: 'LPSY (Last Point of Supply) ใน Phase D — rally อ่อนๆ ที่ volume ต่ำหลัง SOW', en: 'LPSY (Last Point of Supply) in Phase D — weak low-volume rally after SOW.' } },
  { q: { th: 'กฎ Cause & Effect คืออะไร และวัด cause อย่างไร?', en: 'Law of Cause & Effect — and how is cause measured?' },
    a: { th: 'Trading range ที่ใหญ่ (cause) ทำให้เกิด trend ที่ใหญ่ (effect) — Wyckoff ใช้ Point & Figure count วัด cause', en: 'A larger trading range (cause) produces a larger trend (effect). Cause is measured via Point & Figure counts.' } },
  { q: { th: 'กฎ Effort vs Result คืออะไร?', en: 'What is the Law of Effort vs Result?' },
    a: { th: 'Volume = effort, price move = result — เมื่อทั้งสองสอดคล้อง trend แข็งแรง; เมื่อ divergence = สัญญาณเตือน', en: 'Volume = effort, price = result. When they align, trend is healthy. Divergence = warning.' } },
  { q: { th: '"No Demand" คืออะไร และเกิดในเฟสใดบ่อย?', en: 'What is "No Demand" and where is it common?' },
    a: { th: 'แท่งเขียวเล็กๆ + volume ลดลง = ไม่มี demand จริง บ่อยใน Phase B ของ distribution (สัญญาณ pre-UTAD)', en: 'Small green bars + fading volume = no real demand. Common in Phase B of distribution (pre-UTAD signal).' } },
  { q: { th: '"No Supply" คืออะไร และเกิดในเฟสใดบ่อย?', en: 'What is "No Supply" and where is it common?' },
    a: { th: 'แท่งแดงเล็กๆ + volume ลดลง = supply หมด บ่อยใน Phase B ของ accumulation (สัญญาณ pre-Spring)', en: 'Small red bars + fading volume = supply exhausted. Common in Phase B of accumulation (pre-Spring signal).' } },
  { q: { th: 'Test of Spring ที่ดีต้องเป็นอย่างไร?', en: 'What does a good Test of Spring look like?' },
    a: { th: 'ราคา dip ลงไปใกล้ Spring low แต่ volume ต่ำมาก ไม่ทะลุ — ยืนยันว่า supply หมด', en: 'Price dips near Spring low on very low volume without breaking it — confirms supply is dry.' } },
  { q: { th: 'ขั้นตอน 5-Step Approach ของ Wyckoff?', en: 'Wyckoff\'s 5-Step Approach?' },
    a: { th: '1) Trend ปัจจุบัน 2) ความแข็งแรงเทียบ index 3) Cause 4) Readiness (Spring/UTAD) 5) Timing entry/stop', en: '1) Current trend 2) Stock strength vs index 3) Cause 4) Readiness (Spring/UTAD) 5) Timing entry/stop.' } },
  { q: { th: 'ทำไม Wyckoff ใช้ดีในตลาดหุ้น/futures มากกว่า forex spot?', en: 'Why does Wyckoff work better on stocks/futures than forex spot?' },
    a: { th: 'เพราะหุ้น/futures มี centralized volume จริง — forex spot ไม่มี ใช้ tick volume แทน', en: 'Stocks/futures have real centralized volume. Forex spot lacks it; tick volume is a proxy.' } },
  { q: { th: '"Re-accumulation" คืออะไร?', en: 'What is "Re-accumulation"?' },
    a: { th: 'Trading range ที่เกิดระหว่าง uptrend ที่ดำเนินอยู่ — ไม่ใช่จุดกลับตัวหลัก แต่เป็น "พักหายใจ" ก่อน trend ต่อ', en: 'A trading range within an existing uptrend — not a major reversal, but a pause before continuation.' } },
  { q: { th: 'Stop-loss ที่ถูกต้องเมื่อเข้าตรง LPS?', en: 'Correct stop-loss when entering at LPS?' },
    a: { th: 'ใต้จุดต่ำของ Spring (หรือใต้ creek เพื่อ stop กว้างขึ้น) — ถ้าทะลุแสดงว่า Spring fail', en: 'Below the Spring low (or below the creek for a wider stop) — a break invalidates the Spring.' } },
];

let order = QUESTIONS.map((_, i) => i);
let cursor = 0;
let stats = loadQuizStats();
let revealed = false;

function loadQuizStats() {
  try {
    const raw = JSON.parse(localStorage.getItem('mysandbox.wyckoff.quiz') || '{}');
    return { score: raw.score || 0, streak: raw.streak || 0, best: raw.best || 0 };
  } catch { return { score: 0, streak: 0, best: 0 }; }
}
function saveQuizStats() {
  localStorage.setItem('mysandbox.wyckoff.quiz', JSON.stringify(stats));
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

shuffle(order);
renderQuizCard();
