// js/session.js
import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

console.log("✅ session.js loaded");

function setText(selector, value, fallbackLabel) {
  const el = document.querySelector(selector);
  if (!el) return;

  const v = (value ?? "").toString().trim();
  el.textContent = v ? v : `Add ${fallbackLabel}`;
}

function setInput(selector, value, placeholderLabel) {
  const input = document.querySelector(selector);
  if (!input) return;

  const v = (value ?? "").toString().trim();
  input.value = v;

  if (!v) input.placeholder = `Add ${placeholderLabel}`;
}

function setAvatar(selector, user) {
  const el = document.querySelector(selector);
  if (!el) return;

  if (user?.photoURL) {
    el.innerHTML = `<img src="${user.photoURL}" style="width:100%; height:100%; border-radius:12px; object-fit:cover;">`;
    return;
  }

  const initials = (user?.displayName || user?.email || "MobWash")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  el.textContent = initials || "MB";
}

function hydrateUI(user, userData) {
  // Profile.html header
  setText("#user-display-name", user.displayName, "Display Name");
  setAvatar("#user-avatar-sm", user);

  // My-profile.html
  setText("#profile-name", user.displayName, "Display Name");
  setText("#profile-email", user.email, "Email Address");
  setText("#profile-residence", userData?.primaryResidence, "Primary Residence");
  setAvatar("#profile-avatar", user);

  // Settings.html
  setInput("#settings-name", user.displayName, "Display Name");
  setInput("#settings-email", user.email, "Email Address");

  setText("#settings-residence", userData?.primaryResidence, "Primary Residence");
  setText("#settings-office", userData?.corporateOffice, "Corporate Office");
}

// Expose logout so global.js can call it
window.MobWashLogout = async function MobWashLogout() {
  await signOut(auth);
  window.location.href = "login.html";
};

auth.onAuthStateChanged(async (user) => {
  console.log("✅ auth state:", user?.uid, user?.displayName, user?.email);

  if (!user) {
    const safePages = ["index.html", "login.html", "register.html"];
    const current = (location.pathname.split("/").pop() || "").toLowerCase();
    if (!safePages.includes(current)) window.location.href = "login.html";
    return;
  }

  // Load user doc
  let userData = {};
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    userData = snap.exists() ? snap.data() : {};
  } catch (e) {
    console.error("❌ Failed loading user doc:", e);
  }

  hydrateUI(user, userData);
});