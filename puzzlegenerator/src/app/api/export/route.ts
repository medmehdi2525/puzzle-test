import { NextResponse } from "next/server";

/** PDF export orchestration — Phase 6 */
export async function POST() {
  return NextResponse.json(
    {
      error: "PDF export not yet implemented",
      message: "Phase 6 will add @react-pdf/renderer vector export with bleed and crop marks.",
    },
    { status: 501 }
  );
}
