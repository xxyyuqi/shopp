/* =========================================================
   MARÉ — 商品详情页脚本
   ========================================================= */

(function () {
  'use strict';

  const state = {
    product: null,
    activeImage: 0,
    selectedSize: null,
    qty: 1
  };

  function init() {
    const id = new URL(location.href).searchParams.get('id');
    const product = window.MARE.findProduct(id);
    if (!product) {
      renderNotFound();
      return;
    }
    state.product = product;
    // 默认选第一个有货尺码
    const firstInStock = product.sizes.find((s) => s.stock > 0);
    state.selectedSize = firstInStock ? firstInStock.label : product.sizes[0].label;
    renderCrumbs(product);
    renderPage(product);
    renderRelated(product);
    document.title = `${product.name} · MARÉ`;
  }

  function renderNotFound() {
    document.querySelector('[data-pd-root]').innerHTML = `
      <div class="cart-empty" style="grid-column: 1 / -1;">
        <div class="empty-fig">404</div>
        <div class="empty-title">没有找到这件单品</div>
        <p class="empty-desc">链接可能已过期，或者它已经被某位幸运的客人带走了。</p>
        <a class="btn btn-primary" href="/index.html">回到主页 →</a>
      </div>
    `;
  }

  function renderCrumbs(p) {
    const wrap = document.querySelector('[data-crumbs]');
    wrap.innerHTML = `
      <li><a href="/index.html">首页</a></li>
      <li><a href="/index.html?cat=${p.category}#shop">${p.categoryLabel}</a></li>
      <li>${p.name}</li>
    `;
  }

  function renderPage(p) {
    const root = document.querySelector('[data-pd-root]');
    const gallery = p.gallery && p.gallery.length ? p.gallery : [p.image];
    const totalStock = p.sizes.reduce((s, x) => s + x.stock, 0);
    const stockClass = totalStock === 0 ? 'no-stock' : totalStock <= 5 ? 'low-stock' : 'in-stock';
    const stockText =
      totalStock === 0
        ? '暂时缺货 · 即将补货'
        : totalStock <= 5
          ? `仅剩 ${totalStock} 件 · 售完为止`
          : `现货 ${totalStock} 件 · 可立即发货`;

    const saving = p.oldPrice ? p.oldPrice - p.price : 0;

    root.innerHTML = `
      <div class="pd-gallery">
        <div class="pd-main">
          ${p.badge ? `<span class="pd-badge">${p.badge}</span>` : ''}
          <img data-pd-main src="${gallery[0]}" alt="${p.name}" />
        </div>
        <div class="pd-thumbs">
          ${gallery
            .map(
              (src, i) =>
                `<button class="pd-thumb ${i === 0 ? 'active' : ''}" data-thumb="${i}">
                  <img src="${src}" alt="${p.name} - ${i + 1}" loading="lazy" />
                </button>`
            )
            .join('')}
        </div>
      </div>

      <div class="pd-info">
        <div class="pd-cat">${p.categoryLabel}</div>
        <h1 class="pd-title">${p.name}</h1>

        <div class="pd-pricing">
          <div class="pd-price"><span class="pd-currency">¥</span>${window.MARE.formatPrice(p.price)}</div>
          ${
            p.oldPrice
              ? `<div class="pd-old-price">¥${window.MARE.formatPrice(p.oldPrice)}</div>
                 <div class="pd-save">立省 ¥${window.MARE.formatPrice(saving)}</div>`
              : ''
          }
        </div>

        <p class="pd-desc">${p.desc}</p>

        <div class="pd-block">
          <div class="block-label">
            <span class="label-key">颜色</span>
            <span class="label-val">${p.color}</span>
          </div>
          <div class="pd-color">
            <span class="swatch" aria-hidden="true"></span>
            <span style="font-size: 13px; color: var(--c-muted);">${p.color}</span>
          </div>
        </div>

        <div class="pd-block">
          <div class="block-label">
            <span class="label-key">尺码</span>
            <span class="label-link" data-size-guide>查看尺码指南</span>
          </div>
          <div class="size-grid" data-size-grid>
            ${p.sizes
              .map(
                (s) =>
                  `<button class="size-btn ${s.label === state.selectedSize ? 'selected' : ''}" 
                           data-size="${s.label}" ${s.stock === 0 ? 'disabled' : ''}>
                    ${s.label}
                  </button>`
              )
              .join('')}
          </div>
          <div class="stock-note ${stockClass}" data-stock>
            <span class="stock-dot" aria-hidden="true"></span>
            <span data-stock-text>${stockText}</span>
          </div>
        </div>

        <div class="pd-block">
          <div class="block-label">
            <span class="label-key">数量</span>
          </div>
          <div class="qty-row">
            <div class="qty-stepper">
              <button data-qty-dec aria-label="减少">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
              </button>
              <span class="qty-num" data-qty>1</span>
              <button data-qty-inc aria-label="增加">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="cta-row">
          <button class="btn btn-primary" data-add-cart ${totalStock === 0 ? 'disabled' : ''}>
            ${totalStock === 0 ? '已售罄' : '加入购物袋'}
          </button>
          <button class="btn-icon-square" data-wishlist aria-label="加入收藏">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
          </button>
        </div>

        <div class="pd-details">
          <h4>面料与细节</h4>
          <ul>
            ${p.details.map((d) => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <div class="pd-details">
          <h4>配送与退换</h4>
          <ul>
            <li>满 ¥599 全国包邮（偏远地区除外）</li>
            <li>支持 30 天无理由退换货</li>
            <li>所有订单均经过两次品控检查后发货</li>
          </ul>
        </div>
      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    const root = document.querySelector('[data-pd-root]');
    const p = state.product;

    // 缩略图切换
    root.querySelectorAll('[data-thumb]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = parseInt(btn.dataset.thumb, 10);
        state.activeImage = i;
        root.querySelectorAll('[data-thumb]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const mainImg = root.querySelector('[data-pd-main]');
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = (p.gallery && p.gallery[i]) || p.image;
          mainImg.style.opacity = '1';
        }, 180);
      });
    });

    // 尺码选择
    root.querySelectorAll('[data-size]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        state.selectedSize = btn.dataset.size;
        root.querySelectorAll('[data-size]').forEach((b) => b.classList.remove('selected'));
        btn.classList.add('selected');
        const size = p.sizes.find((s) => s.label === state.selectedSize);
        updateStockText(size);
        state.qty = 1;
        root.querySelector('[data-qty]').textContent = '1';
      });
    });

    // 数量
    const decBtn = root.querySelector('[data-qty-dec]');
    const incBtn = root.querySelector('[data-qty-inc]');
    const qtyEl = root.querySelector('[data-qty]');
    decBtn.addEventListener('click', () => {
      if (state.qty > 1) {
        state.qty -= 1;
        qtyEl.textContent = state.qty;
      }
    });
    incBtn.addEventListener('click', () => {
      const size = p.sizes.find((s) => s.label === state.selectedSize);
      const max = size ? size.stock : 1;
      if (state.qty < max) {
        state.qty += 1;
        qtyEl.textContent = state.qty;
      } else {
        window.MARE.showToast(`该尺码仅剩 ${max} 件`);
      }
    });

    // 加入购物车
    const addBtn = root.querySelector('[data-add-cart]');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const size = p.sizes.find((s) => s.label === state.selectedSize);
        if (!size || size.stock === 0) {
          window.MARE.showToast('请选择有货的尺码');
          return;
        }
        window.MARE.addToCart({
          productId: p.id,
          size: state.selectedSize,
          qty: state.qty
        });
      });
    }

    // 收藏
    const wish = root.querySelector('[data-wishlist]');
    if (wish) {
      wish.addEventListener('click', () => {
        window.MARE.showToast('已加入收藏 · 周末提醒你');
      });
    }

    // 尺码指南
    const guide = root.querySelector('[data-size-guide]');
    if (guide) {
      guide.addEventListener('click', () => {
        window.MARE.showToast('尺码指南将很快上线 · 暂以模特参考');
      });
    }
  }

  function updateStockText(size) {
    const root = document.querySelector('[data-pd-root]');
    const note = root.querySelector('[data-stock]');
    const txt = root.querySelector('[data-stock-text]');
    note.classList.remove('in-stock', 'low-stock', 'no-stock');
    if (!size || size.stock === 0) {
      note.classList.add('no-stock');
      txt.textContent = '该尺码暂时缺货';
    } else if (size.stock <= 3) {
      note.classList.add('low-stock');
      txt.textContent = `仅剩 ${size.stock} 件 · 售完为止`;
    } else {
      note.classList.add('in-stock');
      txt.textContent = `现货 ${size.stock} 件 · 可立即发货`;
    }
  }

  function renderRelated(p) {
    const wrap = document.querySelector('[data-related]');
    const grid = document.querySelector('[data-related-grid]');
    if (!wrap || !grid) return;
    const related = (window.MARE_PRODUCTS || [])
      .filter((x) => x.id !== p.id && (x.category === p.category || x.hot))
      .slice(0, 4);
    if (related.length === 0) return;
    wrap.style.display = '';
    grid.innerHTML = related.map((x) => window.MARE.renderProductCard(x)).join('');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
