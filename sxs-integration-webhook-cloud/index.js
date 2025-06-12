const functions = require('@google-cloud/functions-framework');

// O nome aqui deve ser 'verificardisponibilidadeespecialistas'
functions.http('verificardisponibilidadeespecialistas', (req, res) => {
  // Sua lógica para verificar disponibilidade aqui...
  const especialistaDisponivel = true; // Exemplo

  const webhookResponse = {
    sessionInfo: {
      parameters: {
        "disponibilidadeEspecialista": especialistaDisponivel
      }
    }
    // Você pode adicionar fulfillment_response.messages aqui se quiser
  };

  res.status(200).json(webhookResponse);
});