# GMT — Growth Marketing Technology

Site institucional e de produto da **GMT (Growth Marketing Technology)**, desenvolvido com Next.js e React. O repositório centraliza código-fonte, assets públicos e documentação de referência para design, copy e mídia.

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Framework** | [Next.js](https://nextjs.org) 16 (App Router) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org) 5 |
| **UI** | [React](https://react.dev) 19 |
| **Bundler** | Turbopack / Webpack (integrado ao Next.js — não há Vite neste projeto) |
| **CSS** | [Tailwind CSS](https://tailwindcss.com) v4 via PostCSS (`@tailwindcss/postcss`) |
| **Lint** | ESLint 9 + `eslint-config-next` |

### Bibliotecas de animação e efeitos

| Biblioteca | Uso previsto |
|------------|--------------|
| **Lenis** | Smooth scroll |
| **GSAP** | Animações e timelines avançadas |
| **Framer Motion** | Animações declarativas em React |

### Outras dependências relevantes

- **react-hook-form** + **@hookform/resolvers** + **zod** — formulários com validação
- **lucide-react** — ícones
- **clsx** + **tailwind-merge** — composição de classes CSS (`cn` em `src/lib/utils.ts`)
- **sharp** — otimização de imagens no build
- **@next/third-parties** — integração com scripts de terceiros (ex.: analytics)

---

## Versões e Dependências

Versões declaradas no `package.json` e resolvidas no `package-lock.json`:

### Produção (`dependencies`)

| Pacote | Versão (`package.json`) | Versão resolvida (`lock`) |
|--------|-------------------------|---------------------------|
| `next` | 16.2.9 | 16.2.9 |
| `react` / `react-dom` | 19.2.4 | 19.2.4 |
| `framer-motion` | ^12.40.0 | 12.40.0 |
| `gsap` | ^3.15.0 | 3.15.0 |
| `lenis` | ^1.3.23 | 1.3.23 |
| `react-hook-form` | ^7.80.0 | 7.80.0 |
| `zod` | ^4.4.3 | 4.4.3 |
| `sharp` | ^0.35.2 | 0.35.2 |
| `lucide-react` | ^1.21.0 | — |
| `@hookform/resolvers` | ^5.4.0 | — |
| `@next/third-parties` | ^16.2.9 | — |
| `clsx` | ^2.1.1 | — |
| `tailwind-merge` | ^3.6.0 | — |

### Desenvolvimento (`devDependencies`)

| Pacote | Versão (`package.json`) | Versão resolvida (`lock`) |
|--------|-------------------------|---------------------------|
| `typescript` | ^5 | 5.9.3 |
| `tailwindcss` | ^4 | 4.3.1 |
| `@tailwindcss/postcss` | ^4 | 4.3.1 |
| `eslint` | ^9 | 9.39.4 |
| `eslint-config-next` | 16.2.9 | 16.2.9 |
| `@types/node` | ^20 | — |
| `@types/react` / `@types/react-dom` | ^19 | — |

> **Versionamento:** mantenha `package-lock.json` versionado e evite alterar major versions sem alinhar a equipe — especialmente `next`, `react` e `tailwindcss`.

---

## Ambiente

| Requisito | Versão recomendada |
|-----------|-------------------|
| **Node.js** | **≥ 20.9.0** (exigido pelo Next.js 16, conforme `engines` no `package-lock.json`) |
| **npm** | 10+ (compatível com Node 20 LTS) |

Não há arquivo `.nvmrc` ou campo `engines` no `package.json` da raiz. Recomenda-se usar **Node 20 LTS** ou superior para desenvolvimento e CI.

```bash
node -v   # deve retornar v20.9.0 ou superior
```

---

## Scripts

Comandos disponíveis via `npm`:

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento em [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Gera o build de produção |
| `npm run start` | Sobe o servidor de produção (após `build`) |
| `npm run lint` | Executa o ESLint no projeto |

### Primeiros passos

```bash
npm install
npm run dev
```

---

## Estrutura de Pastas

```
mktproject/
├── src/
│   ├── app/              # Rotas e layouts (Next.js App Router)
│   │   ├── layout.tsx    # Layout raiz e metadata
│   │   └── page.tsx      # Página inicial
│   ├── lib/              # Utilitários compartilhados (ex.: cn())
│   └── styles/           # Estilos globais e design tokens
│       ├── globals.css
│       └── tokens.css
├── public/               # Assets estáticos servidos na raiz do site
│   ├── fonts/
│   ├── images/
│   └── videos/
├── docs/                 # Documentação do projeto
│   ├── empresa.md
│   ├── PLANO_MESTRE_DE_MIDIA.md
│   ├── relatorio_frames_criativos.md
│   └── referencias/      # Copy, design maps JSON e auditorias de mídia
│       ├── copy_site/
│       └── site_json/
├── next.config.ts        # Configuração do Next.js
├── tsconfig.json         # Configuração TypeScript (alias @/* → src/*)
├── postcss.config.mjs    # PostCSS + plugin Tailwind v4
├── eslint.config.mjs     # Regras ESLint (core-web-vitals + TypeScript)
├── package.json
└── package-lock.json
```

### Arquivos de configuração na raiz

| Arquivo | Função |
|---------|--------|
| `next.config.ts` | Configuração do Next.js |
| `tsconfig.json` | TypeScript strict; path alias `@/*` |
| `postcss.config.mjs` | Pipeline CSS com `@tailwindcss/postcss` |
| `eslint.config.mjs` | Lint com presets do Next.js |
| `AGENTS.md` / `CLAUDE.md` | Regras para agentes de IA no repositório |

---

## Deploy / Hospedagem

> **Em breve:** deploy na [Vercel](https://vercel.com) será configurado para este repositório.

Até lá, o build de produção pode ser validado localmente com `npm run build` e `npm run start`.

---

## Licença

Projeto privado (`"private": true` no `package.json`).
