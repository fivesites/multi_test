# Modular “2” Generator — Brand Tool Spec

## Overview

We want to build a browser-based tool inspired by:
https://www.grid-type.com/type-tool/rectangle

The tool allows users to **construct variations of the number "2"** using a grid-based system, then export the result as **SVG assets** for use in branding and design.

This is not just a drawing tool — it should function as a **modular identity generator**.

---

## Core Concept

The system is built on 3 layers:

### 1. Structure Layer (Shared Across All Styles)

- Grid-based canvas
- Configurable rows / columns
- Snap-to-grid behavior
- Cell-based coordinate system

---

### 2. Shape Layer (Defines the “2”)

Two approaches:

#### A. Grid-based (primary)

- User fills cells to construct a “2”
- Stored as a boolean matrix (active/inactive cells)

#### B. Freehand path (secondary)

- User draws a “2” using a pen tool
- Stored as SVG `<path>`

---

### 3. Rendering Layer (Style Variants)

The same structure can be rendered in different visual styles.

---

## The 5 Required “2” Styles

### 1. Square Pixel “2”

**Description**

- Classic bitmap/grid style

**Implementation**

- Each active cell renders as:
  `<rect>`

**Grid**

- Square cells (1:1 ratio)

---

### 2. Image-based Pixel “2”

**Description**

- Same as pixel version, but each cell uses an image

**Implementation**

- Each active cell renders as:
  `<image href="...">`

**Constraints**

- Images must be square (1:1)
- Optional: allow random or patterned image assignment

---

### 3. Freehand / Pen “2”

**Description**

- Drawn manually, not grid-constrained

**Implementation**

- Output as:
  `<path>` (Bezier curves)

**Notes**

- Optional light snapping to grid
- Adjustable stroke width

---

### 4. Stretched Pixel “2”

**Description**

- Pixel grid but horizontally stretched

**Implementation**

- Same logic as square pixel version
- Cells rendered as:
  `<rect>` with non-square proportions

**Grid**

- Rectangular cells (e.g. width > height)

---

### 5. Circle-based “2”

**Description**

- Built from circles instead of squares

**Implementation**

- Each active cell renders as:
  `<circle>`

**Options**

- Fixed radius
- Radius relative to cell size

---

## Core Features

### Grid System

- Adjustable rows / columns
- Adjustable cell size
- Toggle:
  - Square grid
  - Stretched grid

---

### Drawing Modes

#### 1. Cell Fill Mode

- Click to toggle cells on/off
- Drag to paint

#### 2. Pen Mode

- Freehand drawing
- Outputs SVG path

---

### Style Switcher

User can switch rendering mode:

- Square
- Image
- Circle
- Stretched
- Pen

---

### Export

#### Required

- SVG export (clean, optimized)

#### Optional

- PNG export

---

## Data Model

### Grid-based “2”

```json
{
  "rows": 12,
  "cols": 12,
  "cells": [
    [0,1,1,0,...],
    ...
  ]
}
```
