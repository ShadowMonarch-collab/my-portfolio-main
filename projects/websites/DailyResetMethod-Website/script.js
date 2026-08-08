const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = document.querySelectorAll(".nav-panel a");
const faqButtons = document.querySelectorAll(".faq-toggle");
const revealElements = document.querySelectorAll(".reveal");
const heroButton = document.querySelector(".hero-cta");
const purchaseSection = document.querySelector("#purchase");
const mobilePurchase = document.querySelector("#mobile-purchase");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");
  navPanel.classList.remove("is-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navPanel.classList.toggle("is-open", !isOpen);
});

navLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth >= 940) {
    closeMenu();
  }
});

const headerObserver = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 4);
};

window.addEventListener("scroll", headerObserver, { passive: true });
headerObserver();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -25px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    faqButtons.forEach((item) => item.setAttribute("aria-expanded", "false"));
    button.setAttribute("aria-expanded", String(!isOpen));
  });
});

let heroVisible = true;
let purchaseVisible = false;

if ("IntersectionObserver" in window) {
  const mobileCtaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroButton) {
          heroVisible = entry.isIntersecting;
        }

        if (entry.target === purchaseSection) {
          purchaseVisible = entry.isIntersecting;
        }
      });

      mobilePurchase.classList.toggle("is-visible", !heroVisible && !purchaseVisible);
    },
    { threshold: 0.05 }
  );

  mobileCtaObserver.observe(heroButton);
  mobileCtaObserver.observe(purchaseSection);
}
