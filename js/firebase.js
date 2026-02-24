// Import the Firebase SDKs from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg4g3rRUJzgYg1jNgQubbnVCt5kazgJFs",
  authDomain: "mobwash-laundry-care.firebaseapp.com",
  projectId: "mobwash-laundry-care",
  storageBucket: "mobwash-laundry-care.firebasestorage.app",
  messagingSenderId: "27621459469",
  appId: "1:27621459469:web:4e4ae80ba83639062c7744"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services to use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);