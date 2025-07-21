// soil-land.js - Save this in your scripts folder
class SoilLandAnalysis {
  constructor() {
    this.currentMethod = 'photo';
    this.arActive = false;
    this.satelliteMap = null;
    this.init();
  }

  init() {
    this.initEventListeners();
    this.initMethodTabs();
    this.checkARSupport();
  }

  initEventListeners() {
    // Photo analysis
    document.getElementById('soilPhoto').addEventListener('change', (e) => this.analyzePhoto(e.target.files[0]));
    
    // AR scanning
    document.getElementById('startAR').addEventListener('click', () => this.startARScan());
    
    // Satellite data
    document.getElementById('refreshSatellite').addEventListener('click', () => this.fetchSatelliteData());
    
    // Quick test button
    document.getElementById('quickTestBtn').addEventListener('click', () => this.runQuickTest());
  }

  initMethodTabs() {
    document.querySelectorAll('.analysis-method').forEach(tab => {
      tab.addEventListener('click', () => {
        const method = tab.getAttribute('data-method');
        this.switchMethod(method);
      });
    });
  }

  switchMethod(method) {
    this.currentMethod = method;
    
    // Update active tab styling
    document.querySelectorAll('.analysis-method').forEach(tab => {
      tab.classList.remove('active', 'text-green-600', 'dark:text-green-300', 'border-green-600');
      tab.classList.add('text-gray-500', 'dark:text-gray-400');
    });
    
    const activeTab = document.querySelector(`.analysis-method[data-method="${method}"]`);
    activeTab.classList.add('active', 'text-green-600', 'dark:text-green-300', 'border-green-600');
    activeTab.classList.remove('text-gray-500', 'dark:text-gray-400');
    
    // Show correct content
    document.querySelectorAll('.analysis-content').forEach(content => {
      content.classList.add('hidden');
    });
    document.getElementById(`${method}-method`).classList.remove('hidden');
  }

  checkARSupport() {
    if (!this.hasARSupport()) {
      document.getElementById('startAR').disabled = true;
      document.getElementById('startAR').innerHTML = `<i class="fas fa-exclamation-triangle mr-2"></i> <span data-i18n="soil.ar_not_supported">AR not supported</span>`;
    }
  }

  hasARSupport() {
    return 'xr' in navigator || 'webkitXR' in navigator;
  }

  async analyzePhoto(file) {
    if (!file) return;
    
    // Show loading state
    document.getElementById('photoResults').classList.remove('hidden');
    document.getElementById('photoRecommendation').textContent = i18next.t('soil.rec_loading');
    
    try {
      // Simulate AI analysis (replace with actual TensorFlow.js implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const soilTypes = ['Sandy', 'Loamy', 'Clay', 'Silty'];
      const randomType = soilTypes[Math.floor(Math.random() * soilTypes.length)];
      
      // Update UI
      document.getElementById('soilType').textContent = randomType;
      document.getElementById('soilHealth').textContent = this.getRandomHealth();
      
      // Generate recommendation
      this.generatePhotoRecommendation(randomType);
      
      // Update final recommendations
      this.updateFinalRecommendations();
      
    } catch (error) {
      console.error("Photo analysis error:", error);
      document.getElementById('photoRecommendation').textContent = i18next.t('soil.rec_error');
    }
  }

  getRandomHealth() {
    const healthLevels = ['Excellent', 'Good', 'Fair', 'Poor'];
    return healthLevels[Math.floor(Math.random() * healthLevels.length)];
  }

  generatePhotoRecommendation(soilType) {
    const recommendations = {
      Sandy: i18next.t('soil.rec_sandy'),
      Loamy: i18next.t('soil.rec_loamy'),
      Clay: i18next.t('soil.rec_clay'),
      Silty: i18next.t('soil.rec_silty')
    };
    
    document.getElementById('photoRecommendation').textContent = recommendations[soilType] || i18next.t('soil.rec_general');
  }

  startARScan() {
    if (!this.hasARSupport()) return;
    
    this.arActive = true;
    const arContainer = document.getElementById('arContainer');
    
    // Show AR instructions
    arContainer.innerHTML = `
      <div class="text-center p-4">
        <div class="ar-preview animate-pulse mb-3"></div>
        <p class="text-white" data-i18n="soil.ar_scanning">Scanning soil texture...</p>
      </div>
    `;
    
    // Simulate AR scan (in real app, use WebXR)
    setTimeout(() => {
      this.showARResults();
    }, 3000);
  }

  showARResults() {
    this.arActive = false;
    const arContainer = document.getElementById('arContainer');
    
    arContainer.innerHTML = `
      <div class="text-center p-4">
        <div class="text-green-500 text-4xl mb-2">
          <i class="fas fa-check-circle"></i>
        </div>
        <p class="text-white font-medium" data-i18n="soil.ar_complete">Analysis Complete</p>
      </div>
    `;
    
    document.getElementById('arResults').classList.remove('hidden');
    
    // Simulate results
    document.getElementById('compactionValue').textContent = 
      ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)];
    document.getElementById('drainageValue').textContent = 
      ['Poor', 'Average', 'Good'][Math.floor(Math.random() * 3)];
    
    // Update final recommendations
    this.updateFinalRecommendations();
  }

  async fetchSatelliteData() {
    if (!CONFIG.AGROMONITORING?.API_KEY) {
      this.showAlert(i18next.t('soil.api_not_configured'), 'error');
      return;
    }
    
    try {
      // Show loading
      const btn = document.getElementById('refreshSatellite');
      btn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> ${i18next.t('soil.loading')}`;
      btn.disabled = true;
      
      // Simulate API call (replace with actual Agromonitoring API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockData = {
        moisture: Math.floor(Math.random() * 100),
        temp: (Math.random() * 15 + 15).toFixed(1),
        ndvi: (Math.random() * 0.9).toFixed(2)
      };
      
      // Update UI
      document.getElementById('satMoisture').textContent = `${mockData.moisture}%`;
      document.getElementById('satTemp').textContent = `${mockData.temp}°C`;
      document.getElementById('satNDVI').textContent = mockData.ndvi;
      
      // Initialize map if not already done
      if (!this.satelliteMap) {
        this.initSatelliteMap();
      }
      
      // Update final recommendations
      this.updateFinalRecommendations();
      
    } catch (error) {
      console.error("Satellite data error:", error);
      this.showAlert(i18next.t('soil.api_error'), 'error');
    } finally {
      const btn = document.getElementById('refreshSatellite');
      btn.innerHTML = `<i class="fas fa-sync-alt mr-2"></i> ${i18next.t('soil.refresh_data')}`;
      btn.disabled = false;
    }
  }

  initSatelliteMap() {
    this.satelliteMap = L.map('satelliteMap').setView([-1.9403, 29.8739], 14);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.satelliteMap);
    
    // Add mock NDVI layer (in real app use Agromonitoring tiles)
    L.circle([-1.9403, 29.8739], {
      radius: 500,
      color: this.getNDVIColor(0.6),
      fillOpacity: 0.7
    }).addTo(this.satelliteMap);
  }

  getNDVIColor(value) {
    if (value < 0.3) return '#ff0000';
    if (value < 0.6) return '#ffff00';
    return '#00ff00';
  }

  runQuickTest() {
    // Run analysis based on current method
    switch(this.currentMethod) {
      case 'photo':
        document.getElementById('soilPhoto').click();
        break;
      case 'ar':
        if (this.hasARSupport()) this.startARScan();
        break;
      case 'satellite':
        this.fetchSatelliteData();
        break;
    }
  }

  updateFinalRecommendations() {
    const container = document.getElementById('finalRecommendations');
    
    // Get all available data
    const photoData = document.getElementById('photoResults').classList.contains('hidden') ? null : {
      type: document.getElementById('soilType').textContent,
      health: document.getElementById('soilHealth').textContent
    };
    
    const arData = document.getElementById('arResults').classList.contains('hidden') ? null : {
      compaction: document.getElementById('compactionValue').textContent,
      drainage: document.getElementById('drainageValue').textContent
    };
    
    const satelliteData = document.getElementById('satMoisture').textContent === '--%' ? null : {
      moisture: document.getElementById('satMoisture').textContent,
      temp: document.getElementById('satTemp').textContent,
      ndvi: document.getElementById('satNDVI').textContent
    };
    
    // Generate combined recommendations
    let recommendations = [];
    
    if (photoData) {
      recommendations.push(this.getPhotoRecommendation(photoData));
    }
    
    if (arData) {
      recommendations.push(this.getARRecommendation(arData));
    }
    
    if (satelliteData) {
      recommendations.push(this.getSatelliteRecommendation(satelliteData));
    }
    
    // Update UI
    if (recommendations.length === 0) {
      container.innerHTML = `
        <div class="flex items-start p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <div class="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
            <i class="fas fa-info-circle text-blue-600 dark:text-blue-300"></i>
          </div>
          <p class="dark:text-white">${i18next.t('soil.complete_analysis')}</p>
        </div>
      `;
    } else {
      container.innerHTML = recommendations.join('');
    }
  }

  getPhotoRecommendation(data) {
    return `
      <div class="flex items-start p-4 bg-green-50 dark:bg-green-900 rounded-lg mb-2">
        <div class="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-3">
          <i class="fas fa-camera text-green-600 dark:text-green-300"></i>
        </div>
        <div>
          <p class="font-medium dark:text-white mb-1">${i18next.t('soil.photo_results')}</p>
          <p class="dark:text-white text-sm">${this.generatePhotoRecommendation(data.type)}</p>
        </div>
      </div>
    `;
  }

  getARRecommendation(data) {
    let advice = '';
    if (data.compaction === 'High') {
      advice = i18next.t('soil.rec_high_compaction');
    } else if (data.drainage === 'Poor') {
      advice = i18next.t('soil.rec_poor_drainage');
    } else {
      advice = i18next.t('soil.rec_good_texture');
    }
    
    return `
      <div class="flex items-start p-4 bg-purple-50 dark:bg-purple-900 rounded-lg mb-2">
        <div class="bg-purple-100 dark:bg-purple-800 p-2 rounded-full mr-3">
          <i class="fas fa-vr-cardboard text-purple-600 dark:text-purple-300"></i>
        </div>
        <div>
          <p class="font-medium dark:text-white mb-1">${i18next.t('soil.ar_results')}</p>
          <p class="dark:text-white text-sm">${advice}</p>
        </div>
      </div>
    `;
  }

  getSatelliteRecommendation(data) {
    let advice = '';
    if (parseFloat(data.ndvi) < 0.4) {
      advice = i18next.t('soil.rec_low_ndvi');
    } else if (parseFloat(data.moisture) < 30) {
      advice = i18next.t('soil.rec_low_moisture');
    } else {
      advice = i18next.t('soil.rec_good_conditions');
    }
    
    return `
      <div class="flex items-start p-4 bg-blue-50 dark:bg-blue-900 rounded-lg mb-2">
        <div class="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
          <i class="fas fa-satellite text-blue-600 dark:text-blue-300"></i>
        </div>
        <div>
          <p class="font-medium dark:text-white mb-1">${i18next.t('soil.satellite_results')}</p>
          <p class="dark:text-white text-sm">${advice}</p>
        </div>
      </div>
    `;
  }

  showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'error' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
      type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
      'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    }`;
    alert.innerHTML = `
      <div class="flex items-center">
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'} mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
  }
}

// Initialize when tab is clicked
document.querySelector('[data-tab="soil-land"]').addEventListener('click', () => {
  if (!window.soilAnalysis) {
    window.soilAnalysis = new SoilLandAnalysis();
  }
});