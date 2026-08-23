/* ============================================
   Contact Form — EmailJS + DOMPurify Sanitization
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("sender-email");
    const subjectInput = document.getElementById("sender-subject");
    const messageInput = document.getElementById("sender-message");
    const submitBtn = form.querySelector('button[type="submit"]');

    // Basic validation
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!email || !subject || !message) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    // Sanitize with DOMPurify (loaded via CDN)
    const sanitizedData = {
      from_email: typeof DOMPurify !== "undefined" ? DOMPurify.sanitize(email) : email,
      subject: typeof DOMPurify !== "undefined" ? DOMPurify.sanitize(subject) : subject,
      message: typeof DOMPurify !== "undefined" ? DOMPurify.sanitize(message) : message,
    };

    // Disable button during send
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      // EmailJS send
      // NOTE: Replace these with your actual EmailJS IDs
      // Sign up at https://www.emailjs.com/
      await emailjs.send(
        "YOUR_SERVICE_ID",  // TODO: Replace with EmailJS service ID
        "YOUR_TEMPLATE_ID", // TODO: Replace with EmailJS template ID
        sanitizedData
      );

      showToast("Message sent successfully! ✓", "success");
      form.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showToast(message, type = "success") {
  // Remove any existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
