// Product Gallery Visibility Fix - Enhanced for CZ Shadow
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product gallery fix loaded - Enhanced version');
    
    let mobileFixesApplied = false;
    let originalGalleryHTML = '';
    
    function forceGalleryVisible() {
        // Only apply fixes on mobile devices
        if (window.innerWidth > 768) {
            console.log('Desktop detected - cleaning up mobile fixes if applied');
            cleanupMobileFixes();
            return;
        }
        
        console.log('Mobile detected - forcing gallery visibility with enhanced CZ Shadow fix');
        
        // Store original HTML if not already stored
        if (!originalGalleryHTML) {
            const gallery = document.querySelector('.woocommerce-product-gallery');
            if (gallery) {
                originalGalleryHTML = gallery.innerHTML;
                console.log('Stored original gallery HTML');
            }
        }
        
        // Skip if mobile fixes already applied
        if (mobileFixesApplied) {
            console.log('Mobile fixes already applied, skipping');
            return;
        }
        
        // Find all gallery elements
        const galleries = document.querySelectorAll('.woocommerce-product-gallery');
        const wrappers = document.querySelectorAll('.woocommerce-product-gallery__wrapper');
        const images = document.querySelectorAll('.woocommerce-product-gallery__image');
        const imgs = document.querySelectorAll('.woocommerce-product-gallery__image img');
        
        console.log('Found galleries:', galleries.length);
        console.log('Found wrappers:', wrappers.length);
        console.log('Found image containers:', images.length);
        console.log('Found images:', imgs.length);
        
        // Force visibility on all elements (mobile only)
        galleries.forEach(function(gallery) {
            gallery.style.opacity = '1';
            gallery.style.display = 'block';
            gallery.style.visibility = 'visible';
            gallery.style.minHeight = '250px';
            gallery.style.backgroundColor = '#f9f9f9';
            gallery.style.border = '1px solid #ddd';
            gallery.style.borderRadius = '8px';
            gallery.style.padding = '10px';
            gallery.style.marginBottom = '20px';
            console.log('Gallery made visible with styling:', gallery);
        });
        
        wrappers.forEach(function(wrapper) {
            wrapper.style.display = 'block';
            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
            wrapper.style.minHeight = '250px';
            console.log('Wrapper made visible:', wrapper);
        });
        
        images.forEach(function(imageContainer) {
            imageContainer.style.display = 'block';
            imageContainer.style.visibility = 'visible';
            imageContainer.style.minHeight = '250px';
            imageContainer.style.width = '100%';
            
            // Add fallback background for CZ Shadow image
            if (imageContainer.getAttribute('data-thumb') && 
                imageContainer.getAttribute('data-thumb').includes('259bc57ecbcf1aedc64600e7fb3786ee')) {
                imageContainer.style.backgroundImage = 'url(images/259bc57ecbcf1aedc64600e7fb3786ee.jpg)';
                imageContainer.style.backgroundSize = 'contain';
                imageContainer.style.backgroundRepeat = 'no-repeat';
                imageContainer.style.backgroundPosition = 'center';
                imageContainer.style.backgroundColor = '#f9f9f9';
                imageContainer.style.border = '1px solid #ddd';
                imageContainer.style.borderRadius = '8px';
                console.log('Added CZ Shadow background fallback to container');
            }
            
            console.log('Image container made visible:', imageContainer);
        });
        
        imgs.forEach(function(img) {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.minHeight = '250px';
            img.style.maxWidth = '100%';
            img.style.objectFit = 'contain';
            
            // Special handling for CZ Shadow image
            if (img.src && img.src.includes('259bc57ecbcf1aedc64600e7fb3786ee')) {
                img.style.backgroundColor = '#f9f9f9';
                img.style.border = '1px solid #ddd';
                img.style.borderRadius = '8px';
                img.style.padding = '10px';
                img.style.boxSizing = 'border-box';
                console.log('Applied CZ Shadow specific styling');
            }
            
            console.log('Image made visible:', img);
            console.log('Image src:', img.src);
            console.log('Image complete:', img.complete);
            console.log('Image naturalWidth:', img.naturalWidth);
            console.log('Image naturalHeight:', img.naturalHeight);
            
            // Force image to reload on mobile if not loaded
            if (!img.complete || img.naturalWidth === 0) {
                console.warn('Image not loaded properly on mobile, forcing reload');
                const originalSrc = img.src;
                
                // Add loading event handlers
                img.onload = function() {
                    console.log('Mobile image loaded successfully:', this.src);
                    this.style.display = 'block';
                    this.style.visibility = 'visible';
                    this.style.opacity = '1';
                    this.style.minHeight = '250px';
                };
                
                img.onerror = function() {
                    console.error('Mobile image failed to load:', this.src);
                    console.log('Attempting fallback for failed image');
                    
                    // Create a fallback div with background image
                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.style.width = '100%';
                    fallbackDiv.style.height = '250px';
                    fallbackDiv.style.backgroundImage = 'url(images/259bc57ecbcf1aedc64600e7fb3786ee.jpg)';
                    fallbackDiv.style.backgroundSize = 'contain';
                    fallbackDiv.style.backgroundRepeat = 'no-repeat';
                    fallbackDiv.style.backgroundPosition = 'center';
                    fallbackDiv.style.backgroundColor = '#f9f9f9';
                    fallbackDiv.style.border = '1px solid #ddd';
                    fallbackDiv.style.borderRadius = '8px';
                    fallbackDiv.style.display = 'block';
                    fallbackDiv.style.visibility = 'visible';
                    
                    // Replace the failed image with the fallback
                    if (this.parentNode) {
                        this.parentNode.appendChild(fallbackDiv);
                        console.log('Added fallback div for failed image');
                    }
                };
                
                // Force reload with cache busting for mobile
                img.src = '';
                setTimeout(function() {
                    img.src = originalSrc + '?mobile=' + Date.now();
                }, 100);
            } else {
                console.log('Image already loaded on mobile');
            }
        });
        
        // Additional fallback: Create a visible element if no images are found
        if (imgs.length === 0 && images.length > 0) {
            console.log('No img tags found, creating fallback image element');
            images.forEach(function(container) {
                const fallbackImg = document.createElement('img');
                fallbackImg.src = 'images/259bc57ecbcf1aedc64600e7fb3786ee.jpg';
                fallbackImg.alt = 'CZ Shadow 2';
                fallbackImg.style.width = '100%';
                fallbackImg.style.height = 'auto';
                fallbackImg.style.minHeight = '250px';
                fallbackImg.style.objectFit = 'contain';
                fallbackImg.style.display = 'block';
                fallbackImg.style.visibility = 'visible';
                fallbackImg.style.opacity = '1';
                fallbackImg.style.backgroundColor = '#f9f9f9';
                fallbackImg.style.border = '1px solid #ddd';
                fallbackImg.style.borderRadius = '8px';
                fallbackImg.style.padding = '10px';
                fallbackImg.style.boxSizing = 'border-box';
                
                container.appendChild(fallbackImg);
                console.log('Added fallback image element');
            });
        }
        
        // Check for mobile fallback divs and make them visible
        const mobileFallbacks = document.querySelectorAll('.mobile-image-fallback');
        if (mobileFallbacks.length > 0) {
            console.log('Found mobile fallback divs, making them visible');
            mobileFallbacks.forEach(function(fallback) {
                fallback.style.display = 'block';
                fallback.style.visibility = 'visible';
                console.log('Mobile fallback made visible');
            });
        }
        
        // Ultimate fallback: If no images are working, check if we can see the image file
        setTimeout(function() {
            const testImg = new Image();
            testImg.onload = function() {
                console.log('CZ Shadow image file is accessible');
                // If image loads but still not showing, force it
                const containers = document.querySelectorAll('.woocommerce-product-gallery__image');
                containers.forEach(function(container) {
                    if (!container.querySelector('img:not([style*="display: none"])')) {
                        console.log('Forcing image display with innerHTML');
                        container.innerHTML = '<img src="images/259bc57ecbcf1aedc64600e7fb3786ee.jpg" alt="CZ Shadow 2" style="width: 100%; height: auto; min-height: 250px; object-fit: contain; display: block; visibility: visible; opacity: 1; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 10px; box-sizing: border-box;" />';
                    }
                });
            };
            testImg.onerror = function() {
                console.error('CZ Shadow image file not accessible - check path');
            };
            testImg.src = 'images/259bc57ecbcf1aedc64600e7fb3786ee.jpg';
        }, 2000);
    }
    
    // Run immediately
    forceGalleryVisible();
    
    // Run after a delay to catch any late-loading elements
    setTimeout(forceGalleryVisible, 500);
    setTimeout(forceGalleryVisible, 1000);
    setTimeout(forceGalleryVisible, 2000);
    
    // Run on window resize
    window.addEventListener('resize', forceGalleryVisible);
    
    // Watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && 
                        (node.classList.contains('woocommerce-product-gallery') ||
                         node.querySelector && node.querySelector('.woocommerce-product-gallery'))) {
                        console.log('Gallery added to DOM, making visible');
                        setTimeout(forceGalleryVisible, 100);
                    }
                });
            }
        });
    });
    
    const body = document.querySelector('body');
    if (body) {
        observer.observe(body, { childList: true, subtree: true });
    }
});