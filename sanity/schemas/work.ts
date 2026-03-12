import { defineField, defineType } from "sanity";

const CATEGORIES = [
  { title: "Photo", value: "photo" },
  { title: "Video", value: "video" },
  { title: "Production", value: "production" },
  { title: "Art Direction", value: "art-direction" },
  { title: "Concept", value: "concept" },
  { title: "Sound Design", value: "sound-design" },
  { title: "Vax", value: "vax" },
  { title: "DOP", value: "dop" },
  { title: "Post-processing", value: "post-processing" },
];

export const work = defineType({
  name: "work",
  title: "Work",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: CATEGORIES,
      },
    }),
    defineField({
      name: "backgroundColor",
      title: "Background color",
      type: "color",
      description: "Used on the project page and cards",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text",
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
        },
        {
          type: "object",
          name: "videoUpload",
          title: "Video (upload)",
          fields: [
            defineField({
              name: "file",
              title: "Video file",
              type: "file",
              options: { accept: "video/*" },
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
          preview: {
            select: { caption: "caption" },
            prepare({ caption }: { caption?: string }) {
              return { title: caption ?? "Video upload" };
            },
          },
        },
        {
          type: "object",
          name: "videoUrl",
          title: "Video (URL / embed)",
          fields: [
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              description: "YouTube, Vimeo, or direct video link",
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
          preview: {
            select: { url: "url", caption: "caption" },
            prepare({ url, caption }: { url?: string; caption?: string }) {
              return { title: caption ?? url ?? "Video URL" };
            },
          },
        },
      ],
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Year, newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      year: "year",
      media: "coverImage",
    },
    prepare({ title, client, year, media }) {
      return {
        title,
        subtitle: [client, year].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
