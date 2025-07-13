document.addEventListener('DOMContentLoaded', function() {
  // Initialize market data
  initializeMarketTab();
});

function initializeMarketTab() {
  const fetchMarketBtn = document.getElementById('fetchMarket');
  if (fetchMarketBtn) {
    fetchMarketBtn.addEventListener('click', fetchMarketData);
  }
  
  // Load initial data if market tab is active
  if (document.getElementById('market-tab')?.classList.contains('active')) {
    fetchMarketData();
  }
}

function fetchMarketData() {
  const loader = document.getElementById('marketLoader');
  const results = document.getElementById('marketResults');
  const commoditySelect = document.getElementById('marketCommodity');
  
  if (!loader || !results || !commoditySelect) {
    console.error('Market elements not found');
    return;
  }

  const commodity = commoditySelect.value;
  if (!commodity) return;

  loader.classList.remove('hidden');
  results.classList.add('hidden');
  
  // Simulate API call
  setTimeout(() => {
    try {
      updateMarketData(commodity);
      loader.classList.add('hidden');
      results.classList.remove('hidden');
    } catch (error) {
      console.error('Market data error:', error);
      loader.classList.add('hidden');
      showMarketError();
    }
  }, 1500);
}

function updateMarketData(commodity) {
  const tbody = document.getElementById('marketData');
  if (!tbody) return;

  // Sample data - replace with real API call
  const marketData = {
    maize: [
      { 
        market: "market_kigali", 
        price: 450, 
        trend: "up", 
        change: 5, 
        distance: 5,
        unit: "kg"
      },
      { 
        market: "market_musanze", 
        price: 430, 
        trend: "down", 
        change: 3, 
        distance: 25,
        unit: "kg"
      }
    ],
    beans: [
      { 
        market: "market_kigali", 
        price: 600, 
        trend: "stable", 
        change: 0, 
        distance: 5,
        unit: "kg"
      }
    ]
  };

  const data = marketData[commodity] || [];
  renderMarketTable(data, tbody);
  
  // Update translations for new content
  if (window.translatePage) {
    translatePage(currentLanguage);
  }
}

function renderMarketTable(data, tbody) {
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr class="bg-white dark:bg-gray-800">
        <td colspan="4" class="px-4 py-2 text-center text-sm dark:text-white" data-i18n="no_market_data">
          ${window.getTranslation ? getTranslation("no_market_data") : "No data available"}
        </td>
      </tr>
    `;
    return;
  }

  data.forEach(item => {
    const row = document.createElement('tr');
    row.className = 'bg-white dark:bg-gray-800';
    row.innerHTML = `
      <td class="px-4 py-2 whitespace-nowrap text-sm dark:text-white" data-i18n="${item.market}">
        ${window.getTranslation ? getTranslation(item.market) : item.market}
      </td>
      <td class="px-4 py-2 whitespace-nowrap text-sm dark:text-white">
        ${window.formatCurrency ? formatCurrency(item.price) : item.price}/${window.getTranslation ? getTranslation(item.unit) : item.unit}
      </td>
      <td class="px-4 py-2 whitespace-nowrap text-sm dark:text-white">
        <span class="${getTrendColor(item.trend)} flex items-center">
          <i class="fas ${getTrendIcon(item.trend)} mr-1"></i>
          <span data-i18n="trend_${item.trend}">
            ${formatTrendValue(item.trend, item.change)}
          </span>
        </span>
      </td>
      <td class="px-4 py-2 whitespace-nowrap text-sm dark:text-white">
        ${item.distance} <span data-i18n="km">${window.getTranslation ? getTranslation("km") : "km"}</span>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Helper functions (keep these exactly as-is)
function getTrendColor(trend) {
  return {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-yellow-500'
  }[trend] || 'text-gray-500';
}

function getTrendIcon(trend) {
  return {
    up: 'fa-arrow-up',
    down: 'fa-arrow-down',
    stable: 'fa-equals'
  }[trend] || 'fa-info-circle';
}

function formatTrendValue(trend, change) {
  return trend === 'up' ? `+${change}%` : 
         trend === 'down' ? `-${change}%` : 
         `±${change}%`;
}

function showMarketError() {
  const tbody = document.getElementById('marketData');
  if (tbody) {
    tbody.innerHTML = `
      <tr class="bg-white dark:bg-gray-800">
        <td colspan="4" class="px-4 py-2 text-center text-sm text-red-500 dark:text-red-300" data-i18n="market_error">
          ${window.getTranslation ? getTranslation("market_error") : "Failed to load market data"}
        </td>
      </tr>
    `;
    if (window.translatePage) translatePage(currentLanguage);
  }
}