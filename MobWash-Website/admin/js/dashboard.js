// js/dashboard.js
import { db } from "../../js/firebase.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENTS (stable ones)
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");
  const toggleBtn = document.getElementById("sidebar-toggle");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const overlay = document.getElementById("sidebar-overlay"); // uses your HTML overlay

  const maintenanceToggle = document.getElementById("maintenance-toggle");

  let chartInstance = null;
  let initialOrdersLoaded = false;

  // =========================
  // MOBILE SIDEBAR (Overlay + UX)
  // =========================
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

  // Overlay click closes
  if (overlay) overlay.addEventListener("click", closeMobileSidebar);

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar?.classList.contains("mobile-active")) {
      closeMobileSidebar();
    }
  });

  // Swipe left to close (when open)
  let touchStartX = 0;
  let touchStartY = 0;
  let trackingSwipe = false;

  document.addEventListener(
    "touchstart",
    (e) => {
      if (!sidebar?.classList.contains("mobile-active")) return;
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      trackingSwipe = true;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!trackingSwipe) return;
      const t = e.touches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;

      // ignore mostly vertical gestures
      if (Math.abs(dy) > Math.abs(dx)) return;

      // swipe left closes
      if (dx < -60) {
        trackingSwipe = false;
        closeMobileSidebar();
      }
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    () => {
      trackingSwipe = false;
    },
    { passive: true }
  );

  // if resizing to desktop, ensure overlay is gone
  window.addEventListener("resize", () => {
    if (!isMobileMode()) {
      closeMobileSidebar();
    }
  });

  // =========================
  // HELPERS
  // =========================
  async function addLog(action) {
    try {
      await addDoc(collection(db, "auditLogs"), {
        action,
        timestamp: serverTimestamp(),
        admin: "System Root",
      });
    } catch (e) {
      console.error("Audit log write error:", e);
    }
  }

  function toast(email, plan) {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `
      <i class='bx bxs-bell-ring'></i>
      <div class="toast-content">
        <h5>New Order</h5>
        <p>${email || "Unknown user"} ordered ${plan || "a plan"}</p>
      </div>
    `;
    toastContainer.appendChild(el);

    setTimeout(() => {
      el.classList.add("fade-out");
      setTimeout(() => el.remove(), 350);
    }, 4500);
  }

  // =========================
  // SIDEBAR RESIZE (DESKTOP) + MOBILE BEHAVIOR
  // =========================
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => {
      // In mobile mode, header click should open/close sidebar (not collapse width)
      if (isMobileMode()) {
        if (sidebar.classList.contains("mobile-active")) closeMobileSidebar();
        else openMobileSidebar();
        return;
      }

      sidebar.classList.toggle("collapsed");
      if (mainContent) mainContent.classList.toggle("expanded");

      // allow chart to resize after CSS transition
      setTimeout(() => {
        if (chartInstance) chartInstance.resize();
      }, 420);
    });
  }

  // MOBILE HAMBURGER (Dashboard only)
  if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains("mobile-active")) closeMobileSidebar();
      else openMobileSidebar();
    });
  }

  // Close mobile sidebar when clicking main area
  if (mainContent && sidebar) {
    mainContent.addEventListener("click", () => {
      if (sidebar.classList.contains("mobile-active")) closeMobileSidebar();
    });
  }

  // =========================
  // MAINTENANCE TOGGLE (RESTORED + LABEL UPDATE IF AVAILABLE)
  // =========================
  if (maintenanceToggle) {
    const configRef = doc(db, "adminSettings", "config");

    onSnapshot(
      configRef,
      (snap) => {
        if (!snap.exists()) return;

        const isMaint = !!snap.data().maintenance;
        maintenanceToggle.checked = isMaint;

        // IMPORTANT: re-query label because DOM can be replaced dynamically
        const statusLabel = document.getElementById("system-status-label");
        if (statusLabel) {
          statusLabel.textContent = isMaint ? "Maintenance Mode" : "System Online";
          statusLabel.style.color = isMaint
            ? "var(--accent-orange)"
            : "var(--accent-blue)";
        }
      },
      (err) => console.error("Maintenance config listen error:", err)
    );

    maintenanceToggle.addEventListener("change", async () => {
      try {
        const isOffline = maintenanceToggle.checked;

        const statusLabel = document.getElementById("system-status-label");
        if (statusLabel) {
          statusLabel.textContent = isOffline ? "Maintenance Mode" : "System Online";
          statusLabel.style.color = isOffline
            ? "var(--accent-orange)"
            : "var(--accent-blue)";
        }

        await updateDoc(configRef, { maintenance: isOffline });
        await addLog(isOffline ? "MAINTENANCE MODE ACTIVATED" : "SYSTEM BROUGHT ONLINE");
      } catch (e) {
        console.error("Maintenance toggle error:", e);
      }
    });
  }

  // =========================
  // LIVE AUDIT LOGS
  // =========================
  const logsQ = query(
    collection(db, "auditLogs"),
    orderBy("timestamp", "desc"),
    limit(30)
  );

  onSnapshot(
    logsQ,
    (snap) => {
      const logContainer = document.getElementById("audit-logs");
      if (!logContainer) return;

      logContainer.innerHTML = "";
      if (snap.empty) {
        logContainer.innerHTML = `<div class="log-entry">No logs yet.</div>`;
        return;
      }

      snap.forEach((d) => {
        const data = d.data();
        const ts = data.timestamp?.toDate?.()
          ? data.timestamp.toDate().toLocaleString()
          : "Just now";
        const action = data.action || "Unknown action";

        logContainer.innerHTML += `
          <div class="log-entry">
            <span style="color: var(--accent-blue)">${ts}</span> ${action}
          </div>
        `;
      });
    },
    (err) => console.error("Audit logs listen error:", err)
  );

  // =========================
  // ORDERS STREAM (ALWAYS compute revenueMap, even if table isn't mounted)
  // =========================
  const ordersQ = query(collection(db, "orders"), orderBy("orderDate", "desc"));

  onSnapshot(
    ordersQ,
    (snap) => {
      // Re-query dynamic DOM targets on every snapshot (because pages change)
      const ordersBody = document.getElementById("orders-body");
      const revenueEl = document.getElementById("monthly-revenue");
      const totalOrdersEl = document.getElementById("total-orders-count");
      const totalUsersEl = document.getElementById("total-users");
      const activeSubsEl = document.getElementById("active-subs");

      // If table exists, clear it. If not, it's fine (we still update the chart if present)
      if (ordersBody) ordersBody.innerHTML = "";

      let revenue = 0;
      const revenueMap = Object.create(null);

      const uniqueUsers = new Set();
      let activeSubsGuess = 0;

      snap.forEach((docSnap) => {
        const o = docSnap.data();

        const email = o.customerEmail || "Unknown";
        const plan = o.plan || "Standard";
        const status = (o.status || "pending").toString();

        // handle "K250" or "250" safely
        const price = Number(String(o.price || "").replace(/[^\d.]/g, "")) || 0;

        revenue += price;
        uniqueUsers.add(email);

        if (String(plan).toLowerCase().includes("sub")) activeSubsGuess++;

        // Robust date fallback:
        // orderDate -> createdAt -> timestamp -> fallback
        const ts =
          o.orderDate?.toDate?.() ||
          o.createdAt?.toDate?.() ||
          o.timestamp?.toDate?.() ||
          null;

        const dateKey = ts ? ts.toISOString().slice(0, 10) : "unknown";
        revenueMap[dateKey] = (revenueMap[dateKey] || 0) + price;

        // Only render table rows when table exists
        if (ordersBody) {
          const safeEmail = String(email).replaceAll("'", "\\'");
          ordersBody.innerHTML += `
            <tr>
              <td>${email}</td>
              <td>${plan}</td>
              <td style="color: var(--accent-orange)">${status}</td>
              <td>
                <button onclick="markComplete('${docSnap.id}', '${safeEmail}')" class="complete-btn">
                  Complete
                </button>
              </td>
            </tr>
          `;
        }
      });

      // Update metrics only if elements exist on current page
      if (revenueEl) revenueEl.textContent = "K" + revenue.toLocaleString();
      if (totalOrdersEl) totalOrdersEl.textContent = String(snap.size);
      if (totalUsersEl) totalUsersEl.textContent = String(uniqueUsers.size);
      if (activeSubsEl) activeSubsEl.textContent = String(activeSubsGuess);

      // ✅ Always attempt to render chart if canvas exists
      initChart(revenueMap);

      // Toast notifications (only after initial snapshot)
      if (initialOrdersLoaded) {
        snap.docChanges().forEach((change) => {
          if (change.type === "added") {
            const order = change.doc.data();
            toast(order.customerEmail, order.plan);
          }
        });
      }
      initialOrdersLoaded = true;
    },
    (err) => console.error("Orders listen error:", err)
  );

  // OPTIONAL counts (safe if collections exist + rules allow)
  (async () => {
    try {
      const usersCount = await getCountFromServer(collection(db, "users"));
      const totalUsersEl = document.getElementById("total-users");
      if (totalUsersEl) totalUsersEl.textContent = String(usersCount.data().count);
    } catch {}

    try {
      const subsCount = await getCountFromServer(collection(db, "subscriptions"));
      const activeSubsEl = document.getElementById("active-subs");
      if (activeSubsEl) activeSubsEl.textContent = String(subsCount.data().count);
    } catch {}
  })();

  // =========================
  // SEARCH FILTER
  // =========================
  const searchInput = document.getElementById("global-search");
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const ordersBody = document.getElementById("orders-body");
      if (!ordersBody) return;

      const filter = searchInput.value.toLowerCase();
      const rows = ordersBody.querySelectorAll("tr");
      rows.forEach((row) => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
      });
    });
  }

  // =========================
  // EXPORT CSV
  // =========================
  const exportBtn = document.getElementById("export-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const ordersBody = document.getElementById("orders-body");
      if (!ordersBody) return;

      const rows = ordersBody.querySelectorAll("tr");
      let csv = "Email,Plan,Status\n";
      rows.forEach((row) => {
        const cols = row.querySelectorAll("td");
        if (cols.length >= 3) {
          csv += `${cols[0].innerText},${cols[1].innerText},${cols[2].innerText}\n`;
        }
      });

      const link = document.createElement("a");
      link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      link.download = "MobWash_Orders.csv";
      link.click();
    });
  }

  // =========================
  // CHART (Revenue Intelligence) - FIXED FOR DYNAMIC PAGES
  // =========================
  function initChart(dataMap) {
    const canvas = document.getElementById("revenueChart");
    if (!canvas || typeof Chart === "undefined") return;

    // Remove unknown keys only if they truly have no data
    const keys = Object.keys(dataMap || {}).filter((k) => dataMap[k] > 0);

    if (keys.length === 0) {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // ISO keys sort correctly
    keys.sort();

    const labels = keys;
    const values = labels.map((k) => Number(dataMap[k]) || 0);

    // If the chart exists but belongs to a removed canvas, rebuild it
    if (chartInstance && chartInstance.canvas !== canvas) {
      chartInstance.destroy();
      chartInstance = null;
    }

    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = new Chart(canvas, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: "#fb923c",
            backgroundColor: "rgba(251, 146, 60, 0.10)",
            tension: 0.35,
            fill: true,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            ticks: { color: "#94a3b8" },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
          y: {
            ticks: { color: "#94a3b8" },
            grid: { color: "rgba(255,255,255,0.06)" },
          },
        },
      },
    });

    // Important: render after layout settles (especially after dynamic injection)
    requestAnimationFrame(() => {
      setTimeout(() => chartInstance && chartInstance.resize(), 150);
    });
  }

  // Your router dispatches this event when content changes
  window.addEventListener("mobwash:navigate", () => {
    // If chart is visible, nudge resize so it paints correctly
    const canvas = document.getElementById("revenueChart");
    if (!canvas) {
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
      return;
    }
    setTimeout(() => {
      if (chartInstance) chartInstance.resize();
    }, 150);
  });

  // =========================
  // LIVE CLOCK
  // =========================
  setInterval(() => {
    const liveClock = document.getElementById("live-clock");
    if (!liveClock) return;
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString() + " | SECURE SESSION";
  }, 1000);
});

// =========================
// GLOBAL FUNCTION (onclick in table)
// =========================
window.markComplete = async (id, email) => {
  try {
    await updateDoc(doc(db, "orders", id), { status: "completed" });
    await addDoc(collection(db, "auditLogs"), {
      action: `Order Completed: ${email || "Unknown"}`,
      timestamp: serverTimestamp(),
      admin: "System Root",
    });
  } catch (e) {
    console.error("Complete order error:", e);
  }
};
