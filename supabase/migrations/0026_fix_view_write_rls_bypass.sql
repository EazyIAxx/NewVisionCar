-- Auditoria de segurança pós-deploy: vehicles_view e sales_view são views
-- SEM security_invoker (rodam como dono, postgres) — decisão deliberada das
-- migrations 0018/0019 pra permitir que a view mascare cost_price mesmo com
-- a coluna revogada na tabela base. Efeito colateral não percebido até agora:
-- Postgres concede INSERT/UPDATE/DELETE por padrão a anon/authenticated em
-- toda view nova, e vehicles_view (view simples, sem JOIN) é automaticamente
-- "updatable" pelo Postgres. Como o dono (postgres) tem BYPASSRLS, um INSERT
-- via `vehicles_view` reescrito pelo Postgres ignora a RLS de `vehicles`
-- inteiramente — confirmado empiricamente: um usuário autenticado de uma
-- agência conseguiu inserir um veículo com agency_id de OUTRA agência
-- chamando `supabase.from("vehicles_view").insert(...)` direto, sem passar
-- pela Server Action. UPDATE cross-tenant já era bloqueado (a view não
-- enxerga a linha da outra agência pra localizar o que atualizar), mas
-- INSERT não passa pelo WHERE da view (não há WITH CHECK OPTION) — só a
-- RLS da tabela base pegaria isso, e ela é ignorada pelo dono bypassRLS.
--
-- Nenhum código do app escreve nessas views (toda escrita real é direto em
-- vehicles/sales, via Server Action, com RLS aplicada normalmente) — só
-- SELECT é necessário. Revogar todo privilégio de escrita fecha o buraco
-- sem precisar mexer em security_invoker (que quebraria a máscara de
-- cost_price pro vendedor, problema já resolvido nas migrations anteriores).

revoke insert, update, delete, truncate, references, trigger
  on public.vehicles_view
  from anon, authenticated;

revoke insert, update, delete, truncate, references, trigger
  on public.sales_view
  from anon, authenticated;
