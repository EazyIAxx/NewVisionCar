-- Antes do onboarding, agency_id é NULL tanto na linha do usuário quanto no
-- retorno de get_my_agency_id() — e `null = null` não é true em SQL, então a
-- policy original escondia o próprio profile esquelético do usuário logado.
-- Garante que o usuário sempre pode ler a própria linha, mesmo sem agência.

drop policy profiles_select_same_agency on public.profiles;

create policy profiles_select_same_agency_or_self on public.profiles
  for select
  using (agency_id = public.get_my_agency_id() or id = auth.uid());
