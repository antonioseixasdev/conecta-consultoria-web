import os
from handlers.availability_handler import AvailabilityHandler
from handlers.chat_handler import ChatHandler
from handlers.calendar_handler import CalendarHandler

class SXSIntegrationController:
    def __init__(self):
        self.availability_handler = AvailabilityHandler()
        self.chat_handler = ChatHandler()
        self.calendar_handler = CalendarHandler()
        
        # Lista de especialistas (em produção, isso viria de um banco de dados)
        self.specialists = [
            'antonioseixas@sxsconsultoria.com.br',
            # Adicione outros especialistas aqui
        ]
    
    def process_specialist_request(self, user_data):
        """
        Processa uma solicitação de atendimento com especialista.
        
        Args:
            user_data: Informações do usuário (nome, email, assunto, chat_history)
            
        Returns:
            dict: Resultado do processamento (atendimento imediato ou agendamento)
        """
        # Verificar disponibilidade de especialistas
        availability = self.availability_handler.check_specialist_availability(
            self.specialists, user_data['subject']
        )
        
        if availability['available']:
            # Especialista disponível - criar atendimento imediato
            specialist = availability['best_match']
            result = self.chat_handler.create_support_space(user_data, specialist)
            
            if result['success']:
                return {
                    'type': 'immediate',
                    'message': f"Especialista {specialist['name']} está disponível agora. Um espaço de chat foi criado para vocês conversarem.",
                    'space_id': result['space_id']
                }
            else:
                # Falha ao criar espaço - oferecer agendamento como fallback
                return self._offer_appointment(user_data)
        else:
            # Nenhum especialista disponível - oferecer agendamento
            return self._offer_appointment(user_data)
    
    def _offer_appointment(self, user_data):
        """
        Oferece opções de agendamento quando não há especialistas disponíveis.
        """
        # Buscar horários disponíveis
        slots = self.calendar_handler.find_available_slots(self.specialists)
        
        if slots['success'] and slots['slots']:
            return {
                'type': 'appointment',
                'message': "Não há especialistas disponíveis no momento. Aqui estão os horários disponíveis para agendamento:",
                'slots': slots['slots'][:5]  # Limitar a 5 opções para não sobrecarregar o usuário
            }
        else:
            return {
                'type': 'error',
                'message': "Não foi possível encontrar horários disponíveis. Por favor, tente novamente mais tarde."
            }
    
    def schedule_appointment(self, user_data, slot_index):
        """
        Agenda uma reunião com base no slot selecionado.
        
        Args:
            user_data: Informações do usuário
            slot_index: Índice do slot selecionado
            
        Returns:
            dict: Resultado do agendamento
        """
        # Buscar horários disponíveis novamente
        slots = self.calendar_handler.find_available_slots(self.specialists)
        
        if not slots['success'] or slot_index >= len(slots['slots']):
            return {
                'success': False,
                'message': "Horário selecionado não está mais disponível. Por favor, tente novamente."
            }
        
        # Criar evento no calendário
        selected_slot = slots['slots'][slot_index]
        result = self.calendar_handler.create_appointment(user_data, selected_slot)
        
        if result['success']:
            return {
                'success': True,
                'message': f"Reunião agendada com sucesso para {selected_slot['formatted_time']} com {selected_slot['specialist_name']}.",
                'meet_link': result['meet_link']
            }
        else:
            return {
                'success': False,
                'message': "Não foi possível agendar a reunião. Por favor, tente novamente mais tarde."
            }

# Exemplo de uso
if __name__ == "__main__":
    controller = SXSIntegrationController()
    
    # Simular uma solicitação de atendimento
    user_data = {
        'name': 'João Silva',
        'email': 'joao.silva@example.com',
        'subject': 'Operações de câmbio',
        'chat_history': 'Usuário: Gostaria de entender melhor sobre operações de hedge cambial para importação.'
    }
    
    result = controller.process_specialist_request(user_data)
    print(result)
    
    # Se for agendamento, simular seleção do primeiro slot
    if result['type'] == 'appointment':
        appointment_result = controller.schedule_appointment(user_data, 0)
        print(appointment_result)
