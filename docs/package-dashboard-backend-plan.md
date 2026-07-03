# Flyo Staff Package Dashboard Backend Plan

## Goal

Build a staff dashboard where Flyo team members can create, edit, preview, and publish holiday packages without touching code. The website should render package listing pages and package detail pages from structured data instead of hardcoded HTML.

## Main Staff Workflows

1. Create a new package draft.
2. Fill package basics, route, pricing, itinerary, inclusions, exclusions, notes, FAQs, and images.
3. Preview the package using the same frontend template customers will see.
4. Submit for review if needed.
5. Publish, unpublish, archive, or duplicate a package.
6. Update seasonal pricing and availability without rebuilding pages manually.

## Recommended Roles

- Admin: manage users, settings, published packages, and media.
- Editor: create and edit package drafts.
- Reviewer: approve and publish packages.
- Sales staff: view package data, copy enquiry links, and manage enquiries.

## Package Template Sections

### 1. Basic Details

- Package title
- Slug
- Country
- Destination or city
- Duration
- Route
- Category
- Package type
- Tags
- Starting price
- Availability text
- Short summary
- Full overview
- WhatsApp enquiry message
- SEO title
- SEO description

### 2. Images

- Card image
- Hero image
- Gallery images
- Itinerary day images
- Image alt text
- Optional image highlights

Image rules:
- Upload WebP/JPG/PNG.
- Store original file and optimized WebP variants.
- Require alt text before publish.
- Recommended sizes:
  - Card image: 1200 x 800
  - Hero image: 2400 x 1400
  - Gallery image: 1400 x 900
  - Mobile hero image, optional: 900 x 1200

### 3. Pricing Options

Use a flexible pricing model. Do not assume every package has 3-star, 4-star, and 5-star options.

Fields:
- Label, for example `3 Star Package`
- Badge, for example `Best Value`
- Hotels
- Meal plan
- Transfer type
- Price
- Price display
- Price note
- Features list
- CTA text
- Seasonal note
- Sort order

Pricing rules:
- If price is missing, show `Price on request`.
- If seasonal pricing applies, show a seasonal badge and note.
- If there are more than 3 options or complex pricing, render a comparison table.

### 4. Itinerary

Each itinerary day should support:
- Day label
- Title
- Summary
- Detailed bullet points
- Chips/tags
- Images
- Meals
- Transfers
- Optional hotel note

### 5. Hotels

Hotel data should be reusable across packages.

Fields:
- Hotel name
- City
- Star category
- Room type
- Meal plan
- Notes
- Image
- Website URL, optional
- `or similar` flag

### 6. Inclusions And Exclusions

Use repeatable list fields:
- Inclusions
- Exclusions
- Travel notes
- Important information
- Cancellation policy
- Visa notes

### 7. FAQs

Each FAQ:
- Question
- Answer
- Sort order
- Visibility toggle

## Suggested Data Model

Core tables or collections:
- users
- roles
- packages
- package_pricing_options
- package_itinerary_days
- package_hotels
- package_images
- package_faqs
- package_notes
- enquiries
- media_assets
- audit_logs

Optional future tables:
- destinations
- countries
- hotels
- suppliers
- seasonal_rate_periods
- package_versions

## Package Status Flow

Use these statuses:
- draft
- in_review
- published
- unpublished
- archived

Publishing rules:
- Slug must be unique.
- Hero image, card image, title, country, duration, route, summary, and at least one CTA must exist.
- At least one pricing option or price-on-request option must exist.
- At least one itinerary item should exist unless the package is an experience-only package.

## Enquiry Handling

Every package page should generate dynamic enquiry links:
- WhatsApp URL
- Phone link
- Email link

Suggested enquiry record fields:
- Package ID
- Package title at time of enquiry
- Selected package/pricing option
- Travel date
- Adults
- Children
- Customer name
- Phone
- Email
- Message
- Source page
- Status
- Assigned staff member

Status examples:
- new
- contacted
- quoted
- follow_up
- won
- lost

## Dashboard Pages

Minimum dashboard:
- Login
- Package list
- Create package
- Edit package
- Preview package
- Media library
- Enquiry inbox
- User management
- Settings

Package editor layout:
- Left sidebar tabs
- Main editing area
- Sticky save/preview/publish controls
- Validation panel
- Autosave draft indicator

Editor tabs:
- Basics
- Images
- Itinerary
- Stay Options & Pricing
- Hotels
- Inclusions
- Notes
- FAQs
- SEO
- Preview

## Frontend Rendering Strategy

Keep one reusable package detail template. It should receive package data and render:
- Hero
- Meta row
- WhatsApp CTA
- Trust strip
- Overview
- Highlights
- Itinerary
- Stay Options & Pricing
- Gallery
- FAQs
- Bottom CTA
- Footer

The frontend should not hardcode package names, prices, hotel categories, or gallery images.

## API Endpoints

Example REST endpoints:

- `GET /api/packages`
- `GET /api/packages/:slug`
- `POST /api/packages`
- `PATCH /api/packages/:id`
- `POST /api/packages/:id/publish`
- `POST /api/packages/:id/unpublish`
- `POST /api/media`
- `GET /api/media`
- `POST /api/enquiries`
- `GET /api/admin/enquiries`

If using Next.js or another full-stack framework, these can be server actions or route handlers instead.

## Recommended Stack Options

Option A: Fast practical stack
- Next.js
- PostgreSQL
- Prisma
- Auth.js or Supabase Auth
- S3-compatible storage for images
- Vercel or VPS deployment

Option B: Managed backend
- Supabase database
- Supabase Auth
- Supabase Storage
- Next.js frontend/admin

Option C: Traditional CMS style
- Strapi or Directus
- PostgreSQL
- Custom Flyo frontend

Recommended for Flyo: Next.js plus Supabase or PostgreSQL/Prisma. It gives enough control for custom package pricing and staff workflows.

## Migration From Current Website

1. Convert current `data/packages.js` into seed data.
2. Create database tables for package content.
3. Upload existing package images into managed storage.
4. Update frontend package listing and detail pages to read from API or generated static data.
5. Build admin package editor.
6. Add preview and publish flow.
7. Add enquiry inbox.

## MVP Scope

Build first:
- Staff login
- Package CRUD
- Image upload
- Pricing options editor
- Itinerary editor
- Preview page
- Publish/unpublish
- Enquiry capture

Defer:
- Multi-language support
- Supplier management
- Automated quotation PDFs
- Payment links
- Advanced approval workflow
- Version history

## Acceptance Checklist

- Staff can create a package without code.
- Staff can add 1, 2, 3, or many pricing options.
- Price-on-request packages render correctly.
- Gallery images are package-specific.
- Package detail template adapts to available data.
- Draft packages are not public.
- Published packages appear on listing pages.
- WhatsApp message uses the package title dynamically.
- Images have alt text and optimized versions.
- Enquiries are saved and visible to staff.

