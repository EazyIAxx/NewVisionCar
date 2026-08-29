-- CRÍTICO: `profiles_update_self` e `profiles_update_by_gestor` não tinham
-- WITH CHECK — a policy de UPDATE do Postgres, quando WITH CHECK é omitido,
-- reusa a expressão do USING como check, que só restringe QUAL linha pode
-- ser tocada (`id = auth.uid()`), nunca QUAIS COLUNAS podem mudar. Isso
-- permitia qualquer usuário autenticado, via chamada direta à REST API
-- (`PATCH /profiles?id=eq.<próprio id>`), setar `role` pra 'gestor' e
-- `agency_id` pra QUALQUER outra agência — escalação de privilégio completa
-- e bypass total do isolamento multi-tenant. Confirmado com teste real.
--
-- Nenhum código da aplicação usa `.from("profiles").update(...)` — toda
-- mutação de profile passa por RPC SECURITY DEFINER (create_agency_and_set_gestor,
-- join_agency_with_invite) ou pelo trigger de signup (handle_new_user), que
-- bypassam RLS e já validam a lógica de negócio internamente. Remover essas
-- duas policies não quebra nada existente — só fecha a brecha.

drop policy if exists profiles_update_self on public.profiles;
drop policy if exists profiles_update_by_gestor on public.profiles;
