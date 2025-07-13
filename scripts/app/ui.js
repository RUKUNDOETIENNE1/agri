// scripts/app/ui.js
// Weather Icons Mapping
const WEATHER_ICONS = {
  '01d': 'sun',           // Clear sky (day)
  '01n': 'moon',          // Clear sky (night)
  '02': 'cloud-sun',      // Few clouds
  '03': 'cloud',          // Scattered clouds
  '04': 'cloud',          // Broken clouds
  '09': 'cloud-rain',     // Shower rain
  '10': 'cloud-showers-heavy', // Rain
  '11': 'bolt',           // Thunderstorm
  '13': 'snowflake',      // Snow
  '50': 'smog'            // Mist
};

// DOM Elements
const elements = {
  weatherContainer: document.querySelector('.weather-container'),
  currentCard: document.querySelector('.weather-current'),
  forecastCards: document.querySelectorAll('.weather-forecast-card')
};

// Main Weather Update Function
async function updateWeatherUI(location = "Kigali") {
  try {
    const rawData = await fetchWeather(location);
    const weather = processWeatherData(rawData);
    
    if (!weather) {
      showWeatherError("Data unavailable");
      return;
    }

    updateCurrentWeather(weather.current);
    updateForecast(weather.forecast);

  } catch (error) {
    console.error("Weather update failed:", error);
    showWeatherError("Connection failed");
  }
}

function updateCurrentWeather(data) {
  if (!elements.currentCard || !data) return;
  
  elements.currentCard.innerHTML = `
    <p class="font-medium dark:text-white">Today</p>
    <i class="fas fa-${getWeatherIconClass(data.icon)} text-4xl my-3 ${getIconColorClass(data.icon)}"></i>
    <p class="text-3xl font-bold dark:text-white">${data.temp}°C</p>
    <p class="text-sm uppercase tracking-wider dark:text-gray-300">${data.condition}</p>
    <div class="mt-2 text-xs space-y-1">
      <p class="text-gray-500 dark:text-gray-400">Humidity: ${data.humidity}%</p>
      <p class="text-gray-500 dark:text-gray-400">Wind: ${data.wind} km/h</p>
      <p class="text-gray-500 dark:text-gray-400">Precip: ${data.precip}%</p>
    </div>
  `;
}

function updateForecast(forecastData) {
  if (!elements.forecastCards || !forecastData) return;

  elements.forecastCards.forEach((card, index) => {
    const day = forecastData[index];
    if (!day) return;

    const dayName = new Date(day.date).toLocaleDateString([], { weekday: 'short' });
    
    card.innerHTML = `
      <p class="font-medium dark:text-white">${dayName}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">${day.date.split('/')[0]}</p>
      <i class="fas fa-${getWeatherIconClass(day.icon)} text-2xl my-2 ${getIconColorClass(day.icon)}"></i>
      <p class="text-xl font-bold dark:text-white">${day.temp}°C</p>
      <p class="text-xs text-gray-500 dark:text-gray-400">${day.condition}</p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">💧 ${day.precip}%</p>
    `;
  });
}

// Helper Functions
function getWeatherIconClass(iconCode) {
  const prefix = iconCode.substring(0, 2);
  return WEATHER_ICONS[prefix] || WEATHER_ICONS[iconCode] || 'cloud';
}

function getIconColorClass(iconCode) {
  const colorMap = {
    '01': 'text-yellow-400',    // Sun
    '02': 'text-amber-300',     // Cloud-sun
    '03': 'text-gray-400',      // Cloud
    '10': 'text-blue-400',      // Rain
    '11': 'text-yellow-300',    // Thunder
    '13': 'text-blue-200'       // Snow
  };
  return colorMap[iconCode.substring(0, 2)] || 'text-gray-500';
}

function showWeatherError(message) {
  if (!elements.weatherContainer) return;
  
  elements.weatherContainer.innerHTML = `
    <div class="weather-error text-center py-8">
      <i class="fas fa-exclamation-triangle text-red-400 text-3xl mb-2"></i>
      <p class="text-red-500 mb-3">${message}</p>
      <button onclick="updateWeatherUI()" class="retry-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
        <i class="fas fa-sync-alt mr-2"></i>Retry
      </button>
    </div>
  `;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateWeatherUI();
  
  // Search functionality
  document.querySelector('#weather-search button')?.addEventListener('click', () => {
    const location = document.querySelector('#weather-search input')?.value;
    if (location) updateWeatherUI(location);
  });
});