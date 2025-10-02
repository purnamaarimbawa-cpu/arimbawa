// Interaksi sederhana: toggle menu mobile, smooth scroll, modal projek, copy email
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const closeModal = document.getElementById("closeModal");
const copyEmail = document.getElementById("copyEmail");
const emailText = document.getElementById("emailText");

// Navbar animation - change active menu based on scroll position
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(
  ".nav-links a, .contact-nav-links a"
);

function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const scrollPosition = window.scrollY;

    // Check if we're in the contact section
    if (section.id === "contact") {
      if (
        scrollPosition >= sectionTop - 200 &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    } else {
      if (scrollPosition >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    }
  });

  // Update main navbar
  const mainNavLinks = document.querySelectorAll(".nav-links a");
  mainNavLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  // Update contact navbar
  const contactNavLinks = document.querySelectorAll(".contact-nav-links a");
  contactNavLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  // Debug logging
  console.log("Current section:", current);
  console.log("Scroll position:", window.scrollY);
}

// Listen for scroll events
window.addEventListener("scroll", updateActiveNav);

// Set initial active state
document.addEventListener("DOMContentLoaded", updateActiveNav);

// Mobile menu toggle
menuToggle.addEventListener("click", function () {
  navLinks.classList.toggle("mobile-open");
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // close mobile menu if open
      navLinks.classList.remove("mobile-open");
    }
  });
});

// Projek button: scroll + flash small feedback
btnProjek.addEventListener("click", function (e) {
  // small ripple-like feedback via temporary aria-live message
  const live = document.createElement("div");
  live.setAttribute("aria-live", "polite");
  live.style.position = "absolute";
  live.style.left = "-9999px";
  live.textContent = "Mengarahkan ke bagian projek...";
  document.body.appendChild(live);
  setTimeout(() => document.body.removeChild(live), 1200);
});

// Open modal for projek detail
openBtns.forEach((b) => {
  b.addEventListener("click", function () {
    modalTitle.textContent = this.dataset.title || "Projek";
    modalDesc.textContent = this.dataset.desc || "";
    modal.setAttribute("aria-hidden", "false");
  });
});

// Close modal
closeModal.addEventListener("click", function () {
  modal.setAttribute("aria-hidden", "true");
});
modal.addEventListener("click", function (e) {
  if (e.target === modal) modal.setAttribute("aria-hidden", "true");
});

// Copy email to clipboard (with fallback)
copyEmail.addEventListener("click", function () {
  const text = emailText.textContent.trim();
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Email disalin: " + text);
      })
      .catch(() => alert("Gagal menyalin."));
  } else {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      alert("Email disalin: " + text);
    } catch (e) {
      alert("Gagal menyalin.");
    }
    document.body.removeChild(ta);
  }
});

// Smooth scroll ke section tertentu
document.querySelector('a[href="#about"]').addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#about").scrollIntoView({ behavior: "smooth" });
});

// Sertifikat carousel simple controls + drag-to-scroll
(function () {
  const strip = document.getElementById("certStrip");
  const prev = document.querySelector(".cert-prev");
  const next = document.querySelector(".cert-next");

  // tombol prev/next scroll by card width
  function scrollByCard(direction = 1) {
    const card = strip.querySelector(".cert-card");
    if (!card) return;
    const gap = 16; // sama dengan gap di CSS
    const cardWidth = card.getBoundingClientRect().width + gap;
    strip.scrollBy({ left: cardWidth * direction, behavior: "smooth" });
  }
  prev && prev.addEventListener("click", () => scrollByCard(-1));
  next && next.addEventListener("click", () => scrollByCard(1));

  // optional: drag to scroll for desktop
  let isDown = false,
    startX,
    scrollLeft;
  strip.addEventListener("mousedown", (e) => {
    isDown = true;
    strip.classList.add("dragging");
    startX = e.pageX - strip.offsetLeft;
    scrollLeft = strip.scrollLeft;
  });
  strip.addEventListener("mouseleave", () => {
    isDown = false;
    strip.classList.remove("dragging");
  });
  strip.addEventListener("mouseup", () => {
    isDown = false;
    strip.classList.remove("dragging");
  });
  strip.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - strip.offsetLeft;
    const walk = (x - startX) * 1.2; // scroll-fast
    strip.scrollLeft = scrollLeft - walk;
  });

  // keyboard accessibility: arrow keys when strip focused
  strip.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") scrollByCard(1);
    if (e.key === "ArrowLeft") scrollByCard(-1);
  });
})();

// Mobile menu toggle & auto-close on link click
(function () {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("mobile-open");
  });

  // close mobile menu when a nav link is clicked
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      if (nav.classList.contains("mobile-open"))
        nav.classList.remove("mobile-open");
    });
  });

  // close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove("mobile-open");
    }
  });

  // improve touch UX: prevent body scroll when menu open (optional)
  const observer = new MutationObserver(() => {
    if (nav.classList.contains("mobile-open"))
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  });
  observer.observe(nav, { attributes: true, attributeFilter: ["class"] });
})();
