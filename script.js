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
    document.addEventListener('DOMContentLoaded', function() {
        // Constants for localStorage keys
        const STORAGE_KEY_BUILDS = "betaBuilds";
        const STORAGE_KEY_AUTH_STATUS = "betaAuthStatus";
        const STORAGE_KEY_MOD_STATUS = "modStatus";
        
        // Elements for beta testers
        const versionSelect = document.getElementById('version-select');
        const downloadBtn = document.getElementById('download-btn');
        const detailVersion = document.getElementById('detail-version');
        const detailDate = document.getElementById('detail-date');
        const detailSize = document.getElementById('detail-size');
        const notesContent = document.getElementById('notes-content');
        
        // Elements for moderators
        const uploadForm = document.getElementById('upload-form');
        const fileUpload = document.getElementById('file-upload');
        const fileName = document.getElementById('file-name');
        const buildVersion = document.getElementById('build-version');
        const buildNotes = document.getElementById('build-notes');
        const uploadProgress = document.getElementById('upload-progress');
        const progressBar = uploadProgress ? uploadProgress.querySelector('.progress-bar') : null;
        const progressText = uploadProgress ? uploadProgress.querySelector('.progress-text') : null;
        const uploadMessage = document.getElementById('upload-message');
        const buildsTableBody = document.getElementById('builds-table-body');
        const noBuildsMessage = document.getElementById('no-builds-message');
        
        // Modal elements
        const notesModal = document.getElementById('notes-modal');
        const deleteModal = document.getElementById('delete-modal');
        const editNotes = document.getElementById('edit-notes');
        const saveNotes = document.getElementById('save-notes');
        const confirmDelete = document.getElementById('confirm-delete');
        const notesCloseButtons = document.querySelectorAll('.notes-close');
        const deleteCloseButtons = document.querySelectorAll('.delete-close');
        
        let currentEditVersion = null;
        let currentDeleteVersion = null;
        
        // Initialize the file system
        initializeFileSystem();
        
        // Setup event listeners
        setupEventListeners();
        
        // Functions
        function initializeFileSystem() {
            // Initialize builds storage if not exists
            if (!localStorage.getItem(STORAGE_KEY_BUILDS)) {
                localStorage.setItem(STORAGE_KEY_BUILDS, JSON.stringify([]));
            }
            
            // Check if user is a beta tester or moderator
            const isModerator = localStorage.getItem(STORAGE_KEY_MOD_STATUS) === "true";
            const isBetaTester = localStorage.getItem(STORAGE_KEY_AUTH_STATUS) === "approved" || isModerator;
            
            // Load beta builds for testers
            if (isBetaTester && versionSelect) {
                loadBetaVersions();
            }
            
            // Load builds table for moderators
            if (isModerator && buildsTableBody) {
                loadBuildsTable();
            }
        }
        
        function setupEventListeners() {
            // Beta tester event listeners
            if (versionSelect) {
                versionSelect.addEventListener('change', function() {
                    const selectedVersion = this.value;
                    if (selectedVersion) {
                        updateBuildDetails(selectedVersion);
                        downloadBtn.disabled = false;
                    } else {
                        resetBuildDetails();
                        downloadBtn.disabled = true;
                    }
                });
            }
            
            if (downloadBtn) {
                downloadBtn.addEventListener('click', function() {
                    const selectedVersion = versionSelect.value;
                    if (selectedVersion) {
                        downloadBuild(selectedVersion);
                    }
                });
            }
            
            // Moderator event listeners
            if (fileUpload) {
                fileUpload.addEventListener('change', function() {
                    fileName.textContent = this.files.length > 0 ? this.files[0].name : 'No file selected';
                });
            }
            
            if (uploadForm) {
                uploadForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    uploadBuild();
                });
            }
            
            // Modal event listeners
            if (notesCloseButtons) {
                notesCloseButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        if (notesModal) notesModal.classList.add('hidden');
                    });
                });
            }
            
            if (deleteCloseButtons) {
                deleteCloseButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        if (deleteModal) deleteModal.classList.add('hidden');
                    });
                });
            }
            
            if (saveNotes) {
                saveNotes.addEventListener('click', function() {
                    if (currentEditVersion) {
                        updateBuildNotes(currentEditVersion, editNotes.value);
                    }
                });
            }
            
            if (confirmDelete) {
                confirmDelete.addEventListener('click', function() {
                    if (currentDeleteVersion) {
                        deleteBuild(currentDeleteVersion);
                    }
                });
            }
        }
        
        // Beta Tester Functions
        function loadBetaVersions() {
            const builds = JSON.parse(localStorage.getItem(STORAGE_KEY_BUILDS)) || [];
            
            // Clear existing options except the placeholder
            while (versionSelect.options.length > 1) {
                versionSelect.remove(1);
            }
            
            if (builds.length === 0) {
                const option = document.createElement('option');
                option.value = "";
                option.text = "No builds available";
                option.disabled = true;
                versionSelect.add(option);
                return;
            }
            
            // Sort builds by version (assuming semantic versioning)
            builds.sort((a, b) => {
                return compareVersions(b.version, a.version); // newest first
            });
            
            // Add options for each build
            builds.forEach(build => {
                const option = document.createElement('option');
                option.value = build.version;
                option.text = build.version;
                versionSelect.add(option);
            });
            
            // Select the newest version and update details
            if (builds.length > 0) {
                versionSelect.value = builds[0].version;
                updateBuildDetails(builds[0].version);
                downloadBtn.disabled = false;
            }
        }
        
        function updateBuildDetails(version) {
            const builds = JSON.parse(localStorage.getItem(STORAGE_KEY_BUILDS)) || [];
            const build = builds.find(b => b.version === version);
            
            if (build) {
                detailVersion.textContent = build.version;
                
                const date = new Date(build.date);
                detailDate.textContent = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                detailSize.textContent = build.fileSize + ' MB';
                notesContent.textContent = build.notes || 'No release notes available for this version.';
            } else {
                resetBuildDetails();
            }
        }
        
        function resetBuildDetails() {
            detailVersion.textContent = '-';
            detailDate.textContent = '-';
            detailSize.textContent = '-';
            notesContent.textContent = 'Select a version to view release notes.';
        }
        
        function downloadBuild(version) {
            const builds = JSON.parse(localStorage.getItem(STORAGE_KEY_BUILDS)) || [];
            const build = builds.find(b => b.version === version);
            
            if (build) {
                // In a real implementation, this would redirect to a secure download URL
                // For this simulation, we'll just create a dummy download experience
                
                alert(`Download starting for ${build.version}!\n\nIn a real implementation, this would download the actual file.`);
                
                // For a real implementation, you would use something like:
                // window.location.href = build.downloadUrl;
                
                // Or for a more controlled download:
                /*
                const link = document.createElement('a');
                link.href = build.downloadUrl;
                link.download = build.fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                */
            }
        }
        
        // Moderator Functions
        function uploadBuild() {
            const version = buildVersion.value.trim();
            const notes = buildNotes.value.trim();
            const file = fileUpload.files[0];
            
            if (!version) {
                showMessage(uploadMessage, 'Please enter a build version.', 'error');
                return;
            }
            
            if (!file) {
                showMessage(uploadMessage, 'Please select a file to upload.', 'error');
                return;
            }
            
            // Validate version format (optional)
            if (!isValidVersion(version)) {
                showMessage(uploadMessage, 'Please use a valid version format (e.g., v1.0.0 or 1.0.0).', 'error');
                return;
            }
            
            // Check for duplicate version
            const builds = JSON.parse(localStorage.getItem(STORAGE_KEY_BUILDS)) || [];
            const existingBuild = builds.find(b => b.version === version);
            
            if (existingBuild) {
                if (!confirm(`A build with version ${version} already exists. Do you want to replace it?`)) {
                    return;
                }
                // Remove the existing build
                const index = builds.findIndex(b => b.version === version);
                if (index !== -1) {
                    builds.splice(index, 1);
                }
            }
            
            // Show upload progress
            uploadProgress.classList.remove('hidden');
            
            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 5;
                progressBar.style.width = progress + '%';
                progressText.textContent = `Uploading: ${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Create the build object
                    const newBuild = {
                        version: version,
                        fileName: file.name,
                        fileSize: (file.size / (1024 * 1024)).toFixed(2), // Convert to MB
                        notes: notes,
                        date: new Date().toISOString(),
                        // In a real implementation, you would store:
                        // downloadUrl: 'https://example.com/downloads/your-file.zip'
                    };
                    
                    // Add to builds array
                    builds.push(newBuild);
                    localStorage.setItem(STORAGE_KEY_BUILDS, JSON.stringify(builds));
                    
                    // Show success message
                    showMessage(uploadMessage, 'Build uploaded successfully!', 'success');
                    
                    // Reset form
                    uploadForm.reset();
                    fileName.textContent = 'No file selected';
                    
                    // Hide progress bar after a moment
                    setTimeout(() => {
                        uploadProgress.classList.add('hidden');
                        // Refresh the builds table
                        loadBuildsTable();
                    }, 1500);
                }
            }, 100);
        }
        
        function loadBuildsTable() {
            const builds = JSON.parse(localStorage.getItem(STORAGE_KEY_BUILDS)) || [];
            
            // Sort builds by date (newest first)
            builds.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            if (builds.length === 0) {
                buildsTableBody.innerHTML = '';
                noBuildsMessage.classList.remove('hidden');
                return;
            }
            
            noBuildsMessage.classList.add('hidden');
            buildsTableBody.innerHTML = '';
            
            builds.forEach(build => {
                const date = new Date(build.date);
                const formattedDate = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${build.version}</td>
                    <td>${build.fileName}</td>
                    <td>${build.fileSize} MB</td>
                    <td>${formattedDate}</td>
                    <td class="action-btns">
                        <button class="edit-btn" data-version="${build.version}">
                            <i class="fas fa-edit"></i> Edit Notes
                        </button>
                        <button class="delete-btn" data-version="${build.version}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                `;
                
                buildsTableBody.appendChild(tr);
            });
            
            // Add event listeners to buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const version = this.dataset.version;
                    openNotesEditor(version);
                });
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const version = this.dataset.version;
                    openDeleteConfirmation(version);
                });
            });
        }
        
        function openNotesEditor(version) {
            const builds = JSON.parse(localStorage.getItem(STORAGE_KEY_BUILDS)) || [];
            const build = builds.find(b => b.version === version);
            
            if (build) {
                editNotes.value = build.notes || '';
                currentEditVersion = version;
                notesModal.classList.remove('hidden');
            }
        }
        
        function openDeleteConfirmation(version) {
            currentDeleteVersion = version;
            deleteModal.classList.remove('hidden');
        }
        
        function updateBuildNotes(version, notes) {
            const builds = JSON.parse(localStorage.getItem(STORAGE_KEY_BUILDS)) || [];
            const buildIndex = builds.findIndex(b => b.version === version);
            
            if (buildIndex !== -1) {
                builds[buildIndex].notes = notes;
                localStorage.setItem(STORAGE_KEY_BUILDS, JSON.stringify(builds));
                
                // Close the modal
                notesModal.classList.add('hidden');
                
                // Show success message
                showMessage(uploadMessage, 'Release notes updated successfully!', 'success');
                
                // Refresh the builds table
                loadBuildsTable();
            }
        }
        
        function deleteBuild(version) {
            const builds = JSON.parse(localStorage.getItem(STORAGE_KEY_BUILDS)) || [];
            const updatedBuilds = builds.filter(b => b.version !== version);
            
            localStorage.setItem(STORAGE_KEY_BUILDS, JSON.stringify(updatedBuilds));
            
            // Close the modal
            deleteModal.classList.add('hidden');
            
            // Show success message
            showMessage(uploadMessage, `Build ${version} has been deleted.`, 'success');
            
            // Refresh the builds table
            loadBuildsTable();
        }
        
        // Helper Functions
        function showMessage(element, message, type) {
            if (!element) return;
            
            element.textContent = message;
            element.className = 'message';
            
            if (type === 'success') {
                element.classList.add('success-message');
            } else if (type === 'error') {
                element.classList.add('error-message');
            }
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                element.textContent = '';
                element.className = 'message';
            }, 5000);
        }
        
        function isValidVersion(version) {
            // Simple validation - allowing common version formats
            return /^v?\d+(\.\d+)*(-[a-zA-Z0-9.]+)?$/.test(version);
        }
        
        function compareVersions(versionA, versionB) {
            // Remove leading 'v' if present
            const cleanA = versionA.startsWith('v') ? versionA.substring(1) : versionA;
            const cleanB = versionB.startsWith('v') ? versionB.substring(1) : versionB;
            
            const partsA = cleanA.split('.');
            const partsB = cleanB.split('.');
            
            for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
                const numA = parseInt(partsA[i] || 0);
                const numB = parseInt(partsB[i] || 0);
                
                if (numA > numB) return 1;
                if (numA < numB) return -1;
            }
            
            return 0;
        }
    });
    
});