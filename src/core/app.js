import '../styles/main.css';

import logoUrl from '../images/logo.svg';
import { defaultLanguage, STORAGE_KEY, siteCopy } from '../data/site.js';

const pageOrder = ['projects', 'skills', 'contact'];
const routeSegments = {
  skills: '',
  projects: 'projects',
  contact: 'contact',
};

function translateValue(value, language) {
  if (typeof value === 'string') return value;
  return value?.[language] ?? value?.[defaultLanguage] ?? '';
}

function getLanguage() {
  return window.localStorage.getItem(STORAGE_KEY) || defaultLanguage;
}

function setLanguage(language) {
  window.localStorage.setItem(STORAGE_KEY, language);
}

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function getBasePathFromLocation(initialPageId) {
  const pathname = normalizePathname(window.location.pathname);
  const segment = routeSegments[initialPageId];
  if (!segment) return pathname;

  const suffix = `/${segment}/`;
  if (!pathname.endsWith(suffix)) return '/';

  const basePath = pathname.slice(0, -suffix.length);
  return normalizePathname(basePath || '/');
}

function getPathForPage(basePath, pageId) {
  const segment = routeSegments[pageId];
  if (!segment) return normalizePathname(basePath);
  return normalizePathname(`${basePath}${segment}/`);
}

function getHref(basePath, targetPage) {
  return getPathForPage(basePath, targetPage);
}

function resolvePageIdFromLocation(routes, fallbackPageId, basePath) {
  const pathname = normalizePathname(window.location.pathname);
  const match = Object.values(routes).find((page) => {
    const routePath = getPathForPage(basePath, page.pageId);
    return pathname === routePath;
  });

  return match?.pageId ?? fallbackPageId;
}

function renderHeader(currentPage, language, basePath) {
  const navItems = pageOrder
    .map((pageId) => {
      const label = translateValue(siteCopy.nav[pageId], language).toUpperCase();
      const active = currentPage === pageId ? 'is-active' : '';
      return `
        <a class="site-nav__link ${active}" href="${getHref(basePath, pageId)}" data-nav-link="${pageId}">
          <span>${label}</span>
        </a>
      `;
    })
    .join('');

  return `
    <header class="site-header">
      <div class="site-header__inner">
        <a class="site-logo" href="${getHref(basePath, 'skills')}" data-nav-link="skills" aria-label="Nathan Theophile home">
          <img src="${logoUrl}" alt="" />
        </a>
        <nav class="site-nav" aria-label="${translateValue(siteCopy.navAriaLabel, language)}">
          ${navItems}
        </nav>
        <div class="lang-switch" role="group" aria-label="${translateValue(siteCopy.languageSwitch, language)}">
          <button class="lang-switch__button ${language === 'en' ? 'is-active' : ''}" type="button" data-language="en" aria-pressed="${language === 'en'}">
            <span class="lang-switch__text" aria-hidden="true">EN</span>
            <span class="sr-only">English</span>
          </button>
          <span class="lang-switch__divider" aria-hidden="true"></span>
          <button class="lang-switch__button ${language === 'fr' ? 'is-active' : ''}" type="button" data-language="fr" aria-pressed="${language === 'fr'}">
            <span class="lang-switch__text" aria-hidden="true">FR</span>
            <span class="sr-only">Francais</span>
          </button>
        </div>
      </div>
    </header>
  `;
}

function setupRevealObserver(root) {
  const items = Array.from(root.querySelectorAll('[data-reveal]'));
  if (!items.length) return () => {};

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  items.forEach((item) => observer.observe(item));
  return () => observer.disconnect();
}

function shouldInterceptNavigation(event, anchor) {
  if (!anchor) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return true;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function mountApp({ routes, initialPageId }) {
  const app = document.querySelector('#app');
  if (!app) return;

  const routeEntries = Object.fromEntries(Object.values(routes).map((page) => [page.pageId, page]));
  const basePath = getBasePathFromLocation(initialPageId);
  let currentLanguage = getLanguage();
  let currentPageId = resolvePageIdFromLocation(routeEntries, initialPageId, basePath);
  let currentCleanup = () => {};
  let currentRevealCleanup = () => {};
  let renderToken = 0;

  const renderShell = () => {
    app.innerHTML = `
      <div class="site-shell page-${currentPageId}">
        <div class="site-header-shell">${renderHeader(currentPageId, currentLanguage, basePath)}</div>
        <main class="page-content"></main>
      </div>
    `;
  };

  const getShell = () => app.querySelector('.site-shell');
  const getHeaderShell = () => app.querySelector('.site-header-shell');
  const getMain = () => app.querySelector('.page-content');

  const syncHeader = ({ rerender = false } = {}) => {
    const headerShell = getHeaderShell();
    if (!headerShell) return;

    if (rerender || !headerShell.querySelector('.site-header')) {
      headerShell.innerHTML = renderHeader(currentPageId, currentLanguage, basePath);
      return;
    }

    const logo = headerShell.querySelector('.site-logo');
    if (logo) {
      logo.setAttribute('href', getHref(basePath, 'skills'));
    }

    headerShell.querySelectorAll('[data-nav-link]').forEach((link) => {
      const targetPage = link.dataset.navLink;
      if (!targetPage) return;
      if (link.classList.contains('site-logo')) return;
      link.setAttribute('href', getHref(basePath, targetPage));
      link.classList.toggle('is-active', targetPage === currentPageId);
    });

    headerShell.querySelectorAll('[data-language]').forEach((button) => {
      const nextLanguage = button.dataset.language;
      const isActive = nextLanguage === currentLanguage;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  const applyPageState = (pageId) => {
    currentPageId = pageId;
    document.documentElement.lang = currentLanguage;
    document.title = translateValue(siteCopy.metaTitles[pageId], currentLanguage);
    document.body.dataset.page = pageId;
    const shell = getShell();
    if (shell) shell.className = `site-shell page-${pageId}`;
  };

  const renderCurrentPage = async ({ pageId, pushUrl, replace = false, animate = true, rerenderHeader = false } = {}) => {
    const nextPageId = pageId ?? currentPageId;
    const pageConfig = routeEntries[nextPageId];
    const main = getMain();
    if (!pageConfig || !main) return;

    const thisRenderToken = ++renderToken;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldAnimate = animate && !reducedMotion;

    if (shouldAnimate) {
      main.classList.remove('is-transitioning-in', 'is-transitioned');
      main.classList.add('is-transitioning-out');
      await wait(120);
      if (thisRenderToken !== renderToken) return;
    }

    currentCleanup?.();
    currentRevealCleanup?.();
    currentCleanup = () => {};
    currentRevealCleanup = () => {};

    applyPageState(nextPageId);
    syncHeader({ rerender: rerenderHeader });

    main.innerHTML = pageConfig.createContent({
      language: currentLanguage,
      t: (value) => translateValue(value, currentLanguage),
    });

    main.scrollTop = 0;
    main.scrollLeft = 0;
    currentRevealCleanup = setupRevealObserver(main);

    const cleanup = pageConfig.enhance?.({
      root: app,
      pageRoot: main,
      language: currentLanguage,
      t: (value) => translateValue(value, currentLanguage),
      rerender: () => renderCurrentPage({ pageId: currentPageId, animate: false, rerenderHeader: true }),
      navigateTo: (targetPageId, options = {}) => renderCurrentPage({ pageId: targetPageId, ...options }),
    });

    if (typeof cleanup === 'function') {
      currentCleanup = cleanup;
    }

    if (pushUrl) {
      const targetUrl = new URL(pushUrl, window.location.href);
      const state = { pageId: nextPageId };
      if (replace) {
        window.history.replaceState(state, '', targetUrl);
      } else {
        window.history.pushState(state, '', targetUrl);
      }
    }

    if (shouldAnimate) {
      main.classList.remove('is-transitioning-out');
      main.classList.add('is-transitioning-in');
      requestAnimationFrame(() => {
        main.classList.add('is-transitioned');
      });
      window.setTimeout(() => {
        if (thisRenderToken !== renderToken) return;
        main.classList.remove('is-transitioning-in', 'is-transitioned');
      }, 220);
    } else {
      main.classList.remove('is-transitioning-out', 'is-transitioning-in', 'is-transitioned');
    }
  };

  renderShell();
  applyPageState(currentPageId);
  syncHeader({ rerender: true });
  window.history.replaceState({ pageId: currentPageId }, '', window.location.href);
  renderCurrentPage({ pageId: currentPageId, animate: false, replace: true });

  app.addEventListener('click', (event) => {
    const languageButton = event.target.closest('[data-language]');
    if (languageButton) {
      const nextLanguage = languageButton.dataset.language;
      if (!nextLanguage || nextLanguage === currentLanguage) return;
      currentLanguage = nextLanguage;
      setLanguage(nextLanguage);
      renderCurrentPage({ pageId: currentPageId, animate: false, rerenderHeader: true, replace: true, pushUrl: window.location.href });
      return;
    }

    const navLink = event.target.closest('[data-nav-link]');
    if (!shouldInterceptNavigation(event, navLink)) return;

    const targetPageId = navLink.dataset.navLink;
    if (!targetPageId || !routeEntries[targetPageId]) return;

    event.preventDefault();
    if (targetPageId === currentPageId) return;
    renderCurrentPage({ pageId: targetPageId, pushUrl: navLink.href });
  });

  window.addEventListener('popstate', () => {
    const nextPageId = resolvePageIdFromLocation(routeEntries, currentPageId, basePath);
    renderCurrentPage({ pageId: nextPageId, animate: false });
  });
}
