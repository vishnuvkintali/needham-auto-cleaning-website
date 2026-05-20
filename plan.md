# Needham Auto Cleaning — Website Plan

## Project Info
- **Business:** Needham Auto Cleaning
- **Output folder:** `output/`
- **Tech:** Pure HTML + CSS + JavaScript (no frameworks, runs in any browser)

---

## File Structure
```
NAC_web/
├── plan.md
└── output/
    ├── index.html
    ├── style.css
    └── script.js
```

---

## Pages / Sections (all on one scrolling page)

### 1. Loading Screen
- Animated water splash or spinning tire on dark background
- Fades out after ~1.5 seconds revealing the main site

### 2. Header / Nav
- Logo (text-based): "Needham Auto Cleaning"
- Sticky nav: Home | Services | Gallery | Pricing | Contact
- Hamburger menu on mobile

### 3. Hero Section
- Full-screen dark background with animated water bubble/droplet effects (CSS canvas)
- Big bold headline: "We Make Your Car Shine"
- Subtext tagline placeholder
- Glowing pulsing "Book Now" button
- Parallax scroll effect on background

### 4. Services Cards
- 4 cards: Basic Wash, Deluxe Wash, Premium Detail, Full Interior
- Cards float up on scroll (Intersection Observer animation)
- Hover: card lifts + gloss/shine sweep effect
- Each card has an icon, title, short description, placeholder price

### 5. Before & After Gallery
- Interactive drag slider (left = dirty, right = clean)
- 3 car photo pairs (placeholder images from picsum/unsplash)
- Label overlay: "Before" / "After"

### 6. Pricing Table
- 3-column comparison table (Basic / Deluxe / Premium)
- Highlight the middle "popular" column
- Price pops in with bounce animation on scroll
- "Choose Plan" buttons

### 7. Testimonials
- Auto-rotating review cards (every 4 seconds)
- Star ratings, fake placeholder names and quotes
- Fade transition between reviews

### 8. Meet the Team
- Placeholder photo circles + names
- Short fun bio for each person
- Cards slide in from alternating sides on scroll

### 9. Contact / Book Section
- Form: Name, Phone, Car Type, Service dropdown, Message
- WhatsApp / call button (placeholder number)
- Embedded Google Map placeholder

### 10. Footer
- Business name, phone, email (placeholders)
- Social icons: Instagram, Snapchat, TikTok
- Copyright line

---

## Visual Style
- **Color scheme:** Deep navy/black background + electric cyan (#00CFFF) accent + white text
- **Font:** Google Fonts — "Orbitron" for headings, "Inter" for body
- **Vibe:** Premium, modern, dark mode, like a luxury car brand

## Animations
- Scroll-triggered fade/slide-in (Intersection Observer)
- CSS keyframe animations (float, pulse, shine sweep)
- Parallax hero background
- Loading screen fade-out
- Card hover effects (transform + glow)
- Testimonial auto-rotate with CSS transitions

## Mobile
- Fully responsive via CSS Grid + Flexbox
- Hamburger nav on small screens
- Touch-friendly before/after slider

---

## Build Order
1. `index.html` — full structure, all sections
2. `style.css` — full styling, animations, responsive
3. `script.js` — scroll animations, slider, testimonial rotate, loading screen, nav
