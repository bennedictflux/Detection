// Shopping Cart functionality
class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.init();
    }

    init() {
        this.loadCartFromStorage();
        this.bindEvents();
        this.updateCartDisplay();
    }

    bindEvents() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product');
                this.addToCart(productId);
            });
        });

        // Cart modal events
        const cartIcon = document.querySelector('.cart-icon');
        const modal = document.getElementById('cart-modal');
        const closeBtn = document.querySelector('.close');
        const checkoutBtn = document.querySelector('.checkout-btn');

        if (cartIcon) {
            cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCart();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideCart();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideCart();
                }
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    addToCart(productId) {
        const products = {
            'kk88-pro-radio': { name: 'KK88 Pro Radio', price: 299.99 },
            'kk88-elite-radio': { name: 'KK88 Elite Radio', price: 399.99 },
            'kk88-classic-radio': { name: 'KK88 Classic Radio', price: 149.99 },
            'kk88-bass-pro': { name: 'KK88 Bass Pro Speakers', price: 199.99 },
            'kk88-thunder': { name: 'KK88 Thunder Subwoofer', price: 349.99 },
            'kk88-crystal-clear': { name: 'KK88 Crystal Clear Tweeters', price: 129.99 },
            'ultimate-combo': { name: 'Ultimate Audio Package', price: 549.99 },
            'starter-combo': { name: 'Starter Audio Package', price: 229.99 },
            'bass-combo': { name: 'Bass Lover Package', price: 499.99 }
        };

        const product = products[productId];
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        this.calculateTotal();
        this.updateCartDisplay();
        this.saveCartToStorage();
        this.showAddedNotification(product.name);
    }

    removeFromCart(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.calculateTotal();
        this.updateCartDisplay();
        this.saveCartToStorage();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.calculateTotal();
                this.updateCartDisplay();
                this.saveCartToStorage();
            }
        }
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    updateCartDisplay() {
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }

        // Update cart total
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = this.total.toFixed(2);
        }

        // Update cart items display
        this.updateCartItems();
    }

    updateCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button onclick="cart.removeFromCart('${item.id}')" class="remove-btn">Remove</button>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');
    }

    showCart() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    hideCart() {
        const modal = document.getElementById('cart-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showAddedNotification(productName) {
        // Create and show a notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart!</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-orange);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 3000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Simple checkout simulation
        alert(`Thank you for your order! Total: $${this.total.toFixed(2)}\n\nThis is a demo website. In a real store, you would be redirected to a secure payment processor.`);
        
        // Clear cart
        this.items = [];
        this.total = 0;
        this.updateCartDisplay();
        this.saveCartToStorage();
        this.hideCart();
    }

    saveCartToStorage() {
        localStorage.setItem('kk88car_cart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('kk88car_cart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            this.items = cartData.items || [];
            this.calculateTotal();
        }
    }
}

// Smooth scrolling for navigation links
class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.bindScrollEvents();
        this.bindMobileMenu();
        this.bindFormSubmissions();
    }

    bindScrollEvents() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(26, 26, 26, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--black)';
                header.style.backdropFilter = 'none';
            }
        });
    }

    bindMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                
                // Add mobile menu styles if not already added
                if (!document.querySelector('#mobile-menu-styles')) {
                    const styles = document.createElement('style');
                    styles.id = 'mobile-menu-styles';
                    styles.textContent = `
                        @media (max-width: 768px) {
                            .nav-menu {
                                position: absolute;
                                top: 100%;
                                left: 0;
                                width: 100%;
                                background: var(--black);
                                flex-direction: column;
                                padding: 1rem 0;
                                transform: translateY(-100%);
                                opacity: 0;
                                visibility: hidden;
                                transition: all 0.3s ease;
                            }
                            
                            .nav-menu.active {
                                display: flex;
                                transform: translateY(0);
                                opacity: 1;
                                visibility: visible;
                            }
                            
                            .nav-menu li {
                                margin: 0.5rem 0;
                                text-align: center;
                            }
                        }
                    `;
                    document.head.appendChild(styles);
                }
            });

            // Close mobile menu when clicking on a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    bindFormSubmissions() {
        // Contact form
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterForm(newsletterForm);
            });
        }
    }

    handleContactForm(form) {
        const formData = new FormData(form);
        const name = form.querySelector('input[type="text"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const phone = form.querySelector('input[type="tel"]').value;
        const message = form.querySelector('textarea').value;

        // Simulate form submission
        if (name && email && message) {
            alert(`Thank you ${name}! We'll get back to you soon at ${email}.`);
            form.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    }

    handleNewsletterForm(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        if (email) {
            alert(`Thank you for subscribing with ${email}! You'll receive our latest deals and updates.`);
            form.reset();
        } else {
            alert('Please enter a valid email address.');
        }
    }
}

// Product filtering and search functionality
class ProductFilter {
    constructor() {
        this.init();
    }

    init() {
        this.addSearchFunctionality();
        this.addProductAnimations();
    }

    addSearchFunctionality() {
        // Add a search bar if needed in the future
        // This is a placeholder for advanced filtering
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                // Could implement a search overlay here
            }
        });
    }

    addProductAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe product cards and other elements
        document.querySelectorAll('.product-card, .category-card, .combo-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Performance optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrolling();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    optimizeScrolling() {
        let ticking = false;

        function updateScrollEffects() {
            // Add any scroll-based effects here
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    window.cart = new ShoppingCart();
    window.navigation = new Navigation();
    window.productFilter = new ProductFilter();
    window.performanceOptimizer = new PerformanceOptimizer();

    // Add loading animation
    document.body.classList.add('loaded');

    // Add some CSS for the cart items if not already present
    if (!document.querySelector('#cart-styles')) {
        const cartStyles = document.createElement('style');
        cartStyles.id = 'cart-styles';
        cartStyles.textContent = `
            .cart-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #eee;
                gap: 1rem;
            }
            
            .cart-item-info h4 {
                margin: 0 0 0.25rem 0;
                font-size: 1rem;
            }
            
            .cart-item-info p {
                margin: 0;
                color: var(--medium-gray);
                font-size: 0.9rem;
            }
            
            .cart-item-controls {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .cart-item-controls button {
                width: 30px;
                height: 30px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .cart-item-controls button:hover {
                background: #f5f5f5;
            }
            
            .cart-item-controls .remove-btn {
                width: auto;
                padding: 5px 10px;
                background: #ff4444;
                color: white;
                border: none;
            }
            
            .cart-item-controls .remove-btn:hover {
                background: #cc0000;
            }
            
            .cart-item-total {
                font-weight: 600;
                color: var(--primary-orange);
            }
            
            .notification {
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            body.loaded {
                opacity: 1;
            }
            
            body {
                opacity: 0;
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(cartStyles);
    }

    console.log('KK88Car website initialized successfully!');
});

// Utility functions
const utils = {
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, Navigation, ProductFilter, PerformanceOptimizer, utils };
}