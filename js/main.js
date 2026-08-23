/* ============================================
   Main JS — Scroll Animations, Typing, Navbar
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initTypingAnimation();
  initScrollAnimations();
  initTimelineProgress();
  initModal();
  initSkillToggle();
});

/* ---------- Navbar: scroll transparency + active section + hamburger ---------- */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  // Scroll — transparency change
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active section highlighting
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });
    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("active");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on link click (mobile)
    links.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }
}

/* ---------- Typing Animation ---------- */
function initTypingAnimation() {
  const el = document.getElementById("typing-text");
  if (!el) return;

  const phrases = [
    { text: "Vikalp", color: "var(--neon-green)" },
    { text: "a Blue Team Enthusiast", color: "var(--dark-pink)" },
    { text: "a Frontend Developer", color: "var(--blood-red)" },
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseAfterType = 2000;
  const pauseAfterDelete = 500;

  function type() {
    const current = phrases[phraseIndex];
    el.style.color = current.color;
    el.style.textShadow = `0 0 7px ${current.color}, 0 0 20px ${current.color}`;

    if (!isDeleting) {
      el.textContent = current.text.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.text.length) {
        isDeleting = true;
        setTimeout(type, pauseAfterType);
        return;
      }
      setTimeout(type, typingSpeed);
    } else {
      el.textContent = current.text.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, pauseAfterDelete);
        return;
      }
      setTimeout(type, deletingSpeed);
    }
  }

  setTimeout(type, 1000);
}

/* ---------- Scroll Animations (Intersection Observer) ---------- */
function initScrollAnimations() {
  const animElements = document.querySelectorAll(
    ".fade-in-up, .fade-in-left, .fade-in-right"
  );

  if (!animElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        } else {
          // Fade out when scrolled away
          entry.target.classList.remove("animate-in");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  animElements.forEach((el) => observer.observe(el));
}

/* ---------- Timeline Scroll Progress ---------- */
function initTimelineProgress() {
  const timelines = document.querySelectorAll(".timeline");
  if (!timelines.length) return;

  function updateProgress() {
    timelines.forEach((timeline) => {
      const progressBar = timeline.querySelector(".timeline-progress");
      const dots = timeline.querySelectorAll(".timeline-dot");
      if (!progressBar) return;

      const rect = timeline.getBoundingClientRect();
      const timelineTop = rect.top;
      const timelineHeight = rect.height;
      const viewportCenter = window.innerHeight / 2;

      // Calculate how far we've scrolled through the timeline
      const scrolled = viewportCenter - timelineTop;
      const progress = Math.max(0, Math.min(1, scrolled / timelineHeight));
      progressBar.style.height = `${progress * 100}%`;

      // Update dots
      dots.forEach((dot) => {
        const dotRect = dot.getBoundingClientRect();
        const dotCenter = dotRect.top + dotRect.height / 2;
        if (dotCenter < viewportCenter + 50) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    });
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

/* ---------- Modal (Certifications popup with preview) ---------- */
function initModal() {
  const modal = document.getElementById("cert-modal");
  if (!modal) return;

  const modalTitle = modal.querySelector(".modal-title");
  const modalBody = modal.querySelector(".modal-body");
  const certIssuer = modal.querySelector(".cert-issuer");
  const previewArea = document.getElementById("cert-preview-area");
  const viewFullBtn = document.getElementById("cert-view-full");
  const closeBtn = modal.querySelector(".modal-close");

  // Open modal on cert card click
  document.querySelectorAll("[data-cert]").forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.dataset.certTitle || "Certificate";
      const desc = card.dataset.certDesc || "";
      const year = card.dataset.certYear || "";
      const issuer = card.dataset.certIssuer || "";
      const preview = card.dataset.certPreview || "";
      const full = card.dataset.certFull || preview;

      if (modalTitle) modalTitle.textContent = title;
      if (certIssuer) certIssuer.textContent = issuer ? `Issued by ${issuer} • ${year}` : year;
      if (modalBody) {
        modalBody.innerHTML = `<p>${desc}</p>`;
      }

      // Build preview
      if (previewArea) {
        previewArea.innerHTML = "";
        if (preview) {
          const ext = preview.split(".").pop().toLowerCase();
          if (ext === "pdf") {
            const iframe = document.createElement("iframe");
            iframe.src = preview;
            iframe.className = "cert-preview-frame";
            iframe.title = title;
            iframe.setAttribute("loading", "lazy");
            previewArea.appendChild(iframe);
          } else {
            const img = document.createElement("img");
            img.src = preview;
            img.alt = title;
            img.className = "cert-preview-img";
            img.setAttribute("loading", "lazy");
            previewArea.appendChild(img);
          }
          previewArea.style.display = "";
        } else {
          previewArea.style.display = "none";
        }
      }

      // View full link
      if (viewFullBtn) {
        if (full) {
          viewFullBtn.href = full;
          viewFullBtn.style.display = "";
        } else {
          viewFullBtn.style.display = "none";
        }
      }

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    // Stop iframe loading after close
    if (previewArea) previewArea.innerHTML = "";
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ---------- Skill View Toggle (Marquee ↔ Bubble) ---------- */
function initSkillToggle() {
  const toggleBtn = document.getElementById("skill-toggle");
  const marqueeView = document.getElementById("skills-marquee");
  const bubbleView = document.getElementById("skills-bubble");

  if (!toggleBtn || !marqueeView || !bubbleView) return;

  toggleBtn.addEventListener("click", () => {
    const isMarquee = !marqueeView.classList.contains("hidden");
    if (isMarquee) {
      marqueeView.classList.add("hidden");
      bubbleView.classList.remove("hidden");
      toggleBtn.textContent = "Switch to Marquee";
    } else {
      marqueeView.classList.remove("hidden");
      bubbleView.classList.add("hidden");
      toggleBtn.textContent = "Switch to Bubbles";
    }
  });
}

/* ---------- Utility: hidden class ---------- */
// (Tailwind provides .hidden but just in case)
