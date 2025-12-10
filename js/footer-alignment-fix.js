/**
 * Footer Alignment Fix - Force Left Alignment
 * This script ensures all footer content is left-aligned on mobile
 */
(function() {
    'use strict';
    
    function fixFooterAlignment() {
        // Only run on mobile devices
        if (window.innerWidth <= 768) {
            // PRIORITY FIX: Widget titles first
            var widgetTitles = document.querySelectorAll('.footer_wrap .widget_title, .footer_wrap .widgettitle, .footer_wrap h3, .footer_wrap h4, .footer_wrap h5');
            widgetTitles.forEach(function(title) {
                title.style.setProperty('text-align', 'left', 'important');
                title.style.setProperty('margin-left', '0', 'important');
                title.style.setProperty('padding-left', '0', 'important');
                title.style.setProperty('display', 'block', 'important');
                title.style.setProperty('width', '100%', 'important');
                
                // Remove center/right classes
                title.classList.remove('text-center', 'text-right', 'center', 'right', 'centered');
                title.classList.add('text-left');
                
                // Remove any inline styles that might center the text
                if (title.style.textAlign && title.style.textAlign !== 'left') {
                    title.style.textAlign = 'left';
                }
            });
            
            // Get all footer elements
            var footerElements = document.querySelectorAll('.footer_wrap .widget_area .widget *');
            
            // Force left alignment on all elements
            footerElements.forEach(function(element) {
                element.style.setProperty('text-align', 'left', 'important');
                element.style.setProperty('margin-left', '0', 'important');
                element.style.setProperty('padding-left', '0', 'important');
                
                // Remove any center or right alignment classes
                element.classList.remove('text-center', 'text-right', 'center', 'right', 'centered');
                
                // Add left alignment class if it exists
                if (!element.classList.contains('text-left')) {
                    element.classList.add('text-left');
                }
            });
            
            // Specifically target widget containers
            var widgets = document.querySelectorAll('.footer_wrap .widget_area .widget');
            widgets.forEach(function(widget) {
                widget.style.textAlign = 'left';
            });
            
            // Target product lists specifically
            var productLists = document.querySelectorAll('.footer_wrap .widget ul li');
            productLists.forEach(function(item) {
                item.style.textAlign = 'left';
                item.style.display = 'block';
                item.style.width = '100%';
                
                // Fix child elements
                var children = item.querySelectorAll('*');
                children.forEach(function(child) {
                    child.style.textAlign = 'left';
                });
            });
            
            // Target specific content types
            var productLinks = document.querySelectorAll('.footer_wrap .widget ul li a');
            productLinks.forEach(function(link) {
                link.style.textAlign = 'left';
                link.style.display = 'block';
            });
            
            var prices = document.querySelectorAll('.footer_wrap .widget .price, .footer_wrap .widget .amount');
            prices.forEach(function(price) {
                price.style.textAlign = 'left';
                price.style.display = 'block';
            });
            
            var ratings = document.querySelectorAll('.footer_wrap .widget .star-rating');
            ratings.forEach(function(rating) {
                rating.style.textAlign = 'left';
                rating.style.display = 'block';
            });
        }
    }
    
    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixFooterAlignment);
    } else {
        fixFooterAlignment();
    }
    
    // Run on window resize
    window.addEventListener('resize', function() {
        setTimeout(fixFooterAlignment, 100);
    });
    
    // Run periodically to catch any dynamically loaded content
    setInterval(fixFooterAlignment, 500);
    
    // Also run when the page becomes visible (in case of tab switching)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(fixFooterAlignment, 100);
        }
    });
    
    // Run on scroll (in case content loads dynamically)
    var scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(fixFooterAlignment, 200);
    });
    
})();