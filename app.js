// app.js
(() => {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav a");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });
  }

  // Close menu when clicking a nav link (mobile)
  navLinks.forEach((a) => {
    a.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "Open menu");
    });
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll(".section, .hero, .footer");
  revealEls.forEach((el) => el.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => io.observe(el));

  // Simple "mailto" form submit (Phase 1)
  const form = document.getElementById("contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const interest = String(data.get("interest") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`GoExtreme! — ${interest} inquiry`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}\n`
    );

    window.location.href = `mailto:contact@goextreme.life?subject=${subject}&body=${body}`;
  });

  // Gallery lightbox (optional)
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox?.querySelector(".lightbox__img");
  const lightboxClose = lightbox?.querySelector(".lightbox__close");
  const gallery = document.querySelector("[data-lightbox]");
  const galleryItems = Array.from(gallery?.querySelectorAll(".gallery__item img") || []);
  let currentIndex = -1;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lightboxImg) lightboxImg.src = "";
    currentIndex = -1;
  }

  function showImageAt(index) {
    if (!lightbox || !lightboxImg || galleryItems.length === 0) return;
    const normalized = (index + galleryItems.length) % galleryItems.length;
    const img = galleryItems[normalized];
    if (!img) return;
    currentIndex = normalized;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "Gallery image";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  // Force closed state on load in case browser/extensions mutate hidden state.
  closeLightbox();

  gallery?.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery__item");
    if (!btn) return;
    const img = btn.querySelector("img");
    if (!img) return;
    const index = galleryItems.indexOf(img);
    showImageAt(index === -1 ? 0 : index);
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showImageAt(currentIndex + 1);
    if (e.key === "ArrowLeft") showImageAt(currentIndex - 1);
  });
})();
