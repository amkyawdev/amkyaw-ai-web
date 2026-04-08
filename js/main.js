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
const chatList = document.getElementById('chat-list');

// State
let isProcessing = false;
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

/**
 * Initialize the application
 */
async function init() {
    console.log('🤖 Amkyaw AI initializing...');
    
    // Render chat history
    renderChatHistory();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('✅ Amkyaw AI ready!');
}

/**
 * Render chat history in sidemenu
 */
function renderChatHistory() {
    if (!chatList) return;
    
    chatList.innerHTML = '';
    
    if (chatHistory.length === 0) {
        chatList.innerHTML = '<p class="text-xs text-gray-500 px-2 py-2">No chats yet</p>';
        return;
    }
    
    chatHistory.forEach((chat, index) => {
        const chatItem = document.createElement('button');
        chatItem.className = 'w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/5 transition group flex items-center gap-2';
        chatItem.innerHTML = `
            <i class="fa-regular fa-message text-gray-500 text-xs"></i>
            <span class="text-sm text-gray-300 truncate flex-1">${escapeHtml(chat.title)}</span>
        `;
        chatItem.addEventListener('click', () => loadChat(index));
        chatList.appendChild(chatItem);
    });
}

/**
 * Save current chat to history
 */
function saveChat(messages) {
    if (messages.length === 0) return;
    
    // Get title from first user message
    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage ? firstUserMessage.content.substring(0, 30) : 'New Chat';
    
    chatHistory.push({
        title: title,
        messages: messages.slice(0, 20), // Limit stored messages
        timestamp: Date.now()
    });
    
    // Keep only last 50 chats
    if (chatHistory.length > 50) {
        chatHistory = chatHistory.slice(-50);
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    renderChatHistory();
}

/**
 * Load a chat from history
 */
function loadChat(index) {
    const chat = chatHistory[index];
    if (!chat) return;
    
    clearMessages();
    
    // Re-render messages
    chat.messages.forEach(msg => {
        addMessage(msg.role, msg.content, false);
    });
    
    // Close sidemenu
    if (sidemenu) {
        sidemenu.classList.remove('active');
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

// Store current messages for history
let currentMessages = [];

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
    currentMessages.push({ role: 'user', content: message });
    
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
        currentMessages.push({ role: 'assistant', content: response });
        
        // Save to history after response
        setTimeout(() => {
            saveChat(currentMessages);
        }, 500);
        
    } catch (error) {
        console.error('Error processing message:', error);
        removeTypingIndicator();
        addMessage('assistant', 'အမှားဖြစ်သွားပါတယ်။ နောက်တစ်ခါ ကြိုးစားပါကွာ။', false);
        currentMessages.push({ role: 'assistant', content: 'အမှားဖြစ်သွားပါတယ်။ နောက်တစ်ခါ ကြိုးစားပါကွာ။' });
    } finally {
        isProcessing = false;
    }
}

/**
 * Handle new chat
 */
function handleNewChat() {
    // Save current chat before clearing
    if (currentMessages.length > 0) {
        saveChat(currentMessages);
    }
    
    currentMessages = [];
    clearMessages();
    console.log('🆕 New chat started');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);