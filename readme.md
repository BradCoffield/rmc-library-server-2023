---
title: ExpressJs server
description: A simple ExpressJS server
tags:
  - http
  - nodejs
  - javascript
  - json
  - serverless
  - vercel
---

# Vercel Serverless API

This project exposes Serverless Functions on Vercel. It previously ran as an Express server on Railway; routes have been refactored to `api/` handlers.

## Endpoints

- `GET /api` — Health check text response.
- `GET /api/test-async` — Demo async route (calls SWAPI and returns JSON or error).
- `POST /api/interlibrary-loan-request` — Accepts interlibrary loan payload, writes to Sanity, and sends two transactional emails via Brevo.

## Environment Variables

Set these in Vercel Project Settings → Environment Variables (and locally via `.env` for `vercel dev`):

- `BREVO_API_KEY` — Brevo (Sendinblue) API key
- `SANITY_SECRET_TOKEN` — Sanity write token for project `wzuhalz9` (dataset `production`)

## Run Locally

1. `npm install`
2. Install Vercel CLI if needed: `npm i -g vercel`
3. Create `.env` with the variables above
4. Start local serverless dev: `npm run dev` (alias for `vercel dev`)

## Deploy to Vercel

1. `vercel` — link or create the project, follow prompts
2. Add env vars in the Vercel dashboard (Production/Preview/Development as needed)
3. `vercel deploy` — or push to the connected Git repo to trigger auto-deploys

## Notes

- The legacy `index.js` Express server is no longer used for deployment. All routes live under `api/`.
- `brevo/send-interlibrary-loan-emails.mjs` and `sanity/send-interlibrary-request-data-to-sanity.mjs` are awaitable so calls finish before the function returns (required on serverless).