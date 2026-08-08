const checkoutButtons = document.querySelectorAll(".checkout-cta");
const year = document.querySelector("#year");

year.textContent = new Date().getFullYear();

checkoutButtons.forEach((button) => {
  const checkoutUrl = button.dataset.checkoutUrl.trim();

  if (checkoutUrl) {
    button.href = checkoutUrl;
    button.removeAttribute("aria-disabled");
  } else {
    button.addEventListener("click", (event) => event.preventDefault());
  }
});
