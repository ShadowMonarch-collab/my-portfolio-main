/* ==========================================================================
   KESSLER AUTO WORKS — interaction
   Everything degrades: with JS off the page is fully readable, every
   report line and FAQ answer is open, and the form posts normally.
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canObserve = "IntersectionObserver" in window;

  /* `js` means the accordions have something to reopen them, so they may
     start collapsed. `motion` is the separate, stricter opt-in for the
     scroll reveals. Without JS the report and the FAQ ship fully open. */
  root.classList.add("js");

  /* ---------------------------------------------------- reveals ----------
     Only opt into the hidden-then-reveal state if we can actually drive it.
     A belt-and-braces failsafe force-reveals everything if the page was
     rendered in a background tab (transitions don't fire there) or if the
     observer never got around to an element. */

  if (canObserve && !reduce) {
    root.classList.add("motion");

    var revealEls = document.querySelectorAll(".reveal");
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
       ships blank no matter what class it carries. Dropping `motion`
       deletes the hidden state and the transition outright, so the content
       snaps visible whether or not anything is animating. */
    var forceReveal = function () {
      var unstick = function (el) {
        /* A transition that already started keeps driving the property even
           after its rule is gone — a stalled one would pin opacity at 0
           forever. Suppress the declaration first (otherwise cancelling just
           starts a fresh transition that stalls the same way), then cancel
           so the plain computed style takes over. */
        if (!el) return;
        el.style.transition = "none";
        if (el.getAnimations) {
          el.getAnimations().forEach(function (a) { a.cancel(); });
        }
      };
      revealEls.forEach(function (el) { el.classList.add("in"); unstick(el); });
      // the hero backdrop fades on its own timer, so it needs the same rescue
      unstick(document.querySelector(".hero__bg"));
      root.classList.remove("motion");
    };
    window.addEventListener("load", function () {
      // anything already in view but never fired (background render)
      setTimeout(function () {
        revealEls.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
        });

        /* Clock-health probe: an element marked revealed should have
           finished fading in by now. If one is still sitting at zero the
           animation clock isn't advancing — bail out of motion entirely
           rather than wait on the slow failsafe with a blank hero. */
        setTimeout(function () {
          var stalled = Array.prototype.some.call(revealEls, function (el) {
            return el.classList.contains("in") &&
                   parseFloat(getComputedStyle(el).opacity) < 0.9;
          });
          if (stalled) forceReveal();
        }, 900);
      }, 240);
    });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) setTimeout(forceReveal, 120);
    });
    setTimeout(forceReveal, 4000);
  }

  /* ------------------------------------------------ hero entrance -------- */

  var heroBg = document.querySelector(".hero__bg");
  if (heroBg) {
    var showHero = function () {
      heroBg.classList.add("in");
      if (!reduce) heroBg.classList.add("pan");
    };
    /* rAF gives the transition a frame to animate from — but it never fires
       in a background or stalled tab, which would leave the hero backdrop
       permanently transparent. The timer is the guarantee; both are idempotent. */
    requestAnimationFrame(showHero);
    setTimeout(showHero, 600);
  }

  /* ------------------------------------------- expand/collapse helper ---- */

  function setOpen(panel, open) {
    if (open) {
      panel.style.maxHeight = panel.scrollHeight + "px";
      // let content (images) settle, then release the clamp
      window.setTimeout(function () {
        if (panel.dataset.open === "1") panel.style.maxHeight = "none";
      }, 760);
      panel.dataset.open = "1";
    } else {
      // from `none` we need a concrete height to animate away from
      if (panel.style.maxHeight === "none") {
        panel.style.maxHeight = panel.scrollHeight + "px";
        void panel.offsetHeight;
      }
      panel.dataset.open = "0";
      requestAnimationFrame(function () { panel.style.maxHeight = "0px"; });
    }
  }

  /* ------------------------------------------------ the report ----------- */

  var report = document.querySelector(".report");

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

        /* A lazy image that was parsed inside a clamped, overflow-hidden
           container never enters the viewport, so the browser never
           schedules the fetch — and expanding the row doesn't re-trigger it.
           Promote to eager the first time this row is opened. */
        if (open) {
          row.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
            img.loading = "eager";
            img.src = img.src; // kick the fetch for browsers that cached the skip
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

    var sumEl = document.getElementById("report-sum");
    var noteEl = document.getElementById("report-note");

    function tally() {
      var total = 0, approved = 0, offered = 0;

      rows.forEach(function (row) {
        var box = row.querySelector(".approve input");
        if (!box) return;                       // "Good" lines aren't billable
        offered++;
        if (box.checked) {
          approved++;
          total += parseInt(row.dataset.price, 10) || 0;
        }
      });

      /* The $29 scan is credited back against any approved work — the shop says so
         in the hero and again at the close, so the figure on screen has to be the
         amount actually owed, not the raw sum of the line items. */
      var SCAN_CREDIT = 29;
      var due = approved > 0 ? Math.max(0, total - SCAN_CREDIT) : 0;

      sumEl.textContent = "$" + due.toLocaleString("en-US");

      if (approved === 0) {
        noteEl.textContent = "Nothing approved · you'd owe the $29 scan and nothing else";
      } else {
        noteEl.textContent =
          approved + " of " + offered + " recommended items approved · $" +
          total.toLocaleString("en-US") + " less the $29 scan credit";
      }
    }

    tally();
  }

  /* --------------------------------------------- symptom selector -------- */

  var SYMPTOMS = {
    brakes: {
      title: "Grinding or squealing when you brake",
      usual: "Worn pads nine times out of ten. If it's a grind rather than a squeal, the pads are likely gone and the rotors are taking the damage — which is why waiting on this one gets expensive fast.",
      range: "$290 – $460",
      rangeNote: "per axle, pads and rotors, parts and labor",
      check: "All four wheels come off. We measure pad thickness at every corner and rotor thickness against the manufacturer's minimum, then check the caliper slide pins — a seized pin wears one pad to nothing while the other three look fine, and a shop that skips this sells you the same brake job twice."
    },
    shake: {
      title: "Shaking in the wheel at highway speed",
      usual: "If it shakes all the time, it's usually wheel balance. If it only shakes when you brake, it's a warped front rotor. Those are wildly different bills, so it's worth knowing which one you've got before anyone quotes you.",
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
      usual: "Sway bar end links are the cheap and common answer, and they're the first thing we look at. Control arm bushings and strut mounts come next. Most people who are quoted struts for this noise don't need struts.",
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

  var symBtns = document.querySelectorAll(".sym");
  var symResult = document.getElementById("sym-result");

  symBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var data = SYMPTOMS[btn.dataset.sym];
      if (!data) return;

      symBtns.forEach(function (b) { b.classList.remove("is-on"); });
      btn.classList.add("is-on");

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
        '<div class="sr__cta"><a class="btn btn--signal" href="#book" data-prefill="' +
          data.title.replace(/"/g, "&quot;") + '">Book the scan for this</a></div>';

      // carry the symptom into the booking form
      var cta = symResult.querySelector("[data-prefill]");
      cta.addEventListener("click", function () {
        var field = document.getElementById("f-symptom");
        if (field && !field.value.trim()) field.value = cta.dataset.prefill;
      });
    });
  });

  /* ------------------------------------------------ price tabs ----------- */

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".ptab"));

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

  function activate(i) {
    tabs.forEach(function (t, j) {
      var on = i === j;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
      if (panel) {
        panel.classList.toggle("is-active", on);
        panel.hidden = !on;
      }
    });
  }

  /* ------------------------------------------------------ faq ------------ */

  document.querySelectorAll(".faq__item").forEach(function (item) {
    var q = item.querySelector(".faq__q");
    var a = item.querySelector(".faq__a");

    q.addEventListener("click", function () {
      var willOpen = !item.classList.contains("is-open");

      document.querySelectorAll(".faq__item.is-open").forEach(function (other) {
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

  /* ----------------------------------------------- booking form ---------- */

  var form = document.getElementById("book-form");
  var done = document.getElementById("book-done");

  if (form) {
    var RULES = {
      "f-name":    { test: function (v) { return v.trim().length >= 2; },
                     msg: "Please give us a first name." },
      "f-phone":   { test: function (v) { return (v.replace(/\D/g, "").length >= 10); },
                     msg: "We need 10 digits so we can text you times." },
      "f-vehicle": { test: function (v) { return v.trim().length >= 4; },
                     msg: "Year, make and model — a rough guess is fine." }
    };

    function validate(id) {
      var input = document.getElementById(id);
      var field = input.closest(".field");
      var err = field.querySelector(".err");
      var ok = RULES[id].test(input.value);

      field.classList.toggle("is-bad", !ok);
      err.textContent = ok ? "" : RULES[id].msg;
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      return ok;
    }

    Object.keys(RULES).forEach(function (id) {
      var input = document.getElementById(id);
      input.addEventListener("blur", function () { validate(id); });
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("is-bad")) validate(id);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var allOk = Object.keys(RULES).map(validate).every(Boolean);
      if (!allOk) {
        var firstBad = form.querySelector(".field.is-bad input");
        if (firstBad) firstBad.focus();
        return;
      }


      var digits = document.getElementById("f-phone").value.replace(/\D/g, "").slice(-10);
      document.getElementById("done-phone").textContent =
        "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);

      form.hidden = true;
      done.hidden = false;
      done.setAttribute("tabindex", "-1");
      done.focus();
    });
  }

  /* ------------------------------------------------------ dock ----------- */
  /* Mobile-only sticky CTA. Appears once the hero CTA has scrolled away and
     hides again over the booking form so it never covers its own target. */

  var dock = document.getElementById("dock");
  var bookSection = document.getElementById("book");

  if (dock && bookSection) {
    dock.hidden = false;

    var update = function () {
      var pastHero = window.scrollY > window.innerHeight * 0.75;
      var atForm = bookSection.getBoundingClientRect().top < window.innerHeight * 0.9;
      dock.classList.toggle("is-up", pastHero && !atForm);
    };

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });

    update();
  }
})();
