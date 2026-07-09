# Crescend Media — Portfolio Website

Marketing/portfolio site for Crescend Media (Hyderabad, India): a homepage plus
five service detail pages, served by a lightweight Express server.

## Project structure

```
index.html          # Homepage (hero, about, services scroll-stack, portfolio, process, contact)
e-commerce.html     # Service page: E-Commerce Management
business-dev.html   # Service page: Business Development
web-design.html     # Service page: Website Development
campaigns.html      # Service page: Advertisement & Campaigns
rcm.html            # Service page: Revenue Cycle Management
support.js          # Client-side runtime that renders the in-page components
server.js           # Express server + clean URL routes
package.json        # Dependencies and scripts
metadata.json       # Project metadata
.env.example        # Env template (no variables required)
uploads/            # Reference media (not used by the live site)
```

## Run locally

**Prerequisite:** Node.js

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Routes

| URL              | File                |
| ---------------- | ------------------- |
| `/`              | `index.html`        |
| `/e-commerce`    | `e-commerce.html`   |
| `/business-dev`  | `business-dev.html` |
| `/web-design`    | `web-design.html`   |
| `/campaigns`     | `campaigns.html`    |
| `/rcm`           | `rcm.html`          |

All other files (`support.js`, `uploads/`, etc.) are served as static assets.
