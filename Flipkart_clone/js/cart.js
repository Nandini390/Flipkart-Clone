// Shopping Cart JavaScript

class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('flipkart_cart')) || [];
        this.products = this.getAllProducts();
        this.init();
    }

    init() {
        this.updateCartCount();
        this.renderCart();
        console.log('Cart initialized with items:', this.cart.length);
    }

    getAllProducts() {
        // Enhanced product database matching app.js
        return [
            { 
                id: 1, 
                name: "iPhone 15 Pro Max 256GB", 
                price: 134900, 
                originalPrice: 159900, 
                discount: 15, 
                category: "Electronics", 
                subcategory: "Smartphones",
                brand: "Apple",
                rating: 4.5,
                reviewCount: 2847,
                image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center",
                description: "Experience the iPhone 15 Pro Max with breakthrough titanium design.",
                features: ["A17 Pro chip", "Titanium Design", "48MP Camera"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 2, 
                name: "Samsung Galaxy S24 Ultra 512GB", 
                price: 124999, 
                originalPrice: 144999, 
                discount: 14, 
                category: "Electronics", 
                subcategory: "Smartphones",
                brand: "Samsung",
                rating: 4.3,
                reviewCount: 1956,
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center",
                description: "Galaxy S24 Ultra with Galaxy AI and 200MP camera.",
                features: ["Galaxy AI", "200MP Camera", "S Pen"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 3, 
                name: "MacBook Air M3 13-inch", 
                price: 114900, 
                originalPrice: 134900, 
                discount: 15, 
                category: "Electronics", 
                subcategory: "Laptops",
                brand: "Apple",
                rating: 4.6,
                reviewCount: 1534,
                image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center",
                description: "MacBook Air with M3 chip delivers exceptional performance.",
                features: ["M3 Chip", "18 hours battery", "Liquid Retina Display"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 4, 
                name: "Sony WH-1000XM5 Headphones", 
                price: 29990, 
                originalPrice: 34990, 
                discount: 14, 
                category: "Electronics", 
                subcategory: "Audio",
                brand: "Sony",
                rating: 4.4,
                reviewCount: 892,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
                description: "Premium noise-canceling wireless headphones.",
                features: ["Active Noise Cancellation", "30Hr Battery", "Quick Charge"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 5, 
                name: "iPad Pro 12.9\" M2", 
                price: 99900, 
                originalPrice: 112900, 
                discount: 12, 
                category: "Electronics", 
                subcategory: "Tablets",
                brand: "Apple",
                rating: 4.5,
                reviewCount: 743,
                image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center",
                description: "The most advanced iPad Pro with M2 chip.",
                features: ["M2 Chip", "12.9\" Liquid Retina XDR", "Face ID"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 6, 
                name: "Nike Air Max 270", 
                price: 12995, 
                originalPrice: 15995, 
                discount: 19, 
                category: "Fashion", 
                subcategory: "Footwear",
                brand: "Nike",
                rating: 4.2,
                reviewCount: 1247,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
                description: "Nike's biggest heel Air unit yet delivers unrivaled comfort.",
                features: ["Air Max Technology", "Breathable Mesh", "Durable Rubber"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 7, 
                name: "Levi's 501 Original Jeans", 
                price: 3999, 
                originalPrice: 4999, 
                discount: 20, 
                category: "Fashion", 
                subcategory: "Clothing",
                brand: "Levi's",
                rating: 4.1,
                reviewCount: 2341,
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
                description: "The original blue jean since 1873.",
                features: ["100% Cotton", "Regular Fit", "Button Fly"],
                inStock: true,
                fastDelivery: false
            },
            { 
                id: 8, 
                name: "Adidas Ultraboost 22", 
                price: 16999, 
                originalPrice: 19999, 
                discount: 15, 
                category: "Fashion", 
                subcategory: "Footwear",
                brand: "Adidas",
                rating: 4.3,
                reviewCount: 967,
                image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center",
                description: "Our most responsive running shoe yet.",
                features: ["Boost Midsole", "Primeknit Upper", "Continental Rubber"],
                inStock: true,
                fastDelivery: true
            }
        ];
    }

    renderCart() {
        const cartContent = document.getElementById('cart-container');
        
        if (this.cart.length === 0) {
            cartContent.innerHTML = this.renderEmptyCart();
            return;
        }

        cartContent.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-lg shadow-sm">
                        <div class="p-6 border-b">
                            <h2 class="text-xl font-semibold">My Cart (${this.cart.length} items)</h2>
                        </div>
                        <div class="divide-y">
                            ${this.cart.map(item => this.renderCartItem(item)).join('')}
                        </div>
                    </div>
                </div>
                <div class="lg:col-span-1">
                    ${this.renderPriceSummary()}
                </div>
            </div>
        `;
    }

    renderCartItem(item) {
        return `
            <div class="p-6 flex items-start space-x-4">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                <div class="flex-1">
                    <h3 class="font-medium text-gray-900 mb-2">${item.name}</h3>
                    <div class="flex items-center space-x-3 mb-3">
                        <span class="text-xl font-bold">₹${item.price.toLocaleString()}</span>
                        <span class="text-gray-500 line-through">₹${item.originalPrice.toLocaleString()}</span>
                        <span class="text-green-600 text-sm">${item.discount}% off</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center border rounded">
                            <button onclick="shoppingCart.updateQuantity(${item.id}, ${item.quantity - 1})" 
                                    class="px-3 py-1 hover:bg-gray-100">-</button>
                            <span class="px-3 py-1 border-x">${item.quantity}</span>
                            <button onclick="shoppingCart.updateQuantity(${item.id}, ${item.quantity + 1})" 
                                    class="px-3 py-1 hover:bg-gray-100">+</button>
                        </div>
                        <button onclick="shoppingCart.removeItem(${item.id})" 
                                class="text-red-500 hover:text-red-700 text-sm">REMOVE</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderPriceSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalDiscount = this.cart.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
        const deliveryCharges = subtotal > 500 ? 0 : 40;
        const totalAmount = subtotal + deliveryCharges;

        return `
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 class="text-lg font-semibold mb-4 text-gray-600">PRICE DETAILS</h3>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span>Price (${this.cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span>₹${(subtotal + totalDiscount).toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹${totalDiscount.toLocaleString()}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Delivery Charges</span>
                        <span class="${deliveryCharges === 0 ? 'text-green-600' : ''}">
                            ${deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                        </span>
                    </div>
                    <hr class="my-3">
                    <div class="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span>₹${totalAmount.toLocaleString()}</span>
                    </div>
                </div>
                <div class="mt-6 pt-4 border-t">
                    <button onclick="shoppingCart.proceedToCheckout()" 
                            class="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition flex items-center justify-center">
                        <i class="fas fa-lock mr-2"></i>
                        PLACE ORDER
                    </button>
                    <div class="text-center mt-3">
                        <div class="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            <i class="fas fa-shield-alt text-green-500"></i>
                            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyCart() {
        return `
            <div class="text-center py-16">
                <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-6"></i>
                <h2 class="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty!</h2>
                <p class="text-gray-500 mb-8">Add items to it now.</p>
                <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition">
                    Shop now
                </a>
            </div>
        `;
    }

    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(itemId);
            return;
        }

        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
        }
    }

    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        this.showNotification('Item removed from cart', 'success');
    }

    proceedToCheckout() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        if (!user.email) {
            this.showNotification('Please login to proceed with checkout', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }
        window.location.href = 'checkout.html';
    }

    saveCart() {
        localStorage.setItem('flipkart_cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCount = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartBadge = document.getElementById('cart-count');
        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
        }
        
        const totalItemsElement = document.getElementById('total-items');
        if (totalItemsElement) {
            totalItemsElement.textContent = cartCount;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.shoppingCart = new ShoppingCart();
});
