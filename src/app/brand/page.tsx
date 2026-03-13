export default function BrandPage() {
  const colors = [
    { name: "background", var: "--background", label: "Background" },
    { name: "foreground", var: "--foreground", label: "Foreground" },
    { name: "secondary", var: "--secondary", label: "Secondary" },
    { name: "secondary-foreground", var: "--secondary-foreground", label: "Secondary Foreground" },
    { name: "accent", var: "--accent", label: "Accent" },
    { name: "accent-foreground", var: "--accent-foreground", label: "Accent Foreground" },
    { name: "muted", var: "--muted", label: "Muted" },
    { name: "muted-foreground", var: "--muted-foreground", label: "Muted Foreground" },
    { name: "primary", var: "--primary", label: "Primary" },
    { name: "primary-foreground", var: "--primary-foreground", label: "Primary Foreground" },
    { name: "border", var: "--border", label: "Border" },
    { name: "destructive", var: "--destructive", label: "Destructive" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-16 max-w-5xl mx-auto">
      <h1 className="font-absolution1 text-6xl lg:text-9xl mb-2 leading-none">Brand</h1>
      <p className="font-mono text-muted-foreground mb-16">Multi2 visual identity reference</p>

      {/* Typography scale */}
      <section className="mb-20">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
          Typography Scale
        </h2>

        <div className="space-y-10">
          {/* .type-h1 */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              .type-h1 — KarlST Ultra (font-rounded) · 5xl / 8xl
            </span>
            <span className="type-h1">Heading One</span>
          </div>

          {/* .type-h2 */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              .type-h2 — Tiny5 (font-tiny5) · 3xl / 5xl
            </span>
            <span className="type-h2">Heading Two</span>
          </div>

          {/* .type-h3 */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              .type-h3 — Monument Grotesk Mono (font-mono) · xl
            </span>
            <span className="type-h3">Heading Three</span>
          </div>

          {/* .type-p */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              .type-p — Meta Old French (font-serif) · base
            </span>
            <p className="type-p max-w-xl">
              Meta Old French is the primary body typeface. Used for running text, descriptions, and editorial copy across the site.
            </p>
          </div>
        </div>
      </section>

      {/* All available typefaces */}
      <section className="mb-20">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
          All Typefaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Absolution Contextual — font-absolution1</span>
            <span className="font-absolution1 text-4xl">Multi2</span>
          </div>
          <div className="flex flex-col gap-8 md:col-span-2">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">KarlST — font-rounded</span>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                ["Regular", "font-normal"],
                ["Medium", "font-medium"],
                ["Bold", "font-bold"],
                ["Black", "font-[800]"],
                ["Ultra Black", "font-black"],
              ].map(([label, cls]) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="font-mono text-xs text-muted-foreground">{label}</span>
                  <span className={`font-rounded text-3xl ${cls}`}>Aa</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Meta Old French — font-serif</span>
            <span className="font-serif text-4xl">Multi2</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Monument Grotesk — font-sans</span>
            <span className="font-sans text-4xl">Multi2</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Monument Grotesk Mono — font-mono</span>
            <span className="font-mono text-4xl">Multi2</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Tiny5 — font-tiny5</span>
            <span className="font-[family-name:var(--font-tiny5)] text-4xl">Multi2</span>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="mb-20">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
          Colors
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="flex flex-col gap-2">
              <div
                className="w-full aspect-square rounded-md border border-border"
                style={{ backgroundColor: `var(${color.var})` }}
              />
              <div>
                <p className="font-mono text-xs font-medium">{color.label}</p>
                <p className="font-mono text-xs text-muted-foreground">{color.var}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Utility class reference */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
          Utility Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-sm">
          {[
            [".type-h1", "font-rounded · text-5xl / text-8xl · leading-none tracking-tight"],
            [".type-h2", "font-tiny5 · text-3xl / text-5xl · leading-tight"],
            [".type-h3", "font-mono · text-xl · leading-snug"],
            [".type-p",  "font-serif · text-base · leading-loose"],
          ].map(([cls, desc]) => (
            <div key={cls} className="flex gap-4 py-2 border-b border-border">
              <span className="text-foreground w-24 shrink-0">{cls}</span>
              <span className="text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
