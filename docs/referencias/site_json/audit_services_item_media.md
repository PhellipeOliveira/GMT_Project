# Auditoria — correção de dimensões em `media_inventario`

**Arquivo editado:** `design_map_services_item_v2.json`  
**Referência:** `Untitled-3.2_services_item.json`  
**Data:** 2026-06-23  
**Escopo:** apenas a seção `media_inventario` (campos `width` e `height` em `imagens`, `badges` e `logos`)

## Contexto

Diferente dos outros design maps, este arquivo já listava assets em `imagens`, `badges` e `logos` com dimensões incorretas no campo texto `dimensoes`. Foram adicionados/atualizados apenas os campos numéricos `width` e `height` em cada objeto existente, com match por `index` (fallback por basename de `src`). O campo `dimensoes` e demais metadados **não foram alterados**.

> Valores "antes" inferidos do campo `dimensoes` existente em cada asset.

## Assets atualizados (8)

| index | grupo | src | width/height antes | width/height depois |
|-------|-------|-----|--------------------|---------------------|
| 0 | imagens | `cnd/.../4b2d1f94-5d38-412b-b423-34f0018f9cbe.webp` | 150.0×274.0 | 1536×532 |
| 1 | imagens | `cnd/.../38908f96-7f5f-4dc0-a387-b3cab41aa636.webp` | 135.0×240.0 | 683.5234375×460.796875 |
| 2 | imagens | `cnd/.../a472fc89-69d2-47f6-9f04-a08fd7295f2a.webp` | 135.0×240.0 | 683.5234375×460.796875 |
| 3 | imagens | `cnd/.../838ae005-fc2e-43d6-a92b-3b43fa9c7398.webp` | 38.0×308.0 | 337.578125×430.078125 |
| 4 | imagens | `https://pbs.twimg.com/media/HLBfQAJbcAAVvDH.jpg` | 38.0×260.0 | 337.578125×430.078125 |
| 5 | badges | `.../shopifyexperts.B7Ugdseq.png` | 0.0×0.0 | 136.875×26.109375 |
| 6 | badges | `.../shopifyexperts.B7Ugdseq.png` | 103.0×28.0 | 0×0 |
| 7 | logos | `.../logo-white.D2PbM6gr.svg` | 135.0×39.0 | 1382.40625×400.1640625 |

## Assets mantidos sem alteração (0)

| index | grupo | src | width | height | motivo |
|-------|-------|-----|-------|--------|--------|

## Trechos editados no JSON original

- **`media_inventario.imagens`** (índices 0–4): adicionados campos `width` e `height` em cada objeto.
- **`media_inventario.badges`** (índices 5–6): adicionados campos `width` e `height` em cada objeto.
- **`media_inventario.logos`** (índice 7): adicionados campos `width` e `height`.
- Nenhum outro campo ou seção do JSON foi modificado.

## Consolidação Script 3 (2026-06-23)

- **Alerta #1 (hero 1536×532):** Mantido deliberadamente — captura em monitor 1500px/1536px, não é erro.
- **Alerta #2 (src index 4):** Corrigido de `pbs.twimg.com/...` para `https://cnd.lessestudio.com/4b2d1f94-5d38-412b-b423-34f0018f9cbe.webp`.
- **Dimensões:** Revalidadas contra `Untitled-3.2_services_item.json` — todos os `width`/`height` confirmados.
