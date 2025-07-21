document.addEventListener('DOMContentLoaded', function() {
    // Initialize all tab systems
    setupMainTabs();
    setupSubTabs();
    
    // Initialize Business Plan tab if present
    initBusinessPlanTab();
    
    // Activate Dashboard tab by default
    activateTab('dashboard');
});

function setupMainTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            activateTab(tabId);
            
            // Special initialization for Business Plan tab
            if (tabId === 'business-plan') {
                initBusinessPlanTab();
            }
        });
    });
}

function activateTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active-tab');
            tab.classList.remove('inactive-tab');
        } else {
            tab.classList.add('inactive-tab');
            tab.classList.remove('active-tab');
        }
    });
    
    // Update tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
            content.classList.remove('hidden');
        } else {
            content.classList.remove('active');
            content.classList.add('hidden');
        }
    });
}

function setupSubTabs() {
    const subTabs = document.querySelectorAll('#cropTab, #livestockTab');
    
    subTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const isCropTab = this.id === 'cropTab';
            activateSubTab(isCropTab);
        });
    });
    
    // Activate Crop tab by default
    activateSubTab(true);
}

function activateSubTab(isCropTab) {
    // Update subtab buttons
    document.querySelectorAll('#cropTab, #livestockTab').forEach(tab => {
        if ((isCropTab && tab.id === 'cropTab') || (!isCropTab && tab.id === 'livestockTab')) {
            tab.classList.add('active-subtab');
            tab.classList.remove('inactive-subtab');
        } else {
            tab.classList.add('inactive-subtab');
            tab.classList.remove('active-subtab');
        }
    });
    
    // Update subtab contents
    document.querySelectorAll('#cropContent, #livestockContent').forEach(content => {
        if ((isCropTab && content.id === 'cropContent') || (!isCropTab && content.id === 'livestockContent')) {
            content.classList.add('active');
            content.classList.remove('hidden');
        } else {
            content.classList.remove('active');
            content.classList.add('hidden');
        }
    });
    
    // Update farm details
    document.querySelectorAll('#cropFarmDetails, #livestockFarmDetails').forEach(detail => {
        if ((isCropTab && detail.id === 'cropFarmDetails') || (!isCropTab && detail.id === 'livestockFarmDetails')) {
            detail.classList.remove('hidden');
        } else {
            detail.classList.add('hidden');
        }
    });
}

function initBusinessPlanTab() {
    // Only initialize if Business Plan tab exists
    const businessPlanTab = document.getElementById('business-plan-tab');
    if (!businessPlanTab) return;

    const generateBtn = document.getElementById('generate-plan-btn');
    if (!generateBtn) return;

    // Toggle crops/livestock sections
    const cropsCheckbox = document.getElementById('activity-crops');
    const livestockCheckbox = document.getElementById('activity-livestock');
    
    if (cropsCheckbox) {
        cropsCheckbox.addEventListener('change', function() {
            const cropsDetails = document.getElementById('crops-details');
            if (cropsDetails) cropsDetails.classList.toggle('hidden', !this.checked);
        });
    }
    
    if (livestockCheckbox) {
        livestockCheckbox.addEventListener('change', function() {
            const livestockDetails = document.getElementById('livestock-details');
            if (livestockDetails) livestockDetails.classList.toggle('hidden', !this.checked);
        });
    }

    // Generate button handler
    generateBtn.addEventListener('click', function() {
        const output = document.getElementById('business-plan-output');
        const template = document.getElementById('business-plan-template');
        
        if (!output || !template) return;
        
        // Show loading state
        output.innerHTML = '<div class="text-center py-10">Generating plan...</div>';
        
        // Simulate generation delay
        setTimeout(() => {
            // Clone the template to avoid DOM issues
            const templateClone = template.cloneNode(true);
            templateClone.classList.remove('hidden');
            output.innerHTML = '';
            output.appendChild(templateClone);
            
            // Show action buttons
            const actionButtons = document.getElementById('action-buttons');
            if (actionButtons) actionButtons.classList.remove('hidden');
            
            // Populate with form data
            populateBusinessPlanData();
        }, 1500);
    });
}

function populateBusinessPlanData() {
    // Map form fields to output elements
    const fieldMap = {
        'project-name': 'output-project-name',
        'location': 'output-location',
        'land-size': 'output-land-size',
        'startup-costs': 'output-startup-costs',
        'monthly-expenses': 'output-monthly-expenses',
        'projected-revenue': 'output-projected-revenue'
    };

    // Update each field
    Object.entries(fieldMap).forEach(([inputId, outputId]) => {
        const input = document.getElementById(inputId);
        const output = document.getElementById(outputId);
        
        if (input && output) {
            output.textContent = inputId === 'land-size' 
                ? `${input.value || 0} ha` 
                : input.value || 'Not specified';
        }
    });
}