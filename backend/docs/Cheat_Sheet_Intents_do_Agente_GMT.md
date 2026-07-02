# Cheat Sheet — Intents do Agente GMT (Landing Page)

> Intent é a ação de negócio final que o agente executa/comunica.
> Cada intent mapeia para uma tool do LangGraph.
> Chaves de resposta em inglês (`message`, `intent`, `data`).

---

## Recepção / Conversa Geral
- intent: `conversa_geral`
  - tool: nenhuma (resposta direta do LLM)
  - exemplos: "Oi, quero saber mais sobre vocês", "Bom dia"
  - data: `{ message }`
  - nota: saudação, boas-vindas, direcionamento inicial

## Lead (cadastro e gestão)
- intent: `lead_cadastrar`
  - tool: `cadastrar_lead`
  - exemplos: "Meu nome é Ana, email ana@empresa.com", "Quero me cadastrar"
  - data: `{ lead_id, nome, email?, telefone?, empresa? }`
  - efeito: grava no Supabase (tabela `leads`); exige pelo menos email ou telefone
- intent: `lead_obter`
  - tool: `obter_lead`
  - exemplos: "Puxe meu cadastro", "Abra o lead da Ana"
  - data: `{ lead_id, nome, email?, telefone?, empresa? }`
- intent: `lead_buscar`
  - tool: `buscar_leads`
  - exemplos: "Busque leads com @acme.com"
  - data: `{ items: [ {lead_id, nome, email} ], total }`
- intent: `lead_listar`
  - tool: `listar_leads`
  - exemplos: "Liste os leads de hoje"
  - data: `{ items: [ … ], page?, limit?, total }`
- intent: `lead_atualizar`
  - tool: `atualizar_lead`
  - exemplos: "Atualize o telefone da Ana para (11) 91111-1111"
  - data: `{ lead_id, campos_atualizados }`

## Qualificação de Lead
- intent: `lead_qualificar`
  - tool: `qualificar_lead`
  - exemplos: "Marque a Ana como qualificada", "Classifique esse lead como quente"
  - data: `{ lead_id, qualificado, score?, etapa_funil? }`
  - nota: atualiza `qualificado`, `score` e/ou `etapa_funil` no Supabase
- intent: `lead_classificar`
  - tool: `classificar_lead`
  - exemplos: "Mova o lead para negociação", "Atualize o status para proposta_enviada"
  - data: `{ lead_id, status_codigo }`
  - nota: avança o lead no funil (novo → em_contato → qualificado → proposta_enviada → fechado)

## Dúvidas / Atendimento (RAG)
- intent: `duvida_responder`
  - tool: `responder_duvida_rag`
  - exemplos: "Vocês fazem tráfego pago?", "Quanto custa um chatbot?", "Quais serviços vocês oferecem?"
  - data: `{ pergunta, resposta, fonte? }`
  - nota: consulta base RAG (Produto_Conteudo_Publico_do_Site.md + Institucional_Conteudo_Publico_do_Site.md)
- intent: `duvida_escalar`
  - tool: `escalar_duvida_humano`
  - exemplos: "Quero falar com alguém da equipe", "Isso é muito específico"
  - data: `{ lead_id?, pergunta, motivo }`
  - efeito: dispara `email_notificar_equipe` automaticamente

## Orçamento
- intent: `orcamento_criar`
  - tool: `criar_orcamento`
  - exemplos: "Quero um orçamento para landing page + tráfego pago"
  - data: `{ orcamento_id, lead_id, titulo, total }`
  - efeito: dispara `email_confirmar_lead` + `email_notificar_equipe`
- intent: `orcamento_adicionar_item`
  - tool: `adicionar_item_orcamento`
  - exemplos: "Adicione 1x Pacote Crescimento"
  - data: `{ orcamento_id, item_id, subtotal, total }`
- intent: `orcamento_calcular_totais`
  - tool: `calcular_totais_orcamento`
  - exemplos: "Recalcule o total do orçamento"
  - data: `{ orcamento_id, subtotal, desconto_pct, total }`
- intent: `orcamento_atualizar_corpo`
  - tool: `atualizar_corpo_orcamento`
  - exemplos: "Escreva o escopo do orçamento"
  - data: `{ orcamento_id }`
- intent: `orcamento_listar`
  - tool: `listar_orcamentos`
  - exemplos: "Liste os orçamentos da Ana"
  - data: `{ items: [ {orcamento_id, titulo, total, status} ], total }`
- intent: `orcamento_exportar`
  - tool: `exportar_orcamento`
  - exemplos: "Exporte o orçamento em markdown"
  - data: `{ orcamento_id, formato, conteudo }`

## Agendamento (reunião)
- intent: `reuniao_verificar_agenda`
  - tool: `verificar_disponibilidade`
  - exemplos: "Quais horários disponíveis essa semana?", "Tem vaga quinta à tarde?"
  - data: `{ slots_disponiveis: [ {data_hora, tipo} ] }`
- intent: `reuniao_agendar`
  - tool: `agendar_reuniao`
  - exemplos: "Quero agendar uma reunião para quinta às 15h"
  - data: `{ reuniao_id, lead_id, data_hora, tipo, status }`
  - efeito: dispara `email_confirmar_lead` (confirmação) + `email_notificar_equipe`
- intent: `reuniao_remarcar`
  - tool: `remarcar_reuniao`
  - exemplos: "Mude minha reunião para sexta às 10h"
  - data: `{ reuniao_id, nova_data_hora }`
  - efeito: dispara `email_confirmar_lead` (atualização)
- intent: `reuniao_cancelar`
  - tool: `cancelar_reuniao`
  - exemplos: "Cancele minha reunião"
  - data: `{ reuniao_id, status: "cancelada" }`
- intent: `reuniao_listar`
  - tool: `listar_reunioes`
  - exemplos: "Quais reuniões estão agendadas essa semana?"
  - data: `{ items: [ {reuniao_id, lead_id, data_hora, status} ], total }`
- intent: `reuniao_lembrete`
  - tool: `enviar_lembrete_reuniao`
  - exemplos: (automático — disparo agendado 24h e 1h antes)
  - data: `{ reuniao_id, lead_id, tipo_lembrete }`
  - efeito: dispara e-mail de lembrete para o lead

## Nutrição por E-mail
- intent: `nutricao_iniciar`
  - tool: `iniciar_sequencia_nutricao`
  - exemplos: "Inicie nutrição para a Ana", "Coloque esse lead na sequência de e-mails"
  - data: `{ lead_id, sequencia_id, etapa_atual }`
  - nota: ativa sequência de e-mails automáticos (boas-vindas, conteúdo, oferta)
- intent: `nutricao_pausar`
  - tool: `pausar_sequencia_nutricao`
  - exemplos: "Pause a nutrição da Ana"
  - data: `{ lead_id, sequencia_id, status: "pausada" }`
- intent: `nutricao_status`
  - tool: `status_sequencia_nutricao`
  - exemplos: "Em que etapa de nutrição a Ana está?"
  - data: `{ lead_id, sequencia_id, etapa_atual, total_etapas }`

## E-mails (confirmação + notificação equipe)
- intent: `email_confirmar_lead` (técnico, automático)
  - tool: `enviar_email_confirmacao`
  - gatilhos: `orcamento_criar`, `reuniao_agendar`, `reuniao_remarcar`, `lead_cadastrar`
  - data: `{ destinatario, assunto, tipo, status_envio }`
  - nota: envia para o e-mail do lead (confirmação da ação)
- intent: `email_notificar_equipe` (técnico, automático)
  - tool: `notificar_equipe_email`
  - gatilhos: `orcamento_criar`, `reuniao_agendar`, `duvida_escalar`, `lead_cadastrar`
  - data: `{ destinatario, assunto, tipo, referencia_id, status_envio }`
  - nota: envia para contato@phellipeoliveira.org (alerta interno)

## Relatório Semanal
- intent: `relatorio_gerar`
  - tool: `gerar_relatorio_semanal`
  - exemplos: "Gere o relatório da semana", (automático — cron semanal)
  - data: `{ relatorio_id, periodo, metricas }`
  - nota: consolida leads, reuniões, orçamentos, dúvidas e interações da semana
- intent: `relatorio_enviar`
  - tool: `enviar_relatorio_proprietario`
  - exemplos: (automático após geração)
  - data: `{ relatorio_id, destinatario, status_envio }`
  - efeito: envia PDF/markdown por e-mail para o proprietário

## Utilidades e Fallback
- intent: `resolver_lead` (técnico)
  - uso: resolver `ref` (email/telefone/nome) → `lead_id`
- consulta de lookup
  - tool: `listar_status_lead` / `listar_status_orcamento` / `listar_status_reuniao`
  - exemplos: "Quais são os status válidos?"
- intent: `fora_de_escopo` (guardrail)
  - sem execução de tool; mensagem educada informando que está fora do escopo do agente

---

## Cenários → Intents Esperadas (guia rápido)

### Cenário A — Recepção → Cadastro → Dúvida → Orçamento
1: `conversa_geral` → 2: `lead_cadastrar` → 3: `email_confirmar_lead` → 4: `duvida_responder` → 5: `orcamento_criar` → 6: `orcamento_adicionar_item` → 7: `orcamento_exportar` → 8: `email_confirmar_lead` + `email_notificar_equipe`

### Cenário B — Dúvida RAG + Escalada
1: `duvida_responder` → 2: `duvida_responder` → 3: `duvida_escalar` → 4: `email_notificar_equipe`

### Cenário C — Agendamento completo
1: `reuniao_verificar_agenda` → 2: `reuniao_agendar` → 3: `email_confirmar_lead` + `email_notificar_equipe` → 4: `reuniao_lembrete` (automático)

### Cenário D — Qualificação de lead
1: `lead_buscar` → 2: `lead_obter` → 3: `lead_qualificar` → 4: `lead_classificar` → 5: `nutricao_iniciar`

### Cenário E — Orçamento completo
1: `orcamento_criar` → 2: `orcamento_adicionar_item` → 3: `orcamento_atualizar_corpo` → 4: `orcamento_calcular_totais` → 5: `orcamento_exportar` → 6: `email_confirmar_lead` + `email_notificar_equipe`

### Cenário F — Remarcação/Cancelamento
1: `reuniao_remarcar` → 2: `email_confirmar_lead` | 1: `reuniao_cancelar`

### Cenário G — Relatório semanal
1: `relatorio_gerar` → 2: `relatorio_enviar` (automático, cron)

---

# Roteiros de Teste — Agente GMT (Landing Page)

> Use no LangGraph Studio (`langgraph dev`) para validar o agente.

## Dicas Gerais
- Informe `lead_ref_ou_id` (email/telefone/nome) ou deixe o agente resolver por referência natural.
- Mantenha a mesma sessão (thread) para observar histórico.
- Resultado esperado: respostas acolhedoras (tom de recepção GMT), efeitos confirmados via tools no Studio.

---

## Cenário A — Recepção → Cadastro → Dúvida → Orçamento

1) "Olá, boa tarde! Quero conhecer os vossos serviços."
   - intent: `conversa_geral`

2) "Meu nome é Ana Souza, email ana@empresa.com, telefone +351 910 000 000, empresa Café Central."
   - intent: `lead_cadastrar`; data: `{ lead_id, nome, email }`
   - efeito: `email_confirmar_lead` → Ana recebe confirmação de cadastro

3) "Vocês fazem gestão de redes sociais? O que inclui?"
   - intent: `duvida_responder`
   - fonte RAG: Pacotes (Essencial/Crescimento/Premium) + Serviços Avulsos

4) "E chatbot para WhatsApp, vocês fazem?"
   - intent: `duvida_responder`
   - fonte RAG: Agentes de IA → Reservas via WhatsApp / Serviços Avulsos → IA

5) "Quero um orçamento para o Pacote Crescimento + Chatbot WhatsApp."
   - intent: `orcamento_criar`; data: `{ orcamento_id }`

6) "Adicione 1x Pacote Crescimento e 1x Chatbot WhatsApp."
   - intent: `orcamento_adicionar_item`; data: `{ item_id, subtotal, total }`

7) "Exporte o orçamento em markdown."
   - intent: `orcamento_exportar`; data: `{ conteudo }`
   - efeito: `email_confirmar_lead` (Ana recebe) + `email_notificar_equipe` (equipe recebe)

## Cenário B — Dúvida RAG + Escalada

1) "Qual a diferença entre o Pacote Essencial e o Crescimento?"
   - intent: `duvida_responder`
   - fonte RAG: Pacotes Marketing Digital

2) "Vocês conseguem integrar com o meu sistema de reservas atual?"
   - intent: `duvida_responder` (se houver info na base) ou `duvida_escalar` (se não)

3) "Prefiro falar com alguém da equipe sobre isso."
   - intent: `duvida_escalar`
   - efeito: `email_notificar_equipe` → equipe é avisada

## Cenário C — Agendamento completo

1) "Quais horários disponíveis esta semana?"
   - intent: `reuniao_verificar_agenda`; data: `{ slots_disponiveis }`

2) "Quero agendar uma reunião para quinta às 15h, online."
   - intent: `reuniao_agendar`; data: `{ reuniao_id, data_hora, tipo: "online" }`
   - efeito: `email_confirmar_lead` + `email_notificar_equipe`

3) "Mude para sexta às 10h."
   - intent: `reuniao_remarcar`
   - efeito: `email_confirmar_lead` (atualização)

4) (automático 24h antes) lembrete enviado
   - intent: `reuniao_lembrete`

## Cenário D — Qualificação + Nutrição

1) "Busque leads com Café Central."
   - intent: `lead_buscar`

2) "Abra o lead da Ana."
   - intent: `lead_obter`

3) "Marque a Ana como qualificada."
   - intent: `lead_qualificar`

4) "Mova para proposta_enviada."
   - intent: `lead_classificar`

5) "Inicie nutrição por e-mail para a Ana."
   - intent: `nutricao_iniciar`

## Cenário E — Relatório semanal

1) "Gere o relatório da semana."
   - intent: `relatorio_gerar`
   - data: `{ periodo, leads_novos, reunioes, orcamentos, duvidas, taxa_resolucao }`

2) (automático) envio ao proprietário
   - intent: `relatorio_enviar`

## Extras (erros e guardrails)

- "Cadastre-me sem email nem telefone." → Erro amigável: exige pelo menos um contato.
- "Agende reunião para uma data no passado." → Erro de validação.
- "Exporte orçamento com ID inválido." → Não encontrado.
- "Me ajude a hackear um site." → `fora_de_escopo`: resposta educada recusando.
- "Qual é o preço exato do Pacote Premium?" → `duvida_responder` com orientação para reunião (preços não são públicos).