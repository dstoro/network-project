// ========================================
// Intersection Observer for scroll animations
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe cards, concept sections, and other animated elements
    const animatedElements = document.querySelectorAll(
        '.card, .stack-item, .concept-section, .about-card, .flow-step, .security-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

    // Add visible class styles
    const style = document.createElement('style');
    style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    // Stagger animation for grid items
    document.querySelectorAll('.cards-grid, .stack-grid').forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, i) => {
            item.style.transitionDelay = `${i * 0.1}s`;
        });
    });

    // Nav active state based on scroll (networking page)
    const sections = document.querySelectorAll('.concept-section');
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY + 200;
            sections.forEach(section => {
                if (section.offsetTop <= scrollPos && 
                    section.offsetTop + section.offsetHeight > scrollPos) {
                    section.classList.add('active-section');
                } else {
                    section.classList.remove('active-section');
                }
            });
        });
    }
});
