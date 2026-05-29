// MOCK DATABASE ALIGNED WITH TOSCO
const PRODUCTS = [
    {
        id: 1,
        name: "Zapatillas Puro Art",
        brand: "Puro",
        category: "calzado",
        subcategory: "zapatillas",
        price: 135000,
        image: "assets/puro_sneakers.png",
        labels: ["3 cuotas sin interés", "Envío gratis"],
        sizes: [36, 37, 38, 39, 40]
    },
    {
        id: 2,
        name: "Cartera Agosti Mandala",
        brand: "Antonia Agosti",
        category: "bolsos-y-mochilas",
        subcategory: "carteras",
        price: 168900,
        image: "assets/agosti_bag.png",
        labels: ["Cuotas sin interés"],
        sizes: ["Único"]
    },
    {
        id: 3,
        name: "Borcegos Winndia Vintage",
        brand: "Winndia",
        category: "calzado",
        subcategory: "botas",
        price: 182000,
        image: "assets/winndia_boots.png",
        labels: ["Envío gratis", "New In!"],
        sizes: [36, 37, 38, 39]
    },
    {
        id: 4,
        name: "Bandolera Winndia Compact",
        brand: "Winndia",
        category: "bolsos-y-mochilas",
        subcategory: "bandoleras",
        price: 98000,
        image: "assets/agosti_bag.png",
        labels: ["3 cuotas sin interés"],
        sizes: ["Único"]
    },
    {
        id: 5,
        name: "Mochila Chimola Sport",
        brand: "Chimola",
        category: "bolsos-y-mochilas",
        subcategory: "mochilas",
        price: 115000,
        image: "assets/agosti_bag.png",
        labels: ["Promo"],
        sizes: ["Único"]
    },
    {
        id: 6,
        name: "Alpargatas Chimmy Churry",
        brand: "Chimmy Churry",
        category: "calzado",
        subcategory: "sandalias",
        price: 64000,
        image: "assets/puro_sneakers.png",
        labels: ["3 cuotas sin interés"],
        sizes: [36, 37, 38, 39, 40]
    },
    {
        id: 7,
        name: "Mate Terra de Madera",
        brand: "Terra",
        category: "terra",
        subcategory: "mates",
        price: 25000,
        image: "assets/hero_tosco.png",
        labels: ["Colección Terra"],
        sizes: ["Único"]
    },
    {
        id: 8,
        name: "Billetera Antonia Agosti",
        brand: "Antonia Agosti",
        category: "accesorios",
        subcategory: "billeteras",
        price: 49000,
        image: "assets/agosti_bag.png",
        labels: ["New!"],
        sizes: ["Único"]
    }
];

// STATE MANAGEMENT
let cart = JSON.parse(localStorage.getItem('tosco_cart')) || [];
let activeCategory = 'all';
let activeSubcategory = '';
let activeBrand = '';
let activeSearchQuery = '';

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

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    setupEventListeners();
});

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
}

// RENDER CATALOG
function renderProducts() {
    productsGrid.innerHTML = '';
    
    // Filtering logic cascade
    let filtered = PRODUCTS;
    
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
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image-wrapper">
                <div class="product-labels">${labelsHtml}</div>
                <img src="${p.image}" alt="${p.name}" class="product-img">
            </div>
            <div class="product-info">
                <div class="product-category">${p.brand} | ${p.subcategory}</div>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-price">$${p.price.toLocaleString('es-AR')}</div>
                <button class="product-action-btn" onclick="addToCart(${p.id})">Agregar al Carrito</button>
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
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

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
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
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

    // Append user message bubble
    appendChatMessage(message, 'user');
    aiInput.value = '';

    // Typing simulation delay
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

window.checkoutAlert = function() {
    alert("¡Simulación de compra completada! Gracias por usar nuestro clon de Tosco Almacén de Moda.");
};
