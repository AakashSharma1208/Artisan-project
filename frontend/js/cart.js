document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const layout = document.getElementById('cartLayout');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        layout.innerHTML = `
            <div style="text-align:center; width: 100%; padding: 50px;">
                <h3>Your cart is empty.</h3>
                <a href="products.html" class="btn btn-primary" style="margin-top: 20px;">Continue Shopping</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    
    let itemsHTML = '<div class="cart-items-section">';
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <div class="cart-item-img" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQty(${index}, this.value)">
                    <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    itemsHTML += '</div>';

    const tax = subtotal * 0.05; // 5% flat tax simulation
    const total = subtotal + tax;

    const summaryHTML = `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Estimated Tax (5%)</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary btn-block" onclick="proceedToCheckout()" style="margin-top: 25px; padding: 15px; font-size: 1.1rem;">Proceed to Checkout</button>
        </div>
    `;

    layout.innerHTML = itemsHTML + summaryHTML;
}

function updateQty(index, newQty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const parsedQty = parseInt(newQty, 10);
    if(parsedQty >= 1) {
        cart[index].quantity = parsedQty;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        renderCart();
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    renderCart();
}

function proceedToCheckout() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to proceed to checkout.');
        window.location.href = 'login.html';
    } else {
        window.location.href = 'checkout.html';
    }
}
