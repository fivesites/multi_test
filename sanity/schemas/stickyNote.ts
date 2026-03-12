import { defineField, defineType } from "sanity";

export const stickyNote = defineType({
  name: "stickyNote",
  title: "Sticky Notes",
  type: "document",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      description: "Short text shown on the sticky note",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Lower number = appears first",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { text: "text", order: "order" },
    prepare({ text, order }) {
      return {
        title: text,
        subtitle: order != null ? `#${order}` : undefined,
      };
    },
  },
});
