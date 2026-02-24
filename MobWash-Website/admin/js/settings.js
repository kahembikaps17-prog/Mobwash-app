import { db } from "../../js/firebase.js";
import { doc, getDoc, setDoc }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const form = document.getElementById("settings-form");
const settingsRef = doc(db, "adminSettings", "config");

async function loadSettings() {
  const snap = await getDoc(settingsRef);

  if (snap.exists()) {
    const data = snap.data();

    document.getElementById("standard-price").value = data.standardPrice || "";
    document.getElementById("premium-price").value = data.premiumPrice || "";
    document.getElementById("max-orders").value = data.maxOrders || "";
    document.getElementById("theme-select").value = data.theme || "light";
    document.getElementById("maintenance-mode").checked = data.maintenance || false;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  await setDoc(settingsRef, {
    standardPrice: Number(document.getElementById("standard-price").value),
    premiumPrice: Number(document.getElementById("premium-price").value),
    maxOrders: Number(document.getElementById("max-orders").value),
    theme: document.getElementById("theme-select").value,
    maintenance: document.getElementById("maintenance-mode").checked
  });

  alert("Settings Updated Successfully");
});

loadSettings();
