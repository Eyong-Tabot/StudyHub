# StudyHub

StudyHub is a React learning dashboard with a PostgreSQL-backed Express API.

## Project structure

```text
StudyHub-react/
├── public/
├── src/
│   ├── components/
│   ├── features/
│   ├── assets/
│   ├── config.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
├── server/
│   ├── middleware/
│   ├── routes/
│   ├── db.js
│   ├── schema.sql
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── index.html
```

## Local setup

### 1. Create the PostgreSQL database

Create a PostgreSQL database named `studyhub`.

Then run `server/schema.sql` inside that database. The script creates the `users`, `courses`, and `tasks` tables, indexes, and starter courses.

### 2. Configure the backend

Copy `server/.env.example` to `server/.env` and fill in the PostgreSQL password and a long random `JWT_SECRET`.

Never commit `server/.env`.

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd server
npm install
```

### 5. Start the backend

From the `server` folder:

```bash
npm run dev
```

The API runs on `http://localhost:3000` by default.

### 6. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

The React application normally runs on `http://localhost:5173`.

## Frontend environment configuration

The root `.env.example` contains:

```env
VITE_API_URL=http://localhost:3000
```

For production, set `VITE_API_URL` to the deployed API origin before building the frontend.

## Security notes

- Passwords are hashed with bcrypt before storage.
- Authentication uses short-lived JWTs stored in HTTP-only cookies.
- Task endpoints require authentication and enforce user ownership at the database query level.
- Helmet supplies security-related HTTP headers.
- API requests are rate limited.
- SQL queries use PostgreSQL parameters instead of string concatenation.
- Real environment files are excluded from Git.
- HTTPS must be enabled by the production hosting layer.

## Useful commands

From the project root:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

From `server/`:

```bash
npm run dev
npm start
```
