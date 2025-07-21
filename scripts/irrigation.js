// Irrigation Advisor using AgroMonitoring API
class IrrigationAdvisor {
  constructor() {
    this.fieldId = 'user_field_id'; // Should be set from user profile
    this.initMap();
    this.loadIrrigationData();
  }

  initMap() {
    this.fieldMap = L.map('irrigationFieldMap').setView([-1.9403, 29.8739], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.fieldMap);
    
    // Add NDVI layer from AgroMonitoring
    const ndviLayer = L.tileLayer(
      `${CONFIG.AGROMONITORING.ENDPOINTS.NDVI}/tiles/{z}/{x}/{y}?appid=${CONFIG.AGROMONITORING.API_KEY}&polyid=${this.fieldId}`
    );
    ndviLayer.addTo(this.fieldMap);
  }

  async loadIrrigationData() {
    try {
      const [moistureData, ndviData, weatherData] = await Promise.all([
        this.fetchSoilData(),
        this.fetchNDVIData(),
        this.fetchWeatherData()
      ]);
      
      this.updateUI(moistureData, ndviData, weatherData);
    } catch (error) {
      console.error("Error loading irrigation data:", error);
    }
  }

  async fetchSoilData() {
    const response = await fetch(
      `${CONFIG.AGROMONITORING.ENDPOINTS.SOIL}?polyid=${this.fieldId}&appid=${CONFIG.AGROMONITORING.API_KEY}`
    );
    return await response.json();
  }

  // Other methods...
}