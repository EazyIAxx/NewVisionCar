-- Dois planos, diferenciados pelo agente de IA no WhatsApp (M8 — ainda sem
-- backend real; essa coluna só registra qual plano a revenda pagou, o
-- travamento de fato da feature de IA fica pro M8). Não precisa repetir o
-- revoke/grant de coluna da 0023 — uma coluna nova não herda nenhum grant
-- explícito automaticamente, então já nasce protegida (só service_role
-- escreve, igual as outras colunas de billing).

alter table public.agencies
  add column plan_tier text check (plan_tier in ('basico', 'com_ia'));
