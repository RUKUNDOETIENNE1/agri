document.addEventListener('DOMContentLoaded', function() {
    const cropTab = document.getElementById('cropTab');
    const livestockTab = document.getElementById('livestockTab');
    const cropContent = document.getElementById('cropContent');
    const livestockContent = document.getElementById('livestockContent');
    const cropFarmDetails = document.getElementById('cropFarmDetails');
    const livestockFarmDetails = document.getElementById('livestockFarmDetails');

    // Initialize with crop content visible
    cropContent.classList.add('active');
    livestockContent.classList.remove('active');
    cropFarmDetails.classList.remove('hidden');
    livestockFarmDetails.classList.add('hidden');

    cropTab.addEventListener('click', function() {
        // Update tabs styling
        cropTab.classList.add('text-green-600', 'dark:text-green-300', 'border-b-2', 'border-green-600', 'dark:border-green-300');
        cropTab.classList.remove('text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-300');
        livestockTab.classList.add('text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-300');
        livestockTab.classList.remove('text-green-600', 'dark:text-green-300', 'border-b-2', 'border-green-600', 'dark:border-green-300');
        
        // Update content visibility
        cropContent.classList.add('active');
        livestockContent.classList.remove('active');
        cropFarmDetails.classList.remove('hidden');
        livestockFarmDetails.classList.add('hidden');
    });

    livestockTab.addEventListener('click', function() {
        // Update tabs styling
        livestockTab.classList.add('text-green-600', 'dark:text-green-300', 'border-b-2', 'border-green-600', 'dark:border-green-300');
        livestockTab.classList.remove('text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-300');
        cropTab.classList.add('text-gray-500', 'dark:text-gray-400', 'hover:text-gray-700', 'dark:hover:text-gray-300');
        cropTab.classList.remove('text-green-600', 'dark:text-green-300', 'border-b-2', 'border-green-600', 'dark:border-green-300');
        
        // Update content visibility
        livestockContent.classList.add('active');
        cropContent.classList.remove('active');
        livestockFarmDetails.classList.remove('hidden');
        cropFarmDetails.classList.add('hidden');
        
        // Initialize livestock charts if needed
        if (typeof initLivestockCharts === 'function') {
            initLivestockCharts();
        }
    });
});