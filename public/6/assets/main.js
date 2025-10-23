// Modern Creative JavaScript for Ted Pietka Profile
(function() {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get CSS variables for consistent theming
    const getColor = (colorName) => {
        return getComputedStyle(document.documentElement).getPropertyValue(`--color-${colorName}`).trim();
    };

    // Custom cursor functionality
    function initCustomCursor() {
        if (window.innerWidth <= 768 || prefersReducedMotion) return;

        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');
        
        if (!cursor || !cursorFollower) return;

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let followerX = 0;
        let followerY = 0;

        // Update mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Animate cursors
        function animateCursor() {
            // Cursor follows mouse directly
            cursorX += (mouseX - cursorX) * 0.9;
            cursorY += (mouseY - cursorY) * 0.9;
            
            // Follower has more lag
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
            cursorFollower.style.transform = `translate(${followerX - 16}px, ${followerY - 16}px)`;

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Cursor interactions
        const interactiveElements = document.querySelectorAll('a, button, .value-card, .contact-card, .achievement-item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(1.5)';
                cursorFollower.style.transform += ' scale(1.5)';
                cursorFollower.style.borderColor = getColor('accent');
            });

            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
                cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
                cursorFollower.style.borderColor = getColor('accent-light');
            });
        });
    }

    // Initialize Feather Icons
    function initFeatherIcons() {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    // Intersection Observer for scroll reveals
    function initScrollReveal() {
        if (prefersReducedMotion) return;

        const revealElements = document.querySelectorAll('.reveal, .section-content, .value-card, .contact-card, .timeline-item');
        
        if (!revealElements.length) return;

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        revealElements.forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    // Parallax effects for floating elements
    function initParallaxEffects() {
        if (prefersReducedMotion) return;

        const heroImage = document.querySelector('.hero-image');
        
        let ticking = false;

        function updateParallax() {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Hero image subtle parallax
            if (heroImage) {
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    const heroRect = heroSection.getBoundingClientRect();
                    if (heroRect.bottom > 0) {
                        const parallaxOffset = scrollY * 0.1;
                        heroImage.style.transform = `translateY(${parallaxOffset}px)`;
                    }
                }
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const header = document.querySelector('header[role="banner"]');
                    const headerHeight = header ? header.offsetHeight : 60;
                    const targetPosition = targetElement.offsetTop - headerHeight - 40;

                    if (prefersReducedMotion) {
                        window.scrollTo(0, targetPosition);
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Header scroll effects
    function initHeaderEffects() {
        const header = document.querySelector('header[role="banner"]');
        const headerIcon = document.querySelector('.header-icon');
        if (!header) return;

        let lastScrollY = 0;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.pageYOffset;

            if (scrollY > 50) {
                header.style.background = getColor('white-alpha');
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = `0 1px 3px ${getColor('black-alpha')}`;

                // Change icon color to dark when header is white
                if (headerIcon) {
                    headerIcon.style.color = getColor('dark');
                }
            } else {
                header.style.background = 'transparent';
                header.style.backdropFilter = 'blur(0)';
                header.style.boxShadow = 'none';

                // Reset icon color to primary when header is transparent
                if (headerIcon) {
                    headerIcon.style.color = getColor('primary');
                }
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Timeline animation
    function initTimelineAnimation() {
        if (prefersReducedMotion) return;

        const timelineTrack = document.querySelector('.timeline-track');
        if (!timelineTrack) return;

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    timelineTrack.style.setProperty('--progress', '100%');
                }
            });
        }, {
            threshold: 0.3
        });

        timelineObserver.observe(timelineTrack);
    }

    // Marquee pause on hover
    function initMarqueeControls() {
        const partnersTrack = document.getElementById('partnersTrack');
        if (!partnersTrack) return;

        partnersTrack.addEventListener('mouseenter', () => {
            partnersTrack.style.animationPlayState = 'paused';
        });

        partnersTrack.addEventListener('mouseleave', () => {
            partnersTrack.style.animationPlayState = 'running';
        });
    }

    // Enhanced focus management
    function initFocusManagement() {
        let hadKeyboardEvent = true;
        const keyboardKeys = [
            'Tab', 'Enter', ' ', 'Escape', 'ArrowUp', 'ArrowDown', 
            'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'
        ];

        function pointerEvent() {
            hadKeyboardEvent = false;
        }

        function keyboardEvent(e) {
            if (keyboardKeys.includes(e.key)) {
                hadKeyboardEvent = true;
            }
        }

        document.addEventListener('keydown', keyboardEvent, true);
        document.addEventListener('mousedown', pointerEvent, true);
        document.addEventListener('pointerdown', pointerEvent, true);
        document.addEventListener('touchstart', pointerEvent, true);

        document.addEventListener('focusin', (e) => {
            if (hadKeyboardEvent) {
                e.target.classList.add('focus-visible');
            }
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });
    }

    // Performance optimization: Debounce function
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(context, args);
        };
    }

    // Lazy loading for images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }

    // Error handling for external resources
    function handleResourceErrors() {
        if (typeof feather === 'undefined') {
            console.warn('Feather Icons not loaded. Icons may not display correctly.');
        }

        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn('Image failed to load:', e.target.src);
                e.target.style.opacity = '0.5';
                e.target.alt = 'Image unavailable';
            }
        }, true);
    }

    // Accessibility enhancements
    function initAccessibility() {
        // Add keyboard navigation for interactive elements
        const interactiveElements = document.querySelectorAll('.value-card, .contact-card, .achievement-item');
        
        interactiveElements.forEach(element => {
            const hasLinks = element.querySelector('a');
            if (hasLinks && !element.hasAttribute('tabindex')) {
                element.setAttribute('tabindex', '0');
            }

            // Add keyboard interaction
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const link = element.querySelector('a');
                    if (link) {
                        e.preventDefault();
                        link.click();
                    }
                }
            });
        });

        // Enhance button accessibility
        const buttons = document.querySelectorAll('button, .contact-button');
        buttons.forEach(button => {
            if (!button.hasAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Interactive element');
            }
        });

    }

    // Initialize everything when DOM is ready
    function init() {
        // Core functionality
        initFeatherIcons();
        initScrollReveal();
        initSmoothScrolling();
        initHeaderEffects();
        initFocusManagement();
        initAccessibility();
        initMarqueeControls();
        
        // Enhanced features (only if not reduced motion)
        if (!prefersReducedMotion) {
            initCustomCursor();
            initParallaxEffects();
            initTimelineAnimation();
        }
        
        // Performance and error handling
        initLazyLoading();
        handleResourceErrors();

        // Mark page as loaded
        document.body.classList.add('loaded');
    }

    // Wait for DOM and external resources
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-initialize Feather icons when they load
    window.addEventListener('load', () => {
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });

    // Handle resize events
    const debouncedResize = debounce(() => {
        // Reinitialize cursor on resize
        if (window.innerWidth > 768 && !prefersReducedMotion) {
            initCustomCursor();
        }
    }, 250);

    window.addEventListener('resize', debouncedResize, { passive: true });

    // WhatsApp direct link functionality
    function initWhatsAppLink() {
        const whatsappCard = document.getElementById('whatsappCard');

        if (!whatsappCard) return;

        // WhatsApp number (replace with actual number)
        const whatsappNumber = '971501234567'; // UAE format
        const whatsappMessage = 'Hello Ted, I would like to connect with you.';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        // Open WhatsApp directly when clicking the entire card
        whatsappCard.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(whatsappUrl, '_blank');
        });

        // Add keyboard accessibility
        whatsappCard.setAttribute('tabindex', '0');
        whatsappCard.setAttribute('role', 'link');
        whatsappCard.setAttribute('aria-label', 'Connect on WhatsApp');

        whatsappCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(whatsappUrl, '_blank');
            }
        });
    }

    // Initialize WhatsApp link
    initWhatsAppLink();

    // Timeline View More functionality
    function initTimelineViewMore() {
        const viewMoreBtn = document.getElementById('viewMoreBtn');
        const viewMoreText = document.getElementById('viewMoreText');
        const viewMoreIcon = document.getElementById('viewMoreIcon');
        const timelineItems = document.querySelectorAll('.timeline-item');

        if (!viewMoreBtn || timelineItems.length === 0) return;

        let isExpanded = false;

        viewMoreBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;

            timelineItems.forEach((item, index) => {
                if (isExpanded) {
                    // Show items with slide down animation
                    item.style.maxHeight = '0';
                    item.style.opacity = '0';
                    item.style.overflow = 'hidden';
                    item.style.transition = 'max-height 0.5s ease, opacity 0.5s ease, margin 0.5s ease';
                    item.classList.remove('hidden');

                    // Trigger reflow
                    void item.offsetHeight;

                    // Animate in with stagger
                    setTimeout(() => {
                        item.style.maxHeight = '500px';
                        item.style.opacity = '1';
                    }, index * 100);
                } else {
                    // Hide items with slide up animation
                    item.style.maxHeight = '0';
                    item.style.opacity = '0';
                    item.style.marginBottom = '0';

                    setTimeout(() => {
                        item.classList.add('hidden');
                        item.style.maxHeight = '';
                        item.style.opacity = '';
                        item.style.overflow = '';
                        item.style.marginBottom = '';
                    }, 500);
                }
            });

            // Update button text and icon
            viewMoreText.textContent = isExpanded ? 'View Less' : 'View More';
            viewMoreIcon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';

            // Re-initialize feather icons for the chevron
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    }

    // Initialize timeline view more
    initTimelineViewMore();
})();

// Add additional CSS for enhanced interactions
const additionalCSS = `
    .loaded .hero-title .title-line {
        animation-play-state: running;
    }

    .focus-visible {
        outline: 2px solid var(--color-accent) !important;
        outline-offset: 4px !important;
        border-radius: 4px;
    }

    img.lazy {
        opacity: 0;
        transition: opacity 0.6s ease;
    }

    img.lazy.loaded {
        opacity: 1;
    }

    .timeline-track::before {
        height: var(--progress, 0);
        transition: height 2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (prefers-reduced-motion: reduce) {
        .hero-image {
            transform: none !important;
        }

        .marquee-track {
            animation: none !important;
        }

        .cursor,
        .cursor-follower {
            display: none !important;
        }
    }

    @media (max-width: 768px) {
        .cursor,
        .cursor-follower {
            display: none !important;
        }
    }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);