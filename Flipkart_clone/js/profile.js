// Profile Page JavaScript

class ProfileApp {
    constructor() {
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadUserInfo();
        this.loadProfileData();
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

    loadProfileData() {
        const profile = JSON.parse(localStorage.getItem('flipkart_profile') || '{}');
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');

        // Pre-fill form with existing data
        document.getElementById('firstName').value = profile.firstName || user.name?.split(' ')[0] || '';
        document.getElementById('lastName').value = profile.lastName || user.name?.split(' ')[1] || '';
        document.getElementById('email').value = profile.email || user.email || '';
        document.getElementById('mobile').value = profile.mobile || user.mobile || '';
        document.getElementById('dob').value = profile.dob || '';

        if (profile.gender) {
            const genderRadio = document.querySelector(`input[name="gender"][value="${profile.gender}"]`);
            if (genderRadio) genderRadio.checked = true;
        }
    }

    setupEventListeners() {
        document.getElementById('profile-form').addEventListener('submit', (e) => this.handleProfileUpdate(e));
        document.getElementById('password-form').addEventListener('submit', (e) => this.handlePasswordChange(e));
    }

    handleProfileUpdate(event) {
        event.preventDefault();

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            mobile: document.getElementById('mobile').value,
            dob: document.getElementById('dob').value,
            gender: document.querySelector('input[name="gender"]:checked')?.value
        };

        // Validate form
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Mobile validation
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
            this.showNotification('Please enter a valid 10-digit mobile number', 'error');
            return;
        }

        // Save profile data
        localStorage.setItem('flipkart_profile', JSON.stringify(formData));

        // Update user data
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        user.name = `${formData.firstName} ${formData.lastName}`;
        user.email = formData.email;
        user.mobile = formData.mobile;
        localStorage.setItem('flipkart_user', JSON.stringify(user));

        this.showNotification('Profile updated successfully!', 'success');
        this.loadUserInfo(); // Refresh displayed user info
    }

    handlePasswordChange(event) {
        event.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('New password and confirm password do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        // In a real app, you'd verify the current password
        // For demo purposes, we'll just update it
        this.showNotification('Password updated successfully!', 'success');
        document.getElementById('password-form').reset();
    }

    resetForm() {
        document.getElementById('profile-form').reset();
        this.loadProfileData();
        this.showNotification('Form reset to saved values', 'info');
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
    localStorage.removeItem('flipkart_profile');
    window.location.href = 'login.html';
}

// Initialize profile app
const profileApp = new ProfileApp();