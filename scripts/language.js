// Store all loaded translations (keep your existing structure)
const translations = {
  en: {},
  fr: {},
  rw: {}
};

// Initialize language system
async function initLanguageSystem() {
  try {
    // Load all translation files (using your existing loader)
    await Promise.all([
      loadLanguageFile('en'),
      loadLanguageFile('fr'),
      loadLanguageFile('rw')
    ]);

    // Initialize i18next with loaded translations
    i18next.init({
      lng: 'en', // default language
      fallbackLng: 'en',
      resources: {
        en: { translation: translations.en },
        fr: { translation: translations.fr },
        rw: { translation: translations.rw }
      }
    });

    // Set up language switcher (now using i18next)
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      languageToggle.value = i18next.language;
      languageToggle.addEventListener('change', (e) => {
        i18next.changeLanguage(e.target.value, updateTranslations);
      });
    }

    // Apply initial translations
    updateTranslations();
  } catch (error) {
    console.error('Language initialization failed:', error);
    // Fallback to English if something goes wrong
    document.documentElement.lang = 'en';
  }
}

// KEEP THIS EXACT FUNCTION FROM YOUR ORIGINAL CODE - NO CHANGES!
async function loadLanguageFile(lang) {
  try {
    const response = await fetch(`scripts/translations/${lang}.js`);
    const scriptText = await response.text();
    
    // Extract the translations object from the JS file
    const module = {};
    new Function('module', scriptText)(module);
    
    translations[lang] = module.exports || module.translations;
  } catch (error) {
    console.error(`Failed to load ${lang} translations:`, error);
    translations[lang] = {}; // Ensure empty object as fallback
  }
}

// Updated translation updater (now uses i18next)
function updateTranslations() {
  // Update all [data-i18n] elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = i18next.t(key);
  });

  // Update all placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = i18next.t(key);
  });

  // Update HTML lang attribute
  document.documentElement.lang = i18next.language;
}

// Start the system (keep your existing DOM ready check)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSystem);
} else {
  initLanguageSystem();
}