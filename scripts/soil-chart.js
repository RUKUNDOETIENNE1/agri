document.addEventListener('DOMContentLoaded', function() {
  initializeSoilChart();
});

let soilHistoryChart;

function initializeSoilChart() {
  const ctx = document.getElementById('soilHistoryChart').getContext('2d');
  
  // Default dataset (will update when language changes)
  const datasets = [{
    translationKey: 'soil_ph_dataset_label', // Key for translations
    data: [5.8, 5.9, 6.0, 6.1, 6.2, 6.1],
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    fill: true
  },
  
  {
  translationKey: 'nitrogen_dataset_label',
  data: [2.1, 2.3, 2.4, 2.6, 2.8, 3.0],
  borderColor: '#10B981',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  fill: true
}
  
];
  
  soilHistoryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: translations[currentLanguage].soil_ph_chart_title
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: translations[currentLanguage].soil_ph_dataset_label
          }
        }
      }
    }
  });
}

// Call this when language changes
function updateSoilChartLanguage() {
  if (soilHistoryChart) {
    // Update title
    soilHistoryChart.options.plugins.title.text = translations[currentLanguage].soil_ph_chart_title;
    
    // Update dataset label
    soilHistoryChart.data.datasets[0].label = translations[currentLanguage][soilHistoryChart.data.datasets[0].translationKey];
    
    // Update Y-axis label
    soilHistoryChart.options.scales.y.title.text = translations[currentLanguage][soilHistoryChart.data.datasets[0].translationKey];
    
    soilHistoryChart.update();
  }
}