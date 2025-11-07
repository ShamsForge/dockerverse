# Dockerverse — Run Docker containers from a web app

This repository contains a minimal React + TypeScript web app (Vite) that provides a UI for running and managing Docker containers (pods, images, container actions and logs). The webapp is designed to interact with a backend that controls Docker on the host — the repository contains the frontend shell and documentation to wire it into a Docker control service.

## Table of context
1. [Project Overview](#project-overview)
2. [How to setup](#how-to-setup)
3. [Tech Stack](#tech-stack)

---

## Project Overview

This project is a frontend web application (React + Vite + TypeScript) intended to manage Docker resources from an intuitive web UI. It provides screens for:

- Landing Website
- Dashboard (Pods, Docker Images)
- Pod detail (Container actions: Start, Stop, Delete, Run command)
- Container logs viewer

The diagram in `docs/dockerverse.drawio` / `docs/dockerverse.drawio.html` illustrates the intended site structure and main UI flows (Landing → Signup/Login → Pods / Images → Pod detail → Container actions & logs). Use the link below to view the exported HTML diagram in a browser or a markdown viewer that supports embedding local HTML.

Diagram (open locally):

<object type="text/html" data="docs/dockerverse.drawio.html" width="100%" height="600px">If the diagram does not render here, <a href="/docs/dockerverse.drawio.png">open the diagram</a> in your browser or VS Code.</object>

---

## How to setup

Quick setup — choose one:

## 1. Manual

  - Clone the repo, install dependencies and start the dev server (copy/paste into PowerShell):

  ```powershell
  git clone <repo-url>
  cd <repo-dir>
  npm install
  npm run start
  ```

  - Or install then run the supplied batch helper:

  ```powershell
  git clone <repo-url>
  cd <repo-dir>
  npm install
  start-dev.bat
  ```

## 2. Double-click .bat file (Windows)

  - Double-click `start-dev.bat` from the repository root. The script will change to the repo folder, run `npm install` (if needed) and then `npm run start`.

  - To run it from PowerShell instead of double-clicking:

  ```powershell
  & .\start-dev.bat
  ```

---

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node, Express, Go(Future APIs)
- Database: Postgresql
- Toolings: React Router, Zustland(Future)
- Bundler: Vite
- Linting: ESLint (config provided in `eslint.config.js`)
- Dev server: npm scripts defined in `package.json`

For more details, see the original README content below (unchanged).

---

> # Next.js + TypeScript + React Compiler

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
