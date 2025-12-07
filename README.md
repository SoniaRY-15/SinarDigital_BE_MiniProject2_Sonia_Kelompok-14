# Pet Adoption API (Prisma + Uploads)

NOTE: Helped by AI (github copilot), maaf ya kak saya masih kurang mengerti

---

## Features

- Prisma ORM (Postgres / MySQL / SQLite supported)
- Models: User and Pet (1-to-many relationship)
- Full CRUD for Pet (Create / Read / Update / Delete)
- Image upload for pets (stored in `/uploads`, path saved to DB)
- HTML form page at `/adopt` for manual submissions
- Pagination support on GET /pets
- Seeder to create sample users & pets

---

## File / Folder Highlights

- server.js — app entry
- src/app.js — Express setup
- src/routes/index.js — home, /adopt, and mounts Pet routes
- src/routes/petRoutes.js — Pet & User endpoints
- src/controllers/* — controllers for Pet and User logic
- src/middlewares/upload.js — multer setup (uploads/)
- src/prisma/schema.prisma — Prisma schema
- src/prisma/seed.js — seed script (faker)
- uploads/ — uploaded images (gitignored)
- .env.example — example env vars

---

## Prerequisites

- Node.js (16+ recommended)
- npm
- One of:
  - PostgreSQL (recommended)
  - MySQL
  - OR you can use SQLite for quick local testing

---

## .env and .env.example

- Copy `.env.example` to `.env` and edit DATABASE_URL and PORT as needed.
- Example `.env` choices:
  - PostgreSQL:
    `DATABASE_URL="postgresql://postgres:password@localhost:5432/pet_adoption_db?schema=public"`
  - MySQL:
    `DATABASE_URL="mysql://root:password@localhost:3306/pet_adoption_db"`
  - SQLite (quick test):
    `DATABASE_URL="file:./dev.db"`

Do NOT commit `.env` to your repo.

---

## Install & Setup

1. Install dependencies
   ```
   npm install
   ```

2. Generate Prisma client
   ```
   npx prisma generate
   ```

3. Create / apply migrations (first migration)
   ```
   npx prisma migrate dev --name init
   ```
   - If you prefer to push schema without creating migration files:
     ```
     npx prisma db push
     ```

4. Seed the database (creates sample users & pets)
   ```
   npm run prisma:seed
   ```
   or
   ```
   node src/prisma/seed.js
   ```

5. Start the server
   ```
   npm run dev
   ```
   or
   ```
   npm start
   ```

Server will run at: `http://localhost:3000` (or the PORT in your `.env`).

---

## Routes / API

- GET `/`  
  - Home JSON message (multi-line array)

- GET `/adopt`  
  - HTML form to create a pet (multipart/form-data)

- GET `/pets`  
  - List pets (supports query `?page=1&limit=10`)

- GET `/pets/:id`  
  - Get pet details by id

- POST `/pets`  
  - Create pet (multipart/form-data for image)  
  - Fields (form-data):
    - `name` (text, required)
    - `type` (text, required)
    - `ageYears` (number, default 0)
    - `ageMonths` (number, 0–11, default 0)
    - `reason` (text, required)
    - `ownerId` (number, required — reference to User id)
    - `image` (file, optional)
  - Example JSON body (no image):
    ```json
    {
      "name": "Buddy",
      "type": "Dog",
      "ageYears": 0,
      "ageMonths": 6,
      "reason": "Rescued from shelter",
      "ownerId": 1
    }
    ```

- PUT `/pets/:id`  
  - Update pet (multipart/form-data for image replacement)
  - If you upload a new `image`, the old image file will be removed from `/uploads`.

- DELETE `/pets/:id`  
  - Delete pet record and its image file (if present)

- User endpoints (optional)
  - GET `/users`
  - POST `/users`
  - GET `/users/:id`

---

## Uploads / Images

- Uploaded images are saved to the `uploads/` folder.
- The DB stores the relative path (e.g. `/uploads/image-12345.jpg`).
- The `/uploads` folder is served statically — image URLs can be accessed at `http://localhost:3000/uploads/<filename>`.
- `uploads/` is included in `.gitignore` to avoid committing binary files.

---

## Seeder

- The seeder uses `@faker-js/faker` to create sample users and ~20 pets.
- Run: `npm run prisma:seed` or `node src/prisma/seed.js`.

---

## Troubleshooting

- "Cannot find module 'dotenv'": run `npm install dotenv`
- Prisma DB connection errors: check `DATABASE_URL` in `.env`, ensure DB server is running.
- Want a quick test without DB server? Use SQLite: `DATABASE_URL="file:./dev.db"` then `npx prisma db push`.
- If migrations fail, check the exact error and confirm credentials & database existence.

---

## Quick Commands

- Install: `npm install`
- Prisma generate: `npx prisma generate`
- Migrate: `npx prisma migrate dev --name init`
- Seed: `npm run prisma:seed`
- Dev server: `npm run dev`
- Start: `npm start`
