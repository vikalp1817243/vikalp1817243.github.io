/* ============================================
   tsParticles — Cyberpunk Configuration
   ============================================ */

function initParticles() {
  tsParticles.load("particles-bg", {
    fullScreen: false,
    fpsLimit: 60,
    particles: {
      number: {
        value: 70,
        density: {
          enable: true,
          area: 800,
        },
      },
      color: {
        value: ["#39ff14", "#ff1493", "#dc143c", "#b400ff", "#ff00e5"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.2, max: 0.6 },
        animation: {
          enable: true,
          speed: 0.8,
          minimumValue: 0.1,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 3 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.5,
          sync: false,
        },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#39ff14",
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "bounce",
        },
        attract: {
          enable: false,
        },
      },
    },
    interactivity: {
      detectsOn: "window", // Listens to events on window since canvas has pointer-events: none
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
        onClick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 180,
          links: {
            opacity: 0.4,
            color: "#ff1493",
          },
        },
        push: {
          quantity: 3,
        },
      },
    },
    detectRetina: true,
  });
}

// Reduce particles on mobile for performance or support prefers-reduced-motion
function initParticlesResponsive() {
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    tsParticles.load("particles-bg", {
      fullScreen: false,
      particles: {
        number: { value: 30, density: { enable: true, area: 800 } },
        color: { value: ["#39ff14", "#ff1493", "#dc143c"] },
        shape: { type: "circle" },
        opacity: { value: 0.3 },
        size: { value: { min: 1, max: 2 } },
        links: { enable: false },
        move: { enable: false },
      },
      interactivity: {
        detectsOn: "window",
        events: { onHover: { enable: false }, onClick: { enable: false }, resize: true },
      },
      detectRetina: true,
    });
    return;
  }

  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    tsParticles.load("particles-bg", {
      fullScreen: false,
      fpsLimit: 30,
      particles: {
        number: { value: 30, density: { enable: true, area: 800 } },
        color: { value: ["#39ff14", "#ff1493", "#dc143c"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.2, max: 0.5 } },
        size: { value: { min: 1, max: 2 } },
        links: { enable: true, distance: 120, color: "#39ff14", opacity: 0.1, width: 1 },
        move: { enable: true, speed: 0.8, direction: "none", outModes: { default: "bounce" } },
      },
      interactivity: {
        detectsOn: "window", // Listens on window since canvas has pointer-events: none
        events: { onHover: { enable: false }, onClick: { enable: true, mode: "push" }, resize: true },
        modes: { push: { quantity: 2 } },
      },
      detectRetina: true,
    });
  } else {
    initParticles();
  }
}

// Init when DOM is ready
document.addEventListener("DOMContentLoaded", initParticlesResponsive);
