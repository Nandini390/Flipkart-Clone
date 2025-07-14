// Login Page JavaScript

class LoginApp {
    constructor() {
        this.init();
    }

    init() {
        // Check if user is already logged in
        const isLoggedIn = localStorage.getItem('flipkart_user');
        if (isLoggedIn) {
            window.location.href = 'index.html';
        }
    }

    showSignup() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('signup-form').classList.remove('hidden');
    }

    showLogin() {
        document.getElementById('signup-form').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
    }

    togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const icon = input.nextElementSibling.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate login process
        this.showNotification('Logging in...', 'info');
        
        setTimeout(() => {
            const userData = {
                name: 'User',
                email: email,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('flipkart_user', JSON.stringify(userData));
            this.showNotification('Login successful!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
    }

    handleSignup(event) {
        event.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const mobile = document.getElementById('signup-mobile').value;
        const password = document.getElementById('signup-password').value;
        const terms = document.getElementById('terms').checked;

        if (!name || !email || !mobile || !password) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!terms) {
            this.showNotification('Please accept Terms & Conditions', 'error');
            return;
        }

        // Simulate signup process
        this.showNotification('Creating account...', 'info');
        
        setTimeout(() => {
            const userData = {
                name: name,
                email: email,
                mobile: mobile,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('flipkart_user', JSON.stringify(userData));
            this.showNotification('Account created successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }, 1500);
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

// Global functions for HTML onclick events
function showSignup() {
    loginApp.showSignup();
}

function showLogin() {
    loginApp.showLogin();
}

function togglePassword(inputId) {
    loginApp.togglePassword(inputId);
}

function handleLogin(event) {
    loginApp.handleLogin(event);
}

function handleSignup(event) {
    loginApp.handleSignup(event);
}

// Initialize login app
const loginApp = new LoginApp();