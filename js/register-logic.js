import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = e.target.querySelector('button');

    // Start Loading State
    btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Welcoming Member...`;
    btn.disabled = true;

    try {
        // 1. Create the account in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Attach their Full Name to the Auth Profile
        await updateProfile(user, { displayName: name });

        // 3. Create a User Document in Firestore for Subscriptions/History
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            membership: "Standard", // Default level
            createdAt: new Date().toISOString()
        });

        // 4. Success! Redirect to Profile/Hub
        window.location.href = "profile.html";

    } catch (error) {
        console.error("Registration failed FULL ERROR:", error);
        alert(`Signup failed ${error.code}\n${error.message}`);
        btn.innerHTML = "Error. Try Again";
        btn.style.background = "#dc2626";
        btn.disabled = false;
        
        
    }
});