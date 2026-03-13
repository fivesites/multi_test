import { Badge } from "@/components/ui/badge";

const CATEGORY_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Video",
  production: "Production",
  "art-direction": "Art Direction",
  concept: "Concept",
};

export default function WorkDetailHeader({
  title,
  client,
  year,
  categories,
}: {
  title: string;
  client?: string;
  year?: number;
  categories?: string[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 border-b border-foreground/10">
      {/* Col 1: title */}
      <div className="flex items-end p-6 border-b lg:border-b-0 lg:border-r border-foreground/10 lg:col-span-2">
        <h1 className="font-tiny5 text-4xl lg:text-6xl leading-none">
          {title}
        </h1>
      </div>

      {/* Col 2: categories + client + year */}
      <div className="flex flex-col justify-end gap-3 p-6">
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="uppercase tracking-wider text-xs font-mono"
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {client && (
            <span className="font-rounded text-sm text-foreground/60">
              {client}
            </span>
          )}
          {year && (
            <span className="font-rounded text-sm text-foreground/40">
              {year}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
