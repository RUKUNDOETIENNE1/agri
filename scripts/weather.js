// scripts/weather.js
const WEATHER_CONDITIONS = {
  Clear: {
    en: "Sunny",
    rw: "Izuba",
    fr: "Ensoleillé",
    icon: "sun"
  },
  Clouds: {
    en: "Cloudy",
    rw: "Amarira",
    fr: "Nuageux",
    icon: "cloud"
  },
  Rain: {
    en: "Rainy",
    rw: "Imvura",
    fr: "Pluvieux",
    icon: "cloud-rain"
  },
  Thunderstorm: {
    en: "Stormy",
    rw: "Inkuba",
    fr: "Orageux",
    icon: "bolt"
  },
  Snow: {
    en: "Snowy",
    rw: "Ifupi",
    fr: "Neigeux",
    icon: "snowflake"
  }
};

async function fetch5DayForecast(location = "Kigali") {
  const lang = document.documentElement.lang || 'en';
  const cacheKey = `weather_${location.toLowerCase()}_${lang}`;
  
  // Check cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 30 * 60 * 1000) return data; // 30 min cache
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=YOUR_API_KEY&units=metric&cnt=40&lang=${lang}`
    );
    
    if (!response.ok) throw new Error("API Error");
    
    const data = await response.json();
    const processed = process5DayData(data, lang);
    
    localStorage.setItem(cacheKey, JSON.stringify({
      data: processed,
      timestamp: Date.now()
    }));
    
    return processed;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

function process5DayData(apiData, lang) {
  const dailyData = {};
  
  apiData.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const weekday = date.toLocaleDateString([], { weekday: 'short' });
    
    if (!dailyData[dateKey]) {
      const condition = item.weather[0].main;
      const translation = WEATHER_CONDITIONS[condition] || { 
        en: condition, 
        rw: condition, 
        fr: condition,
        icon: "cloud"
      };
      
      dailyData[dateKey] = {
        date: dateKey,
        weekday,
        temp: Math.round(item.main.temp),
        condition: translation[lang] || translation.en,
        icon: translation.icon,
        precip: Math.round(item.pop * 100),
        humidity: item.main.humidity,
        wind: Math.round(item.wind.speed * 3.6) // Convert to km/h
      };
    }
  });
  
  return Object.values(dailyData).slice(0, 5); // Return 5 days
}