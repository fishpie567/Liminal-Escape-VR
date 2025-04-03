document.addEventListener('DOMContentLoaded', function() {
    // Storage keys
    const STORAGE_KEY_MOD_STATUS = "modStatus";
    const STORAGE_KEY_USERNAMES = "betaDiscordUsernames";
    const STORAGE_KEY_AUTH_STATUS = "betaAuthStatus";
    const STORAGE_KEY_CURRENT_USER = "betaCurrentUser";
    const STORAGE_KEY_USER_STATUSES = "betaUserStatuses";
    const STORAGE_KEY_ACCESS_COUNT = "betaAccessCount";
    
    // Elements
    const moderatorContent = document.getElementById('moderator-content');
    const accessDenied = document.getElementById('access-denied');
    const userListContainer = document.getElementById('user-list-container');
    
    const totalUsersElement = document.getElementById('total-users');
    const pendingUsersElement = document.getElementById('pending-users');
    const approvedUsersElement = document.getElementById('approved-users');
    const modUsersElement = document.getElementById('mod-users');
    const accessAttemptsElement = document.getElementById('access-attempts');
    const successRateElement = document.getElementById('success-rate');
    
    const userSearchInput = document.getElementById('user-search');
    const searchBtn = document.getElementById('search-btn');
    const logoutModBtn = document.getElementById('logout-mod-btn');
    
    // Check if user has moderator access
    if (!localStorage.getItem(STORAGE_KEY_MOD_STATUS) || localStorage.getItem(STORAGE_KEY_MOD_STATUS) !== "true") {
        // No moderator access, show access denied
        if (moderatorContent) moderatorContent.classList.add('hidden');
        if (accessDenied) accessDenied.classList.remove('hidden');
        return;
    }
    
    // Initialize user status storage if not exists
    if (!localStorage.getItem(STORAGE_KEY_USER_STATUSES)) {
        localStorage.setItem(STORAGE_KEY_USER_STATUSES, JSON.stringify({}));
    }
    
    // Load and display all data
    loadDashboardData();
    
    // Event listeners
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            filterUsers(userSearchInput.value.trim().toLowerCase());
        });
    }
    
    if (userSearchInput) {
        userSearchInput.addEventListener('keyup', function(event) {
            if (event.key === "Enter") {
                filterUsers(userSearchInput.value.trim().toLowerCase());
            }
        });
    }
    
    if (logoutModBtn) {
        logoutModBtn.addEventListener('click', function() {
            if (confirm("Are you sure you want to revoke your moderator access? You'll need the password to regain access.")) {
                localStorage.removeItem(STORAGE_KEY_MOD_STATUS);
                window.location.href = "index.html";
            }
        });
    }
    
    // Functions
    function loadDashboardData() {
        const usernames = JSON.parse(localStorage.getItem(STORAGE_KEY_USERNAMES)) || [];
        const userStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_STATUSES)) || {};
        const accessAttempts = parseInt(localStorage.getItem(STORAGE_KEY_ACCESS_COUNT)) || 0;
        
        // Add moderator to userStatuses if not already there
        if (localStorage.getItem(STORAGE_KEY_MOD_STATUS) === "true") {
            const currentUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER) || "Admin";
            if (!userStatuses[currentUser] || userStatuses[currentUser] !== "moderator") {
                userStatuses[currentUser] = "moderator";
                localStorage.setItem(STORAGE_KEY_USER_STATUSES, JSON.stringify(userStatuses));
            }
        }
        
        // Process existing users without status
        usernames.forEach(username => {
            if (!userStatuses[username]) {
                // If username is in the list but has no status, mark as pending
                userStatuses[username] = "pending";
            }
        });
        
        // Count different user types
        let pendingCount = 0;
        let approvedCount = 0;
        let modCount = 0;
        
        for (const status of Object.values(userStatuses)) {
            if (status === "pending") pendingCount++;
            else if (status === "approved") approvedCount++;
            else if (status === "moderator") modCount++;
        }
        
        // Update stats display
        if (totalUsersElement) totalUsersElement.textContent = Object.keys(userStatuses).length;
        if (pendingUsersElement) pendingUsersElement.textContent = pendingCount;
        if (approvedUsersElement) approvedUsersElement.textContent = approvedCount;
        if (modUsersElement) modUsersElement.textContent = modCount;
        if (accessAttemptsElement) accessAttemptsElement.textContent = accessAttempts;
        
        // Calculate and display success rate
        const successRate = accessAttempts > 0 ? Math.round((Object.keys(userStatuses).length / accessAttempts) * 100) : 0;
        if (successRateElement) successRateElement.textContent = `${successRate}%`;
        
        // Save updated status data
        localStorage.setItem(STORAGE_KEY_USER_STATUSES, JSON.stringify(userStatuses));
        
        // Populate user list
        populateUserList(userStatuses);
    }
    
    function populateUserList(userStatuses) {
        if (!userListContainer) return;
        
        userListContainer.innerHTML = '';
        
        // Sort users: moderators first, then approved, then pending
        const sortedUsers = Object.entries(userStatuses).sort((a, b) => {
            const statusOrder = { 'moderator': 0, 'approved': 1, 'pending': 2 };
            return statusOrder[a[1]] - statusOrder[b[1]];
        });
        
        for (const [username, status] of sortedUsers) {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.dataset.username = username.toLowerCase();
            
            const usernameDiv = document.createElement('div');
            usernameDiv.className = 'username';
            usernameDiv.textContent = username;
            
            const statusDiv = document.createElement('div');
            statusDiv.className = `status status-${status}`;
            statusDiv.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-buttons';
            
            if (status === 'pending') {
                // Pending users need approve/deny buttons
                const approveBtn = document.createElement('button');
                approveBtn.className = 'action-btn approve-btn';
                approveBtn.textContent = 'Approve';
                approveBtn.addEventListener('click', function() {
                    updateUserStatus(username, 'approved');
                });
                
                const denyBtn = document.createElement('button');
                denyBtn.className = 'action-btn deny-btn';
                denyBtn.textContent = 'Deny';
                denyBtn.addEventListener('click', function() {
                    if (confirm(`Are you sure you want to deny access for ${username}?`)) {
                        removeUser(username);
                    }
                });
                
                actionsDiv.appendChild(approveBtn);
                actionsDiv.appendChild(denyBtn);
            } else if (status === 'approved') {
                // Approved users can be removed
                const removeBtn = document.createElement('button');
                removeBtn.className = 'action-btn remove-btn';
                removeBtn.textContent = 'Remove';
                removeBtn.addEventListener('click', function() {
                    if (confirm(`Are you sure you want to remove ${username}'s access?`)) {
                        removeUser(username);
                    }
                });
                
                actionsDiv.appendChild(removeBtn);
            }
            
            userItem.appendChild(usernameDiv);
            userItem.appendChild(statusDiv);
            userItem.appendChild(actionsDiv);
            
            userListContainer.appendChild(userItem);
        }
    }
    
    function updateUserStatus(username, newStatus) {
        const userStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_STATUSES)) || {};
        
        userStatuses[username] = newStatus;
        
        // Update current user's status if it's the same user
        if (username === localStorage.getItem(STORAGE_KEY_CURRENT_USER)) {
            localStorage.setItem(STORAGE_KEY_AUTH_STATUS, newStatus);
        }
        
        // Save and reload
        localStorage.setItem(STORAGE_KEY_USER_STATUSES, JSON.stringify(userStatuses));
        loadDashboardData();
    }
    
    function removeUser(username) {
        // Remove from usernames list
        const usernames = JSON.parse(localStorage.getItem(STORAGE_KEY_USERNAMES)) || [];
        const updatedUsernames = usernames.filter(name => name !== username);
        localStorage.setItem(STORAGE_KEY_USERNAMES, JSON.stringify(updatedUsernames));
        
        // Remove from statuses
        const userStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_STATUSES)) || {};
        delete userStatuses[username];
        localStorage.setItem(STORAGE_KEY_USER_STATUSES, JSON.stringify(userStatuses));
        
        // If current user is being removed, reset their auth
        if (username === localStorage.getItem(STORAGE_KEY_CURRENT_USER)) {
            localStorage.removeItem(STORAGE_KEY_AUTH_STATUS);
            localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
        }
        
        // Reload data
        loadDashboardData();
    }
    
    function filterUsers(searchTerm) {
        const userItems = userListContainer.querySelectorAll('.user-item');
        
        userItems.forEach(item => {
            const username = item.dataset.username;
            
            if (username.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }
});