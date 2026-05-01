import { getLang, toggleLang, initLang, t } from '../../assets/i18n.js';

initLang();

const langBtn = document.querySelector('.lang-btn');
function renderLangLabel() {
  if (langBtn) langBtn.textContent = getLang() === 'th' ? 'EN' : 'ไทย';
}
langBtn?.addEventListener('click', toggleLang);
renderLangLabel();

/* ============================================================
 * DATA — sourced via Tipiṭaka MCP (SuttaCentral CC0)
 * ============================================================ */

// ----- Cetanā 3 phases (commentary tradition) -----
const cetanaData = {
  '1': {
    paliTh: 'ปุพฺพเจตนา',
    paliRoman: 'Pubba-cetanā',
    titleTh: 'เจตนาก่อนให้',
    titleEn: 'Intention before giving',
    bodyTh: 'ก่อนถึงเวลาให้ — เริ่มจาก<b>ศรัทธา</b> คิดที่จะให้ ตระเตรียมของ ตั้งใจอย่างไม่ขัดเคืองและไม่หวังผลตอบ ความเลื่อมใสและความตั้งมั่นในใจช่วงนี้เป็นเหตุให้ทานสะอาดตั้งแต่ต้นน้ำ',
    bodyEn: 'Before the act — beginning with <b>faith</b>: forming the intention, preparing the gift, and reflecting without resentment or expectation. Clarity and resolve at this stage purify the gift at its source.'
  },
  '2': {
    paliTh: 'มุญฺจนเจตนา',
    paliRoman: 'Muñcana-cetanā',
    titleTh: 'เจตนาขณะให้',
    titleEn: 'Intention while giving',
    bodyTh: 'ขณะที่มือวาง — ใจ<b>ปล่อยวาง</b>จริง ๆ ไม่หวง ไม่เสียดาย ไม่ทำเหมือนทิ้งของ "มุญฺจน" แปลว่า "ปล่อย" — เป็นช่วงสำคัญที่สุด เพราะเป็นจุดที่กรรมเกิดขึ้น',
    bodyEn: 'In the moment of releasing — the heart truly <b>lets go</b>: no clinging, no regret, no carelessness. <i>Muñcana</i> means "release". This is the pivotal moment where the deed takes form.'
  },
  '3': {
    paliTh: 'อปรเจตนา',
    paliRoman: 'Apara-cetanā',
    titleTh: 'เจตนาหลังให้',
    titleEn: 'Intention after giving',
    bodyTh: 'หลังการให้ — ระลึกถึงด้วย<b>ความปีติ-อนุโมทนา</b> ไม่เสียดายภายหลัง ไม่ติดอยู่ในความภูมิใจหรือคาดหวัง ตามอรรถกถากล่าวว่าเจตนาช่วงนี้ส่งผลตามไปอีกนาน',
    bodyEn: 'After the act — recollecting it with <b>joy and approval</b>, without regret, pride, or expectation. The commentaries say this aftermath ripples far into the future.'
  }
};

// ----- 8 Grounds for Giving — Dānavatthusutta AN 8.33 -----
const motives = [
  {
    n: 1, level: 'akusala',
    paliRoman: 'Chandā dānaṁ deti',
    paliTh: 'ฉนฺทา ทานํ เทติ',
    titleTh: 'ให้เพราะชอบใจ',
    titleEn: 'Giving out of liking / favoritism',
    glossTh: 'ให้เพราะ<b>รักใคร่ พอใจส่วนตัว</b> เลือกให้คนที่เราชอบ ไม่ได้ดูคุณค่าของผู้รับ — เป็นทานที่ปะปนกับ <i>โลภะ/ฉันทาคติ</i>',
    glossEn: 'Giving out of <b>personal liking</b> — choosing whom to give based on attachment, not the recipient\'s worth. Mixed with <i>greed and bias (chandāgati)</i>.',
    fruitTh: 'ผลทานยังเกิด แต่จิตไม่บริสุทธิ์ ผลจึงไม่กว้างขวาง',
    fruitEn: 'Fruit arises, but mixed with defilement — the result is narrow.'
  },
  {
    n: 2, level: 'akusala',
    paliRoman: 'Dosā dānaṁ deti',
    paliTh: 'โทสา ทานํ เทติ',
    titleTh: 'ให้เพราะชัง',
    titleEn: 'Giving out of hostility',
    glossTh: 'ให้เพราะ<b>ขัดเคือง โกรธ</b> หรือเพื่อให้รีบจากไป "ให้เถอะ จะได้ไม่มากวน" — ปะปนกับ <i>โทสะ</i>',
    glossEn: 'Giving out of <b>hostility or annoyance</b> — "just take it and go". Mixed with <i>aversion (dosa)</i>.',
    fruitTh: 'ผลทานน้อย เพราะจิตในขณะให้ไม่นุ่มนวลด้วยเมตตา',
    fruitEn: 'The result is meagre, since the giving heart is hard, not soft with kindness.'
  },
  {
    n: 3, level: 'akusala',
    paliRoman: 'Mohā dānaṁ deti',
    paliTh: 'โมหา ทานํ เทติ',
    titleTh: 'ให้เพราะหลง',
    titleEn: 'Giving out of delusion',
    glossTh: 'ให้โดย<b>ไม่รู้</b>ว่าให้ไปเพื่ออะไร ไม่รู้ว่าผู้รับเป็นใคร ทำตาม ๆ คนอื่น โดยไม่ใคร่ครวญ — ปะปนกับ <i>โมหะ</i>',
    glossEn: 'Giving in <b>blind ignorance</b>, without understanding the reason or knowing the recipient — copying others without reflection. Mixed with <i>delusion (moha)</i>.',
    fruitTh: 'ผลทานยังคงมี แต่ปัญญาไม่ได้รับการพัฒนา',
    fruitEn: 'Fruit remains, but wisdom is not developed.'
  },
  {
    n: 4, level: 'akusala',
    paliRoman: 'Bhayā dānaṁ deti',
    paliTh: 'ภยา ทานํ เทติ',
    titleTh: 'ให้เพราะกลัว',
    titleEn: 'Giving out of fear',
    glossTh: 'ให้เพราะ<b>กลัว</b> — กลัวภัยจากคนอื่น กลัวบาป กลัวคำว่ากล่าว กลัวเสียหน้า — ปะปนกับ <i>ภยาคติ</i>',
    glossEn: 'Giving out of <b>fear</b> — fear of harm, of bad kamma, of criticism, of losing face. Mixed with <i>fear-bias (bhayāgati)</i>.',
    fruitTh: 'ผลทานเกิด แต่จิตขาดอิสระและความสมัครใจที่บริสุทธิ์',
    fruitEn: 'Fruit arises, but the heart lacks freedom and pure willingness.'
  },
  {
    n: 5, level: 'conventional',
    paliRoman: 'Dinnapubbaṁ katapubbaṁ pitupitāmahehi… dānaṁ deti',
    paliTh: 'ทินฺนปุพฺพํ กตปุพฺพํ ปิตุปิตามเหหิ… ทานํ เทติ',
    titleTh: 'ให้ตามประเพณีปู่ย่า',
    titleEn: 'Giving by family tradition',
    glossTh: '"<b>บิดามารดา ปู่ย่าตายายเคยให้ เคยทำมา</b> เราไม่ควรให้ตระกูลเสื่อม" — เป็นทานที่ดีกว่า ๔ ขั้นแรก เพราะมีกตัญญูและการสืบทอดธรรมเนียมกุศล แต่ยังไม่มีปัญญาส่วนตน',
    glossEn: '<b>"My parents and grandparents practised this; I should not let the family tradition lapse."</b> Better than the first four — rooted in gratitude and continuity — but still without personal insight.',
    fruitTh: 'รักษาตระกูลและประเพณีกุศลไว้ ผลทานเป็นสมบัติมนุษย์-สวรรค์ที่มั่นคง',
    fruitEn: 'Preserves family virtue; the fruit is stable wealth in human and heavenly realms.'
  },
  {
    n: 6, level: 'kusala',
    paliRoman: '…sugatiṁ saggaṁ lokaṁ upapajjissāmīti dānaṁ deti',
    paliTh: '…สุคติํ สคฺคํ โลกํ อุปปชฺชิสฺสามีติ ทานํ เทติ',
    titleTh: 'ให้เพื่อตายแล้วไปสวรรค์',
    titleEn: 'Giving for a heavenly rebirth',
    glossTh: 'ให้โดยคิดว่า "<b>ตายแล้วเราจักได้เกิดในสุคติ สวรรค์</b>" — เป็นเจตนาที่หวังผลในวัฏฏะ ไม่ใช่ของบาป แต่ยังเป็น "ทานติดผล" (สาเปกฺขทาน) ยังพันอยู่กับการเวียนเกิด',
    glossEn: 'Giving with the thought: <b>"After death I will be reborn in a heavenly realm."</b> Not unwholesome, but a result-oriented gift (<i>sāpekkha-dāna</i>) — still bound to the round of rebirth.',
    fruitTh: 'นำไปสู่สุคติภพ สวรรค์ ๖ ชั้น แต่ยังต้องเวียนกลับมา',
    fruitEn: 'Leads to heavenly rebirth, but the wheel of rebirth continues to turn.'
  },
  {
    n: 7, level: 'kusala',
    paliRoman: 'Imaṁ me dānaṁ dadato cittaṁ pasīdatī…ti dānaṁ deti',
    paliTh: 'อิมํ เม ทานํ ททโต จิตฺตํ ปสีทตี…ติ ทานํ เทติ',
    titleTh: 'ให้แล้วจิตเลื่อมใส',
    titleEn: 'Giving because the mind becomes clear',
    glossTh: 'ให้โดย<b>ไม่หวังผลใด</b> แต่รู้ว่า "เมื่อให้แล้วจิตเลื่อมใส โสมนัสเกิดขึ้น" — เป็นทานที่จิตเป็นใหญ่ ใจ<i>ปสาทะ</i> (เลื่อมใส) เกิดเพราะคุณของการสละ',
    glossEn: 'Giving without expectation, knowing only that <b>"as I give, my mind becomes clear and joy arises."</b> The heart\'s confidence (<i>pasāda</i>) is what shines through.',
    fruitTh: 'ผลทานบริสุทธิ์ขึ้น เป็นเหตุให้เข้าถึงสมาธิและกุศลที่ละเอียด',
    fruitEn: 'A purer gift — a basis for samādhi and refined wholesome states.'
  },
  {
    n: 8, level: 'ariya',
    paliRoman: 'Cittālaṅkāra-citta-parikkhāratthaṁ dānaṁ deti',
    paliTh: 'จิตฺตาลงฺการ-จิตฺตปริกฺขารตฺถํ ทานํ เทติ',
    titleTh: 'ให้เพื่อเป็นเครื่องประดับจิต บริขารจิต',
    titleEn: 'Giving as adornment & equipment of the mind',
    glossTh: '<b>ขั้นสูงสุด</b> — ให้ทานเพื่อ "<i>ประดับจิต</i>" (จิตฺตาลงฺการ) และเป็น "<i>เครื่องส่งเสริมจิต</i>" (จิตฺตปริกฺขาร) สำหรับสมถะ-วิปัสสนา ไม่ใช่หวังภพ-ชาติ-ผลใด ๆ ในวัฏฏะ — เป็นทานที่ตั้งใจให้ <b>จาคะ</b> เกิดขึ้นในใจ ละความตระหนี่ เพื่อให้จิตพร้อมเดินทางสู่ <b>นิพพาน</b>',
    glossEn: '<b>The highest rung</b> — giving as an <i>"adornment of the mind" (cittālaṅkāra)</i> and as <i>"equipment of the mind" (citta-parikkhāra)</i> for tranquility and insight. Not aimed at any future birth or worldly result — but to make <b>relinquishment (cāga)</b> arise in the heart, dissolving stinginess, preparing the mind for <b>nibbāna</b>.',
    fruitTh: 'เป็นทานที่ทรงสรรเสริญที่สุด เป็นเหตุปัจจัยให้บรรลุมรรค-ผล-นิพพาน',
    fruitEn: 'The most praised giving — a direct condition for the path, fruit, and nibbāna.'
  }
];

// ----- 14 Recipients — MN 142 Dakkhiṇāvibhaṅgasutta -----
const recipients = [
  { n: 14, tier: 'animal',     paliR: 'Tiracchānagata',                         paliT: 'ติรจฺฉานคต',                       th: 'สัตว์เดรัจฉาน',                                en: 'an animal',                                              mult: '×100' },
  { n: 13, tier: 'puthujjana', paliR: 'Puthujjana-dussīla',                     paliT: 'ปุถุชฺชน-ทุสฺสีล',                  th: 'ปุถุชนทุศีล',                                    en: 'an unethical ordinary person',                           mult: '×1,000' },
  { n: 12, tier: 'puthujjana', paliR: 'Puthujjana-sīlavant',                    paliT: 'ปุถุชฺชน-สีลวนฺต',                  th: 'ปุถุชนผู้มีศีล',                                en: 'an ethical ordinary person',                             mult: '×100,000' },
  { n: 11, tier: 'puthujjana', paliR: 'Bāhiraka-kāmesu-vītarāga',               paliT: 'พาหิรก-กาเมสุ-วีตราค',              th: 'นักบวชนอกพุทธศาสนาผู้ปราศจากกาม',                en: 'an outsider free of sensual desire',                     mult: '×10¹⁰' },
  { n: 10, tier: 'ariya',      paliR: 'Sotāpattiphala-paṭipanna',               paliT: 'โสตาปตฺติผล-ปฏิปนฺน',               th: 'ผู้ปฏิบัติเพื่อโสดาปัตติผล',                     en: 'one practising for stream-entry',                        mult: 'อสงฺเขยฺยา · incalculable' },
  { n: 9,  tier: 'ariya',      paliR: 'Sotāpanna',                              paliT: 'โสตาปนฺน',                          th: 'พระโสดาบัน',                                     en: 'a stream-enterer',                                       mult: '↑ มากกว่า' },
  { n: 8,  tier: 'ariya',      paliR: 'Sakadāgāmiphala-paṭipanna',              paliT: 'สกทาคามิผล-ปฏิปนฺน',                 th: 'ผู้ปฏิบัติเพื่อสกทาคามิผล',                       en: 'one practising for once-return',                        mult: '↑↑' },
  { n: 7,  tier: 'ariya',      paliR: 'Sakadāgāmī',                             paliT: 'สกทาคามี',                          th: 'พระสกทาคามี',                                    en: 'a once-returner',                                        mult: '↑↑' },
  { n: 6,  tier: 'ariya',      paliR: 'Anāgāmiphala-paṭipanna',                 paliT: 'อนาคามิผล-ปฏิปนฺน',                 th: 'ผู้ปฏิบัติเพื่ออนาคามิผล',                       en: 'one practising for non-return',                          mult: '↑↑↑' },
  { n: 5,  tier: 'ariya',      paliR: 'Anāgāmī',                                paliT: 'อนาคามี',                           th: 'พระอนาคามี',                                     en: 'a non-returner',                                         mult: '↑↑↑' },
  { n: 4,  tier: 'ariya',      paliR: 'Arahattaphala-paṭipanna',                paliT: 'อรหตฺตผล-ปฏิปนฺน',                  th: 'ผู้ปฏิบัติเพื่ออรหัตตผล',                        en: 'one practising for arahantship',                         mult: '↑↑↑↑' },
  { n: 3,  tier: 'ariya',      paliR: 'Arahant',                                paliT: 'อรหนฺต',                            th: 'พระอรหันต์',                                     en: 'a perfected one (arahant)',                              mult: '↑↑↑↑' },
  { n: 2,  tier: 'pacceka',    paliR: 'Paccekasambuddha',                       paliT: 'ปจฺเจกสมฺพุทฺธ',                    th: 'พระปัจเจกพุทธเจ้า',                              en: 'a paccekabuddha',                                        mult: '↑↑↑↑↑' },
  { n: 1,  tier: 'buddha',     paliR: 'Tathāgata-arahaṁ-sammāsambuddha',        paliT: 'ตถาคต-อรหํ-สมฺมาสมฺพุทฺธ',          th: 'พระตถาคตอรหันตสัมมาสัมพุทธเจ้า',                  en: 'the Tathāgata, fully awakened Buddha',                  mult: 'สูงสุด · supreme' }
];

// ----- 7 Saṅghadānas — MN 142:7 -----
const sanghaTypes = [
  {
    n: 1,
    paliR: 'Buddhappamukhe ubhatosaṅghe dānaṁ deti',
    paliT: 'พุทฺธปฺปมุเข อุภโตสงฺเฆ ทานํ เทติ',
    th: 'ถวายแก่<b>อุภโตสงฆ์</b> (ภิกษุ + ภิกษุณี) ที่มี<b>พระพุทธเจ้าเป็นประมุข</b>',
    en: 'Offering to <b>both Saṅghas</b> (monks and nuns) <b>headed by the Buddha</b>',
    rank: '★★★★★'
  },
  {
    n: 2,
    paliR: 'Tathāgate parinibbute ubhatosaṅghe dānaṁ deti',
    paliT: 'ตถาคเต ปรินิพฺพุเต อุภโตสงฺเฆ ทานํ เทติ',
    th: 'ถวายแก่อุภโตสงฆ์ <b>หลังพระพุทธเจ้าปรินิพพานแล้ว</b>',
    en: 'Offering to both Saṅghas <b>after the Buddha\'s parinibbāna</b>',
    rank: '★★★★'
  },
  {
    n: 3,
    paliR: 'Bhikkhusaṅghe dānaṁ deti',
    paliT: 'ภิกฺขุสงฺเฆ ทานํ เทติ',
    th: 'ถวายแก่<b>ภิกษุสงฆ์</b>',
    en: 'Offering to <b>the Saṅgha of monks</b>',
    rank: '★★★★'
  },
  {
    n: 4,
    paliR: 'Bhikkhunisaṅghe dānaṁ deti',
    paliT: 'ภิกฺขุนิสงฺเฆ ทานํ เทติ',
    th: 'ถวายแก่<b>ภิกษุณีสงฆ์</b>',
    en: 'Offering to <b>the Saṅgha of nuns</b>',
    rank: '★★★★'
  },
  {
    n: 5,
    paliR: '"Ettakā me bhikkhū ca bhikkhuniyo ca saṅghato uddissathā"ti',
    paliT: '"เอตฺตกา เม ภิกฺขู จ ภิกฺขุนิโย จ สงฺฆโต อุทฺทิสฺสถา"ติ',
    th: 'ขอให้สงฆ์<b>เลือกภิกษุและภิกษุณีจำนวนหนึ่ง</b>มารับ',
    en: 'Asking the Saṅgha to <b>appoint a number of both monks and nuns</b>',
    rank: '★★★'
  },
  {
    n: 6,
    paliR: '"Ettakā me bhikkhū saṅghato uddissathā"ti',
    paliT: '"เอตฺตกา เม ภิกฺขู สงฺฆโต อุทฺทิสฺสถา"ติ',
    th: 'ขอให้สงฆ์<b>เลือกภิกษุจำนวนหนึ่ง</b>มารับ',
    en: 'Asking the Saṅgha to <b>appoint a number of monks</b>',
    rank: '★★★'
  },
  {
    n: 7,
    paliR: '"Ettakā me bhikkhuniyo saṅghato uddissathā"ti',
    paliT: '"เอตฺตกา เม ภิกฺขุนิโย สงฺฆโต อุทฺทิสฺสถา"ติ',
    th: 'ขอให้สงฆ์<b>เลือกภิกษุณีจำนวนหนึ่ง</b>มารับ',
    en: 'Asking the Saṅgha to <b>appoint a number of nuns</b>',
    rank: '★★★'
  }
];

// ----- Velāma Ladder — AN 9.20 -----
const velamaSteps = [
  { kind: 'velama', th: 'มหาทานของเวลามพราหมณ์ (๘๔,๐๐๐ ถาดทอง ฯลฯ)',                                en: "Velāma's vast offering (84,000 gold dishes, etc.)",                  pali: 'Velāmassa mahādānaṁ' },
  { th: 'เลี้ยง <b>ผู้ถึงพร้อมด้วยทิฐิ</b> (โสดาบัน) ๑ องค์',                                          en: 'Feed <b>one accomplished in view</b> (stream-enterer)',              pali: 'Diṭṭhisampanna' },
  { th: 'เลี้ยง <b>โสดาบัน ๑๐๐</b> องค์',                                                              en: 'Feed <b>100 stream-enterers</b>',                                    pali: 'Sataṁ diṭṭhisampannānaṁ' },
  { th: 'เลี้ยง <b>พระสกทาคามี ๑</b> องค์',                                                            en: 'Feed <b>one once-returner</b>',                                      pali: 'Sakadāgāmiṁ' },
  { th: 'เลี้ยง <b>พระอนาคามี ๑</b> องค์',                                                             en: 'Feed <b>one non-returner</b>',                                       pali: 'Anāgāmiṁ' },
  { th: 'เลี้ยง <b>พระอรหันต์ ๑</b> องค์',                                                             en: 'Feed <b>one arahant</b>',                                            pali: 'Arahantaṁ' },
  { th: 'เลี้ยง <b>พระปัจเจกพุทธเจ้า ๑</b> องค์',                                                       en: 'Feed <b>one paccekabuddha</b>',                                      pali: 'Paccekabuddhaṁ' },
  { th: 'เลี้ยง <b>พระตถาคตสัมมาสัมพุทธเจ้า</b>',                                                       en: 'Feed <b>the Tathāgata, fully awakened Buddha</b>',                   pali: 'Tathāgataṁ sammāsambuddhaṁ' },
  { th: 'เลี้ยง <b>ภิกษุสงฆ์ที่มีพระพุทธเจ้าเป็นประมุข</b>',                                              en: 'Feed <b>the Saṅgha headed by the Buddha</b>',                        pali: 'Buddhappamukhaṁ bhikkhusaṅghaṁ' },
  { th: 'สร้าง <b>วิหารถวายสงฆ์ ๔ ทิศ</b>',                                                              en: 'Build <b>a dwelling for the Saṅgha of the four quarters</b>',         pali: 'Cātuddisaṁ saṅghaṁ uddissa vihāraṁ' },
  { th: '<b>ถึงพระรัตนตรัยเป็นสรณะ</b>ด้วยจิตเลื่อมใส',                                                  en: '<b>Go for refuge</b> to the Triple Gem with confident heart',         pali: 'Pasannacitto saraṇaṁ gaccheyya' },
  { th: '<b>สมาทานศีล ๕</b>',                                                                          en: '<b>Undertake the five training rules</b>',                            pali: 'Sikkhāpadāni samādiyeyya' },
  { th: '<b>เจริญเมตตาจิต</b> แม้ชั่วเวลารีดนมโคหนึ่งครั้ง',                                              en: '<b>Develop a heart of loving-kindness</b> — even briefly',           pali: 'Mettacittaṁ bhāveyya' },
  { kind: 'peak', th: '<b>เจริญอนิจจสัญญา</b> แม้ชั่วลัดนิ้วมือเดียว — ผลใหญ่ที่สุด',                       en: '<b>Develop the perception of impermanence</b> — even for a finger-snap. The supreme fruit.', pali: 'Aniccasaññaṁ accharāsaṅghātamattaṁ' }
];

/* ============================================================
 * RENDERERS
 * ============================================================ */

// ----- Cetanā timeline -----
const cetanaPanel = document.getElementById('cetanaPanel');
const cetanaNodes = document.querySelectorAll('.cetana-node');
let activeCetana = null;

function renderCetanaPanel() {
  if (!activeCetana) {
    cetanaPanel.innerHTML = `
      <div class="cetana-panel__hint">
        <span data-lang-th>👆 คลิกแต่ละจุดเพื่อดูรายละเอียด</span>
        <span data-lang-en>👆 Click each phase to see details</span>
      </div>`;
    return;
  }
  const d = cetanaData[activeCetana];
  const lang = getLang();
  cetanaPanel.innerHTML = `
    <div class="cetana-panel__title">${lang === 'th' ? d.titleTh : d.titleEn}</div>
    <div class="cetana-panel__pali">${lang === 'th' ? d.paliTh : d.paliRoman}</div>
    <div>${lang === 'th' ? d.bodyTh : d.bodyEn}</div>
  `;
}

cetanaNodes.forEach(node => {
  node.addEventListener('click', () => {
    activeCetana = node.dataset.cetana;
    cetanaNodes.forEach(n => n.classList.toggle('cetana-node--active', n === node));
    renderCetanaPanel();
  });
});
renderCetanaPanel();

// ----- 8-step ladder -----
const ladderSteps = document.getElementById('ladderSteps');
const ladderPanel = document.getElementById('ladderPanel');
let activeMotive = null;

function renderLadderSteps() {
  const lang = getLang();
  ladderSteps.innerHTML = motives.map(m => `
    <button class="ladder-step ${activeMotive === m.n ? 'ladder-step--active' : ''}"
            data-motive="${m.n}" data-level="${m.level}">
      <div class="ladder-step__num">${m.n}</div>
      <div class="ladder-step__body">
        <div class="ladder-step__pali">${lang === 'th' ? m.paliTh : m.paliRoman}</div>
        <div class="ladder-step__title">${lang === 'th' ? m.titleTh : m.titleEn}</div>
      </div>
    </button>
  `).join('');
  ladderSteps.querySelectorAll('.ladder-step').forEach(btn => {
    btn.addEventListener('click', () => {
      activeMotive = parseInt(btn.dataset.motive, 10);
      renderLadderSteps();
      renderLadderPanel();
    });
  });
}

function renderLadderPanel() {
  if (!activeMotive) {
    const lang = getLang();
    ladderPanel.innerHTML = `<div class="ladder-panel__hint">${
      lang === 'th'
        ? '👆 คลิกที่ขั้นบันไดเพื่อดูรายละเอียด'
        : '👆 Click a step to see details'
    }</div>`;
    return;
  }
  const m = motives.find(x => x.n === activeMotive);
  const lang = getLang();
  const fruitLabel = lang === 'th' ? 'ผล:' : 'Fruit:';
  ladderPanel.innerHTML = `
    <div>
      <span class="ladder-panel__num">${m.n}</span>
      <span class="ladder-panel__title">${lang === 'th' ? m.titleTh : m.titleEn}</span>
    </div>
    <div class="ladder-panel__pali">${lang === 'th' ? m.paliTh : m.paliRoman}</div>
    <div class="ladder-panel__gloss">${lang === 'th' ? m.glossTh : m.glossEn}</div>
    <div class="ladder-panel__fruit">
      <span class="ladder-panel__fruit-label">${fruitLabel}</span>
      <span>${lang === 'th' ? m.fruitTh : m.fruitEn}</span>
    </div>
  `;
}
renderLadderSteps();
renderLadderPanel();

// ----- 14 Recipients table -----
const recipTable = document.getElementById('recipTable');
function renderRecipTable() {
  const lang = getLang();
  const headTh = ['#', 'ผู้รับ', 'บาลี', 'ผลที่พึงคาดหมาย'];
  const headEn = ['#', 'Recipient', 'Pali', 'Expected return'];
  const heads = lang === 'th' ? headTh : headEn;
  recipTable.innerHTML = `
    <thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>
      ${recipients.map(r => `
        <tr class="tier-${r.tier}">
          <td>${r.n}</td>
          <td>${lang === 'th' ? r.th : r.en}</td>
          <td class="pali-cell">${lang === 'th' ? r.paliT : r.paliR}</td>
          <td class="mult">${r.mult}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}
renderRecipTable();

// ----- 7 Saṅghadānas table -----
const sanghaTable = document.getElementById('sanghaTable');
function renderSanghaTable() {
  const lang = getLang();
  const heads = lang === 'th'
    ? ['#', 'ระดับ', 'สังฆทาน', 'บาลี']
    : ['#', 'Rank', 'Saṅghadāna', 'Pali'];
  sanghaTable.innerHTML = `
    <thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>
      ${sanghaTypes.map(s => `
        <tr class="${s.n === 1 ? 'tier-buddha' : s.n <= 4 ? 'tier-pacceka' : 'tier-ariya'}">
          <td>${s.n}</td>
          <td class="mult">${s.rank}</td>
          <td>${lang === 'th' ? s.th : s.en}</td>
          <td class="pali-cell">${lang === 'th' ? s.paliT : s.paliR}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}
renderSanghaTable();

// ----- Velāma ladder -----
const velamaLadder = document.getElementById('velamaLadder');
function renderVelama() {
  const lang = getLang();
  velamaLadder.innerHTML = velamaSteps.map((s, i) => {
    const cls = s.kind === 'velama'
      ? 'velama-rung--velama'
      : s.kind === 'peak' ? 'velama-rung--peak' : '';
    const rank = s.kind === 'velama' ? '★' : `${i}`;
    return `
      <div class="velama-rung ${cls}">
        <div class="velama-rung__rank">${rank}</div>
        <div>${lang === 'th' ? s.th : s.en}</div>
        <div class="velama-rung__pali">${s.pali}</div>
      </div>
    `;
  }).join('');
}
renderVelama();

// ----- Re-render all dynamic blocks on language change -----
document.addEventListener('langchange', () => {
  renderLangLabel();
  renderCetanaPanel();
  renderLadderSteps();
  renderLadderPanel();
  renderRecipTable();
  renderSanghaTable();
  renderVelama();
});
