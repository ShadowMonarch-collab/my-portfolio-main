/* TOLLIVER ROOFING & EXTERIORS - shared website behaviour
   Loaded on every page: nav drawer, scroll state, back-to-top, scroll
   reveals with a hidden-render failsafe, count-up stats, restrained
   hero parallax, chip groups, contact forms, footer year.

   Every effect is motivated: nothing loops, nothing hijacks the scroll,
   and all of it collapses under prefers-reduced-motion. */

(function () {
  'use strict';

  var doc = document;
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = mqReduce.matches;

  /* ---------------- mobile nav ---------------- */

  var nav = doc.querySelector('.nav');
  var toggle = doc.querySelector('.nav__toggle');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    doc.body.style.overflow = '';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      doc.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav__drawer a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });
  }

  /* ---------------- scroll state + back to top ---------------- */

  var totop = doc.querySelector('.totop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 16);
    if (totop) totop.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- scroll reveals ----------------
     The CSS only hides .reveal while .js is on the root. An
     IntersectionObserver cannot fire while a tab is hidden, so a render
     that starts backgrounded (crawler, prerender, screenshotter) would
     ship blank without these failsafes. Four of them: reduced motion,
     no IO support, a render that is already hidden, and any later
     switch to hidden. */

  var revealEls = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));

  function revealAll() {
    for (var i = 0; i < revealEls.length; i++) revealEls[i].classList.add('in');
  }

  if (reduced || !('IntersectionObserver' in window) || doc.hidden) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealEls.forEach(function (el) { io.observe(el); });

    // anything already in view before the observer settles
    requestAnimationFrame(function () {
      revealEls.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add('in');
      });
    });

    doc.addEventListener('visibilitychange', function () { if (doc.hidden) revealAll(); });
    window.addEventListener('load', function () {
      window.setTimeout(function () { if (doc.hidden) revealAll(); }, 200);
    });
  }

  mqReduce.addEventListener('change', function (e) { if (e.matches) revealAll(); });

  /* ---------------- count-up stats ----------------
     Hierarchy: the numbers are the credibility claim, so they earn the
     attention. Static immediately if motion is reduced or unobserved. */

  var counters = Array.prototype.slice.call(doc.querySelectorAll('[data-count]'));

  function settle(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (target % 1 !== 0) ? 1 : 0;
    el.textContent = (el.getAttribute('data-prefix') || '') +
      target.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
      (el.getAttribute('data-suffix') || '');
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (target % 1 !== 0) ? 1 : 0;
    if (reduced || doc.hidden) { settle(el); return; }

    var start = null, dur = 1400;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix +
        (target * eased).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
        suffix;
      if (p < 1) requestAnimationFrame(tick); else settle(el);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if ('IntersectionObserver' in window && !doc.hidden && !reduced) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
      doc.addEventListener('visibilitychange', function () { if (doc.hidden) counters.forEach(settle); });
    } else {
      counters.forEach(settle);
    }
  }

  /* ---------------- restrained parallax on hero / cta photos ----------------
     Storytelling only: the photo drifts slightly slower than the page so
     the dark bands feel like depth rather than flat panels. rAF-batched,
     transform only, off entirely under reduced motion. */

  var parallaxEls = Array.prototype.slice.call(doc.querySelectorAll('[data-parallax]'));
  if (parallaxEls.length && !reduced) {
    var ticking = false;
    function parallax() {
      parallaxEls.forEach(function (el) {
        var host = el.parentElement;
        if (!host) return;
        var rect = host.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
        el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* ---------------- FAQ accordion ---------------- */

  var faqItems = Array.prototype.slice.call(doc.querySelectorAll('.faq__item'));

  function closeFaq(item) {
    item.classList.remove('open');
    item.querySelector('.faq__a').style.maxHeight = '';
    item.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
  }

  faqItems.forEach(function (item) {
    var q = item.querySelector('.faq__q');
    var a = item.querySelector('.faq__a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (other) { if (other.classList.contains('open')) closeFaq(other); });
      if (wasOpen) return;
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
      q.setAttribute('aria-expanded', 'true');
    });
  });

  var reflow;
  window.addEventListener('resize', function () {
    clearTimeout(reflow);
    reflow = setTimeout(function () {
      var open = doc.querySelector('.faq__item.open .faq__a');
      if (open) open.style.maxHeight = open.scrollHeight + 'px';
    }, 120);
  });

  /* ---------------- chip groups (single select) ---------------- */

  doc.querySelectorAll('[data-chips]').forEach(function (group) {
    var hidden = group.parentElement.querySelector('input[type="hidden"]');
    var chips = Array.prototype.slice.call(group.querySelectorAll('.chip'));
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        if (hidden) hidden.value = chip.textContent.trim();
      });
    });
  });

  /* ---------------- contact forms ----------------
     Required fields are validated before the success panel is shown.

     Note the markup keeps method="post" on every form. Left to default
     these would be GET, and a JS failure would push names, phone numbers
     and home addresses into the URL and the server logs. */

  function digitsIn(value) { return value.replace(/\D/g, '').length; }

  doc.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var errorBox = form.querySelector('.form__error');
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input[required], textarea[required]'));

    function validate() {
      var problems = [];
      inputs.forEach(function (input) {
        input.removeAttribute('aria-invalid');
        var label = (input.getAttribute('data-label') || input.name || 'this field');
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
      if (!success) return;

      /* Personalise through textContent, never innerHTML: the name is
         visitor input and must never reach the HTML parser. */
      var nameField = form.querySelector('[data-greet]');
      var slot = success.querySelector('[data-greet-slot]');
      if (nameField && slot) {
        var given = nameField.value.trim();
        slot.textContent = given ? 'Thanks, ' + given + '. You are on the schedule.' : 'You are on the schedule.';
      }

      form.style.display = 'none';
      success.classList.add('is-visible');
      success.setAttribute('role', 'status');
      success.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });

    inputs.forEach(function (input) {
      input.addEventListener('input', function () {
        if (errorBox && !errorBox.hidden) errorBox.hidden = true;
        input.removeAttribute('aria-invalid');
      });
    });
  });

  /* ---------------- footer year ---------------- */

  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
