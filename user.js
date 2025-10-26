// User management and authentication functions

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

// Get current user info
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Check if current user is admin
function isAdmin() {
    const user = getCurrentUser();
    if (!user) return false;
    
    // Check if it's the default admin or a registered admin
    return user.username === 'admin' || user.isAdmin === true;
}

// Set current user
function setCurrentUser(username, isAdminUser = false) {
    const user = {
        username: username,
        loginTime: new Date().toISOString(),
        isAdmin: isAdminUser || username === 'admin'
    };
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('loggedIn', 'true');
}

// Add admin user
function addAdminUser(username) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        users[userIndex].isAdmin = true;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Get all admin users
function getAdminUsers() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const adminUsers = users.filter(u => u.isAdmin === true);
    
    // Always include default admin
    if (!adminUsers.find(u => u.username === 'admin')) {
        adminUsers.push({ username: 'admin', isAdmin: true });
    }
    
    return adminUsers;
}

// Logout user
function logoutUser() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
}

// Initialize user state on page load
document.addEventListener('DOMContentLoaded', function() {
    // Update user profile display
    updateUserProfileDisplay();
    
    // Add event listener for logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
});

// Update user profile display in navigation
function updateUserProfileDisplay() {
    const user = getCurrentUser();
    const userProfileElement = document.getElementById('user-profile');
    const userMenuElement = document.getElementById('user-menu');
    
    // If user profile elements don't exist, create them
    if (!userProfileElement) {
        console.warn('User profile element not found');
        return;
    }
    
    if (user && userProfileElement && userMenuElement) {
        // User is logged in
        userProfileElement.innerHTML = `
            <div class="flex items-center space-x-1 cursor-pointer" id="user-dropdown-toggle">
                <i data-feather="user"></i>
                <span class="hidden md:inline">${user.username}${isAdmin() ? ' (Admin)' : ''}</span>
                <i data-feather="chevron-down" class="w-4 h-4"></i>
            </div>
        `;
        
        userMenuElement.innerHTML = `
            <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden" id="user-dropdown-menu">
                <div class="px-4 py-2 border-b">
                    <p class="text-sm font-medium text-gray-900">${user.username}${isAdmin() ? ' (Admin)' : ''}</p>
                    <p class="text-xs text-gray-500">Online</p>
                </div>
                <a href="profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-feather="user" class="w-4 h-4 inline mr-2"></i>My Profile
                </a>
                <a href="orders.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-feather="shopping-bag" class="w-4 h-4 inline mr-2"></i>My Orders
                </a>
                <a href="wishlist.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-feather="heart" class="w-4 h-4 inline mr-2"></i>Wishlist
                </a>
                <a href="cart.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-feather="shopping-cart" class="w-4 h-4 inline mr-2"></i>My Cart
                </a>
                ${isAdmin() ? `
                <a href="admin-orders.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-feather="clipboard" class="w-4 h-4 inline mr-2"></i>Admin Orders
                </a>
                ` : ''}
                <a href="#" id="logout-btn" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <i data-feather="log-out" class="w-4 h-4 inline mr-2"></i>Logout
                </a>
            </div>
        `;
        
        // Add event listener for dropdown toggle
        const dropdownToggle = document.getElementById('user-dropdown-toggle');
        const dropdownMenu = document.getElementById('user-dropdown-menu');
        
        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownMenu.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
                    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                        dropdownMenu.classList.add('hidden');
                    }
                }
            });
        }
        
        // Reinitialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    } else if (userProfileElement) {
        // User is not logged in
        userProfileElement.innerHTML = `
            <a href="login.html" class="flex items-center space-x-1">
                <i data-feather="user"></i>
                <span class="hidden md:inline">Login</span>
            </a>
        `;
        
        // Reinitialize feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }
}