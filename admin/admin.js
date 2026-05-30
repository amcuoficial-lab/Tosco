// INITIAL SEED DATABASE (FOR DATABASE RESET ACTION)
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
let ALL_PRODUCTS = [];
let ALL_ORDERS = [];
let activeOrderFilter = 'all'; // all, Pendiente, Activo, Completado

// DOM ELEMENTS - LOGIN
let loginContainer, loginForm, usernameInput, passwordInput, errorMessage;

// DOM ELEMENTS - ADMIN MAIN VIEW
let adminMainView, adminLogoutBtn;

// View Tab Panes and Buttons
let tabProductsBtn, tabOrdersBtn, tabAppearanceBtn, tabProductsPane, tabOrdersPane, tabAppearancePane;

// Products Table Elements
let adminProductsTbody, adminSearchInput, adminAddProductBtn, adminExportBtn, adminImportTrigger, adminImportFile, adminResetBtn;

// Orders Table Elements
let adminOrdersTbody, orderFilterAll, orderFilterPending, orderFilterActive, orderFilterCompleted;

// Admin modal form
let productModalContainer, modalTitle, modalCloseBtn, productForm, formProductId, formName, formBrand, formCategory, formSubcategory, formPrice, formOriginalPrice, formStock, formImage, sizesStockContainer, addSizeStockRowBtn, formLabels, formCancelBtn;

// Admin stats
let statTotalEl, statOutOfStockEl, statSalesEl, statShippingEl;

// Appearance configuration elements
let appearanceForm, configTickerInput, configLogoFile, logoPreviewImg, logoPreviewName, configHeroFile, heroPreviewImg, heroPreviewName;

// Product form image files
let formImageFile, formImagePreview, formImageFileName;


function initDOMElements() {
    loginContainer = document.getElementById('login-container');
    loginForm = document.getElementById('login-form');
    usernameInput = document.getElementById('username');
    passwordInput = document.getElementById('password');
    errorMessage = document.getElementById('error-message');

    adminMainView = document.getElementById('admin-main-view');
    adminLogoutBtn = document.getElementById('admin-logout-btn');

    tabProductsBtn = document.getElementById('tab-products-btn');
    tabOrdersBtn = document.getElementById('tab-orders-btn');
    tabAppearanceBtn = document.getElementById('tab-appearance-btn');
    tabProductsPane = document.getElementById('tab-products-pane');
    tabOrdersPane = document.getElementById('tab-orders-pane');
    tabAppearancePane = document.getElementById('tab-appearance-pane');

    adminProductsTbody = document.getElementById('admin-products-tbody');
    adminSearchInput = document.getElementById('admin-search-input');
    adminAddProductBtn = document.getElementById('admin-add-product-btn');
    adminExportBtn = document.getElementById('admin-export-btn');
    adminImportTrigger = document.getElementById('admin-import-trigger');
    adminImportFile = document.getElementById('admin-import-file');
    adminResetBtn = document.getElementById('admin-reset-btn');

    adminOrdersTbody = document.getElementById('admin-orders-tbody');
    orderFilterAll = document.getElementById('order-filter-all');
    orderFilterPending = document.getElementById('order-filter-pending');
    orderFilterActive = document.getElementById('order-filter-active');
    orderFilterCompleted = document.getElementById('order-filter-completed');

    productModalContainer = document.getElementById('product-modal-container');
    modalTitle = document.getElementById('modal-title');
    modalCloseBtn = document.getElementById('modal-close-btn');
    productForm = document.getElementById('product-form');
    formProductId = document.getElementById('form-product-id');
    formName = document.getElementById('form-name');
    formBrand = document.getElementById('form-brand');
    formCategory = document.getElementById('form-category');
    formSubcategory = document.getElementById('form-subcategory');
    formPrice = document.getElementById('form-price');
    formOriginalPrice = document.getElementById('form-original-price');
    formStock = document.getElementById('form-stock');
    formImage = document.getElementById('form-image');
    sizesStockContainer = document.getElementById('sizes-stock-container');
    addSizeStockRowBtn = document.getElementById('add-size-stock-row');
    formLabels = document.getElementById('form-labels');
    formCancelBtn = document.getElementById('form-cancel-btn');

    statTotalEl = document.getElementById('admin-stat-total');
    statOutOfStockEl = document.getElementById('admin-stat-out-of-stock');
    statSalesEl = document.getElementById('admin-stat-sales');
    statShippingEl = document.getElementById('admin-stat-shipping');

    appearanceForm = document.getElementById('appearance-form');
    configTickerInput = document.getElementById('config-ticker');
    configLogoFile = document.getElementById('config-logo-file');
    logoPreviewImg = document.getElementById('logo-preview-img');
    logoPreviewName = document.getElementById('logo-preview-name');
    configHeroFile = document.getElementById('config-hero-file');
    heroPreviewImg = document.getElementById('hero-preview-img');
    heroPreviewName = document.getElementById('hero-preview-name');

    formImageFile = document.getElementById('form-image-file');
    formImagePreview = document.getElementById('form-image-preview');
    formImageFileName = document.getElementById('form-image-file-name');
}


// INDEXEDDB CONTROLLER
function dbInit() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('ToscoStoreDB', 2); // DB Version 2

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
            resolve();
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

// IndexedDB Orders helpers
function dbGetAllOrders() {
    return new Promise((resolve) => {
        const transaction = db.transaction('orders', 'readonly');
        const store = transaction.objectStore('orders');
        const request = store.getAll();
        request.onsuccess = () => {
            resolve(request.result);
        };
    });
}

function dbPutOrder(order) {
    return new Promise((resolve) => {
        const transaction = db.transaction('orders', 'readwrite');
        const store = transaction.objectStore('orders');
        const request = store.put(order);
        request.onsuccess = () => {
            resolve();
        };
    });
}

function dbDeleteOrder(id) {
    return new Promise((resolve) => {
        const transaction = db.transaction('orders', 'readwrite');
        const store = transaction.objectStore('orders');
        const request = store.delete(id);
        request.onsuccess = () => {
            resolve();
        };
    });
}

// INITIALIZE APP AND LISTENERS
function initApp() {
    initDOMElements();

    // Check authentication first
    const isLogged = sessionStorage.getItem('tosco_admin_logged') === 'true';
    if (isLogged) {
        showAdminView();
    } else {
        showLoginView();
    }

    // Bind login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userVal = usernameInput.value.trim();
            const passVal = passwordInput.value;
            
            if (userVal === 'tosco' && passVal === 'admin123') {
                sessionStorage.setItem('tosco_admin_logged', 'true');
                errorMessage.style.display = 'none';
                showAdminView();
            } else {
                errorMessage.style.display = 'block';
            }
        });
    }

    // Bind logout action
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('tosco_admin_logged');
            showLoginView();
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// VIEW SWITCHERS
function showLoginView() {
    document.body.className = 'login-body';
    if (loginContainer) loginContainer.style.display = 'block';
    if (adminMainView) adminMainView.style.display = 'none';
}

async function showAdminView() {
    document.body.className = '';
    if (loginContainer) loginContainer.style.display = 'none';
    if (adminMainView) adminMainView.style.display = 'block';
    
    try {
        await dbInit();
        await refreshLocalState();
        setupAdminEventListeners();
        setupOrderTabsListeners();
    } catch (err) {
        console.error("Database connection failed", err);
    }
}

async function refreshLocalState() {
    ALL_PRODUCTS = await dbGetAllProducts();
    ALL_ORDERS = await dbGetAllOrders();
    renderAdminTable();
    renderOrdersTable();
}


// ADMIN PANEL LOGIC ACTIONS
function setupAdminEventListeners() {
    // Store Status Toggle Handler
    const storeStatusToggleBtn = document.getElementById('store-status-toggle-btn');
    if (storeStatusToggleBtn) {
        let storeOnline = localStorage.getItem('tosco_store_online') !== 'false';
        
        const updateToggleUI = () => {
            if (storeOnline) {
                storeStatusToggleBtn.innerText = 'ON';
                storeStatusToggleBtn.style.backgroundColor = '#27ae60';
            } else {
                storeStatusToggleBtn.innerText = 'OFF';
                storeStatusToggleBtn.style.backgroundColor = '#c0392b';
            }
        };
        
        updateToggleUI();
        
        storeStatusToggleBtn.addEventListener('click', () => {
            storeOnline = !storeOnline;
            localStorage.setItem('tosco_store_online', storeOnline ? 'true' : 'false');
            updateToggleUI();
        });
    }

    // Products view handlers
    adminSearchInput.addEventListener('input', renderAdminTable);
    
    adminAddProductBtn.addEventListener('click', () => {
        openProductModal(null);
    });

    adminExportBtn.addEventListener('click', exportCatalog);
    
    adminImportTrigger.addEventListener('click', () => {
        adminImportFile.click();
    });
    
    adminImportFile.addEventListener('change', importCatalog);
    
    adminResetBtn.addEventListener('click', resetDatabaseToFactory);

    modalCloseBtn.addEventListener('click', closeProductModal);
    formCancelBtn.addEventListener('click', closeProductModal);
    productForm.addEventListener('submit', saveProductForm);

    // Tab Switchers
    tabProductsBtn.addEventListener('click', () => {
        tabProductsBtn.classList.add('primary');
        tabOrdersBtn.classList.remove('primary');
        tabAppearanceBtn.classList.remove('primary');
        tabProductsPane.style.display = 'flex';
        tabOrdersPane.style.display = 'none';
        tabAppearancePane.style.display = 'none';
        renderAdminTable();
    });

    tabOrdersBtn.addEventListener('click', () => {
        tabOrdersBtn.classList.add('primary');
        tabProductsBtn.classList.remove('primary');
        tabAppearanceBtn.classList.remove('primary');
        tabProductsPane.style.display = 'none';
        tabOrdersPane.style.display = 'flex';
        tabAppearancePane.style.display = 'none';
        renderOrdersTable();
    });

    tabAppearanceBtn.addEventListener('click', () => {
        tabAppearanceBtn.classList.add('primary');
        tabProductsBtn.classList.remove('primary');
        tabOrdersBtn.classList.remove('primary');
        tabProductsPane.style.display = 'none';
        tabOrdersPane.style.display = 'none';
        tabAppearancePane.style.display = 'flex';

        // Load current config
        logoPreviewImg.src = localStorage.getItem('tosco_custom_logo') || '../assets/logo.webp';
        heroPreviewImg.src = localStorage.getItem('tosco_custom_hero') || '../assets/hero_tosco.png';
        configTickerInput.value = localStorage.getItem('tosco_custom_ticker') || '3 CUOTAS SIN INTERÉS | ENVÍO GRATIS SUPERANDO LOS $250.000';
        logoPreviewName.innerText = "Ningún archivo seleccionado";
        heroPreviewName.innerText = "Ningún archivo seleccionado";
    });

    // Appearance Form Submit
    appearanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        localStorage.setItem('tosco_custom_logo', logoPreviewImg.src);
        localStorage.setItem('tosco_custom_hero', heroPreviewImg.src);
        localStorage.setItem('tosco_custom_ticker', configTickerInput.value.trim());
        alert('¡Configuración visual guardada correctamente!');
    });

    // File change listeners for appearance customization
    configLogoFile.addEventListener('change', () => {
        const file = configLogoFile.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                logoPreviewImg.src = ev.target.result;
                logoPreviewName.innerText = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    configHeroFile.addEventListener('change', () => {
        const file = configHeroFile.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                heroPreviewImg.src = ev.target.result;
                heroPreviewName.innerText = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    // File change listener for product form image
    formImageFile.addEventListener('change', () => {
        const file = formImageFile.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                formImagePreview.src = ev.target.result;
                formImage.value = ev.target.result; // Store Base64 inside hidden form-image input
                formImageFileName.innerText = file.name;
            };
            reader.readAsDataURL(file);
        }
    });

    // Add size stock row listener
    addSizeStockRowBtn.addEventListener('click', () => {
        createSizeStockRow('', 0);
    });

    // Category change listener to populate default sizes for calzado
    formCategory.addEventListener('change', () => {
        const pid = formProductId.value;
        const isEdit = pid !== '';
        if (!isEdit) {
            sizesStockContainer.innerHTML = '';
            if (formCategory.value === 'calzado') {
                createSizeStockRow('36', 5);
                createSizeStockRow('37', 5);
                createSizeStockRow('38', 5);
                createSizeStockRow('39', 5);
                createSizeStockRow('40', 5);
            } else {
                createSizeStockRow('Único', 10);
            }
        }
    });
}

function createSizeStockRow(size = '', stock = 0) {
    const row = document.createElement('div');
    row.className = 'size-stock-row';
    row.style.display = 'flex';
    row.style.gap = '10px';
    row.style.alignItems = 'center';
    row.innerHTML = `
        <input type="text" class="row-size-input" required placeholder="Talle (ej: 38)" value="${size}" style="flex:1; padding:8px; border:1px solid var(--gray-medium); border-radius:4px; font-family:'Lato',sans-serif;">
        <input type="number" class="row-stock-input" required min="0" placeholder="Stock" value="${stock}" style="width:100px; padding:8px; border:1px solid var(--gray-medium); border-radius:4px; font-family:'Lato',sans-serif;">
        <button type="button" class="btn-table-action delete" style="padding:8px 12px; margin:0;" onclick="this.parentElement.remove(); recalculateTotalStock();"><i class="fa-regular fa-trash-can"></i></button>
    `;
    
    row.querySelector('.row-stock-input').addEventListener('input', recalculateTotalStock);
    row.querySelector('.row-size-input').addEventListener('input', recalculateTotalStock);
    
    sizesStockContainer.appendChild(row);
    recalculateTotalStock();
}

function recalculateTotalStock() {
    let total = 0;
    document.querySelectorAll('.row-stock-input').forEach(input => {
        total += parseInt(input.value) || 0;
    });
    formStock.value = total;
}

function setupOrderTabsListeners() {
    const filters = [
        { btn: orderFilterAll, val: 'all' },
        { btn: orderFilterPending, val: 'Pendiente' },
        { btn: orderFilterActive, val: 'Activo' },
        { btn: orderFilterCompleted, val: 'Completado' }
    ];

    filters.forEach(f => {
        f.btn.addEventListener('click', () => {
            filters.forEach(x => x.btn.classList.remove('primary'));
            f.btn.classList.add('primary');
            activeOrderFilter = f.val;
            renderOrdersTable();
        });
    });
}

function updateAdminStats() {
    statTotalEl.innerText = ALL_PRODUCTS.length;
    
    const outOfStockCount = ALL_PRODUCTS.filter(p => p.stock === 0).length;
    statOutOfStockEl.innerText = outOfStockCount;
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const salesTotal = ALL_ORDERS
        .filter(o => o.status === 'Completado' && new Date(o.date).getMonth() === currentMonth && new Date(o.date).getFullYear() === currentYear)
        .reduce((sum, o) => sum + (o.total || 0), 0);
    statSalesEl.innerText = `$${salesTotal.toLocaleString('es-AR')}`;
    
    const freeShippingCount = ALL_PRODUCTS.filter(p => p.labels.some(l => l.toLowerCase().includes('gratis') || l.toLowerCase().includes('envío'))).length;
    statShippingEl.innerText = freeShippingCount;
}

function renderAdminTable() {
    adminProductsTbody.innerHTML = '';
    updateAdminStats();
    
    const searchVal = adminSearchInput.value.toLowerCase().trim();
    
    const filtered = ALL_PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchVal) || 
        p.brand.toLowerCase().includes(searchVal) ||
        p.category.toLowerCase().includes(searchVal) ||
        p.subcategory.toLowerCase().includes(searchVal)
    );

    if (filtered.length === 0) {
        adminProductsTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--gray-dark); font-style: italic;">No se encontraron productos.</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const labelsHtml = p.labels.map(l => `<span class="label-pill ${l.toLowerCase().includes('envío') || l.toLowerCase().includes('gratis') ? 'free-shipping' : 'offer'}" style="margin-right: 4px; display: inline-block;">${l}</span>`).join('');
        
        let breakdown = '';
        if (p.sizesStock) {
            breakdown = '<div style="font-size:11px; color:#7f8c8d; margin-top:4px; line-height:1.2;">' + 
                Object.entries(p.sizesStock)
                    .map(([sz, stk]) => `<strong>${sz}</strong>:${stk}`)
                    .join(', ') + 
                '</div>';
        }
        
        const stockDisplay = p.stock === 0 
            ? `<span style="color: #c0392b; font-weight: 700; background-color: #fce8e6; padding: 4px 8px; border-radius: 4px;">Sin Stock</span>` 
            : `<span style="font-weight: 600; color: #2c3e50;">${p.stock} u.</span>` + breakdown;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.image}" alt="${p.name}" class="admin-thumb" onerror="this.src='../assets/hero_tosco.png'"></td>
            <td style="font-weight: bold;">${p.name}</td>
            <td>${p.brand} (${p.category} / ${p.subcategory})</td>
            <td>
                ${p.originalPrice ? `<span style="text-decoration: line-through; color: var(--gray-dark); margin-right: 8px;">$${p.originalPrice.toLocaleString('es-AR')}</span>` : ''}
                <span style="font-weight: bold;">$${p.price.toLocaleString('es-AR')}</span>
            </td>
            <td>${stockDisplay}</td>
            <td>${labelsHtml}</td>
            <td>
                <div class="admin-actions-cell">
                    <button class="btn-table-action" onclick="openProductModal(${p.id})"><i class="fa-regular fa-edit"></i> Editar</button>
                    <button class="btn-table-action delete" onclick="deleteProduct(${p.id})"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </td>
        `;
        adminProductsTbody.appendChild(tr);
    });
}

// RENDER ORDERS TAB VIEW
function renderOrdersTable() {
    adminOrdersTbody.innerHTML = '';
    
    let filtered = ALL_ORDERS;
    if (activeOrderFilter !== 'all') {
        filtered = ALL_ORDERS.filter(o => o.status === activeOrderFilter);
    }

    if (filtered.length === 0) {
        adminOrdersTbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--gray-dark); font-style: italic;">No se encontraron pedidos.</td></tr>`;
        return;
    }

    filtered.forEach(o => {
        const dateObj = new Date(o.date);
        const dateStr = dateObj.toLocaleDateString('es-AR') + ' ' + dateObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

        const itemsSummary = o.items.map(item => `${item.name} (x${item.quantity})`).join(', ');

        let statusBadge = `
            <select class="admin-status-select" onchange="updateOrderStatus(${o.id}, this.value)" style="padding: 6px 10px; border-radius: 4px; border: 1px solid var(--gray-medium); font-weight: bold; font-family: var(--body-font); background-color: ${o.status === 'Pendiente' ? '#fef5e7' : o.status === 'Activo' ? '#ebf5fb' : '#e8f8f5'}; color: ${o.status === 'Pendiente' ? '#d35400' : o.status === 'Activo' ? '#2980b9' : '#27ae60'}; cursor: pointer; outline: none;">
                <option value="Pendiente" ${o.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="Activo" ${o.status === 'Activo' ? 'selected' : ''}>Despachado</option>
                <option value="Completado" ${o.status === 'Completado' ? 'selected' : ''}>Completado</option>
            </select>
        `;
        let actionBtnHtml = '';

        if (o.status === 'Pendiente') {
            actionBtnHtml = `
                <button class="btn-table-action" onclick="printShippingLabel(${o.id})" style="background:#34495e; color:white;"><i class="fa-solid fa-print"></i> Etiqueta</button>
                <button class="btn-table-action" onclick="updateOrderStatus(${o.id}, 'Activo')" style="background:#2980b9; color:white;"><i class="fa-solid fa-truck"></i> Despachar</button>
            `;
        } else if (o.status === 'Activo') {
            actionBtnHtml = `
                <button class="btn-table-action" onclick="printShippingLabel(${o.id})"><i class="fa-solid fa-print"></i> Etiqueta</button>
                <button class="btn-table-action" onclick="updateOrderStatus(${o.id}, 'Completado')" style="background:#27ae60; color:white;"><i class="fa-regular fa-circle-check"></i> Entregado</button>
            `;
        } else {
            actionBtnHtml = `
                <button class="btn-table-action delete" onclick="deleteOrder(${o.id})"><i class="fa-regular fa-trash-can"></i> Borrar</button>
            `;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: bold; font-family: monospace;">#${o.id}</td>
            <td>${dateStr}</td>
            <td>
                <strong>${o.customer.name}</strong><br>
                <span style="font-size:11px; color:var(--gray-dark);">${o.customer.address}, ${o.customer.city} (${o.customer.zip})</span>
            </td>
            <td>
                <strong>${o.carrier}</strong><br>
                <span style="font-size:11px; color:var(--gray-dark);">${o.shippingCost === 0 ? 'Envío Gratis' : '$' + o.shippingCost.toLocaleString('es-AR')}</span>
            </td>
            <td style="font-size:12px; max-width:250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${itemsSummary}">${itemsSummary}</td>
            <td style="font-weight: bold; color: #27ae60;">$${o.total.toLocaleString('es-AR')}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="admin-actions-cell">
                    ${actionBtnHtml}
                </div>
            </td>
        `;
        adminOrdersTbody.appendChild(tr);
    });
}

// Order CRUD operations
window.updateOrderStatus = async function(orderId, newStatus) {
    const o = ALL_ORDERS.find(ord => ord.id === orderId);
    if (!o) return;
    
    // If despachar (set to Activo), request to the serverless function
    if (newStatus === 'Activo') {
        try {
            const res = await fetch('/api/despachar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: o.id,
                    customer: o.customer,
                    carrier: o.carrier
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.success) {
                    o.trackingId = data.tracking_id;
                    o.labelPdfUrl = data.label_pdf_url;
                }
            }
        } catch (err) {
            console.error("Error calling api/despachar:", err);
        }
    }

    o.status = newStatus;
    await dbPutOrder(o);
    await refreshLocalState();
    alert(`Pedido #${orderId} actualizado a ${newStatus === 'Activo' ? 'Despachado' : newStatus}.`);
};

window.printShippingLabel = function(orderId) {
    const o = ALL_ORDERS.find(ord => ord.id === orderId);
    if (o && o.labelPdfUrl) {
        window.open(o.labelPdfUrl, '_blank');
    } else {
        window.open(`print-label.html?orderId=${orderId}`, '_blank');
    }
};

window.deleteOrder = async function(orderId) {
    if (!confirm("¿Desea eliminar de forma permanente el registro de este pedido?")) return;
    await dbDeleteOrder(orderId);
    await refreshLocalState();
};

// Modal handling
window.openProductModal = function(productId) {
    productModalContainer.style.display = 'flex';
    formImageFileName.innerText = 'Ningún archivo seleccionado';
    sizesStockContainer.innerHTML = '';
    
    if (productId) {
        // Edit Mode
        const p = ALL_PRODUCTS.find(item => item.id === productId);
        if (!p) return;
        
        modalTitle.innerText = "Editar Producto";
        formProductId.value = p.id;
        formName.value = p.name;
        formBrand.value = p.brand;
        formCategory.value = p.category;
        formSubcategory.value = p.subcategory;
        formPrice.value = p.price;
        formOriginalPrice.value = p.originalPrice || '';
        formStock.value = p.stock !== undefined ? p.stock : 0;
        formImage.value = p.image;
        formImagePreview.src = p.image;
        formLabels.value = p.labels ? p.labels.join(', ') : '';

        // Load size-stock rows
        if (p.sizesStock) {
            Object.keys(p.sizesStock).forEach(size => {
                createSizeStockRow(size, p.sizesStock[size]);
            });
        } else if (p.sizes && p.sizes.length > 0) {
            // Legacy product fallback
            const stockPerSize = Math.floor((p.stock || 10) / p.sizes.length);
            p.sizes.forEach(size => {
                createSizeStockRow(size, stockPerSize || 1);
            });
        } else {
            createSizeStockRow('Único', p.stock || 10);
        }
    } else {
        // Add Mode
        modalTitle.innerText = "Agregar Nuevo Producto";
        productForm.reset();
        formProductId.value = '';
        formImagePreview.src = '../assets/hero_tosco.png';
        formImage.value = '';
        
        // Default rows for shoe/cloth sizes
        createSizeStockRow('36', 5);
        createSizeStockRow('37', 5);
        createSizeStockRow('38', 5);
        createSizeStockRow('39', 5);
        createSizeStockRow('40', 5);
    }
};

function closeProductModal() {
    productModalContainer.style.display = 'none';
}

async function saveProductForm(e) {
    e.preventDefault();
    
    const pid = formProductId.value;
    const isEdit = pid !== '';
    
    // Parse dynamic sizes and stocks
    const sizesStock = {};
    let sizesArr = [];
    let stockVal = 0;

    document.querySelectorAll('.size-stock-row').forEach(row => {
        const size = row.querySelector('.row-size-input').value.trim();
        const stock = parseInt(row.querySelector('.row-stock-input').value) || 0;
        if (size !== '') {
            sizesStock[size] = stock;
            sizesArr.push(isNaN(parseInt(size)) ? size : parseInt(size));
            stockVal += stock;
        }
    });

    if (sizesArr.length === 0) {
        sizesStock['Único'] = 0;
        sizesArr = ['Único'];
    }

    // Parse labels
    const labelsArr = formLabels.value.split(',').map(l => l.trim()).filter(l => l !== '');
    
    const priceVal = parseInt(formPrice.value);
    const origPriceVal = formOriginalPrice.value ? parseInt(formOriginalPrice.value) : null;
    
    // Auto labels helper
    if (priceVal > 250000 && !labelsArr.some(l => l.toLowerCase().includes('envío') || l.toLowerCase().includes('gratis'))) {
        labelsArr.push("Envío gratis");
    }
    
    const productData = {
        id: isEdit ? parseInt(pid) : Date.now(),
        name: formName.value.trim(),
        brand: formBrand.value,
        category: formCategory.value,
        subcategory: formSubcategory.value.trim().toLowerCase(),
        price: priceVal,
        originalPrice: origPriceVal,
        stock: stockVal,
        sizesStock: sizesStock,
        image: formImage.value.trim(),
        labels: labelsArr,
        sizes: sizesArr
    };

    try {
        await dbPutProduct(productData);
        await refreshLocalState();
        renderAdminTable();
        closeProductModal();
    } catch (err) {
        console.error("Error saving product: ", err);
        alert("Ocurrió un error al guardar el producto.");
    }
}

window.deleteProduct = async function(productId) {
    if (!confirm("¿Está seguro que desea eliminar este producto?")) return;
    
    try {
        await dbDeleteProduct(productId);
        await refreshLocalState();
        renderAdminTable();
    } catch (err) {
        console.error("Error deleting product: ", err);
        alert("Ocurrió un error al borrar el producto.");
    }
};

// Reset database
async function resetDatabaseToFactory() {
    if (!confirm("¿Desea restablecer toda la base de datos a los valores de fábrica originales? Se perderán las cargas nuevas.")) return;
    
    try {
        await dbClearAll();
        // Load initial seed
        const transaction = db.transaction('products', 'readwrite');
        const store = transaction.objectStore('products');
        INITIAL_PRODUCTS.forEach(p => {
            if (p.stock === undefined) p.stock = 10;
            store.put(p);
        });
        
        // Wait transaction complete
        await new Promise((resolve) => {
            transaction.oncomplete = () => resolve();
        });
        
        await refreshLocalState();
        renderAdminTable();
        alert("¡Base de datos restablecida con éxito!");
    } catch (err) {
        console.error("Error resetting DB: ", err);
        alert("Ocurrió un error al resetear.");
    }
}

// Export Catalog JSON
function exportCatalog() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ALL_PRODUCTS, null, 4));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "tosco_catalog.json");
    dlAnchorElem.click();
}

// Import Catalog JSON
function importCatalog(e) {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = async (event) => {
        try {
            const importedArr = JSON.parse(event.target.result);
            if (!Array.isArray(importedArr)) {
                alert("El archivo no contiene un catálogo válido.");
                return;
            }

            if (!confirm(`¿Desea importar ${importedArr.length} productos? Se sobreescribirán los productos con IDs coincidentes.`)) return;

            for (const p of importedArr) {
                if (p.id && p.name && p.price) {
                    if (p.stock === undefined) p.stock = 10;
                    await dbPutProduct(p);
                }
            }

            await refreshLocalState();
            renderAdminTable();
            alert("¡Catálogo importado con éxito!");
            adminImportFile.value = ''; // Reset input
        } catch (err) {
            console.error("Error parsing import: ", err);
            alert("El archivo JSON no posee el formato correcto.");
        }
    };
    fileReader.readAsText(file);
}

window.toggleProductVisibility = async function(productId) {
    const p = ALL_PRODUCTS.find(item => item.id === productId);
    if (!p) return;
    
    p.visible = p.visible === false ? true : false;
    
    try {
        await dbPutProduct(p);
        await refreshLocalState();
    } catch (err) {
        console.error("Error toggling product visibility: ", err);
    }
};
