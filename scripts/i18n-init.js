// scripts/i18n-init.js
function initializeTranslations() {
  // Initialize i18next
  i18next.init({
    lng: 'en', // default language
    resources: {
      en: { translation: translations_en },
      fr: { translation: translations_fr },
      rw: { translation: translations_rw }
    }
  }, function(err, t) {
    if (err) console.error('Translation initialization failed:', err);
    updateContent();
  });

  // Function to update all translatable elements
  function updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = i18next.t(key);
    });
    
    // Handle placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      element.setAttribute('placeholder', i18next.t(key));
    });
  }

  // Language toggle event listener
  document.getElementById('languageToggle')?.addEventListener('change', function() {
    i18next.changeLanguage(this.value, function(err, t) {
      if (err) return console.log('Language change failed:', err);
      updateContent();
    });
  });
}

// Wait for DOM and translations to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if translations are loaded (they should be loaded before this script)
  if (typeof translations_en !== 'undefined' && 
      typeof translations_fr !== 'undefined' && 
      typeof translations_rw !== 'undefined') {
    initializeTranslations();
  } else {
    console.error('Translation files not loaded properly');
  }
});