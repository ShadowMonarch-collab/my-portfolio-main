/* GRIND HOUSE ATHLETICS — motion & interaction
   Restraint per design direction: slow fades, one hero pan, nothing busy. */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- image slots ----------
     Every .ph / .hero__bg / .close__bg carries data-src (or a fixed
     asset path). If the real file exists in assets/, swap it in;
     otherwise the palette-tinted atmosphere stays. */

  function wireImage(el, src) {
    if (!src) return;
    var probe = new Image();
    probe.onload = function () {
      el.style.backgroundImage = "url('" + src + "')";
      el.classList.add("ph--loaded");
    };
    probe.src = src;
  }

  document.querySelectorAll(".ph[data-src]").forEach(function (el) {
    wireImage(el, el.getAttribute("data-src"));
  });
  wireImage(document.querySelector(".hero__bg"), "assets/bg-hero-wide-class.jpg");
  wireImage(document.querySelector(".close__bg"), "assets/bg-close-atmosphere.jpg");

  /* ---------- hero entrance: image fades in, text settles after ---------- */

  var heroBg = document.querySelector(".hero__bg");
  if (heroBg) {
    requestAnimationFrame(function () {
      heroBg.classList.add("in");
      if (!reduceMotion) heroBg.classList.add("pan"); // single cinematic pan, hero only
    });
  }

  /* ---------- scroll reveals: slow, deliberate, one at a time ---------- */

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- FAQ accordion (minimal, slow) ---------- */

  document.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");

      // close any other open item — one quiet answer at a time
      document.querySelectorAll(".faq__item.open").forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq__a").style.maxHeight = null;
        other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- lead form ---------- */

  var form = document.querySelector(".close__form");
  if (form) {
    var errorBox = form.querySelector(".form__error");
    var nameField = form.querySelector("#lead-name");
    var phoneField = form.querySelector("#lead-phone");

    function digitsIn(value) { return value.replace(/\D/g, "").length; }

    function validate() {
      var problems = [];
      nameField.removeAttribute("aria-invalid");
      phoneField.removeAttribute("aria-invalid");

      if (nameField.value.trim().length < 2) {
        problems.push("your first name");
        nameField.setAttribute("aria-invalid", "true");
      }
      if (digitsIn(phoneField.value) < 10) {
        problems.push("a 10 digit mobile number");
        phoneField.setAttribute("aria-invalid", "true");
      }
      return problems;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var problems = validate();
      if (problems.length) {
        var list = problems.length > 1
          ? problems.slice(0, -1).join(", ") + " and " + problems[problems.length - 1]
          : problems[0];
        if (errorBox) {
          errorBox.textContent = "We still need " + list + ".";
          errorBox.hidden = false;
        }
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (errorBox) errorBox.hidden = true;

      var btn = form.querySelector("button[type=submit]");
      btn.textContent = "Spot Requested — Check Your Texts";
      btn.disabled = true;
    });

    [nameField, phoneField].forEach(function (input) {
      input.addEventListener("input", function () {
        if (errorBox && !errorBox.hidden) errorBox.hidden = true;
        input.removeAttribute("aria-invalid");
      });
    });
  }
})();
