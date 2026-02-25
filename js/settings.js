// js/settings.js
import { auth, db } from "./firebase.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("settings-name");
  const emailInput = document.getElementById("settings-email");

  // Email is always from auth
  auth.onAuthStateChanged((user) => {
    if (!user) return;
    if (emailInput) emailInput.value = user.email || "";
    if (nameInput && !nameInput.value) nameInput.value = user.displayName || "";
  });

  // Save display name when user leaves the input
  if (nameInput) {
    nameInput.addEventListener("blur", async () => {
      const user = auth.currentUser;
      if (!user) return;

      const newName = nameInput.value.trim();
      if (!newName) {
        nameInput.value = user.displayName || "";
        return;
      }

      try {
        // 1) Update Firebase Auth displayName
        await updateProfile(user, { displayName: newName });

        // 2) Also store in Firestore (optional but good)
        await setDoc(
          doc(db, "users", user.uid),
          { name: newName },
          { merge: true }
        );

        navigator.vibrate?.(10);
      } catch (err) {
        console.error("Failed to save name:", err);
      }
    });

    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") nameInput.blur();
    });
  }
});