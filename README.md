# Radiant Roofing — Website Redesign

Full 2026 UI/UX redesign of [1radroof.com](https://1radroof.com). Built with semantic HTML5, modern CSS3, and vanilla JS. Zero build tools required — Vercel auto-deploys from this repo.

## Stack
- HTML5 / CSS3 / Vanilla JS
- Fonts: Syne + Inter (Google Fonts)
- Icons: Lucide Icons (CDN)
- Images: Unsplash (placeholders)
- Forms: Formspree

## Deploy
1. Push this repo to GitHub
2. Connect to [Vercel](https://vercel.com) — import repo, zero config needed
3. Vercel detects `index.html` at root and deploys instantly

## Before Going Live — Replace These Placeholders

| Location | What to Replace |
|---|---|
| `index.html` — form action | `REPLACE_WITH_FORMSPREE_ID` → your Formspree endpoint |
| `index.html` — footer socials | `#` → Facebook, Instagram, Google Reviews URLs |
| `index.html` — hero image | Unsplash URL → professional photo of your crew/roofs |
| `index.html` — about image | Unsplash URL → photo of Jared or the crew |
| `index.html` — phone/email | Confirm `(216) 300-1953` and `info@1radroof.com` are correct |
| `index.html` — reviews | Replace placeholder testimonials with real Google reviews |

## File Structure
```
freewebsite/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── README.md
```

## Browser Support
Chrome, Safari, Firefox, Edge — last 2 versions. All animations respect `prefers-reduced-motion`.
