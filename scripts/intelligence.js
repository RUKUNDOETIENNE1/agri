document.addEventListener('DOMContentLoaded', function() {
  // Initialize AI chat
  const aiInput = document.getElementById('aiQuestionInput');
  const askBtn = document.getElementById('askAI');
  const chatHistory = document.getElementById('aiChatHistory');
  
  // Suggested questions
  document.querySelectorAll('.suggested-question').forEach(btn => {
    btn.addEventListener('click', function() {
      aiInput.value = this.getAttribute('data-i18n');
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
    loadingMsg.className = 'flex justify-start mb-2';
    loadingMsg.innerHTML = `
      <div class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-4 py-2 rounded-lg max-w-3/4">
        <div class="flex items-center">
          <div class="loader h-4 w-4 border-2 border-purple-600 border-opacity-20 rounded-full mr-2"></div>
          <span data-i18n="ai_thinking">Thinking...</span>
        </div>
      </div>
    `;
    chatHistory.appendChild(loadingMsg);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    
    // Simulate AI response (replace with real API call)
    setTimeout(() => {
      chatHistory.removeChild(loadingMsg);
      const response = generateAIResponse(question);
      addMessage(response, 'bot');
    }, 1500);
  });
  
  // Enter key handler
  aiInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      askBtn.click();
    }
  });
});

function addMessage(text, sender) {
  const chatHistory = document.getElementById('aiChatHistory');
  const template = document.querySelector(`.ai-message.${sender}`).cloneNode(true);
  
  template.classList.remove('hidden');
  if (sender === 'user') {
    template.querySelector('.question-text').textContent = text;
  } else {
    template.querySelector('.response-text').innerHTML = text;
  }
  
  // Format time (e.g., "2:30 PM")
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  template.querySelector('.message-time').textContent = timeString;
  
  // Remove welcome message if it's the first user message
  const welcomeMsg = chatHistory.querySelector('[data-i18n="ai_welcome_message"]');
  if (welcomeMsg && sender === 'user') {
    welcomeMsg.remove();
  }
  
  chatHistory.appendChild(template);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function generateAIResponse(question) {
  // This would be replaced with actual AI API call
  const responses = {
    "en": {
      "armyworms": "For armyworms in maize: Use neem oil (40ml per 20L water) or recommended pesticides. Apply early morning or late evening.",
      "irrigation": "Beans need 25-30mm water weekly. Irrigate every 3-4 days in dry season, less in rainy season.",
      "market": "Current maize prices: Kigali 450RWF/kg, Musanze 430RWF/kg. Prices rising (+5% this month)."
    },
    "fr": {
      "armyworms": "Pour les vers légionnaires dans le maïs : Utilisez de l'huile de neem (40ml pour 20L d'eau) ou des pesticides recommandés.",
      "irrigation": "Les haricots ont besoin de 25-30mm d'eau par semaine.",
      "market": "Prix actuels du maïs : Kigali 450FRW/kg, Musanze 430FRW/kg."
    },
    "rw": {
      "armyworms": "Kurwanya armyworms mu bigori: Koresha amavuta ya neem (40ml kuri litre 20) cyangwa imiti yemewe.",
      "irrigation": "Ibishyimbo bakeneye amazi 25-30mm mu cyumweru.",
      "market": "Igiciro cy'ibigori ubu: Kigali 450RWF/kg, Musanze 430RWF/kg."
    }
  };
  
  const lang = currentLanguage;
  question = question.toLowerCase();
  
  if (question.includes('armyworm')) {
    return responses[lang]["armyworms"];
  } else if (question.includes('irrigation')) {
    return responses[lang]["irrigation"];
  } else if (question.includes('price') || question.includes('market')) {
    return responses[lang]["market"];
  } else {
    return translations[lang]["ai_default_response"] || "I'll research that and get back to you soon.";
  }
}