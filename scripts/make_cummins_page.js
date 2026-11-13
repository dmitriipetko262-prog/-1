const fs = require('fs');
const path = 'D:/Climate.si/agroklimat23/';
const src = fs.readFileSync(path + 'compressors.html', 'utf8');

// ---- 1. вырезаем текущую карточку CUMMINS (блок .ccard.drop с цена/характеристики) ----
const startMarker = '    <a class="ccard drop" data-cat="piston" href="https://wa.me/79288807335?text=%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82%20%D0%BA%D0%BE%D0%BC%D0%BF%D1%80%D0%B5%D1%81%D1%81%D0%BE%D1%80%20%D0%BA%D0%BE%D0%BD%D0%B4%D0%B8%D1%86%D0%B8%D0%BE%D0%BD%D0%B5%D1%80%D0%B0%20CUMMINS" target="_blank" rel="noopener">';
const s = src.indexOf(startMarker);
if (s < 0) throw new Error('CUMMINS card start not found');
const e = src.indexOf('\n    </a>\n', s);
if (e < 0) throw new Error('CUMMINS card end not found');
const endIdx = e + '\n    </a>\n'.length;
const originalCard = src.slice(s, endIdx);

// ---- 2. простая карточка-картинка без цены, ведёт на cummins.html ----
const simpleCard = `    <!-- CUMMINS: картинка без цены, ведёт в отдельный каталог моделей cummins.html -->
    <a class="ccard" data-cat="piston" href="cummins.html">
      <span class="tag new">В наличии</span>
      <div class="pic"><img src="images/compressor-5h11-1.jpg" alt="Компрессор кондиционера CUMMINS для спецтехники — каталог моделей" title="Компрессоры кондиционера CUMMINS"></div>
      <b class="t">Компрессор кондиционера CUMMINS</b>
      <div class="app">Cummins · 24 В · шкив 8PK</div>
      <p>Новые и восстановленные агрегаты CUMMINS: модели 5H11 и аналоги. Внутри — фото, характеристики, размеры и цены.</p>
      <span class="go">Перейти в каталог CUMMINS →</span>
    </a>
`;

const newCompressors = src.slice(0, s) + simpleCard + src.slice(endIdx);
fs.copyFileSync(path + 'compressors.html', path + 'compressors.html.bak');
fs.writeFileSync(path + 'compressors.html', newCompressors);

// ---- 3. страница каталога CUMMINS на базе compressors.html ----
let cum = newCompressors;

// 3.1 заголовок и description
cum = cum.replace(
  /<title>[\s\S]*?<\/title>/,
  '<title>Компрессоры кондиционера CUMMINS — каталог, цены и размеры | АгроКлимат23</title>'
);
cum = cum.replace(
  /<meta name="description" content="[\s\S]*?">/,
  '<meta name="description" content="Компрессоры кондиционера CUMMINS для спецтехники: модели 5H11 24 В 8PK, характеристики, габаритные размеры, цены. Новые и восстановленные агрегаты с гарантией, отгрузка со склада в Краснодарском крае.">'
);

// 3.2 хлебные крошки
cum = cum.replace(
  /<div class="wrap crumbs">[\s\S]*?<\/div>/,
  '<div class="wrap crumbs"><a href="index.html">Главная</a> / <a href="index.html#shop">Запчасти со склада</a> / <a href="compressors.html">Компрессоры кондиционеров</a> / CUMMINS</div>'
);

// 3.3 шапка страницы
cum = cum.replace(
  /<div class="wrap pagehead">[\s\S]*?<\/div>\s*\n/,
  `<div class="wrap pagehead">
  <div class="kicker">CUMMINS · 24 В · шкив 8PK</div>
  <h1>Компрессоры кондиционера CUMMINS</h1>
  <p>Каталог компрессоров CUMMINS для сельхоз- и дорожно-строительной техники: новые агрегаты и восстановленные с гарантией. Подбираем по шильдику старого компрессора — пришлите фото, за 30 минут скажем цену и наличие.</p>
</div>
`
);

// 3.4 фильтры (по состоянию товара)
cum = cum.replace(
  /<div class="wrap filters">[\s\S]*?<\/div>/,
  `<div class="wrap filters">
  <button class="chip active" data-f="all">Все модели</button>
  <button class="chip" data-f="new">Новые</button>
  <button class="chip" data-f="reman">Восстановленные</button>
</div>`
);

// 3.5 сетка товаров: существующая карточка CUMMINS 5H11 + место под новые
const gridStart = cum.indexOf('<div class="grid" id="grid">');
const gridEnd = cum.indexOf('  <div class="ctastrip">');
if (gridStart < 0 || gridEnd < 0) throw new Error('grid not found');

const productCard = originalCard
  .replace('class="ccard drop" data-cat="piston"', 'class="ccard drop" data-cat="new"')
  .replace(/\n  ?/g, '\n    ');

const gridBody = `  <div class="grid" id="grid">

    <!-- ===== КАРТОЧКИ ТОВАРОВ CUMMINS =====
         Шаблон для новой карточки: скопировать блок <a class="ccard drop" ...> ... </a>
         и заменить: data-cat (new | reman), фото в .track, <b class="t">название</b>,
         цену в .price, строки характеристик в .specs.
         ===================================== -->

${productCard.replace(/^\s*\n/, '')}
    <!-- === конец карточек === -->

  </div>

`;

cum = cum.slice(0, gridStart) + gridBody + cum.slice(gridEnd);

// 3.6 CTA
cum = cum.replace('<b>Не нашли свой компрессор?</b>', '<b>Не нашли свою модель CUMMINS?</b>');
cum = cum.replace(
  'Позвоните или пришлите фото шильдика — подберём аналог за 30 минут',
  'Пришлите фото шильдика или маркировки — подберём CUMMINS или аналог за 30 минут'
);

fs.writeFileSync(path + 'cummins.html', cum);
console.log('OK');
console.log('compressors.html:', newCompressors.length, 'bytes (backup .bak)');
console.log('cummins.html:', cum.length, 'bytes');
