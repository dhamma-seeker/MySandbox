const LANG_KEY = 'mysandbox.lang';

export function getLang() {
  return localStorage.getItem(LANG_KEY) || 'th';
}

export function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.setAttribute('lang', lang);
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function toggleLang() {
  setLang(getLang() === 'th' ? 'en' : 'th');
}

export function initLang() {
  document.documentElement.setAttribute('lang', getLang());
}

export function t(obj) {
  const lang = getLang();
  return obj[lang] ?? obj.en ?? obj.th ?? '';
}
