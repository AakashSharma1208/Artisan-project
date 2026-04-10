document.addEventListener('DOMContentLoaded', () => {
    // Auth check
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('dashLink').style.display = 'inline-block';

    renderSummary();
    setupForm();
});

let finalTotal = 0;

function renderSummary() {
    const summaryContainer = document.getElementById('checkoutSummary');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    let subtotal = 0;
    let itemsHTML = '<h3>Order Summary</h3><div style="margin-bottom: 20px;">';
    
    cart.forEach(item => {
        subtotal += (item.price * item.quantity);
        itemsHTML += `
            <div class="summary-item">
                <span>${item.quantity}x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    itemsHTML += '</div>';

    const tax = subtotal * 0.05;
    finalTotal = subtotal + tax;

    itemsHTML += `
        <div class="summary-item">
            <span>Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span>Tax (5%)</span>
            <span>$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-total">
            <span>Total</span>
            <span>$${finalTotal.toFixed(2)}</span>
        </div>
    `;

    summaryContainer.innerHTML = itemsHTML;
}

function setupForm() {
    const form = document.getElementById('checkoutForm');
    const errorMsg = document.getElementById('checkoutError');
    const btn = document.getElementById('placeOrderBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        btn.disabled = true;
        btn.textContent = 'Processing...';
        errorMsg.style.display = 'none';

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderItems = cart.map(item => ({
            productId: item.id,
            vendorId: item.vendorId,
            quantity: item.quantity,
            price: item.price
        }));

        const shippingAddress = {
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value,
        };

        try {
            await fetchAPI('/orders', {
                method: 'POST',
                body: JSON.stringify({
                    orderItems,
                    shippingAddress,
                    totalPrice: finalTotal
                })
            });

            // Clear cart & redirect
            localStorage.removeItem('cart');
            alert('Order placed successfully!');
            window.location.href = 'dashboard.html';

        } catch (error) {
            console.error('Checkout error:', error);
            errorMsg.textContent = error.message || 'Error placing order. Please try again.';
            errorMsg.style.display = 'block';
            btn.disabled = false;
            btn.textContent = 'Place Order';
        }
    });
}
