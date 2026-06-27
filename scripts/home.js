/* =========================================================
   MARÉ — 首页脚本：分类、搜索、排序、热门
   ========================================================= */

(function () {
  'use strict';

  const products = window.MARE_PRODUCTS || [];
  const cats = window.MARE_CATEGORIES || [];

  const state = {
    category: 'all',
    keyword: '',
    sort: 'default'
  };

  // ---------- 渲染分类 ----------
  function renderCategories() {
    const wrap = document.querySelector('[data-cat-grid]');
    if (!wrap) return;
    wrap.innerHTML = cats
      .map(
        (c) => `
        <button class="cat-btn ${c.key === state.category ? 'active' : ''}" data-cat="${c.key}">
          <span class="cat-en">${c.desc}</span>
          <span class="cat-zh">${c.label}</span>
        </button>
      `
      )
      .join('');

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      state.category = btn.dataset.cat;
      renderCategories();
      renderShop();
      const top = document.getElementById('shop');
      if (top) top.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------- 筛选 + 排序 ----------
  function getFiltered() {
    let list = products.slice();
    if (state.category !== 'all') {
      list = list.filter((p) => p.category === state.category);
    }
    if (state.keyword) {
      const k = state.keyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(k) ||
          (p.categoryLabel || '').toLowerCase().includes(k) ||
          (p.color || '').toLowerCase().includes(k) ||
          (p.desc || '').toLowerCase().includes(k)
      );
    }

    switch (state.sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // editor pick: hot first then new
        list.sort((a, b) => {
          const sa = (a.hot ? 2 : 0) + (a.isNew ? 1 : 0);
          const sb = (b.hot ? 2 : 0) + (b.isNew ? 1 : 0);
          return sb - sa;
        });
    }
    return list;
  }

  // ---------- 渲染商品 ----------
  function renderShop() {
    const grid = document.querySelector('[data-product-grid]');
    const empty = document.querySelector('[data-empty]');
    const cnt = document.querySelector('[data-result-count]');
    const tag = document.querySelector('[data-result-tag]');
    if (!grid) return;
    const list = getFiltered();
    cnt.textContent = list.length;

    if (tag) {
      const parts = [];
      const cat = cats.find((c) => c.key === state.category);
      if (cat && state.category !== 'all') parts.push(`· ${cat.label}`);
      if (state.keyword) parts.push(`· "${state.keyword}"`);
      tag.textContent = parts.join(' ');
      tag.style.display = parts.length ? '' : 'none';
    }

    if (list.length === 0) {
      grid.innerHTML = '';
      grid.style.display = 'none';
      empty.style.display = '';
      return;
    }
    grid.style.display = '';
    empty.style.display = 'none';
    grid.innerHTML = list.map((p) => window.MARE.renderProductCard(p)).join('');
  }

  // ---------- 热门推荐 ----------
  function renderHot() {
    const featureEl = document.querySelector('[data-hot-feature]');
    const listEl = document.querySelector('[data-hot-list]');
    if (!featureEl || !listEl) return;
    const hot = products.filter((p) => p.hot).slice(0, 5);
    if (hot.length === 0) return;

    const feature = hot[0];
    featureEl.href = `/product.html?id=${feature.id}`;
    featureEl.querySelector('img').src = feature.image;
    featureEl.querySelector('img').alt = feature.name;

    listEl.innerHTML = hot
      .map(
        (p, i) => `
        <a class="hot-row" href="/product.html?id=${p.id}">
          <span class="hr-num">0${i + 1}</span>
          <img class="hr-img" src="${p.image}" alt="${p.name}" loading="lazy" />
          <div class="hr-info">
            <div class="hr-cat">${p.categoryLabel} · ${p.color}</div>
            <div class="hr-name">${p.name}</div>
          </div>
          <div class="hr-price">${window.MARE.priceHTML(p.price, null)}</div>
        </a>
      `
      )
      .join('');
  }

  // ---------- 排序 / 搜索 接线 ----------
  function bindControls() {
    const sortEl = document.querySelector('[data-sort]');
    if (sortEl) {
      sortEl.addEventListener('change', (e) => {
        state.sort = e.target.value;
        renderShop();
      });
    }

    // 来自 Header 的搜索框
    const searchInput = document.querySelector('[data-search-input]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.keyword = e.target.value.trim();
        renderShop();
      });
    }
  }

  // ---------- 处理 URL ?q= / ?cat= ----------
  function applyQueryString() {
    const url = new URL(location.href);
    const q = url.searchParams.get('q');
    const cat = url.searchParams.get('cat');
    if (q) {
      state.keyword = q;
      const inp = document.querySelector('[data-search-input]');
      const bar = document.querySelector('[data-search-bar]');
      if (inp) inp.value = q;
      if (bar) bar.classList.add('open');
    }
    if (cat) {
      state.category = cat;
    }
  }

  // ---------- 启动 ----------
  function boot() {
    applyQueryString();
    renderCategories();
    renderShop();
    renderHot();
    bindControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
