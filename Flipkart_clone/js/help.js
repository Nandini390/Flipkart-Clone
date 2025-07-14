// Help Center JavaScript

class HelpApp {
    constructor() {
        this.init();
    }

    init() {
        this.loadUserInfo();
        this.setupSearchListener();
    }

    loadUserInfo() {
        const user = JSON.parse(localStorage.getItem('flipkart_user') || '{}');
        if (user.name) {
            document.getElementById('user-name').textContent = user.name;
        }
    }

    setupSearchListener() {
        const searchInput = document.getElementById('help-search');
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(searchInput.value);
            }
        });
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        // In a real application, this would search through help articles
        alert(`Searching for: "${query}"\n\nThis would show relevant help articles and FAQs.`);
    }

    showCategory(category) {
        const categories = {
            orders: 'Orders & Delivery Help',
            returns: 'Returns & Refunds Help',
            account: 'Account & Profile Help',
            payments: 'Payments & Wallet Help'
        };

        alert(`Opening ${categories[category]} section.\n\nThis would show category-specific help articles.`);
    }

    toggleFAQ(button) {
        const content = button.nextElementSibling;
        const icon = button.querySelector('i');
        
        if (content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            content.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    }
}

// Initialize help app
const helpApp = new HelpApp();