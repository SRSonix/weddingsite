# Wedding Website — Project Overview

## What This Is

A wedding RSVP management website. Guests receive personalized invite links and can submit RSVPs, manage family members, and set dietary/language preferences. Admins can create/manage guests, view attendance statistics, and export guest lists as CSV.

## Monorepo Structure

```
weddingsite/
├── api/            # PHP REST API backend
├── app/            # React/TypeScript SPA frontend
├── deployment/     # Node.js FTP deployment scripts
├── ddl/            # MySQL schema (DDL files)
├── tools/          # Python/Jupyter data analysis
└── compose.yaml    # Docker Compose for local dev
```

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Frontend    | React 19, React Router 7 (SPA), TypeScript, Tailwind CSS 4, Vite, i18next |
| Backend     | PHP (custom router, no framework), JWT auth     |
| Database    | MySQL 8.2.0                                     |
| Deployment  | Docker Compose (local), FTP upload (production) |

## Frontend Pages & Routes

| Route       | Component           | Access   | Purpose                        |
|-------------|---------------------|----------|--------------------------------|
| `/`         | index.tsx           | Public   | Event info, agenda, RSVP       |
| `/login`    | login.tsx           | Public   | Token-based login              |
| `/admin`    | admin.tsx           | Admin    | Guest management, statistics   |
| `/imprint`  | imprint.tsx         | Public   | Legal                          |

### Frontend State Management
- `userProvider.tsx` — current user context (login, logout, RSVP updates)
- `allUserProvider.tsx` — admin context (all users list)
- `userService.tsx` — API client and data models

## API Endpoints

```
Health:
  GET  /health

Auth:
  POST /auth/login              # Token → session cookie (7-day)
  POST /auth/logout

Current User:
  GET  /user                    # Get own user data
  PUT  /user/:id/rsvp           # Update RSVP (attendance, email, language)
  PUT  /user/:id/core-info      # Update name/role (admin only)

Admin — Users:
  GET    /users                 # All users
  POST   /user                  # Create user
  PUT    /user/:id/reset-token  # Regenerate invite token
  DELETE /user/:id              # Delete user (can't delete self)

Family Members:
  POST   /user/:id/family-member
  PUT    /user/:id/family-member/:fid
  DELETE /user/:id/family-member/:fid

Info (public):
  GET /info/overview
  GET /info/agenda
  GET /info/payment-details

Images:
  GET /image/:path
```

## Auth Model

- Admin creates a user → one-time invite token generated
- Guest visits `/login?token=<token>` → frontend calls `POST /auth/login`
- Backend validates token, sets httponly session cookie
- `resolve_user` middleware validates cookie on every subsequent request
- Two roles: `USER` and `ADMIN`

## Deploying to Production

the deployment is to be done by the user and **never** by the agent.

## DDL / Database Migrations

DDL migrations are **never** to be applied by the agent under any circumstance. 

## Testing
The database test setup is done in  `api/tests/BaseTestCases.php` In case of schema changes these must be reflacted there.

tests can only be run when the user has started the database. 
If the agent needs to run tests, as the user for permission first.

**Never remove test cases** without explicit permission from the user.

Run from the `api` folder:
```sh
DB_SERVER=127.0.0.1 ./vendor/bin/phpunit
```

## Translations

Supported languages: **German (de)** and **French (fr)**. English and Spanish are not supported.

**Rule: TSX files must only contain English text.** All user-visible strings must use `t("key", "English fallback text")`. The English fallback string is the source of truth for what the English text should say, and makes missing translations immediately visible when browsing without a language set.

Translation files are served as static JSON and cached by the browser. After adding or changing translations, bump the `v` query param in `app/app/root.tsx` (`queryStringParams: { v: 'N' }`) to force clients to re-fetch.