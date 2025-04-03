document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    // Elements
    const shareButton = document.getElementById('shareButton');
    const copyMessage = document.getElementById('copyMessage');
    const modIcon = document.getElementById('modIcon');
    const modAccessModal = document.getElementById('modAccessModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modPasswordInput = document.getElementById('mod-password');
    const submitModPassword = document.getElementById('submitModPassword');
    const modError = document.getElementById('mod-error');
    const modLink = document.querySelector('.mod-link');
    
    // Constants
    const MOD_PASSWORD = "King919";
    const STORAGE_KEY_MOD_STATUS = "modStatus";
    
    // Check if already a moderator
    checkModStatus();
    
    // IMPORTANT: Make sure modal is hidden on page load
    if (modAccessModal) {
        modAccessModal.style.display = 'none';
        modAccessModal.classList.add('hidden');
    }
    
    // Add share button functionality if it exists on the page
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            // Get the current URL of the page
            const websiteURL = window.location.href;
            
            // Create a temporary input element
            const tempInput = document.createElement('input');
            tempInput.value = websiteURL;
            document.body.appendChild(tempInput);
            
            // Select the URL text
            tempInput.select();
            tempInput.setSelectionRange(0, 99999); // For mobile devices
            
            // Copy to clipboard
            document.execCommand('copy');
            
            // Remove the temporary input
            document.body.removeChild(tempInput);
            
            // Show the "copied" message
            copyMessage.style.display = 'block';
            
            // Hide the message after 3 seconds
            setTimeout(function() {
                copyMessage.style.display = 'none';
            }, 3000);
        });
    }
    
// Hamburger menu for mobile - add click functionality
const hamburgerIcon = document.querySelector('.hamburger-icon');
const menuItems = document.querySelector('.menu-items');
let menuOpen = false;
let menuTimeout;

if (hamburgerIcon) {
    hamburgerIcon.addEventListener('mouseenter', function() {
        clearTimeout(menuTimeout);
        menuItems.style.display = 'flex';
        hamburgerIcon.style.transform = 'rotate(90deg)';
        menuOpen = true;
    });
    
    hamburgerIcon.addEventListener('mouseleave', function() {
        menuTimeout = setTimeout(function() {
            if (!isHovering(menuItems)) {
                menuItems.style.display = 'none';
                hamburgerIcon.style.transform = 'rotate(0deg)';
                menuOpen = false;
            }
        }, 300);
    });
    
    menuItems.addEventListener('mouseenter', function() {
        clearTimeout(menuTimeout);
    });
    
    menuItems.addEventListener('mouseleave', function() {
        menuTimeout = setTimeout(function() {
            menuItems.style.display = 'none';
            hamburgerIcon.style.transform = 'rotate(0deg)';
            menuOpen = false;
        }, 300);
    });
    
    // For click on mobile
    hamburgerIcon.addEventListener('click', function(event) {
        event.stopPropagation();
        
        if (!menuOpen) {
            menuItems.style.display = 'flex';
            hamburgerIcon.style.transform = 'rotate(90deg)';
            menuOpen = true;
        } else {
            menuItems.style.display = 'none';
            hamburgerIcon.style.transform = 'rotate(0deg)';
            menuOpen = false;
        }
    });
    
    // Prevent menu from closing when clicking on menu items
    menuItems.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

// Close menu when clicking elsewhere on the page
document.addEventListener('click', function() {
    if (menuOpen) {
        menuItems.style.display = 'none';
        hamburgerIcon.style.transform = 'rotate(0deg)';
        menuOpen = false;
    }
});

// Helper function to check if element is being hovered
function isHovering(element) {
    return element.matches(':hover');
}
    // Moderator functionality
    if (modIcon) {
        modIcon.addEventListener('click', function() {
            if (modAccessModal) {
                // Force display style to be flex (not just removing hidden class)
                modAccessModal.style.display = 'flex';
                modAccessModal.classList.remove('hidden');
                
                if (modPasswordInput) {
                    modPasswordInput.value = '';
                    modPasswordInput.focus();
                }
            }
        });
    }
    
    // Close modal button (X)
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideModal();
        });
    }
    
    // Function to properly hide the modal
    function hideModal() {
        if (modAccessModal) {
            modAccessModal.style.display = 'none';
            modAccessModal.classList.add('hidden');
        }
    }
    
    // Close modal when clicking outside it
    window.addEventListener('click', function(event) {
        if (modAccessModal && event.target === modAccessModal) {
            hideModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideModal();
        }
    });
    
    if (submitModPassword) {
        submitModPassword.addEventListener('click', function() {
            validateModPassword();
        });
        
        if (modPasswordInput) {
            modPasswordInput.addEventListener('keyup', function(event) {
                if (event.key === "Enter") {
                    validateModPassword();
                }
            });
        }
    }
    
    function validateModPassword() {
        if (!modPasswordInput || !modError) return;
        
        const password = modPasswordInput.value;
        
        if (password === MOD_PASSWORD) {
            // Grant moderator access
            localStorage.setItem(STORAGE_KEY_MOD_STATUS, "true");
            
            // Close the modal before redirecting
            hideModal();
            
            // Show success message
            modError.textContent = "";
            
            // Update the menu to show moderator panel link
            if (modLink) {
                modLink.classList.remove('hidden');
            }
            
            // Redirect to moderator panel
            window.location.href = "moderator.html";
        } else {
            modError.textContent = "Invalid moderator password. Please try again.";
            modPasswordInput.value = "";
            modPasswordInput.focus();
        }
    }
    
    function checkModStatus() {
        const isModerator = localStorage.getItem(STORAGE_KEY_MOD_STATUS) === "true";
        
        if (isModerator && modLink) {
            modLink.classList.remove('hidden');
        }
    }
    
});