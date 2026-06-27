# AGENTS.md

## 项目概览

**MARÉ** — 一款地中海风格的服装电商网站，使用原生 HTML / CSS / JS 实现，无构建工具，纯静态托管。

### 技术栈
- **HTML / CSS / Vanilla JS**（native-static 模板，`.coze` 已预置）
- **字体**：Playfair Display（标题/价格）+ Inter（正文）+ Noto Serif/Sans SC（中文）
- **数据**：本地静态商品数据（`scripts/products.js`），购物车持久化到 `localStorage`（key: `mare_cart_v1`）
- **图片**：Unsplash 公共图床
- **运行**：`python -m http.server ${DEPLOY_RUN_PORT}`（由 `.coze` 配置）

## 目录结构

```
.
├── index.html              # 首页：Hero / 跑马灯 / 分类 / 商品列表 / 热门 / Journal / 订阅
├── product.html            # 商品详情页：图集 / 尺码 / 数量 / 加入购物袋 / 相关推荐
├── cart.html               # 购物袋：列表增删改 / 小计 / 优惠码
├── checkout.html           # 结账：3 步（信息 → 支付 → 完成）
├── styles/
│   ├── main.css            # 设计令牌、Header / Footer、按钮、商品卡、Toast
│   ├── home.css            # 首页专属：Hero、分类网格、热门双栏、Journal
│   └── shop.css            # 商品详情 / 购物车 / 结账 通用样式
├── scripts/
│   ├── products.js         # 商品数据 + 分类常量（暴露 window.MARE_PRODUCTS / MARE_CATEGORIES）
│   ├── common.js           # 公共：Header/Footer 注入、购物车存储、Toast、商品卡渲染、SVG 图标
│   ├── home.js             # 首页：分类、搜索、排序、热门渲染
│   ├── product.js          # 详情页：图集切换、尺码/数量、加入购物袋
│   ├── cart.js             # 购物袋：增删改 + 小计计算
│   └── checkout.js         # 结账：3 步状态机
├── DESIGN.md               # 设计规范（"地中海阳光精品店"）
└── .coze                   # 项目运行配置
```

## 设计规范

详见 `DESIGN.md`。

**核心三色**：
- 深海蓝 `#0B3D91` — 骨架色（导航、标题、强调）
- 柠檬黄 `#FFD23F` — 焦点色（CTA、价签、徽章），**只做点缀**
- 粉刷白 `#FAF7F2` — 主背景（吸饱阳光的灰泥墙）

**禁忌**：禁用渐变、大圆角卡片、emoji 图标、把黄色当大面积底色。

## 数据流

- 购物车：`window.MARE.addToCart/updateCartQty/removeFromCart/clearCart`
- 状态变更通过自定义事件 `mare:cart-change` 广播，Header 的购物袋计数自动刷新
- 跨页搜索：通过 `?q=` 查询参数携带至首页 `#shop`

## 关键功能定位

| 功能 | 文件 | 关键函数 / 选择器 |
|---|---|---|
| 全局 Header / 搜索 / 购物袋徽章 | `scripts/common.js` | `injectHeader`、`updateCartCount` |
| 商品卡片渲染 | `scripts/common.js` | `renderProductCard` |
| 首页分类切换 | `scripts/home.js` | `state.category` + `renderShop` |
| 关键词搜索 | `scripts/home.js` | `state.keyword`（来自 Header 搜索框） |
| 尺码 / 数量 / 库存判断 | `scripts/product.js` | `state.selectedSize` / `updateStockText` |
| 购物车加减 / 移除 | `scripts/cart.js` | `data-act` 委托 |
| 结账 3 步状态机 | `scripts/checkout.js` | `state.step` + `render` |

## 本地运行

预览端口固定 `5000`（主仓由沙箱自动拉起）。直接访问首页即可。
