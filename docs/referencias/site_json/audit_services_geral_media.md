# Auditoria — correção de dimensões em `media_inventario`

**Arquivo editado:** `design_map_services_geral_v2.json`  
**Referência:** `Untitled-3.2_services_geral.json`  
**Data:** 2026-06-23  
**Escopo:** apenas a seção `media_inventario` (sub-array `media`)

## Contexto

O design map não possuía campos estruturados `width`/`height` por asset — apenas dimensões incorretas embutidas em texto em `categorias` (viewport desktop comprimido, ex.: `135×90px`). Foi adicionado o sub-array `media` com 6 assets, usando `width` e `height` do arquivo de referência. Demais campos de `media_inventario` (`categorias`, `padrao_media`, `descoberta_v2`, etc.) **não foram alterados**.

> Valores "antes" inferidos de `categorias.hero_thumbnails.dimensoes` (`135×90px`); badge e logo de `103×28px` e `135×39px`.

## Assets atualizados (5)

| index | src | width/height antes | width/height depois |
|-------|-----|--------------------|---------------------|
| 0 | `cnd/.../4b2d1f94-5d38-412b-b423-34f0018f9cbe.webp` | 135×90 | 691.203125×460.796875 |
| 1 | `cnd/.../f1c55e51-f010-4928-a5ee-89134300820b.webp` | 135×90 | 691.203125×460.796875 |
| 2 | `cnd/.../7e2e197d-c7d5-4a71-96ef-d81b13a46f96.webp` | 135×90 | 691.203125×460.796875 |
| 3 | `lesse/.../_app/immutable/assets/shopifyexperts.B7Ugdseq.png` | 103×28 | 136.875×26.109375 |
| 5 | `lesse/.../_app/immutable/assets/logo-white.D2PbM6gr.svg` | 135×39 | 1382.40625×400.1640625 |

## Assets mantidos sem alteração (1)

| index | src | width | height | motivo |
|-------|-----|-------|--------|--------|
| 4 | `lesse/.../_app/immutable/assets/shopifyexperts.B7Ugdseq.png` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |

## Trechos editados no JSON original

- **Após `descoberta_v2`** dentro de `media_inventario`: inserção do bloco `"media": [ ... ]` com 6 objetos (índices 0–5).
- Dentro de cada objeto em `media`, os campos `width` e `height` receberam os valores corretos de `Untitled-3.2_services_geral.json`; `index`, `type`, `src` e `classes` foram copiados integralmente da referência.
