/**
 * Browser-side file download helpers. Everything exported here works on data
 * that is already loaded from Supabase — no synthetic rows are generated.
 */

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function downloadCsv(filename: string, headers: string[], rows: unknown[][]) {
  const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
  // BOM keeps Azerbaijani characters readable in Excel.
  triggerDownload(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }), filename);
}

export function downloadText(filename: string, text: string) {
  triggerDownload(new Blob([text], { type: "text/plain;charset=utf-8" }), filename);
}

export function timestampSlug(date = new Date()): string {
  return date.toISOString().slice(0, 19).replace(/[:T]/g, "-");
}
