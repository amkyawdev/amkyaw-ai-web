// Streaming module - Stream responses character by character

/**
 * Stream a response to the chat container with typing effect
 * @param {string} content - The content to stream
 * @param {HTMLElement} messageElement - The message element to append content to
 * @param {number} delay - Delay in ms between each character (default: 20)
 * @returns {Promise<void>} Promise that resolves when streaming is complete
 */
export function streamResponse(content, messageElement, delay = 20) {
    return new Promise((resolve) => {
        const contentDiv = messageElement.querySelector('.message-content');
        if (!contentDiv) {
            resolve();
            return;
        }
        
        let index = 0;
        contentDiv.textContent = '';
        
        function typeNextChar() {
            if (index < content.length) {
                contentDiv.textContent += content[index];
                index++;
                // Scroll to bottom
                const chatContainer = document.getElementById('chat-container');
                if (chatContainer) {
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }
                setTimeout(typeNextChar, delay);
            } else {
                resolve();
            }
        }
        
        typeNextChar();
    });
}

/**
 * Create a message element for streaming
 * @param {string} role - 'user' or 'assistant'
 * @returns {HTMLElement} The message element
 */
export function createStreamingMessageElement(role) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const roleLabel = document.createElement('div');
    roleLabel.className = 'message-role';
    roleLabel.textContent = role === 'user' ? 'You' : 'Amkyaw AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = ''; // Start empty for streaming
    
    messageDiv.appendChild(roleLabel);
    messageDiv.appendChild(contentDiv);
    
    return messageDiv;
}