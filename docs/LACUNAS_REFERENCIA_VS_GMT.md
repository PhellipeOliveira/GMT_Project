# Lacunas — Referência (lessestudio.com) vs GMT

> Documento de acompanhamento da implementação do site GMT face aos design maps em `docs/referencias/site_json/design_map_*_v2.json`.
>
> **Última auditoria:** Junho 2026 · Base: código em `src/` + design maps v2 + `PLANO_MESTRE_DE_MIDIA.md`.

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
| Secções dual-mode (claro `#EBEBEB` → escuro `#000` → footer `#101010`) | Parcial — Serviços, Sobre, CTAs | Média |
| Hero slider, Lenis, easings, media zoom | Implementado | — |
| Navbar blur + CTA pill + modo claro | Implementado | — |
| Accordion blur + border lento | Implementado | — |
| Botão submit `bg-white/70` em CTAs escuros | Implementado | — |
| Tag pills glassmorphism | Implementado | — |
| Formulário (shake, spinner, sucesso) | Parcial — sem backend real | Baixa |
| Preloader Home | Não implementado | Média |
| Reveal linha-a-linha (`mst`) | Não implementado (usa letra-a-letra) | Média |
| Cursor preview (`mouse-alert-bubble`) | Não implementado | Baixa |
| Transições entre rotas | Não implementado | Baixa |
| Scan shimmer no load de imagens | Não implementado | Baixa |
| Depoimentos / Blog | Lacuna de conteúdo | Aguardar conteúdo |
| Cases além do NARA | Lacuna de conteúdo | Aguardar cases |
| Assets em proporção antiga | Re-exportar | Alta |

---

## 1. Lacunas globais (todo o site)

### 1.1 Design e UX

| # | Item | Referência | GMT actual | Tipo | Prioridade |
|---|---|---|---|---|---|
| G-01 | **Preloader** — fullscreen preto, barra 7s linear, bloqueia interacção até hero carregar | `design_map_home_v2` → `svelte-1ycgkir-fill` | Ausente | Design | Média |
| G-02 | **Reveal `mst`** — texto linha-a-linha com máscara `translateY(100%)→0`, 1s, easing services | 52+ instâncias em Portfolio/Services | `RevealText` letra-a-letra (Framer Motion) | Design | Média |
| G-03 | **Transições de rota** — overlay opacity 0.5s entre páginas | Keyframes globais SvelteKit | Navegação App Router sem overlay | Design | Baixa |
| G-04 | **Cursor `mouse-alert-bubble`** — tooltip com preview de projeto/serviço no hover | Services geral, Portfolio geral | `CursorFollower` — anel sem texto/preview | Design | Baixa |
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
| T-04 | Manifesto About em `font-serif` | `text-3xl md:text-[3vw]` serif | `type-h3` sans (Host Grotesk) | Design |
| T-05 | H1 invisível só para SEO na Home | H1 hidden, H2 visível | H1 visível via `RevealText` (melhor SEO) | Decisão ✓ |

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
| **CTAs explícitos** | CTA final “Agendar” | Referência Home: engagement via cards, não CTAs — GMT adiciona CTA (**Decisão**) |

### 2.2 Sobre (`design_map_about_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Sec 1 — Hero + counters 2×2** | Implementado com `section-light` | Counters usam números inventados (15, 24, 70/30) — validar com produto (**Conteúdo**) |
| **Sec 1 — Slot mídia GIF** | ABT-01 estático WebP | Vídeo/GIF loop ABT-01 opcional; scan effect no load (**G-05**) |
| **Sec 2 — Fullscreen manifesto** | ABT-02 + quote overlay | Vídeo ABT-02; manifesto em serif (**T-04**) |
| **Sec 3 — Valores dark `#101010`** | Implementado (6 valores vs 4 slots ref.) | Referência: 4 valores; GMT: 6 — layout expandido (**Decisão**) |
| **Sec 4 — CTA-form inline desktop** | CTA link para `/contacto` | Formulário inline `hidden md:block` no rodapé da página — não replicado |
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
| **Sec 0 — Hero 80vh/70vh** | Implementado | Vídeos AGH-F*/MKT-04 ainda WebP |
| **Sec 1–4 — Conteúdo claro `#EBEBEB`** | `section-light` | — |
| **Sec 3 — Process cards 6× `aspect-2/3`** | 5 passos (copy tem 5, layout 6) | 6º slot vazio ou duplicar; scroll horizontal desktop opcional |
| **Sec 4 — Portfolio 2 cases** | 1 case NARA | 2º case — lacuna |
| **Sec 5 — CTA nav 8 serviços** | Ausente | Cross-nav com 8 botões `gap-[0.8vw]` |
| **Sec 6 — Latest News + form** | Ausente | Blog + formulário inline |
| **Tag pills `bg-white/80 backdrop-blur-[0.5vw]`** | `tag-pill` em casos de uso | Aplicar também em outras secções se necessário |

### 2.5 Portfolio — Listagem (`design_map_portfolio_geral_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Hero grid 13 thumbs** | NARA + 3 “em breve” | **PF-SLOT-G** ≈12 slots vazios |
| **Lista vertical numerada** | Implementado | Gap 292px ref. vs `py-16 md:py-[8vw]` GMT — aproximado |
| **Tag pills glassmorphism** | Implementado | — |
| **Filtro por categoria/tag** | Ausente | Design map recomenda filtros para GMT |
| **mouse-alert-bubble** | Ausente | **G-04** |

### 2.6 Portfolio — Item (`design_map_portfolio_item_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Sec 0 — Galeria sticky sidebar** | Sidebar + galeria vertical | Verificar sticky behaviour em viewport largo |
| **Sec 1 — Next project ×2** | 2 slots “Em breve” | **PF-SLOT-N** — lacuna cases |
| **Sec 2 — CTA-form** | Link contacto no sidebar | Formulário inline na página |

### 2.7 Contacto (`design_map_contact_v2.json`)

| Secção referência | Estado GMT | Lacunas |
|---|---|---|
| **Layout split 50/60** | `md:w-2/5` + `md:w-3/5` | Próximo (ref. 50/60) |
| **Título `text-6xl md:text-[6vw] text-[#c7c7c7]`** | `type-h2` + `#c7c7c7` | Escala viewport no título — parcial |
| **Nav bottom pill** | Navbar topo | **G-09** |
| **Sem footer** | Footer global | **G-10** |
| **Formulário** | Floating labels + pills + btn branco | Backend real pendente (**G-15**) |

---

## 3. Lacunas de conteúdo (não inventar)

Consolidado de `PLANO_MESTRE_DE_MIDIA.md` Parte 6 e mapas de distribuição.

| Lacuna | Páginas afectadas | Impacto | Acção recomendada |
|---|---|---|---|
| **Depoimentos de clientes** | Home Sec4 | Alto | Ocultar até haver citações reais |
| **Blog / Latest News** | Home Sec5, Serviço Item Sec6 | Médio | Ocultar ou substituir por FAQ / Como Funciona |
| **Cases além do NARA** | Home Sec3, Portfolio geral (≈12), Serviço Item Sec4, Next project | Alto | Manter “Em breve”; não criar cases fictícios |
| **Métricas numéricas nos counters** | Sobre | Médio | Usar rótulos qualitativos ou validar números com produto |
| **Logos de clientes parceiros** | Home Sec4 | Médio | Omitir; foco no NARA |
| **Credencial tipo Shopify Experts** | Navbar/footer | Baixo | Manter omitido |
| **Fotos de equipa** | Sobre | Baixo | Manter impessoal |
| **Avatares depoimentos (GL-04)** | Home Sec4 | — | Aguardar clientes reais |

---

## 4. Lacunas de mídia (assets a produzir ou re-exportar)

Ver tabela completa em `PLANO_MESTRE_DE_MIDIA.md` § Hierarquia da Verdade → Migração.

### 4.1 Re-exportação obrigatória (proporção errada)

| ID | Exportado | Correcto | Onde aparece mal |
|---|---|---|---|
| HER-02 | 7:5 | **110:225** (~880×1800) | Home approach portrait |
| HER-03, 04, 05 | 7:5 | **4:3** (1200×900) | Home approach thumbs |
| PF-02 | 3:2 | **9:16** (1080×1920) | Portfolio grid/lista |
| AGP-F1..F4 | 3:4 | **2:3** (1200×1800) | Cards processo serviços |

### 4.2 Vídeos ainda como WebP (slots definidos)

| ID | Página | Formato final |
|---|---|---|
| HER-01 | Home hero | MP4/WebM loop 5–10s, sem áudio |
| ABT-01, ABT-02 | Sobre | Idem |
| AGH-F1..F4 | Serviço item hero | Idem |
| MKT-04 | Pacotes marketing hero | Idem |

### 4.3 Slides hero futuros (opcional)

| ID | Ratio | Notas |
|---|---|---|
| HER-SLD-02..05 | 16:9 | Um fundo por slide de texto no `HeroSlider` |

### 4.4 Lacunas de inventário (sem ficheiro)

| ID | Descrição |
|---|---|
| PF-SLOT-H ×2 | Cards portfolio Home “Em breve” |
| PF-SLOT-G ×≈12 | Thumbs portfolio catálogo |
| PF-SLOT-N ×2 | Next project no case item |
| PF-EB1..3 | Placeholders “em breve” no grid (spec existe, sem imagem) |
| GL-04 | Avatar depoimento |

---

## 5. Componentes — checklist de alinhamento

| Componente | Ficheiro | Implementado | Falta |
|---|---|---|---|
| Navbar | `Navbar.tsx` | Blur, altura vw, CTA pill, hamburger box, modo claro | Opacity fade no scroll; seta animada ✓ |
| Footer | `Footer.tsx` | `#101010`, `my-[10vw]`, 3 colunas | Grid 5 col; ticker; social strip |
| HeroSlider | `HeroSlider.tsx` | Keyframes, drag, barra 7s | Preloader; multi-mídia slides |
| Accordion | `Accordion.tsx` | Blur, border 1s, grid reveal | 3º nível nested; transform scale sub-list |
| ContactForm | `ContactForm.tsx` | Labels, pills, shake, spinner, sucesso | API; validação campo-a-campo |
| PlaceholderMedia | `PlaceholderMedia.tsx` | Spec ratio, fill, fade load | Scan shimmer; opacity lazy duplicate |
| RevealText | `RevealText.tsx` | Letter stagger | Line mask `mst` |
| RevealItem | `RevealItem.tsx` | Scroll reveal 3 easings | `rowFadeIn` variant |
| CursorFollower | `CursorFollower.tsx` | Anel, blend, coarse hidden | Preview bubble com texto |
| PortfolioCard | `PortfolioCard.tsx` | Tag pills, zoom | Hover transform 1s |
| ServiceCard | `ServiceCard.tsx` | Thumb 3:2 via spec | — |

---

## 6. Priorização sugerida para próximas sprints

### Sprint A — Impacto visual imediato
1. Re-exportar **HER-02..05**, **PF-02**, **AGP-F*** (tabela §4.1)
2. Converter **HER-01** para vídeo loop
3. **Preloader** Home (G-01)

### Sprint B — Fidelidade UX
4. **mst** line reveal (G-02) — substituir ou complementar `RevealText`
5. Formulário inline em Serviços + Sobre (secções CTA-form da referência)
6. **Cross-nav 8 serviços** na página de serviço individual

### Sprint C — Quando houver conteúdo
7. Secção depoimentos + GL-04
8. Novos cases → preencher PF-SLOT-*
9. Blog ou bloco alternativo (FAQ)

### Sprint D — Polish
10. Cursor preview (G-04)
11. Scan shimmer (G-05)
12. Transições de rota (G-03)
13. Filtros no Portfolio
14. Backend do formulário (G-15)

---

## 7. O que já está alinhado (não reimplementar)

- Hero slider: `80vh`, autoplay 7s, slide-in/out, darken 0.6, bar fade 1s
- Lenis smooth scroll
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
