/* ============================================================
   NIKHIL BORADE — Portfolio Script
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ===== PARTICLE NETWORK CANVAS ===== */
  const canvas = document.getElementById("particleCanvas");
  const ctx    = canvas.getContext("2d");
  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const COUNT = 70, CONNECT_DIST = 130, MOUSE_DIST = 160;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);

  function randBetween(a, b) { return a + Math.random() * (b - a); }
  function makeParticle() {
    return { x: Math.random()*W, y: Math.random()*H, vx: randBetween(-0.25,0.25), vy: randBetween(-0.25,0.25), r: randBetween(1.2,2.5) };
  }
  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());
  document.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    const isDark   = !document.body.classList.contains("light");
    const dotColor = isDark ? "rgba(0,229,255,0.7)"  : "rgba(0,100,180,0.5)";
    const lineBase = isDark ? "rgba(0,229,255,"       : "rgba(0,100,180,";

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      const dx = mouse.x - p.x, dy = mouse.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < MOUSE_DIST) { p.x += dx * 0.003; p.y += dy * 0.003; }
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.strokeStyle = lineBase + (1 - d/CONNECT_DIST) * 0.35 + ")";
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = dotColor; ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ===== CUSTOM CURSOR ===== */
  const outer = document.querySelector(".cursor-outer");
  const inner = document.querySelector(".cursor-inner");
  let cx = 0, cy = 0, ox = 0, oy = 0;
  document.addEventListener("mousemove", e => { cx = e.clientX; cy = e.clientY; });
  (function animCursor() {
    ox += (cx - ox) * 0.13; oy += (cy - oy) * 0.13;
    if (inner) { inner.style.left = cx+"px"; inner.style.top = cy+"px"; }
    if (outer) { outer.style.left = ox+"px"; outer.style.top = oy+"px"; }
    requestAnimationFrame(animCursor);
  })();
  document.querySelectorAll("a, button, .skill-block, .feat-card, .more-card, .cert-card, .pill").forEach(el => {
    el.addEventListener("mouseenter", () => outer && outer.classList.add("expand"));
    el.addEventListener("mouseleave", () => outer && outer.classList.remove("expand"));
  });

  /* ===== THEME TOGGLE ===== */
  const themeBtn = document.getElementById("themeToggle");
  function setTheme(light) {
    document.body.classList.toggle("light", light);
    if (themeBtn) themeBtn.textContent = light ? "☀" : "◐";
    localStorage.setItem("nb-theme", light ? "light" : "dark");
  }
  const saved = localStorage.getItem("nb-theme");
  if (saved) setTheme(saved === "light");
  else setTheme(window.matchMedia("(prefers-color-scheme: light)").matches);
  if (themeBtn) themeBtn.addEventListener("click", () => setTheme(!document.body.classList.contains("light")));

  /* ===== NAV SCROLL ===== */
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav && nav.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  const navBrand = document.getElementById("navBrand");
  navBrand && navBrand.addEventListener("click", e => {
    e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const t = document.querySelector(link.getAttribute("href"));
      if (t) t.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ===== TYPEWRITER ===== */
  const typeTarget = document.getElementById("typewriter");
  const phrases = ["AI Engineer", "Data Scientist", "ML Engineer", "GenAI Developer", "NLP Specialist"];
  let pIdx = 0, cIdx = 0, deleting = false;
  function typeLoop() {
    if (!typeTarget) return;
    const cur = phrases[pIdx];
    if (!deleting) {
      typeTarget.textContent = cur.slice(0, cIdx + 1); cIdx++;
      if (cIdx === cur.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
      setTimeout(typeLoop, 90);
    } else {
      typeTarget.textContent = cur.slice(0, cIdx - 1); cIdx--;
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(typeLoop, 400); return; }
      setTimeout(typeLoop, 45);
    }
  }
  typeLoop();

  /* ===== REVEAL OBSERVER ===== */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in-view"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 0.07 + "s";
    revealObs.observe(el);
  });

  function forceRevealInView() {
    document.querySelectorAll(".reveal:not(.in-view)").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in-view");
    });
  }
  forceRevealInView();
  setTimeout(forceRevealInView, 200);
  setTimeout(forceRevealInView, 600);

  /* ===== SKILL BARS ===== */
  const skillObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("in-view"); obs.unobserve(entry.target); }
    });
  }, { threshold: 0, rootMargin: "0px 0px -20px 0px" });
  document.querySelectorAll(".skill-block").forEach(el => skillObs.observe(el));

  /* ===== HERO STAGGER ===== */
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    el.style.transitionDelay = i * 0.11 + "s";
    setTimeout(() => el.classList.add("in-view"), i * 110 + 60);
  });

  /* ===== EMAILJS ===== */
  if (typeof emailjs !== "undefined") {
    emailjs.init("nU75PecxW6K6vssR8");

    const form = document.getElementById("contactForm");
    const msg  = document.getElementById("statusMsg");

    if (form && msg) {
      form.addEventListener("submit", function(e) {
        e.preventDefault();

        msg.style.color = "var(--text-2)";
        msg.textContent = "Sending...";

        // 🔵 1. Send notification email to YOU (Admin)
        // ⚠️ Replace "ADMIN_TEMPLATE_ID" with your actual admin template ID (e.g. template_xxxxxx)
        emailjs.sendForm("service_vma8vc6", "template_nzsnyop", this)
          .then(() => {
            console.log("Admin email sent");
          })
          .catch(err => {
            console.error("Admin email error:", err);
          });

        // 🟢 2. Send auto-reply confirmation to USER
        emailjs.sendForm("service_vma8vc6", "template_odou3q9", this)
          .then(() => {
            msg.style.color = "var(--accent-3)";
            msg.textContent = "Message sent successfully! 🚀";
            form.reset();
          })
          .catch(err => {
            console.error("User auto-reply error:", err);
            msg.style.color = "#f87171";
            msg.textContent = "Failed. Please try again.";
          });
      });
    }
  }

  /* ===== RESUME MODAL ===== */
  const resumeModal     = document.getElementById("resumeModal");
  const viewResumeBtn   = document.getElementById("viewResumeBtn");
  const footerResumeBtn = document.getElementById("footerResumeBtn");
  const closeResumeBtn  = document.getElementById("closeResume");

  function openResume() {
    if (!resumeModal) return;
    resumeModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeResume() {
    if (!resumeModal) return;
    resumeModal.classList.remove("open");
    document.body.style.overflow = "";
  }

  if (viewResumeBtn)   viewResumeBtn.addEventListener("click", openResume);
  if (footerResumeBtn) footerResumeBtn.addEventListener("click", openResume);
  if (closeResumeBtn)  closeResumeBtn.addEventListener("click", closeResume);
  if (resumeModal) {
    resumeModal.addEventListener("click", e => { if (e.target === resumeModal) closeResume(); });
  }

  /* ===== CERTIFICATE MODAL ===== */
  function openCertModal(pdfPath, title) {
    const modal   = document.getElementById("certModal");
    const iframe  = document.getElementById("certIframe");
    const titleEl = document.getElementById("certModalTitle");
    const dlBtn   = document.getElementById("certModalDownload");
    if (!modal) return;

    iframe.src = pdfPath + "#toolbar=0";
    titleEl.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      ${title} — Nikhil Borade`;
    dlBtn.href     = pdfPath;
    dlBtn.download = title.replace(/\s+/g, "_") + ".pdf";

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCertModal() {
    const modal  = document.getElementById("certModal");
    const iframe = document.getElementById("certIframe");
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { iframe.src = ""; }, 350);
  }

  // Expose to global scope so inline onclick attributes in HTML work
  window.openCertModal  = openCertModal;
  window.closeCertModal = closeCertModal;

  const closeCertBtn = document.getElementById("closeCert");
  const certModal    = document.getElementById("certModal");
  if (closeCertBtn) closeCertBtn.addEventListener("click", closeCertModal);
  if (certModal)    certModal.addEventListener("click", e => { if (e.target === certModal) closeCertModal(); });

  /* ===== ESCAPE KEY — closes any open modal ===== */
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeResume(); closeCertModal(); }
  });

});
