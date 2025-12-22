import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

/* ---------- FORM SWITCHING ---------- */

window.showSignup = () => {
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
};

window.showLogin = () => {
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
};

/* ---------- SIGN UP ---------- */

if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    signupError.textContent = "";

    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (password !== confirm) {
      signupError.textContent = "Passwords do not match.";
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert(`Welcome ${name}! Account created successfully.`);
      showLogin();
    } catch (error) {
      signupError.textContent = error.message;
    }
  });
}

/* ---------- LOGIN ---------- */

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.textContent = "";

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "index.html";
    } catch (error) {
      loginError.textContent = error.message;
    }
  });
}
