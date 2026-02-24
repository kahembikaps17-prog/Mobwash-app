// js/admin-logic.js
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    // Not logged in → kick out
    window.location.replace("admin-login.html");
  }
});

import { db } from "./firebase.js";
import {
    collection,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔐 Protect Admin Page
firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        window.location.href = "admin-login.html";
    }
});

// DOM Elements
const ordersBody = document.getElementById("orders-body");
const totalOrdersCount = document.getElementById("total-orders-count");
const pendingCount = document.getElementById("pending-count");
const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("sidebar-toggle");
const main = document.getElementById("main-content");

// Sidebar Toggle
toggle?.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    main.classList.toggle("expanded");
});

// Load Dashboard Data
async function loadDashboard() {
    try {
        const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
        const snapshot = await getDocs(q);

        ordersBody.innerHTML = "";
        let total = 0;
        let pending = 0;

        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            total++;

            if (data.status === "pending") pending++;

            const row = `
                <tr>
                    <td>${data.customerEmail || "Unknown"}</td>
                    <td>${data.plan || "Standard"}</td>
                    <td>${data.status}</td>
                    <td>${data.orderDate?.toDate().toLocaleDateString() || "New"}</td>
                    <td>
                        <button onclick="handleManageOrder('${docSnap.id}')">
                            Complete
                        </button>
                    </td>
                </tr>
            `;
            ordersBody.innerHTML += row;
        });

        totalOrdersCount.innerText = total;
        pendingCount.innerText = pending;

    } catch (err) {
        console.error("Dashboard Error:", err);
    }
}

window.handleManageOrder = async (id) => {
    if (!confirm("Mark order as completed?")) return;

    await updateDoc(doc(db, "orders", id), {
        status: "completed"
    });

    loadDashboard();
};

// Initial Load
loadDashboard();
