# Canal WhatsApp — Adaptador GMT

## Arquitectura
O backend GMT (/chat) é channel-agnostic. O adaptador WhatsApp é um
serviço separado (webhook) que:
1. Recebe mensagens do WhatsApp via webhook (Meta Business API)
2. Chama POST /chat com {session_id, input}
3. Lê a resposta: reply_text + ui_hints
4. Traduz ui_hints para o formato nativo do WhatsApp
5. Envia resposta via WhatsApp Business API

## Mapeamento ui_hints → WhatsApp

### slot_picker (até 3 opções) → Interactive Message (button)
```json
{
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "<reply_text>" },
    "action": {
      "buttons": [
        {"type": "reply", "reply": {"id": "<value>", "title": "<label>"}},
        "...até 3"
      ]
    }
  }
}
```

### slot_picker (mais de 3 opções) → Interactive Message (list)
Usar type: "list" com sections.

### Sem ui_hints → Mensagem de texto simples
```json
{ "type": "text", "text": { "body": "<reply_text>" } }
```

### Fallback com link → Mensagem de texto com URL
WhatsApp renderiza URLs automaticamente como links clicáveis.
Fallback: "Pode agendar directamente: https://cal.com/..."

## Quando o utilizador clica num botão WhatsApp
O webhook recebe um interactive reply com o button id (= value ISO8601).
O adaptador envia esse valor como mensagem de texto para /chat:
```json
{ "session_id": "wa:<phone>", "input": "Segunda 14/07 às 15:00" }
```
O agente processa normalmente.

## session_id por canal
- Website: "web:<uuid_sessao>"
- WhatsApp: "wa:<numero_telefone>"
O LangGraph mantém histórico separado por thread_id automaticamente.

## Tecnologia recomendada para o adaptador
- NestJS (TypeScript) — webhook /webhook/whatsapp
- Registar webhook na Meta Developer Console
- Variáveis de ambiente: WHATSAPP_TOKEN, WHATSAPP_PHONE_ID, WHATSAPP_VERIFY_TOKEN
- O adaptador NÃO tem lógica de negócio — apenas tradução de formato
