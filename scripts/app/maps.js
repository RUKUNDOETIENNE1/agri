function initializeMap() {
  const map = L.map('fieldMap').setView([-1.9441, 30.0619], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Add NDVI overlay (mock)
  const ndviOverlay = L.imageOverlay(
    'https://via.placeholder.com/800x600/4dff88/000000?text=NDVI+Overlay',
    [[-1.959, 30.05], [-1.929, 30.07]]
  ).addTo(map);

  // Add legend
  const legend = L.control({position: 'bottomright'});
  legend.onAdd = function(map) {
    const div = L.DomUtil.create('div', 'ndvi-legend');
    div.innerHTML = `
      <h4>NDVI Scale</h4>
      <div><i style="background: #d73027"></i> 0.0 - 0.3 (Poor)</div>
      <div><i style="background: #fee08b"></i> 0.3 - 0.6 (Fair)</div>
      <div><i style="background: #91cf60"></i> 0.6 - 0.8 (Good)</div>
      <div><i style="background: #1a9850"></i> 0.8 - 1.0 (Excellent)</div>
    `;
    return div;
  };
  legend.addTo(map);
}

document.addEventListener('DOMContentLoaded', initializeMap);