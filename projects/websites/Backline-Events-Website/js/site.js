/* BACKLINE EVENTS CO. — website interactions
   Shared across all pages: nav + drawer, scroll reveals (heavily failsafed),
   count-up stats, chip groups, validated contact forms, back-to-top.
   Motion register per the direction: fast cuts, crisp state changes, no
   cinematic drift and no parallax. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Reveals ----------------
     Four separate ways this can go wrong, all seen in this portfolio:
       1. No IntersectionObserver support.
       2. Document renders hidden (background tab, prerender, screenshotter):
          the observer never fires at all.
       3. Page is backgrounded mid-scroll: transitions stall.
       4. The animation clock is stalled, which pins a transition at time 0 so
          adding .in cannot rescue it. Killing the transition first is the only
          thing that actually lands the final state.
     Every path ends at ungate(). */

  var reveals = [].slice.call(doc.querySelectorAll('.reveal'));

  function disarm() {
    if (window.__blFailsafe) { clearTimeout(window.__blFailsafe); window.__blFailsafe = null; }
  }

  function ungate() {
    disarm();
    root.classList.remove('js');
    reveals.forEach(function (el) {
      el.style.transition = 'none';           // must come first, see (4) above
      if (el.getAnimations) {
        el.getAnimations().forEach(function (a) { a.cancel(); });
      }
      el.classList.add('in');
    });
    // Hand styling back to the stylesheet once the state has landed.
    requestAnimationFrame(function () {
      reveals.forEach(function (el) { el.style.transition = ''; });
    });
  }

  if (!root.classList.contains('js') || reduced || !('IntersectionObserver' in window) || doc.hidden) {
    ungate();
  } else {
    var io = new IntersectionObserver(function (entries) {
      disarm();   // the observer demonstrably fires here, so the timer is moot
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    reveals.forEach(function (el) { io.observe(el); });

    doc.addEventListener('visibilitychange', function () { if (doc.hidden) ungate(); }, { once: true });
    window.addEventListener('load', function () {
      window.setTimeout(function () { if (doc.hidden) ungate(); }, 300);
    });
  }

  /* ---------------- Mobile nav ---------------- */
  var nav = doc.querySelector('.nav');
  var toggle = doc.querySelector('.nav__toggle');
  if (nav && toggle) {
    var closeNav = function () {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      doc.body.style.overflow = '';
    };
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      doc.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('.nav__drawer a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { closeNav(); toggle.focus(); }
    });
  }

  /* ---------------- Nav scroll state + back to top ---------------- */
  var totop = doc.querySelector('.totop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle('is-scrolled', y > 20);
    if (totop) totop.classList.toggle('is-visible', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (totop) {
    totop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Count-up stats ---------------- */
  var counters = doc.querySelectorAll('[data-count]');
  function settle(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = (target % 1 !== 0) ? 1 : 0;
    el.textContent = (el.getAttribute('data-prefix') || '') + target.toFixed(dec) + (el.getAttribute('data-suffix') || '');
  }
  function countUp(el) {
    if (reduced || doc.hidden) { settle(el); return; }
    var target = parseFloat(el.getAttribute('data-count'));
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var dec = (target % 1 !== 0) ? 1 : 0;
    var start = null, dur = 1400;
    // A stalled clock would leave this mid-count, so guarantee the final value.
    var guard = window.setTimeout(function () { settle(el); }, dur + 600);
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = pre + (target * (1 - Math.pow(1 - p, 3))).toFixed(dec) + suf;
      if (p < 1) { requestAnimationFrame(tick); }
      else { clearTimeout(guard); settle(el); }
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    if ('IntersectionObserver' in window && !doc.hidden && !reduced) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(settle);
    }
  }

  /* ---------------- Chip groups (single select) ---------------- */
  doc.querySelectorAll('[data-chips]').forEach(function (group) {
    var store = doc.getElementById(group.getAttribute('data-chips'));
    group.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        group.querySelectorAll('.chip').forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        if (store) store.value = chip.textContent.trim();
      });
    });
  });

  /* ---------------- Contact forms ---------------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  doc.querySelectorAll('[data-contact-form]').forEach(function (form) {
    var fields = [].slice.call(form.querySelectorAll('[data-required]'));

    function validate(el) {
      var v = (el.value || '').trim();
      var msg = '';
      if (!v) msg = el.getAttribute('data-msg') || 'This one is needed.';
      else if (el.type === 'email' && !EMAIL.test(v)) msg = 'That email address looks incomplete.';
      var err = form.querySelector('[data-err-for="' + el.id + '"]');
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) { err.textContent = msg; err.hidden = !msg; }
      return !msg;
    }

    fields.forEach(function (el) {
      el.addEventListener('blur', function () { validate(el); });
      el.addEventListener('input', function () {
        if (el.getAttribute('aria-invalid') === 'true') validate(el);
      });
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var firstBad = null;
      fields.forEach(function (el) { if (!validate(el) && !firstBad) firstBad = el; });
      if (firstBad) { firstBad.focus(); return; }

      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      window.setTimeout(function () {
        var success = form.parentElement.querySelector('.form-success');
        if (success) {
          form.style.display = 'none';
          success.classList.add('is-visible');
          success.setAttribute('tabindex', '-1');
          success.focus();
        } else if (btn) {
          btn.textContent = 'Request sent.';
        }
      }, 500);
    });
  });

  /* ---------------- Footer year ---------------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
