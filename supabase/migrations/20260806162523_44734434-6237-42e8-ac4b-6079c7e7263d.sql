create or replace function public.storage_company_id(_name text)
returns uuid language plpgsql immutable set search_path = public as $$
declare v uuid;
begin
  begin
    v := (split_part(_name, '/', 1))::uuid;
  exception when others then
    return null;
  end;
  return v;
end; $$;
revoke all on function public.storage_company_id(text) from public, anon;
grant execute on function public.storage_company_id(text) to authenticated, service_role;

create policy "Company members read company files" on storage.objects
  for select to authenticated
  using (
    bucket_id in ('company-logos','crm-attachments','company-documents')
    and public.is_company_member(auth.uid(), public.storage_company_id(name))
  );

create policy "Company members upload company files" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('company-logos','crm-attachments','company-documents')
    and public.is_company_member(auth.uid(), public.storage_company_id(name))
    and owner = auth.uid()
  );

create policy "Company members update company files" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('company-logos','crm-attachments','company-documents')
    and public.is_company_member(auth.uid(), public.storage_company_id(name))
  )
  with check (
    bucket_id in ('company-logos','crm-attachments','company-documents')
    and public.is_company_member(auth.uid(), public.storage_company_id(name))
  );

create policy "Uploader or admins delete company files" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('company-logos','crm-attachments','company-documents')
    and (
      owner = auth.uid()
      or public.has_company_role(auth.uid(), public.storage_company_id(name), array['owner','admin']::public.app_role[])
    )
  );