// scripts/app/charts.js
function initializeCharts() {
  // Helper function for RWF formatting
  function formatRWF(value) {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      maximumFractionDigits: 0
    }).format(value);
  }

  // ==============================================
  // 1. ENHANCED NDVI TREND CHART (With Filters)
  // ==============================================
  const ndviChart = new Chart(document.getElementById('ndviTrendChart'), {
    type: 'line',
    data: {
      labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
      datasets: [{
        label: 'NDVI',
        data: Array.from({length: 30}, () => Math.random() * 0.3 + 0.5),
        borderColor: '#4dff88',
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.1,
        fill: {
          target: 'origin',
          above: 'rgba(77, 255, 136, 0.1)'
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `NDVI: ${ctx.parsed.y.toFixed(2)}`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 1,
          ticks: {
            callback: (value) => {
              if (value < 0.3) return `${value} (Poor)`;
              if (value < 0.6) return `${value} (Fair)`;
              if (value < 0.8) return `${value} (Good)`;
              return `${value} (Excellent)`;
            }
          }
        }
      }
    }
  });

  // Add NDVI filter buttons
  document.getElementById('ndviWeekFilter')?.addEventListener('click', () => {
    ndviChart.data.labels = Array.from({length: 7}, (_, i) => `Day ${i+1}`);
    ndviChart.update();
  });
  
  document.getElementById('ndviMonthFilter')?.addEventListener('click', () => {
    ndviChart.data.labels = Array.from({length: 30}, (_, i) => `Day ${i+1}`);
    ndviChart.update();
  });

  // ==============================================
  // 2. ENHANCED PRODUCTION CHART (With Export)
  // ==============================================
  const productionChart = new Chart(document.getElementById('cropProductionChart'), {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Maize',
          data: [320, 450, 380, 510, 490, 620],
          backgroundColor: '#10B981',
          borderColor: '#0E9F6E',
          borderWidth: 1
        },
        {
          label: 'Beans',
          data: [120, 180, 150, 210, 190, 230],
          backgroundColor: '#3B82F6',
          borderColor: '#2563EB',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} kg`
          }
        }
      },
      scales: {
        y: { 
          beginAtZero: true,
          title: { display: true, text: 'Kilograms (kg)' }
        }
      }
    }
  });

  // Export button for production data
  document.getElementById('exportProductionBtn')?.addEventListener('click', () => {
    const data = {
      labels: productionChart.data.labels,
      datasets: productionChart.data.datasets.map(d => ({
        crop: d.label,
        values: d.data
      }))
    };
    console.log('Exporting:', data);
    alert('Data prepared for export (check console)');
  });

  // ==============================================
  // 3. ENHANCED COST ANALYSIS CHART (Mobile Optimized)
  // ==============================================
  const costCtx = document.getElementById('cropCostChart')?.getContext('2d');
  if (costCtx) {
    const costChart = new Chart(costCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Labor',
            data: [45000, 48000, 52000, 55000, 58000, 60000],
            backgroundColor: '#F59E0B',
            stack: 'costs'
          },
          {
            label: 'Inputs',
            data: [35000, 38000, 40000, 42000, 45000, 48000],
            backgroundColor: '#10B981',
            stack: 'costs'
          },
          {
            label: 'Equipment',
            data: [25000, 28000, 30000, 32000, 35000, 38000],
            backgroundColor: '#3B82F6',
            stack: 'costs'
          },
          {
            label: 'Other',
            data: [15000, 18000, 20000, 22000, 25000, 28000],
            backgroundColor: '#EF4444',
            stack: 'costs'
          },
          {
            label: 'Revenue',
            data: [250000, 300000, 280000, 350000, 320000, 400000],
            backgroundColor: '#8B5CF6',
            type: 'line',
            borderColor: '#7C3AED',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: window.innerWidth < 768 ? 'bottom' : 'top',
            labels: { boxWidth: 12 }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatRWF(ctx.parsed.y)}`,
              footer: (items) => {
                const costs = items.filter(i => i.dataset.stack === 'costs');
                const revenueItem = items.find(i => i.dataset.label === 'Revenue');
                if (costs.length && revenueItem) {
                  const totalCost = costs.reduce((sum, i) => sum + i.parsed.y, 0);
                  const profit = revenueItem.parsed.y - totalCost;
                  return [
                    '──────────',
                    `Total Costs: ${formatRWF(totalCost)}`,
                    `Profit: ${formatRWF(profit)}`
                  ];
                }
              }
            }
          }
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: { callback: formatRWF }
          }
        }
      }
    });

    // Mobile responsiveness
    window.addEventListener('resize', () => {
      costChart.options.plugins.legend.position = window.innerWidth < 768 ? 'bottom' : 'top';
      costChart.update();
    });
  }

  // ==============================================
  // 4. LIVESTOCK CHARTS (Weight and Milk Production)
  // ==============================================
  function initializeLivestockCharts() {
    // Weight Tracking Chart
    const weightCtx = document.getElementById('livestockWeightChart');
    if (weightCtx) {
      new Chart(weightCtx.getContext('2d'), {
        type: 'line',
        data: {
          labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
          datasets: [{
            label: 'Average Weight (kg)',
            data: Array.from({length: 30}, () => Math.floor(Math.random() * 50) + 450),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} kg`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: { display: true, text: 'Weight (kg)' }
            }
          }
        }
      });
    }

    // Milk Production Chart
    const milkCtx = document.getElementById('milkProductionChart');
    if (milkCtx) {
      new Chart(milkCtx.getContext('2d'), {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Milk Production (L)',
            data: [18, 17, 19, 18, 20, 19, 17],
            backgroundColor: '#3b82f6',
            borderColor: '#3b82f6',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} L`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Liters (L)' }
            }
          }
        }
      });
    }

    // Time range selectors
    document.getElementById('weightTimeRange')?.addEventListener('change', function() {
      console.log('Weight time range changed to:', this.value);
      // In a real app, update chart data here
    });

    document.getElementById('milkTimeRange')?.addEventListener('change', function() {
      console.log('Milk time range changed to:', this.value);
      // In a real app, update chart data here
    });
  }

  // Initialize livestock charts when tab is shown
  const livestockObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.target.id === 'livestockContent' && !mutation.target.classList.contains('hidden')) {
        initializeLivestockCharts();
      }
    });
  });

  const livestockContent = document.getElementById('livestockContent');
  if (livestockContent) {
    livestockObserver.observe(livestockContent, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

document.addEventListener('DOMContentLoaded', initializeCharts);