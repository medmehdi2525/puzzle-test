"use client";

import { Button } from "@/components/ui/button";
import { ToolbarGroup } from "./ToolbarGroup";

export function StencilGroup() {
  return (
    <ToolbarGroup title="Stencil Effects">
      <Button variant="outline" size="sm" disabled title="Phase 5">
        Stencil Selected
      </Button>
      <Button variant="outline" size="sm" disabled title="Phase 5">
        Stencil All
      </Button>
    </ToolbarGroup>
  );
}
