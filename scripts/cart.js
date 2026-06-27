/* =========================================================
   MARÉ — 购物袋脚本
   ========================================================= */

(function () {
  'use strict';

  const FREE_SHIP = 599;

  function render() {
    const root = document.querySelector('[data-cart-root]');
    if (!root) return;
    const cart = window.MARE.getCart();
    if (!cart.length) {
      root.innerHTML = renderEmpty();
      return;
    }
    const subtotal = window.MARE.getCartSubtotal();
    const ship = subtotal >= FREE_SHIP ? 0 : 18;
    const total = subtotal + ship;
    const remain = Math.max(0, FREE_SHIP - subtotal);

    root.innerHTML = `
      <div class="cart-head">
        <div>
          <h1 class="h1">购物袋</h1>
          <div class="h-sub">${cart.length} 件单品 · 共计 ${cart.reduce((s, i) => s + i.qty, 0)} 件</div>
        </div>
        <a class="btn-ghost" href="/index.html">继续逛逛 ←</a>
      </div>

      <div class="cart-layout">
        <div>
          <div class="cart-list" data-cart-list>
            ${cart.map(renderItem).join('')}
          </div>
        </div>

        <aside class="cart-summary">
          <h3>订单小计</h3>

          <div class="summary-row">
            <span>商品小计</span>
            <span class="sum-val">¥${window.MARE.formatPrice(subtotal)}</span>
          </div>
          <div class="summary-row ${ship === 0 ? 'muted' : ''}">
            <span>运费</span>
            <span class="sum-val">${ship === 0 ? '免运费' : '¥' + window.MARE.formatPrice(ship)}</span>
          </div>
          ${
            remain > 0
              ? `<div class="summary-row muted" style="font-size: 12px; letter-spacing: 0.05em;">
                  <span>再购 ¥${window.MARE.formatPrice(remain)} 即免运</span>
                  <span></span>
                </div>`
              : ''
          }

          <div class="summary-promo">
            <input type="text" placeholder="优惠码" data-promo-input />
            <button data-promo-apply>使用</button>
          </div>

          <div class="summary-row total">
            <span>合计</span>
            <span class="sum-val"><span style="font-size:14px; vertical-align: 6px;">¥</span>${window.MARE.formatPrice(total)}</span>
          </div>

          <a href="/checkout.html" class="btn btn-primary btn-block" style="margin-top: 24px;">
            前往结账 →
          </a>

          <div class="summary-note">
            <span class="sn-mark">●</span> 所有订单均以暗号包裹寄出，<br/>
            从葡萄牙工坊到你手上，平均 5 个工作日。
          </div>
        </aside>
      </div>
    `;
    bindEvents();
  }

  function renderItem(item) {
    return `
      <div class="cart-item" data-key="${item.key}">
        <a href="/product.html?id=${item.productId}" class="ci-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </a>
        <div class="ci-body">
          <div>
            <div class="ci-cat">${item.category || ''}</div>
            <div class="ci-name">
              <a href="/product.html?id=${item.productId}">${item.name}</a>
            </div>
            <div class="ci-meta">
              <span>颜色：${item.color || '—'}</span>
              <span>尺码：${item.size}</span>
            </div>
          </div>
          <div class="ci-actions">
            <div class="qty-stepper">
              <button data-act="dec" data-key="${item.key}" aria-label="减少">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
              </button>
              <span class="qty-num">${item.qty}</span>
              <button data-act="inc" data-key="${item.key}" aria-label="增加">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              </button>
            </div>
            <a class="ci-remove" data-act="del" data-key="${item.key}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              移除
            </a>
          </div>
        </div>
        <div class="ci-price">
          <span class="ci-currency">¥</span>${window.MARE.formatPrice(item.price * item.qty)}
          ${
            item.oldPrice
              ? `<div class="ci-old">¥${window.MARE.formatPrice(item.oldPrice * item.qty)}</div>`
              : ''
          }
        </div>
      </div>
    `;
  }

  function renderEmpty() {
    return `
      <div class="cart-empty">
        <div class="empty-fig">— 0 —</div>
        <div class="empty-title">你的购物袋还是空的</div>
        <p class="empty-desc">海风正好，灯也亮着。<br/>挑几件喜欢的，让它们陪你去远方。</p>
        <a class="btn btn-primary" href="/index.html#shop">现在选购 →</a>
      </div>
    `;
  }

  function bindEvents() {
    const root = document.querySelector('[data-cart-root]');
    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-act]');
      if (!t) return;
      const act = t.dataset.act;
      const key = t.dataset.key;
      const cart = window.MARE.getCart();
      const item = cart.find((i) => i.key === key);
      if (!item) return;
      if (act === 'inc') window.MARE.updateCartQty(key, item.qty + 1);
      if (act === 'dec' && item.qty > 1) window.MARE.updateCartQty(key, item.qty - 1);
      if (act === 'del') {
        window.MARE.removeFromCart(key);
        window.MARE.showToast('已从购物袋中移除');
      }
    });

    const promoApply = root.querySelector('[data-promo-apply]');
    if (promoApply) {
      promoApply.addEventListener('click', () => {
        const v = (root.querySelector('[data-promo-input]').value || '').trim();
        if (!v) {
          window.MARE.showToast('请输入优惠码');
        } else {
          window.MARE.showToast('该优惠码暂不可用');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      render();
    });
  } else {
    render();
  }

  window.addEventListener('mare:cart-change', render);
})();
