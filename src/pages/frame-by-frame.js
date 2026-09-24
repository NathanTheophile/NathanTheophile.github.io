const copy = {
  fr: {
    available: 'Gameplay programmer · Unity / C#',
    intro: 'Je construis des mécaniques lisibles, puis je les relis image par image.',
    desk: 'FRAME BY FRAME / 01',
    capture: 'Bureau de capture',
    project: 'Projet documenté',
    title: "Marrow: The Crypt’s Hollow",
    known: 'Fiche projet',
    platformer: 'Plateforme 2D',
    year: '2026',
    role: 'Dev Gameplay',
    evidence: 'Les données disponibles nomment le projet, l’année, le rôle et le genre. Aucune capture, vidéo, contribution détaillée ou résultat chiffré n’est renseigné.',
    viewport: 'VUE DE TRAVAIL · SCHÉMA',
    fallback: 'Capture gameplay non fournie',
    schema: 'Schéma de lecture — ne représente pas une capture du jeu.',
    events: ['Entrée en mouvement', 'Approche du bord', 'Impulsion'],
    notes: [
      'Le personnage entre dans la séquence. Repère de lecture ajouté pour structurer une future revue de capture.',
      'Le cadre se resserre sur le bord. Ce point permettrait de comparer la lecture visuelle à la fenêtre d’action.',
      'L’impulsion clôt la séquence schématique. Les paramètres réels du saut ne sont pas renseignés.',
    ],
    note: 'Annotation de revue',
    track: 'Séquence schématique · 00:26',
    play: 'Lire les repères',
    pause: 'Mettre en pause',
    previous: 'Repère précédent',
    next: 'Repère suivant',
    contact: 'Me contacter',
    work: 'Voir les projets',
    footer: 'Portfolio de Nathan Theophile',
    markers: ['Mouvement', 'Bord', 'Impulsion'],
    frame: ['Position de départ', 'Approche du bord', 'Impulsion schématique'],
  },
  en: {
    available: 'Gameplay programmer · Unity / C#',
    intro: 'I build readable mechanics, then review them frame by frame.',
    desk: 'FRAME BY FRAME / 01',
    capture: 'Gameplay capture desk',
    project: 'Project record',
    title: "Marrow: The Crypt’s Hollow",
    known: 'Known project data',
    platformer: '2D platformer',
    year: '2026',
    role: 'Gameplay Dev',
    evidence: 'Available data names the project, year, role and genre. No capture, video, detailed contribution or measured outcome is provided.',
    viewport: 'WORK VIEW · SCHEMATIC',
    fallback: 'Gameplay capture not provided',
    schema: 'Review schematic — this is not a frame from the game.',
    events: ['Movement begins', 'Approach to edge', 'Impulse'],
    notes: [
      'The character enters the sequence. This review marker structures a future capture walkthrough.',
      'The frame closes in on the edge. This point could help compare visual reading with the action window.',
      'The impulse closes the schematic sequence. Actual jump settings are not documented.',
    ],
    note: 'Review annotation',
    track: 'Schematic sequence · 00:26',
    play: 'Play markers',
    pause: 'Pause',
    previous: 'Previous marker',
    next: 'Next marker',
    contact: 'Get in touch',
    work: 'View projects',
    footer: 'Portfolio of Nathan Theophile',
    markers: ['Movement', 'Edge', 'Impulse'],
    frame: ['Starting position', 'Approaching the edge', 'Schematic impulse'],
  },
};

const markers = [4, 12, 19];
const duration = 26;

function timecode(seconds) {
  return `00:${String(seconds).padStart(2, '0')}`;
}

function drawing(index) {
  return `
    <svg class="capture-drawing capture-drawing--${index}" viewBox="0 0 720 390" role="img" aria-label="${['Schematic player at the starting position', 'Schematic player approaching a platform edge', 'Schematic player in a jump pose'][index]}">
      <defs>
        <linearGradient id="caveGlow" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#223532"/><stop offset="1" stop-color="#111b21"/></linearGradient>
        <linearGradient id="floorGlow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#384639"/><stop offset="1" stop-color="#1b2926"/></linearGradient>
        <pattern id="grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".6" fill="#d8bd79" opacity=".18"/></pattern>
      </defs>
      <rect width="720" height="390" fill="url(#caveGlow)"/>
      <circle cx="${index === 0 ? 172 : 248}" cy="132" r="118" fill="#c8b168" opacity=".07"/>
      <path d="M0 0h720v72l-104 18-80-39-91 56-79-37-97 42-90-33L0 104Z" fill="#0e171c" opacity=".75"/>
      <path d="m0 248 116-42 96 20 115-54 83 52 111-31 95 41 104-17v173H0Z" fill="#182520"/>
      <path d="M0 301h${index === 2 ? 390 : index === 1 ? 510 : 610}l24 25v64H0Z" fill="url(#floorGlow)"/>
      ${index === 2 ? '<path d="M0 301h390l24 25v64H0Z" fill="url(#grain)"/>' : ''}
      <path d="M36 302h${index === 2 ? 346 : index === 1 ? 466 : 566}" stroke="#b7a676" stroke-opacity=".4" stroke-width="2" stroke-dasharray="3 10"/>
      <g class="capture-ghost" opacity=".28" transform="translate(${index === 0 ? 104 : index === 1 ? 278 : 354} ${index === 2 ? 115 : 181})">
        <path d="M-12 24q12-14 24 0l6 27h-36Z" fill="#d9bc74"/><circle cy="12" r="13" fill="#d9bc74"/>
      </g>
      <g class="capture-player" transform="translate(${index === 0 ? 212 : index === 1 ? 444 : 476} ${index === 2 ? 106 : 174})">
        <ellipse cy="84" rx="32" ry="8" fill="#070d10" opacity=".52"/>
        <path d="M-17 39q0-17 17-17t17 17l8 28h-50Z" fill="#d2b56f" stroke="#f2d99a" stroke-width="2"/>
        <path d="M-8 64h13l-4 20h-13Zm14 0h12l9 17-9 5-12-14Z" fill="#8d9b72" stroke="#c5cea0" stroke-width="2" stroke-linejoin="round"/>
        <path d="M-18 41-33 57l6 6 18-12m24-10 17 11-4 7-20-8" fill="none" stroke="#c5cea0" stroke-width="7" stroke-linecap="round"/>
        <circle cy="12" r="14" fill="#e3c780"/><path d="M-14 11q13-16 28 0" fill="none" stroke="#172326" stroke-width="5"/><circle cx="5" cy="14" r="1.6" fill="#192124"/>
        ${index === 2 ? '<path d="M-25 71h-18m70-4 17 6" stroke="#ead089" stroke-width="2" stroke-dasharray="4 5" opacity=".85"/>' : ''}
      </g>
      ${index === 1 ? '<path d="M520 238v65" stroke="#f2d99a" stroke-width="2" stroke-dasharray="5 5"/><circle cx="520" cy="236" r="5" fill="#f2d99a"/>' : ''}
      <rect width="720" height="390" fill="url(#grain)" opacity=".45"/>
      <path d="M24 24h24M24 24v24m648-24h24v24M24 342v24h24m648-24v24h-24" fill="none" stroke="#ddc47d" stroke-opacity=".6" stroke-width="1.5"/>
      <text x="28" y="40" fill="#efe4c7" font-size="10" font-family="monospace" letter-spacing="2">SCHEMATIC / ${String(index + 1).padStart(2, '0')}</text>
      <text x="692" y="362" text-anchor="end" fill="#efe4c7" fill-opacity=".62" font-size="9" font-family="monospace" letter-spacing="1">NO SOURCE FOOTAGE</text>
    </svg>`;
}

export const renderHomePage = {
  pageId: 'skills',
  createContent: ({ language }) => {
    const t = copy[language] ?? copy.fr;
    const email = 'mailto:ntheophilelb@gmail.com';
    return `
      <main class="frame-page">
        <section class="frame-workspace" aria-labelledby="frame-title">
          <div class="frame-intro">
            <p class="frame-eyebrow"><span class="frame-live-dot"></span>${t.desk}</p>
            <h1 id="frame-title">Nathan<br/><span>Theophile</span></h1>
            <p class="frame-role">${t.available}</p>
            <p class="frame-lede">${t.intro}</p>
            <div class="frame-intro__actions">
              <a class="frame-contact" href="${email}">${t.contact}<span aria-hidden="true">↗</span></a>
              <a class="frame-project-link" href="/projects/" data-nav-link="projects">${t.work}<span aria-hidden="true">→</span></a>
            </div>
            <div class="frame-project-proof">
              <div class="frame-proof__top"><span>${t.project}</span><span>01 / 01</span></div>
              <h2>${t.title}</h2>
              <div class="frame-tags"><span>${t.year}</span><span>${t.role}</span><span>${t.platformer}</span></div>
              <p>${t.evidence}</p>
            </div>
          </div>

          <div class="capture-desk" aria-label="${t.capture}">
            <div class="capture-desk__header">
              <div><span class="capture-kicker">${t.capture}</span><span class="capture-file">MARROW / REVIEW_01</span></div>
              <span class="capture-status"><i></i> ${t.fallback}</span>
            </div>
            <div class="capture-viewer">
              <div class="capture-viewer__label"><span>${t.viewport}</span><span data-frame-time>${timecode(markers[0])}</span></div>
              <div class="capture-art" data-frame-art>${drawing(0)}</div>
              <div class="capture-caption"><span data-frame-caption>${t.frame[0]}</span><span>— ${t.schema}</span></div>
            </div>
            <div class="capture-timeline">
              <div class="timeline-heading"><span>${t.track}</span><span class="timeline-code" data-timecode>${timecode(markers[0])} <b>/ ${timecode(duration)}</b></span></div>
              <div class="timeline-ruler" aria-hidden="true"><span>00:00</span><span>00:06</span><span>00:13</span><span>00:19</span><span>00:26</span></div>
              <div class="timeline-control">
                <button class="timeline-play" type="button" data-play aria-label="${t.play}"><span data-play-icon>▶</span></button>
                <div class="timeline-track-wrap">
                  <input class="timeline-range" type="range" min="0" max="${duration}" step="1" value="${markers[0]}" aria-label="${t.track}" aria-valuetext="${timecode(markers[0])}" data-timeline />
                  ${markers.map((time, index) => `<button class="timeline-marker ${index === 0 ? 'is-active' : ''}" style="--marker:${(time / duration) * 100}%" type="button" data-marker="${index}" aria-label="${t.events[index]}, ${timecode(time)}" title="${t.events[index]}"><span></span></button>`).join('')}
                </div>
              </div>
              <div class="timeline-events">${markers.map((time, index) => `<button class="timeline-event ${index === 0 ? 'is-active' : ''}" type="button" data-event="${index}" aria-pressed="${index === 0}" aria-label="${t.events[index]}, ${timecode(time)}"><span>${timecode(time)}</span><b>${t.markers[index]}</b></button>`).join('')}</div>
            </div>
            <div class="capture-annotation">
              <div class="annotation-index"><span>NOTE</span><b data-note-index>01</b></div>
              <div class="annotation-copy"><span>${t.note}</span><p data-annotation>${t.notes[0]}</p></div>
              <div class="annotation-controls"><button type="button" data-step="-1" aria-label="${t.previous}">←</button><button type="button" data-step="1" aria-label="${t.next}">→</button></div>
            </div>
          </div>
        </section>
        <footer class="frame-footer"><span>${t.footer}</span><a href="${email}">ntheophilelb@gmail.com</a><span>Unity · C# · Gameplay</span></footer>
      </main>
    `;
  },
  enhance: ({ pageRoot, language }) => {
    const t = copy[language] ?? copy.fr;
    const timeline = pageRoot.querySelector('[data-timeline]');
    const timeDisplay = pageRoot.querySelector('[data-timecode]');
    const frameTime = pageRoot.querySelector('[data-frame-time]');
    const rangeWrap = pageRoot.querySelector('.timeline-track-wrap');
    const frameArt = pageRoot.querySelector('[data-frame-art]');
    const frameCaption = pageRoot.querySelector('[data-frame-caption]');
    const annotation = pageRoot.querySelector('[data-annotation]');
    const noteIndex = pageRoot.querySelector('[data-note-index]');
    const playButton = pageRoot.querySelector('[data-play]');
    const playIcon = pageRoot.querySelector('[data-play-icon]');
    const eventButtons = [...pageRoot.querySelectorAll('[data-event]')];
    const markerButtons = [...pageRoot.querySelectorAll('[data-marker]')];
    if (!timeline) return () => {};

    let activeIndex = 0;
    let playback = 0;
    let playTimer = 0;

    const stop = () => {
      window.clearInterval(playTimer);
      playTimer = 0;
      playback = 0;
      playButton.setAttribute('aria-label', t.play);
      playIcon.textContent = '▶';
      playButton.classList.remove('is-playing');
    };

    const update = (seconds, selected = null) => {
      const time = Math.max(0, Math.min(duration, Number(seconds) || 0));
      timeline.value = String(time);
      timeline.setAttribute('aria-valuetext', timecode(time));
      timeline.style.setProperty('--progress', `${(time / duration) * 100}%`);
      timeDisplay.innerHTML = `${timecode(time)} <b>/ ${timecode(duration)}</b>`;
      frameTime.textContent = timecode(time);
      const nearest = selected ?? markers.reduce((best, marker, index) =>
        Math.abs(marker - time) < Math.abs(markers[best] - time) ? index : best, 0);
      activeIndex = nearest;
      frameArt.innerHTML = drawing(activeIndex);
      frameCaption.textContent = t.frame[activeIndex];
      annotation.textContent = t.notes[activeIndex];
      noteIndex.textContent = String(activeIndex + 1).padStart(2, '0');
      eventButtons.forEach((button, index) => {
        const active = index === activeIndex;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      markerButtons.forEach((button, index) => button.classList.toggle('is-active', index === activeIndex));
    };

    const selectMarker = (index) => {
      const safeIndex = (index + markers.length) % markers.length;
      update(markers[safeIndex], safeIndex);
    };

    timeline.addEventListener('input', () => update(timeline.value));
    eventButtons.forEach((button) => button.addEventListener('click', () => selectMarker(Number(button.dataset.event))));
    markerButtons.forEach((button) => button.addEventListener('click', () => selectMarker(Number(button.dataset.marker))));
    pageRoot.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => selectMarker(activeIndex + Number(button.dataset.step))));

    const onKeydown = (event) => {
      if (document.activeElement !== timeline) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        selectMarker(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    timeline.addEventListener('keydown', onKeydown);

    playButton.addEventListener('click', () => {
      if (playback) {
        stop();
        return;
      }
      playback = 1;
      playButton.setAttribute('aria-label', t.pause);
      playIcon.textContent = 'Ⅱ';
      playButton.classList.add('is-playing');
      let seconds = Number(timeline.value);
      playTimer = window.setInterval(() => {
        seconds += 1;
        if (seconds > duration) seconds = 0;
        const hit = markers.indexOf(seconds);
        update(seconds, hit >= 0 ? hit : null);
      }, 420);
    });

    return () => {
      stop();
      timeline.removeEventListener('keydown', onKeydown);
    };
  },
};
