const functions = require('@google-cloud/functions-framework');
const {google} = require('googleapis');

functions.http('criarespacogooglechat', async (req, res) => {
  console.log('Webhook "criarespacogooglechat" foi chamado.');

  // Logs para depuração da estrutura recebida
  if (req.body && req.body.sessionInfo) {
    console.log('Conteúdo de req.body.sessionInfo:', JSON.stringify(req.body.sessionInfo, null, 2));
    if (req.body.sessionInfo.parameters) {
      console.log('Parâmetros da sessão recebidos (req.body.sessionInfo.parameters):', JSON.stringify(req.body.sessionInfo.parameters, null, 2));
    } else {
      console.log('req.body.sessionInfo.parameters está UNDEFINED ou NULO.');
    }
  } else {
    console.log('req.body ou req.body.sessionInfo está UNDEFINED ou NULO.');
    console.log('Corpo completo da requisição (fallback):', JSON.stringify(req.body, null, 2));
  }

  // Extração mais robusta dos parâmetros
  const parameters = (req.body && req.body.sessionInfo && req.body.sessionInfo.parameters) ? req.body.sessionInfo.parameters : {};
  
  // Tenta acessar 'email' e depois 'e-mail' como fallback, antes do valor padrão
  const nomeCliente = parameters.nome || 'Não informado pelo chatbot';
  let emailCliente = parameters.email; // Tenta primeiro 'email' (sem hífen)
  if (!emailCliente && parameters['e-mail']) { // Se 'email' não veio, tenta 'e-mail' (com hífen)
    emailCliente = parameters['e-mail'];
  }
  emailCliente = emailCliente || 'Não informado pelo chatbot'; // Aplica o fallback final

  const assuntoCliente = parameters.assunto || 'Não informado pelo chatbot';

  console.log(`Nome Cliente (extraído): ${nomeCliente}`);
  console.log(`Email Cliente (extraído): ${emailCliente}`);
  console.log(`Assunto Cliente (extraído): ${assuntoCliente}`);

  const idDoEspaco = 'spaces/AAQAD4SSaW8';
  let statusOperacao;
  let detalhesOperacao;
  let linkMensagemGoogleChat = null;

  try {
    const authClient = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/chat.messages.create'],
    });

    const chatApi = google.chat({
      version: 'v1',
      auth: authClient,
    });

    const mensagemParaChat = {
      text: `Nova solicitação de atendimento via Chatbot SXS:\n\n*Cliente:* ${nomeCliente}\n*E-mail:* ${emailCliente}\n*Assunto:* ${assuntoCliente}\n\nPor favor, assuma o atendimento.`
    };

    console.log(`Enviando mensagem para o Espaço: ${idDoEspaco}`);
    const respostaApiChat = await chatApi.spaces.messages.create({
      parent: idDoEspaco,
      requestBody: mensagemParaChat,
    });

    const nomeMensagemCompleto = respostaApiChat.data.name;
    console.log('Mensagem enviada com sucesso para o Espaço no Google Chat:', JSON.stringify(respostaApiChat.data, null, 2));
    statusOperacao = "MENSAGEM_ENVIADA_COM_SUCESSO_ESPACO";
    detalhesOperacao = `Mensagem enviada para o Espaço. ID da Mensagem: ${nomeMensagemCompleto}`;

    if (nomeMensagemCompleto) {
      const partesNomeMensagem = nomeMensagemCompleto.split('/');
      const idEspacoSemPrefixo = idDoEspaco.split('/')[1];
      const idMensagemParaLink = partesNomeMensagem[partesNomeMensagem.length - 1];
      if (idEspacoSemPrefixo && idMensagemParaLink) {
        linkMensagemGoogleChat = `https://chat.google.com/room/${idEspacoSemPrefixo}/${idMensagemParaLink}`;
        console.log(`Link direto para a mensagem: ${linkMensagemGoogleChat}`);
      }
    }

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
    statusOperacao = "ERRO_AO_ENVIAR_MENSAGEM_CHAT";
    detalhesOperacao = errorMessage;
  }

  const parametrosResposta = {
    "statusGoogleChat": statusOperacao,
    "detalhesGoogleChat": detalhesOperacao
  };
  if (linkMensagemGoogleChat) {
    parametrosResposta["linkMensagemGoogleChat"] = linkMensagemGoogleChat;
  }

  const webhookResponse = {
    sessionInfo: {
      parameters: parametrosResposta
    }
  };
  console.log('Respondendo ao Dialogflow CX:', JSON.stringify(webhookResponse, null, 2));
  res.status(200).json(webhookResponse);
});