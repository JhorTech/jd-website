// Cookie Consent Management
class CookieConsent {
    constructor() {
        this.cookieConsent = document.getElementById('cookie-consent');
        this.cookieSettingsModal = document.getElementById('cookie-settings-modal');
        this.acceptAllButton = document.getElementById('cookie-accept-all');
        this.settingsButton = document.getElementById('cookie-settings');
        this.saveSettingsButton = document.getElementById('save-cookie-settings');
        this.closeSettingsButton = document.getElementById('close-cookie-settings');
        this.analyticsCookies = document.getElementById('analytics-cookies');
        this.marketingCookies = document.getElementById('marketing-cookies');

        this.cookiePreferences = {
            essential: true,
            analytics: false,
            marketing: false
        };

        this.init();
    }

    init() {
        // Check if user has already made a choice
        const consent = this.getCookie('cookie-consent');
        if (!consent) {
            this.showConsentBanner();
        }

        // Event Listeners
        this.acceptAllButton.addEventListener('click', () => this.acceptAll());
        this.settingsButton.addEventListener('click', () => this.showSettings());
        this.saveSettingsButton.addEventListener('click', () => this.saveSettings());
        this.closeSettingsButton.addEventListener('click', () => this.hideSettings());

        // Load saved preferences
        this.loadPreferences();
    }

    showConsentBanner() {
        this.cookieConsent.classList.add('show');
    }

    hideConsentBanner() {
        this.cookieConsent.classList.remove('show');
    }

    showSettings() {
        this.cookieSettingsModal.classList.add('show');
        this.hideConsentBanner();
    }

    hideSettings() {
        this.cookieSettingsModal.classList.remove('show');
    }

    acceptAll() {
        this.cookiePreferences.analytics = true;
        this.cookiePreferences.marketing = true;
        this.savePreferences();
        this.hideConsentBanner();
        this.initializeServices();
    }

    saveSettings() {
        this.cookiePreferences.analytics = this.analyticsCookies.checked;
        this.cookiePreferences.marketing = this.marketingCookies.checked;
        this.savePreferences();
        this.hideSettings();
        this.initializeServices();
    }

    savePreferences() {
        const preferences = JSON.stringify(this.cookiePreferences);
        this.setCookie('cookie-consent', preferences, 365);
    }

    loadPreferences() {
        const consent = this.getCookie('cookie-consent');
        if (consent) {
            this.cookiePreferences = JSON.parse(consent);
            this.analyticsCookies.checked = this.cookiePreferences.analytics;
            this.marketingCookies.checked = this.cookiePreferences.marketing;
            this.initializeServices();
        }
    }

    initializeServices() {
        if (this.cookiePreferences.analytics) {
            this.initializeAnalytics();
        }
        if (this.cookiePreferences.marketing) {
            this.initializeMarketing();
        }
    }

    initializeAnalytics() {
        // Initialize Google Analytics or other analytics services
        console.log('Analytics initialized');
    }

    initializeMarketing() {
        // Initialize marketing services
        console.log('Marketing services initialized');
    }

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
    }

    getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}

// Initialize cookie consent when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CookieConsent();
}); 