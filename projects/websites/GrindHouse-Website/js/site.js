/* GRIND HOUSE ATHLETICS - website interactions
   Shared across all pages: nav, scroll reveals (with hidden-tab failsafe),
   count-up stats, subtle hero/cta parallax, chip groups, contact forms, back-to-top.
   Restraint per the brand: slow, deliberate, nothing busy. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var doc = document;

  /* ---------------- Mobile nav ---------------- */
  var nav = doc.querySelector('.nav');
  var toggle = doc.querySelector('.nav__toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      doc.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav__drawer a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        doc.body.style.overflow = '';
      });
    });
  }

  /* ---------------- Nav scroll state + back-to-top ---------------- */
  var totop = doc.querySelector('.totop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 20);
    if (totop) totop.classList.toggle('is-visible', y > 640);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Scroll reveals ----------------
     Content is fully visible by default; only .js hides-then-reveals.
     If the tab loads hidden (crawler / background / screenshotter) the
     IntersectionObserver never fires, so a load-time failsafe forces
     everything visible rather than shipping blank. */
  var revealEls = doc.querySelectorAll('.reveal');
  function revealAll() { revealEls.forEach(function (el) { el.classList.add('in'); }); }
  if ('IntersectionObserver' in window && !reduced && !doc.hidden) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // The observer cannot fire while the tab is hidden, so any section that
    // has not revealed yet must be forced visible the moment the render is
    // paused or backgrounded. This guarantees nothing ships blank in a
    // headless / screenshot / prerender pass regardless of load-time state.
    doc.addEventListener('visibilitychange', function () { if (doc.hidden) revealAll(); });
    window.addEventListener('load', function () {
      window.setTimeout(function () { if (doc.hidden) revealAll(); }, 300);
    });
  } else {
    revealAll();
  }

  /* ---------------- Count-up stats ---------------- */
  var counters = doc.querySelectorAll('[data-count]');
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = (target % 1 !== 0) ? 1 : 0;
    if (reduced || doc.hidden) { el.textContent = prefix + target.toFixed(decimals) + suffix; return; }
    var start = null, dur = 1500;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window && !doc.hidden) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------------- Subtle parallax (hero + cta backgrounds) ---------------- */
  var parallaxEls = doc.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduced) {
    var ticking = false;
    function parallax() {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var rect = el.parentElement.getBoundingClientRect();
        var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------------- Chip groups (single-select) ---------------- */
  doc.querySelectorAll('[data-chips]').forEach(function (group) {
    var hidden = group.parentElement.querySelector('input[type="hidden"]');
    group.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        if (hidden) hidden.value = chip.textContent.trim();
      });
    });
  });

  /* ---------------- Contact forms ----------------
     Required fields are validated before the success panel is shown. */

  function digitsIn(value) { return value.replace(/\D/g, '').length; }

  doc.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var errorBox = form.querySelector('.form__error');
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]'));

    function validate() {
      var problems = [];
      inputs.forEach(function (input) {
        input.removeAttribute('aria-invalid');
        var label = (input.getAttribute('data-label') || input.getAttribute('placeholder') || input.name || 'this field');
        var value = input.value.trim();
        var bad = input.type === 'tel' ? digitsIn(value) < 10 : value.length < 2;
        if (bad) { problems.push(label); input.setAttribute('aria-invalid', 'true'); }
      });
      return problems;
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var problems = validate();
      if (problems.length && errorBox) {
        var list = problems.length > 1
          ? problems.slice(0, -1).join(', ') + ' and ' + problems[problems.length - 1]
          : problems[0];
        errorBox.textContent = 'We still need ' + list + '.';
        errorBox.hidden = false;
        var first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }
      if (errorBox) errorBox.hidden = true;

      var success = form.parentElement.querySelector('.form-success');
      if (success) {
        form.style.display = 'none';
        success.classList.add('is-visible');
        success.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      } else {
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.textContent = 'Spot requested. Check your texts.'; btn.disabled = true; }
      }
    });

    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        if (errorBox && !errorBox.hidden) errorBox.hidden = true;
        input.removeAttribute('aria-invalid');
      });
    });
  });

  /* ---------------- Footer year ---------------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
