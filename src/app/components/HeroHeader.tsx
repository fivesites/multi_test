import React from "react";

interface HeroHeaderProps {
  /** Left column — rendered on bg-primary */
  primary: React.ReactNode;
  /** Absolute-bottom overlay inside the primary col (meta text, etc.) */
  primaryMeta?: React.ReactNode;
  /** Middle column */
  col2?: React.ReactNode;
  /** Right column — omit to let col2 span 2 columns */
  col3?: React.ReactNode;
  className?: string;
}

export default function HeroHeader({
  primary,
  primaryMeta,
  col2,
  col3,
  className,
}: HeroHeaderProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {/* ── Mobile ──────────────────────────────────────────────────── */}
      <div className="lg:hidden flex flex-col h-screen">
        <div className="bg-primary h-[40vh] flex items-center justify-center relative">
          {primary}
          {primaryMeta && (
            <div className="absolute bottom-0 left-0 right-0">{primaryMeta}</div>
          )}
        </div>
        {col2 && <div className="flex-1 overflow-hidden">{col2}</div>}
      </div>

      {/* ── Desktop ─────────────────────────────────────────────────── */}
      <div className={`hidden lg:grid h-screen ${col3 ? "grid-cols-3" : "grid-cols-[1fr_2fr]"}`}>
        {/* Col 1 — primary */}
        <div className="bg-primary flex items-center justify-center relative h-full">
          {primary}
          {primaryMeta && (
            <div className="absolute bottom-0 left-0 right-0">{primaryMeta}</div>
          )}
        </div>

        {/* Col 2 */}
        {col2 && (
          <div className="border-l border-border h-full">{col2}</div>
        )}

        {/* Col 3 */}
        {col3 && (
          <div className="border-l border-border h-full">{col3}</div>
        )}
      </div>
    </div>
  );
}
