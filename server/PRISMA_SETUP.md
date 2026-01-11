# Prisma Setup Guide

## Prerequisites

1. PostgreSQL database installed and running
2. Database created (e.g., `44ever`)

## Setup Steps

### 1. Configure Database URL

Update the `.env` file (or create it from `.env.example`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/44ever?schema=public"
```

Replace:
- `USER` with your PostgreSQL username (usually `postgres`)
- `PASSWORD` with your PostgreSQL password
- `44ever` with your database name

### 2. Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma Client based on your schema.

### 3. Run Database Migrations

```bash
npm run db:migrate
```

This will:
- Create all tables in your database
- Set up indexes
- Create the database schema

### 4. Seed Initial Data (Optional)

```bash
npm run db:seed
```

Or the data will be automatically seeded when you start the server.

### 5. Start the Server

```bash
npm run dev
```

## Prisma Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed initial data

## Prisma Studio

Prisma Studio provides a visual interface to view and edit your database:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Add, edit, and delete records
- Query data visually

## Schema Changes

When you modify `prisma/schema.prisma`:

1. Generate Prisma Client:
   ```bash
   npm run db:generate
   ```

2. Create and apply migration:
   ```bash
   npm run db:migrate
   ```

## Troubleshooting

### "Prisma Client not generated"
Run: `npm run db:generate`

### "Database connection failed"
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database exists

### "Migration failed"
- Check database permissions
- Ensure database is empty or use `prisma migrate reset` (WARNING: deletes all data)

## Production

For production:
1. Use environment variables for `DATABASE_URL`
2. Run migrations before deploying
3. Generate Prisma Client in your build process
4. Use connection pooling (Prisma handles this automatically)
