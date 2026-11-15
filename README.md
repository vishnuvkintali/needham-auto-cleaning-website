# Needham Auto Cleaning: Client Website

**Status:** Done
The site is live on its custom domain (v1.3) and every customer and owner feature works; still open are real gallery photos and reviews, locking down the Firestore rules, and the placeholder Booking Manager button.

A live, professional website built for a real local car wash business in Needham, MA. Built from scratch with plain HTML, CSS and JavaScript (no frameworks, no build step).

**Live site:** https://needhamautocleaning.com
**Backup URL:** https://needham-auto-cleaning.netlify.app

## What the Site Does

**For customers**
- Services and pricing cards (Silver, Gold, Interior Sedan, Interior SUV, plus a Gold + Interior bundle)
- "Book" buttons that scroll to the contact form and pre-select the chosen service
- Contact / booking form (name, phone, car, service, message)
- Latest owner announcement near the top, plus a full announcements history page
- Showcase gallery (one real photo, the rest placeholders) with a before/after drag slider ready for photo pairs
- Rotating customer reviews carousel
- FAQ accordion
- Interactive location map, hours, Instagram and Facebook links
- Dark / light mode toggle, share-link button, mobile hamburger menu
- Loading screen, animated bubble background, scroll-reveal animations

**For the owner (hidden "owner login" link in the footer)**
- Post and delete announcements that show up for every visitor in real time
- Toggle "Closed Temporarily" and "Closed for the Season" banners
- View and delete contact form submissions
- Visitor stats: total visits, today, this week, total submissions
- Download a regenerated `announcements.html`

## Tech and Hosting

| Layer | Technology | Cost |
|---|---|---|
| Hosting | Netlify (free plan) | Free |
| Contact form | Netlify Forms (100 submissions/month) | Free |
| Database | Firebase Firestore | Free |
| Owner login | Firebase Authentication (email/password) | Free |
| Analytics | Custom counters in Firestore | Free |
| Fonts | Google Fonts (Orbitron + Inter) | Free |
| Code | Single HTML file, CSS and JS inline | - |

**Monthly running cost: $0** (only the domain has a yearly fee).

### How the pieces connect
- **Netlify Forms:** the form tag has the `netlify` attribute and a hidden `form-name` field. Netlify detects it on deploy and logs every submission under Forms > contact. Email alerts are set up in the Netlify dashboard (Forms > contact > Form notifications). The page submits with `fetch('/')` so there is no redirect.
- **Firestore:** three collections. `settings/main` holds the closed flag and the announcements list (every visitor listens with `onSnapshot`, so changes show up live). `submissions` stores a copy of each form entry for the owner dashboard. `analytics/main` holds a total visit counter and one counter per day.
- **Firebase Auth:** the owner password lives in Firebase, never in the source code.
- **Custom domain:** `needhamautocleaning.com` was bought through Netlify's built-in registrar, so DNS and the free Let's Encrypt SSL certificate are handled automatically. `www` redirects to the main domain and the `netlify.app` address stays active. If a "Not secure" warning ever shows up, use Netlify > Domain management > SSL/TLS certificate > Verify DNS configuration.

## Folder Layout

```
NAC_web/
  output/               <- everything that gets deployed
    index.html          <- the whole site (HTML, CSS and JS in one file)
    announcements.html  <- full announcements history page
    showcase1.jpg       <- gallery photo
  pictures/             <- spare folder for source photos (not deployed)
  tests/
    test_site.js        <- static Node.js test suite (132 checks)
  README.md
```

## Run and Test Locally

Open `output/index.html` in a browser, or serve the folder so the page behaves more like the live site:

```
cd output
py -m http.server 8000
```

Then visit http://localhost:8000. Firebase features (announcements, login, stats) talk to the real backend. The contact form only delivers through Netlify, so test it on the live site.

Run the tests (Node.js only, no install needed):

```
node tests/test_site.js
```

The tests read the HTML files as text and check structure, real content, the form, CSS, JS (including a "no `let`/`const`" rule), navigation and the owner login. They do not open a browser or touch Firebase.

## Updating the Site

- **Announcements, closed banners:** use the owner dashboard on the live site. No code change or deploy needed.
- **Text, prices, photos, reviews:** edit `output/index.html` (add new images to `output/`), run the tests, then deploy.
- **Deploy:** drag the `output/` folder onto the site in the Netlify dashboard. One drag updates the live site.
- **Code style:** keep everything inside `index.html`, use `var` (the tests enforce it), and reuse the CSS variables in `:root` (brand cyan `#00cfff` on a dark navy background) so dark/light mode keeps working.

## Current Status

- Live on the custom domain since April 2026, current version **v1.3** (Firebase backend, owner login, analytics, map, season banner, Facebook link). The full version history is in the footer changelog.
- Contact form, announcements, closed toggles, submissions viewer and stats all work on the live site.
- Gallery has one real photo; the other slots and the three reviews are placeholders waiting for real customer photos and reviews.
- Firestore security rules are still in open test mode and should be locked down (owner-only writes to settings, public writes only to submissions).
- The Booking Manager button in the dashboard is a disabled placeholder.
- Test suite: 129 of 132 pass. The 3 failures are announcements-page checks that expect static announcement cards, which the page no longer hard-codes.

## What I Learned

- Building and handing off a full website for a real client
- Firebase Firestore reads, writes and real-time listeners from the browser
- Firebase Authentication for a secure owner login
- Netlify Forms and custom domain setup
- Responsive CSS layouts (mobile + desktop)
- Building an admin dashboard inside a website

---

Planning and spec docs live outside this repo in the owner's workspace docs folder.
