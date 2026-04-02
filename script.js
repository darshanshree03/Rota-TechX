/* =============================================
   Rota-TechX — Upgraded Script (v2.0)
   ============================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ── Navigation ── */
  const nav = document.querySelector("nav");
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const sections = document.querySelectorAll("section");
  const navLinkElements = document.querySelectorAll(".nav-links a");
  let lastScroll = 0;

  function handleNavScroll() {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) { nav.style.transform = "translate(-50%, 0)"; return; }
    nav.style.transform = currentScroll > lastScroll ? "translate(-50%, -100%)" : "translate(-50%, 0)";
    lastScroll = currentScroll;
    nav.classList.toggle("scrolled", currentScroll > 50);
  }

  function toggleMobileMenu() {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  }

  function closeMobileMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  }

  function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({ top: targetElement.offsetTop - 80, behavior: "smooth" });
      closeMobileMenu();
    }
  }

  /* ── Navigation active state — Simple Scroll Tracker ── */
  const scrollSections = document.querySelectorAll("section[id]");
  
  function updateNavOnScroll() {
    let currentId = "hero";
    const scrollY = window.pageYOffset;
    
    scrollSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120; // Padding offset buffer
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    navLinkElements.forEach(link => {
      link.classList.remove("active");
      const href = link.getAttribute("href").replace("#", "");
      if (href === currentId) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", () => {
    requestAnimationFrame(updateNavOnScroll);
  }, { passive: true });
  
  updateNavOnScroll();


  hamburger.addEventListener("click", toggleMobileMenu);
  navLinkElements.forEach((link) => link.addEventListener("click", smoothScroll));

  // Close menu on outside click
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains("active")) closeMobileMenu();
  });

  /* ── About Section: particles + slide-in + card stagger ── */
  (function initAboutEnhancements() {

    /* --- Particle Canvas --- */
    const aCanvas = document.getElementById("about-canvas");
    if (aCanvas) {
      const actx = aCanvas.getContext("2d");
      const COLORS = ["rgba(60,223,255,", "rgba(100,180,255,", "rgba(123,47,247,"];
      let aParticles = [];

      function resizeAboutCanvas() {
        aCanvas.width  = aCanvas.offsetWidth;
        aCanvas.height = aCanvas.offsetHeight;
      }
      resizeAboutCanvas();
      window.addEventListener("resize", resizeAboutCanvas, { passive: true });

      for (let i = 0; i < 14; i++) {   // reduced from 22 for perf
        const colorBase = COLORS[Math.floor(Math.random() * COLORS.length)];
        aParticles.push({
          x: Math.random() * aCanvas.width,
          y: Math.random() * aCanvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.25 + 0.07,
          color: colorBase
        });
      }

      function drawAboutParticles() {
        actx.clearRect(0, 0, aCanvas.width, aCanvas.height);
        aParticles.forEach(p => {
          actx.beginPath();
          actx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          actx.fillStyle = p.color + p.alpha + ")";
          actx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > aCanvas.width)  p.vx *= -1;
          if (p.y < 0 || p.y > aCanvas.height)  p.vy *= -1;
        });
        requestAnimationFrame(drawAboutParticles);
      }
      drawAboutParticles();
    }

    /* --- Scroll-triggered animations --- */
    const leftCol  = document.querySelector(".about-animate-left");
    const cards    = document.querySelectorAll(".about-card-stagger");
    const DELAYS   = [0, 120, 240]; // ms stagger between cards

    const animObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Left column: slide from left
        if (leftCol) leftCol.classList.add("in-view");

        // Cards: stagger
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.setProperty("--float-delay", (i * 0.4) + "s");
            card.classList.add("in-view");
          }, DELAYS[i] || 0);
        });

        animObserver.disconnect(); // fire only once
      });
    }, { threshold: 0.15 });

    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      animObserver.observe(aboutSection);
      aboutSection.classList.add("in-view"); // trigger section fade-up immediately

      // ── Safety fallback: if observer doesn't fire within 1.5s, reveal everything ──
      const fallbackTimer = setTimeout(() => {
        if (leftCol) leftCol.classList.add("in-view");
        cards.forEach((card, i) => {
          card.style.setProperty("--float-delay", (i * 0.4) + "s");
          card.classList.add("in-view");
        });
      }, 1500);

      // Cancel fallback if observer fires normally
      const origDisconnect = animObserver.disconnect.bind(animObserver);
      animObserver.disconnect = () => {
        clearTimeout(fallbackTimer);
        origDisconnect();
      };
    }

    /* --- Count-up animation for stat numbers --- */
    function countUp(el, target, suffix, duration) {
      const start = performance.now();
      const isRupee = suffix.startsWith("₹");
      const num = parseInt(target);
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * num);
        el.textContent = isRupee ? "₹" + current + "+" : current + (suffix.includes("+") ? "+" : "");
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // Wire count-up to each card's in-view trigger
    cards.forEach((card, i) => {
      const numEl = card.querySelector(".stat-v2-num, .stat-number");
      if (!numEl) return;
      const raw = numEl.textContent.trim();
      const isRupee = raw.startsWith("₹");
      const numStr = raw.replace(/[₹+]/g, "");
      const num = parseInt(numStr);
      if (isNaN(num)) return;

      const origSet = card.classList.add.bind(card.classList);
      // Observe via MutationObserver so count-up fires when class is set
      const mo = new MutationObserver(() => {
        if (card.classList.contains("in-view")) {
          countUp(numEl, num, raw, 1400);
          mo.disconnect();
        }
      });
      mo.observe(card, { attributes: true, attributeFilter: ["class"] });
    });

  })();




  document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.closest(".faq-item");
      const isActive = faqItem.classList.contains("active");
      document.querySelectorAll(".faq-item.active").forEach(item => {
        item.classList.remove("active");
        item.querySelector(".faq-toggle").textContent = "+";
      });
      if (!isActive) {
        faqItem.classList.add("active");
        faqItem.querySelector(".faq-toggle").textContent = "×";
      }
    });
  });

  /* ── Domains Scroll Storytelling ── */
  (function initDomainsScroll() {
    const wrapper  = document.getElementById("domainsScrollWrapper");
    const progress = document.getElementById("domainsProgress");
    const slides   = document.querySelectorAll(".domain-slide");
    const dots     = document.querySelectorAll(".ddot");
    if (!wrapper || !slides.length) return;

    const SLIDE_COUNT = slides.length;
    let current = 0;

    // Ensure first slide is visible immediately
    slides[0].classList.add("active");

    function setSlide(idx) {
      if (idx === current) return;

      slides[current].classList.remove("active");
      slides[current].classList.add("exit");
      const prev = current;
      setTimeout(() => slides[prev]?.classList.remove("exit"), 700);

      current = idx;
      slides[current].classList.add("active");

      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    function onScroll() {
      const top    = wrapper.getBoundingClientRect().top;
      const height = wrapper.offsetHeight;
      const vh     = window.innerHeight;

      const scrolled = Math.max(0, Math.min(1, -top / (height - vh)));

      // Progress bar
      if (progress) progress.style.width = (scrolled * 100) + "%";

      const idx = Math.min(SLIDE_COUNT - 1, Math.floor(scrolled * SLIDE_COUNT));
      setSlide(idx);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Dot click → scroll to that segment
    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        const target = parseInt(dot.dataset.slide, 10);
        const wTop   = wrapper.offsetTop;
        const wH     = wrapper.offsetHeight;
        const wVH    = window.innerHeight;
        const seg    = (wH - wVH) / SLIDE_COUNT;
        window.scrollTo({ top: wTop + seg * target + seg * 0.5, behavior: "smooth" });
      });
    });
  })();



  /* ── Countdown Timer (April 25, 2026 00:00:00 IST) ── */
  const countdownTarget = new Date("2026-04-25T00:00:00+05:30").getTime();
  const countdownContainer = document.getElementById("countdown-container");
  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minutesEl = document.getElementById("cd-minutes");
  const secondsEl = document.getElementById("cd-seconds");

  function animateDigit(el, newVal) {
    if (!el) return;
    const formatted = String(newVal).padStart(2, "0");
    if (el.textContent !== formatted) {
      el.classList.remove("flip-anim");
      void el.offsetWidth; // reflow
      el.textContent = formatted;
      el.classList.add("flip-anim");
    }
  }

  function updateCountdown() {
    const now = Date.now();
    const distance = countdownTarget - now;
    if (distance <= 0) {
      if (countdownContainer) {
        countdownContainer.innerHTML = `
          <div class="hackathon-live">
            <span class="live-icon">🚀</span>
            <span class="live-text">HACKATHON LIVE!</span>
          </div>`;
      }
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    animateDigit(daysEl, days);
    animateDigit(hoursEl, hours);
    animateDigit(minutesEl, minutes);
    animateDigit(secondsEl, seconds);
    setTimeout(updateCountdown, 1000);
  }
  if (countdownContainer) updateCountdown();

  /* Typewriter removed — tagline is now static HTML */


  const canvas = document.getElementById("particle-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let particles = [];
    const PARTICLE_COUNT = 18;          // reduced from 30 for perf
    const CONNECTION_DISTANCE = 90;     // was 140 — fewer connections checked
    const COLORS = ["#4361ee", "#3cdfff", "#7b2ff7"];

    let resizeTimer;
    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }, 200);
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.8;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Pre-build distance² table — avoids sqrt on every pair
    const DIST_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all particles in one batch per color (fewer ctx state changes)
      ctx.shadowBlur = 0;  // no per-particle shadow — saves GPU fill passes
      particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        p.update();
      });

      // Draw connections — cap at 3 connections per particle
      ctx.strokeStyle = "#3cdfff";
      ctx.lineWidth = 0.6;
      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        let connections = 0;
        for (let j = i + 1; j < particles.length; j++) {
          if (connections >= 3) break;  // limit per particle
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dSq = dx * dx + dy * dy;
          if (dSq < DIST_SQ) {
            const alpha = (1 - Math.sqrt(dSq) / CONNECTION_DISTANCE) * 0.2;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            connections++;
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ── Cursor Glow — RAF throttled ── */
  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow";
  document.body.appendChild(cursorGlow);
  let cursorX = 0, cursorY = 0, cursorRAF = false;
  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX; cursorY = e.clientY;
    if (!cursorRAF) {
      cursorRAF = true;
      requestAnimationFrame(() => {
        cursorGlow.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
        cursorRAF = false;
      });
    }
  });

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach(el => revealObserver.observe(el));

  // Also immediately reveal any element already in viewport on load
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("visible");
    }
  });

  /* ── Floating Register Button Logic ── */
  const floatBtn = document.querySelector(".floating-register-btn");
  const heroSection = document.getElementById("hero");
  if (floatBtn && heroSection) {
    const floatBtnObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If hero is NOT intersecting (user scrolled past it), show the floating button
        if (!entry.isIntersecting) {
          floatBtn.classList.add("show-float-btn");
        } else {
          floatBtn.classList.remove("show-float-btn");
        }
      });
    }, { threshold: 0.1 });
    floatBtnObserver.observe(heroSection);
  }

  /* ── Stat Counter ── */
  const statNumbers = document.querySelectorAll(".stat-number");
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        // Detect prefix (chars before the first digit) and suffix (chars after last digit)
        const prefixMatch = raw.match(/^([^0-9]*)/);
        const suffixMatch = raw.match(/([^0-9]*)$/);
        const prefix = prefixMatch ? prefixMatch[1] : "";
        const suffix = suffixMatch ? suffixMatch[1] : "";
        const numStr = raw.replace(/[^0-9]/g, "");
        const target = parseInt(numStr, 10);
        if (isNaN(target)) return;
        let count = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = prefix + count + suffix;
          if (count >= target) clearInterval(timer);
        }, 25);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNumbers.forEach(el => statsObserver.observe(el));

  /* ── Timeline: Hack2Future–style scroll-driven state ── */
  const tlItems = Array.from(document.querySelectorAll(".Timeline-grid ul li.timeline-stage"));

  function updateTimelineStates() {
    if (!tlItems.length) return;

    const midY = window.innerHeight * 0.55; // activation threshold

    let activeSet = false;
    // Walk items from bottom up to find the last one above midY
    let activeIndex = -1;
    for (let i = 0; i < tlItems.length; i++) {
      const rect = tlItems[i].getBoundingClientRect();
      const itemMid = rect.top + rect.height / 2;
      if (itemMid < midY) {
        activeIndex = i; // this one has passed the threshold, keep updating
      }
    }

    tlItems.forEach((item, i) => {
      // Always initially reveal items that are in view (fade-in from translateY)
      const rect = item.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.88;

      item.classList.remove("tl-active", "tl-complete", "reveal-active");

      if (i < activeIndex) {
        // Already scrolled past — completed
        item.classList.add("tl-complete");
      } else if (i === activeIndex) {
        // Currently active — one glowing node
        item.classList.add("tl-active");
        activeSet = true;
      } else {
        // Upcoming — just reveal if in view (fade-in without state)
        if (inView) item.classList.add("reveal-active");
      }
    });

    // Edge case: if no item has crossed midY yet but first item is visible
    if (!activeSet && activeIndex === -1) {
      const firstRect = tlItems[0]?.getBoundingClientRect();
      if (firstRect && firstRect.top < window.innerHeight * 0.88) {
        // Set first item as active when section just becomes visible
        tlItems[0].classList.add("tl-active");
      }
    }
  }

  if (tlItems.length) {
    window.addEventListener("scroll", updateTimelineStates, { passive: true });
    updateTimelineStates(); // run once on load
  }

  /* ── Panelists GSAP Deck Reveal Scan Animation ── */
  const stackWrapper = document.querySelector(".panelist-stack-wrapper");
  const stackCards = document.querySelectorAll(".panelist-stacked-card");

  if (stackWrapper && stackCards.length > 0 && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Initial Setup: Stack cards tightly like a deck
    stackCards.forEach((card, i) => {
      const infoBlock = card.querySelector(".p-info");
      
      gsap.set(card, {
        transformOrigin: "center center",
        zIndex: stackCards.length - i,
        // Each card is slightly offset and rotated to create a messy "deck" look
        x: i * 8 - (stackCards.length * 4), 
        y: i * 5,
        rotationZ: i % 2 === 0 ? i * 1.5 : -i * 1.5,
        scale: 0.95,
        opacity: 1 // Cards themselves are always visible in the deck
      });

      // Hide content initially so it looks like just a back/cover
      if (infoBlock) {
        gsap.set(infoBlock, { opacity: 0, y: 20 });
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".speakers",
        start: "center center",
        end: `+=${stackCards.length * 150}%`, // Longer scroll space for complex animation
        pin: true,
        scrub: 1,
      }
    });

    stackCards.forEach((card, index) => {
      const infoBlock = card.querySelector(".p-info");
      // For all cards EXCEPT the last one, we animate its full lifecycle
      
      // Phase 1: DRAW - Slide out diagonally and rotate
      tl.to(card, {
        x: -200, // Slide left
        y: -50,  // Slide up
        rotationZ: -15, // Tilt
        scale: 0.95,
        duration: 1,
        ease: "power1.out"
      }, `draw${index}`);

      // Phase 2: REVEAL - Swoop to center, straighten, scale up, fade info in
      tl.to(card, {
        x: 0,
        y: -20, // Slightly higher than deck
        rotationZ: 0,
        scale: 1.05,
        boxShadow: "0 25px 50px rgba(0,0,0,0.8), 0 0 40px rgba(60,223,255,0.3), inset 0 0 20px rgba(60,223,255,0.1)",
        zIndex: stackCards.length + 10, // Bring to absolute front
        duration: 1.5,
        ease: "power2.inOut"
      }, `reveal${index}`);

      if (infoBlock) {
        tl.to(infoBlock, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out"
        }, `reveal${index}+=0.5`); // Delay info fade in slightly
      }

      // Phase 3: DISCARD - Fade away if there are more cards
      if (index < stackCards.length - 1) {
        tl.to(card, {
          opacity: 0,
          scale: 1.1,
          y: -100, // Float up and away
          duration: 1,
          ease: "power1.in"
        }, `discard${index}`);
        
        if (infoBlock) {
           tl.to(infoBlock, { opacity: 0, duration: 0.5 }, `discard${index}`);
        }
      }
    });
  }
  /* ── Event Gallery — Scroll-Driven Slide Controller ── */
  (function initGallery() {
    const wrapper   = document.getElementById("galleryScrollWrapper");
    const slides    = document.querySelectorAll(".gallery-slide");
    if (!wrapper || !slides.length) return;

    const SLIDE_COUNT = slides.length;
    let currentSlide  = 0;

    // Activate the first slide immediately
    slides[0].classList.add("active");

    function setSlide(index) {
      if (index === currentSlide) return;

      // Exit current
      slides[currentSlide].classList.remove("active");
      slides[currentSlide].classList.add("exit");
      setTimeout(() => slides[currentSlide]?.classList.remove("exit"), 750);

      currentSlide = index;

      // Enter new
      slides[currentSlide].classList.add("active");
    }

    // Scroll handler
    function onScroll() {
      const wrapperTop    = wrapper.getBoundingClientRect().top;
      const wrapperHeight = wrapper.offsetHeight;
      const viewportH     = window.innerHeight;

      // How far into the pinned scroll region we are, 0→1
      const scrolled = Math.max(0, Math.min(1, -wrapperTop / (wrapperHeight - viewportH)));



      // Which slide? — divide 0→1 range into SLIDE_COUNT equal segments
      const idx = Math.min(SLIDE_COUNT - 1, Math.floor(scrolled * SLIDE_COUNT));
      setSlide(idx);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on load in case user is mid-page

  })();

  /* ── Filmstrip Drag ── */
  (function initFilmstrip() {
    const strip = document.getElementById("filmstrip");
    if (!strip) return;

    let isDragging = false, startX = 0, startScroll = 0;

    strip.addEventListener("mousedown", e => {
      isDragging  = true;
      startX      = e.pageX - strip.offsetLeft;
      startScroll = strip.scrollLeft;
    });
    window.addEventListener("mouseup",   () => { isDragging = false; });
    window.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const x    = e.pageX - strip.offsetLeft;
      const walk = (x - startX) * 1.8;
      strip.scrollLeft = startScroll - walk;
    });

    // Touch
    let tStart = 0, tScroll = 0;
    strip.addEventListener("touchstart",  e => { tStart = e.touches[0].pageX; tScroll = strip.scrollLeft; }, { passive: true });
    strip.addEventListener("touchmove",   e => {
      const dx = e.touches[0].pageX - tStart;
      strip.scrollLeft = tScroll - dx;
    }, { passive: true });
  })();

  /* ── Team Infinite Belt Carousel ── */
  document.querySelectorAll(".team-category").forEach(category => {
    const belt = category.querySelector(".team-belt");
    if (!belt) return;

    /* ─── 1. Clone cards 3× for a seamless infinite loop ─── */
    const origCards = Array.from(belt.querySelectorAll(".belt-card"));
    if (!origCards.length) return;

    [...origCards, ...origCards, ...origCards].forEach(c =>
      belt.appendChild(c.cloneNode(true))
    );

    /* ─── 2. Live dimension helpers ─── */
    // 1.4rem gap in CSS; read it properly once images have loaded
    const getCardW = () => {
      const c = belt.querySelector(".belt-card");
      if (!c) return 202; // fallback
      const style = window.getComputedStyle(belt);
      const gap = parseFloat(style.gap) || 22;
      return c.offsetWidth + gap;
    };
    const getSetW = () => origCards.length * getCardW();

    /* ─── 3. Scroll position state ─── */
    let pos     = 0;          // current translateX offset (positive = scroll right)
    let velocity = 0;         // inertia / momentum
    let autoSpeed = 0.5;      // px per frame for auto-scroll
    let isDragging   = false;
    let isInteracting = false; // true while any user input is live
    let resumeTimer  = null;
    let lastActiveEl = null;

    // Start offset: middle clone set so we can scroll both ways freely
    const initPos = () => { pos = getSetW(); applyTransform(); };

    function applyTransform() {
      belt.style.transform = `translateX(${-pos}px)`;
    }

    function clampLoop() {
      const sw = getSetW();
      // Seamless jump: stay within [sw, sw*2) range
      if (pos >= sw * 2) pos -= sw;
      if (pos <  sw)     pos += sw;
    }

    /* ─── 4. Center-card highlight ─── */
    function updateActiveCard() {
      const outer = belt.parentElement;
      if (!outer) return;
      const cx = outer.getBoundingClientRect().left + outer.offsetWidth / 2;
      let best = null, bestD = Infinity;
      belt.querySelectorAll(".belt-card").forEach(card => {
        const r = card.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - cx);
        if (d < bestD) { bestD = d; best = card; }
      });
      if (best && best !== lastActiveEl) {
        if (lastActiveEl) lastActiveEl.classList.remove("active");
        best.classList.add("active");
        lastActiveEl = best;
      }
    }

    /* ─── 5. RAF animation loop ─── */
    function tick() {
      if (!isInteracting) {
        // Auto advance
        pos += autoSpeed;
      } else if (!isDragging && Math.abs(velocity) > 0.1) {
        // Inertia after drag release
        pos += velocity;
        velocity *= 0.92; // friction
        if (Math.abs(velocity) <= 0.1) velocity = 0;
      }

      clampLoop();
      applyTransform();
      updateActiveCard();
      requestAnimationFrame(tick);
    }

    /* ─── 6. Input helpers ─── */
    function startInteraction() {
      clearTimeout(resumeTimer);
      isInteracting = true;
      velocity = 0;
    }

    function endInteraction() {
      // Resume auto-scroll after 1.8s of no input
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        isInteracting = false;
        velocity = 0;
      }, 1800);
    }

    /* ─── 7. Mouse drag ─── */
    let dragPrevX = 0, dragLastDelta = 0;
    let dragStartPos = 0;

    belt.addEventListener("mousedown", e => {
      if (e.button !== 0) return; // left button only
      startInteraction();
      isDragging   = true;
      dragPrevX    = e.clientX;
      dragStartPos = pos;
      belt.style.cursor = "grabbing";
      e.preventDefault();
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      belt.style.cursor = "grab";
      // Pass the last delta as inertia
      velocity = dragLastDelta;
      endInteraction();
    });

    window.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const delta = e.clientX - dragPrevX;
      dragLastDelta = -delta * 0.8; // invert: drag right = scroll left
      pos -= delta;
      dragPrevX = e.clientX;
    });

    /* ─── 8. Touch swipe ─── */
    let touchPrevX = 0, touchLastDelta = 0;

    belt.addEventListener("touchstart", e => {
      startInteraction();
      isDragging  = true;
      touchPrevX  = e.touches[0].clientX;
      touchLastDelta = 0;
    }, { passive: true });

    belt.addEventListener("touchmove", e => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - touchPrevX;
      touchLastDelta = -delta;
      pos -= delta;
      touchPrevX = e.touches[0].clientX;
    }, { passive: true });

    belt.addEventListener("touchend", () => {
      isDragging = false;
      velocity = touchLastDelta * 0.8;
      endInteraction();
    }, { passive: true });

    /* ─── 9. Wheel / trackpad scroll ─── */
    belt.parentElement.addEventListener("wheel", e => {
      startInteraction();
      // Accept both horizontal (trackpad) and vertical (mouse wheel) scroll
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      pos += delta * 1.2;
      endInteraction();
      // Prevent page scroll while over the carousel
      e.preventDefault();
    }, { passive: false });

    /* ─── 10. Boot ─── */
    // Wait one frame so card dimensions are available
    requestAnimationFrame(() => {
      initPos();
      requestAnimationFrame(tick);
    });
  });

  /* ── Partner Logo Hover Color ── */
  document.querySelectorAll(".logo-container").forEach(container => {
    container.addEventListener("mouseenter", () => {
      const img = container.querySelector(".partner-logo");
      if (img) { img.style.filter = "none"; img.style.opacity = "1"; }
    });
    container.addEventListener("mouseleave", () => {
      const img = container.querySelector(".partner-logo");
      if (img) { img.style.filter = "grayscale(80%) brightness(0.75)"; img.style.opacity = "0.7"; }
    });
    // Set initial grayscale
    const img = container.querySelector(".partner-logo");
    if (img) { img.style.filter = "grayscale(80%) brightness(0.75)"; img.style.opacity = "0.7"; img.style.transition = "all 0.4s ease"; }
  });

  /* ── Domain Card 3D Tilt ── */
  const domainCards = document.querySelectorAll(".domain-card");
  domainCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      // Get dimensions and cursor position relative to the card's top-left
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (-3 to +3 degrees)
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      
      card.style.setProperty("--rx", `${rotateX}deg`);
      card.style.setProperty("--ry", `${rotateY}deg`);
    });
    
    card.addEventListener("mouseleave", () => {
      // Reset tilt smoothly when mouse leaves
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });

});