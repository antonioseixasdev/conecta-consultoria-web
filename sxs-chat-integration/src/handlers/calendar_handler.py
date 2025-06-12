import os
from google.auth import default
from googleapiclient.discovery import build
from datetime import datetime, timedelta

class CalendarHandler:
    def __init__(self):
        # Inicializar credenciais e serviços
        credentials, project = default()
        self.calendar_service = build('calendar', 'v3', credentials=credentials)
        
    def find_available_slots(self, specialist_emails, days_ahead=5):
        """
        Encontra horários disponíveis nos calendários dos especialistas.
        
        Args:
            specialist_emails: Lista de e-mails dos especialistas
            days_ahead: Número de dias à frente para buscar
            
        Returns:
            dict: Lista de horários disponíveis
        """
        now = datetime.utcnow()
        end_date = now + timedelta(days=days_ahead)
        
        available_slots = []
        
        for email in specialist_emails:
            # Buscar eventos existentes no calendário do especialista
            events_result = self.calendar_service.events().list(
                calendarId=email,
                timeMin=now.isoformat() + 'Z',
                timeMax=end_date.isoformat() + 'Z',
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            busy_slots = []
            
            # Converter eventos em slots ocupados
            for event in events:
                start = datetime.fromisoformat(event['start'].get('dateTime', event['start'].get('date')).replace('Z', '+00:00'))
                end = datetime.fromisoformat(event['end'].get('dateTime', event['end'].get('date')).replace('Z', '+00:00'))
                busy_slots.append({
                    'start': start,
                    'end': end
                })
            
            # Gerar slots disponíveis para os próximos dias
            for i in range(days_ahead):
                date = now + timedelta(days=i)
                
                # Pular finais de semana
                if date.weekday() >= 5:  # 5=Sábado, 6=Domingo
                    continue
                
                # Horário comercial (9h às 17h, slots de 1h)
                for hour in range(9, 17):
                    slot_start = datetime(date.year, date.month, date.day, hour, 0, 0)
                    slot_end = slot_start + timedelta(hours=1)
                    
                    # Verificar se o slot não conflita com eventos existentes
                    is_available = not any(
                        (slot_start >= busy['start'] and slot_start < busy['end']) or
                        (slot_end > busy['start'] and slot_end <= busy['end']) or
                        (slot_start <= busy['start'] and slot_end >= busy['end'])
                        for busy in busy_slots
                    )
                    
                    if is_available:
                        available_slots.append({
                            'specialist_email': email,
                            'specialist_name': email.split('@')[0],  # Simplificado para exemplo
                            'start': slot_start,
                            'end': slot_end,
                            'formatted_time': f"{slot_start.strftime('%d/%m/%Y %H:%M')} - {slot_end.strftime('%H:%M')}"
                        })
        
        # Ordenar slots por data/hora
        available_slots.sort(key=lambda x: x['start'])
        
        return {
            'success': True,
            'slots': available_slots
        }
    
    def create_appointment(self, user_data, slot_info):
        """
        Cria um evento no Google Calendar para agendamento.
        
        Args:
            user_data: Informações do usuário (nome, email, assunto)
            slot_info: Informações sobre o slot selecionado
            
        Returns:
            dict: Informações sobre o evento criado
        """
        try:
            event = self.calendar_service.events().insert(
                calendarId=slot_info['specialist_email'],
                sendUpdates='all',
                conferenceDataVersion=1,
                requestBody={
                    'summary': f"Atendimento: {user_data['name']} - {user_data['subject']}",
                    'description': f"""Atendimento agendado para {user_data['name']} ({user_data['email']})
                    
Assunto: {user_data['subject']}

Histórico da conversa:
{user_data.get('chat_history', 'Sem histórico disponível')}""",
                    'start': {
                        'dateTime': slot_info['start'].isoformat(),
                        'timeZone': 'America/Sao_Paulo',
                    },
                    'end': {
                        'dateTime': slot_info['end'].isoformat(),
                        'timeZone': 'America/Sao_Paulo',
                    },
                    'attendees': [
                        {'email': user_data['email'], 'displayName': user_data['name']},
                        {'email': slot_info['specialist_email'], 'displayName': slot_info['specialist_name']}
                    ],
                    'conferenceData': {
                        'createRequest': {
                            'requestId': f"{user_data['email']}-{int(datetime.now().timestamp())}",
                            'conferenceSolutionKey': {
                                'type': 'hangoutsMeet'
                            }
                        }
                    }
                }
            ).execute()
            
            return {
                'success': True,
                'event_id': event['id'],
                'meet_link': event.get('hangoutLink', ''),
                'start_time': slot_info['start'],
                'end_time': slot_info['end']
            }
            
        except Exception as e:
            print(f"Erro ao criar evento no Google Calendar: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
