import { getLang, toggleLang, initLang } from '../../assets/i18n.js';

initLang();

const C = 299_792_458;
const C2 = C * C;
const J_PER_KT_TNT = 4.184e12;
const J_PER_KWH = 3.6e6;
const HOME_KWH_PER_YEAR = 10_000;
const HIROSHIMA_J = 15 * J_PER_KT_TNT;

// --- Language chrome ---
const langBtn = document.querySelector('.lang-btn');
function renderLangLabel() {
  if (langBtn) langBtn.textContent = getLang() === 'th' ? 'EN' : 'ไทย';
}
langBtn?.addEventListener('click', toggleLang);
document.addEventListener('langchange', () => {
  renderLangLabel();
  renderParticles();
  updateCalc();
});
renderLangLabel();

// --- Calculator ---
const slider = document.getElementById('mass-slider');
const massValue = document.getElementById('mass-value');
const massUnit = document.getElementById('mass-unit');

function fmtSci(n, digits = 3) {
  if (n === 0) return '0';
  if (Math.abs(n) >= 0.01 && Math.abs(n) < 10000) {
    return n.toLocaleString(undefined, { maximumFractionDigits: digits });
  }
  return n.toExponential(digits);
}

function fmtMass(kg) {
  if (kg >= 1000) return `${fmtSci(kg / 1000)} t`;
  if (kg >= 1) return `${fmtSci(kg)} kg`;
  if (kg >= 0.001) return `${fmtSci(kg * 1000)} g`;
  if (kg >= 1e-6) return `${fmtSci(kg * 1e6)} mg`;
  return `${fmtSci(kg)} kg`;
}

function updateCalc() {
  const logMass = parseFloat(slider.value);
  const kg = Math.pow(10, logMass);
  massValue.textContent = fmtMass(kg);

  const E = kg * C2;
  document.getElementById('energy-j').textContent = fmtSci(E, 3);

  const ktTNT = E / J_PER_KT_TNT;
  const tntEl = document.getElementById('energy-tnt');
  const tntUnit = document.getElementById('tnt-unit');
  if (ktTNT >= 1000) {
    tntEl.textContent = fmtSci(ktTNT / 1000, 2);
    tntUnit.textContent = 'Mt';
  } else if (ktTNT >= 0.001) {
    tntEl.textContent = fmtSci(ktTNT, 2);
    tntUnit.textContent = 'kt';
  } else {
    tntEl.textContent = fmtSci(ktTNT * 1000, 2);
    tntUnit.textContent = 't';
  }

  const homesYears = (E / J_PER_KWH) / HOME_KWH_PER_YEAR;
  document.getElementById('energy-home').textContent = fmtSci(homesYears, 2);

  const hiroCount = E / HIROSHIMA_J;
  document.getElementById('energy-hiro').textContent = fmtSci(hiroCount, 2);
}
slider.addEventListener('input', updateCalc);
massUnit.addEventListener('change', () => {
  const unitMul = parseFloat(massUnit.value);
  const currentKg = Math.pow(10, parseFloat(slider.value));
  const targetLog = Math.log10(currentKg);
  slider.value = Math.max(-6, Math.min(6, targetLog));
  updateCalc();
});
updateCalc();

// --- Animation: mass → photons ---
const canvas = document.getElementById('anim');
const ctx = canvas.getContext('2d');
let particles = [];
let blob = { x: canvas.width / 2, y: canvas.height / 2, r: 30, alive: true, pulse: 0 };
let running = true;

function spawnPhotons(count = 120) {
  const colors = ['#fde047', '#fb923c', '#f472b6', '#60a5fa', '#a78bfa', '#ffffff'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x: blob.x,
      y: blob.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.005 + Math.random() * 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 1.5 + Math.random() * 2.5,
    });
  }
}

function drawBlob() {
  if (!blob.alive) return;
  blob.pulse += 0.05;
  const pulseR = blob.r + Math.sin(blob.pulse) * 3;
  const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, pulseR * 1.5);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  grad.addColorStop(0.4, 'rgba(147, 197, 253, 0.6)');
  grad.addColorStop(1, 'rgba(37, 99, 235, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(blob.x, blob.y, pulseR * 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(blob.x, blob.y, pulseR, 0, Math.PI * 2);
  ctx.fill();
}

function drawLabel() {
  if (!blob.alive && particles.length < 5) return;
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.textAlign = 'center';
  const text = blob.alive ? 'm (mass)' : 'E = mc²';
  ctx.fillText(text, blob.x, blob.y + blob.r + 28);
}

function step() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBlob();

  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  drawLabel();

  if (running) requestAnimationFrame(step);
}
step();

document.getElementById('anim-trigger').addEventListener('click', () => {
  blob.alive = false;
  spawnPhotons(180);
});
document.getElementById('anim-reset').addEventListener('click', () => {
  particles = [];
  blob = { x: canvas.width / 2, y: canvas.height / 2, r: 30, alive: true, pulse: 0 };
});

// --- Particle table ---
const PARTICLES = [
  { name: { th: 'อิเล็กตรอน (e⁻)', en: 'Electron (e⁻)' }, mass: 9.1093837e-31, mev: 0.511,
    note: { th: 'เบาที่สุดของอนุภาคมีประจุที่เสถียร', en: 'Lightest stable charged particle' } },
  { name: { th: 'มิวออน (μ)', en: 'Muon (μ)' }, mass: 1.883531e-28, mev: 105.658,
    note: { th: 'หนักกว่าอิเล็กตรอน ~207 เท่า สลายใน 2.2 μs', en: '~207× heavier than electron, decays in 2.2 μs' } },
  { name: { th: 'ไพออน (π±)', en: 'Pion (π±)' }, mass: 2.4880e-28, mev: 139.57,
    note: { th: 'อนุภาคในแรงนิวเคลียร์อย่างเข้ม', en: 'Carrier of residual strong force' } },
  { name: { th: 'โปรตอน (p)', en: 'Proton (p)' }, mass: 1.6726219e-27, mev: 938.272,
    note: { th: 'นิวเคลียสของไฮโดรเจน', en: 'Hydrogen nucleus' } },
  { name: { th: 'นิวตรอน (n)', en: 'Neutron (n)' }, mass: 1.674927e-27, mev: 939.565,
    note: { th: 'หนักกว่าโปรตอนเล็กน้อย', en: 'Slightly heavier than proton' } },
  { name: { th: 'ดิวเทอรอน (²H)', en: 'Deuteron (²H)' }, mass: 3.3435e-27, mev: 1875.6,
    note: { th: 'นิวเคลียสไฮโดรเจนหนัก', en: 'Heavy hydrogen nucleus' } },
  { name: { th: 'บอซอน W', en: 'W boson' }, mass: 1.4335e-25, mev: 80_379,
    note: { th: 'ตัวกลางแรงอ่อน', en: 'Mediator of weak force' } },
  { name: { th: 'บอซอน Z', en: 'Z boson' }, mass: 1.6256e-25, mev: 91_188,
    note: { th: 'ตัวกลางแรงอ่อน (เป็นกลาง)', en: 'Neutral mediator of weak force' } },
  { name: { th: 'ฮิกก์ส (H)', en: 'Higgs (H)' }, mass: 2.2232e-25, mev: 125_100,
    note: { th: 'ที่มาของมวลในแบบจำลองมาตรฐาน', en: 'Source of mass in Standard Model' } },
  { name: { th: 'ควาร์กท็อป (t)', en: 'Top quark (t)' }, mass: 3.0784e-25, mev: 173_000,
    note: { th: 'อนุภาคมูลฐานที่หนักที่สุด', en: 'Heaviest elementary particle' } },
];

const particleBody = document.getElementById('particle-body');
let selectedParticle = null;

function fmtMeV(mev) {
  if (mev >= 1000) return `${(mev / 1000).toFixed(2)} GeV`;
  if (mev >= 1) return `${mev.toFixed(3)} MeV`;
  return `${(mev * 1000).toFixed(2)} keV`;
}

function renderParticles() {
  const lang = getLang();
  const maxMeV = Math.max(...PARTICLES.map(p => p.mev));
  particleBody.innerHTML = '';
  PARTICLES.forEach((p, i) => {
    const tr = document.createElement('tr');
    if (selectedParticle === i) tr.classList.add('selected');
    tr.addEventListener('click', () => {
      selectedParticle = selectedParticle === i ? null : i;
      renderParticles();
    });
    const barWidth = (p.mev / maxMeV) * 100;
    tr.innerHTML = `
      <td>${p.name[lang]}</td>
      <td>${p.mass.toExponential(3)}</td>
      <td>
        ${fmtMeV(p.mev)}
        <div class="energy-bar" style="width:${barWidth}%"></div>
      </td>
      <td>${p.note[lang]}</td>
    `;
    particleBody.append(tr);
  });
}
renderParticles();
