/* ============================================================
   NIKHIL BORADE — Portfolio Script  (matches new HTML exactly)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ===== CUSTOM CURSOR ===== */
  const dot  = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    if (dot)  { dot.style.left  = mx + "px"; dot.style.top  = my + "px"; }
    if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
    requestAnimationFrame(animCursor);
  })();

  document.querySelectorAll("a, button, .skill-card, .featured-card, .other-card").forEach(el => {
    el.addEventListener("mouseenter", () => { if (ring) { ring.style.width = "52px"; ring.style.height = "52px"; } });
    el.addEventListener("mouseleave", () => { if (ring) { ring.style.width = "32px"; ring.style.height = "32px"; } });
  });

  /* ===== THEME TOGGLE ===== */
  const themeBtn = document.getElementById("themeToggle");
  const icon     = themeBtn ? themeBtn.querySelector(".theme-icon") : null;

  function setTheme(light) {
    document.body.classList.toggle("light", light);
    if (icon) icon.textContent = light ? "☀" : "◐";
    localStorage.setItem("theme", light ? "light" : "dark");
  }

  const saved = localStorage.getItem("theme");
  if (saved) {
    setTheme(saved === "light");
  } else {
    setTheme(window.matchMedia("(prefers-color-scheme: light)").matches);
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => setTheme(!document.body.classList.contains("light")));
  }

  /* ===== NAV SCROLL EFFECT ===== */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  /* ===== NAV BRAND → SCROLL TO TOP ===== */
  const navBrand = document.getElementById("navBrand");
  if (navBrand) {
    navBrand.addEventListener("click", e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ===== TYPEWRITER ===== */
  const typeTarget = document.getElementById("typewriter");
  const phrases = [
    "AI Engineer & Data Scientist",
    "Machine Learning Engineer",
    "Generative AI Developer",
    "NLP Specialist",
  ];
  let pIdx = 0, cIdx = 0, deleting = false;

  function typeLoop() {
    if (!typeTarget) return;
    const current = phrases[pIdx];

    if (!deleting) {
      typeTarget.textContent = current.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 80);
    } else {
      typeTarget.textContent = current.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 40);
    }
  }
  typeLoop();

  /* ===== INTERSECTION OBSERVER — REVEAL ===== */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 0.08 + "s";
    revealObs.observe(el);
  });

  /* ===== SKILL BARS (triggered on scroll) ===== */
  const skillObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll(".skill-card").forEach(card => skillObs.observe(card));

  /* ===== SMOOTH NAV LINKS ===== */
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ===== ACTIVE NAV HIGHLIGHT ===== */
  const sections = document.querySelectorAll("section[id], div[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const activeObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = a.getAttribute("href") === "#" + entry.target.id
            ? "var(--text)" : "";
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => activeObs.observe(s));

  /* ===== EMAILJS CONTACT FORM ===== */
  if (typeof emailjs !== "undefined") {
    emailjs.init("nU75PecxW6K6vssR8");

    const form      = document.getElementById("contactForm");
    const statusMsg = document.getElementById("statusMsg");

    if (form && statusMsg) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        statusMsg.style.color = "var(--text-muted)";
        statusMsg.textContent  = "⏳ Sending…";

        emailjs.sendForm("service_vma8vc6", "template_odou3q9", this)
          .then(() => {
            statusMsg.style.color = "#22c55e";
            statusMsg.textContent  = "✅ Message sent! I'll get back to you soon.";
            form.reset();
          })
          .catch(err => {
            console.error("EmailJS error:", err);
            statusMsg.style.color = "#f87171";
            statusMsg.textContent  = "❌ Failed to send. Please email me directly.";
          });
      });
    }
  }

  /* ===== RESUME MODAL ===== */
  const resumeModal = document.getElementById("resumeModal");
  const closeResume = document.getElementById("closeResume");

  // The HTML has a direct download link, not a "view" button — modal is optional.
  // Attach close logic in case it's opened from anywhere.
  if (closeResume && resumeModal) {
    closeResume.addEventListener("click", () => { resumeModal.style.display = "none"; });
    window.addEventListener("click", e => {
      if (e.target === resumeModal) resumeModal.style.display = "none";
    });
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") resumeModal.style.display = "none";
    });
  }

  /* ===== STAGGER HERO REVEALS ===== */
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    el.style.transitionDelay = i * 0.12 + "s";
  });
});
