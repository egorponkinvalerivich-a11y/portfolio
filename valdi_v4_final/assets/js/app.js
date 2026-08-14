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

    document.querySelectorAll('.product-cursor-zone').forEach(zone => {
      const cursor = zone.querySelector('.view-cursor');
      if (!cursor) return;
      zone.addEventListener('pointerenter', () => zone.classList.add('cursor-active'));
      zone.addEventListener('pointerleave', () => zone.classList.remove('cursor-active'));
      zone.addEventListener('pointermove', e => {
        const r = zone.getBoundingClientRect();
        cursor.style.left = `${e.clientX - r.left}px`;
        cursor.style.top = `${e.clientY - r.top}px`;
      });
    });
  }

  // Soft parallax only on desktop/pointer devices.
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
