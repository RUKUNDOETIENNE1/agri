async function getAIResponse(prompt) {
  try {
    // Note: Replace with actual OpenAI API call
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `As an agricultural expert, answer this question: ${prompt}`,
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    return data.choices[0].text.trim();
  } catch (error) {
    console.error("OpenAI error:", error);
    return "I couldn't process your request. Please try again later.";
  }
}

async function getDiseaseAdvice(disease) {
  const advice = {
    'Healthy': 'Your crops appear healthy. Maintain current practices.',
    'Maize Rust': 'Apply fungicide and remove affected leaves. Reduce plant density.',
    'Cassava Mosaic': 'Remove infected plants immediately. Use resistant varieties next season.'
  };
  return advice[disease] || 'Consult an agronomist for specific advice.';
}

document.getElementById('askAI').addEventListener('click', async () => {
  const question = document.getElementById('aiQuestionInput').value.trim();
  if (!question) return;
  
  const chatHistory = document.getElementById('aiChatHistory');
  chatHistory.innerHTML += `<div class="text-right mb-2"><div class="inline-block bg-blue-100 dark:bg-blue-900 rounded-lg px-3 py-2"><p class="text-sm dark:text-white">${question}</p></div></div>`;
  
  chatHistory.innerHTML += `<div class="text-left mb-2"><div class="inline-block bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2"><div class="flex items-center"><div class="loader h-4 w-4 border-2 border-purple-600 border-opacity-20 rounded-full mr-2"></div><p class="text-sm dark:text-gray-300">Thinking...</p></div></div></div>`;
  
  document.getElementById('aiQuestionInput').value = '';
  chatHistory.scrollTop = chatHistory.scrollHeight;
  
  const response = await getAIResponse(question);
  
  chatHistory.querySelectorAll('div').forEach(div => {
    if (div.textContent.includes('Thinking...')) div.remove();
  });
  
  chatHistory.innerHTML += `<div class="text-left mb-2"><div class="inline-block bg-purple-100 dark:bg-purple-900 rounded-lg px-3 py-2"><p class="text-sm dark:text-white">${response}</p></div></div>`;
});