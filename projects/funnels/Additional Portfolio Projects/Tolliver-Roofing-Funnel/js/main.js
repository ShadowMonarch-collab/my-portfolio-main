/* TOLLIVER ROOFING & EXTERIORS - funnel behaviour
   Every animation here earns its place:
     hero settle  -> draws the eye to the one thing above the fold
     reveals      -> paces a long scroll so each section reads as one idea
     accordion    -> state transition on a real disclosure
     form states  -> feedback on the only action the page asks for
   Nothing loops, nothing parallaxes, nothing hijacks the scroll. */

(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- reveals ----------
     The CSS only hides .reveal while .js is set. Three separate
     failsafes guarantee it comes back: reduced motion, no
     IntersectionObserver, window load, and any hidden-tab render
     (transitions and observers both stall while a tab is hidden,
     which is exactly how a section ships blank). */

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function revealAll() {
    for (var i = 0; i < revealEls.length; i++) revealEls[i].classList.add("in");
  }

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });

    // anything already on screen before the observer settles
    requestAnimationFrame(function () {
      revealEls.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add("in");
      });
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) revealAll();
    });
    if (document.hidden) revealAll();

    window.addEventListener("load", function () {
      setTimeout(function () {
        revealEls.forEach(function (el) {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
        });
      }, 100);
    });
  }

  reduceMotion.addEventListener("change", function (e) { if (e.matches) revealAll(); });

  /* ---------- hero: the photo settles out of a slow push-in ---------- */

  var shot = document.querySelector(".hero__shot");
  if (shot && !reduceMotion.matches) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { shot.classList.add("settled"); });
    });
  }

  /* ---------- FAQ: one answer open at a time ---------- */

  var items = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));

  function closeItem(item) {
    item.classList.remove("open");
    item.querySelector(".faq__a").style.maxHeight = "";
    item.querySelector(".faq__q").setAttribute("aria-expanded", "false");
  }

  items.forEach(function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");

    q.addEventListener("click", function () {
      var wasOpen = item.classList.contains("open");
      items.forEach(function (other) { if (other.classList.contains("open")) closeItem(other); });
      if (wasOpen) return;

      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
      q.setAttribute("aria-expanded", "true");
    });
  });

  // keep an open answer the right height when the text reflows
  var reflow;
  window.addEventListener("resize", function () {
    clearTimeout(reflow);
    reflow = setTimeout(function () {
      var open = document.querySelector(".faq__item.open .faq__a");
      if (open) open.style.maxHeight = open.scrollHeight + "px";
    }, 120);
  });

  /* ---------- lead form ---------- */

  var form = document.querySelector(".lead");
  if (!form) return;

  var errorBox = form.querySelector(".lead__error");
  var fields = Array.prototype.slice.call(form.querySelectorAll("input"));

  function digits(value) { return value.replace(/\D/g, "").length; }

  function validate() {
    var problems = [];
    fields.forEach(function (input) { input.removeAttribute("aria-invalid"); });

    var name = form.querySelector("#lead-name");
    var phone = form.querySelector("#lead-phone");
    var addr = form.querySelector("#lead-addr");

    if (name.value.trim().length < 2) { problems.push("your first name"); name.setAttribute("aria-invalid", "true"); }
    if (digits(phone.value) < 10) { problems.push("a 10 digit mobile number"); phone.setAttribute("aria-invalid", "true"); }
    if (addr.value.trim().length < 5) { problems.push("a street address or ZIP"); addr.setAttribute("aria-invalid", "true"); }

    return problems;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var problems = validate();
    if (problems.length) {
      var list = problems.length > 1
        ? problems.slice(0, -1).join(", ") + " and " + problems[problems.length - 1]
        : problems[0];
      errorBox.textContent = "We still need " + list + " to book the visit.";
      errorBox.hidden = false;
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    errorBox.hidden = true;

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = "Sending";

    setTimeout(function () {
      var first = form.querySelector("#lead-name").value.trim();

      var done = document.createElement("div");
      done.className = "lead__done";
      done.setAttribute("role", "status");

      /* Built through the DOM, not innerHTML. The name is visitor input, and
         textContent means it is never handed to the HTML parser, so no amount
         of markup in that field can become markup on the page. */
      var head = document.createElement("b");
      head.textContent = "Thanks, " + first + ". You are on the schedule.";

      var body = document.createElement("span");
      body.textContent =
        "We will text you two or three time windows within the hour. " +
        "If the roof is actively leaking, call (515) 555-0147 and we will move you up today.";

      done.appendChild(head);
      done.appendChild(body);
      form.appendChild(done);
      form.classList.add("sent");
      done.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
    }, 700);
  });

  // clear the error as soon as the person starts fixing it
  fields.forEach(function (input) {
    input.addEventListener("input", function () {
      if (!errorBox.hidden) errorBox.hidden = true;
      input.removeAttribute("aria-invalid");
    });
  });
})();
