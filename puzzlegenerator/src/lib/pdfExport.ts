/** PDF export orchestrator — Phase 6 */
export async function exportBookToPdf(): Promise<Blob> {
  const res = await fetch("/api/export", { method: "POST" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? "PDF export failed");
  }
  return res.blob();
}
