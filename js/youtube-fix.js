/**
 * YouTube Thumbnail Solution
 * Converts YouTube iframes to clickable thumbnails to avoid error 153
 */
(function() {
    'use strict';
    
    // Function to extract YouTube video ID from various URL formats
    function extractYouTubeId(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : false;
    }
    
    // Function to create YouTube thumbnail
    function createYouTubeThumbnail(videoId, title, width, height) {
        title = title || 'Watch on YouTube';
        
        var container = document.createElement('div');
        container.className = 'youtube-thumbnail-container';
        
        var link = document.createElement('a');
        link.href = 'https://www.youtube.com/watch?v=' + videoId;
        link.target = '_blank';
        link.className = 'youtube-thumbnail-link';
        link.title = title;
        
        var thumbnail = document.createElement('div');
        thumbnail.className = 'youtube-thumbnail';
        
        var img = document.createElement('img');
        img.src = 'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';
        img.alt = title;
        img.className = 'thumbnail-image';
        
        var overlay = document.createElement('div');
        overlay.className = 'play-button-overlay';
        
        var playButton = document.createElement('div');
        playButton.className = 'play-button';
        playButton.innerHTML = '<svg width="68" height="48" viewBox="0 0 68 48">' +
            '<path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>' +
            '<path d="M 45,24 27,14 27,34" fill="#fff"></path>' +
            '</svg>';
        
        overlay.appendChild(playButton);
        thumbnail.appendChild(img);
        thumbnail.appendChild(overlay);
        link.appendChild(thumbnail);
        container.appendChild(link);
        
        return container;
    }
    
    // Function to convert YouTube iframes to thumbnails
    function convertYouTubeIframes() {
        var iframes = document.querySelectorAll('iframe[src*="youtube"]');
        
        iframes.forEach(function(iframe) {
            var src = iframe.src;
            var videoId = extractYouTubeId(src);
            
            if (videoId) {
                var title = iframe.title || iframe.getAttribute('alt') || 'Watch on YouTube';
                var width = iframe.width || iframe.offsetWidth;
                var height = iframe.height || iframe.offsetHeight;
                
                var thumbnail = createYouTubeThumbnail(videoId, title, width, height);
                
                // Replace iframe with thumbnail
                iframe.parentNode.replaceChild(thumbnail, iframe);
            }
        });
    }
    
    // Convert existing iframes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', convertYouTubeIframes);
    } else {
        convertYouTubeIframes();
    }
    
    // Monitor for dynamically added iframes
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node is an iframe
                        if (node.tagName === 'IFRAME' && node.src && node.src.includes('youtube')) {
                            var videoId = extractYouTubeId(node.src);
                            if (videoId) {
                                var title = node.title || node.getAttribute('alt') || 'Watch on YouTube';
                                var thumbnail = createYouTubeThumbnail(videoId, title);
                                node.parentNode.replaceChild(thumbnail, node);
                            }
                        }
                        
                        // Check for iframes within the added node
                        var iframes = node.querySelectorAll && node.querySelectorAll('iframe[src*="youtube"]');
                        if (iframes) {
                            iframes.forEach(function(iframe) {
                                var videoId = extractYouTubeId(iframe.src);
                                if (videoId) {
                                    var title = iframe.title || iframe.getAttribute('alt') || 'Watch on YouTube';
                                    var thumbnail = createYouTubeThumbnail(videoId, title);
                                    iframe.parentNode.replaceChild(thumbnail, iframe);
                                }
                            });
                        }
                    }
                });
            }
        });
    });
    
    // Start observing
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
})();