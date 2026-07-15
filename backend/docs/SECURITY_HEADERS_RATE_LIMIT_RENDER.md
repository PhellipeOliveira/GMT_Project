# Etapa 4 — Headers e Rate Limit (Render)

Guia rápido para validar hardening passivo e limites de abuso no ambiente de produção.

## 1) Variáveis recomendadas no Render (backend)

Definir no serviço FastAPI:

- `APP_ENV=production`
- `CORS_ORIGINS=https://gmt.marketing,https://www.gmt.marketing` (ajuste seus domínios reais)
- `TRUST_PROXY_HEADERS=true`
- `SECURITY_HEADERS_ENABLED=true`
- `SECURITY_ENABLE_HSTS=true`
- `SECURITY_HSTS_MAX_AGE=31536000`
- `RATE_LIMIT_ENABLED=true`
- `RATE_LIMIT_CHAT_PER_MIN=30`
- `RATE_LIMIT_STREAM_PER_MIN=12`
- `RATE_LIMIT_MEETING_ACTION_PER_10MIN=10`
- `RATE_LIMIT_WINDOW_SEC=60`
- `STREAM_ENDPOINT_ENABLED=false` (recomendado manter desativado em produção)

> Se você subir múltiplas instâncias/workers, migre o limiter para Redis compartilhado.

## 2) Validação de headers no backend

Com API pública em produção:

```bash
curl -I https://SUA_API/health
```

Esperar:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy: same-origin`
- `X-Permitted-Cross-Domain-Policies: none`
- `Strict-Transport-Security` (quando HTTPS)

## 3) Validação de rate limit

Teste rápido (chat):

```bash
for i in $(seq 1 40); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST https://SUA_API/chat \
    -H "content-type: application/json" \
    -d '{"session_id":"web:test","input":"teste"}'
done
```

Esperado:

- primeiras requests: `200`
- após limite: `429`
- resposta `429` com header `Retry-After`

Teste link de cancelamento (sem token válido):

```bash
for i in $(seq 1 15); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    "https://SUA_API/meeting-actions/cancel?token=invalido"
done
```

Esperado: após limite, `429`.

## 4) Validação de headers no Next.js

```bash
curl -I https://SEU_SITE/
```

Esperar:

- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security` (produção)

## 5) Notas operacionais

- O backend já falha startup se `CORS_ORIGINS` estiver vazio ou com `*` em produção.
- `TRUST_PROXY_HEADERS=true` deve ficar ativo no Render para IP real de cliente.
- Se ativar Cloudflare, mantenha cadeia de proxy consistente para `X-Forwarded-For`.
