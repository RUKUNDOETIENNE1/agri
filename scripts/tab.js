// scripts/app/tabs.js
document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Removing active classes from all tabs and buttons
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.classList.add('hidden');
      });
      
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove(
          'border-b-2', 'border-green-500', 
          'text-green-600', 'dark:text-green-300'
        );
        btn.classList.add(
          'text-gray-500', 'dark:text-gray-400'
        );
      });
      
      // Getting the tab ID to show
      const tabId = this.getAttribute('data-tab');
      const tabToShow = document.getElementById(`${tabId}-tab`);
      
      // If we found the tab, show it
      if (tabToShow) {
        tabToShow.classList.remove('hidden');
        tabToShow.classList.add('active');
        
        // Update the button appearance
        this.classList.remove('text-gray-500', 'dark:text-gray-400');
        this.classList.add(
          'border-b-2', 'border-green-500', 
          'text-green-600', 'dark:text-green-300'
        );
      } else {
        console.error(`Tab with ID '${tabId}-tab' not found`);
      }
    });
  });
  
  // Activate the first tab by default
  if (tabButtons.length > 0) {
    tabButtons[0].click();
  }
});