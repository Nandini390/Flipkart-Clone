// Seller Page JavaScript

class SellerApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupFormListener();
    }

    setupFormListener() {
        document.getElementById('seller-form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    startSelling() {
        document.getElementById('seller-form').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('firstName').focus();
    }

    handleSubmit(event) {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            businessName: document.getElementById('businessName').value,
            gstin: document.getElementById('gstin').value,
            category: document.getElementById('category').value,
            address: document.getElementById('address').value,
            terms: document.getElementById('terms').checked
        };

        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }

        // Save seller registration data
        const sellerData = {
            ...formData,
            registrationDate: new Date().toISOString(),
            status: 'pending'
        };

        localStorage.setItem('flipkart_seller', JSON.stringify(sellerData));

        this.showNotification('Registration submitted successfully! We will contact you within 2-3 business days.', 'success');
        document.getElementById('seller-form').reset();
    }

    validateForm(data) {
        // Check required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'businessName', 'gstin', 'category', 'address'];
        for (let field of requiredFields) {
            if (!data[field]) {
                this.showNotification(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'error');
                return false;
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return false;
        }

        // Mobile validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(data.mobile)) {
            this.showNotification('Please enter a valid 10-digit mobile number', 'error');
            return false;
        }

        // GSTIN validation (basic check)
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        if (!gstinRegex.test(data.gstin)) {
            this.showNotification('Please enter a valid GSTIN', 'error');
            return false;
        }

        // Terms acceptance
        if (!data.terms) {
            this.showNotification('Please accept the terms and conditions', 'error');
            return false;
        }

        return true;
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        
        const notification = document.createElement('div');
        notification.className = `p-4 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300 mb-2 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`;
        notification.innerHTML = `
            <div class="flex items-center justify-between max-w-sm">
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
        }, type === 'success' ? 5000 : 3000);
    }
}

// Initialize seller app
const sellerApp = new SellerApp();