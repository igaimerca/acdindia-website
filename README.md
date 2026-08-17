# ACD - Association of Community Development, website

A hand-built static site (plain HTML/CSS/JS - no build step, no framework) for
Association of Community Development, replacing the placeholder acdindia.org.

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
