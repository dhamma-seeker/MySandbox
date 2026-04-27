import { getLang, setLang, toggleLang, initLang, t } from './i18n.js';

initLang();

const SVG_NS = 'http://www.w3.org/2000/svg';

const state = {
  manifest: null,
  activeCategory: null,
  shuffledOrder: null,
};

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

function svgEl(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createBilingualText(th, en) {
  const frag = document.createDocumentFragment();
  frag.append(
    el('span', { 'data-lang-th': '' }, th),
    el('span', { 'data-lang-en': '' }, en)
  );
  return frag;
}

function findCategory(id) {
  return state.manifest.categories?.find(c => c.id === id);
}

function getDescendantCategories(catId) {
  const result = new Set([catId]);
  const cats = state.manifest.categories || [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const c of cats) {
      if (!result.has(c.id) && c.parents?.some(p => result.has(p))) {
        result.add(c.id);
        changed = true;
      }
    }
  }
  return result;
}

function getFilteredSandboxes() {
  const { manifest, activeCategory } = state;
  if (!activeCategory) return manifest.sandboxes;
  const matching = getDescendantCategories(activeCategory);
  return manifest.sandboxes.filter(sb => matching.has(sb.category));
}

// ===== Graph layout (radial, static) =====

function computeGraphLayout() {
  const { categories = [], sandboxes } = state.manifest;
  const topCats = categories.filter(c => !c.parents || c.parents.length === 0);
  const childrenOf = (catId) => categories.filter(c => c.parents?.includes(catId));
  const sandboxesOf = (catId) => sandboxes.filter(sb => sb.category === catId);

  const W = 600, H = 420;
  const cx = W / 2, cy = H / 2;
  const r1 = 78, r2 = 142, r3 = 192;

  const N = topCats.length || 1;
  const sliceSize = (2 * Math.PI) / N;

  const nodes = [];
  const edges = [];

  for (let i = 0; i < topCats.length; i++) {
    const topCat = topCats[i];
    const midAngle = -Math.PI / 2 + sliceSize * i;

    nodes.push({
      id: topCat.id,
      type: 'category',
      data: topCat,
      x: cx + r1 * Math.cos(midAngle),
      y: cy + r1 * Math.sin(midAngle),
      depth: 1,
      color: topCat.color,
    });

    const subs = childrenOf(topCat.id);
    const directSbs = sandboxesOf(topCat.id);
    const items = [...subs, ...directSbs];
    const M = items.length;
    if (M === 0) continue;

    const itemSpread = Math.min(sliceSize * 0.7, Math.PI * 0.55);
    const startA = midAngle - itemSpread / 2;

    items.forEach((item, j) => {
      const a = M === 1 ? midAngle : startA + (itemSpread * j / (M - 1));
      const isSubCat = 'parents' in item;

      if (isSubCat) {
        nodes.push({
          id: item.id,
          type: 'category',
          data: item,
          x: cx + r2 * Math.cos(a),
          y: cy + r2 * Math.sin(a),
          depth: 2,
          color: item.color,
        });
        edges.push({ from: topCat.id, to: item.id });

        const subSbs = sandboxesOf(item.id);
        const subM = subSbs.length;
        const subSpread = Math.min(itemSpread / Math.max(M, 1) * 0.9, Math.PI * 0.38);
        const subStart = a - subSpread / 2;

        subSbs.forEach((sb, k) => {
          const sa = subM === 1 ? a : subStart + (subSpread * k / (subM - 1));
          nodes.push({
            id: sb.id,
            type: 'sandbox',
            data: sb,
            x: cx + r3 * Math.cos(sa),
            y: cy + r3 * Math.sin(sa),
            color: item.color,
            categoryId: item.id,
          });
          edges.push({ from: item.id, to: sb.id });
        });
      } else {
        nodes.push({
          id: item.id,
          type: 'sandbox',
          data: item,
          x: cx + r2 * Math.cos(a),
          y: cy + r2 * Math.sin(a),
          color: topCat.color,
          categoryId: topCat.id,
        });
        edges.push({ from: topCat.id, to: item.id });
      }
    });
  }

  return { nodes, edges, width: W, height: H };
}

function buildGraph() {
  const layout = computeGraphLayout();
  const { nodes, edges, width, height } = layout;
  const idMap = new Map(nodes.map(n => [n.id, n]));

  const matchingCats = state.activeCategory
    ? getDescendantCategories(state.activeCategory)
    : null;
  const isMatched = (node) => {
    if (!matchingCats) return true;
    if (node.type === 'category') return matchingCats.has(node.id);
    return matchingCats.has(node.categoryId);
  };

  const svg = svgEl('svg', {
    class: 'kgraph',
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    'aria-label': t({ th: 'แผนที่หัวข้อในระบบ', en: 'Knowledge map of topics' }),
  });

  for (const ed of edges) {
    const a = idMap.get(ed.from);
    const b = idMap.get(ed.to);
    if (!a || !b) continue;
    const dim = !(isMatched(a) && isMatched(b));
    svg.append(svgEl('line', {
      class: 'kgraph__edge' + (dim ? ' kgraph__edge--dim' : ''),
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
    }));
  }

  for (const node of nodes) {
    const dim = !isMatched(node);
    const dimCls = dim ? ' kgraph__node--dim' : '';

    if (node.type === 'category') {
      const radius = node.depth === 1 ? 24 : 19;
      const isActive = state.activeCategory === node.id;
      const activeCls = isActive ? ' kgraph__node--active' : '';

      const g = svgEl('g', {
        class: 'kgraph__node kgraph__node--cat' + dimCls + activeCls,
        role: 'button',
        tabindex: '0',
        transform: `translate(${node.x}, ${node.y})`,
        onclick: () => onCategoryClick(node.id),
        onkeydown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCategoryClick(node.id);
          }
        },
      });
      g.append(svgEl('circle', {
        r: radius,
        fill: node.color,
        class: 'kgraph__cat-circle',
      }));
      g.append(svgEl('text', {
        y: radius + 18,
        'text-anchor': 'middle',
        class: 'kgraph__cat-label',
      }, t(node.data.label)));
      g.append(svgEl('title', {}, t(node.data.label)));
      svg.append(g);
    } else {
      const g = svgEl('g', {
        class: 'kgraph__node kgraph__node--sb' + dimCls,
        role: 'link',
        tabindex: '0',
        transform: `translate(${node.x}, ${node.y})`,
        onclick: () => { window.location.href = node.data.path; },
        onkeydown: (e) => {
          if (e.key === 'Enter') window.location.href = node.data.path;
        },
      });
      g.append(svgEl('circle', {
        r: 19,
        fill: '#fff',
        stroke: node.color,
        'stroke-width': '2.5',
        class: 'kgraph__sb-circle',
      }));
      g.append(svgEl('text', {
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        class: 'kgraph__sb-icon',
      }, node.data.icon));
      g.append(svgEl('title', {}, `${node.data.icon} ${t(node.data.title)}`));
      svg.append(g);
    }
  }

  return svg;
}

function onCategoryClick(catId) {
  if (state.activeCategory === catId) {
    state.activeCategory = null;
    state.shuffledOrder = null;
  } else {
    state.activeCategory = catId;
    state.shuffledOrder = shuffle(getFilteredSandboxes()).map(sb => sb.id);
  }
  render();

  requestAnimationFrame(() => {
    const items = document.querySelectorAll('.feed__item');
    const target = state.activeCategory ? items[1] : items[0];
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

// ===== UI builders =====

function buildFilterBadge() {
  const total = state.manifest.sandboxes.length;
  if (!state.activeCategory) {
    return el('div', { class: 'filter-badge filter-badge--all' },
      createBilingualText(
        `${total} หัวข้อ · เลื่อนลงเพื่อดูทั้งหมด`,
        `${total} topics · scroll to browse all`
      )
    );
  }
  const cat = findCategory(state.activeCategory);
  const filtered = getFilteredSandboxes();
  return el('div', { class: 'filter-badge filter-badge--active' },
    el('span', { class: 'filter-badge__dot', style: `background:${cat.color}` }),
    createBilingualText(
      `กรอง: ${t(cat.label)} (${filtered.length}) · คลิกหมวดเดิมเพื่อล้าง`,
      `Filter: ${t(cat.label)} (${filtered.length}) · click again to clear`
    )
  );
}

function buildHero() {
  const card = el('div', { class: 'card welcome welcome--hero' },
    el('h1', {}, createBilingualText('MySandbox', 'MySandbox')),
    el('p', {}, createBilingualText(
      'แผนที่ความรู้ — คลิกหมวดในกราฟเพื่อกรองเนื้อหา',
      'Knowledge map — click a category to filter content'
    )),
    buildFilterBadge(),
    buildGraph()
  );
  return el('section', { class: 'feed__item feed__item--hero' }, card);
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

function render() {
  const feed = document.getElementById('feed');
  const menu = document.getElementById('drawer-list');

  feed.innerHTML = '';
  feed.append(buildHero());

  const filtered = getFilteredSandboxes();
  let displayList;
  if (state.activeCategory && state.shuffledOrder) {
    const byId = new Map(filtered.map(sb => [sb.id, sb]));
    displayList = state.shuffledOrder.map(id => byId.get(id)).filter(Boolean);
  } else {
    displayList = filtered;
  }

  for (const sb of displayList) feed.append(buildFeedItem(sb));

  menu.innerHTML = '';
  for (const sb of state.manifest.sandboxes) menu.append(buildMenuItem(sb));

  renderLangLabel();
}

async function bootFeed() {
  state.manifest = await loadManifest();
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
