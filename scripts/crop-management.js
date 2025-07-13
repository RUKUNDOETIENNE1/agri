// scripts/crop-management.js
document.addEventListener('DOMContentLoaded', function() {
  // Existing disease detection code would be here
  
  // Smart Irrigation System
  const updateIrrigationData = async () => {
    try {
      // Simulate fetching sensor data
      const zone = document.getElementById('irrigationZone').value;
      const crop = document.getElementById('irrigationCrop').value;
      
      // Generate random data for demo
      const moisture = Math.floor(Math.random() * 30) + 30; // 30-60%
      const temp = Math.floor(Math.random() * 10) + 22; // 22-32°C
      const rainChance = Math.floor(Math.random() * 50); // 0-50%
      
      // Update UI
      document.getElementById('soilMoistureValue').textContent = `${moisture}%`;
      document.getElementById('soilMoistureBar').style.width = `${moisture}%`;
      document.getElementById('temperatureValue').textContent = `${temp}°C`;
      document.getElementById('rainForecast').textContent = `${rainChance}%`;
      
      // Update recommendation
      let advice = '';
      if (moisture < 40) {
        advice = `Water required: ${Math.floor((45 - moisture) / 2)}mm in next 48 hours`;
      } else if (moisture > 55) {
        advice = 'No irrigation needed - soil is saturated';
      } else {
        advice = 'Light irrigation recommended in next 3 days';
      }
      
      document.getElementById('irrigationAdvice').textContent = advice;
      
      // Update moisture bar color
      const moistureBar = document.getElementById('soilMoistureBar');
      moistureBar.classList.remove('bg-blue-600', 'bg-yellow-500', 'bg-red-500');
      if (moisture < 35) {
        moistureBar.classList.add('bg-red-500');
      } else if (moisture < 45) {
        moistureBar.classList.add('bg-yellow-500');
      } else {
        moistureBar.classList.add('bg-blue-600');
      }
      
    } catch (error) {
      console.error('Error updating irrigation data:', error);
    }
  };
  
  // Manual irrigation button
  document.getElementById('manualIrrigateBtn').addEventListener('click', function() {
    const zone = document.getElementById('irrigationZone').value;
    alert(`Starting irrigation for ${zone} field`);
    // In real implementation, this would trigger an API call to irrigation system
  });
  
  // Schedule irrigation button
  document.getElementById('scheduleIrrigateBtn').addEventListener('click', function() {
    // This would open a scheduling modal in a real implementation
    alert('Opening irrigation scheduling interface');
  });
  
  // Set up event listeners for irrigation controls
  document.getElementById('irrigationZone').addEventListener('change', updateIrrigationData);
  document.getElementById('irrigationCrop').addEventListener('change', updateIrrigationData);
  
  // Initialize with current data
  updateIrrigationData();
  
  // Crop Calendar Implementation
  const renderCalendar = (month = new Date().getMonth(), year = new Date().getFullYear()) => {
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'p-2 min-h-16 border-b border-r dark:border-gray-700';
      calendarDays.appendChild(emptyCell);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('div');
      dayCell.className = 'p-2 min-h-16 border-b border-r dark:border-gray-700';
      
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      
      dayCell.innerHTML = `
        <div class="flex justify-between items-start">
          <span class="text-sm ${isToday ? 'bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center' : ''}">${day}</span>
          ${day % 5 === 0 ? '<span class="w-2 h-2 rounded-full bg-green-500"></span>' : ''}
        </div>
        ${day % 7 === 0 ? '<p class="text-xs mt-1 truncate text-green-600 dark:text-green-300">Planting</p>' : ''}
        ${day % 10 === 0 ? '<p class="text-xs mt-1 truncate text-yellow-600 dark:text-yellow-300">Fertilize</p>' : ''}
      `;
      
      calendarDays.appendChild(dayCell);
    }
  };
  
  // Initialize calendar
  renderCalendar();
  
  // Add crop button
  document.getElementById('addCropBtn').addEventListener('click', function() {
    const selectedCrop = document.getElementById('calendarCrop').value;
    if (selectedCrop) {
      alert(`Adding ${selectedCrop} to calendar. In full implementation, this would open a scheduling interface.`);
      // Here you would typically add the crop to the calendar with planting dates, etc.
    } else {
      alert('Please select a crop first');
    }
  });
});