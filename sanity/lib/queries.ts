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
    "backgroundColor": backgroundColor.hex,
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
    "backgroundColor": backgroundColor.hex,
    description,
    credits,
    coverImage { asset->, hotspot, crop },
    media[] {
      _type,
      _key,
      // image
      asset->,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
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
    categories,
    "slug": slug.current,
    "backgroundColor": backgroundColor.hex,
    coverImage { asset, "aspectRatio": asset->metadata.dimensions.aspectRatio },
    media[] {
      _type,
      _key,
      asset->,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
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

// All saved two designs, ordered
export const twoDesignsQuery = groq`
  *[_type == "twoDesign"] | order(order asc) {
    _id,
    label,
    cells,
    style,
    noGap,
    cols,
    rows,
    asset
  }
`;

// All multi assets, ordered
export const multiAssetsQuery = groq`
  *[_type == "multiAsset"] | order(order asc) {
    _id,
    label,
    role,
    type,
    cells,
    glyphStyle,
    noGap,
    cols,
    rows,
    uploadedAsset,
    colorA,
    colorB,
    checkerStripCount
  }
`;

// Copy by key
export const copyByKeyQuery = groq`
  *[_type == "copy" && key.current == $key][0] {
    _id,
    key,
    title,
    body,
    plainText
  }
`;
