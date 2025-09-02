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
