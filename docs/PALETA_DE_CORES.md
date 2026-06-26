# Paleta de cores — guia de implementação

Este documento descreve como o repositório define, nomeia e aplica cores no website GMT. Use-o como referência ao propor uma nova paleta, pedir alterações a um agente de IA ou implementar mudanças manualmente.

---

## Resumo executivo

| Pergunta | Resposta |
|----------|----------|
| Onde vive a paleta? | `src/styles/globals.css` |
| Formato dos valores | Hex (`#0a0f1e`) nas variáveis CSS; alguns valores de corpo de texto em `oklch()` |
| É tokenizado? | Sim — variáveis CSS `--gmt-*` expostas ao Tailwind como `gmt-*` |
| Usa primário / secundário / terciário? | **Não** nessa nomenclatura. O site usa nomes **semânticos por função** (`bg`, `text`, `accent`, etc.) |
| Onde mudar para trocar a paleta inteira? | Bloco `:root` em `globals.css` (7 variáveis principais) |
| Ficheiro `tokens.css`? | Legado do scaffold inicial — **não está ligado ao site** |

---

## Arquitetura em camadas

```
┌─────────────────────────────────────────────────────────────┐
│  Componentes (TSX)                                          │
│  className="bg-gmt-bg text-gmt-muted border-gmt-accent"     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Tailwind CSS v4 (@theme inline em globals.css)             │
│  --color-gmt-bg  →  utilitários bg-gmt-bg, text-gmt-bg…     │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│  Variáveis CSS (:root em globals.css)                       │
│  --gmt-bg: #0a0f1e;                                         │
└─────────────────────────────────────────────────────────────┘
```

**Regra de ouro:** componentes devem usar classes `gmt-*` ou `var(--gmt-*)`. Evitar hex solto em JSX, exceto em dados de placeholder de mídia (ver secção abaixo).

---

## Tokens ativos (paleta GMT)

Definidos em `src/styles/globals.css`:

| Token CSS | Classe Tailwind | Valor atual | Função |
|-----------|-----------------|-------------|--------|
| `--gmt-bg` | `bg-gmt-bg`, `text-gmt-bg` | `#0a0f1e` | Fundo principal do site (dark) |
| `--gmt-bg-alt` | `bg-gmt-bg-alt` | `#0f1729` | Fundo de cartões, inputs, superfícies elevadas |
| `--gmt-border` | `border-gmt-border` | `#1e293b` | Divisores, contornos de cartões e formulários |
| `--gmt-text` | `text-gmt-text` | `#ffffff` | Texto principal sobre fundo escuro |
| `--gmt-text-muted` | `text-gmt-muted` | `#94a3b8` | Labels, subtítulos, texto secundário |
| `--gmt-accent` | `bg-gmt-accent`, `text-gmt-accent`, `border-gmt-accent` | `#2563eb` | CTAs, links de destaque, focus, hover de títulos |
| `--gmt-accent-2` | `bg-gmt-accent-2`, `hover:bg-gmt-accent-2` | `#7c3aed` | Hover de botões (transição azul → roxo) |

### Cores derivadas (não são tokens próprios)

Estes valores aparecem no CSS mas derivam dos tokens acima:

| Uso | Valor | Origem |
|-----|-------|--------|
| Corpo de texto em `.prose-gmt` | `oklch(87.2% 0.01 258.338)` | Tom de cinza-claro calibrado para leitura |
| Lead / subtítulo em prose | `oklch(70.7% 0.022 261.325)` | Tom intermédio |
| Borda do cursor follower | `color-mix(in srgb, var(--gmt-accent) 60%, transparent)` | Accent com opacidade |

Ao reconstruir a paleta, convém **redefinir estes oklch** para harmonizar com os novos fundos e textos, ou substituí-los por variáveis dedicadas (ex.: `--gmt-text-body`).

### Exceções hardcoded nos componentes

Alguns ficheiros usam utilitários Tailwind genéricos em vez de tokens:

| Padrão | Onde | Sugestão ao mudar paleta |
|--------|------|--------------------------|
| `text-white` | Botões com `bg-gmt-accent` | Pode manter se o accent for sempre escuro o suficiente |
| `bg-white/10`, `text-white/40` | Pills, placeholders, valores na página Sobre | Considerar criar `--gmt-surface-subtle` e `--gmt-text-faint` |

---

## O que **não** é a paleta do site

### 1. `src/styles/tokens.css` (legado)

Contém tokens de um scaffold inicial (`--color-primary`, `--color-secondary`, `--color-accent`, fontes Geist). **Não é importado** em nenhum sítio — apenas referenciado no README. Não altere este ficheiro esperando impacto visual; ou remova-o numa limpeza futura, ou ignore-o.

### 2. Design maps em `docs/referencias/site_json/`

Ficheiros como `design_map_home_v2.json` documentam o site de referência (lessestudio.com) com nomenclatura diferente:

- `--bg-primary`, `--bg-secondary`
- `--text-primary`, `--text-secondary`
- Modo claro/escuro dual em algumas páginas

São **documentação de auditoria**, não o código em produção. Ao pedir alterações, diga explicitamente se quer alinhar com esses JSONs ou manter o sistema `gmt-*` actual.

### 3. Cores de placeholder de mídia

Separadas da identidade visual do UI. Vivem em dados, não em CSS:

| Ficheiro | Constante | Uso |
|----------|-----------|-----|
| `src/data/servicos.ts` | `CORES_FAMILIA` | Fundo temporário de imagens por família de serviço (F1–F4, MKT, AV) |
| `src/data/portfolio.ts` | `COR_PORTFOLIO` | Fundo de placeholders de cases |

Estas cores servem apenas enquanto a mídia real não existe (`PlaceholderMedia`). Não afectam botões, navbar ou tipografia.

---

## Nomenclatura: como falar sobre cores neste repo

### Use (vocabulário do código)

- **Fundo principal** → `gmt-bg`
- **Fundo alternativo / cartão** → `gmt-bg-alt`
- **Texto principal** → `gmt-text`
- **Texto secundário / label** → `gmt-muted` (mapeia `--gmt-text-muted`)
- **Borda** → `gmt-border`
- **Destaque / CTA** → `gmt-accent`
- **Destaque hover** → `gmt-accent-2`

### Evite (não mapeiam 1:1 no código)

- "Cor primária da marca" → traduza para `gmt-accent` ou `gmt-bg`, conforme o contexto
- "Cor secundária" → normalmente `gmt-accent-2` ou `gmt-muted`
- "Cor terciária" → não existe token; especifique o elemento (ex.: "borda dos cartões")
- "Preto / branco do design map" → o site actual é **dark mode exclusivo**; não há toggle claro/escuro

### Exemplo de pedido claro a um agente

> Quero uma nova paleta: fundo `#050810`, texto `#f0f0f0`, muted `#6b7280`, accent `#10b981`, accent-2 `#059669`. Actualizar `:root` e `@theme inline` em `globals.css`, rever oklch do `.prose-gmt`, e substituir `text-white/40` por um token se necessário.

---

## Procedimento: adoptar uma nova paleta

### Passo 1 — Definir a paleta (fora do código)

Prepare uma tabela com **pelo menos** estes 7 papéis:

1. Fundo principal
2. Fundo alternativo
3. Borda
4. Texto principal
5. Texto secundário
6. Accent (CTA)
7. Accent hover

Opcional: superfície subtil (`white/10`), texto faint (`white/40`), cor de link em prose.

### Passo 2 — Actualizar `src/styles/globals.css`

**2a.** Alterar valores no bloco `:root`:

```css
:root {
  --gmt-bg: #NOVO_VALOR;
  --gmt-bg-alt: #NOVO_VALOR;
  --gmt-border: #NOVO_VALOR;
  --gmt-text: #NOVO_VALOR;
  --gmt-text-muted: #NOVO_VALOR;
  --gmt-accent: #NOVO_VALOR;
  --gmt-accent-2: #NOVO_VALOR;
}
```

**2b.** O bloco `@theme inline` já referencia `var(--gmt-*)` — em regra **não precisa de hex duplicado**, apenas confirme que as linhas `--color-gmt-*` continuam a apontar para as variáveis correctas.

**2c.** Rever variáveis prose e `.prose-gmt` se o contraste do corpo de texto mudar.

**2d.** Se adoptar novos papéis (ex.: `--gmt-surface-subtle`), adicionar em `:root`, espelhar em `@theme inline` como `--color-gmt-surface-subtle`, e usar `bg-gmt-surface-subtle` nos componentes.

### Passo 3 — Verificar contraste e estados

Percorrer visualmente (ou com ferramenta WCAG):

- Texto `gmt-text` e `gmt-muted` sobre `gmt-bg` e `gmt-bg-alt`
- Botões `bg-gmt-accent` com `text-white`
- Estados `hover:bg-gmt-accent-2`, `focus:border-gmt-accent`
- Bordas `border-gmt-border` em cartões e formulários
- `CursorFollower` (usa `gmt-accent` com mix)

### Passo 4 — Limpar excepções (opcional mas recomendado)

```bash
# Encontrar cores fora do sistema de tokens
rg '#[0-9a-fA-F]{3,8}' src/
rg 'text-white|bg-white|black/' src/
```

Substituir por tokens novos onde fizer sentido.

### Passo 5 — Placeholders de mídia (se a marca mudar)

Actualizar `CORES_FAMILIA` em `src/data/servicos.ts` e `COR_PORTFOLIO` em `src/data/portfolio.ts` — são independentes do UI shell.

### Passo 6 — Validar

```bash
npm run dev    # revisão visual página a página
npm run build  # garantir que o build CSS compila
```

Páginas-chave: Home, Serviços (lista + item), Portfolio (lista + item), Sobre, Contacto, Navbar, Footer, formulário.

---

## Classes Tailwind disponíveis

Com os tokens actuais, pode usar:

```
bg-gmt-bg          bg-gmt-bg-alt
text-gmt-text      text-gmt-muted
border-gmt-border
bg-gmt-accent      bg-gmt-accent-2
text-gmt-accent    border-gmt-accent
hover:bg-gmt-accent-2
focus:border-gmt-accent
```

Modificadores de opacidade funcionam: `bg-gmt-bg/70`, `border-gmt-accent/50`.

Em CSS customizado: `var(--gmt-bg)`, `var(--gmt-accent)`, etc.

---

## Modo claro / escuro

O site actual **não implementa** `prefers-color-scheme` nem toggle de tema. Tudo assume fundo escuro.

Se no futuro quiser dual-mode:

1. Duplicar tokens (`--gmt-bg` vs `--gmt-bg-light`) ou usar `@media (prefers-color-scheme: light)`
2. Actualizar `html`/`body` e o `main` com classe de tema
3. Rever `prose-invert` — pode passar a `prose` normal no modo claro

O ficheiro legado `tokens.css` tinha um esboço de dark mode com `--color-background` / `--color-foreground`; não está activo.

---

## Checklist rápido

- [ ] Valores novos em `:root` de `globals.css`
- [ ] `@theme inline` coerente (sem hex órfão)
- [ ] Prose / oklch revistos
- [ ] Contraste WCAG nos pares texto/fundo
- [ ] Botões e focus states testados
- [ ] Excepções `white/10`, `white/40` tratadas
- [ ] `CORES_FAMILIA` / `COR_PORTFOLIO` actualizados se necessário
- [ ] Build e revisão visual em todas as rotas

---

## Ficheiros de referência

| Ficheiro | Papel |
|----------|-------|
| `src/styles/globals.css` | **Fonte de verdade** da paleta UI |
| `tailwind.config.ts` | Comentário: tokens vivem em `globals.css` |
| `src/app/layout.tsx` | Aplica `bg-gmt-bg text-gmt-text` no body |
| `src/styles/tokens.css` | Legado — ignorar para UI |
| `docs/referencias/site_json/design_map_*.json` | Auditoria do site de referência — nomenclatura diferente |
