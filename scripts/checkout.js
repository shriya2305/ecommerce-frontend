const cart = JSON.parse(localStorage.getItem("cart")) || [];
const summaryItems = document.getElementById("summaryItems");
const summaryTotal = document.getElementById("summaryTotal");
const checkoutForm = document.getElementById("checkoutForm");

if (cart.length === 0) {
  summaryItems.innerHTML = "<p>Your cart is empty.</p>";
  checkoutForm.style.display = "none";
}

let total = 0;

cart.forEach((item) => {
  const itemTotal = item.price * item.qty;
  total += itemTotal;

  summaryItems.innerHTML += `
    <div class="summary-item">
      <span>
        ${item.title.slice(0, 25)}
        (${item.size}, ${item.color}) × ${item.qty}
      </span>
      <span>$${itemTotal.toFixed(2)}</span>
    </div>
  `;
});

summaryTotal.textContent = total.toFixed(2);

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  alert("Order placed successfully!");

  // Clear cart
  localStorage.removeItem("cart");

  // Redirect to home
  window.location.href = "index.html";
});
