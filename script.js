document.addEventListener("DOMContentLoaded", () => {

    /* ================= THEME TOGGLE ================= */
    const toggle = document.getElementById("themeToggle");

    if (toggle) {
        if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            document.body.classList.add("light");
            toggle.textContent = "🌞";
        } else {
            toggle.textContent = "🌙";
        }

        toggle.addEventListener("click", () => {
            document.body.classList.toggle("light");
            toggle.textContent =
                document.body.classList.contains("light") ? "🌞" : "🌙";
        });
    }

    /* ================= SCROLL REVEAL ================= */
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    document.querySelectorAll(".glass, .skill-card, .card")
        .forEach(el => observer.observe(el));

    /* ================= TYPEWRITER NAME ANIMATION ================= */
    const typeTarget = document.getElementById("typewriter");
    const nameText = "Nikhil Borade";
    let index = 0;

    function typeName() {
        if (!typeTarget) return;

        if (index === 0) {
            typeTarget.textContent = "";
        }

        if (index < nameText.length) {
            typeTarget.textContent += nameText.charAt(index);
            index++;
            setTimeout(typeName, 250); // ⏱ 250ms per letter
        } else {
            setTimeout(() => {
                index = 0;
                typeName();
            }, 500); // pause before restart
        }
    }

    typeName();

    /* ================= NAVBAR LOGO → TOP ================= */
    const logo = document.querySelector(".nav-logo");

    if (logo) {
        logo.addEventListener("click", function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ================= EMAILJS ================= */
    if (typeof emailjs === "undefined") {
        console.error("❌ EmailJS library not loaded");
        return;
    }

    emailjs.init("nU75PecxW6K6vssR8"); // ✅ PUBLIC KEY

    const form = document.getElementById("contactForm");
    const statusMsg = document.getElementById("statusMsg");

    if (!form || !statusMsg) {
        console.error("❌ Contact form or status element missing");
        return;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        statusMsg.style.color = "#ffffff";
        statusMsg.textContent = "⏳ Sending message...";

        emailjs.sendForm(
            "service_vma8vc6",    // ✅ Gmail service ID
            "template_odou3q9",  // ✅ Correct template ID
            this
        )
        .then(() => {
            statusMsg.style.color = "#00ffcc";
            statusMsg.textContent = "✅ Message sent successfully!";
            form.reset();
        })
        .catch((error) => {
            console.error("❌ EmailJS Error:", error);
            statusMsg.style.color = "#ff6b6b";
            statusMsg.textContent = "❌ Failed to send message. Please try again.";
        });
    });

});
