// Main tab switching
function setupMainTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active classes from all tabs
      document.querySelectorAll('.tab-btn').forEach(t => {
        t.classList.remove('border-b-2', 'border-green-500', 'text-green-600', 'dark:text-green-300');
        t.classList.add('text-gray-500', 'dark:text-gray-400');
      });
      
      // Add active class to clicked tab
      btn.classList.add('border-b-2', 'border-green-500', 'text-green-600', 'dark:text-green-300');
      btn.classList.remove('text-gray-500', 'dark:text-gray-400');
      
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Show selected tab content
      const tabId = btn.getAttribute('data-tab') + '-tab';
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Farming type tabs (crop/livestock)
  document.getElementById('cropTab').addEventListener('click', () => {
    document.getElementById('cropContent').classList.remove('hidden');
    document.getElementById('livestockContent').classList.add('hidden');
    document.getElementById('cropTab').classList.add('border-b-2', 'border-green-600', 'text-green-600', 'dark:text-green-300');
    document.getElementById('livestockTab').classList.remove('border-b-2', 'border-green-600', 'text-green-600', 'dark:text-green-300');
  });

  document.getElementById('livestockTab').addEventListener('click', () => {
    document.getElementById('livestockContent').classList.remove('hidden');
    document.getElementById('cropContent').classList.add('hidden');
    document.getElementById('livestockTab').classList.add('border-b-2', 'border-green-600', 'text-green-600', 'dark:text-green-300');
    document.getElementById('cropTab').classList.remove('border-b-2', 'border-green-600', 'text-green-600', 'dark:text-green-300');
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', setupMainTabs);