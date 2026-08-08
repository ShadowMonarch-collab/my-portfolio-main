const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#nav-menu");
const menuLabel = menuToggle.querySelector(".sr-only");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuLabel.textContent = "Open menu";
  menu.classList.remove("open");
}

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuLabel.textContent = expanded ? "Open menu" : "Close menu";
  menu.classList.toggle("open", !expanded);
});

menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1020) {
    closeMenu();
  }
});

document.querySelectorAll(".faq-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq-toggle").forEach((item) => {
      item.setAttribute("aria-expanded", "false");
      document.querySelector(`#${item.getAttribute("aria-controls")}`).hidden = true;
    });

    if (!isOpen) {
      toggle.setAttribute("aria-expanded", "true");
      document.querySelector(`#${toggle.getAttribute("aria-controls")}`).hidden = false;
    }
  });
});

const serviceForm = document.querySelector("#service-form");
const formStatus = document.querySelector("#form-status");
const formSubmit = serviceForm.querySelector('button[type="submit"]');
const preferredDate = serviceForm.querySelector('input[name="preferredDate"]');
const phone = serviceForm.querySelector('input[name="phone"]');
const zip = serviceForm.querySelector('input[name="zip"]');
const honeypot = serviceForm.querySelector('input[name="_gotcha"]');
const endpoint = serviceForm.dataset.endpoint.trim();

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
preferredDate.min = localDate;

phone.addEventListener("input", () => {
  phone.setCustomValidity("");
});

zip.addEventListener("input", () => {
  zip.setCustomValidity("");
});

function showFormStatus(title, message, isError = false) {
  formStatus.querySelector("strong").textContent = title;
  formStatus.querySelector("span").textContent = message;
  formStatus.classList.toggle("is-error", isError);
  formStatus.hidden = false;
  formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

serviceForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (honeypot.value.trim()) {
    serviceForm.reset();
    preferredDate.min = localDate;
    return;
  }

  phone.setCustomValidity(
    phone.validity.patternMismatch
      ? "Enter a valid phone number."
      : ""
  );
  zip.setCustomValidity(
    zip.validity.patternMismatch
      ? "Enter a valid 5-digit ZIP code."
      : ""
  );

  if (!serviceForm.checkValidity()) {
    serviceForm.reportValidity();
    return;
  }

  if (!endpoint) {
    showFormStatus(
      "Online scheduling is not connected yet.",
      "Add the approved booking or lead endpoint before publishing this website.",
      true
    );
    return;
  }

  formSubmit.disabled = true;
  formStatus.hidden = true;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(serviceForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Scheduling request failed.");
    }

    serviceForm.reset();
    preferredDate.min = localDate;
    showFormStatus(
      "Request received.",
      "Your preferred service time will be reviewed for confirmation."
    );
  } catch {
    showFormStatus(
      "We could not send your request.",
      "Please try again once scheduling service is available.",
      true
    );
  } finally {
    formSubmit.disabled = false;
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll(".reveal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}
