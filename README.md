# Fiscal Bharat

Production website and client management platform for **Fiscal Bharat – A venture by Israni Consultancies**.

This is a Next.js App Router application with:

- Public website (Home, About Us, Our Services, Testimonials, Contact Us)
- Client portal at `/client/login`
- Admin portal at `/admin/login`
- TiDB Cloud (MySQL) via Prisma
- Cloudinary for logos and client documents
- Session cookies (HttpOnly, Secure in production)

Docker is not used.

## Local setup (Windows)

1. Install Node.js 20 or newer.
2. Copy environment variables:

```powershell
copy .env.example .env
```

3. Fill `.env`:

- `DATABASE_URL` and `DIRECT_URL` from [TiDB Cloud](https://tidbcloud.com/) (MySQL connection string, TLS enabled).
- `AUTH_SECRET` — a long random string.
- `CLOUDINARY_*` from your Cloudinary dashboard.
- Leave `INITIAL_ADMIN_USERNAME` / `INITIAL_ADMIN_PASSWORD` as provided for first seed only.

4. Install and prepare the database:

```powershell
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin login: `/admin/login`  
Client login: `/client/login` (accounts are created by an administrator).

The first admin login must change the initial password.

## Environment variables

See `.env.example`. None of these values belong in frontend source code.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma runtime connection to TiDB |
| `DIRECT_URL` | Direct TiDB URL for migrations |
| `AUTH_SECRET` | Signs session token hashes |
| `INITIAL_ADMIN_USERNAME` | Seed-only admin username |
| `INITIAL_ADMIN_PASSWORD` | Seed-only admin password |
| `CLOUDINARY_CLOUD_NAME` | Cloud storage |
| `CLOUDINARY_API_KEY` | Cloud storage |
| `CLOUDINARY_API_SECRET` | Cloud storage |
| `NEXT_PUBLIC_APP_URL` | Canonical app URL |

Without Cloudinary, the public site and logins still work, but logo and document uploads will return a configuration error until the Cloudinary variables are set.

## Vercel deployment

1. Push this folder as its own Git repository.
2. Import the project in Vercel (Framework Preset: Next.js).
3. Add every variable from `.env.example` to the Vercel project.
4. Set `NEXT_PUBLIC_APP_URL` to the production domain, for example `https://www.fiscalbharat.com`.
5. Deploy. The build runs `prisma generate` then `next build`.
6. After the first successful deploy, run migrations and seed once:

```powershell
npx prisma migrate deploy
npm run db:seed
```

You can also add `prisma migrate deploy` to the Vercel build command if you prefer migrations on every deploy:

```
prisma generate && prisma migrate deploy && next build
```

Do not use SQLite, local JSON, or the Vercel filesystem for documents.

## Security notes

- Passwords are hashed with bcrypt. Temporary client passwords are shown only at creation or reset.
- Document downloads go through `/api/documents/[id]` with role checks and short-lived Cloudinary signed URLs.
- Clients cannot open another client’s files by guessing IDs.
- There is no public admin registration page.
- Login attempts are rate-limited after 5 failures in 15 minutes.

## Project layout

```
src/app/           Public pages, portals, API routes
src/app/actions/   Server actions
src/components/    UI, public site, portal chrome
src/lib/           Prisma, auth, storage, validation
prisma/            Schema, migrations, seed
```
