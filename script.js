// =============================================
// PARTICLE BACKGROUND
// =============================================
const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = 60;
    const CONNECTION_DIST = 150;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 1.5 + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x += dx * 0.01;
                    this.y += dy * 0.01;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// =============================================
// SCROLL ANIMATIONS
// =============================================
const scrollObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.scroll-anim').forEach(el => scrollObserver.observe(el));

// =============================================
// COUNTER ANIMATION
// =============================================
document.querySelectorAll('.counter').forEach(el => {
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            const target = parseInt(el.dataset.target);
            let current = 0;
            const step = () => {
                current++;
                el.textContent = current;
                if (current < target) requestAnimationFrame(step);
            };
            step();
            observer.unobserve(el);
        }
    });
    observer.observe(el);
});

// =============================================
// HERO TERMINAL TYPING (Real data)
// =============================================
const heroTerminal = document.getElementById('heroTerminal');
if (heroTerminal) {
    const lines = [
        { type: 'cmd', text: '$ nslookup network-project-self.vercel.app' },
        { type: 'out', text: 'Server:  2600:6c5a:557f:9314::1' },
        { type: 'out', text: 'Address: 2600:6c5a:557f:9314::1#53' },
        { type: 'out', text: '' },
        { type: 'out', text: 'Non-authoritative answer:' },
        { type: 'hi', text: 'Name:    network-project-self.vercel.app' },
        { type: 'hi', text: 'Address: 216.198.79.67' },
        { type: 'hi', text: 'Address: 64.29.17.67' },
        { type: 'blank', text: '' },
        { type: 'cmd', text: '$ curl -I https://network-project-self.vercel.app' },
        { type: 'hi', text: 'HTTP/2 200' },
        { type: 'out', text: 'content-type: text/html; charset=utf-8' },
        { type: 'out', text: 'server: Vercel' },
        { type: 'hi', text: 'strict-transport-security: max-age=63072000' },
        { type: 'out', text: 'x-vercel-cache: HIT' },
        { type: 'cursor', text: '' },
    ];

    let lineIndex = 0;

    function addLine() {
        if (lineIndex >= lines.length) return;

        const line = lines[lineIndex];
        const div = document.createElement('div');
        div.className = 't-line';

        if (line.type === 'cmd') {
            div.innerHTML = `<span class="t-ps">$</span> <span class="t-typed">${line.text.slice(2)}</span>`;
            div.style.opacity = '0';
            div.style.animation = 'fadeUp 0.3s ease forwards';
        } else if (line.type === 'hi') {
            div.classList.add('out', 'hi');
            div.textContent = line.text;
            div.style.opacity = '0';
            div.style.transform = 'translateY(4px)';
            div.style.animation = 'fadeUp 0.3s ease forwards';
        } else if (line.type === 'out') {
            div.classList.add('out');
            div.textContent = line.text || '\u00A0';
            div.style.opacity = '0';
            div.style.animation = 'fadeUp 0.3s ease forwards';
        } else if (line.type === 'cursor') {
            div.innerHTML = '<span class="t-ps">$</span> <span class="t-cursor"></span>';
            div.style.opacity = '0';
            div.style.animation = 'fadeUp 0.3s ease forwards';
        } else {
            div.innerHTML = '&nbsp;';
        }

        heroTerminal.appendChild(div);
        heroTerminal.scrollTop = heroTerminal.scrollHeight;

        lineIndex++;
        const delay = line.type === 'cmd' ? 1200 : line.type === 'blank' ? 600 : 200;
        setTimeout(addLine, delay);
    }

    setTimeout(addLine, 1500);
}

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
