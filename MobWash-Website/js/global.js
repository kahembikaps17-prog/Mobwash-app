/* ============================================================
   MOBWASH EXECUTIVE GLOBAL LOGIC — APP-LIKE NAVIGATION
   ============================================================ */

const MobWash = {
  // 0. HAPTIC FEEDBACK
  haptic(intensity = 10) {
    if (navigator.vibrate) navigator.vibrate(intensity);
  },

  // 1. THEME ENGINE
  initTheme() {
    const savedTheme = localStorage.getItem("mobwash-theme") || "dark";
    document.body.setAttribute("data-theme", savedTheme);

    const toggle = document.getElementById("theme-toggle");
    if (toggle && savedTheme === "dark") toggle.classList.add("active");
  },

  toggleTheme() {
    this.haptic(15);
    const current = document.body.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";

    document.body.setAttribute("data-theme", next);
    localStorage.setItem("mobwash-theme", next);

    const toggle = document.getElementById("theme-toggle");
    if (toggle) toggle.classList.toggle("active");
  },

  // 2. APP-LIKE BACK BEHAVIOR (Predictable)
  // Priority:
  // 1) if clicked element provides data-back="somepage.html", go there
  // 2) else go to fallback (default: profile.html)
  goBack(fallback = "profile.html", clickedEl = null) {
    this.haptic(5);

    // If the back button has a specific target, use it
    const explicitTarget =
      clickedEl?.closest("[data-back]")?.getAttribute("data-back") || null;

    const target = explicitTarget || fallback;

    // Avoid reloading same page endlessly
    const current = (location.pathname.split("/").pop() || "").toLowerCase();
    const targetName = (target.split("/").pop() || "").toLowerCase();

    if (current === targetName) {
      // if somehow they set back to same page, just go to profile
      window.location.href = "profile.html";
      return;
    }

    window.location.href = target;
  },

  // 3. LOGOUT MODAL
  initLogout() {
    const trigger = document.getElementById("logout-trigger");
    const modal = document.getElementById("logout-modal");
    const cancel = document.getElementById("cancel-logout");
    const confirm = document.getElementById("confirm-logout");

    if (!trigger || !modal) return;

    trigger.onclick = (e) => {
      e.preventDefault();
      this.haptic(20);
      modal.style.display = "flex";
    };

    if (cancel) cancel.onclick = () => (modal.style.display = "none");

    if (confirm)
      confirm.onclick = () => {
        this.haptic([30, 50, 30]);
        confirm.innerHTML =
          '<i class="bx bx-loader-alt bx-spin"></i> Ending Session...';
        setTimeout(() => (window.location.href = "index.html"), 1000);
      };
  },

  // 4. NOTIFICATIONS
  initNotifications() {
    const markReadBtn = document.getElementById("mark-read-trigger");
    const feed = document.querySelector(".notification-feed");
    const refresh = document.getElementById("pull-to-refresh");

    let startY = 0;

    if (feed && refresh) {
      feed.addEventListener(
        "touchstart",
        (e) => {
          if (window.scrollY === 0) startY = e.touches[0].pageY;
        },
        { passive: true }
      );

      feed.addEventListener(
        "touchmove",
        (e) => {
          if (e.touches[0].pageY - startY > 80 && window.scrollY === 0) {
            refresh.classList.add("visible");
          }
        },
        { passive: true }
      );

      feed.addEventListener("touchend", () => {
        if (refresh.classList.contains("visible")) {
          this.haptic(20);
          setTimeout(() => refresh.classList.remove("visible"), 1500);
        }
      });
    }

    if (markReadBtn) {
      markReadBtn.onclick = () => {
        this.haptic(15);
        markReadBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>';

        setTimeout(() => {
          document
            .querySelectorAll(".notification-card.unread")
            .forEach((c) => c.classList.remove("unread"));

          const dot = document.querySelector(".notification-dot");
          if (dot) dot.style.display = "none";

          markReadBtn.innerHTML =
            '<i class="bx bx-check-double" style="color: var(--logo-secondary)"></i>';
          markReadBtn.style.pointerEvents = "none";
        }, 800);
      };
    }
  },
};

/* --- SWIPE TO DELETE --- */
let touchstartX = 0;

document.addEventListener(
  "touchstart",
  (e) => {
    touchstartX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

document.addEventListener(
  "touchend",
  (e) => {
    const card = e.target.closest(".notification-card");
    if (!card) return;

    if (touchstartX - e.changedTouches[0].screenX > 70) {
      MobWash.haptic(40);
      card.style.transform = "translateX(-100px)";
      card.style.opacity = "0";
      setTimeout(() => card.remove(), 300);
    }
  },
  { passive: true }
);

/* --- INIT --- */
document.addEventListener("DOMContentLoaded", () => {
  MobWash.initTheme();
  MobWash.initLogout();
  MobWash.initNotifications();

  // ✅ UNIVERSAL BACK BUTTON (APP-LIKE)
  // Supports:
  // - .minimal-back
  // - .glass-back
  // - any element with [data-back]
  // - your old icon selector
  document.addEventListener("click", (e) => {
    const backEl = e.target.closest(
      ".minimal-back, .glass-back, [data-back], a > .bx-chevron-left"
    );
    if (!backEl) return;

    // find the actual clickable link if it's inside <a>
    const btn = backEl.closest("a") || backEl;

    e.preventDefault();
    MobWash.goBack("profile.html", btn);
  });

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.onclick = () => MobWash.toggleTheme();
});
