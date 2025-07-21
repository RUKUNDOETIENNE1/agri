// scripts/business-plan.js
import { OPENAI_API_KEY, OPENAI_ORGANIZATION } from '../config.js';

document.addEventListener('DOMContentLoaded', function() {
  // ... [previous variable declarations and setup code] ...

  // Generate business plan
  generatePlanBtn.addEventListener('click', async function() {
    if (!validateForm()) return;
    
    // Show loading state
    businessPlanOutput.innerHTML = '';
    businessPlanTemplate.classList.remove('hidden');
    document.getElementById('ai-loading').classList.remove('hidden');
    actionButtons.classList.add('hidden');
    
    // Get form values
    const projectName = document.getElementById('project-name').value;
    const location = document.getElementById('location').value;
    const landSize = document.getElementById('land-size').value;
    const startupCosts = parseInt(document.getElementById('startup-costs').value);
    const monthlyExpenses = parseInt(document.getElementById('monthly-expenses').value);
    const projectedRevenue = parseInt(document.getElementById('projected-revenue').value);
    const additionalNotes = document.getElementById('additional-notes').value;
    
    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-RW', { 
        style: 'currency', 
        currency: 'RWF',
        maximumFractionDigits: 0
      }).format(amount);
    };

    // Populate basic info (non-AI parts)
    document.getElementById('output-project-name').textContent = projectName;
    document.getElementById('output-location').textContent = location;
    document.getElementById('output-land-size').textContent = `${landSize} hectares`;
    document.getElementById('output-startup-costs').textContent = formatCurrency(startupCosts);
    document.getElementById('output-monthly-expenses').textContent = formatCurrency(monthlyExpenses);
    document.getElementById('output-projected-revenue').textContent = formatCurrency(projectedRevenue);
    document.getElementById('output-projected-profit').textContent = formatCurrency(projectedRevenue - monthlyExpenses);
    
    // Set current date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('plan-date').textContent = new Date().toLocaleDateString('en-US', options);
    
    // Generate activities list
    const activitiesList = document.getElementById('output-activities');
    activitiesList.innerHTML = '';
    
    if (activityCrops.checked && crops.length > 0) {
      const li = document.createElement('li');
      li.textContent = `Crop Production: ${crops.join(', ')}`;
      activitiesList.appendChild(li);
    }
    
    if (activityLivestock.checked && livestock.length > 0) {
      const li = document.createElement('li');
      li.textContent = `Livestock: ${livestock.join(', ')}`;
      activitiesList.appendChild(li);
    }

    // Generate AI content
    try {
      await generateAIContent({
        projectName,
        location,
        landSize,
        crops: activityCrops.checked ? crops : [],
        livestock: activityLivestock.checked ? livestock : [],
        processing: document.getElementById('activity-processing').checked,
        agrotourism: document.getElementById('activity-agrotourism').checked,
        startupCosts,
        monthlyExpenses,
        projectedRevenue,
        additionalNotes
      });
    } catch (error) {
      console.error('Error generating AI content:', error);
      alert('Failed to generate AI content. Please try again later.');
    } finally {
      document.getElementById('ai-loading').classList.add('hidden');
      actionButtons.classList.remove('hidden');
    }
  });

  // ... [other existing functions like validateForm, updateCropTags, etc.] ...

  async function generateAIContent(businessData) {
    // Construct the prompt
    const prompt = `Generate a comprehensive business plan for an agricultural project with these details:
    
    Project Name: ${businessData.projectName}
    Location: ${businessData.location}
    Land Size: ${businessData.landSize} hectares
    Main Activities: 
      ${businessData.crops.length ? 'Crops: ' + businessData.crops.join(', ') : ''}
      ${businessData.livestock.length ? 'Livestock: ' + businessData.livestock.join(', ') : ''}
      ${businessData.processing ? 'Processing: Yes' : ''}
      ${businessData.agrotourism ? 'Agrotourism: Yes' : ''}
    
    Financial Information:
      Startup Costs: ${businessData.startupCosts} RWF
      Monthly Expenses: ${businessData.monthlyExpenses} RWF
      Projected Revenue: ${businessData.projectedRevenue} RWF
    
    Additional Notes: ${businessData.additionalNotes || 'None'}
    
    Please provide:
    1. A detailed executive summary
    2. Market analysis specific to ${businessData.location}
    3. Operations plan covering all selected activities
    `;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Organization': OPENAI_ORGANIZATION || ''
        },
        body: JSON.stringify({
          model: "gpt-4", // or "gpt-3.5-turbo" for faster/cheaper results
          messages: [
            {
              role: "system",
              content: "You are an agricultural business consultant helping farmers create professional business plans. Provide detailed, practical advice tailored to Rwanda's agricultural context."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from API');
      }

      // Parse the response (assuming it returns sections with headings)
      const sections = content.split('\n\n');
      
      // Find and populate each section
      const findSection = (title) => {
        return sections.find(section => 
          section.trim().toLowerCase().startsWith(title.toLowerCase())
        ) || `Could not generate ${title}`;
      };

      document.getElementById('executive-summary-text').textContent = 
        findSection('Executive Summary').replace('Executive Summary:', '').trim();
      
      document.getElementById('market-analysis-text').textContent = 
        findSection('Market Analysis').replace('Market Analysis:', '').trim();
      
      document.getElementById('operations-plan-text').textContent = 
        findSection('Operations Plan').replace('Operations Plan:', '').trim();

      // Show AI sections
      document.getElementById('ai-executive-summary').classList.remove('hidden');
      document.getElementById('ai-market-analysis').classList.remove('hidden');
      document.getElementById('ai-operations-plan').classList.remove('hidden');

    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      // Fallback to generic content if API fails
      document.getElementById('executive-summary-text').textContent = 
        `We couldn't generate customized content at this time. Please check your internet connection and try again.`;
      document.getElementById('ai-executive-summary').classList.remove('hidden');
      throw error;
    }
  }
});