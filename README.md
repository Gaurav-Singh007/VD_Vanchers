# VD Vanchers — The Highway Farms

A luxury land investment landing page for VD Vanchers' premium project "The Highway Farms" — 106 land parcels across 30 acres near Yamuna Expressway, Greater Noida.

## About VD Vanchers

**Founder:** Vansh Thakur
**Co-Founder:** Deepanshu Goyal
**General Manager:** Rimple Kaur

VD Vanchers is a real estate venture offering premium land parcels near Yamuna Expressway, strategically positioned near upcoming mega-projects including the Adani-acquired Jaypee Sports City, Noida International Airport (Jewar), and the proposed International Film City.

## What's on the Website

- **Hero Section** — Full-screen project imagery with key highlights (30 acres, 106 parcels, 1,008 sq. yd. each, 15 min to Jewar Airport)
- **About Section** — Project overview with key highlights (land parcel size, electricity, clubhouse, location)
- **Amenities Section** — 7 planned amenity cards with images:
  - Club House (7,060 sq. yd. / 7 bigha)
  - Swimming Pool
  - Golf Course
  - Restaurant
  - Kids Playing Area
  - Live Music Area
  - Stud Farming
- **Location Section** — 8 nearby landmarks with drive times + embedded Google Map
- **Why Invest Now Section** — Investment highlights:
  - Adani Group's acquisition of Jaypee Sports City
  - Noida International Airport (Jewar) — 15 min away
  - Upcoming International Film City — 10 min away
  - Price revision expected soon
- **Gallery Section** — Project photos, master plan, location map, and brochure
- **Pricing Section** — Full price breakdown card:
  - Base price: Rs. 15,499/sq. yd.
  - Development charges: Rs. 500/sq. yd.
  - Electricity charges: Rs. 50/sq. yd.
  - Club membership: Rs. 2,50,000
  - Maintenance: Rs. 8/sq. yd. annually
  - Total: Rs. 1,56,22,992
  - Corner plot premium: +10%
- **Specifications Section** — 4 key spec cards
- **Team Section** — Founder, Co-Founder, and General Manager
- **Contact Form** — Lead capture form that saves to Supabase database
- **AI Chat Widget** — Floating chat button that qualifies leads through automated conversation
- **Footer** — Quick links, contact info, team details

## AI & Automation Features

### AI Chat Agent (Built In)
- Floating chat widget on every page
- Answers questions about pricing, amenities, location, and land specs
- Qualifies leads by collecting name and phone number
- Saves qualified leads directly to the database
- Mentions Adani/Jaypee acquisition and price appreciation potential

### Lead Notification System
- When a visitor submits the contact form, a notification edge function fires
- The edge function can send alerts to WhatsApp, Telegram, or email via webhook
- Owner contact: +91 93193 07289 (WhatsApp/SMS) / gs3121753@gmail.com

### CRM / Database
- All leads stored in Supabase (PostgreSQL) with:
  - Name, phone, email, message
  - Source tracking (website form vs chat widget)
  - Status tracking (new, contacted, qualified, closed)
  - Qualification flag
  - Timestamp

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Database | Supabase (PostgreSQL) |
| Edge Functions | Supabase Deno Edge Functions |
| Fonts | Playfair Display (headings) + Inter (body) |

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs on port 3000.

## Project Structure

```
src/
├── main.tsx           ← React entry point
├── App.tsx           ← Full landing page (all sections)
├── ChatWidget.tsx    ← AI chat widget component
├── index.css          ← Complete styling (dark green + gold theme)
└── lib/
    ├── supabase.ts   ← Supabase client
    └── types.ts      ← TypeScript interfaces
public/
└── images/            ← Project photos (site, plan, brochure, map)
supabase/
├── config.toml        ← Edge function config
└── functions/
    └── notify-lead/
        └── index.ts  ← Lead notification edge function
```

## Design

- Dark green and gold luxury theme
- Playfair Display serif font for headings (premium feel)
- Inter sans-serif for body text
- Full responsive (desktop, tablet, mobile)
- Smooth scroll navigation
- Hover animations on cards and buttons
- Glass-morphism navbar on scroll

## License

© 2026 VD Vanchers. All rights reserved.
Founded by Vansh Thakur & Deepanshu Goyal.
