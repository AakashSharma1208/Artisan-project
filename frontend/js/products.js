document.addEventListener('DOMContentLoaded', () => {
    loadProducts();

    // Check URL params for initial filters
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    const initialSearch = urlParams.get('search');
    
    if (initialCategory) {
        document.querySelector(`input[name="cat"][value="${initialCategory}"]`).checked = true;
        document.getElementById('pageTitle').textContent = initialCategory;
    }
    if (initialSearch) {
        document.getElementById('searchInput').value = initialSearch;
        document.getElementById('pageTitle').textContent = `Search: "${initialSearch}"`;
    }

    // Filter event listeners
    const categoryRadios = document.querySelectorAll('input[name="cat"]');
    categoryRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const cat = e.target.value;
            const search = document.getElementById('searchInput').value;
            
            document.getElementById('pageTitle').textContent = cat || 'All Products';
            
            // Build query params
            let params = new URLSearchParams();
            if (cat) params.append('category', cat);
            if (search) params.append('keyword', search);
            
            window.history.replaceState({}, '', `?${params.toString()}`);
            loadProducts(params.toString());
        });
    });
});

async function loadProducts(queryString = '') {
    const list = document.getElementById('productList');
    
    // Fallback construct query string if empty but we have params
    if (!queryString && window.location.search) {
        queryString = window.location.search.replace('?', '');
        // Replace 'search' with 'keyword' for backend matching
        if (queryString.includes('search=')) {
            queryString = queryString.replace('search=', 'keyword=');
        }
    }

    try {
        const query = queryString ? `?${queryString}` : '';
        const products = await ProductsAPI.getAll(query);
        
        list.innerHTML = '';
        if (products.length === 0) {
            list.innerHTML = '<p>No products found matching your criteria.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card glass-card';
            
            const imageUrl = product.images && product.images.length > 0 
                ? product.images[0] 
                : 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';

            card.innerHTML = `
                <div class="product-img" style="background-image: url('${imageUrl}')"></div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.productName}</h3>
                    <p class="product-vendor">By ${product.vendorId?.vendorName || 'Unknown Vendor'}</p>
                    <div class="product-bottom">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <a href="product-detail.html?id=${product._id}" class="btn btn-outline" style="padding: 5px 10px; font-size: 0.9rem;">View</a>
                    </div>
                </div>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        list.innerHTML = `<p style="color:var(--danger-color)">Error loading products: ${error.message}</p>`;
    }
}
