// Profile Modal Functions
function showProfileModal() {
  document.getElementById('profileModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  loadProfileData();
  updateTranslations();
}

function hideProfileModal() {
  document.getElementById('profileModal').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function loadProfileData() {
  const profileData = {
    name: "John Doe",
    email: "john.doe@agripal.com",
    phone: "+250 7..",
    farmType: "crop",
    primaryActivity: "Maize",
    farmSize: "5.2",
    farmSizeUnit: "hectares",
    language: i18next.language || "en"
  };
  
  document.getElementById('userName').value = profileData.name;
  document.getElementById('userEmail').value = profileData.email;
  document.getElementById('userPhone').value = profileData.phone;
  document.getElementById('farmType').value = profileData.farmType;
  document.getElementById('primaryActivity').value = profileData.primaryActivity;
  document.getElementById('farmSize').value = profileData.farmSize;
  document.getElementById('farmSizeUnit').value = profileData.farmSizeUnit;
  document.getElementById('userLanguage').value = profileData.language;
  
  updateProgress(4, 4);
}

function updateProgress(completed, total) {
  const progressElement = document.getElementById('progressText');
  if (progressElement) {
    progressElement.setAttribute('data-i18n-options', JSON.stringify({ completed, total }));
    progressElement.textContent = i18next.t('profile_modal.progress', { completed, total });
  }
  
  const progressBar = document.querySelector('#profileModal .bg-green-500');
  if (progressBar) {
    const percentage = (completed / total) * 100;
    progressBar.style.width = `${percentage}%`;
  }
}

function saveProfile() {
  const profileData = {
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    phone: document.getElementById('userPhone').value,
    farmType: document.getElementById('farmType').value,
    primaryActivity: document.getElementById('primaryActivity').value,
    farmSize: document.getElementById('farmSize').value,
    farmSizeUnit: document.getElementById('farmSizeUnit').value,
    language: document.getElementById('userLanguage').value
  };
  
  if (!profileData.name || !profileData.email || !profileData.farmType || 
      !profileData.primaryActivity || !profileData.farmSize) {
    alert(i18next.t('profile_modal.validation_required'));
    return;
  }
  
  console.log('Saving profile:', profileData);
  document.getElementById('userInitials').textContent = 
    profileData.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  if (i18next.language !== profileData.language) {
    i18next.changeLanguage(profileData.language).then(() => {
      updateTranslations();
    });
  }
  
  alert(i18next.t('profile_modal.save_success'));
  hideProfileModal();
}

function updateSelectOptions() {
  const farmTypeSelect = document.getElementById('farmType');
  if (farmTypeSelect) {
    Array.from(farmTypeSelect.options).forEach(option => {
      if (option.value && option.value !== "") {
        option.textContent = i18next.t(`farm_types.${option.value}`);
      }
    });
  }

  const farmSizeUnitSelect = document.getElementById('farmSizeUnit');
  if (farmSizeUnitSelect) {
    Array.from(farmSizeUnitSelect.options).forEach(option => {
      option.textContent = i18next.t(`units.${option.value}`);
    });
  }
}

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const options = element.getAttribute('data-i18n-options');
    
    if (key.startsWith('[html]')) {
      const cleanKey = key.replace('[html]', '');
      element.innerHTML = i18next.t(cleanKey, JSON.parse(options || '{}'));
    } else {
      element.textContent = i18next.t(key, JSON.parse(options || '{}'));
    }
  });

  updateSelectOptions();
}

// Initialize profile modal
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('[data-i18n="edit_profile"]')?.addEventListener('click', showProfileModal);
  
  const requiredFields = document.querySelectorAll('#profileModal [required]');
  requiredFields.forEach(field => {
    field.addEventListener('input', function() {
      const completed = Array.from(requiredFields).filter(f => f.value.trim()).length;
      updateProgress(completed, requiredFields.length);
    });
  });

  document.getElementById('userLanguage')?.addEventListener('change', function() {
    i18next.changeLanguage(this.value).then(() => {
      updateTranslations();
    });
  });
});