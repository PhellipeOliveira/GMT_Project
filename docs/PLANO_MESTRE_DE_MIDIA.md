# PLANO MESTRE DE MÍDIA — GMT (Growth Marketing Technology)

> Agência de Automações, Inteligência Artificial e Marketing Digital · Lisboa, Portugal.
> Prioridade de comunicação: **70% IA/Automação · 20% Marketing Digital · 10% Institucional**.

**Fontes utilizadas:**
- Layouts: `docs/referencias/site_json/design_map_*_v2.json` + `Untitled-3.2_*.json`
- Dimensões corrigidas: `docs/referencias/site_json/audit_*_media.md`
- Copy: `docs/referencias/copy_site/Produto_Conteudo_Publico_do_Site.md` e `Institucional_Conteudo_Publico_do_Site.md`
- **Não utilizado:** `Preco_Referencia_Interna_Confidencial.md` (confidencial).

---

## HIERARQUIA DA VERDADE (dimensões e proporções)

Ao criar ou substituir mídia, siga **esta ordem** — o nível superior prevalece:

| Prioridade | Fonte | Função |
|---|---|---|
| **1** | `docs/referencias/site_json/design_map_*_v2.json` | Layout de referência (lessestudio.com): slots, `aspect-*`, `h-[*vh]`, tipografia |
| **2** | `src/data/media-spec.ts` | **Verdade no código** — ratio, px de exportação, container (`aspect` vs `full-bleed`), pasta (`images`/`videos`) |
| **3** | **Este documento** (`PLANO_MESTRE_DE_MIDIA.md`) | Guia de produção para designers — espelha `media-spec.ts` |
| **4** | Ficheiros em `public/images/` e `public/videos/` | Artefactos entregues — devem conformar-se aos níveis 1–3 |

**Regras de implementação:**
- O site aplica proporções via `PlaceholderMedia` + `getMediaContainerStyle(id)` — não definir `proporcao`/`altura` manualmente salvo exceção documentada.
- **Hero slider (Home):** apenas **HER-01** é mídia de fundo (16:9, `80vh`). Slides 2–5 são **só texto** sobre o mesmo fundo até existirem assets `HER-SLD-02..05` (futuro, 16:9).
- **Full-bleed heroes** (`HER-01`, `AGH-F*`, `MKT-04`): ratio de exportação ≠ viewport; usar `object-cover` e compor no **centro 55–60%** (safe zone).
- **Cards de processo (serviço):** container `aspect-[3/4] md:aspect-[2/3]`; fundo **AGP-F*** em **2:3** (não 3:4).

### Migração — assets já exportados com proporções antigas

| ID | Exportado (plano antigo) | Proporção correta (design map) | Ação |
|---|---|---|---|
| HER-02 | 7:5 (1400×1000) | **110:225** portrait (~880×1800) | Re-exportar |
| HER-03, HER-04, HER-05 | 7:5 | **4:3** (1200×900) | Re-exportar |
| PF-02 | 3:2 (1200×800) | **9:16** (1080×1920) | Re-exportar |
| AGP-F1..F4 | 3:4 (1200×1600) | **2:3** (1200×1800) | Re-exportar |
| HER-01, AGH-F*, MKT-04, ABT-* | Ratio OK | — | Ajustar composição ao centro (crop por `object-cover`) |

---

### Notas sobre dimensões (pós-auditoria Script 3)

- As capturas originais estavam em viewport comprimido. As proporções abaixo derivam dos valores **corrigidos e consolidados** nos design maps e em `src/data/media-spec.ts`.
- Proporções de referência reais: cards Home ≈ **3:4** (334×461), thumbnails de serviços ≈ **3:2** (≈679–691×461), grid portfólio ≈ **9:16** (135×240), galeria de case = **16:9** (1ª) + **4:3** (demais), hero de serviço ≈ **3:1** (1536×532), approach portrait ≈ **110:225**, approach thumbs ≈ **4:3**, mídia institucional (GIF) ≈ **2:1** (1382×668), avatares de testimonial = **1:1** (≈54×54), logo ≈ **7:2** (1382×400).
- Formatos finais: imagens em **WebP/AVIF**; vídeos em **MP4 + WebM**, loop, **sem áudio**, 5–10s.

---

## PARTE 1 — MAPA DE DISTRIBUIÇÃO DE CONTEÚDO

### 1. Home (`design_map_home_v2`)

| Seção do layout de referência | Conteúdo GMT que ocupa | O que substitui |
|---|---|---|
| Sec 0 — Hero slider (h-80vh, slides cover) | Posicionamento institucional (automações + IA + marketing) e, opcionalmente, destaque do NARA | Substitui o slideshow de projetos da agência de referência |
| Sec 1 — Services Grid (8 serviços) | As 6 categorias de **Serviços Avulsos** (Conteúdo, Publicidade, Branding, Websites, IA, Analytics) | Substitui as 8 áreas de serviço da referência |
| Sec 2 — Approach & Values | Os 6 **Diferenciais** institucionais + imagem de apoio | Substitui "OUR APPROACH AND VALUES" |
| Sec 3 — Portfolio Showcase (3 cases) | **NARA** em 1 slot | Substitui Duo Nutrition/Everyday/Nymph |
| Sec 4 — Testimonials (carousel) | — | **Lacuna**: não há depoimentos na copy |
| Sec 5 — Latest News + footer-grid | Footer-grid mapeado para **"Automação & IA"** e **"Marketing Digital"**; blog vazio | **Lacuna**: não há artigos de blog na copy |

**Lacunas Home:** depoimentos (Sec 4), blog (Sec 5), 2 dos 3 slots de portfólio (Sec 3).

### 2. Sobre (`design_map_about_v2`) — implementação actual

| Seção GMT (código) | Conteúdo | Observação |
|---|---|---|
| Sec 1 — Introdução + contadores | Texto institucional à esquerda; grid contadores à direita | **24+** serviços · **15+** agentes IA · **3+** pacotes; contagem animada de 0 |
| Sec 2 — Slideshow expansivo | `ExpandingFrame` com ABT-01…05 | Mesmo comportamento que Home Sec. 4; fundo branco→preto no scroll |
| Sec 3 — Manifesto | Citação em fundo preto, sem imagem | Secção compacta (`py-16 md:py-20`) |
| Sec 4 — Nossos valores | 6 diferenciais + ícones (coluna 2) | `.section-cta`; lista partilhada com Home (`src/data/diferenciais.ts`) |
| CTA final | — | **Removida** — `FloatingCTA` global |

**Lacunas Sobre:** fotos de equipa (a referência também não tem).

### 3. Serviços — Listagem Geral (`design_map_services_geral_v2`)

| Seção do layout | Conteúdo GMT | Substitui / Observação |
|---|---|---|
| Hero (OUR SERVICES + tagline + 3 thumbs) | "Áreas de especialização" + 3 thumbs (NARA / áreas) | Substitui tagline e thumbnails de credencial |
| Accordion nível 1 (3 categorias) | **Automação & IA** · **Marketing Digital** · **Serviços Avulsos** | Substitui Strategy/Visual/Technology |
| Accordion nível 2 (8 serviços) | 15 agentes (em IA) · 3 pacotes (em Marketing) · 6 avulsos | Substitui os 8 serviços-botão |
| Accordion nível 3 (sub-serviços) | Funcionalidades de cada agente/pacote/avulso | Substitui os 45 sub-serviços |
| Badge Shopify Experts | — | **Lacuna**: GMT não tem credencial equivalente na copy |
| CTA-form + footer-grid | Formulário + navegação de categorias | — |

### 4. Serviço — Página Individual (`design_map_services_item_v2`) — template para 15 agentes + 3 pacotes + 6 avulsos

| Seção do layout | Conteúdo GMT | Substitui / Observação |
|---|---|---|
| Sec 0 — Hero do serviço (imagem cover + H2 + tagline) | Headline do agente/pacote (ex.: "Reservas via WhatsApp") | Hero por item |
| Sec 1 — Introdução / proposta de valor | Blocos **Problema** + **Solução** da copy | — |
| Sec 2 — What we do (lista) | **Funcionalidades** do item | — |
| Sec 3 — Our Process (6 cards 01–06) | **Como Funciona** (5 passos) ou fases do "Grafos Personalizados" | Layout tem 6 slots; copy institucional tem 5 passos |
| Sec 4 — Portfolio prático (2 cases) | NARA / cases relacionados | **Lacuna parcial** (só NARA) |
| Sec 5 — CTA intermediário (nav 8 serviços) | Cross-sell: outros agentes/pacotes | — |
| Sec 6 — Latest News + form | Formulário de contacto; blog vazio | **Lacuna**: blog |
| Sec 7 — Footer-grid | Categorias GMT | — |

### 5. Portfolio — Listagem Geral (`design_map_portfolio_geral_v2`)

| Seção do layout | Conteúdo GMT | Substitui / Observação |
|---|---|---|
| Hero (tagline + grid de 13 thumbs) | NARA (1 thumb) + slots vazios | **Lacuna**: 12 dos 13 slots |
| Lista de projetos (13 rows) | NARA + placeholders | **Lacuna**: cases além do NARA |
| CTA-form + footer-grid | Formulário + categorias | — |

### 6. Portfolio — Página Individual (`design_map_portfolio_item_v2`)

| Seção do layout | Conteúdo GMT | Substitui / Observação |
|---|---|---|
| Sec 0 — Case study (sidebar sticky H1 + galeria 10 imgs) | Case **NARA** (branding, website, chatbots, campanhas) | H1 = nome do case; galeria = telas do NARA |
| Sec 1 — Next project (2 cards) | Próximos cases | **Lacuna**: depende de novos cases |
| Sec 2 — CTA-form | Formulário | — |
| Sec 3 — Footer-grid | Categorias GMT | — |

### 7. Contacto (`design_map_contact_v2`)

| Seção do layout | Conteúdo GMT | Substitui / Observação |
|---|---|---|
| Seção única split (info à esquerda + form à direita) | Canais: email, WhatsApp/telefone, LinkedIn, website, Lisboa | — |
| Checkboxes de serviço (8) | Categorias GMT (Automação & IA, Marketing, Branding, Websites, Analytics, etc.) | Substitui os 8 serviços da referência |
| Mídia | — | **Sem assets**: página puramente tipográfica (fundo decorativo OPCIONAL) |

---

## PARTE 2 — ANÁLISE DE COMUNICAÇÃO VISUAL

Tipos de mídia: **Vídeo** (loop/hero/hover) · **Imagem** (banner/card/thumb/bg) · **Tipografia** (sem criativo) · **Animação** (Framer Motion/GSAP, sem produção externa).

### Home
| Seção | Deve comunicar | Emoção | Mídia recomendada |
|---|---|---|---|
| Hero slider | "Automação + IA que faz o negócio crescer sozinho" | Confiança, modernidade, momentum | **Vídeo** loop (OPCIONAL imagem) + **Animação** de texto (split) |
| Services Grid | Amplitude da oferta avulsa | Clareza, competência | **Tipografia** + **Animação** (reveal on-scroll) |
| Approach/Values | Por que escolher a GMT (6 diferenciais) | Proximidade, credibilidade | **Imagem** (1 destaque + 3 thumbs) + **Animação** |
| Portfolio Showcase | Prova real de entrega (NARA) | Orgulho, prova social | **Imagem** (cards 3:4) |
| Testimonials | Validação por terceiros | Reasseguramento | **Tipografia/Imagem** (lacuna de conteúdo) |
| Latest News | Autoridade editorial | Curiosidade | **Imagem** (lacuna de conteúdo) |

### Sobre
| Seção | Deve comunicar | Emoção | Mídia recomendada |
|---|---|---|---|
| Introdução + counters | Quem é a GMT + escala da oferta | Seriedade, ambição | **Animação** (counters/texto) |
| Slideshow expansivo | Identidade da marca em movimento | Contemplação, momentum | **Imagem** (ABT-01…05, 2:1) + **Animação** scroll |
| Manifesto | Compromisso institucional | Confiança, clareza | **Tipografia** |
| Valores | Princípios da agência | Profundidade, confiança | **Tipografia** + ícones + **Animação** |

### Serviços (Geral + Item)
| Seção | Deve comunicar | Emoção | Mídia recomendada |
|---|---|---|---|
| Hero serviço (item) | O problema que o agente resolve | Alívio, urgência resolvida | **Vídeo/Imagem** OPCIONAL + **Animação** |
| Proposta de valor | Transformação prometida | Esperança, eficiência | **Tipografia** + **Animação** |
| What we do | Funcionalidades concretas | Competência | **Tipografia** |
| Our Process (01–06) | Método claro e sem risco | Controlo, transparência | **Imagem** OPCIONAL de fundo + **Animação** (stagger) |
| Hero listagem | Catálogo de capacidades | Abrangência | **Imagem** (3 thumbs 3:2) |
| Accordion | Profundidade da oferta | Descoberta progressiva | **Tipografia** + **Animação** |

### Portfolio (Geral + Item)
| Seção | Deve comunicar | Emoção | Mídia recomendada |
|---|---|---|---|
| Grid hero | Volume/variedade de trabalho | Impacto visual | **Imagem** (thumbs **9:16**) |
| Lista de projetos | Escaneabilidade | Confiança | **Imagem** (thumbs **9:16**) + **Animação** (reveal) |
| Case study (galeria) | Profundidade da entrega NARA | Imersão, prova | **Imagem** (16:9 + 4:3) + sidebar **Animação** |
| Next project | Continuidade de exploração | Curiosidade | **Imagem** (thumbs) |

### Contacto
| Seção | Deve comunicar | Emoção | Mídia recomendada |
|---|---|---|---|
| Split info + form | Acessibilidade e pré-qualificação | Acolhimento, simplicidade | **Tipografia** + **Animação** (floating labels) · fundo decorativo OPCIONAL |

---

## PARTE 3 — AGRUPAMENTO POR FAMÍLIAS VISUAIS

Os 15 agentes são organizados em **4 famílias visuais** (alinhadas aos 4 blocos da copy), evitando 15 universos distintos.

### Família F1 — "Hospitalidade Calorosa"
- **Agentes:** Reservas via WhatsApp · Voz para Telefone · Cardápio Inteligente (RAG) · Reputação e Reviews · Relatório Semanal para o Dono (5)
- **Tom emocional:** anti-perda, atendimento 24h, calor humano + camada digital
- **Conceito visual:** ambientes de restaurante/hotel em tons quentes (âmbar/terracota), sobrepostos por uma malha digital sutil (mensagens, ondas de voz); contraste entre o físico (mesa/balcão) e o automatizado.
- **Criativos exclusivos necessários:** 5 thumbnails (1 por agente) + 1 hero de família + 1 imagem de processo de família = **7**
- **Compartilháveis:** hero e imagem de processo são reutilizados pelos 5 agentes; só os thumbs são únicos.

### Família F2 — "Operação Eficiente"
- **Agentes:** Agendamento Universal · Follow-up de Clientes · Triagem de Documentos · Cobrança Automática (4)
- **Tom emocional:** eficiência, organização, agenda cheia, fim do trabalho manual
- **Conceito visual:** grids/calendários e fluxos organizados; tons neutros profissionais (cinza-azulado, off-white) com um acento de cor de confirmação (verde sóbrio); linhas que conectam etapas.
- **Criativos exclusivos:** 4 thumbnails + 1 hero de família + 1 imagem de processo = **6**
- **Compartilháveis:** hero + processo reutilizados pelos 4 agentes.

### Família F3 — "Growth & Dados"
- **Agentes:** Criação de Conteúdo Autónomo · Monitor de Concorrência · Relatório de Performance de Marketing · Qualificação de Leads (4)
- **Tom emocional:** crescimento, vantagem competitiva, decisão baseada em dados
- **Conceito visual:** dashboards, curvas ascendentes, partículas de dados; paleta vibrante de marketing (azul elétrico + acento magenta/verde-growth) sobre fundo escuro.
- **Criativos exclusivos:** 4 thumbnails + 1 hero de família + 1 imagem de processo = **6**
- **Compartilháveis:** hero + processo reutilizados; alinha-se também aos 3 pacotes de Marketing.

### Família F4 — "Inovação Sob Medida"
- **Agentes:** Grafos Personalizados (Premium) · Onboarding de Clientes (2)
- **Tom emocional:** sofisticação, customização, tecnologia de ponta
- **Conceito visual:** grafos/nós/linhas em movimento, estética "azul-noite" premium, profundidade e brilho sutil; sensação de sistema sob medida.
- **Criativos exclusivos:** 2 thumbnails + 1 hero de família + 1 imagem de processo = **4**
- **Compartilháveis:** hero + processo reutilizados pelos 2 agentes.

**Resumo de famílias:** 15 thumbs únicos + 4 heros + 4 imagens de processo = **23 criativos** para cobrir os 15 agentes (vs. 45 se cada agente tivesse universo próprio).

---

## PARTE 4 — INVENTÁRIO COMPLETO DE CRIATIVOS

Colunas: `ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão sugerida (px) | Família Visual | Objetivo de Comunicação | Duração | Prioridade`

### Tabela 4.1 — Hero e Institucionais

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HER-01 | Hero principal do site | Home | Sec0 slider | background | OPCIONAL (vídeo→imagem) | 16:9 | 2560×1440 | Institucional/IA | Posicionar GMT como automação+IA que gera crescimento | 5–10s loop | Alta |
| HER-02 | Imagem de apoio "diferenciais" | Home | Sec2 destaque portrait | background | imagem | **110:225** | 880×1800 | Institucional | Humanizar a proximidade/competência | — | Média |
| HER-03 | Thumb diferencial A | Home | Sec2 thumb | thumbnail | imagem | **4:3** | 1200×900 | Institucional | Ilustrar área de especialização | — | Baixa |
| HER-04 | Thumb diferencial B | Home | Sec2 thumb | thumbnail | imagem | **4:3** | 1200×900 | Institucional | Ilustrar área de especialização | — | Baixa |
| HER-05 | Thumb diferencial C | Home | Sec2 thumb | thumbnail | imagem | **4:3** | 1200×900 | Institucional | Ilustrar área de especialização | — | Baixa |
| ABT-01 | Slideshow institucional frame 1 | Sobre | Sec2 expansivo | background | imagem | 2:1 | 1920×960 | Institucional | Ecossistema digital GMT/NARA | — | Média |
| ABT-02 | Slideshow institucional frame 2 | Sobre | Sec2 expansivo | background | imagem | 2:1 | 1920×960 | Institucional | Momento contemplativo da marca | — | Média |
| ABT-03 | Slideshow institucional frame 3 | Sobre | Sec2 expansivo | background | imagem | 2:1 | 1920×960 | Institucional | Variação visual do slideshow | — | Média |
| ABT-04 | Slideshow institucional frame 4 | Sobre | Sec2 expansivo | background | imagem | 2:1 | 1920×960 | Institucional | Variação visual do slideshow | — | Média |
| ABT-05 | Slideshow institucional frame 5 | Sobre | Sec2 expansivo | background | imagem | 2:1 | 1920×960 | Institucional | Variação visual do slideshow | — | Média |
| CON-01 | Fundo decorativo (grade/gradiente) | Contacto | bg da seção | background decorativo | OPCIONAL (imagem) | 16:9 | 2560×1440 | Institucional | Dar caráter sem distrair do formulário | — | Baixa |

> Counters do Sobre e Services Grid da Home = **tipografia/animação** (sem criativo de produção).

### Tabela 4.2 — Agentes de IA (15 agentes)

**4.2-A · Thumbnails únicos (1 por agente) — listagem de serviços, card 3:2**

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AG-01 | Thumb · Reservas via WhatsApp | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F1 | Mostrar reserva automatizada 24h | — | Alta |
| AG-02 | Thumb · Voz para Telefone | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F1 | Atendimento por voz fora de horas | — | Alta |
| AG-03 | Thumb · Cardápio Inteligente (RAG) | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F1 | Resposta instantânea ao cliente | — | Alta |
| AG-04 | Thumb · Reputação e Reviews | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F1 | Subir avaliações no Google | — | Alta |
| AG-05 | Thumb · Relatório Semanal para o Dono | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F1 | Visão do negócio em 2 minutos | — | Média |
| AG-06 | Thumb · Agendamento Universal | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F2 | Agenda que enche sozinha | — | Alta |
| AG-07 | Thumb · Follow-up de Clientes | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F2 | Recorrência/retorno de clientes | — | Alta |
| AG-08 | Thumb · Triagem de Documentos | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F2 | Fim da papelada manual | — | Média |
| AG-09 | Thumb · Cobrança Automática | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F2 | Pagamento garantido na marcação | — | Alta |
| AG-10 | Thumb · Criação de Conteúdo Autónomo | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Calendário editorial pronto | — | Alta |
| AG-11 | Thumb · Monitor de Concorrência | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Inteligência competitiva semanal | — | Média |
| AG-12 | Thumb · Relatório de Performance | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Retorno real dos anúncios | — | Alta |
| AG-13 | Thumb · Qualificação de Leads | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Falar só com quem decide | — | Alta |
| AG-14 | Thumb · Grafos Personalizados | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F4 | Automação sob medida | — | Média |
| AG-15 | Thumb · Onboarding de Clientes | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F4 | Entrada de cliente impecável | — | Média |

**4.2-B · Heros e Processos por família (compartilhados)**

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AGH-F1 | Hero família Hospitalidade | Serviço Item | Sec0 hero | banner | OPCIONAL (vídeo→imagem) | 3:1 | 2560×860 | F1 | Abrir a página do agente com contexto de hospitalidade | 5–10s loop | Alta |
| AGH-F2 | Hero família Operação Eficiente | Serviço Item | Sec0 hero | banner | OPCIONAL (vídeo→imagem) | 3:1 | 2560×860 | F2 | Contexto de agenda/operação | 5–10s loop | Alta |
| AGH-F3 | Hero família Growth & Dados | Serviço Item | Sec0 hero | banner | OPCIONAL (vídeo→imagem) | 3:1 | 2560×860 | F3 | Contexto de dados/crescimento | 5–10s loop | Alta |
| AGH-F4 | Hero família Inovação Sob Medida | Serviço Item | Sec0 hero | banner | OPCIONAL (vídeo→imagem) | 3:1 | 2560×860 | F4 | Contexto premium/custom | 5–10s loop | Média |
| AGP-F1 | Imagem de processo — F1 | Serviço Item | Sec3 process cards | background card | imagem | **2:3** | 1200×1800 | F1 | Fundo das etapas (01–06) | — | Baixa |
| AGP-F2 | Imagem de processo — F2 | Serviço Item | Sec3 process cards | background card | imagem | **2:3** | 1200×1800 | F2 | Fundo das etapas | — | Baixa |
| AGP-F3 | Imagem de processo — F3 | Serviço Item | Sec3 process cards | background card | imagem | **2:3** | 1200×1800 | F3 | Fundo das etapas | — | Baixa |
| AGP-F4 | Imagem de processo — F4 | Serviço Item | Sec3 process cards | background card | imagem | **2:3** | 1200×1800 | F4 | Fundo das etapas | — | Baixa |

### Tabela 4.3 — Marketing Digital (3 pacotes)

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MKT-01 | Thumb · Pacote Essencial | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Início de presença digital | — | Média |
| MKT-02 | Thumb · Pacote Crescimento | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Expansão de quem já está online | — | Alta |
| MKT-03 | Thumb · Pacote Premium | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Domínio do digital | — | Média |
| MKT-04 | Hero família Marketing (compartilhado) | Serviço Item | Sec0 hero | banner | OPCIONAL (vídeo→imagem) | 3:1 | 2560×860 | F3 | Abrir páginas de pacotes | 5–10s loop | Média |

### Tabela 4.4 — Serviços Avulsos (6 categorias)

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AV-01 | Thumb · Criação de Conteúdo | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Vídeos/carrosséis/artigos | — | Média |
| AV-02 | Thumb · Publicidade Digital | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Meta/Google Ads e leads | — | Média |
| AV-03 | Thumb · Branding & Estratégia | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | Institucional | Identidade visual e posicionamento | — | Baixa |
| AV-04 | Thumb · Websites | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F4 | Landing/institucional/SEO | — | Média |
| AV-05 | Thumb · Inteligência Artificial | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F4 | Chatbots e automação de atendimento | — | Alta |

### Tabela 4.4-B — Cards de Serviços na Home (O que fazemos)

> Cards 7:5 exclusivos para a grade da Home. Distintos dos thumbs 3:2 usados na listagem de Serviços.

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|
| SERV-AV-01 | Card Home · Criação de Conteúdo | Home | Sec2 — O que fazemos | card overlay | imagem | **7:5** | 1400×1000 | F3 | Mostrar criação visual/conteúdo (câmara, edição, design) | Alta |
| SERV-AV-02 | Card Home · Publicidade Digital | Home | Sec2 — O que fazemos | card overlay | imagem | **7:5** | 1400×1000 | F3 | Meta/Google Ads, anúncios em acção | Alta |
| SERV-AV-03 | Card Home · Branding & Estratégia | Home | Sec2 — O que fazemos | card overlay | imagem | **7:5** | 1400×1000 | Institucional | Identidade de marca, moodboard | Média |
| SERV-AV-04 | Card Home · Websites | Home | Sec2 — O que fazemos | card overlay | imagem | **7:5** | 1400×1000 | F4 | Ecrã de website, código, design UI | Média |
| SERV-AV-05 | Card Home · Inteligência Artificial | Home | Sec2 — O que fazemos | card overlay | imagem | **7:5** | 1400×1000 | F4 | Chatbot, interface de IA, automação | Alta |
| SERV-AV-06 | Card Home · Analytics & Otimização | Home | Sec2 — O que fazemos | card overlay | imagem | **7:5** | 1400×1000 | F3 | Dashboard, gráficos de performance | Alta |

**Notas de produção (SERV-AV):**
- Proporção 7:5 = 1.4:1 (ligeiramente horizontal, mais larga que 4:3).
- A composição deve colocar o assunto principal no **centro superior** — o rodapé inferior é coberto pelo overlay de texto no card.
- Exportar em WebP/AVIF, qualidade ≥ 85%, max 400 KB por imagem.
- Paleta alinhada à família visual respectiva (F3 = azul/dados; F4 = azul-noite/premium; Institucional = neutro/claro).
| AV-06 | Thumb · Analytics & Otimização | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | GA4/GTM/Pixel e auditorias | — | Baixa |

### Tabela 4.4-C — Frame Expansivo (secção de transição Home)

> Imagens HER-02 a HER-05 reutilizadas dentro do frame animado que expande no scroll e transiciona o fundo de branco para preto.

| ID | Slot | Comportamento |
|---|---|---|
| HER-02 | Frame — slide 1 (portrait) | Cicla a 750 ms; `object-cover` dentro do frame |
| HER-03 | Frame — slide 2 | Cicla a 750 ms; `object-cover` |
| HER-04 | Frame — slide 3 | Cicla a 750 ms; `object-cover` |
| HER-05 | Frame — slide 4 | Cicla a 750 ms; `object-cover` |

**Comportamento:** Frame entra com 35% de largura e 45vh de altura, centrado. Quando atinge o centro e inicia expansão (`SCALE_START ≈ 0.4`), o fundo passa rapidamente de branco a preto. Expande até 100vw × 100vh durante o scroll. Secção 05 (Trabalhos recentes) e seguintes ficam com fundo preto.

### Tabela 4.4-D — Testemunhos (secção removida)

| ID | Nome | Página | Secção | Proporção | Nota |
|---|---|---|---|---|---|
| TEST-BANNER | Banner CTA horizontal (futuro) | Home | *(removida)* | 3:1 | **Sem uso activo** — secção Testemunhos foi removida da Home |

### Tabela 4.5 — Portfolio / Cases

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PF-01 | Card NARA (showcase) | Home | Sec5 — Trabalhos recentes | linha 2 colunas | imagem | 3:4 | 1200×1600 | Institucional | Prova real de entrega | — | Alta |
| PF-02 | Thumb NARA (catálogo) | Portfolio Geral | grid/lista | thumbnail | imagem | **9:16** | 1080×1920 | Institucional | Entrada do case no catálogo | — | Alta |
| PF-03 | Galeria NARA — capa | Portfolio Item | Sec0 galeria (1ª) | background | imagem | 16:9 | 2560×1440 | Institucional | Abrir o case com impacto | — | Alta |
| PF-04..12 | Galeria NARA — telas (×9) | Portfolio Item | Sec0 galeria | imagem | imagem | 4:3 | 1600×1200 | Institucional | Branding/website/chatbots/campanhas do NARA | — | Média |
| PF-SLOT-H | Slots de portfólio Home (2 vazios) | Home | Sec3 cards | card | imagem | 3:4 | 1200×1600 | — | **Lacuna**: aguardam novos cases | — | Baixa |
| PF-SLOT-G | Slots de catálogo (≈12 vazios) | Portfolio Geral | grid/lista | thumbnail | imagem | **9:16** | 1080×1920 | — | **Lacuna**: aguardam novos cases | — | Baixa |
| PF-SLOT-N | Next project (2) | Portfolio Item | Sec1 | thumbnail | imagem | **9:16** | 1080×1920 | — | **Lacuna**: navegação entre cases | — | Baixa |

### Tabela 4.6 — Elementos Globais

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GL-01 | Logo GMT (claro/escuro) | Todas | navbar/footer | logo | imagem (SVG) | 7:2 | 1400×400 | Institucional | Identidade persistente | — | Alta |
| GL-02 | Favicon / app icons | Todas | metadata | logo | imagem | 1:1 | 512×512 | Institucional | Marca em aba/PWA | — | Alta |
| GL-03 | Background de seção (textura/gradiente) | Todas | divisores | background | imagem | 16:9 | 2560×1440 | Institucional | Ritmo visual entre seções | — | Baixa |
| GL-04 | Moldura de avatar de depoimento | Home | Sec4 testimonials | thumbnail | imagem | 1:1 | 400×400 | Institucional | Slot de cliente (**lacuna de conteúdo**) | — | Baixa |
| GL-05 | Ícones de UI (setas, serviços) | Todas | UI | logo/ícone | — (lucide-react) | — | vetor | Institucional | Sem produção externa | — | Baixa |
| GL-06 | Cursor/preview interativo | Serviços/Portfolio | hover | animação | — (Framer/GSAP) | — | — | Institucional | Diferencial de UX, sem produção | — | Baixa |

---

## PARTE 5 — RESUMO EXECUTIVO DE PRODUÇÃO

| Categoria | Imagens | Vídeos | Total |
|---|---|---|---|
| Hero e Institucionais | 5 | 3 (OPCIONAL) | 8 |
| Agentes IA | 19 | 4 (OPCIONAL) | 23 |
| Marketing Digital | 3 | 1 (OPCIONAL) | 4 |
| Serviços Avulsos | 6 | 0 | 6 |
| Portfolio / Cases (produzível agora: NARA) | 12 | 0 | 12 |
| Elementos Globais | 5 | 0 | 5 |
| **TOTAL GERAL** | **50** | **8** | **58** |

> Não estão contados os **slots vazios** de portfólio (≈16) — dependem de novos cases (ver Parte 6). Vídeos são OPCIONAIS: se a verba for limitada, todos podem começar como imagem.

### Ordem de produção recomendada (por impacto na conversão)
1. **HER-01 (hero da Home)** — primeira impressão de todo o site; define a percepção de "agência de IA premium".
2. **Heros de família F1/F3 (AGH-F1, AGH-F3)** — cobrem os agentes de maior prioridade (hospitalidade + growth), o núcleo dos 70% IA.
3. **Thumbs dos agentes de alta prioridade (AG-01..04, AG-06..07, AG-09..13)** — alimentam a listagem de serviços, principal página de descoberta.
4. **PF-01/PF-02/PF-03 (NARA)** — única prova social real; sustenta credibilidade.
5. **GL-01/GL-02 (logo/favicon)** — identidade base, bloqueante para qualquer página.
6. Heros F2/F4 + thumbs de média prioridade.
7. Imagens de processo (AGP-*) e thumbs de avulsos/pacotes.
8. Backgrounds globais e fundo decorativo do Contacto.

### Top 5 criativos de maior impacto (primeira impressão + conversão)
1. **HER-01** — hero da Home (vídeo loop).
2. **PF-01** — card NARA na Home (única prova real).
3. **AGH-F1** — hero da família Hospitalidade (vertical de entrada mais "tangível").
4. **AGH-F3** — hero da família Growth & Dados (sustenta o pilar Marketing).
5. **GL-01** — logo GMT (consistência e confiança em todas as páginas).

### Geráveis com IA generativa (Flux / GPT Image)
- Heros de família (AGH-F1..F4, MKT-04) — cenas conceituais/abstratas.
- Imagens de processo (AGP-F1..F4) — fundos texturizados.
- Backgrounds globais e fundo do Contacto (GL-03, CON-01).
- Thumbs conceituais de agentes/avulsos (AG-*, AV-*, MKT-*) — quando representam conceito, não produto real.
- Imagem de apoio dos diferenciais (HER-02..05).

### Exigem sessão de produção real (com placeholder temporário por IA)
- **Galeria NARA (PF-03..12)** — telas/identidade reais do produto NARA; placeholder por IA até obter capturas reais.
- **GL-01/GL-02** — logo/favicon definitivos da marca (design, não geração); placeholder textual temporário.
- **Avatares/logos de depoimentos (GL-04)** e **novos cases (PF-SLOT-*)** — dependem de clientes reais; sem substituição por IA (seria conteúdo inventado).

---

## PARTE 6 — LACUNAS DE CONTEÚDO

| Lacuna | Onde impacta | Impacto na credibilidade | Placeholder temporário sugerido |
|---|---|---|---|
| **Depoimentos de clientes** | Home *(secção removida)* | Alto | Secção Testemunhos removida; agendamento via `FloatingCTA` global |
| **Cases além do NARA** | Home Sec5 Trabalhos recentes, Portfolio Geral (≈12 slots) | Alto | 1 case NARA + 2 slots "Em breve"; botão "Ver portfólio completo" |
| **Artigos de blog** | Home Sec5, Serviço Item Sec6 | Médio | Ocultar "Latest News" ou substituir por bloco de FAQ/Como Funciona (conteúdo institucional existente) |
| **Métricas / prova social numérica** | Sobre (counters) | — | Implementado: 24 serviços · 15 agentes · 3 pacotes (derivados do catálogo) |
| **Logos de clientes parceiros** | Home Sec4, faixas de credencial | Médio | Omitir a faixa de logos; manter foco no NARA como prova única |
| **Credencial tipo "Shopify Experts"** | Navbar/Footer da referência | Baixo | Remover o badge; GMT não possui credencial equivalente na copy |
| **Fotos de equipa** | Sobre | Baixo | Manter Sobre impessoal (a referência também é) ou usar visual de marca |

---

*Documento gerado a partir exclusivamente dos arquivos de referência e copy pública. Nenhuma copy, métrica ou case foi inventado. Slots sem conteúdo correspondente estão marcados como lacuna.*
