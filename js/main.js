// Main module - Orchestrator

import { findLocalAnswer } from './database.js';
import { addMessage, showTypingIndicator, removeTypingIndicator, scrollToBottom, clearMessages, setSuggestionHandlers } from './ui-manager.js';

// State
let isProcessing = false;
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
let currentMessages = [];

// DOM Elements - will be selected in init
let userInput, sendBtn, newChatBtn, menuToggle, sidemenu, closeSidemenu, chatList;

/**
 * Initialize the application
 */
function init() {
    console.log('🤖 Amkyaw AI initializing...');
    
    // Get DOM elements inside init
    userInput = document.getElementById('user-input');
    sendBtn = document.getElementById('send-btn');
    newChatBtn = document.getElementById('new-chat-btn');
    menuToggle = document.getElementById('menu-toggle');
    sidemenu = document.getElementById('sidemenu');
    closeSidemenu = document.getElementById('close-sidemenu');
    chatList = document.getElementById('chat-list');
    
    console.log('🔔 userInput:', userInput);
    console.log('🔔 sendBtn:', sendBtn);
    
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
    if (!chatList) {
        console.warn('chatList element not found');
        return;
    }
    
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
    
    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage ? firstUserMessage.content.substring(0, 30) : 'New Chat';
    
    chatHistory.push({
        title: title,
        messages: messages.slice(0, 20),
        timestamp: Date.now()
    });
    
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
    
    chat.messages.forEach(msg => {
        addMessage(msg.role, msg.content, false);
    });
    
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
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    }
    
    // Enter key in textarea
    if (userInput) {
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
        
        // Auto-resize textarea
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 160) + 'px';
        });
    }
    
    // New chat button
    if (newChatBtn) {
        newChatBtn.addEventListener('click', handleNewChat);
    }
    
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
        if (userInput) userInput.value = text;
        handleSendMessage();
    });
}

/**
 * Handle send message
 */
function handleSendMessage() {
    if (!userInput || !sendBtn) {
        console.error('DOM elements not found');
        return;
    }
    
    const message = userInput.value.trim();
    
    if (!message || isProcessing) return;
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Add user message to UI
    addMessage('user', message, false);
    currentMessages.push({ role: 'user', content: message });
    
    // Process the message
    processMessage(message);
}

/**
 * Process the user message
 */
function processMessage(message) {
    isProcessing = true;
    
    try {
        const indicator = showTypingIndicator();
        
        findLocalAnswer(message).then(response => {
            removeTypingIndicator();
            
            addMessage('assistant', response, true);
            currentMessages.push({ role: 'assistant', content: response });
            
            setTimeout(() => {
                saveChat(currentMessages);
            }, 500);
            
            isProcessing = false;
        }).catch(error => {
            console.error('Error getting answer:', error);
            removeTypingIndicator();
            addMessage('assistant', 'အမှားဖြစ်သွားပါတယ်။ နောက်တစ်ခါ ကြိုးစားပါကွာ။', false);
            currentMessages.push({ role: 'assistant', content: 'အမှားဖြစ်သွားပါတယ်။ နောက်တစ်ခါ ကြိုးစားပါကွာ။' });
            isProcessing = false;
        });
        
    } catch (error) {
        console.error('Error processing message:', error);
        removeTypingIndicator();
        isProcessing = false;
    }
}

/**
 * Handle new chat
 */
function handleNewChat() {
    if (currentMessages.length > 0) {
        saveChat(currentMessages);
    }
    
    currentMessages = [];
    clearMessages();
    console.log('🆕 New chat started');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);