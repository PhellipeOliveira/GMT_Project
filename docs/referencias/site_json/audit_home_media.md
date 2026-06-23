# Auditoria — correção de dimensões em `media_inventario`

**Arquivo editado:** `design_map_home_v2.json`  
**Referência:** `Untitled-3.2_home.json`  
**Data:** 2026-06-23  
**Escopo:** apenas a seção `media_inventario` (sub-array `media`)

## Contexto

O design map não possuía campos estruturados `width`/`height` por asset — apenas dimensões incorretas embutidas em texto em `categorias` (viewport desktop comprimido). Foi adicionado o sub-array `media` com 37 assets, usando `width` e `height` do arquivo de referência. Demais campos de `media_inventario` (`categorias`, `padrao_de_carregamento`, etc.) **não foram alterados**.

> Valores "antes" dos assets visíveis inferidos a partir dos textos em `categorias` (`320×432px`, `110×225px`, `86×64.5px`, `38×308px`, `103×28px`, `135×39px`, etc.).

## Assets atualizados (24)

| index | src | width/height antes | width/height depois |
|-------|-----|--------------------|---------------------|
| 8 | `cnd/.../e113b372-aac0-4e83-8f28-de14751f6e96.webp` | 320×432 | 334.078125×460.796875 |
| 9 | `cnd/.../041ae269-b7a7-40b0-bf96-363d0fe963d0.webp` | 320×432 | 334.0859375×460.796875 |
| 10 | `cnd/.../db339f03-79b7-4807-aa25-3a8e969eaa55.webp` | 320×432 | 334.078125×460.796875 |
| 11 | `cnd/.../80c988d7-15e9-4dd0-8b32-d082b6073d4c.webp` | 320×432 | 334.0859375×460.796875 |
| 12 | `cnd/.../1e700789-d780-4007-9f4b-2256a9011bf8.webp` | 320×432 | 334.078125×460.796875 |
| 13 | `cnd/.../8559622c-4408-4d25-b428-97b84234db83.webp` | 320×432 | 334.0859375×460.796875 |
| 14 | `cnd/.../ca2caace-1213-4e6b-bc78-e3f3727d2deb.webp` | 320×432 | 334.078125×460.796875 |
| 15 | `cnd/.../d6db8f5b-c7d7-4a15-b448-451705aaa9a8.webp` | 320×432 | 334.0859375×460.796875 |
| 16 | `cnd/.../9f75a1bc-35f8-41ef-be3a-56ead44686f0.gif` | 60×45 | 1382.3984375×667.8359375 |
| 17 | `cnd/.../96ab8861-72d3-4744-8c8a-ab109bcc99a7.webp` | 110×225 | 645.125×460.796875 |
| 18 | `cnd/.../11122428-b78c-40cd-86fb-10b616a02af1.webp` | 86×64.5 | 645.125×460.796875 |
| 19 | `cnd/.../1c8889ef-8920-4602-8a99-0b74da28ada8.webp` | 86×64.5 | 645.125×460.796875 |
| 24 | `cnd/.../b915dfc2-95a1-437f-b026-b7b9dc170c84.svg` | variável×56 | 53.7578125×53.7578125 |
| 25 | `cnd/.../6dc48285-0f58-4406-8064-0059ed94fc01.svg` | variável×56 | 53.7578125×53.7578125 |
| 26 | `cnd/.../02a83412-deca-40f0-b3fd-eed1d48c2213.svg` | variável×56 | 53.7578125×53.7578125 |
| 27 | `cnd/.../be1a44c9-a699-4a61-a8d1-5d1737e45962.webp` | variável×56 | 53.7578125×53.7578125 |
| 28 | `cnd/.../b915dfc2-95a1-437f-b026-b7b9dc170c84.svg` | variável×56 | 53.7578125×53.7578125 |
| 29 | `cnd/.../6dc48285-0f58-4406-8064-0059ed94fc01.svg` | variável×56 | 53.7578125×53.7578125 |
| 30 | `cnd/.../02a83412-deca-40f0-b3fd-eed1d48c2213.svg` | variável×56 | 53.7578125×53.7578125 |
| 31 | `cnd/.../be1a44c9-a699-4a61-a8d1-5d1737e45962.webp` | variável×56 | 53.7578125×53.7578125 |
| 32 | `cnd/.../838ae005-fc2e-43d6-a92b-3b43fa9c7398.webp` | 38×308 | 337.578125×430.078125 |
| 33 | `cnd/.../4b2d1f94-5d38-412b-b423-34f0018f9cbe.webp` | 38×260 | 337.578125×430.078125 |
| 34 | `lesse/.../_app/immutable/assets/shopifyexperts.B7Ugdseq.png` | 103×28 | 136.875×26.109375 |
| 36 | `lesse/.../_app/immutable/assets/logo-white.D2PbM6gr.svg` | 135×39 | 1382.40625×400.1640625 |

## Assets mantidos sem alteração (13)

| index | src | width | height | motivo |
|-------|-----|-------|--------|--------|
| 0 | `cnd/.../e113b372-aac0-4e83-8f28-de14751f6e96.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 1 | `cnd/.../041ae269-b7a7-40b0-bf96-363d0fe963d0.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 2 | `cnd/.../db339f03-79b7-4807-aa25-3a8e969eaa55.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 3 | `cnd/.../80c988d7-15e9-4dd0-8b32-d082b6073d4c.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 4 | `cnd/.../1e700789-d780-4007-9f4b-2256a9011bf8.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 5 | `cnd/.../8559622c-4408-4d25-b428-97b84234db83.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 6 | `cnd/.../ca2caace-1213-4e6b-bc78-e3f3727d2deb.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 7 | `cnd/.../d6db8f5b-c7d7-4a15-b448-451705aaa9a8.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 20 | `cnd/.../b915dfc2-95a1-437f-b026-b7b9dc170c84.svg` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 21 | `cnd/.../6dc48285-0f58-4406-8064-0059ed94fc01.svg` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 22 | `cnd/.../02a83412-deca-40f0-b3fd-eed1d48c2213.svg` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 23 | `cnd/.../be1a44c9-a699-4a61-a8d1-5d1737e45962.webp` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |
| 35 | `lesse/.../_app/immutable/assets/shopifyexperts.B7Ugdseq.png` | 0 | 0 | Valor da referência é 0×0 (lazy-load/offscreen); mantido. |

## Trechos editados no JSON original

- **Após `padrao_de_carregamento`** dentro de `media_inventario`: inserção do bloco `"media": [ ... ]` com 37 objetos (índices 0–36).
- Dentro de cada objeto em `media`, os campos `width` e `height` receberam os valores corretos de `Untitled-3.2_home.json`; `index`, `type`, `src` e `classes` foram copiados integralmente da referência.
