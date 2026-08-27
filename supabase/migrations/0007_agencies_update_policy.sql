-- `agencies` só tinha policy de SELECT — sem uma de UPDATE, salvar os dados
-- fiscais (M10) silenciosamente não afetaria nenhuma linha (RLS filtra tudo
-- por padrão quando não há policy permissiva pra aquele comando).

create policy agencies_update_gestor on public.agencies
  for update
  using (id = public.get_my_agency_id() and public.is_gestor());
