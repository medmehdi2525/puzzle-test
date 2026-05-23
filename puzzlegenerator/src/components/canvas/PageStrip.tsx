"use client";

import { useBookStore } from "@/store/bookStore";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
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
  isActive,
  onSelect,
}: {
  id: string;
  index: number;
  label: string;
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
        "w-full flex items-center gap-1 rounded border px-2 py-2 text-left text-xs transition-colors",
        isActive
          ? "border-primary bg-primary/10"
          : "border-border hover:bg-accent"
      )}
    >
      <span
        className="cursor-grab text-muted-foreground touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-3 w-3" />
      </span>
      <span className="flex-1 truncate">
        {index + 1}. {label}
      </span>
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
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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
    if (p.pageType === "blank") return "Blank";
    const type = p.puzzles[0]?.type;
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Puzzle";
  };

  return (
    <aside className="w-44 shrink-0 border-r bg-card flex flex-col">
      <div className="p-2 border-b flex gap-1">
        <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => addPage()}>
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
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={pages.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {pages.map((p, i) => (
              <SortableThumb
                key={p.id}
                id={p.id}
                index={i}
                label={pageLabel(i)}
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
