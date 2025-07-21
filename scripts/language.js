// Initialize i18next
i18next.init({
  lng: 'en', // default language
  resources: {
    en: { translation: enTranslations },
    fr: { translation: frTranslations },
    rw: { translation: rwTranslations }
  }
}, function(err, t) {
  // Initial translations loaded
  updateContent();
});

// Function to update all translatable content
function updateContent() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18next.t(key);
  });
  
  // Handle placeholders
  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', i18next.t(key));
  });
}

// Language switcher functionality
document.getElementById('languageToggle').addEventListener('change', function() {
  const lang = this.value;
  i18next.changeLanguage(lang, function(err, t) {
    if (err) return console.error('Language change failed:', err);
    updateContent();
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Special handling for RTL languages if needed
    if (lang === 'ar') {
      document.body.dir = 'rtl';
    } else {
      document.body.dir = 'ltr';
    }
  });
});