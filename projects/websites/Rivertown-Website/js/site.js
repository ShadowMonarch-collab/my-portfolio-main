/* Ellison Family Dental — website interactions
   Warm, unhurried, accessible. Progressive enhancement throughout. */

(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var doc = document;

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = doc.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Mobile nav drawer ---------- */
  var navToggle = doc.querySelector(".nav-toggle");
  var mobileNav = doc.getElementById("mobile-nav");
  function closeNav() {
    if (!navToggle || !mobileNav) return;
    navToggle.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
    doc.body.classList.remove("nav-open");
  }
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      var open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
      doc.body.classList.toggle("nav-open", !open);
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    window.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = doc.querySelectorAll(".reveal, .reveal-scale, [data-reveal-stagger]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute("data-reveal-stagger")) {
          var kids = el.children;
          for (var i = 0; i < kids.length; i++) {
            kids[i].style.transitionDelay = Math.min(i * 90, 540) + "ms";
          }
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });

    // Failsafe: never let a section ship blank if the observer is starved or
    // CSS transitions are paused (inactive/headless tab). After a grace period,
    // force the final visible state inline, with no transition to stall on.
    window.setTimeout(function () {
      revealEls.forEach(function (el) {
        if (el.classList.contains("in")) return;
        el.classList.add("in");
        el.style.transition = "none";
        el.style.opacity = "1";
        el.style.transform = "none";
        if (el.hasAttribute("data-reveal-stagger")) {
          for (var i = 0; i < el.children.length; i++) {
            el.children[i].style.transition = "none";
            el.children[i].style.opacity = "1";
            el.children[i].style.transform = "none";
          }
        }
        io.unobserve(el);
      });
    }, 2500);
  }

  /* ---------- Animated stat counters ---------- */
  var counters = doc.querySelectorAll("[data-count]");
  if (counters.length) {
    if (prefersReduced || !("IntersectionObserver" in window)) {
      counters.forEach(function (c) { c.textContent = c.getAttribute("data-count") + (c.getAttribute("data-suffix") || ""); });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
          var dur = 1600, start = null;
          function tick(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(decimals) + suffix;
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = target.toFixed(decimals) + suffix;
          }
          requestAnimationFrame(tick);
          cio.unobserve(el);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { cio.observe(c); });

      // Failsafe: if the counter never scrolls into a firing state, still show it.
      window.setTimeout(function () {
        counters.forEach(function (c) {
          if (c.textContent === "0") {
            c.textContent = c.getAttribute("data-count") + (c.getAttribute("data-suffix") || "");
          }
        });
      }, 2600);
    }
  }

  /* ---------- Parallax hero photo ---------- */
  var parallax = doc.querySelectorAll("[data-parallax]");
  if (parallax.length && !prefersReduced) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        parallax.forEach(function (el) {
          var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
          el.style.transform = "translate3d(0," + (y * speed).toFixed(1) + "px,0)";
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Sticky mobile CTA + back-to-top ---------- */
  var stickyCta = doc.getElementById("sticky-cta");
  var toTop = doc.getElementById("to-top");
  function onScrollFloaties() {
    var past = window.scrollY > 640;
    var nearBottom = (window.innerHeight + window.scrollY) > (doc.body.offsetHeight - 220);
    if (stickyCta) stickyCta.classList.toggle("is-visible", past && !nearBottom);
    if (toTop) toTop.classList.toggle("is-visible", past);
  }
  window.addEventListener("scroll", onScrollFloaties, { passive: true });
  onScrollFloaties();
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ---------- Booking / contact form ---------- */
  function wireForm(formId, successId) {
    var form = doc.getElementById(formId);
    var success = doc.getElementById(successId);
    if (!form) return;

    function setValidity(input, errId, ok) {
      var err = doc.getElementById(errId);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      if (err) err.hidden = ok;
      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector("[name='name']");
      var phone = form.querySelector("[name='phone']");
      var email = form.querySelector("[name='email']");

      if (name) ok = setValidity(name, name.id + "-error", name.value.trim().length > 1) && ok;
      if (phone) ok = setValidity(phone, phone.id + "-error", /[\d\s()+-]{7,}/.test(phone.value.trim())) && ok;
      if (email && email.value.trim()) ok = setValidity(email, email.id + "-error", /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) && ok;

      if (!ok) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }


      if (success) {
        form.hidden = true;
        success.hidden = false;
        success.setAttribute("tabindex", "-1");
        success.focus();
        success.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
      }
    });
  }
  wireForm("booking-form", "booking-success");
  wireForm("contact-form", "contact-success");

  /* ---------- Footer year ---------- */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
