/* ============================================================
   ДОКТОР ТОНУС — shared config + behavior
   Edit clinicConfig in one place to update contacts site-wide.
   ============================================================ */

const clinicConfig = {
  brand: "ДОКТОР ТОНУС",
  instagramHandle: "@dr.tonus_studiya",
  instagram: "https://www.instagram.com/dr.tonus_studiya/",
  bookingUrl: "https://dikidi.net/1715258",
  phone: "[ТЕЛЕФОН]",
  phoneHref: "tel:", // TODO: add real number
  vkHref: "#", // TODO: add real vk.com/... link
  address: "г. Волжский, ул. 87 Гвардейской, 21",
  workingHours: "Ежедневно, 9:00–20:00",
};

document.addEventListener("DOMContentLoaded", () => {
  // ---- fill config placeholders declared via data-cfg ----
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const key = el.getAttribute("data-cfg");
    if (clinicConfig[key] !== undefined) el.textContent = clinicConfig[key];
  });
  document.querySelectorAll("[data-cfg-href]").forEach((el) => {
    const key = el.getAttribute("data-cfg-href");
    if (clinicConfig[key] !== undefined) el.setAttribute("href", clinicConfig[key]);
  });

  // ---- header scroll state ----
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- scroll reveal ----
  const revealTargets = document.querySelectorAll(".reveal, .reveal-clip, .reveal-mask, .stagger");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );
  revealTargets.forEach((el) => io.observe(el));

  // ---- FAQ accordion ----
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item.open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      item.classList.toggle("open", !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + "px" : null;
    });
  });

  // ---- reviews carousel (simple, dot-driven) ----
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const dots = carousel.querySelectorAll(".carousel-dot");
    let index = 0;
    const go = (i) => {
      index = (i + dots.length) % dots.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle("active", di === index));
    };
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    let auto = setInterval(() => go(index + 1), 7000);
    carousel.addEventListener("mouseenter", () => clearInterval(auto));
    carousel.addEventListener("mouseleave", () => (auto = setInterval(() => go(index + 1), 7000)));
  });

  // ---- atmosphere horizontal track drag-scroll (Site A) ----
  document.querySelectorAll("[data-hscroll]").forEach((track) => {
    let isDown = false, startX, scrollLeft;
    track.addEventListener("mousedown", (e) => {
      isDown = true; track.classList.add("dragging");
      startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
    });
    ["mouseleave", "mouseup"].forEach((ev) => track.addEventListener(ev, () => { isDown = false; track.classList.remove("dragging"); }));
    track.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  });

  // ---- problem words stagger reveal already handled by .stagger ----
});
