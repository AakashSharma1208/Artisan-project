document.addEventListener('DOMContentLoaded', () => {
    loadRecommendations();
    setupChatbot();
});

async function loadRecommendations() {
    const container = document.getElementById('homeRecommendations');
    try {
        const products = await fetchAPI('/ai/recommendations');
        
        container.innerHTML = '';
        if (products.length === 0) {
            container.innerHTML = '<p>No products found.</p>';
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
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading recommendations:', error);
        container.innerHTML = '<p>Failed to load recommendations.</p>';
    }
}

function setupChatbot() {
    const aiBtn = document.getElementById('aiChatBtn');
    const aiWindow = document.getElementById('aiChatWindow');
    const closeBtn = document.getElementById('closeAiChat');
    const sendBtn = document.getElementById('sendAiBtn');
    const input = document.getElementById('aiInputStr');
    const messages = document.getElementById('aiMessages');

    aiBtn.addEventListener('click', () => {
        aiWindow.style.display = aiWindow.style.display === 'none' ? 'flex' : 'none';
    });

    closeBtn.addEventListener('click', () => {
        aiWindow.style.display = 'none';
    });

    const sendMessage = async () => {
        const text = input.value.trim();
        if(!text) return;

        // Add user msg
        messages.innerHTML += `<div class="msg user-msg">${text}</div>`;
        input.value = '';
        messages.scrollTop = messages.scrollHeight;

        // Show typing
        const typingId = 'typing-' + Date.now();
        messages.innerHTML += `<div id="${typingId}" class="msg ai-msg"><i class="fas fa-ellipsis-h"></i></div>`;
        messages.scrollTop = messages.scrollHeight;

        try {
            const res = await fetchAPI('/ai/chat', {
                method: 'POST',
                body: JSON.stringify({ message: text })
            });

            document.getElementById(typingId).remove();
            messages.innerHTML += `<div class="msg ai-msg">${res.reply}</div>`;
        } catch {
            document.getElementById(typingId).remove();
            messages.innerHTML += `<div class="msg ai-msg" style="color:var(--danger-color)">Error connecting to AI.</div>`;
        }
        messages.scrollTop = messages.scrollHeight;
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMessage();
    });
}
