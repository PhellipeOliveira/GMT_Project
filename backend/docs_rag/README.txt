FONTE DO RAG — Base de Conhecimento (KB) do Agente GMT
=======================================================

Esta pasta (`backend/kb/`) é a FONTE do RAG do agente.

Tudo que for colocado aqui como arquivo Markdown (.md) será ingerido para o
Supabase (tabela public.kb_chunks) e usado pela tool `responder_duvida_rag`
para fundamentar as respostas às dúvidas dos visitantes (intent duvida_responder).

-------------------------------------------------------
COMO FUNCIONA
-------------------------------------------------------
- O ingest (app/rag/ingest.py) lê RECURSIVAMENTE todos os arquivos .md desta pasta.
- Apenas arquivos .md são indexados. (Este README.txt NÃO é ingerido de propósito.)
- Chunking padrão = "markdown": o conteúdo é dividido por cabeçalhos (#, ##, ###).
  => Estruture os documentos com títulos claros para melhor recuperação.
- O caminho do arquivo vira o `doc_path` (a "fonte" citada nas respostas).

-------------------------------------------------------
ORGANIZAÇÃO (subpastas por categoria)
-------------------------------------------------------
  kb/produto/        -> serviços, produtos, pacotes, entregáveis
  kb/institucional/  -> sobre a GMT, missão, diferenciais, cases
  kb/faq/            -> perguntas frequentes, políticas, prazos

As subpastas ajudam a segmentar o KB por `categoria` na hora do ingest,
permitindo filtrar a busca depois (produto / institucional / faq).

-------------------------------------------------------
COMO RODAR O INGEST (a partir de backend/)
-------------------------------------------------------
Pela pasta inteira (padrão, categoria = None):
    python -c "from app.rag.ingest import ingest_dir; print(ingest_dir('kb'))"

Por categoria (recomendado — indexa uma subpasta e marca a categoria):
    python -c "from app.rag.ingest import ingest_dir; print(ingest_dir('kb/produto', categoria='produto'))"
    python -c "from app.rag.ingest import ingest_dir; print(ingest_dir('kb/institucional', categoria='institucional'))"
    python -c "from app.rag.ingest import ingest_dir; print(ingest_dir('kb/faq', categoria='faq'))"

O upsert é idempotente por (doc_path, chunk_ix): rodar de novo atualiza os chunks
existentes em vez de duplicar.

Enquanto esta pasta estiver vazia, o KB fica vazio e o agente ESCALA as dúvidas
(comportamento seguro) em vez de inventar respostas.
