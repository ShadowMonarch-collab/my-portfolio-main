const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const form = document.querySelector("[data-form]");
const formStatus = document.querySelector("[data-form-status]");
const preferredDate = document.querySelector("[data-preferred-date]");
const honeypot = document.querySelector("[data-honeypot]");
const validatedFields = [
  document.getElementById("full-name"),
  document.getElementById("phone-number"),
  document.getElementById("patient-type"),
  document.getElementById("visit-reason"),
  document.getElementById("preferred-date"),
  document.getElementById("preferred-time"),
  document.getElementById("contact-consent")
];

document.querySelector("[data-year]").textContent = new Date().getFullYear();
const now = new Date();
preferredDate.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];

function syncHeader() {
  header.classList.toggle("scrolled", window.scrollY > 8);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Open navigation menu" : "Close navigation menu");
  nav.classList.toggle("open", !expanded);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    nav.classList.remove("open");
  });
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.hash === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px" });

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

document.querySelector("[data-accordion]").addEventListener("toggle", (event) => {
  if (event.target.open) {
    document.querySelectorAll("[data-accordion] details").forEach((item) => {
      if (item !== event.target) {
        item.open = false;
      }
    });
  }
}, true);

function getValidationMessage(field) {
  if (field.id === "phone-number") {
    const value = field.value.trim();
    const digitCount = value.replace(/\D/g, "").length;
    if (!value) {
      return "This field is required.";
    }
    if (!/^[0-9+() .-]+$/.test(value) || digitCount < 7 || digitCount > 15) {
      return "Enter a valid mobile number.";
    }
    return "";
  }

  if (field.validity.valid) {
    return "";
  }

  if (field.id === "full-name" && field.validity.tooShort) {
    return "Please enter your full name.";
  }

  if (field.id === "preferred-date" && field.validity.rangeUnderflow) {
    return "Please choose today or a later date.";
  }

  if (field.id === "contact-consent") {
    return "Please agree to be contacted about your request.";
  }

  return "This field is required.";
}

function validateField(field) {
  const error = document.getElementById(`${field.id}-error`);
  const message = getValidationMessage(field);
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
  return !message;
}

validatedFields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("change", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") {
      validateField(field);
    }
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.classList.remove("error");
  formStatus.textContent = "";

  if (honeypot.value.trim()) {
    form.reset();
    return;
  }

  const isValid = validatedFields.map((field) => validateField(field)).every(Boolean);
  if (!isValid) {
    formStatus.classList.add("error");
    formStatus.textContent = "Please review the highlighted fields before submitting.";
    validatedFields.find((field) => field.getAttribute("aria-invalid") === "true").focus();
    return;
  }

  formStatus.textContent = "Thank you. Your appointment request details have been prepared for the clinic team.";
});
