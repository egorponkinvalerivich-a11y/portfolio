(() => {
  const body = document.body;
  const header = document.getElementById('siteHeader');
  const announcement = document.querySelector('.announcement');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.mobile-menu__close');
  const modal = document.getElementById('orderModal');
  const selectedProduct = document.getElementById('selectedProduct');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* Load the non-destructive v5 visual patch. */
  if (!document.querySelector('link[data-valdi-v5]')) {
    const patch = document.createElement('link');
    patch.rel = 'stylesheet';
    patch.href = 'assets/css/patch-v5.css';
    patch.dataset.valdiV5 = 'true';
    document.head.appendChild(patch);
  }

  /* Keep the refined product hover without the old VIEW cursor. */
  const productHoverStyle = document.createElement('style');
  productHoverStyle.textContent = `
    .view-cursor{display:none!important}
    .product-cursor-zone{cursor:default!important}
    .product-media{isolation:isolate}
    .product-media::after{content:"";position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center,rgba(242,125,184,0) 0%,rgba(242,125,184,0) 48%,rgba(242,125,184,.045) 62%,rgba(242,125,184,.12) 76%,rgba(232,201,211,.24) 100%);box-shadow:inset 0 0 34px rgba(242,125,184,.10),inset 0 0 78px rgba(242,125,184,.12);-webkit-backdrop-filter:blur(2.2px) saturate(1.03);backdrop-filter:blur(2.2px) saturate(1.03);-webkit-mask-image:radial-gradient(ellipse at center,transparent 0 46%,rgba(0,0,0,.15) 60%,rgba(0,0,0,.72) 80%,#000 100%);mask-image:radial-gradient(ellipse at center,transparent 0 46%,rgba(0,0,0,.15) 60%,rgba(0,0,0,.72) 80%,#000 100%);transition:opacity .45s cubic-bezier(.2,.8,.2,1)}
    .product-media:hover::after{opacity:1}
    .product-media img{transition:transform .65s cubic-bezier(.2,.8,.2,1),filter .45s ease!important}
    .product-media:hover img{filter:saturate(1.035) contrast(.985)}
    .product-label{z-index:4}
    @media (hover:none),(pointer:coarse){.product-media::after{display:none}.product-media:hover img{filter:none}}
  `;
  document.head.appendChild(productHoverStyle);

  /* Keep both top bars pinned to the viewport. */
  const syncPinnedTopBars = () => {
    if (!announcement || !header) return;
    const h = Math.round(announcement.getBoundingClientRect().height || (window.innerWidth <= 680 ? 30 : 32));
    Object.assign(announcement.style, {position:'fixed',top:'0',left:'0',right:'0',width:'100%',zIndex:'70'});
    Object.assign(header.style, {position:'fixed',top:`${h}px`,left:'0',right:'0',zIndex:'65'});
    body.style.paddingTop = `${h}px`;
    document.documentElement.style.scrollPaddingTop = `${h + (window.innerWidth <= 680 ? 62 : 70) + 12}px`;
  };
  syncPinnedTopBars();
  window.addEventListener('resize', syncPinnedTopBars, {passive:true});

  requestAnimationFrame(() => body.classList.add('loaded'));
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 36);
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  /* Mobile menu. */
  function openMenu(){
    mobileMenu?.classList.add('is-open');
    mobileMenu?.setAttribute('aria-hidden','false');
    menuToggle?.setAttribute('aria-expanded','true');
    body.classList.add('menu-open');
  }
  function closeMenu(){
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden','true');
    menuToggle?.setAttribute('aria-expanded','false');
    body.classList.remove('menu-open');
  }
  menuToggle?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* Reveal animation. */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -4% 0px'});
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('is-visible'));

  /* Crystal light follows pointer inside buttons. */
  if (!coarsePointer) {
    document.querySelectorAll('.crystal-btn, .btn').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${e.clientX-r.left}px`);
        btn.style.setProperty('--my', `${e.clientY-r.top}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--mx','50%');
        btn.style.setProperty('--my','50%');
      });
    });
  }

  /* Fix the owner's footer image: it was intentionally dimmed in inline styles. */
  const quietImg = document.querySelector('img[src$="quiet-corner.jpg"]');
  if (quietImg) {
    const wrap = quietImg.parentElement;
    wrap?.classList.add('quiet-corner-wrap');
    quietImg.classList.add('quiet-corner-image');
    if (wrap) {
      wrap.style.opacity = '1';
      wrap.style.pointerEvents = 'none';
    }
    quietImg.style.width = '52px';
    quietImg.style.height = '52px';
    quietImg.style.filter = 'none';
    quietImg.style.webkitFilter = 'none';
    quietImg.style.opacity = '1';
  }

  /* Footer logo must remain the same full-color brand mark as in the header. */
  const headerLogo = document.querySelector('.brand--header img');
  const footerLogo = document.querySelector('.footer-brand img');
  if (headerLogo && footerLogo) {
    footerLogo.src = headerLogo.getAttribute('src');
    footerLogo.style.filter = 'none';
    footerLogo.style.webkitFilter = 'none';
    footerLogo.style.opacity = '1';
    footerLogo.style.mixBlendMode = 'normal';
  }

  /* Order modal + individual production lead time. */
  let leadTime = modal?.querySelector('.order-lead-time');
  if (modal && !leadTime) {
    leadTime = document.createElement('div');
    leadTime.className = 'order-lead-time';
    leadTime.innerHTML = '<strong>Ориентировочный срок изготовления</strong>от 2 недель до 1 месяца — в зависимости от модели, материалов и текущей загрузки.';
    const productLine = modal.querySelector('.order-modal__product');
    productLine?.insertAdjacentElement('afterend', leadTime);
  }

  function openModal(product){
    const name = product || 'VALDI';
    if (selectedProduct) selectedProduct.textContent = name;
    const isCustom = /индивиду|свою|custom/i.test(name);
    leadTime?.classList.toggle('is-visible', isCustom);
    modal?.classList.add('is-open');
    modal?.setAttribute('aria-hidden','false');
    body.classList.add('modal-open');
    setTimeout(() => modal?.querySelector('.order-modal__close')?.focus(),80);
  }
  function closeModal(){
    modal?.classList.remove('is-open');
    modal?.setAttribute('aria-hidden','true');
    body.classList.remove('modal-open');
  }
  document.querySelectorAll('.js-order').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.product)));
  modal?.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));

  /* Also state the estimate inside the individual-order section itself. */
  const customIntro = document.querySelector('.custom-intro');
  if (customIntro && !customIntro.querySelector('.custom-lead-note')) {
    const note = document.createElement('p');
    note.className = 'custom-lead-note';
    note.style.cssText = 'margin:18px 0 24px;font-size:11px;line-height:1.55;letter-spacing:.03em;color:var(--muted);max-width:520px';
    note.innerHTML = '<strong style="color:var(--ink);font-weight:700">Ориентировочный срок:</strong> от 2 недель до 1 месяца.';
    const button = customIntro.querySelector('.js-order');
    button?.insertAdjacentElement('beforebegin', note);
  }

  /* Saved choices / cart with a notification bell. */
  const STORAGE_KEY = 'valdi_saved_bags_v1';
  const catalog = [
    {id:'crystal-pink', name:'CRYSTAL PINK', type:'CRYSTAL', image:'assets/img/crystal-pink-front.webp'},
    {id:'pearl', name:'PEARL', type:'CRYSTAL', image:'assets/img/crystal-pearl-front.webp'},
    {id:'royal-blue', name:'ROYAL BLUE', type:'CRYSTAL', image:'assets/img/crystal-royal-blue.webp'},
    {id:'soft-pink', name:'SOFT PINK', type:'KNITTED', image:'assets/img/knit-pink-taupe.webp'}
  ];
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) { saved = []; }
  saved = Array.isArray(saved) ? saved.filter(id => catalog.some(p => p.id === id)) : [];

  const iconMarkup = `<svg class="cart-trigger__bag" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l1 11h-13l1-11Z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/></svg><span class="cart-trigger__bell" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.5 16h9l-1.2-1.8V10a3.3 3.3 0 0 0-6.6 0v4.2L7.5 16Z"/><path d="M10.5 18a1.7 1.7 0 0 0 3 0"/></svg></span><span class="cart-count">0</span>`;

  const headerRight = document.querySelector('.header-nav--right');
  let desktopCart = document.createElement('button');
  desktopCart.type = 'button';
  desktopCart.className = 'cart-trigger';
  desktopCart.setAttribute('aria-label','Открыть выбранные сумки');
  desktopCart.innerHTML = iconMarkup;
  const orderButton = headerRight?.querySelector('.js-order');
  if (headerRight) headerRight.insertBefore(desktopCart, orderButton || null);

  let mobileCart = document.createElement('button');
  mobileCart.type = 'button';
  mobileCart.className = 'cart-trigger cart-trigger--mobile';
  mobileCart.setAttribute('aria-label','Открыть выбранные сумки');
  mobileCart.innerHTML = iconMarkup;
  const headerGrid = document.querySelector('.header-grid');
  if (headerGrid && menuToggle) headerGrid.insertBefore(mobileCart, menuToggle);

  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML = `
    <div class="cart-drawer__backdrop" data-cart-close></div>
    <div class="cart-drawer__panel" role="dialog" aria-modal="true" aria-label="Выбранные сумки">
      <div class="cart-drawer__head"><div><span class="eyebrow">YOUR VALDI</span><h2>Выбранные<br><em style="color:var(--brand);font-style:italic">сумки</em></h2></div><button class="cart-drawer__close" type="button" data-cart-close aria-label="Закрыть">×</button></div>
      <div class="cart-drawer__list"></div>
      <div class="cart-drawer__footer"><div class="cart-drawer__summary"><span>Выбрано вариантов</span><strong class="cart-total">0</strong></div><button class="btn btn--dark crystal-btn cart-order" type="button"><span>Обсудить выбранное</span><b>→</b></button><p class="cart-drawer__hint">Корзина сохраняет понравившиеся варианты на этом устройстве. Финальные детали, оттенки и наличие уточняются при заказе.</p></div>
    </div>`;
  document.body.appendChild(drawer);

  const cartList = drawer.querySelector('.cart-drawer__list');
  const cartTotal = drawer.querySelector('.cart-total');

  const productCards = [...document.querySelectorAll('.product-card')];
  productCards.forEach((card, index) => {
    const product = catalog[index];
    const media = card.querySelector('.product-media');
    if (!product || !media) return;
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'product-save';
    saveBtn.dataset.productId = product.id;
    saveBtn.setAttribute('aria-label', `Добавить ${product.name} в выбранное`);
    saveBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5h11l1 11h-13l1-11Z"/><path d="M9 9V7a3 3 0 0 1 6 0v2"/></svg>`;
    media.appendChild(saveBtn);
    saveBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      toggleSaved(product.id);
    });
  });

  function persist(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch(e) {}
  }
  function ring(){
    [desktopCart,mobileCart].forEach(btn => {
      btn.classList.remove('is-ringing');
      void btn.offsetWidth;
      btn.classList.add('is-ringing');
      setTimeout(() => btn.classList.remove('is-ringing'),700);
    });
  }
  function toggleSaved(id){
    if (saved.includes(id)) saved = saved.filter(x => x !== id);
    else { saved.push(id); ring(); }
    persist();
    renderCart();
  }
  function renderCart(){
    const chosen = saved.map(id => catalog.find(p => p.id === id)).filter(Boolean);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = String(chosen.length));
    document.querySelectorAll('.product-save').forEach(btn => {
      const active = saved.includes(btn.dataset.productId);
      btn.classList.toggle('is-added', active);
      const p = catalog.find(x => x.id === btn.dataset.productId);
      if (p) btn.setAttribute('aria-label', active ? `Убрать ${p.name} из выбранного` : `Добавить ${p.name} в выбранное`);
    });
    if (cartTotal) cartTotal.textContent = String(chosen.length);
    if (!cartList) return;
    if (!chosen.length) {
      cartList.innerHTML = '<div class="cart-empty">Здесь появятся понравившиеся модели. Нажмите на маленькую сумку в карточке товара — и вариант сохранится здесь.</div>';
      return;
    }
    cartList.innerHTML = chosen.map(p => `<article class="cart-item"><img src="${p.image}" alt="${p.name}"><div><h3>${p.name}</h3><p>${p.type} · ручная работа</p></div><button class="cart-item__remove" type="button" data-remove="${p.id}" aria-label="Удалить ${p.name}">×</button></article>`).join('');
    cartList.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', () => toggleSaved(btn.dataset.remove)));
  }

  function openCart(){
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden','false');
    body.classList.add('modal-open');
  }
  function closeCart(){
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden','true');
    body.classList.remove('modal-open');
  }
  desktopCart.addEventListener('click', openCart);
  mobileCart.addEventListener('click', openCart);
  drawer.querySelectorAll('[data-cart-close]').forEach(el => el.addEventListener('click', closeCart));
  drawer.querySelector('.cart-order')?.addEventListener('click', () => {
    const names = saved.map(id => catalog.find(p => p.id === id)?.name).filter(Boolean);
    closeCart();
    openModal(names.length ? `Выбранные модели: ${names.join(', ')}` : 'Индивидуальный заказ');
  });
  renderCart();

  /* FAQ: make manufacturing timing concrete. */
  [...document.querySelectorAll('.faq-item')].forEach(item => {
    const q = item.querySelector('summary')?.textContent || '';
    if (/Сколько занимает изготовление/i.test(q)) {
      const p = item.querySelector('div p');
      if (p) p.textContent = 'Ориентировочный срок изготовления — от 2 недель до 1 месяца. Он зависит от выбранной модели, материалов и текущей загрузки; точный срок подтверждаем перед оформлением заказа.';
    }
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq-item').forEach(other => { if (other !== item) other.open = false; });
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('is-open')) closeCart();
    else if (modal?.classList.contains('is-open')) closeModal();
    else if (mobileMenu?.classList.contains('is-open')) closeMenu();
  });
})();
