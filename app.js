// INITIAL SEED DATABASE (MOCKS + PURO SCRAPED PRODUCTS)
const INITIAL_PRODUCTS = [
    {
        id: 1,
        name: "Zapatillas Puro Art",
        brand: "Puro",
        category: "calzado",
        subcategory: "zapatillas",
        price: 135000,
        originalPrice: 168750,
        image: "assets/puro_sneakers.png",
        labels: ["3 cuotas sin interés", "Envío gratis", "20% OFF"],
        sizes: [36, 37, 38, 39, 40],
        stock: 12
    },
    {
        id: 2,
        name: "Cartera Agosti Mandala",
        brand: "Antonia Agosti",
        category: "bolsos-y-mochilas",
        subcategory: "carteras",
        price: 168900,
        image: "assets/agosti_bag.png",
        labels: ["Cuotas sin interés", "New In!"],
        sizes: ["Único"],
        stock: 5
    },
    {
        id: 3,
        name: "Borcegos Winndia Vintage",
        brand: "Winndia",
        category: "calzado",
        subcategory: "botas",
        price: 145600,
        originalPrice: 182000,
        image: "assets/winndia_boots.png",
        labels: ["Envío gratis", "20% OFF"],
        sizes: [36, 37, 38, 39],
        stock: 8
    },
    {
        id: 182601807,
        name: "Zapatillas Ochenta y Seis - Puro",
        brand: "Puro",
        category: "calzado",
        subcategory: "zapatillas",
        price: 105900,
        originalPrice: null,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/11-bb2a2b9b9e3c0143cf16700173306641-640-01-6d8e37f72f9d68374316941804911202-1024-1024.webp",
        labels: ["3 cuotas sin interés", "Envío gratis"],
        sizes: [36, 37, 38, 39, 40],
        stock: 15
    },
    {
        id: 251443813,
        name: "Zapatillas Puro Yogui Sincronia - Puro",
        brand: "Puro",
        category: "calzado",
        subcategory: "zapatillas",
        price: 139000,
        originalPrice: null,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/458194e0-4d0d-42c1-ac00-dbb9c9c738dc-169bf15d0af1b298e817374713176465-1024-1024.webp",
        labels: ["3 cuotas sin interés", "Envío gratis"],
        sizes: [36, 37, 38, 39, 40],
        stock: 6
    },
    {
        id: 218644172,
        name: "Zapatilla Retro Flow Indonesia - Puro",
        brand: "Puro",
        category: "calzado",
        subcategory: "zapatillas",
        price: 189000,
        originalPrice: null,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/462538177_1008224831062341_6245104394471684021_n-195da95026544d346217301480909692-1024-1024.webp",
        labels: ["3 cuotas sin interés", "Envío gratis"],
        sizes: [36, 37, 38, 39, 40],
        stock: 10
    },
    {
        id: 182611440,
        name: "Botas Chavo del Diecisiete - Puro",
        brand: "Puro",
        category: "calzado",
        subcategory: "botas",
        price: 39997,
        originalPrice: 119990,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/31-534d33010b1888d6c116700173309147-640-01-a9f3393ebd1b1c8b5816941804912526-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: [36, 37, 38, 39, 40],
        stock: 0
    },
    {
        id: 260949996,
        name: "Llavero Clap Ambar - Puro",
        brand: "Puro",
        category: "accesorios",
        subcategory: "llaveros",
        price: 3000,
        originalPrice: 9000,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/captura_de_pantalla_2023-09-04_a_la_s_12-16-04-16474fb81ef0e854fa16938405908500-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: ["Único"],
        stock: 25
    },
    {
        id: 260949699,
        name: "Llavero Clap Tulsi - Puro",
        brand: "Puro",
        category: "accesorios",
        subcategory: "llaveros",
        price: 3000,
        originalPrice: 9000,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/captura_de_pantalla_2023-09-04_a_la_s_12-14-36-5d6c8b939fa5a9390c16938405105260-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: ["Único"],
        stock: 14
    },
    {
        id: 260949183,
        name: "Llavero Clap Matcha - Puro",
        brand: "Puro",
        category: "accesorios",
        subcategory: "llaveros",
        price: 3000,
        originalPrice: 9000,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/captura_de_pantalla_2023-09-04_a_la_s_12-11-20-8025ff7480cd01235b16938403328325-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: ["Único"],
        stock: 18
    },
    {
        id: 260947504,
        name: "Llavero Clap Sandalo - Puro",
        brand: "Puro",
        category: "accesorios",
        subcategory: "llaveros",
        price: 3000,
        originalPrice: 9000,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/captura_de_pantalla_2023-09-04_a_la_s_12-08-41-ec6c6508fa5c56c2d416938401314959-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: ["Único"],
        stock: 22
    },
    {
        id: 260944090,
        name: "Cartuchera Bella Botánica - Puro",
        brand: "Puro",
        category: "accesorios",
        subcategory: "cartucheras",
        price: 6333,
        originalPrice: 19000,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/captura_de_pantalla_2023-09-04_a_la_s_12-03-36-ac02302e1c9fe807e116938398468758-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: ["Único"],
        stock: 30
    },
    {
        id: 260943387,
        name: "Cartuchera Bella Liverpool - Puro",
        brand: "Puro",
        category: "accesorios",
        subcategory: "cartucheras",
        price: 6333,
        originalPrice: 19000,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/captura_de_pantalla_2023-09-04_a_la_s_12-00-50-6d405204ef0528271716938397131427-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: ["Único"],
        stock: 20
    },
    {
        id: 260942209,
        name: "Cartuchera Bella Koi - Puro",
        brand: "Puro",
        category: "accesorios",
        subcategory: "cartucheras",
        price: 6333,
        originalPrice: 19000,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/captura_de_pantalla_2023-09-04_a_la_s_11-58-17-5ab162624cf5d3a5ea16938395232262-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: ["Único"],
        stock: 15
    },
    {
        id: 260891298,
        name: "Billetera Pachi Frida - Puro",
        brand: "Puro",
        category: "accesorios",
        subcategory: "billeteras",
        price: 11667,
        originalPrice: 35000,
        image: "https://dcdn-us.mitiendanube.com/stores/001/552/027/products/captura_de_pantalla_2023-09-04_a_la_s_11-47-59-994df511bc64e488d516938389657065-1024-1024.webp",
        labels: ["3 cuotas sin interés", "67% OFF"],
        sizes: ["Único"],
        stock: 9
    }
];

// STATE MANAGEMENT
let db = null;
let ALL_PRODUCTS = []; // Runtime memory of products
let cart = JSON.parse(localStorage.getItem('tosco_cart')) || [];
let activeCategory = 'all';
let activeSubcategory = '';
let activeBrand = '';
let activeSearchQuery = '';
let apiShippingRates = {
    Andreani: 9500,
    'Correo Argentino': 7800
};

// DOM ELEMENTS
const productsGrid = document.getElementById('products-grid');
const cartDrawer = document.getElementById('cart-drawer');
const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');

const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenuClose = document.getElementById('mobile-menu-close');

const cartCounter = document.getElementById('cart-counter');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalEl = document.getElementById('cart-total');

const shippingStatusEl = document.getElementById('shipping-status');
const shippingProgressEl = document.getElementById('shipping-progress');
const shippingHintEl = document.getElementById('shipping-hint');

const searchToggle = document.getElementById('search-toggle');
const searchBox = document.getElementById('search-box');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

// AI Chat DOM elements
const aiBubble = document.getElementById('ai-chat-bubble');
const aiDrawer = document.getElementById('ai-chat-drawer');
const aiClose = document.getElementById('ai-chat-close');
const aiMessagesContainer = document.getElementById('ai-messages-container');
const aiInput = document.getElementById('ai-input');
const aiSendBtn = document.getElementById('ai-send-btn');

// Client Checkout Modal DOM Elements
const checkoutModalContainer = document.getElementById('checkout-modal-container');
const checkoutForm = document.getElementById('checkout-form');
const checkoutCloseBtn = document.getElementById('checkout-close-btn');
const checkoutCancelBtn = document.getElementById('checkout-cancel-btn');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutShipping = document.getElementById('checkout-shipping');
const checkoutTotal = document.getElementById('checkout-total');

// ORDER DB CONTROLLER
function dbPutOrder(order) {
    return new Promise((resolve) => {
        const transaction = db.transaction('orders', 'readwrite');
        const store = transaction.objectStore('orders');
        const request = store.put(order);

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
}

// INDEXEDDB CONTROLLER
function dbInit() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ToscoStoreDB', 2);

        request.onupgradeneeded = (e) => {
            const database = e.target.result;
            if (!database.objectStoreNames.contains('products')) {
                database.createObjectStore('products', { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains('orders')) {
                database.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (e) => {
            db = e.target.result;
            // Seed check
            const transaction = db.transaction('products', 'readwrite');
            const store = transaction.objectStore('products');
            const countRequest = store.count();

            countRequest.onsuccess = () => {
                if (countRequest.result === 0) {
                    // Seed initial products
                    INITIAL_PRODUCTS.forEach(p => {
                        if (p.stock === undefined) p.stock = 10;
                        store.put(p);
                    });
                    console.log("Database seeded with default products.");
                }
                resolve();
            };
        };

        request.onerror = (e) => {
            reject(e.target.error);
        };
    });
}

function dbGetAllProducts() {
    return new Promise((resolve) => {
        const transaction = db.transaction('products', 'readonly');
        const store = transaction.objectStore('products');
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };
    });
}

function dbPutProduct(product) {
    return new Promise((resolve) => {
        const transaction = db.transaction('products', 'readwrite');
        const store = transaction.objectStore('products');
        const request = store.put(product);

        request.onsuccess = () => {
            resolve();
        };
    });
}

function dbDeleteProduct(id) {
    return new Promise((resolve) => {
        const transaction = db.transaction('products', 'readwrite');
        const store = transaction.objectStore('products');
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };
    });
}

function dbClearAll() {
    return new Promise((resolve) => {
        const transaction = db.transaction('products', 'readwrite');
        const store = transaction.objectStore('products');
        const request = store.clear();

        request.onsuccess = () => {
            resolve();
        };
    });
}

// APPLY CUSTOM APPEARANCE FROM LOCALSTORAGE
function applyCustomAppearance() {
    const customLogo = localStorage.getItem('tosco_custom_logo');
    const customHero = localStorage.getItem('tosco_custom_hero');
    const customTicker = localStorage.getItem('tosco_custom_ticker');

    if (customLogo) {
        const logoImg = document.getElementById('store-logo-img');
        if (logoImg) logoImg.src = customLogo;
    }
    if (customHero) {
        const heroBg = document.getElementById('hero-slide-bg');
        if (heroBg) heroBg.style.backgroundImage = `url('${customHero}')`;
    }
    if (customTicker) {
        const trackContainer = document.getElementById('promo-track-container');
        if (trackContainer) {
            trackContainer.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const span1 = document.createElement('span');
                span1.className = 'promo-item';
                span1.innerText = `- ${customTicker} -`;
                trackContainer.appendChild(span1);
            }
        }
    }
}

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', async () => {
    try {
        applyCustomAppearance();
        await dbInit();
        await refreshLocalState();
        updateCartUI();
        setupEventListeners();
    } catch (err) {
        console.error("Error starting database: ", err);
        // Fallback to offline memory
        ALL_PRODUCTS = INITIAL_PRODUCTS;
        applyCustomAppearance();
        renderProducts();
        updateCartUI();
        setupEventListeners();
    }
});

async function refreshLocalState() {
    ALL_PRODUCTS = await dbGetAllProducts();
    renderProducts();
}

// EVENT LISTENERS
function setupEventListeners() {
    // Drawer handlers
    cartToggle.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    
    mobileMenuToggle.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    
    drawerOverlay.addEventListener('click', () => {
        closeCart();
        closeMobileMenu();
        closeAiChat();
        closeCheckoutModal();
    });

    // AI Chat UI Toggles
    aiBubble.addEventListener('click', openAiChat);
    aiClose.addEventListener('click', closeAiChat);
    aiSendBtn.addEventListener('click', sendAiMessage);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendAiMessage();
    });

    // Search Toggle
    searchToggle.addEventListener('click', () => {
        searchBox.style.display = searchBox.style.display === 'none' ? 'block' : 'none';
        if (searchBox.style.display === 'block') {
            searchInput.focus();
        }
    });

    // Search Logic
    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeSearch();
    });

    // Sticky Scroll Header Look
    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Client Checkout Modal Listeners
    checkoutCloseBtn.addEventListener('click', closeCheckoutModal);
    checkoutCancelBtn.addEventListener('click', closeCheckoutModal);
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    document.querySelectorAll('input[name="shipping-carrier"]').forEach(radio => {
        radio.addEventListener('change', updateCheckoutTotals);
    });

    const zipInput = document.getElementById('checkout-zip');
    if (zipInput) {
        zipInput.addEventListener('input', async () => {
            const zipVal = zipInput.value.trim();
            if (zipVal.length >= 4) {
                try {
                    const response = await fetch('/api/cotizar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ zip: zipVal })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        if (data && data.options) {
                            data.options.forEach(opt => {
                                if (opt.carrier.toLowerCase().includes('andreani')) {
                                    apiShippingRates.Andreani = opt.cost;
                                } else if (opt.carrier.toLowerCase().includes('correo') || opt.carrier.toLowerCase().includes('argentino')) {
                                    apiShippingRates['Correo Argentino'] = opt.cost;
                                }
                            });
                            updateCheckoutTotals();
                        }
                    }
                } catch (err) {
                    console.error("Error fetching rates: ", err);
                }
            }
        });
    }
}



// RENDER MAIN WEB CATALOG
function renderProducts() {
    productsGrid.innerHTML = '';
    
    // Filtering logic cascade
    let filtered = ALL_PRODUCTS;
    
    if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategory);
    }
    
    if (activeSubcategory) {
        filtered = filtered.filter(p => p.subcategory === activeSubcategory);
    }

    if (activeBrand) {
        filtered = filtered.filter(p => p.brand === activeBrand);
    }
    
    if (activeSearchQuery) {
        const query = activeSearchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.brand.toLowerCase().includes(query) ||
            p.subcategory.toLowerCase().includes(query)
        );
    }

    if (filtered.length === 0) {
        productsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--gray-dark); font-family: var(--heading-font); font-style: italic;">No se encontraron productos en esta sección.</div>`;
        return;
    }

    filtered.forEach(p => {
        const labelsHtml = p.labels.map(l => `<span class="label-pill ${l.toLowerCase().includes('envío') || l.toLowerCase().includes('gratis') ? 'free-shipping' : 'offer'}">${l}</span>`).join('');
        
        const priceHtml = p.originalPrice 
            ? `<div class="product-price">
                 <span class="original-price" style="text-decoration: line-through; color: var(--gray-dark); margin-right: 8px; font-size: 13px;">$${p.originalPrice.toLocaleString('es-AR')}</span>
                 <span style="color: #c0392b; font-weight: 700;">$${p.price.toLocaleString('es-AR')}</span>
               </div>`
            : `<div class="product-price">$${p.price.toLocaleString('es-AR')}</div>`;

        // Check if out of stock
        const isOutOfStock = p.stock !== undefined && p.stock <= 0;
        const outOfStockOverlay = isOutOfStock ? `<div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(255,255,255,0.6); display:flex; align-items:center; justify-content:center; font-family:var(--heading-font); font-weight:bold; color:#c0392b; font-size:14px; letter-spacing:1px; z-index:3;">SIN STOCK</div>` : '';

        const card = document.createElement('div');
        card.className = 'product-card animate-fade';
        card.innerHTML = `
            <div class="product-image-wrapper">
                <div class="product-labels">${labelsHtml}</div>
                ${outOfStockOverlay}
                <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='assets/hero_tosco.png'">
            </div>
            <div class="product-info">
                <div class="product-category">${p.brand} | ${p.subcategory}</div>
                <h3 class="product-name">${p.name}</h3>
                ${priceHtml}
                <button class="product-action-btn" onclick="addToCart(${p.id})" ${isOutOfStock ? 'disabled style="background:var(--gray-medium); color:var(--gray-dark); cursor:not-allowed;"' : ''}>
                    ${isOutOfStock ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// DYNAMIC FILTER TRIGGERS
window.setCatalogFilter = function(category) {
    activeCategory = category;
    activeSubcategory = '';
    activeBrand = '';
    activeSearchQuery = '';
    
    // Update active filter UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (category === 'all' && btn.innerText.toLowerCase().includes('todos')) btn.classList.add('active');
        if (category === 'calzado' && btn.innerText.toLowerCase().includes('calzado')) btn.classList.add('active');
        if (category === 'bolsos-y-mochilas' && btn.innerText.toLowerCase().includes('bolsos')) btn.classList.add('active');
        if (category === 'accesorios' && btn.innerText.toLowerCase().includes('accesorios')) btn.classList.add('active');
        if (category === 'indumentaria' && btn.innerText.toLowerCase().includes('indumentaria')) btn.classList.add('active');
        if (category === 'terra' && btn.innerText.toLowerCase().includes('terra')) btn.classList.add('active');
    });

    renderProducts();
    scrollToCatalog();
};

window.setCatalogSubcategory = function(subcat) {
    activeSubcategory = subcat;
    activeCategory = 'all';
    activeBrand = '';
    activeSearchQuery = '';
    renderProducts();
    scrollToCatalog();
};

window.setCatalogBrand = function(brand) {
    activeBrand = brand;
    activeCategory = 'all';
    activeSubcategory = '';
    activeSearchQuery = '';
    renderProducts();
    scrollToCatalog();
};

function executeSearch() {
    activeSearchQuery = searchInput.value;
    renderProducts();
    scrollToCatalog();
}

function scrollToCatalog() {
    const catalog = document.getElementById('catalog-section');
    if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth' });
    }
}

// CART HANDLERS
window.addToCart = function(productId) {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    if (product.stock !== undefined && product.stock <= 0) {
        alert("¡Lo sentimos! Este producto se encuentra sin stock en este momento.");
        return;
    }

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    openCart();
};

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.innerText = totalItems;

    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fa-solid fa-bag-shopping" style="font-size: 40px; color: var(--gray-dark); margin-bottom: 15px; display: block;"></i>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        cartTotalEl.innerText = "$0";
        updateShippingProgress(0);
        return;
    }

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='assets/hero_tosco.png'">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-price">$${(item.price * item.quantity).toLocaleString('es-AR')}</div>
                <div class="cart-item-quantity-control">
                    <button class="qty-btn" onclick="adjustQuantity(${item.id}, -1)">-</button>
                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="adjustQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeCartItem(${item.id})">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotalEl.innerText = `$${subtotal.toLocaleString('es-AR')}`;
    updateShippingProgress(subtotal);
}

window.adjustQuantity = function(productId, amount) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
        removeCartItem(productId);
    } else {
        saveCart();
        updateCartUI();
    }
};

window.removeCartItem = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('tosco_cart', JSON.stringify(cart));
}

// DRAWER ACTIONS
function openCart() {
    cartDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
}

function closeCart() {
    cartDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
}

// MOBILE MENU ACTIONS
function openMobileMenu() {
    mobileMenuDrawer.style.left = "0";
    drawerOverlay.classList.add('active');
}

window.closeMobileMenu = function() {
    mobileMenuDrawer.style.left = "-450px";
    drawerOverlay.classList.remove('active');
}

// AI CHAT ACTIONS
function openAiChat() {
    aiDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
}

function closeAiChat() {
    aiDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
}

// SIMULATED AI CHAT RESPONSES
function sendAiMessage() {
    const message = aiInput.value.trim();
    if (!message) return;

    appendChatMessage(message, 'user');
    aiInput.value = '';

    setTimeout(() => {
        let aiResponse = "No estoy seguro de haber entendido, pero puedes hablar directamente con nuestro equipo de atención al cliente haciendo clic en el botón de WhatsApp abajo.";
        const lowercaseMsg = message.toLowerCase();

        if (lowercaseMsg.includes('envio') || lowercaseMsg.includes('gratis') || lowercaseMsg.includes('costo')) {
            aiResponse = "¡Sí! El envío es **completamente gratuito** en compras que superen los **$250.000**. Puedes ver tu progreso en la barra superior dentro de tu carrito de compras.";
        } else if (lowercaseMsg.includes('cuotas') || lowercaseMsg.includes('pago') || lowercaseMsg.includes('interes')) {
            aiResponse = "Ofrecemos **3 cuotas sin interés** en todos los productos de nuestro catálogo. Aceptamos tarjetas Visa, Mastercard, American Express y transferencias bancarias.";
        } else if (lowercaseMsg.includes('hola') || lowercaseMsg.includes('buenos dias') || lowercaseMsg.includes('buenas tardes')) {
            aiResponse = "¡Hola! ¿Cómo estás? Estoy aquí para ayudarte a elegir tus productos de **Tosco Almacén de Moda**. ¿Qué estás buscando hoy?";
        } else if (lowercaseMsg.includes('talle') || lowercaseMsg.includes('talla') || lowercaseMsg.includes('medida')) {
            aiResponse = "En cada tarjeta de producto mostramos los talles disponibles. Si necesitas ayuda con las medidas exactas de alguna prenda de *Puro* o *Winndia*, haz clic en el botón de WhatsApp y un humano te asesorará.";
        } else if (lowercaseMsg.includes('puro') || lowercaseMsg.includes('agosti') || lowercaseMsg.includes('winndia')) {
            aiResponse = "¡Excelentes marcas! En **Tosco** somos distribuidores oficiales de *Puro* (zapatillas artísticas), *Antonia Agosti* (carteras y accesorios de diseño) y *Winndia* (calzado premium de cuero).";
        }

        appendChatMessage(aiResponse, 'ai');
    }, 1000);
}

function appendChatMessage(text, sender) {
    const msgEl = document.createElement('div');
    msgEl.className = `chat-bubble ${sender}`;
    msgEl.innerHTML = text;
    aiMessagesContainer.appendChild(msgEl);
    aiMessagesContainer.scrollTop = aiMessagesContainer.scrollHeight;
}

// SHIPPING CALCULATION
const SHIPPING_LIMIT = 250000;

function updateShippingProgress(subtotal) {
    if (subtotal === 0) {
        shippingStatusEl.innerText = "";
        shippingProgressEl.style.width = "0%";
        shippingHintEl.innerText = "Envío gratis superando los $250.000";
        return;
    }

    if (subtotal >= SHIPPING_LIMIT) {
        shippingStatusEl.innerText = "¡Tenés Envío Gratis!";
        shippingStatusEl.style.color = "#50664c";
        shippingProgressEl.style.width = "100%";
        shippingHintEl.innerText = "¡Felicitaciones! Has calificado para envío gratuito.";
    } else {
        const remaining = SHIPPING_LIMIT - subtotal;
        const percent = Math.min((subtotal / SHIPPING_LIMIT) * 100, 100);
        shippingStatusEl.innerText = `$${remaining.toLocaleString('es-AR')} restan`;
        shippingStatusEl.style.color = "var(--main-foreground)";
        shippingProgressEl.style.width = `${percent}%`;
        shippingHintEl.innerText = `¡Estás a $${remaining.toLocaleString('es-AR')} de conseguir envío gratis!`;
    }
}

// Reset cart, save it, update cart UI and refresh database state
window.openCheckoutModal = function() {
    checkoutModalContainer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    updateCheckoutTotals();
};

window.closeCheckoutModal = function() {
    checkoutModalContainer.style.display = 'none';
    document.body.style.overflow = '';
};

function updateCheckoutTotals() {
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    // Check if shipping is free (limit $250.000)
    let shippingCost = 0;
    const selectedCarrier = document.querySelector('input[name="shipping-carrier"]:checked').value;
    
    const isFree = subtotal >= 250000;
    const andreaniCost = isFree ? 0 : (apiShippingRates.Andreani || 9500);
    const correoCost = isFree ? 0 : (apiShippingRates['Correo Argentino'] || 7800);

    document.getElementById('andreani-cost-display').innerText = isFree ? "Gratis" : `$${andreaniCost.toLocaleString('es-AR')}`;
    document.getElementById('correo-cost-display').innerText = isFree ? "Gratis" : `$${correoCost.toLocaleString('es-AR')}`;

    shippingCost = selectedCarrier === 'Andreani' ? andreaniCost : correoCost;

    checkoutSubtotal.innerText = `$${subtotal.toLocaleString('es-AR')}`;
    checkoutShipping.innerText = shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString('es-AR')}`;
    checkoutTotal.innerText = `$${(subtotal + shippingCost).toLocaleString('es-AR')}`;
}

window.checkoutAlert = function() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    closeCart();
    openCheckoutModal();
};

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const selectedCarrier = document.querySelector('input[name="shipping-carrier"]:checked').value;
    const isFree = subtotal >= 250000;
    const shippingCost = isFree ? 0 : (selectedCarrier === 'Andreani' ? (apiShippingRates.Andreani || 9500) : (apiShippingRates['Correo Argentino'] || 7800));
    
    const orderData = {
        date: new Date().toISOString(),
        status: "Pendiente",
        customer: {
            name: document.getElementById('checkout-name').value.trim(),
            phone: document.getElementById('checkout-phone').value.trim(),
            email: document.getElementById('checkout-email').value.trim(),
            state: document.getElementById('checkout-state').value.trim(),
            city: document.getElementById('checkout-city').value.trim(),
            address: document.getElementById('checkout-address').value.trim(),
            zip: document.getElementById('checkout-zip').value.trim()
        },
        carrier: selectedCarrier,
        shippingCost: shippingCost,
        subtotal: subtotal,
        total: subtotal + shippingCost,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }))
    };

    try {
        // Save order to IndexedDB
        await dbPutOrder(orderData);
        
        // Subtract stock for each product
        const promises = cart.map(async (item) => {
            const p = ALL_PRODUCTS.find(prod => prod.id === item.id);
            if (p && p.stock !== undefined) {
                p.stock = Math.max(0, p.stock - item.quantity);
                await dbPutProduct(p);
            }
        });
        
        await Promise.all(promises);

        // Update monthly sales in localStorage
        let monthlySales = parseFloat(localStorage.getItem('tosco_monthly_sales')) || 389200;
        monthlySales += subtotal;
        localStorage.setItem('tosco_monthly_sales', monthlySales);

        alert(`¡Pedido realizado con éxito! Su pedido se ha registrado con el método de envío: ${selectedCarrier}.`);
        
        // Clean cart and reload
        cart = [];
        saveCart();
        updateCartUI();
        closeCheckoutModal();
        await refreshLocalState();
    } catch (err) {
        console.error("Error creating order: ", err);
        alert("Ocurrió un error al procesar la compra.");
    }
}
