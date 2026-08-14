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

  // Product hover: subtle pink edge blur, without a custom cursor label.
  const productHoverStyle = document.createElement('style');
  productHoverStyle.textContent = `
    .view-cursor{display:none!important}
    .product-cursor-zone{cursor:default!important}
    .product-media{isolation:isolate}
    .product-media::after{
      content:"";
      position:absolute;
      inset:0;
      z-index:2;
      pointer-events:none;
      opacity:0;
      background:
        radial-gradient(ellipse at center,
          rgba(242,125,184,0) 0%,
          rgba(242,125,184,0) 48%,
          rgba(242,125,184,.045) 62%,
          rgba(242,125,184,.12) 76%,
          rgba(232,201,211,.24) 100%);
      box-shadow:
        inset 0 0 34px rgba(242,125,184,.10),
        inset 0 0 78px rgba(242,125,184,.12);
      -webkit-backdrop-filter:blur(2.2px) saturate(1.03);
      backdrop-filter:blur(2.2px) saturate(1.03);
      -webkit-mask-image:radial-gradient(ellipse at center,transparent 0 46%,rgba(0,0,0,.15) 60%,rgba(0,0,0,.72) 80%,#000 100%);
      mask-image:radial-gradient(ellipse at center,transparent 0 46%,rgba(0,0,0,.15) 60%,rgba(0,0,0,.72) 80%,#000 100%);
      transition:opacity .45s cubic-bezier(.2,.8,.2,1);
    }
    .product-media:hover::after{opacity:1}
    .product-media img{transition:transform .65s cubic-bezier(.2,.8,.2,1),filter .45s ease!important}
    .product-media:hover img{filter:saturate(1.035) contrast(.985)}
    .product-label{z-index:4}
    @media (hover:none),(pointer:coarse){
      .product-media::after{display:none}
      .product-media:hover img{filter:none}
    }
  `;
  document.head.appendChild(productHoverStyle);

  // Rebuilt lookbook: a controlled editorial grid instead of the old masonry layout.
  // Parallax is intentionally neutralized here — the photography should feel aligned,
  // calm and premium rather than shifting out of the composition while scrolling.
  const lookbookStyle = document.createElement('style');
  lookbookStyle.textContent = `
    .lookbook{
      position:relative;
      overflow:hidden;
      background:linear-gradient(180deg,#fbf7f2 0%,#f5efe8 100%);
    }
    .lookbook-head{
      display:grid!important;
      grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr)!important;
      grid-template-rows:auto auto!important;
      column-gap:clamp(36px,6vw,96px)!important;
      row-gap:18px!important;
      align-items:end!important;
      margin-bottom:clamp(42px,5vw,72px)!important;
    }
    .lookbook-head>.eyebrow{
      grid-column:1!important;
      grid-row:1!important;
      align-self:start;
    }
    .lookbook-head h2{
      grid-column:1!important;
      grid-row:2!important;
      margin:0!important;
      max-width:860px;
      font-size:clamp(64px,6vw,110px)!important;
      line-height:.78!important;
    }
    .lookbook-head>p{
      grid-column:2!important;
      grid-row:2!important;
      margin:0 0 8px!important;
      max-width:410px;
      color:var(--muted);
      font-size:14px;
      line-height:1.75;
    }
    .lookbook-grid{
      display:grid!important;
      grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr)!important;
      grid-template-areas:
        "a b"
        "a word"
        "c d"
        "e f"!important;
      grid-template-rows:
        clamp(320px,30vw,500px)
        clamp(160px,12vw,210px)
        clamp(300px,25vw,410px)
        clamp(300px,25vw,410px)!important;
      gap:clamp(12px,1.35vw,22px)!important;
      align-items:stretch!important;
    }
    .lookbook-grid .look{
      margin:0!important;
      min-width:0!important;
      min-height:0!important;
      width:auto!important;
      height:auto!important;
      position:relative!important;
      overflow:hidden!important;
      border-radius:clamp(14px,1.4vw,24px)!important;
      background:#e8c9d3;
      box-shadow:inset 0 0 0 1px rgba(33,29,27,.06);
      isolation:isolate;
    }
    .lookbook-grid .look::after{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      background:linear-gradient(180deg,transparent 66%,rgba(33,29,27,.08));
      opacity:.45;
      transition:opacity .45s ease,background .45s ease;
      z-index:2;
    }
    .lookbook-grid .look img{
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      transform:none!important;
      transition:transform .8s cubic-bezier(.2,.8,.2,1),filter .55s ease!important;
      will-change:auto!important;
    }
    .lookbook-grid .look:hover img{
      transform:scale(1.025)!important;
      filter:saturate(1.025) contrast(.99);
    }
    .lookbook-grid .look:hover::after{
      opacity:.8;
      background:
        radial-gradient(ellipse at center,transparent 46%,rgba(242,125,184,.05) 70%,rgba(242,125,184,.15) 100%),
        linear-gradient(180deg,transparent 66%,rgba(33,29,27,.08));
    }
    .look--a{grid-area:a!important}
    .look--b{grid-area:b!important}
    .look--c{grid-area:c!important}
    .look--d{grid-area:d!important}
    .look--e{grid-area:e!important}
    .look--f{grid-area:f!important}
    .look--a img{object-position:center center!important}
    .look--b img{object-position:center 48%!important}
    .look--c img{object-position:center center!important}
    .look--d img{object-position:center center!important}
    .look--e img{object-position:center 58%!important}
    .look--f img{object-position:center center!important}

    .lookbook-word{
      grid-area:word!important;
      min-width:0!important;
      min-height:0!important;
      margin:0!important;
      padding:clamp(26px,3vw,48px)!important;
      border-radius:clamp(14px,1.4vw,24px)!important;
      background:var(--ink)!important;
      color:var(--champagne)!important;
      display:flex!important;
      flex-direction:column;
      justify-content:flex-end!important;
      align-items:flex-start!important;
      position:relative!important;
      overflow:hidden;
      font-family:var(--serif)!important;
      font-size:clamp(36px,3.4vw,62px)!important;
      line-height:.82!important;
      letter-spacing:-.045em!important;
      text-align:left!important;
    }
    .lookbook-word::before{
      content:"VALDI / EDITORIAL 2026";
      position:absolute;
      left:clamp(26px,3vw,48px);
      top:clamp(22px,2.4vw,34px);
      font-family:var(--sans);
      font-size:9px;
      line-height:1;
      letter-spacing:.17em;
      font-weight:700;
      color:rgba(245,239,232,.58);
    }
    .lookbook-word::after{
      content:"";
      position:absolute;
      width:180px;
      height:180px;
      border-radius:50%;
      right:-65px;
      top:-75px;
      background:rgba(242,125,184,.26);
      filter:blur(34px);
      pointer-events:none;
    }
    .lookbook-word em{color:var(--brand)!important;font-style:italic!important}

    @media (max-width:900px){
      .lookbook-head{
        grid-template-columns:1fr!important;
        grid-template-rows:auto!important;
        gap:18px!important;
      }
      .lookbook-head>.eyebrow,.lookbook-head h2,.lookbook-head>p{
        grid-column:1!important;
        grid-row:auto!important;
      }
      .lookbook-head h2{font-size:clamp(62px,11vw,92px)!important}
      .lookbook-head>p{max-width:620px!important}
      .lookbook-grid{
        grid-template-columns:1fr 1fr!important;
        grid-template-areas:
          "a a"
          "b c"
          "word word"
          "d e"
          "f f"!important;
        grid-template-rows:
          clamp(420px,72vw,650px)
          clamp(270px,42vw,380px)
          clamp(170px,24vw,220px)
          clamp(270px,42vw,380px)
          clamp(330px,55vw,520px)!important;
      }
    }

    @media (max-width:680px){
      .lookbook{padding-block:78px!important}
      .lookbook-head{margin-bottom:32px!important}
      .lookbook-head h2{font-size:clamp(52px,15vw,76px)!important}
      .lookbook-head>p{font-size:13px;line-height:1.65}
      .lookbook-grid{
        grid-template-columns:1fr 1fr!important;
        grid-template-areas:
          "a a"
          "word word"
          "b c"
          "d e"
          "f f"!important;
        grid-template-rows:
          clamp(390px,112vw,560px)
          170px
          clamp(210px,60vw,300px)
          clamp(210px,60vw,300px)
          clamp(300px,88vw,430px)!important;
        gap:10px!important;
      }
      .lookbook-grid .look,.lookbook-word{border-radius:14px!important}
      .lookbook-word{
        padding:24px!important;
        font-size:clamp(34px,10vw,48px)!important;
      }
      .lookbook-word::before{left:24px;top:22px;font-size:8px}
    }

    @media (max-width:340px){
      .lookbook-grid{
        grid-template-columns:1fr!important;
        grid-template-areas:"a" "word" "b" "c" "d" "e" "f"!important;
        grid-template-rows:auto!important;
      }
      .lookbook-grid .look{aspect-ratio:4/5}
      .look--a,.look--f{aspect-ratio:1/1!important}
      .lookbook-word{min-height:160px!important}
    }

    @media (hover:none),(pointer:coarse){
      .lookbook-grid .look:hover img{transform:none!important;filter:none!important}
    }
  `;
  document.head.appendChild(lookbookStyle);

  // Keep the marquee and the navigation locked together at the top of the viewport.
  // The measured announcement height is used instead of a hard-coded offset so the
  // layout stays correct on desktop, mobile and after responsive breakpoints change.
  const syncPinnedTopBars = () => {
    if (!announcement || !header) return;
    const announcementHeight = Math.round(announcement.getBoundingClientRect().height);

    announcement.style.position = 'fixed';
    announcement.style.top = '0';
    announcement.style.left = '0';
    announcement.style.right = '0';
    announcement.style.width = '100%';
    announcement.style.zIndex = '70';

    header.style.position = 'fixed';
    header.style.top = `${announcementHeight}px`;
    header.style.left = '0';
    header.style.right = '0';
    header.style.zIndex = '65';

    // Replaces the space the marquee used to occupy in normal document flow.
    body.style.paddingTop = `${announcementHeight}px`;

    // Anchor links should stop below both pinned bars instead of hiding underneath them.
    const compactHeaderHeight = window.innerWidth <= 680 ? 62 : 70;
    document.documentElement.style.scrollPaddingTop = `${announcementHeight + compactHeaderHeight + 12}px`;
  };

  syncPinnedTopBars();
  window.addEventListener('resize', syncPinnedTopBars, { passive: true });

  requestAnimationFrame(() => body.classList.add('loaded'));

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 36);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
  }
  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }
  menuToggle?.addEventListener('click', openMenu);
  menuClose?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    revealItems.forEach(el => revealObserver.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('is-visible'));
  }

  // Crystal shine follows the pointer inside buttons.
  if (!coarsePointer) {
    document.querySelectorAll('.crystal-btn, .btn').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${e.clientX - r.left}px`);
        btn.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--mx', '50%');
        btn.style.setProperty('--my', '50%');
      });
    });
  }

  // Soft parallax only on desktop/pointer devices. Lookbook images themselves are
  // visually locked by the editorial CSS above so the grid never drifts out of alignment.
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  let raf = null;
  function updateParallax() {
    raf = null;
    if (reduceMotion || coarsePointer || window.innerWidth < 900) return;
    const vh = window.innerHeight;
    parallaxEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / (vh / 2);
      const strength = Number(el.dataset.parallax || 12);
      const y = Math.max(-Math.abs(strength), Math.min(Math.abs(strength), -progress * strength));
      el.querySelector('img')?.style.setProperty('--parallax-y', `${y.toFixed(1)}px`);
    });
  }
  if (!reduceMotion) {
    window.addEventListener('scroll', () => {
      if (!raf) raf = requestAnimationFrame(updateParallax);
    }, { passive: true });
    window.addEventListener('resize', updateParallax, { passive: true });
    updateParallax();
  }

  function openModal(product) {
    selectedProduct.textContent = product || 'VALDI';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    setTimeout(() => modal.querySelector('.order-modal__close')?.focus(), 80);
  }
  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
  }
  document.querySelectorAll('.js-order').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.product)));
  modal?.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modal?.classList.contains('is-open')) closeModal();
      if (mobileMenu?.classList.contains('is-open')) closeMenu();
    }
  });

  // Keep FAQ calm: one item open at a time.
  const details = [...document.querySelectorAll('.faq-item')];
  details.forEach(item => item.addEventListener('toggle', () => {
    if (!item.open) return;
    details.forEach(other => { if (other !== item) other.open = false; });
  }));
})();
