let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsEl = document.getElementById("cartItems");
const totalItemsEl = document.getElementById("totalItems");
const totalPriceEl = document.getElementById("totalPrice");

const checkoutBtn = document.getElementById("checkoutBtn");

function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Your cart is empty.</p>";
    totalItemsEl.textContent = 0;
    totalPriceEl.textContent = 0;
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((item) => {
    totalItems += item.qty;
    totalPrice += item.price * item.qty;

    cartItemsEl.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" />
        <div class="cart-info">
          <h3>${item.title}</h3>
          <p>$${item.price}</p>

          <div class="cart-actions">
            <button onclick="changeQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeItem(${item.id})">
              Remove
            </button>
          </div>
        </div>
      </div>
    `;
  });

  totalItemsEl.textContent = totalItems;
  totalPriceEl.textContent = totalPrice.toFixed(2);
}

function changeQty(id, delta) {
  const item = cart.find((p) => p.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((p) => p.id !== id);
  }

  saveAndRender();
}

function removeItem(id) {
  cart = cart.filter((p) => p.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
checkoutBtn.disabled = cart.length === 0;
checkoutBtn.style.opacity = cart.length === 0 ? "0.5" : "1";
checkoutBtn.style.cursor = cart.length === 0 ? "not-allowed" : "pointer";

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  window.location.href = "checkout.html";
});
