const toggle = document.getElementById("themeToggle");

// Auto detect Windows theme
if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
    toggle.textContent = "🌞";
}

// Manual toggle
toggle.addEventListener("click", () => {
    document.body.classList.toggle("light");
    toggle.textContent =
        document.body.classList.contains("light") ? "🌞" : "🌙";
});

// Smooth reveal on scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = "0.2s";
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".glass").forEach(section => {
    observer.observe(section);
});