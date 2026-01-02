export function initNavigation({
  navLinks,
  pages,
  pageContainer,
  siteHeader,
  skillsScroll,
  onPageChange,
  onResize,
}) {
  if (!pageContainer || navLinks.length === 0 || pages.length === 0) return null;

  const pageOrder = navLinks.map((link) => link.dataset.page).filter(Boolean);
  let activePage = document.querySelector('.page.is-active')?.dataset.page || pageOrder[0];
  let viewportWidth = window.innerWidth;

  const setViewportWidth = () => {
    viewportWidth = window.innerWidth;
  };

  const updateHeaderVisibility = () => {
    if (!siteHeader) return;

    if (activePage !== 'skills') {
      siteHeader.classList.remove('is-hidden');
      return;
    }

    if (!skillsScroll) return;
    siteHeader.classList.toggle('is-hidden', skillsScroll.scrollTop > 0);
  };

  const setPagePositions = (targetPage = activePage, offsetX = 0) => {
    const targetIndex = pageOrder.indexOf(targetPage);

    pages.forEach((page) => {
      const pageIndex = pageOrder.indexOf(page.dataset.page);
      const baseOffset = (pageIndex - targetIndex) * viewportWidth;
      page.style.transform = `translateX(${baseOffset + offsetX}px)`;
      page.classList.toggle('is-active', page.dataset.page === targetPage);
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.page === targetPage);
    });
  };

  const setActivePage = (nextPage) => {
    if (!nextPage || nextPage === activePage) {
      setPagePositions(activePage, 0);
      updateHeaderVisibility();
      onPageChange?.(activePage);
      return;
    }

    activePage = nextPage;
    setPagePositions(activePage, 0);
    updateHeaderVisibility();
    onPageChange?.(activePage);
  };

  const getAdjacentPage = (direction) => {
    const currentIndex = pageOrder.indexOf(activePage);
    const nextIndex = currentIndex + direction;
    return pageOrder[nextIndex];
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      setActivePage(link.dataset.page);
    });
  });

  let isDragging = false;
  let dragStarted = false;
  let startX = 0;
  let startY = 0;

  pageContainer.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;

    isDragging = true;
    dragStarted = false;
    startX = event.clientX;
    startY = event.clientY;
    pageContainer.setPointerCapture(event.pointerId);
  });

  pageContainer.addEventListener('pointermove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!dragStarted) {
      if (Math.abs(deltaX) < 8 || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }
      dragStarted = true;
      pageContainer.classList.add('is-dragging');
    }

    event.preventDefault();
    setPagePositions(activePage, deltaX);
  });

  const endDrag = (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const threshold = Math.min(140, viewportWidth * 0.2);

    pageContainer.classList.remove('is-dragging');

    if (dragStarted && Math.abs(deltaX) > threshold) {
      const direction = deltaX > 0 ? -1 : 1;
      setActivePage(getAdjacentPage(direction));
    } else {
      setPagePositions(activePage, 0);
    }

    isDragging = false;
    dragStarted = false;
  };

  pageContainer.addEventListener('pointerup', endDrag);
  pageContainer.addEventListener('pointercancel', endDrag);

  window.addEventListener('resize', () => {
    setViewportWidth();
    setPagePositions(activePage, 0);
    onResize?.();
  });

  if (skillsScroll) {
    skillsScroll.addEventListener('scroll', () => {
      if (activePage !== 'skills') return;
      updateHeaderVisibility();
    }, { passive: true });
  }

  setViewportWidth();
  setPagePositions(activePage, 0);
  updateHeaderVisibility();
  onPageChange?.(activePage);

  return {
    getActivePage: () => activePage,
  };
}