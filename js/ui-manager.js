// UI Manager module - Renderer Molecule
// Handles message bubble rendering and auto-scroll

/**
 * Add a message to the chat container
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - The message content
 */
export function addMessage(role, content) {
    const chatContainer = document.getElementById('chat-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const suggestionButtons = document.getElementById('suggestion-buttons');
    
    // Hide welcome screen and suggestions after first message
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (suggestionButtons) suggestionButtons.style.display = 'none';
    chatContainer.classList.add('has-messages');

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const roleLabel = document.createElement('div');
    roleLabel.className = 'message-role';
    roleLabel.textContent = role === 'user' ? 'You' : 'Amkyaw AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(roleLabel);
    messageDiv.appendChild(contentDiv);
    
    chatContainer.appendChild(messageDiv);
    
    // Auto-scroll to bottom
    scrollToBottom();
}

/**
 * Show typing indicator
 * @returns {HTMLElement} The typing indicator element
 */
export function showTypingIndicator() {
    const chatContainer = document.getElementById('chat-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const suggestionButtons = document.getElementById('suggestion-buttons');
    
    // Hide welcome screen and suggestions
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (suggestionButtons) suggestionButtons.style.display = 'none';
    chatContainer.classList.add('has-messages');

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatContainer.appendChild(indicator);
    
    scrollToBottom();
    return indicator;
}

/**
 * Remove typing indicator
 */
export function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

/**
 * Scroll chat container to bottom
 */
export function scrollToBottom() {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

/**
 * Clear all messages (for new chat)
 */
export function clearMessages() {
    const chatContainer = document.getElementById('chat-container');
    const welcomeScreen = document.getElementById('welcome-screen');
    const suggestionButtons = document.getElementById('suggestion-buttons');
    
    // Remove all message elements
    const messages = chatContainer.querySelectorAll('.chat-message, .typing-indicator');
    messages.forEach(msg => msg.remove());
    
    // Show welcome screen and suggestions
    if (welcomeScreen) welcomeScreen.style.display = 'flex';
    if (suggestionButtons) suggestionButtons.style.display = 'grid';
    chatContainer.classList.remove('has-messages');
}

/**
 * Add suggestion button click handler
 * @param {Function} handler - Callback function for suggestion click
 */
export function setSuggestionHandlers(handler) {
    const buttons = document.querySelectorAll('.suggestion-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.querySelector('p:last-child').textContent;
            handler(text);
        });
    });
}