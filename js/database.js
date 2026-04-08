// Database module - Memory Molecule
// Fetches dataset from HuggingFace and converts to JSON Array

// Store for the knowledge base
let knowledgeBase = [];

/**
 * Load knowledge base from HuggingFace dataset
 * @returns {Promise<Array>} Array of {role, content} objects
 */
export async function loadKnowledgeBase() {
    try {
        // Use HuggingFace Inference API to load dataset info
        // Or use the dataset viewer API
        const datasetUrl = 'https://huggingface.co/datasets/amkyawdev/AmkyawDev-Dataset';
        
        // Try loading from dataset files directly
        const files = [
            'train.csv',
            'test.csv', 
            'validation.csv'
        ];
        
        const allData = [];
        
        for (const file of files) {
            try {
                const response = await fetch(`${datasetUrl}/raw/main/${file}`);
                if (!response.ok) {
                    // Try alternative URL
                    const altResponse = await fetch(`${datasetUrl}/resolve/main/${file}`);
                    if (altResponse.ok) {
                        const csvText = await altResponse.text();
                        const parsed = parseCSV(csvText);
                        allData.push(...parsed);
                        console.log(`Loaded ${parsed.length} entries from ${file}`);
                    }
                } else {
                    const csvText = await response.text();
                    const parsed = parseCSV(csvText);
                    allData.push(...parsed);
                    console.log(`Loaded ${parsed.length} entries from ${file}`);
                }
            } catch (e) {
                console.warn(`Could not load ${file}:`, e.message);
            }
        }
        
        // If still no data, load a small sample from known data
        if (allData.length === 0) {
            console.log('Using fallback sample data');
            allData.push(...getSampleData());
        }
        
        knowledgeBase = allData;
        console.log('Total knowledge base loaded:', knowledgeBase.length, 'entries');
        return knowledgeBase;
    } catch (error) {
        console.error('Error loading knowledge base:', error);
        // Load sample data on error
        knowledgeBase = getSampleData();
        return knowledgeBase;
    }
}

/**
 * Get sample data when dataset cannot be loaded
 * @returns {Array} Sample conversation pairs
 */
function getSampleData() {
    return [
        { role: 'user', content: 'ဟိုင်း' },
        { role: 'assistant', content: 'ဟိုင်း၊ ဘာများ ကူညီပေးရမလဲခင်ဗျာ။' },
        { role: 'user', content: 'မင်္ဂလာပါ' },
        { role: 'assistant', content: 'မင်္ဂလာပ။ ဘာများကူညီပေးရမလဲ။' },
        { role: 'user', content: 'နေကောင်းလား' },
        { role: 'assistant', content: 'နေကောင်းပါတယ်။ သင်ရော နေကောင်းရဲ့လား။' },
    ];
}

/**
 * Parse CSV text to JSON array (with messages JSON column)
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
        
        try {
            // The CSV has two columns: messages (JSON array), tags
            // Find the first comma to separate columns
            const firstComma = line.indexOf(',');
            if (firstComma === -1) continue;
            
            let messagesStr = line.substring(0, firstComma).trim();
            // Remove surrounding quotes if present
            if (messagesStr.startsWith('"') && messagesStr.endsWith('"')) {
                messagesStr = messagesStr.slice(1, -1);
            }
            
            // Parse the JSON messages array
            const messages = JSON.parse(messagesStr);
            
            // Extract user and assistant messages
            for (const msg of messages) {
                if (msg.role === 'user' || msg.role === 'assistant') {
                    result.push({
                        role: msg.role,
                        content: msg.content
                    });
                }
            }
        } catch (e) {
            // Skip malformed rows
            console.warn('Skipping malformed row:', e);
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