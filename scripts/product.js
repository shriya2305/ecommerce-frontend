const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

let products = JSON.parse(localStorage.getItem("products")) || [];

let product = products.find((p) => p.id === productId);

let qty = 1;

const container = document.getElementById("productDetail");

if (!product) {
  container.innerHTML = "<p>Product not found.</p>";
} else {
  container.innerHTML = `
    <img src="${product.image}">
    <div class="product-info">
      <h1>${product.title}</h1>
      <p>${product.description}</p>
      <h2>$${product.price}</h2>

      <div class="qty">
        <button onclick="changeQty(-1)">−</button>
        <span id="qty">${qty}</span>
        <button onclick="changeQty(1)">+</button>
      </div>

      <button class="primary-btn" onclick="addToCart()">
        Add to Cart
      </button>
    </div>
  `;
}

function changeQty(val) {
  qty = Math.max(1, qty + val);
  document.getElementById("qty").textContent = qty;
}

function addToCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find((p) => p.id === product.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}
