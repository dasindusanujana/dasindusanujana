# Dasindu Sanujana — Portfolio

A cinematic, responsive personal portfolio built with HTML, CSS, and vanilla JavaScript.

## Hosting architecture

- **Frontend:** Cloudflare Pages serves the static site from `public/`.
- **Backend:** `backend/` contains PHP source prepared for a separate PHP host. Cloudflare Pages does not execute ordinary PHP files.
- The contact form remains visibly inactive until the PHP API is deployed and configured.

## Cloudflare Pages

- Production branch: `main`
- Build command: leave blank (or use `exit 0` if the dashboard requires a command)
- Build output directory: `public`
- Root directory: leave blank

## PHP backend preparation

Deploy `backend/api/contact.php` to a PHP 8+ host when available. Configure the environment variables `CONTACT_TO` and `CONTACT_FROM`, enable HTTPS, and configure PHP sessions. Review the host's mail delivery requirements before enabling the frontend form.

## Local preview

Serve the `public/` directory with any static HTTP server. The PHP API is not required to preview the frontend.

## Personal details

This repository intentionally avoids invented achievements, certificates, statistics, and unverified contact details. Add verified links and case studies when ready.
