/* ============================================================
   FaathirTaKa — Faathir Kuspratama Pasha · Portfolio
   Interactions: theme, nav, reveals, cursor, counters, form
   ============================================================ */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     CONFIG
     --------------------------------------------------------- */
  const CONTACT_EMAIL = "faathir.kuspratama.pasha36@gmail.com";
  const STORAGE_KEY = "ftk-theme";
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Theme toggle (respects saved choice, then system)
     --------------------------------------------------------- */
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* ignore */ }
    }
    if (themeToggle) {
      const isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f7f1ef" : "#14100f");
  }

  (function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(saved || (prefersLight ? "light" : "dark"), false);
  })();

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next, true);
    });
  }

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  const navLinks = document.getElementById("navLinks");
  const navBurger = document.getElementById("navBurger");

  function closeNav() {
    if (!navLinks || !navBurger) return;
    navLinks.classList.remove("is-open");
    navBurger.setAttribute("aria-expanded", "false");
    navBurger.setAttribute("aria-label", "Open menu");
  }

  if (navBurger && navLinks) {
    navBurger.addEventListener("click", function () {
      const open = navLinks.classList.toggle("is-open");
      navBurger.setAttribute("aria-expanded", String(open));
      navBurger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    document.addEventListener("click", function (e) {
      if (!navLinks.classList.contains("is-open")) return;
      if (e.target.closest("#navLinks") || e.target.closest("#navBurger")) return;
      closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------------------------------------------------------
     Header state + scroll progress + back-to-top
     --------------------------------------------------------- */
  const header = document.getElementById("siteHeader");
  const scrollBar = document.getElementById("scrollBar");
  const toTop = document.getElementById("toTop");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-stuck", y > 12);
    if (toTop) toTop.classList.toggle("is-on", y > 520);

    if (scrollBar) {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      scrollBar.style.width = pct + "%";
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------------------------------------------------------
     Back to top — a slow, eased glide

     The browser's own `behavior: "smooth"` is quick and its
     duration can't be set, so the glide is driven frame by
     frame here instead. Duration grows with distance, keeping
     the motion unhurried on long pages without feeling stuck
     when the visitor is already near the top.
     --------------------------------------------------------- */
  let glideFrame = null;

  function stopGlide() {
    if (glideFrame === null) return;
    cancelAnimationFrame(glideFrame);
    glideFrame = null;
    // Hand scrolling back to the stylesheet's `scroll-behavior: smooth`.
    root.style.scrollBehavior = "";
  }

  function glideToTop() {
    const from = window.scrollY || window.pageYOffset;
    if (from <= 0) return;

    if (reduceMotion) {
      window.scrollTo(0, 0);
      return;
    }

    const duration = Math.min(1900, Math.max(750, from * 0.9));
    const start = performance.now();

    // Take over scrolling for the duration: the page-level
    // `scroll-behavior: smooth` would otherwise animate every one
    // of our frames, turning the glide into a stutter.
    root.style.scrollBehavior = "auto";

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      // easeInOutCubic — gentle launch, gentle landing.
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      window.scrollTo(0, Math.round(from * (1 - eased)));

      if (t < 1) {
        glideFrame = requestAnimationFrame(step);
      } else {
        stopGlide();
      }
    }

    glideFrame = requestAnimationFrame(step);
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      // Restart the button's launch animation on repeat clicks. Skipped
      // under reduced motion, where the animation is disabled and so
      // `animationend` would never fire to clear the class again.
      if (!reduceMotion) {
        toTop.classList.remove("is-launching");
        void toTop.offsetWidth;
        toTop.classList.add("is-launching");
      }

      glideToTop();
    });

    toTop.addEventListener("animationend", function (e) {
      if (e.target === toTop) toTop.classList.remove("is-launching");
    });
  }

  // Let the visitor take the wheel mid-glide.
  ["wheel", "touchstart", "keydown"].forEach(function (type) {
    window.addEventListener(type, stopGlide, { passive: true });
  });

  /* ---------------------------------------------------------
     Scroll reveals
     --------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------------------------------------------------
     Animated stat counters
     --------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ---------------------------------------------------------
     Active nav link while scrolling
     --------------------------------------------------------- */
  const sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  const navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));

  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    const sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navAnchors.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { sio.observe(s); });
  }

  /* ---------------------------------------------------------
     Cursor glow
     --------------------------------------------------------- */
  const glow = document.getElementById("cursorGlow");
  if (glow && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let cx = gx, cy = gy;

    window.addEventListener("pointermove", function (e) {
      gx = e.clientX; gy = e.clientY;
      glow.classList.add("is-on");
    }, { passive: true });

    document.addEventListener("mouseleave", function () { glow.classList.remove("is-on"); });

    (function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate3d(" + cx + "px," + cy + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------------------------------------------------------
     Pointer-tracked glow inside skill cards
     --------------------------------------------------------- */
  document.querySelectorAll(".skill-card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
      card.style.setProperty("--my", (e.clientY - rect.top) + "px");
    });
  });

  /* ---------------------------------------------------------
     Contact form → direct send (no mail app needed)

     The form submits straight to a form-to-email relay, which
     delivers the message to CONTACT_EMAIL. Nothing opens on the
     visitor's machine; the email is sent the moment they click.
     --------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
  const submitLabel = submitBtn ? submitBtn.querySelector("span") : null;
  const defaultLabel = submitLabel ? submitLabel.textContent : "Send the demo";
  let sending = false;

  function setNote(message, kind) {
    if (!note) return;
    note.textContent = message;
    note.classList.remove("is-ok", "is-err");
    if (kind) note.classList.add(kind);
  }

  function setSending(state) {
    sending = state;
    if (!submitBtn) return;
    submitBtn.disabled = state;
    submitBtn.classList.toggle("is-sending", state);
    if (submitLabel) submitLabel.textContent = state ? "Sending..." : defaultLabel;
  }

  if (form) {
    // Where the direct send goes. Set to a form-to-email endpoint
    // (e.g. FormSubmit) so the click itself delivers the message.
    const SEND_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending) return;

      const name = form.elements["name"];
      const email = form.elements["email"];
      const topic = form.elements["topic"];
      const message = form.elements["message"];
      let valid = true;

      [name, email, message].forEach(function (field) {
        const wrap = field.closest(".field");
        const bad = !field.value.trim() || (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        if (wrap) wrap.classList.toggle("has-error", bad);
        if (bad) valid = false;
      });

      if (!valid) {
        setNote("Please fill in your name, a valid email, and a message.", "is-err");
        return;
      }

      const subject = "[Portfolio] " + topic.value + " — " + name.value.trim();
      const body =
        "Name: " + name.value.trim() + "\n" +
        "Email: " + email.value.trim() + "\n" +
        "Topic: " + topic.value + "\n\n" +
        message.value.trim();

      setSending(true);
      setNote("Sending your message...");

      fetch(SEND_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          subject: subject,
          name: name.value.trim(),
          email: email.value.trim(),
          topic: topic.value,
          message: message.value.trim(),
          _replyto: email.value.trim(),
          _template: "table",
          _captcha: "false",
          text: body
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed: " + res.status);
          return res.json();
        })
        .then(function () {
          form.reset();
          setNote("Demo request sent — thanks! I'll reply within 1–2 days.", "is-ok");
        })
        .catch(function () {
          setNote("Couldn't send right now. Please try again in a moment.", "is-err");
        })
        .finally(function () {
          setSending(false);
        });
    });

    form.addEventListener("input", function (e) {
      const wrap = e.target.closest(".field");
      if (wrap) wrap.classList.remove("has-error");
    });
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------
     Subtle parallax on the vinyl deck
     --------------------------------------------------------- */
  const deck = document.querySelector(".hero__deck");
  if (deck && !reduceMotion && window.matchMedia("(hover: hover)").matches) {
    const hero = document.querySelector(".hero");
    if (hero) {
      hero.addEventListener("pointermove", function (e) {
        const r = hero.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        deck.style.transform = "translate3d(" + (dx * 14) + "px," + (dy * 14) + "px,0)";
      });
      hero.addEventListener("pointerleave", function () {
        deck.style.transform = "";
      });
    }
  }
})();
