// Database module - Memory Molecule
// Fetches CSV and converts to JSON Array

import { config } from './config.js';

// Store for the knowledge base
let knowledgeBase = [];

/**
 * Fetch CSV file and convert to JSON array
 * @returns {Promise<Array>} Array of {role, content} objects
 */
export async function loadKnowledgeBase() {
    try {
        const response = await fetch('./data/train.csv');
        const csvText = await response.text();
        
        knowledgeBase = parseCSV(csvText);
        console.log('Knowledge base loaded:', knowledgeBase.length, 'entries');
        return knowledgeBase;
    } catch (error) {
        console.error('Error loading knowledge base:', error);
        return [];
    }
}

/**
 * Parse CSV text to JSON array
 * @param {string} csvText - CSV content
 * @returns {Array} Array of objects
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const result = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Handle CSV with quotes
        const match = line.match(/^([^,]*),(.+)$/);
        if (match) {
            const role = match[1].trim();
            // Remove surrounding quotes if present
            let content = match[2].trim();
            if (content.startsWith('"') && content.endsWith('"')) {
                content = content.slice(1, -1);
            }
            
            result.push({ role, content });
        }
    }
    
    return result;
}

/**
 * Search for a matching user question in the knowledge base
 * @param {string} userMessage - The user's input message
 * @returns {string|null} The assistant's response if found, null otherwise
 */
export function findLocalAnswer(userMessage) {
    const normalizedInput = userMessage.toLowerCase().trim();
    
    // Search through knowledge base for matching user questions
    for (let i = 0; i < knowledgeBase.length; i++) {
        if (knowledgeBase[i].role === 'user') {
            const storedQuestion = knowledgeBase[i].content.toLowerCase().trim();
            
            // Check if the input matches or contains the stored question
            if (normalizedInput === storedQuestion || 
                normalizedInput.includes(storedQuestion) ||
                storedQuestion.includes(normalizedInput)) {
                
                // Find the corresponding assistant response (next entry)
                if (i + 1 < knowledgeBase.length && knowledgeBase[i + 1].role === 'assistant') {
                    return knowledgeBase[i + 1].content;
                }
            }
        }
    }
    
    return null;
}

/**
 * Get all messages from knowledge base (for context)
 * @returns {Array} All messages from knowledge base
 */
export function getKnowledgeBaseMessages() {
    return knowledgeBase;
}

export { knowledgeBase };