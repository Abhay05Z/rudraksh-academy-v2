// ===== ENHANCED MOBILE TOUCH & SCROLL INTERACTIONS =====
// Premium 3D immersive experience for mobile devices
// Desktop version remains completely unchanged

(function() {
    'use strict';
    
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (!isMobile) return; // Exit if not mobile - desktop remains unchanged
    
    // Wait for page to fully load before activating
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileInteractions);
    } else {
        initMobileInteractions();
    }
    
    function initMobileInteractions() {
    console.log('🎨 Enhanced Mobile Interactions Activated');
    
    // ===== GLOBAL STATE MANAGEMENT =====
    const state = {
        scroll: { y: 0, progress: 0 },
        touch: { x: 0, y: 0, deltaX: 0, deltaY: 0, active: false },
        gyro: { x: 0, y: 0, z: 0, active: false },
        combined: { x: 0, y: 0 }, // Combined effect from all sources
        ticking: false
    };
    
    // Configuration - Optimized for smooth performance
    const config = {
        scroll: {
            heroMultiplier: 0.5,
            cardMultiplier: 30,
            bgMultiplier: 0.2
        },
        touch: {
            sensitivity: 0.15,  // Increased for more noticeable effect
            smoothing: 0.15,
            maxOffset: 50       // Increased range
        },
        gyro: {
            sensitivity: 3.5,   // Further increased for very noticeable effect
            smoothing: 0.25,
            maxTilt: 40         // Increased detection range
        }
    };
    
    // Prevent GSAP conflicts - disable GSAP transforms on mobile
    if (typeof gsap !== 'undefined') {
        gsap.set('.hero-title, .hero-text, .hero-buttons, .page-header h1, .page-header p, .info-card, .glass-card, .course-card, .feature-card, #bg3d', {
            clearProps: 'transform'
        });
    }
    
    // ===== UNIFIED UPDATE FUNCTION =====
    // Combines scroll, touch, and gyro effects without conflicts
    function updateAllEffects() {
        if (state.ticking) return;
        state.ticking = true;
        
        requestAnimationFrame(() => {
            // Calculate combined offset from touch and gyro
            const touchX = state.touch.active ? state.touch.x : 0;
            const touchY = state.touch.active ? state.touch.y : 0;
            const gyroX = state.gyro.active ? state.gyro.x : 0;
            const gyroY = state.gyro.active ? state.gyro.y : 0;
            
            // Smooth interpolation for combined effect
            state.combined.x += (touchX + gyroX - state.combined.x) * 0.1;
            state.combined.y += (touchY + gyroY - state.combined.y) * 0.1;
            
            // ===== 1. BACKGROUND LAYER (3D Canvas) =====
            const bg3d = document.getElementById('bg3d');
            if (bg3d) {
                const bgX = state.combined.x * config.scroll.bgMultiplier;
                const bgY = state.combined.y * config.scroll.bgMultiplier + state.scroll.y * 0.05;
                bg3d.style.transform = `translate3d(${bgX}px, ${bgY}px, 0)`;
            }
            
            // ===== 2. HERO SECTION (All Pages) =====
            const heroTitle = document.querySelector('.hero-title, .page-header h1');
            const heroText = document.querySelector('.hero-text, .page-header p');
            const heroButtons = document.querySelector('.hero-buttons');
            
            if (heroTitle) {
                const scrollOffset = state.scroll.y * config.scroll.heroMultiplier;
                const tiltX = state.combined.x * 0.5;  // Increased from 0.3
                const tiltY = state.combined.y * 0.5;  // Increased from 0.3
                heroTitle.style.transform = `translate3d(${tiltX}px, ${scrollOffset + tiltY}px, 0)`;
                heroTitle.style.transition = 'none';
            }
            
            if (heroText) {
                const scrollOffset = state.scroll.y * (config.scroll.heroMultiplier * 0.7);
                const tiltX = state.combined.x * 0.35;  // Increased from 0.2
                const tiltY = state.combined.y * 0.35;  // Increased from 0.2
                heroText.style.transform = `translate3d(${tiltX}px, ${scrollOffset + tiltY}px, 0)`;
                heroText.style.transition = 'none';
            }
            
            if (heroButtons) {
                const scrollOffset = state.scroll.y * (config.scroll.heroMultiplier * 0.5);
                const tiltX = state.combined.x * 0.25;  // Increased from 0.15
                const tiltY = state.combined.y * 0.25;  // Increased from 0.15
                heroButtons.style.transform = `translate3d(${tiltX}px, ${scrollOffset + tiltY}px, 0)`;
                heroButtons.style.transition = 'none';
            }
            
            // ===== 3. CARDS & IMPORTANT ELEMENTS (All Pages) =====
            const allCards = document.querySelectorAll('.info-card, .glass-card, .course-card, .feature-card, .result-card, .teacher-card, .gallery-item');
            allCards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                
                // Only apply to visible cards
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    // Scroll-based parallax
                    const cardCenter = rect.top + rect.height / 2;
                    const windowCenter = window.innerHeight / 2;
                    const distance = (cardCenter - windowCenter) / window.innerHeight;
                    const scrollParallax = distance * config.scroll.cardMultiplier;
                    
                    // Touch/Gyro effect (layered depth) - INCREASED
                    const depthMultiplier = 0.5 + (index % 3) * 0.2;  // Increased from 0.3 and 0.15
                    const tiltX = state.combined.x * depthMultiplier;
                    const tiltY = state.combined.y * depthMultiplier;
                    
                    card.style.transform = `translate3d(${tiltX}px, ${scrollParallax + tiltY}px, 0)`;
                    card.style.transition = 'none';
                }
            });
            
            // ===== 4. SECTION HEADERS =====
            const sectionHeaders = document.querySelectorAll('.section-header, .section-title');
            sectionHeaders.forEach((header, index) => {
                const rect = header.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const tiltX = state.combined.x * 0.4;  // Increased from 0.25
                    const tiltY = state.combined.y * 0.4;  // Increased from 0.25
                    header.style.transform = `translate3d(${tiltX}px, ${tiltY}px, 0)`;
                    header.style.transition = 'none';
                }
            });
            
            // ===== 5. STATS & COUNTERS =====
            const stats = document.querySelectorAll('.stat-card, .stat-item');
            stats.forEach((stat, index) => {
                const rect = stat.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const depthMultiplier = 0.3 + (index % 4) * 0.15;  // Increased from 0.2 and 0.1
                    const tiltX = state.combined.x * depthMultiplier;
                    const tiltY = state.combined.y * depthMultiplier;
                    stat.style.transform = `translate3d(${tiltX}px, ${tiltY}px, 0)`;
                    stat.style.transition = 'none';
                }
            });
            
            state.ticking = false;
        });
    }
    
    // ===== SCROLL HANDLER =====
    function handleScroll() {
        state.scroll.y = window.scrollY;
        state.scroll.progress = Math.min(
            state.scroll.y / (document.documentElement.scrollHeight - window.innerHeight),
            1
        );
        updateAllEffects();
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // ===== TOUCH-BASED INTERACTIONS =====
    // Global touch tracking for background movement
    let touchStartX = 0;
    let touchStartY = 0;
    let touchActive = false;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchActive = true;
        state.touch.active = true;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (!touchActive) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        // Calculate delta with increased sensitivity
        const deltaX = (currentX - touchStartX) * config.touch.sensitivity;
        const deltaY = (currentY - touchStartY) * config.touch.sensitivity;
        
        // Clamp to max offset
        state.touch.x = Math.max(-config.touch.maxOffset, Math.min(config.touch.maxOffset, deltaX));
        state.touch.y = Math.max(-config.touch.maxOffset, Math.min(config.touch.maxOffset, deltaY));
        
        updateAllEffects();
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        touchActive = false;
        
        // Smooth return to center
        const returnToCenter = () => {
            state.touch.x *= 0.9;
            state.touch.y *= 0.9;
            
            if (Math.abs(state.touch.x) > 0.1 || Math.abs(state.touch.y) > 0.1) {
                updateAllEffects();
                requestAnimationFrame(returnToCenter);
            } else {
                state.touch.x = 0;
                state.touch.y = 0;
                state.touch.active = false;
                updateAllEffects();
            }
        };
        
        returnToCenter();
    }, { passive: true });
    
    // ===== DEVICE ORIENTATION (GYRO) TILT EFFECT =====
    // Enhanced sensitivity for more noticeable 3D effect
    let gyroSupported = false;
    let lastGyroUpdate = 0;
    const gyroThrottle = 16; // ~60fps
    
    function enableGyro() {
        window.addEventListener('deviceorientation', (e) => {
            const now = Date.now();
            if (now - lastGyroUpdate < gyroThrottle) return;
            lastGyroUpdate = now;
            
            const beta = e.beta || 0;   // -180 to 180 (front to back tilt)
            const gamma = e.gamma || 0; // -90 to 90 (left to right tilt)
            
            // Normalize with increased sensitivity
            const rawTiltX = Math.max(-config.gyro.maxTilt, Math.min(config.gyro.maxTilt, gamma)) / config.gyro.maxTilt;
            const rawTiltY = Math.max(-config.gyro.maxTilt, Math.min(config.gyro.maxTilt, beta - 45)) / config.gyro.maxTilt;
            
            // Apply sensitivity multiplier
            const targetX = rawTiltX * config.gyro.sensitivity * 20;
            const targetY = rawTiltY * config.gyro.sensitivity * 20;
            
            // Smooth interpolation
            state.gyro.x += (targetX - state.gyro.x) * config.gyro.smoothing;
            state.gyro.y += (targetY - state.gyro.y) * config.gyro.smoothing;
            state.gyro.active = true;
            
            updateAllEffects();
        }, { passive: true });
        
        console.log('📱 Gyro enabled with enhanced sensitivity');
    }
    
    // Check if device orientation is supported
    if (window.DeviceOrientationEvent) {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ requires user interaction
            const requestGyroPermission = () => {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            gyroSupported = true;
                            enableGyro();
                        }
                    })
                    .catch(console.error);
            };
            
            // Show subtle prompt
            const gyroPrompt = document.createElement('div');
            gyroPrompt.style.cssText = `
                position: fixed;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(59, 130, 246, 0.95);
                color: white;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 14px;
                z-index: 9999;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                animation: slideUp 0.3s ease;
                cursor: pointer;
            `;
            gyroPrompt.textContent = '📱 Tap to enable 3D tilt effect';
            gyroPrompt.onclick = () => {
                requestGyroPermission();
                gyroPrompt.remove();
            };
            
            setTimeout(() => {
                document.body.appendChild(gyroPrompt);
                setTimeout(() => gyroPrompt.remove(), 5000);
            }, 2000);
        } else {
            // Non-iOS devices
            gyroSupported = true;
            enableGyro();
        }
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    // Hardware acceleration and smooth rendering
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            /* Hardware acceleration for all interactive elements */
            #bg3d,
            .hero-title, .hero-text, .hero-buttons, .page-header h1, .page-header p,
            .info-card, .glass-card, .course-card, .feature-card, .result-card,
            .teacher-card, .gallery-item, .section-header, .section-title,
            .stat-card, .stat-item {
                -webkit-transform: translateZ(0) !important;
                transform: translateZ(0) !important;
                -webkit-backface-visibility: hidden !important;
                backface-visibility: hidden !important;
                will-change: transform !important;
            }
            
            /* NO transitions - prevent stuttering */
            .hero-title, .hero-text, .hero-buttons, .page-header h1, .page-header p,
            .info-card, .glass-card, .course-card, .feature-card, .result-card,
            .teacher-card, .gallery-item, .section-header, .section-title,
            .stat-card, .stat-item, #bg3d {
                transition: none !important;
            }
            
            /* Prevent text selection during touch */
            body.touching {
                -webkit-user-select: none;
                user-select: none;
            }
            
            /* Gyro prompt animation */
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }
            }
        }
    `;
    document.head.appendChild(style);
    
    // Prevent text selection during touch
    document.addEventListener('touchstart', () => {
        document.body.classList.add('touching');
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        setTimeout(() => {
            document.body.classList.remove('touching');
        }, 100);
    }, { passive: true });
    
    // ===== INITIAL UPDATE =====
    // Run initial update after page load and GSAP animations complete
    setTimeout(() => {
        updateAllEffects();
        console.log('✅ Initial mobile effects applied');
    }, 1500);  // Wait for GSAP to finish
    
    // ===== CONTINUOUS ANIMATION LOOP =====
    // Keep effects smooth - run constantly for immediate response
    function animationLoop() {
        // Always update if gyro or touch is active
        if (state.gyro.active || state.touch.active || state.scroll.y > 0) {
            updateAllEffects();
        }
        requestAnimationFrame(animationLoop);
    }
    
    // Start animation loop
    requestAnimationFrame(animationLoop);
    
    // ===== STATUS LOG =====
    console.log('✅ Enhanced Mobile Interactions Initialized:', {
        scroll: '✓ Parallax enabled',
        touch: '✓ Global tracking',
        gyro: gyroSupported ? '✓ Active' : '⏳ Pending permission',
        performance: '✓ Hardware accelerated',
        fps: '✓ 60fps optimized'
    });
    
    // Debug info (remove in production)
    if (window.location.search.includes('debug')) {
        const debugPanel = document.createElement('div');
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: #0f0;
            padding: 10px;
            font-family: monospace;
            font-size: 11px;
            z-index: 99999;
            border-radius: 5px;
        `;
        document.body.appendChild(debugPanel);
        
        setInterval(() => {
            debugPanel.innerHTML = `
                Scroll: ${state.scroll.y.toFixed(0)}px<br>
                Touch: ${state.touch.active ? 'ACTIVE' : 'idle'} (${state.touch.x.toFixed(1)}, ${state.touch.y.toFixed(1)})<br>
                Gyro: ${state.gyro.active ? 'ACTIVE' : 'idle'} (${state.gyro.x.toFixed(1)}, ${state.gyro.y.toFixed(1)})<br>
                Combined: (${state.combined.x.toFixed(1)}, ${state.combined.y.toFixed(1)})
            `;
        }, 100);
    }
    
    } // End initMobileInteractions
})();
