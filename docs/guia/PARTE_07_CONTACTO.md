# GUIA DE EDIÇÃO — PARTE 07 · CONTACTO (`/contacto`)

> Documentação completa da página Contacto para edições e decisões de design/desenvolvimento.
>
> **Arquivo principal:** `src/app/(site)/contacto/page.tsx`
>
> **Fontes de verdade:** `docs/TIPOGRAFIA_PAGINAS.md`, `docs/PLANO_MESTRE_DE_MIDIA.md` (PARTE 4), `src/styles/globals.css`, `src/data/media-spec.ts` + componentes em `src/components/`.
>
> **Regra:** nada inventado. Onde a informação não existe no código: `"Não identificado no projeto"`.
>
> **Última actualização:** Jul 2026 (layout intro + form split; sem canais com ícones nem CTA final).

---

## Estrutura geral da página

| Campo | Detalhe |
|---|---|
| Rota | `/contacto` |
| Arquivo | `src/app/(site)/contacto/page.tsx` |
| Componentes | `SectionLabel`, `RevealOnScroll`, `RevealSequence`, `ContactForm` |
| Dados | arrays `SERVICOS_INTERESSE` e campos em `ContactForm.tsx` |
| Metadata | `title: "Contacto"`; `description` sobre reunião gratuita |
| Globais (via `(site)/layout.tsx`) | `Navbar`, `Footer`, `ChatWidgetLoader`, `SmoothScroll` (Lenis) |

**Ordem das seções:**

1. Seção 01 — Cabeçalho (intro)
2. Seção 02 — Formulário (split: copy sticky + form)

> A página é **puramente tipográfica** (sem assets de imagem). O PLANO prevê fundo decorativo opcional `CON-01`, mas **não é renderizado**.

**Removido do template (não documentar como activo):**

- Array `CANAIS` com ícones (`Mail`, `Phone`, `Link2`, `MapPin`)
- Secção CTA final "Preferimos falar pessoalmente?" + botão "Ligar agora"

---

# Seção 01 — Cabeçalho (intro)

### 1. Objetivo
Título e descrição da página de contacto.

### 2. Copy / Textos

| Campo | Label | `<h1>` | `<p>` |
|---|---|---|---|
| Conteúdo | `Contacto` | `Vamos conversar` | texto sobre reunião gratuita |
| Elemento HTML | `h2` | `h1` | `p` |
| Classe | `.type-section-title` | `.type-h2` | `.type-body-lg` |
| Família | Host Grotesk | Host Grotesk | DM Sans |
| Tamanho | `clamp(30px,4vw,46px)` | `clamp(42px,6vw,72px)` | 21px |
| Cor | `#0a0a0a` | `#0a0a0a` | `#575757` (`text-gmt-muted`) |

Label via `SectionLabel variant="title"`. Encadeado com `RevealSequence`.

### 3. Imagens / mídia
Nenhuma.

### 4. Botões / CTAs
Nenhum.

### 5. Arquivos relacionados
`src/app/(site)/contacto/page.tsx`, `src/components/ui/SectionLabel.tsx`.

---

# Seção 02 — Formulário (split)

### 1. Objetivo
Layout split: coluna esquerda com copy sticky + link telefone; coluna direita com `ContactForm`.

### 2. Copy / Textos

**Coluna esquerda (sticky `md:top-28`):**

| Campo | Label | `<p>` | Link telefone |
|---|---|---|---|
| Conteúdo | `Conte-nos o essencial` | texto sobre preencher formulário | `Prefere ligar? +351 913 628 211` |
| Classe | `.type-section-title` | `.type-body-lg` | `.type-label` + underline hover |
| Link | — | — | `tel:+351913628211` |

**Coluna direita — `ContactForm.tsx`:**

| Campo | Labels | Checkboxes | Textarea |
|---|---|---|---|
| Conteúdo | `Nome *` · `Email *` · `Telefone` · `Empresa` | `Serviços de interesse` (8 opções) | `Conte-nos sobre o seu projeto *` |
| Classe | `.type-body` (label flutuante) | `.type-label` + `.type-body` | idem |
| Honeypot | `_hp_website` (oculto, anti-spam) | — | — |

Opções de interesse: Automação & IA · Criação de Conteúdo · Publicidade Digital · Branding & Estratégia · Websites · Inteligência Artificial · Analytics & Otimização · Pacotes de Marketing.

### 3. Imagens / mídia

| ID | Slot | Status |
|---|---|---|
| CON-01 | Fundo decorativo (opcional no PLANO) | **Lacuna de uso** — asset existe mas não referenciado |

### 4. Botões / CTAs

**Formulário:**
- Checkboxes toggle (`aria-pressed`): círculo `rounded-full border`; ativo `border-gmt-accent bg-gmt-accent`
- Submit `Enviar mensagem` → `.btn-submit` (fundo branco translúcido, texto preto, `rounded-full`)
- Estado sucesso: `Mensagem enviada` + `Obrigado pelo contacto…`
- Submissão **estática** (`console.log`, sem backend)

### 5. Animações
| O que anima | Biblioteca | Gatilho |
|---|---|---|
| Copy esquerda | `RevealSequence` | on-scroll |
| Formulário | `RevealOnScroll variant="media"` | on-scroll |
| Labels flutuantes | CSS peer-selector | focus / preenchido |

### 6. Responsividade
- **Desktop:** `grid md:grid-cols-[0.8fr_1.2fr]`; coluna esquerda sticky.
- **Mobile:** coluna única; `px-5`, `py-12`.

### 7. Arquivos relacionados
`src/app/(site)/contacto/page.tsx`, `src/components/ui/ContactForm.tsx`, `src/styles/globals.css`.

---

## Apêndice — tokens usados no Contacto

| Token | Valor | Onde |
|---|---|---|
| `--gmt-bg` | `#ffffff` | fundo |
| `--gmt-text` | `#0a0a0a` | títulos, inputs |
| `--gmt-text-muted` | `#575757` | descrições, labels |
| `--gmt-border` | `#dcdcdc` | bordas, separador `border-t` |
| `--gmt-accent` | `#2563eb` | foco, checkbox ativo |
| `.btn-submit` | fundo `rgb(255 255 255 / 0.7)`, texto `#000` | botão enviar |

*Documento gerado a partir do código do repositório. Nenhuma informação foi inventada.*
