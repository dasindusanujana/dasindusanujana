(() => {
  const body = document.body;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preloader = document.querySelector(".preloader");
  const finishLoad = () => {
    body.classList.remove("loading");
    body.classList.add("js-ready");
    if (preloader) preloader.classList.add("done");
    if (!reduceMotion) runIntro();
  };
  // Hide the intro as soon as the page is ready; keep a hard timeout as a safety net.
  let introFinished = false;
  const safeFinishLoad = () => {
    if (introFinished) return;
    introFinished = true;
    finishLoad();
  };
  window.addEventListener("load", () => window.setTimeout(safeFinishLoad, 180), { once: true });
  window.setTimeout(safeFinishLoad, 1400);

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("open");
  };
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    nav?.classList.toggle("open", open);
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

  function runIntro() {
    if (window.gsap) {
      window.gsap.from(".hero .eyebrow", { opacity: 0, y: 16, duration: .7, delay: .05, ease: "power3.out" });
      window.gsap.from(".hero h1 .line-mask > span", { yPercent: 110, duration: 1.05, stagger: .12, delay: .12, ease: "power4.out" });
      window.gsap.from(".hero-bottom > *", { opacity: 0, y: 22, duration: .8, stagger: .15, delay: .55, ease: "power3.out" });
      if (window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        document.querySelectorAll(".section-kicker,.about-heading,.about-copy,.work-card,.tech-card,.approach-steps>div,.contact-heading,.contact-details,.contact-form").forEach(el => {
          window.gsap.from(el, { opacity: 0, y: 28, duration: .8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        });
      }
    } else {
      document.querySelectorAll(".hero .eyebrow,.hero h1 .line-mask>span,.hero-bottom>*").forEach(el => { el.style.opacity = "1"; });
    }
  }

  // Lightweight fallback reveal system if the animation CDN is unavailable.
  if (!("IntersectionObserver" in window) || reduceMotion) {
    document.querySelectorAll(".section-kicker,.about-heading,.about-copy,.work-card,.tech-card,.approach-steps>div,.contact-heading,.contact-details,.contact-form").forEach(el => el.classList.add("visible"));
  } else if (!window.gsap) {
    const revealItems = document.querySelectorAll(".section-kicker,.about-heading,.about-copy,.work-card,.tech-card,.approach-steps>div,.contact-heading,.contact-details,.contact-form");
    revealItems.forEach(el => el.classList.add("reveal"));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    revealItems.forEach(el => observer.observe(el));
  }

  // Desktop-only custom cursor; native cursor is retained for touch devices.
  if (window.matchMedia("(pointer:fine)").matches && !reduceMotion) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener("mousemove", event => {
      x = event.clientX; y = event.clientY;
      dot.style.opacity = ring.style.opacity = "1";
      dot.style.left = x + "px"; dot.style.top = y + "px";
    }, { passive: true });
    const moveRing = () => {
      rx += (x - rx) * .16; ry += (y - ry) * .16;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(moveRing);
    };
    moveRing();
    document.querySelectorAll("a,button,input,textarea").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
  }

  // Gentle pointer parallax on the orbital illustration.
  const orbital = document.querySelector(".orbital-art");
  if (orbital && window.matchMedia("(pointer:fine)").matches && !reduceMotion) {
    window.addEventListener("mousemove", event => {
      const dx = (event.clientX / window.innerWidth - .5) * 9;
      const dy = (event.clientY / window.innerHeight - .5) * 9;
      orbital.style.transform = `translate3d(${dx}px,${dy}px,0)`;
    }, { passive: true });
  }

  // The contact form intentionally uses the visitor's email application; no data is collected or stored.
  const form = document.querySelector("#contact-form");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent("Portfolio enquiry from " + data.get("name"));
    const message = encodeURIComponent("Name: " + data.get("name") + "\nEmail: " + data.get("email") + "\n\n" + data.get("message"));
    window.location.href = "mailto:dasindusanujana0@gmail.com?subject=" + subject + "&body=" + message;
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();