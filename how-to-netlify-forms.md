# How to Switch to Netlify Forms

The code is already updated. You just need to redeploy and configure email notifications.

---

## Step 1 — Redeploy to Netlify

Drag the `output` folder onto Netlify like normal. Netlify automatically detects the `netlify` attribute on the form when it deploys and registers it.

---

## Step 2 — Confirm the form was detected

- Go to your Netlify dashboard at **netlify.com**
- Click on your site
- Go to **Forms** tab (in the top menu)
- You should see a form called **"contact"** listed there
- If it shows up, you're good — Netlify found it

If it doesn't show up, redeploy once more and check again.

---

## Step 3 — Set up email notifications

By default Netlify stores submissions in the dashboard but doesn't email you. To get an email every time someone submits:

- In your Netlify site dashboard, go to **Forms**
- Click on the **contact** form
- Click **Form notifications** (or go to Site Settings → Forms → Form notifications)
- Click **Add notification**
- Choose **Email notification**
- Enter `needham.auto.cleaning@gmail.com`
- Click Save

Now every submission emails that Gmail address automatically.

---

## Step 4 — Test it

- Open your live Netlify site
- Fill out the contact form and hit Send Message
- Check `needham.auto.cleaning@gmail.com` — the submission should arrive within seconds
- Also check the **Forms** tab in Netlify dashboard — it logs every submission there too

---

## Why Netlify Forms instead of Formspree?

- **100 free submissions/month** vs Formspree's 50
- **Already on Netlify** — no extra account or service to manage
- **Dashboard log** — every submission is saved in Netlify even if the email goes to spam
- **One attribute** — the only code change was adding `netlify` to the form tag
