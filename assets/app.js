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

  // ---- carousel (dots and/or arrows, seamless infinite loop) ----
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const dots = carousel.querySelectorAll(".carousel-dot");
    const prevBtn = carousel.querySelector(".carousel-arrow.prev");
    const nextBtn = carousel.querySelector(".carousel-arrow.next");
    const real = Array.from(track.children);
    const count = real.length;
    if (!count) return;

    // clone the first/last slide on each end so the track can keep sliding
    // in one direction forever instead of snapping back through every slide
    const firstClone = real[0].cloneNode(true);
    const lastClone = real[count - 1].cloneNode(true);
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");
    track.appendChild(firstClone);
    track.insertBefore(lastClone, real[0]);

    const DURATION = 700; // ms, must match the CSS transition below
    let index = 1; // position 1 = first real slide (0 is the cloned last slide)

    const setPos = (withTransition) => {
      track.style.transition = withTransition ? `transform ${DURATION}ms var(--ease)` : "none";
      track.style.transform = `translateX(-${index * 100}%)`;
      if (!withTransition) void track.offsetWidth; // force reflow before re-enabling transition
    };
    setPos(false);

    const updateDots = () => {
      const realIndex = (index - 1 + count) % count;
      dots.forEach((d, di) => d.classList.toggle("active", di === realIndex));
    };
    updateDots();

    // if the previous move landed on a cloned edge slide, snap back to the
    // matching real slide instantly (no transition) before moving again -
    // this runs synchronously on every click, so it works no matter how
    // fast you click and keeps the sequence exactly 1-2-3-4-1-2-3-4...
    const normalize = () => {
      if (index === count + 1) { index = 1; setPos(false); }
      else if (index === 0) { index = count; setPos(false); }
    };

    const go = (step) => {
      normalize();
      index += step;
      setPos(true);
      updateDots();
    };

    dots.forEach((d, i) => d.addEventListener("click", () => {
      normalize();
      index = i + 1;
      setPos(true);
      updateDots();
    }));
    if (prevBtn) prevBtn.addEventListener("click", () => go(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => go(1));
    let auto = setInterval(() => go(1), 7000);
    carousel.addEventListener("mouseenter", () => clearInterval(auto));
    carousel.addEventListener("mouseleave", () => (auto = setInterval(() => go(1), 7000)));
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
