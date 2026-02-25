import { db, auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, where, onSnapshot, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged((user) => {
  if (user) {
    // --- 1. GLOBAL UI UPDATES (Runs on both Profile & Express) ---

    if (avatarEl) {
      if (user.photoURL) {
        avatarEl.innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; border-radius:12px; object-fit:cover;">`;
      } else {
        const initials = (user.displayName || "E M").split(' ').map(n => n[0]).join('').toUpperCase();
        avatarEl.innerText = initials;
      }
    }

    // --- 2. LOGOUT LOGIC ---
    const logoutBtn = document.getElementById("logout-trigger");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        signOut(auth).then(() => {
          window.location.href = "login.html";
        });
      });
    }

    // --- 3. PAGE-SPECIFIC LOGIC ---
    const currentPage = window.location.pathname;

    if (currentPage.includes("profile.html")) {
        handleOrderMonitor(user);
    }

    if (currentPage.includes("express.html")) {
        handleSchedulingDefaults();
    }

  } else {
    // SECURITY REDIRECT: Kick out unauthenticated users
    window.location.href = "login.html";
  }
});

// Helper: Order Monitor (Profile Page)
function handleOrderMonitor(user) {
    const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("timestamp", "desc"), limit(1));
    const hubLink = document.querySelector('a[href="profile.html"]');
    
    onSnapshot(q, (snapshot) => {
      const section = document.getElementById("active-order-section");
      if (!section) return;

      if (!snapshot.empty) {
        const order = snapshot.docs[0].data();
        section.style.display = "block";
        document.getElementById("status-message").innerText = order.status.toUpperCase();
        
        if (order.status.toLowerCase() !== "delivered" && hubLink) {
          hubLink.classList.add('hub-active-pulse');
        }
      } else {
        section.style.display = "none";
      }
    });
}

// Helper: Date/Time Defaults (Express Page)
function handleSchedulingDefaults() {
    const dateInput = document.getElementById('pickup-date');
    const timeInput = document.getElementById('pickup-time');
    
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }
    
    if (timeInput && !timeInput.value) {
      const now = new Date();
      timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
}