/* ---------- Mobile Menu Toggle ---------- */
const navToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".primary-nav");

if (navToggle) {
    navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("open");
        navToggle.classList.toggle("open");
    });
}

/* ---------- Hero Slider ---------- */
let slideIndex = 0;
const slides = document.querySelectorAll(".hero-slide");

function showSlides() {
    slides.forEach((slide, i) => {
        slide.style.opacity = "0";
        slide.style.transform = "scale(1.05)";
    });

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }

    slides[slideIndex - 1].style.opacity = "1";
    slides[slideIndex - 1].style.transform = "scale(1)";
    setTimeout(showSlides, 4500); // 4.5 seconds per slide
}

if (slides.length > 0) {
    showSlides();
}

/* ---------- Email Popup ---------- */
const popup = document.getElementById("email-popup");

setTimeout(() => {
    if (popup) popup.classList.add("show");
}, 4000); // 4 seconds delay

document.addEventListener("click", (e) => {
    if (popup && popup.classList.contains("show")) {
        if (!popup.contains(e.target)) {
            popup.classList.remove("show");
        }
    }
});

/* ---------- WhatsApp Button ---------- */
const whatsappBtn = document.getElementById("whatsapp-btn");
if (whatsappBtn) {
    whatsappBtn.addEventListener("click", () => {
        window.open("https://wa.me/5521960105724", "_blank");
    });
}
