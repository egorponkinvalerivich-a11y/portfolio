const products = [
  // BEADED — one-to-one product/model pairs were re-audited against the supplied source photos.
  {id:"beaded-rose",name:"ARCH / ROSE",collection:"beaded",category:"BEADED",tone:"Розовый",cover:"assets/img/campaign/product-rose.webp",hover:null,desc:"Арочная сумка из бусин. Точное фото этой же модели на человеке пока не используется."},
  {id:"beaded-pearl",name:"ARCH / PEARL",collection:"beaded",category:"BEADED",tone:"Жемчужный",cover:"assets/img/campaign/product-pearl.webp",hover:"assets/img/campaign/model-pearl.webp",desc:"Светлая арочная модель из бусин ручной сборки."},
  {id:"beaded-violet",name:"ARCH / VIOLET",collection:"beaded",category:"BEADED",tone:"Фиолетовый",cover:"assets/img/campaign/product-lilac.webp",hover:"assets/img/campaign/model-lilac.webp",desc:"Арочная модель в фиолетовой палитре."},
  {id:"beaded-blue",name:"SCARF / BLUE",collection:"beaded",category:"BEADED",tone:"Голубой",cover:"assets/img/campaign/product-blue.webp",hover:"assets/img/campaign/model-blue.webp",desc:"Сумка из бусин с текстильным акцентом на ручке."},
  {id:"beaded-green",name:"ARCH / GREEN",collection:"beaded",category:"BEADED",tone:"Зелёный",cover:"assets/img/campaign/product-olive.webp",hover:"assets/img/campaign/model-olive.webp",desc:"Зелёная арочная модель из декоративных бусин."},
  {id:"beaded-sun",name:"ARCH / YELLOW",collection:"beaded",category:"BEADED",tone:"Жёлтый",cover:"assets/img/campaign/product-sun.webp",hover:"assets/img/campaign/model-sun.webp",desc:"Жёлтая арочная модель из декоративных бусин."},
  {id:"beaded-gold",name:"GOLD",collection:"beaded",category:"BEADED",tone:"Золотистый",cover:"assets/img/campaign/product-gold.webp",hover:null,desc:"Золотистая модель. Неподтверждённое фото на модели не показывается."},
  {id:"beaded-blush-silk",name:"SCARF / PINK",collection:"beaded",category:"BEADED",tone:"Розовый",cover:"assets/img/campaign/product-blush-silk.webp",hover:"assets/img/campaign/model-rose.webp",desc:"Розовая сумка из крупных бусин с текстильным платком на ручке."},
  {id:"beaded-smoke",name:"SMOKE",collection:"beaded",category:"BEADED",tone:"Графитовый",cover:"assets/img/campaign/product-smoke.webp",hover:null,desc:"Графичная сумка из бусин в дымчатой палитре."},
  {id:"beaded-merlot",name:"MERLOT",collection:"beaded",category:"BEADED",tone:"Винный",cover:"assets/img/campaign/product-merlot.webp",hover:null,desc:"Насыщенная винная модель из бусин ручной сборки."},

  // SOFT — all three product/model pairs are confirmed.
  {id:"soft-candy",name:"SOFT / PINK WHITE",collection:"soft",category:"SOFT",tone:"Розовый + белый",cover:"assets/img/campaign/product-knit.webp",hover:"assets/img/campaign/model-knit-candy.webp",desc:"Мягкая вязаная сумка с объёмной текстильной фактурой."},
  {id:"soft-sand",name:"SOFT / CREAM",collection:"soft",category:"SOFT",tone:"Кремовый",cover:"assets/img/campaign/product-knit-sand.webp",hover:"assets/img/campaign/model-knit-sand.webp",desc:"Мягкая вязаная модель в спокойной кремовой гамме."},
  {id:"soft-sorbet",name:"SOFT / PINK",collection:"soft",category:"SOFT",tone:"Розовый",cover:"assets/img/campaign/product-knit-sorbet.webp",hover:"assets/img/campaign/model-knit-sorbet.webp",desc:"Компактная мягкая сумка в розовой палитре."},

  // BRIDAL — editorial photos are intentionally not treated as one-to-one product pairs.
  {id:"bridal-blush",name:"BRIDAL / BLUSH",collection:"bridal",category:"BRIDAL",tone:"Пудровый",cover:"assets/img/campaign/product-bridal-blush.webp",hover:null,desc:"Светлая модель для свадебного или вечернего образа."},
  {id:"bridal-mist",name:"BRIDAL / MIST",collection:"bridal",category:"BRIDAL",tone:"Светлый",cover:"assets/img/campaign/product-bridal-mist.webp",hover:null,desc:"Светлая кристальная модель для особенного образа."},
  {id:"bridal-pearl",name:"BRIDAL / PEARL",collection:"bridal",category:"BRIDAL",tone:"Жемчужный",cover:"assets/img/campaign/product-bridal-pearl.webp",hover:null,desc:"Жемчужная bridal-модель ручной сборки."},
  {id:"bridal-silver",name:"BRIDAL / SILVER",collection:"bridal",category:"BRIDAL",tone:"Серебристый",cover:"assets/img/campaign/product-bridal-silver.webp",hover:null,desc:"Серебристая кристальная модель для особенного дня."},
  {id:"bridal-white",name:"BRIDAL / WHITE",collection:"bridal",category:"BRIDAL",tone:"Белый",cover:"assets/img/campaign/product-bridal-white.webp",hover:null,desc:"Белая bridal-модель с выразительной фактурой."}
];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const imagePath = (path) => path;
const imageTag = (path, alt, cls='') => `
  <img class="${cls}" src="${path}" alt="${alt}" loading="lazy" decoding="async">`;

let activeFilter = 'all';
let saved = new Set(JSON.parse(localStorage.getItem('valdi-selection') || '[]'));
let currentProduct = null;

function renderProducts() {
  const grid = $('#productGrid');
  const visible = products.filter(p => activeFilter === 'all' || p.collection === activeFilter);
  $('#productCount').textContent = `${visible.length} объектов`;
  grid.innerHTML = visible.map((p, i) => `
    <article class="product-card reveal" data-id="${p.id}">
      <button class="product-media" data-view="${p.id}" aria-label="Открыть ${p.name}">
        ${imageTag(p.cover, p.name, 'product-primary')}
        ${p.hover ? imageTag(p.hover, `${p.name} — на модели`, 'product-hover') : ''}
        <span class="card-index">${String(i+1).padStart(2,'0')}</span>
      </button>
      <div class="product-meta">
        <div>
          <div class="eyebrow">${p.category} · ${p.tone}</div>
          <h3>${p.name}</h3>
          <p class="price">Цена по запросу</p>
        </div>
        <button class="select-btn ${saved.has(p.id) ? 'is-saved' : ''}" data-save="${p.id}" aria-pressed="${saved.has(p.id)}">
          ${saved.has(p.id) ? 'Выбрано' : 'Выбрать'}
        </button>
      </div>
    </article>
  `).join('');
  bindProductActions();
  observeReveals();
}

function bindProductActions() {
  $$('[data-view]').forEach(btn => btn.addEventListener('click', () => openProduct(btn.dataset.view)));
  $$('[data-save]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSave(btn.dataset.save);
  }));
}

function toggleSave(id) {
  saved.has(id) ? saved.delete(id) : saved.add(id);
  localStorage.setItem('valdi-selection', JSON.stringify([...saved]));
  updateSelection();
  renderProducts();
  if (currentProduct?.id === id) updateProductModalButton();
}

function updateSelection() {
  $('#selectionCount').textContent = saved.size;
  const list = $('#selectionList');
  const selected = products.filter(p => saved.has(p.id));
  list.innerHTML = selected.length ? selected.map(p => `
    <div class="selection-item">
      <img src="${imagePath(p.cover)}" alt="">
      <div><span class="eyebrow">${p.category}</span><strong>${p.name}</strong></div>
      <button data-remove="${p.id}" aria-label="Удалить ${p.name}">×</button>
    </div>`).join('') : `<p class="empty">Пока ничего не выбрано. Добавьте несколько сумок и обсудите их вместе.</p>`;
  $$('[data-remove]', list).forEach(btn => btn.addEventListener('click', () => toggleSave(btn.dataset.remove)));
  $('#discussBtn').disabled = !selected.length;
}

function openProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentProduct = p;
  $('#modalCategory').textContent = `${p.category} · ${p.tone}`;
  $('#modalTitle').textContent = p.name;
  $('#modalDescription').textContent = p.desc;
  $('#modalMain').src = imagePath(p.cover);
  $('#modalMain').alt = p.name;
  const gallery = $('#modalGallery');
  const names = [p.cover, p.hover].filter(Boolean);
  gallery.innerHTML = names.map((n,i)=>`<button class="${i===0?'active':''}" data-gallery="${n}"><img src="${imagePath(n)}" alt=""></button>`).join('');
  $$('[data-gallery]', gallery).forEach(btn => btn.addEventListener('click', () => {
    $('#modalMain').src = imagePath(btn.dataset.gallery);
    $$('[data-gallery]',gallery).forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
  }));
  updateProductModalButton();
  $('#productDialog').showModal();
}

function updateProductModalButton() {
  if (!currentProduct) return;
  const btn = $('#modalSave');
  btn.textContent = saved.has(currentProduct.id) ? 'Убрать из выбора' : 'Добавить в выбор';
}

$('#modalSave').addEventListener('click', () => currentProduct && toggleSave(currentProduct.id));
$$('[data-close]').forEach(btn => btn.addEventListener('click', () => btn.closest('dialog')?.close()));

$$('.filter').forEach(btn => btn.addEventListener('click', () => {
  activeFilter = btn.dataset.filter;
  $$('.filter').forEach(x=>{x.classList.toggle('active',x===btn); x.setAttribute('aria-pressed',x===btn)});
  renderProducts();
}));

$('#selectionOpen').addEventListener('click', () => { updateSelection(); $('#selectionDialog').showModal(); });
$('#discussBtn').addEventListener('click', () => {
  const selected = products.filter(p => saved.has(p.id));
  const msg = `Здравствуйте! Хочу уточнить детали по сумкам VALDI:\n${selected.map(p=>'— '+p.name).join('\n')}\n\nПодскажите, пожалуйста, актуальную стоимость, возможность заказа и срок изготовления.`;
  $('#messageText').value = msg;
  $('#selectionDialog').close();
  $('#messageDialog').showModal();
});
$('#copyMessage').addEventListener('click', async () => {
  await navigator.clipboard.writeText($('#messageText').value);
  $('#copyMessage').textContent = 'Скопировано';
  setTimeout(()=>$('#copyMessage').textContent='Скопировать сообщение',1400);
});

const menuBtn = $('#menuBtn');
menuBtn.addEventListener('click', () => {
  const nav = $('#mobileNav');
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
$$('#mobileNav a').forEach(a=>a.addEventListener('click',()=>$('#mobileNav').classList.remove('open')));

const observer = new IntersectionObserver((entries) => entries.forEach(e => {
  if(e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
}), {threshold:.08});
function observeReveals() { $$('.reveal:not(.visible)').forEach(el=>observer.observe(el)); }

const siteHeader = $('.site-header');
function syncHeaderState() {
  siteHeader?.classList.toggle('is-scrolled', window.scrollY > 64);
}
window.addEventListener('scroll', syncHeaderState, {passive:true});
syncHeaderState();

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') $('#mobileNav').classList.remove('open');
});

renderProducts();
updateSelection();
observeReveals();
