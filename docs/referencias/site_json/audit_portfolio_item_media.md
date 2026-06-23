# Auditoria — correção de dimensões em `media_inventario`

**Arquivo editado:** `design_map_portfolio_item_v2.json`  
**Referência:** `Untitled-3.2_portfolio_item.json`  
**Data:** 2026-06-23  
**Escopo:** apenas a seção `media_inventario` (sub-array `media`)

## Contexto

O design map não possuía campos estruturados `width`/`height` por asset — apenas dimensões incorretas embutidas em texto em `categorias` (viewport comprimido, ex.: `135×240px`). Foi adicionado o sub-array `media` com 15 assets, usando `width` e `height` do arquivo de referência. Demais campos de `media_inventario` (`categorias`, `padrao_media`, etc.) **não foram alterados**.

> Valores "antes" inferidos de `categorias.galeria_projeto.dimensoes_capturadas` e `next_project_thumbnails.dimensoes` (`135×240px`); badge e logo de `103×28px` e `135×39px`.

## Assets atualizados (14)

| index | src | width/height antes | width/height depois |
|-------|-----|--------------------|---------------------|
| 0 | `cnd/.../96ab8861-72d3-4744-8c8a-ab109bcc99a7.webp` | 135×240 | 801.796875×460.796875 |
| 1 | `cnd/.../0a323da3-d73d-4db1-9510-4c08143abfa5.webp` | 135×240 | 801.796875×601.71875 |
| 2 | `cnd/.../a0639cb2-1c67-4da6-bc35-ebf68197db74.webp` | 135×240 | 801.796875×601.71875 |
| 3 | `cnd/.../f49edf61-c854-4068-a71e-ce1e8e00531c.webp` | 135×240 | 801.796875×601.71875 |
| 4 | `cnd/.../100f999c-1fb7-4854-b66b-75cb58483239.webp` | 135×240 | 801.796875×601.71875 |
| 5 | `cnd/.../96ab8861-72d3-4744-8c8a-ab109bcc99a7.webp` | 135×240 | 801.796875×601.71875 |
| 6 | `cnd/.../32785274-bfed-4133-8195-afab93cd6b8f.webp` | 135×240 | 801.796875×601.71875 |
| 7 | `cnd/.../872c2258-cc87-4f55-bc25-ab31f6287f02.webp` | 135×240 | 801.796875×601.71875 |
| 8 | `cnd/.../7519d285-98cf-42c4-a82f-1e0404fdcbf8.webp` | 135×240 | 801.796875×601.71875 |
| 9 | `cnd/.../e07eee5f-f071-41f5-92f6-68cf9e96eb54.webp` | 135×240 | 801.796875×601.71875 |
| 10 | `cnd/.../6f8c4c12-3a61-4b58-b687-f992105018ec.webp` | 135×240 | 679.6796875×460.796875 |
| 11 | `cnd/.../38908f96-7f5f-4dc0-a387-b3cab41aa636.webp` | 135×240 | 679.6875×460.796875 |
| 12 | `lesse/.../_app/immutable/assets/shopifyexperts.B7Ugdseq.png` | 103×28 | 136.875×26.109375 |
| 14 | `lesse/.../_app/immutable/assets/logo-white.D2PbM6gr.svg` | 135×39 | 1382.40625×400.1640625 |

## Assets mantidos sem alteração (1)

| index | src | width | height | motivo |
|-------|-----|-------|--------|--------|
| 13 | `lesse/.../_app/immutable/assets/shopifyexperts.B7Ugdseq.png` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |

## Trechos editados no JSON original

- **Após `padrao_media`** dentro de `media_inventario`: inserção do bloco `"media": [ ... ]` com 15 objetos (índices 0–14).
- Dentro de cada objeto em `media`, os campos `width` e `height` receberam os valores corretos de `Untitled-3.2_portfolio_item.json`; `index`, `type`, `src` e `classes` foram copiados integralmente da referência.
