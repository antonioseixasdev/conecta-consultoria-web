import os
from google.auth import default
from googleapiclient.discovery import build

class ChatHandler:
    def __init__(self):
        # Inicializar credenciais e serviços
        credentials, project = default()
        self.chat_service = build('chat', 'v1', credentials=credentials)
        
    def create_support_space(self, user_data, specialist):
        """
        Cria um espaço no Google Chat para atendimento imediato.
        
        Args:
            user_data: Informações do usuário (nome, email, assunto)
            specialist: Informações do especialista selecionado
            
        Returns:
            dict: Informações sobre o espaço criado
        """
        try:
            # Criar espaço no Google Chat
            space = self.chat_service.spaces().create(
                requestBody={
                    'displayName': f"Atendimento: {user_data['name']} - {user_data['subject']}",
                    'spaceType': 'SPACE',
                }
            ).execute()
            
            # Adicionar especialista ao espaço
            self.chat_service.spaces().members().create(
                parent=space['name'],
                requestBody={
                    'member': {
                        'name': f"users/{specialist['email']}",
                        'type': 'HUMAN'
                    }
                }
            ).execute()
            
            # Enviar mensagem com contexto
            self.chat_service.spaces().messages().create(
                parent=space['name'],
                requestBody={
                    'text': f"""Novo atendimento para {user_data['name']} ({user_data['email']})
                    
Assunto: {user_data['subject']}

Histórico da conversa:
{user_data.get('chat_history', 'Sem histórico disponível')}"""
                }
            ).execute()
            
            return {
                'success': True,
                'space_id': space['name'],
                'specialist_name': specialist['name']
            }
            
        except Exception as e:
            print(f"Erro ao criar espaço no Google Chat: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
