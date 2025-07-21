// scripts/soil.js
class SoilAnalysis {
  constructor() {
    this.config = {
      // API endpoints (would be replaced with your actual backend endpoints)
      API_BASE_URL: '/api/soil',
      SATELLITE_API: '/api/satellite',
      IMAGE_API: '/api/analyze-image',
      AR_API: '/api/ar-analysis',
      
      // Default location (Rwanda coordinates)
      DEFAULT_LOCATION: {
        lat: -1.9403,
        lng: 29.8739,
        zoom: 12
      }
    };

    this.currentMethod = 'satellite';
    this.initElements();
    this.initMap();
    this.initEventListeners();
    this.checkARSupport();
  }

  initElements() {
    // Analysis method buttons
    this.satelliteBtn = document.getElementById('satelliteAnalysisBtn');
    this.photoBtn = document.getElementById('photoAnalysisBtn');
    this.arBtn = document.getElementById('arAnalysisBtn');

    // Satellite elements
    this.satelliteMap = L.map('satelliteMap');
    this.satelliteLoading = document.getElementById('satelliteLoading');

    // Photo elements
    this.photoInput = document.getElementById('soilPhotoInput');
    this.photoPreview = document.getElementById('soilPhotoPreview');
    this.photoPreviewContainer = document.getElementById('photoPreviewContainer');
    this.analyzePhotoBtn = document.getElementById('analyzePhotoBtn');

    // AR elements
    this.arViewContainer = document.getElementById('arViewContainer');
    this.startARBtn = document.getElementById('startARBtn');
    this.saveARDataBtn = document.getElementById('saveARDataBtn');
  }

  initMap() {
    this.satelliteMap.setView(
      [this.config.DEFAULT_LOCATION.lat, this.config.DEFAULT_LOCATION.lng],
      this.config.DEFAULT_LOCATION.zoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.satelliteMap);

    this.satelliteMap.whenReady(() => {
      this.satelliteLoading.style.display = 'none';
    });
  }

  initEventListeners() {
    // Method selection
    this.satelliteBtn.addEventListener('click', () => this.setActiveMethod('satellite'));
    this.photoBtn.addEventListener('click', () => this.setActiveMethod('photo'));
    this.arBtn.addEventListener('click', () => this.setActiveMethod('ar'));

    // Satellite
    document.getElementById('fetchSatelliteData').addEventListener('click', () => this.fetchSatelliteData());

    // Photo
    this.photoInput.addEventListener('change', (e) => this.handlePhotoUpload(e));
    this.analyzePhotoBtn.addEventListener('click', () => this.analyzeSoilPhoto());

    // AR
    this.startARBtn.addEventListener('click', () => this.startARScan());
    this.saveARDataBtn.addEventListener('click', () => this.saveARData());
  }

  setActiveMethod(method) {
    this.currentMethod = method;
    
    // Update UI
    [this.satelliteBtn, this.photoBtn, this.arBtn].forEach(btn => {
      btn.classList.remove('bg-indigo-600', 'bg-green-600', 'bg-purple-600');
      btn.classList.add('bg-gray-600');
    });

    switch(method) {
      case 'satellite':
        this.satelliteBtn.classList.remove('bg-gray-600');
        this.satelliteBtn.classList.add('bg-indigo-600');
        break;
      case 'photo':
        this.photoBtn.classList.remove('bg-gray-600');
        this.photoBtn.classList.add('bg-green-600');
        break;
      case 'ar':
        this.arBtn.classList.remove('bg-gray-600');
        this.arBtn.classList.add('bg-purple-600');
        break;
    }
  }

  async fetchSatelliteData() {
    try {
      this.satelliteLoading.style.display = 'flex';
      
      const response = await fetch(`${this.config.SATELLITE_API}?lat=${this.config.DEFAULT_LOCATION.lat}&lng=${this.config.DEFAULT_LOCATION.lng}`);
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      this.displaySatelliteData(data);
    } catch (error) {
      console.error('Satellite data error:', error);
      this.showError('Failed to fetch satellite data');
    } finally {
      this.satelliteLoading.style.display = 'none';
    }
  }

  displaySatelliteData(data) {
    // Process and display satellite data on the map
    if (data.ndvi) {
      const ndviLayer = L.geoJSON(data.ndvi, {
        style: (feature) => ({
          fillColor: this.getNdviColor(feature.properties.value),
          weight: 1,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7
        })
      }).addTo(this.satelliteMap);
      
      this.satelliteMap.fitBounds(ndviLayer.getBounds());
    }

    // Update soil dashboard with satellite data
    this.updateSoilDashboard(data.soil);
  }

  getNdviColor(value) {
    // Convert NDVI value (-1 to 1) to color
    const normalized = (value + 1) / 2; // Convert to 0-1 range
    const hue = normalized * 120; // 0 (red) to 120 (green)
    return `hsl(${hue}, 100%, 50%)`;
  }

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.photoPreview.src = e.target.result;
      this.photoPreview.classList.remove('hidden');
      this.photoPreviewContainer.querySelector('label').classList.add('hidden');
      this.analyzePhotoBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  async analyzeSoilPhoto() {
    try {
      this.analyzePhotoBtn.disabled = true;
      this.analyzePhotoBtn.innerHTML = '<span class="loader-button">Analyzing...</span>';

      const formData = new FormData();
      formData.append('soilImage', this.photoInput.files[0]);

      const response = await fetch(this.config.IMAGE_API, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      this.updateSoilDashboard(result);
      
    } catch (error) {
      console.error('Photo analysis error:', error);
      this.showError('Failed to analyze photo');
    } finally {
      this.analyzePhotoBtn.disabled = false;
      this.analyzePhotoBtn.innerHTML = '<span data-i18n="soil.analyze_photo">Analyze Photo</span>';
    }
  }

  checkARSupport() {
    if (!this.isARSupported()) {
      this.arBtn.disabled = true;
      this.arBtn.title = 'AR not supported on this device';
      this.startARBtn.disabled = true;
      this.startARBtn.textContent = 'AR Not Supported';
    }
  }

  isARSupported() {
    return 'xr' in navigator && navigator.xr.isSessionSupported('immersive-ar');
  }

  async startARScan() {
    try {
      this.startARBtn.disabled = true;
      this.startARBtn.innerHTML = '<span class="loader-button">Starting AR...</span>';

      // Initialize AR (simplified - actual implementation would use WebXR)
      this.arSession = await this.initAR();
      
      // For demo purposes, we'll simulate AR data
      setTimeout(() => {
        this.simulateARData();
      }, 2000);
      
    } catch (error) {
      console.error('AR error:', error);
      this.showError('Failed to start AR session');
      this.startARBtn.disabled = false;
      this.startARBtn.innerHTML = '<i class="fas fa-play mr-2"></i><span data-i18n="soil.start_ar">Start AR</span>';
    }
  }

  async initAR() {
    // In a real implementation, this would initialize WebXR
    return new Promise((resolve) => {
      // Simulate AR initialization
      this.arViewContainer.innerHTML = '<div class="ar-simulation"></div>';
      resolve({});
    });
  }

  simulateARData() {
    // Simulate AR scan results
    this.startARBtn.style.display = 'none';
    this.saveARDataBtn.disabled = false;
    
    // Display simulated AR data
    this.arViewContainer.innerHTML = `
      <div class="ar-result">
        <div class="ar-grid"></div>
        <div class="ar-data">
          <p>Soil Moisture: <strong>35%</strong></p>
          <p>Soil Type: <strong>Loamy</strong></p>
          <p>Organic Matter: <strong>4.2%</strong></p>
        </div>
      </div>
    `;
  }

  async saveARData() {
    try {
      this.saveARDataBtn.disabled = true;
      this.saveARDataBtn.innerHTML = '<span class="loader-button">Saving...</span>';

      // In a real app, this would send AR scan data to your backend
      const response = await fetch(this.config.AR_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moisture: 35,
          soilType: 'loamy',
          organicMatter: 4.2
        })
      });

      const result = await response.json();
      this.updateSoilDashboard(result);
      
      // Reset AR view
      this.arViewContainer.innerHTML = '';
      this.startARBtn.style.display = 'block';
      this.startARBtn.disabled = false;
      this.startARBtn.innerHTML = '<i class="fas fa-play mr-2"></i><span data-i18n="soil.start_ar">Start AR</span>';
      this.saveARDataBtn.disabled = true;
      
    } catch (error) {
      console.error('Save AR error:', error);
      this.showError('Failed to save AR data');
      this.saveARDataBtn.disabled = false;
      this.saveARDataBtn.innerHTML = '<span data-i18n="soil.save_scan">Save Scan</span>';
    }
  }

  updateSoilDashboard(data) {
    if (!data) return;
    
    // Update pH value and bar
    if (data.ph) {
      document.getElementById('phValue').textContent = data.ph.toFixed(1);
      document.getElementById('phBar').style.width = `${(data.ph / 14) * 100}%`;
    }
    
    // Update moisture value and bar
    if (data.moisture) {
      document.getElementById('moistureValue').textContent = `${(data.moisture * 100).toFixed(0)}%`;
      document.getElementById('moistureBar').style.width = `${data.moisture * 100}%`;
    }
    
    // Update recommendations
    if (data.recommendations) {
      const recommendationsContainer = document.getElementById('recommendations');
      recommendationsContainer.innerHTML = data.recommendations
        .map(rec => `
          <div class="flex items-start">
            <div class="bg-green-100 dark:bg-green-900 p-1 rounded-full mr-2 mt-1">
              <i class="fas fa-seedling text-green-600 dark:text-green-300 text-xs"></i>
            </div>
            <span>${rec}</span>
          </div>
        `)
        .join('');
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4';
    errorDiv.innerHTML = `<p>${message}</p>`;
    document.getElementById('soil-land-tab').prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('soil-land-tab')) {
    new SoilAnalysis();
  }
});