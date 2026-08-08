/* PeakForm Coaching — plan matcher + scroll reveals */
(function () {
  'use strict';

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Plan matcher ---------------- */

  var QUESTIONS = [
    {
      q: 'How much time can you realistically give a workout?',
      options: ['20 to 30 minutes', 'About 45 minutes', 'It changes every week']
    },
    {
      q: 'Where will you train most weeks?',
      options: ['A gym', 'At home', 'A mix of both']
    },
    {
      q: 'What matters most right now?',
      options: ['Losing the weight', 'Getting strong again', 'Finally staying consistent']
    }
  ];

  var TIME_PHRASE = ['short 20 to 30 minute sessions', '45-minute sessions', 'sessions that flex with your week'];
  var PLACE_PHRASE = ['at the gym', 'at home with the gear you have', 'split between home and the gym'];

  /* The three coaching tracks a new client can be matched into. */
  var TRACKS = [
    {
      name: 'The Lean-Down Plan',
      tag: 'Fat loss first, strength kept',
      body: function (t, p) {
        return 'Built on ' + TIME_PHRASE[t] + ' ' + PLACE_PHRASE[p] + ', with nutrition guidance that has no banned-foods list. Strength work stays in so the weight that leaves is the weight you wanted gone.';
      }
    },
    {
      name: 'The Strength Rebuild Plan',
      tag: 'Get strong again, without wrecking your week',
      body: function (t, p) {
        return 'Progressive strength work in ' + TIME_PHRASE[t] + ' ' + PLACE_PHRASE[p] + '. You rebuild the lifts and the energy first, and the mirror follows.';
      }
    },
    {
      name: 'The Consistency-First Plan',
      tag: 'The habit before the heroics',
      body: function (t, p) {
        return 'We start with ' + TIME_PHRASE[t] + ' ' + PLACE_PHRASE[p] + ' and weekly check-ins that catch a bad week before it becomes a bad month. Consistency is the result, so it is also the plan.';
      }
    }
  ];

  function createQuiz(root, compact) {
    var answers = [null, null, null];
    var step = 0;

    function renderStep() {
      var q = QUESTIONS[step];
      var html = '<p class="quiz__progress">Question ' + (step + 1) + ' of 3</p>' +
        '<p class="quiz__question">' + q.q + '</p>' +
        '<div class="quiz__options" role="group" aria-label="' + q.q + '">';
      q.options.forEach(function (opt, i) {
        var pressed = answers[step] === i ? ' aria-pressed="true"' : ' aria-pressed="false"';
        html += '<button type="button" class="chip" data-opt="' + i + '"' + pressed + '>' + opt + '</button>';
      });
      html += '</div>';
      root.innerHTML = html;

      root.querySelectorAll('.chip').forEach(function (btn) {
        btn.addEventListener('click', function () {
          answers[step] = parseInt(btn.getAttribute('data-opt'), 10);
          if (step < 2) {
            step += 1;
            renderStep();
          } else {
            renderLoading();
          }
        });
      });
    }

    function renderLoading() {
      root.innerHTML =
        '<div class="quiz__loading" role="status">' +
        '<span class="quiz__dots" aria-hidden="true"><span></span><span></span><span></span></span>' +
        '<span>Building your starting plan&hellip;</span></div>';
      window.setTimeout(renderResult, reducedMotion ? 150 : 700);
    }

    function renderResult() {
      var track = TRACKS[answers[2]];
      root.innerHTML =
        '<div class="quiz__result" aria-live="polite">' +
        '<p class="quiz__progress">Your starting point</p>' +
        '<h3>' + track.name + '</h3>' +
        '<p class="quiz__result-tag">' + track.tag + '</p>' +
        '<p>' + track.body(answers[0], answers[1]) + '</p>' +
        '<p>Weekly check-ins, private messaging support, and a habit tracker come standard, so the plan holds up when your calendar does not.</p>' +
        '<a class="btn btn--volt" href="#apply">Apply for Coaching</a>' +
        '<p class="micro">Free consultation for qualified applicants. No commitment to book anything yet.</p>' +
        '<button type="button" class="quiz__restart">Change my answers</button>' +
        '</div>';

      root.querySelector('.quiz__restart').addEventListener('click', function () {
        answers = [null, null, null];
        step = 0;
        renderStep();
      });
    }

    renderStep();

    return {
      setAnswer: function (qIndex, optIndex) {
        answers[qIndex] = optIndex;
        step = Math.min(qIndex + 1, 2);
        renderStep();
      }
    };
  }

  var mainQuizEl = document.getElementById('quiz-main');
  var closeQuizEl = document.getElementById('quiz-close');
  var mainQuiz = mainQuizEl ? createQuiz(mainQuizEl, false) : null;
  if (closeQuizEl) { createQuiz(closeQuizEl, true); }

  /* Hero widget: answer Q1 inline, then hand off to the main quiz */
  document.querySelectorAll('[data-hero-answer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-hero-answer]').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      if (mainQuiz) {
        mainQuiz.setAnswer(0, parseInt(btn.getAttribute('data-hero-answer'), 10));
      }
      var target = document.getElementById('plan-quiz');
      if (target) {
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  /* ---------------- Scroll reveals (IntersectionObserver) ---------------- */

  var revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealed.forEach(function (el, i) {
      el.style.setProperty('--d', (i % 3) * 90 + 'ms');
      io.observe(el);
    });
  } else {
    revealed.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- Apply form ---------------- */

  var applyForm = document.getElementById('apply-form');
  if (applyForm) {
    var applyErrorBox = applyForm.querySelector('.form__error');
    var applySuccess = document.getElementById('apply-success');
    var applyName = document.getElementById('apply-name');
    var applyEmail = document.getElementById('apply-email');
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function validateApply() {
      var problems = [];
      applyName.removeAttribute('aria-invalid');
      applyEmail.removeAttribute('aria-invalid');

      if (applyName.value.trim().length < 2) {
        problems.push('your name');
        applyName.setAttribute('aria-invalid', 'true');
      }
      if (!EMAIL_RE.test(applyEmail.value.trim())) {
        problems.push('a valid email');
        applyEmail.setAttribute('aria-invalid', 'true');
      }
      return problems;
    }

    applyForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var problems = validateApply();
      if (problems.length) {
        var list = problems.length > 1
          ? problems.slice(0, -1).join(', ') + ' and ' + problems[problems.length - 1]
          : problems[0];
        if (applyErrorBox) {
          applyErrorBox.textContent = 'We still need ' + list + '.';
          applyErrorBox.hidden = false;
        }
        var firstInvalid = applyForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      if (applyErrorBox) applyErrorBox.hidden = true;


      applyForm.hidden = true;
      if (applySuccess) {
        applySuccess.hidden = false;
        applySuccess.setAttribute('tabindex', '-1');
        applySuccess.focus();
      }
    });

    [applyName, applyEmail].forEach(function (input) {
      input.addEventListener('input', function () {
        if (applyErrorBox && !applyErrorBox.hidden) applyErrorBox.hidden = true;
        input.removeAttribute('aria-invalid');
      });
    });
  }

  /* ---------------- Footer year ---------------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
