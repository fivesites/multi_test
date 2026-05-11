import { defineField, defineType } from "sanity";

export const showreel = defineType({
  name: "showreel",
  title: "Showreel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Showreel",
    }),
    defineField({
      name: "videoMobile",
      title: "Video — Mobile",
      type: "file",
      options: { accept: "video/*" },
      description: "Shown on screens smaller than lg (portrait / phone)",
    }),
    defineField({
      name: "videoDesktop",
      title: "Video — Desktop",
      type: "file",
      options: { accept: "video/*" },
      description: "Shown on lg screens and above",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }: { title?: string }) {
      return { title: title ?? "Showreel" };
    },
  },
});
