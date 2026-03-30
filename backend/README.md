# NextFlow Backend

Express + TypeScript REST API with Trigger.dev tasks.

## Setup
```bash
npm install
npx prisma migrate dev --name init
npx prisma generate
```

## Development
```bash
# Run API server
npm run dev

# Run Trigger.dev task runner (separate terminal)
npm run trigger:dev
```

## Environment Variables
Copy `.env.example` to `.env.local` and fill in all values.
