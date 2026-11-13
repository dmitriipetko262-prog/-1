const fs = require('fs');
const SITE = 'D:/Climate.si/agroklimat23/';
const P = SITE + 'images/';
const PREV = 'D:/Climate.si/CUMMINS/_preview/';

// ---------- 1. копируем фото в images/ ----------
const copies = [
  // RC-U08589 (24 В, 8PK, Ø119)
  ['A-U08589-119-8PK-01.png', 'cummins-u08589-1.png'],
  ['A-U08589-119-8PK-02.png', 'cummins-u08589-2.png'],
  ['A-U08589-119-8PK-03.png', 'cummins-u08589-3.png'],
  // RC-U08590 (24 В, 2A, Ø132)
  ['B-U08590-132-2A-24V-04.jpg', 'cummins-u08590-1.jpg'],
  ['B-U08590-132-2A-24V-02.jpg', 'cummins-u08590-2.jpg'],
  ['B-U08590-132-2A-24V-05.jpeg', 'cummins-u08590-3.jpg'],
  ['B-U08590-132-2A-24V-01.webp', 'cummins-u08590-4.webp'],
  // RC-U08591 (12 В, 2A, Ø132)
  ['C-U08591-132-2A-12V-04.jpg', 'cummins-u08591-1.jpg'],
  ['C-U08591-132-2A-12V-02.jpg', 'cummins-u08591-2.jpg'],
  ['C-U08591-132-2A-12V-05.jpeg', 'cummins-u08591-3.jpg'],
  ['C-U08591-132-2A-12V-01.webp', 'cummins-u08591-4.webp'],
];
for (const [from, to] of copies) {
  fs.copyFileSync(PREV + from, P + to);
}
console.log('фото скопировано:', copies.length);

// ---------- 2. compressors.html: плитка CUMMINS по макету ----------
let comp = fs.readFileSync(SITE + 'compressors.html', 'utf8');

const tileStart = comp.indexOf('    <!-- CUMMINS: карточка-фото');
const tileEnd = comp.indexOf('\n    </a>\n', tileStart) + '\n    </a>\n'.length;
if (tileStart < 0) throw new Error('tile not found');

const tile = `    <!-- CUMMINS: плитка-картинка по макету, ведёт в каталог моделей cummins.html -->
    <a class="ccard cumtile" data-cat="piston" href="cummins.html" aria-label="Компрессора Cummins — перейти в каталог">
      <img class="cph" src="images/cummins-u08589-1.png" alt="Компрессор кондиционера CUMMINS 24 В, шкив 8PK Ø119 мм">
      <span class="cstat">В наличии</span>
      <div class="cbox">
        <span class="cbox-t">Компрессора Cummins</span>
        <span class="cbox-g">Перейти в каталог</span>
      </div>
    </a>
`;
comp = comp.slice(0, tileStart) + tile + comp.slice(tileEnd);

// CSS: выбрасываем старые стили .imgcard, ставим стили плитки по макету
const cssStart = comp.indexOf('  /* ===== Карточка-фото (CUMMINS)');
const cssEnd = comp.indexOf('</style>');
if (cssStart < 0) throw new Error('css block not found');
const newCss = `  /* ===== Плитка CUMMINS (по макету): фото на всю карточку + голубая плашка снизу ===== */
  .ccard.cumtile{display:block;padding:0;overflow:hidden;min-height:390px;background:#fff;border-radius:22px;border-color:#ececec}
  .ccard.cumtile:hover{transform:translateY(-4px);box-shadow:var(--shadow)}
  .ccard.cumtile .cph{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center;padding:14px 14px 104px;transition:transform .35s ease}
  .ccard.cumtile:hover .cph{transform:scale(1.03)}
  .ccard.cumtile .cstat{position:absolute;top:14px;right:14px;z-index:3;background:#159b46;color:#fff;font-size:15px;font-weight:800;letter-spacing:.2px;padding:9px 20px;border-radius:999px;box-shadow:0 6px 16px rgba(21,155,70,.35)}
  .ccard.cumtile .cbox{position:absolute;left:14px;right:14px;bottom:14px;z-index:3;background:#ccd7f7;border-radius:20px;padding:16px 14px;text-align:center;line-height:1.15}
  .ccard.cumtile .cbox-t{display:block;font-size:21px;font-weight:800;color:#243a6b}
  .ccard.cumtile .cbox-g{display:block;margin-top:7px;font-size:17px;font-weight:800;color:#0e7a33}
  .ccard.cumtile:hover .cbox-g{color:#0a5f27}
  @media(max-width:520px){
    .ccard.cumtile{min-height:330px}
    .ccard.cumtile .cstat{font-size:13.5px;padding:7px 15px}
    .ccard.cumtile .cbox{padding:12px 10px;border-radius:16px}
    .ccard.cumtile .cbox-t{font-size:17px}
    .ccard.cumtile .cbox-g{font-size:14.5px}
    .ccard.cumtile .cph{padding:12px 12px 92px}
  }

  /* Мини-полоса фото в карточках товаров (без карусели) */
  .ccard .thumbbar{display:flex;gap:7px;background:rgba(148,199,246,.42);border-radius:12px;padding:7px;margin-bottom:12px}
  .ccard .thumbbar img{flex:1 1 0;min-width:0;height:52px;object-fit:cover;background:#fff;border:1px solid #dfe8f5;border-radius:8px}
  @media(max-width:520px){ .ccard .thumbbar img{height:44px} }

`;
comp = comp.slice(0, cssStart) + newCss + comp.slice(cssEnd);
fs.writeFileSync(SITE + 'compressors.html', comp);
console.log('compressors.html: плитка обновлена');

// ---------- 3. cummins.html: три товарные карточки ----------
const WA = (s) => 'https://wa.me/79288807335?text=' + encodeURIComponent(s);

const products = [
  {
    cat: 'new',
    name: 'Компрессор кондиционера CUMMINS RC-U08589',
    app: '24 В · шкив 8PK · Ø119 мм',
    price: '20 000 ₽',
    imgs: [
      ['cummins-u08589-1.png', 'Компрессор кондиционера CUMMINS RC-U08589 24 В, шкив 8PK Ø119 мм — вид сбоку', 'Компрессор CUMMINS RC-U08589 24V 8PK — вид сбоку'],
      ['cummins-u08589-2.png', 'Компрессор кондиционера CUMMINS RC-U08589 24 В — задняя крышка с патрубками подключения магистрали R134a', 'Компрессор CUMMINS RC-U08589 24V — задняя крышка, патрубки'],
      ['cummins-u08589-3.png', 'Габаритный чертёж компрессора кондиционера CUMMINS RC-U08589 24V 8PK: длина 215 мм, диаметры корпуса 123 и 138 мм, шкив Ø119/123 мм', 'Компрессор CUMMINS RC-U08589 — габаритный чертёж'],
    ],
    specs: [
      ['Артикул', 'RC-U08589'],
      ['Напряжение питания', '24 В'],
      ['Тип хладагента', 'R134a'],
      ['Профиль шкива', '8PK'],
      ['Диаметр шкива', '119 мм'],
      ['Тип масла', 'PAG 46'],
      ['Габаритная длина', '215 мм'],
      ['Ø корпуса', '123 / 138 мм'],
    ],
  },
  {
    cat: 'new',
    name: 'Компрессор кондиционера CUMMINS RC-U08590',
    app: '24 В · шкив 2A · Ø132 мм',
    price: '20 000 ₽',
    imgs: [
      ['cummins-u08590-1.jpg', 'Компрессор кондиционера CUMMINS RC-U08590 24 В, двухручейный шкив 2A Ø132 мм — вид сбоку', 'Компрессор CUMMINS RC-U08590 24V 2A Ø132 — вид сбоку'],
      ['cummins-u08590-2.jpg', 'Компрессор кондиционера CUMMINS RC-U08590 24 В — задняя крышка с патрубками S/D под манифолд R134a', 'Компрессор CUMMINS RC-U08590 — задняя крышка S/D'],
      ['cummins-u08590-3.jpg', 'Компрессор кондиционера CUMMINS RC-U08590 24 В — вид сбоку, электромагнитная муфта и шкив 2A Ø132 мм', 'Компрессор CUMMINS RC-U08590 — вид сбоку'],
      ['cummins-u08590-4.webp', 'Габаритный чертёж компрессора кондиционера CUMMINS RC-U08590 24 В 2A: длина 212 мм, диаметр корпуса 132 мм, фланец 120×105 мм, шкив Ø132/Ø109 мм', 'Компрессор CUMMINS RC-U08590 — габаритный чертёж'],
    ],
    specs: [
      ['Артикул', 'RC-U08590'],
      ['Напряжение питания', '24 В'],
      ['Тип хладагента', 'R134a'],
      ['Профиль шкива', '2A'],
      ['Диаметр шкива', '132 мм'],
      ['Ø по ручьям', '109 мм'],
      ['Габаритная длина', '212 мм'],
      ['Ø корпуса', '132 мм'],
      ['Присоединительный фланец', '120 × 105 мм'],
    ],
  },
  {
    cat: 'new',
    name: 'Компрессор кондиционера CUMMINS RC-U08591',
    app: '12 В · шкив 2A · Ø132 мм',
    price: '20 000 ₽',
    imgs: [
      ['cummins-u08591-1.jpg', 'Компрессор кондиционера CUMMINS RC-U08591 12 В, двухручейный шкив 2A Ø132 мм — вид сбоку', 'Компрессор CUMMINS RC-U08591 12V 2A Ø132 — вид сбоку'],
      ['cummins-u08591-2.jpg', 'Компрессор кондиционера CUMMINS RC-U08591 12 В — задняя крышка с патрубками S/D под манифолд R134a', 'Компрессор CUMMINS RC-U08591 — задняя крышка S/D'],
      ['cummins-u08591-3.jpg', 'Компрессор кондиционера CUMMINS RC-U08591 12 В — вид сбоку, электромагнитная муфта и шкив 2A Ø132 мм', 'Компрессор CUMMINS RC-U08591 — вид сбоку'],
      ['cummins-u08591-4.webp', 'Габаритный чертёж компрессора кондиционера CUMMINS RC-U08591 12 В 2A: длина 212 мм, диаметр корпуса 132 мм, фланец 120×105 мм, шкив Ø132/Ø109 мм', 'Компрессор CUMMINS RC-U08591 — габаритный чертёж'],
    ],
    specs: [
      ['Артикул', 'RC-U08591'],
      ['Напряжение питания', '12 В'],
      ['Тип хладагента', 'R134a'],
      ['Профиль шкива', '2A'],
      ['Диаметр шкива', '132 мм'],
      ['Ø по ручьям', '109 мм'],
      ['Габаритная длина', '212 мм'],
      ['Ø корпуса', '132 мм'],
      ['Присоединительный фланец', '120 × 105 мм'],
    ],
  },
];

const card = (p) => {
  const thumbs = p.imgs.map(([f, alt]) =>
    `          <img src="images/${f}" alt="${alt}">`).join('\n');
  const rows = p.specs.map(([k, v]) =>
    `          <div class="row"><span>${k}</span><b>${v}</b></div>`).join('\n');
  return `    <a class="ccard drop" data-cat="${p.cat}" href="${WA('Интересует ' + p.name)}" target="_blank" rel="noopener">
      <span class="tag new">В наличии</span>
      <div class="pic"><img src="images/${p.imgs[0][0]}" alt="${p.imgs[0][1]}" title="${p.imgs[0][2]}"></div>
      <div class="thumbbar">
${thumbs}
      </div>
      <b class="t">${p.name}</b>
      <div class="app">${p.app}</div>
      <button type="button" class="price buybtn" data-item="${p.name}" data-img="images/${p.imgs[0][0]}"><span class="bk">Купить</span> ${p.price}</button><!-- ЧЕРНОВАЯ ЦЕНА: заменить на реальную -->
      <div class="specs">
        <div class="shead">Характеристики</div>
${rows}
        <div class="qtyrow">
          <div class="qty">
            <button type="button" class="qm" aria-label="Уменьшить">−</button>
            <input type="number" class="qv" value="1" min="1" max="999" inputmode="numeric">
            <button type="button" class="qp" aria-label="Увеличить">+</button>
          </div>
          <button type="button" class="addcart" data-item="${p.name}" data-img="images/${p.imgs[0][0]}">В корзину</button>
        </div>
      </div>
    </a>`;
};

let cum = fs.readFileSync(SITE + 'cummins.html', 'utf8');
const gStart = cum.indexOf('    <!-- ===== КАРТОЧКИ ТОВАРОВ CUMMINS');
const gEnd = cum.indexOf('    <!-- === конец карточек === -->');
if (gStart < 0 || gEnd < 0) throw new Error('cards block not found');

const block = `    <!-- ===== КАРТОЧКИ ТОВАРОВ CUMMINS =====
         Шаблон: скопировать блок <a class="ccard drop" ...> ... </a>
         и заменить: data-cat (new | reman), фото в .pic и .thumbbar,
         название, цену в .price и строки характеристик в .specs.
         ===================================== -->

${products.map(card).join('\n\n')}

`;
cum = cum.slice(0, gStart) + block + cum.slice(gEnd);

// CSS для мини-полосы фото
if (!cum.includes('.ccard .thumbbar{')) {
  cum = cum.replace('  .ccard .app{',
    `  .ccard .thumbbar{display:flex;gap:7px;background:rgba(148,199,246,.42);border-radius:12px;padding:7px;margin-bottom:12px}
  .ccard .thumbbar img{flex:1 1 0;min-width:0;height:52px;object-fit:cover;background:#fff;border:1px solid #dfe8f5;border-radius:8px}
  @media(max-width:520px){ .ccard .thumbbar img{height:44px} }
  .ccard .app{`);
}
fs.writeFileSync(SITE + 'cummins.html', cum);
console.log('cummins.html: 3 карточки товара');
