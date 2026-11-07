(() => {
  "use strict";
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  const progress = document.querySelector(".scroll-progress");
  const updateScroll = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle("is-scrolled", y > 36);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    }
  };
  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });
  window.addEventListener("resize", updateScroll, { passive: true });
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      }
    });
  }
  const page = location.pathname.split("/").pop() || "index.html";
  const active = page === "index.html" ? "home" : page.replace(".html", "");
  document.querySelectorAll("[data-link]").forEach(link => {
    if (link.dataset.link === active) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  const revealTargets = document.querySelectorAll(".feature-card,.project-card,.service-card,.lab-card,.project-feature,.stat,.process-grid article");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    revealTargets.forEach(el => { el.classList.add("will-reveal"); observer.observe(el); });
  }
})();