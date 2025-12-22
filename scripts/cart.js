const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalEl.textContent = "0";
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" width="80" />
        <div>
          <h4>${item.title.slice(0, 40)}</h4>
          <p>$${item.price} × ${item.qty}</p>
        </div>
        <button onclick="removeItem(${index})">❌</button>
      </div>
    `;
  });

  cartTotalEl.textContent = total.toFixed(2);
  checkoutBtn.disabled = false;
}

window.removeItem = function (index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

checkoutBtn.onclick = () => {
  window.location.href = "checkout.html";
};

renderCart();

checkoutBtn.disabled = cart.length === 0;
checkoutBtn.style.opacity = cart.length === 0 ? "0.5" : "1";
checkoutBtn.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";

import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

checkoutBtn.onclick = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "auth.html";
    } else {
      window.location.href = "checkout.html";
    }
  });
};
