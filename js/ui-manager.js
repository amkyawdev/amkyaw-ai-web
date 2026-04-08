// UI Manager - Renderer with Streaming Effect

const chatContainer = document.getElementById('chat-container');
const welcomeScreen = document.getElementById('welcome-screen');
const suggestionButtons = document.getElementById('suggestion-buttons');

/**
 * Add a message to the chat container
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - The message content
 * @param {boolean} streaming - Whether to show with typing effect
 */
export function addMessage(role, content, streaming = false) {
    // Hide welcome screen and suggestions after first message
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (suggestionButtons) suggestionButtons.style.display = 'none';
    if (chatContainer) chatContainer.classList.add('has-messages');

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const roleLabel = document.createElement('div');
    roleLabel.className = 'message-role';
    roleLabel.textContent = role === 'user' ? 'You' : 'Amkyaw AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    messageDiv.appendChild(roleLabel);
    messageDiv.appendChild(contentDiv);
    
    if (chatContainer) chatContainer.appendChild(messageDiv);
    
    if (streaming) {
        // Stream the content character by character
        streamText(content, contentDiv);
    } else {
        contentDiv.textContent = content;
    }
    
    scrollToBottom();
}

/**
 * Stream text with typewriter effect
 * @param {string} text - Text to stream
 * @param {HTMLElement} element - Element to append text to
 */
function streamText(text, element) {
    let index = 0;
    const speed = 30; // ms per character
    
    function typeNext() {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
            scrollToBottom();
            setTimeout(typeNext, speed);
        }
    }
    
    typeNext();
}

/**
 * Show typing indicator
 * @returns {HTMLElement} The typing indicator element
 */
export function showTypingIndicator() {
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (suggestionButtons) suggestionButtons.style.display = 'none';
    if (chatContainer) chatContainer.classList.add('has-messages');

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    
    indicator.innerHTML = '<span></span><span></span><span></span>';
    
    if (chatContainer) chatContainer.appendChild(indicator);
    
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
    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

/**
 * Clear all messages (for new chat)
 */
export function clearMessages() {
    if (!chatContainer) return;
    
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