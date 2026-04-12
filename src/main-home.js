import { mountApp } from './core/app.js';
import { renderContactPage } from './pages/contact.js';
import { renderHomePage } from './pages/home.js';
import { renderProjectsPage } from './pages/projects.js';

mountApp({
  initialPageId: 'skills',
  routes: {
    skills: renderHomePage,
    projects: renderProjectsPage,
    contact: renderContactPage,
  },
});
