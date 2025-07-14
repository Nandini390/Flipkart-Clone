// Addresses Page JavaScript

class AddressApp {
    constructor() {
        this.addresses = this.getAddressesFromStorage();
        this.editingId = null;
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserInfo();
        this.renderAddresses();
        this.setupEventListeners();
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

    getAddressesFromStorage() {
        const stored = localStorage.getItem('flipkart_addresses');
        if (stored) {
            return JSON.parse(stored);
        }

        // Sample address data
        const sampleAddresses = [
            {
                id: 1,
                fullName: 'John Doe',
                mobile: '9876543210',
                address: '123 Tech Park, Sector 18',
                city: 'Gurgaon',
                state: 'Haryana',
                pincode: '122001',
                landmark: 'Near Metro Station',
                addressType: 'home',
                isDefault: true
            }
        ];

        localStorage.setItem('flipkart_addresses', JSON.stringify(sampleAddresses));
        return sampleAddresses;
    }

    setupEventListeners() {
        document.getElementById('address-form').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    renderAddresses() {
        const container = document.getElementById('addresses-container');
        
        if (this.addresses.length === 0) {
            container.innerHTML = this.renderEmptyAddresses();
            return;
        }

        container.innerHTML = `
            <div class="space-y-4">
                ${this.addresses.map(address => this.renderAddressCard(address)).join('')}
            </div>
        `;
    }

    renderAddressCard(address) {
        return `
            <div class="border border-gray-200 rounded-lg p-6 ${address.isDefault ? 'border-blue-500 bg-blue-50' : ''}">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center space-x-3 mb-2">
                            <h3 class="font-medium text-gray-800">${address.fullName}</h3>
                            <span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs uppercase">${address.addressType}</span>
                            ${address.isDefault ? '<span class="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">DEFAULT</span>' : ''}
                        </div>
                        
                        <div class="text-gray-600 space-y-1">
                            <p>${address.address}</p>
                            ${address.landmark ? `<p>Landmark: ${address.landmark}</p>` : ''}
                            <p>${address.city}, ${address.state} - ${address.pincode}</p>
                            <p>Mobile: ${address.mobile}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-2 ml-4">
                        <button onclick="addressApp.editAddress(${address.id})" 
                                class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                        </button>
                        <button onclick="addressApp.deleteAddress(${address.id})" 
                                class="text-red-600 hover:text-red-800 text-sm font-medium">
                            Delete
                        </button>
                        ${!address.isDefault ? `
                            <button onclick="addressApp.setDefault(${address.id})" 
                                    class="text-green-600 hover:text-green-800 text-sm font-medium">
                                Set Default
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyAddresses() {
        return `
            <div class="text-center py-16">
                <div class="mb-6">
                    <i class="fas fa-map-marker-alt text-6xl text-gray-300"></i>
                </div>
                <h2 class="text-xl font-semibold text-gray-800 mb-4">No addresses found</h2>
                <p class="text-gray-600 mb-8">Add your first address to start shopping with faster checkout.</p>
                <button onclick="addressApp.showAddForm()" 
                        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Add New Address
                </button>
            </div>
        `;
    }

    showAddForm() {
        this.editingId = null;
        document.getElementById('modal-title').textContent = 'Add New Address';
        document.getElementById('address-form').reset();
        document.getElementById('address-modal').classList.remove('hidden');
    }

    editAddress(id) {
        const address = this.addresses.find(a => a.id === id);
        if (!address) return;

        this.editingId = id;
        document.getElementById('modal-title').textContent = 'Edit Address';
        
        // Fill form with address data
        document.getElementById('address-id').value = address.id;
        document.getElementById('fullName').value = address.fullName;
        document.getElementById('mobile').value = address.mobile;
        document.getElementById('address').value = address.address;
        document.getElementById('city').value = address.city;
        document.getElementById('state').value = address.state;
        document.getElementById('pincode').value = address.pincode;
        document.getElementById('landmark').value = address.landmark || '';
        document.getElementById('isDefault').checked = address.isDefault;
        
        const typeRadio = document.querySelector(`input[name="addressType"][value="${address.addressType}"]`);
        if (typeRadio) typeRadio.checked = true;
        
        document.getElementById('address-modal').classList.remove('hidden');
    }

    deleteAddress(id) {
        const address = this.addresses.find(a => a.id === id);
        if (!address) return;

        if (address.isDefault && this.addresses.length > 1) {
            this.showNotification('Cannot delete default address. Set another address as default first.', 'error');
            return;
        }

        if (confirm('Are you sure you want to delete this address?')) {
            this.addresses = this.addresses.filter(a => a.id !== id);
            this.saveAddresses();
            this.renderAddresses();
            this.showNotification('Address deleted successfully', 'success');
        }
    }

    setDefault(id) {
        // Remove default from all addresses
        this.addresses.forEach(address => {
            address.isDefault = address.id === id;
        });
        
        this.saveAddresses();
        this.renderAddresses();
        this.showNotification('Default address updated', 'success');
    }

    handleSubmit(event) {
        event.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            mobile: document.getElementById('mobile').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            pincode: document.getElementById('pincode').value,
            landmark: document.getElementById('landmark').value,
            addressType: document.querySelector('input[name="addressType"]:checked').value,
            isDefault: document.getElementById('isDefault').checked
        };

        // Validate required fields
        if (!formData.fullName || !formData.mobile || !formData.address || 
            !formData.city || !formData.state || !formData.pincode) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Validate mobile number
        if (!/^[0-9]{10}$/.test(formData.mobile)) {
            this.showNotification('Please enter a valid 10-digit mobile number', 'error');
            return;
        }

        // Validate pincode
        if (!/^[0-9]{6}$/.test(formData.pincode)) {
            this.showNotification('Please enter a valid 6-digit pincode', 'error');
            return;
        }

        if (this.editingId) {
            // Update existing address
            const index = this.addresses.findIndex(a => a.id === this.editingId);
            if (index !== -1) {
                this.addresses[index] = { ...this.addresses[index], ...formData };
            }
        } else {
            // Add new address
            const newAddress = {
                id: Date.now(),
                ...formData
            };
            this.addresses.push(newAddress);
        }

        // If this is set as default, remove default from others
        if (formData.isDefault) {
            this.addresses.forEach(address => {
                if (address.id !== this.editingId) {
                    address.isDefault = false;
                }
            });
        }

        this.saveAddresses();
        this.renderAddresses();
        this.closeModal();
        this.showNotification(
            this.editingId ? 'Address updated successfully' : 'Address added successfully', 
            'success'
        );
    }

    closeModal() {
        document.getElementById('address-modal').classList.add('hidden');
        this.editingId = null;
    }

    saveAddresses() {
        localStorage.setItem('flipkart_addresses', JSON.stringify(this.addresses));
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
    localStorage.removeItem('flipkart_addresses');
    window.location.href = 'login.html';
}

// Initialize address app
const addressApp = new AddressApp();