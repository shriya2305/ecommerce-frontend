let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const grid = document.getElementById("wishlistGrid");

if (wishlist.length === 0) {
  grid.innerHTML = "<p>Your wishlist is empty.</p>";
}

wishlist.forEach(product => {
  grid.innerHTML += `
    <div class="product-card">
      <div class="product-img">
        <img src="${product.image}" loading="lazy">
      </div>
      <div class="product-body">
        <p class="category">${product.category.toUpperCase()}</p>
        <h3>${product.title.slice(0, 40)}</h3>
        <span class="price">$${product.price}</span>
        <button class="add-btn" onclick="addToCart(${product.id})">
          Add to Cart
        </button>
      </div>
    </div>
  `;
});

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = wishlist.find(p => p.id === id);

  const existing = cart.find(p => p.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}
