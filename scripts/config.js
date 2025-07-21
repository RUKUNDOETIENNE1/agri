// API Configuration
const API_CONFIG = {
  // OpenWeatherMap Configuration
  OPEN_WEATHER: {
    KEY: "e784c84bbfdb662f5831fbb9c4116e7d",
    BASE_URL: "https://api.openweathermap.org/data/2.5",
    UNITS: "metric", // Celsius
    EXCLUDE: "minutely,hourly", // Only need daily
    LANGUAGE: "en"
  },



  // Agromonitoring Configuration
  AGROMONITORING: {
    API_KEY: '66d91cd9632d58925cef54e5f5b00ab7',
    ENDPOINTS: {
      SOIL: 'https://api.agromonitoring.com/agro/1.0/soil',
      NDVI: 'https://api.agromonitoring.com/agro/1.0/ndvi',
      WEATHER: 'https://api.agromonitoring.com/agro/1.0/weather'
    }
  },

  // TensorFlow Model Configuration
  TENSORFLOW: {
    PEST_MODEL_URL: '/models/pest_detection/model.json'
  },

  // ======================
  // DEFAULT FARM LOCATION
  // ======================
  DEFAULT_LOCATION: {
    LAT: -1.9403, // Kigali latitude
    LNG: 29.8739  // Kigali longitude
  },

  // ======================
  // CROP SETTINGS 
  // ======================
  SUPPORTED_CROPS: [
    { id: 'maize', name: 'Maize' },
    { id: 'wheat', name: 'Wheat' },
    { id: 'beans', name: 'Beans' }
    /* Add more crops as needed:
       { id: 'coffee', name: 'Coffee' } */
  ]
};

/* Configuration Instructions:
   1. Replace 'your_agromonitoring_api_key' with your actual AgroMonitoring API key
   2. Update DEFAULT_LOCATION to your farm's coordinates
   3. Add/remove crops in SUPPORTED_CROPS list
   4. OpenWeatherMap API key is already included */

   // config.js
const OPENAI_API_KEY = 'your-api-key-here'; // Keep this secure
const OPENAI_ORGANIZATION = 'your-org-id'; // Optional