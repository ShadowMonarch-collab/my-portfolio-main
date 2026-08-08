const products = [
  { name: "Smart Air Fryer", slug: "air-fryer", image: "assets/smart-air-fryer.png", benefit: "Make weeknight meals feel less like another cleanup project.", features: ["Faster low-mess dinners", "Crisp comfort food with less oil", "Easy-clean basket"], price: 179 },
  { name: "Robot Vacuum", slug: "robot", image: "assets/robot-vacuum.png", benefit: "Keep floors from becoming one more thing waiting for you.", features: ["Scheduled daily cleaning", "Under-furniture reach", "Smart room coverage"], price: 299 },
  { name: "Air Purifier", slug: "purifier", image: "assets/air-purifier.png", benefit: "Help rooms feel fresher when the air starts to feel heavy.", features: ["Quiet filtration", "Air quality indicator", "Bedroom-friendly mode"], price: 249 },
  { name: "Smart Coffee Machine", slug: "coffee", image: "assets/smart-coffee-machine.png", benefit: "Make the first part of the morning feel handled.", features: ["Programmable brew times", "Consistent temperature", "One-touch control"], price: 199 },
  { name: "Portable Blender", slug: "blender", image: "assets/portable-blender.png", benefit: "Make quick, healthier starts easier when the day is already moving.", features: ["Cordless blending", "Travel-ready cup", "Quick rinse cleanup"], price: 79 },
  { name: "Smart Humidifier", slug: "humidifier", image: "assets/smart-humidifier.png", benefit: "Make dry rooms feel more comfortable without another manual routine.", features: ["Humidity control", "Quiet overnight mode", "Easy-fill tank"], price: 139 },
  { name: "Cordless Vacuum", slug: "vacuum", image: "assets/cordless-vacuum.png", benefit: "Handle quick messes before they turn into full cleaning sessions.", features: ["Lightweight handling", "Wall-mount storage", "Multi-surface cleaning"], price: 229 }
];

const faqs = [
  ["Can customers buy just one appliance?", "Yes. Individual appliances work well when one routine needs help. The Complete Kit is the best value for a full-home routine shift."],
  ["Why emphasize the bundle?", "Because the strongest ecommerce path is higher order value. The kit solves more than one routine and makes the offer easier to understand."],
  ["Is the timer real?", "The 24-hour timer is a static evergreen conversion timer. In GHL, rebuild it with a countdown widget or custom code."],
  ["How should this translate to GHL?", "Use sections for the sales copy, then let the GHL order form manage products, order summary, bumps, and checkout."]
];

const selected = new Map();
let route = "landing";
const timerStorageKey = "arcticHomeV2Deadline";
const offerDurationMs = 24 * 60 * 60 * 1000;
const endingSoonMs = 60 * 60 * 1000;

function money(value) {
  return `$${value.toLocaleString()}`;
}

function compareAt(item) {
  return item.price * 2;
}

function productCard(product, compact = false) {
  const features = product.features.map((feature) => `<li>${feature}</li>`).join("");
  return `
    <article class="product-card">
      <span class="sale-label">50% off + free shipping</span>
      <figure><img src="${product.image}" alt="${product.name}"></figure>
      <h3>${product.name}</h3>
      <p>${product.benefit}</p>
      ${compact ? "" : `<ul>${features}</ul>`}
      <div class="card-footer">
        <div><s>${money(compareAt(product))}</s><strong>${money(product.price)}</strong></div>
        <button type="button" data-buy-product="${product.name}">Buy Now</button>
      </div>
    </article>
  `;
}

function productLine(product) {
  return `
    <label class="oc-row">
      <span class="oc-check"><input type="checkbox" data-toggle-product="${product.name}" ${selected.has(product.name) ? "checked" : ""}></span>
      <span class="oc-info"><strong>${product.name}</strong><span>${product.benefit}</span></span>
      <span class="oc-qty">1</span>
      <span class="oc-price">${money(product.price)}</span>
    </label>
  `;
}

function renderModalProducts() {
  const el = document.getElementById("modalProducts");
  if (!el) return;
  el.innerHTML = products.map(productLine).join("");
}

function renderProducts() {
  document.getElementById("landingPreview").innerHTML = products.slice(0, 3).map((item) => productCard(item, true)).join("");
  document.getElementById("productGrid").innerHTML = products.map((item) => productCard(item)).join("");
}

function renderFaqs() {
  const faqList = document.getElementById("faqList");
  if (!faqList) return;
  faqList.innerHTML = faqs.map(([q, a], index) => `
    <article class="faq-item ${index === 0 ? "open" : ""}">
      <button type="button" class="faq-question" aria-expanded="${index === 0 ? "true" : "false"}"><span>${q}</span><span>+</span></button>
      <div class="faq-answer">${a}</div>
    </article>
  `).join("");
}

function renderSummaryBlock(targetId, totalId) {
  const target = document.getElementById(targetId);
  const total = document.getElementById(totalId);
  if (!target || !total) return;
  const items = [...selected.values()];
  if (!items.length) {
    target.innerHTML = `<div class="empty-state"><strong>No product selected.</strong><span>Choose a product or the complete kit.</span></div>`;
    total.textContent = "$0";
    return;
  }
  target.innerHTML = items.map((item) => `
    <div class="summary-item"><span>${item.name}</span><strong><s>${money(compareAt(item))}</s> ${money(item.price)}</strong></div>
  `).join("");
  total.textContent = money(items.reduce((sum, item) => sum + item.price, 0));
}

function renderAll() {
  renderProducts();
  renderSummaryBlock("modalSummary", "modalTotal");
}

function updateSelection(name, checked) {
  const product = products.find((item) => item.name === name);
  if (!product) return;
  if (checked) selected.set(product.name, product);
  else selected.delete(product.name);
  renderSummaryBlock("modalSummary", "modalTotal");
}

function getDeadline() {
  const now = Date.now();
  const stored = Number(localStorage.getItem(timerStorageKey));
  if (Number.isFinite(stored) && stored > now) return stored;
  const deadline = now + offerDurationMs;
  localStorage.setItem(timerStorageKey, String(deadline));
  return deadline;
}

function formatTime(ms) {
  const seconds = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function startTimer() {
  let deadline = getDeadline();
  const urgency = document.getElementById("promoUrgency");
  function tick() {
    const now = Date.now();
    let remaining = deadline - now;
    if (remaining <= 0) {
      deadline = now + offerDurationMs;
      localStorage.setItem(timerStorageKey, String(deadline));
      remaining = deadline - now;
    }
    const endingSoon = remaining <= endingSoonMs;
    document.body.classList.toggle("timer-ending", endingSoon);
    if (urgency) urgency.textContent = endingSoon ? "Ending soon" : "Launch offer active";
    document.querySelectorAll("[data-countdown]").forEach((node) => node.textContent = formatTime(remaining));
  }
  tick();
  setInterval(tick, 1000);
}

function selectBundle() {
  selected.clear();
  products.forEach((item) => selected.set(item.name, item));
  renderAll();
  openOrderForm();
}

function navigate(nextRoute) {
  route = nextRoute || "landing";
  document.querySelectorAll(".page").forEach((page) => page.classList.toggle("active", page.dataset.page === route));
  const sticky = document.querySelector("#stickyCta a");
  if (route === "sales") {
    sticky.textContent = "Shop The Collection";
    sticky.href = "#products";
    sticky.removeAttribute("data-route");
  } else if (route === "upsell") {
    sticky.textContent = "Add The Care Plan";
    sticky.href = "#thankyou";
    sticky.dataset.route = "thankyou";
  } else {
    sticky.textContent = "Build My Easier Home";
    sticky.href = "#sales";
    sticky.dataset.route = "sales";
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setOrderStep(step, scroll = true) {
  const form = document.getElementById("orderForm");
  if (!form) return;
  form.dataset.step = String(step);
  form.querySelectorAll("[data-step-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.stepPanel !== String(step);
  });
  form.querySelectorAll("[data-step-dot]").forEach((dot) => {
    const dotStep = Number(dot.dataset.stepDot);
    dot.classList.toggle("is-active", dotStep === step);
    dot.classList.toggle("is-done", dotStep < step);
  });
  if (scroll) form.closest(".order-modal-card")?.scrollTo({ top: 0, behavior: "smooth" });
}

function openOrderForm() {
  renderModalProducts();
  renderSummaryBlock("modalSummary", "modalTotal");
  setOrderStep(1, false);
  const modal = document.getElementById("orderModal");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeOrderModal() {
  const modal = document.getElementById("orderModal");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function buyProduct(name) {
  const product = products.find((item) => item.name === name);
  if (!product) return;
  selected.clear();
  selected.set(product.name, product);
  renderAll();
  openOrderForm();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const routeLink = event.target.closest("[data-route]");
    if (routeLink) {
      event.preventDefault();
      navigate(routeLink.dataset.route);
      history.replaceState(null, "", `#${routeLink.dataset.route}`);
      return;
    }
    if (event.target.closest("[data-select-bundle]")) {
      selectBundle();
      return;
    }
    const buyButton = event.target.closest("[data-buy-product]");
    if (buyButton) {
      buyProduct(buyButton.dataset.buyProduct);
      return;
    }
    if (event.target.closest("[data-apply-coupon]")) {
      const note = document.getElementById("couponNote");
      const input = document.getElementById("couponInput");
      if (note) note.hidden = !(input && input.value.trim());
      return;
    }
    if (event.target.closest("[data-order-next]")) {
      setOrderStep(2);
      return;
    }
    if (event.target.closest("[data-order-back]")) {
      setOrderStep(1);
      return;
    }
    if (event.target.closest("[data-order-close]")) {
      closeOrderModal();
      return;
    }
    const faqButton = event.target.closest(".faq-question");
    if (faqButton) {
      const item = faqButton.closest(".faq-item");
      const open = item.classList.toggle("open");
      faqButton.setAttribute("aria-expanded", String(open));
      return;
    }
  });

  const modalProducts = document.getElementById("modalProducts");
  if (modalProducts) {
    modalProducts.addEventListener("change", (event) => {
      const cb = event.target.closest("[data-toggle-product]");
      if (cb) updateSelection(cb.dataset.toggleProduct, cb.checked);
    });
  }

  document.getElementById("orderForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const terms = document.getElementById("agreeTerms");
    const termsError = document.getElementById("termsError");
    if (!selected.size) return;
    if (terms && !terms.checked) {
      if (termsError) termsError.hidden = false;
      return;
    }
    if (termsError) termsError.hidden = true;
    closeOrderModal();
    navigate("upsell");
    history.replaceState(null, "", "#upsell");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeOrderModal();
  });

  window.addEventListener("hashchange", () => {
    const hashRoute = window.location.hash.replace("#", "");
    if (["landing", "sales", "upsell", "thankyou"].includes(hashRoute)) navigate(hashRoute);
  });
}

function init() {
  renderAll();
  renderFaqs();
  bindEvents();
  startTimer();
  const initialRoute = window.location.hash.replace("#", "");
  navigate(["landing", "sales", "upsell", "thankyou"].includes(initialRoute) ? initialRoute : "landing");
}

init();
