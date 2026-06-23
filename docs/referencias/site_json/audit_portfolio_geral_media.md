# Auditoria — correção de dimensões em `media_inventario`

**Arquivo editado:** `design_map_portfolio_geral_v2.json`  
**Referência:** `Untitled-3.2_portfolio_geral.json`  
**Data:** 2026-06-23  
**Escopo:** apenas a seção `media_inventario` (sub-array `media`)

## Contexto

O design map não possuía campos estruturados `width`/`height` por asset — apenas dimensões incorretas embutidas em texto em `categorias` (viewport desktop comprimido, ex.: `135×240px`). Foi adicionado o sub-array `media` com 16 assets, usando `width` e `height` do arquivo de referência. Demais campos de `media_inventario` (`categorias`, `padrao_media`, `comparacao_com_home`, etc.) **não foram alterados**.

> Valores "antes" dos thumbnails inferidos de `categorias.project_thumbnails.dimensoes` (`135×240px`); badge e logo de `103×28px` e `135×39px`.

## Assets atualizados (15)

| index | src | width/height antes | width/height depois |
|-------|-----|--------------------|---------------------|
| 0 | `cnd/.../96ab8861-72d3-4744-8c8a-ab109bcc99a7.webp` | 135×240 | 679.6796875×460.796875 |
| 1 | `cnd/.../6f8c4c12-3a61-4b58-b687-f992105018ec.webp` | 135×240 | 679.6875×460.796875 |
| 2 | `cnd/.../38908f96-7f5f-4dc0-a387-b3cab41aa636.webp` | 135×240 | 679.6796875×460.796875 |
| 3 | `cnd/.../70bbeb87-0ba7-44cc-9ef9-94c26a37ec44.webp` | 135×240 | 679.6875×460.796875 |
| 4 | `cnd/.../a472fc89-69d2-47f6-9f04-a08fd7295f2a.webp` | 135×240 | 679.6796875×460.796875 |
| 5 | `cnd/.../11122428-b78c-40cd-86fb-10b616a02af1.webp` | 135×240 | 679.6875×460.796875 |
| 6 | `cnd/.../782e6ec6-ec79-41ca-9747-bb1b0e1e16cf.webp` | 135×240 | 679.6796875×460.796875 |
| 7 | `cnd/.../1c8889ef-8920-4602-8a99-0b74da28ada8.webp` | 135×240 | 679.6875×460.796875 |
| 8 | `cnd/.../d48f888e-f08e-46ae-9d66-d64c8e316f8e.webp` | 135×240 | 679.6796875×460.796875 |
| 9 | `cnd/.../3cdf1f18-1246-4400-a9a9-d37f2d81a836.webp` | 135×240 | 679.6875×460.796875 |
| 10 | `cnd/.../46daaa86-8bb4-46b1-a6f8-1162eadae5bc.webp` | 135×240 | 679.6796875×460.796875 |
| 11 | `cnd/.../f9666580-3080-41c4-91ba-629b52b0bb26.webp` | 135×240 | 679.6875×460.796875 |
| 12 | `cnd/.../908173da-3954-439f-86de-eec2a13a1fed.webp` | 135×240 | 679.6796875×460.796875 |
| 13 | `lesse/.../_app/immutable/assets/shopifyexperts.B7Ugdseq.png` | 103×28 | 136.875×26.109375 |
| 15 | `lesse/.../_app/immutable/assets/logo-white.D2PbM6gr.svg` | 135×39 | 1382.40625×400.1640625 |

## Assets mantidos sem alteração (1)

| index | src | width | height | motivo |
|-------|-----|-------|--------|--------|
| 14 | `lesse/.../_app/immutable/assets/shopifyexperts.B7Ugdseq.png` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |

## Trechos editados no JSON original

- **Após `comparacao_com_home`** dentro de `media_inventario`: inserção do bloco `"media": [ ... ]` com 16 objetos (índices 0–15).
- Dentro de cada objeto em `media`, os campos `width` e `height` receberam os valores corretos de `Untitled-3.2_portfolio_geral.json`; `index`, `type`, `src` e `classes` foram copiados integralmente da referência.
