# Auditoria — correção de dimensões em `media_inventario`

**Arquivo editado:** `design_map_about_v2.json`  
**Referência:** `Untitled-3.2_about.json`  
**Data:** 2026-06-23  
**Escopo:** apenas a seção `media_inventario` (sub-array `media`)

## Contexto

O design map não possuía campos estruturados `width`/`height` — apenas dimensões incorretas embutidas em texto na `classificacao` (viewport desktop comprimido). Foi adicionado o sub-array `media` com 4 assets, usando `width` e `height` do arquivo de referência. Demais campos de `media_inventario` (`classificacao`, `dimensoes_tipicas`, `nota_fullscreen_section`, etc.) **não foram alterados**.

## Assets atualizados

| index | src | width/height antes | width/height depois |
|-------|-----|--------------------|---------------------|
| 0 | `https://cnd.lessestudio.com/9f75a1bc-35f8-41ef-be3a-56ead44686f0.gif` | 60 × 45 | 1382.3984375 × 667.8359375 |
| 1 | `https://lessestudio.com/_app/immutable/assets/shopifyexperts.B7Ugdseq.png` (classes: `h-[1.7vw]`) | 103 × 28 | 136.875 × 26.109375 |
| 3 | `https://lessestudio.com/_app/immutable/assets/logo-white.D2PbM6gr.svg` | 135 × 39 | 1382.40625 × 400.1640625 |

> Valores "antes" inferidos a partir dos textos em `classificacao` (`60×45px`, `103×28px`, `135×39px`), que refletiam o capture com browser comprimido.

## Assets mantidos sem alteração

| index | src | width | height | motivo |
|-------|-----|-------|--------|--------|
| 2 | `https://lessestudio.com/_app/immutable/assets/shopifyexperts.B7Ugdseq.png` (classes: `h-7`) | 0 | 0 | Valor da referência já é 0×0 (instância oculta/lazy-load). Não havia dimensão estruturada prévia no design map para este index. |

## Trechos editados no JSON original

- **Linhas ~307–340** (após `nota_fullscreen_section`): inserção do bloco `"media": [ ... ]` com 4 objetos.
- Dentro de cada objeto em `media`, apenas os campos `width` e `height` receberam os valores corretos da referência; `index`, `type`, `src` e `classes` foram copiados integralmente de `Untitled-3.2_about.json`.
