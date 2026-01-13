const toggle = document.getElementById("themeToggle");

/* ================= THEME DETECTION ================= */
if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
    toggle.textContent = "🌞";
}

/* ================= THEME TOGGLE ================= */
toggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    toggle.textContent =
        document.body.classList.contains("light") ? "🌞" : "🌙";
});

/* ================= SCROLL REVEAL ================= */
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target); // animate once
            }
        });
    },
    { threshold: 0.15 }
);

document.querySelectorAll(".glass").forEach(section => {
    observer.observe(section);
});
