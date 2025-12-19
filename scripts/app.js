let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const searchInput = document.getElementById("searchInput");

updateCartCount();

fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    //  ADD THIS LINE HERE (STEP 4 STORAGE)
    localStorage.setItem("products", JSON.stringify(allProducts));

    renderProducts(allProducts);
  });

function renderProducts(products) {
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

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allProducts.filter((product) =>
    product.title.toLowerCase().includes(query)
  );
  renderProducts(filtered);
});

function addToCart(id) {
  const product = allProducts.find((p) => p.id === id);
  const existing = cart.find((p) => p.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = total;
}

function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

function toggleWishlist(id) {
  const product = allProducts.find((p) => p.id === id);

  if (wishlist.some((p) => p.id === id)) {
    wishlist = wishlist.filter((p) => p.id !== id);
  } else {
    wishlist.push(product);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  renderProducts(allProducts);
}
document.getElementById("cartIcon").onclick = () => {
  alert(`Cart Items: ${cart.length}`);
};

document.getElementById("wishlistIcon").onclick = () => {
  alert(`Wishlist Items: ${wishlist.length}`);
};

window.addEventListener("focus", updateCartCount);
