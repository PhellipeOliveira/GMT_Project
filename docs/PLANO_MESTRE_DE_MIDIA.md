# PLANO MESTRE DE MÍDIA — GMT (Growth Marketing Technology)

> Agência de Automações, Inteligência Artificial e Marketing Digital · Lisboa, Portugal.
> Prioridade de comunicação: **IA/Automação · Marketing Digital · Institucional**.

---

## PARTE 4 — INVENTÁRIO COMPLETO DE CRIATIVOS

> **Mapa de aplicação no site:** ver `docs/MAPA_APLICACAO_MIDIA.md` — explica onde cada ID é renderizado, o que está activo vs. legado, e a diferença entre thumbs de listagem (3:2), heroes (3:1) e cards Home (7:5).

Colunas: `ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão sugerida (px) | Família Visual | Objetivo de Comunicação | Duração | Prioridade`

### Tabela 4.1 — Hero e Institucionais

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HER-01 | Hero legado (órfão) | Home | Só `HeroSlider` — **não renderizado** na Home activa | background | imagem | 16:9 | 2560×1440 | Institucional | — | — | Baixa |

> **HER-01:** asset em `public/images/HER-01.webp`; hero activa é **fullscreen preto** (`HeroSection` + `Preloader`) — sem imagem de fundo.
| HER-02 | Slide expansivo — frame 1 | Home | Sec4 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 1 do frame expansivo (grupo HER-02…07) | — | Média |
| HER-03 | Slide expansivo — frame 2 | Home | Sec4 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 2 do frame expansivo (grupo HER-02…07) | — | Média |
| HER-04 | Slide expansivo — frame 3 | Home | Sec4 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 3 do frame expansivo (grupo HER-02…07) | — | Média |
| HER-05 | Slide expansivo — frame 4 | Home | Sec4 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 4 do frame expansivo (grupo HER-02…07) | — | Média |
| HER-06 | Slide expansivo — frame 5 | Home | Sec4 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 5 do frame expansivo (grupo HER-02…07) | — | Média |
| HER-07 | Slide expansivo — frame 6 | Home | Sec4 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 6 do frame expansivo (grupo HER-02…07) | — | Média |
| ABT-01 | Slide expansivo — frame 1 | Sobre | Sec2 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 1 do frame expansivo (grupo ABT-01…05) | — | Média |
| ABT-02 | Slide expansivo — frame 2 | Sobre | Sec2 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 2 do frame expansivo (grupo ABT-01…05) | — | Média |
| ABT-03 | Slide expansivo — frame 3 | Sobre | Sec2 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 3 do frame expansivo (grupo ABT-01…05) | — | Média |
| ABT-04 | Slide expansivo — frame 4 | Sobre | Sec2 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 4 do frame expansivo (grupo ABT-01…05) | — | Média |
| ABT-05 | Slide expansivo — frame 5 | Sobre | Sec2 — ExpandingFrame (conjunto) | slide | imagem | **16:9** | 2560×1440 | Institucional | Slide 5 do frame expansivo (grupo ABT-01…05) | — | Média |
| CON-01 | Fundo decorativo (grade/gradiente) | Contacto | bg da seção | background decorativo | OPCIONAL (imagem) | 16:9 | 2560×1440 | Institucional | Dar caráter sem distrair do formulário | — | Baixa |

> Counters do Sobre e Services Grid da Home = **tipografia/animação** (sem criativo de produção).

> **Strip `/servicos`:** cabeçalho da listagem usa **AG-01**, **MKT-02**, **AV-05** (3:2 · 1200×800) — um thumb por categoria principal. Assets em `public/images/`. **Produzido.**

### Tabela 4.2 — Agentes de IA (15 agentes)

**4.2-A · Thumbnails únicos (1 por agente) — listagem `/servicos` + hero Sec0**

> **Aplicação:** cada AG-0X no **Accordion**, no **strip hero** (só AG-01) e no **hero Sec0** da página do agente (`getServicoHeroId` → `getServicoThumbId`). Ver `docs/MAPA_APLICACAO_MIDIA.md`.

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

**4.2-B · Processos por família (AGP-F*) + IDs retirados (AGH-F*, MKT-04)**

> **Jul 2026 — hero Sec0 unificado:** todos os serviços (agentes, pacotes, avulsos) usam o **thumb 3:2 do slug** no banner. Os IDs **AGH-F1, AGH-F2, AGH-F3, AGH-F4** e **MKT-04** **deixaram de ser necessários** — não são referenciados no código; podem ser removidos de `public/images/` e `public/videos/`. Mantidos abaixo só como registo histórico do inventário.

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ~~AGH-F1~~ | ~~Hero família Hospitalidade~~ | — | — | — | — | 3:1 | 2560×860 | F1 | **Retirado** → AG-01…15 por slug | — | **Removido** |
| ~~AGH-F2~~ | ~~Hero família Operação Eficiente~~ | — | — | — | — | 3:1 | 2560×860 | F2 | **Retirado** → AG-01…15 por slug | — | **Removido** |
| ~~AGH-F3~~ | ~~Hero família Growth & Dados~~ | — | — | — | — | 3:1 | 2560×860 | F3 | **Retirado** → AG-01…15 por slug | — | **Removido** |
| ~~AGH-F4~~ | ~~Hero família Inovação Sob Medida~~ | — | — | — | — | 3:1 | 2560×860 | F4 | **Retirado** → AG-01…15 por slug | — | **Removido** |
| AGP-F1 | Imagem de processo — F1 | — | — | — | — | **2:3** | 1200×1800 | F1 | **Retirado** — timeline sem mídia (Jul 2026) | — | **Removido** |
| AGP-F2 | Imagem de processo — F2 | — | — | — | — | **2:3** | 1200×1800 | F2 | **Retirado** | — | **Removido** |
| AGP-F3 | Imagem de processo — F3 | — | — | — | — | **2:3** | 1200×1800 | F3 | **Retirado** | — | **Removido** |
| AGP-F4 | Imagem de processo — F4 | — | — | — | — | **2:3** | 1200×1800 | F4 | **Retirado** | — | **Removido** |

> **Hero Sec0 (`getServicoHeroId`):** container `h-[80vh] md:h-[70vh]`, `object-fit: cover`, fundo fallback `corPlaceholder`, gradiente `bg-gradient-to-t from-black via-black/40 to-black/10`, título branco centrado. **Todos os serviços** usam o **thumb 3:2** do slug (AG/MKT/AV) via `getServicoThumbId()`. Safe zone: **centro 55%**.

**4.2-C · Como funciona — timeline (Jul 2026)**

Secção **sem mídia**. Componente `ComoFuncionaTimeline` — linha + 5 círculos + texto. IDs **CF-01…05** e **AGP-F1…4** removidos de `media-spec.ts` e `src/lib/media.ts`. Ficheiros `public/images/AGP-F*.webp` são órfãos (podem ser apagados).

### Tabela 4.3 — Marketing Digital (3 pacotes)

> **Aplicação thumbs MKT-01…03:** Accordion + **strip hero** (MKT-02) + **hero Sec0** de cada pacote. **MKT-04 retirado** — substituído por MKT-01…03. Ver mapa.

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| MKT-01 | Thumb · Pacote Essencial | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Início de presença digital | — | Média |
| MKT-02 | Thumb · Pacote Crescimento | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Expansão de quem já está online | — | Alta |
| MKT-03 | Thumb · Pacote Premium | Serviços Geral | listagem + hero Sec0 | thumbnail | imagem | 3:2 | 1200×800 | F3 | Domínio do digital | — | Média |
| ~~MKT-04~~ | ~~Hero família Marketing~~ | — | — | — | — | 3:1 | 2560×860 | F3 | **Retirado** → MKT-01…03 por slug | — | **Removido** |

### Tabela 4.4 — Serviços Avulsos (6 categorias)

> **Aplicação AV-01…06:** Accordion + **strip hero** (AV-05) + **hero Sec0** de cada avulso. **Não** confundir com **SERV-AV-01…06** (7:5, só Home). Ver mapa.

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| AV-01 | Thumb · Criação de Conteúdo | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Vídeos/carrosséis/artigos | — | Média |
| AV-02 | Thumb · Publicidade Digital | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | Meta/Google Ads e leads | — | Média |
| AV-03 | Thumb · Branding & Estratégia | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | Institucional | Identidade visual e posicionamento | — | Baixa |
| AV-04 | Thumb · Websites | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F4 | Landing/institucional/SEO | — | Média |
| AV-05 | Thumb · Inteligência Artificial | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F4 | Chatbots e automação de atendimento | — | Alta |
| AV-06 | Thumb · Analytics & Otimização | Serviços Geral | card listagem | thumbnail | imagem | 3:2 | 1200×800 | F3 | GA4/GTM/Pixel e auditorias | — | Baixa |
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

### Tabela 4.4-C — Frame Expansivo (`ExpandingFrame`)

> Componente: `src/components/ui/ExpandingFrame.tsx`. Usado na **Home Sec4** (**6 slides**: HER-02…07) e na **Sobre Sec2** (5 slides). Não são imagens isoladas — cada conjunto de IDs pertence a **um único slide expansivo**.

#### Regras de produção e visualização

| Regra | Detalhe |
|---|---|
| **Conjunto único** | HER-02…07 (Home) e ABT-01…05 (Sobre) são grupos de slides do mesmo `ExpandingFrame` |
| **Proporção** | **16:9 · 2560×1440** — frame pai **e** assets do mesmo grupo produzidos em **16:9** |
| **Frame pai** | `aspect-video` (16:9) — moldura e imagens alinhadas; largura animada **35% → 75%** |
| **Estado inicial** | **35% de largura** (16:9) — refere-se ao **bloco pai**, não ao tamanho isolado da imagem |
| **Expansão máxima** | **75% de largura** (16:9); depois o scroll **continua** pela secção (`250vh`) |
| **Render das imagens** | `PlaceholderMedia` com `fill` + `object-cover` dentro do frame 16:9 |
| **Safe zone** | Compor assunto no **centro 55–60%** |

#### Home — conjunto HER-02…07 (6 slides)

| ID | Posição no slideshow | Comportamento |
|---|---|---|
| HER-02 | Slide 1 | Crossfade a 700 ms; `object-cover` dentro do frame pai |
| HER-03 | Slide 2 | Idem |
| HER-04 | Slide 3 | Idem |
| HER-05 | Slide 4 | Idem |
| HER-06 | Slide 5 | Idem |
| HER-07 | Slide 6 | Idem |

#### Sobre — conjunto ABT-01…05 (5 slides)

| ID | Posição no slideshow | Comportamento |
|---|---|---|
| ABT-01 | Slide 1 | Crossfade a 700 ms; `object-cover` dentro do frame pai |
| ABT-02 | Slide 2 | Idem |
| ABT-03 | Slide 3 | Idem |
| ABT-04 | Slide 4 | Idem |
| ABT-05 | Slide 5 | Idem |

**Comportamento da secção (Home e Sobre):**

1. Secção com altura `250vh`; container interno `sticky top-0` (`h-screen`).
2. Progress `0 → SCALE_START` (~0,4): frame sobe ao centro **sem crescer**.
3. Progress `SCALE_START → 1`: frame expande de **35% → 75% largura**, mantendo **16:9** (`aspect-video`); `border-radius 16px → 0`.
4. Fundo da secção: `#ffffff → #000000` no início da expansão (`SCALE_START` a `SCALE_START + 0,12`).
5. Slideshow interno cicla independentemente do scroll (intervalo 700 ms).
6. Após atingir **75%**, o utilizador **continua a scrollar** pelo resto da secção até entrar na seguinte.

> **Nota:** HER-02…07 **não** existem como secções separadas na Home. ABT-01…05 **não** são backgrounds independentes na Sobre. Todos só são renderizados dentro do `ExpandingFrame`.

### Tabela 4.5 — Portfolio / Cases

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| PF-01 | Card NARA (showcase) | Home | Sec5 — Trabalhos recentes | linha 2 colunas | imagem | 3:4 | 1200×1600 | Institucional | Prova real de entrega | — | Alta |
| PF-02 | Thumb NARA (catálogo) | Portfolio Geral | grid hero + lista | thumbnail | imagem | **9:16** | 1080×1920 | Institucional | Hero Sec.01: largura total coluna direita se 1 case; lista Sec.02: `w-20 md:w-28` | — | Alta |
| PF-03 | Galeria NARA — capa | Portfolio Item | Sec0 galeria (1ª) | background | imagem | 16:9 | 2560×1440 | Institucional | Abrir o case com impacto | — | Alta |
| PF-04..12 | Galeria NARA — telas (×9) | Portfolio Item | Sec0 galeria | imagem | imagem | 4:3 | 1600×1200 | Institucional | Branding/website/chatbots/campanhas do NARA | — | Média |
| PF-SLOT-H | Slots "em breve" Home | Home | — | — | — | — | — | — | **Removido** do template (só NARA) | — | — |
| PF-SLOT-G | Slots de catálogo (≈12 vazios) | Portfolio Geral | grid/lista | thumbnail | imagem | **9:16** | 1080×1920 | — | **Lacuna**: aguardam novos cases | — | Baixa |
| PF-SLOT-N | Next project (2) | Portfolio Item | Sec1 | thumbnail | imagem | **9:16** | 1080×1920 | — | **Lacuna**: navegação entre cases | — | Baixa |

### Tabela 4.6 — Elementos Globais

| ID | Nome/Descrição | Página | Seção/Slot | Tipo | Mídia | Proporção | Dimensão (px) | Família | Objetivo | Duração | Prioridade |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GL-01 | Logo GMT (claro/escuro) | Todas | navbar/footer | logo | imagem (SVG) | 7:2 | 1400×400 | Institucional | Identidade persistente | — | Alta |
| GL-02 | Favicon legado (webp) | — | — | logo | imagem | 1:1 | 512×512 | Institucional | **Não usado** — favicon activo: `src/app/icon.svg` | — | — |
| GL-03 | Background de seção (textura/gradiente) | Todas | divisores | background | imagem | 16:9 | 2560×1440 | Institucional | Ritmo visual entre seções | — | Baixa |
| GL-04 | Moldura de avatar de depoimento | Home | Sec4 testimonials | thumbnail | imagem | 1:1 | 400×400 | Institucional | Slot de cliente (**lacuna de conteúdo**) | — | Baixa |
| GL-05 | Ícones de UI (setas, serviços) | Todas | UI | logo/ícone | — (lucide-react) | — | vetor | Institucional | Sem produção externa | — | Baixa |
| GL-06 | Cursor/preview interativo | Serviços/Portfolio | hover | animação | — (Framer/GSAP) | — | — | Institucional | Diferencial de UX, sem produção | — | Baixa |
