document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Replace with your actual n8n webhook URL
    const N8N_WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';

    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender); // sender can be 'sent' or 'received'
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }

    async function sendMessageToN8n(messageText) {
        appendMessage(messageText, 'sent');
        messageInput.value = ''; // Clear input field

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                body: JSON.stringify({ message: messageText }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json(); // Assuming n8n responds with JSON

            // Adjust this part based on the actual structure of your n8n webhook response
            // For example, if n8n returns { "reply": "This is a response" }
            if (responseData && responseData.reply) {
                appendMessage(responseData.reply, 'received');
            } else {
                // Fallback if the response structure is different or no specific reply field
                appendMessage(JSON.stringify(responseData), 'received');
                console.warn('Received unexpected response structure from n8n:', responseData);
            }

        } catch (error) {
            console.error('Error sending message to n8n:', error);
            appendMessage(`Error: Could not connect to the webhook. ${error.message}`, 'received');
        }
    }

    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (messageText) {
            sendMessageToN8n(messageText);
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const messageText = messageInput.value.trim();
            if (messageText) {
                sendMessageToN8n(messageText);
            }
        }
    });

    // Example: Initial message or greeting (optional)
    // appendMessage("Olá! Como posso ajudar?", 'received');
});
