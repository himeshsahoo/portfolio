/* =====================================================
   HIMESH SAHOO PORTFOLIO — GSAP + ScrollTrigger Script
   Apple-style scroll-scrubbed animations
   ===================================================== */

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------
   UTILITY: Detect mobile/touch for simpler fallback
   ------------------------------------------------ */
const isTouch = () =>
  window.matchMedia('(max-width: 900px)').matches ||
  ('ontouchstart' in window);

/* ------------------------------------------------
   NAV — scroll-aware border + mobile burger
   ------------------------------------------------ */
(function initNav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  burger?.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
  });

  mobileMenu?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
    })
  );
})();

/* ------------------------------------------------
   SCROLL PROGRESS BAR
   ------------------------------------------------ */
(function initProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;
  ScrollTrigger.create({
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      bar.style.width = (self.progress * 100) + '%';
    }
  });
})();

/* =====================================================
   SECTION 1: HERO — Pinned + scroll-scrubbed scale/fade
   ===================================================== */
(function initHero() {
  const pinWrapper = document.getElementById('heroPinWrapper');
  const content    = document.getElementById('heroContent');
  const eyebrow    = document.getElementById('heroEyebrow');
  const line1      = document.getElementById('heroLine1');
  const line2      = document.getElementById('heroLine2');
  const line3      = document.getElementById('heroLine3');
  const sub        = document.getElementById('heroSub');
  const actions    = document.getElementById('heroActions');
  const scrollHint = document.getElementById('heroScrollHint');
  if (!pinWrapper) return;

  if (isTouch()) {
    // Simple fade-in on mobile — no pinning
    gsap.from([eyebrow, line1, line2, line3, sub, actions], {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 1,
      ease: 'power3.out',
    });
    return;
  }

  // Initial entrance animation
  const entryTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  entryTl
    .from(eyebrow,  { opacity: 0, y: 30, duration: 0.9 }, 0.2)
    .from(line1,    { opacity: 0, y: 60, duration: 1.0 }, 0.4)
    .from(line2,    { opacity: 0, y: 60, duration: 1.0 }, 0.55)
    .from(line3,    { opacity: 0, y: 60, duration: 1.0 }, 0.7)
    .from(sub,      { opacity: 0, y: 30, duration: 0.9 }, 0.9)
    .from(actions,  { opacity: 0, y: 20, duration: 0.8 }, 1.0)
    .from(scrollHint, { opacity: 0, duration: 0.8 }, 1.3);

  // Scroll-scrubbed exit: pin hero, then scale+fade content out
  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: '+=120vh',
      pin: pinWrapper,
      anticipatePin: 1,
      scrub: 1,
    }
  })
  .to(content, {
    scale: 0.88,
    opacity: 0,
    y: -40,
    ease: 'none',
  }, 0)
  .to(scrollHint, { opacity: 0, ease: 'none' }, 0);

})();

/* =====================================================
   SECTION 2: PROJECTS — pinned panels with scrubbed
   image scale-in and text slide-in
   ===================================================== */
(function initProjects() {
  if (isTouch()) {
    // Mobile: simple fade-in on scroll enter
    document.querySelectorAll('.project-panel').forEach((panel) => {
      const media = panel.querySelector('.proj-media');
      const text  = panel.querySelector('.proj-text');
      gsap.from([media, text], {
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: panel,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });
    });
    return;
  }

  const panels = [
    { id: 'proj-1', mediaId: 'projMedia1', textId: 'projText1' },
    { id: 'proj-2', mediaId: 'projMedia2', textId: 'projText2' },
    { id: 'proj-3', mediaId: 'projMedia3', textId: 'projText3' },
    { id: 'proj-4', mediaId: 'projMedia4', textId: 'projText4' },
  ];

  panels.forEach(({ id, mediaId, textId }) => {
    const panel = document.getElementById(id);
    const media = document.getElementById(mediaId);
    const text  = document.getElementById(textId);
    if (!panel || !media || !text) return;

    const isReverse = panel.querySelector('.proj-panel-reverse');

    // Set initial state
    gsap.set(media, { scale: 0.85, opacity: 0 });
    gsap.set(text,  { opacity: 0, x: isReverse ? 60 : -60 });

    // Scrubbed reveal tied to scroll progress through panel
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: 'top 75%',
        end: 'center center',
        scrub: 1.5,
      }
    });

    tl.to(media, { scale: 1, opacity: 1, ease: 'power2.out' }, 0)
      .to(text,  { opacity: 1, x: 0, ease: 'power3.out' }, 0.1);

    // Subtle parallax on the mockup as user continues scrolling
    const mockup = panel.querySelector('.proj-mockup');
    if (mockup) {
      gsap.to(mockup, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        }
      });
    }
  });

  // Projects intro heading scrub
  const intro = document.querySelector('.projects-intro');
  if (intro) {
    gsap.from(intro, {
      opacity: 0,
      y: 60,
      duration: 1,
      scrollTrigger: {
        trigger: intro,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }
})();

/* =====================================================
   SECTION 3: ABOUT — parallax text + card stagger
   ===================================================== */
(function initAbout() {
  const pinWrapper = document.getElementById('aboutPinWrapper');
  const left   = document.getElementById('aboutLeft');
  const right  = document.getElementById('aboutRight');
  const tag    = document.getElementById('aboutTag');
  const heading= document.getElementById('aboutHeading');
  const bio    = document.getElementById('aboutBio');
  const stats  = document.getElementById('aboutStats');
  const card1  = document.getElementById('aboutCard1');
  const card2  = document.getElementById('aboutCard2');
  const card3  = document.getElementById('aboutCard3');

  if (!pinWrapper) return;

  if (isTouch()) {
    gsap.from([left, right], {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });
    return;
  }

  // Pin the wrapper, then scrub through it
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top top',
      end: '+=150vh',
      pin: pinWrapper,
      anticipatePin: 1,
      scrub: 1.2,
    }
  });

  // Left column: text slides up progressively
  tl
    .from(tag,     { opacity: 0, y: 20, ease: 'none' }, 0)
    .from(heading, { opacity: 0, y: 40, ease: 'none' }, 0.05)
    .from(bio,     { opacity: 0, y: 30, ease: 'none' }, 0.15)
    .from(stats,   { opacity: 0, y: 20, ease: 'none' }, 0.25);

  // Right column: cards stagger in
  tl
    .from(card1, { opacity: 0, x: 60, ease: 'none' }, 0.1)
    .from(card2, { opacity: 0, x: 60, ease: 'none' }, 0.2)
    .from(card3, { opacity: 0, x: 60, ease: 'none' }, 0.3);

  // Parallax: right column moves slightly slower
  gsap.to(right, {
    y: -60,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
    }
  });

})();

/* =====================================================
   SECTION 4: SKILLS — staggered pill reveal + fill bars
   ===================================================== */
(function initSkills() {
  const pills = gsap.utils.toArray('.skill-pill');
  const logos = gsap.utils.toArray('.slogo');

  if (isTouch()) {
    // Mobile: simple enter-once fade
    gsap.from(pills, {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 75%',
        toggleActions: 'play none none none',
        onEnter: () => animateFills(),
      }
    });
  } else {
    // Desktop: scrubbed stagger
    gsap.to(pills, {
      opacity: 1,
      y: 0,
      stagger: {
        each: 0.12,
        ease: 'power1.in',
      },
      ease: 'none',
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 70%',
        end: 'center center',
        scrub: 1,
        onEnter: () => animateFills(),
      }
    });
  }

  function animateFills() {
    document.querySelectorAll('.skill-fill').forEach(fill => {
      const target = fill.style.getPropertyValue('--w');
      fill.style.width = target;
    });
  }

  // Skills header
  const header = document.querySelector('.skills-header');
  if (header) {
    gsap.from(header, {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  // Logos row — scrubbed stagger
  if (logos.length) {
    gsap.from(logos, {
      opacity: 0,
      y: 20,
      scale: 0.9,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: {
        trigger: '.skills-logos-row',
        start: 'top 85%',
        end: 'bottom 60%',
        scrub: isTouch() ? false : 1,
        toggleActions: isTouch() ? 'play none none none' : undefined,
      }
    });
  }
})();

/* =====================================================
   SECTION 5: PUBLICATIONS — scrubbed card reveals
   ===================================================== */
(function initPublications() {
  const cards = ['#pubCard1', '#achCard1', '#certRow'];

  cards.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;

    if (isTouch()) {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });
    } else {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 1.2,
          }
        }
      );
    }
  });

  const pubHeader = document.querySelector('.pub-header');
  if (pubHeader) {
    gsap.from(pubHeader, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: pubHeader,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }
})();

/* =====================================================
   SECTION 6: CONTACT — scrubbed fade/slide from bottom
   ===================================================== */
(function initContact() {
  const inner   = document.getElementById('contactInner');
  const tag     = document.getElementById('contactTag');
  const heading = document.getElementById('contactHeading');
  const sub     = document.getElementById('contactSub');
  const links   = document.getElementById('contactLinks');

  if (!inner) return;

  if (isTouch()) {
    gsap.from([tag, heading, sub, links], {
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: inner,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
    return;
  }

  gsap.from(tag, {
    opacity: 0,
    y: 30,
    ease: 'none',
    scrollTrigger: {
      trigger: inner,
      start: 'top 80%',
      end: 'top 50%',
      scrub: 1,
    }
  });

  gsap.from(heading, {
    opacity: 0,
    y: 60,
    ease: 'none',
    scrollTrigger: {
      trigger: inner,
      start: 'top 78%',
      end: 'top 40%',
      scrub: 1.2,
    }
  });

  gsap.from(sub, {
    opacity: 0,
    y: 40,
    ease: 'none',
    scrollTrigger: {
      trigger: inner,
      start: 'top 70%',
      end: 'top 35%',
      scrub: 1.2,
    }
  });

  gsap.from(links?.children ? [...links.children] : [], {
    opacity: 0,
    x: -40,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: {
      trigger: inner,
      start: 'top 65%',
      end: 'top 25%',
      scrub: 1.4,
    }
  });
})();

/* =====================================================
   LIGHTBOX
   ===================================================== */
(function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const img       = document.getElementById('lightboxImg');
  const closeBtn  = document.getElementById('lightboxClose');

  document.querySelectorAll('.lightbox-trigger').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.getAttribute('data-img');
      if (!src) return;
      img.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', close);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* =====================================================
   SMOOTH SCROLL for anchor links
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 64; // nav height
    const y = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});
