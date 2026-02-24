// js/admin-auth.js
import { auth } from "../../js/firebase.js";

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Getting values directly from the IDs in your HTML
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                alert("Login Successful!");
                window.location.href = "admin.html";
            })
            .catch(err => {
                console.error(err);
                alert("Login Failed: " + err.message);
            });
    });
}