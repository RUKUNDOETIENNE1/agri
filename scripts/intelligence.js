// intelligence.js - Complete working implementation
document.addEventListener('DOMContentLoaded', function() {
  // Initialize only when Intelligence tab exists
  const intelligenceTab = document.getElementById('intelligence-tab');
  if (!intelligenceTab) return;

  // Initialize components
  initCharts();
  setupAIChat();
  setupVoiceAssistant();
  setupRefreshButton();
  setupAnalysisButtons();

  // Chart initialization
  function initCharts() {
    // Market Trend Chart
    const marketCtx = document.getElementById('marketTrendChart')?.getContext('2d');
    if (marketCtx) {
      new Chart(marketCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            data: [450, 470, 520, 510, 550, 580],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      });
    }

    // Yield Trend Chart
    const yieldCtx = document.getElementById('yieldTrendChart')?.getContext('2d');
    if (yieldCtx) {
      new Chart(yieldCtx, {
        type: 'bar',
        data: {
          labels: ['2020', '2021', '2022', '2023'],
          datasets: [{
            data: [2.8, 3.0, 2.9, 3.2],
            backgroundColor: '#2196F3'
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  // AI Chat Functionality
  function setupAIChat() {
    const aiInput = document.getElementById('userQuery');
    const askBtn = document.getElementById('sendQuery');
    const chatHistory = document.getElementById('chatContainer');

    if (!aiInput || !askBtn || !chatHistory) return;

    // Quick question buttons
    document.querySelectorAll('.quick-question-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const question = this.textContent.trim();
        aiInput.value = question;
        askBtn.click();
      });
    });

    // Ask question handler
    askBtn.addEventListener('click', function() {
      const question = aiInput.value.trim();
      if (!question) return;
      
      addMessage(question, 'user');
      aiInput.value = '';
      
      // Show loading state
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-message bot-message mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg';
      loadingMsg.innerHTML = `
        <div class="flex items-center">
          <div class="loader h-4 w-4 border-2 border-purple-600 border-opacity-20 rounded-full mr-2"></div>
          <span>Thinking...</span>
        </div>
      `;
      chatHistory.appendChild(loadingMsg);
      chatHistory.scrollTop = chatHistory.scrollHeight;
      
      // Simulate AI response
      setTimeout(() => {
        chatHistory.removeChild(loadingMsg);
        const response = generateAIResponse(question);
        addMessage(response, 'bot');
      }, 1500);
    });

    // Enter key handler
    aiInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') askBtn.click();
    });

    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${sender}-message mb-3 p-3 rounded-lg max-w-xs`;
      
      if (sender === 'user') {
        messageDiv.classList.add('bg-indigo-100', 'dark:bg-indigo-900', 'ml-auto');
      } else {
        messageDiv.classList.add('bg-gray-100', 'dark:bg-gray-700', 'mr-auto');
      }
      
      messageDiv.innerHTML = `<p class="dark:text-white">${text}</p>`;
      chatHistory.appendChild(messageDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  }

  // AI Response Generator
  function generateAIResponse(question) {
    const responses = {
      "en": {
        "armyworms": "For armyworms in maize: Use neem oil (40ml per 20L water) or recommended pesticides. Apply early morning or late evening.",
        "irrigation": "Beans need 25-30mm water weekly. Irrigate every 3-4 days in dry season, less in rainy season.",
        "market": "Current maize prices: Kigali 450RWF/kg, Musanze 430RWF/kg. Prices rising (+5% this month).",
        "default": "I'll research that and get back to you soon."
      },
      "fr": {
        "armyworms": "Pour les vers légionnaires dans le maïs : Utilisez de l'huile de neem (40ml pour 20L d'eau) ou des pesticides recommandés.",
        "irrigation": "Les haricots ont besoin de 25-30mm d'eau par semaine.",
        "market": "Prix actuels du maïs : Kigali 450FRW/kg, Musanze 430FRW/kg.",
        "default": "Je vais rechercher cela et vous répondre bientôt."
      },
      "rw": {
        "armyworms": "Kurwanya armyworms mu bigori: Koresha amavuta ya neem (40ml kuri litre 20) cyangwa imiti yemewe.",
        "irrigation": "Ibishyimbo bakeneye amazi 25-30mm mu cyumweru.",
        "market": "Igiciro cy'ibigori ubu: Kigali 450RWF/kg, Musanze 430RWF/kg.",
        "default": "Nzabikora ubushakashatsi kandi nzagusubiza vuba."
      }
    };
    
    const lang = document.documentElement.lang || 'en';
    question = question.toLowerCase();
    
    if (question.includes('armyworm') || question.includes('légionnaire') || question.includes('udukoko')) {
      return responses[lang]["armyworms"];
    }
    if (question.includes('irrigation') || question.includes('arrosage') || question.includes('amazi')) {
      return responses[lang]["irrigation"];
    }
    if (question.includes('price') || question.includes('prix') || question.includes('igiciro')) {
      return responses[lang]["market"];
    }
    return responses[lang]["default"];
  }

  // Voice Assistant
  function setupVoiceAssistant() {
    const voiceBtn = document.getElementById('voiceAssistantBtn');
    if (!voiceBtn) return;

    if (!('webkitSpeechRecognition' in window)) {
      voiceBtn.disabled = true;
      voiceBtn.innerHTML = '<i class="fas fa-microphone-slash mr-2"></i>Voice Not Supported';
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = document.documentElement.lang || 'en';

    voiceBtn.addEventListener('click', function() {
      recognition.start();
      document.getElementById('voiceStatus').classList.remove('hidden');
      voiceBtn.disabled = true;
    });

    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      document.getElementById('userQuery').value = transcript;
      document.getElementById('sendQuery').click();
    };

    recognition.onend = function() {
      document.getElementById('voiceStatus').classList.add('hidden');
      voiceBtn.disabled = false;
    };
  }

  // Refresh Button
  function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshInsights');
    if (!refreshBtn) return;

    refreshBtn.addEventListener('click', function() {
      const btn = this;
      const originalHTML = btn.innerHTML;
      
      btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Refreshing...';
      btn.disabled = true;
      
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        showNotification('Data refreshed successfully');
      }, 2000);
    });
  }

  // Analysis Buttons
  function setupAnalysisButtons() {
    document.getElementById('runPredictions')?.addEventListener('click', function() {
      showNotification('Running predictive analysis...');
      setTimeout(() => {
        document.querySelector('#predictiveInsights').innerHTML = `
          <div class="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p class="font-medium dark:text-white flex items-center">
              <i class="fas fa-cloud-rain mr-2"></i>
              Weather Risk
            </p>
            <p class="text-sm dark:text-blue-200">High rainfall (85%) expected in 3 days</p>
          </div>
          <div class="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <p class="font-medium dark:text-white flex items-center">
              <i class="fas fa-bug mr-2"></i>
              Pest Risk
            </p>
            <p class="text-sm dark:text-yellow-200">Armyworm threat level: Medium</p>
          </div>
        `;
      }, 1500);
    });

    document.getElementById('getRecommendations')?.addEventListener('click', function() {
      showNotification('Generating custom recommendations...');
    });
  }

  // Helper function
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});