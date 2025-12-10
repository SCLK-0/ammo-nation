// Simple Modal Background Disable
document.addEventListener('DOMContentLoaded', function() {
    console.log('Modal disable script loaded');
    
    // Function to enable overlay
    function enableOverlay() {
        console.log('Enabling overlay');
        document.body.classList.add('modal-open-disable-bg');
    }
    
    // Function to disable overlay
    function disableOverlay() {
        console.log('Disabling overlay');
        document.body.classList.remove('modal-open-disable-bg');
    }
    
    // Listen for all clicks
    document.addEventListener('click', function(e) {
        console.log('Click detected on:', e.target);
        
        // Check if it's a popup link
        if (e.target.classList.contains('popup_link') || 
            e.target.closest('.popup_link') ||
            e.target.classList.contains('popup_register_link') ||
            e.target.classList.contains('popup_login_link')) {
            
            console.log('Popup link clicked - enabling overlay');
            setTimeout(enableOverlay, 100);
        }
        
        // Check if it's a close button
        if (e.target.classList.contains('popup_close') || 
            e.target.closest('.popup_close')) {
            
            console.log('Close button clicked - disabling overlay');
            setTimeout(disableOverlay, 100);
        }
        
        // Check if clicking outside modal
        if (document.body.classList.contains('modal-open-disable-bg') && 
            !e.target.closest('.popup_wrap') && 
            !e.target.classList.contains('popup_link') &&
            !e.target.closest('.popup_link')) {
            
            console.log('Clicked outside modal - disabling overlay');
            setTimeout(disableOverlay, 100);
        }
    });
    
    // Listen for ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('modal-open-disable-bg')) {
            console.log('ESC pressed - disabling overlay');
            disableOverlay();
        }
    });
    
    // Debug functions for testing
    window.testOverlay = function() {
        console.log('Manual overlay test');
        enableOverlay();
    };
    
    window.removeOverlay = function() {
        console.log('Manual overlay removal');
        disableOverlay();
    };
    
    // Check if popup links exist
    const popupLinks = document.querySelectorAll('.popup_link');
    console.log('Found popup links:', popupLinks.length);
});