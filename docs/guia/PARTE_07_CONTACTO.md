# GUIA DE EDIÇÃO — PARTE 07 · CONTACTO (`/contacto`)

> Documentação completa da página Contacto para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/contacto/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/styles/tokens.css`, `src/data/media-spec.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`. Cores de fonte extraídas dos componentes/`globals.css`. IDs de mídia cruzados com a PARTE 4 do Plano Mestre.
>
> **Extração:** 28 Jun 2026.

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/contacto` |
| Arquivo | `src/app/contacto/page.tsx` |
| Componentes | `RevealOnScroll`, `ContactForm` (`src/components/ui/ContactForm.tsx`), ícones `Mail`, `Phone`, `Link2`, `MapPin` (`lucide-react`) |
| Dados | array `CANAIS` no próprio arquivo; arrays `SERVICOS_INTERESSE` e `CAMPOS` em `ContactForm.tsx` |
| Metadata | `title: "Contacto"`; `description` com email/WhatsApp/LinkedIn + Lisboa |
| Globais (via `layout.tsx`) | `Navbar`, `Footer`, `FloatingCTA`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho + canais + formulário (split)
2. Seção 02 — CTA final

> A página é **puramente tipográfica** (sem assets de imagem). O PLANO prevê fundo decorativo opcional `CON-01`, mas **não é renderizado** — ver Seção 01 ▸ mídia.

---

# Seção 01 — Cabeçalho + canais + formulário (split)

### 1. Objetivo
Layout split: à esquerda o cabeçalho + canais de contacto; à direita o formulário. Conversão direta + pré-qualificação.

### 2. Copy / Textos

**Coluna esquerda — cabeçalho e canais:**

| Campo | Label | `<h1>` | `<p>` | Canal label | Canal valor |
|---|---|---|---|---|---|
| Conteúdo | `Contacto` | `Vamos conversar` | `Agende uma reunião gratuita e sem compromisso. Conte-nos sobre o seu negócio e desenhamos o plano certo para si.` | `Email` · `WhatsApp / Telefone` · `LinkedIn` · `Localização` | (ver lista abaixo) |
| Elemento HTML | `p` | `h1` | `p` | `span` | `span` |
| Classe | `.type-label` | `.type-h2` | `.type-body-lg` | `.type-label` | `.type-body` |
| Família | DM Sans | Host Grotesk | DM Sans | DM Sans | DM Sans |
| Tamanho | 14px | `clamp(42px,6vw,72px)` | 21px | 14px | 18px |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `var(--gmt-text)` = `#0a0a0a` | `#575757` (`text-gmt-muted`) | `#575757` (`text-gmt-muted`) | `#0a0a0a` (`text-gmt-text`) |
| `letter-spacing` | 0.1em | — | — | 0.1em | — |
| `text-transform` | uppercase | none | none | uppercase | none |

Canais (array `CANAIS`):
- **Email** — `contato@phellipeoliveira.org` (`mailto:contato@phellipeoliveira.org`)
- **WhatsApp / Telefone** — `+351 913 628 211` (`tel:+351913628211`)
- **LinkedIn** — `linkedin.com/in/phellipeoliveira-org` (`https://linkedin.com/in/phellipeoliveira-org/`, `target="_blank"`, `rel="noopener noreferrer"`)
- **Localização** — `Lisboa, Portugal` (sem link — `href: undefined`)

**Coluna direita — formulário (`ContactForm.tsx`):**

| Campo | Labels de input | Texto digitado | `<h3>` checkboxes | Opções de checkbox | Label do textarea |
|---|---|---|---|---|---|
| Conteúdo | `Nome *` · `Email *` · `Telefone` · `Empresa` | (input do utilizador) | `Serviços de interesse` | (8 opções, ver abaixo) | `Conte-nos sobre o seu projeto *` |
| Elemento HTML | `label` | `input` | `h3` | `span` (em `button`) | `label` |
| Classe | `.type-body` (flutuante) | `.input-gmt` + `.type-body` | `.type-label` | `.type-body` | `.type-body` (flutuante) |
| Família | DM Sans | DM Sans | DM Sans | DM Sans | DM Sans |
| Tamanho | 18px → `14px` (flutuante ativa) | 18px | 14px | 18px | 18px → `14px` (flutuante) |
| Peso | 400 | 400 | 400 | 400 | 400 |
| Cor da fonte | `#575757` (`text-gmt-muted`) | `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) | inativo `#575757` (`text-gmt-muted opacity-70`) / ativo `#0a0a0a` (`text-gmt-text`) | `#575757` (`text-gmt-muted`) |
| `letter-spacing` | — | — | 0.1em | — | — |
| `text-transform` | none | none | uppercase | none | none |

Opções de "Serviços de interesse" (array `SERVICOS_INTERESSE`): Automação & IA · Criação de Conteúdo · Publicidade Digital · Branding & Estratégia · Websites · Inteligência Artificial · Analytics & Otimização · Pacotes de Marketing.

> Inputs com `placeholder=" "` + label flutuante via peer-selector (`peer-focus`/`peer-[:not(:placeholder-shown)]` → `top-2` e `text-[14px]`). Existe um campo **honeypot** oculto `_hp_website` (anti-spam, `className="hidden"`).

### 3. Imagens / mídia
Nenhuma imagem renderizada. A página é puramente tipográfica.

| ID | Slot | Proporção | Export | Arquivo atual | Status |
|---|---|---|---|---|---|
| CON-01 | Fundo decorativo (Contacto) — bg da seção | 16:9 | 2560×1440 | `public/images/CON-01.webp` (existe) | **Lacuna de uso** — asset existe mas **não é referenciado** em `contacto/page.tsx` (slot decorativo OPCIONAL no PLANO Tabela 4.1) |

> Ícones dos canais: `Mail`, `Phone`, `Link2`, `MapPin` (`lucide-react`, `size 18`, `strokeWidth 1.5`, cor `text-gmt-text` = `#0a0a0a`) em caixa `border-gmt-border p-2.5`. Vetor (= `GL-05` na PARTE 4) → **Produzido**. Nota: usa-se `Link2` para LinkedIn porque `Linkedin` não existe nesta versão de `lucide-react`.

### 4. Botões / CTAs

**Canais de contacto** — `<a>` (quando há `href`), wrapper `hover:opacity-80`. Sem fundo; cor texto conforme tabela acima.

**Formulário (`ContactForm.tsx`):**
- **Checkboxes "Serviços de interesse"** (8 `<button type="button">` toggle, `aria-pressed`): círculo `size-6 rounded-full border`. Inativo: `border-gmt-border` (sem preenchimento). Ativo: `border-gmt-accent bg-gmt-accent text-white` (`#2563eb` fundo, `#ffffff` ícone `Check` size 12). Wrapper `opacity-80 → hover:opacity-100`.
- **Botão submit** — `Enviar mensagem` → classe `.btn-submit` (`group`).
  - Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
  - Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`. Disabled: `opacity 0.6`.
  - Estado `submitting`: ícone `Loader2` (animação `animate-spin`) + texto `A enviar…`. Estado normal: texto + seta `→` (`group-hover:translate-x-1`).
- **Estado de sucesso** (substitui o form): `<h3>` `Mensagem enviada` (`.type-h3`, `#0a0a0a`) + `<p>` `Obrigado pelo contacto. Responderemos em breve.` (`.type-body`, `#575757`).

> Submissão é **estática** (`console.log`, sem backend). Validação nativa via `form.checkValidity()`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| Cabeçalho, canais, form | Framer Motion (`RevealOnScroll`) | on-scroll | `1.75s`, ease `[0.16,1,0.3,1]`; canais com stagger `delay = i*0.08`; form `delay 0.08` |
| Labels flutuantes | CSS (peer-selector) | on-focus / preenchido | `transition-all 200ms` (sobe + `14px`) |
| Checkbox (círculo) | CSS | on-click | `transition-colors 300ms` |
| Validação falhada | CSS keyframe `.form-shake` | on-submit inválido | `0.4s` (translateX ±4px) |
| Durante envio | CSS `.form-fade-out--hidden` | submitting | `opacity 0.3`, `pointer-events none` |
| Sucesso | CSS `.form-success` (`@keyframes form-fade-in`) | on-success | `0.5s` fade-in + `translateY 8px→0` |
| Ícone `Loader2` | CSS (`animate-spin`) | submitting | rotação contínua |

### 6. Responsividade
- **Desktop:** `flex-row`; coluna info `md:w-2/5`, coluna form `md:w-3/5`; `md:min-h-[70vh]`; campos do form `md:grid-cols-2`; checkboxes `md:grid-cols-2`; `pt-[6vw]`, `px-[5vw]`, `gap-[5vw]`.
- **Tablet:** mantém grids `md:grid-cols-2` a partir de `md`.
- **Mobile:** `flex-col`; campos e checkboxes `grid-cols-1`; `pt-28`, `pb-16`, `px-5`, `gap-12`.

### 7. Arquivos relacionados
`src/app/contacto/page.tsx`, `src/components/ui/ContactForm.tsx`, `src/components/ui/RevealOnScroll.tsx`, classes `.input-gmt`/`.btn-submit`/`.form-shake`/`.form-success`/`.form-fade-out*` em `src/styles/globals.css`.

---

# Seção 02 — CTA final

### 1. Objetivo
Conversão alternativa por telefone (faixa preta `.section-cta`, centrada).

### 2. Copy / Textos

| Campo | `<h2>` | `<p>` |
|---|---|---|
| Conteúdo | `Preferimos falar pessoalmente?` | `Agende uma reunião gratuita — respondemos em 24 horas.` |
| Elemento HTML | `h2` | `p` |
| Classe | `.type-h3` | `.type-body` |
| Família | Host Grotesk | DM Sans |
| Tamanho | 36px | 18px |
| Peso | 400 | 400 |
| Cor da fonte | `#ffffff` (em `.section-cta`, regra `:where(.type-h3) → var(--gmt-text)` = `#ffffff`) | `#94a3b8` (`text-gmt-muted` redefinido na `.section-cta`) |
| `letter-spacing` | — | — |
| `text-transform` | none | none |

### 3. Imagens / mídia
Nenhuma. **Não identificado no projeto**.

### 4. Botões / CTAs
"Ligar agora" — classe `.btn-submit` (link `tel:+351913628211`).
- Fundo `rgb(255 255 255 / 0.7)` · Texto `#000` · `border-radius 9999px` · `padding 0.75rem 2rem` · DM Sans 18px peso 500.
- Hover: `bg rgb(255 255 255 / 0.85)` + `scale(1.02)`.

### 5. Animações
| O que anima | Biblioteca | Gatilho | Duração / efeito |
|---|---|---|---|
| h2, p e botão | Framer Motion (`RevealOnScroll`) | on-scroll | stagger (`delay 0.08`/`0.16`) |

### 6. Responsividade
- **Todos:** centrado, h2 `max-w-2xl`.
- **Desktop:** `px-[5vw] py-[8vw]`. **Mobile:** `px-5 py-20`.

### 7. Arquivos relacionados
`src/app/contacto/page.tsx`, classes `.btn-submit` e `.section-cta` em `src/styles/globals.css`.

---

## Apêndice — tokens e cores usados no Contacto (de `globals.css`)

| Token / Contexto | Valor | Onde aparece |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo da Seção 01 |
| `--gmt-bg-alt` | `#f5f5f5` | fundo dos inputs/textarea (`bg-gmt-bg-alt`) |
| `--gmt-text` | `#0a0a0a` | h1, valores dos canais, texto digitado, opção ativa |
| `--gmt-text-muted` | `#575757` | labels, descrição, rótulos de canal, labels do form |
| `--gmt-border` | `#dcdcdc` | bordas de inputs, caixas de ícone, checkbox inativo |
| `--gmt-accent` | `#2563eb` | foco dos inputs (`focus:border-gmt-accent`), checkbox ativo |
| `.btn-submit` | fundo `rgb(255 255 255 / 0.7)`, texto `#000` | botão "Enviar mensagem" e "Ligar agora" |
| `.section-cta` | bg `#000000`, text `#ffffff`, muted `#94a3b8` | Seção 02 |

> `src/styles/tokens.css` existe mas define tokens legados (`--color-*`, `--font-geist-*`) **não usados** por esta página — a fonte de verdade é `globals.css`.

*Documento gerado a partir do código do repositório e das fontes de verdade indicadas. Nenhuma informação foi inventada.*
