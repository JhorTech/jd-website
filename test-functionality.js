// Test script for website functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log('Running website functionality tests...');
  
  // Test navigation links
  function testNavigation() {
    console.log('Testing navigation links...');
    const navLinks = document.querySelectorAll('.nav-menu a');
    let brokenLinks = 0;
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        fetch(href)
          .then(response => {
            if (!response.ok) {
              console.error(`Broken link: ${href} (${response.status})`);
              brokenLinks++;
            }
          })
          .catch(error => {
            console.error(`Error fetching ${href}: ${error}`);
            brokenLinks++;
          });
      }
    });
    
    setTimeout(() => {
      console.log(`Navigation test complete. Found ${brokenLinks} broken links.`);
    }, 2000);
  }
  
  // Test form validation
  function testForms() {
    console.log('Testing form validation...');
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      console.log(`Testing form: ${form.getAttribute('name') || 'unnamed form'}`);
      const requiredFields = form.querySelectorAll('[required]');
      const submitButton = form.querySelector('button[type="submit"]');
      
      if (requiredFields.length > 0 && submitButton) {
        console.log(`Form has ${requiredFields.length} required fields and a submit button.`);
      } else {
        console.warn(`Form may have issues: ${requiredFields.length} required fields, submit button: ${!!submitButton}`);
      }
    });
  }
  
  // Test responsive design
  function testResponsiveness() {
    console.log('Testing responsive design...');
    const viewportWidth = window.innerWidth;
    console.log(`Current viewport width: ${viewportWidth}px`);
    
    if (viewportWidth < 768) {
      console.log('Testing mobile view...');
      const mobileMenu = document.querySelector('.mobile-menu-btn');
      if (mobileMenu) {
        console.log('Mobile menu found.');
      } else {
        console.warn('Mobile menu not found!');
      }
    }
    
    // Check for horizontal overflow
    const bodyWidth = document.body.offsetWidth;
    const windowWidth = window.innerWidth;
    if (bodyWidth > windowWidth) {
      console.warn(`Horizontal overflow detected: body width (${bodyWidth}px) > window width (${windowWidth}px)`);
    } else {
      console.log('No horizontal overflow detected.');
    }
  }
  
  // Test image loading
  function testImages() {
    console.log('Testing image loading...');
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    let brokenImages = 0;
    
    images.forEach(img => {
      if (img.complete) {
        if (img.naturalWidth === 0) {
          console.error(`Broken image: ${img.src}`);
          brokenImages++;
        } else {
          loadedImages++;
        }
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
        });
        img.addEventListener('error', () => {
          console.error(`Failed to load image: ${img.src}`);
          brokenImages++;
        });
      }
    });
    
    setTimeout(() => {
      console.log(`Image test complete. Loaded: ${loadedImages}, Broken: ${brokenImages}, Total: ${images.length}`);
    }, 2000);
  }
  
  // Test component inclusion
  function testComponents() {
    console.log('Testing component inclusion...');
    setTimeout(() => {
      const header = document.querySelector('header');
      const footer = document.querySelector('footer');
      
      if (header) {
        console.log('Header component loaded successfully.');
      } else {
        console.error('Header component failed to load!');
      }
      
      if (footer) {
        console.log('Footer component loaded successfully.');
      } else {
        console.error('Footer component failed to load!');
      }
    }, 1000); // Wait for components to load
  }
  
  // Run tests
  testNavigation();
  testForms();
  testResponsiveness();
  testImages();
  testComponents();
  
  console.log('All tests initiated. Check console for results.');
});
