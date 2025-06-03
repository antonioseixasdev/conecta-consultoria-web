const functions = require('@google-cloud/functions-framework');
const {google} = require('googleapis');
// A linha abaixo não é mais necessária se usarmos apenas google.auth.getClient()
// const {JWT} = require('google-auth-library');

// O nome 'criarespacogooglechat' DEVE corresponder ao --target no seu package.json
functions.http('criarespacogooglechat', async (req, res) => {
  console.log('Webhook "criarespacogooglechat" foi chamado.');
  // console.log('Corpo completo da requisição do Dialogflow CX:', JSON.stringify(req.body, null, 2));

  // Extrai os parâmetros da sessão do Dialogflow CX
  const nomeCliente = req.body.sessionInfo.parameters.nome || 'Não informado pelo chatbot';
  const emailCliente = req.body.sessionInfo.parameters.email || 'Não informado pelo chatbot';
  const assuntoCliente = req.body.sessionInfo.parameters.assunto || 'Não informado pelo chatbot';

  // ID do Espaço do Google Chat para onde a mensagem será enviada
  const idDoEspaco = 'space/AAQAc6S-6iY';

  let statusOperacao;
  let detalhesOperacao;

  console.log(`Tentando enviar DM para ${seuGoogleChatUserId} com os seguintes dados:`);
  console.log(`Nome Cliente: ${nomeCliente}`);
  console.log(`Email Cliente: ${emailCliente}`);
  console.log(`Assunto Cliente: ${assuntoCliente}`);

  try {
    // Etapa 1: Autenticação com a API do Google Chat usando credenciais do ambiente
    console.log('Obtendo cliente de autenticação do ambiente...');
    const authClient = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/chat.messages.create'], // Ou o escopo necessário (ex: chat.bot para mais funcionalidades)
    });
    console.log('Cliente de autenticação obtido com sucesso.');

    const chatApi = google.chat({
      version: 'v1',
      auth: authClient, // Use o cliente autenticado obtido do ambiente
    });
    console.log('API do Google Chat inicializada.');

    // Etapa 2: Montar a mensagem para a DM
    const mensagemParaChat = {
      text: `Nova solicitação de atendimento via Chatbot SXS:\n\n*Cliente:* ${nomeCliente}\n*E-mail:* ${emailCliente}\n*Assunto:* ${assuntoCliente}\n\nPor favor, assuma o atendimento.`
    };

    // Etapa 3: Enviar a mensagem direta
    console.log(`Enviando DM para o destinatário: ${seuGoogleChatUserId} usando o cliente autenticado.`);
    console.log(`Enviando mensagem para o Espaço: ${idDoEspaco}`); // Log atualizado
    const respostaApiChat = await chatApi.spaces.messages.create({
      parent: idDoEspaco, // Use a variável definida acima
      requestBody: mensagemParaChat,
    });

    console.log('Mensagem enviada com sucesso para o Espaço no Google Chat:', JSON.stringify(respostaApiChat.data, null, 2)); // Log atualizado
    statusOperacao = "MENSAGEM_ENVIADA_COM_SUCESSO_ESPACO"; // Status atualizado (opcional)
    detalhesOperacao = `Mensagem enviada para o Espaço. ID da Mensagem: ${respostaApiChat.data.name}`; // Detalhes atualizados (opcional)

  } catch (error) {
    console.error('ERRO ao tentar enviar DM para o Google Chat:');
    let errorMessage = error.message;

    if (error.response && error.response.data && error.response.data.error) {
      console.error('Detalhes do erro da API:', JSON.stringify(error.response.data.error, null, 2));
      errorMessage = `API Error: ${error.response.data.error.message} (Code: ${error.response.data.error.code}, Status: ${error.response.data.error.status})`;
      if (error.response.data.error.details) {
        console.error('Mais detalhes:', JSON.stringify(error.response.data.error.details, null, 2));
        errorMessage += ` Details: ${JSON.stringify(error.response.data.error.details)}`;
      }
    } else if (error.errors) { // Estrutura de erro às vezes vista com googleapis
        console.error('Detalhes do erro (array):', JSON.stringify(error.errors, null, 2));
        errorMessage = error.errors.map(e => e.message).join('; ');
    } else {
      console.error('Erro não estruturado ou de rede:', error);
    }

    statusOperacao = "ERRO_AO_ENVIAR_DM";
    detalhesOperacao = errorMessage; // Retorna a mensagem de erro mais detalhada possível
  }

  // Etapa 4: Responder ao Dialogflow CX
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