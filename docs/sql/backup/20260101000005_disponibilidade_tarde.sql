-- ────────────────────────────────────────────────────────────────────
-- Reconfigura a agenda GMT para o período da TARDE.
-- Regra de negócio: reuniões apenas 13h–19h (Europe/Lisbon), slots de 30 min,
-- de segunda a sexta. Substitui o seed anterior (10h–17h, 60 min).
-- Idempotente: pode ser reaplicada com segurança.
-- ────────────────────────────────────────────────────────────────────

-- Desativa quaisquer janelas que não sejam a nova janela da tarde (13h–19h).
update public.disponibilidade_config
set ativo = false
where not (hora_inicio = '13:00' and hora_fim = '19:00');

-- Insere/atualiza as janelas da tarde (30 min) para dias úteis (0=seg .. 4=sex).
insert into public.disponibilidade_config (dia_semana, hora_inicio, hora_fim, duracao_slot_min, fuso_horario, ativo)
values
  (0, '13:00', '19:00', 30, 'Europe/Lisbon', true),  -- segunda
  (1, '13:00', '19:00', 30, 'Europe/Lisbon', true),  -- terça
  (2, '13:00', '19:00', 30, 'Europe/Lisbon', true),  -- quarta
  (3, '13:00', '19:00', 30, 'Europe/Lisbon', true),  -- quinta
  (4, '13:00', '19:00', 30, 'Europe/Lisbon', true)   -- sexta
on conflict (dia_semana, hora_inicio, hora_fim) do update
  set duracao_slot_min = excluded.duracao_slot_min,
      fuso_horario = excluded.fuso_horario,
      ativo = true;
