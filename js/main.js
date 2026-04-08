// Main module - Orchestrator

import { findLocalAnswer } from './database.js';
import { addMessage, showTypingIndicator, removeTypingIndicator, scrollToBottom, clearMessages, setSuggestionHandlers } from './ui-manager.js';

// DOM Elements
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const menuToggle = document.getElementById('menu-toggle');
const sidemenu = document.getElementById('sidemenu');
const closeSidemenu = document.getElementById('close-sidemenu');

// State
let isProcessing = false;

/**
 * Initialize the application
 */
async function init() {
    console.log('🤖 Amkyaw AI initializing...');
    
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
    
    // Sidemenu toggle
    if (menuToggle && sidemenu) {
        menuToggle.addEventListener('click', () => {
            sidemenu.classList.add('active');
        });
    }
    
    if (closeSidemenu && sidemenu) {
        closeSidemenu.addEventListener('click', () => {
            sidemenu.classList.remove('active');
        });
    }
    
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
    addMessage('user', message, false);
    
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
        // Show typing indicator
        const indicator = showTypingIndicator();
        
        // Get response from local CSV database
        const response = await findLocalAnswer(message);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add assistant response with streaming effect
        addMessage('assistant', response, true);
        
    } catch (error) {
        console.error('Error processing message:', error);
        removeTypingIndicator();
        addMessage('assistant', 'အမှားဖြစ်သွားပါတယ်။ နောက်တစ်ခါ ကြိုးစားပါကွာ။', false);
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