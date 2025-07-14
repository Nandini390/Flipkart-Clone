// Modern Flipkart Clone JavaScript - 2025

class FlipkartClone {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.cart = JSON.parse(localStorage.getItem('flipkart_cart')) || [];
        this.products = this.getAllProducts();
        this.init();
    }

    init() {
        this.initSlider();
        this.loadSmartphoneDeals();
        this.loadProducts();
        this.loadElectronics();
        this.loadFashion();
        this.loadHomeProducts();
        this.loadSportsProducts();
        this.setupEventListeners();
        this.setupSearch();
        this.updateCartCount();
        this.updateLoginUI();
    }

    updateLoginUI() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        const loginBtn = document.getElementById('login-dropdown-btn');
        const loginText = document.getElementById('login-text');
        const menuContent = document.getElementById('login-menu-content');
        
        if (!loginBtn || !loginText || !menuContent) return;
        
        if (user.email) {
            loginText.textContent = user.name || 'Account';
            menuContent.innerHTML = `
                <div class="p-4 border-b">
                    <div class="text-sm font-medium text-gray-800">Hello, ${user.name || 'User'}</div>
                    <div class="text-xs text-gray-600">${user.email}</div>
                </div>
                <div class="p-4 space-y-2">
                    <a href="profile.html" class="block text-sm text-gray-700 hover:text-blue-600">My Profile</a>
                    <a href="orders.html" class="block text-sm text-gray-700 hover:text-blue-600">Orders</a>
                    <a href="wishlist.html" class="block text-sm text-gray-700 hover:text-blue-600">Wishlist</a>
                    <a href="addresses.html" class="block text-sm text-gray-700 hover:text-blue-600">Addresses</a>
                    <hr class="my-2">
                    <button onclick="flipkartClone.logout()" class="block w-full text-left text-sm text-red-600 hover:text-red-800">Logout</button>
                </div>
            `;
        } else {
            loginText.textContent = 'Login';
            menuContent.innerHTML = `
                <div class="p-6">
                    <div class="mb-4">
                        <div class="text-lg font-medium text-gray-800 mb-1">Login</div>
                        <div class="text-sm text-gray-600">Get access to your Orders, Wishlist and Recommendations</div>
                    </div>
                    <div class="space-y-3">
                        <button onclick="location.href='login.html'" class="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm font-medium hover:bg-blue-700">
                            Continue
                        </button>
                        <div class="text-center">
                            <a href="login.html" class="text-blue-600 text-sm hover:underline">New to Flipkart? Create an account</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    logout() {
        localStorage.removeItem('flipkart_user');
        localStorage.removeItem('flipkart_cart');
        localStorage.removeItem('flipkart_wishlist');
        localStorage.removeItem('flipkart_addresses');
        localStorage.removeItem('flipkart_orders');
        this.cart = [];
        this.updateCartCount();
        this.updateLoginUI();
        this.showNotification('Logged out successfully!', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        let cart = JSON.parse(localStorage.getItem('flipkart_cart')) || [];
        
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('flipkart_cart', JSON.stringify(cart));
        this.cart = cart;
        this.updateCartCount();
        this.showNotification(`${product.name} added to cart!`, 'success');
        
        console.log('Cart updated:', cart);
    }

    addToWishlist(productId) {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        if (!user.email) {
            this.showNotification('Please login to add items to wishlist', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        let wishlist = JSON.parse(localStorage.getItem('flipkart_wishlist') || '[]');
        
        if (wishlist.find(item => item.id === productId)) {
            this.showNotification('Item already in wishlist!', 'info');
            return;
        }

        wishlist.push(product);
        localStorage.setItem('flipkart_wishlist', JSON.stringify(wishlist));
        this.showNotification(`${product.name} added to wishlist!`, 'success');
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            sessionStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.href = 'product.html';
        }
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('flipkart_cart')) || [];
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    loadProductGrid(containerId, products) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = products.map(product => `
            <div class="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                 onclick="flipkartClone.viewProduct(${product.id})">
                <div class="relative">
                    <div class="w-full h-48 bg-gray-50 overflow-hidden">
                        <img src="${product.image}" 
                             alt="${product.name}"
                             class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                             loading="lazy">
                    </div>
                    <div class="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        ${product.discount}% OFF
                    </div>
                    <button onclick="event.stopPropagation(); flipkartClone.addToWishlist(${product.id})" 
                            class="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition">
                        <i class="far fa-heart text-gray-600 hover:text-red-500"></i>
                    </button>
                </div>
                <div class="p-4">
                    <h3 class="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">${product.name}</h3>
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="text-lg font-bold">₹${product.price.toLocaleString()}</span>
                        <span class="text-gray-500 line-through text-sm">₹${product.originalPrice.toLocaleString()}</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex text-yellow-400 text-sm">
                            ${'★'.repeat(4)}☆
                        </div>
                        <button onclick="event.stopPropagation(); flipkartClone.addToCart(${product.id})" 
                                class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        const results = this.products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        const productsSection = document.querySelector('#products-grid').closest('section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        if (results.length > 0) {
            this.loadProductGrid('products-grid', results.slice(0, 8));
            
            const sectionTitle = productsSection?.querySelector('h2');
            if (sectionTitle) {
                sectionTitle.textContent = `Search Results for "${query}" (${results.length} items)`;
            }
        } else {
            const container = document.getElementById('products-grid');
            if (container) {
                container.innerHTML = `
                    <div class="col-span-full text-center py-8">
                        <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                        <p class="text-gray-500 text-lg">No products found for "${query}"</p>
                        <button onclick="location.reload()" class="mt-4 text-blue-600 hover:underline">Clear Search</button>
                    </div>
                `;
            }
        }
    }

    getAllProducts() {
        return [
            // Electronics - Smartphones
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
                images: [
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Experience the iPhone 15 Pro Max with breakthrough titanium design, A17 Pro chip with 6 cores, advanced camera system with 5x Telephoto lens, and Action button.",
                features: ["A17 Pro chip", "Titanium Design", "48MP Camera", "5x Telephoto", "Action Button", "USB-C"],
                specifications: {
                    "Display": "6.7-inch Super Retina XDR",
                    "Chip": "A17 Pro",
                    "Storage": "256GB",
                    "Camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto",
                    "Battery": "Up to 29 hours video playback",
                    "OS": "iOS 17"
                },
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
                images: [
                    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Galaxy S24 Ultra with Galaxy AI, 200MP camera, S Pen, and Snapdragon 8 Gen 3 processor for flagship performance.",
                features: ["Galaxy AI", "200MP Camera", "S Pen", "Snapdragon 8 Gen 3", "5000mAh Battery"],
                specifications: {
                    "Display": "6.8-inch Dynamic AMOLED 2X",
                    "Processor": "Snapdragon 8 Gen 3",
                    "Storage": "512GB",
                    "Camera": "200MP Main, 12MP Ultra Wide, 10MP Telephoto x2",
                    "Battery": "5000mAh",
                    "OS": "Android 14 with One UI 6.1"
                },
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 3, 
                name: "OnePlus 12 256GB", 
                price: 64999, 
                originalPrice: 69999, 
                discount: 7, 
                category: "Electronics", 
                subcategory: "Smartphones",
                brand: "OnePlus",
                rating: 4.4,
                reviewCount: 1243,
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center"
                ],
                description: "OnePlus 12 with Snapdragon 8 Gen 3, 100W SuperVOOC fast charging, and Hasselblad camera system.",
                features: ["Snapdragon 8 Gen 3", "100W Fast Charging", "Hasselblad Camera", "120Hz Display"],
                specifications: {
                    "Display": "6.82-inch LTPO AMOLED",
                    "Processor": "Snapdragon 8 Gen 3",
                    "Storage": "256GB",
                    "Camera": "50MP Main, 64MP Telephoto, 48MP Ultra Wide",
                    "Battery": "5400mAh with 100W charging",
                    "OS": "OxygenOS 14"
                },
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 30, 
                name: "Xiaomi 14 Ultra", 
                price: 79999, 
                originalPrice: 89999, 
                discount: 11, 
                category: "Electronics", 
                subcategory: "Smartphones",
                brand: "Xiaomi",
                rating: 4.2,
                reviewCount: 856,
                image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Xiaomi 14 Ultra with Leica camera system, Snapdragon 8 Gen 3, and 90W fast charging.",
                features: ["Leica Camera", "Snapdragon 8 Gen 3", "90W Fast Charging", "5300mAh Battery"],
                inStock: true,
                fastDelivery: true
            },

            // Electronics - Laptops
            { 
                id: 4, 
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
                images: [
                    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center"
                ],
                description: "MacBook Air with M3 chip delivers exceptional performance and battery life in an incredibly thin design.",
                features: ["M3 Chip", "18 hours battery", "Liquid Retina Display", "1080p FaceTime HD Camera"],
                specifications: {
                    "Chip": "Apple M3 8-core CPU",
                    "Memory": "8GB unified memory",
                    "Storage": "256GB SSD",
                    "Display": "13.6-inch Liquid Retina",
                    "Battery": "Up to 18 hours",
                    "Weight": "1.24 kg"
                },
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 31, 
                name: "Dell XPS 13 Plus", 
                price: 89999, 
                originalPrice: 109999, 
                discount: 18, 
                category: "Electronics", 
                subcategory: "Laptops",
                brand: "Dell",
                rating: 4.3,
                reviewCount: 743,
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&crop=center",
                description: "Dell XPS 13 Plus with 12th Gen Intel processors and stunning InfinityEdge display.",
                features: ["12th Gen Intel", "InfinityEdge Display", "Premium Build", "Windows 11"],
                inStock: true,
                fastDelivery: false
            },
            { 
                id: 32, 
                name: "HP Spectre x360", 
                price: 104999, 
                originalPrice: 124999, 
                discount: 16, 
                category: "Electronics", 
                subcategory: "Laptops",
                brand: "HP",
                rating: 4.1,
                reviewCount: 567,
                image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center",
                description: "HP Spectre x360 convertible laptop with 360-degree hinge and premium design.",
                features: ["360-degree hinge", "Touch Display", "Intel Evo", "Bang & Olufsen Audio"],
                inStock: true,
                fastDelivery: true
            },

            // Electronics - Audio
            { 
                id: 5, 
                name: "Sony WH-1000XM5 Headphones", 
                price: 29990, 
                originalPrice: 34990, 
                discount: 14, 
                category: "Electronics", 
                subcategory: "Audio",
                brand: "Sony",
                rating: 4.7,
                reviewCount: 3421,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Industry-leading noise canceling headphones with exceptional sound quality and 30-hour battery life.",
                features: ["Industry-leading ANC", "30hr Battery", "Quick Charge", "Touch Controls"],
                specifications: {
                    "Driver": "30mm",
                    "Frequency Response": "4Hz-40kHz",
                    "Battery Life": "30 hours with ANC",
                    "Charging": "USB-C Quick Charge",
                    "Weight": "250g",
                    "Connectivity": "Bluetooth 5.2, NFC"
                },
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 33, 
                name: "Apple AirPods Pro 2", 
                price: 24900, 
                originalPrice: 26900, 
                discount: 7, 
                category: "Electronics", 
                subcategory: "Audio",
                brand: "Apple",
                rating: 4.5,
                reviewCount: 2156,
                image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&h=400&fit=crop&crop=center",
                description: "AirPods Pro with adaptive audio, personalized spatial audio, and up to 2x more noise cancellation.",
                features: ["Adaptive Audio", "Personalized Spatial Audio", "Active Noise Cancellation", "USB-C"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 34, 
                name: "Bose QuietComfort 45", 
                price: 26999, 
                originalPrice: 32900, 
                discount: 18, 
                category: "Electronics", 
                subcategory: "Audio",
                brand: "Bose",
                rating: 4.4,
                reviewCount: 1876,
                image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=center",
                description: "Bose QuietComfort 45 with world-class noise cancellation and premium comfort.",
                features: ["World-class ANC", "24hr Battery", "TriPort Acoustic", "Premium Comfort"],
                inStock: true,
                fastDelivery: false
            },

            // Electronics - Tablets
            { 
                id: 6, 
                name: "iPad Pro 12.9\" M2", 
                price: 99900, 
                originalPrice: 112900, 
                discount: 12, 
                category: "Electronics", 
                subcategory: "Tablets",
                brand: "Apple",
                rating: 4.6,
                reviewCount: 876,
                image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop&crop=center"
                ],
                description: "iPad Pro with M2 chip, Liquid Retina XDR display, and support for Apple Pencil and Magic Keyboard.",
                features: ["M2 Chip", "Liquid Retina XDR", "Apple Pencil Support", "Magic Keyboard Compatible"],
                specifications: {
                    "Chip": "Apple M2",
                    "Display": "12.9-inch Liquid Retina XDR",
                    "Storage": "128GB",
                    "Camera": "12MP Wide, 10MP Ultra Wide",
                    "Battery": "Up to 10 hours",
                    "Connectivity": "Wi-Fi 6E, USB-C"
                },
                inStock: true,
                fastDelivery: true
            },

            // Fashion - Men's Clothing
            { 
                id: 7, 
                name: "Nike Air Max 270", 
                price: 12995, 
                originalPrice: 15995, 
                discount: 19, 
                category: "Fashion", 
                subcategory: "Footwear",
                brand: "Nike",
                rating: 4.3,
                reviewCount: 2341,
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Nike Air Max 270 with large Max Air unit and comfortable mesh upper for everyday wear.",
                features: ["Max Air Unit", "Mesh Upper", "Comfortable Fit", "Durable Sole"],
                specifications: {
                    "Upper": "Mesh and synthetic materials",
                    "Sole": "Rubber with Max Air",
                    "Color": "Black/White",
                    "Sizes": "UK 6-12",
                    "Weight": "320g (UK 8)",
                    "Style": "Casual/Sports"
                },
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 8, 
                name: "Levi's 511 Slim Jeans", 
                price: 3999, 
                originalPrice: 4999, 
                discount: 20, 
                category: "Fashion", 
                subcategory: "Men's Clothing",
                brand: "Levi's",
                rating: 4.2,
                reviewCount: 1567,
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Levi's 511 Slim jeans with perfect fit and premium denim quality.",
                features: ["Slim Fit", "Premium Denim", "Classic 5-Pocket", "Comfortable Stretch"],
                specifications: {
                    "Fit": "Slim through hip and thigh",
                    "Material": "98% Cotton, 2% Elastane",
                    "Wash": "Dark Indigo",
                    "Rise": "Sits below waist",
                    "Leg Opening": "14.5 inches",
                    "Care": "Machine wash cold"
                },
                inStock: true,
                fastDelivery: false
            },
            { 
                id: 35, 
                name: "Adidas Ultraboost 22", 
                price: 16999, 
                originalPrice: 19999, 
                discount: 15, 
                category: "Fashion", 
                subcategory: "Footwear",
                brand: "Adidas",
                rating: 4.4,
                reviewCount: 1876,
                image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop&crop=center",
                description: "Adidas Ultraboost 22 with responsive Boost midsole and Primeknit upper.",
                features: ["Boost Midsole", "Primeknit Upper", "Continental Rubber", "Energy Return"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 36, 
                name: "Tommy Hilfiger Cotton Shirt", 
                price: 2999, 
                originalPrice: 4499, 
                discount: 33, 
                category: "Fashion", 
                subcategory: "Men's Clothing",
                brand: "Tommy Hilfiger",
                rating: 4.1,
                reviewCount: 734,
                image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop&crop=center",
                description: "Tommy Hilfiger premium cotton shirt with classic fit and modern styling.",
                features: ["100% Cotton", "Classic Fit", "Button-down Collar", "Machine Washable"],
                inStock: true,
                fastDelivery: false
            },

            // Fashion - Women's Clothing
            { 
                id: 37, 
                name: "Zara Midi Dress", 
                price: 2299, 
                originalPrice: 2999, 
                discount: 23, 
                category: "Fashion", 
                subcategory: "Women's Clothing",
                brand: "Zara",
                rating: 4.2,
                reviewCount: 987,
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop&crop=center",
                description: "Elegant midi dress perfect for casual and formal occasions.",
                features: ["Midi Length", "Comfortable Fit", "Versatile Design", "Machine Washable"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 38, 
                name: "H&M Denim Jacket", 
                price: 1799, 
                originalPrice: 2499, 
                discount: 28, 
                category: "Fashion", 
                subcategory: "Women's Clothing",
                brand: "H&M",
                rating: 4.0,
                reviewCount: 654,
                image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop&crop=center",
                description: "Classic denim jacket with vintage wash and comfortable fit.",
                features: ["Classic Cut", "Vintage Wash", "Button Closure", "Multiple Pockets"],
                inStock: true,
                fastDelivery: false
            },

            // Home & Kitchen
            { 
                id: 9, 
                name: "Instant Pot Duo 7-in-1", 
                price: 8999, 
                originalPrice: 12999, 
                discount: 31, 
                category: "Home", 
                subcategory: "Kitchen Appliances",
                brand: "Instant Pot",
                rating: 4.5,
                reviewCount: 4567,
                image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center"
                ],
                description: "7-in-1 electric pressure cooker that replaces multiple kitchen appliances.",
                features: ["7 Functions in 1", "6 Quart Capacity", "Safe & Easy", "Energy Efficient"],
                specifications: {
                    "Capacity": "6 Quart (5.7L)",
                    "Functions": "Pressure Cook, Slow Cook, Rice Cooker, Steamer, Sauté, Yogurt Maker, Warmer",
                    "Material": "Stainless Steel",
                    "Safety": "10 safety mechanisms",
                    "Power": "1000W",
                    "Warranty": "1 Year"
                },
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 10, 
                name: "Dyson V15 Detect Vacuum", 
                price: 65900, 
                originalPrice: 75900, 
                discount: 13, 
                category: "Home", 
                subcategory: "Cleaning",
                brand: "Dyson",
                rating: 4.6,
                reviewCount: 1234,
                image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Powerful cordless vacuum with laser dust detection and intelligent suction.",
                features: ["Laser Dust Detection", "Intelligent Suction", "60min Runtime", "Whole Machine Filtration"],
                specifications: {
                    "Motor": "Dyson Hyperdymium",
                    "Suction": "230 Air Watts",
                    "Battery": "Up to 60 minutes",
                    "Bin Capacity": "0.76L",
                    "Weight": "3.1kg",
                    "Filtration": "HEPA"
                },
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 39, 
                name: "Philips Air Fryer", 
                price: 12999, 
                originalPrice: 16999, 
                discount: 24, 
                category: "Home", 
                subcategory: "Kitchen Appliances",
                brand: "Philips",
                rating: 4.3,
                reviewCount: 2345,
                image: "https://images.unsplash.com/photo-1585515656662-a8a7bb2ba19d?w=400&h=400&fit=crop&crop=center",
                description: "Philips Air Fryer for healthy cooking with little to no oil.",
                features: ["Rapid Air Technology", "4.1L Capacity", "Digital Display", "Easy Clean"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 40, 
                name: "Bajaj Majesty RX11 OTG", 
                price: 4999, 
                originalPrice: 6999, 
                discount: 29, 
                category: "Home", 
                subcategory: "Kitchen Appliances",
                brand: "Bajaj",
                rating: 4.0,
                reviewCount: 876,
                image: "https://images.unsplash.com/photo-1574781330855-d0db0021996a?w=400&h=400&fit=crop&crop=center",
                description: "Bajaj Majesty OTG with multiple cooking functions and timer control.",
                features: ["28L Capacity", "Multiple Functions", "Timer Control", "Heat Resistant Glass"],
                inStock: true,
                fastDelivery: false
            },

            // Sports & Fitness
            { 
                id: 11, 
                name: "Premium Yoga Mat", 
                price: 1999, 
                originalPrice: 2999, 
                discount: 33, 
                category: "Sports", 
                subcategory: "Fitness",
                brand: "Liforme",
                rating: 4.4,
                reviewCount: 1876,
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Premium yoga mat with superior grip and cushioning for comfortable practice.",
                features: ["Superior Grip", "6mm Thickness", "Eco-Friendly", "Alignment Guides"],
                specifications: {
                    "Material": "Natural Rubber",
                    "Thickness": "6mm",
                    "Size": "185cm x 68cm",
                    "Weight": "2.5kg",
                    "Grip": "Superior non-slip",
                    "Care": "Wipe clean"
                },
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 12, 
                name: "Resistance Bands Set", 
                price: 899, 
                originalPrice: 1299, 
                discount: 31, 
                category: "Sports", 
                subcategory: "Fitness",
                brand: "Boldfit",
                rating: 4.2,
                reviewCount: 3456,
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center",
                images: [
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Complete resistance bands set for full-body workout at home or gym.",
                features: ["5 Resistance Levels", "Full Body Workout", "Portable", "Durable Material"],
                specifications: {
                    "Bands": "5 different resistance levels",
                    "Material": "Natural latex",
                    "Handles": "Comfortable foam grips",
                    "Accessories": "Door anchor, ankle straps",
                    "Resistance": "10-50 lbs",
                    "Warranty": "6 months"
                },
                inStock: true,
                fastDelivery: false
            },
            { 
                id: 41, 
                name: "Decathlon Treadmill", 
                price: 45999, 
                originalPrice: 54999, 
                discount: 16, 
                category: "Sports", 
                subcategory: "Fitness Equipment",
                brand: "Decathlon",
                rating: 4.1,
                reviewCount: 567,
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center",
                description: "Home treadmill with multiple programs and heart rate monitoring.",
                features: ["12 Programs", "Heart Rate Monitor", "Folding Design", "Safety Key"],
                inStock: true,
                fastDelivery: false
            },

            // Beauty & Personal Care
            { 
                id: 42, 
                name: "Lakme Absolute Foundation", 
                price: 899, 
                originalPrice: 1200, 
                discount: 25, 
                category: "Beauty", 
                subcategory: "Makeup",
                brand: "Lakme",
                rating: 4.2,
                reviewCount: 2134,
                image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center",
                description: "Lakme Absolute foundation for flawless, long-lasting coverage.",
                features: ["Full Coverage", "Long Lasting", "SPF Protection", "Multiple Shades"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 43, 
                name: "Neutrogena Face Wash", 
                price: 399, 
                originalPrice: 499, 
                discount: 20, 
                category: "Beauty", 
                subcategory: "Skincare",
                brand: "Neutrogena",
                rating: 4.3,
                reviewCount: 3456,
                image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop&crop=center",
                description: "Gentle daily face wash for clear, healthy-looking skin.",
                features: ["Oil-Free Formula", "Deep Cleansing", "Dermatologist Tested", "Daily Use"],
                inStock: true,
                fastDelivery: true
            },

            // Books & Media
            { 
                id: 44, 
                name: "Atomic Habits by James Clear", 
                price: 399, 
                originalPrice: 599, 
                discount: 33, 
                category: "Books", 
                subcategory: "Self-Help",
                brand: "Random House",
                rating: 4.7,
                reviewCount: 12456,
                image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center",
                description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
                features: ["Bestseller", "Life-changing", "Practical Guide", "Easy to Read"],
                inStock: true,
                fastDelivery: true
            },
            { 
                id: 45, 
                name: "The Psychology of Money", 
                price: 299, 
                originalPrice: 450, 
                discount: 34, 
                category: "Books", 
                subcategory: "Finance",
                brand: "Jaico Publishing",
                rating: 4.6,
                reviewCount: 8765,
                image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop&crop=center",
                description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel",
                features: ["Financial Wisdom", "Easy to Understand", "Real Stories", "Investment Guide"],
                inStock: true,
                fastDelivery: true
            }
        ];
    }

    loadSmartphoneDeals() {
        const smartphones = this.products.filter(p => p.category === "Electronics" && p.name.includes("iPhone") || p.name.includes("Galaxy") || p.name.includes("OnePlus"));
        this.loadProductGrid('smartphone-deals', smartphones.slice(0, 6));
    }

    loadElectronics() {
        const electronics = this.products.filter(p => p.category === "Electronics");
        this.loadProductGrid('electronics-section', electronics.slice(0, 6));
    }

    loadFashion() {
        const fashion = this.products.filter(p => p.category === "Fashion");
        this.loadProductGrid('fashion-section', fashion.slice(0, 6));
    }

    loadHomeProducts() {
        const home = this.products.filter(p => p.category === "Home");
        this.loadProductGrid('home-section', home.slice(0, 6));
    }

    loadSportsProducts() {
        const sports = this.products.filter(p => p.category === "Sports");
        this.loadProductGrid('sports-section', sports.slice(0, 6));
    }

    loadProducts() {
        this.loadProductGrid('products-grid', this.products.slice(0, 8));
    }

    initSlider() {
        this.autoSlide();
    }

    autoSlide() {
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }

    updateSlider() {
        const track = document.getElementById('slider-track');
        if (track) {
            track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }

        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }

    setupEventListeners() {
        const loginBtns = document.querySelectorAll('[data-login]');
        loginBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        });
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const searchSuggestions = document.getElementById('search-suggestions');
        const suggestionList = document.getElementById('suggestion-list');
        const closeSuggestions = document.getElementById('close-suggestions');

        if (!searchInput) return;

        // Popular search terms
        const popularSearches = [
            "iPhone", "Samsung Galaxy", "MacBook", "Headphones", "Nike Shoes", 
            "Instant Pot", "Yoga Mat", "Air Fryer", "Books", "Foundation"
        ];

        // Show suggestions on focus
        searchInput.addEventListener('focus', () => {
            this.showSearchSuggestions(suggestionList, popularSearches);
            if (searchSuggestions) searchSuggestions.classList.remove('hidden');
        });

        // Hide suggestions on input blur (with delay for clicks)
        searchInput.addEventListener('blur', () => {
            setTimeout(() => {
                if (searchSuggestions) searchSuggestions.classList.add('hidden');
            }, 200);
        });

        // Close suggestions button
        if (closeSuggestions) {
            closeSuggestions.addEventListener('click', () => {
                searchSuggestions.classList.add('hidden');
            });
        }

        // Search on input change (live search)
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            if (query.length > 2) {
                const filtered = this.products.filter(product => 
                    product.name.toLowerCase().includes(query.toLowerCase()) ||
                    product.brand.toLowerCase().includes(query.toLowerCase()) ||
                    product.category.toLowerCase().includes(query.toLowerCase())
                );
                const suggestions = filtered.slice(0, 5).map(p => p.name);
                this.showSearchSuggestions(suggestionList, suggestions, query);
            } else {
                this.showSearchSuggestions(suggestionList, popularSearches);
            }
        });

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performAdvancedSearch(e.target.value);
            }
        });

        // Search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performAdvancedSearch(searchInput.value);
            });
        }

        // Setup filters
        this.setupFilters();
    }

    showSearchSuggestions(container, suggestions, query = '') {
        if (!container) return;
        
        container.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center"
                 onclick="flipkartClone.performAdvancedSearch('${suggestion}')">
                <i class="fas fa-search text-gray-400 mr-3"></i>
                <span>${query ? suggestion.replace(new RegExp(query, 'gi'), `<strong>$&</strong>`) : suggestion}</span>
            </div>
        `).join('');
    }

    performAdvancedSearch(query) {
        if (!query.trim()) return;
        
        // Hide suggestions
        const searchSuggestions = document.getElementById('search-suggestions');
        if (searchSuggestions) searchSuggestions.classList.add('hidden');
        
        // Show search results page
        this.showSearchResults(query);
    }

    showSearchResults(query) {
        const mainContent = document.getElementById('main-content');
        const searchResultsPage = document.getElementById('search-results-page');
        
        if (mainContent && searchResultsPage) {
            mainContent.classList.add('hidden');
            searchResultsPage.classList.remove('hidden');
            
            // Update breadcrumb
            const breadcrumb = document.getElementById('search-breadcrumb');
            if (breadcrumb) {
                breadcrumb.textContent = `Search results for "${query}"`;
            }
            
            // Perform search
            this.filterProducts(query);
        }
    }

    hideSearchResults() {
        const mainContent = document.getElementById('main-content');
        const searchResultsPage = document.getElementById('search-results-page');
        
        if (mainContent && searchResultsPage) {
            mainContent.classList.remove('hidden');
            searchResultsPage.classList.add('hidden');
        }
    }

    setupFilters() {
        // Price filter
        document.querySelectorAll('input[name="price"]').forEach(radio => {
            radio.addEventListener('change', () => this.applyFilters());
        });

        // Category filter
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // Rating filter
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.addEventListener('change', () => this.applyFilters());
        });

        // Discount filter
        document.querySelectorAll('input[name="discount"]').forEach(radio => {
            radio.addEventListener('change', () => this.applyFilters());
        });

        // Sort filter
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.applyFilters());
        }
    }

    filterProducts(searchQuery = '') {
        let filteredProducts = [...this.products];

        // Text search filter
        if (searchQuery) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply other filters
        filteredProducts = this.applyAllFilters(filteredProducts);

        // Display results
        this.displayFilteredProducts(filteredProducts, searchQuery);
    }

    applyFilters() {
        // Get search query if we're on search results page
        const breadcrumb = document.getElementById('search-breadcrumb');
        const searchQuery = breadcrumb ? breadcrumb.textContent.match(/"([^"]+)"/)?.[1] || '' : '';
        
        this.filterProducts(searchQuery);
    }

    applyAllFilters(products) {
        let filtered = [...products];

        // Price filter
        const priceFilter = document.querySelector('input[name="price"]:checked')?.value;
        if (priceFilter && priceFilter !== 'all') {
            filtered = filtered.filter(product => {
                switch(priceFilter) {
                    case 'under-1000': return product.price < 1000;
                    case '1000-5000': return product.price >= 1000 && product.price <= 5000;
                    case '5000-25000': return product.price >= 5000 && product.price <= 25000;
                    case 'above-25000': return product.price > 25000;
                    default: return true;
                }
            });
        }

        // Category filter
        const categoryFilters = Array.from(document.querySelectorAll('.category-filter:checked'))
            .map(cb => cb.value);
        if (categoryFilters.length > 0) {
            filtered = filtered.filter(product => 
                categoryFilters.includes(product.category)
            );
        }

        // Rating filter
        const ratingFilter = document.querySelector('input[name="rating"]:checked')?.value;
        if (ratingFilter && ratingFilter !== 'all') {
            const minRating = parseFloat(ratingFilter);
            filtered = filtered.filter(product => (product.rating || 4) >= minRating);
        }

        // Discount filter
        const discountFilter = document.querySelector('input[name="discount"]:checked')?.value;
        if (discountFilter && discountFilter !== 'all') {
            const minDiscount = parseInt(discountFilter);
            filtered = filtered.filter(product => product.discount >= minDiscount);
        }

        // Sort products
        const sortBy = document.getElementById('sort-select')?.value || 'relevance';
        filtered = this.sortProducts(filtered, sortBy);

        return filtered;
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch(sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 4) - (a.rating || 4));
            case 'discount':
                return sorted.sort((a, b) => b.discount - a.discount);
            default:
                return sorted;
        }
    }

    displayFilteredProducts(products, searchQuery) {
        const container = document.getElementById('filtered-products');
        const title = document.getElementById('search-results-title');
        const count = document.getElementById('search-results-count');

        if (!container) return;

        if (title) {
            title.textContent = searchQuery ? `Search Results for "${searchQuery}"` : 'All Products';
        }
        if (count) {
            count.textContent = `${products.length} results found`;
        }

        if (products.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-medium text-gray-600 mb-2">No products found</h3>
                    <p class="text-gray-500 mb-4">Try adjusting your search or filters</p>
                    <button onclick="flipkartClone.clearFilters()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                        Clear All Filters
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${products.map(product => `
                    <div class="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group border"
                         onclick="flipkartClone.viewProduct(${product.id})">
                        <div class="relative mb-4">
                            <div class="w-full h-48 bg-white rounded-lg overflow-hidden">
                                <img src="${product.image}" 
                                     alt="${product.name}"
                                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                     loading="lazy">
                            </div>
                            <div class="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                ${product.discount}% OFF
                            </div>
                            ${product.fastDelivery ? `
                                <div class="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                    Fast Delivery
                                </div>
                            ` : ''}
                            <button onclick="event.stopPropagation(); flipkartClone.addToWishlist(${product.id})" 
                                    class="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition">
                                <i class="far fa-heart text-gray-600 hover:text-red-500"></i>
                            </button>
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 mb-1">${product.brand}</div>
                            <h3 class="font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">${product.name}</h3>
                            <div class="flex items-center space-x-2 mb-2">
                                <span class="text-lg font-bold">₹${product.price.toLocaleString()}</span>
                                <span class="text-gray-500 line-through text-sm">₹${product.originalPrice.toLocaleString()}</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center space-x-1">
                                    <div class="flex text-yellow-400 text-sm">
                                        ${'★'.repeat(Math.floor(product.rating || 4))}${'☆'.repeat(5 - Math.floor(product.rating || 4))}
                                    </div>
                                    <span class="text-xs text-gray-500">(${product.reviewCount || 0})</span>
                                </div>
                                <button onclick="event.stopPropagation(); flipkartClone.addToCart(${product.id})" 
                                        class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm transition">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    clearFilters() {
        // Reset all filters
        document.querySelectorAll('input[name="price"]').forEach(radio => {
            radio.checked = radio.value === 'all';
        });
        
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.checked = radio.value === 'all';
        });
        
        document.querySelectorAll('input[name="discount"]').forEach(radio => {
            radio.checked = radio.value === 'all';
        });
        
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.value = 'relevance';
        }
        
        // Reapply filters (which will now show all products)
        this.applyFilters();
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

function goToSlide(slideIndex) {
    if (window.flipkartClone) {
        window.flipkartClone.goToSlide(slideIndex);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.flipkartClone = new FlipkartClone();
});
