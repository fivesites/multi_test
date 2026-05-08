import { groq } from "next-sanity";

// All work entries, ordered manually then by year
export const allWorkQuery = groq`
  *[_type == "work"] | order(year desc) {
    _id,
    title,
    slug,
    client,
    year,
    categories,
    description,
    featured,
    coverImage { asset->, hotspot, crop }
  }
`;

// Single work entry by slug
export const workBySlugQuery = groq`
  *[_type == "work" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    client,
    year,
    categories,
    description,
    imagesPerPage,
    credits,
    coverImage { asset->, hotspot, crop },
    media[] {
      _type,
      _key,
      // image
      asset->,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      aspectRatioType,
      hotspot,
      crop,
      alt,
      caption,
      // videoUpload
      file { asset-> },
      // videoUrl
      url
    }
  }
`;

// All slugs (for generateStaticParams)
export const allWorkSlugsQuery = groq`
  *[_type == "work" && defined(slug.current)] { "slug": slug.current }
`;

// Work cards for homepage — cover + media slides
export const workCardsQuery = groq`
  *[_type == "work"] | order(year desc) {
    _id,
    title,
    client,
    credits,
    categories,
    "slug": slug.current,
    coverImage { asset, "aspectRatio": asset->metadata.dimensions.aspectRatio },
    media[] {
      _type,
      _key,
      asset->,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      aspectRatioType,
      file { asset-> },
      url
    }
  }
`;

// Sticky notes ordered manually
export const stickyNotesQuery = groq`
  *[_type == "stickyNote"] | order(order asc) {
    _id,
    text
  }
`;

// All copy entries (for CopyContext)
export const allCopyQuery = groq`
  *[_type == "copy"] {
    _id,
    "key": key.current,
    title,
    body,
    plainText
  }
`;

// Copy by key
export const copyByKeyQuery = groq`
  *[_type == "copy" && key.current == $key][0] {
    _id,
    key,
    title,
    body,
    plainText,
    image { asset-> }
  }
`;
