// Configuration settings for Amkyaw AI
// This version uses local dataset only (no Groq API)

export const config = {
    // AI Model Configuration (for reference only)
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    maxTokens: 1024,
    
    // System prompt for the AI
    systemPrompt: `You are Amkyaw AI, a helpful AI assistant. 
You respond in Burmese (Myanmar) language. 
Be friendly, helpful, and concise in your responses.`
};