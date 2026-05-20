# Needham Auto Cleaning — Full Site Spec

**Live URL:** needham-auto-cleaning.netlify.app  
**Files:** `C:\work\vishnu\apps\NAC_web\output\`  
**Last updated:** April 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [Architecture Decisions](#3-architecture-decisions)
4. [CSS System](#4-css-system)
5. [Frontend Sections](#5-frontend-sections)
6. [JavaScript Features](#6-javascript-features)
7. [Backend — Firebase](#7-backend--firebase)
8. [Hosting — Netlify](#8-hosting--netlify)
9. [Owner Dashboard](#9-owner-dashboard)
10. [Test Suite](#10-test-suite)

---

## 1. Project Overview

A single-page marketing website for Needham Auto Cleaning, a weekend car wash business in Needham, MA. Built for two audiences:

- **Customers** — find the business, see services/pricing, book via form
- **Owner** — manage announcements, toggle closed status, view form submissions, see analytics

All from a single HTML file. No build tools, no frameworks, no separate servers.

---

## 2. File Structure

```
apps/NAC_web/
  output/
    index.html          ← entire site (CSS + JS all inline)
    announcements.html  ← standalone announcements page
  tests/
    test_site.js        ← 132-test Node.js test suite
  plan.md               ← original plan spec
  how-to-netlify-forms.md
```

**Why single file?**  
Per webapp design principles: one HTML file means one thing to deploy, no 404s from missing CSS/JS files, and it works offline by dragging to a browser. All styles are in a `<style>` block, all JS in a `<script>` block at the bottom.

---

## 3. Architecture Decisions

| Decision | Choice | Why |
|---|---|---|
| File structure | Single HTML | Simplest deploy, nothing to link or break |
| JS style | `var` only, no `let`/`const` | Consistency, no transpiler needed |
| Fonts | Google Fonts CDN (Orbitron + Inter) | Visual quality tradeoff — kept by owner request |
| Database | Firebase Firestore | Global state without a server |
| Auth | Firebase Authentication (email/password) | Password never in source code |
| Form | Netlify Forms | Free, 100 submissions/month, no backend needed |
| Hosting | Netlify | Free, drag-and-drop deploy, handles form processing |

---

## 4. CSS System

### CSS Variables (`:root`)

```css
--cyan:     #00cfff   /* brand color — all glows, borders, accents */
--bg:       #050a12   /* page background */
--bg2:      #0a1220   /* alternate section background */
--card-bg:  #0d1a2a   /* card/panel background */
--text:     #e8f4ff   /* body text */
--muted:    #6a8aaa   /* secondary text, labels */
--border:   rgba(0,207,255,0.12)  /* subtle cyan border */
--shadow:   0 4px 24px rgba(0,0,0,0.4)
--font-head: 'Orbitron', sans-serif
--font-body: 'Inter', system-ui fallback stack
```

### Dark / Light Mode

Default is dark. `body.light-mode` overrides the CSS variables:

```css
body.light-mode {
  --bg: #f0f4f8;
  --card-bg: #ffffff;
  --text: #1a2a3a;
  /* etc */
}
```

Toggled by a JS button — no page reload needed. The entire site repaints instantly because everything uses the variables.

### Animations

| Name | What it does |
|---|---|
| `fadeUp` | Hero text slides up on load |
| `glowPulse` | Book Now button glows cyan repeatedly |
| `spin` | Loader spinner rotates |
| `pulse` | Loader text and closed banner fade in/out |
| `shake` | Login panel shakes on wrong password |

### Scroll Reveal

`.reveal` class: elements start invisible (`opacity: 0`, `translateY(40px)`). When the IntersectionObserver sees them enter the viewport, it adds `.visible` which transitions them in. Cards stagger using a small `setTimeout` delay multiplied by index.

### Responsive

One breakpoint at `768px`. Below it:
- Nav links hidden → hamburger shows
- Toolbar pills hidden
- Sections get less padding
- Contact form goes single column
- Pricing popular card loses its scale

---

## 5. Frontend Sections

### Loader

Full-screen overlay with a spinning cyan ring and the business name. Hides 1.5s after `window.load` fires. Z-index 9999 so it covers everything.

```html
<div id="loader">
  <div class="loader-ring"></div>
  <div class="loader-text">Needham Auto Cleaning</div>
</div>
```

### Navbar (`id="navbar"`)

Fixed at top, z-index 900. Uses `backdrop-filter: blur(12px)` for the frosted glass effect. Shrinks padding when scrolled past 50px (`#navbar.scrolled`). Contains:
- **NAC** logo text (left)
- Nav links: Services, Gallery, Pricing, Reviews, Contact (center)
- Toolbar: 🔗 Share + 🌙 Dark pills (right)
- Hamburger button (mobile only)

### Closed Banner (`id="closedBanner"`)

Red sticky bar below the navbar. Hidden by default (`display: none`). Gets `.visible` class when owner toggles it from the dashboard — triggers `display: block`. State stored in Firebase Firestore so it's global across all visitors. Pulses with the `pulse` animation.

```css
position: sticky;
top: 64px;  /* sits right below the fixed navbar */
z-index: 800;
```

### Hero (`id="hero"`)

Full-height section with:
- **Bubble canvas** — 60 floating cyan circles drawn with Canvas API, each with random size/speed/drift, reset when they float off the top
- **Hero title** — "Needham Auto Cleaning", `clamp(2rem, 6vw, 5rem)`, glows
- **Tagline** — "Professional Quality at an Affordable Price"
- **Book Now** button — scrolls to `#contact`, pre-selects nothing

### Announcement Banner (`id="announcement"`)

Below the hero, above Services. Shows the most recent announcement from Firebase. Structure:

```
[ 📢 Latest Update ]
[ announcement text ]
[ date              ]      [ All Updates → ]
```

"All Updates" links to `announcements.html`. Text and date update in real-time via Firestore `onSnapshot` — when the owner posts a new announcement, every open browser tab updates within seconds.

### Services (`id="services"`)

4 cards in a CSS grid (`repeat(auto-fit, minmax(240px, 1fr))`):
- 🥈 Silver — $15 (hand wash, foam, dry, tire scrub)
- 🥇 Gold — $20 (Silver + tire shine + ceramic wax)
- 🚗 Interior Sedan — $40 (vacuum, trash, mats, wipe, windows)
- 🚙 Interior SUV — $50 (same as sedan, larger vehicle)

Each card has a light-sweep hover animation using a `::before` pseudo-element with a gradient that translates across on hover.

### Gallery (`id="gallery"`)

Currently shows 3 placeholder cards ("✨ Your Car Could Be Here!"). Designed to hold before/after drag sliders (`.ba-slider`). When real photos are added, they replace the placeholders. The slider works with mouse and touch drag — left side is "Before", right side is "After", divided by a draggable cyan handle.

**Slider logic:**
```
clip-path: inset(0 0 0 {pct}%)
```
As the handle moves right, the `inset` left value grows, hiding more of the "After" image.

### Pricing (`id="pricing"`)

3 cards: Silver, Gold, Gold + Interior Bundle. The Bundle card has `class="pricing-card popular"` — cyan border, slight scale, and a "Most Popular" badge.

Each card has a `book-btn` with `data-service="Silver ($15)"` etc. Clicking scrolls to the contact form AND pre-selects the matching service in the dropdown.

### Testimonials (`id="testimonials"`)

3 cards in a sliding carousel. Only one shows at a time. Dots below indicate position and are clickable. Auto-advances every 4 seconds using `setInterval`. CSS `transform: translateX(-{n*100}%)` animates the track.

### FAQ (`id="faq"`)

7 questions in an accordion. Clicking a question toggles `.open` on its `.faq-item`. The answer uses `max-height: 0 → 200px` transition to animate open/close. Only one item open at a time (clicking a new one closes the current one).

Questions:
1. Do you come to me, or do I come to you? (You come to them — Sunnyside Road)
2. How long does each service take?
3. Do I need to do anything before I come?
4. How do I pay? (Cash or Venmo)
5. Do you work in bad weather?
6. Can I book for multiple cars?
7. What areas do you service?

### Contact (`id="contact"`)

Two-column layout:
- **Left** — contact form (Netlify)
- **Right** — business info (address, hours, email, Instagram)

**Form fields:** Name, Phone, Car (make/model), Service (dropdown), Message  
**Payment info:** Cash and Venmo

### Footer

Copyright line + tiny "owner login" button (faint, barely visible — intentional).

---

## 6. JavaScript Features

All JS is inline in one `<script>` block at the bottom of `<body>`. Uses `var` throughout (no `let`/`const`).

### Firebase Init

```js
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();
var settingsDoc = db.collection('settings').doc('main');
var analyticsDoc = db.collection('analytics').doc('main');
```

### Visit Tracking

Runs immediately on every page load. Increments two fields atomically using Firestore `FieldValue.increment`:
- `total` — all-time visit count
- `day_YYYYMMDD` — visits on today's specific date key

```js
var todayKey = 'day_' + new Date().toISOString().slice(0, 10).replace(/-/g, '');
analyticsDoc.set({ total: increment(1), [todayKey]: increment(1) }, { merge: true });
```

### Real-time Listener (`onSnapshot`)

Single listener on `settings/main` that updates the UI for every open tab whenever data changes:

```js
settingsDoc.onSnapshot(function(doc) {
  var data = doc.exists ? doc.data() : {};
  applyClosedState(!!data.closed);          // show/hide red banner
  updateMainAnnouncement(data.announcements || []);  // update announcement box
});
```

This is what makes the closed banner and announcements truly global — when the owner changes anything, it propagates to every visitor's browser in real-time.

### Dark Mode Toggle

Toggles `body.light-mode` class. Updates button label between "🌙 Dark" and "☀ Light". Because everything uses CSS variables, the entire site repaint happens automatically.

### Share Button

Copies the current URL to clipboard using `navigator.clipboard.writeText()`. Button briefly shows "✓ Copied!" with green styling, then resets after 2 seconds.

### Nav Scroll Shrink

`window.scroll` listener toggles `#navbar.scrolled` when `scrollY > 50`. This reduces navbar padding from 18px to 12px via CSS transition.

### Hamburger Menu

Toggles `.open` on `#mobileMenu`. All links inside the menu close it on click. ESC key also closes it.

### Escape Key — Layered Reset

Priority chain — ESC handles one thing at a time in order:
1. Close dashboard modal
2. Close login modal
3. Close mobile menu
4. Blur focused element
5. Scroll to top

### Bubble Canvas

60 bubble objects stored in array. Each has `x, y, r, speed, opacity, drift`. `requestAnimationFrame` loop clears the canvas and redraws each frame. When a bubble floats off the top (`y + r < 0`), it's replaced with a new one at the bottom.

### Before/After Slider

Mouse and touch events on `.ba-slider` elements. Tracks drag position as a percentage of slider width. Updates the `.ba-after` clip-path and handle position:

```js
after.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
handle.style.left = pct + '%';
```

### Testimonial Rotator

`goTo(index)` moves the track with `transform: translateX(-{index * 100}%)` and updates dot active states. `setInterval` calls `goTo((current + 1) % total)` every 4 seconds.

### Book Now Pre-select

Each `.book-btn` has `data-service="Silver ($15)"` etc. On click, it finds the matching `<option>` in the contact form select and sets `selected = true`. Scrolling to `#contact` happens via the anchor `href`.

### FAQ Accordion

```js
document.querySelectorAll('.faq-q').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item = btn.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  });
});
```

### Contact Form Submit

1. Saves form data to Firestore `submissions` collection (for owner to view later)
2. Sends to Netlify Forms via `fetch('/', { method: 'POST', ... })`
3. On success: shows "Sent! ✓" in green, resets form, restores button after 3s
4. On error: shows "Error — try again"

Submissions saved to Firestore include: name, phone, car, service, message, date, and a server-side `createdAt` timestamp.

---

## 7. Backend — Firebase

**Project:** `nac-web-backend`  
**Console:** console.firebase.google.com/project/nac-web-backend

### Firestore Database

Three collections:

#### `settings/main` (document)
```json
{
  "closed": false,
  "announcements": [
    { "title": "...", "body": "...", "date": "April 19, 2026" }
  ]
}
```
Read by every visitor via `onSnapshot`. Written only by the owner from the dashboard.

#### `submissions` (collection)
One document per form submission:
```json
{
  "name": "John Smith",
  "phone": "617-555-0100",
  "car": "2019 Honda Civic",
  "service": "Gold ($20)",
  "message": "Saturday please!",
  "date": "April 19, 2026",
  "createdAt": <server timestamp>
}
```
Written by any visitor (on form submit). Read only by owner in the dashboard.

#### `analytics/main` (document)
```json
{
  "total": 247,
  "day_20260419": 12,
  "day_20260418": 31,
  ...
}
```
Written by every visitor on page load (increment). Read only by owner in the dashboard.

### Firebase Authentication

Email/password sign-in. One user: `needham.auto.cleaning@gmail.com`. Password managed entirely by Firebase — never appears in source code. Login uses:

```js
auth.signInWithEmailAndPassword(OWNER_EMAIL, password)
```

Logout:
```js
auth.signOut()
```

### Firestore Security Rules

Currently open (test mode):
```
allow read, write: if true;
```

Should eventually be tightened so only authenticated users can write to settings/submissions, and anyone can read settings and write to submissions.

---

## 8. Hosting — Netlify

**Site:** needham-auto-cleaning.netlify.app  
**Deploy method:** Drag `output/` folder to Netlify dashboard  
**Plan:** Free (Starter)

### Netlify Forms

The contact form posts to Netlify:

```html
<form name="contact" netlify method="POST">
  <input type="hidden" name="form-name" value="contact" />
  ...
</form>
```

On deploy, Netlify scans the HTML and registers the form. Submissions appear in the Netlify dashboard under Forms → contact. Email notifications can be configured to go to `needham.auto.cleaning@gmail.com`.

The form uses `fetch('/')` to submit without a page redirect:
```js
fetch('/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(new FormData(form)).toString()
})
```

Free plan: 100 submissions/month.

---

## 9. Owner Dashboard

Accessed via a faint "owner login" button in the footer. Password verified by Firebase Auth — not in source code.

### Login Flow

1. Click "owner login" in footer → login modal appears
2. Type password → JS calls `firebase.auth().signInWithEmailAndPassword()`
3. Wrong password → panel shakes, error shown, input cleared
4. Correct password → login modal closes, dashboard modal opens

### Dashboard Views

The dashboard uses a view system: `div.dash-view` is hidden by default, `.dash-view.active` shows. Navigating between views swaps which one has the `active` class.

#### Main Menu
- 📢 Announcements →
- 🚫 Mark as Closed Temporarily (toggle)
- 📬 View Submissions →
- 📊 Stats & Analytics →
- 📅 Booking Manager (disabled — coming soon)
- Log Out

#### Announcements View
Post a title + message → saved to `settings/main.announcements[]` in Firestore → immediately visible to all site visitors. Listed announcements can be deleted individually. Export button generates a downloadable `announcements.html` to replace the static page on Netlify.

#### Closed Toggle
Reads current `closed` value from Firestore, flips it, writes back. The `onSnapshot` listener on every visitor's browser picks up the change and shows/hides the red banner immediately — no page reload needed.

#### View Submissions
Loads all documents from the `submissions` collection ordered by `createdAt desc`. Shows name, date, service tag, phone, car, and message for each. Individual submissions can be deleted. "Clear All" uses a Firestore batch delete.

#### Stats & Analytics
Fetches `analytics/main` from Firestore. Shows:
- Total Visits (all-time)
- Visits Today
- Visits This Week (sum of last 7 day keys)
- Total Form Submissions (count of `submissions` collection)

---

## 10. Test Suite

**File:** `tests/test_site.js`  
**Run:** `node tests/test_site.js` from `apps/NAC_web/`  
**Count:** 132 tests, all passing

Tests are static — they read and parse `output/index.html` and `output/announcements.html` as strings. They do not run a browser or test Firebase. Categories:

| Section | Tests |
|---|---|
| File & Structure | 10 |
| Required Sections | 11 |
| Real Content | 18 |
| Contact Form | 12 |
| UI Features | 11 |
| CSS | 13 |
| JavaScript | 16 |
| Navigation | 6 |
| Announcement Section | 8 |
| Announcements Page | 16 |
| Owner Login | 10 |
| **Total** | **132** |

Key JS checks include: balanced `{` and `(` counts, no `let`/`const` in inline scripts, presence of specific function/variable names, and presence of all required logic (loader, dark mode, clipboard, scrolled, mobileMenu, Escape, drawBubbles, IntersectionObserver, ba-slider, goTo, book-btn, fetch('/'), signInWithEmailAndPassword).
