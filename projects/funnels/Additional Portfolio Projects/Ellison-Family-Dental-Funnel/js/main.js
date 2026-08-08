/* Ellison Family Dental — warm, unhurried interactions */

(function () {
  "use strict";

  /* ---------- Scroll reveals: gentle, one at a time ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revealDelay = 0;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        /* Stagger siblings revealed in the same pass — "getting to know us" pacing */
        el.style.transitionDelay = revealDelay + "ms";
        revealDelay = Math.min(revealDelay + 120, 360);
        el.classList.add("in");
        observer.unobserve(el);
        setTimeout(function () { revealDelay = 0; }, 400);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Sticky mobile CTA: show after hero, hide at the form ---------- */
  var stickyCta = document.getElementById("sticky-cta");
  var hero = document.querySelector(".hero");
  var bookSection = document.getElementById("book");

  function updateStickyCta() {
    if (!stickyCta || !hero || !bookSection) return;
    var heroPassed = window.scrollY > hero.offsetTop + hero.offsetHeight * 0.7;
    var bookRect = bookSection.getBoundingClientRect();
    var bookVisible = bookRect.top < window.innerHeight && bookRect.bottom > 0;
    stickyCta.hidden = !(heroPassed && !bookVisible);
  }

  window.addEventListener("scroll", updateStickyCta, { passive: true });
  window.addEventListener("resize", updateStickyCta);
  updateStickyCta();

  /* ---------- Booking form ---------- */
  var form = document.getElementById("booking-form");
  var success = document.getElementById("form-success");

  function setFieldValidity(input, errorEl, valid) {
    input.setAttribute("aria-invalid", valid ? "false" : "true");
    errorEl.hidden = valid;
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = document.getElementById("bf-name");
      var phone = document.getElementById("bf-phone");
      var day = document.getElementById("bf-day");

      var nameOk = name.value.trim().length > 1;
      var phoneOk = /[\d\s()+-]{7,}/.test(phone.value.trim());
      var dayOk = day.value !== "";

      setFieldValidity(name, document.getElementById("bf-name-error"), nameOk);
      setFieldValidity(phone, document.getElementById("bf-phone-error"), phoneOk);
      setFieldValidity(day, document.getElementById("bf-day-error"), dayOk);

      if (!(nameOk && phoneOk && dayOk)) {
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
