gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => `assets/images/herosection/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.webp`;

const images = [];
const animationState = { frame: 0 };
let loadedCount = 0;
const loadingScreen = document.getElementById("loading-screen");
const loadingCounter = document.getElementById("loading-counter");
const loadingBar = document.getElementById("loading-bar");

if (loadingScreen) document.body.style.overflow = 'hidden';

// Preload images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    const handleLoad = () => {
        loadedCount++;
        const percent = Math.floor((loadedCount / frameCount) * 100);
        
        if (loadingCounter) loadingCounter.innerText = `${percent}%`;
        if (loadingBar) loadingBar.style.width = `${percent}%`;

        if (loadedCount === frameCount) {
            // All images loaded
            if (loadingScreen) {
                gsap.to(loadingScreen, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        loadingScreen.style.display = "none";
                        document.body.style.overflow = '';
                        initScrollAnimations();
                    }
                });
            } else {
                initScrollAnimations();
            }
            render();
        }
    };
    img.onload = handleLoad;
    img.onerror = handleLoad;
    img.src = currentFrame(i);
    images.push(img);
}

let currentWidth = window.innerWidth;

function resizeCanvas() {
    // Prevent resizing constantly on mobile when address bar hides/shows
    const dpr = window.devicePixelRatio || 1;
    
    // Set physical internal canvas size for crisp rendering
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    render();
}

window.addEventListener("resize", () => {
    // Only trigger full resize if width changes (ignores mobile vertical scroll jump)
    if (Math.abs(window.innerWidth - currentWidth) > 50) {
        currentWidth = window.innerWidth;
        resizeCanvas();
    }
});
resizeCanvas();

function render() {
    const frameIndex = Math.floor(animationState.frame);
    let img = images[frameIndex];

    // Fallback if current frame isn't fully loaded yet
    if (!img || !img.complete || img.naturalWidth === 0) {
        for (let i = frameIndex - 1; i >= 0; i--) {
            if (images[i] && images[i].complete && images[i].naturalWidth !== 0) {
                img = images[i];
                break;
            }
        }
    }

    if (img && img.complete && img.naturalWidth !== 0) {
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // "Contain" logic on mobile to prevent cropping and improve clarity
            if (canvasRatio > imgRatio) {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                // Move to the top instead of centering
                offsetY = 0;
            }
        } else {
            // "Cover" logic on desktop to fill screen
            if (canvasRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
}

function initScrollAnimations() {
    // Master Timeline for Hero Sequence
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#hero-sequence",
            start: "top top",
            end: "+=400%", // 400vh total scroll distance
            scrub: 0.5, // Smooth scrubbing
            pin: true,
        }
    });

// Animate frame sequence over the entire timeline duration
tl.to(animationState, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    onUpdate: render,
    duration: 100 // Using percentage as a conceptual scale
}, 0);

// Animate Feature 1 (0% to 30%)
tl.fromTo("#feature-1", 
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, 
    0 // starts at 0%
)
.to("#feature-1", 
    { opacity: 0, y: -50, duration: 10, ease: "power2.in" }, 
    20 // starts fading out at 20%
);

// Animate Feature 2 (35% to 65%)
tl.fromTo("#feature-2", 
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, 
    35 // starts at 35%
)
.to("#feature-2", 
    { opacity: 0, y: -50, duration: 10, ease: "power2.in" }, 
    55 // starts fading out at 55%
);

// Animate Feature 3 (70% to 100%)
tl.fromTo("#feature-3", 
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 10, ease: "power2.out" }, 
    70 // starts at 70%
)
.to("#feature-3", 
    { opacity: 0, y: -50, duration: 10, ease: "power2.in" }, 
    90 // starts fading out at 90%
);

    // Global Fade-Up Animations for other sections
    gsap.utils.toArray('.gsap-fade-up').forEach((elem) => {
        gsap.fromTo(elem, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: elem,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Custom Magnetic Cursor Logic
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        let cursorX = gsap.quickTo(cursor, "left", {duration: 0.2, ease: "power3"});
        let cursorY = gsap.quickTo(cursor, "top", {duration: 0.2, ease: "power3"});
        
        window.addEventListener("mousemove", e => {
            cursorX(e.clientX);
            cursorY(e.clientY);
        });

        // Magnetic hover effects
        const interactiveElements = document.querySelectorAll('a, button, .group, .cursor-pointer');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 3, opacity: 0.5, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
            });
        });
    }
    // Split Text Typography Animation
    const splitTextElements = document.querySelectorAll('.gsap-split-text');
    splitTextElements.forEach(elem => {
        // Simple word splitter
        const text = elem.innerText;
        const words = text.split(' ');
        elem.innerHTML = '';
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.innerText = word + ' ';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.opacity = '0';
            wordSpan.style.transform = 'translateY(20px)';
            elem.appendChild(wordSpan);
        });

        // Animate the words
        gsap.to(elem.children, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    let isMenuOpen = false;

    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                // Open menu
                mobileMenuIcon.classList.remove('ph-list');
                mobileMenuIcon.classList.add('ph-x');
                mobileMenuOverlay.classList.remove('hidden');
                mobileMenuOverlay.classList.add('flex');
                document.body.style.overflow = 'hidden'; // lock scrolling

                gsap.fromTo(mobileMenuOverlay, 
                    { opacity: 0 }, 
                    { opacity: 1, duration: 0.3, ease: "power2.out" }
                );

                gsap.fromTo(mobileNavLinks, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power3.out", delay: 0.1 }
                );
            } else {
                // Close menu
                mobileMenuIcon.classList.remove('ph-x');
                mobileMenuIcon.classList.add('ph-list');
                document.body.style.overflow = ''; // unlock scrolling
                
                gsap.to(mobileMenuOverlay, {
                    opacity: 0, 
                    duration: 0.3, 
                    ease: "power2.in",
                    onComplete: () => {
                        mobileMenuOverlay.classList.add('hidden');
                        mobileMenuOverlay.classList.remove('flex');
                    }
                });
            }
        });

        // Close menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.click();
            });
        });
    }
}
