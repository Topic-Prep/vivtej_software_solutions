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
                const speed = 10; // ms per char (faster)

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

    // --- Quote Modal Injection & Logic ---
    const modalHTML = `
        <div class="modal-overlay" id="quoteModalOverlay">
            <div class="quote-modal">
                <button class="close-modal">&times;</button>
                <div class="modal-body">
                    <h2>Get a Quote</h2>
                    <form id="quoteForm">
                        <div class="quote-form-grid">
                            <div class="form-group">
                                <label for="name">Name <span style="color:red">*</span></label>
                                <input type="text" id="name" name="name" required placeholder="Your Name">
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number <span style="color:red">*</span></label>
                                <input type="tel" id="phone" name="phone" required placeholder="Your Phone Number">
                            </div>
                            <div class="form-group">
                                <label for="company">Company Name</label>
                                <input type="text" id="company" name="company" placeholder="Your Company (Optional)">
                            </div>
                            <div class="form-group">
                                <label for="category">Company Category</label>
                                <select id="category" name="category">
                                    <option value="" disabled selected>Select a category (Optional)</option>
                                    <option value="technology">Technology</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="education">Education</option>
                                    <option value="finance">Finance</option>
                                    <option value="retail">Retail & E-commerce</option>
                                    <option value="real-estate">Real Estate</option>
                                    <option value="manufacturing">Manufacturing</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="service-type">Service Type</label>
                                <select id="service-type" name="service-type">
                                    <option value="" disabled selected>Select a service (Optional)</option>
                                    <option value="mobile-app">Mobile App</option>
                                    <option value="website">Website</option>
                                    <option value="web-app">Web App</option>
                                    <option value="ui-ux">UI/UX Design</option>
                                    <option value="strategy">Strategy & Consulting</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <button type="submit" class="btn-submit">Submit Request</button>
                        </div>
                    </form>
                    <div class="success-message" id="successMessage">
                        <h3>Thank You!</h3>
                        <p>We've received your request. We will contact you shortly with a tailored quote.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalOverlay = document.getElementById('quoteModalOverlay');
    const closeBtn = modalOverlay.querySelector('.close-modal');
    const quoteForm = document.getElementById('quoteForm');
    const successMsg = document.getElementById('successMessage');

    // Open Modal Function
    window.openQuoteModal = function () {
        modalOverlay.classList.add('active');
        quoteForm.style.display = 'block';
        successMsg.style.display = 'none';
        quoteForm.reset();
    };

    // Close functionality
    function closeQuoteModal() {
        modalOverlay.classList.remove('active');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuoteModal);
    }

    // Close on click outside
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeQuoteModal();
            }
        });
    }

    // Form Submission
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = quoteForm.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData.entries());
            const scriptURL = 'https://script.google.com/macros/s/AKfycbySpWdgSMFWHr2_zr5U3sA_akW-iMG0DJ4Gad8XxzgXiUUI-Q35386sctycSjzOQw/exec';

            fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify(data),
                mode: 'no-cors', // Important for Google Apps Script to avoid CORS errors
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    quoteForm.style.display = 'none';
                    successMsg.style.display = 'block';
                    quoteForm.reset();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Something went wrong. Please try again later.');
                })
                .finally(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Event Delegation for "Get a quote" buttons
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.btn');
        if ((target && target.textContent.trim().toLowerCase() === 'get a quote') || e.target.closest('.open-quote-modal')) {
            e.preventDefault();
            window.openQuoteModal();
        }
    });

    // --- App Screenshot Carousel Logic ---
    const scroller = document.querySelector('.screenshot-scroller');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (scroller && prevBtn && nextBtn) {
        // Scroll amount equal to card width + gap approx
        const scrollAmount = 300;

        nextBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

});
