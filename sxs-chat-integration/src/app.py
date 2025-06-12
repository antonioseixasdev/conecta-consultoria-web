from flask import Flask, request, jsonify
import os
import json
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    """
    Endpoint principal do webhook para processar solicitações do Dialogflow CX.
    """
    try:
        request_data = request.get_json()
        logger.info(f"Webhook recebeu: {json.dumps(request_data, indent=2)}")
        
        # Extrair informações da solicitação do Dialogflow
        tag = request_data.get('fulfillmentInfo', {}).get('tag', '')
        parameters = request_data.get('sessionInfo', {}).get('parameters', {})
        
        logger.info(f"Tag: {tag}, Parâmetros: {parameters}")
        
        if tag == 'solicitar_especialista':
            # Simular verificação de disponibilidade de especialistas
            # Em um ambiente real, isso consultaria o Google Calendar
            
            # Para teste, vamos alternar entre disponível e não disponível
            import random
            is_specialist_available = random.choice([True, False])
            
            if is_specialist_available:
                # Simular criação de espaço no Google Chat
                response_text = "Ótima notícia! O especialista Antonio está disponível agora para atendê-lo. Estou criando uma sala de chat para vocês conversarem. Você receberá uma notificação em instantes."
                
                # Em um ambiente real, aqui chamaríamos a API do Google Chat
                # para criar um espaço e adicionar o especialista
                
                return jsonify({
                    'fulfillmentResponse': {
                        'messages': [
                            {
                                'text': {
                                    'text': [response_text]
                                }
                            }
                        ]
                    }
                })
            else:
                # Simular busca de horários disponíveis
                # Em um ambiente real, isso consultaria o Google Calendar
                
                slots = [
                    "Amanhã (31/05) às 10:00",
                    "Amanhã (31/05) às 14:00",
                    "Segunda-feira (03/06) às 09:00",
                    "Segunda-feira (03/06) às 15:00"
                ]
                
                slots_text = "\n".join([f"- {slot}" for slot in slots])
                response_text = f"No momento, não temos especialistas disponíveis para atendimento imediato. Aqui estão os horários disponíveis nos próximos dias:\n\n{slots_text}\n\nQual horário seria melhor para você?"
                
                return jsonify({
                    'fulfillmentResponse': {
                        'messages': [
                            {
                                'text': {
                                    'text': [response_text]
                                }
                            }
                        ]
                    },
                    'sessionInfo': {
                        'parameters': {
                            'available_slots': slots
                        }
                    }
                })
        
        elif tag == 'selecionar_horario':
            # Processar seleção de horário
            slot_index = int(parameters.get('slot_index', 0))
            slots = parameters.get('available_slots', [])
            
            if 0 <= slot_index < len(slots):
                selected_slot = slots[slot_index]
                
                # Simular criação de evento no Google Calendar
                # Em um ambiente real, isso criaria um evento no Google Calendar
                
                response_text = f"Excelente escolha! Sua reunião foi agendada para {selected_slot} com nosso especialista Antonio. Você receberá um e-mail de confirmação com os detalhes e um link para a videoconferência: https://meet.google.com/exemplo-link"
                
                return jsonify({
                    'fulfillmentResponse': {
                        'messages': [
                            {
                                'text': {
                                    'text': [response_text]
                                }
                            }
                        ]
                    }
                } )
            else:
                response_text = "Desculpe, não consegui identificar o horário selecionado. Por favor, tente novamente."
                
                return jsonify({
                    'fulfillmentResponse': {
                        'messages': [
                            {
                                'text': {
                                    'text': [response_text]
                                }
                            }
                        ]
                    }
                })
        
        # Resposta padrão para outros tags
        return jsonify({
            'fulfillmentResponse': {
                'messages': [
                    {
                        'text': {
                            'text': ["Não entendi sua solicitação. Como posso ajudar?"]
                        }
                    }
                ]
            }
        })
    
    except Exception as e:
        logger.error(f"Erro no webhook: {str(e)}")
        return jsonify({
            'fulfillmentResponse': {
                'messages': [
                    {
                        'text': {
                            'text': ["Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."]
                        }
                    }
                ]
            }
        })

@app.route('/', methods=['GET'])
def home():
    """
    Endpoint de verificação de saúde do webhook.
    """
    return "Webhook da SXS Consultoria está funcionando!"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
