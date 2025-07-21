// Main Crop Management Controller
class CropManagement {
  constructor() {
    this.initModals();
    this.initCharts();
    this.initIrrigationAdvisor();
    this.initEventListeners();
  }

  initModals() {
    // New Crop Modal
    document.getElementById('newCropBtn').addEventListener('click', () => {
      document.getElementById('newCropModal').classList.remove('hidden');
    });

    // Pest Scan Modal
    document.getElementById('scanPestBtn').addEventListener('click', () => {
      document.getElementById('pestScanModal').classList.remove('hidden');
    });

    // File upload handling
    document.getElementById('pestPhoto').addEventListener('change', (e) => {
      this.handlePestImageUpload(e.target.files[0]);
    });
  }

  initCharts() {
    // Crop Health Chart
    this.cropHealthChart = new Chart(
      document.getElementById('cropHealthChart'),
      {
        type: 'line',
        data: {
          labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
          datasets: [{
            label: 'Health Index',
            data: Array.from({length: 30}, () => Math.random() * 0.5 + 0.5),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 1
            }
          }
        }
      }
    );

    // Planting Calendar (using FullCalendar or similar)
    this.initPlantingCalendar();
  }

  initIrrigationAdvisor() {
    this.irrigationAdvisor = new IrrigationAdvisor();
  }

  initEventListeners() {
    // Time range selector
    document.getElementById('cropHealthTimeRange').addEventListener('change', (e) => {
      this.updateChartTimeRange(e.target.value);
    });

    // Analyze pest button
    document.getElementById('analyzePest').addEventListener('click', () => {
      this.analyzePestImage();
    });
  }

  // Other methods...
}

// Initialize when tab is activated
document.addEventListener('DOMContentLoaded', () => {
  const tabObserver = new MutationObserver((mutations) => {
    if (document.getElementById('crop-management-tab').classList.contains('active')) {
      new CropManagement();
      tabObserver.disconnect();
    }
  });
  tabObserver.observe(document.getElementById('crop-management-tab'), { 
    attributes: true, 
    attributeFilter: ['class'] 
  });
});