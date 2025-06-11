# Tsang Real Estate

A modern real estate web application built with Next.js, React, and TypeScript, designed for efficient property browsing and management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Directory Structure](#directory-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)

## Features

- 🏠 Intuitive UI for property listings and details
- 🔎 Advanced search and filtering options
- 📅 Date handling for property availability
- 📦 Modular, scalable codebase with TypeScript
- 📋 Form validation and user input management
- ☁️ Ready for deployment on Netlify

## Tech Stack

- **Frontend Framework:** [Next.js](https://nextjs.org/) (v15+)
- **Language:** TypeScript, JavaScript
- **State & Forms:** React, React Hook Form, Yup (validation)
- **UI:** Tailwind CSS, React Icons, react-tailwindcss-datepicker
- **Drag-and-Drop:** @hello-pangea/dnd
- **Date Libraries:** date-fns, dayjs
- **HTTP Requests:** axios
- **Build & Lint:** ESLint, PostCSS, Tailwind CSS
- **Deployment:** Netlify

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Asin-Junior-Honore/TsangRealEstate.git
cd TsangRealEstate/client
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Production

Build and start the production server:

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Available Scripts

| Script  | Description                       |
| ------- | --------------------------------- |
| `dev`   | Start Next.js in development mode |
| `build` | Build for production              |
| `start` | Start production server           |
| `lint`  | Run ESLint checks                 |

## Directory Structure (Partial)

```
client/
├── .gitignore
├── eslint.config.mjs
├── netlify.toml
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public/
├── src/
├── tsconfig.json
```

- `src/`: Main source code (components, pages, utils, etc.)
- `public/`: Public assets
- `next.config.ts`: Next.js configuration
- `tsconfig.json`: TypeScript configuration
- `netlify.toml`: Netlify deployment settings

## Configuration

### TypeScript

- Strict mode enabled for type safety
- Path aliases set up (`@/*` → `src/*`)
- Plugins for Next.js development

### Next.js

- ESLint checks are ignored during build (`ignoreDuringBuilds: true`)
- Modern JS features enabled

### Dependencies

Refer to [`package.json`](https://github.com/Asin-Junior-Honore/TsangRealEstate/blob/p2/client/package.json) for the complete list.

## Deployment

This app is configured for deployment on Netlify. You can use the provided `netlify.toml` for custom build settings.
