# MySandbox

## จุดประสงค์ของโครงการ · Project Purpose

**MySandbox** เป็นคลังแซนด์บ็อกซ์เพื่อการเรียนรู้แบบโต้ตอบ (interactive learning sandboxes) ผู้ใช้ขอหัวข้อ → agent สร้าง visualization + คำอธิบายเป็นหน้า HTML/JS เพิ่มเข้าคอลเลกชัน

**รูปแบบการใช้งาน:** ผู้ใช้เลื่อน feed แนวตั้ง (TikTok/Shorts-style snap scroll) ดูการ์ดแซนด์บ็อกซ์ทีละอัน หรือเปิดเมนู drawer คลิกเข้าถึงหัวข้อที่ต้องการได้ตรง

**ตัวอย่างคำขอจากผู้ใช้:**
- "สร้าง visual อธิบายสมการ E=mc²" → slider เปลี่ยนมวล, ตารางอนุภาค, animation
- "แสดงการกลั่นน้ำมัน" → แผนภาพหอกลั่น, อุณหภูมิแต่ละชั้น, ผลิตภัณฑ์ที่ได้
- "อธิบายเครื่องยนต์ 4 จังหวะ" → animation ลูกสูบ, timing diagram

---

## การเริ่มใช้งาน · Quick Start

```bash
# วิธีที่ 1: ดับเบิลคลิกไฟล์บน Desktop
~/พื้นโต๊ะ/MySandbox.desktop

# วิธีที่ 2: ทางเทอร์มินัล
cd "~/พื้นโต๊ะ/MySandbox" && ./start.sh

# วิธีที่ 3: manual
python3 -m http.server 8765
```

เปิดบราวเซอร์ที่ `http://localhost:8765`

> ต้องเข้าถึงผ่าน HTTP — ES modules ทำงานไม่ได้กับ `file://`

---

## ⚠️ Workflow: ถามก่อนเริ่มทุกครั้ง · Always Confirm Before Building

**กฎ (MANDATORY):** เมื่อผู้ใช้ขอสร้างแซนด์บ็อกซ์ใหม่ หรือแก้ไขที่มีผลกระทบเชิงโครงสร้าง (เช่น เปลี่ยนธีม, เพิ่มฟีเจอร์กลาง, ปรับ architecture) **ห้ามลงมือเขียนโค้ดทันที** ให้ทำ consultation ก่อนเสมอ

### ขั้นตอน

1. **เข้าใจตรงกัน (Confirm understanding)** — อ่าน CLAUDE.md ก่อน แล้วเรียบเรียงความเข้าใจเป็นของตัวเองสั้นๆ
2. **เสนอโครงร่าง (Propose outline)** — ใช้ template ด้านล่าง
3. **ถามคำถามที่ต้องรู้ (Ask clarifying questions)** — เฉพาะที่จำเป็นจริงๆ อย่าถามรวมๆ
4. **รอ approval** — รอจนผู้ใช้พูดว่า `"เริ่มได้"`, `"เริ่มเลย"`, `"โอเค"`, `"go"`, `"approved"`, หรือข้อความยืนยันอื่นๆ **ห้ามเดา**
5. **ลงมือ** — หลังได้ approval แล้วจึงเริ่มสร้าง/แก้

### ข้อยกเว้น (เมื่อข้ามขั้นตอน consultation ได้)

- ผู้ใช้บอกตรงๆ ว่า **"ไม่ต้องถาม"**, **"ทำได้เลย"**, **"เริ่มเลย ไม่ต้องปรึกษา"**
- เป็น **bug fix เล็ก ๆ** หรือ **typo**
- ผู้ใช้ให้ prompt ละเอียดครบทุกองค์ประกอบอยู่แล้ว (หัวข้อ + sections + interactives + icon) — ในกรณีนี้ยืนยันสั้น 1-2 ประโยคแล้วถามแค่ `"ตามนี้ถูกต้องไหม เริ่มได้เลยไหม?"` ก็พอ

### Template สำหรับ Consultation

ใช้รูปแบบนี้เมื่อเสนอ (ปรับยาว-สั้นตามความซับซ้อน):

```
เข้าใจคำขอว่า: <หัวข้อและจุดประสงค์ 1-2 ประโยค>

เสนอโครงร่าง sandbox "<slug>":
  🎯 Target: <ใคร / ระดับความลึก>
  📌 Icon: <emoji ที่เสนอ>

Sections ที่จะสร้าง:
  1. <ชื่อ section> — <สั้นๆ ว่ามีอะไร>
  2. <ชื่อ section> — <interactive อะไร / visualization อะไร>
  3. ...

Libraries/tech ที่จะใช้ (ถ้ามีพิเศษ): <เช่น Three.js, D3, หรือ vanilla canvas>

คำถามก่อนเริ่ม:
  - <คำถาม 1>
  - <คำถาม 2>

รอ approval — พิมพ์ "เริ่มได้" หรือระบุจุดที่อยากปรับก่อน
```

### ตัวอย่างที่ดี

ผู้ใช้: *"ขอเพิ่ม sandbox การกลั่นน้ำมัน"*

Agent ควรตอบประมาณ:
```
เข้าใจว่าต้องการอธิบายกระบวนการกลั่นน้ำมันดิบในหอกลั่น (fractional distillation)
ให้ผู้เรียนเห็นความสัมพันธ์ของอุณหภูมิ จุดเดือด และผลิตภัณฑ์แต่ละชั้น

เสนอโครงร่าง sandbox "oil-refining":
  🎯 Target: นักเรียน ม.ต้น-ม.ปลาย / บุคคลทั่วไป
  📌 Icon: 🛢

Sections:
  1. ภาพรวม — น้ำมันดิบคืออะไร ทำไมต้องกลั่น
  2. Interactive หอกลั่น — SVG หอกลั่น มี slider ปรับอุณหภูมิ
     ไฮไลต์ชั้นที่ได้ผลิตภัณฑ์ + ข้อมูลจุดเดือด
  3. ตารางผลิตภัณฑ์ — LPG / Naphtha / น้ำมันเบนซิน / ดีเซล / น้ำมันเตา / Bitumen
     พร้อมจุดเดือด, การใช้งาน, ภาพตัวอย่าง
  4. ตัวอย่างจริง — โรงกลั่นในไทย, ปริมาณการผลิต

Tech: vanilla SVG + JS (ไม่ต้องใช้ library เสริม)

คำถาม:
  - อยากให้มี animation การไหลของของเหลว/ไอในหอกลั่นไหม (ทำให้ดูมีชีวิต แต่โค้ดซับซ้อนขึ้น)
  - เน้นเนื้อหาแบบไหน: เคมีลึก หรือภาพรวมเชิงอุตสาหกรรม

รอ approval
```

### เหตุผลของ workflow นี้

- **ผู้ใช้เป็นคนกำหนด scope** ไม่ใช่ agent — ป้องกันการทำเกิน/ขาด
- **คาดการณ์ได้** — ผู้ใช้รู้ล่วงหน้าว่าจะได้อะไร ไม่เสียเวลาถ้าทิศไม่ใช่
- **เอกสารประกอบ** — proposal เป็นบันทึกว่าตกลงอะไรไว้ ถ้ามีปัญหาย้อนดูได้

---

## โครงสร้างไฟล์ · File Structure

```
MySandbox/
├── CLAUDE.md                 ← เอกสารนี้
├── index.html                ← หน้าเมนูหลัก (feed + drawer)
├── manifest.json             ← รายการ sandbox ทั้งหมด
├── start.sh                  ← สคริปต์เริ่มเซิร์ฟเวอร์
├── MySandbox.desktop         ← launcher ดับเบิลคลิก
├── assets/
│   ├── style.css             ← ธีมกลาง + layout ของ feed/drawer/sandbox
│   ├── i18n.js               ← ระบบสลับภาษา TH/EN
│   └── shell.js              ← logic ของหน้า index (feed, drawer, lang toggle)
└── sandboxes/
    └── <slug>/
        ├── index.html        ← หน้าเต็มของแซนด์บ็อกซ์
        ├── style.css         ← CSS เฉพาะ (extend assets/style.css)
        └── script.js         ← JS เฉพาะ (import จาก ../../assets/i18n.js)
```

---

## Architecture

### 1. Feed (index.html)
- Full-height sections ด้วย `scroll-snap-type: y mandatory`
- `shell.js` โหลด `manifest.json` แล้ว render ทั้ง feed item และ drawer list
- Welcome card มาก่อนแล้วตามด้วย sandbox หนึ่งอันต่อหนึ่ง section

### 2. Drawer Menu
- ปุ่ม `☰` มุมขวาบน เปิดพาเนลเลื่อนจากขวา
- แสดงทุก sandbox จาก manifest พร้อมไอคอน + subtitle
- ปิดด้วย `Esc`, คลิก backdrop, หรือปุ่ม `✕`

### 3. Sandbox Page
- Self-contained folder ที่ `sandboxes/<slug>/`
- ต้อง include `../../assets/style.css` ตามด้วย `./style.css`
- ต้อง import `../../assets/i18n.js` และเรียก `initLang()`

---

## หลักการออกแบบ · Conventions

### Tech Stack (อย่าเพิ่ม build step / framework)
- Vanilla HTML + CSS + ES Modules JS
- **ไม่มี** bundler, ไม่มี npm, ไม่มี TypeScript
- โหลด library ผ่าน CDN เฉพาะที่จำเป็น (เช่น Three.js, D3, p5.js, Plotly) — เลือกใช้เท่าที่ต้องการจริงๆ
- Fonts: Inter + Noto Sans Thai + JetBrains Mono (โหลดจาก Google Fonts)

### Bilingual (TH/EN)
- **Default:** `th` · เก็บใน `localStorage` key `mysandbox.lang`
- **HTML แบบ inline:**
  ```html
  <span data-lang-th>ข้อความไทย</span>
  <span data-lang-en>English text</span>
  ```
  CSS จะซ่อนตัวที่ไม่ตรงกับ `html[lang="..."]` อัตโนมัติ
- **JS แบบ dynamic:**
  ```js
  import { getLang, toggleLang, initLang, t } from '../../assets/i18n.js';
  initLang();
  const label = t({ th: 'มวล', en: 'Mass' });
  ```
- **Toggle ในหน้าใหม่:** ใส่ปุ่ม `<button class="lang-btn">EN</button>` ใน topbar แล้ว wire:
  ```js
  document.querySelector('.lang-btn').addEventListener('click', toggleLang);
  document.addEventListener('langchange', () => { /* re-render dynamic content */ });
  ```

### Theme · Light, Minimal
- CSS variables อยู่ใน `:root` ที่ `assets/style.css`:
  - `--bg`, `--surface`, `--text`, `--text-soft`, `--muted`, `--border`
  - `--accent` (น้ำเงิน `#2563eb`), `--accent-soft` (ฟ้าอ่อน)
  - `--radius` (16px), `--shadow`
- ใช้ `.section` เป็น container การ์ดภายในหน้า sandbox (พื้นขาว + border + shadow)
- หลีกเลี่ยงสีเข้มเต็มพื้น (เว้นกรณี canvas visualization เช่น emc2)

### manifest.json Schema
```json
{
  "sandboxes": [
    {
      "id": "unique-id",
      "slug": "url-slug",
      "path": "sandboxes/<slug>/index.html",
      "icon": "⚡",
      "title":       { "th": "...", "en": "..." },
      "subtitle":    { "th": "...", "en": "..." },
      "description": { "th": "...", "en": "..." },
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

---

## ขั้นตอนเพิ่มแซนด์บ็อกซ์ใหม่ · Adding a New Sandbox

1. **สร้างโฟลเดอร์:** `sandboxes/<slug>/` (slug เป็นตัวพิมพ์เล็ก คั่นด้วย `-`)

2. **`sandboxes/<slug>/index.html`** ใช้โครงนี้เป็น template:
   ```html
   <!DOCTYPE html>
   <html lang="th">
   <head>
     <meta charset="UTF-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <title>TITLE · MySandbox</title>
     <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap" rel="stylesheet">
     <link rel="stylesheet" href="../../assets/style.css" />
     <link rel="stylesheet" href="style.css" />
   </head>
   <body>
     <header class="topbar">
       <div style="display:flex;align-items:center;gap:12px;">
         <a href="../../index.html" class="icon-btn">←</a>
         <div class="topbar__brand">TITLE</div>
       </div>
       <div class="topbar__actions">
         <button class="lang-btn">EN</button>
       </div>
     </header>
     <main class="sandbox-page">
       <div class="sandbox-container">
         <div class="sandbox-header">
           <h1>
             <span data-lang-th>หัวข้อภาษาไทย</span>
             <span data-lang-en>English title</span>
           </h1>
         </div>
         <section class="section">
           <h2><span data-lang-th>...</span><span data-lang-en>...</span></h2>
           <!-- เนื้อหา + interactive elements -->
         </section>
       </div>
     </main>
     <script type="module" src="../../assets/i18n.js"></script>
     <script type="module" src="script.js"></script>
   </body>
   </html>
   ```

3. **`sandboxes/<slug>/script.js`** — เริ่มด้วย:
   ```js
   import { getLang, toggleLang, initLang } from '../../assets/i18n.js';
   initLang();
   const langBtn = document.querySelector('.lang-btn');
   function renderLangLabel() {
     if (langBtn) langBtn.textContent = getLang() === 'th' ? 'EN' : 'ไทย';
   }
   langBtn?.addEventListener('click', toggleLang);
   document.addEventListener('langchange', () => { renderLangLabel(); /* re-render */ });
   renderLangLabel();
   ```

4. **`sandboxes/<slug>/style.css`** — เพิ่ม style เฉพาะของ sandbox (reuse `.section`, `.btn-primary`, `.btn-secondary`, CSS variables จาก global)

5. **เพิ่ม entry ใน `manifest.json`** — feed และ drawer menu จะอัปเดตอัตโนมัติเมื่อ reload หน้าเมนู

6. **ทดสอบ** — เปิด `http://localhost:8765/` ตรวจ card + drawer และคลิกเข้า sandbox ตรวจ interaction, ลอง toggle ภาษา

---

## รูปแบบเนื้อหาที่แนะนำ · Content Pattern

เพื่อให้ทุก sandbox มีความสม่ำเสมอ ลองจัดเป็น 4-6 sections ต่อแซนด์บ็อกซ์:

1. **สมการ/หลักการ** (static display สวยงาม)
2. **Interactive calculator / ปรับค่า** (slider / input → คำนวณผลสด)
3. **Visualization** (Canvas / SVG / Three.js animation)
4. **ตาราง/รายการข้อมูล** (คลิกแถวได้ เปรียบเทียบ)
5. **ตัวอย่างโลกจริง** (bullet list สั้นๆ พร้อมตัวเลขเทียบจริง)
6. **footer note** (ย้ำว่าเป็นสื่อการเรียน ค่าประมาณ)

ดูตัวอย่างครบจาก `sandboxes/emc2/` — เป็น reference implementation

---

## Known Gotchas

- **Path ของ Desktop** ในระบบนี้คือ `/home/rungrots/พื้นโต๊ะ/` (ภาษาไทย ไม่ใช่ `/Desktop`)
- **Port 8765** fixed ใน `start.sh`; ถ้ารันซ้ำ script จะตรวจเจอแล้วเปิดบราวเซอร์ให้แทน
- **ES modules ต้องการ HTTP** — อย่าบอกผู้ใช้ให้ double-click `index.html` ตรงๆ
- **Thai path ใน `.desktop`** — quote ให้ดี `Exec=bash -c 'cd "..." && ...'`
- **CORS / file path:** ใช้ relative path ตลอด (เช่น `../../assets/i18n.js`) ไม่ใช้ absolute

---

## Deployment · Netlify + GitHub

- **Repo:** https://github.com/dhamma-seeker/MySandbox (main branch → auto-deploy)
- **Config:** `netlify.toml` ที่ root — publish `.`, ไม่มี build step
- **Publish directory:** `.` (root) — Netlify เสิร์ฟไฟล์ static ได้เลย

### Git commit identity (สำคัญ — ห้ามลืม)

User ตั้ง email ส่วนตัว `rungrot.sup@gmail.com` เป็น **private** บน GitHub ถ้า commit ด้วย email นี้ → push ถูก reject ด้วย `GH007: Your push would publish a private email address`

**แก้ได้โดยตั้ง commit identity ใช้ noreply email:**

```bash
cd ~/พื้นโต๊ะ/MySandbox
git config user.email "10030420+dhamma-seeker@users.noreply.github.com"
git config user.name "dhamma-seeker"
```

(ตั้งเฉพาะ repo นี้ ไม่กระทบ global)

**ถ้า commit ไปแล้วด้วย email ผิด** ใช้ env vars amend ทั้ง author + committer ก่อน push:

```bash
GIT_COMMITTER_NAME="dhamma-seeker" \
GIT_COMMITTER_EMAIL="10030420+dhamma-seeker@users.noreply.github.com" \
git commit --amend --author="dhamma-seeker <10030420+dhamma-seeker@users.noreply.github.com>" --no-edit
```

---

## สถานะปัจจุบัน · Current State

- ✅ Chrome (feed + drawer + language toggle + snap scroll)
- ✅ `emc2` — E=mc² (slider calculator, particle table 10 รายการ, canvas photon animation, real-world examples)
- ⏳ รอคำขอจากผู้ใช้เพิ่มหัวข้อใหม่

---

## หลักการทำงานกับผู้ใช้ · Working Style Notes

- **ถามก่อนเริ่มทุกครั้ง** — ดูหัวข้อ [Workflow: ถามก่อนเริ่มทุกครั้ง](#️-workflow-ถามก่อนเริ่มทุกครั้ง--always-confirm-before-building) ข้างต้น
- ผู้ใช้สื่อสารเป็นภาษาไทยเป็นหลัก ตอบกลับเป็นไทย แต่ code/identifier เป็นอังกฤษ
- เน้นให้ผู้ใช้ "เห็นภาพ" และ "โต้ตอบได้" — ไม่ใช่แค่อ่าน
- Values ในเนื้อหาให้ถูกต้องเชิงวิทยาศาสตร์/วิศวกรรม ค่าประมาณยอมรับได้แต่ต้องติด disclaimer
- หลังสร้างเสร็จ — ตรวจว่า server รันอยู่ แล้วบอก URL ให้ผู้ใช้เปิดดู
