/* Arctic Home website interactions
   Shared across every page: nav, scroll reveals (with headless failsafe),
   count-up stats, parallax, scroll progress, back-to-top, FAQ, forms. */
(function () {
  'use strict';

  var doc = document;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Mobile nav ---------------- */
  var nav = doc.querySelector('.nav');
  var toggle = doc.querySelector('.nav__toggle');
  if (nav && toggle) {
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

  /* ---------------- Nav scroll state + progress + back-to-top ---------------- */
  var bar = doc.querySelector('.scrollbar');
  var totop = doc.querySelector('.totop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 12);
    if (bar) {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }
    if (totop) totop.classList.toggle('is-visible', y > 620);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Scroll reveals (fail safe: never ship blank) ----------------
     In hidden / paused / headless renders (crawlers, screenshotters, background
     tabs) IntersectionObserver never fires AND CSS transitions never advance, so
     merely adding the reveal class would leave content stuck at opacity 0. The
     force class snaps everything visible with transition:none. */
  var revealEls = doc.querySelectorAll('.reveal');
  function forceReveal() { doc.documentElement.classList.add('reveal-force'); }
  if (!('IntersectionObserver' in window) || reduced) {
    forceReveal();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    var safety = function () { if (doc.hidden) forceReveal(); };
    safety();                                    // hidden at parse time
    doc.addEventListener('visibilitychange', safety);
    window.addEventListener('load', function () { window.setTimeout(safety, 300); });
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

  /* ---------------- Subtle parallax ---------------- */
  var parallaxEls = doc.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduced) {
    var ticking = false;
    function parallax() {
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var rect = el.parentElement.getBoundingClientRect();
        var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.08)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------------- FAQ accordion ---------------- */
  doc.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq__item');
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------------- Contact forms ----------------
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

  /* ---------------- Newsletter ---------------- */
  doc.querySelectorAll('[data-news]').forEach(function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var input = form.querySelector('input');
      var btn = form.querySelector('button');
      if (input && EMAIL_RE.test(input.value.trim()) && btn) {
        btn.textContent = 'Subscribed'; input.value = ''; input.placeholder = 'Thanks for joining';
      } else if (input) {
        input.setAttribute('aria-invalid', 'true');
        input.reportValidity();
      }
    });
  });

  /* ---------------- Footer year ---------------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
