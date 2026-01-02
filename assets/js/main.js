import { createLeafFall } from './modules/leaf-fall.js';
import { createMouseTrail } from './modules/mouse-trail.js';
import { initNavigation } from './modules/navigation.js';
import { initSkillsWaves } from './modules/skills-waves.js';

const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
const pages = Array.from(document.querySelectorAll('.page'));
const pageContainer = document.querySelector('.page-container');
const siteHeader = document.querySelector('.site-header');
const skillsScroll = document.querySelector('.skills-scroll');
const leafLayer = document.querySelector('.leaf-fall-layer');
const skillsIntro = document.querySelector('.skills-panel--intro');
const skillsIntroImage = skillsIntro?.querySelector('img');
const trailCanvas = document.querySelector('.mouse-trail');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let activePage = null;

const leafFall = createLeafFall({
  leafLayer,
  skillsIntroImage,
  prefersReducedMotion,
});

const mouseTrail = createMouseTrail({
  trailCanvas,
  pageContainer,
  prefersReducedMotion,
});

const navigation = initNavigation({
  navLinks,
  pages,
  pageContainer,
  siteHeader,
  skillsScroll,
  onPageChange: (nextPage) => {
    activePage = nextPage;
    leafFall?.setActivePage(nextPage);
  },
  onResize: () => {
    mouseTrail?.resize();
  },
});

initSkillsWaves({ prefersReducedMotion });

if (prefersReducedMotion?.addEventListener) {
  prefersReducedMotion.addEventListener('change', () => {
    const currentPage = activePage ?? navigation?.getActivePage?.();
    leafFall?.handleReducedMotionChange(currentPage);
    mouseTrail?.handleReducedMotionChange();
  });
}