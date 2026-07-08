# Lacunas — Referência (lessestudio.com) vs GMT

> Documento de acompanhamento da implementação do site GMT face aos design maps em `docs/referencias/site_json/design_map_*_v2.json`.
>
> **Última auditoria:** Jul 2026 · Base: código em `src/` + design maps v2 + `PLANO_MESTRE_DE_MIDIA.md`.

---

## Como usar este documento

| Tipo | Significado | Acção típica |
|---|---|---|
| **Design** | Comportamento visual/UX da referência ainda não replicado no código | Implementar em `src/components/` ou `globals.css` |
| **Conteúdo** | Slot do layout sem copy ou mídia real na GMT | Produzir conteúdo ou ocultar secção (não inventar) |
| **Mídia** | Asset em proporção errada ou inexistente | Re-exportar conforme `src/data/media-spec.ts` |
| **Decisão** | Divergência intencional (marca GMT ≠ referência) | Manter ou rever com produto |

**Fontes de verdade:**
- Layout e motion: `docs/referencias/site_json/design_map_*_v2.json`
- Dimensões de mídia: `src/data/media-spec.ts` → `docs/PLANO_MESTRE_DE_MIDIA.md`
- Copy pública: `docs/referencias/copy_site/`

---

## Resumo executivo

| Área | Estado | Prioridade sugerida |
|---|---|---|
| Secções dual-mode (claro → `.section-cta` em Home/Sobre → footer `#000`) | Parcial | Média |
| Hero fullscreen preto + Preloader, Lenis, easings | Implementado | — |
| Navbar `useNavTone` + pill adaptativo | Implementado | — |
| ChatWidgetLoader (agente IA) | Implementado | — |
| Accordion blur + border lento | Implementado | — |
| Reveal bloco uniforme (`RevealOnScroll` 2.0s) | Implementado (Jul 2026) | — |
| Formulário (shake, spinner, sucesso) | Parcial — sem backend real | Baixa |
| Cursor preview (`mouse-alert-bubble`) | Não implementado | Baixa |
| Transições entre rotas | Não implementado | Baixa |
| Depoimentos / Blog | Lacuna de conteúdo | Aguardar conteúdo |
| Cases além do NARA | Lacuna de conteúdo | Aguardar cases |
| Como funciona (timeline) | Implementado — `ComoFuncionaTimeline`, sem mídia | — |

---

## 1. Lacunas globais (todo o site)

### 1.1 Design e UX

| # | Item | Referência | GMT actual | Tipo | Prioridade |
|---|---|---|---|---|---|
| G-01 | **Preloader** — overlay GSAP, 1× sessão | `design_map_home_v2` | **Implementado** (`Preloader.tsx`) | — | — |
| G-02 | **Reveal `mst`** — linha-a-linha | Referência Svelte | **Bloco uniforme** `RevealOnScroll` 2.0s (Jul 2026) | Decisão | — |
| G-03 | **Transições de rota** — overlay opacity 0.5s entre páginas | Keyframes globais SvelteKit | Navegação App Router sem overlay | Design | Baixa |
| G-04 | **Cursor preview** | Services, Portfolio | Não implementado (sem `CursorFollower`) | Design | Baixa |
| G-05 | **Scan shimmer** — skeleton `translate(-100%) skew(-20deg)→translate(250%)` no lazy-load | `svelte-1b2mvyb-scan` | Fade opacity apenas | Design | Baixa |
| G-06 | **Lazy-load DOM duplicado** — imagem offscreen `width:0 height:0` + `transition-opacity` | Padrão em todas as páginas | `next/image` único | Design | Baixa |
| G-07 | **Footer grid 5 colunas** — “Visual and Marketing” + “Technology” | Home Sec5, Services, Portfolio | Footer GMT: 3 colunas + copyright (mais completo legalmente) | Decisão | Baixa |
| G-08 | **Badge Shopify Experts** | Navbar/footer referência | Removido — sem credencial na copy GMT | Conteúdo | — |
| G-09 | **Nav inferior no Contacto** — pill fixa `bottom-4 md:bottom-[1vw]` em vez de navbar topo | `design_map_contact_v2` | Navbar global no topo | Design | Baixa |
| G-10 | **Sem footer na página Contacto** | Contact: single-section, sem footer visível | Footer global renderizado | Decisão | Baixa |
| G-11 | **Host Grotesk weight 100** (thin) em títulos de secção | `--font-weight-thin: 100` | Weight 300 (mínimo disponível no Google Fonts) | Decisão | — |
| G-12 | **LaCerchia** (cursive decorativa) | Token `--font-lacerchia` | Não carregada (raramente usada na referência) | Design | Muito baixa |
| G-13 | **Paleta monocromática vs accent GMT** | Referência: preto/branco/cinza | GMT: tema **claro** (#fff / #0a0a0a) + CTA/footer escuros + accent azul/roxo | Decisão documentada em `PALETA_DE_CORES.md` | — |
| G-14 | **Hover scale 2s nos cards** | Portfolio cards ~1s transform | Zoom 0.4s em `.media-zoom` | Design | Baixa |
| G-15 | **Formulário com backend** | Submit real + estados erro/sucesso | `console.log` + UI de sucesso simulada | Design | Alta (quando houver API) |

### 1.2 Tipografia

| # | Item | Referência | GMT actual | Tipo |
|---|---|---|---|---|
| T-01 | `--text-sm` (14px) | Usado em labels secundários | Sem token 14px | Design |
| T-02 | `--text-2xl` (24px) | Subtítulos intermédios | Não mapeado | Design |
| T-03 | `--text-5xl` (48px) em H2 de categorias | Services accordion | `.type-category` clamp até 48px — próximo | Design |
| T-04 | Manifesto About | serif referência | `.type-manifesto` (Host Grotesk fluido) | Design |
| T-05 | H1 visível na Home | H1 hidden ref. | H1 visível `gmt-brand--hero` (melhor SEO) | Decisão ✓ |

### 1.3 Motion stack

| # | Item | Referência | GMT actual |
|---|---|---|---|
| M-01 | Animações via CSS transitions + keyframes | Framer Motion em Navbar, Hero, Reveal* | Divergência aceite |
| M-02 | `scroll-up` 32s linear — testimonials | Ausente (sem secção) | Conteúdo |
| M-03 | `rowFadeIn` opacity + `translateY(-6px)` | Ausente | Design |
| M-04 | `dot-shine` pulse | Ausente | Design |
| M-05 | `prefers-reduced-motion` | Implementado em `globals.css` | ✓ |

---

## 2. Lacunas por página

### 2.1 Home (`design_map_home_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Sec 0 — Hero slider** | Implementado (HER-01 único fundo; 5 slides texto) | **G-01** preloader; slides 2–5 sem mídia própria (`HER-SLD-02..05` futuro, 16:9); vídeo HER-01 ainda WebP |
| **Sec 1 — Services grid** | 6 avulsos com ícones Lucide | Referência: lista texto-only flex sem ícones — estilo diferente (**Decisão**) |
| **Sec 2 — Approach & values** | 6 diferenciais + HER-02..05 | Assets HER-02..05 em proporção antiga (7:5) — ver **Mídia** |
| **Sec 3 — Portfolio showcase** | 1 case NARA + 2 “Em breve” | **PF-SLOT-H** ×2 — lacuna de cases |
| **Sec 4 — Testimonials** | Secção ausente | **Conteúdo** — sem depoimentos na copy; carousel `scroll-up` 32s |
| **Sec 5 — Latest News + footer-grid** | CTA + Footer separado | **Conteúdo** — sem blog; footer-grid 5 col vs Footer GMT 3 col |
| **Pills de categoria** | `border` rounded-full | Referência: `SPAN.tag rounded-lg px-4 py-2 bg-opaco` | Design |
| **CTAs explícitos** | CTA final Home removido | Referência Home: engagement via cards — GMT usa `ChatWidgetLoader` global (**Decisão**) |

### 2.2 Sobre (`design_map_about_v2.json`) — implementação actual

| Secção GMT (código) | Estado | Observação |
|---|---|---|
| **Sec 1 — Introdução + contadores** | Implementado | 18+ serviços · 9+ agentes · 3+ pacotes; contagem animada; `AboutCounterGrid` |
| **Sec 2 — Slideshow expansivo** | Implementado | `ExpandingFrame` + ABT-01…05 em `public/images/`; branco→preto no scroll |
| **Sec 3 — Manifesto** | Implementado | Texto em `bg-black`, sem imagem; secção compacta |
| **Sec 4 — Nossos valores** | Implementado | `.section-cta`; 6 diferenciais + ícones (coluna 2); `src/data/diferenciais.ts` |
| **CTA final inline** | Removida (Home, Sobre, `/servicos`, detalhe serviço) | Conversão via `ChatWidgetLoader` global |
| **Footer ticker + social** | Footer global | Ticker marquee Instagram/LinkedIn/Dribbble/Mail — ausente |

### 2.3 Serviços — Listagem (`design_map_services_geral_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Hero + 3 thumbs** | Implementado | — |
| **3 categorias accordion** | 3 categorias GMT (não 8 da ref.) | Estrutura adaptada à copy (**Decisão**) |
| **Accordion 3 níveis** | 2 níveis (categoria → item → funcionalidades) | Referência: 45 sub-serviços em 3º nível; GMT lista funcionalidades em texto |
| **Blur selectivo no accordion** | Implementado | — |
| **Formulário inline antes do footer** | Só CTA link | Form + checkboxes integrados na página |
| **Shopify badge** | Ausente | Lacuna credencial (**Conteúdo**) |
| **mouse-alert-bubble nos itens** | Ausente | **G-04** |

### 2.4 Serviço — Item (`design_map_services_item_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Sec 0 — Hero 80vh/70vh** | Implementado | Thumb 3:2 por slug (AG/MKT/AV) via `getServicoHeroId`; ~~AGH-F*~~, ~~MKT-04~~ retirados |
| **Sec 1–4 — Conteúdo claro `#EBEBEB`** | `section-light` | — |
| **Sec 3 — Process cards 6× `aspect-2/3`** | 5 passos (copy tem 5, layout 6) | 6º slot vazio ou duplicar; scroll horizontal desktop opcional |
| **Sec 4 — Portfolio 2 cases** | 1 case NARA | 2º case — lacuna |
| **Sec 5 — CTA nav 8 serviços** | Ausente | Cross-nav com 8 botões `gap-[0.8vw]` |
| **Sec 6 — Latest News + form** | Ausente | Blog + formulário inline |
| **Tag pills `bg-white/80 backdrop-blur-[0.5vw]`** | `tag-pill` em casos de uso | Aplicar também em outras secções se necessário |

### 2.5 Portfolio — Listagem (`design_map_portfolio_geral_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Hero grid 13 thumbs** | Só lista NARA (sem grid hero) | **PF-SLOT-G** para cases futuros |
| **Lista vertical numerada** | Implementado | Gap 292px ref. vs `py-16 md:py-[8vw]` GMT — aproximado |
| **Tag pills glassmorphism** | Implementado | — |
| **Filtro por categoria/tag** | Ausente | Design map recomenda filtros para GMT |
| **mouse-alert-bubble** | Ausente | **G-04** |

### 2.6 Portfolio — Item (`design_map_portfolio_item_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Sec 0 — Galeria sticky sidebar** | Sidebar + galeria vertical | Verificar sticky behaviour em viewport largo |
| **Sec 1 — Next project ×2** | Lista de cases reais (`portfolio.map`) | Só NARA disponível |
| **Sec 2 — CTA-form** | Link contacto no sidebar | Formulário inline na página |

### 2.7 Contacto (`design_map_contact_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Layout split** | `grid md:grid-cols-[0.8fr_1.2fr]` | Próximo da ref. |
| **Título** | `type-h2` tema claro | Diverge da ref. escura |
| **Canais** | Só link telefone na coluna sticky | Email/WhatsApp/LinkedIn não na UI |
| **Formulário** | Floating labels + pills + btn branco | Backend real pendente (**G-15**) |

---

## 3. Lacunas de conteúdo (não inventar)

Consolidado de `PLANO_MESTRE_DE_MIDIA.md` Parte 6 e mapas de distribuição.

| Lacuna | Páginas afectadas | Impacto | Acção recomendada |
|---|---|---|---|
| **Depoimentos de clientes** | Home *(secção removida)* | Alto | Secção Testemunhos removida da Home |
| **Blog / Latest News** | Home Sec5 | Médio | Secção não existe no GMT; detalhe de serviço tem timeline «Como funciona» |
| **Cases além do NARA** | Home Sec5, Portfolio geral (≈12), Next project | Alto | Manter “Em breve”; não criar cases fictícios |
| **Métricas numéricas nos counters** | Sobre | — | Implementado: 18 · 9 · 3 (catálogo de serviços) |
| **Logos de clientes parceiros** | Home Sec4 | Médio | Omitir; foco no NARA |
| **Credencial tipo Shopify Experts** | Navbar/footer | Baixo | Manter omitido |
| **Fotos de equipa** | Sobre | Baixo | Manter impessoal |
| **Avatares depoimentos (GL-04)** | Home Sec4 | — | Aguardar clientes reais |

---

## 4. Lacunas de mídia (assets a produzir ou re-exportar)

Ver tabela completa em `PLANO_MESTRE_DE_MIDIA.md` § Hierarquia da Verdade → Migração.

### 4.1 Re-exportação (verificar se ainda aplicável)

> HER-02…07 e ABT-01…05 estão em **16:9** no código actual. PF-02 em **9:16**. SERV-AV-01…06 **produzidos**.

| ID | Notas |
|---|---|
| Como funciona | Timeline animada (`ComoFuncionaTimeline`) — Jul 2026 | ✅ |

### 4.2 Vídeos ainda como WebP (slots definidos)

| ID | Página | Formato final |
|---|---|---|
| HER-01 | Home (órfão `HeroSlider` apenas) | WebP em `public/images/` |
| ABT-01…ABT-05 | Sobre slideshow | WebP em `public/images/` (2:1); futuro: vídeo loop opcional |
| AGH-F1..F4 | ~~Serviço item hero~~ | **Retirado** — thumbs AG-01…15 |
| MKT-04 | ~~Pacotes marketing hero~~ | **Retirado** — MKT-01…03 |

### 4.3 Slides hero futuros (opcional)

| ID | Ratio | Notas |
|---|---|---|
| HER-SLD-02..05 | 16:9 | Um fundo por slide de texto no `HeroSlider` |

### 4.4 Lacunas de inventário (sem ficheiro)

| ID | Descrição |
|---|---|
| PF-SLOT-H ×2 | **Removido** — Home só mostra NARA |
| PF-SLOT-G ×≈12 | Thumbs portfolio catálogo |
| PF-SLOT-N ×2 | Next project no case item |
| PF-EB1..3 | Placeholders “em breve” no grid (spec existe, sem imagem) |
| GL-04 | Avatar depoimento |

---

## 5. Componentes — checklist de alinhamento

| Componente | Ficheiro | Implementado | Falta |
|---|---|---|---|
| Navbar | `Navbar.tsx` | Blur, altura vw, CTA pill, hamburger box, modo claro | Opacity fade no scroll; seta animada ✓ |
| Footer | `Footer.tsx` | `bg-black`, `.type-footer-subtitle`, `py-20 md:py-28`, 3 colunas | Grid 5 col; ticker |
| HeroSlider | `HeroSlider.tsx` | Órfão — keyframes em CSS | Não usado na Home activa |
| Preloader | `Preloader.tsx` | GSAP intro 1× sessão | — |
| Accordion | `Accordion.tsx` | Blur, border 1s, `aspect-[3/2]` thumbs | — |
| ContactForm | `ContactForm.tsx` | Labels, pills, shake, spinner, sucesso | API real |
| PlaceholderMedia | `PlaceholderMedia.tsx` | Spec ratio, fill, fade load | Scan shimmer |
| RevealOnScroll | `RevealOnScroll.tsx` | Bloco uniforme 2.0s | — |
| ChatWidgetLoader | `ChatWidgetLoader.tsx` | Agente IA canto inferior direito | — |
| PortfolioCard | `PortfolioCard.tsx` | Órfão | — |
| ServiceCard | `ServiceCard.tsx` | Órfão | — |

---

## 6. Priorização sugerida para próximas sprints

### Sprint A — Impacto visual imediato
1. Novos cases → preencher PF-SLOT-*

### Sprint B — Fidelidade UX
3. Formulário com backend real (G-15)
4. Filtros no Portfolio (opcional)

### Sprint C — Polish
5. Cursor preview (G-04)
6. Transições de rota (G-03)

---

## 7. O que já está alinhado (não reimplementar)

- Hero Home: fullscreen preto `100dvh` + **Preloader** (GSAP) + scroll GSAP em `HeroTitle`
- Lenis smooth scroll + **ChatWidgetLoader**
- `RevealOnScroll` bloco uniforme (2.0s, ease `[0.25,1,0.35,1]`)
- ExpandingFrame **35% → 75%** largura
- SERV-AV-01…06 produzidos (cards Home)
- Tokens `--ease`, `--ease-services`, `--ease-portfolio`, `--slide-duration`, `--color-transition`
- Spacing `px-5` / `md:px-[5vw]`, `md:pt-[11vw]`, `md:mt-[8vw]`
- Classes tipográficas `.type-*` + prose invert
- `section-light` / `section-cta` / `section-footer`
- `.btn-nav`, `.btn-submit`, `.tag-pill`
- Accordion blur + border transition
- `media-spec.ts` como fonte de proporções no código
- Honeypot `_hp_website` no formulário
- `prefers-reduced-motion` global

---

## 8. Manutenção deste documento

Actualizar este ficheiro quando:
- Um item da tabela for implementado (mover para §7 ou marcar ✓)
- Novos design maps ou auditorias alterarem o scope
- Novos cases, depoimentos ou blog forem publicados (rever §3)

**Relacionados:**
- `docs/PLANO_MESTRE_DE_MIDIA.md` — inventário de mídia e lacunas de produção
- `docs/PALETA_DE_CORES.md` — tokens de cor GMT (pode estar desactualizado face ao dual-mode)
- `docs/referencias/site_json/` — design maps v2

---

*Gerado a partir da auditoria visual completa do projeto GMT. Nenhuma copy, métrica ou case fictício foi adicionado.*
