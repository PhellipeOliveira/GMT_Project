# Arquivo RAG — Arquitetura do Site GMT

## Objetivo deste documento

Este arquivo serve como **base de conhecimento do chatbot** para orientar visitantes do site da GMT para a página certa, com respostas do tipo:

- "Esse tema está detalhado em `/servicos`."
- "Veja exemplos reais em `/portfolio`."
- "Para avançar com reunião, use `/contacto`."

O foco é ajudar o chatbot a saber **onde cada assunto está no site** e transformar perguntas em direcionamento útil.

---

## Mapa rápido de páginas públicas

- `/` — Home (visão geral da GMT, destaques de serviços e portfólio)
- `/sobre` — Sobre a empresa (posicionamento, manifesto e diferenciais)
- `/servicos` — Catálogo completo de serviços
- `/servicos/[slug]` — Página detalhada de cada serviço
- `/portfolio` — Lista de cases
- `/portfolio/nara` — Case detalhado NARA
- `/contacto` — Contato, formulário e agendamento de reunião

---

## Arquitetura por intenção do visitante

### 1) Quando o cliente quer entender a GMT

- **Página principal:** `/`
- **Complemento:** `/sobre`
- **Como o chatbot deve responder:**
  - "Na página inicial (`/`) mostramos o que fazemos e exemplos de trabalho."
  - "Se quiser conhecer melhor a empresa e os diferenciais, veja `/sobre`."

### 2) Quando o cliente quer saber serviços e soluções

- **Página principal:** `/servicos`
- **Detalhe por serviço:** `/servicos/[slug]`
- **Como o chatbot deve responder:**
  - "Na página `/servicos` você vê todas as categorias."
  - "Se quiser detalhe completo, aceda à página específica do serviço."

### 3) Quando o cliente quer provas/exemplos

- **Página principal:** `/portfolio`
- **Case detalhado:** `/portfolio/nara`
- **Como o chatbot deve responder:**
  - "Veja exemplos reais em `/portfolio`."
  - "Para um case completo, recomendamos `/portfolio/nara`."

### 4) Quando o cliente quer falar com a GMT

- **Página principal:** `/contacto`
- **Ação principal:** agendar reunião (Cal.com) ou enviar formulário
- **Como o chatbot deve responder:**
  - "Para falar diretamente com a equipa, use `/contacto`."
  - "Lá pode agendar reunião de 30 min ou enviar o formulário."

---

## Conteúdo de cada página (resumo semântico)

### `/` (Home)

- Hero de apresentação da GMT
- Secção "O que fazemos" com destaques de serviços
- Secção "Por que a GMT" com diferenciais
- Secção "Trabalhos recentes" com acesso ao portfólio

### `/servicos`

- Visão geral dos serviços em 3 blocos:
  - **Automação & IA**
  - **Pacotes de Marketing**
  - **Serviços Avulsos**
- Cada item aponta para uma página de detalhe: `/servicos/[slug]`

### `/servicos/[slug]`

Estrutura padrão de detalhe de serviço:

- O desafio
- A solução
- O que inclui
- Como funciona
- Para quem é
- CTA para `/contacto`

### `/portfolio`

- Lista de cases da GMT
- Acesso às páginas de case individual

### `/portfolio/nara`

- Case completo com contexto, tags, resumo e galeria
- CTA para `/contacto`

### `/sobre`

- Posicionamento da GMT
- Diferenciais/valores
- Manifesto institucional

### `/contacto`

- Introdução para conversa comercial
- Card com agendamento de reunião (Cal.com)
- Formulário de contacto

---

## Catálogo de URLs de serviços (rotas canônicas)

### Automação & IA

- `/servicos/cardapio-inteligente`
- `/servicos/reservas-whatsapp`
- `/servicos/agendamento-universal`
- `/servicos/relatorio-semanal`
- `/servicos/follow-up-clientes`
- `/servicos/qualificacao-leads`
- `/servicos/reputacao-reviews`
- `/servicos/cobranca-automatica`
- `/servicos/grafos-personalizados`

### Pacotes de Marketing

- `/servicos/pacote-essencial`
- `/servicos/pacote-crescimento`
- `/servicos/pacote-premium`

### Serviços Avulsos

- `/servicos/criacao-conteudo-avulso`
- `/servicos/publicidade-digital`
- `/servicos/branding-estrategia`
- `/servicos/websites`
- `/servicos/inteligencia-artificial`
- `/servicos/analytics-otimizacao`

---

## Regras de resposta para o chatbot (RAG)

1. **Sempre priorizar URL do site** quando houver página específica para o tema.
2. **Não inventar páginas**: usar apenas rotas listadas neste documento.
3. **Preferir caminho curto e acionável**:
   - Dúvida geral -> `/servicos`
   - Exemplo prático -> `/portfolio`
   - Avançar conversa -> `/contacto`
4. **Quando possível, dar 1 página principal + 1 complementar**.
5. **Se o pedido for muito específico**, enviar direto para o slug exato de serviço.

---

## Frases prontas (exemplos para resposta)

- "Explicamos isso em detalhe na página de serviços: `/servicos`."
- "Para esse tema específico, recomendo `/servicos/websites`."
- "Se quiser ver exemplos reais, veja `/portfolio`."
- "Pode avançar diretamente pelo formulário ou agendamento em `/contacto`."
- "Para conhecer melhor a GMT, veja `/sobre`."

---

## Rotas internas (não direcionar visitante)

Estas rotas existem no projeto, mas **não são conteúdo público para clientes**:

- `/dashboard`
- `/dashboard/login`
- `/dashboard/leads`
- `/dashboard/reunioes`
- `/dashboard/notificacoes`
- `/dashboard/relatorios`

---

## Manutenção deste arquivo

Atualizar este documento sempre que houver mudança em:

- páginas em `src/app/(site)/**`
- catálogo de serviços em `src/data/servicos.ts`
- cases em `src/data/portfolio.ts`
- estrutura de navegação em `src/components/ui/Navbar.tsx` e `Footer.tsx`

