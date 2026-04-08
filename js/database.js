// Database module - CSV Engine with PapaParse

import { config } from './config.js';
import { detectIntent } from './intent-router.js';

// Cache for loaded CSV data
let csvCache = new Map();

/**
 * Load and parse CSV file
 * @param {string} csvFile - CSV filename
 * @returns {Promise<Array>} Array of {role, content} objects
 */
export async function loadCSV(csvFile) {
    // Check cache first
    if (csvCache.has(csvFile)) {
        return csvCache.get(csvFile);
    }
    
    try {
        const response = await fetch(config.csvPath + csvFile);
        if (!response.ok) {
            throw new Error(`Failed to load ${csvFile}`);
        }
        
        const csvText = await response.text();
        const data = parseCSV(csvText);
        
        // Cache the result
        csvCache.set(csvFile, data);
        console.log(`Loaded ${data.length} entries from ${csvFile}`);
        
        return data;
    } catch (error) {
        console.error('Error loading CSV:', error);
        return [];
    }
}

/**
 * Parse CSV text to JSON array
 * @param {string} csvText - CSV content
 * @returns {Array} Array of {role, content} objects
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const result = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parsing (role,content)
        const firstComma = line.indexOf(',');
        if (firstComma === -1) continue;
        
        let role = line.substring(0, firstComma).trim().toLowerCase();
        let content = line.substring(firstComma + 1).trim();
        
        // Remove surrounding quotes if present
        if (content.startsWith('"') && content.endsWith('"')) {
            content = content.slice(1, -1);
        }
        
        if (role === 'user' || role === 'assistant') {
            result.push({ role, content });
        }
    }
    
    return result;
}

/**
 * Find local answer using intent routing
 * @param {string} userMessage - User's input message
 * @returns {Promise<string|null>} The assistant's response or null
 */
export async function findLocalAnswer(userMessage) {
    // Step 1: Detect intent
    const csvFile = detectIntent(userMessage);
    console.log(`Using CSV: ${csvFile}`);
    
    // Step 2: Load the CSV
    const data = await loadCSV(csvFile);
    
    if (data.length === 0) {
        return getFallback();
    }
    
    // Step 3: Search for matching user question
    const normalizedInput = userMessage.toLowerCase().trim();
    
    for (let i = 0; i < data.length; i++) {
        if (data[i].role === 'user') {
            const storedQuestion = data[i].content.toLowerCase().trim();
            
            // Check for match
            if (normalizedInput === storedQuestion || 
                normalizedInput.includes(storedQuestion) ||
                storedQuestion.includes(normalizedInput)) {
                
                // Return the next assistant response
                if (i + 1 < data.length && data[i + 1].role === 'assistant') {
                    return data[i + 1].content;
                }
            }
        }
    }
    
    // Step 4: If no match, try fallback CSV
    return getFallback();
}

/**
 * Get random fallback response
 * @returns {string} Fallback message
 */
async function getFallback() {
    const fallbackData = await loadCSV(config.fallbackCsv);
    
    // Get random assistant message from fallback
    const assistantMessages = fallbackData.filter(m => m.role === 'assistant');
    
    if (assistantMessages.length > 0) {
        const randomIndex = Math.floor(Math.random() * assistantMessages.length);
        return assistantMessages[randomIndex].content;
    }
    
    return 'မင်္ဂလာပါ၊ ဒီမေးခွန်းရဲ့ အဖြေကို ကျွန်တော်မသိပါဘူး။';
}

/**
 * Get all messages from a specific CSV
 * @param {string} csvFile - CSV filename
 * @returns {Promise<Array>} Array of messages
 */
export async function getMessagesFromCSV(csvFile) {
    return await loadCSV(csvFile);
}