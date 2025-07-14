// Enhanced Product Page JavaScript - 2025

class ProductPage {
    constructor() {
        this.product = null;
        this.selectedImageIndex = 0;
        this.products = this.getAllProducts();
        this.init();
    }

    init() {
        this.loadProduct();
        this.loadRelatedProducts();
        this.updateCartCount();
    }

    getAllProducts() {
        // Same products array as in app.js (simplified for this demo)
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
                images: [
                    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop&crop=center"
                ],
                description: "Experience the iPhone 15 Pro Max with breakthrough titanium design, A17 Pro chip with 6 cores, advanced camera system with 5x Telephoto lens, and Action button. The most advanced iPhone ever with incredible performance and battery life.",
                features: ["A17 Pro chip", "Titanium Design", "48MP Camera", "5x Telephoto", "Action Button", "USB-C"],
                specifications: {
                    "Display": "6.7-inch Super Retina XDR OLED, 2796 x 1290 pixels, 460 ppi",
                    "Chip": "A17 Pro with 6-core CPU, 6-core GPU, 16-core Neural Engine",
                    "Storage": "256GB",
                    "Camera": "48MP Main, 12MP Ultra Wide, 12MP Telephoto (5x zoom)",
                    "Front Camera": "12MP TrueDepth",
                    "Battery": "Up to 29 hours video playback",
                    "Operating System": "iOS 17",
                    "Connectivity": "5G, Wi-Fi 6E, Bluetooth 5.3",
                    "Materials": "Titanium with textured matte glass back",
                    "Water Resistance": "IP68 (6 meters up to 30 minutes)",
                    "Dimensions": "159.9 × 76.7 × 8.25 mm",
                    "Weight": "221 grams"
                },
                inStock: true,
                fastDelivery: true,
                warranty: "1 Year Apple Limited Warranty",
                seller: "Apple India",
                highlights: [
                    "Forged in titanium and featuring the groundbreaking A17 Pro chip",
                    "Action button for quick access to your most-used features",
                    "The most advanced iPhone camera system ever",
                    "USB-C connector for universal compatibility"
                ]
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
                description: "Galaxy S24 Ultra with Galaxy AI, 200MP camera, S Pen, and Snapdragon 8 Gen 3 processor for flagship performance. Circle to Search with Google and Live Translate make this the most intelligent Galaxy yet.",
                features: ["Galaxy AI", "200MP Camera", "S Pen", "Snapdragon 8 Gen 3", "5000mAh Battery"],
                specifications: {
                    "Display": "6.8-inch Dynamic AMOLED 2X, 3120 x 1440 pixels, 120Hz",
                    "Processor": "Snapdragon 8 Gen 3 for Galaxy",
                    "Storage": "512GB UFS 4.0",
                    "RAM": "12GB",
                    "Camera": "200MP Main, 12MP Ultra Wide, 10MP Telephoto (3x), 10MP Telephoto (10x)",
                    "Front Camera": "12MP",
                    "Battery": "5000mAh with 45W fast charging",
                    "Operating System": "Android 14 with One UI 6.1",
                    "S Pen": "Built-in S Pen with Air Actions",
                    "Connectivity": "5G, Wi-Fi 7, Bluetooth 5.3",
                    "Water Resistance": "IP68",
                    "Dimensions": "162.3 × 79.0 × 8.6 mm",
                    "Weight": "232 grams"
                },
                inStock: true,
                fastDelivery: true,
                warranty: "1 Year Samsung India Warranty",
                seller: "Samsung India"
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
            }
        ];
    }

    loadProduct() {
        const productData = sessionStorage.getItem('selectedProduct');
        if (!productData) {
            // Fallback to first product if no selection
            this.product = this.products[0];
        } else {
            this.product = JSON.parse(productData);
        }

        this.renderProductDetails();
        this.updateBreadcrumb();
        this.loadReviews();
        this.loadQA();
    }

    renderProductDetails() {
        const container = document.getElementById('product-details');
        if (!container || !this.product) return;

        container.innerHTML = `
            <!-- Enhanced Product Images Section -->
            <div class="space-y-6 p-8">
                <!-- Main Image with zoom effect -->
                <div class="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
                    <img id="main-image" 
                         src="${this.product.image}" 
                         alt="${this.product.name}"
                         class="w-full h-full object-cover image-zoom cursor-zoom-in"
                         onclick="openImageModal('${this.product.image}')">
                </div>
                
                <!-- Thumbnail Images with better styling -->
                ${this.product.images && this.product.images.length > 1 ? `
                    <div class="grid grid-cols-4 gap-3">
                        ${this.product.images.map((img, index) => `
                            <div class="aspect-square bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg ${index === 0 ? 'ring-2 ring-blue-600 border-blue-600' : 'border-gray-200 hover:border-blue-400'}"
                                 onclick="productPage.changeMainImage('${img}', ${index})">
                                <img src="${img}" alt="Product view ${index + 1}" class="w-full h-full object-cover">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <!-- Enhanced Action Buttons -->
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="productPage.addToCart()" 
                            class="btn-primary text-white py-4 px-6 rounded-xl font-bold text-lg transition flex items-center justify-center hover:shadow-xl">
                        <i class="fas fa-shopping-cart mr-3"></i>
                        ADD TO CART
                    </button>
                    <button onclick="productPage.buyNow()" 
                            class="btn-secondary text-white py-4 px-6 rounded-xl font-bold text-lg transition flex items-center justify-center hover:shadow-xl">
                        <i class="fas fa-bolt mr-3"></i>
                        BUY NOW
                    </button>
                </div>
                
                <!-- Trust Indicators -->
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center justify-center space-x-6 text-sm text-green-700">
                        <div class="flex items-center">
                            <i class="fas fa-shield-check mr-2"></i>
                            <span>Secure Payment</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-undo mr-2"></i>
                            <span>Easy Returns</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-certificate mr-2"></i>
                            <span>Authentic</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Product Information Section -->
            <div class="space-y-8 p-8 bg-gray-50">
                <!-- Brand and Title -->
                <div>
                    <div class="text-gray-500 text-sm mb-2 uppercase tracking-wide font-medium">${this.product.brand}</div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-4 leading-tight">${this.product.name}</h1>
                    
                    <!-- Enhanced Rating & Reviews -->
                    <div class="flex items-center space-x-6 mb-6">
                        <div class="flex items-center space-x-2">
                            <div class="flex text-yellow-400 text-lg">
                                ${'★'.repeat(Math.floor(this.product.rating || 4))}${'☆'.repeat(5 - Math.floor(this.product.rating || 4))}
                            </div>
                            <span class="font-bold text-lg">${this.product.rating || 4.0}</span>
                        </div>
                        <div class="text-gray-600 font-medium">
                            ${this.product.reviewCount || 0} ratings & reviews
                        </div>
                        <button class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            Rate Product
                        </button>
                    </div>

                    <!-- Enhanced Pricing Section -->
                    <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
                        <div class="flex items-center space-x-4 mb-4">
                            <span class="text-4xl font-bold text-gray-900">₹${this.product.price.toLocaleString()}</span>
                            <span class="text-xl text-gray-500 line-through">₹${this.product.originalPrice.toLocaleString()}</span>
                            <span class="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                ${this.product.discount}% OFF
                            </span>
                        </div>
                        <div class="text-green-600 font-medium">
                            You save ₹${(this.product.originalPrice - this.product.price).toLocaleString()}!
                        </div>
                    </div>

                    <!-- Enhanced Key Features -->
                    ${this.product.features ? `
                        <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
                            <h3 class="font-bold text-lg mb-4 text-gray-800">
                                <i class="fas fa-star text-yellow-500 mr-2"></i>
                                Key Features
                            </h3>
                            <div class="grid grid-cols-1 gap-3">
                                ${this.product.features.map(feature => `
                                    <div class="flex items-center text-gray-700 bg-blue-50 rounded-lg p-3">
                                        <i class="fas fa-check-circle text-blue-600 mr-3"></i>
                                        <span class="font-medium">${feature}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Enhanced Delivery & Services -->
                    <div class="bg-white rounded-xl p-6 shadow-sm mb-6">
                        <h3 class="font-bold text-lg mb-4 text-gray-800">
                            <i class="fas fa-shipping-fast text-blue-600 mr-2"></i>
                            Delivery & Services
                        </h3>
                        <div class="space-y-4">
                            ${this.product.fastDelivery ? `
                                <div class="flex items-center p-3 bg-green-50 rounded-lg">
                                    <i class="fas fa-rocket text-green-600 mr-3 text-lg"></i>
                                    <div>
                                        <div class="font-semibold text-green-800">Fast Delivery</div>
                                        <div class="text-sm text-green-600">Get it by tomorrow</div>
                                    </div>
                                </div>
                            ` : `
                                <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                                    <i class="fas fa-truck text-blue-600 mr-3 text-lg"></i>
                                    <div>
                                        <div class="font-semibold text-blue-800">Standard Delivery</div>
                                        <div class="text-sm text-blue-600">3-5 business days</div>
                                    </div>
                                </div>
                            `}
                            
                            <div class="grid grid-cols-2 gap-4">
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <i class="fas fa-undo text-orange-600 mr-3"></i>
                                    <div>
                                        <div class="font-medium text-gray-800">7 Days Return</div>
                                        <div class="text-xs text-gray-600">Change of mind? No problem</div>
                                    </div>
                                </div>
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <i class="fas fa-shield-alt text-green-600 mr-3"></i>
                                    <div>
                                        <div class="font-medium text-gray-800">${this.product.warranty || '1 Year'} Warranty</div>
                                        <div class="text-xs text-gray-600">Know More</div>
                                    </div>
                                </div>
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <i class="fas fa-money-bill-wave text-green-600 mr-3"></i>
                                    <div>
                                        <div class="font-medium text-gray-800">Cash on Delivery</div>
                                        <div class="text-xs text-gray-600">Pay when you receive</div>
                                    </div>
                                </div>
                                <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <i class="fas fa-headset text-purple-600 mr-3"></i>
                                    <div>
                                        <div class="font-medium text-gray-800">24/7 Support</div>
                                        <div class="text-xs text-gray-600">Always here to help</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Enhanced Wishlist & Compare -->
                    <div class="flex space-x-4">
                        <button onclick="productPage.addToWishlist()" 
                                class="flex items-center text-gray-600 hover:text-red-500 transition bg-white px-4 py-2 rounded-lg shadow-sm border hover:shadow-md">
                            <i class="far fa-heart mr-2"></i>
                            <span class="font-medium">Add to Wishlist</span>
                        </button>
                        <button class="flex items-center text-gray-600 hover:text-blue-500 transition bg-white px-4 py-2 rounded-lg shadow-sm border hover:shadow-md">
                            <i class="fas fa-balance-scale mr-2"></i>
                            <span class="font-medium">Compare</span>
                        </button>
                        <button class="flex items-center text-gray-600 hover:text-green-500 transition bg-white px-4 py-2 rounded-lg shadow-sm border hover:shadow-md">
                            <i class="fas fa-share mr-2"></i>
                            <span class="font-medium">Share</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Load specifications
        this.loadSpecifications();
        this.loadDescription();
    }

    changeMainImage(imageSrc, index) {
        const mainImage = document.getElementById('main-image');
        if (mainImage) {
            mainImage.src = imageSrc;
        }

        // Update thumbnail selection
        document.querySelectorAll('.grid .aspect-square').forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('ring-2', 'ring-blue-600');
            } else {
                thumb.classList.remove('ring-2', 'ring-blue-600');
            }
        });

        this.selectedImageIndex = index;
    }

    loadDescription() {
        const container = document.getElementById('product-description');
        if (!container || !this.product) return;

        container.innerHTML = `
            <div class="prose max-w-none">
                <p class="text-lg leading-relaxed mb-6">${this.product.description}</p>
                
                ${this.product.features ? `
                    <h3 class="text-xl font-semibold mb-4">What makes it special</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        ${this.product.features.map(feature => `
                            <div class="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                                <i class="fas fa-star text-yellow-500 mt-1"></i>
                                <div>
                                    <h4 class="font-medium">${feature}</h4>
                                    <p class="text-sm text-gray-600 mt-1">Advanced feature for enhanced performance</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <h3 class="text-xl font-semibold mb-4">In the Box</h3>
                <ul class="list-disc list-inside space-y-2 mb-6">
                    <li>${this.product.name}</li>
                    <li>Charging Cable</li>
                    <li>User Manual</li>
                    <li>Warranty Card</li>
                    ${this.product.category === 'Electronics' && this.product.subcategory === 'Smartphones' ? '<li>SIM Ejector Tool</li>' : ''}
                </ul>
            </div>
        `;
    }

    loadSpecifications() {
        const container = document.getElementById('product-specifications');
        if (!container || !this.product || !this.product.specifications) return;

        container.innerHTML = `
            <div class="space-y-4">
                <h3 class="text-xl font-semibold mb-6">Technical Specifications</h3>
                <div class="bg-gray-50 rounded-lg overflow-hidden">
                    <table class="w-full">
                        <tbody>
                            ${Object.entries(this.product.specifications).map(([key, value], index) => `
                                <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                                    <td class="px-6 py-4 font-medium text-gray-700 w-1/3">${key}</td>
                                    <td class="px-6 py-4 text-gray-600">${value}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    loadReviews() {
        const container = document.getElementById('reviews-list');
        if (!container) return;

        // Sample reviews data
        const reviews = [
            {
                name: "Rajesh Kumar",
                rating: 5,
                date: "2 days ago",
                verified: true,
                title: "Excellent product!",
                review: "Amazing quality and fast delivery. The product exceeded my expectations. Highly recommended!",
                helpful: 24
            },
            {
                name: "Priya Sharma",
                rating: 4,
                date: "1 week ago",
                verified: true,
                title: "Good value for money",
                review: "Good product overall. The build quality is decent and it serves the purpose well. Could be slightly better but satisfied with the purchase.",
                helpful: 18
            },
            {
                name: "Amit Singh",
                rating: 5,
                date: "2 weeks ago",
                verified: true,
                title: "Perfect!",
                review: "Exactly what I was looking for. Great features and excellent performance. Will definitely buy again.",
                helpful: 31
            }
        ];

        container.innerHTML = reviews.map(review => `
            <div class="review-card border border-gray-200 rounded-xl p-6 transition-all">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            ${review.name.charAt(0)}
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800">${review.name}</div>
                            <div class="flex items-center space-x-2 text-sm text-gray-500">
                                <span>${review.date}</span>
                                ${review.verified ? '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"><i class="fas fa-check-circle mr-1"></i>Verified Purchase</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <div class="flex text-yellow-400 text-lg">
                            ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        </div>
                        <span class="font-bold text-gray-700">${review.rating}.0</span>
                    </div>
                </div>
                
                <h4 class="font-bold text-lg mb-3 text-gray-800">${review.title}</h4>
                <p class="text-gray-700 mb-4 leading-relaxed">${review.review}</p>
                
                <!-- Review Images (if any) -->
                <div class="grid grid-cols-4 gap-2 mb-4">
                    <div class="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        <i class="fas fa-image"></i>
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div class="flex items-center space-x-6 text-sm">
                        <button class="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition">
                            <i class="far fa-thumbs-up"></i>
                            <span>Helpful (${review.helpful})</span>
                        </button>
                        <button class="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition">
                            <i class="fas fa-reply"></i>
                            <span>Reply</span>
                        </button>
                        <button class="text-gray-500 hover:text-red-600 transition">
                            <i class="fas fa-flag mr-1"></i>Report
                        </button>
                    </div>
                    <div class="flex items-center space-x-2 text-sm text-gray-500">
                        <i class="fas fa-share"></i>
                        <span>Share</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadQA() {
        const container = document.getElementById('qa-list');
        if (!container) return;

        // Sample Q&A data
        const qaData = [
            {
                question: "Is this product original and comes with warranty?",
                answer: "Yes, this is 100% original product with full manufacturer warranty.",
                askedBy: "Suresh M.",
                answeredBy: "Seller",
                date: "5 days ago",
                helpful: 15
            },
            {
                question: "What is the return policy for this item?",
                answer: "This item has a 7-day return policy. You can return it within 7 days of delivery if you're not satisfied.",
                askedBy: "Deepika R.",
                answeredBy: "Flipkart Customer Care",
                date: "1 week ago",
                helpful: 23
            }
        ];

        container.innerHTML = qaData.map(qa => `
            <div class="border rounded-lg p-4">
                <div class="mb-3">
                    <h4 class="font-medium mb-2">Q: ${qa.question}</h4>
                    <div class="text-sm text-gray-500">Asked by ${qa.askedBy} • ${qa.date}</div>
                </div>
                
                <div class="bg-blue-50 rounded-lg p-3 mb-3">
                    <p class="mb-2"><strong>A:</strong> ${qa.answer}</p>
                    <div class="text-sm text-gray-600">Answered by ${qa.answeredBy}</div>
                </div>
                
                <button class="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600">
                    <i class="far fa-thumbs-up"></i>
                    <span>Helpful (${qa.helpful})</span>
                </button>
            </div>
        `).join('');
    }

    loadRelatedProducts() {
        const container = document.getElementById('related-products');
        if (!container || !this.product) return;

        // Get related products from same category
        const related = this.products
            .filter(p => p.id !== this.product.id && p.category === this.product.category)
            .slice(0, 4);

        container.innerHTML = related.map(product => `
            <div class="product-card bg-white rounded-xl p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-300 group"
                 onclick="productPage.selectProduct(${product.id})">
                <div class="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-4 relative group">
                    <img src="${product.image}" 
                         alt="${product.name}"
                         class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="bg-white text-red-500 w-10 h-10 rounded-full shadow-lg hover:bg-red-50 transition">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    ${product.discount ? `
                        <div class="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            ${product.discount}% OFF
                        </div>
                    ` : ''}
                </div>
                
                <div class="space-y-3">
                    <div class="text-xs text-gray-500 uppercase tracking-wide font-medium">${product.brand}</div>
                    <h3 class="font-bold text-lg text-gray-800 leading-tight group-hover:text-blue-600 transition line-clamp-2">${product.name}</h3>
                    
                    <div class="flex items-center space-x-1">
                        <div class="flex text-yellow-400 text-sm">
                            ${'★'.repeat(Math.floor(product.rating || 4))}${'☆'.repeat(5 - Math.floor(product.rating || 4))}
                        </div>
                        <span class="text-sm font-medium text-gray-700">${product.rating || 4.0}</span>
                        <span class="text-xs text-gray-500">(${product.reviewCount || 0})</span>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex items-center space-x-3">
                            <span class="text-2xl font-bold text-gray-900">₹${product.price.toLocaleString()}</span>
                            ${product.originalPrice ? `<span class="text-gray-500 line-through text-sm">₹${product.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                        
                        ${product.fastDelivery ? `
                            <div class="flex items-center text-green-600 text-xs font-medium">
                                <i class="fas fa-shipping-fast mr-1"></i>
                                <span>Fast Delivery</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <button class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                        <i class="fas fa-shopping-cart mr-2"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    selectProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            sessionStorage.setItem('selectedProduct', JSON.stringify(product));
            window.location.reload();
        }
    }

    updateBreadcrumb() {
        const categoryElement = document.getElementById('breadcrumb-category');
        const productElement = document.getElementById('breadcrumb-product');
        
        if (categoryElement && this.product) {
            categoryElement.textContent = this.product.category;
        }
        if (productElement && this.product) {
            productElement.textContent = this.product.name;
        }
    }

    addToCart() {
        if (!this.product) return;
        
        let cart = JSON.parse(localStorage.getItem('flipkart_cart')) || [];
        const existingItem = cart.find(item => item.id === this.product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...this.product, quantity: 1 });
        }
        
        localStorage.setItem('flipkart_cart', JSON.stringify(cart));
        this.updateCartCount();
        this.showNotification(`${this.product.name} added to cart!`, 'success');
    }

    addToWishlist() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        if (!user.email) {
            this.showNotification('Please login to add items to wishlist', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
            return;
        }

        if (!this.product) return;
        
        let wishlist = JSON.parse(localStorage.getItem('flipkart_wishlist') || '[]');
        
        if (wishlist.find(item => item.id === this.product.id)) {
            this.showNotification('Item already in wishlist!', 'info');
            return;
        }
        
        wishlist.push(this.product);
        localStorage.setItem('flipkart_wishlist', JSON.stringify(wishlist));
        this.showNotification(`${this.product.name} added to wishlist!`, 'success');
    }

    buyNow() {
        if (!this.product) return;
        
        // Add to cart first
        this.addToCart();
        
        // Redirect to cart page
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 500);
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('flipkart_cart')) || [];
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 p-4 rounded-lg text-white z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.productPage = new ProductPage();
});