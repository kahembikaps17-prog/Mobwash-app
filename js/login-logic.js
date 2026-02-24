import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('button');

    // Visual Loading
    btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Authenticating...`;
    btn.disabled = true;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Successful login - go to the Hub
        window.location.href = "profile.html";
    } catch (error) {
        console.error("Login failed:", error);
        btn.innerHTML = "Invalid Credentials";
        btn.style.background = "#dc2626";
        
        setTimeout(() => {
            btn.innerHTML = "Sign In";
            btn.style.background = "";
            btn.disabled = false;
        }, 3000);
    }
});