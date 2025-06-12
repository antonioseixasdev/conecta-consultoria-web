import os
from google.oauth2 import service_account
from google.auth.transport.requests import Request
from google.auth import default
from googleapiclient.discovery import build

def test_authentication():
    """Testa a autenticação com as APIs do Google usando ADC."""
    try:
        # Usar credenciais padrão de aplicativo (ADC)
        credentials, project = default()
        
        # Verificar se as credenciais precisam ser atualizadas
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        
        # Testar acesso à API do Google Chat
        chat_service = build('chat', 'v1', credentials=credentials)
        print("✅ Autenticação com a API do Google Chat bem-sucedida!")
        
        # Testar acesso à API do Google Calendar
        calendar_service = build('calendar', 'v3', credentials=credentials)
        print("✅ Autenticação com a API do Google Calendar bem-sucedida!")
        
        return True
    except Exception as e:
        print(f"❌ Erro na autenticação: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testando autenticação com as APIs do Google...")
    test_authentication()
