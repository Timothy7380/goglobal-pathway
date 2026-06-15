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
  const track      = document.getElementById('carousel-track');
  const controls   = document.getElementById('carousel-controls');
  const prevBtn    = document.getElementById('carousel-prev');
  const nextBtn    = document.getElementById('carousel-next');

  if (track && prevBtn && nextBtn) {
    const cards      = Array.from(track.children);
    const total      = cards.length;
    const GAP        = 24;
    let current      = 0;
    let paused       = false;
    let autoTimer;

    function visibleCount() {
      return window.innerWidth <= 600 ? 1 : 3;
    }

    function setCardWidths() {
      const visible   = visibleCount();
      const vpW       = track.parentElement.offsetWidth;
      const cardW     = (vpW - GAP * (visible - 1)) / visible;
      track.style.setProperty('--card-w', cardW + 'px');
      cards.forEach(c => c.style.width = cardW + 'px');
      return cardW;
    }

    function slideTo(index) {
      const visible  = visibleCount();
      const maxIndex = total - visible;
      current        = Math.max(0, Math.min(index, maxIndex));
      const cardW    = setCardWidths();
      track.style.transform = `translateX(-${current * (cardW + GAP)}px)`;
    }

    function startAuto() {
      clearInterval(autoTimer);
      if (!paused) {
        autoTimer = setInterval(() => {
          const visible  = visibleCount();
          const maxIndex = total - visible;
          slideTo(current >= maxIndex ? 0 : current + 1);
        }, 4000);
      }
    }

    prevBtn.addEventListener('click', () => {
      paused = true;
      controls.classList.add('is-paused');
      slideTo(current - 1);
    });

    nextBtn.addEventListener('click', () => {
      paused = true;
      controls.classList.add('is-paused');
      slideTo(current + 1);
    });

    // Resume auto-play when user leaves the carousel area
    document.getElementById('carousel').addEventListener('mouseleave', () => {
      paused = false;
      controls.classList.remove('is-paused');
      startAuto();
    });

    window.addEventListener('resize', () => slideTo(current));

    setCardWidths();
    startAuto();
  }

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
