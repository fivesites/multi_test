import { defineField, defineType } from "sanity";

export const twoDesign = defineType({
  name: "twoDesign",
  title: "Two Design",
  type: "document",
  fields: [
    defineField({ name: "label",  title: "Label",          type: "string" }),
    defineField({ name: "cells",  title: "Cells (JSON)",   type: "text"   }), // boolean[][] serialized
    defineField({ name: "style",  title: "Style",          type: "string" }),
    defineField({ name: "noGap",  title: "No Gap",         type: "boolean" }),
    defineField({ name: "cols",   title: "Cols",           type: "number" }),
    defineField({ name: "rows",   title: "Rows",           type: "number" }),
    defineField({ name: "asset",  title: "Asset (data URL)", type: "text" }),
    defineField({ name: "order",  title: "Order",          type: "number" }),
  ],
});
