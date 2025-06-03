const functions = require('@google-cloud/functions-framework');
const {google} = require('googleapis');

functions.http('criarespacogooglechat', async (req, res) => {
  console.log('Webhook "criarespacogooglechat" foi chamado.');

  // Extrai os parâmetros da sessão do Dialogflow CX
  const nomeCliente = req.body.sessionInfo.parameters.nome || 'Não informado pelo chatbot';
  const emailCliente = req.body.sessionInfo.parameters.email || 'Não informado pelo chatbot';
  const assuntoCliente = req.body.sessionInfo.parameters.assunto || 'Não informado pelo chatbot';

  // Loga os dados recebidos (opcional, para debug)
  console.log(`Nome Cliente: ${nomeCliente}`);
  console.log(`Email Cliente: ${emailCliente}`);
  console.log(`Assunto Cliente: ${assuntoCliente}`);

  // ID do Espaço do Google Chat para onde a mensagem será enviada
  const idDoEspaco = 'space/AAQAc6S-6iY';

  let statusOperacao;
  let detalhesOperacao;

  try {
    // Autenticação com a API do Google Chat
    const authClient = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/chat.messages.create'],
    });

    const chatApi = google.chat({
      version: 'v1',
      auth: authClient,
    });

    // Monta a mensagem para o Chat
    const mensagemParaChat = {
      text: `Nova solicitação de atendimento via Chatbot SXS:\n\n*Cliente:* ${nomeCliente}\n*E-mail:* ${emailCliente}\n*Assunto:* ${assuntoCliente}\n\nPor favor, assuma o atendimento.`
    };

    // Envia a mensagem para o espaço
    console.log(`Enviando mensagem para o Espaço: ${idDoEspaco}`);
    const respostaApiChat = await chatApi.spaces.messages.create({
      parent: idDoEspaco,
      requestBody: mensagemParaChat,
    });

    console.log('Mensagem enviada com sucesso para o Espaço no Google Chat:', JSON.stringify(respostaApiChat.data, null, 2));
    statusOperacao = "MENSAGEM_ENVIADA_COM_SUCESSO_ESPACO";
    detalhesOperacao = `Mensagem enviada para o Espaço. ID da Mensagem: ${respostaApiChat.data.name}`;

  } catch (error) {
    console.error('ERRO ao tentar enviar mensagem para o Google Chat:');
    let errorMessage = error.message;

    if (error.response && error.response.data && error.response.data.error) {
      console.error('Detalhes do erro da API:', JSON.stringify(error.response.data.error, null, 2));
      errorMessage = `API Error: ${error.response.data.error.message} (Code: ${error.response.data.error.code}, Status: ${error.response.data.error.status})`;
      if (error.response.data.error.details) {
        console.error('Mais detalhes:', JSON.stringify(error.response.data.error.details, null, 2));
        errorMessage += ` Details: ${JSON.stringify(error.response.data.error.details)}`;
      }
    } else if (error.errors) {
      console.error('Detalhes do erro (array):', JSON.stringify(error.errors, null, 2));
      errorMessage = error.errors.map(e => e.message).join('; ');
    } else {
      console.error('Erro não estruturado ou de rede:', error);
    }

    statusOperacao = "ERRO_AO_ENVIAR_DM";
    detalhesOperacao = errorMessage;
  }

  // Responde ao Dialogflow CX
  const webhookResponse = {
    sessionInfo: {
      parameters: {
        "statusGoogleChat": statusOperacao,
        "detalhesGoogleChat": detalhesOperacao
      }
    }
  };
  console.log('Respondendo ao Dialogflow CX:', JSON.stringify(webhookResponse, null, 2));
  res.status(200).json(webhookResponse);
});