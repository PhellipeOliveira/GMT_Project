# Paleta de cores — guia de implementação

Este documento descreve como o repositório define, nomeia e aplica cores no website GMT. Use-o como referência ao propor uma nova paleta, pedir alterações a um agente de IA ou implementar mudanças manualmente.

**Última actualização:** Junho 2026 — tema claro global + CTA final escuro em todas as páginas.

---

## Resumo executivo

| Pergunta | Resposta |
|----------|----------|
| Onde vive a paleta? | `src/styles/globals.css` |
| Formato dos valores | Hex (`#ffffff`, `#0a0a0a`, etc.) nas variáveis CSS |
| É tokenizado? | Sim — variáveis CSS `--gmt-*` expostas ao Tailwind como `gmt-*` |
| Tema por defeito | **Claro** — fundo branco, texto preto |
| Onde mudar para trocar a paleta inteira? | Bloco `:root` em `globals.css` |
| Ficheiro `tokens.css`? | Legado do scaffold inicial — **não está ligado ao site** |

---

## Ritmo visual das páginas

Todas as rotas seguem o mesmo padrão de contraste:

```
┌─────────────────────────────────────┐
│  Secções de conteúdo                │  fundo branco (#ffffff)
│  texto preto (#0a0a0a)              │  muted #575757
│  cartões / inputs → #f5f5f5         │
├─────────────────────────────────────┤
│  .section-cta (ÚLTIMO contentor)    │  fundo preto (#000000)
│  texto branco (#ffffff)             │  muted #94a3b8
│  botão → .btn-submit                │
├─────────────────────────────────────┤
│  .section-footer (global)           │  fundo #101010
│  texto branco                       │
└─────────────────────────────────────┘
```

**Regra obrigatória:** o **último `<section>` de conteúdo** de cada página deve usar a classe `section-cta`. Nunca terminar uma página com fundo branco antes do footer.

Páginas com `section-cta` implementado:

| Rota | Ficheiro |
|------|----------|
| `/` | `src/app/page.tsx` |
| `/sobre` | `src/app/sobre/page.tsx` |
| `/servicos` | `src/app/servicos/page.tsx` |
| `/servicos/[slug]` | `src/app/servicos/[slug]/page.tsx` |
| `/portfolio` | `src/app/portfolio/page.tsx` |
| `/portfolio/[slug]` | `src/app/portfolio/[slug]/page.tsx` |
| `/contacto` | `src/app/contacto/page.tsx` |

### Exemplo de markup

```tsx
<section className="section-cta px-5 py-20 text-center md:px-[5vw] md:py-[8vw]">
  <RevealText as="h2" className="type-h3 mx-auto max-w-2xl">
    Título do CTA
  </RevealText>
  <p className="type-body mt-4 text-gmt-muted">Subtítulo</p>
  <Link href="/contacto" className="btn-submit mt-8">
    Agendar reunião
  </Link>
</section>
```

Dentro de `.section-cta`, os tokens `--gmt-text` e `--gmt-text-muted` são **redefinidos localmente** para branco/cinza-claro — não é necessário `text-white` nos filhos.

---

## Arquitetura em camadas

```
┌─────────────────────────────────────────────────────────────┐
│  Componentes (TSX)                                          │
│  className="bg-gmt-bg text-gmt-muted section-cta"           │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Tailwind CSS v4 (@theme inline em globals.css)             │
│  --color-gmt-bg  →  utilitários bg-gmt-bg, text-gmt-bg…     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Variáveis CSS (:root em globals.css)                       │
│  --gmt-bg: #ffffff;  --gmt-text: #0a0a0a;                   │
└─────────────────────────────────────────────────────────────┘
```

**Regra de ouro:** componentes devem usar classes `gmt-*` ou `var(--gmt-*)`. Evitar hex solto em JSX, excepto em dados de placeholder de mídia.

---

## Tokens activos — tema claro (padrão)

Definidos em `:root` de `src/styles/globals.css`:

| Token CSS | Classe Tailwind | Valor actual | Função |
|-----------|-----------------|--------------|--------|
| `--gmt-bg` | `bg-gmt-bg` | `#ffffff` | Fundo principal do site |
| `--gmt-bg-alt` | `bg-gmt-bg-alt` | `#f5f5f5` | Cartões, inputs, superfícies elevadas |
| `--gmt-border` | `border-gmt-border` | `#dcdcdc` | Divisores e contornos |
| `--gmt-text` | `text-gmt-text` | `#0a0a0a` | Texto principal sobre fundo claro |
| `--gmt-text-muted` | `text-gmt-muted` | `#575757` | Labels, subtítulos, texto secundário |
| `--gmt-accent` | `bg-gmt-accent`, `text-gmt-accent` | `#2563eb` | CTAs, links, focus, hover de títulos |
| `--gmt-accent-2` | `bg-gmt-accent-2` | `#7c3aed` | Hover de botões accent |

### Tokens escuros (secções especiais)

Usados por classes que redefinem o contexto local:

| Token CSS | Valor | Onde se aplica |
|-----------|-------|----------------|
| `--gmt-bg-dark` | `#0a0f1e` | Referência legada / overlays |
| `--gmt-text-on-dark` | `#ffffff` | Texto sobre imagens com gradiente escuro |
| `--gmt-muted-on-dark` | `#94a3b8` | Texto secundário em fundos escuros |
| `--gmt-footer` | `#101010` | Footer global (`.section-footer`) |

---

## Classes de secção temática

| Classe | Fundo | Texto | Uso |
|--------|-------|-------|-----|
| *(padrão / `:root`)* | `#ffffff` | `#0a0a0a` | Maioria das secções |
| `.section-light` | `#ffffff` | `#0a0a0a` | Wrapper explícito (Serviços, Sobre Sec. 01) — equivalente ao padrão |
| `.section-cta` | `#000000` | `#ffffff` | **Último contentor de cada página** |
| `.section-footer` | `#101010` | `#ffffff` | Footer global em `Footer.tsx` |

### Excepções com fundo escuro fora do CTA

| Contexto | Tratamento |
|----------|------------|
| Hero de serviço (`/servicos/[slug]`) | Imagem + gradiente `from-black`; h1/headline centrados com `text-white`; botão voltar `bg-white/20 border-white/25 font-medium text-white backdrop-blur-md` no canto inferior esquerdo |
| Manifesto Sobre (Sec. 03) | `bg-black` sólido + `text-white` |
| Secção valores Sobre (Sec. 04) | `.section-cta` — fundo `#000000`, texto branco |
| Footer | `.section-footer` — sempre escuro |

---

## Prose e body

O `main` em `layout.tsx` usa `prose prose-gmt` (tema **claro**, não `prose-invert`):

```tsx
<main className="prose prose-gmt max-w-none flex-1">
```

Cores de headings e parágrafos em `.prose-gmt` derivam de `--gmt-text` e `--gmt-text-muted`.

---

## Nomenclatura: como falar sobre cores neste repo

### Use (vocabulário do código)

- **Fundo principal** → `gmt-bg` (branco)
- **Fundo alternativo / cartão** → `gmt-bg-alt` (cinza claro)
- **Texto principal** → `gmt-text` (preto no tema claro)
- **Texto secundário** → `gmt-muted`
- **CTA final de página** → `section-cta` (preto + texto branco)
- **Destaque / link** → `gmt-accent`

### Evite

- "O site é dark mode exclusivo" → **desactualizado**; o shell é claro desde Jun 2026
- "Cor primária" sem contexto → especifique `gmt-accent` ou `gmt-bg`

### Exemplo de pedido claro a um agente

> Manter tema claro global. Alterar accent para `#10b981`. Garantir que o último contentor de `/portfolio/[slug]` usa `section-cta`. Não alterar `.section-footer`.

---

## Procedimento: adoptar uma nova paleta

### Passo 1 — Actualizar `:root`

```css
:root {
  --gmt-bg: #ffffff;
  --gmt-bg-alt: #f5f5f5;
  --gmt-border: #dcdcdc;
  --gmt-text: #0a0a0a;
  --gmt-text-muted: #575757;
  --gmt-accent: #NOVO_VALOR;
  --gmt-accent-2: #NOVO_VALOR;
}
```

### Passo 2 — Rever secções escuras

Manter `.section-cta` e `.section-footer` com texto claro. Se mudar o preto do CTA, actualizar também `--gmt-footer`.

### Passo 3 — Contraste WCAG

- `gmt-text` / `gmt-muted` sobre `gmt-bg` e `gmt-bg-alt`
- Texto branco sobre `#000` em `.section-cta`
- Botão `.btn-submit` (fundo branco semitransparente, texto preto) sobre CTA preto

### Passo 4 — Validar

```bash
npm run dev
npm run build
```

Percorrer as 7 rotas + verificar último contentor preto em cada uma.

---

## Classes Tailwind disponíveis

```
bg-gmt-bg          bg-gmt-bg-alt
text-gmt-text      text-gmt-muted
border-gmt-border
bg-gmt-accent      bg-gmt-accent-2
text-gmt-accent    border-gmt-accent
```

Modificadores: `bg-gmt-bg/70`, `border-gmt-accent/50`.

---

## Checklist rápido

- [ ] Valores em `:root` de `globals.css`
- [ ] `.section-cta` no último contentor de **todas** as páginas
- [ ] Texto branco automático dentro de `.section-cta` (via tokens locais)
- [ ] `.section-footer` intacto
- [ ] Heroes com imagem: texto branco explícito onde há gradiente escuro
- [ ] Build + revisão visual em todas as rotas

---

## Ficheiros de referência

| Ficheiro | Papel |
|----------|-------|
| `src/styles/globals.css` | **Fonte de verdade** da paleta UI |
| `src/app/layout.tsx` | `bg-gmt-bg text-gmt-text` no body |
| `docs/TIPOGRAFIA.md` | Escala de tamanhos (complementar) |
| `docs/referencias/site_json/design_map_*.json` | Auditoria lessestudio — nomenclatura diferente |
