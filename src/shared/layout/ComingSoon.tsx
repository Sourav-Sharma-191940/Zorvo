import { Sparkles } from "lucide-react";
import { IconTile } from "@/shared/ui/primitives";

export function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <IconTile size="lg" className="mb-4.5 size-15 rounded-xl">
        <Sparkles size="1.625rem" />
      </IconTile>
      <h1 className="text-4xl tracking-tight">{title}</h1>
      <p className="mt-2 max-w-90 text-base leading-5 text-muted-foreground">
        {description ?? "This section is coming soon. We're building it next."}
      </p>
    </div>
  );
}
