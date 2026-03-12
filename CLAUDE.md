# CLAUDE.md

## Project Overview

This project is the website for **Multi2**, a creative agency based in Stockholm.

The website has three primary goals:

1. Communicate the agency’s **unique selling points**
2. Showcase **selected projects**
3. Make it **easy for potential clients to get in touch**

The site should feel **fast, minimal, and intentional**, reflecting the agency’s design philosophy.

---

# Tech Stack

## Frontend

- Next.js (App Router)
- React
- TailwindCSS
- Framer Motion
- Embla Carousel
- shadcn/ui component library

## Backend / CMS

The backend uses **Custom Post Types**.

Content types:

- `Work`
- `Copy`

The CMS only stores content.  
All layout and logic are handled in **Next.js**.

---

# Core Data Models

## Work

Each **Work** entry contains:

- `title`
- `client`
- `year`
- `category`

Category options:

- `photo`
- `video`
- `production`
- `art-direction`
- `concept`

Additional fields:

- `description`
- `media` (gallery of 1–10 images or videos)
- `credits`
- `slug`

### Requirements

Work pages must support:

- **fast browsing**
- **smooth navigation**
- **lightweight media loading**

The archive will **grow continuously**, so performance must scale well.

---

# Pages

## Dynamic

- `/work`
- `/work/[slug]`

## Static

- `/about`
- `/contact`
- `/privacy-policy`

---

# Design Principles

The design philosophy should prioritize:

- **Minimal UI**
- **Fast loading**
- **Mobile-first layouts**
- **Smooth, subtle animations**

The visual language should feel:

- confident
- modern
- intentional

---

# Avoid

Do **not** introduce:

- visual clutter
- complex CMS logic in the frontend
- heavy page builders
- unnecessary dependencies

---

# UI Guidelines

Follow these rules when building UI:

1. Use **shadcn/ui components whenever possible**
2. Prefer **existing components over custom ones**
3. Style using **TailwindCSS**
4. Keep components **small and reusable**
5. Avoid unnecessary abstraction

---

# Animation Guidelines

Use **Framer Motion** for UI transitions.

Animations should be:

- smooth
- subtle
- purposeful

Avoid decorative or distracting motion.

---

# Architecture Goals

The system should follow these principles:

### Next.js handles:

- rendering
- UI logic
- page structure

### CMS handles:

- content only

Maintain:

- clean separation between **content and presentation**
- a **predictable folder structure**
- long-term maintainability

---

# Performance Requirements

Because the project archive will grow over time:

- pages must remain **fast with large datasets**
- media loading must be **efficient**
- components must remain **lightweight**

Prefer:

- lazy loading
- pagination or incremental loading
- optimized media

---

# Development Philosophy

Code should be:

- modular
- readable
- predictable

Avoid:

- over-engineering
- complex abstractions
- unnecessary state management

Favor **simple, composable components**.
