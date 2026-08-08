/* BACKLINE EVENTS CO. — motion & interaction
   Direction's motion plan: fast cuts, crisp state changes, contingency items
   locking into place as the plan enters view. No parallax, no cinematic drift. */

(function () {
  "use strict";

  var doc = document.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function disarm() {
    if (window.__backlineFailsafe) {
      clearTimeout(window.__backlineFailsafe);
      window.__backlineFailsafe = null;
    }
  }

  /* Drop the gate entirely: content shows, no entrance. This is the safe state
     and every failure path lands here. */
  function ungate() {
    disarm();
    doc.classList.remove("js");
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* IntersectionObserver does not fire in a hidden document, so a page rendered
     in a background tab, a prerender, or a headless screenshotter would sit at
     opacity 0 forever. Anything other than a live, visible, motion-friendly
     document skips the choreography rather than risking a blank page. */
  if (!doc.classList.contains("js") ||
      reduced ||
      !("IntersectionObserver" in window) ||
      document.visibilityState !== "visible") {
    ungate();
  } else {
    var io = new IntersectionObserver(function (entries) {
      /* First callback proves the observer really runs here; only now is the
         head script's failsafe unnecessary. */
      disarm();
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    reveals.forEach(function (el) { io.observe(el); });

    /* Backgrounded mid-scroll: transitions stall, so give up on the animation
       and just show everything when the reader comes back. */
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") ungate();
    }, { once: true });
  }

  /* ---------- lead form ---------- */

  var form = document.querySelector(".form");
  if (!form) return;

  var done = document.querySelector(".form__done");

  var RULES = {
    "f-name": function (v) { return v.trim().length >= 2 || "Tell us who to ask for."; },
    "f-email": function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "That email address looks incomplete."; },
    "f-date": function (v) { return v !== "" || "Pick a date. An estimate is fine."; }
  };

  function check(input) {
    var verdict = RULES[input.id](input.value);
    var msg = document.querySelector('[data-err-for="' + input.id + '"]');
    var bad = verdict !== true;
    input.setAttribute("aria-invalid", bad ? "true" : "false");
    if (msg) {
      msg.textContent = bad ? verdict : "";
      msg.hidden = !bad;
    }
    return !bad;
  }

  Object.keys(RULES).forEach(function (id) {
    var input = document.getElementById(id);
    if (!input) return;
    /* Validate on blur, then live once it has been corrected: nagging while
       someone is still typing their first character helps nobody. */
    input.addEventListener("blur", function () { check(input); });
    input.addEventListener("input", function () {
      if (input.getAttribute("aria-invalid") === "true") check(input);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstBad = null;
    Object.keys(RULES).forEach(function (id) {
      var input = document.getElementById(id);
      if (input && !check(input) && !firstBad) firstBad = input;
    });
    if (firstBad) { firstBad.focus(); return; }

    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending…";

    setTimeout(function () {
      form.hidden = true;
      if (done) {
        done.hidden = false;
        done.setAttribute("tabindex", "-1");
        done.focus();
      }
    }, 550);
  });
})();
