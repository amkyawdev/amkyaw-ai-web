// Intent Router - Classifies user input and routes to correct CSV

import { config } from './config.js';

/**
 * Detect intent from user input based on keywords
 * @param {string} userInput - The user's input message
 * @returns {string} The CSV filename to use
 */
export function detectIntent(userInput) {
    const input = userInput.toLowerCase().trim();
    
    // Check each intent for keyword matches
    for (const [intentName, intentData] of Object.entries(config.intents)) {
        for (const keyword of intentData.keywords) {
            if (input.includes(keyword.toLowerCase())) {
                console.log(`Intent detected: ${intentName} (matched: ${keyword})`);
                return intentData.csv;
            }
        }
    }
    
    // Default to chat/intent if no match
    console.log('No specific intent, using default');
    return config.intents.chat.csv;
}