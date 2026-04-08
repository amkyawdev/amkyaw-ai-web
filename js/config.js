// Configuration settings for Amkyaw AI
// Replace 'YOUR_API_KEY' with your actual Groq API key
// Get your free API key at: https://console.groq.com/

export const config = {
    // Groq API Configuration
    apiKey: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    
    // AI Model Configuration
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    maxTokens: 1024,
    
    // System prompt for the AI
    systemPrompt: `You are Amkyaw AI, a helpful AI assistant. 
You respond in Burmese (Myanmar) language. 
Be friendly, helpful, and concise in your responses.`
};