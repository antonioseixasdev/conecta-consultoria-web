const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  console.log('Webhook chamado com os parâmetros:', req.body);
  
  // Extrair parâmetros da requisição
  const { nome, email, assunto } = req.body.sessionInfo?.parameters || {};
  
  // Lógica para criar espaço no Google Chat
  // Neste exemplo, simulamos que o chat é criado com sucesso 90% do tempo
  const chatCriado = Math.random() < 0.9;
  const chatUrl = chatCriado ? `https://chat.google.com/room/example-${Date.now( )}` : null;
  
  console.log(`Criação de chat para ${nome} (${email}): chat_criado = ${chatCriado}`);
  
  // Resposta formatada para o Dialogflow CX
  res.json({
    "fulfillment_response": {
      "messages": [
        {
          "text": {
            "text": [chatCriado 
              ? "Espaço no Google Chat criado com sucesso." 
              : "Não foi possível criar o espaço no Google Chat."]
          }
        }
      ]
    },
    "session_info": {
      "parameters": {
        "chat_criado": chatCriado,
        "chat_url": chatUrl
      }
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});