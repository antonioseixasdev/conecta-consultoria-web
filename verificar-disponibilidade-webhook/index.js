const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.post('/', (req, res) => {
  console.log('Webhook chamado com os parâmetros:', req.body);
  
  // Extrair parâmetros da requisição
  const { nome, email, assunto } = req.body.sessionInfo?.parameters || {};
  
  // Lógica para verificar disponibilidade de especialistas
  // Neste exemplo, simulamos que há especialistas disponíveis 70% do tempo
  const especialistaDisponivel = Math.random() < 0.7;
  
  console.log(`Verificação para ${nome} (${email}): especialista_disponivel = ${especialistaDisponivel}`);
  
  // Resposta formatada para o Dialogflow CX
  res.json({
    "fulfillment_response": {
      "messages": [
        {
          "text": {
            "text": ["Verificação de disponibilidade concluída."]
          }
        }
      ]
    },
    "session_info": {
      "parameters": {
        "especialista_disponivel": especialistaDisponivel
      }
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
