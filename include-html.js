// Function to include HTML components
document.addEventListener('DOMContentLoaded', function() {
    // Include HTML components
    includeHTML();
    
    // After components are loaded, initialize other scripts
    setTimeout(() => {
        initializeScripts();
    }, 100);
});

function includeHTML() {
    const includes = document.getElementsByTagName('include');
    
    Array.from(includes).forEach(include => {
        const file = include.getAttribute('src');
        
        if (file) {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        include.insertAdjacentHTML('afterend', this.responseText);
                    }
                    if (this.status == 404) {
                        include.insertAdjacentHTML('afterend', 'Component not found.');
                    }
                    // Remove the include tag
                    include.remove();
                }
            }
            xhttp.open('GET', file, true);
            xhttp.send();
        }
    });
}

function initializeScripts() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-item a').forEach(item => {
        item.addEventListener('click', () => {
            if (mobileMenuBtn && navMenu) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Form submission handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Netlify handles form submission
            // This is just for additional functionality
            
            // Get form values for potential client-side validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Form validation can be added here if needed
        });
    }

    // Scroll animation
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop - windowHeight / 1.5 && 
                scrollPosition < sectionTop + sectionHeight) {
                section.classList.add('animate');
            }
        });
    });
    
    // Trigger scroll once to animate elements in view on page load
    window.dispatchEvent(new Event('scroll'));
}
