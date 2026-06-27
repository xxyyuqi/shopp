/* =========================================================
   MARÉ — 结账脚本
   ========================================================= */

(function () {
  'use strict';

  const FREE_SHIP = 599;
  const state = {
    step: 1, // 1=信息, 2=确认/支付, 3=完成
    info: null,
    payment: 'wechat',
    orderNo: null
  };

  function render() {
    const root = document.querySelector('[data-checkout-root]');
    if (!root) return;
    const cart = window.MARE.getCart();
    if (!cart.length && state.step !== 3) {
      root.innerHTML = renderEmpty();
      return;
    }

    if (state.step === 1) {
      root.innerHTML = renderStep1(cart);
      bindStep1();
    } else if (state.step === 2) {
      root.innerHTML = renderStep2(cart);
      bindStep2();
    } else if (state.step === 3) {
      root.innerHTML = renderStep3();
    }
  }

  function renderEmpty() {
    return `
      <div class="cart-empty">
        <div class="empty-fig">— 0 —</div>
        <div class="empty-title">购物袋是空的</div>
        <p class="empty-desc">先去挑几件喜欢的吧。</p>
        <a class="btn btn-primary" href="/index.html#shop">现在选购 →</a>
      </div>
    `;
  }

  function renderSteps(active) {
    const steps = [
      { n: 1, label: '收货信息' },
      { n: 2, label: '支付方式' },
      { n: 3, label: '完成订单' }
    ];
    return `
      <div class="checkout-steps">
        ${steps
          .map(
            (s, i) => `
            <div class="step-pill ${active === s.n ? 'active' : active > s.n ? 'done' : ''}">
              <span class="step-num">${active > s.n ? '✓' : '0' + s.n}</span>
              <span>${s.label}</span>
            </div>
            ${i < steps.length - 1 ? '<span class="step-conn"></span>' : ''}
          `
          )
          .join('')}
      </div>
    `;
  }

  function renderSummary(cart, opts) {
    opts = opts || {};
    const subtotal = window.MARE.getCartSubtotal();
    const ship = subtotal >= FREE_SHIP ? 0 : 18;
    const total = subtotal + ship;
    return `
      <aside class="checkout-card">
        <h3>订单摘要</h3>
        <p class="card-sub">${cart.reduce((s, i) => s + i.qty, 0)} 件单品</p>

        <div class="mini-sum-items">
          ${cart
            .map(
              (i) => `
              <div class="mini-item">
                <div class="mi-img"><img src="${i.image}" alt="${i.name}" /></div>
                <div>
                  <div class="mi-name">${i.name}</div>
                  <div class="mi-meta">${i.size} · ×${i.qty}</div>
                </div>
                <div class="mi-price">¥${window.MARE.formatPrice(i.price * i.qty)}</div>
              </div>
            `
            )
            .join('')}
        </div>

        <div class="summary-row"><span>商品小计</span><span class="sum-val">¥${window.MARE.formatPrice(subtotal)}</span></div>
        <div class="summary-row ${ship === 0 ? 'muted' : ''}">
          <span>运费</span>
          <span class="sum-val">${ship === 0 ? '免运费' : '¥' + window.MARE.formatPrice(ship)}</span>
        </div>
        <div class="summary-row total">
          <span>合计</span>
          <span class="sum-val"><span style="font-size:14px; vertical-align: 6px;">¥</span>${window.MARE.formatPrice(total)}</span>
        </div>

        ${
          opts.showAction
            ? `<button class="btn btn-primary btn-block" style="margin-top: 24px;" data-action="${opts.action}">
                ${opts.actionLabel}
              </button>`
            : ''
        }

        <div class="summary-note">
          <span class="sn-mark">●</span> 所有订单均以暗号包裹寄出。<br/>
          ${ship === 0 ? '免运费已享受。' : `再购 ¥${window.MARE.formatPrice(FREE_SHIP - subtotal)} 即免运。`}
        </div>
      </aside>
    `;
  }

  function renderStep1(cart) {
    const info = state.info || {};
    return `
      <div class="cart-head">
        <div>
          <h1 class="h1">完成订单</h1>
          <div class="h-sub">最后几步 · 让它们启程到你身边。</div>
        </div>
        <a class="btn-ghost" href="/cart.html">← 返回购物袋</a>
      </div>

      ${renderSteps(1)}

      <div class="checkout-layout">
        <div>
          <div class="checkout-card">
            <h3>收货信息</h3>
            <p class="card-sub">请填写真实信息以便我们准确寄出。</p>
            <form data-form-info>
              <div class="form-row">
                <div class="form-field">
                  <label class="form-label">姓</label>
                  <input class="form-input" name="lastName" required value="${info.lastName || ''}" />
                </div>
                <div class="form-field">
                  <label class="form-label">名</label>
                  <input class="form-input" name="firstName" required value="${info.firstName || ''}" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label class="form-label">手机号</label>
                  <input class="form-input" name="phone" type="tel" pattern="[0-9]{11}" required placeholder="11 位手机号" value="${info.phone || ''}" />
                </div>
                <div class="form-field">
                  <label class="form-label">邮箱</label>
                  <input class="form-input" name="email" type="email" required value="${info.email || ''}" />
                </div>
              </div>
              <div class="form-field">
                <label class="form-label">所在地区</label>
                <input class="form-input" name="region" required placeholder="省 / 市 / 区" value="${info.region || ''}" />
              </div>
              <div class="form-field">
                <label class="form-label">详细地址</label>
                <input class="form-input" name="address" required placeholder="街道、门牌号等" value="${info.address || ''}" />
              </div>
              <div class="form-field">
                <label class="form-label">备注（可选）</label>
                <input class="form-input" name="note" placeholder="给我们的留言" value="${info.note || ''}" />
              </div>

              <button type="submit" class="btn btn-primary btn-block" style="margin-top: 16px;">
                下一步 · 选择支付方式 →
              </button>
            </form>
          </div>
        </div>

        ${renderSummary(cart)}
      </div>
    `;
  }

  function bindStep1() {
    const form = document.querySelector('[data-form-info]');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const info = {};
      fd.forEach((v, k) => (info[k] = (v || '').toString().trim()));
      // 简单校验
      if (!/^\d{11}$/.test(info.phone)) {
        window.MARE.showToast('请输入正确的 11 位手机号');
        return;
      }
      state.info = info;
      state.step = 2;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      render();
    });
  }

  function renderStep2(cart) {
    const info = state.info || {};
    const options = [
      { key: 'wechat', name: '微信支付', desc: '使用微信扫码支付', icon: 'W' },
      { key: 'alipay', name: '支付宝', desc: '使用支付宝账户支付', icon: 'A' },
      { key: 'card', name: '银行卡', desc: '支持各大银行储蓄卡 / 信用卡', icon: 'C' },
      { key: 'cod', name: '货到付款', desc: '签收时验货支付（部分地区不可用）', icon: 'D' }
    ];

    return `
      <div class="cart-head">
        <div>
          <h1 class="h1">完成订单</h1>
          <div class="h-sub">第二步 · 选择你的支付方式。</div>
        </div>
        <a class="btn-ghost" href="javascript:void(0)" data-back>← 返回上一步</a>
      </div>

      ${renderSteps(2)}

      <div class="checkout-layout">
        <div>
          <div class="checkout-card">
            <h3>收货信息</h3>
            <p class="card-sub" style="margin-bottom: 8px;">
              ${info.lastName || ''}${info.firstName || ''} · ${info.phone || ''}
            </p>
            <p style="font-size: 14px; color: var(--c-ink); line-height: 1.6;">
              ${info.region || ''} ${info.address || ''}
              ${info.note ? `<br/><span style="color: var(--c-muted); font-size: 13px;">备注：${info.note}</span>` : ''}
            </p>
          </div>

          <div class="checkout-card">
            <h3>支付方式</h3>
            <p class="card-sub">请选择一种你方便的支付方式。</p>
            <div class="pay-options" data-pay-options>
              ${options
                .map(
                  (o) => `
                  <label class="pay-opt ${state.payment === o.key ? 'selected' : ''}" data-pay="${o.key}">
                    <span class="pay-radio"></span>
                    <div>
                      <div class="pay-name">${o.name}</div>
                      <div class="pay-desc">${o.desc}</div>
                    </div>
                    <span class="pay-icon">${o.icon}</span>
                  </label>
                `
                )
                .join('')}
            </div>

            <button class="btn btn-primary btn-block" style="margin-top: 28px;" data-place-order>
              确认支付 · 完成订单 →
            </button>
            <p style="font-size: 11px; letter-spacing: 0.06em; color: var(--c-muted); margin-top: 16px; text-align: center;">
              点击"确认支付"即表示同意 MARÉ 的服务条款与隐私政策
            </p>
          </div>
        </div>

        ${renderSummary(cart)}
      </div>
    `;
  }

  function bindStep2() {
    const root = document.querySelector('[data-checkout-root]');
    const back = root.querySelector('[data-back]');
    if (back) {
      back.addEventListener('click', () => {
        state.step = 1;
        render();
      });
    }

    const opts = root.querySelector('[data-pay-options]');
    if (opts) {
      opts.addEventListener('click', (e) => {
        const t = e.target.closest('[data-pay]');
        if (!t) return;
        state.payment = t.dataset.pay;
        opts.querySelectorAll('.pay-opt').forEach((el) => el.classList.remove('selected'));
        t.classList.add('selected');
      });
    }

    const placeBtn = root.querySelector('[data-place-order]');
    if (placeBtn) {
      placeBtn.addEventListener('click', () => {
        placeBtn.disabled = true;
        placeBtn.textContent = '处理中 ···';
        // 模拟支付处理
        setTimeout(() => {
          state.orderNo = 'MR' + Date.now().toString().slice(-9);
          state.step = 3;
          window.MARE.clearCart();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          render();
        }, 900);
      });
    }
  }

  function renderStep3() {
    const orderNo = state.orderNo || ('MR' + Date.now().toString().slice(-9));
    return `
      ${renderSteps(3)}
      <div class="success-page">
        <div class="success-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 class="success-title">订单已确认。<br/><em>感谢你，旅人。</em></h1>
        <p class="success-desc">
          我们已收到你的订单。包裹将在 48 小时内寄出，
          一份发货通知会在它启程时送到你的邮箱。
        </p>
        <p class="success-order">订单号 · ${orderNo}</p>
        <div class="success-actions">
          <a class="btn btn-primary" href="/index.html">继续逛逛 MARÉ →</a>
          <a class="btn btn-secondary" href="javascript:void(0)" onclick="MARE.showToast('订单详情功能即将上线');">查看订单详情</a>
        </div>
      </div>
    `;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
