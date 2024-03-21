// Define a function to handle mouse position
const useMousePosition = () => {
    const mousePosition = { x: 0, y: 0 };

    const updateMousePosition = (event) => {
        mousePosition.x = event.clientX;
        mousePosition.y = event.clientY;
    };

    document.addEventListener("mousemove", updateMousePosition);

    return mousePosition;
};

// Define the Particle class
class Particle {
    constructor(canvasSize, staticity, ease) {
        this.canvasSize = canvasSize;
        this.staticity = staticity;
        this.ease = ease;
        this.init();
    }

    init() {
        this.x = Math.floor(Math.random() * this.canvasSize.w);
        this.y = Math.floor(Math.random() * this.canvasSize.h);
        this.translateX = 0;
        this.translateY = 0;
        this.size = Math.floor(Math.random() * 2) + 0.1;
        this.alpha = 0;
        this.targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        this.dx = (Math.random() - 0.5) * 0.2;
        this.dy = (Math.random() - 0.5) * 0.2;
        this.magnetism = 0.1 + Math.random() * 4;
    }

    update(mouse) {
        // Handle the alpha value
        const edge = [
            this.x + this.translateX - this.size, // distance from left edge
            this.canvasSize.w - this.x - this.translateX - this.size, // distance from right edge
            this.y + this.translateY - this.size, // distance from top edge
            this.canvasSize.h - this.y - this.translateY - this.size, // distance from bottom edge
        ];
        const closestEdge = Math.min(...edge);
        const remapClosestEdge = parseFloat(
            this.remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
        );
        if (remapClosestEdge > 1) {
            this.alpha += 0.02;
            if (this.alpha > this.targetAlpha) {
                this.alpha = this.targetAlpha;
            }
        } else {
            this.alpha = this.targetAlpha * remapClosestEdge;
        }
        this.x += this.dx;
        this.y += this.dy;
        this.translateX +=
            (mouse.x / (this.staticity / this.magnetism) - this.translateX) / this.ease;
        this.translateY +=
            (mouse.y / (this.staticity / this.magnetism) - this.translateY) / this.ease;

        return (
            this.x < -this.size ||
            this.x > this.canvasSize.w + this.size ||
            this.y < -this.size ||
            this.y > this.canvasSize.h + this.size
        );
    }

    remapValue(value, start1, end1, start2, end2) {
        const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    }
}

// Main Particle system function
function Particles({
    quantity = 30,
    staticity = 50,
    ease = 50,
    refresh = false,
}) {
    const canvasRef = document.createElement('canvas');
    const context = canvasRef.getContext('2d');
    const mousePosition = useMousePosition();
    const mouse = { x: 0, y: 0 };
    const canvasSize = { w: 0, h: 0 };
    const dpr = window.devicePixelRatio || 1;
    const particles = [];

    // Initialization function
    const initCanvas = () => {
        resizeCanvas();
        drawParticles();
        animate();
        document.body.appendChild(canvasRef); // Append canvas to the body
        window.addEventListener("resize", initCanvas);
    };

    // Resize Canvas function
    const resizeCanvas = () => {
        canvasSize.w = window.innerWidth; // Set canvas width to window width
        canvasSize.h = window.innerHeight; // Set canvas height to window height
        canvasRef.width = canvasSize.w * dpr;
        canvasRef.height = canvasSize.h * dpr;
        canvasRef.style.width = `${canvasSize.w}px`;
        canvasRef.style.height = `${canvasSize.h}px`;
        context.scale(dpr, dpr);
    };

    // Draw Circle function
    const drawCircle = (circle) => {
        const { x, y, size, alpha } = circle;
        context.beginPath();
        context.arc(x, y, size * 1.5, 0, 2 * Math.PI); // Increased size by 1.5 times
        context.fillStyle = `rgba(255, 255, 255, ${alpha * 2})`; // Increased alpha by 2 times
        context.fill();
    };

    // Clear Canvas function
    const clearCanvas = () => {
        context.clearRect(0, 0, canvasSize.w, canvasSize.h);
    };

    // Draw Particles function
    const drawParticles = () => {
        clearCanvas();
        for (let i = 0; i < quantity; i++) {
            particles[i] = new Particle(canvasSize, staticity, ease);
            drawCircle(particles[i]);
        }
    };

    // Animation Loop
    const animate = () => {
        clearCanvas();
        particles.forEach((particle, i) => {
            const isOutsideCanvas = particle.update(mouse);
            if (isOutsideCanvas) {
                particles[i] = new Particle(canvasSize, staticity, ease);
            }
            drawCircle(particle);
        });
        requestAnimationFrame(animate);
    };

    // Mouse Move event handler
    const onMouseMove = () => {
        const x = mousePosition.x;
        const y = mousePosition.y;
        mouse.x = x;
        mouse.y = y;
    };

    // Event Listeners
    document.addEventListener("mousemove", onMouseMove);

    // Initial Setup
    initCanvas();
}

// Usage
Particles({
    quantity: 30,
    staticity: 50,
    ease: 50,
    refresh: false,
});
