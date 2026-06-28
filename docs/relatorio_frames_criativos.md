# Mapa de Frames para Producao de Midia

Fonte: `docs/referencias/site_json/*.json` + copy publica em `docs/referencias/copy_site/Produto_Conteudo_Publico_do_Site.md` e `docs/referencias/copy_site/Institucional_Conteudo_Publico_do_Site.md`.

Premissas:
- Dimensoes e proporcoes baseadas no mapeamento de layout aprovado.
- Quando a dimensao exata nao e determinavel para desktop, a proporcao foi priorizada.
- Videos com recomendacao de loop curto para sections hero/background.
- Sem uso de conteudo confidencial de preco.

## Tabela Unificada de Frames

| Pagina | Bloco/Layout | Tipo de frame | Midia | Dimensao/Proporcao | Referencia de copy | Sugestao inicial do criativo | Duracao recomendada |
|---|---|---|---|---|---|---|---|
| Home | Hero slider | Background | OPCIONAL (Imagem/Video) | 16:9 (cover) | Institucional - Quem somos | Cena institucional sobre automacoes, IA e marketing digital | Video: 5-10s loop |
| Home | Approach image principal | Background destaque | Imagem | Portrait (~1:2) | Institucional - Diferenciais | Composicao humana/tecnologica para "tecnica + criatividade" | - |
| Home | Approach thumbnails (3) | Thumbnail | Imagem | 4:3 | Institucional - Areas de especializacao | Recortes de servicos (conteudo, ads, websites) | - |
| Home | Portfolio cards | Card | Imagem | 3:4 | Institucional - Prova de capacidade (NARA) | Frames do case NARA (branding/website/produto) | - |
| Home | Testimonials logos | Thumbnail/Logo | Imagem | Altura fixa do logo (variavel em largura) | Sem bloco de depoimentos na copy publica | Placeholder de logos ate aprovacao de marcas/clientes | - |
| Home | Latest news thumbnails | Thumbnail | Imagem | Layout mapeado de thumbnail vertical estreito | Sem artigos definidos na copy publica | Placeholder editorial ate definicao de artigos | - |
| About | Slideshow expansivo (5 frames) | Background | Imagem | 2:1 (ABT-01…05) | Institucional - Ecossistema / marca | Sequencia visual no `ExpandingFrame`; fundo branco→preto no scroll | Video loop opcional futuro |
| Services Geral | Hero thumbnails (3) | Thumbnail | Imagem | 3:2 | Institucional - Areas de especializacao | Credenciais visuais por area (estrategia, visual, tech) | - |
| Services Geral | Accordion categorias | N/A (texto) | N/A | N/A | Produto - blocos de agentes e servicos avulsos | Sem criativo dedicado; foco tipografico | - |
| Services Item | Hero do servico | Background | Imagem | **3:1** (export 2560×860; cover em container 70–80vh) | Produto - headline do servico/agente | Criativo representando problema e solucao do servico | — |
| Services Item | Process cards (01-06) | Card | Imagem (opcional por card) | 3:4 | Institucional - Como funciona | Cada card representa uma etapa metodologica | - |
| Services Item | Portfolio mini (2 cases) | Card/Thumbnail | Imagem | Portrait (9:16 aproximado no mapeamento) | Institucional - NARA | Cases relacionados ao servico exibido | - |
| Services Item | Latest news cards | Card/Thumbnail | Imagem | Thumbnail vertical estreito no layout de referencia | Sem artigos definidos na copy publica | Placeholder editorial ate definicao de pauta | - |
| Portfolio Geral | Hero grid (13 thumbs) | Thumbnail | Imagem | Portrait (9:16 aproximado no mapeamento) | Institucional - NARA | Mosaico de previews de cases (iniciar com NARA) | - |
| Portfolio Geral | Lista de projetos | Card/Thumbnail | Imagem | Portrait (9:16 aproximado no mapeamento) | Institucional - NARA | Thumb por projeto com tags de servico | - |
| Portfolio Item | Galeria principal (10 imagens) | Galeria | Imagem | Portrait (3:4 ou 9:16 conforme material) | Institucional - NARA | Sequencia visual do case (branding/site/chatbot/campanha) | - |
| Portfolio Item | Next project (2 items) | Card/Thumbnail | Imagem | Portrait (9:16 aproximado) | Institucional - NARA | Teaser dos proximos cases para navegacao | - |
| Contact | Pagina de contato | N/A (sem slot de media) | N/A | N/A | Institucional - Contacto | Sem producao de assets de imagem/video | - |

## Observacoes de Producao

| Tema | Decisao |
|---|---|
| Pagina Contact | Nao requer producao de midia (sem assets no design map) |
| Slots com imagem ou video | Entregar duas opcoes quando possivel e marcar como OPCIONAL |
| Videos de hero/background | Priorizar MP4 + WebM, sem audio, loop 5-10s |
| Formato de imagens | WebP/AVIF para producao web |
| Conteudo nao definido na copy publica | Usar placeholder (depoimentos/blog/cases extras) ate aprovacao |

## Lacunas de Conteudo (sem invencao)

- Depoimentos e logos de clientes: nao existem textos/nomes publicos na copy atual.
- Blog/Latest News: nao ha lista de artigos oficial na copy publica.
- Portfolio amplo: a copy publica cita explicitamente NARA; os demais cases precisam de material aprovado.
- Metricas/counters: sem numeros explicitos para preencher blocos de prova numerica.
