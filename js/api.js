// API module - Connector Molecule
// Handles Groq API requests when answer is not in local database

import { config } from './config.js';
import { getKnowledgeBaseMessages } from './database.js';

/**
 * Send a message to the Groq API
 * @param {string} userMessage - The user's input message
 * @returns {Promise<string>} The AI's response
 */
export async function getAIResponse(userMessage) {
    try {
        // Get knowledge base messages for context
        const knowledgeBase = getKnowledgeBaseMessages();
        
        // Build messages array with system prompt and context
        const messages = [
            { role: 'system', content: config.systemPrompt },
            // Add knowledge base as context (last 10 messages)
            ...knowledgeBase.slice(-10),
            // Add current user message
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: config.model,
                messages: messages,
                temperature: config.temperature,
                max_tokens: config.maxTokens
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.choices && data.choices.length > 0) {
            return data.choices[0].message.content;
        } else {
            throw new Error('No response from AI');
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Check if API key is configured
 * @returns {boolean} True if API key is set
 */
export function isAPIConfigured() {
    return config.apiKey && 
           config.apiKey !== 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' &&
           config.apiKey.startsWith('gsk_');
}