// Enhanced Checkout System - 2025

class CheckoutApp {
    constructor() {
        this.currentStep = 1;
        this.cart = JSON.parse(localStorage.getItem('flipkart_cart')) || [];
        this.selectedAddress = null;
        this.selectedPaymentMethod = 'cod';
        this.deliveryOption = 'standard';
        this.isProcessing = false;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadCartItems();
        this.calculateTotals();
        this.setupEventListeners();
        this.setupPaymentListeners();
        
        // Redirect if cart is empty
        if (this.cart.length === 0) {
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 100);
        }
    }

    checkAuth() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        if (!user.email) {
            sessionStorage.setItem('redirect_after_login', 'checkout.html');
            window.location.href = 'login.html';
        }
    }

    loadCartItems() {
        const orderSummaryContainer = document.getElementById('checkout-items-main');
        
        if (orderSummaryContainer && this.cart.length > 0) {
            orderSummaryContainer.innerHTML = this.cart.map(item => `
                <div class="flex items-center space-x-4 p-4 border rounded-lg">
                    <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-900 mb-1">${item.name}</h3>
                        <div class="flex items-center space-x-3 mb-2">
                            <span class="text-lg font-bold">₹${item.price.toLocaleString()}</span>
                            <span class="text-gray-500 line-through text-sm">₹${item.originalPrice.toLocaleString()}</span>
                            <span class="text-green-600 text-sm font-medium">${item.discount}% off</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-gray-600">Qty: ${item.quantity}</span>
                            <span class="text-green-600">
                                <i class="fas fa-truck mr-1"></i>
                                Free Delivery
                            </span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-bold">₹${(item.price * item.quantity).toLocaleString()}</div>
                        <div class="text-sm text-gray-500">Total</div>
                    </div>
                </div>
            `).join('');
        }
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const originalTotal = this.cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
        const discount = originalTotal - subtotal;
        const deliveryCharges = subtotal > 500 ? 0 : 40;
        const finalAmount = subtotal + deliveryCharges;
        const totalItemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };

        updateElement('item-count', totalItemCount);
        updateElement('items-total', `₹${originalTotal.toLocaleString()}`);
        updateElement('total-discount', `-₹${discount.toLocaleString()}`);
        updateElement('final-amount', `₹${finalAmount.toLocaleString()}`);
        updateElement('total-savings', `₹${discount.toLocaleString()}`);
    }

    nextStep() {
        // Set default address if none selected
        if (this.currentStep === 1 && !this.selectedAddress) {
            this.selectedAddress = 'default';
        }
        
        if (this.currentStep < 3) {
            this.currentStep++;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Hide all sections
        document.getElementById('address-section').classList.add('hidden');
        document.getElementById('order-summary-section').classList.add('hidden');
        document.getElementById('payment-section').classList.add('hidden');

        // Update step indicators
        for (let i = 1; i <= 3; i++) {
            const stepElement = document.getElementById(`step-${i}`);
            if (i < this.currentStep) {
                stepElement.className = 'step-arrow step-completed px-6 py-3 text-xs ml-2';
            } else if (i === this.currentStep) {
                stepElement.className = 'step-arrow step-active px-6 py-3 text-xs ml-2';
            } else {
                stepElement.className = 'step-arrow step-inactive px-6 py-3 text-xs ml-2';
            }
        }

        // Show current section
        switch (this.currentStep) {
            case 1:
                document.getElementById('address-section').classList.remove('hidden');
                break;
            case 2:
                document.getElementById('order-summary-section').classList.remove('hidden');
                this.loadCartItems(); // Refresh cart items
                break;
            case 3:
                document.getElementById('payment-section').classList.remove('hidden');
                break;
        }
    }

    setupEventListeners() {
        // Step navigation
        const nextButtons = document.querySelectorAll('.next-step');
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => this.nextStep());
        });

        // Address selection
        const addressRadios = document.querySelectorAll('input[name="address"]');
        addressRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedAddress = e.target.value;
            });
        });
    }

    setupPaymentListeners() {
        const paymentRadios = document.querySelectorAll('input[name="payment"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedPaymentMethod = e.target.value;
                this.updatePaymentUI();
                this.showPaymentDetails();
            });
        });

        // Update payment option styling
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }

    updatePaymentUI() {
        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.classList.remove('payment-selected');
            const radio = option.querySelector('input[type="radio"]');
            if (radio && radio.checked) {
                option.classList.add('payment-selected');
            }
        });
    }

    showPaymentDetails() {
        // Remove existing payment details
        const existingDetails = document.getElementById('payment-details');
        if (existingDetails) {
            existingDetails.remove();
        }

        const paymentSection = document.getElementById('payment-section');
        const paymentContent = paymentSection.querySelector('.p-6');

        let detailsHTML = '';

        switch (this.selectedPaymentMethod) {
            case 'upi':
                detailsHTML = this.getUPIDetails();
                break;
            case 'card':
                detailsHTML = this.getCardDetails();
                break;
            case 'netbanking':
                detailsHTML = this.getNetBankingDetails();
                break;
            case 'emi':
                detailsHTML = this.getEMIDetails();
                break;
            case 'cod':
                detailsHTML = this.getCODDetails();
                break;
        }

        if (detailsHTML) {
            const detailsDiv = document.createElement('div');
            detailsDiv.id = 'payment-details';
            detailsDiv.className = 'mt-6 p-4 bg-gray-50 rounded-lg';
            detailsDiv.innerHTML = detailsHTML;
            
            const continueButton = paymentContent.querySelector('.mt-6.pt-4');
            paymentContent.insertBefore(detailsDiv, continueButton);
        }
    }

    getUPIDetails() {
        return `
            <h4 class="font-medium mb-4">Enter UPI ID</h4>
            <div class="space-y-4">
                <div>
                    <input type="text" 
                           placeholder="Enter your UPI ID (e.g., yourname@paytm)"
                           class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="text-sm text-gray-600">
                    <i class="fas fa-info-circle mr-2"></i>
                    You will be redirected to your UPI app to complete the payment
                </div>
                <div class="flex space-x-4">
                    <img src="https://logos-world.net/wp-content/uploads/2020/11/Paytm-Logo.png" alt="Paytm" class="h-8">
                    <img src="https://logos-world.net/wp-content/uploads/2020/11/PhonePe-Logo.png" alt="PhonePe" class="h-8">
                    <img src="https://logoeps.com/wp-content/uploads/2013/12/google-pay-vector-logo.png" alt="Google Pay" class="h-8">
                </div>
            </div>
        `;
    }

    getCardDetails() {
        return `
            <h4 class="font-medium mb-4">Enter Card Details</h4>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Card Number</label>
                    <input type="text" 
                           placeholder="1234 5678 9012 3456"
                           maxlength="19"
                           class="card-input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                           oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim()">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">Expiry Date</label>
                        <input type="text" 
                               placeholder="MM/YY"
                               maxlength="5"
                               class="card-input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(.{2})/g, '$1/').substr(0,5)">
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-2">CVV</label>
                        <input type="password" 
                               placeholder="123"
                               maxlength="3"
                               class="card-input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Cardholder Name</label>
                    <input type="text" 
                           placeholder="Enter name as on card"
                           class="card-input w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                    <i class="fas fa-shield-alt text-green-500"></i>
                    <span>Your card details are secured with 256-bit SSL encryption</span>
                </div>
            </div>
        `;
    }

    getNetBankingDetails() {
        return `
            <h4 class="font-medium mb-4">Select Your Bank</h4>
            <div class="grid grid-cols-2 gap-3">
                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50">
                    <input type="radio" name="bank" value="sbi" class="mr-3">
                    <span class="text-sm">State Bank of India</span>
                </label>
                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50">
                    <input type="radio" name="bank" value="hdfc" class="mr-3">
                    <span class="text-sm">HDFC Bank</span>
                </label>
                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50">
                    <input type="radio" name="bank" value="icici" class="mr-3">
                    <span class="text-sm">ICICI Bank</span>
                </label>
                <label class="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50">
                    <input type="radio" name="bank" value="axis" class="mr-3">
                    <span class="text-sm">Axis Bank</span>
                </label>
            </div>
            <div class="mt-4 text-sm text-gray-600">
                <i class="fas fa-info-circle mr-2"></i>
                You will be redirected to your bank's website to complete the payment
            </div>
        `;
    }

    getEMIDetails() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return `
            <h4 class="font-medium mb-4">Choose EMI Plan</h4>
            <div class="space-y-3">
                <div class="p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-medium">3 Months EMI</div>
                            <div class="text-sm text-gray-600">Interest rate: 12% per annum</div>
                        </div>
                        <div class="text-right">
                            <div class="font-bold">₹${Math.ceil(total * 1.03 / 3).toLocaleString()}/month</div>
                            <div class="text-sm text-gray-600">Total: ₹${Math.ceil(total * 1.03).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div class="p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-medium">6 Months EMI</div>
                            <div class="text-sm text-gray-600">Interest rate: 14% per annum</div>
                        </div>
                        <div class="text-right">
                            <div class="font-bold">₹${Math.ceil(total * 1.07 / 6).toLocaleString()}/month</div>
                            <div class="text-sm text-gray-600">Total: ₹${Math.ceil(total * 1.07).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div class="p-4 border rounded-lg cursor-pointer hover:bg-blue-50">
                    <div class="flex justify-between items-center">
                        <div>
                            <div class="font-medium">12 Months EMI</div>
                            <div class="text-sm text-gray-600">Interest rate: 16% per annum</div>
                        </div>
                        <div class="text-right">
                            <div class="font-bold">₹${Math.ceil(total * 1.16 / 12).toLocaleString()}/month</div>
                            <div class="text-sm text-gray-600">Total: ₹${Math.ceil(total * 1.16).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getCODDetails() {
        return `
            <div class="flex items-start space-x-3">
                <i class="fas fa-money-bill-wave text-2xl text-green-500 mt-1"></i>
                <div>
                    <h4 class="font-medium mb-2">Cash on Delivery</h4>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>• Pay when you receive your order</li>
                        <li>• Carry exact change as delivery partners may not have change</li>
                        <li>• ₹15 handling charges may apply for orders below ₹500</li>
                        <li>• Available for orders up to ₹50,000</li>
                    </ul>
                </div>
            </div>
        `;
    }

    async placeOrder() {
        if (this.isProcessing) return;

        // Set default address if none selected
        if (!this.selectedAddress) {
            this.selectedAddress = 'default';
        }

        this.isProcessing = true;
        const button = document.querySelector('button[onclick="checkoutApp.placeOrder()"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading-spinner inline-block mr-2"></div>Processing...';
        button.disabled = true;

        try {
            // Simulate payment processing
            await this.processPayment();
            
            // Create order
            const orderId = 'FK' + Date.now().toString().slice(-8);
            const order = {
                id: orderId,
                date: new Date().toISOString(),
                items: this.cart,
                total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                discount: this.cart.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0),
                status: 'Order Confirmed',
                paymentMethod: this.selectedPaymentMethod,
                address: 'Default Address', // Would be actual address in real app
                expectedDelivery: this.getExpectedDelivery(),
                trackingNumber: 'TRK' + Date.now().toString().slice(-10)
            };

            // Save order
            const orders = JSON.parse(localStorage.getItem('flipkart_orders') || '[]');
            orders.unshift(order);
            localStorage.setItem('flipkart_orders', JSON.stringify(orders));

            // Clear cart
            localStorage.removeItem('flipkart_cart');

            // Show success modal
            this.showSuccessModal(orderId);

        } catch (error) {
            this.showNotification('Payment failed. Please try again.', 'error');
            console.error('Order placement failed:', error);
        } finally {
            button.innerHTML = originalText;
            button.disabled = false;
            this.isProcessing = false;
        }
    }

    async processPayment() {
        return new Promise((resolve, reject) => {
            // Simulate different payment processing times
            const processingTime = this.selectedPaymentMethod === 'cod' ? 1000 : 
                                 this.selectedPaymentMethod === 'upi' ? 2000 : 3000;
            
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve();
                } else {
                    reject(new Error('Payment failed'));
                }
            }, processingTime);
        });
    }

    getExpectedDelivery() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showSuccessModal(orderId) {
        const modal = document.getElementById('success-modal');
        modal.classList.remove('hidden');
        
        // Add order ID to modal
        const modalContent = modal.querySelector('.bg-white');
        const orderIdDiv = document.createElement('div');
        orderIdDiv.className = 'bg-blue-50 p-3 rounded mb-4 text-sm text-blue-800';
        orderIdDiv.innerHTML = `<strong>Order ID:</strong> ${orderId}`;
        modalContent.insertBefore(orderIdDiv, modalContent.querySelector('.bg-blue-50'));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-24 right-4 p-4 rounded-lg text-white z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize checkout when page loads
document.addEventListener('DOMContentLoaded', function() {
    window.checkoutApp = new CheckoutApp();
});