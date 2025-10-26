// Image error handling script
document.addEventListener('DOMContentLoaded', function() {
    // Handle image loading errors
    const images = document.querySelectorAll('img');
    
    // Process images that are already in the DOM
    processImages(images);
    
    // Also process images that might be added later
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // Element node
                    if (node.tagName === 'IMG') {
                        processImage(node);
                    } else if (node.querySelectorAll) {
                        const imgs = node.querySelectorAll('img');
                        processImages(imgs);
                    }
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    function processImages(images) {
        images.forEach(img => {
            processImage(img);
        });
    }
    
    function processImage(img) {
        // Add loading attribute for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // If image is already loaded, mark it as loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.add('loaded');
        } else {
            // Add load and error handlers
            img.addEventListener('load', function() {
                img.classList.add('loaded');
            });
            
            img.addEventListener('error', function() {
                // Create fallback element
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback w-full h-full flex items-center justify-center';
                fallback.innerHTML = `<span class="text-gray-500 text-sm">${img.alt || 'Image not available'}</span>`;
                
                // Replace image with fallback
                if (img.parentElement) {
                    img.parentElement.replaceChild(fallback, img);
                }
            });
        }
    }
    
    // Add scroll animations
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });
    
    animateOnScrollElements.forEach(element => {
        scrollObserver.observe(element);
    });
    
    // Form validation helper
    window.validateForm = function(formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('border-red-500');
                isValid = false;
            } else {
                input.classList.remove('border-red-500');
            }
        });
        
        return isValid;
    };
    
    // Show notification
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };
    
    // Loading overlay
    window.showLoading = function() {
        let overlay = document.getElementById('loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.className = 'loading-overlay active';
            overlay.innerHTML = '<div class="spinner-large"></div>';
            document.body.appendChild(overlay);
        } else {
            overlay.classList.add('active');
        }
    };
    
    window.hideLoading = function() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    };
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        const performSearch = function() {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                // Redirect to menu page with search term
                window.location.href = `menu.html?search=${encodeURIComponent(searchTerm)}`;
            }
        };
        
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Wishlist functionality
    window.toggleWishlist = function(itemId, itemName, itemPrice, itemDesc, itemImg) {
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingItemIndex = wishlist.findIndex(item => item.id === itemId);
        
        if (existingItemIndex >= 0) {
            // Remove from wishlist
            wishlist.splice(existingItemIndex, 1);
            showNotification(`${itemName} removed from wishlist`, 'success');
        } else {
            // Add to wishlist
            wishlist.push({ id: itemId, name: itemName, price: itemPrice, desc: itemDesc, img: itemImg });
            showNotification(`${itemName} added to wishlist`, 'success');
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistUI(itemId);
    };
    
    window.updateWishlistUI = function(itemId) {
        // Update wishlist buttons UI
        const wishlistButtons = document.querySelectorAll(`[data-item-id="${itemId}"]`);
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const isInWishlist = wishlist.some(item => item.id === itemId);
        
        wishlistButtons.forEach(button => {
            if (isInWishlist) {
                button.innerHTML = '<i data-feather="heart" class="text-red-500"></i>';
                button.title = 'Remove from wishlist';
            } else {
                button.innerHTML = '<i data-feather="heart"></i>';
                button.title = 'Add to wishlist';
            }
        });
        
        // Reinitialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    };
    
    // Initialize wishlist UI on page load
    window.initializeWishlist = function() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.forEach(item => {
            updateWishlistUI(item.id);
        });
    };
    
    // Update cart and wishlist counts
    updateCartCount();
    initializeWishlist();
});

// Update cart count display
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    
    // Update all cart count elements
    const cartCountElements = document.querySelectorAll('#cart-count, #cart-count-mobile, #cart-count-mobile-menu');
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
        }
    });
    
    return totalItems;
}

// Update wishlist count display
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const totalItems = wishlist.length;
    
    // Update all wishlist count elements
    const wishlistCountElements = document.querySelectorAll('#wishlist-count');
    wishlistCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
        }
    });
    
    return totalItems;
}

// Override addToCart function to update counts
const originalAddToCart = window.addToCart;
window.addToCart = function(id, name, price, desc, img) {
    // Call original function if it exists
    if (originalAddToCart) {
        originalAddToCart(id, name, price, desc, img);
    } else {
        // Original implementation
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.qty++;
        } else {
            cart.push({ id, name, price, desc, img, qty: 1 });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        if (typeof showNotification !== 'undefined') {
            showNotification(`${name} added to cart!`, 'success');
        } else {
            alert(`${name} added to cart!`);
        }
    }
    
    // Update cart count
    updateCartCount();
};

// Override toggleWishlist function to update counts
const originalToggleWishlist = window.toggleWishlist;
window.toggleWishlist = function(itemId, itemName, itemPrice, itemDesc, itemImg) {
    // Call original function if it exists
    if (originalToggleWishlist) {
        originalToggleWishlist(itemId, itemName, itemPrice, itemDesc, itemImg);
    } else {
        // Original implementation
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingItemIndex = wishlist.findIndex(item => item.id === itemId);
        
        if (existingItemIndex >= 0) {
            // Remove from wishlist
            wishlist.splice(existingItemIndex, 1);
            if (typeof showNotification !== 'undefined') {
                showNotification(`${itemName} removed from wishlist`, 'success');
            }
        } else {
            // Add to wishlist
            wishlist.push({ id: itemId, name: itemName, price: itemPrice, desc: itemDesc, img: itemImg });
            if (typeof showNotification !== 'undefined') {
                showNotification(`${itemName} added to wishlist`, 'success');
            }
        }
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        if (typeof updateWishlistUI !== 'undefined') {
            updateWishlistUI(itemId);
        }
    }
    
    // Update wishlist count
    updateWishlistCount();
};