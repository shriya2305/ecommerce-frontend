// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navMobile = document.querySelector(".nav-mobile");
  const menuIcon = document.querySelector(".menu-icon");
  const closeIcon = document.querySelector(".close-icon");

  // Toggle mobile menu
  hamburgerBtn.addEventListener("click", function () {
    navMobile.classList.toggle("active");
    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
  });

  // Close mobile menu when clicking on a link
  const navLinksMobile = document.querySelectorAll(".nav-link-mobile");
  navLinksMobile.forEach((link) => {
    link.addEventListener("click", function () {
      navMobile.classList.remove("active");
      menuIcon.classList.remove("hidden");
      closeIcon.classList.add("hidden");
    });
  });

  // Cart functionality
  const cartBtn = document.querySelector(".cart-btn");
  cartBtn.addEventListener("click", function () {
    alert("Cart clicked! (Add your cart functionality here)");
  });

  // Wishlist functionality
  const wishlistBtn = document.querySelector(".wishlist-btn");
  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", function () {
      alert("Wishlist clicked! (Add your wishlist functionality here)");
    });
  }

  // Search functionality
  const searchBtn = document.querySelector(".search-btn");
  if (searchBtn) {
    searchBtn.addEventListener("click", function () {
      alert("Search clicked! (Add your search functionality here)");
    });
  }

  // Add to cart buttons
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");
  addToCartBtns.forEach((btn, index) => {
    btn.addEventListener("click", function () {
      // Update cart badge
      const cartBadge = document.querySelector(".cart-badge");
      const currentCount = parseInt(cartBadge.textContent);
      cartBadge.textContent = currentCount + 1;

      // Visual feedback
      btn.textContent = "Added!";
      btn.style.backgroundColor = "#10b981";

      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.style.backgroundColor = "";
      }, 1500);
    });
  });
});

// Product Grid Functionality
let allProducts = [];
let currentFilter = "all";
let cart = [];

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeProductGrid();
  initializeExistingFeatures();
});

// Initialize Product Grid
async function initializeProductGrid() {
  const productGrid = document.getElementById("productGrid");
  const loadingGrid = document.getElementById("loadingGrid");
  const noProducts = document.getElementById("noProducts");
  const loadMoreContainer = document.getElementById("loadMoreContainer");

  if (!productGrid) return;

  try {
    // Show loading state
    loadingGrid.style.display = "grid";

    // Fetch products from API
    const response = await fetch("https://fakestoreapi.com/products?limit=12");
    allProducts = await response.json();

    // Hide loading state
    loadingGrid.style.display = "none";

    // Display products
    displayProducts(allProducts);

    // Show load more button
    loadMoreContainer.style.display = "block";
  } catch (error) {
    console.error("Error fetching products:", error);
    // Use fallback products
    allProducts = getFallbackProducts();
    loadingGrid.style.display = "none";
    displayProducts(allProducts);
  }

  // Setup filter buttons
  setupFilters();

  // Setup load more button
  document
    .getElementById("loadMoreBtn")
    ?.addEventListener("click", loadMoreProducts);
}

// Fallback products if API fails
function getFallbackProducts() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Premium Product ${i + 1}`,
    price: (Math.random() * 200 + 20).toFixed(2),
    category: ["electronics", "jewelery", "men's clothing", "women's clothing"][
      Math.floor(Math.random() * 4)
    ],
    rating: {
      rate: (Math.random() * 2 + 3).toFixed(1),
      count: Math.floor(Math.random() * 500),
    },
    image: `https://via.placeholder.com/300x300/9333ea/ffffff?text=Product+${
      i + 1
    }`,
  }));
}

// Display products in grid
function displayProducts(products) {
  const productGrid = document.getElementById("productGrid");
  const noProducts = document.getElementById("noProducts");

  if (products.length === 0) {
    productGrid.innerHTML = "";
    noProducts.style.display = "block";
    return;
  }

  noProducts.style.display = "none";
  productGrid.innerHTML = "";

  products.forEach((product, index) => {
    const productCard = createProductCard(product, index);
    productGrid.appendChild(productCard);
  });

  // Reinitialize Lucide icons for new elements
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

// Create product card element
function createProductCard(product, index) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.animationDelay = `${index * 50}ms`;

  const rating = product.rating || { rate: 0, count: 0 };
  const stars = generateStars(rating.rate);

  card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                <i data-lucide="heart"></i>
            </button>
            <div class="product-badge">NEW</div>
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title">${product.title}</h3>
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-count">(${rating.count})</span>
            </div>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

  return card;
}

// Generate star rating HTML
function generateStars(rating) {
  let starsHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      starsHTML += '<i data-lucide="star" class="star filled"></i>';
    } else {
      starsHTML += '<i data-lucide="star" class="star empty"></i>';
    }
  }
  return starsHTML;
}

// Setup filter buttons
function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");

      // Get filter value
      currentFilter = this.dataset.filter;

      // Filter and display products
      filterProducts();
    });
  });
}

// Filter products
function filterProducts() {
  const filtered =
    currentFilter === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === currentFilter);

  displayProducts(filtered);
}

// Add to cart function
function addToCart(productId) {
  const product = allProducts.find((p) => p.id === productId);
  if (!product) return;

  cart.push(product);

  // Update cart badge
  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    cartBadge.textContent = cart.length;
  }

  // Visual feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = "✓ Added!";
  button.classList.add("added");

  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("added");
  }, 1500);

  console.log("Cart:", cart);
}

// Toggle wishlist
function toggleWishlist(productId) {
  const button = event.target.closest(".wishlist-btn");
  button.classList.toggle("active");
  console.log("Wishlist toggled for product:", productId);
}

// Load more products
async function loadMoreProducts() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.textContent = "Loading...";
  loadMoreBtn.disabled = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, you'd fetch more products here
    alert("Load more functionality - fetch additional products from API");

    loadMoreBtn.textContent = "Load More Products";
    loadMoreBtn.disabled = false;
  } catch (error) {
    console.error("Error loading more products:", error);
    loadMoreBtn.textContent = "Load More Products";
    loadMoreBtn.disabled = false;
  }
}

// Initialize existing features
function initializeExistingFeatures() {
  // Mobile menu toggle (existing code)
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navMobile = document.querySelector(".nav-mobile");
  const menuIcon = document.querySelector(".menu-icon");
  const closeIcon = document.querySelector(".close-icon");

  if (hamburgerBtn && navMobile) {
    hamburgerBtn.addEventListener("click", function () {
      navMobile.classList.toggle("active");
      menuIcon?.classList.toggle("hidden");
      closeIcon?.classList.toggle("hidden");
    });
  }

  // Close mobile menu on link click
  const navLinksMobile = document.querySelectorAll(".nav-link-mobile");
  navLinksMobile.forEach((link) => {
    link.addEventListener("click", function () {
      navMobile?.classList.remove("active");
      menuIcon?.classList.remove("hidden");
      closeIcon?.classList.add("hidden");
    });
  });
}

// ===========================
// ADVANCED API CONFIGURATION
// ===========================

const API_CONFIG = {
  baseURL: "https://fakestoreapi.com",
  endpoints: {
    products: "/products",
    categories: "/products/categories",
    singleProduct: "/products/",
  },
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  cacheExpiry: 5 * 60 * 1000, // 5 minutes
};

// ===========================
// STATE MANAGEMENT
// ===========================

let appState = {
  products: [],
  filteredProducts: [],
  currentFilter: "all",
  cart: [],
  loading: false,
  error: null,
  apiStatus: "idle", // idle, loading, success, error
};

// ===========================
// CACHE MANAGEMENT
// ===========================

class CacheManager {
  static set(key, data) {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(key, JSON.stringify(cacheData));
      console.log(`✅ Cache saved: ${key}`);
      return true;
    } catch (error) {
      console.warn("⚠️ Cache write failed:", error);
      return false;
    }
  }

  static get(key, expiryMs = API_CONFIG.cacheExpiry) {
    try {
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const age = Date.now() - cacheData.timestamp;

      if (age < expiryMs) {
        console.log(`✅ Cache hit: ${key} (age: ${Math.round(age / 1000)}s)`);
        return cacheData.data;
      } else {
        console.log(`⏰ Cache expired: ${key}`);
        this.clear(key);
        return null;
      }
    } catch (error) {
      console.warn("⚠️ Cache read failed:", error);
      return null;
    }
  }

  static clear(key) {
    try {
      sessionStorage.removeItem(key);
      console.log(`🗑️ Cache cleared: ${key}`);
    } catch (error) {
      console.warn("⚠️ Cache clear failed:", error);
    }
  }

  static clearAll() {
    try {
      sessionStorage.clear();
      console.log("🗑️ All cache cleared");
    } catch (error) {
      console.warn("⚠️ Cache clear all failed:", error);
    }
  }
}

// ===========================
// API SERVICE WITH RETRY LOGIC
// ===========================

class APIService {
  static async fetchWithTimeout(
    url,
    options = {},
    timeout = API_CONFIG.timeout
  ) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  static async fetchWithRetry(
    url,
    options = {},
    retries = API_CONFIG.retryAttempts
  ) {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔄 API Request attempt ${i + 1}/${retries}: ${url}`);
        const response = await this.fetchWithTimeout(url, options);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`✅ API Request successful: ${url}`);
        return response;
      } catch (error) {
        console.warn(`⚠️ Attempt ${i + 1} failed:`, error.message);

        if (i === retries - 1) {
          throw error;
        }

        // Exponential backoff
        const delay = API_CONFIG.retryDelay * Math.pow(2, i);
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  static async getProducts(limit = 20, forceRefresh = false) {
    const cacheKey = `products_${limit}`;

    // Check cache first
    if (!forceRefresh) {
      const cached = CacheManager.get(cacheKey);
      if (cached) return cached;
    }

    // Fetch from API
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.products}?limit=${limit}`;
    const response = await this.fetchWithRetry(url);
    const data = await response.json();

    // Cache the results
    CacheManager.set(cacheKey, data);

    return data;
  }

  static async getCategories() {
    const cacheKey = "categories";

    const cached = CacheManager.get(cacheKey);
    if (cached) return cached;

    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.categories}`;
    const response = await this.fetchWithRetry(url);
    const data = await response.json();

    CacheManager.set(cacheKey, data);
    return data;
  }

  static async getProductById(id) {
    const url = `${API_CONFIG.baseURL}${API_CONFIG.endpoints.singleProduct}${id}`;
    const response = await this.fetchWithRetry(url);
    return response.json();
  }
}

// ===========================
// FALLBACK DATA
// ===========================

function getFallbackProducts(count = 20) {
  const categories = [
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Premium Product ${i + 1}`,
    price: (Math.random() * 200 + 20).toFixed(2),
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: {
      rate: (Math.random() * 2 + 3).toFixed(1),
      count: Math.floor(Math.random() * 500) + 50,
    },
    image: `https://via.placeholder.com/300x300/9333ea/ffffff?text=Product+${
      i + 1
    }`,
    description:
      "Premium quality product with excellent features and long-lasting durability. Perfect for everyday use.",
  }));
}

// ===========================
// PRODUCT GRID INITIALIZATION
// ===========================

async function initializeProductGrid() {
  const productGrid = document.getElementById("productGrid");
  const loadingGrid = document.getElementById("loadingGrid");
  const noProducts = document.getElementById("noProducts");
  const errorContainer = document.getElementById("errorContainer");

  if (!productGrid) return;

  try {
    updateLoadingState(true);
    hideError();

    // Fetch products with advanced error handling
    appState.products = await APIService.getProducts(20);
    appState.filteredProducts = appState.products;
    appState.apiStatus = "success";

    // Display success message
    showSuccessMessage(appState.products.length);

    // Display products
    displayProducts(appState.products);
  } catch (error) {
    console.error("❌ Fatal error fetching products:", error);
    appState.apiStatus = "error";

    // Determine error type
    let errorMessage = "Failed to load products";
    let errorType = "error";

    if (error.name === "AbortError") {
      errorMessage = "Request timeout. Your connection might be slow.";
      errorType = "timeout";
    } else if (!navigator.onLine) {
      errorMessage = "No internet connection. Showing offline data.";
      errorType = "offline";
    } else {
      errorMessage = "API temporarily unavailable. Showing cached data.";
      errorType = "api-error";
    }

    // Show error with retry option
    showError(errorMessage, errorType);

    // Use fallback products
    appState.products = getFallbackProducts(20);
    appState.filteredProducts = appState.products;
    displayProducts(appState.products);
  } finally {
    updateLoadingState(false);
  }

  // Setup filters
  setupFilters();

  // Setup connection monitoring
  setupConnectionMonitoring();
}

// ===========================
// UI HELPER FUNCTIONS
// ===========================

function updateLoadingState(isLoading) {
  const loadingGrid = document.getElementById("loadingGrid");
  const productGrid = document.getElementById("productGrid");
  const sectionBadge = document.querySelector(".section-badge");

  appState.loading = isLoading;

  if (loadingGrid) {
    loadingGrid.style.display = isLoading ? "grid" : "none";
  }

  if (productGrid) {
    productGrid.style.display = isLoading ? "none" : "grid";
  }

  if (sectionBadge && isLoading) {
    sectionBadge.innerHTML = `
            <div class="loading-spinner"></div>
            Loading Products...
        `;
  }
}

function showError(message, type = "error") {
  let errorContainer = document.getElementById("errorContainer");

  if (!errorContainer) {
    errorContainer = document.createElement("div");
    errorContainer.id = "errorContainer";
    const filterButtons = document.getElementById("filterButtons");
    filterButtons.parentNode.insertBefore(errorContainer, filterButtons);
  }

  const icons = {
    timeout: "⏱️",
    offline: "📡",
    "api-error": "⚠️",
    error: "❌",
  };

  errorContainer.innerHTML = `
        <div class="error-banner ${type}">
            <div class="error-content">
                <div class="error-icon">${icons[type] || "⚠️"}</div>
                <div class="error-message">
                    <strong>${message}</strong>
                    <p class="error-submessage">Don't worry, you can still browse our products</p>
                </div>
            </div>
            <button class="retry-btn" onclick="retryFetchProducts()">
                <i data-lucide="refresh-cw"></i>
                Retry
            </button>
        </div>
    `;

  errorContainer.style.display = "block";

  // Reinitialize icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function hideError() {
  const errorContainer = document.getElementById("errorContainer");
  if (errorContainer) {
    errorContainer.style.display = "none";
  }
}

function showSuccessMessage(count) {
  const sectionBadge = document.querySelector(".section-badge");
  if (sectionBadge) {
    sectionBadge.innerHTML = `
            <i data-lucide="trending-up"></i>
            ${count} Products Available
        `;
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
}

// ===========================
// DISPLAY FUNCTIONS
// ===========================

function displayProducts(products) {
  const productGrid = document.getElementById("productGrid");
  const noProducts = document.getElementById("noProducts");

  if (!products || products.length === 0) {
    productGrid.innerHTML = "";
    if (noProducts) noProducts.style.display = "block";
    return;
  }

  if (noProducts) noProducts.style.display = "none";
  productGrid.innerHTML = "";

  products.forEach((product, index) => {
    const productCard = createProductCard(product, index);
    productGrid.appendChild(productCard);
  });

  // Reinitialize Lucide icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Setup lazy loading for images
  setupLazyLoading();
}

function createProductCard(product, index) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.animationDelay = `${index * 50}ms`;

  const rating = product.rating || { rate: 0, count: 0 };
  const stars = generateStars(rating.rate);

  card.innerHTML = `
        <div class="product-image-container">
            <img 
                data-src="${product.image}" 
                alt="${product.title}" 
                class="product-image lazy-load" 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect fill='%23f3f4f6' width='300' height='300'/%3E%3C/svg%3E"
                onerror="this.src='https://via.placeholder.com/300x300/9333ea/ffffff?text=Image+Error'"
            >
            <button class="wishlist-btn" onclick="toggleWishlist(${product.id})" aria-label="Add to wishlist">
                <i data-lucide="heart"></i>
            </button>
            <div class="product-badge">NEW</div>
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title" title="${product.title}">${product.title}</h3>
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-count">(${rating.count})</span>
            </div>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

  return card;
}

function generateStars(rating) {
  let starsHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      starsHTML += '<i data-lucide="star" class="star filled"></i>';
    } else {
      starsHTML += '<i data-lucide="star" class="star empty"></i>';
    }
  }
  return starsHTML;
}

// ===========================
// LAZY LOADING
// ===========================

function setupLazyLoading() {
  const images = document.querySelectorAll("img.lazy-load");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy-load");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// ===========================
// FILTER FUNCTIONALITY
// ===========================

function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      appState.currentFilter = this.dataset.filter;
      filterProducts();
    });
  });
}

function filterProducts() {
  const filtered =
    appState.currentFilter === "all"
      ? appState.products
      : appState.products.filter((p) => p.category === appState.currentFilter);

  appState.filteredProducts = filtered;
  displayProducts(filtered);

  // Update badge
  showSuccessMessage(filtered.length);
}

// ===========================
// CART FUNCTIONALITY
// ===========================

function addToCart(productId) {
  const product = appState.products.find((p) => p.id === productId);
  if (!product) return;

  appState.cart.push(product);

  // Update cart badge
  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    cartBadge.textContent = appState.cart.length;
    cartBadge.classList.add("cart-pulse");
    setTimeout(() => cartBadge.classList.remove("cart-pulse"), 300);
  }

  // Visual feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = "✓ Added!";
  button.classList.add("added");
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("added");
    button.disabled = false;
  }, 1500);

  console.log("🛒 Cart updated:", appState.cart);
}

function toggleWishlist(productId) {
  const button = event.target.closest(".wishlist-btn");
  button.classList.toggle("active");
  console.log("❤️ Wishlist toggled for product:", productId);
}

// ===========================
// RETRY FUNCTIONALITY
// ===========================

async function retryFetchProducts() {
  const retryBtn = document.querySelector(".retry-btn");
  if (retryBtn) {
    retryBtn.disabled = true;
    retryBtn.innerHTML = '<div class="loading-spinner"></div> Retrying...';
  }

  await initializeProductGrid();

  if (retryBtn) {
    retryBtn.disabled = false;
    retryBtn.innerHTML = '<i data-lucide="refresh-cw"></i> Retry';
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }
}

// ===========================
// CONNECTION MONITORING
// ===========================

function setupConnectionMonitoring() {
  window.addEventListener("online", () => {
    console.log("🌐 Connection restored");
    showConnectionStatus("back online", "success");
    retryFetchProducts();
  });

  window.addEventListener("offline", () => {
    console.log("📡 Connection lost");
    showConnectionStatus("offline", "warning");
  });
}

function showConnectionStatus(status, type) {
  const toast = document.createElement("div");
  toast.className = `connection-toast ${type}`;
  toast.textContent = `You're ${status}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===========================
// INITIALIZE ON DOM LOAD
// ===========================

document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Initializing E-Commerce Application...");
  console.log("📊 API Config:", API_CONFIG);

  initializeProductGrid();
  initializeExistingFeatures();

  // Log performance metrics
  window.addEventListener("load", () => {
    const perfData = performance.getEntriesByType("navigation")[0];
    console.log(
      "⚡ Page Load Time:",
      Math.round(perfData.loadEventEnd - perfData.fetchStart) + "ms"
    );
  });
});

// Keep existing features initialization
function initializeExistingFeatures() {
  // Mobile menu toggle
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navMobile = document.querySelector(".nav-mobile");
  const menuIcon = document.querySelector(".menu-icon");
  const closeIcon = document.querySelector(".close-icon");

  if (hamburgerBtn && navMobile) {
    hamburgerBtn.addEventListener("click", function () {
      navMobile.classList.toggle("active");
      menuIcon?.classList.toggle("hidden");
      closeIcon?.classList.toggle("hidden");
    });
  }

  const navLinksMobile = document.querySelectorAll(".nav-link-mobile");
  navLinksMobile.forEach((link) => {
    link.addEventListener("click", function () {
      navMobile?.classList.remove("active");
      menuIcon?.classList.remove("hidden");
      closeIcon?.classList.add("hidden");
    });
  });
}

// Add this function to make product cards clickable
function createProductCard(product, index) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.animationDelay = `${index * 50}ms`;
  card.style.cursor = "pointer";

  // Make entire card clickable
  card.addEventListener("click", function (e) {
    // Don't navigate if clicking on add to cart button
    if (
      !e.target.closest(".add-to-cart-btn") &&
      !e.target.closest(".wishlist-btn")
    ) {
      window.location.href = `product.html?id=${product.id}`;
    }
  });

  const rating = product.rating || { rate: 0, count: 0 };
  const stars = generateStars(rating.rate);

  card.innerHTML = `
        <div class="product-image-container">
            <img 
                data-src="${product.image}" 
                alt="${product.title}" 
                class="product-image lazy-load" 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Crect fill='%23f3f4f6' width='300' height='300'/%3E%3C/svg%3E"
                onerror="this.src='https://via.placeholder.com/300x300/9333ea/ffffff?text=Image+Error'"
            >
            <button class="wishlist-btn" onclick="toggleWishlist(${product.id})" aria-label="Add to wishlist">
                <i data-lucide="heart"></i>
            </button>
            <div class="product-badge">NEW</div>
        </div>
        <div class="product-info">
            <span class="product-category">${product.category}</span>
            <h3 class="product-title" title="${product.title}">${product.title}</h3>
            <div class="product-rating">
                <div class="stars">${stars}</div>
                <span class="rating-count">(${rating.count})</span>
            </div>
            <div class="product-footer">
                <span class="product-price">$${product.price}</span>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" data-product-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

  return card;
}

// Update the addToCart function to prevent default behavior
function addToCart(productId) {
  event.stopPropagation(); // Prevent card click

  const product = appState.products.find((p) => p.id === productId);
  if (!product) return;

  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItem = {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
    quantity: 1,
    addedAt: new Date().toISOString(),
  };

  // Check if item already exists
  const existingIndex = cart.findIndex((item) => item.id === product.id);
  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update cart badge
  updateCartBadge();

  // Visual feedback
  const button = event.target;
  const originalText = button.textContent;
  button.textContent = "✓ Added!";
  button.classList.add("added");
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("added");
    button.disabled = false;
  }, 1500);

  console.log("🛒 Cart updated:", cart);
}

// Update cart badge from localStorage
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    cartBadge.textContent = totalItems;
    if (totalItems > 0) {
      cartBadge.classList.add("cart-pulse");
      setTimeout(() => cartBadge.classList.remove("cart-pulse"), 300);
    }
  }
}

// Toggle wishlist with localStorage
function toggleWishlist(productId) {
  event.stopPropagation(); // Prevent card click

  const button = event.target.closest(".wishlist-btn");
  button.classList.toggle("active");

  // Get wishlist from localStorage
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const product = appState.products.find((p) => p.id === productId);

  const index = wishlist.findIndex((item) => item.id === productId);
  if (index > -1) {
    wishlist.splice(index, 1);
    console.log("❤️ Removed from wishlist:", productId);
  } else {
    wishlist.push(product);
    console.log("❤️ Added to wishlist:", productId);
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}
