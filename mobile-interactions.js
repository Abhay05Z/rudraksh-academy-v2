// ===== MOBILE TOUCH & SCROLL INTERACTIONS =====
// Only activates on mobile devices, desktop remains unchanged

(function() {
    'use strict';
    
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    if (!isMobile) return; // Exit if not mobile - desktop remains unchanged
    
    console.log('Mobile interactions activated');
    
    // ===== 1. SCROLL-BASED PARALLAX FOR MOBILE =====
    let ticking = false;
    let lastScrollY = window.scrollY;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const scrollProgress = Math.min(scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
        
        // Hero section parallax
        const heroTitle = document.querySelector('.hero-title');
        const heroText = document.querySelector('.hero-text');
        const heroButtons = document.querySelector('.hero-buttons');
        
        if (heroTitle) {
            const offset = scrollY * 0.3;
            heroTitle.style.transform = `translateY(${offset}px)`;
        }
        
        if (heroText) {
            const offset = scrollY * 0.2;
            heroText.style.transform = `translateY(${offset}px)`;
        }
        
        if (heroButtons) {
            const offset = scrollY * 0.15;
            heroButtons.style.transform = `translateY(${offset}px)`;
        }
        
        // Info cards parallax
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const windowCenter = window.innerHeight / 2;
            const distance = (cardCenter - windowCenter) / window.innerHeight;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const translateY = distance * 20;
                card.style.transform = `translateY(${translateY}px)`;
            }
        });
        
        // Glass cards parallax
        const glassCards = document.querySelectorAll('.glass-card');
        glassCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const progress = (window.innerHeight - rect.top) / window.innerHeight;
                const translateY = (1 - progress) * 30;
                card.style.transform = `translateY(${translateY}px)`;
            }
        });
        
        ticking = false;
    }
    
    function requestParallaxUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    
    // ===== 2. TOUCH-BASED INTERACTIONS =====
    let touchStartX = 0;
    let touchStartY = 0;
    let currentTouchX = 0;
    let currentTouchY = 0;
    
    // Add touch listeners to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        heroSection.addEventListener('touchmove', (e) => {
            currentTouchX = e.touches[0].clientX;
            currentTouchY = e.touches[0].clientY;
            
            const deltaX = (currentTouchX - touchStartX) / window.innerWidth;
            const deltaY = (currentTouchY - touchStartY) / window.innerHeight;
            
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.transform = `translate(${deltaX * 20}px, ${deltaY * 20}px)`;
                heroTitle.style.transition = 'transform 0.1s ease-out';
            }
        }, { passive: true });
        
        heroSection.addEventListener('touchend', () => {
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.transform = 'translate(0, 0)';
                heroTitle.style.transition = 'transform 0.5s ease-out';
            }
        }, { passive: true });
    }
    
    // Touch interactions for cards
    const allCards = document.querySelectorAll('.info-card, .glass-card');
    allCards.forEach(card => {
        let cardTouchStartX = 0;
        let cardTouchStartY = 0;
        
        card.addEventListener('touchstart', (e) => {
            cardTouchStartX = e.touches[0].clientX;
            cardTouchStartY = e.touches[0].clientY;
            card.style.transition = 'transform 0.1s ease-out';
        }, { passive: true });
        
        card.addEventListener('touchmove', (e) => {
            const deltaX = (e.touches[0].clientX - cardTouchStartX) / 100;
            const deltaY = (e.touches[0].clientY - cardTouchStartY) / 100;
            
            card.style.transform = `translate(${deltaX * 5}px, ${deltaY * 5}px) scale(1.02)`;
        }, { passive: true });
        
        card.addEventListener('touchend', () => {
            card.style.transform = 'translate(0, 0) scale(1)';
            card.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        }, { passive: true });
    });
    
    // ===== 3. DEVICE ORIENTATION (GYRO) TILT EFFECT =====
    let gyroSupported = false;
    
    // Check if device orientation is supported
    if (window.DeviceOrientationEvent) {
        // Request permission for iOS 13+
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            // iOS 13+ requires user interaction
            document.addEventListener('click', function requestGyro() {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            gyroSupported = true;
                            enableGyro();
                        }
                    })
                    .catch(console.error);
                document.removeEventListener('click', requestGyro);
            }, { once: true });
        } else {
            // Non-iOS devices
            gyroSupported = true;
            enableGyro();
        }
    }
    
    function enableGyro() {
        window.addEventListener('deviceorientation', (e) => {
            const beta = e.beta || 0;   // -180 to 180 (front to back tilt)
            const gamma = e.gamma || 0; // -90 to 90 (left to right tilt)
            
            // Normalize values
            const tiltX = Math.max(-30, Math.min(30, gamma)) / 30; // -1 to 1
            const tiltY = Math.max(-30, Math.min(30, beta - 45)) / 30; // -1 to 1
            
            // Apply to hero section
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle && !heroTitle.classList.contains('touching')) {
                heroTitle.style.transform = `translate(${tiltX * 15}px, ${tiltY * 15}px)`;
            }
            
            // Apply subtle effect to 3D background
            const bg3d = document.getElementById('bg3d');
            if (bg3d) {
                bg3d.style.transform = `translate(${tiltX * 10}px, ${tiltY * 10}px)`;
            }
            
            // Apply to cards
            const cards = document.querySelectorAll('.info-card, .glass-card');
            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const multiplier = 0.5 + (index * 0.1);
                    card.style.transform = `translate(${tiltX * 8 * multiplier}px, ${tiltY * 8 * multiplier}px)`;
                }
            });
        }, { passive: true });
    }
    
    // ===== 4. SMOOTH SCROLL SNAP FOR SECTIONS =====
    const sections = document.querySelectorAll('section');
    let isScrolling;
    
    window.addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        
        isScrolling = setTimeout(() => {
            // Find closest section
            let closestSection = null;
            let closestDistance = Infinity;
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top);
                
                if (distance < closestDistance && distance < window.innerHeight / 2) {
                    closestDistance = distance;
                    closestSection = section;
                }
            });
            
            // Smooth scroll to closest section if close enough
            if (closestSection && closestDistance < 100) {
                closestSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
    }, { passive: true });
    
    // ===== 5. OPTIMIZE ANIMATIONS FOR MOBILE =====
    // Reduce animation complexity on mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            * {
                -webkit-transform: translateZ(0);
                transform: translateZ(0);
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
            }
            
            .hero-title, .hero-text, .hero-buttons,
            .info-card, .glass-card {
                will-change: transform;
            }
            
            #bg3d {
                will-change: transform;
            }
            
            /* Smooth transitions */
            .info-card, .glass-card {
                transition: transform 0.3s ease-out;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initial parallax update
    updateParallax();
    
    console.log('Mobile interactions initialized:', {
        parallax: true,
        touch: true,
        gyro: gyroSupported
    });
})();
