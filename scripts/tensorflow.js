let model;

async function loadModel() {
  console.log("Loading disease detection model...");
  // In production, load your actual model
  model = { predict: () => [0.1, 0.7, 0.2] }; // Simulated model
}

async function analyzePlantDisease(imageElement) {
  if (!model) await loadModel();
  
  // Simulate analysis (replace with actual TensorFlow code)
  const diseases = ['Healthy', 'Maize Rust', 'Cassava Mosaic'];
  const predictions = model.predict();
  const topDisease = diseases[predictions.indexOf(Math.max(...predictions))];
  
  return topDisease;
}

document.getElementById('plantPhoto').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const img = document.createElement('img');
    img.src = event.target.result;
    img.className = 'max-w-full h-48 object-contain';
    
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    preview.appendChild(img);
    preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
});

document.getElementById('analyzeDisease').addEventListener('click', async function() {
  const imagePreview = document.getElementById('imagePreview').querySelector('img');
  if (!imagePreview) return alert('Please upload an image first');
  
  const loader = document.getElementById('diseaseLoader');
  loader.classList.remove('hidden');
  
  try {
    const disease = await analyzePlantDisease(imagePreview);
    document.getElementById('tensorflowResult').innerHTML = `Detected: <strong>${disease}</strong>`;
    document.getElementById('openaiAdvice').textContent = await getDiseaseAdvice(disease);
    document.getElementById('diseaseResults').classList.remove('hidden');
  } catch (error) {
    console.error("Analysis error:", error);
  } finally {
    loader.classList.add('hidden');
  }
});