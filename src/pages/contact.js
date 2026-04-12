import { siteCopy } from '../data/site.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderContactIcon(icon) {
  const icons = {
    email: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 6.5h16v11H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="m5.2 7.5 6.8 5.4 6.8-5.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `,
    linkedin: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.8 9v8.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        <path d="M6.8 6.2a.65.65 0 1 1 0 1.3.65.65 0 0 1 0-1.3Z" fill="currentColor" />
        <path d="M12 17.4V9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        <path d="M12 11.7c.7-1.4 1.8-2.1 3.3-2.1 1.8 0 2.9 1.2 2.9 3.8v4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `,
    teams: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.8 7.2h8.3v9.6H4.8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M8.95 9.2v5.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M7 9.2h3.9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        <path d="M15.2 9.1h2.5a1.5 1.5 0 0 1 1.5 1.5v4a2.4 2.4 0 0 1-2.4 2.4h-1.6a2 2 0 0 1-2-2v-3.8a2.1 2.1 0 0 1 2-2.1Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
      </svg>
    `,
    discord: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.2 8.2c1.5-1 3.1-1.4 4.8-1.4 1.7 0 3.3.5 4.8 1.4.9 1.6 1.4 3.4 1.5 5.2-1 1-2.2 1.7-3.5 2.2l-.8-1.3c.6-.2 1.2-.5 1.7-.9-.2.2-.4.3-.6.4-1 .5-2 .7-3.1.7s-2.1-.2-3.1-.7c-.2-.1-.4-.2-.6-.4.5.4 1 .7 1.7.9l-.8 1.3c-1.3-.5-2.5-1.2-3.5-2.2.1-1.8.6-3.6 1.5-5.2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
        <path d="M9.7 12.1h.02" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
        <path d="M14.3 12.1h.02" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" />
      </svg>
    `,
    steam: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M14.9 6.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" fill="none" stroke="currentColor" stroke-width="1.8" />
        <path d="M11.7 12.5 8.4 10.9a2.8 2.8 0 1 0-1.4 4.2 2.8 2.8 0 0 0 2.5-1.5l2.9 1.3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M12 12.3 16 9.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    `,
    creative: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m5 5 14 7-14 7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
        <path d="M8.1 3.8v16.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      </svg>
    `,
  };

  return icons[icon] ?? icons.email;
}

function renderContactMethod(method, index) {
  const href = method.href ?? '';
  const isExternal = href.startsWith('http');
  const tag = href ? 'a' : 'div';
  const attrs = href
    ? `href="${escapeHtml(href)}" target="${isExternal ? '_blank' : '_self'}" rel="${isExternal ? 'noreferrer' : ''}"`
    : '';

  return `
    <${tag}
      class="contact-directory__item"
      style="transition-delay:${index * 60}ms"
      data-reveal
      ${attrs}
      aria-label="${escapeHtml(method.label)}"
    >
      <span class="contact-directory__icon">${renderContactIcon(method.icon)}</span>
      <span class="contact-directory__meta">
        <span class="contact-directory__label">${escapeHtml(method.label)}</span>
        <span class="contact-directory__value">${escapeHtml(method.display ?? method.value)}</span>
      </span>
    </${tag}>
  `;
}

export const renderContactPage = {
  pageId: 'contact',
  createContent: ({ t }) => {
    const bodyMarkup = t(siteCopy.contactPage.body)
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join('');

    const methodsMarkup = siteCopy.contactPage.methods
      .map((method, index) => renderContactMethod(method, index))
      .join('');

    return `
      <section class="contact-slate">
        <div class="contact-slate__inner">
          <div class="contact-slate__main">
            <article class="contact-slate__identity" data-reveal>
              <div class="contact-slate__identity-row">
                <div class="contact-slate__portrait" aria-hidden="true">
                  <div class="contact-slate__portrait-frame">
                    <span class="contact-slate__portrait-label">${escapeHtml(t(siteCopy.contactPage.portraitPlaceholder))}</span>
                  </div>
                </div>
                <div class="contact-slate__copy">
                  <h1 class="contact-slate__title">${escapeHtml(t(siteCopy.contactPage.title))}</h1>
                  <p class="contact-slate__lead">${escapeHtml(t(siteCopy.contactPage.intro))}</p>
                </div>
              </div>
            </article>

            <div class="contact-slate__divider" data-reveal aria-hidden="true"></div>

            <div class="contact-slate__body" data-reveal>
              ${bodyMarkup}
            </div>

            <aside class="contact-slate__quote" data-reveal>
              <p>${escapeHtml(t(siteCopy.contactPage.quote.text))}</p>
              <footer>${escapeHtml(t(siteCopy.contactPage.quote.author))}</footer>
            </aside>
          </div>

          <aside class="contact-directory" data-reveal>
            <p class="contact-directory__intro">${escapeHtml(t(siteCopy.contactPage.contactsIntro))}</p>
            <div class="contact-directory__list">
              ${methodsMarkup}
            </div>
          </aside>
        </div>

        <svg class="contact-slate__wave" viewBox="0 0 1600 220" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 166 C 130 182, 260 110, 382 116 C 492 120, 560 156, 700 158 C 886 160, 1014 126, 1172 118 C 1330 110, 1456 138, 1600 188" />
        </svg>
      </section>
    `;
  },
};
