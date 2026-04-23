// Pattern data for candlestick sandbox.
// Each candle is {o, h, l, c} with values on an arbitrary price scale (roughly 30-70).
// Constraint: h >= max(o,c), l <= min(o,c).

export const CATEGORIES = {
  single: { th: 'แท่งเดียว', en: 'Single candle' },
  two:    { th: '2 แท่ง',    en: 'Two candles' },
  three:  { th: '3 แท่ง',    en: 'Three candles' },
  cont:   { th: 'ต่อเนื่อง (Continuation)', en: 'Continuation' },
};

export const BIAS = {
  bullish: { th: 'ขาขึ้น',     en: 'Bullish', color: '#10b981' },
  bearish: { th: 'ขาลง',      en: 'Bearish', color: '#ef4444' },
  neutral: { th: 'ไม่ชัดเจน',  en: 'Indecision', color: '#6b7280' },
};

export const PATTERNS = [
  // ===== SINGLE =====
  {
    id: 'doji', category: 'single', bias: 'neutral', reliability: 2,
    name: { th: 'โดจิ (Doji)', en: 'Doji' },
    candles: [{ o: 50, h: 58, l: 42, c: 50.2 }],
    context: { before: 'any', after: 'neutral' },
    description: {
      th: 'แท่งที่ราคาเปิดและปิดใกล้เคียงกันมาก มีไส้เทียนทั้งบนและล่าง สื่อถึงความลังเลของตลาด',
      en: 'Open and close nearly equal, with wicks on both sides. Signals indecision between buyers and sellers.',
    },
    psychology: {
      th: 'ผู้ซื้อและผู้ขายมีกำลังพอๆ กัน ไม่มีฝ่ายใดครอบงำ มักเป็นสัญญาณเตือนการกลับตัวเมื่อปรากฏหลังเทรนด์ชัดเจน',
      en: 'Buyers and sellers are in balance. Often a reversal warning when appearing after a strong trend.',
    },
    signal: {
      th: 'รอการยืนยันด้วยแท่งถัดไป หาก Doji ปรากฏที่ยอด/ก้น ของเทรนด์อาจเตือนการกลับตัว',
      en: 'Wait for confirmation. A doji at trend extremes may warn of a reversal.',
    },
  },
  {
    id: 'dragonfly-doji', category: 'single', bias: 'bullish', reliability: 3,
    name: { th: 'โดจิแมลงปอ (Dragonfly Doji)', en: 'Dragonfly Doji' },
    candles: [{ o: 60, h: 60.3, l: 38, c: 60 }],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'Doji ที่มีไส้ด้านล่างยาว ไม่มีไส้ด้านบน เปิดและปิดใกล้จุดสูงสุดของวัน',
      en: 'Doji with a long lower shadow and no upper shadow; opens and closes near the high.',
    },
    psychology: {
      th: 'ผู้ขายพยายามกดราคาลง แต่ผู้ซื้อกลับมาดันกลับจนราคาปิดใกล้จุดเปิด เป็นสัญญาณการกลับตัวขาขึ้นที่แรง',
      en: 'Sellers pushed price down, but buyers reclaimed control, closing at the open. A strong bullish reversal signal.',
    },
    signal: {
      th: 'ปรากฏที่ก้นเทรนด์ขาลง ให้เฝ้าดูแท่งเขียวถัดไปเพื่อยืนยันการกลับตัว',
      en: 'Appearing at the bottom of a downtrend — wait for a bullish follow-through to confirm.',
    },
  },
  {
    id: 'gravestone-doji', category: 'single', bias: 'bearish', reliability: 3,
    name: { th: 'โดจิหินสลัก (Gravestone Doji)', en: 'Gravestone Doji' },
    candles: [{ o: 40, h: 62, l: 39.7, c: 40 }],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'Doji ที่มีไส้ด้านบนยาว ไม่มีไส้ด้านล่าง เปิดและปิดใกล้จุดต่ำสุดของวัน',
      en: 'Doji with a long upper shadow and no lower shadow; opens and closes near the low.',
    },
    psychology: {
      th: 'ผู้ซื้อพยายามดันราคาขึ้น แต่ถูกผู้ขายตีกลับจนราคาปิดที่จุดเปิด เป็นสัญญาณการกลับตัวขาลง',
      en: 'Buyers pushed higher but sellers forced price back to the open. A bearish reversal signal.',
    },
    signal: {
      th: 'พบที่ยอดเทรนด์ขาขึ้น ให้จับตาแท่งแดงถัดไปเพื่อยืนยัน',
      en: 'At the top of an uptrend — look for a bearish follow-through to confirm.',
    },
  },
  {
    id: 'hammer', category: 'single', bias: 'bullish', reliability: 4,
    name: { th: 'ค้อน (Hammer)', en: 'Hammer' },
    candles: [{ o: 54, h: 57, l: 38, c: 56 }],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'แท่งที่มีตัวเล็กอยู่ด้านบน ไส้ด้านล่างยาวอย่างน้อย 2 เท่าของตัวแท่ง แทบไม่มีไส้ด้านบน',
      en: 'Small body near the top with a lower shadow at least 2× body length, minimal upper shadow.',
    },
    psychology: {
      th: 'ระหว่างวันถูกกดลงไปลึก แต่ผู้ซื้อเข้ามาดันกลับจนปิดใกล้จุดสูง — แสดงการปฏิเสธราคาต่ำ',
      en: 'Price sold off sharply during the day, then buyers stepped in and lifted it back. Rejection of lower prices.',
    },
    signal: {
      th: 'สัญญาณ bullish reversal แรง ต้องอยู่ในเทรนด์ขาลงก่อน จึงจะนับเป็น Hammer ที่แท้จริง',
      en: 'A strong bullish reversal only valid after a downtrend. Confirm with the next green candle.',
    },
  },
  {
    id: 'inverted-hammer', category: 'single', bias: 'bullish', reliability: 3,
    name: { th: 'ค้อนกลับหัว (Inverted Hammer)', en: 'Inverted Hammer' },
    candles: [{ o: 44, h: 60, l: 42, c: 45.5 }],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'ตัวเล็กอยู่ด้านล่าง ไส้ด้านบนยาว ไส้ด้านล่างสั้น',
      en: 'Small body near the bottom with a long upper shadow and little lower shadow.',
    },
    psychology: {
      th: 'ผู้ซื้อพยายามดันราคาขึ้น แม้จะไม่สำเร็จในวันนั้น แต่แสดงว่าแรงซื้อเริ่มกลับมา',
      en: 'Buyers tried to push prices higher; though they failed that day, buying pressure is starting to appear.',
    },
    signal: {
      th: 'ต้องอยู่ที่ก้นเทรนด์ขาลง และรอยืนยันด้วยแท่งเขียวถัดไป',
      en: 'Must appear at the bottom of a downtrend. Wait for a bullish confirmation candle.',
    },
  },
  {
    id: 'hanging-man', category: 'single', bias: 'bearish', reliability: 3,
    name: { th: 'คนแขวนคอ (Hanging Man)', en: 'Hanging Man' },
    candles: [{ o: 55, h: 57, l: 40, c: 54 }],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'รูปร่างเหมือน Hammer แต่ปรากฏที่ยอดของเทรนด์ขาขึ้น — เตือนการกลับตัว',
      en: 'Same shape as Hammer but appears at the top of an uptrend — a warning of reversal.',
    },
    psychology: {
      th: 'แม้จะปิดใกล้จุดสูง แต่ระหว่างวันมีแรงขายลึก แสดงว่าผู้ขายเริ่มเข้ามา',
      en: 'Despite closing near the high, the deep intraday drop shows sellers are starting to appear.',
    },
    signal: {
      th: 'สัญญาณ bearish ต้องยืนยันด้วยแท่งแดงถัดไปที่ทะลุต่ำลง',
      en: 'Bearish signal — confirm with a follow-through red candle closing lower.',
    },
  },
  {
    id: 'shooting-star', category: 'single', bias: 'bearish', reliability: 4,
    name: { th: 'ดาวตก (Shooting Star)', en: 'Shooting Star' },
    candles: [{ o: 46, h: 62, l: 44, c: 45 }],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'ตัวเล็กอยู่ด้านล่าง ไส้ด้านบนยาว ปรากฏที่ยอดเทรนด์ขาขึ้น',
      en: 'Small body near the bottom with a long upper shadow, appearing at the top of an uptrend.',
    },
    psychology: {
      th: 'ผู้ซื้อดันราคาขึ้นสูง แต่ถูกผู้ขายตีกลับลงมาอย่างแรง สัญญาณกลับตัวขาลง',
      en: 'Buyers pushed price up, but sellers rejected it decisively. A bearish reversal signal.',
    },
    signal: {
      th: 'Bearish reversal แรง ต้องอยู่ที่ยอดเทรนด์ขาขึ้น',
      en: 'Strong bearish reversal. Must appear at the top of an uptrend.',
    },
  },
  {
    id: 'bullish-marubozu', category: 'single', bias: 'bullish', reliability: 4,
    name: { th: 'มารูโบซุขาขึ้น (Bullish Marubozu)', en: 'Bullish Marubozu' },
    candles: [{ o: 40, h: 60, l: 40, c: 60 }],
    context: { before: 'any', after: 'continuation_up' },
    description: {
      th: 'แท่งเขียวเต็มตัว ไม่มีไส้ทั้งบนและล่าง — ผู้ซื้อควบคุมตลาดตลอดวัน',
      en: 'A full green candle with no wicks — buyers were in full control all session.',
    },
    psychology: {
      th: 'แรงซื้อทรงพลังตั้งแต่เปิดจนปิด ไม่มีช่วงที่ผู้ขายสามารถกดราคาลงได้',
      en: 'Strong buying pressure from open to close, with sellers unable to push back at any point.',
    },
    signal: {
      th: 'สัญญาณแรงของเทรนด์ขาขึ้น หรือการเริ่มต้นการกลับตัว',
      en: 'A strong bullish signal, indicating trend continuation or the start of a reversal.',
    },
  },
  {
    id: 'bearish-marubozu', category: 'single', bias: 'bearish', reliability: 4,
    name: { th: 'มารูโบซุขาลง (Bearish Marubozu)', en: 'Bearish Marubozu' },
    candles: [{ o: 60, h: 60, l: 40, c: 40 }],
    context: { before: 'any', after: 'continuation_down' },
    description: {
      th: 'แท่งแดงเต็มตัว ไม่มีไส้ทั้งบนและล่าง — ผู้ขายควบคุมตลาดตลอดวัน',
      en: 'A full red candle with no wicks — sellers were in full control all session.',
    },
    psychology: {
      th: 'แรงขายทรงพลังตั้งแต่เปิดจนปิด ไม่มีช่วงที่ผู้ซื้อสามารถดันราคาขึ้นได้',
      en: 'Strong selling pressure from open to close, with buyers unable to push back at any point.',
    },
    signal: {
      th: 'สัญญาณแรงของเทรนด์ขาลง หรือการเริ่มต้นการกลับตัวลง',
      en: 'A strong bearish signal, indicating trend continuation or the start of a reversal down.',
    },
  },
  {
    id: 'spinning-top', category: 'single', bias: 'neutral', reliability: 2,
    name: { th: 'ลูกข่าง (Spinning Top)', en: 'Spinning Top' },
    candles: [{ o: 50, h: 60, l: 40, c: 48 }],
    context: { before: 'any', after: 'neutral' },
    description: {
      th: 'ตัวเล็ก ไส้ด้านบนและด้านล่างใกล้เคียงกัน สื่อถึงความลังเล',
      en: 'Small body with upper and lower shadows of similar length, signaling indecision.',
    },
    psychology: {
      th: 'ทั้งฝ่ายซื้อและฝ่ายขายต่อสู้กันระหว่างวัน แต่ไม่มีใครชนะชัดเจน',
      en: 'Buyers and sellers battled throughout the day, but neither side won decisively.',
    },
    signal: {
      th: 'สัญญาณ pause ของเทรนด์ หรืออาจเป็นจุดเปลี่ยน ต้องดู pattern ต่อเนื่อง',
      en: 'A pause in the trend, possibly preceding a reversal. Wait for follow-up patterns.',
    },
  },

  // ===== TWO CANDLES =====
  {
    id: 'bullish-engulfing', category: 'two', bias: 'bullish', reliability: 5,
    name: { th: 'Bullish Engulfing', en: 'Bullish Engulfing' },
    candles: [
      { o: 54, h: 56, l: 47, c: 48 },
      { o: 47, h: 60, l: 45, c: 58 },
    ],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'แท่งเขียวใหญ่กลืนแท่งแดงเล็กก่อนหน้าไว้ทั้งหมด (ตัวแท่ง)',
      en: 'A large green candle completely engulfs the body of the previous smaller red candle.',
    },
    psychology: {
      th: 'ผู้ขายควบคุมช่วงแรก แต่ผู้ซื้อเข้ามาอย่างท่วมท้นและกลับทิศทั้งหมดในวันเดียว',
      en: 'Sellers controlled early, but buyers overwhelmed them and reversed the entire prior move in a single day.',
    },
    signal: {
      th: 'สัญญาณ bullish reversal ที่แรงที่สุดตัวหนึ่ง ปรากฏที่ก้นเทรนด์ขาลง',
      en: 'One of the strongest bullish reversal signals. Appears at the bottom of a downtrend.',
    },
  },
  {
    id: 'bearish-engulfing', category: 'two', bias: 'bearish', reliability: 5,
    name: { th: 'Bearish Engulfing', en: 'Bearish Engulfing' },
    candles: [
      { o: 46, h: 56, l: 45, c: 54 },
      { o: 55, h: 57, l: 40, c: 42 },
    ],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'แท่งแดงใหญ่กลืนแท่งเขียวเล็กก่อนหน้าไว้ทั้งหมด',
      en: 'A large red candle completely engulfs the body of the previous smaller green candle.',
    },
    psychology: {
      th: 'ผู้ซื้อควบคุมช่วงแรก แต่ผู้ขายเข้ามาอย่างรุนแรงและกดราคาลงทั้งหมด',
      en: 'Buyers controlled early, but sellers overwhelmed them and drove prices down decisively.',
    },
    signal: {
      th: 'Bearish reversal แรง ปรากฏที่ยอดเทรนด์ขาขึ้น',
      en: 'A strong bearish reversal signal at the top of an uptrend.',
    },
  },
  {
    id: 'piercing-line', category: 'two', bias: 'bullish', reliability: 4,
    name: { th: 'Piercing Line', en: 'Piercing Line' },
    candles: [
      { o: 58, h: 59, l: 45, c: 47 },
      { o: 45, h: 55, l: 44, c: 53 },
    ],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'แท่งแดงใหญ่ ตามด้วยแท่งเขียวที่เปิดต่ำกว่า แต่ปิดเกินครึ่งของแท่งแดง',
      en: 'A large red candle followed by a green one that opens lower but closes above the midpoint of the red.',
    },
    psychology: {
      th: 'ตลาดเปิด gap ลง แต่ผู้ซื้อกลับมาและดันราคาเกินครึ่งของแท่งก่อน — แรงซื้อแข็งแรง',
      en: 'Market opened with a gap down, but buyers returned and recovered more than half the prior loss.',
    },
    signal: {
      th: 'สัญญาณ bullish reversal ระดับกลาง ที่ก้นเทรนด์ขาลง',
      en: 'A moderate bullish reversal signal at the bottom of a downtrend.',
    },
  },
  {
    id: 'dark-cloud-cover', category: 'two', bias: 'bearish', reliability: 4,
    name: { th: 'Dark Cloud Cover', en: 'Dark Cloud Cover' },
    candles: [
      { o: 42, h: 55, l: 40, c: 53 },
      { o: 55, h: 56, l: 44, c: 46 },
    ],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'แท่งเขียวใหญ่ ตามด้วยแท่งแดงที่เปิด gap ขึ้นแต่ปิดต่ำกว่ากึ่งกลางของแท่งเขียว',
      en: 'A large green candle followed by a red one that gaps up but closes below the midpoint of the green.',
    },
    psychology: {
      th: 'ตลาดเปิดด้วย optimism แต่ผู้ขายเข้ามากดราคาลงลึก — แรงขายเริ่มเข้ามา',
      en: 'Market opened optimistic, but sellers drove prices down sharply. Selling pressure is emerging.',
    },
    signal: {
      th: 'Bearish reversal ระดับกลาง ที่ยอดเทรนด์ขาขึ้น',
      en: 'A moderate bearish reversal signal at the top of an uptrend.',
    },
  },
  {
    id: 'bullish-harami', category: 'two', bias: 'bullish', reliability: 3,
    name: { th: 'Bullish Harami', en: 'Bullish Harami' },
    candles: [
      { o: 60, h: 61, l: 42, c: 43 },
      { o: 49, h: 53, l: 48, c: 52 },
    ],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'แท่งแดงใหญ่ ตามด้วยแท่งเขียวเล็กที่อยู่ภายใน body ของแท่งก่อนหน้า',
      en: 'A large red candle followed by a small green candle fully inside the prior body.',
    },
    psychology: {
      th: 'เทรนด์ขาลงชะลอตัว แรงขายเริ่มอ่อน การยืนตัวของผู้ซื้อเล็กๆ สื่อถึงการกลับตัวที่อาจเกิดขึ้น',
      en: 'Downtrend momentum is slowing. Small buying hint suggests a possible reversal.',
    },
    signal: {
      th: 'สัญญาณ reversal อ่อน ต้องรอยืนยันด้วยแท่งถัดไป',
      en: 'A weak reversal signal. Confirm with the next candle.',
    },
  },
  {
    id: 'bearish-harami', category: 'two', bias: 'bearish', reliability: 3,
    name: { th: 'Bearish Harami', en: 'Bearish Harami' },
    candles: [
      { o: 40, h: 58, l: 39, c: 57 },
      { o: 51, h: 53, l: 47, c: 48 },
    ],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'แท่งเขียวใหญ่ ตามด้วยแท่งแดงเล็กที่อยู่ภายใน body ของแท่งก่อนหน้า',
      en: 'A large green candle followed by a small red candle fully inside the prior body.',
    },
    psychology: {
      th: 'โมเมนตัมขาขึ้นเริ่มอ่อนแรง ผู้ซื้อไม่สามารถรักษาระดับได้',
      en: 'Uptrend momentum is fading; buyers fail to maintain their prior strength.',
    },
    signal: {
      th: 'สัญญาณ reversal อ่อน รอแท่งแดงถัดไปยืนยัน',
      en: 'A weak reversal signal. Wait for a follow-up red candle for confirmation.',
    },
  },
  {
    id: 'tweezer-bottom', category: 'two', bias: 'bullish', reliability: 3,
    name: { th: 'Tweezer Bottom', en: 'Tweezer Bottom' },
    candles: [
      { o: 54, h: 56, l: 40, c: 42 },
      { o: 43, h: 55, l: 40, c: 53 },
    ],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'แท่งแดงตามด้วยแท่งเขียวที่มี low เท่ากัน — ทดสอบแนวรับเดียวกันสองครั้งและดีดกลับ',
      en: 'A red candle followed by a green candle with the same low — testing support twice and rebounding.',
    },
    psychology: {
      th: 'ผู้ขายไม่สามารถกดราคาต่ำกว่าแนวรับที่ทดสอบก่อนหน้าได้ สัญญาณที่ผู้ซื้อกำลังเข้ายึดครอง',
      en: 'Sellers could not push below the previously tested support — buyers are reclaiming control.',
    },
    signal: {
      th: 'สัญญาณ bullish reversal ระดับกลาง ที่ก้นเทรนด์',
      en: 'A moderate bullish reversal at the bottom of a downtrend.',
    },
  },
  {
    id: 'tweezer-top', category: 'two', bias: 'bearish', reliability: 3,
    name: { th: 'Tweezer Top', en: 'Tweezer Top' },
    candles: [
      { o: 46, h: 60, l: 44, c: 58 },
      { o: 57, h: 60, l: 46, c: 48 },
    ],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'แท่งเขียวตามด้วยแท่งแดงที่มี high เท่ากัน — ทดสอบแนวต้านเดียวกันและตกลง',
      en: 'A green candle followed by a red candle with the same high — testing resistance twice and falling.',
    },
    psychology: {
      th: 'ผู้ซื้อไม่สามารถทะลุแนวต้านได้ ผู้ขายเริ่มเข้ายึดครอง',
      en: 'Buyers failed to break above resistance — sellers are stepping in.',
    },
    signal: {
      th: 'สัญญาณ bearish reversal ที่ยอดเทรนด์',
      en: 'A bearish reversal at the top of an uptrend.',
    },
  },

  // ===== THREE CANDLES =====
  {
    id: 'morning-star', category: 'three', bias: 'bullish', reliability: 5,
    name: { th: 'Morning Star', en: 'Morning Star' },
    candles: [
      { o: 58, h: 60, l: 45, c: 46 },
      { o: 44, h: 46, l: 42, c: 43 },
      { o: 45, h: 60, l: 44, c: 58 },
    ],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'แท่งแดงใหญ่ → แท่งเล็ก (body เล็ก/Doji) → แท่งเขียวใหญ่ที่ปิดกลางของแท่งแรก',
      en: 'Large red → small-bodied candle (or Doji) → large green closing into the first candle’s body.',
    },
    psychology: {
      th: 'แรงขายหมดแล้ว แท่งเล็กแสดงความลังเล จากนั้นผู้ซื้อเข้ามาอย่างแข็งแกร่ง',
      en: 'Selling exhausted, indecision in the middle, then buyers step in with conviction.',
    },
    signal: {
      th: 'Bullish reversal ที่เชื่อถือได้สูง — หนึ่งในสัญญาณกลับตัวที่แข็งแกร่งที่สุด',
      en: 'One of the most reliable bullish reversal signals.',
    },
  },
  {
    id: 'evening-star', category: 'three', bias: 'bearish', reliability: 5,
    name: { th: 'Evening Star', en: 'Evening Star' },
    candles: [
      { o: 42, h: 55, l: 40, c: 54 },
      { o: 56, h: 58, l: 54, c: 57 },
      { o: 55, h: 56, l: 41, c: 42 },
    ],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'แท่งเขียวใหญ่ → แท่งเล็ก → แท่งแดงใหญ่ที่ปิดกลางแท่งแรก',
      en: 'Large green → small-bodied candle → large red closing into the first candle’s body.',
    },
    psychology: {
      th: 'แรงซื้อหมดแล้ว แท่งเล็กแสดงความลังเล จากนั้นผู้ขายเข้ามาอย่างรุนแรง',
      en: 'Buying exhausted, indecision, then sellers take control decisively.',
    },
    signal: {
      th: 'Bearish reversal ที่เชื่อถือได้สูงที่สุดตัวหนึ่ง',
      en: 'One of the most reliable bearish reversal signals.',
    },
  },
  {
    id: 'three-white-soldiers', category: 'three', bias: 'bullish', reliability: 5,
    name: { th: 'Three White Soldiers', en: 'Three White Soldiers' },
    candles: [
      { o: 40, h: 50, l: 38, c: 48 },
      { o: 47, h: 56, l: 46, c: 54 },
      { o: 53, h: 62, l: 52, c: 60 },
    ],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'แท่งเขียวสามตัวต่อเนื่อง แต่ละตัวเปิดภายใน body ของตัวก่อนหน้าและปิดสูงขึ้น',
      en: 'Three consecutive green candles, each opening within the prior body and closing higher.',
    },
    psychology: {
      th: 'ผู้ซื้อควบคุมตลาดอย่างต่อเนื่อง แสดงแรงซื้อที่แข็งแกร่งและยั่งยืน',
      en: 'Buyers maintain steady control — strong and sustained buying pressure.',
    },
    signal: {
      th: 'สัญญาณ bullish reversal/continuation ที่แรง',
      en: 'A strong bullish reversal or continuation signal.',
    },
  },
  {
    id: 'three-black-crows', category: 'three', bias: 'bearish', reliability: 5,
    name: { th: 'Three Black Crows', en: 'Three Black Crows' },
    candles: [
      { o: 58, h: 60, l: 50, c: 52 },
      { o: 53, h: 55, l: 44, c: 46 },
      { o: 47, h: 49, l: 38, c: 40 },
    ],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'แท่งแดงสามตัวต่อเนื่อง แต่ละตัวเปิดภายใน body ของตัวก่อนหน้าและปิดต่ำลง',
      en: 'Three consecutive red candles, each opening within the prior body and closing lower.',
    },
    psychology: {
      th: 'ผู้ขายควบคุมอย่างต่อเนื่อง แรงขายยั่งยืน',
      en: 'Sellers maintain control — sustained selling pressure.',
    },
    signal: {
      th: 'Bearish reversal/continuation ที่แรง',
      en: 'A strong bearish reversal or continuation signal.',
    },
  },
  {
    id: 'three-inside-up', category: 'three', bias: 'bullish', reliability: 4,
    name: { th: 'Three Inside Up', en: 'Three Inside Up' },
    candles: [
      { o: 58, h: 60, l: 42, c: 44 },
      { o: 48, h: 54, l: 46, c: 52 },
      { o: 52, h: 62, l: 50, c: 60 },
    ],
    context: { before: 'downtrend', after: 'reversal_up' },
    description: {
      th: 'Bullish Harami ตามด้วยแท่งเขียวที่ปิดสูงกว่าแท่งแรก — ยืนยันการกลับตัวขาขึ้น',
      en: 'A Bullish Harami followed by a green candle closing above the first candle’s open — confirming a reversal.',
    },
    psychology: {
      th: 'Harami บอกว่าเทรนด์ชะลอ แท่งเขียวที่สามยืนยันการกลับตัว',
      en: 'The Harami signals slowing momentum; the third candle confirms the reversal.',
    },
    signal: {
      th: 'Bullish reversal ที่ได้รับการยืนยันแล้ว',
      en: 'A confirmed bullish reversal.',
    },
  },
  {
    id: 'three-inside-down', category: 'three', bias: 'bearish', reliability: 4,
    name: { th: 'Three Inside Down', en: 'Three Inside Down' },
    candles: [
      { o: 42, h: 58, l: 40, c: 56 },
      { o: 52, h: 54, l: 46, c: 48 },
      { o: 48, h: 50, l: 38, c: 40 },
    ],
    context: { before: 'uptrend', after: 'reversal_down' },
    description: {
      th: 'Bearish Harami ตามด้วยแท่งแดงที่ปิดต่ำกว่าแท่งแรก — ยืนยันการกลับตัวขาลง',
      en: 'A Bearish Harami followed by a red candle closing below the first candle’s open — confirming a reversal.',
    },
    psychology: {
      th: 'Harami บอกว่าเทรนด์ขึ้นชะลอ แท่งแดงที่สามยืนยันการกลับตัว',
      en: 'The Harami signals slowing uptrend; the third candle confirms the reversal.',
    },
    signal: {
      th: 'Bearish reversal ที่ยืนยันแล้ว',
      en: 'A confirmed bearish reversal.',
    },
  },

  // ===== CONTINUATION =====
  {
    id: 'rising-three-methods', category: 'cont', bias: 'bullish', reliability: 4,
    name: { th: 'Rising Three Methods', en: 'Rising Three Methods' },
    candles: [
      { o: 40, h: 60, l: 38, c: 58 },
      { o: 56, h: 58, l: 50, c: 52 },
      { o: 52, h: 55, l: 48, c: 50 },
      { o: 50, h: 53, l: 46, c: 48 },
      { o: 48, h: 65, l: 47, c: 63 },
    ],
    context: { before: 'uptrend', after: 'continuation_up' },
    description: {
      th: 'แท่งเขียวใหญ่ ตามด้วยแท่งเล็ก 3 ตัวที่อยู่ในช่วงของแท่งแรก แล้วแท่งเขียวใหญ่ที่ทะลุสูงกว่า',
      en: 'A large green, three small candles inside its range, then a large green closing above the first.',
    },
    psychology: {
      th: 'เทรนด์ขาขึ้นพักตัวสั้นๆ แล้วกลับมาดำเนินต่อ — ผู้ซื้อยังคงควบคุม',
      en: 'A brief consolidation in an uptrend, then continuation — buyers remain in control.',
    },
    signal: {
      th: 'Bullish continuation ที่เชื่อถือได้',
      en: 'A reliable bullish continuation pattern.',
    },
  },
  {
    id: 'falling-three-methods', category: 'cont', bias: 'bearish', reliability: 4,
    name: { th: 'Falling Three Methods', en: 'Falling Three Methods' },
    candles: [
      { o: 62, h: 64, l: 40, c: 42 },
      { o: 44, h: 50, l: 43, c: 48 },
      { o: 48, h: 52, l: 46, c: 50 },
      { o: 50, h: 54, l: 48, c: 52 },
      { o: 52, h: 53, l: 35, c: 37 },
    ],
    context: { before: 'downtrend', after: 'continuation_down' },
    description: {
      th: 'แท่งแดงใหญ่ ตามด้วยแท่งเล็ก 3 ตัวที่ดีดขึ้นเล็กน้อย แล้วแท่งแดงใหญ่ที่ทะลุต่ำกว่า',
      en: 'A large red, three small up-candles inside its range, then a large red closing below the first.',
    },
    psychology: {
      th: 'เทรนด์ขาลงพักตัวขึ้นสั้นๆ แล้วกลับมาดำเนินต่อ — ผู้ขายยังคงควบคุม',
      en: 'A brief upward pause in a downtrend, then continuation — sellers remain in control.',
    },
    signal: {
      th: 'Bearish continuation ที่เชื่อถือได้',
      en: 'A reliable bearish continuation pattern.',
    },
  },
];
