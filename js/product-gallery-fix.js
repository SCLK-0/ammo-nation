// Product Gallery Visibility Fix
document.addEventListener('DOMContentLoaded', function() {
    console.log('Product gallery fix loaded');
    
    function forceGalleryVisible() {
        // Only apply fixes on mobile devices
        if (window.innerWidth > 768) {
            console.log('Desktop detected - skipping mobile fixes');
            return;
        }
        
        console.log('Mobile detected - forcing gallery visibility');
        
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
            console.log('Gallery made visible:', gallery);
        });
        
        wrappers.forEach(function(wrapper) {
            wrapper.style.display = 'block';
            wrapper.style.visibility = 'visible';
            console.log('Wrapper made visible:', wrapper);
        });
        
        images.forEach(function(imageContainer) {
            imageContainer.style.display = 'block';
            imageContainer.style.visibility = 'visible';
            console.log('Image container made visible:', imageContainer);
        });
        
        imgs.forEach(function(img) {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.maxWidth = '100%';
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
                };
                
                img.onerror = function() {
                    console.error('Mobile image failed to load:', this.src);
                    // Try reloading with cache busting
                    if (!this.src.includes('?mobile=')) {
                        this.src = originalSrc + '?mobile=' + Date.now();
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