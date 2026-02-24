import { db, auth } from "./firebase.js";

// ==========================================
// 1. SUBSCRIPTION PRICE CALCULATIONS
// ==========================================
const frequency = document.getElementById("frequency");
const powder = document.getElementById("powder");
const priceDisplay = document.getElementById("price");

export function updatePrice() {
    // Safety check: only run if we are on a page with these elements
    if (!frequency || !powder || !priceDisplay) return;

    let f = frequency.value;
    let p = powder.value;
    let total = 0;

    // This is your logic:
    if (f === "Once per week") {
        if (p === "Boom") total = 300;
        else if (p === "Aloha") total = 280;
        else total = 200;
    } else { // Twice per week
        if (p === "Boom") total = 500;
        else if (p === "Aloha") total = 450;
        else total = 300;
    }

    priceDisplay.textContent = "K" + total;
}

// Attach listeners if the elements exist
if (frequency && powder) {
    frequency.addEventListener("change", updatePrice);
    powder.addEventListener("change", updatePrice);
}

// ==========================================
// 2. SAVING DATA TO THE CLOUD (FIRESTORE)
// ==========================================

// Handle Subscription Form Submission
document.getElementById("subscriptionForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    
    if (!user) {
        alert("Please Login/Register first!");
        return;
    }

    const request = {
        uid: user.uid,
        name: document.getElementById("clientName").value,
        powder: powder.value,
        frequency: frequency.value,
        price: priceDisplay.textContent,
        status: "Pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection("subscriptions").add(request);
        alert("Subscription request sent to the cloud!");
        e.target.reset();
        updatePrice(); // Reset price display
    } catch (err) {
        console.error("Error:", err);
    }
});

// Handle On-Demand Basket Selection
export async function handleBasketSelection(sizeName, price, pickupTime) {
    const user = auth.currentUser;
    if (!user) {
        alert("Please Login to place an order!");
        window.location.href = "register.html";
        return;
    }

    try {
        await db.collection("orders").add({
            uid: user.uid,
            customerEmail: user.email,
            basketSize: sizeName,
            amount: price,
            pickupTime: pickupTime,
            status: "Pending",
            orderDate: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert(`Success! Order for ${sizeName} placed.`);
        window.location.href = "index.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// ==========================================
// 3. ADMIN DASHBOARD LISTENERS
// ==========================================
export function listenToOrders(callback) {
    db.collection("orders").orderBy("orderDate", "desc").onSnapshot(snap => {
        const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(orders);
    });
}