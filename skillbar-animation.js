// Skill Bar Animation Script
// Animates skill bars when they come into view on scroll or when filtered

(function() {
    'use strict';
    
    const animatedBars = new Set(); // Track which bars have been animated
    
    function initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar > div');
        
        skillBars.forEach(bar => {
            // Read the width value from the HTML attribute
            // The HTML has: <div style="width: 95%"></div>
            const styleAttr = bar.getAttribute('style') || '';
            
            // Extract width value from style attribute (e.g., "width: 95%" -> "95%")
            let widthValue = '0%';
            const widthMatch = styleAttr.match(/width:\s*(\d+(?:\.\d+)?%)/i);
            if (widthMatch) {
                widthValue = widthMatch[1];
            }
            
            // Store target width in data attribute
            bar.setAttribute('data-target-width', widthValue);
            
            // Remove inline style to prevent flash of full-width bars
            // We'll set width via JS when animating
            bar.removeAttribute('style');
            
            // Ensure bar starts at 0 width (CSS default)
            bar.style.width = '0%';
        });
    }
    
    function animateSkillBar(barElement, forceReset = false) {
        if (!barElement) {
            return;
        }
        
        // If forcing reset, remove from animated set and reset width
        if (forceReset) {
            animatedBars.delete(barElement);
            barElement.style.width = '0%';
            barElement.style.transition = 'none'; // Temporarily disable transition for instant reset
            void barElement.offsetWidth; // Force reflow
            barElement.style.transition = ''; // Restore transition
        }
        
        // Skip if already animated (unless forced)
        if (animatedBars.has(barElement) && !forceReset) {
            return;
        }
        
        const targetWidth = barElement.getAttribute('data-target-width') || '0%';
        
        // Ensure we start from 0
        if (forceReset || !animatedBars.has(barElement)) {
            barElement.style.width = '0%';
        }
        
        // Force browser to apply the 0 width before animating
        void barElement.offsetWidth;
        
        // Animate to target width - minimal delay for fluid animation
        requestAnimationFrame(() => {
            barElement.style.width = targetWidth;
            animatedBars.add(barElement);
        });
    }
    
    function animateVisibleBars() {
        // Collect all visible skill bars
        const visibleBars = [];
        document.querySelectorAll('.skill-card').forEach(card => {
            // Check if card is visible (not display: none)
            const cardStyle = window.getComputedStyle(card);
            if (cardStyle.display !== 'none' && cardStyle.visibility !== 'hidden') {
                card.querySelectorAll('.skill-bar > div').forEach(bar => {
                    if (!animatedBars.has(bar)) {
                        visibleBars.push(bar);
                    }
                });
            }
        });
        
        // Animate all bars almost simultaneously for fluid effect
        visibleBars.forEach((bar, index) => {
            setTimeout(() => {
                animateSkillBar(bar);
            }, index * 15); // Minimal stagger (15ms) for subtle cascading effect
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeSkillBars();
            setupIntersectionObserver();
            setupFilterWatcher();
            // Animate bars that are initially visible
            setTimeout(animateVisibleBars, 300);
        });
    } else {
        initializeSkillBars();
        setupIntersectionObserver();
        setupFilterWatcher();
        setTimeout(animateVisibleBars, 300);
    }
    
    // Setup IntersectionObserver for scroll-triggered animation
    function setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the bar container is visible
        };
        
        const observer = new IntersectionObserver((entries) => {
            // Filter to only bars that need animation
            const barsToAnimate = entries
                .filter(entry => entry.isIntersecting)
                .map(entry => entry.target.querySelector('div'))
                .filter(bar => bar && !animatedBars.has(bar));
            
            // Animate bars with minimal stagger for fluid effect
            barsToAnimate.forEach((bar, index) => {
                setTimeout(() => {
                    animateSkillBar(bar);
                }, index * 10); // Minimal stagger (10ms) for fluid animation
            });
        }, observerOptions);
        
        // Observe all skill bars
        document.querySelectorAll('.skill-bar').forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // Watch for filter changes
    function setupFilterWatcher() {
        // Override filterSkills function if it exists
        if (typeof window.filterSkills === 'function') {
            const originalFilterSkills = window.filterSkills;
            window.filterSkills = function(category) {
                // STEP 1: Reset ALL skill bars to 0% with transitions disabled
                // Keep transitions disabled until we're ready to animate
                const allBars = document.querySelectorAll('.skill-card .skill-bar > div');
                allBars.forEach(bar => {
                    animatedBars.delete(bar);
                    bar.style.transition = 'none'; // Keep disabled
                    bar.style.width = '0%';
                });
                
                // Force synchronous reflow
                void document.body.offsetWidth;
                
                // STEP 2: Call original filter function to show/hide cards
                originalFilterSkills(category);
                
                // STEP 3: After cards are shown, animate the visible bars
                // Wait for filtering.js delay (50ms) plus buffer to ensure DOM is updated
                setTimeout(() => {
                    const barsToAnimate = [];
                    
                    // Find visible cards and collect their bars
                    document.querySelectorAll('.skill-card').forEach(card => {
                        const cardStyle = window.getComputedStyle(card);
                        if (cardStyle.display !== 'none' && cardStyle.visibility !== 'hidden') {
                            card.querySelectorAll('.skill-bar > div').forEach(bar => {
                                // Double-check bar is at 0% and ensure transition is still disabled
                                bar.style.transition = 'none';
                                bar.style.width = '0%';
                                void bar.offsetWidth; // Force reflow
                                barsToAnimate.push(bar);
                            });
                        }
                    });
                    
                    // Animate bars with minimal stagger for fluid effect
                    barsToAnimate.forEach((bar, index) => {
                        setTimeout(() => {
                            const targetWidth = bar.getAttribute('data-target-width') || '0%';
                            // Ensure we're still at 0
                            bar.style.width = '0%';
                            void bar.offsetWidth;
                            // NOW enable transition and animate
                            bar.style.transition = ''; // Restore CSS transition
                            requestAnimationFrame(() => {
                                bar.style.width = targetWidth;
                                animatedBars.add(bar);
                            });
                        }, index * 8); // Minimal stagger (8ms) for fluid animation
                    });
                }, 120); // Wait for filter (50ms) + extra buffer for DOM updates
            };
        }
    }
})();
