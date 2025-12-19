const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const loginError = document.getElementById("loginError");
const signupError = document.getElementById("signupError");

/* SWITCHING */
function showSignup() {
  loginForm.classList.remove("active");
  signupForm.classList.add("active");
}

function showLogin() {
  signupForm.classList.remove("active");
  loginForm.classList.add("active");
}

/* EMAIL VALIDATION */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* PASSWORD VALIDATION */
function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

/* SIGNUP */
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("confirmPassword").value;

  if (!isValidEmail(email)) {
    signupError.textContent = "Invalid email format.";
    return;
  }

  if (!isStrongPassword(password)) {
    signupError.textContent =
      "Password must be 8+ chars with uppercase, lowercase & number.";
    return;
  }

  if (password !== confirm) {
    signupError.textContent = "Passwords do not match.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find((u) => u.email === email)) {
    signupError.textContent = "User already exists.";
    return;
  }

  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Account created successfully!");
  showLogin();
});

/* LOGIN */
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    loginError.textContent = "Invalid email or password.";
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "index.html";
});
