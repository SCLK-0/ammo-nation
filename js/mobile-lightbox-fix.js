// IMMEDIATE TRIGGER PREVENTION (runs before DOM is ready)
if (window.innerWidth <= 1024) {
    // Override document.createElement to prevent trigger creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        
        // If it's an anchor tag, watch for trigger-like behavior
        if (tagName.toLowerCase() === 'a') {
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function(name, value) {
                if (name === 'href' && value === '#' && 
                    element.className && element.className.includes('trigger')) {
                    console.log('Blocked trigger creation');
                    return;
                }
                return originalSetAttribute.call(element, name, value);
            };
        }
        
        return element;
    };
}

// Mobile Lightbox Fix for Product Images
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile lightbox script loaded');
    
    // Function to check if mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Function to check if we should use custom lightbox (mobile or if other lightboxes fail)
    function shouldUseCustomLightbox() {
        return true; // Always use our custom lightbox for consistent experience
    }
    
    // Function to create lightbox (make it globally accessible)
    function createLightbox(imgSrc) {
        console.log('Creating lightbox for:', imgSrc);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'mobile-lightbox';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        overlay.style.zIndex = '99998';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.cursor = 'pointer';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        
        // Create image
        const img = document.createElement('img');
        img.src = imgSrc;
        // Responsive image sizing
        if (window.innerWidth <= 768) {
            img.style.maxWidth = '95vw';
            img.style.maxHeight = '85vh';
        } else {
            img.style.maxWidth = '90vw';
            img.style.maxHeight = '90vh';
        }
        img.style.objectFit = 'contain';
        
        // Add error handling for image loading
        img.onerror = function() {
            console.error('Failed to load image:', imgSrc);
            // Show error message
            const errorMsg = document.createElement('div');
            errorMsg.innerHTML = 'Image could not be loaded';
            errorMsg.style.color = 'white';
            errorMsg.style.fontSize = '18px';
            errorMsg.style.textAlign = 'center';
            overlay.replaceChild(errorMsg, img);
        };
        
        img.onload = function() {
            console.log('Image loaded successfully:', imgSrc);
        };
        
        // Create close button (X)
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = 'CLOSE';
        closeBtn.style.position = 'fixed';
        // Responsive close button positioning
        if (window.innerWidth <= 768) {
            closeBtn.style.top = '15px';
            closeBtn.style.right = '15px';
        } else {
            closeBtn.style.top = '30px';
            closeBtn.style.right = '30px';
        }
        closeBtn.style.color = '#ffffff';
        closeBtn.style.fontSize = '12px';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.width = '60px';
        closeBtn.style.height = '35px';
        closeBtn.style.display = 'flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.justifyContent = 'center';
        closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        closeBtn.style.borderRadius = '20px';
        closeBtn.style.zIndex = '99999';
        closeBtn.style.border = '3px solid rgba(255, 255, 255, 0.5)';
        closeBtn.style.transition = 'all 0.2s ease';
        closeBtn.style.userSelect = 'none';
        closeBtn.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
        
        console.log('Close button created:', closeBtn);
        
        // Add hover effect for close button
        closeBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(220, 20, 60, 0.8)';
            this.style.transform = 'scale(1.1)';
        });
        
        closeBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.style.transform = 'scale(1)';
        });
        
        overlay.appendChild(img);
        document.body.appendChild(overlay);
        document.body.appendChild(closeBtn);
        
        console.log('Lightbox created with close button');
        console.log('Close button in DOM:', document.querySelector('.close-btn'));
        

        
        // Prevent background scrolling
        const scrollY = window.scrollY;
        document.body.classList.add('lightbox-open');
        document.body.style.top = `-${scrollY}px`;
        
        // Prevent touch scrolling on the overlay
        overlay.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        // Fade in animation
        setTimeout(function() {
            overlay.style.opacity = '1';
        }, 10);
        
        // Close function
        function closeLightbox() {
            console.log('Closing lightbox');
            if (document.getElementById('mobile-lightbox')) {
                // Fade out animation
                overlay.style.opacity = '0';
                
                setTimeout(function() {
                    // Restore scroll position
                    const scrollY = document.body.style.top;
                    document.body.classList.remove('lightbox-open');
                    document.body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                    
                    // Remove lightbox and close buttons
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                    if (document.body.contains(closeBtn)) {
                        document.body.removeChild(closeBtn);
                    }
                }, 300);
            }
        }
        
        // Event listeners
        overlay.addEventListener('click', function(e) {
            // Only close if clicking on the overlay background, not the image or close button
            if (e.target === overlay) {
                closeLightbox();
            }
        });
        
        // Prevent image from closing lightbox when clicked
        img.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        closeBtn.addEventListener('click', closeLightbox);
        
        // Add keyboard support (Escape key)
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleKeydown);
            }
        }
        document.addEventListener('keydown', handleKeydown);
    }
    
    // Disable existing lightbox systems immediately
    if (typeof jQuery !== 'undefined') {
        jQuery(document).ready(function($) {
            console.log('Disabling existing lightbox systems immediately...');
            
            // Disable WooCommerce gallery lightbox
            $('.woocommerce-product-gallery').removeClass('wc-product-gallery-lightbox');
            $('.woocommerce-product-gallery__trigger').remove();
            
            // Remove lightbox data attributes
            $('.woocommerce-product-gallery__image a').each(function() {
                $(this).removeAttr('data-rel')
                       .removeAttr('data-lightbox')
                       .removeAttr('data-fancybox')
                       .removeAttr('data-gallery');
            });
        });
    }
    
    // Wait a bit for WooCommerce to load
    setTimeout(function() {
        if (shouldUseCustomLightbox()) {
            console.log('Setting up custom lightbox for all devices');
            
            // Try multiple selectors
            const selectors = [
                '.woocommerce-product-gallery__image a',
                '.woocommerce-product-gallery .woocommerce-product-gallery__image a',
                '.product .images .woocommerce-product-gallery__image a'
            ];
            
            let galleryImages = [];
            
            for (let selector of selectors) {
                galleryImages = document.querySelectorAll(selector);
                if (galleryImages.length > 0) {
                    console.log('Found images with selector:', selector, galleryImages.length);
                    break;
                }
            }
            
            if (galleryImages.length === 0) {
                console.log('No gallery images found, trying fallback');
                galleryImages = document.querySelectorAll('.woocommerce div.product div.images a');
            }
            
            console.log('Total gallery images found:', galleryImages.length);
            
            galleryImages.forEach(function(link, index) {
                console.log('Setting up click handler for image', index);
                
                // Remove any existing event listeners and attributes first
                link.removeAttribute('data-fancybox');
                link.removeAttribute('data-lightbox');
                link.removeAttribute('data-rel');
                link.removeAttribute('data-gallery');
                
                // Store original href and replace with javascript:void(0)
                const originalHref = link.getAttribute('href');
                link.setAttribute('data-original-href', originalHref);
                link.setAttribute('href', 'javascript:void(0)');
                
                // Add event listener with capture to intercept before other handlers
                link.addEventListener('click', function(e) {
                    console.log('Custom lightbox click intercepted');
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    console.log('Image clicked');
                    
                    // Get image source - prioritize the actual img src over href
                    const img = this.querySelector('img');
                    let imgSrc = null;
                    
                    if (img) {
                        // Try different image source attributes in order of preference
                        imgSrc = img.getAttribute('data-large_image') || 
                                img.getAttribute('data-src') || 
                                img.src;
                    }
                    
                    // Fallback to original href if no img found
                    if (!imgSrc) {
                        imgSrc = this.getAttribute('data-original-href') || this.getAttribute('href');
                    }
                    
                    console.log('Image source:', imgSrc);
                    console.log('Link href:', this.getAttribute('href'));
                    console.log('Img src:', img ? img.src : 'No img found');
                    console.log('Img data-large_image:', img ? img.getAttribute('data-large_image') : 'No img found');
                    
                    if (imgSrc) {
                        createLightbox(imgSrc);
                    } else {
                        console.error('No valid image source found');
                    }
                }, true); // Use capture phase to intercept before other handlers
            });
            
            // Also override with jQuery if available for extra safety
            if (typeof jQuery !== 'undefined') {
                jQuery('.woocommerce-product-gallery__image a').off('click').on('click', function(e) {
                    console.log('jQuery override click handler');
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const img = jQuery(this).find('img')[0];
                    let imgSrc = null;
                    
                    if (img) {
                        imgSrc = img.getAttribute('data-large_image') || 
                                img.getAttribute('data-src') || 
                                img.src;
                    }
                    
                    if (!imgSrc) {
                        imgSrc = this.getAttribute('data-original-href') || this.getAttribute('href');
                    }
                    
                    if (imgSrc) {
                        createLightbox(imgSrc);
                    }
                    
                    return false;
                });
            }
        }
    }, 1000);
    
    // Make createLightbox globally accessible
    window.createLightbox = createLightbox;
});

// Mobile Menu Close on Login/Register Modal Open
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu close script loaded');
    
    // Function to close mobile menu
    function closeMobileMenu() {
        console.log('Closing mobile menu');
        const sideWrap = document.querySelector('.header_mobile .side_wrap');
        const mask = document.querySelector('.header_mobile .mask');
        const html = document.documentElement;
        
        if (sideWrap) {
            sideWrap.classList.remove('open');
        }
        if (mask) {
            mask.classList.remove('show');
        }
        if (html) {
            html.classList.remove('menu_mobile_open');
        }
    }
    
    // Wait for jQuery and other scripts to load
    setTimeout(function() {
        // Check if we're in mobile view
        function isMobileView() {
            return window.innerWidth <= 1024; // Using the same breakpoint as the theme
        }
        
        // Add event listeners to login and register links in mobile menu
        const mobilePopupLinks = document.querySelectorAll('.header_mobile .popup_link');
        
        console.log('Found mobile popup links:', mobilePopupLinks.length);
        
        // Add click handlers to all popup links in mobile menu
        mobilePopupLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (isMobileView()) {
                    console.log('Mobile popup link clicked, closing menu');
                    // Small delay to ensure the popup starts opening first
                    setTimeout(closeMobileMenu, 100);
                }
            });
        });
        
        // Also listen for popup show events if using jQuery
        if (typeof jQuery !== 'undefined') {
            // Listen for when popups are shown
            jQuery(document).on('click', '.header_mobile .popup_link', function() {
                if (isMobileView()) {
                    console.log('jQuery: Mobile popup link clicked, closing menu');
                    setTimeout(function() {
                        jQuery('.header_mobile .side_wrap').removeClass('open');
                        jQuery('.header_mobile .mask').removeClass('show');
                        jQuery('html').removeClass('menu_mobile_open');
                    }, 100);
                }
            });
            
            // Disable other lightbox plugins to prevent conflicts
            setTimeout(function() {
                console.log('Disabling existing lightbox systems...');
                
                // Disable PhotoSwipe
                if (typeof PhotoSwipe !== 'undefined') {
                    console.log('Disabling PhotoSwipe');
                    jQuery('.woocommerce-product-gallery').off('click', '**');
                }
                
                // Disable Magnific Popup
                if (jQuery.magnificPopup) {
                    console.log('Disabling Magnific Popup');
                    jQuery('.woocommerce-product-gallery__image a').magnificPopup('destroy');
                    jQuery('.woocommerce-product-gallery__image a').off('click');
                }
                
                // Disable WooCommerce gallery lightbox
                jQuery('.woocommerce-product-gallery').removeClass('wc-product-gallery-lightbox');
                jQuery('.woocommerce-product-gallery__trigger').remove();
                
                // Remove any data attributes that might trigger other lightboxes
                jQuery('.woocommerce-product-gallery__image a').each(function() {
                    jQuery(this).removeAttr('data-rel')
                             .removeAttr('data-lightbox')
                             .removeAttr('data-fancybox')
                             .removeAttr('data-gallery');
                });
                
            }, 500);
        }
        
    }, 500);
});

// Disable zoom functionality on mobile devices
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile zoom disable script loaded');
    
    // Function to check if mobile
    function isMobileDevice() {
        return window.innerWidth <= 1024;
    }
    
    // Function to disable zoom
    function disableZoomOnMobile() {
        if (isMobileDevice()) {
            console.log('Disabling zoom on mobile');
            
            // Remove any existing zoom images
            const zoomImages = document.querySelectorAll('.zoomImg');
            zoomImages.forEach(function(img) {
                if (img.parentNode) {
                    img.parentNode.removeChild(img);
                }
            });
            
            // Remove zoom containers
            const zoomContainers = document.querySelectorAll('.zoomContainer');
            zoomContainers.forEach(function(container) {
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            });
            
            // Disable zoom initialization if jQuery zoom is present
            if (typeof jQuery !== 'undefined' && jQuery.fn.zoom) {
                // Destroy existing zoom instances
                jQuery('.woocommerce-product-gallery__image img').trigger('zoom.destroy');
                
                // Prevent zoom from being initialized
                const originalZoom = jQuery.fn.zoom;
                jQuery.fn.zoom = function() {
                    if (window.innerWidth > 1024) {
                        return originalZoom.apply(this, arguments);
                    }
                    return this; // Return jQuery object without applying zoom
                };
            }
        }
    }
    
    // Run on load
    setTimeout(disableZoomOnMobile, 1000);
    
    // Run on window resize
    window.addEventListener('resize', function() {
        setTimeout(disableZoomOnMobile, 100);
    });
});

// Override WooCommerce zoom settings on mobile
document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile and disable WooCommerce zoom
    if (window.innerWidth <= 1024) {
        console.log('Disabling WooCommerce zoom on mobile');
        
        // Override WooCommerce single product params
        if (typeof wc_single_product_params !== 'undefined') {
            wc_single_product_params.zoom_enabled = "0";
        }
        
        // Also disable zoom via jQuery when WooCommerce initializes
        if (typeof jQuery !== 'undefined') {
            jQuery(document).ready(function($) {
                // Disable zoom on product gallery
                $('.woocommerce-product-gallery').off('wc-product-gallery-before-single-product-lightbox');
                
                // Remove zoom functionality
                $('.woocommerce-product-gallery__image').each(function() {
                    $(this).find('img').off('click.zoom');
                    $(this).removeClass('woocommerce-product-gallery__image--placeholder');
                });
                
                // Remove any zoom triggers
                $('.woocommerce-product-gallery__trigger').remove();
            });
        }
    }
});

// Fallback lightbox function
function createFallbackLightbox(imgSrc) {
    console.log('Creating fallback lightbox for:', imgSrc);
    
    // Create simple lightbox
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.zIndex = '99998';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.cursor = 'pointer';
    
    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.objectFit = 'contain';
    
    const closeBtn = document.createElement('div');
    closeBtn.innerHTML = 'CLOSE';
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    closeBtn.style.color = 'white';
    closeBtn.style.padding = '10px 20px';
    closeBtn.style.borderRadius = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '99999';
    
    function closeLightbox() {
        document.body.removeChild(overlay);
        document.body.removeChild(closeBtn);
        document.body.style.overflow = '';
    }
    
    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    
    overlay.appendChild(img);
    document.body.appendChild(overlay);
    document.body.appendChild(closeBtn);
    document.body.style.overflow = 'hidden';
}

// Custom Gallery Expand Icon
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up custom gallery expand icon');
    
    // Function to remove existing triggers and add custom icon
    function setupCustomIcon() {
        console.log('Setting up custom icon...');
        
        // Remove ALL existing gallery triggers
        const existingTriggers = document.querySelectorAll('.woocommerce-product-gallery__trigger');
        console.log('Found existing triggers:', existingTriggers.length);
        existingTriggers.forEach(trigger => {
            console.log('Removing trigger:', trigger);
            trigger.remove();
        });
        
        // Also remove any other expand/zoom icons
        const zoomIcons = document.querySelectorAll('[class*="zoom"], [class*="expand"], [class*="fullscreen"]');
        zoomIcons.forEach(icon => {
            if (icon.classList.contains('woocommerce-product-gallery__trigger') || 
                icon.parentElement.classList.contains('woocommerce-product-gallery')) {
                icon.remove();
            }
        });
        
        // Check if custom icon already exists
        if (document.querySelector('.custom-gallery-expand')) {
            return; // Already exists, don't create another
        }
        
        // Create custom expand icon
        const expandIcon = document.createElement('div');
        expandIcon.className = 'custom-gallery-expand';
        expandIcon.innerHTML = '⤢'; // Simple expand icon
        
        // Style the expand icon
        expandIcon.style.position = 'absolute';
        expandIcon.style.top = '15px';
        expandIcon.style.right = '15px';
        expandIcon.style.width = '40px';
        expandIcon.style.height = '40px';
        expandIcon.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        expandIcon.style.color = 'white';
        expandIcon.style.display = 'flex';
        expandIcon.style.alignItems = 'center';
        expandIcon.style.justifyContent = 'center';
        expandIcon.style.borderRadius = '50%';
        expandIcon.style.cursor = 'pointer';
        expandIcon.style.fontSize = '20px';
        expandIcon.style.fontWeight = 'bold';
        expandIcon.style.zIndex = '1000';
        expandIcon.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        expandIcon.style.transition = 'all 0.2s ease';
        expandIcon.style.userSelect = 'none';
        
        // Add hover effect
        expandIcon.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(220, 20, 60, 0.8)';
            this.style.transform = 'scale(1.1)';
        });
        
        expandIcon.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            this.style.transform = 'scale(1)';
        });
        
        // Add click handler to open our custom lightbox
        expandIcon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Custom expand icon clicked');
            
            // Find the main product image
            const productImage = document.querySelector('.woocommerce-product-gallery__image img');
            if (productImage) {
                let imgSrc = productImage.getAttribute('data-large_image') || 
                           productImage.getAttribute('data-src') || 
                           productImage.src;
                
                console.log('Opening lightbox with image:', imgSrc);
                
                if (imgSrc && typeof window.createLightbox === 'function') {
                    window.createLightbox(imgSrc);
                } else if (imgSrc) {
                    // Fallback: create lightbox inline
                    createFallbackLightbox(imgSrc);
                }
            }
        });
        
        // Add the expand icon to the gallery
        const gallery = document.querySelector('.woocommerce-product-gallery');
        if (gallery) {
            gallery.style.position = 'relative';
            gallery.appendChild(expandIcon);
            console.log('Custom expand icon added to gallery');
        }
    }
    
    // Run immediately
    setupCustomIcon();
    
    // Run multiple times to catch any delayed WooCommerce initialization
    setTimeout(setupCustomIcon, 500);
    setTimeout(setupCustomIcon, 1000);
    setTimeout(setupCustomIcon, 2000);
    
    // Also run when DOM changes (in case WooCommerce adds triggers later)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && 
                        (node.classList.contains('woocommerce-product-gallery__trigger') ||
                         node.querySelector && node.querySelector('.woocommerce-product-gallery__trigger'))) {
                        console.log('WooCommerce added trigger, replacing with custom icon');
                        setTimeout(setupCustomIcon, 100);
                    }
                });
            }
        });
    });
    
    const galleryElement = document.querySelector('.woocommerce-product-gallery');
    if (galleryElement) {
        observer.observe(galleryElement, { childList: true, subtree: true });
    }
});

// NUCLEAR OPTION - Completely eliminate gallery triggers on mobile
if (window.innerWidth <= 1024) {
    console.log('Mobile detected - implementing nuclear trigger removal');
    
    // Function to aggressively remove triggers
    function nuclearTriggerRemoval() {
        // Remove by class
        document.querySelectorAll('.woocommerce-product-gallery__trigger').forEach(el => el.remove());
        
        // Remove by content (magnifying glass)
        document.querySelectorAll('*').forEach(el => {
            if (el.innerHTML && el.innerHTML.includes('🔍')) {
                el.remove();
            }
            if (el.textContent && el.textContent.includes('🔍')) {
                el.remove();
            }
        });
        
        // Remove elements with specific styles
        document.querySelectorAll('.woocommerce-product-gallery *').forEach(el => {
            const style = window.getComputedStyle(el);
            if (style.position === 'absolute' && 
                (el.offsetWidth < 50 && el.offsetHeight < 50) &&
                (el.offsetTop < 100 && el.offsetRight < 100)) {
                console.log('Removing suspicious positioned element:', el);
                el.remove();
            }
        });
        
        // Remove any anchor tags with href="#" inside gallery
        document.querySelectorAll('.woocommerce-product-gallery a[href="#"]').forEach(el => {
            console.log('Removing anchor with href="#":', el);
            el.remove();
        });
    }
    
    // Run immediately
    nuclearTriggerRemoval();
    
    // Run every 100ms for the first 5 seconds
    let counter = 0;
    const interval = setInterval(() => {
        nuclearTriggerRemoval();
        counter++;
        if (counter >= 50) { // 50 * 100ms = 5 seconds
            clearInterval(interval);
        }
    }, 100);
    
    // Override WooCommerce functions that might create triggers
    if (typeof jQuery !== 'undefined') {
        jQuery(document).ready(function($) {
            // Override any function that might add triggers
            const originalPrepend = $.fn.prepend;
            $.fn.prepend = function(content) {
                if (typeof content === 'string' && content.includes('🔍')) {
                    console.log('Blocked prepend with magnifying glass');
                    return this;
                }
                return originalPrepend.call(this, content);
            };
            
            const originalAppend = $.fn.append;
            $.fn.append = function(content) {
                if (typeof content === 'string' && content.includes('🔍')) {
                    console.log('Blocked append with magnifying glass');
                    return this;
                }
                return originalAppend.call(this, content);
            };
        });
    }
}