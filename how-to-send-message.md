# How to Make "Send Message" Actually Send an Email

Right now when someone fills out the form and hits "Send Message", it shows "Sent!" but nothing actually goes anywhere. The form is just a front-end visual — it has no back-end to process or deliver the message.

To actually receive messages, you need a service that sits in the middle, takes the form data, and forwards it to your email. That service is **Formspree** — it's free, takes 5 minutes, and requires almost no coding.

**Free plan allows 50 submissions per month** — more than enough for a local car wash.

---

## Step 1 — Create a Formspree account

- Go to **formspree.io**
- Click "Get Started" and sign up using `needham.auto.cleaning@gmail.com`
- Confirm your email when they send you a verification link

---

## Step 2 — Create a new form

- Once logged in, click **"+ New Form"**
- Name it `NAC Contact Form`
- Click Create
- Formspree gives you a unique endpoint URL that looks like:
  ```
  https://formspree.io/f/xxxxxxxx
  ```
- **Copy that URL** — you need it in the next step

---

## Step 3 — Update index.html

Open `output/index.html` and find this line (around line 188):
```html
<form class="contact-form reveal">
```

Replace it with:
```html
<form class="contact-form reveal" action="https://formspree.io/f/xxxxxxxx" method="POST">
```

Swap `xxxxxxxx` with your real Formspree ID from Step 2.

**What this does:** The `action` attribute tells the browser where to send the form data when someone hits submit. Now it goes to Formspree's server instead of nowhere.

---

## Step 4 — Update script.js

Open `output/script.js` and find the "CONTACT FORM SUBMIT" section at the bottom. Replace the whole block with this:

```js
// ===== CONTACT FORM SUBMIT =====
document.querySelector('.contact-form').addEventListener('submit', e => {
  const btn = e.target.querySelector('button');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
  }, 3000);
});
```

**What this does:** Formspree handles the actual sending. This code just updates the button so it says "Sending..." while it works. After 3 seconds it resets so it's ready for the next person.

---

## Step 5 — Verify your email with Formspree

After you deploy and someone submits the form for the first time, Formspree sends a confirmation email to `needham.auto.cleaning@gmail.com`. Click the link in that email. After that, every submission goes straight to the inbox automatically — no extra steps ever again.

---

## Step 6 — Redeploy to Netlify

Drag the `output` folder back onto Netlify to push the changes live.

---

## Done! What happens now:

1. Customer fills out the form and hits Send Message
2. The data goes to Formspree's server
3. Formspree instantly emails everything (name, phone, car type, service, message) to `needham.auto.cleaning@gmail.com`
4. Your brother sees it in Gmail and responds

---

## Why does the form even need this?

When you build a website with just HTML, CSS, and JavaScript, everything runs inside the visitor's browser. That's called the **front-end**. It can display things, animate, and respond to clicks — but it can't send emails on its own because browsers aren't allowed to do that for security reasons.

To send an email you need a **back-end** — a server running code outside the browser. Normally that means setting up your own server, which is complicated. Formspree is a service that provides that back-end for you, for free. You connect your form to them and they handle all the server-side work so you don't have to.
