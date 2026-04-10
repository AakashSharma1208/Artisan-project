document.addEventListener('DOMContentLoaded', () => {
    loadProductDetail();
});

async function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('productDetailContainer');

    if (!productId) {
        container.innerHTML = '<p class="error-msg" style="display:block;">Product ID is missing.</p>';
        return;
    }

    try {
        const product = await ProductsAPI.getById(productId);
        
        const imageUrl = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60';

        container.innerHTML = `
            <div class="product-detail-layout">
                <div class="detail-gallery">
                    <div class="detail-main-img" style="background-image: url('${imageUrl}')"></div>
                    <!-- Additional images could go here -->
                </div>
                <div class="detail-info">
                    <div class="detail-category">${product.category}</div>
                    <h1 class="detail-title">${product.productName}</h1>
                    <div class="detail-price">$${product.price.toFixed(2)}</div>
                    <p class="detail-desc">${product.description}</p>
                    
                    <div class="detail-vendor">
                        <h4>Artisan: ${product.vendorId?.vendorName || 'Unknown Vendor'}</h4>
                        <p>${product.vendorId?.description || ''}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${product.vendorId?.location || 'Location not specified'}</p>
                    </div>

                    ${product.stock > 0 ? `
                    <div class="add-to-cart-group">
                        <input type="number" id="qtyInput" class="quantity-input" value="1" min="1" max="${product.stock}">
                        <button id="addToCartBtn" class="btn btn-primary" style="flex:1;">Add to Cart</button>
                    </div>
                    ` : '<p style="color:var(--danger-color); font-weight:bold;">Out of Stock</p>'}
                </div>
            </div>
        `;

        const addToCartBtn = document.getElementById('addToCartBtn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const qty = parseInt(document.getElementById('qtyInput').value, 10);
                addToCart({
                    id: product._id,
                    vendorId: product.vendorId._id || product.vendorId, // extract id handles populated vs non populated
                    name: product.productName,
                    price: product.price,
                    image: imageUrl,
                    quantity: qty
                });
            });
        }
        
    } catch (error) {
        console.error('Error loading product:', error);
        container.innerHTML = `<p class="error-msg" style="display:block;">Error loading product.</p>`;
    }
}

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += item.quantity;
    } else {
        cart.push(item);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // Feedback
    const btn = document.getElementById('addToCartBtn');
    const ogText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.backgroundColor = 'var(--success-color)';
    setTimeout(() => {
        btn.textContent = ogText;
        btn.style.backgroundColor = 'var(--secondary-color)';
    }, 2000);
}
