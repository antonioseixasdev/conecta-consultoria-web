document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('chat-input');
    const sendButton = document.querySelector('button[type="submit"]');

    const N8N_WEBHOOK_URL = 'https://sxsconsultoria.app.n8n.cloud/webhook/e35b16d3-bb8d-44a5-9294-2982cfb286c7';

    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = formatText(text); // Aplica formatação
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatText(text) {
        // Converte **negrito**
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Divide em linhas e trata listas e parágrafos
        const lines = text.split('\n').map(line => {
            if (line.trim().startsWith('- ')) {
                return '<li>' + line.trim().substring(2) + '</li>';
            } else {
                return '<p>' + line.trim() + '</p>';
            }
        });

        // Agrupa <li> em uma <ul> se houver
        const grouped = [];
        let inList = false;

        lines.forEach(line => {
            if (line.startsWith('<li>')) {
                if (!inList) {
                    grouped.push('<ul>');
                    inList = true;
                }
                grouped.push(line);
            } else {
                if (inList) {
                    grouped.push('</ul>');
                    inList = false;
                }
                grouped.push(line);
            }
        });

        if (inList) {
            grouped.push('</ul>');
        }

        return grouped.join('');
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
            console.log("🧾 Resposta bruta do backend:", rawText);

            let cleanedMessage = rawText;

            try {
                let parsed = JSON.parse(rawText);

                if (typeof parsed === 'string') {
                    parsed = JSON.parse(parsed);
                }

                cleanedMessage = parsed.output || parsed.message || JSON.stringify(parsed);

            } catch (e) {
                console.warn("⚠️ Falha ao parsear JSON, exibindo texto cru.");
            }

            appendMessage(cleanedMessage, 'received');

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            appendMessage(`Erro: Não foi possível conectar ao servidor. ${error.message}`, 'received');
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
