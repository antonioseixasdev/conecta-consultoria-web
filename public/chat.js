document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('chat-input');
    const sendButton = document.querySelector('button[type="submit"]');

    const N8N_WEBHOOK_URL = 'https://sxsconsultoria.app.n8n.cloud/webhook/e35b16d3-bb8d-44a5-9294-2982cfb286c7';

    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

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

            const rawText = await response.text();
            let responseText = rawText;

            try {
                // Tenta parsear o texto direto
                const parsed = JSON.parse(rawText);

                // Caso venha como string JSON serializada, tenta parsear novamente
                if (typeof parsed === 'string') {
                    const innerParsed = JSON.parse(parsed);
                    responseText = innerParsed.output || parsed;
                } else {
                    responseText = parsed.output || rawText;
                }
            } catch (e) {
                console.warn('Não foi possível fazer parsing do JSON:', e);
            }

            appendMessage(responseText, 'received');

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
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
});
