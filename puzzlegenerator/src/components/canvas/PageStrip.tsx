"use client";

import { useBookStore } from "@/store/bookStore";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableThumb({
  id,
  index,
  label,
  pageType,
  isActive,
  onSelect,
}: {
  id: string;
  index: number;
  label: string;
  pageType: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-1.5 rounded-md border px-2 py-2 text-left text-xs transition-all",
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-transparent bg-muted/50 hover:bg-muted"
      )}
    >
      <span className="cursor-grab opacity-60 touch-none" {...attributes} {...listeners}>
        <GripVertical className="h-3 w-3" />
      </span>
      <span className="font-mono text-[10px] opacity-70 w-4">{index + 1}</span>
      <span className="flex-1 truncate font-medium">{label}</span>
      {pageType === "solution" && (
        <span className="text-[9px] uppercase opacity-80">sol</span>
      )}
    </button>
  );
}

export function PageStrip() {
  const pages = useBookStore((s) => s.pages);
  const currentPageId = useBookStore((s) => s.currentPageId);
  const setCurrentPage = useBookStore((s) => s.setCurrentPage);
  const addPage = useBookStore((s) => s.addPage);
  const deletePage = useBookStore((s) => s.deletePage);
  const reorderPages = useBookStore((s) => s.reorderPages);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = pages.findIndex((p) => p.id === active.id);
    const newIndex = pages.findIndex((p) => p.id === over.id);
    if (oldIndex >= 0 && newIndex >= 0) reorderPages(oldIndex, newIndex);
  };

  const pageLabel = (index: number) => {
    const p = pages[index];
    if (!p) return "Page";
    if (p.pageType === "solution") return "Solution";
    if (p.pageType === "divider") return p.title ?? "Divider";
    if (p.pageType === "blank" && !p.puzzles.length) return "Blank";
    const type = p.puzzles[0]?.type;
    if (!type) return "Page";
    return type.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
  };

  return (
    <aside className="w-48 shrink-0 border-r bg-card flex flex-col" data-print-hide>
      <div className="p-2 border-b space-y-2">
        <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground px-1">
          <FileText className="h-3.5 w-3.5" />
          Pages ({pages.length})
        </div>
        <div className="flex gap-1">
          <Button variant="default" size="sm" className="flex-1 h-8 text-xs" onClick={() => addPage()}>
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={pages.length <= 1}
            onClick={() => currentPageId && deletePage(currentPageId)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={pages.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {pages.map((p, i) => (
              <SortableThumb
                key={p.id}
                id={p.id}
                index={i}
                label={pageLabel(i)}
                pageType={p.pageType}
                isActive={p.id === currentPageId}
                onSelect={() => setCurrentPage(p.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </aside>
  );
}
