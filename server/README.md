To generate a well-documented README for the server directory, I need to review the contents of the server/ folder in your repo. I’ll scan for configuration files, entry points, major modules, and any documentation or code comments to accurately describe how the backend works, its setup, and usage.

Let me start by listing the files and folders inside server/ to get an overview.Here’s a detailed and well-structured README draft for the server directory of the TsangRealEstate project. This is based on the available files and inferred architecture. For a complete list of all files, please visit the server/src directory on GitHub: server/src directory on GitHub.

---

# TsangRealEstate Server

This is the backend server for the TsangRealEstate application, providing APIs, database management, scraping utilities, authentication, and email/meeting integrations.

## Table of Contents

- [Features](#features)
- [Directory Structure](#directory-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Key Dependencies](#key-dependencies)
- [API & Scraping](#api--scraping)
- [Email & Meeting Templates](#email--meeting-templates)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- RESTful API using Express.js
- MongoDB database integration (with Mongoose)
- Apartment data scraping (using Puppeteer, Cheerio)
- File uploads (Cloudinary, Multer)
- Email notifications (Nodemailer)
- Meeting invites (Calendly integration)
- Handlebars templates for emails
- Secure environment variable management

---

## Directory Structure

```
server/
├── .env.example                # Example environment variables
├── package.json                # Project metadata and scripts
├── package-lock.json           # Exact dependency versions
├── dropbox_matches.json        # Dropbox data mapping (purpose inferred)
├── src/
│   ├── app.js                  # App initialization and main logic
│   ├── index.js                # Entry point for server
│   ├── dropbox.js              # Dropbox integration/utilities
│   ├── controllers/            # API/business logic controllers
│   ├── config/                 # Configuration files (DB, services)
│   ├── database/               # Database connection and models
│   ├── models/                 # Mongoose schemas (inferred)
│   ├── routes/                 # Express route definitions
│   ├── scraper/                # Scraping scripts
│   ├── utils/                  # Utility functions
│   └── NewScrape/              # Additional/new scraping modules
├── views/
│   ├── meeting-invite.hbs      # Handlebars template for meeting invites
│   ├── submission-notification.hbs # Template for submission notifications
│   └── units-email.hbs         # Template for unit-related emails
└── .gitignore
```
> Note: For a full directory listing, see the [src folder](https://github.com/Asin-Junior-Honore/TsangRealEstate/tree/p2/server/src).

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Asin-Junior-Honore/TsangRealEstate.git
   cd TsangRealEstate/server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill out your actual credentials and configuration.

4. **Start the development server:**
   ```bash
   npm run devStart
   ```
   Or to start in production mode:
   ```bash
   npm start
   ```

---

## Environment Variables

Configure the following in your `.env` file (see `.env.example` for more):

| Variable                  | Purpose                                 |
|---------------------------|-----------------------------------------|
| DB_URL, MONGODB_URI       | MongoDB connection strings              |
| CALENDLY_TOKEN, CALENDLY_EVENT_LINK | Calendly integration         |
| EMAIL_USER, EMAIL_PASS    | Email sending credentials               |
| ADMIN_SECRET              | Secret for admin authentication         |
| CLIENT_URL                | URL of the client application           |
| CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET | Cloudinary credentials |

---

## Scripts

Defined in `package.json`:

- `npm run devStart` — Start server with nodemon for auto-reload.
- `npm start` — Start server.
- `npm run scrape:apartments` — Scrape apartment listings.
- `npm run scrape:newapartments` — Run new scraping logic (via `app.js`).

---

## Key Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **puppeteer**: Headless browser for scraping
- **cheerio**: jQuery-like DOM parsing for scraping
- **axios**: HTTP requests
- **cloudinary**, **multer**, **multer-storage-cloudinary**: File uploads
- **nodemailer**: Email sending
- **dotenv**: Environment variables
- **hbs**: Handlebars template engine
- **cors**: Cross-origin resource sharing
- **node-fetch**: Fetch API for Node.js

---

## API & Scraping

- Main server code is in `src/index.js` and `src/app.js`.
- API routes are defined under `src/routes/`.
- Controllers implementing business logic are under `src/controllers/`.
- Data scraping scripts are in `src/scraper/` and possibly `src/NewScrape/`.
- Dropbox-specific logic in `src/dropbox.js`.

---

## Email & Meeting Templates

Handlebars templates in `views/` are used to send rich HTML emails:

- [`meeting-invite.hbs`](https://github.com/Asin-Junior-Honore/TsangRealEstate/blob/p2/server/views/meeting-invite.hbs)
- [`submission-notification.hbs`](https://github.com/Asin-Junior-Honore/TsangRealEstate/blob/p2/server/views/submission-notification.hbs)
- [`units-email.hbs`](https://github.com/Asin-Junior-Honore/TsangRealEstate/blob/p2/server/views/units-email.hbs)

---

## Contributing

1. Fork the repository, create a feature branch.
2. Make your changes with clear commit messages.
3. Push to your branch and create a Pull Request.

---

## License

This project is licensed under the ISC License.

---

> For additional details or to explore all files, visit the [server/src directory](https://github.com/Asin-Junior-Honore/TsangRealEstate/tree/p2/server/src).

---

Let me know if you'd like to include API endpoint documentation, contribution guidelines, or anything else specific!