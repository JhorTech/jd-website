// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form Validation and Submission
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Basic form validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (!isValid) {
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            form.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for your message!</h3>
                    <p>We'll get back to you shortly.</p>
                </div>
            `;
        } catch (error) {
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'An error occurred. Please try again.';
            form.insertBefore(errorMessage, submitButton);
            
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
});

// Add loading animation to images
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.classList.add('loading');
    img.addEventListener('load', function() {
        this.classList.remove('loading');
        this.classList.add('loaded');
    });
});

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Form validation and submission
    const forms = document.querySelectorAll('form[data-netlify]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(form);
                const response = await fetch('/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Show success message
                    form.innerHTML = `
                        <div class="form-success">
                            <i class="fas fa-check-circle"></i>
                            <h3>Thank you for your message!</h3>
                            <p>We'll get back to you as soon as possible.</p>
                        </div>
                    `;
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                // Show error message
                const errorDiv = document.createElement('div');
                errorDiv.className = 'form-error';
                errorDiv.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Sorry, there was an error submitting your form. Please try again.</p>
                `;
                form.insertBefore(errorDiv, form.firstChild);
                
                // Reset button
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(input);
            });
            
            input.addEventListener('input', function() {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
    });
});

// Input validation function
function validateInput(input) {
    const value = input.value.trim();
    const errorDiv = input.parentElement.querySelector('.error-message') || 
                    document.createElement('div');
    
    if (!errorDiv.classList.contains('error-message')) {
        errorDiv.className = 'error-message';
        input.parentElement.appendChild(errorDiv);
    }
    
    let isValid = true;
    let errorMessage = '';
    
    if (input.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (!isValid) {
        input.classList.add('error');
        errorDiv.textContent = errorMessage;
    } else {
        input.classList.remove('error');
        errorDiv.textContent = '';
    }
    
    return isValid;
} 