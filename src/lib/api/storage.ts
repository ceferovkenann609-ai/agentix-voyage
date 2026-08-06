import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { AppError, unwrap, unwrapList, unwrapRequired } from "./errors";

export type FileKind = Database["public"]["Enums"]["file_kind"];
export type FileRow = Database["public"]["Tables"]["file_objects"]["Row"];

/** Private buckets — access is granted through company-scoped storage policies. */
export const BUCKETS = {
  companyLogos: "company-logos",
  crmAttachments: "crm-attachments",
  documents: "company-documents",
  avatars: "avatars",
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

const MAX_BYTES: Record<FileKind, number> = {
  company_logo: 2 * 1024 * 1024,
  avatar: 2 * 1024 * 1024,
  image: 8 * 1024 * 1024,
  crm_attachment: 15 * 1024 * 1024,
  document: 25 * 1024 * 1024,
  ai_file: 25 * 1024 * 1024,
};

const ALLOWED_PREFIX: Partial<Record<FileKind, string[]>> = {
  company_logo: ["image/"],
  avatar: ["image/"],
  image: ["image/"],
};

function safeName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(-120);
}

export function validateFile(file: File, kind: FileKind): void {
  const limit = MAX_BYTES[kind];
  if (file.size > limit) {
    throw new AppError({
      kind: "validation",
      scope: "storage.validate",
      message: `Fayl çox böyükdür — maksimum ${Math.round(limit / (1024 * 1024))} MB.`,
    });
  }
  const prefixes = ALLOWED_PREFIX[kind];
  if (prefixes && !prefixes.some((p) => file.type.startsWith(p))) {
    throw new AppError({
      kind: "validation",
      scope: "storage.validate",
      message: "Bu fayl tipi dəstəklənmir.",
    });
  }
}

export type UploadInput = {
  file: File;
  bucket: BucketName;
  kind: FileKind;
  companyId: string;
  userId: string;
  entityType?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

export type UploadedFile = { record: FileRow; path: string };

/**
 * Uploads to a private bucket under `<companyId>/<kind>/<timestamp>-<name>`
 * (the storage policies key off the first path segment) and registers the file
 * in `file_objects` so every module can list attachments consistently.
 */
export async function uploadFile(input: UploadInput): Promise<UploadedFile> {
  validateFile(input.file, input.kind);

  const path = `${input.companyId}/${input.kind}/${Date.now()}-${safeName(input.file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from(input.bucket)
    .upload(path, input.file, { cacheControl: "3600", upsert: false, contentType: input.file.type });
  if (uploadError) unwrap({ data: null, error: uploadError }, "storage.upload");

  try {
    const record = unwrapRequired<FileRow>(
      await supabase
        .from("file_objects")
        .insert({
          company_id: input.companyId,
          user_id: input.userId,
          bucket: input.bucket,
          path,
          name: input.file.name,
          kind: input.kind,
          mime_type: input.file.type || null,
          size_bytes: input.file.size,
          entity_type: input.entityType ?? null,
          entity_id: input.entityId ?? null,
          metadata: (input.metadata ?? {}) as never,
        })
        .select("*")
        .single(),
      "storage.register",
    );
    return { record, path };
  } catch (error) {
    // Keep storage and the registry consistent.
    await supabase.storage.from(input.bucket).remove([path]);
    throw error;
  }
}

/** Signed URL for a private object. */
export async function getSignedUrl(
  bucket: BucketName,
  path: string,
  expiresInSeconds = 3600,
): Promise<string | null> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error) {
    unwrap({ data: null, error }, "storage.signedUrl");
    return null;
  }
  return data?.signedUrl ?? null;
}

export async function listFiles(opts: {
  companyId: string;
  kind?: FileKind;
  entityType?: string;
  entityId?: string;
}): Promise<FileRow[]> {
  let query = supabase
    .from("file_objects")
    .select("*")
    .eq("company_id", opts.companyId)
    .order("created_at", { ascending: false });
  if (opts.kind) query = query.eq("kind", opts.kind);
  if (opts.entityType) query = query.eq("entity_type", opts.entityType);
  if (opts.entityId) query = query.eq("entity_id", opts.entityId);
  return unwrapList(await query, "storage.listFiles");
}

export async function removeFile(record: Pick<FileRow, "id" | "bucket" | "path">): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(record.bucket)
    .remove([record.path]);
  if (storageError) unwrap({ data: null, error: storageError }, "storage.removeObject");
  const { error } = await supabase.from("file_objects").delete().eq("id", record.id);
  if (error) unwrap({ data: null, error }, "storage.removeRecord");
}
