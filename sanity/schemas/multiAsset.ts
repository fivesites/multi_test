import { defineField, defineType } from "sanity";

export const multiAsset = defineType({
  name: "multiAsset",
  title: "Multi Asset",
  type: "document",
  fields: [
    defineField({ name: "label",          title: "Label",              type: "string"  }),
    defineField({ name: "role",           title: "Role",               type: "string"  }),
    defineField({ name: "type",           title: "Type",               type: "string"  }), // "m" | "2" | "checkerboard"
    defineField({ name: "order",          title: "Order",              type: "number"  }),
    // glyph
    defineField({ name: "cells",          title: "Cells (JSON)",       type: "text"    }),
    defineField({ name: "glyphStyle",     title: "Glyph Style",        type: "string"  }),
    defineField({ name: "noGap",          title: "No Gap",             type: "boolean" }),
    defineField({ name: "cols",           title: "Cols",               type: "number"  }),
    defineField({ name: "rows",           title: "Rows",               type: "number"  }),
    defineField({ name: "uploadedAsset",  title: "Uploaded Asset URL", type: "text"    }),
    // checkerboard
    defineField({ name: "colorA",         title: "Color A",            type: "string"  }),
    defineField({ name: "colorB",         title: "Color B",            type: "string"  }),
    defineField({ name: "checkerMode",    title: "Checker Mode",       type: "string"  }),
    defineField({ name: "checkerCellPx",    title: "Checker Cell (px)",    type: "number"  }),
    defineField({ name: "checkerStripCount", title: "Checker Strip Count", type: "number"  }),
  ],
});
