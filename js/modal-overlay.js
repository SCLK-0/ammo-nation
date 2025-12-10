// Modal Overlay Script
document.addEventListener('DOMContentLoaded', function() {
    // Create overlay element
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 999;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    // Get or create overlay
    let overlay = document.getElementById('modal-overlay') || createOverlay();
    
    // Function to close mobile menu
    function closeMobileMenu() {
        // Remove mobile menu open classes
        document.body.classList.remove('menu_show');
        document.body.classList.remove('menu_mobile');
        
        // Close any open mobile menu panels
        const mobileMenu = document.querySelector('.menu_pushy_wrap');
        if (mobileMenu) {
            mobileMenu.classList.remove('menu_pushy_open');
        }
        
        // Reset menu button state
        const menuButton = document.querySelector('.menu_button');
        if (menuButton) {
            menuButton.classList.remove('menu_opened');
        }
        
        // Hide mobile menu overlay if exists
        const menuOverlay = document.querySelector('.menu_pushy_overlay');
        if (menuOverlay) {
            menuOverlay.style.display = 'none';
        }
    }

    // Show overlay
    function showOverlay(targetModal) {
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Prevent scrolling on both html and body
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        
        // Store current scroll position to restore later
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        
        // Center the modal properly
        if (targetModal) {
            targetModal.style.cssText += `
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                right: auto !important;
                z-index: 1000 !important;
                max-height: 90vh !important;
                overflow-y: auto !important;
            `;
        }
    }

    // Hide overlay
    function hideOverlay() {
        // Try multiple methods to close the modal
        const openModal = document.querySelector('.popup_wrap:target');
        if (openModal) {
            // Method 1: Force hide with display none
            openModal.style.display = 'none !important';
            
            // Method 2: Simulate close button click
            const closeBtn = openModal.querySelector('.popup_close');
            if (closeBtn) {
                closeBtn.click();
            }
        }
        
        // Method 3: Remove hash (for CSS :target)
        if (window.location.hash) {
            history.pushState("", document.title, window.location.pathname + window.location.search);
        }
        
        // Hide overlay immediately
        overlay.style.opacity = '0';
        
        // Cleanup after short delay
        setTimeout(() => {
            overlay.style.display = 'none';
            
            // Restore scrolling and scroll position
            const scrollY = document.body.style.top;
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // Restore scroll position
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
            
            // Reset all modal positioning and display
            modals.forEach(modal => {
                modal.style.cssText = modal.style.cssText.replace(/position:[^;]*;?/gi, '')
                                                         .replace(/top:[^;]*;?/gi, '')
                                                         .replace(/left:[^;]*;?/gi, '')
                                                         .replace(/transform:[^;]*;?/gi, '')
                                                         .replace(/right:[^;]*;?/gi, '')
                                                         .replace(/z-index:[^;]*;?/gi, '')
                                                         .replace(/max-height:[^;]*;?/gi, '')
                                                         .replace(/overflow-y:[^;]*;?/gi, '')
                                                         .replace(/display:[^;]*;?/gi, '');
            });
        }, 100);
    }

    // Find all modal triggers
    const modalTriggers = document.querySelectorAll('.popup_login_link, .popup_register_link');
    const modalCloses = document.querySelectorAll('.popup_close');
    const modals = document.querySelectorAll('.popup_wrap');

    // Add click handlers to modal triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            // Close mobile menu if open
            closeMobileMenu();
            
            // Get target modal
            const targetId = this.getAttribute('href');
            const targetModal = document.querySelector(targetId);
            
            showOverlay(targetModal);
        });
    });

    // Add click handlers to close buttons
    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideOverlay();
        });
    });

    // Close modal when clicking outside modal content
    document.addEventListener('click', function(e) {
        // Check if a modal is currently open
        const openModal = document.querySelector('.popup_wrap:target');
        if (openModal && overlay.style.display === 'block') {
            // Don't close if clicking on modal triggers
            if (e.target.closest('.popup_login_link, .popup_register_link')) {
                return;
            }
            
            // Check if click is inside the modal
            const clickedInsideModal = openModal.contains(e.target);
            
            // If clicked outside modal, close it
            if (!clickedInsideModal) {
                e.preventDefault();
                hideOverlay();
            }
        }
    });

    // Also add click handler directly to overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            hideOverlay();
        }
    });

    // Handle hash changes (when modal closes via URL)
    window.addEventListener('hashchange', function() {
        if (!window.location.hash || window.location.hash === '#') {
            hideOverlay();
        }
    });
});