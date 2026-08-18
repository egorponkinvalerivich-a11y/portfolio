(() => {
  const body = document.body;
  const header = document.getElementById('siteHeader');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  let lastFocused = null;

  const setScrollState = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  setScrollState();
  window.addEventListener('scroll', setScrollState, { passive: true });

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
  }

  if (!coarsePointer) {
    document.querySelectorAll('.button').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        button.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });
  }

  const menu = document.getElementById('mobileMenu');
  const menuToggle = document.querySelector('.menu-toggle');
  const openMenu = () => {
    lastFocused = document.activeElement;
    menu?.classList.add('is-open');
    menu?.setAttribute('aria-hidden', 'false');
    menuToggle?.setAttribute('aria-expanded', 'true');
    body.classList.add('menu-open');
    menu?.querySelector('[data-close-menu]')?.focus();
  };
  const closeMenu = () => {
    menu?.classList.remove('is-open');
    menu?.setAttribute('aria-hidden', 'true');
    menuToggle?.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  };
  menuToggle?.addEventListener('click', openMenu);
  document.querySelector('[data-close-menu]')?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  document.querySelectorAll('.faq details').forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      document.querySelectorAll('.faq details').forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  const catalogTabs = [...document.querySelectorAll('[data-catalog-tab]')];
  const catalogPanels = [...document.querySelectorAll('[data-catalog-panel]')];
  const showCatalog = (catalogName, focusTab = false) => {
    catalogTabs.forEach((tab) => {
      const active = tab.dataset.catalogTab === catalogName;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focusTab) tab.focus();
    });
    catalogPanels.forEach((panel) => {
      const active = panel.dataset.catalogPanel === catalogName;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
      if (active) panel.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
    });
  };

  catalogTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showCatalog(tab.dataset.catalogTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const next = catalogTabs[(index + direction + catalogTabs.length) % catalogTabs.length];
      showCatalog(next.dataset.catalogTab, true);
    });
  });
  document.querySelectorAll('[data-catalog-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      showCatalog(link.dataset.catalogLink);
      document.getElementById('shop')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });
  showCatalog('beaded');

  const orderModal = document.getElementById('orderModal');
  const selectedProduct = document.querySelector('[data-selected-product]');
  const openOrder = (product = 'VALDI') => {
    lastFocused = document.activeElement;
    if (selectedProduct) selectedProduct.textContent = product;
    orderModal?.classList.add('is-open');
    orderModal?.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    window.setTimeout(() => orderModal?.querySelector('.order-modal__close')?.focus(), 60);
  };
  const closeOrder = () => {
    orderModal?.classList.remove('is-open');
    orderModal?.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    lastFocused?.focus?.();
  };
  document.querySelectorAll('[data-order]').forEach((button) => {
    button.addEventListener('click', () => openOrder(button.dataset.order));
  });
  document.querySelectorAll('[data-close-order]').forEach((button) => button.addEventListener('click', closeOrder));

  const viewer = document.querySelector('.product-viewer');
  const viewerImage = document.querySelector('[data-viewer-image]');
  const viewerTitle = document.querySelector('[data-viewer-title]');
  const viewerType = document.querySelector('[data-viewer-type]');
  const viewerCount = document.querySelector('[data-viewer-count]');
  const viewerThumbs = document.querySelector('[data-viewer-thumbs]');
  const viewerPrev = document.querySelector('[data-viewer-prev]');
  const viewerNext = document.querySelector('[data-viewer-next]');
  let viewerImages = [];
  let viewerIndex = 0;
  let viewerProduct = null;
  let viewerReturnFocus = null;

  const setViewerImage = (index) => {
    if (!viewerImages.length || !viewerImage) return;
    viewerIndex = (index + viewerImages.length) % viewerImages.length;
    viewerImage.src = viewerImages[viewerIndex];
    viewerImage.alt = `${viewerProduct?.name || 'VALDI'} — фото ${viewerIndex + 1}`;
    if (viewerCount) viewerCount.textContent = `${String(viewerIndex + 1).padStart(2, '0')} / ${String(viewerImages.length).padStart(2, '0')}`;
    viewerThumbs?.querySelectorAll('button').forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === viewerIndex);
      button.setAttribute('aria-current', buttonIndex === viewerIndex ? 'true' : 'false');
    });
    const single = viewerImages.length < 2;
    if (viewerPrev) viewerPrev.disabled = single;
    if (viewerNext) viewerNext.disabled = single;
  };

  const openViewer = (card) => {
    viewerReturnFocus = document.activeElement;
    viewerProduct = { name: card.dataset.name, type: card.dataset.type };
    viewerImages = [card.dataset.image, card.dataset.altImage].filter(Boolean);
    if (viewerTitle) viewerTitle.textContent = viewerProduct.name;
    if (viewerType) viewerType.textContent = viewerProduct.type;
    if (viewerThumbs) {
      viewerThumbs.innerHTML = viewerImages.map((image, index) => `<button type="button" aria-label="Показать фото ${index + 1}"><img src="${image}" alt=""></button>`).join('');
      viewerThumbs.querySelectorAll('button').forEach((button, index) => button.addEventListener('click', () => setViewerImage(index)));
    }
    setViewerImage(0);
    viewer?.classList.add('is-open');
    viewer?.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    window.setTimeout(() => viewer?.querySelector('.product-viewer__close')?.focus(), 60);
  };

  const closeViewer = (restoreFocus = true) => {
    viewer?.classList.remove('is-open');
    viewer?.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    if (restoreFocus) viewerReturnFocus?.focus?.();
  };

  document.querySelectorAll('.product-card').forEach((card) => {
    const media = card.querySelector('.product-card__media');
    if (!media) return;
    const primary = media.querySelector('img');
    if (primary) {
      primary.loading = 'lazy';
      primary.decoding = 'async';
    }
    if (card.dataset.altImage) {
      const alternate = document.createElement('img');
      alternate.className = 'product-card__alt';
      alternate.src = card.dataset.altImage;
      alternate.alt = `${card.dataset.name} в образе`;
      alternate.loading = 'lazy';
      alternate.decoding = 'async';
      media.insertBefore(alternate, media.querySelector('.product-card__type'));
    }
    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'product-card__open';
    openButton.setAttribute('aria-label', `Открыть фотографии ${card.dataset.name}`);
    openButton.addEventListener('click', () => openViewer(card));
    media.insertBefore(openButton, media.querySelector('.product-card__type'));
    const photoCount = document.createElement('span');
    photoCount.className = 'product-card__photo-count';
    photoCount.textContent = card.dataset.altImage ? '02 ФОТО' : '01 ФОТО';
    media.appendChild(photoCount);
  });

  document.querySelectorAll('[data-close-viewer]').forEach((button) => button.addEventListener('click', () => closeViewer()));
  viewerPrev?.addEventListener('click', () => setViewerImage(viewerIndex - 1));
  viewerNext?.addEventListener('click', () => setViewerImage(viewerIndex + 1));
  document.querySelector('[data-viewer-order]')?.addEventListener('click', () => {
    const restoreTarget = viewerReturnFocus;
    closeViewer(false);
    openOrder(viewerProduct?.name || 'VALDI');
    lastFocused = restoreTarget;
  });

  const drawer = document.querySelector('.saved-drawer');
  const savedList = document.querySelector('[data-saved-list]');
  const catalog = [...document.querySelectorAll('.product-card')].map((card) => ({
    id: card.dataset.id,
    name: card.dataset.name,
    type: card.dataset.type,
    image: card.dataset.image,
    card,
  }));
  const storageKey = 'valdi_saved_bags_v2';
  let saved = [];

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    saved = Array.isArray(stored) ? stored.filter((id) => catalog.some((item) => item.id === id)) : [];
  } catch (_) {
    saved = [];
  }

  const persist = () => {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch (_) { /* Storage is optional. */ }
  };

  const renderSaved = () => {
    const chosen = saved.map((id) => catalog.find((item) => item.id === id)).filter(Boolean);
    document.querySelectorAll('[data-saved-count]').forEach((counter) => { counter.textContent = String(chosen.length); });
    document.querySelectorAll('[data-saved-total]').forEach((counter) => { counter.textContent = String(chosen.length); });

    catalog.forEach((item) => {
      const button = item.card.querySelector('.save-button');
      const active = saved.includes(item.id);
      button?.classList.toggle('is-saved', active);
      button?.setAttribute('aria-pressed', String(active));
      button?.setAttribute('aria-label', `${active ? 'Убрать' : 'Добавить'} ${item.name} ${active ? 'из' : 'в'} выбранное`);
    });

    if (!savedList) return;
    if (!chosen.length) {
      savedList.innerHTML = '<div class="saved-empty">Здесь появятся модели, которые вам понравились. Нажмите на маленькую сумку в карточке товара.</div>';
      return;
    }

    savedList.innerHTML = chosen.map((item) => `
      <article class="saved-item">
        <img src="${item.image}" alt="${item.name}">
        <div><h3>${item.name}</h3><p>${item.type} · HANDMADE</p></div>
        <button type="button" data-remove-saved="${item.id}" aria-label="Убрать ${item.name}">×</button>
      </article>`).join('');
    savedList.querySelectorAll('[data-remove-saved]').forEach((button) => {
      button.addEventListener('click', () => toggleSaved(button.dataset.removeSaved));
    });
  };

  function toggleSaved(id) {
    saved = saved.includes(id) ? saved.filter((savedId) => savedId !== id) : [...saved, id];
    persist();
    renderSaved();
  }

  catalog.forEach((item) => {
    item.card.querySelector('.save-button')?.addEventListener('click', () => toggleSaved(item.id));
  });

  const openSaved = () => {
    lastFocused = document.activeElement;
    drawer?.classList.add('is-open');
    drawer?.setAttribute('aria-hidden', 'false');
    body.classList.add('modal-open');
    window.setTimeout(() => drawer?.querySelector('[data-close-saved]')?.focus(), 60);
  };
  const closeSaved = (restoreFocus = true) => {
    drawer?.classList.remove('is-open');
    drawer?.setAttribute('aria-hidden', 'true');
    body.classList.remove('modal-open');
    if (restoreFocus) lastFocused?.focus?.();
  };
  document.querySelectorAll('[data-open-saved]').forEach((button) => button.addEventListener('click', openSaved));
  document.querySelectorAll('[data-close-saved]').forEach((button) => button.addEventListener('click', () => closeSaved()));
  document.querySelector('[data-order-saved]')?.addEventListener('click', () => {
    const names = saved.map((id) => catalog.find((item) => item.id === id)?.name).filter(Boolean);
    closeSaved(false);
    openOrder(names.length ? `Выбранные модели: ${names.join(', ')}` : 'Индивидуальная VALDI');
  });
  renderSaved();

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (orderModal?.classList.contains('is-open')) closeOrder();
    else if (viewer?.classList.contains('is-open')) closeViewer();
    else if (drawer?.classList.contains('is-open')) closeSaved();
    else if (menu?.classList.contains('is-open')) {
      closeMenu();
      lastFocused?.focus?.();
    }
  });
})();
