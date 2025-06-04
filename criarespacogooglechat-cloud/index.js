const functions = require('@google-cloud/functions-framework');
const {google} = require('googleapis');

functions.http('criarespacogooglechat', async (req, res) => {
  console.log('Webhook "criarespacogooglechat" foi chamado.');

  // ----> ESTA É A LINHA DE LOG CRUCIAL ADICIONADA PARA DEBUG <----
  console.log('Parâmetros da sessão recebidos do Dialogflow CX:', JSON.stringify(req.body.sessionInfo.parameters, null, 2));

  // Extrai os parâmetros da sessão do Dialogflow CX
  const nomeCliente = req.body.sessionInfo.parameters.nome || 'Não informado pelo chatbot';
  const emailCliente = req.body.sessionInfo.parameters.e-mail || 'Não informado pelo chatbot';
  const assuntoCliente = req.body.sessionInfo.parameters.assunto || 'Não informado pelo chatbot';

  // Loga os dados extraídos (para debug)
  console.log(`Nome Cliente: ${nomeCliente}`);
  console.log(`Email Cliente: ${emailCliente}`);
  console.log(`Assunto Cliente: ${assuntoCliente}`);

  // ID do Espaço do Google Chat para onde a mensagem será enviada
  const idDoEspaco = 'spaces/AAQAD4SSaW8'; // Confirme se este é o ID correto do seu espaço

  let statusOperacao;
  let detalhesOperacao;
  let linkMensagemGoogleChat = null; 

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

    const nomeMensagemCompleto = respostaApiChat.data.name;
    console.log('Mensagem enviada com sucesso para o Espaço no Google Chat:', JSON.stringify(respostaApiChat.data, null, 2));
    statusOperacao = "MENSAGEM_ENVIADA_COM_SUCESSO_ESPACO";
    detalhesOperacao = `Mensagem enviada para o Espaço. ID da Mensagem: ${nomeMensagemCompleto}`;

    if (nomeMensagemCompleto) {
      const partesNomeMensagem = nomeMensagemCompleto.split('/');
      const idEspacoSemPrefixo = idDoEspaco.split('/')[1];
      const idMensagemParaLink = partesNomeMensagem[partesNomeMensagem.length -1];

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