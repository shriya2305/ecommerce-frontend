import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

window.showSignup = () => {
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
};

window.showLogin = () => {
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
};

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Account created!");
      showLogin();
    })
    .catch((error) => {
      signupError.textContent = error.message;
    });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => (window.location.href = "index.html"))
    .catch((error) => {
      loginError.textContent = error.message;
    });
});
