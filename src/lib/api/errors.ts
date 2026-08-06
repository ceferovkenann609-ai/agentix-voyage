/**
 * Centralised error normalisation for the whole data layer.
 * Raw Postgres/PostgREST messages never reach the UI; they are logged and
 * translated into safe, human messages (AZ primary, EN fallback).
 */

export type AppErrorKind =
  | "auth"
  | "permission"
  | "not_found"
  | "conflict"
  | "validation"
  | "network"
  | "unknown";

type SupabaseLikeError = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
  status?: number;
};

export class AppError extends Error {
  readonly kind: AppErrorKind;
  readonly code: string | undefined;
  readonly scope: string;
  readonly cause: unknown;

  constructor(opts: {
    kind: AppErrorKind;
    scope: string;
    message: string;
    code?: string | undefined;
    cause?: unknown;
  }) {
    super(opts.message);
    this.name = "AppError";
    this.kind = opts.kind;
    this.scope = opts.scope;
    this.code = opts.code;
    this.cause = opts.cause;
  }
}

const MESSAGES: Record<AppErrorKind, { az: string; en: string }> = {
  auth: {
    az: "Sessiyanız bitmişdir — yenidən daxil olun.",
    en: "Your session expired — please sign in again.",
  },
  permission: {
    az: "Bu əməliyyat üçün icazəniz yoxdur.",
    en: "You don't have permission for this action.",
  },
  not_found: { az: "Məlumat tapılmadı.", en: "The requested record was not found." },
  conflict: { az: "Bu qeyd artıq mövcuddur.", en: "This record already exists." },
  validation: { az: "Daxil edilən məlumat düzgün deyil.", en: "The submitted data is invalid." },
  network: {
    az: "Serverlə əlaqə qurulmadı — bir az sonra yenidən yoxlayın.",
    en: "Could not reach the server — please try again shortly.",
  },
  unknown: {
    az: "Gözlənilməz xəta baş verdi. Yenidən cəhd edin.",
    en: "Something went wrong. Please try again.",
  },
};

function classify(error: SupabaseLikeError): AppErrorKind {
  const code = error.code ?? "";
  const status = error.status ?? 0;
  if (code === "42501" || status === 403) return "permission";
  if (code === "PGRST301" || status === 401) return "auth";
  if (code === "PGRST116" || status === 404) return "not_found";
  if (code === "23505") return "conflict";
  if (code === "23502" || code === "23503" || code === "22P02" || code === "23514") return "validation";
  if (code === "" && /fetch|network|Failed to fetch/i.test(error.message ?? "")) return "network";
  return "unknown";
}

/** Normalises anything thrown by Supabase / fetch into an AppError and logs the raw detail. */
export function toAppError(error: unknown, scope: string): AppError {
  if (error instanceof AppError) return error;

  const raw = (error ?? {}) as SupabaseLikeError;
  const kind = classify(raw);
  const detail = [raw.message, raw.details, raw.hint].filter(Boolean).join(" — ");

  // Raw detail stays in the console/server logs only.
  console.error(`[agentix:${scope}]`, raw.code ? `[${raw.code}]` : "", detail || error);

  return new AppError({
    kind,
    scope,
    code: raw.code,
    cause: error,
    message: MESSAGES[kind].az,
  });
}

/** Safe, user-facing message for any thrown value. */
export function userMessage(error: unknown, locale: "az" | "en" = "az"): string {
  const appError = error instanceof AppError ? error : null;
  if (appError) return MESSAGES[appError.kind][locale];
  if (error instanceof Error && error.message && error.message.length < 160 && !/[{}]/.test(error.message)) {
    return error.message;
  }
  return MESSAGES.unknown[locale];
}

type SupabaseResult<T> = { data: T | null; error: unknown };

/** Unwraps a Supabase result, throwing a normalised AppError on failure. */
export function unwrap<T>(result: SupabaseResult<T>, scope: string): T {
  if (result.error) throw toAppError(result.error, scope);
  return result.data as T;
}

/** Unwraps a list result, always returning an array. */
export function unwrapList<T>(result: { data: T[] | null; error: unknown }, scope: string): T[] {
  if (result.error) throw toAppError(result.error, scope);
  return result.data ?? [];
}

/** Best-effort side effects (activity logs, notifications) must never break the main flow. */
export async function bestEffort<T>(scope: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    toAppError(error, `${scope}:best-effort`);
    return null;
  }
}

/** Unwraps a single-row result and fails loudly when the row is missing. */
export function unwrapRequired<T>(result: SupabaseResult<T>, scope: string): NonNullable<T> {
  const data = unwrap(result, scope);
  if (data === null || data === undefined) {
    throw new AppError({ kind: "not_found", scope, message: "Məlumat tapılmadı." });
  }
  return data as NonNullable<T>;
}
