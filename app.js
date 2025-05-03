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
                    // Add loading class
                    img.classList.add('loading');
                    
                    // Create a new image to preload
                    const tempImage = new Image();
                    tempImage.src = img.src;
                    
                    tempImage.onload = function() {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    };
                    
                    tempImage.onerror = function() {
                        console.error('Failed to load image:', img.src);
                        img.classList.remove('loading');
                        // Optionally set a fallback image
                        // img.src = 'images/placeholder.jpg';
                    };
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.classList.add('loading');
            const tempImage = new Image();
            tempImage.src = img.src;
            
            tempImage.onload = function() {
                img.classList.remove('loading');
                img.classList.add('loaded');
            };
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
const forms = document.querySelectorAll('form:not(#search-form)');
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

// Loading State Management
class LoadingState {
    constructor() {
        this.skeletons = {
            caseStudies: document.querySelector('.case-studies-grid'),
            testimonials: document.querySelector('.testimonials-grid'),
            blogPosts: document.querySelector('.blog-grid')
        };
        
        this.init();
    }

    init() {
        // Show skeletons while content loads
        this.showSkeletons();
        
        // Simulate content loading (replace with actual content loading)
        setTimeout(() => {
            this.hideSkeletons();
        }, 1500);
    }

    showSkeletons() {
        Object.entries(this.skeletons).forEach(([key, element]) => {
            if (element) {
                const skeleton = this.createSkeleton(key);
                element.style.display = 'none';
                element.parentNode.insertBefore(skeleton, element);
            }
        });
    }

    hideSkeletons() {
        Object.entries(this.skeletons).forEach(([key, element]) => {
            if (element) {
                const skeleton = document.querySelector(`.${key}-skeleton`);
                if (skeleton) {
                    skeleton.remove();
                }
                element.style.display = '';
            }
        });
    }

    createSkeleton(type) {
        const skeleton = document.createElement('div');
        skeleton.className = `${type}-skeleton`;

        switch (type) {
            case 'caseStudies':
                skeleton.innerHTML = this.createCaseStudySkeleton();
                break;
            case 'testimonials':
                skeleton.innerHTML = this.createTestimonialSkeleton();
                break;
            case 'blogPosts':
                skeleton.innerHTML = this.createBlogSkeleton();
                break;
        }

        return skeleton;
    }

    createCaseStudySkeleton() {
        return `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
        `;
    }

    createTestimonialSkeleton() {
        return `
            <div class="skeleton-card">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
        `;
    }

    createBlogSkeleton() {
        return `
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-avatar"></div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-avatar"></div>
            </div>
            <div class="skeleton-card">
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-avatar"></div>
            </div>
        `;
    }
}

// Form Error Handling
class FormErrorHandler {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.setupValidation(form);
        });
    }

    setupValidation(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => this.handleInvalid(e));
            input.addEventListener('input', () => this.validateInput(input));
        });
    }

    handleInvalid(e) {
        e.preventDefault();
        const input = e.target;
        this.showError(input);
    }

    validateInput(input) {
        if (input.validity.valid) {
            this.hideError(input);
        } else {
            this.showError(input);
        }
    }

    showError(input) {
        const errorMessage = this.getErrorMessage(input);
        let errorElement = input.parentNode.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = errorMessage;
        input.classList.add('error');
    }

    hideError(input) {
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        input.classList.remove('error');
    }

    getErrorMessage(input) {
        if (input.validity.valueMissing) {
            return 'This field is required';
        }
        if (input.validity.typeMismatch) {
            if (input.type === 'email') {
                return 'Please enter a valid email address';
            }
            if (input.type === 'url') {
                return 'Please enter a valid URL';
            }
        }
        if (input.validity.tooShort) {
            return `Please enter at least ${input.minLength} characters`;
        }
        if (input.validity.tooLong) {
            return `Please enter no more than ${input.maxLength} characters`;
        }
        if (input.validity.patternMismatch) {
            return 'Please enter a valid value';
        }
        return 'Please enter a valid value';
    }

    handleSubmit(e) {
        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.validity.valid) {
                this.showError(input);
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
        }
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggle.querySelector('i');
        this.theme = localStorage.getItem('theme') || 'light';
        
        if (!this.themeToggle) {
            console.error('Theme toggle button not found');
            return;
        }

        this.init();
    }

    init() {
        this.applyTheme();
        this.themeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleTheme();
        });
        console.log('Theme manager initialized with theme:', this.theme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.themeIcon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        document.body.classList.toggle('dark-theme', this.theme === 'dark');
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', this.theme);
        this.applyTheme();
        console.log('Theme toggled to:', this.theme);
    }
}

// Search Functionality
class SearchManager {
    constructor() {
        this.searchToggle = document.getElementById('search-toggle');
        this.searchOverlay = document.getElementById('search-overlay');
        this.searchClose = document.getElementById('search-close');
        this.searchForm = document.getElementById('search-form');
        this.searchInput = document.getElementById('search-input');
        this.searchResults = document.getElementById('search-results');
        
        if (!this.searchToggle || !this.searchOverlay) {
            console.error('Search elements not found');
            return;
        }

        this.searchableSections = [
            { selector: 'h1', weight: 3 },
            { selector: 'h2', weight: 2 },
            { selector: 'h3', weight: 1 },
            { selector: 'p', weight: 0.5 }
        ];
        
        this.init();
    }

    init() {
        console.log('Initializing search manager');
        this.searchToggle.addEventListener('click', () => {
            console.log('Search toggle clicked');
            this.openSearch();
        });
        
        this.searchClose.addEventListener('click', () => {
            console.log('Search close clicked');
            this.closeSearch();
        });
        
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form submission
            console.log('Search form submitted');
            this.handleSearch();
        });
        
        this.searchInput.addEventListener('input', (e) => {
            console.log('Search input changed');
            this.handleSearch();
        });
        
        // Close search on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.searchOverlay.classList.contains('active')) {
                console.log('Escape key pressed');
                this.closeSearch();
            }
        });
    }

    openSearch() {
        console.log('Opening search overlay');
        this.searchOverlay.classList.add('active');
        this.searchInput.focus();
        document.body.style.overflow = 'hidden';
    }

    closeSearch() {
        console.log('Closing search overlay');
        this.searchOverlay.classList.remove('active');
        this.searchInput.value = '';
        this.searchResults.innerHTML = '';
        document.body.style.overflow = '';
    }

    handleSearch() {
        const query = this.searchInput.value.trim();
        
        if (!query) {
            this.searchResults.innerHTML = '';
            return;
        }
        
        try {
            const results = this.searchContent(query);
            this.displayResults(results);
        } catch (error) {
            console.error('Search failed:', error);
            this.searchResults.innerHTML = '<p class="error">Search failed. Please try again.</p>';
        }
    }

    searchContent(query) {
        const searchTerms = query.toLowerCase().split(' ');
        const results = [];

        this.searchableSections.forEach(({ selector, weight }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const text = element.textContent.toLowerCase();
                const relevance = this.calculateRelevance(text, searchTerms) * weight;
                
                if (relevance > 0) {
                    results.push({
                        element: element,
                        text: element.textContent,
                        relevance: relevance,
                        type: selector
                    });
                }
            });
        });

        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance);

        // Group results by section
        return this.groupResultsBySection(results);
    }

    calculateRelevance(text, searchTerms) {
        let relevance = 0;
        searchTerms.forEach(term => {
            if (text.includes(term)) {
                relevance += 1;
                // Bonus for exact matches
                if (text === term) relevance += 2;
                // Bonus for matches at the start of words
                if (text.includes(` ${term}`)) relevance += 0.5;
            }
        });
        return relevance;
    }

    groupResultsBySection(results) {
        const sections = new Map();
        
        results.forEach(result => {
            const section = this.findParentSection(result.element);
            if (!sections.has(section)) {
                sections.set(section, []);
            }
            sections.get(section).push(result);
        });

        return Array.from(sections.entries()).map(([section, results]) => ({
            section: section,
            results: results
        }));
    }

    findParentSection(element) {
        let current = element;
        while (current && !current.id) {
            current = current.parentElement;
        }
        return current ? current.id : 'main';
    }

    displayResults(groupedResults) {
        if (groupedResults.length === 0) {
            this.searchResults.innerHTML = '<p class="no-results">No results found.</p>';
            return;
        }

        const html = groupedResults.map(group => `
            <div class="search-section">
                <h3 class="search-section-title">${group.section}</h3>
                ${group.results.map(result => `
                    <div class="search-result-item">
                        <h4>${result.type.toUpperCase()}</h4>
                        <p>${this.highlightSearchTerms(result.text, this.searchInput.value)}</p>
                    </div>
                `).join('')}
            </div>
        `).join('');

        this.searchResults.innerHTML = html;
    }

    highlightSearchTerms(text, query) {
        const terms = query.toLowerCase().split(' ');
        let highlightedText = text;
        
        terms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
        });
        
        return highlightedText;
    }
}

// Progress Bar
class ProgressBar {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        document.body.appendChild(this.progressBar);
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
        this.updateProgress();
    }

    updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.createElement('button');
        this.button.className = 'back-to-top';
        this.button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        this.button.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(this.button);
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.toggleVisibility());
        this.button.addEventListener('click', () => this.scrollToTop());
    }

    toggleVisibility() {
        if (window.scrollY > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, waiting for header...');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-item a').forEach(item => {
            item.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenu.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // Wait for header to be loaded
    const waitForHeader = setInterval(() => {
        const themeToggle = document.getElementById('theme-toggle');
        const searchToggle = document.getElementById('search-toggle');
        const headerContainer = document.querySelector('.header-container');
        
        if (themeToggle && searchToggle && headerContainer) {
            clearInterval(waitForHeader);
            console.log('Header loaded, initializing features...');
            initializeFeatures();
        }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
        clearInterval(waitForHeader);
        console.error('Header failed to load within timeout');
    }, 5000);
});

function initializeFeatures() {
    try {
        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true
        });

        // Initialize theme manager
        const themeManager = new ThemeManager();
        console.log('Theme Manager initialized:', themeManager);

        // Initialize search manager
        const searchManager = new SearchManager();
        console.log('Search Manager initialized:', searchManager);

        // Initialize other features
        const loadingState = new LoadingState();
        const formErrorHandler = new FormErrorHandler();
        const progressBar = new ProgressBar();
        const backToTop = new BackToTop();

        // Debug logging for button elements
        const searchToggle = document.getElementById('search-toggle');
        const themeToggle = document.getElementById('theme-toggle');
        console.log('Search toggle button:', searchToggle);
        console.log('Theme toggle button:', themeToggle);

        // Remove direct event listeners since they're already handled in their respective classes
        // The ThemeManager and SearchManager classes already handle their own event listeners

    } catch (error) {
        console.error('Error initializing features:', error);
    }
} 