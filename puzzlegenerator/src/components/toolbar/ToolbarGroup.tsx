import { Separator } from "@/components/ui/separator";

interface ToolbarGroupProps {
  title: string;
  children: React.ReactNode;
}

export function ToolbarGroup({ title, children }: ToolbarGroupProps) {
  return (
    <div className="flex flex-col gap-1 px-2 py-1 min-w-0">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
        {title}
      </span>
      <div className="flex flex-wrap items-center gap-1">{children}</div>
    </div>
  );
}

export function ToolbarSeparator() {
  return <Separator orientation="vertical" className="h-12 mx-1" />;
}
