// Main module - The Brain Molecule
// Coordinates all other modules: database, API, and UI

import { loadKnowledgeBase, findLocalAnswer } from './database.js';
import { getAIResponse, isAPIConfigured } from './api.js';
import { addMessage, showTypingIndicator, removeTypingIndicator, scrollToBottom, clearMessages, setSuggestionHandlers } from './ui-manager.js';

// DOM Elements
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat-btn');

// State
let isProcessing = false;

/**
 * Initialize the application
 */
async function init() {
    console.log('🤖 Amkyaw AI initializing...');
    
    // Load knowledge base from CSV
    await loadKnowledgeBase();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('✅ Amkyaw AI ready!');
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // Send button click
    sendBtn.addEventListener('click', handleSendMessage);
    
    // Enter key in textarea
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = Math.min(userInput.scrollHeight, 160) + 'px';
    });
    
    // New chat button
    newChatBtn.addEventListener('click', handleNewChat);
    
    // Suggestion buttons
    setSuggestionHandlers((text) => {
        userInput.value = text;
        handleSendMessage();
    });
}

/**
 * Handle send message
 */
async function handleSendMessage() {
    const message = userInput.value.trim();
    
    if (!message || isProcessing) return;
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Add user message to UI
    addMessage('user', message);
    
    // Process the message
    await processMessage(message);
}

/**
 * Process the user message
 * @param {string} message - User's message
 */
async function processMessage(message) {
    isProcessing = true;
    
    try {
        // Step 1: Check local knowledge base first
        let response = findLocalAnswer(message);
        
        if (response) {
            // Found in local database
            console.log('📚 Found answer in local database');
            addMessage('assistant', response);
        } else {
            // Not found locally - check if API is configured
            if (isAPIConfigured()) {
                console.log('🌐 Calling Groq API...');
                
                // Show typing indicator
                const indicator = showTypingIndicator();
                
                try {
                    // Get response from Groq API
                    response = await getAIResponse(message);
                    removeTypingIndicator();
                    addMessage('assistant', response);
                } catch (error) {
                    removeTypingIndicator();
                    console.error('API Error:', error);
                    addMessage('assistant', 'တောင်းပါးပါတယ်၊ အမှားဖြစ်သွားပါတယ်။ နောက်တစ်ခါ ကြိုးစားပါကွာ။');
                }
            } else {
                // API not configured
                console.log('⚠️ API not configured');
                addMessage('assistant', 'မင်္ဂလာပါ၊ ဒီမေးခွန်းရဲ့ အဖြေကို ကျွန်တော်မသိပါဘူး။ Groq API Key ထည်းဝင်ပါလား။');
            }
        }
    } catch (error) {
        console.error('Error processing message:', error);
        addMessage('assistant', 'အမှားဖြစ်သွားပါတယ်။ နောက်တစ်ခါ ကြိုးစားပါကွာ။');
    } finally {
        isProcessing = false;
    }
}

/**
 * Handle new chat
 */
function handleNewChat() {
    clearMessages();
    console.log('🆕 New chat started');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);