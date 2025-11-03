# FileSure Referral Frontend (Next.js)

This is the Next.js + TypeScript + Tailwind frontend for the FileSure referral & credit system.

## Tech
- Next.js (App Router) + React 18 + TypeScript
- Tailwind CSS
- Zustand for auth state
- Axios for API calls
- Zod for client-side validation

## Getting Started

1) Install deps

```bash
cd client
npm install
```

2) Configure API base URL

Create `.env.local` in `client/` (optional, defaults to `http://localhost:4000/api`):

```bash
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
```

3) Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

## Pages
- `/` Landing
- `/register` Accepts `?r=REFERRALCODE` and POSTs to `/api/auth/register`
- `/login` Logs in via `/api/auth/login`
- `/dashboard` Authenticated; shows metrics via `/api/dashboard` and simulates purchase via `/api/purchase`

## Notes
- Auth token and user are persisted in `localStorage` under `fs_token` and `fs_user`.
- Copy referral link button uses `navigator.clipboard`.


