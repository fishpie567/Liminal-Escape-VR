document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully!');
    
    const shareButton = document.getElementById('shareButton');
    const copyMessage = document.getElementById('copyMessage');
    
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
    
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent document click handler from firing
            
            menuOpen = !menuOpen;
            
            if (menuOpen) {
                menuItems.style.display = 'flex';
                hamburgerIcon.style.transform = 'rotate(90deg)';
            } else {
                menuItems.style.display = 'none';
                hamburgerIcon.style.transform = 'rotate(0deg)';
            }
        });
        
        // Prevent menu from closing when clicking on menu items
        menuItems.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent document click handler from firing
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
});