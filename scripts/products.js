/* =========================================================
   MARÉ — 商品数据
   - 服装数据集（含分类、价格、尺码、库存、颜色等）
   - 图片走 Unsplash 公网链接（4:5 服装大片）
   ========================================================= */

window.MARE_PRODUCTS = [
  {
    id: 'p001',
    name: 'Riviera 亚麻翻领衬衫',
    category: 'shirts',
    categoryLabel: '衬衫',
    price: 689,
    oldPrice: 880,
    badge: 'HOT',
    hot: true,
    isNew: false,
    color: '海雾白',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '取自意大利北部的纯亚麻面料，经过三次水洗工艺，让每一寸纤维都拥有海风吹拂后的柔软。直筒剪裁，肩线下落 1.5cm，适合搭配高腰阔腿裤或亚麻短裤。',
    details: ['100% 意大利亚麻', '机洗冷水 / 阴干平铺', '产地：葡萄牙', '模特身高 178cm，穿着 M 码'],
    sizes: [
      { label: 'S', stock: 5 },
      { label: 'M', stock: 8 },
      { label: 'L', stock: 0 },
      { label: 'XL', stock: 3 }
    ]
  },
  {
    id: 'p002',
    name: 'Santorini 高腰阔腿裤',
    category: 'pants',
    categoryLabel: '裤装',
    price: 759,
    oldPrice: null,
    badge: 'NEW',
    hot: false,
    isNew: true,
    color: '墨蓝',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '灵感来自圣托里尼港口工人的工装裤——挺括的棉麻混纺，宽松的裤腿垂坠如帆布。腰头收褶处理，无论站立或落座都保持干净的线条。',
    details: ['65% 棉 / 35% 亚麻', '腰围松紧 + 暗扣', '前褶 + 后插袋', '可机洗 / 低温熨烫'],
    sizes: [
      { label: 'S', stock: 2 },
      { label: 'M', stock: 6 },
      { label: 'L', stock: 4 },
      { label: 'XL', stock: 0 }
    ]
  },
  {
    id: 'p003',
    name: 'Côte 编织草帽',
    category: 'accessories',
    categoryLabel: '配饰',
    price: 269,
    oldPrice: 359,
    badge: 'HOT',
    hot: true,
    isNew: false,
    color: '麦秆黄',
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '马达加斯加海岸的手工拉菲草编织，每顶平均耗时 6 小时。宽檐 11cm，可轻轻折叠塞进行李。系一条深海蓝丝带，瞬间地中海。',
    details: ['100% 天然拉菲草', '内衬纯棉吸汗带', '可调节内圈尺寸 56-59cm', '手工编织 / 阴凉处存放'],
    sizes: [
      { label: 'ONE SIZE', stock: 12 }
    ]
  },
  {
    id: 'p004',
    name: 'Marina 条纹针织衫',
    category: 'knit',
    categoryLabel: '针织',
    price: 599,
    oldPrice: null,
    badge: null,
    hot: false,
    isNew: false,
    color: '海军蓝/白',
    image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '经典布列塔尼水手衫的现代演绎。9 号粗棉线，海军蓝与象牙白横纹间距 2cm，肩缝下沉，落肩长袖。配阔腿白裤，是地中海八月最稳的搭配。',
    details: ['100% 长绒棉', '罗马尼亚工坊编织', '手洗或机洗轻柔档', '建议平铺晾干以保形'],
    sizes: [
      { label: 'S', stock: 4 },
      { label: 'M', stock: 7 },
      { label: 'L', stock: 3 },
      { label: 'XL', stock: 2 }
    ]
  },
  {
    id: 'p005',
    name: 'Sienna 真丝半身长裙',
    category: 'dress',
    categoryLabel: '连衣裙',
    price: 1280,
    oldPrice: 1580,
    badge: 'HOT',
    hot: true,
    isNew: false,
    color: '日落黄',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '19 姆米桑蚕丝，被午后阳光晒透的颜色。腰部裁褶让面料如海浪般层叠垂落，裙摆离地 8cm，刚好掠过沙滩的温度。',
    details: ['100% 桑蚕丝', '隐形侧拉链 + 暗扣', '建议干洗', '内衬同色真丝'],
    sizes: [
      { label: 'XS', stock: 1 },
      { label: 'S', stock: 3 },
      { label: 'M', stock: 5 },
      { label: 'L', stock: 0 }
    ]
  },
  {
    id: 'p006',
    name: 'Porto 帆布托特包',
    category: 'accessories',
    categoryLabel: '配饰',
    price: 459,
    oldPrice: null,
    badge: 'NEW',
    hot: false,
    isNew: true,
    color: '原色帆布',
    image: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '18 盎司加厚水洗帆布，皮革手柄取自葡萄牙制鞋作坊余料。可装下 A4 文件、一本厚书、一瓶水，以及周末的所有念头。',
    details: ['面料：100% 棉帆布', '手柄：植鞣牛皮', '尺寸：38 × 36 × 12cm', '内置一只拉链小袋'],
    sizes: [
      { label: 'ONE SIZE', stock: 18 }
    ]
  },
  {
    id: 'p007',
    name: 'Amalfi 衬衫长裙',
    category: 'dress',
    categoryLabel: '连衣裙',
    price: 869,
    oldPrice: null,
    badge: null,
    hot: false,
    isNew: false,
    color: '粉刷白',
    image: 'https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1485518882345-15568b007407?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1496217590455-aa63a8350eea?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '一件可以从早餐穿到晚餐的衬衫长裙。前襟暗门襟，腰带可拆，敞开是慵懒的罩衫，束起是利落的连衣裙。',
    details: ['棉麻混纺 70/30', '腰带可拆', '裙长 118cm（M 码）', '建议手洗'],
    sizes: [
      { label: 'S', stock: 6 },
      { label: 'M', stock: 4 },
      { label: 'L', stock: 2 },
      { label: 'XL', stock: 1 }
    ]
  },
  {
    id: 'p008',
    name: 'Costa 复古牛仔外套',
    category: 'outerwear',
    categoryLabel: '外套',
    price: 989,
    oldPrice: 1199,
    badge: 'HOT',
    hot: true,
    isNew: false,
    color: '砂洗蓝',
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542327897-d73f4005b533?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '取自日本冈山的色织牛仔，浸染三次后做手工磨砂处理。略宽松的男友版型，肩线略落，扣起来是夹克，敞开是衬衫。',
    details: ['100% 日本冈山色织牛仔', '12 oz 重磅', '青铜色金属四合扣', '建议反面单独冷水洗'],
    sizes: [
      { label: 'S', stock: 3 },
      { label: 'M', stock: 5 },
      { label: 'L', stock: 4 },
      { label: 'XL', stock: 0 }
    ]
  },
  {
    id: 'p009',
    name: 'Lido 棉质 T 恤',
    category: 'shirts',
    categoryLabel: '衬衫',
    price: 299,
    oldPrice: null,
    badge: null,
    hot: false,
    isNew: false,
    color: '象牙白',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '一件无需思考的基础款。240 克长绒棉单面汗布，圆领领口包边稳定不变形。建议你按颜色买齐五件，从周一穿到周五。',
    details: ['100% 长绒棉', '240 GSM', '圆领 / 落肩', '可机洗 / 烘干低温'],
    sizes: [
      { label: 'S', stock: 20 },
      { label: 'M', stock: 25 },
      { label: 'L', stock: 18 },
      { label: 'XL', stock: 10 }
    ]
  },
  {
    id: 'p010',
    name: 'Capri 真皮凉拖鞋',
    category: 'accessories',
    categoryLabel: '配饰',
    price: 539,
    oldPrice: null,
    badge: 'NEW',
    hot: false,
    isNew: true,
    color: '日晒棕',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '卡普里岛的传统手工凉鞋样式。植鞣牛皮带，软木鞋床，越穿越服帖。出门买面包、去海边、去咖啡馆，都是它。',
    details: ['100% 植鞣牛皮', '软木 + 橡胶大底', '意大利手工制', '建议远离海水浸泡'],
    sizes: [
      { label: '36', stock: 4 },
      { label: '37', stock: 6 },
      { label: '38', stock: 5 },
      { label: '39', stock: 3 },
      { label: '40', stock: 2 }
    ]
  },
  {
    id: 'p011',
    name: 'Mistral 风衣式开衫',
    category: 'outerwear',
    categoryLabel: '外套',
    price: 1190,
    oldPrice: null,
    badge: null,
    hot: false,
    isNew: false,
    color: '深海蓝',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '为海风设计的轻量级开衫。腰带系结，无纽扣，让风穿过你而不带走你。下摆延伸至膝盖，是港口傍晚最得体的轮廓。',
    details: ['亚麻 60% / 棉 40%', '腰带可拆', '两只贴袋', '可手洗'],
    sizes: [
      { label: 'S', stock: 2 },
      { label: 'M', stock: 4 },
      { label: 'L', stock: 3 }
    ]
  },
  {
    id: 'p012',
    name: 'Ligure 真丝丝巾',
    category: 'accessories',
    categoryLabel: '配饰',
    price: 389,
    oldPrice: null,
    badge: null,
    hot: true,
    isNew: false,
    color: '柠檬黄/海蓝',
    image: 'https://images.unsplash.com/photo-1601762603339-fd61e28b698a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1601762603339-fd61e28b698a?auto=format&fit=crop&w=900&q=80'
    ],
    desc: '90×90cm 桑蚕丝方巾。手绘柠檬树与帆船图案，边角手工卷边。系在颈间是优雅，绑在包柄上是态度。',
    details: ['100% 桑蚕丝', '尺寸 90 × 90cm', '手工卷边', '建议干洗'],
    sizes: [
      { label: 'ONE SIZE', stock: 9 }
    ]
  }
];

window.MARE_CATEGORIES = [
  { key: 'all', label: '全部', desc: 'Édition Complète' },
  { key: 'shirts', label: '衬衫', desc: 'Shirts' },
  { key: 'pants', label: '裤装', desc: 'Trousers' },
  { key: 'dress', label: '连衣裙', desc: 'Dresses' },
  { key: 'knit', label: '针织', desc: 'Knitwear' },
  { key: 'outerwear', label: '外套', desc: 'Outerwear' },
  { key: 'accessories', label: '配饰', desc: 'Accessories' }
];
