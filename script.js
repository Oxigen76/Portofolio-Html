// Enhanced JavaScript for Portfolio Website
// Performance optimized with modern features

// Utility functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializeFormValidation();
    initializeFloatingActions();
    initializeSkillBars();
    initializeAccessibility();
    initializeEnhancedSkills();
    initializeProjectDetails();
    initializeLighthouseAnimation();
    initializeCookieConsent(); // <--- GDPR integration
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Update ARIA attributes
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                const target = document.querySelector(targetId);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } else {
                window.location.href = 'index.html' + targetId;
            }
        });
    });
}

// Scroll effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const progressBar = document.querySelector('.progress-bar');
    const backToTopBtn = document.querySelector('.back-to-top');

    const handleScroll = throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }

        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }, 16);

    window.addEventListener('scroll', handleScroll);

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                if (entry.target.classList.contains('expertise-card')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .expertise-card, .timeline-item, .cert-card').forEach(el => {
        observer.observe(el);
    });
}

// Skill bars animation
function initializeSkillBars() {}

function animateSkillBar(card) {
    const skillProgress = card.querySelector('.skill-progress');
    if (skillProgress) {
        const level = skillProgress.getAttribute('data-level');
        setTimeout(() => {
            skillProgress.style.width = level + '%';
        }, 200);
    }
}

// Form validation
function initializeFormValidation() {
    const form = document.querySelector('.contact-form-element');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = form.querySelector('.submit-btn');

    nameInput.addEventListener('blur', () => validateName());
    emailInput.addEventListener('blur', () => validateEmail());
    messageInput.addEventListener('blur', () => validateMessage());

    form.addEventListener('submit', handleFormSubmit);

    function validateName() {
        const name = nameInput.value.trim();
        const errorElement = document.getElementById('name-error');
        if (name.length < 2) {
            showError(nameInput, errorElement, 'Name must be at least 2 characters long');
            return false;
        }
        clearError(nameInput, errorElement);
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        }
        clearError(emailInput, errorElement);
        return true;
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        const errorElement = document.getElementById('message-error');
        if (message.length < 10) {
            showError(messageInput, errorElement, 'Message must be at least 10 characters long');
            return false;
        }
        clearError(messageInput, errorElement);
        return true;
    }

    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (isNameValid && isEmailValid && isMessageValid) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            emailjs.sendForm('service_ozc533m', 'template_f7ab8uu', form)
                .then(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    showSuccessMessage();
                    form.reset();
                }, (error) => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                    showErrorMessage('Failed to send message. Please try again.');
                });
        }
    }

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Thank you for your message! I\'ll get back to you soon.';
        form.parentNode.insertBefore(successDiv, form);
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        form.parentNode.insertBefore(errorDiv, form);
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Floating action buttons
function initializeFloatingActions() {
    const requestCvBtn = document.querySelector('.fab.request-cv');
    if (requestCvBtn) {
        requestCvBtn.addEventListener('click', () => {
            showCvRequestPopup();
        });
    }
}

// CV Request Popup
function showCvRequestPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    const popup = document.createElement('div');
    popup.className = 'popup-content';
    popup.innerHTML = `
        <div class="popup-header">
            <h3>Request CV</h3>
            <button class="popup-close" aria-label="Close popup">&times;</button>
        </div>
        <div class="popup-body">
            <p>To maintain privacy and security, I don't offer direct CV downloads. Please use the contact form below to request my CV, and I'll send it to you personally.</p>
            <div class="popup-actions">
                <button class="popup-btn primary" id="go-to-contact">Go to Contact Form</button>
                <button class="popup-btn secondary" id="close-popup">Close</button>
            </div>
        </div>
    `;
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });
    popup.querySelector('.popup-close').addEventListener('click', closePopup);
    popup.querySelector('#go-to-contact').addEventListener('click', () => {
        closePopup();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    popup.querySelector('#close-popup').addEventListener('click', closePopup);
    document.addEventListener('keydown', handleEscapeKey);
    function closePopup() {
        overlay.remove();
        document.removeEventListener('keydown', handleEscapeKey);
    }
    function handleEscapeKey(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    }
}

// Accessibility enhancements
function initializeAccessibility() {
    // Focus management for mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus();
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Keyboard navigation for cards
    document.querySelectorAll('.expertise-card, .cert-card, .timeline-item').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
}

// Lighthouse animation
function initializeLighthouseAnimation() {
    const lighthouseLight = document.querySelector('.lighthouse-light');
    if (lighthouseLight) {
        setInterval(() => {
            lighthouseLight.classList.toggle('pulse');
        }, 2000);
    }
}

// Performance monitoring (optional/placeholder)
function initializePerformanceMonitoring() {
    if ('web-vital' in window) {
        // Placeholder for real monitoring (ex: Web Vitals library)
        console.log('Performance monitoring initialized');
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, send this to an error tracking service if desired
});

// Enhanced Skills Section Functions
function initializeEnhancedSkills() {
    // Add progressive delay to skill pills for staggered animation
    document.querySelectorAll('.skill-pill').forEach((pill, i) => {
        pill.style.setProperty('--delay', `${i * 0.08}s`);
    });

    // Intersection Observer for scroll-triggered animations
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe skills section
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }

    // Expansion on mobile for skill pills
    initializeSkillsExpansion();
}

function initializeSkillsExpansion() {
    const skillTags = document.querySelectorAll('.skill-pill');
    skillTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                skillTags.forEach(otherTag => {
                    if (otherTag !== tag) {
                        otherTag.classList.remove('expanded');
                    }
                });
                tag.classList.toggle('expanded');
            }
        });
    });
}

// Add mobile-specific styles for skills pills if needed
const mobileStyles = `
    .skill-tag.enhanced.mobile-hover {
        transform: translateY(-8px) scale(1.05);
        background: linear-gradient(135deg, var(--accent-color) 0%, var(--secondary-color) 100%);
        color: white;
        box-shadow: 0 15px 35px rgba(0,0,0,0.3);
    }
    .skill-tag.enhanced.expanded {
        position: relative;
        z-index: 100;
        transform: scale(1.1);
        background: linear-gradient(135deg, var(--accent-color) 0%, var(--secondary-color) 100%);
        color: white;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .skill-tag.enhanced.expanded::after {
        opacity: 1;
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        transform: none;
        max-width: none;
    }
`;
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileStyles;
document.head.appendChild(styleSheet);

// Project Details Toggle Function - Modern Implementation
function toggleProjectDetails(button, projectId) {
    const details = document.getElementById(projectId);
    const isVisible = details.style.display !== 'none';
    if (isVisible) {
        details.style.display = 'none';
        button.textContent = 'View Summary ▼';
        button.classList.remove('expanded');
    } else {
        details.style.display = 'block';
        button.textContent = 'Hide Summary ▲';
        button.classList.add('expanded');
    }
}

// Initialize Project Details Event Listeners (Modern Approach)
function initializeProjectDetails() {
    if (!document.querySelector('.project-link')) return;
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const projectId = this.getAttribute('data-project-id');
            if (projectId) {
                toggleProjectDetails(this, projectId);
            }
        });
        // Add keyboard support for accessibility
        link.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const projectId = this.getAttribute('data-project-id');
                if (projectId) {
                    toggleProjectDetails(this, projectId);
                }
            }
        });
    });
}

// ===================================
// DARK/LIGHT MODE THEME MANAGEMENT
// ===================================
class ThemeManager {
    constructor() {
        this.themeKey = 'theme'; // Simplified key
        this.element = document.documentElement;
        this.themeToggle = null;
        this.sunIcon = null;
        this.moonIcon = null;

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.sunIcon = document.querySelector('.sun-icon');
        this.moonIcon = document.querySelector('.moon-icon');

        if (!this.themeToggle) {
            console.warn('Theme toggle button not found.');
            return;
        }

        // Set the correct icon based on the theme already set by the inline script
        this.updateThemeIcons(this.getCurrentTheme());

        // Add event listener for toggling the theme
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Listen for system theme changes
        this.listenForSystemThemeChanges();
    }

    getSavedTheme() {
        try {
            return localStorage.getItem(this.themeKey);
        } catch (e) {
            console.warn('localStorage is not available.');
            return null;
        }
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    saveTheme(theme) {
        try {
            localStorage.setItem(this.themeKey, theme);
        } catch (e) {
            console.warn('Could not save theme to localStorage.');
        }
    }

    setTheme(theme, save = true) {
        this.element.setAttribute('data-theme', theme);
        this.updateThemeIcons(theme);
        if (save) {
            this.saveTheme(theme);
        }
    }

    updateThemeIcons(theme) {
        if (!this.sunIcon || !this.moonIcon) return;
        if (theme === 'dark') {
            this.sunIcon.style.display = 'inline';
            this.moonIcon.style.display = 'none';
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            this.sunIcon.style.display = 'none';
            this.moonIcon.style.display = 'inline';
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    toggleTheme() {
        const newTheme = this.getCurrentTheme() === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    listenForSystemThemeChanges() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!this.getSavedTheme()) {
                this.setTheme(e.matches ? 'dark' : 'light', false);
            }
        });
    }

    getCurrentTheme() {
        return this.element.getAttribute('data-theme');
    }
}

// Initialize the theme manager
new ThemeManager();

// Service Worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// === COOKIE CONSENT LOGIC (GDPR Compliant, Multilingual) ===

// Toate textele pentru popup în RO și EN:
const cookieTexts = {
  ro: {
    title: "Setări cookie-uri",
    desc: "Acest site folosește cookie-uri pentru funcționare și pentru a analiza traficul. Poți alege ce categorii de cookie-uri accepți:",
    categories: {
      strict: {
        label: "<b>Strict necesare</b> (obligatorii)",
        desc: "Necesare pentru funcționarea site-ului. Nu pot fi dezactivate."
      },
      analytics: {
        label: "<b>Analiză & Statistici</b>",
        desc: "Ex: Google Analytics. Ne ajută să înțelegem cum este folosit site-ul."
      },
      marketing: {
        label: "<b>Marketing</b>",
        desc: "Ex: Facebook Pixel, remarketing, reclame personalizate."
      },
      personalization: {
        label: "<b>Personalizare</b>",
        desc: "Ex: salvarea preferințelor vizitatorului."
      }
    },
    acceptAll: "Acceptă toate",
    save: "Salvează preferințele",
    privacy: "Vezi politica de confidențialitate"
  },
  en: {
    title: "Cookie Settings",
    desc: "This site uses cookies for essential functionality and to analyze traffic. You can choose which cookie categories to accept:",
    categories: {
      strict: {
        label: "<b>Strictly Necessary</b> (required)",
        desc: "Needed for site functionality. Cannot be disabled."
      },
      analytics: {
        label: "<b>Analytics & Statistics</b>",
        desc: "E.g. Google Analytics. Helps us understand how the site is used."
      },
      marketing: {
        label: "<b>Marketing</b>",
        desc: "E.g. Facebook Pixel, remarketing, personalized ads."
      },
      personalization: {
        label: "<b>Personalization</b>",
        desc: "E.g. saving your preferences."
      }
    },
    acceptAll: "Accept all",
    save: "Save preferences",
    privacy: "View privacy policy"
  }
};

// Detectează automat limba sau folosește ce a selectat userul
function detectLang() {
  const saved = localStorage.getItem('cookie-lang');
  if (saved) return saved;
  const navLang = (navigator.languages ? navigator.languages[0] : navigator.language || '').toLowerCase();
  return navLang.startsWith('ro') ? 'ro' : 'en';
}

let cookieLang = detectLang();

// Setează limbajul la popup (rescrie textele)
function setCookieLang(lang) {
  cookieLang = lang;
  localStorage.setItem('cookie-lang', lang);
  const txt = cookieTexts[lang];
  // Dacă nu există popup-ul, ieși
  if (!document.getElementById('cookie-popup')) return;
  document.getElementById('cookie-popup-title').textContent = txt.title;
  document.getElementById('cookie-popup-desc').textContent = txt.desc;
  document.getElementById('cookie-strict-label').innerHTML = txt.categories.strict.label;
  document.getElementById('cookie-strict-desc').textContent = txt.categories.strict.desc;
  document.getElementById('cookie-analytics-label').innerHTML = txt.categories.analytics.label;
  document.getElementById('cookie-analytics-desc').textContent = txt.categories.analytics.desc;
  document.getElementById('cookie-marketing-label').innerHTML = txt.categories.marketing.label;
  document.getElementById('cookie-marketing-desc').textContent = txt.categories.marketing.desc;
  document.getElementById('cookie-personalization-label').innerHTML = txt.categories.personalization.label;
  document.getElementById('cookie-personalization-desc').textContent = txt.categories.personalization.desc;
  document.getElementById('accept-all-cookies').textContent = txt.acceptAll;
  document.querySelector('#cookie-form button[type="submit"]').textContent = txt.save;
  document.getElementById('privacy-link').textContent = txt.privacy;

  // Actualizează "active" pe butoane
  document.querySelectorAll('.lang-switch').forEach(btn => btn.classList.remove('active'));
  if (document.getElementById('lang-' + lang))
    document.getElementById('lang-' + lang).classList.add('active');
}

// Inițializare cookie consent la load
document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('cookie-popup');
    const form = document.getElementById('cookie-form');
    const acceptAllBtn = document.getElementById('accept-all-cookies');
    // Bifează preferințele memorate dacă există
    const prefs = JSON.parse(localStorage.getItem('cookie-preferences') || '{}');
    if (prefs.analytics !== undefined) document.getElementById('cookie-analytics').checked = prefs.analytics;
    if (prefs.marketing !== undefined) document.getElementById('cookie-marketing').checked = prefs.marketing;
    if (prefs.personalization !== undefined) document.getElementById('cookie-personalization').checked = prefs.personalization;

    // Inițializează limba și popup-ul (crează titlu/descrieri dacă nu există deja)
    if (!document.getElementById('cookie-popup-title')) {
        // Adaugă elementele lipsă pentru limbaj dinamic
        const content = popup.querySelector('.cookie-popup-content');
        const h3 = content.querySelector('h3');
        h3.id = 'cookie-popup-title';
        const p = content.querySelector('p');
        p.id = 'cookie-popup-desc';

        // Fiecare label și desc
        content.querySelectorAll('.cookie-category').forEach((cat, i) => {
            const labels = [
                'cookie-strict-label', 'cookie-analytics-label', 'cookie-marketing-label', 'cookie-personalization-label'
            ];
            const descs = [
                'cookie-strict-desc', 'cookie-analytics-desc', 'cookie-marketing-desc', 'cookie-personalization-desc'
            ];
            cat.querySelector('label').id = labels[i];
            cat.querySelector('.cookie-desc').id = descs[i];
        });
        content.querySelector('.cookie-link a').id = 'privacy-link';

        // Adaugă butoane pentru schimbare limbă
        if (!content.querySelector('.lang-switch')) {
            const div = document.createElement('div');
            div.style.textAlign = 'right';
            div.style.marginBottom = '0.6em';
            div.innerHTML = `
                <button class="lang-switch" id="lang-ro" type="button">RO</button>
                <button class="lang-switch" id="lang-en" type="button">EN</button>
            `;
            content.insertBefore(div, content.firstChild);
        }
    }

    // Inițializează limbajul la popup (prima dată)
    setCookieLang(cookieLang);

    // Schimbare manuală de limbă
    if (document.getElementById('lang-ro')) document.getElementById('lang-ro').onclick = () => setCookieLang('ro');
    if (document.getElementById('lang-en')) document.getElementById('lang-en').onclick = () => setCookieLang('en');

    // Dacă nu există preferințe, arată popup-ul
    if (!localStorage.getItem('cookie-preferences')) {
        popup.style.display = 'block';
    }

    // Language switching functionality
    const langRo = document.getElementById('lang-ro');
    const langEn = document.getElementById('lang-en');
    
    if (langRo && langEn) {
        langRo.addEventListener('click', function() {
            switchCookieLanguage('ro');
            langRo.classList.add('active');
            langEn.classList.remove('active');
        });
        
        langEn.addEventListener('click', function() {
            switchCookieLanguage('en');
            langEn.classList.add('active');
            langRo.classList.remove('active');
        });
    }

    // Acceptă toate
    acceptAllBtn.addEventListener('click', function () {
        document.getElementById('cookie-analytics').checked = true;
        document.getElementById('cookie-marketing').checked = true;
        document.getElementById('cookie-personalization').checked = true;
        saveCookiePrefs(true);
        popup.style.display = 'none';
    });

    // La submit, salvează preferințele
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        saveCookiePrefs();
        popup.style.display = 'none';
    });

    // Închide la click în afara ferestrei popup (dar nu la click pe conținut)
    popup.addEventListener('click', function(e) {
        if (e.target === popup) popup.style.display = 'none';
    });

    // Funcție publică pt link-ul din footer
    window.showCookiePopup = function() {
      popup.style.display = 'block';
    }
});

// Salvează preferințele de cookies în localStorage + gestionează acțiunile (GA etc.)
function saveCookiePrefs(all = false) {
    const analytics = all || document.getElementById('cookie-analytics').checked;
    const marketing = all || document.getElementById('cookie-marketing').checked;
    const personalization = all || document.getElementById('cookie-personalization').checked;
    const prefs = { strict: true, analytics, marketing, personalization };
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    handleCookieCategories(prefs);
}

// Gestionează acțiunile când se schimbă preferințele
function handleCookieCategories(prefs) {
    // Google Analytics
    if (prefs.analytics) {
        if (!window.GAinitialized && typeof startGoogleAnalytics === "function") {
            startGoogleAnalytics();
            window.GAinitialized = true;
        }
    } else {
        // Poți adăuga aici cod pentru a dezactiva Analytics sau a șterge cookie-urile
    }
    // Adaugă aici pentru Facebook Pixel, personalizare etc. când e nevoie
}

// (Optional) Inițializează Analytics la page load dacă userul deja și-a dat acordul anterior
document.addEventListener('DOMContentLoaded', function() {
    const prefs = JSON.parse(localStorage.getItem('cookie-preferences') || '{}');
    if (prefs.analytics && typeof startGoogleAnalytics === "function") {
        startGoogleAnalytics();
        window.GAinitialized = true;
    }
});

// ===== COOKIE CONSENT – FINALIZARE ȘI SIGURANȚĂ INTEGRALĂ =====

// Funcție globală (pentru linkul din footer „Change cookies preferences”)
window.showCookiePopup = function() {
  var popup = document.getElementById('cookie-popup');
  if (popup) {
    popup.style.display = 'block';
    // Mută focusul pe primul buton pentru accesibilitate
    const firstBtn = popup.querySelector('button, [tabindex]:not([tabindex="-1"])');
    if (firstBtn) firstBtn.focus();
  }
};

// Redeschide pop-up la apăsare ESC pe fundal pop-up
document.addEventListener('keydown', function(e) {
  if (e.key === "Escape") {
    var popup = document.getElementById('cookie-popup');
    if (popup && popup.style.display === 'block') {
      popup.style.display = 'none';
    }
  }
});

// Reintrare accesibilă cu tab la pop-up cookies
(function enablePopupTabFocus() {
  const popup = document.getElementById('cookie-popup');
  if (!popup) return;
  popup.addEventListener('keydown', function(e) {
    if (e.key === "Tab") {
      const focusable = popup.querySelectorAll('button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();

// Închide pop-up cookies la click pe „X” dacă adaugi un close button în layout (opțional)
(function setupCookiePopupCloseBtn() {
  const popup = document.getElementById('cookie-popup');
  if (!popup) return;
  const closeBtn = popup.querySelector('.cookie-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      popup.style.display = 'none';
    });
  }
})();

// Poți adăuga extra fallback dacă elementele nu există deja
function ensureCookiePopupHtml() {
  if (!document.getElementById('cookie-popup')) {
    // Se poate injecta pop-upul aici (dacă lipsește accidental)
    // ...dar în site-ul tău este deja în index.html!
  }
}

// Poți adăuga fallback la preferințe lipsă
function getCookiePrefs() {
  try {
    return JSON.parse(localStorage.getItem('cookie-preferences')) || { strict: true };
  } catch (e) {
    return { strict: true };
  }
}

// ===== Sfârșit logică GDPR COOKIE CONSENT =====

// Alte scripturi existente pentru funcționalitatea site-ului tău
// (nu trebuie mutate aici dacă sunt deja prezente în partea 1/2/3, codul tău de funcționalitate, animații, etc.)

// Dacă folosești SW pentru PWA, nu uita să-l lași pe poziție!
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}


// Language switching function for cookie popup
function switchCookieLanguage(lang) {
    const popup = document.getElementById('cookie-popup');
    if (!popup) return;
    
    const translations = {
        ro: {
            title: 'Setări cookie-uri',
            description: 'Acest site folosește cookie-uri pentru funcționare și pentru a analiza traficul. Poți alege ce categorii de cookie-uri accepți:',
            strict: '<b>Strict necesare</b> (obligatorii)',
            strictDesc: 'Necesare pentru funcționarea site-ului. Nu pot fi dezactivate.',
            analytics: '<b>Analiză & Statistici</b>',
            analyticsDesc: 'Ex: Google Analytics. Ne ajută să înțelegem cum este folosit site-ul.',
            marketing: '<b>Marketing</b>',
            marketingDesc: 'Ex: Facebook Pixel, remarketing, reclame personalizate.',
            personalization: '<b>Personalizare</b>',
            personalizationDesc: 'Ex: salvarea preferințelor vizitatorului.',
            acceptAll: 'Acceptă toate',
            savePrefs: 'Salvează preferințele'
        },
        en: {
            title: 'Cookie Settings',
            description: 'This site uses cookies for functionality and to analyze traffic. You can choose which categories of cookies you accept:',
            strict: '<b>Strictly Necessary</b> (required)',
            strictDesc: 'Required for the website to function. Cannot be disabled.',
            analytics: '<b>Analytics & Statistics</b>',
            analyticsDesc: 'Ex: Google Analytics. Helps us understand how the site is used.',
            marketing: '<b>Marketing</b>',
            marketingDesc: 'Ex: Facebook Pixel, remarketing, personalized ads.',
            personalization: '<b>Personalization</b>',
            personalizationDesc: 'Ex: saving visitor preferences.',
            acceptAll: 'Accept All',
            savePrefs: 'Save Preferences'
        }
    };
    
    const t = translations[lang];
    if (!t) return;
    
    // Update text content
    const title = popup.querySelector('h3');
    const description = popup.querySelector('p');
    const strictLabel = document.getElementById('cookie-strict-label');
    const strictDesc = document.getElementById('cookie-strict-desc');
    const analyticsLabel = document.getElementById('cookie-analytics-label');
    const analyticsDesc = document.getElementById('cookie-analytics-desc');
    const marketingLabel = document.getElementById('cookie-marketing-label');
    const marketingDesc = document.getElementById('cookie-marketing-desc');
    const personalizationLabel = document.getElementById('cookie-personalization-label');
    const personalizationDesc = document.getElementById('cookie-personalization-desc');
    const acceptAllBtn = document.getElementById('accept-all-cookies');
    const saveBtn = popup.querySelector('button[type="submit"]');
    
    if (title) title.textContent = t.title;
    if (description) description.textContent = t.description;
    if (strictLabel) strictLabel.innerHTML = t.strict;
    if (strictDesc) strictDesc.textContent = t.strictDesc;
    if (analyticsLabel) analyticsLabel.innerHTML = t.analytics;
    if (analyticsDesc) analyticsDesc.textContent = t.analyticsDesc;
    if (marketingLabel) marketingLabel.innerHTML = t.marketing;
    if (marketingDesc) marketingDesc.textContent = t.marketingDesc;
    if (personalizationLabel) personalizationLabel.innerHTML = t.personalization;
    if (personalizationDesc) personalizationDesc.textContent = t.personalizationDesc;
    if (acceptAllBtn) acceptAllBtn.textContent = t.acceptAll;
    if (saveBtn) saveBtn.textContent = t.savePrefs;
}


// Article sharing functionality
function shareArticle() {
    const articleTitle = "The Evolution of Ransomware: From Simple Encryption to Double Extortion";
    const articleUrl = window.location.href + "#ransomware-evolution";
    
    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: articleTitle,
            text: "A comprehensive analysis of ransomware's evolution from the 1989 AIDS Trojan to modern double extortion tactics.",
            url: articleUrl
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback to copying URL to clipboard
        navigator.clipboard.writeText(articleUrl).then(() => {
            // Show a temporary notification
            const notification = document.createElement('div');
            notification.textContent = 'Article URL copied to clipboard!';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--accent-color);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 10px;
                z-index: 1000;
                font-weight: 600;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }).catch(err => {
            console.log('Error copying to clipboard:', err);
            alert('Unable to copy URL. Please copy manually: ' + articleUrl);
        });
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

