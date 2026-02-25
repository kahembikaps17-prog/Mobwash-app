import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const currentPage = window.location.pathname.toLowerCase();

  if (currentPage.includes("profile.html")) {
    handleOrderMonitor(user);
  }

  if (currentPage.includes("express.html")) {
    handleSchedulingDefaults();
  }
});

// Helper: Order Monitor (Profile Page)
function handleOrderMonitor(user) {
  const q = query(
    collection(db, "orders"),
    where("userId", "==", user.uid),
    orderBy("timestamp", "desc"),
    limit(1)
  );

  const hubLink = document.querySelector('a[href="profile.html"]');

  onSnapshot(q, (snapshot) => {
    const section = document.getElementById("active-order-section");
    if (!section) return;

    if (!snapshot.empty) {
      const order = snapshot.docs[0].data();
      section.style.display = "block";

      const statusEl = document.getElementById("status-message");
      if (statusEl) statusEl.innerText = (order.status || "").toUpperCase();

      if ((order.status || "").toLowerCase() !== "delivered" && hubLink) {
        hubLink.classList.add("hub-active-pulse");
      }
    } else {
      section.style.display = "none";
    }
  });
}

// Helper: Date/Time Defaults (Express Page)
function handleSchedulingDefaults() {
  const dateInput = document.getElementById("pickup-date");
  const timeInput = document.getElementById("pickup-time");

  if (dateInput && !dateInput.value) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split("T")[0];
  }

  if (timeInput && !timeInput.value) {
    const now = new Date();
    timeInput.value = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  }
}