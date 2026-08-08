/* ==========================================================================
   KESSLER AUTO WORKS — website interactions
   Shared by all six pages. Every component is optional: a page that doesn't
   contain a report, a tab set or a form simply skips that block.

   Degradation: with JS off the page is fully readable — every report finding
   and FAQ answer ships open, and forms post normally.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var doc = document;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canObserve = "IntersectionObserver" in window;

  /* `js` means the accordions have something to reopen them, so they may
     start collapsed. `motion` is the separate, stricter opt-in for reveals. */
  root.classList.add("js");

  /* ---------------------------------------------------- mobile nav ------- */

  var nav = doc.querySelector(".nav");
  var toggle = doc.querySelector(".nav__toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      doc.body.style.overflow = open ? "hidden" : "";
    });

    nav.querySelectorAll(".nav__drawer a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        doc.body.style.overflow = "";
      });
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        doc.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------- scroll state + to top ----- */

  var totop = doc.querySelector(".totop");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("is-scrolled", y > 18);
    if (totop) totop.classList.toggle("is-visible", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (totop) {
    totop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ------------------------------------------------------- reveals ------- */

  if (canObserve && !reduce) {
    root.classList.add("motion");

    var revealEls = doc.querySelectorAll(".reveal");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });

    /* Hard failsafe. Adding `in` is not enough on its own: if the animation
       clock is stalled (background tab, headless renderer, throttled
       compositor) the opacity transition sits pinned at 0 and the section
       ships blank no matter what class it carries. Suppress the transition
       declaration first — otherwise cancelling merely starts a fresh
       transition that stalls the same way — then cancel and drop `motion`. */
    var unstick = function (el) {
      if (!el) return;
      el.style.transition = "none";
      if (el.getAnimations) {
        el.getAnimations().forEach(function (a) { a.cancel(); });
      }
    };

    var forceReveal = function () {
      revealEls.forEach(function (el) { el.classList.add("in"); unstick(el); });
      unstick(doc.querySelector(".hero__bg"));
      root.classList.remove("motion");
    };

    window.addEventListener("load", function () {
      setTimeout(function () {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
        });

        /* Clock-health probe: anything marked revealed should have finished
           fading in by now. If one is still at zero the clock isn't
           advancing — bail out rather than wait on the slow failsafe. */
        setTimeout(function () {
          var stalled = Array.prototype.some.call(revealEls, function (el) {
            return el.classList.contains("in") &&
                   parseFloat(getComputedStyle(el).opacity) < 0.9;
          });
          if (stalled) forceReveal();
        }, 900);
      }, 240);
    });

    doc.addEventListener("visibilitychange", function () {
      if (!doc.hidden) setTimeout(forceReveal, 120);
    });
    setTimeout(forceReveal, 4000);
  }

  /* -------------------------------------------------- hero entrance ------ */

  var heroBg = doc.querySelector(".hero__bg");
  if (heroBg) {
    var showHero = function () {
      heroBg.classList.add("in");
      if (!reduce) heroBg.classList.add("pan");
    };
    /* rAF gives the transition a frame to animate from, but never fires in a
       background or stalled tab — the timer is the guarantee. Both idempotent. */
    requestAnimationFrame(showHero);
    setTimeout(showHero, 600);
  }

  /* ------------------------------------------- expand/collapse helper ---- */

  function setOpen(panel, open) {
    if (!panel) return;
    if (open) {
      panel.style.maxHeight = panel.scrollHeight + "px";
      window.setTimeout(function () {
        if (panel.dataset.open === "1") panel.style.maxHeight = "none";
      }, 760);
      panel.dataset.open = "1";
    } else {
      if (panel.style.maxHeight === "none") {
        panel.style.maxHeight = panel.scrollHeight + "px";
        void panel.offsetHeight;
      }
      panel.dataset.open = "0";
      requestAnimationFrame(function () { panel.style.maxHeight = "0px"; });
    }
  }

  /* ----------------------------------------------------- the report ------ */

  var report = doc.querySelector(".report");

  if (report) {
    var rows = Array.prototype.slice.call(report.querySelectorAll(".row"));

    rows.forEach(function (row) {
      var bar = row.querySelector(".row__bar");
      var detail = row.querySelector(".row__detail");
      var box = row.querySelector(".approve input");

      if (box && box.checked) row.classList.add("is-approved");

      bar.addEventListener("click", function () {
        var open = row.classList.toggle("is-open");
        bar.setAttribute("aria-expanded", open ? "true" : "false");

        /* A lazy image parsed inside a clamped, overflow-hidden container
           never enters the viewport, so the browser never schedules the
           fetch — and expanding the row does not re-trigger it. Promote to
           eager the first time the row opens or the photos never appear. */
        if (open) {
          row.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
            img.loading = "eager";
            img.src = img.src;
          });
        }

        setOpen(detail, open);
      });

      if (box) {
        box.addEventListener("change", function () {
          row.classList.toggle("is-approved", box.checked);
          tally();
        });
      }
    });

    var sumEl = doc.getElementById("report-sum");
    var noteEl = doc.getElementById("report-note");

    var tally = function () {
      var total = 0, approved = 0, offered = 0;
      rows.forEach(function (row) {
        var box = row.querySelector(".approve input");
        if (!box) return;                 // "Good" lines aren't billable
        offered++;
        if (box.checked) {
          approved++;
          total += parseInt(row.dataset.price, 10) || 0;
        }
      });
      if (sumEl) sumEl.textContent = "$" + total.toLocaleString("en-US");
      if (noteEl) {
        noteEl.textContent = approved === 0
          ? "Nothing approved · you'd owe the $29 scan and nothing else"
          : approved + " of " + offered + " recommended items approved · less the $29 scan credit";
      }
    };

    tally();
  }

  /* ------------------------------------------------ symptom selector ----- */

  var SYMPTOMS = {
    brakes: {
      title: "Grinding or squealing when you brake",
      usual: "Worn pads nine times out of ten. If it's a grind rather than a squeal the pads are likely gone and the rotors are taking the damage, which is why waiting on this one gets expensive fast.",
      range: "$290 – $460",
      rangeNote: "per axle, pads and rotors, parts and labor",
      check: "All four wheels come off. We measure pad thickness at every corner and rotor thickness against the manufacturer's minimum, then check the caliper slide pins — a seized pin wears one pad to nothing while the other three look fine, and a shop that skips this sells you the same brake job twice."
    },
    shake: {
      title: "Shaking in the wheel at highway speed",
      usual: "If it shakes all the time it's usually wheel balance. If it only shakes when you brake it's a warped front rotor. Those are wildly different bills, so it's worth knowing which one you've got before anyone quotes you.",
      range: "$28 – $389",
      rangeNote: "balance at the low end, front rotors at the high",
      check: "Road-force balance on all four, dial-indicator runout on the front rotors, and hands at 9-and-3 and 12-and-6 on each wheel to feel for tie rod and wheel bearing play. We tell you which of the three it is before we quote anything."
    },
    cel: {
      title: "Check engine light is on",
      usual: "Most commonly an evaporative-emissions leak — often just a failed gas cap seal — followed by a misfire or a lazy oxygen sensor. A steady light means drive it in. A flashing light means stop driving it; that's a misfire actively damaging the catalytic converter.",
      range: "$0 – $390",
      rangeNote: "a fair number of these are a $0 fix",
      check: "We pull the codes and the freeze-frame data, then test the actual circuit. A code points at a system, not a part — a P0171 is not a receipt for a new sensor. We've sent people home with a $14 gas cap more than once."
    },
    cold: {
      title: "Won't start on cold mornings",
      usual: "Almost always a battery that tests fine at room temperature and can't deliver in the cold. Occasionally a starter drawing too much current, or a parasitic drain pulling the battery down overnight.",
      range: "$0 – $265",
      rangeNote: "battery, or starter at the top end",
      check: "Load test at temperature — not the 20-second counter-top test the parts store runs — plus starter draw, charging output, and if it still looks clean we leave a meter on it overnight to catch a drain. That last test is free; we just need the car for a night."
    },
    clunk: {
      title: "Clunking over bumps and railroad tracks",
      usual: "Sway bar end links are the cheap and common answer, and they're the first thing we look at. Control arm bushings and strut mounts come next. Most people quoted struts for this noise don't need struts.",
      range: "$186 – $740",
      rangeNote: "end links at the low end, strut pair at the high",
      check: "On the lift with a pry bar, one joint at a time, while a second tech stands underneath and listens. It's slow and it's the only way to be sure. You'll get a video of the joint actually moving — you'll hear the clunk in it."
    },
    leak: {
      title: "A puddle where you park",
      usual: "In summer, clear water under the passenger side is air-conditioning condensate and is completely normal. Colour matters: green or orange is coolant, brown or black is oil, red is transmission or power steering.",
      range: "$0 – $685",
      rangeNote: "often nothing; water pump at the top end",
      check: "We identify the fluid by colour and location first, and if it isn't obvious we put UV dye in the suspect system and send you home for a week. Then it shows up under a blacklight in ten seconds instead of us guessing at your expense."
    }
  };

  var symBtns = doc.querySelectorAll(".sym");
  var symResult = doc.getElementById("sym-result");

  if (symBtns.length && symResult) {
    symBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var data = SYMPTOMS[btn.dataset.sym];
        if (!data) return;

        symBtns.forEach(function (b) { b.classList.remove("is-on"); b.setAttribute("aria-pressed", "false"); });
        btn.classList.add("is-on");
        btn.setAttribute("aria-pressed", "true");

        symResult.innerHTML =
          '<div class="sr__block">' +
            '<p class="sr__label">What it usually turns out to be</p>' +
            "<p>" + data.usual + "</p>" +
          "</div>" +
          '<div class="sr__block">' +
            '<p class="sr__label">What it usually costs here</p>' +
            '<p class="sr__range">' + data.range + "</p>" +
            "<p>" + data.rangeNote + "</p>" +
          "</div>" +
          '<div class="sr__block">' +
            '<p class="sr__label">How we\'d confirm it</p>' +
            "<p>" + data.check + "</p>" +
          "</div>" +
          '<div class="sr__cta"><a class="btn" href="contact.html#book" data-symptom="' +
            data.title.replace(/"/g, "&quot;") + '">Book the scan for this</a></div>';

        /* Carry the symptom to the booking page. sessionStorage survives the
           navigation; the contact page reads it once and clears it. */
        var cta = symResult.querySelector("[data-symptom]");
        cta.addEventListener("click", function () {
          try { sessionStorage.setItem("kessler:symptom", cta.dataset.symptom); } catch (e) {}
        });
      });
    });
  }

  /* --------------------------------------------------- price tabs -------- */

  var tabs = Array.prototype.slice.call(doc.querySelectorAll(".ptab"));

  if (tabs.length) {
    var activate = function (i) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        var panel = doc.getElementById(t.getAttribute("aria-controls"));
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (panel) {
          panel.classList.toggle("is-active", on);
          panel.hidden = !on;
        }
      });
    };

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activate(i); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
        if (e.key === "ArrowLeft")  next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === "Home")       next = 0;
        if (e.key === "End")        next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        activate(next);
        tabs[next].focus();
      });
    });
  }

  /* --------------------------------------------------------- faq --------- */

  doc.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");
    if (!q || !a) return;

    q.addEventListener("click", function () {
      var willOpen = !item.classList.contains("is-open");
      var list = item.closest(".faq__list") || doc;

      list.querySelectorAll(".faq__item.is-open").forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
        setOpen(other.querySelector(".faq__a"), false);
      });

      if (willOpen) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
        setOpen(a, true);
      }
    });
  });

  /* ------------------------------------------------ validated forms ------ */

  var RULES = {
    name:    { test: function (v) { return v.trim().length >= 2; },
               msg: "Please give us a first name." },
    phone:   { test: function (v) { return v.replace(/\D/g, "").length >= 10; },
               msg: "We need 10 digits so we can text you times." },
    vehicle: { test: function (v) { return v.trim().length >= 4; },
               msg: "Year, make and model — a rough guess is fine." },
    email:   { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
               msg: "That email doesn't look right." },
    message: { test: function (v) { return v.trim().length >= 5; },
               msg: "Tell us a little about what's going on." }
  };

  doc.querySelectorAll("[data-validate-form]").forEach(function (form) {
    var controls = Array.prototype.slice.call(form.querySelectorAll("[data-rule]"));

    var validate = function (input) {
      var rule = RULES[input.dataset.rule];
      if (!rule) return true;
      var field = input.closest(".field");
      var err = field.querySelector(".err");
      var ok = rule.test(input.value);
      field.classList.toggle("is-bad", !ok);
      if (err) err.textContent = ok ? "" : rule.msg;
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    };

    controls.forEach(function (input) {
      input.addEventListener("blur", function () { validate(input); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("is-bad")) validate(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var allOk = controls.map(validate).every(Boolean);
      if (!allOk) {
        var firstBad = form.querySelector(".field.is-bad").querySelector("input, textarea, select");
        if (firstBad) firstBad.focus();
        return;
      }


      var success = form.parentElement.querySelector(".form-success");
      if (!success) return;

      var phone = form.querySelector('[data-rule="phone"]');
      var echo = success.querySelector("[data-echo-phone]");
      if (phone && echo) {
        var d = phone.value.replace(/\D/g, "").slice(-10);
        echo.textContent = "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
      }

      form.hidden = true;
      success.hidden = false;
      success.setAttribute("tabindex", "-1");
      success.focus();
    });
  });

  /* Pull a symptom chosen on another page into the booking form, once. */
  var symptomField = doc.getElementById("f-symptom");
  if (symptomField) {
    try {
      var carried = sessionStorage.getItem("kessler:symptom");
      if (carried && !symptomField.value.trim()) symptomField.value = carried;
      sessionStorage.removeItem("kessler:symptom");
    } catch (e) {}
  }

  /* ---------------------------------------------------- footer year ------ */

  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
