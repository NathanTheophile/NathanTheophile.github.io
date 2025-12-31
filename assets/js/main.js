const navLinks = document.querySelectorAll(".nav-links a[data-page]");
const pages = Array.from(document.querySelectorAll(".page[data-page]"));
const pageById = Object.fromEntries(pages.map((page) => [page.dataset.page, page]));
const skillsScroll = document.querySelector(".skills-scroll");
const skillsPanels = skillsScroll ? Array.from(skillsScroll.querySelectorAll(".skills-panel")) : [];

const slideDirections = {
  "skills:projects": "right",
  "contact:skills": "right",
  "contact:projects": "right",
  "skills:contact": "left",
  "projects:skills": "left",
  "projects:contact": "left",
};

let activePageId = "skills";

const setActiveLink = (pageId) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.page === pageId);
  });
};

const getDirection = (fromId, toId) => {
  return slideDirections[`${fromId}:${toId}`] || "left";
};

const resetPageStyles = (page) => {
  page.style.transform = "";
  page.style.opacity = "";
};

const switchPage = (nextId) => {
  if (!pageById[nextId] || nextId === activePageId) {
    return;
  }

  const currentPage = pageById[activePageId];
  const nextPage = pageById[nextId];
  const direction = getDirection(activePageId, nextId);
  const enterFrom = direction === "left" ? "100%" : "-100%";
  const exitTo = direction === "left" ? "-100%" : "100%";

  nextPage.style.transition = "none";
  nextPage.style.transform = `translateX(${enterFrom})`;
  nextPage.style.opacity = "1";
  nextPage.classList.add("is-active");
  nextPage.offsetHeight;
  nextPage.style.transition = "";

  requestAnimationFrame(() => {
    nextPage.style.transform = "translateX(0)";
    currentPage.style.transform = `translateX(${exitTo})`;
    currentPage.style.opacity = "0";
  });

  const onTransitionEnd = () => {
    currentPage.classList.remove("is-active");
    resetPageStyles(currentPage);
    resetPageStyles(nextPage);
    currentPage.removeEventListener("transitionend", onTransitionEnd);
  };

  currentPage.addEventListener("transitionend", onTransitionEnd);
  activePageId = nextId;
  setActiveLink(nextId);
};

const initPage = () => {
  const hashPage = window.location.hash.replace("#", "");
  const initialPage = pageById[hashPage] ? hashPage : "skills";
  activePageId = initialPage;
  pages.forEach((page) => page.classList.remove("is-active"));
  pageById[initialPage].classList.add("is-active");
  setActiveLink(initialPage);
  if (window.location.hash !== `#${initialPage}`) {
    window.location.hash = `#${initialPage}`;
  }
};

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.dataset.page;
    switchPage(targetId);
    window.location.hash = `#${targetId}`;
  });
});

if (skillsScroll && skillsPanels.length > 1) {
  let isScrolling = false;
  skillsScroll.addEventListener(
    "wheel",
    (event) => {
      if (isScrolling) {
        return;
      }
      const direction = Math.sign(event.deltaY);
      const panelHeight = skillsScroll.clientHeight;
      const currentIndex = Math.round(skillsScroll.scrollTop / panelHeight);
      const targetIndex =
        direction > 0
          ? Math.min(currentIndex + 1, skillsPanels.length - 1)
          : Math.max(currentIndex - 1, 0);

      if (targetIndex !== currentIndex) {
        event.preventDefault();
        isScrolling = true;
        skillsPanels[targetIndex].scrollIntoView({ behavior: "smooth" });
        window.setTimeout(() => {
          isScrolling = false;
        }, 700);
      }
    },
    { passive: false }
  );
}

initPage();