class OrdersApp {
    constructor() {
        this.orders = this.getOrdersFromStorage();
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserInfo();
        this.renderOrders();
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        if (!user.email) {
            window.location.href = 'login.html';
        }
    }

    loadUserInfo() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };

        updateElement('user-name', user.name || 'User');
        updateElement('sidebar-name', user.name || 'User');
        updateElement('sidebar-email', user.email || 'user@example.com');
    }

    getOrdersFromStorage() {
        return JSON.parse(localStorage.getItem('flipkart_orders') || '[]');
    }

    renderOrders() {
        const container = document.getElementById('orders-container');
        if (!container) return;

        if (this.orders.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-box text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-600 mb-2">No orders yet</h3>
                    <p class="text-gray-500 mb-6">Looks like you haven't placed any orders yet.</p>
                    <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition">
                        Start Shopping
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.orders.map(order => `
            <div class="border rounded-lg p-6 mb-4 hover:shadow-md transition">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-semibold text-lg">Order #${order.id}</h3>
                        <p class="text-gray-600">Placed on ${order.date}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm ${this.getStatusColor(order.status)}">
                        ${order.status}
                    </span>
                </div>
                <div class="space-y-3">
                    ${order.items.map(item => `
                        <div class="flex items-center space-x-4">
                            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                            <div class="flex-1">
                                <h4 class="font-medium">${item.name}</h4>
                                <p class="text-gray-600">Qty: ${item.quantity}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold">₹${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="mt-4 pt-4 border-t flex justify-between items-center">
                    <div class="text-lg font-semibold">
                        Total: ₹${order.total.toLocaleString()}
                    </div>
                    <div class="space-x-3">
                        <button class="text-blue-600 hover:underline">Track Order</button>
                        <button class="text-blue-600 hover:underline">View Details</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getStatusColor(status) {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.ordersApp = new OrdersApp();
});