// js/admin-nav.js
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn"); // dashboard only

  const isMobileMode = () => window.matchMedia("(max-width: 1024px)").matches;

  const lockScroll = (locked) => {
    document.body.style.overflow = locked ? "hidden" : "";
  };

  const openMobileSidebar = () => {
    if (!sidebar || !overlay) return;
    sidebar.classList.add("mobile-active");
    overlay.classList.add("active");
    lockScroll(true);
  };

  const closeMobileSidebar = () => {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove("mobile-active");
    overlay.classList.remove("active");
    lockScroll(false);
  };

  // Overlay click closes sidebar
  if (overlay) overlay.addEventListener("click", closeMobileSidebar);

  // ESC closes sidebar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar?.classList.contains("mobile-active")) {
      closeMobileSidebar();
    }
  });

  // Dashboard: hamburger toggles sidebar on mobile
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (sidebar?.classList.contains("mobile-active")) closeMobileSidebar();
      else openMobileSidebar();
    });
  }

  // ✅ BACK BUTTON LOGIC (works for ANY back button)
  // Supports:
  //  - id="nav-back-btn"
  //  - class="back-btn"
  //  - data-back
  document.addEventListener("click", (e) => {
    const backEl = e.target.closest("#nav-back-btn, .back-btn, [data-back]");
    if (!backEl) return;

    e.preventDefault(); // stops form submits / link navigation
    e.stopPropagation();

    // If user has history, go back. Otherwise fallback to dashboard.
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "dashboard.html";
    }
  });

  // If resizing to desktop: remove overlay + unlock scroll
  window.addEventListener("resize", () => {
    if (!isMobileMode()) closeMobileSidebar();
  });

  // Highlight active sidebar link
  const current = (location.pathname.split("/").pop() || "").toLowerCase();
  document.querySelectorAll(".nav-menu a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === current) a.classList.add("active");
    else a.classList.remove("active");
  });
});
