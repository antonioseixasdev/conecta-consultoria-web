document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('chat-input');
    const sendButton = document.querySelector('button[type="submit"]');

    const N8N_WEBHOOK_URL = 'https://sxsconsultoria.app.n8n.cloud/webhook/e35b16d3-bb8d-44a5-9294-2982cfb286c7';

    function appendMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = formatText(text);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatText(text) {
        // Negrito: **texto** → <strong>texto</strong>
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Divide por quebra de linha dupla para separar blocos
        const blocks = text.split(/\n\s*\n/);

        return blocks.map(block => {
            const trimmed = block.trim();

            // Se for uma lista (linhas com "- "), trata como <ul><li>
            if (/^- /.test(trimmed)) {
                const items = trimmed.split('\n').map(line =>
                    '<li>' + line.replace(/^- /, '').trim() + '</li>'
                ).join('');
                return `<ul class="chat-list">${items}</ul>`;
            }

            // Se for parágrafo comum
            return `<p class="chat-paragraph">${trimmed}</p>`;
        }).join('');
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
            }
        }
    });
});
