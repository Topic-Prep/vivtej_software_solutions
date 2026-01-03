document.addEventListener('DOMContentLoaded', () => {
    const processSection = document.querySelector('.process-section');
    const progressBar = document.querySelector('.line-progress');

    if (processSection && progressBar) {
        window.addEventListener('scroll', () => {
            const sectionTop = processSection.offsetTop;
            const sectionHeight = processSection.offsetHeight;
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Calculate how far we've scrolled into the section
            // Start filling when section top hits middle of viewport? 
            // Or when section enters viewport? Standard is entering.

            // Let's make it start filling as soon as the section top reaches the center of the viewport
            // and finish when the bottom reaches the center.

            const startPoint = sectionTop - windowHeight * 0.5;
            const endPoint = sectionTop + sectionHeight - windowHeight * 0.5;

            const scrollTop = window.scrollY;

            let progress = 0;

            if (scrollTop > startPoint) {
                progress = (scrollTop - startPoint) / (endPoint - startPoint);
            }

            // Clamp between 0 and 1
            progress = Math.max(0, Math.min(1, progress));

            progressBar.style.height = `${progress * 100}%`;
        });
    }

    // --- Cursor Glow Effect ---
    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    let mouseX = 0;
    let mouseY = 0;

    // Smooth follow variables
    let currentX = 0;
    let currentY = 0;
    const speed = 0.1; // Lower is smoother/slower

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        // Interpolate position
        currentX += (mouseX - currentX) * speed;
        currentY += (mouseY - currentY) * speed;

        // Centering the 600px glow
        glow.style.left = `${currentX - 300}px`;
        glow.style.top = `${currentY - 300}px`;

        requestAnimationFrame(animateGlow);
    }

    animateGlow();

    // --- Typewriter Effect for "Our Story" ---
    const typewriterBlocks = document.querySelectorAll('.typewriter-block');

    if (typewriterBlocks.length > 0) {
        const typeWriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTypewriterSequence(typewriterBlocks);
                    typeWriterObserver.disconnect(); // Run once
                }
            });
        }, { threshold: 0.5 });

        // Observe the first block's parent/container or the first block itself
        const container = document.querySelector('.typewriter-container');
        if (container) {
            typeWriterObserver.observe(container);
        }

        async function startTypewriterSequence(blocks) {
            for (const block of blocks) {
                await typeText(block);
            }
        }

        function typeText(element) {
            return new Promise(resolve => {
                const text = element.textContent;
                element.textContent = ''; // Clear text
                element.style.opacity = '1'; // Make visible
                element.classList.add('typewriter-cursor'); // Add cursor

                let i = 0;
                const speed = 30; // ms per char

                function typeChar() {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeChar, speed);
                    } else {
                        element.classList.remove('typewriter-cursor'); // Remove cursor when done
                        resolve();
                    }
                }

                typeChar();
            });
        }
    }

    // --- Hamburger Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navActions = document.querySelector('.nav-actions');

    if (hamburger && navActions) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navActions.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navActions.classList.remove('active');
            });
        });
    }
});
