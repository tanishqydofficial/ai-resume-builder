# Design Brief — Professional Resume Architect

## Direction

Professional Resume Builder — a SaaS tool commanding trust through clarity, modern typography, and intentional indigo-blue accents with cool greys. Designed for internship showcase; visual credibility through minimalist structure and subtle depth.

## Tone

Corporate-professional minimalism — refined, trustworthy, modern. Bold in typography hierarchy, restrained in color. Inspired by LinkedIn, Canva, Vercel.

## Differentiation

ATS score visualization as a focal point (teal progress circle) + skill categorization UI with semantic color coding makes resume-building tangible and data-driven.

## Color Palette

| Token      | OKLCH          | Role                              |
| ---------- | -------------- | --------------------------------- |
| background | 0.99 0.005 260 | Clean white, maximum readability  |
| foreground | 0.13 0.02 260  | Deep slate blue-grey text         |
| card       | 1.0 0.0 0      | Pure white for elevated surfaces  |
| primary    | 0.45 0.22 265  | Indigo blue for CTAs, highlights  |
| accent     | 0.65 0.2 200   | Teal for ATS score, success       |
| muted      | 0.92 0.02 260  | Light grey for backgrounds        |
| border     | 0.88 0.01 260  | Subtle 1px structural borders     |

## Typography

- Display: Space Grotesk — geometric, modern, tech-forward; headings, scores, labels
- Body: DM Sans — clean corporate typeface; forms, resume content, text
- Scale: h1 `text-4xl md:text-5xl font-bold tracking-tight`, h2 `text-2xl font-bold`, body `text-base`

## Elevation & Depth

Subtle card-based hierarchy: borders over shadows. Headers use 1px bottom borders, content cards have thin borders, no drop shadows. Depth via spacing and contrast, not visual weight.

## Structural Zones

| Zone      | Background        | Border          | Notes                            |
| --------- | ----------------- | --------------- | -------------------------------- |
| Header    | white (card)      | border-b grey   | App title, nav, clean header     |
| Form      | white (bg)        | —               | Spacious sections                |
| Preview   | muted (muted)     | border-l grey   | Right sidebar resume preview     |
| ATS/Skills| white (card)      | border grey     | Teal accents on highlights       |
| Footer    | muted (muted)     | border-t grey   | Download button, actions         |

## Spacing & Rhythm

Sections separated by 2rem. Cards have 1rem padding. Form fields 1.5rem apart. All transitions 0.3s smooth. Comfortable breathing room for professional context.

## Component Patterns

- Buttons: Indigo primary (bg-primary text-primary-foreground) with hover darkening; secondary grey outline
- Cards: White (bg-card) with 1px border, rounded-lg, 1rem padding, no shadow
- Badges: Semantic colors — indigo (Technical), teal (Tools), grey (Soft Skills)

## Motion

- Entrance: Fade in 0.4s ease-out on load. Section expansions slide-down 0.2s.
- Hover: Interactive elements darken + shadow lift 0.3s
- Decorative: ATS score animates 0→target on load; skill badges fade-in staggered

## Constraints

- No purple, no gradients. Maximize whitespace. All text passes WCAG AA+. One accent color per section.

## Signature Detail

ATS Score Visualization — teal circular progress indicator with percentage and keyword count, making resume optimization tangible and rewarding.
