// EcoRise Energy Website JavaScript
console.log('EcoRise Energy website loaded');

// Account dropdown functionality
function initAccountDropdown() {
    const accountBtn = document.getElementById('accountBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (accountBtn && dropdownMenu) {
        accountBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropdownMenu.classList.contains('show');
            
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!accountBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                closeDropdown();
            }
        });

        // Handle dropdown item clicks
        const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // Handle different menu items
                if (href === '#logout') {
                    handleLogout();
                } else if (href === '#dashboard') {
                    showDashboard();
                } else if (href === '#usage') {
                    showUsageAnalytics();
                } else if (href === '#billing') {
                    showBilling();
                } else if (href === '#maintenance') {
                    showMaintenance();
                } else if (href === '#support') {
                    showSupport();
                } else if (href === '#settings') {
                    showSettings();
                }
                
                closeDropdown();
            });
        });
    }

    function openDropdown() {
        dropdownMenu.classList.add('show');
        accountBtn.classList.add('active');
    }

    function closeDropdown() {
        dropdownMenu.classList.remove('show');
        accountBtn.classList.remove('active');
    }

    // Placeholder functions for menu items
    function handleLogout() {
        if (confirm('Are you sure you want to sign out?')) {
            alert('Signing out... (This would redirect to login page)');
        }
    }

    function showDashboard() {
        alert('Opening Energy Dashboard... (This would show your energy production and consumption data)');
    }

    function showUsageAnalytics() {
        alert('Opening Usage Analytics... (This would show detailed energy usage reports)');
    }

    function showBilling() {
        alert('Opening Billing & Payments... (This would show your bills and payment options)');
    }

    function showMaintenance() {
        alert('Opening Maintenance... (This would show maintenance schedules and service requests)');
    }

    function showSupport() {
        alert('Opening Support Tickets... (This would show your support history and create new tickets)');
    }

    function showSettings() {
        alert('Opening Account Settings... (This would show profile and notification settings)');
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize account dropdown
    initAccountDropdown();
    
    // Initialize energy calculator
    initEnergyCalculator();
    
    // Initialize quote form
    initQuoteForm();
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add click handlers for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.textContent.includes('Get Free Quote')) {
                // Scroll to contact section
                document.getElementById('contact').scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (this.textContent.includes('Learn More')) {
                // Scroll to services section
                document.getElementById('services').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add some animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe service cards and features
    const animatedElements = document.querySelectorAll('.service-card, .feature, .stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add some interactive stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = stat.textContent;
        const isNumber = !isNaN(parseInt(target));
        
        if (isNumber) {
            const finalNumber = parseInt(target.replace(/\D/g, ''));
            const suffix = target.replace(/[\d,]/g, '');
            let current = 0;
            const increment = finalNumber / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalNumber) {
                    stat.textContent = finalNumber.toLocaleString() + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current).toLocaleString() + suffix;
                }
            }, 40);
        }
    });
}

// Trigger stats animation when hero section is visible
const heroObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateStats, 500);
            heroObserver.unobserve(entry.target);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
});

// Energy Calculator Functionality
function initEnergyCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const monthlyBillInput = document.getElementById('monthlyBill');
    const homeSizeInput = document.getElementById('homeSize');
    const locationSelect = document.getElementById('location');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const monthlyBill = parseFloat(monthlyBillInput.value) || 0;
            const homeSize = parseFloat(homeSizeInput.value) || 0;
            const location = locationSelect.value;

            if (monthlyBill > 0 && homeSize > 0) {
                calculateSavings(monthlyBill, homeSize, location);
            } else {
                alert('Please enter valid values for monthly bill and home size.');
            }
        });
    }

    // Allow calculation on Enter key
    [monthlyBillInput, homeSizeInput].forEach(input => {
        if (input) {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calculateBtn.click();
                }
            });
        }
    });
}

function calculateSavings(monthlyBill, homeSize, location) {
    // Solar calculation factors
    const locationMultipliers = {
        'high': 1.3,
        'medium': 1.0,
        'low': 0.7
    };

    const sunMultiplier = locationMultipliers[location] || 1.0;
    
    // Estimates based on industry averages
    const annualBill = monthlyBill * 12;
    const solarOffset = 0.9; // 90% of energy needs covered
    const annualSavings = Math.round(annualBill * solarOffset * sunMultiplier);
    const lifetimeSavings = Math.round(annualSavings * 25);
    
    // System size estimation (rough calculation)
    const systemSize = Math.round((annualBill * 0.008) * sunMultiplier * 10) / 10;
    
    // Carbon offset (roughly 0.7 tons CO2 per MWh)
    const carbonOffset = Math.round((systemSize * 1.5 * sunMultiplier) * 10) / 10;

    // Update the display
    document.getElementById('annualSavings').textContent = `$${annualSavings.toLocaleString()}`;
    document.getElementById('lifetimeSavings').textContent = `$${lifetimeSavings.toLocaleString()}`;
    document.getElementById('carbonOffset').textContent = `${carbonOffset} tons/year`;
    document.getElementById('systemSize').textContent = `${systemSize} kW`;

    // Add animation to results
    const resultCards = document.querySelectorAll('.result-card');
    resultCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.transform = 'scale(1.05)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Quote Form Functionality
function initQuoteForm() {
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                propertyType: document.getElementById('propertyType').value,
                timeframe: document.getElementById('timeframe').value,
                message: document.getElementById('message').value
            };
            
            // Basic validation
            const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'propertyType', 'timeframe'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                alert(`Thank you ${formData.firstName}! Your quote request has been submitted. Our team will contact you within 24 hours at ${formData.email}.`);
                
                // Reset form
                quoteForm.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // In a real application, you would send this data to your backend
                console.log('Quote request submitted:', formData);
            }, 2000);
        });
    }
}
