"use client";

import { useState } from "react";
import { useSavedAssets } from "@/app/hooks/useSavedAssets";
import { renderGlyphShapes, glyphDims } from "@/app/lib/multiUtils";
import { Button } from "@/components/ui/button";
import type { SavedAsset } from "@/app/lib/multiUtils";

const ROLES = [
  { value: "",                label: "— no role —"      },
  { value: "squared2",        label: "squared²"         },
  { value: "LOGO_square",     label: "Logo (square)"    },
  { value: "LOGO_horizontal", label: "Logo (horizontal)"},
  { value: "Landing_About",   label: "Landing: About"   },
];

function AssetCard({
  asset,
  isSelected,
  onSelect,
  onRename,
  onSetRole,
  onRemove,
}: {
  asset: SavedAsset;
  isSelected?: boolean;
  onSelect?: () => void;
  onRename: (label: string) => void;
  onSetRole: (role: string) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(asset.label);

  const commitRename = () => {
    setEditing(false);
    if (draft !== asset.label) onRename(draft);
  };

  const SIZE = 80;
  const sc = SIZE / Math.max(asset.cols ?? 1, asset.rows ?? 1);
  const { w: gW, h: gH } = glyphDims(asset.cols ?? 1, asset.rows ?? 1, asset.glyphStyle, sc);
  const dx = (SIZE - gW) / 2;
  const dy = (SIZE - gH) / 2;

  return (
    <div className={`bg-background border border-border flex flex-col ${isSelected ? "ring-2 ring-foreground" : ""}`}>
      {/* Thumbnail */}
      <button
        onClick={onSelect}
        className="flex items-center justify-center hover:bg-muted transition-colors"
        style={{ height: 120 }}
        title="Select asset"
      >
        {asset.uploadedAsset ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset.uploadedAsset} alt="" className="max-h-[100px] max-w-[100px] object-contain" />
        ) : (
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="text-foreground">
            <g transform={`translate(${dx},${dy})`}>
              {renderGlyphShapes(asset, sc)}
            </g>
          </svg>
        )}
      </button>

      <div className="flex flex-col gap-1.5 p-2 border-t border-border">
        {/* Label */}
        {editing ? (
          <input
            autoFocus
            className="font-mono text-xs w-full border border-border px-1 py-0.5 bg-background"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") { setDraft(asset.label); setEditing(false); }
            }}
          />
        ) : (
          <button
            className="font-mono text-[10px] text-left truncate hover:text-foreground text-muted-foreground"
            onClick={() => { setDraft(asset.label); setEditing(true); }}
            title="Click to rename"
          >
            {asset.label || "unnamed"}
          </button>
        )}

        {/* Role */}
        <select
          value={asset.role ?? ""}
          onChange={(e) => onSetRole(e.target.value)}
          className="font-rounded text-[10px] uppercase tracking-wider border border-border bg-background px-1 py-0.5 w-full"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {/* Delete */}
        <Button
          variant="destructive"
          size="sm"
          className="h-6 text-[10px] w-full"
          onClick={onRemove}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default function AssetLibrary({
  selectedId,
  onSelect,
}: {
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const { saved, rename, setRole, remove } = useSavedAssets();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center px-4 border-b border-border shrink-0" style={{ height: 40 }}>
        <span className="font-rounded text-xs uppercase tracking-widest text-muted-foreground">
          Asset Library — {saved.length} assets
        </span>
      </div>

      {saved.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-rounded text-xs text-muted-foreground">No assets saved yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-px bg-border p-px">
          {saved.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              isSelected={selectedId === asset.id}
              onSelect={onSelect ? () => onSelect(asset.id) : undefined}
              onRename={(label) => rename(asset.id, label)}
              onSetRole={(role) => setRole(asset.id, role)}
              onRemove={() => remove(asset.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
