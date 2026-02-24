import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const button = document.querySelector("button");

  button.textContent = "Authenticating...";
  button.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin/dashboard.html";
  } catch (error) {
    alert(error.message);
    button.textContent = "Login";
    button.disabled = false;
  }
});
