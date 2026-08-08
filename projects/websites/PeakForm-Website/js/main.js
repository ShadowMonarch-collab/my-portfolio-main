/* PeakForm Coaching — website interactions
   Shared across all pages: nav, scroll reveals, counters, parallax,
   scroll progress, back-to-top, chips, contact form. */
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

  /* ---------------- Nav scroll state + progress bar + back-to-top ---------------- */
  var bar = doc.querySelector('.scrollbar');
  var totop = doc.querySelector('.totop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 20);
    if (bar) {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (totop) totop.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Scroll reveals ---------------- */
  var revealEls = doc.querySelectorAll('.reveal, .reveal-scale');
  function revealAll() { revealEls.forEach(function (el) { el.classList.add('in'); }); }
  if ('IntersectionObserver' in window && !reduced && !doc.hidden) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // Safety net: if the tab loads hidden (crawler, background, screenshotter)
    // and never gets foregrounded, content must still appear rather than ship blank.
    window.addEventListener('load', function () {
      window.setTimeout(function () { if (doc.hidden) revealAll(); }, 400);
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
    var start = null, dur = 1600;
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
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(animateCount);
    }
  }

  /* ---------------- Parallax (subtle) ---------------- */
  var parallaxEls = doc.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduced) {
    var ticking = false;
    function parallax() {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        var rect = el.parentElement.getBoundingClientRect();
        var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.05)';
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
    group.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        var hidden = group.parentElement.querySelector('input[type="hidden"]');
        if (hidden) hidden.value = chip.textContent.trim();
      });
    });
  });

  /* ---------------- Contact / consult form ----------------
     Required fields are validated before the success panel is shown. */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  doc.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var errorBox = form.querySelector('.form__error');
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]'));

    function validate() {
      var problems = [];
      inputs.forEach(function (input) {
        input.removeAttribute('aria-invalid');
        var label = (input.getAttribute('data-label') || input.getAttribute('placeholder') || input.name || 'this field');
        var value = input.value.trim();
        var bad = input.type === 'email' ? !EMAIL_RE.test(value) : value.length < 2;
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
