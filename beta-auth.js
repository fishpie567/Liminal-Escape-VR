document.addEventListener('DOMContentLoaded', function() {
    // Elements from the auth screens
    const accessScreen = document.getElementById('access-screen');
    const signupScreen = document.getElementById('signup-screen');
    const pendingScreen = document.getElementById('pending-screen');
    const betaContent = document.getElementById('beta-content');
    
    const betaCodeInput = document.getElementById('beta-code');
    const submitCodeBtn = document.getElementById('submit-code');
    const codeError = document.getElementById('code-error');
    const accessCountDisplay = document.getElementById('access-count');
    
    const discordInput = document.getElementById('discord-username');
    const submitUsernameBtn = document.getElementById('submit-username');
    const usernameError = document.getElementById('username-error');
    
    const pendingUsername = document.getElementById('pending-username');
    const checkStatusBtn = document.getElementById('check-status');
    const statusMessage = document.getElementById('status-message');
    
    const logoutBtn = document.getElementById('logout-btn');
    
    // Constants
    const CORRECT_BETA_CODE = "BetaTest:)";
    const STORAGE_KEY_ACCESS_COUNT = "betaAccessCount";
    const STORAGE_KEY_USERNAMES = "betaDiscordUsernames";
    const STORAGE_KEY_AUTH_STATUS = "betaAuthStatus";
    const STORAGE_KEY_CURRENT_USER = "betaCurrentUser";
    const STORAGE_KEY_USER_STATUSES = "betaUserStatuses";
    const STORAGE_KEY_MOD_STATUS = "modStatus";
    
    // Initialize and check auth state
    initializeAuthState();
    
    // Event Listeners
    if (submitCodeBtn) {
        submitCodeBtn.addEventListener('click', validateBetaCode);
        if (betaCodeInput) {
            betaCodeInput.addEventListener('keyup', function(event) {
                if (event.key === "Enter") {
                    validateBetaCode();
                }
            });
        }
    }
    
    if (submitUsernameBtn) {
        submitUsernameBtn.addEventListener('click', submitDiscordUsername);
        if (discordInput) {
            discordInput.addEventListener('keyup', function(event) {
                if (event.key === "Enter") {
                    submitDiscordUsername();
                }
            });
        }
    }
    
    if (checkStatusBtn) {
        checkStatusBtn.addEventListener('click', checkApprovalStatus);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
    
    // Functions
    function initializeAuthState() {
        // Initialize access count if not exists
        if (!localStorage.getItem(STORAGE_KEY_ACCESS_COUNT)) {
            localStorage.setItem(STORAGE_KEY_ACCESS_COUNT, "0");
        }
        
        // Initialize username storage if not exists
        if (!localStorage.getItem(STORAGE_KEY_USERNAMES)) {
            localStorage.setItem(STORAGE_KEY_USERNAMES, JSON.stringify([]));
        }
        
        // Initialize user statuses if not exists
        if (!localStorage.getItem(STORAGE_KEY_USER_STATUSES)) {
            localStorage.setItem(STORAGE_KEY_USER_STATUSES, JSON.stringify({}));
        }
        
        // Update access count display
        if (accessCountDisplay) {
            accessCountDisplay.textContent = localStorage.getItem(STORAGE_KEY_ACCESS_COUNT);
        }
        
        // Check if user is already authenticated
        checkAuthStatus();
    }
    
    function checkAuthStatus() {
        const authStatus = localStorage.getItem(STORAGE_KEY_AUTH_STATUS);
        const currentUser = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
        
        if (!authStatus || !currentUser) {
            // No auth, show access screen
            showScreen(accessScreen);
            return;
        }
        
        // Check if user status has been updated by a moderator
        const userStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_STATUSES)) || {};
        if (userStatuses[currentUser]) {
            // Use status from the moderator-managed list
            const moderatorSetStatus = userStatuses[currentUser];
            
            if (moderatorSetStatus !== authStatus) {
                // If moderator has changed status, update local status
                localStorage.setItem(STORAGE_KEY_AUTH_STATUS, moderatorSetStatus);
            }
            
            if (moderatorSetStatus === 'approved') {
                showScreen(betaContent);
                return;
            } else if (moderatorSetStatus === 'pending') {
                if (pendingUsername) {
                    pendingUsername.textContent = currentUser;
                }
                showScreen(pendingScreen);
                return;
            } else if (moderatorSetStatus === 'moderator') {
                // Moderators get automatic access
                showScreen(betaContent);
                return;
            }
        }
        
        // Fall back to regular auth status checking if not in moderator-managed list
        switch (authStatus) {
            case "pending":
                // User registered but awaiting approval
                if (pendingUsername) {
                    pendingUsername.textContent = currentUser;
                }
                showScreen(pendingScreen);
                break;
            case "approved":
                // User is approved, show beta content
                showScreen(betaContent);
                break;
            default:
                // Invalid state, reset to beginning
                logoutUser();
                showScreen(accessScreen);
        }
    }
    
    function validateBetaCode() {
        if (!betaCodeInput || !accessCountDisplay) return;
        
        // Increment access attempt count
        const currentCount = parseInt(localStorage.getItem(STORAGE_KEY_ACCESS_COUNT)) || 0;
        localStorage.setItem(STORAGE_KEY_ACCESS_COUNT, (currentCount + 1).toString());
        accessCountDisplay.textContent = (currentCount + 1).toString();
        
        // Validate the code
        if (betaCodeInput.value === CORRECT_BETA_CODE) {
            if (codeError) codeError.textContent = "";
            proceedToSignup();
        } else {
            if (codeError) {
                codeError.textContent = "Invalid access code. Please try again.";
            }
            betaCodeInput.value = "";
            betaCodeInput.focus();
        }
    }
    
    function proceedToSignup() {
        showScreen(signupScreen);
    }
    
    function submitDiscordUsername() {
        if (!discordInput) return;
        
        const username = discordInput.value.trim();
        
        // Validate username format (basic check)
        if (!username || username.length < 2) {
            if (usernameError) {
                usernameError.textContent = "Please enter a valid Discord username.";
            }
            return;
        }
        
        // Check if username has already been used
        const usedUsernames = JSON.parse(localStorage.getItem(STORAGE_KEY_USERNAMES)) || [];
        const userStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_STATUSES)) || {};
        
        if (usedUsernames.includes(username) || userStatuses[username]) {
            if (usernameError) {
                usernameError.textContent = "This Discord username has already been registered.";
            }
            return;
        }
        
        // Save the new username
        usedUsernames.push(username);
        localStorage.setItem(STORAGE_KEY_USERNAMES, JSON.stringify(usedUsernames));
        
        // Set auth status to pending
        localStorage.setItem(STORAGE_KEY_AUTH_STATUS, "pending");
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, username);
        
        // Add to user statuses for moderator management
        userStatuses[username] = "pending";
        localStorage.setItem(STORAGE_KEY_USER_STATUSES, JSON.stringify(userStatuses));
        
        // Update the pending screen and show it
        if (pendingUsername) {
            pendingUsername.textContent = username;
        }
        showScreen(pendingScreen);
    }
    
    function checkApprovalStatus() {
        const username = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
        const userStatuses = JSON.parse(localStorage.getItem(STORAGE_KEY_USER_STATUSES)) || {};
        
        // Check if moderator has approved
        if (userStatuses[username] === "approved") {
            localStorage.setItem(STORAGE_KEY_AUTH_STATUS, "approved");
            showScreen(betaContent);
            if (statusMessage) statusMessage.textContent = "";
            return;
        }
        
        // No mod approval, try random chance (simulated server check)
        if (Math.random() < 0.3) {
            localStorage.setItem(STORAGE_KEY_AUTH_STATUS, "approved");
            
            // Update the status for moderators to see
            userStatuses[username] = "approved";
            localStorage.setItem(STORAGE_KEY_USER_STATUSES, JSON.stringify(userStatuses));
            
            showScreen(betaContent);
            if (statusMessage) statusMessage.textContent = "";
        } else {
            if (statusMessage) {
                statusMessage.textContent = "Your approval is still pending. Please check back later.";
                // Add a subtle animation to the message
                statusMessage.style.animation = "none";
                setTimeout(() => {
                    statusMessage.style.animation = "fadePulse 2s";
                }, 10);
            }
        }
    }
    
    function logoutUser() {
        // Clear authentication but keep the username in the used list
        localStorage.removeItem(STORAGE_KEY_AUTH_STATUS);
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
        
        // Reset form fields
        if (betaCodeInput) betaCodeInput.value = "";
        if (discordInput) discordInput.value = "";
        if (codeError) codeError.textContent = "";
        if (usernameError) usernameError.textContent = "";
        if (statusMessage) statusMessage.textContent = "";
        
        // Go back to the beginning
        showScreen(accessScreen);
    }
    
    function showScreen(screenToShow) {
        // Hide all screens
        [accessScreen, signupScreen, pendingScreen, betaContent].forEach(screen => {
            if (screen) {
                screen.classList.add('hidden');
            }
        });
        
        // Show the requested screen
        if (screenToShow) {
            screenToShow.classList.remove('hidden');
        }
    }
});