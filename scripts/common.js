/* =========================================================
   MARÉ — 通用脚本：购物车、Header、Toast、价格格式化
   ========================================================= */

(function () {
  'use strict';

  // ---------- 工具 ----------
  const STORAGE_KEY = 'mare_cart_v1';

  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
    window.dispatchEvent(new CustomEvent('mare:cart-change'));
  }

  function getCart() {
    return readCart();
  }

  function getCartCount() {
    return readCart().reduce((s, i) => s + (i.qty || 0), 0);
  }

  function getCartSubtotal() {
    return readCart().reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);
  }

  function findProduct(id) {
    return (window.MARE_PRODUCTS || []).find((p) => p.id === id);
  }

  function addToCart({ productId, size, qty }) {
    const product = findProduct(productId);
    if (!product) return;
    qty = Math.max(1, qty || 1);
    const cart = readCart();
    const key = productId + '__' + size;
    const existing = cart.find((i) => i.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key,
        productId,
        size,
        qty,
        name: product.name,
        category: product.categoryLabel,
        color: product.color,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image
      });
    }
    writeCart(cart);
    showToast(`已加入购物袋 · ${product.name}`);
  }

  function updateCartQty(key, qty) {
    const cart = readCart();
    const item = cart.find((i) => i.key === key);
    if (!item) return;
    item.qty = Math.max(1, qty);
    writeCart(cart);
  }

  function removeFromCart(key) {
    const cart = readCart().filter((i) => i.key !== key);
    writeCart(cart);
  }

  function clearCart() {
    writeCart([]);
  }

  function formatPrice(n) {
    if (typeof n !== 'number' || isNaN(n)) return '';
    return n.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
  }

  function priceHTML(price, oldPrice) {
    let html = `<span class="pc-currency">¥</span>${formatPrice(price)}`;
    if (oldPrice && oldPrice > price) {
      html += `<span class="pc-old">¥${formatPrice(oldPrice)}</span>`;
    }
    return html;
  }

  // ---------- 购物车计数 ----------
  function updateCartCount() {
    const count = getCartCount();
    document.querySelectorAll('[data-cart-count]').forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  // ---------- Toast ----------
  let toastTimer = null;
  function showToast(msg) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = `<span class="toast-mark">✓</span><span class="toast-msg"></span>`;
      document.body.appendChild(el);
    }
    el.querySelector('.toast-msg').textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // ---------- 全局 Header ----------
  function injectHeader() {
    const slot = document.querySelector('[data-site-header]');
    if (!slot) return;
    const html = `
      <header class="site-header">
        <div class="container">
          <nav class="nav">
            <a href="/index.html" class="brand" aria-label="MARÉ 首页">
              MARÉ
              <span class="brand-dot" aria-hidden="true"></span>
              <span class="brand-sub">EST. 2024</span>
            </a>
            <ul class="nav-links">
              <li><a href="/index.html" data-nav="home">首页</a></li>
              <li><a href="/index.html#shop" data-nav="shop">购物</a></li>
              <li><a href="/index.html#journal" data-nav="journal">杂志</a></li>
              <li><a href="/index.html#about" data-nav="about">关于</a></li>
            </ul>
            <div class="nav-actions">
              <button class="icon-btn" data-action="search-toggle" aria-label="搜索">
                ${iconSearch()}
              </button>
              <a href="/cart.html" class="icon-btn" aria-label="购物袋">
                ${iconBag()}
                <span class="cart-count" data-cart-count>0</span>
              </a>
              <button class="mobile-toggle icon-btn" data-action="mobile-toggle" aria-label="菜单">
                ${iconMenu()}
              </button>
            </div>
          </nav>
          <div class="search-bar" data-search-bar>
            <div class="search-input-wrap">
              ${iconSearch()}
              <input type="text" placeholder="搜索单品、面料或风格 ⋯" data-search-input />
              <button class="search-close" data-action="search-close">关闭</button>
            </div>
          </div>
          <div class="mobile-menu" data-mobile-menu>
            <ul>
              <li><a href="/index.html">首页</a></li>
              <li><a href="/index.html#shop">购物</a></li>
              <li><a href="/index.html#journal">杂志</a></li>
              <li><a href="/index.html#about">关于</a></li>
              <li><a href="/cart.html">购物袋</a></li>
            </ul>
          </div>
        </div>
      </header>
    `;
    slot.outerHTML = html;
    bindHeaderEvents();
    updateCartCount();
    markActiveNav();
  }

  function bindHeaderEvents() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;
      const bar = document.querySelector('[data-search-bar]');
      const menu = document.querySelector('[data-mobile-menu]');
      if (action === 'search-toggle') {
        bar && bar.classList.toggle('open');
        if (bar && bar.classList.contains('open')) {
          const inp = bar.querySelector('input');
          setTimeout(() => inp && inp.focus(), 80);
        }
      } else if (action === 'search-close') {
        bar && bar.classList.remove('open');
      } else if (action === 'mobile-toggle') {
        menu && menu.classList.toggle('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('[data-search-input]')) {
        const q = e.target.value.trim();
        if (q) {
          window.location.href = `/index.html?q=${encodeURIComponent(q)}#shop`;
        }
      }
      if (e.key === 'Escape') {
        const bar = document.querySelector('[data-search-bar]');
        bar && bar.classList.remove('open');
      }
    });
  }

  function markActiveNav() {
    const path = location.pathname;
    document.querySelectorAll('.nav-links a').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (path.endsWith('index.html') || path === '/') {
        if (href.includes('index.html') && !href.includes('#')) a.classList.add('active');
      }
    });
  }

  // ---------- Footer ----------
  function injectFooter() {
    const slot = document.querySelector('[data-site-footer]');
    if (!slot) return;
    const year = new Date().getFullYear();
    slot.outerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="footer-brand">MARÉ<span class="brand-dot"></span></div>
              <p class="footer-tagline">
                "把整个夏天的阳光，<br/>叠进你的衣柜里。"
              </p>
              <p style="font-size: 13px; color: rgba(255,255,255,0.5); letter-spacing: 0.05em;">
                从地中海海岸到你的城市 · 平均 5 个工作日
              </p>
            </div>
            <div class="footer-col">
              <h4>购物</h4>
              <ul>
                <li><a href="/index.html#shop">全部单品</a></li>
                <li><a href="/index.html?cat=dress#shop">连衣裙</a></li>
                <li><a href="/index.html?cat=shirts#shop">衬衫</a></li>
                <li><a href="/index.html?cat=accessories#shop">配饰</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>服务</h4>
              <ul>
                <li><a href="javascript:void(0)">配送与退换</a></li>
                <li><a href="javascript:void(0)">尺码指南</a></li>
                <li><a href="javascript:void(0)">面料保养</a></li>
                <li><a href="javascript:void(0)">联系我们</a></li>
              </ul>
            </div>
            <div class="footer-col">
              <h4>关于 MARÉ</h4>
              <ul>
                <li><a href="javascript:void(0)">品牌故事</a></li>
                <li><a href="javascript:void(0)">可持续宣言</a></li>
                <li><a href="javascript:void(0)">门店地址</a></li>
                <li><a href="javascript:void(0)">加入我们</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} MARÉ ATELIER · ALL RIGHTS RESERVED</span>
            <span>FROM THE MEDITERRANEAN COAST, WITH LOVE</span>
          </div>
        </div>
      </footer>
    `;
  }

  // ---------- 图标 ----------
  function iconSearch() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`;
  }
  function iconBag() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
  }
  function iconMenu() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>`;
  }
  function iconHeart() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
  }
  function iconPlus() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;
  }
  function iconMinus() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`;
  }
  function iconClose() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
  }
  function iconArrow() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
  }

  // ---------- 商品卡片渲染 ----------
  function renderProductCard(p) {
    const badgeHTML = p.badge
      ? `<span class="pc-badge ${p.badge === 'NEW' ? 'badge-new' : ''}">${p.badge}</span>`
      : '';
    return `
      <a href="/product.html?id=${p.id}" class="product-card">
        <div class="pc-media">
          ${badgeHTML}
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <span class="pc-quick" aria-hidden="true">${iconArrow()}</span>
        </div>
        <div class="pc-info">
          <div class="pc-meta">
            <div class="pc-cat">${p.categoryLabel}</div>
            <div class="pc-name">${p.name}</div>
          </div>
          <div class="pc-price">${priceHTML(p.price, p.oldPrice)}</div>
        </div>
      </a>
    `;
  }

  // ---------- 暴露 API ----------
  window.MARE = {
    getCart,
    getCartCount,
    getCartSubtotal,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    findProduct,
    formatPrice,
    priceHTML,
    showToast,
    renderProductCard,
    icons: {
      search: iconSearch,
      bag: iconBag,
      menu: iconMenu,
      heart: iconHeart,
      plus: iconPlus,
      minus: iconMinus,
      close: iconClose,
      arrow: iconArrow
    }
  };

  // ---------- 启动 ----------
  document.addEventListener('DOMContentLoaded', () => {
    injectHeader();
    injectFooter();
    updateCartCount();
  });

  window.addEventListener('mare:cart-change', updateCartCount);
})();
