// js/session.js
import { auth, db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * Safely set text in an element. If missing value, show "Add ____"
 */
function setText(selector, value, fallbackLabel) {
  const el = document.querySelector(selector);
  if (!el) return;

  const v = (value ?? "").toString().trim();
  el.textContent = v ? v : `Add ${fallbackLabel}`;
}

/**
 * Set avatar initials or photo
 */
function setAvatar(selector, user) {
  const el = document.querySelector(selector);
  if (!el) return;

  if (user?.photoURL) {
    el.innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; border-radius:12px; object-fit:cover;">`;
    return;
  }

  const initials = (user?.displayName || "Executive Member")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  el.textContent = initials || "MB";
}

/**
 * Apply Firestore user data into UI
 */
function hydrateUI(user, userData) {
  // --- Common (Profile + any header) ---
  setText("#user-display-name", user.displayName, "Display Name");
  setAvatar("#user-avatar-sm", user);

  // If you have these on some pages, they’ll populate automatically:
  setText("#profile-name", user.displayName, "Display Name");

  // --- My Profile page fields (you must add these IDs in HTML) ---
  setText("#profile-email", user.email, "Email Address");
  setText("#profile-residence", userData?.primaryResidence, "Primary Residence");
  setText("#profile-tier", userData?.membership, "Membership Tier");
  setText("#profile-orders", userData?.stats?.orders, "Orders");
  setText("#profile-points", userData?.stats?.points, "Points");
  setText("#profile-wallet", userData?.walletBalance, "Wallet Balance");

  // --- Settings page inputs (you must add these IDs in HTML) ---
  const setInput = (selector, value, placeholderLabel) => {
    const input = document.querySelector(selector);
    if (!input) return;
    const v = (value ?? "").toString().trim();
    input.value = v;
    input.placeholder = v ? input.placeholder : `Add ${placeholderLabel}`;
  };

  setInput("#settings-name", user.displayName, "Display Name");
  setInput("#settings-email", user.email, "Email Address");

  // Example editable spans in settings (if you add these IDs):
  setText("#settings-residence", userData?.primaryResidence, "Primary Residence");
  setText("#settings-office", userData?.corporateOffice, "Corporate Office");

  // --- Payments page (optional IDs if you add them) ---
  setText("#payment-primary-method", userData?.payment?.primaryMethod, "Payment Method");
  setText("#payment-card-last4", userData?.payment?.cardLast4 ? `•••• ${userData.payment.cardLast4}` : "", "Card Details");
}

/**
 * Expose a real logout hook for global.js to call
 */
window.MobWashLogout = async function MobWashLogout() {
  await signOut(auth);
  window.location.href = "login.html";
};

// --- Boot ---
auth.onAuthStateChanged(async (user) => {
  // Kick out guests
  if (!user) {
    const safePages = ["index.html", "login.html", "register.html"];
    const current = (location.pathname.split("/").pop() || "").toLowerCase();
    if (!safePages.includes(current)) window.location.href = "login.html";
    return;
  }

  // Pull user document
  let userData = {};
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    userData = snap.exists() ? snap.data() : {};
  } catch (e) {
    console.error("Failed loading user doc:", e);
  }

  hydrateUI(user, userData);
});