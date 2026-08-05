# ACD — Association of Community Development, website

A hand-built static site (plain HTML/CSS/JS — no build step, no framework) for
Association of Community Development, replacing the placeholder acdindia.org.

## What changed vs. the old site

Every stat, story, program and team member on the old site was templated/fake
(fake team names, fake city testimonials, "0" counters, a fabricated Swiggy
partnership, made-up donation progress bars). This rebuild uses **only**
verified facts from ACD's own answers and real field photos:

- Location corrected: **Prayagraj, Uttar Pradesh** (the old site said "Lucknow").
- Real programs only: Boatmen's Children School (Handia, Prayagraj), Emergency
  Relief Response, School Sanitation Renovation.
- Real numbers: 300+ children enrolled, 100+ boatmen families, 500+ relief
  kits, 12+ districts, active since 2025.
- Real team: Ashish Singh, Founder — no fabricated staff.
- Real photos only, pulled from ACD's own WhatsApp/field archive
  (`assets/images/`). Two supplied images were deliberately **not** used on
  public pages because they read as generic stock photography rather than
  ACD's own work (a disaster stock photo and a staged handshake photo) — using
  them would repeat the exact "inauthentic imagery" problem flagged in the
  brief. They're still safe to swap in later if you confirm they're genuinely
  ACD's.

## Still needs from you before launch

1. **Bank/UPI details** — not provided, so the Donate page routes people to
   WhatsApp/email instead of publishing account details. Once you share them,
   they can go straight on `get-involved/index.html` in the `.donate-method-card`.
2. **Registration / 80G / FCRA status** — the old site claimed 80G tax
   exemption and "Registered NGO under Section 12A"; this rebuild does **not**
   repeat that claim because it wasn't confirmed in your answers, and it's a
   legal statement donors and regulators rely on. Confirm your registration
   type and number and it can be added properly (with the certificate, ideally).
3. **Logo file** — the header/footer currently use a hand-redrawn SVG of your
   mark (`assets/logo.svg`, `assets/mark.svg`) since no clean source file was
   available. Swap in the original AI/vector file whenever you have it.
4. **Payment gateway** — intentionally not built. The brief calls for a
   static site with static bank/UPI info, no gateway. If you later want real
   online checkout, Razorpay Payment Buttons/Links can be embedded without a
   server — but that requires ACD to have a verified Razorpay merchant
   account first.

## Structure

Plain folders, each with its own `index.html`, so GitHub Pages serves clean
URLs with no `.html` and no `.htaccess` (which GitHub Pages doesn't support —
it isn't Apache):

```
/               → index.html
/about/         → about/index.html
/what-we-do/    → what-we-do/index.html
/stories/       → stories/index.html
/get-involved/  → get-involved/index.html
/contact/       → contact/index.html
/404.html       → GitHub Pages' custom not-found page
```

All CSS/JS/images are linked with **relative paths**, so this works whether
the repo is published as a user page at the domain root
(`https://<name>.github.io/`) or as a project page under a subpath
(`https://<name>.github.io/<repo>/`) — no path edits needed either way.

## Forms

The newsletter, volunteer and contact forms post to
[FormSubmit](https://formsubmit.co/) → `acdindiafoundation@gmail.com` — a free
static-form email relay, no backend required. **First submission from each
form needs a one-time confirmation click** in that inbox to activate it.

## Deploying to GitHub Pages

```bash
cd /Users/igaime/Development/TechPose/ACD
git init -b main   # already done
git add -A
git commit -m "ACD website"
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then in the repo's **Settings → Pages**, set the source to the `main` branch,
root folder. If using a custom domain (e.g. `acdindia.org`), add a `CNAME`
file with just the domain in it, and point your DNS accordingly.

## Local preview

```bash
cd /Users/igaime/Development/TechPose/ACD
python3 -m http.server 8000
# open http://localhost:8000
```
