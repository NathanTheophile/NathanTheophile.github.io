const navLinks = document.querySelectorAll('.nav-links a');
const pages = document.querySelectorAll('.page');
let isTransitioning = false;

const transitionMap = {
  'skills:projects': 'right',
  'skills:contact': 'left',
  'projects:skills': 'left',
  'projects:contact': 'left',
  'contact:skills': 'right',
  'contact:projects': 'right',
};

const setHiddenPosition = (page, direction) => {
  page.classList.remove('is-hidden-left', 'is-hidden-right');
  if (direction === 'left') {
    page.classList.add('is-hidden-left');
  } else {
    page.classList.add('is-hidden-right');
  }
};

const setActiveLink = (targetPage) => {
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.page === targetPage);
  });
};

const initializePages = () => {
  pages.forEach((page) => {
    if (page.classList.contains('is-active')) {
      page.classList.remove('is-hidden-left', 'is-hidden-right');
      return;
    }
    page.classList.remove('is-active');
    page.classList.add('is-hidden-right');
  });
};

const switchPage = (targetPage) => {
  if (isTransitioning) return;
  const currentPage = document.querySelector('.page.is-active');
  if (!currentPage) return;
  const currentKey = currentPage.dataset.page;
  if (currentKey === targetPage) return;

  const nextPage = document.querySelector(`.page[data-page="${targetPage}"]`);
  if (!nextPage) return;

  const direction = transitionMap[`${currentKey}:${targetPage}`] || 'right';
  const outgoingDirection = direction === 'right' ? 'right' : 'left';
  const incomingStart = direction === 'right' ? 'left' : 'right';

  isTransitioning = true;

  setHiddenPosition(nextPage, incomingStart);
  nextPage.classList.remove('is-active');

  requestAnimationFrame(() => {
    currentPage.classList.remove('is-active');
    setHiddenPosition(currentPage, outgoingDirection);

    nextPage.classList.add('is-active');
    nextPage.classList.remove('is-hidden-left', 'is-hidden-right');

    setActiveLink(targetPage);

    const onTransitionEnd = (event) => {
      if (event.target !== nextPage) return;
      nextPage.removeEventListener('transitionend', onTransitionEnd);
      isTransitioning = false;
    };

    nextPage.addEventListener('transitionend', onTransitionEnd);
  });
};

initializePages();

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetPage = link.dataset.page;
    if (!targetPage) return;
    switchPage(targetPage);
  });
});