// INITIAL SEED DATABASE (MOCKS + PURO SCRAPED PRODUCTS)
const INITIAL_PRODUCTS = [
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
        stock: 5,
        sizesStock: {
            "36": 1,
            "37": 1,
            "38": 1,
            "39": 1,
            "40": 1
        }
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
let loggedInUserEmail = localStorage.getItem('tosco_logged_user') || null;

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

// Client Auth Modal DOM Elements
const userProfileBtn = document.getElementById('user-profile-btn');
const userEmailHeader = document.getElementById('user-email-header');
const authModalContainer = document.getElementById('auth-modal-container');
const authCloseBtn = document.getElementById('auth-close-btn');
const authEmailForm = document.getElementById('auth-email-form');
const authOtpForm = document.getElementById('auth-otp-form');
const authEmailInput = document.getElementById('auth-email');
const authCodeInput = document.getElementById('auth-code');
const authErrorMsg = document.getElementById('auth-error-msg');
const authBackBtn = document.getElementById('auth-back-btn');


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

function checkStoreStatus() {
    const storeOnline = localStorage.getItem('tosco_store_online') !== 'false';
    const maintenanceOverlay = document.getElementById('maintenance-overlay');
    if (maintenanceOverlay) {
        if (!storeOnline) {
            maintenanceOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            maintenanceOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
}

window.addEventListener('focus', checkStoreStatus);

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', async () => {
    try {
        checkStoreStatus();
        applyCustomAppearance();
        updateAuthHeader();
        
        // Check if returning from Mercado Pago with a successful payment
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        if (paymentStatus === 'success' || paymentStatus === 'success_simulated') {
            const tempOrder = JSON.parse(sessionStorage.getItem('tosco_temp_order'));
            if (tempOrder) {
                await completeOrderPlacement(tempOrder);
                return;
            }
        }

        await dbInit();
        await refreshLocalState();
        updateCartUI();
        setupEventListeners();
    } catch (err) {
        console.error("Error starting database: ", err);
        // Fallback to offline memory
        ALL_PRODUCTS = INITIAL_PRODUCTS;
        applyCustomAppearance();
        updateAuthHeader();
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
        closeAuthModal();
        closeProductDetail();
    });

    const detailCloseBtn = document.getElementById('product-detail-close-btn');
    if (detailCloseBtn) {
        detailCloseBtn.addEventListener('click', closeProductDetail);
    }

    const detailModal = document.getElementById('product-detail-modal-container');
    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) closeProductDetail();
        });
    }
    const authModal = document.getElementById('auth-modal-container');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) closeAuthModal();
        });
    }
    const checkoutModal = document.getElementById('checkout-modal-container');
    if (checkoutModal) {
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) closeCheckoutModal();
        });
    }

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

    // Client Authentication Modal Listeners
    if (userProfileBtn) userProfileBtn.addEventListener('click', handleProfileClick);
    if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);
    if (authBackBtn) authBackBtn.addEventListener('click', resetAuthModalForms);
    
    if (authEmailForm) {
        authEmailForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailVal = authEmailInput.value.trim();
            if (!emailVal) return;

            try {
                const response = await fetch('/api/send-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailVal })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    sessionStorage.setItem('tosco_auth_email', emailVal);
                    
                    // Show OTP form and hide Email form
                    authEmailForm.style.display = 'none';
                    authOtpForm.style.display = 'flex';
                    authErrorMsg.style.display = 'none';

                    // For demo/sandbox simulation if Resend API key is not configured, show code in alert
                    if (data.mode === 'sandbox_simulation' || data.code) {
                        alert(`[MODO PRUEBA] Tu código de verificación OTP es: ${data.code}`);
                    } else {
                        alert('Te hemos enviado un código de verificación de 6 dígitos a tu correo electrónico.');
                    }
                } else {
                    const err = await response.json();
                    alert(err.error || 'Error al enviar código.');
                }
            } catch (err) {
                console.error("Auth send OTP error:", err);
                alert("Error de conexión al enviar el código.");
            }
        });
    }

    if (authOtpForm) {
        authOtpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailVal = sessionStorage.getItem('tosco_auth_email');
            const codeVal = authCodeInput.value.trim();
            if (!emailVal || !codeVal) return;

            try {
                const response = await fetch('/api/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailVal, code: codeVal })
                });

                if (response.ok) {
                    localStorage.setItem('tosco_logged_user', emailVal);
                    loggedInUserEmail = emailVal;
                    updateAuthHeader();
                    closeAuthModal();
                    alert('¡Sesión iniciada con éxito!');
                } else {
                    const err = await response.json();
                    authErrorMsg.innerText = err.error || 'Código incorrecto.';
                    authErrorMsg.style.display = 'block';
                }
            } catch (err) {
                console.error("Auth verification error:", err);
                authErrorMsg.innerText = "Error de conexión al verificar.";
                authErrorMsg.style.display = 'block';
            }
        });
    }
}



// RENDER MAIN WEB CATALOG
function renderProducts() {
    productsGrid.innerHTML = '';
    
    // Filtering logic cascade
    let filtered = ALL_PRODUCTS.filter(p => (p.stock === undefined || p.stock > 0) && p.visible !== false);
    
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
        const cleanLabels = p.labels.filter(l => {
            const lowerL = l.toLowerCase();
            return !lowerL.includes('pocos') && !lowerL.includes('par') && !lowerL.includes('top') && !lowerL.includes('venta');
        });

        const labelsHtml = cleanLabels.map(l => `<span class="label-pill ${l.toLowerCase().includes('envío') || l.toLowerCase().includes('gratis') ? 'free-shipping' : 'offer'}">${l}</span>`).join('');
        
        const priceHtml = p.originalPrice 
            ? `<div class="product-price">
                 <span class="original-price" style="text-decoration: line-through; color: var(--gray-dark); margin-right: 8px; font-size: 13px;">$${p.originalPrice.toLocaleString('es-AR')}</span>
                 <span style="color: #c0392b; font-weight: 700;">$${p.price.toLocaleString('es-AR')}</span>
               </div>`
            : `<div class="product-price">$${p.price.toLocaleString('es-AR')}</div>`;

        const isOutOfStock = p.stock !== undefined && p.stock <= 0;
        const outOfStockOverlay = isOutOfStock ? `<div style="position: absolute; top:0; left:0; width:100%; height:100%; background: rgba(255,255,255,0.6); display:flex; align-items:center; justify-content:center; font-family:var(--heading-font); font-weight:bold; color:#c0392b; font-size:14px; letter-spacing:1px; z-index:3;">SIN STOCK</div>` : '';

        let badgesOverlayHtml = '';
        const lowerLabels = p.labels.map(l => l.toLowerCase().trim());
        const hasPocosParesTag = lowerLabels.some(l => l.includes('pocos') || l.includes('par'));
        const hasTopVentasTag = lowerLabels.some(l => l.includes('top') || l.includes('venta'));
        const isLowStock = p.stock !== undefined && p.stock > 0 && p.stock <= 3;

        if (hasPocosParesTag || isLowStock) {
            badgesOverlayHtml += `<div class="badge-stamp pocos-pares"><i class="fa-solid fa-fire"></i> Pocos Pares</div>`;
        }
        if (hasTopVentasTag) {
            badgesOverlayHtml += `<div class="badge-stamp top-ventas"><i class="fa-solid fa-arrow-trend-up"></i> Top Ventas</div>`;
        }
        const badgeWrapper = badgesOverlayHtml !== '' ? `<div class="product-badge-overlay">${badgesOverlayHtml}</div>` : '';

        const card = document.createElement('div');
        card.className = 'product-card animate-fade';
        card.innerHTML = `
            <div class="product-image-wrapper" onclick="openProductDetail(${p.id})">
                <div class="product-labels">${labelsHtml}</div>
                ${badgeWrapper}
                ${outOfStockOverlay}
                <img src="${p.image}" alt="${p.name}" class="product-img" onerror="this.src='assets/hero_tosco.png'">
            </div>
            <div class="product-info">
                <div class="product-category">${p.brand} | ${p.subcategory}</div>
                <h3 class="product-name" onclick="openProductDetail(${p.id})" style="cursor:pointer;">${p.name}</h3>
                ${priceHtml}
                <button class="product-action-btn" onclick="openProductDetail(${p.id})" ${isOutOfStock ? 'disabled style="background:var(--gray-medium); color:var(--gray-dark); cursor:not-allowed;"' : ''}>
                    ${isOutOfStock ? 'Sin Stock' : 'Ver Producto / Comprar'}
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

// Select size helper
window.selectProductSize = function(productId, size, btn) {
    const input = document.getElementById(`selected-size-input-${productId}`);
    if (input) input.value = size;

    const label = document.getElementById(`size-label-${productId}`);
    if (label) label.innerText = `Talle: ${size}`;

    const container = document.getElementById(`size-buttons-${productId}`);
    if (container) {
        container.querySelectorAll('.size-btn').forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = 'var(--gray-medium)';
            b.style.borderWidth = '1px';
            b.style.fontWeight = '400';
        });
    }
    btn.classList.add('active');
    btn.style.borderColor = 'var(--main-foreground)';
    btn.style.borderWidth = '2px';
    btn.style.fontWeight = '700';
};

// CART HANDLERS
window.addToCart = function(productId) {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    if (product.stock !== undefined && product.stock <= 0) {
        alert("¡Lo sentimos! Este producto se encuentra sin stock en este momento.");
        return;
    }

    // Read selected size
    const sizeInput = document.getElementById(`selected-size-input-${productId}`);
    const selectedSize = sizeInput ? sizeInput.value : 'Único';

    // Verify stock for specific size
    if (product.sizesStock && product.sizesStock[selectedSize] !== undefined) {
        if (product.sizesStock[selectedSize] <= 0) {
            alert(`¡Lo sentimos! El talle ${selectedSize} no tiene stock disponible.`);
            return;
        }
        
        const inCartQty = cart
            .filter(item => item.id === productId && item.size === selectedSize)
            .reduce((sum, item) => sum + item.quantity, 0);
        if (inCartQty >= product.sizesStock[selectedSize]) {
            alert(`No podés agregar más unidades de talle ${selectedSize}. Stock máximo alcanzado.`);
            return;
        }
    }

    const existing = cart.find(item => item.id === productId && item.size === selectedSize);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
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
                <div style="font-size:11px; color:var(--gray-dark); margin-bottom:5px;">Talle: ${item.size || 'Único'}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toLocaleString('es-AR')}</div>
                <div class="cart-item-quantity-control">
                    <button class="qty-btn" onclick="adjustQuantity(${item.id}, '${item.size || 'Único'}', -1)">-</button>
                    <input type="text" class="qty-input" value="${item.quantity}" readonly>
                    <button class="qty-btn" onclick="adjustQuantity(${item.id}, '${item.size || 'Único'}', 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeCartItem(${item.id}, '${item.size || 'Único'}')">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotalEl.innerText = `$${subtotal.toLocaleString('es-AR')}`;
    updateShippingProgress(subtotal);
}

window.adjustQuantity = function(productId, size, amount) {
    const item = cart.find(i => i.id === productId && i.size === size);
    if (!item) return;

    if (amount > 0) {
        const product = ALL_PRODUCTS.find(p => p.id === productId);
        if (product && product.sizesStock && product.sizesStock[size] !== undefined) {
            if (item.quantity + amount > product.sizesStock[size]) {
                alert(`No podés agregar más unidades de talle ${size}. Stock máximo alcanzado.`);
                return;
            }
        }
    }

    item.quantity += amount;
    if (item.quantity <= 0) {
        removeCartItem(productId, size);
    } else {
        saveCart();
        updateCartUI();
    }
};

window.removeCartItem = function(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
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

async function completeOrderPlacement(orderData) {
    try {
        // Ensure DB is ready
        if (!db) await dbInit();
        
        // Save order to IndexedDB
        await dbPutOrder(orderData);
        
        // Subtract stock for each product and size
        const promises = orderData.items.map(async (item) => {
            const p = ALL_PRODUCTS.find(prod => prod.id === item.id);
            if (p) {
                if (p.sizesStock && item.size && p.sizesStock[item.size] !== undefined) {
                    p.sizesStock[item.size] = Math.max(0, p.sizesStock[item.size] - item.quantity);
                }
                if (p.stock !== undefined) {
                    p.stock = Math.max(0, p.stock - item.quantity);
                }
                await dbPutProduct(p);
            }
        });
        await Promise.all(promises);

        // Update monthly sales in localStorage
        let monthlySales = parseFloat(localStorage.getItem('tosco_monthly_sales')) || 389200;
        monthlySales += orderData.subtotal;
        localStorage.setItem('tosco_monthly_sales', monthlySales);

        alert(`¡Pago acreditado con éxito! Tu pedido #${orderData.id} ha sido registrado. Envío por ${orderData.carrier}.`);
        
        // Clean cart, session and reload
        cart = [];
        saveCart();
        updateCartUI();
        sessionStorage.removeItem('tosco_temp_order');
        
        // Redirect to clean URL
        window.location.href = window.location.origin + window.location.pathname;
    } catch (err) {
        console.error("Error completing checkout: ", err);
        alert("Ocurrió un error al registrar el pedido post-pago.");
    }
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const selectedCarrier = document.querySelector('input[name="shipping-carrier"]:checked').value;
    const isFree = subtotal >= 250000;
    const shippingCost = isFree ? 0 : (selectedCarrier === 'Andreani' ? (apiShippingRates.Andreani || 9500) : (apiShippingRates['Correo Argentino'] || 7800));
    
    const orderData = {
        id: Date.now(),
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
            image: item.image,
            size: item.size || 'Único'
        }))
    };

    try {
        // Request payment checkout preference from serverless API
        const response = await fetch('/api/create-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: orderData.items,
                shippingCost: orderData.shippingCost,
                customer: orderData.customer
            })
        });

        if (!response.ok) {
            const errData = await response.text();
            throw new Error(`Preference creation failed: ${errData}`);
        }

        const data = await response.json();
        
        if (data && data.success && data.init_point) {
            sessionStorage.setItem('tosco_temp_order', JSON.stringify(orderData));
            window.location.href = data.init_point;
        } else {
            throw new Error("No init_point returned from payment gateway.");
        }
    } catch (err) {
        console.error("Error creating payment: ", err);
        alert("Ocurrió un error al procesar el pago con Mercado Pago.");
    }
}

// PRODUCT DETAIL MODAL CONTROLLER
window.openProductDetail = function(productId) {
    const p = ALL_PRODUCTS.find(prod => prod.id === productId);
    if (!p) return;

    const modal = document.getElementById('product-detail-modal-container');
    const breadcrumb = document.getElementById('detail-breadcrumb');
    const body = document.getElementById('product-detail-body');

    breadcrumb.innerText = `Inicio . ${p.category} . ${p.brand} . ${p.subcategory}`;

    const isOutOfStock = p.stock !== undefined && p.stock <= 0;
    let sizesHtml = '';
    let defaultSize = 'Único';
    
    if (p.sizesStock) {
        const allSizes = Object.entries(p.sizesStock);
        if (allSizes.length > 0) {
            const firstAvailable = allSizes.find(([size, stock]) => stock > 0);
            defaultSize = firstAvailable ? firstAvailable[0] : allSizes[0][0];
            sizesHtml = `
                <div style="margin-top: 15px;">
                    <span id="detail-size-label" style="font-size: 11px; font-weight: 700; display: block; margin-bottom: 6px; color: var(--main-foreground); text-transform: uppercase; letter-spacing: 0.5px;">Talle: ${defaultSize}</span>
                    <div id="detail-size-buttons" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        ${allSizes.map(([size, stock]) => {
                            const isOutOfStock = stock <= 0;
                            const isActive = size === defaultSize && !isOutOfStock;
                            return `
                                <button type="button" class="size-btn ${isActive ? 'active' : ''} ${isOutOfStock ? 'disabled' : ''}" ${isOutOfStock ? 'disabled' : ''} onclick="selectDetailSize(${p.id}, '${size}', this)">
                                    ${size}
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }
    } else if (p.sizes && p.sizes.length > 0) {
        defaultSize = p.sizes[0];
        sizesHtml = `
            <div style="margin-top: 15px;">
                <span id="detail-size-label" style="font-size: 11px; font-weight: 700; display: block; margin-bottom: 6px; color: var(--main-foreground); text-transform: uppercase; letter-spacing: 0.5px;">Talle: ${defaultSize}</span>
                <div id="detail-size-buttons" style="display: flex; gap: 10px; flex-wrap: wrap;">
                    ${p.sizes.map((size, idx) => `
                        <button type="button" class="size-btn ${idx === 0 ? 'active' : ''}" onclick="selectDetailSize(${p.id}, '${size}', this)">
                            ${size}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    const transferDiscountPrice = Math.round(p.price * 0.9);
    const threeInstallmentsPrice = Math.round(p.price / 3);

    body.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
            <img src="${p.image}" alt="${p.name}" style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 6px;" onerror="this.src='assets/hero_tosco.png'">
        </div>
        <div>
            <h2 style="font-family: var(--heading-font); font-size: 20px; font-weight: 700; margin-bottom: 5px; color: var(--main-foreground);">${p.name}</h2>
            
            <div style="font-size: 22px; font-weight: 700; color: var(--main-foreground); margin-bottom: 12px;">
                ${p.originalPrice ? `<span style="text-decoration: line-through; color: var(--gray-dark); margin-right: 10px; font-size: 14px;">$${p.originalPrice.toLocaleString('es-AR')}</span>` : ''}
                $${p.price.toLocaleString('es-AR')}
            </div>

            <div style="background-color: #fdfbf7; padding: 12px; border-radius: 6px; border: 1px dashed var(--primary-color); display: flex; flex-direction: column; gap: 6px; font-size: 11px; margin-bottom: 15px; text-align: left; line-height: 1.4;">
                <span style="color: #c0392b; font-weight: bold;">$${transferDiscountPrice.toLocaleString('es-AR')} por Transferencia / Efectivo (10% OFF)</span>
                <span>3 cuotas sin interés de <strong>$${threeInstallmentsPrice.toLocaleString('es-AR')}</strong></span>
                <span style="color: #50664c; font-weight: bold;"><i class="fa-solid fa-credit-card"></i> 3 Cuotas sin interés con todas las tarjetas</span>
            </div>

            ${sizesHtml}

            <div style="display: flex; align-items: center; gap: 15px; margin-top: 20px;">
                <div class="cart-item-quantity-control" style="border: 1px solid var(--gray-medium); display: flex; align-items: center; border-radius: 4px; background: white;">
                    <button class="qty-btn" onclick="adjustDetailQty(-1)" style="width: 35px; height: 35px; background: none; border: none; cursor: pointer; font-size: 16px; color: var(--main-foreground);">-</button>
                    <input type="text" id="detail-qty-input" value="1" readonly style="width: 35px; text-align: center; border: none; font-size: 13px; font-weight: bold; color: var(--main-foreground); background: transparent; outline: none;">
                    <button class="qty-btn" onclick="adjustDetailQty(1)" style="width: 35px; height: 35px; background: none; border: none; cursor: pointer; font-size: 16px; color: var(--main-foreground);">+</button>
                </div>
                
                <button class="btn-premium" id="detail-add-to-cart-btn" onclick="addDetailToCart(${p.id})" style="flex: 1; padding: 12px; font-size: 12px; height: 37px; border-radius: 4px;" ${isOutOfStock ? 'disabled style="background:var(--gray-medium); color:var(--gray-dark); cursor:not-allowed;"' : ''}>
                    ${isOutOfStock ? 'Sin Stock' : 'Agregar al carrito'}
                </button>
            </div>
            
            <input type="hidden" id="detail-selected-size" value="${defaultSize}">
            
            <a href="https://wa.me/5492284620258?text=Hola,%20estoy%20interesado%20en%20el%20producto%20${encodeURIComponent(p.name)}" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 15px; padding: 12px; background-color: #25d366; color: white; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; transition: var(--transition-smooth); width: 100%;">
                <i class="fa-brands fa-whatsapp" style="font-size: 16px;"></i> Preguntar por WhatsApp
            </a>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
};

window.closeProductDetail = function() {
    const modal = document.getElementById('product-detail-modal-container');
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
};

window.selectDetailSize = function(productId, size, btn) {
    const input = document.getElementById('detail-selected-size');
    if (input) input.value = size;

    const label = document.getElementById('detail-size-label');
    if (label) label.innerText = `Talle: ${size}`;

    const container = document.getElementById('detail-size-buttons');
    if (container) {
        container.querySelectorAll('.size-btn').forEach(b => {
            b.classList.remove('active');
            b.style.borderColor = 'var(--gray-medium)';
            b.style.borderWidth = '1px';
            b.style.fontWeight = '400';
        });
    }
    btn.classList.add('active');
    btn.style.borderColor = 'var(--main-foreground)';
    btn.style.borderWidth = '2px';
    btn.style.fontWeight = '700';
};

window.adjustDetailQty = function(amount) {
    const qtyInput = document.getElementById('detail-qty-input');
    if (!qtyInput) return;
    let qty = parseInt(qtyInput.value) || 1;
    qty = Math.max(1, qty + amount);
    qtyInput.value = qty;
};

window.addDetailToCart = function(productId) {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const selectedSize = document.getElementById('detail-selected-size').value;
    const qtyVal = parseInt(document.getElementById('detail-qty-input').value) || 1;

    // Verify stock
    if (product.sizesStock && product.sizesStock[selectedSize] !== undefined) {
        if (product.sizesStock[selectedSize] <= 0) {
            alert(`¡Lo sentimos! El talle ${selectedSize} no tiene stock disponible.`);
            return;
        }
        
        const inCartQty = cart
            .filter(item => item.id === productId && item.size === selectedSize)
            .reduce((sum, item) => sum + item.quantity, 0);
        if (inCartQty + qtyVal > product.sizesStock[selectedSize]) {
            alert(`No podés agregar más unidades de talle ${selectedSize}. Stock máximo alcanzado.`);
            return;
        }
    }

    const existing = cart.find(item => item.id === productId && item.size === selectedSize);
    if (existing) {
        existing.quantity += qtyVal;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: selectedSize,
            quantity: qtyVal
        });
    }

    saveCart();
    updateCartUI();
    closeProductDetail();
    openCart();
};
