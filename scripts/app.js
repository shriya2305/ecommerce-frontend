import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("loginLink");

  if (!loginLink) return; // prevents errors on pages without header

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const name = user.email.split("@")[0];

      loginLink.textContent = `Hi, ${name}`;
      loginLink.href = "#";

      loginLink.onclick = async () => {
        await signOut(auth);
        window.location.reload();
      };
    } else {
      loginLink.textContent = "Login";
      loginLink.href = "auth.html";
      loginLink.onclick = null;
    }
  });
});

/* ---------------- DATA ---------------- */

let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("searchInput");

/* ---------------- CART COUNT ---------------- */

function updateCartCount() {
  if (!cartCount) return;
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = total;
}

updateCartCount();

/* ---------------- FETCH PRODUCTS ---------------- */

if (productGrid) {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((data) => {
      allProducts = data;
      localStorage.setItem("products", JSON.stringify(allProducts));
      renderProducts(allProducts);
    });
}

/* ---------------- RENDER PRODUCTS ---------------- */

function renderProducts(products) {
  if (!productGrid) return;

  productGrid.innerHTML = "";

  products.forEach((product) => {
    const isWishlisted = wishlist.some((p) => p.id === product.id);

    productGrid.innerHTML += `
      <div class="product-card">
        <div class="product-img">
          <span class="wish" onclick="toggleWishlist(${product.id})">
            ${isWishlisted ? "❤️" : "🤍"}
          </span>

          <img src="${product.image}" loading="lazy"
               onclick="openProduct(${product.id})"
               style="cursor:pointer">
        </div>

        <div class="product-body">
          <p class="category">${product.category.toUpperCase()}</p>

          <h3 onclick="openProduct(${product.id})"
              style="cursor:pointer">
            ${product.title.slice(0, 40)}
          </h3>

          <span class="price">$${product.price}</span>

          <button class="add-btn" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });
}

/* ---------------- SEARCH ---------------- */

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allProducts.filter((product) =>
      product.title.toLowerCase().includes(query)
    );
    renderProducts(filtered);
  });
}

/* ---------------- GLOBAL FUNCTIONS (IMPORTANT) ---------------- */

window.addToCart = function (id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  const existing = cart.find((p) => p.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
};

window.openProduct = function (id) {
  window.location.href = `product.html?id=${id}`;
};

window.toggleWishlist = function (id) {
  const product = allProducts.find((p) => p.id === id);
  if (!product) return;

  if (wishlist.some((p) => p.id === id)) {
    wishlist = wishlist.filter((p) => p.id !== id);
  } else {
    wishlist.push(product);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderProducts(allProducts);
};

/* ---------------- SAFE ICON HANDLERS ---------------- */

const cartIcon = document.getElementById("cartIcon");
if (cartIcon) {
  cartIcon.onclick = () => {
    alert(`Cart Items: ${cart.length}`);
  };
}

const wishlistIcon = document.getElementById("wishlistIcon");
if (wishlistIcon) {
  wishlistIcon.onclick = () => {
    alert(`Wishlist Items: ${wishlist.length}`);
  };
}

window.addEventListener("focus", updateCartCount);
