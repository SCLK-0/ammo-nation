// Team Section - Pure CSS Mobile Scrolling (Minimal JS)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Team section script loaded');
    
    const wrapper = document.querySelector('.team_cards_wrapper');
    
    if (!wrapper) {
        console.log('Team section wrapper not found');
        return;
    }
    
    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (isMobile) {
        // For mobile: Let CSS handle everything, minimal JS
        console.log('Mobile detected - using pure CSS scrolling');
        
        // Only add scroll indicators, no touch handling
        addScrollIndicators();
        
        // Remove any existing event listeners that might interfere
        wrapper.style.pointerEvents = 'auto';
        wrapper.style.touchAction = 'pan-x';
        
    } else {
        // Desktop drag scrolling only (wheel scrolling disabled)
        console.log('Desktop detected - setting up drag scrolling only');
        setupDesktopScrolling();
        // setupWheelScrolling(); // Disabled - was interfering with normal page scrolling
    }
    
    function setupDesktopScrolling() {
        console.log('Setting up smooth desktop drag scrolling');
        
        let startX = 0;
        let scrollLeft = 0;
        let isDown = false;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let animationId = null;
        
        wrapper.style.cursor = 'grab';
        wrapper.style.scrollBehavior = 'auto'; // Ensure smooth scrolling
        
        // Smooth momentum scrolling after drag ends
        function momentumScroll() {
            if (Math.abs(velocity) > 0.5) {
                wrapper.scrollLeft += velocity;
                velocity *= 0.95; // Friction
                animationId = requestAnimationFrame(momentumScroll);
            } else {
                velocity = 0;
                animationId = null;
            }
        }
        
        wrapper.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isDown = true;
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeft = wrapper.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            velocity = 0;
            
            // Cancel any ongoing momentum
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            
            wrapper.style.cursor = 'grabbing';
            wrapper.style.userSelect = 'none';
        });
        
        wrapper.addEventListener('mouseleave', function() {
            if (isDown) {
                isDown = false;
                wrapper.style.cursor = 'grab';
                wrapper.style.userSelect = '';
                
                // Start momentum scrolling
                if (Math.abs(velocity) > 1) {
                    momentumScroll();
                }
            }
        });
        
        wrapper.addEventListener('mouseup', function() {
            if (isDown) {
                isDown = false;
                wrapper.style.cursor = 'grab';
                wrapper.style.userSelect = '';
                
                // Start momentum scrolling
                if (Math.abs(velocity) > 1) {
                    momentumScroll();
                }
            }
        });
        
        wrapper.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            
            const currentTime = Date.now();
            const currentX = e.pageX;
            
            // Calculate velocity for momentum
            const deltaTime = currentTime - lastTime;
            const deltaX = currentX - lastX;
            
            if (deltaTime > 0) {
                velocity = (deltaX / deltaTime) * -16; // Convert to pixels per frame (60fps)
            }
            
            // Smooth scrolling with requestAnimationFrame
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.2; // Reduced multiplier for smoother feel
            
            requestAnimationFrame(() => {
                wrapper.scrollLeft = scrollLeft - walk;
            });
            
            lastX = currentX;
            lastTime = currentTime;
        });
        
        // Prevent context menu on right click during drag
        wrapper.addEventListener('contextmenu', function(e) {
            if (isDown) {
                e.preventDefault();
            }
        });
    }
    
    // function setupWheelScrolling() {
    //     // DISABLED: This function was interfering with normal page scrolling
    //     // Users found it annoying when trying to scroll down the page normally
    //     console.log('Wheel scrolling disabled to prevent interference with page scrolling');
    // }
    
    function addScrollIndicators() {
        // Mobile swipe indicator
        const container = wrapper.parentElement;
        
        if (!container.querySelector('.mobile-swipe-indicator')) {
            // Create swipe indicator container
            const swipeIndicator = document.createElement('div');
            swipeIndicator.className = 'mobile-swipe-indicator';
            swipeIndicator.innerHTML = `
                <div class="swipe-text">
                    <span class="swipe-message">Swipe to see other members</span>
                </div>
            `;
            swipeIndicator.style.cssText = `
                text-align: center;
                margin-top: 15px;
                margin-bottom: 10px;
                padding: 8px 16px;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 20px;
                display: inline-block;
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                animation: swipePulse 2s ease-in-out infinite;
            `;
            
            // Style the swipe text content
            const swipeText = swipeIndicator.querySelector('.swipe-text');
            swipeText.style.cssText = `
                color: rgba(255, 255, 255, 0.9);
                font-size: 0.85em;
                font-weight: 400;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            container.appendChild(swipeIndicator);
            
            // Add CSS animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes swipePulse {
                    0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
                    50% { opacity: 1; transform: translateX(-50%) scale(1.02); }
                }
            `;
            document.head.appendChild(style);
            
            // Keep indicator visible - no auto-hide behavior
        }
    }
    
    console.log('Team section ready - pure CSS mobile scrolling enabled');
});