-- A 0020 revogou de `anon` especificamente, mas toda função ganha EXECUTE
-- pra PUBLIC por padrão na criação (visível no proacl como `=X`) — um
-- revoke por role não sobrepõe o grant de PUBLIC, exatamente como o
-- problema de grant em nível de tabela na 0019. `authenticated` e
-- `service_role` têm entradas próprias no ACL (não dependem de PUBLIC), não
-- são afetados por revogar de PUBLIC.

revoke execute on function public.compute_vehicle_cost(uuid) from public;
