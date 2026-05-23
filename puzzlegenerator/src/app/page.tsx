"use client";

import { AppToolbar } from "@/components/toolbar/AppToolbar";
import { PageStrip } from "@/components/canvas/PageStrip";
import { PageCanvas } from "@/components/canvas/PageCanvas";
import { DialogHost } from "@/components/DialogHost";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      <AppToolbar />
      <div className="flex flex-1 min-h-0">
        <PageStrip />
        <main className="flex flex-1 flex-col min-w-0">
          <PageCanvas />
        </main>
      </div>
      <DialogHost />
    </div>
  );
}
