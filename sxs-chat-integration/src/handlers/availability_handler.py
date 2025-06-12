import os
from google.auth import default
from googleapiclient.discovery import build
from datetime import datetime, timedelta

class AvailabilityHandler:
    def __init__(self):
        # Inicializar credenciais e serviços
        credentials, project = default()
        self.calendar_service = build('calendar', 'v3', credentials=credentials)
        
    def check_specialist_availability(self, specialist_emails, subject):
        """
        Verifica a disponibilidade dos especialistas com base em seus calendários.
        
        Args:
            specialist_emails: Lista de e-mails dos especialistas
            subject: Assunto da consulta para filtrar especialistas por expertise
            
        Returns:
            dict: Informações sobre disponibilidade e especialista recomendado
        """
        now = datetime.utcnow()
        
        available_specialists = []
        
        for email in specialist_emails:
            # Verificar eventos no calendário do especialista
            events_result = self.calendar_service.events().list(
                calendarId=email,
                timeMin=now.isoformat() + 'Z',
                timeMax=(now + timedelta(minutes=30)).isoformat() + 'Z',
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            # Se não houver eventos nos próximos 30 minutos, o especialista está disponível
            if not events:
                # Aqui você pode adicionar lógica adicional para verificar expertise no assunto
                available_specialists.append({
                    'email': email,
                    'name': email.split('@')[0],  # Simplificado para exemplo
                    'status': 'available'
                })
        
        return {
            'available': len(available_specialists) > 0,
            'specialists': available_specialists,
            'best_match': available_specialists[0] if available_specialists else None
        }
