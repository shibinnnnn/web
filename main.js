gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");

const frameCount = 240;
const currentFrame = index => `assets/images/herosection/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.png`;

const images = [];
const animationState = { frame: 0 };

// Preload images
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// Ensure the first frame is rendered as soon as it loads
images[0].onload = render;

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

        // Use "Contain" logic on mobile to prevent extreme cropping
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Fit the entire image width onto the mobile screen (cinematic look with dark bars)
            if (canvasRatio > imgRatio) {
                drawHeight = canvas.height;
                drawWidth = canvas.height * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }
        } else {
            // Use "Cover" logic on desktop to fill the entire screen
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
