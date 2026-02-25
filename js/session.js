// js/session.js
import { auth, db } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function initialsFromName(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "MW";
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase() || "MW";
}

function safeText(el, value, placeholder) {
  if (!el) return;
  const v = (value ?? "").toString().trim();
  el.textContent = v ? v : placeholder;
}

function safeInput(input, value, placeholder = "") {
  if (!input) return;
  const v = (value ?? "").toString().trim();
  if (v) input.value = v;
  input.placeholder = placeholder;
}

function findSettingSmallByLabel(labelText) {
  // In my-profile.html “Email Address” and “Primary Residence” use <span> label + <small> value
  const items = document.querySelectorAll(".setting-item .setting-info");
  for (const info of items) {
    const span = info.querySelector("span");
    const small = info.querySelector("small");
    if (!span || !small) continue;
    if (span.textContent.trim().toLowerCase() === labelText.toLowerCase()) return small;
  }
  return null;
}

function setAvatar(el, name, photoURL) {
  if (!el) return;

  // if you later add photo uploads, you can use photoURL
  if (photoURL) {
    el.innerHTML = `<img src="${photoURL}" style="width:100%;height:100%;border-radius:14px;object-fit:cover;">`;
    return;
  }

  el.textContent = initialsFromName(name);
}

async function ensureUserDoc(user) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    // First time: create a clean profile doc
    await setDoc(ref, {
      name: user.displayName || "",
      email: user.email || "",
      phone: "",
      city: "",
      area: "",
      primaryResidence: "",
      corporateOffice: "",
      membership: "Standard",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return (await getDoc(ref)).data();
  }

  // If it exists, return it
  return snap.data();
}

function hydrateUI(user, profile) {
  // ---- HUB (profile.html) ----
  safeText(
    document.getElementById("user-display-name"),
    profile.name || user.displayName,
    "Add Display Name"
  );

  setAvatar(
    document.getElementById("user-avatar-sm"),
    profile.name || user.displayName || "",
    user.photoURL
  );

  // ---- MY PROFILE (my-profile.html) ----
  safeText(
    document.getElementById("profile-name"),
    profile.name || user.displayName,
    "Add Display Name"
  );

  // avatar on my-profile page has no id, so we target it safely:
  const myProfileAvatar = document.querySelector(".profile-hero .avatar-container.large .avatar-inner");
  setAvatar(myProfileAvatar, profile.name || user.displayName || "", user.photoURL);

  // Email + Residence blocks in “Identity Logistics”
  const emailSmall = findSettingSmallByLabel("Email Address");
  safeText(emailSmall, profile.email || user.email, "Add Email Address");

  const residenceSmall = findSettingSmallByLabel("Primary Residence");
  safeText(residenceSmall, profile.primaryResidence, "Add Primary Residence");

  // ---- SETTINGS (settings.html) ----
  // Your settings page uses inputs without IDs, so we grab them by order in the first group:
  const securityGroup = document.querySelectorAll(".settings-group")[0];
  if (securityGroup) {
    const nameInput = securityGroup.querySelector('input[type="text"]');
    const emailInput = securityGroup.querySelector('input[type="email"]');

    safeInput(nameInput, profile.name || user.displayName, "Add Display Name");
    safeInput(emailInput, profile.email || user.email, "Add Email Address");

    // Attach saves (blur) only on settings page
    if (document.title.toLowerCase().includes("settings")) {
      if (nameInput) {
        nameInput.addEventListener("blur", async () => {
          const newName = nameInput.value.trim();
          await updateDoc(doc(db, "users", user.uid), {
            name: newName,
            updatedAt: new Date().toISOString(),
          });
        });
      }

      if (emailInput) {
        emailInput.addEventListener("blur", async () => {
          const newEmail = emailInput.value.trim();
          // NOTE: This updates Firestore display only. Changing Auth email needs re-auth flow.
          await updateDoc(doc(db, "users", user.uid), {
            email: newEmail,
            updatedAt: new Date().toISOString(),
          });
        });
      }

      // Logistics edit items on settings page (Primary Residence / Corporate Office)
      // Your HTML shows them as: <strong>Label</strong> <span>Value</span> + edit icon.
      document.querySelectorAll(".settings-group .setting-item").forEach((item) => {
        const title = item.querySelector(".setting-info strong");
        const valueSpan = item.querySelector(".setting-info span");
        const editIcon = item.querySelector(".bx-edit-alt");

        if (!title || !valueSpan || !editIcon) return;

        const fieldMap = {
          "Primary Residence": "primaryResidence",
          "Corporate Office": "corporateOffice",
        };

        const key = fieldMap[title.textContent.trim()];
        if (!key) return;

        // hydrate placeholder style
        const current = (profile[key] || "").trim();
        valueSpan.textContent = current || `Add ${title.textContent.trim()}`;

        editIcon.style.opacity = "0.8";
        editIcon.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();

          const original = (profile[key] || "").trim();
          const next = prompt(`Update ${title.textContent.trim()}:`, original);

          if (next === null) return; // cancelled
          const cleaned = next.trim();

          await updateDoc(doc(db, "users", user.uid), {
            [key]: cleaned,
            updatedAt: new Date().toISOString(),
          });

          valueSpan.textContent = cleaned || `Add ${title.textContent.trim()}`;
        });
      });
    }
  }

  // ---- Logout (global modal uses confirm-logout) ----
  window.MobWashLogout = async () => {
    await signOut(auth);
    window.location.href = "login.html";
  };

  // Optional: personalize logout modal copy if you want
  const logoutP = document.querySelector("#logout-modal p");
  if (logoutP) {
    const nm = (profile.name || user.displayName || "").trim();
    if (nm) logoutP.textContent = `Are you sure you want to end your session, ${nm}?`;
  }
}

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    // Kick unauthenticated users out
    const publicPages = ["index.html", "login.html", "register.html"];
    const current = (location.pathname.split("/").pop() || "").toLowerCase();
    if (!publicPages.includes(current)) window.location.href = "login.html";
    return;
  }

  const profile = await ensureUserDoc(user);

  // store globally if you ever need it
  window.MobWashUser = user;
  window.MobWashProfile = profile;

  hydrateUI(user, profile);
});