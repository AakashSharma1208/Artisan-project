// main.js - Global frontend logic

document.addEventListener('DOMContentLoaded', () => {
    checkAuthState();
    setupEventListeners();
});

function checkAuthState() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    const authLinks = document.getElementById('authLinks');
    const userMenu = document.getElementById('userMenu');
    
    if (token) {
        if(authLinks) authLinks.style.display = 'none';
        if(userMenu) userMenu.style.display = 'flex';
    } else {
        if(authLinks) authLinks.style.display = 'flex';
        if(userMenu) userMenu.style.display = 'none';
    }
    
    updateCartDisplay();
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userData');
            window.location.href = 'index.html';
        });
    }
    
    const searchBtn = document.getElementById('searchBtn');
    if(searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = document.getElementById('searchInput').value;
            if(query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });
    }
}
