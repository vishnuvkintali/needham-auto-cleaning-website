# Custom Domain Setup — Needham Auto Cleaning
**Completed April 2026**

---

## Result

Site is live at **needhamautocleaning.com**
Old URL still works: needham-auto-cleaning.netlify.app

---

## What Was Done

Purchased `needhamautocleaning.com` directly through Netlify's built-in domain registrar. Netlify handles both the domain and hosting, so DNS and SSL are configured automatically — no manual nameserver setup needed.

**Cost:** $14 first year (30% intro discount), $20/year after that. Auto-renews annually.

---

## How It Was Set Up

### Step 1 — Purchase through Netlify
1. Log in to **netlify.com** with the NAC Gmail account
2. Open the NAC site → **Domain management**
3. Click **Add a domain**
4. Search `needhamautocleaning.com` and purchase through Netlify
5. Netlify registers the domain and connects it to the site automatically

### Step 2 — DNS Propagation
- Netlify sets up DNS automatically
- Takes 10–30 minutes to propagate globally
- Both `needhamautocleaning.com` and `www.needhamautocleaning.com` are configured
- `www` auto-redirects to the primary domain

### Step 3 — SSL Certificate
- Netlify auto-provisions a free SSL certificate via Let's Encrypt
- If "Not secure" warning appears after DNS propagates: Netlify → Domain management → SSL/TLS certificate → **Verify DNS configuration**
- Certificate finishes within 10–15 minutes after that
- Lock icon appears in browser once complete

---

## Current Domain Setup (in Netlify)

| Domain | Status | Notes |
|---|---|---|
| `needham-auto-cleaning.netlify.app` | Active | Original Netlify subdomain, stays active |
| `needhamautocleaning.com` | Primary domain | Where everyone goes |
| `www.needhamautocleaning.com` | Redirect | Auto-redirects to primary |

---

## What Still Works After Domain Change

Everything. The domain is just a new address — the site is still hosted on Netlify.

| Feature | Status |
|---|---|
| Netlify Forms (contact form) | Works — submissions still appear in Netlify dashboard |
| Firebase announcements | Works — Firestore is independent of domain |
| Firebase login / owner dashboard | Works |
| Firebase analytics | Works |
| Email notifications for form submissions | Works |
| Old netlify.app URL | Still active |

---

## Renewal

- **Renews:** April 2027 at $20/year
- **Auto-renew:** On by default — Squarespace/Netlify will charge the saved payment method
- **Reminder email:** Sent to NAC Gmail before renewal date
- No action needed unless you want to cancel

---

## Registrar Info

| Field | Value |
|---|---|
| Registrar | Squarespace (via Netlify) |
| Account | needham.auto.cleaning@gmail.com |
| Domain | needhamautocleaning.com |
| Registered | April 2026 |
| Renews | April 2027 |
| Price | $20/year ($14 first year) |

---

## If Something Breaks

**Site not loading at .com:**
- Check Netlify → Domain management — confirm DNS shows as active (not "propagating")
- Wait up to 2 hours for full global propagation

**"Not secure" warning:**
- Go to Netlify → Domain management → SSL/TLS certificate → click **Verify DNS configuration**
- Wait 10–15 minutes

**Domain expires:**
- Log in to Netlify with NAC Gmail → Domains → renew
- Site will go down if domain lapses — don't let auto-renew lapse
