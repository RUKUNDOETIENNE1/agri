// Initialize i18next
i18next
  .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: false,
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json'
    }
  }, function(err, t) {
    updateContent();
  });

// Update content when language changes
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18next.t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', i18next.t(key));
  });
}

// Language switcher
document.getElementById('languageToggle').addEventListener('change', (e) => {
  i18next.changeLanguage(e.target.value).then(updateContent);
});

// Subtabs Navigation
function switchSubtab(subtabId) {
  document.querySelectorAll('.subtab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.classList.remove('border-b-2', 'border-green-500', 'text-green-600', 'dark:text-green-300');
    btn.classList.add('text-gray-500', 'dark:text-gray-400');
  });
  
  document.getElementById(`${subtabId}-subtab`).classList.add('active');
  const activeBtn = document.querySelector(`.subtab-btn[data-subtab="${subtabId}"]`);
  activeBtn.classList.add('border-b-2', 'border-green-500', 'text-green-600', 'dark:text-green-300');
  activeBtn.classList.remove('text-gray-500', 'dark:text-gray-400');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Set up subtab buttons
  document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchSubtab(btn.dataset.subtab));
  });
  
  // Initialize charts
  initLivestockCharts();
  
  // Load livestock records
  loadLivestockData();
});

// Initialize Charts
function initLivestockCharts() {
  // Health Chart
  const healthCtx = document.getElementById('healthChart').getContext('2d');
  new Chart(healthCtx, {
    type: 'doughnut',
    data: {
      labels: [
        i18next.t('livestock.healthy'),
        i18next.t('livestock.sick'),
        i18next.t('livestock.needs_checkup')
      ],
      datasets: [{
        data: [18, 2, 4],
        backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      plugins: { 
        legend: { 
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        } 
      }
    }
  });

  // Milk Daily Chart
  const milkDailyCtx = document.getElementById('milkDailyChart').getContext('2d');
  new Chart(milkDailyCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: i18next.t('livestock.liters'),
        data: [18, 17, 19, 20, 18, 17, 21],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: { 
        y: { 
          beginAtZero: false,
          title: {
            display: true,
            text: i18next.t('livestock.liters')
          }
        } 
      }
    }
  });

  // Milk Quality Chart
  const milkQualityCtx = document.getElementById('milkQualityChart').getContext('2d');
  new Chart(milkQualityCtx, {
    type: 'bar',
    data: {
      labels: [
        i18next.t('livestock.fat'),
        i18next.t('livestock.protein'),
        i18next.t('livestock.scc')
      ],
      datasets: [{
        label: i18next.t('livestock.average'),
        data: [3.8, 3.2, 210],
        backgroundColor: ['#8B5CF6', '#EC4899', '#10B981']
      }]
    },
    options: {
      responsive: true,
      scales: { 
        y: { 
          beginAtZero: true,
          title: {
            display: true,
            text: i18next.t('livestock.value')
          }
        } 
      }
    }
  });
}

// Load Livestock Data from API
async function loadLivestockData() {
  try {
    // Try to load from RAB API first
    const response = await fetch('https://api.rab.gov.rw/livestock', {
      headers: {
        'Authorization': 'Bearer YOUR_RAB_API_KEY'
      }
    });
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    populateLivestockTable(data);
    updateLivestockSummary(data);
    
  } catch (error) {
    console.error('Error fetching livestock data:', error);
    // Fallback to mock data
    const mockData = [
      { id: '245', type: 'Dairy Cow', breed: 'Friesian', age: '3 years', lastCheckup: '2023-11-15', status: 'Healthy' },
      { id: '312', type: 'Beef Cattle', breed: 'Ankole', age: '2 years', lastCheckup: '2023-11-10', status: 'Sick' },
      { id: '478', type: 'Goat', breed: 'Boer', age: '1 year', lastCheckup: '2023-11-05', status: 'Healthy' }
    ];
    populateLivestockTable(mockData);
    updateLivestockSummary(mockData);
  }
}

function populateLivestockTable(data) {
  const tableBody = document.getElementById('livestockRecords');
  tableBody.innerHTML = ''; // Clear existing rows
  
  data.forEach(animal => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-4 py-2 dark:text-white">${animal.id}</td>
      <td class="px-4 py-2 dark:text-white">${i18next.t(`livestock.${animal.type.toLowerCase().replace(' ', '_')}`)}</td>
      <td class="px-4 py-2 dark:text-white">${animal.breed}</td>
      <td class="px-4 py-2 dark:text-white">${animal.age}</td>
      <td class="px-4 py-2 dark:text-white">${animal.lastCheckup}</td>
      <td class="px-4 py-2">
        <span class="px-2 py-1 text-xs rounded-full ${
          animal.status === 'Healthy' ? 
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }">
          ${i18next.t(`livestock.${animal.status.toLowerCase()}`)}
        </span>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function updateLivestockSummary(data) {
  const cattleCount = data.filter(a => a.type.includes('Cattle')).length;
  const goatCount = data.filter(a => a.type === 'Goat').length;
  const poultryCount = data.filter(a => a.type === 'Poultry').length;
  
  document.getElementById('total-animals').textContent = data.length;
  document.getElementById('cattle-count').textContent = cattleCount;
  document.getElementById('goat-count').textContent = goatCount;
  document.getElementById('poultry-count').textContent = poultryCount;
}

// Health Analysis with TensorFlow.js
let diseaseModel;

async function loadDiseaseModel() {
  diseaseModel = await tf.loadGraphModel(
    'https://tfhub.dev/google/tfjs-model/aiy/vision/classifier/animals_V1/1'
  );
}

document.getElementById('analyzeLivestock').addEventListener('click', async function() {
  const fileInput = document.getElementById('livestockPhoto');
  if (!fileInput.files.length) {
    alert(i18next.t('livestock.no_image_selected'));
    return;
  }

  const loader = document.getElementById('livestockLoader');
  const resultsDiv = document.getElementById('livestockResults');
  
  loader.classList.remove('hidden');
  this.disabled = true;
  resultsDiv.classList.add('hidden');

  try {
    if (!diseaseModel) await loadDiseaseModel();
    
    const imageFile = fileInput.files[0];
    const imageElement = await createImageElement(imageFile);
    document.getElementById('livestockImagePreview').innerHTML = '';
    document.getElementById('livestockImagePreview').appendChild(imageElement);
    
    const predictions = await analyzeAnimalImage(imageElement);
    displayHealthResults(predictions);
    
  } catch (error) {
    console.error('Error analyzing image:', error);
    document.getElementById('livestockTensorflowResult').innerHTML = `
      <p class="text-red-500">${i18next.t('livestock.analysis_error')}</p>
    `;
  } finally {
    loader.classList.add('hidden');
    this.disabled = false;
    resultsDiv.classList.remove('hidden');
  }
});

async function createImageElement(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => resolve(img);
    };
    
    reader.readAsDataURL(file);
  });
}

async function analyzeAnimalImage(imgElement) {
  // Preprocess the image
  const tensor = tf.browser.fromPixels(imgElement)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .expandDims();
  
  // Make prediction
  const predictions = await diseaseModel.predict(tensor).data();
  tf.dispose(tensor); // Clean up
  
  // Get top 3 predictions
  const top3 = Array.from(predictions)
    .map((prob, index) => ({ probability: prob, className: ANIMAL_CLASSES[index] }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);
    
  return top3;
}

// Animal classes from the model (would need to be translated)
const ANIMAL_CLASSES = [
  'Cow', 'Goat', 'Sheep', 'Pig', 'Chicken', 
  'Dog', 'Cat', 'Horse', 'Rabbit', 'Turkey'
];

function displayHealthResults(predictions) {
  const resultDiv = document.getElementById('livestockTensorflowResult');
  const adviceDiv = document.getElementById('livestockAdvice');
  
  resultDiv.innerHTML = `
    <p><strong>${i18next.t('livestock.detection')}:</strong> ${predictions[0].className}</p>
    <p><strong>${i18next.t('livestock.confidence')}:</strong> ${(predictions[0].probability * 100).toFixed(1)}%</p>
    <p class="text-sm mt-2">${i18next.t('livestock.other_possibilities')}: 
      ${predictions.slice(1).map(p => `${p.className} (${(p.probability * 100).toFixed(1)}%)`).join(', ')}
    </p>
  `;
  
  // Generate localized advice based on detection
  const diseaseAdvice = {
    'Cow': i18next.t('livestock.advice.cow'),
    'Goat': i18next.t('livestock.advice.goat'),
    'Sheep': i18next.t('livestock.advice.sheep'),
    'Pig': i18next.t('livestock.advice.pig'),
    'Chicken': i18next.t('livestock.advice.chicken')
  };
  
  const advice = diseaseAdvice[predictions[0].className] || i18next.t('livestock.general_advice');
  adviceDiv.innerHTML = `
    <p><strong>${i18next.t('livestock.recommended_action')}:</strong> ${advice}</p>
  `;
}

// Feeding Calculator
document.getElementById('calculateFeed').addEventListener('click', function() {
  const animalType = document.getElementById('feedAnimalType').value;
  const weight = parseFloat(document.getElementById('animalWeight').value) || 0;
  const feedType = document.getElementById('feedType').value;
  
  // Simple calculation logic (replace with real formulas)
  let dryMatter, protein;
  
  switch(animalType) {
    case 'dairy_cow':
      dryMatter = weight * 0.03; // 3% of body weight
      protein = dryMatter * 0.18; // 18% protein in DM
      break;
    case 'beef_cattle':
      dryMatter = weight * 0.025;
      protein = dryMatter * 0.12;
      break;
    case 'goat':
      dryMatter = weight * 0.04;
      protein = dryMatter * 0.14;
      break;
    case 'sheep':
      dryMatter = weight * 0.035;
      protein = dryMatter * 0.16;
      break;
    default:
      dryMatter = 0;
      protein = 0;
  }
  
  // Adjust for feed type
  if (feedType === 'concentrate') {
    dryMatter = dryMatter * 0.7;
    protein = protein * 1.2;
  } else if (feedType === 'silage') {
    dryMatter = dryMatter * 0.85;
    protein = protein * 0.9;
  }
  
  document.getElementById('dryMatterResult').textContent = dryMatter.toFixed(1) + ' kg';
  document.getElementById('proteinResult').textContent = (protein * 1000).toFixed(0) + ' g';
  document.getElementById('feedResult').classList.remove('hidden');
});

// Record Milk Production
document.getElementById('recordMilk').addEventListener('click', async function() {
  const animalId = document.getElementById('milkAnimalId').value;
  const date = document.getElementById('milkDate').value;
  const amount = document.getElementById('milkAmount').value;
  
  if (!animalId || !date || !amount) {
    alert(i18next.t('livestock.fill_all_fields'));
    return;
  }
  
  const milkData = {
    animalId,
    date,
    amount: parseFloat(amount),
    fat: parseFloat(document.getElementById('milkFat').value) || 0,
    protein: parseFloat(document.getElementById('milkProtein').value) || 0,
    scc: parseInt(document.getElementById('milkSCC').value) || 0
  };
  
  try {
    const response = await fetch('https://api.rab.gov.rw/milk-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_RAB_API_KEY'
      },
      body: JSON.stringify(milkData)
    });
    
    if (!response.ok) throw new Error('Failed to record milk production');
    
    alert(i18next.t('livestock.milk_record_success'));
    // Refresh milk charts
    updateMilkCharts();
    
  } catch (error) {
    console.error('Error recording milk:', error);
    alert(i18next.t('livestock.record_error'));
  }
});

// Record Vaccination
document.getElementById('recordVaccine').addEventListener('click', async function() {
  const animalId = document.getElementById('vaccineAnimalId').value;
  const vaccineType = document.getElementById('vaccineType').value;
  const date = document.getElementById('vaccineDate').value;
  const nextDate = document.getElementById('vaccineNextDate').value;
  const notes = document.getElementById('vaccineNotes').value;
  
  if (!animalId || !vaccineType || !date || !nextDate) {
    alert(i18next.t('livestock.fill_required_fields'));
    return;
  }
  
  const vaccineData = {
    animalId,
    vaccineType,
    date,
    nextDate,
    notes
  };
  
  try {
    const response = await fetch('https://api.rab.gov.rw/vaccinations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_RAB_API_KEY'
      },
      body: JSON.stringify(vaccineData)
    });
    
    if (!response.ok) throw new Error('Failed to record vaccination');
    
    alert(i18next.t('livestock.vaccine_record_success'));
    // Refresh vaccination history
    loadVaccinationHistory();
    
  } catch (error) {
    console.error('Error recording vaccination:', error);
    alert(i18next.t('livestock.record_error'));
  }
});

// Load Vaccination History from API
async function loadVaccinationHistory() {
  try {
    const response = await fetch('https://api.rab.gov.rw/vaccination-history', {
      headers: {
        'Authorization': 'Bearer YOUR_RAB_API_KEY'
      }
    });
    
    if (!response.ok) throw new Error('API request failed');
    
    const data = await response.json();
    populateVaccinationHistory(data);
    
  } catch (error) {
    console.error('Error fetching vaccination history:', error);
    // Fallback to mock data
    const mockData = [
      { date: '2023-10-05', animalId: '#245', vaccine: 'Brucellosis', nextDate: '2024-10-05' },
      { date: '2023-09-20', animalId: 'All', vaccine: 'Anthrax', nextDate: '2024-09-20' }
    ];
    populateVaccinationHistory(mockData);
  }
}

function populateVaccinationHistory(data) {
  const tableBody = document.getElementById('vaccinationHistory');
  tableBody.innerHTML = ''; // Clear existing rows
  
  data.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-4 py-2 dark:text-white">${record.date}</td>
      <td class="px-4 py-2 dark:text-white">${record.animalId}</td>
      <td class="px-4 py-2 dark:text-white">${i18next.t(`livestock.${record.vaccine.toLowerCase().replace(' ', '_')}`)}</td>
      <td class="px-4 py-2 dark:text-white">${record.nextDate}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Update Milk Charts with fresh data
async function updateMilkCharts() {
  try {
    const response = await fetch('https://api.rab.gov.rw/milk-production', {
      headers: {
        'Authorization': 'Bearer YOUR_RAB_API_KEY'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch milk data');
    
    const data = await response.json();
    // Update charts with new data
    updateChartData('milkDailyChart', data.dailyProduction);
    updateChartData('milkQualityChart', data.qualityMetrics);
    
  } catch (error) {
    console.error('Error updating milk charts:', error);
  }
}

function updateChartData(chartId, newData) {
  const chart = Chart.getChart(chartId);
  if (chart) {
    chart.data.datasets[0].data = newData.values;
    chart.data.labels = newData.labels;
    chart.update();
  }
}

// Initialize TensorFlow model when health tab is activated
document.querySelector('.subtab-btn[data-subtab="health"]').addEventListener('click', async function() {
  if (!diseaseModel) {
    try {
      await loadDiseaseModel();
    } catch (error) {
      console.error('Failed to load disease model:', error);
    }
  }
});

// Initialize vaccination history when vaccination tab is activated
document.querySelector('.subtab-btn[data-subtab="vaccination"]').addEventListener('click', function() {
  loadVaccinationHistory();
});