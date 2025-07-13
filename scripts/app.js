document.addEventListener('DOMContentLoaded', function() {
  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark');
      sunIcon.classList.toggle('hidden');
      moonIcon.classList.toggle('hidden');
      localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });
    
    if (localStorage.getItem('darkMode') === 'true') {
      document.documentElement.classList.add('dark');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }
  
  // Tab Switching
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-green-500', 'text-green-600', 'dark:text-green-300');
        btn.classList.add('text-gray-500', 'dark:text-gray-400');
      });
      
      this.classList.remove('text-gray-500', 'dark:text-gray-400');
      this.classList.add('border-green-500', 'text-green-600', 'dark:text-green-300');
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      const tabId = this.getAttribute('data-tab') + '-tab';
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Initialize components
  if (typeof loadModel === 'function') loadModel();
});