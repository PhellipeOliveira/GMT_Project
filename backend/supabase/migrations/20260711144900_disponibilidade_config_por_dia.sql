-- Migração: disponibilidade_config por dia (modelo por janelas)
-- Esta migração substitui o modelo singleton anterior por um modelo com 1 linha por dia/janela.
-- Dias bloqueados devem ser representados por ausência de linha (ou ativo=false), nunca por hardcode no código.

DROP TABLE IF EXISTS public.disponibilidade_config CASCADE;

CREATE TABLE IF NOT EXISTS public.disponibilidade_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana smallint NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_inicio time NOT NULL,
  hora_fim time NOT NULL,
  duracao_slot_min smallint NOT NULL DEFAULT 30,
  fuso_horario text NOT NULL DEFAULT 'Europe/Lisbon',
  ativo boolean NOT NULL DEFAULT true,
  UNIQUE (dia_semana, hora_inicio)
);

ALTER TABLE public.disponibilidade_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY disponibilidade_deny_api
ON public.disponibilidade_config
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false);

INSERT INTO public.disponibilidade_config
  (dia_semana, hora_inicio, hora_fim, duracao_slot_min, fuso_horario, ativo)
VALUES
  (0, '13:00', '19:00', 30, 'Europe/Lisbon', true),
  (1, '13:00', '19:00', 30, 'Europe/Lisbon', true),
  (2, '13:00', '19:00', 30, 'Europe/Lisbon', true),
  (3, '13:00', '19:00', 30, 'Europe/Lisbon', true),
  (4, '13:00', '19:00', 30, 'Europe/Lisbon', true);
