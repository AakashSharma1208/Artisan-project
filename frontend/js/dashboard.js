document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    renderSidebar(userRole);
});

function renderSidebar(role) {
    const sidebar = document.getElementById('sidebar');
    let items = [];

    if (role === 'user') {
        items = [
            { id: 'profile', icon: 'fa-user', text: 'My Profile' },
            { id: 'orders', icon: 'fa-box', text: 'My Orders' }
        ];
    } else if (role === 'vendor') {
        items = [
            { id: 'profile', icon: 'fa-user', text: 'Vendor Profile' },
            { id: 'products', icon: 'fa-tags', text: 'My Products' },
            { id: 'vendor_orders', icon: 'fa-shipping-fast', text: 'Customer Orders' }
        ];
    } else if (role === 'admin') {
        items = [
            { id: 'stats', icon: 'fa-chart-line', text: 'Platform Stats' },
            { id: 'vendors', icon: 'fa-users', text: 'Manage Vendors' }
        ];
    }

    let html = '';
    items.forEach((item, index) => {
        html += `<div class="sidebar-item ${index === 0 ? 'active' : ''}" onclick="switchTab('${item.id}', this)"><i class="fas ${item.icon}"></i> ${item.text}</div>`;
    });
    sidebar.innerHTML = html;

    // Load initial tab
    if(items.length > 0) switchTab(items[0].id, sidebar.firstElementChild);
}

async function switchTab(tabId, element) {
    // UI toggle
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    const content = document.getElementById('dashboardContent');
    content.innerHTML = '<div class="loading-spinner">Loading...</div>';

    try {
        switch (tabId) {
            case 'profile':
                await renderProfile(content);
                break;
            case 'orders':
                await renderUserOrders(content);
                break;
            case 'products':
                await renderVendorProducts(content);
                break;
            case 'vendor_orders':
                await renderVendorOrders(content);
                break;
            case 'stats':
                await renderAdminStats(content);
                break;
            case 'vendors':
                await renderAdminVendors(content);
                break;
        }
    } catch (e) {
        content.innerHTML = `<p class="error-msg" style="display:block;">Error loading data: ${e.message}</p>`;
    }
}

// ----------------------------------------------------
// USER SPECIFIC
// ----------------------------------------------------
async function renderProfile(container) {
    const user = await fetchAPI('/auth/profile');
    container.innerHTML = `
        <h2>Profile Information</h2>
        <div style="margin-top:20px; font-size: 1.1rem;">
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
        </div>
    `;
}

async function renderUserOrders(container) {
    const orders = await fetchAPI('/orders/myorders');
    
    if (orders.length === 0) {
        container.innerHTML = `<h2>My Orders</h2><p>You haven't placed any orders yet.</p>`;
        return;
    }

    let html = `<h2>My Orders</h2><table><thead><tr><th>Order ID</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>`;
    orders.forEach(order => {
        const d = new Date(order.createdAt).toLocaleDateString();
        html += `<tr>
            <td>${order._id.substring(0,8)}...</td>
            <td>${d}</td>
            <td>$${order.totalPrice.toFixed(2)}</td>
            <td><span style="padding: 5px 10px; background: #e1e8ed; border-radius: 20px; font-size: 0.8rem;">${order.orderStatus}</span></td>
        </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

// ----------------------------------------------------
// VENDOR SPECIFIC
// ----------------------------------------------------
async function renderVendorProducts(container) {
    // In a real app we'd fetch vendor's products. For now reuse general api
    const user = JSON.parse(localStorage.getItem('userData'));
    // Note: mock implementation expects vendor endpoint
    try {
        const vendorProfile = await fetchAPI('/vendors/profile');
        const res = await fetchAPI(`/vendors/${vendorProfile._id}`);
        const products = res.products || [];

        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 20px;">
                <h2>My Products</h2>
                <button class="btn btn-primary" onclick="alert('Product addition modal/form goes here')">Add Product</button>
            </div>
        `;

        if (products.length === 0) {
            html += `<p>You haven't added any products yet.</p>`;
        } else {
            html += `<table><thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>`;
            products.forEach(p => {
                html += `<tr>
                    <td>${p.productName}</td>
                    <td>$${p.price.toFixed(2)}</td>
                    <td>${p.stock}</td>
                    <td><button class="btn btn-outline" style="padding:5px 10px; font-size: 0.8rem;">Edit</button></td>
                </tr>`;
            });
            html += `</tbody></table>`;
        }
        container.innerHTML = html;
    } catch(e) {
        container.innerHTML = `<h2>My Products</h2><p>Error loading vendor products.</p>`;
    }
}

async function renderVendorOrders(container) {
    const orders = await fetchAPI('/orders/vendor');
    
    if (orders.length === 0) {
        container.innerHTML = `<h2>Customer Orders</h2><p>No orders yet.</p>`;
        return;
    }

    let html = `<h2>Customer Orders</h2><table><thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Status</th><th>Update</th></tr></thead><tbody>`;
    orders.forEach(order => {
        const d = new Date(order.createdAt).toLocaleDateString();
        html += `<tr>
            <td>${order._id.substring(0,8)}...</td>
            <td>${order.userId.name}</td>
            <td>${d}</td>
            <td>${order.orderStatus}</td>
            <td><button class="btn btn-outline" style="padding:5px 10px; font-size: 0.8rem;" onclick="updateOStatus('${order._id}')">Update</button></td>
        </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

window.updateOStatus = async (id) => {
    const newStatus = prompt('Enter new status (Processing, Shipped, Delivered):');
    if(newStatus) {
        try {
            await fetchAPI(`/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ orderStatus: newStatus })
            });
            alert('Status updated');
            document.querySelector('.sidebar-item.active').click(); // refresh tab
        } catch(e) { alert(e.message); }
    }
};

// ----------------------------------------------------
// ADMIN SPECIFIC
// ----------------------------------------------------
async function renderAdminStats(container) {
    const stats = await fetchAPI('/admin/stats');
    container.innerHTML = `
        <h2>Platform Statistics</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px;">
            <div class="glass-card" style="padding: 30px; text-align: center;">
                <h3>Users</h3>
                <p style="font-size: 2.5rem; color: var(--secondary-color); font-weight: bold;">${stats.totalUsers}</p>
            </div>
            <div class="glass-card" style="padding: 30px; text-align: center;">
                <h3>Vendors</h3>
                <p style="font-size: 2.5rem; color: var(--secondary-color); font-weight: bold;">${stats.totalVendors}</p>
            </div>
            <div class="glass-card" style="padding: 30px; text-align: center;">
                <h3>Products</h3>
                <p style="font-size: 2.5rem; color: var(--secondary-color); font-weight: bold;">${stats.totalProducts}</p>
            </div>
            <div class="glass-card" style="padding: 30px; text-align: center;">
                <h3>Orders</h3>
                <p style="font-size: 2.5rem; color: var(--secondary-color); font-weight: bold;">${stats.totalOrders}</p>
            </div>
        </div>
    `;
}

async function renderAdminVendors(container) {
    const vendors = await fetchAPI('/vendors');
    
    let html = `<h2>Manage Vendors</h2><table><thead><tr><th>Vendor Name</th><th>Owner</th><th>Status</th><th>Action</th></tr></thead><tbody>`;
    vendors.forEach(v => {
        html += `<tr>
            <td>${v.vendorName}</td>
            <td>${v.ownerName}</td>
            <td>${v.isApproved ? 'Approved' : 'Pending'}</td>
            <td>
                <button class="btn ${v.isApproved ? 'btn-outline' : 'btn-primary'}" 
                        style="padding:5px 10px; font-size: 0.8rem;" 
                        onclick="toggleVendorStatus('${v._id}', ${!v.isApproved})">
                    ${v.isApproved ? 'Revoke' : 'Approve'}
                </button>
            </td>
        </tr>`;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

window.toggleVendorStatus = async (id, status) => {
    try {
        await fetchAPI(`/admin/vendors/${id}/approve`, {
            method: 'PUT',
            body: JSON.stringify({ isApproved: status })
        });
        document.querySelector('.sidebar-item.active').click();
    } catch(e) { alert(e.message); }
};
