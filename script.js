/* =========================================================
   GO GLOBAL PATHWAY — SCRIPTS
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('site-header');
  const backToTop = document.getElementById('back-to-top');

  const onScroll = () => {
    const scrolled = window.scrollY > 20;
    header.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 480);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav when a link is clicked
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.trust-number');

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(
    '.service-card, .country-card, .why-content, .why-visual, .testimonial-card, .faq-item, .trust-item, .cta-form, .cta-copy'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), index * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Testimonial carousel ---------- */
  const track = document.getElementById('carousel-track');
  const slides = Array.from(track.children);
  const dotsWrap = document.getElementById('carousel-dots');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let current = 0;
  let autoplayTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    track.scrollTo({ left: slides[current].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  }

  prevBtn.addEventListener('click', () => { goToSlide(current - 1); restartAutoplay(); });
  nextBtn.addEventListener('click', () => { goToSlide(current + 1); restartAutoplay(); });

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goToSlide(current + 1), 6000);
  }
  restartAutoplay();

  track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  track.addEventListener('mouseleave', restartAutoplay);

  /* ---------- FAQ accordion ---------- */
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      faqQuestions.forEach((other) => other.setAttribute('aria-expanded', 'false'));
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------- Callback form ---------- */
  const form = document.getElementById('callback-form');
  const successMsg = document.getElementById('form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    successMsg.classList.add('is-visible');
    form.reset();

    setTimeout(() => successMsg.classList.remove('is-visible'), 6000);
  });

});
