// Enhanced fade in/out on scroll animation
// Elements fade in when entering viewport and fade out when leaving

(function() {
    'use strict';
    
    // Configuration
    const threshold = 0.15; // Trigger when 15% of element is visible
    const rootMargin = '0px'; // No margin
    
    // Track observed elements to avoid duplicate observations
    const observedElements = new WeakSet();
    
    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is entering viewport - fade in
                entry.target.classList.add('fade-in');
                entry.target.classList.remove('fade-out');
            } else {
                // Element is leaving viewport - fade out
                entry.target.classList.remove('fade-in');
                entry.target.classList.add('fade-out');
            }
        });
    }, {
        threshold: threshold,
        rootMargin: rootMargin
    });
    
    // Function to observe an element
    function observeElement(element) {
        if (!observedElements.has(element)) {
            observer.observe(element);
            observedElements.add(element);
        }
    }
    
    // Initialize when DOM is ready
    function init() {
        // Observe all elements with fade-element class
        const fadeElements = document.querySelectorAll('.fade-element');
        fadeElements.forEach(element => {
            // Ensure initial state
            element.classList.remove('fade-in', 'fade-out');
            observeElement(element);
        });
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Also observe dynamically added elements (for skills filtering)
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.classList && node.classList.contains('fade-element')) {
                        observeElement(node);
                    }
                    // Also check child elements
                    const childFadeElements = node.querySelectorAll && node.querySelectorAll('.fade-element');
                    if (childFadeElements) {
                        childFadeElements.forEach(element => {
                            observeElement(element);
                        });
                    }
                }
            });
        });
    });
    
    // Start observing the document body for changes
    if (document.body) {
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();
