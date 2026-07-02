-- Agente GMT — Google Calendar (push one-way)
-- Adiciona o vínculo com o evento espelhado no Google Calendar.
-- A tabela `public.reunioes` continua sendo a fonte de verdade; o Google é visualização.

alter table public.reunioes add column if not exists gcal_event_id text;

comment on column public.reunioes.gcal_event_id is 'ID do evento espelhado no Google Calendar (push one-way). NULL se não sincronizado.';
