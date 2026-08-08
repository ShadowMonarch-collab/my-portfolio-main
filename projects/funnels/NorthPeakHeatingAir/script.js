document.querySelectorAll(".faq-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq-toggle").forEach((item) => {
      item.setAttribute("aria-expanded", "false");
    });
    toggle.setAttribute("aria-expanded", String(!expanded));
  });
});

const form = document.querySelector("#booking-form");
const status = form.querySelector(".form-status");
const submit = form.querySelector('button[type="submit"]');
const preferredDate = form.querySelector('input[name="preferredDate"]');
const phone = form.querySelector('input[name="phone"]');
const zip = form.querySelector('input[name="zip"]');
const honeypot = form.querySelector('input[name="_gotcha"]');
const endpoint = form.dataset.endpoint.trim();

const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
preferredDate.min = localDate;

function validatePhone() {
  const digits = phone.value.replace(/\D/g, "");
  const normalizedDigits = digits.length === 11 && digits.startsWith("1")
    ? digits.slice(1)
    : digits;

  phone.setCustomValidity(
    normalizedDigits.length === 10 ? "" : "Enter a valid 10-digit U.S. phone number."
  );
}

function validateZip() {
  zip.setCustomValidity(
    /^[0-9]{5}(?:-[0-9]{4})?$/.test(zip.value.trim())
      ? ""
      : "Enter a 5-digit ZIP code or ZIP+4."
  );
}

function showStatus(title, message, isError = false) {
  status.querySelector("strong").textContent = title;
  status.querySelector("span").textContent = message;
  status.classList.toggle("is-error", isError);
  status.hidden = false;
  status.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

phone.addEventListener("input", validatePhone);
zip.addEventListener("input", validateZip);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  validatePhone();
  validateZip();

  if (!form.reportValidity()) {
    return;
  }

  if (honeypot.value.trim()) {
    form.reset();
    preferredDate.min = localDate;
    showStatus(
      "Request could not be submitted.",
      "Please reload the page and try again.",
      true
    );
    return;
  }

  if (!endpoint) {
    showStatus(
      "Online scheduling is not connected yet.",
      "Add the approved booking or lead endpoint before publishing this page.",
      true
    );
    return;
  }

  submit.disabled = true;
  status.hidden = true;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Scheduling request failed.");
    }

    form.reset();
    preferredDate.min = localDate;
    showStatus(
      "Request received.",
      "Your preferred service time will be reviewed for confirmation."
    );
  } catch {
    showStatus(
      "We could not send your request.",
      "Please try again once scheduling service is available.",
      true
    );
  } finally {
    submit.disabled = false;
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
