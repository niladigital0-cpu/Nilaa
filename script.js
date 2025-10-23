document.addEventListener('DOMContentLoaded', () => {
    
    // --- HAMBURGER MENU LOGIC ---
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.getElementById('siteNav');
    const navLinks = document.querySelectorAll('#siteNav a');

    if (menuToggle && siteNav) {
        // Event listener for the hamburger button click
        menuToggle.addEventListener('click', () => {
            // Toggle 'is-active' class on the button (changes icon to 'X')
            menuToggle.classList.toggle('is-active');
            // Toggle 'is-open' class on the nav (slides the menu into view)
            siteNav.classList.toggle('is-open');
            
            // Block/unblock body scroll to prevent scrolling behind the open menu
            if (siteNav.classList.contains('is-open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close the menu when a link is clicked (for internal navigation)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Remove active classes
                menuToggle.classList.remove('is-active');
                siteNav.classList.remove('is-open');
                // Restore body scroll
                document.body.style.overflow = '';
            });
        });
    }
    // --- END MENU LOGIC ---

    // FAQ Accordion Logic
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // If the clicked item was not active, open it
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Slider Logic for Why Section
    const sliderTrack = document.getElementById('sliderTrack');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (sliderTrack) {
        // Function to calculate a single card's total width (width + gap)
        function getCardWidth() {
            // Check the second child (index 1) because the first is a clone
            const card = sliderTrack.children[1]; 
            // Return width + 15px gap, default to 195 if children are missing
            return card ? card.offsetWidth + 15 : 195;
        }

        let currentPosition = 0;
        let isTransitioning = false;

        // Clone the first and last cards for infinite loop effect
        const firstCard = sliderTrack.children[0].cloneNode(true);
        const lastCard = sliderTrack.children[sliderTrack.children.length - 1].cloneNode(true);

        // Append the first card clone to the end
        sliderTrack.appendChild(firstCard);
        // Prepend the last card clone to the beginning
        sliderTrack.insertBefore(lastCard, sliderTrack.children[0]);

        // Initialize position to the first real card (skipping the prepended clone)
        const initialWidth = getCardWidth();
        currentPosition = -initialWidth;
        sliderTrack.scrollLeft = -currentPosition;

        // Function to handle the sliding movement
        function slideTo(position, instant = false) {
            if (isTransitioning) return;
            isTransitioning = true;

            const dynamicCardWidth = getCardWidth();

            // Use smooth scrolling for button clicks, or 'auto' for instant jump
            if (!instant) {
                sliderTrack.style.scrollBehavior = 'smooth';
            } else {
                sliderTrack.style.scrollBehavior = 'auto';
            }

            currentPosition = position;
            sliderTrack.scrollLeft = -currentPosition;

            // Wait for the smooth transition to finish (300ms)
            setTimeout(() => {
                isTransitioning = false;

                // Check if we passed the end (landed on the clone of the first card)
                if (currentPosition <= -((sliderTrack.children.length - 1) * dynamicCardWidth)) {
                    // Instantly jump to the actual first card (skipping the clone)
                    currentPosition = -dynamicCardWidth;
                    sliderTrack.style.scrollBehavior = 'auto';
                    sliderTrack.scrollLeft = -currentPosition;
                // Check if we passed the beginning (landed on the clone of the last card)
                } else if (currentPosition >= 0) {
                    // Instantly jump to the actual last card
                    currentPosition = -((sliderTrack.children.length - 2) * dynamicCardWidth);
                    sliderTrack.style.scrollBehavior = 'auto';
                    sliderTrack.scrollLeft = -currentPosition;
                }
            }, 300);
        }

        // Event listener for the Previous button
        prevBtn.addEventListener('click', () => {
            slideTo(currentPosition + getCardWidth());
        });

        // Event listener for the Next button
        nextBtn.addEventListener('click', () => {
            slideTo(currentPosition - getCardWidth());
        });
    }

    // Smooth Scroll Logic for internal links (starting with #)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Get the target element based on the href attribute
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Scroll to the target element smoothly
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});