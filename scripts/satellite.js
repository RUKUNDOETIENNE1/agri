async function fetchSatelliteData(lat, lng) {
  document.getElementById('satelliteLoader').classList.remove('hidden');
  
  try {
    // Note: In production, I'd need to authenticate with Sentinel Hub
    const ndviValue = (Math.random() * 0.8).toFixed(2); // Simulated NDVI
    
    document.getElementById('ndviValue').textContent = `NDVI: ${ndviValue} (${getNdviHealth(ndviValue)})`;
    document.getElementById('satelliteAdvice').textContent = await generateSatelliteAdvice(ndviValue);
    document.getElementById('satelliteResults').classList.remove('hidden');
  } catch (error) {
    console.error("Satellite error:", error);
  } finally {
    document.getElementById('satelliteLoader').classList.add('hidden');
  }
}

function getNdviHealth(ndvi) {
  if (ndvi > 0.6) return 'Healthy';
  if (ndvi > 0.3) return 'Moderate';
  return 'Stressed';
}

document.getElementById('fetchSatellite').addEventListener('click', () => {
  const lat = document.getElementById('latitude').value;
  const lng = document.getElementById('longitude').value;
  fetchSatelliteData(lat, lng);
});