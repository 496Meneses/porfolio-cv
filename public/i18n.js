// Simple i18n implementation for portfolio
class I18n {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.translations = {};
    this.defaultLang = 'es';
  }

  detectLanguage() {
    // Check localStorage first
    const stored = localStorage.getItem('portfolio_lang');
    if (stored) return stored;

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    return ['en', 'es'].includes(browserLang) ? browserLang : 'es';
  }

  async loadTranslations(lang) {
    try {
      // Load all translation files
      const files = ['translation', 'landing', 'experience', 'education', 'abilities', 'about', 'common'];
      const promises = files.map(file => 
        fetch(`/locales/${lang}/${file}.json`)
          .then(res => res.ok ? res.json() : {})
          .catch(() => ({}))
      );

      const results = await Promise.all(promises);
      
      // Merge all translations into one object
      this.translations[lang] = results.reduce((acc, curr) => ({...acc, ...curr}), {});
      
      return this.translations[lang];
    } catch (error) {
      console.error('Failed to load translations:', error);
      return {};
    }
  }

  async setLanguage(lang) {
    if (!['en', 'es'].includes(lang)) lang = this.defaultLang;
    
    this.currentLang = lang;
    localStorage.setItem('portfolio_lang', lang);
    document.documentElement.lang = lang;

    // Load translations if not already loaded
    if (!this.translations[lang]) {
      await this.loadTranslations(lang);
    }

    // Apply translations to all elements with data-i18n
    this.applyTranslations();
    
    // Update language selector buttons
    this.updateLanguageButtons();
  }

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (translation) {
        if (element.hasAttribute('data-i18n-html')) {
          element.innerHTML = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Handle placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        element.placeholder = translation;
      }
    });

    // Handle aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const translation = this.t(key);
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });
  }

  updateLanguageButtons() {
    document.querySelectorAll('[data-lang-switch]').forEach(button => {
      const lang = button.getAttribute('data-lang-switch');
      if (lang === this.currentLang) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  async init() {
    await this.loadTranslations(this.currentLang);
    this.applyTranslations();
    this.updateLanguageButtons();

    // Add event listeners to language switcher buttons
    document.addEventListener('click', (e) => {
      const button = e.target.closest('[data-lang-switch]');
      if (button) {
        const lang = button.getAttribute('data-lang-switch');
        this.setLanguage(lang);
      }
    });
  }
}

// Create global instance
window.i18n = new I18n();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => window.i18n.init());
} else {
  window.i18n.init();
}
