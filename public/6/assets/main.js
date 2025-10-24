(function () {
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

                document.body.style.cursor = 'none';
                const cursor = document.querySelector('.cursor');
                const cursorFollower = document.querySelector('.cursor-follower');

                if (!cursor || !cursorFollower) return;

                cursor.style.display = 'block';
                cursorFollower.style.display = 'block';

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
                        cursorFollower.style.borderColor = rgba(30, 86, 160, 0.3);
                    });
                });
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
                const contactButton = document.getElementById('header-contact-link');
                const logoBadge = document.getElementById('header-logo-badge');

                if (!header) return;

                let lastScrollY = 0;
                let ticking = false;

                function updateHeader() {
                    const scrollY = window.pageYOffset;

                    if (scrollY > 50) {
                        header.style.background = 'rgba(255, 255, 255, 0.98)';
                        header.style.backdropFilter = 'blur(10px)';
                        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';

                        // Change contact button color to dark
                        if (contactButton) {
                            contactButton.style.color = getColor('dark');
                        }
                        // Change logo badge to dark background and light text
                        if (logoBadge) {
                            logoBadge.style.backgroundColor = getColor('dark');
                            logoBadge.style.color = getColor('primary-light');
                        }

                    } else {
                        header.style.background = 'transparent';
                        header.style.backdropFilter = 'blur(0)';
                        header.style.boxShadow = 'none';

                        // Reset contact button color
                        if (contactButton) {
                            contactButton.style.color = getColor('primary');
                        }
                        // Reset logo badge colors
                        if (logoBadge) {
                            logoBadge.style.backgroundColor = getColor('primary');
                            logoBadge.style.color = getColor('dark');
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

                    const later = function () {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };

                    const callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);

                    if (callNow) func.apply(context, args);
                };
            }

            // Error handling for external resources
            function handleResourceErrors() {
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

            function initFeatherIcons() {
                if (typeof feather !== 'undefined') {
                    feather.replace();
                }
            }

            // Initialize everything when DOM is ready
            function init() {
                initScrollReveal();
                initSmoothScrolling();
                initHeaderEffects();
                initFocusManagement();
                initAccessibility();
                initMarqueeControls();
                initFeatherIcons();

                // Enhanced features (only if not reduced motion)
                if (!prefersReducedMotion) {
                    initCustomCursor();
                }
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

            // Handle resize events
            const debouncedResize = debounce(() => {
                // Reinitialize cursor on resize
                if (window.innerWidth > 768 && !prefersReducedMotion) {
                    initCustomCursor();
                }
            }, 250);

            window.addEventListener('resize', debouncedResize, { passive: true });
        })();