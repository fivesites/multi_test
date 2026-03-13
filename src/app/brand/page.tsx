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
      <p className="font-sans text-muted-foreground mb-16">Multi2 visual identity reference</p>

      {/* Typography */}
      <section className="mb-20">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
          Typography
        </h2>

        <div className="space-y-10">
          {/* H1 */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">H1 — Absolution Contextual · 5xl / 8xl</span>
            <span className="font-absolution1 text-5xl lg:text-8xl leading-none">Heading One</span>
          </div>

          {/* H2 */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">H2 — Absolution Contextual · 3xl / 5xl</span>
            <span className="font-absolution1 text-3xl lg:text-5xl leading-tight">Heading Two</span>
          </div>

          {/* H3 */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">H3 — Monument Grotesk Mono · xl</span>
            <span className="font-mono text-xl leading-snug">Heading Three</span>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Body — Monument Grotesk · base</span>
            <p className="font-sans text-base leading-relaxed max-w-xl">
              Monument Grotesk is the primary body typeface. Used for all running text, descriptions, captions, and interface copy across the site.
            </p>
          </div>

          {/* Mono */}
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Mono — Monument Grotesk Mono · sm</span>
            <p className="font-mono text-sm leading-relaxed text-muted-foreground max-w-xl">
              Used for metadata, credits, labels, badges, and all tabular or technical content.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Fonts */}
      <section className="mb-20">
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
          Additional Typefaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">FT88</span>
            <span className="font-[family-name:var(--font-ft88)] text-4xl">Multi2</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Meta Old French</span>
            <span className="font-serif text-4xl">Multi2</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">GT America</span>
            <span className="font-[family-name:var(--font-gt-america)] text-4xl">Multi2</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Tiny5</span>
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

      {/* Type classes reference */}
      <section>
        <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8 border-b border-border pb-2">
          Utility Classes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-sm">
          {[
            [".type-h1", "font-absolution1, text-5xl / text-8xl, leading-none"],
            [".type-h2", "font-absolution1, text-3xl / text-5xl, leading-tight"],
            [".type-h3", "font-mono, text-xl, leading-snug"],
            [".type-p", "font-sans, text-base, leading-relaxed"],
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
