import { getLang, setLang, toggleLang, initLang, t } from './i18n.js';

initLang();

async function loadManifest() {
  const res = await fetch('./manifest.json');
  return res.json();
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

function buildFeedItem(sb) {
  const card = el('div', { class: 'card' },
    el('div', { class: 'card__icon' }, sb.icon),
    el('div', { class: 'card__title' }, t(sb.title)),
    el('div', { class: 'card__subtitle' }, t(sb.subtitle)),
    el('div', { class: 'card__desc' }, t(sb.description)),
    el('div', { class: 'card__tags' },
      ...sb.tags.map(tag => el('span', { class: 'tag' }, tag))
    ),
    el('a', { class: 'btn-primary', href: sb.path },
      t({ th: 'เปิดแซนด์บ็อกซ์', en: 'Open sandbox' }),
      ' →'
    )
  );
  return el('section', { class: 'feed__item', 'data-id': sb.id }, card);
}

function buildWelcome(count) {
  const card = el('div', { class: 'card welcome' },
    el('h1', {},
      createBilingualText('MySandbox', 'MySandbox')
    ),
    el('p', {},
      createBilingualText(
        'ห้องทดลองเชิงโต้ตอบสำหรับเรียนรู้',
        'Interactive learning experiments'
      )
    ),
    el('span', { class: 'counter' },
      createBilingualText(`มี ${count} หัวข้อ`, `${count} topics available`)
    )
  );
  return el('section', { class: 'feed__item' }, card);
}

function createBilingualText(th, en) {
  const frag = document.createDocumentFragment();
  frag.append(
    el('span', { 'data-lang-th': '' }, th),
    el('span', { 'data-lang-en': '' }, en)
  );
  return frag;
}

function buildMenuItem(sb) {
  return el('a', { class: 'drawer__item', href: sb.path },
    el('div', { class: 'drawer__item-title' },
      el('span', {}, sb.icon),
      el('span', {}, t(sb.title))
    ),
    el('div', { class: 'drawer__item-desc' }, t(sb.subtitle))
  );
}

function renderLangLabel() {
  const btn = document.querySelector('.lang-btn');
  if (btn) btn.textContent = getLang() === 'th' ? 'EN' : 'ไทย';
}

async function bootFeed() {
  const { sandboxes } = await loadManifest();
  const feed = document.getElementById('feed');
  const menu = document.getElementById('drawer-list');

  function render() {
    feed.innerHTML = '';
    feed.append(buildWelcome(sandboxes.length));
    for (const sb of sandboxes) feed.append(buildFeedItem(sb));

    menu.innerHTML = '';
    for (const sb of sandboxes) menu.append(buildMenuItem(sb));

    renderLangLabel();
  }

  render();
  document.addEventListener('langchange', render);
}

function wireUpChrome() {
  const langBtn = document.querySelector('.lang-btn');
  const menuBtn = document.querySelector('.menu-btn');
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('backdrop');
  const drawerClose = document.querySelector('.drawer-close');

  langBtn?.addEventListener('click', toggleLang);

  function openMenu() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
  }
  function closeMenu() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }
  menuBtn?.addEventListener('click', openMenu);
  drawerClose?.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('langchange', renderLangLabel);
  renderLangLabel();
}

wireUpChrome();
if (document.getElementById('feed')) bootFeed();

export { t, getLang, setLang, toggleLang };
