// API module - Connector Molecule
// This version uses local dataset only (no external API)

import { config } from './config.js';
import { getKnowledgeBaseMessages } from './database.js';

/**
 * Send a message to the Groq API (Disabled - using local dataset only)
 * @param {string} userMessage - The user's input message
 * @returns {Promise<string>} The AI's response
 */
export async function getAIResponse(userMessage) {
    // Disabled - using local dataset only
    throw new Error('External API is disabled. Please add more data to the local dataset.');
}

/**
 * Check if API is configured
 * @returns {boolean} False (API disabled)
 */
export function isAPIConfigured() {
    return false;
}