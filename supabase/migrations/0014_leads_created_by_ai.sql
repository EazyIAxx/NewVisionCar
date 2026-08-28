-- Registra se o lead foi cadastrado pelo agente de IA no WhatsApp (M8) em vez
-- de um vendedor humano — puramente informativo, não muda RLS/visibilidade
-- (continua null/não atribuído até alguém "pegar", igual lead da vitrine).

alter table public.leads
  add column created_by_ai boolean not null default false;
