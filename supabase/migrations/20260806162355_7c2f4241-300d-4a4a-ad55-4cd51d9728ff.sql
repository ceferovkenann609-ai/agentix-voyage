drop function if exists public.current_company_ids(uuid);

revoke all on function public.is_company_member(uuid, uuid) from public, anon;
revoke all on function public.has_company_role(uuid, uuid, public.app_role[]) from public, anon;
grant execute on function public.is_company_member(uuid, uuid) to authenticated, service_role;
grant execute on function public.has_company_role(uuid, uuid, public.app_role[]) to authenticated, service_role;