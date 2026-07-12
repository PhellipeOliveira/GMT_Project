# Cheat Sheet — Intents Ativas do Agente GMT (Código Atual)

> Este documento reflete apenas o que existe hoje no código da Fase 1 (Receção Digital).
> Saída estruturada da API: `message`, `intent`, `data`.

---

## Intents Conversacionais
- intent: `conversa_geral`
  - tool: nenhuma (resposta direta do LLM finalizador conversacional)
  - exemplos: "Olá", "Quero saber mais sobre vocês"
- intent: `fora_de_escopo`
  - tool: nenhuma
  - exemplos: pedidos fora do domínio GMT

## Intents de Lead (ativas)
- intent: `lead_cadastrar`
  - tool principal: `cadastrar_lead`
  - dados comuns: `{ lead_id, nome?, email?, empresa?, atualizado }`
  - regra: exige pelo menos `email` ou `telefone`
- intent: `lead_obter`
  - tool principal: `obter_lead`
  - entrada: `lead_ref_ou_id` (uuid/email/telefone/nome/empresa)
  - dados comuns: `{ lead_id, nome, email, telefone, empresa, status_codigo, qualificado, score }`
- intent: `lead_buscar`
  - tool principal: `buscar_leads`
  - entrada: `consulta`
  - dados comuns: `{ items, total }`
- intent: `lead_listar`
  - tool principal: `listar_leads`
  - entrada opcional: `status_codigo`, `limit`, `offset`
  - dados comuns: `{ items }`
- intent: `lead_atualizar`
  - tool principal: `atualizar_lead`
  - entrada: `lead_id` (internamente pode resolver referência antes)
  - dados comuns: `{ lead_id }`

## Intents de Dúvida (RAG)
- intent: `duvida_responder`
  - tool principal: `responder_duvida_rag`
  - entrada: `pergunta`
  - dados comuns: `{ duvida_id, pergunta, resposta, fonte, fontes, respondida, escalar }`
  - comportamento: se não houver base suficiente, retorna `respondida=false` e `escalar=true` (sem tool dedicada de escalada)

## Intents de Reunião (ativas)
- intent: `reuniao_verificar_agenda`
  - tool principal: `verificar_disponibilidade`
  - dados comuns: `{ slots_disponiveis }`
- intent: `reuniao_sugerir_horarios`
  - tool principal: `sugerir_horarios_proximo_dia_util`
  - dados comuns: `{ dia, nome_dia, slots_disponiveis }`
- intent: `reuniao_agendar`
  - tool principal: `agendar_reuniao`
  - dados comuns: `{ reuniao_id, lead_id, data_hora, tipo, status, gcal_event_id?, meet_link? }`
- intent: `reuniao_remarcar`
  - tool principal: `remarcar_reuniao`
  - dados comuns: `{ reuniao_id, nova_data_hora, lead_id }`
- intent: `reuniao_cancelar`
  - tool principal: `cancelar_reuniao`
  - dados comuns: `{ reuniao_id, status }`
- intent: `reuniao_listar`
  - tool principal: `listar_reunioes`
  - dados comuns: `{ items }`

---

## Tools Técnicas Existentes (não são intents de negócio)
- `resolver_lead`: resolve referência natural para `lead_id`
- `enviar_email_confirmacao`: envio de confirmação para lead
- `notificar_equipe_email`: alerta interno para equipe
- `respond_message`: helper de padronização de payload

## Efeitos Automáticos Implementados Hoje
- `lead_cadastrar`:
  - auto dispara `enviar_email_confirmacao` (`confirmacao_cadastro`)
  - auto dispara `notificar_equipe_email` (`alerta_equipe_cadastro`)
- `reuniao_agendar`:
  - envia e-mails dentro da própria tool `agendar_reuniao` (lead + equipe)
- `reuniao_remarcar`:
  - auto dispara `enviar_email_confirmacao` (`atualizacao_reuniao`)
  - auto dispara `notificar_equipe_email` (`alerta_equipe_reuniao`)

---

## Cenários Reais (Conforme Código Atual)

### Cenário A — Conversa + Dúvida
1) `conversa_geral` -> 2) `duvida_responder`

### Cenário B — Cadastro + Follow-up automático
1) `lead_cadastrar` -> 2) envio automático de confirmação/alerta por e-mail

### Cenário C — Agendamento completo
1) `reuniao_verificar_agenda` ou `reuniao_sugerir_horarios` -> 2) `reuniao_agendar`

### Cenário D — Pós-agendamento
1) `reuniao_remarcar` **ou** `reuniao_cancelar` **ou** `reuniao_listar`

### Cenário E — Gestão de lead
1) `lead_buscar` -> 2) `lead_obter` -> 3) `lead_atualizar`

---

## Fora do Escopo do Código Atual (Fase 1)
- Orçamentos (`orcamento_*`)
- Nutrição (`nutricao_*`)
- Relatórios (`relatorio_*`)
- Escalada humana dedicada (`duvida_escalar`)
- Qualificação/classificação dedicadas (`lead_qualificar`, `lead_classificar`)
- Lembrete automático de reunião (`reuniao_lembrete`)