# PostgreSQL Database Setup Guide

## Prerequisites

1. Install PostgreSQL on your system:
   - **Windows**: Download from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql` or download from [PostgreSQL Downloads](https://www.postgresql.org/download/macosx/)
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib` (Ubuntu/Debian)

2. Start PostgreSQL service:
   - **Windows**: PostgreSQL service should start automatically
   - **macOS**: `brew services start postgresql`
   - **Linux**: `sudo systemctl start postgresql`

## Database Setup Steps

### 1. Create Database

Open PostgreSQL command line (psql) or use pgAdmin:

```sql
CREATE DATABASE "44ever";
```

Or via command line:
```bash
createdb 44ever
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=44ever
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 3. Run Database Initialization

The database schema and initial data will be automatically created when you start the server:

```bash
npm run dev
```

The server will:
- Create all necessary tables (products, customers, orders, franchise_applications)
- Create indexes for better performance
- Seed initial product data if the database is empty

## Database Schema

### Tables

1. **products** - Product catalog
   - id, name, category, price, image, images[], rating, featured, description

2. **customers** - Customer information
   - id, name, email, phone, address (JSONB)

3. **orders** - Order records
   - id, order_number, customer_id, items (JSONB), shipping (JSONB), payment (JSONB), total, status, notes

4. **franchise_applications** - Franchise inquiries
   - id, first_name, last_name, email, phone, company, location, investment_range, experience, message, status, notes

## Manual Schema Creation (Optional)

If you want to create the schema manually:

```bash
psql -U postgres -d 44ever -f database/schema.sql
```

## Troubleshooting

### Connection Issues

1. **"Connection refused"**
   - Check if PostgreSQL service is running
   - Verify DB_HOST and DB_PORT in `.env`

2. **"Authentication failed"**
   - Verify DB_USER and DB_PASSWORD in `.env`
   - Check PostgreSQL authentication settings in `pg_hba.conf`

3. **"Database does not exist"**
   - Create the database: `createdb 44ever`

### Reset Database

To reset the database (WARNING: This will delete all data):

```sql
DROP DATABASE "44ever";
CREATE DATABASE "44ever";
```

Then restart the server to reinitialize.

## Production Considerations

For production:
1. Use strong database passwords
2. Enable SSL connections
3. Set up connection pooling
4. Regular database backups
5. Monitor database performance
6. Use environment-specific database credentials
