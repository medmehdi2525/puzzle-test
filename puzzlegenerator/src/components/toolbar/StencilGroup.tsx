"use client";

import { Button } from "@/components/ui/button";
import { ToolbarGroup } from "./ToolbarGroup";
import { useBookStore } from "@/store/bookStore";
import { applyStencilToImageData } from "@/lib/stencil";

export function StencilGroup() {
  const page = useBookStore((s) => s.getCurrentPage());
  const updatePage = useBookStore((s) => s.updatePage);

  const applyStencil = async (all: boolean) => {
    if (!page) return;
    const targets = all
      ? page.elements.filter((e) => e.kind === "image" && e.imageSrc)
      : page.elements.filter((e) => e.kind === "image" && e.imageSrc).slice(0, 1);

    for (const el of targets) {
      if (!el.imageSrc) continue;
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = rej;
          img.src = el.imageSrc!;
        });
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        const id = ctx.getImageData(0, 0, canvas.width, canvas.height);
        await applyStencilToImageData(id);
        ctx.putImageData(id, 0, 0);
        const url = canvas.toDataURL("image/png");
        updatePage(page.id, (p) => ({
          ...p,
          elements: p.elements.map((e) =>
            e.id === el.id ? { ...e, imageSrc: url } : e
          ),
        }));
      } catch {
        alert("Could not process image.");
      }
    }
  };

  return (
    <ToolbarGroup title="Stencil">
      <Button variant="outline" size="sm" onClick={() => applyStencil(false)}>
        Selected
      </Button>
      <Button variant="outline" size="sm" onClick={() => applyStencil(true)}>
        All on page
      </Button>
    </ToolbarGroup>
  );
}
