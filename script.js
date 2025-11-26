// --- Utility Functions ---

// Custom Alert Box (Used instead of native alert())
function alertUser(message) {
    const alertEl = document.getElementById('custom-alert');
    const alertMsgEl = document.getElementById('alert-message');
    alertMsgEl.textContent = message;
    alertEl.classList.remove('opacity-0', 'hidden');
    alertEl.classList.add('opacity-100');
    
    setTimeout(() => {
        alertEl.classList.remove('opacity-100');
        alertEl.classList.add('opacity-0');
        setTimeout(() => {
            alertEl.classList.add('hidden');
        }, 300); 
    }, 3000);
}

// --- Intersection Observer for Animations (General Scroll Effects) ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            // Stop observing once animation is triggered
            
            if (entry.target.classList.contains('animated-detail-card')) {
                // Also animate the title bar
                const titleBar = entry.target.querySelector('.card-title-bar');
                if (titleBar) {
                     titleBar.style.width = '100%';
                }
            }
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.animated-detail-card, .milestone-marker').forEach(el => {
    observer.observe(el);
});


// --- Hero Canvas Animation (Particle Web) ---
let canvas;
let ctx;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

function initCanvas() {
    canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    
    // Calculate number of particles based on screen size
    let numberOfParticles = (canvas.width * canvas.height) / 9000;
    if (window.innerWidth < 768) numberOfParticles /= 2; // Fewer particles on mobile
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2; // Slower movement
        let directionY = (Math.random() * 0.4) - 0.2; // Slower movement
        let color = 'rgba(255, 255, 255, 0.8)';
        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function Particle(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
}

Particle.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
}

Particle.prototype.update = function() {
    if (this.x + this.size > canvas.width || this.x - this.size < 0) {
        this.directionX = -this.directionX;
    }
    if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.directionY = -this.directionY;
    }

    this.x += this.directionX;
    this.y += this.directionY;
    
    this.draw();
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x)) 
                         + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            
            if (distance < (100 * 100)) {
                opacityValue = 1 - (distance / 10000);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connect();
}

// --- Radar Chart Initialization (Skills Section) ---
function initializeSkillsChart() {
    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;
    
    // Values are normalized from 0-100
    const data = {
        labels: [
            'Legal Research',
            'Document Drafting',
            'Client Management',
            'Creative Direction',
            'Project Leadership',
            'Compliance Oversight'
        ],
        datasets: [{
            label: 'Competency Level',
            data: [95, 95, 95, 95, 95, 95], // All skills are rated equally highly for impact
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // White transparent fill
            borderColor: 'rgba(255, 255, 255, 1)', // White line
            pointBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointBorderColor: '#000',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#fff',
            borderWidth: 2,
            fill: true
        }]
    };

    const config = {
        type: 'radar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(255, 255, 255, 0.4)'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    pointLabels: {
                        font: {
                            size: 14,
                            weight: '500'
                        },
                        color: '#FFFFFF'
                    },
                    suggestedMin: 0,
                    suggestedMax: 100,
                    ticks: {
                        display: false,
                        maxTicksLimit: 5,
                        color: 'rgba(255, 255, 255, 0.6)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.label}: ${context.raw}%`
                    }
                }
            }
        },
    };

    new Chart(ctx, config);
}


// --- Initialization on Load ---
window.onload = function() {
    initCanvas();
    // Start the animation only if the canvas context was successfully initialized
    if (ctx) {
        animate();
    }
    initializeSkillsChart();
};

window.addEventListener('resize', initCanvas);