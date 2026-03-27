import { defineField, defineType } from "sanity";

export const copy = defineType({
  name: "copy",
  title: "Copy",
  type: "document",
  fields: [
    defineField({
      name: "key",
      title: "Key",
      type: "slug",
      description: "Unique identifier used in code (e.g. hero-headline, about-intro)",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Internal label for this copy block",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "plainText",
      title: "Plain text (alternative)",
      type: "text",
      rows: 3,
      description: "Use for short strings like headlines or CTAs",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "title", key: "key.current" },
    prepare({ title, key }) {
      return { title: title ?? key, subtitle: key };
    },
  },
});
