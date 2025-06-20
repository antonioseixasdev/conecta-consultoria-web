document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('chat-input');
    const sendButton = document.querySelector('button[type="submit"]');

    // URL real do webhook do n8n
    const N8N_WEBHOOK_URL = 'https://sxsconsultoria.app.n8n.cloud/webhook/e35b16d3-bb8d-44a5-9294-2982cfb286c7';

    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender); // sender: 'sent' ou 'received'
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Função para gerar um sessionId único por usuário (pode ser aprimorado)
    function getSessionId() {
        let sessionId = localStorage.getItem('chatSessionId');
        if (!sessionId) {
            sessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
            localStorage.setItem('chatSessionId', sessionId);
        }
        return sessionId;
    }

    async function sendMessageToN8n(messageText) {
        appendMessage(messageText, 'sent');
        messageInput.value = '';

        const sessionId = getSessionId();

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                body: JSON.stringify({
                    sessionId: sessionId,
                    chatInput: messageText
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Agora aceita texto puro como resposta do n8n
            const responseText = await response.text();
            appendMessage(responseText, 'received');

        } catch (error) {
            console.error('Error sending message to n8n:', error);
            appendMessage(`Erro: Não foi possível conectar ao webhook. ${error.message}`, 'received');
        }
    }

    sendButton.addEventListener('click', (e) => {
        e.preventDefault();
        const messageText = messageInput.value.trim();
        if (messageText) {
            sendMessageToN8n(messageText);
        }
    });

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const messageText = messageInput.value.trim();
            if (messageText) {
                sendMessageToN8n(messageText);
            }
        }
    });

    // Mensagem inicial opcional
    // appendMessage("Olá! Como posso ajudar?", 'received');
});