import { db } from "./firebase.js";
import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Point to the "Kill Switch" in your database
const configRef = doc(db, "adminSettings", "config");

// 2. Listen for changes in real-time
onSnapshot(configRef, (snapshot) => {
    if (snapshot.exists()) {
        const isMaintenance = snapshot.data().maintenance;
        
        // Check if the user is currently on the maintenance page
        const onMaintenancePage = window.location.pathname.includes("maintenance.html");

        if (isMaintenance && !onMaintenancePage) {
            // REDIRECT: System is OFFLINE, push user to maintenance screen
            window.location.href = "maintenance.html";
        } 
        else if (!isMaintenance && onMaintenancePage) {
            // RESTORE: System is back ONLINE, send user back to home
            window.location.href = "index.html";
        }
    }
});