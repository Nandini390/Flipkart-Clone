// Wishlist Page JavaScript

class WishlistApp {
    constructor() {
        this.wishlist = this.getWishlistFromStorage();
        this.products = this.getAllProducts();
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserInfo();
        this.renderWishlist();
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        if (!user.email) {
            window.location.href = 'login.html';
        }
    }

    loadUserInfo() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        document.getElementById('user-name').textContent = user.name || 'User';
        document.getElementById('sidebar-name').textContent = user.name || 'User';
        document.getElementById('sidebar-email').textContent = user.email || 'user@example.com';
    }

    getWishlistFromStorage() {
        return JSON.parse(localStorage.getItem('flipkart_wishlist') || '[]');
    }

    getAllProducts() {
        // Same products as in app.js
        return [
            { 
                id: 1, 
                name: "iPhone 15 Pro Max", 
                price: 134900, 
                originalPrice: 139900, 
                category: "mobile", 
                discount: 4,
                image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center"
            },
            { 
                id: 2, 
                name: "Samsung Galaxy S24 Ultra", 
                price: 124999, 
                originalPrice: 129999, 
                category: "mobile", 
                discount: 4,
                image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center"
            },
            { 
                id: 3, 
                name: "OnePlus 12", 
                price: 64999, 
                originalPrice: 69999, 
                category: "mobile", 
                discount: 7,
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center"
            },
            { 
                id: 7, 
                name: "MacBook Air M3", 
                price: 114900, 
                originalPrice: 119900, 
                category: "laptop", 
                discount: 4,
                image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center"
            },
            { 
                id: 9, 
                name: "Sony WH-1000XM5", 
                price: 29990, 
                originalPrice: 34990, 
                category: "audio", 
                discount: 14,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center"
            }
        ];
    }

    renderWishlist() {
        const container = document.getElementById('wishlist-container');
        const wishlistProducts = this.wishlist.map(id => this.products.find(p => p.id === id)).filter(Boolean);
        
        document.getElementById('wishlist-count').textContent = wishlistProducts.length;

        if (wishlistProducts.length === 0) {
            container.innerHTML = this.renderEmptyWishlist();
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${wishlistProducts.map(product => this.renderWishlistItem(product)).join('')}
            </div>
        `;
    }

    renderWishlistItem(product) {
        return `
            <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div class="relative">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
                    <button onclick="wishlistApp.removeFromWishlist(${product.id})" 
                            class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition">
                        <i class="fas fa-times text-red-500"></i>
                    </button>
                    <div class="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        ${product.discount}% OFF
                    </div>
                </div>
                
                <div class="p-4">
                    <h3 class="font-medium text-gray-800 mb-2 line-clamp-2">${product.name}</h3>
                    <div class="flex items-center space-x-2 mb-4">
                        <span class="text-lg font-bold">₹${product.price.toLocaleString()}</span>
                        <span class="text-gray-500 line-through text-sm">₹${product.originalPrice.toLocaleString()}</span>
                    </div>
                    
                    <div class="flex space-x-2">
                        <button onclick="wishlistApp.addToCart(${product.id})" 
                                class="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded font-medium transition">
                            Add to Cart
                        </button>
                        <button onclick="wishlistApp.viewProduct(${product.id})" 
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyWishlist() {
        return `
            <div class="text-center py-16">
                <div class="mb-6">
                    <i class="fas fa-heart text-6xl text-gray-300"></i>
                </div>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Your wishlist is empty</h2>
                <p class="text-gray-600 mb-8">Add items that you like to your wishlist. Review them anytime and easily move them to the bag.</p>
                <a href="index.html" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-block">
                    Continue Shopping
                </a>
            </div>
        `;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const cart = JSON.parse(localStorage.getItem('flipkart_cart') || '[]');
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('flipkart_cart', JSON.stringify(cart));
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(id => id !== productId);
        localStorage.setItem('flipkart_wishlist', JSON.stringify(this.wishlist));
        this.renderWishlist();
        this.showNotification('Item removed from wishlist', 'info');
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            sessionStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'product.html';
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        
        const notification = document.createElement('div');
        notification.className = `p-4 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300 mb-2 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);

        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Global functions
function logout() {
    localStorage.removeItem('flipkart_user');
    localStorage.removeItem('flipkart_cart');
    localStorage.removeItem('flipkart_wishlist');
    window.location.href = 'login.html';
}

// Initialize wishlist app
const wishlistApp = new WishlistApp();