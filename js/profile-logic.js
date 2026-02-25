// js/profile-logic.js
import { auth, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

auth.onAuthStateChanged((user) => {
  if (!user) return; // session.js already handles redirect
  handleOrderMonitor(user);
});

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
      if (statusEl) statusEl.innerText = (order.status || "Processing").toUpperCase();

      if ((order.status || "").toLowerCase() !== "delivered" && hubLink) {
        hubLink.classList.add("hub-active-pulse");
      }
    } else {
      section.style.display = "none";
    }
  });
}