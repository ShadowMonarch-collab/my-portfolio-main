const revealElements = document.querySelectorAll(".reveal");
const faqButtons = document.querySelectorAll(".faq-toggle");
const heroCta = document.querySelector(".hero-cta");
const stickyCta = document.querySelector("#mobile-sticky");
const finalCta = document.querySelector(".final-cta");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-shown");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-shown"));
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";

    faqButtons.forEach((item) => item.setAttribute("aria-expanded", "false"));
    button.setAttribute("aria-expanded", String(!isOpen));
  });
});

let heroCtaVisible = true;
let finalCtaVisible = false;

if ("IntersectionObserver" in window) {
  const stickyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroCta) {
          heroCtaVisible = entry.isIntersecting;
        }

        if (entry.target === finalCta) {
          finalCtaVisible = entry.isIntersecting;
        }
      });

      stickyCta.classList.toggle("is-visible", !heroCtaVisible && !finalCtaVisible);
    },
    { threshold: 0.1 }
  );

  stickyObserver.observe(heroCta);
  stickyObserver.observe(finalCta);
}
